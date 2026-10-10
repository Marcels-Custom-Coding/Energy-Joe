import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { sectionChips, type SectionChip } from "../../components/section-chips";
import { define } from "../../define";
import type { Translate } from "../../i18n";
import { DEFAULT_SECTION, PANEL, SECTIONS, type ReviewSection, type Route } from "../../router";
import { shared } from "../../styles/shared";
import type { ClimateFound, HomeAssistant, JoeState } from "../../types";
import "./days";
import "./learned";
import "./log";
import "./result";

const TAGS: Record<ReviewSection, string> = {
  result: "joe-lookback-result",
  days: "joe-lookback-days",
  learned: "joe-lookback-learned",
  log: "joe-lookback-log",
};

const ICONS: Record<ReviewSection, string> = {
  result: "mdi:piggy-bank-outline",
  days: "mdi:calendar-month-outline",
  learned: "mdi:school-outline",
  log: "mdi:format-list-bulleted",
};

/** Rückblick: what it brought, the days, what Joe learned and what he switched. */
export class JoeLookbackPage extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;
  @property({ attribute: false }) route?: Route;
  @property({ attribute: false }) prefix = PANEL;
  @property({ attribute: false }) climateFound?: ClimateFound;

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
    const section = (this.route?.section ?? DEFAULT_SECTION.review) as ReviewSection;
    const chips: SectionChip[] = SECTIONS.review.map((id) => ({ id, label: t(`nav.review.${id}`), icon: ICONS[id] }));
    return html`${sectionChips(t, this.prefix, "review", chips, section)}${this.renderSection(section)}`;
  }

  private renderSection(section: ReviewSection): TemplateResult {
    // A section that is not built yet shows nothing (an unknown element would refuse .prefix).
    if (!customElements.get(TAGS[section])) {
      return html``;
    }
    const { t, hass, state, prefix, route, climateFound } = this;
    switch (section) {
      case "result":
        return html`<joe-lookback-result
          .t=${t}
          .hass=${hass}
          .state=${state}
          .prefix=${prefix}
          .route=${route}
          .climateFound=${climateFound}
        ></joe-lookback-result>`;
      case "days":
        return html`<joe-lookback-days
          .t=${t}
          .hass=${hass}
          .state=${state}
          .prefix=${prefix}
          .route=${route}
          .climateFound=${climateFound}
          .day=${route?.id}
        ></joe-lookback-days>`;
      case "learned":
        return html`<joe-lookback-learned
          .t=${t}
          .hass=${hass}
          .state=${state}
          .prefix=${prefix}
          .route=${route}
          .climateFound=${climateFound}
          .anchor=${route?.id}
        ></joe-lookback-learned>`;
      case "log":
        return html`<joe-lookback-log
          .t=${t}
          .hass=${hass}
          .state=${state}
          .prefix=${prefix}
          .route=${route}
          .climateFound=${climateFound}
          .group=${route?.id}
          .device=${route?.sub}
        ></joe-lookback-log>`;
    }
  }
}

define("joe-lookback-page", JoeLookbackPage);
