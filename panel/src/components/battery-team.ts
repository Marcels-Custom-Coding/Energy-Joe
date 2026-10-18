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

/** One battery's part right now ("BYD lädt", "Venus gesperrt (wartet, bis BYD voll ist)"). */
function part(t: Translate, team: BatteryTeam, id: string): string {
  const entry = team.batteries[id];
  const active = team.active ? (team.batteries[team.active]?.name ?? team.active) : "";
  const vars = { name: entry.name, active };
  if (entry.why === "active") {
    const power = entry.power_w ?? 0;
    const key = power > 50 ? "charging" : power < -50 ? "discharging" : "idle";
    return t(entry.discharge === "blocked" ? "team.part.active_charge_only" : `team.part.active_${key}`, vars);
  }
  return t(`team.part.${entry.why ?? "waits_empty"}`, vars);
}

/** The line under "Mehrere Speicher": who works now and why the others wait, or why Joe does nothing. */
export function teamText(t: Translate, team: BatteryTeam): string {
  if (team.state === "on") {
    const ids = Object.keys(team.batteries).filter((id) => team.batteries[id].charge !== null);
    const order = [team.active ?? "", ...ids.filter((id) => id !== team.active)].filter(Boolean);
    const parts = order.map((id) => part(t, team, id)).join(" · ");
    return t(team.dry ? "team.now.dry" : "team.now", { parts });
  }
  if (team.state === "automation") {
    return t("team.state.automation", { names: team.automations.map((n) => `„${n}“`).join(", ") });
  }
  return t.optional(`team.state.${team.state}`) ?? team.state;
}

/** "Joe tut gerade": only while Joe blocks for real. */
export function teamDoing(t: Translate, team: BatteryTeam | undefined): string | null {
  if (!team || team.state !== "on" || team.dry || !team.active) {
    return null;
  }
  const others = Object.keys(team.batteries)
    .filter((id) => id !== team.active && team.batteries[id].charge !== null)
    .map((id) => team.batteries[id].name);
  return t(team.parallel && Object.values(team.batteries).some((b) => b.why === "parallel") ? "team.doing.parallel" : "team.doing", {
    active: team.batteries[team.active]?.name ?? team.active,
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
  if (guard.automations.length) {
    return t("guard.automation", { names: guard.automations.map((n) => `„${n}“`).join(", ") });
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
