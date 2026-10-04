"""Subscription links: each car's calendar as an iCalendar file for phones.

Calendar apps cannot log in to Home Assistant, so the link carries a secret
(see CarCalendarStore.token); a new secret makes old links stop working.
Home Assistant must be reachable from the phone (e.g. through Home
Assistant Cloud or the user's own address).
"""

from __future__ import annotations

import hmac

from aiohttp import web

from homeassistant.components.http import HomeAssistantView
from homeassistant.core import HomeAssistant

from .calendar import car_actions
from .const import DOMAIN
from .plan.car_calendar import to_ics
from .runtime import DATA_RUNTIME

FEED_URL = f"/api/{DOMAIN}/calendar"


def feed_path(token: str, car: str) -> str:
    return f"{FEED_URL}/{token}/{car}.ics"


class CarCalendarFeed(HomeAssistantView):
    """GET /api/energy_joe/calendar/<token>/<car>.ics"""

    url = FEED_URL + "/{token}/{car}.ics"
    name = f"api:{DOMAIN}:calendar"
    requires_auth = False

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass

    async def get(self, request: web.Request, token: str, car: str) -> web.Response:
        runtime = self.hass.data.get(DATA_RUNTIME)
        if runtime is None:
            return web.Response(status=404)
        store = runtime.calendars
        await store.async_load()
        if not store.token or not hmac.compare_digest(token, store.token):
            return web.Response(status=404)
        action = next((a for a in car_actions(runtime.config) if a["id"] == car), None)
        if action is None:
            return web.Response(status=404)
        body = to_ics(action["name"], store.events(car))
        return web.Response(
            body=body.encode(),
            content_type="text/calendar",
            charset="utf-8",
            headers={"Cache-Control": "no-store"},
        )
