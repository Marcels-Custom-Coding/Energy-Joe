import { LitElement, css, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { tip } from "../../components/tip";
import { define } from "../../define";
import { areaOf, deviceRoute } from "../../device-model";
import { entityName } from "../../entities";
import type { Translate } from "../../i18n";
import { PANEL, href, onLink, type Route } from "../../router";
import { shared } from "../../styles/shared";
import type { ClimateFound, HomeAssistant, JoeState } from "../../types";
import { AWAY_AFTER_DEFAULT, activeProfile, reasonText, temperatureText, temperatures } from "../devices/climate-view";

/** The devices Joe regulates: climate switched on and the device's own switch on. */
export function climateRooms(joe: JoeState | undefined): string[] {
  const climate = joe?.config.climate;
  if (!climate?.enabled) {
    return [];
  }
  return Object.entries(climate.rooms ?? {})
    .filter(([, room]) => room.enabled)
    .map(([entity]) => entity);
}

const ALL: Route = { tab: "devices", section: "climate" };

/**
 * "Heizung & Klima" on the overview: each device Joe regulates with its
 * room, actual and target temperature, the profile running and why. A tap
 * opens the device's page (Geräte › Heizung & Klima › <Gerät>).
 */
export class JoeOverviewClimate extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;
  @property({ attribute: false }) prefix = PANEL;
  @property({ attribute: false }) climateFound?: ClimateFound;

  static styles = [
    shared,
    css`
      :host {
        display: block;
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
      a.all {
        min-height: 44px;
        text-decoration: none;
      }
      .rooms {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
        gap: 8px;
        margin-top: 10px;
      }
      a.room {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: center;
        gap: 2px 10px;
        min-height: 44px;
        padding: 10px 12px;
        border-radius: 12px;
        background: var(--joe-surface-2);
        color: inherit;
        text-decoration: none;
        transition: background 0.12s;
      }
      a.room:hover {
        background: var(--joe-line);
      }
      .room-text {
        display: grid;
        gap: 2px;
        min-width: 0;
      }
      .room-name {
        font-weight: 700;
        overflow-wrap: anywhere;
      }
      .room-name small {
        font-weight: 500;
        color: var(--joe-muted);
        margin-left: 6px;
      }
      .room-temp {
        font-variant-numeric: tabular-nums;
        color: var(--joe-ink);
      }
      .room-why {
        font-size: 13.5px;
        color: var(--joe-ink-2);
      }
      .room .go {
        color: var(--joe-muted);
      }
    `,
  ];

  protected render() {
    const { t, hass, state: joe } = this;
    const entities = climateRooms(joe);
    if (!t || !joe || !entities.length) {
      return nothing;
    }
    const config = joe.config;
    const awayAfter = config.climate?.away_after_min ?? AWAY_AFTER_DEFAULT;
    const rows = entities.map((entity) => {
      const device = this.climateFound?.devices.find((d) => d.entity_id === entity);
      const room = config.climate?.rooms[entity];
      const now = joe.climate?.rooms[entity];
      return {
        entity,
        name: device?.name ?? (hass ? entityName(hass, entity) : entity),
        area: device?.area ?? areaOf(hass, device?.device_id, entity) ?? "",
        temps: temperatureText(t, temperatures(hass, device, entity)),
        profile: device ? activeProfile(t, device, now, room?.device_profiles ?? {}) : undefined,
        why: reasonText(t, now, awayAfter),
      };
    });
    rows.sort((a, b) => a.area.localeCompare(b.area, t.lang) || a.name.localeCompare(b.name, t.lang));
    const live = Boolean(joe.climate?.live);
    return html`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:thermostat"></ha-icon>${t("overview.climate")}</div>
        ${live ? nothing : html`<span class="chip">${t("overview.climate.would")}</span>`}
        ${tip(t, "overview_climate")}
        <a class="mini-btn quiet all" href=${href(this.prefix, ALL)} @click=${onLink(ALL)}>${t("overview.climate.all")}</a>
      </div>
      <div class="rooms">
        ${rows.map((row) => {
          const to = deviceRoute({ group: "climate", id: row.entity });
          const why = [row.profile, row.why].filter(Boolean).join(" · ");
          return html`<a class="room" href=${href(this.prefix, to)} @click=${onLink(to)}>
            <span class="room-text">
              <span class="room-name">${row.area || row.name}${row.area ? html`<small>${row.name}</small>` : nothing}</span>
              ${row.temps ? html`<span class="room-temp">${row.temps}</span>` : nothing}
              ${why ? html`<span class="room-why">${why}</span>` : nothing}
            </span>
            <ha-icon class="go" icon="mdi:chevron-right"></ha-icon>
          </a>`;
        })}
      </div>
    </section>`;
  }
}

define("joe-overview-climate", JoeOverviewClimate);
