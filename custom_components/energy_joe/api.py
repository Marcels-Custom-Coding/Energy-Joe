"""Websocket API used by the Energy Joe panel."""

from __future__ import annotations

from datetime import date, timedelta
from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.const import MAJOR_VERSION, MINOR_VERSION, __version__ as HA_VERSION
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import (
    area_registry as ar,
    config_validation as cv,
    device_registry as dr,
    entity_registry as er,
)
from homeassistant.helpers.network import NoURLAvailableError, get_url
from homeassistant.helpers.sun import get_astral_event_date
from homeassistant.loader import async_get_integration
from homeassistant.util import dt as dt_util, slugify

from . import model
from .accounts import AccountError
from .calendar import unique_id as calendar_unique_id
from .calendar_feed import feed_path
from .const import DOMAIN
from .control.climate import arrivals as climate_arrivals
from .control.meters import meter_options, suggest as suggest_meter
from .control.profiles import PROFILES
from .discovery import async_check, async_collect, async_discover, discover
from .discovery.checks import run_config_checks
from .learn.learner import ANSWERS, MODEL_DAYS, SCOPES
from .learn.learning import (
    BUFFER_DAYS,
    SHIFT_DAYS,
    SOLAR_DAYS,
    solar_profile,
    solar_ratios,
)
from .learn.models import MIN_DAYS, SOURCE_DAYS, daily_rows
from .observe.records import day_view, summarize
from .plan.car_calendar import calendar_cars
from .plan.inputs import async_consumption
from .runtime import (
    AVAILABLE_MODES,
    DATA_RUNTIME,
    MODES,
    ONBOARDING_STEPS,
    JoeRuntime,
)


@callback
def async_register(hass: HomeAssistant) -> None:
    """Register all websocket commands."""
    websocket_api.async_register_command(hass, ws_info)
    websocket_api.async_register_command(hass, ws_places_set)
    websocket_api.async_register_command(hass, ws_subscribe)
    websocket_api.async_register_command(hass, ws_set_mode)
    websocket_api.async_register_command(hass, ws_onboarding)
    websocket_api.async_register_command(hass, ws_config_update)
    websocket_api.async_register_command(hass, ws_discover)
    websocket_api.async_register_command(hass, ws_adopt)
    websocket_api.async_register_command(hass, ws_check)
    websocket_api.async_register_command(hass, ws_history_days)
    websocket_api.async_register_command(hass, ws_history_day)
    websocket_api.async_register_command(hass, ws_history_rebuild)
    websocket_api.async_register_command(hass, ws_plan_refresh)
    websocket_api.async_register_command(hass, ws_learning)
    websocket_api.async_register_command(hass, ws_learning_reset)
    websocket_api.async_register_command(hass, ws_learning_answer)
    websocket_api.async_register_command(hass, ws_control_test)
    websocket_api.async_register_command(hass, ws_control_release)
    websocket_api.async_register_command(hass, ws_control_skip)
    websocket_api.async_register_command(hass, ws_control_answer)
    websocket_api.async_register_command(hass, ws_control_action_tonight)
    websocket_api.async_register_command(hass, ws_automations)
    websocket_api.async_register_command(hass, ws_climate_devices)
    websocket_api.async_register_command(hass, ws_notify_targets)
    websocket_api.async_register_command(hass, ws_automations_switch)
    websocket_api.async_register_command(hass, ws_control_boost)
    websocket_api.async_register_command(hass, ws_calendar_links)
    websocket_api.async_register_command(hass, ws_mailbox_secret)
    websocket_api.async_register_command(hass, ws_mailbox_test)
    websocket_api.async_register_command(hass, ws_mailbox_check)
    websocket_api.async_register_command(hass, ws_account)


