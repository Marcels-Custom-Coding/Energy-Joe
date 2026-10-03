import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { asset } from "./assets";
import { displayTitle, swoosh } from "./components/bits";
import "./components/empty-state";
import "./components/pose";
import "./components/sim-switch";
import { define } from "./define";
import { ensureFonts } from "./fonts";
import { translator, type Translate, type TranslationKey } from "./i18n";
import "./pages/onboarding";
import "./pages/overview";
import "./pages/settings";
import { shared } from "./styles/shared";
import { tokens } from "./styles/tokens";
import {
  ONBOARDING_STEPS,
  PAGES,
  type HomeAssistant,
  type JoeInfo,
  type JoeMode,
  type JoeState,
  type OnboardingStep,
  type Page,
  type PanelRoute,
} from "./types";

// Pages that show Joe's empty state until their feature arrives.
const COMING: Partial<Record<Page, { pose: string; title: TranslationKey; text: TranslationKey }>> = {
  plan: { pose: "plan", title: "plan.title", text: "plan.text" },
  history: { pose: "inspect", title: "history.title", text: "history.text" },
  learn: { pose: "learn", title: "learn.title", text: "learn.text" },
  devices: { pose: "switch", title: "devices.title", text: "devices.text" },
};

export class EnergyJoePanel extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: Boolean, reflect: true }) narrow = false;
  @property({ attribute: false }) route?: PanelRoute;

  @state() private joe?: JoeState;
  @state() private info?: JoeInfo;
  @state() private failed = false;
  @state() private liveDialog = false;
  @state() private notice = "";

  private unsubscribe?: Promise<() => Promise<void>>;
  private infoRequested = false;

  private get t(): Translate {
    return translator(this.hass?.language);
  }

  private get page(): Page {
    const segment = (this.route?.path ?? "").split("/")[1] ?? "";
    return (PAGES as string[]).includes(segment) ? (segment as Page) : "overview";
  }

  connectedCallback(): void {
    super.connectedCallback();
    ensureFonts();
    this.subscribe();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.unsubscribe?.then((unsub) => unsub()).catch(() => undefined);
    this.unsubscribe = undefined;
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has("hass") && this.hass) {
      this.setAttribute("theme", this.hass.themes?.darkMode ? "dark" : "light");
      this.subscribe();
      if (!this.infoRequested) {
        this.infoRequested = true;
        this.hass
          .callWS<JoeInfo>({ type: "energy_joe/info" })
          .then((info) => {
            this.info = info;
          })
          .catch(() => undefined);
      }
    }
  }

  private subscribe(): void {
    if (!this.hass || this.unsubscribe || !this.isConnected) {
      return;
    }
    this.unsubscribe = this.hass.connection.subscribeMessage<JoeState>(
      (joe) => {
        this.joe = joe;
        this.failed = false;
      },
      { type: "energy_joe/subscribe" },
    );
    this.unsubscribe.catch(() => {
      this.failed = true;
      this.unsubscribe = undefined;
    });
  }

  protected render(): TemplateResult {
    const t = this.t;
    if (this.failed) {
      return html`<main><joe-empty-state pose="inspect" heading=${t("error.title")} text=${t("error.text")}></joe-empty-state></main>`;
    }
    if (!this.joe) {
      return html`<div class="loading">${t("loading")}</div>`;
    }
    const onboarding = !this.joe.onboarding.completed;
    return html`
      <header>
        ${this.joe.mode === "simulation" ? html`<div class="simband" aria-hidden="true"></div>` : nothing}
        <div class="bar">
          ${this.narrow
            ? html`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>`
            : nothing}
          <div class="brand">
            <img class="light" src=${asset("joe-head.webp")} alt="" width="36" height="36" />
            <img class="dark" src=${asset("joe-head-dark.webp")} alt="" width="36" height="36" />
            <span class="wordmark">ENERGY <b>JOE</b></span>
          </div>
          ${onboarding ? this.renderSteps(t) : this.renderTabs(t)}
          <joe-sim-switch
            .mode=${this.joe.mode}
            .t=${t}
            ?compact=${this.narrow}
            @joe-mode-switch=${this.onModeSwitch}
          ></joe-sim-switch>
        </div>
      </header>
      ${this.notice ? html`<div class="notice" role="alert">${this.notice}</div>` : nothing}
      <main
        @joe-onboarding=${this.onOnboarding}
        @joe-set-mode=${(ev: CustomEvent<{ mode: JoeMode }>) => this.setMode(ev.detail.mode)}
      >
        ${onboarding
          ? html`<joe-onboarding .step=${this.joe.onboarding.step} .t=${t} .info=${this.info}></joe-onboarding>`
          : this.renderPage(t)}
      </main>
      ${this.liveDialog ? this.renderLiveDialog(t) : nothing}
    `;
  }

  private renderTabs(t: Translate): TemplateResult {
    return html`<nav class="tabs" aria-label=${t("nav.label")}>
      ${PAGES.map(
        (page) =>
          html`<a
            href=${this.href(page)}
            class=${page === this.page ? "on" : ""}
            aria-current=${page === this.page ? "page" : "false"}
            @click=${(ev: MouseEvent) => this.navigate(ev, page)}
            >${t(`tab.${page}`)}</a
          >`,
      )}
    </nav>`;
  }

  private renderSteps(t: Translate): TemplateResult {
    const current = ONBOARDING_STEPS.indexOf(this.joe?.onboarding.step ?? "welcome");
    return html`<ol class="steps" aria-label=${t("steps.label")}>
      ${ONBOARDING_STEPS.map(
        (step, i) =>
          html`<li class=${i < current ? "done" : i === current ? "on" : ""} aria-current=${i === current ? "step" : "false"}>
            ${i + 1} ${t(`step.${step}`)}
          </li>`,
      )}
    </ol>`;
  }

  private renderPage(t: Translate): TemplateResult {
    const page = this.page;
    if (page === "overview") {
      return html`<joe-overview .t=${t}></joe-overview>`;
    }
    if (page === "settings") {
      return html`<joe-settings .t=${t} .state=${this.joe} .info=${this.info}></joe-settings>`;
    }
    const coming = COMING[page];
    return coming
      ? html`<joe-empty-state
          pose=${coming.pose}
          heading=${t(coming.title)}
          text=${t(coming.text)}
          note=${t("soon")}
        ></joe-empty-state>`
      : html``;
  }

  private renderLiveDialog(t: Translate): TemplateResult {
    return html`<div class="scrim" @click=${this.closeDialog}>
      <div
        class="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="live-title"
        @click=${(ev: Event) => ev.stopPropagation()}
        @keydown=${(ev: KeyboardEvent) => ev.key === "Escape" && this.closeDialog()}
      >
        <joe-pose name="lever"></joe-pose>
        <div id="live-title">${displayTitle(t("live.title"))}</div>
        ${swoosh}
        <p class="lead">${t("live.text")}</p>
        <p class="unavailable">${t("live.unavailable")}</p>
        <div class="actions">
          <button type="button" class="btn btn-primary" disabled>${t("live.go")}</button>
          <button type="button" class="btn btn-secondary" @click=${this.closeDialog} autofocus>
            ${t("live.stay")}
          </button>
          <button type="button" class="btn btn-ghost" @click=${() => this.setMode("off", true)}>
            ${t("live.pause")}
          </button>
        </div>
      </div>
    </div>`;
  }

  private onModeSwitch(): void {
    if (this.joe?.mode === "off") {
      this.setMode("simulation");
    } else {
      this.liveDialog = true;
    }
  }

  private closeDialog(): void {
    this.liveDialog = false;
  }

  private async setMode(mode: JoeMode, closeDialog = false): Promise<void> {
    if (closeDialog) {
      this.liveDialog = false;
    }
    try {
      await this.hass?.callWS({ type: "energy_joe/set_mode", mode });
    } catch {
      this.showNotice(this.t("error.action"));
    }
  }

  private async onOnboarding(ev: CustomEvent<{ step?: OnboardingStep; completed?: boolean }>): Promise<void> {
    try {
      await this.hass?.callWS({ type: "energy_joe/onboarding", ...ev.detail });
      if (ev.detail.completed) {
        this.go("overview");
      }
    } catch {
      this.showNotice(this.t("error.action"));
    }
  }

  private showNotice(text: string): void {
    this.notice = text;
    window.setTimeout(() => {
      this.notice = "";
    }, 5000);
  }

  private href(page: Page): string {
    const prefix = this.route?.prefix ?? "/energy-joe";
    return page === "overview" ? prefix : `${prefix}/${page}`;
  }

  private navigate(ev: MouseEvent, page: Page): void {
    if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button !== 0) {
      return;
    }
    ev.preventDefault();
    this.go(page);
  }

  private go(page: Page): void {
    history.pushState(null, "", this.href(page));
    window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
  }

  static styles = [
    tokens,
    shared,
    css`
      :host {
        display: block;
        height: 100%;
        overflow-y: auto;
        background: var(--joe-bg);
        color: var(--joe-ink);
        font-size: 15px;
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
      }
      header {
        position: sticky;
        top: 0;
        z-index: 2;
        background: var(--joe-surface);
        box-shadow: 0 1px 0 var(--joe-line);
      }
      .simband {
        height: 6px;
        background: repeating-linear-gradient(-45deg, var(--joe-stripe-a) 0 10px, var(--joe-stripe-b) 10px 20px);
      }
      .bar {
        display: flex;
        align-items: center;
        gap: 10px 18px;
        padding: 10px 20px;
        min-height: 64px;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: none;
      }
      .brand img {
        width: 36px;
        height: 36px;
      }
      .brand .light {
        display: var(--joe-show-light);
      }
      .brand .dark {
        display: var(--joe-show-dark);
      }
      .wordmark {
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 800;
        font-size: 22px;
        line-height: 1;
        letter-spacing: 0.01em;
        white-space: nowrap;
      }
      .wordmark b {
        color: var(--joe-amber);
        font-weight: 800;
      }
      .tabs {
        display: flex;
        gap: 4px;
        flex: 1;
        min-width: 0;
        overflow-x: auto;
        scrollbar-width: none;
      }
      .tabs a {
        position: relative;
        isolation: isolate;
        padding: 9px 14px;
        border-radius: 7px;
        font-weight: 600;
        font-size: 15px;
        color: var(--joe-ink-2);
        text-decoration: none;
        white-space: nowrap;
        transition: color 0.12s, background 0.12s;
      }
      .tabs a:hover {
        background: var(--joe-surface-2);
        color: var(--joe-ink);
      }
      .tabs a:active {
        transform: scale(0.97);
      }
      .tabs a.on {
        color: var(--joe-amber-ink);
        background: transparent;
      }
      .tabs a.on::before {
        content: "";
        position: absolute;
        inset: 3px 0;
        background: var(--joe-amber);
        transform: skewX(-10deg);
        border-radius: 6px;
        z-index: -1;
      }
      .steps {
        display: flex;
        gap: 6px;
        flex: 1;
        justify-content: center;
        flex-wrap: wrap;
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .steps li {
        position: relative;
        isolation: isolate;
        padding: 6px 14px;
        font-size: 13px;
        font-weight: 700;
        color: var(--joe-muted);
        white-space: nowrap;
      }
      .steps li::before {
        content: "";
        position: absolute;
        inset: 0;
        transform: skewX(-10deg);
        border-radius: 5px;
        background: var(--joe-surface-2);
        z-index: -1;
      }
      .steps li.done {
        color: var(--joe-ink);
      }
      .steps li.done::before {
        background: var(--joe-amber-soft);
      }
      .steps li.on {
        color: var(--joe-amber-ink);
      }
      .steps li.on::before {
        background: var(--joe-amber);
      }
      joe-sim-switch {
        margin-left: auto;
        flex: none;
      }
      main {
        padding: 24px 20px 48px;
      }
      .loading {
        display: grid;
        place-items: center;
        min-height: 60vh;
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 700;
        font-size: 22px;
        color: var(--joe-muted);
      }
      .notice {
        margin: 12px 20px 0;
        padding: 10px 14px;
        border-radius: 10px;
        background: var(--joe-crit-soft);
        color: var(--joe-crit);
        font-weight: 600;
      }
      .scrim {
        position: fixed;
        inset: 0;
        z-index: 10;
        display: grid;
        place-items: center;
        padding: 16px;
        background: rgba(7, 17, 24, 0.55);
      }
      .sheet {
        width: min(520px, 100%);
        max-height: calc(100% - 32px);
        overflow-y: auto;
        background: var(--joe-surface);
        border-radius: 18px;
        padding: 22px;
        box-shadow: var(--joe-shadow);
      }
      .sheet joe-pose {
        max-width: 300px;
        margin: 0 auto 8px;
      }
      .sheet .display {
        font-size: 40px;
      }
      .unavailable {
        margin: 14px 0 0;
        padding: 10px 12px;
        border-radius: 10px;
        background: var(--joe-surface-2);
        color: var(--joe-ink-2);
        font-size: 14px;
      }
      @media (max-width: 760px) {
        .bar {
          flex-wrap: wrap;
          padding: 8px 12px;
        }
        .tabs,
        .steps {
          order: 3;
          flex-basis: 100%;
          justify-content: flex-start;
        }
        .steps {
          flex-wrap: nowrap;
          overflow-x: auto;
        }
        main {
          padding: 16px 16px 40px;
        }
      }
    `,
  ];
}

define("energy-joe-panel", EnergyJoePanel);
