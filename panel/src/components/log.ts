import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { define } from "../define";
import { actionPlace } from "../device-model";
import { entityName, formatNumber } from "../entities";
import type { Translate } from "../i18n";
import { shared } from "../styles/shared";
import type { ClimateLogEntry, ControlLogEntry, HomeAssistant, JoeConfig } from "../types";
import { together } from "./battery-team";
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
    // The same place as the device's page (device-model.ts).
    if (!config || !action) {
      return { group: "other", device: `action-${id}` };
    }
    const place = actionPlace(config, action);
    return { group: place.group, device: place.id };
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
  const actionId = device.startsWith("action-") ? device.slice(7) : device.startsWith("point:") ? device.slice(6) : device;
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
    cap: typeof entry.cap === "number" ? formatNumber(t.lang, entry.cap, 1) : "–",
    soc: typeof entry.soc === "number" ? formatNumber(t.lang, entry.soc, 0) : "–",
    unit: typeof entry.unit === "string" ? entry.unit : "%",
    until: typeof entry.until === "string" ? entry.until.slice(11, 16) : "–",
    loadpoint: typeof entry.loadpoint === "string" ? entry.loadpoint : "evcc",
    remaining: typeof entry.remaining === "number" ? formatNumber(t.lang, entry.remaining, 1) : "–",
    headroom: typeof entry.headroom === "number" ? formatNumber(t.lang, entry.headroom, 1) : "–",
    level: typeof entry.level === "number" ? formatNumber(t.lang, entry.level, 0) : "–",
    planned: typeof entry.planned === "number" ? formatNumber(t.lang, entry.planned, 1) : "–",
    charged: typeof entry.charged === "number" ? formatNumber(t.lang, entry.charged, 1) : "–",
  };
  const nameOf = (id: unknown) => config?.batteries.find((b) => b.id === id)?.name ?? String(id ?? "");
  const names = (ids: unknown) => (Array.isArray(ids) ? ids.map(nameOf).join(", ") : "");
  if (entry.kind.startsWith("team_")) {
    const team = {
      ...vars,
      // A group hands over as one ("Venus mit Victron").
      battery: Array.isArray(entry.batteries) && entry.batteries.length > 1 ? together(t, entry.batteries.map(nameOf)) : battery,
      previous: nameOf(entry.previous),
      charging: names(entry.charging),
      discharging: names(entry.discharging),
      cutoff: typeof entry.value === "number" ? formatNumber(t.lang, entry.value, 1) : "–",
      level: typeof entry.soc === "number" ? formatNumber(t.lang, entry.soc, 1) : "–",
      names: Array.isArray(entry.names) ? entry.names.map((n) => `„${String(n)}“`).join(", ") : "",
      why: t.optional(`team.given_back.why.${String(entry.reason ?? entry.problem ?? "")}`) ?? "",
      direction: t.optional(`log.team_hold.${String(entry.direction ?? "")}`) ?? "",
      // Charging along, helping, a base load (control/team_day.py): the active one and the others.
      active: nameOf(entry.battery),
      others: Array.isArray(entry.batteries) ? together(t, entry.batteries.map(nameOf)) : "",
      energy: typeof entry.energy === "number" ? formatNumber(t.lang, entry.energy, 1) : "–",
      lead: typeof entry.value === "number" ? formatNumber(t.lang, entry.value, 0) : "–",
      watts: typeof entry.power === "number" ? formatNumber(t.lang, entry.power, 0) : "–",
    };
    if (entry.kind === "team_along" || entry.kind === "team_along_end") {
      return t.optional(`log.${entry.kind}.${String(entry.reason)}`, team) ?? t(`log.${entry.kind}`, team);
    }
    if (entry.kind === "team_review") {
      return t(typeof entry.batteries === "object" && entry.batteries ? "log.team_review.short" : "log.team_review", team);
    }
    if (entry.kind === "team_hold_end") {
      return t.optional(`log.team_hold_end.${String(entry.reason)}`, team) ?? t("log.team_hold_end", team);
    }
    if (entry.kind === "team_given_back") {
      return t("log.team_given_back", team);
    }
    if (entry.kind === "team_handover") {
      return t.optional(`log.team_handover.${String(entry.reason)}`, team) ?? t("log.team_handover", team);
    }
    if (entry.kind === "team_end") {
      return t.optional(`log.team_end.${String(entry.reason)}`, team) ?? t("log.team_end", team);
    }
    if (entry.kind === "team_block") {
      const how = entry.charge ? (entry.discharge ? "both" : "charge") : entry.discharge ? "discharge" : "free";
      return t(`log.team_block.${how}`, team);
    }
    if (entry.kind === "team_transfer") {
      return t(entry.blocked ? "log.team_transfer.blocked" : "log.team_transfer", team);
    }
    return t.optional(`log.${entry.kind}`, team) ?? entry.kind;
  }
  if (entry.kind.startsWith("guard_")) {
    // The watchdog (control/guard.py): every stage, plain words.
    const seconds = typeof entry.seconds === "number" ? entry.seconds : 0;
    const guard = {
      ...vars,
      charging: names(entry.charging),
      discharging: names(entry.discharging),
      names: Array.isArray(entry.names) ? entry.names.map((n) => `„${String(n)}“`).join(", ") : "",
      entities: Array.isArray(entry.entities)
        ? entry.entities.map((e) => (hass ? entityName(hass, String(e)) : String(e))).join(", ")
        : "",
      duration: seconds < 120 ? t("guard.seconds", { n: seconds }) : t("guard.minutes", { n: Math.round(seconds / 60) }),
    };
    const dry = entry.dry ? ".dry" : "";
    let text: string;
    if (entry.kind === "guard_restart") {
      text = t(entry.clean ? `log.guard_restart.clean${dry}` : `log.guard_restart${dry}`, guard);
    } else if (entry.kind === "guard_block") {
      text = t(`log.guard_block.${entry.direction === "discharge" ? "discharge" : "charge"}${dry}`, guard);
    } else if (entry.kind === "guard_alarm") {
      text = t(`log.guard_alarm${dry}`, guard);
    } else if (entry.kind === "guard_inside") {
      text = t(`log.guard_inside${dry}`, guard);
    } else if (entry.kind === "guard_fixed") {
      const stage = Math.min(3, Math.max(1, Number(entry.stage) || 1)) as 1 | 2 | 3;
      text = t(`log.guard_fixed.${stage}`, guard);
    } else if (entry.kind === "guard_restored") {
      const failed = Array.isArray(entry.failed) && entry.failed.length > 0;
      text = failed
        ? t("log.guard_restored.failed", {
            ...guard,
            entities: (entry.failed as unknown[]).map((e) => (hass ? entityName(hass, String(e)) : String(e))).join(", "),
          })
        : t(entry.reason === "start" ? "log.guard_restored.start" : "log.guard_restored", guard);
    } else {
      text = t.optional(`log.${entry.kind}`, guard) ?? entry.kind;
    }
    return typeof entry.problem === "string" ? `${text} ${t("log.guard.problem", { code: entry.problem })}` : text;
  }
  if (entry.kind === "automations_back" || entry.kind === "automations_taken") {
    // Joe stopped (his automations run again), or took them over again after the start.
    const names = Array.isArray(entry.names) ? entry.names.map((n) => `„${String(n)}“`).join(", ") : "";
    return t(`log.${entry.kind}`, { ...vars, names });
  }
  if (entry.kind === "day_buffer") {
    // The buffer of the grid-friendly morning: charging up to it again, or reached.
    return t(entry.fill ? "log.day_buffer.fill" : "log.day_buffer.hold", vars);
  }
  if (entry.kind === "day" && typeof entry.level === "number") {
    return t("log.day.buffer", vars);
  }
  if (entry.kind === "released" && entry.reason === "day_buffer") {
    return t("log.released.day_buffer", vars);
  }
  if (entry.kind === "surplus_end") {
    return t.optional(`log.surplus_end.${String(entry.reason)}`, vars) ?? t("log.surplus_end", vars);
  }
  if (entry.kind === "limit_ref_failed") {
    return t.optional(`log.limit_ref_failed.${String(entry.reason)}`, vars) ?? t("log.limit_ref_failed", vars);
  }
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
