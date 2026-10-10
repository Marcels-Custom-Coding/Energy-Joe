import { html, nothing, type TemplateResult } from "lit";
import { addRoute, deviceRoute, type DeviceEntry, type Role } from "../device-model";
import { formatNumber, measurementKw, numberState, sumKw } from "../entities";
import type { Translate } from "../i18n";
import { href, onLink, type Route } from "../router";
import type { HomeAssistant, JoeState } from "../types";
import { haOpen, type HaTarget } from "./ha-open";

/** What one device card shows (plan 2.2). */
export interface DeviceCardData {
  name: string;
  area?: string;
  icon: string;
  /** Live state in a few words ("62 % · lädt mit 1,2 kW"). */
  state?: TemplateResult | string;
  role?: Role;
  /** Text → red dot at the name and a red line. */
  problem?: string;
  /** Joe's own page of the device. */
  to: Route;
  /** The address is a sheet (e.g. "Laden einrichten" → /devices/add/car/<consumerId>): back closes it. */
  sheet?: boolean;
  ha: HaTarget;
  /** Quick actions below the link (each with its own tooltip or data-notip). */
  quick?: TemplateResult;
}

/**
 * The same card everywhere: the whole surface is one link to Joe's device
 * page, the round "In HA öffnen" button sits beside it and the quick actions
 * below – never one interactive element inside another.
 */
export function deviceCard(t: Translate, prefix: string, d: DeviceCardData): TemplateResult {
  return html`<article class="dcard ${d.problem ? "problem" : ""}">
    <a class="dcard-main" href=${href(prefix, d.to)} @click=${onLink(d.to, d.sheet ? { sheet: true } : undefined)}>
      <ha-icon icon=${d.icon}></ha-icon>
      <span class="dcard-text">
        <span class="dcard-name"
          >${d.name}${d.problem ? html`<i class="dcard-dot" aria-hidden="true"></i>` : nothing}</span
        >
        ${d.area ? html`<span class="dcard-area">${d.area}</span>` : nothing}
        ${d.state ? html`<span class="dcard-state">${d.state}</span>` : nothing}
        ${d.problem ? html`<span class="dcard-problem">${d.problem}</span>` : nothing}
        ${d.role ? html`<span class="dcard-meta"><span class="chip">${t(`devices.role.${d.role}`)}</span></span>` : nothing}
      </span>
    </a>
    ${haOpen(t, d.ha)}
    ${d.quick ? html`<div class="dcard-quick">${d.quick}</div>` : nothing}
  </article>`;
}

function kw(t: Translate, value: number | null): string | undefined {
  return value === null ? undefined : t("devices.card.kw", { value: formatNumber(t.lang, value, value >= 10 ? 1 : 2) });
}

/** A short live state for any device: level and power, temperatures, what runs. */
export function deviceState(t: Translate, hass: HomeAssistant | undefined, joe: JoeState | undefined, entry: DeviceEntry): string | undefined {
  if (!hass) {
    return undefined;
  }
  if (entry.unassigned) {
    // Without an HA device it cannot be put to a climate device; it can still say what it measures.
    return t(entry.deviceId ? "devices.card.unassigned" : "devices.card.unassigned_kind");
  }
  if (entry.setup) {
    return t(entry.setup === "car" ? "devices.card.setup_car" : "devices.card.setup_hot_water");
  }
  if (entry.battery) {
    const soc = numberState(hass, entry.battery.soc_entity);
    const power = measurementKw(hass, entry.battery.power);
    const parts = [soc === null ? null : `${formatNumber(t.lang, soc, 0)} %`];
    if (power !== null) {
      parts.push(
        Math.abs(power) < 0.05
          ? t("devices.power.idle")
          : t(power > 0 ? "devices.power.charge" : "devices.power.discharge", {
              value: formatNumber(t.lang, Math.abs(power), 2),
            }),
      );
    }
    return parts.filter(Boolean).join(" · ") || undefined;
  }
  if (entry.group === "climate") {
    const attrs = entry.entityId ? hass.states[entry.entityId]?.attributes : undefined;
    const current = entry.climate?.current_temperature ?? (typeof attrs?.current_temperature === "number" ? attrs.current_temperature : null);
    const target = entry.climate?.temperature ?? (typeof attrs?.temperature === "number" ? attrs.temperature : null);
    if (current !== null && target !== null) {
      return t("devices.card.climate", { current: formatNumber(t.lang, current, 1), target: formatNumber(t.lang, target, 1) });
    }
    return current !== null ? t("devices.card.temp", { value: formatNumber(t.lang, current, 1) }) : undefined;
  }
  if (entry.part) {
    const m = joe?.config.measurements;
    if (entry.part === "connection") {
      const grid = measurementKw(hass, m?.grid_power);
      if (grid === null) return undefined;
      const value = formatNumber(t.lang, Math.abs(grid), 2);
      return t(grid >= 0 ? "devices.card.import" : "devices.card.export", { value });
    }
    return kw(t, entry.part === "solar" ? sumKw(hass, m?.solar_power ?? []) : measurementKw(hass, m?.home_power));
  }
  const action = entry.action;
  if (action && joe?.control?.actions?.[action.id]?.on) {
    return t("devices.card.running");
  }
  if (entry.group === "car" && action?.need) {
    const soc = numberState(hass, action.need.soc_entity);
    const range = numberState(hass, action.need.range_entity);
    const parts = [soc === null ? null : `${formatNumber(t.lang, soc, 0)} %`, range === null ? null : `${formatNumber(t.lang, range, 0)} km`];
    return parts.filter(Boolean).join(" · ") || undefined;
  }
  if (entry.group === "hot_water" && action?.sensor_entity) {
    const temp = numberState(hass, action.sensor_entity);
    return temp === null ? undefined : t("devices.card.temp", { value: formatNumber(t.lang, temp, 0) });
  }
  const power = entry.consumer?.power_entity ?? action?.power_entity;
  if (power) {
    const unit = hass.states[power]?.attributes.unit_of_measurement;
    const value = numberState(hass, power);
    return kw(t, value === null ? null : unit === "W" ? value / 1000 : value);
  }
  return entry.noMeter ? t("devices.no_meter_group") : undefined;
}

/** The card data of a device entry; pages may override state or add quick actions. */
export function entryCard(
  t: Translate,
  hass: HomeAssistant | undefined,
  joe: JoeState | undefined,
  entry: DeviceEntry,
  extra: Partial<DeviceCardData> = {},
): DeviceCardData {
  return {
    name: entry.name,
    area: entry.area,
    icon: entry.icon,
    state: deviceState(t, hass, joe, entry),
    role: entry.unassigned || entry.setup ? undefined : entry.role,
    problem: entry.problem,
    // A meter without its night action leads to the assistant that sets it up.
    to: entry.setup ? addRoute(entry.setup, entry.id) : deviceRoute(entry),
    sheet: Boolean(entry.setup),
    ha: { deviceId: entry.deviceId, entityId: entry.entityId, name: entry.name },
    ...extra,
  };
}
