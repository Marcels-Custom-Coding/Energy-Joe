import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { batteryNotes } from "../components/battery-notes";
import { dayText } from "../components/look-back";
import { timeOf } from "../components/plan-text";
import { tip } from "../components/tip";
import { pickEntity } from "../config";
import { define } from "../define";
import { entityName, formatNumber, formatState, type FilterName } from "../entities";
import type { TipName, Translate } from "../i18n";
import { shared } from "../styles/shared";
import {
  CONTROL_ROLES,
  MODE_MEANINGS,
  OPERATIONS,
  STEP_NAMES,
  type BatteryConfig,
  type BatteryFinding,
  type BatteryPreview,
  type ControlRole,
  type ControlStep,
  type HomeAssistant,
  type ModeMeaning,
  type OperationKey,
  type PreviewOperation,
  type PreviewParams,
  type PreviewRole,
  type PreviewStep,
  type ProbeResult,
  type StepName,
} from "../types";

export interface ControlValue {
  adapter: string;
  controls: BatteryConfig["controls"];
  mode_options: BatteryConfig["mode_options"];
  steps: BatteryConfig["steps"];
  /** The profile's prepare steps (set by withPrepare); sent along with the draft of the preview. */
  prepare?: ControlStep[];
}

type Choice = "watch" | "profile" | "generic" | "steps";

const ROLE_FILTER: Record<ControlRole, FilterName> = {
  min_soc: "level",
  charge_target: "level",
  grid_charge: "toggle",
  mode: "option",
  charge_power: "setpoint",
  discharge_power: "setpoint",
  discharge_limit: "setpoint",
  discharge_limit_enabled: "toggle",
  charge_limit: "setpoint",
  charge_limit_enabled: "toggle",
  system_charge_limit: "setpoint",
  system_charge_limit_enabled: "toggle",
  system_discharge_limit: "setpoint",
  system_manual_mode: "toggle",
  allow_charge: "toggle",
  allow_discharge: "toggle",
  block_charge: "toggle",
  block_discharge: "toggle",
};

/** The operations the owner may give own steps for (the watchdog uses block_*). */
const EDITABLE = new Set<string>(STEP_NAMES);
/** Operations whose absence costs something Joe does: what the summary warns about. */
const IMPORTANT: OperationKey[] = ["charge", "hold", "block", "cap"];
/** How long the dialog waits after a change before it asks for a new preview. */
const PREVIEW_DELAY = 300;
/** Texts that name the placeholders get them back as they are (the translator fills "{target}" from vars). */
const PLACEHOLDERS = { target: "{target}", power: "{power}", floor: "{floor}", percent: "{percent}" };

/** The control fields of a battery (what "Regler einrichten" changes). */
export function controlValue(battery: BatteryConfig): ControlValue {
  return {
    adapter: battery.adapter,
    controls: structuredClone(battery.controls),
    mode_options: structuredClone(battery.mode_options),
    steps: structuredClone(battery.steps),
  };
}

/**
 * The fields to save for a control value: a known profile brings the switches
 * it needs first ("prepare") and its service steps; other ways none.
 */
export function withPrepare(
  battery: BatteryConfig | undefined,
  value: ControlValue,
  found: BatteryFinding | undefined,
): ControlValue & { prepare: ControlStep[] } {
  const profile = !["none", "generic", "steps"].includes(value.adapter);
  const prepare = profile ? (battery?.adapter === value.adapter ? battery.prepare : (found?.prepare ?? [])) : [];
  const steps = profile && !Object.keys(value.steps).length ? (found?.steps ?? value.steps) : value.steps;
  return { ...value, steps, prepare: prepare ?? [] };
}

/** The message of a failed command (Home Assistant sends {code, message}). */
function messageOf(err: unknown): string {
  if (err instanceof Error) return err.message;
  const data = err as { message?: string; code?: string } | null;
  return data?.message || data?.code || String(err);
}

function isPlaceholder(value: unknown): value is string {
  return typeof value === "string" && /^\{\w+\}$/.test(value);
}

/**
 * The value an own step gets when the preview's steps are taken over: the
 * placeholder where the backend fills one in at run time ("{target}"), else
 * the value as shown. A number equal to one of the example's parameters stands
 * for that parameter.
 */
function ownValue(step: PreviewStep, op: OperationKey, params: PreviewParams): ControlStep["value"] {
  if (step.param) return `{${step.param}}`;
  const value = step.value;
  if (isPlaceholder(value)) return value;
  // Switches are written as "on"/"off" (what the editor's hints offer).
  if (typeof value === "boolean") return value ? "on" : "off";
  if (typeof value === "number") {
    const same = (param: number | undefined) => param != null && param !== 0 && Math.abs(param - value) < 1e-6;
    if (op === "charge" && same(params.target)) return "{target}";
    if ((op === "charge" || op === "cap") && same(params.power_w)) return "{power}";
    if (op === "charge" && params.power_w && Math.abs(-params.power_w - value) < 1e-6) return "{power_neg}";
    if (op === "hold" && same(params.floor)) return "{floor}";
    if (op === "cap" && same(params.percent)) return "{percent}";
  }
  return value ?? null;
}

/** The own steps of a battery as the preview would list them (no preview: the dialog still shows them). */
function ownSteps(steps: ControlStep[]): PreviewStep[] {
  return steps.map((step) =>
    step.service
      ? { kind: "call", service: step.service, data: step.data ?? {} }
      : { kind: "set", entity_id: step.entity_id, value: step.value ?? null },
  );
}

/**
 * "Regler für <Speicher>": how Joe steers one battery – watch only, a known
 * profile, assigned levers or own steps. The main part lists what Joe does
 * (the operations of energy_joe/battery/preview) with every write in order,
 * a probe that really writes and puts back, and own steps per operation.
 * Below it the assignment of the levers with what the profile finds, and a
 * summary of what works.
 */
