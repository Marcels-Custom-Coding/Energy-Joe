// --- Home Assistant (the parts of the frontend object the panel uses) ---

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: {
    friendly_name?: string;
    unit_of_measurement?: string;
    device_class?: string;
    [key: string]: unknown;
  };
  last_changed?: string;
  last_updated?: string;
}

export interface HassEntityEntry {
  entity_id: string;
  name?: string | null;
  device_id?: string | null;
  area_id?: string | null;
  platform?: string;
  hidden?: boolean;
  entity_category?: string | null;
}

export interface HassDevice {
  id: string;
  name?: string | null;
  name_by_user?: string | null;
  area_id?: string | null;
  manufacturer?: string | null;
  model?: string | null;
}

export interface HassArea {
  area_id: string;
  name: string;
}

export interface HomeAssistant {
  callWS<T>(msg: { type: string; [key: string]: unknown }): Promise<T>;
  callApi?<T>(method: "GET" | "POST" | "DELETE", path: string, data?: Record<string, unknown>): Promise<T>;
  callService?(domain: string, service: string, data?: Record<string, unknown>): Promise<unknown>;
  connection: {
    subscribeMessage<T>(
      callback: (msg: T) => void,
      msg: { type: string; [key: string]: unknown },
    ): Promise<() => Promise<void>>;
  };
  language: string;
  /** "docked", "auto" or "always_hidden" – the user's sidebar setting. */
  dockedSidebar?: string;
  themes?: { darkMode?: boolean };
  states: Record<string, HassEntity>;
  entities?: Record<string, HassEntityEntry>;
  devices?: Record<string, HassDevice>;
  areas?: Record<string, HassArea>;
  config?: { currency?: string; time_zone?: string };
  services?: Record<string, Record<string, unknown>>;
  formatEntityState?: (stateObj: HassEntity, state?: string) => string;
}

export interface PanelRoute {
  prefix: string;
  path: string;
}

// --- Joe's state and configuration (see custom_components/energy_joe/model.py) ---

export type JoeMode = "simulation" | "advisory" | "live" | "off";
export type OnboardingStep = "welcome" | "scan" | "questions" | "done";
export const ONBOARDING_STEPS: OnboardingStep[] = ["welcome", "scan", "questions", "done"];

export type Source = "read" | "learned" | "default" | "user";

export interface Provenance {
  source: Source;
  updated?: string;
  detail?: string;
}

/** A power reading; Joe's convention: grid + import, battery + charging. */
export interface Measurement {
  entity_id: string;
  invert: boolean;
  minus_entity_id: string | null;
  /** Solar only: the inverter is off without sun (unavailable at night is normal, counts as 0 W). */
  sleeps?: boolean;
}

/** A profile of a known integration (e.g. "fronius"), "generic" (assigned levers), "steps" or "none". */
export type Adapter = string;

/** The common levers Joe steers batteries with (see control/profiles.py). */
export type ControlRole =
  | "min_soc"
  | "charge_target"
  | "grid_charge"
  | "mode"
  | "charge_power"
  | "discharge_power"
  | "discharge_limit"
  | "discharge_limit_enabled"
  | "charge_limit"
  | "charge_limit_enabled"
  /** On the integration's system device, only for the daytime cap (Omnibattery's power limits). */
  | "system_charge_limit"
  | "system_charge_limit_enabled"
  /** On the system device too: blocks discharging by day (several batteries one after the other). */
  | "system_discharge_limit"
  /** The watchdog (control/guard.py): the system's manual mode, a pulse restarts Omnibattery's own control. */
  | "system_manual_mode"
  /** The watchdog: a battery's switches that allow charging and discharging at all (Venus). */
  | "allow_charge"
  | "allow_discharge";
export const CONTROL_ROLES: ControlRole[] = [
  "min_soc",
  "grid_charge",
  "charge_target",
  "mode",
  "charge_power",
  "discharge_power",
  "discharge_limit",
  "discharge_limit_enabled",
];
export type ModeMeaning = "normal" | "force_charge" | "hold" | "force_discharge";
export const MODE_MEANINGS: ModeMeaning[] = ["normal", "force_charge", "hold", "force_discharge"];

export interface ControlStep {
  entity_id?: string;
  value?: string | number | boolean | null;
  /** A service call instead of an entity value. */
  service?: string;
  data?: Record<string, unknown>;
}
export type StepName = "charge" | "hold" | "release";

export interface BatteryConfig {
  id: string;
  name: string;
  adapter: Adapter;
  soc_entity: string;
  power: Measurement | null;
  capacity_kwh: number | null;
  capacity_entity: string | null;
  max_charge_w: number | null;
  max_discharge_w: number | null;
  /** The level it never discharges below; null: as set on the device. */
  floor_soc?: number | null;
  device_id: string | null;
  controls: Partial<Record<ControlRole, string>>;
  mode_options: Partial<Record<ModeMeaning, string>>;
  /** Entities set before steering through the mode (e.g. "Remote Control"). */
  prepare: ControlStep[];
  steps: Partial<Record<StepName, ControlStep[]>>;
  priority: number;
  /** Takes part when Joe leaves daytime surplus to evcc (rules.day_surplus); default true. */
  day_surplus?: boolean;
  /** What 100 % of a charge limit in % stand for (W; Fronius); null: not known yet, Joe may learn it. */
  limit_ref_w?: number | null;
  /** Regulates itself to 0 W at the grid meter (Fronius, Omnibattery in automatic mode); null: as Joe proposes. */
  self_regulating?: boolean | null;
  /** Which system regulates it ("Wer regelt ihn?"): batteries with the same key take turns as one group; null: as Joe proposes. */
  control_group?: string | null;
  /** The level it really stops discharging at (learned or set); null: not known yet. */
  cutoff_soc?: number | null;
  /** Whether its charge limit holds while it charges from the grid (Fronius, learned); null: not seen yet. */
  night_cap?: "works" | "ignored" | null;
}

export type TariffKind = "fixed_window" | "dynamic" | "flat" | "unknown";

export interface TariffConfig {
  kind: TariffKind;
  price_entity: string | null;
  window: { start: string; end: string } | null;
  night_price: number | null;
  day_price: number | null;
  feed_in_price: number | null;
  feed_in_entity: string | null;
  /** Added to every dynamic price (grid fees, taxes), per kWh. */
  surcharge: number | null;
}

/** Another forecast for the same panels, learned and combined with the main one. */
export interface ForecastSource {
  id: string;
  name: string;
  provider: string | null;
  tomorrow: string[];
}

export interface ForecastConfig {
  provider: string | null;
  config_entries: string[];
  today: string[];
  tomorrow: string[];
  remaining_today: string[];
  alternatives: ForecastSource[];
  /** Whether Joe may combine the sources (off: only the main forecast). */
  combine: boolean;
}

