import { css, html, nothing, type TemplateResult } from "lit";
import { state } from "lit/decorators.js";
import { tip } from "../../components/tip";
import { saveConfig } from "../../config";
import { define } from "../../define";
import type { Translate } from "../../i18n";
import { shared } from "../../styles/shared";
import type { JoeConfig } from "../../types";
import { SettingsSection } from "./base";
import { settingsStyles } from "./styles";

type NotifyKey = "ask" | "problems" | "stuck" | "morning" | "cars";

/** Einstellungen › Benachrichtigungen: where Joe writes, what about, and when he asks in the evening. */
export class JoeSettingsNotify extends SettingsSection {
  /** Notify services with the phone's current name (see energy_joe/notify/targets). */
  @state() private notifyTargets?: { service: string; name: string }[];

  static styles = [
    shared,
    settingsStyles,
    css`
      .phones {
        display: flex;
        flex-direction: column;
        gap: 6px;
        align-items: flex-start;
      }
      .phone {
        display: flex;
        gap: 8px;
        align-items: center;
        cursor: pointer;
      }
    `,
  ];

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
    const chosen = (notify.services?.length ? notify.services : notify.service ? [notify.service] : []).map((s) =>
      s.replace(/^notify\./, ""),
    );
    const gone = this.notifyTargets === undefined ? [] : chosen.filter((c) => !services.some((s) => s.service === c));
    const save = (next: string[]) => {
      const full = next.map((s) => `notify.${s}`);
      saveConfig(this, { notify: { services: full, service: full[0] ?? null } });
    };
    const phone = (service: string, name: string, on: boolean) =>
      html`<label class="phone"
        ><input
          type="checkbox"
          .checked=${on}
          @change=${(ev: Event) => {
            const checked = (ev.target as HTMLInputElement).checked;
            save(checked ? [...chosen, service] : chosen.filter((c) => c !== service));
          }}
        />${name}</label
      >`;
    return html`<div class="list">
      <section class="group" data-anchor="notify">
        <h2>${t("settings.notify")}</h2>
        <p class="intro">${t("settings.notify.intro")}</p>
        <div class="row" data-tipped data-anchor="service">
          <div>
            <div class="name"><b id="notify-service">${t("settings.notify.service")}</b>${tip(t, "notify_service")}</div>
            <small>${t("settings.notify.service.hint")}</small>
          </div>
          <div class="phones" role="group" aria-labelledby="notify-service">
            ${services.length || gone.length
              ? nothing
              : html`<small>${t("settings.notify.none")}</small>`}
            ${services.map((target) => phone(target.service, target.name, chosen.includes(target.service)))}
            ${gone.map((service) => phone(service, t("settings.notify.gone", { name: service }), true))}
          </div>
        </div>
        ${this.toggle(t, config, "ask")} ${this.toggle(t, config, "problems")} ${this.toggle(t, config, "stuck")}
        ${this.toggle(t, config, "morning")}
        ${config.cars?.length ? this.toggle(t, config, "cars") : nothing}
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
        aria-checked=${String(notify[key] ?? true)}
        aria-labelledby="notify-${key}"
        ?disabled=${!(notify.services?.length || notify.service)}
        @click=${() => saveConfig(this, { notify: { [key]: !(notify[key] ?? true) } })}
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
