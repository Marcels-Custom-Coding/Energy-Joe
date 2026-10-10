import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { displayTitle } from "../components/bits";
import { tip } from "../components/tip";
import { saveConfig } from "../config";
import { define } from "../define";
import type { Translate } from "../i18n";
import "../pages/devices/battery-fields";
import { BATTERY_FIELDS, type BatteryFieldsChange, type BatteryValues } from "../pages/devices/battery-fields";
import { shared } from "../styles/shared";
import type { BatteryConfig, BatteryFloor, Discovery, HomeAssistant, JoeConfig, JoeInfo } from "../types";
import "./battery-control";
import { controlValue, withPrepare, type ControlValue } from "./battery-control";

type ControlDraft = ControlValue & { prepare: BatteryConfig["prepare"] };

const CONTROL_FIELDS = ["adapter", "controls", "mode_options", "steps", "prepare"] as const;

/**
 * One battery in a sheet of the first setup ("Umschauen › Ändern"): the same
 * fields as its page under Geräte › Speicher (pages/devices/battery-fields.ts
 * in draft mode) plus "Regler einrichten", saved together as one partial
 * patch. After the setup the battery has its own page.
 */
export class JoeBatteryEditor extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) config?: JoeConfig;
  @property({ attribute: false }) discovery?: Discovery;
  @property({ attribute: false }) info?: JoeInfo;
  @property({ attribute: false }) floor?: BatteryFloor;
  @property() batteryId = "";

  @state() private values?: BatteryValues;
  @state() private control?: ControlDraft;
  @state() private unknown = false;
  @state() private saving = false;

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
    `,
  ];

  private get battery(): BatteryConfig | undefined {
    return this.config?.batteries.find((b) => b.id === this.batteryId);
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    const battery = this.battery;
    if ((changed.has("config") || changed.has("batteryId")) && battery && !this.values) {
      this.values = Object.fromEntries(BATTERY_FIELDS.map((field) => [field, structuredClone(battery[field])])) as BatteryValues;
      this.control = { ...controlValue(battery), prepare: structuredClone(battery.prepare) };
      this.unknown = this.config?.answers[`capacity:${battery.id}`] === "unknown";
    }
  }

  protected render() {
    const { t, hass, config, values, control } = this;
    const battery = this.battery;
    if (!t || !hass || !config || !values || !control || !battery) {
      return nothing;
    }
    const found = this.discovery?.batteries.find((b) => b.id === battery.id);
    return html`<div class="sheet-title">${displayTitle(t("edit.battery.title", { name: battery.name }))}</div>
      <joe-battery-fields
        .hass=${hass}
        .t=${t}
        .config=${config}
        .battery=${battery}
        .floor=${this.floor}
        .draft=${values}
        .unknown=${this.unknown}
        @joe-battery-change=${(ev: CustomEvent<BatteryFieldsChange>) => {
          this.values = { ...values, ...ev.detail.change };
          if (ev.detail.unknown !== undefined) {
            this.unknown = ev.detail.unknown;
          }
        }}
      ></joe-battery-fields>
      <div class="field" data-tipped>
        <div class="field-label">${t("f.battery.control")} ${tip(t, "control_choice")}</div>
        <joe-battery-control
          .hass=${hass}
          .t=${t}
          .battery=${battery}
          .found=${found}
          .profiles=${this.info?.profiles}
          .value=${control as ControlValue}
          @joe-control-change=${(ev: CustomEvent<ControlValue>) => {
            this.control = withPrepare(battery, ev.detail, found);
          }}
        ></joe-battery-control>
      </div>
      <div class="actions" data-notip>
        <button type="button" class="btn btn-primary" ?disabled=${this.saving} @click=${this.save}>${t("common.save")}</button>
        <button type="button" class="btn btn-ghost" @click=${this.close}>${t("common.cancel")}</button>
      </div>`;
  }

  /** Only the changed fields (and the "lern es" answer), as one partial patch. */
  private async save(): Promise<void> {
    const battery = this.battery;
    const { config, values, control } = this;
    if (!battery || !config || !values || !control) {
      return;
    }
    const draft: Record<string, unknown> = { ...values, ...control };
    const changes: Record<string, unknown> = {};
    for (const field of [...BATTERY_FIELDS, ...CONTROL_FIELDS]) {
      if (JSON.stringify(battery[field] ?? null) !== JSON.stringify(draft[field] ?? null)) {
        changes[field] = draft[field];
      }
    }
    const answerKey = `capacity:${battery.id}`;
    const patch: Record<string, unknown> = {};
    if (Object.keys(changes).length) {
      patch.batteries = { [battery.id]: changes };
    }
    if ((config.answers[answerKey] === "unknown") !== this.unknown) {
      patch.answers = { [answerKey]: this.unknown ? "unknown" : null };
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
