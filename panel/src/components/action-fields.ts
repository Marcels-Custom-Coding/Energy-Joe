import { css, html, nothing, type TemplateResult } from "lit";
import "./car-calendars";
import { tip } from "./tip";
import { pickEntity, suggestions } from "../config";
import { entityName, formatState, type FilterName } from "../entities";
import { hotWaterSuggestions } from "../hot-water";
import type { TipName, Translate } from "../i18n";
import { PANEL, href, onLink, type Route } from "../router";
import type {
  ActionCondition,
  ActionConfig,
  CarAccountStatus,
  CarFinding,
  CarMailboxStatus,
  CarNeedConfig,
  ConditionOp,
  Discovery,
  HomeAssistant,
  JoeConfig,
} from "../types";

// The fields of a night action, shared by the "Steuern" block of the device
// pages (components/action-steer.ts) and the assistant / first setup
// (editors/action-editor.ts). Every renderer works on a host that holds the
// draft; nothing here saves.

export type ActionTemplate = "ev" | "hot_water" | "custom";

/** Which fields a form shows: a car, hot water, a device at night, or only a car's appointments. */
export type ActionLayout = "car" | "hot_water" | "night" | "calendars";

const OPS: ConditionOp[] = ["eq", "ne", "lt", "le", "gt", "ge"];

/** Charging by need, switched off (see custom_components/energy_joe/model.py EV_NEED). */
export const DEFAULT_NEED: CarNeedConfig = {
  enabled: false,
  soc_entity: null,
  range_entity: null,
  capacity_kwh: null,
  capacity_entity: null,
  odometer_entity: null,
  consumption_entity: null,
  reserve_km: 50,
  consumption: null,
  daily_km: null,
  persons: null,
  round_trip: true,
  calendars: [],
  source: "ha",
  allowed: [],
};

// The same limits as EV_NEED in model.py (a battery size above 0).
const NEED_LIMITS = { reserve_km: [0, 1000], consumption: [5, 60], daily_km: [0, 2000], capacity_kwh: [0.1, 300] } as const;

type NeedEntity = "soc_entity" | "range_entity" | "capacity_entity" | "odometer_entity" | "consumption_entity";
// Which entities fit each car field, and which role of a found car fills it.
const NEED_ENTITIES: Record<NeedEntity, { filter: FilterName; role: "soc" | "range" | "capacity" | "odometer" | "consumption"; tip: TipName }> = {
  soc_entity: { filter: "soc", role: "soc", tip: "a_need_soc" },
  range_entity: { filter: "distance", role: "range", tip: "a_need_range" },
  capacity_entity: { filter: "car_energy", role: "capacity", tip: "a_need_capacity" },
  odometer_entity: { filter: "distance", role: "odometer", tip: "a_need_odometer" },
  consumption_entity: { filter: "consumption", role: "consumption", tip: "a_need_consumption" },
};

/** A fresh night action from a template. */
export function newAction(template: ActionTemplate, t: Translate): ActionConfig {
  const base: ActionConfig = {
    id: `${template}_${Date.now().toString(36)}`,
    name: t(`action.template.${template}`),
    kind: "switch",
    enabled: true,
    entity_id: "",
    on_value: "on",
    reset: "previous",
    reset_value: null,
    lead_min: 0,
    auto: true,
    forecast_below_kwh: null,
    conditions: [],
    power_kw: null,
    power_entity: null,
    consumer_id: null,
    priority: 3,
    sensor_entity: null,
    comfort: 45,
    maximum: 62,
    buffer: 3,
  };
  if (template === "ev") {
    return { ...base, on_value: "now", lead_min: 3, forecast_below_kwh: 15, power_kw: 11, priority: 1 };
  }
  if (template === "hot_water") {
    // Back as it was: a switch that is normally on (highest set point) stays on.
    return { ...base, kind: "target", forecast_below_kwh: 20, power_kw: 0.5, priority: 2 };
  }
  return base;
}

