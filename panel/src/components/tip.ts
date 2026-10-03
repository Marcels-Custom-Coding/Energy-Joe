import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property, query, state } from "lit/decorators.js";
import { define } from "../define";
import type { TipName, Translate } from "../i18n";

/** What a tooltip says: the question in plain words, the answer, and optional facts. */
export interface TipContent {
  heading: string;
  text: string;
  facts?: [string, string][];
}

const HOVER_DELAY = 120;
const LEAVE_DELAY = 220;
const EDGE = 8;
const GAP = 10;

// Only one tooltip is open at a time.
let openTip: JoeTip | undefined;

/**
 * Joe's tooltip: a small round "i" next to everything the user enters or
 * decides. Opens on hover, tap and keyboard focus; tap or click pins it.
 * The bubble lives in the browser's top layer when the Popover API exists,
 * so cards, dialogs and scroll containers never cut it off.
 */
export class JoeTip extends LitElement {
  @property({ attribute: false }) tip?: TipContent;
  @property() label = "";

  @state() private open = false;
  @query("button") private button?: HTMLButtonElement;
  @query(".bubble") private bubble?: HTMLElement;

  private pinned = false;
  private keepOnBlur = false;
  private timer?: number;
  private frame?: number;

  static styles = css`
    :host {
      display: inline-flex;
      vertical-align: middle;
      flex: none;
    }
    button {
      position: relative;
      display: grid;
      place-items: center;
      width: 28px;
      height: 28px;
      padding: 0;
      border: 0;
      border-radius: 50%;
      cursor: pointer;
      background: var(--joe-surface-2);
      color: var(--joe-ink-2);
      transition: background 0.12s, color 0.12s, transform 0.12s;
    }
    button::after {
      content: "";
      position: absolute;
      inset: -4px;
      border-radius: 50%;
    }
    button:hover {
      background: var(--joe-line);
      color: var(--joe-ink);
    }
    button:active {
      transform: scale(0.94);
    }
    button.open,
    button.open:hover {
      background: var(--joe-amber);
      color: var(--joe-amber-ink);
    }
    button:focus-visible {
      outline: 3px solid var(--joe-amber);
      outline-offset: 2px;
    }
    svg {
      width: 16px;
      height: 16px;
      transform: skewX(-8deg);
    }
    @media (pointer: coarse) {
      button::after {
        inset: -8px;
      }
    }
    .bubble {
      display: none;
      position: fixed;
      inset: auto;
      left: 0;
      top: 0;
      z-index: 1000;
      margin: 0;
      border: 0;
      overflow: visible;
      box-sizing: border-box;
      width: max-content;
      max-width: min(320px, calc(100vw - 16px));
      padding: 12px 14px;
      border-radius: 12px;
      background: var(--joe-tip-bg);
      color: var(--joe-tip-ink);
      font-family: var(--joe-ui);
      font-size: 13.5px;
      font-weight: 400;
      line-height: 1.45;
      text-align: left;
      text-transform: none;
      letter-spacing: normal;
      white-space: normal;
      box-shadow: 0 14px 32px -12px rgba(7, 17, 24, 0.55);
    }
    .bubble.open {
      display: block;
      animation: tip-in 0.12s ease-out;
    }
    @keyframes tip-in {
      from {
        opacity: 0;
        translate: 0 4px;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .bubble.open {
        animation: none;
      }
    }
    .h {
      display: block;
      font-weight: 700;
      font-size: 14px;
      line-height: 1.35;
      margin-bottom: 4px;
      color: var(--joe-tip-accent);
    }
    p {
      margin: 0;
    }
    p + p {
      margin-top: 6px;
    }
    strong {
      font-weight: 700;
    }
    dl {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 3px 10px;
      margin: 9px 0 0;
      padding-top: 8px;
      border-top: 1px solid var(--joe-tip-line);
    }
    dt {
      color: var(--joe-tip-accent);
      font-weight: 700;
    }
    dd {
      margin: 0;
    }
    .arrow {
      position: absolute;
      left: calc(var(--arrow, 50%) - 6px);
      width: 12px;
      height: 12px;
      background: inherit;
      border-radius: 2px;
      transform: rotate(45deg);
    }
    .bubble[data-place="top"] .arrow {
      bottom: -5px;
    }
    .bubble[data-place="bottom"] .arrow {
      top: -5px;
    }
  `;

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.close();
  }

  protected render() {
    const tip = this.tip;
    if (!tip) {
      return nothing;
    }
    return html`<button
        type="button"
        class=${this.open ? "open" : ""}
        aria-label=${this.label}
        aria-expanded=${String(this.open)}
        aria-describedby="bubble"
        @click=${this.onClick}
        @pointerenter=${this.onEnter}
        @pointerleave=${this.onLeave}
        @focus=${this.onFocus}
        @blur=${this.onBlur}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
          <circle cx="12" cy="6.4" r="2" />
          <rect x="10.3" y="9.8" width="3.4" height="9.6" rx="1.7" />
        </svg>
      </button>
      <div
        id="bubble"
        class="bubble ${this.open ? "open" : ""}"
        role="tooltip"
        popover="manual"
        data-place="top"
        @pointerenter=${this.onEnter}
        @pointerleave=${this.onLeave}
        @pointerdown=${this.onBubbleDown}
      >
        <span class="h">${tip.heading}</span>
        ${paragraphs(tip.text)}
        ${tip.facts?.length
          ? html`<dl>${tip.facts.map(([term, value]) => html`<dt>${term}</dt><dd>${value}</dd>`)}</dl>`
          : nothing}
        <span class="arrow"></span>
      </div>`;
  }

  /** Opens the bubble; pinned bubbles stay open until clicked again or dismissed. */
  show(pinned = false): void {
    this.cancelTimer();
    this.pinned = this.pinned || pinned;
    if (this.open) {
      return;
    }
    if (openTip && openTip !== this) {
      openTip.close();
    }
    openTip = this;
    this.open = true;
    window.addEventListener("pointerdown", this.onOutside, true);
    window.addEventListener("keydown", this.onKey, true);
    this.updateComplete.then(() => {
      const bubble = this.bubble;
      if (!this.open || !bubble) {
        return;
      }
      if (typeof bubble.showPopover === "function" && !bubble.matches(":popover-open")) {
        bubble.showPopover();
      }
      this.follow();
    });
  }

  close(): void {
    this.cancelTimer();
    this.pinned = false;
    if (this.frame !== undefined) {
      cancelAnimationFrame(this.frame);
      this.frame = undefined;
    }
    window.removeEventListener("pointerdown", this.onOutside, true);
    window.removeEventListener("keydown", this.onKey, true);
    const bubble = this.bubble;
    if (bubble && typeof bubble.hidePopover === "function" && bubble.matches(":popover-open")) {
      bubble.hidePopover();
    }
    if (openTip === this) {
      openTip = undefined;
    }
    this.open = false;
  }

  private onClick(): void {
    if (this.open && this.pinned) {
      this.close();
    } else {
      this.show(true);
    }
  }

  private onEnter(ev: PointerEvent): void {
    if (ev.pointerType !== "mouse") {
      return;
    }
    this.cancelTimer();
    if (!this.open) {
      this.timer = window.setTimeout(() => this.show(), HOVER_DELAY);
    }
  }

  private onLeave(ev: PointerEvent): void {
    if (ev.pointerType !== "mouse") {
      return;
    }
    this.cancelTimer();
    if (this.open && !this.pinned) {
      this.timer = window.setTimeout(() => this.close(), LEAVE_DELAY);
    }
  }

  private onFocus(): void {
    if (this.button?.matches(":focus-visible")) {
      this.show();
    }
  }

  private onBlur(): void {
    // A click into the bubble takes the focus away from the button; stay open.
    if (this.keepOnBlur) {
      this.keepOnBlur = false;
      return;
    }
    if (this.open) {
      this.close();
    }
  }

  private onBubbleDown(): void {
    this.keepOnBlur = true;
    window.setTimeout(() => {
      this.keepOnBlur = false;
    }, 400);
  }

  private onOutside = (ev: PointerEvent): void => {
    if (!ev.composedPath().includes(this)) {
      this.close();
    }
  };

  private onKey = (ev: KeyboardEvent): void => {
    if (ev.key === "Escape") {
      // Close only the tooltip, not a dialog around it.
      ev.stopPropagation();
      ev.preventDefault();
      this.close();
    }
  };

  private cancelTimer(): void {
    if (this.timer !== undefined) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
  }

  /** Keeps the bubble next to the button while the page scrolls or moves. */
  private follow = (): void => {
    if (!this.open) {
      return;
    }
    this.place();
    this.frame = requestAnimationFrame(this.follow);
  };

  private place(): void {
    const button = this.button;
    const bubble = this.bubble;
    if (!button || !bubble) {
      return;
    }
    const anchor = button.getBoundingClientRect();
    if (!anchor.width && !anchor.height) {
      this.close();
      return;
    }
    const box = bubble.getBoundingClientRect();
    const width = document.documentElement.clientWidth;
    let top = anchor.top - box.height - GAP;
    let place = "top";
    if (top < EDGE) {
      top = anchor.bottom + GAP;
      place = "bottom";
    }
    const center = anchor.left + anchor.width / 2;
    const left = Math.max(EDGE, Math.min(center - box.width / 2, width - box.width - EDGE));
    const arrow = Math.max(14, Math.min(center - left, box.width - 14));
    bubble.style.left = `${Math.round(left)}px`;
    bubble.style.top = `${Math.round(top)}px`;
    bubble.style.setProperty("--arrow", `${Math.round(arrow)}px`);
    bubble.dataset.place = place;
  }
}

/** Paragraphs from "\n"; "**word**" is shown bold. */
function paragraphs(text: string): TemplateResult[] {
  return text.split("\n").map(
    (line) =>
      html`<p>
        ${line.split(/\*\*(.+?)\*\*/).map((part, i) => (i % 2 ? html`<strong>${part}</strong>` : part))}
      </p>`,
  );
}

/** Tooltip text from the dictionary: "tip.<name>.title", ".text" and an optional ".hint". */
export function tipContent(
  t: Translate,
  name: TipName,
  vars?: Record<string, string | number>,
  facts: [string, string][] = [],
): TipContent {
  const hint = t.optional(`tip.${name}.hint`, vars);
  return {
    heading: t(`tip.${name}.title`, vars),
    text: t(`tip.${name}.text`, vars),
    facts: hint ? [...facts, [t("tip.hint"), hint]] : facts,
  };
}

/** The "i" button with a tooltip from the dictionary. */
export function tip(
  t: Translate,
  name: TipName,
  vars?: Record<string, string | number>,
  facts?: [string, string][],
): TemplateResult {
  return html`<joe-tip .tip=${tipContent(t, name, vars, facts)} label=${t("tip.label")}></joe-tip>`;
}

define("joe-tip", JoeTip);
