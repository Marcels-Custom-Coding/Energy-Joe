import { html, type TemplateResult } from "lit";

// Addresses inside the panel: /<tab>/<section>/<id>/<sub>/<rest…> after the
// panel prefix. Every page, section and device gets its own address, so the
// back button, jumps, dashboard cards and notifications land in one place.

/** Where the backend registers the panel (const.py PANEL_URL_PATH); the dashboard cards link here. */
export const PANEL = "/energy-joe";

export type Tab = "overview" | "plan" | "review" | "devices" | "household" | "settings";
/** Order of the tabs in the header. */
export const TABS: readonly Tab[] = ["overview", "plan", "review", "devices", "household", "settings"];
/** Tabs about time (left of the gap); the others are about things. */
export const TIME_TABS: readonly Tab[] = ["overview", "plan", "review"];

export type ReviewSection = "result" | "days" | "learned" | "log";
/** The kinds of devices (one chip each) plus the "+ Hinzufügen" assistant (a sheet, no chip). */
export type DevicesSection = "all" | "battery" | "climate" | "car" | "hot_water" | "other" | "grid" | "add";
export type HouseholdSection = "people" | "presence" | "days" | "night" | "travel";
export type SettingsSection = "operation" | "rules" | "notify" | "maintenance" | "about";
export type SectionTab = "review" | "devices" | "household" | "settings";

/** The sections of each tab; the first one is shown when the address names none. */
export const SECTIONS: {
  review: readonly ReviewSection[];
  devices: readonly DevicesSection[];
  household: readonly HouseholdSection[];
  settings: readonly SettingsSection[];
} = {
  review: ["result", "days", "learned", "log"],
  devices: ["all", "battery", "climate", "car", "hot_water", "other", "grid", "add"],
  household: ["people", "presence", "days", "night", "travel"],
  settings: ["operation", "rules", "notify", "maintenance", "about"],
};

/** The section a tab shows when the address names none. */
export const DEFAULT_SECTION: Record<SectionTab, string> = {
  review: "result",
  devices: "all",
  household: "people",
  settings: "operation",
};

export interface Route {
  tab: Tab;
  /** Always set for tabs with sections (the default when the address names none). */
  section?: string;
  /** A device, day, person or anchor inside the section. */
  id?: string;
  /** Below the id, e.g. an addressed sheet ("week") or a log filter's device. */
  sub?: string;
  rest?: string[];
}

/** Old addresses and where they live now. */
const LEGACY: Record<string, string> = {
  history: "/review/days",
  learn: "/review/learned",
  climate: "/devices/climate",
};

function hasSections(tab: Tab): tab is SectionTab {
  return tab in SECTIONS;
}

