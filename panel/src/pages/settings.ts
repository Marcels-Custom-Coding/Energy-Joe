import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { sourceChip } from "../components/bits";
import "../components/choice";
import "../components/review";
import "../components/sheet";
import { tip } from "../components/tip";
import { saveConfig, sourceOf } from "../config";
import { define } from "../define";
import type { TipName, Translate, TranslationKey } from "../i18n";
import { shared } from "../styles/shared";
import type {
  Check,
  Discovery,
  DischargeMode,
  HomeAssistant,
  JoeInfo,
  JoeMode,
  JoeState,
  PriorityItem,
  Rules,
} from "../types";
import "./questions";

const SELECTABLE: JoeMode[] = ["simulation", "off", "live"];

interface NumberRule {
  key:
    | "reserve_soc"
    | "max_target_soc"
    | "evening_min_soc"
    | "grid_limit_w"
    | "max_night_kwh"
    | "plan_offset_min"
    | "reset_lead_min"
    | "buffer_factor";
  unit: string;
  min: number;
  max: number;
  step: number;
  /** Shown value = stored value × scale (W → kW, factor → %). */
  scale?: number;
  optional?: boolean;
}

const NUMBER_RULES: NumberRule[] = [
  { key: "reserve_soc", unit: "%", min: 0, max: 100, step: 1 },
  { key: "max_target_soc", unit: "%", min: 0, max: 100, step: 1 },
  { key: "evening_min_soc", unit: "%", min: 0, max: 100, step: 1, optional: true },
  { key: "grid_limit_w", unit: "kW", min: 0.1, max: 1000, step: 0.1, scale: 0.001, optional: true },
  { key: "max_night_kwh", unit: "kWh", min: 0.1, max: 1000, step: 0.1, optional: true },
  { key: "buffer_factor", unit: "%", min: 0, max: 300, step: 1, scale: 100 },
  { key: "plan_offset_min", unit: "min", min: 0, max: 180, step: 1 },
  { key: "reset_lead_min", unit: "min", min: 0, max: 60, step: 1 },
];

const ANSWERS: { key: "heating" | "hot_water" | "ev"; tip: TipName }[] = [
  { key: "heating", tip: "q_heating" },
  { key: "hot_water", tip: "q_hot_water" },
  { key: "ev", tip: "q_ev" },
];

const ANSWER_LABELS: Record<string, Record<string, TranslationKey>> = {
  heating: {
    climate: "q.heating.climate",
    heat_pump: "q.heating.heat_pump",
    electric_heating: "q.heating.electric",
    none: "q.heating.none",
  },
  hot_water: {
    hot_water_heat_pump: "q.hot_water.heat_pump",
    electric: "q.hot_water.electric",
    heating: "q.hot_water.heating",
    other: "q.hot_water.other",
  },
  ev: { yes: "q.ev.yes", no: "q.ev.no" },
};

