import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { sourceChip } from "../../components/bits";
import { fixed } from "../../components/look-back";
import { tip } from "../../components/tip";
import { pickEntity, saveConfig, sourceOf } from "../../config";
import { define } from "../../define";
import { energyKwh, entityName, formatNumber, formatState, measurementKw } from "../../entities";
import type { TipName, Translate } from "../../i18n";
import { shared } from "../../styles/shared";
import type { BatteryConfig, BatteryFloor, HomeAssistant, JoeConfig, Measurement } from "../../types";

/** The fields of a battery set right on its page (Regler: see editors/battery-control.ts). */
export const BATTERY_FIELDS = [
  "name",
  "capacity_kwh",
  "soc_entity",
  "power",
  "max_charge_w",
  "max_discharge_w",
  "floor_soc",
  "priority",
] as const;
export type BatteryField = (typeof BATTERY_FIELDS)[number];
export type BatteryValues = Pick<BatteryConfig, BatteryField>;

/** A change of the fields: the new values, and "lern es" for the size when it changed. */
export interface BatteryFieldsChange {
  change: Partial<BatteryValues>;
  unknown?: boolean;
}

/**
 * Which fields: Steuern (name, size, limits, floor, order) or Strom
 * (charge level and power sensors) on the Speicher page, or all of them.
 */
export type BatteryFieldsPart = "all" | "steer" | "power";

/**
 * The fields of one battery. On its page each change is saved right away
 * (a partial patch of just that field); with a `draft` (the setup's sheet)
 * the element only reports changes as `joe-battery-change`.
 */
