import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { define } from "../define";
import type { Translate } from "../i18n";
import { shared } from "../styles/shared";
import type { HomeAssistant } from "../types";
import { dayText } from "./look-back";
import { tip } from "./tip";

export interface BatteryAutomation {
  entity_id: string;
  name: string;
  on: boolean;
  /** What it sets: an entity (or a whole device), of which battery, one of Joe's levers? */
  writes: { entity_id: string | null; name: string; battery: string; battery_id: string; joe: boolean }[];
  switched_off: { at: string; reason: string } | null;
}

/** The automations that write to Joe's batteries (and the ones he switched off). */
export async function loadBatteryAutomations(hass: HomeAssistant | undefined): Promise<BatteryAutomation[]> {
  try {
    return (await hass?.callWS<BatteryAutomation[]>({ type: "energy_joe/automations" })) ?? [];
  } catch {
    return [];
  }
}

/** The automations that write to one battery (Speicherseite › Störenfriede). */
export function automationsOf(items: BatteryAutomation[], batteryId: string): BatteryAutomation[] {
  return items.filter((item) => item.writes.some((w) => w.battery_id === batteryId));
}

/**
 * Automations that write to the batteries Joe steers: they can overwrite his
 * values, so they are listed with a button to switch them all off – and the
 * ones Joe switched off back on, with when and why.
 * With `batteryId` only the ones of that battery are shown and switched;
 * `bare` leaves out the card and its head (a device page section has both).
 */
export class JoeBatteryAutomations extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  /** The batteries as configured: a change looks again. */
  @property() batteries = "";
  /** Joe's mode and which batteries he may steer: only then do the automations get in the way. */
  @property() mode = "";
  @property({ attribute: false }) ready: Record<string, string> = {};
  /** Only the automations of this battery (shown and switched). */
  @property() batteryId = "";
  /** Without the card and its head. */
  @property({ type: Boolean }) bare = false;
  /**
   * The list, when the page loads it itself (to know whether there is any);
   * otherwise the element looks itself. After switching it fires
   * `joe-automations` with the new list.
   */
  @property({ attribute: false }) items: BatteryAutomation[] | null = null;

  @state() private loaded: BatteryAutomation[] = [];
  @state() private busy = false;
  @state() private failed = false;

  static styles = [
    shared,
    css`
      :host {
        display: block;
        margin-top: 12px;
      }
      :host([bare]) {
        margin-top: 0;
      }
      .card {
        padding: 18px 20px;
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
      .now {
        margin: 8px 0 0;
        font-weight: 600;
      }
      ul {
        list-style: none;
        margin: 10px 0 0;
        padding: 0;
        display: grid;
        gap: 6px;
      }
      li {
        display: grid;
        gap: 2px;
        padding: 8px 12px;
        border-radius: 10px;
        background: var(--joe-surface-2);
      }
      .row {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .row b {
        flex: 1 1 200px;
        min-width: 0;
        font-weight: 600;
        overflow-wrap: anywhere;
      }
      small {
        color: var(--joe-muted);
        font-size: 12.5px;
      }
      .actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-top: 12px;
      }
      .bad {
        color: var(--joe-warn, var(--joe-crit));
      }
    `,
  ];

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has("batteries") && this.hass && this.items === null) {
      void this.load();
    }
  }

  private async load(): Promise<void> {
    this.loaded = await loadBatteryAutomations(this.hass);
  }

  /** All automations as last seen, or only the battery's. */
  private get shown(): BatteryAutomation[] {
    const all = this.items ?? this.loaded;
    return this.batteryId ? automationsOf(all, this.batteryId) : all;
  }

  /** On or off as Home Assistant shows it right now (the list is from the last look). */
  private on(item: BatteryAutomation): boolean {
    const state = this.hass?.states[item.entity_id];
    return state ? state.state === "on" : item.on;
  }

  protected render() {
    const t = this.t;
    const items = this.shown;
    if (!t || !items.length) {
      return nothing;
    }
    const on = items.filter((item) => this.on(item));
    const mine = items.filter((item) => item.switched_off && !this.on(item));
    // They only get in the way where Joe may steer: a mode that steers and a tested battery.
    const steers =
      (this.mode === "advisory" || this.mode === "live") &&
      on.some((item) =>
        item.writes.some((w) => (!this.batteryId || w.battery_id === this.batteryId) && this.ready[w.battery_id] === "ready"),
      );
    const body = html`<p class="now">
        ${t(!on.length ? "automations.lead_off" : steers ? "automations.lead" : "automations.lead_idle")}
      </p>
      <ul>
        ${items.map((item) => {
          const active = this.on(item);
          const batteries = [...new Set(item.writes.map((w) => w.battery))].join(", ");
          return html`<li>
            <div class="row">
              <b>${item.name}</b>
              ${item.writes.some((w) => w.joe) ? html`<span class="chip">${t("automations.levers")}</span>` : nothing}
              <span class="chip ${active ? "warn" : "ok"}">${t(active ? "automations.on" : "automations.off")}</span>
            </div>
            ${item.writes.length
              ? html`<small>${t("automations.writes", { what: item.writes.map((w) => w.name).join(", "), batteries })}</small>`
              : html`<small>${t("automations.not_battery")}</small>`}
            ${item.switched_off && !active
              ? html`<small>
                  ${t("automations.switched_off", {
                    day: dayText(t.lang, item.switched_off.at, "short"),
                    time: item.switched_off.at.slice(11, 16),
                  })}
                </small>`
              : nothing}
          </li>`;
        })}
      </ul>
      <div class="actions">
        ${on.length
          ? html`<button type="button" class="mini-btn ${steers ? "go" : ""}" ?disabled=${this.busy} @click=${() => this.switch(false)}>
              <ha-icon icon="mdi:pause-circle-outline"></ha-icon>${t("automations.all_off", { count: on.length })}
            </button>`
          : nothing}
        ${mine.length
          ? html`<button type="button" class="mini-btn" ?disabled=${this.busy} @click=${() => this.switch(true)}>
              <ha-icon icon="mdi:play-circle-outline"></ha-icon>${t("automations.back_on", { count: mine.length })}
            </button>`
          : nothing}
      </div>
      ${this.failed ? html`<p class="bad">${t("automations.failed")}</p>` : nothing}`;
    if (this.bare) {
      return body;
    }
    return html`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:robot-outline"></ha-icon>${t("automations.title")}</div>
        ${tip(t, "battery_automations")}
      </div>
      ${body}
    </section>`;
  }

  private async switch(on: boolean): Promise<void> {
    this.busy = true;
    this.failed = false;
    // With a battery: only its automations (the backend switches what it is given).
    const entityIds = this.batteryId
      ? this.shown.filter((item) => (on ? item.switched_off && !this.on(item) : this.on(item))).map((item) => item.entity_id)
      : undefined;
    try {
      const answer = await this.hass?.callWS<{ failed: string[]; automations: BatteryAutomation[] }>({
        type: "energy_joe/automations/switch",
        on,
        ...(entityIds ? { entity_ids: entityIds } : {}),
      });
      if (answer?.automations) {
        this.loaded = answer.automations;
        if (this.items !== null) {
          this.items = answer.automations;
        }
        this.dispatchEvent(new CustomEvent("joe-automations", { detail: answer.automations }));
      }
      this.failed = Boolean(answer?.failed.length);
    } catch {
      this.failed = true;
    } finally {
      this.busy = false;
    }
  }
}

define("joe-battery-automations", JoeBatteryAutomations);
