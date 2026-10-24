import { css, html, nothing, type TemplateResult } from "lit";
import { sourceChip } from "./components/bits";
import "./components/choice";
import { euroText } from "./components/plan-text";
import { tip } from "./components/tip";
import { saveConfig, sourceOf } from "./config";
import { formatNumber } from "./entities";
import type { Translate, TranslationKey } from "./i18n";
import type {
  ControlView,
  DayCaution,
  DischargeMode,
  JoeConfig,
  JoeInfo,
  MorningBuffer,
  NightCaution,
  Plan,
  PriorityItem,
  Rules,
} from "./types";

// Joe's rules: one row per rule (Einstellungen › Regeln) and the same
// formatting for mirrors elsewhere ("Sicherheitspuffer · 120 %").

export type NumberRuleKey =
  | "reserve_soc"
  | "max_target_soc"
  | "evening_min_soc"
  | "grid_limit_w"
  | "max_night_kwh"
  | "plan_offset_min"
  | "reset_lead_min"
  | "buffer_factor"
  | "max_price"
  | "min_saving"
  | "balance_days";

/** Rules with a row of their own (switches, order, choice). */
export type OtherRuleKey =
  | "guard_grid"
  | "priority"
  | "discharge_in_window"
  | "converter_losses"
  | "day_surplus"
  | "morning_buffer"
  | "transfer_guard"
  | "night_caution";
export type RuleKey = NumberRuleKey | OtherRuleKey;

export interface NumberRule {
  key: NumberRuleKey;
  /** Empty: the unit is a text of its own (rule.<key>.unit). */
  unit: string;
  min: number;
  max: number;
  step: number;
  /** Shown value = stored value × scale (W → kW, factor → %). */
  scale?: number;
  optional?: boolean;
  /** Whole numbers only (minutes, days). */
  integer?: boolean;
}

export const NUMBER_RULES: Record<NumberRuleKey, NumberRule> = {
  reserve_soc: { key: "reserve_soc", unit: "%", min: 0, max: 100, step: 1 },
  max_target_soc: { key: "max_target_soc", unit: "%", min: 0, max: 100, step: 1 },
  evening_min_soc: { key: "evening_min_soc", unit: "%", min: 0, max: 100, step: 1, optional: true },
  grid_limit_w: { key: "grid_limit_w", unit: "kW", min: 0.1, max: 1000, step: 0.1, scale: 0.001, optional: true },
  max_night_kwh: { key: "max_night_kwh", unit: "kWh", min: 0.1, max: 1000, step: 0.1, optional: true },
  buffer_factor: { key: "buffer_factor", unit: "%", min: 0, max: 300, step: 1, scale: 100 },
  plan_offset_min: { key: "plan_offset_min", unit: "min", min: 0, max: 180, step: 1, integer: true },
  reset_lead_min: { key: "reset_lead_min", unit: "min", min: 0, max: 60, step: 1, integer: true },
  max_price: { key: "max_price", unit: "ct/kWh", min: 0, max: 1000, step: 0.1, scale: 100, optional: true },
  min_saving: { key: "min_saving", unit: "ct", min: 0, max: 500, step: 1, scale: 100 },
  balance_days: { key: "balance_days", unit: "", min: 3, max: 90, step: 1, optional: true, integer: true },
};

/** The groups of Einstellungen › Regeln, in their order. */
export type RuleGroup = "battery" | "grid" | "plan";

export const RULE_GROUPS: Record<RuleGroup, readonly RuleKey[]> = {
  battery: [
    "reserve_soc",
    "max_target_soc",
    "evening_min_soc",
    "balance_days",
    "discharge_in_window",
    "converter_losses",
    "day_surplus",
    "morning_buffer",
    "transfer_guard",
  ],
  grid: ["grid_limit_w", "max_night_kwh", "guard_grid", "max_price", "min_saving"],
  plan: ["priority", "night_caution", "buffer_factor", "plan_offset_min", "reset_lead_min"],
};

/** All rules, in the order of Einstellungen › Regeln. */
export const RULE_ORDER: readonly RuleKey[] = [...RULE_GROUPS.battery, ...RULE_GROUPS.grid, ...RULE_GROUPS.plan];

const DISCHARGE: DischargeMode[] = ["until_target", "block", "free"];
const CAUTIONS: DayCaution[] = ["tight", "normal", "careful"];
/** From "count on the typical day" to "plan almost for the bad one" (plan/planner.py weights). */
export const NIGHT_CAUTIONS: NightCaution[] = ["bold", "brave", "balanced", "careful", "cautious"];

