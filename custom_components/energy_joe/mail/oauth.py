"""Signing in with Microsoft (Exchange Online and personal Outlook accounts).

Microsoft no longer accepts passwords for IMAP and SMTP. Joe uses the
device code flow: the panel shows a short code and a link, the user signs
in with the car's mailbox on any device, and Joe gets a refresh token it
renews itself. It needs an app registration in Microsoft Entra (public
client flows allowed) with the delegated permissions IMAP.AccessAsUser.All,
SMTP.Send and offline_access. No address of Home Assistant has to be
reachable from outside.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any

from aiohttp import ClientError, ClientSession

from homeassistant.util import dt as dt_util

AUTHORITY = "https://login.microsoftonline.com"
SCOPES = (
    "https://outlook.office.com/IMAP.AccessAsUser.All "
    "https://outlook.office.com/SMTP.Send offline_access"
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


async def start(session: ClientSession, tenant: str, client_id: str) -> dict[str, Any]:
    """Ask for a sign-in code: user_code, verification_uri, device_code, interval."""
    return await _post(
        session,
        f"{AUTHORITY}/{tenant}/oauth2/v2.0/devicecode",
        {"client_id": client_id, "scope": SCOPES},
    )


def _tokens(
    body: dict[str, Any], previous: dict[str, Any] | None = None
) -> dict[str, Any]:
    expires = dt_util.utcnow() + timedelta(seconds=int(body.get("expires_in") or 3600))
    return {
        "access_token": body["access_token"],
        # Microsoft may hand out a new refresh token; keep the old one if not.
        "refresh_token": body.get("refresh_token")
        or (previous or {}).get("refresh_token"),
        "expires": expires.isoformat(),
    }


async def poll(
    session: ClientSession, tenant: str, client_id: str, device_code: str
) -> dict[str, Any]:
    """The tokens once the user signed in (OAuthError "authorization_pending" before)."""
    body = await _post(
        session,
        f"{AUTHORITY}/{tenant}/oauth2/v2.0/token",
        {
            "grant_type": "urn:ietf:params:oauth:grant-type:device_code",
            "client_id": client_id,
            "device_code": device_code,
        },
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
    session: ClientSession, tenant: str, client_id: str, tokens: dict[str, Any]
) -> dict[str, Any]:
    """New tokens from the refresh token."""
    if not tokens.get("refresh_token"):
        raise OAuthError("no_refresh_token")
    body = await _post(
        session,
        f"{AUTHORITY}/{tenant}/oauth2/v2.0/token",
        {
            "grant_type": "refresh_token",
            "client_id": client_id,
            "refresh_token": tokens["refresh_token"],
            "scope": SCOPES,
        },
    )
    return _tokens(body, tokens)
