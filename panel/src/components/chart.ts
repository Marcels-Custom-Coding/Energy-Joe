import { LitElement, css, html, nothing, svg, type SVGTemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { define } from "../define";

export interface ChartSeries {
  label: string;
  kind: "bar" | "area" | "line";
  values: (number | null)[];
  /** CSS color, e.g. "var(--joe-c-load)". */
  color: string;
  fill?: string;
  dashed?: boolean;
  digits?: number;
}

export interface ChartBand {
  from: number;
  to: number;
  label: string;
}

export interface ChartMarker {
  at: number;
  label: string;
  /** Shorter label for narrow charts. */
  short?: string;
}

const LEFT = 40;
const RIGHT = 10;
const TOP = 16;
const BOTTOM = 24;

/** A round axis maximum: 1, 2, 2.5 or 5 times a power of ten. */
function niceMax(value: number): number {
  const power = 10 ** Math.floor(Math.log10(value));
  for (const step of [1, 2, 2.5, 5, 10]) {
    if (step * power >= value) {
      return step * power;
    }
  }
  return 10 * power;
}

/** Runs of consecutive known values, for areas and lines with gaps. */
function runs(values: (number | null)[]): [number, number][][] {
  const result: [number, number][][] = [];
  let current: [number, number][] = [];
  values.forEach((value, index) => {
    if (value == null) {
      if (current.length) {
        result.push(current);
      }
      current = [];
    } else {
      current.push([index, value]);
    }
  });
  if (current.length) {
    result.push(current);
  }
  return result;
}

/**
 * Joe's charts: hourly bars, areas and lines in SVG, with a shaded cheap
 * window, markers and the values of an hour on hover or tap.
 */
export class JoeChart extends LitElement {
  /** One label per slot, shown with the values (e.g. "14:00–15:00"). */
  @property({ attribute: false }) labels: string[] = [];
  /** Slot index → text under the axis (e.g. 0 → "00", 3 → "03"). */
  @property({ attribute: false }) ticks: Map<number, string> = new Map();
  @property({ attribute: false }) series: ChartSeries[] = [];
  @property({ attribute: false }) bands: ChartBand[] = [];
  @property({ attribute: false }) markers: ChartMarker[] = [];
  @property() unit = "kWh";
  /** Fixed axis maximum (e.g. 100 for percent); 0 finds one. */
  @property({ type: Number }) max = 0;
  @property({ type: Number }) height = 220;
  @property() label = "";
  @property() lang = "de";
  /** Labels under the middle of a slot (days) instead of at its start (hours). */
  @property({ type: Boolean }) centerTicks = false;

  @state() private width = 640;
  @state() private hover: number | null = null;

  private resize?: ResizeObserver;

  static styles = css`
    :host {
      display: block;
      position: relative;
      user-select: none;
      -webkit-user-select: none;
    }
    svg {
      display: block;
      width: 100%;
      overflow: visible;
    }
    .grid {
      stroke: var(--joe-line);
      stroke-width: 1;
    }
    .tick {
      fill: var(--joe-muted);
      font-size: 11px;
      font-variant-numeric: tabular-nums;
    }
    .note {
      fill: var(--joe-ink-2);
      font-size: 11.5px;
    }
    .band {
      fill: var(--joe-c-band);
    }
    .marker {
      stroke: var(--joe-ink-2);
      stroke-width: 1;
      stroke-dasharray: 3 4;
    }
    .guide {
      stroke: var(--joe-ink);
      stroke-width: 1;
      opacity: 0.35;
    }
    .slot {
      fill: transparent;
      cursor: crosshair;
    }
    .box {
      position: absolute;
      top: 0;
      z-index: 1;
      min-width: 150px;
      padding: 8px 10px;
      border-radius: 10px;
      background: var(--joe-tip-bg);
      color: var(--joe-tip-ink);
      font-size: 12.5px;
      line-height: 1.4;
      pointer-events: none;
      box-shadow: 0 10px 24px -12px rgba(7, 17, 24, 0.5);
    }
    .box b {
      display: block;
      color: var(--joe-tip-accent);
      margin-bottom: 2px;
    }
    .box div {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .box i {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      flex: none;
    }
    .box span {
      flex: 1;
    }
    .box em {
      font-style: normal;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }
  `;

  connectedCallback(): void {
    super.connectedCallback();
    this.resize = new ResizeObserver((entries) => {
      const width = Math.round(entries[0]?.contentRect.width ?? 0);
      if (width > 0 && width !== this.width) {
        this.width = width;
      }
    });
    this.resize.observe(this);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.resize?.disconnect();
  }

  protected render() {
    const count = this.labels.length;
    if (!count) {
      return nothing;
    }
    const width = Math.max(260, this.width);
    const height = this.height;
    const plotW = width - LEFT - RIGHT;
    const plotH = height - TOP - BOTTOM;
    const step = plotW / count;
    const known = this.series.flatMap((s) => s.values.filter((v): v is number => v != null));
    const top = this.max || niceMax(Math.max(0.1, ...known));
    const y = (value: number) => TOP + plotH - (Math.max(0, Math.min(value, top)) / top) * plotH;
    const x = (slot: number) => LEFT + slot * step;
    const mid = (slot: number) => LEFT + (slot + 0.5) * step;
    const format = (value: number, digits = 2) =>
      new Intl.NumberFormat(this.lang, { maximumFractionDigits: digits }).format(value);

    const parts: SVGTemplateResult[] = [];
    for (const band of this.bands) {
      parts.push(svg`<rect class="band" x=${x(band.from)} y=${TOP} width=${Math.max(0, x(band.to) - x(band.from))} height=${plotH}></rect>
        <text class="note" x=${(x(band.from) + x(band.to)) / 2} y=${TOP + 12} text-anchor="middle">${band.label}</text>`);
    }
    for (const value of [0, top / 2, top]) {
      parts.push(svg`<line class="grid" x1=${LEFT} x2=${width - RIGHT} y1=${y(value)} y2=${y(value)}></line>
        <text class="tick" x=${LEFT - 6} y=${y(value) + 4} text-anchor="end">${format(value, 2)}</text>`);
    }
    parts.push(svg`<text class="tick" x=${LEFT - 6} y=${TOP - 5} text-anchor="end">${this.unit}</text>`);
    for (const [slot, text] of this.ticks) {
      parts.push(svg`<text class="tick" x=${this.centerTicks ? mid(slot) : x(slot)} y=${height - 6}
        text-anchor="middle">${text}</text>`);
    }
    // Several bar series stand side by side in each slot.
    const bars = this.series.filter((s) => s.kind === "bar");
    const barWidth = (step * 0.68) / Math.max(1, bars.length);
    for (const series of this.series) {
      if (series.kind === "bar") {
        const offset = step * 0.16 + bars.indexOf(series) * barWidth;
        series.values.forEach((value, slot) => {
          if (value != null && value > 0) {
            parts.push(svg`<rect x=${x(slot) + offset} y=${y(value)} width=${Math.max(1, barWidth - 1)}
              height=${Math.max(0, y(0) - y(value))} rx="2" fill=${series.color}></rect>`);
          }
        });
        continue;
      }
      for (const run of runs(series.values)) {
        const points = run.map(([slot, value]) => `${mid(slot).toFixed(1)},${y(value).toFixed(1)}`).join(" ");
        if (series.kind === "area" && run.length > 1) {
          const base = y(0).toFixed(1);
          parts.push(svg`<polygon points=${`${mid(run[0][0]).toFixed(1)},${base} ${points} ${mid(run[run.length - 1][0]).toFixed(1)},${base}`}
            fill=${series.fill ?? series.color}></polygon>`);
        }
        if (run.length > 1) {
          parts.push(svg`<polyline points=${points} fill="none" stroke=${series.color} stroke-width=${series.kind === "line" ? 2.4 : 2}
            stroke-linejoin="round" stroke-dasharray=${series.dashed ? "5 4" : "none"}></polyline>`);
        } else {
          parts.push(svg`<circle cx=${mid(run[0][0])} cy=${y(run[0][1])} r="2.5" fill=${series.color}></circle>`);
        }
      }
    }
    for (const marker of this.markers) {
      const at = LEFT + marker.at * step;
      // Labels sit at the top, on the side with more room.
      const right = at < LEFT + plotW * 0.75;
      parts.push(svg`<line class="marker" x1=${at} x2=${at} y1=${TOP} y2=${TOP + plotH}></line>
        <text class="note" x=${right ? at + 4 : at - 4} y=${TOP + 12} text-anchor=${right ? "start" : "end"}>
          ${width < 520 ? (marker.short ?? marker.label) : marker.label}
        </text>`);
    }
    if (this.hover != null) {
      parts.push(svg`<line class="guide" x1=${mid(this.hover)} x2=${mid(this.hover)} y1=${TOP} y2=${TOP + plotH}></line>`);
    }
    for (let slot = 0; slot < count; slot++) {
      parts.push(svg`<rect class="slot" x=${x(slot)} y=${TOP} width=${step} height=${plotH}
        @pointerenter=${() => (this.hover = slot)} @click=${() => (this.hover = slot)}></rect>`);
    }

    return html`<svg
        viewBox="0 0 ${width} ${height}"
        height=${height}
        role="img"
        aria-label=${this.label}
        @pointerleave=${(ev: PointerEvent) => ev.pointerType === "mouse" && (this.hover = null)}
      >
        ${parts}
      </svg>
      ${this.hover != null ? this.renderBox(this.hover, mid(this.hover), width, format) : nothing}`;
  }

  private renderBox(slot: number, at: number, width: number, format: (v: number, d?: number) => string) {
    // Right of the guide, or left of it near the right edge.
    const left = at + 182 > width ? Math.max(0, at - 182) : at + 12;
    return html`<div class="box" style="left:${left}px">
      <b>${this.labels[slot]}</b>
      ${this.series.map((series) => {
        const value = series.values[slot];
        return value == null
          ? nothing
          : html`<div>
              <i style="background:${series.color}"></i><span>${series.label}</span
              ><em>${format(value, series.digits ?? 2)} ${this.unit}</em>
            </div>`;
      })}
    </div>`;
  }
}

define("joe-chart", JoeChart);
