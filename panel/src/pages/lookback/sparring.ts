import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { findingList, findingStyles, infoNote, rowButton, type FindingRow } from "../../components/finding-rows";
import { euroText } from "../../components/plan-text";
import {
  SPARRING_SETTINGS,
  loadSparring,
  reportChip,
  sparringCount,
  sparringNews,
  sparringWhen,
} from "../../components/sparring";
import { tip } from "../../components/tip";
import { define } from "../../define";
import { entityName } from "../../entities";
import type { Translate } from "../../i18n";
import { PANEL, link, navigate } from "../../router";
import { shared } from "../../styles/shared";
import type { HomeAssistant, JoeState, SparringArea, SparringProposal, SparringReport, SparringState } from "../../types";

const AREA_ICONS: Record<SparringArea, string> = {
  night: "mdi:weather-night",
  solar: "mdi:weather-sunny",
  consumption: "mdi:home-lightning-bolt-outline",
  battery: "mdi:battery-charging-medium",
  car: "mdi:car-electric-outline",
  other: "mdi:magnify",
};

/**
 * Rückblick › Gelernt › Zweiter Blick: the newest report in full, older ones
 * folded away. Proposals only lead to the setting; Joe changes nothing.
 * Once the newest report is on screen, it counts as seen.
 */
