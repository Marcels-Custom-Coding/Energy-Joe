import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { displayTitle, swoosh } from "../components/bits";
import "../components/choice";
import { UNKNOWN, type ChoiceOption } from "../components/choice";
import "../components/pose";
import { tip } from "../components/tip";
import { saveConfig, sourceOf } from "../config";
import { define } from "../define";
import "../editors/household";
import "../editors/tariff-form";
import type { Translate } from "../i18n";
import { shared } from "../styles/shared";
import type { ConsumerKind, Discovery, HomeAssistant, JoeConfig, TariffConfig } from "../types";

const POSES: Record<string, string> = {
  tariff: "plan",
  feed_in: "plug",
  capacity: "night-charge",
  heating: "ask",
  hot_water: "hot-water",
  ev: "ev",
  household: "relax",
};

const HEATING: ConsumerKind[] = ["climate", "heat_pump", "electric_heating"];

/** The questions Joe asks, in order; things he found himself are left out. */
export function questionList(config: JoeConfig): string[] {
  const list: string[] = [];
  const byUser = (path: string) => sourceOf(config, path)?.source === "user";
  const answered = (key: string) => config.answers[key] !== undefined && config.answers[key] !== null;
  const tariff = config.tariff;
  if (tariff.kind === "unknown" || byUser("tariff.kind") || answered("tariff")) {
    list.push("tariff");
  }
  if ((tariff.feed_in_price == null && !tariff.feed_in_entity) || byUser("tariff.feed_in_price") || answered("feed_in")) {
    list.push("feed_in");
  }
  for (const battery of config.batteries) {
    const key = `capacity:${battery.id}`;
    if (
      (battery.capacity_kwh == null && !battery.capacity_entity) ||
      byUser(`batteries[${battery.id}].capacity_kwh`) ||
      answered(key)
    ) {
      list.push(key);
    }
  }
  list.push("heating", "hot_water", "ev", "household");
  return list;
}

