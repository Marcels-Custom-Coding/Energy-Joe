import { css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import "../../components/battery-automations";
import { automationsOf, loadBatteryAutomations, type BatteryAutomation } from "../../components/battery-automations";
import { displayTitle, sourceChip } from "../../components/bits";
import { daySurplus, limitInPercent, surplusAbility } from "../../components/day-surplus";
import { dayText } from "../../components/look-back";
import { timeOf } from "../../components/plan-text";
import "../../components/sheet";
import { batteryNotes, slowNote } from "../../components/battery-notes";
import { tip } from "../../components/tip";
import { saveConfig, sourceOf, withIgnored } from "../../config";
import { define } from "../../define";
import type { DeviceEntry } from "../../device-model";
import "../../editors/battery-control";
import { controlValue, withPrepare, type ControlValue } from "../../editors/battery-control";
import { entityName, formatNumber } from "../../entities";
import type { Translate } from "../../i18n";
import { batteryLearned, learnedRows, learnedStyles } from "../../learned-view";
import { closeSheet, href, navigate, onLink, revealAnchor, type Route } from "../../router";
import { shared } from "../../styles/shared";
import type { BatteryConfig, BatteryFinding, ControlView, JoeInfo, OperationKey, ProbeResult, TestResult, TestStep } from "../../types";
import { rolesChoices, rolesDetails } from "../overview/inbox";
import "./battery-fields";
import { deviceFrame, frameFromEntry, frameStyles } from "./device-frame";
import { DeviceSection } from "./section-base";

const STEPS = ["hold", "charge", "release"] as const;

/** Days of movement before Joe trusts what he measured (MIN_DAYS in learn/models.py). */
const MODEL_DAYS = 14;

type ControlDraft = ControlValue & { prepare: BatteryConfig["prepare"] };
const CONTROL_FIELDS = ["adapter", "controls", "mode_options", "steps", "prepare"] as const;

/**
 * "Regler einrichten" keeps its draft per battery while the panel is open
 * (closing is not cancelling). `base` is the battery as saved when the draft
 * last changed: only fields changed here count, so a newer save elsewhere is
 * never written back with an old value.
 */
const drafts = new Map<string, { base: ControlDraft; draft: ControlDraft }>();

function controlOf(battery: BatteryConfig): ControlDraft {
  return { ...controlValue(battery), prepare: structuredClone(battery.prepare) };
}

const sameValue = (a: unknown, b: unknown) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

/** How Joe steers a battery, in a few words. */
export function controlKind(t: Translate, battery: BatteryConfig, info: JoeInfo | undefined): string {
  switch (battery.adapter) {
    case "none":
      return t("devices.battery.watch");
    case "generic":
      return t("devices.battery.generic");
    case "steps":
      return t("devices.battery.steps");
    default:
      return t("devices.battery.profile", { name: info?.profiles?.[battery.adapter] ?? battery.adapter });
  }
}

/** What Joe does with a battery right now ("Hält bei 20 %", "Nur beobachtet"). */
export function batteryNow(t: Translate, battery: BatteryConfig, control: ControlView | undefined): string {
  if (battery.adapter === "none") {
    return t("devices.action.watch");
  }
  const now = control?.batteries[battery.id];
  // Held back above its buffer on a grid-friendly morning: said with the buffer.
  const key = now?.action === "defer" && now.level != null ? "defer_buffer" : now?.action;
  return key
    ? t(`devices.action.${key}`, {
        target: formatNumber(t.lang, now?.target ?? 0, 0),
        floor: formatNumber(t.lang, now?.floor ?? 0, 0),
        until: now?.until ? timeOf(now.until) : "",
        level: formatNumber(t.lang, now?.level ?? 0, 0),
      })
    : t("devices.action.idle");
}

/** Joe found levers that may steer a battery he only watches. */
export function hasSuggestion(battery: BatteryConfig, found: BatteryFinding | undefined): boolean {
  return battery.adapter === "none" && Boolean(found?.suggested?.complete);
}

/** The address of "Regler einrichten" for a battery (a sheet over its page). */
export function controlRoute(id: string): Route {
  return { tab: "devices", section: "battery", id, sub: "control" };
}

/**
 * Speicherseite (/devices/battery/<id>): head with what Joe does now, Jetzt
 * (test run), Steuern (Regler einrichten and the battery's own values, saved
 * on change), Strom (sensors), Gelernt, Protokoll, Störenfriede (automations
 * writing to it) and Weglassen. /devices/battery/<id>/control opens
 * "Regler einrichten" as a sheet with a draft.
 */
export class JoeBatteryDevice extends DeviceSection {
  @property({ attribute: false }) entry?: DeviceEntry;
  /** "control": the sheet "Regler einrichten" is open. */
  @property({ attribute: false }) sub?: string;

  @state() private confirm = false;
  @state() private removing = false;
  @state() private saving = false;
  @state() private notice = "";
  /** "Übernehmen"/"So lassen" of the levers is on its way, and what it left to say. */
  @state() private answering = false;
  @state() private rolesNotice = "";
  @state() private automations: BatteryAutomation[] | null = null;
  private automationsFor = "";
  /** The anchor already revealed for /devices/battery/<id>/intruders. */
  private revealed = "";

  static styles = [
    shared,
    frameStyles,
    learnedStyles,
    css`
      :host {
        display: block;
      }
      .head-row {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .note {
        margin-top: 0;
      }
      .test {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .test .chip {
        margin-right: auto;
      }
      .steps {
        list-style: none;
        margin: 12px 0 0;
        padding: 0;
        display: grid;
        gap: 6px;
      }
      .steps li {
        display: grid;
        grid-template-columns: 22px auto 1fr;
        gap: 8px;
        align-items: start;
        font-size: 14px;
      }
      .steps li ha-icon {
        --mdc-icon-size: 18px;
        margin-top: 1px;
      }
      .steps li.ok ha-icon {
        color: var(--joe-good);
      }
      .steps li.bad ha-icon {
        color: var(--joe-crit);
      }
      .steps li.wait ha-icon {
        color: var(--joe-muted);
      }
      .steps small {
        color: var(--joe-ink-2);
      }
      .probes {
        margin: 10px 0 0;
        font-size: 13.5px;
        color: var(--joe-ink-2);
      }
      .probes .ok {
        color: var(--joe-good);
      }
      .probes .bad {
        color: var(--joe-crit);
      }
      .roles-note {
        margin-bottom: 12px;
      }
      .control-row {
        display: flex;
        align-items: center;
        gap: 8px 12px;
        flex-wrap: wrap;
        padding-bottom: 14px;
        margin-bottom: 4px;
        border-bottom: 1px solid var(--joe-line);
      }
      .control-text {
        flex: 1 1 180px;
        min-width: 0;
        display: grid;
        gap: 2px;
      }
      .control-text small {
        color: var(--joe-muted);
        font-size: 13px;
      }
      .control-text b {
        font-weight: 700;
      }
      .control-text .mini-btn {
        justify-self: start;
        margin-top: 6px;
      }
      .ref-field {
        padding-bottom: 14px;
        margin: 0 0 4px;
        border-bottom: 1px solid var(--joe-line);
      }
      .field-row {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      @media (pointer: coarse) {
        .ref-field .input {
          min-height: 44px;
        }
      }
      a.btn {
        text-decoration: none;
      }
      .suggest {
        margin: 10px 0 0;
      }
      .remove-text,
      .sheet-text {
        margin: 0;
        color: var(--joe-ink-2);
        line-height: 1.55;
      }
      .sheet-text {
        margin-top: 12px;
      }
      .remove .actions {
        margin-top: 12px;
      }
      .remove .note {
        margin-top: 12px;
      }
      .rows {
        margin-top: 0;
      }
      /* Save and cancel stay in view at the bottom of the sheet (as in the week sheet). */
      .steer-bar {
        position: sticky;
        bottom: -22px;
        z-index: 1;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
        margin: 22px -22px -22px;
        padding: 12px 22px 16px;
        background: var(--joe-surface);
        box-shadow: 0 -1px 0 var(--joe-line);
      }
      .steer-bar .unsaved {
        flex-basis: 100%;
        color: var(--joe-ink-2);
        font-weight: 600;
      }
      @media (max-width: 600px) {
        .steer-bar {
          bottom: calc(-20px - env(safe-area-inset-bottom));
          margin: 20px -16px calc(-20px - env(safe-area-inset-bottom));
          padding: 10px 16px calc(12px + env(safe-area-inset-bottom));
        }
      }
    `,
  ];

  private get battery(): BatteryConfig | undefined {
    return this.entry?.battery;
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    const id = this.battery?.id ?? "";
    if (changed.has("entry") && id !== this.automationsFor) {
      this.removing = false;
      this.notice = "";
    }
    if (this.hass && id && id !== this.automationsFor) {
      this.automationsFor = id;
      this.automations = null;
      void loadBatteryAutomations(this.hass).then((items) => {
        if (this.automationsFor === id) {
          this.automations = items;
        }
      });
    }
  }

  protected updated(): void {
    // /devices/battery/<id>/intruders: scroll to the "Störenfriede" once they are there.
    const target = this.sub === "intruders" ? `${this.battery?.id}/intruders` : "";
    if (!target) {
      this.revealed = "";
    } else if (this.revealed !== target && revealAnchor(this.renderRoot, "intruders")) {
      this.revealed = target;
    }
  }

  protected render() {
    const { t, entry } = this;
    const joe = this.state;
    const battery = this.battery;
    if (!t || !joe || !entry || !battery) {
      return nothing;
    }
    const control = joe.control;
    const found = this.discovery?.batteries.find((b) => b.id === battery.id);
    const steered = battery.adapter !== "none";
    const mine = automationsOf(this.automations ?? [], battery.id);
    return html`${deviceFrame(this.ctx, {
        ...frameFromEntry(this.ctx, entry),
        why: batteryNow(t, battery, control),
        head: this.renderHead(t, battery, found),
        now: steered ? this.renderTest(t, battery, control) : undefined,
        steer: this.renderSteer(t, battery),
        power: this.renderPower(t, battery),
        learned: learnedRows([batteryLearned(t, joe.config, joe.config.learned, battery, MODEL_DAYS)]),
        learnedArea: "battery",
        intruders: mine.length ? this.renderIntruders(t, battery) : undefined,
        remove: this.renderRemove(t, battery),
        tips: {
          now: "devices_test",
          steer: "f_battery_control",
          intruders: "battery_intruders",
          remove: "battery_remove",
        },
      })}
      ${this.confirm ? this.renderConfirm(t, battery) : nothing}
      ${this.sub === "control" ? this.renderControl(t, battery, found) : nothing}`;
  }

  /** How Joe steers it, and a hint when he found levers for a battery he only watches. */
  private renderHead(t: Translate, battery: BatteryConfig, found: BatteryFinding | undefined): TemplateResult {
    const to = controlRoute(battery.id);
    return html`<div class="head-row">
        <span class="chip ${battery.adapter !== "none" ? "read" : ""}">${controlKind(t, battery, this.info)}</span>
      </div>
      ${hasSuggestion(battery, found)
        ? html`<div class="note">
            <ha-icon icon="mdi:lightbulb-on-outline"></ha-icon>
            <span
              >${t("devices.suggested")}
              <div class="note-actions">
                <a class="mini-btn go" href=${href(this.prefix, to)} @click=${onLink(to, { sheet: true })}>${t("devices.setup")}</a>
              </div></span
            >
          </div>`
        : nothing}
      ${batteryNotes(t, found?.notes, battery.name)}
      ${slowNote(t, battery, this.state?.control)}
      ${this.notice ? html`<div class="note warn" role="status"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.notice}</span></div>` : nothing}`;
  }

  // --- Jetzt: the test run ---

  private renderTest(t: Translate, battery: BatteryConfig, control: ControlView | undefined): TemplateResult {
    const ready = control?.ready[battery.id] ?? "not_controllable";
    const testing = control?.testing?.battery === battery.id ? control.testing : null;
    const test = control?.tests[battery.id];
    // A probe of one operation (the dialog) and a test run never run at once.
    const probe = control?.probe_running;
    const busy = Boolean(control?.testing) || Boolean(probe);
    const steering = Boolean(control?.steering);
    const probing =
      probe?.battery === battery.id
        ? html`<span class="chip">${t("battery.probe.running", { op: t.optional(`op.short.${probe.op}`) ?? probe.op })}</span>`
        : nothing;
    const chip = testing
      ? html`<span class="chip">${t("devices.test.running")}</span>`
      : ready === "outdated"
        ? html`<span class="chip warn">${t("devices.test.outdated")}</span>`
        : test
          ? html`<span class="chip ${test.ok ? "ok" : "warn"}"
              >${t(test.ok ? "devices.test.ok" : "devices.test.failed", { day: dayText(t.lang, test.at, "short") })}</span
            >`
          : html`<span class="chip">${t("devices.test.none")}</span>`;
    const steps = testing?.steps ?? test?.steps ?? [];
    return html`<div class="test">
        ${chip} ${probing}
        <button type="button" class="btn btn-secondary" ?disabled=${busy || steering} @click=${() => (this.confirm = true)}>
          <ha-icon icon="mdi:play-circle-outline"></ha-icon>${t(test ? "devices.test.again" : "devices.test.start")}
        </button>
      </div>
      ${testing || test ? this.renderSteps(t, steps, testing?.step ?? null, test) : nothing}
      ${this.renderProbes(t, battery)}`;
  }

  /** "Proben: Laden ✓ 18.10. · Warten ✗ 17.10." – the last probe of each operation (the dialog has the details). */
  private renderProbes(t: Translate, battery: BatteryConfig): TemplateResult | typeof nothing {
    const probes = this.state?.probes?.[battery.id];
    const entries = Object.entries(probes ?? {}).filter((entry): entry is [string, ProbeResult] => Boolean(entry[1]));
    if (!entries.length) {
      return nothing;
    }
    const items = entries.map(([op, probe]) => {
      const name = t.optional(`op.short.${op as OperationKey}`) ?? op;
      return html`<span class=${probe.ok ? "ok" : "bad"}
        >${t(probe.ok ? "battery.probes.ok" : "battery.probes.failed", { op: name, day: dayText(t.lang, probe.at, "short") })}</span
      >`;
    });
    return html`<p class="probes">${t("battery.probes", { list: "" })}${items.map((item, i) => html`${i ? " · " : ""}${item}`)}</p>`;
  }

  private renderSteps(t: Translate, done: TestStep[], running: string | null, test: TestResult | undefined): TemplateResult {
    const byName = new Map(done.map((step) => [step.step, step]));
    const problem =
      !running && test?.problem
        ? t.optional(`devices.test.problem.${test.problem}`, {
            missing: (test.missing ?? []).map((m) => t.optional(`role.${m}`) ?? m).join(", "),
          })
        : null;
    if (problem) {
      return html`<ul class="steps">
        <li class="bad"><ha-icon icon="mdi:close-circle"></ha-icon><b>${t("devices.test.step.check")}</b><small>${problem}</small></li>
      </ul>`;
    }
    return html`<ul class="steps">
      ${STEPS.map((name) => {
        const step = byName.get(name);
        const icon = step ? (step.ok ? "mdi:check-circle" : "mdi:close-circle") : running === name ? "mdi:progress-clock" : "mdi:circle-outline";
        return html`<li class=${step ? (step.ok ? "ok" : "bad") : "wait"}>
          <ha-icon icon=${icon}></ha-icon>
          <b>${t(`devices.test.step.${name}`)}</b>
          <small>${step ? this.stepText(t, step) : ""}</small>
        </li>`;
      })}
    </ul>`;
  }

  private stepText(t: Translate, step: TestStep): string {
    const hass = this.hass!;
    const parts: string[] = [];
    if (step.power != null) {
      parts.push(
        Math.abs(step.power) >= 0.05 ? t("devices.test.power", { value: formatNumber(t.lang, step.power, 2) }) : t("devices.test.no_power"),
      );
    }
    if (step.wrong.length) {
      parts.push(t("devices.test.wrong", { entities: step.wrong.map((e) => entityName(hass, e)).join(", ") }));
    }
    if (step.errors.length) {
      parts.push(t("devices.test.error", { entities: step.errors.map((e) => entityName(hass, e.entity_id)).join(", ") }));
    }
    return parts.join(" · ");
  }

  /** Before the test run: what it does (a confirmation, no address). */
  private renderConfirm(t: Translate, battery: BatteryConfig): TemplateResult {
    const close = () => {
      this.confirm = false;
    };
    return html`<joe-sheet label=${t("devices.test.start")} closeLabel=${t("common.close")} @joe-close=${close}>
      <div data-tipped>
        <div class="sheet-title">${displayTitle(t("devices.test.confirm.title", { name: battery.name }), "h2", tip(t, "devices_test"))}</div>
        <p class="sheet-text">${t("devices.test.confirm.text")}</p>
        <div class="actions">
          <button type="button" class="btn btn-secondary" data-notip @click=${close}>${t("common.cancel")}</button>
          <button type="button" class="btn btn-primary" @click=${() => this.startTest(battery)}>${t("devices.test.confirm.go")}</button>
        </div>
      </div>
    </joe-sheet>`;
  }

  private async startTest(battery: BatteryConfig): Promise<void> {
    this.confirm = false;
    this.notice = "";
    try {
      await this.hass?.callWS({ type: "energy_joe/control/test", battery_id: battery.id });
    } catch {
      this.notice = this.t!("error.action");
    }
  }

  // --- Steuern and Strom ---

  private renderSteer(t: Translate, battery: BatteryConfig): TemplateResult {
    const to = controlRoute(battery.id);
    return html`${this.renderRolesNote(t, battery)}
      <div class="control-row" data-tipped>
        <span class="control-text">
          <small>${t("battery.page.how")}</small>
          <b>${controlKind(t, battery, this.info)}</b>
        </span>
        <a class="btn btn-secondary" href=${href(this.prefix, to)} @click=${onLink(to, { sheet: true })}>
          <ha-icon icon="mdi:tune-variant"></ha-icon>${t("devices.setup")}
        </a>
        ${tip(t, "devices_setup")}
      </div>
      ${battery.adapter !== "none" ? this.renderDaySurplus(t, battery) : nothing} ${this.fields(battery, "steer")}`;
  }

  /**
   * The saved levers differ from what the profile finds (state.battery_roles):
   * adopt the profile's or leave it, right here; "Regler einrichten" shows the
   * details.
   */
  private renderRolesNote(t: Translate, battery: BatteryConfig): TemplateResult | typeof nothing {
    const item = this.state?.battery_roles?.find((entry) => entry.battery_id === battery.id);
    if (!item) {
      return this.rolesNotice
        ? html`<div class="note roles-note" role="status"><ha-icon icon="mdi:information-outline"></ha-icon><span>${this.rolesNotice}</span></div>`
        : nothing;
    }
    const profile = this.info?.profiles?.[item.profile] ?? item.profile;
    return html`<div class="note warn roles-note" role="status" data-tipped>
      <ha-icon icon="mdi:swap-horizontal-variant"></ha-icon>
      <span
        >${t("roles.todo.title", { name: item.name, profile })}: ${t("roles.todo.text", { details: rolesDetails(t, item, this.hass) })}
        <div class="note-actions">
          ${rolesChoices(t, battery.id).map(
            (choice) => html`<button
              type="button"
              class="mini-btn ${choice.done ? "go" : ""}"
              ?disabled=${this.answering}
              @click=${() => this.answerRoles(choice.message!, choice.done ?? "")}
            >
              ${choice.label}
            </button>`,
          )}
          ${tip(t, "battery_roles")}
        </div></span
      >
    </div>`;
  }

  private async answerRoles(message: { type: string; [key: string]: unknown }, done: string): Promise<void> {
    this.answering = true;
    this.notice = "";
    try {
      await this.hass?.callWS(message);
      this.rolesNotice = done;
    } catch {
      this.notice = this.t!("error.action");
    }
    this.answering = false;
  }

  /** "Macht tagsüber mit": this battery's part in the daytime surplus for evcc, and what it does now. */
  private renderDaySurplus(t: Translate, battery: BatteryConfig): TemplateResult {
    const joe = this.state!;
    const rules = joe.config.rules;
    const surplus = daySurplus(joe);
    const mine = surplus?.batteries?.[battery.id];
    const ability = surplusAbility(this.hass, battery);
    const capable = ability === "ok" || ability === "need_ref";
    const on = battery.day_surplus !== false;
    const kw = (value: number | null | undefined) => formatNumber(t.lang, value ?? 0, 1);
    const ruleTo: Route = { tab: "settings", section: "rules", id: "day_surplus" };
    const intrudersTo: Route = { tab: "devices", section: "battery", id: battery.id, sub: "intruders" };
    let text: string;
    if (!capable) {
      text = t(`battery.surplus.${ability}`);
    } else if (mine && (mine.state === "no_limit" || mine.state === "unit" || mine.state === "flash")) {
      text = t(`battery.surplus.${mine.state}`);
    } else if (!rules.day_surplus) {
      text = t("battery.surplus.rule_off");
    } else if (mine?.state === "automation") {
      text = t("battery.surplus.automation", { names: (mine.automations ?? []).map((n) => `„${n}“`).join(", ") });
    } else if (mine?.state === "learning") {
      text = t("battery.surplus.learning");
    } else if (mine?.state === "need_ref" || ability === "need_ref") {
      text = t("battery.surplus.need_ref");
    } else if (mine?.state === "team_wait") {
      text = t("battery.surplus.team_wait");
    } else if (mine?.state === "capped") {
      text = t("battery.surplus.capped", { kw: kw(mine.cap_kw), time: timeOf(surplus?.pv_end) });
    } else if (mine?.state === "would") {
      text = t("battery.surplus.would", { kw: kw(mine.cap_kw), time: timeOf(surplus?.pv_end) });
    } else if (mine?.state === "unavailable" || mine?.state === "unknown") {
      text = t(`battery.surplus.${mine.state}`);
    } else if (mine?.state === "not_tested" || joe.control?.ready[battery.id] !== "ready") {
      text = t("battery.surplus.not_tested");
    } else {
      text = t(on ? "battery.surplus.takes_part" : "battery.surplus.left_out");
    }
    return html`<div class="control-row" data-tipped>
        <span class="control-text">
          <b id="day-surplus-${battery.id}">${t("battery.surplus.label")}</b>
          <small>${text}</small>
          ${!rules.day_surplus && capable
            ? html`<a class="mini-btn go" href=${href(this.prefix, ruleTo)} @click=${onLink(ruleTo)}>${t("battery.surplus.rule_go")}</a>`
            : nothing}
          ${rules.day_surplus && mine?.state === "automation"
            ? html`<a class="mini-btn go" href=${href(this.prefix, intrudersTo)} @click=${this.jumpToIntruders(intrudersTo)}
                >${t("battery.surplus.intruders_go")}</a
              >`
            : nothing}
        </span>
        ${tip(t, "f_battery_day_surplus")}
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(on && capable)}
          aria-labelledby="day-surplus-${battery.id}"
          ?disabled=${!capable}
          @click=${() => saveConfig(this, { batteries: { [battery.id]: { day_surplus: !on } } })}
        ></button>
      </div>
      ${limitInPercent(this.hass, battery) ? this.renderLimitRef(t, battery) : nothing}`;
  }

  /** "Wofür stehen 100 %?": the power a charge limit in % counts from (Fronius), or "Joe lernt es selbst". */
  private renderLimitRef(t: Translate, battery: BatteryConfig): TemplateResult {
    const config = this.state!.config;
    const value = battery.limit_ref_w ?? null;
    const source = sourceOf(config, `batteries[${battery.id}].limit_ref_w`);
    const learning = value == null;
    return html`<div class="field ref-field" data-tipped>
      <div class="field-label">
        <span id="limit-ref-${battery.id}">${t("battery.limit_ref.label")}</span> ${tip(t, "f_battery_limit_ref")}
        ${value != null ? sourceChip(t, source) : nothing}
      </div>
      <div class="field-row">
        <span class="unit-input">
          <input
            class="input"
            type="number"
            inputmode="numeric"
            min="100"
            max="100000"
            step="10"
            aria-labelledby="limit-ref-${battery.id}"
            .value=${value == null ? "" : String(Math.round(value))}
            placeholder=${t("battery.limit_ref.placeholder")}
            @change=${(ev: Event) => {
              const input = ev.target as HTMLInputElement;
              const watts = Number.parseFloat(input.value.replace(",", "."));
              const ok = Number.isFinite(watts) && watts >= 100 && watts <= 100000;
              if (input.value.trim() && !ok) {
                input.value = value == null ? "" : String(Math.round(value));
                return;
              }
              void saveConfig(this, { batteries: { [battery.id]: { limit_ref_w: ok ? Math.round(watts) : null } } });
            }}
          />
          <span class="unit">W</span>
        </span>
        <button
          type="button"
          class="mini-btn ${learning ? "go" : ""}"
          aria-pressed=${String(learning)}
          @click=${() => {
            if (!learning) void saveConfig(this, { batteries: { [battery.id]: { limit_ref_w: null } } });
          }}
        >
          ${t("battery.limit_ref.learn")}
        </button>
      </div>
      <p class="field-hint">
        ${value == null
          ? t("battery.limit_ref.learning")
          : source?.source === "learned"
            ? t("battery.limit_ref.learned", { value: formatNumber(t.lang, value, 0) })
            : t("battery.limit_ref.set", { value: formatNumber(t.lang, value, 0) })}
      </p>
    </div>`;
  }

  /** On the same page the jump only scrolls to the "Störenfriede". */
  private jumpToIntruders(to: Route): (ev: MouseEvent) => void {
    const go = onLink(to, { replace: true });
    return (ev: MouseEvent) => {
      go(ev);
      if (ev.defaultPrevented) {
        this.revealed = "";
        revealAnchor(this.renderRoot, "intruders");
      }
    };
  }

  private renderPower(t: Translate, battery: BatteryConfig): TemplateResult {
    return this.fields(battery, "power");
  }

  private fields(battery: BatteryConfig, part: "steer" | "power"): TemplateResult {
    return html`<joe-battery-fields
      .hass=${this.hass}
      .t=${this.t}
      .config=${this.state?.config}
      .battery=${battery}
      .floor=${this.state?.floors?.[battery.id]}
      show=${part}
    ></joe-battery-fields>`;
  }

  // --- Störenfriede: automations writing to this battery ---

  private renderIntruders(t: Translate, battery: BatteryConfig): TemplateResult {
    const joe = this.state!;
    return html`<joe-battery-automations
      bare
      .hass=${this.hass}
      .t=${t}
      batteries=${JSON.stringify(joe.config.batteries)}
      mode=${joe.mode}
      .ready=${joe.control?.ready ?? {}}
      batteryId=${battery.id}
      .items=${this.automations}
      @joe-automations=${(ev: CustomEvent<BatteryAutomation[]>) => (this.automations = ev.detail)}
    ></joe-battery-automations>`;
  }

  // --- Weglassen ---

  private renderRemove(t: Translate, battery: BatteryConfig): TemplateResult {
    return html`<div class="remove">
      <p class="remove-text">${t("battery.page.remove.text")}</p>
      ${this.removing
        ? html`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${t("battery.page.remove.confirm", { name: battery.name })}</span></div>
            <div class="actions">
              <button type="button" class="btn btn-danger" ?disabled=${this.saving} @click=${() => this.leaveOut(battery)}>
                ${t("battery.page.remove.go")}
              </button>
              <button type="button" class="btn btn-ghost" @click=${() => (this.removing = false)}>${t("common.cancel")}</button>
            </div>`
        : html`<div class="actions">
            <button type="button" class="btn btn-secondary" @click=${() => (this.removing = true)}>
              <ha-icon icon="mdi:eye-off-outline"></ha-icon>${t("review.ignore")}
            </button>
          </div>`}
    </div>`;
  }

  /** Joe leaves the battery out (and remembers it, so "Wieder nutzen" brings a found one back). */
  private async leaveOut(battery: BatteryConfig): Promise<void> {
    const config = this.state!.config;
    this.saving = true;
    const ok = await saveConfig(this, {
      batteries: { [battery.id]: null },
      answers: { ignored: withIgnored(config, `battery:${battery.id}`, true) },
    });
    this.saving = false;
    if (ok) {
      this.removing = false;
      navigate(this, { tab: "devices", section: "battery" }, { replace: true });
    }
  }

  // --- "Regler einrichten" (/devices/battery/<id>/control) ---

  /** The battery's control as saved now, with the fields changed in the draft on top. */
  private draftOf(battery: BatteryConfig): ControlDraft {
    const saved = controlOf(battery);
    const stored = drafts.get(battery.id);
    if (!stored) {
      return saved;
    }
    const draft = { ...saved } as Record<string, unknown>;
    for (const field of CONTROL_FIELDS) {
      if (!sameValue(stored.base[field], stored.draft[field])) {
        draft[field] = stored.draft[field];
      }
    }
    return draft as unknown as ControlDraft;
  }

  /** The fields of the draft that differ from the battery as saved now. */
  private controlChanges(battery: BatteryConfig, draft: ControlDraft): Record<string, unknown> {
    const changes: Record<string, unknown> = {};
    for (const field of CONTROL_FIELDS) {
      if (!sameValue(battery[field], draft[field])) {
        changes[field] = draft[field];
      }
    }
    return changes;
  }

  private dirty(battery: BatteryConfig, draft: ControlDraft): boolean {
    return Object.keys(this.controlChanges(battery, draft)).length > 0;
  }

  private renderControl(t: Translate, battery: BatteryConfig, found: BatteryFinding | undefined): TemplateResult {
    const draft = this.draftOf(battery);
    const dirty = this.dirty(battery, draft);
    const page: Route = { tab: "devices", section: "battery", id: battery.id };
    return html`<joe-sheet wide label=${t("devices.setup")} closeLabel=${t("common.close")} @joe-close=${() => closeSheet(this, page)}>
      <div data-tipped>
        <div class="sheet-title">${displayTitle(t("battery.control.title", { name: battery.name }), "h2", tip(t, "control_choice"))}</div>
        <p class="sheet-text">${t("battery.control.lead")}</p>
        <div class="field">
          <joe-battery-control
          .hass=${this.hass}
          .t=${t}
          .battery=${battery}
          .found=${found}
          .profiles=${this.info?.profiles}
          .value=${draft as ControlValue}
          .dirty=${dirty}
          .probes=${this.state?.probes?.[battery.id]}
          .probeRunning=${this.state?.control?.probe_running ?? null}
          .busy=${Boolean(this.state?.control?.testing)}
          @joe-control-change=${(ev: CustomEvent<ControlValue>) => {
            drafts.set(battery.id, { base: controlOf(battery), draft: withPrepare(battery, ev.detail, found) });
            this.requestUpdate();
          }}
        ></joe-battery-control>
        </div>
      </div>
      <div class="steer-bar" data-notip role="region" aria-label=${t("devices.setup")}>
        ${dirty ? html`<span class="unsaved" role="status">${t("battery.control.unsaved")}</span>` : nothing}
        <button type="button" class="btn btn-primary" ?disabled=${this.saving || !dirty} @click=${() => this.saveControl(battery, page)}>
          ${t("common.save")}
        </button>
        <button
          type="button"
          class="btn btn-ghost"
          @click=${() => {
            drafts.delete(battery.id);
            closeSheet(this, page);
          }}
        >
          ${t("common.cancel")}
        </button>
      </div>
    </joe-sheet>`;
  }

  private async saveControl(battery: BatteryConfig, page: Route): Promise<void> {
    const changes = this.controlChanges(battery, this.draftOf(battery));
    if (Object.keys(changes).length) {
      this.saving = true;
      const ok = await saveConfig(this, { batteries: { [battery.id]: changes } });
      this.saving = false;
      if (!ok) {
        return;
      }
    }
    drafts.delete(battery.id);
    closeSheet(this, page);
  }
}

define("joe-battery-device", JoeBatteryDevice);
