import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { deviceLink } from "../../components/bits";
import { haOpen, type HaTarget } from "../../components/ha-open";
import { mirrorRow } from "../../components/mirror";
import "../../components/sheet";
import { tip } from "../../components/tip";
import { saveConfig } from "../../config";
import { define } from "../../define";
import { deviceRoute, type DeviceEntry } from "../../device-model";
import "../../editors/week-editor";
import { formatNumber } from "../../entities";
import type { Translate } from "../../i18n";
import { climateRate } from "../../learned-view";
import { PANEL, closeSheet, href, navigate, onLink, type Route } from "../../router";
import { shared } from "../../styles/shared";
import {
  CONSUMER_KINDS,
  WEEK_MODES,
  WEEK_TAGS,
  type ClimateDevice,
  type ClimateFound,
  type ClimateHold,
  type ClimateMeter,
  type ClimateMeterOption,
  type ClimateRoomConfig,
  type ClimateRoomStatus,
  type ConsumerConfig,
  type ConsumerKind,
  type ConsumerRuns,
  type DeviceProfileConfig,
  type HomeAssistant,
  type JoeState,
  type WeekMode,
  type WeekProfile,
  type WeekTag,
  type WeekValue,
} from "../../types";
import { TAG_ICONS, profileLabel } from "../../week";
import {
  AWAY_AFTER_DEFAULT,
  measured,
  nightText,
  presetNumber,
  profilesKey,
  roomView,
  temperatureText,
  temperatures,
  usesPower,
  type RoomChange,
  type RoomView,
} from "./climate-view";
import { deviceFrame, frameFromEntry, frameStyles, type FrameContext } from "./device-frame";

/** Haushalt › Tage & Kalender: the calendar rules that tell home office days. */
const DAYS: Route = { tab: "household", section: "days" };
/** Haushalt › Nachtruhe: when it is night for every device. */
const NIGHT: Route = { tab: "household", section: "night" };
/** When a climate meter runs: as needed (counts for the battery), or only on surplus / cheap power. */
const RUNS = ["auto", "surplus", "cheap"] as const;

/**
 * One thermostat or air conditioner (/devices/climate/<entity>): what runs
 * now and why, a profile by hand, how Joe steers it, its power meter, what
 * Joe learned and the last switches. The week profiles open as an addressed
 * sheet (/devices/climate/<entity>/week[/<mode>]). A climate meter Joe cannot
 * place (/devices/climate/<consumerId>) gets a page to put it to its device.
 */
