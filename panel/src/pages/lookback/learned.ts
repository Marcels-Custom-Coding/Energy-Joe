import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { displayTitle, sourceChip, swoosh } from "../../components/bits";
import "../../components/chart";
import type { ChartSeries } from "../../components/chart";
import { dayText, fixed } from "../../components/look-back";
import { mirrorRow } from "../../components/mirror";
import "../../components/pose";
import "../../components/sheet";
import { tip } from "../../components/tip";
import { saveConfig } from "../../config";
import { define } from "../../define";
import { entityName, formatNumber } from "../../entities";
import type { Translate } from "../../i18n";
import {
  batteryLearned,
  carLearned,
  dayTicks,
  groupLearned,
  hotWaterLearned,
  learnedRows,
  learnedStyles,
  learningMarker,
  presenceLearned,
  type LearnedRow,
} from "../../learned-view";
import { PANEL, href, onLink, revealAnchor, type Route } from "../../router";
import { shared } from "../../styles/shared";
import {
  LEARN_SCOPES,
  type ClimateFound,
  type ConsumptionModel,
  type HomeAssistant,
  type JoeState,
  type LearnScope,
  type Learning,
  type WeatherClass,
} from "../../types";

// Nights shown in the buffer chart.
const RECENT = 14;
const WEATHER: WeatherClass[] = ["clear", "mixed", "overcast"];
const FORECAST_NAMES: Record<string, string> = {
  forecast_solar: "Forecast.Solar",
  open_meteo_solar_forecast: "Open-Meteo Solar Forecast",
  solcast_solar: "Solcast",
};

/** What "Neu anfangen" can forget: the learner's areas and the climate warm-up rates. */
type ResetScope = "all" | LearnScope | "climate";
const RESET_SCOPES: ResetScope[] = ["all", ...LEARN_SCOPES, "climate"];

/** What a consumption model expects for a day (see learn/models.py). */
function expectedKwh(model: ConsumptionModel, workday: boolean, temp: number): number {
  let value =
    model.base + (workday ? model.workday : 0) + model.heat * Math.max(0, 15 - temp) + model.cool * Math.max(0, temp - 22);
  if (model.presence != null) {
    value += model.presence * (model.presence_mean ?? 0);
  }
  return Math.max(0, value);
}

