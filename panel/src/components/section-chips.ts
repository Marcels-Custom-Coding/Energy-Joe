import { html, nothing, type TemplateResult } from "lit";
import { ref } from "lit/directives/ref.js";
import type { Translate } from "../i18n";
import { href, onLink, type Tab } from "../router";

/** One section of a tab in the chip row. */
export interface SectionChip {
  id: string;
  label: string;
  icon: string;
  /** Short count after the label ("4"). */
  count?: string;
  /** Something needs a look: a red dot. */
  problem?: boolean;
}

/** Keeps the active chip visible in the row without moving the page. */
function reveal(el?: Element): void {
  if (!(el instanceof HTMLElement)) {
    return;
  }
  requestAnimationFrame(() => {
    const row = el.parentElement;
    if (!row || row.scrollWidth <= row.clientWidth) {
      return;
    }
    // The sticky row is the chips' offset parent.
    const left = el.offsetLeft;
    if (left < row.scrollLeft || left + el.offsetWidth > row.scrollLeft + row.clientWidth) {
      row.scrollLeft = left - (row.clientWidth - el.offsetWidth) / 2;
    }
  });
}

function rest(): void {
  // Inactive chips stay where they are.
}

const watched = new WeakSet<Element>();

/** Marks the row while more chips hide at its edges, so a fade shows that it scrolls. */
function edges(el?: Element): void {
  if (!(el instanceof HTMLElement)) {
    return;
  }
  const mark = () => {
    const more: string[] = [];
    if (el.scrollLeft > 4) more.push("left");
    if (el.scrollLeft + el.clientWidth < el.scrollWidth - 4) more.push("right");
    el.dataset.more = more.join(" ");
  };
  if (!watched.has(el)) {
    watched.add(el);
    el.addEventListener("scroll", mark, { passive: true });
    new ResizeObserver(mark).observe(el);
  }
  requestAnimationFrame(() => requestAnimationFrame(mark));
}

/** The sticky row of a tab's sections; every chip is a real link to its address. */
export function sectionChips(t: Translate, prefix: string, tab: Tab, chips: SectionChip[], current: string): TemplateResult {
  return html`<nav class="section-chips" aria-label=${t("nav.sections")} ${ref(edges)}>
    ${chips.map((chip) => {
      const on = chip.id === current;
      const to = { tab, section: chip.id };
      return html`<a
        class="section-chip ${on ? "on" : ""}"
        href=${href(prefix, to)}
        aria-current=${on ? "page" : "false"}
        @click=${onLink(to)}
        ${ref(on ? reveal : rest)}
      >
        <ha-icon icon=${chip.icon}></ha-icon>
        <span>${chip.label}</span>
        ${chip.count ? html`<span class="section-count">${chip.count}</span>` : nothing}
        ${chip.problem ? html`<i class="section-problem" aria-hidden="true"></i>` : nothing}
      </a>`;
    })}
  </nav>`;
}
