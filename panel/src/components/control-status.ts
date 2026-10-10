import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { define } from "../define";
import type { Translate } from "../i18n";
import { shared } from "../styles/shared";
import type { HomeAssistant, JoeState } from "../types";
import { timeOf } from "./plan-text";
import { tip } from "./tip";

/** What Joe does with the devices right now, in one sentence ("Ich steuere heute Nacht ab 01:00 Uhr."). */
export function controlText(t: Translate, joe: JoeState): string {
  const plan = joe.plan;
  const reason = joe.control?.reason ?? "off";
  return reason === "waiting" && plan?.window
    ? t("devices.status.waiting", { time: timeOf(plan.window.start) })
    : reason === "day"
      ? t("devices.status.day", { time: plan?.day ? timeOf(plan.day.defer_until) : "–" })
      : t(`devices.status.${reason}`);
}

/**
 * "Gerade": what Joe does with the devices right now, and the emergency
 * button "Sofort freigeben" while he steers or still puts things back.
 * Used on Geräte › Alle and Speicher; the overview shows it `compact`
 * (only the note and the button, nothing while Joe does not steer).
 */
export class JoeControlStatus extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;
  /** Without card, head and sentence (the overview says what Joe does itself). */
  @property({ type: Boolean, reflect: true }) compact = false;

  @state() private notice = "";

  static styles = [
    shared,
    css`
      :host {
        display: block;
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
      .note {
        margin-top: 10px;
      }
      .actions {
        margin-top: 14px;
      }
      :host([compact]) .card {
        margin: 0;
        padding: 0;
        background: transparent;
        box-shadow: none;
      }
      :host([compact]) .actions {
        margin-top: 10px;
      }
    `,
  ];

  protected render() {
    const t = this.t;
    const joe = this.state;
    const control = joe?.control;
    if (!t || !joe || !control) {
      return nothing;
    }
    const canRelease = control.steering || control.pending;
    if (this.compact) {
      return canRelease || this.notice
        ? html`<section class="card status" ?data-tipped=${canRelease}>${this.renderRelease(t, control.pending, canRelease)}</section>`
        : nothing;
    }
    const text = controlText(t, joe);
    const pill =
      joe.mode === "simulation"
        ? html`<span class="pill-sim">${t("mode.simulation")}</span>`
        : html`<span class="chip ${joe.mode === "live" ? "ok" : joe.mode === "advisory" ? "learned" : ""}"
            >${t(`mode.${joe.mode}`)}</span
          >`;
    return html`<section class="card status" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:pulse"></ha-icon>${t("devices.now")}</div>
        ${pill} ${tip(t, "plan_steer")}
      </div>
      <p class="status-text">${text}</p>
      ${this.renderRelease(t, control.pending, canRelease)}
    </section>`;
  }

  /** The note while values are not back yet, "Sofort freigeben" and what came of it. */
  private renderRelease(t: Translate, pending: boolean, canRelease: boolean) {
    return html`${pending
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
      ${this.notice ? html`<div class="note" role="status"><ha-icon icon="mdi:check"></ha-icon>${this.notice}</div>` : nothing}`;
  }

  private async release(): Promise<void> {
    try {
      await this.hass?.callWS({ type: "energy_joe/control/release" });
    } catch {
      this.notice = this.t!("error.action");
    }
  }
}

define("joe-control-status", JoeControlStatus);
