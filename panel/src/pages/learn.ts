import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { displayTitle, sourceChip, swoosh } from "../components/bits";
import "../components/chart";
import type { ChartSeries } from "../components/chart";
import { currencySymbol, dayText, fixed, money, nights } from "../components/look-back";
import "../components/pose";
import "../components/sheet";
import { tip } from "../components/tip";
import { saveConfig } from "../config";
import { define } from "../define";
import { formatNumber } from "../entities";
import type { Translate } from "../i18n";
import { shared } from "../styles/shared";
import type { HomeAssistant, JoeState, Learning } from "../types";

// Nights shown in the table and the buffer chart.
const RECENT = 14;
const LATER = ["capacity", "efficiency", "cold", "presence", "calendar"] as const;

/** Day ticks for a chart of days: about one label per week. */
function dayTicks(lang: string, dates: string[]): Map<number, string> {
  const every = Math.max(1, Math.ceil(dates.length / 7));
  const ticks = new Map<number, string>();
  dates.forEach((date, i) => {
    if ((dates.length - 1 - i) % every === 0) {
      ticks.set(i, dayText(lang, date, "short"));
    }
  });
  return ticks;
}

/** What Joe learned: what steering would have saved, the forecast, the buffer, consumption. */
export class JoeLearnPage extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;

  @state() private data?: Learning;
  @state() private failed = false;
  @state() private confirming = false;
  @state() private resetting = false;
  @state() private notice?: { text: string; ok: boolean };

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
      .intro {
        display: grid;
        grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.75fr);
        gap: 24px;
        align-items: center;
      }
      .intro joe-pose {
        max-width: 340px;
        width: 100%;
        justify-self: end;
      }
      .display {
        font-size: clamp(30px, 4vw, 44px);
      }
      .intro .lead {
        max-width: 56ch;
      }
      .status {
        margin: 8px 0 0;
        color: var(--joe-ink-2);
        font-size: 14px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
        margin-top: 12px;
      }
      .card {
        padding: 18px 20px;
      }
      .hero {
        margin-top: 18px;
      }
      .wide {
        margin-top: 12px;
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
        font-size: clamp(40px, 5vw, 56px);
        line-height: 1;
        font-variant-numeric: tabular-nums;
      }
      .hero .big {
        font-size: clamp(52px, 7vw, 76px);
      }
      .big small {
        font-size: 0.5em;
        margin-left: 2px;
      }
      .big.small {
        font-size: clamp(30px, 3.6vw, 38px);
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
      .legend {
        display: flex;
        flex-wrap: wrap;
        gap: 6px 14px;
        margin-top: 4px;
        font-size: 12.5px;
        color: var(--joe-ink-2);
      }
      .legend span {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .legend i {
        width: 14px;
        height: 4px;
        border-radius: 2px;
      }
      .legend i.dash {
        background: repeating-linear-gradient(90deg, currentColor 0 4px, transparent 4px 7px) !important;
      }
      .own {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        margin-top: 12px;
      }
      .table {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) minmax(0, 1fr) auto;
        margin-top: 10px;
        font-variant-numeric: tabular-nums;
      }
      .table > span {
        padding: 8px 10px;
        border-top: 1px solid var(--joe-line);
        white-space: nowrap;
      }
      .table > span.th {
        align-self: end;
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
        text-align: right;
        font-weight: 700;
      }
      .table .good {
        color: var(--joe-good);
      }
      .table .bad {
        color: var(--joe-crit);
      }
      .later {
        display: grid;
        gap: 8px;
        list-style: none;
        margin: 12px 0 0;
        padding: 0;
      }
      .later li {
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--joe-ink-2);
      }
      .later li ha-icon {
        --mdc-icon-size: 18px;
        color: var(--joe-muted);
      }
      .later + .chip {
        margin-top: 14px;
      }
      .bottom {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
        margin-top: 12px;
      }
      .danger p {
        margin: 10px 0 0;
        color: var(--joe-ink-2);
        max-width: 56ch;
      }
      .danger .actions {
        margin-top: 14px;
      }
      .note {
        margin-top: 12px;
      }
      dl.forget {
        display: grid;
        gap: 4px;
        margin: 14px 0 0;
      }
      dl.forget dt {
        font-weight: 700;
        margin-top: 8px;
      }
      dl.forget dd {
        margin: 0;
        color: var(--joe-ink-2);
      }
      @media (max-width: 900px) {
        .grid,
        .bottom {
          grid-template-columns: 1fr;
        }
      }
      @media (max-width: 760px) {
        .intro {
          grid-template-columns: 1fr;
          gap: 12px;
        }
        .intro joe-pose {
          order: -1;
          justify-self: start;
          max-width: 260px;
        }
        .table {
          font-size: 13.5px;
        }
        .table > span {
          padding: 8px 6px;
        }
      }
    `,
  ];

  connectedCallback(): void {
    super.connectedCallback();
    this.load();
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    // A new evaluation, something learned or a changed buffer: fetch again.
    const config = this.state?.config;
    const results = this.state?.results;
    const marker = [
      results?.days ?? 0,
      results?.since ?? "",
      config?.learned?.updated ?? "",
      config?.learned?.since ?? "",
      config?.rules.buffer_factor ?? "",
      config?.provenance["rules.buffer_factor"]?.source ?? "",
      this.state?.observe?.day_count ?? 0,
    ].join("|");
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
    const data = this.data;
    return html`<div class="wrap">
        <div class="intro">
          <div>
            ${displayTitle(t("learn.page.title"))} ${swoosh}
            <p class="lead">${t("learn.lead")}</p>
            <p class="status">${this.statusText(t)}</p>
          </div>
          <joe-pose name="learn"></joe-pose>
        </div>
        ${this.failed ? html`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${t("learn.failed")}</div>` : nothing}
        ${data
          ? html`${this.renderResults(t, data)}
              <div class="grid">
                ${this.renderSolar(t, data)} ${this.renderShift(t, data)} ${this.renderBuffer(t, data)} ${this.renderHome(t, data)}
              </div>
              ${this.renderAccuracy(t, data)}
              <div class="bottom">${this.renderLater(t)} ${this.renderReset(t)}</div>`
          : nothing}
      </div>
      ${this.confirming ? this.renderConfirm(t) : nothing}`;
  }

  private statusText(t: Translate): string {
    const observe = this.state?.observe;
    const learned = this.state?.config.learned;
    if (this.state?.mode === "off") {
      return t("learn.paused");
    }
    if (!observe?.active) {
      return t("learn.waiting");
    }
    const parts: string[] = [];
    if (learned?.since) {
      parts.push(t("learn.since", { day: dayText(t.lang, learned.since) }));
    } else if (observe.first_day) {
      parts.push(t("learn.since_start", { day: dayText(t.lang, observe.first_day) }));
    }
    if (learned?.updated) {
      parts.push(t("learn.updated", { day: dayText(t.lang, learned.updated, "short"), time: learned.updated.slice(11, 16) }));
    }
    return parts.join(" · ");
  }

  private renderResults(t: Translate, data: Learning): TemplateResult {
    const results = data.results;
    const head = html`<div class="head">
      <div class="eyebrow"><ha-icon icon="mdi:cash-check"></ha-icon>${t("learn.results")}</div>
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

  private renderSolar(t: Translate, data: Learning): TemplateResult {
    const learned = data.learned;
    const factor = learned.solar_factor;
    let say: string;
    if (factor == null) {
      say = t("learn.solar.learning", { need: data.needs.solar, have: learned.solar_days });
    } else if (factor < 0.95) {
      say = t("learn.solar.less", {
        value: formatNumber(t.lang, (1 - factor) * 100, 0),
        share: formatNumber(t.lang, factor * 100, 0),
      });
    } else if (factor > 1.05) {
      say = t("learn.solar.more", {
        value: formatNumber(t.lang, (factor - 1) * 100, 0),
        share: formatNumber(t.lang, factor * 100, 0),
      });
    } else {
      say = t("learn.solar.fits");
    }
    const days = data.solar.slice(-28);
    const series: ChartSeries[] = [
      { label: t("learn.solar.chart.actual"), kind: "bar", values: days.map((d) => d.actual), color: "var(--joe-c-pv)", digits: 1 },
      {
        label: t("learn.solar.chart.forecast"),
        kind: "line",
        values: days.map((d) => d.forecast),
        color: "var(--joe-c-ist)",
        dashed: true,
        digits: 1,
      },
    ];
    return html`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:weather-sunny"></ha-icon>${t("learn.solar")}</div>
        ${tip(t, "learn_solar")}
      </div>
      <div class="figure">
        <div class="big ${factor == null ? "small" : ""}">
          ${factor == null ? t("learn.still") : `× ${formatNumber(t.lang, factor, 2)}`}
        </div>
        ${factor == null
          ? nothing
          : html`${sourceChip(t, { source: "learned" })}<span class="chip">${t("learn.days", { days: learned.solar_days })}</span>`}
      </div>
      <p class="say">${say}</p>
      ${days.length > 1 ? this.chartWithLegend(t, days.map((d) => d.date), series, "kWh", t("learn.solar.chart")) : nothing}
    </section>`;
  }

  private renderShift(t: Translate, data: Learning): TemplateResult {
    const learned = data.learned;
    const shift = learned.solar_shift;
    return html`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:clock-time-four-outline"></ha-icon>${t("learn.shift")}</div>
        ${tip(t, "learn_shift")}
      </div>
      <div class="figure">
        <div class="big ${shift == null ? "small" : ""}">${shift == null ? t("learn.still") : t(`learn.shift.big.${shift}`)}</div>
        ${shift == null
          ? nothing
          : html`${sourceChip(t, { source: "learned" })}<span class="chip">${t("learn.days", { days: learned.shift_days })}</span>`}
      </div>
      <p class="say">
        ${shift == null
          ? t("learn.shift.learning", { need: data.needs.shift, have: learned.shift_days })
          : t(`learn.shift.${shift}`)}
      </p>
      ${data.solar_profile ? this.hourChart(t, this.profileSeries(t, data.solar_profile), t("learn.shift.chart")) : nothing}
    </section>`;
  }

  private profileSeries(t: Translate, profile: NonNullable<Learning["solar_profile"]>): ChartSeries[] {
    return [
      {
        label: t("learn.shift.chart.actual"),
        kind: "area",
        values: profile.actual,
        color: "var(--joe-c-pv)",
        fill: "var(--joe-c-pv-fill)",
      },
      { label: t("learn.shift.chart.forecast"), kind: "line", values: profile.forecast, color: "var(--joe-c-ist)", dashed: true },
    ];
  }

  /** A chart over the 24 hours of a day, with its legend. */
  private hourChart(t: Translate, series: ChartSeries[], label: string): TemplateResult {
    const labels = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, "0")}:00–${String((h + 1) % 24).padStart(2, "0")}:00`);
    const ticks = new Map<number, string>();
    for (let h = 0; h < 24; h += 3) {
      ticks.set(h, String(h).padStart(2, "0"));
    }
    return html`<joe-chart
        .labels=${labels}
        .ticks=${ticks}
        .series=${series}
        unit="kWh"
        height="150"
        lang=${t.lang}
        label=${label}
      ></joe-chart>
      <div class="legend">
        ${series.map((s) => html`<span><i class=${s.dashed ? "dash" : ""} style="background:${s.color};color:${s.color}"></i>${s.label}</span>`)}
      </div>`;
  }

  private renderBuffer(t: Translate, data: Learning): TemplateResult {
    const { value, source } = data.buffer;
    const learned = data.learned;
    const percent = (factor: number) => formatNumber(t.lang, factor * 100, 0);
    let say: string;
    if (source === "user") {
      say = learned.buffer != null ? t("learn.buffer.user_learned", { value: percent(learned.buffer) }) : t("learn.buffer.user");
    } else if (source === "learned") {
      say = t("learn.buffer.learned");
    } else {
      say = t("learn.buffer.default", { need: data.needs.buffer, have: learned.buffer_days });
    }
    const recent = data.accuracy.slice(-RECENT);
    const series: ChartSeries[] = [
      {
        label: t("learn.buffer.chart.planned"),
        kind: "bar",
        values: recent.map((a) => a.bridge.planned),
        color: "var(--joe-c-ist)",
        digits: 1,
      },
      {
        label: t("learn.buffer.chart.actual"),
        kind: "bar",
        values: recent.map((a) => a.bridge.actual),
        color: "var(--joe-c-soc)",
        digits: 1,
      },
    ];
    return html`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:shield-half-full"></ha-icon>${t("learn.buffer")}</div>
        ${tip(t, "learn_buffer")}
      </div>
      <div class="figure">
        <div class="big">${percent(value)}<small> %</small></div>
        ${sourceChip(t, { source })}
        ${source === "learned" ? html`<span class="chip">${t("learn.mornings", { count: learned.buffer_days })}</span>` : nothing}
      </div>
      <p class="say">${say}</p>
      ${source === "user"
        ? html`<div class="own">
            <button
              type="button"
              class="mini-btn"
              @click=${() => saveConfig(this, { rules: { buffer_factor: data.buffer.default } }, "default")}
            >
              <ha-icon icon="mdi:auto-fix"></ha-icon>${t("learn.buffer.own")}
            </button>
            ${tip(t, "learn_buffer_own")}
          </div>`
        : nothing}
      ${recent.length > 1 ? this.chartWithLegend(t, recent.map((a) => a.date), series, "kWh", t("learn.buffer.chart")) : nothing}
    </section>`;
  }

  private renderHome(t: Translate, data: Learning): TemplateResult {
    const consumption = data.consumption;
    const total = (values: number[]) => fixed(t.lang, values.reduce((sum, v) => sum + v, 0), 1);
    const series: ChartSeries[] = [
      { label: t("learn.home.chart.workday"), kind: "line", values: consumption.workday, color: "var(--joe-c-load)" },
      { label: t("learn.home.chart.day_off"), kind: "line", values: consumption.day_off, color: "var(--joe-c-soc-2)", dashed: true },
    ];
    return html`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:home-lightning-bolt-outline"></ha-icon>${t("learn.home")}</div>
        ${tip(t, "learn_home")}
      </div>
      <p class="say">
        ${consumption.source === "history" ? t("learn.home.history", { days: consumption.days }) : t("learn.home.default")}
      </p>
      <p class="split">${t("learn.home.totals", { workday: total(consumption.workday), day_off: total(consumption.day_off) })}</p>
      ${this.hourChart(t, series, t("learn.home.chart"))}
    </section>`;
  }

  private chartWithLegend(t: Translate, dates: string[], series: ChartSeries[], unit: string, label: string): TemplateResult {
    return html`<joe-chart
        .labels=${dates.map((date) => dayText(t.lang, date, "weekday"))}
        .ticks=${dayTicks(t.lang, dates)}
        .series=${series}
        centerTicks
        unit=${unit}
        height="150"
        lang=${t.lang}
        label=${label}
      ></joe-chart>
      <div class="legend">
        ${series.map(
          (s) =>
            html`<span
              ><i class=${s.dashed ? "dash" : ""} style="background:${s.color};color:${s.color};height:${s.kind === "bar" ? "10px" : "4px"}"></i
              >${s.label}</span
            >`,
        )}
      </div>`;
  }

  private renderAccuracy(t: Translate, data: Learning): TemplateResult {
    const rows = data.accuracy.slice(-RECENT).reverse();
    const kwh = (value: number | null | undefined) => (value == null ? "–" : fixed(t.lang, value, 1));
    return html`<section class="card wide" data-tipped>
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
            ${rows.map(
              (row) => html`<span role="cell">${dayText(t.lang, row.date, "weekday")}</span>
                <span role="cell">${t("learn.accuracy.value", { expected: kwh(row.solar.forecast), actual: kwh(row.solar.actual) })}</span>
                <span role="cell">${t("learn.accuracy.value", { expected: kwh(row.bridge.planned), actual: kwh(row.bridge.actual) })}</span>
                <span role="cell" class=${row.saving > 0.005 ? "good" : row.saving < -0.005 ? "bad" : ""}
                  >${money(t, row.saving, this.currency, true)}</span
                >`,
            )}
          </div>`
        : html`<p class="say">${t("learn.accuracy.none")}</p>`}
    </section>`;
  }

  private renderLater(t: Translate): TemplateResult {
    return html`<section class="card">
      <div class="eyebrow"><ha-icon icon="mdi:book-open-page-variant-outline"></ha-icon>${t("learn.later")}</div>
      <ul class="later">
        ${LATER.map((item) => html`<li><ha-icon icon="mdi:circle-outline"></ha-icon>${t(`learn.later.${item}`)}</li>`)}
      </ul>
      <span class="chip soon">${t("soon")}</span>
    </section>`;
  }

  private renderReset(t: Translate): TemplateResult {
    const active = Boolean(this.state?.observe?.active);
    return html`<section class="card danger" data-tipped>
      <div class="eyebrow"><ha-icon icon="mdi:restore"></ha-icon>${t("learn.reset")}</div>
      <p>${t("learn.reset.text")}</p>
      <div class="actions">
        <button type="button" class="btn btn-danger" ?disabled=${!active} @click=${() => (this.confirming = true)}>
          ${t("learn.reset.button")}
        </button>
        ${tip(t, "learn_reset")}
      </div>
      ${active ? nothing : html`<p>${t("learn.reset.off")}</p>`}
      ${this.notice
        ? html`<div class="note ${this.notice.ok ? "" : "warn"}" role="status">
            <ha-icon icon=${this.notice.ok ? "mdi:check" : "mdi:alert-outline"}></ha-icon>${this.notice.text}
          </div>`
        : nothing}
    </section>`;
  }

  private renderConfirm(t: Translate): TemplateResult {
    const close = () => {
      this.confirming = false;
    };
    return html`<joe-sheet label=${t("learn.reset.label")} closeLabel=${t("common.close")} @joe-close=${close}>
      <div data-tipped>
        <div class="sheet-title">${displayTitle(t("learn.reset.confirm.title"), "h2", tip(t, "learn_reset"))}</div>
        <dl class="forget">
          <dt>${t("learn.reset.confirm.forget")}</dt>
          <dd>${t("learn.reset.confirm.forget.text")}</dd>
          <dt>${t("learn.reset.confirm.keep")}</dt>
          <dd>${t("learn.reset.confirm.keep.text")}</dd>
        </dl>
        <div class="actions">
          <button type="button" class="btn btn-secondary" data-notip @click=${close}>${t("common.cancel")}</button>
          <button type="button" class="btn btn-danger" ?disabled=${this.resetting} @click=${this.reset}>
            ${t("learn.reset.confirm.go")}
          </button>
        </div>
      </div>
    </joe-sheet>`;
  }

  private async reset(): Promise<void> {
    const t = this.t!;
    this.resetting = true;
    try {
      await this.hass?.callWS({ type: "energy_joe/learning/reset" });
      this.confirming = false;
      this.notice = { text: t("learn.reset.done"), ok: true };
      await this.load();
    } catch {
      this.confirming = false;
      this.notice = { text: t("error.action"), ok: false };
    } finally {
      this.resetting = false;
    }
  }
}

define("joe-learn-page", JoeLearnPage);
