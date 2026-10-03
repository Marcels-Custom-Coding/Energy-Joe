import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { displayTitle, swoosh } from "../components/bits";
import { dayText } from "../components/look-back";
import { timeOf } from "../components/plan-text";
import "../components/pose";
import "../components/sheet";
import { tip } from "../components/tip";
import { define } from "../define";
import { entityName, formatNumber, measurementKw, numberState } from "../entities";
import type { Translate } from "../i18n";
import { shared } from "../styles/shared";
import type {
  ActionConfig,
  BatteryConfig,
  ControlLogEntry,
  ControlView,
  Discovery,
  HomeAssistant,
  JoeInfo,
  JoeState,
  PlanAction,
  TestResult,
  TestStep,
} from "../types";

const STEPS = ["hold", "charge", "release"] as const;

/** The devices Joe steers: what he does with them now, the test run and his log. */
export class JoeDevicesPage extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;
  @property({ attribute: false }) discovery?: Discovery;
  @property({ attribute: false }) info?: JoeInfo;

  @state() private confirm?: BatteryConfig;
  @state() private notice = "";

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      .wrap {
        max-width: 1100px;
        margin: 0 auto;
      }
      .intro {
        display: grid;
        grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.7fr);
        gap: 24px;
        align-items: center;
      }
      .intro joe-pose {
        max-width: 300px;
        width: 100%;
        justify-self: end;
      }
      .display {
        font-size: clamp(30px, 4vw, 44px);
      }
      .card {
        padding: 18px 20px;
        margin-top: 14px;
      }
      .head {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .head .eyebrow {
        flex: 1;
        min-width: 0;
      }
      .status-text {
        margin: 10px 0 0;
        font-size: 17px;
        font-weight: 600;
      }
      .status .actions {
        margin-top: 14px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }
      .grid .card {
        margin-top: 0;
      }
      .figures {
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
        gap: 4px 16px;
        margin-top: 10px;
      }
      .figures b {
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 800;
        font-size: 40px;
        line-height: 1;
        font-variant-numeric: tabular-nums;
      }
      .figures b small {
        font-size: 0.5em;
        margin-left: 2px;
      }
      .figures span {
        color: var(--joe-ink-2);
        font-variant-numeric: tabular-nums;
      }
      .now {
        margin: 8px 0 0;
        font-weight: 600;
      }
      .note {
        margin-top: 10px;
      }
      .test {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        margin-top: 14px;
        padding-top: 12px;
        border-top: 1px solid var(--joe-line);
      }
      .test .chip {
        margin-right: auto;
      }
      .steps {
        list-style: none;
        margin: 10px 0 0;
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
      .setup {
        margin-top: 12px;
      }
      .toggle-label {
        margin-right: auto;
        font-weight: 600;
      }
      .card.add .actions {
        margin-top: 12px;
      }
      .log {
        list-style: none;
        margin: 10px 0 0;
        padding: 0;
        display: grid;
        gap: 2px;
        font-size: 14px;
      }
      .log li {
        display: grid;
        grid-template-columns: 110px 1fr;
        gap: 10px;
        padding: 6px 0;
        border-top: 1px solid var(--joe-line);
      }
      .log li:first-child {
        border-top: 0;
      }
      .log time {
        color: var(--joe-muted);
        font-variant-numeric: tabular-nums;
      }
      .empty {
        margin: 10px 0 0;
        color: var(--joe-ink-2);
      }
      .sheet-text {
        margin: 12px 0 0;
        color: var(--joe-ink-2);
        line-height: 1.55;
      }
      @media (max-width: 900px) {
        .grid {
          grid-template-columns: 1fr;
        }
      }
      @media (max-width: 760px) {
        .intro {
          grid-template-columns: 1fr;
          gap: 8px;
        }
        .intro joe-pose {
          order: -1;
          justify-self: start;
          max-width: 200px;
        }
        .log li {
          grid-template-columns: 1fr;
          gap: 0;
        }
      }
    `,
  ];

  protected render() {
    const t = this.t;
    const joe = this.state;
    if (!t || !joe) {
      return nothing;
    }
    const control = joe.control;
    return html`<div class="wrap">
        <div class="intro">
          <div>
            ${displayTitle(t("devices.page.title"))} ${swoosh}
            <p class="lead">${t("devices.lead")}</p>
          </div>
          <joe-pose name="switch"></joe-pose>
        </div>
        ${control ? this.renderStatus(t, joe, control) : nothing}
        <div class="group-label">${t("devices.batteries")}</div>
        ${joe.config.batteries.length
          ? html`<div class="grid">${joe.config.batteries.map((battery) => this.renderBattery(t, battery, control))}</div>`
          : html`<p class="empty">${t("devices.batteries.none")}</p>`}
        <div class="group-label">${t("devices.actions")}</div>
        <div class="grid">
          ${joe.config.actions.map((action) => this.renderAction(t, joe, action))} ${this.renderAddAction(t)}
        </div>
        ${control ? this.renderLog(t, control) : nothing}
      </div>
      ${this.confirm ? this.renderConfirm(t, this.confirm) : nothing}`;
  }

  private renderStatus(t: Translate, joe: JoeState, control: ControlView): TemplateResult {
    const plan = joe.plan;
    const reason = control.reason;
    const text =
      reason === "waiting" && plan?.window
        ? t("devices.status.waiting", { time: timeOf(plan.window.start) })
        : t(`devices.status.${reason}`);
    const pill =
      joe.mode === "simulation"
        ? html`<span class="pill-sim">${t("mode.simulation")}</span>`
        : html`<span class="chip ${joe.mode === "live" ? "ok" : joe.mode === "advisory" ? "learned" : ""}"
            >${t(`mode.${joe.mode}`)}</span
          >`;
    const canRelease = control.steering || control.pending;
    return html`<section class="card status" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:pulse"></ha-icon>${t("devices.now")}</div>
        ${pill} ${tip(t, "plan_steer")}
      </div>
      <p class="status-text">${text}</p>
      ${control.pending
        ? html`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${t("devices.pending")}</span></div>`
        : nothing}
      ${canRelease
        ? html`<div class="actions">
            <button type="button" class="btn btn-danger" @click=${this.release}>
              <ha-icon icon="mdi:hand-back-left-outline"></ha-icon>${t("devices.release")}
            </button>
            ${tip(t, "devices_release")}
          </div>`
        : nothing}
      ${this.notice ? html`<div class="note" role="status"><ha-icon icon="mdi:check"></ha-icon>${this.notice}</div>` : nothing}
    </section>`;
  }

  private renderBattery(t: Translate, battery: BatteryConfig, control: ControlView | undefined): TemplateResult {
    const hass = this.hass!;
    const soc = numberState(hass, battery.soc_entity);
    const power = measurementKw(hass, battery.power);
    const ready = control?.ready[battery.id] ?? "not_controllable";
    const now = control?.batteries[battery.id];
    const testing = control?.testing?.battery === battery.id ? control.testing : null;
    const test = control?.tests[battery.id];
    const profile =
      battery.adapter === "generic"
        ? t("devices.battery.generic")
        : battery.adapter === "steps"
          ? t("devices.battery.steps")
          : battery.adapter !== "none"
            ? t("devices.battery.profile", { name: this.info?.profiles?.[battery.adapter] ?? battery.adapter })
            : t("devices.battery.watch");
    const action = now?.action
      ? t(`devices.action.${now.action}`, {
          target: formatNumber(t.lang, now.target, 0),
          floor: formatNumber(t.lang, now.floor ?? 0, 0),
        })
      : t("devices.action.idle");
    const problem = now?.problem ?? (ready !== "ready" && ready !== "not_controllable" ? ready : null);
    return html`<section class="card battery" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:home-battery-outline"></ha-icon>${battery.name}</div>
        <span class="chip ${battery.adapter !== "none" ? "read" : ""}">${profile}</span>
      </div>
      <div class="figures">
        <b>${soc == null ? "–" : formatNumber(t.lang, soc, 0)}<small>%</small></b>
        ${power == null
          ? nothing
          : html`<span
              >${Math.abs(power) < 0.05
                ? t("devices.power.idle")
                : t(power > 0 ? "devices.power.charge" : "devices.power.discharge", {
                    value: formatNumber(t.lang, Math.abs(power), 2),
                  })}</span
            >`}
      </div>
      <p class="now">${battery.adapter === "none" ? t("devices.action.watch") : action}</p>
      ${problem && battery.adapter !== "none"
        ? html`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon
            ><span>${t.optional(`devices.problem.${problem === "outdated" ? "not_tested" : problem}`) ?? problem}</span>
          </div>`
        : nothing}
      ${battery.adapter === "none" && this.hasSuggestion(battery)
        ? html`<div class="note"><ha-icon icon="mdi:lightbulb-on-outline"></ha-icon><span>${t("devices.suggested")}</span></div>`
        : nothing}
      ${battery.adapter !== "none" ? this.renderTest(t, battery, ready, test, testing) : nothing}
      <div class="setup">
        <button type="button" class="mini-btn" @click=${() => this.edit(battery)}>
          <ha-icon icon="mdi:tune-variant"></ha-icon>${t("devices.setup")}
        </button>
        ${tip(t, "devices_setup")}
      </div>
    </section>`;
  }

  private renderAction(t: Translate, joe: JoeState, action: ActionConfig): TemplateResult {
    const plan = joe.plan;
    const planned = plan?.actions?.find((a) => a.id === action.id);
    const live = joe.control?.actions?.[action.id];
    const night = plan?.window?.start;
    const tonight = Boolean(night) && joe.control?.tonight?.[action.id] === night;
    const icon = action.kind === "target" ? "mdi:water-boiler" : /ev|car|auto|wallbox/i.test(action.id + action.name) ? "mdi:car-electric" : "mdi:flash-outline";
    return html`<section class="card action" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon=${icon}></ha-icon>${action.name}</div>
        ${action.enabled ? nothing : html`<span class="chip">${t("devices.action.off")}</span>`}
      </div>
      <p class="now">${this.actionText(t, joe, action, planned, live)}</p>
      <div class="test">
        <span class="toggle-label" id="tonight-${action.id}">${t("devices.action.tonight")}</span>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(tonight)}
          aria-labelledby="tonight-${action.id}"
          ?disabled=${!night || !action.enabled}
          @click=${() => this.toggleTonight(action.id, !tonight)}
        ></button>
        ${tip(t, "action_tonight")}
      </div>
      <div class="setup">
        <button type="button" class="mini-btn" @click=${() => this.editAction(action.id)}>
          <ha-icon icon="mdi:pencil-outline"></ha-icon>${t("devices.action.edit")}
        </button>
      </div>
    </section>`;
  }

  private actionText(
    t: Translate,
    joe: JoeState,
    action: ActionConfig,
    planned: PlanAction | undefined,
    live: ControlView["actions"][string] | undefined,
  ): string {
    const target = planned?.target != null ? formatNumber(t.lang, planned.target, 0) : "";
    if (!action.enabled) {
      return t("devices.action.disabled");
    }
    if (live?.on) {
      return action.kind === "target"
        ? t("devices.action.heating", { target, end: timeOf(live.end) })
        : t("devices.action.running", { end: timeOf(live.end) });
    }
    if (live?.reason === "reached") {
      return t("devices.action.reached", { target });
    }
    if (!planned) {
      return t("devices.action.no_plan");
    }
    const prefix = joe.mode === "simulation" ? t("devices.action.would") : "";
    if (planned.run) {
      const text =
        action.kind === "target"
          ? t("devices.action.plan_target", { start: timeOf(planned.start), target })
          : t("devices.action.plan_run", { start: timeOf(planned.start), end: timeOf(planned.end) });
      return `${prefix}${text}`;
    }
    const reason = planned.reasons[planned.reasons.length - 1] ?? "manual_only";
    return t.optional(`devices.action.why.${reason}`, {
      kwh: formatNumber(t.lang, joe.plan?.meta?.tomorrow_kwh ?? 0, 0),
      temperature: formatNumber(t.lang, planned.temperature ?? 0, 0),
    }) ?? reason;
  }

  private renderAddAction(t: Translate): TemplateResult {
    return html`<section class="card add" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:plus-circle-outline"></ha-icon>${t("devices.action.add")}</div>
        ${tip(t, "devices_actions")}
      </div>
      <p class="now">${t("devices.action.add.text")}</p>
      <div class="actions">
        ${(["ev", "hot_water", "custom"] as const).map(
          (template) =>
            html`<button type="button" class="mini-btn" @click=${() => this.editAction(`new:${template}`)}>
              ${t(`action.template.${template}`)}
            </button>`,
        )}
      </div>
    </section>`;
  }

  private async toggleTonight(actionId: string, on: boolean): Promise<void> {
    try {
      await this.hass?.callWS({ type: "energy_joe/control/action_tonight", action_id: actionId, on });
    } catch {
      this.notice = this.t!("error.action");
    }
  }

  private editAction(id: string): void {
    this.dispatchEvent(new CustomEvent("joe-edit", { detail: { editor: "action", id }, bubbles: true, composed: true }));
  }

  /** Joe found levers that may steer a battery he only watches. */
  private hasSuggestion(battery: BatteryConfig): boolean {
    const found = this.discovery?.batteries.find((b) => b.id === battery.id);
    return Boolean(found?.suggested?.complete);
  }

  private renderTest(
    t: Translate,
    battery: BatteryConfig,
    ready: string,
    test: TestResult | undefined,
    testing: ControlView["testing"],
  ): TemplateResult {
    const busy = Boolean(this.state?.control?.testing);
    const steering = Boolean(this.state?.control?.steering);
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
        ${chip}
        <button
          type="button"
          class="btn btn-secondary"
          ?disabled=${busy || steering}
          @click=${() => (this.confirm = battery)}
        >
          <ha-icon icon="mdi:play-circle-outline"></ha-icon>${t(test ? "devices.test.again" : "devices.test.start")}
        </button>
        ${tip(t, "devices_test")}
      </div>
      ${testing || test ? this.renderSteps(t, steps, testing?.step ?? null, test) : nothing}`;
  }

  private renderSteps(t: Translate, done: TestStep[], running: string | null, test: TestResult | undefined): TemplateResult {
    const byName = new Map(done.map((step) => [step.step, step]));
    const problem =
      !running && test?.problem
        ? t.optional(`devices.test.problem.${test.problem}`, { missing: (test.missing ?? []).map((m) => t.optional(`role.${m}`) ?? m).join(", ") })
        : null;
    return html`<ul class="steps">
      ${problem ? html`<li class="bad"><ha-icon icon="mdi:close-circle"></ha-icon><b>${t("devices.test.step.check")}</b><small>${problem}</small></li>` : nothing}
      ${problem
        ? nothing
        : STEPS.map((name) => {
            const step = byName.get(name);
            const state = step ? (step.ok ? "ok" : "bad") : running === name ? "wait" : running ? "wait" : "wait";
            const icon = step
              ? step.ok
                ? "mdi:check-circle"
                : "mdi:close-circle"
              : running === name
                ? "mdi:progress-clock"
                : "mdi:circle-outline";
            return html`<li class=${state}>
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
        Math.abs(step.power) >= 0.05
          ? t("devices.test.power", { value: formatNumber(t.lang, step.power, 2) })
          : t("devices.test.no_power"),
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

  private renderLog(t: Translate, control: ControlView): TemplateResult {
    const entries = [...control.log].reverse().slice(0, 30);
    return html`<section class="card">
      <div class="eyebrow"><ha-icon icon="mdi:clipboard-text-clock-outline"></ha-icon>${t("devices.log")}</div>
      ${entries.length
        ? html`<ul class="log">
            ${entries.map(
              (entry) => html`<li>
                <time>${dayText(t.lang, entry.at, "short")} ${entry.at.slice(11, 16)}</time>
                <span>${this.logText(t, entry)}</span>
              </li>`,
            )}
          </ul>`
        : html`<p class="empty">${t("devices.log.empty")}</p>`}
    </section>`;
  }

  private logText(t: Translate, entry: ControlLogEntry): string {
    const hass = this.hass!;
    const battery = this.state?.config.batteries.find((b) => b.id === entry.battery)?.name ?? entry.battery ?? "";
    const entity = entry.entity ? entityName(hass, entry.entity) : "";
    const vars: Record<string, string | number> = {
      battery,
      entity,
      value: entry.value == null ? "–" : String(entry.value),
      target: String(entry.target ?? ""),
      power: typeof entry.power === "number" ? formatNumber(t.lang, entry.power, 1) : "–",
      soc: typeof entry.soc === "number" ? formatNumber(t.lang, entry.soc, 0) : "–",
    };
    if (entry.kind === "answer") {
      return t(entry.yes ? "log.answer.yes" : "log.answer.no");
    }
    if (entry.kind === "test") {
      return t(entry.ok ? "log.test.ok" : "log.test.failed", vars);
    }
    return t.optional(`log.${entry.kind}`, vars) ?? entry.kind;
  }

  private renderConfirm(t: Translate, battery: BatteryConfig): TemplateResult {
    const close = () => {
      this.confirm = undefined;
    };
    return html`<joe-sheet label=${t("devices.test.start")} closeLabel=${t("common.close")} @joe-close=${close}>
      <div data-tipped>
        <div class="sheet-title">
          ${displayTitle(t("devices.test.confirm.title", { name: battery.name }), "h2", tip(t, "devices_test"))}
        </div>
        <p class="sheet-text">${t("devices.test.confirm.text")}</p>
        <div class="actions">
          <button type="button" class="btn btn-secondary" data-notip @click=${close}>${t("common.cancel")}</button>
          <button type="button" class="btn btn-primary" @click=${() => this.startTest(battery)}>
            ${t("devices.test.confirm.go")}
          </button>
        </div>
      </div>
    </joe-sheet>`;
  }

  private async startTest(battery: BatteryConfig): Promise<void> {
    this.confirm = undefined;
    try {
      await this.hass?.callWS({ type: "energy_joe/control/test", battery_id: battery.id });
    } catch {
      this.notice = this.t!("error.action");
    }
  }

  private async release(): Promise<void> {
    try {
      await this.hass?.callWS({ type: "energy_joe/control/release" });
    } catch {
      this.notice = this.t!("error.action");
    }
  }

  private edit(battery: BatteryConfig): void {
    this.dispatchEvent(new CustomEvent("joe-edit", { detail: { editor: "battery", id: battery.id }, bubbles: true, composed: true }));
  }
}

define("joe-devices-page", JoeDevicesPage);
