import { css, html, nothing, type TemplateResult } from "lit";
import { displayTitle, swoosh } from "../../components/bits";
import { deviceCard, deviceState, entryCard, type DeviceCardData } from "../../components/device-card";
import { haOpen, type HaTarget } from "../../components/ha-open";
import "../../components/log";
import { logMatches, mergeLogs, type LogEntry, type LogFilter, type LogGroup } from "../../components/log";
import { tip } from "../../components/tip";
import { addRoute, GROUP_ICONS, type AddKind, type DeviceEntry, type Group } from "../../device-model";
import type { TipName, Translate } from "../../i18n";
import { href, onLink, type Route } from "../../router";
import type { HomeAssistant, JoeState } from "../../types";

// Every device page has the same order (plan 3.2): head (name, area, live
// value, "In HA öffnen", "Jetzt gilt … weil …") · Jetzt · Steuern · Strom ·
// Gelernt · Protokoll · Störenfriede · Weglassen. Sections without content
// are left out. Group pages share the card list and the "+" at their end.

export type FrameSection = "now" | "steer" | "power" | "learned" | "log" | "intruders" | "remove";
export const FRAME_SECTIONS: readonly FrameSection[] = ["now", "steer", "power", "learned", "log", "intruders", "remove"];

type Content = TemplateResult | string | typeof nothing | null | undefined;

export interface DeviceFrame {
  group: Group;
  name: string;
  area?: string;
  icon?: string;
  /** The live value in the head ("62 %", "21,5 °C · soll 22 °C"). */
  live?: Content;
  ha?: HaTarget;
  /** "Jetzt gilt … weil …" under the name. */
  why?: Content;
  /** Problems in Joe's words: warn notes in the head. */
  problems?: string[];
  /** More in the head (a main switch, chips). */
  head?: Content;
  now?: Content;
  steer?: Content;
  power?: Content;
  learned?: Content;
  /** Rückblick › Gelernt anchor for "Mehr im Rückblick →" (sun|battery|devices|hot_water|car|climate …). */
  learnedArea?: string;
  /** The device's last log entries; left out when none match. */
  log?: { entries: LogEntry[]; filter: LogFilter; names?: Record<string, string>; limit?: number };
  intruders?: Content;
  remove?: Content;
  /** Title of the last section when it deletes instead of leaving out (night actions: "Löschen"). */
  removeTitle?: string;
  /** A tooltip next to a section's title. */
  tips?: Partial<Record<FrameSection, TipName>>;
}

export interface FrameContext {
  t: Translate;
  prefix: string;
  hass?: HomeAssistant;
  state?: JoeState;
}

function filled(content: Content): content is TemplateResult | string {
  return content !== undefined && content !== null && content !== nothing && content !== "";
}

/** "← Speicher": a real link to the group page. */
export function backLink(t: Translate, prefix: string, group: Group): TemplateResult {
  const to: Route = { tab: "devices", section: group };
  return html`<a class="back-link" href=${href(prefix, to)} @click=${onLink(to)}
    >${t("nav.back", { name: t(`nav.devices.${group}`) })}</a
  >`;
}

/** The line a group page shows when the address names a device that is gone. */
export function notFound(t: Translate): TemplateResult {
  return html`<div class="note warn" role="status">
    <ha-icon icon="mdi:help-circle-outline"></ha-icon><span>${t("nav.not_found")}</span>
  </div>`;
}

/** Both logs from the state (the last entries), newest first; Rückblick › Protokoll has all. */
export function stateLog(state: JoeState | undefined): LogEntry[] {
  return mergeLogs(state?.control?.log ?? [], state?.climate?.log ?? []);
}

