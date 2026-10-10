import { css, html, nothing, type TemplateResult } from "lit";
import { state } from "lit/decorators.js";
import { openInHa } from "../../components/bits";
import { tip } from "../../components/tip";
import { define } from "../../define";
import type { Translate } from "../../i18n";
import { shared } from "../../styles/shared";
import type { JoeState } from "../../types";
import { SettingsSection } from "./base";
import { settingsStyles } from "./styles";

/** Joe's integration page in Home Assistant (there: ⋮ › Diagnose herunterladen). */
const INTEGRATION_PAGE = "/config/integrations/integration/energy_joe";

/**
 * Einstellungen › Wartung & Sichern: watching and reading the history again
 * (anchor observe), export and import (backup), starting the setup over (setup)
 * and where Home Assistant's diagnostics download is (diagnostics).
 */
export class JoeSettingsMaintenance extends SettingsSection {
  /** A backup file read and waiting for the user's yes. */
  @state() private backup?: { name: string; when: string; config: Record<string, unknown> };
  @state() private backupNote?: { ok: boolean; text: string };

  static styles = [
    shared,
    settingsStyles,
    css`
      label.file {
        position: relative;
        overflow: hidden;
        cursor: pointer;
      }
      label.file input {
        position: absolute;
        inset: 0;
        opacity: 0;
        cursor: pointer;
      }
      .confirm {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-top: 8px;
      }
      .group > .note {
        margin-bottom: 10px;
      }
    `,
  ];

  protected render() {
    const { t, state: joe } = this;
    if (!t || !joe) {
      return nothing;
    }
    return html`<div class="list">
      ${this.renderObserve(t, joe)} ${this.renderBackup(t)} ${this.renderSetup(t)}
    </div>`;
  }

  private renderObserve(t: Translate, joe: JoeState): TemplateResult {
    const observe = joe.observe;
    const active = Boolean(observe?.active);
    const running = observe?.backfill.state === "running";
    const day = (iso: string) =>
      new Intl.DateTimeFormat(t.lang, { day: "numeric", month: "long", timeZone: "UTC" }).format(
        new Date(`${iso.slice(0, 10)}T12:00:00Z`),
      );
    const status = active
      ? t("settings.observe.since", { day: day(observe!.since!), time: observe!.since!.slice(11, 16) })
      : joe.mode === "off"
        ? t("settings.observe.off")
        : t("settings.observe.waiting");
    const parts: string[] = [];
    if (observe?.first_day) {
      parts.push(t("settings.observe.days", { days: observe.day_count ?? 0, first: day(observe.first_day) }));
    } else {
      parts.push(t("settings.observe.nothing"));
    }
    const backfill = observe?.backfill;
    if (backfill?.state === "running") {
      parts.push(t("history.reading"));
    } else if (backfill?.state === "unavailable") {
      parts.push(t("settings.observe.no_recorder"));
    } else if (backfill?.state === "failed") {
      parts.push(t("settings.observe.failed"));
    }
    return html`<section class="group" data-anchor="observe">
      <h2>${t("settings.observe")}</h2>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${t("settings.observe.recording")}</b>${tip(t, "observe")}</div>
          <small>${status}</small>
        </div>
        <span class="chip ${active ? "ok" : ""}">
          ${t(active ? "status.running" : joe.mode === "off" ? "status.paused" : "status.waiting")}
        </span>
      </div>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${t("settings.observe.history")}</b>${tip(t, "rebuild")}</div>
          <small>${parts.join(" · ")}</small>
        </div>
        <button type="button" class="btn btn-secondary" ?disabled=${!active || running} @click=${this.rebuild}>
          ${t("settings.observe.rebuild")}
        </button>
      </div>
    </section>`;
  }

  private async rebuild(): Promise<void> {
    try {
      await this.hass?.callWS({ type: "energy_joe/history/rebuild" });
    } catch {
      // The status line says what happened.
    }
  }

