import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import "../../components/day-questions";
import "../../components/steer-tonight";
import {
  batteryTeam,
  groupsPatch,
  guardAlarm,
  guardInside,
  quoted,
  teamSuggest,
  transferGuard,
  unsureNames,
} from "../../components/battery-team";
import { stuckSince, stuckText, stuckTitle } from "../../components/battery-stuck";
import { mergeAnswers, mergeQuestion } from "../../components/car-sources";
import { daySurplus, surplusAbility, surplusConflicts } from "../../components/day-surplus";
import { haOpen, type HaTarget } from "../../components/ha-open";
import { fixed } from "../../components/look-back";
import { SPARRING_ROUTE, sparringCount, sparringPoints } from "../../components/sparring";
import { checkText } from "../../components/texts";
import { tip } from "../../components/tip";
import { allowedCars, carRoute, pointRoute } from "../../cars";
import { isIgnored, saveConfig } from "../../config";
import { define } from "../../define";
import { actionPlace, deviceRoute, findDevice, newFindings, type DeviceEntry, type Group } from "../../device-model";
import { entityName } from "../../entities";
import { laterList, laterOpen, questionHome } from "../../homes";
import type { TipName, Translate } from "../../i18n";
import { capacityBasis, capacityOff } from "../../learned-view";
import { PANEL, format, href, onLink, type Route } from "../../router";
import { shared } from "../../styles/shared";
import type { BatteryRolesItem, Check, ClimateFound, Discovery, HomeAssistant, JoeState, SparringReport } from "../../types";

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
  /** A line under the text ("seit 20:05 Uhr"). */
  when?: string;
  to: Route;
  /** Something to look at in Home Assistant (the lever that holds a battery back): the round arrow button and its tooltip. */
  ha?: { target: HaTarget; tip: TipName };
  /** A quick answer right in the row (e.g. "Ist nachts aus – normal"): a config patch, its label and tooltip. */
  fix?: { label: string; tip: TipName; patch: Record<string, unknown> };
  /** Answers right in the row ("Welches Auto hängt …?": one per car): a command (or a config patch) each, one tooltip for all. */
  choices?: {
    label: string;
    message?: { type: string; [key: string]: unknown };
    patch?: Record<string, unknown>;
    /** What the row says once the answer went through ("neuer Testlauf nötig"). */
    done?: string;
  }[];
  choicesTip?: TipName;
}

/** "Entladegrenze fehlt, Ladeleistung ist „Battery charge power limit“ statt „…“" for a battery whose levers differ from its profile. */
export function rolesDetails(t: Translate, item: BatteryRolesItem, hass: HomeAssistant | undefined): string {
  const name = (entityId: string | null) => (entityId ? (hass ? entityName(hass, entityId) : entityId) : "–");
  const role = (key: string) => t.optional(`role.${key}`) ?? key;
  return [
    ...item.missing.map((key) => t("roles.todo.missing", { role: role(key) })),
    ...item.wrong.map((w) => t("roles.todo.wrong", { role: role(w.role), is: name(w.is), found: name(w.found) })),
  ].join(", ");
}

/** The two answers to a battery whose levers differ from its profile: adopt the profile's, or leave it. */
export function rolesChoices(t: Translate, batteryId: string): NonNullable<TodoItem["choices"]> {
  return [
    {
      label: t("roles.todo.adopt"),
      message: { type: "energy_joe/battery/roles", battery_id: batteryId, action: "adopt" },
      done: t("roles.todo.adopted"),
    },
    { label: t("roles.todo.keep"), message: { type: "energy_joe/battery/roles", battery_id: batteryId, action: "dismiss" } },
  ];
}

/** The patch that marks a solar measurement as "off without sun" (null: not one of them). */
export function sleepsPatch(config: JoeState["config"], entityId: string): Record<string, unknown> | null {
  const solar = config.measurements.solar_power ?? [];
  if (!solar.some((m) => m.entity_id === entityId && !m.sleeps)) {
    return null;
  }
  return { measurements: { solar_power: solar.map((m) => (m.entity_id === entityId ? { ...m, sleeps: true } : m)) } };
}

