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
  config?: { currency?: string };
  formatEntityState?: (stateObj: HassEntity, state?: string) => string;
}

export interface PanelRoute {
  prefix: string;
  path: string;
}

// --- Joe's state and configuration (see custom_components/energy_joe/model.py) ---

export type JoeMode = "simulation" | "live" | "off";
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

export type Adapter = "fronius" | "omnibattery" | "generic" | "none";

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
  controls: Record<string, string>;
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
}

export interface Answers {
  ignored: string[];
  confirmed: string[];
  [key: string]: unknown;
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
  actions: unknown[];
  rules: Rules;
  answers: Answers;
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

export interface JoeState {
  mode: JoeMode;
  onboarding: { step: OnboardingStep; completed: boolean };
  config: JoeConfig;
  observe?: ObserveStatus;
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
  controls: Record<string, string>;
  adapter: Adapter;
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
