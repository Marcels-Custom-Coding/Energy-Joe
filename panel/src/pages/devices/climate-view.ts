import { formatNumber } from "../../entities";
import type { Translate } from "../../i18n";
import type {
  ClimateDevice,
  ClimateFound,
  ClimateRoomConfig,
  ClimateRoomStatus,
  ClimateWeekConfig,
  DeviceProfileConfig,
  HomeAssistant,
  JoeState,
  WeekProfile,
} from "../../types";
import { profileLabel } from "../../week";

// Pure helpers shared by Geräte › Heizung & Klima (the list by room) and one
// climate device's page: which settings a device shows, what runs now and
// whether its power is measured.

/** A change to one room: only the keys that change, so the week profiles stay. */
export type RoomChange = Partial<Omit<ClimateRoomConfig, "week">> & { week?: Partial<ClimateWeekConfig> };

export const DEFAULT_ROOM: ClimateRoomConfig = {
  enabled: false,
  away: "setback",
  setback_k: 3,
  away_preset: null,
  free_day_preset: null,
  night_off: false,
  night_from: "23:00",
  night_until: "06:30",
  week: { enabled: false, modes: {} },
  device_profiles: {},
};

/** How long the house must be empty before it counts as away (model.py). */
export const AWAY_AFTER_DEFAULT = 15;

/** "Profil 3" for week_program_3, else by position. */
export function presetNumber(preset: string, index: number): number {
  const match = /^week_program_(\d+)$/.exec(preset);
  return match ? Number(match[1]) : index + 1;
}

/** A device's tags in a fixed order, to tell whether two states are the same. */
export function profilesKey(profiles: Record<string, DeviceProfileConfig>): string {
  return JSON.stringify(
    Object.keys(profiles)
      .sort()
      .map((preset) => [preset, profiles[preset]?.name ?? "", profiles[preset]?.tags ?? []]),
  );
}

/** What a device shows and which of its settings count (the same rules as control/climate.py). */
export interface RoomView {
  room: ClimateRoomConfig;
  cooling: boolean;
  /** Presets to pick by hand (without "none" and "boost"). */
  presets: string[];
  /** The device's own week programs (e.g. Homematic IP): they get tags instead of week profiles. */
  programs: string[];
  /** The week profile sets that have profiles. */
  sets: WeekProfile[][];
  weekOn: boolean;
  weekRuns: boolean;
  tagged: boolean;
  deviceRuns: boolean;
  /** Neither week profiles nor device profiles run: the old away/free-day settings apply. */
  legacy: boolean;
  /** A profile tagged "away" replaces the room's own away setting. */
  awayTagged: boolean;
  awayWays: ClimateRoomConfig["away"][];
  away: ClimateRoomConfig["away"];
}

export function roomView(
  device: ClimateDevice,
  stored: Partial<ClimateRoomConfig> | undefined,
  now: ClimateRoomStatus | undefined,
  deviceProfiles: Record<string, DeviceProfileConfig>,
): RoomView {
  const room: ClimateRoomConfig = { ...DEFAULT_ROOM, ...(stored ?? {}) };
  const cooling = device.hvac_modes.includes("cool");
  const presets = device.preset_modes.filter((p) => !["none", "boost"].includes(p));
  // Air conditioners get week profiles; devices with week programs of their own get tags.
  const programs = device.week_presets ?? [];
  const sets = Object.values(room.week?.modes ?? {}).filter((set): set is WeekProfile[] => !!set?.length);
  const weekOn = cooling && !programs.length && !!room.week?.enabled;
  const weekRuns = weekOn && sets.length > 0 && now?.kind !== "legacy";
  // The device's profiles count once one of them is "Normal"; until then the old settings apply.
  const tagged = programs.some((preset) => deviceProfiles[preset]?.tags.includes("normal"));
  const deviceRuns = tagged && now?.kind !== "legacy";
  const legacy = !weekRuns && !deviceRuns;
  // Without a profile tagged "away", the room's own away setting still applies.
  const awayTagged = weekRuns
    ? sets.every((set) => set.some((p) => p.tags.includes("away")))
    : programs.some((preset) => deviceProfiles[preset]?.tags.includes("away"));
  const awayWays = (legacy ? ["setback", "off", ...(presets.length ? ["preset"] : [])] : ["setback", "off"]) as ClimateRoomConfig["away"][];
  const away = legacy ? room.away : room.away === "off" ? "off" : "setback";
  return { room, cooling, presets, programs, sets, weekOn, weekRuns, tagged, deviceRuns, legacy, awayTagged, awayWays, away };
}

