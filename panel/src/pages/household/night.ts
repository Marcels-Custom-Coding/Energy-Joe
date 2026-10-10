import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { haOpen, haTarget } from "../../components/ha-open";
import { tip } from "../../components/tip";
import { pickEntity, saveConfig } from "../../config";
import { define } from "../../define";
import { entityName } from "../../entities";
import type { Translate } from "../../i18n";
import { PANEL, href, onLink, type Route } from "../../router";
import { shared } from "../../styles/shared";
import type { Check, ClimateFound, Discovery, HomeAssistant, JoeState } from "../../types";
import { nightUses } from "../../uses";
import { pageHead } from "./head";
import { householdStyles } from "./styles";

/** A room's night times when it has none of its own (model.py). */
const NIGHT_FROM = "23:00";
const NIGHT_UNTIL = "06:30";

/** Haushalt › Nachtruhe: when you are in bed – fixed times per device, or an entity. */
export class JoeHhNight extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;
  @property({ attribute: false }) route?: Route;
  @property({ attribute: false }) prefix = PANEL;
  @property({ attribute: false }) discovery?: Discovery;
  @property({ attribute: false }) checks: Check[] = [];
  @property({ attribute: false }) climateFound?: ClimateFound;

  static styles = [
    shared,
    householdStyles,
    css`
      .seg {
        flex-wrap: wrap;
      }
      .entity-row b {
        overflow-wrap: anywhere;
      }
      ul.devices {
        list-style: none;
        margin: 10px 0 0;
        padding: 0;
        display: grid;
      }
      ul.devices li {
        border-top: 1px solid var(--joe-line);
      }
      ul.devices li:first-child {
        border-top: 0;
      }
      ul.devices a {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 4px 12px;
        min-height: 44px;
        padding: 6px 0;
        color: var(--joe-ink);
        text-decoration: none;
      }
      ul.devices a:hover b {
        text-decoration: underline;
        text-decoration-color: var(--joe-amber);
        text-underline-offset: 3px;
      }
      ul.devices b {
        flex: 1 1 160px;
        min-width: 0;
        font-weight: 600;
        overflow-wrap: anywhere;
      }
      ul.devices span {
        color: var(--joe-ink-2);
        font-variant-numeric: tabular-nums;
      }
      ul.devices ha-icon {
        color: var(--joe-muted);
      }
      .go-link {
        display: inline-flex;
        align-items: center;
        min-height: 44px;
        margin-top: 4px;
        font-weight: 600;
        color: var(--joe-ink);
        text-decoration: underline;
        text-decoration-color: var(--joe-line-2);
        text-underline-offset: 3px;
      }
      .go-link:hover {
        text-decoration-color: var(--joe-amber);
      }
    `,
  ];

  protected render() {
    const { t, state: joe } = this;
    if (!t || !joe || !this.hass) {
      return nothing;
    }
    return html`<div class="wrap">
      ${pageHead(t, this.prefix, t("household.night.title"), t("household.night.lead"), nightUses(t, joe.config, this.climateFound))}
      ${this.renderSource(t, joe)} ${this.renderDevices(t, joe)}
    </div>`;
  }

  /** Night by fixed times or by an entity that is on while you are in bed. */
  private renderSource(t: Translate, joe: JoeState): TemplateResult {
    const hass = this.hass!;
    const climate = joe.config.climate;
    const by = climate?.night_by ?? "time";
    const entity = climate?.night_entity ?? null;
    const live = entity ? hass.states[entity] : undefined;
    return html`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:weather-night"></ha-icon>${t("household.night.source")}</div>
        ${tip(t, "climate_night_source")}
      </div>
      <div class="row">
        <span>${t("climate.night.by")}</span>
        <span class="seg" role="group" aria-label=${t("climate.night.by")}>
          ${(["time", "entity"] as const).map(
            (way) => html`<button type="button" aria-pressed=${String(by === way)} @click=${() => this.setNightBy(way)}>
              ${t(`climate.night.by.${way}`)}
            </button>`,
          )}
        </span>
      </div>
      ${by === "entity"
        ? html`<div class="row entity-row">
              <span>${entity ? html`<b title=${entity}>${entityName(hass, entity)}</b>` : t("climate.night.no_entity")}</span>
              ${live
                ? html`<span class="chip ${live.state === "on" ? "ok" : ""}"
                    >${t(live.state === "on" ? "climate.night.now_on" : "climate.night.now_off")}</span
                  >`
                : nothing}
              ${entity ? haOpen(t, haTarget(hass, entity, entityName(hass, entity))) : nothing}
              <button type="button" class="btn btn-secondary" @click=${() => void this.pickNight()}>
                ${t(entity ? "climate.night.change" : "climate.night.pick")}
              </button>
            </div>
            <p class="hint">${t("climate.night.entity_say")}</p>`
        : html`<p class="hint">${t("climate.night.time_say")}</p>`}
    </section>`;
  }

  /**
   * The devices that switch off at night, with their times. The times stay at
   * each device (a household-wide time would need the backend), so every row
   * leads to its device.
   */
  private renderDevices(t: Translate, joe: JoeState): TemplateResult {
    const climate = joe.config.climate;
    const byEntity = climate?.night_by === "entity";
    const names = Object.fromEntries((this.climateFound?.devices ?? []).map((d) => [d.entity_id, d.name]));
    const rooms = Object.entries(climate?.rooms ?? {}).filter(([, room]) => room.night_off);
    const group: Route = { tab: "devices", section: "climate" };
    return html`<section class="card">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:power-sleep"></ha-icon>${t("household.night.devices")}</div>
      </div>
      ${rooms.length
        ? html`<ul class="devices">
            ${rooms.map(([id, room]) => {
              const to: Route = { tab: "devices", section: "climate", id };
              const from = room.night_from || NIGHT_FROM;
              const until = room.night_until || NIGHT_UNTIL;
              return html`<li>
                <a href=${href(this.prefix, to)} @click=${onLink(to)}>
                  <b>${names[id] ?? entityName(this.hass!, id)}</b>
                  <span>${byEntity ? t("household.night.until", { until }) : t("household.night.span", { from, until })}</span>
                  ${room.enabled && climate?.enabled ? nothing : html`<small class="hint">${t("household.night.not_steered")}</small>`}
                  <ha-icon icon="mdi:chevron-right"></ha-icon>
                </a>
              </li>`;
            })}
          </ul>`
        : html`<p class="hint">${t("household.night.devices.none")}</p>`}
      <a class="go-link" href=${href(this.prefix, group)} @click=${onLink(group)}>${t("household.night.to_climate")}</a>
    </section>`;
  }

  private setNightBy(way: "time" | "entity"): void {
    void saveConfig(this, { climate: { night_by: way } });
    if (way === "entity" && !this.state?.config.climate?.night_entity) {
      void this.pickNight();
    }
  }

  private async pickNight(): Promise<void> {
    const t = this.t;
    if (!t) return;
    const entity = this.state?.config.climate?.night_entity;
    const picked = await pickEntity(this, {
      heading: t("pick.night.title"),
      tip: "pick_night",
      filter: "night",
      selected: entity ? [entity] : [],
    });
    if (picked) {
      void saveConfig(this, { climate: { night_by: "entity", night_entity: picked.selected[0] ?? null } });
    }
  }
}

define("joe-hh-night", JoeHhNight);
