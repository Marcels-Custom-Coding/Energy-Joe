import { LitElement, css, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { define } from "../define";
import { shared } from "../styles/shared";
import { displayTitle, swoosh } from "./bits";
import "./pose";

/** A friendly empty state: Joe illustration, title, text and an optional note. */
export class JoeEmptyState extends LitElement {
  @property() pose = "";
  @property() heading = "";
  @property() text = "";
  @property() note = "";

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      .wrap {
        display: grid;
        grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
        gap: 28px;
        align-items: center;
        max-width: 980px;
        margin: 0 auto;
        padding-block: 12px;
      }
      joe-pose {
        max-width: 420px;
        width: 100%;
        justify-self: center;
      }
      .display {
        font-size: clamp(34px, 5vw, 52px);
      }
      .note {
        margin-top: 16px;
      }
      @media (max-width: 760px) {
        .wrap {
          grid-template-columns: 1fr;
          gap: 16px;
        }
        joe-pose {
          max-width: 300px;
        }
      }
    `,
  ];

  protected render() {
    return html`<div class="wrap">
      <joe-pose name=${this.pose}></joe-pose>
      <div>
        ${displayTitle(this.heading)} ${swoosh}
        <p class="lead">${this.text}</p>
        ${this.note ? html`<div class="note"><span class="chip soon">${this.note}</span></div>` : nothing}
        <slot></slot>
      </div>
    </div>`;
  }
}

define("joe-empty-state", JoeEmptyState);
