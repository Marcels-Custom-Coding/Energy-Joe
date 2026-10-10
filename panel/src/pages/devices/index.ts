import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { sectionChips, type SectionChip } from "../../components/section-chips";
import { define } from "../../define";
import { buildDevices, GROUP_ICONS, groupProblem, groupsPresent, type DeviceEntry, type Group } from "../../device-model";
import { formatNumber } from "../../entities";
import type { Translate } from "../../i18n";
import { DEFAULT_SECTION, PANEL, type DevicesSection, type Route } from "../../router";
import { shared } from "../../styles/shared";
import type { Check, ClimateFound, Discovery, HomeAssistant, JoeInfo, JoeState } from "../../types";
import "./add";
import "./all";
import "./battery";
import "./car";
import "./climate";
import "./grid";
import "./hot-water";
import "./other";

/** The element of each section ("add" is a sheet over the page shown before). */
const TAGS: Record<Exclude<DevicesSection, "add">, string> = {
  all: "joe-devices-all",
  battery: "joe-battery-group",
  climate: "joe-climate-group",
  car: "joe-car-group",
  hot_water: "joe-hot-water-group",
  other: "joe-other-group",
  grid: "joe-grid-page",
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

  /** All devices, built once for every section. */
  private devices: DeviceEntry[] = [];
  /** The page under the "+ Hinzufügen" sheet: where it was opened, else Alle. */
  private behind: Route = { tab: "devices", section: "all" };

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
    `,
  ];

  protected willUpdate(changed: PropertyValues<this>): void {
    const inputs = ["t", "hass", "state", "climateFound", "discovery", "checks"] as const;
    if (this.t && this.state && inputs.some((name) => changed.has(name))) {
      this.devices = buildDevices(this.t, this.state, this.hass, {
        climateFound: this.climateFound,
        discovery: this.discovery,
        checks: this.checks,
      });
    }
    if (changed.has("route") && this.route && this.route.section !== "add") {
      this.behind = this.route;
    }
  }

  /** Heizung & Klima also gets its chip once it is switched on (before any device is found). */
  private chips(t: Translate, current: string): SectionChip[] {
    const groups = new Set<Group>(groupsPresent(this.devices));
    if (this.state?.config.climate?.enabled) groups.add("climate");
    if (current !== "all" && current !== "add") groups.add(current as Group);
    const chips: SectionChip[] = [{ id: "all", label: t("nav.devices.all"), icon: "mdi:view-grid-outline" }];
    for (const group of (["battery", "climate", "car", "hot_water", "other", "grid"] as const).filter((g) => groups.has(g))) {
      const count = group === "grid" ? 0 : this.devices.filter((d) => d.group === group).length;
      chips.push({
        id: group,
        label: t(`nav.devices.${group}`),
        icon: GROUP_ICONS[group],
        count: count ? formatNumber(t.lang, count, 0) : undefined,
        problem: groupProblem(this.devices, group),
      });
    }
    return chips;
  }

  protected render() {
    const t = this.t;
    if (!t || !this.state) {
      return nothing;
    }
    const section = (this.route?.section ?? DEFAULT_SECTION.devices) as DevicesSection;
    const adding = section === "add";
    const shown = adding ? this.behind : this.route;
    const current = (shown?.section ?? DEFAULT_SECTION.devices) as Exclude<DevicesSection, "add">;
    return html`${sectionChips(t, this.prefix, "devices", this.chips(t, current), current)}${this.renderSection(
      current,
      shown,
    )}${adding ? this.renderAdd() : nothing}`;
  }

  private renderSection(section: Exclude<DevicesSection, "add">, route: Route | undefined): TemplateResult {
    // A section that is not built yet shows nothing (an unknown element would refuse .prefix).
    if (!customElements.get(TAGS[section])) {
      return html``;
    }
    const { t, hass, state, prefix, discovery, info, checks, climateFound, devices } = this;
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
          .devices=${devices}
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
          .devices=${devices}
          .entity=${route?.id}
          .sub=${route?.sub}
        ></joe-climate-group>`;
      case "battery":
        return html`<joe-battery-group
          .t=${t}
          .hass=${hass}
          .state=${state}
          .prefix=${prefix}
          .route=${route}
          .discovery=${discovery}
          .info=${info}
          .checks=${checks}
          .climateFound=${climateFound}
          .devices=${devices}
          .device=${route?.id}
          .sub=${route?.sub}
        ></joe-battery-group>`;
      case "car":
        return html`<joe-car-group
          .t=${t}
          .hass=${hass}
          .state=${state}
          .prefix=${prefix}
          .route=${route}
          .discovery=${discovery}
          .info=${info}
          .checks=${checks}
          .climateFound=${climateFound}
          .devices=${devices}
          .device=${route?.id}
          .sub=${route?.sub}
        ></joe-car-group>`;
      case "hot_water":
        return html`<joe-hot-water-group
          .t=${t}
          .hass=${hass}
          .state=${state}
          .prefix=${prefix}
          .route=${route}
          .discovery=${discovery}
          .info=${info}
          .checks=${checks}
          .climateFound=${climateFound}
          .devices=${devices}
          .device=${route?.id}
          .sub=${route?.sub}
        ></joe-hot-water-group>`;
      case "other":
        return html`<joe-other-group
          .t=${t}
          .hass=${hass}
          .state=${state}
          .prefix=${prefix}
          .route=${route}
          .discovery=${discovery}
          .info=${info}
          .checks=${checks}
          .climateFound=${climateFound}
          .devices=${devices}
          .device=${route?.id}
          .sub=${route?.sub}
        ></joe-other-group>`;
      case "grid":
        return html`<joe-grid-page
          .t=${t}
          .hass=${hass}
          .state=${state}
          .prefix=${prefix}
          .route=${route}
          .discovery=${discovery}
          .info=${info}
          .checks=${checks}
          .climateFound=${climateFound}
          .devices=${devices}
          .anchor=${route?.id}
        ></joe-grid-page>`;
    }
  }

  /** The assistant "+ Hinzufügen" (/devices/add[/<kind>[/<consumerId>]]) over the page it was opened from. */
  private renderAdd(): TemplateResult {
    return html`<joe-device-add
      .t=${this.t}
      .hass=${this.hass}
      .state=${this.state}
      .prefix=${this.prefix}
      .route=${this.route}
      .discovery=${this.discovery}
      .devices=${this.devices}
      .behind=${this.behind}
      .kind=${this.route?.id}
      .consumer=${this.route?.sub}
    ></joe-device-add>`;
  }
}

define("joe-devices-page", JoeDevicesPage);
