import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { contextRow, findingList, findingStyles } from "../../components/finding-rows";
import { haOpen, haTarget } from "../../components/ha-open";
import { dayText } from "../../components/look-back";
import { tip } from "../../components/tip";
import { pickEntity, saveConfig } from "../../config";
import { define } from "../../define";
import { entityName } from "../../entities";
import type { Translate } from "../../i18n";
import { PANEL, href, navigate, onLink, revealAnchor, type Route } from "../../router";
import { shared } from "../../styles/shared";
import {
  DAY_LABELS,
  type CalendarConfig,
  type Check,
  type ClimateFound,
  type DayLabel,
  type Discovery,
  type HomeAssistant,
  type JoeState,
  type PersonConfig,
  type WeekTag,
} from "../../types";
import { daysUses } from "../../uses";
import { TAG_ICONS } from "../../week";
import { clockOf, pageHead, todayIn } from "./head";
import { householdStyles } from "./styles";

// Calendar labels in the order their rules are checked (the first match wins).
const RULE_ORDER: DayLabel[] = ["vacation", "travel", "home_office", "office", "guests", "home"];

/** The element that scrolls the page (the panel), across shadow roots. */
function scrollBox(from: Element): HTMLElement | null {
  let node: Node | null = from;
  while (node) {
    const parent: Node | null = node.parentNode instanceof ShadowRoot ? node.parentNode.host : node.parentNode;
    if (parent instanceof HTMLElement && parent.scrollTop > 0) {
      return parent;
    }
    node = parent;
  }
  return document.scrollingElement as HTMLElement | null;
}


