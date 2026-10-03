import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { displayTitle } from "../components/bits";
import { saveConfig } from "../config";
import { define } from "../define";
import type { Translate } from "../i18n";
import { shared } from "../styles/shared";
import type { Discovery, HomeAssistant, JoeConfig, TariffConfig } from "../types";
import "./tariff-form";

const FIELDS: (keyof TariffConfig)[] = [
  "kind",
  "price_entity",
  "window",
  "night_price",
  "day_price",
  "feed_in_price",
  "feed_in_entity",
];

/** Changes to the tariff, saved together. */
export function tariffChanges(before: TariffConfig, after: TariffConfig): Partial<TariffConfig> {
  const changes: Partial<TariffConfig> = {};
  for (const field of FIELDS) {
    if (JSON.stringify(before[field]) !== JSON.stringify(after[field])) {
      (changes as Record<string, unknown>)[field] = after[field];
    }
  }
  return changes;
}

/** The tariff in a sheet: change, then save or cancel. */
export class JoeTariffEditor extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) config?: JoeConfig;
  @property({ attribute: false }) discovery?: Discovery;

  @state() private draft?: TariffConfig;
  @state() private saving = false;

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      joe-tariff-form {
        margin-top: 18px;
      }
    `,
  ];

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has("config") && this.config && !this.draft) {
      this.draft = structuredClone(this.config.tariff);
    }
  }

  protected render() {
    const { t, draft } = this;
    if (!t || !draft) {
      return nothing;
    }
    return html`<div class="sheet-title">${displayTitle(t("edit.tariff.title"))}</div>
      <joe-tariff-form
        .hass=${this.hass}
        .t=${t}
        .tariff=${draft}
        .discovery=${this.discovery}
        feedIn
        @joe-tariff=${(ev: CustomEvent<Partial<TariffConfig>>) => {
          this.draft = { ...draft, ...ev.detail };
        }}
      ></joe-tariff-form>
      <div class="actions" data-notip>
        <button type="button" class="btn btn-primary" ?disabled=${this.saving} @click=${this.save}>
          ${t("common.save")}
        </button>
        <button type="button" class="btn btn-ghost" @click=${this.close}>${t("common.cancel")}</button>
      </div>`;
  }

  private async save(): Promise<void> {
    const { config, draft } = this;
    if (!config || !draft) {
      return;
    }
    const changes = tariffChanges(config.tariff, draft);
    if (Object.keys(changes).length) {
      this.saving = true;
      const patch: Record<string, unknown> = { tariff: changes };
      if ("kind" in changes) {
        patch.answers = { tariff: draft.kind };
      }
      const ok = await saveConfig(this, patch);
      this.saving = false;
      if (!ok) {
        return;
      }
    }
    this.close();
  }

  private close(): void {
    this.dispatchEvent(new CustomEvent("joe-close", { bubbles: true, composed: true }));
  }
}

define("joe-tariff-editor", JoeTariffEditor);
