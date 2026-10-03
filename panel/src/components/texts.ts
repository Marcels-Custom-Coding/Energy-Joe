import { formatNumber } from "../entities";
import type { Translate } from "../i18n";
import type { Check, TariffConfig } from "../types";

/** Cents from a price in currency units per kWh. */
export function cents(t: Translate, price: number | null | undefined): string {
  return price == null ? "–" : formatNumber(t.lang, price * 100, 2);
}

/** The tariff in one line, e.g. "cheap 00:00–05:00: 18.6 ct · otherwise 28.6 ct". */
export function tariffText(t: Translate, tariff: TariffConfig, withFeedIn = true): string {
  let text: string;
  if (tariff.kind === "fixed_window" && tariff.window) {
    text =
      tariff.night_price == null && tariff.day_price == null
        ? t("tariff.window_only", { start: tariff.window.start, end: tariff.window.end })
        : t("find.tariff.window", {
            start: tariff.window.start,
            end: tariff.window.end,
            night: cents(t, tariff.night_price),
            day: cents(t, tariff.day_price),
          });
  } else if (tariff.kind === "dynamic") {
    text =
      tariff.night_price != null && tariff.day_price != null
        ? t("find.tariff.dynamic", { night: cents(t, tariff.night_price), day: cents(t, tariff.day_price) })
        : t("tariff.dynamic");
  } else if (tariff.kind === "flat") {
    text = tariff.day_price == null ? t("tariff.flat") : t("find.tariff.flat", { day: cents(t, tariff.day_price) });
  } else {
    text = t("find.tariff.unknown");
  }
  if (withFeedIn && tariff.feed_in_price != null) {
    text += ` · ${t("find.tariff.feedin", { price: cents(t, tariff.feed_in_price) })}`;
  }
  return text;
}

/** What a plausibility check says, in Joe's words. */
export function checkText(t: Translate, check: Check): string {
  const vars: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(check)) {
    if (typeof value === "number") {
      vars[key] = formatNumber(t.lang, value, 2);
    } else if (typeof value === "string") {
      vars[key] = value;
    }
  }
  if (typeof check.role === "string") {
    vars.role = t.optional(`role.${check.role}`) ?? check.role;
  }
  let key = `check.${check.code}`;
  if (check.code === "grid_sign" && typeof check.expected === "number" && typeof check.actual === "number") {
    // Speak of exporting and importing instead of signed numbers.
    key = check.expected < 0 ? "check.grid_sign.export" : "check.grid_sign.import";
    vars.expected = formatNumber(t.lang, Math.abs(check.expected), 1);
    vars.actual = formatNumber(t.lang, Math.abs(check.actual), 1);
  }
  return t.optional(key, vars) ?? check.code;
}
