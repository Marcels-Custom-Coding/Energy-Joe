"""Joe's configuration: what he knows about the home, with the origin of each value.

The configuration is stored as plain data and validated with voluptuous. Every
change records where a value came from ("read" from Home Assistant, "learned"
by Joe, a "default", or set by the "user"), so the panel can explain it.

Provenance is kept per path: "tariff.kind", "measurements.grid_power" or, for
lists of items with an id, "batteries[<id>].capacity_kwh". What the user set or
Joe learned is never overwritten by what Joe reads from Home Assistant.

Keys Joe does not know are kept as they are (extra=vol.ALLOW_EXTRA): what a
newer version stored survives a step back to an older one and is there again
after the next update, instead of the whole configuration being rejected.
"""

from __future__ import annotations

from copy import deepcopy
from datetime import UTC, datetime
import re
from typing import Any

import voluptuous as vol

from homeassistant.helpers import config_validation as cv

from .control import week
from .control.profiles import ADAPTERS, MODE_OPTIONS, OPERATIONS, ROLES

CONFIG_VERSION = 7

SOURCES = ("read", "learned", "default", "user")
TARIFF_KINDS = ("fixed_window", "dynamic", "flat", "unknown")
CONSUMER_KINDS = (
    "climate",
    "heat_pump",
    "hot_water",
    "electric_heating",
    "ev",
    "comfort",
    "household",
    "submeter",
    "other",
)
# When a device with its own meter runs. "auto": Joe decides (a wallbox never
# draws on the home battery, everything else counts as needed when it is used).
CONSUMER_RUNS = ("auto", "always", "surplus", "cheap")
DISCHARGE_MODES = ("until_target", "block", "free")
PRIORITY_ITEMS = ("ev", "hot_water", "battery")

ACTION_KINDS = ("switch", "target")
DAY_LABELS = ("home_office", "office", "travel", "vacation", "guests", "home")
CONDITION_OPS = ("eq", "ne", "lt", "le", "gt", "ge")

# Lists whose items have an "id"; a patch may address single items by id.
KEYED_LISTS = ("batteries", "persons", "consumers", "actions", "cars")
# Values that are replaced as a whole instead of merged key by key.
REPLACED = frozenset(
    {
        "grid_power",
        "home_power",
        "power",
        "controls",
        "mode_options",
        "window",
        "steps",
        "prepare",
        # What Joe learned is replaced as a whole on every pass.
        "consumption_model",
        "group_models",
        "presence",
        "solar_classes",
        "sources",
        "battery_models",
        "action_models",
        "car_models",
        "solar_spread",
        "home_spread",
        "replay",
        "reset",
        "alternatives",
        # Weekly profiles per mode and the ticks on a thermostat's own profiles.
        "modes",
        "device_profiles",
    }
)
# Origins that Joe's own reading never overwrites.
PROTECTED_SOURCES = ("user", "learned")
# Answer keys that list things the user told Joe to leave out or accepted as they are.
IGNORED = "ignored"
CONFIRMED = "confirmed"

_TIME = re.compile(r"^([01]\d|2[0-3]):[0-5]\d$")


def _time(value: Any) -> str:
    """Validate a time of day as HH:MM."""
    if not isinstance(value, str) or not _TIME.match(value):
        raise vol.Invalid("expected time as HH:MM")
    return value


_ENTITY = vol.Any(None, cv.entity_id)


def _strict(mapping: dict[Any, Any]) -> vol.Schema:
    """A map whose keys are checked (roles, modes, entities): inside a schema
    that keeps unknown keys, a wrong key is still an error."""
    return vol.Schema(mapping, extra=vol.PREVENT_EXTRA)


_PRICE = vol.Any(None, vol.All(vol.Coerce(float), vol.Range(min=0, max=10)))
_POSITIVE = vol.Any(
    None, vol.All(vol.Coerce(float), vol.Range(min=0, min_included=False))
)
_PERCENT = vol.All(vol.Coerce(float), vol.Range(min=0, max=100))

# A power reading in Joe's convention. "minus_entity_id" covers setups with two
# positive sensors (e.g. import and export): value = entity - minus_entity.
MEASUREMENT = vol.Schema(
    {
        vol.Required("entity_id"): cv.entity_id,
        vol.Optional("invert", default=False): bool,
        vol.Optional("minus_entity_id", default=None): _ENTITY,
    },
    extra=vol.ALLOW_EXTRA,
)
# A solar reading: "sleeps" when the inverter switches off without sun (its
# entity is unavailable then, which is normal and counts as 0 W at night).
SOLAR_MEASUREMENT = MEASUREMENT.extend({vol.Optional("sleeps", default=False): bool})

# One step of a battery Joe steers through entities the user assigned: an entity
# and its value; "{floor}", "{target}", "{power}", "{power_neg}", "{percent}",
# "{minutes}", "{seconds}" and "{device}" stand for the values of the moment.
# A step is an entity with a value, or a service call with data.
_STEP_ENTITY = vol.Schema(
    {
        vol.Required("entity_id"): cv.entity_id,
        vol.Optional("value", default=None): vol.Any(None, str, int, float, bool),
    }
)
_STEP_SERVICE = vol.Schema(
    {
        vol.Required("service"): vol.Match(r"^[a-z0-9_]+\.[a-z0-9_]+$"),
        vol.Optional("data", default=dict): dict,
    }
)
STEP = vol.Any(_STEP_ENTITY, _STEP_SERVICE)
# Own steps per operation (see control/operations.py): the night's (charge,
# hold, release) and the day's (block, block_charge, block_discharge, cap).
STEPS = vol.Schema({vol.Optional(name): [STEP] for name in OPERATIONS})

# An inverter Joe steers over Modbus TCP himself (adapter "fronius_modbus",
# see modbus.py): its address, port and unit id.
MODBUS = vol.Schema(
    {
        vol.Required("host"): vol.All(str, vol.Length(min=1, max=253)),
        vol.Optional("port", default=502): vol.All(int, vol.Range(min=1, max=65535)),
        vol.Optional("unit", default=1): vol.All(int, vol.Range(min=0, max=255)),
    },
    extra=vol.ALLOW_EXTRA,
)