export type DayLabel = "home_office" | "office" | "travel" | "vacation" | "guests" | "home";
export const DAY_LABELS: DayLabel[] = ["home_office", "office", "travel", "vacation", "guests", "home"];

/** Calendar events become a label per person and day. */
export interface CalendarConfig {
  rules: { keyword: string; label: DayLabel }[];
  default_workday: DayLabel;
  default_day_off: DayLabel;
}

export interface PersonConfig {
  id: string;
  name: string;
  person_entity: string | null;
  calendars: string[];
  /** Own calendar rules; null follows the ones for everyone. */
  calendar?: CalendarConfig | null;
}

export type ConsumerKind =
  | "climate"
  | "heat_pump"
  | "hot_water"
  | "electric_heating"
  | "ev"
  | "comfort"
  | "household"
  | "submeter"
  | "other";

export const CONSUMER_KINDS: ConsumerKind[] = [
  "climate",
  "heat_pump",
  "electric_heating",
  "hot_water",
  "ev",
  "comfort",
  "household",
  "submeter",
  "other",
];

export interface ConsumerConfig {
  id: string;
  name: string;
  kind: ConsumerKind;
  energy_entity: string | null;
  power_entity: string | null;
  included_in: string | null;
  source: "energy_dashboard" | "manual";
  /** When it runs: "auto" lets Joe decide (a wallbox never draws on the home battery). */
  runs?: ConsumerRuns;
}

export const CONSUMER_RUNS = ["auto", "always", "surplus", "cheap"] as const;
export type ConsumerRuns = (typeof CONSUMER_RUNS)[number];

/** Devices the home battery never has to cover (mirrors model.flexible_consumers). */
export function flexibleConsumers(consumers: ConsumerConfig[]): ConsumerConfig[] {
  const found = consumers.filter(
    (c) =>
      c.kind !== "submeter" &&
      ((c.kind === "ev" && (c.runs ?? "auto") !== "always") || c.runs === "surplus" || c.runs === "cheap"),
  );
  const inside = new Set(found.map((c) => c.energy_entity).filter(Boolean));
  return found.filter((c) => !c.included_in || !inside.has(c.included_in));
}

export type PriorityItem = "ev" | "hot_water" | "battery";
export type DischargeMode = "until_target" | "block" | "free";

export interface Rules {
  reserve_soc: number;
  max_target_soc: number;
  evening_min_soc: number | null;
  grid_limit_w: number | null;
  max_night_kwh: number | null;
  priority: PriorityItem[];
  discharge_in_window: DischargeMode;
  plan_offset_min: number;
  reset_lead_min: number;
  buffer_factor: number;
  ask_time: string;
  /** No grid charging above this price (per kWh). */
  max_price: number | null;
  /** A night that saves less than this is left alone. */
  min_saving: number;
  /** Pause charging while the house draws more than the grid limit. */
  guard_grid: boolean;
  /** Batteries take the midday sun, the car charges with the sun; saving first unless grid_first. */
  grid_friendly: boolean;
  grid_first: boolean;
  /** Expert: count the inverter's losses when charging from the grid (measured at the grid meter). */
  converter_losses: boolean;
  /** Charge full once every so many days (maintenance); null: off. */
  balance_days: number | null;
  /** Daytime surplus: cap the batteries' charging so evcc's PV mode gets the sun (control/executor.py). */
  day_surplus: boolean;
  /** How much of the forecast Joe counts on: 90 / 80 / 65 %. */
  day_caution: DayCaution;
  /** Several batteries that regulate themselves: one after the other, or left to themselves; null: not chosen (works as "sequence"). */
  battery_team?: BatteryTeamMode | null;
  /** Battery ids in the order they charge and discharge (the others follow). */
  team_charge_order?: string[];
  team_discharge_order?: string[];
  /** The watchdog: step in when batteries charge each other (older backends: missing, on). */
  transfer_guard?: boolean;
}

export type BatteryTeamMode = "sequence" | "together";

/** What several batteries do together now (executor._async_team). */
export interface BatteryTeam {
  /** on: Joe coordinates (or would, when dry); the others say why not. */
  state:
    | "off"
    | "on"
    | "together"
    | "single"
    | "one_group"
    | "night"
    | "paused"
    | "levers"
    | "not_tested"
    | "unknown"
    | "automation"
    | "no_grid"
    | "not_taken"
    | "taking_over"
    | "error";
  mode: BatteryTeamMode | null;
  /** Not chosen: "Nacheinander" all the same (older backends: missing). */
  default?: boolean;
  /** Not live: Joe only shows what he would do. */
  dry: boolean;
  /** The battery that may work now (the first of the active group). */
  active: string | null;
  /** The group that may work now and its batteries (older backends: missing). */
  active_group?: string | null;
  active_batteries?: string[];
  since?: string | null;
  flow: "surplus" | "deficit" | null;
  /** They charge side by side today (the sun would not fill them one after the other). */
  parallel: boolean;
  batteries: Record<
    string,
    {
      name: string;
      self_regulating: boolean;
      proposed: boolean;
      soc: number | null;
      power_w: number | null;
      cutoff: number | null;
      floor: number;
      charge: "free" | "blocked" | null;
      discharge: "free" | "blocked" | null;
      why: "active" | "parallel" | "waits_full" | "waits_empty" | "full" | "empty" | null;
      problem: string | null;
      empty?: boolean;
      full?: boolean;
      /** Its group (as set, else as proposed), the proposal and whether Joe is sure of it. */
      group?: string;
      group_proposed?: string;
      group_sure?: boolean;
    }
  >;
  /** The groups of the batteries that regulate themselves (one system each). */
  groups?: Record<string, { batteries: string[]; empty?: boolean; full?: boolean }>;
  /** Joe is not sure which system regulates a battery: he asks. */
  group_question?: boolean;
  /** state "automation": the owner's automations that do it so far. */
  automations: string[];
  /** What Joe would say without the owner's automations ("on": he could take over now). */
  free?: string | null;
  /** The owner's automations Joe switched on again (still running): he takes them over once he can. */
  lent?: string[];
  /** state "taking_over": when Joe switches them off again (if all stays well). */
  taking_over_at?: string | null;
  /** The last time Joe switched the owner's automations on again, why and which. */
  given_back?: {
    at: string;
    reason: string;
    names: string[];
    failed?: string[];
    /** Joe's blocks went back while a battery still worked: nothing blocks until the automations' condition starts anew. */
    unblocked?: boolean;
  } | null;
  /** Joe holds his blocks until the active group stops charging or discharging, then gives the automations back. */
  hold?: { since: string; direction: "charge" | "discharge"; batteries: string[]; reason: string; names: string[] } | null;
}