export interface InboxInputs {
  /** For what the backend does not tell yet (a limit in % while the rule is off). */
  hass?: HomeAssistant;
  climateFound?: ClimateFound;
  discovery?: Discovery;
  checks?: Check[];
  devices?: DeviceEntry[];
  /** Names of the profiles (profile key -> name). */
  profiles?: Record<string, string>;
  /** The second look's newest report while it waits to be read (sparringNews). */
  sparring?: SparringReport;
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

  // --- Settings Joe could not read at the start (a step back to an older version …) ---
  const backup = joe.config_backup;
  if (backup) {
    items.push({
      id: "config_backup",
      hide: [],
      icon: "mdi:backup-restore",
      warn: true,
      title: t("overview.todo.config_backup"),
      text: backup.error
        ? `${t("overview.todo.config_backup.text")} ${t("overview.todo.config_backup.failed", { error: backup.error })}`
        : t("overview.todo.config_backup.text"),
      to: { tab: "settings", section: "maintenance", id: "backup" },
      choices: [
        { label: t("overview.todo.config_backup.restore"), message: { type: "energy_joe/config/backup", action: "restore" } },
        { label: t("overview.todo.config_backup.discard"), message: { type: "energy_joe/config/backup", action: "discard" } },
      ],
      choicesTip: "config_backup",
    });
  }

  // --- Cars: which one is plugged in, are two of them one, and one needed but not plugged in ---
  for (const action of config.actions.filter((a) => a.point)) {
    const status = joe.cars?.points?.[action.id];
    if (!status?.ask) continue;
    items.push({
      id: `which_car:${action.id}`,
      hide: [],
      icon: "mdi:car-question",
      title: t("point.ask", { point: action.name }),
      text: t("point.ask.text"),
      to: pointRoute(action.id),
      choices: [
        ...allowedCars(config, action).map((car) => ({
          label: car.name,
          message: { type: "energy_joe/car/answer", point: action.id, car: car.id },
        })),
        { label: t("point.guest"), message: { type: "energy_joe/car/answer", point: action.id, car: "guest" } },
      ],
      choicesTip: "point_which",
    });
  }
  for (const question of joe.cars?.merge ?? []) {
    const answers = mergeAnswers(question);
    push({
      id: `car_merge:${question.a}|${question.b}`,
      icon: "mdi:call-merge",
      title: mergeQuestion(t, joe, question),
      text: t("car.merge.text"),
      to: carRoute(question.a, "sources"),
      choices: [
        { label: t("car.merge.yes"), message: answers.yes },
        { label: t("car.merge.no"), message: answers.no },
      ],
      choicesTip: "car_merge",
    });
  }
  for (const reminder of joe.cars?.reminders ?? []) {
    push({
      id: `unplugged:${reminder.car}:${joe.plan?.window?.start ?? ""}`,
      icon: "mdi:power-plug-off-outline",
      title: t("car.reminder", { car: reminder.name, km: reminder.km }),
      text: t("car.reminder.text"),
      to: carRoute(reminder.car),
    });
  }

