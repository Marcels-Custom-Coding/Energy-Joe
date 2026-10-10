import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { deviceLink, displayTitle } from "../components/bits";
import { tip } from "../components/tip";
import "../components/week-bar";
import { define } from "../define";
import { formatNumber } from "../entities";
import type { Translate } from "../i18n";
import { PANEL, href, onLink, type Route } from "../router";
import { shared } from "../styles/shared";
import {
  WEEK_MODES,
  WEEK_TAGS,
  type ClimateDevice,
  type ClimateStatus,
  type HomeAssistant,
  type JoeConfig,
  type WeekMode,
  type WeekPoint,
  type WeekProfile,
  type WeekSplit,
  type WeekTag,
  type WeekValue,
} from "../types";
import {
  CURVES,
  LAST_MINUTE,
  MAX_POINTS,
  MINUTE_STEP,
  TAG_ICONS,
  VALUE_MAX,
  VALUE_MIN,
  clock,
  curveIndex,
  fitValue,
  houseNow,
  minuteOf,
  newPointMinute,
  resplit,
  setProblem,
  valueAt,
} from "../week";

const SPLITS: WeekSplit[] = ["all", "week_weekend", "each"];
/** A room's night when not set yet (model.py). */
const NIGHT_FROM = "23:00";
const NIGHT_UNTIL = "06:30";
/** Haushalt › Tage & Kalender: the calendar rules that tell home office days. */
const DAYS: Route = { tab: "household", section: "days" };

/** A weekday's name (0 = Monday); 1 January 2024 was a Monday. */
export function weekdayName(lang: string, weekday: number, style: "long" | "short" = "long"): string {
  return new Intl.DateTimeFormat(lang, { weekday: style, timeZone: "UTC" }).format(new Date(Date.UTC(2024, 0, 1 + weekday)));
}

/**
 * Week profiles of an air conditioner: six per operating mode, each a curve
 * of switching points over the day (or one per day group). Everything is a
 * draft until "Save"; nothing changes at the device while editing.
 */
