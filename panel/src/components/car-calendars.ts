import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { pickEntity } from "../config";
import { define } from "../define";
import { entityName } from "../entities";
import type { Translate } from "../i18n";
import { shared } from "../styles/shared";
import type { CarAccountStatus, CarMailboxStatus, CarNeedConfig, HomeAssistant } from "../types";
import "./calendar-flow";
import "./car-account";
import "./car-mailbox";
import { tip } from "./tip";

interface Links {
  external_url: string | null;
  links: Record<string, string>;
  entities: Record<string, string | null>;
}

export type CarSource = NonNullable<CarNeedConfig["source"]>;

/** The three ways appointments get to a car. */
const WAYS: { source: CarSource; icon: string }[] = [
  { source: "ha", icon: "mdi:calendar-check" },
  { source: "mailbox", icon: "mdi:email-outline" },
  { source: "account", icon: "mdi:calendar-sync" },
];

/** Ways to bring other calendars into Home Assistant (each starts its own setup). */
const CONNECT: { key: string; url: string }[] = [
  { key: "google", url: "https://my.home-assistant.io/redirect/config_flow_start/?domain=google" },
  { key: "caldav", url: "https://my.home-assistant.io/redirect/config_flow_start/?domain=caldav" },
  { key: "ical", url: "https://my.home-assistant.io/redirect/config_flow_start/?domain=remote_calendar" },
  { key: "microsoft", url: "https://my.home-assistant.io/redirect/hacs_repository/?owner=RogerSelwyn&repository=MS365-Calendar&category=integration" },
];

/**
 * Where a car's appointments come from, and in which calendar they end up:
 * a finished calendar in Home Assistant, the car's mailbox without a calendar
 * (Joe's calendar for the car) or its mailbox with a calendar.
 */
