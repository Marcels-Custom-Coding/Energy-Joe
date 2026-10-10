import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { isIgnored, saveConfig, sourceOf, withIgnored } from "../config";
import { define } from "../define";
import "../editors/tariff-form";
import { energyKwh, formatNumber, numberState } from "../entities";
import type { Part } from "../homes";
import type { TranslationKey, Translate } from "../i18n";
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
  infoNote,
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

/** The headings of the parts: the names of the chips they live under after the setup. */
const PART_TITLES = {
  battery: "nav.devices.battery",
  grid: "nav.devices.grid",
  car: "nav.devices.car",
  other: "nav.devices.other",
  people: "nav.household.people",
  weather: "onb.part.weather",
  holiday: "onb.part.holiday",
} as const satisfies Record<Part, TranslationKey>;

/**
 * What Joe found and now uses, in the setup ("Umschauen"), in the order of
 * the tabs: Geräte (Speicher, Netz & Sonne, Auto & Laden, Weitere Geräte)
 * and Haushalt (Wer wohnt hier, Wetter, Feiertage). Change, leave out or add
 * each part (a battery in the panel's battery sheet, the meters in its
 * consumers sheet). The rows are the same as on Geräte › Netz & Sonne and
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
      .group + .group {
        margin-top: 28px;
      }
      .group-head {
        margin: 0;
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 800;
        text-transform: uppercase;
        font-size: 24px;
        line-height: 1.1;
      }
      .group-lead {
        margin: 4px 0 0;
        color: var(--joe-ink-2);
        font-size: 14px;
      }
      .part {
        margin-top: 14px;
      }
      .part h4 {
        margin: 0 0 8px;
      }
    `,
  ];

  protected render() {
    const { hass, t, config } = this;
    if (!hass || !t || !config) {
      return nothing;
    }
    const omit = new Set(this.omit);
    const parts = this.parts(hass, t, config);
    const groups: { key: "devices" | "household"; parts: Part[] }[] = [
      { key: "devices", parts: ["battery", "grid", "car", "other"] },
      { key: "household", parts: ["people", "weather", "holiday"] },
    ];
    return html`${groups.map(
        (group) => html`<section class="group">
          <h3 class="group-head">${t(`onb.group.${group.key}`)}</h3>
          <p class="group-lead">${t(`onb.group.${group.key}.lead`)}</p>
          ${group.parts.map((part) => {
            const rows = parts[part].filter((row) => !omit.has(row.key));
            return rows.length
              ? html`<div class="part">
                  <h4 class="eyebrow">${t(PART_TITLES[part])}</h4>
                  <ul class="found">
                    ${rows.map((row) => findingRow(t, row))}
                  </ul>
                </div>`
              : nothing;
          })}
        </section>`,
      )}
      ${this.tariffOpen ? this.renderTariff(t, config) : nothing}`;
  }

  /** The rows of each part, in the order of the tabs Geräte and Haushalt. */
  private parts(hass: HomeAssistant, t: Translate, config: JoeConfig): Record<Part, Row[]> {
    const d = this.discovery;
    const ctx: RowContext = { from: this, hass, t, config, discovery: d, checks: this.checks };
    const grid: Row[] = [];
    const energy = energyRow(ctx);
    if (energy) {
      grid.push(energy);
    }
    const missing = config.tariff.kind === "unknown";
    grid.push(
      tariffRow(ctx, {
        actions: [
          rowButton(t(missing ? "review.enter" : "review.change"), "mdi:pencil-outline", () => {
            this.tariffOpen = true;
          }),
        ],
      }),
      forecastRow(ctx),
      powerRow(ctx, "grid_power"),
      powerRow(ctx, "home_power", {
        devices: rowButton(t("review.home.devices"), "mdi:devices", () => this.edit("consumers")),
      }),
      solarRow(ctx),
    );
    return {
      battery: this.batteryRows(hass, t, config),
      grid,
      car: this.carRows(t, config),
      other: [this.otherRow(t, config)],
      people: [this.peopleRow(t, config)],
      weather: [contextRow(this, hass, t, config, d, "weather")],
      holiday: [contextRow(this, hass, t, config, d, "holiday")],
    };
  }

  /** Wallboxes, cars and E-Auto meters Joe found; charging is set up with the question about the E-Auto. */
  private carRows(t: Translate, config: JoeConfig): Row[] {
    const d = this.discovery;
    const rows: Row[] = [];
    for (const wallbox of d?.wallboxes.filter((w) => w.is_car) ?? []) {
      rows.push({ key: `car:wallbox:${wallbox.device_id ?? wallbox.name}`, icon: "mdi:ev-station", title: wallbox.name, detail: t("onb.car.wallbox") });
    }
    for (const car of d?.cars ?? []) {
      const soc = car.soc !== null ? ` · ${formatNumber(t.lang, car.soc, 0)} %` : "";
      rows.push({ key: `car:car:${car.device_id}`, icon: "mdi:car-electric", title: car.name, detail: `${t("onb.car.car")}${soc}` });
    }
    for (const meter of config.consumers.filter((c) => c.kind === "ev")) {
      rows.push({ key: `car:meter:${meter.id}`, icon: "mdi:meter-electric-outline", title: meter.name, detail: t("onb.car.meter") });
    }
    if (!rows.length) {
      rows.push({
        key: "car:none",
        icon: "mdi:car-electric",
        title: t("nav.devices.car"),
        detail: t("find.none"),
        state: "missing",
        notes: [infoNote(t("onb.car.none"))],
      });
    }
    return rows;
  }

  /** The meters from the Energy dashboard (their kinds come with the question about heating). */
  private otherRow(t: Translate, config: JoeConfig): Row {
    const consumers = config.consumers.filter((c) => c.kind !== "submeter");
    if (!consumers.length) {
      return {
        key: "devices",
        icon: "mdi:devices",
        title: t("find.devices"),
        detail: t("find.none"),
        state: "missing",
        notes: [infoNote(t("onb.other.none"))],
      };
    }
    return {
      key: "devices",
      icon: "mdi:devices",
      title: t("find.devices"),
      detail: t("find.devices.detail", {
        count: countText(t, consumers.length, "word.device"),
        heating: consumers.filter((c) => HEATING_KINDS.has(c.kind)).length,
      }),
    };
  }

  /** Persons and calendars (the household question comes in a moment). */
  private peopleRow(t: Translate, config: JoeConfig): Row {
    const calendars = this.discovery?.calendars.length ?? 0;
    if (!config.persons.length && !calendars) {
      return {
        key: "people",
        icon: "mdi:account-group-outline",
        title: t("find.people"),
        detail: t("find.none"),
        state: "missing",
        notes: [infoNote(t("onb.people.none"))],
      };
    }
    return {
      key: "people",
      icon: "mdi:account-group-outline",
      title: t("find.people"),
      detail: t("find.people.detail", {
        persons: countText(t, config.persons.length, "word.person"),
        calendars: countText(t, calendars, "word.calendar"),
      }),
    };
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
