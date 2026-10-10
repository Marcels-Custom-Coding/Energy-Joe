import { html, nothing, type TemplateResult } from "lit";
import type { Translate } from "../i18n";
import { href, onLink, type Route } from "../router";
import type { Provenance } from "../types";
import { sourceChip } from "./bits";

/** A value shown away from its home, with a jump to where it is set. */
export interface MirrorRow {
  label: string;
  value: TemplateResult | string;
  /** Where the value came from; shown as the source chip. */
  source?: Provenance;
  /** The value's home. */
  to: Route | string;
  hint?: string;
  /** "Ändern →" (default) or "Einstellen →" for something not set yet. */
  action?: "change" | "set";
}

/** "Label · value [source] Ändern →": read-only, the link is pure navigation. */
export function mirrorRow(t: Translate, prefix: string, row: MirrorRow): TemplateResult {
  return html`<div class="mirror">
    <div class="mirror-text">
      <span class="mirror-label">${row.label}</span>
      <span class="mirror-sep" aria-hidden="true">·</span>
      <span class="mirror-value">${row.value}</span>
      ${row.source ? sourceChip(t, row.source) : nothing}
      ${row.hint ? html`<small class="mirror-hint">${row.hint}</small>` : nothing}
    </div>
    <a class="mini-btn go mirror-go" href=${href(prefix, row.to)} @click=${onLink(row.to)}
      >${t(row.action === "set" ? "mirror.set" : "mirror.change")}</a
    >
  </div>`;
}
