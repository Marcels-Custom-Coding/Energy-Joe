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
  /** The inverter Joe speaks Modbus TCP with himself ("Fronius über Modbus"); null: none. */
  modbus?: ModbusSettings | null;
}

/** How to reach an inverter over Modbus TCP (battery.modbus). */
export type ModbusSettings = NonNullable<BatteryConfig["modbus"]>;

type Choice = "watch" | "profile" | "modbus" | "generic" | "steps";

/** The profile of a Fronius inverter Joe steers over Modbus TCP himself, and the integration's own profile it stands beside. */
const MODBUS_ADAPTER = "fronius_modbus";
const MODBUS_CORE = "fronius";
const MODBUS_DEFAULTS = { port: 502, unit: 1 };

/** "host:port/unit" – the same inverter whatever the owner typed around it. */
function modbusKey(settings: ModbusSettings | null | undefined): string {
  return settings ? `${settings.host.trim()}:${settings.port}/${settings.unit}` : "";
}

/**
 * The answer of energy_joe/modbus/check: the storage model the inverter
 * answers with and its values, or why not (`problem`). `hosts` are the
 * addresses of the Fronius integration either way. Nothing is written.
 */
interface ModbusCheck {
  ok: boolean;
  problem?: string;
  detail?: string;
  kind?: "int_sf" | "float";
  base?: number;
  model?: string;
  version?: string;
  serial?: string;
  inverter_w?: number | null;
  max_power_w?: number | null;
  control?: number;
  charge_limited?: boolean;
  discharge_limited?: boolean;
  reserve_pct?: number | null;
  level_pct?: number | null;
  status?: string;
  discharge_rate_pct?: number | null;
  charge_rate_pct?: number | null;
  revert_s?: number | null;
  grid_charging?: boolean;
  host?: string;
  port?: number;
  unit?: number;
  hosts: string[];
}

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
    modbus: battery.modbus ? { ...battery.modbus } : null,
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

/** What a step's entity takes (how the editor shows its value). */
type StepKind = "toggle" | "option" | "number" | "trigger" | "text" | "service";