export class JoeBatteryControl extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) battery?: BatteryConfig;
  @property({ attribute: false }) found?: BatteryFinding;
  @property({ attribute: false }) value?: ControlValue;
  /** Names of the integrations Joe knows (profile key -> name). */
  @property({ attribute: false }) profiles?: Record<string, string>;
  /** The draft is not saved yet: the probe waits (it only works with the saved configuration). */
  @property({ type: Boolean }) dirty = false;
  /** The battery's last probes from the state ("zuletzt geprobt"). */
  @property({ attribute: false }) probes?: Partial<Record<OperationKey, ProbeResult>>;

  @state() private preview?: BatteryPreview;
  @state() private previewState: "idle" | "loading" | "ok" | "error" = "idle";
  @state() private previewError = "";
  @state() private open = new Set<OperationKey>();
  @state() private editing = new Set<OperationKey>();
  @state() private probing: OperationKey | null = null;
  @state() private probeResults: Partial<Record<OperationKey, ProbeResult>> = {};
  @state() private probeErrors: Partial<Record<OperationKey, string>> = {};

  private previewTimer?: number;
  private previewSeq = 0;
  /** The draft the preview was asked for last (the parent builds a new object each render). */
  private previewFor = "";

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      .seg {
        flex-wrap: wrap;
        border-radius: 14px;
      }
      .rows {
        display: grid;
        gap: 6px;
        margin-top: 12px;
      }
      .row {
        display: grid;
        grid-template-columns: minmax(120px, 0.8fr) minmax(0, 1.6fr) auto;
        gap: 8px;
        align-items: center;
        padding: 6px 10px;
        border-radius: 10px;
        background: var(--joe-surface-2);
      }
      .row label,
      .row .label {
        font-weight: 600;
        font-size: 13.5px;
        min-width: 0;
      }
      .row .label small,
      .row .entity small {
        display: block;
        font-weight: 400;
        color: var(--joe-muted);
        overflow-wrap: anywhere;
      }
      .row .label .kind {
        display: inline;
        color: var(--joe-ink-2);
      }
      .row .entity {
        min-width: 0;
      }
      .row .entity b {
        display: block;
        font-weight: 600;
        overflow-wrap: anywhere;
      }
      .row .entity .found {
        color: var(--joe-warn);
      }
      .row .chip {
        margin-top: 4px;
      }
      .row.dev {
        box-shadow: inset 0 0 0 1.5px var(--joe-warn-soft);
      }
      .row .buttons {
        display: flex;
        gap: 4px;
      }
      .icon-btn {
        display: grid;
        place-items: center;
        width: 34px;
        height: 34px;
        border: 0;
        border-radius: 9px;
        cursor: pointer;
        background: transparent;
        color: var(--joe-ink-2);
      }
      .icon-btn:hover {
        background: var(--joe-surface);
      }
      .icon-btn:active {
        transform: scale(0.95);
      }
      .sub {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 16px 0 4px;
        font-weight: 700;
      }
      .hint {
        margin: 4px 0 0;
      }
      .ready {
        margin-top: 12px;
      }
      .ready .line {
        display: block;
        margin-bottom: 2px;
        color: var(--joe-ink-2);
      }
      .ready .lines div {
        margin-top: 4px;
        font-weight: 600;
      }
      .step-value {
        width: 100%;
        min-width: 0;
      }
      .note.reset .note-actions {
        align-items: center;
      }

      /* The operations: one collapsible row each. */
      .ops {
        display: grid;
        gap: 8px;
        margin-top: 10px;
      }
      .op {
        border-radius: 12px;
        background: var(--joe-surface-2);
        padding: 4px 6px 4px 4px;
      }
      .op.off {
        box-shadow: inset 0 0 0 1.5px var(--joe-line);
        background: transparent;
      }
      .op-row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: center;
        gap: 4px;
      }
      .op-head {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        gap: 8px;
        width: 100%;
        min-height: 44px;
        padding: 6px 6px;
        border: 0;
        border-radius: 10px;
        background: transparent;
        text-align: left;
        cursor: pointer;
        transition: background 0.12s;
      }
      .op-head:hover {
        background: var(--joe-surface);
      }
      .op-head:active {
        transform: scale(0.995);
      }
      .op-head > ha-icon {
        color: var(--joe-muted);
      }
      .op-title {
        min-width: 0;
        display: grid;
        gap: 2px;
      }
      .op-title b {
        font-weight: 700;
        overflow-wrap: anywhere;
      }
      .op-title .chip {
        margin-left: 6px;
        vertical-align: middle;
      }
      .op-title small {
        color: var(--joe-ink-2);
        font-size: 13px;
      }
      .op-status {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        font-weight: 600;
        white-space: nowrap;
      }
      .op-status.ok {
        color: var(--joe-good);
      }
      .op-status.bad {
        color: var(--joe-crit);
      }
      .op-status ha-icon {
        --mdc-icon-size: 16px;
      }
      .op-body {
        padding: 2px 8px 10px 10px;
        display: grid;
        gap: 10px;
      }
      .op-why {
        margin: 0;
        color: var(--joe-crit);
        font-size: 14px;
      }
      .op-steps {
        margin: 0;
        padding: 0;
        list-style: none;
        display: grid;
        gap: 6px;
        font-size: 14px;
      }
      .op-steps li {
        display: grid;
        grid-template-columns: 24px minmax(0, 1fr);
        gap: 6px;
        align-items: start;
      }
      .op-steps .n {
        color: var(--joe-muted);
        font-variant-numeric: tabular-nums;
        font-weight: 600;
      }
      .op-steps .what {
        min-width: 0;
        overflow-wrap: anywhere;
      }
      .op-steps .what .role {
        color: var(--joe-ink-2);
      }
      .op-steps .what .now {
        color: var(--joe-muted);
      }
      .op-steps .arrow {
        margin: 0 4px;
        color: var(--joe-muted);
      }
      .op-restore {
        display: grid;
        gap: 4px;
        padding-top: 8px;
        border-top: 1px dashed var(--joe-line);
      }
      .op-restore > small {
        font-weight: 600;
        color: var(--joe-ink-2);
      }
      .op-note {
        display: flex;
        gap: 8px;
        align-items: flex-start;
        margin: 0;
        font-size: 13.5px;
        color: var(--joe-ink-2);
      }
      .op-note ha-icon {
        --mdc-icon-size: 16px;
        color: var(--joe-info);
        margin-top: 2px;
      }
      .op-actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px 8px;
      }
      .op-actions .last {
        font-size: 12.5px;
        color: var(--joe-muted);
      }
      .op-actions .last.ok {
        color: var(--joe-good);
      }
      .op-actions .last.bad {
        color: var(--joe-crit);
      }
      .probe {
        display: grid;
        gap: 6px;
        padding: 10px 12px;
        border-radius: 10px;
        background: var(--joe-surface);
        font-size: 14px;
      }
      .probe.bad {
        box-shadow: inset 0 0 0 1.5px var(--joe-crit-soft);
      }
      .probe ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 4px;
      }
      .probe li {
        display: grid;
        grid-template-columns: 20px minmax(0, 1fr);
        gap: 6px;
        align-items: start;
      }
      .probe li ha-icon {
        --mdc-icon-size: 16px;
        margin-top: 2px;
      }
      .probe li.ok ha-icon {
        color: var(--joe-good);
      }
      .probe li.bad ha-icon {
        color: var(--joe-crit);
      }
      .probe li small {
        display: block;
        color: var(--joe-ink-2);
        overflow-wrap: anywhere;
      }
      .probe .problem {
        margin: 0;
        color: var(--joe-crit);
      }
      .editor {
        margin-top: 0;
      }
      .editor .row {
        grid-template-columns: minmax(0, 1.2fr) minmax(110px, 1fr) auto;
        background: var(--joe-surface);
      }
      .editor .add {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      @media (pointer: coarse) {
        .icon-btn {
          width: 44px;
          height: 44px;
        }
      }
      @media (max-width: 520px) {
        .row,
        .editor .row {
          grid-template-columns: 1fr auto;
        }
        .row label,
        .row .label {
          grid-column: 1 / -1;
        }
        .op-head {
          grid-template-columns: auto minmax(0, 1fr);
        }
        .op-status {
          grid-column: 2;
          justify-self: start;
        }
      }
    `,
  ];

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.previewTimer !== undefined) {
      clearTimeout(this.previewTimer);
      this.previewTimer = undefined;
    }
    this.previewSeq++;
  }

  private get profileKey(): string | null {
    const battery = this.battery;
    if (battery && !["none", "generic", "steps"].includes(battery.adapter)) {
      return battery.adapter;
    }
    const found = this.found;
    return found && found.controllable && found.adapter !== "none" ? found.adapter : null;
  }

  private get choice(): Choice {
    const adapter = this.value?.adapter ?? "none";
    if (adapter === "none") return "watch";
    if (adapter === "generic") return "generic";
    if (adapter === "steps") return "steps";
    return "profile";
  }

  /** The name of the profile in force (from the preview, else the draft's adapter). */
  private get profileName(): string {
    const key = this.preview?.profile?.key ?? (this.choice === "profile" ? this.value?.adapter : undefined) ?? "";
    return this.preview?.profile?.name ?? this.profiles?.[key] ?? key;
  }

  // --- The preview: asked for when the dialog opens and after every change of the draft ---

  protected updated(changed: PropertyValues<this>): void {
    if (changed.has("value") || changed.has("battery") || changed.has("hass")) {
      this.schedulePreview();
    }
  }

  private schedulePreview(): void {
    const { value, battery, hass } = this;
    if (!value || !battery || !hass) {
      return;
    }
    if (value.adapter === "none") {
      // Nothing is written while Joe only watches: no preview.
      this.previewFor = "";
      this.previewSeq++;
      this.preview = undefined;
      this.previewState = "idle";
      return;
    }
    const draft = {
      adapter: value.adapter,
      controls: value.controls,
      mode_options: value.mode_options,
      steps: value.steps,
      prepare: value.prepare ?? [],
    };
    const key = `${battery.id}|${JSON.stringify(draft)}`;
    if (key === this.previewFor) {
      return;
    }
    const first = !this.previewFor;
    this.previewFor = key;
    if (this.previewTimer !== undefined) {
      clearTimeout(this.previewTimer);
    }
    // The first preview at once; later ones once the owner stops changing things.
    this.previewTimer = window.setTimeout(() => void this.fetchPreview(battery.id, draft), first ? 0 : PREVIEW_DELAY);
  }

  private async fetchPreview(batteryId: string, draft: Record<string, unknown>): Promise<void> {
    const hass = this.hass;
    if (!hass) {
      return;
    }
    const seq = ++this.previewSeq;
    this.previewState = "loading";
    try {
      const result = await hass.callWS<BatteryPreview>({ type: "energy_joe/battery/preview", battery_id: batteryId, draft });
      if (seq !== this.previewSeq) return;
      this.preview = result;
      this.previewError = result?.error ?? "";
      this.previewState = this.previewError ? "error" : "ok";
    } catch (err) {
      if (seq !== this.previewSeq) return;
      this.previewError = messageOf(err);
      this.previewState = "error";
    }
  }

  // --- Rendering ---

  protected render() {
    const { t, value } = this;
    if (!t || !value) {
      return nothing;
    }
    const choices: Choice[] = ["watch", ...(this.profileKey ? (["profile"] as Choice[]) : []), "generic", "steps"];
    const suggested = this.found?.suggested;
    const choice = this.choice;
    return html`<div class="choose">
        <div class="seg" role="group" aria-label=${t("f.battery.control")}>
          ${choices.map(
            (item) =>
              html`<button type="button" aria-pressed=${String(choice === item)} @click=${() => this.choose(item)}>
                ${item === "profile"
                  ? t("f.battery.control.profile", { name: this.profiles?.[this.profileKey ?? ""] ?? this.profileKey ?? "" })
                  : t(`f.battery.control.${item}`)}
              </button>`,
          )}
        </div>
      </div>
      ${choice === "watch" ? batteryNotes(t, this.found?.notes) : nothing}
      ${choice === "watch" && suggested?.complete
        ? html`<div class="note" data-tipped>
            <ha-icon icon="mdi:lightbulb-on-outline"></ha-icon>
            <span
              >${t("f.battery.control.suggested")}
              <div class="note-actions">
                <button type="button" class="mini-btn go" @click=${this.takeSuggestion}>${t("f.battery.control.take")}</button>
                ${tip(t, "control_roles")}
              </div></span
            >
          </div>`
        : nothing}
      ${choice === "watch" ? html`<p class="field-hint hint">${t("preview.watch")}</p>` : nothing}
      ${choice === "profile" ? batteryNotes(t, this.found?.notes) : nothing}
      ${choice !== "watch" ? this.renderOperations(t, value) : nothing}
      ${choice === "profile" || choice === "generic" ? this.renderRoles(t, value) : nothing}
      ${choice !== "watch" ? this.renderSummary(t) : nothing}
      ${choice !== "watch" ? html`<p class="field-hint">${t("f.battery.control.retest")}</p>` : nothing}`;
  }

  /** The operations the dialog lists: the preview's, else what the draft's own steps say. */
  private operations(value: ControlValue): PreviewOperation[] {
    const preview = this.preview;
    if (preview?.operations?.length) {
      return preview.operations;
    }
    return OPERATIONS.map((op) => {
      const own = value.steps[op as StepName];
      return {
        op,
        possible: Boolean(own?.length),
        why: null,
        source: own ? "own" : "none",
        params: {},
        steps: own ? ownSteps(own) : [],
        restore: [],
        note: null,
      };
    });
  }

  private renderOperations(t: Translate, value: ControlValue): TemplateResult {
    const loading = this.previewState === "loading";
    const error = this.previewState === "error" ? this.previewError : "";
    return html`<div class="sub" data-tipped>${t("preview.title")} ${tip(t, "operations")}</div>
      ${this.choice === "steps" ? html`<p class="field-hint hint">${t("preview.steps_tab")}</p>` : nothing}
      ${this.dirty ? html`<p class="field-hint hint" role="status">${t("preview.dirty")}</p>` : nothing}
      ${error
        ? html`<div class="note warn" role="status"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${t("preview.error", { error })}</span></div>`
        : nothing}
      ${loading ? html`<p class="field-hint hint" role="status">${t("preview.loading")}</p>` : nothing}
      <div class="ops">${this.operations(value).map((info) => this.renderOperation(t, value, info))}</div>`;
  }

  private renderOperation(t: Translate, value: ControlValue, info: PreviewOperation): TemplateResult {
    const op = info.op;
    const open = this.open.has(op);
    const editing = this.editing.has(op);
    // The owner's own steps – not a profile's service steps, which are saved with the battery too.
    const own = editing || (this.preview ? info.source === "own" : Boolean(value.steps[op as StepName]));
    const count = info.steps.length;
    // An operation this panel does not know yet gets the general explanation.
    const tipName: TipName = t.optional(`tip.op_${op}.title`) ? (`op_${op}` as TipName) : "operations";
    const sourceChip = this.sourceChip(t, info);
    return html`<div class="op ${info.possible ? "" : "off"}" data-tipped>
      <div class="op-row">
        <button type="button" class="op-head" aria-expanded=${String(open)} @click=${() => this.toggle(op)}>
          <ha-icon icon=${open ? "mdi:chevron-down" : "mdi:chevron-right"}></ha-icon>
          <span class="op-title">
            <span><b>${t.optional(`op.${op}`) ?? op}</b>${sourceChip}</span>
            ${this.example(t, info) ? html`<small>${this.example(t, info)}</small>` : nothing}
          </span>
          <span class="op-status ${info.possible ? "ok" : "bad"}">
            <ha-icon icon=${info.possible ? "mdi:check-circle" : "mdi:minus-circle-outline"}></ha-icon>
            ${info.possible
              ? count === 1
                ? t("op.steps.one")
                : count
                  ? t("op.steps.many", { count })
                  : t("op.possible")
              : t("op.impossible")}
          </span>
        </button>
        ${tip(t, tipName)}
      </div>
      ${open
        ? html`<div class="op-body">
            ${!info.possible && info.why ? html`<p class="op-why">${this.whyText(t, info.why)}</p>` : nothing}
            ${editing ? this.renderEditor(t, value, op as StepName) : this.renderSteps(t, info)}
            ${info.note ? this.renderNote(t, info.note) : nothing}
            ${this.renderActions(t, info, own, editing)}
            ${this.renderProbe(t, op)}
          </div>`
        : nothing}
    </div>`;
  }

  private sourceChip(t: Translate, info: PreviewOperation): TemplateResult | typeof nothing {
    switch (info.source) {
      case "profile":
        return html`<span class="chip read">${t("op.source.profile", { name: this.profileName })}</span>`;
      case "generic":
        return html`<span class="chip">${t("op.source.generic")}</span>`;
      case "own":
        return html`<span class="chip user">${t("op.source.own")}</span>`;
      case "service":
        return html`<span class="chip read">${t("op.source.service")}</span>`;
      default:
        return nothing;
    }
  }

  /** "Beispiel: bis 80 % mit 2.000 W" from the preview's parameters. */
  private example(t: Translate, info: PreviewOperation): string {
    const p = info.params ?? {};
    const n = (value: number | undefined) => formatNumber(t.lang, value ?? 0, 0);
    switch (info.op) {
      case "charge":
        return p.target != null || p.power_w != null ? t("op.example.charge", { target: n(p.target), power: n(p.power_w) }) : "";
      case "hold":
        return p.floor != null ? t("op.example.hold", { floor: n(p.floor) }) : "";
      case "cap": {
        // A limit in W or in %: what the steps write decides, else what the example brings.
        const inWatts = info.steps.some((s) => s.value === "{power}" || s.unit === "W" || s.unit === "kW");
        const inPercent = info.steps.some((s) => s.value === "{percent}" || s.unit === "%");
        if ((inWatts && !inPercent && p.power_w != null) || (p.percent == null && p.power_w != null)) {
          return t("op.example.cap.power", { power: n(p.power_w) });
        }
        return p.percent != null ? t("op.example.cap.percent", { percent: n(p.percent) }) : "";
      }
      case "guard_charge":
      case "guard_discharge":
        return p.seconds != null ? t("op.example.guard", { seconds: n(p.seconds) }) : "";
      default:
        return "";
    }
  }

  private whyText(t: Translate, why: string): string {
    return t.optional(`why.${why}`) ?? t("why.other", { code: why });
  }

  private renderNote(t: Translate, note: string): TemplateResult {
    const name = this.profileName || t("op.note.device");
    const text = t.optional(`op.note.${note}`, { name }) ?? t("op.note.other", { code: note });
    return html`<p class="op-note"><ha-icon icon="mdi:information-outline"></ha-icon><span>${text}</span></p>`;
  }

  /** The writes in order, then what goes back afterwards. */
  private renderSteps(t: Translate, info: PreviewOperation): TemplateResult {
    const hass = this.hass!;
    const params = info.params ?? {};
    return html`${info.steps.length
      ? html`<ol class="op-steps">
          ${info.steps.map(
            (step, index) => html`<li>
              <span class="n">${index + 1}.</span>
              <span class="what">${this.stepText(t, step, params)}</span>
            </li>`,
          )}
        </ol>`
      : info.possible
        ? html`<p class="field-hint hint">${t("op.steps.none")}</p>`
        : nothing}
    ${info.restore?.length
      ? html`<div class="op-restore">
          <small>${t("op.restore.title")}</small>
          <ol class="op-steps">
            ${info.restore.map(
              (item, index) => html`<li>
                <span class="n">${index + 1}.</span>
                <span class="what"
                  ><b>${item.name || entityName(hass, item.entity_id)}</b><span class="arrow">→</span
                  ><b>${item.value === "saved" ? t("op.step.saved") : this.valueText(t, item.value, this.unitOf(item.entity_id), params)}</b>
                  ${item.current != null
                    ? html` <span class="now">(${t("op.step.now", { value: this.currentText(t, item.current, this.unitOf(item.entity_id)) })})</span>`
                    : nothing}
                </span>
              </li>`,
            )}
          </ol>
        </div>`
      : info.possible && info.steps.length && info.op !== "release"
        ? html`<div class="op-restore"><small>${t("op.restore.none")}</small></div>`
        : nothing}`;
  }

  /** "Ladegrenze · Battery charge power limit → 0 % (jetzt 100 %)" or "Dienst huawei_solar.forcible_charge_soc (Ziel 80 % · Leistung 2.000 W)". */
  private stepText(t: Translate, step: PreviewStep, params: PreviewParams): TemplateResult {
    const hass = this.hass!;
    if (step.kind === "call" || step.service) {
      const data = Object.entries(step.data ?? {}).filter(([key]) => key !== "device_id" && key !== "entity_id");
      const parts = data.map(([key, value]) => `${t.optional(`op.data.${key}`) ?? key} ${this.valueText(t, value as never, undefined, params)}`);
      return html`<b>${t("op.step.service", { service: step.service ?? "" })}</b>${parts.length ? html` <span class="now">(${parts.join(" · ")})</span>` : nothing}`;
    }
    const role = step.role && step.role !== "prepare" ? (t.optional(`role.${step.role}`) ?? step.role) : "";
    const name = step.name || (step.entity_id ? entityName(hass, step.entity_id) : "");
    const unit = step.unit ?? this.unitOf(step.entity_id);
    return html`${role ? html`<span class="role">${role} · </span>` : nothing}<b>${name}</b><span class="arrow">→</span
      ><b>${this.valueText(t, step.value, unit, params)}</b>
      ${step.current != null ? html` <span class="now">(${t("op.step.now", { value: this.currentText(t, step.current, unit) })})</span>` : nothing}`;
  }

  /** A value as the owner reads it: Ein/Aus, "80 %", a placeholder filled from the example's parameters. */
  private valueText(t: Translate, value: unknown, unit: string | null | undefined, params: PreviewParams): string {
    if (value === true || value === "on" || value === "true") return t("op.step.on");
    if (value === false || value === "off" || value === "false") return t("op.step.off");
    if (value == null) return "–";
    if (isPlaceholder(value)) {
      const name = value.slice(1, -1);
      const n = (x: number | undefined, suffix: string) => (x == null ? value : `${formatNumber(t.lang, x, 0)} ${suffix}`);
      switch (name) {
        case "target":
          return n(params.target, "%");
        case "power":
          return n(params.power_w, "W");
        case "power_neg":
          return params.power_w == null ? value : `−${formatNumber(t.lang, params.power_w, 0)} W`;
        case "floor":
          return n(params.floor, "%");
        case "percent":
          return n(params.percent, "%");
        case "seconds":
          return n(params.seconds, "s");
        case "minutes":
          return n(params.minutes, "min");
        default:
          return value;
      }
    }
    if (typeof value === "number") {
      return `${formatNumber(t.lang, value, 2)}${unit ? ` ${unit}` : ""}`;
    }
    const number = Number(value);
    if (typeof value === "string" && value.trim() !== "" && Number.isFinite(number)) {
      return `${formatNumber(t.lang, number, 2)}${unit ? ` ${unit}` : ""}`;
    }
    return String(value);
  }

  /** What an entity shows right now (a state text from the backend). */
  private currentText(t: Translate, current: string, unit?: string | null): string {
    if (current === "on") return t("op.step.on");
    if (current === "off") return t("op.step.off");
    const number = Number(current);
    if (current.trim() !== "" && Number.isFinite(number)) {
      return `${formatNumber(t.lang, number, 2)}${unit ? ` ${unit}` : ""}`;
    }
    return current;
  }

  /** Probe, "Selbst festlegen" (or "Schritte bearbeiten"), "Zurück zum Profil" and "Fertig". */
  private renderActions(t: Translate, info: PreviewOperation, hasOwn: boolean, editing: boolean): TemplateResult {
    const op = info.op;
    const editable = EDITABLE.has(op);
    const canProbe = info.possible && !this.dirty && !this.probing && !editing;
    const last = this.lastProbe(op);
    const back: TipName = "own_back";
    const backLabel = this.choice === "steps" ? t("op.own.back.steps") : this.choice === "generic" ? t("op.own.back.generic") : t("op.own.back.profile");
    return html`<div class="op-actions" data-tipped>
      ${this.probing === op
        ? html`<span class="chip">${t("op.probe.running")}</span>`
        : html`<button type="button" class="mini-btn" ?disabled=${!canProbe} @click=${() => this.probe(op)}>
            <ha-icon icon="mdi:test-tube"></ha-icon>${t("op.probe")}
          </button>`}
      ${tip(t, "probe")}
      <span class="last ${last ? (last.ok ? "ok" : "bad") : ""}">
        ${last
          ? t(last.ok ? "op.probe.last.ok" : "op.probe.last.failed", { when: `${dayText(t.lang, last.at, "short")}, ${timeOf(last.at)}` })
          : t("op.probe.never")}
      </span>
      ${editable
        ? editing
          ? html`<button type="button" class="mini-btn go" @click=${() => this.stopEditing(op)}>${t("op.own.done")}</button>
              ${tip(t, "own_steps", PLACEHOLDERS)}`
          : html`<button type="button" class="mini-btn" @click=${() => this.startEditing(op, info, hasOwn)}>
                <ha-icon icon="mdi:pencil-outline"></ha-icon>${t(hasOwn ? "op.own.edit" : "op.own")}
              </button>
              ${tip(t, "own_steps", PLACEHOLDERS)}`
        : nothing}
      ${editable && hasOwn
        ? html`<button type="button" class="mini-btn quiet" @click=${() => this.resetOwn(op as StepName)}>${backLabel}</button> ${tip(t, back)}`
        : nothing}
    </div>`;
  }

  // --- Own steps per operation (the editor, prefilled from the preview) ---

  private renderEditor(t: Translate, value: ControlValue, name: StepName): TemplateResult {
    const hass = this.hass!;
    const steps = value.steps[name] ?? [];
    return html`<div class="rows editor" data-tipped>
      ${steps.length ? nothing : html`<p class="field-hint hint">${t("op.own.empty")}</p>`}
      ${steps.map(
        (step, index) => html`<div class="row">
          <span class="entity"
            ><b>${step.service ?? entityName(hass, step.entity_id ?? "")}</b><small>${step.service ? this.dataText(step) : (step.entity_id ?? "")}</small></span
          >
          ${step.service
            ? html`<span></span>`
            : html`<input
                  class="input step-value"
                  type="text"
                  aria-label=${t("f.battery.steps.value")}
                  placeholder=${t("f.battery.steps.value")}
                  list="values-${name}-${index}"
                  .value=${step.value == null ? "" : String(step.value)}
                  @change=${(ev: Event) => this.setStep(name, index, (ev.target as HTMLInputElement).value)}
                />
                <datalist id="values-${name}-${index}">
                  ${this.valueHints(step.entity_id ?? "", name).map((hint) => html`<option value=${hint}></option>`)}
                </datalist>`}
          <button
            type="button"
            class="icon-btn"
            aria-label=${t("f.remove")}
            title=${t("f.remove")}
            @click=${() => this.removeStep(name, index)}
          >
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>`,
      )}
      <div class="add">
        <button type="button" class="mini-btn" @click=${() => this.addStep(name)}>
          <ha-icon icon="mdi:plus"></ha-icon>${t("f.battery.steps.add")}
        </button>
        ${tip(t, "control_steps", PLACEHOLDERS)}
      </div>
      <p class="field-hint hint">${t("f.battery.steps.hint", PLACEHOLDERS)}</p>
    </div>`;
  }

  private dataText(step: ControlStep): string {
    return Object.entries(step.data ?? {})
      .filter(([key]) => key !== "device_id")
      .map(([key, value]) => `${key}: ${String(value)}`)
      .join(" · ");
  }

  private valueHints(entityId: string, name: StepName): string[] {
    const domain = entityId.split(".", 1)[0];
    if (["switch", "input_boolean"].includes(domain)) return ["on", "off"];
    if (["select", "input_select"].includes(domain)) {
      return (this.hass?.states[entityId]?.attributes.options as string[] | undefined) ?? [];
    }
    if (["number", "input_number"].includes(domain)) {
      switch (name) {
        case "charge":
          return ["{target}", "{power}"];
        case "hold":
          return ["{floor}"];
        case "cap":
          return ["{percent}", "{power}"];
        case "block":
        case "block_charge":
        case "block_discharge":
          return ["0"];
        default:
          return [];
      }
    }
    return [];
  }

  /** "Selbst festlegen": the preview's steps become the owner's, then the editor opens. */
  private startEditing(op: OperationKey, info: PreviewOperation, hasOwn: boolean): void {
    const name = op as StepName;
    if (!hasOwn) {
      const value = this.value!;
      const steps: ControlStep[] = info.steps.map((step) =>
        step.kind === "call" || step.service
          ? { service: step.service, data: step.data ?? {} }
          : { entity_id: step.entity_id, value: ownValue(step, op, info.params ?? {}) },
      );
      this.emit({ ...value, steps: { ...value.steps, [name]: steps } });
    }
    this.editing = new Set([...this.editing, op]);
    this.open = new Set([...this.open, op]);
  }

  private stopEditing(op: OperationKey): void {
    const editing = new Set(this.editing);
    editing.delete(op);
    this.editing = editing;
  }

  /** "Zurück zum Profil": the own steps go; a profile steered by services gets its own back. */
  private resetOwn(name: StepName): void {
    const value = this.value!;
    const steps = { ...value.steps };
    const profile = this.choice === "profile" ? this.found?.steps?.[name] : undefined;
    if (profile?.length) {
      steps[name] = structuredClone(profile);
    } else {
      delete steps[name];
    }
    this.stopEditing(name);
    this.emit({ ...value, steps });
  }

  private toggle(op: OperationKey): void {
    const open = new Set(this.open);
    if (open.has(op)) {
      open.delete(op);
    } else {
      open.add(op);
    }
    this.open = open;
  }

  // --- The probe: really writes, then puts everything back ---

  /** The last probe of an operation: the newer of the state's and this dialog's. */
  private lastProbe(op: OperationKey): ProbeResult | undefined {
    const stored = this.probes?.[op];
    const mine = this.probeResults[op];
    if (stored && mine) {
      return stored.at > mine.at ? stored : mine;
    }
    return mine ?? stored;
  }

  private async probe(op: OperationKey): Promise<void> {
    const hass = this.hass;
    const battery = this.battery;
    if (!hass || !battery || this.probing) {
      return;
    }
    this.probing = op;
    const errors = { ...this.probeErrors };
    delete errors[op];
    this.probeErrors = errors;
    try {
      const result = await hass.callWS<ProbeResult>({ type: "energy_joe/battery/probe", battery_id: battery.id, op });
      this.probeResults = { ...this.probeResults, [op]: result };
    } catch (err) {
      this.probeErrors = { ...this.probeErrors, [op]: messageOf(err) };
    } finally {
      this.probing = null;
    }
  }

  private renderProbe(t: Translate, op: OperationKey): TemplateResult | typeof nothing {
    const hass = this.hass!;
    const error = this.probeErrors[op];
    if (error) {
      return html`<div class="probe bad" role="status">
        <p class="problem">${t("op.probe.failed")} ${t("op.probe.error", { error })}</p>
      </div>`;
    }
    const result = this.probeResults[op];
    if (!result) {
      return nothing;
    }
    const problem = result.problem
      ? (t.optional(`op.probe.problem.${result.problem}`) ?? t("op.probe.problem.other", { code: result.problem }))
      : "";
    const nameOf = (step: { entity_id?: string; service?: string }) =>
      step.service ? t("op.step.service", { service: step.service }) : step.entity_id ? entityName(hass, step.entity_id) : "";
    return html`<div class="probe ${result.ok ? "ok" : "bad"}" role="status">
      ${problem ? html`<p class="problem">${problem}</p>` : nothing}
      ${result.steps?.length || !problem
        ? html`<ul>
            ${(result.steps ?? []).map((step) => {
              const good = step.taken && !step.error;
              const unit = this.unitOf(step.entity_id);
              const parts = [
                t("op.probe.wrote", {
                  wrote: this.valueText(t, step.wrote, unit, {}),
                  read: step.read == null ? "–" : this.currentText(t, String(step.read), unit),
                }),
                step.error ? t("op.probe.error", { error: t.optional(`devices.problem.${step.error}`) ?? step.error }) : t(good ? "op.probe.taken" : "op.probe.not_taken"),
              ];
              return html`<li class=${good ? "ok" : "bad"}>
                <ha-icon icon=${good ? "mdi:check-circle" : "mdi:close-circle"}></ha-icon>
                <span><b>${nameOf(step)}</b><small>${parts.join(" · ")}</small></span>
              </li>`;
            })}
            <li class=${result.restored ? "ok" : "bad"}>
              <ha-icon icon=${result.restored ? "mdi:check-circle" : "mdi:close-circle"}></ha-icon>
              <span
                >${result.restored
                  ? t("op.probe.restored")
                  : t("op.probe.not_restored", { entities: (result.restore_errors ?? []).map((e) => entityName(hass, e)).join(", ") })}</span
              >
            </li>
          </ul>`
        : nothing}
      ${result.power_kw != null ? html`<small>${t("devices.test.power", { value: formatNumber(t.lang, result.power_kw, 2) })}</small>` : nothing}
    </div>`;
  }

  // --- The assignment of the levers ---

  /**
   * The rows of the lever list: the preview's roles that matter (used, assigned,
   * found by the profile or differing from it), then the basic roles not assigned yet.
   */
  private roleRows(value: ControlValue): PreviewRole[] {
    const hass = this.hass!;
    const fromPreview = (this.preview?.roles ?? []).filter(
      (role) => role.relevant || role.deviates || role.found || value.controls[role.role as ControlRole],
    );
    const seen = new Set(fromPreview.map((role) => role.role));
    const rows: PreviewRole[] = [...fromPreview];
    const extra: string[] = [...CONTROL_ROLES, ...Object.keys(value.controls)];
    for (const role of extra) {
      if (seen.has(role)) continue;
      seen.add(role);
      const entityId = value.controls[role as ControlRole] ?? null;
      const filter = ROLE_FILTER[role as ControlRole];
      rows.push({
        role,
        entity_id: entityId,
        found: null,
        kind: filter === "level" || filter === "setpoint" || filter === "toggle" || filter === "option" ? filter : null,
        unit: entityId ? ((hass.states[entityId]?.attributes.unit_of_measurement as string | undefined) ?? null) : null,
        used_by: [],
        deviates: false,
        relevant: false,
      });
    }
    // The draft may have moved on since the preview: what is assigned now counts.
    return rows.map((row) => ({ ...row, entity_id: value.controls[row.role as ControlRole] ?? null }));
  }

  /** The unit an entity shows ("%", "W"), if any. */
  private unitOf(entityId: string | null | undefined): string | null {
    const unit = entityId ? this.hass?.states[entityId]?.attributes.unit_of_measurement : undefined;
    return typeof unit === "string" && unit ? unit : null;
  }

  /** "(Sollwert in W)", "(Deckel in %)", "(Schalter)" – what a lever is, from its kind and unit. */
  private kindText(t: Translate, row: PreviewRole): string {
    const unit = row.unit ?? this.unitOf(row.entity_id ?? row.found);
    const kind = row.kind ?? (ROLE_FILTER[row.role as ControlRole] as PreviewRole["kind"] | undefined) ?? null;
    switch (kind) {
      case "toggle":
        return t("role.kind.toggle");
      case "option":
        return t("role.kind.option");
      case "level":
        // A level is always a share of the battery.
        return t("role.kind.level", { unit: unit ?? "%" });
      case "setpoint":
        if (row.role.includes("limit")) {
          return unit ? t("role.kind.limit", { unit }) : t("role.kind.limit.nounit");
        }
        return unit ? t("role.kind.setpoint", { unit }) : t("role.kind.setpoint.nounit");
      default:
        return "";
    }
  }

  private renderRoles(t: Translate, value: ControlValue): TemplateResult {
    const hass = this.hass!;
    const rows = this.roleRows(value);
    const modeEntity = value.controls.mode;
    const options = modeEntity ? ((hass.states[modeEntity]?.attributes.options as string[] | undefined) ?? []) : [];
    const deviates = Boolean(this.preview?.deviates) && this.choice === "profile";
    const impossible = (this.preview?.operations ?? []).filter((op) => !op.possible).map((op) => t.optional(`op.short.${op.op}`) ?? op.op);
    const profile = this.profileName;
    return html`<div data-tipped>
      <div class="sub">${t("roles.title")} ${tip(t, "roles_list")}</div>
      ${deviates
        ? html`<div class="note warn reset" role="status">
            <ha-icon icon="mdi:alert-outline"></ha-icon>
            <span
              >${t("roles.warn", { name: profile })}
              ${impossible.length ? html` ${t("roles.warn.ops", { ops: impossible.join(", ") })}` : nothing}
              <div class="note-actions">
                <button type="button" class="mini-btn go" @click=${this.resetToProfile}>${t("roles.reset", { name: profile })}</button>
                ${tip(t, "roles_reset")}
              </div></span
            >
          </div>`
        : nothing}
      <div class="rows">
        ${rows.map((row) => {
          const role = row.role as ControlRole;
          const entityId = row.entity_id;
          const kind = this.kindText(t, row);
          const used = row.used_by?.length ? row.used_by.map((op) => t.optional(`op.short.${op}`) ?? op).join(", ") : "";
          return html`<div class="row ${row.deviates ? "dev" : ""}">
            <span class="label">
              ${t.optional(`role.${role}`) ?? role}${kind ? html` <span class="kind">(${kind})</span>` : nothing}
              ${used ? html`<small>${t("roles.used_by", { ops: used })}</small>` : nothing}
            </span>
            <span class="entity">
              ${entityId
                ? html`<b>${entityName(hass, entityId)}</b><small>${formatState(hass, entityId, t.lang)}</small>`
                : html`<small>${t("find.none")}</small>`}
              ${row.deviates && row.found && row.found !== entityId
                ? html`<small class="found">${t("roles.by_profile", { name: entityName(hass, row.found) })}</small>`
                : nothing}
              ${row.deviates ? html`<span class="chip warn">${t("roles.deviates")}</span>` : nothing}
            </span>
            <span class="buttons">
              <button type="button" class="mini-btn" @click=${() => this.pickRole(role)}>
                <ha-icon icon="mdi:magnify"></ha-icon>${t(entityId ? "review.change" : "review.choose")}
              </button>
              ${entityId
                ? html`<button
                    type="button"
                    class="icon-btn"
                    aria-label=${t("f.remove")}
                    title=${t("f.remove")}
                    @click=${() => this.setRole(role, null)}
                  >
                    <ha-icon icon="mdi:close"></ha-icon>
                  </button>`
                : nothing}
            </span>
          </div>`;
        })}
      </div>
      </div>
      ${modeEntity
        ? html`<div data-tipped>
            <div class="sub">${t("f.battery.mode_options")} ${tip(t, "mode_options")}</div>
            <div class="rows">
              ${MODE_MEANINGS.map(
                (meaning) => html`<div class="row">
                  <label for="opt-${meaning}">${t(`meaning.${meaning}`)}</label>
                  <select
                    id="opt-${meaning}"
                    class="input"
                    @change=${(ev: Event) => this.setOption(meaning, (ev.target as HTMLSelectElement).value)}
                  >
                    <option value="" ?selected=${!value.mode_options[meaning]}>${t("meaning.none")}</option>
                    ${options.map(
                      (option) => html`<option value=${option} ?selected=${value.mode_options[meaning] === option}>${option}</option>`,
                    )}
                  </select>
                  <span></span>
                </div>`,
              )}
            </div>
            </div>`
        : nothing}`;
  }

  /**
   * "Auf <Profil> zurücksetzen": every lever the profile finds goes to its
   * role; a lever of the owner's that is one of them moves there (it sat
   * under the wrong role); the owner's other levers stay. Only the draft
   * changes – saving is the owner's.
   */
  private resetToProfile = (): void => {
    const value = this.value;
    const roles = this.preview?.roles ?? [];
    if (!value || !roles.length) {
      return;
    }
    const controls: ControlValue["controls"] = { ...value.controls };
    const foundEntities = new Set(roles.map((role) => role.found).filter((entity): entity is string => Boolean(entity)));
    for (const [role, entityId] of Object.entries(controls)) {
      const rightHere = roles.some((item) => item.role === role && item.found === entityId);
      if (entityId && foundEntities.has(entityId) && !rightHere) {
        delete controls[role as ControlRole];
      }
    }
    for (const role of roles) {
      if (role.found) {
        controls[role.role as ControlRole] = role.found;
      }
    }
    const mode_options = this.found?.mode_options ? { ...this.found.mode_options } : controls.mode ? value.mode_options : {};
    this.emit({ ...value, controls, mode_options });
  };

  // --- The summary ---

  private renderSummary(t: Translate): TemplateResult | typeof nothing {
    const preview = this.preview;
    if (!preview?.operations?.length) {
      return nothing;
    }
    const byOp = new Map(preview.operations.map((op) => [op.op, op]));
    const parts: string[] = [];
    // What does not work, grouped by its reason ("Warten, Drossel: nicht möglich (Mir fehlt ein Regler dafür)").
    const failed = new Map<string, string[]>();
    for (const key of OPERATIONS) {
      const info = byOp.get(key);
      const short = t.optional(`op.short.${key}`) ?? key;
      if (!info) continue;
      if (!info.possible) {
        const why = info.why ? this.whyText(t, info.why).replace(/\.$/, "") : "";
        failed.set(why, [...(failed.get(why) ?? []), short]);
        continue;
      }
      const count = info.steps.length;
      parts.push(`${short}: ${count === 1 ? t("op.steps.one") : count ? t("op.steps.many", { count }) : t("op.possible")}`);
    }
    for (const [why, ops] of failed) {
      parts.push(why ? t("summary.impossible", { op: ops.join(", "), why }) : `${ops.join(", ")}: ${t("op.impossible")}`);
    }
    const missing = IMPORTANT.filter((key) => byOp.get(key) && !byOp.get(key)!.possible);
    const warn = missing.length > 0;
    return html`<div class="note ${warn ? "warn" : ""} ready" role="status">
      <ha-icon icon=${warn ? "mdi:alert-outline" : "mdi:check-circle-outline"}></ha-icon>
      <span>
        <span class="line">${parts.join(" · ")}</span>
        <span class="lines">
          ${warn
            ? missing.map((key) => html`<div>${t(`summary.missing.${key}` as `summary.missing.${"charge" | "hold" | "block" | "cap"}`)}</div>`)
            : html`<div>${t("summary.ok")}</div>`}
        </span>
      </span>
    </div>`;
  }

  // --- Changes of the draft ---

  private choose(choice: Choice): void {
    const value = this.value!;
    if (choice === "watch") {
      this.emit({ ...value, adapter: "none" });
    } else if (choice === "profile") {
      const key = this.profileKey!;
      const fromBattery = this.battery?.adapter === key ? this.battery : undefined;
      this.emit({
        ...value,
        adapter: key,
        controls: { ...(fromBattery?.controls ?? this.found?.controls ?? value.controls) },
        mode_options: { ...(fromBattery?.mode_options ?? {}) },
      });
    } else if (choice === "generic") {
      const empty = !Object.keys(value.controls).length;
      const suggested = this.found?.suggested;
      this.emit({
        ...value,
        adapter: "generic",
        controls: empty && suggested ? { ...suggested.controls } : value.controls,
        mode_options: empty && suggested ? { ...suggested.mode_options } : value.mode_options,
      });
    } else {
      this.emit({ ...value, adapter: "steps" });
    }
  }

  private takeSuggestion = (): void => {
    const suggested = this.found?.suggested;
    if (suggested) {
      this.emit({
        ...this.value!,
        adapter: "generic",
        controls: { ...suggested.controls },
        mode_options: { ...suggested.mode_options },
      });
    }
  };

  private async pickRole(role: ControlRole): Promise<void> {
    const t = this.t!;
    const current = this.value!.controls[role];
    const filter = ROLE_FILTER[role] ?? "writable";
    const picked = await pickEntity(this, {
      heading: t("pick.role.title", { role: t.optional(`role.${role}`) ?? role }),
      tip: "control_roles",
      filter,
      selected: current ? [current] : [],
      suggestions: this.nearby(filter).map((entity_id) => ({ entity_id })),
    });
    if (picked?.selected[0]) {
      this.setRole(role, picked.selected[0]);
    }
  }

  /** Entities of the battery's own device first. */
  private nearby(filter: FilterName): string[] {
    const hass = this.hass!;
    const device = this.battery?.device_id;
    if (!device) return [];
    const domains: Record<string, string[]> = {
      level: ["number", "input_number"],
      setpoint: ["number", "input_number"],
      toggle: ["switch", "input_boolean"],
      option: ["select", "input_select"],
      writable: ["number", "switch", "select", "script", "button"],
    };
    const wanted = domains[filter] ?? [];
    return Object.values(hass.entities ?? {})
      .filter((entry) => entry.device_id === device && wanted.includes(entry.entity_id.split(".", 1)[0]))
      .map((entry) => entry.entity_id);
  }

  private setRole(role: ControlRole, entityId: string | null): void {
    const value = this.value!;
    const controls = { ...value.controls };
    if (entityId) {
      controls[role] = entityId;
    } else {
      delete controls[role];
    }
    const mode_options = role === "mode" && !entityId ? {} : value.mode_options;
    this.emit({ ...value, adapter: value.adapter === "none" ? "generic" : value.adapter, controls, mode_options });
  }

  private setOption(meaning: ModeMeaning, option: string): void {
    const value = this.value!;
    const mode_options = { ...value.mode_options };
    if (option) {
      mode_options[meaning] = option;
    } else {
      delete mode_options[meaning];
    }
    this.emit({ ...value, mode_options });
  }

  private async addStep(name: StepName): Promise<void> {
    const t = this.t!;
    const picked = await pickEntity(this, {
      heading: t("pick.step.title"),
      tip: "control_steps",
      tipVars: PLACEHOLDERS,
      filter: "writable",
      selected: [],
    });
    const entityId = picked?.selected[0];
    if (!entityId) return;
    const hints = this.valueHints(entityId, name);
    const step: ControlStep = { entity_id: entityId, value: hints[0] ?? null };
    const value = this.value!;
    this.emit({ ...value, steps: { ...value.steps, [name]: [...(value.steps[name] ?? []), step] } });
  }

  private setStep(name: StepName, index: number, raw: string): void {
    const value = this.value!;
    const steps = [...(value.steps[name] ?? [])];
    const number = Number(raw.replace(",", "."));
    const parsed = raw.trim() === "" ? null : raw.startsWith("{") || Number.isNaN(number) ? raw.trim() : number;
    steps[index] = { ...steps[index], value: parsed };
    this.emit({ ...value, steps: { ...value.steps, [name]: steps } });
  }

  private removeStep(name: StepName, index: number): void {
    const value = this.value!;
    const steps = (value.steps[name] ?? []).filter((_, i) => i !== index);
    this.emit({ ...value, steps: { ...value.steps, [name]: steps } });
  }

  private emit(value: ControlValue): void {
    this.dispatchEvent(new CustomEvent<ControlValue>("joe-control-change", { detail: value }));
  }
}

define("joe-battery-control", JoeBatteryControl);
