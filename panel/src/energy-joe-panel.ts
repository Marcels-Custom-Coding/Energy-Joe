import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { asset } from "./assets";
import { displayTitle, swoosh } from "./components/bits";
import "./components/empty-state";
import "./components/entity-picker";
import "./components/pose";
import "./components/sheet";
import "./components/sim-switch";
import { tip } from "./components/tip";
import type { ConfigChange, PickEvent, PickResult } from "./config";
import { define } from "./define";
import "./editors/action-editor";
import "./editors/battery-editor";
import "./editors/consumers";
import "./editors/household";
import "./editors/tariff-editor";
import { ensureFonts } from "./fonts";
import { translator, type Translate } from "./i18n";
import "./pages/devices";
import "./pages/history";
import "./pages/learn";
import "./pages/onboarding";
import "./pages/overview";
import "./pages/plan";
import "./pages/settings";
import { shared } from "./styles/shared";
import { tokens } from "./styles/tokens";
import {
  ONBOARDING_STEPS,
  PAGES,
  type AdoptResult,
  type Check,
  type Discovery,
  type HomeAssistant,
  type JoeInfo,
  type JoeMode,
  type JoeState,
  type OnboardingStep,
  type Page,
  type PanelRoute,
} from "./types";

const MODES: JoeMode[] = ["simulation", "advisory", "live", "off"];
const MODE_ICONS: Record<JoeMode, string> = {
  simulation: "mdi:pause",
  advisory: "mdi:comment-question-outline",
  live: "mdi:play",
  off: "mdi:power",
};
const AVAILABLE: JoeMode[] = MODES;