export function isRuleKey(key: string): key is RuleKey {
  return (RULE_ORDER as readonly string[]).includes(key);
}

function isNumberRule(key: RuleKey): key is NumberRuleKey {
  return key in NUMBER_RULES;
}

/** The unit as shown ("kW", "Tage"). */
export function ruleUnit(t: Translate, rule: NumberRule): string {
  return rule.unit || t(`rule.${rule.key}.unit` as TranslationKey);
}

/** A stored value as the user sees it (0.0042 € → 0.42 ct), or "" when off. */
export function shownNumber(rule: NumberRule, stored: number | null | undefined): string {
  return stored == null ? "" : String(Math.round(stored * (rule.scale ?? 1) * 100) / 100);
}

/** A rule's value as text for mirrors: "120 %", "aus", "E-Auto · Warmwasser · Speicher". */
export function ruleValue(t: Translate, config: JoeConfig, key: RuleKey): string {
  const rules = config.rules;
  if (isNumberRule(key)) {
    const rule = NUMBER_RULES[key];
    const stored = rules[key];
    if (stored == null) {
      return t("rule.off");
    }
    const value = Math.round(stored * (rule.scale ?? 1) * 100) / 100;
    const digits = Number.isInteger(value) ? 0 : Number.isInteger(value * 10) ? 1 : 2;
    return `${formatNumber(t.lang, value, digits)} ${ruleUnit(t, rule)}`;
  }
  switch (key) {
    case "priority":
      return rules.priority.map((item) => t(`rule.priority.${item}`)).join(" · ");
    case "discharge_in_window":
      return t(`rule.discharge.${rules.discharge_in_window}`);
    case "day_surplus":
      return rules.day_surplus ? `${t("rule.on")} · ${t(`rule.day_caution.${rules.day_caution}`)}` : t("rule.off");
    case "transfer_guard":
      return t(rules.transfer_guard !== false ? "rule.on" : "rule.off");
    case "night_caution":
      return t(`rule.night_caution.${rules.night_caution ?? "brave"}`);
    case "morning_buffer":
      return rules.morning_buffer_soc == null
        ? t("rule.morning_buffer.auto")
        : `${formatNumber(t.lang, rules.morning_buffer_soc, 0)} %`;
    default:
      return t(rules[key] ? "rule.on" : "rule.off");
  }
}

/**
 * One rule as a settings row: label, hint, (i), source chip and its control.
 * Saves right away; the row carries data-anchor=<key> for /settings/rules/<key>.
 */
export function ruleRow(
  t: Translate,
  host: HTMLElement,
  config: JoeConfig,
  info: JoeInfo | undefined,
  key: RuleKey,
  control?: ControlView,
  plan?: Plan | null,
): TemplateResult {
  if (isNumberRule(key)) {
    const extra = key === "grid_limit_w" ? peakLine(t, host, config, control) : nothing;
    return numberRow(t, host, config, info, NUMBER_RULES[key], extra);
  }
  switch (key) {
    case "guard_grid":
      return guardRow(t, host, config);
    case "converter_losses":
      return converterRow(t, host, config);
    case "priority":
      return priorityRow(t, host, config);
    case "discharge_in_window":
      return dischargeRow(t, host, config);
    case "day_surplus":
      return daySurplusRow(t, host, config);
    case "transfer_guard":
      return transferGuardRow(t, host, config);
    case "morning_buffer":
      return morningBufferRow(t, host, config, plan);
    case "night_caution":
      return nightCautionRow(t, host, config);
  }
}

/** The buffer of the grid-friendly morning as the plan has it (tonight's, else this morning's). */
export function morningBuffer(plan: Plan | null | undefined): MorningBuffer | null {
  return plan?.morning_buffer ?? plan?.morning?.day?.buffer ?? null;
}

/** The highest own buffer one can set (%): above it holding back hardly leaves anything for the grid. */
const MORNING_BUFFER_MAX = 90;

/**
 * The buffer of the grid-friendly morning: automatic (Joe's suggestion from
 * what a morning needs beyond the sun) or one's own level (planner.morning_buffer).
 */
