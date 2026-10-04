/** The panel's version, baked in at build time (see vite.config.ts). */
declare const __JOE_VERSION__: string;
export const VERSION: string = typeof __JOE_VERSION__ === "string" ? __JOE_VERSION__ : "dev";

type Versioned = CustomElementConstructor & { joeVersion?: string };

/**
 * Defines a custom element once. After an update HA loads the new bundle into
 * the same page, but a tag that already exists keeps its old class – the page
 * then runs the old panel against the new integration. That is noticed here
 * and the user is asked to reload.
 */
export function define(name: string, element: CustomElementConstructor): void {
  const existing = customElements.get(name) as Versioned | undefined;
  if (!existing) {
    (element as Versioned).joeVersion = VERSION;
    customElements.define(name, element);
    return;
  }
  if (existing.joeVersion !== VERSION) {
    showReload();
  }
}

let shown = false;

/** A note above everything (outside the old panel, which cannot be trusted). */
function showReload(): void {
  if (shown || typeof document === "undefined") {
    return;
  }
  shown = true;
  const german = (document.documentElement.lang || navigator.language || "").toLowerCase().startsWith("de");
  const box = document.createElement("div");
  box.setAttribute("role", "alert");
  box.style.cssText = [
    "position:fixed",
    "left:50%",
    "bottom:24px",
    "transform:translateX(-50%)",
    "z-index:2147483647",
    "display:flex",
    "flex-wrap:wrap",
    "align-items:center",
    "gap:10px 14px",
    "max-width:min(560px, calc(100vw - 32px))",
    "padding:14px 16px",
    "border-radius:14px",
    "background:#071118",
    "color:#fff",
    "box-shadow:0 10px 30px rgba(0,0,0,.35)",
    "font:500 15px/1.4 system-ui, sans-serif",
  ].join(";");
  const text = document.createElement("span");
  text.style.cssText = "flex:1 1 240px";
  text.textContent = german
    ? "Energy Joe wurde aktualisiert. Lade die Seite neu, damit du die neue Version siehst."
    : "Energy Joe was updated. Reload the page to see the new version.";
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = german ? "Neu laden" : "Reload";
  button.style.cssText =
    "min-height:44px;padding:0 18px;border:0;border-radius:10px;background:#fea707;color:#071118;font:700 15px system-ui, sans-serif;cursor:pointer";
  button.addEventListener("click", () => location.reload());
  box.append(text, button);
  const add = () => document.body?.append(box);
  if (document.body) {
    add();
  } else {
    addEventListener("DOMContentLoaded", add, { once: true });
  }
}
