import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import type { PickRequest, PickResult, Suggestion } from "../config";
import { define } from "../define";
import { entityName, entityPlace, fits, formatNumber, formatState, measurementKw } from "../entities";
import type { Translate } from "../i18n";
import { shared } from "../styles/shared";
import type { HomeAssistant } from "../types";
import { confidenceDots, displayTitle, reasonText } from "./bits";
import { tip } from "./tip";

const PAGE = 60;

/**
 * Joe's own entity picker: plain names, room and device, the live value,
 * a search and Joe's suggestions first. Emits "joe-picked" or "joe-close".
 */
export class JoeEntityPicker extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) request?: PickRequest;

  @state() private selected: string[] = [];
  @state() private invert = false;
  @state() private query = "";
  @state() private showAll = false;
  @state() private limit = PAGE;

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      .search {
        margin-top: 14px;
      }
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 4px;
      }
      .row {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        min-height: 52px;
        padding: 8px 10px;
        border: 0;
        border-radius: 10px;
        cursor: pointer;
        text-align: left;
        background: transparent;
        color: var(--joe-ink);
        transition: background 0.12s;
      }
      .row:hover {
        background: var(--joe-surface-2);
      }
      .row[aria-pressed="true"] {
        background: var(--joe-amber-soft);
        box-shadow: inset 0 0 0 2px var(--joe-amber);
      }
      .mark {
        width: 20px;
        height: 20px;
        flex: none;
        border-radius: 50%;
        box-shadow: inset 0 0 0 2px var(--joe-line-2);
        display: grid;
        place-items: center;
      }
      .mark.box {
        border-radius: 6px;
      }
      [aria-pressed="true"] .mark {
        background: var(--joe-amber);
        box-shadow: none;
        color: var(--joe-amber-ink);
      }
      .mark svg {
        width: 14px;
        height: 14px;
      }
      .txt {
        flex: 1;
        min-width: 0;
      }
      .txt b {
        display: block;
        font-weight: 600;
        line-height: 1.3;
        overflow-wrap: anywhere;
      }
      .txt small {
        display: block;
        font-size: 12.5px;
        color: var(--joe-muted);
        overflow-wrap: anywhere;
      }
      .txt small.why {
        color: var(--joe-amber-text);
      }
      .val {
        max-width: 100%;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        color: var(--joe-ink-2);
        font-size: 14px;
        text-align: right;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .end {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 4px;
        flex: none;
        max-width: 42%;
      }
      .empty {
        color: var(--joe-muted);
        margin: 8px 0;
      }
      .more {
        margin-top: 8px;
      }
      .line {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 14px;
        flex-wrap: wrap;
      }
      .line label {
        font-weight: 600;
        cursor: pointer;
      }
      .preview {
        margin-top: 10px;
      }
      .sticky {
        position: sticky;
        bottom: -22px;
        background: var(--joe-surface);
        padding: 12px 0 2px;
        margin-top: 12px;
        box-shadow: 0 -1px 0 var(--joe-line);
      }
      .sticky .actions {
        margin-top: 0;
      }
      @media (max-width: 600px) {
        .sticky {
          bottom: -20px;
        }
      }
    `,
  ];

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has("request") && this.request) {
      this.selected = [...this.request.selected];
      this.invert = this.request.measurement?.invert ?? false;
      this.query = "";
      this.showAll = false;
      this.limit = PAGE;
    }
  }

  protected render() {
    const { hass, t, request } = this;
    if (!hass || !t || !request) {
      return nothing;
    }
    const list = this.candidates(hass, request);
    const shown = list.slice(0, this.limit);
    const offered = this.query ? [] : (request.suggestions ?? []).filter((s) => hass.states[s.entity_id]);
    return html`<div data-tipped>
      <div class="sheet-title">${displayTitle(request.heading, "h2", tip(t, request.tip))}</div>
      <input
        class="input search"
        type="search"
        .value=${this.query}
        placeholder=${t("pick.search")}
        aria-label=${t("pick.search")}
        @input=${(ev: InputEvent) => {
          this.query = (ev.target as HTMLInputElement).value;
          this.limit = PAGE;
        }}
      />
      ${offered.length
        ? html`<div class="group-label">${t("pick.suggested")}</div>
            <ul>
              ${offered.map((s) => this.renderRow(hass, t, request, s.entity_id, s))}
            </ul>`
        : nothing}
      <div class="group-label">${t(this.showAll ? "pick.all" : "pick.fitting")} · ${list.length}</div>
      ${list.length
        ? html`<ul>
            ${shown.map((id) => this.renderRow(hass, t, request, id))}
          </ul>`
        : html`<p class="empty">${t("pick.empty")}</p>`}
      ${list.length > shown.length
        ? html`<button type="button" class="mini-btn more" data-notip @click=${() => (this.limit += PAGE)}>
            ${t("pick.more", { count: list.length - shown.length })}
          </button>`
        : nothing}
      <div class="line">
        <button
          type="button"
          id="all"
          class="switch"
          role="switch"
          aria-checked=${String(this.showAll)}
          aria-labelledby="all-label"
          @click=${() => {
            this.showAll = !this.showAll;
            this.limit = PAGE;
          }}
        ></button>
        <label id="all-label" for="all">${t("pick.show_all")}</label>
        ${tip(t, "pick_all")}
      </div>
      ${request.measurement ? this.renderInvert(hass, t, request) : nothing}
      <div class="sticky">
        <div class="actions">
          <button
            type="button"
            class="btn btn-primary"
            ?disabled=${!request.multiple && !this.selected.length}
            @click=${this.apply}
          >
            ${t("pick.apply")}
          </button>
          <button type="button" class="btn btn-ghost" data-notip @click=${this.cancel}>${t("common.cancel")}</button>
        </div>
      </div>
    </div>`;
  }

  private candidates(hass: HomeAssistant, request: PickRequest): string[] {
    const tokens = this.query.toLowerCase().split(/\s+/).filter(Boolean);
    const exclude = new Set(request.exclude ?? []);
    const result: { id: string; name: string }[] = [];
    for (const [id, entity] of Object.entries(hass.states)) {
      if (exclude.has(id)) {
        continue;
      }
      if (!this.showAll && (!fits(entity, request.filter) || hass.entities?.[id]?.hidden)) {
        continue;
      }
      const name = entityName(hass, id);
      if (tokens.length) {
        const text = `${name} ${id} ${entityPlace(hass, id)}`.toLowerCase();
        if (!tokens.every((token) => text.includes(token))) {
          continue;
        }
      }
      result.push({ id, name });
    }
    result.sort((a, b) => a.name.localeCompare(b.name, this.t?.lang));
    return result.map((item) => item.id);
  }

  private renderRow(
    hass: HomeAssistant,
    t: Translate,
    request: PickRequest,
    id: string,
    suggestion?: Suggestion,
  ): TemplateResult {
    const on = this.selected.includes(id);
    const place = entityPlace(hass, id);
    const why = suggestion?.reasons?.[0];
    return html`<li>
      <button type="button" class="row" aria-pressed=${String(on)} @click=${() => this.toggle(id)}>
        <span class="mark ${request.multiple ? "box" : ""}" aria-hidden="true">
          ${on
            ? html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>`
            : nothing}
        </span>
        <span class="txt">
          <b>${entityName(hass, id)}</b>
          <small>${place ? `${place} · ` : ""}${id}</small>
          ${why ? html`<small class="why">${reasonText(t, why)}</small>` : nothing}
        </span>
        <span class="end">
          <span class="val">${formatState(hass, id, t.lang)}</span>
          ${suggestion?.confidence != null ? confidenceDots(t, suggestion.confidence) : nothing}
        </span>
      </button>
    </li>`;
  }

  private renderInvert(hass: HomeAssistant, t: Translate, request: PickRequest): TemplateResult {
    const role = request.measurement?.role ?? "grid";
    const id = this.selected[0];
    const value = id ? measurementKw(hass, { entity_id: id, invert: this.invert, minus_entity_id: null }) : null;
    let text = "";
    if (value !== null) {
      const kw = formatNumber(t.lang, Math.abs(value), 2);
      if (role === "grid") {
        text = t(value >= 0 ? "pick.preview.import" : "pick.preview.export", { value: kw });
      } else if (role === "battery") {
        text = t(value >= 0 ? "pick.preview.charge" : "pick.preview.discharge", { value: kw });
      } else {
        text = t(value >= -0.05 ? `pick.preview.${role}` : "pick.preview.negative", {
          value: formatNumber(t.lang, value, 2),
        });
      }
    }
    return html`<div class="line">
        <button
          type="button"
          id="invert"
          class="switch"
          role="switch"
          aria-checked=${String(this.invert)}
          aria-labelledby="invert-label"
          @click=${() => (this.invert = !this.invert)}
        ></button>
        <label id="invert-label" for="invert">${t("pick.invert")}</label>
        ${tip(t, role === "battery" ? "pick_invert_battery" : "pick_invert")}
      </div>
      ${text ? html`<div class="note preview"><ha-icon icon="mdi:eye-outline"></ha-icon><span>${text}</span></div>` : nothing}`;
  }

  private toggle(id: string): void {
    if (this.request?.multiple) {
      this.selected = this.selected.includes(id) ? this.selected.filter((s) => s !== id) : [...this.selected, id];
    } else {
      this.selected = [id];
    }
  }

  private apply(): void {
    const detail: PickResult = { selected: this.selected, invert: this.invert };
    this.dispatchEvent(new CustomEvent("joe-picked", { detail, bubbles: true, composed: true }));
  }

  private cancel(): void {
    this.dispatchEvent(new CustomEvent("joe-close", { bubbles: true, composed: true }));
  }
}

define("joe-entity-picker", JoeEntityPicker);
