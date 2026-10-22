import { formatNumber } from "../entities";
import type { Translate } from "../i18n";
import type { BatteryConfig, BatteryTeam, JoeConfig, JoeState, TransferGuard } from "../types";

// "Mehrere Speicher" (control/executor.py _async_team, control/team.py):
// batteries that regulate themselves to 0 W at the grid meter work one after
// the other; the others are blocked ahead of time. The same words on the
// battery page, the plan, the overview and the inbox.

/** What several batteries do together, when there are at least two. */
export function batteryTeam(joe: JoeState | undefined): BatteryTeam | undefined {
  return (joe?.config.batteries.length ?? 0) >= 2 ? joe?.control?.team : undefined;
}

/** The batteries in the order they charge (or discharge); the ones not named follow. */
export function teamOrder(config: JoeConfig, key: "team_charge_order" | "team_discharge_order"): BatteryConfig[] {
  const named = config.rules[key] ?? [];
  const rank = (b: BatteryConfig) => {
    const index = named.indexOf(b.id);
    return index < 0 ? named.length + config.batteries.indexOf(b) : index;
  };
  return [...config.batteries].sort((a, b) => rank(a) - rank(b));
}

/** Whether a battery counts as regulating itself (as set, else as Joe proposes). */
export function selfRegulating(battery: BatteryConfig, team: BatteryTeam | undefined): boolean {
  return battery.self_regulating ?? team?.batteries[battery.id]?.proposed ?? false;
}

/** The system that regulates a battery ("Wer regelt ihn?"): as set, else as Joe proposes. */
export function groupOf(battery: BatteryConfig, team: BatteryTeam | undefined): string {
  return battery.control_group ?? team?.batteries[battery.id]?.group ?? `own:${battery.id}`;
}

/** The batteries of each group, in the order of the batteries (a group per system). */
export function teamGroups(config: JoeConfig, team: BatteryTeam | undefined, batteries = config.batteries): BatteryConfig[][] {
  const result = new Map<string, BatteryConfig[]>();
  for (const battery of batteries) {
    const key = groupOf(battery, team);
    result.set(key, [...(result.get(key) ?? []), battery]);
  }
  return [...result.values()];
}

/** Batteries that work as one group, in a sentence ("Venus mit Victron lädt"): one subject, the verb stays singular. */
export function together(t: Translate, names: string[]): string {
  if (names.length < 2) return names[0] ?? "";
  return t("team.together", { first: names[0], rest: names.slice(1).join(", ") });
}

/** A group by its batteries' names ("Venus mit Victron"). */
export function groupName(t: Translate, team: BatteryTeam, ids: string[]): string {
  return together(t, ids.map((id) => team.batteries[id]?.name ?? id));
}

/** The batteries of each group Joe coordinates (older backends: one battery each). */
function liveGroups(team: BatteryTeam): string[][] {
  const ids = Object.keys(team.batteries).filter((id) => team.batteries[id].charge !== null);
  const groups = new Map<string, string[]>();
  for (const id of ids) {
    const key = team.batteries[id].group ?? id;
    groups.set(key, [...(groups.get(key) ?? []), id]);
  }
  return [...groups.values()];
}

/** The active group's batteries. */
function activeIds(team: BatteryTeam): string[] {
  return team.active_batteries ?? (team.active ? [team.active] : []);
}

/** One group's part right now ("BYD lädt", "Venus + Victron gesperrt (wartet, bis BYD voll ist)"). */
function part(t: Translate, team: BatteryTeam, ids: string[]): string {
  const entry = team.batteries[ids[0]];
  const active = groupName(t, team, activeIds(team));
  const vars = { name: groupName(t, team, ids), active };
  if (entry.why === "active") {
    const power = ids.reduce((sum, id) => sum + (team.batteries[id]?.power_w ?? 0), 0);
    const key = power > 50 ? "charging" : power < -50 ? "discharging" : "idle";
    if (entry.charge === "blocked") {
      return t("team.part.active_discharge_only", vars);
    }
    return t(entry.discharge === "blocked" ? "team.part.active_charge_only" : `team.part.active_${key}`, vars);
  }
  if (entry.why === "base") {
    return t("team.part.base", { ...vars, w: formatNumber(t.lang, team.base?.w ?? 0, 0) });
  }
  return t(`team.part.${entry.why ?? "waits_empty"}`, vars);
}

/** The batteries that work with the active group now for this reason. */
function withWhy(team: BatteryTeam, why: string): string[] {
  return Object.keys(team.batteries).filter((id) => team.batteries[id].why === why);
}

/** "heute", "gestern" or "am 17.10." for a day of a look back. */
function dayWord(t: Translate, day: string): string {
  const local = (offset: number) => {
    const date = new Date(Date.now() - offset * 86400e3);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };
  if (day === local(0)) return t("team.day.today");
  if (day === local(1)) return t("team.day.yesterday");
  return t("team.day.on", { date: `${day.slice(8, 10)}.${day.slice(5, 7)}.` });
}