  // --- Hinweise: checks and problems at a device ---
  for (const check of (inputs.checks ?? []).filter(counts)) {
    const place = checkPlace(check);
    const subject = String(check.battery_id ?? check.role ?? check.entity_id ?? "");
    const patch = check.can_sleep ? sleepsPatch(config, String(check.entity_id)) : null;
    warn({
      id: `check:${check.code}:${subject}`,
      title: nameOf(place.group, place.group === "grid" && place.id === "tariff" ? "connection" : place.id, check.battery as string | undefined),
      text: checkText(t, check),
      to: deviceRoute(place),
      fix: patch ? { label: t("solar.sleeps.quick"), tip: "solar_sleeps", patch } : undefined,
    });
  }
  const problem = (code: string) => t.optional(`devices.problem.${code}`) ?? code;
  // Levers saved for a battery that differ from what its profile finds (an older version's
  // assignment): adopt the profile's or leave it – answered here or on the battery's page.
  for (const item of joe.battery_roles ?? []) {
    const profile = inputs.profiles?.[item.profile] ?? item.profile;
    items.push({
      id: `roles:${item.battery_id}`,
      hide: [],
      icon: "mdi:swap-horizontal-variant",
      warn: true,
      title: t("roles.todo.title", { name: item.name, profile }),
      text: t("roles.todo.text", { details: rolesDetails(t, item, inputs.hass) }),
      to: { tab: "devices", section: "battery", id: item.battery_id, sub: "control" },
      choices: rolesChoices(t, item.battery_id),
      choicesTip: "battery_roles",
    });
  }
  // A battery held back by a setting that is not Joe's (the reserve at its
  // level, a block someone else set): he says so and shows the lever, but
  // puts nothing back he did not write – the row goes once the battery works.
  for (const [id, entry] of Object.entries(control?.stuck ?? {})) {
    const battery = config.batteries.find((b) => b.id === id);
    if (!battery) continue;
    items.push({
      id: `stuck:${id}:${entry.reason}`,
      hide: [],
      icon: "mdi:battery-lock",
      warn: true,
      title: stuckTitle(t, battery.name, entry),
      text: stuckText(t, inputs.hass, entry),
      when: stuckSince(t, entry.since),
      to: deviceRoute({ group: "battery", id }),
      ha: { target: { entityId: entry.entity_id, name: entry.name }, tip: "stuck" },
    });
  }
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
  // The size measured from charge and discharge runs is far from the one Joe
  // plans with (the device's or the owner's): he says so and leaves the
  // decision to the owner – the row stays until the two agree.
  for (const battery of config.batteries) {
    const measured = config.learned?.battery_models?.[battery.id]?.measured_kwh;
    const basis = capacityBasis(config, inputs.hass, battery);
    if (measured == null || !basis || !capacityOff(basis.value, measured)) continue;
    const values = { name: battery.name, measured: fixed(t.lang, measured, 1), basis: fixed(t.lang, basis.value, 1) };
    items.push({
      id: `capacity:${battery.id}`,
      hide: [],
      icon: "mdi:battery-alert-variant-outline",
      title: t(basis.own ? "overview.todo.capacity.user" : "overview.todo.capacity.device", values),
      text: t("overview.todo.capacity.text", values),
      to: deviceRoute({ group: "battery", id: battery.id }),
    });
  }
  // The daytime surplus: evcc settings against it, a cap that does not take.
  const surplus = daySurplus(joe);
  const conflicts = surplusConflicts(t, surplus);
  if (conflicts.length) {
    warn({
      id: `surplus:evcc:${(surplus?.conflicts ?? []).map((c) => c.code).join(",")}`,
      title: t("surplus.conflict.title"),
      text: conflicts.join(" "),
      to: { tab: "devices", section: "battery" },
    });
  }
  const device = surplusConflicts(t, surplus, true);
  if (device.length) {
    warn({
      id: `surplus:device:${(surplus?.conflicts ?? []).map((c) => c.code).join(",")}`,
      title: t("surplus.device_conflict.title"),
      text: device.join(" "),
      to: { tab: "devices", section: "battery" },
    });
  }
  // The owner's automations that write to the batteries while Joe steers:
  // they can overwrite what he sets. They are the owner's, Joe only says so.
  const automations = control?.automations ?? [];
  if (automations.length && (joe.mode === "advisory" || joe.mode === "live")) {
    warn({
      id: `automations:${automations.join("|")}`,
      title: t("overview.todo.automations.title"),
      text: t("overview.todo.automations", { names: quoted(automations) }),
      to: { tab: "devices", section: "battery", id: "automations" },
    });
  }
  // Several batteries: still running against each other after the watchdog's stages.
  const team = batteryTeam(joe);
  const teamTo: Route = { tab: "devices", section: "battery", id: "together" };
  const guard = transferGuard(joe);
  const alarm = guardAlarm(t, guard, config);
  if (alarm && guard?.last) {
    warn({
      id: `guard:alarm:${guard.last.since ?? guard.last.at}`,
      title: t("guard.alarm.title"),
      text: alarm,
      to: teamTo,
    });
  }
  const inside = guardInside(t, guard, config);
  if (inside && guard?.last) {
    warn({
      id: `guard:inside:${guard.last.since ?? guard.last.at}`,
      title: t("guard.inside.title"),
      text: inside,
      to: teamTo,
    });
  }
  // Running against each other while "Nacheinander" is off: one tap turns it
  // on (it keeps them apart for good; the watchdog only steps in after).
  const last = guard?.last;
  if (
    team?.state === "together" &&
    last &&
    !last.dry &&
    ["running", "fixed", "hold", "alarm"].includes(last.result) &&
    Date.now() - Date.parse(last.at) < 24 * 3600 * 1000
  ) {
    const day = last.at.slice(0, 10);
    const id = `team:together:${day}`;
    items.push({
      id,
      hide: [id],
      icon: "mdi:battery-sync-outline",
      warn: true,
      title: t("overview.todo.together.title"),
      text: t("overview.todo.together.text", {
        discharging: last.discharging.map((k) => config.batteries.find((b) => b.id === k)?.name ?? k).join(", "),
        charging: last.charging.map((k) => config.batteries.find((b) => b.id === k)?.name ?? k).join(", "),
        time: last.at.slice(11, 16),
      }),
      to: teamTo,
      fix: {
        label: t("overview.todo.together.fix"),
        tip: "team_sequence_on",
        patch: { rules: { battery_team: "sequence" } },
      },
    });
  }
  // Not sure which system regulates a battery: "Welche Speicher werden vom
  // selben System geregelt?" ("Vorschlag passt" keeps Joe's proposal).
  if (team?.group_question) {
    push({
      id: "team:groups",
      icon: "mdi:help-circle-outline",
      title: t("team.groups.question"),
      text: t("team.groups.question.text", { names: unsureNames(config, team) }),
      to: teamTo,
      fix: { label: t("team.groups.confirm"), tip: "team_groups_confirm", patch: groupsPatch(config, team) },
    });
  }
  // "Gestern gingen 3 kWh ins Netz, obwohl die Venus nur 70 % hatte. Soll
  // ich sie künftig früher mitladen lassen?" Ja: Joe uses the lead he
  // learned; Nein: he remembers it and does not ask again.
  const suggest = teamSuggest(t, config, team);
  if (suggest && team?.suggest) {
    items.push({
      id: `team:early:${team.suggest.day}`,
      hide: [],
      icon: "mdi:battery-clock-outline",
      title: suggest.title,
      text: suggest.text,
      to: teamTo,
      choices: [
        { label: t("team.suggest.yes"), patch: { rules: { team_early: true } } },
        { label: t("team.suggest.no"), patch: { rules: { team_early: false } } },
      ],
      choicesTip: "team_early",
    });
  }
  // A limit in % that could take part once Joe knows what 100 % stand for.
  if (config.rules.day_surplus) {
    for (const battery of config.batteries) {
      const state = surplus?.batteries?.[battery.id]?.state;
      const needs = state ? state === "need_ref" : surplusAbility(inputs.hass, battery) === "need_ref";
      if (needs && battery.day_surplus !== false && battery.adapter !== "none") {
        push({
          id: `limit_ref:${battery.id}`,
          icon: "mdi:percent-outline",
          title: t("overview.todo.limit_ref", { name: battery.name }),
          text: t("overview.todo.limit_ref.text"),
          to: deviceRoute({ group: "battery", id: battery.id }),
        });
      }
    }
  }
  for (const [id, entry] of Object.entries(surplus?.batteries ?? {})) {
    if (entry.problem) {
      warn({
        id: `problem:surplus:${id}:${entry.problem}`,
        title: entry.name,
        text: `${t("surplus.problem")} ${problem(entry.problem)}`,
        to: deviceRoute({ group: "battery", id }),
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
  const cars = devices.filter((d) => d.group === "car" && ((d.car && !d.car.need.enabled) || d.setup));
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

  // --- Zweiter Blick: a new report; it goes once the section in Rückblick has been on screen ---
  const report = inputs.sparring;
  if (report) {
    items.push({
      id: `sparring:${report.at}`,
      hide: [],
      icon: "mdi:eye-check-outline",
      title: t("sparring.todo", { points: sparringPoints(t, sparringCount(report)) }),
      text: report.summary || t("sparring.todo.text"),
      to: SPARRING_ROUTE,
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
  /** Rows whose quick answer is being saved. */
  @state() private fixing = new Set<string>();
  /** Rows just hidden, until the config comes back without them. */
  @state() private dismissed = new Set<string>();
  /** What the last answer left to say ("neuer Testlauf nötig"), for a while. */
  @state() private notice = "";
  /** The ids hidden in this view, so a quick second tap keeps the first one. */
  private hiding: string[] = [];
  private noticeTimer?: number;

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
      .todo-text small.when {
        color: var(--joe-muted);
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
      .todo-actions.choices {
        flex-wrap: wrap;
        margin-left: 46px;
        padding-bottom: 4px;
      }
      .note.after {
        margin-top: 10px;
      }
    `,
  ];

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.noticeTimer !== undefined) {
      clearTimeout(this.noticeTimer);
    }
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    // An answered car question that is gone may come back with the next plug-in: show it again then.
    if (changed.has("items")) {
      const open = new Set(this.items.map((item) => item.id));
      const kept = [...this.dismissed].filter((id) => !/^(which_car|car_merge):/.test(id) || open.has(id));
      if (kept.length !== this.dismissed.size) this.dismissed = new Set(kept);
    }
  }

  protected render() {
    const t = this.t;
    const joe = this.state;
    if (!t || !joe) {
      return nothing;
    }
    const questions = joe.questions ?? [];
    const items = this.items.filter((item) => !this.dismissed.has(item.id));
    if (!items.length && !questions.length && !this.steer && !this.notice) {
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
      ${this.notice
        ? html`<div class="note after" role="status"><ha-icon icon="mdi:information-outline"></ha-icon><span>${this.notice}</span></div>`
        : nothing}
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
          ${item.when ? html`<small class="when">${item.when}</small>` : nothing}
        </span>
        <ha-icon class="go" icon="mdi:chevron-right"></ha-icon>
      </a>
      ${item.ha
        ? html`<span class="todo-actions" data-tipped>${haOpen(t, item.ha.target)}${tip(t, item.ha.tip)}</span>`
        : nothing}
      ${item.choices?.length
        ? html`<span class="todo-actions choices" data-tipped role="group" aria-label=${item.title}>
            ${item.choices.map(
              (choice) => html`<button
                type="button"
                class="mini-btn"
                ?disabled=${this.fixing.has(item.id)}
                @click=${() => this.choose(item, choice)}
              >
                ${choice.label}
              </button>`,
            )}
            ${item.choicesTip ? tip(t, item.choicesTip) : nothing}
          </span>`
        : nothing}
      ${item.fix
        ? html`<span class="todo-actions" data-tipped>
            <button type="button" class="mini-btn" ?disabled=${this.fixing.has(item.id)} @click=${() => this.applyFix(item)}>
              ${item.fix.label}
            </button>
            ${tip(t, item.fix.tip)}
          </span>`
        : nothing}
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

  /** An answer right in the row (a command): the row goes once the backend has it. */
  private async choose(item: TodoItem, choice: NonNullable<TodoItem["choices"]>[number]): Promise<void> {
    this.fixing = new Set([...this.fixing, item.id]);
    let ok = true;
    if (choice.patch) {
      ok = await saveConfig(this, choice.patch);
    } else if (choice.message) {
      try {
        await this.hass?.callWS(choice.message);
      } catch {
        ok = false;
      }
    }
    const rest = new Set(this.fixing);
    rest.delete(item.id);
    this.fixing = rest;
    if (ok) {
      this.dismissed = new Set([...this.dismissed, item.id]);
      if (choice.done) {
        this.notice = choice.done;
        if (this.noticeTimer !== undefined) clearTimeout(this.noticeTimer);
        this.noticeTimer = window.setTimeout(() => {
          this.notice = "";
        }, 12000);
      }
    }
  }

  /** A quick answer in the row: saved, and the row goes once the check is gone. */
  private async applyFix(item: TodoItem): Promise<void> {
    if (!item.fix) {
      return;
    }
    this.fixing = new Set([...this.fixing, item.id]);
    const saved = await saveConfig(this, item.fix.patch);
    const rest = new Set(this.fixing);
    rest.delete(item.id);
    this.fixing = rest;
    if (saved) {
      this.dismissed = new Set([...this.dismissed, item.id]);
    }
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