BATTERY = vol.Schema(
    {
        vol.Required("id"): str,
        vol.Required("name"): str,
        vol.Required("adapter"): vol.In(ADAPTERS),
        vol.Required("soc_entity"): cv.entity_id,
        vol.Optional("power", default=None): vol.Any(None, MEASUREMENT),
        vol.Optional("capacity_kwh", default=None): _POSITIVE,
        vol.Optional("capacity_entity", default=None): _ENTITY,
        vol.Optional("max_charge_w", default=None): _POSITIVE,
        vol.Optional("max_discharge_w", default=None): _POSITIVE,
        # The level it never discharges below; None: as set on the device.
        vol.Optional("floor_soc", default=None): vol.Any(None, _PERCENT),
        vol.Optional("device_id", default=None): vol.Any(None, str),
        # Levers by role (see control/profiles.py) and the mode select's options.
        vol.Optional("controls", default=dict): _strict({vol.In(ROLES): cv.entity_id}),
        vol.Optional("mode_options", default=dict): _strict(
            {vol.In(MODE_OPTIONS): str}
        ),
        # Entities set before steering through the mode (e.g. "Remote Control").
        vol.Optional("prepare", default=list): [_STEP_ENTITY],
        vol.Optional("steps", default=dict): STEPS,
        vol.Optional("priority", default=1): vol.All(int, vol.Range(min=1, max=9)),
        # Takes part when Joe leaves daytime surplus to evcc (rules.day_surplus).
        vol.Optional("day_surplus", default=True): bool,
        # What 100 % of a charge limit in % stand for (W): Fronius counts its %
        # of the inverter's highest battery charging power, which Home
        # Assistant does not show. None: not known (yet), Joe may learn it.
        vol.Optional("limit_ref_w", default=None): vol.Any(
            None, vol.All(vol.Coerce(float), vol.Range(min=100, max=100000))
        ),
        vol.Optional("modbus", default=None): vol.Any(None, MODBUS),
        # Regulates itself to 0 W at the grid meter (Fronius, Omnibattery in
        # automatic mode): with others of its kind it needs coordinating
        # (rules.battery_team). None: as Joe proposes from its profile.
        vol.Optional("self_regulating", default=None): vol.Any(None, bool),
        # Which system regulates it ("Wer regelt ihn?"): batteries with the
        # same key are regulated by one system (Omnibattery shares the power
        # among all its batteries) and take turns with the others as one.
        # None: as Joe proposes (batteries set up before are assigned so,
        # see executor._proposed_group).
        vol.Optional("control_group", default=None): vol.Any(
            None, vol.All(str, vol.Length(min=1, max=120))
        ),
        # Whether its charge limit holds as a ceiling while it charges from the
        # grid (Fronius: the night's power): None not seen yet, "works", or
        # "ignored" (Joe then plans its night at full power). Learned.
        vol.Optional("night_cap", default=None): vol.Any(
            None, vol.In(("works", "ignored"))
        ),
        # The level at which it really stops discharging (a BYD at ~10.5 %
        # with a reserve of 5 %); None: not known yet, Joe learns it.
        vol.Optional("cutoff_soc", default=None): vol.Any(
            None, vol.All(vol.Coerce(float), vol.Range(min=0, max=60))
        ),
    },
    extra=vol.ALLOW_EXTRA,
)

TARIFF = vol.Schema(
    {
        vol.Optional("kind", default="unknown"): vol.In(TARIFF_KINDS),
        vol.Optional("price_entity", default=None): _ENTITY,
        vol.Optional("window", default=None): vol.Any(
            None, {vol.Required("start"): _time, vol.Required("end"): _time}
        ),
        vol.Optional("night_price", default=None): _PRICE,
        vol.Optional("day_price", default=None): _PRICE,
        vol.Optional("feed_in_price", default=None): _PRICE,
        vol.Optional("feed_in_entity", default=None): _ENTITY,
        # Added to every dynamic price (grid fees, taxes) when the sensor only
        # has the market price (per kWh).
        vol.Optional("surcharge", default=None): _PRICE,
    },
    extra=vol.ALLOW_EXTRA,
)

# Another forecast for the same panels: Joe learns how well it fits and
# combines it with the main forecast (see learn/models.py).
FORECAST_SOURCE = vol.Schema(
    {
        vol.Required("id"): vol.All(str, vol.Length(min=1, max=40)),
        vol.Required("name"): vol.All(str, vol.Length(min=1, max=60)),
        vol.Optional("provider", default=None): vol.Any(None, str),
        vol.Optional("tomorrow", default=list): [cv.entity_id],
    },
    extra=vol.ALLOW_EXTRA,
)

FORECAST = vol.Schema(
    {
        vol.Optional("provider", default=None): vol.Any(None, str),
        vol.Optional("config_entries", default=list): [str],
        vol.Optional("today", default=list): [cv.entity_id],
        vol.Optional("tomorrow", default=list): [cv.entity_id],
        vol.Optional("remaining_today", default=list): [cv.entity_id],
        vol.Optional("alternatives", default=list): [FORECAST_SOURCE],
        # Whether Joe may combine the sources (off: only the main forecast).
        vol.Optional("combine", default=True): bool,
        # A sensor with long-term statistics of the whole day's forecast (a
        # helper summing the "today" sensors), so past days get a forecast.
        # None: Joe looks for one himself (observe/backfill.py).
        vol.Optional("history_entity", default=None): _ENTITY,
    },
    extra=vol.ALLOW_EXTRA,
)

PERSON = vol.Schema(
    {
        vol.Required("id"): str,
        vol.Required("name"): str,
        vol.Optional("person_entity", default=None): _ENTITY,
        vol.Optional("calendars", default=list): [cv.entity_id],
        # Own calendar rules and defaults (None: those that apply to everyone).
        vol.Optional("calendar", default=None): vol.Any(
            None, lambda value: CALENDAR(value)
        ),
    },
    extra=vol.ALLOW_EXTRA,
)

CONSUMER = vol.Schema(
    {
        vol.Required("id"): str,
        vol.Required("name"): str,
        vol.Required("kind"): vol.In(CONSUMER_KINDS),
        vol.Optional("energy_entity", default=None): _ENTITY,
        vol.Optional("power_entity", default=None): _ENTITY,
        vol.Optional("included_in", default=None): _ENTITY,
        vol.Optional("source", default="manual"): vol.In(
            ("energy_dashboard", "manual")
        ),
        vol.Optional("runs", default="auto"): vol.In(CONSUMER_RUNS),
    },
    extra=vol.ALLOW_EXTRA,
)


def flexible_consumers(config: dict[str, Any]) -> list[str]:
    """Devices the home battery never has to cover: the car's wallbox, and
    devices that only run on solar surplus or in the cheap hours."""
    found = [
        c
        for c in config.get("consumers") or []
        if c["kind"] != "submeter"
        and (
            (
                c["kind"] == "ev"
                and c.get("runs", "auto") in ("auto", "cheap", "surplus")
            )
            or c.get("runs") in ("surplus", "cheap")
        )
    ]
    # A device measured inside another flexible one is in it already.
    inside = {c["energy_entity"] for c in found if c.get("energy_entity")}
    return sorted(c["id"] for c in found if c.get("included_in") not in inside)


# A condition of a night action: an entity compared with a value.
CONDITION = vol.Schema(
    {
        vol.Required("entity_id"): cv.entity_id,
        vol.Optional("op", default="eq"): vol.In(CONDITION_OPS),
        vol.Required("value"): vol.Any(str, int, float, bool),
    },
    extra=vol.ALLOW_EXTRA,
)

