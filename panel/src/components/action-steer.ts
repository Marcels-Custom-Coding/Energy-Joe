import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { actionFieldStyles, actionFields, actionProblem, type ActionFieldsHost, type ActionLayout } from "./action-fields";
import { timeOf } from "./plan-text";
import { tip } from "./tip";
import { saveConfig } from "../config";
import { define } from "../define";
import { actionGroup } from "../device-model";
import { formatNumber } from "../entities";
import type { Translate } from "../i18n";
import { PANEL, navigate, type Route } from "../router";
import { shared } from "../styles/shared";
import type { ActionConfig, ControlView, Discovery, HomeAssistant, JoeConfig, JoeState, PlanAction } from "../types";

// The "Steuern" block of the car, hot water and Weitere-Geräte pages: a draft
// of the night action with Speichern and Abbrechen (the fields depend on each
// other and the calendars act after saving), plus "Heute Nacht" and Löschen.

/**
 * Unsaved drafts per action and block, kept while the panel is open (plan 5:
 * leaving does not ask). `base` is the action the draft started from, so only
 * the fields changed here count – what another block (or another tab) saved
 * meanwhile shows through and is never sent back with an old value.
 */
const DRAFTS = new Map<string, { base: ActionConfig; draft: ActionConfig; pending: boolean }>();

/** Only what changed, so two blocks of the same action never undo each other (the backend merges dicts). */
export function actionChanges(saved: ActionConfig, draft: ActionConfig): Record<string, unknown> {
  const same = (a: unknown, b: unknown) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
  const patch: Record<string, unknown> = {};
  for (const key of Object.keys(draft) as (keyof ActionConfig)[]) {
    if (key === "id" || same(draft[key], saved[key])) {
      continue;
    }
    if (key === "need" && draft.need && saved.need) {
      const need: Record<string, unknown> = {};
      for (const [field, value] of Object.entries(draft.need)) {
        if (!same(value, (saved.need as unknown as Record<string, unknown>)[field])) need[field] = value;
      }
      patch.need = need;
    } else {
      patch[key] = draft[key];
    }
  }
  return patch;
}

/** The action as saved now with a block's own changes on top (the need merged field by field). */
function withChanges(action: ActionConfig, changes: Record<string, unknown>): ActionConfig {
  const next = { ...action, ...changes } as ActionConfig;
  if (changes.need && action.need) {
    next.need = { ...action.need, ...(changes.need as Partial<NonNullable<ActionConfig["need"]>>) };
  }
  return next;
}

/**
 * <joe-action-steer .action .section>: one block of a night action's settings
 * on its device page. car: charging by need, the wallbox and the rest;
 * calendars: the car's appointments; hot_water; night (a device at night).
 */
export class JoeActionSteer extends LitElement implements ActionFieldsHost {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;
  @property({ attribute: false }) discovery?: Discovery;
  @property({ attribute: false }) prefix = PANEL;
  @property({ attribute: false }) action?: ActionConfig;
  @property({ attribute: false }) section: ActionLayout = "night";

  @state() private saving = false;
  @state() private problem = "";
  /** Bumped on every change of the stored draft (it lives outside the element). */
  @state() private version = 0;

  static styles = [
    shared,
    actionFieldStyles,
    css`
      :host {
        display: block;
      }
      .steer-bar {
        position: sticky;
        bottom: 0;
        z-index: 1;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
        margin: 18px -4px 0;
        padding: 12px 4px;
        background: var(--joe-surface);
        border-top: 1px solid var(--joe-line);
      }
      .steer-bar .unsaved {
        flex-basis: 100%;
        color: var(--joe-ink-2);
        font-weight: 600;
      }
      .steer-bar .with-tip {
        gap: 8px;
      }
      :host > .field:first-child,
      :host > .fields > .field:first-child {
        margin-top: 0;
      }
    `,
  ];

  get config(): JoeConfig | undefined {
    return this.state?.config;
  }

  get mailboxes() {
    return this.state?.mailbox;
  }

  get accounts() {
    return this.state?.accounts;
  }

  get apps() {
    return this.state?.apps;
  }

  get existing(): ActionConfig | undefined {
    return this.action;
  }

  private get key(): string {
    return `${this.action?.id ?? ""}|${this.section}`;
  }