function morningBufferRow(t: Translate, host: HTMLElement, config: JoeConfig, plan?: Plan | null): TemplateResult {
  const rules = config.rules;
  const buffer = morningBuffer(plan);
  const own = rules.morning_buffer_soc != null;
  const suggested = buffer?.suggested;
  const on = rules.grid_friendly;
  const vars = {
    soc: formatNumber(t.lang, own ? (rules.morning_buffer_soc ?? 0) : (suggested ?? 0), 0),
    kwh: formatNumber(t.lang, buffer?.need_kwh ?? 0, 1),
  };
  const hint = !on
    ? t("rule.morning_buffer.off_hint")
    : own
      ? t("rule.morning_buffer.own_hint", vars)
      : suggested == null
        ? t("rule.morning_buffer.pending_hint")
        : buffer?.source === "learned"
          ? t("rule.morning_buffer.learned_hint", vars)
          : t("rule.morning_buffer.start_hint", vars);
  const setOwn = (input: HTMLInputElement) => {
    const value = Number.parseFloat(input.value.trim());
    if (!Number.isFinite(value) || value < 0 || value > MORNING_BUFFER_MAX) {
      input.reportValidity();
      return;
    }
    saveConfig(host, { rules: { morning_buffer_soc: Math.round(value) } });
  };
  return html`<div class="row stacked" data-tipped data-anchor="morning_buffer">
    <div>
      <div class="name">
        <b id="morning-buffer">${t("rule.morning_buffer")}</b>${tip(t, "r_morning_buffer")}
        ${sourceChip(t, sourceOf(config, "rules.morning_buffer_soc"))}
      </div>
      <small>${hint}</small>
    </div>
    <div class="buffer-control">
      <div class="seg" role="group" aria-labelledby="morning-buffer">
        <button
          type="button"
          aria-pressed=${String(!own)}
          ?disabled=${!on}
          @click=${() => saveConfig(host, { rules: { morning_buffer_soc: null } }, "default")}
        >
          ${suggested == null
            ? t("rule.morning_buffer.auto")
            : t("rule.morning_buffer.auto_n", { soc: formatNumber(t.lang, suggested, 0) })}
        </button>
        <button
          type="button"
          aria-pressed=${String(own)}
          ?disabled=${!on}
          @click=${() =>
            own ? undefined : saveConfig(host, { rules: { morning_buffer_soc: suggested ?? Math.max(30, rules.reserve_soc) } })}
        >
          ${t("rule.morning_buffer.own")}
        </button>
      </div>
      ${tip(t, own ? "r_morning_buffer_own" : "r_morning_buffer_auto")}
      ${own
        ? html`<span class="unit-input">
            <input
              class="input"
              type="number"
              inputmode="numeric"
              min="0"
              max=${MORNING_BUFFER_MAX}
              step="1"
              aria-label=${t("rule.morning_buffer.own_label")}
              ?disabled=${!on}
              .value=${String(rules.morning_buffer_soc ?? "")}
              @change=${(ev: Event) => setOwn(ev.target as HTMLInputElement)}
            />
            <span class="unit">%</span>
          </span>`
        : nothing}
    </div>
  </div>`;
}

/** Days Joe measures before the highest import counts as the grid limit (plan/inputs.py PEAK_DAYS). */
const PEAK_DAYS = 7;

/**
 * Below the grid limit: the highest import Joe measured, what he does with it
 * without the user's limit, and "Übernehmen" to take it as the limit.
 */
function peakLine(t: Translate, host: HTMLElement, config: JoeConfig, control?: ControlView): TemplateResult | typeof nothing {
  const peak = control?.grid_peak;
  if (!peak?.w) {
    return nothing;
  }
  const kw = Math.ceil(peak.w / 100) / 10;
  const since = new Date(peak.since);
  const date = new Intl.DateTimeFormat(t.lang, { day: "numeric", month: "long" }).format(since);
  const ready = Date.now() - since.getTime() >= PEAK_DAYS * 24 * 3600 * 1000;
  const own = config.rules.grid_limit_w != null;
  const key = own ? "rule.grid_limit_w.measured_own" : ready ? "rule.grid_limit_w.measured" : "rule.grid_limit_w.measuring";
  return html`<div class="peak">
    <small>${t(key, { kw: formatNumber(t.lang, kw, 1), date })}</small>${tip(t, "r_grid_peak")}
    ${own
      ? nothing
      : html`<button
          type="button"
          class="mini-btn quiet"
          @click=${() => saveConfig(host, { rules: { grid_limit_w: Math.round(kw * 1000) } })}
        >
          ${t("rule.grid_limit_w.take", { kw: formatNumber(t.lang, kw, 1) })}
        </button>`}
  </div>`;
}

