import { LitElement, css, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { displayTitle, swoosh } from "../components/bits";
import "../components/pose";
import { define } from "../define";
import type { Translate } from "../i18n";
import { shared } from "../styles/shared";

/** Overview: tonight's plan and the simulation result. */
export class JoeOverview extends LitElement {
  @property({ attribute: false }) t?: Translate;

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
        max-width: 1180px;
        margin: 0 auto;
      }
      .card {
        padding: 22px 22px 24px;
        overflow: hidden;
      }
      .card .display {
        font-size: clamp(30px, 3.6vw, 40px);
        margin-top: 12px;
        max-width: 60%;
      }
      .card .lead {
        font-size: 15px;
        max-width: 44ch;
      }
      joe-pose {
        position: absolute;
        right: -6px;
        top: 10px;
        width: 170px;
        pointer-events: none;
      }
      .wide {
        grid-column: 1 / -1;
      }
      .next {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
        list-style: none;
        margin: 14px 0 0;
        padding: 0;
        counter-reset: step;
      }
      .next li {
        counter-increment: step;
        display: grid;
        gap: 4px;
        align-content: start;
        padding: 14px;
        border-radius: 12px;
        background: var(--joe-surface-2);
      }
      .next li::before {
        content: counter(step);
        display: grid;
        place-items: center;
        width: 30px;
        height: 30px;
        margin-bottom: 4px;
        border-radius: 50%;
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 800;
        font-size: 17px;
        background: var(--joe-surface);
        color: var(--joe-ink-2);
        box-shadow: inset 0 0 0 2px var(--joe-line-2);
      }
      .next li.done::before {
        background: var(--joe-amber);
        color: var(--joe-amber-ink);
        box-shadow: none;
      }
      .next b {
        font-weight: 700;
      }
      .next span {
        color: var(--joe-ink-2);
        font-size: 14px;
      }
      .next .chip {
        justify-self: start;
        margin-top: 6px;
      }
      @media (max-width: 900px) {
        .grid {
          grid-template-columns: 1fr;
        }
        .next {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (max-width: 480px) {
        .next {
          grid-template-columns: 1fr;
        }
      }
      @media (max-width: 480px) {
        joe-pose {
          width: 120px;
        }
        .card .display {
          max-width: 64%;
        }
      }
    `,
  ];

  protected render() {
    const t = this.t;
    if (!t) {
      return nothing;
    }
    return html`<div class="grid">
      <section class="card">
        <joe-pose name="relax"></joe-pose>
        <div class="eyebrow"><ha-icon icon="mdi:weather-night"></ha-icon>${t("overview.night")}</div>
        ${displayTitle(t("overview.night.empty.title"))} ${swoosh}
        <p class="lead">${t("overview.night.empty.text")}</p>
      </section>
      <section class="card">
        <joe-pose name="plan"></joe-pose>
        <div class="eyebrow"><ha-icon icon="mdi:calculator-variant-outline"></ha-icon>${t("overview.sim")}</div>
        ${displayTitle(t("overview.sim.empty.title"))} ${swoosh}
        <p class="lead">${t("overview.sim.empty.text")}</p>
      </section>
      <section class="card wide">
        <div class="eyebrow"><ha-icon icon="mdi:map-marker-path"></ha-icon>${t("overview.next")}</div>
        <ol class="next">
          <li class="done">
            <b>${t("overview.next.1.title")}</b><span>${t("overview.next.1.text")}</span>
            <span class="chip ok"><ha-icon icon="mdi:check"></ha-icon>${t("status.done")}</span>
          </li>
          <li>
            <b>${t("overview.next.2.title")}</b><span>${t("overview.next.2.text")}</span>
            <span class="chip soon">${t("soon")}</span>
          </li>
          <li><b>${t("overview.next.3.title")}</b><span>${t("overview.next.3.text")}</span></li>
          <li><b>${t("overview.next.4.title")}</b><span>${t("overview.next.4.text")}</span></li>
        </ol>
      </section>
    </div>`;
  }
}

define("joe-overview", JoeOverview);
