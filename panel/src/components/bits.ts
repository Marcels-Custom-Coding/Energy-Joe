import { html, type TemplateResult } from "lit";
import { titleParts, type Translate } from "../i18n";
import type { Provenance, Reason, Source } from "../types";

/** The amber underline from the logo. */
export const swoosh = html`<svg
  class="swoosh"
  viewBox="0 0 300 16"
  preserveAspectRatio="none"
  aria-hidden="true"
>
  <path d="M2 13 C 70 5, 190 1, 298 3 L 298 6 C 190 5, 80 9, 4 15 Z" fill="currentColor" />
</svg>`;

/**
 * Renders a display title from "First |Second". The last part is amber; a part
 * ending in "!" stands on its own line (e.g. "Howdy!").
 */
export function displayTitle(title: string, tag: "h1" | "h2" = "h2", tip?: TemplateResult): TemplateResult {
  const parts = titleParts(title);
  const last = parts.length - 1;
  const content = parts.map((part, i) => {
    if (i === last && parts.length > 1) {
      return html`<span class="hl">${part}</span>`;
    }
    return part.endsWith("!") ? html`${part}<br />` : html`${part}`;
  });
  // A tooltip sits right after the last word.
  const after = tip ? html`<span class="title-tip">${tip}</span>` : "";
  return tag === "h1"
    ? html`<h1 class="display">${content}${after}</h1>`
    : html`<h2 class="display">${content}${after}</h2>`;
}

/** Four dots for how sure Joe is (0–1). */
export function confidenceDots(t: Translate, confidence: number): TemplateResult {
  const level = confidence >= 0.85 ? 4 : confidence >= 0.65 ? 3 : confidence >= 0.45 ? 2 : 1;
  const label = t(`conf.${level as 1 | 2 | 3 | 4}`);
  return html`<span class="conf" role="img" aria-label=${label} title=${label}>
    ${[1, 2, 3, 4].map((i) => html`<i class=${i <= level ? "on" : ""}></i>`)}
  </span>`;
}

const SOURCE_ICONS: Record<Source, string> = {
  read: "mdi:eye-outline",
  learned: "mdi:auto-fix",
  user: "mdi:account-edit-outline",
  default: "mdi:tune-variant",
};

/** Chip that says where a value came from. */
export function sourceChip(t: Translate, provenance: Provenance | undefined): TemplateResult {
  const source = provenance?.source ?? "default";
  return html`<span class="chip ${source}"
    ><ha-icon icon=${SOURCE_ICONS[source]}></ha-icon>${t(`source.${source}`)}</span
  >`;
}

/** Text of a reason code from discovery. */
export function reasonText(t: Translate, reason: Reason): string {
  const vars: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(reason)) {
    if (typeof value === "string" || typeof value === "number") {
      vars[key] = value;
    }
  }
  return t.optional(`reason.${reason.code}`, vars) ?? reason.code;
}
