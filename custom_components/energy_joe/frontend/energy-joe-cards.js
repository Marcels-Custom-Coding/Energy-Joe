import { C as e, D as t, E as n, O as r, T as i, a, b as o, h as s, j as c, k as l, n as u, r as d, s as f, t as p, x as m, y as h } from "./tokens-CPX-ThWE.js";
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
}, _ = class extends t {
	constructor(...e) {
		super(...e), this.config = {};
	}
	static {
		this.styles = [
			p,
			o,
			c`
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
		return e(this._hass?.language);
	}
	render() {
		let e = this.t;
		return this._hass ? this.joe ? l`<ha-card>${this.renderCard(e, this.joe)}</ha-card>` : l`<ha-card><p class="muted">${e(g.failed ? "cards.no_access" : "cards.loading")}</p></ha-card>` : r;
	}
};
h([i()], _.prototype, "joe", void 0), h([i()], _.prototype, "config", void 0), h([n({ attribute: !1 })], _.prototype, "hass", null);
var v = class extends _ {
	static getStubConfig() {
		return {};
	}
	renderCard(e, t) {
		let n = t.plan, i = t.control, o = n?.window?.start, s = !!o && i?.skip === o, c = i?.reason, p = c === "waiting" && n?.window ? e("devices.status.waiting", { time: f(n.window.start) }) : c === "day" ? e("devices.status.day", { time: n?.day ? f(n.day.defer_until) : "–" }) : c ? e.optional(`devices.status.${c}`) ?? "" : "";
		return l`<div class="head">
        <div class="eyebrow"><ha-icon icon="energy-joe:joe"></ha-icon>${e("cards.night.title")}</div>
        <span class="chip ${t.mode === "live" ? "ok" : t.mode === "advisory" ? "learned" : ""}">${e(`mode.${t.mode}`)}</span>
      </div>
      ${n ? l`<p class="big">${a(e, n)}</p>
            <ul class="lines">
              ${d(e, n).map((e) => l`<li>${e}</li>`)}
              ${u(e, n) ? l`<li>${u(e, n)}</li>` : r}
            </ul>` : l`<p class="big">${e("devices.status.no_plan")}</p>`}
      ${p ? l`<p class="muted">${p}</p>` : r}
      ${o && t.mode !== "simulation" && t.mode !== "off" ? l`<div class="row">
            <span>${e("cards.night.skip")}</span>
            <button
              type="button"
              class="switch"
              role="switch"
              aria-checked=${String(s)}
              aria-label=${e("cards.night.skip")}
              @click=${() => this.skip(!s)}
            ></button>
          </div>` : r}`;
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
	renderCard(e, t) {
		let n = this.car(t);
		if (!n) return l`<p class="muted">${e("cards.car.none")}</p>`;
		let i = this.hass, a = n.need, o = t.control?.actions?.[n.id], c = [a.soc_entity ? s(i, a.soc_entity, e.lang) : null, a.range_entity ? s(i, a.range_entity, e.lang) : null].filter(Boolean);
		return l`<div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:car-electric"></ha-icon>${n.name}</div>
        ${o?.on ? l`<span class="chip ok">${e("cards.car.charging")}</span>` : r}
      </div>
      ${c.length ? l`<p class="big">${c.join(" · ")}</p>` : r}
      <joe-car-charge .hass=${i} .t=${e} .state=${t} .action=${n}></joe-car-charge>`;
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
