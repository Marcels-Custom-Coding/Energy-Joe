import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { displayTitle, sourceChip, swoosh } from "../components/bits";
import "../components/chart";
import type { ChartSeries } from "../components/chart";
import "../components/day-questions";
import { currencySymbol, dayText, fixed, money, nights } from "../components/look-back";
import "../components/pose";
import "../components/sheet";
import { tip } from "../components/tip";
import { saveConfig } from "../config";
import { define } from "../define";
import { formatNumber } from "../entities";
import type { Translate } from "../i18n";
import { shared } from "../styles/shared";
import {
  DAY_LABELS,
  LEARN_SCOPES,
  type CalendarConfig,
  type ConsumptionModel,
  type DayLabel,
  type HomeAssistant,
  type JoeState,
  type LearnScope,
  type Learning,
  type WeatherClass,
} from "../types";

// Nights shown in the table and the buffer chart.
const RECENT = 14;
const WEATHER: WeatherClass[] = ["clear", "mixed", "overcast"];
// Calendar labels in the order their rules are checked (the first match wins).
const RULE_ORDER: DayLabel[] = ["vacation", "travel", "home_office", "office", "guests", "home"];
const FORECAST_NAMES: Record<string, string> = {
  forecast_solar: "Forecast.Solar",
  open_meteo_solar_forecast: "Open-Meteo Solar Forecast",
  solcast_solar: "Solcast",
};