def _runtime(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> JoeRuntime | None:
    """Return the runtime or answer with an error if Joe is not set up."""
    if (runtime := hass.data.get(DATA_RUNTIME)) is None:
        connection.send_error(msg["id"], "not_loaded", "Energy Joe is not set up.")
    return runtime


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/info"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_info(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return version information and what Joe can already see."""
    integration = await async_get_integration(hass, DOMAIN)
    connection.send_result(
        msg["id"],
        {
            "version": str(integration.version),
            "ha_version": HA_VERSION,
            "energy": await _async_energy_summary(hass),
            "defaults": {"rules": model.default_config()["rules"]},
            "profiles": {key: profile.name for key, profile in PROFILES.items()},
            "routing": _routing_options(hass),
        },
    )


def _routing_options(hass: HomeAssistant) -> dict[str, Any]:
    """What the panel can offer for distances: Waze, Google entries, OpenStreetMap."""
    return {
        # From 2026.8 on Joe can start Waze's action without a Waze entry.
        "waze": hass.services.has_service("waze_travel_time", "get_travel_times")
        or (MAJOR_VERSION, MINOR_VERSION) >= (2026, 8),
        "google": [
            {"entry_id": entry.entry_id, "title": entry.title}
            for entry in hass.config_entries.async_entries("google_travel_time")
        ],
    }


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/places/set",
        vol.Required("location"): vol.All(str, vol.Length(min=1, max=300)),
        vol.Required("km"): vol.Any(
            None, vol.All(vol.Coerce(float), vol.Range(min=0, max=3000))
        ),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_places_set(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """The user's own distance to an appointment's place (None: ask again)."""
    if (runtime := _runtime(hass, connection, msg)) is None:
        return
    await runtime.planner.places.async_set(msg["location"], msg["km"])
    if runtime.planner.active:
        changed = await runtime.planner.async_correct_needs(msg["location"])
        # A higher level than the one reached before: charge on.
        await runtime.executor.async_replanned(changed)
    connection.send_result(msg["id"])


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/subscribe"})
@websocket_api.require_admin
@callback
def ws_subscribe(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Send Joe's state now and after every change."""
    if (runtime := _runtime(hass, connection, msg)) is None:
        return

    @callback
    def forward(state: dict[str, Any]) -> None:
        connection.send_message(websocket_api.event_message(msg["id"], state))

    connection.subscriptions[msg["id"]] = runtime.async_subscribe(forward)
    connection.send_result(msg["id"])
    forward(runtime.state)


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/set_mode", vol.Required("mode"): vol.In(MODES)}
)
@websocket_api.require_admin
@callback
def ws_set_mode(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Switch between simulation, live and off."""
    if (runtime := _runtime(hass, connection, msg)) is None:
        return
    if msg["mode"] not in AVAILABLE_MODES:
        connection.send_error(msg["id"], "not_available", "Mode not available.")
        return
    runtime.async_set_mode(msg["mode"])
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/onboarding",
        vol.Optional("step"): vol.In(ONBOARDING_STEPS),
        vol.Optional("completed"): bool,
    }
)
@websocket_api.require_admin
@callback
def ws_onboarding(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Store the progress of the setup in the panel."""
    if (runtime := _runtime(hass, connection, msg)) is None:
        return
    runtime.async_set_onboarding(step=msg.get("step"), completed=msg.get("completed"))
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/config/update",
        vol.Required("patch"): dict,
        vol.Optional("source", default="user"): vol.In(("user", "read", "default")),
        vol.Optional("detail"): str,
    }
)
@websocket_api.require_admin
@callback
def ws_config_update(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Merge a partial configuration update.

    "read" marks values taken from Home Assistant, "default" puts a value back
    to Joe's starting value.
    """
    if (runtime := _runtime(hass, connection, msg)) is None:
        return
    try:
        runtime.async_update_config(msg["patch"], msg["source"], msg.get("detail"))
    except vol.Invalid as err:
        connection.send_error(msg["id"], "invalid_config", str(err))
        return
    connection.send_result(msg["id"])


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/discover"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_discover(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Look around Home Assistant and report what Joe can use (read-only)."""
    connection.send_result(msg["id"], await async_discover(hass))


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/adopt"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_adopt(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Look around, take over what Joe found and check the result.

    Values the user set, values Joe learned and things the user told him to
    leave out stay as they are.
    """
    if (runtime := _runtime(hass, connection, msg)) is None:
        return
    snap = await async_collect(hass)
    result = discover(snap)
    runtime.async_adopt(result["proposal"], result["not_car_actions"])
    connection.send_result(
        msg["id"],
        {"discovery": result, "checks": run_config_checks(snap, runtime.config)},
    )


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/check"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_check(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Check what Joe is configured to use against the current states."""
    if (runtime := _runtime(hass, connection, msg)) is None:
        return
    connection.send_result(
        msg["id"], {"checks": await async_check(hass, runtime.config)}
    )


def _window(runtime: JoeRuntime) -> dict[str, str] | None:
    tariff = runtime.config["tariff"]
    return tariff["window"] if tariff["kind"] == "fixed_window" else None


def _day(value: Any) -> str:
    return date.fromisoformat(value).isoformat()


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/history/days",
        vol.Optional("days", default=14): vol.All(int, vol.Range(min=1, max=400)),
        vol.Optional("until"): _day,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_history_days(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Summaries of the most recent days Joe knows, newest first."""
    if (runtime := _runtime(hass, connection, msg)) is None:
        return
    last = date.fromisoformat(msg.get("until") or dt_util.now().date().isoformat())
    first = last - timedelta(days=msg["days"] - 1)
    days = await runtime.history.async_days(first.isoformat(), last.isoformat())
    window = _window(runtime)
    connection.send_result(
        msg["id"],
        {
            "days": [
                summarize(day, data, window) for day, data in reversed(days.items())
            ],
            **runtime.history.overview(),
        },
    )


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/history/day", vol.Required("date"): _day}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_history_day(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """One day with all its hours, the forecast and the times of the sun."""
    if (runtime := _runtime(hass, connection, msg)) is None:
        return
    data = await runtime.history.async_day(msg["date"]) or {}
    day = date.fromisoformat(msg["date"])
    previous = await runtime.history.async_day((day - timedelta(days=1)).isoformat())
    sun = {
        event: moment
        for event in ("sunrise", "sunset")
        if (moment := get_astral_event_date(hass, event, day)) is not None
    }
    connection.send_result(
        msg["id"], day_view(msg["date"], data, _window(runtime), sun, previous)
    )


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/history/rebuild"})
@websocket_api.require_admin
@callback
def ws_history_rebuild(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Read the history again from Home Assistant (keeps what only Joe saw)."""
    if (runtime := _runtime(hass, connection, msg)) is None:
        return
    if not runtime.async_rebuild_history():
        connection.send_error(msg["id"], "not_observing", "Joe is not watching.")
        return
    connection.send_result(msg["id"])


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/plan/refresh"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_plan_refresh(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Plan tonight again with the latest values (a fixed plan stays)."""
    if (runtime := _runtime(hass, connection, msg)) is None:
        return
    plan = await runtime.async_refresh_plan()
    if plan is None:
        connection.send_error(msg["id"], "not_planning", "Joe is not planning.")
        return
    connection.send_result(msg["id"], plan)


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/learning"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_learning(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """What Joe learned, with the days behind it."""
    if (runtime := _runtime(hass, connection, msg)) is None:
        return
    config = runtime.config
    today = dt_util.now().date()
    since = config["learned"]["since"]
    first = (today - timedelta(days=28)).isoformat()
    if since and since[:10] > first:
        first = since[:10]
    days = await runtime.history.async_days(first, today.isoformat())
    flexible = model.flexible_consumers(config)
    profiles, consumption = await async_consumption(runtime.history, today, flexible)
    # The days behind the models: consumption against the outdoor temperature.
    model_first = (today - timedelta(days=MODEL_DAYS)).isoformat()
    if since and since[:10] > model_first:
        model_first = since[:10]
    model_days = await runtime.history.async_days(
        model_first, (today - timedelta(days=1)).isoformat()
    )
    points = [
        {
            "date": row.date,
            "home": round(row.home, 2),
            "temp": None if row.temp is None else round(row.temp, 1),
            "workday": row.workday,
            "excluded": row.excluded,
            "answer": model_days[row.date].get("answer"),
            "labels": model_days[row.date].get("labels") or {},
        }
        for row in daily_rows(model_days, flexible)
    ]
    accuracy = []
    for day, data in days.items():
        evaluation = data.get("evaluation") or {}
        if evaluation.get("complete") and evaluation.get("final", True):
            accuracy.append(
                {
                    "date": day,
                    "saving": evaluation["saving"],
                    "solar": evaluation["solar"],
                    "home": evaluation["home"],
                    "bridge": evaluation["bridge"],
                }
            )
    connection.send_result(
        msg["id"],
        {
            "learned": config["learned"],
            "buffer": {
                "value": config["rules"]["buffer_factor"],
                "source": model.source_of(config, "rules.buffer_factor"),
                "default": model.default_config()["rules"]["buffer_factor"],
            },
            "solar": solar_ratios(days),
            "solar_profile": solar_profile(days),
            "consumption": {
                "workday": profiles[True],
                "day_off": profiles[False],
                **consumption,
            },
            "accuracy": accuracy,
            "results": runtime.learner.results,
            "days": points,
            "questions": runtime.learner.questions,
            "needs": {
                "solar": SOLAR_DAYS,
                "shift": SHIFT_DAYS,
                "buffer": BUFFER_DAYS,
                "models": MIN_DAYS,
                "sources": SOURCE_DAYS,
            },
        },
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/learning/reset",
        vol.Optional("scope", default="all"): vol.In(("all", *SCOPES)),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_learning_reset(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Forget what Joe learned (all or one area); he learns it again from now."""
    if (runtime := _runtime(hass, connection, msg)) is None:
        return
    if not await runtime.async_reset_learning(msg["scope"]):
        connection.send_error(msg["id"], "not_learning", "Joe is not learning.")
        return
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/learning/answer",
        vol.Required("date"): cv.date,
        vol.Required("answer"): vol.In(ANSWERS),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_learning_answer(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """What was special about a day Joe asked about."""
    if (runtime := _runtime(hass, connection, msg)) is None:
        return
    if not await runtime.async_answer_day(msg["date"].isoformat(), msg["answer"]):
        connection.send_error(msg["id"], "not_learning", "Joe is not learning.")
        return
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/control/test", vol.Required("battery_id"): str}
)
@websocket_api.require_admin
@callback
def ws_control_test(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Start a test run for one battery; progress and result come with the state."""
    if (runtime := _runtime(hass, connection, msg)) is None:
        return
    executor = runtime.executor
    battery = next(
        (b for b in runtime.config["batteries"] if b["id"] == msg["battery_id"]), None
    )
    if battery is None:
        connection.send_error(msg["id"], "unknown_battery", "No such battery.")
        return
    if executor.testing is not None:
        connection.send_error(msg["id"], "busy", "A test run is going on.")
        return
    if executor.status.get("steering"):
        connection.send_error(msg["id"], "steering", "Joe is steering right now.")
        return

    async def run() -> None:
        try:
            await executor.async_test(msg["battery_id"])
        except ValueError:
            runtime.async_notify_changed()

    hass.async_create_task(run(), eager_start=False)
    connection.send_result(msg["id"], {"started": True})


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/control/release"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_control_release(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """The emergency button: every value back, no steering tonight."""
    if (runtime := _runtime(hass, connection, msg)) is None:
        return
    await runtime.executor.async_release_now()
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/control/skip", vol.Required("skip"): bool}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_control_skip(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Skip tonight, or steer after all."""
    if (runtime := _runtime(hass, connection, msg)) is None:
        return
    await runtime.executor.async_skip(msg["skip"])
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/control/answer",
        vol.Required("night"): str,
        vol.Required("yes"): bool,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_control_answer(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """The answer in the "suggest" mode for one night."""
    if (runtime := _runtime(hass, connection, msg)) is None:
        return
    await runtime.executor.async_answer(msg["night"], msg["yes"])
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/control/action_tonight",
        vol.Required("action_id"): str,
        vol.Required("on"): bool,
        # A car: charge up to this level (%) or range (km, plus the reserve).
        vol.Optional("target"): vol.Any(
            None, vol.All(vol.Coerce(float), vol.Range(min=1, max=1500))
        ),
        vol.Optional("unit", default="%"): vol.In(("%", "km")),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_control_action_tonight(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """The switch "tonight" of a night action (a car with a level to reach)."""
    if (runtime := _runtime(hass, connection, msg)) is None:
        return
    try:
        await runtime.async_action_tonight(
            msg["action_id"], msg["on"], msg.get("target"), msg["unit"]
        )
    except ValueError as err:
        connection.send_error(msg["id"], str(err), str(err))
        return
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/control/boost",
        vol.Required("action_id"): str,
        # None stops it.
        vol.Required("target"): vol.Any(
            None, vol.All(vol.Coerce(float), vol.Range(min=1, max=1500))
        ),
        vol.Optional("unit", default="%"): vol.In(("%", "km")),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_control_boost(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """ "Just charge to …": a car charges now until a level or a range."""
    if (runtime := _runtime(hass, connection, msg)) is None:
        return
    target = msg["target"]
    if target is not None and msg["unit"] == "%" and target > 100:
        connection.send_error(msg["id"], "invalid", "A level is at most 100 %.")
        return
    try:
        await runtime.executor.async_boost(msg["action_id"], target, msg["unit"])
    except ValueError as err:
        connection.send_error(msg["id"], str(err), str(err))
        return
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/calendar/links",
        # True: a new secret, the old links stop working.
        vol.Optional("renew", default=False): bool,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_calendar_links(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """The subscription links of the car calendars (paths; the panel adds the address)."""
    if (runtime := _runtime(hass, connection, msg)) is None:
        return
    store = runtime.calendars
    await store.async_load()
    token = store.new_token() if msg["renew"] else store.token
    try:
        external = get_url(hass, allow_internal=False, prefer_cloud=True)
    except NoURLAvailableError:
        external = None
    registry = er.async_get(hass)
    entries = hass.config_entries.async_entries(DOMAIN)
    cars = [a["id"] for a in calendar_cars(runtime.config, store)]
    entities = {}
    for car in cars:
        if entries:
            entities[car] = registry.async_get_entity_id(
                "calendar", DOMAIN, calendar_unique_id(entries[0].entry_id, car)
            )
    connection.send_result(
        msg["id"],
        {
            "external_url": external,
            "links": {car: feed_path(token or "", car) for car in cars},
            # Joe's calendar entity of each car that has one.
            "entities": entities,
        },
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/mailbox/secret",
        vol.Required("car"): str,
        # The password; empty removes it. It is never sent back.
        vol.Required("password"): vol.Any(None, vol.All(str, vol.Length(max=500))),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_mailbox_secret(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Store a car mailbox's password where the configuration never sees it."""
    if (runtime := _runtime(hass, connection, msg)) is None:
        return
    await runtime.inbox.async_set_password(msg["car"], msg["password"])
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/mailbox/test",
        vol.Required("car"): str,
        # The settings in the editor, maybe not saved yet.
        vol.Optional("mailbox"): model.CAR_MAILBOX,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_mailbox_test(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Log in to a car's mailbox once: {"error": None} or the reason it failed."""
    if (runtime := _runtime(hass, connection, msg)) is None:
        return
    connection.send_result(
        msg["id"],
        {"error": await runtime.inbox.async_test(msg["car"], msg.get("mailbox"))},
    )


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/mailbox/check", vol.Required("car"): str}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_mailbox_check(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Look for invitations in a car's mailbox now."""
    if (runtime := _runtime(hass, connection, msg)) is None:
        return
    await runtime.inbox.async_check(msg["car"])
    connection.send_result(msg["id"], runtime.inbox.status.get(msg["car"]))


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/account",
        vol.Required("car"): str,
        # "password" or "client_secret" (with password), "sign_in", "sign_out"
        # or "test".
        vol.Required("do"): vol.In(
            ("password", "client_secret", "sign_in", "sign_out", "test")
        ),
        vol.Optional("password"): vol.Any(None, vol.All(str, vol.Length(max=500))),
        # The settings in the editor (sign_in and test), maybe not saved yet.
        vol.Optional("account"): model.CAR_ACCOUNT,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_account(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """A car's account: password, own app's secret, sign-in, or a test read."""
    if (runtime := _runtime(hass, connection, msg)) is None:
        return
    accounts = runtime.accounts
    car = msg["car"]
    try:
        if msg["do"] == "password":
            await accounts.async_set_password(car, msg.get("password"))
            result: Any = None
        elif msg["do"] == "client_secret":
            await accounts.async_set_client_secret(car, msg.get("password"))
            result = None
        elif msg["do"] == "sign_in":
            result = await accounts.async_sign_in(car, msg.get("account"))
        elif msg["do"] == "sign_out":
            await accounts.async_sign_out(car)
            result = None
        else:
            result = {"error": await accounts.async_test(car, msg.get("account"))}
    except AccountError as err:
        connection.send_error(msg["id"], err.code, err.detail or err.code)
        return
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/automations"})
@websocket_api.require_admin
@callback
def ws_automations(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Automations that write to the batteries Joe steers."""
    if (runtime := _runtime(hass, connection, msg)) is None:
        return
    connection.send_result(msg["id"], runtime.automations())


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/automations/switch",
        # False: off (all that are on); True: on again (the ones Joe switched off).
        vol.Required("on"): bool,
        vol.Optional("entity_ids"): [cv.entity_id],
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_automations_switch(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Switch the battery automations off at once, or Joe's ones on again."""
    if (runtime := _runtime(hass, connection, msg)) is None:
        return
    failed = await runtime.async_switch_automations(msg["on"], msg.get("entity_ids"))
    connection.send_result(
        msg["id"], {"failed": failed, "automations": runtime.automations()}
    )


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/climate/devices"})
@websocket_api.require_admin
@callback
def ws_climate_devices(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Every thermostat and air conditioner, by room, and who heads home."""
    if _runtime(hass, connection, msg) is None:
        return
    entities = er.async_get(hass)
    devices = dr.async_get(hass)
    areas = ar.async_get(hass)
    found = []
    for state in hass.states.async_all("climate"):
        item = entities.async_get(state.entity_id)
        device = devices.async_get(item.device_id) if item and item.device_id else None
        area_id = (item.area_id if item else None) or (
            device.area_id if device else None
        )
        area = areas.async_get_area(area_id) if area_id else None
        found.append(
            {
                "entity_id": state.entity_id,
                "name": state.name,
                "device_id": device.id if device else None,
                "device_name": (device.name_by_user or device.name) if device else None,
                "area": area.name if area else None,
                "state": state.state,
                "hvac_modes": state.attributes.get("hvac_modes") or [],
                "preset_modes": state.attributes.get("preset_modes") or [],
                "temperature": state.attributes.get("temperature"),
                "current_temperature": state.attributes.get("current_temperature"),
                "platform": item.platform if item else None,
            }
        )
    meters = meter_options(hass)
    connection.send_result(
        msg["id"],
        {
            "devices": sorted(
                found, key=lambda d: ((d["area"] or "~").lower(), d["name"].lower())
            ),
            "arrivals": climate_arrivals(hass),
            "proximity": bool(hass.config_entries.async_entries("proximity")),
            "meters": meters,
            "suggested": {
                d["entity_id"]: hit
                for d in found
                if (hit := suggest_meter(d, meters)) is not None
            },
        },
    )


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/notify/targets"})
@websocket_api.require_admin
@callback
def ws_notify_targets(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Notify services with the name of the phone as Home Assistant shows it now.

    The Companion App's service keeps the name the phone had when the app was
    set up ("mobile_app_<name>"); the device may have been renamed since.
    """
    devices = dr.async_get(hass)
    names: dict[str, str] = {}
    for entry in hass.config_entries.async_entries("mobile_app"):
        slug = slugify(str(entry.data.get("device_name") or ""))
        device = next(
            iter(dr.async_entries_for_config_entry(devices, entry.entry_id)), None
        )
        if slug and device:
            names[f"mobile_app_{slug}"] = device.name_by_user or device.name or slug
    targets = [
        {"service": name, "name": names.get(name) or name.replace("_", " ")}
        for name in sorted(hass.services.async_services_for_domain("notify"))
        if name not in ("persistent_notification", "send_message", "notify")
    ]
    connection.send_result(msg["id"], targets)


async def _async_energy_summary(hass: HomeAssistant) -> dict[str, Any]:
    """Summarize the Energy dashboard configuration, if there is one."""
    if "energy" not in hass.config.components:
        return {"available": False}

    # Imported lazily: the energy integration is optional for Energy Joe.
    from homeassistant.components.energy.data import async_get_manager

    manager = await async_get_manager(hass)
    prefs = manager.data
    if not prefs:
        return {"available": True, "configured": False}

    sources = prefs.get("energy_sources", [])
    return {
        "available": True,
        "configured": True,
        "sources": {
            kind: sum(1 for source in sources if source.get("type") == kind)
            for kind in ("grid", "solar", "battery", "gas", "water")
        },
        "devices": len(prefs.get("device_consumption", [])),
    }
