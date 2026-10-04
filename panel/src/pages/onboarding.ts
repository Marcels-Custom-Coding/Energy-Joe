import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { displayTitle, swoosh } from "../components/bits";
import "../components/pose";
import "../components/review";
import { cents, tariffText } from "../components/texts";
import { tip } from "../components/tip";
import { define } from "../define";
import { energyKwh, formatNumber } from "../entities";
import type { Translate } from "../i18n";
import { shared } from "../styles/shared";
import type { Check, Discovery, HomeAssistant, JoeConfig, JoeInfo, OnboardingStep } from "../types";
import "./questions";

/** "1 Fläche", "2 Flächen" – words are stored as "singular|plural". */
function count(t: Translate, n: number, key: "word.plane" | "word.person" | "word.calendar"): string {
  const [one, other] = t(key).split("|");
  return `${formatNumber(t.lang, n, 0)} ${n === 1 ? one : other}`;
}

const HEATING_LABELS: Record<string, string> = {
  climate: "q.heating.climate",
  heat_pump: "q.heating.heat_pump",
  electric_heating: "q.heating.electric",
  none: "q.heating.none",
};

/** The setup assistant: Joe introduces himself, looks around and asks. */
export class JoeOnboarding extends LitElement {
  @property() step: OnboardingStep = "welcome";
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) info?: JoeInfo;
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) config?: JoeConfig;
  @property({ attribute: false }) discovery?: Discovery;
  @property({ attribute: false }) checks: Check[] = [];
  @property({ type: Boolean }) discovering = false;
  @property({ type: Boolean }) discoveryFailed = false;

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      .wrap {
        display: grid;
        grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
        gap: 32px;
        align-items: center;
        max-width: 1000px;
        margin: 0 auto;
        padding-block: 20px 32px;
      }
      joe-pose {
        width: 100%;
        max-width: 440px;
        justify-self: center;
      }
      .display {
        font-size: clamp(38px, 5.4vw, 60px);
      }
      details {
        margin-top: 14px;
        color: var(--joe-ink-2);
        max-width: 58ch;
      }
      summary {
        cursor: pointer;
        font-weight: 600;
        color: var(--joe-ink);
      }
      details p {
        margin: 8px 0 0;
        line-height: 1.5;
      }
      .found {
        margin-top: 18px;
        max-width: 58ch;
      }
      .found p {
        margin: 0 0 8px;
        font-weight: 600;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .wrap.wide {
        grid-template-columns: minmax(0, 0.55fr) minmax(0, 1.45fr);
        align-items: start;
        max-width: 1120px;
      }
      .wrap.wide joe-pose {
        position: sticky;
        top: 96px;
      }
      joe-review {
        margin-top: 18px;
      }
      .looking {
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 800;
        text-transform: uppercase;
        font-size: 28px;
        color: var(--joe-muted);
        margin-top: 18px;
      }
      .failed {
        margin-top: 16px;
        color: var(--joe-crit);
        font-weight: 600;
      }
      .lines {
        display: grid;
        margin-top: 18px;
        max-width: 520px;
        border-radius: 12px;
        background: var(--joe-surface);
        box-shadow: inset 0 0 0 1px var(--joe-line);
        padding: 4px 16px;
      }
      .lines div {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        padding: 10px 0;
        border-top: 1px solid var(--joe-line);
      }
      .lines div:first-child {
        border-top: 0;
      }
      .lines span:first-child {
        color: var(--joe-ink-2);
      }
      .lines span:last-child {
        font-weight: 600;
        text-align: right;
      }
      @media (max-width: 760px) {
        .wrap,
        .wrap.wide {
          grid-template-columns: 1fr;
          gap: 16px;
          padding-block: 4px 24px;
        }
        joe-pose {
          max-width: 300px;
        }
        .wrap.wide joe-pose {
          position: static;
          max-width: 200px;
        }
      }
    `,
  ];

  protected render() {
    const t = this.t;
    if (!t) {
      return nothing;
    }
    switch (this.step) {
      case "welcome":
        return this.layout(
          "welcome",
          html`${displayTitle(t("onb.welcome.title"), "h1")} ${swoosh}
            <p class="lead">${t("onb.welcome.lead")}</p>
            <div class="calm"><span class="pill-sim">${t("mode.simulation")}</span>${t("onb.calm")}</div>
            <details data-notip>
              <summary>${t("onb.welcome.more")}</summary>
              ${t("onb.welcome.more.text")
                .split("\n")
                .map((part) => html`<p>${part}</p>`)}
            </details>
            <div class="actions" data-tipped>
              <button type="button" class="btn btn-primary" @click=${() => this.go("scan")}>
                ${t("onb.welcome.go")}
              </button>
              ${tip(t, "scan_start")}
            </div>`,
        );
      case "scan":
        return this.renderScan(t);
      case "questions":
        return html`<joe-questions
          .hass=${this.hass}
          .t=${t}
          .config=${this.config}
          .discovery=${this.discovery}
        ></joe-questions>`;
      case "done":
        return this.renderDone(t);
    }
  }

  private renderScan(t: Translate): TemplateResult {
    if (this.discovering || (!this.discovery && !this.discoveryFailed)) {
      return this.layout(
        "scout",
        html`${displayTitle(t("onb.scan.title"))} ${swoosh}
          <p class="lead">${t("onb.scan.lead")}</p>
          ${this.renderEnergy(t)}
          <div class="looking" role="status">${t("scan.looking")}</div>`,
      );
    }
    return html`<div class="wrap wide">
      <joe-pose name="scout"></joe-pose>
      <div>
        ${displayTitle(t("scan.title"))} ${swoosh}
        <p class="lead">${t("scan.lead")}</p>
        ${this.discoveryFailed ? html`<p class="failed">${t("scan.failed")}</p>` : nothing}
        <joe-review
          .hass=${this.hass}
          .t=${t}
          .config=${this.config}
          .discovery=${this.discovery}
          .checks=${this.checks}
        ></joe-review>
        <div class="actions">
          <button type="button" class="btn btn-primary" data-notip @click=${() => this.go("questions")}>
            ${t("onb.next")}
          </button>
          <span class="with-tip" data-tipped>
            <button type="button" class="btn btn-secondary" @click=${this.rediscover}>${t("scan.again")}</button>
            ${tip(t, "rescan")}
          </span>
          <button type="button" class="btn btn-ghost" data-notip @click=${() => this.go("welcome")}>
            ${t("onb.back")}
          </button>
        </div>
      </div>
    </div>`;
  }

  private renderDone(t: Translate): TemplateResult {
    return this.layout(
      "thumbs",
      html`${displayTitle(t("onb.done.title"))} ${swoosh}
        ${this.config ? this.renderSummary(t, this.config) : nothing}
        <div class="calm"><span class="pill-sim">${t("mode.simulation")}</span>${t("onb.done.lead")}</div>
        <div class="actions">
          <span class="with-tip" data-tipped>
            <button type="button" class="btn btn-primary" @click=${this.complete}>${t("onb.done.go")}</button>
            ${tip(t, "start")}
          </span>
          <button type="button" class="btn btn-ghost" data-notip @click=${() => this.go("scan")}>
            ${t("onb.done.change")}
          </button>
        </div>`,
    );
  }

  private renderSummary(t: Translate, config: JoeConfig): TemplateResult {
    const hass = this.hass;
    const capacity = config.batteries.reduce(
      (sum, b) => sum + (b.capacity_kwh ?? (hass ? energyKwh(hass, b.capacity_entity) : null) ?? 0),
      0,
    );
    const choice = (key: string, labels: Record<string, string>) => {
      const value = config.answers[key];
      if (value === "unknown") {
        return t("sum.unknown");
      }
      const values = Array.isArray(value) ? (value as string[]) : typeof value === "string" ? [value] : [];
      return values.length ? values.map((v) => t.optional(labels[v] ?? "") ?? v).join(", ") : t("sum.open");
    };
    const forecast = this.discovery?.forecast;
    const lines: [string, string][] = [
      [
        t("sum.batteries"),
        config.batteries.length
          ? t("sum.batteries.value", {
              count: config.batteries.length,
              kwh: capacity ? formatNumber(t.lang, capacity, 1) : "?",
            })
          : t("sum.none"),
      ],
      [t("sum.tariff"), config.tariff.kind === "unknown" ? t("sum.unknown") : tariffText(t, config.tariff, false)],
      [
        t("sum.feed_in"),
        config.tariff.feed_in_price != null
          ? `${cents(t, config.tariff.feed_in_price)} ct`
          : config.tariff.feed_in_entity
            ? t("sum.from_sensor")
            : t("sum.unknown"),
      ],
      [
        t("sum.forecast"),
        config.forecast.provider
          ? forecast
            ? t("sum.forecast.value", { provider: forecast.provider_name, planes: count(t, forecast.planes, "word.plane") })
            : config.forecast.provider
          : t("sum.none"),
      ],
      [t("sum.heating"), choice("heating", HEATING_LABELS)],
      [
        t("sum.hot_water"),
        choice("hot_water", {
          hot_water_heat_pump: "q.hot_water.heat_pump",
          electric: "q.hot_water.electric",
          heating: "q.hot_water.heating",
          other: "q.hot_water.other",
        }),
      ],
      [t("sum.ev"), choice("ev", { yes: "q.ev.yes", no: "q.ev.no" })],
      [
        t("sum.household"),
        t("sum.household.value", {
          persons: count(t, config.persons.length, "word.person"),
          calendars: count(
            t,
            config.persons.reduce((sum, p) => sum + p.calendars.length, 0),
            "word.calendar",
          ),
        }),
      ],
    ];
    return html`<div class="lines">
      ${lines.map(([label, value]) => html`<div><span>${label}</span><span>${value}</span></div>`)}
    </div>`;
  }

  private rediscover(): void {
    this.dispatchEvent(new CustomEvent("joe-rediscover", { bubbles: true, composed: true }));
  }

  private layout(pose: string, content: TemplateResult): TemplateResult {
    return html`<div class="wrap">
      <joe-pose name=${pose}></joe-pose>
      <div>${content}</div>
    </div>`;
  }

  private renderEnergy(t: Translate): TemplateResult {
    const energy = this.info?.energy;
    if (!energy?.configured || !energy.sources) {
      return html`<div class="found"><p>${t("onb.scan.energy.none")}</p></div>`;
    }
    const items: [number, string][] = [
      [energy.sources.grid ?? 0, t("energy.grid")],
      [energy.sources.solar ?? 0, t("energy.solar")],
      [energy.sources.battery ?? 0, t("energy.battery")],
      [energy.devices ?? 0, t("energy.devices")],
    ];
    return html`<div class="found">
      <p>${t("onb.scan.energy")}</p>
      <div class="chips">
        ${items.map(
          ([count, label]) =>
            html`<span class="chip read"><ha-icon icon="mdi:eye-outline"></ha-icon>${count} ${label}</span>`,
        )}
      </div>
    </div>`;
  }

  private go(step: OnboardingStep): void {
    this.dispatchEvent(new CustomEvent("joe-onboarding", { detail: { step }, bubbles: true, composed: true }));
  }

  private complete(): void {
    this.dispatchEvent(
      new CustomEvent("joe-onboarding", {
        detail: { step: "done", completed: true },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

define("joe-onboarding", JoeOnboarding);
