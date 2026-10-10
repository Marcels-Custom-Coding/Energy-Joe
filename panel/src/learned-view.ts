import { css, html, nothing, type TemplateResult } from "lit";
import { dayText, fixed } from "./components/look-back";
import { formatNumber } from "./entities";
import type { Translate } from "./i18n";
import {
  DAY_LABELS,
  type ActionConfig,
  type BatteryConfig,
  type ConsumerConfig,
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

/** What a battery really holds and gives back. */
export function batteryLearned(t: Translate, config: JoeConfig, learned: Learned, battery: BatteryConfig, need: number): LearnedRow {
  const lang = t.lang;
  const found = learned.battery_models?.[battery.id];
  const nominal = battery.capacity_kwh;
  const own = config.provenance[`batteries[${battery.id}].capacity_kwh`]?.source === "user";
  let note: string;
  if (!found) {
    note = battery.power ? t("learn.battery.learning", { need }) : t("learn.battery.no_power");
  } else if (own && nominal) {
    note = t("learn.battery.user", { value: fixed(lang, nominal, 1) });
  } else if (nominal && (found.capacity_kwh / nominal < 0.5 || found.capacity_kwh / nominal > 1.15)) {
    note = t("learn.battery.odd", { value: fixed(lang, nominal, 1) });
  } else {
    note = nominal ? t("learn.battery.uses_nominal", { value: fixed(lang, nominal, 1) }) : t("learn.battery.uses");
  }
  return {
    name: battery.name,
    values: found
      ? [
          t("learn.battery.capacity", { value: fixed(lang, found.capacity_kwh, 1) }),
          t("learn.battery.efficiency", { value: formatNumber(lang, found.efficiency * 100, 0) }),
          ...(found.converter ? [t("learn.battery.converter", { value: formatNumber(lang, found.converter.factor * 100, 0) })] : []),
        ]
      : [t("learn.still")],
    note,
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
export function carLearned(t: Translate, learned: Learned, action: ActionConfig): LearnedRow {
  const lang = t.lang;
  const found = learned.car_models?.[action.id];
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
    name: action.name,
    values: values.length ? values : [t("learn.still")],
    note: values.length ? undefined : t(action.need?.odometer_entity ? "learn.car.learning" : "learn.car.no_odometer"),
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
