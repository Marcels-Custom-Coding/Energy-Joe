import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { displayTitle, sourceChip } from "../components/bits";
import { tip } from "../components/tip";
import { pickEntity, saveConfig, sourceOf } from "../config";
import { define } from "../define";
import { energyKwh, entityName, formatNumber, formatState, measurementKw } from "../entities";
import type { TipName, Translate } from "../i18n";
import { shared } from "../styles/shared";
import type { BatteryConfig, Discovery, HomeAssistant, JoeConfig, Measurement } from "../types";

type Draft = Pick<
  BatteryConfig,
  "name" | "capacity_kwh" | "soc_entity" | "power" | "max_charge_w" | "max_discharge_w" | "priority" | "adapter"
>;

const FIELDS: (keyof Draft)[] = [
  "name",
  "capacity_kwh",
  "soc_entity",
  "power",
  "max_charge_w",
  "max_discharge_w",
  "priority",
  "adapter",
];

/** One battery in a sheet: name, size, sensors, limits, order and control. */
export class JoeBatteryEditor extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) config?: JoeConfig;
  @property({ attribute: false }) discovery?: Discovery;
  @property() batteryId = "";

  @state() private draft?: Draft;
  @state() private capacityUnknown = false;
  @state() private saving = false;

  static styles = [
    shared,
    css`
      :host {
        display: block;
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
        flex: 1;
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
      .toggle {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .toggle label {
        font-weight: 600;
        cursor: pointer;
      }
      @media (max-width: 480px) {
        .limits {
          grid-template-columns: 1fr;
        }
      }
    `,
  ];

  private get battery(): BatteryConfig | undefined {
    return this.config?.batteries.find((b) => b.id === this.batteryId);
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    const battery = this.battery;
    if ((changed.has("config") || changed.has("batteryId")) && battery && !this.draft) {
      this.draft = Object.fromEntries(FIELDS.map((field) => [field, structuredClone(battery[field])])) as Draft;
      this.capacityUnknown = this.config?.answers[`capacity:${battery.id}`] === "unknown";
    }
  }

  protected render() {
    const { t, hass, config, draft } = this;
    const battery = this.battery;
    if (!t || !hass || !config || !draft || !battery) {
      return nothing;
    }
    const found = this.discovery?.batteries.find((b) => b.id === battery.id);
    const canControl = Boolean(Object.keys(battery.controls).length) && (found?.controllable ?? battery.adapter !== "none");
    const readCapacity = energyKwh(hass, battery.capacity_entity);
    return html`<div class="sheet-title">${displayTitle(t("edit.battery.title", { name: battery.name }))}</div>
      ${this.field(
        t("f.battery.name"),
        "f_battery_name",
        html`<input
          class="input"
          type="text"
          maxlength="60"
          .value=${draft.name}
          @change=${(ev: Event) => this.set({ name: (ev.target as HTMLInputElement).value.trim() || battery.name })}
        />`,
      )}
      ${this.field(
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
                .value=${draft.capacity_kwh == null ? "" : String(draft.capacity_kwh)}
                placeholder=${readCapacity != null ? formatNumber(t.lang, readCapacity, 2) : t("f.unknown")}
                @change=${(ev: Event) => {
                  const value = Number.parseFloat((ev.target as HTMLInputElement).value);
                  this.capacityUnknown = false;
                  this.set({ capacity_kwh: Number.isFinite(value) && value > 0 ? value : null });
                }}
              />
              <span class="unit">kWh</span>
            </span>
            <button
              type="button"
              class="mini-btn ${this.capacityUnknown ? "go" : ""}"
              aria-pressed=${String(this.capacityUnknown)}
              @click=${() => {
                this.capacityUnknown = !this.capacityUnknown;
                if (this.capacityUnknown) {
                  this.set({ capacity_kwh: null });
                }
              }}
            >
              ${t("ask.idk_learn")}
            </button>
          </div>
          ${readCapacity != null
            ? html`<p class="field-hint">${t("f.battery.capacity.read", { value: formatNumber(t.lang, readCapacity, 2) })}</p>`
            : nothing}`,
        sourceChip(t, sourceOf(config, `batteries[${battery.id}].capacity_kwh`)),
      )}
      ${this.field(
        t("f.battery.soc"),
        "f_battery_soc",
        this.entityBox(t, draft.soc_entity, `${formatState(hass, draft.soc_entity, t.lang)}`, () => this.pickSoc()),
        sourceChip(t, sourceOf(config, `batteries[${battery.id}].soc_entity`)),
      )}
      ${this.field(
        t("f.battery.power"),
        "f_battery_power",
        this.entityBox(t, draft.power?.entity_id ?? null, this.powerText(t, draft.power), () => this.pickPower()),
        sourceChip(t, sourceOf(config, `batteries[${battery.id}].power`)),
      )}
      ${this.field(
        t("f.battery.limits"),
        "f_battery_limits",
        html`<div class="limits">
          <label>${t("f.battery.max_charge")} ${this.kwInput(t, draft.max_charge_w, "max_charge_w")}</label>
          <label>${t("f.battery.max_discharge")} ${this.kwInput(t, draft.max_discharge_w, "max_discharge_w")}</label>
        </div>`,
      )}
      ${config.batteries.length > 1
        ? this.field(
            t("f.battery.priority"),
            "f_battery_priority",
            html`<span class="unit-input">
              <input
                class="input"
                type="number"
                min="1"
                max="9"
                step="1"
                .value=${String(draft.priority)}
                @change=${(ev: Event) => {
                  const value = Math.round(Number.parseFloat((ev.target as HTMLInputElement).value));
                  this.set({ priority: Math.min(9, Math.max(1, Number.isFinite(value) ? value : 1)) });
                }}
              />
            </span>`,
          )
        : nothing}
      ${this.field(
        t("f.battery.control"),
        "f_battery_control",
        canControl
          ? html`<div class="toggle">
              <button
                type="button"
                id="control"
                class="switch"
                role="switch"
                aria-checked=${String(draft.adapter !== "none")}
                aria-labelledby="control-label"
                @click=${() =>
                  this.set({
                    adapter: draft.adapter !== "none" ? "none" : (found?.adapter ?? battery.adapter ?? "none"),
                  })}
              ></button>
              <label id="control-label" for="control">${t("f.battery.control.allow")}</label>
            </div>
            <p class="field-hint">${t("f.battery.control.found", { count: Object.keys(battery.controls).length })}</p>`
          : html`<p class="field-hint">${t("f.battery.control.none")}</p>`,
      )}
      <div class="actions" data-notip>
        <button type="button" class="btn btn-primary" ?disabled=${this.saving} @click=${this.save}>${t("common.save")}</button>
        <button type="button" class="btn btn-ghost" @click=${this.close}>${t("common.cancel")}</button>
      </div>`;
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
          const value = Number.parseFloat((ev.target as HTMLInputElement).value);
          this.set({ [field]: Number.isFinite(value) && value > 0 ? Math.round(value * 1000) : null });
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

  private async pickSoc(): Promise<void> {
    const { t, draft } = this;
    if (!t || !draft) {
      return;
    }
    const picked = await pickEntity(this, {
      heading: t("pick.battery.title"),
      tip: "pick_battery",
      filter: "soc",
      selected: [draft.soc_entity],
    });
    if (picked?.selected[0]) {
      this.set({ soc_entity: picked.selected[0] });
    }
  }

  private async pickPower(): Promise<void> {
    const { t, draft } = this;
    if (!t || !draft) {
      return;
    }
    const picked = await pickEntity(this, {
      heading: t("pick.battery_power.title"),
      tip: "pick_battery_power",
      filter: "power",
      selected: draft.power ? [draft.power.entity_id] : [],
      measurement: { invert: draft.power?.invert ?? false, role: "battery" },
    });
    if (picked?.selected[0]) {
      this.set({ power: { entity_id: picked.selected[0], invert: picked.invert, minus_entity_id: null } });
    }
  }

  private set(change: Partial<Draft>): void {
    if (this.draft) {
      this.draft = { ...this.draft, ...change };
    }
  }

  private async save(): Promise<void> {
    const battery = this.battery;
    const draft = this.draft;
    if (!battery || !draft || !this.config) {
      return;
    }
    const changes: Record<string, unknown> = {};
    for (const field of FIELDS) {
      if (JSON.stringify(battery[field]) !== JSON.stringify(draft[field])) {
        changes[field] = draft[field];
      }
    }
    const answerKey = `capacity:${battery.id}`;
    const wasUnknown = this.config.answers[answerKey] === "unknown";
    const patch: Record<string, unknown> = {};
    if (Object.keys(changes).length) {
      patch.batteries = { [battery.id]: changes };
    }
    if (wasUnknown !== this.capacityUnknown) {
      patch.answers = { [answerKey]: this.capacityUnknown ? "unknown" : null };
    }
    if (Object.keys(patch).length) {
      this.saving = true;
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

define("joe-battery-editor", JoeBatteryEditor);
