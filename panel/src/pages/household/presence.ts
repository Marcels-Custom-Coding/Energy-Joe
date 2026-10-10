import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { mirrorRow } from "../../components/mirror";
import { tip } from "../../components/tip";
import { saveConfig } from "../../config";
import { define } from "../../define";
import "../../editors/household";
import { formatNumber } from "../../entities";
import type { Translate } from "../../i18n";
import { PANEL, revealAnchor, type Route } from "../../router";
import { shared } from "../../styles/shared";
import type { Check, ClimateFound, Discovery, HomeAssistant, JoeConfig, JoeInfo, JoeState } from "../../types";
import { presenceUses } from "../../uses";
import { pageHead } from "./head";
import { householdStyles } from "./styles";

/** How long the house must be empty before it counts as away (model.py). */
const AWAY_AFTER_DEFAULT = 15;
const AWAY_AFTER_MAX = 240;

const PROXIMITY_URL = "https://my.home-assistant.io/redirect/config_flow_start/?domain=proximity";

/** The routing service by its name in the list under Unterwegs & Wetter. */
export function routingName(t: Translate, config: JoeConfig, info?: JoeInfo): string {
  const routing = config.routing;
  if (routing.service === "google") {
    const entry = info?.routing?.google.find((e) => e.entry_id === routing.google_entry);
    return t("settings.routing.google", { name: entry?.title ?? "Google" });
  }
  return t(routing.service ? `settings.routing.${routing.service}` : "settings.routing.none");
}

/** Haushalt › Wer ist da: who is home right now, the helper that says so, guest mode and the way home. */
export class JoeHhPresence extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;
  @property({ attribute: false }) route?: Route;
  @property({ attribute: false }) prefix = PANEL;
  @property({ attribute: false }) discovery?: Discovery;
  @property({ attribute: false }) checks: Check[] = [];
  @property({ attribute: false }) climateFound?: ClimateFound;
  @property({ attribute: false }) info?: JoeInfo;
  /** A part the address names (/household/presence/way): scrolled to and lit up. */
  @property({ attribute: false }) anchor?: string;

  static styles = [
    shared,
    householdStyles,
    css`
      .way-list {
        margin: 6px 0 0;
      }
    `,
  ];

  protected render() {
    const { t, state: joe } = this;
    if (!t || !joe || !this.hass) {
      return nothing;
    }
    const config = joe.config;
    return html`<div class="wrap">
      ${pageHead(t, this.prefix, t("household.presence.title"), t("household.presence.lead"), presenceUses(t, config, this.climateFound))}
      ${this.renderLive(t, joe)}
      <joe-household-presence card .hass=${this.hass} .t=${t} .config=${config} .discovery=${this.discovery}></joe-household-presence>
      ${this.renderWay(t, config)}
    </div>`;
  }

  /** Who is home, who heads home, and when the house counts as empty. */
  private renderLive(t: Translate, joe: JoeState): TemplateResult {
    const status = joe.climate;
    const home = status?.home ?? [];
    const arrivals = Object.entries(status?.arrivals ?? this.climateFound?.arrivals ?? {});
    const names = Object.fromEntries(joe.config.persons.map((p) => [p.person_entity, p.name]));
    const away = joe.config.climate?.away_after_min ?? AWAY_AFTER_DEFAULT;
    return html`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:home-account"></ha-icon>${t("household.presence.now")}</div>
        ${tip(t, "climate_presence")}
      </div>
      <p class="now">${home.length ? t("climate.home", { names: home.join(", ") }) : t("climate.nobody")}</p>
      ${arrivals.map(
        ([person, info]) => html`<p class="hint">
          ${t(`climate.way.${info.direction === "towards" ? "towards" : info.direction === "away_from" ? "away" : "other"}`, {
            name: names[person] ?? this.hass?.states[person]?.attributes.friendly_name ?? person,
            km: info.km != null ? formatNumber(t.lang, info.km, 1) : "–",
          })}
          ${info.direction === "towards" && info.minutes != null
            ? t(info.source ? "climate.way.minutes_route" : "climate.way.minutes_guess", { minutes: info.minutes })
            : nothing}
        </p>`,
      )}
      <div class="row" data-tipped>
        <span>${t("climate.away_after")}</span>
        <input
          class="input short"
          type="number"
          inputmode="numeric"
          min="0"
          max=${AWAY_AFTER_MAX}
          step="1"
          aria-label=${t("climate.away_after")}
          .value=${String(away)}
          @change=${(ev: Event) => {
            const input = ev.target as HTMLInputElement;
            const value = Math.round(Number.parseFloat(input.value.replace(",", ".")));
            if (!Number.isFinite(value)) {
              input.value = String(away);
              return;
            }
            const minutes = Math.min(AWAY_AFTER_MAX, Math.max(0, value));
            input.value = String(minutes);
            void saveConfig(this, { climate: { away_after_min: minutes } });
          }}
        />
        <span>${t("climate.away_after.unit")}</span>
        ${tip(t, "climate_away_after")}
      </div>
    </section>`;
  }

  /** The way home: the drive time from the routing service, and "Nähe" (Proximity) to know who heads home. */
  private renderWay(t: Translate, config: JoeConfig): TemplateResult {
    const eta = config.climate?.route_eta ?? true;
    return html`<section class="card" data-anchor="way" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:map-marker-path"></ha-icon>${t("household.presence.way")}</div>
      </div>
      <p class="say">${t("household.presence.way.say")}</p>
      <div class="row">
        <span id="route-eta">${t("climate.route_eta")}</span>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(eta)}
          aria-labelledby="route-eta"
          @click=${() => saveConfig(this, { climate: { route_eta: !eta } })}
        ></button>
        ${tip(t, "climate_route_eta")}
      </div>
      ${mirrorRow(t, this.prefix, {
        label: t("household.presence.routing"),
        value: routingName(t, config, this.info),
        to: { tab: "household", section: "travel" },
        action: config.routing.service ? "change" : "set",
      })}
      ${this.climateFound && !this.climateFound.proximity
        ? html`<p class="hint">
            ${t("climate.no_proximity")}
            <a href=${PROXIMITY_URL} target="_blank" rel="noreferrer noopener">${t("climate.add_proximity")}</a>
          </p>`
        : nothing}
    </section>`;
  }

  /** The anchor last scrolled to, so a new state does not scroll again. */
  private revealed?: string;

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has("anchor")) {
      this.revealed = undefined;
    }
  }

  protected updated(): void {
    if (this.anchor && this.revealed !== this.anchor && revealAnchor(this.renderRoot, this.anchor)) {
      this.revealed = this.anchor;
    }
  }
}

define("joe-hh-presence", JoeHhPresence);
