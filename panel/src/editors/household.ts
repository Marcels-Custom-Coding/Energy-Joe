import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { tip } from "../components/tip";
import { isIgnored, pickEntity, saveConfig, withIgnored } from "../config";
import { define } from "../define";
import { entityName } from "../entities";
import type { Translate } from "../i18n";
import { shared } from "../styles/shared";
import type { Discovery, HomeAssistant, JoeConfig, PersonConfig } from "../types";

/**
 * The household: people with their presence and any number of calendars.
 * Every change is saved right away.
 */
export class JoeHousehold extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) config?: JoeConfig;
  @property({ attribute: false }) discovery?: Discovery;

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 8px;
      }
      li.person {
        padding: 12px 14px;
        border-radius: 12px;
        background: var(--joe-surface);
        box-shadow: inset 0 0 0 1px var(--joe-line);
      }
      .top {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        flex: none;
        display: grid;
        place-items: center;
        background: var(--joe-amber-soft);
        color: var(--joe-amber-text);
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 800;
        font-size: 20px;
      }
      .who {
        flex: 1;
        min-width: 0;
      }
      .who b {
        display: block;
        font-weight: 700;
      }
      .who small {
        color: var(--joe-ink-2);
        font-size: 13px;
      }
      .home {
        color: var(--joe-good) !important;
        font-weight: 600;
      }
      .cals {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
        margin-top: 10px;
      }
      .cal {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 6px 4px 10px;
        border-radius: 999px;
        background: var(--joe-info-soft);
        color: var(--joe-ink);
        font-size: 13px;
        font-weight: 600;
      }
      .cal button {
        width: 24px;
        height: 24px;
        border: 0;
        border-radius: 50%;
        display: grid;
        place-items: center;
        cursor: pointer;
        background: transparent;
        color: var(--joe-ink-2);
      }
      .cal button:hover {
        background: var(--joe-surface);
        color: var(--joe-ink);
      }
      .cal svg {
        width: 14px;
        height: 14px;
      }
      .cals-label {
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--joe-muted);
        margin-right: 2px;
      }
      .add {
        margin-top: 10px;
      }
      .others {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;
        margin-top: 12px;
        color: var(--joe-ink-2);
        font-size: 14px;
      }
      .empty {
        color: var(--joe-muted);
        margin: 0;
      }
    `,
  ];

  protected render() {
    const { t, hass, config } = this;
    if (!t || !hass || !config) {
      return nothing;
    }
    const outside = (this.discovery?.persons ?? []).filter(
      (p) => isIgnored(config, `person:${p.entity_id}`) && !config.persons.some((c) => c.id === p.entity_id),
    );
    return html`<div data-tipped>
      ${config.persons.length
        ? html`<ul>
            ${config.persons.map((person) => this.renderPerson(t, hass, person))}
          </ul>`
        : html`<p class="empty">${t("household.empty")}</p>`}
      <div class="with-tip add">
        <button type="button" class="mini-btn" @click=${this.addPerson}>
          <ha-icon icon="mdi:account-plus-outline"></ha-icon>${t("household.add")}
        </button>
        ${tip(t, "f_person_add")}
      </div>
      ${outside.length
        ? html`<div class="others">
            <span>${t("household.left_out")}</span>
            ${outside.map(
              (p) => html`<button type="button" class="mini-btn quiet" @click=${() => this.bringBack(p)}>
                <ha-icon icon="mdi:undo-variant"></ha-icon>${p.name}
              </button>`,
            )}
          </div>`
        : nothing}
    </div>`;
  }

  private renderPerson(t: Translate, hass: HomeAssistant, person: PersonConfig): TemplateResult {
    const state = person.person_entity ? hass.states[person.person_entity]?.state : undefined;
    const presence =
      state === "home"
        ? html`<small class="home">${t("household.home")}</small>`
        : state === "not_home"
          ? html`<small>${t("household.away")}</small>`
          : state
            ? html`<small>${t("household.zone", { zone: state })}</small>`
            : html`<small>${t("household.no_presence")}</small>`;
    return html`<li class="person">
      <div class="top">
        <span class="avatar" aria-hidden="true">${person.name.slice(0, 1).toUpperCase()}</span>
        <div class="who"><b>${person.name}</b>${presence}</div>
        <button type="button" class="mini-btn quiet" @click=${() => this.removePerson(person)}>
          ${t("household.remove")}
        </button>
      </div>
      <div class="cals">
        <span class="cals-label">${t("household.calendars")}</span>
        ${person.calendars.map(
          (calendar) => html`<span class="cal">
            ${entityName(hass, calendar)}
            <button
              type="button"
              aria-label=${t("household.calendar_remove", { name: entityName(hass, calendar) })}
              @click=${() => this.setCalendars(person, person.calendars.filter((c) => c !== calendar))}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </span>`,
        )}
        <button type="button" class="mini-btn" @click=${() => this.addCalendars(person)}>
          <ha-icon icon="mdi:calendar-plus"></ha-icon>${t("household.calendar_add")}
        </button>
        ${tip(t, "f_calendars")}
      </div>
    </li>`;
  }

  private async addPerson(): Promise<void> {
    const { t, config } = this;
    if (!t || !config) {
      return;
    }
    const picked = await pickEntity(this, {
      heading: t("pick.person.title"),
      tip: "pick_person",
      filter: "person",
      selected: [],
      exclude: config.persons.map((p) => p.person_entity).filter((id): id is string => Boolean(id)),
    });
    const entity = picked?.selected[0];
    if (!entity || !this.hass) {
      return;
    }
    const found = this.discovery?.persons.find((p) => p.entity_id === entity);
    saveConfig(this, {
      persons: { [entity]: { name: entityName(this.hass, entity), person_entity: entity, calendars: found?.calendars ?? [] } },
      answers: { ignored: withIgnored(config, `person:${entity}`, false) },
    });
  }

  private bringBack(found: { entity_id: string; name: string; calendars: string[] }): void {
    saveConfig(this, {
      persons: { [found.entity_id]: { name: found.name, person_entity: found.entity_id, calendars: found.calendars } },
      answers: { ignored: withIgnored(this.config!, `person:${found.entity_id}`, false) },
    });
  }

  private removePerson(person: PersonConfig): void {
    saveConfig(this, {
      persons: { [person.id]: null },
      answers: { ignored: withIgnored(this.config!, `person:${person.id}`, true) },
    });
  }

  private async addCalendars(person: PersonConfig): Promise<void> {
    const t = this.t;
    if (!t) {
      return;
    }
    const picked = await pickEntity(this, {
      heading: t("pick.calendar.title", { name: person.name }),
      tip: "pick_calendar",
      filter: "calendar",
      multiple: true,
      selected: person.calendars,
    });
    if (picked) {
      this.setCalendars(person, picked.selected);
    }
  }

  private setCalendars(person: PersonConfig, calendars: string[]): void {
    saveConfig(this, { persons: { [person.id]: { calendars } } });
  }
}

define("joe-household", JoeHousehold);
