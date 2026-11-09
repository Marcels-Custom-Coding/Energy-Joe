import { At as e, H as t, J as n, Mt as r, Nt as i, Sn as a, Tn as o, _n as s, an as c, at as l, bn as u, dn as d, dt as f, et as p, hn as m, i as h, jt as g, n as _, nt as v, on as y, r as b, rt as x, sn as S, t as C, tn as w, vn as T, yn as E } from "./tokens-DNxhEkeU.js";
//#region src/energy-joe-cards.ts
var D = {
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
}, O = class extends E {
	constructor(...e) {
		super(...e), this.config = {};
	}
	static {
		this.styles = [
			C,
			y,
			o`
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
		this.stop = D.listen(this._hass, (e) => this.joe = e);
	}
	get t() {
		return m(this._hass?.language);
	}
	render() {
		let e = this.t;
		return this._hass ? this.joe ? a`<ha-card>${this.renderCard(e, this.joe)}</ha-card>` : a`<ha-card><p class="muted">${e(D.failed ? "cards.no_access" : "cards.loading")}</p></ha-card>` : u;
	}
};
c([s()], O.prototype, "joe", void 0), c([s()], O.prototype, "config", void 0), c([T({ attribute: !1 })], O.prototype, "hass", null);
var k = class extends O {
	static getStubConfig() {
		return {};
	}
	renderCard(e, r) {
		let i = r.plan, o = r.control, s = i?.window?.start, c = !!s && o?.skip === s, m = o?.reason, h = m === "waiting" && i?.window ? e("devices.status.waiting", { time: f(i.window.start) }) : m === "day" ? p(e, i) : m ? e.optional(`devices.status.${m}`) ?? "" : "", g = n(t, { tab: "plan" });
		return a`<a
        class="head"
        href=${g}
        @click=${(e) => {
			e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0 || (e.preventDefault(), d(g));
		}}
      >
        <div class="eyebrow"><ha-icon icon="energy-joe:joe"></ha-icon>${e("cards.night.title")}</div>
        <span class="chip ${r.mode === "live" ? "ok" : r.mode === "advisory" ? "learned" : ""}">${e(`mode.${r.mode}`)}</span>
        <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
      </a>
      ${i ? a`<p class="big">${l(e, i)}</p>
            <ul class="lines">
              ${x(e, i).map((e) => a`<li>${e}</li>`)}
              ${v(e, i) ? a`<li>${v(e, i)}</li>` : u}
            </ul>` : a`<p class="big">${e("devices.status.no_plan")}</p>`}
      ${h ? a`<p class="muted">${h}</p>` : u}
      ${s && r.mode !== "simulation" && r.mode !== "off" ? a`<div class="row">
            <span>${e("cards.night.skip")}</span>
            <button
              type="button"
              class="switch"
              role="switch"
              aria-checked=${String(c)}
              aria-label=${e("cards.night.skip")}
              @click=${() => this.skip(!c)}
            ></button>
          </div>` : u}`;
	}
	async skip(e) {
		try {
			await this.hass?.callWS({
				type: "energy_joe/control/skip",
				skip: e
			});
		} catch {}
	}
}, A = class extends O {
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
		return n.length ? a`${n.map((n, r) => this.renderCar(e, t, n, r > 0))}` : a`<p class="muted">${e("cards.car.none")}</p>`;
	}
	renderCar(o, s, c, l) {
		let f = this.hass, p = g(s, c.id), m = p ? s.control?.actions?.[p.id] : void 0, h = ["soc", "range"].map((e) => i(s, c.id, e)?.entity).map((e) => e ? w(f, e, o.lang) : null).filter(Boolean), _ = n(t, r(c.id));
		return a`<div class=${l ? "next-car" : ""}>
      <a
        class="head"
        href=${_}
        @click=${(e) => {
			e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0 || (e.preventDefault(), d(_));
		}}
      >
        <div class="eyebrow"><ha-icon icon="mdi:car-electric"></ha-icon>${c.name}</div>
        ${m?.on ? a`<span class="chip ok">${o("cards.car.charging")}</span>` : u}
        <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
      </a>
      ${h.length ? a`<p class="big">${h.join(" · ")}</p>` : u}
      <p class="muted where">${e(o, s, c)}</p>
      <joe-car-charge .hass=${f} .t=${o} .state=${s} .car=${c}></joe-car-charge>
    </div>`;
	}
}, j = class extends O {
	static getStubConfig() {
		return { limit: 8 };
	}
	getCardSize() {
		return 6;
	}
	willUpdate(e) {
		super.willUpdate(e);
		let t = this.joe ? b(this.joe) : void 0;
		t !== void 0 && t !== this.marker && (this.marker = t, _(this.hass).then((e) => {
			this.full = e;
		}));
	}
	renderCard(e, r) {
		let i = Math.max(1, Math.min(50, Number(this.config.limit) || 8)), o = n(t, {
			tab: "review",
			section: "steer"
		});
		return a`<a
        class="head"
        href=${o}
        @click=${(e) => {
			e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0 || (e.preventDefault(), d(o));
		}}
      >
        <div class="eyebrow"><ha-icon icon="mdi:robot-outline"></ha-icon>${e("steer.card.title")}</div>
        <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
      </a>
      <joe-steer-now .t=${e} .state=${r}></joe-steer-now>
      <div class="next-car">
        <div class="eyebrow">${e("steer.history")}</div>
        <joe-steer-list
          compact
          .t=${e}
          .hass=${this.hass}
          .config=${r.config}
          .entries=${this.full ?? h(r)}
          .limit=${i}
        ></joe-steer-list>
      </div>`;
	}
};
c([s()], j.prototype, "full", void 0), S("energy-joe-night-card", k), S("energy-joe-car-card", A), S("energy-joe-steuerung-card", j);
var M = window.customCards ??= [];
for (let e of [
	{
		type: "energy-joe-night-card",
		name: "Energy Joe – heute Nacht",
		description: "Was Joe heute Nacht vorhat, was es kostet, und Aussetzen."
	},
	{
		type: "energy-joe-car-card",
		name: "Energy Joe – Auto laden",
		description: "Ladestand und Reichweite, jetzt oder heute Nacht laden."
	},
	{
		type: "energy-joe-steuerung-card",
		name: "Energy Joe – Steuerung",
		description: "Was Joe gerade hält oder abwartet und was er zuletzt gesteuert hat – jeweils mit dem Grund."
	}
]) M.some((t) => t.type === e.type) || M.push({
	...e,
	preview: !0
});
//#endregion
