import { css, html, nothing, type TemplateResult } from "lit";
import { sourceChip } from "../../components/bits";
import { tip } from "../../components/tip";
import { saveConfig, sourceOf } from "../../config";
import { define } from "../../define";
import type { Translate } from "../../i18n";
import { shared } from "../../styles/shared";
import type { JoeMode, JoeState } from "../../types";
import { SettingsSection } from "./base";
import { settingsStyles } from "./styles";

const MODES: JoeMode[] = ["simulation", "advisory", "live", "off"];

/**
 * Einstellungen › Betrieb: what the modes mean (switching lives in the header
 * dialog only, this button opens it) and how grid-friendly Joe behaves.
 */
export class JoeSettingsOperation extends SettingsSection {
  static styles = [
    shared,
    settingsStyles,
    css`
      .modes {
        list-style: none;
        margin: 0 0 14px;
        padding: 0;
        display: grid;
        gap: 8px;
      }
      /* An explanation, not a control: a quiet bar instead of a button look. */
      .modes li {
        padding: 4px 0 4px 12px;
        border-left: 3px solid var(--joe-line);
      }
      .modes li.on {
        border-left-color: var(--joe-amber);
      }
      .modes .mode-name {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        font-weight: 700;
      }
      .modes p {
        margin: 2px 0 0;
        font-size: 13.5px;
        color: var(--joe-ink-2);
      }
    `,
  ];

  protected render() {
    const { t, state: joe } = this;
    if (!t || !joe) {
      return nothing;
    }
    return html`<div class="list">
      <section class="group" data-anchor="mode">
        <h2>${t("settings.operation")}</h2>
        <div class="row" data-tipped>
          <div>
            <div class="name"><b>${t("settings.mode")}</b>${tip(t, "mode")}</div>
            <small>${t("settings.mode.now", { mode: t(`mode.${joe.mode}`) })}</small>
          </div>
          <div class="control">
            <button type="button" class="btn btn-secondary" @click=${this.openDialog}>${t("settings.mode.open")}</button>
            ${tip(t, "mode_open")}
          </div>
        </div>
        <ul class="modes">
          ${MODES.map(
            (mode) => html`<li class=${mode === joe.mode ? "on" : ""}>
              <span class="mode-name"
                >${t(`mode.${mode}`)}
                ${mode === joe.mode ? html`<span class="chip ok">${t("mode.current")}</span>` : nothing}</span
              >
              <p>${t(`mode.${mode}.desc`)}</p>
            </li>`,
          )}
        </ul>
        ${this.gridFriendlyRows(t, joe)}
      </section>
    </div>`;
  }

  /** The one place to switch is the header dialog (it also warns about batteries without a test run). */
  private openDialog(): void {
    this.dispatchEvent(new CustomEvent("joe-mode-dialog", { bubbles: true, composed: true }));
  }

  /** Grid-friendly: batteries take the midday sun; what comes first, saving or the grid. */
  private gridFriendlyRows(t: Translate, joe: JoeState): TemplateResult {
    const config = joe.config;
    const rules = config.rules;
    return html`<div class="row" data-tipped data-anchor="grid_friendly">
        <div>
          <div class="name"><b id="grid-friendly">${t("rule.grid_friendly")}</b>${tip(t, "r_grid_friendly")}</div>
          <small>${t("rule.grid_friendly.hint")}</small>
        </div>
        <div class="control">
          ${sourceChip(t, sourceOf(config, "rules.grid_friendly"))}
          <button
            type="button"
            class="switch"
            role="switch"
            aria-checked=${String(rules.grid_friendly)}
            aria-labelledby="grid-friendly"
            @click=${() => saveConfig(this, { rules: { grid_friendly: !rules.grid_friendly } })}
          ></button>
        </div>
      </div>
      ${rules.grid_friendly
        ? html`<div class="row" data-tipped>
            <div>
              <div class="name"><b>${t("rule.grid_first")}</b>${tip(t, "r_grid_first")}</div>
              <small>${t(rules.grid_first ? "rule.grid_first.grid.hint" : "rule.grid_first.saving.hint")}</small>
            </div>
            <div class="seg" role="group" aria-label=${t("rule.grid_first")}>
              ${[false, true].map(
                (first) =>
                  html`<button
                    type="button"
                    aria-pressed=${String(rules.grid_first === first)}
                    @click=${() => saveConfig(this, { rules: { grid_first: first } })}
                  >
                    ${t(first ? "rule.grid_first.grid" : "rule.grid_first.saving")}
                  </button>`,
              )}
            </div>
          </div>`
        : nothing}`;
  }
}

define("joe-settings-operation", JoeSettingsOperation);
