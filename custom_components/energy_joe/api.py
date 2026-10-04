"""Websocket API used by the Energy Joe panel."""

from __future__ import annotations

from datetime import date, timedelta
from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.const import MAJOR_VERSION, MINOR_VERSION, __version__ as HA_VERSION
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.sun import get_astral_event_date
from homeassistant.loader import async_get_integration
from homeassistant.util import dt as dt_util

from . import model
from .const import DOMAIN
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
    profiles, consumption = await async_consumption(runtime.history, today)
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
        for row in daily_rows(model_days)
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
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_control_action_tonight(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """The switch "tonight" of a night action."""
    if (runtime := _runtime(hass, connection, msg)) is None:
        return
    await runtime.async_action_tonight(msg["action_id"], msg["on"])
    connection.send_result(msg["id"])


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