function numberRow(
  t: Translate,
  host: HTMLElement,
  config: JoeConfig,
  info: JoeInfo | undefined,
  rule: NumberRule,
  extra: TemplateResult | typeof nothing = nothing,
): TemplateResult {
  const fallback = info?.defaults?.rules[rule.key];
  const provenance = sourceOf(config, `rules.${rule.key}`);
  const changed = provenance?.source === "user";
  return html`<div class="row" data-tipped data-anchor=${rule.key}>
    <div>
      <div class="name"><b>${t(`rule.${rule.key}`)}</b>${tip(t, `r_${rule.key}`)}</div>
      <small>${t(`rule.${rule.key}.hint`)}</small>
      ${extra}
    </div>
    <div class="control">
      ${sourceChip(t, provenance)}
      <span class="unit-input">
        <input
          class="input"
          type="number"
          inputmode="decimal"
          min=${rule.min}
          max=${rule.max}
          step=${rule.step}
          aria-label=${t(`rule.${rule.key}`)}
          placeholder=${rule.optional ? t("rule.off") : ""}
          .value=${shownNumber(rule, config.rules[rule.key])}
          @change=${(ev: Event) => setNumber(host, rule, ev.target as HTMLInputElement)}
        />
        <span class="unit">${ruleUnit(t, rule)}</span>
      </span>
      ${changed && fallback !== undefined
        ? html`<button
            type="button"
            class="mini-btn quiet"
            @click=${() => saveConfig(host, { rules: { [rule.key]: fallback } }, "default")}
          >
            <ha-icon icon="mdi:restore"></ha-icon>${t("rule.reset")}
          </button>`
        : nothing}
    </div>
  </div>`;
}

function setNumber(host: HTMLElement, rule: NumberRule, input: HTMLInputElement): void {
  const raw = input.value.trim();
  const scale = rule.scale ?? 1;
  if (raw === "") {
    if (rule.optional) {
      saveConfig(host, { rules: { [rule.key]: null } });
    }
    return;
  }
  const value = Number.parseFloat(raw);
  if (!Number.isFinite(value) || value < rule.min || value > rule.max) {
    input.reportValidity();
    return;
  }
  const stored = rule.integer ? Math.round(value) : Math.round((value / scale) * 10000) / 10000;
  saveConfig(host, { rules: { [rule.key]: stored } });
}

/** Protect the main fuse: pause charging while the house draws more than the limit. */
function guardRow(t: Translate, host: HTMLElement, config: JoeConfig): TemplateResult {
  const rules = config.rules;
  const limit = rules.grid_limit_w;
  return html`<div class="row" data-tipped data-anchor="guard_grid">
    <div>
      <div class="name"><b id="guard-grid">${t("rule.guard_grid")}</b>${tip(t, "r_guard_grid")}</div>
      <small>${t(limit ? "rule.guard_grid.hint" : "rule.guard_grid.no_limit")}</small>
    </div>
    <div class="control">
      ${sourceChip(t, sourceOf(config, "rules.guard_grid"))}
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${String(rules.guard_grid)}
        aria-labelledby="guard-grid"
        ?disabled=${!limit}
        @click=${() => saveConfig(host, { rules: { guard_grid: !rules.guard_grid } })}
      ></button>
    </div>
  </div>`;
}

/** Expert: the inverter's losses when charging from the grid, measured at the grid meter. */
function converterRow(t: Translate, host: HTMLElement, config: JoeConfig): TemplateResult {
  const rules = config.rules;
  return html`<div class="row" data-tipped data-anchor="converter_losses">
    <div>
      <div class="name"><b id="converter-losses">${t("rule.converter_losses")}</b>${tip(t, "r_converter_losses")}</div>
      <small>${t("rule.converter_losses.hint")}</small>
    </div>
    <div class="control">
      ${sourceChip(t, sourceOf(config, "rules.converter_losses"))}
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${String(rules.converter_losses)}
        aria-labelledby="converter-losses"
        @click=${() => saveConfig(host, { rules: { converter_losses: !rules.converter_losses } })}
      ></button>
    </div>
  </div>`;
}