  /** Export all settings (with what Joe learned) to a file, or take such a file back in. */
  private renderBackup(t: Translate): TemplateResult {
    return html`<section class="group" data-anchor="backup">
      <h2>${t("settings.backup")}</h2>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${t("settings.backup.export")}</b>${tip(t, "backup_export")}</div>
          <small>${t("settings.backup.export.hint")}</small>
        </div>
        <button type="button" class="btn btn-secondary" @click=${() => void this.exportSettings()}>${t("settings.backup.download")}</button>
      </div>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${t("settings.backup.import")}</b>${tip(t, "backup_import")}</div>
          <small>${t("settings.backup.import.hint")}</small>
        </div>
        <label class="btn btn-secondary file">
          ${t("settings.backup.choose")}
          <input type="file" accept="application/json,.json" @change=${(ev: Event) => void this.readBackup(ev)} />
        </label>
      </div>
      ${this.backup
        ? html`<div class="note warn" data-tipped>
            <ha-icon icon="mdi:alert-outline"></ha-icon>
            <span>
              ${t("settings.backup.confirm", { file: this.backup.name, when: this.backup.when })} ${tip(t, "backup_import")}
              <span class="confirm">
                <button type="button" class="btn btn-danger" @click=${() => void this.importSettings()}>${t("settings.backup.replace")}</button>
                <button type="button" class="btn btn-ghost" @click=${() => (this.backup = undefined)}>${t("common.cancel")}</button>
              </span>
            </span>
          </div>`
        : nothing}
      ${this.backupNote
        ? html`<div class="note ${this.backupNote.ok ? "ok" : "warn"}">
            <ha-icon icon=${this.backupNote.ok ? "mdi:check" : "mdi:alert-outline"}></ha-icon><span>${this.backupNote.text}</span>
          </div>`
        : nothing}
    </section>`;
  }

  private async exportSettings(): Promise<void> {
    const t = this.t!;
    try {
      const data = await this.hass!.callWS<Record<string, unknown>>({ type: "energy_joe/config/export" });
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `energy-joe-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(link.href);
      this.backupNote = { ok: true, text: t("settings.backup.exported") };
    } catch (err) {
      this.backupNote = { ok: false, text: t("settings.backup.failed", { error: String((err as { message?: string })?.message ?? err) }) };
    }
  }

  private async readBackup(ev: Event): Promise<void> {
    const t = this.t!;
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    this.backupNote = undefined;
    try {
      const data = JSON.parse(await file.text()) as { kind?: string; exported?: string; config?: Record<string, unknown> };
      if (data.kind !== "energy_joe_settings" || !data.config) throw new Error(t("settings.backup.not_ours"));
      this.backup = {
        name: file.name,
        when: data.exported ? new Date(data.exported).toLocaleString(t.lang) : "–",
        config: data.config,
      };
    } catch (err) {
      this.backupNote = { ok: false, text: t("settings.backup.failed", { error: String((err as { message?: string })?.message ?? err) }) };
    }
  }

  private async importSettings(): Promise<void> {
    const t = this.t!;
    const backup = this.backup;
    this.backup = undefined;
    if (!backup) return;
    try {
      await this.hass!.callWS({ type: "energy_joe/config/import", config: backup.config });
      this.backupNote = { ok: true, text: t("settings.backup.imported") };
    } catch (err) {
      this.backupNote = { ok: false, text: t("settings.backup.failed", { error: String((err as { message?: string })?.message ?? err) }) };
    }
  }

  /** Go through the setup again; for a bug report, Home Assistant's diagnostics file. */
  private renderSetup(t: Translate): TemplateResult {
    return html`<section class="group" data-anchor="setup">
      <h2>${t("settings.setup")}</h2>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${t("settings.setup.again")}</b>${tip(t, "restart")}</div>
          <small>${t("settings.setup.hint")}</small>
        </div>
        <button
          type="button"
          class="btn btn-secondary"
          @click=${() =>
            this.dispatchEvent(
              new CustomEvent("joe-onboarding", { detail: { step: "welcome", completed: false }, bubbles: true, composed: true }),
            )}
        >
          ${t("settings.setup.restart")}
        </button>
      </div>
      <div class="row" data-tipped data-anchor="diagnostics">
        <div>
          <div class="name"><b>${t("settings.maintenance.diagnostics")}</b>${tip(t, "diagnostics")}</div>
          <small>${t("settings.maintenance.diagnostics.hint")}</small>
        </div>
        <a
          class="mini-btn"
          data-notip
          href=${INTEGRATION_PAGE}
          @click=${(ev: MouseEvent) => {
            if (ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.altKey || ev.button !== 0) return;
            ev.preventDefault();
            openInHa(INTEGRATION_PAGE);
          }}
          ><ha-icon icon="mdi:open-in-new"></ha-icon>${t("settings.maintenance.diagnostics.open")}</a
        >
      </div>
    </section>`;
  }
}

define("joe-settings-maintenance", JoeSettingsMaintenance);
