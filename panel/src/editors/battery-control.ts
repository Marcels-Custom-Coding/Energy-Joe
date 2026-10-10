import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { tip } from "../components/tip";
import { pickEntity } from "../config";
import { define } from "../define";
import { entityName, formatState, type FilterName } from "../entities";
import type { TranslationKey, Translate } from "../i18n";
import { shared } from "../styles/shared";
import {
  CONTROL_ROLES,
  MODE_MEANINGS,
  type BatteryConfig,
  type BatteryFinding,
  type ControlRole,
  type ControlStep,
  type HomeAssistant,
  type ModeMeaning,
  type StepName,
} from "../types";

export interface ControlValue {
  adapter: string;
  controls: BatteryConfig["controls"];
  mode_options: BatteryConfig["mode_options"];
  steps: BatteryConfig["steps"];
}

type Choice = "watch" | "profile" | "generic" | "steps";

const ROLE_FILTER: Record<ControlRole, FilterName> = {
  min_soc: "level",
  charge_target: "level",
  grid_charge: "toggle",
  mode: "option",
  charge_power: "setpoint",
  discharge_power: "setpoint",
  discharge_limit: "setpoint",
  discharge_limit_enabled: "toggle",
  charge_limit: "setpoint",
  charge_limit_enabled: "toggle",
};
const STEP_NAMES: StepName[] = ["charge", "hold", "release"];

/** The ways Joe could charge and hold with these levers (as in control/adapters.py). */
export function methods(value: Pick<ControlValue, "controls" | "mode_options">): { charge: string[]; hold: string[] } {
  const has = (...roles: ControlRole[]) => roles.every((role) => Boolean(value.controls[role]));
  const option = (meaning: ModeMeaning) => Boolean(value.mode_options[meaning]);
  const charge: string[] = [];
  if (has("mode") && option("force_charge")) charge.push("mode");
  if (has("grid_charge", "charge_target")) charge.push("target");
  if (has("grid_charge", "min_soc")) charge.push("min_soc");
  const hold: string[] = [];
  if (has("min_soc")) hold.push("min_soc");
  if (has("mode") && option("hold")) hold.push("mode_hold");
  if (has("mode", "charge_power") && option("force_charge")) hold.push("standby");
  if (has("discharge_limit")) hold.push("limit");
  return { charge, hold };
}

/** The control fields of a battery (what "Regler einrichten" changes). */
export function controlValue(battery: BatteryConfig): ControlValue {
  return {
    adapter: battery.adapter,
    controls: structuredClone(battery.controls),
    mode_options: structuredClone(battery.mode_options),
    steps: structuredClone(battery.steps),
  };
}

/**
 * The fields to save for a control value: a known profile brings the switches
 * it needs first ("prepare") and its service steps; other ways none.
 */
export function withPrepare(
  battery: BatteryConfig | undefined,
  value: ControlValue,
  found: BatteryFinding | undefined,
): ControlValue & { prepare: ControlStep[] } {
  const profile = !["none", "generic", "steps"].includes(value.adapter);
  const prepare = profile ? (battery?.adapter === value.adapter ? battery.prepare : (found?.prepare ?? [])) : [];
  const steps = profile && !Object.keys(value.steps).length ? (found?.steps ?? value.steps) : value.steps;
  return { ...value, steps, prepare: prepare ?? [] };
}

