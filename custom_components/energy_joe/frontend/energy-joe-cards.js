import { A as e, D as t, H as n, J as r, K as i, O as a, Q as o, _ as s, at as c, ft as l, g as u, h as d, it as f, k as p, l as m, lt as h, nt as g, ot as _, q as v, r as y, st as b, t as x, x as S, y as C } from "./tokens-C7dXi-q3.js";
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
}, T = class extends _ {
	constructor(...e) {
		super(...e), this.config = {};
	}
	static {
		this.styles = [
			x,
			v,
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
		return g(this._hass?.language);
	}
	render() {
		let e = this.t;
		return this._hass ? this.joe ? h`<ha-card>${this.renderCard(e, this.joe)}</ha-card>` : h`<ha-card><p class="muted">${e(w.failed ? "cards.no_access" : "cards.loading")}</p></ha-card>` : b;
	}
};
i([f()], T.prototype, "joe", void 0), i([f()], T.prototype, "config", void 0), i([c({ attribute: !1 })], T.prototype, "hass", null);
var E = class extends T {
	static getStubConfig() {
		return {};
	}
	renderCard(e, t) {
		let n = t.plan, r = t.control, i = n?.window?.start, a = !!i && r?.skip === i, c = r?.reason, l = c === "waiting" && n?.window ? e("devices.status.waiting", { time: S(n.window.start) }) : c === "day" ? d(e, n) : c ? e.optional(`devices.status.${c}`) ?? "" : "", f = m(y, { tab: "plan" });
		return h`<a
        class="head"
        href=${f}
        @click=${(e) => {
			e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0 || (e.preventDefault(), o(f));
		}}
      >
        <div class="eyebrow"><ha-icon icon="energy-joe:joe"></ha-icon>${e("cards.night.title")}</div>
        <span class="chip ${t.mode === "live" ? "ok" : t.mode === "advisory" ? "learned" : ""}">${e(`mode.${t.mode}`)}</span>
        <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
      </a>
      ${n ? h`<p class="big">${C(e, n)}</p>
            <ul class="lines">
              ${s(e, n).map((e) => h`<li>${e}</li>`)}
              ${u(e, n) ? h`<li>${u(e, n)}</li>` : b}
            </ul>` : h`<p class="big">${e("devices.status.no_plan")}</p>`}
      ${l ? h`<p class="muted">${l}</p>` : b}
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
          </div>` : b}`;
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
		return n.length ? h`${n.map((n, r) => this.renderCar(e, t, n, r > 0))}` : h`<p class="muted">${e("cards.car.none")}</p>`;
	}
	renderCar(r, i, s, c) {
		let l = this.hass, u = a(i, s.id), d = u ? i.control?.actions?.[u.id] : void 0, f = ["soc", "range"].map((t) => e(i, s.id, t)?.entity).map((e) => e ? n(l, e, r.lang) : null).filter(Boolean), g = m(y, p(s.id));
		return h`<div class=${c ? "next-car" : ""}>
      <a
        class="head"
        href=${g}
        @click=${(e) => {
			e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0 || (e.preventDefault(), o(g));
		}}
      >
        <div class="eyebrow"><ha-icon icon="mdi:car-electric"></ha-icon>${s.name}</div>
        ${d?.on ? h`<span class="chip ok">${r("cards.car.charging")}</span>` : b}
        <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
      </a>
      ${f.length ? h`<p class="big">${f.join(" · ")}</p>` : b}
      <p class="muted where">${t(r, i, s)}</p>
      <joe-car-charge .hass=${l} .t=${r} .state=${i} .car=${s}></joe-car-charge>
    </div>`;
	}
};
r("energy-joe-night-card", E), r("energy-joe-car-card", D);
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
