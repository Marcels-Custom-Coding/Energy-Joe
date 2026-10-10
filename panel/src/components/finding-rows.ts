import { css, html, nothing, type TemplateResult } from "lit";
import { isIgnored, pickEntity, saveConfig, sourceOf, suggestion, suggestions, withIgnored } from "../config";
import { entityName } from "../entities";
import type { TipName, Translate } from "../i18n";
import type { Discovery, HomeAssistant, JoeConfig, Reason } from "../types";
import { confidenceDots, reasonText, sourceChip } from "./bits";
import { tip } from "./tip";

/** One thing Joe found and uses: an entity, a reading, a part of the household. */
export interface FindingRow {
  key: string;
  icon: string;
  title: string;
  detail: string;
  chips?: TemplateResult[];
  reasons?: Reason[];
  notes?: TemplateResult[];
  actions?: TemplateResult[];
  tip?: TipName;
  state?: "missing" | "ignored" | "flag";
  /** Something left of the actions that is plain navigation (e.g. "In HA öffnen"). */
  aside?: TemplateResult | typeof nothing;
}

/** Styles of the rows (for every component that renders them). */
export const findingStyles = css`
  ul.found {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 8px;
  }
  li.item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 14px;
    border-radius: 12px;
    background: var(--joe-surface);
    box-shadow: inset 0 0 0 1px var(--joe-line);
  }
  li.item.missing,
  li.item.ignored {
    background: transparent;
    box-shadow: inset 0 0 0 1.5px var(--joe-line-2);
  }
  li.item.flag {
    box-shadow: inset 0 0 0 2px var(--joe-warn);
  }
  .ico-box {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: var(--joe-surface-2);
    display: grid;
    place-items: center;
    flex: none;
    color: var(--joe-ink);
  }
  .missing .ico-box,
  .ignored .ico-box {
    color: var(--joe-muted);
  }
  li.item .text {
    min-width: 0;
    flex: 1;
  }
  li.item .head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px 12px;
    flex-wrap: wrap;
  }
  li.item .t {
    font-weight: 700;
    line-height: 1.3;
  }
  .ignored .t {
    color: var(--joe-ink-2);
  }
  li.item .chips {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  li.item .d {
    font-size: 13.5px;
    color: var(--joe-ink-2);
    margin-top: 2px;
    overflow-wrap: anywhere;
  }
  .missing .d,
  .ignored .d {
    color: var(--joe-muted);
  }
  li.item details {
    margin-top: 6px;
    font-size: 13px;
    color: var(--joe-ink-2);
  }
  li.item summary {
    cursor: pointer;
    font-weight: 600;
    color: var(--joe-ink);
    width: fit-content;
  }
  li.item details ul {
    margin: 4px 0 0;
    padding-left: 18px;
  }
  li.item .note {
    margin-top: 8px;
  }
  .row-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    margin-top: 10px;
  }
  .row-actions joe-tip {
    margin-left: 2px;
  }
  @media (pointer: coarse) {
    /* 44 px to tap, but still a list item so the ▶ marker stays. */
    li.item summary {
      display: list-item;
      box-sizing: border-box;
      min-height: 44px;
      min-width: 44px;
      padding-block: 12px;
      line-height: 20px;
    }
  }
`;

/** A small row action ("Ändern", "Weglassen"). */
export function rowButton(label: string, icon: string, onClick: () => void, quiet = false): TemplateResult {
  return html`<button type="button" class="mini-btn ${quiet ? "quiet" : ""}" @click=${onClick}>
    ${icon ? html`<ha-icon icon=${icon}></ha-icon>` : nothing}${label}
  </button>`;
}

/** A note in a row: what the thing is good for. */
export function infoNote(text: string): TemplateResult {
  return html`<div class="note"><ha-icon icon="mdi:information-outline"></ha-icon><span>${text}</span></div>`;
}

