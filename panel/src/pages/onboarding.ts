import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { displayTitle, swoosh } from "../components/bits";
import { countText } from "../components/finding-rows";
import "../components/pose";
import "../components/review";
import { stepNav } from "../components/step-nav";
import { cents, tariffText } from "../components/texts";
import { tip } from "../components/tip";
import { define } from "../define";
import { energyKwh, entityName, formatNumber } from "../entities";
import { laterList, laterOpen, partHome, questionHome, type Home } from "../homes";
import type { Translate } from "../i18n";
import { PANEL, format, href, type Route } from "../router";
import { shared } from "../styles/shared";
import type { Check, Discovery, HomeAssistant, JoeConfig, JoeInfo, OnboardingStep } from "../types";
import "./questions";

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
  /** The panel's address, for the homes named in the summary. */
  @property({ attribute: false }) prefix = PANEL;
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
      @media (pointer: coarse) {
        summary {
          padding: 11px 0;
        }
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
      .step-nav {
        max-width: 1000px;
      }
      .step-nav.wide {
        max-width: 1120px;
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
      .lines .line {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr);
        gap: 2px 16px;
        padding: 10px 0;
        border-top: 1px solid var(--joe-line);
      }
      .lines .line:first-child {
        border-top: 0;
      }
      .lines .label {
        color: var(--joe-ink-2);
      }
      .lines .value {
        font-weight: 600;
        text-align: right;
        overflow-wrap: anywhere;
      }
      .lines .home {
        grid-column: 1 / -1;
        font-size: 13px;
        color: var(--joe-muted);
      }
      .lines .home a {
        color: var(--joe-amber-text);
        font-weight: 600;
        text-decoration: underline;
        text-underline-offset: 2px;
      }
      .homes-hint {
        margin: 14px 0 0;
        max-width: 520px;
        color: var(--joe-ink-2);
        font-size: 14px;
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
    const nav = stepNav(
      t,
      { back: () => this.go("welcome"), next: () => this.go("questions"), nextLabel: t("onb.next") },
      true,
    );
    return html`${nav}
      <div class="wrap wide">
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
    const nav = stepNav(t, {
      back: () => this.go("scan"),
      backLabel: t("onb.done.change"),
      next: () => this.complete(),
      nextLabel: t("onb.done.go"),
      nextTip: "start",
    });
    return html`${nav}
    ${this.layout(
      "thumbs",
      html`${displayTitle(t("onb.done.title"))} ${swoosh}
        ${this.config ? this.renderSummary(t, this.config) : nothing}
        <div class="calm"><span class="pill-sim">${t("mode.simulation")}</span>${t("onb.done.lead")}</div>
        <div class="actions">
          <span class="with-tip" data-tipped>
            <button type="button" class="btn btn-primary" @click=${() => this.complete()}>${t("onb.done.go")}</button>
            ${tip(t, "start")}
          </span>
          <button type="button" class="btn btn-ghost" data-notip @click=${() => this.go("scan")}>
            ${t("onb.done.change")}
          </button>
        </div>`,
    )}`;
  }

  private renderSummary(t: Translate, config: JoeConfig): TemplateResult {
    const hass = this.hass;
    const capacity = config.batteries.reduce(
      (sum, b) => sum + (b.capacity_kwh ?? (hass ? energyKwh(hass, b.capacity_entity) : null) ?? 0),
      0,
    );
    const later = laterList(config);
    /** "später" for a question put off and still open. */
    const putOff = (id: string) => later.includes(id) && laterOpen(config, id);
    const choice = (key: string, labels: Record<string, string>) => {
      if (putOff(key)) {
        return t("sum.later");
      }
      const value = config.answers[key];
      if (value === "unknown") {
        return t("sum.unknown");
      }
      const values = Array.isArray(value) ? (value as string[]) : typeof value === "string" ? [value] : [];
      return values.length ? values.map((v) => t.optional(labels[v] ?? "") ?? v).join(", ") : t("sum.open");
    };
    const context = (key: "weather_entity" | "holiday_entity") => {
      const entity = config.context[key];
      return entity ? (hass ? entityName(hass, entity) : entity) : t("sum.none");
    };
    const forecast = this.discovery?.forecast;
    const lines: [string, string, Home][] = [
      [
        t("sum.batteries"),
        config.batteries.length
          ? t("sum.batteries.value", {
              count: config.batteries.length,
              kwh: capacity ? formatNumber(t.lang, capacity, 1) : "?",
            })
          : t("sum.none"),
        partHome(t, "battery"),
      ],
      [
        t("sum.tariff"),
        putOff("tariff")
          ? t("sum.later")
          : config.tariff.kind === "unknown"
            ? t("sum.unknown")
            : tariffText(t, config.tariff, false),
        questionHome(t, "tariff"),
      ],
      [
        t("sum.feed_in"),
        config.tariff.feed_in_price != null
          ? `${cents(t, config.tariff.feed_in_price)} ct`
          : config.tariff.feed_in_entity
            ? t("sum.from_sensor")
            : putOff("feed_in")
              ? t("sum.later")
              : t("sum.unknown"),
        questionHome(t, "feed_in"),
      ],
      [
        t("sum.forecast"),
        config.forecast.provider
          ? forecast
            ? t("sum.forecast.value", {
                provider: forecast.provider_name,
                planes: countText(t, forecast.planes, "word.plane"),
              })
            : config.forecast.provider
          : t("sum.none"),
        partHome(t, "grid"),
      ],
      [t("sum.heating"), choice("heating", HEATING_LABELS), questionHome(t, "heating")],
      [t("sum.climate"), choice("climate", { yes: "sum.yes", no: "sum.no" }), questionHome(t, "climate")],
      [
        t("sum.hot_water"),
        choice("hot_water", {
          hot_water_heat_pump: "q.hot_water.heat_pump",
          electric: "q.hot_water.electric",
          heating: "q.hot_water.heating",
          other: "q.hot_water.other",
        }),
        questionHome(t, "hot_water"),
      ],
      [t("sum.ev"), choice("ev", { yes: "q.ev.yes", no: "q.ev.no" }), questionHome(t, "ev")],
      [
        t("sum.home_office"),
        choice("home_office", { yes: "sum.home_office.yes", no: "sum.home_office.no" }),
        questionHome(t, "home_office"),
      ],
      [
        t("sum.household"),
        putOff("household")
          ? t("sum.later")
          : t("sum.household.value", {
              persons: countText(t, config.persons.length, "word.person"),
              calendars: countText(
                t,
                config.persons.reduce((sum, p) => sum + p.calendars.length, 0),
                "word.calendar",
              ),
            }),
        questionHome(t, "household"),
      ],
      [t("sum.weather"), context("weather_entity"), partHome(t, "weather")],
      [t("sum.holiday"), context("holiday_entity"), partHome(t, "holiday")],
    ];
    return html`<p class="homes-hint">${t("onb.done.homes")}</p>
      <div class="lines">
        ${lines.map(
          ([label, value, home]) => html`<div class="line">
            <span class="label">${label}</span><span class="value">${value}</span>
            <span class="home">${t("sum.lives_at")} ${this.homeLink(home)}</span>
          </div>`,
        )}
      </div>`;
  }

  /** A home in the summary: a tap starts Joe and goes there. */
  private homeLink(home: Home): TemplateResult {
    return html`<a
      href=${href(this.prefix, home.to)}
      @click=${(ev: MouseEvent) => {
        if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey || ev.button !== 0) {
          return;
        }
        ev.preventDefault();
        this.complete(home.to);
      }}
      >${home.place}</a
    >`;
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
    const items = [
      countText(t, energy.sources.grid ?? 0, "word.grid"),
      countText(t, energy.sources.solar ?? 0, "word.solar"),
      countText(t, energy.sources.battery ?? 0, "word.battery"),
      countText(t, energy.devices ?? 0, "word.device"),
    ];
    return html`<div class="found">
      <p>${t("onb.scan.energy")}</p>
      <div class="chips">
        ${items.map((text) => html`<span class="chip read"><ha-icon icon="mdi:eye-outline"></ha-icon>${text}</span>`)}
      </div>
    </div>`;
  }

  private go(step: OnboardingStep): void {
    this.dispatchEvent(new CustomEvent("joe-onboarding", { detail: { step }, bubbles: true, composed: true }));
  }

  /** Starts Joe; `to` is where to go then (else the overview). */
  private complete(to?: Route): void {
    this.dispatchEvent(
      new CustomEvent("joe-onboarding", {
        detail: { step: "done", completed: true, to: to ? format(to) : undefined },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

define("joe-onboarding", JoeOnboarding);
