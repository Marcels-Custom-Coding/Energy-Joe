import { LitElement, css, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { define } from "../define";

export interface ChoiceOption {
  value: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}

/** The value of the "I don't know" answer. */
export const UNKNOWN = "unknown";

/**
 * Answers to tap, as in the design concept: a grid of options and, if given,
 * a wide "I don't know" below. Emits "joe-choice" with the selected values.
 */
export class JoeChoice extends LitElement {
  @property({ attribute: false }) options: ChoiceOption[] = [];
  @property({ attribute: false }) value: string[] = [];
  @property({ type: Boolean }) multiple = false;
  /** Values that stand alone in multiple mode, e.g. "none". */
  @property({ attribute: false }) exclusive: string[] = [];
  /** Label of the "I don't know" answer; empty hides it. */
  @property() idk = "";
  @property() label = "";
  @property({ type: Boolean, reflect: true }) compact = false;

  static styles = css`
    :host {
      display: block;
    }
    .opts {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }
    :host([compact]) .opts {
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    }
    button {
      display: flex;
      align-items: center;
      gap: 10px;
      min-height: 48px;
      padding: 10px 12px;
      border: 0;
      border-radius: 10px;
      cursor: pointer;
      text-align: left;
      font: inherit;
      font-weight: 600;
      color: var(--joe-ink);
      background: var(--joe-surface-2);
      transition: background 0.12s, box-shadow 0.12s, transform 0.12s;
    }
    :host([compact]) button {
      min-height: 40px;
      padding: 8px 12px;
    }
    @media (pointer: coarse) {
      :host([compact]) button {
        min-height: 44px;
      }
    }
    button:hover:not([disabled]) {
      background: var(--joe-line);
    }
    button:active:not([disabled]) {
      transform: scale(0.98);
    }
    button[aria-pressed="true"],
    button[aria-pressed="true"]:hover {
      background: var(--joe-amber-soft);
      box-shadow: inset 0 0 0 2px var(--joe-amber);
    }
    button[disabled] {
      cursor: not-allowed;
      opacity: 0.5;
    }
    button:focus-visible {
      outline: 3px solid var(--joe-amber);
      outline-offset: 2px;
    }
    .idk {
      grid-column: 1 / -1;
      justify-content: center;
      background: transparent;
      box-shadow: inset 0 0 0 1.5px var(--joe-line-2);
      color: var(--joe-ink-2);
    }
    .idk:hover:not([disabled]) {
      background: var(--joe-surface-2);
    }
    ha-icon {
      --mdc-icon-size: 22px;
      flex: none;
      color: var(--joe-ink-2);
    }
    button[aria-pressed="true"] ha-icon {
      color: var(--joe-amber-text);
    }
    .tick {
      margin-left: auto;
      width: 20px;
      height: 20px;
      flex: none;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: var(--joe-amber);
      color: var(--joe-amber-ink);
    }
    .tick svg {
      width: 14px;
      height: 14px;
    }
    @media (max-width: 480px) {
      .opts {
        grid-template-columns: 1fr;
      }
    }
    @media (pointer: coarse) {
      button {
        min-height: 48px;
      }
    }
  `;

  protected render() {
    return html`<div class="opts" role="group" aria-label=${this.label}>
      ${this.options.map((option) => this.renderOption(option))}
      ${this.idk ? this.renderOption({ value: UNKNOWN, label: this.idk }, "idk") : nothing}
    </div>`;
  }

  private renderOption(option: ChoiceOption, cls = "") {
    const on = this.value.includes(option.value);
    return html`<button
      type="button"
      class=${cls}
      aria-pressed=${String(on)}
      ?disabled=${option.disabled}
      @click=${() => this.toggle(option.value)}
    >
      ${option.icon ? html`<ha-icon icon=${option.icon}></ha-icon>` : nothing}
      <span>${option.label}</span>
      ${on && this.multiple
        ? html`<span class="tick" aria-hidden="true"
            ><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12.5l4.5 4.5L19 7.5" /></svg
          ></span>`
        : nothing}
    </button>`;
  }

  private toggle(value: string): void {
    let next: string[];
    const alone = value === UNKNOWN || this.exclusive.includes(value);
    if (!this.multiple || alone) {
      next = this.multiple && this.value.includes(value) ? [] : [value];
    } else if (this.value.includes(value)) {
      next = this.value.filter((v) => v !== value);
    } else {
      next = [...this.value.filter((v) => v !== UNKNOWN && !this.exclusive.includes(v)), value];
    }
    this.value = next;
    this.dispatchEvent(new CustomEvent("joe-choice", { detail: { value: next }, bubbles: true, composed: true }));
  }
}

define("joe-choice", JoeChoice);
