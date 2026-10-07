import { A as e, C as t, D as n, E as r, N as i, O as a, T as o, a as s, b as c, h as l, n as u, r as d, s as f, t as p, x as m, y as h } from "./tokens-PFleOrxX.js";
//#region src/energy-joe-cards.ts
var g = {
	state: void 0,
	listeners: /* @__PURE__ */ new Set(),
	unsubscribe: void 0,
	hass: void 0,
	failed: !1,
	listen(e, t) {
		return this.listeners.add(t), this.state && t(this.state), (!this.unsubscribe || this.hass?.connection !== e.connection) && (this.hass = e, this.unsubscribe = e.connection.subscribeMessage((e) => {
			this.state = e, this.failed = !1;
			for (let t of this.listeners) t(e);
		}, { type: "energy_joe/subscribe" }).catch((e) => {
			throw this.failed = !0, this.unsubscribe = void 0, e;
		}), this.unsubscribe.catch(() => void 0)), () => {
			this.listeners.delete(t), !this.listeners.size && this.unsubscribe && (this.unsubscribe.then((e) => e()).catch(() => void 0), this.unsubscribe = void 0, this.state = void 0);
		};
	}
}, _ = class extends n {
	constructor(...e) {
		super(...e), this.config = {};
	}
	static {
		this.styles = [
			p,
			c,
			i`
      :host {
        display: block;
      }
      ha-card {
        padding: 16px;
        background: var(--ha-card-background, var(--card-background-color, var(--joe-surface)));
        color: var(--primary-text-color, var(--joe-ink));
      }
      .head {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .head .eyebrow {
        flex: 1;
        min-width: 0;
      }
      .big {
        margin: 10px 0 4px;
        font-size: 17px;
        font-weight: 700;
        line-height: 1.35;
      }
      .lines {
        margin: 0;
        padding: 0;
        list-style: none;
        color: var(--joe-ink-2);
        font-size: 13.5px;
        display: grid;
        gap: 2px;
      }
      .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid var(--joe-line);
      }
      .muted {
        color: var(--joe-muted);
        font-size: 13px;
        margin: 8px 0 0;
      }
    `
		];
	}
	get hass() {
		return this._hass;
	}
	set hass(e) {
		let t = this._hass;
		this._hass = e, e && (this.setAttribute("theme", e.themes?.darkMode ? "dark" : "light"), !this.stop && this.isConnected && this.start()), this.requestUpdate("hass", t);
	}
	setConfig(e) {
		this.config = e ?? {};
	}
	getCardSize() {
		return 3;
	}
	connectedCallback() {
		super.connectedCallback(), this._hass && this.start();
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.stop?.(), this.stop = void 0;
	}
	start() {
		this.stop = g.listen(this._hass, (e) => this.joe = e);
	}
	get t() {
		return t(this._hass?.language);
	}
	render() {
		let t = this.t;
		return this._hass ? this.joe ? e`<ha-card>${this.renderCard(t, this.joe)}</ha-card>` : e`<ha-card><p class="muted">${t(g.failed ? "cards.no_access" : "cards.loading")}</p></ha-card>` : a;
	}
};
h([o()], _.prototype, "joe", void 0), h([o()], _.prototype, "config", void 0), h([r({ attribute: !1 })], _.prototype, "hass", null);
var v = class extends _ {
	static getStubConfig() {
		return {};
	}
	renderCard(t, n) {
		let r = n.plan, i = n.control, o = r?.window?.start, c = !!o && i?.skip === o, l = i?.reason, p = l === "waiting" && r?.window ? t("devices.status.waiting", { time: f(r.window.start) }) : l === "day" ? t("devices.status.day", { time: r?.day ? f(r.day.defer_until) : "–" }) : l ? t.optional(`devices.status.${l}`) ?? "" : "";
		return e`<div class="head">
        <div class="eyebrow"><ha-icon icon="energy-joe:joe"></ha-icon>${t("cards.night.title")}</div>
        <span class="chip ${n.mode === "live" ? "ok" : n.mode === "advisory" ? "learned" : ""}">${t(`mode.${n.mode}`)}</span>
      </div>
      ${r ? e`<p class="big">${s(t, r)}</p>
            <ul class="lines">
              ${d(t, r).map((t) => e`<li>${t}</li>`)}
              ${u(t, r) ? e`<li>${u(t, r)}</li>` : a}
            </ul>` : e`<p class="big">${t("devices.status.no_plan")}</p>`}
      ${p ? e`<p class="muted">${p}</p>` : a}
      ${o && n.mode !== "simulation" && n.mode !== "off" ? e`<div class="row">
            <span>${t("cards.night.skip")}</span>
            <button
              type="button"
              class="switch"
              role="switch"
              aria-checked=${String(c)}
              aria-label=${t("cards.night.skip")}
              @click=${() => this.skip(!c)}
            ></button>
          </div>` : a}`;
	}
	async skip(e) {
		try {
			await this.hass?.callWS({
				type: "energy_joe/control/skip",
				skip: e
			});
		} catch {}
	}
}, y = class extends _ {
	static getStubConfig() {
		return {};
	}
	getCardSize() {
		return 4;
	}
	car(e) {
		let t = e.config.actions.filter((e) => e.kind === "switch" && (e.need?.soc_entity || e.need?.range_entity)), n = typeof this.config.action == "string" ? this.config.action : void 0;
		return t.find((e) => e.id === n) ?? t[0];
	}
	renderCard(t, n) {
		let r = this.car(n);
		if (!r) return e`<p class="muted">${t("cards.car.none")}</p>`;
		let i = this.hass, o = r.need, s = n.control?.actions?.[r.id], c = [o.soc_entity ? l(i, o.soc_entity, t.lang) : null, o.range_entity ? l(i, o.range_entity, t.lang) : null].filter(Boolean);
		return e`<div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:car-electric"></ha-icon>${r.name}</div>
        ${s?.on ? e`<span class="chip ok">${t("cards.car.charging")}</span>` : a}
      </div>
      ${c.length ? e`<p class="big">${c.join(" · ")}</p>` : a}
      <joe-car-charge .hass=${i} .t=${t} .state=${n} .action=${r}></joe-car-charge>`;
	}
};
m("energy-joe-night-card", v), m("energy-joe-car-card", y);
var b = window.customCards ??= [];
for (let e of [{
	type: "energy-joe-night-card",
	name: "Energy Joe – heute Nacht",
	description: "Was Joe heute Nacht vorhat, was es kostet, und Aussetzen."
}, {
	type: "energy-joe-car-card",
	name: "Energy Joe – Auto laden",
	description: "Ladestand und Reichweite, jetzt oder heute Nacht laden."
}]) b.some((t) => t.type === e.type) || b.push({
	...e,
	preview: !0
});
//#endregion