export class JoeWeekEditor extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) config?: JoeConfig;
  @property({ attribute: false }) status?: ClimateStatus;
  @property({ attribute: false }) entityId = "";

  @state() private device?: ClimateDevice;
  /** Devices asked for and answered (or failed). */
  @state() private fetched = false;
  @state() private failed = false;
  @state() private drafts: Partial<Record<WeekMode, WeekProfile[]>> = {};
  @state() private mode?: WeekMode;
  @state() private selected: Record<WeekMode, number> = { heat: 0, cool: 0 };
  /** The day group whose switching points are shown. */
  @state() private open = 0;
  /** A short note about the last change (a tag that moved, a split, a copy), shown where it happened. */
  @state() private notice?: { text: string; at: "tags" | "days" | "points" };
  @state() private rowError?: { curve: number; point: number; text: string };
  /** The row error when "Save" was pressed (before the field lost focus). */
  private pressShown?: { curve: number; point: number; text: string } | null;
  @state() private creating = false;
  @state() private saving = false;
  @state() private errors: Partial<Record<WeekMode, string>> = {};
  /** Modes whose loaded or proposed values had to be fitted to the device's limits. */
  @state() private fitted: Partial<Record<WeekMode, boolean>> = {};

  private loaded = false;
  private requested = false;
  private timer?: number;

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      .head {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px 10px;
        margin-top: 10px;
      }
      .head b {
        font-weight: 700;
        overflow-wrap: anywhere;
      }
      a.mini-btn {
        text-decoration: none;
      }
      .seg .dot {
        display: inline-block;
        width: 7px;
        height: 7px;
        margin-left: 6px;
        border-radius: 50%;
        background: var(--joe-amber);
        vertical-align: middle;
      }
      .seg .dot.bad {
        background: var(--joe-warn);
      }
      .field > .seg {
        justify-self: start;
        max-width: 100%;
      }
      .field > .seg.full {
        justify-self: stretch;
      }
      .seg.full {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        border-radius: 14px;
        width: 100%;
      }
      .seg.full button {
        border-radius: 11px;
        line-height: 1.2;
        text-wrap: balance;
      }
      .tiles {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
      }
      @media (min-width: 720px) {
        .tiles {
          grid-template-columns: repeat(6, minmax(0, 1fr));
        }
      }
      .tile {
        display: grid;
        align-content: start;
        gap: 6px;
        min-width: 0;
        min-height: 76px;
        padding: 8px 9px 9px;
        border: 0;
        border-radius: 12px;
        background: var(--joe-surface-2);
        color: var(--joe-ink);
        text-align: left;
        cursor: pointer;
        transition: background 0.12s, box-shadow 0.12s, transform 0.12s;
      }
      .tile:hover {
        background: var(--joe-line);
      }
      .tile:active {
        transform: scale(0.98);
      }
      .tile[aria-pressed="true"],
      .tile[aria-pressed="true"]:hover {
        background: var(--joe-amber-soft);
        box-shadow: inset 0 0 0 2px var(--joe-amber);
      }
      .tile-top {
        display: flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
      }
      .tile-top .no {
        flex: none;
        display: grid;
        place-items: center;
        width: 20px;
        height: 20px;
        border-radius: 6px;
        background: var(--joe-ink);
        color: var(--joe-bg);
        font-size: 12px;
        font-weight: 800;
      }
      .tile-top .name {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 700;
        font-size: 13.5px;
      }
      .running {
        flex: none;
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: var(--joe-good);
        box-shadow: 0 0 0 3px var(--joe-good-soft);
      }
      .tile-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 2px 6px;
        min-height: 16px;
        font-size: 11.5px;
        font-weight: 600;
        color: var(--joe-ink-2);
      }
      .tile-tags span {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        min-width: 0;
      }
      .tile-tags ha-icon {
        --mdc-icon-size: 13px;
      }
      .profile {
        margin-top: 6px;
        padding-top: 4px;
        border-top: 1px solid var(--joe-line);
      }
      .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .tag-btn[aria-pressed="true"] {
        background: var(--joe-amber-soft);
        box-shadow: inset 0 0 0 2px var(--joe-amber);
      }
      .tag-btn[aria-pressed="true"]:hover:not([disabled]) {
        background: var(--joe-amber-soft);
      }
      .groups {
        display: grid;
        gap: 8px;
      }
      .group {
        border-radius: 12px;
        box-shadow: inset 0 0 0 1px var(--joe-line);
        padding: 10px 12px 12px;
        min-width: 0;
      }
      .group.open {
        box-shadow: inset 0 0 0 1.5px var(--joe-line-2);
      }
      .group-head {
        display: grid;
        grid-template-columns: 112px minmax(0, 1fr);
        align-items: center;
        gap: 10px;
        width: 100%;
        padding: 0;
        border: 0;
        background: none;
        color: inherit;
        text-align: left;
      }
      button.group-head {
        cursor: pointer;
        min-height: 44px;
      }
      .day-label {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 4px 6px;
        font-weight: 700;
        min-width: 0;
      }
      .day-label ha-icon {
        color: var(--joe-muted);
      }
      .points {
        display: grid;
        margin-top: 10px;
      }
      .point {
        display: grid;
        grid-template-columns: 112px minmax(0, 1fr) auto 44px;
        grid-template-areas: "time value off del";
        align-items: center;
        gap: 6px 10px;
        padding: 6px 0;
        border-top: 1px solid var(--joe-line);
      }
      .point .time {
        grid-area: time;
      }
      .point .value {
        grid-area: value;
      }
      .point .off {
        grid-area: off;
      }
      .point .del {
        grid-area: del;
      }
      .time.input {
        width: 112px;
        min-width: 0;
      }
      .time.fixed {
        width: 112px;
        display: inline-flex;
        align-items: center;
        min-height: 42px;
        padding: 0 12px;
        border-radius: 9px;
        color: var(--joe-muted);
        font-variant-numeric: tabular-nums;
        box-shadow: inset 0 0 0 1px var(--joe-line);
      }
      .value {
        display: flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
      }
      .value .num {
        width: 76px;
        min-width: 0;
        text-align: center;
        padding: 8px 6px;
      }
      .value .unit {
        color: var(--joe-muted);
      }
      .step {
        justify-content: center;
        width: 40px;
        padding: 0;
        font-size: 18px;
        font-weight: 700;
      }
      .off-text {
        display: inline-flex;
        align-items: center;
        min-height: 42px;
        padding: 0 14px;
        border-radius: 9px;
        font-weight: 600;
        color: var(--joe-ink-2);
        background: repeating-linear-gradient(-45deg, var(--joe-surface-2) 0 4px, var(--joe-line) 4px 6px);
      }
      .off {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 13.5px;
        color: var(--joe-ink-2);
      }
      .del {
        justify-content: center;
        padding: 0;
        width: 44px;
      }
      .row-error {
        margin: 0 0 6px;
        color: var(--joe-warn);
        font-size: 13px;
        font-weight: 600;
      }
      .point-actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px 12px;
        margin-top: 10px;
      }
      .copy {
        width: auto;
        min-width: 0;
        max-width: 100%;
      }
      .note {
        margin-top: 10px;
      }
      .empty {
        display: grid;
        justify-items: start;
        gap: 12px;
        margin-top: 16px;
        padding: 16px;
        border-radius: 12px;
        border: 1.5px dashed var(--joe-line-2);
      }
      .empty p {
        margin: 0;
      }
      /* Sticks to the sheet's bottom edge, over its padding. */
      .foot {
        position: sticky;
        bottom: -22px;
        z-index: 1;
        margin: 22px -22px -22px;
        padding: 12px 22px 16px;
        background: var(--joe-surface);
        box-shadow: 0 -1px 0 var(--joe-line);
      }
      .foot .actions {
        margin-top: 0;
      }
      .foot .note {
        margin: 0 0 10px;
      }
      @media (max-width: 600px) {
        .foot {
          bottom: calc(-20px - env(safe-area-inset-bottom));
          margin: 20px -16px calc(-20px - env(safe-area-inset-bottom));
          padding: 10px 16px calc(12px + env(safe-area-inset-bottom));
        }
        .group-head {
          grid-template-columns: 1fr;
          gap: 6px;
        }
        .point {
          grid-template-columns: minmax(0, 1fr) auto 44px;
          grid-template-areas:
            "time off del"
            "value value value";
        }
        .seg.full button {
          padding: 6px 8px;
          font-size: 13.5px;
        }
        /* The dot on the mode says it already; the bar stays one line. */
        .foot .chip {
          display: none;
        }
      }
      @media (pointer: coarse) {
        .step {
          width: 44px;
        }
      }
    `,
  ];

  connectedCallback(): void {
    super.connectedCallback();
    // The "now" line moves on.
    this.timer = window.setInterval(() => this.requestUpdate(), 60_000);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.clearInterval(this.timer);
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has("entityId") && changed.get("entityId")) {
      // Another device in the same sheet: start over.
      this.loaded = false;
      this.requested = false;
      this.fetched = false;
      this.device = undefined;
      this.mode = undefined;
      this.drafts = {};
      this.errors = {};
      this.fitted = {};
      this.notice = undefined;
      this.rowError = undefined;
    }
    if (this.hass && !this.requested) {
      this.requested = true;
      void this.load();
    }
    if ((changed.has("config") || changed.has("entityId")) && this.config && this.entityId && !this.loaded) {
      this.loaded = true;
      this.drafts = structuredClone(this.room?.week?.modes ?? {});
      this.fitDrafts(WEEK_MODES);
      this.pickMode();
    }
  }

  private get room() {
    return this.config?.climate?.rooms?.[this.entityId];
  }

  private async load(): Promise<void> {
    try {
      const found = await this.hass?.callWS<{ devices: ClimateDevice[] }>({ type: "energy_joe/climate/devices" });
      this.device = found?.devices.find((d) => d.entity_id === this.entityId);
      this.failed = !found;
    } catch {
      this.failed = true;
    }
    this.fetched = true;
    this.fitDrafts(WEEK_MODES);
    this.pickMode();
  }

  /**
   * Keeps the drafts' values within what the device can do (stored ones may
   * come from before, proposals from a general rule) and notes where it did.
   */
  private fitDrafts(modes: WeekMode[]): void {
    if (!this.device || !this.loaded) return;
    const { step, min, max } = this.limits;
    let drafts = this.drafts;
    let fitted = this.fitted;
    for (const mode of modes) {
      const list = drafts[mode];
      if (!list) continue;
      let changed = false;
      const next = list.map((profile) => ({
        ...profile,
        curves: profile.curves.map((curve) =>
          curve.map(([minute, value]): WeekPoint => {
            if (value === "off") return [minute, value];
            const fit = fitValue(value, step, min, max);
            if (fit !== value) changed = true;
            return [minute, fit];
          }),
        ),
      }));
      if (changed) {
        drafts = { ...drafts, [mode]: next };
        fitted = { ...fitted, [mode]: true };
      }
    }
    if (drafts !== this.drafts) {
      this.drafts = drafts;
      this.fitted = fitted;
    }
  }

  private get modes(): WeekMode[] {
    return WEEK_MODES.filter((mode) => this.device?.hvac_modes.includes(mode));
  }

  /** Start with the mode the device runs in, and the profile running now. */
  private pickMode(): void {
    if (this.mode || !this.device || !this.loaded) return;
    const status = this.status?.rooms?.[this.entityId];
    const live = this.hass?.states[this.entityId]?.state ?? this.device.state;
    const mode = [status?.mode, live, ...this.modes].find((m): m is WeekMode => !!m && this.modes.includes(m as WeekMode));
    if (!mode) return;
    this.mode = mode;
    if (status?.mode === mode && status.profile?.index != null) {
      this.selected = { ...this.selected, [mode]: status.profile.index };
    }
    this.openToday();
  }

  private get index(): number {
    return this.mode ? this.selected[this.mode] : 0;
  }

  private get profiles(): WeekProfile[] | undefined {
    return this.mode ? this.drafts[this.mode] : undefined;
  }

  private get now(): { weekday: number; minute: number } {
    return houseNow(this.hass?.config?.time_zone);
  }

  /** Shows the switching points of today's day group. */
  private openToday(): void {
    const profile = this.profiles?.[this.index];
    this.open = profile ? curveIndex(profile.split, this.now.weekday) : 0;
  }

  /** The device's limits for a temperature. */
  private get limits(): { step: number; min: number; max: number } {
    const step = this.device?.target_temp_step || 0.5;
    const min = Math.max(VALUE_MIN, this.device?.min_temp ?? VALUE_MIN);
    const max = Math.min(VALUE_MAX, this.device?.max_temp ?? VALUE_MAX);
    return min < max ? { step, min, max } : { step, min: VALUE_MIN, max: VALUE_MAX };
  }

  protected render() {
    const { t, device } = this;
    if (!t || !this.config) {
      return nothing;
    }
    const title = html`<div class="sheet-title">${displayTitle(t("week.title"))}</div>`;
    if (!device) {
      return html`${title}
        ${this.fetched
          ? html`<div class="note warn">
              <ha-icon icon="mdi:alert-outline"></ha-icon><span>${t(this.failed ? "week.load_failed" : "week.device_missing")}</span>
            </div>`
          : html`<p class="field-hint">${t("week.loading")}</p>`}
        <div class="actions" data-notip>
          <button type="button" class="btn btn-secondary" @click=${this.close}>${t("mode.close")}</button>
        </div>`;
    }
    const modes = this.modes;
    const mode = this.mode;
    const profiles = this.profiles;
    return html`${title}
      <div class="head">
        <b>${deviceLink(device.device_id, device.name, t("climate.open_device", { id: device.entity_id }))}</b>
        ${device.area ? html`<span class="chip">${device.area}</span>` : nothing}
      </div>
      ${modes.length
        ? html`<div class="field" data-tipped>
            <div class="field-label">${t("week.modes")} ${tip(t, "week_mode")}</div>
            <span class="seg" role="group" aria-label=${t("week.modes")}>
              ${modes.map(
                (m) => html`<button type="button" aria-pressed=${String(m === mode)} @click=${() => this.setMode(m)}>
                  ${t(`week.mode.${m}`)}${this.errors[m]
                    ? html`<span class="dot bad" title=${this.errors[m]!}></span>`
                    : this.isDirty(m)
                      ? html`<span class="dot" title=${t("week.unsaved")}></span>`
                      : nothing}
                </button>`,
              )}
            </span>
          </div>`
        : html`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${t("week.no_modes")}</span></div>`}
      ${mode ? (profiles ? this.renderSet(t, mode, profiles) : this.renderEmpty(t, mode)) : nothing}
      <div class="foot" data-notip>
        ${mode && this.errors[mode]
          ? html`<div class="note warn" role="alert">
              <ha-icon icon="mdi:alert-outline"></ha-icon><span>${t("week.save_failed", { mode: t(`week.mode.${mode}`), error: this.errors[mode]! })}</span>
            </div>`
          : nothing}
        <div class="actions">
          <button
            type="button"
            class="btn btn-primary"
            ?disabled=${this.saving || !modes.length}
            @pointerdown=${() => (this.pressShown = this.rowError ?? null)}
            @click=${this.save}
          >
            ${t(this.saving ? "week.saving" : "common.save")}
          </button>
          <button type="button" class="btn btn-ghost" @click=${this.close}>${t("common.cancel")}</button>
          ${modes.some((m) => this.isDirty(m)) ? html`<span class="chip warn">${t("week.unsaved")}</span>` : nothing}
        </div>
      </div>`;
  }

  /** No profiles for this mode yet: Joe proposes six. */
  private renderEmpty(t: Translate, mode: WeekMode): TemplateResult {
    return html`<div class="empty" data-tipped>
      <p>${t("week.empty", { mode: t(`week.mode.${mode}`) })}</p>
      <span class="with-tip">
        <button type="button" class="btn btn-primary" ?disabled=${this.creating} @click=${() => void this.create(mode)}>
          ${t(this.creating ? "week.creating" : "week.create")}
        </button>
        ${tip(t, "week_create")}
      </span>
    </div>`;
  }

  private renderSet(t: Translate, mode: WeekMode, profiles: WeekProfile[]): TemplateResult {
    const status = this.status?.rooms?.[this.entityId];
    const running = status?.kind === "week" && status.mode === mode ? status.profile?.index : undefined;
    const now = this.now;
    const index = this.index;
    const profile = profiles[index];
    return html`<div class="field" data-tipped>
        <div class="field-label">${t("week.profiles")} ${tip(t, "week_profiles")}</div>
        <div class="tiles" role="group" aria-label=${t("week.profiles")}>
          ${profiles.map((p, i) => {
            const name = p.name || t("week.profile", { n: i + 1 });
            return html`<button
              type="button"
              class="tile"
              aria-pressed=${String(i === index)}
              @click=${() => this.select(i)}
            >
              <span class="tile-top">
                <span class="no" aria-hidden="true">${i + 1}</span>
                <span class="name">${name}</span>
                ${i === running ? html`<span class="running" role="img" aria-label=${t("week.running")} title=${t("week.running")}></span>` : nothing}
              </span>
              <span class="tile-tags">
                ${p.tags.map((tag) => html`<span><ha-icon icon=${TAG_ICONS[tag]}></ha-icon>${t(`week.tag.${tag}`)}</span>`)}
              </span>
              <joe-week-bar
                compact
                .points=${p.curves[curveIndex(p.split, now.weekday)] ?? p.curves[0] ?? []}
                .now=${now.minute}
                mode=${mode}
                lang=${t.lang}
                label=${t("week.curve", { label: `${name}, ${t("week.today")}` })}
              ></joe-week-bar>
            </button>`;
          })}
        </div>
        ${profiles.some((p) => p.tags.includes("normal"))
          ? nothing
          : html`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${t("week.no_normal")}</span></div>`}
      </div>
      ${profile ? this.renderProfile(t, mode, profiles, profile) : nothing}`;
  }

  private renderProfile(t: Translate, mode: WeekMode, profiles: WeekProfile[], profile: WeekProfile): TemplateResult {
    const index = this.index;
    const day = this.status?.day;
    const homeOffice = day ? day.home_office_available : true;
    const reason = day?.home_office_reason ?? "no_calendar";
    return html`<div class="profile">
      <div class="field" data-tipped>
        <div class="field-label"><label for="week-name">${t("week.name")}</label> ${tip(t, "week_name")}</div>
        <input
          id="week-name"
          class="input"
          type="text"
          maxlength="30"
          placeholder=${t("week.profile", { n: index + 1 })}
          .value=${profile.name}
          @input=${(ev: Event) => {
            const name = (ev.target as HTMLInputElement).value.slice(0, 30);
            this.change((p) => {
              p.name = name;
            }, false);
          }}
          @change=${(ev: Event) => {
            const name = (ev.target as HTMLInputElement).value.trim().slice(0, 30);
            this.change((p) => {
              p.name = name;
            }, false);
          }}
        />
      </div>
      <div class="field" data-tipped>
        <div class="field-label">${t("week.tags")} ${tip(t, "week_tags")}</div>
        <div class="tags" role="group" aria-label=${t("week.tags")}>
          ${WEEK_TAGS.map((tag) => {
            const on = profile.tags.includes(tag);
            const blocked = tag === "home_office" && !homeOffice && !on;
            return html`<button
              type="button"
              class="mini-btn tag-btn"
              aria-pressed=${String(on)}
              ?disabled=${blocked}
              title=${blocked ? t(`week.ho.${reason}`) : ""}
              @click=${() => this.toggleTag(profiles, tag)}
            >
              <ha-icon icon=${TAG_ICONS[tag]}></ha-icon>${t(`week.tag.${tag}`)}
            </button>`;
          })}
        </div>
        ${homeOffice
          ? nothing
          : html`<p class="field-hint">${t(`week.ho.${reason}`)}</p>
              <div>
                <a class="mini-btn quiet" href=${href(PANEL, DAYS)} @click=${onLink(DAYS)}>
                  <ha-icon icon="mdi:calendar-text-outline"></ha-icon>${t("week.ho.rules")}
                </a>
              </div>`}
        ${profile.tags.length ? nothing : html`<p class="field-hint">${t("week.untagged")}</p>`} ${this.noticeAt("tags")}
      </div>
      <div class="field" data-tipped>
        <div class="field-label">${t("week.days")} ${tip(t, "week_split")}</div>
        <span class="seg full" role="group" aria-label=${t("week.days")}>
          ${SPLITS.map(
            (split) => html`<button type="button" aria-pressed=${String(profile.split === split)} @click=${() => this.setSplit(split)}>
              ${t(`week.split.${split}`)}
            </button>`,
          )}
        </span>
      </div>
      ${this.noticeAt("days")} ${this.renderGroups(t, mode, profile)}
    </div>`;
  }

  private noticeAt(at: "tags" | "days" | "points"): TemplateResult | typeof nothing {
    return this.notice?.at === at
      ? html`<div class="note" role="status"><ha-icon icon="mdi:information-outline"></ha-icon><span>${this.notice.text}</span></div>`
      : nothing;
  }

  private groupLabel(t: Translate, split: WeekSplit, index: number): string {
    if (split === "all") return t("week.group.all");
    if (split === "week_weekend") return t(index === 0 ? "week.group.weekdays" : "week.group.weekend");
    return weekdayName(t.lang, index);
  }

  private renderGroups(t: Translate, mode: WeekMode, profile: WeekProfile): TemplateResult {
    const now = this.now;
    const today = curveIndex(profile.split, now.weekday);
    const many = profile.curves.length > 1;
    const { step, min, max } = this.limits;
    const room = this.room;
    return html`<div class="field" data-tipped>
      <div class="field-label">${t("week.points")} ${tip(t, "week_points")}</div>
      <p class="field-hint">
        ${t("week.limits", { min: formatNumber(t.lang, min, 1), max: formatNumber(t.lang, max, 1), step: formatNumber(t.lang, step, 2) })}
      </p>
      ${this.fitted[mode]
        ? html`<div class="note" role="status"><ha-icon icon="mdi:information-outline"></ha-icon><span>${t("week.fitted")}</span></div>`
        : nothing}
      ${room?.night_off
        ? html`<p class="field-hint">
            ${this.config?.climate?.night_by === "entity"
              ? t("week.night_entity", { until: room.night_until ?? NIGHT_UNTIL })
              : t("week.night_time", { from: room.night_from ?? NIGHT_FROM, until: room.night_until ?? NIGHT_UNTIL })}
          </p>`
        : nothing}
      <div class="groups">
        ${profile.curves.map((curve, i) => {
          const label = this.groupLabel(t, profile.split, i);
          const open = !many || this.open === i;
          const bar = html`<span class="day-label">
              ${many ? html`<ha-icon icon=${open ? "mdi:chevron-down" : "mdi:chevron-right"}></ha-icon>` : nothing}${label}
              ${i === today ? html`<span class="chip ok">${t("week.today")}</span>` : nothing}
            </span>
            <joe-week-bar
              .points=${curve}
              .now=${i === today ? now.minute : null}
              mode=${mode}
              lang=${t.lang}
              offText=${t("week.off")}
              label=${t("week.curve", { label })}
            ></joe-week-bar>`;
          return html`<div class="group ${open ? "open" : ""}">
            ${many
              ? html`<button type="button" class="group-head" aria-expanded=${String(open)} @click=${() => this.openGroup(i)}>${bar}</button>`
              : html`<div class="group-head">${bar}</div>`}
            ${open ? this.renderPoints(t, profile, i, curve, { step, min, max }) : nothing}
          </div>`;
        })}
      </div>
    </div>`;
  }

  private renderPoints(
    t: Translate,
    profile: WeekProfile,
    group: number,
    curve: WeekPoint[],
    limits: { step: number; min: number; max: number },
  ): TemplateResult {
    const { step, min, max } = limits;
    const stepText = formatNumber(t.lang, step, 2);
    const error = this.rowError?.curve === group ? this.rowError : undefined;
    return html`<div class="points" role="list" aria-label=${t("week.points")}>
        ${repeat(curve, ([minute]) => minute, ([minute, value], i) => {
          const time = clock(minute);
          return html`<div class="point" role="listitem">
              ${i === 0
                ? html`<span class="time fixed" title=${t("week.point.first")}>00:00</span>`
                : html`<input
                    class="input time"
                    type="time"
                    step="300"
                    required
                    aria-label=${t("week.point.time")}
                    .value=${time}
                    @blur=${(ev: Event) => this.setTime(group, i, ev.target as HTMLInputElement)}
                    @keydown=${(ev: KeyboardEvent) => ev.key === "Enter" && (ev.target as HTMLInputElement).blur()}
                  />`}
              <span class="value">
                ${value === "off"
                  ? html`<span class="off-text">${t("week.off")}</span>`
                  : html`<button
                        type="button"
                        class="mini-btn step"
                        aria-label=${t("week.point.less", { step: stepText })}
                        ?disabled=${value <= min}
                        @click=${() => this.setValue(group, i, value - step)}
                      >
                        −
                      </button>
                      <input
                        class="input num"
                        type="number"
                        inputmode="decimal"
                        step=${step}
                        min=${min}
                        max=${max}
                        aria-label=${t("week.point.value", { time })}
                        .value=${String(value)}
                        @change=${(ev: Event) => {
                          const input = ev.target as HTMLInputElement;
                          const typed = Number.parseFloat(input.value.replace(",", "."));
                          // The field shows what is kept: rounded to the step and within the limits.
                          input.value = String(Number.isFinite(typed) ? this.setValue(group, i, typed) : value);
                        }}
                      />
                      <button
                        type="button"
                        class="mini-btn step"
                        aria-label=${t("week.point.more", { step: stepText })}
                        ?disabled=${value >= max}
                        @click=${() => this.setValue(group, i, value + step)}
                      >
                        +
                      </button>
                      <span class="unit">°C</span>`}
              </span>
              <span class="off">
                <button
                  type="button"
                  class="switch"
                  role="switch"
                  aria-checked=${String(value === "off")}
                  aria-label=${t("week.point.off", { time })}
                  @click=${() => this.toggleOff(group, i)}
                ></button>
                <span aria-hidden="true">${t("week.off")}</span>
              </span>
              ${i === 0
                ? html`<span class="del"></span>`
                : html`<button
                    type="button"
                    class="mini-btn quiet del"
                    aria-label=${t("week.point.delete", { time })}
                    title=${t("week.point.delete", { time })}
                    @click=${() => this.removePoint(group, i)}
                  >
                    <ha-icon icon="mdi:delete-outline"></ha-icon>
                  </button>`}
            </div>
            ${error?.point === i ? html`<p class="row-error" role="alert">${error.text}</p>` : nothing}`;
        })}
      </div>
      <div class="point-actions">
        <span class="with-tip" data-tipped>
          <button type="button" class="mini-btn" ?disabled=${curve.length >= MAX_POINTS} @click=${() => this.addPoint(group)}>
            <ha-icon icon="mdi:plus"></ha-icon>${t("week.point.add")}
          </button>
          ${tip(t, "week_add")}
        </span>
        ${profile.curves.length > 1 ? this.renderCopy(t, profile, group) : nothing}
      </div>
      ${curve.length >= MAX_POINTS ? html`<p class="field-hint">${t("week.point.max")}</p>` : nothing} ${this.noticeAt("points")}`;
  }

  /** "Copy to …": the other group, or all, Mon–Fri, Sat–Sun or single days. */
  private renderCopy(t: Translate, profile: WeekProfile, group: number): TemplateResult {
    const options: { value: string; label: string }[] =
      profile.split === "week_weekend"
        ? [{ value: String(1 - group), label: t(group === 0 ? "week.group.weekend" : "week.group.weekdays") }]
        : [
            { value: "all", label: t("week.copy.all") },
            { value: "weekdays", label: t("week.group.weekdays") },
            { value: "weekend", label: t("week.group.weekend") },
            ...[0, 1, 2, 3, 4, 5, 6].filter((d) => d !== group).map((d) => ({ value: String(d), label: weekdayName(t.lang, d) })),
          ];
    return html`<span class="with-tip" data-tipped>
      <select
        class="input copy"
        aria-label=${t("week.copy")}
        @change=${(ev: Event) => {
          const select = ev.target as HTMLSelectElement;
          const choice = options.find((o) => o.value === select.value);
          select.value = "";
          if (choice) this.copyTo(group, choice.value, choice.label);
        }}
      >
        <option value="" selected disabled>${t("week.copy")}</option>
        ${options.map((o) => html`<option value=${o.value}>${o.label}</option>`)}
      </select>
      ${tip(t, "week_copy")}
    </span>`;
  }

  // --- Changes to the draft ---

  /** Changes the selected profile (a copy); "clear" drops the last note. */
  private change(fn: (profile: WeekProfile, all: WeekProfile[]) => void, clear = true): void {
    const mode = this.mode;
    const list = mode ? this.drafts[mode] : undefined;
    if (!mode || !list) return;
    if (clear) {
      this.notice = undefined;
      this.rowError = undefined;
    }
    const next = structuredClone(list);
    fn(next[this.index], next);
    this.drafts = { ...this.drafts, [mode]: next };
    if (this.errors[mode]) {
      this.errors = { ...this.errors, [mode]: undefined };
    }
  }

  private changeCurve(group: number, fn: (curve: WeekPoint[]) => void): void {
    this.change((profile) => {
      const curve = profile.curves[group];
      if (!curve) return;
      fn(curve);
      curve.sort((a, b) => a[0] - b[0]);
    });
  }

  private setMode(mode: WeekMode): void {
    if (mode === this.mode) return;
    this.mode = mode;
    this.notice = undefined;
    this.rowError = undefined;
    this.openToday();
  }

  private select(index: number): void {
    if (!this.mode || index === this.index) return;
    this.selected = { ...this.selected, [this.mode]: index };
    this.notice = undefined;
    this.rowError = undefined;
    this.openToday();
  }

  private openGroup(group: number): void {
    this.open = group;
    this.rowError = undefined;
  }

  private toggleTag(profiles: WeekProfile[], tag: WeekTag): void {
    const t = this.t!;
    const index = this.index;
    const on = profiles[index].tags.includes(tag);
    if (on && tag === "normal") {
      this.notice = { text: t("week.normal_fixed"), at: "tags" };
      return;
    }
    const from = on ? -1 : profiles.findIndex((p, i) => i !== index && p.tags.includes(tag));
    this.change((profile, all) => {
      if (on) {
        profile.tags = profile.tags.filter((x) => x !== tag);
        return;
      }
      if (from >= 0) {
        all[from].tags = all[from].tags.filter((x) => x !== tag);
      }
      profile.tags = WEEK_TAGS.filter((x) => x === tag || profile.tags.includes(x));
    });
    if (from >= 0) {
      const name = profiles[from].name || t("week.profile", { n: from + 1 });
      this.notice = { text: t("week.tag.moved", { tag: t(`week.tag.${tag}`), from: name }), at: "tags" };
    }
  }

  private setSplit(split: WeekSplit): void {
    const t = this.t!;
    const profile = this.profiles?.[this.index];
    if (!profile || profile.split === split) return;
    const before = profile.split;
    this.change((p) => {
      p.curves = resplit(p, split);
      p.split = split;
    });
    const text =
      CURVES[split] > CURVES[before]
        ? t("week.split.split")
        : before === "each" && split === "week_weekend"
          ? t("week.split.merged_days")
          : t("week.split.merged", { first: before === "each" ? weekdayName(t.lang, 0) : t("week.group.weekdays") });
    this.notice = { text, at: "days" };
    this.open = curveIndex(split, this.now.weekday);
  }

  private setTime(group: number, point: number, input: HTMLInputElement): void {
    const t = this.t!;
    const curve = this.profiles?.[this.index]?.curves[group];
    if (!curve) return;
    const old = curve[point][0];
    const typed = minuteOf(input.value);
    if (typed == null) {
      input.value = clock(old);
      return;
    }
    const minute = Math.min(LAST_MINUTE, Math.max(MINUTE_STEP, Math.round(typed / MINUTE_STEP) * MINUTE_STEP));
    if (minute === old) {
      input.value = clock(old);
      return;
    }
    if (curve.some(([at], i) => i !== point && at === minute)) {
      input.value = clock(old);
      this.rowError = { curve: group, point, text: t("week.point.duplicate", { time: clock(minute) }) };
      return;
    }
    input.value = clock(minute);
    this.changeCurve(group, (c) => {
      c[point][0] = minute;
    });
  }

  /** Sets a point's value fitted to the device; returns what was set. */
  private setValue(group: number, point: number, value: number): number {
    const { step, min, max } = this.limits;
    const fit = fitValue(value, step, min, max);
    this.changeCurve(group, (c) => {
      c[point][1] = fit;
    });
    return fit;
  }

  /** "Off" and back: the value before, or the device's current target. */
  private toggleOff(group: number, point: number): void {
    const curve = this.profiles?.[this.index]?.curves[group];
    if (!curve) return;
    const { step, min, max } = this.limits;
    let value: WeekValue = "off";
    if (curve[point][1] === "off") {
      const before = [...curve.slice(0, point)].reverse().find(([, v]) => v !== "off")?.[1];
      const any = curve.find(([, v]) => v !== "off")?.[1];
      value = fitValue(Number(before ?? any ?? this.fallbackValue()), step, min, max);
    }
    this.changeCurve(group, (c) => {
      c[point][1] = value;
    });
  }

  private fallbackValue(): number {
    const device = this.device;
    const live = this.hass?.states[this.entityId];
    const target = Number(live?.attributes.temperature ?? device?.temperature);
    if ((live?.state ?? device?.state) === this.mode && Number.isFinite(target)) return target;
    return this.mode === "cool" ? 25 : 21;
  }

  private addPoint(group: number): void {
    const t = this.t!;
    const curve = this.profiles?.[this.index]?.curves[group];
    if (!curve || curve.length >= MAX_POINTS) return;
    const minute = newPointMinute(curve);
    if (minute == null) {
      this.notice = { text: t("week.point.no_room"), at: "points" };
      return;
    }
    const value = valueAt(curve, minute) ?? this.fallbackValue();
    this.changeCurve(group, (c) => {
      c.push([minute, value]);
    });
  }

  private removePoint(group: number, point: number): void {
    if (point === 0) return;
    this.changeCurve(group, (c) => {
      c.splice(point, 1);
    });
  }

  private copyTo(group: number, target: string, label: string): void {
    const t = this.t!;
    const profile = this.profiles?.[this.index];
    if (!profile) return;
    const days =
      target === "all"
        ? [0, 1, 2, 3, 4, 5, 6]
        : target === "weekdays"
          ? [0, 1, 2, 3, 4]
          : target === "weekend"
            ? [5, 6]
            : [Number(target)];
    const targets = profile.split === "each" ? days.filter((d) => d !== group) : days;
    this.change((p) => {
      for (const d of targets) {
        if (p.curves[d]) p.curves[d] = structuredClone(p.curves[group]);
      }
    });
    this.notice = { text: t("week.copied", { days: label }), at: "points" };
  }

  private async create(mode: WeekMode): Promise<void> {
    if (!this.hass) return;
    this.creating = true;
    this.errors = { ...this.errors, [mode]: undefined };
    try {
      const result = await this.hass.callWS<{ profiles: WeekProfile[] }>({
        type: "energy_joe/climate/week/default",
        entity_id: this.entityId,
        mode,
      });
      this.drafts = { ...this.drafts, [mode]: result.profiles };
      this.fitDrafts([mode]);
      this.selected = { ...this.selected, [mode]: 0 };
      this.openToday();
    } catch (err) {
      this.errors = { ...this.errors, [mode]: errorText(err) };
    } finally {
      this.creating = false;
    }
  }

  private isDirty(mode: WeekMode): boolean {
    const draft = this.drafts[mode];
    return !!draft && JSON.stringify(draft) !== JSON.stringify(this.room?.week?.modes?.[mode]);
  }

  private async save(): Promise<void> {
    const t = this.t!;
    // A time still being typed counts (it is taken on leaving the field;
    // the field may not lose focus, e.g. when the window is in the background).
    // What the row said before this press (a field left by pressing has
    // already been checked when the click arrives).
    const shown = this.pressShown !== undefined ? this.pressShown : this.rowError;
    this.pressShown = undefined;
    const active = this.shadowRoot?.activeElement;
    if (active instanceof HTMLInputElement) {
      // A temperature is taken on "change", a time on leaving the field.
      active.dispatchEvent(new Event("change"));
      active.dispatchEvent(new Event("blur"));
    }
    await this.updateComplete;
    // A time just refused (e.g. twice the same): stay open, the row says why.
    if (this.rowError && this.rowError !== (shown ?? undefined)) return;
    const dirty = this.modes.filter((mode) => this.isDirty(mode));
    for (const mode of dirty) {
      const problem = setProblem(this.drafts[mode]!);
      if (problem) {
        this.errors = { ...this.errors, [mode]: t(`week.problem.${problem as "count" | "tags" | "curves" | "points"}`) };
        this.mode = mode;
        return;
      }
    }
    this.saving = true;
    for (const mode of dirty) {
      try {
        await this.hass?.callWS({
          type: "energy_joe/climate/week/set",
          entity_id: this.entityId,
          mode,
          profiles: this.drafts[mode],
        });
      } catch (err) {
        const text = errorText(err);
        this.errors = { ...this.errors, [mode]: text };
        this.mode = mode;
        // Show the profile the server names ("Profil 2: …").
        const named = Number(/\bprofile?\s*(\d)\b/i.exec(text)?.[1]);
        if (named >= 1 && named <= 6) {
          this.selected = { ...this.selected, [mode]: named - 1 };
          this.openToday();
        }
        this.saving = false;
        return;
      }
    }
    this.saving = false;
    this.close();
  }

  private close(): void {
    this.dispatchEvent(new CustomEvent("joe-close", { bubbles: true, composed: true }));
  }
}

function errorText(err: unknown): string {
  return String((err as { message?: string })?.message ?? err);
}

define("joe-week-editor", JoeWeekEditor);
