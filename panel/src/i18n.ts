const de = {
  "tab.overview": "Übersicht",
  "tab.plan": "Plan",
  "tab.history": "Historie",
  "tab.learn": "Lernen",
  "tab.devices": "Geräte",
  "tab.settings": "Einstellungen",
  "nav.label": "Bereiche",

  "mode.simulation": "Simulation",
  "mode.simulation.sub": "Joe schaut nur zu und lernt",
  "mode.live": "Live",
  "mode.live.sub": "Joe steuert selbst",
  "mode.off": "Aus",
  "mode.off.sub": "Joe macht Pause",
  "mode.switch.label": "Betriebsart ändern",

  "step.welcome": "Hallo",
  "step.scan": "Umschauen",
  "step.questions": "Fragen",
  "step.done": "Los",
  "steps.label": "Einrichtung",

  "onb.welcome.title": "Howdy!|Ich bin |Joe.",
  "onb.welcome.lead":
    "Ich schiebe deinen Stromverbrauch in die günstigen Stunden – Hausspeicher, E-Auto, Warmwasser. Und ich lerne jeden Tag dazu, wie dein Haus tickt.",
  "onb.calm": "Erstmal schau ich nur zu. Ich steuere nichts, bis du es sagst.",
  "onb.welcome.go": "Schau dich um",
  "onb.welcome.more": "Was macht Joe genau?",
  "onb.welcome.more.text":
    "Jede Nacht rechne ich aus, wie viel deine Speicher aus dem günstigen Netz brauchen, damit sie bis zur Sonne reichen – nicht mehr und nicht weniger. Tagsüber schaue ich, wie gut ich lag, und lerne daraus.",
  "onb.scan.title": "Ich schau |mich um",
  "onb.scan.lead":
    "Gleich zeige ich dir, was ich in deinem Home Assistant gefunden habe – Speicher, Solaranlage, Tarif und mehr. Du bestätigst nur noch.",
  "onb.scan.energy": "Dein Energie-Dashboard habe ich schon entdeckt:",
  "onb.scan.energy.none":
    "Ein Energie-Dashboard habe ich nicht gefunden. Kein Problem – ich suche auch so nach deinen Geräten.",
  "onb.questions.title": "Ein paar |Fragen",
  "onb.questions.lead":
    "Was ich nicht selbst herausfinde, frage ich dich – mit Antworten zum Antippen und immer mit „Weiß ich nicht“.",
  "onb.done.title": "Alles klar, |Partner.",
  "onb.done.lead":
    "Ich plane ab heute jede Nacht, steuere aber nichts. Nach einer Woche zeige ich dir, was es gebracht hätte.",
  "onb.done.go": "Joe starten",
  "onb.next": "Weiter",
  "onb.back": "Zurück",
  "soon": "Kommt im nächsten Update",

  "energy.grid": "Netz",
  "energy.solar": "PV-Anlagen",
  "energy.battery": "Speicher",
  "energy.devices": "Geräte",

  "overview.night": "Heute Nacht",
  "overview.night.empty.title": "Noch kein |Plan",
  "overview.night.empty.text":
    "Sobald ich deine Speicher und deinen Tarif kenne, rechne ich hier jede Nacht aus, wie viel ich lade – und warum.",
  "overview.sim": "Simulation",
  "overview.sim.empty.title": "Ich schau |erstmal zu",
  "overview.sim.empty.text":
    "Nach der ersten Nacht zeige ich dir hier, was es gebracht hätte, wenn ich gesteuert hätte.",
  "overview.next": "So geht's weiter",
  "overview.next.1.title": "Joe ist eingezogen",
  "overview.next.1.text": "Die Simulation läuft. Ich schalte nichts.",
  "overview.next.2.title": "Geräte bestätigen",
  "overview.next.2.text": "Ich zeige dir, was ich gefunden habe – Speicher, Tarif, Prognose.",
  "overview.next.3.title": "Erste Nacht planen",
  "overview.next.3.text": "Ich rechne aus, wie viel ich geladen hätte.",
  "overview.next.4.title": "Ergebnis ansehen",
  "overview.next.4.text": "Was es gebracht hätte – Tag für Tag.",
  "status.done": "erledigt",
  "plan.title": "Hier |rechne ich",
  "plan.text":
    "Jede Nacht plane ich, wie weit die Speicher geladen werden – mit Kurven für Sonne, Verbrauch und Ladezustand.",
  "history.title": "Jeder Tag |unter der Lupe",
  "history.text":
    "Hier siehst du für jeden Tag, was ich geplant habe und was wirklich passiert ist.",
  "learn.title": "Was ich |lerne",
  "learn.text":
    "Wie gut die Solarprognose bei dir trifft, wie viel ihr bei Kälte verbraucht, wie groß deine Speicher wirklich sind – hier sammle ich es.",
  "devices.title": "Deine |Geräte",
  "devices.text":
    "Speicher, Wallbox und Warmwasser – mit Zustand, Testlauf und dem, was ich mit ihnen vorhabe.",

  "settings.operation": "Betrieb",
  "settings.mode": "Betriebsart",
  "settings.mode.hint": "Simulation plant und lernt, ohne etwas zu schalten.",
  "settings.live.unavailable": "Live kommt, sobald Joe steuern kann.",
  "settings.setup": "Einrichtung",
  "settings.setup.hint": "Den Assistenten noch einmal von vorn durchgehen.",
  "settings.setup.restart": "Neu starten",
  "settings.about": "Über Joe",
  "settings.version": "Version",
  "settings.ha": "Home Assistant",
  "settings.energy": "Energie-Dashboard",
  "settings.energy.none": "nicht eingerichtet",

  "live.title": "Live |schalten?",
  "live.text":
    "Dann steuert Joe deine Speicher und Geräte selbst – mit garantiertem Zurücksetzen am Ende jeder Nacht.",
  "live.unavailable":
    "Noch nicht verfügbar: Steuern lernt Joe gerade. Bis dahin simuliert er.",
  "live.go": "Live schalten",
  "live.pause": "Joe pausieren",
  "live.stay": "In Simulation bleiben",

  "error.title": "Joe antwortet |nicht",
  "error.text":
    "Ich erreiche die Integration nicht. Lade die Seite neu – hilft das nicht, schau unter Einstellungen → System → Protokolle nach.",
  "error.action": "Fehler beim Speichern",
  "loading": "Joe sattelt auf …",
};

