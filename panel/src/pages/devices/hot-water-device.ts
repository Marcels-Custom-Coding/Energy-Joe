import { html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { actionPageStyles, setupBlock } from "../../components/action-page";
import "../../components/action-steer";
import { actionText } from "../../components/action-steer";
import { define } from "../../define";
import type { DeviceEntry } from "../../device-model";
import { hotWaterLearned, learnedRows, learnedStyles } from "../../learned-view";
import type { Route } from "../../router";
import { shared } from "../../styles/shared";
import { deviceFrame, frameFromEntry, frameStyles } from "./device-frame";
import { consumerFields, consumerStyles } from "./other-list";
import { DeviceSection } from "./section-base";

/**
 * One hot water heater under Geräte › Warmwasser: the temperature in the
 * head, "Heute Nacht", how Joe switches it (a switch, or a target with its
 * sensor, comfort, maximum, buffer and lead), "Automatisch bei schwacher
 * Prognose", the meter, the learned heating and loss, and the log.
 */
export class JoeHotWaterDevice extends DeviceSection {
  @property({ attribute: false }) entry?: DeviceEntry;

  static styles = [shared, frameStyles, learnedStyles, consumerStyles, actionPageStyles];

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
          ? setupBlock(
              t,
              this.prefix,
              "hot_water",
              consumer.id,
              t("devices.hot_water.lonely"),
              t("devices.hot_water.set_up"),
              "devices_lonely_hot_water",
            )
          : undefined,
        power,
      });
    }
    return deviceFrame(this.ctx, {
      ...base,
      why: actionText(t, joe, action),
      now: html`<joe-action-tonight .hass=${hass} .t=${t} .state=${joe} .action=${action}></joe-action-tonight>`,
      steer: html`<joe-action-steer
        .hass=${hass}
        .t=${t}
        .state=${joe}
        .discovery=${this.discovery}
        .prefix=${this.prefix}
        .action=${action}
        .section=${"hot_water"}
      ></joe-action-steer>`,
      power,
      learned: action.kind === "target" ? learnedRows([hotWaterLearned(t, joe.config.learned, action)]) : undefined,
      learnedArea: "hot_water",
      tips: { steer: "device_steer" },
      removeTitle: t("devices.page.delete"),
      remove: html`<joe-action-delete
        .t=${t}
        .config=${joe.config}
        .action=${action}
        .leave=${{ tab: "devices", section: "hot_water" } satisfies Route}
      ></joe-action-delete>`,
    });
  }
}

define("joe-hot-water-device", JoeHotWaterDevice);
