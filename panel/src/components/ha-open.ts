import { html, nothing, type TemplateResult } from "lit";
import type { Translate } from "../i18n";
import type { HomeAssistant } from "../types";
import { openInHa } from "./bits";

/** What the "In HA öffnen" button opens: the device page, else the entity's info dialog. */
export interface HaTarget {
  deviceId?: string | null;
  entityId?: string | null;
  name: string;
}

/** The target of an entity: its HA device when there is one. */
export function haTarget(hass: HomeAssistant | undefined, entityId: string | null | undefined, name: string): HaTarget {
  const deviceId = entityId ? hass?.entities?.[entityId]?.device_id ?? null : null;
  return { deviceId, entityId: entityId ?? null, name };
}

/**
 * Round 44 px button with an arrow out of the box: opens the device page in
 * Home Assistant (a middle click opens a new tab), without a device the
 * entity's info dialog. Pure navigation, so no tooltip of its own (tip.ha_open
 * explains it once in the page head).
 */
export function haOpen(t: Translate, target: HaTarget): TemplateResult | typeof nothing {
  const { deviceId, entityId, name } = target;
  if (deviceId) {
    const path = `/config/devices/device/${deviceId}`;
    const label = t("ha.open.device", { name });
    return html`<a
      class="ha-open"
      data-notip
      href=${path}
      title=${label}
      aria-label=${label}
      @click=${(ev: MouseEvent) => {
        if (ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.altKey || ev.button !== 0) return;
        ev.preventDefault();
        openInHa(path);
      }}
      ><ha-icon icon="mdi:open-in-new"></ha-icon
    ></a>`;
  }
  if (entityId) {
    const label = t("ha.open.entity", { name });
    return html`<button
      type="button"
      class="ha-open"
      data-notip
      title=${label}
      aria-label=${label}
      @click=${(ev: MouseEvent) =>
        (ev.currentTarget as HTMLElement).dispatchEvent(
          new CustomEvent("hass-more-info", { detail: { entityId }, bubbles: true, composed: true }),
        )}
    >
      <ha-icon icon="mdi:open-in-new"></ha-icon>
    </button>`;
  }
  return nothing;
}
