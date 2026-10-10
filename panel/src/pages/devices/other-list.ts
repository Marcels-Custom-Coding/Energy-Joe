import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { sourceChip } from "../../components/bits";
import { tip } from "../../components/tip";
import { saveConfig, sourceOf } from "../../config";
import { define } from "../../define";
import { entityName, formatState } from "../../entities";
import type { Translate } from "../../i18n";
import { shared } from "../../styles/shared";
import {
  CONSUMER_KINDS,
  type ConsumerConfig,
  type ConsumerKind,
  type ConsumerRuns,
  type HomeAssistant,
  type JoeConfig,
} from "../../types";

// What a meter from the Energy dashboard is and when it runs ("Was ist das?",
// "Wann läuft es?"): on the Weitere-Geräte list, in the Strom block of every
// device page with a meter, and in the first setup (<joe-consumer-list>).
// Saved right away; the kind moves the device to its group.

// A wallbox: never from the home battery unless the user says it is.
const EV_RUNS = ["auto", "always"] as const;
// Everything else: as needed (counts for the battery), or only on surplus / cheap power.
const OTHER_RUNS = ["auto", "surplus", "cheap"] as const;

/** Kinds that have a group of their own under Geräte. */
export const MOVING_KINDS: readonly ConsumerKind[] = ["climate", "ev", "hot_water"];

export function setConsumerKind(from: HTMLElement, consumer: ConsumerConfig, kind: ConsumerKind): Promise<boolean> {
  return kind === consumer.kind ? Promise.resolve(false) : saveConfig(from, { consumers: { [consumer.id]: { kind } } });
}

export function setConsumerRuns(from: HTMLElement, consumer: ConsumerConfig, runs: ConsumerRuns): Promise<boolean> {
  return runs === (consumer.runs ?? "auto") ? Promise.resolve(false) : saveConfig(from, { consumers: { [consumer.id]: { runs } } });
}

/** The select "Was ist das für ein Gerät?" (label in aria-label). */
export function kindSelect(t: Translate, consumer: ConsumerConfig, change: (kind: ConsumerKind) => void): TemplateResult {
  return html`<select
    class="input"
    aria-label=${t("consumers.kind_of", { name: consumer.name })}
    .value=${consumer.kind}
    @change=${(ev: Event) => change((ev.target as HTMLSelectElement).value as ConsumerKind)}
  >
    ${CONSUMER_KINDS.map((kind) => html`<option value=${kind} ?selected=${kind === consumer.kind}>${t(`kind.${kind}`)}</option>`)}
  </select>`;
}

/** The select "Wann läuft es?"; nothing for a meter of other devices. */
export function runsSelect(t: Translate, consumer: ConsumerConfig, change: (runs: ConsumerRuns) => void): TemplateResult | typeof nothing {
  if (consumer.kind === "submeter") {
    return nothing;
  }
  const runs = consumer.runs ?? "auto";
  return html`<select
    class="input"
    aria-label=${t("consumers.runs_of", { name: consumer.name })}
    .value=${runs}
    @change=${(ev: Event) => change((ev.target as HTMLSelectElement).value as ConsumerRuns)}
  >
    ${consumer.kind === "ev"
      ? EV_RUNS.map((r) => html`<option value=${r} ?selected=${r === runs}>${t(`runs.ev.${r}`)}</option>`)
      : OTHER_RUNS.map((r) => html`<option value=${r} ?selected=${r === runs}>${t(`runs.${r}`)}</option>`)}
  </select>`;
}

/**
 * The Strom block of a device page: the meter with its live value, what it
 * is and when it runs, each with its tooltip.
 */
