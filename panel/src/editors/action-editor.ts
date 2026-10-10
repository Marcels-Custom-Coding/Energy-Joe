import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import {
  actionFieldStyles,
  actionFields,
  actionProblem,
  DEFAULT_NEED,
  fromCar,
  fromWallbox,
  layoutOf,
  newAction,
  setNeed,
  toggleNeed,
  type ActionFieldsHost,
  type ActionLayout,
  type ActionTemplate,
} from "../components/action-fields";
import "../components/action-steer";
import { displayTitle } from "../components/bits";
import { tip } from "../components/tip";
import { saveConfig } from "../config";
import { define } from "../define";
import { actionGroup } from "../device-model";
import type { Translate } from "../i18n";
import { PANEL } from "../router";
import { shared } from "../styles/shared";
import type { ActionConfig, CarAccountStatus, CarMailboxStatus, Discovery, HomeAssistant, JoeConfig } from "../types";

export type { ActionTemplate } from "../components/action-fields";

/**
 * A night action in a sheet: the assistant "+ Hinzufügen" (new:<template>)
 * and the first setup. Device pages use <joe-action-steer> with the same
 * fields (components/action-fields.ts).
 */
export class JoeActionEditor extends LitElement implements ActionFieldsHost {
  @property({ attribute: false }) hass?: HomeAssistant;
  /** Each car's mailbox without a calendar (last look, invitations). */
  @property({ attribute: false }) mailboxes?: Record<string, CarMailboxStatus>;
  /** Each car's mailbox with a calendar (sign-in and last read). */
  @property({ attribute: false }) accounts?: Record<string, CarAccountStatus>;
  /** Energy Joe's own apps for signing in. */
  @property({ attribute: false }) apps?: { microsoft: boolean; google: boolean };
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) config?: JoeConfig;
  @property({ attribute: false }) discovery?: Discovery;
  @property({ attribute: false }) prefix = PANEL;
  /** An existing action's id, or "new:<template>". */
  @property() actionId = "";
  /** "need" or "calendars": switch charging by need on and show it. */
  @property() section = "";
  /** A meter from the Energy dashboard this new action is for. */
  @property() consumer = "";
  /** A line under the title (which meter or found device the new action is for). */
  @property() subtitle = "";
  /** What "Neu gefunden" offered: "wallbox:<device id or name>" or "car:<device id>" (its key). */
  @property() found = "";

  @state() draft?: ActionConfig;
  @state() private saving = false;
  @state() private problem = "";

  static styles = [
    shared,
    actionFieldStyles,
    css`
      :host {
        display: block;
      }
      .sheet-sub {
        margin: -6px 0 4px;
        color: var(--joe-ink-2);
        font-weight: 600;
        overflow-wrap: anywhere;
      }
      .danger-zone {
        margin-top: 18px;
        padding-top: 14px;
        border-top: 1px solid var(--joe-line);
      }
    `,
  ];

  get existing(): ActionConfig | undefined {
    return this.config?.actions.find((a) => a.id === this.actionId);
  }

  /**
   * The form's layout, fixed when the editor opens: a new action by its
   * template, an existing one by where it lives (so the kind switch inside
   * the form never makes the switch itself disappear).
   */
  private openLayout?: ActionLayout;

  private get layout(): ActionLayout {
    if (this.actionId.startsWith("new:")) {
      return layoutOf(this.actionId.slice(4) as ActionTemplate);
    }
    return this.openLayout ?? "night";
  }

  setDraft(change: Partial<ActionConfig>): void {
    if (this.draft) {
      this.draft = { ...this.draft, ...change };
      this.problem = "";
      this.touched = true;
    }
  }

  /** The user changed the draft (a new one is no longer refilled when the found devices arrive). */
  private touched = false;

  protected willUpdate(changed: PropertyValues<this>): void {
    // A new action is filled from what Joe found; that list may arrive after the editor opened.
    const refill = this.actionId.startsWith("new:") && !this.touched && changed.has("discovery") && Boolean(this.discovery);
    if ((!this.draft || refill) && this.t && (changed.has("actionId") || changed.has("config") || refill)) {
      if (this.actionId.startsWith("new:")) {
        const draft = newAction(this.actionId.slice(4) as ActionTemplate, this.t);
        const [foundKind, foundKey] = this.found.split(/:(.*)/s);
        const actions = this.config?.actions ?? [];
        const wallboxes = (this.discovery?.wallboxes ?? []).filter((w) => w.is_car);
        // The wallbox picked under "Neu gefunden", else the first one no night action uses yet.
        const wallbox =
          foundKind === "wallbox"
            ? wallboxes.find((w) => (w.device_id ?? w.name) === foundKey)
            : wallboxes.find((w) => !actions.some((a) => a.id === `ev_${w.device_id}` || (w.mode_entity && a.entity_id === w.mode_entity)));
        if (this.actionId === "new:ev" && wallbox) {
          Object.assign(draft, fromWallbox(wallbox));
        }
        const car = foundKind === "car" ? this.discovery?.cars?.find((c) => c.device_id === foundKey) : undefined;
        if (car) {
          draft.name = car.name;
        }
        const hotWater = this.config?.consumers.filter((c) => c.kind === "hot_water") ?? [];
        if (this.actionId === "new:hot_water" && hotWater.length === 1) {
          // The one hot water meter found: its energy moves into the night.
          draft.consumer_id = hotWater[0].id;
        }
        const meter = this.config?.consumers.find((c) => c.id === this.consumer);
        if (meter) {
          draft.name = meter.name;
          draft.consumer_id = meter.id;
          draft.power_entity = meter.power_entity ?? null;
        }
        this.draft = draft;
        if (this.section === "need") {
          toggleNeed(this);
        }
        if (car && this.actionId === "new:ev") {
          // The car picked under "Neu gefunden" fills charging by need (not the first car found).
          setNeed(this, { enabled: true, ...fromCar(car, this.draft.need ?? DEFAULT_NEED) });
        }
        this.touched = false;
      } else if (this.existing) {
        this.draft = structuredClone(this.existing);
        const consumer = this.config?.consumers.find((c) => c.id === this.existing?.consumer_id);
        this.openLayout = layoutOf(actionGroup(this.existing, consumer));
        if ((this.section === "calendars" || this.section === "need") && !this.draft.need?.enabled) {
          // Calendars belong to charging by need: switch it on (until saved, nothing changes).
          toggleNeed(this);
        }
      }
    }
  }

  protected updated(): void {
    if ((this.section === "calendars" || this.section === "need") && !this.focused) {
      const field = this.shadowRoot?.querySelector(this.section === "need" ? `[aria-label="${this.t?.("action.need") ?? ""}"]` : "joe-car-calendars");
      if (field) {
        this.focused = true;
        field.scrollIntoView({ block: "center" });
      }
    }
  }

  private focused = false;

  protected render() {
    const { t, hass, draft } = this;
    if (!t || !hass || !draft) {
      return nothing;
    }
    const existing = this.existing;
    const title = existing ? t("action.title") : t(`action.title.${this.actionId.slice(4) as ActionTemplate}`);
    return html`<div class="sheet-title">${displayTitle(title)}</div>
      ${this.subtitle ? html`<p class="sheet-sub">${this.subtitle}</p>` : nothing}
      ${actionFields(this, this.layout, { calendars: true })}
      ${this.problem ? html`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.problem}</span></div>` : nothing}
      <div class="actions">
        <span data-tipped class="row">
          <button type="button" class="btn btn-primary" ?disabled=${this.saving} @click=${this.save}>${t("common.save")}</button>
          ${tip(t, "a_save")}
        </span>
        <button type="button" class="btn btn-ghost" data-notip @click=${this.close}>${t("common.cancel")}</button>
      </div>
      ${existing
        ? html`<div class="danger-zone">
            <joe-action-delete .t=${t} .config=${this.config} .action=${existing} @joe-deleted=${this.close}></joe-action-delete>
          </div>`
        : nothing}`;
  }

  private async save(): Promise<void> {
    const draft = this.draft;
    if (!draft) return;
    this.problem = actionProblem(this.t!, draft, this.layout);
    if (this.problem) {
      return;
    }
    const { id, ...fields } = draft;
    this.saving = true;
    const ok = await saveConfig(this, { actions: { [id]: fields } });
    this.saving = false;
    if (ok) this.close();
  }

  private close(): void {
    this.dispatchEvent(new CustomEvent("joe-close", { bubbles: true, composed: true }));
  }
}

define("joe-action-editor", JoeActionEditor);