type Key = keyof typeof de;

const en: Record<Key, string> = {
  "tab.overview": "Overview",
  "tab.plan": "Plan",
  "tab.history": "History",
  "tab.learn": "Learning",
  "tab.devices": "Devices",
  "tab.settings": "Settings",
  "nav.label": "Sections",

  "mode.simulation": "Simulation",
  "mode.simulation.sub": "Joe only watches and learns",
  "mode.live": "Live",
  "mode.live.sub": "Joe is in control",
  "mode.off": "Off",
  "mode.off.sub": "Joe takes a break",
  "mode.switch.label": "Change operating mode",

  "step.welcome": "Hello",
  "step.scan": "Look around",
  "step.questions": "Questions",
  "step.done": "Go",
  "steps.label": "Setup",

  "onb.welcome.title": "Howdy!|I'm |Joe.",
  "onb.welcome.lead":
    "I move your power use into the cheap hours – home battery, car, hot water. And every day I learn a bit more about how your home ticks.",
  "onb.calm": "For now I just watch. I won't switch anything until you say so.",
  "onb.welcome.go": "Look around",
  "onb.welcome.more": "What does Joe do?",
  "onb.welcome.more.text":
    "Every night I work out how much your batteries need from the cheap grid to last until the sun takes over – no more, no less. During the day I check how well I did and learn from it.",
  "onb.scan.title": "Let me |look around",
  "onb.scan.lead":
    "In a moment I'll show you what I found in your Home Assistant – batteries, solar, tariff and more. You only confirm.",
  "onb.scan.energy": "I already spotted your Energy dashboard:",
  "onb.scan.energy.none":
    "I didn't find an Energy dashboard. No problem – I'll look for your devices anyway.",
  "onb.questions.title": "A few |questions",
  "onb.questions.lead":
    "Whatever I can't find out myself, I'll ask you – with answers to tap and always with “I don't know”.",
  "onb.done.title": "Alright, |partner.",
  "onb.done.lead":
    "From tonight I plan every night but don't switch anything. After a week I'll show you what it would have saved.",
  "onb.done.go": "Start Joe",
  "onb.next": "Next",
  "onb.back": "Back",
  "soon": "Coming in the next update",

  "energy.grid": "grid",
  "energy.solar": "solar",
  "energy.battery": "batteries",
  "energy.devices": "devices",

  "overview.night": "Tonight",
  "overview.night.empty.title": "No plan |yet",
  "overview.night.empty.text":
    "Once I know your batteries and your tariff, I'll work out here every night how much to charge – and why.",
  "overview.sim": "Simulation",
  "overview.sim.empty.title": "Just |watching",
  "overview.sim.empty.text":
    "After the first night I'll show you here what it would have saved if I had been in control.",
  "overview.next": "What happens next",
  "overview.next.1.title": "Joe moved in",
  "overview.next.1.text": "The simulation is running. I don't switch anything.",
  "overview.next.2.title": "Confirm devices",
  "overview.next.2.text": "I show you what I found – batteries, tariff, forecast.",
  "overview.next.3.title": "Plan the first night",
  "overview.next.3.text": "I work out how much I would have charged.",
  "overview.next.4.title": "See the result",
  "overview.next.4.text": "What it would have saved – day by day.",
  "status.done": "done",
  "plan.title": "Where I |do the math",
  "plan.text":
    "Every night I plan how far to charge the batteries – with curves for sun, consumption and state of charge.",
  "history.title": "Every day |up close",
  "history.text": "See for every day what I planned and what really happened.",
  "learn.title": "What I |learn",
  "learn.text":
    "How well the solar forecast fits your home, how much you use when it's cold, how big your batteries really are – I collect it here.",
  "devices.title": "Your |devices",
  "devices.text":
    "Batteries, wallbox and hot water – with status, a test run and what I'm planning with them.",

  "settings.operation": "Operation",
  "settings.mode": "Operating mode",
  "settings.mode.hint": "Simulation plans and learns without switching anything.",
  "settings.live.unavailable": "Live arrives once Joe can control devices.",
  "settings.setup": "Setup",
  "settings.setup.hint": "Go through the assistant again from the start.",
  "settings.setup.restart": "Start over",
  "settings.about": "About Joe",
  "settings.version": "Version",
  "settings.ha": "Home Assistant",
  "settings.energy": "Energy dashboard",
  "settings.energy.none": "not set up",

  "live.title": "Go |live?",
  "live.text":
    "Then Joe controls your batteries and devices himself – with a guaranteed reset at the end of every night.",
  "live.unavailable": "Not available yet: Joe is still learning to control devices. Until then he simulates.",
  "live.go": "Go live",
  "live.pause": "Pause Joe",
  "live.stay": "Stay in simulation",

  "error.title": "Joe isn't |answering",
  "error.text":
    "I can't reach the integration. Reload the page – if that doesn't help, check Settings → System → Logs.",
  "error.action": "Saving failed",
  "loading": "Joe is saddling up …",
};

export type TranslationKey = Key;
export type Translate = (key: Key, vars?: Record<string, string | number>) => string;

export function translator(language: string | undefined): Translate {
  const dict: Record<Key, string> = language?.startsWith("de") ? de : en;
  return (key, vars) =>
    dict[key].replace(/\{(\w+)\}/g, (_, name: string) => String(vars?.[name] ?? ""));
}

/**
 * Splits a title like "Ich bin |Joe." into its parts. The last part is shown
 * in Joe's amber, earlier parts in ink; a part ending in "!" gets its own line.
 */
export function titleParts(title: string): string[] {
  return title.split("|");
}
