import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { actionPageStyles, movedPlace, movedRow } from "../../components/action-page";
import "../../components/action-steer";
import { define } from "../../define";
import { findDevice, type DeviceEntry } from "../../device-model";
import { shared } from "../../styles/shared";
import "./car-device";
import "./car-point";
import { addLink, frameStyles, groupHead, groupCards, notFound } from "./device-frame";
import { DeviceSection } from "./section-base";

/**
 * Geräte › Auto & Laden: the cars (everything about their need) and the
 * charge points (the wallboxes Joe switches) as separate cards that name
 * each other ("Kona · steckt an Parkplatz eBox"), and the E-Autos from the
 * Energy dashboard without a wallbox Joe switches ("Laden einrichten").
 * /devices/car/<car id> is a car's page, /devices/car/point/<action id> a
 * charge point's.
 */
export class JoeCarGroup extends DeviceSection {
  /** A car's id, "point" (with the charge point in `sub`), or a meter without charging. */
  @property({ attribute: false }) device?: string;
  @property({ attribute: false }) sub?: string;

  static styles = [shared, frameStyles, actionPageStyles];

  /** The page an address names: a car, a charge point, or (up to 0.9.18) a charge point by its action id. */
  private target(): DeviceEntry | undefined {
    if (this.device === "point") {
      return findDevice(this.devices, "car", `point:${this.sub ?? ""}`);
    }
    return findDevice(this.devices, "car", this.device) ?? (this.device ? findDevice(this.devices, "car", `point:${this.device}`) : undefined);
  }

  protected render() {
    const t = this.t;
    if (!t || !this.state) {
      return nothing;
    }
    const entry = this.target();
    const props = {
      hass: this.hass,
      t,
      state: this.state,
      route: this.route,
      prefix: this.prefix,
      discovery: this.discovery,
      info: this.info,
      checks: this.checks,
      climateFound: this.climateFound,
      devices: this.devices,
    };
    if (entry?.car) {
      return html`<joe-car-device
        .hass=${props.hass}
        .t=${t}
        .state=${props.state}
        .route=${props.route}
        .prefix=${props.prefix}
        .discovery=${props.discovery}
        .info=${props.info}
        .checks=${props.checks}
        .climateFound=${props.climateFound}
        .devices=${props.devices}
        .entry=${entry}
        .sub=${this.sub}
      ></joe-car-device>`;
    }
    if (entry?.point) {
      return html`<joe-car-point
        .hass=${props.hass}
        .t=${t}
        .state=${props.state}
        .route=${props.route}
        .prefix=${props.prefix}
        .discovery=${props.discovery}
        .info=${props.info}
        .checks=${props.checks}
        .climateFound=${props.climateFound}
        .devices=${props.devices}
        .entry=${entry}
      ></joe-car-point>`;
    }
    if (entry) {
      // A meter of the Energy dashboard without a wallbox Joe switches: its frame with "Laden einrichten".
      return html`<joe-car-meter
        .hass=${props.hass}
        .t=${t}
        .state=${props.state}
        .prefix=${props.prefix}
        .devices=${props.devices}
        .entry=${entry}
      ></joe-car-meter>`;
    }
    const moved = this.device && this.device !== "point" ? movedPlace(this.devices, this.device, "car") : undefined;
    const cars = this.devices.filter((d) => d.group === "car" && d.car);
    const points = this.devices.filter((d) => d.group === "car" && !d.car);
    return html`<div class="wrap">
      ${groupHead(t, t("nav.devices.car"), t("devices.car.lead"), this.devices.some((d) => d.group === "car"))}
      ${this.device === undefined ? nothing : moved ? movedRow(t, this.prefix, moved.name, moved) : notFound(t)}
      ${cars.length ? html`<h3 class="sub-group">${t("devices.car.cars")}</h3>` : nothing}
      ${groupCards(this.ctx, cars, "car")}
      ${points.length ? html`<h3 class="sub-group">${t("devices.car.points")}</h3>` : nothing}
      ${groupCards(this.ctx, points, "car")}
      <div class="group-actions">
        ${addLink(t, this.prefix, "car", t("devices.group_add.car"))} ${addLink(t, this.prefix, "wallbox", t("devices.group_add.wallbox"))}
      </div>
    </div>`;
  }
}

define("joe-car-group", JoeCarGroup);
