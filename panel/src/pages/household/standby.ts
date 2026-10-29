import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { haOpen, haTarget } from "../../components/ha-open";
import { euroText } from "../../components/plan-text";
import { tip } from "../../components/tip";
import { define } from "../../define";
import { entityName, formatNumber } from "../../entities";
import type { Translate } from "../../i18n";
import { PANEL, href, onLink, type Route } from "../../router";
import { shared } from "../../styles/shared";
import {
  STANDBY_CHOICES,
  type HomeAssistant,
  type JoeState,
  type StandbyDevice,
  type StandbyDeviceStatus,
  type StandbyFound,
  type StandbyLogEntry,
  type StandbyWhen,
} from "../../types";
import { clockOf, pageHead } from "./head";
import { householdStyles } from "./styles";

/** Haushalt › Wer ist da: the helper "someone is home". */
const PRESENCE: Route = { tab: "household", section: "presence" };
/** Haushalt › Nachtruhe: when it is night. */
const NIGHT: Route = { tab: "household", section: "night" };
/** Einstellungen › Betrieb: simulation or live. */
const MODE: Route = { tab: "settings", section: "operation" };
/** How many log lines the page shows. */
const LOG_LINES = 8;

/**
 * Haushalt › Stromfresser: devices that draw power at night or while nobody
 * is home (a switch with a power reading, typically a smart plug). Joe
 * measures and suggests; he switches a device only once the owner chooses
 * when, and switches it on again in the morning or when somebody comes home.
 */
