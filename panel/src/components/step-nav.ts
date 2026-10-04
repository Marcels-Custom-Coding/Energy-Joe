import { html, type TemplateResult } from "lit";
import type { TipName, Translate } from "../i18n";
import { tip } from "./tip";

export interface StepNav {
  back?: () => void;
  backLabel?: string;
  next: () => void;
  nextLabel: string;
  /** A tooltip for "next" when it is a decision (e.g. starting Joe), not plain navigation. */
  nextTip?: TipName;
}

/**
 * Back and next at the top of a setup step, above Joe and the content, the
 * same as at its end, so long pages need no scrolling to move on. Styles:
 * `.step-nav` in shared.ts; each page sets its width.
 */
export function stepNav(t: Translate, nav: StepNav, wide = false): TemplateResult {
  const next = html`<button type="button" class="btn btn-primary" ?data-notip=${!nav.nextTip} @click=${nav.next}>
    ${nav.nextLabel}<ha-icon icon="mdi:chevron-right"></ha-icon>
  </button>`;
  return html`<nav class="step-nav ${wide ? "wide" : ""}" aria-label=${t("onb.nav")}>
    ${nav.back
      ? html`<button type="button" class="btn btn-ghost" data-notip @click=${nav.back}>
          <ha-icon icon="mdi:chevron-left"></ha-icon>${nav.backLabel ?? t("onb.back")}
        </button>`
      : html`<span></span>`}
    ${nav.nextTip ? html`<span class="with-tip" data-tipped>${next} ${tip(t, nav.nextTip)}</span>` : next}
  </nav>`;
}

