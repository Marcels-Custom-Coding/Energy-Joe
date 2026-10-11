import { $ as e, D as t, E as n, G as r, T as i, U as a, W as o, Y as s, b as c, g as l, h as u, it as d, l as f, lt as p, nt as m, ot as h, r as g, rt as _, t as v, tt as y, v as b, w as x, z as S } from "./tokens-Bw6pdXgf.js";
//#region src/energy-joe-cards.ts
var C = {
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
}, w = class extends _ {
	constructor(...e) {
		super(...e), this.config = {};
	}
	static {
		this.styles = [
			v,
			o,
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
		this.stop = C.listen(this._hass, (e) => this.joe = e);
	}
	get t() {
		return e(this._hass?.language);
	}
	render() {
		let e = this.t;
		return this._hass ? this.joe ? h`<ha-card>${this.renderCard(e, this.joe)}</ha-card>` : h`<ha-card><p class="muted">${e(C.failed ? "cards.no_access" : "cards.loading")}</p></ha-card>` : d;
	}
};
a([y()], w.prototype, "joe", void 0), a([y()], w.prototype, "config", void 0), a([m({ attribute: !1 })], w.prototype, "hass", null);
var T = class extends w {
	static getStubConfig() {
		return {};
	}
	renderCard(e, t) {
		let n = t.plan, r = t.control, i = n?.window?.start, a = !!i && r?.skip === i, o = r?.reason, p = o === "waiting" && n?.window ? e("devices.status.waiting", { time: c(n.window.start) }) : o === "day" ? e("devices.status.day", { time: n?.day ? c(n.day.defer_until) : "–" }) : o ? e.optional(`devices.status.${o}`) ?? "" : "", m = f(g, { tab: "plan" });
		return h`<a
        class="head"
        href=${m}
        @click=${(e) => {
			e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0 || (e.preventDefault(), s(m));
		}}
      >
        <div class="eyebrow"><ha-icon icon="energy-joe:joe"></ha-icon>${e("cards.night.title")}</div>
        <span class="chip ${t.mode === "live" ? "ok" : t.mode === "advisory" ? "learned" : ""}">${e(`mode.${t.mode}`)}</span>
        <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
      </a>
      ${n ? h`<p class="big">${b(e, n)}</p>
            <ul class="lines">
              ${l(e, n).map((e) => h`<li>${e}</li>`)}
              ${u(e, n) ? h`<li>${u(e, n)}</li>` : d}
            </ul>` : h`<p class="big">${e("devices.status.no_plan")}</p>`}
      ${p ? h`<p class="muted">${p}</p>` : d}
      ${i && t.mode !== "simulation" && t.mode !== "off" ? h`<div class="row">
            <span>${e("cards.night.skip")}</span>
            <button
              type="button"
              class="switch"
              role="switch"
              aria-checked=${String(a)}
              aria-label=${e("cards.night.skip")}
              @click=${() => this.skip(!a)}
            ></button>
          </div>` : d}`;
	}
	async skip(e) {
		try {
			await this.hass?.callWS({
				type: "energy_joe/control/skip",
				skip: e
			});
		} catch {}
	}
}, E = class extends w {
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
		return n.length ? h`${n.map((n, r) => this.renderCar(e, t, n, r > 0))}` : h`<p class="muted">${e("cards.car.none")}</p>`;
	}
	renderCar(e, r, a, o) {
		let c = this.hass, l = i(r, a.id), u = l ? r.control?.actions?.[l.id] : void 0, p = ["soc", "range"].map((e) => t(r, a.id, e)?.entity).map((t) => t ? S(c, t, e.lang) : null).filter(Boolean), m = f(g, n(a.id));
		return h`<div class=${o ? "next-car" : ""}>
      <a
        class="head"
        href=${m}
        @click=${(e) => {
			e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0 || (e.preventDefault(), s(m));
		}}
      >
        <div class="eyebrow"><ha-icon icon="mdi:car-electric"></ha-icon>${a.name}</div>
        ${u?.on ? h`<span class="chip ok">${e("cards.car.charging")}</span>` : d}
        <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
      </a>
      ${p.length ? h`<p class="big">${p.join(" · ")}</p>` : d}
      <p class="muted where">${x(e, r, a)}</p>
      <joe-car-charge .hass=${c} .t=${e} .state=${r} .car=${a}></joe-car-charge>
    </div>`;
	}
};
r("energy-joe-night-card", T), r("energy-joe-car-card", E);
var D = window.customCards ??= [];
for (let e of [{
	type: "energy-joe-night-card",
	name: "Energy Joe – heute Nacht",
	description: "Was Joe heute Nacht vorhat, was es kostet, und Aussetzen."
}, {
	type: "energy-joe-car-card",
	name: "Energy Joe – Auto laden",
	description: "Ladestand und Reichweite, jetzt oder heute Nacht laden."
}]) D.some((t) => t.type === e.type) || D.push({
	...e,
	preview: !0
});
//#endregion
