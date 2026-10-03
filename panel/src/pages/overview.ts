import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { displayTitle, swoosh } from "../components/bits";
import "../components/chart";
import type { ChartSeries } from "../components/chart";
import "../components/pose";
import { tip } from "../components/tip";
import { define } from "../define";
import { formatNumber, measurementKw, numberState, sumKw } from "../entities";
import { planCostLine, planLines, planPose, planSentence, windowText } from "../components/plan-text";
import type { Translate } from "../i18n";
import { shared } from "../styles/shared";
import type { DaySummary, HistoryDays, HomeAssistant, JoeState } from "../types";

/** Overview: what happens right now, the last days, tonight and the simulation. */
export class JoeOverview extends LitElement {
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) state?: JoeState;
  /** Where the panel lives, for links between its pages. */
  @property() prefix = "/energy-joe";

  @state() private week?: DaySummary[];

  private marker?: string;

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
      .card > joe-pose {
        position: absolute;
        right: -6px;
        top: 10px;
        width: 170px;
        pointer-events: none;
      }
      .night .head .eyebrow {
        flex: none;
        max-width: calc(100% - 210px);
      }
      .night .big {
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 800;
        font-size: clamp(44px, 6vw, 64px);
        line-height: 1;
        margin-top: 12px;
        max-width: 62%;
        font-variant-numeric: tabular-nums;
      }
      .night .big small {
        font-size: 0.5em;
        margin-left: 2px;
      }
      .night .say {
        margin: 10px 0 0;
        font-size: 15px;
        line-height: 1.5;
        color: var(--joe-ink-2);
        max-width: 60ch;
      }
      .night .lines {
        display: grid;
        gap: 2px;
        margin-top: 10px;
        font-size: 14px;
        font-variant-numeric: tabular-nums;
      }
      .night .cost {
        margin: 8px 0 0;
        font-size: 14px;
        font-weight: 600;
      }
      .wide {
        grid-column: 1 / -1;
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
      .now {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 10px;
        margin-top: 14px;
      }
      .flow {
        display: grid;
        grid-template-columns: auto 1fr;
        align-items: center;
        gap: 2px 12px;
        padding: 12px 14px;
        border-radius: 12px;
        background: var(--joe-surface-2);
      }
      .flow .icon {
        grid-row: span 3;
        width: 42px;
        height: 42px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        color: #071118;
      }
      .flow .icon ha-icon {
        --mdc-icon-size: 22px;
      }
      .flow.sun .icon {
        background: var(--joe-amber);
      }
      .flow.home .icon {
        background: var(--joe-ink);
        color: var(--joe-surface);
      }
      .flow.battery .icon {
        background: var(--joe-c-soc);
      }
      .flow.net .icon {
        background: var(--joe-c-grid);
        color: #ffffff;
      }
      .flow small {
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--joe-muted);
      }
      .flow b {
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 800;
        font-size: 30px;
        line-height: 1.05;
        font-variant-numeric: tabular-nums;
      }
      .flow b span {
        font-size: 16px;
        margin-left: 2px;
      }
      .flow em {
        font-style: normal;
        font-size: 13px;
        color: var(--joe-ink-2);
      }
      .status {
        margin: 6px 0 0;
        color: var(--joe-ink-2);
        font-size: 14px;
      }
      joe-chart {
        margin-top: 10px;
      }
      .legend {
        display: flex;
        flex-wrap: wrap;
        gap: 6px 14px;
        font-size: 12.5px;
        color: var(--joe-ink-2);
      }
      .legend span {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .legend i {
        width: 12px;
        height: 12px;
        border-radius: 3px;
      }
      .bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        flex-wrap: wrap;
        margin-top: 8px;
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
        .now,
        .next {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (max-width: 480px) {
        .next {
          grid-template-columns: 1fr;
        }
        .card > joe-pose {
          width: 120px;
        }
        .card .display {
          max-width: 64%;
        }
        .flow {
          padding: 10px;
          gap: 2px 8px;
        }
        .flow .icon {
          width: 34px;
          height: 34px;
        }
        .flow b {
          font-size: 24px;
        }
      }
    `,
  ];

  connectedCallback(): void {
    super.connectedCallback();
    this.loadWeek();
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    const observe = this.state?.observe;
    const marker = `${observe?.last_hour ?? ""}|${observe?.backfill.state ?? ""}|${observe?.day_count ?? 0}`;
    if (changed.has("state") && this.marker !== undefined && marker !== this.marker) {
      this.loadWeek();
    }
    this.marker = marker;
  }

  private async loadWeek(): Promise<void> {
    try {
      const result = await this.hass?.callWS<HistoryDays>({ type: "energy_joe/history/days", days: 7 });
      this.week = result?.days;
    } catch {
      this.week = [];
    }
  }

  protected render() {
    const t = this.t;
    if (!t) {
      return nothing;
    }
    const observing = Boolean(this.state?.observe?.active);
    const planning = Boolean(this.state?.plan && this.state.plan.kind !== "unavailable");
    return html`<div class="grid">
      ${this.renderNow(t)} ${this.renderWeek(t)}
      ${this.renderNight(t)}
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
          <li class=${observing ? "done" : ""}>
            <b>${t("overview.next.2.title")}</b><span>${t("overview.next.2.text")}</span>
            ${this.stepChip(t, observing)}
          </li>
          <li class=${planning ? "done" : ""}>
            <b>${t("overview.next.3.title")}</b><span>${t("overview.next.3.text")}</span>
            ${this.stepChip(t, planning)}
          </li>
          <li>
            <b>${t("overview.next.4.title")}</b><span>${t("overview.next.4.text")}</span>
            <span class="chip soon">${t("soon")}</span>
          </li>
        </ol>
      </section>
    </div>`;
  }

  private stepChip(t: Translate, running: boolean): TemplateResult {
    return running
      ? html`<span class="chip ok"><ha-icon icon="mdi:check"></ha-icon>${t("status.running")}</span>`
      : html`<span class="chip">${t(this.state?.mode === "off" ? "status.paused" : "status.waiting")}</span>`;
  }

  private renderNight(t: Translate): TemplateResult {
    const plan = this.state?.plan;
    if (!plan) {
      return html`<section class="card">
        <joe-pose name="relax"></joe-pose>
        <div class="eyebrow"><ha-icon icon="mdi:weather-night"></ha-icon>${t("overview.night")}</div>
        ${displayTitle(t("overview.night.empty.title"))} ${swoosh}
        <p class="lead">${t("overview.night.empty.text")}</p>
      </section>`;
    }
    const lines = planLines(t, plan);
    const cost = planCostLine(t, plan, this.hass?.config?.currency);
    const big =
      plan.kind === "charge" || plan.kind === "hold"
        ? html`${formatNumber(t.lang, plan.target ?? 0, 0)}<small>%</small>`
        : html`${t(plan.kind === "none" ? "plan.big.none" : "plan.big.unavailable")}`;
    return html`<section class="card night" data-tipped>
      <joe-pose name=${planPose(plan)}></joe-pose>
      <div class="head">
        <div class="eyebrow">
          <ha-icon icon="mdi:weather-night"></ha-icon>${t("overview.night")}${plan.window ? ` · ${windowText(t, plan)}` : ""}
        </div>
        ${tip(t, "plan_target")}
      </div>
      <div class="big">${big}</div>
      ${swoosh}
      <p class="say">${planSentence(t, plan)}</p>
      ${lines.length ? html`<div class="lines">${lines.map((line) => html`<div>${line}</div>`)}</div>` : nothing}
      ${cost ? html`<p class="cost">${cost}</p>` : nothing}
      <div class="bottom">
        <span class="chip ${plan.fixed ? "ok" : ""}">
          ${plan.fixed
            ? t("plan.fixed_at", { time: plan.created.slice(11, 16) })
            : t("plan.preview_at", { time: plan.created.slice(11, 16) })}
        </span>
        <a class="btn btn-secondary" data-notip href=${`${this.prefix}/plan`} @click=${(ev: MouseEvent) => this.open(ev, "plan")}
          >${t("overview.night.more")}</a
        >
      </div>
    </section>`;
  }

  private renderNow(t: Translate): TemplateResult {
    const hass = this.hass;
    const config = this.state?.config;
    if (!hass || !config) {
      return html``;
    }
    const m = config.measurements;
    const solar = m.solar_power.length ? sumKw(hass, m.solar_power) : null;
    const grid = measurementKw(hass, m.grid_power);
    const batteries = config.batteries.map((b) => ({
      power: measurementKw(hass, b.power),
      soc: numberState(hass, b.soc_entity),
    }));
    const known = batteries.filter((b) => b.power != null);
    const battery = known.length ? known.reduce((sum, b) => sum + (b.power ?? 0), 0) : null;
    let home = measurementKw(hass, m.home_power);
    const computed = home == null && grid != null;
    if (computed) {
      home = (grid ?? 0) + (solar ?? 0) - (battery ?? 0);
    }
    const socs = batteries.map((b) => b.soc).filter((v): v is number => v != null);
    const kw = (value: number | null) => (value == null ? "–" : formatNumber(t.lang, Math.abs(value), 2));
    const tile = (cls: string, icon: string, label: string, value: number | null, sub: string) =>
      html`<div class="flow ${cls}">
        <span class="icon"><ha-icon icon=${icon}></ha-icon></span>
        <small>${label}</small>
        <b>${kw(value)}<span>kW</span></b>
        <em>${sub}</em>
      </div>`;
    const idle = (value: number | null) => value == null || Math.abs(value) < 0.05;
    return html`<section class="card wide" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:pulse"></ha-icon>${t("overview.now")}</div>
        ${tip(t, "now")}
      </div>
      <div class="now">
        ${tile("sun", "mdi:solar-power", t("overview.now.solar"), solar, solar == null ? t("overview.now.none") : t("overview.now.solar.sub"))}
        ${tile(
          "home",
          "mdi:home-lightning-bolt-outline",
          t("overview.now.home"),
          home,
          home == null ? t("overview.now.none") : t(computed ? "overview.now.home.calc" : "overview.now.home.sub"),
        )}
        ${tile(
          "battery",
          "mdi:home-battery-outline",
          idle(battery) ? t("overview.now.battery") : battery! > 0 ? t("overview.now.battery.charge") : t("overview.now.battery.discharge"),
          battery,
          socs.length
            ? socs.length === 1
              ? t("overview.now.soc", { value: formatNumber(t.lang, socs[0], 0) })
              : t("overview.now.soc_avg", { value: formatNumber(t.lang, socs.reduce((a, b) => a + b, 0) / socs.length, 0), count: socs.length })
            : config.batteries.length
              ? t("overview.now.none")
              : t("overview.now.no_battery"),
        )}
        ${tile(
          "net",
          "mdi:transmission-tower",
          idle(grid) ? t("overview.now.grid") : grid! > 0 ? t("overview.now.grid.in") : t("overview.now.grid.out"),
          grid,
          grid == null ? t("overview.now.none") : idle(grid) ? t("overview.now.grid.idle") : grid > 0 ? t("overview.now.grid.in.sub") : t("overview.now.grid.out.sub"),
        )}
      </div>
    </section>`;
  }

  private renderWeek(t: Translate): TemplateResult {
    const days = [...(this.week ?? [])].reverse();
    const observe = this.state?.observe;
    const status = observe?.backfill.state === "running"
      ? t("history.reading")
      : observe?.first_day
        ? t("overview.week.known", { days: observe.day_count ?? 0 })
        : t("overview.week.none");
    const series: ChartSeries[] = [
      { label: t("history.chart.home"), kind: "bar", values: days.map((d) => d.home), color: "var(--joe-c-load)", digits: 1 },
      { label: t("history.chart.solar"), kind: "bar", values: days.map((d) => d.solar), color: "var(--joe-c-pv)", digits: 1 },
    ];
    const labels = days.map((d) =>
      new Intl.DateTimeFormat(t.lang, { weekday: "short", day: "numeric", month: "numeric", timeZone: "UTC" }).format(
        new Date(`${d.date}T12:00:00Z`),
      ),
    );
    const ticks = new Map(days.map((d, i) => [i, new Intl.DateTimeFormat(t.lang, { weekday: "short", timeZone: "UTC" }).format(new Date(`${d.date}T12:00:00Z`))] as [number, string]));
    return html`<section class="card wide" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:chart-bar"></ha-icon>${t("overview.week")}</div>
        ${tip(t, "week")}
      </div>
      <p class="status">${status}</p>
      ${days.length
        ? html`<joe-chart
              .labels=${labels}
              .ticks=${ticks}
              .series=${series}
              centerTicks
              unit="kWh"
              height="190"
              lang=${t.lang}
              label=${t("overview.week")}
            ></joe-chart>
            <div class="bottom">
              <div class="legend">
                ${series.map((s) => html`<span><i style="background:${s.color}"></i>${s.label}</span>`)}
              </div>
              <a class="btn btn-secondary" data-notip href=${this.historyHref()} @click=${this.openHistory}
                >${t("overview.week.more")}</a
              >
            </div>`
        : nothing}
    </section>`;
  }

  private historyHref(): string {
    return `${this.prefix}/history`;
  }

  private openHistory(ev: MouseEvent): void {
    this.open(ev, "history");
  }

  private open(ev: MouseEvent, page: "history" | "plan"): void {
    if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button !== 0) {
      return;
    }
    ev.preventDefault();
    this.dispatchEvent(new CustomEvent("joe-navigate", { detail: { page }, bubbles: true, composed: true }));
  }
}

define("joe-overview", JoeOverview);
