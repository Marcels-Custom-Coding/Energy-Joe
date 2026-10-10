import { css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { keyed } from "lit/directives/keyed.js";
import { displayTitle } from "../../components/bits";
import "../../components/sheet";
import { tip } from "../../components/tip";
import type { ConfigChange } from "../../config";
import { define } from "../../define";
import { actionPlace, addRoute, ignoredBatteries, newFindings, type AddKind } from "../../device-model";
import "../../editors/action-editor";
import type { ActionTemplate } from "../../editors/action-editor";
import type { Translate } from "../../i18n";
import { closeSheet, href, navigate, onLink, type Route } from "../../router";
import { shared } from "../../styles/shared";
import type { ActionConfig, BatteryFinding } from "../../types";
import { ignoreFinding, pickBattery, useBattery } from "./device-actions";
import { DeviceSection } from "./section-base";

/** The choices of the assistant: a step of its own, or a jump to where the device is set up. */
const CHOICES: { kind: AddKind | "climate" | "meter"; icon: string }[] = [
  { kind: "battery", icon: "mdi:home-battery-outline" },
  { kind: "car", icon: "mdi:car-electric" },
  { kind: "hot_water", icon: "mdi:water-boiler" },
  { kind: "climate", icon: "mdi:thermostat" },
  { kind: "night", icon: "mdi:weather-night" },
  { kind: "meter", icon: "mdi:meter-electric-outline" },
];

/** Which new night action each kind starts from (editors/action-editor.ts). */
const TEMPLATES: Record<"car" | "hot_water" | "night", ActionTemplate> = {
  car: "ev",
  hot_water: "hot_water",
  night: "custom",
};

/** Kinds that live on a group page instead of a step here. */
const ELSEWHERE: Record<string, Route> = {
  climate: { tab: "devices", section: "climate" },
  meter: { tab: "devices", section: "other" },
  other: { tab: "devices", section: "other" },
};

/**
 * "+ Hinzufügen": an addressed sheet (/devices/add[/<kind>[/<consumerId>]])
 * over the page it was opened from. Speicher are taken over or picked here;
 * Auto, Warmwasser and "Gerät, das nachts laufen soll" use the action editor.
 * Once saved, the new device's page replaces the sheet.
 */
export class JoeDeviceAdd extends DeviceSection {
  /** battery | car | hot_water | night (climate and meter jump to their group); empty: the choices. */
  @property({ attribute: false }) kind?: string;
  /**
   * A meter from the Energy dashboard the new night action is for, or what
   * "Neu gefunden" offered ("wallbox:<id>", "car:<id>": the finding's key).
   */
  @property({ attribute: false }) consumer?: string;
  /** The page under the sheet, where closing returns to. */
  @property({ attribute: false }) behind: Route = { tab: "devices", section: "all" };

  @state() private busy = "";
  /** The night action the editor asked to save (id and fields) and whether that worked. */
  private saved?: { action: ActionConfig; result?: Promise<boolean> };

  static styles = [
    shared,
    css`
      .lead {
        margin: 10px 0 0;
      }
      .choices {
        list-style: none;
        margin: 16px 0 0;
        padding: 0;
        display: grid;
        gap: 8px;
      }
      .choice {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        gap: 12px;
        width: 100%;
        min-height: 56px;
        padding: 10px 12px;
        border: 0;
        border-radius: 12px;
        background: var(--joe-surface-2);
        color: inherit;
        font: inherit;
        text-align: left;
        text-decoration: none;
        cursor: pointer;
        transition: background 0.12s, transform 0.12s;
      }
      .choice:hover {
        background: var(--joe-line);
      }
      .choice:active {
        transform: scale(0.99);
      }
      .choice > ha-icon {
        --mdc-icon-size: 24px;
        color: var(--joe-ink-2);
      }
      .choice span {
        display: grid;
        gap: 2px;
        min-width: 0;
      }
      .choice b {
        font-weight: 700;
      }
      .choice small {
        color: var(--joe-ink-2);
        font-size: 13.5px;
      }
      .choice .chevron {
        color: var(--joe-muted);
      }
      a.back-link {
        margin: -6px 0 6px;
      }
      .found {
        list-style: none;
        margin: 14px 0 0;
        padding: 0;
        display: grid;
      }
      .found li {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px 12px;
        padding: 10px 0;
        border-top: 1px solid var(--joe-line);
      }
      .found li:first-child {
        border-top: 0;
      }
      .found .what {
        flex: 1 1 180px;
        min-width: 0;
        display: grid;
      }
      .found b {
        font-weight: 600;
        overflow-wrap: anywhere;
      }
      .found small {
        color: var(--joe-muted);
        font-size: 13px;
      }
      .found .row-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .empty {
        margin: 14px 0 0;
        color: var(--joe-ink-2);
      }
    `,
  ];

  protected updated(changed: PropertyValues<this>): void {
    const elsewhere = this.kind ? ELSEWHERE[this.kind] : undefined;
    if (changed.has("kind") && elsewhere) {
      // Klimageräte and meters are set up on their group page.
      navigate(this, elsewhere, { replace: true });
    }
  }

  protected render() {
    const t = this.t;
    if (!t || !this.state || (this.kind && ELSEWHERE[this.kind])) {
      return nothing;
    }
    return html`<joe-sheet
      label=${t("devices.add.label")}
      closeLabel=${t("common.close")}
      @joe-close=${this.onClose}
      @joe-config=${this.onConfig}
    >
      ${this.kind === "battery"
        ? this.renderBattery(t)
        : this.kind && this.kind in TEMPLATES
          ? this.renderAction(t, this.kind as keyof typeof TEMPLATES)
          : this.renderChoices(t)}
    </joe-sheet>`;
  }

  private renderChoices(t: Translate): TemplateResult {
    return html`<div data-tipped>
      <div class="sheet-title">${displayTitle(t("devices.add.title"), "h2", tip(t, "devices_add"))}</div>
      <p class="lead">${t("devices.add.lead")}</p>
      <ul class="choices">
        ${CHOICES.map(({ kind, icon }) => {
          const to: Route = kind in ELSEWHERE ? ELSEWHERE[kind] : addRoute(kind as AddKind, this.consumer);
          // A step stays inside the sheet (back still closes it); a group page replaces it.
          const opts = kind in ELSEWHERE ? { replace: true } : { replace: true, sheet: true };
          return html`<li>
            <a class="choice" href=${href(this.prefix, to)} @click=${onLink(to, opts)}>
              <ha-icon icon=${icon}></ha-icon>
              <span><b>${t(`devices.add.${kind}`)}</b><small>${t(`devices.add.${kind}.text`)}</small></span>
              <ha-icon class="chevron" icon="mdi:chevron-right"></ha-icon>
            </a>
          </li>`;
        })}
        <li>
          <button type="button" class="choice" @click=${this.rediscover}>
            <ha-icon icon="mdi:magnify"></ha-icon>
            <span><b>${t("devices.add.rediscover")}</b><small>${t("devices.add.rediscover.text")}</small></span>
            <ha-icon class="chevron" icon="mdi:chevron-right"></ha-icon>
          </button>
        </li>
      </ul>
    </div>`;
  }

  /** "← Andere Auswahl": back to the choices, still inside the sheet. */
  private backToChoices(t: Translate): TemplateResult {
    const to = addRoute();
    return html`<a class="back-link" href=${href(this.prefix, to)} @click=${onLink(to, { replace: true, sheet: true })}
      >${t("nav.back", { name: t("devices.add.other") })}</a
    >`;
  }

  private renderBattery(t: Translate): TemplateResult {
    const config = this.state!.config;
    const found = newFindings(config, this.discovery).filter((f) => f.kind === "battery" && f.battery);
    const ignored = ignoredBatteries(config, this.discovery);
    const row = (battery: BatteryFinding, ignoredRow: boolean, key: string) =>
      html`<li>
        <span class="what">
          <b>${battery.name}</b>
          <small>${ignoredRow ? t("devices.add.battery.ignored") : t("devices.found.battery")}</small>
        </span>
        <span class="row-actions">
          <button type="button" class="mini-btn go" ?disabled=${Boolean(this.busy)} @click=${() => this.useFound(battery, key)}>
            ${t(ignoredRow ? "devices.add.battery.use" : "devices.found.use")}
          </button>
          ${ignoredRow
            ? nothing
            : html`<button
                type="button"
                class="mini-btn quiet"
                ?disabled=${Boolean(this.busy)}
                @click=${() => this.ignore(key)}
              >
                ${t("devices.found.ignore")}
              </button>`}
        </span>
      </li>`;
    return html`${this.backToChoices(t)}
      <div data-tipped>
        <div class="sheet-title">${displayTitle(t("devices.add.battery.title"), "h2", tip(t, "devices_found"))}</div>
        <p class="lead">${t("devices.add.battery.lead")}</p>
        ${found.length || ignored.length
          ? html`<ul class="found">
              ${found.map((f) => row(f.battery!, false, f.key))}
              ${ignored.map((b) => row(b, true, `battery:${b.id}`))}
            </ul>`
          : html`<p class="empty">${t("devices.add.battery.none")}</p>`}
      </div>
      <div class="actions" data-tipped>
        <button type="button" class="btn btn-secondary" ?disabled=${Boolean(this.busy)} @click=${this.pick}>
          <ha-icon icon="mdi:magnify"></ha-icon>${t("devices.add.battery.pick")}
        </button>
        ${tip(t, "review_battery_add")}
      </div>`;
  }

  private renderAction(t: Translate, kind: keyof typeof TEMPLATES): TemplateResult {
    const joe = this.state!;
    const sub = this.consumer ?? "";
    const found = /^(wallbox|car):/.test(sub) ? sub : "";
    const meter = found ? undefined : joe.config.consumers.find((c) => c.id === sub);
    const what = meter?.name ?? (found ? newFindings(joe.config, this.discovery).find((f) => f.key === found)?.name : undefined);
    // A new key for each kind and meter: the editor starts a fresh draft.
    return html`${this.backToChoices(t)}
      ${keyed(
        `${kind}:${this.consumer ?? ""}`,
        html`<joe-action-editor
          .hass=${this.hass}
          .mailboxes=${joe.mailbox}
          .accounts=${joe.accounts}
          .apps=${joe.apps}
          .t=${t}
          .config=${joe.config}
          .discovery=${this.discovery}
          actionId=${`new:${TEMPLATES[kind]}`}
          section=${kind === "car" ? "need" : ""}
          consumer=${found ? "" : sub}
          found=${found}
          subtitle=${what ? t("devices.add.for", { name: what }) : ""}
        ></joe-action-editor>`,
      )}`;
  }

  /**
   * The editor saves a new night action: remember it, and the save's result
   * (the panel fills it in once the event has passed), to open its page once
   * the editor closes.
   */
  private onConfig(ev: CustomEvent<ConfigChange>): void {
    const actions = ev.detail.patch.actions as Record<string, Partial<ActionConfig> | null> | undefined;
    const known = new Set(this.state?.config.actions.map((a) => a.id));
    for (const [id, fields] of Object.entries(actions ?? {})) {
      if (fields && !known.has(id)) {
        const detail = ev.detail;
        this.saved = {
          action: { ...(fields as ActionConfig), id },
          get result() {
            return detail.result;
          },
        };
      }
    }
  }

  /** Closing: after a successful save to the new device's page, else back to where the sheet was opened. */
  private async onClose(): Promise<void> {
    const saved = this.saved;
    this.saved = undefined;
    const config = this.state?.config;
    if (saved && config && (await (saved.result ?? Promise.resolve(false)))) {
      const action = saved.action;
      const place = actionPlace({ ...config, actions: [...config.actions.filter((a) => a.id !== action.id), action] }, action);
      navigate(this, { tab: "devices", section: place.group, id: place.id }, { replace: true });
      return;
    }
    closeSheet(this, this.behind);
  }

  private async useFound(battery: BatteryFinding, key: string): Promise<void> {
    this.busy = key;
    const id = await useBattery(this, this.state!.config, battery);
    this.busy = "";
    if (id) {
      navigate(this, { tab: "devices", section: "battery", id }, { replace: true });
    }
  }

  private async ignore(key: string): Promise<void> {
    this.busy = key;
    await ignoreFinding(this, this.state!.config, key);
    this.busy = "";
  }

  private async pick(): Promise<void> {
    if (!this.hass) return;
    this.busy = "pick";
    const id = await pickBattery(this, this.t!, this.hass, this.state!.config);
    this.busy = "";
    if (id) {
      navigate(this, { tab: "devices", section: "battery", id }, { replace: true });
    }
  }

  /** "Nochmal umschauen": Joe looks around again (the panel takes over what is new); Alle shows the result. */
  private rediscover(): void {
    this.dispatchEvent(new CustomEvent("joe-rediscover", { bubbles: true, composed: true }));
    navigate(this, { tab: "devices", section: "all" }, { replace: true });
  }
}

define("joe-device-add", JoeDeviceAdd);