/** The watchdog ("Speicher-Wächter", control/guard.py): two batteries running against each other. */
export interface TransferGuard {
  /** on: watching; off: the rule is off; mode_off: Joe is off; single: fewer than two batteries with a power meter. */
  state: "on" | "off" | "mode_off" | "single";
  /** Not live: Joe only says what he would do. */
  dry: boolean;
  /** Running against each other right now (more than 20 W each). */
  running: boolean;
  /** The stage reached this time (0: none yet). */
  stage: number;
  /** Automations switched on that write the same levers: they do it so far. */
  automations: string[];
  /** The last time it happened. */
  last: {
    since: string | null;
    at: string;
    battery: string;
    charging: string[];
    discharging: string[];
    stage: number;
    /** "inside": batteries of one group (one system) charged each other – Joe does not step in. */
    result: "running" | "fixed" | "alarm" | "automation" | "joe" | "inside";
    /** "inside" that has stopped. */
    over?: boolean;
    dry: boolean;
    direction: "charge" | "discharge";
    seconds: number;
  } | null;
}

export type DayCaution = "tight" | "normal" | "careful";

/** Why a battery does (not) take part in the daytime surplus. */
export type SurplusBatteryState =
  | "takes_part"
  | "capped"
  | "would"
  | "left_out"
  | "not_tested"
  /** No charge limit Joe could set (e.g. Marstek via Omnibattery). */
  | "no_limit"
  /** A charge limit in A (or without a unit): no power Joe can trust. */
  | "unit"
  /** A charge limit in %: Joe needs to know what 100 % stand for (limit_ref_w). */
  | "need_ref"
  /** Joe is finding out right now what 100 % stand for (a test limit for a few minutes). */
  | "learning"
  /** An automation that is switched on writes the same limit. */
  | "automation"
  /** Its entities are not available right now. */
  | "unavailable"
  /** Charge level or capacity unknown. */
  | "unknown"
  /** Several batteries one after the other: its turn comes after the active one. */
  | "team_wait";

/** An evcc loadpoint as Joe reads it (control/evcc.py). */
export interface EvccLoadpoint {
  id: string;
  name: string;
  kind: "car" | "heating";
  mode: string;
  connected: boolean;
  boost: boolean;
  /** In a PV mode and able to take power (a car connected, or a heater). */
  wants: boolean;
}

/** What the daytime surplus does (or would do) now (executor._async_surplus). */
export interface DaySurplus {
  /** cap: capped (or would be, when dry); the others say why not. */
  state:
    | "off"
    | "cap"
    | "no_plan"
    | "night"
    | "released"
    | "morning"
    | "no_sun"
    | "after_pv"
    | "full"
    | "not_reachable"
    | "no_need"
    | "no_battery"
    | "no_loadpoint"
    | "soon";
  /** Not live: Joe only shows what he would do. */
  dry?: boolean;
  caution?: DayCaution;
  batteries?: Record<
    string,
    {
      name: string;
      state: SurplusBatteryState;
      soc: number | null;
      cap_kw: number | null;
      problem: string | null;
      /** state "automation": the automations that write the same limit. */
      automations?: string[];
    }
  >;
  loadpoints?: EvccLoadpoint[];
  evcc?: { priority_soc?: number | null; buffer_soc?: number | null; buffer_start_soc?: number | null };
  /** evcc's settings, and the batteries' own (Omnibattery's charge delay, predictive charging), that work against it. */
  conflicts?: {
    code: "buffer_soc" | "buffer_start_soc" | "battery_boost" | "charge_delay" | "predictive_charging";
    value?: number;
    loadpoint?: string;
    entity_id?: string;
    battery?: string;
  }[];
  /** When the cautious sun stops covering the house (ISO). */
  pv_end?: string | null;
  cap_kw?: number | null;
  need_kwh?: number;
  surplus_kwh?: number;
  /** What is left for the loadpoint until the sun's end, with caution (kWh). */
  expected_kwh?: number;
  hours?: { start: string; surplus: number; battery: number }[];
  sun_ratio?: number | null;
}

export interface NotifyConfig {
  service: string | null;
  ask: boolean;
  problems: boolean;
  morning: boolean;
  /** Which car is plugged in, and a car needed tomorrow but not plugged in. */
  cars?: boolean;
}

export interface Answers {
  ignored: string[];
  confirmed: string[];
  [key: string]: unknown;
}

/** What Joe learned (see custom_components/energy_joe/learn). */
export interface Learned {
  solar_factor: number | null;
  solar_days: number;
  /** +1: the forecast's hours belong one hour later. */
  solar_shift: -1 | 0 | 1 | null;
  shift_days: number;
  /** The buffer Joe learned, also when the user set their own. */
  buffer: number | null;
  buffer_days: number;
  /** When learning (re)started; null: from the first day Joe knows. */
  since: string | null;
  updated: string | null;
  /** The models, learned once a day (see learn/models.py). */
  consumption_model: ConsumptionModel | null;
  group_models: Record<string, ConsumptionModel & { average: number }>;
  /** Hours at home per person and calendar label. */
  presence: Record<string, Partial<Record<DayLabel, { hours: number; days: number }>>>;
  solar_classes: {
    classes?: Partial<Record<WeatherClass, { factor: number; days: number }>>;
    top?: number;
    days?: number;
  };
  /** How well each forecast source fits ("main" and the alternatives). */
  sources: Record<string, { factor: number; error: number; days: number }>;
  battery_models: Record<
    string,
    { capacity_kwh: number; efficiency: number; days: number; converter?: { factor: number; nights: number } | null }
  >;
  action_models: Record<string, { rate_k_per_h: number; loss_k_per_h: number; demand_k: number; days: number }>;
  /** Per car charged by need: real consumption (kWh/100 km), extra per degree below 15 °C, usual km. */
  /** The home's use from the balance against its own sensor (kWh, last weeks). */
  home_check?: { days: number; calc_kwh: number; sensor_kwh: number } | null;
  car_models: Record<
    string,
    { consumption?: number; cold?: number | null; consumption_days?: number; workday_km?: number; day_off_km?: number; days: number }
  >;
  models_day: string | null;
  /** When an area was reset last. */
  reset: Partial<Record<LearnScope, string>>;
}

export type WeatherClass = "clear" | "mixed" | "overcast";
export type LearnScope = "forecast" | "consumption" | "battery" | "hot_water" | "car";
export const LEARN_SCOPES: LearnScope[] = ["forecast", "consumption", "battery", "hot_water", "car"];

/** Daily consumption = base + working day + degrees below 15 °C / above 22 °C (+ presence). */
export interface ConsumptionModel {
  base: number;
  workday: number;
  heat: number;
  cool: number;
  presence: number | null;
  presence_mean: number | null;
  r2: number;
  days: number;
}

/** A recent day far off what Joe expected. */
export interface DayQuestion {
  date: string;
  actual: number;
  expected: number;
  kind: "more" | "less";
}

