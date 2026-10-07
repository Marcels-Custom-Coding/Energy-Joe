import type { WeekPoint, WeekProfile, WeekSplit, WeekTag, WeekValue } from "./types";

/** Switching points per day curve and minutes between them (like model.py). */
export const MAX_POINTS = 12;
export const MINUTE_STEP = 5;
export const LAST_MINUTE = 1435;
export const DAY_MINUTES = 1440;
/** The config's own bounds for a temperature. */
export const VALUE_MIN = 5;
export const VALUE_MAX = 35;

/** "Profil 1 Normal"; a name that only repeats the number is left out. */
export function profileLabel(number: string, name: string | null | undefined): string {
  const own = (name ?? "").trim();
  return !own || /^profile?\s*\d+$/i.test(own) ? number : `${number} ${own}`;
}

/** Icons of the tags, the same on the card and in the editor. */
export const TAG_ICONS: Record<WeekTag, string> = {
  normal: "mdi:home-outline",
  holiday: "mdi:calendar-star",
  away: "mdi:home-export-outline",
  home_office: "mdi:laptop",
};

/** How many curves a split has. */
export const CURVES: Record<WeekSplit, number> = { all: 1, week_weekend: 2, each: 7 };

/** The curve that applies on a weekday (0 = Monday). */
export function curveIndex(split: WeekSplit, weekday: number): number {
  return split === "all" ? 0 : split === "week_weekend" ? (weekday < 5 ? 0 : 1) : weekday;
}

/** "07:05" from minutes after midnight. */
export function clock(minute: number): string {
  return `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`;
}

/** Minutes after midnight from "HH:MM", or null. */
export function minuteOf(text: string): number | null {
  const match = /^(\d{1,2}):(\d{2})/.exec(text);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  return hours < 24 && minutes < 60 ? hours * 60 + minutes : null;
}

/** The value that applies at a minute: the last point at or before it. */
export function valueAt(curve: WeekPoint[], minute: number): WeekValue | undefined {
  let value: WeekValue | undefined;
  for (const [at, v] of curve) {
    if (at <= minute) value = v;
  }
  return value;
}

/** Weekday (0 = Monday) and minute of the day in Home Assistant's time zone. */
export function houseNow(timeZone?: string): { weekday: number; minute: number } {
  const now = new Date();
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(now);
    const part = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
    const weekday = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(part("weekday"));
    if (weekday >= 0) {
      return { weekday, minute: Number(part("hour")) * 60 + Number(part("minute")) };
    }
  } catch {
    // An unknown time zone falls back to the browser's clock.
  }
  return { weekday: (now.getDay() + 6) % 7, minute: now.getHours() * 60 + now.getMinutes() };
}

/** A temperature rounded to the device's step and kept within its limits. */
export function fitValue(value: number, step: number, min: number, max: number): number {
  const rounded = Math.round(value / step) * step;
  return Math.round(Math.min(max, Math.max(min, rounded)) * 10) / 10;
}

/** Curves for another split: splitting copies, merging keeps the first (Monday or Mon–Fri). */
export function resplit(profile: WeekProfile, split: WeekSplit): WeekPoint[][] {
  const copy = (curve: WeekPoint[]) => curve.map(([m, v]) => [m, v] as WeekPoint);
  const day = (weekday: number) => copy(profile.curves[curveIndex(profile.split, weekday)] ?? profile.curves[0]);
  if (split === "all") return [day(0)];
  if (split === "week_weekend") return [day(0), day(5)];
  return [0, 1, 2, 3, 4, 5, 6].map(day);
}

/** Where a new point goes: the middle of the longest stretch, on a quarter hour. */
export function newPointMinute(curve: WeekPoint[]): number | null {
  let from = 0;
  let length = -1;
  for (let i = 0; i < curve.length; i++) {
    const end = curve[i + 1]?.[0] ?? DAY_MINUTES;
    if (end - curve[i][0] > length) {
      from = curve[i][0];
      length = end - from;
    }
  }
  if (length < 0) return null;
  const minute = Math.min(LAST_MINUTE, Math.round((from + length / 2) / 15) * 15);
  return minute > from && !curve.some(([at]) => at === minute) ? minute : null;
}

/** Problems that make a set invalid (the server checks the same). */
export function setProblem(profiles: WeekProfile[]): string | null {
  if (profiles.length !== 6) return "count";
  const seen = new Set<WeekTag>();
  for (const profile of profiles) {
    for (const tag of profile.tags) {
      if (seen.has(tag)) return "tags";
      seen.add(tag);
    }
    if (profile.curves.length !== CURVES[profile.split]) return "curves";
    for (const curve of profile.curves) {
      if (!curve.length || curve.length > MAX_POINTS || curve[0][0] !== 0) return "points";
      for (let i = 1; i < curve.length; i++) {
        if (curve[i][0] <= curve[i - 1][0] || curve[i][0] % MINUTE_STEP) return "points";
      }
    }
  }
  return null;
}
