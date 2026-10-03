import type { TipName } from "./i18n";
import type { FilterName } from "./entities";
import type { EntityRef, JoeConfig, Provenance, Reason } from "./types";

const TOKEN = /\[[^\]]*\]|[^.[]+/g;

/** "a.b[c].d" -> ["a.b[c].d", "a.b[c]", "a.b", "a"], nearest first (like model.py). */
function ancestors(path: string): string[] {
  const result: string[] = [];
  let current = "";
  for (const token of path.match(TOKEN) ?? []) {
    current = !current || token.startsWith("[") ? current + token : `${current}.${token}`;
    result.push(current);
  }
  return result.reverse();
}

/** Where a value came from: its own entry or the nearest parent's. */
export function sourceOf(config: JoeConfig, path: string): Provenance | undefined {
  for (const candidate of ancestors(path)) {
    const entry = config.provenance[candidate];
    if (entry) {
      return entry;
    }
  }
  return undefined;
}

export function isIgnored(config: JoeConfig, key: string): boolean {
  return config.answers.ignored.includes(key);
}

export function answer<T = string>(config: JoeConfig, key: string): T | undefined {
  return config.answers[key] as T | undefined;
}

/** The ignore list with one key added or removed. */
export function withIgnored(config: JoeConfig, key: string, ignored: boolean): string[] {
  const rest = config.answers.ignored.filter((item) => item !== key);
  return ignored ? [...rest, key] : rest;
}

export type ConfigPatch = Record<string, unknown>;

export type ChangeSource = "user" | "read" | "default";

export interface ConfigChange {
  patch: ConfigPatch;
  source?: ChangeSource;
  result?: Promise<boolean>;
}

/**
 * Asks the panel to store a change. The panel answers by setting "result";
 * it resolves to false if saving failed (the panel shows the error).
 */
export function saveConfig(from: HTMLElement, patch: ConfigPatch, source: ChangeSource = "user"): Promise<boolean> {
  const detail: ConfigChange = { patch, source };
  from.dispatchEvent(new CustomEvent("joe-config", { detail, bubbles: true, composed: true }));
  return detail.result ?? Promise.resolve(false);
}

// --- Entity picker requests (the panel shows the picker) ---

export interface Suggestion {
  entity_id: string;
  confidence?: number;
  reasons?: Reason[];
}

export interface PickRequest {
  heading: string;
  tip: TipName;
  filter: FilterName;
  selected: string[];
  multiple?: boolean;
  suggestions?: Suggestion[];
  /** For power readings: shows the "other way round" switch with a live preview. */
  measurement?: { invert: boolean; role: "grid" | "home" | "solar" | "battery" };
  exclude?: string[];
}

export interface PickResult {
  selected: string[];
  invert: boolean;
}

export interface PickEvent {
  request: PickRequest;
  resolve: (result: PickResult | null) => void;
}

export function pickEntity(from: HTMLElement, request: PickRequest): Promise<PickResult | null> {
  return new Promise((resolve) => {
    from.dispatchEvent(
      new CustomEvent<PickEvent>("joe-pick", { detail: { request, resolve }, bubbles: true, composed: true }),
    );
  });
}

/** Picker suggestions: Joe's best guesses first, then alternatives, without duplicates. */
export function suggestions(best: Suggestion[], others: { entity_id: string }[] = []): Suggestion[] {
  const seen = new Set<string>();
  const result: Suggestion[] = [];
  for (const item of [...best, ...others.map((other) => ({ entity_id: other.entity_id }))]) {
    if (!seen.has(item.entity_id)) {
      seen.add(item.entity_id);
      result.push(item);
    }
  }
  return result;
}

/** A finding as a suggestion with Joe's confidence and reasons. */
export function suggestion(found: { entity: EntityRef; confidence: number; reasons: Reason[] }): Suggestion {
  return { entity_id: found.entity.entity_id, confidence: found.confidence, reasons: found.reasons };
}
