import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import "../../components/day-questions";
import "../../components/steer-tonight";
import { checkText } from "../../components/texts";
import { tip } from "../../components/tip";
import { isIgnored, saveConfig } from "../../config";
import { define } from "../../define";
import { actionPlace, deviceRoute, findDevice, newFindings, type DeviceEntry, type Group } from "../../device-model";
import { laterList, laterOpen, questionHome } from "../../homes";
import type { Translate } from "../../i18n";
import { PANEL, format, href, onLink, type Route } from "../../router";
import { shared } from "../../styles/shared";
import type { Check, ClimateFound, Discovery, HomeAssistant, JoeState } from "../../types";

/**
 * One thing Joe needs from the user: a check, a problem, something not set up
 * yet ("Noch offen") or devices found. The row leads to where it is fixed.
 * Only what is not set up yet or new has "Brauch ich nicht", which hides it
 * for good (answers.ignored "todo:<id>"); a check or problem stays until it
 * is gone.
 */
export interface TodoItem {
  /** Stable id of the row. */
  id: string;
  /** What "Brauch ich nicht" stores ("todo:<id>" each): the row's id, or each member of a row about several devices; empty for checks and problems (no "Brauch ich nicht"). */
  hide: string[];
  icon: string;
  /** Something wrong (red icon) instead of something to do. */
  warn?: boolean;
  title: string;
  text?: string;
  to: Route;
}

export interface InboxInputs {
  climateFound?: ClimateFound;
  discovery?: Discovery;
  checks?: Check[];
  devices?: DeviceEntry[];
}

/** The key in answers.ignored that hides a row. */
export function todoKey(id: string): string {
  return `todo:${id}`;
}

/** Checks worth a row: warnings, an unknown tariff and a missing grid meter (the same as the devices' red dots). */
function counts(check: Check): boolean {
  return check.level === "warn" || check.code === "tariff_unknown" || (check.code === "missing" && check.role === "grid_power");
}

/** Where a check is fixed: the battery's page or the part of Netz & Sonne. */
function checkPlace(check: Check): { group: Group; id: string } {
  if (typeof check.battery_id === "string") {
    return { group: "battery", id: check.battery_id };
  }
  if (check.code === "tariff_unknown") {
    return { group: "grid", id: "tariff" };
  }
  if (check.role === "home_power" || check.code === "home_negative") {
    return { group: "grid", id: "home" };
  }
  if (check.role === "solar_power") {
    return { group: "grid", id: "solar" };
  }
  return { group: "grid", id: "connection" };
}

