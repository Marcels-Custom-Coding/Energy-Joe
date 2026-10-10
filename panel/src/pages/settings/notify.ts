import { html, nothing, type TemplateResult } from "lit";
import { state } from "lit/decorators.js";
import { tip } from "../../components/tip";
import { saveConfig } from "../../config";
import { define } from "../../define";
import type { Translate } from "../../i18n";
import { shared } from "../../styles/shared";
import type { JoeConfig } from "../../types";
import { SettingsSection } from "./base";
import { settingsStyles } from "./styles";

type NotifyKey = "ask" | "problems" | "morning";

/** Einstellungen › Benachrichtigungen: where Joe writes, what about, and when he asks in the evening. */
export class JoeSettingsNotify extends SettingsSection {
  /** Notify services with the phone's current name (see energy_joe/notify/targets). */
  @state() private notifyTargets?: { service: string; name: string }[];

  static styles = [shared, settingsStyles];

  connectedCallback(): void {
    super.connectedCallback();
    this.loadTargets();
  }

  protected firstUpdated(): void {
    // hass may arrive after the element is connected.
    this.loadTargets();
  }

  private loading = false;

  private loadTargets(): void {
    if (this.loading || this.notifyTargets || !this.hass) {
      return;
    }
    this.loading = true;
    this.hass
      .callWS<{ service: string; name: string }[]>({ type: "energy_joe/notify/targets" })
      .then((targets) => (this.notifyTargets = targets))
      .catch(() => undefined)
      .finally(() => (this.loading = false));
  }

  protected render() {
    const { t, state: joe } = this;
    if (!t || !joe) {
      return nothing;
    }
    const config = joe.config;
    const notify = config.notify;
    // Phones by the name Home Assistant shows now (the service keeps the old one).
    const services =
      this.notifyTargets ??
      Object.keys(this.hass?.services?.notify ?? {})
        .filter((name) => !["persistent_notification", "send_message", "notify"].includes(name))
        .sort()
        .map((name) => ({ service: name, name: name.replace(/_/g, " ") }));
    const chosen = notify.service?.replace(/^notify\./, "");
    const gone = Boolean(chosen) && this.notifyTargets !== undefined && !services.some((s) => s.service === chosen);
    return html`<div class="list">
      <section class="group" data-anchor="notify">
        <h2>${t("settings.notify")}</h2>
        <p class="intro">${t("settings.notify.intro")}</p>
        <div class="row" data-tipped data-anchor="service">
          <div>
            <div class="name"><label for="notify-service"><b>${t("settings.notify.service")}</b></label>${tip(t, "notify_service")}</div>
            <small>${t("settings.notify.service.hint")}</small>
          </div>
          <select
            id="notify-service"
            class="input"
            @change=${(ev: Event) => {
              const value = (ev.target as HTMLSelectElement).value;
              saveConfig(this, { notify: { service: value ? `notify.${value}` : null } });
            }}
          >
            <option value="" ?selected=${!notify.service}>${t("settings.notify.none")}</option>
            ${services.map(
              (target) => html`<option value=${target.service} ?selected=${chosen === target.service}>${target.name}</option>`,
            )}
            ${gone ? html`<option value=${chosen} selected>${t("settings.notify.gone", { name: chosen ?? "" })}</option>` : nothing}
          </select>
        </div>
        ${this.toggle(t, config, "ask")} ${this.toggle(t, config, "problems")} ${this.toggle(t, config, "morning")}
        ${this.askTime(t, config)}
      </section>
    </div>`;
  }

  private toggle(t: Translate, config: JoeConfig, key: NotifyKey): TemplateResult {
    const notify = config.notify;
    return html`<div class="row" data-tipped>
      <div>
        <div class="name"><b id="notify-${key}">${t(`settings.notify.${key}`)}</b>${tip(t, `notify_${key}`)}</div>
        <small>${t(`settings.notify.${key}.hint`)}</small>
      </div>
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${String(notify[key])}
        aria-labelledby="notify-${key}"
        ?disabled=${!notify.service}
        @click=${() => saveConfig(this, { notify: { [key]: !notify[key] } })}
      ></button>
    </div>`;
  }

  /** When Joe asks in Vorschlagen (rules.ask_time). */
  private askTime(t: Translate, config: JoeConfig): TemplateResult {
    return html`<div class="row" data-tipped data-anchor="ask_time">
      <div>
        <div class="name"><label for="ask-time"><b>${t("settings.ask_time")}</b></label>${tip(t, "ask_time")}</div>
        <small>${t("settings.ask_time.hint")}</small>
      </div>
      <input
        id="ask-time"
        class="input time"
        type="time"
        .value=${config.rules.ask_time}
        @change=${(ev: Event) => {
          const value = (ev.target as HTMLInputElement).value;
          if (/^\d{2}:\d{2}$/.test(value)) {
            saveConfig(this, { rules: { ask_time: value } });
          }
        }}
      />
    </div>`;
  }
}

define("joe-settings-notify", JoeSettingsNotify);