/** Devices that use power themselves: air conditioners, or what has a meter already. */
export function usesPower(device: ClimateDevice, rooms: Record<string, ClimateRoomConfig>, found: ClimateFound | undefined): boolean {
  const meter = rooms[device.entity_id]?.meter;
  const own = found?.suggested?.[device.entity_id]?.device_id;
  return (
    device.hvac_modes.some((mode) => ["cool", "dry", "fan_only", "heat_cool"].includes(mode)) ||
    (meter != null && meter !== "none") ||
    (own != null && own === device.device_id)
  );
}

/** A meter is paired (not "none", not open). */
export function measured(room: Partial<ClimateRoomConfig> | undefined): boolean {
  return !!room?.meter && room.meter !== "none";
}

/** Current and target temperature, live values first. */
export function temperatures(
  hass: HomeAssistant | undefined,
  device: ClimateDevice | undefined,
  entity: string,
): { current: number | null; target: number | null } {
  const attrs = hass?.states[entity]?.attributes;
  const number = (value: unknown): number | null => (value == null || value === "" || !Number.isFinite(Number(value)) ? null : Number(value));
  return {
    current: number(attrs?.current_temperature ?? device?.current_temperature),
    target: number(attrs?.temperature ?? device?.temperature),
  };
}

/** "21,5 °C · soll 22 °C" (or only the room's temperature). */
export function temperatureText(t: Translate, temps: { current: number | null; target: number | null }): string | undefined {
  const { current, target } = temps;
  if (current !== null && target !== null) {
    return t("devices.card.climate", { current: formatNumber(t.lang, current, 1), target: formatNumber(t.lang, target, 1) });
  }
  return current !== null ? t("devices.card.temp", { value: formatNumber(t.lang, current, 1) }) : undefined;
}

/** The profile running now in a few words ("Profil 3 Abwesend"), for the list by room. */
export function activeProfile(
  t: Translate,
  device: ClimateDevice,
  now: ClimateRoomStatus | undefined,
  profiles: Record<string, DeviceProfileConfig>,
): string | undefined {
  if (!now?.kind || now.kind === "legacy") {
    return undefined;
  }
  if (now.override?.reason === "off") {
    return t("week.why.off_by_hand");
  }
  const target = now.target;
  if (now.kind === "device") {
    const preset = target?.preset;
    if (!target) return t("week.as_is");
    if (target.hvac === "off") return t("week.state_off");
    if (!preset) return undefined;
    const index = (device.week_presets ?? []).indexOf(preset);
    return profileLabel(t("week.profile", { n: presetNumber(preset, Math.max(0, index)) }), profiles[preset]?.name);
  }
  if (now.profile?.index != null) {
    return profileLabel(t("week.profile", { n: now.profile.index + 1 }), now.profile.name);
  }
  return !target ? t("week.as_is") : target.hvac === "off" ? t("week.state_off") : undefined;
}

/** Why Joe does what he does, short ("Niemand da"); the old settings name the situation. */
export function reasonText(t: Translate, now: ClimateRoomStatus | undefined, awayAfter: number): string | undefined {
  if (!now?.why) return undefined;
  return t.optional(`week.why.${now.why}`, { min: awayAfter }) ?? t.optional(`climate.why.${now.why}`);
}

/** Haushalt › Nachtruhe in a few words: fixed times or the entity that says it. */
export function nightText(t: Translate, hass: HomeAssistant | undefined, joe: JoeState): { text: string; set: boolean } {
  const climate = joe.config.climate;
  if (climate?.night_by !== "entity") {
    return { text: t("climate.mirror.night.time"), set: true };
  }
  const night = climate.night_entity ?? null;
  return night
    ? { text: String(hass?.states[night]?.attributes.friendly_name ?? night), set: true }
    : { text: t("climate.mirror.night.no_entity"), set: false };
}