/** What a found wallbox fills in: its mode, "plugged in" as a condition, its power. */
export function fromWallbox(w: Discovery["wallboxes"][number]): Partial<ActionConfig> {
  const conditions: ActionCondition[] = w.entities?.connected ? [{ entity_id: w.entities.connected, op: "eq", value: true }] : [];
  return {
    name: w.name,
    entity_id: w.mode_entity ?? "",
    conditions,
    power_entity: w.entities?.power ?? null,
  };
}

/** The fields of charging by need a found car fills in (only where nothing is chosen yet). */
export function fromCar(car: CarFinding, need: CarNeedConfig): Partial<CarNeedConfig> {
  const fill: Partial<CarNeedConfig> = {};
  for (const [key, info] of Object.entries(NEED_ENTITIES) as [NeedEntity, (typeof NEED_ENTITIES)[NeedEntity]][]) {
    const entity = car.entities[info.role];
    if (!need[key] && entity) {
      fill[key] = entity;
    }
  }
  return fill;
}

/** The layout of an action's form, by where the action lives. */
export function layoutOf(template: ActionTemplate | "car" | "hot_water" | "other"): ActionLayout {
  return template === "ev" || template === "car" ? "car" : template === "hot_water" ? "hot_water" : "night";
}

/** What is missing before the draft can be saved (empty: nothing). */
export function actionProblem(t: Translate, draft: ActionConfig, layout: ActionLayout): string {
  if (layout === "calendars") {
    return "";
  }
  if (!draft.entity_id) {
    return t("action.problem.entity");
  }
  if (draft.kind === "target" && !draft.sensor_entity) {
    return t("action.problem.sensor");
  }
  return "";
}

/** The element holding a draft (the steer block or the editor). */
export interface ActionFieldsHost extends HTMLElement {
  t?: Translate;
  hass?: HomeAssistant;
  config?: JoeConfig;
  discovery?: Discovery;
  /** Each car's mailbox without a calendar (last look, invitations). */
  mailboxes?: Record<string, CarMailboxStatus>;
  /** Each car's mailbox with a calendar (sign-in and last read). */
  accounts?: Record<string, CarAccountStatus>;
  apps?: { microsoft: boolean; google: boolean };
  /** The draft as it is now. */
  readonly draft?: ActionConfig;
  /** The action as saved (undefined for a new one). */
  readonly existing?: ActionConfig;
  setDraft(change: Partial<ActionConfig>): void;
}

// --- Small building blocks ---

export function field(t: Translate, label: string, tipName: TipName, control: TemplateResult): TemplateResult {
  return html`<div class="field" data-tipped>
    <div class="field-label">${label} ${tip(t, tipName)}</div>
    ${control}
  </div>`;
}

function entityBox(h: ActionFieldsHost, entityId: string, pick: () => void): TemplateResult {
  const t = h.t!;
  const hass = h.hass!;
  return html`<div class="entity">
    <span>
      ${entityId
        ? html`<b>${entityName(hass, entityId)}</b><small>${formatState(hass, entityId, t.lang)}</small>`
        : html`<small>${t("find.none")}</small>`}
    </span>
    <button type="button" class="mini-btn" @click=${pick}>
      <ha-icon icon="mdi:magnify"></ha-icon>${t(entityId ? "review.change" : "review.choose")}
    </button>
  </div>`;
}

function parse(raw: string): string | number | boolean {
  const text = raw.trim();
  if (text === "on" || text === "an") return true;
  if (text === "off" || text === "aus") return false;
  const number = Number(text.replace(",", "."));
  return text !== "" && Number.isFinite(number) ? number : text;
}

function int(ev: Event, low: number, high: number): number {
  const value = Math.round(Number.parseFloat((ev.target as HTMLInputElement).value));
  return Math.min(high, Math.max(low, Number.isFinite(value) ? value : low));
}