export class JoeBatteryFields extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) config?: JoeConfig;
  /** The battery as saved. */
  @property({ attribute: false }) battery?: BatteryConfig;
  /** Its floor as Joe reads it from the device (state.floors). */
  @property({ attribute: false }) floor?: BatteryFloor;
  /** Values to show instead of the saved ones; changes are reported, not saved. */
  @property({ attribute: false }) draft?: BatteryValues;
  /** "Weiß ich nicht – lern es" for the size in the draft. */
  @property({ attribute: false }) unknown?: boolean;
  @property() show: BatteryFieldsPart = "all";

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      .field:first-child {
        margin-top: 0;
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
      .entity span {
        flex: 1 1 160px;
        min-width: 0;
      }
      .entity b {
        font-weight: 600;
        overflow-wrap: anywhere;
      }
      .entity small {
        display: block;
        color: var(--joe-muted);
      }
      .limits {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }
      .limits label {
        display: grid;
        gap: 4px;
        font-size: 13.5px;
        font-weight: 600;
        color: var(--joe-ink-2);
      }
      .limits .unit-input {
        max-width: none;
      }
      .field-row {
        flex-wrap: wrap;
      }
      .learned {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
      }
      @media (pointer: coarse) {
        .input {
          min-height: 44px;
        }
      }
      @media (max-width: 480px) {
        .limits {
          grid-template-columns: 1fr;
        }
      }
    `,
  ];

  /** What the fields show: the draft, or the battery as saved. */
  private get values(): BatteryValues | undefined {
    const battery = this.battery;
    if (this.draft) {
      return this.draft;
    }
    return battery ? (Object.fromEntries(BATTERY_FIELDS.map((field) => [field, battery[field]])) as BatteryValues) : undefined;
  }

  private get capacityUnknown(): boolean {
    const battery = this.battery;
    if (this.unknown !== undefined) {
      return this.unknown;
    }
    return Boolean(battery && this.config?.answers[`capacity:${battery.id}`] === "unknown");
  }

  protected render() {
    const { t, hass, config, battery } = this;
    const values = this.values;
    if (!t || !hass || !config || !battery || !values) {
      return nothing;
    }
    const steer = this.show !== "power";
    const power = this.show !== "steer";
    return html`${steer ? this.renderName(t, battery, values) : nothing} ${steer ? this.renderCapacity(t, battery, values) : nothing}
    ${power ? this.renderSensors(t, battery, values) : nothing} ${steer ? this.renderLimits(t, battery, values) : nothing}`;
  }

  private renderName(t: Translate, battery: BatteryConfig, values: BatteryValues): TemplateResult {
    return this.field(
      t("f.battery.name"),
      "f_battery_name",
      html`<input
        class="input"
        type="text"
        maxlength="60"
        aria-label=${t("f.battery.name")}
        .value=${values.name}
        @change=${(ev: Event) => {
          const input = ev.target as HTMLInputElement;
          const name = input.value.trim();
          if (!name) {
            input.value = values.name;
            return;
          }
          this.change({ name });
        }}
      />`,
    );
  }

  private renderCapacity(t: Translate, battery: BatteryConfig, values: BatteryValues): TemplateResult {
    const hass = this.hass!;
    const config = this.config!;
    const unknown = this.capacityUnknown;
    const readCapacity = energyKwh(hass, battery.capacity_entity);
    const learned = config.learned?.battery_models?.[battery.id];
    return this.field(
      t("f.battery.capacity"),
      "q_capacity",
      html`<div class="field-row">
          <span class="unit-input">
            <input
              class="input"
              type="number"
              inputmode="decimal"
              min="0.1"
              max="1000"
              step="0.01"
              aria-label=${t("f.battery.capacity")}
              .value=${values.capacity_kwh == null ? "" : String(values.capacity_kwh)}
              placeholder=${readCapacity != null ? formatNumber(t.lang, readCapacity, 2) : t("f.unknown")}
              @change=${(ev: Event) => {
                const value = Number.parseFloat((ev.target as HTMLInputElement).value.replace(",", "."));
                this.change({ capacity_kwh: Number.isFinite(value) && value > 0 ? value : null }, false);
              }}
            />
            <span class="unit">kWh</span>
          </span>
          <button
            type="button"
            class="mini-btn ${unknown ? "go" : ""}"
            aria-pressed=${String(unknown)}
            @click=${() => (unknown ? this.change({}, false) : this.change({ capacity_kwh: null }, true))}
          >
            ${t("ask.idk_learn")}
          </button>
        </div>
        ${readCapacity != null
          ? html`<p class="field-hint">${t("f.battery.capacity.read", { value: formatNumber(t.lang, readCapacity, 2) })}</p>`
          : nothing}
        ${learned
          ? html`<p class="field-hint learned">
              ${sourceChip(t, { source: "learned" })}
              ${t("battery.page.capacity.learned", { value: fixed(t.lang, learned.capacity_kwh, 1) })}
            </p>`
          : unknown
            ? html`<p class="field-hint">${t("battery.page.capacity.learning")}</p>`
            : nothing}`,
      sourceChip(t, sourceOf(config, `batteries[${battery.id}].capacity_kwh`)),
    );
  }

  private renderSensors(t: Translate, battery: BatteryConfig, values: BatteryValues): TemplateResult {
    const hass = this.hass!;
    const config = this.config!;
    return html`${this.field(
      t("f.battery.soc"),
      "f_battery_soc",
      this.entityBox(t, values.soc_entity, formatState(hass, values.soc_entity, t.lang), () => this.pickSoc(values)),
      sourceChip(t, sourceOf(config, `batteries[${battery.id}].soc_entity`)),
    )}
    ${this.field(
      t("f.battery.power"),
      "f_battery_power",
      this.entityBox(t, values.power?.entity_id ?? null, this.powerText(t, values.power), () => this.pickPower(values)),
      sourceChip(t, sourceOf(config, `batteries[${battery.id}].power`)),
    )}`;
  }

  private renderLimits(t: Translate, battery: BatteryConfig, values: BatteryValues): TemplateResult {
    const config = this.config!;
    const floor = this.floor;
    return html`${this.field(
      t("f.battery.limits"),
      "f_battery_limits",
      html`<div class="limits">
        <label>${t("f.battery.max_charge")} ${this.kwInput(t, values.max_charge_w, "max_charge_w")}</label>
        <label>${t("f.battery.max_discharge")} ${this.kwInput(t, values.max_discharge_w, "max_discharge_w")}</label>
      </div>`,
    )}
    ${this.field(
      t("f.battery.floor"),
      "f_battery_floor",
      html`<span class="unit-input">
          <input
            class="input"
            type="number"
            inputmode="decimal"
            min="0"
            max="100"
            step="1"
            aria-label=${t("f.battery.floor")}
            .value=${values.floor_soc == null ? "" : String(values.floor_soc)}
            placeholder=${floor?.device != null ? formatNumber(t.lang, floor.device, 0) : t("f.unknown")}
            @change=${(ev: Event) => {
              const value = Number.parseFloat((ev.target as HTMLInputElement).value.replace(",", "."));
              this.change({ floor_soc: Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : null });
            }}
          />
          <span class="unit">%</span>
        </span>
        ${floor?.device != null
          ? html`<p class="field-hint">${t("f.battery.floor.read", { value: formatNumber(t.lang, floor.device, 0) })}</p>`
          : values.floor_soc == null
            ? html`<div class="note warn"><ha-icon icon="mdi:help-circle-outline"></ha-icon><span>${t("f.battery.floor.ask")}</span></div>`
            : nothing}`,
      sourceChip(t, sourceOf(config, `batteries[${battery.id}].floor_soc`)),
    )}
    ${config.batteries.length > 1
      ? this.field(
          t("f.battery.priority"),
          "f_battery_priority",
          html`<span class="unit-input">
            <input
              class="input"
              type="number"
              inputmode="numeric"
              min="1"
              max="9"
              step="1"
              aria-label=${t("f.battery.priority")}
              .value=${String(values.priority)}
              @change=${(ev: Event) => {
                const value = Math.round(Number.parseFloat((ev.target as HTMLInputElement).value));
                this.change({ priority: Math.min(9, Math.max(1, Number.isFinite(value) ? value : 1)) });
              }}
            />
          </span>`,
        )
      : nothing}`;
  }

  private field(label: string, tipName: TipName, control: TemplateResult, chip?: TemplateResult): TemplateResult {
    const t = this.t!;
    return html`<div class="field" data-tipped>
      <div class="field-label">${label} ${tip(t, tipName)} ${chip ?? nothing}</div>
      ${control}
    </div>`;
  }

  private entityBox(t: Translate, entityId: string | null, value: string, pick: () => void): TemplateResult {
    const hass = this.hass!;
    return html`<div class="entity">
      <span>
        ${entityId ? html`<b>${entityName(hass, entityId)}</b><small>${value}</small>` : html`<small>${t("find.none")}</small>`}
      </span>
      <button type="button" class="mini-btn" @click=${pick}>
        <ha-icon icon="mdi:magnify"></ha-icon>${t(entityId ? "review.change" : "review.choose")}
      </button>
    </div>`;
  }

  private kwInput(t: Translate, watts: number | null, field: "max_charge_w" | "max_discharge_w"): TemplateResult {
    return html`<span class="unit-input">
      <input
        class="input"
        type="number"
        inputmode="decimal"
        min="0"
        max="1000"
        step="0.1"
        placeholder=${t("f.unknown")}
        .value=${watts == null ? "" : String(Math.round(watts / 100) / 10)}
        @change=${(ev: Event) => {
          const value = Number.parseFloat((ev.target as HTMLInputElement).value.replace(",", "."));
          this.change({ [field]: Number.isFinite(value) && value > 0 ? Math.round(value * 1000) : null });
        }}
      />
      <span class="unit">kW</span>
    </span>`;
  }

  private powerText(t: Translate, power: Measurement | null): string {
    const hass = this.hass!;
    const kw = measurementKw(hass, power);
    if (!power || kw === null) {
      return power ? formatState(hass, power.entity_id, t.lang) : "";
    }
    const value = formatNumber(t.lang, Math.abs(kw), 2);
    return t(kw >= 0 ? "pick.preview.charge" : "pick.preview.discharge", { value });
  }

  private async pickSoc(values: BatteryValues): Promise<void> {
    const t = this.t!;
    const picked = await pickEntity(this, {
      heading: t("pick.battery.title"),
      tip: "pick_battery",
      filter: "soc",
      selected: [values.soc_entity],
    });
    const soc = picked?.selected[0];
    if (soc && soc !== values.soc_entity) {
      this.change({ soc_entity: soc });
    }
  }

  private async pickPower(values: BatteryValues): Promise<void> {
    const t = this.t!;
    const picked = await pickEntity(this, {
      heading: t("pick.battery_power.title"),
      tip: "pick_battery_power",
      filter: "power",
      selected: values.power ? [values.power.entity_id] : [],
      measurement: { invert: values.power?.invert ?? false, role: "battery" },
    });
    if (picked?.selected[0]) {
      this.change({ power: { entity_id: picked.selected[0], invert: picked.invert, minus_entity_id: null } });
    }
  }

  /**
   * One change: saved right away as a partial patch of the battery (and the
   * "lern es" answer), or reported to the draft's owner.
   */
  private change(change: Partial<BatteryValues>, unknown?: boolean): void {
    const battery = this.battery;
    const config = this.config;
    if (!battery || !config) {
      return;
    }
    const known = unknown === undefined || unknown === this.capacityUnknown ? undefined : unknown;
    if (this.draft) {
      this.dispatchEvent(new CustomEvent<BatteryFieldsChange>("joe-battery-change", { detail: { change, unknown: known } }));
      return;
    }
    const fields = Object.fromEntries(
      Object.entries(change).filter(([field, value]) => JSON.stringify(battery[field as BatteryField]) !== JSON.stringify(value)),
    );
    const patch: Record<string, unknown> = {};
    if (Object.keys(fields).length) {
      patch.batteries = { [battery.id]: fields };
    }
    if (known !== undefined) {
      patch.answers = { [`capacity:${battery.id}`]: known ? "unknown" : null };
    }
    if (Object.keys(patch).length) {
      void saveConfig(this, patch);
    }
  }
}

define("joe-battery-fields", JoeBatteryFields);
