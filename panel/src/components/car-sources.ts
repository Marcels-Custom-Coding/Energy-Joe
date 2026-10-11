import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import "./car-steer";
import { subHead } from "./action-page";
import { tip } from "./tip";
import { sourceName } from "../cars";
import { saveConfig } from "../config";
import { define } from "../define";
import type { Translate } from "../i18n";
import { PANEL, navigate, type Route } from "../router";
import { shared } from "../styles/shared";
import type { CarConfig, CarRole, CarSourceConfig, Discovery, HomeAssistant, JoeConfig, JoeState } from "../types";

// A car's Quellen: the integrations merged into it (evcc's vehicle, the car
// maker's), "Trennen" and "Zusammenführen", Joe's question whether two cars
// are one, and the sensors chosen by hand.

const ROLES: CarRole[] = ["soc", "range", "odometer", "capacity", "consumption", "plugged", "outside_temp", "location"];

/** "Gehören „Kona“ aus evcc und „KONA“ aus Hyundai zusammen?" */
export function mergeQuestion(t: Translate, joe: JoeState, question: NonNullable<JoeState["cars"]>["merge"][number]): string {
  return t("car.merge.ask", {
    a: question.a_name,
    b: question.b_name,
    from: sourceName(t, { kind: "car", platform: question.b_platform, name: question.b_name }),
  });
}

/** The answers to "are these two one car?": one WS message each. */
type Message = { type: string; [key: string]: unknown };

export function mergeAnswers(question: { a: string; b: string }): { yes: Message; no: Message } {
  return {
    yes: { type: "energy_joe/car/merge", into: question.a, other: question.b },
    no: { type: "energy_joe/car/separate", a: question.a, b: question.b },
  };
}

