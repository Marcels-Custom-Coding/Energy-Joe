import { LitElement, css, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { tip } from "../components/tip";
import { define } from "../define";
import type { Translate } from "../i18n";
import { shared } from "../styles/shared";
import type { JoeInfo, JoeMode, JoeState } from "../types";

const SELECTABLE: JoeMode[] = ["simulation", "off", "live"];

/** Settings: operating mode, setup and version information. */
export class JoeSettings extends LitElement {
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;
  @property({ attribute: false }) info?: JoeInfo;

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      .list {
        display: grid;
        gap: 16px;
        max-width: 860px;
        margin: 0 auto;
      }
      .group {
        background: var(--joe-surface);
        border-radius: 14px;
        box-shadow: inset 0 0 0 1px var(--joe-line);
        padding: 4px 18px;
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
      }
      .row small {
        display: block;
        color: var(--joe-muted);
        font-size: 13px;
        margin-top: 2px;
        max-width: 46ch;
      }
      .value {
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        color: var(--joe-ink-2);
      }
      .seg {
        display: inline-flex;
        background: var(--joe-surface-2);
        border-radius: 999px;
        padding: 3px;
        gap: 2px;
      }
      .seg button {
        border: 0;
        background: transparent;
        padding: 6px 14px;
        min-height: 36px;
        border-radius: 999px;
        font-weight: 600;
        font-size: 14px;
        color: var(--joe-ink-2);
        cursor: pointer;
        transition: background 0.12s, color 0.12s;
      }
      .seg button:hover:not([disabled]) {
        background: var(--joe-surface);
        color: var(--joe-ink);
      }
      .seg button:active:not([disabled]) {
        transform: scale(0.97);
      }
      .seg button[aria-pressed="true"] {
        background: var(--joe-ink);
        color: var(--joe-bg);
      }
      .seg button[disabled] {
        cursor: not-allowed;
        opacity: 0.45;
      }
      @media (pointer: coarse) {
        .seg button {
          min-height: 44px;
        }
      }
    `,
  ];

  protected render() {
    const t = this.t;
    const state = this.state;
    if (!t || !state) {
      return nothing;
    }
    const energy = this.info?.energy;
    const energyText =
      energy?.configured && energy.sources
        ? `${energy.sources.solar ?? 0} ${t("energy.solar")} · ${energy.sources.battery ?? 0} ${t("energy.battery")} · ${energy.devices ?? 0} ${t("energy.devices")}`
        : t("settings.energy.none");
    return html`<div class="list">
      <section class="group">
        <h2>${t("settings.operation")}</h2>
        <div class="row" data-tipped>
          <div>
            <div class="name"><b>${t("settings.mode")}</b>${tip(t, "mode")}</div>
            <small>${t("settings.mode.hint")} ${t("settings.live.unavailable")}</small>
          </div>
          <div class="seg" role="group" aria-label=${t("settings.mode")}>
            ${SELECTABLE.map(
              (mode) =>
                html`<button
                  type="button"
                  aria-pressed=${String(state.mode === mode)}
                  ?disabled=${mode === "live"}
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
          <button type="button" class="btn btn-secondary" @click=${() => this.emit("joe-onboarding", { step: "welcome", completed: false })}>
            ${t("settings.setup.restart")}
          </button>
        </div>
      </section>
      <section class="group">
        <h2>${t("settings.about")}</h2>
        <div class="row"><b>${t("settings.version")}</b><span class="value">${this.info?.version ?? "–"}</span></div>
        <div class="row"><b>${t("settings.ha")}</b><span class="value">${this.info?.ha_version ?? "–"}</span></div>
        <div class="row"><b>${t("settings.energy")}</b><span class="value">${energyText}</span></div>
      </section>
    </div>`;
  }

  private emit(name: string, detail: Record<string, unknown>): void {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }
}

define("joe-settings", JoeSettings);