  /** This block's changes: the draft against the action it started from. */
  private get changes(): Record<string, unknown> {
    const stored = DRAFTS.get(this.key);
    return stored ? actionChanges(stored.base, stored.draft) : {};
  }

  /** The action as saved now, with this block's changes on top. */
  get draft(): ActionConfig | undefined {
    const action = this.action;
    return action && DRAFTS.has(this.key) ? withChanges(action, this.changes) : action;
  }

  private get dirty(): boolean {
    const stored = DRAFTS.get(this.key);
    return Boolean(stored && !stored.pending && this.action && Object.keys(actionChanges(this.action, this.draft!)).length);
  }

  setDraft(change: Partial<ActionConfig>): void {
    const action = this.action;
    const draft = this.draft;
    if (!action || !draft) return;
    // Re-based on the action as saved now, so the next diff only sees this block's own changes.
    DRAFTS.set(this.key, { base: structuredClone(action), draft: { ...draft, ...change }, pending: false });
    this.problem = "";
    this.version++;
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    // The saved action came back: the draft has done its job.
    if (changed.has("action") && DRAFTS.get(this.key)?.pending) {
      DRAFTS.delete(this.key);
    }
  }

  protected render() {
    const { t, hass, draft } = this;
    if (!t || !hass || !draft) {
      return nothing;
    }
    void this.version;
    return html`<div class="fields">${actionFields(this, this.section)}</div>
      ${this.problem ? html`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.problem}</span></div>` : nothing}
      ${this.dirty
        ? html`<div class="steer-bar" role="region" aria-label=${t("action.steer.unsaved")}>
            <span class="unsaved">${t("action.steer.unsaved")}</span>
            <span class="with-tip" data-tipped>
              <button type="button" class="btn btn-primary" ?disabled=${this.saving} @click=${this.save}>${t("common.save")}</button>
              ${tip(t, "a_save")}
            </span>
            <button type="button" class="btn btn-ghost" data-notip ?disabled=${this.saving} @click=${this.cancel}>${t("common.cancel")}</button>
          </div>`
        : nothing}`;
  }

  private cancel(): void {
    DRAFTS.delete(this.key);
    this.problem = "";
    this.version++;
  }

  private async save(): Promise<void> {
    const draft = this.draft;
    const action = this.action;
    if (!draft || !action) return;
    this.problem = actionProblem(this.t!, draft, this.section);
    if (this.problem) {
      return;
    }
    // Only this block's changes, and only where they differ from the action as saved now.
    const patch = actionChanges(action, draft);
    if (!Object.keys(patch).length) {
      this.cancel();
      return;
    }
    const key = this.key;
    this.saving = true;
    const ok = await saveConfig(this, { actions: { [action.id]: patch } });
    this.saving = false;
    if (ok) {
      // Keep showing the draft until the saved action arrives with the next state.
      DRAFTS.set(key, { base: structuredClone(action), draft, pending: true });
      this.version++;
    }
  }
}

/**
 * Löschen at the bottom of a device page (and in the editor), with a
 * question first. Fires `joe-deleted`; with `leave` it goes there.
 */
