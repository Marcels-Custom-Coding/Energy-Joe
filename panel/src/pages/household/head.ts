import { html, type TemplateResult } from "lit";
import { displayTitle, swoosh } from "../../components/bits";
import { usedBy, type Use } from "../../components/used-by";
import type { Translate } from "../../i18n";

/** Head of a Haushalt section: title, what it is about, and who reads it (none: null). */
export function pageHead(t: Translate, prefix: string, title: string, lead: string, uses: Use[] | null): TemplateResult {
  return html`<div class="page-head">
    ${displayTitle(title)} ${swoosh}
    <p class="lead">${lead}</p>
    ${uses ? usedBy(t, prefix, uses) : ""}
  </div>`;
}

/** "08:05" in Home Assistant's time zone, or null. */
export function clockOf(lang: string, iso: string, timeZone?: string): string | null {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const options: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" };
  try {
    return date.toLocaleTimeString(lang, { ...options, timeZone });
  } catch {
    return date.toLocaleTimeString(lang, options);
  }
}

/** Minutes after midnight as "17:30". */
export function minuteClock(minute: number): string {
  return `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`;
}

/** Today's date (YYYY-MM-DD) in Home Assistant's time zone. */
export function todayIn(timeZone?: string): string {
  try {
    return new Intl.DateTimeFormat("en-CA", { timeZone }).format(new Date());
  } catch {
    return new Intl.DateTimeFormat("en-CA").format(new Date());
  }
}
