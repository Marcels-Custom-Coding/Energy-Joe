import { LitElement, css, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { define } from "../define";
import type { Translate } from "../i18n";
import type { JoeMode } from "../types";

const ICONS: Record<JoeMode, string> = {
  simulation: "mdi:pause",
  advisory: "mdi:comment-question-outline",
  live: "mdi:play",
  off: "mdi:power",
};

/** The big operating-mode switch from the design concept. */
export class JoeSimSwitch extends LitElement {
  @property() mode: JoeMode = "simulation";
  @property({ type: Boolean }) compact = false;
  /** Joe is set up and simulating: the stripes run to the right. */
  @property({ type: Boolean }) running = false;
  @property({ attribute: false }) t?: Translate;

  static styles = css`
    button {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      border: 0;
      cursor: pointer;
      padding: 6px 18px 6px 6px;
      border-radius: 999px;
      min-height: 52px;
      font: inherit;
      text-align: left;
      color: #071118;
      background: repeating-linear-gradient(
        -45deg,
        var(--joe-stripe-a) 0 12px,
        var(--joe-stripe-b) 12px 24px
      );
      box-shadow: inset 0 0 0 2px #071118;
      transition: transform 0.12s, filter 0.12s;
    }
    button.simulation.running {
      animation: joe-stripes 1.6s linear infinite;
    }
    /* One stripe pair across: 24px along the -45° gradient is 24·√2 wide. */
    @keyframes joe-stripes {
      to {
        background-position: 33.94px 0;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      button.simulation.running {
        animation: none;
      }
    }
    button:hover {
      filter: brightness(1.05);
    }
    button:active {
      transform: scale(0.98);
    }
    button:focus-visible {
      outline: 3px solid var(--joe-amber);
      outline-offset: 3px;
    }
    button.live {
      background: var(--joe-good);
      color: #ffffff;
      box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.15);
    }
    button.advisory {
      background: var(--joe-amber);
      color: var(--joe-amber-ink);
      box-shadow: inset 0 0 0 2px #071118;
    }
    button.off {
      background: var(--joe-surface-2);
      color: var(--joe-ink-2);
      box-shadow: inset 0 0 0 2px var(--joe-line-2);
    }
    .knob {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      flex: none;
      background: #071118;
      color: #fea707;
    }
    .live .knob {
      background: #ffffff;
      color: var(--joe-good);
    }
    .off .knob {
      background: var(--joe-ink-2);
      color: var(--joe-surface);
    }
    ha-icon {
      --mdc-icon-size: 20px;
    }
    b {
      display: block;
      font-family: var(--joe-display);
      font-style: italic;
      font-weight: 800;
      font-size: 20px;
      letter-spacing: 0.03em;
      line-height: 1;
      text-transform: uppercase;
    }
    small {
      display: block;
      font-size: 12px;
      font-weight: 600;
      line-height: 1.2;
      margin-top: 2px;
    }
    :host([compact]) button {
      min-height: 44px;
      padding: 4px 14px 4px 4px;
      gap: 10px;
    }
    :host([compact]) .knob {
      width: 34px;
      height: 34px;
    }
    :host([compact]) b {
      font-size: 17px;
    }
  `;

  protected render() {
    const t = this.t;
    if (!t) {
      return nothing;
    }
    return html`<button
      type="button"
      class="${this.mode}${this.running ? " running" : ""}"
      aria-label=${t("mode.switch.label")}
      @click=${this.toggle}
    >
      <span class="knob"><ha-icon icon=${ICONS[this.mode]}></ha-icon></span>
      <span>
        <b>${t(`mode.${this.mode}`)}</b>
        ${this.compact ? nothing : html`<small>${t(`mode.${this.mode}.sub`)}</small>`}
      </span>
    </button>`;
  }

  private toggle(): void {
    this.dispatchEvent(new CustomEvent("joe-mode-switch", { bubbles: true, composed: true }));
  }
}

define("joe-sim-switch", JoeSimSwitch);
