import { saveConfig } from "./config";
import { entityName } from "./entities";
import type { Translate } from "./i18n";
import type { HomeAssistant } from "./types";

/** The guest tracker's id: device_tracker.gast. */
export const GUEST_ID = "gast";

/** Groups the user already has for "someone is home": members are persons or trackers. */
export function presenceGroups(hass: HomeAssistant): { entity_id: string; name: string; members: string[] }[] {
  return Object.values(hass.states)
    .filter((state) => state.entity_id.startsWith("group."))
    .map((state) => ({ state, members: (state.attributes.entity_id as string[] | undefined) ?? [] }))
    .filter(({ members }) => members.length && members.every((m) => /^(person|device_tracker)\./.test(m)))
    .map(({ state, members }) => ({
      entity_id: state.entity_id,
      name: entityName(hass, state.entity_id),
      members: members.map((m) => entityName(hass, m)),
    }));
}

/**
 * Guest mode: the switch, the tracker following it and the automation that
 * links them – all Home Assistant's own. Saves both into the config through
 * `from` and returns the tracker.
 */
export async function createGuest(from: HTMLElement, hass: HomeAssistant, t: Translate): Promise<string> {
  if (!hass.callApi || !hass.callService) throw new Error("no api");
  const created = await hass.callWS<{ id: string }>({
    type: "input_boolean/create",
    name: t("household.guest.name"),
    icon: "mdi:account-child-outline",
  });
  const guest = `input_boolean.${created.id}`;
  const tracker = `device_tracker.${GUEST_ID}`;
  await hass.callApi("POST", `config/automation/config/energy_joe_${GUEST_ID}`, {
    alias: t("household.guest.automation"),
    description: t("household.guest.automation_text", { guest, tracker }),
    triggers: [
      { trigger: "state", entity_id: guest },
      // Trackers like this one fall back to "not_home" after a few minutes without news.
      { trigger: "time_pattern", minutes: "/1" },
      { trigger: "homeassistant", event: "start" },
    ],
    conditions: [],
    actions: [
      {
        action: "device_tracker.see",
        data: {
          dev_id: GUEST_ID,
          host_name: t("household.guest.tracker_name"),
          location_name: `{{ 'home' if is_state('${guest}', 'on') else 'not_home' }}`,
        },
      },
    ],
    mode: "queued",
  });
  await hass.callService("device_tracker", "see", {
    dev_id: GUEST_ID,
    host_name: t("household.guest.tracker_name"),
    location_name: "not_home",
  });
  saveConfig(from, { context: { guest_switch: guest, guest_tracker: tracker } });
  return tracker;
}

/** Turns the guest switch over: a shortcut for the moment, it sets nothing for good. */
export function guestToggle(hass: HomeAssistant, guest: string): void {
  const on = hass.states[guest]?.state === "on";
  void hass.callService?.("input_boolean", on ? "turn_off" : "turn_on", { entity_id: guest });
}
