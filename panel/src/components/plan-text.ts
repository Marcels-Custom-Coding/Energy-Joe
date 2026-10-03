import { formatNumber } from "../entities";
import type { Translate } from "../i18n";
import type { Plan } from "../types";

/** "03:20" from an ISO time with Home Assistant's offset (not the browser's zone). */
export function timeOf(iso: string | null | undefined): string {
  return iso ? iso.slice(11, 16) : "";
}

/** Whether a time lies on another day than the window start (for "tomorrow" wording). */
function dayOf(iso: string): string {
  return iso.slice(0, 10);
}

/** Joe's illustration for the plan. */
export function planPose(plan: Plan | null | undefined): string {
  switch (plan?.kind) {
    case "charge":
      return "plug";
    case "hold":
      return "switch";
    case "none":
      return "relax";
    default:
      return "sleep";
  }
}

/** "03:00–04:00, 04:15–04:45" */
export function slotsText(plan: Plan): string {
  return (plan.charge_slots ?? []).map((slot) => `${timeOf(slot.start)}–${timeOf(slot.end)}`).join(", ");
}

/** "00:00–05:00 · 18,6 ct/kWh" */
export function windowText(t: Translate, plan: Plan): string {
  if (!plan.window) {
    return "";
  }
  const parts = [`${timeOf(plan.window.start)}–${timeOf(plan.window.end)}`];
  if (plan.prices) {
    parts.push(`${formatNumber(t.lang, plan.prices.night * 100, 1)} ct/kWh`);
  }
  return parts.join(" · ");
}

/** What Joe will do tonight, in one or two sentences. */
export function planSentence(t: Translate, plan: Plan): string {
  if (plan.kind === "unavailable") {
    const reason = plan.reasons.find((r) => t.optional(`plan.why.${r}`)) ?? "failed";
    return t.optional(`plan.why.${reason}`) ?? "";
  }
  const parts: string[] = [];
  const target = formatNumber(t.lang, plan.target ?? 0, 0);
  const sun = plan.sun_takes_over;
  if (plan.reasons.includes("balance")) {
    parts.push(t("plan.say.balance"));
  }
  if (plan.kind === "charge" && plan.tariff === "dynamic" && plan.charge_slots?.length) {
    parts.push(t("plan.say.charge_slots", { slots: slotsText(plan), target }));
  } else if (plan.kind === "charge") {
    parts.push(t("plan.say.charge", { from: timeOf(plan.charge_from), target }));
  } else if (plan.kind === "hold") {
    parts.push(t("plan.say.hold", { target }));
    if (plan.empty_without) {
      parts.push(t("plan.say.empty", { time: timeOf(plan.empty_without) }));
    }
  } else if (plan.reasons.includes("small_saving")) {
    parts.push(t("plan.say.small_saving"));
  } else {
    parts.push(sun ? t("plan.say.none", { time: timeOf(sun) }) : t("plan.say.none_nosun"));
  }
  if (plan.reasons.includes("max_price") && plan.kind !== "charge") {
    parts.push(t("plan.say.max_price"));
  }
  if (plan.kind !== "none") {
    if (sun && plan.full_at && dayOf(plan.full_at) === dayOf(sun)) {
      parts.push(t("plan.say.sun_full", { sun: timeOf(sun), full: timeOf(plan.full_at) }));
    } else if (sun) {
      parts.push(t("plan.say.sun", { sun: timeOf(sun) }));
    } else {
      parts.push(t("plan.say.nosun"));
    }
  }
  return parts.join(" ");
}

/** One line per battery: "BYD · 16 → 35 % · 2,2 kWh · 1,4 kW". */
export function planLines(t: Translate, plan: Plan): string[] {
  return (plan.batteries ?? []).map((battery) => {
    const parts = [battery.name];
    if (plan.kind === "charge") {
      parts.push(
        `${formatNumber(t.lang, battery.soc_start, 0)} → ${formatNumber(t.lang, battery.target, 0)} %`,
        `${formatNumber(t.lang, battery.charge_kwh, 1)} kWh`,
        `${formatNumber(t.lang, battery.power_kw, 1)} kW`,
      );
    } else if (plan.kind === "hold") {
      parts.push(t("plan.line.hold", { target: formatNumber(t.lang, battery.target, 0) }));
    } else {
      parts.push(t("plan.line.now", { soc: formatNumber(t.lang, battery.soc, 0) }));
    }
    if (!battery.controllable) {
      parts.push(t("plan.line.watch_only"));
    }
    return parts.join(" · ");
  });
}

/** "Kosten heute Nacht 0,60 € · gespart ≈ 0,29 €" */
export function planCostLine(t: Translate, plan: Plan, currency = "EUR"): string {
  if (!plan.cost) {
    return "";
  }
  const money = (value: number) => new Intl.NumberFormat(t.lang, { style: "currency", currency }).format(value);
  const parts = [];
  if (plan.kind === "charge") {
    parts.push(t("plan.cost.night", { value: money(plan.cost.night_charge) }));
  }
  if (plan.cost.saving > 0.005) {
    parts.push(t("plan.cost.saving", { value: money(plan.cost.saving) }));
  }
  return parts.join(" · ");
}
