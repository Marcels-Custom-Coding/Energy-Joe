import { html, nothing, type TemplateResult } from "lit";
import type { Translate } from "../i18n";
import type { BatteryNote } from "../types";
import { tip } from "./tip";

/** A note with the name of what it is about (a battery integration without a battery). */
type Note = BatteryNote & { name?: string };

/** Notes that keep Joe from steering (or from charging) look like a warning. */
function isWarning(code: string): boolean {
  return code.startsWith("cannot.") || code.startsWith("no_charge.") || code === "no_level";
}

/**
 * What the owner should know about steering a battery, in plain words: why
 * Joe sees it but cannot steer it yet and what to do ("cannot.…"), what he
 * cannot do with it ("no_charge.…"), what must be switched on first
 * ("needs.…") and entities switched off in Home Assistant ("enable"). Each
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
