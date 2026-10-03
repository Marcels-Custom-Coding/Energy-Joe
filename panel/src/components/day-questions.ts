import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { define } from "../define";
import type { Translate } from "../i18n";
import { shared } from "../styles/shared";
import type { DayAnswer, DayQuestion, HomeAssistant } from "../types";
import { dayText, fixed } from "./look-back";
import { tip } from "./tip";

// What fits a day with more, or less, consumption than expected.
const ANSWERS: Record<DayQuestion["kind"], DayAnswer[]> = {
  more: ["guests", "special", "normal"],
  less: ["away", "special", "normal"],
};

/**
 * "Joe fragt nach": recent days far off what Joe expected. An answer tells
 * him whether to learn from the day (normal) or leave it out (guests, away,
 * something special).
 */
export class JoeDayQuestions extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) questions: DayQuestion[] = [];

  @state() private busy?: string;
  @state() private failed = false;
  @state() private answered = new Set<string>();

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      .card {
        padding: 18px 20px;
      }
      .head {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .head .eyebrow {
        flex: 1;
      }
      .lead {
        margin: 8px 0 0;
        color: var(--joe-ink-2);
        font-size: 14.5px;
        max-width: 62ch;
      }
      .question {
        margin-top: 14px;
        padding-top: 14px;
        border-top: 1px solid var(--joe-line);
      }
      .question p {
        margin: 0;
        font-size: 15px;
        line-height: 1.45;
      }
      .answers {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 10px;
      }
      .note {
        margin-top: 12px;
      }
    `,
  ];

  protected render() {
    const t = this.t;
    const open = this.questions.filter((q) => !this.answered.has(q.date));
    if (!t || !open.length) {
      return nothing;
    }
    return html`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:chat-question-outline"></ha-icon>${t("ask.title")}</div>
        ${tip(t, "ask_day")}
      </div>
      <p class="lead">${t("ask.lead")}</p>
      ${open.map(
        (question) => html`<div class="question">
          <p>
            ${t(`ask.${question.kind}`, {
              day: dayText(t.lang, question.date, "weekday"),
              actual: fixed(t.lang, question.actual, 1),
              expected: fixed(t.lang, question.expected, 1),
            })}
          </p>
          <div class="answers" role="group" aria-label=${t("ask.answers")}>
            ${ANSWERS[question.kind].map(
              (answer) =>
                html`<button
                  type="button"
                  class="mini-btn ${answer === "normal" ? "quiet" : ""}"
                  ?disabled=${this.busy === question.date}
                  @click=${() => this.answer(question.date, answer)}
                >
                  ${t(`ask.answer.${answer}`)}
                </button>`,
            )}
          </div>
        </div>`,
      )}
      ${this.failed
        ? html`<div class="note warn" role="status"><ha-icon icon="mdi:alert-outline"></ha-icon>${t("error.action")}</div>`
        : nothing}
    </section>`;
  }

  private async answer(date: string, answer: DayAnswer): Promise<void> {
    this.busy = date;
    try {
      await this.hass?.callWS({ type: "energy_joe/learning/answer", date, answer });
      this.answered = new Set([...this.answered, date]);
      this.failed = false;
      this.dispatchEvent(new CustomEvent("joe-answered", { detail: { date, answer }, bubbles: true, composed: true }));
    } catch {
      this.failed = true;
    } finally {
      this.busy = undefined;
    }
  }
}

define("joe-day-questions", JoeDayQuestions);