/** A value fitting the entity: its options, on/off, or a number. */
function valueInput(h: ActionFieldsHost, entityId: string, value: unknown, change: (value: string | number | boolean) => void): TemplateResult {
  const t = h.t!;
  const domain = entityId.split(".", 1)[0];
  const options = (h.hass?.states[entityId]?.attributes.options as string[] | undefined) ?? [];
  if (["select", "input_select"].includes(domain) && options.length) {
    return html`<select class="input" aria-label=${t("action.f.value")} @change=${(ev: Event) => change((ev.target as HTMLSelectElement).value)}>
      ${options.map((option) => html`<option value=${option} ?selected=${value === option}>${option}</option>`)}
    </select>`;
  }
  if (["switch", "input_boolean", "light", "fan"].includes(domain)) {
    const on = value === true || value === "on";
    return html`<div class="seg" role="group" aria-label=${t("action.f.value")}>
      <button type="button" aria-pressed=${String(on)} @click=${() => change("on")}>${t("action.value.on")}</button>
      <button type="button" aria-pressed=${String(!on)} @click=${() => change("off")}>${t("action.value.off")}</button>
    </div>`;
  }
  return html`<input
    class="input"
    type="text"
    aria-label=${t("action.f.value")}
    .value=${value == null ? "" : String(value)}
    @change=${(ev: Event) => change(parse((ev.target as HTMLInputElement).value))}
  />`;
}

function switchButton(label: string, on: boolean, toggle: () => void): TemplateResult {
  return html`<button type="button" class="switch" role="switch" aria-checked=${String(on)} aria-label=${label} @click=${toggle}></button>`;
}

/** An address inside the panel as a plain link (Haushalt for people and the routing service). */
function jump(prefix: string | null, to: Route, label: string, aria?: string): TemplateResult {
  return html`<a class="mini-btn quiet go-link" href=${href(prefix || PANEL, to)} aria-label=${aria ?? label} @click=${onLink(to)}
    >${label}</a
  >`;
}

// --- Fields ---

export function nameField(h: ActionFieldsHost): TemplateResult {
  const t = h.t!;
  const draft = h.draft!;
  return field(
    t,
    t("action.f.name"),
    "a_name",
    html`<input
      class="input"
      type="text"
      maxlength="60"
      .value=${draft.name}
      @change=${(ev: Event) => h.setDraft({ name: (ev.target as HTMLInputElement).value.trim() || draft.name })}
    />`,
  );
}

export function kindField(h: ActionFieldsHost): TemplateResult {
  const t = h.t!;
  const draft = h.draft!;
  return field(
    t,
    t("action.f.kind"),
    "a_kind",
    html`<div class="seg" role="group" aria-label=${t("action.f.kind")}>
      ${(["switch", "target"] as const).map(
        (kind) =>
          html`<button type="button" aria-pressed=${String(draft.kind === kind)} @click=${() => h.setDraft({ kind })}>
            ${t(`action.kind.${kind}`)}
          </button>`,
      )}
    </div>`,
  );
}

/** What Joe switches, the value, how he puts it back and how much earlier. */
export function switchFields(h: ActionFieldsHost): TemplateResult {
  const t = h.t!;
  const draft = h.draft!;
  return html`${field(t, t("action.f.entity"), "a_entity", entityBox(h, draft.entity_id, () => pickTarget(h)))}
    ${draft.entity_id
      ? field(
          t,
          t("action.f.on_value"),
          "a_on_value",
          valueInput(h, draft.entity_id, draft.on_value, (value) => h.setDraft({ on_value: value })),
        )
      : nothing}
    ${field(
      t,
      t("action.f.reset"),
      "a_reset",
      html`<div class="row">
        <div class="seg" role="group" aria-label=${t("action.f.reset")}>
          ${(["previous", "fixed"] as const).map(
            (reset) =>
              html`<button type="button" aria-pressed=${String(draft.reset === reset)} @click=${() => h.setDraft({ reset })}>
                ${t(`action.reset.${reset}`)}
              </button>`,
          )}
        </div>
        ${draft.reset === "fixed" && draft.entity_id
          ? valueInput(h, draft.entity_id, draft.reset_value ?? "", (value) => h.setDraft({ reset_value: value }))
          : nothing}
      </div>`,
    )}
    ${field(
      t,
      t("action.f.lead"),
      "a_lead",
      html`<span class="unit-input">
        <input
          class="input"
          type="number"
          min="0"
          max="120"
          step="1"
          .value=${String(draft.lead_min)}
          @change=${(ev: Event) => h.setDraft({ lead_min: int(ev, 0, 120) })}
        />
        <span class="unit">min</span>
      </span>`,
    )}`;
}

