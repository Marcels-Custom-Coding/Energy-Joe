import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { sectionChips, type SectionChip } from "../../components/section-chips";
import { define } from "../../define";
import type { Translate } from "../../i18n";
import { DEFAULT_SECTION, PANEL, type DevicesSection, type Route } from "../../router";
import { shared } from "../../styles/shared";
import type { Check, ClimateFound, Discovery, HomeAssistant, JoeInfo, JoeState } from "../../types";
import "./all";
import "./climate";

const TAGS: Record<DevicesSection, string> = {
  all: "joe-devices-all",
  climate: "joe-climate-group",
};

const ICONS: Record<DevicesSection, string> = {
  all: "mdi:view-grid-outline",
  climate: "mdi:thermostat",
};

/** Geräte: everything with power, one chip per kind that exists here. */
export class JoeDevicesPage extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;
  @property({ attribute: false }) route?: Route;
  @property({ attribute: false }) prefix = PANEL;
  @property({ attribute: false }) discovery?: Discovery;
  @property({ attribute: false }) info?: JoeInfo;
  @property({ attribute: false }) checks: Check[] = [];
  @property({ attribute: false }) climateFound?: ClimateFound;

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
    `,
  ];

  /** Heizung & Klima gets a chip once there is something to steer or it is set up. */
  private get hasClimate(): boolean {
    const climate = this.state?.config.climate;
    return Boolean(this.climateFound?.devices.length || climate?.enabled || Object.keys(climate?.rooms ?? {}).length);
  }

  protected render() {
    const t = this.t;
    if (!t || !this.state) {
      return nothing;
    }
    const section = (this.route?.section ?? DEFAULT_SECTION.devices) as DevicesSection;
    const sections: DevicesSection[] = this.hasClimate || section === "climate" ? ["all", "climate"] : ["all"];
    const chips: SectionChip[] = sections.map((id) => ({ id, label: t(`nav.devices.${id}`), icon: ICONS[id] }));
    return html`${chips.length > 1 ? sectionChips(t, this.prefix, "devices", chips, section) : nothing}${this.renderSection(
      section,
    )}`;
  }

  private renderSection(section: DevicesSection): TemplateResult {
    // A section that is not built yet shows nothing (an unknown element would refuse .prefix).
    if (!customElements.get(TAGS[section])) {
      return html``;
    }
    const { t, hass, state, prefix, route, discovery, info, checks, climateFound } = this;
    switch (section) {
      case "all":
        return html`<joe-devices-all
          .t=${t}
          .hass=${hass}
          .state=${state}
          .prefix=${prefix}
          .route=${route}
          .discovery=${discovery}
          .info=${info}
          .checks=${checks}
          .climateFound=${climateFound}
        ></joe-devices-all>`;
      case "climate":
        return html`<joe-climate-group
          .t=${t}
          .hass=${hass}
          .state=${state}
          .prefix=${prefix}
          .route=${route}
          .discovery=${discovery}
          .info=${info}
          .checks=${checks}
          .climateFound=${climateFound}
          .entity=${route?.id}
        ></joe-climate-group>`;
    }
  }
}

define("joe-devices-page", JoeDevicesPage);
