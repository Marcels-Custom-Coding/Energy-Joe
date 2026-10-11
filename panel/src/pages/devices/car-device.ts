import { css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { actionPageStyles, subHead } from "../../components/action-page";
import "../../components/car-charge";
import "../../components/car-need";
import "../../components/car-sources";
import "../../components/car-steer";
import { carLevel } from "../../components/device-card";
import { tip } from "../../components/tip";
import { carPoint, carRoute, planCar, pointStatus, sourceName } from "../../cars";
import { define } from "../../define";
import type { DeviceEntry } from "../../device-model";
import { entityName, formatState } from "../../entities";
import type { Translate } from "../../i18n";
import { carLearned, learnedRows, learnedStyles } from "../../learned-view";
import { href, onLink, revealAnchor, type Route } from "../../router";
import { shared } from "../../styles/shared";
import type { CarConfig, CarRole, JoeState, PlanAction } from "../../types";
import { deviceFrame, frameFromEntry, frameStyles } from "./device-frame";
import { DeviceSection } from "./section-base";

/** The values shown under Jetzt, each with where it comes from. */
const SHOWN: CarRole[] = ["soc", "range", "odometer", "plugged", "location", "outside_temp"];

/**
 * One car under Geräte › Auto & Laden (/devices/car/<id>): Jetzt (level,
 * range, where it is plugged in, charge now or tonight, tomorrow's trips),
 * Steuern (charging by need, reserve, highest level), Termine
 * (/devices/car/<id>/calendars), Quellen (/devices/car/<id>/sources: the
 * integrations merged into it), Gelernt, Protokoll and Löschen.
 */
export class JoeCarDevice extends DeviceSection {
  @property({ attribute: false }) entry?: DeviceEntry;
  /** "calendars" or "sources": scroll there. */
  @property({ attribute: false }) sub?: string;

  private revealed = "";

  static styles = [
    shared,
    frameStyles,
    learnedStyles,
    actionPageStyles,
    css`
      .car-cal {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 4px;
        padding: 8px 10px;
        border-radius: 10px;
        background: var(--joe-surface-2);
      }
      .car-cal .grow {
        flex: 1 1 0;
        min-width: 0;
        display: grid;
      }
      .car-cal b {
        font-weight: 600;
        overflow-wrap: anywhere;
      }
      .car-cal small {
        color: var(--joe-muted);
        font-size: 12.5px;
      }
      .car-cal a.mini-btn {
        min-height: 44px;
        text-decoration: none;
      }
      ul.values {
        list-style: none;
        margin: 0 0 4px;
        padding: 0;
        display: grid;
        gap: 2px;
      }
      ul.values li {
        display: grid;
        grid-template-columns: minmax(0, 8em) minmax(0, 1fr);
        align-items: baseline;
        gap: 2px 10px;
        padding: 4px 0;
      }
      ul.values .label {
        color: var(--joe-ink-2);
        overflow-wrap: anywhere;
      }
      ul.values .value {
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
        gap: 2px 8px;
        min-width: 0;
      }
      ul.values b {
        font-weight: 700;
        overflow-wrap: anywhere;
      }
      .plugged {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px 10px;
        margin: 6px 0 0;
      }
      .plugged a {
        min-height: 44px;
        text-decoration: none;
      }
    `,
  ];

  protected updated(changed: PropertyValues<this>): void {
    const anchor = this.sub === "calendars" || this.sub === "sources" ? this.sub : "";
    const target = anchor ? `${this.entry?.id}/${anchor}` : "";
    if (changed.has("sub") || changed.has("entry")) {
      if (!target) {
        this.revealed = "";
      } else if (this.revealed !== target && revealAnchor(this.renderRoot, anchor)) {
        this.revealed = target;
      }
    }
  }

  protected render() {
    const { t, hass, state: joe, entry } = this;
    const car = entry?.car;
    if (!t || !hass || !joe || !entry || !car) {
      return nothing;
    }
    const base = frameFromEntry(this.ctx, entry);
    const need = car.need;
    const props = { hass, t, state: joe, discovery: this.discovery, prefix: this.prefix };
    return deviceFrame(this.ctx, {
      ...base,
      live: carLevel(t, hass, joe, car.id) || undefined,
      why: this.whereText(t, joe, car),
      log: base.log ? { ...base.log, filter: { group: "car" } } : undefined,
      now: html`${this.values(t, joe, car)} ${this.plugged(t, joe, car)}
        <joe-car-charge .hass=${hass} .t=${t} .state=${joe} .car=${car}></joe-car-charge>
        ${need.enabled ? html`${subHead(t("car.trips"))} ${this.trips(t, joe, car)}` : nothing}`,
      steer: html`<joe-car-steer
        .hass=${props.hass}
        .t=${t}
        .state=${joe}
        .discovery=${props.discovery}
        .prefix=${props.prefix}
        .car=${car}
        .section=${"need"}
      ></joe-car-steer>`,
      more: [
        {
          anchor: "calendars",
          title: t("devices.car.terms"),
          tip: "car_terms",
          // Always set up here; the appointments only count with charging by need on.
          body: html`${need.enabled ? this.calendarLine(t, joe, car) : html`<p class="muted">${t("devices.car.terms_off")}</p>`}
            <joe-car-steer
              .hass=${hass}
              .t=${t}
              .state=${joe}
              .discovery=${this.discovery}
              .prefix=${this.prefix}
              .car=${car}
              .section=${"calendars"}
            ></joe-car-steer>`,
        },
        {
          anchor: "sources",
          title: t("car.sources"),
          tip: "car_sources",
          body: html`<joe-car-sources
            .hass=${hass}
            .t=${t}
            .state=${joe}
            .discovery=${this.discovery}
            .prefix=${this.prefix}
            .car=${car}
          ></joe-car-sources>`,
        },
      ],
      learned: learnedRows([carLearned(t, joe.config.learned, car)]),
      learnedArea: "car",
      tips: { steer: "car_steer", now: "car_now" },
      removeTitle: t("devices.page.delete"),
      remove: html`<joe-car-delete .t=${t} .config=${joe.config} .car=${car} .leave=${{ tab: "devices", section: "car" } satisfies Route}></joe-car-delete>`,
    });
  }

  /** "Steckt an Parkplatz eBox · erkannt über evcc" in the head. */
  private whereText(t: Translate, joe: JoeState, car: CarConfig): string {
    const point = carPoint(joe, car.id);
    if (!point) {
      return t(joe.cars?.cars?.[car.id]?.plugged ? "car.plugged_elsewhere" : "car.not_plugged");
    }
    const how = pointStatus(joe, point.id)?.how ?? "home";
    return `${t("car.plugged_at", { point: point.name })} · ${t(`point.how.${how}`)}`;
  }

  /** Each value with where it comes from ("Ladestand 57 % · aus evcc"). */
  private values(t: Translate, joe: JoeState, car: CarConfig): TemplateResult {
    const hass = this.hass!;
    const values = joe.cars?.cars?.[car.id]?.values ?? {};
    const rows = SHOWN.filter((role) => values[role]);
    if (!rows.length) {
      return html`<p class="muted">${t("car.values.none")}</p>`;
    }
    return html`<ul class="values">
      ${rows.map((role) => {
        const found = values[role]!;
        return html`<li>
          <span class="label">${t(`car.role.${role}`)}</span>
          <span class="value">
            <b>${this.valueText(t, role, found.entity)}</b>
            <span class="chip">${found.kind === "manual" ? t("car.source.chip_manual") : t("car.source.chip", { from: sourceName(t, found) })}</span>
          </span>
        </li>`;
      })}
    </ul>`;
  }

  /** A value in words: plugged in yes/no, at home or the zone, else the state with its unit. */
  private valueText(t: Translate, role: CarRole, entity: string): string {
    const hass = this.hass!;
    const raw = hass.states[entity]?.state;
    if (raw === undefined || raw === "unavailable" || raw === "unknown") {
      return t("car.value.unknown");
    }
    if (role === "plugged") {
      return t(["on", "true", "plugged", "connected"].includes(raw.toLowerCase()) ? "car.value.plugged" : "car.value.unplugged");
    }
    if (role === "location") {
      return raw === "home" ? t("car.value.home") : raw === "not_home" ? t("car.value.away") : raw;
    }
    return formatState(hass, entity, t.lang);
  }

  /** Where the car is plugged in, with a link to that charge point. */
  private plugged(t: Translate, joe: JoeState, car: CarConfig): TemplateResult | typeof nothing {
    const point = carPoint(joe, car.id);
    if (!point) {
      return nothing;
    }
    const to: Route = { tab: "devices", section: "car", id: "point", sub: point.id };
    return html`<p class="plugged">
      <ha-icon icon="mdi:ev-station"></ha-icon>
      <span>${t("car.plugged_at", { point: point.name })}</span>
      <a class="mini-btn quiet" href=${href(this.prefix, to)} @click=${onLink(to)}>${t("car.open_point")}</a>
    </p>`;
  }

  /** Tomorrow's trips and what is missing (as the plan worked it out); a distance can be corrected. */
  private trips(t: Translate, joe: JoeState, car: CarConfig): TemplateResult {
    const need = planCar(joe, car.id);
    if (!need) {
      return html`<p class="muted">${t("car.trips.none")}</p>`;
    }
    const at = need.point ? joe.plan?.actions?.find((a) => a.id === need.point) : undefined;
    const action: PlanAction = at?.need
      ? at
      : {
          id: car.id,
          name: car.name,
          kind: "switch",
          run: false,
          manual: false,
          reasons: [],
          start: "",
          end: "",
          power_kw: null,
          energy_kwh: 0,
          priority: 1,
          need,
        };
    return html`<joe-car-need .hass=${this.hass} .t=${t} .action=${action} .roundTrip=${car.need.round_trip ?? true}></joe-car-need>`;
  }

  /** Which calendars the car reads and whether that works. */
  private calendarLine(t: Translate, joe: JoeState, car: CarConfig): TemplateResult {
    const need = car.need;
    const source = need.source ?? "ha";
    let name = "";
    let status: "ok" | "warn" | "none" = "none";
    let when: string | null = null;
    // Charging by need also reads the calendars of the persons chosen for the car.
    const persons = joe.config.persons.filter((p) => p.calendars.length && (need.persons == null || need.persons.includes(p.id)));
    if (source === "ha" && (need.calendars?.length || persons.length)) {
      name = [
        ...(need.calendars ?? []).map((c) => entityName(this.hass!, c)),
        ...(persons.length ? [t("devices.car.of_persons", { names: persons.map((p) => p.name).join(", ") })] : []),
      ].join(" · ");
      status = "ok";
    } else if (source === "mailbox" && need.mailbox?.address) {
      const found = joe.mailbox?.[car.id];
      name = need.mailbox.address;
      status = found?.state === "ok" ? "ok" : "warn";
      when = found?.checked ?? null;
    } else if (source === "account" && need.account?.address) {
      const found = joe.accounts?.[car.id];
      name = need.account.address;
      status = found?.state === "ok" ? "ok" : "warn";
      when = found?.checked ?? null;
    }
    const to = carRoute(car.id, "calendars");
    return html`<div class="car-cal" data-tipped>
      <ha-icon icon="mdi:calendar-month-outline"></ha-icon>
      <span class="grow">
        ${status === "none"
          ? html`<b>${t("devices.car.no_calendar")}</b>`
          : html`<b>${name}</b>
              <small>
                ${t(status === "ok" ? "devices.car.calendar_ok" : "devices.car.calendar_problem")}
                ${when
                  ? t("devices.car.checked", {
                      when: new Date(when).toLocaleString(t.lang, { weekday: "short", hour: "2-digit", minute: "2-digit" }),
                    })
                  : nothing}
              </small>`}
      </span>
      <a class="mini-btn ${status === "none" ? "go" : ""}" href=${href(this.prefix, to)} @click=${onLink(to, { replace: true })}>
        ${t(status === "none" ? "devices.car.connect" : "devices.car.change")}
      </a>
      ${tip(t, "car_calendar_card")}
    </div>`;
  }
}

define("joe-car-device", JoeCarDevice);
