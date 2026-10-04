import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { define } from "../define";
import type { Translate } from "../i18n";
import { shared } from "../styles/shared";
import type { CarMailboxConfig, CarMailboxStatus, CarNeedConfig, HomeAssistant, MailProvider } from "../types";
import { timeOf } from "./plan-text";
import { tip } from "./tip";

const PROVIDERS: MailProvider[] = ["webde", "gmx", "google", "tonline", "other"];
/** The provider an address belongs to, by its domain. */
const DOMAINS: Record<string, MailProvider> = {
  "web.de": "webde",
  "gmx.de": "gmx",
  "gmx.net": "gmx",
  "gmx.at": "gmx",
  "gmx.ch": "gmx",
  "gmail.com": "google",
  "googlemail.com": "google",
  "t-online.de": "tonline",
};

export const DEFAULT_MAILBOX: CarMailboxConfig = {
  provider: "other",
  address: "",
  username: null,
  imap_host: null,
  imap_port: null,
  smtp_host: null,
  smtp_port: null,
  smtp_security: null,
  accept: true,
};

/**
 * A car's mailbox without a calendar (web.de, GMX, Gmail …): Joe reads the
 * invitations there, accepts them and puts them into his calendar for the car.
 */
export class JoeCarMailbox extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property() actionId = "";
  /** Saved as a mailbox car already: only then can Joe look into it. */
  @property({ type: Boolean }) saved = false;
  @property({ attribute: false }) need?: CarNeedConfig;
  @property({ attribute: false }) status?: CarMailboxStatus;

  @state() private password = "";
  @state() private busy = false;
  @state() private result?: string;
  @state() private servers = false;

  static styles = [
    shared,
    css`
      :host {
        display: grid;
        gap: 10px;
      }
      .field {
        display: grid;
        gap: 4px;
      }
      .head-row {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .head-row b {
        font-weight: 600;
      }
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
      .inline .input.port {
        flex: 0 1 110px;
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
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 4px;
      }
      li {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 4px 10px;
        padding: 6px 10px;
        border-radius: 9px;
        background: var(--joe-surface);
        font-size: 13.5px;
      }
      li .what {
        flex: 1 1 200px;
        min-width: 0;
        overflow-wrap: anywhere;
      }
    `,
  ];

  protected render() {
    const t = this.t;
    if (!t) {
      return nothing;
    }
    const mail = this.mailbox;
    // Servers only for another provider (once there is an address) or on request.
    const custom = this.servers || (mail.provider === "other" && Boolean(mail.address));
    return html`<div class="field" data-tipped>
        <div class="head-row"><label for="mail-address"><b>${t("mail.address")}</b></label> ${tip(t, "mail_address")}</div>
        <input
          id="mail-address"
          class="input"
          type="email"
          autocomplete="off"
          placeholder=${t("mail.address.placeholder")}
          .value=${mail.address}
          @change=${(ev: Event) => this.setAddress((ev.target as HTMLInputElement).value.trim().toLowerCase())}
        />
      </div>
      <div class="field" data-tipped>
        <div class="head-row"><label for="mail-provider"><b>${t("mail.provider")}</b></label> ${tip(t, "mail_provider")}</div>
        <select id="mail-provider" class="input" @change=${(ev: Event) => this.set({ provider: (ev.target as HTMLSelectElement).value as MailProvider })}>
          ${PROVIDERS.map((p) => html`<option value=${p} ?selected=${p === mail.provider}>${t(`mail.provider.${p}`)}</option>`)}
        </select>
        <p class="hint">${t(`mail.provider.${mail.provider}.hint`)}</p>
      </div>
      ${this.renderPassword(t)} ${custom ? this.renderServers(t, mail) : nothing}
      <div class="inline" data-tipped>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(mail.accept)}
          aria-label=${t("mail.accept")}
          @click=${() => this.set({ accept: !mail.accept })}
        ></button>
        <span>${t("mail.accept")}</span>
        ${tip(t, "mail_accept")}
        ${custom
          ? nothing
          : html`<button type="button" class="mini-btn quiet" @click=${() => (this.servers = true)}>${t("mail.servers.change")}</button>`}
      </div>
      ${this.saved ? this.renderStatus(t) : html`<p class="hint">${t("mail.after_save")}</p>`} ${this.renderRecent(t)}`;
  }

  private get mailbox(): CarMailboxConfig {
    return { ...DEFAULT_MAILBOX, ...(this.need?.mailbox ?? {}) };
  }

  private renderPassword(t: Translate): TemplateResult {
    return html`<div class="field" data-tipped>
      <div class="head-row"><label for="mail-password"><b>${t("mail.password")}</b></label> ${tip(t, "mail_password")}</div>
      <form
        class="inline"
        @submit=${(ev: Event) => {
          ev.preventDefault();
          void this.act("secret");
        }}
      >
        <input
          id="mail-password"
          class="input"
          type="password"
          autocomplete="new-password"
          .value=${this.password}
          @input=${(ev: Event) => (this.password = (ev.target as HTMLInputElement).value)}
        />
        <button type="submit" class="mini-btn go" ?disabled=${!this.password || this.busy}>${t("common.save")}</button>
      </form>
      ${this.status?.has_secret ? html`<p class="hint ok">${t("mail.password.saved")}</p>` : html`<p class="hint">${t("mail.password.hint")}</p>`}
    </div>`;
  }

  private renderServers(t: Translate, mail: CarMailboxConfig): TemplateResult {
    const field = (key: "imap_host" | "smtp_host" | "username") => html`<input
      class="input"
      type="text"
      aria-label=${t(`mail.${key}`)}
      placeholder=${t(`mail.${key}`)}
      .value=${mail[key] ?? ""}
      @change=${(ev: Event) => this.set({ [key]: (ev.target as HTMLInputElement).value.trim() || null })}
    />`;
    const port = (key: "imap_port" | "smtp_port") => html`<input
      class="input port"
      type="number"
      min="1"
      max="65535"
      aria-label=${t(`mail.${key}`)}
      placeholder=${t(`mail.${key}`)}
      .value=${mail[key] == null ? "" : String(mail[key])}
      @change=${(ev: Event) => {
        const value = Number.parseInt((ev.target as HTMLInputElement).value, 10);
        this.set({ [key]: Number.isFinite(value) && value > 0 && value < 65536 ? value : null });
      }}
    />`;
    return html`<div class="field" data-tipped>
      <div class="head-row"><b>${t("mail.servers")}</b> ${tip(t, "mail_servers")}</div>
      <p class="hint">${t("mail.servers.hint")}</p>
      <div class="inline">${field("username")}</div>
      <div class="inline">${field("imap_host")} ${port("imap_port")}</div>
      <div class="inline">
        ${field("smtp_host")} ${port("smtp_port")}
        <select
          class="input port"
          aria-label=${t("mail.smtp_security")}
          @change=${(ev: Event) => this.set({ smtp_security: ((ev.target as HTMLSelectElement).value || null) as CarMailboxConfig["smtp_security"] })}
        >
          <option value="" ?selected=${!mail.smtp_security}>${t("mail.smtp_security.auto")}</option>
          <option value="starttls" ?selected=${mail.smtp_security === "starttls"}>STARTTLS</option>
          <option value="ssl" ?selected=${mail.smtp_security === "ssl"}>SSL/TLS</option>
        </select>
      </div>
    </div>`;
  }

  private renderStatus(t: Translate): TemplateResult {
    return html`<div class="field" data-tipped>
      <div class="inline">
        <button type="button" class="mini-btn" ?disabled=${this.busy || !this.status?.has_secret} @click=${() => this.act("test")}>
          <ha-icon icon="mdi:connection"></ha-icon>${t("mail.test")}
        </button>
        <button type="button" class="mini-btn" ?disabled=${this.busy || !this.status?.has_secret} @click=${() => this.act("check")}>
          <ha-icon icon="mdi:email-sync-outline"></ha-icon>${t("mail.check")}
        </button>
        ${tip(t, "mail_status")}
      </div>
      <p class=${this.status?.state === "error" ? "hint bad" : "hint"}>${this.statusText(t)}</p>
      ${this.result
        ? html`<p class=${this.result === "ok" ? "hint ok" : "hint bad"} role="status">
            ${t.optional(`mail.result.${this.result}`) ?? t("mail.result.failed")}
          </p>`
        : nothing}
    </div>`;
  }

  private renderRecent(t: Translate): TemplateResult | typeof nothing {
    const recent = this.status?.recent ?? [];
    if (!recent.length) {
      return nothing;
    }
    const allowed = this.need?.allowed ?? [];
    return html`<div class="field" data-tipped>
      <div class="head-row"><b>${t("mail.recent")}</b> ${tip(t, "mail_recent")}</div>
      <ul>
        ${recent.slice(0, 8).map(
          (entry) => html`<li>
            <span class="what">
              ${entry.summary || "–"} ${entry.start && entry.start.includes("T") ? `· ${entry.start.slice(8, 10)}.${entry.start.slice(5, 7)}. ${timeOf(entry.start)}` : ""}
              · ${entry.from}
            </span>
            <span class=${entry.result.startsWith("not") || entry.result.endsWith("not_accepted") || entry.result.startsWith("no_") ? "bad" : ""}>
              ${t.optional(`mail.recent.${entry.result}`) ?? entry.result}
            </span>
            ${entry.result === "not_allowed" && !allowed.includes(entry.from)
              ? html`<button type="button" class="mini-btn" @click=${() => this.change({ allowed: [...allowed, entry.from] })}>${t("mail.allow")}</button>`
              : nothing}
          </li>`,
        )}
      </ul>
    </div>`;
  }

  private statusText(t: Translate): string {
    const status = this.status;
    if (!status || status.state === "off" || status.state === "waiting") {
      return t("mail.state.waiting");
    }
    if (status.state === "no_secret") {
      return t("mail.state.no_secret");
    }
    if (status.state === "error") {
      return t("mail.state.error", { error: t.optional(`mail.error.${status.error}`) ?? String(status.error) });
    }
    return t("mail.state.ok", { time: status.checked ? timeOf(status.checked) : "–" });
  }

  /** A new address: the provider follows its domain unless one was picked. */
  private setAddress(address: string): void {
    const domain = address.split("@")[1] ?? "";
    const guessed = DOMAINS[domain];
    const current = this.mailbox;
    const wasGuessed = current.provider === "other" || current.provider === DOMAINS[current.address.split("@")[1] ?? ""];
    this.set(guessed && wasGuessed ? { address, provider: guessed } : { address });
  }

  private set(change: Partial<CarMailboxConfig>): void {
    this.change({ mailbox: { ...this.mailbox, ...change } });
  }

  private change(change: Partial<CarNeedConfig>): void {
    this.dispatchEvent(new CustomEvent("joe-need", { detail: change, bubbles: true, composed: true }));
  }

  private async act(what: "secret" | "test" | "check"): Promise<void> {
    this.busy = true;
    this.result = undefined;
    try {
      if (what === "secret") {
        await this.hass?.callWS({ type: "energy_joe/mailbox/secret", car: this.actionId, password: this.password });
        this.password = "";
      } else if (what === "test") {
        const answer = await this.hass?.callWS<{ error: string | null }>({ type: "energy_joe/mailbox/test", car: this.actionId });
        this.result = answer?.error ? `error_${answer.error}` : "ok";
      } else {
        await this.hass?.callWS({ type: "energy_joe/mailbox/check", car: this.actionId });
      }
    } catch {
      this.result = "failed";
    } finally {
      this.busy = false;
    }
  }
}

define("joe-car-mailbox", JoeCarMailbox);
