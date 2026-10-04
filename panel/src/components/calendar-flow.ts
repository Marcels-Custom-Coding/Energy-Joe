import { LitElement, css, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { define } from "../define";
import type { Translate } from "../i18n";

interface Step {
  icon: string;
  text: string;
}

/**
 * How appointments get to a car, step by step: Joe accepting invitations in
 * the car's name, or a finished calendar of the car that is only assigned.
 * Side by side on wide screens, one below the other on a phone.
 */
export class JoeCalendarFlow extends LitElement {
  @property({ attribute: false }) t?: Translate;
  @property() variant: "invite" | "calendar" = "invite";
  /** The address the car is invited with (shown in the second step). */
  @property() address = "";

  static styles = css`
    :host {
      display: block;
      container-type: inline-size;
    }
    ol {
      list-style: none;
      margin: 0;
      padding: 4px 0;
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: minmax(0, 1fr);
      gap: 8px;
      counter-reset: step;
    }
    li {
      position: relative;
      display: grid;
      justify-items: center;
      align-content: start;
      gap: 6px;
      text-align: center;
      font-size: 12.5px;
      line-height: 1.35;
      color: var(--joe-ink-2);
    }
    /* The line from one step to the next. */
    li:not(:last-child)::after {
      content: "";
      position: absolute;
      top: 21px;
      left: calc(50% + 26px);
      right: calc(-50% + 26px);
      height: 2px;
      border-radius: 1px;
      background: var(--joe-amber, #fea707);
      opacity: 0.6;
    }
    .badge {
      position: relative;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: var(--joe-amber, #fea707);
      color: #071118;
      box-shadow: inset 0 0 0 2px #071118;
    }
    .badge ha-icon {
      --mdc-icon-size: 22px;
    }
    .number {
      position: absolute;
      top: -4px;
      right: -6px;
      min-width: 18px;
      height: 18px;
      padding: 0 4px;
      border-radius: 9px;
      background: #071118;
      color: #fea707;
      font-size: 11px;
      font-weight: 800;
      line-height: 18px;
      text-align: center;
    }
    li.joe .badge {
      background: #071118;
      color: #fea707;
      box-shadow: none;
    }
    li.joe .number {
      background: var(--joe-amber, #fea707);
      color: #071118;
    }
    b {
      color: var(--joe-ink);
      font-weight: 700;
      overflow-wrap: anywhere;
    }
    /* Too narrow for the steps side by side: one below the other. */
    @container (max-width: 520px) {
      ol {
        grid-auto-flow: row;
        grid-auto-columns: auto;
        gap: 10px;
      }
      li {
        grid-template-columns: 44px 1fr;
        justify-items: start;
        align-items: center;
        text-align: left;
        gap: 12px;
      }
      li:not(:last-child)::after {
        top: 46px;
        left: 21px;
        right: auto;
        width: 2px;
        height: 12px;
      }
    }
  `;

  private steps(t: Translate): (Step & { joe?: boolean })[] {
    if (this.variant === "calendar") {
      return [
        { icon: "mdi:calendar-account", text: t("flow.calendar.1") },
        { icon: "mdi:link-variant", text: t("flow.calendar.2") },
        { icon: "mdi:calendar-search", text: t("flow.calendar.3"), joe: true },
        { icon: "mdi:ev-station", text: t("flow.calendar.4"), joe: true },
      ];
    }
    return [
      { icon: "mdi:calendar-edit", text: t("flow.invite.1") },
      {
        icon: "mdi:car-arrow-right",
        text: t("flow.invite.2", { address: this.address || t("flow.invite.address") }),
      },
      { icon: "mdi:email-check-outline", text: t("flow.invite.3"), joe: true },
      { icon: "mdi:calendar-check", text: t("flow.invite.4"), joe: true },
      { icon: "mdi:ev-station", text: t("flow.invite.5"), joe: true },
    ];
  }

  protected render() {
    const t = this.t;
    if (!t) {
      return nothing;
    }
    return html`<ol aria-label=${t(this.variant === "calendar" ? "flow.calendar.title" : "flow.invite.title")}>
      ${this.steps(t).map(
        (step, index) => html`<li class=${step.joe ? "joe" : ""}>
          <span class="badge" aria-hidden="true">
            <ha-icon icon=${step.icon}></ha-icon>
            <span class="number">${index + 1}</span>
          </span>
          <span .innerHTML=${this.bold(step.text)}></span>
        </li>`,
      )}
    </ol>`;
  }

  /** **text** in the translations becomes bold; everything else is escaped. */
  private bold(text: string): string {
    const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return escaped.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  }
}

define("joe-calendar-flow", JoeCalendarFlow);