export type DayAnswer = "normal" | "guests" | "away" | "special";

export type ConditionOp = "eq" | "ne" | "lt" | "le" | "gt" | "ge";

export interface ActionCondition {
  entity_id: string;
  op: ConditionOp;
  value: string | number | boolean;
}

/** A night action: something besides the batteries that runs in the cheap window. */
/** Charging a car by need: tomorrow's driving plus a reserve (see plan/ev.py). */
export interface CarNeedConfig {
  enabled: boolean;
  soc_entity: string | null;
  range_entity: string | null;
  capacity_kwh: number | null;
  capacity_entity: string | null;
  odometer_entity: string | null;
  consumption_entity: string | null;
  reserve_km: number;
  consumption: number | null;
  daily_km: number | null;
  /** Whose calendars count; null: everyone with a calendar, []: nobody. */
  persons: string[] | null;
  round_trip: boolean;
  /** The car's finished calendars in Home Assistant (source "ha"). */
  calendars?: string[];
  /**
   * Where the car's appointments come from: a finished calendar ("ha"), its
   * mailbox without a calendar ("mailbox": into Joe's calendar for the car)
   * or its mailbox with a calendar ("account").
   */
  source?: "ha" | "mailbox" | "account";
  mailbox?: CarMailboxConfig;
  account?: CarAccountConfig;
  /** Who may invite the car: addresses or "@domain". */
  allowed?: string[];
  /** Never charge above this level by need (%). */
  max_soc?: number;
}

/** The roles of a car's entities (see model.py CAR_ENTITY_ROLES). */
export type CarRole = "soc" | "range" | "capacity" | "plugged" | "charging" | "odometer" | "consumption" | "outside_temp" | "location";

/** One integration that shows a car: evcc's vehicle or the car maker's (see model.py CAR_SOURCE). */
export interface CarSourceConfig {
  id: string;
  kind: "evcc" | "car";
  platform: string | null;
  device_id: string | null;
  name: string | null;
  /** evcc's id of the vehicle ("db:27"), learned. */
  vehicle: string | null;
  entities: Partial<Record<CarRole, string>>;
}

/** A car: everything about its need (see model.py CAR). */
export interface CarConfig {
  id: string;
  name: string;
  sources: CarSourceConfig[];
  /** Where the car is (device_tracker or person); null: its integration's. */
  tracker_entity: string | null;
  need: CarNeedConfig;
  /** The evening reminder when tomorrow needs charging but the car is not plugged in. */
  remind: boolean;
  remind_time: string;
}

/** A wallbox Joe switches: which car is plugged in decides (see model.py CHARGE_POINT). */
export interface ChargePointConfig {
  vehicle_entity: string | null;
  connected_entity: string | null;
  soc_entity: string | null;
  range_entity: string | null;
  odometer_entity: string | null;
  /** Which cars may charge here; null: every car. */
  cars: string[] | null;
  /** When Joe cannot tell the car: ask, or assume one. */
  unknown: "ask" | "assume";
  assume_car: string | null;
}

/** Which car is plugged into a charge point (see plan/cars.py detect_all). */
export interface PointStatus {
  state: "free" | "empty" | "car" | "guest" | "unknown";
  car: string | null;
  how: "evcc" | "plugged" | "home" | "answer" | "assume" | null;
  vehicle: string | null;
  connected: boolean | null;
  ask: boolean;
}

/** Where one value of a car comes from now. */
export interface CarValueSource {
  entity: string;
  kind: "evcc" | "car" | "manual";
  platform: string | null;
  name: string | null;
}

/** What the backend tells about the cars (see control/cars.py status). */
export interface CarsStatus {
  points: Record<string, PointStatus>;
  cars: Record<
    string,
    {
      point: string | null;
      plugged: boolean | null;
      home: boolean | null;
      values: Partial<Record<CarRole, CarValueSource>>;
    }
  >;
  answers: Record<string, { car: string; since: string | null; at: string }>;
  /** Cars that may be one vehicle: Joe asks. */
  merge: { a: string; b: string; a_name: string; b_name: string; b_platform: string | null }[];
  /** Tonight's "needs charging, not plugged in". */
  reminders: { car: string; name: string; km: number }[];
}

/** A car's need for tomorrow in the plan, with where it is plugged in. */
export type PlanCar = CarNeed & { car: string; name: string; point: string | null };

export type MailProvider = "webde" | "gmx" | "google" | "tonline" | "other";

/** A car's mailbox without a calendar (the password is stored elsewhere). */
export interface CarMailboxConfig {
  provider: MailProvider;
  address: string;
  username: string | null;
  imap_host: string | null;
  imap_port: number | null;
  smtp_host: string | null;
  smtp_port: number | null;
  smtp_security: "starttls" | "ssl" | null;
  accept: boolean;
}

export interface CarMailboxStatus {
  state: "off" | "no_secret" | "waiting" | "ok" | "error";
  has_secret?: boolean;
  checked?: string | null;
  error?: string | null;
  recent?: {
    at: string;
    summary: string;
    start: string | null;
    from: string;
    organizer: string | null;
    method: string;
    result: string;
  }[];
}

/** A car's mailbox with a calendar (Google, Microsoft, iCloud, Infomaniak, CalDAV). */
export interface CarAccountConfig {
  kind: "google" | "outlook" | "microsoft" | "icloud" | "infomaniak" | "caldav";
  address: string;
  username: string | null;
  url: string | null;
  client_id: string | null;
  tenant: string;
  accept: boolean;
}

export interface CarAccountStatus {
  state?: "waiting" | "ok" | "error" | "no_secret";
  /** Signed in the way the SAVED kind needs; the others whatever the kind. */
  has_secret?: boolean;
  has_password?: boolean;
  has_sign_in?: boolean;
  has_client_secret?: boolean;
  error?: string | null;
  checked?: string;
  oauth?: { state: "waiting" | "ok" | "error"; user_code?: string; uri?: string; error?: string } | null;
}

/** A thermostat or air conditioner Joe steers by presence (see control/climate.py). */
/** The device that measures a climate device (several may share one). */
export interface ClimateMeter {
  device_id: string;
  power: string | null;
  energy: string | null;
}

/** A power meter Joe could pair with a climate device (energy_joe/climate/devices). */
export interface ClimateMeterOption extends ClimateMeter {
  name: string | null;
  /** The sensor's name when the device has several. */
  sensor: string | null;
  /** The device it is connected via. */
  via: string | null;
  area: string | null;
}

/** Someone on the way home, by person entity. */
export interface ClimateArrival {
  km?: number;
  direction?: string;
  minutes?: number;
  source?: string;
}