export class JoeCarSources extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;
  @property({ attribute: false }) discovery?: Discovery;
  @property({ attribute: false }) prefix = PANEL;
  @property({ attribute: false }) car?: CarConfig;

  @state() private busy = false;
  @state() private failed = false;
  @state() private other = "";
  /** The sensors chosen by hand opened (a car with integrations shows them only on request). */
  @state() private manual = false;

  private chosenByHand(car: CarConfig): boolean {
    const need = car.need as unknown as Record<string, unknown>;
    return ["soc_entity", "range_entity", "capacity_entity", "odometer_entity", "consumption_entity"].some((f) => need[f]) || Boolean(car.tracker_entity);
  }

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      ul.sources {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 8px;
      }
      ul.sources li {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr);
        align-items: start;
        gap: 4px 12px;
        padding: 10px 12px;
        border-radius: 12px;
        background: var(--joe-surface-2);
      }
      ul.sources li > ha-icon {
        margin-top: 2px;
        color: var(--joe-ink-2);
      }
      .what {
        display: grid;
        gap: 2px;
        min-width: 0;
      }
      .what b {
        font-weight: 700;
        overflow-wrap: anywhere;
      }
      .what small {
        color: var(--joe-ink-2);
        font-size: 13px;
        line-height: 1.4;
      }
      .row {
        grid-column: 2;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
      }
      .ask {
        display: grid;
        gap: 10px;
        margin: 12px 0 0;
        padding: 12px;
        border-radius: 12px;
        background: var(--joe-amber-soft);
      }
      .ask p {
        margin: 0;
        font-weight: 600;
      }
      .merge {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        margin-top: 12px;
      }
      .merge select {
        flex: 1 1 160px;
        min-width: 0;
      }
      .muted {
        margin: 0;
        color: var(--joe-muted);
      }
      .bad {
        margin: 8px 0 0;
        color: var(--joe-warn, var(--joe-crit));
      }
      .mini-btn {
        min-height: 44px;
      }
      .by-hand {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    `,
  ];

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has("car") && changed.get("car")?.id !== this.car?.id) {
      this.other = "";
      this.manual = false;
    }
  }

  protected render() {
    const { t, state: joe, car } = this;
    if (!t || !joe || !car) {
      return nothing;
    }
    const others = (joe.config.cars ?? []).filter((c) => c.id !== car.id);
    const questions = (joe.cars?.merge ?? []).filter((q) => q.a === car.id || q.b === car.id);
    return html`${car.sources.length
        ? html`<ul class="sources">
            ${car.sources.map((source) => this.renderSource(t, car, source))}
          </ul>`
        : html`<p class="muted">${t("car.sources.none")}</p>`}
      ${questions.map(
        (q) => html`<div class="ask" role="group" data-tipped>
          <p>${mergeQuestion(t, joe, q)} ${tip(t, "car_merge")}</p>
          <div class="row">
            <button type="button" class="mini-btn go" ?disabled=${this.busy} @click=${() => this.send(mergeAnswers(q).yes, q.a)}>
              ${t("car.merge.yes")}
            </button>
            <button type="button" class="mini-btn quiet" ?disabled=${this.busy} @click=${() => this.send(mergeAnswers(q).no)}>
              ${t("car.merge.no")}
            </button>
          </div>
        </div>`,
      )}
      ${others.length
        ? html`<div class="merge" data-tipped>
            <select class="input" aria-label=${t("car.merge.with")} @change=${(ev: Event) => (this.other = (ev.target as HTMLSelectElement).value)}>
              <option value="" ?selected=${!this.other}>${t("car.merge.with")}</option>
              ${others.map((c) => html`<option value=${c.id} ?selected=${this.other === c.id}>${c.name}</option>`)}
            </select>
            <button
              type="button"
              class="mini-btn"
              ?disabled=${this.busy || !this.other}
              @click=${() => this.send({ type: "energy_joe/car/merge", into: car.id, other: this.other }, car.id)}
            >
              <ha-icon icon="mdi:call-merge"></ha-icon>${t("car.merge.do")}
            </button>
            ${tip(t, "car_merge_with")}
          </div>`
        : nothing}
      ${this.failed ? html`<p class="bad" role="status">${t("error.action")}</p>` : nothing}
      ${subHead(t("car.sources.manual"))}
      ${car.sources.length && !this.manual && !this.chosenByHand(car)
        ? html`<div class="by-hand" data-tipped>
            <button type="button" class="mini-btn quiet" aria-expanded="false" @click=${() => (this.manual = true)}>
              <ha-icon icon="mdi:chevron-down"></ha-icon>${t("car.sources.manual.open")}
            </button>
            ${tip(t, "car_manual")}
          </div>`
        : html`<p class="muted">${t("car.sources.manual.hint")}</p>
            <joe-car-steer
              .hass=${this.hass}
              .t=${t}
              .state=${joe}
              .discovery=${this.discovery}
              .prefix=${this.prefix}
              .car=${car}
              .section=${"manual"}
            ></joe-car-steer>`}`;
  }

  private renderSource(t: Translate, car: CarConfig, source: CarSourceConfig): TemplateResult {
    const roles = ROLES.filter((role) => source.entities[role]).map((role) => t(`car.role.${role}`));
    const from = sourceName(t, { kind: source.kind, platform: source.platform, name: source.name });
    return html`<li>
      <ha-icon icon=${source.kind === "evcc" ? "mdi:ev-station" : "mdi:car-connected"}></ha-icon>
      <span class="what">
        <b>${source.name ?? from}</b>
        <small>${t("car.source.from", { from })}${source.vehicle ? ` · ${t("car.source.vehicle", { id: source.vehicle })}` : ""}</small>
        <small>${roles.length ? t("car.source.gives", { roles: roles.join(", ") }) : t(source.kind === "evcc" ? "car.source.evcc_only" : "car.source.nothing")}</small>
      </span>
      ${car.sources.length > 1
        ? html`<span class="row" data-tipped>
            <button
              type="button"
              class="mini-btn quiet"
              ?disabled=${this.busy}
              @click=${() => this.send({ type: "energy_joe/car/split", car: car.id, source: source.id })}
            >
              <ha-icon icon="mdi:call-split"></ha-icon>${t("car.source.split")}
            </button>
            ${tip(t, "car_split")}
          </span>`
        : nothing}
    </li>`;
  }

  /** One answer: merge, keep apart or split; after a merge the page of the car that stays. */
  private async send(message: Message, stay?: string): Promise<void> {
    this.busy = true;
    this.failed = false;
    try {
      const result = (await this.hass?.callWS<{ car?: string } | null>(message)) ?? null;
      const target = result?.car ?? null;
      if (stay && target && target !== this.car?.id) {
        navigate(this, { tab: "devices", section: "car", id: target }, { replace: true });
      }
    } catch {
      this.failed = true;
    }
    this.busy = false;
  }
}

/** Löschen at the bottom of a car's page, with a question first. */
export class JoeCarDelete extends LitElement {
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) config?: JoeConfig;
  @property({ attribute: false }) car?: CarConfig;
  @property({ attribute: false }) leave?: Route;

  @state() private asking = false;
  @state() private busy = false;

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      .ask {
        margin: 0 0 12px;
        font-weight: 600;
      }
      .row {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
      }
    `,
  ];

  protected render() {
    const { t, car } = this;
    if (!t || !car) {
      return nothing;
    }
    if (!this.asking) {
      return html`<div class="row" data-tipped>
        <button type="button" class="btn btn-danger" @click=${() => (this.asking = true)}>${t("car.delete")}</button>
        ${tip(t, "car_delete")}
      </div>`;
    }
    return html`<div data-tipped>
      <p class="ask" role="alert">${t("car.delete.ask", { name: car.name })}</p>
      <div class="row">
        <button type="button" class="btn btn-danger" ?disabled=${this.busy} @click=${this.removeCar}>${t("action.delete.yes")}</button>
        <button type="button" class="btn btn-ghost" ?disabled=${this.busy} @click=${() => (this.asking = false)}>${t("action.delete.no")}</button>
        ${tip(t, "car_delete")}
      </div>
    </div>`;
  }

  private async removeCar(): Promise<void> {
    const car = this.car;
    if (!car) return;
    this.busy = true;
    // Joe would find the car again when he looks around: its integrations are left out from now on.
    const ignored = [...(this.config?.answers.ignored ?? [])];
    for (const source of car.sources) {
      const key = `car:${source.device_id ?? source.id}`;
      if (!ignored.includes(key)) ignored.push(key);
    }
    const ok = await saveConfig(this, { cars: { [car.id]: null }, answers: { ignored } });
    this.busy = false;
    if (ok && this.leave) {
      navigate(this, this.leave, { replace: true });
    }
  }
}

define("joe-car-sources", JoeCarSources);
define("joe-car-delete", JoeCarDelete);
