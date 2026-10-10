import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { tip } from "../../components/tip";
import { define } from "../../define";
import "../../editors/household";
import { formatNumber } from "../../entities";
import type { Translate } from "../../i18n";
import { PANEL, href, onLink, revealAnchor, type Route } from "../../router";
import { shared } from "../../styles/shared";
import { DAY_LABELS, type Check, type ClimateFound, type Discovery, type HomeAssistant, type JoeState, type PersonConfig } from "../../types";
import { daysUses, personUses, presenceUses } from "../../uses";
import { minuteClock, pageHead, todayIn } from "./head";
import { householdStyles } from "./styles";

/** Haushalt › Wer wohnt hier: the people, their calendars, and what Joe knows about each. */
export class JoeHhPeople extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;
  @property({ attribute: false }) route?: Route;
  @property({ attribute: false }) prefix = PANEL;
  @property({ attribute: false }) discovery?: Discovery;
  @property({ attribute: false }) checks: Check[] = [];
  @property({ attribute: false }) climateFound?: ClimateFound;
  /** The person the address names (/household/people/<id>): scrolled to and lit up. */
  @property({ attribute: false }) person?: string;

  static styles = [
    shared,
    householdStyles,
    css`
      .list-head {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 22px 0 10px;
      }
      .list-head .eyebrow {
        flex: 1;
      }
      .extra {
        display: grid;
        gap: 2px;
        margin-top: 10px;
        padding-top: 8px;
        border-top: 1px solid var(--joe-line);
      }
      .days {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
        color: var(--joe-ink);
      }
      .extra .mirror {
        padding: 2px 0;
      }
      .extra .used-by {
        margin-top: 0;
      }
    `,
  ];

  protected render() {
    const { t, state: joe } = this;
    if (!t || !joe || !this.hass) {
      return nothing;
    }
    const config = joe.config;
    const uses = [...presenceUses(t, config, this.climateFound), ...daysUses(t, config, this.climateFound)];
    // A person removed meanwhile keeps the old address: say so instead of an empty jump.
    const lost = Boolean(this.person && !config.persons.some((p) => p.id === this.person));
    return html`<div class="wrap">
      ${pageHead(
        t,
        this.prefix,
        t("household.people.title"),
        t("household.people.lead"),
        uses.filter((use, i) => uses.findIndex((u) => u.label === use.label) === i),
      )}
      ${lost
        ? html`<div class="note warn" role="status">
            <ha-icon icon="mdi:help-circle-outline"></ha-icon><span>${t("nav.not_found.person")}</span>
          </div>`
        : nothing}
      <div class="list-head">
        <span class="eyebrow"><ha-icon icon="mdi:account-group-outline"></ha-icon>${t("household.people.list")}</span>
        ${tip(t, "ha_open")}
      </div>
      <joe-household-people
        detailed
        .hass=${this.hass}
        .t=${t}
        .config=${config}
        .discovery=${this.discovery}
      >
        ${config.persons.map((person) => this.renderExtra(t, joe, person))}
      </joe-household-people>
    </div>`;
  }

  /** Below each person: today and tomorrow, their calendar rules, whose charging counts them, what Joe learned. */
  private renderExtra(t: Translate, joe: JoeState, person: PersonConfig): TemplateResult {
    const config = joe.config;
    const day = joe.climate?.day;
    // A plan from an earlier day does not know tomorrow.
    const outlook = joe.plan?.meta?.tomorrow;
    const tomorrow = outlook && outlook.date > todayIn(this.hass?.config?.time_zone) ? outlook : undefined;
    const parts: string[] = [];
    if (day?.home_office_available && day.labels_state !== "error" && day.home_office.includes(person.name)) {
      parts.push(t("household.people.today", { label: t("label.home_office") }));
    }
    const next = tomorrow?.labels[person.id];
    if (next) {
      parts.push(t("household.people.tomorrow", { label: t(`label.${next}`) }));
    }
    const hasCalendars = person.calendars.length > 0;
    const cars = personUses(t, config, person.id);
    const learned = config.learned.presence?.[person.id] ?? {};
    const hours = DAY_LABELS.filter((label) => learned[label]).map((label) =>
      t("learn.presence.value", { label: t(`label.${label}`), hours: formatNumber(t.lang, learned[label]!.hours, 0) }),
    );
    const usual = person.person_entity ? joe.climate?.usual?.[person.person_entity] : undefined;
    if (usual != null) {
      hours.push(t("household.people.usual", { time: minuteClock(usual) }));
    }
    const rulesTo: Route = { tab: "household", section: "days", id: person.id };
    const learnTo: Route = { tab: "review", section: "learned", id: "presence" };
    return html`<div class="extra" slot=${`p:${person.id}`}>
      ${parts.length ? html`<p class="days">${parts.join(" · ")}</p>` : nothing}
      ${hasCalendars
        ? html`${this.mirror(
              t("household.people.rules"),
              t(person.calendar ? "household.people.rules.own" : "household.people.rules.shared"),
              rulesTo,
              t("mirror.change"),
            )}
            <p class="used-by ${cars.length ? "" : "none"}">
              <ha-icon icon=${cars.length ? "mdi:car-clock" : "mdi:link-variant-off"}></ha-icon>
              ${cars.length
                ? html`<span class="used-by-label">${t("household.people.counts")}</span>
                    ${cars.map(
                      (use) =>
                        html`<a class="used-by-item" href=${href(this.prefix, use.to!)} @click=${onLink(use.to!)}
                          >${use.label}</a
                        >`,
                    )}`
                : t("household.people.counts.none")}
            </p>`
        : nothing}
      ${this.mirror(
        t("household.people.learned"),
        person.person_entity ? (hours.length ? hours.join(" · ") : t("household.people.learned.none")) : t("learn.presence.no_person"),
        learnTo,
        t("household.people.more"),
      )}
    </div>`;
  }

  /** A read-only line with a jump: "Label · value  Link →". */
  private mirror(label: string, value: string, to: Route, link: string): TemplateResult {
    return html`<div class="mirror">
      <div class="mirror-text">
        <span class="mirror-label">${label}</span>
        <span class="mirror-sep" aria-hidden="true">·</span>
        <span class="mirror-value">${value}</span>
      </div>
      <a class="mini-btn go mirror-go" href=${href(this.prefix, to)} @click=${onLink(to)}>${link}</a>
    </div>`;
  }

  /** The person last scrolled to, so a new state does not scroll again. */
  private revealed?: string;

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has("person")) {
      this.revealed = undefined;
    }
  }

  protected updated(): void {
    const known = this.state?.config.persons.some((p) => p.id === this.person);
    if (this.person && known && this.revealed !== this.person) {
      void this.reveal(this.person);
    }
  }

  /** The person cards live inside <joe-household-people>: wait for it, then scroll there. */
  private async reveal(id: string): Promise<void> {
    const people = this.renderRoot.querySelector<LitElement>("joe-household-people");
    if (!people) {
      return;
    }
    await people.updateComplete;
    if (people.shadowRoot && revealAnchor(people.shadowRoot, id)) {
      this.revealed = id;
    }
  }
}

define("joe-hh-people", JoeHhPeople);
