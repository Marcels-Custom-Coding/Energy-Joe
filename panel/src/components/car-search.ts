import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { tip } from "./tip";
import { carFinds, carRoute, sourceName, type CarFind } from "../cars";
import { define } from "../define";
import type { Translate } from "../i18n";
import { PANEL, href, navigate, onLink } from "../router";
import { shared } from "../styles/shared";
import type { CarConfig, Discovery, HomeAssistant, JoeState } from "../types";

// "Nochmal nach Autos suchen": every car Home Assistant shows (evcc's
// vehicles, the car makers' integrations), also the ones left out once (a
// deleted car) and the ones that belong to a car already. On the group page
// one becomes a car of its own; on a car's page (Quellen › Quelle hinzufügen)
// one or more join that car (backend: energy_joe/car/attach).

/** Joe looks around again (read-only); the panel keeps the result for every page. */
export async function searchCars(host: HTMLElement, hass: HomeAssistant | undefined): Promise<Discovery | undefined> {
  if (!hass) return undefined;
  const found = await hass.callWS<Discovery>({ type: "energy_joe/discover" });
  host.dispatchEvent(new CustomEvent<Discovery>("joe-discovery", { detail: found, bubbles: true, composed: true }));
  return found;
}

/** Sources join a car (null: a new car). Returns the car's id. */
export async function attachToCar(hass: HomeAssistant, car: string | null, sources: string[]): Promise<string | undefined> {
  const result = await hass.callWS<{ car?: string } | null>({ type: "energy_joe/car/attach", car, sources });
  return result?.car ?? undefined;
}

