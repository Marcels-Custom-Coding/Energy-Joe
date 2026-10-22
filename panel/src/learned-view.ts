import { css, html, nothing, type TemplateResult } from "lit";
import { dayText, fixed } from "./components/look-back";
import { energyKwh, formatNumber } from "./entities";
import type { Translate } from "./i18n";
import {
  DAY_LABELS,
  type ActionConfig,
  type BatteryConfig,
  type CarConfig,
  type ConsumerConfig,
  type HomeAssistant,
  type JoeConfig,
  type JoeState,
  type Learned,
  type PersonConfig,
} from "./types";

// What Joe learned about one thing, as rows: Rückblick › Gelernt shows them all,
// device pages mirror their own row (0.9.14).

/** One learned thing: a name, a few values and an optional note below. */
export interface LearnedRow {
  name: string;
  values: (string | TemplateResult)[];
  note?: string;
  /** Something to act on below the note, e.g. a link. */
  extra?: TemplateResult;
}

/** A small table: one row per item, a label and a few values. */
export function learnedRows(rows: LearnedRow[]): TemplateResult {
  return html`<div class="rows">
    ${rows.map(
      (row) => html`<div class="row-item">
        <b>${row.name}</b>
        <span class="values">${row.values.map((value) => html`<span>${value}</span>`)}</span>
        ${row.note ? html`<small>${row.note}</small>` : nothing}
        ${row.extra ? html`<span class="row-extra">${row.extra}</span>` : nothing}
      </div>`,
    )}
  </div>`;
}

export const learnedStyles = css`
  .rows {
    display: grid;
    margin-top: 10px;
  }
  .row-item {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 2px 12px;
    padding: 9px 0;
    border-top: 1px solid var(--joe-line);
  }
  .row-item:first-child {
    border-top: 0;
  }
  .row-item b {
    overflow-wrap: anywhere;
  }
  .row-item .values {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 4px 12px;
    margin-left: auto;
    font-variant-numeric: tabular-nums;
    color: var(--joe-ink-2);
  }
  .row-item small {
    flex-basis: 100%;
    color: var(--joe-muted);
    font-size: 12.5px;
    line-height: 1.4;
  }
  .row-item .row-extra {
    flex-basis: 100%;
  }
`;

/** The measured size counts as off when it is this far from the size Joe plans with. */
export const CAPACITY_OFF = 0.15;

/**
 * The size Joe plans with: the owner's value, else the device's (read into
 * the config or from its capacity entity); null when none is known.
 */
export function capacityBasis(
  config: JoeConfig,
  hass: HomeAssistant | undefined,
  battery: BatteryConfig,
): { value: number; own: boolean; measured?: boolean } | null {
  const own = battery.capacity_kwh != null && config.provenance[`batteries[${battery.id}].capacity_kwh`]?.source === "user";
  const value = battery.capacity_kwh ?? (hass ? energyKwh(hass, battery.capacity_entity) : null);
  if (value) {
    return { value, own };
  }
  // Nobody could size it: Joe plans with what he measured.
  const measured = config.learned?.battery_models?.[battery.id]?.measured_kwh;
  return measured ? { value: measured, own: false, measured: true } : null;
}

/** Whether the measured size is too far from the one Joe plans with (only when both are known). */
export function capacityOff(basis: number | null | undefined, measured: number | null | undefined): boolean {
  return basis != null && measured != null && basis > 0 && Math.abs(measured - basis) / basis > CAPACITY_OFF;
}

/** "11 Läufen" / "1 Lauf": the charge and discharge runs a measurement came from. */
export function runsText(t: Translate, runs: number): string {
  const [one, other] = t("word.run").split("|");
  return `${formatNumber(t.lang, runs, 0)} ${runs === 1 ? one : other}`;
}

/** A battery: the size Joe plans with, the size he measured from runs, and what comes back out. */
export function batteryLearned(
  t: Translate,
  config: JoeConfig,
  hass: HomeAssistant | undefined,
  learned: Learned,
  battery: BatteryConfig,
  need: number,
): LearnedRow {
  const lang = t.lang;
  const found = learned.battery_models?.[battery.id];
  const basis = capacityBasis(config, hass, battery);
  const measured = found?.measured_kwh ?? null;
  const values: string[] = [];
  if (basis?.measured) {
    values.push(t("learn.battery.basis.measured", { value: fixed(lang, basis.value, 1), runs: runsText(t, found?.runs ?? 0) }));
  } else if (basis) {
    values.push(t(basis.own ? "learn.battery.basis.user" : "learn.battery.basis.device", { value: fixed(lang, basis.value, 1) }));
  }
  if (measured != null && !basis?.measured) {
    values.push(t("learn.battery.measured", { value: fixed(lang, measured, 1), runs: runsText(t, found?.runs ?? 0) }));
  }
  if (found?.efficiency != null) {
    values.push(t("learn.battery.efficiency", { value: formatNumber(lang, found.efficiency * 100, 0) }));
  }
  if (found?.converter) {
    values.push(t("learn.battery.converter", { value: formatNumber(lang, found.converter.factor * 100, 0) }));
  }
  const notes: string[] = [];
  if (!basis) {
    notes.push(t("learn.battery.basis.none"));
  }
  if (!battery.power) {
    notes.push(t("learn.battery.no_power"));
  } else {
    if (measured == null) {
      notes.push(t("learn.battery.measuring"));
    } else if (basis && capacityOff(basis.value, measured)) {
      notes.push(t("learn.battery.mismatch", { value: fixed(lang, basis.value, 1) }));
    }
    if (found?.efficiency == null) {
      notes.push(t("learn.battery.learning", { need }));
    }
  }
  return {
    name: battery.name,
    values: values.length ? values : [t("learn.still")],
    note: notes.length ? notes.join(" ") : undefined,
  };
}

