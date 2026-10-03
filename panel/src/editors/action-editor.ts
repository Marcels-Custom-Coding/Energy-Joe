import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { displayTitle } from "../components/bits";
import { tip } from "../components/tip";
import { pickEntity, saveConfig } from "../config";
import { define } from "../define";
import { entityName, formatState, type FilterName } from "../entities";
import type { TipName, Translate } from "../i18n";
import { shared } from "../styles/shared";
import type { ActionCondition, ActionConfig, ConditionOp, Discovery, HomeAssistant, JoeConfig } from "../types";

export type ActionTemplate = "ev" | "hot_water" | "custom";

const OPS: ConditionOp[] = ["eq", "ne", "lt", "le", "gt", "ge"];

/** A fresh night action from a template. */
export function newAction(template: ActionTemplate, t: Translate): ActionConfig {
  const base: ActionConfig = {
    id: `${template}_${Date.now().toString(36)}`,
    name: t(`action.template.${template}`),
    kind: "switch",
    enabled: true,
    entity_id: "",
    on_value: "on",
    reset: "previous",
    reset_value: null,
    lead_min: 0,
    auto: true,
    forecast_below_kwh: null,
    conditions: [],
    power_kw: null,
    power_entity: null,
    consumer_id: null,
    priority: 3,
    sensor_entity: null,
    comfort: 45,
    maximum: 62,
    buffer: 3,
  };
  if (template === "ev") {
    return { ...base, on_value: "now", lead_min: 3, forecast_below_kwh: 15, power_kw: 11, priority: 1 };
  }
  if (template === "hot_water") {
    return { ...base, kind: "target", reset: "fixed", reset_value: "off", forecast_below_kwh: 20, power_kw: 0.5, priority: 2 };
  }
  return base;
}

