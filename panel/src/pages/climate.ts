import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { deviceLink, displayTitle, swoosh } from "../components/bits";
import "../components/pose";
import { tip } from "../components/tip";
import { pickEntity, saveConfig } from "../config";
import { define } from "../define";
import { formatNumber } from "../entities";
import type { Translate } from "../i18n";
import { shared } from "../styles/shared";
import type { ClimateMeter, ClimateRoomConfig, HomeAssistant, JoeState } from "../types";

interface ClimateDevice {
  entity_id: string;
  name: string;
  device_id: string | null;
  device_name: string | null;
  area: string | null;
  state: string;
  hvac_modes: string[];
  preset_modes: string[];
  temperature: number | null;
  current_temperature: number | null;
  platform: string | null;
}

/** A device with a power or energy sensor, e.g. a channel of a Shelly Pro 3EM. */
interface MeterOption extends ClimateMeter {
  name: string | null;
  /** The sensor's name when the device has several. */
  sensor: string | null;
  /** The device it is connected via. */
  via: string | null;
  area: string | null;
}

interface Devices {
  devices: ClimateDevice[];
  meters?: MeterOption[];
  suggested?: Record<string, MeterOption>;
  arrivals: Record<string, { km?: number; direction?: string; minutes?: number; source?: string }>;
  proximity: boolean;
}

const DEFAULT_ROOM: ClimateRoomConfig = {
  enabled: false,
  away: "setback",
  setback_k: 3,
  away_preset: null,
  free_day_preset: null,
  night_off: false,
  night_from: "23:00",
  night_until: "06:30",
};

const PROXIMITY_URL = "https://my.home-assistant.io/redirect/config_flow_start/?domain=proximity";

