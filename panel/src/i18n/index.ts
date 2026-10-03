import { de, type Key } from "./de";
import { en } from "./en";

export type TranslationKey = Key;
type Vars = Record<string, string | number>;

/** Names of all tooltips: every "tip.<name>.title" needs a "tip.<name>.text". */
export type TipName = { [K in Key]: K extends `tip.${infer N}.title` ? N : never }[Key];

export interface Translate {
  (key: Key, vars?: Vars): string;
  /** Text for a key built at runtime (e.g. from a reason code); undefined if unknown. */
  optional(key: string, vars?: Vars): string | undefined;
  /** Home Assistant's language, for number and date formatting. */
  readonly lang: string;
}

const cache = new Map<string, Translate>();

function fill(text: string, vars?: Vars): string {
  return text.replace(/\{(\w+)\}/g, (_, name: string) => String(vars?.[name] ?? ""));
}

export function translator(language: string | undefined): Translate {
  const lang = language || "en";
  const cached = cache.get(lang);
  if (cached) {
    return cached;
  }
  const dict: Record<string, string> = lang.startsWith("de") ? de : en;
  const t = ((key: Key, vars?: Vars) => fill(dict[key], vars)) as Translate;
  t.optional = (key, vars) => (key in dict ? fill(dict[key], vars) : undefined);
  Object.defineProperty(t, "lang", { value: lang });
  cache.set(lang, t);
  return t;
}

/** Looks up a key built at runtime (e.g. from a reason code); undefined if unknown. */
export function lookup(language: string | undefined, key: string, vars?: Vars): string | undefined {
  return translator(language).optional(key, vars);
}

/**
 * Splits a title like "Ich bin |Joe." into its parts. The last part is shown
 * in Joe's amber, earlier parts in ink; a part ending in "!" gets its own line.
 */
export function titleParts(title: string): string[] {
  return title.split("|");
}