# A night action: something besides the batteries that should run in the cheap
# window when tomorrow brings too little sun (a wallbox, the hot water heat pump).
# Charging a car by need: only what tomorrow's driving (calendar trips or the
# usual distance) plus a reserve needs, from the car's level or range; the
# need belongs to the car (CAR), the wallbox is a charge point (CHARGE_POINT).
# A car's mailbox with a calendar (see accounts.py): Joe reads that calendar.
CAR_ACCOUNT_KINDS = ("google", "outlook", "microsoft", "icloud", "infomaniak", "caldav")
CAR_ACCOUNT = vol.Schema(
    {
        vol.Optional("kind", default="outlook"): vol.In(CAR_ACCOUNT_KINDS),
        vol.Optional("address", default=""): str,
        vol.Optional("username", default=None): vol.Any(None, str),
        # Another CalDAV server, or one's own Google or Microsoft app (a
        # Google app's secret is stored with the passwords) and tenant.
        vol.Optional("url", default=None): vol.Any(None, str),
        vol.Optional("client_id", default=None): vol.Any(None, str),
        vol.Optional("tenant", default="common"): vol.All(
            str, vol.Length(min=1, max=100)
        ),
        vol.Optional("accept", default=True): bool,
    },
    extra=vol.ALLOW_EXTRA,
)
# A car's mailbox without a calendar (see mail/): Joe reads invitations by
# IMAP, answers by SMTP and keeps the appointments in his own calendar for the
# car. The password lives elsewhere.
MAIL_PROVIDERS = ("webde", "gmx", "google", "tonline", "other")
CAR_MAILBOX = vol.Schema(
    {
        vol.Optional("provider", default="other"): vol.In(MAIL_PROVIDERS),
        vol.Optional("address", default=""): str,
        vol.Optional("username", default=None): vol.Any(None, str),
        vol.Optional("imap_host", default=None): vol.Any(None, str),
        vol.Optional("imap_port", default=None): vol.Any(
            None, vol.All(int, vol.Range(min=1, max=65535))
        ),
        vol.Optional("smtp_host", default=None): vol.Any(None, str),
        vol.Optional("smtp_port", default=None): vol.Any(
            None, vol.All(int, vol.Range(min=1, max=65535))
        ),
        vol.Optional("smtp_security", default=None): vol.Any(
            None, vol.In(("starttls", "ssl"))
        ),
        vol.Optional("accept", default=True): bool,
    },
    extra=vol.ALLOW_EXTRA,
)
# Where a car's appointments come from: a finished calendar in Home Assistant,
# the car's mailbox without a calendar (into Joe's calendar for the car), or
# the car's mailbox with a calendar.
CAR_SOURCES = ("ha", "mailbox", "account")

EV_NEED = vol.Schema(
    {
        vol.Optional("enabled", default=False): bool,
        vol.Optional("soc_entity", default=None): _ENTITY,
        vol.Optional("range_entity", default=None): _ENTITY,
        vol.Optional("capacity_kwh", default=None): _POSITIVE,
        vol.Optional("capacity_entity", default=None): _ENTITY,
        vol.Optional("odometer_entity", default=None): _ENTITY,
        # The car's own long-term average (kWh/100 km, Wh/km or km/kWh).
        vol.Optional("consumption_entity", default=None): _ENTITY,
        # Kilometres that always stay in the battery.
        vol.Optional("reserve_km", default=50.0): vol.All(
            vol.Coerce(float), vol.Range(min=0, max=1000)
        ),
        # kWh per 100 km at mild weather; None: learned, else a typical value.
        vol.Optional("consumption", default=None): vol.Any(
            None, vol.All(vol.Coerce(float), vol.Range(min=5, max=60))
        ),
        # Kilometres on a usual day; None: learned from the odometer.
        vol.Optional("daily_km", default=None): vol.Any(
            None, vol.All(vol.Coerce(float), vol.Range(min=0, max=2000))
        ),
        # Whose calendars count (person ids); None: everyone with a calendar.
        vol.Optional("persons", default=None): vol.Any(None, [str]),
        # The car's finished calendars in Home Assistant (source "ha").
        vol.Optional("calendars", default=list): [cv.entity_id],
        vol.Optional("source", default="ha"): vol.In(CAR_SOURCES),
        vol.Optional("mailbox", default=dict): CAR_MAILBOX,
        vol.Optional("account", default=dict): CAR_ACCOUNT,
        # Who may invite the car (mailbox and account): addresses or "@domain".
        vol.Optional("allowed", default=list): [str],
        vol.Optional("round_trip", default=True): bool,
        # Never charge above this level by need (e.g. 80 % to spare the battery).
        vol.Optional("max_soc", default=100.0): vol.All(
            vol.Coerce(float), vol.Range(min=20, max=100)
        ),
    },
    extra=vol.ALLOW_EXTRA,
)

# Where a car's values come from: evcc's vehicle, the car maker's integration
# (e.g. Hyundai) or entities chosen by hand. One car may merge several.
CAR_SOURCE_KINDS = ("evcc", "car")
# The roles of a car's entities (see discovery/find.py CAR_ROLES).
CAR_ENTITY_ROLES = (
    "soc",
    "range",
    "capacity",
    "plugged",
    "charging",
    "odometer",
    "consumption",
    "outside_temp",
    "location",
)
CAR_SOURCE = vol.Schema(
    {
        # "<kind>:<device id>": one integration's device.
        vol.Required("id"): vol.All(str, vol.Length(min=1, max=120)),
        vol.Optional("kind", default="car"): vol.In(CAR_SOURCE_KINDS),
        vol.Optional("platform", default=None): vol.Any(None, str),
        vol.Optional("device_id", default=None): vol.Any(None, str),
        vol.Optional("name", default=None): vol.Any(None, str),
        # evcc's id of the vehicle ("db:27" or the name in evcc.yaml), as its
        # loadpoints show it; None: not known yet (Joe learns it).
        vol.Optional("vehicle", default=None): vol.Any(None, str),
        vol.Optional("entities", default=dict): _strict(
            {vol.In(CAR_ENTITY_ROLES): cv.entity_id}
        ),
    },
    extra=vol.ALLOW_EXTRA,
)
# A car: everything about what it needs (see plan/cars.py). Joe charges it at
# whichever charge point it is plugged into.
CAR = vol.Schema(
    {
        vol.Required("id"): vol.All(str, vol.Length(min=1, max=120)),
        vol.Required("name"): vol.All(str, vol.Length(min=1, max=60)),
        vol.Optional("sources", default=list): [CAR_SOURCE],
        # Where the car is (a device_tracker or person; None: its integration's).
        vol.Optional("tracker_entity", default=None): _ENTITY,
        vol.Optional("need", default=dict): EV_NEED,
        # In the evening: tell when tomorrow needs charging but the car is not plugged in.
        vol.Optional("remind", default=True): bool,
        vol.Optional("remind_time", default="20:00"): _time,
    },
    extra=vol.ALLOW_EXTRA,
)
# What Joe does when he cannot tell which car is plugged into a charge point.
UNKNOWN_CAR = ("ask", "assume")
# A charge point: a night action that switches a wallbox (evcc's mode). Joe
# finds out which car is plugged in and charges by that car's need.
CHARGE_POINT = vol.Schema(
    {
        # evcc's vehicle at the loadpoint (a select: "db:27", "null": none).
        vol.Optional("vehicle_entity", default=None): _ENTITY,
        vol.Optional("connected_entity", default=None): _ENTITY,
        # evcc's values of the car at the loadpoint (evcc estimates the level
        # while charging instead of asking the car).
        vol.Optional("soc_entity", default=None): _ENTITY,
        vol.Optional("range_entity", default=None): _ENTITY,
        vol.Optional("odometer_entity", default=None): _ENTITY,
        # Which cars may charge here (car ids); None: every car.
        vol.Optional("cars", default=None): vol.Any(None, [str]),
        vol.Optional("unknown", default="ask"): vol.In(UNKNOWN_CAR),
        vol.Optional("assume_car", default=None): vol.Any(None, str),
    },
    extra=vol.ALLOW_EXTRA,
)

