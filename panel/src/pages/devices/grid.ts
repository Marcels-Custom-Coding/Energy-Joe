import { css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { openInHa, sourceChip } from "../../components/bits";
import {
  energyRow,
  findingList,
  findingStyles,
  forecastRow,
  powerRow,
  solarRow,
  tariffRow,
  type RowContext,
} from "../../components/finding-rows";
import { haOpen, haTarget } from "../../components/ha-open";
import { mirrorRow } from "../../components/mirror";
import { tip } from "../../components/tip";
import { saveConfig, sourceOf } from "../../config";
import { define } from "../../define";
import "../../editors/tariff-form";
import { formatNumber } from "../../entities";
import type { TipName, Translate } from "../../i18n";
import { href, onLink, revealAnchor, type Route } from "../../router";
import { ruleValue, type RuleKey } from "../../rules-view";
import { shared } from "../../styles/shared";
import type { JoeConfig } from "../../types";
import { frameStyles, groupHead, notFound } from "./device-frame";
import { DeviceSection } from "./section-base";

/** The parts of the page, also its addresses (/devices/grid/<anchor>). */
const ANCHORS = ["connection", "tariff", "solar", "home"] as const;
type Anchor = (typeof ANCHORS)[number];

const ICONS: Record<Anchor, string> = {
  connection: "mdi:transmission-tower",
  tariff: "mdi:cash-clock",
  solar: "mdi:solar-power-variant",
  home: "mdi:home-lightning-bolt-outline",
};

/** Where the Energy dashboard is set up in Home Assistant. */
const ENERGY_CONFIG = "/config/energy";

/** What the learned factor means, as on Rückblick › Gelernt › Sonne. */
function factorText(t: Translate, factor: number): string {
  if (factor < 0.95) {
    return t("learn.solar.less", {
      value: formatNumber(t.lang, (1 - factor) * 100, 0),
      share: formatNumber(t.lang, factor * 100, 0),
    });
  }
  if (factor > 1.05) {
    return t("learn.solar.more", {
      value: formatNumber(t.lang, (factor - 1) * 100, 0),
      share: formatNumber(t.lang, factor * 100, 0),
    });
  }
  return t("learn.solar.fits");
}

/**
 * Geräte › Netz & Sonne: the grid meter, the tariff, the solar plant with its
 * forecast and the home's consumption. Rules about the grid are mirrored
 * (set under Einstellungen › Regeln).
 */
export class JoeGridPage extends DeviceSection {
  /** connection | tariff | solar | home: scrolled to and lit up. */
  @property({ attribute: false }) anchor?: string;

  /** The anchor last scrolled to, so a new state does not scroll again. */
  private revealed?: string;

  static styles = [
    shared,
    frameStyles,
    findingStyles,
    css`
      :host {
        display: block;
      }
      .wrap {
        max-width: 900px;
        margin: 0 auto;
      }
      .energy {
        margin-top: 14px;
      }
      .energy-none {
        margin-top: 14px;
      }
      .energy-none a {
        color: inherit;
        text-decoration: underline;
        text-underline-offset: 3px;
      }
      .gsec {
        margin-top: 14px;
      }
      .gsec-head {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0;
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 800;
        font-size: 22px;
        line-height: 1.15;
      }
      .gsec-head ha-icon {
        --mdc-icon-size: 22px;
        color: var(--joe-ink-2);
      }
      .say {
        margin: 6px 0 12px;
        font-size: 14.5px;
        line-height: 1.5;
        color: var(--joe-ink-2);
        max-width: 62ch;
      }
      .mirrors {
        margin-top: 10px;
        border-top: 1px solid var(--joe-line);
        padding-top: 4px;
      }
      .toggle-row {
        display: flex;
        align-items: center;
        gap: 8px 12px;
        flex-wrap: wrap;
        margin-top: 12px;
        min-height: 44px;
      }
      .toggle-row .with-tip {
        flex: 1 1 160px;
        min-width: 0;
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .tariff-form {
        margin-top: 16px;
      }
      li.item .row-actions a.mini-btn {
        min-height: 36px;
        text-decoration: none;
      }
      @media (pointer: coarse) {
        li.item .row-actions a.mini-btn {
          min-height: 44px;
        }
      }
    `,
  ];

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has("anchor")) {
      this.revealed = undefined;
    }
  }

  protected updated(): void {
    if (this.anchor && this.revealed !== this.anchor && revealAnchor(this.renderRoot, this.anchor)) {
      this.revealed = this.anchor;
    }
  }

  protected render() {
    const { t, hass, state: joe } = this;
    if (!t || !hass || !joe) {
      return nothing;
    }
    const config = joe.config;
    const ctx: RowContext = {
      from: this,
      hass,
      t,
      config,
      discovery: this.discovery,
      checks: this.checks,
      aside: (entity, name) => haOpen(t, haTarget(hass, entity, name)),
    };
    const unknown = this.anchor !== undefined && !(ANCHORS as readonly string[]).includes(this.anchor);
    return html`<div class="wrap">
      ${unknown ? notFound(t) : nothing}
      ${groupHead(t, t("nav.devices.grid"), t("grid.lead"))}
      ${this.renderEnergy(t, ctx)} ${this.renderConnection(t, ctx)} ${this.renderTariff(t, ctx)}
      ${this.renderSolar(t, ctx)} ${this.renderHome(t, ctx)}
    </div>`;
  }

  /** What the Energy dashboard holds (Joe reads the meters from there), or how to set it up. */
  private renderEnergy(t: Translate, ctx: RowContext): TemplateResult {
    const row = energyRow(ctx);
    if (row) {
      return html`<div class="energy">${findingList(t, [row])}</div>`;
    }
    return html`<div class="note energy-none">
      <ha-icon icon="mdi:information-outline"></ha-icon>
      <span
        >${t("grid.energy.none")}
        <a
          href=${ENERGY_CONFIG}
          @click=${(ev: MouseEvent) => {
            if (ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.altKey || ev.button !== 0) return;
            ev.preventDefault();
            openInHa(ENERGY_CONFIG);
          }}
          >${t("grid.energy.open")}</a
        ></span
      >
    </div>`;
  }

  /** A part of the page: icon, title (with its tip), what it is about, then its content. */
  private block(t: Translate, anchor: Anchor, title: string, body: TemplateResult, tipName?: TipName): TemplateResult {
    return html`<section class="card gsec" data-anchor=${anchor}>
      <h3 class="gsec-head" ?data-tipped=${Boolean(tipName)}>
        <ha-icon icon=${ICONS[anchor]}></ha-icon>${title}${tipName ? tip(t, tipName) : nothing}
      </h3>
      <p class="say">${t(`grid.${anchor}.say`)}</p>
      ${body}
    </section>`;
  }

  /** A rule about the grid, set under Einstellungen › Regeln. */
  private rule(t: Translate, config: JoeConfig, key: RuleKey): TemplateResult {
    return mirrorRow(t, this.prefix, {
      label: t(`rule.${key}`),
      value: ruleValue(t, config, key),
      source: sourceOf(config, `rules.${key}`),
      to: { tab: "settings", section: "rules", id: key },
    });
  }

  private renderConnection(t: Translate, ctx: RowContext): TemplateResult {
    return this.block(
      t,
      "connection",
      t("grid.connection"),
      html`${findingList(t, [powerRow(ctx, "grid_power")])}
        <div class="mirrors">${this.rule(t, ctx.config, "grid_limit_w")} ${this.rule(t, ctx.config, "guard_grid")}</div>`,
    );
  }

  /** The tariff: one line of what Joe knows, the form with its draft below, and the price limit. */
  private renderTariff(t: Translate, ctx: RowContext): TemplateResult {
    return this.block(
      t,
      "tariff",
      t("find.tariff"),
      html`${findingList(t, [tariffRow(ctx, { missing: t("grid.tariff.unknown") })])}
        <joe-tariff-draft
          class="tariff-form"
          keep
          .hass=${this.hass}
          .t=${t}
          .config=${ctx.config}
          .discovery=${this.discovery}
        ></joe-tariff-draft>
        <div class="mirrors">${this.rule(t, ctx.config, "max_price")}</div>`,
      "grid_tariff",
    );
  }

  /** PV power, the forecast, combining forecasts and what Joe learned about them. */
  private renderSolar(t: Translate, ctx: RowContext): TemplateResult {
    const config = ctx.config;
    const forecast = config.forecast;
    const factor = config.learned.solar_factor;
    const learned: Route = { tab: "review", section: "learned", id: "sun" };
    return this.block(
      t,
      "solar",
      t("devices.grid.solar"),
      html`${findingList(t, [solarRow(ctx), forecastRow(ctx)])}
        ${forecast.provider && forecast.alternatives.length
          ? html`<div class="toggle-row" data-tipped>
              <span class="with-tip"><span id="combine-label">${t("learn.sources.combine")}</span>${tip(t, "learn_combine")}</span>
              <button
                type="button"
                class="switch"
                role="switch"
                aria-checked=${String(forecast.combine)}
                aria-labelledby="combine-label"
                @click=${() => saveConfig(this, { forecast: { combine: !forecast.combine } })}
              ></button>
            </div>`
          : nothing}
        ${forecast.provider
          ? html`<div class="mirrors">
              <div class="mirror">
                <div class="mirror-text">
                  <span class="mirror-label">${t("grid.solar.factor")}</span>
                  <span class="mirror-sep" aria-hidden="true">·</span>
                  <span class="mirror-value">${factor == null ? t("learn.still") : `× ${formatNumber(t.lang, factor, 2)}`}</span>
                  ${factor == null ? nothing : sourceChip(t, { source: "learned" })}
                  ${factor == null ? nothing : html`<small class="mirror-hint">${factorText(t, factor)}</small>`}
                </div>
                <a class="mini-btn quiet mirror-go" href=${href(this.prefix, learned)} @click=${onLink(learned)}
                  >${t("devices.page.more_learned")}</a
                >
              </div>
            </div>`
          : nothing}`,
    );
  }

  /** The home's consumption: worked out or from a sensor; the meters behind it are under Weitere Geräte. */
  private renderHome(t: Translate, ctx: RowContext): TemplateResult {
    const other: Route = { tab: "devices", section: "other" };
    const devices = html`<a class="mini-btn go" href=${href(this.prefix, other)} @click=${onLink(other)}
      >${t("grid.home.devices")}</a
    >`;
    return this.block(t, "home", t("devices.grid.home"), findingList(t, [powerRow(ctx, "home_power", { devices })]));
  }
}

define("joe-grid-page", JoeGridPage);