export function consumerFields(
  from: HTMLElement,
  t: Translate,
  hass: HomeAssistant,
  config: JoeConfig,
  consumer: ConsumerConfig,
): TemplateResult {
  const meter = consumer.power_entity ?? consumer.energy_entity;
  return html`${meter
      ? html`<div class="meter-line">
          <span class="meter-label">${t("devices.meter")}</span>
          <span class="meter-value"><b>${entityName(hass, meter)}</b> · ${formatState(hass, meter, t.lang)}</span>
          ${sourceChip(t, sourceOf(config, `consumers[${consumer.id}].kind`))}
        </div>`
      : nothing}
    <div class="field" data-tipped>
      <div class="field-label">${t("consumers.kind")} ${tip(t, "f_consumer_kind")}</div>
      ${kindSelect(t, consumer, (kind) => void setConsumerKind(from, consumer, kind))}
    </div>
    ${consumer.kind === "submeter"
      ? nothing
      : html`<div class="field" data-tipped>
          <div class="field-label">${t("consumers.runs")} ${tip(t, "f_consumer_runs")}</div>
          ${runsSelect(t, consumer, (runs) => void setConsumerRuns(from, consumer, runs))}
        </div>`}`;
}

export const consumerStyles = css`
  .meter-line {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px 10px;
    padding: 8px 12px;
    border-radius: 10px;
    background: var(--joe-surface-2);
  }
  .meter-label {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--joe-muted);
  }
  .meter-value {
    flex: 1 1 160px;
    min-width: 0;
    overflow-wrap: anywhere;
    font-variant-numeric: tabular-nums;
  }
  .meter-value b {
    font-weight: 600;
  }
`;

/**
 * All meters as one list, saved right away: what kind each one is and when
 * it runs. The first setup shows it in a sheet; Geräte › Weitere Geräte has
 * the same selects on its cards.
 */
export class JoeConsumerList extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) config?: JoeConfig;

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      ul {
        list-style: none;
        margin: 12px 0 0;
        padding: 0;
        display: grid;
        gap: 6px;
      }
      li {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(150px, 220px);
        align-items: center;
        gap: 8px 12px;
        padding: 10px 12px;
        border-radius: 12px;
        background: var(--joe-surface);
        box-shadow: inset 0 0 0 1px var(--joe-line);
      }
      b {
        display: block;
        font-weight: 600;
        overflow-wrap: anywhere;
      }
      small {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        color: var(--joe-muted);
        font-size: 12.5px;
        margin-top: 2px;
      }
      .head {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 700;
      }
      .head.sub {
        margin-top: 6px;
        font-weight: 600;
        color: var(--joe-ink-2);
      }
      .empty {
        color: var(--joe-muted);
      }
      .selects {
        display: grid;
        gap: 6px;
      }
      @media (max-width: 480px) {
        li {
          grid-template-columns: 1fr;
        }
      }
    `,
  ];

  protected render() {
    const { t, hass, config } = this;
    if (!t || !hass || !config) {
      return nothing;
    }
    const list = [...config.consumers].sort(
      (a, b) => Number(a.kind === "submeter") - Number(b.kind === "submeter") || a.name.localeCompare(b.name, t.lang),
    );
    return html`<div data-tipped>
      <div class="head">${t("consumers.kind")} ${tip(t, "f_consumer_kind")}</div>
      <div class="head sub">${t("consumers.runs")} ${tip(t, "f_consumer_runs")}</div>
      ${list.length
        ? html`<ul>
            ${list.map((consumer) => {
              const live = consumer.power_entity ? formatState(hass, consumer.power_entity, t.lang) : "";
              return html`<li>
                <div>
                  <b>${consumer.name}</b>
                  <small>${sourceChip(t, sourceOf(config, `consumers[${consumer.id}].kind`))}${live}</small>
                </div>
                <div class="selects">
                  ${kindSelect(t, consumer, (kind) => void setConsumerKind(this, consumer, kind))}
                  ${runsSelect(t, consumer, (runs) => void setConsumerRuns(this, consumer, runs))}
                </div>
              </li>`;
            })}
          </ul>`
        : html`<p class="empty">${t("consumers.empty")}</p>`}
    </div>`;
  }
}

define("joe-consumer-list", JoeConsumerList);