/** Hot water to a target: the sensor and the temperatures. */
export function targetFields(h: ActionFieldsHost): TemplateResult {
  const t = h.t!;
  const draft = h.draft!;
  const number = (key: "comfort" | "maximum" | "buffer", unit: string) => html`<label>
    ${t(`action.f.${key}`)}
    <span class="unit-input">
      <input
        class="input"
        type="number"
        min="0"
        max="100"
        step="0.5"
        .value=${String(draft[key])}
        @change=${(ev: Event) => {
          const value = Number.parseFloat((ev.target as HTMLInputElement).value);
          if (Number.isFinite(value)) h.setDraft({ [key]: value });
        }}
      />
      <span class="unit">${unit}</span>
    </span>
  </label>`;
  return html`${field(t, t("action.f.sensor"), "a_sensor", entityBox(h, draft.sensor_entity ?? "", () => pickSensor(h)))}
    ${field(
      t,
      t("action.f.temps"),
      "a_temps",
      html`<div class="temps">${number("comfort", "°C")} ${number("maximum", "°C")} ${number("buffer", "K")}</div>`,
    )}`;
}

/** "Automatisch, wenn morgen weniger Sonne kommt als …" and, when on, the conditions. */
export function autoFields(h: ActionFieldsHost): TemplateResult {
  const t = h.t!;
  const draft = h.draft!;
  return html`${field(
      t,
      t("action.f.auto"),
      "a_auto",
      html`<div class="row">
        ${switchButton(t("action.f.auto"), draft.auto, () => h.setDraft({ auto: !draft.auto }))}
        <span>${t("action.f.below")}</span>
        <span class="unit-input">
          <input
            class="input"
            type="number"
            min="0"
            max="1000"
            step="1"
            ?disabled=${!draft.auto}
            placeholder=${t("action.f.every_night")}
            .value=${draft.forecast_below_kwh == null ? "" : String(draft.forecast_below_kwh)}
            @change=${(ev: Event) => {
              const value = Number.parseFloat((ev.target as HTMLInputElement).value);
              h.setDraft({ forecast_below_kwh: Number.isFinite(value) && value > 0 ? value : null });
            }}
          />
          <span class="unit">kWh</span>
        </span>
      </div>`,
    )}
    ${draft.auto ? conditionsField(h) : nothing}`;
}

function conditionsField(h: ActionFieldsHost): TemplateResult {
  const t = h.t!;
  const hass = h.hass!;
  const draft = h.draft!;
  const setCondition = (index: number, change: Partial<ActionCondition>) =>
    h.setDraft({ conditions: (h.draft?.conditions ?? []).map((c, i) => (i === index ? { ...c, ...change } : c)) });
  return field(
    t,
    t("action.f.conditions"),
    "a_conditions",
    html`${draft.conditions.map(
        (condition, index) => html`<div class="condition">
          <span><b>${entityName(hass, condition.entity_id)}</b></span>
          <select
            class="input"
            aria-label=${t("action.f.op")}
            @change=${(ev: Event) => setCondition(index, { op: (ev.target as HTMLSelectElement).value as ConditionOp })}
          >
            ${OPS.map((op) => html`<option value=${op} ?selected=${condition.op === op}>${t(`action.op.${op}`)}</option>`)}
          </select>
          <input
            class="input"
            type="text"
            aria-label=${t("action.f.value")}
            .value=${String(condition.value === true ? "on" : condition.value === false ? "off" : condition.value)}
            @change=${(ev: Event) => setCondition(index, { value: parse((ev.target as HTMLInputElement).value) })}
          />
          <button
            type="button"
            class="icon-btn"
            aria-label=${t("f.remove")}
            title=${t("f.remove")}
            @click=${() => h.setDraft({ conditions: (h.draft?.conditions ?? []).filter((_, i) => i !== index) })}
          >
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>`,
      )}
      <button type="button" class="mini-btn" @click=${() => addCondition(h)}>
        <ha-icon icon="mdi:plus"></ha-icon>${t("action.f.condition.add")}
      </button>`,
  );
}