/** The watchdog: Joe steps in when batteries charge each other (control/guard.py). */
function transferGuardRow(t: Translate, host: HTMLElement, config: JoeConfig): TemplateResult {
  const on = config.rules.transfer_guard !== false;
  return html`<div class="row" data-tipped data-anchor="transfer_guard">
    <div>
      <div class="name"><b id="transfer-guard">${t("rule.transfer_guard")}</b>${tip(t, "r_transfer_guard")}</div>
      <small>${t("rule.transfer_guard.hint")}</small>
    </div>
    <div class="control">
      ${sourceChip(t, sourceOf(config, "rules.transfer_guard"))}
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${String(on)}
        aria-labelledby="transfer-guard"
        @click=${() => saveConfig(host, { rules: { transfer_guard: !on } })}
      ></button>
    </div>
  </div>`;
}

function priorityRow(t: Translate, host: HTMLElement, config: JoeConfig): TemplateResult {
  const order = config.rules.priority;
  const move = (index: number, step: number) => {
    const next = [...order];
    [next[index], next[index + step]] = [next[index + step], next[index]];
    saveConfig(host, { rules: { priority: next } });
  };
  const arrow = (up: boolean) =>
    html`<svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.6"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d=${up ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"} />
    </svg>`;
  return html`<div class="row" data-tipped data-anchor="priority">
    <div>
      <div class="name"><b>${t("rule.priority")}</b>${tip(t, "r_priority")}</div>
      <small>${t("rule.priority.hint")}</small>
    </div>
    <div class="control">
      ${sourceChip(t, sourceOf(config, "rules.priority"))}
      <div class="order">
        ${order.map(
          (item: PriorityItem, index) => html`<div>
            <span>${index + 1}. ${t(`rule.priority.${item}`)}</span>
            <button
              type="button"
              aria-label=${t("rule.priority.up", { name: t(`rule.priority.${item}`) })}
              ?disabled=${index === 0}
              @click=${() => move(index, -1)}
            >
              ${arrow(true)}
            </button>
            <button
              type="button"
              aria-label=${t("rule.priority.down", { name: t(`rule.priority.${item}`) })}
              ?disabled=${index === order.length - 1}
              @click=${() => move(index, 1)}
            >
              ${arrow(false)}
            </button>
          </div>`,
        )}
      </div>
    </div>
  </div>`;
}

function dischargeRow(t: Translate, host: HTMLElement, config: JoeConfig): TemplateResult {
  const rules: Rules = config.rules;
  return html`<div class="row stacked" data-tipped data-anchor="discharge_in_window">
    <div>
      <div class="name">
        <b>${t("rule.discharge_in_window")}</b>${tip(t, "r_discharge_in_window")}
        ${sourceChip(t, sourceOf(config, "rules.discharge_in_window"))}
      </div>
      <small>${t("rule.discharge_in_window.hint")}</small>
    </div>
    <div>
      <joe-choice
        compact
        label=${t("rule.discharge_in_window")}
        .options=${DISCHARGE.map((mode) => ({ value: mode, label: t(`rule.discharge.${mode}`) }))}
        .value=${[rules.discharge_in_window]}
        @joe-choice=${(ev: CustomEvent<{ value: string[] }>) => {
          if (ev.detail.value[0]) {
            saveConfig(host, { rules: { discharge_in_window: ev.detail.value[0] } });
          }
        }}
      ></joe-choice>
    </div>
  </div>`;
}

/**
 * Daytime surplus for evcc: the switch, and when it is on how careful Joe is
 * with the forecast (control/executor.py _async_surplus).
 */
function daySurplusRow(t: Translate, host: HTMLElement, config: JoeConfig): TemplateResult {
  const rules = config.rules;
  return html`<div class="row" data-tipped data-anchor="day_surplus">
      <div>
        <div class="name"><b id="day-surplus">${t("rule.day_surplus")}</b>${tip(t, "r_day_surplus")}</div>
        <small>${t("rule.day_surplus.hint")}</small>
      </div>
      <div class="control">
        ${sourceChip(t, sourceOf(config, "rules.day_surplus"))}
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(rules.day_surplus)}
          aria-labelledby="day-surplus"
          @click=${() => saveConfig(host, { rules: { day_surplus: !rules.day_surplus } })}
        ></button>
      </div>
    </div>
    ${rules.day_surplus
      ? html`<div class="row stacked" data-tipped data-anchor="day_caution">
          <div>
            <div class="name">
              <b>${t("rule.day_caution")}</b>${tip(t, "r_day_caution")} ${sourceChip(t, sourceOf(config, "rules.day_caution"))}
            </div>
            <small>${t(`rule.day_caution.${rules.day_caution}.hint`)}</small>
          </div>
          <div>
            <joe-choice
              compact
              label=${t("rule.day_caution")}
              .options=${CAUTIONS.map((value) => ({ value, label: t(`rule.day_caution.${value}`) }))}
              .value=${[rules.day_caution]}
              @joe-choice=${(ev: CustomEvent<{ value: string[] }>) => {
                if (ev.detail.value[0]) {
                  saveConfig(host, { rules: { day_caution: ev.detail.value[0] } });
                }
              }}
            ></joe-choice>
          </div>
        </div>`
      : nothing}`;
}

