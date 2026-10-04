import type { Suggestion } from "./config";
import type { HomeAssistant } from "./types";

/** Words that mark hot water (German and English, as in entity ids and names). */
const WORDS = ["warmwasser", "brauchwasser", "trinkwasser", "boiler", "hot_water", "hot water", "dhw", "water_heater", "water heater"];
/** Temperatures of the same device that are not the tank: outlets and returns. */
const NOT_THE_TANK = ["ausgang", "zirkulation", "rücklauf", "rucklauf", "ruecklauf", "vorlauf", "outlet", "return", "flow", "inlet"];
const SWITCHES = ["switch", "input_boolean", "select", "input_select", "number", "input_number", "button", "script"];

function text(hass: HomeAssistant, entityId: string): string {
  const state = hass.states[entityId];
  const name = String(state?.attributes.friendly_name ?? "");
  const deviceId = hass.entities?.[entityId]?.device_id;
  const device = deviceId ? hass.devices?.[deviceId] : undefined;
  return `${entityId} ${name} ${device?.name_by_user ?? device?.name ?? ""}`.toLowerCase().replaceAll("-", " ");
}

function matches(value: string, extra: string[]): boolean {
  return [...WORDS, ...extra].some((word) => value.includes(word));
}

/** Words of the hot water consumer's own name ("Warmwasser Wärmepumpe" → warmwasser, wärmepumpe). */
function nameWords(name: string | undefined): string[] {
  return (name ?? "")
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((word) => word.length >= 5);
}

/**
 * Joe's guesses for a hot water night action: the tank's temperature and what
 * switches the heat pump or heating rod, from the words in ids, names and
 * device names. The user picks; nothing is chosen without them.
 */
export function hotWaterSuggestions(
  hass: HomeAssistant,
  consumerName?: string,
): { sensors: Suggestion[]; switches: Suggestion[] } {
  const extra = nameWords(consumerName);
  const sensors: { entity_id: string; score: number }[] = [];
  const switches: { entity_id: string; score: number }[] = [];
  for (const [entityId, state] of Object.entries(hass.states)) {
    const domain = entityId.split(".")[0];
    const value = text(hass, entityId);
    if (!matches(value, extra)) {
      continue;
    }
    const own = entityId.toLowerCase();
    const unit = String(state.attributes.unit_of_measurement ?? "");
    if ((domain === "sensor" || domain === "number") && (unit === "°C" || unit === "°F")) {
      // The tank itself first: its own id says hot water, outlets and returns last.
      const score = (WORDS.some((w) => own.includes(w.replace(" ", "_"))) ? 2 : 1) - (NOT_THE_TANK.some((w) => value.includes(w)) ? 2 : 0);
      sensors.push({ entity_id: entityId, score });
    } else if (SWITCHES.includes(domain)) {
      switches.push({ entity_id: entityId, score: domain === "switch" || domain === "input_boolean" ? 1 : 0 });
    }
  }
  const best = (list: { entity_id: string; score: number }[]): Suggestion[] =>
    list
      .sort((a, b) => b.score - a.score || a.entity_id.localeCompare(b.entity_id))
      .slice(0, 6)
      .map((item, index) => ({ entity_id: item.entity_id, confidence: index === 0 && item.score > 0 ? 0.7 : 0.5 }));
  return { sensors: best(sensors), switches: best(switches) };
}
