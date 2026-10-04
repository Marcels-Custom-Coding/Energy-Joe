import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { define } from "../define";
import type { Translate } from "../i18n";
import { shared } from "../styles/shared";
import type { CarAccountConfig, CarAccountStatus, CarNeedConfig, HomeAssistant } from "../types";
import { timeOf } from "./plan-text";
import { tip } from "./tip";

const KINDS: CarAccountConfig["kind"][] = ["google", "outlook", "microsoft", "icloud", "infomaniak", "caldav"];
/** Kinds that sign in with a code instead of a password. */
const SIGN_IN = new Set(["google", "outlook", "microsoft"]);

export const DEFAULT_ACCOUNT: CarAccountConfig = {
  kind: "outlook",
  address: "",
  username: null,
  url: null,
  client_id: null,
  tenant: "common",
  accept: true,
};

/**
 * A car's mailbox with a calendar (Google, Microsoft, iCloud, Infomaniak, CalDAV):
 * invitations land in the account's calendar by themselves, Joe reads it and
 * accepts there.
 */
export class JoeCarAccount extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property() actionId = "";
  /** Saved as an account car already: only then does Joe read the calendar. */
  @property({ type: Boolean }) saved = false;
  @property({ attribute: false }) need?: CarNeedConfig;
  @property({ attribute: false }) status?: CarAccountStatus;
  /** Energy Joe's own apps for signing in (false: one's own app is needed). */
  @property({ attribute: false }) apps?: { microsoft: boolean; google: boolean };

  @state() private password = "";
  @state() private secret = "";
  @state() private result?: string;
  @state() private signInError?: string;
  @state() private busy = false;
  @state() private ownApp = false;

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
    `,
  ];

  protected render() {
    const t = this.t;
    if (!t) {
      return nothing;
    }
    const account = this.account;
    const signIn = SIGN_IN.has(account.kind);
    return html`<div class="field" data-tipped>
        <div class="head-row"><label for="account-kind"><b>${t("calendar.account.kind")}</b></label> ${tip(t, "calendar_account")}</div>
        <select id="account-kind" class="input" @change=${(ev: Event) => this.set({ kind: (ev.target as HTMLSelectElement).value as CarAccountConfig["kind"] })}>
          ${KINDS.map((kind) => html`<option value=${kind} ?selected=${kind === account.kind}>${t(`calendar.account.kind.${kind}`)}</option>`)}
        </select>
      </div>
      <div class="field" data-tipped>
        <div class="head-row"><label for="account-address"><b>${t("calendar.account.address")}</b></label> ${tip(t, "calendar_account_address")}</div>
        <input
          id="account-address"
          class="input"
          type="email"
          autocomplete="off"
          placeholder=${t(`calendar.account.placeholder.${account.kind}`)}
          .value=${account.address}
          @change=${(ev: Event) => this.set({ address: (ev.target as HTMLInputElement).value.trim().toLowerCase() })}
        />
        ${account.kind === "google" ? html`<p class="hint">${t("calendar.account.google.hint")}</p>` : nothing}
      </div>
      ${signIn ? this.renderSignIn(t, account) : this.renderPassword(t, account)}
      <div class="inline" data-tipped>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(account.accept)}
          aria-label=${t("calendar.account.accept")}
          @click=${() => this.set({ accept: !account.accept })}
        ></button>
        <span>${t("calendar.account.accept")}</span>
        ${tip(t, "calendar_account_accept")}
      </div>
      ${this.renderStatus(t)}`;
  }

  private get account(): CarAccountConfig {
    return { ...DEFAULT_ACCOUNT, ...(this.need?.account ?? {}) };
  }

  /** Whether Energy Joe brings its own app for this kind of account. */
  private joeApp(kind: CarAccountConfig["kind"]): boolean {
    return kind === "google" ? Boolean(this.apps?.google) : Boolean(this.apps?.microsoft);
  }

  private renderSignIn(t: Translate, account: CarAccountConfig): TemplateResult {
    const status = this.status;
    const oauth = status?.oauth;
    const google = account.kind === "google";
    const joeApp = this.joeApp(account.kind);
    const own = !joeApp || this.ownApp || Boolean(account.client_id) || account.kind === "microsoft";
    const signedIn = Boolean(status?.has_sign_in);
    const error = this.signInError ?? (oauth?.state === "error" ? oauth.error : undefined);
    return html`${own ? this.renderOwnApp(t, account, joeApp) : nothing}
      <div class="field" data-tipped>
        <div class="inline">
          <button type="button" class="mini-btn go" ?disabled=${this.busy} @click=${() => this.act("sign_in")}>
            <ha-icon icon=${google ? "mdi:google" : "mdi:microsoft"}></ha-icon>${t(
              signedIn ? "mail.sign_in.again" : google ? "mail.sign_in.google" : "mail.sign_in",
            )}
          </button>
          ${signedIn ? html`<button type="button" class="mini-btn quiet" @click=${() => this.act("sign_out")}>${t("mail.sign_out")}</button>` : nothing}
          ${!own ? html`<button type="button" class="mini-btn quiet" @click=${() => (this.ownApp = true)}>${t("calendar.account.own_app")}</button>` : nothing}
          ${tip(t, "mail_sign_in")}
        </div>
        ${oauth?.state === "waiting" && !this.signInError
          ? html`<p class="code">${t("mail.sign_in.code", { code: oauth.user_code ?? "" })}
              <a href=${oauth.uri ?? ""} target="_blank" rel="noreferrer noopener">${oauth.uri}</a></p>`
          : error
            ? html`<p class="bad">${t.optional(`calendar.account.oauth.${error}`) ?? t("calendar.account.oauth.other")}</p>`
            : signedIn
              ? html`<p class="hint ok">${t("mail.signed_in")}</p>`
              : nothing}
      </div>`;
  }

  /** One's own app instead of Joe's: its id (and tenant, or Google's secret). */
  private renderOwnApp(t: Translate, account: CarAccountConfig, joeApp: boolean): TemplateResult {
    const google = account.kind === "google";
    return html`<div class="field" data-tipped>
      <div class="head-row">
        <b>${t(joeApp ? "calendar.account.client_id" : "calendar.account.client_id.needed")}</b>
        ${tip(t, google ? "google_app" : "mail_microsoft")}
      </div>
      ${joeApp ? nothing : html`<p class="hint">${t("calendar.account.no_joe_app")}</p>`}
      <div class="inline">
        <input
          class="input"
          type="text"
          autocomplete="off"
          placeholder=${google ? "1234567890-abc.apps.googleusercontent.com" : "00000000-0000-0000-0000-000000000000"}
          aria-label=${t("calendar.account.client_id")}
          .value=${account.client_id ?? ""}
          @change=${(ev: Event) => this.set({ client_id: (ev.target as HTMLInputElement).value.trim() || null })}
        />
        ${account.kind === "microsoft"
          ? html`<input
              class="input"
              type="text"
              placeholder="common"
              aria-label=${t("mail.tenant")}
              .value=${account.tenant}
              @change=${(ev: Event) => this.set({ tenant: (ev.target as HTMLInputElement).value.trim() || "common" })}
            />`
          : nothing}
      </div>
      ${google
        ? html`<form
            class="inline"
            @submit=${(ev: Event) => {
              ev.preventDefault();
              void this.act("client_secret");
            }}
          >
            <input
              class="input"
              type="password"
              autocomplete="off"
              placeholder=${t("calendar.account.client_secret")}
              aria-label=${t("calendar.account.client_secret")}
              .value=${this.secret}
              @input=${(ev: Event) => (this.secret = (ev.target as HTMLInputElement).value)}
            />
            <button type="submit" class="mini-btn" ?disabled=${!this.secret || this.busy}>${t("common.save")}</button>
          </form>
          ${this.status?.has_client_secret ? html`<p class="hint ok">${t("mail.password.saved")}</p>` : nothing}`
        : nothing}
    </div>`;
  }

  private renderPassword(t: Translate, account: CarAccountConfig): TemplateResult {
    return html`${account.kind === "caldav"
        ? html`<div class="field" data-tipped>
            <div class="head-row"><b>${t("calendar.account.url")}</b> ${tip(t, "calendar_account_url")}</div>
            <div class="inline">
              <input
                class="input"
                type="url"
                placeholder="https://caldav.example.com/"
                aria-label=${t("calendar.account.url")}
                .value=${account.url ?? ""}
                @change=${(ev: Event) => this.set({ url: (ev.target as HTMLInputElement).value.trim() || null })}
              />
              <input
                class="input"
                type="text"
                placeholder=${t("mail.username")}
                aria-label=${t("mail.username")}
                .value=${account.username ?? ""}
                @change=${(ev: Event) => this.set({ username: (ev.target as HTMLInputElement).value.trim() || null })}
              />
            </div>
          </div>`
        : nothing}
      <div class="field" data-tipped>
        <div class="head-row"><label for="account-password"><b>${t("calendar.account.password")}</b></label> ${tip(t, "calendar_account_password")}</div>
        <form
          class="inline"
          @submit=${(ev: Event) => {
            ev.preventDefault();
            void this.act("password");
          }}
        >
          <input
            id="account-password"
            class="input"
            type="password"
            autocomplete="new-password"
            .value=${this.password}
            @input=${(ev: Event) => (this.password = (ev.target as HTMLInputElement).value)}
          />
          <button type="submit" class="mini-btn go" ?disabled=${!this.password || this.busy}>${t("common.save")}</button>
        </form>
        ${this.status?.has_password ? html`<p class="hint ok">${t("mail.password.saved")}</p>` : nothing}
      </div>`;
  }

  private renderStatus(t: Translate): TemplateResult {
    const status = this.status;
    const ready = SIGN_IN.has(this.account.kind) ? status?.has_sign_in : status?.has_password;
    const text = !this.saved
      ? t("calendar.account.after_save")
      : status?.state === "error"
        ? t("mail.state.error", { error: t.optional(`calendar.account.error.${status.error}`) ?? t("calendar.account.error.other") })
        : status?.checked
          ? t("mail.state.ok", { time: timeOf(status.checked) })
          : "";
    return html`<div class="inline" data-tipped>
      <button type="button" class="mini-btn" ?disabled=${this.busy || !ready} @click=${() => this.act("test")}>
        <ha-icon icon="mdi:calendar-check-outline"></ha-icon>${t("calendar.account.test")}
      </button>
      ${tip(t, "calendar_account_test")}
      <span class=${this.saved && status?.state === "error" ? "bad" : "hint"}>${text}</span>
      ${this.result
        ? html`<span class=${this.result === "ok" ? "ok" : "bad"}>
            ${t.optional(`calendar.account.result.${this.result}`) ?? t("calendar.account.result.other")}
          </span>`
        : nothing}
    </div>`;
  }

  private async act(what: "password" | "client_secret" | "sign_in" | "sign_out" | "test"): Promise<void> {
    this.busy = true;
    this.result = undefined;
    if (what === "sign_in" || what === "sign_out") {
      this.signInError = undefined;
    }
    try {
      const answer = await this.hass?.callWS<{ error?: string | null } | null>({
        type: "energy_joe/account",
        car: this.actionId,
        do: what,
        ...(what === "password" ? { password: this.password } : {}),
        ...(what === "client_secret" ? { password: this.secret } : {}),
        // Sign-in and test with the settings as they are here, saved or not.
        ...(what === "sign_in" || what === "test" ? { account: this.account } : {}),
      });
      if (what === "password") {
        this.password = "";
      }
      if (what === "client_secret") {
        this.secret = "";
      }
      if (what === "test") {
        this.result = answer?.error ? answer.error : "ok";
      }
    } catch (err) {
      const { code = "failed", message } = (err as { code?: string; message?: string }) ?? {};
      if (what === "sign_in") {
        // "oauth": Microsoft or Google refused; their reason comes as the message.
        this.signInError = code === "oauth" ? message || code : code;
      } else {
        this.result = code;
      }
    } finally {
      this.busy = false;
    }
  }

  private set(change: Partial<CarAccountConfig>): void {
    this.dispatchEvent(new CustomEvent("joe-need", { detail: { account: { ...this.account, ...change } }, bubbles: true, composed: true }));
  }
}

define("joe-car-account", JoeCarAccount);
