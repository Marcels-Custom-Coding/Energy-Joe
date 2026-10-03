import type { Translate } from "../i18n";

/** "0,42 €", or "+0,42 €" / "−0,12 €" when signed. */
export function money(t: Translate, value: number, currency = "EUR", signed = false): string {
  return new Intl.NumberFormat(t.lang, {
    style: "currency",
    currency,
    signDisplay: signed ? "exceptZero" : "auto",
  }).format(Math.abs(value) < 0.005 ? 0 : value);
}

/** A number with exactly this many decimals ("2,0"). */
export function fixed(lang: string, value: number, digits = 1): string {
  return new Intl.NumberFormat(lang, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
}

/** "€" for the axis of a chart. */
export function currencySymbol(lang: string, currency = "EUR"): string {
  const parts = new Intl.NumberFormat(lang, { style: "currency", currency }).formatToParts(0);
  return parts.find((part) => part.type === "currency")?.value ?? currency;
}

/** Today in Home Assistant's time zone ("2026-10-03"). */
export function today(timeZone?: string): string {
  try {
    return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

/** A day ("2026-10-03") as "3. Oktober", "Sa., 3.10." or "3.10." without the browser's time zone. */
export function dayText(lang: string, day: string, style: "long" | "weekday" | "short" = "long"): string {
  const date = new Date(`${day.slice(0, 10)}T12:00:00Z`);
  const options: Intl.DateTimeFormatOptions =
    style === "long"
      ? { day: "numeric", month: "long" }
      : style === "weekday"
        ? { weekday: "short", day: "numeric", month: "numeric" }
        : { day: "numeric", month: "numeric" };
  return new Intl.DateTimeFormat(lang, { ...options, timeZone: "UTC" }).format(date);
}

/** "einer Nacht" / "12 Nächten" */
export function nights(t: Translate, count: number): string {
  return count === 1 ? t("learn.nights.one") : t("learn.nights.many", { count });
}
