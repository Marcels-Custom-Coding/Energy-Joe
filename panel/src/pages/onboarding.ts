import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { displayTitle, swoosh } from "../components/bits";
import "../components/found-list";
import "../components/pose";
import { tip } from "../components/tip";
import { define } from "../define";
import type { Translate } from "../i18n";
import { shared } from "../styles/shared";
import type { Discovery, JoeInfo, OnboardingStep } from "../types";

/** The setup assistant: Joe introduces himself, looks around and asks. */
export class JoeOnboarding extends LitElement {
  @property() step: OnboardingStep = "welcome";
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) info?: JoeInfo;
  @property({ attribute: false }) discovery?: Discovery;
  @property({ type: Boolean }) discovering = false;
  @property({ type: Boolean }) discoveryFailed = false;
  @property() language = "de";

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      .wrap {
        display: grid;
        grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
        gap: 32px;
        align-items: center;
        max-width: 1000px;
        margin: 0 auto;
        padding-block: 20px 32px;
      }
      joe-pose {
        width: 100%;
        max-width: 440px;
        justify-self: center;
      }
      .display {
        font-size: clamp(38px, 5.4vw, 60px);
      }
      details {
        margin-top: 14px;
        color: var(--joe-ink-2);
        max-width: 58ch;
      }
      summary {
        cursor: pointer;
        font-weight: 600;
        color: var(--joe-ink);
      }
      details p {
        margin: 8px 0 0;
        line-height: 1.5;
      }
      .found {
        margin-top: 18px;
        max-width: 58ch;
      }
      .found p {
        margin: 0 0 8px;
        font-weight: 600;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .note {
        margin-top: 14px;
      }
      .with-tip {
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }
      .wrap.wide {
        grid-template-columns: minmax(0, 0.55fr) minmax(0, 1.45fr);
        align-items: start;
        max-width: 1120px;
      }
      .wrap.wide joe-pose {
        position: sticky;
        top: 96px;
      }
      joe-found-list {
        margin-top: 18px;
      }
      .looking {
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 800;
        text-transform: uppercase;
        font-size: 28px;
        color: var(--joe-muted);
        margin-top: 18px;
      }
      .failed {
        margin-top: 16px;
        color: var(--joe-crit);
        font-weight: 600;
      }
      @media (max-width: 760px) {
        .wrap,
        .wrap.wide {
          grid-template-columns: 1fr;
          gap: 16px;
          padding-block: 4px 24px;
        }
        joe-pose {
          max-width: 300px;
        }
        .wrap.wide joe-pose {
          position: static;
          max-width: 200px;
        }
      }
    `,
  ];

  protected render() {
    const t = this.t;
    if (!t) {
      return nothing;
    }
    switch (this.step) {
      case "welcome":
        return this.layout(
          "welcome",
          html`${displayTitle(t("onb.welcome.title"), "h1")} ${swoosh}
            <p class="lead">${t("onb.welcome.lead")}</p>
            <div class="calm"><span class="pill-sim">${t("mode.simulation")}</span>${t("onb.calm")}</div>
            <details data-notip>
              <summary>${t("onb.welcome.more")}</summary>
              <p>${t("onb.welcome.more.text")}</p>
            </details>
            <div class="actions" data-tipped>
              <button type="button" class="btn btn-primary" @click=${() => this.go("scan")}>
                ${t("onb.welcome.go")}
              </button>
              ${tip(t, "scan_start")}
            </div>`,
        );
      case "scan":
        return this.renderScan(t);
      case "questions":
        return this.layout(
          "ask",
          html`${displayTitle(t("onb.questions.title"))} ${swoosh}
            <p class="lead">${t("onb.questions.lead")}</p>
            <div class="note"><span class="chip soon">${t("soon")}</span></div>
            <div class="actions" data-notip>
              <button type="button" class="btn btn-primary" @click=${() => this.go("done")}>
                ${t("onb.next")}
              </button>
              <button type="button" class="btn btn-ghost" @click=${() => this.go("scan")}>
                ${t("onb.back")}
              </button>
            </div>`,
        );
      case "done":
        return this.layout(
          "thumbs",
          html`${displayTitle(t("onb.done.title"))} ${swoosh}
            <div class="calm"><span class="pill-sim">${t("mode.simulation")}</span>${t("onb.done.lead")}</div>
            <div class="actions">
              <span class="with-tip" data-tipped>
                <button type="button" class="btn btn-primary" @click=${this.complete}>
                  ${t("onb.done.go")}
                </button>
                ${tip(t, "start")}
              </span>
              <button type="button" class="btn btn-ghost" data-notip @click=${() => this.go("questions")}>
                ${t("onb.back")}
              </button>
            </div>`,
        );
    }
  }

  private renderScan(t: Translate): TemplateResult {
    if (this.discovering || (!this.discovery && !this.discoveryFailed)) {
      return this.layout(
        "scout",
        html`${displayTitle(t("onb.scan.title"))} ${swoosh}
          <p class="lead">${t("onb.scan.lead")}</p>
          ${this.renderEnergy(t)}
          <div class="looking" role="status">${t("scan.looking")}</div>`,
      );
    }
    return html`<div class="wrap wide">
      <joe-pose name="scout"></joe-pose>
      <div>
        ${displayTitle(t("scan.title"))} ${swoosh}
        <p class="lead">${t("scan.lead")}</p>
        ${this.discoveryFailed
          ? html`<p class="failed">${t("scan.failed")}</p>`
          : html`<joe-found-list .discovery=${this.discovery} .t=${t} language=${this.language}></joe-found-list>`}
        <div class="note"><span class="chip soon">${t("scan.confirm.soon")}</span></div>
        <div class="actions">
          <button type="button" class="btn btn-primary" data-notip @click=${() => this.go("questions")}>
            ${t("onb.next")}
          </button>
          <span class="with-tip" data-tipped>
            <button type="button" class="btn btn-secondary" @click=${this.rediscover}>${t("scan.again")}</button>
            ${tip(t, "rescan")}
          </span>
          <button type="button" class="btn btn-ghost" data-notip @click=${() => this.go("welcome")}>
            ${t("onb.back")}
          </button>
        </div>
      </div>
    </div>`;
  }

  private rediscover(): void {
    this.dispatchEvent(new CustomEvent("joe-rediscover", { bubbles: true, composed: true }));
  }

  private layout(pose: string, content: TemplateResult): TemplateResult {
    return html`<div class="wrap">
      <joe-pose name=${pose}></joe-pose>
      <div>${content}</div>
    </div>`;
  }

  private renderEnergy(t: Translate): TemplateResult {
    const energy = this.info?.energy;
    if (!energy?.configured || !energy.sources) {
      return html`<div class="found"><p>${t("onb.scan.energy.none")}</p></div>`;
    }
    const items: [number, string][] = [
      [energy.sources.grid ?? 0, t("energy.grid")],
      [energy.sources.solar ?? 0, t("energy.solar")],
      [energy.sources.battery ?? 0, t("energy.battery")],
      [energy.devices ?? 0, t("energy.devices")],
    ];
    return html`<div class="found">
      <p>${t("onb.scan.energy")}</p>
      <div class="chips">
        ${items.map(
          ([count, label]) =>
            html`<span class="chip read"><ha-icon icon="mdi:eye-outline"></ha-icon>${count} ${label}</span>`,
        )}
      </div>
    </div>`;
  }

  private go(step: OnboardingStep): void {
    this.dispatchEvent(
      new CustomEvent("joe-onboarding", { detail: { step }, bubbles: true, composed: true }),
    );
  }

  private complete(): void {
    this.dispatchEvent(
      new CustomEvent("joe-onboarding", {
        detail: { step: "done", completed: true },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

define("joe-onboarding", JoeOnboarding);
