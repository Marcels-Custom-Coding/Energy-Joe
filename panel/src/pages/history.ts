import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { displayTitle, swoosh } from "../components/bits";
import "../components/chart";
import type { ChartBand, ChartMarker, ChartSeries } from "../components/chart";
import "../components/pose";
import { tip } from "../components/tip";
import { define } from "../define";
import { fixed, money } from "../components/look-back";
import { formatNumber } from "../entities";
import type { Translate } from "../i18n";
import { shared } from "../styles/shared";
import type { DayDetail, DaySummary, HistoryDays, HomeAssistant, JoeState } from "../types";

const DAYS = 14;
const SOC_COLORS = ["var(--joe-c-soc)", "var(--joe-c-soc-2)", "var(--joe-c-grid)", "var(--joe-c-ist)"];

/** Today's date in Home Assistant's time zone is the last day Joe reports. */
function dayLabel(lang: string, day: string, style: "long" | "short"): string {
  const date = new Date(`${day}T12:00:00Z`);
  return style === "long"
    ? new Intl.DateTimeFormat(lang, { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(date)
    : new Intl.DateTimeFormat(lang, { weekday: "short", timeZone: "UTC" }).format(date);
}

/** The history: every day Joe watched or read, with its hours. */
export class JoeHistory extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;

  @state() private days?: HistoryDays;
  @state() private selected?: string;
  @state() private detail?: DayDetail;
  @state() private failed = false;

  private lastHour?: string;

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
      .status {
        margin: 8px 0 0;
        color: var(--joe-ink-2);
        font-size: 14px;
      }
      .strip {
        display: flex;
        gap: 6px;
        overflow-x: auto;
        padding: 18px 2px 6px;
        scrollbar-width: thin;
      }
      .strip button {
        flex: none;
        display: grid;
        justify-items: center;
        gap: 4px;
        width: 62px;
        padding: 8px 4px 6px;
        border: 0;
        border-radius: 12px;
        cursor: pointer;
        background: var(--joe-surface);
        box-shadow: inset 0 0 0 1px var(--joe-line);
        color: var(--joe-ink);
        transition: background 0.12s, box-shadow 0.12s, transform 0.12s;
      }
      .strip button:hover:not([disabled]) {
        background: var(--joe-surface-2);
      }
      .strip button:active:not([disabled]) {
        transform: scale(0.97);
      }
      .strip button[aria-pressed="true"] {
        background: var(--joe-amber-soft);
        box-shadow: inset 0 0 0 2px var(--joe-amber);
      }
      .strip button[disabled] {
        cursor: default;
        opacity: 0.45;
      }
      .strip small {
        font-size: 11.5px;
        color: var(--joe-muted);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .strip b {
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 800;
        font-size: 20px;
        line-height: 1;
      }
      .mini {
        display: flex;
        align-items: flex-end;
        gap: 3px;
        height: 26px;
      }
      .mini i {
        width: 9px;
        border-radius: 2px 2px 0 0;
        min-height: 2px;
      }
      .day-head {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px 12px;
        margin-top: 18px;
      }
      .day-head h3 {
        margin: 0;
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 800;
        text-transform: uppercase;
        font-size: 26px;
        line-height: 1;
      }
      .tiles {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 10px;
        margin-top: 14px;
      }
      .tile {
        padding: 12px 14px;
        border-radius: 12px;
        background: var(--joe-surface);
        box-shadow: inset 0 0 0 1px var(--joe-line);
      }
      .tile .eyebrow {
        font-size: 11.5px;
      }
      .tile .value {
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 800;
        font-size: 30px;
        line-height: 1.05;
        margin-top: 4px;
        font-variant-numeric: tabular-nums;
      }
      .tile .value small {
        font-size: 16px;
        margin-left: 2px;
      }
      .tile .sub {
        font-size: 13px;
        color: var(--joe-ink-2);
        margin-top: 2px;
      }
      .chart-card {
        margin-top: 12px;
        padding: 14px 16px 10px;
        border-radius: 14px;
        background: var(--joe-surface);
        box-shadow: inset 0 0 0 1px var(--joe-line);
      }
      .chart-head {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 700;
        margin-bottom: 6px;
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
      .note {
        margin-top: 12px;
      }
      .eval-top {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr);
        gap: 8px 24px;
        align-items: start;
        margin-top: 4px;
      }
      .eval-big {
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 800;
        font-size: 40px;
        line-height: 1;
        font-variant-numeric: tabular-nums;
      }
      .eval-big small {
        display: block;
        margin-top: 4px;
        font-family: inherit;
        font-style: normal;
        font-weight: 600;
        font-size: 13px;
        color: var(--joe-ink-2);
      }
      .eval-big.good {
        color: var(--joe-good);
      }
      .eval-big.bad {
        color: var(--joe-crit);
      }
      .eval-top dl {
        display: grid;
        grid-template-columns: minmax(130px, auto) 1fr;
        gap: 4px 14px;
        margin: 0;
        font-size: 14px;
        font-variant-numeric: tabular-nums;
      }
      .eval-top dt {
        color: var(--joe-ink-2);
      }
      .eval-top dd {
        margin: 0;
        font-weight: 600;
      }
      .empty {
        display: grid;
        grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
        gap: 28px;
        align-items: center;
        max-width: 980px;
        margin: 0 auto;
      }
      .empty joe-pose {
        max-width: 380px;
        width: 100%;
        justify-self: center;
      }
      @media (max-width: 760px) {
        .tiles {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .tile .value {
          font-size: 26px;
        }
        .empty {
          grid-template-columns: 1fr;
        }
        .empty joe-pose {
          max-width: 260px;
        }
        .eval-top,
        .eval-top dl {
          grid-template-columns: 1fr;
        }
        .eval-top dd {
          margin-bottom: 6px;
        }
      }
    `,
  ];

  connectedCallback(): void {
    super.connectedCallback();
    this.load();
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    // A new hour or a finished import: fetch again.
    const observe = this.state?.observe;
    const marker = `${observe?.last_hour ?? ""}|${observe?.backfill.state ?? ""}|${observe?.day_count ?? 0}`;
    if (changed.has("state") && this.lastHour !== undefined && marker !== this.lastHour) {
      this.load();
    }
    this.lastHour = marker;
  }

  private async load(): Promise<void> {
    if (!this.hass) {
      return;
    }
    try {
      this.days = await this.hass.callWS<HistoryDays>({ type: "energy_joe/history/days", days: DAYS });
      this.failed = false;
      const known = this.days.days.map((d) => d.date);
      const day = this.selected && known.includes(this.selected) ? this.selected : known[0];
      if (day) {
        await this.select(day);
      }
    } catch {
      this.failed = true;
    }
  }

  protected updated(changed: PropertyValues<this>): void {
    if ((changed as Map<string, unknown>).has("days")) {
      // Show the newest days first on narrow screens.
      const strip = this.renderRoot.querySelector(".strip");
      strip?.scrollTo({ left: strip.scrollWidth });
    }
  }

  private async select(day: string): Promise<void> {
    this.selected = day;
    try {
      this.detail = await this.hass?.callWS<DayDetail>({ type: "energy_joe/history/day", date: day });
    } catch {
      this.failed = true;
    }
  }

  protected render() {
    const t = this.t;
    if (!t) {
      return nothing;
    }
    if (!this.days?.days.length) {
      return this.renderEmpty(t);
    }
    return html`<div class="wrap">
      ${displayTitle(t("history.title"))} ${swoosh}
      <p class="status">${this.statusText(t)}</p>
      ${this.renderStrip(t, this.days.days)} ${this.detail ? this.renderDay(t, this.detail) : nothing}
    </div>`;
  }

  private statusText(t: Translate): string {
    const observe = this.state?.observe;
    const parts: string[] = [];
    if (observe?.active && observe.since) {
      const sameDay = observe.since.slice(0, 10) === this.days?.days[0]?.date;
      parts.push(
        sameDay
          ? t("history.live_since", { time: this.time(observe.since) })
          : t("history.live_since_day", {
              day: new Intl.DateTimeFormat(t.lang, { day: "numeric", month: "long", timeZone: "UTC" }).format(
                new Date(`${observe.since.slice(0, 10)}T12:00:00Z`),
              ),
            }),
      );
    } else if (this.state?.mode === "off") {
      parts.push(t("history.paused"));
    }
    if (observe?.first_day) {
      parts.push(
        t("history.known", {
          days: observe.day_count ?? 0,
          first: new Intl.DateTimeFormat(t.lang, { day: "numeric", month: "long", timeZone: "UTC" }).format(
            new Date(`${observe.first_day}T12:00:00Z`),
          ),
        }),
      );
    }
    if (observe?.backfill.state === "running") {
      parts.push(t("history.reading"));
    }
    return parts.join(" · ");
  }

  private renderEmpty(t: Translate): TemplateResult {
    const observe = this.state?.observe;
    const key =
      this.state?.mode === "off"
        ? "history.empty.off"
        : observe?.backfill.state === "running"
          ? "history.empty.reading"
          : observe?.active
            ? "history.empty.soon"
            : "history.empty.waiting";
    return html`<div class="empty">
      <joe-pose name="inspect"></joe-pose>
      <div>
        ${displayTitle(t("history.title"))} ${swoosh}
        <p class="lead">${t(key)}</p>
        ${this.failed ? html`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${t("history.failed")}</div>` : nothing}
      </div>
    </div>`;
  }

  private renderStrip(t: Translate, days: DaySummary[]): TemplateResult {
    // The last 14 calendar days, oldest first; days without records stay greyed.
    const newest = days[0].date;
    const byDate = new Map(days.map((d) => [d.date, d]));
    const dates: string[] = [];
    for (let i = DAYS - 1; i >= 0; i--) {
      const date = new Date(`${newest}T12:00:00Z`);
      date.setUTCDate(date.getUTCDate() - i);
      dates.push(date.toISOString().slice(0, 10));
    }
    const top = Math.max(0.1, ...days.flatMap((d) => [d.home ?? 0, d.solar ?? 0]));
    return html`<div class="strip" role="group" aria-label=${t("history.days")} data-notip>
      ${dates.map((date) => {
        const summary = byDate.get(date);
        return html`<button
          type="button"
          aria-pressed=${String(date === this.selected)}
          ?disabled=${!summary}
          aria-label=${dayLabel(t.lang, date, "long")}
          @click=${() => this.select(date)}
        >
          <small>${dayLabel(t.lang, date, "short")}</small>
          <b>${Number(date.slice(8))}</b>
          <span class="mini" aria-hidden="true">
            <i style="height:${((summary?.home ?? 0) / top) * 26}px;background:var(--joe-c-load)"></i>
            <i style="height:${((summary?.solar ?? 0) / top) * 26}px;background:var(--joe-c-pv)"></i>
          </span>
        </button>`;
      })}
    </div>`;
  }

  private renderDay(t: Translate, day: DayDetail): TemplateResult {
    const s = day.summary;
    const missing = Math.max(0, s.expected - day.hours.filter((h) => h.cov >= 0.9).length);
    const live = s.sources.live ?? 0;
    const read = (s.sources.stats ?? 0) + (s.sources.history ?? 0);
    return html`<div class="day-head">
        <h3>${dayLabel(t.lang, day.date, "long")}</h3>
        ${day.workday === true
          ? html`<span class="chip">${t("history.workday")}</span>`
          : day.workday === false
            ? html`<span class="chip">${t("history.day_off")}</span>`
            : nothing}
        ${live ? html`<span class="chip ok"><ha-icon icon="mdi:eye-outline"></ha-icon>${t("history.live")}</span>` : nothing}
        ${read ? html`<span class="chip read"><ha-icon icon="mdi:database-outline"></ha-icon>${t("history.read")}</span>` : nothing}
      </div>
      ${this.renderTiles(t, s)} ${this.renderEnergyChart(t, day)} ${this.renderSocChart(t, day)}
      ${this.renderEvaluation(t, day)}
      ${missing && s.date !== this.days?.days[0]?.date
        ? html`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon><span>${t("history.missing", { hours: missing })}</span>
          </div>`
        : nothing}`;
  }

  private renderTiles(t: Translate, s: DaySummary): TemplateResult {
    const kwh = (value: number | null | undefined) => (value == null ? "–" : formatNumber(t.lang, value, 1));
    const tiles: TemplateResult[] = [];
    const tile = (label: string, value: string, unit: string, sub: string) =>
      html`<div class="tile">
        <div class="eyebrow">${label}</div>
        <div class="value">${value}<small>${unit}</small></div>
        ${sub ? html`<div class="sub">${sub}</div>` : nothing}
      </div>`;
    if (s.home != null) {
      tiles.push(
        tile(
          t("history.tile.home"),
          kwh(s.home),
          "kWh",
          s.self_sufficiency != null
            ? t("history.tile.home.self", { value: formatNumber(t.lang, s.self_sufficiency * 100, 0) })
            : "",
        ),
      );
    }
    if (s.solar != null) {
      tiles.push(
        tile(
          t("history.tile.solar"),
          kwh(s.solar),
          "kWh",
          s.fc_ahead != null
            ? t("history.tile.solar.fc", {
                value: kwh(s.fc_ahead),
                ratio: s.solar_vs_fc != null ? formatNumber(t.lang, s.solar_vs_fc * 100, 0) : "–",
              })
            : t("history.tile.solar.nofc"),
        ),
      );
    }
    if (s.grid_in != null) {
      const parts = [];
      if (s.grid_in_cheap != null) {
        parts.push(t("history.tile.grid.cheap", { value: kwh(s.grid_in_cheap) }));
      }
      if (s.grid_out != null) {
        parts.push(t("history.tile.grid.out", { value: kwh(s.grid_out) }));
      }
      tiles.push(tile(t("history.tile.grid"), kwh(s.grid_in), "kWh", parts.join(" · ")));
    }
    if (s.bat_in != null) {
      tiles.push(
        tile(t("history.tile.battery"), kwh(s.bat_in), "kWh", t("history.tile.battery.out", { value: kwh(s.bat_out) })),
      );
    }
    if (s.temp) {
      tiles.push(
        tile(
          t("history.tile.temp"),
          formatNumber(t.lang, s.temp.mean, 1),
          "°C",
          t("history.tile.temp.range", {
            min: formatNumber(t.lang, s.temp.min, 0),
            max: formatNumber(t.lang, s.temp.max, 0),
          }),
        ),
      );
    }
    if (s.present) {
      const names = new Map((this.state?.config.persons ?? []).map((p) => [p.id, p.name]));
      const entries = Object.entries(s.present);
      const most = Math.max(...entries.map(([, hours]) => hours));
      tiles.push(
        tile(
          t("history.tile.present"),
          formatNumber(t.lang, most, 0),
          "h",
          entries.map(([id, hours]) => `${names.get(id) ?? id} ${formatNumber(t.lang, hours, 0)} h`).join(" · "),
        ),
      );
    }
    return html`<div class="tiles">${tiles}</div>`;
  }

  private chartFrame(day: DayDetail): { labels: string[]; ticks: Map<number, string>; bands: ChartBand[]; markers: ChartMarker[] } {
    const t = this.t!;
    const labels = day.slots.map((start, i) => `${start}–${day.slots[i + 1] ?? "24:00"}`);
    const ticks = new Map<number, string>();
    day.slots.forEach((start, i) => {
      if (i % 3 === 0) {
        ticks.set(i, start.slice(0, 2));
      }
    });
    const bands = day.window_slots.map(([from, to]) => ({ from, to, label: t("history.chart.cheap") }));
    const markers: ChartMarker[] = [];
    if (day.sun.sunrise_slot != null) {
      const time = this.time(day.sun.sunrise!);
      markers.push({ at: day.sun.sunrise_slot, label: t("history.chart.sunrise", { time }), short: `↑${time}` });
    }
    if (day.sun.sunset_slot != null) {
      const time = this.time(day.sun.sunset!);
      markers.push({ at: day.sun.sunset_slot, label: t("history.chart.sunset", { time }), short: `↓${time}` });
    }
    return { labels, ticks, bands, markers };
  }

  private renderEnergyChart(t: Translate, day: DayDetail): TemplateResult {
    const values = (name: "home" | "solar" | "grid_in") => {
      const result: (number | null)[] = day.slots.map(() => null);
      for (const hour of day.hours) {
        if (hour[name] != null) {
          result[hour.slot] = hour[name]!;
        }
      }
      return result;
    };
    const forecast = day.fc_ahead_slots.some((v) => v != null) ? day.fc_ahead_slots : day.fc_slots;
    const series: ChartSeries[] = [
      { label: t("history.chart.solar"), kind: "area", values: values("solar"), color: "var(--joe-c-pv)", fill: "var(--joe-c-pv-fill)" },
      { label: t("history.chart.home"), kind: "bar", values: values("home"), color: "var(--joe-c-load)" },
    ];
    if (forecast.some((v) => v != null)) {
      series.push({ label: t("history.chart.forecast"), kind: "line", values: forecast, color: "var(--joe-c-ist)", dashed: true });
    }
    const frame = this.chartFrame(day);
    return html`<div class="chart-card" data-tipped>
      <div class="chart-head">${t("history.chart.energy")} ${tip(t, "chart_energy")}</div>
      <joe-chart
        .labels=${frame.labels}
        .ticks=${frame.ticks}
        .series=${series}
        .bands=${frame.bands}
        .markers=${frame.markers}
        unit="kWh"
        lang=${t.lang}
        label=${t("history.chart.energy")}
      ></joe-chart>
      <div class="legend">
        ${series.map(
          (s) => html`<span><i class=${s.dashed ? "dash" : ""} style="background:${s.color};color:${s.color}"></i>${s.label}</span>`,
        )}
      </div>
    </div>`;
  }

  private renderSocChart(t: Translate, day: DayDetail): TemplateResult | typeof nothing {
    const batteries = this.state?.config.batteries ?? [];
    const series: ChartSeries[] = batteries.map((battery, index) => {
      const values: (number | null)[] = day.slots.map(() => null);
      for (const hour of day.hours) {
        const soc = hour.bat?.[battery.id]?.soc;
        if (soc != null) {
          values[hour.slot] = soc;
        }
      }
      return { label: battery.name, kind: "line", values, color: SOC_COLORS[index % SOC_COLORS.length], digits: 0 };
    });
    if (!series.some((s) => s.values.some((v) => v != null))) {
      return nothing;
    }
    if (day.plan_soc_slots.some((v) => v != null)) {
      series.push({
        label: t("history.chart.plan"),
        kind: "line",
        values: day.plan_soc_slots,
        color: "var(--joe-c-ist)",
        dashed: true,
        digits: 0,
      });
    }
    const frame = this.chartFrame(day);
    return html`<div class="chart-card" data-tipped>
      <div class="chart-head">${t("history.chart.soc")} ${tip(t, "chart_soc")}</div>
      <joe-chart
        .labels=${frame.labels}
        .ticks=${frame.ticks}
        .series=${series}
        .bands=${frame.bands}
        max="100"
        height="170"
        unit="%"
        lang=${t.lang}
        label=${t("history.chart.soc")}
      ></joe-chart>
      <div class="legend">
        ${series.map(
          (s) => html`<span><i class=${s.dashed ? "dash" : ""} style="background:${s.color};color:${s.color}"></i>${s.label}</span>`,
        )}
      </div>
    </div>`;
  }

  /** The night's fixed plan replayed with the real day. */
  private renderEvaluation(t: Translate, day: DayDetail): TemplateResult | typeof nothing {
    const evaluation = day.evaluation;
    if (!day.plan?.fixed) {
      return nothing;
    }
    if (!evaluation) {
      return html`<div class="note"><ha-icon icon="mdi:timer-sand"></ha-icon><span>${t("history.eval.pending")}</span></div>`;
    }
    if (!evaluation.complete) {
      return html`<div class="note warn">
        <ha-icon icon="mdi:alert-outline"></ha-icon><span>${t("history.eval.incomplete")}</span>
      </div>`;
    }
    const currency = this.hass?.config?.currency;
    const saving = evaluation.saving ?? 0;
    const tone = saving > 0.005 ? "good" : saving < -0.005 ? "bad" : "";
    const kwh = (value: number | null | undefined) => fixed(t.lang, value ?? 0, 1);
    const clock = (iso: string | null | undefined) =>
      iso ? t("history.eval.clock", { time: this.time(iso) }) : t("history.eval.never");
    const provisional = !evaluation.final;
    const rows: [string, string][] = [
      [
        t("history.eval.day"),
        t("history.eval.instead", { with: kwh(evaluation.with_plan?.day_kwh), without: kwh(evaluation.without?.day_kwh) }),
      ],
      [
        t("history.eval.night"),
        t("history.eval.instead", { with: kwh(evaluation.with_plan?.night_kwh), without: kwh(evaluation.without?.night_kwh) }),
      ],
    ];
    // Sun, morning and takeover are only known once the day is over.
    if (!provisional && evaluation.solar?.forecast != null) {
      rows.push([
        t("history.eval.solar"),
        t("history.eval.solar.value", { actual: kwh(evaluation.solar.actual), expected: kwh(evaluation.solar.forecast) }),
      ]);
    }
    if (!provisional && evaluation.bridge) {
      rows.push([
        t("history.eval.morning"),
        t("history.eval.morning.value", { actual: kwh(evaluation.bridge.actual), expected: kwh(evaluation.bridge.planned) }),
      ]);
    }
    if (!provisional && evaluation.takeover) {
      rows.push([
        t("history.eval.takeover"),
        t("history.eval.takeover.value", { actual: clock(evaluation.takeover.actual), expected: clock(evaluation.takeover.planned) }),
      ]);
    }
    const series: ChartSeries[] = [
      { label: t("history.eval.chart.with"), kind: "line", values: day.evaluation_slots.with, color: "var(--joe-c-soc)", digits: 0 },
      {
        label: t("history.eval.chart.without"),
        kind: "line",
        values: day.evaluation_slots.without,
        color: "var(--joe-c-ist)",
        dashed: true,
        digits: 0,
      },
    ];
    const frame = this.chartFrame(day);
    return html`<div class="chart-card" data-tipped>
      <div class="chart-head">
        ${t("history.eval")} ${tip(t, "chart_replay")}
        ${provisional && evaluation.until
          ? html`<span class="chip warn">${t("history.eval.provisional", { time: this.time(evaluation.until) })}</span>`
          : nothing}
      </div>
      <div class="eval-top">
        <div class="eval-big ${tone}">
          ${tone === "bad" ? money(t, -saving, currency) : money(t, saving, currency)}
          <small>${t(tone === "good" ? "history.eval.saved" : tone === "bad" ? "history.eval.cost" : "history.eval.same")}</small>
        </div>
        <dl>${rows.map(([label, value]) => html`<dt>${label}</dt><dd>${value}</dd>`)}</dl>
      </div>
      ${provisional && evaluation.until
        ? html`<div class="note">
            <ha-icon icon="mdi:timer-sand"></ha-icon
            ><span>${t("history.eval.provisional.note", { time: this.time(evaluation.until) })}</span>
          </div>`
        : nothing}
      ${series.some((s) => s.values.some((v) => v != null))
        ? html`<joe-chart
              .labels=${frame.labels}
              .ticks=${frame.ticks}
              .series=${series}
              .bands=${frame.bands}
              max="100"
              height="150"
              unit="%"
              lang=${t.lang}
              label=${t("history.eval")}
            ></joe-chart>
            <div class="legend">
              ${series.map(
                (s) => html`<span><i class=${s.dashed ? "dash" : ""} style="background:${s.color};color:${s.color}"></i>${s.label}</span>`,
              )}
            </div>`
        : nothing}
    </div>`;
  }

  /** "14:05" from an ISO time with Home Assistant's offset, without the browser's time zone. */
  private time(iso: string): string {
    return iso.slice(11, 16);
  }
}

define("joe-history", JoeHistory);