/** What energy_joe/climate/devices finds: thermostats and ACs by room, meters and who heads home. */
export interface ClimateFound {
  devices: ClimateDevice[];
  meters?: ClimateMeterOption[];
  suggested?: Record<string, ClimateMeterOption>;
  arrivals: Record<string, ClimateArrival>;
  proximity: boolean;
}

/** When a week profile applies (each tag sits on at most one profile of a set). */
export type WeekTag = "normal" | "holiday" | "away" | "home_office";
export const WEEK_TAGS: WeekTag[] = ["normal", "holiday", "away", "home_office"];
export type WeekMode = "heat" | "cool";
export const WEEK_MODES: WeekMode[] = ["heat", "cool"];
/** A switching point: minute of the day (0..1435, steps of 5) and a temperature or "off". */
export type WeekValue = number | "off";
export type WeekPoint = [number, WeekValue];
/** One curve for all days, Mon–Fri and Sat–Sun, or each day (index 0 = Monday). */
export type WeekSplit = "all" | "week_weekend" | "each";

export interface WeekProfile {
  name: string;
  tags: WeekTag[];
  split: WeekSplit;
  curves: WeekPoint[][];
}

export interface ClimateWeekConfig {
  enabled: boolean;
  /** Exactly 6 profiles per operating mode. */
  modes: Partial<Record<WeekMode, WeekProfile[]>>;
}

/** A device's own profile (e.g. Homematic IP week_program_N) with Joe's tags. */
export interface DeviceProfileConfig {
  name: string;
  tags: WeekTag[];
}

export interface ClimateRoomConfig {
  enabled: boolean;
  /** null: not chosen yet (Joe suggests one), "none": has no meter. */
  meter?: ClimateMeter | "none" | null;
  away: "setback" | "off" | "preset";
  setback_k: number;
  away_preset: string | null;
  free_day_preset: string | null;
  night_off: boolean;
  night_from: string;
  night_until: string;
  /** Week profiles of an air conditioner. */
  week?: ClimateWeekConfig;
  /** Tags on the device's own week programs, by preset name. */
  device_profiles?: Record<string, DeviceProfileConfig>;
}

export interface ClimateConfig {
  enabled: boolean;
  /** When night is: each room's times, or an entity that is on while people are in bed. */
  night_by?: "time" | "entity";
  /** The drive home from the routing service instead of an average speed. */
  route_eta?: boolean;
  night_entity?: string | null;
  /** Minutes without anybody home before the house counts as empty. */
  away_after_min?: number;
  rooms: Record<string, ClimateRoomConfig>;
}

/** A thermostat or air conditioner as energy_joe/climate/devices lists it. */
export interface ClimateDevice {
  entity_id: string;
  name: string;
  device_id: string | null;
  device_name: string | null;
  area: string | null;
  state: string;
  hvac_modes: string[];
  preset_modes: string[];
  temperature: number | null;
  current_temperature: number | null;
  platform: string | null;
  /** The device's own week programs (week_program_N), in order. */
  week_presets?: string[];
  min_temp?: number | null;
  max_temp?: number | null;
  target_temp_step?: number | null;
}

/** What kind of day today is for the climate control. */
export interface ClimateDay {
  free: boolean;
  holiday: boolean;
  weekend: boolean;
  /** Names of the people working from home today (from their calendar). */
  home_office: string[];
  home_office_available: boolean;
  home_office_reason: "default" | "no_calendar" | null;
  labels_at: string | null;
  /** The calendars today: not read yet, read ("ok": at least one person with a result), or not reachable. */
  labels_state?: "unread" | "ok" | "error";
}

/** A profile chosen by hand, whatever the situation (until: ISO, or null for until further notice). */
export interface ClimateHold {
  profile: number;
  mode: WeekMode;
  until: string | null;
}

export interface ClimateRoomStatus {
  want: string | null;
  why: string;
  kind?: "week" | "device" | "legacy";
  mode?: WeekMode | null;
  profile?: { index: number | null; name: string; tags: WeekTag[]; held: boolean } | null;
  target?: { hvac: string; temperature?: number; preset?: string } | null;
  /** The next switching point today. */
  next?: { at: string; value: WeekValue } | null;
  override?: { reason: "manual" | "off" | "preset"; until: string | null } | null;
  /** The profile chosen by hand, also while the night or nobody home comes first. */
  hold?: ClimateHold | null;
  /** Profiles start ("start") or end ("end") once the night or absence now on is over. */
  pending?: "start" | "end" | null;
  error?: string | null;
  /** True when Joe only shows what he would do (not live). */
  would?: boolean;
}

export interface ClimateStatus {
  home: string[];
  arrivals: Record<string, { km?: number; direction?: string; minutes?: number; source?: string }>;
  /** Per person entity: the usual homecoming today (minutes after midnight). */
  usual?: Record<string, number>;
  free_day: boolean;
  day?: ClimateDay;
  /** Since when nobody is home (ISO), or null. */
  nobody_since?: string | null;
  rooms: Record<string, ClimateRoomStatus>;
  live: boolean;
  rates: Record<string, number>;
  /** What Joe switched last, oldest first. */
  log?: ClimateLogEntry[];
}

/** One switch in the climate log: a situation Joe set ("away", "normal" …), "back" or "failed". */
export interface ClimateLogEntry {
  at: string;
  entity: string;
  what: string;
}

export interface RoutingConfig {
  service: "waze" | "google" | "osm" | null;
  google_entry: string | null;
  geocoder_url: string;
  router_url: string;
}

/** A trip tomorrow: an appointment with a place, and how far (there and back). */
export interface CarTrip {
  start: string;
  location: string;
  km: number | null;
  minutes: number | null;
  source: "waze" | "google" | "osm" | "zone" | "user" | null;
}

/** What tomorrow's driving needs (plan action entry "need"). */
export interface CarNeed {
  known: boolean;
  trips: CarTrip[];
  trips_km: number;
  usual_km: number | null;
  needed_km: number;
  reserve_km: number;
  consumption: number;
  consumption_source: "user" | "learned" | "car" | "default";
  temp: number | null;
  rain: boolean;
  soc: number | null;
  range_km: number | null;
  capacity_kwh: number | null;
  have_km?: number;
  target?: number;
  target_unit?: "%" | "km";
  missing_kwh: number | null;
  wall_kwh: number | null;
  /** False when tomorrow's driving needs more than a full battery. */
  fits?: boolean;
  departure: string | null;
  unknown_trips: number;
}

export interface ActionConfig {
  id: string;
  name: string;
  kind: "switch" | "target";
  enabled: boolean;
  entity_id: string;
  on_value: string | number | boolean;
  reset: "previous" | "fixed";
  reset_value: string | number | boolean | null;
  lead_min: number;
  auto: boolean;
  forecast_below_kwh: number | null;
  conditions: ActionCondition[];
  power_kw: number | null;
  power_entity: string | null;
  consumer_id: string | null;
  priority: number;
  sensor_entity: string | null;
  comfort: number;
  maximum: number;
  buffer: number;
  /** A wallbox for cars (null: an ordinary night action). */
  point?: ChargePointConfig | null;
}

