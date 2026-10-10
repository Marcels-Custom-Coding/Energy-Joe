import { html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { actionPageStyles, movedPlace, movedRow } from "../../components/action-page";
import "../../components/action-steer";
import { deviceCard, entryCard } from "../../components/device-card";
import { tip } from "../../components/tip";
import { define } from "../../define";
import { findDevice, type DeviceEntry } from "../../device-model";
import type { Translate } from "../../i18n";
import { shared } from "../../styles/shared";
import type { ConsumerConfig, JoeState } from "../../types";
import { addLink, frameStyles, groupHead, notFound } from "./device-frame";
import "./other-device";
import { consumerStyles, kindSelect, MOVING_KINDS, runsSelect, setConsumerKind, setConsumerRuns } from "./other-list";
import { DeviceSection } from "./section-base";

/**
 * Geräte › Weitere Geräte: every meter from the Energy dashboard that is no
 * car, hot water or climate device, with "Was ist das?" and "Wann läuft es?"
 * right on its card (saved at once). Choosing E-Auto, Warmwasser or
 * Klimagerät moves the device to its group; its row then says where it went.
 * Night actions without a meter follow under "ohne Zähler".
 */
export class JoeOtherGroup extends DeviceSection {
  @property({ attribute: false }) device?: string;
  @property({ attribute: false }) sub?: string;

  /** Meters whose kind moved them away while this page was open (id → name). */
  @state() private moved = new Map<string, string>();

  static styles = [shared, frameStyles, consumerStyles, actionPageStyles];

  protected render() {
    const { t, state: joe } = this;
    if (!t || !joe) {
      return nothing;
    }
    const entry = findDevice(this.devices, "other", this.device);
    if (entry) {
      return html`<joe-other-device
        .hass=${this.hass}
        .t=${t}
        .state=${joe}
        .route=${this.route}
        .prefix=${this.prefix}
        .discovery=${this.discovery}
        .info=${this.info}
        .checks=${this.checks}
        .climateFound=${this.climateFound}
        .devices=${this.devices}
        .entry=${entry}
      ></joe-other-device>`;
    }
    const gone = this.device ? movedPlace(this.devices, this.device, "other") : undefined;
    return html`<div class="wrap">
      ${groupHead(t, t("nav.devices.other"), t("devices.other.lead"), this.devices.some((d) => d.group === "other"))}
      ${this.device === undefined ? nothing : gone ? movedRow(t, this.prefix, gone.name, gone) : notFound(t)}
      ${this.renderList(t, joe)}
      <div class="group-actions">${addLink(t, this.prefix, "night", t("devices.group_add.night"))}</div>
    </div>`;
  }

  private renderList(t: Translate, joe: JoeState): TemplateResult {
    const entries = this.devices.filter((d) => d.group === "other");
    const order = new Map(joe.config.consumers.map((c, i) => [c.id, i]));
    const meters = entries.filter((d) => order.has(d.id));
    const extra = entries.filter((d) => !order.has(d.id) && !d.noMeter);
    const lonely = entries.filter((d) => d.noMeter);
    // A moved meter keeps its place in the list as a row pointing to its new page.
    const rows: { at: number; html: TemplateResult }[] = meters.map((d) => ({ at: order.get(d.id)!, html: this.card(t, joe, d) }));
    for (const [id, name] of this.moved) {
      const place = entries.some((d) => d.id === id) ? undefined : movedPlace(this.devices, id, "other");
      if (place) rows.push({ at: order.get(id) ?? Infinity, html: movedRow(t, this.prefix, name, place) });
    }
    rows.sort((a, b) => a.at - b.at);
    if (!rows.length && !extra.length && !lonely.length) {
      return html`<p class="muted">${t("devices.other.empty")}</p>`;
    }
    return html`${rows.length || extra.length
        ? html`<section data-tipped>
            <div class="list-head">
              <span>${t("consumers.kind")} ${tip(t, "f_consumer_kind")}</span>
              <span>${t("consumers.runs")} ${tip(t, "f_consumer_runs")}</span>
            </div>
            <div class="dcards">${rows.map((r) => r.html)} ${extra.map((d) => this.card(t, joe, d))}</div>
          </section>`
        : nothing}
      ${lonely.length
        ? html`<h3 class="sub-group">${t("devices.no_meter_group")}</h3>
            <div class="dcards">${lonely.map((d) => this.card(t, joe, d))}</div>`
        : nothing}`;
  }

  /** A device card: a meter gets its two selects; every card with a night action gets "Heute Nacht". */
  private card(t: Translate, joe: JoeState, entry: DeviceEntry): TemplateResult {
    const consumer = entry.id === entry.consumer?.id ? entry.consumer : undefined;
    const tonight = entry.action
      ? html`<joe-action-tonight .hass=${this.hass} .t=${t} .state=${joe} .action=${entry.action}></joe-action-tonight>`
      : nothing;
    const quick = consumer
      ? html`${kindSelect(t, consumer, (kind) => this.setKind(consumer, kind))}
        ${runsSelect(t, consumer, (runs) => void setConsumerRuns(this, consumer, runs))} ${tonight}`
      : entry.action
        ? tonight
        : undefined;
    return deviceCard(t, this.prefix, entryCard(t, this.hass, joe, entry, { quick: quick as TemplateResult | undefined }));
  }

  private async setKind(consumer: ConsumerConfig, kind: ConsumerConfig["kind"]): Promise<void> {
    const ok = await setConsumerKind(this, consumer, kind);
    if (!ok) return;
    const moved = new Map(this.moved);
    if (MOVING_KINDS.includes(kind)) {
      moved.set(consumer.id, consumer.name);
    } else {
      moved.delete(consumer.id);
    }
    this.moved = moved;
  }
}

define("joe-other-group", JoeOtherGroup);
