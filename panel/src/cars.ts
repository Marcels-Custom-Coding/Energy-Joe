import type { Translate } from "./i18n";
import type { Route } from "./router";
import type { ActionConfig, CarConfig, CarRole, CarSourceConfig, CarValueSource, Discovery, JoeConfig, JoeState, PlanCar, PointStatus } from "./types";

// Cars and charge points in the panel (the backend: plan/cars.py and
// control/cars.py). A car is everything about its need; a charge point is a
// wallbox Joe switches. Which car is plugged in where comes with the state.

/** The address of a car's page. */
export function carRoute(carId: string, sub?: string): Route {
  return { tab: "devices", section: "car", id: carId, sub };
}

/** The address of a charge point's page (/devices/car/point/<action id>). */
export function pointRoute(actionId: string): Route {
  return { tab: "devices", section: "car", id: "point", sub: actionId };
}

/** Wallboxes Joe switches for cars. */
export function chargePoints(config: JoeConfig): ActionConfig[] {
  return config.actions.filter((a) => a.kind === "switch" && a.point != null);
}

export function carById(config: JoeConfig, id: string | null | undefined): CarConfig | undefined {
  return id ? config.cars?.find((c) => c.id === id) : undefined;
}

/** The cars that may charge at a charge point. */
export function allowedCars(config: JoeConfig, action: ActionConfig): CarConfig[] {
  const chosen = action.point?.cars;
  return (config.cars ?? []).filter((c) => chosen == null || chosen.includes(c.id));
}

/** Which car is plugged in at a charge point (from the state). */
export function pointStatus(joe: JoeState | undefined, actionId: string): PointStatus | undefined {
  return joe?.cars?.points?.[actionId];
}

/** The charge point a car is plugged into, if any. */
export function carPoint(joe: JoeState | undefined, carId: string): ActionConfig | undefined {
  const point = joe?.cars?.cars?.[carId]?.point;
  return point ? joe?.config.actions.find((a) => a.id === point) : undefined;
}

/** Where a car's value comes from now (null: nothing has it). */
export function carValue(joe: JoeState | undefined, carId: string, role: CarRole): CarValueSource | undefined {
  return joe?.cars?.cars?.[carId]?.values?.[role];
}

/** The integration's name for a source chip ("evcc", "Hyundai / Kia", "von Hand"). */
export function sourceName(t: Translate, source: Pick<CarValueSource, "kind" | "platform" | "name">): string {
  if (source.kind === "evcc") return "evcc";
  if (source.kind === "manual") return t("car.source.manual");
  return (source.platform && t.optional(`car.platform.${source.platform}`)) || source.name || source.platform || t("car.source.car");
}

/** "Kona steckt an Parkplatz eBox" / "steckt nicht" / "Gast" for a car card or head. */
export function carPlugText(t: Translate, joe: JoeState, car: CarConfig): string {
  const point = carPoint(joe, car.id);
  if (point) {
    return t("car.plugged_at", { point: point.name });
  }
  const plugged = joe.cars?.cars?.[car.id]?.plugged;
  return t(plugged ? "car.plugged_elsewhere" : "car.not_plugged");
}

/** What a charge point has: "Kona steckt (erkannt über evcc)", "frei", "Gast", "ein Auto – welches?". */
export function pointText(t: Translate, joe: JoeState, action: ActionConfig): string {
  const status = pointStatus(joe, action.id);
  if (!status) return t("point.state.none");
  if (status.state === "car") {
    const car = carById(joe.config, status.car);
    return t("point.state.car", { car: car?.name ?? status.car ?? "", how: t(`point.how.${status.how ?? "home"}`) });
  }
  return t(`point.state.${status.state}`);
}

/** Tomorrow's need of a car, as the plan worked it out (cars charged by need only). */
export function planCar(joe: JoeState | undefined, carId: string): PlanCar | undefined {
  return joe?.plan?.cars?.[carId];
}


/** The key under answers.ignored that leaves a car Joe sees out (a deleted car's integrations). */
export function carIgnoredKey(source: Pick<CarSourceConfig, "id" | "device_id">): string {
  return `car:${source.device_id ?? source.id}`;
}

/** A car Home Assistant shows, and what it is to Joe: part of a car, left out, or new. */
export interface CarFind {
  source: CarSourceConfig;
  /** The car it belongs to. */
  car?: CarConfig;
  /** Left out once (the car was deleted, or "Ignorieren"). */
  ignored: boolean;
}

/** Every car Joe sees (evcc's vehicles first, then the car makers'), also the ones left out. */
export function carFinds(config: JoeConfig, discovery: Discovery | undefined): CarFind[] {
  const ignored = new Set(config.answers.ignored);
  return (discovery?.car_sources ?? []).map((source) => ({
    source,
    car: (config.cars ?? []).find((c) => c.sources.some((s) => s.id === source.id)),
    ignored: ignored.has(carIgnoredKey(source)) || ignored.has(`car:${source.id}`),
  }));
}
