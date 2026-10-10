import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { displayTitle, swoosh } from "../components/bits";
import "../components/chart";
import type { ChartSeries } from "../components/chart";
import "../components/control-status";
import { controlText } from "../components/control-status";
import "../components/pose";
import "../components/steer-tonight";
import { steerAsks, steerShown } from "../components/steer-tonight";
import { tip } from "../components/tip";
import { define } from "../define";
import { formatNumber, measurementKw, numberState, sumKw } from "../entities";
import { dayText, money, nights, today } from "../components/look-back";
import { planCostLine, planLines, planPose, planSentence, timeOf, windowText } from "../components/plan-text";
import type { Translate } from "../i18n";
import type { DeviceEntry } from "../device-model";
import { PANEL, href, onLink, type Route } from "../router";
import { shared } from "../styles/shared";
import type { Check, ClimateFound, DaySummary, Discovery, HistoryDays, HomeAssistant, JoeState } from "../types";
import { batteryNow } from "./devices/battery-device";
import "./overview/climate-list";
import { climateRooms } from "./overview/climate-list";
import "./overview/inbox";
import { inboxItems } from "./overview/inbox";
import "./overview/quick";
import { quickShown } from "./overview/quick";

const PLAN: Route = { tab: "plan" };
const DAYS: Route = { tab: "review", section: "days" };
const RESULT: Route = { tab: "review", section: "result" };
const PRESENCE: Route = { tab: "household", section: "presence" };

/**
 * Overview, the daily start page: what runs and what Joe does right now,
 * does Joe need you (short, the rest behind "N weitere"), tonight, shortcuts for the moment, heating by room, who is home, the last
 * days and what steering would have brought. It sets nothing for good; every
 * part leads to its home.
 */
