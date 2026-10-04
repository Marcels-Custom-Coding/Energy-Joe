import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { pickEntity, saveConfig } from "../config";
import { define } from "../define";
import { entityName } from "../entities";
import type { Translate } from "../i18n";
import { shared } from "../styles/shared";
import type { CarAccountConfig, CarAccountStatus, CarNeedConfig, HomeAssistant, MailboxConfig } from "../types";
import { timeOf } from "./plan-text";
import { tip } from "./tip";

interface Links {
  external_url: string | null;
  links: Record<string, string>;
  entities: Record<string, string | null>;
}

type Source = NonNullable<CarNeedConfig["source"]>;
const SOURCES: Source[] = ["ha", "mailbox", "account"];
const KINDS: CarAccountConfig["kind"][] = ["outlook", "microsoft", "icloud", "infomaniak", "caldav"];
const MICROSOFT = new Set(["outlook", "microsoft"]);

export const DEFAULT_ACCOUNT: CarAccountConfig = {
  kind: "outlook",
  address: "",
  username: null,
  url: null,
  client_id: null,
  tenant: "common",
  accept: true,
};

/** Ways to bring other calendars into Home Assistant (each starts its own setup). */
const CONNECT: { key: string; url: string }[] = [
  { key: "google", url: "https://my.home-assistant.io/redirect/config_flow_start/?domain=google" },
  { key: "caldav", url: "https://my.home-assistant.io/redirect/config_flow_start/?domain=caldav" },
  { key: "ical", url: "https://my.home-assistant.io/redirect/config_flow_start/?domain=remote_calendar" },
  { key: "microsoft", url: "https://my.home-assistant.io/redirect/hacs_repository/?owner=RogerSelwyn&repository=MS365-Calendar&category=integration" },
];

/**
 * The calendars of one car: Joe's own (with a link to subscribe on the phone),
 * and where its appointments come from – a calendar in Home Assistant,
 * invitations to Joe's mailbox, or the car's own account.
 */
