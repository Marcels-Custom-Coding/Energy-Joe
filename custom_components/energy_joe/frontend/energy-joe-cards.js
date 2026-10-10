import { G as e, H as t, K as n, M as r, N as i, O as a, P as o, Q as s, R as c, W as l, Y as u, b as d, g as f, h as p, l as m, q as h, r as g, t as _, v } from "./tokens-CotQAMHm.js";
//#region src/energy-joe-cards.ts
var y = {
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
}, b = class extends n {
	constructor(...e) {
		super(...e), this.config = {};
	}
	static {
		this.styles = [
			_,
			i,
			s`
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
      a.head {
        min-height: 44px;
        margin: -8px -8px 0;
        padding: 0 8px;
        border-radius: 10px;
        color: inherit;
        text-decoration: none;
      }
      a.head:hover {
        background: var(--joe-surface-2);
      }
      .head .chev {
        color: var(--joe-muted);
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
		this.stop = y.listen(this._hass, (e) => this.joe = e);
	}
	get t() {
		return t(this._hass?.language);
	}
	render() {
		let e = this.t;
		return this._hass ? this.joe ? u`<ha-card>${this.renderCard(e, this.joe)}</ha-card>` : u`<ha-card><p class="muted">${e(y.failed ? "cards.no_access" : "cards.loading")}</p></ha-card>` : h;
	}
};
r([l()], b.prototype, "joe", void 0), r([l()], b.prototype, "config", void 0), r([e({ attribute: !1 })], b.prototype, "hass", null);
var x = class extends b {
	static getStubConfig() {
		return {};
	}
	renderCard(e, t) {
		let n = t.plan, r = t.control, i = n?.window?.start, a = !!i && r?.skip === i, o = r?.reason, s = o === "waiting" && n?.window ? e("devices.status.waiting", { time: d(n.window.start) }) : o === "day" ? e("devices.status.day", { time: n?.day ? d(n.day.defer_until) : "–" }) : o ? e.optional(`devices.status.${o}`) ?? "" : "", l = m(g, { tab: "plan" });
		return u`<a
        class="head"
        href=${l}
        @click=${(e) => {
			e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0 || (e.preventDefault(), c(l));
		}}
      >
        <div class="eyebrow"><ha-icon icon="energy-joe:joe"></ha-icon>${e("cards.night.title")}</div>
        <span class="chip ${t.mode === "live" ? "ok" : t.mode === "advisory" ? "learned" : ""}">${e(`mode.${t.mode}`)}</span>
        <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
      </a>
      ${n ? u`<p class="big">${v(e, n)}</p>
            <ul class="lines">
              ${f(e, n).map((e) => u`<li>${e}</li>`)}
              ${p(e, n) ? u`<li>${p(e, n)}</li>` : h}
            </ul>` : u`<p class="big">${e("devices.status.no_plan")}</p>`}
      ${s ? u`<p class="muted">${s}</p>` : h}
      ${i && t.mode !== "simulation" && t.mode !== "off" ? u`<div class="row">
            <span>${e("cards.night.skip")}</span>
            <button
              type="button"
              class="switch"
              role="switch"
              aria-checked=${String(a)}
              aria-label=${e("cards.night.skip")}
              @click=${() => this.skip(!a)}
            ></button>
          </div>` : h}`;
	}
	async skip(e) {
		try {
			await this.hass?.callWS({
				type: "energy_joe/control/skip",
				skip: e
			});
		} catch {}
	}
}, S = class extends b {
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
		if (!n) return u`<p class="muted">${e("cards.car.none")}</p>`;
		let r = this.hass, i = n.need, o = t.control?.actions?.[n.id], s = [i.soc_entity ? a(r, i.soc_entity, e.lang) : null, i.range_entity ? a(r, i.range_entity, e.lang) : null].filter(Boolean), l = m(g, {
			tab: "devices",
			section: "car",
			id: n.id
		});
		return u`<a
        class="head"
        href=${l}
        @click=${(e) => {
			e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0 || (e.preventDefault(), c(l));
		}}
      >
        <div class="eyebrow"><ha-icon icon="mdi:car-electric"></ha-icon>${n.name}</div>
        ${o?.on ? u`<span class="chip ok">${e("cards.car.charging")}</span>` : h}
        <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
      </a>
      ${s.length ? u`<p class="big">${s.join(" · ")}</p>` : h}
      <joe-car-charge .hass=${r} .t=${e} .state=${t} .action=${n}></joe-car-charge>`;
	}
};
o("energy-joe-night-card", x), o("energy-joe-car-card", S);
var C = window.customCards ??= [];
for (let e of [{
	type: "energy-joe-night-card",
	name: "Energy Joe – heute Nacht",
	description: "Was Joe heute Nacht vorhat, was es kostet, und Aussetzen."
}, {
	type: "energy-joe-car-card",
	name: "Energy Joe – Auto laden",
	description: "Ladestand und Reichweite, jetzt oder heute Nacht laden."
}]) C.some((t) => t.type === e.type) || C.push({
	...e,
	preview: !0
});
//#endregion
