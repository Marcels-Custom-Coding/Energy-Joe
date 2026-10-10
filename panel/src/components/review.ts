import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { isIgnored, pickEntity, saveConfig, sourceOf, suggestion, suggestions, withIgnored } from "../config";
import { define } from "../define";
import { energyKwh, entityName, formatNumber, formatState, measurementKw, numberState, sumKw } from "../entities";
import type { TipName, Translate } from "../i18n";
import { shared } from "../styles/shared";
import type { BatteryFinding, Check, Discovery, HomeAssistant, JoeConfig, Measurement } from "../types";
import { flexibleConsumers } from "../types";
import { confidenceDots, sourceChip } from "./bits";
import { contextRow, findingRow, findingStyles, infoNote, rowButton, type FindingRow } from "./finding-rows";
import { checkText, tariffText } from "./texts";

type Row = FindingRow;

const HEATING_KINDS = new Set(["climate", "heat_pump", "electric_heating", "hot_water"]);

/** Rows that live under Haushalt (Wer wohnt hier, Tage & Kalender, Unterwegs & Wetter). */
const HOUSEHOLD_ROWS = ["people", "weather", "holiday"];

/** What Joe found and now uses, with "change" and "leave out" for each part. */
export class JoeReview extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) config?: JoeConfig;
  @property({ attribute: false }) discovery?: Discovery;
  @property({ attribute: false }) checks: Check[] = [];
  /** In the settings, devices are edited here instead of asked later. */
  @property() context: "setup" | "settings" = "setup";
  /**
   * Rows left out (by key). In the settings the household rows (people,
   * weather, holiday) are always left out: they live under Haushalt now.
   */
  @property({ attribute: false }) omit: string[] = [];

  static styles = [
    shared,
    findingStyles,
    css`
      :host {
        display: block;
      }
    `,
  ];

  protected render() {
    const { hass, t, config } = this;
    if (!hass || !t || !config) {
      return nothing;
    }
    const omit = new Set([...this.omit, ...(this.context === "settings" ? HOUSEHOLD_ROWS : [])]);
    return html`<ul class="found">
      ${this.rows(hass, t, config)
        .filter((row) => !omit.has(row.key))
        .map((row) => findingRow(t, row))}
    </ul>`;
  }

  private rows(hass: HomeAssistant, t: Translate, config: JoeConfig): Row[] {
    const d = this.discovery;
    const rows: Row[] = [];
    const e = d?.energy_dashboard;
    if (e?.configured) {
      rows.push({
        key: "energy",
        icon: "mdi:lightning-bolt",
        title: t("find.energy"),
        detail: t("find.energy.detail", {
          grid: this.count(t, e.grid ?? 0, "word.grid"),
          solar: this.count(t, e.solar ?? 0, "word.solar"),
          battery: this.count(t, e.battery ?? 0, "word.battery"),
          devices: this.count(t, e.devices ?? 0, "word.device"),
        }),
        chips: [sourceChip(t, { source: "read" })],
      });
    }
    rows.push(...this.batteryRows(hass, t, config));
    rows.push(this.tariffRow(t, config));
    rows.push(this.forecastRow(t, config));
    rows.push(this.powerRow(hass, t, config, "grid_power"));
    rows.push(this.powerRow(hass, t, config, "home_power"));
    rows.push(this.solarRow(hass, t, config));
    // Used by a night action, or still to set up (Geräte → Nacht-Aktionen).
    const used = (yes: boolean) =>
      html`<span class="chip ${yes ? "ok" : "soon"}">${t(yes ? "review.used" : "review.unused")}</span>`;
    for (const w of d?.wallboxes.filter((w) => w.is_car) ?? []) {
      const mine = config.actions.some(
        (a) => a.id === `ev_${w.device_id}` || (w.mode_entity && a.entity_id === w.mode_entity),
      );
      rows.push({
        key: `wallbox:${w.name}`,
        icon: "mdi:ev-station",
        title: t("find.wallbox"),
        detail: `${w.name} · ${t(mine ? "review.wallbox.used" : "review.wallbox.unused")}`,
        chips: [used(mine)],
      });
    }
    for (const car of d?.cars ?? []) {
      const soc = car.entities.soc ? numberState(hass, car.entities.soc) : null;
      const parts = [
        car.name,
        soc !== null ? `${formatNumber(t.lang, soc, 0)} %` : null,
        car.range_km !== null ? `${formatNumber(t.lang, car.range_km, 0)} km` : null,
        null,
      ];
      const charged = config.actions.some(
        (a) =>
          a.need?.enabled &&
          ((car.entities.soc && a.need.soc_entity === car.entities.soc) ||
            (car.entities.range && a.need.range_entity === car.entities.range)),
      );
      parts[3] = t(charged ? "review.car.used" : "review.car.unused");
      rows.push({
        key: `car:${car.device_id}`,
        icon: "mdi:car-electric",
        title: t("find.car"),
        detail: parts.filter(Boolean).join(" · "),
        chips: [confidenceDots(t, car.confidence), used(charged)],
      });
    }
    rows.push(contextRow(this, hass, t, config, d, "weather"));
    rows.push(contextRow(this, hass, t, config, d, "holiday"));
    const settings = this.context === "settings";
    const later = [html`<span class="chip soon">${t("review.ask_later")}</span>`];
    if (!settings && (config.persons.length || d?.calendars.length)) {
      rows.push({
        key: "people",
        icon: "mdi:account-group-outline",
        title: t("find.people"),
        detail: t("find.people.detail", {
          persons: this.count(t, config.persons.length, "word.person"),
          calendars: this.count(t, d?.calendars.length ?? 0, "word.calendar"),
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
          count: this.count(t, consumers.length, "word.device"),
          heating: consumers.filter((c) => HEATING_KINDS.has(c.kind)).length,
        }),
        chips: settings ? [] : later,
        tip: settings ? "f_consumer_kind" : undefined,
        actions: settings ? [this.button(t("review.assign"), "mdi:devices", () => this.edit("consumers"))] : undefined,
      });
    }
    return rows;
  }

  // --- Batteries ---

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
      const notes = this.checks.filter((c) => c.battery_id === b.id).map((c) => this.note(t, c));
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
        notes,
        state: this.checks.some((c) => c.battery_id === b.id && c.level === "warn") ? "flag" : undefined,
        tip: "review_battery",
        actions: [
          this.button(t("review.change"), "mdi:pencil-outline", () => this.edit("battery", b.id)),
          this.button(t("review.ignore"), "", () => this.ignoreBattery(b.id), true),
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
        actions: [this.button(t("review.use"), "mdi:undo-variant", () => this.useBattery(found))],
      });
    }
    const none = !config.batteries.length && !this.discovery?.batteries.length;
    if (none || this.context === "settings") {
      rows.push({
        key: "battery:add",
        icon: "mdi:home-battery-outline",
        title: t(none ? "review.battery" : "review.battery.more"),
        detail: t(none ? "review.battery.none" : "review.battery.more_detail"),
        state: "missing",
        tip: "review_battery_add",
        actions: [this.button(t("review.add"), "mdi:plus", () => this.addBattery())],
      });
    }
    return rows;
  }

  private ignoreBattery(id: string): void {
    saveConfig(this, {
      batteries: { [id]: null },
      answers: { ignored: withIgnored(this.config!, `battery:${id}`, true) },
    });
  }

  private useBattery(found: BatteryFinding): void {
    const config = this.config!;
    saveConfig(
      this,
      {
        batteries: {
          [found.id]: {
            name: found.name,
            adapter: found.adapter,
            soc_entity: found.soc_entity,
            power: found.power,
            capacity_kwh: found.capacity_kwh,
            capacity_entity: found.capacity_entity,
            max_charge_w: found.max_charge_w,
            max_discharge_w: found.max_discharge_w,
            device_id: found.device_id,
            controls: found.controls,
            priority: Math.min(config.batteries.length + 1, 9),
          },
        },
        answers: { ignored: withIgnored(config, `battery:${found.id}`, false) },
      },
      "read",
    );
  }

  private async addBattery(): Promise<void> {
    const { t, hass, config } = this;
    if (!t || !hass || !config) {
      return;
    }
    const picked = await pickEntity(this, {
      heading: t("pick.battery.title"),
      tip: "pick_battery",
      filter: "soc",
      selected: [],
      exclude: config.batteries.map((b) => b.soc_entity),
    });
    const soc = picked?.selected[0];
    if (!soc) {
      return;
    }
    const device = hass.entities?.[soc]?.device_id;
    const id = device && !config.batteries.some((b) => b.id === device) ? device : soc;
    saveConfig(this, {
      batteries: {
        [id]: {
          name: (device && (hass.devices?.[device]?.name_by_user || hass.devices?.[device]?.name)) || entityName(hass, soc),
          adapter: "none",
          soc_entity: soc,
          device_id: device ?? null,
          priority: Math.min(config.batteries.length + 1, 9),
        },
      },
    });
  }

  // --- Tariff and forecast ---

  private tariffRow(t: Translate, config: JoeConfig): Row {
    const tariff = config.tariff;
    const missing = tariff.kind === "unknown";
    return {
      key: "tariff",
      icon: "mdi:cash-clock",
      title: this.discovery?.tariff.provider ?? t("find.tariff"),
      detail: tariffText(t, tariff),
      chips: missing
        ? []
        : [
            sourceChip(t, sourceOf(config, "tariff.kind")),
            ...(this.discovery && this.discovery.tariff.kind !== "unknown"
              ? [confidenceDots(t, this.discovery.tariff.confidence)]
              : []),
          ],
      reasons: this.discovery?.tariff.reasons,
      notes: missing ? [this.info(t("review.tariff.ask"))] : [],
      state: missing ? "missing" : undefined,
      tip: "review_tariff",
      actions: [this.button(t(missing ? "review.enter" : "review.change"), "mdi:pencil-outline", () => this.edit("tariff"))],
    };
  }

  private forecastRow(t: Translate, config: JoeConfig): Row {
    const found = this.discovery?.forecast;
    const ignored = isIgnored(config, "forecast");
    const base = { key: "forecast", icon: "mdi:weather-sunny", title: t("find.forecast"), tip: "review_forecast" as TipName };
    if (config.forecast.provider) {
      return {
        ...base,
        detail: found
          ? t("find.forecast.detail", {
              provider: found.provider_name,
              planes: this.count(t, found.planes, "word.plane"),
              today: found.today_kwh == null ? "–" : formatNumber(t.lang, found.today_kwh, 1),
              tomorrow: found.tomorrow_kwh == null ? "–" : formatNumber(t.lang, found.tomorrow_kwh, 1),
            })
          : config.forecast.provider,
        chips: [sourceChip(t, sourceOf(config, "forecast.provider")), ...(found ? [confidenceDots(t, found.confidence)] : [])],
        reasons: found?.reasons,
        actions: [this.button(t("review.ignore"), "", () => this.ignoreForecast(), true)],
      };
    }
    if (ignored && found) {
      return {
        ...base,
        detail: t("review.ignored"),
        state: "ignored",
        actions: [this.button(t("review.use"), "mdi:undo-variant", () => this.useForecast())],
      };
    }
    return { ...base, detail: t("find.none"), state: "missing", notes: [this.info(t("review.forecast.none"))], tip: undefined };
  }

  private ignoreForecast(): void {
    saveConfig(this, {
      forecast: { provider: null, config_entries: [], today: [], tomorrow: [], remaining_today: [], alternatives: [] },
      answers: { ignored: withIgnored(this.config!, "forecast", true) },
    });
  }

  private useForecast(): void {
    const found = this.discovery?.forecast;
    if (!found) {
      return;
    }
    saveConfig(
      this,
      {
        forecast: {
          provider: found.provider,
          config_entries: found.config_entries ?? [],
          today: found.today ?? [],
          tomorrow: found.tomorrow ?? [],
          remaining_today: found.remaining_today ?? [],
          alternatives: (found.others ?? []).map((other) => ({
            id: other.provider,
            name: other.provider_name,
            provider: other.provider,
            tomorrow: other.tomorrow,
          })),
        },
        answers: { ignored: withIgnored(this.config!, "forecast", false) },
      },
      "read",
    );
  }

  // --- Grid, home and solar power ---

  private powerRow(hass: HomeAssistant, t: Translate, config: JoeConfig, role: "grid_power" | "home_power"): Row {
    const m = config.measurements[role];
    const found = this.discovery?.measurements[role] ?? null;
    const grid = role === "grid_power";
    const ignored = isIgnored(config, role);
    const base = {
      key: role,
      icon: grid ? "mdi:transmission-tower" : "mdi:home-lightning-bolt-outline",
      title: t(grid ? "find.grid" : "find.home"),
      tip: (grid ? "review_grid" : "review_home") as TipName,
    };
    const pick = this.button(t(m ? "review.change" : "review.choose"), "mdi:magnify", () => this.pickPower(role));
    if (!m && !grid && config.measurements.grid_power) {
      // No consumption sensor needed: worked out like the Energy dashboard.
      return {
        ...base,
        detail: t("review.home.balance"),
        notes: this.homeNotes(t, config),
        actions: [pick, this.button(t("review.home.devices"), "mdi:devices", () => this.edit("consumers"))],
      };
    }
    if (!m) {
      if (ignored) {
        return {
          ...base,
          detail: t("review.home.computed"),
          state: "ignored",
          actions: [this.button(t("review.choose"), "mdi:magnify", () => this.pickPower(role))],
        };
      }
      return {
        ...base,
        detail: t("find.none"),
        state: "missing",
        notes: [this.info(t(grid ? "review.grid.none" : "review.home.none"))],
        actions: grid
          ? [pick]
          : [pick, this.button(t("review.home.without"), "", () => this.ignore("home_power", { measurements: { home_power: null } }), true)],
      };
    }
    const kw = measurementKw(hass, m);
    let live = formatState(hass, m.entity_id, t.lang);
    if (kw !== null) {
      const value = formatNumber(t.lang, Math.abs(kw), 2);
      live = grid ? t(kw >= 0 ? "live.import" : "live.export", { value }) : t("live.kw", { value: formatNumber(t.lang, kw, 2) });
    }
    const checks = this.checks.filter(
      (c) =>
        c.code !== "missing" &&
        (c.role === role || (grid && c.code === "grid_sign") || (!grid && c.code === "home_negative")),
    );
    const notes = checks.map((c) => {
      if (c.code === "grid_sign") {
        return this.note(t, c, [
          this.button(t("review.invert"), "mdi:swap-vertical", () => this.setPower(role, { ...m, invert: !m.invert })),
          this.button(t("review.keep"), "mdi:check", () => this.confirm(`grid_sign:${m.entity_id}`), true),
        ]);
      }
      if (c.code === "home_negative") {
        return this.note(t, c, [
          this.button(t("review.invert"), "mdi:swap-vertical", () => this.setPower(role, { ...m, invert: !m.invert })),
        ]);
      }
      return this.note(t, c);
    });
    const same = found?.entity.entity_id === m.entity_id;
    if (!grid && config.measurements.grid_power) {
      // Worked out like the Energy dashboard; the sensor is there to compare.
      return {
        ...base,
        detail: `${t("review.home.balance")} · ${t("review.home.compare", { name: entityName(hass, m.entity_id), live })}`,
        chips: [sourceChip(t, sourceOf(config, `measurements.${role}`))],
        notes: [...this.homeNotes(t, config), ...notes],
        state: checks.some((c) => c.level === "warn") ? "flag" : undefined,
        actions: [pick, this.button(t("review.home.devices"), "mdi:devices", () => this.edit("consumers"))],
      };
    }
    return {
      ...base,
      detail: `${entityName(hass, m.entity_id)} · ${live}`,
      chips: [sourceChip(t, sourceOf(config, `measurements.${role}`)), ...(found && same ? [confidenceDots(t, found.confidence)] : [])],
      reasons: same ? found?.reasons : undefined,
      notes,
      state: checks.some((c) => c.level === "warn") ? "flag" : undefined,
      actions: [pick],
    };
  }

  /** What Joe leaves out for the battery, and how far the sensor is off. */
  private homeNotes(t: Translate, config: JoeConfig): TemplateResult[] {
    const notes: TemplateResult[] = [];
    const flexible = flexibleConsumers(config.consumers);
    if (flexible.length) {
      const names = flexible
        .map((c) => (c.kind === "ev" || c.runs === "always" || !c.runs ? c.name : `${c.name} (${t(`runs.${c.runs}`)})`))
        .join(", ");
      notes.push(this.info(t(flexible.some((c) => c.kind === "ev") ? "review.home.flexible" : "review.home.flexible_some", { names })));
    } else if (config.consumers.some((c) => c.kind !== "submeter")) {
      notes.push(this.info(t("review.home.flexible_none")));
    }
    const check = config.learned.home_check;
    if (check && check.calc_kwh > 0) {
      const off = (check.sensor_kwh - check.calc_kwh) / check.calc_kwh;
      if (Math.abs(off) >= 0.1) {
        notes.push(
          this.info(
            t("review.home.off", {
              days: check.days,
              pct: formatNumber(t.lang, Math.abs(off) * 100, 0),
              direction: t(off < 0 ? "review.home.less" : "review.home.more"),
            }),
          ),
        );
      }
    }
    return notes;
  }

  private async pickPower(role: "grid_power" | "home_power"): Promise<void> {
    const { t, config } = this;
    if (!t || !config) {
      return;
    }
    const m = config.measurements[role];
    const found = this.discovery?.measurements[role];
    const grid = role === "grid_power";
    const picked = await pickEntity(this, {
      heading: t(grid ? "pick.grid.title" : "pick.home.title"),
      tip: grid ? "pick_grid" : "pick_home",
      filter: "power",
      selected: m ? [m.entity_id] : [],
      suggestions: suggestions(found ? [suggestion(found)] : [], found?.alternatives),
      measurement: { invert: m?.invert ?? found?.measurement.invert ?? false, role: grid ? "grid" : "home" },
    });
    const entity = picked?.selected[0];
    if (!picked || !entity) {
      return;
    }
    const patch: Record<string, unknown> = {
      measurements: { [role]: { entity_id: entity, invert: picked.invert, minus_entity_id: null } },
    };
    if (isIgnored(config, role)) {
      patch.answers = { ignored: withIgnored(config, role, false) };
    }
    saveConfig(this, patch);
  }

  private setPower(role: "grid_power" | "home_power", measurement: Measurement): void {
    saveConfig(this, { measurements: { [role]: measurement } });
  }

  private solarRow(hass: HomeAssistant, t: Translate, config: JoeConfig): Row {
    const list = config.measurements.solar_power;
    const found = this.discovery?.measurements.solar_power ?? null;
    const base = { key: "solar_power", icon: "mdi:solar-panel", title: t("find.solar"), tip: "review_solar" as TipName };
    if (!list.length) {
      if (isIgnored(config, "solar_power")) {
        return {
          ...base,
          detail: t("review.solar.without"),
          state: "ignored",
          actions: [this.button(t("review.choose"), "mdi:magnify", () => this.pickSolar())],
        };
      }
      return {
        ...base,
        detail: t("find.none"),
        state: "missing",
        actions: [
          this.button(t("review.choose"), "mdi:magnify", () => this.pickSolar()),
          this.button(t("review.solar.none"), "", () => this.ignore("solar_power", { measurements: { solar_power: [] } }), true),
        ],
      };
    }
    const total = sumKw(hass, list);
    const notes = this.checks.filter((c) => c.role === "solar_power" && c.code !== "missing").map((c) => this.note(t, c));
    return {
      ...base,
      detail: t("find.solar.detail", {
        count: this.count(t, list.length, "word.sensor"),
        total: total === null ? "–" : formatNumber(t.lang, total, 2),
      }),
      chips: [sourceChip(t, sourceOf(config, "measurements.solar_power")), ...(found ? [confidenceDots(t, found.confidence)] : [])],
      reasons: found?.reasons,
      notes,
      state: notes.length && this.checks.some((c) => c.role === "solar_power" && c.level === "warn") ? "flag" : undefined,
      actions: [this.button(t("review.change"), "mdi:magnify", () => this.pickSolar())],
    };
  }

  private async pickSolar(): Promise<void> {
    const { t, config } = this;
    if (!t || !config) {
      return;
    }
    const current = config.measurements.solar_power;
    const found = this.discovery?.measurements.solar_power;
    const picked = await pickEntity(this, {
      heading: t("pick.solar.title"),
      tip: "pick_solar",
      filter: "power",
      multiple: true,
      selected: current.map((m) => m.entity_id),
      suggestions: suggestions(
        (found?.entities ?? []).map((entity) => ({ entity_id: entity.entity_id, confidence: found?.confidence, reasons: found?.reasons })),
        found?.alternatives,
      ),
    });
    if (!picked) {
      return;
    }
    const patch: Record<string, unknown> = {
      measurements: {
        solar_power: picked.selected.map(
          (id) => current.find((m) => m.entity_id === id) ?? { entity_id: id, invert: false, minus_entity_id: null },
        ),
      },
    };
    if (isIgnored(config, "solar_power")) {
      patch.answers = { ignored: withIgnored(config, "solar_power", false) };
    }
    saveConfig(this, patch);
  }

  // --- Helpers ---

  private ignore(key: string, patch: Record<string, unknown>): void {
    saveConfig(this, { ...patch, answers: { ignored: withIgnored(this.config!, key, true) } });
  }

  private confirm(key: string): void {
    const confirmed = this.config!.answers.confirmed.filter((item) => item !== key);
    saveConfig(this, { answers: { confirmed: [...confirmed, key] } });
  }

  private edit(editor: "battery" | "tariff" | "consumers", id?: string): void {
    this.dispatchEvent(new CustomEvent("joe-edit", { detail: { editor, id }, bubbles: true, composed: true }));
  }

  private button(label: string, icon: string, onClick: () => void, quiet = false): TemplateResult {
    return rowButton(label, icon, onClick, quiet);
  }

  private info(text: string): TemplateResult {
    return infoNote(text);
  }

  private note(t: Translate, check: Check, actions: TemplateResult[] = []): TemplateResult {
    return html`<div class="note ${check.level}">
      <ha-icon icon=${check.level === "warn" ? "mdi:alert-outline" : "mdi:information-outline"}></ha-icon>
      <div>
        <span>${checkText(t, check)}</span>
        ${actions.length ? html`<div class="note-actions">${actions}</div>` : nothing}
      </div>
    </div>`;
  }

  private count(t: Translate, n: number, wordKey: "word.grid" | "word.solar" | "word.battery" | "word.device" | "word.plane" | "word.sensor" | "word.person" | "word.calendar"): string {
    const [one, other] = t(wordKey).split("|");
    return `${formatNumber(t.lang, n, 0)} ${n === 1 ? one : other}`;
  }
}

define("joe-review", JoeReview);