/** The head and the log filter of a device page, from its entry. */
export function frameFromEntry(ctx: FrameContext, entry: DeviceEntry): DeviceFrame {
  const group = entry.group === "grid" ? "joe" : entry.group;
  const state = deviceState(ctx.t, ctx.hass, ctx.state, entry);
  // The big live value is a reading; a status ("noch nicht eingerichtet", "ohne Zähler") goes in the grey line.
  const status = Boolean(entry.setup || entry.unassigned || entry.noMeter);
  return {
    group: entry.group,
    name: entry.name,
    area: entry.area,
    icon: entry.icon,
    live: status ? undefined : state,
    why: status ? state : undefined,
    ha: { deviceId: entry.deviceId, entityId: entry.entityId, name: entry.name },
    problems: entry.problems,
    log:
      entry.group === "grid"
        ? undefined
        : { entries: stateLog(ctx.state), filter: { group: group as LogGroup, device: entry.id } },
  };
}

/** Every "Gelernt" section explains what Joe learns there (by its Rückblick area). */
const LEARNED_TIPS: Record<string, TipName> = {
  battery: "learn_battery",
  car: "learn_car",
  hot_water: "learn_hot_water",
  devices: "learn_groups",
  climate: "learn_climate",
};

function section(ctx: FrameContext, frame: DeviceFrame, name: FrameSection, body: TemplateResult | string): TemplateResult {
  const { t } = ctx;
  const tipName = frame.tips?.[name] ?? (name === "learned" && frame.learnedArea ? LEARNED_TIPS[frame.learnedArea] : undefined);
  return html`<section class="card dsec" data-section=${name} ?data-tipped=${Boolean(tipName)}>
    <h3 class="dsec-title">${name === "remove" && frame.removeTitle ? frame.removeTitle : t(`devices.page.${name}`)}${tipName ? tip(t, tipName) : nothing}</h3>
    ${body}
  </section>`;
}

function logBody(ctx: FrameContext, frame: DeviceFrame): TemplateResult | undefined {
  const log = frame.log;
  if (!log || !log.entries.some((entry) => logMatches(ctx.state?.config, entry, log.filter))) {
    return undefined;
  }
  const filter = log.filter;
  const to: Route = {
    tab: "review",
    section: "log",
    id: filter.group ?? "all",
    sub: filter.group && filter.group !== "all" ? filter.device : undefined,
  };
  return html`<joe-log-list
      .t=${ctx.t}
      .hass=${ctx.hass}
      .config=${ctx.state?.config}
      .names=${log.names ?? {}}
      .entries=${log.entries}
      .filter=${filter}
      .limit=${log.limit ?? 5}
    ></joe-log-list>
    <a class="mini-btn quiet frame-more" href=${href(ctx.prefix, to)} @click=${onLink(to)}>${ctx.t("devices.page.more_log")}</a>`;
}

/** A device page: the back link, the head and the sections in their fixed order. */
export function deviceFrame(ctx: FrameContext, frame: DeviceFrame): TemplateResult {
  const { t, prefix } = ctx;
  const bodies: Partial<Record<FrameSection, TemplateResult | string>> = {};
  for (const name of FRAME_SECTIONS) {
    if (name === "log") {
      const body = logBody(ctx, frame);
      if (body) bodies.log = body;
      continue;
    }
    const content = frame[name];
    if (!filled(content)) continue;
    const to: Route = { tab: "review", section: "learned", id: frame.learnedArea };
    bodies[name] =
      name === "learned" && frame.learnedArea
        ? html`${content}
            <a class="mini-btn quiet frame-more" href=${href(prefix, to)} @click=${onLink(to)}>${t("devices.page.more_learned")}</a>`
        : content;
  }
  return html`<div class="dframe">
    ${backLink(t, prefix, frame.group)}
    <header class="card dhead">
      <div class="dhead-top">
        <ha-icon class="dhead-icon" icon=${frame.icon ?? GROUP_ICONS[frame.group]}></ha-icon>
        <div class="dhead-text">
          <h2 class="dhead-name">${frame.name}</h2>
          ${frame.area ? html`<span class="dhead-area">${frame.area}</span>` : nothing}
        </div>
        ${frame.ha ? haOpen(t, frame.ha) : nothing}
      </div>
      ${filled(frame.live) ? html`<p class="dhead-live">${frame.live}</p>` : nothing}
      ${filled(frame.why) ? html`<p class="dhead-why">${frame.why}</p>` : nothing}
      ${(frame.problems ?? []).map(
        (problem) => html`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${problem}</span></div>`,
      )}
      ${filled(frame.head) ? frame.head : nothing}
    </header>
    ${FRAME_SECTIONS.map((name) => (bodies[name] !== undefined ? section(ctx, frame, name, bodies[name]!) : nothing))}
  </div>`;
}

