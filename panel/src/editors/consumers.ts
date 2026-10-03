import { LitElement, css, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { tip } from "../components/tip";
import { saveConfig, sourceOf } from "../config";
import { define } from "../define";
import { formatState } from "../entities";
import type { Translate } from "../i18n";
import { shared } from "../styles/shared";
import { CONSUMER_KINDS, type ConsumerConfig, type ConsumerKind, type HomeAssistant, type JoeConfig } from "../types";
import { sourceChip } from "../components/bits";

/** Devices from the Energy dashboard and what kind each one is. Saved right away. */
export class JoeConsumers extends LitElement {
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
      .empty {
        color: var(--joe-muted);
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
      ${list.length
        ? html`<ul>
            ${list.map((consumer) => this.renderConsumer(t, hass, config, consumer))}
          </ul>`
        : html`<p class="empty">${t("consumers.empty")}</p>`}
    </div>`;
  }

  private renderConsumer(t: Translate, hass: HomeAssistant, config: JoeConfig, consumer: ConsumerConfig) {
    const live = consumer.power_entity ? formatState(hass, consumer.power_entity, t.lang) : "";
    return html`<li>
      <div>
        <b>${consumer.name}</b>
        <small>${sourceChip(t, sourceOf(config, `consumers[${consumer.id}].kind`))}${live}</small>
      </div>
      <select
        class="input"
        aria-label=${t("consumers.kind_of", { name: consumer.name })}
        .value=${consumer.kind}
        @change=${(ev: Event) => this.setKind(consumer, (ev.target as HTMLSelectElement).value as ConsumerKind)}
      >
        ${CONSUMER_KINDS.map(
          (kind) => html`<option value=${kind} ?selected=${kind === consumer.kind}>${t(`kind.${kind}`)}</option>`,
        )}
      </select>
    </li>`;
  }

  private setKind(consumer: ConsumerConfig, kind: ConsumerKind): void {
    if (kind !== consumer.kind) {
      saveConfig(this, { consumers: { [consumer.id]: { kind } } });
    }
  }
}

define("joe-consumers", JoeConsumers);
