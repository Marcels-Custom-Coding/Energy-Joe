import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { actionPageStyles, movedPlace, movedRow } from "../../components/action-page";
import "../../components/action-steer";
import { define } from "../../define";
import { findDevice } from "../../device-model";
import { shared } from "../../styles/shared";
import "./car-device";
import { addLink, frameStyles, groupHead, groupCards, notFound } from "./device-frame";
import { DeviceSection } from "./section-base";

/**
 * Geräte › Auto & Laden: every car Joe charges (one card each) and the
 * E-Autos from the Energy dashboard he cannot charge yet ("Laden
 * einrichten"); /devices/car/<id> is one car's page.
 */
export class JoeCarGroup extends DeviceSection {
  /** The action id of a car (or the meter id of one without a night action). */
  @property({ attribute: false }) device?: string;
  @property({ attribute: false }) sub?: string;

  static styles = [shared, frameStyles, actionPageStyles];

  protected render() {
    const t = this.t;
    if (!t || !this.state) {
      return nothing;
    }
    const entry = findDevice(this.devices, "car", this.device);
    if (entry) {
      return html`<joe-car-device
        .hass=${this.hass}
        .t=${t}
        .state=${this.state}
        .route=${this.route}
        .prefix=${this.prefix}
        .discovery=${this.discovery}
        .info=${this.info}
        .checks=${this.checks}
        .climateFound=${this.climateFound}
        .devices=${this.devices}
        .entry=${entry}
        .sub=${this.sub}
      ></joe-car-device>`;
    }
    const moved = this.device ? movedPlace(this.devices, this.device, "car") : undefined;
    return html`<div class="wrap">
      ${groupHead(t, t("nav.devices.car"), t("devices.car.lead"), this.devices.some((d) => d.group === "car"))}
      ${this.device === undefined ? nothing : moved ? movedRow(t, this.prefix, moved.name, moved) : notFound(t)}
      ${groupCards(this.ctx, this.devices, "car", (d) => {
        // "Heute Nacht" as on the hot water and Weitere-Geräte cards; a car charged by need has "Heute Nacht laden bis …" on its page.
        const need = d.action?.need;
        return d.action && !(d.action.kind === "switch" && (need?.soc_entity || need?.range_entity))
          ? { quick: html`<joe-action-tonight .hass=${this.hass} .t=${t} .state=${this.state} .action=${d.action}></joe-action-tonight>` }
          : {};
      })}
      <div class="group-actions">${addLink(t, this.prefix, "car", t("devices.group_add.car"))}</div>
    </div>`;
  }
}

define("joe-car-group", JoeCarGroup);
