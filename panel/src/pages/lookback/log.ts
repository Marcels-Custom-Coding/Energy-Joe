import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { displayTitle, swoosh } from "../../components/bits";
import "../../components/log";
import { LOG_FILTERS, logDeviceName, logGroup, mergeLogs, type LogEntry, type LogGroup } from "../../components/log";
import { tip } from "../../components/tip";
import { define } from "../../define";
import type { Translate } from "../../i18n";
import { PANEL, href, navigate, onLink, type Route } from "../../router";
import { shared } from "../../styles/shared";
import type { ClimateFound, HomeAssistant, JoeState } from "../../types";

/** Rückblick › Protokoll: everything Joe switched, newest first, filtered by area and device (the address). */
export class JoeLookbackLog extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;
  @property({ attribute: false }) prefix = PANEL;
  @property({ attribute: false }) route?: Route;
  @property({ attribute: false }) climateFound?: ClimateFound;
  /** all|battery|climate|car|hot_water|other|joe */
  @property({ attribute: false }) group?: string;
  /** Joe's id of one device inside the group. */
  @property({ attribute: false }) device?: string;

  /** The whole log from energy_joe/log; undefined until loaded or when it failed. */
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
    this.load();
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    // Something new in either log: fetch the whole log again.
    const control = this.state?.control?.log ?? [];
    const climate = this.state?.climate?.log ?? [];
    const marker = `${control.length}|${control.at(-1)?.at ?? ""}|${climate.length}|${climate.at(-1)?.at ?? ""}`;
    if (changed.has("state") && this.marker !== undefined && marker !== this.marker) {
      this.load();
    }
    this.marker = marker;
  }

  protected updated(changed: PropertyValues<this>): void {
    // An unknown filter in the address: show all, under the address that says so.
    if (changed.has("group") && this.group && !(LOG_FILTERS as readonly string[]).includes(this.group)) {
      navigate(this, { tab: "review", section: "log" }, { replace: true });
    }
  }

  private async load(): Promise<void> {
    if (!this.hass) {
      return;
    }
    try {
      const result = await this.hass.callWS<{ entries: LogEntry[] } | null>({ type: "energy_joe/log" });
      if (!Array.isArray(result?.entries)) {
        throw new Error("no log");
      }
      this.full = result.entries;
      this.failed = false;
    } catch {
      // Older backend or no admin: the last entries from the state.
      this.full = undefined;
      this.failed = true;
    }
  }

  private get entries(): LogEntry[] {
    return this.full ?? mergeLogs(this.state?.control?.log, this.state?.climate?.log);
  }

  private get filter(): "all" | LogGroup {
    return (LOG_FILTERS as readonly string[]).includes(this.group ?? "") ? (this.group as "all" | LogGroup) : "all";
  }

  protected render() {
    const t = this.t;
    if (!t || !this.state) {
      return nothing;
    }
    const config = this.state.config;
    const entries = this.entries;
    const filter = this.filter;
    const names = Object.fromEntries((this.climateFound?.devices ?? []).map((d) => [d.entity_id, d.name]));
    // How many entries each area has, and which devices.
    const counts = new Map<string, number>([["all", entries.length]]);
    const devices = new Map<string, number>();
    for (const entry of entries) {
      const found = logGroup(config, entry);
      counts.set(found.group, (counts.get(found.group) ?? 0) + 1);
      if (found.group === filter && found.device) {
        devices.set(found.device, (devices.get(found.device) ?? 0) + 1);
      }
    }
    const device = filter !== "all" ? this.device : undefined;
    const label = [
      t(filter === "all" ? "past.log.all" : `past.log.filter.${filter}`),
      ...(device ? [logDeviceName(config, this.hass, names, filter as LogGroup, device)] : []),
    ].join(" · ");
    return html`<div class="wrap">
      ${displayTitle(t("past.log.title"))} ${swoosh}
      <p class="lead">${t("past.log.lead")}</p>
      <nav class="filters" aria-label=${t("past.log.filters")}>
        ${LOG_FILTERS.filter((id) => id === "all" || id === filter || counts.get(id)).map((id) =>
          this.chip({ tab: "review", section: "log", id }, t(id === "all" ? "past.log.all" : `past.log.filter.${id}`), id === filter && !device, counts.get(id)),
        )}
      </nav>
      ${filter !== "all" && filter !== "joe" && (devices.size > 1 || device)
        ? html`<nav class="filters" aria-label=${t("past.log.devices")}>
            ${[...new Set([...devices.keys(), ...(device ? [device] : [])])].map((id) =>
              this.chip(
                { tab: "review", section: "log", id: filter, sub: id },
                logDeviceName(config, this.hass, names, filter, id),
                id === device,
                devices.get(id) ?? 0,
              ),
            )}
          </nav>`
        : nothing}
      <section class="card" data-tipped>
        <div class="head">
          <div class="eyebrow"><ha-icon icon="mdi:clipboard-text-clock-outline"></ha-icon>${label}</div>
          ${tip(t, "past_log")}
        </div>
        ${this.failed && entries.length ? html`<div class="note"><ha-icon icon="mdi:information-outline"></ha-icon>${t("past.log.partial")}</div>` : nothing}
        <joe-log-list
          .t=${t}
          .hass=${this.hass}
          .config=${config}
          .names=${names}
          .entries=${entries}
          .filter=${{ group: filter, device }}
          .empty=${entries.length ? t("past.log.empty_filter") : t("past.log.empty")}
        ></joe-log-list>
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

define("joe-lookback-log", JoeLookbackLog);
