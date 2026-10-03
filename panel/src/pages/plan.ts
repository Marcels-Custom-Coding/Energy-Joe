import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { displayTitle, swoosh } from "../components/bits";
import "../components/chart";
import type { ChartBand, ChartMarker, ChartSeries } from "../components/chart";
import { planCostLine, planLines, planPose, planSentence, timeOf, windowText } from "../components/plan-text";
import "../components/pose";
import { tip } from "../components/tip";
import { define } from "../define";
import { formatNumber } from "../entities";
import type { Translate } from "../i18n";
import { shared } from "../styles/shared";
import type { HomeAssistant, JoeState, Plan, PlanHour } from "../types";

const HOUR_MS = 3600 * 1000;

/** Tonight's plan in full: what Joe does, the curves and how he got there. */
export class JoePlanPage extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;

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
        right: 0;
        top: 8px;
        width: 180px;
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
      .lines {
        display: grid;
        gap: 2px;
        margin-top: 12px;
        font-variant-numeric: tabular-nums;
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
      dl {
        display: grid;
        grid-template-columns: minmax(140px, auto) 1fr;
        gap: 8px 16px;
        margin: 6px 0 0;
      }
      dt {
        color: var(--joe-ink-2);
      }
      dd {
        margin: 0;
        font-weight: 600;
      }
      dd small {
        display: block;
        font-weight: 400;
        color: var(--joe-muted);
        font-size: 13px;
      }
      .note {
        margin-top: 10px;
      }
      .steer .actions {
        margin-top: 12px;
      }
      .steer .chart-head {
        font-size: 16px;
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
        .hero joe-pose {
          width: 120px;
        }
        dl {
          grid-template-columns: 1fr;
          gap: 2px;
        }
        dd {
          margin-bottom: 8px;
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
    const lines = planLines(t, plan);
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
        ${lines.length ? html`<div class="lines">${lines.map((line) => html`<div>${line}</div>`)}</div>` : nothing}
        ${cost ? html`<p class="cost">${cost}</p>` : nothing}
      </section>
      ${this.renderSteer(t, plan)} ${this.renderActions(t, plan)} ${this.renderEnergy(t, plan, plan.hours)}
      ${this.renderSoc(t, plan, plan.hours)}
      ${this.renderMath(t, plan)}
    </div>`;
  }

  /** Whether Joe steers tonight: the question in "suggest", skipping in "live". */
  private renderSteer(t: Translate, plan: Plan): TemplateResult | typeof nothing {
    const joe = this.state;
    const control = joe?.control;
    if (!joe || !control || !["advisory", "live"].includes(joe.mode) || !plan.window || plan.kind === "none") {
      return nothing;
    }
    const night = plan.window.start;
    const skipped = control.skip === night;
    const answer = control.answer?.night === night ? control.answer.yes : null;
    const untested = joe.config.batteries.filter(
      (b) => b.adapter !== "none" && control.ready[b.id] && control.ready[b.id] !== "ready",
    );
    let text: string;
    let buttons: TemplateResult;
    if (joe.mode === "advisory" && !skipped) {
      text = answer === true ? t("plan.steer.answered_yes") : answer === false ? t("plan.steer.answered_no") : t("plan.steer.advisory");
      buttons = html`${answer !== true
        ? html`<button type="button" class="btn btn-primary" @click=${() => this.answer(night, true)}>${t("plan.steer.yes")}</button>`
        : nothing}
      ${answer !== false
        ? html`<button type="button" class="btn btn-secondary" @click=${() => this.answer(night, false)}>${t("plan.steer.no")}</button>`
        : nothing}`;
    } else {
      text = skipped ? t("plan.steer.skipped") : t("plan.steer.live");
      buttons = html`<button type="button" class="btn btn-secondary" @click=${() => this.skip(!skipped)}>
        ${t(skipped ? "plan.steer.unskip" : "plan.steer.skip")}
      </button>`;
    }
    return html`<section class="chart-card steer" data-tipped>
      <div class="chart-head">${text} ${tip(t, "plan_steer")}</div>
      ${untested.length
        ? html`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon><span>${t("plan.steer.untested", { names: untested.map((b) => b.name).join(", ") })}</span>
          </div>`
        : nothing}
      <div class="actions">${buttons}</div>
    </section>`;
  }

  /** The night actions tonight: what runs, when, and why the others don't. */
  private renderActions(t: Translate, plan: Plan): TemplateResult | typeof nothing {
    const actions = plan.actions ?? [];
    if (!actions.length) {
      return nothing;
    }
    const currency = this.hass?.config?.currency ?? "EUR";
    const money = (value: number) => new Intl.NumberFormat(t.lang, { style: "currency", currency }).format(value);
    return html`<section class="chart-card" data-tipped>
      <div class="chart-head">${t("plan.actions")} ${tip(t, "plan_actions")}</div>
      <dl>
        ${actions.map((action) => {
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
          return html`<dt>${action.name}</dt>
            <dd>${text}${extra ? html`<small>${extra}</small>` : nothing}</dd>`;
        })}
      </dl>
    </section>`;
  }

  private async answer(night: string, yes: boolean): Promise<void> {
    try {
      await this.hass?.callWS({ type: "energy_joe/control/answer", night, yes });
    } catch {
      // The state stays as it was; the next try works.
    }
  }

  private async skip(skip: boolean): Promise<void> {
    try {
      await this.hass?.callWS({ type: "energy_joe/control/skip", skip });
    } catch {
      // As above.
    }
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

  private renderMath(t: Translate, plan: Plan): TemplateResult {
    const kwh = (value: number | undefined, digits = 1) => (value == null ? "–" : `${formatNumber(t.lang, value, digits)} kWh`);
    const ct = (value: number | undefined) => (value == null ? "–" : `${formatNumber(t.lang, value * 100, 1)} ct`);
    const windowDay = plan.window?.start.slice(0, 10) ?? "";
    const source = plan.meta?.solar.sources[windowDay] ?? "none";
    const tomorrow = plan.meta?.tomorrow;
    const factor = tomorrow?.solar_factor ?? plan.meta?.solar_factor ?? 1;
    const consumption = plan.meta?.consumption;
    const persons = this.state?.config.persons ?? [];
    const rows: [string, TemplateResult | string][] = [
      [
        t("plan.math.battery_now"),
        html`${formatNumber(t.lang, plan.soc_now ?? 0, 0)} %<small
            >${t("plan.math.battery_now.sub", {
              stored: formatNumber(t.lang, ((plan.soc_now ?? 0) / 100) * (plan.capacity_kwh ?? 0), 1),
              capacity: formatNumber(t.lang, plan.capacity_kwh ?? 0, 1),
            })}</small
          >`,
      ],
      [t("plan.math.battery_start"), `${formatNumber(t.lang, plan.soc_start ?? 0, 0)} %`],
      [
        t("plan.math.solar"),
        html`${kwh(plan.solar_kwh)}<small
            >${t(`plan.math.solar.${source}`)}${factor !== 1
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
              : ""}</small
          >`,
      ],
      [
        t("plan.math.home"),
        html`${kwh(plan.home_kwh)}<small
            >${consumption?.source === "history"
              ? t("plan.math.home.history", {
                  days: consumption.days,
                  kind: t(plan.meta?.workday === false ? "plan.math.day_off" : "plan.math.workday"),
                })
              : t("plan.math.home.default")}</small
          >`,
      ],
      ...(tomorrow && (tomorrow.temp != null || Object.keys(tomorrow.labels).length)
        ? [
            [
              t("plan.math.tomorrow"),
              html`${[
                  tomorrow.temp != null ? `${formatNumber(t.lang, tomorrow.temp, 0)} °C` : "",
                  ...Object.entries(tomorrow.labels).map(([id, label]) =>
                    t("plan.math.tomorrow.person", {
                      name: persons.find((p) => p.id === id)?.name ?? id,
                      label: t(`label.${label}`),
                    }),
                  ),
                ]
                  .filter(Boolean)
                  .join(" · ")}<small
                  >${tomorrow.expected_kwh != null
                    ? t("plan.math.tomorrow.scaled", {
                        expected: formatNumber(t.lang, tomorrow.expected_kwh, 1),
                        usual: formatNumber(t.lang, tomorrow.profile_kwh, 1),
                      })
                    : t("plan.math.tomorrow.usual")}</small
                >`,
            ] as [string, TemplateResult | string],
          ]
        : []),
      [
        t("plan.math.target"),
        html`${formatNumber(t.lang, plan.target ?? 0, 0)} %<small
            >${t("plan.math.target.sub", {
              optimum: formatNumber(t.lang, plan.optimum ?? 0, 0),
              buffer: formatNumber(t.lang, (plan.rules?.buffer ?? 0) * 100, 0),
            })}</small
          >`,
      ],
      [
        t("plan.math.prices"),
        html`${t("plan.math.prices.value", {
            night: ct(plan.prices?.night),
            day: ct(plan.prices?.day),
            feed: ct(plan.prices?.feed_in),
          })}${plan.prices?.assumed ? html`<small>${t("plan.math.prices.assumed")}</small>` : nothing}`,
      ],
      [
        t("plan.math.rules"),
        t("plan.math.rules.value", {
          reserve: formatNumber(t.lang, plan.rules?.reserve ?? 0, 0),
          max: formatNumber(t.lang, plan.rules?.max_target ?? 100, 0),
          mode: t.optional(`rule.discharge.${plan.rules?.discharge_mode}`) ?? "",
        }),
      ],
    ];
    const notes = [...new Set(plan.notes ?? [])].map((n) => t.optional(`plan.note.${n}`)).filter(Boolean);
    return html`<div class="chart-card" data-tipped>
      <div class="chart-head">${t("plan.math")} ${tip(t, "plan_math")}</div>
      <dl>${rows.map(([label, value]) => html`<dt>${label}</dt><dd>${value}</dd>`)}</dl>
      ${notes.map((note) => html`<div class="note"><ha-icon icon="mdi:information-outline"></ha-icon><span>${note}</span></div>`)}
    </div>`;
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