_CLOCK = vol.Match(r"^([01]?\d|2[0-3]):[0-5]\d$")

# A thermostat or air conditioner Joe steers by presence (see control/climate.py).
# The device that measures a climate device (several may share one).
CLIMATE_METER = vol.Schema(
    {
        vol.Required("device_id"): str,
        vol.Optional("power", default=None): _ENTITY,
        vol.Optional("energy", default=None): _ENTITY,
    },
    extra=vol.ALLOW_EXTRA,
)
CLIMATE_ROOM = vol.Schema(
    {
        vol.Optional("enabled", default=False): bool,
        # None: not chosen yet (Joe suggests one), "none": has no meter.
        vol.Optional("meter", default=None): vol.Any(None, "none", CLIMATE_METER),
        # While nobody is home: lower (cooling: raise) by setback_k, switch
        # "off", or a "preset" of the device (e.g. a Homematic IP profile).
        vol.Optional("away", default="setback"): vol.In(("setback", "off", "preset")),
        vol.Optional("setback_k", default=3.0): vol.All(
            vol.Coerce(float), vol.Range(min=0.5, max=10)
        ),
        vol.Optional("away_preset", default=None): vol.Any(None, str),
        # Days off (workday sensor off) while people are home.
        vol.Optional("free_day_preset", default=None): vol.Any(None, str),
        # Air conditioners: off at night, back in time before the morning.
        vol.Optional("night_off", default=False): bool,
        vol.Optional("night_from", default="23:00"): _CLOCK,
        vol.Optional("night_until", default="06:30"): _CLOCK,
        # Air conditioners: six profiles per mode with a curve over the day
        # (see control/week.py).
        vol.Optional("week", default=dict): vol.Schema(
            {
                vol.Optional("enabled", default=False): bool,
                vol.Optional("modes", default=dict): _strict(
                    {vol.In(week.MODES): week.profile_set}
                ),
            },
            extra=vol.ALLOW_EXTRA,
        ),
        # Thermostats with profiles of their own (Homematic IP): ticks by preset.
        vol.Optional("device_profiles", default=dict): week.device_profiles,
    },
    extra=vol.ALLOW_EXTRA,
)
CLIMATE = vol.Schema(
    {
        vol.Optional("enabled", default=False): bool,
        # Nobody home counts as away only after this many minutes.
        vol.Optional("away_after_min", default=15): vol.All(
            int, vol.Range(min=0, max=240)
        ),
        # When night is: each room's times, or an entity that is "on" while
        # people are in bed (a "good night" routine, a bed sensor ...).
        vol.Optional("night_by", default="time"): vol.In(("time", "entity")),
        # The drive home from the routing service (the position, rounded to
        # about 100 m, goes to it) instead of an average speed.
        vol.Optional("route_eta", default=True): bool,
        vol.Optional("night_entity", default=None): _ENTITY,
        vol.Optional("rooms", default=dict): _strict({cv.entity_id: CLIMATE_ROOM}),
    },
    extra=vol.ALLOW_EXTRA,
)

# A switch Joe may switch off at night or while nobody is home (see
# control/standby.py); "never" until the owner chooses otherwise.
STANDBY_CHOICES = ("never", "night", "away", "both")
STANDBY_DEVICE = vol.Schema(
    {
        vol.Optional("when", default="never"): vol.In(STANDBY_CHOICES),
        # The power reading on the same device (what switching it saves).
        vol.Optional("power_entity", default=None): _ENTITY,
        # Night as for the air conditioners: the device's own times, or the
        # entity of the Nachtruhe (climate.night_by).
        vol.Optional("night_from", default="23:00"): _CLOCK,
        vol.Optional("night_until", default="06:30"): _CLOCK,
    },
    extra=vol.ALLOW_EXTRA,
)
STANDBY = vol.Schema(
    {
        vol.Optional("devices", default=dict): _strict({cv.entity_id: STANDBY_DEVICE}),
    },
    extra=vol.ALLOW_EXTRA,
)

ROUTING_SERVICES = ("waze", "google", "osm")

# How Joe works out the distance to an appointment's place (None: not at all).
# OpenStreetMap works without an account; it is only asked once a car charges
# by need, which the user switches on.
ROUTING = vol.Schema(
    {
        vol.Optional("service", default="osm"): vol.Any(None, vol.In(ROUTING_SERVICES)),
        # The Google travel time entry (it holds the API key).
        vol.Optional("google_entry", default=None): vol.Any(None, str),
        # OpenStreetMap services: geocoding (Photon) and car routing (OSRM).
        vol.Optional("geocoder_url", default="https://photon.komoot.io/api/"): vol.All(
            str, vol.Length(min=8, max=200)
        ),
        vol.Optional(
            "router_url",
            default="https://routing.openstreetmap.de/routed-car/route/v1/driving/",
        ): vol.All(str, vol.Length(min=8, max=200)),
    },
    extra=vol.ALLOW_EXTRA,
)

ACTION = vol.Schema(
    {
        vol.Required("id"): str,
        vol.Required("name"): str,
        vol.Required("kind"): vol.In(ACTION_KINDS),
        vol.Optional("enabled", default=True): bool,
        # What Joe switches, to which value, and how he puts it back.
        vol.Required("entity_id"): cv.entity_id,
        vol.Optional("on_value", default="on"): vol.Any(str, int, float, bool),
        vol.Optional("reset", default="previous"): vol.In(("previous", "fixed")),
        vol.Optional("reset_value", default=None): vol.Any(None, str, int, float, bool),
        vol.Optional("lead_min", default=0): vol.All(int, vol.Range(min=0, max=120)),
        # When: tomorrow's sun below a threshold (None: every night) and conditions.
        vol.Optional("auto", default=True): bool,
        vol.Optional("forecast_below_kwh", default=None): _POSITIVE,
        vol.Optional("conditions", default=list): [CONDITION],
        # How much it draws, for the grid limit, and its meter for the history.
        vol.Optional("power_kw", default=None): _POSITIVE,
        vol.Optional("power_entity", default=None): _ENTITY,
        vol.Optional("consumer_id", default=None): vol.Any(None, str),
        vol.Optional("priority", default=1): vol.All(int, vol.Range(min=1, max=9)),
        # "target": on until a sensor reaches a level (e.g. hot water in °C).
        vol.Optional("sensor_entity", default=None): _ENTITY,
        vol.Optional("comfort", default=45.0): vol.All(
            vol.Coerce(float), vol.Range(min=0, max=100)
        ),
        vol.Optional("maximum", default=62.0): vol.All(
            vol.Coerce(float), vol.Range(min=0, max=100)
        ),
        vol.Optional("buffer", default=3.0): vol.All(
            vol.Coerce(float), vol.Range(min=0, max=30)
        ),
        # A wallbox: which car is plugged in decides (see CHARGE_POINT).
        vol.Optional("point", default=None): vol.Any(None, CHARGE_POINT),
    },
    extra=vol.ALLOW_EXTRA,
)

