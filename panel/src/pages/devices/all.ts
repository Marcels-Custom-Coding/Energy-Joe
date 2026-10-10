import { css, html, nothing, type TemplateResult } from "lit";
import { state } from "lit/decorators.js";
import { displayTitle, swoosh } from "../../components/bits";
import "../../components/control-status";
import { deviceCard, entryCard } from "../../components/device-card";
import "../../components/pose";
import { tip } from "../../components/tip";
import { define } from "../../define";
import {
  addRoute,
  GROUP_ICONS,
  GROUPS,
  groupProblem,
  groupsPresent,
  newFindings,
  type DeviceEntry,
  type Group,
  type NewFinding,
} from "../../device-model";
import type { Translate } from "../../i18n";
import { href, navigate, onLink, type Route } from "../../router";
import { shared } from "../../styles/shared";
import { addLink, frameStyles } from "./device-frame";
import { ignoreFinding, useBattery } from "./device-actions";
import { DeviceSection } from "./section-base";

const FOUND_ICONS: Record<NewFinding["kind"], string> = {
  battery: "mdi:home-battery-outline",
  wallbox: "mdi:ev-station",
  car: "mdi:car-electric",
};

/** Geräte › Alle: what Joe does now, every device by kind, what is new and what he cannot place. */
export class JoeDevicesAll extends DeviceSection {
  @state() private busy = "";

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
      .intro {
        display: grid;
        grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.7fr);
        gap: 24px;
        align-items: center;
      }
      .intro joe-pose {
        max-width: 300px;
        width: 100%;
        justify-self: end;
      }
      .display {
        font-size: clamp(30px, 4vw, 44px);
      }
      .lead-row {
        display: flex;
        align-items: flex-start;
        gap: 8px;
      }
      .lead-row .lead {
        flex: 1;
        min-width: 0;
      }
      .toolbar {
        margin-top: 14px;
      }
      .found {
        margin-top: 14px;
        padding: 16px 18px;
      }
      .found-head {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .found-head .eyebrow {
        flex: 1;
        min-width: 0;
      }
      .found-lead {
        margin: 8px 0 0;
        color: var(--joe-ink-2);
      }
      .found ul {
        list-style: none;
        margin: 10px 0 0;
        padding: 0;
        display: grid;
        gap: 4px;
      }
      .found li {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px 12px;
        padding: 8px 0;
        border-top: 1px solid var(--joe-line);
      }
      .found li:first-child {
        border-top: 0;
      }
      .found .what {
        flex: 1 1 180px;
        min-width: 0;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .found .what span {
        display: grid;
        min-width: 0;
      }
      .found b {
        font-weight: 600;
        overflow-wrap: anywhere;
      }
      .found small {
        color: var(--joe-muted);
        font-size: 13px;
      }
      .found .row-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .unassigned-text {
        margin: 0 0 10px;
        color: var(--joe-ink-2);
      }
      @media (max-width: 760px) {
        .intro {
          grid-template-columns: 1fr;
          gap: 8px;
        }
        .intro joe-pose {
          order: -1;
          justify-self: start;
          max-width: 200px;
        }
      }
    `,
  ];

  protected render() {
    const t = this.t;
    const joe = this.state;
    if (!t || !joe) {
      return nothing;
    }
    const devices = this.devices;
    const groups = groupsPresent(devices);
    const unassigned = devices.filter((d) => d.unassigned);
    return html`<div class="wrap">
      <div class="intro">
        <div>
          ${displayTitle(t("devices.page.title"))} ${swoosh}
          <div class="lead-row" data-tipped>
            <p class="lead">${t("devices.lead")}</p>
            ${tip(t, "ha_open")}
          </div>
        </div>
        <joe-pose name="switch"></joe-pose>
      </div>
      <joe-control-status .t=${t} .hass=${this.hass} .state=${joe}></joe-control-status>
      <div class="actions toolbar" data-tipped>${addLink(t, this.prefix)} ${tip(t, "devices_add")}</div>
      ${this.renderFound(t)}
      ${GROUPS.filter((g) => groups.includes(g)).map((group) => this.renderGroup(t, group, devices))}
      ${unassigned.length
        ? html`<div class="group-head">
              <span class="group-label">${t("devices.unassigned")}</span><i class="dcard-dot" aria-hidden="true"></i>
            </div>
            <p class="unassigned-text">${t("devices.unassigned.text")}</p>
            <div class="dcards">
              ${unassigned.map((entry) => deviceCard(t, this.prefix, entryCard(t, this.hass, joe, entry)))}
            </div>`
        : nothing}
    </div>`;
  }

  private renderGroup(t: Translate, group: Group, devices: DeviceEntry[]): TemplateResult | typeof nothing {
    const list = devices.filter((d) => d.group === group && !d.unassigned);
    if (!list.length) {
      return nothing;
    }
    const to: Route = { tab: "devices", section: group };
    return html`<div class="group-head">
        <ha-icon icon=${GROUP_ICONS[group]}></ha-icon>
        <span class="group-label">${t(`nav.devices.${group}`)}</span>
        ${groupProblem(devices.filter((d) => !d.unassigned), group) ? html`<i class="dcard-dot" aria-hidden="true"></i>` : nothing}
        <a class="mini-btn quiet group-go" href=${href(this.prefix, to)} @click=${onLink(to)}>${t("devices.group.go")}</a>
      </div>
      <div class="dcards">
        ${list.map((entry) => deviceCard(t, this.prefix, entryCard(t, this.hass, this.state, entry)))}
      </div>`;
  }

  /** "Neu gefunden": batteries, wallboxes and cars Joe found but does not use yet. */
  private renderFound(t: Translate): TemplateResult | typeof nothing {
    const found = newFindings(this.state!.config, this.discovery);
    if (!found.length) {
      return nothing;
    }
    return html`<section class="card found" data-tipped>
      <div class="found-head">
        <div class="eyebrow"><ha-icon icon="mdi:new-box"></ha-icon>${t("devices.found")}</div>
        ${tip(t, "devices_found")}
      </div>
      <p class="found-lead">${t("devices.found.lead")}</p>
      <ul>
        ${found.map(
          (finding) => html`<li>
            <span class="what">
              <ha-icon icon=${FOUND_ICONS[finding.kind]}></ha-icon>
              <span><b>${finding.name}</b><small>${t(`devices.found.${finding.kind}`)}</small></span>
            </span>
            <span class="row-actions">
              <button
                type="button"
                class="mini-btn go"
                ?disabled=${this.busy === finding.key}
                @click=${() => this.use(finding)}
              >
                ${t("devices.found.use")}
              </button>
              <button
                type="button"
                class="mini-btn quiet"
                ?disabled=${this.busy === finding.key}
                @click=${() => this.ignore(finding)}
              >
                ${t("devices.found.ignore")}
              </button>
            </span>
          </li>`,
        )}
      </ul>
    </section>`;
  }

  /** A battery is taken over right away; a car or wallbox opens the assistant to set up charging. */
  private async use(finding: NewFinding): Promise<void> {
    if (finding.kind !== "battery" || !finding.battery) {
      // The assistant fills in this wallbox or car, not just the first one found.
      navigate(this, addRoute("car", finding.key), { sheet: true });
      return;
    }
    this.busy = finding.key;
    const id = await useBattery(this, this.state!.config, finding.battery);
    this.busy = "";
    if (id) {
      navigate(this, { tab: "devices", section: "battery", id });
    }
  }

  private async ignore(finding: NewFinding): Promise<void> {
    this.busy = finding.key;
    await ignoreFinding(this, this.state!.config, finding.key);
    this.busy = "";
  }
}

define("joe-devices-all", JoeDevicesAll);
