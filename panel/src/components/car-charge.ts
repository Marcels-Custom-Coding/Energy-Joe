import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { define } from "../define";
import { formatNumber } from "../entities";
import type { Translate } from "../i18n";
import { shared } from "../styles/shared";
import type { ActionConfig, HomeAssistant, JoeState } from "../types";
import { tip } from "./tip";

/**
 * Charging a car by hand: one target (a level or a range plus the reserve),
 * then "now" or "tonight" in the cheap window. On the devices page and in the
 * dashboard card "Auto laden".
 */
export class JoeCarCharge extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;
  @property({ attribute: false }) action?: ActionConfig;

  /** First in its block (a device page's "Jetzt"): no rule above it. */
  @property({ type: Boolean, reflect: true }) flush = false;
  @state() private values: Partial<Record<"%" | "km", number>> = {};
  @state() private unit?: "%" | "km";
  @state() private failed = false;

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      .boost {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        margin-top: 14px;
        padding-top: 12px;
        border-top: 1px solid var(--joe-line);
      }
      :host([flush]) .boost {
        margin-top: 0;
        padding-top: 0;
        border-top: 0;
      }
      .boost .amount {
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
      .boost .input {
        width: 78px;
        min-height: 34px;
        padding: 4px 8px;
      }
      @media (pointer: coarse) {
        .boost .input {
          min-height: 44px;
        }
      }
      .boost .unit {
        color: var(--joe-ink-2);
      }
      .boost .unit-seg button {
        min-width: 44px;
      }
      .boost .charge-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        flex-basis: 100%;
      }
      .boost .hint {
        flex-basis: 100%;
        color: var(--joe-muted);
        font-size: 12.5px;
      }
      .boost.on span {
        flex: 1 1 200px;
        font-weight: 600;
        color: var(--joe-ink);
      }
      .bad {
        color: var(--joe-warn, var(--joe-crit));
        margin: 6px 0 0;
      }
    `,
  ];

  /*
   * Charging a car by hand: one target (a level or a range plus the reserve),
   * then "now" or "tonight" in the cheap window.
   */
  protected render() {
    return html`${this.renderBody()}
    ${this.failed && this.t ? html`<p class="bad" role="status">${this.t("devices.charge.failed")}</p>` : nothing}`;
  }

  private renderBody() {
    const { t, state: joe, action } = this;
    if (!t || !joe || !action) {
      return nothing;
    }
    const night = joe.plan?.window?.start;
    const tonight = Boolean(night) && joe.control?.tonight?.[action.id] === night;
    const boost = joe.control?.boost?.[action.id];
    const live = joe.control?.actions?.[action.id];
    const chosen = joe.control?.tonight_target?.[action.id];
    const need = action.need!;
    const amount = (target: number, total: number, unit: "%" | "km") =>
      unit === "km"
        ? t("devices.charge.km", { target: formatNumber(t.lang, target, 0), reserve: formatNumber(t.lang, total - target, 0) })
        : t("devices.charge.percent", { target: formatNumber(t.lang, target, 0) });
    if (boost) {
      const value = live?.value;
      return html`<div class="boost on" data-tipped>
        <span>
          ${t("devices.charge.now_running", {
            amount: amount(boost.chosen, boost.target, boost.unit),
            now: value == null ? "–" : `${formatNumber(t.lang, value, 0)} ${boost.unit}`,
          })}
        </span>
        <button type="button" class="mini-btn quiet" @click=${() => this.boost(null)}>${t("devices.boost.stop")}</button>
        ${tip(t, "boost")}
      </div>`;
    }
    if (tonight) {
      const mine = chosen && chosen.night === night ? chosen : null;
      return html`<div class="boost on" data-tipped>
        <span>
          ${live?.reason === "reached"
            ? t(mine ? "devices.charge.tonight_done" : "devices.action.reached_plain", {
                amount: mine ? amount(mine.chosen, mine.target, mine.unit) : "",
              })
            : mine
              ? t("devices.charge.tonight_set", { amount: amount(mine.chosen, mine.target, mine.unit) })
              : t("devices.charge.tonight_window")}
        </span>
        <button type="button" class="mini-btn quiet" @click=${() => this.tonight(false)}>${t("devices.boost.stop")}</button>
        ${tip(t, "boost")}
      </div>`;
    }
    const units: ("%" | "km")[] = [...(need.soc_entity ? ["%" as const] : []), ...(need.range_entity ? ["km" as const] : [])];
    const unit = this.unit && units.includes(this.unit) ? this.unit : units[0];
    const value = this.values[unit] ?? (unit === "%" ? 80 : 200);
    const max = unit === "%" ? 100 : 1500;
    const typed = (form: HTMLFormElement | null): number => {
      const input = form?.querySelector("input") as HTMLInputElement | null;
      const number = Number.parseFloat((input?.value ?? "").replace(",", "."));
      return Math.round(Math.min(max, Math.max(1, Number.isFinite(number) ? number : value)));
    };
    return html`<form
      class="boost"
      data-tipped
      novalidate
      @submit=${(ev: Event) => {
        ev.preventDefault();
        this.boost(typed(ev.target as HTMLFormElement), unit);
      }}
    >
      <label class="toggle-label" for="boost-${action.id}">${t("devices.charge.label")}</label>
      <span class="amount">
        <input
          id="boost-${action.id}"
          class="input"
          type="number"
          inputmode="numeric"
          min=${unit === "%" ? 5 : 10}
          max=${max}
          step=${unit === "%" ? 5 : 10}
          .value=${String(value)}
          @change=${(ev: Event) => {
            const number = Number.parseFloat((ev.target as HTMLInputElement).value.replace(",", "."));
            if (Number.isFinite(number) && number >= 1) {
              this.values = { ...this.values, [unit]: Math.min(number, max) };
            }
          }}
        />
        ${units.length > 1
          ? html`<span class="seg unit-seg" role="group" aria-label=${t("devices.boost.unit")}>
              ${units.map(
                (u) => html`<button
                  type="button"
                  aria-pressed=${String(u === unit)}
                  @click=${() => (this.unit = u)}
                >
                  ${u}
                </button>`,
              )}
            </span>`
          : html`<span class="unit">${unit}</span>`}
      </span>
      ${tip(t, "boost")}
      <span class="charge-buttons">
        <button type="submit" class="mini-btn go" ?disabled=${joe.mode === "off" || !action.enabled}>
          <ha-icon icon="mdi:ev-plug-type2"></ha-icon>${t("devices.charge.now")}
        </button>
        <button
          type="button"
          class="mini-btn"
          ?disabled=${!night || !action.enabled}
          @click=${(ev: Event) => this.tonight(true, typed((ev.target as HTMLElement).closest("form")), unit)}
        >
          <ha-icon icon="mdi:weather-night"></ha-icon>${t("devices.charge.tonight")}
        </button>
      </span>
      ${unit === "km" ? html`<small class="hint">${t("devices.boost.reserve", { reserve: formatNumber(t.lang, need.reserve_km ?? 50, 0) })}</small>` : nothing}
      ${night ? nothing : html`<small class="hint">${t("devices.charge.no_night")}</small>`}
    </form>`;
  }

  private async boost(target: number | null, unit: "%" | "km" = "%"): Promise<void> {
    await this.call({ type: "energy_joe/control/boost", action_id: this.action?.id, target, unit });
  }

  private async tonight(on: boolean, target?: number, unit?: "%" | "km"): Promise<void> {
    await this.call({
      type: "energy_joe/control/action_tonight",
      action_id: this.action?.id,
      on,
      ...(target != null ? { target, unit } : {}),
    });
  }

  private async call(message: { type: string; [key: string]: unknown }): Promise<void> {
    this.failed = false;
    try {
      await this.hass?.callWS(message);
    } catch {
      this.failed = true;
    }
  }
}

define("joe-car-charge", JoeCarCharge);