# How much of the solar forecast Joe counts on for the daytime surplus.
DAY_CAUTIONS = ("tight", "normal", "careful")
# How much the night plan weighs a bad day tomorrow (see plan/planner.py).
NIGHT_CAUTIONS = ("bold", "brave", "balanced", "careful", "cautious")
# How several batteries that regulate themselves work together.
TEAM_MODES = ("sequence", "together")
TEAM_STYLES = ("auto", "strict", "base")

RULES = vol.Schema(
    {
        vol.Optional("reserve_soc", default=10): _PERCENT,
        vol.Optional("max_target_soc", default=100): _PERCENT,
        vol.Optional("evening_min_soc", default=None): vol.Any(None, _PERCENT),
        vol.Optional("grid_limit_w", default=None): _POSITIVE,
        vol.Optional("max_night_kwh", default=None): _POSITIVE,
        vol.Optional("priority", default=list(PRIORITY_ITEMS)): [
            vol.In(PRIORITY_ITEMS)
        ],
        vol.Optional("discharge_in_window", default="until_target"): vol.In(
            DISCHARGE_MODES
        ),
        vol.Optional("plan_offset_min", default=15): vol.All(
            int, vol.Range(min=0, max=180)
        ),
        vol.Optional("reset_lead_min", default=3): vol.All(
            int, vol.Range(min=0, max=60)
        ),
        vol.Optional("buffer_factor", default=0.35): vol.All(
            vol.Coerce(float), vol.Range(min=0, max=3)
        ),
        # When Joe asks in the "suggest" mode whether he may steer tonight.
        vol.Optional("ask_time", default="21:00"): _time,
        # Safety limits: never charge from the grid above this price, leave
        # a night alone that saves less than this, protect the main fuse live.
        vol.Optional("max_price", default=None): _PRICE,
        vol.Optional("min_saving", default=0.05): vol.All(
            vol.Coerce(float), vol.Range(min=0, max=5)
        ),
        vol.Optional("guard_grid", default=True): bool,
        # Grid-friendly: batteries take the sun around midday rather than in
        # the morning (where they can hold back charging), the car charges
        # with the sun. The saving comes first unless grid_first is set.
        vol.Optional("grid_friendly", default=True): bool,
        vol.Optional("grid_first", default=False): bool,
        # The buffer of the grid-friendly morning: charged from the sun first,
        # then Joe holds back (percent; None: as Joe suggests, see
        # plan/planner.py morning_buffer).
        vol.Optional("morning_buffer_soc", default=None): vol.Any(None, _PERCENT),
        # Daytime surplus: on sunny days the batteries charge only as fast as
        # they must to be full before the sun goes, the rest shows at the grid
        # meter for evcc's PV mode (see control/surplus.py).
        vol.Optional("day_surplus", default=False): bool,
        vol.Optional("day_caution", default="normal"): vol.In(DAY_CAUTIONS),
        vol.Optional("night_caution", default="brave"): vol.In(NIGHT_CAUTIONS),
        # Several batteries that regulate themselves on one grid meter:
        # "sequence" one after the other (see control/team.py), "together"
        # left to themselves; None: not chosen yet (left to themselves).
        vol.Optional("battery_team", default=None): vol.Any(None, vol.In(TEAM_MODES)),
        # Which battery goes first (battery ids; the others follow in the
        # order of the batteries).
        vol.Optional("team_charge_order", default=list): [str],
        vol.Optional("team_discharge_order", default=list): [str],
        # "Selbst einstellen" (see control/team_day.py): None automatic
        # (charging along, helping on big loads), "strict" one after the
        # other only, "base" the next group gives a base load.
        vol.Optional("team_style", default=None): vol.Any(None, vol.In(TEAM_STYLES)),
        # The answer to "Soll ich … künftig früher mitladen lassen?": True
        # Joe uses the lead he learned, False not (and does not ask again),
        # None not answered (no lead).
        vol.Optional("team_early", default=None): vol.Any(None, bool),
        # The watchdog: two batteries running against each other (one charges,
        # the other discharges): Joe restarts the culprit's own control, blocks
        # it for a few seconds and speaks up (see control/guard.py).
        vol.Optional("transfer_guard", default=True): bool,
        # A car charging fast by day (evcc's mode "now"): the house from the
        # battery whose turn it is, the car from the grid; Joe switches evcc's
        # discharge lock off meanwhile and back afterwards (control/house.py).
        vol.Optional("car_house_only", default=False): bool,
        # Expert: count the inverter's losses when charging from the grid,
        # measured at the grid meter (a battery's own meter may sit behind it).
        vol.Optional("converter_losses", default=False): bool,
        # Maintenance: once every so many days the batteries charge full so
        # they can balance their cells (None: off).
        vol.Optional("balance_days", default=None): vol.Any(
            None, vol.All(int, vol.Range(min=3, max=90))
        ),
    },
    extra=vol.ALLOW_EXTRA,
)

# Calendar events become a label per person and day ("office", "vacation", ...):
# the first rule whose keyword is in an event's title or place wins; days
# without a matching event get the default of a working day or a day off.
CALENDAR = vol.Schema(
    {
        vol.Optional(
            "rules",
            default=lambda: [
                {"keyword": keyword, "label": label}
                # "Homeoffice" before "office", so it is not taken for the office.
                for label, keywords in (
                    ("vacation", ("urlaub", "vacation", "ferien", "holiday")),
                    ("travel", ("dienstreise", "reise", "hotel", "trip", "travel")),
                    (
                        "home_office",
                        ("homeoffice", "home office", "mobiles arbeiten", "remote"),
                    ),
                    ("office", ("büro", "buero", "office")),
                    ("guests", ("besuch", "gäste", "gaeste", "guests", "visit")),
                )
                for keyword in keywords
            ],
        ): [
            vol.Schema(
                {
                    vol.Required("keyword"): vol.All(str, vol.Length(min=1, max=40)),
                    vol.Required("label"): vol.In(DAY_LABELS),
                }
            )
        ],
        vol.Optional("default_workday", default="home_office"): vol.In(DAY_LABELS),
        vol.Optional("default_day_off", default="home"): vol.In(DAY_LABELS),
    },
    extra=vol.ALLOW_EXTRA,
)

# Who hears from Joe: a notify service (e.g. a phone) and what he tells.
NOTIFY = vol.Schema(
    {
        vol.Optional("service", default=None): vol.Any(
            None, vol.Match(r"^notify\.[a-z0-9_]+$")
        ),
        vol.Optional("ask", default=True): bool,
        vol.Optional("problems", default=True): bool,
        vol.Optional("morning", default=False): bool,
        # Which car is plugged in, and a car that is not plugged in but needed.
        vol.Optional("cars", default=True): bool,
        # A battery held back by a setting that is not Joe's (its reserve at
        # the level, a block someone else set) while it matters.
        vol.Optional("stuck", default=True): bool,
    },
    extra=vol.ALLOW_EXTRA,
)

# Answers to Joe's questions. Known keys are checked, others are kept as they are
# (e.g. "heating", "hot_water", "ev", "tariff", "capacity:<battery id>").
ANSWERS = vol.Schema(
    {
        vol.Optional(IGNORED, default=list): [str],
        vol.Optional(CONFIRMED, default=list): [str],
    },
    extra=vol.ALLOW_EXTRA,
)

