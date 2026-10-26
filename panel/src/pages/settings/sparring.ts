import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { openInHa } from "../../components/bits";
import {
  SPARRING_ROUTE,
  briefStyles,
  briefView,
  loadSparring,
  reportChip,
  sparringCount,
  sparringPoints,
  sparringWhen,
} from "../../components/sparring";
import { tip } from "../../components/tip";
import { pickEntity, saveConfig } from "../../config";
import { define } from "../../define";
import { entityName } from "../../entities";
import type { Translate } from "../../i18n";
import { PANEL, link } from "../../router";
import { shared } from "../../styles/shared";
import type { HomeAssistant, JoeState, SparringReport, SparringState } from "../../types";
import { settingsStyles } from "./styles";

/** Where integrations are added in Home Assistant. */
const INTEGRATIONS_PAGE = "/config/integrations/dashboard";

/**
 * Einstellungen › Betrieb › Zweiter Blick: which language model, on or off,
 * a check right now and exactly what Joe sends. Off by default.
 */
export class JoeSettingsSparring extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;
  @property({ attribute: false }) prefix = PANEL;

  @state() private data?: SparringState;
  /** "Jetzt prüfen" waits for the answer. */
  @state() private running = false;
  @state() private notice?: { ok: boolean; text: string };

  /** The config last loaded with, so a change (on, off, other model) fetches again. */
  private loadedFor?: string;

  static styles = [
    shared,
    settingsStyles,
    briefStyles,
    css`
      :host {
        min-width: 0;
      }
      .group > .note {
        margin-bottom: 12px;
      }
      details.explain {
        margin: 0 0 14px;
        border-radius: 12px;
        background: var(--joe-surface-2);
      }
      details.explain > summary {
        min-height: 44px;
        display: flex;
        align-items: center;
        padding: 0 12px;
        font-weight: 600;
        cursor: pointer;
      }
      .explain-body {
        padding: 0 14px 14px;
      }
      .explain-body > p {
        margin: 0 0 12px;
        color: var(--joe-ink-2);
        font-size: 13.5px;
      }
      a.go-link {
        display: inline-flex;
        align-items: center;
        min-height: 44px;
        font-weight: 600;
        font-size: 14px;
        color: var(--joe-ink);
        text-decoration: underline;
        text-decoration-color: var(--joe-line-2);
        text-underline-offset: 3px;
      }
      a.go-link:hover {
        text-decoration-color: var(--joe-amber);
      }
      .last {
        display: flex;
        align-items: center;
        gap: 6px 8px;
        flex-wrap: wrap;
        margin-top: 4px;
      }
    `,
  ];

  protected willUpdate(changed: PropertyValues<this>): void {
    if (!changed.has("state") && !changed.has("hass")) {
      return;
    }
    const sparring = this.state?.config.sparring;
    const key = `${sparring?.enabled ?? false}|${sparring?.entity ?? ""}`;
    if (this.hass && key !== this.loadedFor) {
      this.loadedFor = key;
      this.load();
    }
  }

  private async load(): Promise<void> {
    const data = await loadSparring(this.hass);
    if (data) {
      this.data = data;
    }
  }

  /** The language models Home Assistant offers (its ai_task entities). */
  private models(): string[] {
    return Object.keys(this.hass?.states ?? {}).filter((id) => id.startsWith("ai_task."));
  }

  protected render() {
    const { t, state: joe } = this;
    if (!t || !joe) {
      return nothing;
    }
    const sparring = joe.config.sparring ?? { enabled: false, entity: null };
    const models = this.models();
    return html`<section class="group">
      <div class="group-title"><h2>${t("sparring.title")}</h2>${tip(t, "sparring")}</div>
      <p class="intro">${t("sparring.intro")}</p>
      <div class="note"><ha-icon icon="mdi:shield-check-outline"></ha-icon><span>${t("sparring.promise")}</span></div>
      ${!models.length && !sparring.entity
        ? this.renderSetup(t)
        : html`${this.renderModel(t, sparring.entity)} ${this.renderSwitch(t, sparring.enabled, sparring.entity)}
          ${this.renderRun(t, sparring.enabled, sparring.entity)}`}
      ${this.renderBrief(t)}
    </section>`;
  }

  /** No language model in Home Assistant yet: how to get one. */
  private renderSetup(t: Translate): TemplateResult {
    return html`<div class="note" data-tipped>
      <ha-icon icon="mdi:robot-outline"></ha-icon>
      <div>
        <b>${t("sparring.setup.title")}</b>
        <div>${t("sparring.setup.text")}</div>
        <div class="note-actions">
          <button type="button" class="mini-btn" @click=${() => openInHa(INTEGRATIONS_PAGE)}>
            <ha-icon icon="mdi:open-in-new"></ha-icon>${t("sparring.setup.open")}
          </button>
          ${tip(t, "sparring_setup")}
        </div>
      </div>
    </div>`;
  }

  private renderModel(t: Translate, entity: string | null): TemplateResult {
    const gone = Boolean(entity) && !this.hass?.states[entity!];
    const detail = !entity
      ? t("sparring.entity.none")
      : gone
        ? t("sparring.entity.gone", { entity: entity! })
        : entityName(this.hass!, entity);
    return html`<div class="row" data-tipped>
      <div>
        <div class="name"><b>${t("sparring.entity")}</b>${tip(t, "sparring_entity")}</div>
        <small>${detail}</small>
      </div>
      <button type="button" class="btn btn-secondary" @click=${() => this.pick(entity)}>
        ${t(entity ? "sparring.change" : "sparring.choose")}
      </button>
    </div>`;
  }

  private renderSwitch(t: Translate, enabled: boolean, entity: string | null): TemplateResult {
    const hint = !entity
      ? t("sparring.enabled.no_entity")
      : !enabled
        ? t("sparring.enabled.off")
        : this.data?.next
          ? t("sparring.enabled.next", { when: sparringWhen(t, this.data.next) })
          : t("sparring.enabled.on");
    return html`<div class="row" data-tipped>
      <div>
        <div class="name"><b id="sparring-enabled">${t("sparring.enabled")}</b>${tip(t, "sparring_enabled")}</div>
        <small>${hint}</small>
      </div>
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${String(enabled)}
        aria-labelledby="sparring-enabled"
        ?disabled=${!entity && !enabled}
        @click=${() => saveConfig(this, { sparring: { enabled: !enabled } })}
      ></button>
    </div>`;
  }

  private renderRun(t: Translate, enabled: boolean, entity: string | null): TemplateResult {
    const busy = this.running || Boolean(this.data?.running);
    const last = this.data?.reports[0];
    return html`<div class="row" data-tipped>
      <div>
        <div class="name"><b>${t("sparring.run.label")}</b>${tip(t, "sparring_run")}</div>
        <small>${busy ? t("sparring.run.running") : enabled && entity ? t("sparring.run.hint") : t("sparring.run.off")}</small>
        ${last ? this.renderLast(t, last) : nothing}
      </div>
      <button type="button" class="btn btn-secondary" ?disabled=${busy || !enabled || !entity} @click=${this.run}>
        ${t("sparring.run")}
      </button>
    </div>
    ${this.notice
      ? html`<div class="note ${this.notice.ok ? "" : "warn"} row-note" role="status">
          <ha-icon icon=${this.notice.ok ? "mdi:check" : "mdi:alert-outline"}></ha-icon><span>${this.notice.text}</span>
        </div>`
      : nothing}`;
  }

  /** "Zuletzt: 27. Oktober, 06:00 Uhr · 3 Punkte · Bericht ansehen". */
  private renderLast(t: Translate, report: SparringReport): TemplateResult {
    return html`<div class="last">
      <small>${t("sparring.last", { when: sparringWhen(t, report.at) })}</small>
      ${reportChip(t, report)} ${link(this.prefix, SPARRING_ROUTE, t("sparring.open_reports"), "go-link")}
    </div>`;
  }

  /** "Was ich schicke": the summary sent last (or a preview), readable, JSON a tap away. */
  private renderBrief(t: Translate): TemplateResult {
    const brief = this.data?.brief;
    const preview = !this.data?.reports.length;
    return html`<div class="row" data-tipped>
        <div>
          <div class="name"><b>${t("sparring.brief")}</b>${tip(t, "sparring_brief")}</div>
          <small>${t("sparring.brief.hint")}</small>
        </div>
      </div>
      <details class="explain" data-notip>
        <summary>${t("sparring.brief.show")}</summary>
        <div class="explain-body">
          ${brief
            ? html`${preview ? html`<p>${t("sparring.brief.preview")}</p>` : nothing}${briefView(t, brief)}`
            : html`<p>${t("sparring.brief.none")}</p>`}
        </div>
      </details>`;
  }

  private async pick(current: string | null): Promise<void> {
    const t = this.t;
    if (!t) {
      return;
    }
    const models = this.models();
    const picked = await pickEntity(this, {
      heading: t("sparring.pick.title"),
      tip: "pick_ai_task",
      filter: "ai_task",
      selected: current ? [current] : models.length === 1 ? models : [],
    });
    const entity = picked?.selected[0];
    if (entity && entity !== current) {
      saveConfig(this, { sparring: { entity } });
    }
  }

  private run = async (): Promise<void> => {
    const t = this.t;
    if (!t || !this.hass || this.running) {
      return;
    }
    this.running = true;
    this.notice = undefined;
    try {
      const report = await this.hass.callWS<SparringReport>({ type: "energy_joe/sparring/run" });
      const count = report ? sparringCount(report) : 0;
      this.notice = !report?.ok
        ? { ok: false, text: t("sparring.run.failed", { error: report?.error || t("sparring.report.error.unknown") }) }
        : count
          ? { ok: true, text: t("sparring.run.done", { points: sparringPoints(t, count) }) }
          : { ok: true, text: t("sparring.run.clean") };
    } catch (err) {
      const error = err as { code?: string; message?: string };
      this.notice = {
        ok: false,
        text:
          error?.code === "not_ready"
            ? t("sparring.run.not_ready")
            : t("sparring.run.failed", { error: error?.message ?? String(err) }),
      };
    } finally {
      this.running = false;
      this.load();
    }
  };
}

define("joe-settings-sparring", JoeSettingsSparring);
