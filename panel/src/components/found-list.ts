import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { define } from "../define";
import { lookup, type Translate } from "../i18n";
import { shared } from "../styles/shared";
import type { Check, Discovery, EntityRef, Reason } from "../types";

interface Row {
  icon: string;
  title: string;
  detail: string;
  confidence?: number;
  reasons?: Reason[];
  read?: boolean;
  missing?: boolean;
}

const HEATING_KINDS = new Set(["climate", "heat_pump", "electric_heating", "hot_water"]);

/** What Joe found, as a list with reasons, confidence and notes. */
export class JoeFoundList extends LitElement {
  @property({ attribute: false }) discovery?: Discovery;
  @property({ attribute: false }) t?: Translate;
  @property() language = "de";

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
      li.item.missing {
        box-shadow: inset 0 0 0 1.5px var(--joe-line-2);
        background: transparent;
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
      .missing .ico-box {
        color: var(--joe-muted);
      }
      .text {
        min-width: 0;
        flex: 1;
      }
      .t {
        font-weight: 700;
        line-height: 1.3;
      }
      .d {
        font-size: 13.5px;
        color: var(--joe-ink-2);
        margin-top: 2px;
        overflow-wrap: anywhere;
      }
      .missing .d {
        color: var(--joe-muted);
      }
      .end {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 6px;
        flex: none;
      }
      .conf {
        display: inline-flex;
        gap: 3px;
      }
      .conf i {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--joe-line-2);
      }
      .conf i.on {
        background: var(--joe-amber);
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
      .notes {
        margin-top: 18px;
      }
      .notes h3 {
        margin: 0 0 8px;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.09em;
        text-transform: uppercase;
        color: var(--joe-muted);
      }
      .note {
        display: flex;
        gap: 10px;
        align-items: flex-start;
        padding: 10px 12px;
        border-radius: 10px;
        font-size: 14px;
        margin-bottom: 6px;
        background: var(--joe-info-soft);
        color: var(--joe-ink);
      }
      .note ha-icon {
        color: var(--joe-info);
        margin-top: 1px;
      }
      .note.warn {
        background: var(--joe-warn-soft);
      }
      .note.warn ha-icon {
        color: var(--joe-warn);
      }
      @media (max-width: 480px) {
        li.item {
          flex-wrap: wrap;
        }
        .end {
          flex-direction: row;
          align-items: center;
          width: 100%;
          justify-content: flex-end;
        }
      }
    `,
  ];

  protected render() {
    const d = this.discovery;
    const t = this.t;
    if (!d || !t) {
      return nothing;
    }
    const checks = d.checks;
    return html`<ul class="found">
        ${this.rows(d, t).map((row) => this.renderRow(row, t))}
      </ul>
      ${checks.length
        ? html`<div class="notes">
            <h3>${t("scan.notes")}</h3>
            ${checks.map((check) => this.renderCheck(check, t))}
          </div>`
        : nothing}`;
  }

  private rows(d: Discovery, t: Translate): Row[] {
    const rows: Row[] = [];
    const e = d.energy_dashboard;
    if (e.configured) {
      rows.push({
        icon: "mdi:lightning-bolt",
        title: t("find.energy"),
        detail: t("find.energy.detail", {
          grid: this.count(e.grid ?? 0, "word.grid"),
          solar: this.count(e.solar ?? 0, "word.solar"),
          battery: this.count(e.battery ?? 0, "word.battery"),
          devices: this.count(e.devices ?? 0, "word.device"),
        }),
        read: true,
      });
    }
    for (const b of d.batteries) {
      const parts = [
        b.capacity_kwh ? `${this.num(b.capacity_kwh, 1)} kWh` : null,
        typeof b.soc.value === "number" ? `${this.num(b.soc.value, 0)} %` : null,
        b.controllable ? t("find.battery.control") : t("find.battery.read"),
      ];
      rows.push({
        icon: "mdi:home-battery-outline",
        title: b.name,
        detail: parts.filter(Boolean).join(" · "),
        confidence: b.confidence,
        reasons: b.reasons,
      });
    }

    const tariff = d.tariff;
    const ct = (price: number | null) => (price == null ? "–" : this.num(price * 100, 1));
    let tariffText = t("find.tariff.unknown");
    if (tariff.kind === "fixed_window" && tariff.window) {
      tariffText = t("find.tariff.window", {
        start: tariff.window.start,
        end: tariff.window.end,
        night: ct(tariff.night_price),
        day: ct(tariff.day_price),
      });
    } else if (tariff.kind === "dynamic") {
      tariffText = t("find.tariff.dynamic", { night: ct(tariff.night_price), day: ct(tariff.day_price) });
    } else if (tariff.kind === "flat") {
      tariffText = t("find.tariff.flat", { day: ct(tariff.day_price) });
    }
    if (tariff.feed_in_price != null) {
      tariffText += ` · ${t("find.tariff.feedin", { price: ct(tariff.feed_in_price) })}`;
    }
    rows.push({
      icon: "mdi:cash-clock",
      title: tariff.provider ?? t("find.tariff"),
      detail: tariffText,
      confidence: tariff.kind === "unknown" ? undefined : tariff.confidence,
      reasons: tariff.reasons,
      missing: tariff.kind === "unknown",
    });

    const f = d.forecast;
    rows.push(
      f
        ? {
            icon: "mdi:weather-sunny",
            title: t("find.forecast"),
            detail: t("find.forecast.detail", {
              provider: f.provider_name,
              planes: this.count(f.planes, "word.plane"),
              today: f.today_kwh == null ? "–" : this.num(f.today_kwh, 1),
              tomorrow: f.tomorrow_kwh == null ? "–" : this.num(f.tomorrow_kwh, 1),
            }),
            confidence: f.confidence,
            reasons: f.reasons,
          }
        : { icon: "mdi:weather-sunny", title: t("find.forecast"), detail: t("find.none"), missing: true },
    );

    const m = d.measurements;
    rows.push(this.single("mdi:transmission-tower", t("find.grid"), m.grid_power, t));
    rows.push(this.single("mdi:home-lightning-bolt-outline", t("find.home"), m.home_power, t));
    rows.push(
      m.solar_power
        ? {
            icon: "mdi:solar-panel",
            title: t("find.solar"),
            detail: t("find.solar.detail", {
              count: this.count(m.solar_power.entities.length, "word.sensor"),
              total: m.solar_power.total == null ? "–" : this.num(m.solar_power.total, 2),
            }),
            confidence: m.solar_power.confidence,
            reasons: m.solar_power.reasons,
          }
        : { icon: "mdi:solar-panel", title: t("find.solar"), detail: t("find.none"), missing: true },
    );

    for (const w of d.wallboxes.filter((w) => w.is_car)) {
      rows.push({ icon: "mdi:ev-station", title: t("find.wallbox"), detail: w.name, confidence: w.confidence, reasons: w.reasons });
    }
    if (d.weather) {
      rows.push({
        icon: "mdi:weather-partly-cloudy",
        title: t("find.weather"),
        detail: d.weather.entity.name,
        confidence: d.weather.confidence,
        reasons: d.weather.reasons,
      });
    }
    if (d.holiday) {
      rows.push({
        icon: "mdi:calendar-star",
        title: t("find.holiday"),
        detail: d.holiday.entity.name,
        confidence: d.holiday.confidence,
        reasons: d.holiday.reasons,
      });
    }
    if (d.persons.length || d.calendars.length) {
      rows.push({
        icon: "mdi:account-group-outline",
        title: t("find.people"),
        detail: t("find.people.detail", {
          persons: this.count(d.persons.length, "word.person"),
          calendars: this.count(d.calendars.length, "word.calendar"),
        }),
        read: true,
      });
    }
    if (d.consumers.length) {
      rows.push({
        icon: "mdi:devices",
        title: t("find.devices"),
        detail: t("find.devices.detail", {
          count: this.count(d.consumers.filter((c) => c.kind !== "submeter").length, "word.device"),
          heating: d.consumers.filter((c) => HEATING_KINDS.has(c.kind)).length,
        }),
        read: true,
      });
    }
    return rows;
  }

  private single(
    icon: string,
    title: string,
    found: Discovery["measurements"]["grid_power"],
    t: Translate,
  ): Row {
    if (!found) {
      return { icon, title, detail: t("find.none"), missing: true };
    }
    return {
      icon,
      title,
      detail: `${found.entity.name} · ${this.value(found.entity)}`,
      confidence: found.confidence,
      reasons: found.reasons,
    };
  }

  private renderRow(row: Row, t: Translate): TemplateResult {
    return html`<li class="item ${row.missing ? "missing" : ""}">
      <span class="ico-box"><ha-icon icon=${row.icon}></ha-icon></span>
      <div class="text">
        <div class="t">${row.title}</div>
        <div class="d">${row.detail}</div>
        ${row.reasons?.length
          ? html`<details data-notip>
              <summary>${t("scan.why")}</summary>
              <ul>
                ${row.reasons.map((reason) => html`<li>${this.reasonText(reason)}</li>`)}
              </ul>
            </details>`
          : nothing}
      </div>
      <div class="end">
        ${row.read ? html`<span class="chip read"><ha-icon icon="mdi:eye-outline"></ha-icon>${t("energy.read")}</span>` : nothing}
        ${row.confidence != null ? this.dots(row.confidence, t) : nothing}
      </div>
    </li>`;
  }

  private dots(confidence: number, t: Translate): TemplateResult {
    const level = confidence >= 0.85 ? 4 : confidence >= 0.65 ? 3 : confidence >= 0.45 ? 2 : 1;
    const label = t(`conf.${level}` as "conf.4");
    return html`<span class="conf" role="img" aria-label=${label} title=${label}>
      ${[1, 2, 3, 4].map((i) => html`<i class=${i <= level ? "on" : ""}></i>`)}
    </span>`;
  }

  private reasonText(reason: Reason): string {
    const vars: Record<string, string | number> = {};
    for (const [key, value] of Object.entries(reason)) {
      if (typeof value === "string" || typeof value === "number") {
        vars[key] = value;
      }
    }
    return lookup(this.language, `reason.${reason.code}`, vars) ?? reason.code;
  }

  private renderCheck(check: Check, t: Translate): TemplateResult {
    const vars: Record<string, string | number> = {};
    for (const [key, value] of Object.entries(check)) {
      if (typeof value === "number") {
        vars[key] = this.num(value, 2);
      } else if (typeof value === "string") {
        vars[key] = value;
      }
    }
    if (typeof check.role === "string") {
      vars.role = lookup(this.language, `role.${check.role}`) ?? check.role;
    }
    let key = `check.${check.code}`;
    if (check.code === "grid_sign" && typeof check.expected === "number" && typeof check.actual === "number") {
      // Speak of exporting and importing instead of signed numbers.
      key = check.expected < 0 ? "check.grid_sign.export" : "check.grid_sign.import";
      vars.expected = this.num(Math.abs(check.expected), 1);
      vars.actual = this.num(Math.abs(check.actual), 1);
    }
    const text = lookup(this.language, key, vars) ?? check.code;
    return html`<div class="note ${check.level}">
      <ha-icon icon=${check.level === "warn" ? "mdi:alert-outline" : "mdi:information-outline"}></ha-icon>
      <span>${text}</span>
    </div>`;
  }

  /** "1 Fläche", "2 Flächen" – words are stored as "singular|plural". */
  private count(n: number, wordKey: string): string {
    const [one, other] = (lookup(this.language, wordKey) ?? "|").split("|");
    return `${this.num(n, 0)} ${n === 1 ? one : other}`;
  }

  private value(entity: EntityRef): string {
    if (typeof entity.value === "number") {
      return `${this.num(entity.value, entity.unit === "kW" ? 2 : 0)} ${entity.unit ?? ""}`.trim();
    }
    return String(entity.value ?? "–");
  }

  private num(value: number, digits: number): string {
    return new Intl.NumberFormat(this.language, { maximumFractionDigits: digits }).format(value);
  }
}

define("joe-found-list", JoeFoundList);
