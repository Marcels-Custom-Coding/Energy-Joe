import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { define } from "../define";
import type { Translate } from "../i18n";
import { PANEL, link } from "../router";
import { shared } from "../styles/shared";
import type { BatteryConfig, HomeAssistant, JoeState } from "../types";
import { tip } from "./tip";

/** Whether there is anything to decide about tonight (the element renders nothing otherwise). */
export function steerShown(joe: JoeState | undefined): boolean {
  const plan = joe?.plan;
  return Boolean(
    joe?.control && ["advisory", "live"].includes(joe.mode) && plan?.window && plan.kind !== "none" && plan.kind !== "unavailable",
  );
}

/** Vorschlagen and no answer for tonight yet: the one question the overview puts first in "Joe braucht dich". */
export function steerAsks(joe: JoeState | undefined): boolean {
  const night = joe?.plan?.window?.start;
  const control = joe?.control;
  return Boolean(
    steerShown(joe) && joe?.mode === "advisory" && night && control?.skip !== night && control?.answer?.night !== night,
  );
}

/** Steered batteries without a passed test run: Joe only watches them tonight. */
export function untestedBatteries(joe: JoeState): BatteryConfig[] {
  const ready = joe.control?.ready ?? {};
  return joe.config.batteries.filter((b) => b.adapter !== "none" && ready[b.id] && ready[b.id] !== "ready");
}

/**
 * "Steuern heute Nacht": the yes/no question in Vorschlagen, skipping a night
 * in Live, and the warning about batteries without a test run (each a link to
 * its page). Its home is the plan; the overview shows it `compact` as a
 * shortcut (only "Ja, mach" or "Heute aussetzen" / "Doch steuern", no card).
 */
export class JoeSteerTonight extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;
  @property({ attribute: false }) prefix = PANEL;
  /** Shortcut without its own card and without "Heute nicht" (overview). */
  @property({ type: Boolean, reflect: true }) compact = false;
  /** Leave out the note about batteries without a test run (the overview lists it as its own row). */
  @property({ type: Boolean }) hideUntested = false;

  @state() private busy = false;

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      .steer {
        margin-top: 12px;
        padding: 14px 16px;
        border-radius: 14px;
        background: var(--joe-surface);
        box-shadow: inset 0 0 0 1px var(--joe-line);
      }
      :host([compact]) .steer {
        margin: 0;
        padding: 0;
        background: transparent;
        box-shadow: none;
      }
      .head {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 700;
        font-size: 16px;
      }
      :host([compact]) .head {
        font-size: 15px;
      }
      .note {
        margin-top: 10px;
      }
      .note a {
        color: inherit;
        font-weight: 700;
      }
      .actions {
        margin-top: 12px;
      }
      :host([compact]) .actions {
        margin-top: 10px;
      }
    `,
  ];

  protected render() {
    const t = this.t;
    const joe = this.state;
    const control = joe?.control;
    const plan = joe?.plan;
    if (!t || !joe || !control || !plan?.window || !steerShown(joe)) {
      return nothing;
    }
    const night = plan.window.start;
    const skipped = control.skip === night;
    const answer = control.answer?.night === night ? control.answer.yes : null;
    let text: string;
    let buttons: TemplateResult | typeof nothing = nothing;
    if (joe.mode === "advisory" && !skipped) {
      text = answer === true ? t("plan.steer.answered_yes") : answer === false ? t("plan.steer.answered_no") : t("plan.steer.advisory");
      const yes =
        answer !== true
          ? html`<button type="button" class="btn btn-primary" ?disabled=${this.busy} @click=${() => this.answer(night, true)}>
              ${t("plan.steer.yes")}
            </button>`
          : nothing;
      const no =
        answer !== false && !this.compact
          ? html`<button type="button" class="btn btn-secondary" ?disabled=${this.busy} @click=${() => this.answer(night, false)}>
              ${t("plan.steer.no")}
            </button>`
          : nothing;
      buttons = yes === nothing && no === nothing ? nothing : html`${yes} ${no}`;
    } else {
      text = skipped ? t("plan.steer.skipped") : t("plan.steer.live");
      buttons = html`<button type="button" class="btn btn-secondary" ?disabled=${this.busy} @click=${() => this.skip(!skipped)}>
        ${t(skipped ? "plan.steer.unskip" : "plan.steer.skip")}
      </button>`;
    }
    return html`<section class="steer" data-tipped>
      <div class="head">${text} ${tip(t, "plan_steer")}</div>
      ${this.hideUntested ? nothing : this.renderUntested(t, joe)}
      ${buttons === nothing ? nothing : html`<div class="actions">${buttons}</div>`}
    </section>`;
  }

  /** "Ohne Testlauf schaue ich A, B nur an." with every name leading to its battery page. */
  private renderUntested(t: Translate, joe: JoeState): TemplateResult | typeof nothing {
    const untested = untestedBatteries(joe);
    if (!untested.length) {
      return nothing;
    }
    const mark = "\u0000";
    const [before, after = ""] = t("plan.steer.untested", { names: mark }).split(mark);
    const names = untested.map(
      (b, i) => html`${i ? ", " : ""}${link(this.prefix, { tab: "devices", section: "battery", id: b.id }, b.name)}`,
    );
    return html`<div class="note warn">
      <ha-icon icon="mdi:alert-outline"></ha-icon><span>${before}${names}${after}</span>
    </div>`;
  }

  private async answer(night: string, yes: boolean): Promise<void> {
    this.busy = true;
    try {
      await this.hass?.callWS({ type: "energy_joe/control/answer", night, yes });
    } catch {
      // The state stays as it was; the next try works.
    } finally {
      this.busy = false;
    }
  }

  private async skip(skip: boolean): Promise<void> {
    this.busy = true;
    try {
      await this.hass?.callWS({ type: "energy_joe/control/skip", skip });
    } catch {
      // As above.
    } finally {
      this.busy = false;
    }
  }
}

define("joe-steer-tonight", JoeSteerTonight);
