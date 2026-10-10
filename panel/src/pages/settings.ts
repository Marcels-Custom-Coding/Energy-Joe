import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { sourceChip } from "../components/bits";
import "../components/sheet";
import { tip } from "../components/tip";
import { saveConfig, sourceOf } from "../config";
import { define } from "../define";
import type { TipName, Translate, TranslationKey } from "../i18n";
import { PANEL, format, revealAnchor, type Route } from "../router";
import { PRO_RULES, isRuleKey, ruleRow, ruleStyles } from "../rules-view";
import { shared } from "../styles/shared";
import type { Check, Discovery, HomeAssistant, JoeInfo, JoeMode, JoeState, Rules } from "../types";
import "./questions";

const SELECTABLE: JoeMode[] = ["simulation", "advisory", "live", "off"];

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

/** Settings: how Joe works, the rules for pros, upkeep and version info. */
export class JoeSettings extends LitElement {
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) state?: JoeState;
  @property({ attribute: false }) info?: JoeInfo;
  @property({ attribute: false }) discovery?: Discovery;
  @property({ attribute: false }) checks: Check[] = [];
  @property({ attribute: false }) route?: Route;
  @property({ attribute: false }) prefix = PANEL;

  /** A backup file read and waiting for the user's yes. */
  @state() private backup?: { name: string; when: string; config: Record<string, unknown> };
  @state() private backupNote?: { ok: boolean; text: string };
  @state() private pro = false;
  /** Notify services with the phone's current name (see energy_joe/notify/targets). */
  @state() private notifyTargets?: { service: string; name: string }[];
  @state() private question = "";

  /** Where the address points (section, rule or maintenance part), until it is on screen. */
  private anchor?: string;
  /** The address last revealed, so a new state does not scroll again. */
  private revealed?: string;

  static styles = [
    shared,
    ruleStyles,
    css`
      label.file {
        position: relative;
        overflow: hidden;
        cursor: pointer;
      }
      label.file input {
        position: absolute;
        inset: 0;
        opacity: 0;
        cursor: pointer;
      }
      .confirm {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-top: 8px;
      }
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
      select.input,
      .input.time {
        width: auto;
        min-width: 160px;
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

  protected willUpdate(changed: PropertyValues<this>): void {
    if (!changed.has("route")) {
      return;
    }
    const path = this.route ? format(this.route) : "";
    if (path === this.revealed) {
      return;
    }
    this.revealed = path;
    const { section, id } = this.route ?? {};
    if (section === "rules") {
      // The rules live in Für Profis: open it for the address.
      this.pro = true;
      this.anchor = id && isRuleKey(id) ? id : "rules";
    } else if (section === "maintenance") {
      this.anchor = id === "backup" || id === "setup" ? id : "maintenance";
    } else {
      // Betrieb is the top of the page: nothing to scroll to.
      this.anchor = section && section !== "operation" ? section : undefined;
    }
  }

  protected async updated(): Promise<void> {
    const anchor = this.anchor;
    if (!anchor) {
      return;
    }
    const children = [...this.renderRoot.querySelectorAll<LitElement>("joe-choice")];
    await Promise.all(children.map((child) => child.updateComplete));
    // The sticky header's height (the scroll offset) is measured after the first paint.
    for (let i = 0; i < 10 && (i === 0 || !getComputedStyle(this).getPropertyValue("--joe-head-h")); i++) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
    if (this.anchor === anchor && revealAnchor(this.renderRoot, anchor)) {
      this.anchor = undefined;
    }
  }

  protected render() {
    const t = this.t;
    const joe = this.state;
    if (!t || !joe) {
      return nothing;
    }
    const config = joe.config;
    return html`<div class="list">
        <section class="group" data-anchor="operation">
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
          ${this.gridFriendlyRows(t, config.rules)}
          <div class="row" data-tipped data-anchor="setup">
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

        ${this.renderNotify(t)}

        <section class="group">
          <h2>${t("settings.answers")}</h2>
          ${ANSWERS.map((item) => this.answerRow(t, item.key, item.tip))}
        </section>

        ${this.renderObserve(t)}

        <section class="group" data-anchor="rules">
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
                ${PRO_RULES.map((key) => ruleRow(t, this, config, this.info, key))}`
            : nothing}
        </section>

        ${this.renderBackup(t)}

        <section class="group" data-anchor="about">
          <h2>${t("settings.about")}</h2>
          <div class="row"><b>${t("settings.version")}</b><span class="value">${this.info?.version ?? "–"}</span></div>
          <div class="row"><b>${t("settings.ha")}</b><span class="value">${this.info?.ha_version ?? "–"}</span></div>
          <div class="row"><b>${t("settings.energy")}</b><span class="value">${this.energyText(t)}</span></div>
        </section>
      </div>
      ${this.question ? this.renderQuestionSheet(t) : nothing}`;
  }

  /** Export all settings (with what Joe learned) to a file, or take such a file back in. */
  private renderBackup(t: Translate): TemplateResult {
    return html`<section class="group" data-anchor="backup">
      <h2>${t("settings.backup")}</h2>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${t("settings.backup.export")}</b>${tip(t, "backup_export")}</div>
          <small>${t("settings.backup.export.hint")}</small>
        </div>
        <button type="button" class="btn btn-secondary" @click=${() => void this.exportSettings()}>${t("settings.backup.download")}</button>
      </div>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${t("settings.backup.import")}</b>${tip(t, "backup_import")}</div>
          <small>${t("settings.backup.import.hint")}</small>
        </div>
        <label class="btn btn-secondary file">
          ${t("settings.backup.choose")}
          <input type="file" accept="application/json,.json" @change=${(ev: Event) => void this.readBackup(ev)} />
        </label>
      </div>
      ${this.backup
        ? html`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon>
            <span>
              ${t("settings.backup.confirm", { file: this.backup.name, when: this.backup.when })}
              <span class="confirm">
                <button type="button" class="btn btn-danger" @click=${() => void this.importSettings()}>${t("settings.backup.replace")}</button>
                <button type="button" class="btn btn-ghost" @click=${() => (this.backup = undefined)}>${t("common.cancel")}</button>
              </span>
            </span>
          </div>`
        : nothing}
      ${this.backupNote
        ? html`<div class="note ${this.backupNote.ok ? "ok" : "warn"}">
            <ha-icon icon=${this.backupNote.ok ? "mdi:check" : "mdi:alert-outline"}></ha-icon><span>${this.backupNote.text}</span>
          </div>`
        : nothing}
    </section>`;
  }

  private async exportSettings(): Promise<void> {
    const t = this.t!;
    try {
      const data = await this.hass!.callWS<Record<string, unknown>>({ type: "energy_joe/config/export" });
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `energy-joe-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(link.href);
      this.backupNote = { ok: true, text: t("settings.backup.exported") };
    } catch (err) {
      this.backupNote = { ok: false, text: t("settings.backup.failed", { error: String((err as { message?: string })?.message ?? err) }) };
    }
  }

  private async readBackup(ev: Event): Promise<void> {
    const t = this.t!;
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    this.backupNote = undefined;
    try {
      const data = JSON.parse(await file.text()) as { kind?: string; exported?: string; config?: Record<string, unknown> };
      if (data.kind !== "energy_joe_settings" || !data.config) throw new Error(t("settings.backup.not_ours"));
      this.backup = {
        name: file.name,
        when: data.exported ? new Date(data.exported).toLocaleString(t.lang) : "–",
        config: data.config,
      };
    } catch (err) {
      this.backupNote = { ok: false, text: t("settings.backup.failed", { error: String((err as { message?: string })?.message ?? err) }) };
    }
  }

  private async importSettings(): Promise<void> {
    const t = this.t!;
    const backup = this.backup;
    this.backup = undefined;
    if (!backup) return;
    try {
      await this.hass!.callWS({ type: "energy_joe/config/import", config: backup.config });
      this.backupNote = { ok: true, text: t("settings.backup.imported") };
    } catch (err) {
      this.backupNote = { ok: false, text: t("settings.backup.failed", { error: String((err as { message?: string })?.message ?? err) }) };
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.hass
      ?.callWS<{ service: string; name: string }[]>({ type: "energy_joe/notify/targets" })
      .then((targets) => (this.notifyTargets = targets))
      .catch(() => undefined);
  }

  private renderNotify(t: Translate): TemplateResult {
    const config = this.state!.config;
    const notify = config.notify;
    // Phones by the name Home Assistant shows now (the service keeps the old one).
    const services =
      this.notifyTargets ??
      Object.keys(this.hass?.services?.notify ?? {})
        .filter((name) => !["persistent_notification", "send_message", "notify"].includes(name))
        .sort()
        .map((name) => ({ service: name, name: name.replace(/_/g, " ") }));
    const chosen = notify.service?.replace(/^notify\./, "");
    const gone = Boolean(chosen) && this.notifyTargets !== undefined && !services.some((s) => s.service === chosen);
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
    return html`<section class="group" data-anchor="notify">
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
            (target) => html`<option value=${target.service} ?selected=${chosen === target.service}>${target.name}</option>`,
          )}
          ${gone ? html`<option value=${chosen} selected>${t("settings.notify.gone", { name: chosen ?? "" })}</option>` : nothing}
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
    return html`<section class="group" data-anchor="maintenance">
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

  /** Grid-friendly: batteries take the midday sun; what comes first, saving or the grid. */
  private gridFriendlyRows(t: Translate, rules: Rules): TemplateResult {
    const config = this.state!.config;
    return html`<div class="row" data-tipped>
        <div>
          <div class="name"><b id="grid-friendly">${t("rule.grid_friendly")}</b>${tip(t, "r_grid_friendly")}</div>
          <small>${t("rule.grid_friendly.hint")}</small>
        </div>
        <div class="control">
          ${sourceChip(t, sourceOf(config, "rules.grid_friendly"))}
          <button
            type="button"
            class="switch"
            role="switch"
            aria-checked=${String(rules.grid_friendly)}
            aria-labelledby="grid-friendly"
            @click=${() => saveConfig(this, { rules: { grid_friendly: !rules.grid_friendly } })}
          ></button>
        </div>
      </div>
      ${rules.grid_friendly
        ? html`<div class="row" data-tipped>
            <div>
              <div class="name"><b>${t("rule.grid_first")}</b>${tip(t, "r_grid_first")}</div>
              <small>${t(rules.grid_first ? "rule.grid_first.grid.hint" : "rule.grid_first.saving.hint")}</small>
            </div>
            <div class="seg" role="group" aria-label=${t("rule.grid_first")}>
              ${[false, true].map(
                (first) =>
                  html`<button
                    type="button"
                    aria-pressed=${String(rules.grid_first === first)}
                    @click=${() => saveConfig(this, { rules: { grid_first: first } })}
                  >
                    ${t(first ? "rule.grid_first.grid" : "rule.grid_first.saving")}
                  </button>`,
              )}
            </div>
          </div>`
        : nothing}`;
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
