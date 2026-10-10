import { css, html, nothing, type TemplateResult } from "lit";
import { tip } from "./tip";
import { addRoute, deviceRoute, type AddKind, type DeviceEntry, type Group } from "../device-model";
import type { TipName, Translate } from "../i18n";
import { href, onLink, type Route } from "../router";

// Small parts the car, hot water and Weitere-Geräte pages share.

/** A meter without its night action: what is missing and the link to the assistant (a sheet). */
export function setupBlock(
  t: Translate,
  prefix: string,
  kind: AddKind,
  consumerId: string,
  text: string,
  label: string,
  tipName: TipName,
): TemplateResult {
  const to = addRoute(kind, consumerId);
  return html`<div class="setup-block" data-tipped>
    <p>${text} ${tip(t, tipName)}</p>
    <a class="btn btn-primary" href=${href(prefix, to)} @click=${onLink(to, { sheet: true })}>${label}</a>
  </div>`;
}

/** The device's page now, after its kind moved it to another group (a meter, an action, or "action-<id>"). */
export function movedPlace(devices: DeviceEntry[], id: string, from: Group): DeviceEntry | undefined {
  const actionId = id.startsWith("action-") ? id.slice(7) : id;
  return devices.find(
    (d) => d.group !== from && (d.consumer?.id === id || d.id === id || d.action?.id === actionId),
  );
}

/** "<Name> steht jetzt unter Auto & Laden →": a row where the device was. */
export function movedRow(t: Translate, prefix: string, name: string, entry: DeviceEntry): TemplateResult {
  const to: Route = entry.setup ? { tab: "devices", section: entry.group, id: entry.id } : deviceRoute(entry);
  return html`<div class="moved" role="status">
    <ha-icon icon="mdi:arrow-right-bold-circle-outline"></ha-icon>
    <span class="moved-text"><b>${name}</b></span>
    <a class="mini-btn go moved-go" href=${href(prefix, to)} @click=${onLink(to)}
      >${t("devices.moved_to", { group: t(`nav.devices.${entry.group}`) })}</a
    >
  </div>`;
}

/** A small heading inside a section ("Termine", "Nachts einschalten"). */
export function subHead(text: string, anchor?: string): TemplateResult {
  return html`<h4 class="sub-head" data-anchor=${anchor ?? nothing}>${text}</h4>`;
}

export const actionPageStyles = css`
  :host {
    display: block;
  }
  .wrap {
    max-width: 1100px;
    margin: 0 auto;
  }
  .group-actions {
    margin-top: 16px;
  }
  .setup-block {
    display: grid;
    gap: 12px;
    justify-items: start;
  }
  .setup-block p {
    margin: 0;
  }
  .setup-block a.btn {
    min-height: 44px;
    text-decoration: none;
  }
  .sub-head {
    margin: 22px 0 0;
    padding-top: 14px;
    border-top: 1px solid var(--joe-line);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--joe-muted);
  }
  .sub-head:first-child,
  .dsec-title + .sub-head {
    margin-top: 0;
    padding-top: 0;
    border-top: 0;
  }
  .muted {
    margin: 6px 0 0;
    color: var(--joe-muted);
  }
  .muted + a.add-link {
    margin-top: 12px;
  }
  .moved {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px 10px;
    padding: 10px 12px;
    border-radius: 14px;
    background: var(--joe-surface-2);
  }
  .moved > ha-icon {
    color: var(--joe-ink-2);
  }
  .moved-text {
    flex: 1 1 140px;
    min-width: 0;
    overflow-wrap: anywhere;
  }
  a.moved-go {
    min-height: 44px;
    text-decoration: none;
  }
  .now-why {
    margin: 0 0 10px;
    font-weight: 600;
  }
  .dcards + .group-head,
  .dcards + .sub-group {
    margin-top: 22px;
  }
  .sub-group {
    margin: 22px 0 8px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--joe-muted);
  }
  .list-head {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px 16px;
    margin: 0 0 10px;
    font-weight: 700;
  }
  .list-head span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .dcard-quick .input {
    flex: 1 1 200px;
    min-width: 0;
  }
`;