function decode(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

/** Reads a path after the prefix ("/devices/climate/climate.wz"). Old or unknown addresses come with a redirect. */
export function parse(path: string): { route: Route; redirect?: string } {
  const segments = path.split(/[?#]/, 1)[0].split("/").filter(Boolean).map(decode);
  const [first, section, id, sub, ...rest] = segments;
  if (!first) {
    return { route: { tab: "overview" } };
  }
  const legacy = LEGACY[first];
  if (legacy) {
    // A day or anchor below the old address comes along (/history/2026-10-01 → /review/days/2026-10-01).
    const target = [legacy, ...segments.slice(1).map(encodeURIComponent)].join("/");
    return { route: parse(target).route, redirect: target };
  }
  if (first === "plan") {
    return segments.length > 1 ? { route: { tab: "plan" }, redirect: "/plan" } : { route: { tab: "plan" } };
  }
  const tab = first as Tab;
  if (!TABS.includes(tab) || !hasSections(tab)) {
    return { route: { tab: "overview" }, redirect: "/" };
  }
  if (section && !(SECTIONS[tab] as readonly string[]).includes(section)) {
    return { route: { tab, section: DEFAULT_SECTION[tab] }, redirect: `/${tab}` };
  }
  const route: Route = { tab, section: section ?? DEFAULT_SECTION[tab] };
  if (id) route.id = id;
  if (sub) route.sub = sub;
  if (rest.length) route.rest = rest;
  return { route };
}

/** The path of a route after the prefix ("/" for the overview). */
export function format(to: Route | string): string {
  if (typeof to === "string") {
    return to.startsWith("/") ? to : `/${to}`;
  }
  if (to.tab === "overview") {
    return "/";
  }
  const parts: string[] = [to.tab];
  const section = to.section ?? (to.id && hasSections(to.tab) ? DEFAULT_SECTION[to.tab] : undefined);
  if (section) {
    parts.push(section);
    if (to.id) {
      parts.push(to.id);
      if (to.sub) {
        parts.push(to.sub, ...(to.rest ?? []));
      }
    }
  }
  return `/${parts.map(encodeURIComponent).join("/")}`;
}

/** The full address for an href ("/energy-joe/plan"; the overview is the prefix itself). */
export function href(prefix: string, to: Route | string): string {
  const path = format(to);
  return path === "/" ? prefix : `${prefix}${path}`;
}

export interface NavigateOptions {
  /** Replace the current history entry instead of adding one. */
  replace?: boolean;
  /** The address opens a sheet; back closes it (see closeSheet). */
  sheet?: boolean;
}

export interface NavigateDetail extends NavigateOptions {
  path: string;
}

/** Asks the panel to go to an address. */
export function navigate(from: EventTarget, to: Route | string, opts: NavigateOptions = {}): void {
  from.dispatchEvent(
    new CustomEvent<NavigateDetail>("joe-navigate", {
      detail: { path: format(to), ...opts },
      bubbles: true,
      composed: true,
    }),
  );
}

/** Click handler for an own <a href>: a middle or modified click keeps the browser's default (new tab). */
export function onLink(to: Route | string, opts?: NavigateOptions): (ev: MouseEvent) => void {
  return (ev: MouseEvent) => {
    if (ev.defaultPrevented || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey || ev.button !== 0) {
      return;
    }
    ev.preventDefault();
    navigate((ev.currentTarget as EventTarget | null) ?? window, to, opts);
  };
}

/** A real link to an address inside the panel. */
export function link(prefix: string, to: Route | string, label: TemplateResult | string, cls?: string): TemplateResult {
  return html`<a class=${cls ?? ""} href=${href(prefix, to)} @click=${onLink(to)}>${label}</a>`;
}

/** Closes an addressed sheet: back if it was opened by a jump, else replace it with its page. */
export function closeSheet(from: EventTarget, parent: Route | string): void {
  if ((history.state as { joeSheet?: boolean } | null)?.joeSheet) {
    history.back();
    return;
  }
  navigate(from, parent, { replace: true });
}

/**
 * Scrolls to [data-anchor="<id>"] inside a page and lights it up for 1.5 s.
 * Returns false while the target is not rendered yet (call again after loading).
 */
export function revealAnchor(root: ParentNode, id: string): boolean {
  const target = root.querySelector<HTMLElement>(`[data-anchor="${CSS.escape(id)}"]`);
  if (!target) {
    return false;
  }
  target.scrollIntoView({ block: "start", behavior: "smooth" });
  target.classList.remove("flash");
  // Restart the animation when the same anchor is opened again.
  void target.offsetWidth;
  target.classList.add("flash");
  window.setTimeout(() => target.classList.remove("flash"), 1500);
  settle(target);
  return true;
}

/**
 * Content above an anchor may still grow after the jump (pictures, late data, the header's height):
 * look again twice and put the target back under the header, unless the user has scrolled meanwhile.
 */
function settle(target: HTMLElement): void {
  let touched = false;
  const stop = () => {
    touched = true;
  };
  const events = ["wheel", "touchstart", "keydown", "pointerdown"];
  events.forEach((name) => window.addEventListener(name, stop, { passive: true, once: true }));
  const check = (last: boolean) => {
    const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    if (!touched && target.isConnected && Math.abs(target.getBoundingClientRect().top - margin) > 24) {
      target.scrollIntoView({ block: "start" });
    }
    if (last) {
      events.forEach((name) => window.removeEventListener(name, stop));
    }
  };
  window.setTimeout(() => check(false), 900);
  window.setTimeout(() => check(true), 2200);
}