export class EnergyJoePanel extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: Boolean, reflect: true }) narrow = false;
  @property({ attribute: false }) route?: PanelRoute;

  @state() private joe?: JoeState;
  @state() private info?: JoeInfo;
  @state() private failed = false;
  @state() private modeDialog = false;
  @state() private notice = "";
  @state() private discovery?: Discovery;
  @state() private discovering = false;
  @state() private discoveryFailed = false;
  @state() private checks: Check[] = [];
  @state() private picker?: PickEvent;
  @state() private editor?: { editor: string; id?: string };

  private unsubscribe?: Promise<() => Promise<void>>;
  private infoRequested = false;
  private adopted = false;

  constructor() {
    super();
    // Pages, editors and the picker ask the panel to save, pick and edit.
    this.addEventListener("joe-config", (ev) => this.onConfig(ev as CustomEvent<ConfigChange>));
    this.addEventListener("joe-pick", (ev) => {
      this.picker = (ev as CustomEvent<PickEvent>).detail;
    });
    this.addEventListener("joe-edit", (ev) => {
      this.editor = (ev as CustomEvent<{ editor: string; id?: string }>).detail;
    });
  }

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

  protected updated(): void {
    const joe = this.joe;
    if (!joe || this.discovering || this.discoveryFailed) {
      return;
    }
    // Joe looks around and takes over what he finds as soon as the setup
    // reaches that step; the settings only need to know what he would find.
    const inScan = !joe.onboarding.completed && joe.onboarding.step === "scan";
    if (inScan && !this.adopted) {
      this.scan();
    } else if (
      !this.discovery &&
      (joe.onboarding.completed ? ["settings", "devices"].includes(this.page) : joe.onboarding.step !== "welcome")
    ) {
      this.look();
    }
  }

  /** Look around, take over the findings (user values stay) and check them. */
  private async scan(): Promise<void> {
    if (!this.hass || this.discovering) {
      return;
    }
    this.discovering = true;
    this.discoveryFailed = false;
    try {
      const result = await this.hass.callWS<AdoptResult>({ type: "energy_joe/adopt" });
      this.discovery = result.discovery;
      this.checks = result.checks;
      this.adopted = true;
    } catch {
      this.discoveryFailed = true;
    } finally {
      this.discovering = false;
    }
  }

  /** Look around without changing anything (for suggestions in the settings). */
  private async look(): Promise<void> {
    if (!this.hass || this.discovering) {
      return;
    }
    this.discovering = true;
    try {
      this.discovery = await this.hass.callWS<Discovery>({ type: "energy_joe/discover" });
      await this.refreshChecks();
    } catch {
      this.discoveryFailed = true;
    } finally {
      this.discovering = false;
    }
  }

  private async refreshChecks(): Promise<void> {
    try {
      const result = await this.hass?.callWS<{ checks: Check[] }>({ type: "energy_joe/check" });
      this.checks = result?.checks ?? [];
    } catch {
      // Checks are a courtesy; the next change tries again.
    }
  }

  private onConfig(ev: CustomEvent<ConfigChange>): void {
    ev.stopPropagation();
    ev.detail.result = this.saveConfig(ev.detail);
  }

  private async saveConfig(change: ConfigChange): Promise<boolean> {
    if (!this.hass) {
      return false;
    }
    try {
      await this.hass.callWS({ type: "energy_joe/config/update", patch: change.patch, source: change.source ?? "user" });
    } catch {
      this.showNotice(this.t("error.action"));
      return false;
    }
    this.refreshChecks();
    return true;
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
      return html`<main><joe-empty-state pose="puzzled" heading=${t("error.title")} text=${t("error.text")}></joe-empty-state></main>`;
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
            data-notip
            .mode=${this.joe.mode}
            .t=${t}
            ?compact=${this.narrow}
            ?running=${!onboarding}
            @joe-mode-switch=${this.onModeSwitch}
          ></joe-sim-switch>
        </div>
      </header>
      ${this.notice ? html`<div class="notice" role="alert">${this.notice}</div>` : nothing}
      <main
        @joe-onboarding=${this.onOnboarding}
        @joe-rediscover=${() => this.scan()}
        @joe-set-mode=${(ev: CustomEvent<{ mode: JoeMode }>) => this.setMode(ev.detail.mode)}
        @joe-navigate=${(ev: CustomEvent<{ page: Page }>) => this.go(ev.detail.page)}
      >
        ${onboarding
          ? html`<joe-onboarding
              .step=${this.joe.onboarding.step}
              .t=${t}
              .info=${this.info}
              .hass=${this.hass}
              .config=${this.joe.config}
              .discovery=${this.discovery}
              .checks=${this.checks}
              ?discovering=${this.discovering}
              ?discoveryFailed=${this.discoveryFailed}
            ></joe-onboarding>`
          : this.renderPage(t)}
      </main>
      ${this.modeDialog ? this.renderModeDialog(t) : nothing} ${this.editor ? this.renderEditor(t) : nothing}
      ${this.picker ? this.renderPicker(t) : nothing}
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
      return html`<joe-overview
        .t=${t}
        .hass=${this.hass}
        .state=${this.joe}
        prefix=${this.route?.prefix ?? "/energy-joe"}
      ></joe-overview>`;
    }
    if (page === "history") {
      return html`<joe-history .t=${t} .hass=${this.hass} .state=${this.joe}></joe-history>`;
    }
    if (page === "plan") {
      return html`<joe-plan-page .t=${t} .hass=${this.hass} .state=${this.joe}></joe-plan-page>`;
    }
    if (page === "learn") {
      return html`<joe-learn-page .t=${t} .hass=${this.hass} .state=${this.joe}></joe-learn-page>`;
    }
    if (page === "devices") {
      return html`<joe-devices-page
        .t=${t}
        .hass=${this.hass}
        .state=${this.joe}
        .discovery=${this.discovery}
        .info=${this.info}
      ></joe-devices-page>`;
    }
    if (page === "settings") {
      return html`<joe-settings
        .t=${t}
        .hass=${this.hass}
        .state=${this.joe}
        .info=${this.info}
        .discovery=${this.discovery}
        .checks=${this.checks}
      ></joe-settings>`;
    }
    return html``;
  }

  private renderModeDialog(t: Translate): TemplateResult {
    const current = this.joe?.mode ?? "simulation";
    return html`<div class="scrim" @click=${this.closeDialog}>
      <div
        class="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mode-title"
        @click=${(ev: Event) => ev.stopPropagation()}
        @keydown=${(ev: KeyboardEvent) => ev.key === "Escape" && this.closeDialog()}
      >
        <joe-pose name="lever"></joe-pose>
        <div data-tipped>
          <div id="mode-title">${displayTitle(t("mode.dialog.title"), "h2", tip(t, "mode"))}</div>
          ${swoosh}
          ${this.renderReadiness(t)}
          <div class="modes" role="group" aria-labelledby="mode-title">
            ${MODES.map((mode) => {
              const available = AVAILABLE.includes(mode);
              return html`<button
                type="button"
                class="mode ${mode}"
                aria-pressed=${String(mode === current)}
                ?disabled=${!available}
                @click=${() => this.chooseMode(mode)}
              >
                <span class="knob"><ha-icon icon=${MODE_ICONS[mode]}></ha-icon></span>
                <span class="label">
                  <b>${t(`mode.${mode}`)}</b>
                  <small>${t(`mode.${mode}.desc`)}</small>
                </span>
                ${mode === current
                  ? html`<span class="chip ok"><ha-icon icon="mdi:check"></ha-icon>${t("mode.current")}</span>`
                  : available
                    ? nothing
                    : html`<span class="chip soon">${t("mode.soon")}</span>`}
              </button>`;
            })}
          </div>
        </div>
        <div class="actions">
          <button type="button" class="btn btn-secondary" data-notip @click=${this.closeDialog} autofocus>
            ${t("mode.close")}
          </button>
        </div>
      </div>
    </div>`;
  }

  /** Which batteries Joe could really steer in "suggest" and "live". */
  private renderReadiness(t: Translate): TemplateResult | typeof nothing {
    const joe = this.joe;
    const ready = joe?.control?.ready ?? {};
    const steerable = (joe?.config.batteries ?? []).filter((b) => ready[b.id] && ready[b.id] !== "not_controllable");
    if (!steerable.length) {
      return nothing;
    }
    const untested = steerable.filter((b) => ready[b.id] !== "ready");
    if (!untested.length) {
      return nothing;
    }
    const text =
      untested.length === steerable.length
        ? t("mode.none_tested")
        : t("mode.untested", { names: untested.map((b) => b.name).join(", ") });
    return html`<div class="note warn readiness"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${text}</span></div>`;
  }

  private renderEditor(t: Translate): TemplateResult {
    const editor = this.editor;
    const config = this.joe?.config;
    const close = () => {
      this.editor = undefined;
    };
    let content: TemplateResult = html``;
    let label = "";
    let wide = false;
    switch (editor?.editor) {
      case "battery":
        label = t("edit.battery.label");
        content = html`<joe-battery-editor
          .hass=${this.hass}
          .t=${t}
          .config=${config}
          .discovery=${this.discovery}
          .info=${this.info}
          batteryId=${editor.id ?? ""}
        ></joe-battery-editor>`;
        break;
      case "tariff":
        label = t("edit.tariff.label");
        content = html`<joe-tariff-editor
          .hass=${this.hass}
          .t=${t}
          .config=${config}
          .discovery=${this.discovery}
        ></joe-tariff-editor>`;
        break;
      case "household":
        label = t("edit.household.label");
        content = html`<div class="sheet-title">${displayTitle(t("edit.household.title"), "h2", tip(t, "q_household"))}</div>
          <joe-household .hass=${this.hass} .t=${t} .config=${config} .discovery=${this.discovery}></joe-household>
          <div class="actions">
            <button type="button" class="btn btn-secondary" data-notip @click=${close}>${t("mode.close")}</button>
          </div>`;
        break;
      case "action":
        label = t("action.label");
        content = html`<joe-action-editor
          .hass=${this.hass}
          .t=${t}
          .config=${config}
          .discovery=${this.discovery}
          actionId=${editor.id ?? ""}
        ></joe-action-editor>`;
        break;
      case "consumers":
        label = t("edit.consumers.label");
        wide = true;
        content = html`<div class="sheet-title">${displayTitle(t("edit.consumers.title"))}</div>
          <joe-consumers .hass=${this.hass} .t=${t} .config=${config}></joe-consumers>
          <div class="actions">
            <button type="button" class="btn btn-secondary" data-notip @click=${close}>${t("mode.close")}</button>
          </div>`;
        break;
    }
    return html`<joe-sheet label=${label} closeLabel=${t("common.close")} ?wide=${wide} @joe-close=${close}>
      ${content}
    </joe-sheet>`;
  }

  private renderPicker(t: Translate): TemplateResult {
    const picker = this.picker;
    const finish = (result: PickResult | null) => {
      picker?.resolve(result);
      this.picker = undefined;
    };
    return html`<joe-sheet
      label=${picker?.request.heading.replace(/\|/g, "") ?? ""}
      closeLabel=${t("common.close")}
      @joe-close=${() => finish(null)}
      @joe-picked=${(ev: CustomEvent<PickResult>) => finish(ev.detail)}
    >
      <joe-entity-picker .hass=${this.hass} .t=${t} .request=${picker?.request}></joe-entity-picker>
    </joe-sheet>`;
  }

  private onModeSwitch(): void {
    this.modeDialog = true;
  }

  private chooseMode(mode: JoeMode): void {
    this.modeDialog = false;
    if (mode !== this.joe?.mode) {
      this.setMode(mode);
    }
  }

  private closeDialog(): void {
    this.modeDialog = false;
  }

  private async setMode(mode: JoeMode): Promise<void> {
    try {
      await this.hass?.callWS({ type: "energy_joe/set_mode", mode });
    } catch {
      this.showNotice(this.t("error.action"));
    }
  }

  private async onOnboarding(ev: CustomEvent<{ step?: OnboardingStep; completed?: boolean }>): Promise<void> {
    if (ev.detail.step === "welcome") {
      // Starting over: Joe looks around again when the setup gets there.
      this.adopted = false;
      this.discoveryFailed = false;
    }
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
      .modes {
        display: grid;
        gap: 8px;
        margin-top: 16px;
      }
      .mode {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        min-height: 60px;
        padding: 8px 12px 8px 8px;
        border: 0;
        border-radius: 14px;
        cursor: pointer;
        text-align: left;
        background: var(--joe-surface-2);
        color: var(--joe-ink);
        transition: background 0.12s, box-shadow 0.12s, transform 0.12s;
      }
      .mode:hover:not([disabled]) {
        background: var(--joe-line);
      }
      .mode:active:not([disabled]) {
        transform: scale(0.98);
      }
      .mode[aria-pressed="true"],
      .mode[aria-pressed="true"]:hover {
        background: var(--joe-amber-soft);
        box-shadow: inset 0 0 0 2px var(--joe-amber);
      }
      .mode[disabled] {
        cursor: not-allowed;
        opacity: 0.6;
      }
      .readiness {
        margin-top: 14px;
      }
      .mode .knob {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        flex: none;
        background: #071118;
        color: #fea707;
      }
      .mode.simulation .knob {
        background: repeating-linear-gradient(-45deg, var(--joe-stripe-a) 0 8px, var(--joe-stripe-b) 8px 16px);
        color: #071118;
        box-shadow: inset 0 0 0 2px #071118;
      }
      .mode.live .knob {
        background: var(--joe-good);
        color: #ffffff;
      }
      .mode.advisory .knob {
        background: var(--joe-amber);
        color: #071118;
        box-shadow: inset 0 0 0 2px #071118;
      }
      .mode.off .knob {
        background: var(--joe-ink-2);
        color: var(--joe-surface);
      }
      .mode .label {
        flex: 1;
        min-width: 0;
      }
      .mode b {
        display: block;
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 800;
        font-size: 20px;
        letter-spacing: 0.03em;
        line-height: 1.05;
        text-transform: uppercase;
      }
      .mode small {
        display: block;
        font-size: 13.5px;
        color: var(--joe-ink-2);
        line-height: 1.35;
        margin-top: 2px;
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
