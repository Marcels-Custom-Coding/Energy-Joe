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

const SELECTABLE: JoeMode[] = ["simulation", "advisory", "live", "off"];

interface NumberRule {
  key:
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

const NUMBER_RULES: NumberRule[] = [
  { key: "reserve_soc", unit: "%", min: 0, max: 100, step: 1 },
  { key: "max_target_soc", unit: "%", min: 0, max: 100, step: 1 },
  { key: "evening_min_soc", unit: "%", min: 0, max: 100, step: 1, optional: true },
  { key: "grid_limit_w", unit: "kW", min: 0.1, max: 1000, step: 0.1, scale: 0.001, optional: true },
  { key: "max_night_kwh", unit: "kWh", min: 0.1, max: 1000, step: 0.1, optional: true },
  { key: "buffer_factor", unit: "%", min: 0, max: 300, step: 1, scale: 100 },
  { key: "plan_offset_min", unit: "min", min: 0, max: 180, step: 1, integer: true },
  { key: "reset_lead_min", unit: "min", min: 0, max: 60, step: 1, integer: true },
];

// Safety limits and the maintenance charge (shown after the first rules).
const SAFETY_RULES: NumberRule[] = [
  { key: "max_price", unit: "ct/kWh", min: 0, max: 1000, step: 0.1, scale: 100, optional: true },
  { key: "min_saving", unit: "ct", min: 0, max: 500, step: 1, scale: 100 },
];
const BALANCE_RULE: NumberRule = { key: "balance_days", unit: "", min: 3, max: 90, step: 1, optional: true, integer: true };

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
      .unit-input {
        width: 150px;
      }
      select.input,
      .input.time {
        width: auto;
        min-width: 160px;
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
              <small>${t("settings.mode.hint")}</small>
            </div>
            <div class="seg" role="group" aria-label=${t("settings.mode")}>
              ${SELECTABLE.map(
                (mode) =>
                  html`<button
                    type="button"
                    aria-pressed=${String(joe.mode === mode)}
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

        ${this.renderNotify(t)} ${this.renderRouting(t)}

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

        ${this.renderObserve(t)}

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
                ${SAFETY_RULES.map((rule) => this.numberRow(t, config.rules, rule))} ${this.guardRow(t, config.rules)}
                ${this.numberRow(t, config.rules, BALANCE_RULE)}
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

  /** How Joe works out the distance to an appointment's place (for cars charged by need). */
  private renderRouting(t: Translate): TemplateResult {
    const routing = this.state!.config.routing;
    const options = this.info?.routing;
    const value = routing.service === "google" ? `google:${routing.google_entry ?? ""}` : (routing.service ?? "");
    const choose = (raw: string) => {
      if (raw.startsWith("google:")) {
        saveConfig(this, { routing: { service: "google", google_entry: raw.slice(7) || null } });
      } else {
        saveConfig(this, { routing: { service: (raw || null) as "waze" | "osm" | null, google_entry: null } });
      }
    };
    const url = (key: "geocoder_url" | "router_url") => html`<div class="row" data-tipped>
      <div>
        <div class="name"><label for="routing-${key}"><b>${t(`settings.routing.${key}`)}</b></label>${tip(t, "routing_osm")}</div>
        <small>${t(`settings.routing.${key}.hint`)}</small>
      </div>
      <input
        id="routing-${key}"
        class="input"
        type="url"
        .value=${routing[key]}
        @change=${(ev: Event) => {
          const text = (ev.target as HTMLInputElement).value.trim();
          if (text.startsWith("http")) saveConfig(this, { routing: { [key]: text } });
        }}
      />
    </div>`;
    return html`<section class="group">
      <h2>${t("settings.routing")}</h2>
      <p class="intro">${t("settings.routing.intro")}</p>
      <div class="row" data-tipped>
        <div>
          <div class="name"><label for="routing-service"><b>${t("settings.routing.service")}</b></label>${tip(t, "routing_service")}</div>
          <small>${t("settings.routing.service.hint")}</small>
        </div>
        <select id="routing-service" class="input" @change=${(ev: Event) => choose((ev.target as HTMLSelectElement).value)}>
          <option value="" ?selected=${value === ""}>${t("settings.routing.none")}</option>
          ${options?.waze !== false
            ? html`<option value="waze" ?selected=${value === "waze"}>${t("settings.routing.waze")}</option>`
            : nothing}
          ${(options?.google ?? []).map(
            (entry) =>
              html`<option value=${`google:${entry.entry_id}`} ?selected=${value === `google:${entry.entry_id}`}>
                ${t("settings.routing.google", { name: entry.title })}
              </option>`,
          )}
          <option value="osm" ?selected=${value === "osm"}>${t("settings.routing.osm")}</option>
        </select>
      </div>
      ${routing.service === "osm" ? html`${url("geocoder_url")} ${url("router_url")}` : nothing}
    </section>`;
  }

  private renderNotify(t: Translate): TemplateResult {
    const config = this.state!.config;
    const notify = config.notify;
    const services = Object.keys(this.hass?.services?.notify ?? {})
      .filter((name) => !["persistent_notification", "send_message", "notify"].includes(name))
      .sort();
    const toggle = (key: "ask" | "problems" | "morning", tipName: "notify_ask" | "notify_problems" | "notify_morning") =>
      html`<div class="row" data-tipped>
        <div>
          <div class="name"><b id="notify-${key}">${t(`settings.notify.${key}`)}</b>${tip(t, tipName)}</div>
          <small>${t(`settings.notify.${key}.hint`)}</small>
        </div>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(notify[key])}
          aria-labelledby="notify-${key}"
          ?disabled=${!notify.service}
          @click=${() => saveConfig(this, { notify: { [key]: !notify[key] } })}
        ></button>
      </div>`;
    return html`<section class="group">
      <h2>${t("settings.notify")}</h2>
      <p class="intro">${t("settings.notify.intro")}</p>
      <div class="row" data-tipped>
        <div>
          <div class="name"><label for="notify-service"><b>${t("settings.notify.service")}</b></label>${tip(t, "notify_service")}</div>
          <small>${t("settings.notify.service.hint")}</small>
        </div>
        <select
          id="notify-service"
          class="input"
          @change=${(ev: Event) => {
            const value = (ev.target as HTMLSelectElement).value;
            saveConfig(this, { notify: { service: value ? `notify.${value}` : null } });
          }}
        >
          <option value="" ?selected=${!notify.service}>${t("settings.notify.none")}</option>
          ${services.map(
            (name) => html`<option value=${name} ?selected=${notify.service === `notify.${name}`}>${name.replace(/_/g, " ")}</option>`,
          )}
        </select>
      </div>
      ${toggle("ask", "notify_ask")} ${toggle("problems", "notify_problems")} ${toggle("morning", "notify_morning")}
      <div class="row" data-tipped>
        <div>
          <div class="name"><label for="ask-time"><b>${t("settings.ask_time")}</b></label>${tip(t, "ask_time")}</div>
          <small>${t("settings.ask_time.hint")}</small>
        </div>
        <input
          id="ask-time"
          class="input time"
          type="time"
          .value=${config.rules.ask_time}
          @change=${(ev: Event) => {
            const value = (ev.target as HTMLInputElement).value;
            if (/^\d{2}:\d{2}$/.test(value)) {
              saveConfig(this, { rules: { ask_time: value } });
            }
          }}
        />
      </div>
    </section>`;
  }

  private renderObserve(t: Translate): TemplateResult {
    const joe = this.state!;
    const observe = joe.observe;
    const active = Boolean(observe?.active);
    const running = observe?.backfill.state === "running";
    const day = (iso: string) =>
      new Intl.DateTimeFormat(t.lang, { day: "numeric", month: "long", timeZone: "UTC" }).format(
        new Date(`${iso.slice(0, 10)}T12:00:00Z`),
      );
    const status = active
      ? t("settings.observe.since", { day: day(observe!.since!), time: observe!.since!.slice(11, 16) })
      : joe.mode === "off"
        ? t("settings.observe.off")
        : t("settings.observe.waiting");
    const parts: string[] = [];
    if (observe?.first_day) {
      parts.push(t("settings.observe.days", { days: observe.day_count ?? 0, first: day(observe.first_day) }));
    } else {
      parts.push(t("settings.observe.nothing"));
    }
    const backfill = observe?.backfill;
    if (backfill?.state === "running") {
      parts.push(t("history.reading"));
    } else if (backfill?.state === "unavailable") {
      parts.push(t("settings.observe.no_recorder"));
    } else if (backfill?.state === "failed") {
      parts.push(t("settings.observe.failed"));
    }
    return html`<section class="group">
      <h2>${t("settings.observe")}</h2>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${t("settings.observe.recording")}</b>${tip(t, "observe")}</div>
          <small>${status}</small>
        </div>
        <span class="chip ${active ? "ok" : ""}">
          ${t(active ? "status.running" : joe.mode === "off" ? "status.paused" : "status.waiting")}
        </span>
      </div>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${t("settings.observe.history")}</b>${tip(t, "rebuild")}</div>
          <small>${parts.join(" · ")}</small>
        </div>
        <button type="button" class="btn btn-secondary" ?disabled=${!active || running} @click=${this.rebuild}>
          ${t("settings.observe.rebuild")}
        </button>
      </div>
    </section>`;
  }

  private async rebuild(): Promise<void> {
    try {
      await this.hass?.callWS({ type: "energy_joe/history/rebuild" });
    } catch {
      // The status line says what happened.
    }
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
          <span class="unit">${rule.unit || t(`rule.${rule.key}.unit` as TranslationKey)}</span>
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
    const stored = rule.integer ? Math.round(value) : Math.round((value / scale) * 10000) / 10000;
    saveConfig(this, { rules: { [rule.key]: stored } });
  }

  /** Protect the main fuse: pause charging while the house draws more than the limit. */
  private guardRow(t: Translate, rules: Rules): TemplateResult {
    const config = this.state!.config;
    const limit = rules.grid_limit_w;
    return html`<div class="row" data-tipped>
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
          @click=${() => saveConfig(this, { rules: { guard_grid: !rules.guard_grid } })}
        ></button>
      </div>
    </div>`;
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
