import type { Translate } from "./i18n";
import type { Route } from "./router";
import { sourceOf } from "./config";
import { actionGroup } from "./device-model";
import type { ActionConfig, ConsumerConfig, JoeConfig } from "./types";

// Where each part of the setup lives once Joe runs: the answers to the
// questions and the rows of "Umschauen". The setup's summary names these
// homes ("wohnt unter Geräte › Speicher"), and a question put off with
// "Später" leads there from Übersicht › Joe braucht dich.

export interface Home {
  to: Route;
  /** "Geräte › Speicher" */
  place: string;
}

/** "Geräte › Speicher" for a route with a section. */
export function placeName(t: Translate, to: Route): string {
  const tab = t(`tab.${to.tab}`);
  const section = to.section ? t.optional(`nav.${to.tab}.${to.section}`) : undefined;
  return section ? `${tab} › ${section}` : tab;
}

function home(t: Translate, to: Route): Home {
  return { to, place: placeName(t, to) };
}

/** The home of a setup question ("tariff", "capacity:<battery id>", …). */
export function questionHome(t: Translate, id: string): Home {
  if (id.startsWith("capacity:")) {
    return home(t, { tab: "devices", section: "battery", id: id.slice("capacity:".length) });
  }
  switch (id) {
    case "tariff":
    case "feed_in":
      return home(t, { tab: "devices", section: "grid", id: "tariff" });
    case "heating":
      // Heat pumps and heaters are meters: their kind is set under Weitere Geräte.
      return home(t, { tab: "devices", section: "other" });
    case "climate":
      return home(t, { tab: "devices", section: "climate" });
    case "hot_water":
      return home(t, { tab: "devices", section: "hot_water" });
    case "ev":
      return home(t, { tab: "devices", section: "car" });
    case "home_office":
      return home(t, { tab: "household", section: "days" });
    default:
      return home(t, { tab: "household", section: "people" });
  }
}

/** The homes of the groups in "Umschauen" and of the summary's other lines. */
export const PART_HOMES = {
  battery: { tab: "devices", section: "battery" },
  grid: { tab: "devices", section: "grid" },
  car: { tab: "devices", section: "car" },
  other: { tab: "devices", section: "other" },
  people: { tab: "household", section: "people" },
  weather: { tab: "household", section: "travel" },
  holiday: { tab: "household", section: "days" },
} as const satisfies Record<string, Route>;

export type Part = keyof typeof PART_HOMES;

export function partHome(t: Translate, part: Part): Home {
  return home(t, PART_HOMES[part]);
}

/** The questions put off with "Später" (answers.later), in the order they were put off. */
export function laterList(config: JoeConfig): string[] {
  const later = config.answers.later;
  return Array.isArray(later) ? later.filter((id): id is string => typeof id === "string") : [];
}

/** A question put off stays open until it has an answer (also one given later at its home). */
export function laterOpen(config: JoeConfig, id: string): boolean {
  const given = (key: string) => config.answers[key] !== undefined && config.answers[key] !== null;
  const byUser = (path: string) => sourceOf(config, path)?.source === "user";
  if (id.startsWith("capacity:")) {
    const battery = config.batteries.find((b) => `capacity:${b.id}` === id);
    return Boolean(battery && battery.capacity_kwh == null && !battery.capacity_entity && !given(id));
  }
  switch (id) {
    case "tariff":
      return config.tariff.kind === "unknown" && !given(id);
    case "feed_in":
      return config.tariff.feed_in_price == null && !config.tariff.feed_in_entity && !given(id);
    case "household":
      return !config.persons.length;
    case "heating":
      // Answered at its home: the kind of a meter set by hand.
      return !given(id) && !config.consumers.some((c) => byUser(`consumers[${c.id}].kind`));
    case "climate":
      return !config.climate?.enabled && !byUser("climate.enabled") && !given(id);
    case "hot_water":
      return !config.actions.some((a) => actionGroup(a, consumerOf(config, a)) === "hot_water") && !given(id);
    case "ev":
      return !config.actions.some((a) => actionGroup(a, consumerOf(config, a)) === "car") && !given(id);
    case "home_office":
      return !byUser("calendar.default_workday") && !given(id);
    default:
      return !given(id);
  }
}

/** The meter a night action belongs to. */
export function consumerOf(config: JoeConfig, action: ActionConfig): ConsumerConfig | undefined {
  return action.consumer_id ? config.consumers.find((c) => c.id === action.consumer_id) : undefined;
}
