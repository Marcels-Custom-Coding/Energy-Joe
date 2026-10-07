import type { HassEntity, HomeAssistant, Measurement } from "./types";

/** Which entities fit a question. */
export type FilterName =
  | "power"
  | "soc"
  | "price"
  | "weather"
  | "workday"
  | "calendar"
  | "person"
  | "energy"
  | "level"
  | "temperature"
  | "setpoint"
  | "toggle"
  | "option"
  | "writable"
  | "distance"
  | "consumption"
  | "car_energy"
  | "night"
  | "toggle_like"
  | "presence"
  | "any";

const POWER_UNITS = ["W", "kW", "MW"];
const ENERGY_UNITS = ["Wh", "kWh", "MWh"];

// Something that is on or off: a helper, a switch, a binary sensor, a schedule.
const toggleLike = (e: HassEntity) => ["binary_sensor", "input_boolean", "switch", "schedule"].includes(domain(e));

const FILTERS: Record<FilterName, (entity: HassEntity) => boolean> = {
  power: (e) => domain(e) === "sensor" && POWER_UNITS.includes(unit(e)),
  soc: (e) => domain(e) === "sensor" && unit(e) === "%",
  energy: (e) => domain(e) === "sensor" && ENERGY_UNITS.includes(unit(e)),
  price: (e) =>
    ["sensor", "number", "input_number"].includes(domain(e)) &&
    (e.attributes.device_class === "monetary" || /\/\s*kwh/i.test(unit(e))),
  weather: (e) => domain(e) === "weather",
  workday: (e) => domain(e) === "binary_sensor",
  calendar: (e) => domain(e) === "calendar",
  person: (e) => domain(e) === "person",
  level: (e) => ["number", "input_number"].includes(domain(e)) && unit(e) === "%",
  temperature: (e) => ["sensor", "number", "input_number"].includes(domain(e)) && ["°C", "°F"].includes(unit(e)),
  setpoint: (e) => ["number", "input_number"].includes(domain(e)),
  toggle: (e) => ["switch", "input_boolean"].includes(domain(e)),
  option: (e) => ["select", "input_select"].includes(domain(e)),
  writable: (e) =>
    ["number", "input_number", "switch", "input_boolean", "select", "input_select", "script", "button", "input_button"].includes(
      domain(e),
    ),
  // A car's range or odometer, its consumption, its battery size.
  distance: (e) => domain(e) === "sensor" && ["km", "mi", "m"].includes(unit(e)),
  consumption: (e) => domain(e) === "sensor" && /kwh\/100|wh\/km|km\/kwh|mi\/kwh/i.test(unit(e).replace(/\s/g, "")),
  car_energy: (e) => ["sensor", "number", "input_number"].includes(domain(e)) && [...ENERGY_UNITS, "kJ", "MJ"].includes(unit(e)),
  night: toggleLike,
  toggle_like: toggleLike,
  presence: (e) => ["group", "input_boolean", "binary_sensor", "switch", "person", "device_tracker"].includes(domain(e)),
  any: () => true,
};

function domain(entity: HassEntity): string {
  return entity.entity_id.split(".", 1)[0];
}

function unit(entity: HassEntity): string {
  return String(entity.attributes.unit_of_measurement ?? "");
}

export function fits(entity: HassEntity, filter: FilterName): boolean {
  return FILTERS[filter](entity);
}

/** The name people see in Home Assistant. */
export function entityName(hass: HomeAssistant, entityId: string): string {
  const entity = hass.states[entityId];
  const name = entity?.attributes.friendly_name;
  return typeof name === "string" && name ? name : entityId.split(".", 2)[1]?.replace(/_/g, " ") ?? entityId;
}

/** "Device · Area" for an entity, as far as known. */
export function entityPlace(hass: HomeAssistant, entityId: string): string {
  const entry = hass.entities?.[entityId];
  const device = entry?.device_id ? hass.devices?.[entry.device_id] : undefined;
  const areaId = entry?.area_id ?? device?.area_id;
  const area = areaId ? hass.areas?.[areaId]?.name : undefined;
  const deviceName = device?.name_by_user || device?.name || undefined;
  // "Garage Battery State of charge" already names its device.
  const named = deviceName && entityName(hass, entityId).toLowerCase().startsWith(deviceName.toLowerCase());
  return [named ? undefined : deviceName, area].filter(Boolean).join(" · ");
}

export function isAvailable(hass: HomeAssistant, entityId: string | null | undefined): boolean {
  const state = entityId ? hass.states[entityId]?.state : undefined;
  return state !== undefined && state !== "unavailable" && state !== "unknown";
}

export function numberState(hass: HomeAssistant, entityId: string | null | undefined): number | null {
  if (!entityId) {
    return null;
  }
  const value = Number.parseFloat(hass.states[entityId]?.state ?? "");
  return Number.isFinite(value) ? value : null;
}

export function formatNumber(lang: string, value: number, digits: number): string {
  return new Intl.NumberFormat(lang, { maximumFractionDigits: digits }).format(value);
}

/** The state as Home Assistant would show it ("1.2 kW", "on", …). */
export function formatState(hass: HomeAssistant, entityId: string, lang: string): string {
  const entity = hass.states[entityId];
  if (!entity) {
    return "–";
  }
  if (hass.formatEntityState) {
    return hass.formatEntityState(entity);
  }
  const value = numberState(hass, entityId);
  if (value === null) {
    return entity.state;
  }
  const digits = Math.abs(value) >= 100 ? 0 : Math.abs(value) >= 10 ? 1 : 2;
  return `${formatNumber(lang, value, digits)} ${unit(entity)}`.trim();
}

function toKw(value: number, unitText: string): number {
  if (unitText === "W") {
    return value / 1000;
  }
  if (unitText === "MW") {
    return value * 1000;
  }
  return value;
}

/** A power reading in kW in Joe's sign convention, or null if unknown. */
export function measurementKw(hass: HomeAssistant, measurement: Measurement | null | undefined): number | null {
  if (!measurement) {
    return null;
  }
  const raw = numberState(hass, measurement.entity_id);
  if (raw === null) {
    return null;
  }
  let value = toKw(raw, unit(hass.states[measurement.entity_id]));
  if (measurement.invert) {
    value = -value;
  }
  if (measurement.minus_entity_id) {
    const minus = numberState(hass, measurement.minus_entity_id);
    if (minus === null) {
      return null;
    }
    value -= toKw(minus, unit(hass.states[measurement.minus_entity_id]));
  }
  return value;
}

/** An energy reading (e.g. a battery's capacity) in kWh, or null if unknown. */
export function energyKwh(hass: HomeAssistant, entityId: string | null | undefined): number | null {
  const value = numberState(hass, entityId);
  if (value === null || !entityId) {
    return null;
  }
  const unitText = unit(hass.states[entityId]);
  return unitText === "Wh" ? value / 1000 : unitText === "MWh" ? value * 1000 : value;
}

/** Sum of several power readings in kW (e.g. all solar inverters). */
export function sumKw(hass: HomeAssistant, measurements: Measurement[]): number | null {
  const values = measurements.map((m) => measurementKw(hass, m)).filter((v): v is number => v !== null);
  return values.length ? values.reduce((a, b) => a + b, 0) : null;
}
