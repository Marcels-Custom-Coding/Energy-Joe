import { html, type TemplateResult } from "lit";
import { formatNumber } from "../entities";
import type { Translate } from "../i18n";
import { href, onLink, type Route } from "../router";

/** Something that reads a household value: a place to jump to, with how many devices use it. */
export interface Use {
  label: string;
  to?: Route | string;
  /** A number counts devices ("4 Geräte"); a text is shown as it is. */
  count?: number | string;
}

function countText(t: Translate, count: number | string): string {
  if (typeof count === "string") {
    return count;
  }
  const [one, other] = t("word.device").split("|");
  return `${formatNumber(t.lang, count, 0)} ${count === 1 ? one : other}`;
}

/** "Wird genutzt von: Heizung & Klima (4 Geräte)  Plan" – honest "nothing yet" when empty. */
export function usedBy(t: Translate, prefix: string, uses: Use[]): TemplateResult {
  if (!uses.length) {
    return html`<p class="used-by none"><ha-icon icon="mdi:link-variant-off"></ha-icon>${t("usedby.none")}</p>`;
  }
  return html`<p class="used-by">
    <ha-icon icon="mdi:link-variant"></ha-icon>
    <span class="used-by-label">${t("usedby.label")}</span>
    ${uses.map((use) => {
      const text = use.count !== undefined ? `${use.label} (${countText(t, use.count)})` : use.label;
      // No dots between the uses: on a wrapped line they would dangle at its start or end.
      return use.to
        ? html`<a class="used-by-item" href=${href(prefix, use.to)} @click=${onLink(use.to)}>${text}</a>`
        : html`<span class="used-by-item">${text}</span>`;
    })}
  </p>`;
}