# What Joe learned from his own observations (see learn/learning.py).
LEARNED = vol.Schema(
    {
        vol.Optional("solar_factor", default=None): vol.Any(
            None, vol.All(vol.Coerce(float), vol.Range(min=0.2, max=3))
        ),
        vol.Optional("solar_days", default=0): vol.All(int, vol.Range(min=0)),
        vol.Optional("solar_shift", default=None): vol.Any(None, vol.In((-1, 0, 1))),
        vol.Optional("shift_days", default=0): vol.All(int, vol.Range(min=0)),
        vol.Optional("buffer", default=None): vol.Any(
            None, vol.All(vol.Coerce(float), vol.Range(min=0, max=3))
        ),
        vol.Optional("buffer_days", default=0): vol.All(int, vol.Range(min=0)),
        # What a sunny morning typically needs beyond the sun ({"kwh", "days"},
        # see learn/learning.py morning_need): the grid-friendly buffer.
        vol.Optional("morning_need", default=None): vol.Any(None, dict),
        vol.Optional("since", default=None): vol.Any(None, str),
        vol.Optional("updated", default=None): vol.Any(None, str),
        # The models (see learn/models.py), learned once a day.
        vol.Optional("consumption_model", default=None): vol.Any(None, dict),
        vol.Optional("group_models", default=dict): dict,
        vol.Optional("presence", default=dict): dict,
        vol.Optional("solar_classes", default=dict): dict,
        vol.Optional("sources", default=dict): dict,
        vol.Optional("battery_models", default=dict): dict,
        vol.Optional("replay", default=None): vol.Any(None, dict),
        vol.Optional("action_models", default=dict): dict,
        vol.Optional("car_models", default=dict): dict,
        # How far a day's sun and use spread around the typical (p20/p80
        # multipliers per weather class and per cold/mild day).
        vol.Optional("solar_spread", default=dict): dict,
        vol.Optional("home_spread", default=dict): dict,
        # The home's use worked out like the Energy dashboard against its own
        # consumption sensor, over the last weeks (kWh): days, calc, sensor.
        vol.Optional("home_check", default=None): vol.Any(None, dict),
        vol.Optional("models_day", default=None): vol.Any(None, str),
        # When an area was reset last ({"forecast": "2026-10-03T21:00:00+02:00"}).
        vol.Optional("reset", default=dict): {str: str},
    },
    extra=vol.ALLOW_EXTRA,
)

# The second look (see learn/sparring.py): once a day a language model, an
# ai_task entity the owner picks, checks Joe's numbers and texts. Off by default.
SPARRING = vol.Schema(
    {
        vol.Optional("enabled", default=False): bool,
        vol.Optional("entity", default=None): vol.Any(
            None, vol.All(cv.entity_id, vol.Match(r"^ai_task\.[a-z0-9_]+$"))
        ),
    },
    extra=vol.ALLOW_EXTRA,
)

PROVENANCE = vol.Schema(
    {
        vol.Required("source"): vol.In(SOURCES),
        vol.Optional("detail"): str,
        vol.Optional("updated"): str,
    }
)

CONFIG = vol.Schema(
    {
        vol.Required("version"): CONFIG_VERSION,
        vol.Optional("measurements", default=dict): vol.Schema(
            {
                vol.Optional("grid_power", default=None): vol.Any(None, MEASUREMENT),
                vol.Optional("home_power", default=None): vol.Any(None, MEASUREMENT),
                vol.Optional("solar_power", default=list): [SOLAR_MEASUREMENT],
            },
            extra=vol.ALLOW_EXTRA,
        ),
        vol.Optional("batteries", default=list): [BATTERY],
        vol.Optional("tariff", default=dict): TARIFF,
        vol.Optional("forecast", default=dict): FORECAST,
        vol.Optional("context", default=dict): vol.Schema(
            {
                vol.Optional("weather_entity", default=None): _ENTITY,
                vol.Optional("holiday_entity", default=None): _ENTITY,
                # "Someone is home": one entity (a helper group of the persons
                # and a guest switch), on or "home" while anyone is there.
                vol.Optional("presence_entity", default=None): _ENTITY,
                # Guest mode: a switch, and the tracker that follows it (home
                # while on), so a group of persons stays "home"/"not_home".
                vol.Optional("guest_switch", default=None): _ENTITY,
                vol.Optional("guest_tracker", default=None): _ENTITY,
                # Today is a day off as well while one of these is on.
                vol.Optional("free_day_entities", default=list): [cv.entity_id],
            },
            extra=vol.ALLOW_EXTRA,
        ),
        vol.Optional("persons", default=list): [PERSON],
        vol.Optional("consumers", default=list): [CONSUMER],
        vol.Optional("actions", default=list): [ACTION],
        vol.Optional("cars", default=list): [CAR],
        vol.Optional("rules", default=dict): RULES,
        vol.Optional("notify", default=dict): NOTIFY,
        vol.Optional("calendar", default=dict): CALENDAR,
        vol.Optional("routing", default=dict): ROUTING,
        vol.Optional("climate", default=dict): CLIMATE,
        vol.Optional("standby", default=dict): STANDBY,
        vol.Optional("answers", default=dict): ANSWERS,
        vol.Optional("learned", default=dict): LEARNED,
        vol.Optional("sparring", default=dict): SPARRING,
        vol.Optional("provenance", default=dict): {str: PROVENANCE},
    },
    extra=vol.ALLOW_EXTRA,
)


def default_config() -> dict[str, Any]:
    """Return a fresh, valid configuration with all defaults filled in."""
    return validate({"version": CONFIG_VERSION})


def validate(config: dict[str, Any]) -> dict[str, Any]:
    """Validate a configuration and fill in defaults (raises vol.Invalid)."""
    data = CONFIG(deepcopy(config))
    for key in ("batteries", "actions", "cars"):
        ids = [item["id"] for item in data[key]]
        if len(ids) != len(set(ids)):
            raise vol.Invalid(f"{key} ids must be unique", path=[key])
    return data


def apply_update(
    config: dict[str, Any],
    patch: dict[str, Any],
    source: str,
    detail: str | None = None,
    now: datetime | None = None,
) -> dict[str, Any]:
    """Merge a partial update into the configuration and record its origin.

    Nested dicts are merged, lists and plain values are replaced. For the keyed
    lists (batteries, persons, consumers) the patch may be a dict by item id:
    a dict merges into that item (or adds it), None removes it. Every changed
    path gets a provenance entry. Raises vol.Invalid if the result is invalid.
    """
    if source not in SOURCES:
        raise vol.Invalid(f"unknown source: {source}")
    merged = deepcopy(config)
    provenance: dict[str, Any] = merged.setdefault("provenance", {})
    paths: list[str] = []
    for key, value in patch.items():
        if key in ("version", "provenance"):
            continue
        if key in KEYED_LISTS and isinstance(value, dict):
            merged[key] = _merge_items(merged.get(key) or [], value)
            for item_id, change in value.items():
                prefix = f"{key}[{item_id}]"
                provenance.pop(prefix, None)
                if change is None:
                    _forget(provenance, prefix)
                    paths.append(prefix)
                else:
                    fields = {k: v for k, v in change.items() if k != "id"}
                    paths.extend(_leaf_paths(fields, f"{prefix}."))
        elif key in KEYED_LISTS:
            merged[key] = deepcopy(value)
            _forget(provenance, key)
            paths.append(key)
        else:
            merged = _merge(merged, {key: value})
            paths.extend(_leaf_paths({key: value}))
    stamp = (now or datetime.now(UTC)).isoformat(timespec="seconds")
    for path in paths:
        entry: dict[str, Any] = {"source": source, "updated": stamp}
        if detail:
            entry["detail"] = detail
        _forget(provenance, path)
        provenance[path] = entry
    return validate(merged)


