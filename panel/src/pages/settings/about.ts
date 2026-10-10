import { css, html, nothing, type TemplateResult } from "lit";
import { openInHa } from "../../components/bits";
import { haOpen } from "../../components/ha-open";
import { tip } from "../../components/tip";
import { define } from "../../define";
import { entityName, formatState } from "../../entities";
import type { Translate } from "../../i18n";
import { shared } from "../../styles/shared";
import type { HomeAssistant } from "../../types";
import { SettingsSection } from "./base";
import { settingsStyles } from "./styles";

/** Where the Energy dashboard is set up in Home Assistant. */
const ENERGY_CONFIG = "/config/energy";

type EntityGroup = "control" | "button" | "value" | "calendar" | "other";
const GROUP_ORDER: EntityGroup[] = ["control", "button", "value", "calendar", "other"];
const DOMAIN_GROUP: Record<string, EntityGroup> = {
  select: "control",
  switch: "control",
  button: "button",
  sensor: "value",
  binary_sensor: "value",
  calendar: "calendar",
};

/** Groups whose state means something (a button's state is when it was last pressed). */
const STATEFUL: EntityGroup[] = ["control", "value", "other"];

/** The dashboard cards the integration brings (energy-joe-cards.ts). */
const CARDS = [
  { id: "night", type: "energy-joe-night-card", icon: "mdi:weather-night" },
  { id: "car", type: "energy-joe-car-card", icon: "mdi:car-electric-outline" },
] as const;

/** An entity id that may wrap only after "." and "_" (never inside a word). */
function breakable(id: string): TemplateResult {
  return html`${id.split(/(?<=[._])/).map((part, i) => html`${i ? html`<wbr />` : nothing}${part}`)}`;
}

/**
 * Einstellungen › Über Joe: versions, what the Energy dashboard holds, the
 * entities Joe creates in Home Assistant (anchor entities) and the dashboard
 * cards (anchor cards), both for the user's own automations and dashboards.
 */
export class JoeSettingsAbout extends SettingsSection {
  static styles = [
    shared,
    settingsStyles,
    css`
      .ent {
        display: flex;
        align-items: center;
        gap: 10px 12px;
        padding: 10px 0;
        border-top: 1px solid var(--joe-line);
      }
      .ent-text {
        flex: 1;
        min-width: 0;
      }
      .ent-text b {
        display: block;
        font-weight: 700;
        overflow-wrap: anywhere;
      }
      code {
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 12.5px;
        color: var(--joe-muted);
        overflow-wrap: anywhere;
      }
      .ent-state {
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        color: var(--joe-ink-2);
        text-align: right;
        max-width: 40%;
        overflow-wrap: anywhere;
      }
      /* Narrow: the value goes below, so the id keeps the width and breaks only at "." and "_". */
      @media (max-width: 600px) {
        .ent {
          flex-wrap: wrap;
          row-gap: 2px;
        }
        .ent-state {
          order: 3;
          flex-basis: 100%;
          max-width: none;
          text-align: left;
        }
      }
      .group-label {
        margin: 14px 0 4px;
      }
      .card-type {
        display: block;
        margin-top: 4px;
      }
      .row b.card-name {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .card-name ha-icon {
        --mdc-icon-size: 20px;
        color: var(--joe-ink-2);
      }
    `,
  ];

  protected render() {
    const { t, hass } = this;
    if (!t || !this.state) {
      return nothing;
    }
    return html`<div class="list">
      ${this.renderVersions(t)} ${this.renderEntities(t, hass)} ${this.renderCards(t)}
    </div>`;
  }

