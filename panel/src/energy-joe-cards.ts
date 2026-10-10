import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { openInHa } from "./components/bits";
import "./components/car-charge";
import { planCostLine, planLines, planSentence, timeOf } from "./components/plan-text";
import { define } from "./define";
import { formatState } from "./entities";
import { translator, type Translate } from "./i18n";
import { PANEL, href } from "./router";
import { shared } from "./styles/shared";
import { tokens } from "./styles/tokens";
import type { ActionConfig, HomeAssistant, JoeState } from "./types";

// Dashboard cards Energy Joe brings along: "Joe heute Nacht" and "Auto laden".
// Loaded on every page as an extra module (like the icons), so they show up in
// the card picker without adding a resource by hand.

type Listener = (state: JoeState) => void;

/** One subscription to Joe's state for all cards on the page. */
const joe = {
  state: undefined as JoeState | undefined,
  listeners: new Set<Listener>(),
  unsubscribe: undefined as Promise<() => Promise<void>> | undefined,
  hass: undefined as HomeAssistant | undefined,
  failed: false,

  listen(hass: HomeAssistant, listener: Listener): () => void {
    this.listeners.add(listener);
    if (this.state) listener(this.state);
    if (!this.unsubscribe || this.hass?.connection !== hass.connection) {
      this.hass = hass;
      this.unsubscribe = hass.connection
        .subscribeMessage<JoeState>(
          (state) => {
            this.state = state;
            this.failed = false;
            for (const fn of this.listeners) fn(state);
          },
          { type: "energy_joe/subscribe" },
        )
        .catch((err) => {
          this.failed = true;
          this.unsubscribe = undefined;
          throw err;
        });
      this.unsubscribe.catch(() => undefined);
    }
    return () => {
      this.listeners.delete(listener);
      if (!this.listeners.size && this.unsubscribe) {
        void this.unsubscribe.then((unsub) => unsub()).catch(() => undefined);
        this.unsubscribe = undefined;
        this.state = undefined;
      }
    };
  },
};

/** What both cards share: Joe's state, the language, the look. */
abstract class JoeCard extends LitElement {
  @state() protected joe?: JoeState;
  @state() protected config: Record<string, unknown> = {};
  private _hass?: HomeAssistant;
  private stop?: () => void;

  static styles = [
    tokens,
    shared,
    css`
      :host {
        display: block;
      }
      ha-card {
        padding: 16px;
        background: var(--ha-card-background, var(--card-background-color, var(--joe-surface)));
        color: var(--primary-text-color, var(--joe-ink));
      }
      .head {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .head .eyebrow {
        flex: 1;
        min-width: 0;
      }
      a.head {
        min-height: 44px;
        margin: -8px -8px 0;
        padding: 0 8px;
        border-radius: 10px;
        color: inherit;
        text-decoration: none;
      }
      a.head:hover {
        background: var(--joe-surface-2);
      }
      .head .chev {
        color: var(--joe-muted);
      }
      .big {
        margin: 10px 0 4px;
        font-size: 17px;
        font-weight: 700;
        line-height: 1.35;
      }
      .lines {
        margin: 0;
        padding: 0;
        list-style: none;
        color: var(--joe-ink-2);
        font-size: 13.5px;
        display: grid;
        gap: 2px;
      }
      .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid var(--joe-line);
      }
      .muted {
        color: var(--joe-muted);
        font-size: 13px;
        margin: 8px 0 0;
      }
    `,
  ];

  @property({ attribute: false })
  get hass(): HomeAssistant | undefined {
    return this._hass;
  }
  set hass(hass: HomeAssistant | undefined) {
    const old = this._hass;
    this._hass = hass;
    if (hass) {
      this.setAttribute("theme", hass.themes?.darkMode ? "dark" : "light");
      if (!this.stop && this.isConnected) this.start();
    }
    this.requestUpdate("hass", old);
  }

  setConfig(config: Record<string, unknown>): void {
    this.config = config ?? {};
  }

  getCardSize(): number {
    return 3;
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (this._hass) this.start();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.stop?.();
    this.stop = undefined;
  }

  private start(): void {
    this.stop = joe.listen(this._hass!, (state) => (this.joe = state));
  }

  protected get t(): Translate {
    return translator(this._hass?.language);
  }

  protected render(): TemplateResult | typeof nothing {
    const t = this.t;
    if (!this._hass) {
      return nothing;
    }
    if (!this.joe) {
      return html`<ha-card><p class="muted">${t(joe.failed ? "cards.no_access" : "cards.loading")}</p></ha-card>`;
    }
    return html`<ha-card>${this.renderCard(t, this.joe)}</ha-card>`;
  }

  protected abstract renderCard(t: Translate, state: JoeState): TemplateResult;
}

/** "Joe heute Nacht": what Joe plans, what it costs, and skipping tonight. */
class EnergyJoeNightCard extends JoeCard {
  static getStubConfig(): Record<string, unknown> {
    return {};
  }