export class JoeSparringReports extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;
  @property({ attribute: false }) prefix = PANEL;

  @state() private data?: SparringState;
  @state() private failed = false;

  private observer?: IntersectionObserver;
  /** The report already marked as seen in this view. */
  private marked?: string;

  static styles = [
    shared,
    findingStyles,
    css`
      :host {
        display: block;
      }
      .card {
        padding: 18px 20px;
        margin-top: 28px;
      }
      .head {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .head .eyebrow {
        flex: 1;
      }
      .say {
        margin: 10px 0 0;
        font-size: 15px;
        line-height: 1.5;
        color: var(--joe-ink-2);
        max-width: 62ch;
      }
      .when {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        margin-top: 10px;
        font-weight: 600;
      }
      .when small {
        font-weight: 400;
        color: var(--joe-muted);
      }
      blockquote {
        margin: 10px 0 0;
        padding: 10px 14px;
        border-radius: 12px;
        background: var(--joe-surface-2);
        font-size: 15px;
        line-height: 1.5;
        max-width: 66ch;
      }
      h4 {
        margin: 18px 0 8px;
        font-size: 14px;
      }
      dl.text-steps {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr);
        gap: 4px 10px;
        margin: 8px 0 0;
        font-size: 13.5px;
      }
      dl.text-steps dt {
        font-weight: 700;
      }
      dl.text-steps dd {
        margin: 0;
        color: var(--joe-ink-2);
        overflow-wrap: anywhere;
      }
      ul.questions {
        margin: 0;
        padding-left: 20px;
        line-height: 1.5;
      }
      .note {
        margin-top: 12px;
      }
      .muted {
        margin: 12px 0 0;
        font-size: 13px;
        color: var(--joe-muted);
      }
      details.older {
        margin-top: 16px;
        border-radius: 12px;
        background: var(--joe-surface-2);
      }
      details.older > summary,
      details.report > summary {
        min-height: 44px;
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        padding: 0 12px;
        font-weight: 600;
        cursor: pointer;
      }
      .older-body {
        padding: 0 12px 12px;
      }
      details.report {
        border-top: 1px solid var(--joe-line);
      }
      details.report > .report-body {
        padding: 0 4px 12px;
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
    `,
  ];

  connectedCallback(): void {
    super.connectedCallback();
    this.load();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.observer?.disconnect();
    this.observer = undefined;
  }

  protected updated(): void {
    // The newest report counts as seen once it is on screen (also after a jump from "Joe braucht dich").
    if (!this.observer && sparringNews(this.data) && "IntersectionObserver" in window) {
      this.observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          this.markSeen();
        }
      });
      this.observer.observe(this);
    }
  }

  private async load(): Promise<void> {
    const data = await loadSparring(this.hass);
    this.failed = !data;
    if (data) {
      this.data = data;
    }
  }

  private async markSeen(): Promise<void> {
    const report = sparringNews(this.data);
    this.observer?.disconnect();
    this.observer = undefined;
    if (!report || this.marked === report.at || !this.hass) {
      return;
    }
    this.marked = report.at;
    try {
      await this.hass.callWS({ type: "energy_joe/sparring/seen", at: report.at });
      if (this.data) {
        this.data = {
          ...this.data,
          reports: this.data.reports.map((r) => (r.at === report.at ? { ...r, seen: true } : r)),
        };
      }
    } catch {
      this.marked = undefined;
    }
  }

  protected render() {
    const t = this.t;
    if (!t) {
      return nothing;
    }
    const data = this.data;
    const reports = data?.reports ?? [];
    const [newest, ...older] = reports;
    return html`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:eye-check-outline"></ha-icon>${t("sparring.title")}</div>
        ${tip(t, "sparring_reports")}
      </div>
      <p class="say">${t("sparring.reports.lead")}</p>
      ${this.failed && !data
        ? html`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${t("sparring.reports.failed")}</span></div>`
        : nothing}
      ${data && !newest ? this.renderEmpty(t, data) : nothing}
      ${newest ? this.renderReport(t, newest) : nothing}
      ${older.length
        ? html`<details class="older" data-notip>
            <summary>${t("sparring.older", { count: older.length })}</summary>
            <div class="older-body">
              ${older.map(
                (report) => html`<details class="report">
                  <summary>${sparringWhen(t, report.at)} ${reportChip(t, report)}</summary>
                  <div class="report-body">${this.renderReport(t, report, false)}</div>
                </details>`,
              )}
            </div>
          </details>`
        : nothing}
      ${link(this.prefix, SPARRING_SETTINGS, t("sparring.reports.settings"), "go-link")}
    </section>`;
  }

  private renderEmpty(t: Translate, data: SparringState): TemplateResult {
    if (!data.enabled) {
      return html`<p class="say">${t("sparring.reports.off")}</p>`;
    }
    return html`<p class="say">
      ${data.next ? t("sparring.reports.waiting", { when: sparringWhen(t, data.next) }) : t("sparring.reports.waiting_soon")}
    </p>`;
  }

  /** One report: when and with what, what the model says, then findings, texts, proposals and questions. */
  private renderReport(t: Translate, report: SparringReport, head = true): TemplateResult {
    const model = report.entity && this.hass ? entityName(this.hass, report.entity) : report.entity;
    const when = head
      ? html`<div class="when">
          ${t("sparring.report.at", { when: sparringWhen(t, report.at) })} ${reportChip(t, report)}
          ${model ? html`<small>${t("sparring.report.by", { model })}</small>` : nothing}
        </div>`
      : nothing;
    if (!report.ok) {
      return html`${when}
        <div class="note warn">
          <ha-icon icon="mdi:alert-outline"></ha-icon>
          <span>${t("sparring.report.error", { error: report.error || t("sparring.report.error.unknown") })}</span>
        </div>
        <p class="muted">${t("sparring.report.error.retry")}</p>`;
    }
    const count = sparringCount(report);
    return html`${when}
      ${report.summary ? html`<blockquote>${report.summary}</blockquote>` : nothing}
      ${count ? nothing : html`<p class="say">${t("sparring.report.clean")}</p>`}
      ${report.findings.length
        ? html`<h4>${t("sparring.findings")}</h4>
            ${findingList(t, report.findings.map((finding) => this.findingRow(t, finding)))}`
        : nothing}
      ${report.texts.length
        ? html`<h4>${t("sparring.texts")}</h4>
            ${findingList(t, report.texts.map((text) => this.textRow(t, text)))}`
        : nothing}
      ${report.proposals.length
        ? html`<h4>${t("sparring.proposals")}</h4>
            ${findingList(t, report.proposals.map((proposal) => this.proposalRow(t, proposal)))}`
        : nothing}
      ${report.questions.length
        ? html`<h4>${t("sparring.questions")}</h4>
            <ul class="questions">
              ${report.questions.map((question) => html`<li>${question}</li>`)}
            </ul>`
        : nothing}
      ${report.dropped > 0
        ? html`<p class="muted">
            ${report.dropped === 1 ? t("sparring.report.dropped.one") : t("sparring.report.dropped.many", { count: report.dropped })}
          </p>`
        : nothing}`;
  }

  private findingRow(t: Translate, finding: SparringReport["findings"][number]): FindingRow {
    const area = AREA_ICONS[finding.area] ? finding.area : "other";
    return {
      key: finding.title,
      icon: AREA_ICONS[area],
      title: finding.title,
      detail: t("sparring.evidence", { evidence: finding.evidence }),
      chips: [html`<span class="chip">${t(`sparring.area.${area}`)}</span>`],
      state: finding.checked ? undefined : "flag",
      notes: finding.checked
        ? undefined
        : [
            html`<div class="note warn">
              <ha-icon icon="mdi:alert-outline"></ha-icon><span>${t("sparring.findings.unchecked")}</span>
            </div>`,
          ],
    };
  }

  /** Template → problem → better wording. */
  private textRow(t: Translate, text: SparringReport["texts"][number]): FindingRow {
    return {
      key: text.key,
      icon: "mdi:text-box-edit-outline",
      title: t("sparring.text.title"),
      detail: `„${text.template}“`,
      chips: [html`<span class="chip" title=${t("sparring.text.key")}>${text.key}</span>`],
      notes: [
        html`<dl class="text-steps">
          <dt>${t("sparring.text.problem")}</dt>
          <dd>${text.problem}</dd>
          <dt>${t("sparring.text.better")}</dt>
          <dd>„${text.better}“</dd>
        </dl>`,
      ],
    };
  }

  /** Now and proposed, why, what Joe's replay says – and a way to the setting, nothing more. */
  private proposalRow(t: Translate, proposal: SparringProposal): FindingRow {
    const key = proposal.setting.replace(/^rules\./, "");
    const config = this.state?.config;
    const stored = config ? (config.rules as unknown as Record<string, unknown>)[key] : undefined;
    const current = proposal.current ?? (stored as SparringProposal["current"] | undefined) ?? null;
    const value = (v: SparringProposal["value"] | null) =>
      v == null ? "–" : t.optional(`rule.${key}.${String(v)}`) ?? String(v);
    const notes: TemplateResult[] = [];
    if (proposal.reason) {
      notes.push(infoNote(t("sparring.proposal.reason", { reason: proposal.reason })));
    }
    notes.push(infoNote(this.replayText(t, proposal, key, current)));
    const isRule = proposal.setting.startsWith("rules.");
    return {
      key: proposal.setting,
      icon: "mdi:tune-variant",
      title: t.optional(`rule.${key}`) ?? proposal.setting,
      detail: t("sparring.proposal.values", { current: value(current), value: value(proposal.value) }),
      notes,
      tip: isRule ? "sparring_change" : undefined,
      actions: isRule
        ? [
            rowButton(t("sparring.proposal.change"), "mdi:arrow-right", () =>
              navigate(this, { tab: "settings", section: "rules", id: key }),
            ),
          ]
        : undefined,
    };
  }

  private replayText(t: Translate, proposal: SparringProposal, key: string, current: SparringProposal["current"]): string {
    const replay = proposal.replay;
    if (!replay?.best) {
      return t("sparring.proposal.replay.none");
    }
    const best = t.optional(`rule.${key}.${replay.best}`) ?? replay.best;
    const said =
      replay.best === String(proposal.value)
        ? t("sparring.proposal.replay.agrees", { best })
        : replay.best === String(current)
          ? t("sparring.proposal.replay.yours", { best })
          : t("sparring.proposal.replay.other", { best });
    const costs = replay.cost;
    const mine = current == null ? undefined : costs?.[String(current)];
    const theirs = costs?.[String(proposal.value)];
    if (typeof mine !== "number" || typeof theirs !== "number") {
      return said;
    }
    const diff = theirs - mine;
    const currency = this.hass?.config?.currency;
    const text =
      Math.abs(diff) < 0.005
        ? t("learn.replay.equal")
        : t(diff > 0 ? "learn.replay.more" : "learn.replay.less", { value: euroText(t, Math.abs(diff), currency) });
    return `${said} ${t("sparring.proposal.replay.cost", { diff: text })}`;
  }
}

define("joe-sparring-reports", JoeSparringReports);
