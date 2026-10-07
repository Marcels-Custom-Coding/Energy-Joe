import { LitElement, css, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { define } from "../define";
import { formatNumber } from "../entities";
import type { WeekMode, WeekPoint } from "../types";
import { DAY_MINUTES } from "../week";

/**
 * A day of a week profile as a bar from 0 to 24 h: one colored stretch per
 * switching point (stronger = warmer when heating, cooler when cooling),
 * "off" hatched grey, and a line for "now". Display only.
 */
export class JoeWeekBar extends LitElement {
  @property({ attribute: false }) points: WeekPoint[] = [];
  @property() mode: WeekMode = "heat";
  /** Minute of the day for the "now" line, or null. */
  @property({ attribute: false }) now: number | null = null;
  @property({ type: Boolean, reflect: true }) compact = false;
  @property() lang = "en";
  @property() label = "";
  @property() offText = "off";

  static styles = css`
    :host {
      /* Heating and cooling colors of the timeline (theme independent). */
      --wk-heat: #e8590c;
      --wk-heat-weak: #fde3c8;
      --wk-cool: #1c7ed6;
      --wk-cool-weak: #d3e9fb;
      display: block;
      min-width: 0;
    }
    .track {
      position: relative;
    }
    .bar {
      position: relative;
      height: 30px;
      border-radius: 8px;
      overflow: hidden;
      background: var(--joe-surface-2);
    }
    :host([compact]) .bar {
      height: 10px;
      border-radius: 4px;
    }
    .seg {
      position: absolute;
      top: 0;
      bottom: 0;
      display: grid;
      place-items: center;
      overflow: hidden;
      white-space: nowrap;
      font-size: 12px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      color: var(--joe-amber-ink);
      box-shadow: inset 1px 0 0 var(--joe-surface);
    }
    .seg:first-child {
      box-shadow: none;
    }
    .seg.off {
      color: var(--joe-ink-2);
      font-weight: 600;
      background: repeating-linear-gradient(-45deg, var(--joe-surface-2) 0 4px, var(--joe-line-2) 4px 6px);
    }
    .now {
      position: absolute;
      top: -4px;
      bottom: -4px;
      width: 2px;
      margin-left: -1px;
      border-radius: 1px;
      background: var(--joe-ink);
      pointer-events: none;
    }
    :host([compact]) .now {
      top: -2px;
      bottom: -2px;
    }
    .ticks {
      position: relative;
      height: 16px;
      margin-top: 2px;
      font-size: 11px;
      color: var(--joe-muted);
      font-variant-numeric: tabular-nums;
    }
    .ticks span {
      position: absolute;
      top: 0;
      transform: translateX(-50%);
    }
    .ticks span:first-child {
      transform: none;
    }
    .ticks span:last-child {
      transform: translateX(-100%);
    }
  `;

  protected render() {
    const points = this.points;
    const segments = points.map(([from, value], i) => {
      const to = points[i + 1]?.[0] ?? DAY_MINUTES;
      return { from, to, value };
    });
    return html`<div class="track">
        <div class="bar" role="img" aria-label=${this.label}>
          ${segments.map(({ from, to, value }) => {
            const left = (from / DAY_MINUTES) * 100;
            const width = ((to - from) / DAY_MINUTES) * 100;
            const place = `left:${left}%;width:${width}%;`;
            if (value === "off") {
              return html`<span class="seg off" style=${place}>${this.compact ? nothing : this.offText}</span>`;
            }
            return html`<span class="seg" style=${place + this.color(value)}>
              ${this.compact ? nothing : `${formatNumber(this.lang, value, 1)}°`}
            </span>`;
          })}
        </div>
        ${this.now != null ? html`<span class="now" style=${`left:${(this.now / DAY_MINUTES) * 100}%`}></span>` : nothing}
      </div>
      ${this.compact
        ? nothing
        : html`<div class="ticks" aria-hidden="true">
            ${[0, 6, 12, 18, 24].map((hour) => html`<span style=${`left:${(hour / 24) * 100}%`}>${hour}</span>`)}
          </div>`}`;
  }

  /** Warmer is stronger when heating, cooler is stronger when cooling. */
  private color(value: number): string {
    const strength = this.mode === "cool" ? (28 - value) / 10 : (value - 16) / 10;
    const share = Math.round(25 + Math.min(1, Math.max(0, strength)) * 75);
    const name = this.mode === "cool" ? "cool" : "heat";
    return `background:color-mix(in srgb, var(--wk-${name}) ${share}%, var(--wk-${name}-weak));`;
  }
}

define("joe-week-bar", JoeWeekBar);