export interface JoeConfig {
  version: number;
  measurements: {
    grid_power: Measurement | null;
    home_power: Measurement | null;
    solar_power: Measurement[];
  };
  batteries: BatteryConfig[];
  tariff: TariffConfig;
  forecast: ForecastConfig;
  context: { weather_entity: string | null; holiday_entity: string | null; presence_entity?: string | null;
    guest_switch?: string | null;
    guest_tracker?: string | null;
    /** Today is a day off as well when one of these is on. */
    free_day_entities?: string[];
  };
  persons: PersonConfig[];
  consumers: ConsumerConfig[];
  actions: ActionConfig[];
  cars: CarConfig[];
  rules: Rules;
  notify: NotifyConfig;
  calendar: CalendarConfig;
  routing: RoutingConfig;
  climate?: ClimateConfig;
  answers: Answers;
  learned: Learned;
  provenance: Record<string, Provenance>;
}

export interface ObserveStatus {
  active: boolean;
  since?: string;
  last_hour?: string;
  first_day?: string | null;
  last_day?: string | null;
  day_count?: number;
  backfill: { state: "idle" | "running" | "done" | "unavailable" | "failed"; hours?: number; from?: string };
}

export interface PlanHour {
  start: string;
  solar: number;
  home: number;
  window: boolean;
  /** A dynamic tariff's price for this hour (per kWh). */
  price?: number;
  soc: number;
  soc_without: number;
  charge: number;
  grid_in: number;
  grid_out: number;
}

/** Why a battery charges as it does tonight (see plan/night.py). */
export type PlanPace = "none" | "spread" | "short" | "cheapest" | "full" | "grid_limit" | "fixed_power";

export interface PlanBattery {
  id: string;
  name: string;
  soc: number;
  soc_start: number;
  /** Its own target (each battery gets its share of tonight's energy). */
  target: number;
  /** Into the battery (kWh); grid_kwh with the losses. */
  charge_kwh: number;
  grid_kwh?: number;
  /** The highest power Joe sets tonight (kW). */
  power_kw: number;
  max_kw?: number;
  /** When it charges and with what power (older plans: missing). */
  slots?: { start: string; end: string; power_kw: number }[];
  how?: PlanPace;
  /** Whether Joe can set its power (else it charges at full power). */
  paced?: boolean;
  /** Its place in the order of charging (0: gets first). */
  rank?: number;
  controllable: boolean;
  /** Whether Joe can charge it from the grid at all. */
  grid?: boolean;
}

/** Tonight's plan (see custom_components/energy_joe/plan). */
export interface Plan {
  kind: "charge" | "hold" | "none" | "unavailable";
  created: string;
  fixed?: boolean;
  reasons: string[];
  notes?: string[];
  window?: { start: string; end: string };
  target?: number;
  optimum?: number;
  target_kwh?: number;
  capacity_kwh?: number;
  soc_now?: number;
  soc_start?: number;
  grid_charge_kwh?: number;
  charge_from?: string | null;
  /** When to charge, in quarter hours (the cheapest ones with a dynamic tariff). */
  charge_slots?: { start: string; end: string }[];
  tariff?: "fixed" | "dynamic";
  /** Dynamic tariff: the span Joe searched for the best window. */
  search?: { start: string; end: string };
  charge_kw?: number;
  batteries?: PlanBattery[];
  sun_takes_over?: string | null;
  /** Grid-friendly morning: batteries hold back charging until then (see planner._grid_friendly). */
  day?: { defer_until: string; held_kwh: number; grid_first: boolean; cost?: number } | null;
  full_at?: string | null;
  empty_without?: string | null;
  solar_kwh?: number;
  home_kwh?: number;
  cost?: { night_charge: number; plan: number; without: number; saving: number };
  prices?: { night: number; day: number; feed_in: number; assumed: boolean };
  rules?: {
    reserve: number;
    max_target: number;
    buffer: number;
    discharge_mode: string;
    evening_min: number | null;
    max_price?: number | null;
    min_saving?: number;
    force_target?: number | null;
    grid_limit_kw?: number | null;
    /** Where the grid limit comes from: the user's or the highest import Joe measured. */
    grid_limit_source?: "user" | "learned" | null;
  };
  meta?: {
    consumption: { source: "history" | "default"; days: number };
    solar: { sources: Record<string, "hours" | "sum" | "none">; totals: Record<string, number> };
    solar_factor: number;
    workday?: boolean | null;
    tomorrow_kwh?: number;
    tomorrow?: TomorrowOutlook;
    efficiency?: number;
  };
  hours?: PlanHour[];
  actions?: PlanAction[];
  /** Each car charged by need: tomorrow and where it is plugged in. */
  cars?: Record<string, PlanCar>;
}

/** Tomorrow as Joe's models see it (see plan/inputs.py). */
export interface TomorrowOutlook {
  date: string;
  workday: boolean;
  temp: number | null;
  labels: Record<string, DayLabel>;
  presence: number | null;
  profile_kwh: number;
  expected_kwh?: number;
  scale: number;
  weather?: WeatherClass;
  solar_forecast: number | null;
  solar_combined: number | null;
  solar_factor: number | null;
  solar_source: "combined" | "weather" | "learned";
}

/** A night action in tonight's plan (see plan/actions.py). */
export interface PlanAction {
  id: string;
  name: string;
  kind: "switch" | "target";
  run: boolean;
  manual: boolean;
  reasons: string[];
  start: string;
  end: string;
  power_kw: number | null;
  energy_kwh: number;
  cost?: number;
  priority: number;
  target?: number;
  temperature?: number | null;
  sensor?: string;
  need?: CarNeed;
  /** A charge point: what is plugged in, the car and how Joe knows. */
  plugged?: PointStatus["state"];
  car?: string | null;
  how?: PointStatus["how"];
}

export interface JoeState {
  mode: JoeMode;
  onboarding: { step: OnboardingStep; completed: boolean };
  config: JoeConfig;
  observe?: ObserveStatus;
  plan?: Plan | null;
  results?: Results | null;
  questions?: DayQuestion[];
  control?: ControlView;
  /** Each car's mailbox without a calendar: last look and invitations. */
  mailbox?: Record<string, CarMailboxStatus>;
  /** Each car's mailbox with a calendar: sign-in and last read. */
  accounts?: Record<string, CarAccountStatus>;
  /** Energy Joe's own apps for signing in (false: one's own app is needed). */
  apps?: { microsoft: boolean; google: boolean };
  /** Heating and air conditioning by presence. */
  climate?: ClimateStatus;
  /** Which car is plugged in where, questions and reminders. */
  cars?: CarsStatus;
  /** Each battery's floor (%), where it comes from, and the device's own setting. */
  floors?: Record<string, BatteryFloor>;
}

