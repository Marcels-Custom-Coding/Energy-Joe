import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { define } from "../define";
import type { Translate } from "../i18n";
import { shared } from "../styles/shared";
import type { DayAnswer, DayQuestion, HomeAssistant } from "../types";
import { dayText, fixed } from "./look-back";
import { tip } from "./tip";

// What fits a day with more, or less, consumption than expected. Without the
// question (it is gone once answered) every answer is offered.
const ANSWERS: Record<DayQuestion["kind"] | "any", DayAnswer[]> = {
  more: ["guests", "special", "normal"],
  less: ["away", "special", "normal"],
  any: ["guests", "away", "special", "normal"],
};

/**
 * The answer to "Joe fragt nach" on the day itself: an open question shows
 * the answers; a given answer reads "Eure Antwort: … · Ändern" and can be
 * changed any time (energy_joe/learning/answer works for every day).
 */
export class JoeDayAnswer extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) date = "";
  /** The answer stored with the day (history/day "answer"), or null. */
  @property({ attribute: false }) answer?: DayAnswer | null;
  /** The open question for this day, if Joe asks. */
  @property({ attribute: false }) question?: DayQuestion;

  @state() private changing = false;
  @state() private busy = false;
  @state() private failed = false;
  /** The answer just given, until the day comes back with it. */
  @state() private given?: DayAnswer;

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      .card {
        padding: 16px 18px;
      }
      .head {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .head .eyebrow {
        flex: 1;
      }
      p {
        margin: 8px 0 0;
        font-size: 15px;
        line-height: 1.45;
      }
      .given {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px 12px;
        margin-top: 8px;
      }
      .given p {
        margin: 0;
        flex: 1 1 200px;
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

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has("date")) {
      this.changing = false;
      this.given = undefined;
      this.failed = false;
    } else if (changed.has("answer") && this.answer === this.given) {
      this.given = undefined;
    }
  }

  protected render() {
    const t = this.t;
    const answer = this.given ?? this.answer ?? null;
    if (!t || !this.date || (!answer && !this.question)) {
      return nothing;
    }
    const asking = !answer || this.changing;
    return html`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:chat-question-outline"></ha-icon>${t("ask.title")}</div>
        ${tip(t, "ask_day")}
      </div>
      ${asking
        ? html`<p>
              ${this.question
                ? t(`ask.${this.question.kind}`, {
                    day: dayText(t.lang, this.question.date, "weekday"),
                    actual: fixed(t.lang, this.question.actual, 1),
                    expected: fixed(t.lang, this.question.expected, 1),
                  })
                : t("past.answer.ask")}
            </p>
            <div class="answers" role="group" aria-label=${t("ask.answers")}>
              ${ANSWERS[this.question?.kind ?? "any"].map(
                (choice) =>
                  html`<button
                    type="button"
                    class="mini-btn ${choice === "normal" ? "quiet" : ""}"
                    aria-pressed=${String(choice === answer)}
                    ?disabled=${this.busy}
                    @click=${() => this.choose(choice)}
                  >
                    ${t(`ask.answer.${choice}`)}
                  </button>`,
              )}
              ${answer
                ? html`<button type="button" class="mini-btn quiet" ?disabled=${this.busy} @click=${() => (this.changing = false)}>
                    ${t("common.cancel")}
                  </button>`
                : nothing}
            </div>`
        : html`<div class="given">
            <p>${t("past.answer.given", { answer: t(`ask.answer.${answer}`) })}</p>
            <button type="button" class="mini-btn" @click=${() => (this.changing = true)}>
              <ha-icon icon="mdi:pencil-outline"></ha-icon>${t("past.answer.change")}
            </button>
          </div>`}
      ${this.failed
        ? html`<div class="note warn" role="status"><ha-icon icon="mdi:alert-outline"></ha-icon>${t("error.action")}</div>`
        : nothing}
    </section>`;
  }

  private async choose(answer: DayAnswer): Promise<void> {
    const date = this.date;
    this.busy = true;
    try {
      await this.hass?.callWS({ type: "energy_joe/learning/answer", date, answer });
      if (date === this.date) {
        this.given = answer;
        this.changing = false;
        this.failed = false;
      }
      this.dispatchEvent(new CustomEvent("joe-answered", { detail: { date, answer }, bubbles: true, composed: true }));
    } catch {
      this.failed = true;
    } finally {
      this.busy = false;
    }
  }
}

define("joe-day-answer", JoeDayAnswer);
