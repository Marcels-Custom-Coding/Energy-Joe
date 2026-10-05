import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
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

  /** For the proposed helper: persons left out (all others are in), a guest switch. */
  @state() private leftOut: string[] = [];
  @state() private guest = true;
  @state() private creating = false;
  @state() private failed?: string;
  @state() private offerNew = false;

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
      .presence {
        margin-top: 16px;
        padding: 14px;
        border-radius: 12px;
        background: var(--joe-surface-2);
      }
      .presence p {
        margin: 6px 0 0;
        color: var(--joe-ink-2);
        font-size: 14px;
      }
      .guest {
        margin-top: 12px;
        padding-top: 10px;
        border-top: 1px solid var(--joe-line);
      }
      .guest code {
        display: block;
        margin-top: 4px;
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 12.5px;
        user-select: all;
      }
      .presence .row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        margin-top: 10px;
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
      ${this.renderPresence(t, hass, config)}
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

  /** "Someone is home": one helper of Home Assistant – Joe proposes to create it. */
  private renderPresence(t: Translate, hass: HomeAssistant, config: JoeConfig): TemplateResult {
    const entity = config.context.presence_entity;
    const head = html`<div class="with-tip"><b>${t("household.presence")}</b>${tip(t, "household_presence")}</div>`;
    if (entity) {
      const on = ["on", "home"].includes(hass.states[entity]?.state ?? "");
      return html`<div class="presence" data-tipped>
        ${head}
        <div class="row">
          <span class="chip ${on ? "ok" : ""}" title=${entity}>${entityName(hass, entity)}</span>
          <small>${t(on ? "household.presence.on" : "household.presence.off")}</small>
        </div>
        <p>${t(entity.startsWith("group.") ? "household.presence.yours_group" : "household.presence.yours")}</p>
        ${this.renderGuest(t, hass, config, entity)}
        <div class="row">
          <button type="button" class="mini-btn" @click=${() => void this.pickPresence()}>${t("household.presence.other")}</button>
          <button type="button" class="mini-btn quiet" @click=${() => saveConfig(this, { context: { presence_entity: null } })}>
            ${t("household.presence.stop")}
          </button>
        </div>
      </div>`;
    }
    const persons = config.persons.filter((p) => p.person_entity);
    const chosen = persons.filter((p) => !this.leftOut.includes(p.person_entity!));
    const found = presenceGroups(hass);
    if (found.length && !this.offerNew) {
      // The user has such a group already: offer it, not a new one.
      return html`<div class="presence" data-tipped>
        ${head}
        <p>${t("household.presence.found")}</p>
        ${found.map(
          (group) => html`<div class="row">
            <span class="chip" title=${group.entity_id}>${group.name}</span>
            <small>${group.members.join(", ")}</small>
            <button type="button" class="btn btn-primary" @click=${() => saveConfig(this, { context: { presence_entity: group.entity_id } })}>
              ${t("household.presence.use")}
            </button>
          </div>`,
        )}
        <div class="row">
          <button type="button" class="btn btn-ghost" @click=${() => (this.offerNew = true)}>${t("household.presence.new_instead")}</button>
        </div>
      </div>`;
    }
    return html`<div class="presence" data-tipped>
      ${head}
      <p>${t("household.presence.propose")}</p>
      <div class="row" role="group" aria-label=${t("household.presence.persons")}>
        ${persons.map((person) => {
          const on = !this.leftOut.includes(person.person_entity!);
          return html`<button
            type="button"
            class="mini-btn ${on ? "go" : "quiet"}"
            aria-pressed=${String(on)}
            @click=${() =>
              (this.leftOut = on
                ? [...this.leftOut, person.person_entity!]
                : this.leftOut.filter((e) => e !== person.person_entity))}
          >
            ${person.name}
          </button>`;
        })}
      </div>
      <div class="row">
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(this.guest)}
          aria-labelledby="presence-guest"
          @click=${() => (this.guest = !this.guest)}
        ></button>
        <span id="presence-guest">${t("household.presence.guest")}</span>
      </div>
      ${this.failed ? html`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.failed}</span></div>` : nothing}
      <div class="row">
        <button
          type="button"
          class="btn btn-primary"
          ?disabled=${this.creating || (!chosen.length && !this.guest)}
          @click=${() => void this.createPresence(chosen.map((p) => p.person_entity!))}
        >
          ${t(this.creating ? "household.presence.creating" : "household.presence.create")}
        </button>
        <button type="button" class="btn btn-ghost" @click=${() => void this.pickPresence()}>${t("household.presence.own")}</button>
      </div>
    </div>`;
  }

  /** Guest mode: the switch, whether its tracker is home, and whether the group counts it. */
  private renderGuest(t: Translate, hass: HomeAssistant, config: JoeConfig, presence: string): TemplateResult {
    const { guest_switch: guest, guest_tracker: tracker } = config.context;
    if (!guest || !tracker) {
      return html`<div class="guest" data-tipped>
        <div class="with-tip"><b>${t("household.guest")}</b>${tip(t, "household_guest")}</div>
        <p>${t("household.guest.offer")}</p>
        ${this.failed ? html`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.failed}</span></div>` : nothing}
        <div class="row">
          <button type="button" class="btn btn-secondary" ?disabled=${this.creating} @click=${() => void this.addGuest()}>
            ${t(this.creating ? "household.presence.creating" : "household.guest.create")}
          </button>
        </div>
      </div>`;
    }
    const on = hass.states[guest]?.state === "on";
    const members = hass.states[presence]?.attributes.entity_id as string[] | undefined;
    const inGroup = !members || members.includes(tracker);
    return html`<div class="guest" data-tipped>
      <div class="row">
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(on)}
          aria-labelledby="guest-label"
          @click=${() => void hass.callService?.("input_boolean", on ? "turn_off" : "turn_on", { entity_id: guest })}
        ></button>
        <b id="guest-label">${t("household.guest")}</b>
        <small>${t(hass.states[tracker]?.state === "home" ? "household.guest.home" : "household.guest.away")}</small>
        ${tip(t, "household_guest")}
      </div>
      ${inGroup
        ? nothing
        : html`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon>
            <span>${t("household.guest.add_to_group", { group: entityName(hass, presence) })}<code>- ${tracker}</code></span>
          </div>`}
    </div>`;
  }

  /** The switch, the tracker following it and the automation that links them – all Home Assistant's own. */
  private async createGuest(): Promise<string> {
    const { t, hass } = this;
    if (!t || !hass?.callApi || !hass.callService) throw new Error("no api");
    const created = await hass.callWS<{ id: string }>({
      type: "input_boolean/create",
      name: t("household.guest.name"),
      icon: "mdi:account-child-outline",
    });
    const guest = `input_boolean.${created.id}`;
    const tracker = `device_tracker.${GUEST_ID}`;
    await hass.callApi("POST", `config/automation/config/energy_joe_${GUEST_ID}`, {
      alias: t("household.guest.automation"),
      description: t("household.guest.automation_text", { guest, tracker }),
      triggers: [
        { trigger: "state", entity_id: guest },
        // Trackers like this one fall back to "not_home" after a few minutes without news.
        { trigger: "time_pattern", minutes: "/1" },
        { trigger: "homeassistant", event: "start" },
      ],
      conditions: [],
      actions: [
        {
          action: "device_tracker.see",
          data: {
            dev_id: GUEST_ID,
            host_name: t("household.guest.tracker_name"),
            location_name: `{{ 'home' if is_state('${guest}', 'on') else 'not_home' }}`,
          },
        },
      ],
      mode: "queued",
    });
    await hass.callService("device_tracker", "see", {
      dev_id: GUEST_ID,
      host_name: t("household.guest.tracker_name"),
      location_name: "not_home",
    });
    saveConfig(this, { context: { guest_switch: guest, guest_tracker: tracker } });
    return tracker;
  }

  private async addGuest(): Promise<void> {
    this.creating = true;
    this.failed = undefined;
    try {
      await this.createGuest();
    } catch (err) {
      this.failed = this.t!("household.presence.failed", { error: String((err as { message?: string })?.message ?? err) });
    } finally {
      this.creating = false;
    }
  }

  private async createPresence(persons: string[]): Promise<void> {
    const { t, hass } = this;
    if (!t || !hass) return;
    this.creating = true;
    this.failed = undefined;
    try {
      const guest = this.guest ? (this.config?.context.guest_tracker ?? (await this.createGuest())) : null;
      await hass.callWS({ type: "energy_joe/presence/create", name: t("household.presence.name"), persons, guest });
    } catch (err) {
      this.failed = t("household.presence.failed", { error: String((err as { message?: string })?.message ?? err) });
    } finally {
      this.creating = false;
    }
  }

  private async pickPresence(): Promise<void> {
    const t = this.t;
    if (!t) return;
    const current = this.config?.context.presence_entity;
    const picked = await pickEntity(this, {
      heading: t("pick.presence.title"),
      tip: "pick_presence",
      filter: "presence",
      selected: current ? [current] : [],
    });
    if (picked?.selected[0]) {
      saveConfig(this, { context: { presence_entity: picked.selected[0] } });
    }
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

/** The guest tracker's id: device_tracker.gast. */
const GUEST_ID = "gast";

/** Groups the user already has for "someone is home": members are persons or trackers. */
function presenceGroups(hass: HomeAssistant): { entity_id: string; name: string; members: string[] }[] {
  return Object.values(hass.states)
    .filter((state) => state.entity_id.startsWith("group."))
    .map((state) => ({ state, members: (state.attributes.entity_id as string[] | undefined) ?? [] }))
    .filter(({ members }) => members.length && members.every((m) => /^(person|device_tracker)\./.test(m)))
    .map(({ state, members }) => ({
      entity_id: state.entity_id,
      name: entityName(hass, state.entity_id),
      members: members.map((m) => entityName(hass, m)),
    }));
}

define("joe-household", JoeHousehold);