  protected renderCard(t: Translate, state: JoeState): TemplateResult {
    const plan = state.plan;
    const control = state.control;
    const night = plan?.window?.start;
    const skipped = Boolean(night) && control?.skip === night;
    const reason = control?.reason;
    const status =
      reason === "waiting" && plan?.window
        ? t("devices.status.waiting", { time: timeOf(plan.window.start) })
        : reason === "day"
          ? t("devices.status.day", { time: plan?.day ? timeOf(plan.day.defer_until) : "–" })
          : reason
            ? t.optional(`devices.status.${reason}`) ?? ""
            : "";
    const planPath = href(PANEL, { tab: "plan" });
    return html`<a
        class="head"
        href=${planPath}
        @click=${(ev: MouseEvent) => {
          if (ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.altKey || ev.button !== 0) return;
          ev.preventDefault();
          openInHa(planPath);
        }}
      >
        <div class="eyebrow"><ha-icon icon="energy-joe:joe"></ha-icon>${t("cards.night.title")}</div>
        <span class="chip ${state.mode === "live" ? "ok" : state.mode === "advisory" ? "learned" : ""}">${t(`mode.${state.mode}`)}</span>
        <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
      </a>
      ${plan
        ? html`<p class="big">${planSentence(t, plan)}</p>
            <ul class="lines">
              ${planLines(t, plan).map((line) => html`<li>${line}</li>`)}
              ${planCostLine(t, plan) ? html`<li>${planCostLine(t, plan)}</li>` : nothing}
            </ul>`
        : html`<p class="big">${t("devices.status.no_plan")}</p>`}
      ${status ? html`<p class="muted">${status}</p>` : nothing}
      ${night && state.mode !== "simulation" && state.mode !== "off"
        ? html`<div class="row">
            <span>${t("cards.night.skip")}</span>
            <button
              type="button"
              class="switch"
              role="switch"
              aria-checked=${String(skipped)}
              aria-label=${t("cards.night.skip")}
              @click=${() => this.skip(!skipped)}
            ></button>
          </div>`
        : nothing}`;
  }

  private async skip(on: boolean): Promise<void> {
    try {
      await this.hass?.callWS({ type: "energy_joe/control/skip", skip: on });
    } catch {
      // The state shows what happened.
    }
  }
}

/** "Auto laden": the car's level and range, and charging now or tonight. */
class EnergyJoeCarCard extends JoeCard {
  static getStubConfig(): Record<string, unknown> {
    return {};
  }

  getCardSize(): number {
    return 4;
  }

  /** The car of the config (action id), else the first one Joe charges. */
  private car(state: JoeState): ActionConfig | undefined {
    const cars = state.config.actions.filter((a) => a.kind === "switch" && (a.need?.soc_entity || a.need?.range_entity));
    const wanted = typeof this.config.action === "string" ? this.config.action : undefined;
    return cars.find((a) => a.id === wanted) ?? cars[0];
  }

  protected renderCard(t: Translate, state: JoeState): TemplateResult {
    const car = this.car(state);
    if (!car) {
      return html`<p class="muted">${t("cards.car.none")}</p>`;
    }
    const hass = this.hass!;
    const need = car.need!;
    const live = state.control?.actions?.[car.id];
    const facts = [
      need.soc_entity ? formatState(hass, need.soc_entity, t.lang) : null,
      need.range_entity ? formatState(hass, need.range_entity, t.lang) : null,
    ].filter(Boolean);
    // The head opens the car's page in the panel; charging stays its own control below.
    const carPath = href(PANEL, { tab: "devices", section: "car", id: car.id });
    return html`<a
        class="head"
        href=${carPath}
        @click=${(ev: MouseEvent) => {
          if (ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.altKey || ev.button !== 0) return;
          ev.preventDefault();
          openInHa(carPath);
        }}
      >
        <div class="eyebrow"><ha-icon icon="mdi:car-electric"></ha-icon>${car.name}</div>
        ${live?.on ? html`<span class="chip ok">${t("cards.car.charging")}</span>` : nothing}
        <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
      </a>
      ${facts.length ? html`<p class="big">${facts.join(" · ")}</p>` : nothing}
      <joe-car-charge .hass=${hass} .t=${t} .state=${state} .action=${car}></joe-car-charge>`;
  }
}

define("energy-joe-night-card", EnergyJoeNightCard);
define("energy-joe-car-card", EnergyJoeCarCard);

const cards = ((window as unknown as { customCards?: unknown[] }).customCards ??= []);
for (const card of [
  { type: "energy-joe-night-card", name: "Energy Joe – heute Nacht", description: "Was Joe heute Nacht vorhat, was es kostet, und Aussetzen." },
  { type: "energy-joe-car-card", name: "Energy Joe – Auto laden", description: "Ladestand und Reichweite, jetzt oder heute Nacht laden." },
]) {
  if (!cards.some((c) => (c as { type?: string }).type === card.type)) {
    cards.push({ ...card, preview: true });
  }
}