/**
 * Why more than one group works right now, in plain words ("Venus lädt mit,
 * weil mittags mehr Sonne kommt, als der BYD aufnehmen kann"), or from when
 * the forecast lets the next one charge along today. Null when one works alone.
 */
export function teamReason(t: Translate, team: BatteryTeam | undefined): string | null {
  const text = reasonNow(t, team);
  return text && team?.dry ? `${text} ${t("team.reason.dry")}` : text;
}

function reasonNow(t: Translate, team: BatteryTeam | undefined): string | null {
  if (!team || team.state !== "on" || !team.active) {
    return null;
  }
  const active = groupName(t, team, activeIds(team));
  const along = withWhy(team, "along");
  if (team.along && along.length) {
    const watts = Object.values(team.along_w ?? {}).reduce((sum, w) => sum + w, 0);
    return t(`team.reason.along.${team.along}`, { active, others: groupName(t, team, along), watts: formatNumber(t.lang, watts, 0) });
  }
  const helps = withWhy(team, "helps");
  if (team.help && helps.length) {
    return t("team.reason.help", { active, others: groupName(t, team, helps) });
  }
  if (team.base?.batteries.length) {
    return t("team.reason.base", { active, others: groupName(t, team, team.base.batteries), w: formatNumber(t.lang, team.base.w, 0) });
  }
  const plan = team.along_plan;
  if (plan && !team.parallel && new Date(plan.until).getTime() > Date.now()) {
    const vars = { active, others: groupName(t, team, plan.batteries), time: plan.from.slice(11, 16) };
    return t(plan.lead_min > 0 ? "team.reason.plan.lead" : "team.reason.plan", { ...vars, lead: plan.lead_min });
  }
  return null;
}

/** The last day looked back on, in one line: what went to the grid while a group had room. */
export function teamReviewText(t: Translate, team: BatteryTeam | undefined): string | null {
  const review = team?.review;
  if (!team || !review) {
    return null;
  }
  const vars = { when: dayWord(t, review.day), kwh: formatNumber(t.lang, review.room_kwh, 1) };
  if (review.room_kwh >= 0.3 && review.short) {
    return t("team.review.room", {
      ...vars,
      name: groupName(t, team, review.short.batteries),
      soc: formatNumber(t.lang, review.short.soc ?? 0, 0),
    });
  }
  if (review.room_kwh >= 0.3) {
    return t("team.review.room_full", vars);
  }
  if (review.along_at || review.planned_at) {
    return t("team.review.fine", vars);
  }
  return null;
}

/** What Joe learned about charging along earlier, for "Selbst einstellen". */
export function teamLearnedText(t: Translate, team: BatteryTeam | undefined): string {
  const learned = team?.learned;
  if (!learned || !learned.days) {
    return t("team.learned.none");
  }
  const minutes = Math.round(learned.minutes);
  return minutes < 5 ? t("team.learned.no_lead", { days: learned.days }) : t("team.learned.lead", { minutes, days: learned.days });
}

/** "Soll ich … künftig früher mitladen lassen?": the question for "Joe braucht dich", while unanswered. */
export function teamSuggest(t: Translate, config: JoeConfig, team: BatteryTeam | undefined): { title: string; text: string } | null {
  const suggest = team?.suggest;
  if (!team || !suggest || config.rules.team_early != null) {
    return null;
  }
  const name = groupName(t, team, suggest.batteries);
  return {
    title: t("team.suggest.title", {
      when: dayWord(t, suggest.day),
      kwh: formatNumber(t.lang, suggest.kwh, 1),
      name,
      soc: formatNumber(t.lang, suggest.soc ?? 0, 0),
    }),
    text: t("team.suggest.text", { name, minutes: suggest.lead_min }),
  };
}

/** The line under "Mehrere Speicher": who works now and why the others wait, or why Joe does nothing. */
export function teamText(t: Translate, team: BatteryTeam): string {
  if (team.state === "on") {
    const groups = liveGroups(team);
    const first = activeIds(team)[0];
    const order = [...groups.filter((g) => g.includes(first)), ...groups.filter((g) => !g.includes(first))];
    const parts = order.map((ids) => part(t, team, ids)).join(" · ");
    return t(team.dry ? "team.now.dry" : "team.now", { parts });
  }
  if (team.state === "bridging") {
    // A value missing for a moment: the blocks stay until the grace is over.
    const why = t.optional(`team.gap.${team.gap?.reason ?? ""}`) ?? t("team.gap.unknown");
    return t("team.state.bridging", { why, time: (team.gap?.until ?? "").slice(11, 16) });
  }
  if (team.state === "not_taken") {
    const ids = Object.keys(team.batteries).filter((id) => team.batteries[id].problem);
    return t("team.state.not_taken", { names: groupName(t, team, ids) });
  }
  return t.optional(`team.state.${team.state}`) ?? team.state;
}

/** The owner's automations that write to the batteries: quoted, in a row ("Joe braucht dich", the log). */
export function quoted(names: string[]): string {
  return names.map((n) => `„${n}“`).join(", ");
}