/** Power, the meter it belongs to and the order at the grid limit. */
export function powerFields(h: ActionFieldsHost): TemplateResult {
  const t = h.t!;
  const draft = h.draft!;
  const consumers = h.config?.consumers ?? [];
  return html`${field(
      t,
      t("action.f.power"),
      "a_power",
      html`<span class="unit-input">
        <input
          class="input"
          type="number"
          inputmode="decimal"
          min="0"
          max="100"
          step="0.1"
          placeholder=${t("f.unknown")}
          .value=${draft.power_kw == null ? "" : String(draft.power_kw)}
          @change=${(ev: Event) => {
            const value = Number.parseFloat((ev.target as HTMLInputElement).value);
            h.setDraft({ power_kw: Number.isFinite(value) && value > 0 ? value : null });
          }}
        />
        <span class="unit">kW</span>
      </span>`,
    )}
    ${consumers.length
      ? field(
          t,
          t("action.f.consumer"),
          "a_consumer",
          html`<select class="input" @change=${(ev: Event) => h.setDraft({ consumer_id: (ev.target as HTMLSelectElement).value || null })}>
            <option value="" ?selected=${!draft.consumer_id}>${t("action.f.consumer.none")}</option>
            ${consumers.map((c) => html`<option value=${c.id} ?selected=${draft.consumer_id === c.id}>${c.name}</option>`)}
          </select>`,
        )
      : nothing}
    ${field(
      t,
      t("action.f.priority"),
      "a_priority",
      html`<span class="unit-input">
        <input
          class="input"
          type="number"
          min="1"
          max="9"
          step="1"
          .value=${String(draft.priority)}
          @change=${(ev: Event) => h.setDraft({ priority: int(ev, 1, 9) })}
        />
      </span>`,
    )}`;
}

export function enabledField(h: ActionFieldsHost): TemplateResult {
  const t = h.t!;
  const draft = h.draft!;
  return field(t, t("action.f.enabled"), "a_enabled", switchButton(t("action.f.enabled"), draft.enabled, () => h.setDraft({ enabled: !draft.enabled })));
}

// --- Charging by need ---

export function setNeed(h: ActionFieldsHost, change: Partial<CarNeedConfig>): void {
  h.setDraft({ need: { ...(h.draft?.need ?? DEFAULT_NEED), ...change } });
}

/** Switching it on fills in the car Joe found, where nothing is chosen yet. */
export function toggleNeed(h: ActionFieldsHost): void {
  const need = h.draft?.need ?? DEFAULT_NEED;
  if (need.enabled) {
    setNeed(h, { enabled: false });
    return;
  }
  const cars = h.discovery?.cars ?? [];
  // The one car found belongs to this action only if there is one charge point.
  const wallboxes = (h.discovery?.wallboxes ?? []).filter((w) => w.is_car);
  const car = cars.length === 1 && wallboxes.length <= 1 ? cars[0].entities : {};
  const fill: Partial<CarNeedConfig> = { enabled: true };
  for (const [key, info] of Object.entries(NEED_ENTITIES) as [NeedEntity, (typeof NEED_ENTITIES)[NeedEntity]][]) {
    if (!need[key] && car[info.role]) {
      fill[key] = car[info.role] ?? null;
    }
  }
  setNeed(h, fill);
}

