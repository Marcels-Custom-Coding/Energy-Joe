import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { tip } from "../../components/tip";
import { define } from "../../define";
import type { Translate, TranslationKey } from "../../i18n";
import { PANEL, href, navigate, onLink, type Route } from "../../router";
import { shared } from "../../styles/shared";
import type { JoeState } from "../../types";

/** One place in the panel and the words people look for it by (also its old names). */
interface SignpostEntry {
  id: string;
  to: Route;
  /** The title, when it is not signpost.<id> (the rules keep their own names). */
  title?: TranslationKey;
}

/**
 * The map of all addresses: every place a setting or a view lives, with the
 * words of signpost.<id>.terms (old names like Historie, Lernen, Für Profis
 * included). New places get an entry here; tests walk this list.
 */
export const SIGNPOST = [
  // Time: now, tonight, what was.
  { id: "overview", to: { tab: "overview" } },
  { id: "plan", to: { tab: "plan" } },
  { id: "steer", to: { tab: "plan" } },
  { id: "result", to: { tab: "review", section: "result" } },
  { id: "days", to: { tab: "review", section: "days" } },
  { id: "learned", to: { tab: "review", section: "learned" } },
  { id: "learned_reset", to: { tab: "review", section: "learned", id: "reset" } },
  { id: "log", to: { tab: "review", section: "log" } },
  // Things: devices.
  { id: "devices", to: { tab: "devices", section: "all" } },
  { id: "add", to: { tab: "devices", section: "add" } },
  { id: "battery", to: { tab: "devices", section: "battery" } },
  { id: "climate", to: { tab: "devices", section: "climate" } },
  { id: "car", to: { tab: "devices", section: "car" } },
  { id: "hot_water", to: { tab: "devices", section: "hot_water" } },
  { id: "other", to: { tab: "devices", section: "other" } },
  { id: "energy", to: { tab: "devices", section: "grid" } },
  { id: "connection", to: { tab: "devices", section: "grid", id: "connection" } },
  { id: "tariff", to: { tab: "devices", section: "grid", id: "tariff" } },
  { id: "solar", to: { tab: "devices", section: "grid", id: "solar" } },
  { id: "home", to: { tab: "devices", section: "grid", id: "home" } },
  // Things: the household.
  { id: "people", to: { tab: "household", section: "people" } },
  { id: "presence", to: { tab: "household", section: "presence" } },
  { id: "guest", to: { tab: "household", section: "presence" } },
  { id: "way", to: { tab: "household", section: "presence", id: "way" } },
  { id: "calendar", to: { tab: "household", section: "days" } },
  { id: "night", to: { tab: "household", section: "night" } },
  { id: "travel", to: { tab: "household", section: "travel" } },
  // Joe himself.
  { id: "mode", to: { tab: "settings", section: "operation" } },
  { id: "grid_friendly", to: { tab: "settings", section: "operation", id: "grid_friendly" } },
  { id: "rules", to: { tab: "settings", section: "rules" } },
  { id: "rule_reserve_soc", to: { tab: "settings", section: "rules", id: "reserve_soc" }, title: "rule.reserve_soc" },
  { id: "rule_max_target_soc", to: { tab: "settings", section: "rules", id: "max_target_soc" }, title: "rule.max_target_soc" },
  { id: "rule_evening_min_soc", to: { tab: "settings", section: "rules", id: "evening_min_soc" }, title: "rule.evening_min_soc" },
  { id: "rule_balance_days", to: { tab: "settings", section: "rules", id: "balance_days" }, title: "rule.balance_days" },
  {
    id: "rule_discharge_in_window",
    to: { tab: "settings", section: "rules", id: "discharge_in_window" },
    title: "rule.discharge_in_window",
  },
  { id: "rule_converter_losses", to: { tab: "settings", section: "rules", id: "converter_losses" }, title: "rule.converter_losses" },
  { id: "rule_grid_limit_w", to: { tab: "settings", section: "rules", id: "grid_limit_w" }, title: "rule.grid_limit_w" },
  { id: "rule_max_night_kwh", to: { tab: "settings", section: "rules", id: "max_night_kwh" }, title: "rule.max_night_kwh" },
  { id: "rule_guard_grid", to: { tab: "settings", section: "rules", id: "guard_grid" }, title: "rule.guard_grid" },
  { id: "rule_max_price", to: { tab: "settings", section: "rules", id: "max_price" }, title: "rule.max_price" },
  { id: "rule_min_saving", to: { tab: "settings", section: "rules", id: "min_saving" }, title: "rule.min_saving" },
  { id: "rule_priority", to: { tab: "settings", section: "rules", id: "priority" }, title: "rule.priority" },
  { id: "rule_buffer_factor", to: { tab: "settings", section: "rules", id: "buffer_factor" }, title: "rule.buffer_factor" },
  { id: "rule_plan_offset_min", to: { tab: "settings", section: "rules", id: "plan_offset_min" }, title: "rule.plan_offset_min" },
  { id: "rule_reset_lead_min", to: { tab: "settings", section: "rules", id: "reset_lead_min" }, title: "rule.reset_lead_min" },
  { id: "notify", to: { tab: "settings", section: "notify" } },
  { id: "ask_time", to: { tab: "settings", section: "notify", id: "ask_time" }, title: "settings.ask_time" },
  { id: "observe", to: { tab: "settings", section: "maintenance", id: "observe" } },
  { id: "backup", to: { tab: "settings", section: "maintenance", id: "backup" } },
  { id: "setup", to: { tab: "settings", section: "maintenance", id: "setup" } },
  { id: "diagnostics", to: { tab: "settings", section: "maintenance", id: "diagnostics" } },
  { id: "about", to: { tab: "settings", section: "about" } },
  { id: "entities", to: { tab: "settings", section: "about", id: "entities" } },
  { id: "cards", to: { tab: "settings", section: "about", id: "cards" } },
] as const satisfies readonly SignpostEntry[];

