import { css, html, nothing, type TemplateResult } from "lit";
import { sourceChip } from "./components/bits";
import "./components/choice";
import { tip } from "./components/tip";
import { saveConfig, sourceOf } from "./config";
import { formatNumber } from "./entities";
import type { Translate, TranslationKey } from "./i18n";
import type { DischargeMode, JoeConfig, JoeInfo, PriorityItem, Rules } from "./types";

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
export type OtherRuleKey = "guard_grid" | "priority" | "discharge_in_window" | "converter_losses";
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
  battery: ["reserve_soc", "max_target_soc", "evening_min_soc", "balance_days", "discharge_in_window", "converter_losses"],
  grid: ["grid_limit_w", "max_night_kwh", "guard_grid", "max_price", "min_saving"],
  plan: ["priority", "buffer_factor", "plan_offset_min", "reset_lead_min"],
};

/** All rules, in the order of Einstellungen › Regeln. */
export const RULE_ORDER: readonly RuleKey[] = [...RULE_GROUPS.battery, ...RULE_GROUPS.grid, ...RULE_GROUPS.plan];

const DISCHARGE: DischargeMode[] = ["until_target", "block", "free"];

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
    default:
      return t(rules[key] ? "rule.on" : "rule.off");
  }
}

/**
 * One rule as a settings row: label, hint, (i), source chip and its control.
 * Saves right away; the row carries data-anchor=<key> for /settings/rules/<key>.
 */
export function ruleRow(t: Translate, host: HTMLElement, config: JoeConfig, info: JoeInfo | undefined, key: RuleKey): TemplateResult {
  if (isNumberRule(key)) {
    return numberRow(t, host, config, info, NUMBER_RULES[key]);
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
  }
}

function numberRow(t: Translate, host: HTMLElement, config: JoeConfig, info: JoeInfo | undefined, rule: NumberRule): TemplateResult {
  const fallback = info?.defaults?.rules[rule.key];
  const provenance = sourceOf(config, `rules.${rule.key}`);
  const changed = provenance?.source === "user";
  return html`<div class="row" data-tipped data-anchor=${rule.key}>
    <div>
      <div class="name"><b>${t(`rule.${rule.key}`)}</b>${tip(t, `r_${rule.key}`)}</div>
      <small>${t(`rule.${rule.key}.hint`)}</small>
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

/** Styles of the rule controls; the page brings .row, .name and .control. */
export const ruleStyles = css`
  .unit-input {
    width: 150px;
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
  .row.stacked {
    display: grid;
    justify-content: stretch;
    align-items: stretch;
    gap: 10px;
  }
`;
