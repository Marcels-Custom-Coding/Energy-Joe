import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { sectionChips, type SectionChip } from "../../components/section-chips";
import { define } from "../../define";
import type { Translate } from "../../i18n";
import { DEFAULT_SECTION, PANEL, SECTIONS, type HouseholdSection, type Route } from "../../router";
import { shared } from "../../styles/shared";
import type { Check, ClimateFound, Discovery, HomeAssistant, JoeInfo, JoeState } from "../../types";
import "./days";
import "./night";
import "./people";
import "./presence";
import "./travel";

const TAGS: Record<HouseholdSection, string> = {
  people: "joe-hh-people",
  presence: "joe-hh-presence",
  days: "joe-hh-days",
  night: "joe-hh-night",
  travel: "joe-hh-travel",
};

const ICONS: Record<HouseholdSection, string> = {
  people: "mdi:account-group-outline",
  presence: "mdi:home-account",
  days: "mdi:calendar-check-outline",
  night: "mdi:sleep",
  travel: "mdi:map-marker-path",
};

/** Haushalt: who lives here, who is home, what kind of day it is, bedtime, weather and ways. */
export class JoeHouseholdPage extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;
  @property({ attribute: false }) route?: Route;
  @property({ attribute: false }) prefix = PANEL;
  @property({ attribute: false }) discovery?: Discovery;
  @property({ attribute: false }) checks: Check[] = [];
  @property({ attribute: false }) climateFound?: ClimateFound;
  /** For the routing services Joe can use (Unterwegs & Wetter, Heimweg). */
  @property({ attribute: false }) info?: JoeInfo;

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
    `,
  ];

  protected render() {
    const t = this.t;
    if (!t || !this.state) {
      return nothing;
    }
    const section = (this.route?.section ?? DEFAULT_SECTION.household) as HouseholdSection;
    const chips: SectionChip[] = SECTIONS.household.map((id) => ({ id, label: t(`nav.household.${id}`), icon: ICONS[id] }));
    return html`${sectionChips(t, this.prefix, "household", chips, section)}${this.renderSection(section)}`;
  }

  private renderSection(section: HouseholdSection): TemplateResult {
    // A section that is not built yet shows nothing (an unknown element would refuse .prefix).
    if (!customElements.get(TAGS[section])) {
      return html``;
    }
    const { t, hass, state, prefix, route, discovery, checks, climateFound, info } = this;
    switch (section) {
      case "people":
        return html`<joe-hh-people
          .t=${t}
          .hass=${hass}
          .state=${state}
          .prefix=${prefix}
          .route=${route}
          .discovery=${discovery}
          .checks=${checks}
          .climateFound=${climateFound}
          .person=${route?.id}
        ></joe-hh-people>`;
      case "presence":
        return html`<joe-hh-presence
          .t=${t}
          .hass=${hass}
          .state=${state}
          .prefix=${prefix}
          .route=${route}
          .discovery=${discovery}
          .checks=${checks}
          .climateFound=${climateFound}
          .info=${info}
          .anchor=${route?.id}
        ></joe-hh-presence>`;
      case "days":
        return html`<joe-hh-days
          .t=${t}
          .hass=${hass}
          .state=${state}
          .prefix=${prefix}
          .route=${route}
          .discovery=${discovery}
          .checks=${checks}
          .climateFound=${climateFound}
          .person=${route?.id}
        ></joe-hh-days>`;
      case "night":
        return html`<joe-hh-night
          .t=${t}
          .hass=${hass}
          .state=${state}
          .prefix=${prefix}
          .route=${route}
          .discovery=${discovery}
          .checks=${checks}
          .climateFound=${climateFound}
        ></joe-hh-night>`;
      case "travel":
        return html`<joe-hh-travel
          .t=${t}
          .hass=${hass}
          .state=${state}
          .prefix=${prefix}
          .route=${route}
          .discovery=${discovery}
          .checks=${checks}
          .climateFound=${climateFound}
          .info=${info}
        ></joe-hh-travel>`;
    }
  }
}

define("joe-household-page", JoeHouseholdPage);
