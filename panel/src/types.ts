/** The parts of Home Assistant's frontend object the panel uses. */
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
}

export interface PanelRoute {
  prefix: string;
  path: string;
}

export type JoeMode = "simulation" | "live" | "off";
export type OnboardingStep = "welcome" | "scan" | "questions" | "done";
export const ONBOARDING_STEPS: OnboardingStep[] = ["welcome", "scan", "questions", "done"];

export interface JoeState {
  mode: JoeMode;
  onboarding: { step: OnboardingStep; completed: boolean };
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

export interface Measurement {
  entity_id: string;
  invert: boolean;
  minus_entity_id: string | null;
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
}

export interface BatteryFinding {
  id: string;
  name: string;
  integration: string | null;
  soc: EntityRef;
  capacity_kwh: number | null;
  controllable: boolean;
  adapter: string;
  confidence: number;
  reasons: Reason[];
}

export interface TariffFinding {
  price_entity: string | null;
  provider: string | null;
  kind: "fixed_window" | "dynamic" | "flat" | "unknown";
  window: { start: string; end: string } | null;
  night_price: number | null;
  day_price: number | null;
  feed_in_price: number | null;
  confidence: number;
  reasons: Reason[];
}

export interface ForecastFinding {
  provider: string;
  provider_name: string;
  planes: number;
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
  weather: { entity: EntityRef; confidence: number; reasons: Reason[] } | null;
  holiday: { entity: EntityRef; confidence: number; reasons: Reason[] } | null;
  persons: { entity_id: string; name: string; calendars: string[] }[];
  calendars: { entity_id: string; name: string }[];
  consumers: { id: string; name: string; kind: string }[];
  checks: Check[];
}
