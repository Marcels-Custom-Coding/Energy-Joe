import { html, nothing, type TemplateResult } from "lit";
import { formatNumber } from "../entities";
import type { Translate } from "../i18n";
import type { BatteryConfig, DaySurplus, HomeAssistant, JoeState } from "../types";
import { timeOf } from "./plan-text";

// "Tagsüber Überschuss abgeben" (control/executor.py _async_surplus): the
// batteries charge only as fast as they must to be full before the sun goes,
// the rest shows at the grid meter for an evcc loadpoint in PV mode. The same
// words on the plan, the overview, the battery pages and the inbox.

/** The daytime surplus, when the rule is on and the backend tells it. */
export function daySurplus(joe: JoeState | undefined): DaySurplus | undefined {
  return joe?.config.rules.day_surplus ? joe.control?.surplus : undefined;
}

/**
 * Whether Joe can cap this battery's charging at a power, as the backend
 * decides it (RoleAdapter.limit_problem): a charge limit in W or kW, the
 * system's power limits (Omnibattery), or a limit in % once Joe knows what
 * 100 % stand for (limit_ref_w: Fronius counts its % of a power the inverter
 * does not show). A limit in A (or without a unit) never.
 */
export function surplusAbility(hass: HomeAssistant | undefined, battery: BatteryConfig): "ok" | "no_limit" | "unit" | "need_ref" {
  const entity = battery.controls?.charge_limit ?? battery.controls?.system_charge_limit;
  if (!entity || battery.adapter === "steps" || battery.adapter === "none") {
    return "no_limit";
  }
  const state = hass?.states[entity];
  if (!state || state.state === "unavailable" || state.state === "unknown") {
    return "ok";
  }
  const unit = state.attributes.unit_of_measurement;
  if (unit === "W" || unit === "kW") {
    return "ok";
  }
  if (unit === "%") {
    return battery.limit_ref_w ? "ok" : "need_ref";
  }
  return "unit";
}

/** Whether the battery's cap limit is in % (it needs "Wofür stehen 100 %?"). */
export function limitInPercent(hass: HomeAssistant | undefined, battery: BatteryConfig): boolean {
  const entity = battery.controls?.charge_limit;
  return Boolean(entity && battery.adapter !== "none" && hass?.states[entity]?.attributes.unit_of_measurement === "%");
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

/** Conflicts of evcc's settings, or of the batteries' own settings (Omnibattery). */
const DEVICE_CONFLICTS = ["charge_delay", "predictive_charging"];

/** evcc settings (or with `device`, the batteries' own settings) that work against it, each in plain words. */
export function surplusConflicts(t: Translate, surplus: DaySurplus | undefined, device = false): string[] {
  return (surplus?.conflicts ?? [])
    .filter((c) => DEVICE_CONFLICTS.includes(c.code) === device)
    .map(
      (c) =>
        t.optional(`surplus.conflict.${c.code}`, {
          value: formatNumber(t.lang, c.value ?? 0, 0),
          loadpoint: c.loadpoint ?? "",
          battery: c.battery ?? "",
        }) ?? c.code,
    );
}

/** The warning boxes about evcc's and the batteries' own settings (nothing when all is well). */
export function surplusConflictNote(t: Translate, surplus: DaySurplus | undefined): TemplateResult | typeof nothing {
  const evcc = surplusConflicts(t, surplus);
  const device = surplusConflicts(t, surplus, true);
  if (!evcc.length && !device.length) {
    return nothing;
  }
  return html`<div class="conflicts">
    ${evcc.length
    ? html`<div class="note warn" role="status">
        <ha-icon icon="mdi:alert-outline"></ha-icon>
        <span><b>${t("surplus.conflict.title")}</b> ${evcc.join(" ")} ${t("surplus.conflict.hint")}</span>
      </div>`
    : nothing}
  ${device.length
    ? html`<div class="note warn" role="status">
        <ha-icon icon="mdi:alert-outline"></ha-icon>
        <span><b>${t("surplus.device_conflict.title")}</b> ${device.join(" ")} ${t("surplus.device_conflict.hint")}</span>
      </div>`
    : nothing}
  </div>`;
}
