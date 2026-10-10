import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { sectionChips, type SectionChip } from "../../components/section-chips";
import { define } from "../../define";
import { DEFAULT_SECTION, PANEL, SECTIONS, type Route, type SettingsSection } from "../../router";
import type { Translate } from "../../i18n";
import { shared } from "../../styles/shared";
import type { Check, Discovery, HomeAssistant, JoeInfo, JoeState } from "../../types";
import "./about";
import "./maintenance";
import "./notify";
import "./operation";
import "./rules";
import "./signpost";

const TAGS: Record<SettingsSection, string> = {
  operation: "joe-settings-operation",
  rules: "joe-settings-rules",
  notify: "joe-settings-notify",
  maintenance: "joe-settings-maintenance",
  about: "joe-settings-about",
};

const ICONS: Record<SettingsSection, string> = {
  operation: "mdi:tune-variant",
  rules: "mdi:format-list-checks",
  notify: "mdi:bell-outline",
  maintenance: "mdi:wrench-outline",
  about: "mdi:information-outline",
};

/**
 * Einstellungen: only how Joe himself works, and upkeep. The signpost
 * ("Suchst du …?") stands on top of every section and leads to where things live now.
 */
export class JoeSettingsPage extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;
  @property({ attribute: false }) route?: Route;
  @property({ attribute: false }) prefix = PANEL;
  @property({ attribute: false }) info?: JoeInfo;
  @property({ attribute: false }) discovery?: Discovery;
  @property({ attribute: false }) checks: Check[] = [];

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      .body {
        max-width: 900px;
        margin: 0 auto;
      }
    `,
  ];

  protected render() {
    const t = this.t;
    if (!t || !this.state) {
      return nothing;
    }
    const section = (this.route?.section ?? DEFAULT_SECTION.settings) as SettingsSection;
    const chips: SectionChip[] = SECTIONS.settings.map((id) => ({ id, label: t(`nav.settings.${id}`), icon: ICONS[id] }));
    return html`${sectionChips(t, this.prefix, "settings", chips, section)}
      <div class="body">${this.renderSignpost()}${this.renderSection(section)}</div>`;
  }

  private renderSignpost(): TemplateResult {
    return html`<joe-signpost .t=${this.t} .state=${this.state} .prefix=${this.prefix} .route=${this.route}></joe-signpost>`;
  }

  private renderSection(section: SettingsSection): TemplateResult {
    const { t, hass, state, prefix, route, info, discovery, checks } = this;
    switch (section) {
      case "operation":
        return html`<joe-settings-operation
          .t=${t}
          .hass=${hass}
          .state=${state}
          .prefix=${prefix}
          .route=${route}
          .info=${info}
          .discovery=${discovery}
          .checks=${checks}
          .anchor=${route?.id}
        ></joe-settings-operation>`;
      case "rules":
        return html`<joe-settings-rules
          .t=${t}
          .hass=${hass}
          .state=${state}
          .prefix=${prefix}
          .route=${route}
          .info=${info}
          .discovery=${discovery}
          .checks=${checks}
          .anchor=${route?.id}
        ></joe-settings-rules>`;
      case "notify":
        return html`<joe-settings-notify
          .t=${t}
          .hass=${hass}
          .state=${state}
          .prefix=${prefix}
          .route=${route}
          .info=${info}
          .discovery=${discovery}
          .checks=${checks}
          .anchor=${route?.id}
        ></joe-settings-notify>`;
      case "maintenance":
        return html`<joe-settings-maintenance
          .t=${t}
          .hass=${hass}
          .state=${state}
          .prefix=${prefix}
          .route=${route}
          .info=${info}
          .discovery=${discovery}
          .checks=${checks}
          .anchor=${route?.id}
        ></joe-settings-maintenance>`;
      case "about":
        return html`<joe-settings-about
          .t=${t}
          .hass=${hass}
          .state=${state}
          .prefix=${prefix}
          .route=${route}
          .info=${info}
          .discovery=${discovery}
          .checks=${checks}
          .anchor=${route?.id}
        ></joe-settings-about>`;
    }
  }
}

define("joe-settings-page", JoeSettingsPage);
