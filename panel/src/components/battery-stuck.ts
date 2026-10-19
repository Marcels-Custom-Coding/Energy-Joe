import { html, nothing, type TemplateResult } from "lit";
import { formatNumber } from "../entities";
import type { Translate } from "../i18n";
import type { BatteryConfig, BatteryStuck, ControlView, HomeAssistant } from "../types";
import { haOpen } from "./ha-open";
import { dayText } from "./look-back";
import { timeOf } from "./plan-text";
import { tip } from "./tip";

// A battery that cannot work because of a setting that is not Joe's
// (control.stuck, executor._async_watch_stuck): the reserve at or above its
// level, discharging or charging blocked at the device. Joe puts back only
// what he wrote himself, so here he only says so – in "Joe braucht dich", on
// the battery's page and in the log – and opens the lever in Home Assistant.

/**
 * A lever's value as the owner reads it: on/off, a number with the entity's
 * unit from Home Assistant (else `unit`), an option as it is.
 */
export function readableValue(t: Translate, hass: HomeAssistant | undefined, value: unknown, entityId: string, unit = ""): string {
  if (typeof value === "boolean") {
    return t(value ? "common.on" : "common.off");
  }
  if (typeof value === "number") {
    const own = hass?.states[entityId]?.attributes.unit_of_measurement;
    const suffix = typeof own === "string" && own ? own : unit;
    return `${formatNumber(t.lang, value, 1)}${suffix ? ` ${suffix}` : ""}`;
  }
  if (value == null || value === "") {
    return "–";
  }
  return String(value);
}

/** The texts' placeholders: the lever's name and value, the battery's level. */
function vars(t: Translate, hass: HomeAssistant | undefined, entry: BatteryStuck): Record<string, string> {
  return {
    name: entry.name,
    value: readableValue(t, hass, entry.value, entry.entity_id, entry.reason === "reserve" ? "%" : ""),
    soc: formatNumber(t.lang, entry.soc, 1),
  };
}

/** "{Speicher} kann nicht entladen" / "… nicht laden". */
export function stuckTitle(t: Translate, name: string, entry: BatteryStuck): string {
  return t(entry.reason === "charge" ? "stuck.title.charge" : "stuck.title.discharge", { name });
}

/** What holds it back, what Joe does not do about it and what the owner can do. */
export function stuckText(t: Translate, hass: HomeAssistant | undefined, entry: BatteryStuck): string {
  return t(`stuck.${entry.reason}`, vars(t, hass, entry));
}

/** The same in short, for the battery's page. */
export function stuckShort(t: Translate, hass: HomeAssistant | undefined, entry: BatteryStuck): string {
  return t(`stuck.short.${entry.reason}`, vars(t, hass, entry));
}

/** "seit 20:05 Uhr", with the day when it did not start today. */
export function stuckSince(t: Translate, since: string): string {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const time = timeOf(since);
  return since.slice(0, 10) === today ? t("stuck.since", { time }) : t("stuck.since.day", { day: dayText(t.lang, since, "short"), time });
}

/**
 * The note in the battery's "Jetzt": what holds it back since when, the
 * lever in Home Assistant and why Joe leaves it alone. Nothing while the
 * battery works.
 */
export function stuckNote(
  t: Translate,
  hass: HomeAssistant | undefined,
  battery: BatteryConfig,
  control: ControlView | undefined,
): TemplateResult | typeof nothing {
  const entry = control?.stuck?.[battery.id];
  if (!entry) {
    return nothing;
  }
  return html`<div class="note warn stuck" role="status" data-tipped>
    <ha-icon icon="mdi:battery-lock"></ha-icon>
    <span>
      <b>${stuckTitle(t, battery.name, entry)}</b> ${stuckShort(t, hass, entry)}
      <small class="stuck-since">${stuckSince(t, entry.since)}</small>
      <div class="note-actions stuck-actions">${haOpen(t, { entityId: entry.entity_id, name: entry.name })}${tip(t, "stuck")}</div>
    </span>
  </div>`;
}
