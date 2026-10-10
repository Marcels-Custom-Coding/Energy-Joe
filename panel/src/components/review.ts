import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { isIgnored, saveConfig, sourceOf, withIgnored } from "../config";
import { define } from "../define";
import "../editors/tariff-form";
import { energyKwh, formatNumber, numberState } from "../entities";
import type { Translate } from "../i18n";
import { pickBattery, useBattery } from "../pages/devices/device-actions";
import { shared } from "../styles/shared";
import type { Check, Discovery, HomeAssistant, JoeConfig } from "../types";
import { confidenceDots, displayTitle, sourceChip } from "./bits";
import {
  checkNote,
  contextRow,
  countText,
  energyRow,
  findingRow,
  findingStyles,
  forecastRow,
  powerRow,
  rowButton,
  solarRow,
  tariffRow,
  type FindingRow,
  type RowContext,
} from "./finding-rows";
import "./sheet";

type Row = FindingRow;

const HEATING_KINDS = new Set(["climate", "heat_pump", "electric_heating", "hot_water"]);

/**
 * What Joe found and now uses, in the setup ("Umschauen"): change, leave out
 * or add each part (a battery in the panel's battery sheet, the meters in
 * its consumers sheet). The rows are the same as on Geräte › Netz & Sonne and
 * Haushalt (components/finding-rows.ts); everything else is set up later
 * where it lives.
 */
