import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import "../components/choice";
import { tip } from "../components/tip";
import { pickEntity, saveConfig, suggestions } from "../config";
import { define } from "../define";
import { entityName, formatState } from "../entities";
import type { Translate } from "../i18n";
import { shared } from "../styles/shared";
import type { Discovery, HomeAssistant, JoeConfig, TariffConfig, TariffKind } from "../types";

/** Every field of the form (all saved together). */
const FIELDS: (keyof TariffConfig)[] = [
  "kind",
  "price_entity",
  "window",
  "night_price",
  "day_price",
  "feed_in_price",
  "feed_in_entity",
  "surcharge",
];

/** Changes to the tariff, saved together. */
export function tariffChanges(before: TariffConfig, after: TariffConfig): Partial<TariffConfig> {
  const changes: Partial<TariffConfig> = {};
  for (const field of FIELDS) {
    if (JSON.stringify(before[field] ?? null) !== JSON.stringify(after[field] ?? null)) {
      (changes as Record<string, unknown>)[field] = after[field] ?? null;
    }
  }
  return changes;
}

/** The patch for a changed tariff (a new kind also answers the setup question), or null without changes. */
export function tariffPatch(before: TariffConfig, after: TariffConfig): Record<string, unknown> | null {
  const changes = tariffChanges(before, after);
  if (!Object.keys(changes).length) {
    return null;
  }
  const patch: Record<string, unknown> = { tariff: changes };
  if ("kind" in changes) {
    patch.answers = { tariff: after.kind };
  }
  return patch;
}

/**
 * The tariff as Joe asks for it: what kind, when it is cheap and what it costs.
 * Emits "joe-tariff" with the changed fields after every change.
 */
