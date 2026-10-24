import { A as e, G as t, M as n, N as r, X as i, Y as a, Z as o, _ as s, at as c, ct as l, ft as u, g as d, h as f, ht as p, j as m, l as h, lt as g, r as _, st as v, t as y, tt as b, ut as x, w as S, y as C } from "./tokens-DVH1-Mr8.js";
//#region src/energy-joe-cards.ts
var w = {
	state: void 0,
	listeners: /* @__PURE__ */ new Set(),
	unsubscribe: void 0,
	hass: void 0,
	failed: !1,
	listen(e, t) {
		return this.listeners.add(t), this.state && t(this.state), (!this.unsubscribe || this.hass?.connection !== e.connection) && (this.hass = e, this.unsubscribe = e.connection.subscribeMessage((e) => {
			this.state = e, this.failed = !1;
			for (let t of this.listeners) t(e);
		}, {
			type: "energy_joe/subscribe",
			language: e.language
		}).catch((e) => {
			throw this.failed = !0, this.unsubscribe = void 0, e;
		}), this.unsubscribe.catch(() => void 0)), () => {
			this.listeners.delete(t), !this.listeners.size && this.unsubscribe && (this.unsubscribe.then((e) => e()).catch(() => void 0), this.unsubscribe = void 0, this.state = void 0);
		};
	}
}, T = class extends g {
	constructor(...e) {
		super(...e), this.config = {};
	}
	static {
		this.styles = [
			y,
			i,
			p`
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
      .muted.where {
        margin: 0;
      }
      .next-car {
        margin-top: 14px;
        padding-top: 10px;
        border-top: 1px solid var(--joe-line);
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
		this.stop = w.listen(this._hass, (e) => this.joe = e);
	}
	get t() {
		return c(this._hass?.language);
	}
	render() {
		let e = this.t;
		return this._hass ? this.joe ? u`<ha-card>${this.renderCard(e, this.joe)}</ha-card>` : u`<ha-card><p class="muted">${e(w.failed ? "cards.no_access" : "cards.loading")}</p></ha-card>` : x;
	}
};
a([v()], T.prototype, "joe", void 0), a([v()], T.prototype, "config", void 0), a([l({ attribute: !1 })], T.prototype, "hass", null);
var E = class extends T {
	static getStubConfig() {
		return {};
	}
	renderCard(e, t) {
		let n = t.plan, r = t.control, i = n?.window?.start, a = !!i && r?.skip === i, o = r?.reason, c = o === "waiting" && n?.window ? e("devices.status.waiting", { time: S(n.window.start) }) : o === "day" ? f(e, n) : o ? e.optional(`devices.status.${o}`) ?? "" : "", l = h(_, { tab: "plan" });
		return u`<a
        class="head"
        href=${l}
        @click=${(e) => {
			e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0 || (e.preventDefault(), b(l));
		}}
      >
        <div class="eyebrow"><ha-icon icon="energy-joe:joe"></ha-icon>${e("cards.night.title")}</div>
        <span class="chip ${t.mode === "live" ? "ok" : t.mode === "advisory" ? "learned" : ""}">${e(`mode.${t.mode}`)}</span>
        <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
      </a>
      ${n ? u`<p class="big">${C(e, n)}</p>
            <ul class="lines">
              ${s(e, n).map((e) => u`<li>${e}</li>`)}
              ${d(e, n) ? u`<li>${d(e, n)}</li>` : x}
            </ul>` : u`<p class="big">${e("devices.status.no_plan")}</p>`}
      ${c ? u`<p class="muted">${c}</p>` : x}
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
          </div>` : x}`;
	}
	async skip(e) {
		try {
			await this.hass?.callWS({
				type: "energy_joe/control/skip",
				skip: e
			});
		} catch {}
	}
}, D = class extends T {
	static getStubConfig() {
		return {};
	}
	getCardSize() {
		return 4;
	}
	cars(e) {
		let t = e.config.cars ?? [], n = typeof this.config.car == "string" ? this.config.car : typeof this.config.action == "string" ? this.config.action : void 0, r = t.find((e) => e.id === n);
		return r ? [r] : t;
	}
	renderCard(e, t) {
		let n = this.cars(t);
		return n.length ? u`${n.map((n, r) => this.renderCar(e, t, n, r > 0))}` : u`<p class="muted">${e("cards.car.none")}</p>`;
	}
	renderCar(i, a, o, s) {
		let c = this.hass, l = m(a, o.id), d = l ? a.control?.actions?.[l.id] : void 0, f = ["soc", "range"].map((e) => r(a, o.id, e)?.entity).map((e) => e ? t(c, e, i.lang) : null).filter(Boolean), p = h(_, n(o.id));
		return u`<div class=${s ? "next-car" : ""}>
      <a
        class="head"
        href=${p}
        @click=${(e) => {
			e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0 || (e.preventDefault(), b(p));
		}}
      >
        <div class="eyebrow"><ha-icon icon="mdi:car-electric"></ha-icon>${o.name}</div>
        ${d?.on ? u`<span class="chip ok">${i("cards.car.charging")}</span>` : x}
        <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
      </a>
      ${f.length ? u`<p class="big">${f.join(" · ")}</p>` : x}
      <p class="muted where">${e(i, a, o)}</p>
      <joe-car-charge .hass=${c} .t=${i} .state=${a} .car=${o}></joe-car-charge>
    </div>`;
	}
};
o("energy-joe-night-card", E), o("energy-joe-car-card", D);
var O = window.customCards ??= [];
for (let e of [{
	type: "energy-joe-night-card",
	name: "Energy Joe – heute Nacht",
	description: "Was Joe heute Nacht vorhat, was es kostet, und Aussetzen."
}, {
	type: "energy-joe-car-card",
	name: "Energy Joe – Auto laden",
	description: "Ladestand und Reichweite, jetzt oder heute Nacht laden."
}]) O.some((t) => t.type === e.type) || O.push({
	...e,
	preview: !0
});
//#endregion
