import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { saveConfig } from "../config";
import { define } from "../define";
import type { Translate } from "../i18n";
import { shared } from "../styles/shared";
import type { HomeAssistant, JoeConfig, MailboxConfig, MailboxStatus, MailProvider } from "../types";
import { timeOf } from "./plan-text";
import { tip } from "./tip";

const PROVIDERS: MailProvider[] = ["icloud", "google", "infomaniak", "outlook", "microsoft", "other"];

/**
 * Joe's mailbox for car appointments: invite the car like a person, Joe puts
 * the appointment into the car's calendar and accepts it.
 */
export class JoeMailboxSettings extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) config?: JoeConfig;
  @property({ attribute: false }) status?: MailboxStatus;

  @state() private password = "";
  @state() private sender = "";
  @state() private busy = false;
  @state() private result?: string;
  @state() private servers = false;

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      /* The same rows as on the settings page. */
      .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px 16px;
        flex-wrap: wrap;
        padding: 14px 0;
        border-top: 1px solid var(--joe-line);
      }
      .row > div:first-child {
        flex: 1 1 260px;
        min-width: 0;
      }
      .row b {
        display: block;
        font-weight: 700;
      }
      .name {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .row small {
        display: block;
        color: var(--joe-muted);
        font-size: 13px;
        margin-top: 2px;
        max-width: 52ch;
      }
      .row > .input,
      .row > select {
        width: auto;
        flex: 0 1 300px;
        min-width: 0;
      }
      .row > .inline,
      .row > .chips {
        flex: 1 1 300px;
        justify-content: flex-end;
      }
      .intro {
        margin: 0 0 6px;
        color: var(--joe-ink-2);
        font-size: 14px;
        line-height: 1.5;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
      }
      .inline {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
      }
      .inline .input {
        width: auto;
        flex: 1 1 200px;
        min-width: 0;
      }
      ul {
        list-style: none;
        margin: 6px 0 0;
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
        background: var(--joe-surface-2);
        font-size: 13.5px;
      }
      li .what {
        flex: 1 1 200px;
        min-width: 0;
        overflow-wrap: anywhere;
      }
      li .bad {
        color: var(--joe-warn, var(--joe-crit));
      }
      .ok {
        color: var(--joe-good);
      }
      .bad {
        color: var(--joe-warn, var(--joe-crit));
      }
      .code {
        margin: 6px 0 0;
        font-size: 15px;
        font-weight: 600;
      }
    `,
  ];

  protected render() {
    const { t, config } = this;
    if (!t || !config) {
      return nothing;
    }
    const mail = config.mailbox;
    return html`<p class="intro">${t("mail.intro")}</p>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b id="mail-on">${t("mail.enabled")}</b>${tip(t, "mail_enabled")}</div>
          <small>${t("mail.enabled.hint")}</small>
        </div>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(mail.enabled)}
          aria-labelledby="mail-on"
          @click=${() => this.save({ enabled: !mail.enabled })}
        ></button>
      </div>
      ${mail.enabled ? this.renderSettings(t, mail) : nothing} ${this.renderAllowed(t, mail)}`;
  }

  /** Who may invite: for Joe's mailbox and for the cars' own accounts. */
  private renderAllowed(t: Translate, mail: MailboxConfig): TemplateResult {
    return html`<div class="row" data-tipped>
        <div>
          <div class="name"><b>${t("mail.allowed")}</b>${tip(t, "mail_allowed")}</div>
          <small>${t("mail.allowed.hint")}</small>
        </div>
        <div class="chips">
          ${mail.allowed.map(
            (rule) => html`<span class="chip">
              ${rule}
              <button type="button" class="mini-btn quiet" aria-label=${t("mail.allowed.remove", { rule })} @click=${() => this.save({ allowed: mail.allowed.filter((r) => r !== rule) })}>
                <ha-icon icon="mdi:close"></ha-icon>
              </button>
            </span>`,
          )}
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
              placeholder="name@example.org, @firma.de"
              aria-label=${t("mail.allowed.add")}
              .value=${this.sender}
              @input=${(ev: Event) => (this.sender = (ev.target as HTMLInputElement).value)}
            />
            <button type="submit" class="mini-btn" ?disabled=${!this.sender.trim()}>${t("mail.allowed.add")}</button>
          </form>
        </div>
      </div>`;
  }

  private renderSettings(t: Translate, mail: MailboxConfig): TemplateResult {
    const status = this.status;
    return html`<div class="row" data-tipped>
        <div>
          <div class="name"><label for="mail-provider"><b>${t("mail.provider")}</b></label>${tip(t, "mail_provider")}</div>
          <small>${t(`mail.provider.${mail.provider}.hint`)}</small>
        </div>
        <select id="mail-provider" class="input" @change=${(ev: Event) => this.save({ provider: (ev.target as HTMLSelectElement).value as MailProvider })}>
          ${PROVIDERS.map((p) => html`<option value=${p} ?selected=${p === mail.provider}>${t(`mail.provider.${p}`)}</option>`)}
        </select>
      </div>
      <div class="row" data-tipped>
        <div>
          <div class="name"><label for="mail-address"><b>${t("mail.address")}</b></label>${tip(t, "mail_address")}</div>
          <small>${t("mail.address.hint")}</small>
        </div>
        <input
          id="mail-address"
          class="input"
          type="email"
          autocomplete="off"
          .value=${mail.address}
          @change=${(ev: Event) => this.save({ address: (ev.target as HTMLInputElement).value.trim() })}
        />
      </div>
      ${mail.provider === "microsoft" || mail.provider === "outlook" ? this.renderMicrosoft(t, mail) : this.renderPassword(t)}
      ${mail.provider === "other" || this.servers ? this.renderServers(t, mail) : html`<div class="row" data-tipped>
            <div>
              <div class="name"><b>${t("mail.servers")}</b>${tip(t, "mail_servers")}</div>
              <small>${t("mail.servers.preset")}</small>
            </div>
            <button type="button" class="mini-btn quiet" @click=${() => (this.servers = true)}>${t("mail.servers.change")}</button>
          </div>`}
      <div class="row" data-tipped>
        <div>
          <div class="name"><b id="mail-accept">${t("mail.accept")}</b>${tip(t, "mail_accept")}</div>
          <small>${t("mail.accept.hint")}</small>
        </div>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(mail.accept)}
          aria-labelledby="mail-accept"
          @click=${() => this.save({ accept: !mail.accept })}
        ></button>
      </div>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${t("mail.status")}</b>${tip(t, "mail_status")}</div>
          <small>${this.statusText(t)}</small>
        </div>
        <div class="inline">
          <button type="button" class="mini-btn" ?disabled=${this.busy} @click=${() => this.test()}>
            <ha-icon icon="mdi:connection"></ha-icon>${t("mail.test")}
          </button>
          <button type="button" class="mini-btn" ?disabled=${this.busy || !status?.has_secret} @click=${() => this.check()}>
            <ha-icon icon="mdi:email-sync-outline"></ha-icon>${t("mail.check")}
          </button>
        </div>
      </div>
      ${this.result ? html`<div class="note ${this.result === "ok" ? "" : "warn"}" role="status">${t(`mail.result.${this.result}` as "mail.result.ok")}</div>` : nothing}
      ${this.renderRecent(t)}`;
  }

  private renderPassword(t: Translate): TemplateResult {
    const status = this.status;
    return html`<div class="row" data-tipped>
        <div>
          <div class="name"><label for="mail-password"><b>${t("mail.password")}</b></label>${tip(t, "mail_password")}</div>
          <small>${status?.has_secret ? html`<span class="ok">${t("mail.password.saved")}</span>` : t("mail.password.hint")}</small>
        </div>
        <form
          class="inline"
          @submit=${(ev: Event) => {
            ev.preventDefault();
            void this.savePassword();
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
      </div>`;
  }

  /** Microsoft: the app registration, then a code to sign in with. */
  private renderMicrosoft(t: Translate, mail: MailboxConfig): TemplateResult {
    const oauth = this.status?.oauth;
    const signed = this.status?.has_secret;
    // Personal accounts sign in with Energy Joe's own app; a company may use its own.
    const personal = mail.provider === "outlook";
    const ownApp = !personal || this.servers || Boolean(mail.client_id) || oauth?.error === "no_client_id";
    return html`${ownApp
        ? html`<div class="row" data-tipped>
        <div>
          <div class="name"><label for="mail-client"><b>${t("mail.client_id")}</b></label>${tip(t, "mail_microsoft")}</div>
          <small>${t(personal ? "mail.client_id.personal" : "mail.client_id.hint")}</small>
        </div>
        <div class="inline">
          <input
            id="mail-client"
            class="input"
            type="text"
            autocomplete="off"
            placeholder="00000000-0000-0000-0000-000000000000"
            .value=${mail.client_id ?? ""}
            @change=${(ev: Event) => this.save({ client_id: (ev.target as HTMLInputElement).value.trim() || null })}
          />
          ${personal
            ? nothing
            : html`<input
                class="input"
                type="text"
                aria-label=${t("mail.tenant")}
                placeholder="common"
                .value=${mail.tenant}
                @change=${(ev: Event) => this.save({ tenant: (ev.target as HTMLInputElement).value.trim() || "common" })}
              />`}
        </div>
      </div>`
        : nothing}
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${t("mail.sign_in")}</b>${tip(t, "mail_sign_in")}</div>
          <small>${signed ? html`<span class="ok">${t("mail.signed_in")}</span>` : t("mail.sign_in.hint")}</small>
          ${oauth?.state === "waiting"
            ? html`<p class="code">${t("mail.sign_in.code", { code: oauth.user_code ?? "" })}
                <a href=${oauth.uri ?? "https://microsoft.com/devicelogin"} target="_blank" rel="noreferrer noopener">${oauth.uri}</a></p>`
            : oauth?.state === "error"
              ? html`<p class="bad">${t("mail.sign_in.failed", { error: oauth.error ?? "" })}</p>`
              : nothing}
        </div>
        <div class="inline">
          <button type="button" class="mini-btn go" ?disabled=${this.busy} @click=${() => this.signIn(true)}>
            <ha-icon icon="mdi:microsoft"></ha-icon>${t(signed ? "mail.sign_in.again" : "mail.sign_in")}
          </button>
          ${signed
            ? html`<button type="button" class="mini-btn quiet" @click=${() => this.signIn(false)}>${t("mail.sign_out")}</button>`
            : nothing}
        </div>
      </div>`;
  }

  private async signIn(start: boolean): Promise<void> {
    this.busy = true;
    try {
      await this.hass?.callWS({ type: "energy_joe/mailbox/sign_in", start });
      this.result = undefined;
    } catch {
      this.result = "failed";
    } finally {
      this.busy = false;
    }
  }

  private renderServers(t: Translate, mail: MailboxConfig): TemplateResult {
    const field = (key: "imap_host" | "smtp_host" | "username", type = "text") => html`<input
      class="input"
      type=${type}
      aria-label=${t(`mail.${key}`)}
      placeholder=${t(`mail.${key}`)}
      .value=${mail[key] ?? ""}
      @change=${(ev: Event) => this.save({ [key]: (ev.target as HTMLInputElement).value.trim() || null })}
    />`;
    const port = (key: "imap_port" | "smtp_port") => html`<input
      class="input"
      type="number"
      min="1"
      max="65535"
      aria-label=${t(`mail.${key}`)}
      placeholder=${t(`mail.${key}`)}
      .value=${mail[key] == null ? "" : String(mail[key])}
      @change=${(ev: Event) => {
        const value = Number.parseInt((ev.target as HTMLInputElement).value, 10);
        this.save({ [key]: Number.isFinite(value) && value > 0 && value < 65536 ? value : null });
      }}
    />`;
    return html`<div class="row" data-tipped>
      <div>
        <div class="name"><b>${t("mail.servers")}</b>${tip(t, "mail_servers")}</div>
        <small>${t("mail.servers.hint")}</small>
      </div>
      <div class="inline">
        ${field("username")} ${field("imap_host")} ${port("imap_port")} ${field("smtp_host")} ${port("smtp_port")}
        <select
          class="input"
          aria-label=${t("mail.smtp_security")}
          @change=${(ev: Event) => this.save({ smtp_security: ((ev.target as HTMLSelectElement).value || null) as MailboxConfig["smtp_security"] })}
        >
          <option value="" ?selected=${!mail.smtp_security}>${t("mail.smtp_security.auto")}</option>
          <option value="starttls" ?selected=${mail.smtp_security === "starttls"}>STARTTLS</option>
          <option value="ssl" ?selected=${mail.smtp_security === "ssl"}>SSL/TLS</option>
        </select>
      </div>
    </div>`;
  }

  private renderRecent(t: Translate): TemplateResult | typeof nothing {
    const recent = this.status?.recent ?? [];
    if (!recent.length) {
      return nothing;
    }
    const cars = Object.fromEntries((this.config?.actions ?? []).map((a) => [a.id, a.name]));
    return html`<div data-tipped>
      <div class="name"><b>${t("mail.recent")}</b>${tip(t, "mail_recent")}</div>
      <ul>
        ${recent.slice(0, 8).map(
          (entry) => html`<li>
            <span class="what">
              ${entry.summary || "–"} ${entry.start && entry.start.includes("T") ? `· ${entry.start.slice(8, 10)}.${entry.start.slice(5, 7)}. ${timeOf(entry.start)}` : ""}
              · ${entry.from}${entry.car ? ` → ${cars[entry.car] ?? entry.car}` : ""}
            </span>
            <span class=${entry.result.startsWith("not") || entry.result.endsWith("not_accepted") || entry.result.startsWith("no_") ? "bad" : ""}>
              ${t.optional(`mail.recent.${entry.result}`) ?? entry.result}
            </span>
            ${entry.result === "not_allowed"
              ? html`<button type="button" class="mini-btn" @click=${() => this.allow(entry.from)}>${t("mail.allow")}</button>`
              : nothing}
          </li>`,
        )}
      </ul>
    </div>`;
  }

  private statusText(t: Translate): string {
    const status = this.status;
    if (!status || status.state === "off") {
      return t("mail.state.off");
    }
    if (status.state === "no_secret") {
      return t("mail.state.no_secret");
    }
    const checked = status.checked ? timeOf(status.checked) : "–";
    if (status.state === "error") {
      return t("mail.state.error", { error: t.optional(`mail.error.${status.error}`) ?? String(status.error) });
    }
    return t("mail.state.ok", { time: checked });
  }

  private save(change: Partial<MailboxConfig>): void {
    saveConfig(this, { mailbox: change });
  }

  private allow(rule: string): void {
    const value = rule.trim().toLowerCase();
    const allowed = this.config?.mailbox.allowed ?? [];
    if (value && !allowed.includes(value)) {
      this.save({ allowed: [...allowed, value] });
    }
    this.sender = "";
  }

  private async savePassword(): Promise<void> {
    this.busy = true;
    try {
      await this.hass?.callWS({ type: "energy_joe/mailbox/secret", password: this.password });
      this.password = "";
      this.result = undefined;
    } catch {
      this.result = "failed";
    } finally {
      this.busy = false;
    }
  }

  private async test(): Promise<void> {
    this.busy = true;
    try {
      const answer = await this.hass?.callWS<{ error: string | null }>({ type: "energy_joe/mailbox/test" });
      this.result = answer?.error ? `error_${answer.error}` : "ok";
    } catch {
      this.result = "failed";
    } finally {
      this.busy = false;
    }
  }

  private async check(): Promise<void> {
    this.busy = true;
    try {
      await this.hass?.callWS({ type: "energy_joe/mailbox/check" });
      this.result = undefined;
    } catch {
      this.result = "failed";
    } finally {
      this.busy = false;
    }
  }
}

define("joe-mailbox-settings", JoeMailboxSettings);
