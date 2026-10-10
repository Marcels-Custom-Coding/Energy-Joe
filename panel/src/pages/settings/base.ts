import { LitElement, type PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import type { Translate } from "../../i18n";
import { PANEL, format, revealAnchor, type Route } from "../../router";
import type { Check, Discovery, HomeAssistant, JoeInfo, JoeState } from "../../types";

/**
 * What every section of Einstellungen gets from the shell (pages/settings/index.ts),
 * and the jump to its anchor (/settings/rules/<key>, /settings/maintenance/backup …).
 */
export class SettingsSection extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;
  @property({ attribute: false }) route?: Route;
  @property({ attribute: false }) prefix = PANEL;
  @property({ attribute: false }) info?: JoeInfo;
  @property({ attribute: false }) discovery?: Discovery;
  @property({ attribute: false }) checks: Check[] = [];
  /** The part of the section the address points to ([data-anchor]). */
  @property({ attribute: false }) anchor?: string;

  /** The anchor still to scroll to, until it is on screen. */
  private pending?: string;
  /** The address last revealed, so a new state does not scroll again. */
  private revealed?: string;

  protected willUpdate(changed: PropertyValues<this>): void {
    if (!changed.has("route") && !changed.has("anchor")) {
      return;
    }
    const path = this.route ? format(this.route) : "";
    if (path === this.revealed) {
      return;
    }
    this.revealed = path;
    this.pending = this.anchor || undefined;
  }

  protected async updated(): Promise<void> {
    const anchor = this.pending;
    if (!anchor) {
      return;
    }
    const children = [...this.renderRoot.querySelectorAll<LitElement>("joe-choice")];
    await Promise.all(children.map((child) => child.updateComplete));
    // The sticky header's height (the scroll offset) is measured after the first paint.
    for (let i = 0; i < 10 && (i === 0 || !getComputedStyle(this).getPropertyValue("--joe-head-h")); i++) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
    if (this.pending === anchor && revealAnchor(this.renderRoot, anchor)) {
      this.pending = undefined;
    }
  }
}
