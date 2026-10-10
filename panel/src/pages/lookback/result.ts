import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { displayTitle, swoosh } from "../../components/bits";
import "../../components/chart";
import type { ChartSeries } from "../../components/chart";
import { currencySymbol, dayText, fixed, money, nights } from "../../components/look-back";
import { tip } from "../../components/tip";
import { define } from "../../define";
import type { Translate } from "../../i18n";
import { dayTicks, learningMarker } from "../../learned-view";
import { PANEL, href, onLink, type Route } from "../../router";
import { shared } from "../../styles/shared";
import type { ClimateFound, HomeAssistant, JoeState, Learning } from "../../types";

// Nights shown in the table.
const RECENT = 14;

/** Rückblick › Ergebnis: what steering would have saved, and how well Joe guessed each night. */
export class JoeLookbackResult extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;
  @property({ attribute: false }) prefix = PANEL;
  @property({ attribute: false }) route?: Route;
  @property({ attribute: false }) climateFound?: ClimateFound;

  @state() private data?: Learning;
  @state() private failed = false;

  private marker?: string;

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      .wrap {
        max-width: 1100px;
        margin: 0 auto;
      }
      .display {
        font-size: clamp(30px, 4vw, 44px);
      }
      .lead {
        max-width: 62ch;
      }
      .card {
        padding: 18px 20px;
        margin-top: 12px;
      }
      .hero {
        margin-top: 18px;
      }
      .head {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .head .eyebrow {
        flex: 1;
      }
      .figure {
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
        gap: 6px 12px;
        margin-top: 10px;
      }
      .big {
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 800;
        font-size: clamp(52px, 7vw, 76px);
        line-height: 1;
        font-variant-numeric: tabular-nums;
      }
      .big.good {
        color: var(--joe-good);
      }
      .big.bad {
        color: var(--joe-crit);
      }
      .say {
        margin: 10px 0 0;
        font-size: 15px;
        line-height: 1.5;
        color: var(--joe-ink-2);
        max-width: 62ch;
      }
      .split {
        margin: 6px 0 0;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
      }
      joe-chart {
        margin-top: 10px;
      }
      .table {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) minmax(0, 1fr) auto;
        align-items: center;
        margin-top: 10px;
        font-variant-numeric: tabular-nums;
      }
      .table > span {
        padding: 4px 10px;
        min-height: 44px;
        display: flex;
        align-items: center;
        border-top: 1px solid var(--joe-line);
        white-space: nowrap;
      }
      .table > span.th {
        align-self: end;
        min-height: 0;
        padding-block: 8px;
        white-space: normal;
        line-height: 1.25;
        border-top: 0;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--joe-muted);
      }
      .table .unit {
        margin-left: 4px;
        text-transform: none;
        letter-spacing: 0;
        font-weight: 400;
      }
      .table > span:nth-child(4n) {
        justify-content: flex-end;
        font-weight: 700;
      }
      .table a {
        display: inline-flex;
        align-items: center;
        min-height: 44px;
        font-weight: 600;
        color: var(--joe-ink);
        text-decoration: underline;
        text-decoration-color: var(--joe-line-2);
        text-underline-offset: 3px;
      }
      .table a:hover {
        text-decoration-color: var(--joe-amber);
      }
      .table .good {
        color: var(--joe-good);
      }
      .table .bad {
        color: var(--joe-crit);
      }
      .note {
        margin-top: 12px;
      }
      @media (max-width: 760px) {
        .table {
          font-size: 13.5px;
        }
        .table > span {
          padding: 4px 6px;
        }
      }
    `,
  ];

  connectedCallback(): void {
    super.connectedCallback();
    this.load();
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    const marker = learningMarker(this.state);
    if (changed.has("state") && this.marker !== undefined && marker !== this.marker) {
      this.load();
    }
    this.marker = marker;
  }

  private async load(): Promise<void> {
    if (!this.hass) {
      return;
    }
    try {
      this.data = await this.hass.callWS<Learning>({ type: "energy_joe/learning" });
      this.failed = false;
    } catch {
      this.failed = true;
    }
  }

  private get currency(): string {
    return this.hass?.config?.currency ?? "EUR";
  }

  protected render() {
    const t = this.t;
    if (!t) {
      return nothing;
    }
    return html`<div class="wrap">
      ${displayTitle(t("past.result.title"))} ${swoosh}
      <p class="lead">${t("past.result.lead")}</p>
      ${this.failed ? html`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${t("learn.failed")}</div>` : nothing}
      ${this.data ? html`${this.renderResults(t, this.data)} ${this.renderAccuracy(t, this.data)}` : nothing}
    </div>`;
  }

  private renderResults(t: Translate, data: Learning): TemplateResult {
    const results = data.results;
    const head = html`<div class="head">
      <div class="eyebrow"><ha-icon icon="mdi:cash-check"></ha-icon>${t("past.result.total")}</div>
      <span class="pill-sim">${t("mode.simulation")}</span>
      ${tip(t, "sim_result")}
    </div>`;
    if (!results?.days) {
      return html`<section class="card hero" data-tipped>${head}
        <p class="say">${t("learn.results.none")}</p>
      </section>`;
    }
    const daily = results.daily;
    const series: ChartSeries[] = [
      {
        label: t("learn.results.chart.saving"),
        kind: "bar",
        values: daily.map((d) => d.saving),
        color: "var(--joe-good)",
        negative: "var(--joe-crit)",
        digits: 2,
      },
    ];
    const since = results.since ?? results.first;
    return html`<section class="card hero" data-tipped>
      ${head}
      <div class="figure">
        <div class="big ${results.saving > 0.005 ? "good" : results.saving < -0.005 ? "bad" : ""}">
          ${money(t, results.saving, this.currency, true)}
        </div>
      </div>
      <p class="say">
        ${t("learn.results.say", { since: since ? dayText(t.lang, since) : "–", nights: nights(t, results.days) })}
      </p>
      <p class="split">
        ${t("learn.results.split", {
          better: results.better,
          worse: results.worse,
          same: Math.max(0, results.days - results.better - results.worse),
        })}
      </p>
      ${daily.length > 1
        ? html`<joe-chart
            .labels=${daily.map((d) => dayText(t.lang, d.date, "weekday"))}
            .ticks=${dayTicks(t.lang, daily.map((d) => d.date))}
            .series=${series}
            centerTicks
            unit=${currencySymbol(t.lang, this.currency)}
            height="160"
            lang=${t.lang}
            label=${t("learn.results.chart")}
          ></joe-chart>`
        : nothing}
    </section>`;
  }

  /** Each recent night: expected against real, and what the plan brought. The night opens its day. */
  private renderAccuracy(t: Translate, data: Learning): TemplateResult {
    const rows = data.accuracy.slice(-RECENT).reverse();
    const kwh = (value: number | null | undefined) => (value == null ? "–" : fixed(t.lang, value, 1));
    return html`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:target"></ha-icon>${t("learn.accuracy")}</div>
        ${tip(t, "learn_accuracy")}
      </div>
      ${rows.length
        ? html`<div class="table" role="table" aria-label=${t("learn.accuracy")}>
            <span class="th" role="columnheader">${t("learn.accuracy.night")}</span>
            <span class="th" role="columnheader">${t("learn.accuracy.solar")}<span class="unit">kWh</span></span>
            <span class="th" role="columnheader">${t("learn.accuracy.morning")}<span class="unit">kWh</span></span>
            <span class="th" role="columnheader">${t("learn.accuracy.result")}</span>
            ${rows.map((row) => {
              const to: Route = { tab: "review", section: "days", id: row.end ?? row.date };
              return html`<span role="cell"
                  ><a href=${href(this.prefix, to)} @click=${onLink(to)}>${dayText(t.lang, row.date, "weekday")}</a></span
                >
                <span role="cell">${t("learn.accuracy.value", { expected: kwh(row.solar.forecast), actual: kwh(row.solar.actual) })}</span>
                <span role="cell">${t("learn.accuracy.value", { expected: kwh(row.bridge.planned), actual: kwh(row.bridge.actual) })}</span>
                <span role="cell" class=${row.saving > 0.005 ? "good" : row.saving < -0.005 ? "bad" : ""}
                  >${money(t, row.saving, this.currency, true)}</span
                >`;
            })}
          </div>`
        : html`<p class="say">${t("learn.accuracy.none")}</p>`}
    </section>`;
  }
}

define("joe-lookback-result", JoeLookbackResult);