/** Everything open, most urgent first; rows the user does not need are left out. */
export function inboxItems(t: Translate, joe: JoeState, inputs: InboxInputs = {}): TodoItem[] {
  const config = joe.config;
  const control = joe.control;
  const devices = inputs.devices ?? [];
  const nameOf = (group: Group, id: string, fallback?: string) =>
    findDevice(devices, group, id)?.name ?? fallback ?? (group === "grid" ? t("devices.grid.connection") : id);
  const open = (id: string) => !isIgnored(config, todoKey(id));
  const items: TodoItem[] = [];
  const push = (item: Omit<TodoItem, "hide">) => {
    if (open(item.id)) items.push({ ...item, hide: [item.id] });
  };
  /** A check or problem: shown while it lasts, never hidden by an answer. */
  const warn = (item: Omit<TodoItem, "hide" | "warn" | "icon">) => {
    items.push({ ...item, icon: "mdi:alert-outline", warn: true, hide: [] });
  };
  /** Several devices with the same thing open: one row to their group (naming only those still open), each hidden on its own. */
  const grouped = (
    members: { id: string; name: string; one: Omit<TodoItem, "hide" | "id"> }[],
    many: (names: string) => Omit<TodoItem, "hide" | "id">,
    key: string,
  ) => {
    const rest = members.filter((m) => open(m.id));
    if (rest.length === 1) {
      items.push({ ...rest[0].one, id: rest[0].id, hide: [rest[0].id] });
    } else if (rest.length > 1) {
      const names = rest.map((m) => m.name).join(", ");
      items.push({ ...many(names), id: `${key}:${rest.map((m) => m.id).join(",")}`, hide: rest.map((m) => m.id) });
    }
  };

  // --- Hinweise: checks and problems at a device ---
  for (const check of (inputs.checks ?? []).filter(counts)) {
    const place = checkPlace(check);
    const subject = String(check.battery_id ?? check.role ?? check.entity_id ?? "");
    warn({
      id: `check:${check.code}:${subject}`,
      title: nameOf(place.group, place.group === "grid" && place.id === "tariff" ? "connection" : place.id, check.battery as string | undefined),
      text: checkText(t, check),
      to: deviceRoute(place),
    });
  }
  const problem = (code: string) => t.optional(`devices.problem.${code}`) ?? code;
  for (const battery of config.batteries.filter((b) => b.adapter !== "none")) {
    const code = control?.batteries[battery.id]?.problem ?? (control?.ready[battery.id] === "controls_missing" ? "controls_missing" : null);
    if (code) {
      warn({
        id: `problem:battery:${battery.id}:${code}`,
        title: battery.name,
        text: problem(code),
        to: deviceRoute({ group: "battery", id: battery.id }),
      });
    }
  }
  for (const action of config.actions) {
    const code = control?.actions?.[action.id]?.problem;
    if (code) {
      const place = actionPlace(config, action);
      warn({
        id: `problem:${place.group}:${action.id}:${code}`,
        title: nameOf(place.group, place.id, action.name),
        text: problem(code),
        to: deviceRoute(place),
      });
    }
  }
  const rooms = config.climate?.enabled ? (config.climate.rooms ?? {}) : {};
  for (const [entity, room] of Object.entries(rooms)) {
    const error = room.enabled ? joe.climate?.rooms[entity]?.error : null;
    if (error) {
      warn({
        id: `problem:climate:${entity}:${error}`,
        title: nameOf("climate", entity, entity),
        text: t.optional(`week.error.${error}`) ?? t("week.error", { error }),
        to: deviceRoute({ group: "climate", id: entity }),
      });
    }
  }

  // --- Noch offen: what is not set up yet ---
  const untested = config.batteries.filter(
    (b) => b.adapter !== "none" && ["not_tested", "outdated"].includes(control?.ready[b.id] ?? ""),
  );
  grouped(
    untested.map((battery) => ({
      id: `test:${battery.id}`,
      name: battery.name,
      one: {
        icon: "mdi:test-tube",
        title: t("overview.todo.test", { name: battery.name }),
        text: t(control?.ready[battery.id] === "outdated" ? "overview.todo.test.outdated" : "overview.todo.test.text"),
        to: deviceRoute({ group: "battery", id: battery.id }),
      },
    })),
    (names) => ({
      icon: "mdi:test-tube",
      title: t("overview.todo.test_many", { names }),
      text: t("overview.todo.test_many.text"),
      to: { tab: "devices", section: "battery" },
    }),
    "test",
  );
  if (!config.notify?.service) {
    push({
      id: "notify",
      icon: "mdi:bell-outline",
      title: t("overview.todo.notify"),
      text: t("overview.todo.notify.text"),
      to: { tab: "settings", section: "notify" },
    });
  }
  const climateDevices = inputs.climateFound?.devices.length ?? 0;
  const climateSet = Boolean(config.climate?.enabled && Object.values(config.climate.rooms ?? {}).some((r) => r.enabled));
  if (climateDevices && !climateSet) {
    push({
      id: "climate",
      icon: "mdi:thermostat",
      title: t("overview.todo.climate"),
      text: t("overview.todo.climate.text"),
      to: { tab: "devices", section: "climate" },
    });
  }
  // Cars that charge without knowing the need, and wallbox meters with no charging set up at all: two rows.
  const cars = devices.filter((d) => d.group === "car" && !d.action?.need?.enabled);
  for (const [setup, key] of [
    [false, "car"],
    [true, "car_setup"],
  ] as const) {
    const these = cars.filter((car) => Boolean(car.setup) === setup);
    grouped(
      these.map((car) => ({
        id: `car:${car.id}`,
        name: car.name,
        one: {
          icon: "mdi:car-electric",
          title: t(setup ? "overview.todo.car.setup" : "overview.todo.car", { name: car.name }),
          text: t("overview.todo.car.text"),
          to: deviceRoute(car),
        },
      })),
      (names) => ({
        icon: "mdi:car-electric",
        title: t(setup ? "overview.todo.car_setup_many" : "overview.todo.car_many", { names }),
        text: t("overview.todo.car.text"),
        to: { tab: "devices", section: "car" },
      }),
      key,
    );
  }

  // Questions of the setup put off with "Später", each to its home, until answered
  // (left out where a row above already leads to the same place).
  const leads = new Set(items.map((item) => format(item.to)));
  for (const question of laterList(config).filter((id) => laterOpen(config, id))) {
    const home = questionHome(t, question);
    if (leads.has(format(home.to))) {
      continue;
    }
    leads.add(format(home.to));
    const battery = question.startsWith("capacity:")
      ? config.batteries.find((b) => `capacity:${b.id}` === question)
      : undefined;
    push({
      id: `later:${question}`,
      icon: "mdi:clock-outline",
      title: t("overview.todo.later", {
        topic: battery?.name ?? t.optional(`ask.topic.${question}`) ?? question,
      }),
      text: t("overview.todo.later.text", { place: home.place }),
      to: home.to,
    });
  }

  // --- Neu gefunden ---
  const found = newFindings(config, inputs.discovery).filter((f) => open(`new:${f.key}`));
  if (found.length) {
    items.push({
      id: `new:${found.map((f) => f.key).join(",")}`,
      hide: found.map((f) => `new:${f.key}`),
      icon: "mdi:new-box",
      title: t("overview.todo.new", { names: found.map((f) => f.name).join(", ") }),
      text: t("overview.todo.new.text"),
      to: { tab: "devices", section: "all" },
    });
  }
  return items;
}

