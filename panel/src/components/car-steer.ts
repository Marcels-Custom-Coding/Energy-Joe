import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { actionFieldStyles, calendarFields, DEFAULT_NEED, entityBox, field, needEntityFields, needFields, type NeedHost } from "./action-fields";
import { tip } from "./tip";
import { pickEntity, saveConfig } from "../config";
import { define } from "../define";
import type { Translate } from "../i18n";
import { PANEL } from "../router";
import { shared } from "../styles/shared";
import type { CarConfig, CarNeedConfig, Discovery, HomeAssistant, JoeConfig, JoeState } from "../types";

// One block of a car's settings on its page (Steuern, Termine, sensors chosen
// by hand), each with its own draft and Speichern/Abbrechen like the night
// actions (components/action-steer.ts).

export type CarLayout = "need" | "calendars" | "manual";

/** Unsaved drafts per car and block while the panel is open; `base` is what the draft started from. */
const DRAFTS = new Map<string, { base: CarConfig; draft: CarConfig; pending: boolean }>();

const same = (a: unknown, b: unknown) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

/** Only what changed (the need field by field), so two blocks never undo each other. */
export function carChanges(saved: CarConfig, draft: CarConfig): Record<string, unknown> {
  const patch: Record<string, unknown> = {};
  for (const key of Object.keys(draft) as (keyof CarConfig)[]) {
    if (key === "id" || same(draft[key], saved[key])) continue;
    if (key === "need") {
      const need: Record<string, unknown> = {};
      for (const [name, value] of Object.entries(draft.need)) {
        if (!same(value, (saved.need as unknown as Record<string, unknown>)[name])) need[name] = value;
      }
      patch.need = need;
    } else {
      patch[key] = draft[key];
    }
  }
  return patch;
}

function withChanges(car: CarConfig, changes: Record<string, unknown>): CarConfig {
  const next = { ...car, ...changes } as CarConfig;
  if (changes.need) {
    next.need = { ...car.need, ...(changes.need as Partial<CarNeedConfig>) };
  }
  return next;
}

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

/** <joe-car-steer .car .section>: one block of a car's settings with its own Speichern. */
export class JoeCarSteer extends LitElement implements NeedHost {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;
  @property({ attribute: false }) discovery?: Discovery;
  @property({ attribute: false }) prefix = PANEL;
  @property({ attribute: false }) car?: CarConfig;
  @property({ attribute: false }) section: CarLayout = "need";

  @state() private saving = false;
  @state() private problem = "";
  @state() private version = 0;

  static styles = [
    shared,
    actionFieldStyles,
    css`
      :host {
        display: block;
      }
      .steer-bar {
        position: sticky;
        bottom: 0;
        z-index: 1;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
        margin: 18px -4px 0;
        padding: 12px 4px;
        background: var(--joe-surface);
        border-top: 1px solid var(--joe-line);
      }
      .steer-bar .unsaved {
        flex-basis: 100%;
        color: var(--joe-ink-2);
        font-weight: 600;
      }
      .steer-bar .with-tip {
        gap: 8px;
      }
      :host > .fields > .field:first-child {
        margin-top: 0;
      }
      .time {
        width: 120px;
      }
    `,
  ];

  get config(): JoeConfig | undefined {
    return this.state?.config;
  }

  get mailboxes() {
    return this.state?.mailbox;
  }

  get accounts() {
    return this.state?.accounts;
  }

  get apps() {
    return this.state?.apps;
  }

  get existing(): CarConfig | undefined {
    return this.car;
  }

  private get key(): string {
    return `${this.car?.id ?? ""}|${this.section}`;
  }

  private get changes(): Record<string, unknown> {
    const stored = DRAFTS.get(this.key);
    return stored ? carChanges(stored.base, stored.draft) : {};
  }

  get draft(): CarConfig | undefined {
    const car = this.car;
    return car && DRAFTS.has(this.key) ? withChanges(car, this.changes) : car;
  }

  private get dirty(): boolean {
    const stored = DRAFTS.get(this.key);
    return Boolean(stored && !stored.pending && this.car && Object.keys(carChanges(this.car, this.draft!)).length);
  }