/** Joe's questions, one at a time, always with "I don't know". */
export class JoeQuestions extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) config?: JoeConfig;
  @property({ attribute: false }) discovery?: Discovery;

  /** Shows just this one question, without Joe and without moving on (for the settings). */
  @property() single = "";

  @state() private index = 0;

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      .wrap {
        display: grid;
        grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
        gap: 32px;
        align-items: start;
        max-width: 1060px;
        margin: 0 auto;
        padding-block: 12px 32px;
      }
      joe-pose {
        width: 100%;
        max-width: 400px;
        justify-self: center;
        position: sticky;
        top: 96px;
      }
      .display {
        font-size: clamp(34px, 4.6vw, 52px);
      }
      .title-row {
        margin-top: 8px;
      }
      .content {
        margin-top: 18px;
      }
      .follow {
        margin-top: 16px;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 8px;
      }
      .inline {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
      }
      .hint {
        margin: 10px 0 0;
        color: var(--joe-ink-2);
        font-size: 14px;
      }
      @media (max-width: 760px) {
        .wrap {
          grid-template-columns: 1fr;
          gap: 12px;
          padding-block: 4px 24px;
        }
        joe-pose {
          position: static;
          max-width: 190px;
        }
      }
    `,
  ];

  protected render() {
    const { t, config } = this;
    if (!t || !config) {
      return nothing;
    }
    if (this.single) {
      return this.renderQuestion(t, config, this.single);
    }
    const list = questionList(config);
    const index = Math.min(this.index, list.length - 1);
    const id = list[index];
    const last = index === list.length - 1;
    return html`<div class="wrap">
      <joe-pose name=${POSES[id.split(":")[0]] ?? "ask"}></joe-pose>
      <div>
        <div class="eyebrow">${t("ask.count", { n: index + 1, total: list.length })}</div>
        ${this.renderQuestion(t, config, id)}
        <div class="actions" data-notip>
          <button type="button" class="btn btn-primary" @click=${() => this.move(1, list.length)}>
            ${t(last ? "ask.finish" : "onb.next")}
          </button>
          <button type="button" class="btn btn-ghost" @click=${() => this.move(-1, list.length)}>
            ${t("onb.back")}
          </button>
        </div>
      </div>
    </div>`;
  }

  private renderQuestion(t: Translate, config: JoeConfig, id: string): TemplateResult {
    if (id.startsWith("capacity:")) {
      return this.renderCapacity(t, config, id.slice("capacity:".length));
    }
    switch (id) {
      case "tariff":
        return this.question(
          t("q.tariff.title"),
          "q_tariff",
          html`<joe-tariff-form
            .hass=${this.hass}
            .t=${t}
            .tariff=${config.tariff}
            .discovery=${this.discovery}
            asQuestion
            @joe-tariff=${(ev: CustomEvent<Partial<TariffConfig>>) => this.saveTariff(ev.detail)}
          ></joe-tariff-form>`,
        );
      case "feed_in":
        return this.renderFeedIn(t, config);
      case "heating":
        return this.renderHeating(t, config);
      case "hot_water":
        return this.question(
          t("q.hot_water.title"),
          "q_hot_water",
          this.choice(t, "hot_water", [
            { value: "hot_water_heat_pump", label: t("q.hot_water.heat_pump"), icon: "mdi:water-boiler" },
            { value: "electric", label: t("q.hot_water.electric"), icon: "mdi:flash" },
            { value: "heating", label: t("q.hot_water.heating"), icon: "mdi:radiator" },
            { value: "other", label: t("q.hot_water.other"), icon: "mdi:fire" },
          ]),
        );
      case "ev": {
        const wallbox = this.discovery?.wallboxes.find((w) => w.is_car);
        return this.question(
          t("q.ev.title"),
          "q_ev",
          this.choice(t, "ev", [
            {
              value: "yes",
              label: wallbox ? t("q.ev.yes_wallbox", { name: wallbox.name }) : t("q.ev.yes"),
              icon: "mdi:car-electric",
            },
            { value: "no", label: t("q.ev.no"), icon: "mdi:car-off" },
          ]),
        );
      }
      default:
        return this.question(
          t("q.household.title"),
          "q_household",
          html`<joe-household
            .hass=${this.hass}
            .t=${t}
            .config=${config}
            .discovery=${this.discovery}
          ></joe-household>`,
        );
    }
  }

  private question(title: string, tipName: Parameters<typeof tip>[1], content: TemplateResult): TemplateResult {
    const t = this.t!;
    return html`<div data-tipped>
      <div class="title-row">${displayTitle(title, "h2", tip(t, tipName))}</div>
      ${swoosh}
      <div class="content">${content}</div>
    </div>`;
  }

  private choice(t: Translate, key: string, options: ChoiceOption[], multiple = false): TemplateResult {
    const value = this.config?.answers[key];
    const selected = Array.isArray(value) ? (value as string[]) : typeof value === "string" ? [value] : [];
    return html`<joe-choice
      .options=${options}
      .value=${selected}
      ?multiple=${multiple}
      .exclusive=${["none"]}
      idk=${t("ask.idk")}
      @joe-choice=${(ev: CustomEvent<{ value: string[] }>) =>
        saveConfig(this, { answers: { [key]: multiple ? ev.detail.value : (ev.detail.value[0] ?? null) } })}
    ></joe-choice>`;
  }

  private renderHeating(t: Translate, config: JoeConfig): TemplateResult {
    const answer = config.answers.heating;
    const kinds = Array.isArray(answer) ? (answer as string[]) : [];
    const devices = config.consumers.filter((c) => (kinds as string[]).includes(c.kind));
    const anyHeating = kinds.some((kind) => (HEATING as string[]).includes(kind));
    return this.question(
      t("q.heating.title"),
      "q_heating",
      html`${this.choice(
          t,
          "heating",
          [
            { value: "climate", label: t("q.heating.climate"), icon: "mdi:air-conditioner" },
            { value: "heat_pump", label: t("q.heating.heat_pump"), icon: "mdi:heat-pump-outline" },
            { value: "electric_heating", label: t("q.heating.electric"), icon: "mdi:radiator" },
            { value: "none", label: t("q.heating.none") },
          ],
          true,
        )}
        ${anyHeating && config.consumers.length
          ? html`<div class="follow">
              <p class="hint">${devices.length ? t("q.heating.devices") : t("q.heating.no_devices")}</p>
              ${devices.length
                ? html`<div class="chips">
                    ${devices.map((d) => html`<span class="chip learned">${d.name}</span>`)}
                  </div>`
                : nothing}
              <div class="with-tip" style="margin-top:10px">
                <button type="button" class="mini-btn" @click=${() => this.edit("consumers")}>
                  <ha-icon icon="mdi:devices"></ha-icon>${t("q.heating.assign")}
                </button>
                ${tip(t, "f_consumer_kind")}
              </div>
            </div>`
          : nothing}`,
    );
  }

  private renderFeedIn(t: Translate, config: JoeConfig): TemplateResult {
    const price = config.tariff.feed_in_price;
    const unknown = config.answers.feed_in === UNKNOWN;
    return this.question(
      t("q.feed_in.title"),
      "q_feed_in",
      html`<div class="inline">
        <span class="unit-input">
          <input
            class="input"
            type="number"
            inputmode="decimal"
            min="0"
            max="999"
            step="0.01"
            aria-label=${t("f.feed_in")}
            placeholder=${t("f.price.unknown")}
            .value=${price == null ? "" : String(Math.round(price * 1e6) / 1e4)}
            @change=${(ev: Event) => {
              const value = Number.parseFloat((ev.target as HTMLInputElement).value);
              const known = Number.isFinite(value) && value >= 0;
              saveConfig(this, {
                tariff: { feed_in_price: known ? Math.round(value * 100) / 10000 : null },
                answers: { feed_in: known ? "known" : null },
              });
            }}
          />
          <span class="unit">ct/kWh</span>
        </span>
        <button
          type="button"
          class="mini-btn ${price === 0 ? "go" : ""}"
          @click=${() => saveConfig(this, { tariff: { feed_in_price: 0 }, answers: { feed_in: "none" } })}
        >
          ${t("q.feed_in.none")}
        </button>
        <button
          type="button"
          class="mini-btn ${unknown ? "go" : ""}"
          @click=${() => saveConfig(this, { tariff: { feed_in_price: null }, answers: { feed_in: UNKNOWN } })}
        >
          ${t("ask.idk")}
        </button>
      </div>`,
    );
  }

  private renderCapacity(t: Translate, config: JoeConfig, id: string): TemplateResult {
    const battery = config.batteries.find((b) => b.id === id);
    if (!battery) {
      return html``;
    }
    const key = `capacity:${id}`;
    const unknown = config.answers[key] === UNKNOWN;
    return this.question(
      t("q.capacity.title", { name: battery.name }),
      "q_capacity",
      html`<div class="inline">
        <span class="unit-input">
          <input
            class="input"
            type="number"
            inputmode="decimal"
            min="0.1"
            max="1000"
            step="0.01"
            aria-label=${t("f.battery.capacity")}
            .value=${battery.capacity_kwh == null ? "" : String(battery.capacity_kwh)}
            @change=${(ev: Event) => {
              const value = Number.parseFloat((ev.target as HTMLInputElement).value);
              const known = Number.isFinite(value) && value > 0;
              saveConfig(this, {
                batteries: { [id]: { capacity_kwh: known ? value : null } },
                answers: { [key]: known ? "known" : null },
              });
            }}
          />
          <span class="unit">kWh</span>
        </span>
        <button
          type="button"
          class="mini-btn ${unknown ? "go" : ""}"
          @click=${() =>
            saveConfig(this, { batteries: { [id]: { capacity_kwh: null } }, answers: { [key]: UNKNOWN } })}
        >
          ${t("ask.idk_learn")}
        </button>
      </div>`,
    );
  }

  private saveTariff(change: Partial<TariffConfig>): void {
    const patch: Record<string, unknown> = { tariff: change };
    if (change.kind) {
      patch.answers = { tariff: change.kind };
    }
    saveConfig(this, patch);
  }

  private edit(editor: string): void {
    this.dispatchEvent(new CustomEvent("joe-edit", { detail: { editor }, bubbles: true, composed: true }));
  }

  private move(step: number, total: number): void {
    const next = this.index + step;
    if (next < 0) {
      this.go("scan");
    } else if (next >= total) {
      this.go("done");
    } else {
      this.index = next;
      this.scrollIntoView?.({ block: "start", behavior: "smooth" });
    }
  }

  private go(step: "scan" | "done"): void {
    this.dispatchEvent(new CustomEvent("joe-onboarding", { detail: { step }, bubbles: true, composed: true }));
  }
}

define("joe-questions", JoeQuestions);