export type SignpostId = (typeof SIGNPOST)[number]["id"];

/** How many hits are listed before "… more". */
const SHOWN = 8;

/**
 * Lower case without accents and hyphens, so "uber" and "ueber" find "Über",
 * "strasse" finds "Straße" and "nachtaktion" or "Eauto" find "Nacht-Aktion"
 * and "E-Auto". Query and places are folded alike.
 */
function fold(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .replace(/([aou])e/g, "$1")
    .replace(/[-\u2010\u2011]/g, "");
}

interface Hit {
  entry: (typeof SIGNPOST)[number];
  title: string;
  /** The word it was found by, when that is not the title ("Historie"). */
  term?: string;
  where: string;
  score: number;
}

/**
 * Wegweiser "Suchst du …?" on top of Einstellungen: a search over all places
 * of the panel, old names included; the hits are links to the addresses.
 */
export class JoeSignpost extends LitElement {
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;
  @property({ attribute: false }) route?: Route;
  @property({ attribute: false }) prefix = PANEL;

  @state() private query = "";

  static styles = [
    shared,
    css`
      :host {
        display: block;
        margin-top: 14px;
      }
      .signpost {
        background: var(--joe-surface);
        border-radius: 14px;
        box-shadow: inset 0 0 0 1px var(--joe-line);
        padding: 12px 18px 14px;
      }
      .sp-head {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }
      .sp-head label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 700;
      }
      .sp-head ha-icon {
        --mdc-icon-size: 20px;
        color: var(--joe-ink-2);
      }
      .input {
        max-width: 520px;
      }
      .hits {
        list-style: none;
        margin: 10px 0 0;
        padding: 0;
        display: grid;
        gap: 4px;
      }
      a.hit {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 44px;
        padding: 6px 10px;
        border-radius: 10px;
        text-decoration: none;
        color: var(--joe-ink);
        background: var(--joe-surface-2);
      }
      a.hit:hover,
      a.hit:focus-visible {
        background: var(--joe-line);
      }
      .hit-text {
        flex: 1;
        min-width: 0;
      }
      .hit-title {
        display: block;
        font-weight: 700;
        overflow-wrap: anywhere;
      }
      .hit-where {
        display: block;
        font-size: 13px;
        color: var(--joe-muted);
        overflow-wrap: anywhere;
      }
      .hit ha-icon {
        --mdc-icon-size: 18px;
        color: var(--joe-ink-2);
        flex: none;
      }
      .sp-status {
        margin: 8px 0 0;
        font-size: 13.5px;
        color: var(--joe-muted);
      }
      @media (max-width: 600px) {
        .signpost {
          padding: 12px 14px 14px;
        }
      }
    `,
  ];