/**
 * How careful the night is: Joe costs every target against tomorrow's bad,
 * typical and good day and weighs them by this choice (plan/planner.py).
 */
function nightCautionRow(t: Translate, host: HTMLElement, config: JoeConfig): TemplateResult {
  const caution = config.rules.night_caution ?? "brave";
  return html`<div class="row stacked" data-tipped data-anchor="night_caution">
    <div>
      <div class="name">
        <b>${t("rule.night_caution")}</b>${tip(t, "r_night_caution")} ${sourceChip(t, sourceOf(config, "rules.night_caution"))}
      </div>
      <small>${t(`rule.night_caution.${caution}.hint`)}</small>
      ${replayLine(t, host, config, caution)}
    </div>
    <div>
      <joe-choice
        compact
        label=${t("rule.night_caution")}
        .options=${NIGHT_CAUTIONS.map((value) => ({ value, label: t(`rule.night_caution.${value}`) }))}
        .value=${[caution]}
        @joe-choice=${(ev: CustomEvent<{ value: string[] }>) => {
          if (ev.detail.value[0]) {
            saveConfig(host, { rules: { night_caution: ev.detail.value[0] } });
          }
        }}
      ></joe-choice>
    </div>
  </div>`;
}

/**
 * What the weekly replay of past nights says about the chosen level: the
 * cheapest level and how much less it would have cost, or that the setting
 * was the cheapest. Only a hint; Joe never changes the setting himself.
 */
function replayLine(t: Translate, host: HTMLElement, config: JoeConfig, caution: NightCaution): TemplateResult | typeof nothing {
  const replay = config.learned?.replay;
  if (!replay) {
    return nothing;
  }
  if (replay.best === caution) {
    return html`<small class="replay">${t("rule.night_caution.replay_same")}</small>`;
  }
  const mine = replay.costs[caution];
  const best = replay.costs[replay.best];
  if (mine == null || best == null) {
    return nothing;
  }
  const currency = (host as HTMLElement & { hass?: { config?: { currency?: string } } }).hass?.config?.currency;
  return html`<small class="replay">
    ${t("rule.night_caution.replay", {
      nights: replay.nights,
      best: t(`rule.night_caution.${replay.best}`),
      diff: euroText(t, mine - best, currency),
    })}
  </small>`;
}

/** Styles of the rule controls; the page brings .row, .name and .control. */
export const ruleStyles = css`
  .unit-input {
    width: 150px;
  }
  .peak {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 8px;
    margin-top: 6px;
  }
  .order {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 220px;
  }
  .order div {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 4px 4px 12px;
    border-radius: 9px;
    background: var(--joe-surface-2);
    font-weight: 600;
  }
  .order span {
    flex: 1;
  }
  .order button {
    width: 34px;
    height: 34px;
    border: 0;
    border-radius: 8px;
    cursor: pointer;
    background: transparent;
    color: var(--joe-ink-2);
    display: grid;
    place-items: center;
  }
  .order button:hover:not([disabled]) {
    background: var(--joe-surface);
    color: var(--joe-ink);
  }
  .order button[disabled] {
    opacity: 0.3;
    cursor: default;
  }
  .order svg {
    width: 18px;
    height: 18px;
  }
  @media (pointer: coarse) {
    .order button {
      width: 44px;
      height: 44px;
    }
  }
  .buffer-control {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 10px;
  }
  small.replay {
    display: block;
    margin-top: 4px;
    color: var(--joe-ink-2);
  }
  .row.stacked {
    display: grid;
    justify-content: stretch;
    align-items: stretch;
    gap: 10px;
  }
`;