export function findingRow(t: Translate, row: FindingRow): TemplateResult {
  return html`<li class="item ${row.state ?? ""}" ?data-tipped=${Boolean(row.actions?.length && row.tip)}>
    <span class="ico-box"><ha-icon icon=${row.icon}></ha-icon></span>
    <div class="text">
      <div class="head">
        <span class="t">${row.title}</span>
        ${row.chips?.length ? html`<span class="chips">${row.chips}</span>` : nothing}
      </div>
      <div class="d">${row.detail}</div>
      ${row.reasons?.length
        ? html`<details data-notip>
            <summary>${t("scan.why")}</summary>
            <ul>
              ${row.reasons.map((reason) => html`<li>${reasonText(t, reason)}</li>`)}
            </ul>
          </details>`
        : nothing}
      ${row.notes ?? nothing}
      ${row.actions?.length
        ? html`<div class="row-actions">${row.aside ?? nothing}${row.actions}${row.tip ? tip(t, row.tip) : nothing}</div>`
        : nothing}
    </div>
  </li>`;
}

/** Rows as a list. */
export function findingList(t: Translate, rows: FindingRow[]): TemplateResult {
  return html`<ul class="found">
    ${rows.map((row) => findingRow(t, row))}
  </ul>`;
}

// --- Weather and holidays ---

export type ContextKind = "weather" | "holiday";

const CONTEXT_KEY = { weather: "weather_entity", holiday: "holiday_entity" } as const;

/**
 * The weather entity or the workday sensor: what is used, change it, leave it
 * out, or choose one. Changes are sent through `from` (it must be in the panel).
 */
export function contextRow(
  from: HTMLElement,
  hass: HomeAssistant,
  t: Translate,
  config: JoeConfig,
  discovery: Discovery | undefined,
  kind: ContextKind,
  aside?: (entity: string) => TemplateResult | typeof nothing,
): FindingRow {
  const key = CONTEXT_KEY[kind];
  const entity = config.context[key];
  const found = discovery?.[kind] ?? null;
  const base = {
    key: kind,
    icon: kind === "weather" ? "mdi:weather-partly-cloudy" : "mdi:calendar-star",
    title: t(kind === "weather" ? "find.weather" : "find.holiday"),
    tip: (kind === "weather" ? "review_weather" : "review_holiday") as TipName,
  };
  const pick = () => void pickContext(from, t, config, discovery, kind);
  if (entity) {
    const same = found?.entity.entity_id === entity;
    return {
      ...base,
      detail: entityName(hass, entity),
      chips: [sourceChip(t, sourceOf(config, `context.${key}`)), ...(found && same ? [confidenceDots(t, found.confidence)] : [])],
      reasons: same ? found?.reasons : undefined,
      aside: aside?.(entity),
      actions: [
        rowButton(t("review.change"), "mdi:magnify", pick),
        rowButton(
          t("review.ignore"),
          "",
          () => saveConfig(from, { context: { [key]: null }, answers: { ignored: withIgnored(config, kind, true) } }),
          true,
        ),
      ],
    };
  }
  if (isIgnored(config, kind)) {
    return {
      ...base,
      detail: t("review.ignored"),
      state: "ignored",
      actions: [rowButton(t("review.use"), "mdi:undo-variant", pick)],
    };
  }
  return {
    ...base,
    detail: t("find.none"),
    state: "missing",
    notes: [infoNote(t(kind === "weather" ? "review.weather.none" : "review.holiday.none"))],
    actions: [rowButton(t("review.choose"), "mdi:magnify", pick)],
  };
}

export async function pickContext(
  from: HTMLElement,
  t: Translate,
  config: JoeConfig,
  discovery: Discovery | undefined,
  kind: ContextKind,
): Promise<void> {
  const key = CONTEXT_KEY[kind];
  const found = discovery?.[kind];
  const current = config.context[key];
  const picked = await pickEntity(from, {
    heading: t(kind === "weather" ? "pick.weather.title" : "pick.holiday.title"),
    tip: kind === "weather" ? "pick_weather" : "pick_holiday",
    filter: kind === "weather" ? "weather" : "workday",
    selected: current ? [current] : found ? [found.entity.entity_id] : [],
    suggestions: suggestions(found ? [suggestion(found)] : [], found?.alternatives),
  });
  const entity = picked?.selected[0];
  if (!entity) {
    return;
  }
  saveConfig(from, {
    context: { [key]: entity },
    answers: { ignored: withIgnored(config, kind, false) },
  });
}
