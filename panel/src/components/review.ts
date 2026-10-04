import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { isIgnored, pickEntity, saveConfig, sourceOf, suggestion, suggestions, withIgnored } from "../config";
import { define } from "../define";
import { energyKwh, entityName, formatNumber, formatState, measurementKw, numberState, sumKw } from "../entities";
import type { TipName, Translate } from "../i18n";
import { shared } from "../styles/shared";
import type {
  BatteryFinding,
  Check,
  Discovery,
  HomeAssistant,
  JoeConfig,
  Measurement,
  Reason,
} from "../types";
import { confidenceDots, reasonText, sourceChip } from "./bits";
import { tip } from "./tip";
import { checkText, tariffText } from "./texts";

interface Row {
  key: string;
  icon: string;
  title: string;
  detail: string;
  chips?: TemplateResult[];
  reasons?: Reason[];
  notes?: TemplateResult[];
  actions?: TemplateResult[];
  tip?: TipName;
  state?: "missing" | "ignored" | "flag";
}

const HEATING_KINDS = new Set(["climate", "heat_pump", "electric_heating", "hot_water"]);

/** What Joe found and now uses, with "change" and "leave out" for each part. */
export class JoeReview extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) config?: JoeConfig;
  @property({ attribute: false }) discovery?: Discovery;
  @property({ attribute: false }) checks: Check[] = [];
  /** In the settings, household and devices are edited here instead of asked later. */
  @property() context: "setup" | "settings" = "setup";

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      ul.found {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 8px;
      }
      li.item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 12px 14px;
        border-radius: 12px;
        background: var(--joe-surface);
        box-shadow: inset 0 0 0 1px var(--joe-line);
      }
      li.item.missing,
      li.item.ignored {
        background: transparent;
        box-shadow: inset 0 0 0 1.5px var(--joe-line-2);
      }
      li.item.flag {
        box-shadow: inset 0 0 0 2px var(--joe-warn);
      }
      .ico-box {
        width: 38px;
        height: 38px;
        border-radius: 10px;
        background: var(--joe-surface-2);
        display: grid;
        place-items: center;
        flex: none;
        color: var(--joe-ink);
      }
      .missing .ico-box,
      .ignored .ico-box {
        color: var(--joe-muted);
      }
      .text {
        min-width: 0;
        flex: 1;
      }
      .head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 8px 12px;
        flex-wrap: wrap;
      }
      .t {
        font-weight: 700;
        line-height: 1.3;
      }
      .ignored .t {
        color: var(--joe-ink-2);
      }
      .chips {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .d {
        font-size: 13.5px;
        color: var(--joe-ink-2);
        margin-top: 2px;
        overflow-wrap: anywhere;
      }
      .missing .d,
      .ignored .d {
        color: var(--joe-muted);
      }
      details {
        margin-top: 6px;
        font-size: 13px;
        color: var(--joe-ink-2);
      }
      summary {
        cursor: pointer;
        font-weight: 600;
        color: var(--joe-ink);
        width: fit-content;
      }
      details ul {
        margin: 4px 0 0;
        padding-left: 18px;
      }
      .note {
        margin-top: 8px;
      }
      .row-actions {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
        margin-top: 10px;
      }
      .row-actions joe-tip {
        margin-left: 2px;
      }
    `,
  ];

  protected render() {
    const { hass, t, config } = this;
    if (!hass || !t || !config) {
      return nothing;
    }
    return html`<ul class="found">
      ${this.rows(hass, t, config).map((row) => this.renderRow(t, row))}
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
    for (const w of d?.wallboxes.filter((w) => w.is_car) ?? []) {
      rows.push({
        key: `wallbox:${w.name}`,
        icon: "mdi:ev-station",
        title: t("find.wallbox"),
        detail: `${w.name} · ${t("review.wallbox.later")}`,
        chips: [html`<span class="chip soon">${t("review.later")}</span>`],
      });
    }
    for (const car of d?.cars ?? []) {
      const soc = car.entities.soc ? numberState(hass, car.entities.soc) : null;
      const parts = [
        car.name,
        soc !== null ? `${formatNumber(t.lang, soc, 0)} %` : null,
        car.range_km !== null ? `${formatNumber(t.lang, car.range_km, 0)} km` : null,
        t("review.car.later"),
      ];
      rows.push({
        key: `car:${car.device_id}`,
        icon: "mdi:car-electric",
        title: t("find.car"),
        detail: parts.filter(Boolean).join(" · "),
        chips: [confidenceDots(t, car.confidence), html`<span class="chip soon">${t("review.later")}</span>`],
      });
    }
    rows.push(this.contextRow(hass, t, config, "weather"));
    rows.push(this.contextRow(hass, t, config, "holiday"));
    const settings = this.context === "settings";
    const later = [html`<span class="chip soon">${t("review.ask_later")}</span>`];
    if (settings || config.persons.length || d?.calendars.length) {
      const calendars = settings
        ? config.persons.reduce((sum, p) => sum + p.calendars.length, 0)
        : (d?.calendars.length ?? 0);
      rows.push({
        key: "people",
        icon: "mdi:account-group-outline",
        title: t("find.people"),
        detail: t("find.people.detail", {
          persons: this.count(t, config.persons.length, "word.person"),
          calendars: this.count(t, calendars, "word.calendar"),
        }),
        chips: settings ? [] : later,
        tip: settings ? "q_household" : undefined,
        actions: settings
          ? [this.button(t("review.change"), "mdi:account-edit-outline", () => this.edit("household"))]
          : undefined,
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

  // --- Weather and holidays ---

  private contextRow(hass: HomeAssistant, t: Translate, config: JoeConfig, kind: "weather" | "holiday"): Row {
    const key = kind === "weather" ? "weather_entity" : "holiday_entity";
    const entity = config.context[key];
    const found = this.discovery?.[kind] ?? null;
    const base = {
      key: kind,
      icon: kind === "weather" ? "mdi:weather-partly-cloudy" : "mdi:calendar-star",
      title: t(kind === "weather" ? "find.weather" : "find.holiday"),
      tip: (kind === "weather" ? "review_weather" : "review_holiday") as TipName,
    };
    const pick = () => this.pickContext(kind);
    if (entity) {
      const same = found?.entity.entity_id === entity;
      return {
        ...base,
        detail: entityName(hass, entity),
        chips: [sourceChip(t, sourceOf(config, `context.${key}`)), ...(found && same ? [confidenceDots(t, found.confidence)] : [])],
        reasons: same ? found?.reasons : undefined,
        actions: [
          this.button(t("review.change"), "mdi:magnify", pick),
          this.button(t("review.ignore"), "", () => this.ignore(kind, { context: { [key]: null } }), true),
        ],
      };
    }
    if (isIgnored(config, kind)) {
      return {
        ...base,
        detail: t("review.ignored"),
        state: "ignored",
        actions: [this.button(t("review.use"), "mdi:undo-variant", pick)],
      };
    }
    return {
      ...base,
      detail: t("find.none"),
      state: "missing",
      notes: [this.info(t(kind === "weather" ? "review.weather.none" : "review.holiday.none"))],
      actions: [this.button(t("review.choose"), "mdi:magnify", pick)],
    };
  }

  private async pickContext(kind: "weather" | "holiday"): Promise<void> {
    const { t, config } = this;
    if (!t || !config) {
      return;
    }
    const key = kind === "weather" ? "weather_entity" : "holiday_entity";
    const found = this.discovery?.[kind];
    const current = config.context[key];
    const picked = await pickEntity(this, {
      heading: t(kind === "weather" ? "pick.weather.title" : "pick.holiday.title"),
      tip: kind === "weather" ? "pick_weather" : "pick_holiday",
      filter: kind === "weather" ? "weather" : "workday",
      selected: current ? [current] : found ? [found.entity.entity_id] : [],
      suggestions: suggestions(found ? [suggestion(found)] : [], found?.alternatives),
    });
    const entity = picked?.selected[0];
    if (!entity) {
      return;
    }
    saveConfig(this, {
      context: { [key]: entity },
      answers: { ignored: withIgnored(config, kind, false) },
    });
  }

  // --- Helpers ---

  private ignore(key: string, patch: Record<string, unknown>): void {
    saveConfig(this, { ...patch, answers: { ignored: withIgnored(this.config!, key, true) } });
  }

  private confirm(key: string): void {
    const confirmed = this.config!.answers.confirmed.filter((item) => item !== key);
    saveConfig(this, { answers: { confirmed: [...confirmed, key] } });
  }

  private edit(editor: "battery" | "tariff" | "household" | "consumers", id?: string): void {
    this.dispatchEvent(new CustomEvent("joe-edit", { detail: { editor, id }, bubbles: true, composed: true }));
  }

  private button(label: string, icon: string, onClick: () => void, quiet = false): TemplateResult {
    return html`<button type="button" class="mini-btn ${quiet ? "quiet" : ""}" @click=${onClick}>
      ${icon ? html`<ha-icon icon=${icon}></ha-icon>` : nothing}${label}
    </button>`;
  }

  private info(text: string): TemplateResult {
    return html`<div class="note"><ha-icon icon="mdi:information-outline"></ha-icon><span>${text}</span></div>`;
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

  private renderRow(t: Translate, row: Row): TemplateResult {
    return html`<li class="item ${row.state ?? ""}" ?data-tipped=${Boolean(row.actions?.length && row.tip)}>
      <span class="ico-box"><ha-icon icon=${row.icon}></ha-icon></span>
      <div class="text">
        <div class="head">
          <span class="t">${row.title}</span>
          ${row.chips?.length ? html`<span class="chips">${row.chips}</span>` : nothing}
        </div>
        <div class="d">${row.detail}</div>
        ${row.reasons?.length
          ? html`<details data-notip>
              <summary>${t("scan.why")}</summary>
              <ul>
                ${row.reasons.map((reason) => html`<li>${reasonText(t, reason)}</li>`)}
              </ul>
            </details>`
          : nothing}
        ${row.notes ?? nothing}
        ${row.actions?.length
          ? html`<div class="row-actions">${row.actions}${row.tip ? tip(t, row.tip) : nothing}</div>`
          : nothing}
      </div>
    </li>`;
  }
}

define("joe-review", JoeReview);