export interface BatteryFloor {
  value: number | null;
  source: "user" | "device" | "unknown";
  device: number | null;
}

// --- Steering (see custom_components/energy_joe/control) ---

export type ControlReason =
  | "simulation"
  | "off"
  | "no_plan"
  | "waiting"
  | "unanswered"
  | "declined"
  | "skipped"
  | "nothing"
  | "steering"
  | "day"
  | "done";

export interface ControlBattery {
  action: "charge" | "hold" | "block" | "free" | "watch" | "defer" | null;
  /** A grid-friendly morning: charging held back until then. */
  until?: string;
  floor: number | null;
  target: number;
  soc: number | null;
  problem: string | null;
  /** The power Joe sets while it charges (W; null: as fast as it can). */
  power_w?: number | null;
  /** Fronius: its charge limit as the ceiling of the night's power, and whether it holds. */
  cap?: { w: number | null; seen_w: number | null; state: "works" | "ignored" | null };
}

export interface TestStep {
  step: "hold" | "charge" | "release";
  ok: boolean;
  errors: { entity_id: string; code: string }[];
  wrong: string[];
  power: number | null;
  writes: { entity_id: string; value: unknown }[];
}

export interface TestResult {
  at: string;
  signature: string;
  ok: boolean;
  steps: TestStep[];
  soc?: number;
  problem?: string;
  missing?: string[];
}

export interface ControlLogEntry {
  at: string;
  kind: string;
  battery?: string;
  entity?: string;
  value?: unknown;
  [key: string]: unknown;
}

export interface ControlView {
  steering: boolean;
  reason: ControlReason;
  night: string | null;
  batteries: Record<string, ControlBattery>;
  actions: Record<
    string,
    {
      on: boolean;
      reason: string | null;
      start: string;
      end: string;
      target?: number;
      problem: string | null;
      /** Charging to a level by hand ("boost"): what the user chose, in % or km. */
      chosen?: number;
      unit?: "%" | "km";
      value?: number | null;
    }
  >;
  pending: boolean;
  testing: { battery: string; step: string; steps: TestStep[]; started: string } | null;
  tests: Record<string, TestResult>;
  log: ControlLogEntry[];
  skip: string | null;
  answer: { night: string; yes: boolean; at: string } | null;
  /** Night actions switched on "tonight" by hand: action id -> night. */
  tonight: Record<string, string>;
  /** "Tonight up to …" for a car: the night and what the user chose, in % or km. */
  tonight_target?: Record<string, { night: string; target: number; chosen: number; unit: "%" | "km"; sensor: string }>;
  /** Cars charging to a level by hand right now. */
  boost?: Record<string, { target: number; chosen: number; unit: "%" | "km"; sensor: string; since: string; until: string }>;
  /** Daytime surplus for evcc (older backends: missing). */
  surplus?: DaySurplus;
  /** Several batteries one after the other (older backends: missing). */
  team?: BatteryTeam;
  /** The watchdog: batteries running against each other (older backends: missing). */
  guard?: TransferGuard;
  /** The highest import from the grid Joe measured (W), when, and since when he watches. */
  grid_peak?: { w: number; at: string; since: string } | null;
  /** Per battery: ready to steer, or why not. */
  ready: Record<string, "ready" | "not_tested" | "outdated" | "not_controllable" | "controls_missing">;
}

// --- Looking back (see custom_components/energy_joe/learn) ---

export interface Purchases {
  day_kwh: number;
  night_kwh: number;
  sold_kwh: number;
}

/** A fixed plan replayed with the real day. */
export interface Evaluation {
  created: string;
  target: number | null;
  window?: { start: string; end: string };
  complete: boolean;
  /** False until the plan's day is over: the rest is played as Joe expected it. */
  final: boolean;
  /** End of the last real hour in a provisional result. */
  until: string | null;
  missing: number;
  start_soc?: number;
  /** What steering would have saved (negative: cost more). */
  saving?: number;
  with_plan?: Purchases;
  without?: Purchases;
  actual?: Purchases & { cost: number };
  solar?: { actual: number; forecast: number | null };
  home?: { actual: number; forecast: number | null };
  /** Energy the batteries had to give until the sun took over, as planned and as it came. */
  bridge?: { planned: number; actual: number };
  takeover?: { planned: string | null; actual: string | null };
}

export interface Results {
  since: string | null;
  /** The first night counted. */
  first: string | null;
  days: number;
  saving: number;
  better: number;
  worse: number;
  last: {
    date: string;
    window?: { start: string; end: string } | null;
    final: boolean;
    until: string | null;
    saving: number;
    day_kwh: number;
    day_kwh_without: number;
    night_kwh: number;
    night_kwh_without: number;
  } | null;
  daily: { date: string; saving: number }[];
}

export interface Learning {
  learned: Learned;
  buffer: { value: number; source: Source; default: number };
  solar: { date: string; forecast: number; actual: number; ratio: number | null }[];
  /** Average sun per hour of the day, as it came and as forecast (kWh). */
  solar_profile: { actual: number[]; forecast: number[]; days: number } | null;
  consumption: { workday: number[]; day_off: number[]; source: "history" | "default"; days: number };
  accuracy: {
    /** The day the night starts (where it is kept). */
    date: string;
    /** The day the night ends: the days page shows it there. */
    end?: string;
    saving: number;
    solar: { actual: number; forecast: number | null };
    home: { actual: number; forecast: number | null };
    bridge: { planned: number; actual: number };
  }[];
  results: Results | null;
  /** The days behind the models: consumption against the outdoor temperature. */
  days: {
    date: string;
    home: number;
    temp: number | null;
    workday: boolean;
    excluded: boolean;
    answer: DayAnswer | null;
    labels: Record<string, DayLabel>;
  }[];
  questions: DayQuestion[];
  /** How many days each value needs before Joe uses it. */
  needs: { solar: number; shift: number; buffer: number; models: number; sources: number };
}

// --- History (see custom_components/energy_joe/observe) ---

export interface HourRecord {
  start: string;
  src: "live" | "stats" | "history";
  cov: number;
  home?: number;
  home_calc?: boolean;
  solar?: number;
  grid_in?: number;
  grid_out?: number;
  bat_in?: number;
  bat_out?: number;
  bat?: Record<string, { in?: number; out?: number; soc?: number }>;
  use?: Record<string, number>;
  temp?: number;
  present?: Record<string, number>;
  fc_today?: number;
  fc_tomorrow?: number;
  fc_remaining?: number;
}