export class JoeTariffForm extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) tariff?: TariffConfig;
  @property({ attribute: false }) discovery?: Discovery;
  /** Also ask for the feed-in price. */
  @property({ type: Boolean }) feedIn = false;
  /** The question above already says what the first choice is about. */
  @property({ type: Boolean }) asQuestion = false;

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      .field:first-child {
        margin-top: 0;
      }
      .time {
        width: 130px;
      }
      .price {
        display: grid;
        gap: 4px;
        font-size: 13.5px;
        color: var(--joe-ink-2);
        font-weight: 600;
      }
      .entity {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        padding: 8px 12px;
        border-radius: 10px;
        background: var(--joe-surface-2);
      }
      .entity b {
        font-weight: 600;
      }
      .entity small {
        color: var(--joe-muted);
      }
    `,
  ];

  protected render() {
    const { t, tariff } = this;
    if (!t || !tariff) {
      return nothing;
    }
    const kinds: { value: TariffKind; label: string; icon: string }[] = [
      { value: "fixed_window", label: t("tariff.kind.fixed_window"), icon: "mdi:weather-night" },
      { value: "flat", label: t("tariff.kind.flat"), icon: "mdi:equal-box" },
      { value: "dynamic", label: t("tariff.kind.dynamic"), icon: "mdi:chart-line" },
    ];
    const choice = html`<joe-choice
      .options=${kinds}
      .value=${tariff.kind === "unknown" ? [] : [tariff.kind]}
      idk=${t("ask.idk")}
      label=${t("f.tariff.kind")}
      @joe-choice=${(ev: CustomEvent<{ value: string[] }>) =>
        this.emit({ kind: (ev.detail.value[0] as TariffKind | undefined) ?? "unknown" })}
    ></joe-choice>`;
    return html`${this.asQuestion
        ? choice
        : html`<div class="field" data-tipped>
            <div class="field-label">${t("f.tariff.kind")} ${tip(t, "q_tariff")}</div>
            ${choice}
          </div>`}
      ${tariff.kind === "fixed_window" ? this.renderWindow(t, tariff) : nothing}
      ${tariff.kind === "flat" ? this.renderFlat(t, tariff) : nothing}
      ${tariff.kind === "dynamic" ? this.renderDynamic(t, tariff) : nothing}
      ${this.feedIn ? this.renderFeedIn(t, tariff) : nothing}`;
  }

  private renderWindow(t: Translate, tariff: TariffConfig) {
    const window = tariff.window ?? { start: "", end: "" };
    const setTime = (part: "start" | "end", value: string) => {
      const next = { ...window, [part]: value };
      this.emit({ window: next.start && next.end ? next : null });
    };
    return html`<div class="field" data-tipped>
        <div class="field-label">${t("f.window")} ${tip(t, "f_window")}</div>
        <div class="field-row">
          <input
            class="input time"
            type="time"
            aria-label=${t("f.window.start")}
            .value=${window.start}
            @change=${(ev: Event) => setTime("start", (ev.target as HTMLInputElement).value)}
          />
          <span>${t("f.window.until")}</span>
          <input
            class="input time"
            type="time"
            aria-label=${t("f.window.end")}
            .value=${window.end}
            @change=${(ev: Event) => setTime("end", (ev.target as HTMLInputElement).value)}
          />
        </div>
      </div>
      <div class="field" data-tipped>
        <div class="field-label">${t("f.prices")} ${tip(t, "f_prices")}</div>
        <div class="field-row">
          <label class="price">${t("f.price.night")} ${this.centInput(t, tariff.night_price, "night_price")}</label>
          <label class="price">${t("f.price.day")} ${this.centInput(t, tariff.day_price, "day_price")}</label>
        </div>
      </div>`;
  }

  private renderFlat(t: Translate, tariff: TariffConfig) {
    return html`<div class="field" data-tipped>
      <div class="field-label">${t("f.price")} ${tip(t, "f_prices")}</div>
      ${this.centInput(t, tariff.day_price, "day_price")}
    </div>`;
  }

  private renderDynamic(t: Translate, tariff: TariffConfig) {
    const hass = this.hass;
    const entity = tariff.price_entity;
    // For a dynamic tariff the window is the span Joe searches (20:00–07:00 by default).
    const window = tariff.window ?? { start: "20:00", end: "07:00" };
    const setTime = (part: "start" | "end", value: string) => {
      const next = { ...window, [part]: value };
      this.emit({ window: next.start && next.end ? next : null });
    };
    return html`<div class="field" data-tipped>
        <div class="field-label">${t("f.price_entity")} ${tip(t, "f_price_entity")}</div>
        <div class="entity">
          ${entity && hass
            ? html`<span><b>${entityName(hass, entity)}</b> <small>${formatState(hass, entity, t.lang)}</small></span>`
            : html`<small>${t("f.price_entity.none")}</small>`}
          <button type="button" class="mini-btn" @click=${this.pickPrice}>
            <ha-icon icon="mdi:magnify"></ha-icon>${t(entity ? "review.change" : "review.choose")}
          </button>
        </div>
      </div>
      <div class="field" data-tipped>
        <div class="field-label">${t("f.search")} ${tip(t, "f_search")}</div>
        <div class="field-row">
          <input
            class="input time"
            type="time"
            aria-label=${t("f.search.start")}
            .value=${window.start}
            @change=${(ev: Event) => setTime("start", (ev.target as HTMLInputElement).value)}
          />
          <span>${t("f.window.until")}</span>
          <input
            class="input time"
            type="time"
            aria-label=${t("f.search.end")}
            .value=${window.end}
            @change=${(ev: Event) => setTime("end", (ev.target as HTMLInputElement).value)}
          />
        </div>
      </div>
      <div class="field" data-tipped>
        <div class="field-label">${t("f.surcharge")} ${tip(t, "f_surcharge")}</div>
        ${this.centInput(t, tariff.surcharge, "surcharge")}
      </div>`;
  }

  private renderFeedIn(t: Translate, tariff: TariffConfig) {
    const hass = this.hass;
    return html`<div class="field" data-tipped>
      <div class="field-label">${t("f.feed_in")} ${tip(t, "q_feed_in")}</div>
      ${tariff.feed_in_entity && hass
        ? html`<p class="field-hint">
            ${t("f.feed_in.entity", { name: entityName(hass, tariff.feed_in_entity) })}
          </p>`
        : this.centInput(t, tariff.feed_in_price, "feed_in_price")}
    </div>`;
  }

  private centInput(
    t: Translate,
    price: number | null,
    field: "night_price" | "day_price" | "feed_in_price" | "surcharge",
  ) {
    return html`<span class="unit-input">
      <input
        class="input"
        type="number"
        inputmode="decimal"
        min="0"
        max="999"
        step="0.01"
        placeholder=${t("f.price.unknown")}
        .value=${price == null ? "" : String(Math.round(price * 1e6) / 1e4)}
        @change=${(ev: Event) => {
          const raw = (ev.target as HTMLInputElement).value;
          const value = raw === "" ? null : Number.parseFloat(raw);
          this.emit({ [field]: value === null || Number.isNaN(value) ? null : Math.round(value * 100) / 10000 });
        }}
      />
      <span class="unit">ct/kWh</span>
    </span>`;
  }

  private async pickPrice(): Promise<void> {
    const { t, tariff } = this;
    if (!t || !tariff) {
      return;
    }
    const found = this.discovery?.tariff;
    const picked = await pickEntity(this, {
      heading: t("pick.price.title"),
      tip: "pick_price",
      filter: "price",
      selected: tariff.price_entity ? [tariff.price_entity] : [],
      suggestions: suggestions(
        found?.price_entity ? [{ entity_id: found.price_entity, confidence: found.confidence, reasons: found.reasons }] : [],
      ),
    });
    const entity = picked?.selected[0];
    if (entity) {
      this.emit({ price_entity: entity });
    }
  }

  private emit(change: Partial<TariffConfig>): void {
    this.dispatchEvent(new CustomEvent("joe-tariff", { detail: change, bubbles: true, composed: true }));
  }
}

define("joe-tariff-form", JoeTariffForm);

/** A draft kept while the page is closed (Geräte › Netz & Sonne), as long as the panel is open. */
let kept: { base: string; draft: TariffConfig } | undefined;

/**
 * The tariff form with a draft: the fields depend on each other, so nothing is
 * saved before "Speichern". "Verwerfen" goes back to the saved tariff.
 * With `keep` the draft outlives the element (a page); in a sheet
 * (`closable`) both buttons also close it ("joe-close").
 */
export class JoeTariffDraft extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) config?: JoeConfig;
  @property({ attribute: false }) discovery?: Discovery;
  /** In a sheet: Speichern and Abbrechen are always there and close it. */
  @property({ type: Boolean }) closable = false;
  /** Keep an unsaved draft while the element is gone (one page per panel). */
  @property({ type: Boolean }) keep = false;

  @state() private draft?: TariffConfig;
  @state() private saving = false;
  /** The saved tariff the draft started from (JSON). */
  private base = "";

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      .actions {
        margin-top: 18px;
      }
      .unsaved {
        margin: 14px 0 0;
        font-size: 13.5px;
        color: var(--joe-ink-2);
        font-weight: 600;
      }
    `,
  ];

  protected willUpdate(changed: PropertyValues<this>): void {
    const tariff = this.config?.tariff;
    if (!changed.has("config") || !tariff) {
      return;
    }
    const saved = JSON.stringify(tariff);
    if (!this.draft && this.keep && kept) {
      // Back on the page: the unsaved draft is still there.
      this.base = kept.base;
      this.draft = kept.draft;
    }
    if (!this.draft) {
      this.base = saved;
      this.draft = structuredClone(tariff);
    } else if (saved !== this.base) {
      // Saved elsewhere or just now: follow the saved tariff, keeping only the fields changed here.
      this.draft = { ...structuredClone(tariff), ...this.changes };
      this.base = saved;
      if (this.keep) {
        kept = this.dirty ? { base: this.base, draft: this.draft } : undefined;
      }
    }
  }

  /** The fields changed here: the draft against the tariff it started from. */
  private get changes(): Partial<TariffConfig> {
    return this.draft && this.base ? tariffChanges(JSON.parse(this.base) as TariffConfig, this.draft) : {};
  }

  /** The draft has changes of its own. */
  private get dirty(): boolean {
    return Object.keys(this.changes).length > 0;
  }

  protected render() {
    const { t, draft } = this;
    if (!t || !draft) {
      return nothing;
    }
    const dirty = this.dirty;
    return html`<joe-tariff-form
        .hass=${this.hass}
        .t=${t}
        .tariff=${draft}
        .discovery=${this.discovery}
        feedIn
        @joe-tariff=${(ev: CustomEvent<Partial<TariffConfig>>) => {
          ev.stopPropagation();
          this.change({ ...draft, ...ev.detail });
        }}
      ></joe-tariff-form>
      ${dirty && !this.closable ? html`<p class="unsaved" role="status">${t("grid.tariff.unsaved")}</p>` : nothing}
      ${dirty || this.closable
        ? html`<div class="actions" data-notip>
            <button type="button" class="btn btn-primary" ?disabled=${this.saving || (!dirty && !this.closable)} @click=${this.save}>
              ${t("common.save")}
            </button>
            <button type="button" class="btn btn-ghost" @click=${this.discard}>
              ${t(this.closable ? "common.cancel" : "grid.tariff.discard")}
            </button>
          </div>`
        : nothing}`;
  }

  private change(next: TariffConfig): void {
    this.draft = next;
    if (this.keep) {
      kept = this.dirty ? { base: this.base, draft: next } : undefined;
    }
  }

  private async save(): Promise<void> {
    const { config, draft } = this;
    if (!config || !draft) {
      return;
    }
    // Only the fields changed here, where they differ from the tariff as saved now.
    const next = { ...config.tariff, ...this.changes };
    const patch = tariffPatch(config.tariff, next);
    if (patch) {
      this.saving = true;
      const ok = await saveConfig(this, patch);
      this.saving = false;
      if (!ok) {
        return;
      }
      // The saved tariff arrives with the next state; until then the draft is it.
      this.base = JSON.stringify(next);
      this.draft = next;
    }
    if (this.keep) {
      kept = undefined;
    }
    this.finish();
  }

  private discard(): void {
    if (this.config) {
      this.base = JSON.stringify(this.config.tariff);
      this.draft = structuredClone(this.config.tariff);
    }
    if (this.keep) {
      kept = undefined;
    }
    this.finish();
  }

  private finish(): void {
    if (this.closable) {
      this.dispatchEvent(new CustomEvent("joe-close", { bubbles: true, composed: true }));
    }
  }
}

define("joe-tariff-draft", JoeTariffDraft);