export class JoeCarCalendars extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property() actionId = "";
  /** How the car is saved (null: not charging by need yet). */
  @property({ attribute: false }) savedSource: CarSource | null = null;
  @property({ attribute: false }) need?: CarNeedConfig;
  @property({ attribute: false }) mailbox?: CarMailboxStatus;
  @property({ attribute: false }) account?: CarAccountStatus;
  /** Energy Joe's own apps for signing in. */
  @property({ attribute: false }) apps?: { microsoft: boolean; google: boolean };
  @property() carName = "";

  @state() private links?: Links;
  @state() private copied = false;
  @state() private copyFailed = false;
  @state() private linksFailed = false;
  @state() private sender = "";

  static styles = [
    shared,
    css`
      :host {
        display: grid;
        gap: 14px;
      }
      /* One below the other, or all three side by side – never two and one.
         The container is this box only: it holds no tooltip (a container
         would catch their fixed position where there is no popover). */
      .ways-box {
        container-type: inline-size;
      }
      .ways {
        display: grid;
        gap: 8px;
      }
      @container (min-width: 640px) {
        .ways {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }
      .way {
        display: grid;
        grid-template-columns: auto 1fr;
        align-items: start;
        gap: 4px 10px;
        padding: 12px;
        border-radius: 12px;
        border: 2px solid var(--joe-line);
        background: var(--joe-surface);
        color: inherit;
        font: inherit;
        text-align: left;
        cursor: pointer;
        transition:
          border-color 120ms,
          background 120ms,
          transform 120ms;
      }
      .way:hover {
        border-color: color-mix(in srgb, var(--joe-amber, #fea707) 55%, var(--joe-line));
      }
      .way:active {
        transform: scale(0.98);
      }
      .way[aria-checked="true"] {
        border-color: var(--joe-amber, #fea707);
        background: color-mix(in srgb, var(--joe-amber, #fea707) 12%, var(--joe-surface));
      }
      .way ha-icon {
        grid-row: span 2;
        --mdc-icon-size: 24px;
        margin-top: 1px;
      }
      .way b {
        font-weight: 700;
      }
      .way small {
        color: var(--joe-muted);
        font-size: 12.5px;
        line-height: 1.4;
      }
      .part,
      .own {
        display: grid;
        gap: 8px;
        padding: 12px;
        border-radius: 12px;
        background: var(--joe-surface-2);
      }
      .own {
        border: 2px dashed color-mix(in srgb, var(--joe-amber, #fea707) 70%, transparent);
      }
      .head-row {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .head-row b {
        font-weight: 700;
      }
      .link,
      .inline {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
      }
      .inline .input {
        flex: 1 1 200px;
        min-width: 0;
        width: auto;
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
        align-items: center;
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
      .hint.bad {
        color: var(--joe-warn, var(--joe-crit));
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
      this.linksFailed = false;
    } catch {
      this.linksFailed = true;
    }
  }

  protected render() {
    const { t, hass } = this;
    if (!t || !hass) {
      return nothing;
    }
    const source = this.need?.source ?? "ha";
    return html`<div data-tipped>
        <div class="head-row"><b>${t("calendar.source")}</b> ${tip(t, "calendar_source")}</div>
        <div class="ways-box"><div class="ways" role="radiogroup" aria-label=${t("calendar.source")}>
          ${WAYS.map(
            (way) => html`<button
              type="button"
              class="way"
              role="radio"
              aria-checked=${String(source === way.source)}
              @click=${() => this.change({ source: way.source })}
            >
              <ha-icon icon=${way.icon}></ha-icon>
              <b>${t(`calendar.way.${way.source}`)}</b>
              <small>${t(`calendar.way.${way.source}.hint`)}</small>
            </button>`,
          )}
        </div></div>
      </div>
      ${source === "mailbox"
        ? this.renderMailbox(t, hass)
        : source === "account"
          ? this.renderAccount(t)
          : this.renderCalendar(t, hass)}
      ${this.linksFailed
        ? html`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon><span>${t("calendar.links_failed")}</span>
            <button type="button" class="mini-btn quiet" @click=${() => this.load(false)}>${t("calendar.retry")}</button>
          </div>`
        : nothing}`;
  }

  private saved(source: CarSource): boolean {
    return this.savedSource === source;
  }

  // --- 1: a finished calendar in Home Assistant ---------------------------------

  private renderCalendar(t: Translate, hass: HomeAssistant): TemplateResult {
    const calendars = this.need?.calendars ?? [];
    // Up to 0.3 every car had Joe's calendar: one with trips entered by hand stays until they are over.
    const legacy = this.saved("ha") ? this.links?.entities[this.actionId] : null;
    return html`<div class="part">
        <joe-calendar-flow .t=${t} variant="calendar"></joe-calendar-flow>
      </div>
      ${legacy
        ? html`<div class="own" data-tipped>
            <div class="head-row"><ha-icon icon="mdi:calendar-clock"></ha-icon><b>${t("calendar.own.legacy")}</b> ${tip(t, "calendar_own")}</div>
            <p class="hint">${t("calendar.own.legacy.hint", { name: entityName(hass, legacy) })}</p>
          </div>`
        : nothing}
      <div data-tipped>
        <div class="head-row"><b>${t("calendar.pick")}</b> ${tip(t, "calendar_more")}</div>
        <div class="chips">
          ${calendars.map(
            (id) => html`<span class="chip">
              ${entityName(hass, id)}
              <button
                type="button"
                class="mini-btn quiet"
                aria-label=${t("calendar.remove", { name: entityName(hass, id) })}
                @click=${() => this.change({ calendars: calendars.filter((c) => c !== id) })}
              >
                <ha-icon icon="mdi:close"></ha-icon>
              </button>
            </span>`,
          )}
          <button type="button" class="mini-btn" @click=${() => this.pick()}>
            <ha-icon icon="mdi:calendar-plus"></ha-icon>${t("calendar.add")}
          </button>
        </div>
      </div>
      <div data-tipped>
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
    const picked = await pickEntity(this, {
      heading: t("calendar.pick"),
      tip: "calendar_more",
      filter: "calendar",
      selected: this.need?.calendars ?? [],
      multiple: true,
      // Joe's own calendars belong to cars with a mailbox.
      exclude: Object.values(this.links?.entities ?? {}).filter((id): id is string => Boolean(id)),
    });
    if (picked) {
      this.change({ calendars: picked.selected });
    }
  }

  // --- 2: the car's mailbox without a calendar ---------------------------------

  private renderMailbox(t: Translate, hass: HomeAssistant): TemplateResult {
    const saved = this.saved("mailbox");
    const entity = saved ? this.links?.entities[this.actionId] : null;
    // Before saving the name the entity will get (the device "Energy Joe" plus its own name).
    const calendar = entity ? entityName(hass, entity) : t("calendar.own.name", { car: this.carName });
    return html`<div class="part">
        <joe-calendar-flow .t=${t} variant="mailbox" address=${this.need?.mailbox?.address ?? ""} calendar=${calendar}></joe-calendar-flow>
      </div>
      <div class="head-row"><b>${t("calendar.mailbox")}</b></div>
      <joe-car-mailbox
        .hass=${hass}
        .t=${t}
        actionId=${this.actionId}
        ?saved=${saved}
        .need=${this.need}
        .status=${this.mailbox}
      ></joe-car-mailbox>
      ${this.renderAllowed(t)} ${this.renderOwn(t, calendar, entity)}`;
  }

  /** Where the appointments land: Joe's calendar for the car, with a link for the phone. */
  private renderOwn(t: Translate, calendar: string, entity: string | null | undefined): TemplateResult {
    const head = html`<div class="head-row">
      <ha-icon icon="mdi:calendar-import"></ha-icon><b>${t("calendar.own")}</b> ${tip(t, "calendar_own")}
    </div>`;
    if (!entity) {
      return html`<div class="own" data-tipped>${head}<p class="hint">${t("calendar.own.after_save", { name: calendar })}</p></div>`;
    }
    const path = this.links?.links[this.actionId];
    const base = this.links?.external_url;
    const url = path && base ? `${base.replace(/\/$/, "")}${path}` : null;
    return html`<div class="own" data-tipped>
      ${head}
      <p class="hint">${t("calendar.own.hint", { name: calendar })}</p>
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
          </div>
          ${this.copyFailed ? html`<p class="hint bad">${t("calendar.copy_failed")}</p>` : nothing}`
        : html`<p class="hint">${t("calendar.no_external")}</p>`}
    </div>`;
  }

  /** Copy the link; without a secure page (plain http) the old way, else let the user copy. */
  private async copy(url: string): Promise<void> {
    let done = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        done = true;
      }
    } catch {
      done = false;
    }
    if (!done) {
      const area = document.createElement("textarea");
      area.value = url;
      area.setAttribute("readonly", "");
      area.style.cssText = "position:fixed;top:0;left:0;opacity:0";
      document.body.append(area);
      area.select();
      try {
        done = document.execCommand("copy");
      } catch {
        done = false;
      }
      area.remove();
    }
    this.copyFailed = !done;
    if (done) {
      this.copied = true;
      setTimeout(() => (this.copied = false), 2000);
    } else {
      // Select the link so it can be copied by hand.
      const code = this.renderRoot.querySelector(".own code");
      const selection = window.getSelection();
      if (code && selection) {
        const range = document.createRange();
        range.selectNodeContents(code);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }

  // --- 3: the car's mailbox with a calendar ------------------------------------

  private renderAccount(t: Translate): TemplateResult {
    return html`<div class="part">
        <joe-calendar-flow .t=${t} variant="account" address=${this.need?.account?.address ?? ""}></joe-calendar-flow>
      </div>
      <div class="head-row"><b>${t("calendar.account")}</b></div>
      <joe-car-account
        .hass=${this.hass}
        .t=${t}
        actionId=${this.actionId}
        ?saved=${this.saved("account")}
        .need=${this.need}
        .status=${this.account}
        .apps=${this.apps}
      ></joe-car-account>
      ${this.renderAllowed(t, "account_allowed")}`;
  }

  // --- who may invite the car (2 and 3) ----------------------------------------

  private renderAllowed(t: Translate, tipName: "mail_allowed" | "account_allowed" = "mail_allowed"): TemplateResult {
    const allowed = this.need?.allowed ?? [];
    return html`<div class="part" data-tipped>
      <div class="head-row"><b>${t("mail.allowed")}</b> ${tip(t, tipName)}</div>
      <p class="hint">${t("mail.allowed.hint")}</p>
      ${allowed.length
        ? html`<div class="chips">
            ${allowed.map(
              (rule) => html`<span class="chip">
                ${rule}
                <button
                  type="button"
                  class="mini-btn quiet"
                  aria-label=${t("mail.allowed.remove", { rule })}
                  @click=${() => this.change({ allowed: allowed.filter((r) => r !== rule) })}
                >
                  <ha-icon icon="mdi:close"></ha-icon>
                </button>
              </span>`,
            )}
          </div>`
        : html`<div class="note warn"><ha-icon icon="mdi:account-alert-outline"></ha-icon><span>${t("mail.allowed.none")}</span></div>`}
      <form
        class="inline"
        @submit=${(ev: Event) => {
          ev.preventDefault();
          this.allow(this.sender);
        }}
      >
        <input
          class="input"
          type="text"
          placeholder=${t("mail.allowed.placeholder")}
          aria-label=${t("mail.allowed.add")}
          .value=${this.sender}
          @input=${(ev: Event) => (this.sender = (ev.target as HTMLInputElement).value)}
          @change=${() => this.allow(this.sender)}
        />
        <button type="submit" class="mini-btn" ?disabled=${!this.sender.trim()}>${t("mail.allowed.add")}</button>
      </form>
    </div>`;
  }

  private allow(text: string): void {
    const allowed = this.need?.allowed ?? [];
    const added = text
      .split(/[\s,;]+/)
      .map((rule) => rule.trim().toLowerCase())
      .filter((rule) => rule && !allowed.includes(rule));
    if (added.length) {
      this.change({ allowed: [...allowed, ...new Set(added)] });
    }
    this.sender = "";
  }

  private change(change: Partial<CarNeedConfig>): void {
    this.dispatchEvent(new CustomEvent("joe-need", { detail: change, bubbles: true, composed: true }));
  }
}

define("joe-car-calendars", JoeCarCalendars);