/** Heating and air conditioning by presence: every thermostat on its own. */
export class JoeClimatePage extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;

  @state() private found?: Devices;
  @state() private failed = false;
  /** The meters section is folded by default. */
  @state() private metersOpen = false;
  /** The air conditioner whose meter is being searched, and the search text. */
  @state() private picking?: string;
  @state() private query = "";

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
      .head .eyebrow,
      .head b {
        flex: 1;
        min-width: 0;
      }
      .head b {
        font-weight: 700;
        overflow-wrap: anywhere;
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
      .now {
        margin: 10px 0 0;
        font-weight: 600;
      }
      .row.chips > span:first-child {
        flex: 0 1 auto;
      }
      a.ha-link {
        color: inherit;
        text-decoration: underline;
        text-decoration-color: var(--joe-line-2);
        text-underline-offset: 3px;
      }
      a.ha-link:hover {
        text-decoration-color: var(--joe-amber);
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
      details.ent code {
        display: block;
        margin-top: 2px;
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 12px;
        color: var(--joe-ink-2);
        overflow-wrap: anywhere;
      }
      .fold {
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
    void this.load();
  }

  private async load(): Promise<void> {
    try {
      this.found = await this.hass?.callWS<Devices>({ type: "energy_joe/climate/devices" });
      this.failed = false;
    } catch {
      this.failed = true;
    }
  }

  protected render() {
    const { t, state: joe } = this;
    if (!t || !joe) {
      return nothing;
    }
    const climate = joe.config.climate ?? { enabled: false, rooms: {} };
    const devices = this.found?.devices ?? [];
    const areas = [...new Set(devices.map((d) => d.area ?? t("climate.no_area")))];
    return html`<div class="wrap">
      <div class="intro">
        <div>
          ${displayTitle(t("climate.title"))} ${swoosh}
          <p class="lead">${t("climate.lead")}</p>
        </div>
        <joe-pose name="relax"></joe-pose>
      </div>
      ${this.renderMain(t, joe, climate.enabled)} ${this.renderPresence(t, joe)} ${this.renderNightSource(t, joe)}
      ${devices.length ? this.renderMeters(t, joe, devices) : nothing}
      ${this.failed ? html`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${t("climate.failed")}</span></div>` : nothing}
      ${this.found && !devices.length ? html`<p class="hint">${t("climate.none")}</p>` : nothing}
      ${areas.map(
        (area) => html`<div class="group-label">${area}</div>
          <div class="grid">
            ${devices.filter((d) => (d.area ?? t("climate.no_area")) === area).map((d) => this.renderDevice(t, joe, d))}
          </div>`,
      )}
    </div>`;
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

  private renderPresence(t: Translate, joe: JoeState): TemplateResult {
    const status = joe.climate;
    const home = status?.home ?? [];
    const arrivals = Object.entries(status?.arrivals ?? this.found?.arrivals ?? {});
    const names = Object.fromEntries(joe.config.persons.map((p) => [p.person_entity, p.name]));
    const presence = joe.config.context.presence_entity ?? null;
    const presenceOn = !!presence && ["home", "on"].includes(this.hass?.states[presence]?.state ?? "");
    return html`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:home-account"></ha-icon>${t("climate.presence")}</div>
        ${tip(t, "climate_presence")}
      </div>
      <p class="now">${home.length ? t("climate.home", { names: home.join(", ") }) : t("climate.nobody")}</p>
      ${arrivals.map(
        ([person, info]) => html`<p class="hint">
          ${t(`climate.way.${info.direction === "towards" ? "towards" : info.direction === "away_from" ? "away" : "other"}`, {
            name: names[person] ?? this.hass?.states[person]?.attributes.friendly_name ?? person,
            km: info.km != null ? formatNumber(t.lang, info.km, 1) : "–",
          })}
          ${info.direction === "towards" && info.minutes != null
            ? t(info.source ? "climate.way.minutes_route" : "climate.way.minutes_guess", { minutes: info.minutes })
            : nothing}
        </p>`,
      )}
      ${Object.entries(status?.usual ?? {}).map(
        ([person, minute]) => html`<p class="hint">
          ${t("climate.usual", {
            name: names[person] ?? this.hass?.states[person]?.attributes.friendly_name ?? person,
            time: `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`,
          })}
        </p>`,
      )}
      <div class="row" data-tipped>
        <span id="route-eta">${t("climate.route_eta")}</span>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(joe.config.climate?.route_eta ?? true)}
          aria-labelledby="route-eta"
          @click=${() => saveConfig(this, { climate: { route_eta: !(joe.config.climate?.route_eta ?? true) } })}
        ></button>
        ${tip(t, "climate_route_eta")}
      </div>
      ${this.found && !this.found.proximity
        ? html`<p class="hint">
            ${t("climate.no_proximity")}
            <a href=${PROXIMITY_URL} target="_blank" rel="noreferrer noopener">${t("climate.add_proximity")}</a>
          </p>`
        : nothing}
      ${status?.free_day ? html`<p class="hint">${t("climate.free_day")}</p>` : nothing}
      <div class="row" data-tipped>
        ${presence
          ? html`<span>${t("climate.presence_from")}</span>
              <span class="chip ${presenceOn ? "ok" : ""}" title=${presence}>
                ${this.hass?.states[presence]?.attributes.friendly_name ?? presence}
              </span>`
          : html`<span>${t("climate.presence_missing")}</span>`}
        <button type="button" class="btn btn-secondary" @click=${() => this.editHousehold()}>
          ${t(presence ? "climate.presence_change" : "climate.presence_create")}
        </button>
        ${tip(t, "climate_presence_entity")}
      </div>
    </section>`;
  }

  private editHousehold(): void {
    this.dispatchEvent(new CustomEvent("joe-edit", { detail: { editor: "household" }, bubbles: true, composed: true }));
  }

  /** When night is: fixed times per room, or an entity that says people are in bed. */
  private renderNightSource(t: Translate, joe: JoeState): TemplateResult {
    const climate = joe.config.climate;
    const by = climate?.night_by ?? "time";
    const entity = climate?.night_entity ?? null;
    const live = entity ? this.hass?.states[entity] : undefined;
    return html`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:weather-night"></ha-icon>${t("climate.night")}</div>
        ${tip(t, "climate_night_source")}
      </div>
      <p class="hint">${t("climate.night.say")}</p>
      <div class="row">
        <span>${t("climate.night.by")}</span>
        <span class="seg" role="group" aria-label=${t("climate.night.by")}>
          ${(["time", "entity"] as const).map(
            (way) => html`<button type="button" aria-pressed=${String(by === way)} @click=${() => this.setNightBy(way)}>
              ${t(`climate.night.by.${way}`)}
            </button>`,
          )}
        </span>
      </div>
      ${by === "entity"
        ? html`<div class="row">
              <span>${entity ? html`<b title=${entity}>${live?.attributes.friendly_name ?? entity}</b>` : t("climate.night.no_entity")}</span>
              ${live ? html`<span class="chip ${live.state === "on" ? "ok" : ""}">${t(live.state === "on" ? "climate.night.now_on" : "climate.night.now_off")}</span>` : nothing}
              <button type="button" class="btn btn-secondary" @click=${() => void this.pickNight()}>
                ${t(entity ? "climate.night.change" : "climate.night.pick")}
              </button>
            </div>
            ${entity ? html`<details class="ent"><summary>${t("climate.entity")}</summary><code>${entity}</code></details>` : nothing}
            <p class="hint">${t("climate.night.entity_say")}</p>`
        : html`<p class="hint">${t("climate.night.time_say")}</p>`}
    </section>`;
  }

  private setNightBy(way: "time" | "entity"): void {
    void saveConfig(this, { climate: { night_by: way } });
    if (way === "entity" && !this.state?.config.climate?.night_entity) {
      void this.pickNight();
    }
  }

  private async pickNight(): Promise<void> {
    const t = this.t;
    if (!t) return;
    const entity = this.state?.config.climate?.night_entity;
    const picked = await pickEntity(this, {
      heading: t("pick.night.title"),
      tip: "pick_night",
      filter: "night",
      selected: entity ? [entity] : [],
    });
    if (picked) {
      void saveConfig(this, { climate: { night_by: "entity", night_entity: picked.selected[0] ?? null } });
    }
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
    return html`<section class="card" data-tipped>
      <div class="head">
        <b>${deviceLink(device.device_id, device.name, t("climate.open_device", { id: device.entity_id }))}</b>
        ${current != null
          ? html`<span class="chip">${formatNumber(t.lang, Number(current), 1)} °C${target != null ? ` → ${formatNumber(t.lang, Number(target), 1)} °C` : ""}</span>`
          : nothing}
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
      <details class="ent"><summary>${t("climate.entity")}</summary><code>${device.entity_id}</code></details>
      ${room.enabled
        ? html`<div class="row" data-tipped>
              <span>${t("climate.away")}</span>
              <span class="seg" role="group" aria-label=${t("climate.away")}>
                ${(["setback", "off", ...(presets.length ? ["preset"] : [])] as ClimateRoomConfig["away"][]).map(
                  (way) => html`<button type="button" aria-pressed=${String(room.away === way)} @click=${() => this.save(device, { away: way })}>
                    ${t(`climate.away.${way}`)}
                  </button>`,
                )}
              </span>
              ${tip(t, "climate_away")}
            </div>
            ${room.away === "setback"
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
            ${room.away === "preset" ? this.presetRow(t, device, presets, "away_preset", room.away_preset, "climate.away_preset") : nothing}
            ${presets.length
              ? html`<div data-tipped>
                  ${this.presetRow(t, device, presets, "free_day_preset", room.free_day_preset, "climate.free_day_preset", true)}
                </div>`
              : nothing}
            ${cooling ? this.renderNight(t, device, room) : nothing}
            <p class="hint">
              ${now ? (t.optional(`climate.now.${now.why}`) ?? "") : nothing}
              ${rate ? t("climate.rate", { rate: formatNumber(t.lang, rate, 1) }) : t("climate.rate_default")}
            </p>`
        : html`<p class="hint">${t("climate.room.off")}</p>`}
    </section>`;
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
        <b>${deviceLink(device.device_id, device.name, t("climate.open_device", { id: device.entity_id }))}</b
        ><small>${device.area ?? t("climate.no_area")}</small>
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
          : html`<span class="picked">
              ${shown
                ? html`<b>${deviceLink(shown.device_id, `${shown.name ?? shown.device_id}${shown.sensor ? ` · ${shown.sensor}` : ""}`, t("climate.open_meter"))}</b>
                    ${shown.via ? html`<small class="via">${shown.via}</small>` : nothing}`
                : chosen
                  ? html`<b>${deviceLink(chosen.device_id, chosen.power ?? chosen.energy ?? chosen.device_id, t("climate.open_meter"))}</b>`
                  : html`<small>${t(meter === "none" ? "climate.meter.without_long" : "climate.meter.open_long")}</small>`}
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
          (m) => html`<button type="button" role="option" class="hit" @click=${() => this.pickMeter(device, this.key(m))}>
            <b>${m.name ?? m.device_id}${m.sensor ? ` · ${m.sensor}` : ""}</b>
            <small>${[m.via, m.area, m.power ? this.readingOf(t, m.power) : ""].filter(Boolean).join(" · ")}</small>
          </button>`,
        )}
        ${!hits.length ? html`<small class="none">${t("climate.meter.no_hits")}</small>` : nothing}
        <div class="hit-actions">
          <button type="button" class="mini-btn" @click=${() => this.pickMeter(device, "none")}>${t("climate.meter.none_option")}</button>
          <button type="button" class="mini-btn quiet" @click=${() => (this.picking = undefined)}>${t("climate.meter.cancel")}</button>
        </div>
      </div>`;
  }

  private readingOf(t: Translate, entity: string): string {
    const state = this.hass?.states[entity];
    return state ? this.reading(t, state) : "";
  }

  private key(meter: ClimateMeter): string {
    return [meter.device_id, meter.power ?? "", meter.energy ?? ""].join("|");
  }

  private option(meter: ClimateMeter): MeterOption | undefined {
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

  private save(device: ClimateDevice, change: Partial<ClimateRoomConfig>): void {
    const room = { ...DEFAULT_ROOM, ...(this.state?.config.climate?.rooms?.[device.entity_id] ?? {}), ...change };
    void saveConfig(this, { climate: { rooms: { [device.entity_id]: room } } });
  }
}

define("joe-climate-page", JoeClimatePage);
