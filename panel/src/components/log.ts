import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { define } from "../define";
import { entityName, formatNumber } from "../entities";
import type { Translate } from "../i18n";
import { shared } from "../styles/shared";
import type { ClimateLogEntry, ControlLogEntry, HomeAssistant, JoeConfig } from "../types";
import { dayText } from "./look-back";

// What Joe switched: the steering log (control/executor.py) and the climate
// log (control/climate.py) in one list. energy_joe/log sends both with an
// "area"; the state carries only their last entries, oldest first.

export type LogGroup = "battery" | "climate" | "car" | "hot_water" | "other" | "joe";
/** Filters of Rückblick › Protokoll, in the order of the chips. */
export const LOG_FILTERS: readonly ("all" | LogGroup)[] = ["all", "battery", "climate", "car", "hot_water", "other", "joe"];

export type LogEntry = (ControlLogEntry & { area: "control" }) | (ClimateLogEntry & { area: "climate" });

export interface LogFilter {
  group?: "all" | LogGroup;
  /** Joe's id of the device: battery id, action id, consumer id or climate entity. */
  device?: string;
}

/** Both logs as one list, newest first. */
export function mergeLogs(control: ControlLogEntry[] = [], climate: ClimateLogEntry[] = []): LogEntry[] {
  const entries: LogEntry[] = [
    ...control.map((entry): LogEntry => ({ ...entry, area: "control" })),
    ...climate.map((entry): LogEntry => ({ ...entry, area: "climate" })),
  ];
  // Stable: entries with the same second keep their order (newest last in each log).
  return entries
    .map((entry, index) => ({ entry, index }))
    .sort((a, b) => b.entry.at.localeCompare(a.entry.at) || b.index - a.index)
    .map(({ entry }) => entry);
}

/** Which area and device an entry belongs to. */
export function logGroup(config: JoeConfig | undefined, entry: LogEntry): { group: LogGroup; device?: string } {
  if (entry.area === "climate") {
    return { group: "climate", device: entry.entity };
  }
  const key = typeof entry.battery === "string" ? entry.battery : "";
  if (!key) {
    return { group: "joe" };
  }
  if (key.startsWith("action:")) {
    const id = key.slice(7);
    const action = config?.actions.find((a) => a.id === id);
    if (action?.kind === "target") {
      return { group: "hot_water", device: id };
    }
    if (action?.need?.enabled) {
      return { group: "car", device: id };
    }
    return { group: "other", device: action?.consumer_id ?? `action-${id}` };
  }
  return { group: "battery", device: key };
}

/** The name of a device in the log. */
export function logDeviceName(
  config: JoeConfig | undefined,
  hass: HomeAssistant | undefined,
  names: Record<string, string>,
  group: LogGroup,
  device: string,
): string {
  if (group === "climate") {
    return names[device] ?? (hass ? entityName(hass, device) : device);
  }
  if (group === "battery") {
    return config?.batteries.find((b) => b.id === device)?.name ?? device;
  }
  const actionId = device.startsWith("action-") ? device.slice(7) : device;
  return (
    config?.actions.find((a) => a.id === actionId)?.name ??
    config?.consumers.find((c) => c.id === device)?.name ??
    device
  );
}

/** One steering entry in words. */
export function logText(t: Translate, config: JoeConfig | undefined, entry: ControlLogEntry, hass?: HomeAssistant): string {
  const battery =
    config?.batteries.find((b) => b.id === entry.battery)?.name ??
    config?.actions.find((a) => `action:${a.id}` === entry.battery)?.name ??
    entry.battery ??
    "";
  const entity = entry.entity ? (hass ? entityName(hass, entry.entity) : entry.entity) : "";
  const vars: Record<string, string | number> = {
    battery,
    entity,
    value: entry.value == null ? "–" : String(entry.value),
    target: String(entry.target ?? ""),
    power: typeof entry.power === "number" ? formatNumber(t.lang, entry.power, 1) : "–",
    soc: typeof entry.soc === "number" ? formatNumber(t.lang, entry.soc, 0) : "–",
    unit: typeof entry.unit === "string" ? entry.unit : "%",
  };
  if (entry.kind === "boost_end") {
    return t.optional(`log.boost_end.${String(entry.reason)}`, vars) ?? t("log.boost_end.stopped", vars);
  }
  if (entry.kind === "answer") {
    return t(entry.yes ? "log.answer.yes" : "log.answer.no");
  }
  if (entry.kind === "test") {
    return t(entry.ok ? "log.test.ok" : "log.test.failed", vars);
  }
  return t.optional(`log.${entry.kind}`, vars) ?? entry.kind;
}

/** One climate entry: the device's name and what Joe set. */
export function climateLogText(
  t: Translate,
  entry: ClimateLogEntry,
  names: Record<string, string>,
  hass?: HomeAssistant,
): TemplateResult {
  const name = names[entry.entity] ?? (hass ? entityName(hass, entry.entity) : entry.entity);
  return html`<b>${name}</b> · ${t.optional(`climate.log.${entry.what}`) ?? entry.what}`;
}

/** Does an entry pass a filter? */
export function logMatches(config: JoeConfig | undefined, entry: LogEntry, filter: LogFilter | undefined): boolean {
  if (!filter || !filter.group || filter.group === "all") {
    return true;
  }
  const found = logGroup(config, entry);
  return found.group === filter.group && (!filter.device || found.device === filter.device);
}

/** A list of log entries, newest first as given; filtered and cut to a limit. */
export class JoeLogList extends LitElement {
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) config?: JoeConfig;
  /** Climate device names by entity (from energy_joe/climate/devices). */
  @property({ attribute: false }) names: Record<string, string> = {};
  @property({ attribute: false }) entries: LogEntry[] = [];
  @property({ attribute: false }) limit = Infinity;
  @property({ attribute: false }) filter?: LogFilter;
  /** What to say when nothing passes the filter. */
  @property({ attribute: false }) empty?: string;

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      .log {
        list-style: none;
        margin: 10px 0 0;
        padding: 0;
        display: grid;
        gap: 2px;
        font-size: 14px;
      }
      .log li {
        display: grid;
        grid-template-columns: 110px minmax(0, 1fr);
        gap: 10px;
        padding: 8px 0;
        border-top: 1px solid var(--joe-line);
      }
      .log li:first-child {
        border-top: 0;
      }
      .log time {
        color: var(--joe-muted);
        font-variant-numeric: tabular-nums;
      }
      .log b {
        font-weight: 600;
        overflow-wrap: anywhere;
      }
      .log span {
        overflow-wrap: anywhere;
      }
      .empty {
        margin: 10px 0 0;
        color: var(--joe-ink-2);
      }
      @media (max-width: 760px) {
        .log li {
          grid-template-columns: 1fr;
          gap: 0;
        }
      }
    `,
  ];

  protected render() {
    const t = this.t;
    if (!t) {
      return nothing;
    }
    const entries = this.entries.filter((entry) => logMatches(this.config, entry, this.filter)).slice(0, this.limit);
    if (!entries.length) {
      return html`<p class="empty">${this.empty ?? t("past.log.empty")}</p>`;
    }
    return html`<ul class="log">
      ${entries.map(
        (entry) => html`<li>
          <time datetime=${entry.at}>${dayText(t.lang, entry.at.slice(0, 10), "short")} ${entry.at.slice(11, 16)}</time>
          <span
            >${entry.area === "climate"
              ? climateLogText(t, entry, this.names, this.hass)
              : logText(t, this.config, entry, this.hass)}</span
          >
        </li>`,
      )}
    </ul>`;
  }
}

define("joe-log-list", JoeLogList);
