import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { pickEntity } from "../config";
import { define } from "../define";
import { entityName } from "../entities";
import type { Translate } from "../i18n";
import { shared } from "../styles/shared";
import type { HomeAssistant } from "../types";
import { tip } from "./tip";

interface Links {
  external_url: string | null;
  links: Record<string, string>;
  entities: Record<string, string | null>;
}

/** Ways to bring other calendars into Home Assistant (each starts its own setup). */
const CONNECT: { key: string; url: string }[] = [
  { key: "google", url: "https://my.home-assistant.io/redirect/config_flow_start/?domain=google" },
  { key: "caldav", url: "https://my.home-assistant.io/redirect/config_flow_start/?domain=caldav" },
  { key: "ical", url: "https://my.home-assistant.io/redirect/config_flow_start/?domain=remote_calendar" },
  { key: "microsoft", url: "https://my.home-assistant.io/redirect/hacs_repository/?owner=RogerSelwyn&repository=MS365-Calendar&category=integration" },
];

/**
 * The calendars of one car: Joe's own (with a link to subscribe on the phone),
 * further calendars of the car, and buttons to connect calendars elsewhere.
 */
export class JoeCarCalendars extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property() actionId = "";
  /** Saved already: only then does Joe's own calendar exist. */
  @property({ type: Boolean }) saved = false;
  @property({ attribute: false }) calendars: string[] = [];

  @state() private links?: Links;
  @state() private copied = false;
  @state() private failed = false;

  static styles = [
    shared,
    css`
      :host {
        display: grid;
        gap: 10px;
      }
      .own {
        display: grid;
        gap: 6px;
        padding: 10px 12px;
        border-radius: 12px;
        background: var(--joe-surface-2);
      }
      .own b {
        font-weight: 600;
      }
      .head-row {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .link {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
      }
      .link code {
        flex: 1 1 220px;
        min-width: 0;
        overflow-wrap: anywhere;
        font-size: 12.5px;
        color: var(--joe-ink-2);
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      a.mini-btn {
        text-decoration: none;
        color: inherit;
      }
      .hint {
        margin: 0;
        font-size: 13px;
        color: var(--joe-muted);
      }
    `,
  ];

  connectedCallback(): void {
    super.connectedCallback();
    void this.load(false);
  }

  private async load(renew: boolean): Promise<void> {
    if (!this.hass) {
      return;
    }
    try {
      this.links = await this.hass.callWS<Links>({ type: "energy_joe/calendar/links", renew });
      this.failed = false;
    } catch {
      this.failed = true;
    }
  }

  protected render() {
    const { t, hass } = this;
    if (!t || !hass) {
      return nothing;
    }
    return html`${this.renderOwn(t, hass)} ${this.renderMore(t, hass)} ${this.renderConnect(t)}
    ${this.failed ? html`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${t("error.action")}</div>` : nothing}`;
  }

  private renderOwn(t: Translate, hass: HomeAssistant): TemplateResult {
    const entity = this.links?.entities[this.actionId];
    if (!this.saved || !entity) {
      return html`<p class="hint">${t("calendar.own.after_save")}</p>`;
    }
    const path = this.links?.links[this.actionId];
    const base = this.links?.external_url;
    const url = path && base ? `${base.replace(/\/$/, "")}${path}` : null;
    return html`<div class="own" data-tipped>
      <div class="head-row"><b>${entityName(hass, entity)}</b> ${tip(t, "calendar_own")}</div>
      <p class="hint">${t("calendar.own.hint")}</p>
      ${url
        ? html`<div class="link">
            <code>${url}</code>
            <button type="button" class="mini-btn" @click=${() => this.copy(url)}>
              <ha-icon icon=${this.copied ? "mdi:check" : "mdi:content-copy"}></ha-icon>${t(this.copied ? "calendar.copied" : "calendar.copy")}
            </button>
            <button type="button" class="mini-btn quiet" @click=${() => this.load(true)}>
              <ha-icon icon="mdi:refresh"></ha-icon>${t("calendar.renew")}
            </button>
            ${tip(t, "calendar_link")}
          </div>`
        : html`<p class="hint">${t("calendar.no_external")}</p>`}
    </div>`;
  }

  private renderMore(t: Translate, hass: HomeAssistant): TemplateResult {
    return html`<div data-tipped>
      <div class="chips">
        ${this.calendars.map(
          (id) => html`<span class="chip">
            ${entityName(hass, id)}
            <button
              type="button"
              class="mini-btn quiet"
              aria-label=${t("calendar.remove", { name: entityName(hass, id) })}
              @click=${() => this.emit(this.calendars.filter((c) => c !== id))}
            >
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </span>`,
        )}
        <button type="button" class="mini-btn" @click=${() => this.pick()}>
          <ha-icon icon="mdi:calendar-plus"></ha-icon>${t("calendar.add")}
        </button>
        ${tip(t, "calendar_more")}
      </div>
    </div>`;
  }

  private renderConnect(t: Translate): TemplateResult {
    return html`<div data-tipped>
      <p class="hint">${t("calendar.connect")}</p>
      <div class="chips">
        ${CONNECT.map(
          (item) =>
            html`<a class="mini-btn" href=${item.url} target="_blank" rel="noreferrer noopener">
              <ha-icon icon="mdi:open-in-new"></ha-icon>${t(`calendar.connect.${item.key}` as "calendar.connect.google")}
            </a>`,
        )}
        ${tip(t, "calendar_connect")}
      </div>
    </div>`;
  }

  private async pick(): Promise<void> {
    const t = this.t!;
    const own = this.links?.entities[this.actionId];
    const picked = await pickEntity(this, {
      heading: t("calendar.pick"),
      tip: "calendar_more",
      filter: "calendar",
      selected: this.calendars,
      multiple: true,
      exclude: own ? [own] : [],
    });
    if (picked) {
      this.emit(picked.selected.filter((id) => id !== own));
    }
  }

  private emit(calendars: string[]): void {
    this.dispatchEvent(new CustomEvent("joe-calendars", { detail: { calendars }, bubbles: true, composed: true }));
  }

  private async copy(url: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(url);
      this.copied = true;
      setTimeout(() => (this.copied = false), 2000);
    } catch {
      this.failed = true;
    }
  }
}

define("joe-car-calendars", JoeCarCalendars);
