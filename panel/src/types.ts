/** The parts of Home Assistant's frontend object the panel uses. */
export interface HomeAssistant {
  callWS<T>(msg: { type: string; [key: string]: unknown }): Promise<T>;
  language: string;
  themes?: { darkMode?: boolean };
}

export interface JoeInfo {
  version: string;
  ha_version: string;
  energy: {
    available: boolean;
    configured?: boolean;
    sources?: Record<string, number>;
    devices?: number;
  };
}
