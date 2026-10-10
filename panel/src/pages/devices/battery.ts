import { css, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import "../../components/battery-automations";
import "../../components/control-status";
import { deviceState } from "../../components/device-card";
import { mirrorRow } from "../../components/mirror";
import { tip } from "../../components/tip";
import { sourceOf } from "../../config";
import { define } from "../../define";
import { findDevice, ignoredBatteries, newFindings, type DeviceEntry } from "../../device-model";
import type { Translate } from "../../i18n";
import { href, navigate, onLink, type Route } from "../../router";
import { ruleValue, type RuleKey } from "../../rules-view";
import { shared } from "../../styles/shared";
import type { BatteryFinding } from "../../types";
import "./battery-device";
import { batteryNow, controlRoute, hasSuggestion } from "./battery-device";
import { ignoreFinding, useBattery } from "./device-actions";
import { addLink, frameStyles, groupCards, groupHead, notFound } from "./device-frame";
import { DeviceSection } from "./section-base";

/** The rules for all batteries, shown here and set in Einstellungen › Regeln. */
const BATTERY_RULES: readonly RuleKey[] = [
  "reserve_soc",
  "max_target_soc",
  "evening_min_soc",
  "balance_days",
  "discharge_in_window",
  "converter_losses",
];

/**
 * Geräte › Speicher (/devices/battery): what Joe does now, a card per
 * battery, the rules for all of them, the automations writing to them and
 * the batteries Joe found but does not use. With an id the battery's own
 * page (battery-device.ts).
 */
export class JoeBatteryGroup extends DeviceSection {
  /** Joe's id of the battery in the address (/devices/battery/<device>). */
  @property({ attribute: false }) device?: string;
  /** "control": "Regler einrichten" over the battery's page. */
  @property({ attribute: false }) sub?: string;

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
      .display {
        font-size: clamp(30px, 4vw, 44px);
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
      .card-lead {
        margin: 8px 0 0;
        color: var(--joe-ink-2);
      }
      .mirrors {
        display: grid;
        margin-top: 8px;
      }
      .empty {
        margin: 10px 0 0;
        color: var(--joe-ink-2);
      }
      .actions {
        margin-top: 16px;
      }
      .found {
        list-style: none;
        margin: 10px 0 0;
        padding: 0;
        display: grid;
      }
      .found li {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px 12px;
        padding: 10px 0;
        border-top: 1px solid var(--joe-line);
      }
      .found li:first-child {
        border-top: 0;
      }
      .found .what {
        flex: 1 1 180px;
        min-width: 0;
        display: grid;
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
      a.mini-btn {
        text-decoration: none;
      }
      .dcard-suggest {
        flex: 1 1 160px;
        color: var(--joe-ink-2);
        font-size: 13.5px;
      }
      joe-control-status {
        display: block;
      }
      .dcards {
        margin-top: 14px;
      }
    `,
  ];

  protected render() {
    const t = this.t;
    const joe = this.state;
    if (!t || !joe) {
      return nothing;
    }
    const entry = findDevice(this.devices, "battery", this.device);
    if (entry) {
      return html`<joe-battery-device
        .t=${t}
        .hass=${this.hass}
        .state=${joe}
        .prefix=${this.prefix}
        .route=${this.route}
        .discovery=${this.discovery}
        .info=${this.info}
        .checks=${this.checks}
        .climateFound=${this.climateFound}
        .devices=${this.devices}
        .entry=${entry}
        .sub=${this.sub}
      ></joe-battery-device>`;
    }
    const batteries = joe.config.batteries;
    return html`<div class="wrap">
      ${groupHead(t, t("nav.devices.battery"), t("battery.page.lead"), batteries.length > 0)}
      ${this.device !== undefined ? notFound(t) : nothing}
      <joe-control-status .t=${t} .hass=${this.hass} .state=${joe}></joe-control-status>
      ${batteries.length
        ? groupCards(this.ctx, this.devices, "battery", (d) => this.cardChange(t, d))
        : html`<p class="empty">${t("devices.batteries.none")}</p>`}
      <div class="actions">${addLink(t, this.prefix, "battery", t("battery.page.add"))}</div>
      ${batteries.length ? this.renderRules(t) : nothing}
      ${batteries.length
        ? html`<joe-battery-automations
            .hass=${this.hass}
            .t=${t}
            batteries=${JSON.stringify(batteries)}
            mode=${joe.mode}
            .ready=${joe.control?.ready ?? {}}
          ></joe-battery-automations>`
        : nothing}
      ${this.renderFound(t)}
    </div>`;
  }

  /** A battery's card: level and power with what Joe does; found levers lead to "Regler einrichten". */
  private cardChange(t: Translate, entry: DeviceEntry) {
    const battery = entry.battery;
    if (!battery) {
      return {};
    }
    const found = this.discovery?.batteries.find((b) => b.id === battery.id);
    const live = deviceState(t, this.hass, this.state, entry);
    const now = batteryNow(t, battery, this.state?.control);
    const to = controlRoute(battery.id);
    return {
      state: [live, now].filter(Boolean).join(" · "),
      quick: hasSuggestion(battery, found)
        ? html`<span class="dcard-suggest">${t("battery.page.suggested")}</span>
            <a class="mini-btn go" href=${href(this.prefix, to)} @click=${onLink(to, { sheet: true })}>${t("devices.setup")}</a>`
        : undefined,
    };
  }

  /** The rules for all batteries: read here, changed in Einstellungen › Regeln. */
  private renderRules(t: Translate): TemplateResult {
    const config = this.state!.config;
    return html`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:tune-vertical"></ha-icon>${t("battery.page.rules")}</div>
        ${tip(t, "battery_rules")}
      </div>
      <div class="mirrors">
        ${BATTERY_RULES.map((key) => {
          const to: Route = { tab: "settings", section: "rules", id: key };
          return mirrorRow(t, this.prefix, {
            label: t(`rule.${key}`),
            value: ruleValue(t, config, key),
            source: sourceOf(config, `rules.${key}`),
            to,
          });
        })}
      </div>
    </section>`;
  }

  /** Batteries Joe found but does not use: new ones and ones left out ("Wieder nutzen"). */
  private renderFound(t: Translate): TemplateResult | typeof nothing {
    const config = this.state!.config;
    const found = newFindings(config, this.discovery).filter((f) => f.kind === "battery" && f.battery);
    const ignored = ignoredBatteries(config, this.discovery);
    if (!found.length && !ignored.length) {
      return nothing;
    }
    const row = (battery: BatteryFinding, left: boolean, key: string) =>
      html`<li>
        <span class="what">
          <b>${battery.name}</b>
          <small>${left ? t("devices.add.battery.ignored") : t("battery.page.found.new")}</small>
        </span>
        <span class="row-actions">
          <button type="button" class="mini-btn go" ?disabled=${Boolean(this.busy)} @click=${() => this.use(battery, key)}>
            ${t(left ? "devices.add.battery.use" : "devices.found.use")}
          </button>
          ${left
            ? nothing
            : html`<button type="button" class="mini-btn quiet" ?disabled=${Boolean(this.busy)} @click=${() => this.ignore(key)}>
                ${t("devices.found.ignore")}
              </button>`}
        </span>
      </li>`;
    return html`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:home-battery-outline"></ha-icon>${t("battery.page.found")}</div>
        ${tip(t, "battery_found")}
      </div>
      <ul class="found">
        ${found.map((f) => row(f.battery!, false, f.key))} ${ignored.map((b) => row(b, true, `battery:${b.id}`))}
      </ul>
    </section>`;
  }

  /** Takes a battery over (also one left out before) and opens its page. */
  private async use(battery: BatteryFinding, key: string): Promise<void> {
    this.busy = key;
    const id = await useBattery(this, this.state!.config, battery);
    this.busy = "";
    if (id) {
      navigate(this, { tab: "devices", section: "battery", id });
    }
  }

  private async ignore(key: string): Promise<void> {
    this.busy = key;
    await ignoreFinding(this, this.state!.config, key);
    this.busy = "";
  }
}

define("joe-battery-group", JoeBatteryGroup);
