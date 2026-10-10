import { checkText } from "./components/texts";
import { isIgnored } from "./config";
import { entityName } from "./entities";
import type { Translate } from "./i18n";
import type { Route } from "./router";
import type {
  ActionConfig,
  BatteryConfig,
  BatteryFinding,
  CarFinding,
  Check,
  ClimateDevice,
  ClimateFound,
  ClimateRoomConfig,
  ConsumerConfig,
  Discovery,
  HomeAssistant,
  JoeConfig,
  JoeState,
  WallboxFinding,
} from "./types";

// Which device lives in which group of Geräte, by clear rules instead of
// guessing from names: hot water heats to a target, a car charges by need or
// is an "E-Auto" in the Energy dashboard, a climate consumer belongs to the
// thermostat or air conditioner on the same HA device. Pure functions; the
// devices shell builds the list once and hands it to every section.

/** The kinds of devices, in the order of the chips. */
export type Group = "battery" | "climate" | "car" | "hot_water" | "other" | "grid";
export const GROUPS: readonly Group[] = ["battery", "climate", "car", "hot_water", "other", "grid"];

/** What Joe does with a device: steers it, only watches it, or only knows its meter. */
export type Role = "steers" | "watches" | "measures";

export const GROUP_ICONS: Record<Group, string> = {
  battery: "mdi:home-battery-outline",
  climate: "mdi:thermostat",
  car: "mdi:car-electric",
  hot_water: "mdi:water-boiler",
  other: "mdi:power-plug-outline",
  grid: "mdi:transmission-tower",
};

/** The parts of Netz & Sonne (also the anchors of /devices/grid/<anchor>). */
export type GridPart = "connection" | "solar" | "home";

export interface DeviceEntry {
  group: Group;
  /** Joe's own id in the address /devices/<group>/<id> (never a friendly name). */
  id: string;
  name: string;
  /** The HA area, as far as known. */
  area?: string;
  icon: string;
  /** The HA device ("In HA öffnen"); without it the button shows the entity's info dialog. */
  deviceId?: string;
  /** The main entity (live value, info dialog). */
  entityId?: string;
  role: Role;
  /** The first problem in Joe's words: red dot + line on the card. */
  problem?: string;
  /** All problems, most important first. */
  problems: string[];
  battery?: BatteryConfig;
  /** The night action steering it (car, hot water, a device with a meter, or one "ohne Zähler"). */
  action?: ActionConfig;
  /** The device's meter from the Energy dashboard (Verbraucher). */
  consumer?: ConsumerConfig;
  /** A thermostat or air conditioner (from energy_joe/climate/devices; only entity_id/name without it). */
  climate?: ClimateDevice;
  /** Its climate settings (config.climate.rooms[entity]). */
  room?: ClimateRoomConfig;
  /** The device measuring a climate device. */
  meter?: { deviceId?: string; power?: string };
  /** An E-Auto or Warmwasser meter without a night action: the card offers to set it up (/devices/add/<setup>/<consumerId>). */
  setup?: "car" | "hot_water";
  /** A climate consumer Joe cannot put to a thermostat or air conditioner (shown as "nicht zugeordnet"). */
  unassigned?: boolean;
  /** A night action without a meter (Weitere Geräte › "ohne Zähler", id "action-<actionId>"). */
  noMeter?: boolean;
  /** Netz & Sonne: which part (the id is the same). */
  part?: GridPart;
}

const STEERING_NEED = (action: ActionConfig) =>
  Boolean(action.need?.enabled || action.need?.soc_entity || action.need?.range_entity);

/**
 * Last resort for old actions without a meter, without charging by need and
 * without a template prefix: whole words only ("Spülmaschine Automatik" or
 * "Kevin" stay under Weitere Geräte).
 */
const CAR_NAME = /(^|[^\p{L}\d])(e-?auto|auto|car|ev|wallbox)([^\p{L}\d]|$)/iu;