/** "Joe tut gerade": only while Joe blocks for real. */
export function teamDoing(t: Translate, team: BatteryTeam | undefined): string | null {
  if (!team || team.state !== "on" || team.dry || !team.active) {
    return null;
  }
  const active = activeIds(team);
  const others = liveGroups(team)
    .filter((ids) => !ids.some((id) => active.includes(id)))
    .map((ids) => groupName(t, team, ids));
  const reason = team.along || team.help || team.base ? teamReason(t, team) : null;
  if (reason) {
    return reason;
  }
  return t(team.parallel && Object.values(team.batteries).some((b) => b.why === "parallel") ? "team.doing.parallel" : "team.doing", {
    active: groupName(t, team, active),
    others: others.join(", "),
  });
}

// The watchdog ("Speicher-Wächter", control/guard.py): two batteries running
// against each other, more than 20 W each for 20 s. Joe restarts the culprit's
// own control, blocks its direction for 5 s and speaks up.

/** The watchdog, when there are at least two batteries. */
export function transferGuard(joe: JoeState | undefined): TransferGuard | undefined {
  return (joe?.config.batteries.length ?? 0) >= 2 ? joe?.control?.guard : undefined;
}

function names(config: JoeConfig, ids: string[]): string {
  return ids.map((id) => config.batteries.find((b) => b.id === id)?.name ?? id).join(", ");
}

/** "14:02" today, else "17.10. 14:02". */
function when(at: string): string {
  const day = at.slice(0, 10);
  const today = new Date();
  const local = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const time = at.slice(11, 16);
  return day === local ? time : `${day.slice(8, 10)}.${day.slice(5, 7)}. ${time}`;
}

/** How long it ran: "25 s", "3 min". */
export function guardDuration(t: Translate, seconds: number): string {
  return seconds < 120 ? t("guard.seconds", { n: seconds }) : t("guard.minutes", { n: Math.round(seconds / 60) });
}

/** The line of the watchdog: the last time it stepped in, or why it rests. */
export function guardText(t: Translate, guard: TransferGuard, config: JoeConfig): string {
  if (guard.state !== "on") {
    return t(`guard.state.${guard.state}`);
  }
  const last = guard.last;
  if (!last) {
    return t("guard.watching");
  }
  const vars = {
    time: when(last.at),
    battery: names(config, [last.battery]),
    direction: t(`guard.direction.${last.direction}`),
    duration: guardDuration(t, last.seconds),
  };
  if (last.result === "inside") {
    const inside = t("guard.last.inside", {
      ...vars,
      charging: names(config, last.charging),
      discharging: names(config, last.discharging),
    });
    return last.dry ? `${inside} ${t("guard.dry")}` : inside;
  }
  const stage = Math.min(3, Math.max(1, last.stage));
  const text =
    last.result === "fixed"
      ? t(`guard.last.fixed.${stage as 1 | 2 | 3}`, vars)
      : last.result === "running"
        ? t(`guard.last.running.${stage === 1 ? 1 : 2}`, vars)
        : t(`guard.last.${last.result}`, vars);
  return last.dry && (last.result === "running" || last.result === "alarm" || last.result === "fixed")
    ? `${text} ${t("guard.dry")}`
    : text;
}

/** Still running against each other after every stage (live): words for the warning. */
export function guardAlarm(t: Translate, guard: TransferGuard | undefined, config: JoeConfig): string | null {
  const last = guard?.last;
  if (!guard || guard.state !== "on" || !last || last.result !== "alarm" || last.dry) {
    return null;
  }
  return t("guard.alarm", { charging: names(config, last.charging), discharging: names(config, last.discharging) });
}

/** Batteries of one system charging each other (live, still going): words for "Joe braucht dich". */
export function guardInside(t: Translate, guard: TransferGuard | undefined, config: JoeConfig): string | null {
  const last = guard?.last;
  if (!guard || guard.state !== "on" || !last || last.result !== "inside" || last.dry || last.over) {
    return null;
  }
  return t("guard.inside", { charging: names(config, last.charging), discharging: names(config, last.discharging) });
}

/**
 * "Vorschlag passt": the patch that keeps Joe's proposal for every battery
 * that regulates itself and has no system set yet.
 */
export function groupsPatch(config: JoeConfig, team: BatteryTeam): Record<string, unknown> {
  const batteries: Record<string, { control_group: string }> = {};
  for (const battery of config.batteries) {
    const entry = team.batteries[battery.id];
    if (battery.control_group == null && entry?.self_regulating && entry.group) {
      batteries[battery.id] = { control_group: entry.group };
    }
  }
  return { batteries };
}

/** The batteries Joe is not sure about, by name. */
export function unsureNames(config: JoeConfig, team: BatteryTeam): string {
  return config.batteries
    .filter((b) => b.control_group == null && team.batteries[b.id]?.self_regulating && team.batteries[b.id]?.group_sure === false)
    .map((b) => b.name)
    .join(", ");
}
