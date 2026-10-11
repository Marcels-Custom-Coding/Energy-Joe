import { css, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { actionPageStyles, setupBlock, subHead } from "../../components/action-page";
import "../../components/action-steer";
import { actionText } from "../../components/action-steer";
import { tip } from "../../components/tip";
import { allowedCars, carById, carRoute, pointStatus, pointText } from "../../cars";
import { define } from "../../define";
import type { DeviceEntry } from "../../device-model";
import type { Translate } from "../../i18n";
import { href, onLink, type Route } from "../../router";
import { shared } from "../../styles/shared";
import type { ActionConfig, JoeState } from "../../types";
import { deviceFrame, frameFromEntry, frameStyles } from "./device-frame";
import { consumerFields, consumerStyles } from "./other-list";
import { DeviceSection } from "./section-base";

/**
 * A charge point under Geräte › Auto & Laden (/devices/car/point/<action id>):
 * which car is plugged in and how Joe knows (or the question which one it
 * is), "Heute Nacht", what Joe switches, which cars may charge here and what
 * he does with a car he cannot tell, the meter and the log.
 */
export class JoeCarPoint extends DeviceSection {
  @property({ attribute: false }) entry?: DeviceEntry;

  @state() private busy = false;
  @state() private failed = false;

  static styles = [
    shared,
    frameStyles,
    consumerStyles,
    actionPageStyles,
    css`
      .which {
        display: grid;
        gap: 10px;
        margin: 0 0 12px;
        padding: 12px;
        border-radius: 12px;
        background: var(--joe-surface-2);
      }
      .which.ask {
        background: var(--joe-amber-soft);
      }
      .which p {
        margin: 0;
      }
      .which p.q {
        font-weight: 700;
      }
      .choices {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .choices .mini-btn {
        min-height: 44px;
      }
      .car-link {
        min-height: 44px;
        text-decoration: none;
      }
      .bad {
        margin: 0;
        color: var(--joe-warn, var(--joe-crit));
      }
    `,
  ];

  protected render() {
    const { t, hass, state: joe, entry } = this;
    const action = entry?.action;
    if (!t || !hass || !joe || !entry || !action) {
      return nothing;
    }
    const base = frameFromEntry(this.ctx, entry);
    const consumer = entry.consumer;
    return deviceFrame(this.ctx, {
      ...base,
      live: pointText(t, joe, action),
      why: actionText(t, joe, action),
      now: html`${this.which(t, joe, action)}
        <joe-action-tonight .hass=${hass} .t=${t} .state=${joe} .action=${action}></joe-action-tonight>`,
      steer: html`<joe-action-steer
        .hass=${hass}
        .t=${t}
        .state=${joe}
        .discovery=${this.discovery}
        .prefix=${this.prefix}
        .action=${action}
        .section=${"point"}
      ></joe-action-steer>`,
      power: consumer ? consumerFields(this, t, hass, joe.config, consumer) : undefined,
      tips: { now: "point_now", steer: "point_steer" },
      removeTitle: t("devices.page.delete"),
      remove: html`<joe-action-delete
        .t=${t}
        .config=${joe.config}
        .action=${action}
        .leave=${{ tab: "devices", section: "car" } satisfies Route}
      ></joe-action-delete>`,
    });
  }

  /** Which car is plugged in, and the buttons to tell Joe (or correct him). */
  private which(t: Translate, joe: JoeState, action: ActionConfig): TemplateResult {
    const status = pointStatus(joe, action.id);
    const cars = allowedCars(joe.config, action);
    const answered = joe.cars?.answers?.[action.id];
    const asking = Boolean(status?.ask);
    const car = carById(joe.config, status?.car);
    const to = car ? carRoute(car.id) : undefined;
    const choose = (value: string | null) => this.answer(action.id, value);
    return html`<div class="which ${asking ? "ask" : ""}" data-tipped>
      ${asking
        ? html`<p class="q">${t("point.ask", { point: action.name })} ${tip(t, "point_which")}</p>
            <p>${t("point.ask.text")}</p>`
        : html`<p>${pointText(t, joe, action)} ${tip(t, "point_which")}</p>`}
      ${to && car ? html`<a class="mini-btn quiet car-link" href=${href(this.prefix, to)} @click=${onLink(to)}>${t("point.open_car", { car: car.name })}</a>` : nothing}
      ${cars.length && status && status.state !== "empty" && status.state !== "free"
        ? html`${asking ? nothing : subHead(t("point.other_car"))}
            <div class="choices" role="group" aria-label=${t("point.ask", { point: action.name })}>
              ${cars.map(
                (c) => html`<button
                  type="button"
                  class="mini-btn ${status.car === c.id ? "go" : ""}"
                  aria-pressed=${String(status.car === c.id)}
                  ?disabled=${this.busy}
                  @click=${() => choose(c.id)}
                >
                  <ha-icon icon="mdi:car-electric"></ha-icon>${c.name}
                </button>`,
              )}
              <button
                type="button"
                class="mini-btn ${status.state === "guest" ? "go" : "quiet"}"
                aria-pressed=${String(status.state === "guest")}
                ?disabled=${this.busy}
                @click=${() => choose("guest")}
              >
                <ha-icon icon="mdi:account-arrow-right-outline"></ha-icon>${t("point.guest")}
              </button>
              ${answered
                ? html`<button type="button" class="mini-btn quiet" ?disabled=${this.busy} @click=${() => choose(null)}>
                    ${t("point.forget")}
                  </button>`
                : nothing}
            </div>`
        : nothing}
      ${this.failed ? html`<p class="bad" role="status">${t("error.action")}</p>` : nothing}
    </div>`;
  }

  private async answer(point: string, car: string | null): Promise<void> {
    this.busy = true;
    this.failed = false;
    try {
      await this.hass?.callWS({ type: "energy_joe/car/answer", point, car });
    } catch {
      this.failed = true;
    }
    this.busy = false;
  }
}

/** An E-Auto meter from the Energy dashboard without a wallbox Joe switches: "Laden einrichten". */
export class JoeCarMeter extends DeviceSection {
  @property({ attribute: false }) entry?: DeviceEntry;

  static styles = [shared, frameStyles, consumerStyles, actionPageStyles];

  protected render() {
    const { t, hass, state: joe, entry } = this;
    const consumer = entry?.consumer;
    if (!t || !hass || !joe || !entry || !consumer) {
      return nothing;
    }
    return deviceFrame(this.ctx, {
      ...frameFromEntry(this.ctx, entry),
      now: setupBlock(t, this.prefix, "wallbox", consumer.id, t("devices.car.lonely"), t("devices.car.set_up"), "devices_lonely_car"),
      power: consumerFields(this, t, hass, joe.config, consumer),
    });
  }
}

define("joe-car-point", JoeCarPoint);
define("joe-car-meter", JoeCarMeter);
