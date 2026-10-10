import { LitElement, css, html } from "lit";
import { property, query } from "lit/decorators.js";
import { define } from "../define";

/**
 * A modal sheet: centered on wide screens, from the bottom on phones.
 * Closes with Escape, a click outside or the close button ("joe-close").
 */
export class JoeSheet extends LitElement {
  @property() label = "";
  @property() closeLabel = "";
  @property({ type: Boolean, reflect: true }) wide = false;

  @query(".panel") private panel?: HTMLElement;

  static styles = css`
    :host {
      position: fixed;
      inset: 0;
      z-index: 20;
      display: grid;
      place-items: center;
      padding: 16px;
      box-sizing: border-box;
      background: rgba(7, 17, 24, 0.55);
      animation: fade 0.12s ease-out;
    }
    .panel {
      position: relative;
      box-sizing: border-box;
      width: min(600px, 100%);
      max-height: 100%;
      overflow-y: auto;
      overscroll-behavior: contain;
      background: var(--joe-surface);
      color: var(--joe-ink);
      border-radius: 18px;
      padding: 22px;
      box-shadow: var(--joe-shadow);
      outline: none;
      animation: rise 0.16s ease-out;
    }
    :host([wide]) .panel {
      width: min(780px, 100%);
    }
    .close {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 36px;
      height: 36px;
      border: 0;
      border-radius: 50%;
      display: grid;
      place-items: center;
      cursor: pointer;
      background: var(--joe-surface-2);
      color: var(--joe-ink-2);
      transition: background 0.12s, transform 0.12s;
    }
    .close:hover {
      background: var(--joe-line);
      color: var(--joe-ink);
    }
    .close:active {
      transform: scale(0.94);
    }
    .close:focus-visible {
      outline: 3px solid var(--joe-amber);
      outline-offset: 2px;
    }
    .close svg {
      width: 18px;
      height: 18px;
    }
    /* A finger needs 44 px; the corner keeps its place. */
    @media (pointer: coarse) {
      .close {
        top: 8px;
        right: 8px;
        width: 44px;
        height: 44px;
      }
    }
    @keyframes fade {
      from {
        opacity: 0;
      }
    }
    @keyframes rise {
      from {
        translate: 0 12px;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      :host,
      .panel {
        animation: none;
      }
    }
    @media (max-width: 600px) {
      :host {
        place-items: end stretch;
        padding: 0;
      }
      .panel,
      :host([wide]) .panel {
        width: 100%;
        max-height: 92%;
        border-radius: 18px 18px 0 0;
        padding: 20px 16px calc(20px + env(safe-area-inset-bottom));
      }
    }
  `;

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("click", this.onScrim);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.onScrim);
  }

  protected firstUpdated(): void {
    this.panel?.focus();
  }

  protected render() {
    return html`<div
      class="panel"
      role="dialog"
      aria-modal="true"
      aria-label=${this.label}
      tabindex="-1"
      @keydown=${this.onKey}
    >
      <button type="button" class="close" data-notip aria-label=${this.closeLabel} @click=${this.close}>
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
      <slot></slot>
    </div>`;
  }

  private onScrim = (ev: MouseEvent): void => {
    if (ev.composedPath()[0] === this) {
      this.close();
    }
  };

  private onKey(ev: KeyboardEvent): void {
    if (ev.key === "Escape") {
      ev.stopPropagation();
      this.close();
    }
  }

  private close(): void {
    this.dispatchEvent(new CustomEvent("joe-close", { bubbles: true, composed: true }));
  }
}

define("joe-sheet", JoeSheet);
