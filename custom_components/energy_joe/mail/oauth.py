"""Signing in with Microsoft and Google for a car's calendar.

A car's calendar at Microsoft or Google is only reachable with a sign-in.
Joe uses the device code flow: the panel shows a short code and a link, the
user signs in on any device, and Joe gets a refresh token it renews itself.
No address of Home Assistant has to be reachable from outside.

Every sign-in needs an app registration. Energy Joe brings its own (personal
Microsoft accounts work without any setup, work and school accounts if their
admin allows it; Google once its app is registered); anyone can use their
own instead.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import timedelta
from typing import Any

from aiohttp import ClientError, ClientSession

from homeassistant.util import dt as dt_util

AUTHORITY = "https://login.microsoftonline.com"
# Energy Joe's own app registration at Microsoft (multi-tenant and personal
# accounts, public client flows). None until it is registered: then a client
# id has to be entered.
JOE_CLIENT_ID: str | None = None
# Reading a car's calendar and accepting its invitations (Microsoft Graph).
CALENDAR_SCOPES = (
    "https://graph.microsoft.com/Calendars.ReadWrite "
    "https://graph.microsoft.com/User.Read offline_access"
)
# Google: a "TVs and Limited Input devices" client. Its secret is not secret
# (Google says so for installed apps), but the token endpoint wants it.
GOOGLE_DEVICE = "https://oauth2.googleapis.com/device/code"
GOOGLE_TOKEN = "https://oauth2.googleapis.com/token"
# The scope Home Assistant's Google Calendar integration signs in with this
# way too (Google's list for device sign-in does not name the calendar).
GOOGLE_SCOPES = "https://www.googleapis.com/auth/calendar"
JOE_GOOGLE_CLIENT_ID: str | None = None
JOE_GOOGLE_CLIENT_SECRET: str | None = None
# Personal accounts (Outlook.com, Hotmail, Live, Xbox) and work or school ones.
PERSONAL_TENANT = "consumers"
WORK_TENANT = "organizations"


def client_for(client_id: str | None) -> str | None:
    """The app to sign in with: the user's own, else Energy Joe's."""
    return (client_id or "").strip() or JOE_CLIENT_ID


def tenant_for(kind: str, tenant: str | None) -> str:
    """Personal accounts sign in with "consumers", work ones with their tenant."""
    if kind == "outlook":
        return PERSONAL_TENANT
    tenant = (tenant or "").strip()
    return WORK_TENANT if tenant in ("", "common") else tenant


@dataclass(frozen=True, slots=True)
class SignIn:
    """Where and with which app to sign in."""

    device_url: str
    token_url: str
    client_id: str
    scopes: str
    client_secret: str | None = None
    # Microsoft wants the scopes again when renewing, Google does not.
    scopes_on_refresh: bool = True
    tenant: str | None = None

    def form(self, **fields: str) -> dict[str, str]:
        data = {"client_id": self.client_id, **fields}
        if self.client_secret:
            data["client_secret"] = self.client_secret
        return data


def microsoft(tenant: str, client_id: str) -> SignIn:
    return SignIn(
        f"{AUTHORITY}/{tenant}/oauth2/v2.0/devicecode",
        f"{AUTHORITY}/{tenant}/oauth2/v2.0/token",
        client_id,
        CALENDAR_SCOPES,
        tenant=tenant,
    )


def google(client_id: str, client_secret: str) -> SignIn:
    return SignIn(
        GOOGLE_DEVICE,
        GOOGLE_TOKEN,
        client_id,
        GOOGLE_SCOPES,
        client_secret,
        scopes_on_refresh=False,
    )


TIMEOUT = 20
# Renew the access token this long before it runs out.
EARLY = timedelta(minutes=5)


class OAuthError(Exception):
    """Microsoft refused (code like "authorization_pending", "expired_token")."""

    def __init__(self, code: str, detail: str = "") -> None:
        super().__init__(f"{code}: {detail}")
        self.code = code
        self.detail = detail


async def _post(
    session: ClientSession, url: str, data: dict[str, str]
) -> dict[str, Any]:
    try:
        async with session.post(url, data=data, timeout=TIMEOUT) as response:
            body = await response.json(content_type=None)
    except (ClientError, TimeoutError, ValueError) as err:
        raise OAuthError("connect", str(err)) from err
    if "error" in (body or {}):
        raise OAuthError(str(body["error"]), str(body.get("error_description", "")))
    return body or {}


async def start(session: ClientSession, sign_in: SignIn) -> dict[str, Any]:
    """Ask for a sign-in code: user_code, the address, device_code, interval."""
    found = await _post(
        session,
        sign_in.device_url,
        {"client_id": sign_in.client_id, "scope": sign_in.scopes},
    )
    # Microsoft calls the address verification_uri, Google verification_url.
    found.setdefault("verification_uri", found.get("verification_url"))
    return found


def _tokens(
    body: dict[str, Any], previous: dict[str, Any] | None = None
) -> dict[str, Any]:
    expires = dt_util.utcnow() + timedelta(seconds=int(body.get("expires_in") or 3600))
    return {
        "access_token": body["access_token"],
        # A new refresh token may come or not; keep the old one if not.
        "refresh_token": body.get("refresh_token")
        or (previous or {}).get("refresh_token"),
        "expires": expires.isoformat(),
    }


async def poll(
    session: ClientSession, sign_in: SignIn, device_code: str
) -> dict[str, Any]:
    """The tokens once the user signed in (OAuthError "authorization_pending" before)."""
    body = await _post(
        session,
        sign_in.token_url,
        sign_in.form(
            grant_type="urn:ietf:params:oauth:grant-type:device_code",
            device_code=device_code,
        ),
    )
    return _tokens(body)


def fresh(tokens: dict[str, Any]) -> bool:
    expires = dt_util.parse_datetime(tokens.get("expires") or "")
    return (
        bool(tokens.get("access_token"))
        and expires is not None
        and (expires - EARLY > dt_util.utcnow())
    )


async def refresh(
    session: ClientSession, sign_in: SignIn, tokens: dict[str, Any]
) -> dict[str, Any]:
    """New tokens from the refresh token."""
    if not tokens.get("refresh_token"):
        raise OAuthError("no_refresh_token")
    fields = {"grant_type": "refresh_token", "refresh_token": tokens["refresh_token"]}
    if sign_in.scopes_on_refresh:
        fields["scope"] = sign_in.scopes
    body = await _post(session, sign_in.token_url, sign_in.form(**fields))
    return _tokens(body, tokens)
