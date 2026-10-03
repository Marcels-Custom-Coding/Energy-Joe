import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant, JoeInfo } from "./types";

// Placeholder screen: proves that installation, panel registration and the
// websocket API work. The real onboarding replaces it.
const TEXT = {
  de: {
    hello: "Hallo, ich bin Joe.",
    intro:
      "Ich ziehe gerade ein. Dieser Bildschirm prüft nur, ob die Installation funktioniert – die eigentliche Einrichtung folgt.",
    loaded: "Integration geladen",
    energy: "Energie-Dashboard",
    energyMissing: "nicht eingerichtet",
    solar: "PV-Quellen",
    battery: "Speicher",
    grid: "Netz",
    devices: "Geräte",
    error: "Joe antwortet nicht",
  },
  en: {
    hello: "Hi, I'm Joe.",
    intro:
      "I'm just moving in. This screen only checks that the installation works – the actual setup comes next.",
    loaded: "Integration loaded",
    energy: "Energy dashboard",
    energyMissing: "not set up",
    solar: "solar sources",
    battery: "batteries",
    grid: "grid",
    devices: "devices",
    error: "Joe is not answering",
  },
};

export class EnergyJoePanel extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: Boolean }) narrow = false;

  @state() private info?: JoeInfo;
  @state() private error?: string;

  private requested = false;

  private get t() {
    return this.hass?.language.startsWith("de") ? TEXT.de : TEXT.en;
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has("hass") && this.hass && !this.requested) {
      this.requested = true;
      this.hass
        .callWS<JoeInfo>({ type: "energy_joe/info" })
        .then((info) => {
          this.info = info;
        })
        .catch((err: unknown) => {
          this.error = err instanceof Error ? err.message : JSON.stringify(err);
        });
    }
  }

  protected render() {
    const t = this.t;
    return html`
      <header>
        ${this.narrow
          ? html`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>`
          : nothing}
        <span class="title">Energy Joe</span>
      </header>
      <main>
        <h1>${t.hello}</h1>
        <p class="intro">${t.intro}</p>
        ${this.error
          ? html`<p class="check warn">${t.error}: ${this.error}</p>`
          : this.info
            ? this.renderChecks(this.info)
            : nothing}
      </main>
    `;
  }

  private renderChecks(info: JoeInfo) {
    const t = this.t;
    const e = info.energy;
    const energy =
      e.configured && e.sources
        ? `${e.sources.grid ?? 0} ${t.grid} · ${e.sources.solar ?? 0} ${t.solar} · ${e.sources.battery ?? 0} ${t.battery} · ${e.devices ?? 0} ${t.devices}`
        : t.energyMissing;
    return html`
      <ul>
        <li class="check ok">${t.loaded} · v${info.version}</li>
        <li class="check ok">Home Assistant ${info.ha_version}</li>
        <li class="check ${e.configured ? "ok" : "warn"}">${t.energy}: ${energy}</li>
      </ul>
    `;
  }

  static styles = css`
    :host {
      display: block;
      min-height: 100%;
      background: var(--primary-background-color);
      color: var(--primary-text-color);
      font-family: var(--paper-font-body1_-_font-family, system-ui, sans-serif);
    }
    header {
      display: flex;
      align-items: center;
      gap: 8px;
      height: var(--header-height, 56px);
      padding: 0 16px;
      background: var(--app-header-background-color, var(--primary-color));
      color: var(--app-header-text-color, var(--text-primary-color));
    }
    .title {
      font-size: 20px;
      font-weight: 500;
    }
    main {
      max-width: 640px;
      margin: 0 auto;
      padding: 48px 16px;
    }
    h1 {
      margin: 0 0 12px;
      font-size: 32px;
      font-weight: 600;
    }
    .intro {
      margin: 0 0 24px;
      color: var(--secondary-text-color);
      line-height: 1.5;
    }
    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 8px;
    }
    .check {
      padding: 12px 16px;
      border-radius: 8px;
      background: var(--card-background-color);
      border-left: 4px solid var(--divider-color);
    }
    .check.ok {
      border-left-color: var(--success-color, #43a047);
    }
    .check.warn {
      border-left-color: var(--warning-color, #ffa600);
    }
  `;
}

// HA may load a new bundle version into a page that already defined the element.
if (!customElements.get("energy-joe-panel")) {
  customElements.define("energy-joe-panel", EnergyJoePanel);
}