export interface DaySummary {
  date: string;
  hours: number;
  expected: number;
  cov: number;
  home: number | null;
  solar: number | null;
  grid_in: number | null;
  grid_out: number | null;
  bat_in: number | null;
  bat_out: number | null;
  grid_in_cheap?: number | null;
  fc_ahead?: number | null;
  fc_latest?: number | null;
  solar_vs_fc?: number | null;
  temp?: { min: number; max: number; mean: number };
  present?: Record<string, number>;
  soc?: Record<string, { min: number; max: number; end: number }>;
  self_sufficiency?: number;
  sun_covers?: string;
  workday?: boolean | null;
  sources: Record<string, number>;
}

export interface DayDetail {
  date: string;
  /** The plan Joe fixed for the night that starts on this day. */
  plan: Omit<Plan, "hours" | "meta"> | null;
  plan_soc_slots: (number | null)[];
  /** That plan replayed with the real day, once the day is over. */
  evaluation: Evaluation | null;
  evaluation_slots: { with: (number | null)[]; without: (number | null)[] };
  /** Local start time of every hour of the day ("02:00" twice when the clocks go back). */
  slots: string[];
  hours: (HourRecord & { slot: number })[];
  fc: { ahead_kwh?: number; latest_kwh?: number };
  /** Forecast in kWh per slot: latest, and as it stood the evening before. */
  fc_slots: (number | null)[];
  fc_ahead_slots: (number | null)[];
  workday: boolean | null;
  summary: DaySummary;
  window: { start: string; end: string } | null;
  window_slots: [number, number][];
  sun: { sunrise?: string; sunset?: string; sunrise_slot?: number; sunset_slot?: number };
}

export interface HistoryDays {
  days: DaySummary[];
  first_day: string | null;
  last_day: string | null;
  day_count: number;
}

export interface EnergySummary {
  available: boolean;
  configured?: boolean;
  sources?: Record<string, number>;
  devices?: number;
}

export interface JoeInfo {
  version: string;
  ha_version: string;
  energy: EnergySummary;
  defaults?: { rules: Rules };
  /** Names of the integrations Joe can steer batteries of. */
  profiles?: Record<string, string>;
  /** What can work out distances: Waze (without setup from HA 2026.8) and Google entries. */
  routing?: { waze: boolean; google: { entry_id: string; title: string }[] };
}

// The tabs (Tab, TABS) and addresses live in router.ts.
export type { Tab } from "./router";
export { TABS } from "./router";

// --- Discovery (what Joe found, see custom_components/energy_joe/discovery) ---

export interface EntityRef {
  entity_id: string;
  name: string;
  area: string | null;
  device: string | null;
  value: number | string | null;
  unit: string | null;
  integration: string | null;
}

export interface Reason {
  code: string;
  [key: string]: unknown;
}

export interface SingleFinding {
  entity: EntityRef;
  measurement: Measurement;
  confidence: number;
  reasons: Reason[];
  alternatives: EntityRef[];
}

export interface SolarFinding {
  entities: EntityRef[];
  measurements: Measurement[];
  total: number | null;
  confidence: number;
  reasons: Reason[];
  alternatives?: EntityRef[];
}

export interface BatteryFinding {
  id: string;
  name: string;
  integration: string | null;
  soc: EntityRef;
  soc_entity: string;
  power: Measurement | null;
  capacity_kwh: number | null;
  capacity_entity: string | null;
  max_charge_w: number | null;
  max_discharge_w: number | null;
  device_id: string | null;
  controllable: boolean;
  controls: Partial<Record<ControlRole, string>>;
  mode_options?: Partial<Record<ModeMeaning, string>>;
  prepare?: ControlStep[];
  steps?: Partial<Record<StepName, ControlStep[]>>;
  adapter: Adapter;
  /** Levers Joe guesses for batteries without a profile (to confirm in the panel). */
  suggested?: {
    controls: Partial<Record<ControlRole, string>>;
    mode_options: Partial<Record<ModeMeaning, string>>;
    complete: boolean;
  } | null;
  confidence: number;
  reasons: Reason[];
}

export interface TariffFinding {
  price_entity: string | null;
  price?: EntityRef | null;
  provider: string | null;
  kind: TariffKind;
  window: { start: string; end: string } | null;
  night_price: number | null;
  day_price: number | null;
  feed_in_price: number | null;
  feed_in_entity?: string | null;
  confidence: number;
  reasons: Reason[];
}

export interface ForecastFinding {
  provider: string;
  provider_name: string;
  planes: number;
  config_entries?: string[];
  today?: string[];
  tomorrow?: string[];
  remaining_today?: string[];
  today_kwh: number | null;
  tomorrow_kwh: number | null;
  confidence: number;
  reasons: Reason[];
  /** Other forecast integrations: alternatives to learn and combine. */
  others?: { provider: string; provider_name: string; tomorrow: string[]; tomorrow_kwh: number | null }[];
}

export interface WallboxFinding {
  name: string;
  integration: string;
  device_id?: string;
  mode_entity?: string;
  mode_options?: string[];
  mode?: string;
  entities?: Record<string, string>;
  /** evcc also drives heaters: their "vehicle level" is a temperature. */
  kind?: "car" | "heating" | "other";
  is_car: boolean;
  confidence: number;
  reasons: Reason[];
}

export interface ContextFinding {
  entity: EntityRef;
  confidence: number;
  reasons: Reason[];
  alternatives?: EntityRef[];
}

export interface Check {
  code: string;
  level: "warn" | "info";
  [key: string]: unknown;
}

export interface Discovery {
  energy_dashboard: { configured: boolean; grid?: number; solar?: number; battery?: number; devices?: number };
  measurements: {
    grid_power: SingleFinding | null;
    home_power: SingleFinding | null;
    solar_power: SolarFinding | null;
  };
  batteries: BatteryFinding[];
  tariff: TariffFinding;
  forecast: ForecastFinding | null;
  wallboxes: WallboxFinding[];
  cars?: CarFinding[];
  /** Every car Joe sees as a source: evcc's vehicles, then the car makers'. */
  car_sources?: CarSourceConfig[];
  weather: ContextFinding | null;
  holiday: ContextFinding | null;
  persons: { entity_id: string; name: string; calendars: string[] }[];
  calendars: { entity_id: string; name: string }[];
  consumers: { id: string; name: string; kind: string }[];
  checks: Check[];
}

/** An electric car from a car integration. */
export interface CarFinding {
  integration: string;
  device_id: string;
  name: string;
  entities: Partial<Record<"soc" | "range" | "capacity" | "plugged" | "charging" | "odometer" | "consumption" | "outside_temp", string>>;
  soc: number | null;
  range_km: number | null;
  capacity_kwh: number | null;
  confidence: number;
  reasons: Reason[];
}

export interface AdoptResult {
  discovery: Discovery;
  checks: Check[];
}