  setDraft(change: Partial<CarConfig>): void {
    const car = this.car;
    const draft = this.draft;
    if (!car || !draft) return;
    DRAFTS.set(this.key, { base: structuredClone(car), draft: { ...draft, ...change }, pending: false });
    this.problem = "";
    this.version++;
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has("car") && DRAFTS.get(this.key)?.pending) {
      DRAFTS.delete(this.key);
    }
  }

  protected render() {
    const { t, hass, draft } = this;
    if (!t || !hass || !draft) {
      return nothing;
    }
    void this.version;
    return html`<div class="fields">${this.fields(t, draft)}</div>
      ${this.problem ? html`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.problem}</span></div>` : nothing}
      ${this.dirty
        ? html`<div class="steer-bar" role="region" aria-label=${t("action.steer.unsaved")}>
            <span class="unsaved">${t("action.steer.unsaved")}</span>
            <span class="with-tip" data-tipped>
              <button type="button" class="btn btn-primary" ?disabled=${this.saving} @click=${this.save}>${t("common.save")}</button>
              ${tip(t, "car_save")}
            </span>
            <button type="button" class="btn btn-ghost" data-notip ?disabled=${this.saving} @click=${this.cancel}>${t("common.cancel")}</button>
          </div>`
        : nothing}`;
  }

  private fields(t: Translate, draft: CarConfig): TemplateResult {
    if (this.section === "calendars") {
      return calendarFields(this);
    }
    if (this.section === "manual") {
      return html`${needEntityFields(this)}
      ${field(
        t,
        t("car.f.tracker"),
        "car_tracker",
        entityBox(this, draft.tracker_entity ?? "", () => this.pickTracker()),
      )}`;
    }
    return html`${needFields(this)}
      ${field(
        t,
        t("car.f.refresh"),
        "car_refresh",
        html`<div class="row">
          <button
            type="button"
            class="switch"
            role="switch"
            aria-checked=${String(draft.refresh !== false)}
            aria-label=${t("car.f.refresh")}
            @click=${() => this.setDraft({ refresh: this.draft!.refresh === false })}
          ></button>
          <span>${t(draft.refresh !== false ? "car.f.refresh.on" : "car.f.refresh.off")}</span>
        </div>`,
      )}
      ${field(
        t,
        t("car.f.remind"),
        "car_remind",
        html`<div class="row">
          <button
            type="button"
            class="switch"
            role="switch"
            aria-checked=${String(draft.remind)}
            aria-label=${t("car.f.remind")}
            @click=${() => this.setDraft({ remind: !this.draft!.remind })}
          ></button>
          <span>${t("car.f.remind_at")}</span>
          <input
            class="input time"
            type="time"
            aria-label=${t("car.f.remind_time")}
            ?disabled=${!draft.remind}
            .value=${draft.remind_time}
            @change=${(ev: Event) => {
              const value = (ev.target as HTMLInputElement).value;
              if (TIME.test(value)) this.setDraft({ remind_time: value });
            }}
          />
        </div>`,
      )}
      ${field(
        t,
        t("car.f.name"),
        "car_name",
        html`<input
          class="input"
          type="text"
          maxlength="60"
          .value=${draft.name}
          @change=${(ev: Event) => this.setDraft({ name: (ev.target as HTMLInputElement).value.trim() || draft.name })}
        />`,
      )}`;
  }

  private async pickTracker(): Promise<void> {
    const t = this.t!;
    const picked = await pickEntity(this, {
      heading: t("car.pick.tracker"),
      tip: "car_tracker",
      filter: "presence",
      selected: this.draft?.tracker_entity ? [this.draft.tracker_entity] : [],
    });
    if (picked) {
      this.setDraft({ tracker_entity: picked.selected[0] ?? null });
    }
  }

  private cancel(): void {
    DRAFTS.delete(this.key);
    this.problem = "";
    this.version++;
  }

  private async save(): Promise<void> {
    const draft = this.draft;
    const car = this.car;
    if (!draft || !car) return;
    const patch = carChanges(car, draft);
    if (!Object.keys(patch).length) {
      this.cancel();
      return;
    }
    const key = this.key;
    this.saving = true;
    const ok = await saveConfig(this, { cars: { [car.id]: patch } });
    this.saving = false;
    if (ok) {
      DRAFTS.set(key, { base: structuredClone(car), draft, pending: true });
      this.version++;
    }
  }
}

/** A fresh car (the assistant "+ Hinzufügen › Auto"). */
export function newCar(name: string): Omit<CarConfig, "id"> {
  return { name, sources: [], tracker_entity: null, need: { ...DEFAULT_NEED }, remind: true, remind_time: "20:00", refresh: true };
}

define("joe-car-steer", JoeCarSteer);
