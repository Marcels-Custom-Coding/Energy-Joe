import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { displayTitle } from "../../components/bits";
import { findDevice, type DeviceEntry, type Group } from "../../device-model";
import type { Translate } from "../../i18n";
import { PANEL, type Route } from "../../router";
import { shared } from "../../styles/shared";
import type { Check, ClimateFound, Discovery, HomeAssistant, JoeInfo, JoeState } from "../../types";
import { addLink, deviceFrame, frameFromEntry, frameStyles, groupCards, notFound, type FrameContext } from "./device-frame";

/**
 * What every section of Geräte gets from the shell (pages/devices/index.ts).
 * `devices` is built once there (device-model.ts buildDevices).
 */
export class DeviceSection extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;
  @property({ attribute: false }) route?: Route;
  @property({ attribute: false }) prefix = PANEL;
  @property({ attribute: false }) discovery?: Discovery;
  @property({ attribute: false }) info?: JoeInfo;
  @property({ attribute: false }) checks: Check[] = [];
  @property({ attribute: false }) climateFound?: ClimateFound;
  @property({ attribute: false }) devices: DeviceEntry[] = [];

  protected get ctx(): FrameContext {
    return { t: this.t!, prefix: this.prefix, hass: this.hass, state: this.state };
  }
}

/**
 * A plain group page: its cards and "+ Hinzufügen", or one device's page in
 * the shared frame. The area pages of 0.9.14 replace it with their own.
 */
export class GenericGroup extends DeviceSection {
  /** Joe's id of the device in the address (/devices/<group>/<device>). */
  @property({ attribute: false }) device?: string;
  @property({ attribute: false }) sub?: string;
  protected group: Group = "other";

  static styles = [
    shared,
    frameStyles,
    css`
      :host {
        display: block;
      }
      .wrap {
        max-width: 1100px;
        margin: 0 auto;
      }
      .actions {
        margin-top: 16px;
      }
    `,
  ];

  protected render(): TemplateResult | typeof nothing {
    const t = this.t;
    if (!t || !this.state) {
      return nothing;
    }
    const entry = findDevice(this.devices, this.group, this.device);
    if (entry) {
      return deviceFrame(this.ctx, frameFromEntry(this.ctx, entry));
    }
    return html`<div class="wrap">
      ${displayTitle(t(`nav.devices.${this.group}`))} ${this.device !== undefined ? notFound(t) : nothing}
      ${groupCards(this.ctx, this.devices, this.group)}
      ${this.group === "grid" ? nothing : html`<div class="actions">${addLink(t, this.prefix)}</div>`}
    </div>`;
  }
}