export class JoeClimateDevice extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;
  @property({ attribute: false }) route?: Route;
  @property({ attribute: false }) prefix = PANEL;
  /** Thermostats, air conditioners and meters (energy_joe/climate/devices). */
  @property({ attribute: false }) found?: ClimateFound;
  /** All devices of Geräte (to tell where a meter went after its kind changed). */
  @property({ attribute: false }) devices: DeviceEntry[] = [];
  @property({ attribute: false }) entry?: DeviceEntry;
  /** "week" opens the week profiles over the page. */
  @property({ attribute: false }) sub?: string;

  /** The meter search is open, and its text. */
  @state() private picking = false;
  @state() private query = "";
  /** Per device: how long the next profile by hand holds (while none holds). */
  @state() private holdUntil: Record<string, "midnight" | "forever"> = {};
  /** Per device: the device profiles last sent, until the config has them (or saving failed). */
  @state() private pending: Record<string, Record<string, DeviceProfileConfig>> = {};
  /** Per device: a note that a tag moved to another device profile. */
  @state() private moved: Record<string, string> = {};
  /** Per device: a week command that failed. */
  @state() private weekError: Record<string, string> = {};
  /** A meter whose kind was changed here: say where it lives now. */
  @state() private kindChanged?: string;

  static styles = [
    shared,
    frameStyles,
    css`
      :host {
        display: block;
      }
      .row {
        display: flex;
        align-items: center;
        gap: 8px 12px;
        flex-wrap: wrap;
        margin-top: 12px;
      }
      .dsec > .row:first-of-type,
      .dsec > div:first-of-type > .row:first-child {
        margin-top: 0;
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
      .row select.input {
        flex: 1 1 160px;
      }
      .row.hold {
        margin-top: 6px;
      }
      .hint {
        margin: 8px 0 0;
        color: var(--joe-muted);
        font-size: 13px;
      }
      .with-tip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      details.ent {
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
      .week-now {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px 8px;
        font-weight: 600;
      }
      .week-now + .week-now {
        margin-top: 6px;
      }
      .week-now .chip {
        font-weight: 600;
      }
      .week-now.quiet {
        font-weight: 400;
      }
      .note-body {
        display: grid;
        gap: 8px;
        justify-items: start;
        min-width: 0;
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
      a.btn {
        text-decoration: none;
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
      .night-mirror {
        margin-top: 4px;
      }
      .meter {
        display: grid;
        gap: 8px;
        margin-top: 10px;
      }
      .meter-pick {
        display: grid;
        gap: 6px;
        min-width: 0;
      }
      .picked-row {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
      }
      .picked {
        flex: 1;
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
      .meter .state {
        display: flex;
        gap: 6px;
        align-items: center;
        flex-wrap: wrap;
      }
      .hits {
        display: grid;
        gap: 2px;
        max-height: 300px;
        overflow-y: auto;
      }
      .hit-row {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .hit {
        flex: 1;
        min-width: 0;
        min-height: 44px;
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
      .consumer {
        margin-top: 14px;
        padding-top: 12px;
        border-top: 1px solid var(--joe-line);
      }
      .meter + .consumer,
      .consumer:first-child {
        margin-top: 14px;
      }
      .consumer-name {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 4px 8px;
      }
      .consumer-name span {
        color: var(--joe-ink-2);
      }
      .learned-line {
        margin: 0;
      }
      .head-extra {
        display: grid;
        gap: 8px;
      }
    `,
  ];

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has("entry") && changed.get("entry")?.id !== this.entry?.id) {
      // Another device: the search and notes belong to the one before.
      this.picking = false;
      this.query = "";
      this.kindChanged = undefined;
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

  private get ctx(): FrameContext {
    return { t: this.t!, prefix: this.prefix, hass: this.hass, state: this.state };
  }

  /** A device's profiles: what was sent last, else the config. */
  private profilesOf(entity: string): Record<string, DeviceProfileConfig> {
    return this.pending[entity] ?? this.state?.config.climate?.rooms?.[entity]?.device_profiles ?? {};
  }

  /** A device's operating mode in the user's language ("heat_cool" → "Heizen/Kühlen"). */
  private hvacText(t: Translate, mode: string): string {
    return t.optional(`climate.hvac.${mode}`) ?? mode;
  }

  private get awayAfter(): number {
    return this.state?.config.climate?.away_after_min ?? AWAY_AFTER_DEFAULT;
  }

  protected render() {
    const { t, state: joe, entry } = this;
    if (!t || !joe || !entry) {
      return nothing;
    }
    if (entry.unassigned && entry.consumer) {
      return this.renderUnassigned(t, joe, entry, entry.consumer);
    }
    const ctx = this.ctx;
    const base = frameFromEntry(ctx, entry);
    const names = Object.fromEntries((this.found?.devices ?? []).map((d) => [d.entity_id, d.name]));
    const log = base.log ? { ...base.log, names } : undefined;
    const device = entry.climate ?? this.found?.devices.find((d) => d.entity_id === entry.id);
    if (!device) {
      // Home Assistant does not know the device any more: the head says so, the log stays.
      return deviceFrame(ctx, { ...base, log });
    }
    const entity = device.entity_id;
    const now = joe.climate?.rooms?.[entity];
    const view = roomView(device, joe.config.climate?.rooms?.[entity], now, this.profilesOf(entity));
    const rate = joe.climate?.rates?.[entity];
    return html`${deviceFrame(ctx, {
      ...base,
      live: temperatureText(t, temperatures(this.hass, device, entity)),
      why: this.renderWhy(t, device, view, now),
      head: this.renderHead(t, joe, device, view, now),
      now: view.room.enabled ? this.renderNowSection(t, device, view, now) : undefined,
      steer: this.renderSteer(t, joe, device, view, now),
      power: this.renderPower(t, joe, entry, device),
      learned: view.room.enabled || rate ? html`<p class="learned-line">${climateRate(t, rate)}</p>` : undefined,
      learnedArea: "climate",
      log,
      tips: { power: "climate_meter" },
    })}
    ${this.sub === "week" ? this.renderWeekSheet(t, joe, device) : nothing}`;
  }

  // --- Kopf ---

  /** Whether "Jetzt: …" from the profiles shows (the same rules as the room card had). */
  private nowShown(view: RoomView, now: ClimateRoomStatus | undefined): boolean {
    if (!view.room.enabled || !now?.kind || now.kind === "legacy") {
      return false;
    }
    if (view.cooling && !view.programs.length) {
      return !!view.room.week?.enabled && view.sets.length > 0 && now.pending !== "start";
    }
    const profiles = this.profilesOf(this.entry?.id ?? "");
    const tags = view.programs.flatMap((preset) => profiles[preset]?.tags ?? []);
    return view.programs.length > 0 && tags.length > 0 && now.kind === "device";
  }

  /** "Jetzt gilt … weil …": the profile and value now, or what the old settings do. */
  private renderWhy(t: Translate, device: ClimateDevice, view: RoomView, now: ClimateRoomStatus | undefined): TemplateResult | string {
    if (!view.room.enabled) {
      return t("climate.room.off");
    }
    const week = view.cooling && !view.programs.length && !!view.room.week?.enabled;
    const legacyNow =
      week && view.sets.length && now?.pending !== "start" && now?.kind === "legacy"
        ? html`<span class="week-now quiet">
            ${t("week.legacy_now", { state: this.hvacText(t, this.hass?.states[device.entity_id]?.state ?? device.state) })}
          </span>`
        : nothing;
    const old = now && view.legacy ? (t.optional(`climate.now.${now.why}`, { min: this.awayAfter }) ?? "") : "";
    return html`${this.nowShown(view, now) ? this.nowLine(t, device, now!) : nothing} ${legacyNow}
    ${old ? html`<span class="week-now quiet">${old}</span>` : nothing}`;
  }

  /** What Joe does with a device right now: profile, value, next switching point, or a change by hand. */
  private nowLine(t: Translate, device: ClimateDevice, now: ClimateRoomStatus): TemplateResult {
    const override = now.override;
    if (override?.reason === "off") {
      return html`<span class="week-now"><ha-icon icon="mdi:power"></ha-icon><span>${t("week.override.off")}</span></span>`;
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
      return html`<span class="week-now"><ha-icon icon="mdi:hand-back-right-outline"></ha-icon><span>${text}</span></span>`;
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
        parts.push(`${formatNumber(t.lang, target.temperature, 1)} °C`);
      }
      if (now.next) {
        parts.push(t("week.next", { time: now.next.at, value: this.valueText(t, now.next.value) }));
      }
    }
    const why = t.optional(`week.why.${now.why}`, { min: this.awayAfter });
    return html`<span class="week-now">
      <span>${t(now.would ? "week.would" : "week.now", { text: parts.join(" · ") || "–" })}</span>
      ${why ? html`<span class="chip">${why}</span>` : nothing}
    </span>`;
  }

  private valueText(t: Translate, value: WeekValue): string {
    return value === "off" ? t("week.off") : `${formatNumber(t.lang, value, 1)} °C`;
  }

  /** Below the head: a failed week command, the main switch when it is off, the entity id. */
  private renderHead(t: Translate, joe: JoeState, device: ClimateDevice, view: RoomView, now: ClimateRoomStatus | undefined): TemplateResult {
    const error = this.nowShown(view, now) ? (this.weekError[device.entity_id] ?? now?.error) : undefined;
    const main = joe.config.climate?.enabled;
    return html`<div class="head-extra">
      ${error
        ? html`<div class="note warn" role="alert">
            <ha-icon icon="mdi:alert-outline"></ha-icon>
            <span>${t.optional(`week.error.${error}`) ?? t("week.error", { error })}</span>
          </div>`
        : nothing}
      ${!main && view.room.enabled
        ? mirrorRow(t, this.prefix, {
            label: t("climate.enabled"),
            value: t("climate.device.main_off"),
            to: { tab: "devices", section: "climate" },
          })
        : nothing}
      <details class="ent" data-notip><summary>${t("climate.entity")}</summary><code>${device.entity_id}</code></details>
    </div>`;
  }

  // --- Jetzt ---

  /** "Zurück zum Plan" after a change by hand, and a profile by hand. */
  private renderNowSection(t: Translate, device: ClimateDevice, view: RoomView, now: ClimateRoomStatus | undefined): TemplateResult | undefined {
    const override = this.nowShown(view, now) && now?.override && now.override.reason !== "off";
    const hold = view.cooling && !view.programs.length && !!view.room.week?.enabled && view.sets.length > 0;
    if (!override && !hold) {
      return undefined;
    }
    return html`${override
      ? html`<div class="row" data-tipped>
          <span>${t("week.why.override")}</span>
          <button type="button" class="btn btn-secondary" @click=${() => void this.resume(device)}>${t("week.resume")}</button>
          ${tip(t, "week_resume")}
        </div>`
      : nothing}
    ${hold ? this.renderHold(t, device, view.room, view.sets, now) : nothing}`;
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

  // --- Steuern ---

  private renderSteer(t: Translate, joe: JoeState, device: ClimateDevice, view: RoomView, now: ClimateRoomStatus | undefined): TemplateResult {
    const { room, cooling, presets, programs, sets, deviceRuns, legacy, awayTagged, awayWays, away } = view;
    return html`<div class="row" data-tipped>
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
                  ? html`<div class="row" data-tipped>
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
                      ${tip(t, legacy ? "climate_away" : "week_away")}
                    </div>`
                  : nothing}
                ${legacy && room.away === "preset"
                  ? html`<div data-tipped>
                      ${this.presetRow(t, device, presets, "away_preset", room.away_preset, "climate.away_preset")}
                    </div>`
                  : nothing}`
            : nothing}
          ${legacy && presets.length
            ? html`<div data-tipped>
                ${this.presetRow(t, device, presets, "free_day_preset", room.free_day_preset, "climate.free_day_preset", true)}
              </div>`
            : nothing}
          ${cooling ? this.renderNight(t, joe, device, room) : nothing}`
        : nothing}`;
  }

  /** "Haushalt › Tage & Kalender →": where home office days are told. */
  private daysLink(t: Translate): TemplateResult {
    return html`<a class="mini-btn quiet" href=${href(this.prefix, DAYS)} @click=${onLink(DAYS)}>
      <ha-icon icon="mdi:calendar-text-outline"></ha-icon>${t("week.ho.rules")}
    </a>`;
  }

  private weekRoute(device: ClimateDevice, mode?: WeekMode): Route {
    return { tab: "devices", section: "climate", id: device.entity_id, sub: "week", rest: mode ? [mode] : undefined };
  }

  /** Week profiles of an air conditioner: the switch and editing (what runs now is in the head). */
  private renderWeek(
    t: Translate,
    device: ClimateDevice,
    room: ClimateRoomConfig,
    sets: WeekProfile[][],
    now: ClimateRoomStatus | undefined,
  ): TemplateResult {
    const on = !!room.week?.enabled;
    const edit = this.weekRoute(device);
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
        ? html`${!sets.length ? html`<p class="hint">${t("week.no_sets")}</p>` : nothing}
            <div class="row">
              <a class="btn btn-secondary" href=${href(this.prefix, edit)} @click=${onLink(edit, { sheet: true })}>
                <ha-icon icon="mdi:calendar-clock"></ha-icon>${t("week.edit")}
              </a>
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
      ${tip(t, optional ? "climate_free_day" : "climate_away")}
    </div>`;
  }

  /** "Nachts aus" with the device's own times; when it is night comes from Haushalt › Nachtruhe. */
  private renderNight(t: Translate, joe: JoeState, device: ClimateDevice, room: ClimateRoomConfig): TemplateResult {
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
    const night = nightText(t, this.hass, joe);
    return html`<div class="sub" data-tipped>
      <div class="row">
        <span class="sub-title">${t("climate.night_off")}</span>
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
        ? joe.config.climate?.night_by === "entity"
          ? html`<div class="row">
              <span>${t("climate.night_back")}</span>
              ${time("night_until", room.night_until)}
            </div>`
          : html`<div class="row">
              <span>${t("climate.night_span")}</span>
              ${time("night_from", room.night_from)} – ${time("night_until", room.night_until)}
            </div>`
        : nothing}
      <div class="night-mirror">
        ${mirrorRow(t, this.prefix, { label: t("climate.mirror.night"), value: night.text, to: NIGHT, action: night.set ? "change" : "set" })}
      </div>
    </div>`;
  }

  /** Sends only what changed: a whole room would overwrite its week profiles. */
  private save(device: ClimateDevice, change: RoomChange): void {
    void saveConfig(this, { climate: { rooms: { [device.entity_id]: change } } });
  }

  // --- Strom ---

  /** The device's meter (pair, change, search) and its entry in the Energy dashboard. */
  private renderPower(t: Translate, joe: JoeState, entry: DeviceEntry, device: ClimateDevice): TemplateResult | undefined {
    const rooms = joe.config.climate?.rooms ?? {};
    const powered = (this.found?.devices ?? []).filter((d) => usesPower(d, rooms, this.found));
    const meter = powered.some((d) => d.entity_id === device.entity_id);
    const moved = this.movedNote(t);
    if (!meter && !entry.consumer && !moved) {
      return undefined;
    }
    return html`${meter
      ? html`<p class="hint">${t("climate.meters.say")}</p>
          ${!(this.found?.meters ?? []).length ? html`<p class="hint">${t("climate.meter.no_meters")}</p>` : nothing}
          ${this.meterLine(t, device, powered, rooms)}`
      : nothing}
    ${entry.consumer ? this.consumerRows(t, entry.consumer) : nothing} ${moved}`;
  }

  /** The meter (or Joe's suggestion) and a small search to pick another. */
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
    return html`<div class="meter">
      <div class="meter-pick">
        ${this.picking
          ? this.meterSearch(t, device)
          : html`<span class="picked-row">
              <span class="picked">
                ${shown
                  ? html`<b>${deviceLink(shown.device_id, `${shown.name ?? shown.device_id}${shown.sensor ? ` · ${shown.sensor}` : ""}`, t("climate.open_meter"))}</b>
                      ${shown.via ? html`<small class="via">${shown.via}</small>` : nothing}
                      ${shown.area ? html`<small>${shown.area}</small>` : nothing}`
                  : chosen
                    ? html`<b>${deviceLink(chosen.device_id, chosen.power ?? chosen.energy ?? chosen.device_id, t("climate.open_meter"))}</b>`
                    : html`<small>${t(meter === "none" ? "climate.meter.without_long" : "climate.meter.open_long")}</small>`}
              </span>
              ${shown ? haOpen(t, this.meterTarget(shown)) : chosen ? haOpen(t, this.meterTarget(chosen)) : nothing}
            </span>`}
      </div>
      ${this.picking
        ? nothing
        : html`<div class="state">
            ${chosen
              ? html`<span class="chip ok">${power ? this.reading(t, power) : t("climate.meter.linked")}</span>
                  <button type="button" class="mini-btn" @click=${() => this.startPicking()}>${t("climate.meter.change")}</button>`
              : suggested
                ? html`<button type="button" class="btn btn-secondary" @click=${() => this.save(device, { meter: this.meterOf(suggested) })}>
                      ${t("climate.meter.confirm")}
                    </button>
                    <button type="button" class="mini-btn" @click=${() => this.startPicking()}>${t("climate.meter.other_short")}</button>`
                : html`<button type="button" class="mini-btn" @click=${() => this.startPicking()}>${t("climate.meter.search")}</button>`}
          </div>`}
      ${chosen?.power || chosen?.energy
        ? html`<details class="ent">
            <summary>${t("climate.entities")}</summary>
            ${chosen.power ? html`<code>${chosen.power}</code>` : nothing}
            ${chosen.energy ? html`<code>${chosen.energy}</code>` : nothing}
          </details>`
        : nothing}
      ${sharing.length ? html`<p class="hint">${t("climate.meter.shared", { names: sharing.map((d) => d.name).join(", ") })}</p>` : nothing}
    </div>`;
  }

  private startPicking(): void {
    this.picking = true;
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
          if (ev.key === "Escape") this.picking = false;
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
          <button type="button" class="mini-btn quiet" @click=${() => (this.picking = false)}>${t("climate.meter.cancel")}</button>
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
    this.picking = false;
    if (value === "none") {
      this.save(device, { meter: "none" });
      return;
    }
    const option = (this.found?.meters ?? []).find((m) => this.key(m) === value);
    if (option) this.save(device, { meter: this.meterOf(option) });
  }

  /** The meter as it stands in the Energy dashboard: its kind ("Klimagerät") and when it runs. */
  private consumerRows(t: Translate, consumer: ConsumerConfig): TemplateResult {
    const live = consumer.power_entity ? this.readingOf(t, consumer.power_entity) : "";
    const runs = consumer.runs ?? "auto";
    return html`<div class="consumer">
      <div class="consumer-name">
        <span>${t("climate.consumer")}</span><b>${consumer.name}</b>${live ? html`<span>${live}</span>` : nothing}
      </div>
      <div class="row" data-tipped>
        <span>${t("consumers.kind")}</span>
        <select
          class="input"
          aria-label=${t("consumers.kind_of", { name: consumer.name })}
          .value=${consumer.kind}
          @change=${(ev: Event) => this.setKind(consumer, (ev.target as HTMLSelectElement).value as ConsumerKind)}
        >
          ${CONSUMER_KINDS.map((kind) => html`<option value=${kind} ?selected=${kind === consumer.kind}>${t(`kind.${kind}`)}</option>`)}
        </select>
        ${tip(t, "f_consumer_kind")}
      </div>
      ${consumer.kind === "submeter"
        ? nothing
        : html`<div class="row" data-tipped>
            <span>${t("consumers.runs")}</span>
            <select
              class="input"
              aria-label=${t("consumers.runs_of", { name: consumer.name })}
              .value=${runs}
              @change=${(ev: Event) => this.setRuns(consumer, (ev.target as HTMLSelectElement).value as ConsumerRuns)}
            >
              ${RUNS.map((way) => html`<option value=${way} ?selected=${way === runs}>${t(`runs.${way}`)}</option>`)}
            </select>
            ${tip(t, "f_consumer_runs")}
          </div>`}
    </div>`;
  }

  private setKind(consumer: ConsumerConfig, kind: ConsumerKind): void {
    if (kind === consumer.kind) return;
    this.kindChanged = consumer.id;
    void saveConfig(this, { consumers: { [consumer.id]: { kind } } });
  }

  private setRuns(consumer: ConsumerConfig, runs: ConsumerRuns): void {
    if (runs !== (consumer.runs ?? "auto")) {
      void saveConfig(this, { consumers: { [consumer.id]: { runs } } });
    }
  }

  /** After a kind change: "steht jetzt unter Weitere Geräte →". */
  private movedNote(t: Translate): TemplateResult | undefined {
    const id = this.kindChanged;
    const there = id ? this.devices.find((d) => d.group !== "climate" && (d.consumer?.id === id || d.id === id)) : undefined;
    if (!there) {
      return undefined;
    }
    const to = deviceRoute(there);
    return html`<div class="note" role="status">
      <ha-icon icon="mdi:information-outline"></ha-icon>
      <a class="mini-btn go" href=${href(this.prefix, to)} @click=${onLink(to)}
        >${t("climate.moved", { name: there.name, group: t(`nav.devices.${there.group}`) })}</a
      >
    </div>`;
  }

  // --- Nicht zugeordnet ---

  /** A climate meter Joe cannot place: put it to its device, or say it is something else. */
  private renderUnassigned(t: Translate, joe: JoeState, entry: DeviceEntry, consumer: ConsumerConfig): TemplateResult {
    const ctx = this.ctx;
    const devices = this.found?.devices ?? [];
    const rooms = joe.config.climate?.rooms ?? {};
    const live = consumer.power_entity ? this.readingOf(t, consumer.power_entity) : "";
    // Without an HA device (or without any climate device) there is nothing to assign it to: say so, no dead select.
    const assign =
      entry.deviceId && devices.length
        ? html`<div class="row" data-tipped>
            <span>${t("climate.assign")}</span>
            <select
              class="input"
              aria-label=${t("climate.assign")}
              @change=${(ev: Event) => {
                const entity = (ev.target as HTMLSelectElement).value;
                if (entity) void this.assign(entry, consumer, entity);
              }}
            >
              <option value="" selected disabled>${t("climate.assign.pick")}</option>
              ${devices.map(
                (d) => html`<option value=${d.entity_id}>
                  ${measured(rooms[d.entity_id]) ? t("climate.assign.has_meter", { name: d.name }) : d.name}${d.area ? ` · ${d.area}` : ""}
                </option>`,
              )}
            </select>
            ${tip(t, "climate_assign")}
          </div>`
        : html`<p class="hint">${t(entry.deviceId ? "climate.assign.no_climate" : "climate.assign.no_device")}</p>`;
    return deviceFrame(ctx, {
      ...frameFromEntry(ctx, entry),
      live: live || undefined,
      why: t("climate.unassigned.lead"),
      power: html`${assign} ${this.consumerRows(t, consumer)} ${this.movedNote(t) ?? nothing}`,
    });
  }

  /** The meter becomes the device's meter; then its page shows both. */
  private async assign(entry: DeviceEntry, consumer: ConsumerConfig, entity: string): Promise<void> {
    if (!entry.deviceId) return;
    const meter: ClimateMeter = { device_id: entry.deviceId, power: consumer.power_entity, energy: consumer.energy_entity };
    const ok = await saveConfig(this, { climate: { rooms: { [entity]: { meter } } } });
    if (ok) {
      navigate(this, { tab: "devices", section: "climate", id: entity }, { replace: true });
    }
  }

  // --- Wochenprofile (Sheet) ---

  /** The week profiles over the page; back or closing returns to it. */
  private renderWeekSheet(t: Translate, joe: JoeState, device: ClimateDevice): TemplateResult {
    const parent: Route = { tab: "devices", section: "climate", id: device.entity_id };
    const asked = this.route?.rest?.[0];
    const mode = WEEK_MODES.find((m) => m === asked);
    return html`<joe-sheet label=${t("week.label")} closeLabel=${t("common.close")} wide @joe-close=${() => closeSheet(this, parent)}>
      <joe-week-editor
        .hass=${this.hass}
        .t=${t}
        .config=${joe.config}
        .status=${joe.climate}
        .found=${this.found}
        .prefix=${this.prefix}
        .entityId=${device.entity_id}
        .startMode=${mode}
        @joe-week-mode=${(ev: CustomEvent<{ mode: WeekMode }>) => this.showMode(device, ev.detail.mode)}
      ></joe-week-editor>
    </joe-sheet>`;
  }

  /** The mode picked in the sheet goes into the address (the sheet stays one history entry). */
  private showMode(device: ClimateDevice, mode: WeekMode): void {
    const sheet = Boolean((history.state as { joeSheet?: boolean } | null)?.joeSheet);
    navigate(this, this.weekRoute(device, mode), { replace: true, sheet });
  }
}

define("joe-climate-device", JoeClimateDevice);