/** How Joe steers one battery: watch only, a known profile, assigned levers or own steps. */
export class JoeBatteryControl extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) battery?: BatteryConfig;
  @property({ attribute: false }) found?: BatteryFinding;
  @property({ attribute: false }) value?: ControlValue;
  /** Names of the integrations Joe knows (profile key -> name). */
  @property({ attribute: false }) profiles?: Record<string, string>;

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      .seg {
        flex-wrap: wrap;
        border-radius: 14px;
      }
      .rows {
        display: grid;
        gap: 6px;
        margin-top: 12px;
      }
      .row {
        display: grid;
        grid-template-columns: minmax(120px, 0.8fr) minmax(0, 1.6fr) auto;
        gap: 8px;
        align-items: center;
        padding: 6px 10px;
        border-radius: 10px;
        background: var(--joe-surface-2);
      }
      .row label,
      .row .label {
        font-weight: 600;
        font-size: 13.5px;
      }
      .row .entity {
        min-width: 0;
      }
      .row .entity b {
        display: block;
        font-weight: 600;
        overflow-wrap: anywhere;
      }
      .row .entity small {
        color: var(--joe-muted);
      }
      .row .buttons {
        display: flex;
        gap: 4px;
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
      .icon-btn:active {
        transform: scale(0.95);
      }
      .sub {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 16px 0 4px;
        font-weight: 700;
      }
      .ready {
        margin-top: 12px;
      }
      .step-value {
        width: 100%;
        min-width: 0;
      }
      @media (pointer: coarse) {
        .icon-btn {
          width: 44px;
          height: 44px;
        }
      }
      @media (max-width: 520px) {
        .row {
          grid-template-columns: 1fr auto;
        }
        .row label,
        .row .label {
          grid-column: 1 / -1;
        }
      }
    `,
  ];

  private get profileKey(): string | null {
    const battery = this.battery;
    if (battery && !["none", "generic", "steps"].includes(battery.adapter)) {
      return battery.adapter;
    }
    const found = this.found;
    return found && found.controllable && found.adapter !== "none" ? found.adapter : null;
  }

  private get choice(): Choice {
    const adapter = this.value?.adapter ?? "none";
    if (adapter === "none") return "watch";
    if (adapter === "generic") return "generic";
    if (adapter === "steps") return "steps";
    return "profile";
  }

  protected render() {
    const { t, value } = this;
    if (!t || !value) {
      return nothing;
    }
    const choices: Choice[] = ["watch", ...(this.profileKey ? (["profile"] as Choice[]) : []), "generic", "steps"];
    const suggested = this.found?.suggested;
    return html`<div class="choose">
        <div class="seg" role="group" aria-label=${t("f.battery.control")}>
          ${choices.map(
            (choice) =>
              html`<button type="button" aria-pressed=${String(this.choice === choice)} @click=${() => this.choose(choice)}>
                ${choice === "profile"
                  ? t("f.battery.control.profile", { name: this.profiles?.[this.profileKey ?? ""] ?? this.profileKey ?? "" })
                  : t(`f.battery.control.${choice}`)}
              </button>`,
          )}
        </div>
      </div>
      ${this.choice === "watch" && suggested?.complete
        ? html`<div class="note" data-tipped>
            <ha-icon icon="mdi:lightbulb-on-outline"></ha-icon>
            <span
              >${t("f.battery.control.suggested")}
              <div class="note-actions">
                <button type="button" class="mini-btn go" @click=${this.takeSuggestion}>${t("f.battery.control.take")}</button>
                ${tip(t, "control_roles")}
              </div></span
            >
          </div>`
        : nothing}
      ${this.choice === "profile" && Object.keys(value.steps).length && !Object.keys(value.controls).length
        ? this.renderServiceSteps(t, value)
        : this.choice === "profile" || this.choice === "generic"
          ? this.renderRoles(t, value)
          : nothing}
      ${this.choice === "steps" ? this.renderSteps(t, value) : nothing}
      ${this.choice !== "watch" ? html`<p class="field-hint">${t("f.battery.control.retest")}</p>` : nothing}`;
  }

  private renderRoles(t: Translate, value: ControlValue): TemplateResult {
    const hass = this.hass!;
    const ways = methods(value);
    const ready = ways.charge.length && ways.hold.length;
    const modeEntity = value.controls.mode;
    const options = modeEntity ? ((hass.states[modeEntity]?.attributes.options as string[] | undefined) ?? []) : [];
    return html`<div data-tipped>
      <div class="sub">${t("f.battery.control.levers")} ${tip(t, "control_roles")}</div>
      <div class="rows">
        ${CONTROL_ROLES.map((role) => {
          const entityId = value.controls[role];
          return html`<div class="row">
            <span class="label">${t(`role.${role}`)}</span>
            <span class="entity">
              ${entityId
                ? html`<b>${entityName(hass, entityId)}</b><small>${formatState(hass, entityId, t.lang)}</small>`
                : html`<small>${t("find.none")}</small>`}
            </span>
            <span class="buttons">
              <button type="button" class="mini-btn" @click=${() => this.pickRole(role)}>
                <ha-icon icon="mdi:magnify"></ha-icon>${t(entityId ? "review.change" : "review.choose")}
              </button>
              ${entityId
                ? html`<button
                    type="button"
                    class="icon-btn"
                    aria-label=${t("f.remove")}
                    title=${t("f.remove")}
                    @click=${() => this.setRole(role, null)}
                  >
                    <ha-icon icon="mdi:close"></ha-icon>
                  </button>`
                : nothing}
            </span>
          </div>`;
        })}
      </div>
      </div>
      ${modeEntity
        ? html`<div data-tipped>
            <div class="sub">${t("f.battery.mode_options")} ${tip(t, "mode_options")}</div>
            <div class="rows">
              ${MODE_MEANINGS.map(
                (meaning) => html`<div class="row">
                  <label for="opt-${meaning}">${t(`meaning.${meaning}`)}</label>
                  <select
                    id="opt-${meaning}"
                    class="input"
                    @change=${(ev: Event) => this.setOption(meaning, (ev.target as HTMLSelectElement).value)}
                  >
                    <option value="" ?selected=${!value.mode_options[meaning]}>${t("meaning.none")}</option>
                    ${options.map(
                      (option) => html`<option value=${option} ?selected=${value.mode_options[meaning] === option}>${option}</option>`,
                    )}
                  </select>
                  <span></span>
                </div>`,
              )}
            </div>
            </div>`
        : nothing}
      <div class="note ${ready ? "" : "warn"} ready">
        <ha-icon icon=${ready ? "mdi:check-circle-outline" : "mdi:alert-outline"}></ha-icon>
        <span
          >${ready
            ? t("f.battery.control.ready", {
                charge: ways.charge.map((m) => t(`method.${m}` as TranslationKey)).join(", "),
                hold: ways.hold.map((m) => t(`method.${m}` as TranslationKey)).join(", "),
              })
            : t("f.battery.control.needs")}</span
        >
      </div>`;
  }

  /** Batteries of integrations steered by services: what Joe calls, read only. */
  private renderServiceSteps(t: Translate, value: ControlValue): TemplateResult {
    const hass = this.hass!;
    return html`<div data-tipped>
      <div class="sub">${t("f.battery.control.services")} ${tip(t, "control_steps")}</div>
      <div class="rows">
        ${STEP_NAMES.flatMap((name) =>
          (value.steps[name] ?? []).map(
            (step) => html`<div class="row">
              <span class="label">${t(`f.battery.steps.${name}`)}</span>
              <span class="entity">
                ${step.service
                  ? html`<b>${step.service}</b>`
                  : html`<b>${entityName(hass, step.entity_id ?? "")}</b><small>${String(step.value ?? "")}</small>`}
              </span>
              <span></span>
            </div>`,
          ),
        )}
      </div>
    </div>`;
  }

  private renderSteps(t: Translate, value: ControlValue): TemplateResult {
    const hass = this.hass!;
    return html`<div class="sub" data-tipped>${t("f.battery.control.steps")} ${tip(t, "control_steps")}</div>
      <p class="field-hint">${t("f.battery.steps.hint")}</p>
      ${STEP_NAMES.map((name) => {
        const steps = value.steps[name] ?? [];
        return html`<div class="sub">${t(`f.battery.steps.${name}`)}</div>
          <div class="rows" data-tipped>
            ${steps.map(
              (step, index) => html`<div class="row">
                <span class="entity"
                  ><b>${step.service ?? entityName(hass, step.entity_id ?? "")}</b><small>${step.entity_id ?? ""}</small></span
                >
                <input
                  class="input step-value"
                  type="text"
                  aria-label=${t("f.battery.steps.value")}
                  placeholder=${t("f.battery.steps.value")}
                  list="values-${name}-${index}"
                  .value=${step.value == null ? "" : String(step.value)}
                  @change=${(ev: Event) => this.setStep(name, index, (ev.target as HTMLInputElement).value)}
                />
                <datalist id="values-${name}-${index}">
                  ${this.valueHints(step.entity_id ?? "", name).map((hint) => html`<option value=${hint}></option>`)}
                </datalist>
                <button
                  type="button"
                  class="icon-btn"
                  aria-label=${t("f.remove")}
                  title=${t("f.remove")}
                  @click=${() => this.removeStep(name, index)}
                >
                  <ha-icon icon="mdi:close"></ha-icon>
                </button>
              </div>`,
            )}
            <div>
              <button type="button" class="mini-btn" @click=${() => this.addStep(name)}>
                <ha-icon icon="mdi:plus"></ha-icon>${t("f.battery.steps.add")}
              </button>
              ${tip(t, "control_steps")}
            </div>
          </div>`;
      })}`;
  }

  private valueHints(entityId: string, name: StepName): string[] {
    const domain = entityId.split(".", 1)[0];
    if (["switch", "input_boolean"].includes(domain)) return ["on", "off"];
    if (["select", "input_select"].includes(domain)) {
      return (this.hass?.states[entityId]?.attributes.options as string[] | undefined) ?? [];
    }
    if (["number", "input_number"].includes(domain)) {
      return name === "charge" ? ["{target}", "{power}"] : name === "hold" ? ["{floor}"] : [];
    }
    return [];
  }

  private choose(choice: Choice): void {
    const value = this.value!;
    if (choice === "watch") {
      this.emit({ ...value, adapter: "none" });
    } else if (choice === "profile") {
      const key = this.profileKey!;
      const fromBattery = this.battery?.adapter === key ? this.battery : undefined;
      this.emit({
        ...value,
        adapter: key,
        controls: { ...(fromBattery?.controls ?? this.found?.controls ?? value.controls) },
        mode_options: { ...(fromBattery?.mode_options ?? {}) },
      });
    } else if (choice === "generic") {
      const empty = !Object.keys(value.controls).length;
      const suggested = this.found?.suggested;
      this.emit({
        ...value,
        adapter: "generic",
        controls: empty && suggested ? { ...suggested.controls } : value.controls,
        mode_options: empty && suggested ? { ...suggested.mode_options } : value.mode_options,
      });
    } else {
      this.emit({ ...value, adapter: "steps" });
    }
  }

  private takeSuggestion(): void {
    const suggested = this.found?.suggested;
    if (suggested) {
      this.emit({
        ...this.value!,
        adapter: "generic",
        controls: { ...suggested.controls },
        mode_options: { ...suggested.mode_options },
      });
    }
  }

  private async pickRole(role: ControlRole): Promise<void> {
    const t = this.t!;
    const current = this.value!.controls[role];
    const picked = await pickEntity(this, {
      heading: t("pick.role.title", { role: t(`role.${role}`) }),
      tip: "control_roles",
      filter: ROLE_FILTER[role],
      selected: current ? [current] : [],
      suggestions: this.nearby(ROLE_FILTER[role]).map((entity_id) => ({ entity_id })),
    });
    if (picked?.selected[0]) {
      this.setRole(role, picked.selected[0]);
    }
  }

  /** Entities of the battery's own device first. */
  private nearby(filter: FilterName): string[] {
    const hass = this.hass!;
    const device = this.battery?.device_id;
    if (!device) return [];
    const domains: Record<string, string[]> = {
      level: ["number", "input_number"],
      setpoint: ["number", "input_number"],
      toggle: ["switch", "input_boolean"],
      option: ["select", "input_select"],
      writable: ["number", "switch", "select", "script", "button"],
    };
    const wanted = domains[filter] ?? [];
    return Object.values(hass.entities ?? {})
      .filter((entry) => entry.device_id === device && wanted.includes(entry.entity_id.split(".", 1)[0]))
      .map((entry) => entry.entity_id);
  }

  private setRole(role: ControlRole, entityId: string | null): void {
    const value = this.value!;
    const controls = { ...value.controls };
    if (entityId) {
      controls[role] = entityId;
    } else {
      delete controls[role];
    }
    const mode_options = role === "mode" && !entityId ? {} : value.mode_options;
    this.emit({ ...value, adapter: value.adapter === "none" ? "generic" : value.adapter, controls, mode_options });
  }

  private setOption(meaning: ModeMeaning, option: string): void {
    const value = this.value!;
    const mode_options = { ...value.mode_options };
    if (option) {
      mode_options[meaning] = option;
    } else {
      delete mode_options[meaning];
    }
    this.emit({ ...value, mode_options });
  }

  private async addStep(name: StepName): Promise<void> {
    const t = this.t!;
    const picked = await pickEntity(this, {
      heading: t("pick.step.title"),
      tip: "control_steps",
      filter: "writable",
      selected: [],
    });
    const entityId = picked?.selected[0];
    if (!entityId) return;
    const hints = this.valueHints(entityId, name);
    const step: ControlStep = { entity_id: entityId, value: hints[0] ?? null };
    const value = this.value!;
    this.emit({ ...value, steps: { ...value.steps, [name]: [...(value.steps[name] ?? []), step] } });
  }

  private setStep(name: StepName, index: number, raw: string): void {
    const value = this.value!;
    const steps = [...(value.steps[name] ?? [])];
    const number = Number(raw.replace(",", "."));
    const parsed = raw.trim() === "" ? null : raw.startsWith("{") || Number.isNaN(number) ? raw.trim() : number;
    steps[index] = { ...steps[index], value: parsed };
    this.emit({ ...value, steps: { ...value.steps, [name]: steps } });
  }

  private removeStep(name: StepName, index: number): void {
    const value = this.value!;
    const steps = (value.steps[name] ?? []).filter((_, i) => i !== index);
    this.emit({ ...value, steps: { ...value.steps, [name]: steps } });
  }

  private emit(value: ControlValue): void {
    this.dispatchEvent(new CustomEvent<ControlValue>("joe-control-change", { detail: value }));
  }
}

define("joe-battery-control", JoeBatteryControl);