/** What a consumption model expects for a day (see learn/models.py). */
function expectedKwh(model: ConsumptionModel, workday: boolean, temp: number): number {
  let value =
    model.base + (workday ? model.workday : 0) + model.heat * Math.max(0, 15 - temp) + model.cool * Math.max(0, temp - 22);
  if (model.presence != null) {
    value += model.presence * (model.presence_mean ?? 0);
  }
  return Math.max(0, value);
}

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
  @state() private scope: LearnScope | "all" = "all";
  @state() private keyword: Partial<Record<DayLabel, string>> = {};
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
      .danger p {
        margin: 10px 0 0;
        color: var(--joe-ink-2);
        max-width: 56ch;
      }
      .scopes {
        margin-top: 12px;
        flex-wrap: wrap;
      }
      .eyebrow.section {
        margin: 28px 0 0;
      }
      joe-day-questions.wide {
        margin-top: 12px;
      }
      .rows {
        display: grid;
        margin-top: 10px;
      }
      .row-item {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 2px 12px;
        padding: 9px 0;
        border-top: 1px solid var(--joe-line);
      }
      .row-item:first-child {
        border-top: 0;
      }
      .row-item b {
        overflow-wrap: anywhere;
      }
      .row-item .values {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 4px 12px;
        margin-left: auto;
        font-variant-numeric: tabular-nums;
        color: var(--joe-ink-2);
      }
      .row-item small {
        flex-basis: 100%;
        color: var(--joe-muted);
        font-size: 12.5px;
        line-height: 1.4;
      }
      .sub-head {
        margin-top: 16px;
        font-size: 14px;
      }
      .toggle-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid var(--joe-line);
      }
      .rules {
        display: grid;
        gap: 2px;
        margin-top: 12px;
      }
      .rule {
        display: grid;
        grid-template-columns: 150px minmax(0, 1fr);
        gap: 6px 12px;
        align-items: center;
        padding: 8px 0;
        border-top: 1px solid var(--joe-line);
      }
      .rule:first-child {
        border-top: 0;
      }
      .keywords {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;
      }
      .keyword {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        padding: 2px 4px 2px 10px;
        border-radius: 999px;
        background: var(--joe-surface-2);
        font-size: 13.5px;
      }
      .keyword button {
        display: grid;
        place-items: center;
        width: 26px;
        height: 26px;
        padding: 0;
        border: 0;
        border-radius: 50%;
        background: transparent;
        color: var(--joe-muted);
        cursor: pointer;
        transition: background 0.12s, color 0.12s;
      }
      .keyword button:hover {
        background: var(--joe-line);
        color: var(--joe-ink);
      }
      .keyword button:active {
        transform: scale(0.94);
      }
      .keyword ha-icon {
        --mdc-icon-size: 15px;
      }
      .add {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .add .input {
        width: 150px;
        min-height: 34px;
        padding: 6px 10px;
      }
      .defaults {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
        margin-top: 8px;
      }
      .sub-head.with-tip {
        display: flex;
        align-items: center;
        gap: 6px;
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
        .defaults {
          grid-template-columns: 1fr;
        }
        .rule {
          grid-template-columns: 1fr;
        }
      }
      @media (pointer: coarse) {
        .keyword button {
          width: 36px;
          height: 36px;
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
              <joe-day-questions
                class="wide"
                .hass=${this.hass}
                .t=${t}
                .questions=${data.questions}
                @joe-answered=${() => this.load()}
              ></joe-day-questions>
              <div class="grid">
                ${this.renderSolar(t, data)} ${this.renderShift(t, data)} ${this.renderBuffer(t, data)} ${this.renderHome(t, data)}
              </div>
              <div class="eyebrow section"><ha-icon icon="mdi:brain"></ha-icon>${t("learn.models")}</div>
              <div class="grid">
                ${this.renderWeather(t, data)} ${this.renderSources(t, data)} ${this.renderBatteries(t, data)}
                ${this.renderGroups(t, data)} ${this.renderHotWater(t, data)} ${this.renderCars(t, data)}
                ${this.renderPresence(t, data)}
              </div>
              ${this.renderCalendar(t)} ${this.renderAccuracy(t, data)} ${this.renderReset(t)}`
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

  /** A small table: one row per item, a label and a few values. */
  private rows(rows: { name: string; values: (string | TemplateResult)[]; note?: string }[]): TemplateResult {
    return html`<div class="rows">
      ${rows.map(
        (row) => html`<div class="row-item">
          <b>${row.name}</b>
          <span class="values">${row.values.map((value) => html`<span>${value}</span>`)}</span>
          ${row.note ? html`<small>${row.note}</small>` : nothing}
        </div>`,
      )}
    </div>`;
  }

  private renderWeather(t: Translate, data: Learning): TemplateResult {
    const lang = t.lang;
    const model = data.learned.consumption_model;
    const days = data.days.filter((d) => d.temp != null);
    const usable = days.filter((d) => !d.excluded).length;
    const weather = this.state?.config.context.weather_entity;
    let say: string;
    if (!weather) {
      say = t("learn.model.no_weather");
    } else if (!model) {
      say = t("learn.model.learning", { need: data.needs.models, have: usable });
    } else {
      // The base includes the hours someone is usually at home.
      const base = model.base + (model.presence ?? 0) * (model.presence_mean ?? 0);
      const parts = [t("learn.model.base", { value: fixed(lang, base, 1) })];
      if (Math.abs(model.workday) >= 0.3) {
        parts.push(t(model.workday > 0 ? "learn.model.workday_more" : "learn.model.workday_less", { value: fixed(lang, Math.abs(model.workday), 1) }));
      }
      if (model.heat >= 0.05) {
        parts.push(t("learn.model.heat", { value: fixed(lang, model.heat, 2) }));
      }
      if (model.cool >= 0.05) {
        parts.push(t("learn.model.cool", { value: fixed(lang, model.cool, 2) }));
      }
      if (model.presence != null && Math.abs(model.presence) >= 0.05) {
        parts.push(t("learn.model.presence", { value: fixed(lang, model.presence, 2) }));
      }
      parts.push(t("learn.model.fit", { share: formatNumber(lang, model.r2 * 100, 0) }));
      say = parts.join(" ");
    }
    const heating = model != null && model.heat >= 0.05;
    return html`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:thermometer"></ha-icon>${t("learn.model")}</div>
        ${tip(t, "learn_model")}
      </div>
      <div class="figure">
        <div class="big ${model ? "" : "small"}">
          ${model
            ? heating
              ? html`+${fixed(lang, model.heat, 2)}<small> kWh/°C</small>`
              : html`${fixed(lang, model.base + (model.presence ?? 0) * (model.presence_mean ?? 0), 1)}<small> kWh</small>`
            : t("learn.still")}
        </div>
        ${model ? html`${sourceChip(t, { source: "learned" })}<span class="chip">${t("learn.days", { days: model.days })}</span>` : nothing}
      </div>
      <p class="say">${say}</p>
      ${days.length > 2 ? this.temperatureChart(t, data, model) : nothing}
    </section>`;
  }

  /** Consumption per 2 °C of outdoor temperature, with what the model expects. */
  private temperatureChart(t: Translate, data: Learning, model: ConsumptionModel | null): TemplateResult {
    const days = data.days.filter((d) => d.temp != null && !d.excluded);
    const temps = days.map((d) => d.temp as number);
    const low = Math.floor(Math.min(...temps) / 2) * 2;
    const high = Math.floor(Math.max(...temps) / 2) * 2 + 2;
    const bins: number[] = [];
    for (let from = low; from < high; from += 2) {
      bins.push(from);
    }
    const degrees = (value: number) => formatNumber(t.lang, value, 0);
    const average = (from: number) => {
      const found = days.filter((d) => (d.temp as number) >= from && (d.temp as number) < from + 2);
      return found.length ? found.reduce((sum, d) => sum + d.home, 0) / found.length : null;
    };
    const series: ChartSeries[] = [
      { label: t("learn.model.chart.actual"), kind: "bar", values: bins.map(average), color: "var(--joe-c-ist)", digits: 1 },
    ];
    if (model) {
      series.push(
        {
          label: t("learn.model.chart.workday"),
          kind: "line",
          values: bins.map((from) => expectedKwh(model, true, from + 1)),
          color: "var(--joe-c-soc)",
          digits: 1,
        },
        {
          label: t("learn.model.chart.day_off"),
          kind: "line",
          values: bins.map((from) => expectedKwh(model, false, from + 1)),
          color: "var(--joe-c-soc-2)",
          dashed: true,
          digits: 1,
        },
      );
    }
    const every = Math.max(1, Math.ceil(bins.length / 8));
    const ticks = new Map<number, string>();
    bins.forEach((from, i) => {
      if (i % every === 0) {
        ticks.set(i, `${degrees(from)}°`);
      }
    });
    return html`<joe-chart
        .labels=${bins.map((from) => `${degrees(from)} … ${degrees(from + 2)} °C`)}
        .ticks=${ticks}
        .series=${series}
        unit="kWh"
        height="150"
        lang=${t.lang}
        label=${t("learn.model.chart")}
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

  private renderSources(t: Translate, data: Learning): TemplateResult {
    const lang = t.lang;
    const config = this.state!.config;
    const solar = data.learned.solar_classes ?? {};
    const classes = solar.classes ?? {};
    const forecast = config.forecast;
    const sources = data.learned.sources ?? {};
    const known = WEATHER.filter((name) => classes[name]);
    const percent = (value: number) => formatNumber(lang, value * 100, 0);
    const names: [string, string][] = [
      ["main", forecast.provider ? (FORECAST_NAMES[forecast.provider] ?? forecast.provider) : t("learn.sources.main")],
      ...forecast.alternatives.map((a): [string, string] => [a.id, a.name]),
    ];
    const weights = Object.fromEntries(
      names.map(([id]) => [id, sources[id] ? 1 / Math.max(sources[id].error, 0.05) ** 2 : 0]),
    );
    const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
    return html`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:weather-partly-cloudy"></ha-icon>${t("learn.weather")}</div>
        ${tip(t, "learn_weather")}
      </div>
      <p class="say">
        ${known.length
          ? t("learn.weather.say", { top: fixed(lang, solar.top ?? 0, 1) })
          : t("learn.weather.learning", { have: solar.days ?? 0 })}
      </p>
      ${known.length
        ? this.rows(
            WEATHER.map((name) => {
              const found = classes[name];
              return {
                name: t(`learn.weather.${name}`),
                values: found
                  ? [`× ${formatNumber(lang, found.factor, 2)}`, t("learn.days", { days: found.days })]
                  : [t("learn.still")],
              };
            }),
          )
        : nothing}
      <div class="sub-head">
        <b>${t("learn.sources")}</b>
      </div>
      ${forecast.alternatives.length
        ? html`${this.rows(
              names.map(([id, name]) => {
                const found = sources[id];
                return {
                  name,
                  values: found
                    ? [
                        `× ${formatNumber(lang, found.factor, 2)}`,
                        t("learn.sources.error", { value: percent(found.error) }),
                        forecast.combine && total ? t("learn.sources.weight", { value: percent(weights[id] / total) }) : "",
                      ]
                    : [t("learn.sources.learning", { need: data.needs.sources })],
                };
              }),
            )}
            <div class="toggle-row">
              <span class="with-tip"><span id="combine-label">${t("learn.sources.combine")}</span>${tip(t, "learn_combine")}</span>
              <button
                type="button"
                class="switch"
                role="switch"
                aria-checked=${String(forecast.combine)}
                aria-labelledby="combine-label"
                @click=${() => saveConfig(this, { forecast: { combine: !forecast.combine } })}
              ></button>
            </div>`
        : html`<p class="say">${t("learn.sources.single")}</p>`}
    </section>`;
  }

  private renderBatteries(t: Translate, data: Learning): TemplateResult {
    const lang = t.lang;
    const config = this.state!.config;
    const models = data.learned.battery_models ?? {};
    return html`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:battery-heart-variant"></ha-icon>${t("learn.battery")}</div>
        ${tip(t, "learn_battery")}
      </div>
      ${config.batteries.length
        ? this.rows(
            config.batteries.map((battery) => {
              const found = models[battery.id];
              const nominal = battery.capacity_kwh;
              const own = config.provenance[`batteries[${battery.id}].capacity_kwh`]?.source === "user";
              let note: string;
              if (!found) {
                note = battery.power ? t("learn.battery.learning", { need: data.needs.models }) : t("learn.battery.no_power");
              } else if (own && nominal) {
                note = t("learn.battery.user", { value: fixed(lang, nominal, 1) });
              } else if (nominal && (found.capacity_kwh / nominal < 0.5 || found.capacity_kwh / nominal > 1.15)) {
                note = t("learn.battery.odd", { value: fixed(lang, nominal, 1) });
              } else {
                note = nominal
                  ? t("learn.battery.uses_nominal", { value: fixed(lang, nominal, 1) })
                  : t("learn.battery.uses");
              }
              return {
                name: battery.name,
                values: found
                  ? [
                      t("learn.battery.capacity", { value: fixed(lang, found.capacity_kwh, 1) }),
                      t("learn.battery.efficiency", { value: formatNumber(lang, found.efficiency * 100, 0) }),
                    ]
                  : [t("learn.still")],
                note,
              };
            }),
          )
        : html`<p class="say">${t("learn.battery.none")}</p>`}
    </section>`;
  }

  private renderGroups(t: Translate, data: Learning): TemplateResult {
    const lang = t.lang;
    const config = this.state!.config;
    const models = data.learned.group_models ?? {};
    const consumers = config.consumers.filter((c) => c.energy_entity && c.kind !== "submeter");
    return html`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:chart-donut"></ha-icon>${t("learn.groups")}</div>
        ${tip(t, "learn_groups")}
      </div>
      ${consumers.length
        ? this.rows(
            consumers.map((consumer) => {
              const found = models[consumer.id];
              return {
                name: consumer.name,
                values: found
                  ? [
                      t("learn.groups.average", { value: fixed(lang, found.average, 1) }),
                      found.heat >= 0.05 ? t("learn.groups.heat", { value: fixed(lang, found.heat, 2) }) : t("learn.groups.steady"),
                    ]
                  : [t("learn.still")],
              };
            }),
          )
        : html`<p class="say">${t("learn.groups.none")}</p>`}
    </section>`;
  }

  private renderHotWater(t: Translate, data: Learning): TemplateResult {
    const lang = t.lang;
    const config = this.state!.config;
    const models = data.learned.action_models ?? {};
    const actions = config.actions.filter((a) => a.kind === "target");
    return html`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:water-boiler"></ha-icon>${t("learn.hot_water")}</div>
        ${tip(t, "learn_hot_water")}
      </div>
      ${actions.length
        ? this.rows(
            actions.map((action) => {
              const found = models[action.id];
              return {
                name: action.name,
                values: found
                  ? [
                      t("learn.hot_water.rate", { value: fixed(lang, found.rate_k_per_h, 1) }),
                      t("learn.hot_water.loss", { value: fixed(lang, found.loss_k_per_h, 1) }),
                      t("learn.hot_water.demand", { value: fixed(lang, found.demand_k, 0) }),
                    ]
                  : [t("learn.still")],
                note: found ? undefined : t("learn.hot_water.learning"),
              };
            }),
          )
        : html`<p class="say">${t("learn.hot_water.none")}</p>`}
    </section>`;
  }

  private renderCars(t: Translate, data: Learning): TemplateResult {
    const lang = t.lang;
    const config = this.state!.config;
    const models = data.learned.car_models ?? {};
    const cars = config.actions.filter((a) => a.kind === "switch" && a.need?.enabled);
    return html`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:car-electric"></ha-icon>${t("learn.car")}</div>
        ${tip(t, "learn_car")}
      </div>
      ${cars.length
        ? this.rows(
            cars.map((action) => {
              const found = models[action.id];
              const values: string[] = [];
              if (found?.consumption != null) {
                values.push(t("learn.car.consumption", { value: fixed(lang, found.consumption, 1) }));
                if (found.cold) {
                  values.push(t("learn.car.cold", { value: fixed(lang, found.cold, 2) }));
                }
              }
              if (found?.workday_km != null || found?.day_off_km != null) {
                values.push(
                  t("learn.car.km", {
                    workday: found.workday_km == null ? "–" : fixed(lang, found.workday_km, 0),
                    day_off: found.day_off_km == null ? "–" : fixed(lang, found.day_off_km, 0),
                  }),
                );
              }
              return {
                name: action.name,
                values: values.length ? values : [t("learn.still")],
                note: values.length ? undefined : t(action.need?.odometer_entity ? "learn.car.learning" : "learn.car.no_odometer"),
              };
            }),
          )
        : html`<p class="say">${t("learn.car.none")}</p>`}
    </section>`;
  }

  private renderPresence(t: Translate, data: Learning): TemplateResult {
    const lang = t.lang;
    const config = this.state!.config;
    const presence = data.learned.presence ?? {};
    const withCalendar = config.persons.filter((p) => p.calendars.length);
    return html`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:account-clock-outline"></ha-icon>${t("learn.presence")}</div>
        ${tip(t, "learn_presence")}
      </div>
      ${withCalendar.length
        ? this.rows(
            withCalendar.map((person) => {
              const labels = DAY_LABELS.filter((label) => presence[person.id]?.[label]);
              return {
                name: person.name,
                values: labels.length
                  ? labels.map((label) =>
                      t("learn.presence.value", {
                        label: t(`label.${label}`),
                        hours: fixed(lang, presence[person.id]![label]!.hours, 0),
                      }),
                    )
                  : [t("learn.still")],
                note: person.person_entity ? undefined : t("learn.presence.no_person"),
              };
            }),
          )
        : html`<p class="say">${t("learn.presence.none")}</p>`}
      <div class="own">
        <button type="button" class="mini-btn" @click=${() => this.edit("household")}>
          <ha-icon icon="mdi:calendar-account-outline"></ha-icon>${t("learn.presence.calendars")}
        </button>
      </div>
    </section>`;
  }

  /** The rules that turn calendar events into day labels, grouped by label. */
  private renderCalendar(t: Translate): TemplateResult {
    const calendar = this.state!.config.calendar;
    const byLabel = (label: DayLabel) => calendar.rules.filter((rule) => rule.label === label);
    return html`<section class="card wide" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:calendar-text-outline"></ha-icon>${t("learn.calendar")}</div>
        ${tip(t, "learn_calendar")}
      </div>
      <p class="say">${t("learn.calendar.say")}</p>
      <div class="rules">
        ${RULE_ORDER.map(
          (label) => html`<div class="rule">
            <b>${t(`label.${label}`)}</b>
            <div class="keywords">
              ${byLabel(label).map(
                (rule) =>
                  html`<span class="keyword"
                    >${rule.keyword}<button
                      type="button"
                      aria-label=${t("learn.calendar.remove", { keyword: rule.keyword })}
                      @click=${() => this.saveRules(calendar.rules.filter((r) => r !== rule))}
                    >
                      <ha-icon icon="mdi:close"></ha-icon></button
                  ></span>`,
              )}
              <form
                class="add"
                @submit=${(ev: Event) => {
                  ev.preventDefault();
                  this.addKeyword(calendar, label);
                }}
              >
                <input
                  class="input"
                  .value=${this.keyword[label] ?? ""}
                  maxlength="40"
                  placeholder=${t("learn.calendar.keyword")}
                  aria-label=${t("learn.calendar.add_to", { label: t(`label.${label}`) })}
                  @input=${(ev: Event) => (this.keyword = { ...this.keyword, [label]: (ev.target as HTMLInputElement).value })}
                />
                <button type="submit" class="mini-btn" ?disabled=${!(this.keyword[label] ?? "").trim()}>
                  <ha-icon icon="mdi:plus"></ha-icon>${t("learn.calendar.add")}
                </button>
              </form>
            </div>
          </div>`,
        )}
      </div>
      <div class="sub-head with-tip"><b>${t("learn.calendar.defaults")}</b>${tip(t, "cal_defaults")}</div>
      <div class="defaults">
        ${(["default_workday", "default_day_off"] as const).map(
          (key) => html`<label class="field">
            <span class="field-label">${t(`learn.calendar.${key}`)}</span>
            <select
              class="input"
              @change=${(ev: Event) =>
                saveConfig(this, { calendar: { [key]: (ev.target as HTMLSelectElement).value as DayLabel } })}
            >
              ${DAY_LABELS.map((label) => html`<option value=${label} ?selected=${calendar[key] === label}>${t(`label.${label}`)}</option>`)}
            </select>
          </label>`,
        )}
      </div>
    </section>`;
  }

  private addKeyword(calendar: CalendarConfig, label: DayLabel): void {
    const keyword = (this.keyword[label] ?? "").trim().toLowerCase();
    if (!keyword || calendar.rules.some((rule) => rule.keyword.toLowerCase() === keyword && rule.label === label)) {
      return;
    }
    this.keyword = { ...this.keyword, [label]: "" };
    this.saveRules([...calendar.rules, { keyword, label }]);
  }

  /** Saves the rules in the order they are checked: by label, as shown. */
  private saveRules(rules: CalendarConfig["rules"]): void {
    const ordered = RULE_ORDER.flatMap((label) => rules.filter((rule) => rule.label === label));
    saveConfig(this, { calendar: { rules: ordered } });
  }

  private edit(editor: "household"): void {
    this.dispatchEvent(new CustomEvent("joe-edit", { detail: { editor }, bubbles: true, composed: true }));
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

  private renderReset(t: Translate): TemplateResult {
    const active = Boolean(this.state?.observe?.active);
    return html`<section class="card danger wide" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:restore"></ha-icon>${t("learn.reset")}</div>
        ${tip(t, "learn_reset")}
      </div>
      <p>${t("learn.reset.text")}</p>
      <div class="sub-head with-tip"><b>${t("learn.reset.scope")}</b>${tip(t, "learn_reset_scope")}</div>
      <div class="seg scopes" role="group" aria-label=${t("learn.reset.scope")}>
        ${(["all", ...LEARN_SCOPES] as const).map(
          (scope) =>
            html`<button type="button" aria-pressed=${String(this.scope === scope)} @click=${() => (this.scope = scope)}>
              ${t(`learn.reset.scope.${scope}`)}
            </button>`,
        )}
      </div>
      <div class="actions">
        <button type="button" class="btn btn-danger" ?disabled=${!active} @click=${() => (this.confirming = true)}>
          ${t(this.scope === "all" ? "learn.reset.button" : "learn.reset.button.scope")}
        </button>
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
    const scope = this.scope;
    return html`<joe-sheet label=${t("learn.reset.label")} closeLabel=${t("common.close")} @joe-close=${close}>
      <div data-tipped>
        <div class="sheet-title">${displayTitle(t("learn.reset.confirm.title"), "h2", tip(t, "learn_reset"))}</div>
        <dl class="forget">
          <dt>${t("learn.reset.confirm.forget")}</dt>
          <dd>${t(`learn.reset.forget.${scope}`)}</dd>
          <dt>${t("learn.reset.confirm.keep")}</dt>
          <dd>${t(scope === "all" ? "learn.reset.confirm.keep.text" : "learn.reset.keep.scope")}</dd>
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
      await this.hass?.callWS({ type: "energy_joe/learning/reset", scope: this.scope });
      this.confirming = false;
      this.notice = { text: t(this.scope === "all" ? "learn.reset.done" : "learn.reset.done.scope"), ok: true };
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
