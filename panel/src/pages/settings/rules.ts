import { html, nothing } from "lit";
import { define } from "../../define";
import { RULE_GROUPS, ruleRow, ruleStyles, type RuleGroup } from "../../rules-view";
import { shared } from "../../styles/shared";
import { SettingsSection } from "./base";
import { settingsStyles } from "./styles";

const GROUPS: RuleGroup[] = ["battery", "grid", "plan"];

/**
 * Einstellungen › Regeln (once "Für Profis"): the one place for Joe's rules,
 * grouped Speicher · Netz & Preis · Planung. Each row carries its key as anchor
 * (/settings/rules/buffer_factor); other pages mirror the values with "Ändern →".
 */
export class JoeSettingsRules extends SettingsSection {
  static styles = [shared, settingsStyles, ruleStyles];

  protected render() {
    const { t, state: joe } = this;
    if (!t || !joe) {
      return nothing;
    }
    const config = joe.config;
    return html`<div class="list">
      <p class="intro">${t("settings.rules.intro")}</p>
      ${GROUPS.map(
        (group) => html`<section class="group" data-anchor=${`group-${group}`}>
          <h2>${t(`settings.rules.group.${group}`)}</h2>
          ${RULE_GROUPS[group].map((key) => ruleRow(t, this, config, this.info, key))}
        </section>`,
      )}
    </div>`;
  }
}

define("joe-settings-rules", JoeSettingsRules);
