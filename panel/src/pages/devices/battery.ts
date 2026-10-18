import { css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import "../../components/battery-automations";
import {
  batteryTeam,
  givenBack,
  groupOf,
  groupsPatch,
  guardText,
  selfRegulating,
  teamGroups,
  teamOrder,
  teamHold,
  teamText,
  transferGuard,
  unsureNames,
} from "../../components/battery-team";
import { sourceChip } from "../../components/bits";
import "../../components/control-status";
import { daySurplus, surplusConflictNote, surplusText } from "../../components/day-surplus";
import { deviceState } from "../../components/device-card";
import { mirrorRow } from "../../components/mirror";
import { batteryNotes } from "../../components/battery-notes";
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
  "transfer_guard",
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
      select.team-group {
        width: auto;
        max-width: min(240px, 48vw);
        font-size: 14px;
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
    // Not chosen: "Nacheinander" all the same (Joe takes it on).
    const shown: BatteryTeamMode = mode ?? "sequence";
    const choose = (next: BatteryTeamMode) => {
      if (next !== mode) {
        void saveConfig(this, { rules: { battery_team: next } });
      }
    };
    const automations = team?.state === "automation";
    const back = givenBack(t, team);
    const hold = teamHold(t, team);
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
              html`<button type="button" aria-pressed=${String(shown === option)} @click=${() => choose(option)}>
                ${t(`team.mode.${option}`)}
              </button>`,
          )}
        </div>
        ${tip(t, "team_mode")}
        ${mode ? sourceChip(t, sourceOf(config, "rules.battery_team")) : html`<span class="chip">${t("team.mode.default")}</span>`}
      </div>
      ${team && !automations ? html`<p class="team-now">${teamText(t, team)}</p>` : nothing}
      <div class="team-notes">
        ${!mode && team && Object.keys(team.groups ?? {}).length >= 2
          ? html`<div class="note" role="status" data-tipped>
              <ha-icon icon="mdi:shield-check-outline"></ha-icon>
              <span>${t("team.default")} ${tip(t, "team_default")}</span>
            </div>`
          : nothing}
        ${hold
          ? html`<div class="note" role="status" data-tipped>
              <ha-icon icon="mdi:lock-clock"></ha-icon>
              <span>${hold} ${tip(t, "team_hold")}</span>
            </div>`
          : nothing}
        ${back
          ? html`<div class="note ${back.problem ? "warn" : ""}" role="status" data-tipped>
              <ha-icon icon="mdi:robot-outline"></ha-icon>
              <span>
                ${back.text} ${tip(t, "team_given_back")}
                <span class="note-actions">
                  <button type="button" class="mini-btn" @click=${() => revealAnchor(this.renderRoot, "automations")}>
                    ${t("team.automations.go")}
                  </button>
                </span>
              </span>
            </div>`
          : nothing}
        ${team?.group_question ? this.renderGroupQuestion(t, config) : nothing}
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
        ${this.renderGuard(t, config)}
      </div>
      ${shown === "sequence"
        ? html`<div class="team-orders">
            ${this.orderList(t, config, "team_charge_order")} ${this.orderList(t, config, "team_discharge_order")}
          </div>`
        : nothing}
      <ul class="team-list">
        ${config.batteries.map((battery) => this.teamBattery(t, config, battery))}
      </ul>
    </section>`;
  }

  /**
   * "Speicher-Wächter": the last time two batteries ran against each other
   * and what Joe did (control/guard.py); an automation doing it so far
   * points to the automations below.
   */
  private renderGuard(t: Translate, config: JoeConfig): TemplateResult | typeof nothing {
    const guard = transferGuard(this.state);
    if (!guard) {
      return nothing;
    }
    const alarm = guard.state === "on" && guard.last?.result === "alarm" && !guard.last.dry;
    const handed = guard.state === "on" && guard.automations.length > 0;
    return html`<div class="note guard ${alarm || handed ? "warn" : ""}" role="status" data-tipped data-anchor="guard">
      <ha-icon icon="mdi:shield-sync-outline"></ha-icon>
      <span>
        <b>${t("guard.title")}</b> ${tip(t, "guard")} · ${guardText(t, guard, config)}
        ${handed
          ? html`<span class="note-actions">
              <button type="button" class="mini-btn go" @click=${() => revealAnchor(this.renderRoot, "automations")}>
                ${t("team.automations.go")}
              </button>
            </span>`
          : nothing}
      </span>
    </div>`;
  }

  /**
   * "Welche Speicher werden vom selben System geregelt?": Joe is not sure
   * for some batteries (levers assigned by hand); "Vorschlag passt" keeps
   * his proposal, each battery's "Wer regelt ihn?" below changes it.
   */
  private renderGroupQuestion(t: Translate, config: JoeConfig): TemplateResult {
    const team = batteryTeam(this.state)!;
    return html`<div class="note" role="status" data-tipped>
      <ha-icon icon="mdi:help-circle-outline"></ha-icon>
      <span>
        <b>${t("team.groups.question")}</b> ${tip(t, "team_group")}
        ${t("team.groups.question.text", { names: unsureNames(config, team) })}
        <span class="note-actions">
          <button type="button" class="mini-btn go" @click=${() => saveConfig(this, groupsPatch(config, team))}>
            ${t("team.groups.confirm")}
          </button>
          ${tip(t, "team_groups_confirm")}
        </span>
      </span>
    </div>`;
  }

  /** "Laden: zuerst …" / "Entladen: zuerst …": the groups (one system each) in their order, with up and down. */
  private orderList(t: Translate, config: JoeConfig, key: "team_charge_order" | "team_discharge_order"): TemplateResult {
    const order = teamGroups(config, batteryTeam(this.state), teamOrder(config, key));
    const move = (index: number, step: number) => {
      const next = [...order];
      [next[index], next[index + step]] = [next[index + step], next[index]];
      void saveConfig(this, { rules: { [key]: next.flat().map((b) => b.id) } });
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
          (group, index) => html`<div>
            <span>${index + 1}. ${group.map((b) => b.name).join(" + ")}</span>
            <button
              type="button"
              aria-label=${t("rule.priority.up", { name: group.map((b) => b.name).join(" + ") })}
              ?disabled=${index === 0}
              @click=${() => move(index, -1)}
            >
              ${arrow(true)}
            </button>
            <button
              type="button"
              aria-label=${t("rule.priority.down", { name: group.map((b) => b.name).join(" + ") })}
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
      ${on ? this.groupLine(t, config, battery) : nothing}
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

  /**
   * "Wer regelt ihn?": its own system, or the same system as another
   * battery (Omnibattery for a Venus and a Victron). Batteries of one
   * system take turns as one; Joe proposes from the integration.
   */
  private groupLine(t: Translate, config: JoeConfig, battery: BatteryConfig): TemplateResult {
    const team = batteryTeam(this.state);
    const mine = groupOf(battery, team);
    const others = config.batteries.filter((b) => b.id !== battery.id && selfRegulating(b, team));
    const own = `own:${battery.id}`;
    const together = others.find((b) => groupOf(b, team) === mine);
    const value = together ? groupOf(together, team) : own;
    const id = `team-group-${battery.id}`;
    const unsure = battery.control_group == null && team?.batteries[battery.id]?.group_sure === false;
    const choose = (next: string) => {
      if (next !== value) {
        void saveConfig(this, { batteries: { [battery.id]: { control_group: next } } });
      }
    };
    return html`<div class="team-line" data-tipped>
      <span class="what">
        <small id=${id}>
          ${t("team.group")}
          ${battery.control_group == null && team
            ? html`<span class="chip ${unsure ? "warn" : ""}">${t(unsure ? "team.group.check" : "team.proposed")}</span>`
            : sourceChip(t, sourceOf(config, `batteries[${battery.id}].control_group`))}
        </small>
      </span>
      <span class="team-ctl">
        ${tip(t, "team_group")}
        <select
          class="input team-group"
          aria-labelledby=${id}
          .value=${value}
          @change=${(event: Event) => choose((event.target as HTMLSelectElement).value)}
        >
          <option value=${own} ?selected=${value === own}>${t("team.group.own")}</option>
          ${others.map((other) => {
            const key = groupOf(other, team);
            return html`<option value=${key} ?selected=${value === key && together?.id === other.id}>
              ${t("team.group.with", { name: other.name })}
            </option>`;
          })}
        </select>
      </span>
    </div>`;
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
    // Battery integrations without a battery Joe found (its level switched off).
    const notes = this.discovery?.battery_notes ?? [];
    if (!found.length && !ignored.length && !notes.length) {
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
      ${found.length || ignored.length
        ? html`<ul class="found">
            ${found.map((f) => row(f.battery!, false, f.key))} ${ignored.map((b) => row(b, true, `battery:${b.id}`))}
          </ul>`
        : nothing}
      ${batteryNotes(t, notes)}
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
