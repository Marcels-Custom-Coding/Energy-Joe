import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { contextRow, findingList, findingStyles } from "../../components/finding-rows";
import { haOpen, haTarget } from "../../components/ha-open";
import { tip } from "../../components/tip";
import { usedBy } from "../../components/used-by";
import { saveConfig } from "../../config";
import { define } from "../../define";
import { entityName } from "../../entities";
import type { Translate } from "../../i18n";
import { PANEL, type Route } from "../../router";
import { shared } from "../../styles/shared";
import type { Check, ClimateFound, Discovery, HomeAssistant, JoeInfo, JoeState } from "../../types";
import { travelUses } from "../../uses";
import { pageHead } from "./head";
import { householdStyles } from "./styles";

/** Haushalt › Unterwegs & Wetter: the weather, and how Joe works out distances and drive times. */
export class JoeHhTravel extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;
  @property({ attribute: false }) route?: Route;
  @property({ attribute: false }) prefix = PANEL;
  @property({ attribute: false }) discovery?: Discovery;
  @property({ attribute: false }) checks: Check[] = [];
  @property({ attribute: false }) climateFound?: ClimateFound;
  /** What can work out distances (Waze, Google entries). */
  @property({ attribute: false }) info?: JoeInfo;

  static styles = [
    shared,
    householdStyles,
    findingStyles,
    css`
      .field {
        margin-top: 14px;
      }
      .field-label {
        flex-wrap: wrap;
      }
      .field .input {
        max-width: 420px;
      }
    `,
  ];

  protected render() {
    const { t, state: joe, hass } = this;
    if (!t || !joe || !hass) {
      return nothing;
    }
    const config = joe.config;
    return html`<div class="wrap">
      ${pageHead(t, this.prefix, t("household.travel.title"), t("household.travel.lead"), null)}
      <section class="card">
        ${findingList(t, [
          contextRow(this, hass, t, config, this.discovery, "weather", (entity) =>
            haOpen(t, haTarget(hass, entity, entityName(hass, entity))),
          ),
        ])}
        ${usedBy(t, this.prefix, travelUses(t, config, "weather", this.climateFound))}
      </section>
      ${this.renderRouting(t, joe)}
    </div>`;
  }

  /** How Joe works out the distance to an appointment's place and the drive home. */
  private renderRouting(t: Translate, joe: JoeState): TemplateResult {
    const routing = joe.config.routing;
    const options = this.info?.routing;
    const value = routing.service === "google" ? `google:${routing.google_entry ?? ""}` : (routing.service ?? "");
    const choose = (raw: string) => {
      if (raw.startsWith("google:")) {
        saveConfig(this, { routing: { service: "google", google_entry: raw.slice(7) || null } });
      } else {
        saveConfig(this, { routing: { service: (raw || null) as "waze" | "osm" | null, google_entry: null } });
      }
    };
    const url = (key: "geocoder_url" | "router_url") => html`<div class="field" data-tipped>
      <span class="field-label"><label for="routing-${key}">${t(`settings.routing.${key}`)}</label>${tip(t, "routing_osm")}</span>
      <small class="field-hint">${t(`settings.routing.${key}.hint`)}</small>
      <input
        id="routing-${key}"
        class="input"
        type="url"
        .value=${routing[key]}
        @change=${(ev: Event) => {
          const text = (ev.target as HTMLInputElement).value.trim();
          if (text.startsWith("http")) saveConfig(this, { routing: { [key]: text } });
        }}
      />
    </div>`;
    return html`<section class="card">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:map-marker-distance"></ha-icon>${t("settings.routing")}</div>
      </div>
      <p class="say">${t("settings.routing.intro")}</p>
      <div class="field" data-tipped>
        <span class="field-label"><label for="routing-service">${t("settings.routing.service")}</label>${tip(t, "routing_service")}</span>
        <small class="field-hint">${t("settings.routing.service.hint")}</small>
        <select id="routing-service" class="input" @change=${(ev: Event) => choose((ev.target as HTMLSelectElement).value)}>
          <option value="" ?selected=${value === ""}>${t("settings.routing.none")}</option>
          ${options?.waze !== false
            ? html`<option value="waze" ?selected=${value === "waze"}>${t("settings.routing.waze")}</option>`
            : nothing}
          ${(options?.google ?? []).map(
            (entry) =>
              html`<option value=${`google:${entry.entry_id}`} ?selected=${value === `google:${entry.entry_id}`}>
                ${t("settings.routing.google", { name: entry.title })}
              </option>`,
          )}
          <option value="osm" ?selected=${value === "osm"}>${t("settings.routing.osm")}</option>
        </select>
      </div>
      ${routing.service === "osm" ? html`${url("geocoder_url")} ${url("router_url")}` : nothing}
      ${usedBy(t, this.prefix, travelUses(t, joe.config, "routing", this.climateFound))}
    </section>`;
  }
}

define("joe-hh-travel", JoeHhTravel);