/** The template a night action was made from, by its id (components/action-fields.ts newAction, backend `ev_<device>`). */
function templateOf(action: ActionConfig): "car" | "hot_water" | "other" | undefined {
  if (action.id.startsWith("hot_water_")) return "hot_water";
  if (action.id.startsWith("ev_")) return "car";
  if (action.id.startsWith("custom_")) return "other";
  return undefined;
}

/** The group a night action belongs to. */
export function actionGroup(action: ActionConfig, consumer?: ConsumerConfig | null): "car" | "hot_water" | "other" {
  if (action.kind === "target") {
    return "hot_water";
  }
  if (STEERING_NEED(action) || consumer?.kind === "ev") {
    return "car";
  }
  if (consumer?.kind === "hot_water") {
    return "hot_water";
  }
  // Made as hot water or as a car (also a plain switch without a meter): it stays there.
  const template = templateOf(action);
  if (template === "hot_water" || template === "car") {
    return template;
  }
  if (!consumer && !template && CAR_NAME.test(`${action.id} ${action.name}`)) {
    return "car";
  }
  return "other";
}

/**
 * Where a night action lives: its group and the device id of its page.
 * Car and hot water pages are the action itself; under Weitere Geräte the
 * first action on a meter hangs on that meter's page, any other one (and one
 * without a meter, or on a climate meter) gets its own page "action-<id>".
 */
export function actionPlace(config: JoeConfig, action: ActionConfig): { group: "car" | "hot_water" | "other"; id: string } {
  const consumer = action.consumer_id ? config.consumers.find((c) => c.id === action.consumer_id) : undefined;
  const group = actionGroup(action, consumer);
  if (group !== "other") {
    return { group, id: action.id };
  }
  if (consumer && consumer.kind !== "climate") {
    const first = config.actions.find(
      (a) => a.consumer_id === consumer.id && actionGroup(a, consumer) === "other",
    );
    if (first?.id === action.id) {
      return { group, id: consumer.id };
    }
  }
  return { group, id: `action-${action.id}` };
}

/** The address of a device's page (Netz & Sonne: the anchor). */
export function deviceRoute(entry: Pick<DeviceEntry, "group" | "id">): Route {
  return { tab: "devices", section: entry.group, id: entry.id };
}

/** What "+ Hinzufügen" can add (the kind in /devices/add/<kind>[/<consumerId>]). */
export type AddKind = "battery" | "car" | "hot_water" | "night";

/** The assistant's address; open it with navigate(…, { sheet: true }). */
export function addRoute(kind?: AddKind, consumerId?: string): Route {
  return { tab: "devices", section: "add", id: kind, sub: kind ? consumerId : undefined };
}

/** The HA area of a device or entity. */
export function areaOf(hass: HomeAssistant | undefined, deviceId?: string | null, entityId?: string | null): string | undefined {
  if (!hass) {
    return undefined;
  }
  const entry = entityId ? hass.entities?.[entityId] : undefined;
  const device = deviceId ?? entry?.device_id ?? undefined;
  const areaId = entry?.area_id ?? (device ? hass.devices?.[device]?.area_id : undefined);
  return areaId ? hass.areas?.[areaId]?.name : undefined;
}

function deviceOf(hass: HomeAssistant | undefined, entityId?: string | null): string | undefined {
  return (entityId ? hass?.entities?.[entityId]?.device_id : undefined) ?? undefined;
}

/** The HA device of a meter: its power or energy sensor's device. */
function consumerDevice(hass: HomeAssistant | undefined, consumer: ConsumerConfig): string | undefined {
  return deviceOf(hass, consumer.power_entity) ?? deviceOf(hass, consumer.energy_entity);
}

function withProblems(entry: Omit<DeviceEntry, "problem" | "problems">, problems: (string | null | undefined)[]): DeviceEntry {
  const list = problems.filter((p): p is string => Boolean(p));
  return { ...entry, problems: list, problem: list[0] };
}

function controlProblem(t: Translate, code: string | null | undefined): string | undefined {
  return code ? (t.optional(`devices.problem.${code}`) ?? code) : undefined;
}