export class JoeActionDelete extends LitElement {
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) config?: JoeConfig;
  @property({ attribute: false }) action?: ActionConfig;
  /** Where to go once deleted (the group page); without it, only the event. */
  @property({ attribute: false }) leave?: Route;

  @state() private asking = false;
  @state() private busy = false;

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      .ask {
        margin: 0 0 12px;
        font-weight: 600;
      }
      .row {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
      }
    `,
  ];

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has("action") && changed.get("action")?.id !== this.action?.id) {
      this.asking = false;
    }
  }

  protected render() {
    const { t, action } = this;
    if (!t || !action) {
      return nothing;
    }
    const consumer = this.config?.consumers.find((c) => c.id === action.consumer_id);
    const group = actionGroup(action, consumer);
    if (!this.asking) {
      return html`<div class="row" data-tipped>
        <button type="button" class="btn btn-danger" @click=${() => (this.asking = true)}>${t("action.delete")}</button>
        ${tip(t, "a_delete")}
      </div>`;
    }
    return html`<div data-tipped>
      <p class="ask" role="alert">${t(`action.delete.ask.${group}`, { name: action.name })}</p>
      <div class="row">
        <button type="button" class="btn btn-danger" ?disabled=${this.busy} @click=${this.removeAction}>${t("action.delete.yes")}</button>
        <button type="button" class="btn btn-ghost" ?disabled=${this.busy} @click=${() => (this.asking = false)}>
          ${t("action.delete.no")}
        </button>
        ${tip(t, "a_delete")}
      </div>
    </div>`;
  }

  private async removeAction(): Promise<void> {
    const action = this.action;
    if (!action) return;
    this.busy = true;
    const ok = await saveConfig(this, { actions: { [action.id]: null } });
    this.busy = false;
    if (!ok) return;
    this.asking = false;
    this.dispatchEvent(new CustomEvent("joe-deleted", { detail: { id: action.id }, bubbles: true, composed: true }));
    if (this.leave) {
      navigate(this, this.leave, { replace: true });
    }
  }
}

/** "Heute Nacht": run the action in the coming night whatever the forecast says. */
export class JoeActionTonight extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;
  @property({ attribute: false }) action?: ActionConfig;

  @state() private failed = false;

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      .tonight {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 44px;
      }
      .tonight span {
        font-weight: 600;
      }
      .bad {
        margin: 6px 0 0;
        color: var(--joe-warn, var(--joe-crit));
      }
    `,
  ];

  protected render() {
    const { t, state: joe, action } = this;
    if (!t || !joe || !action) {
      return nothing;
    }
    const night = joe.plan?.window?.start;
    const tonight = Boolean(night) && joe.control?.tonight?.[action.id] === night;
    const id = `tonight-${action.id}`;
    return html`<div class="tonight" data-tipped>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(tonight)}
          aria-labelledby=${id}
          ?disabled=${!night || !action.enabled}
          @click=${() => this.toggle(action.id, !tonight)}
        ></button>
        <span id=${id}>${t("devices.action.tonight")}</span>
        ${tip(t, "action_tonight")}
      </div>
      ${this.failed ? html`<p class="bad" role="status">${t("error.action")}</p>` : nothing}`;
  }

  private async toggle(actionId: string, on: boolean): Promise<void> {
    this.failed = false;
    try {
      await this.hass?.callWS({ type: "energy_joe/control/action_tonight", action_id: actionId, on });
    } catch {
      this.failed = true;
    }
  }
}

/** What a night action does tonight, in one sentence ("Heute Nacht von 1 bis 5 Uhr."). */
export function actionText(t: Translate, joe: JoeState, action: ActionConfig): string {
  const planned: PlanAction | undefined = joe.plan?.actions?.find((a) => a.id === action.id);
  const live: ControlView["actions"][string] | undefined = joe.control?.actions?.[action.id];
  const target = planned?.target != null ? formatNumber(t.lang, planned.target, 0) : "";
  if (!action.enabled) {
    return t("devices.action.disabled");
  }
  if (live?.reason === "boost") {
    return t("devices.action.boost");
  }
  if (live?.on) {
    return action.kind === "target"
      ? t("devices.action.heating", { target, end: timeOf(live.end) })
      : t("devices.action.running", { end: timeOf(live.end) });
  }
  if (live?.reason === "reached") {
    // A car stops at a level (%) or range (km), hot water at a temperature.
    const chosen = joe.control?.tonight_target?.[action.id];
    if (action.kind === "switch" && chosen && chosen.night === joe.plan?.window?.start) {
      return t("devices.action.reached_need", { target: formatNumber(t.lang, chosen.chosen, 0), unit: chosen.unit });
    }
    if (action.kind === "switch") {
      return planned?.need && target
        ? t("devices.action.reached_need", { target, unit: planned.need.target_unit === "km" ? "km" : "%" })
        : t("devices.action.reached_plain");
    }
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
  return (
    t.optional(`devices.action.why.${reason}`, {
      kwh: formatNumber(t.lang, joe.plan?.meta?.tomorrow_kwh ?? 0, 0),
      temperature: formatNumber(t.lang, planned.temperature ?? 0, 0),
    }) ?? reason
  );
}

define("joe-action-steer", JoeActionSteer);
define("joe-action-delete", JoeActionDelete);
define("joe-action-tonight", JoeActionTonight);
