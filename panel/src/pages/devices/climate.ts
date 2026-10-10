import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { deviceLink, displayTitle, swoosh } from "../../components/bits";
import { haOpen, type HaTarget } from "../../components/ha-open";
import { mirrorRow } from "../../components/mirror";
import "../../components/pose";
import { tip } from "../../components/tip";
import { saveConfig } from "../../config";
import { define } from "../../define";
import { formatNumber } from "../../entities";
import type { Translate } from "../../i18n";
import { PANEL, format, href, onLink, revealAnchor, type Route } from "../../router";
import { shared } from "../../styles/shared";
import {
  WEEK_TAGS,
  type ClimateDevice,
  type ClimateFound,
  type ClimateHold,
  type ClimateMeter,
  type ClimateMeterOption,
  type ClimateRoomConfig,
  type ClimateRoomStatus,
  type ClimateWeekConfig,
  type DeviceProfileConfig,
  type HomeAssistant,
  type JoeState,
  type WeekProfile,
  type WeekTag,
  type WeekValue,
} from "../../types";
import { TAG_ICONS, profileLabel } from "../../week";

/** A change to one room: only the keys that change, so the week profiles stay. */
type RoomChange = Partial<Omit<ClimateRoomConfig, "week">> & { week?: Partial<ClimateWeekConfig> };

const DEFAULT_ROOM: ClimateRoomConfig = {
  enabled: false,
  away: "setback",
  setback_k: 3,
  away_preset: null,
  free_day_preset: null,
  night_off: false,
  night_from: "23:00",
  night_until: "06:30",
  week: { enabled: false, modes: {} },
  device_profiles: {},
};

/** How long the house must be empty before it counts as away (model.py). */
const AWAY_AFTER_DEFAULT = 15;

/** Haushalt › Tage & Kalender: the calendar rules that tell home office days. */
const DAYS: Route = { tab: "household", section: "days" };

/** "Profil 3" for week_program_3, else by position. */
function presetNumber(preset: string, index: number): number {
  const match = /^week_program_(\d+)$/.exec(preset);
  return match ? Number(match[1]) : index + 1;
}

/** A device's tags in a fixed order, to tell whether two states are the same. */
function profilesKey(profiles: Record<string, DeviceProfileConfig>): string {
  return JSON.stringify(
    Object.keys(profiles)
      .sort()
      .map((preset) => [preset, profiles[preset]?.name ?? "", profiles[preset]?.tags ?? []]),
  );
}

/**
 * Geräte › Heizung & Klima: every thermostat and air conditioner on its own,
 * by room. Who is home, the kind of day and the night come from Haushalt.
 */
