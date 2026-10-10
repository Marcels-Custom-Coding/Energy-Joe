import { LitElement, css, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import "../../components/car-charge";
import { tip } from "../../components/tip";
import { define } from "../../define";
import { actionPlace, deviceRoute } from "../../device-model";
import { guestToggle } from "../../household-helpers";
import type { Translate } from "../../i18n";
import { PANEL, href, onLink } from "../../router";
import { shared } from "../../styles/shared";
import type { ActionConfig, HomeAssistant, JoeState } from "../../types";

/** Cars Joe can charge by hand: a switch with a level or range sensor (like the dashboard card "Auto laden"). */
export function quickCars(joe: JoeState): ActionConfig[] {
  return joe.config.actions.filter((a) => a.kind === "switch" && Boolean(a.need?.soc_entity || a.need?.range_entity));
}

/** Guest mode's switch, once it is set up under Haushalt › Wer ist da. */
export function quickGuest(joe: JoeState): string | undefined {
  const { guest_switch: guest, guest_tracker: tracker } = joe.config.context;
  return guest && tracker ? guest : undefined;
}

/** Whether "Schnell" has anything here. */
export function quickShown(joe: JoeState | undefined): boolean {
  return Boolean(joe && (quickCars(joe).length || quickGuest(joe)));
}

/**
 * "Schnell": shortcuts for the moment, only what exists here. Each car to
 * charge now or tonight (the same block as on its page and the dashboard
 * card), and guest mode on or off. Nothing here sets anything for good.
 */
export class JoeOverviewQuick extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;
  @property({ attribute: false }) prefix = PANEL;

  static styles = [
    shared,
    css`
      :host {
        display: block;
        height: 100%;
      }
      .card {
        height: 100%;
        padding: 18px 20px;
      }
      .head {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .head .eyebrow {
        flex: 1;
        min-width: 0;
      }
      .item {
        margin-top: 12px;
        padding-top: 10px;
        border-top: 1px solid var(--joe-line);
      }
      .head + .item {
        margin-top: 6px;
        border-top: 0;
        padding-top: 0;
      }
      a.name {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-height: 44px;
        font-weight: 700;
        color: inherit;
        text-decoration: none;
      }
      a.name:hover {
        text-decoration: underline;
        text-decoration-color: var(--joe-amber);
        text-underline-offset: 3px;
      }
      a.name ha-icon {
        color: var(--joe-ink-2);
      }
      .guest {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px 10px;
      }
      .guest b {
        font-weight: 700;
      }
      .guest small {
        flex-basis: 100%;
        color: var(--joe-muted);
        font-size: 13px;
      }
    `,
  ];

  protected render() {
    const { t, hass, state: joe } = this;
    if (!t || !hass || !joe || !quickShown(joe)) {
      return nothing;
    }
    const guest = quickGuest(joe);
    const on = guest ? hass.states[guest]?.state === "on" : false;
    const tracker = joe.config.context.guest_tracker;
    return html`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:lightning-bolt-outline"></ha-icon>${t("overview.quick")}</div>
        ${tip(t, "quick")}
      </div>
      ${quickCars(joe).map((car) => {
        const to = deviceRoute(actionPlace(joe.config, car));
        return html`<div class="item">
          <a class="name" href=${href(this.prefix, to)} @click=${onLink(to)}>
            <ha-icon icon="mdi:car-electric"></ha-icon>${car.name}
          </a>
          <joe-car-charge flush .hass=${hass} .t=${t} .state=${joe} .action=${car}></joe-car-charge>
        </div>`;
      })}
      ${guest
        ? html`<div class="item guest" data-tipped>
            <button
              type="button"
              class="switch"
              role="switch"
              aria-checked=${String(on)}
              aria-labelledby="quick-guest"
              @click=${() => guestToggle(hass, guest)}
            ></button>
            <b id="quick-guest">${t("household.guest")}</b>
            ${tip(t, "household_guest")}
            <small>${t(tracker && hass.states[tracker]?.state === "home" ? "household.guest.home" : "household.guest.away")}</small>
          </div>`
        : nothing}
    </section>`;
  }
}

define("joe-overview-quick", JoeOverviewQuick);
