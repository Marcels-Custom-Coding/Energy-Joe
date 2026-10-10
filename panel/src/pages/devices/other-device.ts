import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { actionPageStyles } from "../../components/action-page";
import "../../components/action-steer";
import { actionText } from "../../components/action-steer";
import { define } from "../../define";
import { addRoute, type DeviceEntry } from "../../device-model";
import { groupLearned, learnedRows, learnedStyles } from "../../learned-view";
import { href, onLink, type Route } from "../../router";
import { shared } from "../../styles/shared";
import { deviceFrame, frameFromEntry, frameStyles } from "./device-frame";
import { consumerFields, consumerStyles } from "./other-list";
import { DeviceSection } from "./section-base";

/**
 * One device under Geräte › Weitere Geräte: a meter from the Energy dashboard
 * (what it is, when it runs, what Joe learned) and, if Joe switches it on at
 * night, "Heute Nacht" and "Nachts einschalten". A night action without a
 * meter has a page of its own (id "action-<actionId>", "ohne Zähler").
 */
export class JoeOtherDevice extends DeviceSection {
  @property({ attribute: false }) entry?: DeviceEntry;

  static styles = [shared, frameStyles, learnedStyles, consumerStyles, actionPageStyles];

  protected render() {
    const { t, hass, state: joe, entry } = this;
    if (!t || !hass || !joe || !entry) {
      return nothing;
    }
    const base = frameFromEntry(this.ctx, entry);
    const consumer = entry.consumer;
    const action = entry.action;
    const learns = consumer && consumer.energy_entity && consumer.kind !== "submeter";
    const learned = learns ? learnedRows([groupLearned(t, joe.config.learned, consumer)]) : undefined;
    // The meter's page stays when its night action goes; a page of the action alone does not.
    const own = Boolean(action && consumer && entry.id === consumer.id);
    const offer = addRoute("night", consumer?.id);
    return deviceFrame(this.ctx, {
      ...base,
      why: action ? actionText(t, joe, action) : base.why,
      now: action ? html`<joe-action-tonight .hass=${hass} .t=${t} .state=${joe} .action=${action}></joe-action-tonight>` : undefined,
      steer: action
        ? html`<joe-action-steer
              .hass=${hass}
              .t=${t}
              .state=${joe}
              .discovery=${this.discovery}
              .prefix=${this.prefix}
              .action=${action}
              .section=${"night"}
            ></joe-action-steer>`
        : consumer && consumer.kind !== "submeter"
          ? html`<p class="muted">${t("devices.other.night_offer")}</p>
              <a class="btn btn-secondary add-link" href=${href(this.prefix, offer)} @click=${onLink(offer, { sheet: true })}
                >${t("devices.other.night_add")}</a
              >`
          : undefined,
      power: consumer
        ? consumerFields(this, t, hass, joe.config, consumer)
        : entry.noMeter
          ? html`<p class="muted">${t("devices.other.no_meter")}</p>`
          : undefined,
      learned,
      learnedArea: "devices",
      tips: { steer: "device_steer" },
      removeTitle: t("devices.page.delete"),
      remove: action
        ? html`<joe-action-delete
            .t=${t}
            .config=${joe.config}
            .action=${action}
            .leave=${own ? undefined : ({ tab: "devices", section: "other" } satisfies Route)}
          ></joe-action-delete>`
        : undefined,
    });
  }
}

define("joe-other-device", JoeOtherDevice);
