import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { displayTitle, swoosh } from "../components/bits";
import "../components/car-need";
import "../components/chart";
import type { ChartBand, ChartMarker, ChartSeries } from "../components/chart";
import { planCostLine, planPose, planSentence, slotsText, timeOf, windowText } from "../components/plan-text";
import { mirrorRow } from "../components/mirror";
import "../components/pose";
import "../components/steer-tonight";
import { tip } from "../components/tip";
import { define } from "../define";
import { GROUP_ICONS, actionPlace, deviceRoute, findDevice, type DeviceEntry } from "../device-model";
import { formatNumber } from "../entities";
import type { Translate } from "../i18n";
import { PANEL, href, onLink, type Route } from "../router";
import { shared } from "../styles/shared";
import type { BatteryConfig, HomeAssistant, JoeState, Plan, PlanAction, PlanBattery, PlanHour } from "../types";

const HOUR_MS = 3600 * 1000;
/** Homes of the plan's inputs (Netz & Sonne anchors). */
const SOLAR: Route = { tab: "devices", section: "grid", id: "solar" };
const TARIFF: Route = { tab: "devices", section: "grid", id: "tariff" };

/** One line of "So habe ich gerechnet"; with `to` it gets "Ändern →". */
interface MathRow {
  label: string;
  value: string;
  hint?: string;
  to?: Route;
}