/** Checks that put a red dot on a device: warnings, and missing meter or tariff. */
function counts(check: Check): boolean {
  return check.level === "warn" || check.code === "tariff_unknown" || (check.code === "missing" && check.role === "grid_power");
}

export interface DeviceInputs {
  climateFound?: ClimateFound;
  discovery?: Discovery;
  /** The panel's checks (energy_joe/checks). */
  checks?: Check[];
}

/** Every device Joe knows, by group, in a stable order (config order within a group). */
export function buildDevices(t: Translate, state: JoeState, hass: HomeAssistant | undefined, inputs: DeviceInputs = {}): DeviceEntry[] {
  const config = state.config;
  const control = state.control;
  const checks = (inputs.checks ?? []).filter(counts);
  const entries: DeviceEntry[] = [];

  // --- Speicher ---
  for (const battery of config.batteries) {
    const steered = battery.adapter !== "none";
    const ready = control?.ready[battery.id];
    const deviceId = battery.device_id ?? deviceOf(hass, battery.soc_entity);
    entries.push(
      withProblems(
        {
          group: "battery",
          id: battery.id,
          name: battery.name,
          area: areaOf(hass, deviceId, battery.soc_entity),
          icon: GROUP_ICONS.battery,
          deviceId,
          entityId: battery.soc_entity,
          role: steered ? "steers" : "watches",
          battery,
        },
        [
          ...checks.filter((c) => c.battery_id === battery.id).map((c) => checkText(t, c)),
          steered ? controlProblem(t, control?.batteries[battery.id]?.problem) : undefined,
          steered && ready && ready !== "ready" && ready !== "not_controllable"
            ? controlProblem(t, ready === "outdated" ? "not_tested" : ready)
            : undefined,
        ],
      ),
    );
  }

  // --- Heizung & Klima ---
  const rooms = config.climate?.rooms ?? {};
  const found = inputs.climateFound?.devices;
  const climateIds = found ? found.map((d) => d.entity_id) : Object.keys(rooms);
  // A configured device the list does not know any more stays visible with a note.
  for (const entity of Object.keys(rooms)) {
    if (!climateIds.includes(entity)) climateIds.push(entity);
  }
  const climateConsumers = config.consumers.filter((c) => c.kind === "climate");
  const placed = new Set<string>();
  for (const entity of climateIds) {
    const device = found?.find((d) => d.entity_id === entity);
    const room = rooms[entity];
    const deviceId = device?.device_id ?? deviceOf(hass, entity);
    const meter = room?.meter && room.meter !== "none" ? room.meter : undefined;
    const consumer = climateConsumers.find((c) => {
      const own = consumerDevice(hass, c);
      return own !== undefined && !placed.has(c.id) && (own === deviceId || own === meter?.device_id);
    }) ??
      // Without a shared HA device: the meter named exactly like the device (Energy dashboard names).
      climateConsumers.find((c) => !placed.has(c.id) && device && c.name.trim().toLowerCase() === device.name.trim().toLowerCase());
    if (consumer) placed.add(consumer.id);
    const status = state.climate?.rooms[entity];
    const error = status?.error;
    entries.push(
      withProblems(
        {
          group: "climate",
          id: entity,
          name: device?.name ?? (hass ? entityName(hass, entity) : entity),
          area: device?.area ?? areaOf(hass, deviceId, entity),
          icon: GROUP_ICONS.climate,
          deviceId,
          entityId: entity,
          role: room?.enabled ? "steers" : "watches",
          climate: device,
          room,
          meter: meter ? { deviceId: meter.device_id, power: meter.power ?? undefined } : undefined,
          consumer,
        },
        [
          found && !device ? t("devices.problem.gone") : undefined,
          error ? (t.optional(`week.error.${error}`) ?? t("week.error", { error })) : undefined,
        ],
      ),
    );
  }
  for (const consumer of climateConsumers.filter((c) => !placed.has(c.id))) {
    const deviceId = consumerDevice(hass, consumer);
    entries.push(
      withProblems(
        {
          group: "climate",
          id: consumer.id,
          name: consumer.name,
          area: areaOf(hass, deviceId, consumer.power_entity ?? consumer.energy_entity),
          icon: "mdi:help-circle-outline",
          deviceId,
          entityId: consumer.power_entity ?? consumer.energy_entity ?? undefined,
          role: "measures",
          consumer,
          unassigned: true,
        },
        [],
      ),
    );
  }

  // --- Auto & Laden, Warmwasser, Weitere Geräte ---
  const consumers = new Map(config.consumers.map((c) => [c.id, c]));
  const byGroup: Record<"car" | "hot_water" | "other", DeviceEntry[]> = { car: [], hot_water: [], other: [] };
  const withAction = new Set<string>();
  const actionEntry = (action: ActionConfig, group: "car" | "hot_water" | "other", id: string): DeviceEntry => {
    const consumer = action.consumer_id ? consumers.get(action.consumer_id) : undefined;
    const main =
      group === "car"
        ? (action.need?.soc_entity ?? action.need?.range_entity ?? action.entity_id)
        : group === "hot_water"
          ? (action.sensor_entity ?? action.entity_id)
          : action.entity_id;
    const deviceId = deviceOf(hass, action.entity_id) ?? (consumer ? consumerDevice(hass, consumer) : undefined) ?? deviceOf(hass, main);
    return withProblems(
      {
        group,
        id,
        name: id === consumer?.id ? consumer.name : action.name,
        area: areaOf(hass, deviceId, main || undefined),
        icon: GROUP_ICONS[group],
        deviceId,
        entityId: main || undefined,
        role: action.enabled ? "steers" : "watches",
        action,
        consumer,
        noMeter: group === "other" && !consumer,
      },
      [controlProblem(t, control?.actions?.[action.id]?.problem)],
    );
  };
  for (const action of config.actions) {
    const place = actionPlace(config, action);
    if (action.consumer_id && place.group !== "other") withAction.add(action.consumer_id);
    if (action.consumer_id && place.id === action.consumer_id) withAction.add(action.consumer_id);
    byGroup[place.group].push(actionEntry(action, place.group, place.id));
  }
  for (const consumer of config.consumers) {
    if (consumer.kind === "climate" || withAction.has(consumer.id)) {
      continue;
    }
    const group = consumer.kind === "ev" ? "car" : consumer.kind === "hot_water" ? "hot_water" : "other";
    const deviceId = consumerDevice(hass, consumer);
    const entityId = consumer.power_entity ?? consumer.energy_entity ?? undefined;
    const entry = withProblems(
      {
        group,
        id: consumer.id,
        name: consumer.name,
        area: areaOf(hass, deviceId, entityId),
        icon: group === "other" ? GROUP_ICONS.other : GROUP_ICONS[group],
        deviceId,
        entityId,
        role: "measures",
        consumer,
        setup: group === "other" ? undefined : group,
      },
      [],
    );
    // A meter's page stands where the meter is in the Energy dashboard; its action came first above.
    byGroup[group].push(entry);
  }
  // Weitere Geräte: meters first (dashboard order), then actions without a meter.
  const order = new Map(config.consumers.map((c, i) => [c.id, i]));
  byGroup.other.sort((a, b) => (order.get(a.id) ?? Infinity) - (order.get(b.id) ?? Infinity));
  entries.push(...byGroup.car, ...byGroup.hot_water, ...byGroup.other);

  // --- Netz & Sonne ---
  const m = config.measurements;
  const gridChecks = (part: GridPart) =>
    checks
      .filter((c) =>
        part === "connection"
          ? c.role === "grid_power" || c.code === "grid_sign" || c.code === "tariff_unknown"
          : part === "home"
            ? c.role === "home_power" || c.code === "home_negative"
            : c.role === "solar_power",
      )
      .map((c) => checkText(t, c));
  const gridEntry = (part: GridPart, name: string, icon: string, entityId?: string | null): DeviceEntry =>
    withProblems(
      {
        group: "grid",
        id: part,
        part,
        name,
        icon,
        deviceId: deviceOf(hass, entityId),
        entityId: entityId ?? undefined,
        area: areaOf(hass, undefined, entityId),
        role: "measures",
      },
      gridChecks(part),
    );
  entries.push(gridEntry("connection", t("devices.grid.connection"), "mdi:transmission-tower", m.grid_power?.entity_id));
  if (m.solar_power.length || config.forecast.provider) {
    entries.push(gridEntry("solar", t("devices.grid.solar"), "mdi:solar-power-variant", m.solar_power[0]?.entity_id));
  }
  entries.push(gridEntry("home", t("devices.grid.home"), "mdi:home-lightning-bolt-outline", m.home_power?.entity_id));
  return entries;
}

