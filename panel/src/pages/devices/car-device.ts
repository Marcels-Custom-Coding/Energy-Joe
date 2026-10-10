import { css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { actionPageStyles, setupBlock, subHead } from "../../components/action-page";
import "../../components/action-steer";
import { actionText } from "../../components/action-steer";
import "../../components/car-charge";
import "../../components/car-need";
import { tip } from "../../components/tip";
import { define } from "../../define";
import type { DeviceEntry } from "../../device-model";
import { entityName } from "../../entities";
import type { Translate } from "../../i18n";
import { carLearned, learnedRows, learnedStyles } from "../../learned-view";
import { href, onLink, revealAnchor, type Route } from "../../router";
import { shared } from "../../styles/shared";
import type { ActionConfig, JoeState } from "../../types";
import { deviceFrame, frameFromEntry, frameStyles } from "./device-frame";
import { consumerFields, consumerStyles } from "./other-list";
import { DeviceSection } from "./section-base";

/**
 * One car under Geräte › Auto & Laden: level and range in the head, charge
 * now or tonight, tomorrow's trips, charging by need, the car's appointments
 * (/devices/car/<id>/calendars jumps there), the meter, what Joe learned and
 * the log. A meter without its night action offers "Laden einrichten".
 */
export class JoeCarDevice extends DeviceSection {
  @property({ attribute: false }) entry?: DeviceEntry;
  /** "calendars": scroll to the appointments. */
  @property({ attribute: false }) sub?: string;

  private revealed = "";

  static styles = [
    shared,
    frameStyles,
    learnedStyles,
    consumerStyles,
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
    `,
  ];

  protected updated(changed: PropertyValues<this>): void {
    const target = this.sub === "calendars" ? `${this.entry?.id}/calendars` : "";
    if (changed.has("sub") || changed.has("entry")) {
      if (!target) {
        this.revealed = "";
      } else if (this.revealed !== target && revealAnchor(this.renderRoot, "calendars")) {
        this.revealed = target;
      }
    }
  }

  protected render() {
    const { t, hass, state: joe, entry } = this;
    if (!t || !hass || !joe || !entry) {
      return nothing;
    }
    const base = frameFromEntry(this.ctx, entry);
    const consumer = entry.consumer;
    const power = consumer ? consumerFields(this, t, hass, joe.config, consumer) : undefined;
    const action = entry.action;
    if (!action) {
      return deviceFrame(this.ctx, {
        ...base,
        now: consumer
          ? setupBlock(t, this.prefix, "car", consumer.id, t("devices.car.lonely"), t("devices.car.set_up"), "devices_lonely_car")
          : undefined,
        power,
      });
    }
    const planned = joe.plan?.actions?.find((a) => a.id === action.id);
    const need = action.need;
    const steering = action.kind === "switch" && Boolean(need?.soc_entity || need?.range_entity);
    const props = { hass, t, state: joe, discovery: this.discovery, prefix: this.prefix, action };
    return deviceFrame(this.ctx, {
      ...base,
      why: actionText(t, joe, action),
      now: html`${need?.enabled ? this.calendarLine(t, joe, action) : nothing}
        ${planned?.need
          ? html`<joe-car-need .hass=${hass} .t=${t} .action=${planned} .roundTrip=${need?.round_trip ?? true}></joe-car-need>`
          : nothing}
        ${steering
          ? html`<joe-car-charge
              .hass=${hass}
              .t=${t}
              .state=${joe}
              .action=${action}
              ?flush=${!need?.enabled && !planned?.need}
            ></joe-car-charge>`
          : html`<joe-action-tonight .hass=${hass} .t=${t} .state=${joe} .action=${action}></joe-action-tonight>`}`,
      steer: html`<joe-action-steer
          .hass=${props.hass}
          .t=${t}
          .state=${joe}
          .discovery=${props.discovery}
          .prefix=${props.prefix}
          .action=${action}
          .section=${"car"}
        ></joe-action-steer>
        ${subHead(t("devices.car.terms"), "calendars")}
        ${need?.enabled
          ? html`<joe-action-steer
              .hass=${hass}
              .t=${t}
              .state=${joe}
              .discovery=${this.discovery}
              .prefix=${this.prefix}
              .action=${action}
              .section=${"calendars"}
            ></joe-action-steer>`
          : html`<p class="muted">${t("devices.car.terms_off")}</p>`}`,
      power,
      learned: action.kind === "switch" ? learnedRows([carLearned(t, joe.config.learned, action)]) : undefined,
      learnedArea: "car",
      tips: { steer: "device_steer" },
      removeTitle: t("devices.page.delete"),
      remove: html`<joe-action-delete
        .t=${t}
        .config=${joe.config}
        .action=${action}
        .leave=${{ tab: "devices", section: "car" } satisfies Route}
      ></joe-action-delete>`,
    });
  }

  /** Which calendars the car reads and whether that works; the button jumps to the appointments below. */
  private calendarLine(t: Translate, joe: JoeState, action: ActionConfig): TemplateResult {
    const need = action.need;
    const source = need?.enabled ? (need.source ?? "ha") : null;
    let name = "";
    let state: "ok" | "warn" | "none" = "none";
    let when: string | null = null;
    // Charging by need also reads the calendars of the persons chosen for the car.
    const persons = need?.enabled
      ? joe.config.persons.filter((p) => p.calendars.length && (need.persons == null || need.persons.includes(p.id)))
      : [];
    if (source === "ha" && (need?.calendars?.length || persons.length)) {
      name = [
        ...(need?.calendars ?? []).map((c) => entityName(this.hass!, c)),
        ...(persons.length ? [t("devices.car.of_persons", { names: persons.map((p) => p.name).join(", ") })] : []),
      ].join(" · ");
      state = "ok";
    } else if (source === "mailbox" && need?.mailbox?.address) {
      const status = joe.mailbox?.[action.id];
      name = need.mailbox.address;
      state = status?.state === "ok" ? "ok" : "warn";
      when = status?.checked ?? null;
    } else if (source === "account" && need?.account?.address) {
      const status = joe.accounts?.[action.id];
      name = need.account.address;
      state = status?.state === "ok" ? "ok" : "warn";
      when = status?.checked ?? null;
    }
    const to: Route = { tab: "devices", section: "car", id: this.entry!.id, sub: "calendars" };
    return html`<div class="car-cal" data-tipped>
      <ha-icon icon="mdi:calendar-month-outline"></ha-icon>
      <span class="grow">
        ${state === "none"
          ? html`<b>${t("devices.car.no_calendar")}</b>`
          : html`<b>${name}</b>
              <small>
                ${t(state === "ok" ? "devices.car.calendar_ok" : "devices.car.calendar_problem")}
                ${when
                  ? t("devices.car.checked", {
                      when: new Date(when).toLocaleString(t.lang, { weekday: "short", hour: "2-digit", minute: "2-digit" }),
                    })
                  : nothing}
              </small>`}
      </span>
      <a class="mini-btn ${state === "none" ? "go" : ""}" href=${href(this.prefix, to)} @click=${this.jumpToCalendars(to)}>
        ${t(state === "none" ? "devices.car.connect" : "devices.car.change")}
      </a>
      ${tip(t, "car_calendar_card")}
    </div>`;
  }

  /** On the same page the jump only scrolls; the address follows without an extra step back. */
  private jumpToCalendars(to: Route): (ev: MouseEvent) => void {
    const go = onLink(to, { replace: true });
    return (ev: MouseEvent) => {
      go(ev);
      if (ev.defaultPrevented) {
        this.revealed = "";
        revealAnchor(this.renderRoot, "calendars");
      }
    };
  }
}

define("joe-car-device", JoeCarDevice);
