import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { define } from "../define";
import { formatNumber } from "../entities";
import type { Translate } from "../i18n";
import { shared } from "../styles/shared";
import type { CarTrip, HomeAssistant, PlanAction } from "../types";
import { timeOf } from "./plan-text";
import { tip } from "./tip";

/**
 * What a car needs tomorrow: trips and reserve, what it has, what Joe charges.
 * Each trip's distance can be corrected (one way); Joe keeps the correction.
 */
export class JoeCarNeed extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) action?: PlanAction;
  @property({ type: Boolean }) roundTrip = true;

  @state() private editing?: string;
  @state() private failed = false;

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      p {
        margin: 6px 0 0;
        font-size: 14px;
        line-height: 1.45;
        color: var(--joe-ink-2);
      }
      p.result {
        color: var(--joe-ink);
        font-weight: 600;
      }
      ul {
        list-style: none;
        margin: 8px 0 0;
        padding: 0;
        display: grid;
        gap: 4px;
      }
      li {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 4px 10px;
        padding: 6px 10px;
        border-radius: 9px;
        background: var(--joe-surface-2);
        font-size: 13.5px;
      }
      li .where {
        flex: 1 1 160px;
        min-width: 0;
        overflow-wrap: break-word;
      }
      li .km {
        margin-left: auto;
      }
      li .km {
        font-variant-numeric: tabular-nums;
        color: var(--joe-ink-2);
      }
      li .unknown {
        color: var(--joe-warn, var(--joe-crit));
      }
      form {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      form .input {
        width: 90px;
        min-height: 32px;
        padding: 4px 8px;
      }
      .head {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 8px;
        font-size: 13px;
        font-weight: 600;
        color: var(--joe-muted);
      }
    `,
  ];

  protected render() {
    const { t, action } = this;
    const need = action?.need;
    if (!t || !action || !need) {
      return nothing;
    }
    const n = (value: number | null | undefined, digits = 0) => formatNumber(t.lang, value ?? 0, digits);
    if (!need.known) {
      return html`<p>${t("need.unknown")}</p>`;
    }
    const lines: TemplateResult[] = [];
    lines.push(
      html`<p>
        ${need.trips_km > 0 && need.trips_km >= (need.usual_km ?? 0)
          ? t("need.trips", { km: n(need.trips_km), count: need.trips.length, reserve: n(need.reserve_km), total: n(need.needed_km) })
          : need.usual_km
            ? t("need.usual", { km: n(need.usual_km), reserve: n(need.reserve_km), total: n(need.needed_km) })
            : t("need.reserve_only", { reserve: n(need.reserve_km) })}
        ${need.unknown_trips ? t("need.unknown_trips", { count: need.unknown_trips }) : ""}
      </p>`,
    );
    lines.push(
      html`<p>
        ${t(`need.consumption.${need.consumption_source}`, {
          value: n(need.consumption, 1),
          temp: need.temp == null ? "–" : n(need.temp),
        })}${need.rain ? ` ${t("need.rain")}` : ""}
      </p>`,
    );
    if (need.target_unit === "%") {
      lines.push(html`<p>${t("need.has_soc", { soc: n(need.soc), km: n(need.have_km), target: n(need.target) })}</p>`);
    } else {
      lines.push(html`<p>${t("need.has_range", { km: n(need.have_km) })}</p>`);
    }
    const missing = need.missing_kwh ?? 0;
    lines.push(
      html`<p class="result">
        ${missing >= 0.2
          ? action.run && !action.manual
            ? t("need.charges", { kwh: n(missing, 1), start: timeOf(action.start) })
            : t("need.missing", { kwh: n(missing, 1) })
          : t("need.enough")}
      </p>`,
    );
    return html`${lines} ${need.trips.length ? this.renderTrips(t, need.trips) : nothing}`;
  }

  private renderTrips(t: Translate, trips: CarTrip[]): TemplateResult {
    return html`<div data-tipped>
      <div class="head">${t("need.trips.title")} ${tip(t, "need_trips")}</div>
      <ul>
        ${trips.map(
          (trip) => html`<li>
            <span>${trip.start.includes("T") ? timeOf(trip.start) : t("need.all_day")}</span>
            <span class="where">${trip.location}</span>
            ${this.editing === trip.location
              ? this.renderEdit(t, trip)
              : html`<span class=${trip.km == null ? "km unknown" : "km"}>
                    ${trip.km == null
                      ? t("need.km_unknown")
                      : t(`need.km.${trip.source ?? "zone"}`, { km: formatNumber(t.lang, trip.km, 0) })}
                  </span>
                  <button
                    type="button"
                    class="mini-btn quiet"
                    aria-label=${t("need.km_edit", { place: trip.location })}
                    @click=${() => (this.editing = trip.location)}
                  >
                    <ha-icon icon="mdi:pencil-outline"></ha-icon>
                  </button>`}
          </li>`,
        )}
      </ul>
      ${this.failed ? html`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${t("error.action")}</div>` : nothing}
    </div>`;
  }

  private renderEdit(t: Translate, trip: CarTrip): TemplateResult {
    const oneWay = trip.km == null ? "" : String(Math.round(trip.km / (this.roundTrip ? 2 : 1)));
    return html`<form
      @submit=${(ev: Event) => {
        ev.preventDefault();
        const input = (ev.target as HTMLFormElement).querySelector("input") as HTMLInputElement;
        const value = Number.parseFloat(input.value.replace(",", "."));
        this.save(trip.location, Number.isFinite(value) && value >= 0 ? value : null);
      }}
    >
      <span class="unit-input">
        <input class="input" type="number" min="0" max="3000" step="1" .value=${oneWay} aria-label=${t("need.km_one_way")} />
        <span class="unit">km</span>
      </span>
      <button type="submit" class="mini-btn go">${t("common.save")}</button>
      <button type="button" class="mini-btn quiet" @click=${() => this.save(trip.location, null)}>${t("need.km_reset")}</button>
    </form>`;
  }

  private async save(location: string, km: number | null): Promise<void> {
    try {
      await this.hass?.callWS({ type: "energy_joe/places/set", location, km });
      this.editing = undefined;
      this.failed = false;
    } catch {
      this.failed = true;
    }
  }
}

define("joe-car-need", JoeCarNeed);
