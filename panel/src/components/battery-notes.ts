import { html, nothing, type TemplateResult } from "lit";
import { formatNumber } from "../entities";
import type { Translate } from "../i18n";
import type { BatteryConfig, BatteryNote, ControlView } from "../types";
import { tip } from "./tip";

/**
 * A battery Joe measured charging much slower from the grid than planned
 * (control.night_slow): what he saw, what it probably means and what to do,
 * with a hint for the inverter where he knows it (Fronius).
 */
export function slowNote(t: Translate, battery: BatteryConfig, control: ControlView | undefined): TemplateResult | typeof nothing {
  const slow = control?.night_slow?.[battery.id];
  if (!slow) {
    return nothing;
  }
  const vars = {
    measured: formatNumber(t.lang, slow.measured_w / 1000, 1),
    planned: formatNumber(t.lang, slow.planned_w / 1000, 1),
  };
  const text = t.optional(`devices.slow.${battery.adapter}`, vars) ?? t("devices.slow", vars);
  return html`<div class="note warn" role="status"><ha-icon icon="mdi:speedometer-slow"></ha-icon><span>${text}</span></div>`;
}

/** A note with the name of what it is about (a battery integration without a battery). */
type Note = BatteryNote & { name?: string };

/** Notes that keep Joe from steering (or from charging) look like a warning. */
function isWarning(code: string): boolean {
  return code.startsWith("cannot.") || code.startsWith("check.") || code.startsWith("no_charge.") || code === "no_level";
}

/**
 * What the owner should know about steering a battery, in plain words: why
 * Joe sees it but cannot steer it yet and what to do ("cannot.…"), what he
 * cannot do with it ("no_charge.…"), what must be switched on first
 * ("needs.…"), levers of several inverters to check ("check.…") and
 * entities switched off in Home Assistant ("enable"). Each
 * note has its tooltip.
 */
export function batteryNotes(t: Translate, notes: Note[] | undefined, name = ""): TemplateResult | typeof nothing {
  if (!notes?.length) {
    return nothing;
  }
  return html`<div class="battery-notes" style="display:grid;gap:8px;margin:12px 0" data-tipped>
    ${notes.map((note) => {
      const entities = (note.entities ?? []).map((e) => `„${e.name}“`).join(", ") || t("bnote.entities.none");
      const text =
        t.optional(`bnote.${note.code}`, { name: note.name ?? name, entities }) ??
        t(note.code.startsWith("cannot.") ? "bnote.cannot.levers" : "bnote.other");
      const warn = isWarning(note.code);
      return html`<div class="note ${warn ? "warn" : ""}" role=${warn ? "status" : nothing}>
        <ha-icon icon=${warn ? "mdi:information-off-outline" : "mdi:information-outline"}></ha-icon>
        <span
          >${text}
          <div class="note-actions">${tip(t, "battery_notes")}</div></span
        >
      </div>`;
    })}
  </div>`;
}