export class JoeReview extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) config?: JoeConfig;
  @property({ attribute: false }) discovery?: Discovery;
  @property({ attribute: false }) checks: Check[] = [];
  /** Rows left out (by key). */
  @property({ attribute: false }) omit: string[] = [];

  /** The tariff form is open in a sheet. */
  @state() private tariffOpen = false;

  static styles = [
    shared,
    findingStyles,
    css`
      :host {
        display: block;
      }
      joe-tariff-draft {
        margin-top: 18px;
      }
    `,
  ];

  protected render() {
    const { hass, t, config } = this;
    if (!hass || !t || !config) {
      return nothing;
    }
    const omit = new Set(this.omit);
    return html`<ul class="found">
        ${this.rows(hass, t, config)
          .filter((row) => !omit.has(row.key))
          .map((row) => findingRow(t, row))}
      </ul>
      ${this.tariffOpen ? this.renderTariff(t, config) : nothing}`;
  }

  private rows(hass: HomeAssistant, t: Translate, config: JoeConfig): Row[] {
    const d = this.discovery;
    const ctx: RowContext = { from: this, hass, t, config, discovery: d, checks: this.checks };
    const rows: Row[] = [];
    const energy = energyRow(ctx);
    if (energy) {
      rows.push(energy);
    }
    rows.push(...this.batteryRows(hass, t, config));
    const missing = config.tariff.kind === "unknown";
    rows.push(
      tariffRow(ctx, {
        actions: [
          rowButton(t(missing ? "review.enter" : "review.change"), "mdi:pencil-outline", () => {
            this.tariffOpen = true;
          }),
        ],
      }),
    );
    rows.push(forecastRow(ctx));
    rows.push(powerRow(ctx, "grid_power"));
    rows.push(
      powerRow(ctx, "home_power", {
        devices: rowButton(t("review.home.devices"), "mdi:devices", () => this.edit("consumers")),
      }),
    );
    rows.push(solarRow(ctx));
    rows.push(contextRow(this, hass, t, config, d, "weather"));
    rows.push(contextRow(this, hass, t, config, d, "holiday"));
    const later = [html`<span class="chip soon">${t("review.ask_later")}</span>`];
    if (config.persons.length || d?.calendars.length) {
      rows.push({
        key: "people",
        icon: "mdi:account-group-outline",
        title: t("find.people"),
        detail: t("find.people.detail", {
          persons: countText(t, config.persons.length, "word.person"),
          calendars: countText(t, d?.calendars.length ?? 0, "word.calendar"),
        }),
        chips: later,
      });
    }
    const consumers = config.consumers.filter((c) => c.kind !== "submeter");
    if (consumers.length) {
      rows.push({
        key: "devices",
        icon: "mdi:devices",
        title: t("find.devices"),
        detail: t("find.devices.detail", {
          count: countText(t, consumers.length, "word.device"),
          heating: consumers.filter((c) => HEATING_KINDS.has(c.kind)).length,
        }),
        chips: later,
      });
    }
    return rows;
  }

  // --- Batteries (their own page under Geräte › Speicher after the setup) ---

  private batteryRows(hass: HomeAssistant, t: Translate, config: JoeConfig): Row[] {
    const rows: Row[] = [];
    for (const b of config.batteries) {
      const found = this.discovery?.batteries.find((f) => f.id === b.id);
      const soc = numberState(hass, b.soc_entity);
      const capacity = b.capacity_kwh ?? energyKwh(hass, b.capacity_entity);
      const parts = [
        capacity ? `${formatNumber(t.lang, capacity, 2)} kWh` : t("review.capacity_unknown"),
        soc !== null ? `${formatNumber(t.lang, soc, 0)} %` : null,
        b.adapter !== "none" ? t("find.battery.control") : t("find.battery.read"),
      ];
      const checks = this.checks.filter((c) => c.battery_id === b.id);
      rows.push({
        key: `battery:${b.id}`,
        icon: "mdi:home-battery-outline",
        title: b.name,
        detail: parts.filter(Boolean).join(" · "),
        chips: [
          sourceChip(t, sourceOf(config, `batteries[${b.id}].soc_entity`)),
          ...(found ? [confidenceDots(t, found.confidence)] : []),
        ],
        reasons: found?.reasons,
        notes: checks.map((c) => checkNote(t, c)),
        state: checks.some((c) => c.level === "warn") ? "flag" : undefined,
        tip: "review_battery",
        actions: [
          rowButton(t("review.change"), "mdi:pencil-outline", () => this.edit("battery", b.id)),
          rowButton(t("review.ignore"), "", () => this.ignoreBattery(b.id), true),
        ],
      });
    }
    for (const found of this.discovery?.batteries ?? []) {
      if (!isIgnored(config, `battery:${found.id}`) || config.batteries.some((b) => b.id === found.id)) {
        continue;
      }
      rows.push({
        key: `battery:${found.id}`,
        icon: "mdi:home-battery-outline",
        title: found.name,
        detail: t("review.ignored"),
        state: "ignored",
        tip: "review_ignored",
        actions: [rowButton(t("review.use"), "mdi:undo-variant", () => void useBattery(this, config, found))],
      });
    }
    if (!config.batteries.length && !this.discovery?.batteries.length) {
      rows.push({
        key: "battery:add",
        icon: "mdi:home-battery-outline",
        title: t("review.battery"),
        detail: t("review.battery.none"),
        state: "missing",
        tip: "review_battery_add",
        actions: [rowButton(t("review.add"), "mdi:plus", () => void pickBattery(this, t, hass, config))],
      });
    }
    return rows;
  }

  /** A sheet of the panel (battery editor, consumers list). */
  private edit(editor: "battery" | "consumers", id?: string): void {
    this.dispatchEvent(new CustomEvent("joe-edit", { detail: { editor, id }, bubbles: true, composed: true }));
  }

  private ignoreBattery(id: string): void {
    void saveConfig(this, {
      batteries: { [id]: null },
      answers: { ignored: withIgnored(this.config!, `battery:${id}`, true) },
    });
  }

  // --- Tariff (a sheet here; Geräte › Netz & Sonne has the form on the page) ---

  private renderTariff(t: Translate, config: JoeConfig) {
    const close = (ev: Event) => {
      ev.stopPropagation();
      this.tariffOpen = false;
    };
    return html`<joe-sheet label=${t("edit.tariff.label")} closeLabel=${t("common.close")} @joe-close=${close}>
      <div class="sheet-title">${displayTitle(t("edit.tariff.title"))}</div>
      <joe-tariff-draft closable .hass=${this.hass} .t=${t} .config=${config} .discovery=${this.discovery}></joe-tariff-draft>
    </joe-sheet>`;
  }
}

define("joe-review", JoeReview);