export class JoeOverview extends LitElement {
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) state?: JoeState;
  /** Where the panel lives, for links between its pages. */
  @property({ attribute: false }) prefix = PANEL;
  @property({ attribute: false }) route?: Route;
  /** Climate devices (names, rooms) from the panel's central load. */
  @property({ attribute: false }) climateFound?: ClimateFound;
  /** What Joe would find (new devices for "Joe braucht dich"). */
  @property({ attribute: false }) discovery?: Discovery;
  @property({ attribute: false }) checks: Check[] = [];
  /** Joe's devices (device-model), for jumps to their pages. */
  @property({ attribute: false }) devices: DeviceEntry[] = [];

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
        container-type: inline-size;
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
        /* Inside the card's padding: never cut off at the edge. */
        right: 18px;
        top: 16px;
        /* Bigger in a wide card, smaller where the card is narrow. */
        width: clamp(120px, 30cqw, 240px);
        pointer-events: none;
      }
      /* The heading row keeps clear of the bigger picture. */
      .card:has(> joe-pose) > .head {
        padding-right: clamp(126px, calc(30cqw + 8px), 248px);
      }
      .figure-card .head .eyebrow {
        flex: 0 1 auto;
        min-width: 0;
      }
      .figure-card .when {
        margin: 4px 0 0;
        max-width: 60%;
        font-size: 13.5px;
        color: var(--joe-ink-2);
        font-variant-numeric: tabular-nums;
      }
      .figure-card .big {
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 800;
        font-size: clamp(44px, 6vw, 64px);
        line-height: 1;
        margin-top: 12px;
        max-width: 62%;
        font-variant-numeric: tabular-nums;
      }
      .figure-card .big small {
        font-size: 0.5em;
        margin-left: 2px;
      }
      .figure-card .say {
        margin: 10px 0 0;
        font-size: 15px;
        line-height: 1.5;
        color: var(--joe-ink-2);
        max-width: 60ch;
      }
      .figure-card .lines {
        display: grid;
        gap: 2px;
        margin-top: 10px;
        font-size: 14px;
        font-variant-numeric: tabular-nums;
      }
      .figure-card .cost {
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
      /* A card that leads somewhere as a whole: its link stretches over it; tips, buttons and the chart stay on top. */
      a.stretch::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 14px;
      }
      .card:has(a.stretch) joe-tip,
      .card:has(a.stretch) joe-steer-tonight,
      .card:has(a.stretch) joe-chart {
        position: relative;
        z-index: 1;
      }
      .card:has(a.stretch:hover) {
        box-shadow: inset 0 0 0 1.5px var(--joe-line-2);
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
      /* "Joe tut gerade …" below the tiles. */
      .doing {
        margin-top: 16px;
        padding-top: 14px;
        border-top: 1px solid var(--joe-line);
      }
      .doing-text {
        margin: 6px 0 0;
        font-size: 16px;
        font-weight: 600;
      }
      .doing ul {
        margin: 6px 0 0;
        padding-left: 20px;
        color: var(--joe-ink-2);
        font-size: 14.5px;
        line-height: 1.5;
      }
      .status {
        margin: 6px 0 0;
        color: var(--joe-ink-2);
        font-size: 14px;
      }
      joe-chart {
        margin-top: 10px;
      }
      joe-steer-tonight {
        margin-top: 14px;
        padding-top: 12px;
        border-top: 1px solid var(--joe-line);
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
      /* One line that leads to its home ("Wer ist da", "Was es gebracht hätte"). */
      a.line {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        gap: 4px 14px;
        padding: 14px 16px 14px 18px;
        min-height: 44px;
        color: inherit;
        text-decoration: none;
        transition: box-shadow 0.12s, background 0.12s;
      }
      a.line:hover {
        box-shadow: inset 0 0 0 1.5px var(--joe-line-2);
      }
      a.line > ha-icon {
        --mdc-icon-size: 22px;
        color: var(--joe-ink-2);
      }
      a.line .go {
        --mdc-icon-size: 20px;
        color: var(--joe-muted);
      }
      .line-text {
        display: grid;
        gap: 3px;
        min-width: 0;
      }
      .line-text b {
        font-weight: 600;
        line-height: 1.4;
        overflow-wrap: anywhere;
      }
      .line-text b.good {
        color: var(--joe-good);
      }
      .line-text b.bad {
        color: var(--joe-crit);
      }
      .line-text small {
        font-size: 13px;
        color: var(--joe-ink-2);
      }
      @media (max-width: 900px) {
        .grid {
          grid-template-columns: 1fr;
        }
        .now {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (max-width: 480px) {
        .card > joe-pose {
          right: 12px;
          top: 12px;
          width: 128px;
        }
        .card:has(> joe-pose) > .head {
          padding-right: 136px;
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
        a.line {
          padding-inline: 14px 10px;
          gap: 4px 10px;
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
    const joe = this.state;
    if (!t || !joe) {
      return nothing;
    }
    const items = inboxItems(t, joe, {
      climateFound: this.climateFound,
      discovery: this.discovery,
      checks: this.checks,
      devices: this.devices,
    });
    // Tonight's yes/no in Vorschlagen leads "Joe braucht dich" instead of sitting in the night card.
    const ask = steerAsks(joe);
    const inbox = ask || items.length > 0 || (joe.questions?.length ?? 0) > 0;
    // The missing test run has its own row; the night card does not repeat it.
    const untestedRow = items.some((item) => item.id.startsWith("test:"));
    const quick = quickShown(joe);
    const climate = climateRooms(joe).length > 0;
    const who = this.renderWho(t, joe);
    // Two halves side by side on a wide screen; one alone spans the row.
    const half = (other: boolean) => (other ? "" : "wide");
    // "Gerade jetzt" first: in ten seconds you see that it runs and what Joe does, then whether he needs you.
    return html`<div class="grid">
      ${this.renderNow(t, joe)}
      ${inbox
        ? html`<joe-overview-inbox
            class="wide"
            .t=${t}
            .hass=${this.hass}
            .state=${joe}
            .prefix=${this.prefix}
            .items=${items}
            .steer=${ask}
          ></joe-overview-inbox>`
        : nothing}
      ${this.renderNight(t, joe, half(quick), !ask, untestedRow)}
      ${quick
        ? html`<joe-overview-quick .t=${t} .hass=${this.hass} .state=${joe} .prefix=${this.prefix}></joe-overview-quick>`
        : nothing}
      ${climate
        ? html`<joe-overview-climate
            class="wide"
            .t=${t}
            .hass=${this.hass}
            .state=${joe}
            .prefix=${this.prefix}
            .climateFound=${this.climateFound}
          ></joe-overview-climate>`
        : nothing}
      ${who ? this.line(PRESENCE, "mdi:home-account", t("overview.who"), who, "", "") : nothing}
      ${this.renderResult(t, joe, half(Boolean(who)))} ${this.renderWeek(t)}
    </div>`;
  }

  /** "Gerade jetzt": sun, home, batteries and grid, then what Joe does with the devices. */
  private renderNow(t: Translate, joe: JoeState): TemplateResult {
    const hass = this.hass;
    const config = joe.config;
    if (!hass) {
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
      ${this.renderDoing(t, joe)}
    </section>`;
  }

  /** "Joe tut gerade …": one sentence, the details (batteries, devices running, rooms) and "Sofort freigeben". */
  private renderDoing(t: Translate, joe: JoeState): TemplateResult | typeof nothing {
    const control = joe.control;
    const details = this.doingLines(t, joe);
    if (!control && !details.length) {
      return nothing;
    }
    return html`<div class="doing">
      <div class="eyebrow"><ha-icon icon="mdi:robot-outline"></ha-icon>${t("overview.doing")}</div>
      ${control ? html`<p class="doing-text">${controlText(t, joe)}</p>` : nothing}
      ${details.length ? html`<ul>${details.map((line) => html`<li>${line}</li>`)}</ul>` : nothing}
      <joe-control-status compact .t=${t} .hass=${this.hass} .state=${joe}></joe-control-status>
    </div>`;
  }

  /** What Joe holds or switches right now: steered batteries, night actions on, rooms set to away or night. */
  private doingLines(t: Translate, joe: JoeState): string[] {
    const control = joe.control;
    const config = joe.config;
    const lines: string[] = [];
    if (control?.steering) {
      for (const battery of config.batteries) {
        const action = control.batteries[battery.id]?.action;
        if (battery.adapter !== "none" && action && ["charge", "hold", "block", "defer"].includes(action)) {
          lines.push(t("overview.doing.battery", { name: battery.name, what: batteryNow(t, battery, control) }));
        }
      }
    }
    for (const action of config.actions) {
      const now = control?.actions?.[action.id];
      if (now?.on) {
        lines.push(t("overview.doing.action", { name: action.name, time: timeOf(now.end) }));
      }
    }
    const status = joe.climate;
    if (status?.live) {
      const rooms = climateRooms(joe)
        .map((entity) => ({ entity, now: status.rooms[entity] }))
        .filter((room) => room.now && !room.now.would);
      const name = (entity: string) =>
        this.climateFound?.devices.find((d) => d.entity_id === entity)?.area ??
        this.devices.find((d) => d.group === "climate" && d.id === entity)?.name ??
        entity;
      for (const why of ["away", "night"] as const) {
        const hit = rooms.filter((room) => room.now?.why === why);
        if (hit.length === 1) {
          lines.push(t(`overview.doing.${why}_one`, { name: name(hit[0].entity) }));
        } else if (hit.length > 1) {
          lines.push(t(`overview.doing.${why}`, { count: hit.length }));
        }
      }
    }
    return lines;
  }

  /**
   * "Heute Nacht": target, cost, fixed or preview; the card leads to the plan,
   * the decision stays a button (`steer`: not while "Joe braucht dich" asks it).
   */
  private renderNight(t: Translate, joe: JoeState, cls: string, steer: boolean, untestedRow: boolean): TemplateResult {
    const plan = joe.plan;
    if (!plan) {
      return html`<section class="card ${cls}">
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
    return html`<section class="card figure-card ${cls}" data-tipped>
      <joe-pose name=${planPose(plan)}></joe-pose>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:weather-night"></ha-icon>${t("overview.night")}</div>
        ${tip(t, "plan_target")}
      </div>
      ${plan.window ? html`<p class="when">${windowText(t, plan)}</p>` : nothing}
      <div class="big">${big}</div>
      ${swoosh}
      <p class="say">${planSentence(t, plan)}</p>
      ${lines.length ? html`<div class="lines">${lines.map((line) => html`<div>${line}</div>`)}</div>` : nothing}
      ${cost ? html`<p class="cost">${cost}</p>` : nothing}
      ${steer && steerShown(joe)
        ? html`<joe-steer-tonight
            compact
            .hideUntested=${untestedRow}
            .t=${t}
            .hass=${this.hass}
            .state=${joe}
            .prefix=${this.prefix}
          ></joe-steer-tonight>`
        : nothing}
      <div class="bottom">
        <span class="chip ${plan.fixed ? "ok" : ""}">
          ${plan.fixed
            ? t("plan.fixed_at", { time: plan.created.slice(11, 16) })
            : t("plan.preview_at", { time: plan.created.slice(11, 16) })}
        </span>
        <a class="btn btn-secondary stretch" href=${href(this.prefix, PLAN)} @click=${onLink(PLAN)}>${t("overview.night.more")}</a>
      </div>
    </section>`;
  }

  /** "Wer ist da" in one line: who is home, who heads home, guests, and what kind of day it is. */
  private renderWho(t: Translate, joe: JoeState): string | undefined {
    const status = joe.climate;
    if (!status || (!joe.config.persons.length && !status.home.length)) {
      return undefined;
    }
    const names = Object.fromEntries(joe.config.persons.map((p) => [p.person_entity, p.name]));
    // The guest tracker is in Joe's list of who is home under its own name; here it is "Gast da" once.
    const tracker = joe.config.context.guest_tracker;
    const guest = tracker ? this.hass?.states[tracker] : undefined;
    const guestHome = guest?.state === "home";
    const guestName = guestHome ? String(guest?.attributes.friendly_name ?? tracker!.split(".")[1].replace(/_/g, " ")) : undefined;
    const home = status.home.filter((name) => name !== guestName);
    const parts = home.length
      ? [t("overview.who.home", { names: home.join(", ") })]
      : guestHome
        ? []
        : [t("overview.who.nobody")];
    for (const [person, way] of Object.entries(status.arrivals ?? {})) {
      if (way.direction === "towards") {
        const name = names[person] ?? String(this.hass?.states[person]?.attributes.friendly_name ?? person);
        parts.push(way.minutes != null ? t("overview.who.coming", { name, minutes: way.minutes }) : t("overview.who.coming_soon", { name }));
      }
    }
    if (guestHome) {
      parts.push(t("overview.who.guest"));
    }
    const day = status.day;
    if (day) {
      parts.push(
        day.holiday
          ? t("overview.who.day.holiday")
          : day.weekend && day.free
            ? t("overview.who.day.weekend")
            : day.home_office.length && !day.free
              ? t("overview.who.day.home_office", { names: day.home_office.join(", ") })
              : t("overview.who.day.workday"),
      );
    }
    return parts.join(" · ");
  }

  /** A card that is one line and leads to its home. */
  private line(to: Route, icon: string, label: string, text: string, tone: string, cls: string, sub?: string): TemplateResult {
    return html`<a class="card line ${cls}" href=${href(this.prefix, to)} @click=${onLink(to)}>
      <ha-icon icon=${icon}></ha-icon>
      <span class="line-text">
        <span class="eyebrow">${label}</span>
        <b class=${tone}>${text}</b>
        ${sub ? html`<small>${sub}</small>` : nothing}
      </span>
      <ha-icon class="go" icon="mdi:chevron-right"></ha-icon>
    </a>`;
  }

  /** "Was es gebracht hätte" as one line; the whole story is under Rückblick › Ergebnis. */
  private renderResult(t: Translate, joe: JoeState, cls: string): TemplateResult {
    const results = joe.results;
    const last = results?.last;
    const label = t("overview.result");
    if (!results || !last) {
      return this.line(RESULT, "mdi:calculator-variant-outline", label, t("overview.result.none"), "", cls);
    }
    const currency = this.hass?.config?.currency;
    // The night is named after the morning it ends on.
    const end = last.window?.end.slice(0, 10) ?? last.date;
    const night =
      end === today(this.hass?.config?.time_zone)
        ? t("overview.result.last")
        : t("overview.result.night", { day: dayText(t.lang, end, "weekday") });
    const saving = last.saving;
    const tone = saving > 0.005 ? "good" : saving < -0.005 ? "bad" : "";
    const text =
      tone === "good"
        ? t("overview.result.saved", { night, value: money(t, saving, currency) })
        : tone === "bad"
          ? t("overview.result.cost", { night, value: money(t, -saving, currency) })
          : t("overview.result.same", { night });
    const since = results.since ?? results.first;
    const total = t("overview.result.total", {
      since: since ? dayText(t.lang, since) : "–",
      value: money(t, results.saving, currency, true),
      nights: nights(t, results.days),
    });
    const provisional = !last.final && last.until ? ` · ${t("overview.result.provisional", { time: last.until.slice(11, 16) })}` : "";
    return this.line(RESULT, "mdi:calculator-variant-outline", label, text, tone, cls, `${total}${provisional}`);
  }

  /** The last 7 days as small bars; the card leads to Rückblick › Tage. */
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
            height="120"
            lang=${t.lang}
            label=${t("overview.week")}
          ></joe-chart>`
        : nothing}
      <div class="bottom">
        ${days.length
          ? html`<div class="legend">
              ${series.map((s) => html`<span><i style="background:${s.color}"></i>${s.label}</span>`)}
            </div>`
          : html`<span></span>`}
        <a class="btn btn-secondary stretch" href=${href(this.prefix, DAYS)} @click=${onLink(DAYS)}>${t("overview.week.more")}</a>
      </div>
    </section>`;
  }
}

define("joe-overview", JoeOverview);