/** Rows shown before "N weitere zeigen". */
const SHOWN = 3;

/**
 * "Joe braucht dich": tonight's yes/no in Vorschlagen first, then every open
 * row with its jump (checks and problems first, the first three shown), and
 * the day questions behind one row (their home is the day in Rückblick ›
 * Tage). Only shown when something is open.
 */
export class JoeOverviewInbox extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) t?: Translate;
  @property({ attribute: false }) state?: JoeState;
  @property({ attribute: false }) prefix = PANEL;
  @property({ attribute: false }) items: TodoItem[] = [];
  /** Ask "Darf ich heute Nacht steuern?" as the first row (steerAsks). */
  @property({ type: Boolean }) steer = false;

  /** All rows shown, not only the first three. */
  @state() private all = false;
  /** The day questions opened. */
  @state() private asking = false;
  /** Rows just hidden, until the config comes back without them. */
  @state() private dismissed = new Set<string>();
  /** The ids hidden in this view, so a quick second tap keeps the first one. */
  private hiding: string[] = [];

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
        flex-wrap: wrap;
      }
      .head .eyebrow {
        flex: 1;
        min-width: 0;
      }
      joe-day-questions {
        margin-top: 6px;
        padding: 8px 0 4px;
      }
      li.steer {
        flex-wrap: nowrap;
        align-items: flex-start;
        gap: 12px;
        padding: 12px 8px 12px 6px;
      }
      li.steer .todo-icon {
        flex: none;
      }
      li.steer joe-steer-tonight {
        flex: 1;
        min-width: 0;
        padding-top: 6px;
      }
      button.todo-main {
        width: 100%;
        border: 0;
        background: transparent;
        font: inherit;
        text-align: left;
        cursor: pointer;
      }
      .ask .todo-icon {
        background: var(--joe-surface-2);
        color: var(--joe-ink-2);
      }
      .more-row {
        display: flex;
        padding-top: 6px;
        border-top: 1px solid var(--joe-line);
      }
      ul {
        list-style: none;
        margin: 10px 0 0;
        padding: 0;
      }
      li {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 4px 8px;
        padding: 6px 0;
        border-top: 1px solid var(--joe-line);
      }
      li:first-child {
        border-top: 0;
      }
      .todo-main {
        flex: 1 1 260px;
        min-width: 0;
        min-height: 44px;
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        gap: 2px 12px;
        padding: 8px 8px 8px 6px;
        border-radius: 10px;
        color: inherit;
        text-decoration: none;
        transition: background 0.12s;
      }
      .todo-main:hover {
        background: var(--joe-surface-2);
      }
      .todo-icon {
        display: grid;
        place-items: center;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: var(--joe-amber-soft);
        color: var(--joe-amber-text);
      }
      li.warn .todo-icon {
        background: var(--joe-crit-soft);
        color: var(--joe-crit);
      }
      .todo-text {
        display: grid;
        gap: 2px;
        min-width: 0;
      }
      .todo-text b {
        font-weight: 700;
        overflow-wrap: anywhere;
      }
      .todo-text small {
        font-size: 13.5px;
        color: var(--joe-ink-2);
        line-height: 1.4;
      }
      .go {
        color: var(--joe-muted);
      }
      .todo-actions {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-left: auto;
      }
    `,
  ];

  protected render() {
    const t = this.t;
    const joe = this.state;
    if (!t || !joe) {
      return nothing;
    }
    const questions = joe.questions ?? [];
    const items = this.items.filter((item) => !this.dismissed.has(item.id));
    if (!items.length && !questions.length && !this.steer) {
      return nothing;
    }
    const shown = this.all ? items : items.slice(0, SHOWN);
    const hidden = items.length - shown.length;
    const untestedRow = items.some((item) => item.id.startsWith("test:"));
    return html`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:bell-ring-outline"></ha-icon>${t("overview.inbox")}</div>
        <span class="chip warn">${t("overview.inbox.count", { count: items.length + questions.length + (this.steer ? 1 : 0) })}</span>
        ${tip(t, "inbox")}
      </div>
      <ul>
        ${this.steer
          ? html`<li class="steer">
              <span class="todo-icon"><ha-icon icon="mdi:weather-night"></ha-icon></span>
              <joe-steer-tonight
                compact
                .hideUntested=${untestedRow}
                .t=${t}
                .hass=${this.hass}
                .state=${joe}
                .prefix=${this.prefix}
              ></joe-steer-tonight>
            </li>`
          : nothing}
        ${shown.map((item) => this.renderItem(t, item))}
        ${questions.length ? this.renderAsk(t, questions.length) : nothing}
      </ul>
      ${hidden > 0 || (this.all && items.length > SHOWN)
        ? html`<div class="more-row" data-notip>
            <button type="button" class="mini-btn quiet" aria-expanded=${this.all ? "true" : "false"} @click=${() => (this.all = !this.all)}>
              <ha-icon icon=${this.all ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
              ${this.all ? t("overview.inbox.less") : t("overview.inbox.more", { count: hidden })}
            </button>
          </div>`
        : nothing}
      ${questions.length && this.asking
        ? html`<joe-day-questions bare .hass=${this.hass} .t=${t} .questions=${questions}></joe-day-questions>`
        : nothing}
    </section>`;
  }

  /** One row: the jump, and "Brauch ich nicht" where the row may be hidden for good. */
  private renderItem(t: Translate, item: TodoItem) {
    return html`<li class=${item.warn ? "warn" : ""}>
      <a class="todo-main" href=${href(this.prefix, item.to)} @click=${onLink(item.to)}>
        <span class="todo-icon"><ha-icon icon=${item.icon}></ha-icon></span>
        <span class="todo-text">
          <b>${item.title}</b>
          ${item.text ? html`<small>${item.text}</small>` : nothing}
        </span>
        <ha-icon class="go" icon="mdi:chevron-right"></ha-icon>
      </a>
      ${item.hide.length
        ? html`<span class="todo-actions" data-tipped>
            <button type="button" class="mini-btn quiet" @click=${() => this.dismiss(item)}>${t("overview.todo.dismiss")}</button>
            ${tip(t, "todo_dismiss")}
          </span>`
        : nothing}
    </li>`;
  }

  /** The day questions behind one row; a tap opens them below the list. */
  private renderAsk(t: Translate, count: number) {
    return html`<li class="ask" data-notip>
      <button type="button" class="todo-main" aria-expanded=${this.asking ? "true" : "false"} @click=${() => (this.asking = !this.asking)}>
        <span class="todo-icon"><ha-icon icon="mdi:chat-question-outline"></ha-icon></span>
        <span class="todo-text">
          <b>${count === 1 ? t("overview.ask.one") : t("overview.ask.many", { count })}</b>
          <small>${t("overview.ask.text")}</small>
        </span>
        <ha-icon class="go" icon=${this.asking ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
      </button>
    </li>`;
  }

  /** "Brauch ich nicht": hidden at once, stored together with the rows hidden meanwhile. */
  private async dismiss(item: TodoItem): Promise<void> {
    const config = this.state?.config;
    if (!config) {
      return;
    }
    this.dismissed = new Set([...this.dismissed, item.id]);
    this.hiding = [...this.hiding, ...item.hide];
    const ignored = [...config.answers.ignored];
    for (const id of this.hiding) {
      if (!ignored.includes(todoKey(id))) ignored.push(todoKey(id));
    }
    const saved = await saveConfig(this, { answers: { ignored } });
    if (!saved) {
      const rest = new Set(this.dismissed);
      rest.delete(item.id);
      this.dismissed = rest;
      this.hiding = this.hiding.filter((id) => !item.hide.includes(id));
    }
  }
}

define("joe-overview-inbox", JoeOverviewInbox);