  private renderVersions(t: Translate): TemplateResult {
    const energy = this.info?.energy;
    const configured = Boolean(energy?.configured && energy.sources);
    return html`<section class="group" data-anchor="versions">
      <h2>${t("settings.about")}</h2>
      <div class="row"><b>${t("settings.version")}</b><span class="value">${this.info?.version ?? "–"}</span></div>
      <div class="row"><b>${t("settings.ha")}</b><span class="value">${this.info?.ha_version ?? "–"}</span></div>
      <div class="row" data-anchor="energy">
        <div>
          <b>${t("settings.energy")}</b>
          <small>${configured ? this.energyText(t) : t("settings.energy.none")}</small>
        </div>
        <a
          class="mini-btn"
          data-notip
          href=${ENERGY_CONFIG}
          @click=${(ev: MouseEvent) => {
            if (ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.altKey || ev.button !== 0) return;
            ev.preventDefault();
            openInHa(ENERGY_CONFIG);
          }}
          ><ha-icon icon="mdi:open-in-new"></ha-icon>${t("grid.energy.open")}</a
        >
      </div>
    </section>`;
  }

  /** "Netz: 1 · PV-Anlagen: 4 · …": label first, so one or many reads right. */
  private energyText(t: Translate): string {
    const energy = this.info!.energy;
    const sources = energy.sources ?? {};
    return t("settings.energy.sources", {
      grid: sources.grid ?? 0,
      solar: sources.solar ?? 0,
      battery: sources.battery ?? 0,
      devices: energy.devices ?? 0,
    });
  }

  /** Joe's own entities in Home Assistant, grouped by what they are; each opens its info dialog. */
  private renderEntities(t: Translate, hass: HomeAssistant | undefined): TemplateResult {
    const entries = Object.values(hass?.entities ?? {}).filter((entry) => entry.platform === "energy_joe");
    const groups = new Map<EntityGroup, { id: string; name: string }[]>();
    for (const entry of entries) {
      const group = DOMAIN_GROUP[entry.entity_id.split(".", 1)[0]] ?? "other";
      // "Energy Joe Betriebsart": the device's name in front says nothing here.
      const full = hass ? entityName(hass, entry.entity_id) : entry.entity_id;
      const name = full.replace(/^energy joe\s+/i, "") || full;
      groups.set(group, [...(groups.get(group) ?? []), { id: entry.entity_id, name }]);
    }
    return html`<section class="group" data-anchor="entities">
      <div class="group-title" data-tipped><h2>${t("settings.about.entities")}</h2>${tip(t, "about_entities")}</div>
      <p class="intro">${t("settings.about.entities.intro")}</p>
      ${entries.length
        ? GROUP_ORDER.filter((group) => groups.has(group)).map(
            (group) => html`<div class="group-label">${t(`settings.about.group.${group}`)}</div>
              ${groups
                .get(group)!
                .sort((a, b) => a.name.localeCompare(b.name, t.lang))
                .map(
                  (item) => html`<div class="ent">
                    <div class="ent-text"><b>${item.name}</b><code>${breakable(item.id)}</code></div>
                    ${hass && STATEFUL.includes(group)
                      ? html`<span class="ent-state">${formatState(hass, item.id, t.lang)}</span>`
                      : nothing}
                    ${haOpen(t, { entityId: item.id, name: item.name })}
                  </div>`,
                )}`,
          )
        : html`<p class="intro">${t("settings.about.entities.none")}</p>`}
    </section>`;
  }

  /** The two dashboard cards and how to add them. */
  private renderCards(t: Translate): TemplateResult {
    return html`<section class="group" data-anchor="cards">
      <h2>${t("settings.about.cards")}</h2>
      <p class="intro">${t("settings.about.cards.intro")}</p>
      ${CARDS.map(
        (card) => html`<div class="row">
          <div>
            <b class="card-name"><ha-icon icon=${card.icon}></ha-icon>${t(`settings.about.cards.${card.id}`)}</b>
            <small>${t(`settings.about.cards.${card.id}.hint`)}</small>
            <code class="card-type">type: custom:${card.type}</code>
          </div>
        </div>`,
      )}
    </section>`;
  }
}

define("joe-settings-about", JoeSettingsAbout);