  protected render() {
    const t = this.t;
    if (!t) {
      return nothing;
    }
    const hits = this.search(t);
    const asked = this.query.trim() !== "";
    return html`<section class="signpost" data-tipped role="search">
      <div class="sp-head">
        <label for="signpost-q"><ha-icon icon="mdi:sign-direction"></ha-icon>${t("signpost.title")}</label>${tip(t, "signpost")}
      </div>
      <input
        id="signpost-q"
        class="input"
        type="search"
        autocomplete="off"
        enterkeyhint="go"
        placeholder=${t("signpost.placeholder")}
        .value=${this.query}
        @input=${(ev: Event) => (this.query = (ev.target as HTMLInputElement).value)}
        @keydown=${(ev: KeyboardEvent) => {
          if (ev.key === "Enter" && hits[0]) {
            ev.preventDefault();
            this.go(hits[0].entry.to);
          } else if (ev.key === "Escape") {
            this.query = "";
          }
        }}
      />
      ${asked && hits.length
        ? html`<ul class="hits">
            ${hits.slice(0, SHOWN).map((hit) => html`<li>${this.hitLink(hit)}</li>`)}
          </ul>`
        : nothing}
      <p class="sp-status" aria-live="polite" ?hidden=${!asked || (hits.length > 0 && hits.length <= SHOWN)}>
        ${!asked ? "" : hits.length ? t("signpost.more", { count: hits.length - SHOWN }) : t("signpost.none")}
      </p>
    </section>`;
  }

  private hitLink(hit: Hit): TemplateResult {
    const to = hit.entry.to;
    return html`<a
      class="hit"
      href=${href(this.prefix, to)}
      @click=${(ev: MouseEvent) => {
        onLink(to)(ev);
        if (ev.defaultPrevented) {
          this.query = "";
        }
      }}
    >
      <span class="hit-text">
        <span class="hit-title">${hit.term ? `${hit.term} → ${hit.title}` : hit.title}</span>
        <span class="hit-where">${hit.where}</span>
      </span>
      <ha-icon icon="mdi:arrow-right"></ha-icon>
    </a>`;
  }

  private go(to: Route): void {
    this.query = "";
    navigate(this, to);
  }

  /** The places whose title, words or address hold every word of the query; best matches first. */
  private search(t: Translate): Hit[] {
    const words = fold(this.query).split(/\s+/).filter(Boolean);
    if (!words.length) {
      return [];
    }
    const hits: Hit[] = [];
    SIGNPOST.forEach((entry, order) => {
      const title = t("title" in entry ? entry.title : (`signpost.${entry.id}` as const));
      const terms = t(`signpost.${entry.id}.terms`)
        .split(",")
        .map((term) => term.trim())
        .filter(Boolean);
      const where = whereText(t, entry.to, title);
      const haystack = fold([title, ...terms, where].join(" | "));
      if (!words.every((word) => haystack.includes(word))) {
        return;
      }
      // Best first: the title itself, an old name typed in full ("Climate", "Mode"), the start of the
      // title, the title containing it, the start of a word, a word containing it; then list order.
      const phrase = words.join(" ");
      const folded = fold(title);
      const exact = terms.find((x) => fold(x) === phrase);
      let score = folded === phrase ? 0 : exact ? 1 : folded.startsWith(phrase) ? 2 : folded.includes(phrase) ? 3 : 6;
      let term: string | undefined = score === 1 ? exact : undefined;
      if (score > 3) {
        const found = terms.find((x) => fold(x).startsWith(phrase)) ?? terms.find((x) => fold(x).includes(phrase));
        if (found) {
          term = found;
          score = fold(found).startsWith(phrase) ? 4 : 5;
        }
      }
      hits.push({ entry, title, term, where, score: score * 100 + order });
    });
    return hits.sort((a, b) => a.score - b.score);
  }
}

/** "Geräte › Netz & Sonne" for an address (the title is added for a part inside a section). */
function whereText(t: Translate, to: Route, title: string): string {
  const parts = [t(`tab.${to.tab}`)];
  if (to.section) {
    const section = t.optional(`nav.${to.tab}.${to.section}`);
    if (section) {
      parts.push(section);
    }
  }
  if (to.id && fold(parts[parts.length - 1]) !== fold(title)) {
    parts.push(title);
  }
  return parts.join(" › ");
}

define("joe-signpost", JoeSignpost);
