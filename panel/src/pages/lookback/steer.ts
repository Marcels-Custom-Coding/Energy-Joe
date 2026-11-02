import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { displayTitle, swoosh } from "../../components/bits";
import { LOG_FILTERS, logDeviceName, type LogEntry, type LogGroup } from "../../components/log";
import { loadLog, logMarker, stateLog, steerGroups } from "../../components/steer-list";
import "../../components/steer-list";
import { tip } from "../../components/tip";
import { define } from "../../define";
import type { Translate } from "../../i18n";
import { PANEL, href, navigate, onLink, type Route } from "../../router";
import { shared } from "../../styles/shared";
import type { ClimateFound, HomeAssistant, JoeState } from "../../types";

/** Rückblick › Steuerung: what Joe holds or waits for now, and every intervention of the last 7 days with its reason. */
export class JoeLookbackSteer extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;
  @property({ attribute: false }) prefix = PANEL;
  @property({ attribute: false }) route?: Route;
  @property({ attribute: false }) climateFound?: ClimateFound;
  /** all|battery|climate|car|hot_water|other|joe */
  @property({ attribute: false }) group?: string;
  @property({ attribute: false }) device?: string;

  /** The log of the last days from energy_joe/log; undefined until loaded or when it failed. */
  @state() private full?: LogEntry[];
  @state() private failed = false;

  private marker?: string;

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      .wrap {
        max-width: 1100px;
        margin: 0 auto;
      }
      .display {
        font-size: clamp(30px, 4vw, 44px);
      }
      .lead {
        max-width: 62ch;
      }
      .filters {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 16px;
      }
      .filters + .filters {
        margin-top: 8px;
      }
      .card {
        padding: 18px 20px;
        margin-top: 14px;
      }
      .head {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .head .eyebrow {
        flex: 1;
      }
      .note {
        margin-top: 12px;
      }
    `,
  ];

  connectedCallback(): void {
    super.connectedCallback();
    void this.load();
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    // Something new in either log: fetch the log again.
    const marker = logMarker(this.state);
    if (changed.has("state") && this.marker !== undefined && marker !== this.marker) {
      void this.load();
    }
    this.marker = marker;
  }

  protected updated(changed: PropertyValues<this>): void {
    if (changed.has("group") && this.group && !(LOG_FILTERS as readonly string[]).includes(this.group)) {
      navigate(this, { tab: "review", section: "steer" }, { replace: true });
    }
  }

  private async load(): Promise<void> {
    const entries = await loadLog(this.hass);
    this.full = entries;
    this.failed = !entries;
  }

  private get filter(): "all" | LogGroup {
    return (LOG_FILTERS as readonly string[]).includes(this.group ?? "") ? (this.group as "all" | LogGroup) : "all";
  }

  protected render() {
    const t = this.t;
    const joe = this.state;
    if (!t || !joe) {
      return nothing;
    }
    const config = joe.config;
    const entries = this.full ?? stateLog(joe);
    const filter = this.filter;
    const names = Object.fromEntries((this.climateFound?.devices ?? []).map((d) => [d.entity_id, d.name]));
    // How many interventions each area has, and which devices.
    const counts = new Map<string, number>([["all", 0]]);
    const devices = new Map<string, number>();
    for (const group of steerGroups(t, config, entries, names, this.hass)) {
      counts.set("all", (counts.get("all") ?? 0) + 1);
      counts.set(group.group, (counts.get(group.group) ?? 0) + 1);
      if (group.group === filter && group.device) {
        devices.set(group.device, (devices.get(group.device) ?? 0) + 1);
      }
    }
    const device = filter !== "all" ? this.device : undefined;
    const base = { tab: "review", section: "steer" } as const;
    return html`<div class="wrap">
      ${displayTitle(t("steer.title"))} ${swoosh}
      <p class="lead">${t("steer.lead")}</p>
      <section class="card" data-tipped>
        <div class="head">
          <div class="eyebrow"><ha-icon icon="mdi:robot-outline"></ha-icon>${t("steer.now")}</div>
          ${tip(t, "steer_now")}
        </div>
        <joe-steer-now .t=${t} .state=${joe}></joe-steer-now>
      </section>
      <div class="head" style="margin-top:22px">
        <div class="eyebrow"><ha-icon icon="mdi:clipboard-text-clock-outline"></ha-icon>${t("steer.history")}</div>
        ${tip(t, "steer_filter")}
      </div>
      <nav class="filters" aria-label=${t("past.log.filters")}>
        ${LOG_FILTERS.filter((id) => id === "all" || id === filter || counts.get(id)).map((id) =>
          this.chip({ ...base, id }, t(id === "all" ? "past.log.all" : `past.log.filter.${id}`), id === filter && !device, counts.get(id)),
        )}
      </nav>
      ${filter !== "all" && filter !== "joe" && (devices.size > 1 || device)
        ? html`<nav class="filters" aria-label=${t("past.log.devices")}>
            ${[...new Set([...devices.keys(), ...(device ? [device] : [])])].map((id) =>
              this.chip({ ...base, id: filter, sub: id }, logDeviceName(config, this.hass, names, filter, id), id === device, devices.get(id) ?? 0),
            )}
          </nav>`
        : nothing}
      <section class="card" data-tipped>
        ${this.failed && entries.length ? html`<div class="note"><ha-icon icon="mdi:information-outline"></ha-icon>${t("past.log.partial")}</div>` : nothing}
        <joe-steer-list
          .t=${t}
          .hass=${this.hass}
          .config=${config}
          .names=${names}
          .entries=${entries}
          .filter=${{ group: filter, device }}
          .empty=${entries.length ? t("steer.empty_filter") : t("steer.empty")}
        ></joe-steer-list>
      </section>
    </div>`;
  }

  /** A filter is an address: a link styled as a chip. */
  private chip(to: Route, label: string, on: boolean, count?: number): TemplateResult {
    return html`<a
      class="section-chip ${on ? "on" : ""}"
      href=${href(this.prefix, to)}
      aria-current=${on ? "page" : nothing}
      @click=${onLink(to, { replace: true })}
      >${label}${count != null ? html`<span class="section-count">${count}</span>` : nothing}</a
    >`;
  }
}

define("joe-lookback-steer", JoeLookbackSteer);