/** A device with its own meter: its usual day and how much the cold adds. */
export function groupLearned(t: Translate, learned: Learned, consumer: ConsumerConfig): LearnedRow {
  const found = learned.group_models?.[consumer.id];
  return {
    name: consumer.name,
    values: found
      ? [
          t("learn.groups.average", { value: fixed(t.lang, found.average, 1) }),
          found.heat >= 0.05 ? t("learn.groups.heat", { value: fixed(t.lang, found.heat, 2) }) : t("learn.groups.steady"),
        ]
      : [t("learn.still")],
  };
}

/** Hot water: how fast it heats, how fast it cools down, how much is used. */
export function hotWaterLearned(t: Translate, learned: Learned, action: ActionConfig): LearnedRow {
  const found = learned.action_models?.[action.id];
  return {
    name: action.name,
    values: found
      ? [
          t("learn.hot_water.rate", { value: fixed(t.lang, found.rate_k_per_h, 1) }),
          t("learn.hot_water.loss", { value: fixed(t.lang, found.loss_k_per_h, 1) }),
          t("learn.hot_water.demand", { value: fixed(t.lang, found.demand_k, 0) }),
        ]
      : [t("learn.still")],
    note: found ? undefined : t("learn.hot_water.learning"),
  };
}

/** A car charged by need: real consumption and the usual distance. */
export function carLearned(t: Translate, learned: Learned, car: CarConfig): LearnedRow {
  const lang = t.lang;
  const found = learned.car_models?.[car.id];
  const odometer = Boolean(car.need.odometer_entity || car.sources.some((s) => s.entities.odometer));
  const values: string[] = [];
  if (found?.consumption != null) {
    values.push(t("learn.car.consumption", { value: fixed(lang, found.consumption, 1) }));
    if (found.cold) {
      values.push(t("learn.car.cold", { value: fixed(lang, found.cold, 2) }));
    }
  }
  if (found?.workday_km != null || found?.day_off_km != null) {
    values.push(
      t("learn.car.km", {
        workday: found.workday_km == null ? "–" : fixed(lang, found.workday_km, 0),
        day_off: found.day_off_km == null ? "–" : fixed(lang, found.day_off_km, 0),
      }),
    );
  }
  return {
    name: car.name,
    values: values.length ? values : [t("learn.still")],
    note: values.length ? undefined : t(odometer ? "learn.car.learning" : "learn.car.no_odometer"),
  };
}

/** "17:30" from minutes after midnight. */
export function clock(minute: number): string {
  return `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(Math.round(minute) % 60).padStart(2, "0")}`;
}

/** A person: hours at home per kind of day and the usual homecoming today (state.climate.usual). */
export function presenceLearned(t: Translate, learned: Learned, person: PersonConfig, usual?: number): LearnedRow {
  const presence = learned.presence?.[person.id] ?? {};
  const labels = DAY_LABELS.filter((label) => presence[label]);
  const values: string[] = labels.map((label) =>
    t("learn.presence.value", { label: t(`label.${label}`), hours: fixed(t.lang, presence[label]!.hours, 0) }),
  );
  if (usual != null) {
    values.push(t("past.learned.presence.usual", { time: clock(usual) }));
  }
  let note: string | undefined;
  if (!person.person_entity) {
    note = t("learn.presence.no_person");
  } else if (!person.calendars.length) {
    note = t("past.learned.presence.no_calendar");
  }
  return { name: person.name, values: values.length ? values : [t("learn.still")], note };
}

/** How fast a room warms up (or cools down) once Joe puts it back: a sentence. */
export function climateRate(t: Translate, rate: number | null | undefined): string {
  return rate ? t("climate.rate", { rate: formatNumber(t.lang, rate, 1) }) : t("climate.rate_default");
}

/** Fetch the learning again when this changes: a new evaluation, something learned, a changed buffer. */
export function learningMarker(state: JoeState | undefined): string {
  const config = state?.config;
  const results = state?.results;
  return [
    results?.days ?? 0,
    results?.since ?? "",
    config?.learned?.updated ?? "",
    config?.learned?.since ?? "",
    config?.rules.buffer_factor ?? "",
    config?.provenance["rules.buffer_factor"]?.source ?? "",
    state?.observe?.day_count ?? 0,
  ].join("|");
}

/** Day ticks for a chart of days: about one label per week. */
export function dayTicks(lang: string, dates: string[]): Map<number, string> {
  const every = Math.max(1, Math.ceil(dates.length / 7));
  const ticks = new Map<number, string>();
  dates.forEach((date, i) => {
    if ((dates.length - 1 - i) % every === 0) {
      ticks.set(i, dayText(lang, date, "short"));
    }
  });
  return ticks;
}