/** The cards of one group, in model order; a page may change a card (state, quick actions). */
export function groupCards(
  ctx: FrameContext,
  devices: DeviceEntry[],
  group: Group,
  change?: (entry: DeviceEntry) => Partial<DeviceCardData>,
): TemplateResult {
  const list = devices.filter((d) => d.group === group);
  return html`<div class="dcards">
    ${list.map((entry) => deviceCard(ctx.t, ctx.prefix, entryCard(ctx.t, ctx.hass, ctx.state, entry, change?.(entry))))}
  </div>`;
}

/**
 * The head of a group page, the same in every group: title with the swoosh,
 * the lead, and (when cards follow) what the round arrow button does.
 */
export function groupHead(t: Translate, title: string, lead: string, cards = true): TemplateResult {
  return html`<div class="group-intro">
    ${displayTitle(title)} ${swoosh}
    <p class="lead">${lead}</p>
    ${cards ? html`<p class="ha-hint with-tip" data-tipped>${t("climate.ha_open")} ${tip(t, "ha_open")}</p>` : nothing}
  </div>`;
}

/** "+ Hinzufügen" at the end of a group: opens the assistant as a sheet (back closes it). */
export function addLink(t: Translate, prefix: string, kind?: AddKind, label?: string): TemplateResult {
  const to = addRoute(kind);
  return html`<a class="btn btn-secondary add-link" href=${href(prefix, to)} @click=${onLink(to, { sheet: true })}
    ><ha-icon icon="mdi:plus"></ha-icon>${label ?? t("devices.add")}</a
  >`;
}

/** Styles of the frame, the group pages and the add link; add to a page's static styles. */
export const frameStyles = css`
  /* Group titles have one size in every group. */
  .display {
    font-size: clamp(30px, 4vw, 44px);
  }
  .group-intro {
    margin-bottom: 16px;
  }
  .ha-hint {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin: 8px 0 0;
    color: var(--joe-muted);
    font-size: 13px;
  }
  .dframe {
    max-width: 900px;
    margin: 0 auto;
  }
  .dhead {
    margin-top: 4px;
    display: grid;
    gap: 10px;
  }
  .dhead-top {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  .dhead-icon {
    --mdc-icon-size: 28px;
    margin-top: 4px;
    color: var(--joe-ink-2);
  }
  .dhead-text {
    flex: 1;
    min-width: 0;
    display: grid;
    gap: 2px;
  }
  .dhead-name {
    margin: 0;
    font-family: var(--joe-display);
    font-style: italic;
    font-weight: 800;
    font-size: clamp(26px, 4vw, 34px);
    line-height: 1.1;
    overflow-wrap: anywhere;
  }
  .dhead-area {
    color: var(--joe-muted);
    font-size: 14px;
  }
  .dhead-live {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }
  .dhead-why {
    margin: 0;
    color: var(--joe-ink-2);
  }
  .dsec {
    margin-top: 14px;
  }
  .dsec-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 10px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--joe-muted);
  }
  a.frame-more {
    min-height: 44px;
    margin-top: 6px;
    text-decoration: none;
  }
  a.add-link {
    min-height: 44px;
    text-decoration: none;
  }
`;
