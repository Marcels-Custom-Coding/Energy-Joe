import type { Translate } from "../i18n";
import type { BatteryConfig, BatteryTeam, JoeConfig, JoeState } from "../types";

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

/** Two batteries ran against each other while Joe blocked for real: words for the warning. */
export function teamTransfer(t: Translate, team: BatteryTeam | undefined): string | null {
  const transfer = team?.transfer;
  if (!transfer) {
    return null;
  }
  return t(transfer.despite ? "team.transfer.despite" : "team.transfer.seen", {
    charging: transfer.charging.join(", "),
    discharging: transfer.discharging.join(", "),
  });
}
