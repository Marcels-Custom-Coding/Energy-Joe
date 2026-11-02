import { LitElement, css, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { define } from "../define";
import type { Translate } from "../i18n";
import { shared } from "../styles/shared";
import type { HomeAssistant, JoeConfig, JoeState } from "../types";
import { batteryTeam, teamRows } from "./battery-team";
import { logDeviceName, logGroup, logMatches, logText, mergeLogs, type LogEntry, type LogFilter } from "./log";
import { dayText } from "./look-back";

// "Steuerung": what Joe holds or waits for right now, and one line per
// intervention of the last 7 days (what, why). The page (Rückblick ›
// Steuerung) and the dashboard card show the same two elements.

/** Lines that say something but steer nothing: they never bloat a group. */
const MINOR = new Set(["night_charged", "team_review", "car_capacity", "car_refresh", "probe", "test", "answer"]);

/** Entries of the same device at most this far apart are one intervention. */
const GAP_MS = 60_000;

export interface SteerGroup {
  /** Start of the intervention (the oldest entry). */
  at: string;
  group: string;
  device?: string;
  /** The device's name; empty for Joe himself. */
  name: string;
  /** What happened, one sentence per entry. */
  what: string[];
  /** The reason Joe gave, when the backend knew one. */
  why?: string;
}

/** The whole log of the last days from the backend; undefined when it fails (older backend, no admin). */
export async function loadLog(hass: HomeAssistant | undefined): Promise<LogEntry[] | undefined> {
  if (!hass) {
    return undefined;
  }
  try {
    const result = await hass.callWS<{ entries: LogEntry[] } | null>({ type: "energy_joe/log" });
    return Array.isArray(result?.entries) ? result.entries : undefined;
  } catch {
    return undefined;
  }
}

/** A marker that changes when either log in the state got a new entry. */
export function logMarker(state: JoeState | undefined): string {
  const control = state?.control?.log ?? [];
  const climate = state?.climate?.log ?? [];
  return `${control.length}|${control.at(-1)?.at ?? ""}|${climate.length}|${climate.at(-1)?.at ?? ""}`;
}

/** The log of the state as a list, for when the whole log is not there. */
export function stateLog(state: JoeState | undefined): LogEntry[] {
  return mergeLogs(state?.control?.log, state?.climate?.log);
}

function ms(at: string): number {
  return new Date(at).getTime();
}

function whyOf(entry: LogEntry): string | undefined {
  const why = (entry as { why?: unknown }).why;
  return typeof why === "string" && why.trim() ? why.trim() : undefined;
}

/** Entries (newest first) to interventions (newest first): one device, entries within a minute of each other. */
export function steerGroups(
  t: Translate,
  config: JoeConfig | undefined,
  entries: LogEntry[],
  names: Record<string, string>,
  hass?: HomeAssistant,
  filter?: LogFilter,
): SteerGroup[] {
  type Open = { key: string; group: string; device?: string; items: LogEntry[] };
  const open: Open[] = [];
  for (const entry of entries) {
    if (!logMatches(config, entry, filter)) {
      continue;
    }
    const found = logGroup(config, entry);
    const key = `${found.group}|${found.device ?? ""}`;
    const last = open.at(-1);
    // Newest first: the next entry is older than the last one of the open group.
    if (last && last.key === key && ms(last.items.at(-1)!.at) - ms(entry.at) <= GAP_MS) {
      last.items.push(entry);
    } else {
      open.push({ key, group: found.group, device: found.device, items: [entry] });
    }
  }
  return open.map(({ group, device, items }) => {
    const chronological = [...items].reverse();
    const steering = chronological.filter((entry) => entry.area === "climate" || !MINOR.has(entry.kind));
    const shown = steering.length ? steering : chronological;
    const name = device && group !== "joe" ? logDeviceName(config, hass, names, group as never, device) : "";
    const what: string[] = [];
    for (const entry of shown) {
      let text =
        entry.area === "climate"
          ? (t.optional(`climate.log.${entry.what}`) ?? String(entry.what))
          : logText(t, config, entry, hass);
      // The device is its own part of the line.
      if (name && text.startsWith(`${name}: `)) {
        text = text.slice(name.length + 2);
      }
      if (!what.includes(text)) {
        what.push(text);
      }
    }
    return {
      at: chronological[0].at,
      group,
      device,
      name,
      what,
      why: chronological.map(whyOf).find(Boolean),
    };
  });
}

function localDay(offset = 0): string {
  const date = new Date(Date.now() - offset * 86400e3);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

/** "Heute", "Gestern" or "Sa., 31.10." for a day heading. */
export function steerDay(t: Translate, day: string): string {
  if (day === localDay(0)) return t("team.day.today");
  if (day === localDay(1)) return t("team.day.yesterday");
  return dayText(t.lang, day, "weekday");
}

/** The time of an intervention: "14:02" today, else "31.10. 14:02". */
export function steerTime(t: Translate, at: string): string {
  const time = at.slice(11, 16);
  return at.slice(0, 10) === localDay(0) ? time : `${dayText(t.lang, at.slice(0, 10), "short")} ${time}`;
}

const listStyles = css`
  :host {
    display: block;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .empty {
    margin: 10px 0 0;
    color: var(--joe-ink-2);
    font-size: 14px;
  }
  .time {
    color: var(--joe-muted);
    font-variant-numeric: tabular-nums;
    font-size: 13px;
  }
  .dev {
    font-weight: 600;
    overflow-wrap: anywhere;
  }
  .what,
  .why {
    overflow-wrap: anywhere;
  }
  .what {
    margin: 0;
  }
  .why {
    color: var(--joe-ink-2);
    font-size: 13.5px;
  }
  .why b {
    font-weight: 600;
    color: var(--joe-muted);
  }
`;

/** "Jetzt": what Joe holds or waits for at the moment, with the reason. */
export class JoeSteerNow extends LitElement {
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;

  static styles = [
    shared,
    listStyles,
    css`
      li {
        display: flex;
        gap: 10px;
        align-items: flex-start;
        padding: 7px 0;
        border-top: 1px solid var(--joe-line);
        font-size: 14.5px;
      }
      li:first-child {
        border-top: 0;
      }
      li ha-icon {
        flex: none;
        margin-top: 1px;
        --mdc-icon-size: 20px;
        color: var(--joe-muted);
      }
      li.works ha-icon {
        color: var(--joe-amber);
      }
      .note {
        margin: 8px 0 0;
        color: var(--joe-muted);
        font-size: 13px;
      }
    `,
  ];

  protected render() {
    const t = this.t;
    const state = this.state;
    if (!t || !state) {
      return nothing;
    }
    const team = batteryTeam(state);
    const rows = teamRows(t, team).map((row) => ({ ...row, icon: row.works ? "mdi:flash" : "mdi:timer-sand" }));
    // Night actions switched on (cars, hot water, devices): they run until a time.
    for (const action of state.config.actions) {
      const now = state.control?.actions?.[action.id];
      if (now?.on) {
        rows.push({
          id: `action:${action.id}`,
          name: action.name,
          text: t("overview.doing.action", { name: action.name, time: now.end.slice(11, 16) }),
          works: true,
          icon: "mdi:flash",
        });
      }
    }
    if (!rows.length) {
      return html`<p class="empty">${t("steer.now.empty")}</p>`;
    }
    return html`<ul>
        ${rows.map((row) => html`<li class=${row.works ? "works" : ""}><ha-icon icon=${row.icon}></ha-icon><span>${row.text}</span></li>`)}
      </ul>
      ${team?.dry ? html`<p class="note">${t("steer.now.dry")}</p>` : nothing}`;
  }
}

/** The interventions of the last days: time, device, what, why. Grouped by day, or flat for a card. */
export class JoeSteerList extends LitElement {
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) config?: JoeConfig;
  @property({ attribute: false }) names: Record<string, string> = {};
  /** Newest first. */
  @property({ attribute: false }) entries: LogEntry[] = [];
  @property({ attribute: false }) filter?: LogFilter;
  @property({ attribute: false }) limit = Infinity;
  /** A card: no day headings, the day inside the time. */
  @property({ type: Boolean }) compact = false;
  @property({ attribute: false }) empty?: string;

  static styles = [
    shared,
    listStyles,
    css`
      h3 {
        margin: 14px 0 2px;
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: var(--joe-muted);
      }
      h3:first-child {
        margin-top: 4px;
      }
      li {
        display: grid;
        grid-template-columns: 56px 150px minmax(0, 1fr);
        gap: 4px 12px;
        padding: 9px 0;
        border-top: 1px solid var(--joe-line);
        font-size: 14.5px;
      }
      li:first-child {
        border-top: 0;
      }
      .body {
        display: grid;
        gap: 2px;
        min-width: 0;
      }
      :host([compact]) li {
        grid-template-columns: 84px minmax(0, 1fr);
        font-size: 14px;
      }
      :host([compact]) .dev {
        display: block;
      }
      :host([compact]) .time {
        grid-row: span 2;
      }
      @media (max-width: 760px) {
        li {
          grid-template-columns: 52px minmax(0, 1fr);
        }
        li > .dev {
          grid-column: 2;
        }
        .body {
          grid-column: 2;
        }
      }
    `,
  ];

  protected render() {
    const t = this.t;
    if (!t) {
      return nothing;
    }
    const names: Record<string, string> = { ...this.names };
    const groups = steerGroups(t, this.config, this.entries, names, this.hass, this.filter).slice(0, this.limit);
    if (!groups.length) {
      return html`<p class="empty">${this.empty ?? t("steer.empty")}</p>`;
    }
    if (this.compact) {
      return html`<ul>${groups.map((group) => this.row(t, group, true))}</ul>`;
    }
    const days: { day: string; items: SteerGroup[] }[] = [];
    for (const group of groups) {
      const day = group.at.slice(0, 10);
      if (days.at(-1)?.day === day) {
        days.at(-1)!.items.push(group);
      } else {
        days.push({ day, items: [group] });
      }
    }
    return html`${days.map(
      ({ day, items }) => html`<h3>${steerDay(t, day)}</h3>
        <ul>
          ${items.map((group) => this.row(t, group, false))}
        </ul>`,
    )}`;
  }

  private row(t: Translate, group: SteerGroup, withDay: boolean) {
    const time = withDay ? steerTime(t, group.at) : group.at.slice(11, 16);
    const name = group.name || t("steer.joe");
    return html`<li>
      <time class="time" datetime=${group.at}>${time}</time>
      <span class="dev">${name}</span>
      <div class="body">
        <p class="what">${group.what.join(" · ")}</p>
        <span class="why"><b>${t("steer.why")}</b> ${group.why ?? t("steer.why.none")}</span>
      </div>
    </li>`;
  }
}

define("joe-steer-now", JoeSteerNow);
define("joe-steer-list", JoeSteerList);
