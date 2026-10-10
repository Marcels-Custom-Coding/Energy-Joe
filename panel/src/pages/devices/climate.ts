import { css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { displayTitle, swoosh } from "../../components/bits";
import { deviceCard, entryCard } from "../../components/device-card";
import { mirrorRow } from "../../components/mirror";
import "../../components/pose";
import { tip } from "../../components/tip";
import { saveConfig } from "../../config";
import { define } from "../../define";
import { buildDevices, deviceRoute, findDevice, type DeviceEntry } from "../../device-model";
import type { Translate } from "../../i18n";
import { href, onLink, type Route } from "../../router";
import { shared } from "../../styles/shared";
import type { ClimateFound, JoeState } from "../../types";
import "./climate-device";
import {
  AWAY_AFTER_DEFAULT,
  activeProfile,
  measured,
  nightText,
  reasonText,
  temperatureText,
  temperatures,
  usesPower,
} from "./climate-view";
import { frameStyles, notFound } from "./device-frame";
import { DeviceSection } from "./section-base";

/** Haushalt › Tage & Kalender: the calendar rules that tell home office days. */
const DAYS: Route = { tab: "household", section: "days" };

/**
 * Geräte › Heizung & Klima: the main switch, what comes from Haushalt and
 * every thermostat and air conditioner by room. One device's address
 * (/devices/climate/<entity>) shows its own page (climate-device.ts).
 */
export class JoeClimateGroup extends DeviceSection {
  /** A device's address (/devices/climate/<entity>), or an unassigned meter's (/devices/climate/<consumerId>). */
  @property({ attribute: false }) entity?: string;
  /** An addressed sheet below the device (/devices/climate/<entity>/week[/<mode>]). */
  @property({ attribute: false }) sub?: string;

  /** Own load, only while the panel has none. */
  @state() private own?: ClimateFound;
  @state() private failed = false;
  private fallback?: number;
  /** The devices with Joe's own load of climate devices, while the panel has none. */
  private list: DeviceEntry[] = [];

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
        max-width: 260px;
        width: 100%;
        justify-self: end;
      }
      .intro .with-tip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: var(--joe-muted);
        font-size: 13px;
      }
      .card {
        padding: 18px 20px;
        margin-top: 14px;
      }
      .head {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .head .eyebrow {
        flex: 1;
        min-width: 0;
      }
      .hint {
        margin: 8px 0 0;
        color: var(--joe-muted);
        font-size: 13px;
      }
      .household {
        padding-top: 10px;
        padding-bottom: 10px;
      }
      .household .mirror + .mirror {
        border-top: 1px solid var(--joe-line);
      }
      .list-head {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 22px;
      }
      .list-head .group-label {
        margin: 0;
        flex: 1 1 auto;
      }
      .area {
        margin-top: 16px;
      }
      .cl {
        display: block;
      }
      .cl.chips {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-top: 2px;
      }
      .unassigned-text {
        margin: 0 0 10px;
        color: var(--joe-ink-2);
      }
      @media (max-width: 760px) {
        .intro {
          grid-template-columns: 1fr;
        }
        .intro joe-pose {
          display: none;
        }
      }
    `,
  ];

  connectedCallback(): void {
    super.connectedCallback();
    // The panel loads the devices; when they are still missing after a moment, ask once here.
    this.fallback = window.setTimeout(() => {
      if (!this.climateFound && !this.own) void this.load();
    }, 3000);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.clearTimeout(this.fallback);
  }

  private get found(): ClimateFound | undefined {
    return this.climateFound ?? this.own;
  }

  private async load(): Promise<void> {
    try {
      this.own = await this.hass?.callWS<ClimateFound>({ type: "energy_joe/climate/devices" });
      this.failed = false;
    } catch {
      this.failed = !this.climateFound;
    }
  }

  protected willUpdate(changed: PropertyValues): void {
    if (["devices", "climateFound", "own", "t", "state", "hass"].some((name) => changed.has(name))) {
      // Without the panel's list, Joe's own load decides which devices there are.
      this.list =
        !this.climateFound && this.own && this.t && this.state
          ? buildDevices(this.t, this.state, this.hass, { climateFound: this.own, discovery: this.discovery, checks: this.checks })
          : this.devices;
    }
  }

  protected render() {
    const { t, state: joe } = this;
    if (!t || !joe) {
      return nothing;
    }
    const entry = this.entity ? findDevice(this.list, "climate", this.entity) : undefined;
    if (entry) {
      return html`<joe-climate-device
        .t=${t}
        .hass=${this.hass}
        .state=${joe}
        .prefix=${this.prefix}
        .route=${this.route}
        .found=${this.found}
        .devices=${this.list}
        .entry=${entry}
        .sub=${this.sub}
      ></joe-climate-device>`;
    }
    const climate = joe.config.climate ?? { enabled: false, rooms: {} };
    const found = this.found;
    const devices = this.list.filter((d) => d.group === "climate" && !d.unassigned);
    const unassigned = this.list.filter((d) => d.group === "climate" && d.unassigned);
    const areas = [...new Set(devices.map((d) => d.area ?? t("climate.no_area")))];
    // Power is counted for devices that use it themselves (air conditioners, or with a meter).
    const powered = (found?.devices ?? []).filter((d) => usesPower(d, climate.rooms ?? {}, found));
    // A meter of its own or its entry in the Energy dashboard: both measure it.
    const linked = powered.filter(
      (d) => measured(climate.rooms?.[d.entity_id]) || devices.some((e) => e.id === d.entity_id && e.consumer),
    ).length;
    return html`<div class="wrap">
      <div class="intro">
        <div>
          ${displayTitle(t("climate.title"))} ${swoosh}
          <p class="lead">${t("climate.lead")}</p>
          ${devices.length ? html`<p class="with-tip" data-tipped>${t("climate.ha_open")} ${tip(t, "ha_open")}</p>` : nothing}
        </div>
        <joe-pose name="relax"></joe-pose>
      </div>
      ${this.entity !== undefined ? this.renderLost(t) : nothing} ${this.renderMain(t, joe, climate.enabled)}
      ${this.renderHousehold(t, joe)}
      ${this.failed && !found ? html`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${t("climate.failed")}</span></div>` : nothing}
      ${found && !found.devices.length ? html`<p class="hint">${t("climate.none")}</p>` : nothing}
      ${devices.length
        ? html`<div class="list-head">
            <h3 class="group-label">${t("climate.list")}</h3>
            ${powered.length ? html`<span class="chip">${t("climate.meters.count", { linked, all: powered.length })}</span>` : nothing}
          </div>`
        : nothing}
      ${areas.map(
        (area) => html`<div class="group-label area">${area}</div>
          <div class="dcards">
            ${devices.filter((d) => (d.area ?? t("climate.no_area")) === area).map((d) => this.renderCard(t, joe, d))}
          </div>`,
      )}
      ${unassigned.length
        ? html`<div class="group-head list-head">
              <span class="group-label">${t("devices.unassigned")}</span><i class="dcard-dot" aria-hidden="true"></i>
            </div>
            <p class="unassigned-text">${t("devices.unassigned.text")}</p>
            <div class="dcards">
              ${unassigned.map((d) => deviceCard(t, this.prefix, entryCard(t, this.hass, joe, d)))}
            </div>`
        : nothing}
    </div>`;
  }

  /**
   * An address that names no climate device here: a meter that now lives in
   * another group says where, anything else (renamed in HA) says it is gone.
   */
  private renderLost(t: Translate): TemplateResult {
    const id = this.entity;
    const elsewhere = this.list.find((d) => d.group !== "climate" && (d.id === id || d.consumer?.id === id));
    if (!elsewhere) {
      return notFound(t);
    }
    const to = deviceRoute(elsewhere);
    return html`<div class="note" role="status">
      <ha-icon icon="mdi:information-outline"></ha-icon>
      <a class="mini-btn go" href=${href(this.prefix, to)} @click=${onLink(to, { replace: true })}
        >${t("climate.moved", { name: elsewhere.name, group: t(`nav.devices.${elsewhere.group}`) })}</a
      >
    </div>`;
  }

  /** One device in the list: temperatures, the profile running now and why, power measured. */
  private renderCard(t: Translate, joe: JoeState, entry: DeviceEntry): TemplateResult {
    const device = entry.climate;
    const now = joe.climate?.rooms?.[entry.id];
    const room = joe.config.climate?.rooms?.[entry.id];
    const temps = temperatureText(t, temperatures(this.hass, device, entry.id));
    const profile = device && room?.enabled ? activeProfile(t, device, now, room.device_profiles ?? {}) : undefined;
    const why = room?.enabled ? reasonText(t, now, joe.config.climate?.away_after_min ?? AWAY_AFTER_DEFAULT) : undefined;
    const power = measured(room) || entry.consumer;
    const state = html`${temps ? html`<span class="cl">${temps}</span>` : nothing}
      ${profile ? html`<span class="cl">${profile}</span>` : nothing}
      ${why || power
        ? html`<span class="cl chips">
            ${why ? html`<span class="chip">${why}</span>` : nothing}
            ${power ? html`<span class="chip ok">${t("climate.card.measured")}</span>` : nothing}
          </span>`
        : nothing}`;
    // The room stands above the cards already.
    return deviceCard(t, this.prefix, entryCard(t, this.hass, joe, entry, { state, area: undefined }));
  }

  /** What comes from Haushalt: who is home, the kind of day, the night. Read here, changed there. */
  private renderHousehold(t: Translate, joe: JoeState): TemplateResult {
    const presence = joe.config.context.presence_entity ?? null;
    const helper = presence ? (this.hass?.states[presence]?.attributes.friendly_name ?? presence) : null;
    const day = joe.climate?.day;
    const kind = !day ? null : day.holiday ? "holiday" : day.weekend && day.free ? "weekend" : "workday";
    const today = kind
      ? [
          t(`climate.mirror.today.${kind}`),
          day?.home_office_available && day.home_office.length ? t("climate.mirror.today.ho", { names: day.home_office.join(", ") }) : "",
        ]
          .filter(Boolean)
          .join(", ")
      : t("climate.mirror.unknown");
    const night = nightText(t, this.hass, joe);
    return html`<section class="card household">
      ${mirrorRow(t, this.prefix, {
        label: t("climate.mirror.presence"),
        value: helper ? html`<span title=${presence ?? ""}>${helper}</span>` : t("climate.mirror.presence.none"),
        to: { tab: "household", section: "presence" },
        action: helper ? "change" : "set",
      })}
      ${mirrorRow(t, this.prefix, { label: t("climate.mirror.today"), value: today, to: DAYS })}
      ${mirrorRow(t, this.prefix, {
        label: t("climate.mirror.night"),
        value: night.text,
        to: { tab: "household", section: "night" },
        action: night.set ? "change" : "set",
      })}
    </section>`;
  }

  /** "Joe steuert Heizung und Klima", with the hint that it acts only in live mode. */
  private renderMain(t: Translate, joe: JoeState, enabled: boolean): TemplateResult {
    return html`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:thermostat-auto"></ha-icon>${t("climate.enabled")}</div>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(enabled)}
          aria-label=${t("climate.enabled")}
          @click=${() => saveConfig(this, { climate: { enabled: !enabled } })}
        ></button>
        ${tip(t, "climate_enabled")}
      </div>
      <p class="hint">${t(joe.mode === "live" ? "climate.live" : "climate.not_live")}</p>
    </section>`;
  }
}

define("joe-climate-group", JoeClimateGroup);