/** One night action in a sheet: what Joe switches, when, and how he puts it back. */
export class JoeActionEditor extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) config?: JoeConfig;
  @property({ attribute: false }) discovery?: Discovery;
  /** An existing action's id, or "new:<template>". */
  @property() actionId = "";

  @state() private draft?: ActionConfig;
  @state() private saving = false;
  @state() private problem = "";

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
      .row {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }
      .condition {
        display: grid;
        grid-template-columns: minmax(0, 1.4fr) auto minmax(0, 0.8fr) auto;
        gap: 6px;
        align-items: center;
        padding: 6px 8px;
        border-radius: 10px;
        background: var(--joe-surface-2);
        margin-bottom: 6px;
      }
      .condition b {
        font-weight: 600;
        overflow-wrap: anywhere;
      }
      .temps {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
      }
      .temps label {
        display: grid;
        gap: 4px;
        font-size: 13.5px;
        font-weight: 600;
        color: var(--joe-ink-2);
      }
      .temps .unit-input {
        max-width: none;
      }
      .icon-btn {
        display: grid;
        place-items: center;
        width: 34px;
        height: 34px;
        border: 0;
        border-radius: 9px;
        cursor: pointer;
        background: transparent;
        color: var(--joe-ink-2);
      }
      .icon-btn:hover {
        background: var(--joe-surface);
      }
      .danger-zone {
        margin-top: 18px;
        padding-top: 14px;
        border-top: 1px solid var(--joe-line);
      }
      @media (pointer: coarse) {
        .icon-btn {
          width: 44px;
          height: 44px;
        }
      }
      @media (max-width: 520px) {
        .temps {
          grid-template-columns: 1fr;
        }
        .condition {
          grid-template-columns: 1fr auto;
        }
      }
    `,
  ];

  private get existing(): ActionConfig | undefined {
    return this.config?.actions.find((a) => a.id === this.actionId);
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    if (!this.draft && this.t && (changed.has("actionId") || changed.has("config"))) {
      if (this.actionId.startsWith("new:")) {
        const draft = newAction(this.actionId.slice(4) as ActionTemplate, this.t);
        const wallbox = this.discovery?.wallboxes.find((w) => w.is_car);
        if (this.actionId === "new:ev" && wallbox) {
          Object.assign(draft, this.fromWallbox(wallbox));
        }
        this.draft = draft;
      } else if (this.existing) {
        this.draft = structuredClone(this.existing);
      }
    }
  }

  private fromWallbox(w: Discovery["wallboxes"][number]): Partial<ActionConfig> {
    const conditions: ActionCondition[] = w.entities?.connected ? [{ entity_id: w.entities.connected, op: "eq", value: true }] : [];
    return {
      name: w.name,
      entity_id: w.mode_entity ?? "",
      conditions,
      power_entity: w.entities?.power ?? null,
    };
  }

  protected render() {
    const { t, hass, draft } = this;
    if (!t || !hass || !draft) {
      return nothing;
    }
    const isNew = !this.existing;
    return html`<div class="sheet-title">${displayTitle(t(isNew ? "action.title.new" : "action.title"))}</div>
      ${this.field(
        t("action.f.name"),
        "a_name",
        html`<input
          class="input"
          type="text"
          maxlength="60"
          .value=${draft.name}
          @change=${(ev: Event) => this.set({ name: (ev.target as HTMLInputElement).value.trim() || draft.name })}
        />`,
      )}
      ${this.field(
        t("action.f.kind"),
        "a_kind",
        html`<div class="seg" role="group" aria-label=${t("action.f.kind")}>
          ${(["switch", "target"] as const).map(
            (kind) =>
              html`<button type="button" aria-pressed=${String(draft.kind === kind)} @click=${() => this.set({ kind })}>
                ${t(`action.kind.${kind}`)}
              </button>`,
          )}
        </div>`,
      )}
      ${this.field(t("action.f.entity"), "a_entity", this.entityBox(t, draft.entity_id, () => this.pickTarget()))}
      ${draft.entity_id
        ? this.field(
            t("action.f.on_value"),
            "a_on_value",
            this.valueInput(draft.entity_id, draft.on_value, (value) => this.set({ on_value: value })),
          )
        : nothing}
      ${this.field(
        t("action.f.reset"),
        "a_reset",
        html`<div class="row">
          <div class="seg" role="group" aria-label=${t("action.f.reset")}>
            ${(["previous", "fixed"] as const).map(
              (reset) =>
                html`<button type="button" aria-pressed=${String(draft.reset === reset)} @click=${() => this.set({ reset })}>
                  ${t(`action.reset.${reset}`)}
                </button>`,
            )}
          </div>
          ${draft.reset === "fixed" && draft.entity_id
            ? this.valueInput(draft.entity_id, draft.reset_value ?? "", (value) => this.set({ reset_value: value }))
            : nothing}
        </div>`,
      )}
      ${this.field(
        t("action.f.lead"),
        "a_lead",
        html`<span class="unit-input">
          <input
            class="input"
            type="number"
            min="0"
            max="120"
            step="1"
            .value=${String(draft.lead_min)}
            @change=${(ev: Event) => this.set({ lead_min: this.int(ev, 0, 120) })}
          />
          <span class="unit">min</span>
        </span>`,
      )}
      ${draft.kind === "target" ? this.renderTarget(t, draft) : nothing}
      ${this.field(
        t("action.f.auto"),
        "a_auto",
        html`<div class="row">
          <button
            type="button"
            class="switch"
            role="switch"
            aria-checked=${String(draft.auto)}
            aria-label=${t("action.f.auto")}
            @click=${() => this.set({ auto: !draft.auto })}
          ></button>
          <span>${t("action.f.below")}</span>
          <span class="unit-input">
            <input
              class="input"
              type="number"
              min="0"
              max="1000"
              step="1"
              ?disabled=${!draft.auto}
              placeholder=${t("action.f.every_night")}
              .value=${draft.forecast_below_kwh == null ? "" : String(draft.forecast_below_kwh)}
              @change=${(ev: Event) => {
                const value = Number.parseFloat((ev.target as HTMLInputElement).value);
                this.set({ forecast_below_kwh: Number.isFinite(value) && value > 0 ? value : null });
              }}
            />
            <span class="unit">kWh</span>
          </span>
        </div>`,
      )}
      ${draft.auto ? this.renderConditions(t, draft) : nothing}
      ${this.field(
        t("action.f.power"),
        "a_power",
        html`<span class="unit-input">
          <input
            class="input"
            type="number"
            inputmode="decimal"
            min="0"
            max="100"
            step="0.1"
            placeholder=${t("f.unknown")}
            .value=${draft.power_kw == null ? "" : String(draft.power_kw)}
            @change=${(ev: Event) => {
              const value = Number.parseFloat((ev.target as HTMLInputElement).value);
              this.set({ power_kw: Number.isFinite(value) && value > 0 ? value : null });
            }}
          />
          <span class="unit">kW</span>
        </span>`,
      )}
      ${(this.config?.consumers.length ?? 0)
        ? this.field(
            t("action.f.consumer"),
            "a_consumer",
            html`<select class="input" @change=${(ev: Event) => this.set({ consumer_id: (ev.target as HTMLSelectElement).value || null })}>
              <option value="" ?selected=${!draft.consumer_id}>${t("action.f.consumer.none")}</option>
              ${this.config!.consumers.map(
                (c) => html`<option value=${c.id} ?selected=${draft.consumer_id === c.id}>${c.name}</option>`,
              )}
            </select>`,
          )
        : nothing}
      ${this.field(
        t("action.f.priority"),
        "a_priority",
        html`<span class="unit-input">
          <input
            class="input"
            type="number"
            min="1"
            max="9"
            step="1"
            .value=${String(draft.priority)}
            @change=${(ev: Event) => this.set({ priority: this.int(ev, 1, 9) })}
          />
        </span>`,
      )}
      ${this.field(
        t("action.f.enabled"),
        "a_enabled",
        html`<button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(draft.enabled)}
          aria-label=${t("action.f.enabled")}
          @click=${() => this.set({ enabled: !draft.enabled })}
        ></button>`,
      )}
      ${this.problem ? html`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.problem}</span></div>` : nothing}
      <div class="actions">
        <span data-tipped class="row">
          <button type="button" class="btn btn-primary" ?disabled=${this.saving} @click=${this.save}>${t("common.save")}</button>
          ${tip(t, "a_save")}
        </span>
        <button type="button" class="btn btn-ghost" data-notip @click=${this.close}>${t("common.cancel")}</button>
      </div>
      ${isNew
        ? nothing
        : html`<div class="danger-zone" data-tipped>
            <button type="button" class="btn btn-danger" @click=${this.deleteAction}>${t("action.delete")}</button>
            ${tip(t, "a_delete")}
          </div>`}`;
  }

  private renderTarget(t: Translate, draft: ActionConfig): TemplateResult {
    const number = (key: "comfort" | "maximum" | "buffer", unit: string) => html`<label>
      ${t(`action.f.${key}`)}
      <span class="unit-input">
        <input
          class="input"
          type="number"
          min="0"
          max="100"
          step="0.5"
          .value=${String(draft[key])}
          @change=${(ev: Event) => {
            const value = Number.parseFloat((ev.target as HTMLInputElement).value);
            if (Number.isFinite(value)) this.set({ [key]: value });
          }}
        />
        <span class="unit">${unit}</span>
      </span>
    </label>`;
    return html`${this.field(
        t("action.f.sensor"),
        "a_sensor",
        this.entityBox(t, draft.sensor_entity ?? "", () => this.pickSensor()),
      )}
      ${this.field(
        t("action.f.temps"),
        "a_temps",
        html`<div class="temps">${number("comfort", "°C")} ${number("maximum", "°C")} ${number("buffer", "K")}</div>`,
      )}`;
  }

  private renderConditions(t: Translate, draft: ActionConfig): TemplateResult {
    const hass = this.hass!;
    return this.field(
      t("action.f.conditions"),
      "a_conditions",
      html`${draft.conditions.map(
          (condition, index) => html`<div class="condition">
            <span><b>${entityName(hass, condition.entity_id)}</b></span>
            <select
              class="input"
              aria-label=${t("action.f.op")}
              @change=${(ev: Event) => this.setCondition(index, { op: (ev.target as HTMLSelectElement).value as ConditionOp })}
            >
              ${OPS.map((op) => html`<option value=${op} ?selected=${condition.op === op}>${t(`action.op.${op}`)}</option>`)}
            </select>
            <input
              class="input"
              type="text"
              aria-label=${t("action.f.value")}
              .value=${String(condition.value === true ? "on" : condition.value === false ? "off" : condition.value)}
              @change=${(ev: Event) => this.setCondition(index, { value: this.parse((ev.target as HTMLInputElement).value) })}
            />
            <button type="button" class="icon-btn" aria-label=${t("f.remove")} title=${t("f.remove")} @click=${() => this.removeCondition(index)}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>`,
        )}
        <button type="button" class="mini-btn" @click=${this.addCondition}>
          <ha-icon icon="mdi:plus"></ha-icon>${t("action.f.condition.add")}
        </button>`,
    );
  }

  private field(label: string, tipName: TipName, control: TemplateResult): TemplateResult {
    return html`<div class="field" data-tipped>
      <div class="field-label">${label} ${tip(this.t!, tipName)}</div>
      ${control}
    </div>`;
  }

  private entityBox(t: Translate, entityId: string, pick: () => void): TemplateResult {
    const hass = this.hass!;
    return html`<div class="entity">
      <span>
        ${entityId
          ? html`<b>${entityName(hass, entityId)}</b><small>${formatState(hass, entityId, t.lang)}</small>`
          : html`<small>${t("find.none")}</small>`}
      </span>
      <button type="button" class="mini-btn" @click=${pick}>
        <ha-icon icon="mdi:magnify"></ha-icon>${t(entityId ? "review.change" : "review.choose")}
      </button>
    </div>`;
  }

  /** A value fitting the entity: its options, on/off, or a number. */
  private valueInput(entityId: string, value: unknown, change: (value: string | number | boolean) => void): TemplateResult {
    const t = this.t!;
    const domain = entityId.split(".", 1)[0];
    const options = (this.hass?.states[entityId]?.attributes.options as string[] | undefined) ?? [];
    if (["select", "input_select"].includes(domain) && options.length) {
      return html`<select class="input" aria-label=${t("action.f.value")} @change=${(ev: Event) => change((ev.target as HTMLSelectElement).value)}>
        ${options.map((option) => html`<option value=${option} ?selected=${value === option}>${option}</option>`)}
      </select>`;
    }
    if (["switch", "input_boolean", "light", "fan"].includes(domain)) {
      const on = value === true || value === "on";
      return html`<div class="seg" role="group" aria-label=${t("action.f.value")}>
        <button type="button" aria-pressed=${String(on)} @click=${() => change("on")}>${t("action.value.on")}</button>
        <button type="button" aria-pressed=${String(!on)} @click=${() => change("off")}>${t("action.value.off")}</button>
      </div>`;
    }
    return html`<input
      class="input"
      type="text"
      aria-label=${t("action.f.value")}
      .value=${value == null ? "" : String(value)}
      @change=${(ev: Event) => change(this.parse((ev.target as HTMLInputElement).value))}
    />`;
  }

  private parse(raw: string): string | number | boolean {
    const text = raw.trim();
    if (text === "on" || text === "an") return true;
    if (text === "off" || text === "aus") return false;
    const number = Number(text.replace(",", "."));
    return text !== "" && Number.isFinite(number) ? number : text;
  }

  private int(ev: Event, low: number, high: number): number {
    const value = Math.round(Number.parseFloat((ev.target as HTMLInputElement).value));
    return Math.min(high, Math.max(low, Number.isFinite(value) ? value : low));
  }

  private async pickTarget(): Promise<void> {
    const t = this.t!;
    const filter: FilterName = "writable";
    const picked = await pickEntity(this, {
      heading: t("action.pick.entity"),
      tip: "a_entity",
      filter,
      selected: this.draft?.entity_id ? [this.draft.entity_id] : [],
    });
    const entityId = picked?.selected[0];
    if (entityId) {
      const options = (this.hass?.states[entityId]?.attributes.options as string[] | undefined) ?? [];
      const on = this.draft?.on_value;
      this.set({
        entity_id: entityId,
        on_value: options.length && !options.includes(String(on)) ? (options.includes("now") ? "now" : options[0]) : (on ?? "on"),
      });
    }
  }

  private async pickSensor(): Promise<void> {
    const t = this.t!;
    const picked = await pickEntity(this, {
      heading: t("action.pick.sensor"),
      tip: "a_sensor",
      filter: "temperature",
      selected: this.draft?.sensor_entity ? [this.draft.sensor_entity] : [],
    });
    if (picked?.selected[0]) {
      this.set({ sensor_entity: picked.selected[0] });
    }
  }

  private async addCondition(): Promise<void> {
    const t = this.t!;
    const picked = await pickEntity(this, {
      heading: t("action.pick.condition"),
      tip: "a_conditions",
      filter: "any",
      selected: [],
    });
    const entityId = picked?.selected[0];
    if (entityId && this.draft) {
      const state = this.hass?.states[entityId]?.state;
      const value: string | number | boolean = state === "on" || state === "off" ? state === "on" : (state ?? "");
      this.set({ conditions: [...this.draft.conditions, { entity_id: entityId, op: "eq", value }] });
    }
  }

  private setCondition(index: number, change: Partial<ActionCondition>): void {
    if (!this.draft) return;
    const conditions = this.draft.conditions.map((c, i) => (i === index ? { ...c, ...change } : c));
    this.set({ conditions });
  }

  private removeCondition(index: number): void {
    if (!this.draft) return;
    this.set({ conditions: this.draft.conditions.filter((_, i) => i !== index) });
  }

  private set(change: Partial<ActionConfig>): void {
    if (this.draft) {
      this.draft = { ...this.draft, ...change };
      this.problem = "";
    }
  }

  private async save(): Promise<void> {
    const draft = this.draft;
    const t = this.t!;
    if (!draft) return;
    if (!draft.entity_id) {
      this.problem = t("action.problem.entity");
      return;
    }
    if (draft.kind === "target" && !draft.sensor_entity) {
      this.problem = t("action.problem.sensor");
      return;
    }
    const { id, ...fields } = draft;
    this.saving = true;
    const ok = await saveConfig(this, { actions: { [id]: fields } });
    this.saving = false;
    if (ok) this.close();
  }

  private async deleteAction(): Promise<void> {
    if (!this.existing) return;
    const ok = await saveConfig(this, { actions: { [this.existing.id]: null } });
    if (ok) this.close();
  }

  private close(): void {
    this.dispatchEvent(new CustomEvent("joe-close", { bubbles: true, composed: true }));
  }
}

define("joe-action-editor", JoeActionEditor);