/** A typed value: a number where it reads as one, a placeholder or text as typed, nothing when empty. */
function parseValue(raw: string): ControlStep["value"] {
  const trimmed = raw.trim();
  if (trimmed === "") return null;
  const number = Number(trimmed.replace(",", "."));
  return trimmed.startsWith("{") || Number.isNaN(number) ? trimmed : number;
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
  /** A probe going on anywhere (any battery, any session, from control.probe_running): no second one meanwhile. */
  @property({ attribute: false }) probeRunning?: { battery: string; op: string; started: string } | null;
  /** A test run is going on: the probe waits. */
  @property({ type: Boolean }) busy = false;

  @state() private preview?: BatteryPreview;
  @state() private previewState: "idle" | "loading" | "ok" | "error" = "idle";
  /** Why the preview failed: the backend's message, its code and detail, or a failed command. */
  @state() private previewFailure: { error: string; code?: string | null; detail?: string | null } | null = null;
  @state() private open = new Set<OperationKey>();
  @state() private editing = new Set<OperationKey>();
  @state() private probing: OperationKey | null = null;
  @state() private probeResults: Partial<Record<OperationKey, ProbeResult>> = {};
  @state() private probeErrors: Partial<Record<OperationKey, string>> = {};
  /** "Verbindung prüfen": the inverter's last answer, whether one is on its way, and the address it answered for. */
  @state() private modbusCheck?: ModbusCheck;
  @state() private modbusChecking = false;
  @state() private modbusChecked: string | null = null;

  private previewTimer?: number;
  private previewSeq = 0;
  private modbusSeq = 0;
  /** The draft the preview was asked for last (the parent builds a new object each render). */
  private previewFor = "";
  /** The own steps of an operation as they were when editing began (undefined: there were none) – what "Verwerfen" brings back. */
  private editStart = new Map<OperationKey, ControlStep[] | undefined>();

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
      .op-title .chip.both {
        background: transparent;
        box-shadow: inset 0 0 0 1.5px var(--joe-line-2);
        color: var(--joe-ink-2);
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
      .op-steps .what .keep {
        color: var(--joe-ink-2);
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
      .probe li.info ha-icon {
        color: var(--joe-info);
      }
      /* "Fronius über Modbus": the address of the inverter and what it answers. */
      .modbus {
        display: grid;
        gap: 10px;
        margin-top: 12px;
      }
      .modbus-head {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px 8px;
      }
      .modbus-text {
        margin: 0;
        font-size: 14px;
        color: var(--joe-ink-2);
      }
      .modbus-fields {
        display: grid;
        grid-template-columns: minmax(0, 2fr) minmax(90px, 1fr) minmax(90px, 1fr);
        gap: 8px;
      }
      .modbus-field {
        display: grid;
        gap: 6px;
        min-width: 0;
      }
      .modbus-field .field-label {
        font-size: 13.5px;
      }
      .modbus-field .input {
        min-width: 0;
      }
      .modbus-hosts {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;
        font-size: 13.5px;
        color: var(--joe-ink-2);
      }
      @media (max-width: 520px) {
        .modbus-fields {
          grid-template-columns: 1fr 1fr;
        }
        .modbus-field.host {
          grid-column: 1 / -1;
        }
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
      /* The same list in edit mode: every row a card with name, value and tools. */
      .editor {
        display: grid;
        gap: 10px;
      }
      .editor .add {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .op-steps.edit {
        gap: 8px;
      }
      .op-steps li.edit {
        grid-template-columns: 24px minmax(0, 1fr) auto;
        gap: 6px 8px;
        padding: 6px 6px 8px 8px;
        border-radius: 10px;
        background: var(--joe-surface);
      }
      .op-steps li.edit .n {
        padding-top: 9px;
      }
      .op-steps li.edit .what {
        display: grid;
        gap: 6px;
        justify-items: start;
      }
      .edit .who {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0 4px;
        min-width: 0;
        max-width: 100%;
      }
      .edit .who .role {
        padding: 7px 0;
      }
      .name-btn {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        min-height: 34px;
        max-width: 100%;
        padding: 4px 8px 4px 6px;
        border: 0;
        border-radius: 8px;
        background: transparent;
        color: var(--joe-ink);
        font: inherit;
        text-align: left;
        cursor: pointer;
        transition: background 0.12s;
      }
      .name-btn b {
        font-weight: 600;
        overflow-wrap: anywhere;
        text-decoration: underline dotted var(--joe-line-2);
        text-decoration-thickness: 1.5px;
        text-underline-offset: 3px;
      }
      .name-btn ha-icon {
        --mdc-icon-size: 16px;
        flex: none;
        color: var(--joe-muted);
      }
      .name-btn:hover {
        background: var(--joe-surface-2);
      }
      .name-btn:hover ha-icon {
        color: var(--joe-ink-2);
      }
      .name-btn:active {
        transform: scale(0.98);
      }
      .edit .tools {
        display: flex;
        align-items: center;
        gap: 2px;
      }
      .edit .icon-btn:hover:not([disabled]) {
        background: var(--joe-surface-2);
      }
      .edit .icon-btn[disabled] {
        opacity: 0.3;
        cursor: not-allowed;
      }
      .edit .icon-btn[disabled]:active {
        transform: none;
      }
      .seg.onoff {
        flex-wrap: nowrap;
        border-radius: 999px;
      }
      .seg.onoff button {
        min-height: 32px;
        padding: 4px 14px;
        font-size: 13.5px;
      }
      .value-number {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;
        max-width: 100%;
      }
      .value-number .unit-input {
        width: 150px;
      }
      .value-number .unit-input .input {
        padding-right: 42px;
      }
      .value-number .input,
      .value-select,
      .value-text {
        min-height: 38px;
        padding: 6px 10px;
      }
      .value-select,
      .value-text {
        width: auto;
        max-width: 100%;
      }
      .ph {
        display: inline-flex;
        align-items: center;
        padding: 0;
        border: 0;
        background: transparent;
        font: inherit;
        cursor: pointer;
      }
      .ph .chip {
        transition: background 0.12s, color 0.12s;
      }
      .ph:hover .chip {
        background: var(--joe-line);
        color: var(--joe-ink);
      }
      .ph:active .chip {
        transform: scale(0.97);
      }
      .ph[aria-pressed="true"] .chip {
        background: var(--joe-ink);
        color: var(--joe-bg);
      }
      .op-restore .own-restore {
        font-weight: 500;
      }
      @media (pointer: coarse) {
        .icon-btn {
          width: 44px;
          height: 44px;
        }
        .name-btn,
        .seg.onoff button,
        .value-number .input,
        .value-select,
        .value-text,
        .ph {
          min-height: 44px;
        }
        .ph {
          min-width: 44px;
          justify-content: center;
        }
        .op-steps li.edit .n {
          padding-top: 14px;
        }
        .edit .who .role {
          padding: 12px 0;
        }
      }
      @media (max-width: 520px) {
        .row {
          grid-template-columns: 1fr auto;
        }
        .op-steps li.edit {
          grid-template-columns: 24px minmax(0, 1fr);
        }
        .edit .tools {
          grid-column: 2;
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
    const found = this.found;
    const foundKey = found && found.controllable && found.adapter !== "none" ? found.adapter : null;
    if (battery?.adapter === MODBUS_ADAPTER) {
      // Steered over Modbus: "Automatisch" stands for the integration's own profile.
      return foundKey ?? MODBUS_CORE;
    }
    if (battery && !["none", "generic", "steps"].includes(battery.adapter)) {
      return battery.adapter;
    }
    return foundKey;
  }

  /** The battery comes from the Fronius integration: Joe may speak Modbus TCP with its inverter himself. */
  private get modbusOffered(): boolean {
    const adapter = this.battery?.adapter;
    return adapter === MODBUS_ADAPTER || adapter === MODBUS_CORE || this.found?.integration === MODBUS_CORE || this.found?.adapter === MODBUS_CORE;
  }

  /** The battery is saved as steered over Modbus: Joe's entities exist, or he is making them. */
  private get modbusSaved(): boolean {
    return this.battery?.adapter === MODBUS_ADAPTER;
  }

  /** Saved over Modbus, but Joe has not filled in his entities yet (he does after the inverter's first answer). */
  private get modbusPending(): boolean {
    return this.modbusSaved && this.value?.adapter === MODBUS_ADAPTER && !Object.keys(this.battery?.controls ?? {}).length;
  }

  private get choice(): Choice {
    const adapter = this.value?.adapter ?? "none";
    if (adapter === "none") return "watch";
    if (adapter === "generic") return "generic";
    if (adapter === "steps") return "steps";
    if (adapter === MODBUS_ADAPTER) return "modbus";
    return "profile";
  }

  /** The name of the profile in force (from the preview, else the draft's adapter). */
  private get profileName(): string {
    const key = this.preview?.profile?.key ?? (this.choice === "profile" || this.choice === "modbus" ? this.value?.adapter : undefined) ?? "";
    return this.preview?.profile?.name ?? this.profiles?.[key] ?? key;
  }

  /** The profile whose words the levers get (the preview's, else the draft's adapter); "" without one. */
  private get roleProfile(): string {
    const adapter = this.value?.adapter ?? "";
    return this.preview?.profile?.key ?? (["none", "generic", "steps"].includes(adapter) ? "" : adapter);
  }

  /** A lever in the owner's words: the profile's own name where it has one ("Laderate" for the charge limit over Modbus), else the general one. */
  private roleName(t: Translate, role: string): string {
    const profile = this.roleProfile;
    return (profile ? t.optional(`role.${profile}.${role}`) : undefined) ?? t.optional(`role.${role}`) ?? role;
  }

  // --- The preview: asked for when the dialog opens and after every change of the draft ---

  protected updated(changed: PropertyValues<this>): void {
    // A probe ended somewhere (control.probe_running went away): the entities may show other values now.
    if (changed.has("probeRunning") && changed.get("probeRunning") && !this.probeRunning) {
      this.refreshPreview();
      return;
    }
    if (changed.has("value") || changed.has("battery") || changed.has("hass")) {
      this.schedulePreview();
    }
  }

  /** Asks for the preview again, also for an unchanged draft (after a probe wrote and put back). */
  private refreshPreview(): void {
    this.previewFor = "";
    this.schedulePreview();
  }

  private schedulePreview(): void {
    const { value, battery, hass } = this;
    if (!value || !battery || !hass) {
      return;
    }
    if (value.adapter === "none" || (value.adapter === MODBUS_ADAPTER && !this.modbusSaved)) {
      // Nothing is written while Joe only watches, and over Modbus his entities exist only once saved: no preview.
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
      if (result?.error) {
        // A draft the backend cannot read, or a preview that failed: an answer, not an exception.
        this.previewFailure = { error: result.error, code: result.code, detail: result.detail };
        this.previewState = "error";
        return;
      }
      this.preview = result;
      this.previewFailure = null;
      this.previewState = "ok";
    } catch (err) {
      if (seq !== this.previewSeq) return;
      this.previewFailure = { error: messageOf(err) };
      this.previewState = "error";
    }
  }

  /** The preview's failure in the owner's words (by its code), else with the backend's message. */
  private failureText(t: Translate): string {
    const failure = this.previewFailure;
    if (!failure) return "";
    const detail = failure.detail || failure.error;
    return (failure.code && t.optional(`preview.error.${failure.code}`, { detail })) || t("preview.error", { error: failure.error });
  }

  // --- Rendering ---

  protected render() {
    const { t, value } = this;
    if (!t || !value) {
      return nothing;
    }
    const choices: Choice[] = [
      "watch",
      ...(this.profileKey ? (["profile"] as Choice[]) : []),
      ...(this.modbusOffered ? (["modbus"] as Choice[]) : []),
      "generic",
      "steps",
    ];
    const suggested = this.found?.suggested;
    const choice = this.choice;
    // Over Modbus the operations and levers exist only once the choice is saved (Joe makes the entities then).
    const showOperations = choice !== "watch" && (choice !== "modbus" || this.modbusSaved);
    const showRoles = choice === "profile" || choice === "generic" || (choice === "modbus" && this.modbusSaved);
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
      ${choice === "modbus" ? this.renderModbus(t, value) : nothing}
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
      ${showOperations ? this.renderOperations(t, value) : nothing}
      ${showRoles ? this.renderRoles(t, value) : nothing}
      ${showOperations ? this.renderSummary(t) : nothing}
      ${showOperations ? html`<p class="field-hint">${t("f.battery.control.retest")}</p>` : nothing}`;
  }

  // --- "Fronius über Modbus": Joe speaks Modbus TCP with the inverter himself ---

  /**
   * Why (charging with the planned power instead of the inverter's ~500 W),
   * what Joe does, what to switch on in the inverter once, the address with
   * "Verbindung prüfen" and what the inverter answered. Saved, the head shows
   * the profile and the way back to the integration's own steering.
   */
  private renderModbus(t: Translate, value: ControlValue): TemplateResult {
    const settings: ModbusSettings = { host: "", ...MODBUS_DEFAULTS, ...(value.modbus ?? {}) };
    const saved = this.modbusSaved;
    const key = modbusKey(settings);
    // The inverter answered for this address – in this dialog, or before it was saved.
    const checked = key === this.modbusChecked || (saved && key === modbusKey(this.battery?.modbus));
    const hosts = (this.modbusCheck?.hosts ?? []).filter((host) => host !== settings.host);
    const name = this.profileName || this.profiles?.[MODBUS_ADAPTER] || MODBUS_ADAPTER;
    const number = (field: "port" | "unit", low: number, high: number) => (ev: Event) => {
      const input = ev.target as HTMLInputElement;
      const parsed = Number.parseInt(input.value, 10);
      if (!Number.isFinite(parsed) || parsed < low || parsed > high) {
        // Not a usable number: the field shows the value in force again.
        input.value = String(settings[field]);
        return;
      }
      this.setModbus(field === "port" ? { port: parsed } : { unit: parsed });
    };
    const enter = (ev: KeyboardEvent) => {
      if (ev.key === "Enter") {
        ev.preventDefault();
        (ev.target as HTMLInputElement).blur();
      }
    };
    return html`<div class="modbus" data-tipped>
      <div class="modbus-head">
        <span class="chip read"><ha-icon icon="mdi:lan-connect"></ha-icon>${name}</span>
        ${saved
          ? html`<button type="button" class="mini-btn quiet" @click=${() => this.choose("profile")}>
                <ha-icon icon="mdi:undo-variant"></ha-icon>${t("modbus.back")}
              </button>
              ${tip(t, "modbus_back")}`
          : nothing}
      </div>
      <p class="modbus-text">${t("modbus.why")}</p>
      <p class="modbus-text">${t("modbus.what")}</p>
      <div class="note">
        <ha-icon icon="mdi:wrench-outline"></ha-icon>
        <span>${t("modbus.setup")} ${t("modbus.exclusive")}</span>
      </div>
      <div class="modbus-fields">
        <div class="modbus-field host">
          <label class="field-label" for="modbus-host">${t("modbus.host")} ${tip(t, "modbus_host")}</label>
          <input
            id="modbus-host"
            class="input"
            type="text"
            inputmode="url"
            autocomplete="off"
            spellcheck="false"
            placeholder=${t("modbus.host.placeholder")}
            .value=${settings.host}
            @change=${(ev: Event) => this.setModbus({ host: (ev.target as HTMLInputElement).value.trim() })}
            @keydown=${enter}
          />
        </div>
        <div class="modbus-field">
          <label class="field-label" for="modbus-port">${t("modbus.port")} ${tip(t, "modbus_port")}</label>
          <input id="modbus-port" class="input" type="number" inputmode="numeric" min="1" max="65535" step="1" .value=${String(settings.port)} @change=${number("port", 1, 65535)} @keydown=${enter} />
        </div>
        <div class="modbus-field">
          <label class="field-label" for="modbus-unit">${t("modbus.unit")} ${tip(t, "modbus_unit")}</label>
          <input id="modbus-unit" class="input" type="number" inputmode="numeric" min="0" max="255" step="1" .value=${String(settings.unit)} @change=${number("unit", 0, 255)} @keydown=${enter} />
        </div>
      </div>
      ${hosts.length
        ? html`<div class="modbus-hosts">
            <span>${t("modbus.hosts")}</span>
            ${hosts.map((host) => html`<button type="button" class="mini-btn" @click=${() => this.setModbus({ host })}>${host}</button>`)}
          </div>`
        : nothing}
      <div class="op-actions">
        <button type="button" class="mini-btn go" ?disabled=${this.modbusChecking} @click=${() => void this.checkModbus(settings)}>
          <ha-icon icon="mdi:lan-check"></ha-icon>${t("modbus.check")}
        </button>
        ${tip(t, "modbus_check")}
        ${this.modbusChecking ? html`<span class="last" role="status">${t("modbus.checking")}</span>` : nothing}
      </div>
      ${this.modbusCheck && !this.modbusChecking ? this.renderModbusResult(t, this.modbusCheck) : nothing}
      ${!checked && !this.modbusChecking
        ? html`<div class="note warn" role="status"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${t("modbus.unchecked")}</span></div>`
        : nothing}
      ${saved ? nothing : html`<p class="field-hint hint">${t("modbus.after_save")}</p>`}
    </div>`;
  }

  /** What the inverter answered: the model found and what it holds right now, or the problem in the owner's words. */
  private renderModbusResult(t: Translate, check: ModbusCheck): TemplateResult {
    if (!check.ok) {
      const problem = check.problem ?? "unknown";
      const vars = { host: check.host ?? "", port: check.port ?? MODBUS_DEFAULTS.port, problem, detail: check.detail ?? "" };
      const text =
        problem === "connect" || problem === "timeout"
          ? t("modbus.problem.connect", vars)
          : problem.startsWith("illegal_")
            ? t("modbus.problem.illegal", vars)
            : (t.optional(`modbus.problem.${problem}`, vars) ?? t("modbus.problem.other", vars));
      return html`<div class="probe bad" role="status"><p class="problem">${text}</p></div>`;
    }
    const n = (value: number | null | undefined, digits = 0) => (value == null ? "–" : formatNumber(t.lang, value, digits));
    const onOff = (on: boolean | undefined) => t(on ? "op.step.on" : "op.step.off");
    const found = [
      check.model || t("modbus.found.inverter"),
      check.version ? t("modbus.found.version", { version: check.version }) : "",
      check.serial ? t("modbus.found.serial", { serial: check.serial }) : "",
    ]
      .filter(Boolean)
      .join(" · ");
    const kind = (check.kind && t.optional(`modbus.kind.${check.kind}`)) || check.kind || "";
    const status = (check.status && t.optional(`modbus.status.${check.status}`)) || check.status || t("modbus.status.unknown");
    return html`<div class="probe ok" role="status">
      <ul>
        <li class="ok">
          <ha-icon icon="mdi:check-circle"></ha-icon>
          <span><b>${t("modbus.found", { what: found })}</b><small>${t("modbus.found.layout", { kind, base: n(check.base) })}</small></span>
        </li>
        <li class="info">
          <ha-icon icon="mdi:flash-outline"></ha-icon>
          <span
            >${check.max_power_w != null ? t("modbus.found.max_power", { power: n(check.max_power_w) }) : t("modbus.found.max_power.none")}
            ${check.inverter_w != null ? html`<small>${t("modbus.found.inverter_w", { power: n(check.inverter_w) })}</small>` : nothing}</span
          >
        </li>
        <li class="info">
          <ha-icon icon="mdi:battery-heart-variant"></ha-icon>
          <span
            >${t("modbus.found.state", {
              level: n(check.level_pct),
              status,
              reserve: n(check.reserve_pct),
              charge: n(check.charge_rate_pct, 1),
              discharge: n(check.discharge_rate_pct, 1),
              grid: onOff(check.grid_charging),
            })}
            <small>${t("modbus.found.bits", { charge: onOff(check.charge_limited), discharge: onOff(check.discharge_limited) })}</small></span
          >
        </li>
      </ul>
    </div>`;
  }

  /** "Verbindung prüfen": asks the inverter; without settings the backend tries the addresses of the Fronius integration. */
  private async checkModbus(settings?: ModbusSettings): Promise<void> {
    const hass = this.hass;
    if (!hass) {
      return;
    }
    const seq = ++this.modbusSeq;
    this.modbusChecking = true;
    try {
      const msg: { type: string; [key: string]: unknown } = { type: "energy_joe/modbus/check" };
      if (settings?.host.trim()) msg.host = settings.host.trim();
      if (settings) {
        msg.port = settings.port;
        msg.unit = settings.unit;
      }
      const result = await hass.callWS<ModbusCheck>(msg);
      if (seq !== this.modbusSeq) return;
      this.modbusCheck = { ...result, hosts: result.hosts ?? [] };
      if (result.ok) {
        this.modbusChecked = modbusKey({
          host: result.host ?? settings?.host ?? "",
          port: result.port ?? settings?.port ?? MODBUS_DEFAULTS.port,
          unit: result.unit ?? settings?.unit ?? MODBUS_DEFAULTS.unit,
        });
      }
      // Opened without an address: the one that answered, else the first the integration knows, goes into the field.
      const host = (result.ok && result.host) || result.hosts?.[0] || result.host;
      if (host && !this.value?.modbus?.host.trim()) {
        this.setModbus({ host });
      }
    } catch (err) {
      if (seq !== this.modbusSeq) return;
      this.modbusCheck = { ok: false, problem: "error", detail: messageOf(err), hosts: [] };
    } finally {
      if (seq === this.modbusSeq) {
        this.modbusChecking = false;
      }
    }
  }

  private setModbus(change: Partial<ModbusSettings>): void {
    const value = this.value!;
    const modbus: ModbusSettings = { host: "", ...MODBUS_DEFAULTS, ...(value.modbus ?? {}), ...change };
    this.emit({ ...value, modbus });
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
    const error = this.previewState === "error" ? this.failureText(t) : "";
    return html`<div class="sub" data-tipped>${t("preview.title")} ${tip(t, "operations")}</div>
      ${this.choice === "steps" ? html`<p class="field-hint hint">${t("preview.steps_tab")}</p>` : nothing}
      ${this.dirty ? html`<p class="field-hint hint" role="status">${t("preview.dirty")}</p>` : nothing}
      ${this.modbusPending
        ? html`<div class="note" role="status"><ha-icon icon="mdi:progress-clock"></ha-icon><span>${t("modbus.pending")}</span></div>`
        : nothing}
      ${error ? html`<div class="note warn" role="status"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${error}</span></div>` : nothing}
      ${loading ? html`<p class="field-hint hint" role="status">${t("preview.loading")}</p>` : nothing}
      <div class="ops">
        ${this.operations(value)
          .filter((info) => !this.folded(info))
          .map((info) => this.renderOperation(t, value, info))}
      </div>`;
  }

  /** "Nachts den Stand halten" writes what "Warten" writes: the dialog shows one row for both. */
  private folded(info: PreviewOperation): boolean {
    return info.op === "hold" && info.same_as === "block";
  }

  /** Whether "Warten" stands for the night's holding too (the hold row is folded into it). */
  private get holdFolded(): boolean {
    return (this.preview?.operations ?? []).some((info) => this.folded(info));
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
    const bothChip = op === "block" && this.holdFolded ? html`<span class="chip both">${t("op.block.both")}</span>` : nothing;
    return html`<div class="op ${info.possible ? "" : "off"}" data-tipped>
      <div class="op-row">
        <button type="button" class="op-head" aria-expanded=${String(open)} @click=${() => this.toggle(op)}>
          <ha-icon icon=${open ? "mdi:chevron-down" : "mdi:chevron-right"}></ha-icon>
          <span class="op-title">
            <span><b>${t.optional(`op.${op}`) ?? op}</b>${sourceChip}${bothChip}</span>
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
            ${editing ? this.renderEditor(t, value, op as StepName, info) : this.renderSteps(t, info)}
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
        return html`<span class="chip read">${t("op.source.service", { name: this.profileName })}</span>`;
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
        if (p.target == null && p.power_w == null) return "";
        // The device sets the power itself (Fronius raising its reserve: ~500 W): say so instead of "mit 500 W".
        return t(p.power_by === "device" ? "op.example.charge.device" : "op.example.charge", {
          target: n(p.target),
          power: n(p.power_w),
          name: this.profileName || t("modbus.found.inverter"),
        });
      case "hold":
        return p.floor != null ? t("op.example.hold", { floor: n(p.floor) }) : "";
      case "cap": {
        // The cap is a share of the highest charging power ({percent}) or that share in W: the
        // step that stands for it says which, with the value the backend worked out.
        const step = info.steps.find((s) => s.kind === "set" && (s.param === "power" || s.param === "percent"));
        if (step?.param === "power" && typeof step.value === "number") {
          return t("op.example.cap.power", { power: n(step.value) });
        }
        if (step?.param === "power" && p.power_w != null && p.percent != null) {
          return t("op.example.cap.power", { power: n((p.power_w * p.percent) / 100) });
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
                  >${this.rolePrefix(t, item.role, item.name || entityName(hass, item.entity_id))}<b
                    >${item.name || entityName(hass, item.entity_id)}</b
                  ><span class="arrow">→</span
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
      // "Ziel 80 % · Leistung 2.000 W": the unit a field of the service takes, where the panel knows it.
      const parts = data.map(
        ([key, value]) => `${t.optional(`op.data.${key}`) ?? key} ${this.valueText(t, value as never, t.optional(`op.data.unit.${key}`), params)}`,
      );
      return html`<b>${t("op.step.service", { service: step.service ?? "" })}</b>${parts.length ? html` <span class="now">(${parts.join(" · ")})</span>` : nothing}`;
    }
    const name = step.name || (step.entity_id ? entityName(hass, step.entity_id) : "");
    const role = step.role && step.role !== "prepare" ? this.rolePrefix(t, step.role, name) : nothing;
    const unit = step.unit ?? this.unitOf(step.entity_id);
    if (step.keep) {
      // The entity shows the value already: nothing is written ("bleibt bei 100 %").
      return html`${role}<b>${name}</b><span class="arrow">·</span
        ><span class="keep">${t("op.step.keep", { value: this.valueText(t, step.value, unit, params) })}</span>`;
    }
    return html`${role}<b>${name}</b><span class="arrow">→</span
      ><b>${this.valueText(t, step.value, unit, params)}</b>
      ${step.current != null ? html` <span class="now">(${t("op.step.now", { value: this.currentText(t, step.current, unit) })})</span>` : nothing}`;
  }

  /** "Ladegrenze · " before an entity's name – left out where the entity is named like the lever (Joe's own Modbus entities). */
  private rolePrefix(t: Translate, role: string | null | undefined, name: string): TemplateResult | typeof nothing {
    if (!role) return nothing;
    const text = this.roleName(t, role);
    return text === name ? nothing : html`<span class="role">${text} · </span>`;
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
    // A probe of this operation going on: started here, or by another session (control.probe_running).
    const elsewhere = this.probeRunning && this.battery && this.probeRunning.battery === this.battery.id ? this.probeRunning.op : null;
    const running = this.probing === op || elsewhere === op;
    // While any probe or a test run goes on, no other probe starts (the backend says "busy" too).
    const blocked = Boolean(this.probing || this.probeRunning || this.busy);
    // Nothing of its own to write (the release without own steps): nothing to probe.
    const nothingToProbe = info.possible && !info.steps.length;
    const canProbe = info.possible && !nothingToProbe && !this.dirty && !blocked && !editing;
    const last = this.lastProbe(op);
    const back: TipName = "own_back";
    const backLabel = this.choice === "steps" ? t("op.own.back.steps") : this.choice === "generic" ? t("op.own.back.generic") : t("op.own.back.profile");
    return html`<div class="op-actions" data-tipped>
      ${running
        ? html`<span class="chip">${t("op.probe.running")}</span>`
        : nothingToProbe
          ? html`<span class="last">${t("op.probe.nothing")}</span>`
          : html`<button type="button" class="mini-btn" ?disabled=${!canProbe} @click=${() => this.probe(op)}>
              <ha-icon icon="mdi:test-tube"></ha-icon>${t("op.probe")}
            </button>`}
      ${tip(t, "probe")}
      ${nothingToProbe
        ? nothing
        : html`<span class="last ${last ? (last.ok ? "ok" : "bad") : ""}">
            ${last
              ? t(last.ok ? "op.probe.last.ok" : "op.probe.last.failed", { when: `${dayText(t.lang, last.at, "short")}, ${timeOf(last.at)}` })
              : t("op.probe.never")}
          </span>`}
      ${blocked && !running && info.possible && !nothingToProbe ? html`<span class="last" role="status">${t("op.probe.busy")}</span>` : nothing}
      ${editable
        ? editing
          ? html`<button type="button" class="mini-btn go" @click=${() => this.finishEditing(op)}>${t("op.own.done")}</button>
              ${tip(t, "own_done")}
              <button type="button" class="mini-btn quiet" @click=${() => this.discardEditing(op)}>${t("op.own.discard")}</button>
              ${tip(t, "own_discard")}`
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

  // --- Own steps per operation: the same list, every row editable ---

  /**
   * The list in edit mode: number, role and name as before, but the name
   * swaps the entity, the value is a control the entity understands, and
   * every row has its order and a remove. The value's placeholders are the
   * ones of this operation (valueHints).
   */
  private renderEditor(t: Translate, value: ControlValue, name: StepName, info: PreviewOperation): TemplateResult {
    const steps = value.steps[name] ?? [];
    const params = info.params ?? {};
    return html`<div class="editor" data-op=${name} data-tipped>
      ${steps.length
        ? html`<ol class="op-steps edit">
            ${steps.map((step, index) => this.renderEditRow(t, value, name, step, index, steps.length, params))}
          </ol>`
        : html`<p class="field-hint hint">${t("op.own.empty")}</p>`}
      <div class="add">
        <button type="button" class="mini-btn" @click=${() => this.addStep(name)}>
          <ha-icon icon="mdi:plus"></ha-icon>${t("f.battery.steps.add")}
        </button>
        ${tip(t, "control_steps", PLACEHOLDERS)}
      </div>
      <div class="op-restore"><small class="own-restore">${t("op.own.restore")}</small></div>
    </div>`;
  }

  private renderEditRow(
    t: Translate,
    value: ControlValue,
    name: StepName,
    step: ControlStep,
    index: number,
    count: number,
    params: PreviewParams,
  ): TemplateResult {
    const hass = this.hass!;
    const entityId = step.entity_id ?? "";
    const kind: StepKind = step.service ? "service" : this.stepKind(entityId);
    const tipName: TipName = `step_${kind === "trigger" ? "text" : kind}`;
    const tools = html`<span class="tools">
      <button
        type="button"
        class="icon-btn"
        aria-label=${t("op.own.up")}
        title=${t("op.own.up")}
        ?disabled=${index === 0}
        @click=${() => this.moveStep(name, index, -1)}
      >
        <ha-icon icon="mdi:arrow-up"></ha-icon>
      </button>
      <button
        type="button"
        class="icon-btn"
        aria-label=${t("op.own.down")}
        title=${t("op.own.down")}
        ?disabled=${index === count - 1}
        @click=${() => this.moveStep(name, index, 1)}
      >
        <ha-icon icon="mdi:arrow-down"></ha-icon>
      </button>
      <button type="button" class="icon-btn" aria-label=${t("f.remove")} title=${t("f.remove")} @click=${() => this.removeStep(name, index)}>
        <ha-icon icon="mdi:close"></ha-icon>
      </button>
      ${tip(t, tipName, PLACEHOLDERS)}
    </span>`;
    if (step.service) {
      // A service call of the profile: readable with its data, movable and removable, not editable.
      return html`<li class="edit" data-tipped>
        <span class="n">${index + 1}.</span>
        <span class="what"><span class="who">${this.stepText(t, { kind: "call", service: step.service, data: step.data ?? {} }, params)}</span></span>
        ${tools}
      </li>`;
    }
    const role = this.roleOf(value, entityId);
    const label = entityName(hass, entityId);
    return html`<li class="edit" data-tipped>
      <span class="n">${index + 1}.</span>
      <span class="what">
        <span class="who">
          ${this.rolePrefix(t, role, label)}
          <button
            type="button"
            class="name-btn"
            title=${t("op.own.swap")}
            aria-label=${`${t("op.own.swap")}: ${label}`}
            @click=${() => this.swapStep(name, index)}
          >
            <b>${label}</b><ha-icon icon="mdi:swap-horizontal"></ha-icon>
          </button>
        </span>
        ${this.renderStepValue(t, name, step, index, kind)}
      </span>
      ${tools}
    </li>`;
  }

  /** The value as the entity takes it: on/off, one of its options, a number with its unit and the placeholders, or text. */
  private renderStepValue(t: Translate, name: StepName, step: ControlStep, index: number, kind: StepKind): TemplateResult {
    const entityId = step.entity_id ?? "";
    const current = step.value;
    const text = current == null ? "" : String(current);
    const label = t("f.battery.steps.value");
    const commit = (ev: Event) => this.setStepValue(name, index, (ev.target as HTMLInputElement).value);
    // Enter takes the value like leaving the field does.
    const enter = (ev: KeyboardEvent) => {
      if (ev.key === "Enter") {
        ev.preventDefault();
        (ev.target as HTMLInputElement).blur();
      }
    };
    switch (kind) {
      case "toggle": {
        const on = current === true || current === "on" || current === "true";
        const off = current === false || current === "off" || current === "false";
        return html`<span class="seg onoff" role="group" aria-label=${label}>
          <button type="button" aria-pressed=${String(on)} @click=${() => this.setStepValue(name, index, "on")}>${t("op.step.on")}</button>
          <button type="button" aria-pressed=${String(off)} @click=${() => this.setStepValue(name, index, "off")}>${t("op.step.off")}</button>
        </span>`;
      }
      case "option": {
        const options = this.valueHints(entityId, name);
        // A value the entity does not offer (from an older configuration) stays visible until it is changed.
        const all = text && !options.includes(text) ? [text, ...options] : options;
        return html`<select class="input value-select" aria-label=${label} @change=${commit}>
          ${all.map((option) => html`<option value=${option} ?selected=${option === text}>${option}</option>`)}
        </select>`;
      }
      case "number": {
        const attrs = this.hass?.states[entityId]?.attributes ?? {};
        const unit = this.unitOf(entityId);
        const range =
          typeof attrs.min === "number" && typeof attrs.max === "number"
            ? `${formatNumber(t.lang, attrs.min, 2)} – ${formatNumber(t.lang, attrs.max, 2)}`
            : "";
        const hints = this.valueHints(entityId, name);
        return html`<span class="value-number">
          <span class="unit-input">
            <input
              class="input"
              type="text"
              inputmode="decimal"
              aria-label=${label}
              placeholder=${range}
              .value=${text}
              @change=${commit}
              @keydown=${enter}
            />
            ${unit ? html`<span class="unit">${unit}</span>` : nothing}
          </span>
          ${hints.map(
            (hint) => html`<button
              type="button"
              class="ph"
              aria-pressed=${String(text === hint)}
              aria-label=${t("op.own.insert", { value: hint })}
              title=${t("op.own.insert", { value: hint })}
              @click=${(ev: Event) => {
                // The field shows the placeholder at once, also over something typed but not taken yet.
                const input = (ev.currentTarget as HTMLElement).closest(".value-number")?.querySelector("input");
                if (input) input.value = hint;
                this.setStepValue(name, index, hint);
              }}
            >
              <span class="chip">${hint}</span>
            </button>`,
          )}
        </span>`;
      }
      case "trigger":
        // A script or a button is only triggered: no value to give.
        return html`<span class="now">${t("op.own.trigger")}</span>`;
      default:
        return html`<input class="input value-text" type="text" aria-label=${label} placeholder=${label} .value=${text} @change=${commit} @keydown=${enter} />`;
    }
  }

  /** What an entity takes: a switch, an option, a number, a trigger (script, button) or text. */
  private stepKind(entityId: string): Exclude<StepKind, "service"> {
    const domain = entityId.split(".", 1)[0];
    if (["switch", "input_boolean"].includes(domain)) return "toggle";
    if (["select", "input_select"].includes(domain)) return "option";
    if (["number", "input_number"].includes(domain)) return "number";
    if (["script", "button", "input_button"].includes(domain)) return "trigger";
    return "text";
  }

  /** The lever an entity is assigned to (how the preview labels a step), if any. */
  private roleOf(value: ControlValue, entityId: string): string | null {
    return Object.entries(value.controls).find(([, id]) => id === entityId)?.[0] ?? null;
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

  /**
   * A step's value for another entity: it stays when the entity takes it
   * (on/off for a switch, an option it offers, a number or one of this
   * operation's placeholders), else the first hint for the entity.
   */
  private fitValue(value: ControlStep["value"], entityId: string, name: StepName): ControlStep["value"] {
    const hints = this.valueHints(entityId, name);
    const first = hints.length ? parseValue(hints[0]) : null;
    switch (this.stepKind(entityId)) {
      case "toggle":
        if (value === true || value === "on" || value === "true") return "on";
        if (value === false || value === "off" || value === "false") return "off";
        return first;
      case "option":
        return typeof value === "string" && hints.includes(value) ? value : first;
      case "number":
        if (typeof value === "number") return value;
        if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value.replace(",", ".")))) return Number(value.replace(",", "."));
        if (isPlaceholder(value) && hints.includes(value)) return value;
        return first;
      case "trigger":
        // A script or a button is only triggered: no value to keep.
        return null;
      default:
        return value ?? null;
    }
  }

  /** "Selbst festlegen": the preview's steps become the owner's, then the list turns editable. */
  private startEditing(op: OperationKey, info: PreviewOperation, hasOwn: boolean): void {
    const name = op as StepName;
    const value = this.value!;
    // What "Verwerfen" brings back.
    const before = value.steps[name];
    this.editStart.set(op, before?.length ? structuredClone(before) : undefined);
    // A profile's service steps are saved with the battery already (with their placeholders): they stay as they are.
    if (!hasOwn && !before?.length) {
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
    this.editStart.delete(op);
  }

  /** "Fertig": the list stays as it is; an empty one means no own steps (as "Zurück zum Profil"). */
  private finishEditing(op: OperationKey): void {
    const name = op as StepName;
    const value = this.value!;
    const steps = this.stepsWithTyped(name);
    if (!steps.length) {
      this.resetOwn(name);
      return;
    }
    this.stopEditing(op);
    if (JSON.stringify(steps) !== JSON.stringify(value.steps[name] ?? [])) {
      this.emit({ ...value, steps: { ...value.steps, [name]: steps } });
    }
  }

  /**
   * The steps of an operation with what is typed into its fields but not
   * taken yet: a browser that leaves the focus in a field when a button is
   * clicked (Safari) fires no change event before the click.
   */
  private stepsWithTyped(name: StepName): ControlStep[] {
    const steps = [...(this.value?.steps[name] ?? [])];
    const rows = this.renderRoot.querySelectorAll<HTMLLIElement>(`.editor[data-op="${name}"] li.edit`);
    rows.forEach((row, index) => {
      const input = row.querySelector<HTMLInputElement>("input.input");
      const step = steps[index];
      if (!input || !step || step.service) return;
      const typed = parseValue(input.value);
      if ((step.value ?? null) !== typed) {
        steps[index] = { ...step, value: typed };
      }
    });
    return steps;
  }

  /** "Verwerfen": the steps as they were when editing began; none before, none now. */
  private discardEditing(op: OperationKey): void {
    const value = this.value!;
    const name = op as StepName;
    const before = this.editStart.get(op);
    const steps = { ...value.steps };
    if (before?.length) {
      steps[name] = structuredClone(before);
    } else {
      delete steps[name];
    }
    this.stopEditing(op);
    this.emit({ ...value, steps });
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
    if (!hass || !battery || this.probing || this.probeRunning || this.busy) {
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
      // The probe wrote and put back: the "jetzt" values of the preview are stale either way.
      this.refreshPreview();
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
    const problem = result.problem ? this.problemText(t, result) : "";
    const nameOf = (step: { entity_id?: string; service?: string }) =>
      step.service ? t("op.step.service", { service: step.service }) : step.entity_id ? entityName(hass, step.entity_id) : "";
    const power = result.power_kw != null && Math.abs(result.power_kw) < 0.005 ? 0 : result.power_kw;
    return html`<div class="probe ${result.ok ? "ok" : "bad"}" role="status">
      ${problem ? html`<p class="problem">${problem}</p>` : nothing}
      ${result.steps?.length || !problem
        ? html`<ul>
            ${(result.steps ?? []).map((step) => {
              const good = step.taken && !step.error;
              const unit = this.unitOf(step.entity_id);
              const outcome = step.error
                ? t("op.probe.error", { error: t.optional(`devices.problem.${step.error}`) ?? step.error })
                : t(good ? (step.service ? "op.probe.call_taken" : "op.probe.taken") : "op.probe.not_taken");
              // A service call writes no value to read back: only whether it went through.
              const parts = step.service
                ? [outcome]
                : [
                    t("op.probe.wrote", {
                      wrote: this.valueText(t, step.wrote, unit, {}),
                      read: step.read == null ? "–" : this.currentText(t, String(step.read), unit),
                    }),
                    outcome,
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
      ${power != null ? html`<small>${t("devices.test.power", { value: formatNumber(t.lang, power, 2) })}</small>` : nothing}
    </div>`;
  }

  /** Why a probe was refused or could not run, in the owner's words (with the operation's reason or the missing levers). */
  private problemText(t: Translate, result: ProbeResult): string {
    const code = result.problem ?? "";
    if (code === "not_possible" && result.why) {
      return `${t("op.probe.problem.not_possible")} ${this.whyText(t, result.why)}`;
    }
    if (code === "controls_missing" && result.missing?.length) {
      return t("op.probe.problem.controls_missing.list", { missing: result.missing.map((role) => this.roleName(t, role)).join(", ") });
    }
    return t.optional(`op.probe.problem.${code}`) ?? t("op.probe.problem.other", { code });
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
              ${this.roleName(t, role)}${kind ? html` <span class="kind">(${kind})</span>` : nothing}
              ${used ? html`<small>${t("roles.used_by", { ops: used })}</small>` : nothing}
            </span>
            <span class="entity">
              ${entityId
                ? html`<b>${entityName(hass, entityId)}</b><small>${formatState(hass, entityId, t.lang)}</small>`
                : html`<small>${t("roles.unassigned")}</small>`}
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
    const folded = this.holdFolded;
    for (const key of OPERATIONS) {
      const info = byOp.get(key);
      if (!info || (folded && key === "hold")) continue;
      // "Warten" stands for the night's holding too: the summary says so instead of a line for "Halten".
      const short = `${t.optional(`op.short.${key}`) ?? key}${folded && key === "block" ? ` (${t("op.block.both")})` : ""}`;
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
    // Joe's own Modbus entities are no levers of the integration: another way starts without them.
    const own = value.adapter === MODBUS_ADAPTER ? {} : value.controls;
    if (choice === "watch") {
      this.emit({ ...value, adapter: "none", modbus: null });
    } else if (choice === "profile") {
      const key = this.profileKey!;
      const fromBattery = this.battery?.adapter === key ? this.battery : undefined;
      this.emit({
        ...value,
        adapter: key,
        controls: { ...(fromBattery?.controls ?? this.found?.controls ?? own) },
        mode_options: { ...(fromBattery?.mode_options ?? {}) },
        modbus: null,
      });
    } else if (choice === "modbus") {
      // Saved this way already: its entities and address; else the address typed before, else none yet –
      // then the backend looks for the inverter at the addresses of the Fronius integration.
      const fromBattery = this.battery?.adapter === MODBUS_ADAPTER ? this.battery : undefined;
      const modbus: ModbusSettings = { host: "", ...MODBUS_DEFAULTS, ...(fromBattery?.modbus ?? value.modbus ?? {}) };
      this.emit({ ...value, adapter: MODBUS_ADAPTER, controls: { ...(fromBattery?.controls ?? {}) }, mode_options: {}, modbus });
      if (!modbus.host.trim() && !this.modbusChecking) {
        void this.checkModbus();
      }
    } else if (choice === "generic") {
      const empty = !Object.keys(own).length;
      const suggested = this.found?.suggested;
      this.emit({
        ...value,
        adapter: "generic",
        controls: empty && suggested ? { ...suggested.controls } : own,
        mode_options: empty && suggested ? { ...suggested.mode_options } : value.mode_options,
        modbus: null,
      });
    } else {
      this.emit({ ...value, adapter: "steps", controls: own, modbus: null });
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
      heading: t("pick.role.title", { role: this.roleName(t, role) }),
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
      suggestions: this.nearby("writable").map((entity_id) => ({ entity_id })),
    });
    const entityId = picked?.selected[0];
    if (!entityId) return;
    const step: ControlStep = { entity_id: entityId, value: this.fitValue(null, entityId, name) };
    const value = this.value!;
    this.emit({ ...value, steps: { ...value.steps, [name]: [...this.stepsWithTyped(name), step] } });
  }

  /** The name of a step: another entity, the value kept where the new one takes it. */
  private async swapStep(name: StepName, index: number): Promise<void> {
    const t = this.t!;
    const current = this.value?.steps[name]?.[index];
    if (!current || current.service) return;
    const picked = await pickEntity(this, {
      heading: t("pick.step.title"),
      tip: "control_steps",
      tipVars: PLACEHOLDERS,
      filter: "writable",
      selected: current.entity_id ? [current.entity_id] : [],
      suggestions: this.nearby("writable").map((entity_id) => ({ entity_id })),
    });
    const entityId = picked?.selected[0];
    if (!entityId || entityId === current.entity_id) return;
    const value = this.value!;
    const steps = this.stepsWithTyped(name);
    steps[index] = { entity_id: entityId, value: this.fitValue(current.value, entityId, name) };
    this.emit({ ...value, steps: { ...value.steps, [name]: steps } });
  }

  /** A value typed or chosen for a step ("0", "{target}", "on", an option). */
  private setStepValue(name: StepName, index: number, raw: string): void {
    const value = this.value!;
    const steps = this.stepsWithTyped(name);
    const parsed = parseValue(raw);
    if (!steps[index]) return;
    steps[index] = { ...steps[index], value: parsed };
    if (JSON.stringify(steps) === JSON.stringify(value.steps[name] ?? [])) return;
    this.emit({ ...value, steps: { ...value.steps, [name]: steps } });
  }

  /** One row up (-1) or down (+1): the order is what the device gets. */
  private moveStep(name: StepName, index: number, delta: -1 | 1): void {
    const value = this.value!;
    const steps = this.stepsWithTyped(name);
    const to = index + delta;
    if (to < 0 || to >= steps.length) return;
    [steps[index], steps[to]] = [steps[to], steps[index]];
    this.emit({ ...value, steps: { ...value.steps, [name]: steps } });
  }

  private removeStep(name: StepName, index: number): void {
    const value = this.value!;
    const steps = this.stepsWithTyped(name).filter((_, i) => i !== index);
    this.emit({ ...value, steps: { ...value.steps, [name]: steps } });
  }

  private emit(value: ControlValue): void {
    this.dispatchEvent(new CustomEvent<ControlValue>("joe-control-change", { detail: value }));
  }
}

define("joe-battery-control", JoeBatteryControl);