/** Settings: everything Joe uses, the answers, the rules for pros and version info. */
export class JoeSettings extends LitElement {
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) state?: JoeState;
  @property({ attribute: false }) info?: JoeInfo;
  @property({ attribute: false }) discovery?: Discovery;
  @property({ attribute: false }) checks: Check[] = [];

  @state() private pro = false;
  @state() private question = "";

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      .list {
        display: grid;
        gap: 16px;
        max-width: 900px;
        margin: 0 auto;
      }
      .group {
        background: var(--joe-surface);
        border-radius: 14px;
        box-shadow: inset 0 0 0 1px var(--joe-line);
        padding: 4px 18px 8px;
      }
      .group.plain {
        background: transparent;
        box-shadow: none;
        padding: 0;
      }
      h2 {
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 800;
        text-transform: uppercase;
        font-size: 22px;
        margin: 0;
        padding: 14px 0 8px;
      }
      .plain h2 {
        padding-top: 4px;
      }
      .intro {
        margin: -2px 0 12px;
        color: var(--joe-ink-2);
        font-size: 14px;
        max-width: 64ch;
      }
      .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px 16px;
        flex-wrap: wrap;
        padding: 14px 0;
        border-top: 1px solid var(--joe-line);
      }
      .row b {
        display: block;
        font-weight: 700;
      }
      .name {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .row small {
        display: block;
        color: var(--joe-muted);
        font-size: 13px;
        margin-top: 2px;
        max-width: 52ch;
      }
      .control {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        justify-content: flex-end;
      }
      .value {
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        color: var(--joe-ink-2);
      }
      .seg {
        display: inline-flex;
        background: var(--joe-surface-2);
        border-radius: 999px;
        padding: 3px;
        gap: 2px;
      }
      .seg button {
        border: 0;
        background: transparent;
        padding: 6px 14px;
        min-height: 36px;
        border-radius: 999px;
        font-weight: 600;
        font-size: 14px;
        color: var(--joe-ink-2);
        cursor: pointer;
        transition: background 0.12s, color 0.12s;
      }
      .seg button:hover:not([disabled]) {
        background: var(--joe-surface);
        color: var(--joe-ink);
      }
      .seg button:active:not([disabled]) {
        transform: scale(0.97);
      }
      .seg button[aria-pressed="true"] {
        background: var(--joe-ink);
        color: var(--joe-bg);
      }
      .seg button[disabled] {
        cursor: not-allowed;
        opacity: 0.45;
      }
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
      .pro-toggle {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        border: 0;
        background: transparent;
        cursor: pointer;
        padding: 14px 0 10px;
        text-align: left;
        color: var(--joe-ink);
      }
      .pro-toggle h2 {
        padding: 0;
      }
      .pro-toggle svg {
        width: 20px;
        height: 20px;
        transition: transform 0.12s;
      }
      .pro-toggle[aria-expanded="true"] svg {
        transform: rotate(90deg);
      }
      .row.stacked {
        display: grid;
        justify-content: stretch;
        align-items: stretch;
        gap: 10px;
      }
      @media (pointer: coarse) {
        .seg button {
          min-height: 44px;
        }
      }
      @media (max-width: 600px) {
        .control {
          justify-content: flex-start;
        }
      }
    `,
  ];

  protected render() {
    const t = this.t;
    const joe = this.state;
    if (!t || !joe) {
      return nothing;
    }
    const config = joe.config;
    return html`<div class="list">
        <section class="group">
          <h2>${t("settings.operation")}</h2>
          <div class="row" data-tipped>
            <div>
              <div class="name"><b>${t("settings.mode")}</b>${tip(t, "mode")}</div>
              <small>${t("settings.mode.hint")} ${t("settings.live.unavailable")}</small>
            </div>
            <div class="seg" role="group" aria-label=${t("settings.mode")}>
              ${SELECTABLE.map(
                (mode) =>
                  html`<button
                    type="button"
                    aria-pressed=${String(joe.mode === mode)}
                    ?disabled=${mode === "live"}
                    @click=${() => this.emit("joe-set-mode", { mode })}
                  >
                    ${t(`mode.${mode}`)}
                  </button>`,
              )}
            </div>
          </div>
          <div class="row" data-tipped>
            <div>
              <div class="name"><b>${t("settings.setup")}</b>${tip(t, "restart")}</div>
              <small>${t("settings.setup.hint")}</small>
            </div>
            <button
              type="button"
              class="btn btn-secondary"
              @click=${() => this.emit("joe-onboarding", { step: "welcome", completed: false })}
            >
              ${t("settings.setup.restart")}
            </button>
          </div>
        </section>

        <section class="group plain">
          <h2>${t("settings.uses")}</h2>
          <p class="intro">${t("settings.uses.intro")}</p>
          <joe-review
            .hass=${this.hass}
            .t=${t}
            .config=${config}
            .discovery=${this.discovery}
            .checks=${this.checks}
            context="settings"
          ></joe-review>
        </section>

        <section class="group">
          <h2>${t("settings.answers")}</h2>
          ${ANSWERS.map((item) => this.answerRow(t, item.key, item.tip))}
        </section>

        <section class="group">
          <button
            type="button"
            class="pro-toggle"
            data-notip
            aria-expanded=${String(this.pro)}
            @click=${() => (this.pro = !this.pro)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.6"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
            <h2>${t("settings.pro")}</h2>
          </button>
          ${this.pro
            ? html`<p class="intro">${t("settings.pro.intro")}</p>
                ${NUMBER_RULES.slice(0, 5).map((rule) => this.numberRow(t, config.rules, rule))}
                ${this.priorityRow(t, config.rules)} ${this.dischargeRow(t, config.rules)}
                ${NUMBER_RULES.slice(5).map((rule) => this.numberRow(t, config.rules, rule))}`
            : nothing}
        </section>

        <section class="group">
          <h2>${t("settings.about")}</h2>
          <div class="row"><b>${t("settings.version")}</b><span class="value">${this.info?.version ?? "–"}</span></div>
          <div class="row"><b>${t("settings.ha")}</b><span class="value">${this.info?.ha_version ?? "–"}</span></div>
          <div class="row"><b>${t("settings.energy")}</b><span class="value">${this.energyText(t)}</span></div>
        </section>
      </div>
      ${this.question ? this.renderQuestionSheet(t) : nothing}`;
  }

  private answerRow(t: Translate, key: "heating" | "hot_water" | "ev", tipName: TipName): TemplateResult {
    const config = this.state!.config;
    const value = config.answers[key];
    const values = Array.isArray(value) ? (value as string[]) : typeof value === "string" ? [value] : [];
    const text =
      value === "unknown"
        ? t("sum.unknown")
        : values.length
          ? values.map((v) => (ANSWER_LABELS[key][v] ? t(ANSWER_LABELS[key][v]) : v)).join(", ")
          : t("sum.open");
    return html`<div class="row" data-tipped>
      <div>
        <div class="name"><b>${t(`settings.answer.${key}`)}</b>${tip(t, tipName)}</div>
        <small>${text}</small>
      </div>
      <div class="control">
        ${value == null ? nothing : sourceChip(t, sourceOf(config, `answers.${key}`))}
        <button type="button" class="mini-btn" @click=${() => (this.question = key)}>
          <ha-icon icon="mdi:pencil-outline"></ha-icon>${t("review.change")}
        </button>
      </div>
    </div>`;
  }

  private renderQuestionSheet(t: Translate): TemplateResult {
    const close = () => {
      this.question = "";
    };
    return html`<joe-sheet label=${t("settings.answers")} closeLabel=${t("common.close")} @joe-close=${close}>
      <joe-questions
        .hass=${this.hass}
        .t=${t}
        .config=${this.state?.config}
        .discovery=${this.discovery}
        single=${this.question}
      ></joe-questions>
      <div class="actions">
        <button type="button" class="btn btn-secondary" data-notip @click=${close}>${t("mode.close")}</button>
      </div>
    </joe-sheet>`;
  }

  private numberRow(t: Translate, rules: Rules, rule: NumberRule): TemplateResult {
    const config = this.state!.config;
    const stored = rules[rule.key];
    const scale = rule.scale ?? 1;
    const shown = stored == null ? "" : String(Math.round(stored * scale * 100) / 100);
    const fallback = this.info?.defaults?.rules[rule.key];
    const provenance = sourceOf(config, `rules.${rule.key}`);
    const changed = provenance?.source === "user";
    return html`<div class="row" data-tipped>
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
            .value=${shown}
            @change=${(ev: Event) => this.setNumber(rule, ev.target as HTMLInputElement)}
          />
          <span class="unit">${rule.unit}</span>
        </span>
        ${changed && fallback !== undefined
          ? html`<button
              type="button"
              class="mini-btn quiet"
              @click=${() => saveConfig(this, { rules: { [rule.key]: fallback } }, "default")}
            >
              <ha-icon icon="mdi:restore"></ha-icon>${t("rule.reset")}
            </button>`
          : nothing}
      </div>
    </div>`;
  }

  private setNumber(rule: NumberRule, input: HTMLInputElement): void {
    const raw = input.value.trim();
    const scale = rule.scale ?? 1;
    if (raw === "") {
      if (rule.optional) {
        saveConfig(this, { rules: { [rule.key]: null } });
      }
      return;
    }
    const value = Number.parseFloat(raw);
    if (!Number.isFinite(value) || value < rule.min || value > rule.max) {
      input.reportValidity();
      return;
    }
    const stored = rule.unit === "min" ? Math.round(value) : Math.round((value / scale) * 10000) / 10000;
    saveConfig(this, { rules: { [rule.key]: stored } });
  }

  private priorityRow(t: Translate, rules: Rules): TemplateResult {
    const config = this.state!.config;
    const order = rules.priority;
    const move = (index: number, step: number) => {
      const next = [...order];
      [next[index], next[index + step]] = [next[index + step], next[index]];
      saveConfig(this, { rules: { priority: next } });
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
    return html`<div class="row" data-tipped>
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

  private dischargeRow(t: Translate, rules: Rules): TemplateResult {
    const config = this.state!.config;
    const modes: DischargeMode[] = ["until_target", "block", "free"];
    return html`<div class="row stacked" data-tipped>
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
          .options=${modes.map((mode) => ({ value: mode, label: t(`rule.discharge.${mode}`) }))}
          .value=${[rules.discharge_in_window]}
          @joe-choice=${(ev: CustomEvent<{ value: string[] }>) => {
            if (ev.detail.value[0]) {
              saveConfig(this, { rules: { discharge_in_window: ev.detail.value[0] } });
            }
          }}
        ></joe-choice>
      </div>
    </div>`;
  }

  private energyText(t: Translate): string {
    const energy = this.info?.energy;
    return energy?.configured && energy.sources
      ? `${energy.sources.solar ?? 0} ${t("energy.solar")} · ${energy.sources.battery ?? 0} ${t("energy.battery")} · ${energy.devices ?? 0} ${t("energy.devices")}`
      : t("settings.energy.none");
  }

  private emit(name: string, detail: Record<string, unknown>): void {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }
}

define("joe-settings", JoeSettings);