export class JoeCarCalendars extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property() actionId = "";
  /** Saved already: only then do Joe's calendar and the account exist. */
  @property({ type: Boolean }) saved = false;
  @property({ attribute: false }) need?: CarNeedConfig;
  /** Joe's mailbox: invitations to the car's address land in its calendar. */
  @property({ attribute: false }) mailbox?: MailboxConfig;
  @property({ attribute: false }) account?: CarAccountStatus;
  @property() carName = "";

  @state() private links?: Links;
  @state() private copied = false;
  @state() private failed = false;
  @state() private password = "";
  @state() private result?: string;
  @state() private busy = false;
  @state() private ownApp = false;

  static styles = [
    shared,
    css`
      :host {
        display: grid;
        gap: 12px;
      }
      .own,
      .part {
        display: grid;
        gap: 8px;
        padding: 10px 12px;
        border-radius: 12px;
        background: var(--joe-surface-2);
      }
      .own b,
      .part b {
        font-weight: 600;
      }
      .head-row {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .link,
      .inline {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
      }
      .link .input,
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
      .ok {
        color: var(--joe-good);
      }
      .bad {
        color: var(--joe-warn, var(--joe-crit));
      }
      .code {
        margin: 0;
        font-weight: 600;
      }
      .seg {
        flex-wrap: wrap;
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
    const source = this.need?.source ?? "ha";
    return html`${this.renderOwn(t, hass)}
      <div data-tipped>
        <div class="head-row"><b>${t("calendar.source")}</b> ${tip(t, "calendar_source")}</div>
        <div class="seg" role="group" aria-label=${t("calendar.source")}>
          ${SOURCES.map(
            (item) =>
              html`<button type="button" aria-pressed=${String(source === item)} @click=${() => this.change({ source: item })}>
                ${t(`calendar.source.${item}`)}
              </button>`,
          )}
        </div>
      </div>
      ${source === "ha"
        ? html`${this.renderMore(t, hass)} ${this.renderConnect(t)}`
        : source === "mailbox"
          ? this.renderInvite(t)
          : this.renderAccount(t)}
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

  // --- 1: calendars in Home Assistant -----------------------------------------

  private renderMore(t: Translate, hass: HomeAssistant): TemplateResult {
    const calendars = this.need?.calendars ?? [];
    return html`<div class="part" data-tipped>
      <p class="hint">${t("calendar.source.ha.hint")}</p>
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

  // --- 2: invitations to Joe's mailbox ----------------------------------------

  /** The address to invite the car with (Joe's mailbox, e.g. "auto+kona@…"). */
  private renderInvite(t: Translate): TemplateResult {
    const mail = this.mailbox;
    if (!mail?.enabled || !mail.address) {
      return html`<div class="part"><p class="hint">${t("calendar.invite.no_mailbox")}</p></div>`;
    }
    const current = mail.cars[this.actionId] ?? "";
    const [local, domain] = mail.address.split("@");
    const slug = this.carName
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "")
      .slice(0, 20);
    const suggestion = domain && slug ? `${local}+${slug}@${domain}` : mail.address;
    return html`<div class="part" data-tipped>
      <div class="head-row"><b>${t("calendar.invite")}</b> ${tip(t, "calendar_invite")}</div>
      <p class="hint">${t("calendar.source.mailbox.hint")}</p>
      <div class="link">
        <input
          class="input"
          type="email"
          placeholder=${suggestion}
          aria-label=${t("calendar.invite")}
          .value=${current}
          @change=${(ev: Event) => this.saveInvite((ev.target as HTMLInputElement).value.trim().toLowerCase())}
        />
        ${current
          ? nothing
          : html`<button type="button" class="mini-btn" @click=${() => this.saveInvite(suggestion)}>${t("calendar.invite.use")}</button>`}
      </div>
    </div>`;
  }

  private saveInvite(address: string): void {
    saveConfig(this, { mailbox: { cars: { ...(this.mailbox?.cars ?? {}), [this.actionId]: address } } });
  }

  // --- 3: the car's own account ------------------------------------------------

  private renderAccount(t: Translate): TemplateResult {
    const account = { ...DEFAULT_ACCOUNT, ...(this.need?.account ?? {}) };
    const microsoft = MICROSOFT.has(account.kind);
    const status = this.account;
    return html`<div class="part" data-tipped>
      <div class="head-row"><b>${t("calendar.account")}</b> ${tip(t, "calendar_account")}</div>
      <p class="hint">${t("calendar.source.account.hint")}</p>
      <div class="inline">
        <select
          class="input"
          aria-label=${t("calendar.account.kind")}
          @change=${(ev: Event) => this.setAccount({ kind: (ev.target as HTMLSelectElement).value as CarAccountConfig["kind"] })}
        >
          ${KINDS.map((kind) => html`<option value=${kind} ?selected=${kind === account.kind}>${t(`calendar.account.kind.${kind}`)}</option>`)}
        </select>
        <input
          class="input"
          type="email"
          autocomplete="off"
          placeholder=${t("calendar.account.address")}
          aria-label=${t("calendar.account.address")}
          .value=${account.address}
          @change=${(ev: Event) => this.setAccount({ address: (ev.target as HTMLInputElement).value.trim().toLowerCase() })}
        />
      </div>
      ${!this.saved
        ? html`<p class="hint">${t("calendar.account.after_save")}</p>`
        : microsoft
          ? this.renderSignIn(t, account, status)
          : this.renderPassword(t, account, status)}
      <div class="inline">
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(account.accept)}
          aria-label=${t("calendar.account.accept")}
          @click=${() => this.setAccount({ accept: !account.accept })}
        ></button>
        <span>${t("calendar.account.accept")}</span>
        ${tip(t, "calendar_account_accept")}
      </div>
      ${this.saved ? this.renderStatus(t, status) : nothing}
    </div>`;
  }

  private renderSignIn(t: Translate, account: CarAccountConfig, status?: CarAccountStatus): TemplateResult {
    const oauth = status?.oauth;
    const own = this.ownApp || Boolean(account.client_id) || account.kind === "microsoft" || oauth?.error === "no_client_id";
    return html`${own
        ? html`<div class="inline">
            <input
              class="input"
              type="text"
              autocomplete="off"
              placeholder=${t("calendar.account.client_id")}
              aria-label=${t("calendar.account.client_id")}
              .value=${account.client_id ?? ""}
              @change=${(ev: Event) => this.setAccount({ client_id: (ev.target as HTMLInputElement).value.trim() || null })}
            />
            ${account.kind === "microsoft"
              ? html`<input
                  class="input"
                  type="text"
                  placeholder="common"
                  aria-label=${t("mail.tenant")}
                  .value=${account.tenant}
                  @change=${(ev: Event) => this.setAccount({ tenant: (ev.target as HTMLInputElement).value.trim() || "common" })}
                />`
              : nothing}
            ${tip(t, "mail_microsoft")}
          </div>`
        : nothing}
      <div class="inline">
        <button type="button" class="mini-btn go" ?disabled=${this.busy} @click=${() => this.act("sign_in")}>
          <ha-icon icon="mdi:microsoft"></ha-icon>${t(status?.has_secret ? "mail.sign_in.again" : "mail.sign_in")}
        </button>
        ${status?.has_secret ? html`<button type="button" class="mini-btn quiet" @click=${() => this.act("sign_out")}>${t("mail.sign_out")}</button>` : nothing}
        ${!own && account.kind === "outlook"
          ? html`<button type="button" class="mini-btn quiet" @click=${() => (this.ownApp = true)}>${t("calendar.account.own_app")}</button>`
          : nothing}
        ${tip(t, "mail_sign_in")}
      </div>
      ${oauth?.state === "waiting"
        ? html`<p class="code">${t("mail.sign_in.code", { code: oauth.user_code ?? "" })}
            <a href=${oauth.uri ?? "https://microsoft.com/devicelogin"} target="_blank" rel="noreferrer noopener">${oauth.uri}</a></p>`
        : oauth?.state === "error"
          ? html`<p class="bad">${t("mail.sign_in.failed", { error: oauth.error ?? "" })}</p>`
          : status?.has_secret
            ? html`<p class="hint ok">${t("mail.signed_in")}</p>`
            : nothing}`;
  }

  private renderPassword(t: Translate, account: CarAccountConfig, status?: CarAccountStatus): TemplateResult {
    return html`${account.kind === "caldav"
        ? html`<div class="inline">
            <input
              class="input"
              type="url"
              placeholder="https://caldav.example.com/"
              aria-label=${t("calendar.account.url")}
              .value=${account.url ?? ""}
              @change=${(ev: Event) => this.setAccount({ url: (ev.target as HTMLInputElement).value.trim() || null })}
            />
            <input
              class="input"
              type="text"
              placeholder=${t("mail.username")}
              aria-label=${t("mail.username")}
              .value=${account.username ?? ""}
              @change=${(ev: Event) => this.setAccount({ username: (ev.target as HTMLInputElement).value.trim() || null })}
            />
          </div>`
        : nothing}
      <form
        class="inline"
        @submit=${(ev: Event) => {
          ev.preventDefault();
          void this.act("password");
        }}
      >
        <input
          class="input"
          type="password"
          autocomplete="new-password"
          placeholder=${t("mail.password")}
          aria-label=${t("mail.password")}
          .value=${this.password}
          @input=${(ev: Event) => (this.password = (ev.target as HTMLInputElement).value)}
        />
        <button type="submit" class="mini-btn go" ?disabled=${!this.password || this.busy}>${t("common.save")}</button>
        ${tip(t, "calendar_account_password")}
      </form>
      ${status?.has_secret ? html`<p class="hint ok">${t("mail.password.saved")}</p>` : nothing}`;
  }

  private renderStatus(t: Translate, status?: CarAccountStatus): TemplateResult {
    const text =
      status?.state === "error"
        ? t("mail.state.error", { error: t.optional(`calendar.account.error.${status.error}`) ?? String(status.error) })
        : status?.checked
          ? t("mail.state.ok", { time: timeOf(status.checked) })
          : "";
    return html`<div class="inline">
      <button type="button" class="mini-btn" ?disabled=${this.busy || !status?.has_secret} @click=${() => this.act("test")}>
        <ha-icon icon="mdi:calendar-check-outline"></ha-icon>${t("calendar.account.test")}
      </button>
      <span class=${status?.state === "error" ? "bad" : "hint"}>${text}</span>
      ${this.result
        ? html`<span class=${this.result === "ok" ? "ok" : "bad"}>${t.optional(`calendar.account.result.${this.result}`) ?? this.result}</span>`
        : nothing}
    </div>`;
  }

  private async act(what: "password" | "sign_in" | "sign_out" | "test"): Promise<void> {
    this.busy = true;
    this.result = undefined;
    try {
      const answer = await this.hass?.callWS<{ error?: string | null } | null>({
        type: "energy_joe/account",
        car: this.actionId,
        do: what,
        ...(what === "password" ? { password: this.password } : {}),
      });
      if (what === "password") {
        this.password = "";
      }
      if (what === "test") {
        this.result = answer?.error ? answer.error : "ok";
      }
    } catch (err) {
      this.result = (err as { code?: string })?.code ?? "failed";
    } finally {
      this.busy = false;
    }
  }

  private setAccount(change: Partial<CarAccountConfig>): void {
    this.change({ account: { ...DEFAULT_ACCOUNT, ...(this.need?.account ?? {}), ...change } });
  }

  private change(change: Partial<CarNeedConfig>): void {
    this.dispatchEvent(new CustomEvent("joe-need", { detail: change, bubbles: true, composed: true }));
  }

  private async pick(): Promise<void> {
    const t = this.t!;
    const own = this.links?.entities[this.actionId];
    const picked = await pickEntity(this, {
      heading: t("calendar.pick"),
      tip: "calendar_more",
      filter: "calendar",
      selected: this.need?.calendars ?? [],
      multiple: true,
      exclude: own ? [own] : [],
    });
    if (picked) {
      this.change({ calendars: picked.selected.filter((id) => id !== own) });
    }
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
