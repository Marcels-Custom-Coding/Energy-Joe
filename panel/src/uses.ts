import type { Use } from "./components/used-by";
import type { Translate } from "./i18n";
import type { ClimateFound, JoeConfig } from "./types";

// Who reads the household's values – one function per home in Haushalt. Each
// list names only what really reads the value today (see control/climate.py,
// plan/inputs.py, plan/trips.py, observe/observer.py); empty is honest.

/** Rooms Joe steers: Heizung & Klima switched on and the room itself on. */
function steeredRooms(config: JoeConfig, found?: ClimateFound): string[] {
  const climate = config.climate;
  if (!climate?.enabled) {
    return [];
  }
  const known = found ? new Set(found.devices.map((d) => d.entity_id)) : null;
  return Object.entries(climate.rooms ?? {})
    .filter(([id, room]) => room.enabled && (!known || known.has(id)))
    .map(([id]) => id);
}

/** Cars charged by need that count someone's appointments (null: everyone with a calendar). */
function carsFor(config: JoeConfig, personId?: string): Use[] {
  return config.actions
    .filter((action) => action.enabled && action.need?.enabled)
    .filter((action) => {
      const persons = action.need!.persons;
      if (personId === undefined) {
        return persons === null || persons.length > 0;
      }
      return persons === null ? true : persons.includes(personId);
    })
    .map((action) => ({ label: action.name, to: "/devices" }));
}

function climateUse(t: Translate, rooms: string[]): Use[] {
  return rooms.length ? [{ label: t("usedby.climate"), to: "/devices/climate", count: rooms.length }] : [];
}

/** Wer ist da: the helper "someone is home", the persons and the drive home. */
export function presenceUses(t: Translate, config: JoeConfig, found?: ClimateFound): Use[] {
  const uses = climateUse(t, steeredRooms(config, found));
  if (config.persons.some((p) => p.person_entity)) {
    uses.push({ label: t("usedby.learn"), to: "/review/learned/presence" });
  }
  return uses;
}

/** Tage & Kalender: workday sensor, free days and the calendar rules. */
export function daysUses(t: Translate, config: JoeConfig, found?: ClimateFound): Use[] {
  const calendars = config.persons.some((p) => p.calendars.length);
  const uses: Use[] = [];
  if (config.context.holiday_entity || calendars) {
    uses.push({ label: t("usedby.plan"), to: "/plan" });
    uses.push({ label: t("usedby.consumption"), to: "/review/learned/consumption" });
  }
  if (calendars) {
    uses.push(...carsFor(config).map((use) => ({ ...use, label: t("usedby.car", { name: use.label }) })));
  }
  if (config.context.holiday_entity || calendars || config.context.free_day_entities?.length) {
    uses.push(...climateUse(t, steeredRooms(config, found)));
  }
  return uses;
}

/** Nachtruhe: the rooms that switch off at night. */
export function nightUses(t: Translate, config: JoeConfig, found?: ClimateFound): Use[] {
  const rooms = steeredRooms(config, found).filter((id) => config.climate?.rooms[id]?.night_off);
  return climateUse(t, rooms);
}

/** Unterwegs & Wetter: the weather entity, the routing service, or both. */
export function travelUses(t: Translate, config: JoeConfig, part?: "weather" | "routing", found?: ClimateFound): Use[] {
  const uses: Use[] = [];
  if (part !== "routing" && config.context.weather_entity) {
    uses.push({ label: t("usedby.plan"), to: "/plan" });
    uses.push({ label: t("usedby.consumption"), to: "/review/learned/consumption" });
    uses.push(...climateUse(t, steeredRooms(config, found)));
  }
  if (part !== "weather" && config.routing.service) {
    uses.push(...carsFor(config).map((use) => ({ ...use, label: t("usedby.car", { name: use.label }) })));
    if ((config.climate?.route_eta ?? true) && steeredRooms(config, found).length) {
      uses.push({ label: t("usedby.way"), to: "/household/presence/way" });
    }
  }
  // Both parts may name the same place once.
  return uses.filter((use, i) => uses.findIndex((u) => u.label === use.label) === i);
}

/** A person: the cars whose charging counts this person's appointments (by the car's name). */
export function personUses(_t: Translate, config: JoeConfig, personId: string): Use[] {
  const person = config.persons.find((p) => p.id === personId);
  if (!person?.calendars.length) {
    return [];
  }
  return carsFor(config, personId);
}
