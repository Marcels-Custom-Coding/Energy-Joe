import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { actionPageStyles, movedPlace, movedRow } from "../../components/action-page";
import "../../components/action-steer";
import { define } from "../../define";
import { findDevice } from "../../device-model";
import { shared } from "../../styles/shared";
import { addLink, frameStyles, groupHead, groupCards, notFound } from "./device-frame";
import "./hot-water-device";
import { DeviceSection } from "./section-base";

/**
 * Geräte › Warmwasser: each hot water heater Joe heats up at night (with
 * "Heute Nacht" right on the card) and hot water meters not set up yet.
 */
export class JoeHotWaterGroup extends DeviceSection {
  @property({ attribute: false }) device?: string;
  @property({ attribute: false }) sub?: string;

  static styles = [shared, frameStyles, actionPageStyles];

  protected render() {
    const { t, hass, state: joe } = this;
    if (!t || !joe) {
      return nothing;
    }
    const entry = findDevice(this.devices, "hot_water", this.device);
    if (entry) {
      return html`<joe-hot-water-device
        .hass=${hass}
        .t=${t}
        .state=${joe}
        .route=${this.route}
        .prefix=${this.prefix}
        .discovery=${this.discovery}
        .info=${this.info}
        .checks=${this.checks}
        .climateFound=${this.climateFound}
        .devices=${this.devices}
        .entry=${entry}
      ></joe-hot-water-device>`;
    }
    const moved = this.device ? movedPlace(this.devices, this.device, "hot_water") : undefined;
    return html`<div class="wrap">
      ${groupHead(t, t("nav.devices.hot_water"), t("devices.hot_water.lead"), this.devices.some((d) => d.group === "hot_water"))}
      ${this.device === undefined ? nothing : moved ? movedRow(t, this.prefix, moved.name, moved) : notFound(t)}
      ${groupCards(this.ctx, this.devices, "hot_water", (d) =>
        d.action
          ? { quick: html`<joe-action-tonight .hass=${hass} .t=${t} .state=${joe} .action=${d.action}></joe-action-tonight>` }
          : {},
      )}
      <div class="group-actions">${addLink(t, this.prefix, "hot_water", t("devices.group_add.hot_water"))}</div>
    </div>`;
  }
}

define("joe-hot-water-group", JoeHotWaterGroup);
