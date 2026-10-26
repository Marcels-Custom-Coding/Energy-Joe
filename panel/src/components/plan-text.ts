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
    parts.push(t(atTop(plan) ? "plan.say.charge_full" : "plan.say.charge", { from: timeOf(plan.charge_from), target }));
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
  if (plan.reasons.includes("caution") && plan.kind !== "none") {
    // Above what a typical day needs: the bad day weighs in (plan.risk, 0.9.36).
    parts.push(t("plan.say.caution"));
  }
  if (plan.day) {
    // Grid-friendly: the morning sun goes to the grid, the battery takes the midday sun
    // (first up to the buffer, if there is one above the floor).
    const vars = { time: timeOf(plan.day.defer_until), kwh: formatNumber(t.lang, plan.day.held_kwh, 0) };
    const buffer = plan.day.buffer;
    parts.push(
      buffer && buffer.soc > buffer.floor
        ? t("plan.day.buffer", { ...vars, level: formatNumber(t.lang, buffer.soc, 0) })
        : t("plan.day", vars),
    );
    if (plan.day.cost && plan.day.cost >= 0.01) {
      parts.push(t("plan.day.cost", { cost: `${formatNumber(t.lang, plan.day.cost * 100, 0)} ct` }));
    }
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

/** The grid-friendly morning in one sentence: this morning's plan (after the window), with its buffer. */
export function dayText(t: Translate, plan: Plan | null | undefined): string {
  const day = plan?.morning?.day ?? plan?.day;
  const time = day ? timeOf(day.defer_until) : "–";
  const buffer = day?.buffer;
  return buffer && buffer.soc > buffer.floor
    ? t("devices.status.day_buffer", { time, level: String(buffer.soc) })
    : t("devices.status.day", { time });
}

/** Money as people read it: "40 ct" below 1 €, else "1,20 €". */
export function euroText(t: Translate, value: number, currency = "EUR"): string {
  const amount = Math.max(0, value);
  if (currency === "EUR" && amount < 1) {
    return `${formatNumber(t.lang, Math.round(amount * 100), 0)} ct`;
  }
  return new Intl.NumberFormat(t.lang, { style: "currency", currency }).format(amount);
}

/** The night's target is as high as it goes (100 %, or the owner's highest). */
export function atTop(plan: Plan): boolean {
  const top = Math.min(100, plan.rules?.max_target ?? 100);
  return (plan.target ?? 0) >= top - 0.5;
}

/**
 * When the batteries are empty again after the window on the typical day
 * (the plan's own hours), and how much comes from the grid at the day price
 * from then until the next night; null if they last.
 */
export function emptyAgain(plan: Plan): { at: string; kwh: number } | null {
  const end = plan.window?.end;
  const hours = plan.hours ?? [];
  const floor = (plan.rules?.reserve ?? 0) + 0.5;
  if (!end || !hours.length) {
    return null;
  }
  const after = hours.filter((h) => Date.parse(h.start) >= Date.parse(end) && !h.window);
  const index = after.findIndex((h) => h.soc <= floor);
  if (index < 0) {
    return null;
  }
  const kwh = after.slice(index).reduce((sum, h) => sum + h.grid_in, 0);
  return kwh >= 0.1 ? { at: after[index].start, kwh } : null;
}

/**
 * "Warum 60 %": what the typical day would have needed and what the chosen
 * target saves on a bad day (or costs on a good one), from plan.risk.
 */
export function riskSentence(t: Translate, plan: Plan, currency = "EUR"): string {
  const risk = plan.risk;
  if (!risk) {
    return "";
  }
  const target = Math.round(plan.target ?? 0);
  const typical = Math.round(risk.typical_target);
  if (atTop(plan)) {
    // Full: more does not fit in – the question is only how far it gets.
    const empty = emptyAgain(plan);
    return empty
      ? t("plan.risk.full_short", {
          target: formatNumber(t.lang, target, 0),
          time: timeOf(empty.at),
          kwh: formatNumber(t.lang, empty.kwh, 1),
        })
      : t("plan.risk.full", { target: formatNumber(t.lang, target, 0) });
  }
  if (target === typical) {
    return t("plan.risk.same");
  }
  const { bad, good } = risk.scenarios;
  const more = target > typical;
  // More: a bad day saves day power, a good one costs; less: the other way round.
  const shown = more ? bad : good;
  const saving = more ? bad.cost_typical - bad.cost : good.cost_typical - good.cost;
  const loss = more ? good.cost - good.cost_typical : bad.cost - bad.cost_typical;
  const vars = {
    typical: formatNumber(t.lang, typical, 0),
    target: formatNumber(t.lang, target, 0),
    solar: formatNumber(t.lang, shown.solar_kwh, 1),
    home: formatNumber(t.lang, shown.home_kwh, 1),
    saving: euroText(t, saving, currency),
    loss: euroText(t, loss, currency),
  };
  if (!more) {
    return t("plan.risk.less", vars);
  }
  return t(plan.kind === "hold" ? "plan.risk.more_hold" : "plan.risk.more", vars);
}

/** The caution the night was weighed by, as the setting names it ("Ausgewogen"). */
export function riskCaution(t: Translate, plan: Plan): string {
  const caution = plan.risk?.caution ?? plan.rules?.night_caution ?? "brave";
  return t.optional(`rule.night_caution.${caution}`) ?? caution;
}

/** "Wetter morgen: Regen · gelernt aus 14 Tagen Sonne und 30 Tagen Verbrauch". */
export function riskBasis(t: Translate, plan: Plan): string {
  const risk = plan.risk;
  if (!risk) {
    return "";
  }
  const parts: string[] = [];
  if (risk.class) {
    parts.push(t("plan.risk.class", { class: t(`plan.risk.class.${risk.class}`) }));
  }
  const { solar, home } = risk.days;
  if (!solar && !home) {
    parts.push(t("plan.risk.days.none"));
  } else if (!solar || !home) {
    parts.push(
      t("plan.risk.days.partly", {
        days: formatNumber(t.lang, solar || home, 0),
        what: t(solar ? "plan.risk.days.solar" : "plan.risk.days.home"),
      }),
    );
  } else {
    parts.push(t("plan.risk.days", { solar: formatNumber(t.lang, solar, 0), home: formatNumber(t.lang, home, 0) }));
  }
  return parts.join(" · ");
}