/** The groups that exist here, in chip order; Netz & Sonne is always there. */
export function groupsPresent(devices: DeviceEntry[]): Group[] {
  return GROUPS.filter((group) => group === "grid" || devices.some((d) => d.group === group));
}

/** A device by its address; undefined when it is gone (show nav.not_found on the group page). */
export function findDevice(devices: DeviceEntry[], group: string, id: string | undefined): DeviceEntry | undefined {
  return id === undefined ? undefined : devices.find((d) => d.group === group && d.id === id);
}

/** Does any device of the group need a look? (red dot on the chip and group head) */
export function groupProblem(devices: DeviceEntry[], group: Group): boolean {
  return devices.some((d) => d.group === group && d.problems.length > 0);
}

// --- What discovery found that Joe does not use yet ("Neu gefunden") ---

export interface NewFinding {
  kind: "battery" | "wallbox" | "car";
  /** The key in answers.ignored for "Nicht nutzen". */
  key: string;
  name: string;
  battery?: BatteryFinding;
  wallbox?: WallboxFinding;
  car?: CarFinding;
}

/** Ignore keys of what discovery finds (batteries share theirs with the backend's adopt). */
export function findingKey(kind: NewFinding["kind"], id: string): string {
  return `${kind}:${id}`;
}

/** New batteries, wallboxes and cars Joe found but neither uses nor was told to leave out. */
export function newFindings(config: JoeConfig, discovery: Discovery | undefined): NewFinding[] {
  if (!discovery) {
    return [];
  }
  const result: NewFinding[] = [];
  for (const battery of discovery.batteries) {
    const key = findingKey("battery", battery.id);
    if (!config.batteries.some((b) => b.id === battery.id) && !isIgnored(config, key)) {
      result.push({ kind: "battery", key, name: battery.name, battery });
    }
  }
  for (const wallbox of discovery.wallboxes.filter((w) => w.is_car)) {
    const key = findingKey("wallbox", wallbox.device_id ?? wallbox.name);
    const used = config.actions.some(
      (a) => a.id === `ev_${wallbox.device_id}` || (wallbox.mode_entity && a.entity_id === wallbox.mode_entity),
    );
    if (!used && !isIgnored(config, key)) {
      result.push({ kind: "wallbox", key, name: wallbox.name, wallbox });
    }
  }
  for (const car of discovery.cars ?? []) {
    const key = findingKey("car", car.device_id);
    const used = config.actions.some(
      (a) =>
        (car.entities.soc && a.need?.soc_entity === car.entities.soc) ||
        (car.entities.range && a.need?.range_entity === car.entities.range),
    );
    if (!used && !isIgnored(config, key)) {
      result.push({ kind: "car", key, name: car.name, car });
    }
  }
  return result;
}

/** Batteries Joe found but was told to leave out ("Wieder nutzen"). */
export function ignoredBatteries(config: JoeConfig, discovery: Discovery | undefined): BatteryFinding[] {
  return (discovery?.batteries ?? []).filter(
    (found) => isIgnored(config, findingKey("battery", found.id)) && !config.batteries.some((b) => b.id === found.id),
  );
}
