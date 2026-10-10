import { html, nothing, type TemplateResult } from "lit";
import { formatNumber } from "../entities";
import type { Translate } from "../i18n";
import type { DaySurplus, JoeState } from "../types";
import { timeOf } from "./plan-text";

// "Tagsüber Überschuss abgeben" (control/executor.py _async_surplus): the
// batteries charge only as fast as they must to be full before the sun goes,
// the rest shows at the grid meter for an evcc loadpoint in PV mode. The same
// words on the plan, the overview, the battery pages and the inbox.

/** The daytime surplus, when the rule is on and the backend tells it. */
export function daySurplus(joe: JoeState | undefined): DaySurplus | undefined {
  return joe?.config.rules.day_surplus ? joe.control?.surplus : undefined;
}

/** The loadpoint that gets the sun, by its name in evcc ("den Ladepunkt „Fußbodenheizung“"). */
export function surplusLoadpoint(t: Translate, surplus: DaySurplus): string {
  const names = (surplus.loadpoints ?? []).filter((p) => p.wants).map((p) => p.name);
  return names.length ? t("surplus.loadpoint.named", { names: names.join(", ") }) : t("surplus.loadpoint.any");
}

/** One sentence: what Joe does (or would do) with the daytime sun, or why not. */
export function surplusText(t: Translate, surplus: DaySurplus): string {
  if (surplus.state === "cap") {
    return t(surplus.dry ? "surplus.line.cap_dry" : "surplus.line.cap", {
      kw: formatNumber(t.lang, surplus.cap_kw ?? 0, 1),
      time: timeOf(surplus.pv_end),
      loadpoint: surplusLoadpoint(t, surplus),
    });
  }
  return t.optional(`surplus.state.${surplus.state}`) ?? surplus.state;
}

/** The second line under a cap: what is left for the loadpoint, and full by when. */
export function surplusExtra(t: Translate, surplus: DaySurplus): string {
  if (surplus.state !== "cap") {
    return "";
  }
  return t("surplus.expected", {
    kwh: formatNumber(t.lang, surplus.expected_kwh ?? 0, 1),
    time: timeOf(surplus.pv_end),
  });
}

/** "Joe tut gerade": only while a cap is set for real. */
export function surplusDoing(t: Translate, surplus: DaySurplus | undefined): string | null {
  if (!surplus || surplus.state !== "cap" || surplus.dry) {
    return null;
  }
  return t("surplus.doing", {
    kw: formatNumber(t.lang, surplus.cap_kw ?? 0, 1),
    loadpoint: surplusLoadpoint(t, surplus),
    time: timeOf(surplus.pv_end),
  });
}

/** evcc settings that work against it, each in plain words. */
export function surplusConflicts(t: Translate, surplus: DaySurplus | undefined): string[] {
  return (surplus?.conflicts ?? []).map(
    (c) =>
      t.optional(`surplus.conflict.${c.code}`, {
        value: formatNumber(t.lang, c.value ?? 0, 0),
        loadpoint: c.loadpoint ?? "",
      }) ?? c.code,
  );
}

/** The warning box about evcc's settings (nothing when all is well). */
export function surplusConflictNote(t: Translate, surplus: DaySurplus | undefined): TemplateResult | typeof nothing {
  const lines = surplusConflicts(t, surplus);
  if (!lines.length) {
    return nothing;
  }
  return html`<div class="note warn" role="status">
    <ha-icon icon="mdi:alert-outline"></ha-icon>
    <span><b>${t("surplus.conflict.title")}</b> ${lines.join(" ")} ${t("surplus.conflict.hint")}</span>
  </div>`;
}