export class JoeClimateGroup extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;
  @property({ attribute: false }) route?: Route;
  @property({ attribute: false }) prefix = PANEL;
  /** Loaded once by the panel for all pages; this section only loads it itself when that fails. */
  @property({ attribute: false }) climateFound?: ClimateFound;
  /** A device's address (/devices/climate/<entity>): scroll to its room card. */
  @property({ attribute: false }) entity?: string;

  /** Own load, only while the panel has none. */
  @state() private own?: ClimateFound;
  @state() private failed = false;
  /** The meters section starts open. */
  @state() private metersOpen = true;
  /** The air conditioner whose meter is being searched, and the search text. */
  @state() private picking?: string;
  @state() private query = "";
  /** Per device: how long the next profile by hand holds (while none holds). */
  @state() private holdUntil: Record<string, "midnight" | "forever"> = {};
  /** Per device: the device profiles last sent, until the config has them (or saving failed). */
  @state() private pending: Record<string, Record<string, DeviceProfileConfig>> = {};
  /** Per device: a note that a tag moved to another device profile. */
  @state() private moved: Record<string, string> = {};
  /** Per device: a week command that failed. */
  @state() private weekError: Record<string, string> = {};
  /** The device the address points to, until its card is on screen. */
  private anchor?: string;
  /** The address last revealed. */
  private revealed?: string;
  private fallback?: number;

  static styles = [
    shared,
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
      .head b {
        /* Narrow cards put the name on a line of its own, the controls below. */
        flex: 1 1 150px;
        min-width: 0;
        font-weight: 700;
        overflow-wrap: break-word;
      }
      /* Name and temperature wrap as one block; the Home Assistant button stays top right. */
      .device-head {
        flex-wrap: nowrap;
        align-items: flex-start;
      }
      .device-name {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px 8px;
        min-height: 44px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }
      .grid .card {
        margin-top: 0;
      }
      .row {
        display: flex;
        align-items: center;
        gap: 8px 12px;
        flex-wrap: wrap;
        margin-top: 12px;
      }
      .row > span:first-child {
        flex: 1 1 140px;
        min-width: 0;
      }
      .row .input {
        width: auto;
        min-width: 0;
      }
      .row .input.short {
        width: 90px;
      }
      .hint {
        margin: 8px 0 0;
        color: var(--joe-muted);
        font-size: 13px;
      }
      a.mini-btn {
        text-decoration: none;
      }
      details.ent {
        margin-top: 4px;
        font-size: 12.5px;
        color: var(--joe-muted);
      }
      details.ent summary {
        cursor: pointer;
        width: fit-content;
      }
      @media (pointer: coarse) {
        details.ent summary {
          line-height: 44px;
        }
      }
      details.ent code {
        display: block;
        margin-top: 2px;
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 12px;
        color: var(--joe-ink-2);
        overflow-wrap: anywhere;
      }
      .fold {
        min-height: 44px;
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
        min-width: 0;
        padding: 0;
        border: 0;
        background: none;
        color: inherit;
        font: inherit;
        cursor: pointer;
        text-align: left;
      }
      .meter-pick {
        display: grid;
        gap: 6px;
        min-width: 0;
      }
      .picked {
        display: grid;
        min-width: 0;
      }
      .picked b {
        font-weight: 600;
        overflow-wrap: anywhere;
      }
      .picked small,
      .hits small {
        color: var(--joe-muted);
        font-size: 12.5px;
      }
      .via::before {
        content: "↳ ";
        color: var(--joe-amber);
        font-weight: 800;
      }
      .hits {
        display: grid;
        gap: 2px;
        max-height: 300px;
        overflow-y: auto;
      }
      .hit {
        display: grid;
        text-align: left;
        padding: 6px 8px;
        border: 0;
        border-radius: 8px;
        background: transparent;
        color: var(--joe-ink);
        font: inherit;
        cursor: pointer;
      }
      .hit:hover,
      .hit:focus-visible {
        background: var(--joe-surface-2);
      }
      .hit:active {
        background: var(--joe-line);
      }
      .hit b {
        font-weight: 600;
      }
      .hit-actions {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        margin-top: 4px;
      }
      .line .state {
        display: flex;
        gap: 6px;
        align-items: center;
        flex-wrap: wrap;
      }
      .line {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr) auto;
        gap: 6px 12px;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid var(--joe-line);
      }
      .line:last-child {
        border-bottom: 0;
      }
      .line .input {
        width: 100%;
        min-width: 0;
      }
      .line .shared {
        grid-column: 1 / -1;
        margin: 0;
      }
      .dev {
        display: grid;
        gap: 2px;
        min-width: 0;
      }
      .dev b {
        font-weight: 600;
        overflow-wrap: anywhere;
      }
      .dev small {
        color: var(--joe-muted);
        font-size: 12.5px;
      }
      .sub {
        margin-top: 14px;
        padding-top: 12px;
        border-top: 1px solid var(--joe-line);
      }
      .sub > .row:first-child {
        margin-top: 0;
      }
      .sub-title {
        flex: 1 1 140px;
        min-width: 0;
        font-weight: 700;
      }
      .week-now {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px 8px;
        margin: 10px 0 0;
        font-weight: 600;
      }
      .week-now .chip {
        font-weight: 600;
      }
      .card .note {
        margin-top: 10px;
      }
      .note-body {
        display: grid;
        gap: 8px;
        justify-items: start;
        min-width: 0;
      }
      .row select.input {
        flex: 1 1 160px;
      }
      .row.hold {
        margin-top: 6px;
      }
      .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .tag-btn[aria-pressed="true"] {
        background: var(--joe-amber-soft);
        box-shadow: inset 0 0 0 2px var(--joe-amber);
      }
      .tag-btn[aria-pressed="true"]:hover:not([disabled]) {
        background: var(--joe-amber-soft);
      }
      .preset {
        display: grid;
        gap: 8px;
        padding: 10px 0;
      }
      .preset + .preset {
        border-top: 1px solid var(--joe-line);
      }
      .preset-name {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
      }
      .preset-name code {
        flex: none;
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 12px;
        color: var(--joe-muted);
      }
      .preset-name .input {
        flex: 1;
        min-width: 0;
      }
      .household {
        padding-top: 10px;
        padding-bottom: 10px;
      }
      .household .mirror + .mirror {
        border-top: 1px solid var(--joe-line);
      }
      .intro .with-tip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: var(--joe-muted);
        font-size: 13px;
      }
      .dev-name {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
      }
      .dev-name b {
        flex: 1;
        min-width: 0;
      }
      .hit-row {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .hit-row .hit {
        flex: 1;
        min-width: 0;
      }
      .hit {
        min-height: 44px;
      }
      @media (max-width: 760px) {
        .line {
          grid-template-columns: 1fr;
        }
      }
      @media (max-width: 760px) {
        .intro,
        .grid {
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

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has("entity") || changed.has("route")) {
      // A new address with a device scrolls to it once; a new state does not.
      const path = this.route ? format(this.route) : (this.entity ?? "");
      if (path !== this.revealed) {
        this.revealed = path;
        this.anchor = this.entity || undefined;
      }
    }
    if (changed.has("state") && Object.keys(this.pending).length) {
      // The config caught up with what was sent: it counts again.
      const rooms = this.state?.config.climate?.rooms ?? {};
      const rest = Object.fromEntries(
        Object.entries(this.pending).filter(
          ([entity, profiles]) => profilesKey(rooms[entity]?.device_profiles ?? {}) !== profilesKey(profiles),
        ),
      );
      if (Object.keys(rest).length !== Object.keys(this.pending).length) {
        this.pending = rest;
      }
    }
  }

  /** A device's profiles: what was sent last, else the config. */
  private profilesOf(entity: string): Record<string, DeviceProfileConfig> {
    return this.pending[entity] ?? this.state?.config.climate?.rooms?.[entity]?.device_profiles ?? {};
  }

  /** A device's operating mode in the user's language ("heat_cool" → "Heizen/Kühlen"). */
  private hvacText(t: Translate, mode: string): string {
    return t.optional(`climate.hvac.${mode}`) ?? mode;
  }

  private async load(): Promise<void> {
    try {
      this.own = await this.hass?.callWS<ClimateFound>({ type: "energy_joe/climate/devices" });
      this.failed = false;
    } catch {
      this.failed = !this.climateFound;
    }
  }

  protected async updated(): Promise<void> {
    const anchor = this.anchor;
    if (!anchor || !this.found) {
      return;
    }
    // The sticky header's height (the scroll offset) is measured after the first paint.
    for (let i = 0; i < 10 && !getComputedStyle(this).getPropertyValue("--joe-head-h"); i++) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
    if (this.anchor === anchor && revealAnchor(this.renderRoot, anchor)) {
      this.anchor = undefined;
    }
  }

  protected render() {
    const { t, state: joe } = this;
    if (!t || !joe) {
      return nothing;
    }
    const climate = joe.config.climate ?? { enabled: false, rooms: {} };
    const found = this.found;
    const devices = found?.devices ?? [];
    const areas = [...new Set(devices.map((d) => d.area ?? t("climate.no_area")))];
    // A device renamed in Home Assistant keeps its old address: say so instead of an empty jump.
    const lost = Boolean(this.entity && found && !devices.some((d) => d.entity_id === this.entity));
    return html`<div class="wrap">
      <div class="intro">
        <div>
          ${displayTitle(t("climate.title"))} ${swoosh}
          <p class="lead">${t("climate.lead")}</p>
          ${devices.length ? html`<p class="with-tip" data-tipped>${t("climate.ha_open")} ${tip(t, "ha_open")}</p>` : nothing}
        </div>
        <joe-pose name="relax"></joe-pose>
      </div>
      ${lost ? html`<div class="note warn" role="status"><ha-icon icon="mdi:help-circle-outline"></ha-icon><span>${t("nav.not_found")}</span></div>` : nothing}
      ${this.renderMain(t, joe, climate.enabled)} ${this.renderHousehold(t, joe)}
      ${devices.length ? this.renderMeters(t, joe, devices) : nothing}
      ${this.failed && !found ? html`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${t("climate.failed")}</span></div>` : nothing}
      ${found && !devices.length ? html`<p class="hint">${t("climate.none")}</p>` : nothing}
      ${areas.map(
        (area) => html`<div class="group-label">${area}</div>
          <div class="grid">
            ${devices.filter((d) => (d.area ?? t("climate.no_area")) === area).map((d) => this.renderDevice(t, joe, d))}
          </div>`,
      )}
    </div>`;
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
    const climate = joe.config.climate;
    const byEntity = climate?.night_by === "entity";
    const night = climate?.night_entity ?? null;
    const nightText = byEntity
      ? night
        ? (this.hass?.states[night]?.attributes.friendly_name ?? night)
        : t("climate.mirror.night.no_entity")
      : t("climate.mirror.night.time");
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
        value: nightText,
        to: { tab: "household", section: "night" },
        action: byEntity && !night ? "set" : "change",
      })}
    </section>`;
  }

  /** "Kalender-Regeln im Haushalt →": where home office days are told. */
  private daysLink(t: Translate): TemplateResult {
    return html`<a class="mini-btn quiet" href=${href(this.prefix, DAYS)} @click=${onLink(DAYS)}>
      <ha-icon icon="mdi:calendar-text-outline"></ha-icon>${t("week.ho.rules")}
    </a>`;
  }

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

  private renderDevice(t: Translate, joe: JoeState, device: ClimateDevice): TemplateResult {
    const room: ClimateRoomConfig = { ...DEFAULT_ROOM, ...(joe.config.climate?.rooms?.[device.entity_id] ?? {}) };
    const live = this.hass?.states[device.entity_id];
    const current = live?.attributes.current_temperature ?? device.current_temperature;
    const target = live?.attributes.temperature ?? device.temperature;
    const cooling = device.hvac_modes.includes("cool");
    const presets = device.preset_modes.filter((p) => !["none", "boost"].includes(p));
    const now = joe.climate?.rooms?.[device.entity_id];
    const rate = joe.climate?.rates?.[device.entity_id];
    // Air conditioners get week profiles; devices with week programs of their own get tags.
    const programs = device.week_presets ?? [];
    const sets = Object.values(room.week?.modes ?? {}).filter((set): set is WeekProfile[] => !!set?.length);
    const weekOn = cooling && !programs.length && !!room.week?.enabled;
    const weekRuns = weekOn && sets.length > 0 && now?.kind !== "legacy";
    // The device's profiles count once one of them is "Normal"; until then the old settings apply.
    const deviceProfiles = this.profilesOf(device.entity_id);
    const tagged = programs.some((preset) => deviceProfiles[preset]?.tags.includes("normal"));
    const deviceRuns = tagged && now?.kind !== "legacy";
    const legacy = !weekRuns && !deviceRuns;
    // Without a profile tagged "away", the room's own away setting still applies.
    const awayTagged = weekRuns
      ? sets.every((set) => set.some((p) => p.tags.includes("away")))
      : programs.some((preset) => deviceProfiles[preset]?.tags.includes("away"));
    const awayWays = (legacy ? ["setback", "off", ...(presets.length ? ["preset"] : [])] : ["setback", "off"]) as ClimateRoomConfig["away"][];
    const away = legacy ? room.away : room.away === "off" ? "off" : "setback";
    return html`<section class="card" data-tipped data-anchor=${device.entity_id}>
      <div class="head device-head">
        <div class="device-name">
          <b>${deviceLink(device.device_id, device.name, t("climate.open_device", { id: device.entity_id }))}</b>
          ${current != null
            ? html`<span class="chip">${formatNumber(t.lang, Number(current), 1)} °C${target != null ? ` → ${formatNumber(t.lang, Number(target), 1)} °C` : ""}</span>`
            : nothing}
        </div>
        ${haOpen(t, { deviceId: device.device_id, entityId: device.entity_id, name: device.name })}
      </div>
      <details class="ent"><summary>${t("climate.entity")}</summary><code>${device.entity_id}</code></details>
      <div class="row">
        <span>${t("climate.room.steer")}</span>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(room.enabled)}
          aria-label=${t("climate.room.enabled", { name: device.name })}
          @click=${() => this.save(device, { enabled: !room.enabled })}
        ></button>
        ${tip(t, "climate_room")}
      </div>
      ${room.enabled
        ? html`${cooling && !programs.length ? this.renderWeek(t, device, room, sets, now) : nothing}
            ${programs.length ? this.renderPrograms(t, device, programs, now) : nothing}
            ${!awayTagged || legacy
              ? html`<div class="row" data-tipped>
                    <span>${t("climate.away")}</span>
                    <span class="seg" role="group" aria-label=${t("climate.away")}>
                      ${awayWays.map(
                        (way) => html`<button type="button" aria-pressed=${String(away === way)} @click=${() => this.save(device, { away: way })}>
                          ${t(deviceRuns && way === "setback" ? "devprof.away_keep" : `climate.away.${way}`)}
                        </button>`,
                      )}
                    </span>
                    ${tip(t, legacy ? "climate_away" : deviceRuns ? "devprof_away" : "week_away")}
                  </div>
                  ${legacy ? nothing : html`<p class="hint">${t("week.away_fallback")}</p>`}
                  ${away === "setback" && !deviceRuns
                    ? html`<div class="row">
                        <span>${t(cooling && device.state === "cool" ? "climate.setback.cool" : "climate.setback.heat")}</span>
                        <input
                          class="input short"
                          type="number"
                          min="0.5"
                          max="10"
                          step="0.5"
                          aria-label=${t("climate.setback.heat")}
                          .value=${String(room.setback_k)}
                          @change=${(ev: Event) => {
                            const value = Number.parseFloat((ev.target as HTMLInputElement).value.replace(",", "."));
                            if (Number.isFinite(value)) this.save(device, { setback_k: Math.min(10, Math.max(0.5, value)) });
                          }}
                        />
                        <span>°C</span>
                      </div>`
                    : nothing}
                  ${legacy && room.away === "preset"
                    ? this.presetRow(t, device, presets, "away_preset", room.away_preset, "climate.away_preset")
                    : nothing}`
              : nothing}
            ${legacy && presets.length
              ? html`<div data-tipped>
                  ${this.presetRow(t, device, presets, "free_day_preset", room.free_day_preset, "climate.free_day_preset", true)}
                </div>`
              : nothing}
            ${cooling ? this.renderNight(t, device, room) : nothing}
            <p class="hint">
              ${now && legacy ? (t.optional(`climate.now.${now.why}`, { min: this.awayAfter }) ?? "") : nothing}
              ${rate ? t("climate.rate", { rate: formatNumber(t.lang, rate, 1) }) : t("climate.rate_default")}
            </p>`
        : html`<p class="hint">${t("climate.room.off")}</p>`}
    </section>`;
  }

  private get awayAfter(): number {
    return this.state?.config.climate?.away_after_min ?? AWAY_AFTER_DEFAULT;
  }

  /** Week profiles of an air conditioner: the switch, what runs now, editing and a profile by hand. */
  private renderWeek(
    t: Translate,
    device: ClimateDevice,
    room: ClimateRoomConfig,
    sets: WeekProfile[][],
    now: ClimateRoomStatus | undefined,
  ): TemplateResult {
    const on = !!room.week?.enabled;
    return html`<div class="sub" data-tipped>
      <div class="row">
        <span class="sub-title">${t("week.row")}</span>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(on)}
          aria-label=${t("week.row")}
          @click=${() => this.save(device, { week: { enabled: !on } })}
        ></button>
        ${tip(t, "climate_week")}
      </div>
      ${now?.pending
        ? html`<p class="hint">${t(now.pending === "start" ? "week.pending.start" : "week.pending.end")}</p>`
        : nothing}
      ${on
        ? html`${!sets.length
              ? html`<p class="hint">${t("week.no_sets")}</p>`
              : now?.pending === "start"
                ? nothing
                : now?.kind === "legacy"
                ? html`<p class="hint">
                    ${t("week.legacy_now", { state: this.hvacText(t, this.hass?.states[device.entity_id]?.state ?? device.state) })}
                  </p>`
                : this.renderNow(t, device, now)}
            <div class="row">
              <button type="button" class="btn btn-secondary" @click=${() => this.editWeek(device)}>
                <ha-icon icon="mdi:calendar-clock"></ha-icon>${t("week.edit")}
              </button>
            </div>
            ${sets.length ? this.renderHold(t, device, room, sets, now) : nothing}`
        : nothing}
    </div>`;
  }

  /** What Joe does with a device right now: profile, value, next switching point, or why not. */
  private renderNow(t: Translate, device: ClimateDevice, now: ClimateRoomStatus | undefined): TemplateResult {
    if (!now || !now.kind || now.kind === "legacy") {
      return html``;
    }
    const error = this.weekError[device.entity_id] ?? now.error;
    const failed = error
      ? html`<div class="note warn" role="alert">
          <ha-icon icon="mdi:alert-outline"></ha-icon>
          <span>${t.optional(`week.error.${error}`) ?? t("week.error", { error })}</span>
        </div>`
      : nothing;
    const override = now.override;
    if (override?.reason === "off") {
      return html`<div class="note"><ha-icon icon="mdi:power"></ha-icon><span>${t("week.override.off")}</span></div>${failed}`;
    }
    if (override) {
      const text =
        override.reason === "preset"
          ? override.until
            ? t("week.override.preset", { time: override.until })
            : t("week.override.preset_open")
          : override.until
            ? t("week.override.manual", { time: override.until })
            : t("week.override.manual_open");
      return html`<div class="note" data-tipped>
          <ha-icon icon="mdi:hand-back-right-outline"></ha-icon>
          <span class="note-body">
            <span>${text}</span>
            <span class="with-tip">
              <button type="button" class="mini-btn" @click=${() => void this.resume(device)}>${t("week.resume")}</button>
              ${tip(t, "week_resume")}
            </span>
          </span>
        </div>
        ${failed}`;
    }
    const target = now.target;
    const parts: string[] = [];
    if (now.kind === "device") {
      const preset = target?.preset;
      if (!target) {
        parts.push(t("week.as_is"));
      } else if (target.hvac === "off") {
        parts.push(t("week.state_off"));
      } else if (preset) {
        const index = (device.week_presets ?? []).indexOf(preset);
        const number = t("week.profile", { n: presetNumber(preset, Math.max(0, index)) });
        parts.push(profileLabel(number, this.profilesOf(device.entity_id)[preset]?.name));
      }
    } else {
      parts.push(
        !target ? t("week.as_is") : target.hvac === "off" ? t("week.state_off") : t(`week.mode.${now.mode === "heat" ? "heat" : "cool"}`),
      );
      if (now.profile?.index != null) {
        const name = profileLabel(t("week.profile", { n: now.profile.index + 1 }), now.profile.name);
        // "held" as the reason says it already.
        parts.push(now.profile.held && now.why !== "held" ? `${name} (${t("week.held")})` : name);
      }
      if (target && target.hvac !== "off" && target.temperature != null) {
        parts.push(`${formatNumber(t.lang, target.temperature, 1)}\u00a0°C`);
      }
      if (now.next) {
        parts.push(t("week.next", { time: now.next.at, value: this.valueText(t, now.next.value) }));
      }
    }
    const why = t.optional(`week.why.${now.why}`, { min: this.awayAfter });
    return html`<p class="week-now">
        <span>${t(now.would ? "week.would" : "week.now", { text: parts.join(" · ") || "–" })}</span>
        ${why ? html`<span class="chip">${why}</span>` : nothing}
      </p>
      ${failed}`;
  }

  private valueText(t: Translate, value: WeekValue): string {
    return value === "off" ? t("week.off") : `${formatNumber(t.lang, value, 1)}\u00a0°C`;
  }

  /** A profile by hand: one of the six until midnight or until further notice; "Automatik" gives back. */
  private renderHold(
    t: Translate,
    device: ClimateDevice,
    room: ClimateRoomConfig,
    sets: WeekProfile[][],
    now: ClimateRoomStatus | undefined,
  ): TemplateResult {
    const entity = device.entity_id;
    const mode = now?.mode ?? (this.hass?.states[entity]?.state ?? device.state);
    const profiles = room.week?.modes?.[mode === "heat" ? "heat" : "cool"] ?? sets[0];
    // The choice and how long it holds come from Joe's hold only; one for the other mode waits for it.
    const hold = now?.hold ?? null;
    const here = hold && hold.mode === mode ? hold : null;
    const held = here ? here.profile : null;
    const until = here ? (here.until ? "midnight" : "forever") : (this.holdUntil[entity] ?? "midnight");
    const label = (which: ClimateHold) =>
      profileLabel(t("week.profile", { n: which.profile + 1 }), room.week?.modes?.[which.mode]?.[which.profile]?.name);
    // The night and nobody home come first: the profile waits.
    const want = now?.want;
    const first = here && (want === "night" || want === "away") ? want : null;
    return html`<div data-tipped>
      <div class="row">
        <span>${t("week.hold")}</span>
        ${tip(t, "week_hold")}
      </div>
      <div class="row hold">
        <select
          class="input"
          aria-label=${t("week.hold")}
          .value=${held == null ? "" : String(held)}
          @change=${(ev: Event) => {
            const value = (ev.target as HTMLSelectElement).value;
            void this.hold(device, value === "" ? null : Number(value), until);
          }}
        >
          <option value="" ?selected=${held == null}>${t("week.hold.auto")}</option>
          ${profiles.map(
            (p, i) => html`<option value=${String(i)} ?selected=${held === i}>${profileLabel(t("week.profile", { n: i + 1 }), p.name)}</option>`,
          )}
        </select>
        <span class="seg" role="group" aria-label=${t("week.hold.until")}>
          ${(["midnight", "forever"] as const).map(
            (way) => html`<button
              type="button"
              aria-pressed=${String(until === way)}
              @click=${() => {
                if (here) {
                  if (way !== until) void this.hold(device, here.profile, way);
                } else {
                  this.holdUntil = { ...this.holdUntil, [entity]: way };
                }
              }}
            >
              ${t(`week.hold.${way}`)}
            </button>`,
          )}
        </span>
      </div>
      ${first && here ? html`<p class="hint">${t(`week.hold.later_${first}`, { profile: label(here) })}</p>` : nothing}
      ${hold && !here
        ? html`<div class="note" role="status">
            <ha-icon icon="mdi:information-outline"></ha-icon>
            <span class="note-body">
              <span>
                ${t("week.hold.other_mode", {
                  profile: label(hold),
                  mode: t(`week.mode.${hold.mode}`),
                  until: t(`week.hold.${hold.until ? "midnight" : "forever"}`),
                })}
              </span>
              <button type="button" class="mini-btn" @click=${() => void this.hold(device, null, until)}>${t("week.hold.lift")}</button>
            </span>
          </div>`
        : nothing}
    </div>`;
  }

  /** Tags on the device's own week programs (e.g. Homematic IP); times stay in the device. */
  private renderPrograms(t: Translate, device: ClimateDevice, programs: string[], now: ClimateRoomStatus | undefined): TemplateResult {
    const profiles = this.profilesOf(device.entity_id);
    const tags = programs.flatMap((preset) => profiles[preset]?.tags ?? []);
    const day = this.state?.climate?.day;
    const homeOffice = day ? day.home_office_available : true;
    const reason = day?.home_office_reason ?? "no_calendar";
    const mode = this.hass?.states[device.entity_id]?.state ?? device.state;
    return html`<div class="sub" data-tipped>
      <div class="row">
        <span class="sub-title">${t("devprof.title")}</span>
        ${tip(t, "climate_device_profiles")}
      </div>
      ${now?.pending
        ? html`<p class="hint">${t(now.pending === "start" ? "devprof.pending.start" : "devprof.pending.end")}</p>`
        : nothing}
      ${programs.map((preset, i) => {
        const profile = profiles[preset] ?? { name: "", tags: [] };
        const number = t("week.profile", { n: presetNumber(preset, i) });
        return html`<div class="preset">
          <div class="preset-name">
            <input
              class="input"
              type="text"
              maxlength="30"
              placeholder=${number}
              aria-label=${t("devprof.name", { preset: number })}
              .value=${profile.name}
              @change=${(ev: Event) =>
                this.savePrograms(device, programs, preset, { name: (ev.target as HTMLInputElement).value.trim().slice(0, 30) })}
            />
            <code>${preset}</code>
          </div>
          <div class="tags" role="group" aria-label=${t("devprof.tags", { preset: number })}>
            ${WEEK_TAGS.map((tag) => {
              const on = profile.tags.includes(tag);
              const blocked = tag === "home_office" && !homeOffice && !on;
              return html`<button
                type="button"
                class="mini-btn tag-btn"
                aria-pressed=${String(on)}
                ?disabled=${blocked}
                title=${blocked ? t(`week.ho.${reason}`) : ""}
                @click=${() => this.toggleProgramTag(t, device, programs, preset, tag)}
              >
                <ha-icon icon=${TAG_ICONS[tag]}></ha-icon>${t(`week.tag.${tag}`)}
              </button>`;
            })}
          </div>
        </div>`;
      })}
      ${this.moved[device.entity_id]
        ? html`<div class="note" role="status"><ha-icon icon="mdi:information-outline"></ha-icon><span>${this.moved[device.entity_id]}</span></div>`
        : nothing}
      ${tags.length && !tags.includes("normal")
        ? html`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${t("devprof.need_normal")}</span></div>`
        : nothing}
      ${now?.why === "manual_mode"
        ? html`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon><span>${t("devprof.not_auto", { state: this.hvacText(t, mode) })}</span>
          </div>`
        : nothing}
      ${homeOffice
        ? nothing
        : html`<p class="hint">${t(`week.ho.${reason}`)}</p>
            <div class="row">${this.daysLink(t)}</div>`}
      ${tags.length && now?.kind === "device" ? this.renderNow(t, device, now) : nothing}
    </div>`;
  }

  /** A tag sits on one program only: setting it moves it here. */
  private toggleProgramTag(t: Translate, device: ClimateDevice, programs: string[], preset: string, tag: WeekTag): void {
    const profiles = this.profilesOf(device.entity_id);
    const on = (profiles[preset]?.tags ?? []).includes(tag);
    const from = on ? undefined : programs.find((p) => p !== preset && profiles[p]?.tags.includes(tag));
    const label = (p: string) => profiles[p]?.name || t("week.profile", { n: presetNumber(p, programs.indexOf(p)) });
    this.moved = {
      ...this.moved,
      [device.entity_id]: from ? t("devprof.moved", { tag: t(`week.tag.${tag}`), to: label(preset), from: label(from) }) : "",
    };
    const tags = on ? profiles[preset].tags.filter((x) => x !== tag) : WEEK_TAGS.filter((x) => x === tag || profiles[preset]?.tags.includes(x));
    this.savePrograms(device, programs, preset, { tags });
  }

  /**
   * Saves all of a device's programs at once (they replace each other as a
   * whole), on top of what was sent last: a name and a tag right after it
   * must not overwrite each other.
   */
  private savePrograms(device: ClimateDevice, programs: string[], preset: string, change: Partial<DeviceProfileConfig>): void {
    const entity = device.entity_id;
    const base = this.profilesOf(entity);
    // Programs the device no longer has are dropped.
    const all: Record<string, DeviceProfileConfig> = Object.fromEntries(
      Object.entries(structuredClone(base)).filter(([key]) => programs.includes(key)),
    );
    const own = { ...(all[preset] ?? { name: "", tags: [] }), ...change };
    all[preset] = own;
    // Its tags leave every other program.
    for (const [key, value] of Object.entries(all)) {
      if (key !== preset) all[key] = { ...value, tags: value.tags.filter((x) => !own.tags.includes(x)) };
    }
    // Programs without a name or tag need no entry.
    for (const [key, value] of Object.entries(all)) {
      if (!value.name && !value.tags.length) delete all[key];
    }
    if (profilesKey(all) === profilesKey(base)) return;
    this.pending = { ...this.pending, [entity]: all };
    void saveConfig(this, { climate: { rooms: { [entity]: { device_profiles: all } } } }).then((ok) => {
      if (!ok && this.pending[entity] === all) {
        const { [entity]: _, ...rest } = this.pending;
        this.pending = rest;
      }
    });
  }

  private editWeek(device: ClimateDevice): void {
    this.dispatchEvent(new CustomEvent("joe-edit", { detail: { editor: "week", id: device.entity_id }, bubbles: true, composed: true }));
  }

  private async hold(device: ClimateDevice, profile: number | null, until: "midnight" | "forever"): Promise<void> {
    await this.weekCommand(device, { type: "energy_joe/climate/week/hold", entity_id: device.entity_id, profile, until });
  }

  private async resume(device: ClimateDevice): Promise<void> {
    await this.weekCommand(device, { type: "energy_joe/climate/week/resume", entity_id: device.entity_id });
  }

  private async weekCommand(device: ClimateDevice, msg: { type: string; [key: string]: unknown }): Promise<void> {
    const { [device.entity_id]: _, ...rest } = this.weekError;
    this.weekError = rest;
    try {
      await this.hass?.callWS(msg);
    } catch (err) {
      this.weekError = { ...this.weekError, [device.entity_id]: String((err as { message?: string })?.message ?? err) };
    }
  }

  /** One line per climate device and the device that measures it; several may share one. */
  private renderMeters(t: Translate, joe: JoeState, all: ClimateDevice[]): TemplateResult {
    const meters = this.found?.meters ?? [];
    const rooms = joe.config.climate?.rooms ?? {};
    // Only devices that use power themselves: air conditioners, or what has a meter already.
    const devices = all.filter((d) => {
      const meter = rooms[d.entity_id]?.meter;
      const own = this.found?.suggested?.[d.entity_id]?.device_id;
      return (
        d.hvac_modes.some((mode) => ["cool", "dry", "fan_only", "heat_cool"].includes(mode)) ||
        (meter && meter !== "none") ||
        (own != null && own === d.device_id)
      );
    });
    if (!devices.length) return html``;
    const linked = devices.filter((d) => {
      const meter = rooms[d.entity_id]?.meter;
      return meter && meter !== "none";
    }).length;
    return html`<section class="card" data-tipped>
      <div class="head">
        <button type="button" class="fold" aria-expanded=${String(this.metersOpen)} @click=${() => (this.metersOpen = !this.metersOpen)}>
          <ha-icon icon=${this.metersOpen ? "mdi:chevron-down" : "mdi:chevron-right"}></ha-icon>
          <span class="eyebrow"><ha-icon icon="mdi:meter-electric-outline"></ha-icon>${t("climate.meters")}</span>
          <span class="chip">${t("climate.meters.count", { linked, all: devices.length })}</span>
        </button>
        ${tip(t, "climate_meter")}
      </div>
      ${this.metersOpen
        ? html`<p class="hint">${t("climate.meters.say")}</p>
            ${!meters.length ? html`<p class="hint">${t("climate.meter.no_meters")}</p>` : nothing}
            ${devices.map((device) => this.meterLine(t, device, devices, rooms))}`
        : nothing}
    </section>`;
  }

  /** One air conditioner: its meter (or Joe's suggestion), and a small search to pick another. */
  private meterLine(
    t: Translate,
    device: ClimateDevice,
    devices: ClimateDevice[],
    rooms: Record<string, ClimateRoomConfig>,
  ): TemplateResult {
    const meter = rooms[device.entity_id]?.meter ?? null;
    const chosen = meter && meter !== "none" ? meter : null;
    const suggested = meter == null ? this.found?.suggested?.[device.entity_id] : undefined;
    const sharing = chosen
      ? devices.filter((d) => d.entity_id !== device.entity_id && this.sameMeter(rooms[d.entity_id]?.meter, chosen))
      : [];
    const power = chosen?.power ? this.hass?.states[chosen.power] : undefined;
    const shown = chosen ? (this.option(chosen) ?? null) : (suggested ?? null);
    const picking = this.picking === device.entity_id;
    return html`<div class="line">
      <div class="dev">
        <span class="dev-name">
          <b>${deviceLink(device.device_id, device.name, t("climate.open_device", { id: device.entity_id }))}</b>
          ${haOpen(t, { deviceId: device.device_id, entityId: device.entity_id, name: device.name })}
        </span>
        <small>${device.area ?? t("climate.no_area")}</small>
        <details class="ent">
          <summary>${t("climate.entities")}</summary>
          <code>${device.entity_id}</code>
          ${chosen?.power ? html`<code>${chosen.power}</code>` : nothing}
          ${chosen?.energy ? html`<code>${chosen.energy}</code>` : nothing}
        </details>
      </div>
      <div class="meter-pick">
        ${picking
          ? this.meterSearch(t, device)
          : html`<span class="dev-name">
              <span class="picked">
                ${shown
                  ? html`<b>${deviceLink(shown.device_id, `${shown.name ?? shown.device_id}${shown.sensor ? ` · ${shown.sensor}` : ""}`, t("climate.open_meter"))}</b>
                      ${shown.via ? html`<small class="via">${shown.via}</small>` : nothing}`
                  : chosen
                    ? html`<b>${deviceLink(chosen.device_id, chosen.power ?? chosen.energy ?? chosen.device_id, t("climate.open_meter"))}</b>`
                    : html`<small>${t(meter === "none" ? "climate.meter.without_long" : "climate.meter.open_long")}</small>`}
              </span>
              ${shown ? haOpen(t, this.meterTarget(shown)) : chosen ? haOpen(t, this.meterTarget(chosen)) : nothing}
            </span>`}
      </div>
      <div class="state">
        ${picking
          ? nothing
          : chosen
            ? html`<span class="chip ok">${power ? this.reading(t, power) : t("climate.meter.linked")}</span>
                <button type="button" class="mini-btn" @click=${() => this.startPicking(device)}>${t("climate.meter.change")}</button>`
            : suggested
              ? html`<button type="button" class="btn btn-secondary" @click=${() => this.save(device, { meter: this.meterOf(suggested) })}>
                    ${t("climate.meter.confirm")}
                  </button>
                  <button type="button" class="mini-btn" @click=${() => this.startPicking(device)}>${t("climate.meter.other_short")}</button>`
              : html`<button type="button" class="mini-btn" @click=${() => this.startPicking(device)}>${t("climate.meter.search")}</button>`}
      </div>
      ${sharing.length ? html`<p class="hint shared">${t("climate.meter.shared", { names: sharing.map((d) => d.name).join(", ") })}</p>` : nothing}
    </div>`;
  }

  private startPicking(device: ClimateDevice): void {
    this.picking = device.entity_id;
    this.query = "";
    void this.updateComplete.then(() => this.shadowRoot?.querySelector<HTMLInputElement>(".meter-pick input")?.focus());
  }

  /** A small search over all devices with a power or energy sensor. */
  private meterSearch(t: Translate, device: ClimateDevice): TemplateResult {
    const words = this.query.toLowerCase().split(/\s+/).filter(Boolean);
    const hits = (this.found?.meters ?? [])
      .filter((m) => {
        const text = [m.name, m.sensor, m.via, m.area, m.power, m.energy].join(" ").toLowerCase();
        return words.every((w) => text.includes(w));
      })
      .slice(0, 8);
    return html`<input
        class="input"
        type="search"
        placeholder=${t("climate.meter.search_placeholder")}
        aria-label=${t("climate.meter.pick", { name: device.name })}
        .value=${this.query}
        @input=${(ev: Event) => (this.query = (ev.target as HTMLInputElement).value)}
        @keydown=${(ev: KeyboardEvent) => {
          if (ev.key === "Escape") this.picking = undefined;
          if (ev.key === "Enter" && hits[0]) this.pickMeter(device, this.key(hits[0]));
        }}
      />
      <div class="hits" role="listbox" aria-label=${t("climate.meter.pick", { name: device.name })}>
        ${hits.map(
          (m) => html`<div class="hit-row">
            <button type="button" role="option" class="hit" @click=${() => this.pickMeter(device, this.key(m))}>
              <b>${m.name ?? m.device_id}${m.sensor ? ` · ${m.sensor}` : ""}</b>
              <small>${[m.via, m.area, m.power ? this.readingOf(t, m.power) : ""].filter(Boolean).join(" · ")}</small>
            </button>
            ${haOpen(t, this.meterTarget(m))}
          </div>`,
        )}
        ${!hits.length ? html`<small class="none">${t("climate.meter.no_hits")}</small>` : nothing}
        <div class="hit-actions">
          <button type="button" class="mini-btn" @click=${() => this.pickMeter(device, "none")}>${t("climate.meter.none_option")}</button>
          <button type="button" class="mini-btn quiet" @click=${() => (this.picking = undefined)}>${t("climate.meter.cancel")}</button>
        </div>
      </div>`;
  }

  /** A meter in Home Assistant: its device (every meter has one). */
  private meterTarget(meter: ClimateMeter | ClimateMeterOption): HaTarget {
    const option = "name" in meter ? meter : this.option(meter);
    const name = [option?.name ?? meter.device_id, option?.sensor].filter(Boolean).join(" · ");
    return { deviceId: meter.device_id, entityId: meter.power ?? meter.energy, name };
  }

  private readingOf(t: Translate, entity: string): string {
    const state = this.hass?.states[entity];
    return state ? this.reading(t, state) : "";
  }

  private key(meter: ClimateMeter): string {
    return [meter.device_id, meter.power ?? "", meter.energy ?? ""].join("|");
  }

  private option(meter: ClimateMeter): ClimateMeterOption | undefined {
    return (this.found?.meters ?? []).find((m) => this.key(m) === this.key(meter));
  }

  private meterOf(option: ClimateMeter): ClimateMeter {
    return { device_id: option.device_id, power: option.power, energy: option.energy };
  }

  private sameMeter(meter: ClimateRoomConfig["meter"], other: ClimateMeter): boolean {
    return !!meter && meter !== "none" && this.key(meter) === this.key(other);
  }

  /** A sensor's value with its unit, numbers in the user's language. */
  private reading(t: Translate, sensor: { state: string; attributes: Record<string, unknown> }): string {
    const value = Number(sensor.state);
    const text = sensor.state !== "" && Number.isFinite(value) ? formatNumber(t.lang, value, value % 1 ? 1 : 0) : sensor.state;
    return `${text} ${String(sensor.attributes.unit_of_measurement ?? "")}`.trim();
  }

  private pickMeter(device: ClimateDevice, value: string): void {
    this.picking = undefined;
    if (value === "none") {
      this.save(device, { meter: "none" });
      return;
    }
    const option = (this.found?.meters ?? []).find((m) => this.key(m) === value);
    if (option) this.save(device, { meter: this.meterOf(option) });
  }

  private presetRow(
    t: Translate,
    device: ClimateDevice,
    presets: string[],
    key: "away_preset" | "free_day_preset",
    value: string | null,
    label: "climate.away_preset" | "climate.free_day_preset",
    optional = false,
  ): TemplateResult {
    return html`<div class="row">
      <span>${t(label)}</span>
      <select
        class="input"
        aria-label=${t(label)}
        @change=${(ev: Event) => this.save(device, { [key]: (ev.target as HTMLSelectElement).value || null })}
      >
        ${optional ? html`<option value="" ?selected=${!value}>${t("climate.no_preset")}</option>` : nothing}
        ${!optional && !value ? html`<option value="" selected disabled>${t("climate.pick_preset")}</option>` : nothing}
        ${presets.map((p) => html`<option value=${p} ?selected=${p === value}>${p}</option>`)}
      </select>
      ${optional ? tip(this.t!, "climate_free_day") : nothing}
    </div>`;
  }

  private renderNight(t: Translate, device: ClimateDevice, room: ClimateRoomConfig): TemplateResult {
    const time = (key: "night_from" | "night_until", value: string) => html`<input
      class="input short"
      type="time"
      aria-label=${t(`climate.${key}`)}
      .value=${value}
      @change=${(ev: Event) => {
        const text = (ev.target as HTMLInputElement).value;
        if (/^\d{1,2}:\d{2}$/.test(text)) this.save(device, { [key]: text });
      }}
    />`;
    return html`<div class="row" data-tipped>
      <span>${t("climate.night_off")}</span>
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${String(room.night_off)}
        aria-label=${t("climate.night_off")}
        @click=${() => this.save(device, { night_off: !room.night_off })}
      ></button>
      ${tip(t, "climate_night")}
    </div>
    ${room.night_off
      ? this.state?.config.climate?.night_by === "entity"
        ? html`<div class="row">
            <span>${t("climate.night_back")}</span>
            ${time("night_until", room.night_until)}
          </div>`
        : html`<div class="row">
            <span>${t("climate.night_span")}</span>
            ${time("night_from", room.night_from)} – ${time("night_until", room.night_until)}
          </div>`
      : nothing}`;
  }

  /** Sends only what changed: a whole room would overwrite its week profiles. */
  private save(device: ClimateDevice, change: RoomChange): void {
    void saveConfig(this, { climate: { rooms: { [device.entity_id]: change } } });
  }
}

define("joe-climate-group", JoeClimateGroup);
