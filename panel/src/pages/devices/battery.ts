import { css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import "../../components/battery-automations";
import { batteryTeam, selfRegulating, teamOrder, teamText, teamTransfer } from "../../components/battery-team";
import { sourceChip } from "../../components/bits";
import "../../components/control-status";
import { daySurplus, surplusConflictNote, surplusText } from "../../components/day-surplus";
import { deviceState } from "../../components/device-card";
import { mirrorRow } from "../../components/mirror";
import { tip } from "../../components/tip";
import { saveConfig, sourceOf } from "../../config";
import { define } from "../../define";
import { findDevice, ignoredBatteries, newFindings, type DeviceEntry } from "../../device-model";
import type { Translate } from "../../i18n";
import { formatNumber } from "../../entities";
import { href, navigate, onLink, revealAnchor, type Route } from "../../router";
import { ruleStyles, ruleValue, type RuleKey } from "../../rules-view";
import { shared } from "../../styles/shared";
import type { BatteryConfig, BatteryFinding, BatteryTeamMode, JoeConfig } from "../../types";
import "./battery-device";
import { batteryNow, controlRoute, hasSuggestion } from "./battery-device";
import { ignoreFinding, useBattery } from "./device-actions";
import { addLink, frameStyles, groupCards, groupHead, notFound } from "./device-frame";
import { DeviceSection } from "./section-base";

/** The rules for all batteries, shown here and set in Einstellungen › Regeln. */
/** The part of the page about several batteries (/devices/battery/together). */
const TEAM_ANCHOR = "together";

const BATTERY_RULES: readonly RuleKey[] = [
  "reserve_soc",
  "max_target_soc",
  "evening_min_soc",
  "balance_days",
  "discharge_in_window",
  "converter_losses",
  "day_surplus",
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
  /** The anchor last scrolled to, so a new state does not scroll again. */
  private revealed = "";

  static styles = [
    shared,
    frameStyles,
    ruleStyles,
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
      .evcc {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        margin-top: 14px;
      }
      .evcc .conflicts {
        flex: 1;
        min-width: 0;
        display: grid;
        gap: 8px;
      }
      .evcc .note {
        margin: 0;
      }
      .dcards {
        margin-top: 14px;
      }
      .team-question {
        margin: 12px 0 8px;
        font-weight: 600;
      }
      .team-choice {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
      }
      .team-choice .seg {
        flex-wrap: wrap;
        border-radius: 22px;
      }
      .team-now {
        margin: 12px 0 0;
        color: var(--joe-ink-2);
      }
      .team-notes {
        display: grid;
        gap: 8px;
        margin-top: 12px;
      }
      .team-orders {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
        gap: 14px;
        margin-top: 16px;
      }
      .team-orders .order {
        min-width: 0;
        margin-top: 6px;
      }
      .team-label {
        display: flex;
        align-items: center;
        gap: 6px;
        font-weight: 600;
      }
      .team-list {
        list-style: none;
        margin: 16px 0 0;
        padding: 0;
        display: grid;
      }
      .team-list li {
        display: grid;
        gap: 8px;
        padding: 12px 0;
        border-top: 1px solid var(--joe-line);
      }
      .team-line {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
      }
      .team-line {
        flex-wrap: nowrap;
        align-items: flex-start;
      }
      .team-line .what {
        flex: 1 1 0;
        min-width: 0;
        display: grid;
        gap: 2px;
      }
      .team-line .chip {
        margin-left: 4px;
        vertical-align: middle;
      }
      .team-ctl {
        flex: none;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .team-line small {
        color: var(--joe-muted);
        font-size: 13px;
      }
    `,
  ];

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    if (changed.has("device") && this.device !== TEAM_ANCHOR) {
      this.revealed = "";
    }
    if (this.device === TEAM_ANCHOR && this.revealed !== TEAM_ANCHOR && revealAnchor(this.renderRoot, TEAM_ANCHOR)) {
      this.revealed = TEAM_ANCHOR;
    }
  }

  protected render() {
    const t = this.t;
    const joe = this.state;
    if (!t || !joe) {
      return nothing;
    }
    const entry = this.device === TEAM_ANCHOR ? undefined : findDevice(this.devices, "battery", this.device);
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
      ${this.device !== undefined && this.device !== TEAM_ANCHOR ? notFound(t) : nothing}
      <joe-control-status .t=${t} .hass=${this.hass} .state=${joe}></joe-control-status>
      ${this.renderEvcc(t)}
      ${batteries.length
        ? groupCards(this.ctx, this.devices, "battery", (d) => this.cardChange(t, d))
        : html`<p class="empty">${t("devices.batteries.none")}</p>`}
      <div class="actions">${addLink(t, this.prefix, "battery", t("battery.page.add"))}</div>
      ${batteries.length >= 2 ? this.renderTeam(t, joe.config) : nothing}
      ${batteries.length ? this.renderRules(t) : nothing}
      ${batteries.length
        ? html`<div data-anchor="automations">
            <joe-battery-automations
              .hass=${this.hass}
              .t=${t}
              batteries=${JSON.stringify(batteries)}
              mode=${joe.mode}
              .ready=${joe.control?.ready ?? {}}
            ></joe-battery-automations>
          </div>`
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

  /**
   * "Mehrere Speicher": batteries that regulate themselves to 0 W at the grid
   * meter shift energy between each other when both work. Nacheinander lets
   * one work at a time and blocks the others ahead of time; the order for
   * charging and discharging, per battery whether it regulates itself and
   * where it really stops discharging (learned).
   */
  private renderTeam(t: Translate, config: JoeConfig): TemplateResult {
    const team = batteryTeam(this.state);
    const mode = config.rules.battery_team ?? null;
    const choose = (next: BatteryTeamMode) => {
      if (next !== mode) {
        void saveConfig(this, { rules: { battery_team: next } });
      }
    };
    const transfer = teamTransfer(t, team);
    const automations = team?.state === "automation";
    return html`<section class="card" data-tipped data-anchor=${TEAM_ANCHOR}>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:battery-sync-outline"></ha-icon>${t("team.title")}</div>
        ${tip(t, "team")}
      </div>
      <p class="team-question" id="team-question">${t("team.question")}</p>
      <div class="team-choice" data-tipped>
        <div class="seg" role="group" aria-labelledby="team-question">
          ${(["sequence", "together"] as const).map(
            (option) =>
              html`<button type="button" aria-pressed=${String(mode === option)} @click=${() => choose(option)}>
                ${t(`team.mode.${option}`)}
              </button>`,
          )}
        </div>
        ${tip(t, "team_mode")} ${mode ? sourceChip(t, sourceOf(config, "rules.battery_team")) : nothing}
      </div>
      ${team && !automations ? html`<p class="team-now">${teamText(t, team)}</p>` : nothing}
      <div class="team-notes">
        ${automations
          ? html`<div class="note warn" role="status">
              <ha-icon icon="mdi:robot-confused-outline"></ha-icon>
              <span>
                ${t("team.automations", { names: (team?.automations ?? []).map((n) => `„${n}“`).join(", ") })}
                <span class="note-actions">
                  <button type="button" class="mini-btn go" @click=${() => revealAnchor(this.renderRoot, "automations")}>
                    ${t("team.automations.go")}
                  </button>
                </span>
              </span>
            </div>`
          : nothing}
        ${transfer
          ? html`<div class="note ${team?.transfer?.despite ? "warn" : ""}" role="status">
              <ha-icon icon="mdi:swap-horizontal"></ha-icon><span>${transfer}</span>
            </div>`
          : nothing}
      </div>
      ${mode === "sequence"
        ? html`<div class="team-orders">
            ${this.orderList(t, config, "team_charge_order")} ${this.orderList(t, config, "team_discharge_order")}
          </div>`
        : nothing}
      <ul class="team-list">
        ${config.batteries.map((battery) => this.teamBattery(t, config, battery))}
      </ul>
    </section>`;
  }

  /** "Laden: zuerst …" / "Entladen: zuerst …": the batteries in their order, with up and down. */
  private orderList(t: Translate, config: JoeConfig, key: "team_charge_order" | "team_discharge_order"): TemplateResult {
    const order = teamOrder(config, key);
    const move = (index: number, step: number) => {
      const next = order.map((b) => b.id);
      [next[index], next[index + step]] = [next[index + step], next[index]];
      void saveConfig(this, { rules: { [key]: next } });
    };
    const arrow = (up: boolean) =>
      html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d=${up ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"} />
      </svg>`;
    const name = key === "team_charge_order" ? "team_charge_order" : "team_discharge_order";
    return html`<div data-tipped>
      <div class="team-label">${t(`team.${name}`)} ${tip(t, name)}</div>
      <div class="order">
        ${order.map(
          (battery, index) => html`<div>
            <span>${index + 1}. ${battery.name}</span>
            <button
              type="button"
              aria-label=${t("rule.priority.up", { name: battery.name })}
              ?disabled=${index === 0}
              @click=${() => move(index, -1)}
            >
              ${arrow(true)}
            </button>
            <button
              type="button"
              aria-label=${t("rule.priority.down", { name: battery.name })}
              ?disabled=${index === order.length - 1}
              @click=${() => move(index, 1)}
            >
              ${arrow(false)}
            </button>
          </div>`,
        )}
      </div>
    </div>`;
  }

  /** One battery: does it regulate itself, and where does it really stop discharging? */
  private teamBattery(t: Translate, config: JoeConfig, battery: BatteryConfig): TemplateResult {
    const team = batteryTeam(this.state);
    const mine = team?.batteries[battery.id];
    const on = selfRegulating(battery, team);
    const cutoff = battery.cutoff_soc ?? null;
    const percent = (value: number) => formatNumber(t.lang, value, 1);
    const id = `team-self-${battery.id}`;
    return html`<li>
      <div class="team-line" data-tipped>
        <span class="what">
          <b id=${id}>${battery.name}</b>
          <small>
            ${t("team.self_regulating")}
            ${battery.self_regulating == null && team
              ? html`<span class="chip">${t("team.proposed")}</span>`
              : sourceChip(t, sourceOf(config, `batteries[${battery.id}].self_regulating`))}
          </small>
        </span>
        <span class="team-ctl">
          ${tip(t, "team_self_regulating")}
          <button
            type="button"
            class="switch"
            role="switch"
            aria-checked=${String(on)}
            aria-labelledby=${id}
            @click=${() => saveConfig(this, { batteries: { [battery.id]: { self_regulating: !on } } })}
          ></button>
        </span>
      </div>
      ${on
        ? html`<div class="team-line" data-tipped>
            <span class="what">
              <small>
                ${cutoff != null
                  ? t("team.cutoff.known", { value: percent(cutoff) })
                  : t("team.cutoff.unknown", { value: percent(mine?.floor ?? 10) })}
                ${cutoff != null ? sourceChip(t, sourceOf(config, `batteries[${battery.id}].cutoff_soc`)) : nothing}
              </small>
            </span>
            <span class="team-ctl">${tip(t, "team_cutoff")}</span>
          </div>`
        : nothing}
    </li>`;
  }

  /** The rules for all batteries: read here, changed in Einstellungen › Regeln. */
  private renderRules(t: Translate): TemplateResult {
    const config = this.state!.config;
    const surplus = daySurplus(this.state);
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
            hint: key === "day_surplus" && surplus ? surplusText(t, surplus) : undefined,
            to,
          });
        })}
      </div>
    </section>`;
  }

  /** evcc's battery settings that work against the daytime surplus (only while the rule is on). */
  private renderEvcc(t: Translate): TemplateResult | typeof nothing {
    const note = surplusConflictNote(t, daySurplus(this.state));
    return note === nothing ? nothing : html`<div class="evcc" data-tipped>${note} ${tip(t, "surplus_evcc")}</div>`;
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