def adopt_proposal(
    config: dict[str, Any],
    proposal: dict[str, Any],
    now: datetime | None = None,
    withdrawn: list[str] | None = None,
) -> dict[str, Any]:
    """Take over what Joe found, except what the user set, Joe learned or ignored.

    Values discovery could not determine (None) never replace known ones.
    Actions in `withdrawn` (proposed before, wrong as discovery knows now) go
    again, as long as the user changed nothing in them.
    """
    answers = config.get("answers") or {}
    ignored = set(answers.get(IGNORED) or [])

    def free(path: str) -> bool:
        return not is_protected(config, path)

    patch: dict[str, Any] = {}

    found = proposal.get("measurements") or {}
    measurements: dict[str, Any] = {}
    for role in ("grid_power", "home_power"):
        if found.get(role) and role not in ignored and free(f"measurements.{role}"):
            measurements[role] = found[role]
    solar = found.get("solar_power") or []
    if solar and "solar_power" not in ignored and free("measurements.solar_power"):
        measurements["solar_power"] = solar
    if measurements:
        patch["measurements"] = measurements

    tariff = proposal.get("tariff") or {}
    if "tariff" not in ignored:
        change: dict[str, Any] = {}
        price = ("kind", "price_entity", "window", "night_price", "day_price")
        if tariff.get("kind", "unknown") != "unknown" and all(
            free(f"tariff.{field}") for field in price
        ):
            change.update({field: tariff.get(field) for field in price})
        feed_in = ("feed_in_price", "feed_in_entity")
        if any(tariff.get(field) is not None for field in feed_in) and all(
            free(f"tariff.{field}") for field in feed_in
        ):
            change.update({field: tariff.get(field) for field in feed_in})
        if change:
            patch["tariff"] = change

    forecast = proposal.get("forecast") or {}
    if forecast and "forecast" not in ignored and free("forecast"):
        patch["forecast"] = forecast

    found_context = proposal.get("context") or {}
    context: dict[str, Any] = {}
    for key, name in (("weather_entity", "weather"), ("holiday_entity", "holiday")):
        if found_context.get(key) and name not in ignored and free(f"context.{key}"):
            context[key] = found_context[key]
    if context:
        patch["context"] = context

    for key, kind in (
        ("batteries", "battery"),
        ("persons", "person"),
        ("consumers", "consumer"),
        ("actions", "action"),
    ):
        known = {item["id"] for item in config.get(key) or []}
        items: dict[str, Any] = {}
        for item in proposal.get(key) or []:
            item_id = item["id"]
            prefix = f"{key}[{item_id}]"
            if f"{kind}:{item_id}" in ignored or _protected_above(config, prefix):
                continue
            if item_id not in known:
                items[item_id] = item
                continue
            fields = {
                field: value
                for field, value in item.items()
                if field != "id" and value is not None and free(f"{prefix}.{field}")
            }
            if fields:
                items[item_id] = fields
        if key == "actions":
            for item_id in withdrawn or []:
                if (
                    item_id in known
                    and item_id not in items
                    and not is_protected(config, f"actions[{item_id}]")
                ):
                    items[item_id] = None
        if items:
            patch[key] = items

    return apply_update(config, patch, "read", now=now) if patch else config


def source_of(config: dict[str, Any], path: str) -> str:
    """Where a value came from: its own entry or the nearest parent's ("default" if none)."""
    entry = _entry_of(config.get("provenance") or {}, path)
    return entry.get("source", "default") if entry else "default"


def is_protected(config: dict[str, Any], path: str) -> bool:
    """Whether the user or Joe's learning owns this path, a parent or a child of it."""
    if _protected_above(config, path):
        return True
    provenance = config.get("provenance") or {}
    return any(
        _is_below(other, path) and entry.get("source") in PROTECTED_SOURCES
        for other, entry in provenance.items()
    )


# Version 1 named a battery's controls after its integration; version 2 uses roles.
_V1_CONTROLS = {
    "fronius": {
        "minimum_reserve": "min_soc",
        "grid_charging": "grid_charge",
        "charge_limit": "charge_limit",
        "charge_limit_enabled": "charge_limit_enabled",
        "discharge_limit": "discharge_limit",
        "discharge_limit_enabled": "discharge_limit_enabled",
    },
    "omnibattery": {
        "force_mode": "mode",
        "charge_power": "charge_power",
        "discharge_power": "discharge_power",
        "charge_cutoff": "charge_target",
        "discharge_cutoff": "min_soc",
    },
}


def migrate(data: dict[str, Any]) -> dict[str, Any]:
    """Bring stored configuration up to the current version."""
    data = deepcopy(data)
    if data.get("version", 1) < 2:
        for battery in data.get("batteries") or []:
            names = _V1_CONTROLS.get(battery.get("adapter") or "", {})
            battery["controls"] = {
                names[name]: entity_id
                for name, entity_id in (battery.get("controls") or {}).items()
                if name in names
            }
            if battery.get("adapter") == "generic":
                battery["adapter"] = "none"
    if data.get("version", 1) < 3:
        # Version 2 calculated no distances until a service was picked.
        routing = data.get("routing") or {}
        if (
            routing.get("service") is None
            and source_of(data, "routing.service") != "user"
        ):
            data["routing"] = {**routing, "service": "osm"}
    if data.get("version", 1) < 4:
        _mailbox_to_cars(data)
    if data.get("version", 1) < 5:
        # 0.9.2 had a list of extra entities; now one presence entity says it.
        (data.get("climate") or {}).pop("home_entities", None)
    if data.get("version", 1) < 6:
        _presets_to_tags(data)
    if data.get("version", 1) < 7:
        _needs_to_cars(data)
    data["version"] = CONFIG_VERSION
    return validate(data)


def is_car_action(action: dict[str, Any]) -> bool:
    """Whether a night action of version 6 switched a wallbox for a car."""
    need = action.get("need") or {}
    return action.get("kind") == "switch" and bool(
        need.get("enabled")
        or need.get("soc_entity")
        or need.get("range_entity")
        or str(action.get("id", "")).startswith("ev_")
    )