export class JoeCarSearch extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;
  @property({ attribute: false }) discovery?: Discovery;
  @property({ attribute: false }) prefix = PANEL;
  /** The car sources join (Quellen › Quelle hinzufügen); none: the list on the group page. */
  @property({ attribute: false }) car?: CarConfig;

  @state() private searching = false;
  @state() private searched = false;
  @state() private failed = false;
  @state() private busy = false;
  @state() private found?: Discovery;
  @state() private picked: string[] = [];
  @state() private asking = false;

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      .head {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
      }
      .lead,
      .muted {
        margin: 12px 0 0;
        color: var(--joe-ink-2);
      }
      ul.finds {
        list-style: none;
        margin: 12px 0 0;
        padding: 0;
        display: grid;
        gap: 8px;
      }
      ul.finds li {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px 12px;
        padding: 10px 12px;
        border-radius: 12px;
        background: var(--joe-surface-2);
      }
      .pick {
        flex: 1 1 100%;
        display: grid;
        grid-template-columns: auto minmax(0, 1fr);
        align-items: center;
        gap: 12px;
        min-height: 44px;
        margin: -10px -12px;
        padding: 10px 12px;
        border: 0;
        border-radius: 12px;
        background: transparent;
        color: inherit;
        font: inherit;
        text-align: left;
        cursor: pointer;
      }
      .pick[aria-pressed="true"] {
        background: var(--joe-amber-soft);
      }
      .pick > ha-icon,
      li > ha-icon {
        color: var(--joe-ink-2);
      }
      .pick[aria-pressed="true"] > ha-icon {
        color: var(--joe-amber-ink, var(--joe-ink));
      }
      .what {
        flex: 1 1 160px;
        display: grid;
        gap: 2px;
        min-width: 0;
      }
      .what b {
        font-weight: 700;
        overflow-wrap: anywhere;
      }
      .what small {
        color: var(--joe-ink-2);
        font-size: 13px;
        line-height: 1.4;
      }
      .what small.left-out {
        color: var(--joe-amber-ink, var(--joe-ink));
        font-weight: 600;
      }
      .row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        margin-top: 12px;
      }
      .mini-btn {
        min-height: 44px;
      }
      a.mini-btn {
        text-decoration: none;
      }
      .acts {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-left: auto;
      }
      .ask {
        display: grid;
        gap: 6px;
        margin: 12px 0 0;
        padding: 12px;
        border-radius: 12px;
        background: var(--joe-amber-soft);
      }
      .ask p {
        margin: 0;
      }
      .ask p:first-child {
        font-weight: 600;
      }
      .bad {
        margin: 8px 0 0;
        color: var(--joe-warn, var(--joe-crit));
      }
    `,
  ];

  protected firstUpdated(): void {
    // Adding a source always starts with a fresh look: the integration may be new.
    if (this.car) void this.search();
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has("car") && changed.get("car")?.id !== this.car?.id) {
      this.picked = [];
      this.asking = false;
    }
  }

  protected render() {
    const { t, state: joe } = this;
    if (!t || !joe) {
      return nothing;
    }
    const discovery = this.found ?? this.discovery;
    const finds = carFinds(joe.config, discovery);
    return html`<div class="head" data-tipped>
        <button type="button" class="btn btn-secondary" ?disabled=${this.searching || this.busy} @click=${this.search}>
          <ha-icon icon="mdi:magnify"></ha-icon>${t("car.search")}
        </button>
        ${tip(t, "car_search")}
      </div>
      ${this.searching ? html`<p class="muted" role="status">${t("car.search.busy")}</p>` : nothing}
      ${this.failed ? html`<p class="bad" role="status">${t("car.search.failed")}</p>` : nothing}
      ${this.car ? this.renderAttach(t, this.car, finds) : this.searched && !this.searching ? this.renderAll(t, finds) : nothing}`;
  }

  /** The group page: every car Home Assistant shows, and what it is to Joe. */
  private renderAll(t: Translate, finds: CarFind[]): TemplateResult {
    if (!finds.length) {
      return html`<p class="muted">${t("car.search.none")}</p>`;
    }
    return html`<p class="lead">${t("car.search.lead")}</p>
      <ul class="finds">
        ${finds.map(
          (find) => html`<li data-tipped>
            <ha-icon icon=${find.source.kind === "evcc" ? "mdi:ev-station" : "mdi:car-connected"}></ha-icon>
            ${this.what(t, find)}
            <span class="acts">
              ${find.car
                ? html`<a class="mini-btn" href=${href(this.prefix, carRoute(find.car.id, "sources"))} @click=${onLink(carRoute(find.car.id, "sources"))}
                    >${t("car.find.open")}</a
                  >`
                : html`<button type="button" class="mini-btn go" ?disabled=${this.busy} @click=${() => this.useAsNew(find)}>
                    ${t(find.ignored ? "car.find.reuse" : "car.find.use")}
                  </button>`}
              ${tip(t, "car_search_use")}
            </span>
          </li>`,
        )}
      </ul>`;
  }

  /** Quellen › Quelle hinzufügen: pick one or more, then they join this car. */
  private renderAttach(t: Translate, car: CarConfig, all: CarFind[]): TemplateResult {
    const finds = all.filter((find) => find.car?.id !== car.id);
    const picked = finds.filter((find) => this.picked.includes(find.source.id));
    if (this.asking) {
      return this.renderAsk(t, car, picked);
    }
    return html`<p class="lead">${t("car.attach.lead", { car: car.name })}</p>
      ${finds.length
        ? html`<ul class="finds">
            ${finds.map((find) => {
              const on = this.picked.includes(find.source.id);
              return html`<li>
                <button type="button" class="pick" aria-pressed=${on ? "true" : "false"} ?disabled=${this.busy} @click=${() => this.toggle(find.source.id)}>
                  <ha-icon icon=${on ? "mdi:checkbox-marked-circle" : "mdi:checkbox-blank-circle-outline"}></ha-icon>
                  ${this.what(t, find)}
                </button>
              </li>`;
            })}
          </ul>`
        : this.searching
          ? nothing
          : html`<p class="muted">${t("car.attach.none")}</p>`}
      ${finds.length
        ? html`<div class="row" data-tipped>
            <button type="button" class="mini-btn go" ?disabled=${this.busy || !picked.length} @click=${() => this.attach(car, picked)}>
              <ha-icon icon="mdi:link-variant-plus"></ha-icon>${t("car.attach.do", { car: car.name })}
            </button>
            ${tip(t, "car_attach")}
          </div>`
        : nothing}`;
  }

  /** Some belong to another car: Joe says what moves before it does. */
  private renderAsk(t: Translate, car: CarConfig, picked: CarFind[]): TemplateResult {
    const moving = picked.filter((find) => find.car);
    const emptied = [...new Set(moving.map((find) => find.car!))].filter((other) => other.sources.every((s) => picked.some((find) => find.source.id === s.id)));
    return html`<div class="ask" role="alert" data-tipped>
      ${moving.map(
        (find) =>
          html`<p>${t("car.attach.ask", { name: find.source.name ?? sourceName(t, find.source), from: find.car!.name, car: car.name })}</p>`,
      )}
      ${emptied.map((other) => html`<p>${t("car.attach.empty", { from: other.name })}</p>`)}
      <div class="row">
        <button type="button" class="mini-btn go" ?disabled=${this.busy} @click=${() => this.attach(car, picked, true)}>${t("car.attach.yes")}</button>
        <button type="button" class="mini-btn quiet" ?disabled=${this.busy} @click=${() => (this.asking = false)}>${t("car.attach.no")}</button>
        ${tip(t, "car_attach")}
      </div>
    </div>`;
  }

  private what(t: Translate, find: CarFind): TemplateResult {
    const from = sourceName(t, find.source);
    const status = find.car
      ? t(this.car ? "car.attach.from" : "car.find.of", { car: find.car.name })
      : find.ignored
        ? t("car.find.ignored")
        : t("car.find.new");
    return html`<span class="what">
      <b>${find.source.name ?? from}</b>
      <small>${t("car.source.from", { from })}</small>
      <small class=${find.ignored && !find.car ? "left-out" : ""}>${status}</small>
    </span>`;
  }

  private toggle(id: string): void {
    this.picked = this.picked.includes(id) ? this.picked.filter((p) => p !== id) : [...this.picked, id];
  }

  private async search(): Promise<void> {
    this.searching = true;
    this.failed = false;
    try {
      this.found = (await searchCars(this, this.hass)) ?? this.found;
      this.searched = true;
    } catch {
      this.failed = true;
    }
    this.searching = false;
  }

  /** Joins this car; one that belongs to another car only after the question. */
  private async attach(car: CarConfig, picked: CarFind[], sure = false): Promise<void> {
    if (!this.hass || !picked.length) return;
    if (!sure && picked.some((find) => find.car)) {
      this.asking = true;
      return;
    }
    this.busy = true;
    this.failed = false;
    try {
      await attachToCar(
        this.hass,
        car.id,
        picked.map((find) => find.source.id),
      );
      this.picked = [];
      this.asking = false;
      this.dispatchEvent(new CustomEvent("joe-attached", { bubbles: true, composed: true }));
    } catch {
      this.failed = true;
    }
    this.busy = false;
  }

  /** "Übernehmen" / "Wieder nutzen": a car of its own, then its page. */
  private async useAsNew(find: CarFind): Promise<void> {
    if (!this.hass) return;
    this.busy = true;
    this.failed = false;
    try {
      const id = await attachToCar(this.hass, null, [find.source.id]);
      if (id) navigate(this, carRoute(id));
    } catch {
      this.failed = true;
    }
    this.busy = false;
  }
}

define("joe-car-search", JoeCarSearch);