/** The switch "Laden nach Bedarf" and, when on, what Joe knows about the car. */
export function needFields(h: ActionFieldsHost): TemplateResult {
  const t = h.t!;
  const need = h.draft?.need ?? DEFAULT_NEED;
  const number = (key: "reserve_km" | "consumption" | "daily_km" | "capacity_kwh", unit: string, max: number, placeholder = "") => html`<span
    class="unit-input"
  >
    <input
      class="input"
      type="number"
      inputmode="decimal"
      min=${NEED_LIMITS[key][0]}
      max=${Math.min(max, NEED_LIMITS[key][1])}
      step=${key === "consumption" || key === "capacity_kwh" ? "0.1" : "1"}
      placeholder=${placeholder}
      .value=${need[key] == null ? "" : String(need[key])}
      @change=${(ev: Event) => {
        const input = ev.target as HTMLInputElement;
        const value = Number.parseFloat(input.value.replace(",", "."));
        const [low, high] = NEED_LIMITS[key];
        const ok = Number.isFinite(value) && value >= low && value <= high;
        const empty = key === "reserve_km" ? 50 : null;
        // Out of range counts as empty, so the action still saves.
        if (!ok) input.value = empty == null ? "" : String(empty);
        setNeed(h, { [key]: ok ? value : empty });
      }}
    />
    <span class="unit">${unit}</span>
  </span>`;
  const box = (key: NeedEntity) => entityBox(h, need[key] ?? "", () => pickNeed(h, key));
  return html`${field(
      t,
      t("action.need"),
      "a_need",
      html`<div class="row">
          ${switchButton(t("action.need"), need.enabled, () => toggleNeed(h))}
          <span>${t(need.enabled ? "action.need.on" : "action.need.off")}</span>
        </div>
        <p class="field-hint">${t("action.need.hint")}</p>`,
    )}
    ${need.enabled
      ? html`${field(t, t("action.need.soc"), "a_need_soc", box("soc_entity"))}
        ${field(t, t("action.need.range"), "a_need_range", box("range_entity"))}
        ${field(
          t,
          t("action.need.capacity"),
          "a_need_capacity",
          html`<div class="row">${number("capacity_kwh", "kWh", 300, t("action.need.from_sensor"))}</div>
            ${need.capacity_kwh == null ? box("capacity_entity") : nothing}`,
        )}
        ${field(t, t("action.need.reserve"), "a_need_reserve", number("reserve_km", "km", 1000))}
        ${field(
          t,
          t("action.need.consumption"),
          "a_need_consumption",
          html`${number("consumption", "kWh/100 km", 60, t("action.need.learned"))}
            ${need.consumption == null ? box("consumption_entity") : nothing}`,
        )}
        ${field(t, t("action.need.daily"), "a_need_daily", number("daily_km", "km", 2000, t("action.need.learned")))}
        ${field(t, t("action.need.odometer"), "a_need_odometer", box("odometer_entity"))}`
      : nothing}`;
}

/**
 * The car's appointments: whose calendars count (each person links to
 * Haushalt), the car's own calendars, there and back, and the routing hint.
 */
