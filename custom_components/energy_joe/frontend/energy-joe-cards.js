import { A as e, B as t, E as n, G as r, H as i, I as a, M as o, U as s, W as c, X as l, c as u, g as d, j as f, m as p, p as m, q as h, r as g, t as _, v } from "./tokens-DYPyeBX9.js";
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
}, b = class extends c {
	constructor(...e) {
		super(...e), this.config = {};
	}
	static {
		this.styles = [
			_,
			f,
			l`
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
		return this._hass ? this.joe ? h`<ha-card>${this.renderCard(e, this.joe)}</ha-card>` : h`<ha-card><p class="muted">${e(y.failed ? "cards.no_access" : "cards.loading")}</p></ha-card>` : r;
	}
};
e([i()], b.prototype, "joe", void 0), e([i()], b.prototype, "config", void 0), e([s({ attribute: !1 })], b.prototype, "hass", null);
var x = class extends b {
	static getStubConfig() {
		return {};
	}
	renderCard(e, t) {
		let n = t.plan, i = t.control, o = n?.window?.start, s = !!o && i?.skip === o, c = i?.reason, l = c === "waiting" && n?.window ? e("devices.status.waiting", { time: v(n.window.start) }) : c === "day" ? e("devices.status.day", { time: n?.day ? v(n.day.defer_until) : "–" }) : c ? e.optional(`devices.status.${c}`) ?? "" : "", f = u(g, { tab: "plan" });
		return h`<a
        class="head"
        href=${f}
        @click=${(e) => {
			e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0 || (e.preventDefault(), a(f));
		}}
      >
        <div class="eyebrow"><ha-icon icon="energy-joe:joe"></ha-icon>${e("cards.night.title")}</div>
        <span class="chip ${t.mode === "live" ? "ok" : t.mode === "advisory" ? "learned" : ""}">${e(`mode.${t.mode}`)}</span>
        <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
      </a>
      ${n ? h`<p class="big">${d(e, n)}</p>
            <ul class="lines">
              ${p(e, n).map((e) => h`<li>${e}</li>`)}
              ${m(e, n) ? h`<li>${m(e, n)}</li>` : r}
            </ul>` : h`<p class="big">${e("devices.status.no_plan")}</p>`}
      ${l ? h`<p class="muted">${l}</p>` : r}
      ${o && t.mode !== "simulation" && t.mode !== "off" ? h`<div class="row">
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
		let i = this.car(t);
		if (!i) return h`<p class="muted">${e("cards.car.none")}</p>`;
		let a = this.hass, o = i.need, s = t.control?.actions?.[i.id], c = [o.soc_entity ? n(a, o.soc_entity, e.lang) : null, o.range_entity ? n(a, o.range_entity, e.lang) : null].filter(Boolean);
		return h`<div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:car-electric"></ha-icon>${i.name}</div>
        ${s?.on ? h`<span class="chip ok">${e("cards.car.charging")}</span>` : r}
      </div>
      ${c.length ? h`<p class="big">${c.join(" · ")}</p>` : r}
      <joe-car-charge .hass=${a} .t=${e} .state=${t} .action=${i}></joe-car-charge>`;
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
