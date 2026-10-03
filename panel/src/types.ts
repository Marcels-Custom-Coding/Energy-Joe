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
  connection: {
    subscribeMessage<T>(
      callback: (msg: T) => void,
      msg: { type: string; [key: string]: unknown },
    ): Promise<() => Promise<void>>;
  };
  language: string;
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
  | "charge_limit_enabled";
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
  device_id: string | null;
  controls: Partial<Record<ControlRole, string>>;
  mode_options: Partial<Record<ModeMeaning, string>>;
  /** Entities set before steering through the mode (e.g. "Remote Control"). */
  prepare: ControlStep[];
  steps: Partial<Record<StepName, ControlStep[]>>;
  priority: number;
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
}

export interface ForecastConfig {
  provider: string | null;
  config_entries: string[];
  today: string[];
  tomorrow: string[];
  remaining_today: string[];
}

export interface PersonConfig {
  id: string;
  name: string;
  person_entity: string | null;
  calendars: string[];
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
}

export interface NotifyConfig {
  service: string | null;
  ask: boolean;
  problems: boolean;
  morning: boolean;
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
}

export type ConditionOp = "eq" | "ne" | "lt" | "le" | "gt" | "ge";

export interface ActionCondition {
  entity_id: string;
  op: ConditionOp;
  value: string | number | boolean;
}

/** A night action: something besides the batteries that runs in the cheap window. */
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
  context: { weather_entity: string | null; holiday_entity: string | null };
  persons: PersonConfig[];
  consumers: ConsumerConfig[];
  actions: ActionConfig[];
  rules: Rules;
  notify: NotifyConfig;
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
  soc: number;
  soc_without: number;
  charge: number;
  grid_in: number;
  grid_out: number;
}

export interface PlanBattery {
  id: string;
  name: string;
  soc: number;
  soc_start: number;
  target: number;
  charge_kwh: number;
  power_kw: number;
  controllable: boolean;
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
  charge_kw?: number;
  batteries?: PlanBattery[];
  sun_takes_over?: string | null;
  full_at?: string | null;
  empty_without?: string | null;
  solar_kwh?: number;
  home_kwh?: number;
  cost?: { night_charge: number; plan: number; without: number; saving: number };
  prices?: { night: number; day: number; feed_in: number; assumed: boolean };
  rules?: { reserve: number; max_target: number; buffer: number; discharge_mode: string; evening_min: number | null };
  meta?: {
    consumption: { source: "history" | "default"; days: number };
    solar: { sources: Record<string, "hours" | "sum" | "none">; totals: Record<string, number> };
    solar_factor: number;
    workday?: boolean | null;
    tomorrow_kwh?: number;
  };
  hours?: PlanHour[];
  actions?: PlanAction[];
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
}

export interface JoeState {
  mode: JoeMode;
  onboarding: { step: OnboardingStep; completed: boolean };
  config: JoeConfig;
  observe?: ObserveStatus;
  plan?: Plan | null;
  results?: Results | null;
  control?: ControlView;
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
  | "done";

export interface ControlBattery {
  action: "charge" | "hold" | "block" | "free" | "watch" | null;
  floor: number | null;
  target: number;
  soc: number | null;
  problem: string | null;
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
  actions: Record<string, { on: boolean; reason: string | null; start: string; end: string; target?: number; problem: string | null }>;
  pending: boolean;
  testing: { battery: string; step: string; steps: TestStep[]; started: string } | null;
  tests: Record<string, TestResult>;
  log: ControlLogEntry[];
  skip: string | null;
  answer: { night: string; yes: boolean; at: string } | null;
  /** Night actions switched on "tonight" by hand: action id -> night. */
  tonight: Record<string, string>;
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
    date: string;
    saving: number;
    solar: { actual: number; forecast: number | null };
    home: { actual: number; forecast: number | null };
    bridge: { planned: number; actual: number };
  }[];
  results: Results | null;
  /** How many days each value needs before Joe uses it. */
  needs: { solar: number; shift: number; buffer: number };
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
}

export type Page = "overview" | "plan" | "history" | "learn" | "devices" | "settings";
export const PAGES: Page[] = ["overview", "plan", "history", "learn", "devices", "settings"];

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
}

export interface WallboxFinding {
  name: string;
  integration: string;
  device_id?: string;
  mode_entity?: string;
  mode_options?: string[];
  mode?: string;
  entities?: Record<string, string>;
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
  weather: ContextFinding | null;
  holiday: ContextFinding | null;
  persons: { entity_id: string; name: string; calendars: string[] }[];
  calendars: { entity_id: string; name: string }[];
  consumers: { id: string; name: string; kind: string }[];
  checks: Check[];
}

export interface AdoptResult {
  discovery: Discovery;
  checks: Check[];
}