/** Tonight's plan in full: what Joe does, the curves and how he got there. */
export class JoePlanPage extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;
  @property({ attribute: false }) route?: Route;
  @property({ attribute: false }) prefix = PANEL;
  /** Joe's devices (device-model): every row of the plan jumps to its device page (findDevice). */
  @property({ attribute: false }) devices: DeviceEntry[] = [];

  @state() private refreshing = false;

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
      .top {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        margin-top: 10px;
      }
      .display {
        font-size: clamp(30px, 4vw, 44px);
      }
      .hero {
        position: relative;
        margin-top: 16px;
        padding: 20px 22px;
        border-radius: 16px;
        background: var(--joe-surface);
        box-shadow: inset 0 0 0 1px var(--joe-line);
        overflow: hidden;
      }
      .hero joe-pose {
        position: absolute;
        /* Inside the card's padding: never cut off at the edge. */
        right: 18px;
        top: 16px;
        width: 170px;
        pointer-events: none;
      }
      .big {
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 800;
        font-size: clamp(52px, 7vw, 76px);
        line-height: 1;
        font-variant-numeric: tabular-nums;
        max-width: 60%;
      }
      .big small {
        font-size: 0.5em;
        margin-left: 2px;
      }
      .say {
        margin: 10px 0 0;
        font-size: 16px;
        line-height: 1.5;
        color: var(--joe-ink-2);
        max-width: 60ch;
      }
      .cost {
        margin: 10px 0 0;
        font-weight: 600;
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
      .slots {
        margin: 8px 0 0;
        font-size: 13.5px;
        color: var(--joe-ink-2);
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
      .tonight {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .tonight li {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        gap: 4px 12px;
        padding: 10px 0;
        border-top: 1px solid var(--joe-line);
      }
      .tonight li:first-child {
        border-top: 0;
      }
      .tonight li > ha-icon {
        --mdc-icon-size: 22px;
        color: var(--joe-ink-2);
        align-self: start;
        margin-top: 1px;
      }
      .tonight .what {
        display: grid;
        gap: 1px;
        min-width: 0;
        overflow-wrap: anywhere;
      }
      .tonight .what span {
        color: var(--joe-ink-2);
      }
      .tonight .what small {
        font-size: 13px;
        color: var(--joe-muted);
      }
      .tonight .more {
        grid-column: 2 / -1;
      }
      .note {
        margin-top: 10px;
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
      /* On the phone the button goes below the text, so the text keeps the width. */
      @media (max-width: 480px) {
        .tonight li {
          grid-template-columns: auto minmax(0, 1fr);
        }
        .tonight li > a {
          grid-column: 2;
          justify-self: start;
        }
      }
      @media (max-width: 760px) {
        /* Floats on narrow screens, so the sentence wraps around Joe instead of running under him. */
        .hero joe-pose {
          position: static;
          float: right;
          margin: -8px -10px 4px 8px;
          width: 112px;
        }
        .empty {
          grid-template-columns: 1fr;
        }
        .empty joe-pose {
          max-width: 260px;
        }
      }
    `,
  ];

  protected render() {
    const t = this.t;
    if (!t) {
      return nothing;
    }
    const plan = this.state?.plan;
    if (!plan || plan.kind === "unavailable" || !plan.hours) {
      return this.renderEmpty(t, plan);
    }
    const cost = planCostLine(t, plan, this.hass?.config?.currency);
    return html`<div class="wrap">
      <div class="eyebrow"><ha-icon icon="mdi:weather-night"></ha-icon>${t("overview.night")} · ${windowText(t, plan)}</div>
      ${displayTitle(t("plan.page.title"))} ${swoosh}
      <div class="top" data-tipped>
        ${this.state?.mode === "simulation"
          ? html`<span class="pill-sim">${t("mode.simulation")}</span>`
          : html`<span class="chip ${this.state?.mode === "live" ? "ok" : "learned"}">${t(`mode.${this.state?.mode ?? "off"}`)}</span>`}
        <span class="chip ${plan.fixed ? "ok" : ""}">
          ${plan.fixed ? t("plan.fixed_at", { time: plan.created.slice(11, 16) }) : t("plan.preview_at", { time: plan.created.slice(11, 16) })}
        </span>
        <button type="button" class="mini-btn" ?disabled=${this.refreshing || plan.fixed} @click=${this.refresh}>
          <ha-icon icon="mdi:refresh"></ha-icon>${t("plan.refresh")}
        </button>
        ${tip(t, "plan_refresh")}
      </div>
      <section class="hero" data-tipped>
        <joe-pose name=${planPose(plan)}></joe-pose>
        <div class="big">
          ${plan.kind === "none"
            ? t("plan.big.none")
            : html`${formatNumber(t.lang, plan.target ?? 0, 0)}<small>%</small>`}
        </div>
        <p class="say">${planSentence(t, plan)} ${tip(t, "plan_target")}</p>
        ${cost ? html`<p class="cost">${cost}</p>` : nothing}
      </section>
      <joe-steer-tonight .t=${t} .hass=${this.hass} .state=${this.state} .prefix=${this.prefix}></joe-steer-tonight>
      ${this.renderTonight(t, plan)} ${this.renderEnergy(t, plan, plan.hours)}
      ${this.renderPrices(t, plan, plan.hours)} ${this.renderSoc(t, plan, plan.hours)}
      ${this.renderMath(t, plan)}
    </div>`;
  }

  /**
   * "Was heute Nacht läuft": every battery of the plan and every device Joe
   * plans for tonight, each with "Ändern →" to its device page.
   */
  private renderTonight(t: Translate, plan: Plan): TemplateResult | typeof nothing {
    const batteries = plan.batteries ?? [];
    const actions = plan.actions ?? [];
    if (!batteries.length && !actions.length) {
      return nothing;
    }
    return html`<section class="chart-card" data-tipped>
      <div class="chart-head">${t("plan.tonight")} ${tip(t, "plan_actions")}</div>
      <ul class="tonight">
        ${batteries.map((battery) => this.batteryRow(t, plan, battery))} ${actions.map((action) => this.actionRow(t, plan, action))}
      </ul>
    </section>`;
  }

  /** One row of "Was heute Nacht läuft". */
  private tonightRow(
    t: Translate,
    row: { icon: string; name: string; text: string; extra?: string; to: Route; more?: TemplateResult },
  ): TemplateResult {
    return html`<li>
      <ha-icon icon=${row.icon}></ha-icon>
      <div class="what">
        <b>${row.name}</b>
        <span>${row.text}</span>
        ${row.extra ? html`<small>${row.extra}</small>` : nothing}
      </div>
      <a class="mini-btn go mirror-go" href=${href(this.prefix, row.to)} @click=${onLink(row.to)}>${t("mirror.change")}</a>
      ${row.more ? html`<div class="more">${row.more}</div>` : nothing}
    </li>`;
  }

  private batteryRow(t: Translate, plan: Plan, battery: PlanBattery): TemplateResult {
    const entry = findDevice(this.devices, "battery", battery.id);
    const pct = (value: number) => formatNumber(t.lang, value, 0);
    const time = timeOf(plan.charge_slots?.[0]?.start ?? plan.charge_from);
    let text: string;
    let extra = "";
    if (plan.kind === "charge" && battery.charge_kwh >= 0.05) {
      text = t(time ? "plan.tonight.charge" : "plan.tonight.charge_any", {
        time,
        from: pct(battery.soc_start),
        target: pct(battery.target),
      });
      extra = t("plan.tonight.charge.energy", {
        kwh: formatNumber(t.lang, battery.charge_kwh, 1),
        kw: formatNumber(t.lang, battery.power_kw, 1),
      });
    } else if (plan.kind === "hold") {
      text = t("plan.tonight.hold", { target: pct(battery.target) });
    } else {
      text = t("plan.tonight.idle", { soc: pct(battery.soc) });
    }
    if (!battery.controllable) {
      extra = [extra, t("plan.line.watch_only")].filter(Boolean).join(" · ");
    }
    return this.tonightRow(t, {
      icon: entry?.icon ?? GROUP_ICONS.battery,
      name: battery.name,
      text,
      extra,
      to: entry ? deviceRoute(entry) : { tab: "devices", section: "battery" },
    });
  }

  private actionRow(t: Translate, plan: Plan, action: PlanAction): TemplateResult {
    const currency = this.hass?.config?.currency ?? "EUR";
    const money = (value: number) => new Intl.NumberFormat(t.lang, { style: "currency", currency }).format(value);
    const target = action.target != null ? formatNumber(t.lang, action.target, 0) : "";
    const text = action.run
      ? action.kind === "target"
        ? t("plan.actions.target", { start: timeOf(action.start), end: timeOf(action.end), target })
        : t("plan.actions.run", { start: timeOf(action.start), end: timeOf(action.end) })
      : (t.optional(`devices.action.why.${action.reasons[action.reasons.length - 1] ?? "manual_only"}`, {
          kwh: formatNumber(t.lang, plan.meta?.tomorrow_kwh ?? 0, 0),
          temperature: formatNumber(t.lang, action.temperature ?? 0, 0),
        }) ?? "");
    const extra =
      action.run && action.energy_kwh
        ? t("plan.actions.energy", { kwh: formatNumber(t.lang, action.energy_kwh, 1), cost: money(action.cost ?? 0) })
        : "";
    const config = this.state?.config;
    const own = config?.actions.find((a) => a.id === action.id);
    const place = config && own ? actionPlace(config, own) : undefined;
    const entry = place ? findDevice(this.devices, place.group, place.id) : undefined;
    const group = place?.group ?? (action.need ? "car" : action.kind === "target" ? "hot_water" : "other");
    return this.tonightRow(t, {
      icon: entry?.icon ?? GROUP_ICONS[group],
      name: action.name,
      text,
      extra,
      // A device the list does not know (yet): its address all the same; gone from the settings: the group.
      to: entry ? deviceRoute(entry) : place ? { tab: "devices", section: place.group, id: place.id } : { tab: "devices", section: group },
      more: action.need
        ? html`<joe-car-need .hass=${this.hass} .t=${t} .action=${action} .roundTrip=${own?.need?.round_trip ?? true}></joe-car-need>`
        : undefined,
    });
  }

  private renderEmpty(t: Translate, plan: Plan | null | undefined): TemplateResult {
    const text = plan ? planSentence(t, plan) : t(this.state?.mode === "off" ? "plan.empty.off" : "plan.empty.waiting");
    return html`<div class="empty">
      <joe-pose name=${plan ? planPose(plan) : "plan"}></joe-pose>
      <div>
        ${displayTitle(t("plan.title"))} ${swoosh}
        <p class="lead">${text}</p>
      </div>
    </div>`;
  }

  /** Slot labels, ticks, the cheap window and markers for the plan's hours. */
  private frame(t: Translate, plan: Plan, hours: PlanHour[]) {
    const next = (clock: string) => `${String((Number(clock.slice(0, 2)) + 1) % 24).padStart(2, "0")}:00`;
    const labels = hours.map((hour, i) => `${timeOf(hour.start)}–${timeOf(hours[i + 1]?.start) || next(timeOf(hour.start))}`);
    const ticks = new Map<number, string>();
    hours.forEach((hour, i) => {
      const clock = timeOf(hour.start);
      if (clock === "00:00" && i > 0) {
        ticks.set(i, new Intl.DateTimeFormat(t.lang, { weekday: "short", timeZone: "UTC" }).format(new Date(`${hour.start.slice(0, 10)}T12:00:00Z`)));
      } else if (Number(clock.slice(0, 2)) % 3 === 0) {
        ticks.set(i, clock.slice(0, 2));
      }
    });
    const bands: ChartBand[] = [];
    hours.forEach((hour, i) => {
      if (!hour.window) {
        return;
      }
      const last = bands[bands.length - 1];
      if (last && last.to === i) {
        last.to = i + 1;
      } else {
        bands.push({ from: i, to: i + 1, label: t("history.chart.cheap") });
      }
    });
    const at = (iso: string | null | undefined): number | null => {
      if (!iso) {
        return null;
      }
      const moment = Date.parse(iso);
      for (let i = 0; i < hours.length; i++) {
        const start = Date.parse(hours[i].start);
        if (moment >= start && moment < start + HOUR_MS) {
          return i + (moment - start) / HOUR_MS;
        }
      }
      return null;
    };
    return { labels, ticks, bands, at };
  }

  private renderEnergy(t: Translate, plan: Plan, hours: PlanHour[]): TemplateResult {
    const frame = this.frame(t, plan, hours);
    const series: ChartSeries[] = [
      { label: t("plan.chart.solar"), kind: "area", values: hours.map((h) => h.solar), color: "var(--joe-c-pv)", fill: "var(--joe-c-pv-fill)" },
      { label: t("plan.chart.home"), kind: "line", values: hours.map((h) => h.home), color: "var(--joe-c-load)" },
    ];
    if (hours.some((h) => h.charge > 0)) {
      series.push({ label: t("plan.chart.charge"), kind: "bar", values: hours.map((h) => (h.charge > 0 ? h.charge : null)), color: "var(--joe-c-grid)" });
    }
    const markers: ChartMarker[] = [];
    const sun = frame.at(plan.sun_takes_over);
    if (sun != null) {
      const time = timeOf(plan.sun_takes_over);
      markers.push({ at: sun, label: t("plan.chart.sun", { time }), short: `↑${time}` });
    }
    return html`<div class="chart-card" data-tipped>
      <div class="chart-head">${t("plan.chart.energy")} ${tip(t, "chart_plan_energy")}</div>
      <joe-chart
        .labels=${frame.labels}
        .ticks=${frame.ticks}
        .series=${series}
        .bands=${frame.bands}
        .markers=${markers}
        unit="kWh"
        lang=${t.lang}
        label=${t("plan.chart.energy")}
      ></joe-chart>
      <div class="legend">
        ${series.map((s) => html`<span><i style="background:${s.color}"></i>${s.label}</span>`)}
      </div>
    </div>`;
  }

  /** A dynamic tariff's prices per hour, with the window and when Joe charges. */
  private renderPrices(t: Translate, plan: Plan, hours: PlanHour[]): TemplateResult | typeof nothing {
    if (!hours.some((h) => h.price != null)) {
      return nothing;
    }
    const frame = this.frame(t, plan, hours);
    const series: ChartSeries[] = [
      {
        label: t("plan.chart.price"),
        kind: "bar",
        values: hours.map((h) => (h.price != null ? Math.round(h.price * 1000) / 10 : null)),
        color: "var(--joe-c-ist)",
        digits: 1,
      },
    ];
    const markers: ChartMarker[] = (plan.charge_slots ?? []).flatMap((slot) => {
      const at = frame.at(slot.start);
      return at == null ? [] : [{ at, label: t("plan.chart.charge_at", { time: timeOf(slot.start) }), short: timeOf(slot.start) }];
    });
    return html`<div class="chart-card" data-tipped>
      <div class="chart-head">${t("plan.chart.prices")} ${tip(t, "chart_plan_prices")}</div>
      <joe-chart
        .labels=${frame.labels}
        .ticks=${frame.ticks}
        .series=${series}
        .bands=${frame.bands}
        .markers=${markers}
        unit="ct"
        lang=${t.lang}
        label=${t("plan.chart.prices")}
      ></joe-chart>
      ${plan.charge_slots?.length
        ? html`<p class="slots">${t("plan.slots", { slots: slotsText(plan) })}</p>`
        : nothing}
    </div>`;
  }

  private renderSoc(t: Translate, plan: Plan, hours: PlanHour[]): TemplateResult {
    const frame = this.frame(t, plan, hours);
    const reserve = plan.rules?.reserve ?? 10;
    const series: ChartSeries[] = [
      { label: t("plan.chart.plan"), kind: "line", values: hours.map((h) => h.soc), color: "var(--joe-c-soc)", digits: 0 },
      { label: t("plan.chart.without"), kind: "line", values: hours.map((h) => h.soc_without), color: "var(--joe-c-ist)", dashed: true, digits: 0 },
      {
        label: t("plan.chart.reserve", { value: formatNumber(t.lang, reserve, 0) }),
        kind: "line",
        values: hours.map(() => reserve),
        color: "var(--joe-crit)",
        dashed: true,
        digits: 0,
      },
    ];
    const markers: ChartMarker[] = [];
    const end = frame.at(plan.window?.end);
    if (end != null && plan.kind !== "none") {
      markers.push({ at: end, label: t("plan.chart.target", { value: formatNumber(t.lang, plan.target ?? 0, 0) }) });
    }
    const full = frame.at(plan.full_at);
    if (full != null) {
      markers.push({ at: full, label: t("plan.chart.full", { time: timeOf(plan.full_at) }), short: `${timeOf(plan.full_at)}` });
    }
    return html`<div class="chart-card" data-tipped>
      <div class="chart-head">${t("plan.chart.soc")} ${tip(t, "chart_plan_soc")}</div>
      <joe-chart
        .labels=${frame.labels}
        .ticks=${frame.ticks}
        .series=${series}
        .bands=${frame.bands}
        .markers=${markers}
        max="100"
        height="190"
        unit="%"
        lang=${t.lang}
        label=${t("plan.chart.soc")}
      ></joe-chart>
      <div class="legend">
        ${series.map(
          (s) => html`<span><i class=${s.dashed ? "dash" : ""} style="background:${s.color};color:${s.color}"></i>${s.label}</span>`,
        )}
      </div>
    </div>`;
  }

  /** "So habe ich gerechnet": every input, with "Ändern →" to where it is set. */
  private renderMath(t: Translate, plan: Plan): TemplateResult {
    const kwh = (value: number | undefined, digits = 1) => (value == null ? "–" : `${formatNumber(t.lang, value, digits)} kWh`);
    const ct = (value: number | undefined) => (value == null ? "–" : `${formatNumber(t.lang, value * 100, 1)} ct`);
    const windowDay = plan.window?.start.slice(0, 10) ?? "";
    const source = plan.meta?.solar.sources[windowDay] ?? "none";
    const tomorrow = plan.meta?.tomorrow;
    const factor = tomorrow?.solar_factor ?? plan.meta?.solar_factor ?? 1;
    const consumption = plan.meta?.consumption;
    const persons = this.state?.config.persons ?? [];
    const rows: MathRow[] = [
      {
        label: t("plan.math.battery_now"),
        value: `${formatNumber(t.lang, plan.soc_now ?? 0, 0)} %`,
        hint: t("plan.math.battery_now.sub", {
          stored: formatNumber(t.lang, ((plan.soc_now ?? 0) / 100) * (plan.capacity_kwh ?? 0), 1),
          capacity: formatNumber(t.lang, plan.capacity_kwh ?? 0, 1),
        }),
        to: { tab: "devices", section: "battery" },
      },
      { label: t("plan.math.battery_start"), value: `${formatNumber(t.lang, plan.soc_start ?? 0, 0)} %` },
      {
        label: t("plan.math.solar"),
        value: kwh(plan.solar_kwh),
        hint: `${t(`plan.math.solar.${source}`)}${
          factor !== 1
            ? ` · ${t(
                tomorrow?.solar_source === "combined"
                  ? "plan.math.solar.combined"
                  : tomorrow?.solar_source === "weather" && tomorrow.weather
                    ? "plan.math.solar.weather"
                    : "plan.math.solar.factor",
                {
                  value: formatNumber(t.lang, factor, 2),
                  weather: tomorrow?.weather ? t(`learn.weather.${tomorrow.weather}`) : "",
                },
              )}`
            : ""
        }`,
        to: SOLAR,
      },
      {
        label: t("plan.math.home"),
        value: kwh(plan.home_kwh),
        hint:
          consumption?.source === "history"
            ? t("plan.math.home.history", {
                days: consumption.days,
                kind: t(plan.meta?.workday === false ? "plan.math.day_off" : "plan.math.workday"),
              })
            : t("plan.math.home.default"),
      },
    ];
    if (tomorrow && (tomorrow.temp != null || tomorrow.weather)) {
      rows.push({
        label: t("plan.math.weather"),
        value: [tomorrow.temp != null ? `${formatNumber(t.lang, tomorrow.temp, 0)} °C` : "", tomorrow.weather ? t(`learn.weather.${tomorrow.weather}`) : ""]
          .filter(Boolean)
          .join(" · "),
        to: { tab: "household", section: "travel" },
      });
    }
    if (tomorrow) {
      rows.push({
        label: t("plan.math.day"),
        value: [
          t(tomorrow.workday ? "plan.math.day.workday" : "plan.math.day.off"),
          ...Object.entries(tomorrow.labels).map(([id, label]) =>
            t("plan.math.tomorrow.person", { name: persons.find((p) => p.id === id)?.name ?? id, label: t(`label.${label}`) }),
          ),
        ].join(" · "),
        hint:
          tomorrow.expected_kwh != null
            ? t("plan.math.tomorrow.scaled", {
                expected: formatNumber(t.lang, tomorrow.expected_kwh, 1),
                usual: formatNumber(t.lang, tomorrow.profile_kwh, 1),
              })
            : t("plan.math.tomorrow.usual"),
        to: { tab: "household", section: "days" },
      });
    }
    rows.push(
      {
        label: t("plan.math.target"),
        value: `${formatNumber(t.lang, plan.target ?? 0, 0)} %`,
        hint: t("plan.math.target.sub", {
          optimum: formatNumber(t.lang, plan.optimum ?? 0, 0),
          buffer: formatNumber(t.lang, (plan.rules?.buffer ?? 0) * 100, 0),
        }),
        to: { tab: "settings", section: "rules", id: "buffer_factor" },
      },
      {
        label: t("plan.math.prices"),
        value: t("plan.math.prices.value", { night: ct(plan.prices?.night), day: ct(plan.prices?.day), feed: ct(plan.prices?.feed_in) }),
        hint: plan.prices?.assumed ? t("plan.math.prices.assumed") : undefined,
        to: TARIFF,
      },
      {
        label: t("plan.math.rules"),
        value: t("plan.math.rules.value", {
          reserve: formatNumber(t.lang, plan.rules?.reserve ?? 0, 0),
          max: formatNumber(t.lang, plan.rules?.max_target ?? 100, 0),
          mode: t.optional(`rule.discharge.${plan.rules?.discharge_mode}`) ?? "",
        }),
        to: { tab: "settings", section: "rules" },
      },
    );
    const notes = [...new Set(plan.notes ?? [])].filter((n) => t.optional(`plan.note.${n}`));
    return html`<div class="chart-card" data-tipped>
      <div class="chart-head">${t("plan.math")} ${tip(t, "plan_math")}</div>
      <div class="mirrors">
        ${rows.map((row) =>
          row.to
            ? mirrorRow(t, this.prefix, { label: row.label, value: row.value, hint: row.hint, to: row.to })
            : html`<div class="mirror">
                <div class="mirror-text">
                  <span class="mirror-label">${row.label}</span><span class="mirror-sep" aria-hidden="true">·</span
                  ><span class="mirror-value">${row.value}</span>
                  ${row.hint ? html`<small class="mirror-hint">${row.hint}</small>` : nothing}
                </div>
              </div>`,
        )}
      </div>
      ${notes.map((note) => this.renderNote(t, plan, note))}
    </div>`;
  }

  /** A hint below the calculation, with a jump to where it can be fixed. */
  private renderNote(t: Translate, plan: Plan, note: string): TemplateResult {
    const jumps = this.noteJumps(t, plan, note);
    return html`<div class="note">
      <ha-icon icon="mdi:information-outline"></ha-icon>
      <div>
        <span>${t.optional(`plan.note.${note}`)}</span>
        ${jumps.length
          ? html`<div class="note-actions">
              ${jumps.map((jump) => html`<a class="mini-btn go mirror-go" href=${href(this.prefix, jump.to)} @click=${onLink(jump.to)}>${jump.label}</a>`)}
            </div>`
          : nothing}
      </div>
    </div>`;
  }

  /** Where a hint can be fixed: the battery it is about (each one, if several), the solar forecast, the tariff, a rule. */
  private noteJumps(t: Translate, plan: Plan, note: string): { to: Route; label: string }[] {
    const set = t("mirror.set");
    const config = this.state?.config;
    const batteries = config?.batteries ?? [];
    const planned = new Set((plan.batteries ?? []).map((b) => b.id));
    const missing = batteries.filter((b) => !planned.has(b.id));
    let about: BatteryConfig[] | undefined;
    switch (note) {
      case "capacity_unknown": {
        const unsized = missing.filter((b) => !b.capacity_kwh);
        about = unsized.length ? unsized : missing;
        break;
      }
      case "soc_unknown": {
        const sized = missing.filter((b) => b.capacity_kwh);
        about = sized.length ? sized : missing;
        break;
      }
      case "floor_unknown":
        about = batteries.filter((b) => planned.has(b.id) && b.floor_soc == null);
        break;
      case "not_controllable":
        about = batteries.filter((b) => b.adapter === "none");
        break;
      case "no_forecast":
        return [{ to: SOLAR, label: set }];
      case "prices_partly":
        return [{ to: TARIFF, label: t("mirror.change") }];
      case "balance_due":
        return [{ to: { tab: "settings", section: "rules", id: "balance_days" }, label: t("mirror.change") }];
      default:
        return [];
    }
    const route = (battery: BatteryConfig): Route => {
      const entry = findDevice(this.devices, "battery", battery.id);
      return entry ? deviceRoute(entry) : { tab: "devices", section: "battery", id: battery.id };
    };
    if (about.length === 1) {
      return [{ to: route(about[0]), label: set }];
    }
    if (!about.length) {
      return [{ to: { tab: "devices", section: "battery" }, label: set }];
    }
    return about.map((battery) => ({ to: route(battery), label: `${battery.name} →` }));
  }

  private async refresh(): Promise<void> {
    this.refreshing = true;
    try {
      await this.hass?.callWS({ type: "energy_joe/plan/refresh" });
    } catch {
      // The plan stays as it is; the next hour tries again.
    } finally {
      this.refreshing = false;
    }
  }
}

define("joe-plan-page", JoePlanPage);
