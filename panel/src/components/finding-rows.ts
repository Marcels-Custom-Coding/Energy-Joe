import { css, html, nothing, type TemplateResult } from "lit";
import { isIgnored, pickEntity, saveConfig, sourceOf, suggestion, suggestions, withIgnored } from "../config";
import { entityName, formatNumber, formatState, measurementKw, sumKw } from "../entities";
import type { TipName, Translate } from "../i18n";
import type { Check, Discovery, HomeAssistant, JoeConfig, Measurement, Reason } from "../types";
import { flexibleConsumers } from "../types";
import { confidenceDots, reasonText, sourceChip } from "./bits";
import { checkText, tariffText } from "./texts";
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
  /** Plain navigation in the top right corner (e.g. "In HA öffnen"). */
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
  /* "In HA öffnen" sits top right, as on the device cards; notes below keep the full width. */
  li.item.has-aside {
    position: relative;
  }
  li.item.has-aside .head,
  li.item.has-aside .d {
    padding-right: 46px;
  }
  .row-aside {
    position: absolute;
    top: 8px;
    right: 8px;
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
  const aside = row.aside && row.aside !== nothing;
  return html`<li class="item ${row.state ?? ""} ${aside ? "has-aside" : ""}" ?data-tipped=${Boolean(row.actions?.length && row.tip)}>
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
        ? html`<div class="row-actions">${row.actions}${row.tip ? tip(t, row.tip) : nothing}</div>`
        : nothing}
    </div>
    ${aside ? html`<span class="row-aside">${row.aside}</span>` : nothing}
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

// --- Netz & Sonne: energy dashboard, tariff, forecast, grid, home, solar ---
// The same rows in the setup ("Umschauen", components/review.ts) and on
// Geräte › Netz & Sonne (pages/devices/grid.ts).

/** What the rows need: who sends the patches, and what Joe knows. */
export interface RowContext {
  /** Sends joe-config and joe-pick (it must be in the panel). */
  from: HTMLElement;
  hass: HomeAssistant;
  t: Translate;
  config: JoeConfig;
  discovery?: Discovery;
  checks: Check[];
  /** "In HA öffnen" beside a row's actions (pages); none in the setup. */
  aside?: (entity: string, name: string) => TemplateResult | typeof nothing;
}

export type CountWord =
  | "word.grid"
  | "word.solar"
  | "word.battery"
  | "word.device"
  | "word.plane"
  | "word.sensor"
  | "word.person"
  | "word.calendar";

/** "2 Sensoren" from "Sensor|Sensoren". */
export function countText(t: Translate, n: number, word: CountWord): string {
  const [one, other] = t(word).split("|");
  return `${formatNumber(t.lang, n, 0)} ${n === 1 ? one : other}`;
}

/** A check in Joe's words, with what can be done about it. */
export function checkNote(t: Translate, check: Check, actions: TemplateResult[] = []): TemplateResult {
  return html`<div class="note ${check.level}">
    <ha-icon icon=${check.level === "warn" ? "mdi:alert-outline" : "mdi:information-outline"}></ha-icon>
    <div>
      <span>${checkText(t, check)}</span>
      ${actions.length ? html`<div class="note-actions">${actions}</div>` : nothing}
    </div>
  </div>`;
}

function ignoreKey(from: HTMLElement, config: JoeConfig, key: string, patch: Record<string, unknown>): void {
  void saveConfig(from, { ...patch, answers: { ignored: withIgnored(config, key, true) } });
}

function confirmKey(from: HTMLElement, config: JoeConfig, key: string): void {
  const confirmed = config.answers.confirmed.filter((item) => item !== key);
  void saveConfig(from, { answers: { confirmed: [...confirmed, key] } });
}

/** What the Energy dashboard of Home Assistant holds (null: not set up). */
export function energyRow(ctx: RowContext): FindingRow | null {
  const { t } = ctx;
  const e = ctx.discovery?.energy_dashboard;
  if (!e?.configured) {
    return null;
  }
  return {
    key: "energy",
    icon: "mdi:lightning-bolt",
    title: t("find.energy"),
    detail: t("find.energy.detail", {
      grid: countText(t, e.grid ?? 0, "word.grid"),
      solar: countText(t, e.solar ?? 0, "word.solar"),
      battery: countText(t, e.battery ?? 0, "word.battery"),
      devices: countText(t, e.devices ?? 0, "word.device"),
    }),
    chips: [sourceChip(t, { source: "read" })],
  };
}

/** The tariff in one line; `actions` change it (a sheet in the setup, none where the form is open). */
export function tariffRow(ctx: RowContext, opts: { actions?: TemplateResult[]; missing?: string } = {}): FindingRow {
  const { t, config, discovery } = ctx;
  const tariff = config.tariff;
  const missing = tariff.kind === "unknown";
  return {
    key: "tariff",
    icon: "mdi:cash-clock",
    title: discovery?.tariff.provider ?? t("find.tariff"),
    detail: tariffText(t, tariff),
    chips: missing
      ? []
      : [
          sourceChip(t, sourceOf(config, "tariff.kind")),
          ...(discovery && discovery.tariff.kind !== "unknown" ? [confidenceDots(t, discovery.tariff.confidence)] : []),
        ],
    reasons: discovery?.tariff.reasons,
    notes: missing ? [infoNote(opts.missing ?? t("review.tariff.ask"))] : [],
    state: missing ? "missing" : undefined,
    tip: "review_tariff",
    actions: opts.actions,
  };
}

/** The solar forecast: used, left out (bring it back) or not found. */
export function forecastRow(ctx: RowContext): FindingRow {
  const { t, config, from } = ctx;
  const found = ctx.discovery?.forecast;
  const base = { key: "forecast", icon: "mdi:weather-sunny", title: t("find.forecast"), tip: "review_forecast" as TipName };
  if (config.forecast.provider) {
    return {
      ...base,
      detail: found
        ? t("find.forecast.detail", {
            provider: found.provider_name,
            planes: countText(t, found.planes, "word.plane"),
            today: found.today_kwh == null ? "–" : formatNumber(t.lang, found.today_kwh, 1),
            tomorrow: found.tomorrow_kwh == null ? "–" : formatNumber(t.lang, found.tomorrow_kwh, 1),
          })
        : config.forecast.provider,
      chips: [sourceChip(t, sourceOf(config, "forecast.provider")), ...(found ? [confidenceDots(t, found.confidence)] : [])],
      reasons: found?.reasons,
      actions: [
        rowButton(
          t("review.ignore"),
          "",
          () =>
            ignoreKey(from, config, "forecast", {
              forecast: { provider: null, config_entries: [], today: [], tomorrow: [], remaining_today: [], alternatives: [] },
            }),
          true,
        ),
      ],
    };
  }
  if (isIgnored(config, "forecast") && found) {
    return {
      ...base,
      detail: t("review.ignored"),
      state: "ignored",
      actions: [rowButton(t("review.use"), "mdi:undo-variant", () => useForecast(ctx))],
    };
  }
  return { ...base, detail: t("find.none"), state: "missing", notes: [infoNote(t("review.forecast.none"))], tip: undefined };
}

/** Takes the forecast Joe found (again), with the other sources to learn from. */
export function useForecast(ctx: RowContext): void {
  const found = ctx.discovery?.forecast;
  if (!found) {
    return;
  }
  void saveConfig(
    ctx.from,
    {
      forecast: {
        provider: found.provider,
        config_entries: found.config_entries ?? [],
        today: found.today ?? [],
        tomorrow: found.tomorrow ?? [],
        remaining_today: found.remaining_today ?? [],
        alternatives: (found.others ?? []).map((other) => ({
          id: other.provider,
          name: other.provider_name,
          provider: other.provider,
          tomorrow: other.tomorrow,
        })),
      },
      answers: { ignored: withIgnored(ctx.config, "forecast", false) },
    },
    "read",
  );
}

export type PowerRole = "grid_power" | "home_power";

/**
 * The grid meter or the home's consumption: the sensor, its live value and
 * what the checks say (Umdrehen, Stimmt so). `devices` is the jump to the
 * meters ("Geräte zuordnen →") where there is one.
 */
export function powerRow(ctx: RowContext, role: PowerRole, opts: { devices?: TemplateResult } = {}): FindingRow {
  const { from, hass, t, config } = ctx;
  const m = config.measurements[role];
  const found = ctx.discovery?.measurements[role] ?? null;
  const grid = role === "grid_power";
  const base = {
    key: role,
    icon: grid ? "mdi:transmission-tower" : "mdi:home-lightning-bolt-outline",
    title: t(grid ? "find.grid" : "find.home"),
    tip: (grid ? "review_grid" : "review_home") as TipName,
  };
  const pick = rowButton(t(m ? "review.change" : "review.choose"), "mdi:magnify", () => void pickPower(ctx, role));
  const devices = opts.devices ? [opts.devices] : [];
  if (!m && !grid && config.measurements.grid_power) {
    // No consumption sensor needed: worked out like the Energy dashboard.
    return { ...base, detail: t("review.home.balance"), notes: homeNotes(t, config), actions: [pick, ...devices] };
  }
  if (!m) {
    if (isIgnored(config, role)) {
      return { ...base, detail: t("review.home.computed"), state: "ignored", actions: [pick] };
    }
    return {
      ...base,
      detail: t("find.none"),
      state: "missing",
      notes: [infoNote(t(grid ? "review.grid.none" : "review.home.none"))],
      actions: grid
        ? [pick]
        : [
            pick,
            rowButton(t("review.home.without"), "", () => ignoreKey(from, config, "home_power", { measurements: { home_power: null } }), true),
          ],
    };
  }
  const kw = measurementKw(hass, m);
  let live = formatState(hass, m.entity_id, t.lang);
  if (kw !== null) {
    const value = formatNumber(t.lang, Math.abs(kw), 2);
    live = grid ? t(kw >= 0 ? "live.import" : "live.export", { value }) : t("live.kw", { value: formatNumber(t.lang, kw, 2) });
  }
  const checks = ctx.checks.filter(
    (c) => c.code !== "missing" && (c.role === role || (grid && c.code === "grid_sign") || (!grid && c.code === "home_negative")),
  );
  const invert = () => setPower(from, role, { ...m, invert: !m.invert });
  const notes = checks.map((c) => {
    if (c.code === "grid_sign") {
      return checkNote(t, c, [
        rowButton(t("review.invert"), "mdi:swap-vertical", invert),
        rowButton(t("review.keep"), "mdi:check", () => confirmKey(from, config, `grid_sign:${m.entity_id}`), true),
      ]);
    }
    if (c.code === "home_negative") {
      return checkNote(t, c, [rowButton(t("review.invert"), "mdi:swap-vertical", invert)]);
    }
    return checkNote(t, c);
  });
  const flag = checks.some((c) => c.level === "warn") ? ("flag" as const) : undefined;
  const name = entityName(hass, m.entity_id);
  const same = found?.entity.entity_id === m.entity_id;
  if (!grid && config.measurements.grid_power) {
    // Worked out like the Energy dashboard; the sensor is there to compare.
    return {
      ...base,
      detail: `${t("review.home.balance")} · ${t("review.home.compare", { name, live })}`,
      chips: [sourceChip(t, sourceOf(config, `measurements.${role}`))],
      notes: [...homeNotes(t, config), ...notes],
      state: flag,
      aside: ctx.aside?.(m.entity_id, name),
      actions: [
        pick,
        ...devices,
        rowButton(t("review.ignore"), "", () => ignoreKey(from, config, "home_power", { measurements: { home_power: null } }), true),
      ],
    };
  }
  return {
    ...base,
    detail: `${name} · ${live}`,
    chips: [sourceChip(t, sourceOf(config, `measurements.${role}`)), ...(found && same ? [confidenceDots(t, found.confidence)] : [])],
    reasons: same ? found?.reasons : undefined,
    notes,
    state: flag,
    aside: ctx.aside?.(m.entity_id, name),
    actions: [pick, ...devices],
  };
}

/** What Joe leaves out for the battery, and how far the consumption sensor is off. */
function homeNotes(t: Translate, config: JoeConfig): TemplateResult[] {
  const notes: TemplateResult[] = [];
  const flexible = flexibleConsumers(config.consumers);
  if (flexible.length) {
    const names = flexible
      .map((c) => (c.kind === "ev" || c.runs === "always" || !c.runs ? c.name : `${c.name} (${t(`runs.${c.runs}`)})`))
      .join(", ");
    notes.push(infoNote(t(flexible.some((c) => c.kind === "ev") ? "review.home.flexible" : "review.home.flexible_some", { names })));
  } else if (config.consumers.some((c) => c.kind !== "submeter")) {
    notes.push(infoNote(t("review.home.flexible_none")));
  }
  const check = config.learned.home_check;
  if (check && check.calc_kwh > 0) {
    const off = (check.sensor_kwh - check.calc_kwh) / check.calc_kwh;
    if (Math.abs(off) >= 0.1) {
      notes.push(
        infoNote(
          t("review.home.off", {
            days: check.days,
            pct: formatNumber(t.lang, Math.abs(off) * 100, 0),
            direction: t(off < 0 ? "review.home.less" : "review.home.more"),
          }),
        ),
      );
    }
  }
  return notes;
}

/** Picks the grid meter or the consumption sensor (with Joe's suggestions and "count the other way"). */
export async function pickPower(ctx: RowContext, role: PowerRole): Promise<void> {
  const { t, config } = ctx;
  const m = config.measurements[role];
  const found = ctx.discovery?.measurements[role];
  const grid = role === "grid_power";
  const picked = await pickEntity(ctx.from, {
    heading: t(grid ? "pick.grid.title" : "pick.home.title"),
    tip: grid ? "pick_grid" : "pick_home",
    filter: "power",
    selected: m ? [m.entity_id] : [],
    suggestions: suggestions(found ? [suggestion(found)] : [], found?.alternatives),
    measurement: { invert: m?.invert ?? found?.measurement.invert ?? false, role: grid ? "grid" : "home" },
  });
  const entity = picked?.selected[0];
  if (!picked || !entity) {
    return;
  }
  const patch: Record<string, unknown> = {
    measurements: { [role]: { entity_id: entity, invert: picked.invert, minus_entity_id: null } },
  };
  if (isIgnored(config, role)) {
    patch.answers = { ignored: withIgnored(config, role, false) };
  }
  void saveConfig(ctx.from, patch);
}

function setPower(from: HTMLElement, role: PowerRole, measurement: Measurement): void {
  void saveConfig(from, { measurements: { [role]: measurement } });
}

/** The PV power: one or more sensors, added up; "Hab keine PV" leaves it out. */
export function solarRow(ctx: RowContext): FindingRow {
  const { from, hass, t, config } = ctx;
  const list = config.measurements.solar_power;
  const found = ctx.discovery?.measurements.solar_power ?? null;
  const base = { key: "solar_power", icon: "mdi:solar-panel", title: t("find.solar"), tip: "review_solar" as TipName };
  const pick = (label: string) => rowButton(label, "mdi:magnify", () => void pickSolar(ctx));
  if (!list.length) {
    if (isIgnored(config, "solar_power")) {
      return { ...base, detail: t("review.solar.without"), state: "ignored", actions: [pick(t("review.choose"))] };
    }
    return {
      ...base,
      detail: t("find.none"),
      state: "missing",
      actions: [
        pick(t("review.choose")),
        rowButton(t("review.solar.none"), "", () => ignoreKey(from, config, "solar_power", { measurements: { solar_power: [] } }), true),
      ],
    };
  }
  const total = sumKw(hass, list);
  const checks = ctx.checks.filter((c) => c.role === "solar_power" && c.code !== "missing");
  const single = list.length === 1 ? list[0].entity_id : undefined;
  return {
    ...base,
    detail: t("find.solar.detail", {
      count: countText(t, list.length, "word.sensor"),
      total: total === null ? "–" : formatNumber(t.lang, total, 2),
    }),
    chips: [sourceChip(t, sourceOf(config, "measurements.solar_power")), ...(found ? [confidenceDots(t, found.confidence)] : [])],
    reasons: found?.reasons,
    notes: checks.map((c) => checkNote(t, c)),
    state: checks.some((c) => c.level === "warn") ? "flag" : undefined,
    aside: single ? ctx.aside?.(single, entityName(hass, single)) : undefined,
    actions: [pick(t("review.change"))],
  };
}

/** Picks the PV power sensors (several are added up). */
export async function pickSolar(ctx: RowContext): Promise<void> {
  const { t, config } = ctx;
  const current = config.measurements.solar_power;
  const found = ctx.discovery?.measurements.solar_power;
  const picked = await pickEntity(ctx.from, {
    heading: t("pick.solar.title"),
    tip: "pick_solar",
    filter: "power",
    multiple: true,
    selected: current.map((m) => m.entity_id),
    suggestions: suggestions(
      (found?.entities ?? []).map((entity) => ({ entity_id: entity.entity_id, confidence: found?.confidence, reasons: found?.reasons })),
      found?.alternatives,
    ),
  });
  if (!picked) {
    return;
  }
  const patch: Record<string, unknown> = {
    measurements: {
      solar_power: picked.selected.map(
        (id) => current.find((m) => m.entity_id === id) ?? { entity_id: id, invert: false, minus_entity_id: null },
      ),
    },
  };
  if (isIgnored(config, "solar_power")) {
    patch.answers = { ignored: withIgnored(config, "solar_power", false) };
  }
  void saveConfig(ctx.from, patch);
}