export function calendarFields(h: ActionFieldsHost): TemplateResult {
  const t = h.t!;
  const draft = h.draft!;
  const need = draft.need ?? DEFAULT_NEED;
  const persons = (h.config?.persons ?? []).filter((p) => p.calendars.length);
  const all = persons.map((p) => p.id);
  const togglePerson = (id: string) => {
    const now = h.draft?.need ?? DEFAULT_NEED;
    const chosen = now.persons ?? all;
    const next = chosen.includes(id) ? chosen.filter((p) => p !== id) : [...chosen, id];
    // Everyone chosen is kept as "everyone" (new calendars count too); [] is nobody.
    setNeed(h, { persons: all.every((p) => next.includes(p)) ? null : next });
  };
  return html`${field(
      t,
      t("action.need.persons"),
      "a_need_persons",
      persons.length
        ? html`<ul class="people" role="group" aria-label=${t("action.need.persons")}>
            ${persons.map((person) => {
              const on = need.persons == null || need.persons.includes(person.id);
              return html`<li>
                <button type="button" class="mini-btn ${on ? "go" : "quiet"}" aria-pressed=${String(on)} @click=${() => togglePerson(person.id)}>
                  <ha-icon icon=${on ? "mdi:check" : "mdi:minus"}></ha-icon>${person.name}
                </button>
                ${jump(
                  h.prefix,
                  { tab: "household", section: "people", id: person.id },
                  t("action.need.person_open"),
                  t("action.need.person_open_of", { name: person.name }),
                )}
              </li>`;
            })}
          </ul>`
        : html`<p class="field-hint">${t("action.need.no_calendars")}</p>
            ${jump(h.prefix, { tab: "household", section: "people" }, t("action.need.people_link"))}`,
    )}
    ${field(
      t,
      t("action.need.calendars"),
      "a_need_calendars",
      html`<joe-car-calendars
        .hass=${h.hass}
        .t=${t}
        actionId=${draft.id}
        .savedSource=${h.existing?.need?.enabled ? (h.existing.need.source ?? "ha") : null}
        .need=${need}
        .mailbox=${h.mailboxes?.[draft.id]}
        .account=${h.accounts?.[draft.id]}
        .apps=${h.apps}
        carName=${draft.name}
        @joe-need=${(ev: CustomEvent<Partial<CarNeedConfig>>) => setNeed(h, ev.detail)}
      ></joe-car-calendars>`,
    )}
    ${field(
      t,
      t("action.need.round_trip"),
      "a_need_round_trip",
      switchButton(t("action.need.round_trip"), need.round_trip, () => setNeed(h, { round_trip: !(h.draft?.need ?? DEFAULT_NEED).round_trip })),
    )}
    ${h.config?.routing.service
      ? nothing
      : html`<div class="note">
          <ha-icon icon="mdi:map-marker-distance"></ha-icon>
          <span>${t("action.need.no_routing")} ${jump(h.prefix, { tab: "household", section: "travel" }, t("action.need.routing_link"))}</span>
        </div>`}`;
}

// --- Whole forms ---

/**
 * The fields of one layout, in a fixed order. `calendars` puts the car's
 * appointments into the car form (the assistant has no separate block).
 */
export function actionFields(h: ActionFieldsHost, layout: ActionLayout, opts: { calendars?: boolean } = {}): TemplateResult {
  const t = h.t!;
  const draft = h.draft!;
  if (layout === "calendars") {
    return calendarFields(h);
  }
  if (layout === "car") {
    return html`${needFields(h)} ${opts.calendars && draft.need?.enabled ? calendarFields(h) : nothing}
      <h4 class="fields-head">${t("devices.car.wallbox")}</h4>
      ${switchFields(h)} ${autoFields(h)} ${powerFields(h)} ${nameField(h)} ${enabledField(h)}`;
  }
  if (layout === "hot_water") {
    return html`${kindField(h)} ${switchFields(h)} ${draft.kind === "target" ? targetFields(h) : nothing} ${autoFields(h)}
    ${powerFields(h)} ${nameField(h)} ${enabledField(h)}`;
  }
  return html`${switchFields(h)} ${draft.kind === "target" ? targetFields(h) : nothing} ${autoFields(h)} ${powerFields(h)}
  ${nameField(h)} ${enabledField(h)}`;
}

// --- Pickers ---

/** Hot water: Joe's guesses for the switch and the tank's temperature. */
function hotWater(h: ActionFieldsHost): ReturnType<typeof hotWaterSuggestions> | undefined {
  if (h.draft?.kind !== "target" || !h.hass) {
    return undefined;
  }
  const consumer = h.config?.consumers.find((c) => c.id === h.draft?.consumer_id);
  return hotWaterSuggestions(h.hass, consumer?.name);
}

async function pickTarget(h: ActionFieldsHost): Promise<void> {
  const t = h.t!;
  const picked = await pickEntity(h, {
    heading: t("action.pick.entity"),
    tip: "a_entity",
    filter: "writable",
    selected: h.draft?.entity_id ? [h.draft.entity_id] : [],
    suggestions: hotWater(h)?.switches,
  });
  const entityId = picked?.selected[0];
  if (entityId) {
    const options = (h.hass?.states[entityId]?.attributes.options as string[] | undefined) ?? [];
    const on = h.draft?.on_value;
    h.setDraft({
      entity_id: entityId,
      on_value: options.length && !options.includes(String(on)) ? (options.includes("now") ? "now" : options[0]) : (on ?? "on"),
    });
  }
}

