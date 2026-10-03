import { LitElement, css, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import "../components/choice";
import { tip } from "../components/tip";
import { pickEntity, suggestions } from "../config";
import { define } from "../define";
import { entityName, formatState } from "../entities";
import type { Translate } from "../i18n";
import { shared } from "../styles/shared";
import type { Discovery, HomeAssistant, TariffConfig, TariffKind } from "../types";

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

  private centInput(t: Translate, price: number | null, field: "night_price" | "day_price" | "feed_in_price") {
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