/** Rückblick › Gelernt: the sun, consumption, buffer, devices, presence, climate – and starting over. */
export class JoeLookbackLearned extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;
  @property({ attribute: false }) prefix = PANEL;
  @property({ attribute: false }) route?: Route;
  @property({ attribute: false }) climateFound?: ClimateFound;
  /** sun|consumption|buffer|battery|devices|hot_water|car|presence|climate|reset */
  @property({ attribute: false }) anchor?: string;

  @state() private data?: Learning;
  @state() private failed = false;
  @state() private confirming = false;
  @state() private resetting = false;
  @state() private scope: ResetScope = "all";
  @state() private notice?: { text: string; ok: boolean };

  private marker?: string;
  /** The anchor still to scroll to once the cards are there. */
  private pending?: string;

  static styles = [
    shared,
    learnedStyles,
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
      .group {
        border-radius: 16px;
      }
      .eyebrow.section {
        margin: 28px 0 0;
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
      .big small {
        font-size: 0.5em;
        margin-left: 2px;
      }
      .big.small {
        font-size: clamp(30px, 3.6vw, 38px);
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
      .mirror {
        margin-top: 8px;
        border-top: 1px solid var(--joe-line);
      }
      a.go-link {
        display: inline-flex;
        align-items: center;
        min-height: 44px;
        font-weight: 600;
        font-size: 14px;
        color: var(--joe-ink);
        text-decoration: underline;
        text-decoration-color: var(--joe-line-2);
        text-underline-offset: 3px;
      }
      a.go-link:hover {
        text-decoration-color: var(--joe-amber);
      }
      .sub-head {
        margin-top: 16px;
        font-size: 14px;
      }
      .sub-head.with-tip {
        display: flex;
        align-items: center;
        gap: 6px;
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
      .danger p {
        margin: 10px 0 0;
        color: var(--joe-ink-2);
        max-width: 56ch;
      }
      .scopes {
        margin-top: 12px;
        flex-wrap: wrap;
        border-radius: 22px;
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
        .grid {
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
      }
    `,
  ];

  connectedCallback(): void {
    super.connectedCallback();
    this.pending = this.anchor;
    this.load();
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    // A new evaluation, something learned or a changed buffer: fetch again.
    const marker = learningMarker(this.state);
    if (changed.has("state") && this.marker !== undefined && marker !== this.marker) {
      this.load();
    }
    this.marker = marker;
    if (changed.has("anchor") && this.anchor) {
      this.pending = this.anchor;
    }
  }

  protected updated(): void {
    const anchor = this.pending;
    if (anchor && this.data && revealAnchor(this.renderRoot, anchor)) {
      this.pending = undefined;
    }
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
          ? html`<div class="group" data-anchor="sun">
                <div class="eyebrow section"><ha-icon icon="mdi:weather-sunny"></ha-icon>${t("past.learned.group.sun")}</div>
                <div class="grid">${this.renderSolar(t, data)} ${this.renderShift(t, data)} ${this.renderSources(t, data)}</div>
              </div>
              <div class="group" data-anchor="consumption">
                <div class="eyebrow section"><ha-icon icon="mdi:home-lightning-bolt-outline"></ha-icon>${t("past.learned.group.consumption")}</div>
                <div class="grid">${this.renderHome(t, data)} ${this.renderWeather(t, data)} ${this.renderBuffer(t, data)}</div>
              </div>
              <div class="group">
                <div class="eyebrow section"><ha-icon icon="mdi:devices"></ha-icon>${t("past.learned.group.devices")}</div>
                <div class="grid">
                  ${this.renderBatteries(t, data)} ${this.renderGroups(t, data)} ${this.renderHotWater(t, data)}
                  ${this.renderCars(t, data)} ${this.renderClimate(t)}
                </div>
              </div>
              <div class="group">
                <div class="eyebrow section"><ha-icon icon="mdi:account-group-outline"></ha-icon>${t("past.learned.group.household")}</div>
                <div class="grid">${this.renderPresence(t, data)}</div>
              </div>
              ${this.renderReset(t)}`
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

  /** A link inside the panel, 44 px high. */
  private goLink(to: Route | string, label: string): TemplateResult {
    return html`<a class="go-link" href=${href(this.prefix, to)} @click=${onLink(to)}>${label}</a>`;
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
    return html`<section class="card" data-tipped data-anchor="buffer">
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
      ${recent.length > 1 ? this.chartWithLegend(t, recent.map((a) => a.date), series, "kWh", t("learn.buffer.chart")) : nothing}
      ${mirrorRow(t, this.prefix, {
        label: t("rule.buffer_factor"),
        value: `${percent(value)} %`,
        to: { tab: "settings", section: "rules", id: "buffer_factor" },
      })}
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
      ${weather
        ? nothing
        : mirrorRow(t, this.prefix, {
            label: t("past.learned.weather"),
            value: t("past.learned.weather.missing"),
            to: { tab: "household", section: "travel" },
            action: "set",
          })}
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
        ? learnedRows(
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
        ? html`${learnedRows(
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

  /** A card of learned rows, or a sentence when there is nothing of the kind. */
  private rowsCard(
    t: Translate,
    anchor: string,
    icon: string,
    title: string,
    tipped: TemplateResult,
    rows: LearnedRow[],
    none: string,
    after: TemplateResult | typeof nothing = nothing,
  ): TemplateResult {
    return html`<section class="card" data-tipped data-anchor=${anchor}>
      <div class="head">
        <div class="eyebrow"><ha-icon icon=${icon}></ha-icon>${title}</div>
        ${tipped}
      </div>
      ${rows.length ? learnedRows(rows) : html`<p class="say">${none}</p>`} ${after}
    </section>`;
  }

  private renderBatteries(t: Translate, data: Learning): TemplateResult {
    const config = this.state!.config;
    return this.rowsCard(
      t,
      "battery",
      "mdi:battery-heart-variant",
      t("learn.battery"),
      tip(t, "learn_battery"),
      config.batteries.map((battery) => batteryLearned(t, config, data.learned, battery, data.needs.models)),
      t("learn.battery.none"),
    );
  }

  private renderGroups(t: Translate, data: Learning): TemplateResult {
    const consumers = this.state!.config.consumers.filter((c) => c.energy_entity && c.kind !== "submeter");
    return this.rowsCard(
      t,
      "devices",
      "mdi:chart-donut",
      t("learn.groups"),
      tip(t, "learn_groups"),
      consumers.map((consumer) => groupLearned(t, data.learned, consumer)),
      t("learn.groups.none"),
    );
  }

  private renderHotWater(t: Translate, data: Learning): TemplateResult {
    const actions = this.state!.config.actions.filter((a) => a.kind === "target");
    return this.rowsCard(
      t,
      "hot_water",
      "mdi:water-boiler",
      t("learn.hot_water"),
      tip(t, "learn_hot_water"),
      actions.map((action) => hotWaterLearned(t, data.learned, action)),
      t("learn.hot_water.none"),
    );
  }

  private renderCars(t: Translate, data: Learning): TemplateResult {
    const cars = this.state!.config.actions.filter((a) => a.kind === "switch" && a.need?.enabled);
    return this.rowsCard(
      t,
      "car",
      "mdi:car-electric",
      t("learn.car"),
      tip(t, "learn_car"),
      cars.map((action) => carLearned(t, data.learned, action)),
      t("learn.car.none"),
    );
  }

  /** How fast each room gets warm (or cool) again: learned by the climate control, not the learner. */
  private renderClimate(t: Translate): TemplateResult {
    const config = this.state!.config;
    const rates = this.state?.climate?.rates ?? {};
    const devices = this.climateFound?.devices ?? [];
    const names = Object.fromEntries(devices.map((d) => [d.entity_id, d.name]));
    const steered = Object.entries(config.climate?.rooms ?? {})
      .filter(([, room]) => room.enabled)
      .map(([id]) => id);
    const ids = [...new Set([...steered, ...Object.keys(rates)])];
    const rows: LearnedRow[] = ids.map((id) => {
      const rate = rates[id];
      return {
        name: names[id] ?? (this.hass ? entityName(this.hass, id) : id),
        values: rate ? [t("past.learned.climate.rate", { rate: formatNumber(t.lang, rate, 1) })] : [t("learn.still")],
        note: rate ? undefined : t("climate.rate_default"),
      };
    });
    return html`<section class="card" data-tipped data-anchor="climate">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:thermostat-auto"></ha-icon>${t("past.learned.climate")}</div>
        ${tip(t, "learn_climate")}
      </div>
      ${rows.length
        ? html`<p class="say">${t("past.learned.climate.say")}</p>
            ${Object.keys(rates).length ? html`<div class="figure">${sourceChip(t, { source: "learned" })}</div>` : nothing}
            ${learnedRows(rows)}`
        : html`<p class="say">${t("past.learned.climate.none")}</p>
            ${this.goLink({ tab: "devices", section: "climate" }, t("past.learned.climate.open"))}`}
    </section>`;
  }

  private renderPresence(t: Translate, data: Learning): TemplateResult {
    const config = this.state!.config;
    const usual = this.state?.climate?.usual ?? {};
    // Everyone who lives here; without calendars a link leads to where they are assigned.
    const persons = config.persons;
    const rows = persons.map((person) => {
      const row = presenceLearned(t, data.learned, person, person.person_entity ? usual[person.person_entity] : undefined);
      return person.calendars.length
        ? row
        : { ...row, extra: this.goLink({ tab: "household", section: "people", id: person.id }, t("learn.presence.calendars")) };
    });
    return this.rowsCard(
      t,
      "presence",
      "mdi:account-clock-outline",
      t("learn.presence"),
      tip(t, "learn_presence"),
      rows,
      t("learn.presence.none"),
      persons.length ? nothing : this.goLink({ tab: "household", section: "people" }, t("learn.presence.calendars")),
    );
  }

  private renderReset(t: Translate): TemplateResult {
    // The warm-up rates belong to the heating, so they can be reset while learning is off.
    const blocked = !this.state?.observe?.active && this.scope !== "climate";
    return html`<section class="card danger wide" data-tipped data-anchor="reset">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:restore"></ha-icon>${t("learn.reset")}</div>
        ${tip(t, "learn_reset")}
      </div>
      <p>${t("learn.reset.text")}</p>
      <div class="sub-head with-tip"><b>${t("learn.reset.scope")}</b>${tip(t, "learn_reset_scope")}</div>
      <div class="seg scopes" role="group" aria-label=${t("learn.reset.scope")}>
        ${RESET_SCOPES.map(
          (scope) =>
            html`<button type="button" aria-pressed=${String(this.scope === scope)} @click=${() => (this.scope = scope)}>
              ${t(`learn.reset.scope.${scope}`)}
            </button>`,
        )}
      </div>
      <div class="actions">
        <button type="button" class="btn btn-danger" ?disabled=${blocked} @click=${() => (this.confirming = true)}>
          ${t(this.scope === "all" ? "learn.reset.button" : "learn.reset.button.scope")}
        </button>
      </div>
      ${blocked ? html`<p>${t("learn.reset.off")}</p>` : nothing}
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

define("joe-lookback-learned", JoeLookbackLearned);