async function pickSensor(h: ActionFieldsHost): Promise<void> {
  const t = h.t!;
  const picked = await pickEntity(h, {
    heading: t("action.pick.sensor"),
    tip: "a_sensor",
    filter: "temperature",
    selected: h.draft?.sensor_entity ? [h.draft.sensor_entity] : [],
    suggestions: hotWater(h)?.sensors,
  });
  if (picked?.selected[0]) {
    h.setDraft({ sensor_entity: picked.selected[0] });
  }
}

async function pickNeed(h: ActionFieldsHost, key: NeedEntity): Promise<void> {
  const t = h.t!;
  const info = NEED_ENTITIES[key];
  const found = (h.discovery?.cars ?? [])
    .map((car) => ({ entity_id: car.entities[info.role] ?? "", confidence: car.confidence, reasons: car.reasons }))
    .filter((s) => s.entity_id);
  const picked = await pickEntity(h, {
    heading: t(`action.need.pick.${info.role}`),
    tip: info.tip,
    filter: info.filter,
    selected: h.draft?.need?.[key] ? [h.draft.need[key] as string] : [],
    suggestions: suggestions(found),
  });
  if (picked) {
    setNeed(h, { [key]: picked.selected[0] ?? null });
  }
}

async function addCondition(h: ActionFieldsHost): Promise<void> {
  const t = h.t!;
  const picked = await pickEntity(h, {
    heading: t("action.pick.condition"),
    tip: "a_conditions",
    filter: "any",
    selected: [],
  });
  const entityId = picked?.selected[0];
  if (entityId && h.draft) {
    const state = h.hass?.states[entityId]?.state;
    const value: string | number | boolean = state === "on" || state === "off" ? state === "on" : (state ?? "");
    h.setDraft({ conditions: [...h.draft.conditions, { entity_id: entityId, op: "eq", value }] });
  }
}

/** Styles of the fields; add to the host's static styles after `shared`. */
export const actionFieldStyles = css`
  .entity {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    padding: 8px 12px;
    border-radius: 10px;
    background: var(--joe-surface-2);
  }
  .entity span {
    flex: 1;
    min-width: 0;
  }
  .entity b {
    font-weight: 600;
    overflow-wrap: anywhere;
  }
  .entity small {
    display: block;
    color: var(--joe-muted);
  }
  .row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
  .condition {
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) auto minmax(0, 0.8fr) auto;
    gap: 6px;
    align-items: center;
    padding: 6px 8px;
    border-radius: 10px;
    background: var(--joe-surface-2);
    margin-bottom: 6px;
  }
  .condition b {
    font-weight: 600;
    overflow-wrap: anywhere;
  }
  .temps {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
  }
  .temps label {
    display: grid;
    gap: 4px;
    font-size: 13.5px;
    font-weight: 600;
    color: var(--joe-ink-2);
  }
  .temps .unit-input {
    max-width: none;
  }
  .icon-btn {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border: 0;
    border-radius: 9px;
    cursor: pointer;
    background: transparent;
    color: var(--joe-ink-2);
  }
  .icon-btn:hover {
    background: var(--joe-surface);
  }
  .people {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 6px;
  }
  .people li {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px 10px;
  }
  a.go-link {
    text-decoration: none;
  }
  .note a.go-link {
    margin-top: 6px;
  }
  .fields-head {
    margin: 22px 0 0;
    padding-top: 14px;
    border-top: 1px solid var(--joe-line);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--joe-muted);
  }
  @media (pointer: coarse) {
    .icon-btn,
    a.go-link,
    .seg button {
      min-width: 44px;
      min-height: 44px;
    }
  }
  @media (max-width: 520px) {
    .temps {
      grid-template-columns: 1fr;
    }
    .condition {
      grid-template-columns: 1fr auto;
    }
  }
`;