/** Haushalt › Tage & Kalender: what kind of day it is, what makes a day off, and the calendar rules. */
export class JoeHhDays extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;
  @property({ attribute: false }) route?: Route;
  @property({ attribute: false }) prefix = PANEL;
  @property({ attribute: false }) discovery?: Discovery;
  @property({ attribute: false }) checks: Check[] = [];
  @property({ attribute: false }) climateFound?: ClimateFound;
  /** Whose calendar rules are shown (/household/days/<personId>); none: the ones for everyone. */
  @property({ attribute: false }) person?: string;

  @state() private keyword: Partial<Record<DayLabel, string>> = {};

  static styles = [
    shared,
    householdStyles,
    findingStyles,
    css`
      .preview {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
        margin-top: 12px;
      }
      .day {
        min-width: 0;
        padding: 12px 14px;
        border-radius: 12px;
        background: var(--joe-surface-2);
      }
      .day-head {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px 10px;
      }
      .day-head b {
        flex: 1 1 auto;
        font-weight: 700;
      }
      .day .now {
        margin-top: 8px;
      }
      .day ul {
        list-style: none;
        margin: 6px 0 0;
        padding: 0;
        display: grid;
        gap: 2px;
        font-size: 14px;
        color: var(--joe-ink-2);
      }
      .found {
        margin-top: 12px;
      }
      .sub {
        margin-top: 16px;
        padding-top: 12px;
        border-top: 1px solid var(--joe-line);
      }
      .sub-head {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 16px;
        font-size: 14px;
      }
      .scopes {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 10px;
      }
      .scopes a {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        min-height: 44px;
        padding: 6px 14px;
        border-radius: 999px;
        background: var(--joe-surface-2);
        color: var(--joe-ink-2);
        font-weight: 600;
        font-size: 14px;
        text-decoration: none;
        transition: background 0.12s, color 0.12s;
      }
      .scopes a:hover {
        background: var(--joe-line);
        color: var(--joe-ink);
      }
      .scopes a[aria-current="true"] {
        background: var(--joe-ink);
        color: var(--joe-bg);
      }
      .own-rules {
        --mdc-icon-size: 16px;
      }
      .toggle-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid var(--joe-line);
      }
      .rules {
        display: grid;
        gap: 2px;
        margin-top: 12px;
      }
      .rule {
        display: grid;
        grid-template-columns: 150px minmax(0, 1fr);
        gap: 6px 12px;
        align-items: center;
        padding: 8px 0;
        border-top: 1px solid var(--joe-line);
      }
      .rule:first-child {
        border-top: 0;
      }
      .keywords {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;
        min-width: 0;
      }
      .keyword {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        max-width: 100%;
        padding: 2px 4px 2px 10px;
        border-radius: 999px;
        background: var(--joe-surface-2);
        font-size: 13.5px;
        overflow-wrap: anywhere;
      }
      .keyword button {
        display: grid;
        place-items: center;
        flex: none;
        width: 26px;
        height: 26px;
        padding: 0;
        border: 0;
        border-radius: 50%;
        background: transparent;
        color: var(--joe-muted);
        cursor: pointer;
        transition: background 0.12s, color 0.12s;
      }
      .keyword button:hover {
        background: var(--joe-line);
        color: var(--joe-ink);
      }
      .keyword button:active {
        transform: scale(0.94);
      }
      .keyword ha-icon {
        --mdc-icon-size: 15px;
      }
      form.add {
        display: inline-flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px;
        max-width: 100%;
      }
      form.add .input {
        width: 150px;
        min-height: 34px;
        padding: 6px 10px;
      }
      .defaults {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
        margin-top: 8px;
      }
      .defaults .field {
        margin-top: 0;
      }
      @media (pointer: coarse) {
        .keyword {
          padding-block: 0;
        }
        .keyword button {
          width: 44px;
          height: 44px;
          margin-right: -4px;
        }
        form.add .input {
          min-height: 44px;
        }
      }
      @media (max-width: 760px) {
        .preview,
        .defaults,
        .rule {
          grid-template-columns: 1fr;
        }
      }
    `,
  ];

  protected render() {
    const { t, state: joe, hass } = this;
    if (!t || !joe || !hass) {
      return nothing;
    }
    return html`<div class="wrap">
      ${pageHead(t, this.prefix, t("household.days.title"), t("household.days.lead"), daysUses(t, joe.config, this.climateFound))}
      ${this.renderPreview(t, joe)} ${this.renderFree(t, hass, joe)} ${this.renderCalendar(t, joe)}
    </div>`;
  }

  /** Today and tomorrow as Joe sees them: workday or day off, who works from home, the situation. */
  private renderPreview(t: Translate, joe: JoeState): TemplateResult {
    const day = joe.climate?.day;
    const persons = joe.config.persons;
    const zone = this.hass?.config?.time_zone;
    const today = todayIn(zone);
    // A plan from an earlier day does not know tomorrow.
    const outlook = joe.plan?.meta?.tomorrow;
    const tomorrow = outlook && outlook.date > today ? outlook : undefined;
    const kind = !day ? null : day.holiday ? "holiday" : day.weekend && day.free ? "weekend" : "workday";
    // Only calendars that answered tell who works from home.
    const labels = day?.labels_state ?? (day?.labels_at ? "ok" : "unread");
    const read = labels === "ok" && day?.labels_at ? clockOf(t.lang, day.labels_at, zone) : null;
    const status = joe.climate;
    const todayTag: WeekTag | null = !day
      ? null
      : !status?.home.length && status?.nobody_since
        ? "away"
        : day.holiday
          ? "holiday"
          : day.home_office.length && !day.free
            ? "home_office"
            : "normal";
    let tomorrowTag: WeekTag | null = null;
    if (tomorrow) {
      const weekday = new Date(`${tomorrow.date}T12:00:00Z`).getUTCDay();
      const weekend = weekday === 0 || weekday === 6;
      tomorrowTag = !tomorrow.workday
        ? weekend
          ? "normal"
          : "holiday"
        : Object.values(tomorrow.labels).includes("home_office")
          ? "home_office"
          : "normal";
    }
    const situation = (tag: WeekTag | null) =>
      tag
        ? html`<span class="chip ${tag === "normal" ? "" : "soon"}"><ha-icon icon=${TAG_ICONS[tag]}></ha-icon>${t(`week.tag.${tag}`)}</span>`
        : nothing;
    return html`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:calendar-today"></ha-icon>${t("household.days.preview")}</div>
        ${tip(t, "household_days_preview")}
      </div>
      <div class="preview">
        <div class="day">
          <div class="day-head">
            <b>${t("household.days.preview.today")} · ${dayText(t.lang, today, "weekday")}</b>${situation(todayTag)}
          </div>
          ${kind ? html`<p class="now">${t(`climate.today.${kind}`)}</p>` : html`<p class="hint">${t("household.days.preview.unknown")}</p>`}
          ${day
            ? html`<p class="hint">
                ${day.home_office_available
                  ? labels !== "ok"
                    ? t(`climate.today.labels_${labels}`)
                    : day.home_office.length
                      ? t("climate.today.ho", { names: day.home_office.join(", ") })
                      : t("climate.today.ho_none")
                  : t(`week.ho.${day.home_office_reason ?? "no_calendar"}`)}
                ${read ? t("climate.today.read_at", { time: read }) : nothing}
              </p>`
            : nothing}
        </div>
        <div class="day">
          <div class="day-head">
            <b>${t("household.days.preview.tomorrow")}${tomorrow ? html` · ${dayText(t.lang, tomorrow.date, "weekday")}` : nothing}</b>${situation(
              tomorrowTag,
            )}
          </div>
          ${tomorrow
            ? html`<p class="now">${t(tomorrow.workday ? "household.days.preview.workday" : "household.days.preview.day_off")}</p>
                ${Object.keys(tomorrow.labels).length
                  ? html`<ul>
                      ${Object.entries(tomorrow.labels).map(
                        ([id, label]) =>
                          html`<li>
                            ${t("household.days.preview.person", {
                              name: persons.find((p) => p.id === id)?.name ?? id,
                              label: t(`label.${label}`),
                            })}
                          </li>`,
                      )}
                    </ul>`
                  : nothing}`
            : html`<p class="hint">${t("household.days.preview.no_plan")}</p>`}
        </div>
      </div>
    </section>`;
  }

  /** What makes a day off: the workday sensor, and entities that make today free as well. */
  private renderFree(t: Translate, hass: HomeAssistant, joe: JoeState): TemplateResult {
    const config = joe.config;
    const free = config.context.free_day_entities ?? [];
    return html`<section class="card">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:calendar-star"></ha-icon>${t("household.days.free")}</div>
      </div>
      ${findingList(t, [
        contextRow(this, hass, t, config, this.discovery, "holiday", (entity) => haOpen(t, haTarget(hass, entity, entityName(hass, entity)))),
      ])}
      <div class="sub" data-tipped>
        <div class="row">
          <span>${t("climate.today.free_by")}</span>
          ${tip(t, "climate_free_entities")}
        </div>
        <div class="row tight">
          <span class="chips-line">
            ${free.length
              ? free.map((entity) => {
                  const on = ["on", "true", "home"].includes(hass.states[entity]?.state ?? "");
                  return html`<span class="chip ${on ? "ok" : ""}" title=${entity}>${entityName(hass, entity)}</span>`;
                })
              : html`<small class="hint">${t("climate.today.free_none")}</small>`}
          </span>
          <button type="button" class="btn btn-secondary" @click=${() => void this.pickFree()}>
            ${t(free.length ? "climate.today.free_change" : "climate.today.free_pick")}
          </button>
        </div>
      </div>
    </section>`;
  }

  private async pickFree(): Promise<void> {
    const t = this.t;
    if (!t) return;
    const picked = await pickEntity(this, {
      heading: t("pick.free_day.title"),
      tip: "pick_free_day",
      filter: "toggle_like",
      multiple: true,
      selected: this.state?.config.context.free_day_entities ?? [],
    });
    if (picked) {
      void saveConfig(this, { context: { free_day_entities: picked.selected } });
    }
  }

  /** The rules that turn calendar events into day labels, for everyone or one person (the address says whom). */
  private renderCalendar(t: Translate, joe: JoeState): TemplateResult {
    const config = joe.config;
    const person = this.chosen();
    // A person without rules of their own follows the ones for everyone.
    const shared = !!person && !person.calendar;
    const calendar = person?.calendar ?? config.calendar;
    const byLabel = (label: DayLabel) => calendar.rules.filter((rule) => rule.label === label);
    const anyCalendar = config.persons.some((p) => p.calendars.length);
    const everyone: Route = { tab: "household", section: "days" };
    const people: Route = { tab: "household", section: "people" };
    return html`<section class="card" data-anchor="calendar" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:calendar-text-outline"></ha-icon>${t("learn.calendar")}</div>
        ${tip(t, "learn_calendar")}
      </div>
      <p class="say">${t("learn.calendar.say")}</p>
      ${anyCalendar
        ? nothing
        : html`<div class="note">
            <ha-icon icon="mdi:information-outline"></ha-icon>
            <span
              >${t("household.days.no_calendars")}
              <a href=${href(this.prefix, people)} @click=${onLink(people)}>${t("household.days.to_people")}</a></span
            >
          </div>`}
      ${config.persons.length
        ? html`<div data-tipped>
            <div class="sub-head"><b>${t("learn.calendar.for")}</b>${tip(t, "cal_person")}</div>
            <nav class="scopes" aria-label=${t("learn.calendar.for")}>
              <a href=${href(this.prefix, everyone)} aria-current=${String(!person)} @click=${(ev: MouseEvent) => this.choose(ev, everyone)}
                >${t("learn.calendar.everyone")}</a
              >
              ${config.persons.map((p) => {
                const to: Route = { tab: "household", section: "days", id: p.id };
                return html`<a href=${href(this.prefix, to)} aria-current=${String(p.id === person?.id)} @click=${(ev: MouseEvent) => this.choose(ev, to)}
                  >${p.name}${p.calendar
                    ? html`<ha-icon class="own-rules" icon="mdi:account-cog-outline" title=${t("household.days.own_rules")}></ha-icon>`
                    : nothing}</a
                >`;
              })}
            </nav>
          </div>`
        : nothing}
      ${this.person && !person
        ? html`<div class="note warn" role="status">
            <ha-icon icon="mdi:help-circle-outline"></ha-icon><span>${t("household.days.not_found")}</span>
          </div>`
        : nothing}
      ${person
        ? html`<div class="toggle-row" data-tipped>
            <span class="with-tip"><span id="cal-shared-label">${t("learn.calendar.shared")}</span>${tip(t, "cal_shared")}</span>
            <button
              type="button"
              class="switch"
              role="switch"
              aria-checked=${String(shared)}
              aria-labelledby="cal-shared-label"
              @click=${() => this.saveCalendar(person, shared ? structuredClone(config.calendar) : null)}
            ></button>
          </div>`
        : nothing}
      ${shared
        ? html`<p class="say">${t("learn.calendar.shared.say", { name: person!.name })}</p>`
        : html`<div class="rules">
              ${RULE_ORDER.map(
                (label) => html`<div class="rule">
                  <b>${t(`label.${label}`)}</b>
                  <div class="keywords">
                    ${byLabel(label).map(
                      (rule) =>
                        html`<span class="keyword"
                          >${rule.keyword}<button
                            type="button"
                            aria-label=${t("learn.calendar.remove", { keyword: rule.keyword })}
                            @click=${() => this.saveRules(calendar.rules.filter((r) => r !== rule))}
                          >
                            <ha-icon icon="mdi:close"></ha-icon></button
                        ></span>`,
                    )}
                    <form
                      class="add"
                      @submit=${(ev: Event) => {
                        ev.preventDefault();
                        this.addKeyword(calendar, label);
                      }}
                    >
                      <input
                        class="input"
                        .value=${this.keyword[label] ?? ""}
                        maxlength="40"
                        placeholder=${t("learn.calendar.keyword")}
                        aria-label=${t("learn.calendar.add_to", { label: t(`label.${label}`) })}
                        @input=${(ev: Event) => (this.keyword = { ...this.keyword, [label]: (ev.target as HTMLInputElement).value })}
                      />
                      <button type="submit" class="mini-btn" ?disabled=${!(this.keyword[label] ?? "").trim()}>
                        <ha-icon icon="mdi:plus"></ha-icon>${t("learn.calendar.add")}
                      </button>
                    </form>
                  </div>
                </div>`,
              )}
            </div>
            <div data-tipped>
              <div class="sub-head"><b>${t("learn.calendar.defaults")}</b>${tip(t, "cal_defaults")}</div>
              <div class="defaults">
                ${(["default_workday", "default_day_off"] as const).map(
                  (key) => html`<label class="field">
                    <span class="field-label">${t(`learn.calendar.${key}`)}</span>
                    <select
                      class="input"
                      @change=${(ev: Event) =>
                        this.saveCalendarPart({ [key]: (ev.target as HTMLSelectElement).value as DayLabel })}
                    >
                      ${DAY_LABELS.map(
                        (label) => html`<option value=${label} ?selected=${calendar[key] === label}>${t(`label.${label}`)}</option>`,
                      )}
                    </select>
                  </label>`,
                )}
              </div>
            </div>`}
    </section>`;
  }

  /**
   * Choosing whose rules: the address changes (replacing the last one), but the
   * page stays where it is – no jump to the top, no scrolling to the card.
   */
  private choose(ev: MouseEvent, to: Route): void {
    if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey || ev.button !== 0) {
      return;
    }
    ev.preventDefault();
    this.quiet = true;
    const box = scrollBox(this);
    const top = box?.scrollTop ?? 0;
    navigate(this, to, { replace: true });
    if (box) {
      box.scrollTop = top;
    }
  }

  /** The person the address names, if they live here. */
  private chosen(): PersonConfig | undefined {
    return this.person ? this.state?.config.persons.find((p) => p.id === this.person) : undefined;
  }

  private addKeyword(calendar: CalendarConfig, label: DayLabel): void {
    const keyword = (this.keyword[label] ?? "").trim().toLowerCase();
    if (!keyword || calendar.rules.some((rule) => rule.keyword.toLowerCase() === keyword && rule.label === label)) {
      return;
    }
    this.keyword = { ...this.keyword, [label]: "" };
    this.saveRules([...calendar.rules, { keyword, label }]);
  }

  /** Saves the rules in the order they are checked: by label, as shown. */
  private saveRules(rules: CalendarConfig["rules"]): void {
    const ordered = RULE_ORDER.flatMap((label) => rules.filter((rule) => rule.label === label));
    this.saveCalendarPart({ rules: ordered });
  }

  /** Changes the rules shown: those of the chosen person, or those for everyone. */
  private saveCalendarPart(part: Partial<CalendarConfig>): void {
    const person = this.chosen();
    if (person?.calendar) {
      this.saveCalendar(person, { ...person.calendar, ...part });
    } else {
      saveConfig(this, { calendar: part });
    }
  }

  /** Gives a person rules of their own, or (null) lets them follow the ones for everyone. */
  private saveCalendar(person: PersonConfig, calendar: CalendarConfig | null): void {
    saveConfig(this, { persons: { [person.id]: { calendar } } });
  }

  /** The person last scrolled to, so a new state does not scroll again. */
  private revealed?: string;
  /** The address changed by choosing on this page: no scrolling. */
  private quiet = false;

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has("person")) {
      this.revealed = this.quiet ? this.person : undefined;
      this.quiet = false;
      this.keyword = {};
    }
  }

  protected updated(): void {
    // An address with a person goes straight to the rules.
    if (this.person && this.revealed !== this.person && revealAnchor(this.renderRoot, "calendar")) {
      this.revealed = this.person;
    }
  }
}

define("joe-hh-days", JoeHhDays);
