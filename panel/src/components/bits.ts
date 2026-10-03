import { html, type TemplateResult } from "lit";
import { titleParts } from "../i18n";

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
export function displayTitle(title: string, tag: "h1" | "h2" = "h2"): TemplateResult {
  const parts = titleParts(title);
  const last = parts.length - 1;
  const content = parts.map((part, i) => {
    if (i === last && parts.length > 1) {
      return html`<span class="hl">${part}</span>`;
    }
    return part.endsWith("!") ? html`${part}<br />` : html`${part}`;
  });
  return tag === "h1"
    ? html`<h1 class="display">${content}</h1>`
    : html`<h2 class="display">${content}</h2>`;
}
