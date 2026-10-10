import { pickEntity, saveConfig, withIgnored } from "../../config";
import { entityName } from "../../entities";
import type { Translate } from "../../i18n";
import type { BatteryFinding, HomeAssistant, JoeConfig } from "../../types";

// Taking over what Joe found, from "Neu gefunden", the assistant and the
// Speicher group page (same patches as components/review.ts in the setup).

/** Takes over a battery Joe found (also one left out before); resolves to its id once saved, else null. */
export async function useBattery(from: HTMLElement, config: JoeConfig, found: BatteryFinding): Promise<string | null> {
  const ok = await saveConfig(
    from,
    {
      batteries: {
        [found.id]: {
          name: found.name,
          adapter: found.adapter,
          soc_entity: found.soc_entity,
          power: found.power,
          capacity_kwh: found.capacity_kwh,
          capacity_entity: found.capacity_entity,
          max_charge_w: found.max_charge_w,
          max_discharge_w: found.max_discharge_w,
          device_id: found.device_id,
          controls: found.controls,
          priority: Math.min(config.batteries.length + 1, 9),
        },
      },
      answers: { ignored: withIgnored(config, `battery:${found.id}`, false) },
    },
    "read",
  );
  return ok ? found.id : null;
}

/** A battery Joe did not find: the user picks its charge level; resolves to its id once saved, else null. */
export async function pickBattery(from: HTMLElement, t: Translate, hass: HomeAssistant, config: JoeConfig): Promise<string | null> {
  const picked = await pickEntity(from, {
    heading: t("pick.battery.title"),
    tip: "pick_battery",
    filter: "soc",
    selected: [],
    exclude: config.batteries.map((b) => b.soc_entity),
  });
  const soc = picked?.selected[0];
  if (!soc) {
    return null;
  }
  const device = hass.entities?.[soc]?.device_id;
  const id = device && !config.batteries.some((b) => b.id === device) ? device : soc;
  const ok = await saveConfig(from, {
    batteries: {
      [id]: {
        name: (device && (hass.devices?.[device]?.name_by_user || hass.devices?.[device]?.name)) || entityName(hass, soc),
        adapter: "none",
        soc_entity: soc,
        device_id: device ?? null,
        priority: Math.min(config.batteries.length + 1, 9),
      },
    },
  });
  return ok ? id : null;
}

/** "Nicht nutzen": Joe leaves a finding out (answers.ignored; "+ Hinzufügen" brings it back). */
export function ignoreFinding(from: HTMLElement, config: JoeConfig, key: string): Promise<boolean> {
  return saveConfig(from, { answers: { ignored: withIgnored(config, key, true) } });
}