export class JoeHhStandby extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;
  @property({ attribute: false }) route?: Route;
  @property({ attribute: false }) prefix = PANEL;

  @state() private found?: StandbyFound;
  @state() private loading = false;
  @state() private error?: string;
  /** Choices just made, until the next measurement says them back. */
  @state() private chosen: Record<string, Partial<StandbyDevice>> = {};

  static styles = [
    shared,
    householdStyles,
    css`
      ul.hogs {
        list-style: none;
        margin: 10px 0 0;
        padding: 0;
        display: grid;
      }
      ul.hogs > li {
        border-top: 1px solid var(--joe-line);
        padding: 14px 0;
      }
      ul.hogs > li:first-child {
        border-top: 0;
        padding-top: 4px;
      }
      .hog-head {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px 10px;
      }
      .hog-head b {
        flex: 1 1 180px;
        min-width: 0;
        font-weight: 700;
        overflow-wrap: anywhere;
      }
      .figures {
        display: flex;
        flex-wrap: wrap;
        gap: 4px 14px;
        margin-top: 6px;
        color: var(--joe-ink-2);
        font-variant-numeric: tabular-nums;
      }
      .figures strong {
        color: var(--joe-ink);
      }
      .seg {
        flex-wrap: wrap;
      }
      .times {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px;
      }
      .times .input.short {
        width: 116px;
      }
      .now-line {
        margin: 8px 0 0;
        font-size: 14px;
        color: var(--joe-ink-2);
      }
      .now-line.off {
        color: var(--joe-good);
        font-weight: 600;
      }
      ul.log {
        list-style: none;
        margin: 10px 0 0;
        padding: 0;
        display: grid;
        gap: 6px;
      }
      ul.log time {
        color: var(--joe-muted);
        font-variant-numeric: tabular-nums;
        margin-right: 8px;
      }
      .go-link {
        display: inline-flex;
        align-items: center;
        min-height: 44px;
        font-weight: 600;
        color: var(--joe-ink);
        text-decoration: underline;
        text-decoration-color: var(--joe-line-2);
        text-underline-offset: 3px;
      }
      .go-link:hover {
        text-decoration-color: var(--joe-amber);
      }
    `,
  ];

  connectedCallback(): void {
    super.connectedCallback();
    if (!this.found) void this.load(false);
  }

  protected updated(): void {
    if (!this.found && !this.loading && !this.error && this.hass) void this.load(false);
  }

  private async load(refresh: boolean): Promise<void> {
    if (!this.hass || this.loading) return;
    this.loading = true;
    this.error = undefined;
    try {
      this.found = await this.hass.callWS<StandbyFound>({ type: "energy_joe/standby/devices", refresh });
      this.chosen = {};
    } catch (err) {
      this.error = err instanceof Error ? err.message : String((err as { message?: string })?.message ?? err);
    } finally {
      this.loading = false;
    }
  }

  protected render() {
    const { t, state: joe } = this;
    if (!t || !joe || !this.hass) {
      return nothing;
    }
    return html`<div class="wrap">
      ${pageHead(t, this.prefix, t("household.standby.title"), t("household.standby.lead"), null)}
      ${this.renderHow(t, joe)} ${this.renderList(t, joe)} ${this.renderLog(t, joe)}
    </div>`;
  }

  /** How Joe measures, what a kWh costs, and whether he switches at all. */
  private renderHow(t: Translate, joe: JoeState): TemplateResult {
    const found = this.found;
    const live = joe.mode === "live";
    const presence = !!joe.config.context.presence_entity;
    return html`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:meter-electric-outline"></ha-icon>${t("household.standby.how")}</div>
        ${tip(t, "standby_measure")}
      </div>
      <p class="say">${t("household.standby.how_say", { days: found?.days ?? 14, min: found?.min_w ?? 3 })}</p>
      ${found
        ? html`<p class="hint">
            ${t(found.price.assumed ? "household.standby.price_assumed" : "household.standby.price", {
              night: formatNumber(t.lang, found.price.night * 100, 1),
              day: formatNumber(t.lang, found.price.day * 100, 1),
            })}
            ${found.away_hours_per_day != null
              ? t("household.standby.away_hours", { hours: formatNumber(t.lang, found.away_hours_per_day, 1) })
              : nothing}
          </p>`
        : nothing}
      ${presence
        ? nothing
        : html`<div class="note warn">
            <ha-icon icon="mdi:home-alert-outline"></ha-icon>
            <div>
              ${t("household.standby.no_presence")}
              <div class="note-actions">
                <a class="go-link" href=${href(this.prefix, PRESENCE)} @click=${onLink(PRESENCE)}>${t("household.standby.to_presence")}</a>
              </div>
            </div>
          </div>`}
      ${live
        ? nothing
        : html`<div class="note">
            <ha-icon icon="mdi:test-tube"></ha-icon>
            <div>
              ${t("household.standby.not_live")}
              <div class="note-actions">
                <a class="go-link" href=${href(this.prefix, MODE)} @click=${onLink(MODE)}>${t("household.standby.to_mode")}</a>
              </div>
            </div>
          </div>`}
      <div class="row">
        <span class="hint"
          >${found?.measured_at
            ? t("household.standby.measured_at", { time: clockOf(t.lang, found.measured_at, this.hass?.config?.time_zone) ?? "" })
            : nothing}</span
        >
        <button type="button" class="btn btn-secondary" ?disabled=${this.loading} @click=${() => void this.load(true)}>
          ${t(this.loading ? "household.standby.measuring" : "household.standby.measure")}
        </button>
      </div>
    </section>`;
  }

  private renderList(t: Translate, joe: JoeState): TemplateResult {
    const found = this.found;
    let body: TemplateResult;
    if (this.error) {
      body = html`<p class="hint">${t("household.standby.failed", { error: this.error })}</p>`;
    } else if (!found) {
      body = html`<p class="hint">${t("household.standby.measuring")}</p>`;
    } else if (!found.devices.length) {
      body = html`<p class="hint">${t("household.standby.none", { min: found.min_w })}</p>`;
    } else {
      body = html`<ul class="hogs">
        ${found.devices.map((device) => this.renderDevice(t, joe, found, { ...device, ...this.chosen[device.entity_id] }))}
      </ul>`;
    }
    return html`<section class="card">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:power-plug-outline"></ha-icon>${t("household.standby.list")}</div>
      </div>
      ${body}
    </section>`;
  }

  private renderDevice(t: Translate, joe: JoeState, found: StandbyFound, device: StandbyDevice): TemplateResult {
    const hass = this.hass!;
    const status = joe.standby?.devices?.[device.entity_id];
    const byEntity = joe.config.climate?.night_by === "entity";
    const watts = (value: number | null) => (value == null ? "–" : `${formatNumber(t.lang, value, value < 10 ? 1 : 0)} W`);
    const money = device.when === "never" ? device.eur.both : device.eur[device.when];
    const time = (key: "night_from" | "night_until", value: string) => html`<input
      class="input short"
      type="time"
      aria-label=${t(`household.standby.${key}`)}
      .value=${value}
      @change=${(ev: Event) => {
        const text = (ev.target as HTMLInputElement).value;
        if (/^\d{1,2}:\d{2}$/.test(text)) void this.save(device, { [key]: text });
      }}
    />`;
    const night = device.when === "night" || device.when === "both";
    return html`<li data-tipped>
      <div class="hog-head">
        <b title=${device.entity_id}>${device.name}</b>
        ${device.area ? html`<span class="chip">${device.area}</span>` : nothing}
        ${device.warning
          ? html`<span class="chip warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${t("household.standby.warning", { word: device.warning })}</span>`
          : nothing}
        ${device.missing ? html`<span class="chip warn">${t("household.standby.missing")}</span>` : nothing}
        ${tip(t, device.warning ? "standby_warning" : "standby_when", { word: device.warning ?? "" })}
        ${haOpen(t, haTarget(hass, device.entity_id, device.name))}
      </div>
      <div class="figures">
        ${device.measured
          ? html`<span>${t("household.standby.night_w", { watts: watts(device.night_w) })}</span>
              ${found.presence ? html`<span>${t("household.standby.away_w", { watts: watts(device.away_w) })}</span>` : nothing}`
          : html`<span>${t("household.standby.unmeasured", { watts: watts(device.watts) })}</span>`}
        ${money != null
          ? html`<span
              ><strong
                >${t(device.when === "never" ? "household.standby.up_to" : "household.standby.saves", {
                  money: euroText(t, money),
                })}</strong
              ></span
            >`
          : nothing}
      </div>
      <div class="row">
        <span>${t("household.standby.when")}</span>
        <span class="seg" role="group" aria-label=${t("household.standby.when")}>
          ${STANDBY_CHOICES.map(
            (when) => html`<button
              type="button"
              aria-pressed=${String(device.when === when)}
              ?disabled=${!found.presence && (when === "away" || when === "both") && device.when !== when}
              @click=${() => void this.save(device, { when })}
            >
              ${t(`household.standby.when.${when}`)}
            </button>`,
          )}
        </span>
      </div>
      ${night
        ? html`<div class="row">
            <span>${t(byEntity ? "household.standby.night_entity" : "household.standby.night_span")}</span>
            <span class="times">
              ${byEntity
                ? time("night_until", device.night_until)
                : html`${time("night_from", device.night_from)} – ${time("night_until", device.night_until)}`}
            </span>
          </div>`
        : nothing}
      ${this.renderNow(t, joe, device, status)}
    </li>`;
  }

  /** What is going on with the device right now. */
  private renderNow(t: Translate, joe: JoeState, device: StandbyDevice, status?: StandbyDeviceStatus): TemplateResult | typeof nothing {
    if (!status || device.when === "never") {
      return nothing;
    }
    const why = status.causes.length ? t(`household.standby.why.${status.causes[0]}`) : "";
    if (status.off_by_joe) {
      return html`<p class="now-line off">${t("household.standby.now.off", { why })}</p>`;
    }
    if (status.declined) {
      return html`<p class="now-line">${t("household.standby.now.declined")}</p>`;
    }
    if (status.would === "off") {
      return html`<p class="now-line">${t("household.standby.now.would_off", { why })}</p>`;
    }
    if (status.causes.length && status.state !== "on") {
      return html`<p class="now-line">${t("household.standby.now.off_already")}</p>`;
    }
    if (!status.causes.length) {
      const when = device.when === "away" ? "away" : device.when === "both" ? "both" : "night";
      return html`<p class="now-line">${t(`household.standby.now.waiting.${when}`)}</p>`;
    }
    return joe.mode === "live" ? nothing : html`<p class="now-line">${t("household.standby.now.not_live")}</p>`;
  }

  private renderLog(t: Translate, joe: JoeState): TemplateResult | typeof nothing {
    const log = [...(joe.standby?.log ?? [])].reverse().slice(0, LOG_LINES);
    if (!log.length) {
      return nothing;
    }
    const names = Object.fromEntries((this.found?.devices ?? []).map((d) => [d.entity_id, d.name]));
    return html`<section class="card">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:history"></ha-icon>${t("household.standby.log")}</div>
      </div>
      <ul class="log">
        ${log.map((entry) => this.renderEntry(t, entry, names[entry.entity] ?? entityName(this.hass!, entry.entity)))}
      </ul>
      <a class="go-link" href=${href(this.prefix, NIGHT)} @click=${onLink(NIGHT)}>${t("household.standby.to_night")}</a>
    </section>`;
  }

  private renderEntry(t: Translate, entry: StandbyLogEntry, name: string): TemplateResult {
    const date = new Date(entry.at);
    const when = Number.isNaN(date.getTime())
      ? entry.at
      : date.toLocaleString(t.lang, {
          weekday: "short",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: this.hass?.config?.time_zone,
        });
    const why = entry.why ? t(`household.standby.why.${entry.why}`) : "";
    const saves = entry.watts ? t("household.standby.log.saves", { watts: entry.watts }) : "";
    return html`<li><time datetime=${entry.at}>${when}</time>${t(`household.standby.log.${entry.what}`, { name, why, saves })}</li>`;
  }

  /** Stores one device's choice or times (with its power reading, for the logbook). */
  private async save(device: StandbyDevice, change: { when?: StandbyWhen; night_from?: string; night_until?: string }): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    this.chosen = { ...this.chosen, [device.entity_id]: { ...this.chosen[device.entity_id], ...change } };
    try {
      await hass.callWS({
        type: "energy_joe/standby/set",
        entity_id: device.entity_id,
        power_entity: device.power_entity,
        ...change,
      });
      // Joe works the money out again with the new choice (his measurement stays).
      await this.load(false);
    } catch (err) {
      const { [device.entity_id]: _dropped, ...rest } = this.chosen;
      this.chosen = rest;
      this.error = err instanceof Error ? err.message : String((err as { message?: string })?.message ?? err);
    }
  }
}

define("joe-hh-standby", JoeHhStandby);