def _needs_to_cars(data: dict[str, Any]) -> None:
    """Version 6 kept a car's need on the wallbox's night action; now the car
    is its own item and the action a charge point that charges whichever car
    is plugged in.

    The car keeps the action's id, so its mailbox, account, calendar, learned
    values and day records stay with it. Its entities stay as chosen; Joe links
    them to the integrations they come from when he looks around next.
    """
    provenance = data.get("provenance") or {}
    cars = data.setdefault("cars", [])
    known = {car.get("id") for car in cars}
    for action in data.get("actions") or []:
        need = action.pop("need", None) or {}
        if not is_car_action({**action, "need": need}):
            _forget(provenance, f"actions[{action.get('id')}].need")
            continue
        action_id = action["id"]
        connected = next(
            (
                c["entity_id"]
                for c in action.get("conditions") or []
                if str(c.get("entity_id", "")).startswith("binary_sensor.")
                and str(c.get("entity_id", "")).endswith("_connected")
            ),
            None,
        )
        action["point"] = {
            "connected_entity": connected,
            "cars": None,
            "unknown": "ask",
        }
        # A car only where the action knew one (a level or range to read, or by need).
        if not (
            need.get("enabled") or need.get("soc_entity") or need.get("range_entity")
        ):
            _forget(provenance, f"actions[{action_id}].need")
            continue
        if action_id in known:
            continue
        cars.append({"id": action_id, "name": action["name"], "need": need})
        known.add(action_id)
        prefix = f"actions[{action_id}].need"
        for path in [p for p in provenance if p == prefix or _is_below(p, prefix)]:
            entry = provenance.pop(path)
            provenance[f"cars[{action_id}].need{path[len(prefix) :]}"] = entry


def _presets_to_tags(data: dict[str, Any]) -> None:
    """Version 5 picked a thermostat's own profile for absence and days off;
    now ticks on its profiles say it (the old fields stay)."""
    provenance = data.get("provenance") or {}
    for entity_id, room in ((data.get("climate") or {}).get("rooms") or {}).items():
        found: list[tuple[str, str, str]] = []
        if room.get("away") == "preset":
            found.append((room.get("away_preset") or "", "away", "away_preset"))
        found.append((room.get("free_day_preset") or "", "holiday", "free_day_preset"))
        origin = None
        for preset, tag, field in found:
            if not week.WEEK_PROGRAM.match(preset):
                continue
            profiles = room.setdefault("device_profiles", {})
            entry = profiles.setdefault(preset, {"name": "", "tags": []})
            if tag not in entry.setdefault("tags", []):
                entry["tags"].append(tag)
            origin = origin or _entry_of(
                provenance, f"climate.rooms.{entity_id}.{field}"
            )
        if origin is not None:
            provenance[f"climate.rooms.{entity_id}.device_profiles"] = dict(origin)


def _entry_of(provenance: dict[str, Any], path: str) -> dict[str, Any] | None:
    """The provenance entry of a path or its nearest parent."""
    for candidate in reversed(_ancestors(path)):
        if entry := provenance.get(candidate):
            return entry
    return None


# Servers of the providers version 3 knew and version 4 has no preset for.
_V3_SERVERS = {
    "icloud": ("imap.mail.me.com", "smtp.mail.me.com"),
    "infomaniak": ("mail.infomaniak.com", "mail.infomaniak.com"),
}


def _mailbox_to_cars(data: dict[str, Any]) -> None:
    """Version 3 had one mailbox for all cars; now each car has its own."""
    old = data.pop("mailbox", None) or {}
    provenance = data.get("provenance") or {}
    for path in [p for p in provenance if p == "mailbox" or _is_below(p, "mailbox")]:
        del provenance[path]
    provider = old.get("provider") or "other"
    # The cars that really read the mailbox (charging by need is on).
    readers = [
        a
        for a in data.get("actions") or []
        if a.get("kind") == "switch"
        and (a.get("need") or {}).get("enabled")
        and a["need"].get("source") == "mailbox"
    ]
    for action in data.get("actions") or []:
        need = action.get("need") or {}
        if need.get("source") not in ("mailbox", "account"):
            continue
        need.setdefault("allowed", list(old.get("allowed") or []))
        if need["source"] != "mailbox":
            continue
        if (
            provider in ("outlook", "microsoft")
            and len(readers) == 1
            and readers[0] is action
        ):
            # Microsoft's mailbox has a calendar: the car's account now (a new
            # sign-in is needed, the old one was for mail only).
            need["source"] = "account"
            need["account"] = {
                **(need.get("account") or {}),
                "kind": provider,
                "address": (old.get("cars") or {}).get(action["id"])
                or old.get("address")
                or "",
                "client_id": old.get("client_id"),
                "tenant": old.get("tenant") or "common",
                "accept": old.get("accept", True),
            }
            continue
        imap, smtp = _V3_SERVERS.get(provider, (None, None))
        address = (old.get("cars") or {}).get(action["id"]) or old.get("address") or ""
        login = old.get("username") or old.get("address") or None
        need["mailbox"] = {
            "provider": provider if provider in ("google", "other") else "other",
            "address": address,
            # A plus address ("auto+kona@…") logs in as the mailbox it belongs to.
            "username": login if login and login != address else None,
            "imap_host": old.get("imap_host") or imap,
            "imap_port": old.get("imap_port"),
            "smtp_host": old.get("smtp_host") or smtp,
            "smtp_port": old.get("smtp_port"),
            "smtp_security": old.get("smtp_security"),
            "accept": old.get("accept", True),
        }


_TOKEN = re.compile(r"\[[^\]]*\]|[^.\[]+")


def _ancestors(path: str) -> list[str]:
    """ "a.b[c].d" -> ["a", "a.b", "a.b[c]", "a.b[c].d"]."""
    result: list[str] = []
    current = ""
    for token in _TOKEN.findall(path):
        if not current or token.startswith("["):
            current += token
        else:
            current += f".{token}"
        result.append(current)
    return result


def _is_below(other: str, path: str) -> bool:
    return other.startswith((f"{path}.", f"{path}["))


def _protected_above(config: dict[str, Any], path: str) -> bool:
    provenance = config.get("provenance") or {}
    return any(
        (entry := provenance.get(candidate)) is not None
        and entry.get("source") in PROTECTED_SOURCES
        for candidate in _ancestors(path)
    )


def _forget(provenance: dict[str, Any], path: str) -> None:
    """Drop provenance below a path (it is replaced as a whole)."""
    for other in [key for key in provenance if _is_below(key, path)]:
        del provenance[other]


def _merge(base: dict[str, Any], patch: dict[str, Any]) -> dict[str, Any]:
    for key, value in patch.items():
        if (
            isinstance(value, dict)
            and isinstance(base.get(key), dict)
            and value
            and key not in REPLACED
        ):
            base[key] = _merge(base[key], value)
        else:
            base[key] = deepcopy(value)
    return base


def _merge_items(
    items: list[dict[str, Any]], patch: dict[str, dict[str, Any] | None]
) -> list[dict[str, Any]]:
    by_id = {item["id"]: deepcopy(item) for item in items}
    order = [item["id"] for item in items]
    for item_id, change in patch.items():
        if change is None:
            by_id.pop(item_id, None)
        elif item_id in by_id:
            by_id[item_id] = _merge(by_id[item_id], change)
        else:
            by_id[item_id] = {**deepcopy(change), "id": item_id}
            order.append(item_id)
    return [by_id[item_id] for item_id in order if item_id in by_id]


def _leaf_paths(patch: dict[str, Any], prefix: str = "") -> list[str]:
    paths: list[str] = []
    for key, value in patch.items():
        path = f"{prefix}{key}"
        if isinstance(value, dict) and value and key not in REPLACED:
            paths.extend(_leaf_paths(value, f"{path}."))
        else:
            paths.append(path)
    return paths
