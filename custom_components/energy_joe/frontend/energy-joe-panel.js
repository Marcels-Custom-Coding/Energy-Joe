import { $ as e, A as t, B as n, C as r, D as i, E as a, F as o, G as s, H as c, I as l, J as u, K as d, L as f, M as p, N as m, O as h, P as g, Q as ee, R as _, S as te, T as ne, U as re, V as v, W as ie, X as ae, Y as oe, Z as y, _ as se, a as ce, at as b, b as le, c as ue, ct as de, d as x, dt as fe, et as S, f as C, ft as w, g as pe, h as me, i as he, it as T, j as ge, k as _e, l as E, lt as D, m as ve, n as ye, nt as be, o as xe, ot as O, p as Se, q as k, r as A, rt as Ce, s as we, st as j, t as Te, tt as M, u as Ee, ut as De, v as Oe, w as ke, x as N, y as Ae, z as je } from "./tokens-DgO_Tycl.js";
//#region src/assets.ts
var Me = import.meta.url.replace(/[^/]*$/, ""), Ne = (e) => `${Me}${e}`, Pe = /* @__PURE__ */ new Set(["welcome"]), Fe = /* @__PURE__ */ new Set([
	"night-charge",
	"sleep",
	"learn"
]), Ie = "thumbs", Le = class extends O {
	constructor(...e) {
		super(...e), this.name = "", this.alt = "";
	}
	static {
		this.styles = w`
    :host {
      display: block;
    }
    img {
      display: block;
      width: 100%;
      height: auto;
    }
    img.scene {
      border-radius: 16px;
      box-shadow: var(--joe-shadow);
    }
    .light {
      display: var(--joe-show-light, block);
    }
    .dark {
      display: var(--joe-show-dark, none);
    }
  `;
	}
	render() {
		let e = Fe.has(this.name) ? "scene" : "";
		if (this.name === Ie) return D`<img class="light" src=${Ne("logo.webp")} alt=${this.alt} decoding="async" /><img
          class="dark"
          src=${Ne("logo-dark.webp")}
          alt=${this.alt}
          decoding="async"
        />`;
		let t = Ne(`poses/${this.name}.webp`);
		return Pe.has(this.name) ? D`<img class="light" src=${t} alt=${this.alt} decoding="async" /><img
        class="dark"
        src=${Ne(`poses/${this.name}-dark.webp`)}
        alt=${this.alt}
       
        decoding="async"
      />` : D`<img class=${e} src=${t} alt=${this.alt} decoding="async" />`;
	}
};
d([b()], Le.prototype, "name", void 0), d([b()], Le.prototype, "alt", void 0), u("joe-pose", Le);
//#endregion
//#region src/components/empty-state.ts
var Re = class extends O {
	constructor(...e) {
		super(...e), this.pose = "", this.heading = "", this.text = "", this.note = "";
	}
	static {
		this.styles = [k, w`
      :host {
        display: block;
      }
      .wrap {
        display: grid;
        grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
        gap: 28px;
        align-items: center;
        max-width: 980px;
        margin: 0 auto;
        padding-block: 12px;
      }
      joe-pose {
        max-width: 420px;
        width: 100%;
        justify-self: center;
      }
      .display {
        font-size: clamp(34px, 5vw, 52px);
      }
      .note {
        margin-top: 16px;
      }
      @media (max-width: 760px) {
        .wrap {
          grid-template-columns: 1fr;
          gap: 16px;
        }
        joe-pose {
          max-width: 300px;
        }
      }
    `];
	}
	render() {
		return D`<div class="wrap">
      <joe-pose name=${this.pose}></joe-pose>
      <div>
        ${y(this.heading)} ${M}
        <p class="lead">${this.text}</p>
        ${this.note ? D`<div class="note"><span class="chip soon">${this.note}</span></div>` : j}
        <slot></slot>
      </div>
    </div>`;
	}
};
d([b()], Re.prototype, "pose", void 0), d([b()], Re.prototype, "heading", void 0), d([b()], Re.prototype, "text", void 0), d([b()], Re.prototype, "note", void 0), u("joe-empty-state", Re);
//#endregion
//#region src/components/entity-picker.ts
var ze = 60, Be = class extends O {
	constructor(...e) {
		super(...e), this.selected = [], this.invert = !1, this.query = "", this.showAll = !1, this.limit = ze;
	}
	static {
		this.styles = [k, w`
      :host {
        display: block;
      }
      .search {
        margin-top: 14px;
      }
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 4px;
      }
      .row {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        min-height: 52px;
        padding: 8px 10px;
        border: 0;
        border-radius: 10px;
        cursor: pointer;
        text-align: left;
        background: transparent;
        color: var(--joe-ink);
        transition: background 0.12s;
      }
      .row:hover {
        background: var(--joe-surface-2);
      }
      .row[aria-pressed="true"] {
        background: var(--joe-amber-soft);
        box-shadow: inset 0 0 0 2px var(--joe-amber);
      }
      .mark {
        width: 20px;
        height: 20px;
        flex: none;
        border-radius: 50%;
        box-shadow: inset 0 0 0 2px var(--joe-line-2);
        display: grid;
        place-items: center;
      }
      .mark.box {
        border-radius: 6px;
      }
      [aria-pressed="true"] .mark {
        background: var(--joe-amber);
        box-shadow: none;
        color: var(--joe-amber-ink);
      }
      .mark svg {
        width: 14px;
        height: 14px;
      }
      .txt {
        flex: 1;
        min-width: 0;
      }
      .txt b {
        display: block;
        font-weight: 600;
        line-height: 1.3;
        overflow-wrap: anywhere;
      }
      .txt small {
        display: block;
        font-size: 12.5px;
        color: var(--joe-muted);
        overflow-wrap: anywhere;
      }
      .txt small.why {
        color: var(--joe-amber-text);
      }
      .val {
        max-width: 100%;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        color: var(--joe-ink-2);
        font-size: 14px;
        text-align: right;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .end {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 4px;
        flex: none;
        max-width: 42%;
      }
      .empty {
        color: var(--joe-muted);
        margin: 8px 0;
      }
      .more {
        margin-top: 8px;
      }
      .line {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 14px;
        flex-wrap: wrap;
      }
      .line label {
        font-weight: 600;
        cursor: pointer;
      }
      .preview {
        margin-top: 10px;
      }
      .sticky {
        position: sticky;
        bottom: -22px;
        background: var(--joe-surface);
        padding: 12px 0 2px;
        margin-top: 12px;
        box-shadow: 0 -1px 0 var(--joe-line);
      }
      .sticky .actions {
        margin-top: 0;
      }
      @media (max-width: 600px) {
        .sticky {
          bottom: -20px;
        }
      }
    `];
	}
	willUpdate(e) {
		e.has("request") && this.request && (this.selected = [...this.request.selected], this.invert = this.request.measurement?.invert ?? !1, this.query = "", this.showAll = !1, this.limit = ze);
	}
	render() {
		let { hass: e, t, request: n } = this;
		if (!e || !t || !n) return j;
		let r = this.candidates(e, n), i = r.slice(0, this.limit), a = this.query ? [] : (n.suggestions ?? []).filter((t) => e.states[t.entity_id]);
		return D`<div data-tipped>
      <div class="sheet-title">${y(n.heading, "h2", l(t, n.tip, n.tipVars))}</div>
      <input
        class="input search"
        type="search"
        .value=${this.query}
        placeholder=${t("pick.search")}
        aria-label=${t("pick.search")}
        @input=${(e) => {
			this.query = e.target.value, this.limit = ze;
		}}
      />
      ${a.length ? D`<div class="group-label">${t("pick.suggested")}</div>
            <ul>
              ${a.map((r) => this.renderRow(e, t, n, r.entity_id, r))}
            </ul>` : j}
      <div class="group-label">${t(this.showAll ? "pick.all" : "pick.fitting")} · ${r.length}</div>
      ${r.length ? D`<ul>
            ${i.map((r) => this.renderRow(e, t, n, r))}
          </ul>` : D`<p class="empty">${t("pick.empty")}</p>`}
      ${r.length > i.length ? D`<button type="button" class="mini-btn more" data-notip @click=${() => this.limit += ze}>
            ${t("pick.more", { count: r.length - i.length })}
          </button>` : j}
      <div class="line">
        <button
          type="button"
          id="all"
          class="switch"
          role="switch"
          aria-checked=${String(this.showAll)}
          aria-labelledby="all-label"
          @click=${() => {
			this.showAll = !this.showAll, this.limit = ze;
		}}
        ></button>
        <label id="all-label" for="all">${t("pick.show_all")}</label>
        ${l(t, "pick_all")}
      </div>
      ${n.measurement ? this.renderInvert(e, t, n) : j}
      <div class="sticky">
        <div class="actions">
          <button
            type="button"
            class="btn btn-primary"
            ?disabled=${!n.multiple && !this.selected.length}
            @click=${this.apply}
          >
            ${t("pick.apply")}
          </button>
          <button type="button" class="btn btn-ghost" data-notip @click=${this.cancel}>${t("common.cancel")}</button>
        </div>
      </div>
    </div>`;
	}
	candidates(e, t) {
		let r = this.query.toLowerCase().split(/\s+/).filter(Boolean), i = new Set(t.exclude ?? []), a = [];
		for (let [o, s] of Object.entries(e.states)) {
			if (i.has(o) || !this.showAll && (!n(s, t.filter) || e.entities?.[o]?.hidden)) continue;
			let c = _(e, o);
			if (r.length) {
				let t = `${c} ${o} ${je(e, o)}`.toLowerCase();
				if (!r.every((e) => t.includes(e))) continue;
			}
			a.push({
				id: o,
				name: c
			});
		}
		return a.sort((e, t) => e.name.localeCompare(t.name, this.t?.lang)), a.map((e) => e.id);
	}
	renderRow(t, n, r, i, a) {
		let o = this.selected.includes(i), s = je(t, i), l = a?.reasons?.[0];
		return D`<li>
      <button type="button" class="row" aria-pressed=${String(o)} @click=${() => this.toggle(i)}>
        <span class="mark ${r.multiple ? "box" : ""}" aria-hidden="true">
          ${o ? D`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>` : j}
        </span>
        <span class="txt">
          <b>${_(t, i)}</b>
          <small>${s ? `${s} · ` : ""}${i}</small>
          ${l ? D`<small class="why">${e(n, l)}</small>` : j}
        </span>
        <span class="end">
          <span class="val">${c(t, i, n.lang)}</span>
          ${a?.confidence == null ? j : oe(n, a.confidence)}
        </span>
      </button>
    </li>`;
	}
	renderInvert(e, t, n) {
		let r = n.measurement?.role ?? "grid", i = this.selected[0], a = i ? re(e, {
			entity_id: i,
			invert: this.invert,
			minus_entity_id: null
		}) : null, o = "";
		if (a !== null) {
			let e = v(t.lang, Math.abs(a), 2);
			o = r === "grid" ? t(a >= 0 ? "pick.preview.import" : "pick.preview.export", { value: e }) : r === "battery" ? t(a >= 0 ? "pick.preview.charge" : "pick.preview.discharge", { value: e }) : t(a >= -.05 ? `pick.preview.${r}` : "pick.preview.negative", { value: v(t.lang, a, 2) });
		}
		return D`<div class="line">
        <button
          type="button"
          id="invert"
          class="switch"
          role="switch"
          aria-checked=${String(this.invert)}
          aria-labelledby="invert-label"
          @click=${() => this.invert = !this.invert}
        ></button>
        <label id="invert-label" for="invert">${t("pick.invert")}</label>
        ${l(t, r === "battery" ? "pick_invert_battery" : "pick_invert")}
      </div>
      ${o ? D`<div class="note preview"><ha-icon icon="mdi:eye-outline"></ha-icon><span>${o}</span></div>` : j}`;
	}
	toggle(e) {
		this.selected = this.request?.multiple ? this.selected.includes(e) ? this.selected.filter((t) => t !== e) : [...this.selected, e] : [e];
	}
	apply() {
		let e = {
			selected: this.selected,
			invert: this.invert
		};
		this.dispatchEvent(new CustomEvent("joe-picked", {
			detail: e,
			bubbles: !0,
			composed: !0
		}));
	}
	cancel() {
		this.dispatchEvent(new CustomEvent("joe-close", {
			bubbles: !0,
			composed: !0
		}));
	}
};
d([b({ attribute: !1 })], Be.prototype, "hass", void 0), d([b({ attribute: !1 })], Be.prototype, "t", void 0), d([b({ attribute: !1 })], Be.prototype, "request", void 0), d([T()], Be.prototype, "selected", void 0), d([T()], Be.prototype, "invert", void 0), d([T()], Be.prototype, "query", void 0), d([T()], Be.prototype, "showAll", void 0), d([T()], Be.prototype, "limit", void 0), u("joe-entity-picker", Be);
//#endregion
//#region src/components/sheet.ts
var Ve = class extends O {
	constructor(...e) {
		super(...e), this.label = "", this.closeLabel = "", this.wide = !1, this.onScrim = (e) => {
			e.composedPath()[0] === this && this.close();
		};
	}
	static {
		this.styles = w`
    :host {
      position: fixed;
      inset: 0;
      z-index: 20;
      display: grid;
      place-items: center;
      padding: 16px;
      box-sizing: border-box;
      background: rgba(7, 17, 24, 0.55);
      animation: fade 0.12s ease-out;
    }
    .panel {
      position: relative;
      box-sizing: border-box;
      width: min(600px, 100%);
      max-height: 100%;
      overflow-y: auto;
      overscroll-behavior: contain;
      background: var(--joe-surface);
      color: var(--joe-ink);
      border-radius: 18px;
      padding: 22px;
      box-shadow: var(--joe-shadow);
      outline: none;
      animation: rise 0.16s ease-out;
    }
    :host([wide]) .panel {
      width: min(780px, 100%);
    }
    .close {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 36px;
      height: 36px;
      border: 0;
      border-radius: 50%;
      display: grid;
      place-items: center;
      cursor: pointer;
      background: var(--joe-surface-2);
      color: var(--joe-ink-2);
      transition: background 0.12s, transform 0.12s;
    }
    .close:hover {
      background: var(--joe-line);
      color: var(--joe-ink);
    }
    .close:active {
      transform: scale(0.94);
    }
    .close:focus-visible {
      outline: 3px solid var(--joe-amber);
      outline-offset: 2px;
    }
    .close svg {
      width: 18px;
      height: 18px;
    }
    /* A finger needs 44 px; the corner keeps its place. */
    @media (pointer: coarse) {
      .close {
        top: 8px;
        right: 8px;
        width: 44px;
        height: 44px;
      }
    }
    @keyframes fade {
      from {
        opacity: 0;
      }
    }
    @keyframes rise {
      from {
        translate: 0 12px;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      :host,
      .panel {
        animation: none;
      }
    }
    @media (max-width: 600px) {
      :host {
        place-items: end stretch;
        padding: 0;
      }
      .panel,
      :host([wide]) .panel {
        width: 100%;
        max-height: 92%;
        border-radius: 18px 18px 0 0;
        padding: 20px 16px calc(20px + env(safe-area-inset-bottom));
      }
    }
  `;
	}
	connectedCallback() {
		super.connectedCallback(), this.addEventListener("click", this.onScrim);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.removeEventListener("click", this.onScrim);
	}
	firstUpdated() {
		this.panel?.focus();
	}
	render() {
		return D`<div
      class="panel"
      role="dialog"
      aria-modal="true"
      aria-label=${this.label}
      tabindex="-1"
      @keydown=${this.onKey}
    >
      <button type="button" class="close" data-notip aria-label=${this.closeLabel} @click=${this.close}>
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
      <slot></slot>
    </div>`;
	}
	onKey(e) {
		e.key === "Escape" && (e.stopPropagation(), this.close());
	}
	close() {
		this.dispatchEvent(new CustomEvent("joe-close", {
			bubbles: !0,
			composed: !0
		}));
	}
};
d([b()], Ve.prototype, "label", void 0), d([b()], Ve.prototype, "closeLabel", void 0), d([b({
	type: Boolean,
	reflect: !0
})], Ve.prototype, "wide", void 0), d([Ce(".panel")], Ve.prototype, "panel", void 0), u("joe-sheet", Ve);
//#endregion
//#region src/components/sim-switch.ts
var He = {
	simulation: "mdi:pause",
	advisory: "mdi:comment-question-outline",
	live: "mdi:play",
	off: "mdi:power"
}, Ue = class extends O {
	constructor(...e) {
		super(...e), this.mode = "simulation", this.compact = !1, this.running = !1;
	}
	static {
		this.styles = w`
    button {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      border: 0;
      cursor: pointer;
      padding: 6px 18px 6px 6px;
      border-radius: 999px;
      min-height: 52px;
      font: inherit;
      text-align: left;
      color: #071118;
      background: repeating-linear-gradient(
        -45deg,
        var(--joe-stripe-a) 0 12px,
        var(--joe-stripe-b) 12px 24px
      );
      box-shadow: inset 0 0 0 2px #071118;
      transition: transform 0.12s, filter 0.12s;
    }
    button.simulation.running {
      animation: joe-stripes 1.6s linear infinite;
    }
    /* One stripe pair across: 24px along the -45° gradient is 24·√2 wide. */
    @keyframes joe-stripes {
      to {
        background-position: 33.94px 0;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      button.simulation.running {
        animation: none;
      }
    }
    button:hover {
      filter: brightness(1.05);
    }
    button:active {
      transform: scale(0.98);
    }
    button:focus-visible {
      outline: 3px solid var(--joe-amber);
      outline-offset: 3px;
    }
    button.live {
      background: var(--joe-good);
      color: #ffffff;
      box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.15);
    }
    button.advisory {
      background: var(--joe-amber);
      color: var(--joe-amber-ink);
      box-shadow: inset 0 0 0 2px #071118;
    }
    button.off {
      background: var(--joe-surface-2);
      color: var(--joe-ink-2);
      box-shadow: inset 0 0 0 2px var(--joe-line-2);
    }
    .knob {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      flex: none;
      background: #071118;
      color: #fea707;
    }
    .live .knob {
      background: #ffffff;
      color: var(--joe-good);
    }
    .off .knob {
      background: var(--joe-ink-2);
      color: var(--joe-surface);
    }
    ha-icon {
      --mdc-icon-size: 20px;
    }
    b {
      display: block;
      font-family: var(--joe-display);
      font-style: italic;
      font-weight: 800;
      font-size: 20px;
      letter-spacing: 0.03em;
      line-height: 1;
      text-transform: uppercase;
    }
    small {
      display: block;
      font-size: 12px;
      font-weight: 600;
      line-height: 1.2;
      margin-top: 2px;
    }
    :host([compact]) button {
      min-height: 44px;
      padding: 4px 14px 4px 4px;
      gap: 10px;
    }
    :host([compact]) .knob {
      width: 34px;
      height: 34px;
    }
    :host([compact]) b {
      font-size: 17px;
    }
  `;
	}
	render() {
		let e = this.t;
		return e ? D`<button
      type="button"
      class="${this.mode}${this.running ? " running" : ""}"
      aria-label=${e("mode.switch.label")}
      @click=${this.toggle}
    >
      <span class="knob"><ha-icon icon=${He[this.mode]}></ha-icon></span>
      <span>
        <b>${e(`mode.${this.mode}`)}</b>
        ${this.compact ? j : D`<small>${e(`mode.${this.mode}.sub`)}</small>`}
      </span>
    </button>` : j;
	}
	toggle() {
		this.dispatchEvent(new CustomEvent("joe-mode-switch", {
			bubbles: !0,
			composed: !0
		}));
	}
};
d([b()], Ue.prototype, "mode", void 0), d([b({ type: Boolean })], Ue.prototype, "compact", void 0), d([b({ type: Boolean })], Ue.prototype, "running", void 0), d([b({ attribute: !1 })], Ue.prototype, "t", void 0), u("joe-sim-switch", Ue);
//#endregion
//#region src/components/texts.ts
function We(e, t) {
	return t == null ? "–" : v(e.lang, t * 100, 2);
}
function Ge(e, t, n = !0) {
	let r;
	return r = t.kind === "fixed_window" && t.window ? t.night_price == null && t.day_price == null ? e("tariff.window_only", {
		start: t.window.start,
		end: t.window.end
	}) : e("find.tariff.window", {
		start: t.window.start,
		end: t.window.end,
		night: We(e, t.night_price),
		day: We(e, t.day_price)
	}) : t.kind === "dynamic" ? t.night_price != null && t.day_price != null ? e("find.tariff.dynamic", {
		night: We(e, t.night_price),
		day: We(e, t.day_price)
	}) : e("tariff.dynamic") : t.kind === "flat" ? t.day_price == null ? e("tariff.flat") : e("find.tariff.flat", { day: We(e, t.day_price) }) : e("find.tariff.unknown"), n && t.feed_in_price != null && (r += ` · ${e("find.tariff.feedin", { price: We(e, t.feed_in_price) })}`), r;
}
function Ke(e, t) {
	let n = {};
	for (let [r, i] of Object.entries(t)) typeof i == "number" ? n[r] = v(e.lang, i, 2) : typeof i == "string" && (n[r] = i);
	typeof t.role == "string" && (n.role = e.optional(`role.${t.role}`) ?? t.role);
	let r = `check.${t.code}`;
	return t.code === "grid_sign" && typeof t.expected == "number" && typeof t.actual == "number" && (r = t.expected < 0 ? "check.grid_sign.export" : "check.grid_sign.import", n.expected = v(e.lang, Math.abs(t.expected), 1), n.actual = v(e.lang, Math.abs(t.actual), 1)), e.optional(r, n) ?? t.code;
}
//#endregion
//#region src/config.ts
var qe = /\[[^\]]*\]|[^.[]+/g;
function Je(e) {
	let t = [], n = "";
	for (let r of e.match(qe) ?? []) n = !n || r.startsWith("[") ? n + r : `${n}.${r}`, t.push(n);
	return t.reverse();
}
function P(e, t) {
	for (let n of Je(t)) {
		let t = e.provenance[n];
		if (t) return t;
	}
}
function F(e, t) {
	return e.answers.ignored.includes(t);
}
function Ye(e, t, n) {
	let r = e.answers.ignored.filter((e) => e !== t);
	return n ? [...r, t] : r;
}
function I(e, t, n = "user") {
	let r = {
		patch: t,
		source: n
	};
	return e.dispatchEvent(new CustomEvent("joe-config", {
		detail: r,
		bubbles: !0,
		composed: !0
	})), r.result ?? Promise.resolve(!1);
}
function L(e, t) {
	return new Promise((n) => {
		e.dispatchEvent(new CustomEvent("joe-pick", {
			detail: {
				request: t,
				resolve: n
			},
			bubbles: !0,
			composed: !0
		}));
	});
}
function Xe(e, t = []) {
	let n = /* @__PURE__ */ new Set(), r = [];
	for (let i of [...e, ...t.map((e) => ({ entity_id: e.entity_id }))]) n.has(i.entity_id) || (n.add(i.entity_id), r.push(i));
	return r;
}
function Ze(e) {
	return {
		entity_id: e.entity.entity_id,
		confidence: e.confidence,
		reasons: e.reasons
	};
}
//#endregion
//#region src/device-model.ts
var Qe = [
	"battery",
	"climate",
	"car",
	"hot_water",
	"other",
	"grid"
], $e = {
	battery: "mdi:home-battery-outline",
	climate: "mdi:thermostat",
	car: "mdi:car-electric",
	hot_water: "mdi:water-boiler",
	other: "mdi:power-plug-outline",
	grid: "mdi:transmission-tower"
}, et = /(^|[^\p{L}\d])(e-?auto|auto|car|ev|wallbox)([^\p{L}\d]|$)/iu;
function tt(e) {
	if (e.id.startsWith("hot_water_")) return "hot_water";
	if (e.id.startsWith("ev_")) return "car";
	if (e.id.startsWith("custom_")) return "other";
}
function nt(e, t) {
	if (e.kind === "target") return "hot_water";
	if (e.point != null || t?.kind === "ev") return "car";
	if (t?.kind === "hot_water") return "hot_water";
	let n = tt(e);
	return n === "hot_water" || n === "car" ? n : !t && !n && et.test(`${e.id} ${e.name}`) ? "car" : "other";
}
function rt(e, t) {
	let n = t.consumer_id ? e.consumers.find((e) => e.id === t.consumer_id) : void 0, r = nt(t, n);
	return r === "car" ? {
		group: r,
		id: `point:${t.id}`
	} : r === "other" ? n && n.kind !== "climate" && e.actions.find((e) => e.consumer_id === n.id && nt(e, n) === "other")?.id === t.id ? {
		group: r,
		id: n.id
	} : {
		group: r,
		id: `action-${t.id}`
	} : {
		group: r,
		id: t.id
	};
}
function R(e) {
	return e.group === "car" && e.id.startsWith("point:") ? p(e.id.slice(6)) : {
		tab: "devices",
		section: e.group,
		id: e.id
	};
}
function it(e, t) {
	return {
		tab: "devices",
		section: "add",
		id: e,
		sub: e ? t : void 0
	};
}
function at(e, t, n) {
	if (!e) return;
	let r = n ? e.entities?.[n] : void 0, i = t ?? r?.device_id ?? void 0, a = r?.area_id ?? (i ? e.devices?.[i]?.area_id : void 0);
	return a ? e.areas?.[a]?.name : void 0;
}
function ot(e, t) {
	return (t ? e?.entities?.[t]?.device_id : void 0) ?? void 0;
}
function st(e, t) {
	return ot(e, t.power_entity) ?? ot(e, t.energy_entity);
}
function ct(e, t) {
	let n = t.filter((e) => !!e);
	return {
		...e,
		problems: n,
		problem: n[0]
	};
}
function lt(e, t) {
	return t ? e.optional(`devices.problem.${t}`) ?? t : void 0;
}
function ut(e) {
	return e.level === "warn" || e.code === "tariff_unknown" || e.code === "missing" && e.role === "grid_power";
}
function dt(e, n, r, i = {}) {
	let a = n.config, o = n.control, s = (i.checks ?? []).filter(ut), c = [];
	for (let t of a.batteries) {
		let n = t.adapter !== "none", i = o?.ready[t.id], a = t.device_id ?? ot(r, t.soc_entity);
		c.push(ct({
			group: "battery",
			id: t.id,
			name: t.name,
			area: at(r, a, t.soc_entity),
			icon: $e.battery,
			deviceId: a,
			entityId: t.soc_entity,
			role: n ? "steers" : "watches",
			battery: t
		}, [
			...s.filter((e) => e.battery_id === t.id).map((t) => Ke(e, t)),
			n ? lt(e, o?.batteries[t.id]?.problem) : void 0,
			n && i && i !== "ready" && i !== "not_controllable" ? lt(e, i === "outdated" ? "not_tested" : i) : void 0
		]));
	}
	let l = a.climate?.rooms ?? {}, u = i.climateFound?.devices, d = u ? u.map((e) => e.entity_id) : Object.keys(l);
	for (let e of Object.keys(l)) d.includes(e) || d.push(e);
	let f = a.consumers.filter((e) => e.kind === "climate"), p = /* @__PURE__ */ new Set();
	for (let t of d) {
		let i = u?.find((e) => e.entity_id === t), a = l[t], o = i?.device_id ?? ot(r, t), s = a?.meter && a.meter !== "none" ? a.meter : void 0, d = f.find((e) => {
			let t = st(r, e);
			return t !== void 0 && !p.has(e.id) && (t === o || t === s?.device_id);
		}) ?? f.find((e) => !p.has(e.id) && i && e.name.trim().toLowerCase() === i.name.trim().toLowerCase());
		d && p.add(d.id);
		let m = n.climate?.rooms[t]?.error;
		c.push(ct({
			group: "climate",
			id: t,
			name: i?.name ?? (r ? _(r, t) : t),
			area: i?.area ?? at(r, o, t),
			icon: $e.climate,
			deviceId: o,
			entityId: t,
			role: a?.enabled ? "steers" : "watches",
			climate: i,
			room: a,
			meter: s ? {
				deviceId: s.device_id,
				power: s.power ?? void 0
			} : void 0,
			consumer: d
		}, [u && !i ? e("devices.problem.gone") : void 0, m ? e.optional(`week.error.${m}`) ?? e("week.error", { error: m }) : void 0]));
	}
	for (let e of f.filter((e) => !p.has(e.id))) {
		let t = st(r, e);
		c.push(ct({
			group: "climate",
			id: e.id,
			name: e.name,
			area: at(r, t, e.power_entity ?? e.energy_entity),
			icon: "mdi:help-circle-outline",
			deviceId: t,
			entityId: e.power_entity ?? e.energy_entity ?? void 0,
			role: "measures",
			consumer: e,
			unassigned: !0
		}, []));
	}
	let m = new Map(a.consumers.map((e) => [e.id, e])), h = {
		car: [],
		hot_water: [],
		other: []
	}, g = /* @__PURE__ */ new Set(), ee = (t, n, i) => {
		let a = t.consumer_id ? m.get(t.consumer_id) : void 0, s = n === "car" ? t.entity_id : n === "hot_water" ? t.sensor_entity ?? t.entity_id : t.entity_id, c = ot(r, t.entity_id) ?? (a ? st(r, a) : void 0) ?? ot(r, s);
		return ct({
			group: n,
			id: i,
			name: i === a?.id ? a.name : t.name,
			area: at(r, c, s || void 0),
			deviceId: c,
			entityId: s || void 0,
			role: t.enabled ? "steers" : "watches",
			action: t,
			consumer: a,
			point: n === "car" || void 0,
			icon: n === "car" ? "mdi:ev-station" : $e[n],
			noMeter: n === "other" && !a
		}, [lt(e, o?.actions?.[t.id]?.problem)]);
	};
	for (let e of a.cars ?? []) {
		let i = t(n, e.id, "soc")?.entity, a = (e.sources.find((e) => e.kind === "car") ?? e.sources[0])?.device_id ?? ot(r, i);
		h.car.push(ct({
			group: "car",
			id: e.id,
			name: e.name,
			area: at(r, a, i),
			icon: $e.car,
			deviceId: a ?? void 0,
			entityId: i,
			role: e.need.enabled ? "steers" : "watches",
			car: e
		}, []));
	}
	for (let e of a.actions) {
		let t = rt(a, e);
		e.consumer_id && t.group !== "other" && g.add(e.consumer_id), e.consumer_id && t.id === e.consumer_id && g.add(e.consumer_id), h[t.group].push(ee(e, t.group, t.id));
	}
	for (let e of a.consumers) {
		if (e.kind === "climate" || g.has(e.id)) continue;
		let t = e.kind === "ev" ? "car" : e.kind === "hot_water" ? "hot_water" : "other", n = st(r, e), i = e.power_entity ?? e.energy_entity ?? void 0, a = ct({
			group: t,
			id: e.id,
			name: e.name,
			area: at(r, n, i),
			icon: t === "other" ? $e.other : $e[t],
			deviceId: n,
			entityId: i,
			role: "measures",
			consumer: e,
			setup: t === "other" ? void 0 : t === "car" ? "wallbox" : t
		}, []);
		h[t].push(a);
	}
	let te = new Map(a.consumers.map((e, t) => [e.id, t]));
	h.other.sort((e, t) => (te.get(e.id) ?? Infinity) - (te.get(t.id) ?? Infinity)), c.push(...h.car, ...h.hot_water, ...h.other);
	let ne = a.measurements, re = (t) => s.filter((e) => t === "connection" ? e.role === "grid_power" || e.code === "grid_sign" || e.code === "tariff_unknown" : t === "home" ? e.role === "home_power" || e.code === "home_negative" : e.role === "solar_power").map((t) => Ke(e, t)), v = (e, t, n, i) => ct({
		group: "grid",
		id: e,
		part: e,
		name: t,
		icon: n,
		deviceId: ot(r, i),
		entityId: i ?? void 0,
		area: at(r, void 0, i),
		role: "measures"
	}, re(e));
	return c.push(v("connection", e("devices.grid.connection"), "mdi:transmission-tower", ne.grid_power?.entity_id)), (ne.solar_power.length || a.forecast.provider) && c.push(v("solar", e("devices.grid.solar"), "mdi:solar-power-variant", ne.solar_power[0]?.entity_id)), c.push(v("home", e("devices.grid.home"), "mdi:home-lightning-bolt-outline", ne.home_power?.entity_id)), c;
}
function ft(e) {
	return Qe.filter((t) => t === "grid" || e.some((e) => e.group === t));
}
function pt(e, t, n) {
	return n === void 0 ? void 0 : e.find((e) => e.group === t && e.id === n);
}
function mt(e, t) {
	return e.some((e) => e.group === t && e.problems.length > 0);
}
function ht(e, t) {
	return `${e}:${t}`;
}
function gt(e, t) {
	if (!t) return [];
	let n = [];
	for (let r of t.batteries) {
		let t = ht("battery", r.id);
		!e.batteries.some((e) => e.id === r.id) && !F(e, t) && n.push({
			kind: "battery",
			key: t,
			name: r.name,
			battery: r
		});
	}
	for (let r of t.wallboxes.filter((e) => e.is_car)) {
		let t = ht("wallbox", r.device_id ?? r.name);
		!e.actions.some((e) => e.id === `ev_${r.device_id}` || r.mode_entity && e.entity_id === r.mode_entity) && !F(e, t) && n.push({
			kind: "wallbox",
			key: t,
			name: r.name,
			wallbox: r
		});
	}
	for (let r of t.cars ?? []) {
		let t = ht("car", r.device_id);
		!(e.cars ?? []).some((e) => e.sources.some((e) => e.device_id === r.device_id) || r.entities.soc && e.need.soc_entity === r.entities.soc || r.entities.range && e.need.range_entity === r.entities.range) && !F(e, t) && n.push({
			kind: "car",
			key: t,
			name: r.name,
			car: r
		});
	}
	return n;
}
function _t(e, t) {
	return (t?.batteries ?? []).filter((t) => F(e, ht("battery", t.id)) && !e.batteries.some((e) => e.id === t.id));
}
//#endregion
//#region src/components/calendar-flow.ts
var vt = class extends O {
	constructor(...e) {
		super(...e), this.variant = "calendar", this.address = "", this.calendar = "";
	}
	static {
		this.styles = w`
    :host {
      display: block;
      container-type: inline-size;
    }
    ol {
      list-style: none;
      margin: 0;
      padding: 4px 0;
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: minmax(0, 1fr);
      gap: 8px;
      counter-reset: step;
    }
    li {
      position: relative;
      display: grid;
      justify-items: center;
      align-content: start;
      gap: 6px;
      text-align: center;
      font-size: 12.5px;
      line-height: 1.35;
      color: var(--joe-ink-2);
    }
    /* The line from one step to the next. */
    li:not(:last-child)::after {
      content: "";
      position: absolute;
      top: 21px;
      left: calc(50% + 26px);
      right: calc(-50% + 26px);
      height: 2px;
      border-radius: 1px;
      background: var(--joe-amber, #fea707);
      opacity: 0.6;
    }
    .badge {
      position: relative;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: var(--joe-amber, #fea707);
      color: #071118;
      box-shadow: inset 0 0 0 2px #071118;
    }
    .badge ha-icon {
      --mdc-icon-size: 22px;
    }
    .number {
      position: absolute;
      top: -4px;
      right: -6px;
      min-width: 18px;
      height: 18px;
      padding: 0 4px;
      border-radius: 9px;
      background: #071118;
      color: #fea707;
      font-size: 11px;
      font-weight: 800;
      line-height: 18px;
      text-align: center;
    }
    /* Joe's steps: dark with an amber ring (visible on dark backgrounds too). */
    li.joe .badge {
      background: #071118;
      color: #fea707;
      box-shadow: inset 0 0 0 2px var(--joe-amber, #fea707);
    }
    li.joe .number {
      background: var(--joe-amber, #fea707);
      color: #071118;
    }
    b {
      color: var(--joe-ink);
      font-weight: 700;
      overflow-wrap: anywhere;
    }
    /* Too narrow for the steps side by side: one below the other. */
    @container (max-width: 520px) {
      ol {
        grid-auto-flow: row;
        grid-auto-columns: auto;
        gap: 10px;
      }
      li {
        grid-template-columns: 44px 1fr;
        justify-items: start;
        align-items: center;
        text-align: left;
        gap: 12px;
      }
      li:not(:last-child)::after {
        top: 46px;
        left: 21px;
        right: auto;
        width: 2px;
        height: 12px;
      }
    }
  `;
	}
	steps(e) {
		if (this.variant === "calendar") return [
			{
				icon: "mdi:calendar-account",
				text: e("flow.calendar.1")
			},
			{
				icon: "mdi:link-variant",
				text: e("flow.calendar.2")
			},
			{
				icon: "mdi:calendar-search",
				text: e("flow.calendar.3"),
				joe: !0
			},
			{
				icon: "mdi:ev-station",
				text: e("flow.charge"),
				joe: !0
			}
		];
		let t = [{
			icon: "mdi:calendar-edit",
			text: e("flow.invite.1")
		}, {
			icon: "mdi:car-arrow-right",
			text: e("flow.invite.2", { address: this.address || e("flow.invite.address") })
		}];
		return this.variant === "mailbox" ? [
			...t,
			{
				icon: "mdi:email-check-outline",
				text: e("flow.mailbox.3"),
				joe: !0
			},
			{
				icon: "mdi:calendar-import",
				text: e("flow.mailbox.4", { calendar: this.calendar }),
				joe: !0
			},
			{
				icon: "mdi:ev-station",
				text: e("flow.charge"),
				joe: !0
			}
		] : [
			...t,
			{
				icon: "mdi:calendar-check",
				text: e("flow.account.3")
			},
			{
				icon: "mdi:calendar-sync",
				text: e("flow.account.4"),
				joe: !0
			},
			{
				icon: "mdi:ev-station",
				text: e("flow.charge"),
				joe: !0
			}
		];
	}
	render() {
		let e = this.t;
		return e ? D`<ol aria-label=${e(`flow.${this.variant}.title`)}>
      ${this.steps(e).map((e, t) => D`<li class=${e.joe ? "joe" : ""}>
          <span class="badge" aria-hidden="true">
            <ha-icon icon=${e.icon}></ha-icon>
            <span class="number">${t + 1}</span>
          </span>
          <span .innerHTML=${this.bold(e.text)}></span>
        </li>`)}
    </ol>` : j;
	}
	bold(e) {
		return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
	}
};
d([b({ attribute: !1 })], vt.prototype, "t", void 0), d([b()], vt.prototype, "variant", void 0), d([b()], vt.prototype, "address", void 0), d([b()], vt.prototype, "calendar", void 0), u("joe-calendar-flow", vt);
//#endregion
//#region src/components/car-account.ts
var yt = [
	"google",
	"outlook",
	"microsoft",
	"icloud",
	"infomaniak",
	"caldav"
], bt = /* @__PURE__ */ new Set([
	"google",
	"outlook",
	"microsoft"
]), xt = {
	kind: "outlook",
	address: "",
	username: null,
	url: null,
	client_id: null,
	tenant: "common",
	accept: !0
}, St = class extends O {
	constructor(...e) {
		super(...e), this.actionId = "", this.saved = !1, this.password = "", this.secret = "", this.busy = !1, this.ownApp = !1;
	}
	static {
		this.styles = [k, w`
      :host {
        display: grid;
        gap: 10px;
      }
      .field {
        display: grid;
        gap: 4px;
      }
      .head-row {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .head-row b {
        font-weight: 600;
      }
      .inline {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
      }
      .inline .input {
        flex: 1 1 200px;
        min-width: 0;
        width: auto;
      }
      .hint {
        margin: 0;
        font-size: 13px;
        color: var(--joe-muted);
      }
      .ok {
        color: var(--joe-good);
      }
      .bad {
        color: var(--joe-warn, var(--joe-crit));
      }
      .code {
        margin: 0;
        font-weight: 600;
      }
    `];
	}
	render() {
		let e = this.t;
		if (!e) return j;
		let t = this.account, n = bt.has(t.kind);
		return D`<div class="field" data-tipped>
        <div class="head-row"><label for="account-kind"><b>${e("calendar.account.kind")}</b></label> ${l(e, "calendar_account")}</div>
        <select id="account-kind" class="input" @change=${(e) => this.set({ kind: e.target.value })}>
          ${yt.map((n) => D`<option value=${n} ?selected=${n === t.kind}>${e(`calendar.account.kind.${n}`)}</option>`)}
        </select>
      </div>
      <div class="field" data-tipped>
        <div class="head-row"><label for="account-address"><b>${e("calendar.account.address")}</b></label> ${l(e, "calendar_account_address")}</div>
        <input
          id="account-address"
          class="input"
          type="email"
          autocomplete="off"
          placeholder=${e(`calendar.account.placeholder.${t.kind}`)}
          .value=${t.address}
          @change=${(e) => this.set({ address: e.target.value.trim().toLowerCase() })}
        />
        ${t.kind === "google" ? D`<p class="hint">${e("calendar.account.google.hint")}</p>` : j}
      </div>
      ${n ? this.renderSignIn(e, t) : this.renderPassword(e, t)}
      <div class="inline" data-tipped>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(t.accept)}
          aria-label=${e("calendar.account.accept")}
          @click=${() => this.set({ accept: !t.accept })}
        ></button>
        <span>${e("calendar.account.accept")}</span>
        ${l(e, "calendar_account_accept")}
      </div>
      ${this.renderStatus(e)}`;
	}
	get account() {
		return {
			...xt,
			...this.need?.account ?? {}
		};
	}
	joeApp(e) {
		return e === "google" ? !!this.apps?.google : !!this.apps?.microsoft;
	}
	renderSignIn(e, t) {
		let n = this.status, r = n?.oauth, i = t.kind === "google", a = this.joeApp(t.kind), o = !a || this.ownApp || !!t.client_id || t.kind === "microsoft", s = !!n?.has_sign_in, c = this.signInError ?? (r?.state === "error" ? r.error : void 0);
		return D`${o ? this.renderOwnApp(e, t, a) : j}
      <div class="field" data-tipped>
        <div class="inline">
          <button type="button" class="mini-btn go" ?disabled=${this.busy} @click=${() => this.act("sign_in")}>
            <ha-icon icon=${i ? "mdi:google" : "mdi:microsoft"}></ha-icon>${e(s ? "mail.sign_in.again" : i ? "mail.sign_in.google" : "mail.sign_in")}
          </button>
          ${s ? D`<button type="button" class="mini-btn quiet" @click=${() => this.act("sign_out")}>${e("mail.sign_out")}</button>` : j}
          ${o ? j : D`<button type="button" class="mini-btn quiet" @click=${() => this.ownApp = !0}>${e("calendar.account.own_app")}</button>`}
          ${l(e, "mail_sign_in")}
        </div>
        ${r?.state === "waiting" && !this.signInError ? D`<p class="code">${e("mail.sign_in.code", { code: r.user_code ?? "" })}
              <a href=${r.uri ?? ""} target="_blank" rel="noreferrer noopener">${r.uri}</a></p>` : c ? D`<p class="bad">${e.optional(`calendar.account.oauth.${c}`) ?? e("calendar.account.oauth.other")}</p>` : s ? D`<p class="hint ok">${e("mail.signed_in")}</p>` : j}
      </div>`;
	}
	renderOwnApp(e, t, n) {
		let r = t.kind === "google";
		return D`<div class="field" data-tipped>
      <div class="head-row">
        <b>${e(n ? "calendar.account.client_id" : "calendar.account.client_id.needed")}</b>
        ${l(e, r ? "google_app" : "mail_microsoft")}
      </div>
      ${n ? j : D`<p class="hint">${e("calendar.account.no_joe_app")}</p>`}
      <div class="inline">
        <input
          class="input"
          type="text"
          autocomplete="off"
          placeholder=${r ? "1234567890-abc.apps.googleusercontent.com" : "00000000-0000-0000-0000-000000000000"}
          aria-label=${e("calendar.account.client_id")}
          .value=${t.client_id ?? ""}
          @change=${(e) => this.set({ client_id: e.target.value.trim() || null })}
        />
        ${t.kind === "microsoft" ? D`<input
              class="input"
              type="text"
              placeholder="common"
              aria-label=${e("mail.tenant")}
              .value=${t.tenant}
              @change=${(e) => this.set({ tenant: e.target.value.trim() || "common" })}
            />` : j}
      </div>
      ${r ? D`<form
            class="inline"
            @submit=${(e) => {
			e.preventDefault(), this.act("client_secret");
		}}
          >
            <input
              class="input"
              type="password"
              autocomplete="off"
              placeholder=${e("calendar.account.client_secret")}
              aria-label=${e("calendar.account.client_secret")}
              .value=${this.secret}
              @input=${(e) => this.secret = e.target.value}
            />
            <button type="submit" class="mini-btn" ?disabled=${!this.secret || this.busy}>${e("common.save")}</button>
          </form>
          ${this.status?.has_client_secret ? D`<p class="hint ok">${e("mail.password.saved")}</p>` : j}` : j}
    </div>`;
	}
	renderPassword(e, t) {
		return D`${t.kind === "caldav" ? D`<div class="field" data-tipped>
            <div class="head-row"><b>${e("calendar.account.url")}</b> ${l(e, "calendar_account_url")}</div>
            <div class="inline">
              <input
                class="input"
                type="url"
                placeholder="https://caldav.example.com/"
                aria-label=${e("calendar.account.url")}
                .value=${t.url ?? ""}
                @change=${(e) => this.set({ url: e.target.value.trim() || null })}
              />
              <input
                class="input"
                type="text"
                placeholder=${e("mail.username")}
                aria-label=${e("mail.username")}
                .value=${t.username ?? ""}
                @change=${(e) => this.set({ username: e.target.value.trim() || null })}
              />
            </div>
          </div>` : j}
      <div class="field" data-tipped>
        <div class="head-row"><label for="account-password"><b>${e("calendar.account.password")}</b></label> ${l(e, "calendar_account_password")}</div>
        <form
          class="inline"
          @submit=${(e) => {
			e.preventDefault(), this.act("password");
		}}
        >
          <input
            id="account-password"
            class="input"
            type="password"
            autocomplete="new-password"
            .value=${this.password}
            @input=${(e) => this.password = e.target.value}
          />
          <button type="submit" class="mini-btn go" ?disabled=${!this.password || this.busy}>${e("common.save")}</button>
        </form>
        ${this.status?.has_password ? D`<p class="hint ok">${e("mail.password.saved")}</p>` : j}
      </div>`;
	}
	renderStatus(e) {
		let t = this.status, n = bt.has(this.account.kind) ? t?.has_sign_in : t?.has_password, r = this.saved ? t?.state === "error" ? e("mail.state.error", { error: e.optional(`calendar.account.error.${t.error}`) ?? e("calendar.account.error.other") }) : t?.checked ? e("mail.state.ok", { time: N(t.checked) }) : "" : e("calendar.account.after_save");
		return D`<div class="inline" data-tipped>
      <button type="button" class="mini-btn" ?disabled=${this.busy || !n} @click=${() => this.act("test")}>
        <ha-icon icon="mdi:calendar-check-outline"></ha-icon>${e("calendar.account.test")}
      </button>
      ${l(e, "calendar_account_test")}
      <span class=${this.saved && t?.state === "error" ? "bad" : "hint"}>${r}</span>
      ${this.result ? D`<span class=${this.result === "ok" ? "ok" : "bad"}>
            ${e.optional(`calendar.account.result.${this.result}`) ?? e("calendar.account.result.other")}
          </span>` : j}
    </div>`;
	}
	async act(e) {
		this.busy = !0, this.result = void 0, (e === "sign_in" || e === "sign_out") && (this.signInError = void 0);
		try {
			let t = await this.hass?.callWS({
				type: "energy_joe/account",
				car: this.actionId,
				do: e,
				...e === "password" ? { password: this.password } : {},
				...e === "client_secret" ? { password: this.secret } : {},
				...e === "sign_in" || e === "test" ? { account: this.account } : {}
			});
			e === "password" && (this.password = ""), e === "client_secret" && (this.secret = ""), e === "test" && (this.result = t?.error ? t.error : "ok");
		} catch (t) {
			let { code: n = "failed", message: r } = t ?? {};
			e === "sign_in" ? this.signInError = n === "oauth" && r || n : this.result = n;
		} finally {
			this.busy = !1;
		}
	}
	set(e) {
		this.dispatchEvent(new CustomEvent("joe-need", {
			detail: { account: {
				...this.account,
				...e
			} },
			bubbles: !0,
			composed: !0
		}));
	}
};
d([b({ attribute: !1 })], St.prototype, "hass", void 0), d([b({ attribute: !1 })], St.prototype, "t", void 0), d([b()], St.prototype, "actionId", void 0), d([b({ type: Boolean })], St.prototype, "saved", void 0), d([b({ attribute: !1 })], St.prototype, "need", void 0), d([b({ attribute: !1 })], St.prototype, "status", void 0), d([b({ attribute: !1 })], St.prototype, "apps", void 0), d([T()], St.prototype, "password", void 0), d([T()], St.prototype, "secret", void 0), d([T()], St.prototype, "result", void 0), d([T()], St.prototype, "signInError", void 0), d([T()], St.prototype, "busy", void 0), d([T()], St.prototype, "ownApp", void 0), u("joe-car-account", St);
//#endregion
//#region src/components/car-mailbox.ts
var Ct = [
	"webde",
	"gmx",
	"google",
	"tonline",
	"other"
], wt = {
	"web.de": "webde",
	"gmx.de": "gmx",
	"gmx.net": "gmx",
	"gmx.at": "gmx",
	"gmx.ch": "gmx",
	"gmail.com": "google",
	"googlemail.com": "google",
	"t-online.de": "tonline"
}, Tt = {
	provider: "other",
	address: "",
	username: null,
	imap_host: null,
	imap_port: null,
	smtp_host: null,
	smtp_port: null,
	smtp_security: null,
	accept: !0
}, Et = class extends O {
	constructor(...e) {
		super(...e), this.actionId = "", this.saved = !1, this.password = "", this.busy = !1, this.servers = !1;
	}
	static {
		this.styles = [k, w`
      :host {
        display: grid;
        gap: 10px;
      }
      .field {
        display: grid;
        gap: 4px;
      }
      .head-row {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .head-row b {
        font-weight: 600;
      }
      .inline {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
      }
      .inline .input {
        flex: 1 1 200px;
        min-width: 0;
        width: auto;
      }
      .inline .input.port {
        flex: 0 1 110px;
      }
      .hint {
        margin: 0;
        font-size: 13px;
        color: var(--joe-muted);
      }
      .ok {
        color: var(--joe-good);
      }
      .bad {
        color: var(--joe-warn, var(--joe-crit));
      }
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 4px;
      }
      li {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 4px 10px;
        padding: 6px 10px;
        border-radius: 9px;
        background: var(--joe-surface);
        font-size: 13.5px;
      }
      li .what {
        flex: 1 1 200px;
        min-width: 0;
        overflow-wrap: anywhere;
      }
    `];
	}
	render() {
		let e = this.t;
		if (!e) return j;
		let t = this.mailbox, n = this.servers || t.provider === "other" && !!t.address;
		return D`<div class="field" data-tipped>
        <div class="head-row"><label for="mail-address"><b>${e("mail.address")}</b></label> ${l(e, "mail_address")}</div>
        <input
          id="mail-address"
          class="input"
          type="email"
          autocomplete="off"
          placeholder=${e("mail.address.placeholder")}
          .value=${t.address}
          @change=${(e) => this.setAddress(e.target.value.trim().toLowerCase())}
        />
      </div>
      <div class="field" data-tipped>
        <div class="head-row"><label for="mail-provider"><b>${e("mail.provider")}</b></label> ${l(e, "mail_provider")}</div>
        <select id="mail-provider" class="input" @change=${(e) => this.set({ provider: e.target.value })}>
          ${Ct.map((n) => D`<option value=${n} ?selected=${n === t.provider}>${e(`mail.provider.${n}`)}</option>`)}
        </select>
        <p class="hint">${e(`mail.provider.${t.provider}.hint`)}</p>
      </div>
      ${this.renderPassword(e)} ${n ? this.renderServers(e, t) : j}
      <div class="inline" data-tipped>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(t.accept)}
          aria-label=${e("mail.accept")}
          @click=${() => this.set({ accept: !t.accept })}
        ></button>
        <span>${e("mail.accept")}</span>
        ${l(e, "mail_accept")}
        ${n ? j : D`<button type="button" class="mini-btn quiet" @click=${() => this.servers = !0}>${e("mail.servers.change")}</button>`}
      </div>
      ${this.renderStatus(e)} ${this.renderRecent(e)}`;
	}
	get mailbox() {
		return {
			...Tt,
			...this.need?.mailbox ?? {}
		};
	}
	renderPassword(e) {
		return D`<div class="field" data-tipped>
      <div class="head-row"><label for="mail-password"><b>${e("mail.password")}</b></label> ${l(e, "mail_password")}</div>
      <form
        class="inline"
        @submit=${(e) => {
			e.preventDefault(), this.act("secret");
		}}
      >
        <input
          id="mail-password"
          class="input"
          type="password"
          autocomplete="new-password"
          .value=${this.password}
          @input=${(e) => this.password = e.target.value}
        />
        <button type="submit" class="mini-btn go" ?disabled=${!this.password || this.busy}>${e("common.save")}</button>
      </form>
      ${this.status?.has_secret ? D`<p class="hint ok">${e("mail.password.saved")}</p>` : D`<p class="hint">${e("mail.password.hint")}</p>`}
    </div>`;
	}
	renderServers(e, t) {
		let n = (n) => D`<input
      class="input"
      type="text"
      aria-label=${e(`mail.${n}`)}
      placeholder=${e(`mail.${n}`)}
      .value=${t[n] ?? ""}
      @change=${(e) => this.set({ [n]: e.target.value.trim() || null })}
    />`, r = (n) => D`<input
      class="input port"
      type="number"
      min="1"
      max="65535"
      aria-label=${e(`mail.${n}`)}
      placeholder=${e(`mail.${n}`)}
      .value=${t[n] == null ? "" : String(t[n])}
      @change=${(e) => {
			let t = Number.parseInt(e.target.value, 10);
			this.set({ [n]: Number.isFinite(t) && t > 0 && t < 65536 ? t : null });
		}}
    />`;
		return D`<div class="field" data-tipped>
      <div class="head-row"><b>${e("mail.servers")}</b> ${l(e, "mail_servers")}</div>
      <p class="hint">${e("mail.servers.hint")}</p>
      <div class="inline">${n("username")}</div>
      <div class="inline">${n("imap_host")} ${r("imap_port")}</div>
      <div class="inline">
        ${n("smtp_host")} ${r("smtp_port")}
        <select
          class="input port"
          aria-label=${e("mail.smtp_security")}
          @change=${(e) => this.set({ smtp_security: e.target.value || null })}
        >
          <option value="" ?selected=${!t.smtp_security}>${e("mail.smtp_security.auto")}</option>
          <option value="starttls" ?selected=${t.smtp_security === "starttls"}>STARTTLS</option>
          <option value="ssl" ?selected=${t.smtp_security === "ssl"}>SSL/TLS</option>
        </select>
      </div>
    </div>`;
	}
	renderStatus(e) {
		return D`<div class="field" data-tipped>
      <div class="inline">
        <button type="button" class="mini-btn" ?disabled=${this.busy || !this.status?.has_secret} @click=${() => this.act("test")}>
          <ha-icon icon="mdi:connection"></ha-icon>${e("mail.test")}
        </button>
        ${this.saved ? D`<button type="button" class="mini-btn" ?disabled=${this.busy || !this.status?.has_secret} @click=${() => this.act("check")}>
              <ha-icon icon="mdi:email-sync-outline"></ha-icon>${e("mail.check")}
            </button>` : j}
        ${l(e, "mail_status")}
      </div>
      <p class=${this.saved && this.status?.state === "error" ? "hint bad" : "hint"}>
        ${this.saved ? this.statusText(e) : e("mail.after_save")}
      </p>
      ${this.result ? D`<p class=${this.result === "ok" ? "hint ok" : "hint bad"} role="status">
            ${e.optional(`mail.result.${this.result}`) ?? e("mail.result.failed")}
          </p>` : j}
    </div>`;
	}
	renderRecent(e) {
		let t = this.status?.recent ?? [];
		if (!t.length) return j;
		let n = this.need?.allowed ?? [];
		return D`<div class="field" data-tipped>
      <div class="head-row"><b>${e("mail.recent")}</b> ${l(e, "mail_recent")}</div>
      <ul>
        ${t.slice(0, 8).map((t) => D`<li>
            <span class="what">
              ${t.summary || "–"} ${t.start && t.start.includes("T") ? `· ${t.start.slice(8, 10)}.${t.start.slice(5, 7)}. ${N(t.start)}` : ""}
              · ${t.from}
            </span>
            <span class=${t.result.startsWith("not") || t.result.endsWith("not_accepted") || t.result.startsWith("no_") ? "bad" : ""}>
              ${e.optional(`mail.recent.${t.result}`) ?? t.result}
            </span>
            ${t.result === "not_allowed" && !n.includes(t.from) ? D`<button type="button" class="mini-btn" @click=${() => this.change({ allowed: [...n, t.from] })}>${e("mail.allow")}</button>` : j}
          </li>`)}
      </ul>
    </div>`;
	}
	statusText(e) {
		let t = this.status;
		return !t || t.state === "off" || t.state === "waiting" ? e("mail.state.waiting") : t.state === "no_secret" ? e("mail.state.no_secret") : t.state === "error" ? e("mail.state.error", { error: e.optional(`mail.error.${t.error}`) ?? String(t.error) }) : e("mail.state.ok", { time: t.checked ? N(t.checked) : "–" });
	}
	setAddress(e) {
		let t = wt[e.split("@")[1] ?? ""], n = this.mailbox, r = n.provider === "other" || n.provider === wt[n.address.split("@")[1] ?? ""];
		this.set(t && r ? {
			address: e,
			provider: t
		} : { address: e });
	}
	set(e) {
		this.change({ mailbox: {
			...this.mailbox,
			...e
		} });
	}
	change(e) {
		this.dispatchEvent(new CustomEvent("joe-need", {
			detail: e,
			bubbles: !0,
			composed: !0
		}));
	}
	async act(e) {
		this.busy = !0, this.result = void 0;
		try {
			if (e === "secret") await this.hass?.callWS({
				type: "energy_joe/mailbox/secret",
				car: this.actionId,
				password: this.password
			}), this.password = "";
			else if (e === "test") {
				let e = await this.hass?.callWS({
					type: "energy_joe/mailbox/test",
					car: this.actionId,
					mailbox: this.mailbox
				});
				this.result = e?.error ? `error_${e.error}` : "ok";
			} else await this.hass?.callWS({
				type: "energy_joe/mailbox/check",
				car: this.actionId
			});
		} catch {
			this.result = "failed";
		} finally {
			this.busy = !1;
		}
	}
};
d([b({ attribute: !1 })], Et.prototype, "hass", void 0), d([b({ attribute: !1 })], Et.prototype, "t", void 0), d([b()], Et.prototype, "actionId", void 0), d([b({ type: Boolean })], Et.prototype, "saved", void 0), d([b({ attribute: !1 })], Et.prototype, "need", void 0), d([b({ attribute: !1 })], Et.prototype, "status", void 0), d([T()], Et.prototype, "password", void 0), d([T()], Et.prototype, "busy", void 0), d([T()], Et.prototype, "result", void 0), d([T()], Et.prototype, "servers", void 0), u("joe-car-mailbox", Et);
//#endregion
//#region src/components/car-calendars.ts
var Dt = [
	{
		source: "ha",
		icon: "mdi:calendar-check"
	},
	{
		source: "mailbox",
		icon: "mdi:email-outline"
	},
	{
		source: "account",
		icon: "mdi:calendar-sync"
	}
], Ot = [
	{
		key: "google",
		url: "https://my.home-assistant.io/redirect/config_flow_start/?domain=google"
	},
	{
		key: "caldav",
		url: "https://my.home-assistant.io/redirect/config_flow_start/?domain=caldav"
	},
	{
		key: "ical",
		url: "https://my.home-assistant.io/redirect/config_flow_start/?domain=remote_calendar"
	},
	{
		key: "microsoft",
		url: "https://my.home-assistant.io/redirect/hacs_repository/?owner=RogerSelwyn&repository=MS365-Calendar&category=integration"
	}
], z = class extends O {
	constructor(...e) {
		super(...e), this.actionId = "", this.savedSource = null, this.carName = "", this.copied = !1, this.copyFailed = !1, this.linksFailed = !1, this.sender = "";
	}
	static {
		this.styles = [k, w`
      :host {
        display: grid;
        gap: 14px;
      }
      /* One below the other, or all three side by side – never two and one.
         The container is this box only: it holds no tooltip (a container
         would catch their fixed position where there is no popover). */
      .ways-box {
        container-type: inline-size;
      }
      .ways {
        display: grid;
        gap: 8px;
      }
      @container (min-width: 640px) {
        .ways {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }
      .way {
        display: grid;
        grid-template-columns: auto 1fr;
        align-items: start;
        gap: 4px 10px;
        padding: 12px;
        border-radius: 12px;
        border: 2px solid var(--joe-line);
        background: var(--joe-surface);
        color: inherit;
        font: inherit;
        text-align: left;
        cursor: pointer;
        transition:
          border-color 120ms,
          background 120ms,
          transform 120ms;
      }
      .way:hover {
        border-color: color-mix(in srgb, var(--joe-amber, #fea707) 55%, var(--joe-line));
      }
      .way:active {
        transform: scale(0.98);
      }
      .way[aria-checked="true"] {
        border-color: var(--joe-amber, #fea707);
        background: color-mix(in srgb, var(--joe-amber, #fea707) 12%, var(--joe-surface));
      }
      .way ha-icon {
        grid-row: span 2;
        --mdc-icon-size: 24px;
        margin-top: 1px;
      }
      .way b {
        font-weight: 700;
      }
      .way small {
        color: var(--joe-muted);
        font-size: 12.5px;
        line-height: 1.4;
      }
      .part,
      .own {
        display: grid;
        gap: 8px;
        padding: 12px;
        border-radius: 12px;
        background: var(--joe-surface-2);
      }
      .own {
        border: 2px dashed color-mix(in srgb, var(--joe-amber, #fea707) 70%, transparent);
      }
      .head-row {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .head-row b {
        font-weight: 700;
      }
      .link,
      .inline {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
      }
      .inline .input {
        flex: 1 1 200px;
        min-width: 0;
        width: auto;
      }
      .link code {
        flex: 1 1 220px;
        min-width: 0;
        overflow-wrap: anywhere;
        font-size: 12.5px;
        color: var(--joe-ink-2);
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
      }
      a.mini-btn {
        text-decoration: none;
        color: inherit;
      }
      .hint {
        margin: 0;
        font-size: 13px;
        color: var(--joe-muted);
      }
      .hint.bad {
        color: var(--joe-warn, var(--joe-crit));
      }
    `];
	}
	connectedCallback() {
		super.connectedCallback(), this.load(!1);
	}
	async load(e) {
		if (this.hass) try {
			this.links = await this.hass.callWS({
				type: "energy_joe/calendar/links",
				renew: e
			}), this.linksFailed = !1;
		} catch {
			this.linksFailed = !0;
		}
	}
	render() {
		let { t: e, hass: t } = this;
		if (!e || !t) return j;
		let n = this.need?.source ?? "ha";
		return D`<div data-tipped>
        <div class="head-row"><b>${e("calendar.source")}</b> ${l(e, "calendar_source")}</div>
        <div class="ways-box"><div class="ways" role="radiogroup" aria-label=${e("calendar.source")}>
          ${Dt.map((t) => D`<button
              type="button"
              class="way"
              role="radio"
              aria-checked=${String(n === t.source)}
              @click=${() => this.change({ source: t.source })}
            >
              <ha-icon icon=${t.icon}></ha-icon>
              <b>${e(`calendar.way.${t.source}`)}</b>
              <small>${e(`calendar.way.${t.source}.hint`)}</small>
            </button>`)}
        </div></div>
      </div>
      ${n === "mailbox" ? this.renderMailbox(e, t) : n === "account" ? this.renderAccount(e) : this.renderCalendar(e, t)}
      ${this.linksFailed ? D`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("calendar.links_failed")}</span>
            <button type="button" class="mini-btn quiet" @click=${() => this.load(!1)}>${e("calendar.retry")}</button>
          </div>` : j}`;
	}
	saved(e) {
		return this.savedSource === e;
	}
	renderLegacy(e, t) {
		let n = this.savedSource && this.savedSource !== "mailbox" && this.savedSource === (this.need?.source ?? "ha") ? this.links?.entities[this.actionId] : null;
		return n ? D`<div class="own" data-tipped>
          <div class="head-row"><ha-icon icon="mdi:calendar-clock"></ha-icon><b>${e("calendar.own.legacy")}</b> ${l(e, "calendar_legacy")}</div>
          <p class="hint">${e("calendar.own.legacy.hint", { name: _(t, n) })}</p>
        </div>` : j;
	}
	renderCalendar(e, t) {
		let n = this.need?.calendars ?? [];
		return D`<div class="part">
        <joe-calendar-flow .t=${e} variant="calendar"></joe-calendar-flow>
      </div>
      ${this.renderLegacy(e, t)}
      <div data-tipped>
        <div class="head-row"><b>${e("calendar.pick")}</b> ${l(e, "calendar_more")}</div>
        <div class="chips">
          ${n.map((r) => D`<span class="chip">
              ${_(t, r)}
              <button
                type="button"
                class="mini-btn quiet"
                aria-label=${e("calendar.remove", { name: _(t, r) })}
                @click=${() => this.change({ calendars: n.filter((e) => e !== r) })}
              >
                <ha-icon icon="mdi:close"></ha-icon>
              </button>
            </span>`)}
          <button type="button" class="mini-btn" @click=${() => this.pick()}>
            <ha-icon icon="mdi:calendar-plus"></ha-icon>${e("calendar.add")}
          </button>
        </div>
      </div>
      <div data-tipped>
        <p class="hint">${e("calendar.connect")}</p>
        <div class="chips">
          ${Ot.map((t) => D`<a class="mini-btn" href=${t.url} target="_blank" rel="noreferrer noopener">
                <ha-icon icon="mdi:open-in-new"></ha-icon>${e(`calendar.connect.${t.key}`)}
              </a>`)}
          ${l(e, "calendar_connect")}
        </div>
      </div>`;
	}
	async pick() {
		let e = this.t, t = await L(this, {
			heading: e("calendar.pick"),
			tip: "calendar_more",
			filter: "calendar",
			selected: this.need?.calendars ?? [],
			multiple: !0,
			exclude: Object.values(this.links?.entities ?? {}).filter((e) => !!e)
		});
		t && this.change({ calendars: t.selected });
	}
	renderMailbox(e, t) {
		let n = this.saved("mailbox"), r = n ? this.links?.entities[this.actionId] : null, i = r ? _(t, r) : e("calendar.own.name", { car: this.carName });
		return D`<div class="part">
        <joe-calendar-flow .t=${e} variant="mailbox" address=${this.need?.mailbox?.address ?? ""} calendar=${i}></joe-calendar-flow>
      </div>
      <div class="head-row"><b>${e("calendar.mailbox")}</b></div>
      <joe-car-mailbox
        .hass=${t}
        .t=${e}
        actionId=${this.actionId}
        ?saved=${n}
        .need=${this.need}
        .status=${this.mailbox}
      ></joe-car-mailbox>
      ${this.renderAllowed(e)} ${this.renderOwn(e, i, r)}`;
	}
	renderOwn(e, t, n) {
		let r = D`<div class="head-row">
      <ha-icon icon="mdi:calendar-import"></ha-icon><b>${e("calendar.own")}</b> ${l(e, "calendar_own")}
    </div>`;
		if (!n) return D`<div class="own" data-tipped>${r}<p class="hint">${e("calendar.own.after_save", { name: t })}</p></div>`;
		let i = this.links?.links[this.actionId], a = this.links?.external_url, o = i && a ? `${a.replace(/\/$/, "")}${i}` : null;
		return D`<div class="own" data-tipped>
      ${r}
      <p class="hint">${e("calendar.own.hint", { name: t })}</p>
      ${o ? D`<div class="link">
            <code>${o}</code>
            <button type="button" class="mini-btn" @click=${() => this.copy(o)}>
              <ha-icon icon=${this.copied ? "mdi:check" : "mdi:content-copy"}></ha-icon>${e(this.copied ? "calendar.copied" : "calendar.copy")}
            </button>
            <button type="button" class="mini-btn quiet" @click=${() => this.load(!0)}>
              <ha-icon icon="mdi:refresh"></ha-icon>${e("calendar.renew")}
            </button>
            ${l(e, "calendar_link")}
          </div>
          ${this.copyFailed ? D`<p class="hint bad">${e("calendar.copy_failed")}</p>` : j}` : D`<p class="hint">${e("calendar.no_external")}</p>`}
    </div>`;
	}
	async copy(e) {
		let t = !1;
		try {
			navigator.clipboard && window.isSecureContext && (await navigator.clipboard.writeText(e), t = !0);
		} catch {
			t = !1;
		}
		if (!t) {
			let n = document.createElement("textarea");
			n.value = e, n.setAttribute("readonly", ""), n.style.cssText = "position:fixed;top:0;left:0;opacity:0", document.body.append(n), n.select();
			try {
				t = document.execCommand("copy");
			} catch {
				t = !1;
			}
			n.remove();
		}
		if (this.copyFailed = !t, t) this.copied = !0, setTimeout(() => this.copied = !1, 2e3);
		else {
			let e = this.renderRoot.querySelector(".own code"), t = window.getSelection();
			if (e && t) {
				let n = document.createRange();
				n.selectNodeContents(e), t.removeAllRanges(), t.addRange(n);
			}
		}
	}
	renderAccount(e) {
		return D`<div class="part">
        <joe-calendar-flow .t=${e} variant="account" address=${this.need?.account?.address ?? ""}></joe-calendar-flow>
      </div>
      <div class="head-row"><b>${e("calendar.account")}</b></div>
      <joe-car-account
        .hass=${this.hass}
        .t=${e}
        actionId=${this.actionId}
        ?saved=${this.saved("account")}
        .need=${this.need}
        .status=${this.account}
        .apps=${this.apps}
      ></joe-car-account>
      ${this.renderAllowed(e, "account_allowed")} ${this.hass ? this.renderLegacy(e, this.hass) : j}`;
	}
	renderAllowed(e, t = "mail_allowed") {
		let n = this.need?.allowed ?? [];
		return D`<div class="part" data-tipped>
      <div class="head-row"><b>${e("mail.allowed")}</b> ${l(e, t)}</div>
      <p class="hint">${e("mail.allowed.hint")}</p>
      ${n.length ? D`<div class="chips">
            ${n.map((t) => D`<span class="chip">
                ${t}
                <button
                  type="button"
                  class="mini-btn quiet"
                  aria-label=${e("mail.allowed.remove", { rule: t })}
                  @click=${() => this.change({ allowed: n.filter((e) => e !== t) })}
                >
                  <ha-icon icon="mdi:close"></ha-icon>
                </button>
              </span>`)}
          </div>` : D`<div class="note warn"><ha-icon icon="mdi:account-alert-outline"></ha-icon><span>${e("mail.allowed.none")}</span></div>`}
      <form
        class="inline"
        @submit=${(e) => {
			e.preventDefault(), this.allow(this.sender);
		}}
      >
        <input
          class="input"
          type="text"
          placeholder=${e("mail.allowed.placeholder")}
          aria-label=${e("mail.allowed.add")}
          .value=${this.sender}
          @input=${(e) => this.sender = e.target.value}
          @change=${() => this.allow(this.sender)}
        />
        <button type="submit" class="mini-btn" ?disabled=${!this.sender.trim()}>${e("mail.allowed.add")}</button>
      </form>
    </div>`;
	}
	allow(e) {
		let t = this.need?.allowed ?? [], n = e.split(/[\s,;]+/).map((e) => e.trim().toLowerCase()).filter((e) => e && !t.includes(e));
		n.length && this.change({ allowed: [...t, ...new Set(n)] }), this.sender = "";
	}
	change(e) {
		this.dispatchEvent(new CustomEvent("joe-need", {
			detail: e,
			bubbles: !0,
			composed: !0
		}));
	}
};
d([b({ attribute: !1 })], z.prototype, "hass", void 0), d([b({ attribute: !1 })], z.prototype, "t", void 0), d([b()], z.prototype, "actionId", void 0), d([b({ attribute: !1 })], z.prototype, "savedSource", void 0), d([b({ attribute: !1 })], z.prototype, "need", void 0), d([b({ attribute: !1 })], z.prototype, "mailbox", void 0), d([b({ attribute: !1 })], z.prototype, "account", void 0), d([b({ attribute: !1 })], z.prototype, "apps", void 0), d([b()], z.prototype, "carName", void 0), d([T()], z.prototype, "links", void 0), d([T()], z.prototype, "copied", void 0), d([T()], z.prototype, "copyFailed", void 0), d([T()], z.prototype, "linksFailed", void 0), d([T()], z.prototype, "sender", void 0), u("joe-car-calendars", z);
//#endregion
//#region src/hot-water.ts
var kt = [
	"warmwasser",
	"brauchwasser",
	"trinkwasser",
	"boiler",
	"hot_water",
	"hot water",
	"dhw",
	"water_heater",
	"water heater"
], At = [
	"ausgang",
	"zirkulation",
	"rücklauf",
	"rucklauf",
	"ruecklauf",
	"vorlauf",
	"outlet",
	"return",
	"flow",
	"inlet"
], jt = [
	"switch",
	"input_boolean",
	"select",
	"input_select",
	"number",
	"input_number",
	"button",
	"script"
];
function Mt(e, t) {
	let n = e.states[t], r = String(n?.attributes.friendly_name ?? ""), i = e.entities?.[t]?.device_id, a = i ? e.devices?.[i] : void 0;
	return `${t} ${r} ${a?.name_by_user ?? a?.name ?? ""}`.toLowerCase().replaceAll("-", " ");
}
function Nt(e, t) {
	return [...kt, ...t].some((t) => e.includes(t));
}
function Pt(e) {
	return (e ?? "").toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((e) => e.length >= 5);
}
function Ft(e, t) {
	let n = Pt(t), r = [], i = [];
	for (let [t, a] of Object.entries(e.states)) {
		let o = t.split(".")[0], s = Mt(e, t);
		if (!Nt(s, n)) continue;
		let c = t.toLowerCase(), l = String(a.attributes.unit_of_measurement ?? "");
		if ((o === "sensor" || o === "number") && (l === "°C" || l === "°F")) {
			let e = (kt.some((e) => c.includes(e.replace(" ", "_"))) ? 2 : 1) - (At.some((e) => s.includes(e)) ? 2 : 0);
			r.push({
				entity_id: t,
				score: e
			});
		} else jt.includes(o) && i.push({
			entity_id: t,
			score: +(o === "switch" || o === "input_boolean")
		});
	}
	let a = (e) => e.sort((e, t) => t.score - e.score || e.entity_id.localeCompare(t.entity_id)).slice(0, 6).map((e, t) => ({
		entity_id: e.entity_id,
		confidence: t === 0 && e.score > 0 ? .7 : .5
	}));
	return {
		sensors: a(r),
		switches: a(i)
	};
}
//#endregion
//#region src/components/action-fields.ts
var It = [
	"eq",
	"ne",
	"lt",
	"le",
	"gt",
	"ge"
], Lt = {
	enabled: !1,
	soc_entity: null,
	range_entity: null,
	capacity_kwh: null,
	capacity_entity: null,
	odometer_entity: null,
	consumption_entity: null,
	reserve_km: 50,
	consumption: null,
	daily_km: null,
	persons: null,
	round_trip: !0,
	calendars: [],
	source: "ha",
	allowed: [],
	max_soc: 100
}, Rt = {
	vehicle_entity: null,
	connected_entity: null,
	soc_entity: null,
	range_entity: null,
	odometer_entity: null,
	cars: null,
	unknown: "ask",
	assume_car: null
}, zt = {
	reserve_km: [0, 1e3],
	consumption: [5, 60],
	daily_km: [0, 2e3],
	capacity_kwh: [.1, 300],
	max_soc: [20, 100]
}, Bt = {
	soc_entity: {
		filter: "soc",
		role: "soc",
		tip: "a_need_soc"
	},
	range_entity: {
		filter: "distance",
		role: "range",
		tip: "a_need_range"
	},
	capacity_entity: {
		filter: "car_energy",
		role: "capacity",
		tip: "a_need_capacity"
	},
	odometer_entity: {
		filter: "distance",
		role: "odometer",
		tip: "a_need_odometer"
	},
	consumption_entity: {
		filter: "consumption",
		role: "consumption",
		tip: "a_need_consumption"
	}
};
function Vt(e, t) {
	let n = {
		id: `${e}_${Date.now().toString(36)}`,
		name: t(`action.template.${e}`),
		kind: "switch",
		enabled: !0,
		entity_id: "",
		on_value: "on",
		reset: "previous",
		reset_value: null,
		lead_min: 0,
		auto: !0,
		forecast_below_kwh: null,
		conditions: [],
		power_kw: null,
		power_entity: null,
		consumer_id: null,
		priority: 3,
		sensor_entity: null,
		comfort: 45,
		maximum: 62,
		buffer: 3
	};
	return e === "ev" ? {
		...n,
		on_value: "now",
		lead_min: 3,
		forecast_below_kwh: 15,
		power_kw: 11,
		priority: 1,
		point: { ...Rt }
	} : e === "hot_water" ? {
		...n,
		kind: "target",
		forecast_below_kwh: 20,
		power_kw: .5,
		priority: 2
	} : n;
}
function Ht(e) {
	let t = e.entities?.connected ? [{
		entity_id: e.entities.connected,
		op: "eq",
		value: !0
	}] : [], n = e.entities ?? {};
	return {
		name: e.name,
		entity_id: e.mode_entity ?? "",
		conditions: t,
		power_entity: e.entities?.power ?? null,
		point: {
			...Rt,
			vehicle_entity: n.vehicle ?? null,
			connected_entity: n.connected ?? null,
			soc_entity: n.vehicle_soc ?? null,
			range_entity: n.vehicle_range ?? null,
			odometer_entity: n.vehicle_odometer ?? null
		}
	};
}
function Ut(e) {
	return e === "ev" || e === "car" ? "point" : e === "hot_water" ? "hot_water" : "night";
}
function Wt(e, t, n) {
	return t.entity_id ? t.kind === "target" && !t.sensor_entity ? e("action.problem.sensor") : "" : e("action.problem.entity");
}
function B(e, t, n, r) {
	return D`<div class="field" data-tipped>
    <div class="field-label">${t} ${l(e, n)}</div>
    ${r}
  </div>`;
}
function Gt(e, t, n) {
	let r = e.t, i = e.hass;
	return D`<div class="entity">
    <span>
      ${t ? D`<b>${_(i, t)}</b><small>${c(i, t, r.lang)}</small>` : D`<small>${r("find.none")}</small>`}
    </span>
    <button type="button" class="mini-btn" @click=${n}>
      <ha-icon icon="mdi:magnify"></ha-icon>${r(t ? "review.change" : "review.choose")}
    </button>
  </div>`;
}
function Kt(e) {
	let t = e.trim();
	if (t === "on" || t === "an") return !0;
	if (t === "off" || t === "aus") return !1;
	let n = Number(t.replace(",", "."));
	return t !== "" && Number.isFinite(n) ? n : t;
}
function qt(e, t, n) {
	let r = Math.round(Number.parseFloat(e.target.value));
	return Math.min(n, Math.max(t, Number.isFinite(r) ? r : t));
}
function Jt(e, t, n, r) {
	let i = e.t, a = t.split(".", 1)[0], o = e.hass?.states[t]?.attributes.options ?? [];
	if (["select", "input_select"].includes(a) && o.length) return D`<select class="input" aria-label=${i("action.f.value")} @change=${(e) => r(e.target.value)}>
      ${o.map((e) => D`<option value=${e} ?selected=${n === e}>${e}</option>`)}
    </select>`;
	if ([
		"switch",
		"input_boolean",
		"light",
		"fan"
	].includes(a)) {
		let e = n === !0 || n === "on";
		return D`<div class="seg" role="group" aria-label=${i("action.f.value")}>
      <button type="button" aria-pressed=${String(e)} @click=${() => r("on")}>${i("action.value.on")}</button>
      <button type="button" aria-pressed=${String(!e)} @click=${() => r("off")}>${i("action.value.off")}</button>
    </div>`;
	}
	return D`<input
    class="input"
    type="text"
    aria-label=${i("action.f.value")}
    .value=${n == null ? "" : String(n)}
    @change=${(e) => r(Kt(e.target.value))}
  />`;
}
function Yt(e, t, n) {
	return D`<button type="button" class="switch" role="switch" aria-checked=${String(t)} aria-label=${e} @click=${n}></button>`;
}
function Xt(e, t, n, r) {
	return D`<a class="mini-btn quiet go-link" href=${E(e || "/energy-joe", t)} aria-label=${r ?? n} @click=${C(t)}
    >${n}</a
  >`;
}
function Zt(e) {
	let t = e.t, n = e.draft;
	return B(t, t("action.f.name"), "a_name", D`<input
      class="input"
      type="text"
      maxlength="60"
      .value=${n.name}
      @change=${(t) => e.setDraft({ name: t.target.value.trim() || n.name })}
    />`);
}
function Qt(e) {
	let t = e.t, n = e.draft;
	return B(t, t("action.f.kind"), "a_kind", D`<div class="seg" role="group" aria-label=${t("action.f.kind")}>
      ${["switch", "target"].map((r) => D`<button type="button" aria-pressed=${String(n.kind === r)} @click=${() => e.setDraft({ kind: r })}>
            ${t(`action.kind.${r}`)}
          </button>`)}
    </div>`);
}
function $t(e) {
	let t = e.t, n = e.draft;
	return D`${B(t, t("action.f.entity"), "a_entity", Gt(e, n.entity_id, () => hn(e)))}
    ${n.entity_id ? B(t, t("action.f.on_value"), "a_on_value", Jt(e, n.entity_id, n.on_value, (t) => e.setDraft({ on_value: t }))) : j}
    ${B(t, t("action.f.reset"), "a_reset", D`<div class="row">
        <div class="seg" role="group" aria-label=${t("action.f.reset")}>
          ${["previous", "fixed"].map((r) => D`<button type="button" aria-pressed=${String(n.reset === r)} @click=${() => e.setDraft({ reset: r })}>
                ${t(`action.reset.${r}`)}
              </button>`)}
        </div>
        ${n.reset === "fixed" && n.entity_id ? Jt(e, n.entity_id, n.reset_value ?? "", (t) => e.setDraft({ reset_value: t })) : j}
      </div>`)}
    ${B(t, t("action.f.lead"), "a_lead", D`<span class="unit-input">
        <input
          class="input"
          type="number"
          min="0"
          max="120"
          step="1"
          .value=${String(n.lead_min)}
          @change=${(t) => e.setDraft({ lead_min: qt(t, 0, 120) })}
        />
        <span class="unit">min</span>
      </span>`)}`;
}
function en(e) {
	let t = e.t, n = e.draft, r = (r, i) => D`<label>
    ${t(`action.f.${r}`)}
    <span class="unit-input">
      <input
        class="input"
        type="number"
        min="0"
        max="100"
        step="0.5"
        .value=${String(n[r])}
        @change=${(t) => {
		let n = Number.parseFloat(t.target.value);
		Number.isFinite(n) && e.setDraft({ [r]: n });
	}}
      />
      <span class="unit">${i}</span>
    </span>
  </label>`;
	return D`${B(t, t("action.f.sensor"), "a_sensor", Gt(e, n.sensor_entity ?? "", () => gn(e)))}
    ${B(t, t("action.f.temps"), "a_temps", D`<div class="temps">${r("comfort", "°C")} ${r("maximum", "°C")} ${r("buffer", "K")}</div>`)}`;
}
function tn(e) {
	let t = e.t, n = e.draft;
	return D`${B(t, t("action.f.auto"), "a_auto", D`<div class="row">
        ${Yt(t("action.f.auto"), n.auto, () => e.setDraft({ auto: !n.auto }))}
        <span>${t("action.f.below")}</span>
        <span class="unit-input">
          <input
            class="input"
            type="number"
            min="0"
            max="1000"
            step="1"
            ?disabled=${!n.auto}
            placeholder=${t("action.f.every_night")}
            .value=${n.forecast_below_kwh == null ? "" : String(n.forecast_below_kwh)}
            @change=${(t) => {
		let n = Number.parseFloat(t.target.value);
		e.setDraft({ forecast_below_kwh: Number.isFinite(n) && n > 0 ? n : null });
	}}
          />
          <span class="unit">kWh</span>
        </span>
      </div>`)}
    ${n.auto ? nn(e) : j}`;
}
function nn(e) {
	let t = e.t, n = e.hass, r = e.draft, i = (t, n) => e.setDraft({ conditions: (e.draft?.conditions ?? []).map((e, r) => r === t ? {
		...e,
		...n
	} : e) });
	return B(t, t("action.f.conditions"), "a_conditions", D`${r.conditions.map((r, a) => D`<div class="condition">
          <span><b>${_(n, r.entity_id)}</b></span>
          <select
            class="input"
            aria-label=${t("action.f.op")}
            @change=${(e) => i(a, { op: e.target.value })}
          >
            ${It.map((e) => D`<option value=${e} ?selected=${r.op === e}>${t(`action.op.${e}`)}</option>`)}
          </select>
          <input
            class="input"
            type="text"
            aria-label=${t("action.f.value")}
            .value=${String(r.value === !0 ? "on" : r.value === !1 ? "off" : r.value)}
            @change=${(e) => i(a, { value: Kt(e.target.value) })}
          />
          <button
            type="button"
            class="icon-btn"
            aria-label=${t("f.remove")}
            title=${t("f.remove")}
            @click=${() => e.setDraft({ conditions: (e.draft?.conditions ?? []).filter((e, t) => t !== a) })}
          >
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>`)}
      <button type="button" class="mini-btn" @click=${() => vn(e)}>
        <ha-icon icon="mdi:plus"></ha-icon>${t("action.f.condition.add")}
      </button>`);
}
function rn(e) {
	let t = e.t, n = e.draft, r = e.config?.consumers ?? [];
	return D`${B(t, t("action.f.power"), "a_power", D`<span class="unit-input">
        <input
          class="input"
          type="number"
          inputmode="decimal"
          min="0"
          max="100"
          step="0.1"
          placeholder=${t("f.unknown")}
          .value=${n.power_kw == null ? "" : String(n.power_kw)}
          @change=${(t) => {
		let n = Number.parseFloat(t.target.value);
		e.setDraft({ power_kw: Number.isFinite(n) && n > 0 ? n : null });
	}}
        />
        <span class="unit">kW</span>
      </span>`)}
    ${r.length ? B(t, t("action.f.consumer"), "a_consumer", D`<select class="input" @change=${(t) => e.setDraft({ consumer_id: t.target.value || null })}>
            <option value="" ?selected=${!n.consumer_id}>${t("action.f.consumer.none")}</option>
            ${r.map((e) => D`<option value=${e.id} ?selected=${n.consumer_id === e.id}>${e.name}</option>`)}
          </select>`) : j}
    ${B(t, t("action.f.priority"), "a_priority", D`<span class="unit-input">
        <input
          class="input"
          type="number"
          min="1"
          max="9"
          step="1"
          .value=${String(n.priority)}
          @change=${(t) => e.setDraft({ priority: qt(t, 1, 9) })}
        />
      </span>`)}`;
}
function an(e) {
	let t = e.t, n = e.draft;
	return B(t, t("action.f.enabled"), "a_enabled", Yt(t("action.f.enabled"), n.enabled, () => e.setDraft({ enabled: !n.enabled })));
}
function on(e, t) {
	e.setDraft({ need: {
		...Lt,
		...e.draft?.need ?? {},
		...t
	} });
}
function sn(e, t, n, r = "") {
	let i = e.t, a = e.draft?.need ?? Lt, [o, s] = zt[t], c = a[t];
	return D`<span class="unit-input">
    <input
      class="input"
      type="number"
      inputmode="decimal"
      min=${o}
      max=${s}
      step=${t === "consumption" || t === "capacity_kwh" ? "0.1" : t === "max_soc" ? "5" : "1"}
      placeholder=${r}
      aria-label=${i(`action.need.${t === "reserve_km" ? "reserve" : t === "daily_km" ? "daily" : t === "capacity_kwh" ? "capacity" : t}`)}
      .value=${c == null ? "" : String(c)}
      @change=${(n) => {
		let r = n.target, i = Number.parseFloat(r.value.replace(",", ".")), a = Number.isFinite(i) && i >= o && i <= s, c = t === "reserve_km" ? 50 : t === "max_soc" ? 100 : null;
		a || (r.value = c == null ? "" : String(c)), on(e, { [t]: a ? i : c });
	}}
    />
    <span class="unit">${n}</span>
  </span>`;
}
function cn(e) {
	let t = e.t, n = e.draft?.need ?? Lt;
	return D`${B(t, t("action.need"), "a_need", D`<div class="row">
          ${Yt(t("action.need"), n.enabled, () => on(e, { enabled: !(e.draft?.need ?? Lt).enabled }))}
          <span>${t(n.enabled ? "action.need.on" : "action.need.off")}</span>
        </div>
        <p class="field-hint">${t("action.need.hint")}</p>`)}
    ${n.enabled ? D`${B(t, t("action.need.reserve"), "a_need_reserve", sn(e, "reserve_km", "km"))}
        ${B(t, t("action.need.max_soc"), "a_need_max_soc", sn(e, "max_soc", "%"))}
        ${B(t, t("action.need.capacity"), "a_need_capacity", sn(e, "capacity_kwh", "kWh", t("action.need.from_sensor")))}
        ${B(t, t("action.need.consumption"), "a_need_consumption", sn(e, "consumption", "kWh/100 km", t("action.need.learned")))}
        ${B(t, t("action.need.daily"), "a_need_daily", sn(e, "daily_km", "km", t("action.need.learned")))}` : j}`;
}
function ln(e) {
	let t = e.t, n = e.draft?.need ?? Lt, r = (t) => Gt(e, n[t] ?? "", () => _n(e, t));
	return D`${B(t, t("action.need.soc"), "a_need_soc", r("soc_entity"))}
    ${B(t, t("action.need.range"), "a_need_range", r("range_entity"))}
    ${B(t, t("action.need.capacity_sensor"), "a_need_capacity_sensor", r("capacity_entity"))}
    ${B(t, t("action.need.consumption_sensor"), "a_need_consumption_sensor", r("consumption_entity"))}
    ${B(t, t("action.need.odometer"), "a_need_odometer", r("odometer_entity"))}`;
}
function un(e) {
	let t = e.t, n = e.draft, r = n.need ?? Lt, i = (e.config?.persons ?? []).filter((e) => e.calendars.length), a = i.map((e) => e.id), o = (t) => {
		let n = (e.draft?.need ?? Lt).persons ?? a, r = n.includes(t) ? n.filter((e) => e !== t) : [...n, t];
		on(e, { persons: a.every((e) => r.includes(e)) ? null : r });
	};
	return D`${B(t, t("action.need.persons"), "a_need_persons", i.length ? D`<ul class="people" role="group" aria-label=${t("action.need.persons")}>
            ${i.map((n) => {
		let i = r.persons == null || r.persons.includes(n.id);
		return D`<li>
                <button type="button" class="mini-btn ${i ? "go" : "quiet"}" aria-pressed=${String(i)} @click=${() => o(n.id)}>
                  <ha-icon icon=${i ? "mdi:check" : "mdi:minus"}></ha-icon>${n.name}
                </button>
                ${Xt(e.prefix, {
			tab: "household",
			section: "people",
			id: n.id
		}, t("action.need.person_open"), t("action.need.person_open_of", { name: n.name }))}
              </li>`;
	})}
          </ul>` : D`<p class="field-hint">${t("action.need.no_calendars")}</p>
            ${Xt(e.prefix, {
		tab: "household",
		section: "people"
	}, t("action.need.people_link"))}`)}
    ${B(t, t("action.need.calendars"), "a_need_calendars", D`<joe-car-calendars
        .hass=${e.hass}
        .t=${t}
        actionId=${n.id}
        .savedSource=${e.existing?.need?.enabled ? e.existing.need.source ?? "ha" : null}
        .need=${r}
        .mailbox=${e.mailboxes?.[n.id]}
        .account=${e.accounts?.[n.id]}
        .apps=${e.apps}
        carName=${n.name}
        @joe-need=${(t) => on(e, t.detail)}
      ></joe-car-calendars>`)}
    ${B(t, t("action.need.round_trip"), "a_need_round_trip", Yt(t("action.need.round_trip"), r.round_trip, () => on(e, { round_trip: !(e.draft?.need ?? Lt).round_trip })))}
    ${e.config?.routing.service ? j : D`<div class="note">
          <ha-icon icon="mdi:map-marker-distance"></ha-icon>
          <span>${t("action.need.no_routing")} ${Xt(e.prefix, {
		tab: "household",
		section: "travel"
	}, t("action.need.routing_link"))}</span>
        </div>`}`;
}
function dn(e, t) {
	e.setDraft({ point: {
		...Rt,
		...e.draft?.point ?? {},
		...t
	} });
}
function fn(e) {
	let t = e.t, n = e.draft?.point ?? Rt, r = e.config?.cars ?? [], i = r.map((e) => e.id), a = (t) => {
		let n = (e.draft?.point ?? Rt).cars ?? i, r = n.includes(t) ? n.filter((e) => e !== t) : [...n, t];
		dn(e, { cars: i.every((e) => r.includes(e)) ? null : r });
	};
	return D`${B(t, t("point.f.cars"), "point_cars", r.length ? D`<ul class="people" role="group" aria-label=${t("point.f.cars")}>
            ${r.map((e) => {
		let t = n.cars == null || n.cars.includes(e.id);
		return D`<li>
                <button type="button" class="mini-btn ${t ? "go" : "quiet"}" aria-pressed=${String(t)} @click=${() => a(e.id)}>
                  <ha-icon icon=${t ? "mdi:check" : "mdi:minus"}></ha-icon>${e.name}
                </button>
              </li>`;
	})}
          </ul>` : D`<p class="field-hint">${t("point.f.no_cars")}</p>`)}
    ${B(t, t("point.f.unknown"), "point_unknown", D`<div class="row">
          <div class="seg" role="group" aria-label=${t("point.f.unknown")}>
            ${["ask", "assume"].map((i) => D`<button
                  type="button"
                  aria-pressed=${String(n.unknown === i)}
                  ?disabled=${i === "assume" && !r.length}
                  @click=${() => dn(e, {
		unknown: i,
		assume_car: i === "assume" ? n.assume_car ?? r[0]?.id ?? null : n.assume_car
	})}
                >
                  ${t(`point.unknown.${i}`)}
                </button>`)}
          </div>
          ${n.unknown === "assume" && r.length ? D`<select
                class="input"
                aria-label=${t("point.f.assume")}
                @change=${(t) => dn(e, { assume_car: t.target.value })}
              >
                ${r.map((e) => D`<option value=${e.id} ?selected=${n.assume_car === e.id}>${e.name}</option>`)}
              </select>` : j}
        </div>
        <p class="field-hint">${t("point.f.unknown.hint")}</p>`)}`;
}
function pn(e, t) {
	let n = e.draft;
	return t === "point" ? D`${$t(e)} ${tn(e)} ${fn(e)} ${rn(e)} ${Zt(e)} ${an(e)}` : t === "hot_water" ? D`${Qt(e)} ${$t(e)} ${n.kind === "target" ? en(e) : j} ${tn(e)}
    ${rn(e)} ${Zt(e)} ${an(e)}` : D`${$t(e)} ${n.kind === "target" ? en(e) : j} ${tn(e)} ${rn(e)}
  ${Zt(e)} ${an(e)}`;
}
function mn(e) {
	if (e.draft?.kind !== "target" || !e.hass) return;
	let t = e.config?.consumers.find((t) => t.id === e.draft?.consumer_id);
	return Ft(e.hass, t?.name);
}
async function hn(e) {
	let t = e.t, n = (await L(e, {
		heading: t("action.pick.entity"),
		tip: "a_entity",
		filter: "writable",
		selected: e.draft?.entity_id ? [e.draft.entity_id] : [],
		suggestions: mn(e)?.switches
	}))?.selected[0];
	if (n) {
		let t = e.hass?.states[n]?.attributes.options ?? [], r = e.draft?.on_value;
		e.setDraft({
			entity_id: n,
			on_value: t.length && !t.includes(String(r)) ? t.includes("now") ? "now" : t[0] : r ?? "on"
		});
	}
}
async function gn(e) {
	let t = e.t, n = await L(e, {
		heading: t("action.pick.sensor"),
		tip: "a_sensor",
		filter: "temperature",
		selected: e.draft?.sensor_entity ? [e.draft.sensor_entity] : [],
		suggestions: mn(e)?.sensors
	});
	n?.selected[0] && e.setDraft({ sensor_entity: n.selected[0] });
}
async function _n(e, t) {
	let n = e.t, r = Bt[t], i = (e.discovery?.cars ?? []).map((e) => ({
		entity_id: e.entities[r.role] ?? "",
		confidence: e.confidence,
		reasons: e.reasons
	})).filter((e) => e.entity_id), a = await L(e, {
		heading: n(`action.need.pick.${r.role}`),
		tip: r.tip,
		filter: r.filter,
		selected: e.draft?.need?.[t] ? [e.draft.need[t]] : [],
		suggestions: Xe(i)
	});
	a && on(e, { [t]: a.selected[0] ?? null });
}
async function vn(e) {
	let t = e.t, n = (await L(e, {
		heading: t("action.pick.condition"),
		tip: "a_conditions",
		filter: "any",
		selected: []
	}))?.selected[0];
	if (n && e.draft) {
		let t = e.hass?.states[n]?.state, r = t === "on" || t === "off" ? t === "on" : t ?? "";
		e.setDraft({ conditions: [...e.draft.conditions, {
			entity_id: n,
			op: "eq",
			value: r
		}] });
	}
}
var yn = w`
  .entity {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    padding: 8px 12px;
    border-radius: 10px;
    background: var(--joe-surface-2);
  }
  .entity span {
    flex: 1;
    min-width: 0;
  }
  .entity b {
    font-weight: 600;
    overflow-wrap: anywhere;
  }
  .entity small {
    display: block;
    color: var(--joe-muted);
  }
  .row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
  .condition {
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) auto minmax(0, 0.8fr) auto;
    gap: 6px;
    align-items: center;
    padding: 6px 8px;
    border-radius: 10px;
    background: var(--joe-surface-2);
    margin-bottom: 6px;
  }
  .condition b {
    font-weight: 600;
    overflow-wrap: anywhere;
  }
  .temps {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
  }
  .temps label {
    display: grid;
    gap: 4px;
    font-size: 13.5px;
    font-weight: 600;
    color: var(--joe-ink-2);
  }
  .temps .unit-input {
    max-width: none;
  }
  .icon-btn {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border: 0;
    border-radius: 9px;
    cursor: pointer;
    background: transparent;
    color: var(--joe-ink-2);
  }
  .icon-btn:hover {
    background: var(--joe-surface);
  }
  .people {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 6px;
  }
  .people li {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px 10px;
  }
  a.go-link {
    text-decoration: none;
  }
  .note a.go-link {
    margin-top: 6px;
  }
  .fields-head {
    margin: 22px 0 0;
    padding-top: 14px;
    border-top: 1px solid var(--joe-line);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--joe-muted);
  }
  @media (pointer: coarse) {
    .icon-btn,
    a.go-link,
    .seg button {
      min-width: 44px;
      min-height: 44px;
    }
  }
  @media (max-width: 520px) {
    .temps {
      grid-template-columns: 1fr;
    }
    .condition {
      grid-template-columns: 1fr auto;
    }
  }
`, bn = /* @__PURE__ */ new Map();
function xn(e, t) {
	let n = (e, t) => JSON.stringify(e ?? null) === JSON.stringify(t ?? null), r = {};
	for (let i of Object.keys(t)) if (!(i === "id" || n(t[i], e[i]))) {
		if (i === "point" && t.point && e.point) {
			let i = {};
			for (let [r, a] of Object.entries(t.point)) n(a, e.point[r]) || (i[r] = a);
			r.point = i;
		} else r[i] = t[i];
	}
	return r;
}
function Sn(e, t) {
	let n = {
		...e,
		...t
	};
	return t.point && e.point && (n.point = {
		...e.point,
		...t.point
	}), n;
}
var Cn = class extends O {
	constructor(...e) {
		super(...e), this.prefix = A, this.section = "night", this.saving = !1, this.problem = "", this.version = 0;
	}
	static {
		this.styles = [
			k,
			yn,
			w`
      :host {
        display: block;
      }
      .steer-bar {
        position: sticky;
        bottom: 0;
        z-index: 1;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
        margin: 18px -4px 0;
        padding: 12px 4px;
        background: var(--joe-surface);
        border-top: 1px solid var(--joe-line);
      }
      .steer-bar .unsaved {
        flex-basis: 100%;
        color: var(--joe-ink-2);
        font-weight: 600;
      }
      .steer-bar .with-tip {
        gap: 8px;
      }
      :host > .field:first-child,
      :host > .fields > .field:first-child {
        margin-top: 0;
      }
    `
		];
	}
	get config() {
		return this.state?.config;
	}
	get mailboxes() {
		return this.state?.mailbox;
	}
	get accounts() {
		return this.state?.accounts;
	}
	get apps() {
		return this.state?.apps;
	}
	get existing() {
		return this.action;
	}
	get key() {
		return `${this.action?.id ?? ""}|${this.section}`;
	}
	get changes() {
		let e = bn.get(this.key);
		return e ? xn(e.base, e.draft) : {};
	}
	get draft() {
		let e = this.action;
		return e && bn.has(this.key) ? Sn(e, this.changes) : e;
	}
	get dirty() {
		let e = bn.get(this.key);
		return !!(e && !e.pending && this.action && Object.keys(xn(this.action, this.draft)).length);
	}
	setDraft(e) {
		let t = this.action, n = this.draft;
		t && n && (bn.set(this.key, {
			base: structuredClone(t),
			draft: {
				...n,
				...e
			},
			pending: !1
		}), this.problem = "", this.version++);
	}
	willUpdate(e) {
		e.has("action") && bn.get(this.key)?.pending && bn.delete(this.key);
	}
	render() {
		let { t: e, hass: t, draft: n } = this;
		return !e || !t || !n ? j : (this.version, D`<div class="fields">${pn(this, this.section)}</div>
      ${this.problem ? D`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.problem}</span></div>` : j}
      ${this.dirty ? D`<div class="steer-bar" role="region" aria-label=${e("action.steer.unsaved")}>
            <span class="unsaved">${e("action.steer.unsaved")}</span>
            <span class="with-tip" data-tipped>
              <button type="button" class="btn btn-primary" ?disabled=${this.saving} @click=${this.save}>${e("common.save")}</button>
              ${l(e, "a_save")}
            </span>
            <button type="button" class="btn btn-ghost" data-notip ?disabled=${this.saving} @click=${this.cancel}>${e("common.cancel")}</button>
          </div>` : j}`);
	}
	cancel() {
		bn.delete(this.key), this.problem = "", this.version++;
	}
	async save() {
		let e = this.draft, t = this.action;
		if (!e || !t || (this.problem = Wt(this.t, e, this.section), this.problem)) return;
		let n = xn(t, e);
		if (!Object.keys(n).length) {
			this.cancel();
			return;
		}
		let r = this.key;
		this.saving = !0;
		let i = await I(this, { actions: { [t.id]: n } });
		this.saving = !1, i && (bn.set(r, {
			base: structuredClone(t),
			draft: e,
			pending: !0
		}), this.version++);
	}
};
d([b({ attribute: !1 })], Cn.prototype, "hass", void 0), d([b({ attribute: !1 })], Cn.prototype, "t", void 0), d([b({ attribute: !1 })], Cn.prototype, "state", void 0), d([b({ attribute: !1 })], Cn.prototype, "discovery", void 0), d([b({ attribute: !1 })], Cn.prototype, "prefix", void 0), d([b({ attribute: !1 })], Cn.prototype, "action", void 0), d([b({ attribute: !1 })], Cn.prototype, "section", void 0), d([T()], Cn.prototype, "saving", void 0), d([T()], Cn.prototype, "problem", void 0), d([T()], Cn.prototype, "version", void 0);
var wn = class extends O {
	constructor(...e) {
		super(...e), this.asking = !1, this.busy = !1;
	}
	static {
		this.styles = [k, w`
      :host {
        display: block;
      }
      .ask {
        margin: 0 0 12px;
        font-weight: 600;
      }
      .row {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
      }
    `];
	}
	willUpdate(e) {
		e.has("action") && e.get("action")?.id !== this.action?.id && (this.asking = !1);
	}
	render() {
		let { t: e, action: t } = this;
		if (!e || !t) return j;
		let n = this.config?.consumers.find((e) => e.id === t.consumer_id), r = nt(t, n);
		return this.asking ? D`<div data-tipped>
      <p class="ask" role="alert">${e(`action.delete.ask.${r}`, { name: t.name })}</p>
      <div class="row">
        <button type="button" class="btn btn-danger" ?disabled=${this.busy} @click=${this.removeAction}>${e("action.delete.yes")}</button>
        <button type="button" class="btn btn-ghost" ?disabled=${this.busy} @click=${() => this.asking = !1}>
          ${e("action.delete.no")}
        </button>
        ${l(e, "a_delete")}
      </div>
    </div>` : D`<div class="row" data-tipped>
        <button type="button" class="btn btn-danger" @click=${() => this.asking = !0}>${e("action.delete")}</button>
        ${l(e, "a_delete")}
      </div>`;
	}
	async removeAction() {
		let e = this.action;
		if (!e) return;
		this.busy = !0;
		let t = await I(this, { actions: { [e.id]: null } });
		this.busy = !1, t && (this.asking = !1, this.dispatchEvent(new CustomEvent("joe-deleted", {
			detail: { id: e.id },
			bubbles: !0,
			composed: !0
		})), this.leave && x(this, this.leave, { replace: !0 }));
	}
};
d([b({ attribute: !1 })], wn.prototype, "t", void 0), d([b({ attribute: !1 })], wn.prototype, "config", void 0), d([b({ attribute: !1 })], wn.prototype, "action", void 0), d([b({ attribute: !1 })], wn.prototype, "leave", void 0), d([T()], wn.prototype, "asking", void 0), d([T()], wn.prototype, "busy", void 0);
var Tn = class extends O {
	constructor(...e) {
		super(...e), this.failed = !1;
	}
	static {
		this.styles = [k, w`
      :host {
        display: block;
      }
      .tonight {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 44px;
      }
      .tonight span {
        font-weight: 600;
      }
      .bad {
        margin: 6px 0 0;
        color: var(--joe-warn, var(--joe-crit));
      }
    `];
	}
	render() {
		let { t: e, state: t, action: n } = this;
		if (!e || !t || !n) return j;
		let r = t.plan?.window?.start, i = !!r && t.control?.tonight?.[n.id] === r, a = `tonight-${n.id}`;
		return D`<div class="tonight" data-tipped>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(i)}
          aria-labelledby=${a}
          ?disabled=${!r || !n.enabled}
          @click=${() => this.toggle(n.id, !i)}
        ></button>
        <span id=${a}>${e("devices.action.tonight")}</span>
        ${l(e, "action_tonight")}
      </div>
      ${this.failed ? D`<p class="bad" role="status">${e("error.action")}</p>` : j}`;
	}
	async toggle(e, t) {
		this.failed = !1;
		try {
			await this.hass?.callWS({
				type: "energy_joe/control/action_tonight",
				action_id: e,
				on: t
			});
		} catch {
			this.failed = !0;
		}
	}
};
d([b({ attribute: !1 })], Tn.prototype, "hass", void 0), d([b({ attribute: !1 })], Tn.prototype, "t", void 0), d([b({ attribute: !1 })], Tn.prototype, "state", void 0), d([b({ attribute: !1 })], Tn.prototype, "action", void 0), d([T()], Tn.prototype, "failed", void 0);
function En(e, t, n) {
	let r = t.plan?.actions?.find((e) => e.id === n.id), i = t.control?.actions?.[n.id], a = r?.target == null ? "" : v(e.lang, r.target, 0);
	if (!n.enabled) return e("devices.action.disabled");
	if (i?.reason === "boost") return e("devices.action.boost");
	if (i?.on) return n.kind === "target" ? e("devices.action.heating", {
		target: a,
		end: N(i.end)
	}) : e("devices.action.running", { end: N(i.end) });
	if (i?.reason === "reached") {
		let i = t.control?.tonight_target?.[n.id];
		return n.kind === "switch" && i && i.night === t.plan?.window?.start ? e("devices.action.reached_need", {
			target: v(e.lang, i.chosen, 0),
			unit: i.unit
		}) : n.kind === "switch" ? r?.need && a ? e("devices.action.reached_need", {
			target: a,
			unit: r.need.target_unit === "km" ? "km" : "%"
		}) : e("devices.action.reached_plain") : e("devices.action.reached", { target: a });
	}
	if (!r) return e("devices.action.no_plan");
	let o = t.mode === "simulation" ? e("devices.action.would") : "";
	if (r.run) return `${o}${n.kind === "target" ? e("devices.action.plan_target", {
		start: N(r.start),
		target: a
	}) : e("devices.action.plan_run", {
		start: N(r.start),
		end: N(r.end)
	})}`;
	let s = r.reasons[r.reasons.length - 1] ?? "manual_only";
	return e.optional(`devices.action.why.${s}`, {
		kwh: v(e.lang, t.plan?.meta?.tomorrow_kwh ?? 0, 0),
		temperature: v(e.lang, r.temperature ?? 0, 0)
	}) ?? s;
}
u("joe-action-steer", Cn), u("joe-action-delete", wn), u("joe-action-tonight", Tn);
//#endregion
//#region src/editors/action-editor.ts
var V = class extends O {
	constructor(...e) {
		super(...e), this.prefix = A, this.actionId = "", this.section = "", this.consumer = "", this.subtitle = "", this.found = "", this.saving = !1, this.problem = "", this.touched = !1;
	}
	static {
		this.styles = [
			k,
			yn,
			w`
      :host {
        display: block;
      }
      .sheet-sub {
        margin: -6px 0 4px;
        color: var(--joe-ink-2);
        font-weight: 600;
        overflow-wrap: anywhere;
      }
      .danger-zone {
        margin-top: 18px;
        padding-top: 14px;
        border-top: 1px solid var(--joe-line);
      }
    `
		];
	}
	get existing() {
		return this.config?.actions.find((e) => e.id === this.actionId);
	}
	get layout() {
		return this.actionId.startsWith("new:") ? Ut(this.actionId.slice(4)) : this.openLayout ?? "night";
	}
	setDraft(e) {
		this.draft && (this.draft = {
			...this.draft,
			...e
		}, this.problem = "", this.touched = !0);
	}
	willUpdate(e) {
		let t = this.actionId.startsWith("new:") && !this.touched && e.has("discovery") && !!this.discovery;
		if ((!this.draft || t) && this.t && (e.has("actionId") || e.has("config") || t)) {
			if (this.actionId.startsWith("new:")) {
				let e = Vt(this.actionId.slice(4), this.t), [t, n] = this.found.split(/:(.*)/s), r = this.config?.actions ?? [], i = (this.discovery?.wallboxes ?? []).filter((e) => e.is_car), a = t === "wallbox" ? i.find((e) => (e.device_id ?? e.name) === n) : i.find((e) => !r.some((t) => t.id === `ev_${e.device_id}` || e.mode_entity && t.entity_id === e.mode_entity));
				this.actionId === "new:ev" && a && Object.assign(e, Ht(a));
				let o = this.config?.consumers.filter((e) => e.kind === "hot_water") ?? [];
				this.actionId === "new:hot_water" && o.length === 1 && (e.consumer_id = o[0].id);
				let s = this.config?.consumers.find((e) => e.id === this.consumer);
				s && (e.name = s.name, e.consumer_id = s.id, e.power_entity = s.power_entity ?? null), this.draft = e, this.touched = !1;
			} else if (this.existing) {
				this.draft = structuredClone(this.existing);
				let e = this.config?.consumers.find((e) => e.id === this.existing?.consumer_id);
				this.openLayout = Ut(nt(this.existing, e));
			}
		}
	}
	render() {
		let { t: e, hass: t, draft: n } = this;
		if (!e || !t || !n) return j;
		let r = this.existing, i = e(r ? "action.title" : `action.title.${this.actionId.slice(4)}`);
		return D`<div class="sheet-title">${y(i)}</div>
      ${this.subtitle ? D`<p class="sheet-sub">${this.subtitle}</p>` : j}
      ${pn(this, this.layout)}
      ${this.problem ? D`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.problem}</span></div>` : j}
      <div class="actions">
        <span data-tipped class="row">
          <button type="button" class="btn btn-primary" ?disabled=${this.saving} @click=${this.save}>${e("common.save")}</button>
          ${l(e, "a_save")}
        </span>
        <button type="button" class="btn btn-ghost" data-notip @click=${this.close}>${e("common.cancel")}</button>
      </div>
      ${r ? D`<div class="danger-zone">
            <joe-action-delete .t=${e} .config=${this.config} .action=${r} @joe-deleted=${this.close}></joe-action-delete>
          </div>` : j}`;
	}
	async save() {
		let e = this.draft;
		if (!e || (this.problem = Wt(this.t, e, this.layout), this.problem)) return;
		let { id: t, ...n } = e;
		this.saving = !0;
		let r = await I(this, { actions: { [t]: n } });
		this.saving = !1, r && this.close();
	}
	close() {
		this.dispatchEvent(new CustomEvent("joe-close", {
			bubbles: !0,
			composed: !0
		}));
	}
};
d([b({ attribute: !1 })], V.prototype, "hass", void 0), d([b({ attribute: !1 })], V.prototype, "mailboxes", void 0), d([b({ attribute: !1 })], V.prototype, "accounts", void 0), d([b({ attribute: !1 })], V.prototype, "apps", void 0), d([b({ attribute: !1 })], V.prototype, "t", void 0), d([b({ attribute: !1 })], V.prototype, "config", void 0), d([b({ attribute: !1 })], V.prototype, "discovery", void 0), d([b({ attribute: !1 })], V.prototype, "prefix", void 0), d([b()], V.prototype, "actionId", void 0), d([b()], V.prototype, "section", void 0), d([b()], V.prototype, "consumer", void 0), d([b()], V.prototype, "subtitle", void 0), d([b()], V.prototype, "found", void 0), d([T()], V.prototype, "draft", void 0), d([T()], V.prototype, "saving", void 0), d([T()], V.prototype, "problem", void 0), u("joe-action-editor", V);
//#endregion
//#region src/components/look-back.ts
function Dn(e, t, n = "EUR", r = !1) {
	return new Intl.NumberFormat(e.lang, {
		style: "currency",
		currency: n,
		signDisplay: r ? "exceptZero" : "auto"
	}).format(Math.abs(t) < .005 ? 0 : t);
}
function H(e, t, n = 1) {
	return new Intl.NumberFormat(e, {
		minimumFractionDigits: n,
		maximumFractionDigits: n
	}).format(t);
}
function On(e, t = "EUR") {
	return new Intl.NumberFormat(e, {
		style: "currency",
		currency: t
	}).formatToParts(0).find((e) => e.type === "currency")?.value ?? t;
}
function kn(e) {
	try {
		return new Intl.DateTimeFormat("en-CA", {
			timeZone: e,
			year: "numeric",
			month: "2-digit",
			day: "2-digit"
		}).format(/* @__PURE__ */ new Date());
	} catch {
		return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	}
}
function U(e, t, n = "long") {
	let r = /* @__PURE__ */ new Date(`${t.slice(0, 10)}T12:00:00Z`), i = n === "long" ? {
		day: "numeric",
		month: "long"
	} : n === "weekday" ? {
		weekday: "short",
		day: "numeric",
		month: "numeric"
	} : {
		day: "numeric",
		month: "numeric"
	};
	return new Intl.DateTimeFormat(e, {
		...i,
		timeZone: "UTC"
	}).format(r);
}
function An(e, t) {
	return t === 1 ? e("learn.nights.one") : e("learn.nights.many", { count: t });
}
//#endregion
//#region src/pages/devices/battery-fields.ts
var jn = [
	"name",
	"capacity_kwh",
	"soc_entity",
	"power",
	"max_charge_w",
	"max_discharge_w",
	"floor_soc",
	"priority"
], Mn = class extends O {
	constructor(...e) {
		super(...e), this.show = "all";
	}
	static {
		this.styles = [k, w`
      :host {
        display: block;
      }
      .field:first-child {
        margin-top: 0;
      }
      .entity {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        padding: 8px 12px;
        border-radius: 10px;
        background: var(--joe-surface-2);
      }
      .entity span {
        flex: 1 1 160px;
        min-width: 0;
      }
      .entity b {
        font-weight: 600;
        overflow-wrap: anywhere;
      }
      .entity small {
        display: block;
        color: var(--joe-muted);
      }
      .limits {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }
      .limits label {
        display: grid;
        gap: 4px;
        font-size: 13.5px;
        font-weight: 600;
        color: var(--joe-ink-2);
      }
      .limits .unit-input {
        max-width: none;
      }
      .field-row {
        flex-wrap: wrap;
      }
      .learned {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
      }
      @media (pointer: coarse) {
        .input {
          min-height: 44px;
        }
      }
      @media (max-width: 480px) {
        .limits {
          grid-template-columns: 1fr;
        }
      }
    `];
	}
	get values() {
		let e = this.battery;
		return this.draft ? this.draft : e ? Object.fromEntries(jn.map((t) => [t, e[t]])) : void 0;
	}
	get capacityUnknown() {
		let e = this.battery;
		return this.unknown === void 0 ? !!(e && this.config?.answers[`capacity:${e.id}`] === "unknown") : this.unknown;
	}
	render() {
		let { t: e, hass: t, config: n, battery: r } = this, i = this.values;
		if (!e || !t || !n || !r || !i) return j;
		let a = this.show !== "power", o = this.show !== "steer";
		return D`${a ? this.renderName(e, r, i) : j} ${a ? this.renderCapacity(e, r, i) : j}
    ${o ? this.renderSensors(e, r, i) : j} ${a ? this.renderLimits(e, r, i) : j}`;
	}
	renderName(e, t, n) {
		return this.field(e("f.battery.name"), "f_battery_name", D`<input
        class="input"
        type="text"
        maxlength="60"
        aria-label=${e("f.battery.name")}
        .value=${n.name}
        @change=${(e) => {
			let t = e.target, r = t.value.trim();
			if (!r) {
				t.value = n.name;
				return;
			}
			this.change({ name: r });
		}}
      />`);
	}
	renderCapacity(e, t, n) {
		let r = this.hass, i = this.config, a = this.capacityUnknown, o = f(r, t.capacity_entity), s = i.learned?.battery_models?.[t.id];
		return this.field(e("f.battery.capacity"), "q_capacity", D`<div class="field-row">
          <span class="unit-input">
            <input
              class="input"
              type="number"
              inputmode="decimal"
              min="0.1"
              max="1000"
              step="0.01"
              aria-label=${e("f.battery.capacity")}
              .value=${n.capacity_kwh == null ? "" : String(n.capacity_kwh)}
              placeholder=${o == null ? e("f.unknown") : v(e.lang, o, 2)}
              @change=${(e) => {
			let t = Number.parseFloat(e.target.value.replace(",", "."));
			this.change({ capacity_kwh: Number.isFinite(t) && t > 0 ? t : null }, !1);
		}}
            />
            <span class="unit">kWh</span>
          </span>
          <button
            type="button"
            class="mini-btn ${a ? "go" : ""}"
            aria-pressed=${String(a)}
            @click=${() => a ? this.change({}, !1) : this.change({ capacity_kwh: null }, !0)}
          >
            ${e("ask.idk_learn")}
          </button>
        </div>
        ${o == null ? j : D`<p class="field-hint">${e("f.battery.capacity.read", { value: v(e.lang, o, 2) })}</p>`}
        ${s ? D`<p class="field-hint learned">
              ${S(e, { source: "learned" })}
              ${e("battery.page.capacity.learned", { value: H(e.lang, s.capacity_kwh, 1) })}
            </p>` : a ? D`<p class="field-hint">${e("battery.page.capacity.learning")}</p>` : j}`, S(e, P(i, `batteries[${t.id}].capacity_kwh`)));
	}
	renderSensors(e, t, n) {
		let r = this.hass, i = this.config;
		return D`${this.field(e("f.battery.soc"), "f_battery_soc", this.entityBox(e, n.soc_entity, c(r, n.soc_entity, e.lang), () => this.pickSoc(n)), S(e, P(i, `batteries[${t.id}].soc_entity`)))}
    ${this.field(e("f.battery.power"), "f_battery_power", this.entityBox(e, n.power?.entity_id ?? null, this.powerText(e, n.power), () => this.pickPower(n)), S(e, P(i, `batteries[${t.id}].power`)))}`;
	}
	renderLimits(e, t, n) {
		let r = this.config, i = this.floor;
		return D`${this.field(e("f.battery.limits"), "f_battery_limits", D`<div class="limits">
        <label>${e("f.battery.max_charge")} ${this.kwInput(e, n.max_charge_w, "max_charge_w")}</label>
        <label>${e("f.battery.max_discharge")} ${this.kwInput(e, n.max_discharge_w, "max_discharge_w")}</label>
      </div>`)}
    ${this.field(e("f.battery.floor"), "f_battery_floor", D`<span class="unit-input">
          <input
            class="input"
            type="number"
            inputmode="decimal"
            min="0"
            max="100"
            step="1"
            aria-label=${e("f.battery.floor")}
            .value=${n.floor_soc == null ? "" : String(n.floor_soc)}
            placeholder=${i?.device == null ? e("f.unknown") : v(e.lang, i.device, 0)}
            @change=${(e) => {
			let t = Number.parseFloat(e.target.value.replace(",", "."));
			this.change({ floor_soc: Number.isFinite(t) ? Math.min(100, Math.max(0, t)) : null });
		}}
          />
          <span class="unit">%</span>
        </span>
        ${i?.device == null ? n.floor_soc == null ? D`<div class="note warn"><ha-icon icon="mdi:help-circle-outline"></ha-icon><span>${e("f.battery.floor.ask")}</span></div>` : j : D`<p class="field-hint">${e("f.battery.floor.read", { value: v(e.lang, i.device, 0) })}</p>`}`, S(e, P(r, `batteries[${t.id}].floor_soc`)))}
    ${r.batteries.length > 1 ? this.field(e("f.battery.priority"), "f_battery_priority", D`<span class="unit-input">
            <input
              class="input"
              type="number"
              inputmode="numeric"
              min="1"
              max="9"
              step="1"
              aria-label=${e("f.battery.priority")}
              .value=${String(n.priority)}
              @change=${(e) => {
			let t = Math.round(Number.parseFloat(e.target.value));
			this.change({ priority: Math.min(9, Math.max(1, Number.isFinite(t) ? t : 1)) });
		}}
            />
          </span>`) : j}`;
	}
	field(e, t, n, r) {
		let i = this.t;
		return D`<div class="field" data-tipped>
      <div class="field-label">${e} ${l(i, t)} ${r ?? j}</div>
      ${n}
    </div>`;
	}
	entityBox(e, t, n, r) {
		let i = this.hass;
		return D`<div class="entity">
      <span>
        ${t ? D`<b>${_(i, t)}</b><small>${n}</small>` : D`<small>${e("find.none")}</small>`}
      </span>
      <button type="button" class="mini-btn" @click=${r}>
        <ha-icon icon="mdi:magnify"></ha-icon>${e(t ? "review.change" : "review.choose")}
      </button>
    </div>`;
	}
	kwInput(e, t, n) {
		return D`<span class="unit-input">
      <input
        class="input"
        type="number"
        inputmode="decimal"
        min="0"
        max="1000"
        step="0.1"
        placeholder=${e("f.unknown")}
        .value=${t == null ? "" : String(Math.round(t / 100) / 10)}
        @change=${(e) => {
			let t = Number.parseFloat(e.target.value.replace(",", "."));
			this.change({ [n]: Number.isFinite(t) && t > 0 ? Math.round(t * 1e3) : null });
		}}
      />
      <span class="unit">kW</span>
    </span>`;
	}
	powerText(e, t) {
		let n = this.hass, r = re(n, t);
		if (!t || r === null) return t ? c(n, t.entity_id, e.lang) : "";
		let i = v(e.lang, Math.abs(r), 2);
		return e(r >= 0 ? "pick.preview.charge" : "pick.preview.discharge", { value: i });
	}
	async pickSoc(e) {
		let t = this.t, n = (await L(this, {
			heading: t("pick.battery.title"),
			tip: "pick_battery",
			filter: "soc",
			selected: [e.soc_entity]
		}))?.selected[0];
		n && n !== e.soc_entity && this.change({ soc_entity: n });
	}
	async pickPower(e) {
		let t = this.t, n = await L(this, {
			heading: t("pick.battery_power.title"),
			tip: "pick_battery_power",
			filter: "power",
			selected: e.power ? [e.power.entity_id] : [],
			measurement: {
				invert: e.power?.invert ?? !1,
				role: "battery"
			}
		});
		n?.selected[0] && this.change({ power: {
			entity_id: n.selected[0],
			invert: n.invert,
			minus_entity_id: null
		} });
	}
	change(e, t) {
		let n = this.battery, r = this.config;
		if (!n || !r) return;
		let i = t === void 0 || t === this.capacityUnknown ? void 0 : t;
		if (this.draft) {
			this.dispatchEvent(new CustomEvent("joe-battery-change", { detail: {
				change: e,
				unknown: i
			} }));
			return;
		}
		let a = Object.fromEntries(Object.entries(e).filter(([e, t]) => JSON.stringify(n[e]) !== JSON.stringify(t))), o = {};
		Object.keys(a).length && (o.batteries = { [n.id]: a }), i !== void 0 && (o.answers = { [`capacity:${n.id}`]: i ? "unknown" : null }), Object.keys(o).length && I(this, o);
	}
};
d([b({ attribute: !1 })], Mn.prototype, "hass", void 0), d([b({ attribute: !1 })], Mn.prototype, "t", void 0), d([b({ attribute: !1 })], Mn.prototype, "config", void 0), d([b({ attribute: !1 })], Mn.prototype, "battery", void 0), d([b({ attribute: !1 })], Mn.prototype, "floor", void 0), d([b({ attribute: !1 })], Mn.prototype, "draft", void 0), d([b({ attribute: !1 })], Mn.prototype, "unknown", void 0), d([b()], Mn.prototype, "show", void 0), u("joe-battery-fields", Mn);
//#endregion
//#region src/components/battery-notes.ts
function Nn(e, t, n) {
	let r = n?.night_slow?.[t.id];
	if (!r) return j;
	let i = {
		measured: v(e.lang, r.measured_w / 1e3, 1),
		planned: v(e.lang, r.planned_w / 1e3, 1)
	}, a = e.optional(`devices.slow.${t.adapter}`, i) ?? e("devices.slow", i);
	return D`<div class="note warn" role="status"><ha-icon icon="mdi:speedometer-slow"></ha-icon><span>${a}</span></div>`;
}
function Pn(e) {
	return e.startsWith("cannot.") || e.startsWith("check.") || e.startsWith("no_charge.") || e === "no_level";
}
function Fn(e, t, n = "") {
	return t?.length ? D`<div class="battery-notes" style="display:grid;gap:8px;margin:12px 0" data-tipped>
    ${t.map((t) => {
		let r = (t.entities ?? []).map((e) => `„${e.name}“`).join(", ") || e("bnote.entities.none"), i = e.optional(`bnote.${t.code}`, {
			name: t.name ?? n,
			entities: r
		}) ?? e(t.code.startsWith("cannot.") ? "bnote.cannot.levers" : "bnote.other"), a = Pn(t.code);
		return D`<div class="note ${a ? "warn" : ""}" role=${a ? "status" : j}>
        <ha-icon icon=${a ? "mdi:information-off-outline" : "mdi:information-outline"}></ha-icon>
        <span
          >${i}
          <div class="note-actions">${l(e, "battery_notes")}</div></span
        >
      </div>`;
	})}
  </div>` : j;
}
//#endregion
//#region src/types.ts
var In = [
	"welcome",
	"scan",
	"questions",
	"done"
], Ln = [
	"min_soc",
	"grid_charge",
	"charge_target",
	"mode",
	"charge_power",
	"discharge_power",
	"charge_limit",
	"charge_limit_enabled",
	"discharge_limit",
	"discharge_limit_enabled"
], Rn = [
	"normal",
	"force_charge",
	"hold",
	"force_discharge"
], zn = [
	"charge",
	"hold",
	"block",
	"block_charge",
	"block_discharge",
	"cap",
	"release"
], Bn = [
	"charge",
	"hold",
	"block",
	"block_charge",
	"block_discharge",
	"cap",
	"release"
], Vn = [
	"home_office",
	"office",
	"travel",
	"vacation",
	"guests",
	"home"
], Hn = [
	"climate",
	"heat_pump",
	"electric_heating",
	"hot_water",
	"ev",
	"comfort",
	"household",
	"submeter",
	"other"
];
function Un(e) {
	let t = e.filter((e) => e.kind !== "submeter" && (e.kind === "ev" && (e.runs ?? "auto") !== "always" || e.runs === "surplus" || e.runs === "cheap")), n = new Set(t.map((e) => e.energy_entity).filter(Boolean));
	return t.filter((e) => !e.included_in || !n.has(e.included_in));
}
var Wn = [
	"forecast",
	"consumption",
	"battery",
	"hot_water",
	"car"
], Gn = [
	"normal",
	"holiday",
	"away",
	"home_office"
], Kn = ["heat", "cool"], qn = "fronius_modbus", Jn = "fronius", Yn = {
	port: 502,
	unit: 1
};
function Xn(e) {
	return e ? `${e.host.trim()}:${e.port}/${e.unit}` : "";
}
var Zn = {
	min_soc: "level",
	charge_target: "level",
	grid_charge: "toggle",
	mode: "option",
	charge_power: "setpoint",
	discharge_power: "setpoint",
	discharge_limit: "setpoint",
	discharge_limit_enabled: "toggle",
	charge_limit: "setpoint",
	charge_limit_enabled: "toggle",
	system_charge_limit: "setpoint",
	system_charge_limit_enabled: "toggle",
	system_discharge_limit: "setpoint",
	system_manual_mode: "toggle",
	allow_charge: "toggle",
	allow_discharge: "toggle",
	block_charge: "toggle",
	block_discharge: "toggle"
}, Qn = new Set(Bn), $n = [
	"charge",
	"hold",
	"block",
	"cap"
], er = 300, tr = {
	target: "{target}",
	power: "{power}",
	floor: "{floor}",
	percent: "{percent}"
};
function nr(e) {
	return {
		adapter: e.adapter,
		controls: structuredClone(e.controls),
		mode_options: structuredClone(e.mode_options),
		steps: structuredClone(e.steps),
		modbus: e.modbus ? { ...e.modbus } : null
	};
}
function rr(e, t, n) {
	let r = ![
		"none",
		"generic",
		"steps"
	].includes(t.adapter), i = r ? e?.adapter === t.adapter ? e.prepare : n?.prepare ?? [] : [], a = r && !Object.keys(t.steps).length ? n?.steps ?? t.steps : t.steps;
	return {
		...t,
		steps: a,
		prepare: i ?? []
	};
}
function ir(e) {
	if (e instanceof Error) return e.message;
	let t = e;
	return t?.message || t?.code || String(e);
}
function ar(e) {
	return typeof e == "string" && /^\{\w+\}$/.test(e);
}
function or(e) {
	let t = e.trim();
	if (t === "") return null;
	let n = Number(t.replace(",", "."));
	return t.startsWith("{") || Number.isNaN(n) ? t : n;
}
function sr(e, t, n) {
	if (e.param) return `{${e.param}}`;
	let r = e.value;
	if (ar(r)) return r;
	if (typeof r == "boolean") return r ? "on" : "off";
	if (typeof r == "number") {
		let e = (e) => e != null && e !== 0 && Math.abs(e - r) < 1e-6;
		if (t === "charge" && e(n.target)) return "{target}";
		if ((t === "charge" || t === "cap") && e(n.power_w)) return "{power}";
		if (t === "charge" && n.power_w && Math.abs(-n.power_w - r) < 1e-6) return "{power_neg}";
		if (t === "hold" && e(n.floor)) return "{floor}";
		if (t === "cap" && e(n.percent)) return "{percent}";
	}
	return r ?? null;
}
function cr(e) {
	return e.map((e) => e.service ? {
		kind: "call",
		service: e.service,
		data: e.data ?? {}
	} : {
		kind: "set",
		entity_id: e.entity_id,
		value: e.value ?? null
	});
}
var W = class extends O {
	constructor(...e) {
		super(...e), this.dirty = !1, this.busy = !1, this.previewState = "idle", this.previewFailure = null, this.open = /* @__PURE__ */ new Set(), this.editing = /* @__PURE__ */ new Set(), this.probing = null, this.probeResults = {}, this.probeErrors = {}, this.modbusChecking = !1, this.modbusChecked = null, this.previewSeq = 0, this.modbusSeq = 0, this.previewFor = "", this.editStart = /* @__PURE__ */ new Map(), this.resetToProfile = () => {
			let e = this.value, t = this.preview?.roles ?? [];
			if (!e || !t.length) return;
			let n = { ...e.controls }, r = new Set(t.map((e) => e.found).filter((e) => !!e));
			for (let [e, i] of Object.entries(n)) {
				let a = t.some((t) => t.role === e && t.found === i);
				i && r.has(i) && !a && delete n[e];
			}
			for (let e of t) e.found && (n[e.role] = e.found);
			let i = this.found?.mode_options ? { ...this.found.mode_options } : n.mode ? e.mode_options : {};
			this.emit({
				...e,
				controls: n,
				mode_options: i
			});
		}, this.takeSuggestion = () => {
			let e = this.found?.suggested;
			e && this.emit({
				...this.value,
				adapter: "generic",
				controls: { ...e.controls },
				mode_options: { ...e.mode_options }
			});
		};
	}
	static {
		this.styles = [k, w`
      :host {
        display: block;
      }
      .seg {
        flex-wrap: wrap;
        border-radius: 14px;
      }
      .rows {
        display: grid;
        gap: 6px;
        margin-top: 12px;
      }
      .row {
        display: grid;
        grid-template-columns: minmax(120px, 0.8fr) minmax(0, 1.6fr) auto;
        gap: 8px;
        align-items: center;
        padding: 6px 10px;
        border-radius: 10px;
        background: var(--joe-surface-2);
      }
      .row label,
      .row .label {
        font-weight: 600;
        font-size: 13.5px;
        min-width: 0;
      }
      .row .label small,
      .row .entity small {
        display: block;
        font-weight: 400;
        color: var(--joe-muted);
        overflow-wrap: anywhere;
      }
      .row .label .kind {
        display: inline;
        color: var(--joe-ink-2);
      }
      .row .entity {
        min-width: 0;
      }
      .row .entity b {
        display: block;
        font-weight: 600;
        overflow-wrap: anywhere;
      }
      .row .entity .found {
        color: var(--joe-warn);
      }
      .row .chip {
        margin-top: 4px;
      }
      .row.dev {
        box-shadow: inset 0 0 0 1.5px var(--joe-warn-soft);
      }
      .row .buttons {
        display: flex;
        gap: 4px;
      }
      .icon-btn {
        display: grid;
        place-items: center;
        width: 34px;
        height: 34px;
        border: 0;
        border-radius: 9px;
        cursor: pointer;
        background: transparent;
        color: var(--joe-ink-2);
      }
      .icon-btn:hover {
        background: var(--joe-surface);
      }
      .icon-btn:active {
        transform: scale(0.95);
      }
      .sub {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 16px 0 4px;
        font-weight: 700;
      }
      .hint {
        margin: 4px 0 0;
      }
      .ready {
        margin-top: 12px;
      }
      .ready .line {
        display: block;
        margin-bottom: 2px;
        color: var(--joe-ink-2);
      }
      .ready .lines div {
        margin-top: 4px;
        font-weight: 600;
      }
      .note.reset .note-actions {
        align-items: center;
      }

      /* The operations: one collapsible row each. */
      .ops {
        display: grid;
        gap: 8px;
        margin-top: 10px;
      }
      .op {
        border-radius: 12px;
        background: var(--joe-surface-2);
        padding: 4px 6px 4px 4px;
      }
      .op.off {
        box-shadow: inset 0 0 0 1.5px var(--joe-line);
        background: transparent;
      }
      .op-row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: center;
        gap: 4px;
      }
      .op-head {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        gap: 8px;
        width: 100%;
        min-height: 44px;
        padding: 6px 6px;
        border: 0;
        border-radius: 10px;
        background: transparent;
        text-align: left;
        cursor: pointer;
        transition: background 0.12s;
      }
      .op-head:hover {
        background: var(--joe-surface);
      }
      .op-head:active {
        transform: scale(0.995);
      }
      .op-head > ha-icon {
        color: var(--joe-muted);
      }
      .op-title {
        min-width: 0;
        display: grid;
        gap: 2px;
      }
      .op-title b {
        font-weight: 700;
        overflow-wrap: anywhere;
      }
      .op-title .chip {
        margin-left: 6px;
        vertical-align: middle;
      }
      .op-title .chip.both {
        background: transparent;
        box-shadow: inset 0 0 0 1.5px var(--joe-line-2);
        color: var(--joe-ink-2);
      }
      .op-title small {
        color: var(--joe-ink-2);
        font-size: 13px;
      }
      .op-status {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        font-weight: 600;
        white-space: nowrap;
      }
      .op-status.ok {
        color: var(--joe-good);
      }
      .op-status.bad {
        color: var(--joe-crit);
      }
      .op-status ha-icon {
        --mdc-icon-size: 16px;
      }
      .op-body {
        padding: 2px 8px 10px 10px;
        display: grid;
        gap: 10px;
      }
      .op-why {
        margin: 0;
        color: var(--joe-crit);
        font-size: 14px;
      }
      .op-steps {
        margin: 0;
        padding: 0;
        list-style: none;
        display: grid;
        gap: 6px;
        font-size: 14px;
      }
      .op-steps li {
        display: grid;
        grid-template-columns: 24px minmax(0, 1fr);
        gap: 6px;
        align-items: start;
      }
      .op-steps .n {
        color: var(--joe-muted);
        font-variant-numeric: tabular-nums;
        font-weight: 600;
      }
      .op-steps .what {
        min-width: 0;
        overflow-wrap: anywhere;
      }
      .op-steps .what .role {
        color: var(--joe-ink-2);
      }
      .op-steps .what .now {
        color: var(--joe-muted);
      }
      .op-steps .arrow {
        margin: 0 4px;
        color: var(--joe-muted);
      }
      .op-steps .what .keep {
        color: var(--joe-ink-2);
      }
      .op-restore {
        display: grid;
        gap: 4px;
        padding-top: 8px;
        border-top: 1px dashed var(--joe-line);
      }
      .op-restore > small {
        font-weight: 600;
        color: var(--joe-ink-2);
      }
      .op-note {
        display: flex;
        gap: 8px;
        align-items: flex-start;
        margin: 0;
        font-size: 13.5px;
        color: var(--joe-ink-2);
      }
      .op-note ha-icon {
        --mdc-icon-size: 16px;
        color: var(--joe-info);
        margin-top: 2px;
      }
      .op-actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px 8px;
      }
      .op-actions .last {
        font-size: 12.5px;
        color: var(--joe-muted);
      }
      .op-actions .last.ok {
        color: var(--joe-good);
      }
      .op-actions .last.bad {
        color: var(--joe-crit);
      }
      .probe {
        display: grid;
        gap: 6px;
        padding: 10px 12px;
        border-radius: 10px;
        background: var(--joe-surface);
        font-size: 14px;
      }
      .probe.bad {
        box-shadow: inset 0 0 0 1.5px var(--joe-crit-soft);
      }
      .probe ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 4px;
      }
      .probe li {
        display: grid;
        grid-template-columns: 20px minmax(0, 1fr);
        gap: 6px;
        align-items: start;
      }
      .probe li ha-icon {
        --mdc-icon-size: 16px;
        margin-top: 2px;
      }
      .probe li.ok ha-icon {
        color: var(--joe-good);
      }
      .probe li.bad ha-icon {
        color: var(--joe-crit);
      }
      .probe li.info ha-icon {
        color: var(--joe-info);
      }
      /* "Fronius über Modbus": the address of the inverter and what it answers. */
      .modbus {
        display: grid;
        gap: 10px;
        margin-top: 12px;
      }
      .modbus-head {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px 8px;
      }
      .modbus-text {
        margin: 0;
        font-size: 14px;
        color: var(--joe-ink-2);
      }
      .modbus-fields {
        display: grid;
        grid-template-columns: minmax(0, 2fr) minmax(90px, 1fr) minmax(90px, 1fr);
        gap: 8px;
      }
      .modbus-field {
        display: grid;
        gap: 6px;
        min-width: 0;
      }
      .modbus-field .field-label {
        font-size: 13.5px;
      }
      .modbus-field .input {
        min-width: 0;
      }
      .modbus-hosts {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;
        font-size: 13.5px;
        color: var(--joe-ink-2);
      }
      @media (max-width: 520px) {
        .modbus-fields {
          grid-template-columns: 1fr 1fr;
        }
        .modbus-field.host {
          grid-column: 1 / -1;
        }
      }
      .probe li small {
        display: block;
        color: var(--joe-ink-2);
        overflow-wrap: anywhere;
      }
      .probe .problem {
        margin: 0;
        color: var(--joe-crit);
      }
      /* The same list in edit mode: every row a card with name, value and tools. */
      .editor {
        display: grid;
        gap: 10px;
      }
      .editor .add {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .op-steps.edit {
        gap: 8px;
      }
      .op-steps li.edit {
        grid-template-columns: 24px minmax(0, 1fr) auto;
        gap: 6px 8px;
        padding: 6px 6px 8px 8px;
        border-radius: 10px;
        background: var(--joe-surface);
      }
      .op-steps li.edit .n {
        padding-top: 9px;
      }
      .op-steps li.edit .what {
        display: grid;
        gap: 6px;
        justify-items: start;
      }
      .edit .who {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0 4px;
        min-width: 0;
        max-width: 100%;
      }
      .edit .who .role {
        padding: 7px 0;
      }
      .name-btn {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        min-height: 34px;
        max-width: 100%;
        padding: 4px 8px 4px 6px;
        border: 0;
        border-radius: 8px;
        background: transparent;
        color: var(--joe-ink);
        font: inherit;
        text-align: left;
        cursor: pointer;
        transition: background 0.12s;
      }
      .name-btn b {
        font-weight: 600;
        overflow-wrap: anywhere;
        text-decoration: underline dotted var(--joe-line-2);
        text-decoration-thickness: 1.5px;
        text-underline-offset: 3px;
      }
      .name-btn ha-icon {
        --mdc-icon-size: 16px;
        flex: none;
        color: var(--joe-muted);
      }
      .name-btn:hover {
        background: var(--joe-surface-2);
      }
      .name-btn:hover ha-icon {
        color: var(--joe-ink-2);
      }
      .name-btn:active {
        transform: scale(0.98);
      }
      .edit .tools {
        display: flex;
        align-items: center;
        gap: 2px;
      }
      .edit .icon-btn:hover:not([disabled]) {
        background: var(--joe-surface-2);
      }
      .edit .icon-btn[disabled] {
        opacity: 0.3;
        cursor: not-allowed;
      }
      .edit .icon-btn[disabled]:active {
        transform: none;
      }
      .seg.onoff {
        flex-wrap: nowrap;
        border-radius: 999px;
      }
      .seg.onoff button {
        min-height: 32px;
        padding: 4px 14px;
        font-size: 13.5px;
      }
      .value-number {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;
        max-width: 100%;
      }
      .value-number .unit-input {
        width: 150px;
      }
      .value-number .unit-input .input {
        padding-right: 42px;
      }
      .value-number .input,
      .value-select,
      .value-text {
        min-height: 38px;
        padding: 6px 10px;
      }
      .value-select,
      .value-text {
        width: auto;
        max-width: 100%;
      }
      .ph {
        display: inline-flex;
        align-items: center;
        padding: 0;
        border: 0;
        background: transparent;
        font: inherit;
        cursor: pointer;
      }
      .ph .chip {
        transition: background 0.12s, color 0.12s;
      }
      .ph:hover .chip {
        background: var(--joe-line);
        color: var(--joe-ink);
      }
      .ph:active .chip {
        transform: scale(0.97);
      }
      .ph[aria-pressed="true"] .chip {
        background: var(--joe-ink);
        color: var(--joe-bg);
      }
      .op-restore .own-restore {
        font-weight: 500;
      }
      @media (pointer: coarse) {
        .icon-btn {
          width: 44px;
          height: 44px;
        }
        .name-btn,
        .seg.onoff button,
        .value-number .input,
        .value-select,
        .value-text,
        .ph {
          min-height: 44px;
        }
        .ph {
          min-width: 44px;
          justify-content: center;
        }
        .op-steps li.edit .n {
          padding-top: 14px;
        }
        .edit .who .role {
          padding: 12px 0;
        }
      }
      @media (max-width: 520px) {
        .row {
          grid-template-columns: 1fr auto;
        }
        .op-steps li.edit {
          grid-template-columns: 24px minmax(0, 1fr);
        }
        .edit .tools {
          grid-column: 2;
        }
        .row label,
        .row .label {
          grid-column: 1 / -1;
        }
        .op-head {
          grid-template-columns: auto minmax(0, 1fr);
        }
        .op-status {
          grid-column: 2;
          justify-self: start;
        }
      }
    `];
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.previewTimer !== void 0 && (clearTimeout(this.previewTimer), this.previewTimer = void 0), this.previewSeq++;
	}
	get profileKey() {
		let e = this.battery, t = this.found, n = t && t.controllable && t.adapter !== "none" ? t.adapter : null;
		return e?.adapter === qn ? n ?? Jn : e && ![
			"none",
			"generic",
			"steps"
		].includes(e.adapter) ? e.adapter : n;
	}
	get modbusOffered() {
		let e = this.battery?.adapter;
		return e === qn || e === Jn || this.found?.integration === Jn || this.found?.adapter === Jn;
	}
	get modbusSaved() {
		return this.battery?.adapter === qn;
	}
	get modbusPending() {
		return this.modbusSaved && this.value?.adapter === qn && !Object.keys(this.battery?.controls ?? {}).length;
	}
	get choice() {
		let e = this.value?.adapter ?? "none";
		return e === "none" ? "watch" : e === "generic" ? "generic" : e === "steps" ? "steps" : e === qn ? "modbus" : "profile";
	}
	get profileName() {
		let e = this.preview?.profile?.key ?? (this.choice === "profile" || this.choice === "modbus" ? this.value?.adapter : void 0) ?? "";
		return this.preview?.profile?.name ?? this.profiles?.[e] ?? e;
	}
	get roleProfile() {
		let e = this.value?.adapter ?? "";
		return this.preview?.profile?.key ?? ([
			"none",
			"generic",
			"steps"
		].includes(e) ? "" : e);
	}
	roleName(e, t) {
		let n = this.roleProfile;
		return (n ? e.optional(`role.${n}.${t}`) : void 0) ?? e.optional(`role.${t}`) ?? t;
	}
	updated(e) {
		if (e.has("probeRunning") && e.get("probeRunning") && !this.probeRunning) {
			this.refreshPreview();
			return;
		}
		(e.has("value") || e.has("battery") || e.has("hass")) && this.schedulePreview();
	}
	refreshPreview() {
		this.previewFor = "", this.schedulePreview();
	}
	schedulePreview() {
		let { value: e, battery: t, hass: n } = this;
		if (!e || !t || !n) return;
		if (e.adapter === "none" || e.adapter === qn && !this.modbusSaved) {
			this.previewFor = "", this.previewSeq++, this.preview = void 0, this.previewState = "idle";
			return;
		}
		let r = {
			adapter: e.adapter,
			controls: e.controls,
			mode_options: e.mode_options,
			steps: e.steps,
			prepare: e.prepare ?? []
		}, i = `${t.id}|${JSON.stringify(r)}`;
		if (i === this.previewFor) return;
		let a = !this.previewFor;
		this.previewFor = i, this.previewTimer !== void 0 && clearTimeout(this.previewTimer), this.previewTimer = window.setTimeout(() => void this.fetchPreview(t.id, r), a ? 0 : er);
	}
	async fetchPreview(e, t) {
		let n = this.hass;
		if (!n) return;
		let r = ++this.previewSeq;
		this.previewState = "loading";
		try {
			let i = await n.callWS({
				type: "energy_joe/battery/preview",
				battery_id: e,
				draft: t
			});
			if (r !== this.previewSeq) return;
			if (i?.error) {
				this.previewFailure = {
					error: i.error,
					code: i.code,
					detail: i.detail
				}, this.previewState = "error";
				return;
			}
			this.preview = i, this.previewFailure = null, this.previewState = "ok";
		} catch (e) {
			if (r !== this.previewSeq) return;
			this.previewFailure = { error: ir(e) }, this.previewState = "error";
		}
	}
	failureText(e) {
		let t = this.previewFailure;
		if (!t) return "";
		let n = t.detail || t.error;
		return t.code && e.optional(`preview.error.${t.code}`, { detail: n }) || e("preview.error", { error: t.error });
	}
	render() {
		let { t: e, value: t } = this;
		if (!e || !t) return j;
		let n = [
			"watch",
			...this.profileKey ? ["profile"] : [],
			...this.modbusOffered ? ["modbus"] : [],
			"generic",
			"steps"
		], r = this.found?.suggested, i = this.choice, a = i !== "watch" && (i !== "modbus" || this.modbusSaved), o = i === "profile" || i === "generic" || i === "modbus" && this.modbusSaved;
		return D`<div class="choose">
        <div class="seg" role="group" aria-label=${e("f.battery.control")}>
          ${n.map((t) => D`<button type="button" aria-pressed=${String(i === t)} @click=${() => this.choose(t)}>
                ${t === "profile" ? e("f.battery.control.profile", { name: this.profiles?.[this.profileKey ?? ""] ?? this.profileKey ?? "" }) : e(`f.battery.control.${t}`)}
              </button>`)}
        </div>
      </div>
      ${i === "modbus" ? this.renderModbus(e, t) : j}
      ${i === "watch" ? Fn(e, this.found?.notes) : j}
      ${i === "watch" && r?.complete ? D`<div class="note" data-tipped>
            <ha-icon icon="mdi:lightbulb-on-outline"></ha-icon>
            <span
              >${e("f.battery.control.suggested")}
              <div class="note-actions">
                <button type="button" class="mini-btn go" @click=${this.takeSuggestion}>${e("f.battery.control.take")}</button>
                ${l(e, "control_roles")}
              </div></span
            >
          </div>` : j}
      ${i === "watch" ? D`<p class="field-hint hint">${e("preview.watch")}</p>` : j}
      ${i === "profile" ? Fn(e, this.found?.notes) : j}
      ${a ? this.renderOperations(e, t) : j}
      ${o ? this.renderRoles(e, t) : j}
      ${a ? this.renderSummary(e) : j}
      ${a ? D`<p class="field-hint">${e("f.battery.control.retest")}</p>` : j}`;
	}
	renderModbus(e, t) {
		let n = {
			host: "",
			...Yn,
			...t.modbus ?? {}
		}, r = this.modbusSaved, i = Xn(n), a = i === this.modbusChecked || r && i === Xn(this.battery?.modbus), o = (this.modbusCheck?.hosts ?? []).filter((e) => e !== n.host), s = this.profileName || this.profiles?.[qn] || qn, c = (e, t, r) => (i) => {
			let a = i.target, o = Number.parseInt(a.value, 10);
			if (!Number.isFinite(o) || o < t || o > r) {
				a.value = String(n[e]);
				return;
			}
			this.setModbus(e === "port" ? { port: o } : { unit: o });
		}, u = (e) => {
			e.key === "Enter" && (e.preventDefault(), e.target.blur());
		};
		return D`<div class="modbus" data-tipped>
      <div class="modbus-head">
        <span class="chip read"><ha-icon icon="mdi:lan-connect"></ha-icon>${s}</span>
        ${r ? D`<button type="button" class="mini-btn quiet" @click=${() => this.choose("profile")}>
                <ha-icon icon="mdi:undo-variant"></ha-icon>${e("modbus.back")}
              </button>
              ${l(e, "modbus_back")}` : j}
      </div>
      <p class="modbus-text">${e("modbus.why")}</p>
      <p class="modbus-text">${e("modbus.what")}</p>
      <div class="note">
        <ha-icon icon="mdi:wrench-outline"></ha-icon>
        <span>${e("modbus.setup")} ${e("modbus.exclusive")}</span>
      </div>
      <div class="modbus-fields">
        <div class="modbus-field host">
          <label class="field-label" for="modbus-host">${e("modbus.host")} ${l(e, "modbus_host")}</label>
          <input
            id="modbus-host"
            class="input"
            type="text"
            inputmode="url"
            autocomplete="off"
            spellcheck="false"
            placeholder=${e("modbus.host.placeholder")}
            .value=${n.host}
            @change=${(e) => this.setModbus({ host: e.target.value.trim() })}
            @keydown=${u}
          />
        </div>
        <div class="modbus-field">
          <label class="field-label" for="modbus-port">${e("modbus.port")} ${l(e, "modbus_port")}</label>
          <input id="modbus-port" class="input" type="number" inputmode="numeric" min="1" max="65535" step="1" .value=${String(n.port)} @change=${c("port", 1, 65535)} @keydown=${u} />
        </div>
        <div class="modbus-field">
          <label class="field-label" for="modbus-unit">${e("modbus.unit")} ${l(e, "modbus_unit")}</label>
          <input id="modbus-unit" class="input" type="number" inputmode="numeric" min="0" max="255" step="1" .value=${String(n.unit)} @change=${c("unit", 0, 255)} @keydown=${u} />
        </div>
      </div>
      ${o.length ? D`<div class="modbus-hosts">
            <span>${e("modbus.hosts")}</span>
            ${o.map((e) => D`<button type="button" class="mini-btn" @click=${() => this.setModbus({ host: e })}>${e}</button>`)}
          </div>` : j}
      <div class="op-actions">
        <button type="button" class="mini-btn go" ?disabled=${this.modbusChecking} @click=${() => void this.checkModbus(n)}>
          <ha-icon icon="mdi:lan-check"></ha-icon>${e("modbus.check")}
        </button>
        ${l(e, "modbus_check")}
        ${this.modbusChecking ? D`<span class="last" role="status">${e("modbus.checking")}</span>` : j}
      </div>
      ${this.modbusCheck && !this.modbusChecking ? this.renderModbusResult(e, this.modbusCheck) : j}
      ${!a && !this.modbusChecking ? D`<div class="note warn" role="status"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("modbus.unchecked")}</span></div>` : j}
      ${r ? j : D`<p class="field-hint hint">${e("modbus.after_save")}</p>`}
    </div>`;
	}
	renderModbusResult(e, t) {
		if (!t.ok) {
			let n = t.problem ?? "unknown", r = {
				host: t.host ?? "",
				port: t.port ?? Yn.port,
				problem: n,
				detail: t.detail ?? ""
			}, i = n === "connect" || n === "timeout" ? e("modbus.problem.connect", r) : n.startsWith("illegal_") ? e("modbus.problem.illegal", r) : e.optional(`modbus.problem.${n}`, r) ?? e("modbus.problem.other", r);
			return D`<div class="probe bad" role="status"><p class="problem">${i}</p></div>`;
		}
		let n = (t, n = 0) => t == null ? "–" : v(e.lang, t, n), r = (t) => e(t ? "op.step.on" : "op.step.off"), i = [
			t.model || e("modbus.found.inverter"),
			t.version ? e("modbus.found.version", { version: t.version }) : "",
			t.serial ? e("modbus.found.serial", { serial: t.serial }) : ""
		].filter(Boolean).join(" · "), a = t.kind && e.optional(`modbus.kind.${t.kind}`) || t.kind || "", o = t.status && e.optional(`modbus.status.${t.status}`) || t.status || e("modbus.status.unknown");
		return D`<div class="probe ok" role="status">
      <ul>
        <li class="ok">
          <ha-icon icon="mdi:check-circle"></ha-icon>
          <span><b>${e("modbus.found", { what: i })}</b><small>${e("modbus.found.layout", {
			kind: a,
			base: n(t.base)
		})}</small></span>
        </li>
        <li class="info">
          <ha-icon icon="mdi:flash-outline"></ha-icon>
          <span
            >${t.max_power_w == null ? e("modbus.found.max_power.none") : e("modbus.found.max_power", { power: n(t.max_power_w) })}
            ${t.inverter_w == null ? j : D`<small>${e("modbus.found.inverter_w", { power: n(t.inverter_w) })}</small>`}</span
          >
        </li>
        <li class="info">
          <ha-icon icon="mdi:battery-heart-variant"></ha-icon>
          <span
            >${e("modbus.found.state", {
			level: n(t.level_pct),
			status: o,
			reserve: n(t.reserve_pct),
			charge: n(t.charge_rate_pct, 1),
			discharge: n(t.discharge_rate_pct, 1),
			grid: r(t.grid_charging)
		})}
            <small>${e("modbus.found.bits", {
			charge: r(t.charge_limited),
			discharge: r(t.discharge_limited)
		})}</small></span
          >
        </li>
      </ul>
    </div>`;
	}
	async checkModbus(e) {
		let t = this.hass;
		if (!t) return;
		let n = ++this.modbusSeq;
		this.modbusChecking = !0;
		try {
			let r = { type: "energy_joe/modbus/check" };
			e?.host.trim() && (r.host = e.host.trim()), e && (r.port = e.port, r.unit = e.unit);
			let i = await t.callWS(r);
			if (n !== this.modbusSeq) return;
			this.modbusCheck = {
				...i,
				hosts: i.hosts ?? []
			}, i.ok && (this.modbusChecked = Xn({
				host: i.host ?? e?.host ?? "",
				port: i.port ?? e?.port ?? Yn.port,
				unit: i.unit ?? e?.unit ?? Yn.unit
			}));
			let a = i.ok && i.host || i.hosts?.[0] || i.host;
			a && !this.value?.modbus?.host.trim() && this.setModbus({ host: a });
		} catch (e) {
			if (n !== this.modbusSeq) return;
			this.modbusCheck = {
				ok: !1,
				problem: "error",
				detail: ir(e),
				hosts: []
			};
		} finally {
			n === this.modbusSeq && (this.modbusChecking = !1);
		}
	}
	setModbus(e) {
		let t = this.value, n = {
			host: "",
			...Yn,
			...t.modbus ?? {},
			...e
		};
		this.emit({
			...t,
			modbus: n
		});
	}
	operations(e) {
		let t = this.preview;
		return t?.operations?.length ? t.operations : zn.map((t) => {
			let n = e.steps[t];
			return {
				op: t,
				possible: !!n?.length,
				why: null,
				source: n ? "own" : "none",
				params: {},
				steps: n ? cr(n) : [],
				restore: [],
				note: null
			};
		});
	}
	renderOperations(e, t) {
		let n = this.previewState === "loading", r = this.previewState === "error" ? this.failureText(e) : "";
		return D`<div class="sub" data-tipped>${e("preview.title")} ${l(e, "operations")}</div>
      ${this.choice === "steps" ? D`<p class="field-hint hint">${e("preview.steps_tab")}</p>` : j}
      ${this.dirty ? D`<p class="field-hint hint" role="status">${e("preview.dirty")}</p>` : j}
      ${this.modbusPending ? D`<div class="note" role="status"><ha-icon icon="mdi:progress-clock"></ha-icon><span>${e("modbus.pending")}</span></div>` : j}
      ${r ? D`<div class="note warn" role="status"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${r}</span></div>` : j}
      ${n ? D`<p class="field-hint hint" role="status">${e("preview.loading")}</p>` : j}
      <div class="ops">
        ${this.operations(t).filter((e) => !this.folded(e)).map((n) => this.renderOperation(e, t, n))}
      </div>`;
	}
	folded(e) {
		return e.op === "hold" && e.same_as === "block";
	}
	get holdFolded() {
		return (this.preview?.operations ?? []).some((e) => this.folded(e));
	}
	renderOperation(e, t, n) {
		let r = n.op, i = this.open.has(r), a = this.editing.has(r), o = a || (this.preview ? n.source === "own" : !!t.steps[r]), s = n.steps.length, c = e.optional(`tip.op_${r}.title`) ? `op_${r}` : "operations", u = this.sourceChip(e, n), d = r === "block" && this.holdFolded ? D`<span class="chip both">${e("op.block.both")}</span>` : j;
		return D`<div class="op ${n.possible ? "" : "off"}" data-tipped>
      <div class="op-row">
        <button type="button" class="op-head" aria-expanded=${String(i)} @click=${() => this.toggle(r)}>
          <ha-icon icon=${i ? "mdi:chevron-down" : "mdi:chevron-right"}></ha-icon>
          <span class="op-title">
            <span><b>${e.optional(`op.${r}`) ?? r}</b>${u}${d}</span>
            ${this.example(e, n) ? D`<small>${this.example(e, n)}</small>` : j}
          </span>
          <span class="op-status ${n.possible ? "ok" : "bad"}">
            <ha-icon icon=${n.possible ? "mdi:check-circle" : "mdi:minus-circle-outline"}></ha-icon>
            ${n.possible ? s === 1 ? e("op.steps.one") : s ? e("op.steps.many", { count: s }) : e("op.possible") : e("op.impossible")}
          </span>
        </button>
        ${l(e, c)}
      </div>
      ${i ? D`<div class="op-body">
            ${!n.possible && n.why ? D`<p class="op-why">${this.whyText(e, n.why)}</p>` : j}
            ${a ? this.renderEditor(e, t, r, n) : this.renderSteps(e, n)}
            ${n.note ? this.renderNote(e, n.note) : j}
            ${this.renderActions(e, n, o, a)}
            ${this.renderProbe(e, r)}
          </div>` : j}
    </div>`;
	}
	sourceChip(e, t) {
		switch (t.source) {
			case "profile": return D`<span class="chip read">${e("op.source.profile", { name: this.profileName })}</span>`;
			case "generic": return D`<span class="chip">${e("op.source.generic")}</span>`;
			case "own": return D`<span class="chip user">${e("op.source.own")}</span>`;
			case "service": return D`<span class="chip read">${e("op.source.service", { name: this.profileName })}</span>`;
			default: return j;
		}
	}
	example(e, t) {
		let n = t.params ?? {}, r = (t) => v(e.lang, t ?? 0, 0);
		switch (t.op) {
			case "charge": return n.target == null && n.power_w == null ? "" : e(n.power_by === "device" ? "op.example.charge.device" : "op.example.charge", {
				target: r(n.target),
				power: r(n.power_w),
				name: this.profileName || e("modbus.found.inverter")
			});
			case "hold": return n.floor == null ? "" : e("op.example.hold", { floor: r(n.floor) });
			case "cap": {
				let i = t.steps.find((e) => e.kind === "set" && (e.param === "power" || e.param === "percent"));
				return i?.param === "power" && typeof i.value == "number" ? e("op.example.cap.power", { power: r(i.value) }) : i?.param === "power" && n.power_w != null && n.percent != null ? e("op.example.cap.power", { power: r(n.power_w * n.percent / 100) }) : n.percent == null ? "" : e("op.example.cap.percent", { percent: r(n.percent) });
			}
			case "guard_charge":
			case "guard_discharge": return n.seconds == null ? "" : e("op.example.guard", { seconds: r(n.seconds) });
			default: return "";
		}
	}
	whyText(e, t) {
		return e.optional(`why.${t}`) ?? e("why.other", { code: t });
	}
	renderNote(e, t) {
		let n = this.profileName || e("op.note.device"), r = e.optional(`op.note.${t}`, { name: n }) ?? e("op.note.other", { code: t });
		return D`<p class="op-note"><ha-icon icon="mdi:information-outline"></ha-icon><span>${r}</span></p>`;
	}
	renderSteps(e, t) {
		let n = this.hass, r = t.params ?? {};
		return D`${t.steps.length ? D`<ol class="op-steps">
          ${t.steps.map((t, n) => D`<li>
              <span class="n">${n + 1}.</span>
              <span class="what">${this.stepText(e, t, r)}</span>
            </li>`)}
        </ol>` : t.possible ? D`<p class="field-hint hint">${e("op.steps.none")}</p>` : j}
    ${t.restore?.length ? D`<div class="op-restore">
          <small>${e("op.restore.title")}</small>
          <ol class="op-steps">
            ${t.restore.map((t, i) => D`<li>
                <span class="n">${i + 1}.</span>
                <span class="what"
                  >${this.rolePrefix(e, t.role, t.name || _(n, t.entity_id))}<b
                    >${t.name || _(n, t.entity_id)}</b
                  ><span class="arrow">→</span
                  ><b>${t.value === "saved" ? e("op.step.saved") : this.valueText(e, t.value, this.unitOf(t.entity_id), r)}</b>
                  ${t.current == null ? j : D` <span class="now">(${e("op.step.now", { value: this.currentText(e, t.current, this.unitOf(t.entity_id)) })})</span>`}
                </span>
              </li>`)}
          </ol>
        </div>` : t.possible && t.steps.length && t.op !== "release" ? D`<div class="op-restore"><small>${e("op.restore.none")}</small></div>` : j}`;
	}
	stepText(e, t, n) {
		let r = this.hass;
		if (t.kind === "call" || t.service) {
			let r = Object.entries(t.data ?? {}).filter(([e]) => e !== "device_id" && e !== "entity_id").map(([t, r]) => `${e.optional(`op.data.${t}`) ?? t} ${this.valueText(e, r, e.optional(`op.data.unit.${t}`), n)}`);
			return D`<b>${e("op.step.service", { service: t.service ?? "" })}</b>${r.length ? D` <span class="now">(${r.join(" · ")})</span>` : j}`;
		}
		let i = t.name || (t.entity_id ? _(r, t.entity_id) : ""), a = t.role && t.role !== "prepare" ? this.rolePrefix(e, t.role, i) : j, o = t.unit ?? this.unitOf(t.entity_id);
		return t.keep ? D`${a}<b>${i}</b><span class="arrow">·</span
        ><span class="keep">${e("op.step.keep", { value: this.valueText(e, t.value, o, n) })}</span>` : D`${a}<b>${i}</b><span class="arrow">→</span
      ><b>${this.valueText(e, t.value, o, n)}</b>
      ${t.current == null ? j : D` <span class="now">(${e("op.step.now", { value: this.currentText(e, t.current, o) })})</span>`}`;
	}
	rolePrefix(e, t, n) {
		if (!t) return j;
		let r = this.roleName(e, t);
		return r === n ? j : D`<span class="role">${r} · </span>`;
	}
	valueText(e, t, n, r) {
		if (t === !0 || t === "on" || t === "true") return e("op.step.on");
		if (t === !1 || t === "off" || t === "false") return e("op.step.off");
		if (t == null) return "–";
		if (ar(t)) {
			let n = t.slice(1, -1), i = (n, r) => n == null ? t : `${v(e.lang, n, 0)} ${r}`;
			switch (n) {
				case "target": return i(r.target, "%");
				case "power": return i(r.power_w, "W");
				case "power_neg": return r.power_w == null ? t : `−${v(e.lang, r.power_w, 0)} W`;
				case "floor": return i(r.floor, "%");
				case "percent": return i(r.percent, "%");
				case "seconds": return i(r.seconds, "s");
				case "minutes": return i(r.minutes, "min");
				default: return t;
			}
		}
		if (typeof t == "number") return `${v(e.lang, t, 2)}${n ? ` ${n}` : ""}`;
		let i = Number(t);
		return typeof t == "string" && t.trim() !== "" && Number.isFinite(i) ? `${v(e.lang, i, 2)}${n ? ` ${n}` : ""}` : String(t);
	}
	currentText(e, t, n) {
		if (t === "on") return e("op.step.on");
		if (t === "off") return e("op.step.off");
		let r = Number(t);
		return t.trim() !== "" && Number.isFinite(r) ? `${v(e.lang, r, 2)}${n ? ` ${n}` : ""}` : t;
	}
	renderActions(e, t, n, r) {
		let i = t.op, a = Qn.has(i), o = this.probeRunning && this.battery && this.probeRunning.battery === this.battery.id ? this.probeRunning.op : null, s = this.probing === i || o === i, c = !!(this.probing || this.probeRunning || this.busy), u = t.possible && !t.steps.length, d = t.possible && !u && !this.dirty && !c && !r, f = this.lastProbe(i), p = this.choice === "steps" ? e("op.own.back.steps") : this.choice === "generic" ? e("op.own.back.generic") : e("op.own.back.profile");
		return D`<div class="op-actions" data-tipped>
      ${s ? D`<span class="chip">${e("op.probe.running")}</span>` : u ? D`<span class="last">${e("op.probe.nothing")}</span>` : D`<button type="button" class="mini-btn" ?disabled=${!d} @click=${() => this.probe(i)}>
              <ha-icon icon="mdi:test-tube"></ha-icon>${e("op.probe")}
            </button>`}
      ${l(e, "probe")}
      ${u ? j : D`<span class="last ${f ? f.ok ? "ok" : "bad" : ""}">
            ${f ? e(f.ok ? "op.probe.last.ok" : "op.probe.last.failed", { when: `${U(e.lang, f.at, "short")}, ${N(f.at)}` }) : e("op.probe.never")}
          </span>`}
      ${c && !s && t.possible && !u ? D`<span class="last" role="status">${e("op.probe.busy")}</span>` : j}
      ${a ? r ? D`<button type="button" class="mini-btn go" @click=${() => this.finishEditing(i)}>${e("op.own.done")}</button>
              ${l(e, "own_done")}
              <button type="button" class="mini-btn quiet" @click=${() => this.discardEditing(i)}>${e("op.own.discard")}</button>
              ${l(e, "own_discard")}` : D`<button type="button" class="mini-btn" @click=${() => this.startEditing(i, t, n)}>
                <ha-icon icon="mdi:pencil-outline"></ha-icon>${e(n ? "op.own.edit" : "op.own")}
              </button>
              ${l(e, "own_steps", tr)}` : j}
      ${a && n ? D`<button type="button" class="mini-btn quiet" @click=${() => this.resetOwn(i)}>${p}</button> ${l(e, "own_back")}` : j}
    </div>`;
	}
	renderEditor(e, t, n, r) {
		let i = t.steps[n] ?? [], a = r.params ?? {};
		return D`<div class="editor" data-op=${n} data-tipped>
      ${i.length ? D`<ol class="op-steps edit">
            ${i.map((r, o) => this.renderEditRow(e, t, n, r, o, i.length, a))}
          </ol>` : D`<p class="field-hint hint">${e("op.own.empty")}</p>`}
      <div class="add">
        <button type="button" class="mini-btn" @click=${() => this.addStep(n)}>
          <ha-icon icon="mdi:plus"></ha-icon>${e("f.battery.steps.add")}
        </button>
        ${l(e, "control_steps", tr)}
      </div>
      <div class="op-restore"><small class="own-restore">${e("op.own.restore")}</small></div>
    </div>`;
	}
	renderEditRow(e, t, n, r, i, a, o) {
		let s = this.hass, c = r.entity_id ?? "", u = r.service ? "service" : this.stepKind(c), d = `step_${u === "trigger" ? "text" : u}`, f = D`<span class="tools">
      <button
        type="button"
        class="icon-btn"
        aria-label=${e("op.own.up")}
        title=${e("op.own.up")}
        ?disabled=${i === 0}
        @click=${() => this.moveStep(n, i, -1)}
      >
        <ha-icon icon="mdi:arrow-up"></ha-icon>
      </button>
      <button
        type="button"
        class="icon-btn"
        aria-label=${e("op.own.down")}
        title=${e("op.own.down")}
        ?disabled=${i === a - 1}
        @click=${() => this.moveStep(n, i, 1)}
      >
        <ha-icon icon="mdi:arrow-down"></ha-icon>
      </button>
      <button type="button" class="icon-btn" aria-label=${e("f.remove")} title=${e("f.remove")} @click=${() => this.removeStep(n, i)}>
        <ha-icon icon="mdi:close"></ha-icon>
      </button>
      ${l(e, d, tr)}
    </span>`;
		if (r.service) return D`<li class="edit" data-tipped>
        <span class="n">${i + 1}.</span>
        <span class="what"><span class="who">${this.stepText(e, {
			kind: "call",
			service: r.service,
			data: r.data ?? {}
		}, o)}</span></span>
        ${f}
      </li>`;
		let p = this.roleOf(t, c), m = _(s, c);
		return D`<li class="edit" data-tipped>
      <span class="n">${i + 1}.</span>
      <span class="what">
        <span class="who">
          ${this.rolePrefix(e, p, m)}
          <button
            type="button"
            class="name-btn"
            title=${e("op.own.swap")}
            aria-label=${`${e("op.own.swap")}: ${m}`}
            @click=${() => this.swapStep(n, i)}
          >
            <b>${m}</b><ha-icon icon="mdi:swap-horizontal"></ha-icon>
          </button>
        </span>
        ${this.renderStepValue(e, n, r, i, u)}
      </span>
      ${f}
    </li>`;
	}
	renderStepValue(e, t, n, r, i) {
		let a = n.entity_id ?? "", o = n.value, s = o == null ? "" : String(o), c = e("f.battery.steps.value"), l = (e) => this.setStepValue(t, r, e.target.value), u = (e) => {
			e.key === "Enter" && (e.preventDefault(), e.target.blur());
		};
		switch (i) {
			case "toggle": {
				let n = o === !0 || o === "on" || o === "true", i = o === !1 || o === "off" || o === "false";
				return D`<span class="seg onoff" role="group" aria-label=${c}>
          <button type="button" aria-pressed=${String(n)} @click=${() => this.setStepValue(t, r, "on")}>${e("op.step.on")}</button>
          <button type="button" aria-pressed=${String(i)} @click=${() => this.setStepValue(t, r, "off")}>${e("op.step.off")}</button>
        </span>`;
			}
			case "option": {
				let e = this.valueHints(a, t), n = s && !e.includes(s) ? [s, ...e] : e;
				return D`<select class="input value-select" aria-label=${c} @change=${l}>
          ${n.map((e) => D`<option value=${e} ?selected=${e === s}>${e}</option>`)}
        </select>`;
			}
			case "number": {
				let n = this.hass?.states[a]?.attributes ?? {}, i = this.unitOf(a), o = typeof n.min == "number" && typeof n.max == "number" ? `${v(e.lang, n.min, 2)} – ${v(e.lang, n.max, 2)}` : "", d = this.valueHints(a, t);
				return D`<span class="value-number">
          <span class="unit-input">
            <input
              class="input"
              type="text"
              inputmode="decimal"
              aria-label=${c}
              placeholder=${o}
              .value=${s}
              @change=${l}
              @keydown=${u}
            />
            ${i ? D`<span class="unit">${i}</span>` : j}
          </span>
          ${d.map((n) => D`<button
              type="button"
              class="ph"
              aria-pressed=${String(s === n)}
              aria-label=${e("op.own.insert", { value: n })}
              title=${e("op.own.insert", { value: n })}
              @click=${(e) => {
					let i = e.currentTarget.closest(".value-number")?.querySelector("input");
					i && (i.value = n), this.setStepValue(t, r, n);
				}}
            >
              <span class="chip">${n}</span>
            </button>`)}
        </span>`;
			}
			case "trigger": return D`<span class="now">${e("op.own.trigger")}</span>`;
			default: return D`<input class="input value-text" type="text" aria-label=${c} placeholder=${c} .value=${s} @change=${l} @keydown=${u} />`;
		}
	}
	stepKind(e) {
		let t = e.split(".", 1)[0];
		return ["switch", "input_boolean"].includes(t) ? "toggle" : ["select", "input_select"].includes(t) ? "option" : ["number", "input_number"].includes(t) ? "number" : [
			"script",
			"button",
			"input_button"
		].includes(t) ? "trigger" : "text";
	}
	roleOf(e, t) {
		return Object.entries(e.controls).find(([, e]) => e === t)?.[0] ?? null;
	}
	valueHints(e, t) {
		let n = e.split(".", 1)[0];
		if (["switch", "input_boolean"].includes(n)) return ["on", "off"];
		if (["select", "input_select"].includes(n)) return this.hass?.states[e]?.attributes.options ?? [];
		if (["number", "input_number"].includes(n)) switch (t) {
			case "charge": return ["{target}", "{power}"];
			case "hold": return ["{floor}"];
			case "cap": return ["{percent}", "{power}"];
			case "block":
			case "block_charge":
			case "block_discharge": return ["0"];
			default: return [];
		}
		return [];
	}
	fitValue(e, t, n) {
		let r = this.valueHints(t, n), i = r.length ? or(r[0]) : null;
		switch (this.stepKind(t)) {
			case "toggle": return e === !0 || e === "on" || e === "true" ? "on" : e === !1 || e === "off" || e === "false" ? "off" : i;
			case "option": return typeof e == "string" && r.includes(e) ? e : i;
			case "number": return typeof e == "number" ? e : typeof e == "string" && e.trim() !== "" && Number.isFinite(Number(e.replace(",", "."))) ? Number(e.replace(",", ".")) : ar(e) && r.includes(e) ? e : i;
			case "trigger": return null;
			default: return e ?? null;
		}
	}
	startEditing(e, t, n) {
		let r = e, i = this.value, a = i.steps[r];
		if (this.editStart.set(e, a?.length ? structuredClone(a) : void 0), !n && !a?.length) {
			let n = t.steps.map((n) => n.kind === "call" || n.service ? {
				service: n.service,
				data: n.data ?? {}
			} : {
				entity_id: n.entity_id,
				value: sr(n, e, t.params ?? {})
			});
			this.emit({
				...i,
				steps: {
					...i.steps,
					[r]: n
				}
			});
		}
		this.editing = /* @__PURE__ */ new Set([...this.editing, e]), this.open = /* @__PURE__ */ new Set([...this.open, e]);
	}
	stopEditing(e) {
		let t = new Set(this.editing);
		t.delete(e), this.editing = t, this.editStart.delete(e);
	}
	finishEditing(e) {
		let t = e, n = this.value, r = this.stepsWithTyped(t);
		if (!r.length) {
			this.resetOwn(t);
			return;
		}
		this.stopEditing(e), JSON.stringify(r) !== JSON.stringify(n.steps[t] ?? []) && this.emit({
			...n,
			steps: {
				...n.steps,
				[t]: r
			}
		});
	}
	stepsWithTyped(e) {
		let t = [...this.value?.steps[e] ?? []];
		return this.renderRoot.querySelectorAll(`.editor[data-op="${e}"] li.edit`).forEach((e, n) => {
			let r = e.querySelector("input.input"), i = t[n];
			if (!r || !i || i.service) return;
			let a = or(r.value);
			(i.value ?? null) !== a && (t[n] = {
				...i,
				value: a
			});
		}), t;
	}
	discardEditing(e) {
		let t = this.value, n = e, r = this.editStart.get(e), i = { ...t.steps };
		r?.length ? i[n] = structuredClone(r) : delete i[n], this.stopEditing(e), this.emit({
			...t,
			steps: i
		});
	}
	resetOwn(e) {
		let t = this.value, n = { ...t.steps }, r = this.choice === "profile" ? this.found?.steps?.[e] : void 0;
		r?.length ? n[e] = structuredClone(r) : delete n[e], this.stopEditing(e), this.emit({
			...t,
			steps: n
		});
	}
	toggle(e) {
		let t = new Set(this.open);
		t.has(e) ? t.delete(e) : t.add(e), this.open = t;
	}
	lastProbe(e) {
		let t = this.probes?.[e], n = this.probeResults[e];
		return t && n ? t.at > n.at ? t : n : n ?? t;
	}
	async probe(e) {
		let t = this.hass, n = this.battery;
		if (!t || !n || this.probing || this.probeRunning || this.busy) return;
		this.probing = e;
		let r = { ...this.probeErrors };
		delete r[e], this.probeErrors = r;
		try {
			let r = await t.callWS({
				type: "energy_joe/battery/probe",
				battery_id: n.id,
				op: e
			});
			this.probeResults = {
				...this.probeResults,
				[e]: r
			};
		} catch (t) {
			this.probeErrors = {
				...this.probeErrors,
				[e]: ir(t)
			};
		} finally {
			this.probing = null, this.refreshPreview();
		}
	}
	renderProbe(e, t) {
		let n = this.hass, r = this.probeErrors[t];
		if (r) return D`<div class="probe bad" role="status">
        <p class="problem">${e("op.probe.failed")} ${e("op.probe.error", { error: r })}</p>
      </div>`;
		let i = this.probeResults[t];
		if (!i) return j;
		let a = i.problem ? this.problemText(e, i) : "", o = (t) => t.service ? e("op.step.service", { service: t.service }) : t.entity_id ? _(n, t.entity_id) : "", s = i.power_kw != null && Math.abs(i.power_kw) < .005 ? 0 : i.power_kw;
		return D`<div class="probe ${i.ok ? "ok" : "bad"}" role="status">
      ${a ? D`<p class="problem">${a}</p>` : j}
      ${i.steps?.length || !a ? D`<ul>
            ${(i.steps ?? []).map((t) => {
			let n = t.taken && !t.error, r = this.unitOf(t.entity_id), i = t.error ? e("op.probe.error", { error: e.optional(`devices.problem.${t.error}`) ?? t.error }) : e(n ? t.service ? "op.probe.call_taken" : "op.probe.taken" : "op.probe.not_taken"), a = t.service ? [i] : [e("op.probe.wrote", {
				wrote: this.valueText(e, t.wrote, r, {}),
				read: t.read == null ? "–" : this.currentText(e, String(t.read), r)
			}), i];
			return D`<li class=${n ? "ok" : "bad"}>
                <ha-icon icon=${n ? "mdi:check-circle" : "mdi:close-circle"}></ha-icon>
                <span><b>${o(t)}</b><small>${a.join(" · ")}</small></span>
              </li>`;
		})}
            <li class=${i.restored ? "ok" : "bad"}>
              <ha-icon icon=${i.restored ? "mdi:check-circle" : "mdi:close-circle"}></ha-icon>
              <span
                >${i.restored ? e("op.probe.restored") : e("op.probe.not_restored", { entities: (i.restore_errors ?? []).map((e) => _(n, e)).join(", ") })}</span
              >
            </li>
          </ul>` : j}
      ${s == null ? j : D`<small>${e("devices.test.power", { value: v(e.lang, s, 2) })}</small>`}
    </div>`;
	}
	problemText(e, t) {
		let n = t.problem ?? "";
		return n === "not_possible" && t.why ? `${e("op.probe.problem.not_possible")} ${this.whyText(e, t.why)}` : n === "controls_missing" && t.missing?.length ? e("op.probe.problem.controls_missing.list", { missing: t.missing.map((t) => this.roleName(e, t)).join(", ") }) : e.optional(`op.probe.problem.${n}`) ?? e("op.probe.problem.other", { code: n });
	}
	roleRows(e) {
		let t = this.hass, n = (this.preview?.roles ?? []).filter((t) => t.relevant || t.deviates || t.found || e.controls[t.role]), r = new Set(n.map((e) => e.role)), i = [...n], a = [...Ln, ...Object.keys(e.controls)];
		for (let n of a) {
			if (r.has(n)) continue;
			r.add(n);
			let a = e.controls[n] ?? null, o = Zn[n];
			i.push({
				role: n,
				entity_id: a,
				found: null,
				kind: o === "level" || o === "setpoint" || o === "toggle" || o === "option" ? o : null,
				unit: a ? t.states[a]?.attributes.unit_of_measurement ?? null : null,
				used_by: [],
				deviates: !1,
				relevant: !1
			});
		}
		return i.map((t) => ({
			...t,
			entity_id: e.controls[t.role] ?? null
		}));
	}
	unitOf(e) {
		let t = e ? this.hass?.states[e]?.attributes.unit_of_measurement : void 0;
		return typeof t == "string" && t ? t : null;
	}
	kindText(e, t) {
		let n = t.unit ?? this.unitOf(t.entity_id ?? t.found);
		switch (t.kind ?? Zn[t.role] ?? null) {
			case "toggle": return e("role.kind.toggle");
			case "option": return e("role.kind.option");
			case "level": return e("role.kind.level", { unit: n ?? "%" });
			case "setpoint": return t.role.includes("limit") ? n ? e("role.kind.limit", { unit: n }) : e("role.kind.limit.nounit") : n ? e("role.kind.setpoint", { unit: n }) : e("role.kind.setpoint.nounit");
			default: return "";
		}
	}
	renderRoles(e, t) {
		let n = this.hass, r = this.roleRows(t), i = t.controls.mode, a = i ? n.states[i]?.attributes.options ?? [] : [], o = !!this.preview?.deviates && this.choice === "profile", s = (this.preview?.operations ?? []).filter((e) => !e.possible).map((t) => e.optional(`op.short.${t.op}`) ?? t.op), u = this.profileName;
		return D`<div data-tipped>
      <div class="sub">${e("roles.title")} ${l(e, "roles_list")}</div>
      ${o ? D`<div class="note warn reset" role="status">
            <ha-icon icon="mdi:alert-outline"></ha-icon>
            <span
              >${e("roles.warn", { name: u })}
              ${s.length ? D` ${e("roles.warn.ops", { ops: s.join(", ") })}` : j}
              <div class="note-actions">
                <button type="button" class="mini-btn go" @click=${this.resetToProfile}>${e("roles.reset", { name: u })}</button>
                ${l(e, "roles_reset")}
              </div></span
            >
          </div>` : j}
      <div class="rows">
        ${r.map((t) => {
			let r = t.role, i = t.entity_id, a = this.kindText(e, t), o = t.used_by?.length ? t.used_by.map((t) => e.optional(`op.short.${t}`) ?? t).join(", ") : "";
			return D`<div class="row ${t.deviates ? "dev" : ""}">
            <span class="label">
              ${this.roleName(e, r)}${a ? D` <span class="kind">(${a})</span>` : j}
              ${o ? D`<small>${e("roles.used_by", { ops: o })}</small>` : j}
            </span>
            <span class="entity">
              ${i ? D`<b>${_(n, i)}</b><small>${c(n, i, e.lang)}</small>` : D`<small>${e("roles.unassigned")}</small>`}
              ${t.deviates && t.found && t.found !== i ? D`<small class="found">${e("roles.by_profile", { name: _(n, t.found) })}</small>` : j}
              ${t.deviates ? D`<span class="chip warn">${e("roles.deviates")}</span>` : j}
            </span>
            <span class="buttons">
              <button type="button" class="mini-btn" @click=${() => this.pickRole(r)}>
                <ha-icon icon="mdi:magnify"></ha-icon>${e(i ? "review.change" : "review.choose")}
              </button>
              ${i ? D`<button
                    type="button"
                    class="icon-btn"
                    aria-label=${e("f.remove")}
                    title=${e("f.remove")}
                    @click=${() => this.setRole(r, null)}
                  >
                    <ha-icon icon="mdi:close"></ha-icon>
                  </button>` : j}
            </span>
          </div>`;
		})}
      </div>
      </div>
      ${i ? D`<div data-tipped>
            <div class="sub">${e("f.battery.mode_options")} ${l(e, "mode_options")}</div>
            <div class="rows">
              ${Rn.map((n) => D`<div class="row">
                  <label for="opt-${n}">${e(`meaning.${n}`)}</label>
                  <select
                    id="opt-${n}"
                    class="input"
                    @change=${(e) => this.setOption(n, e.target.value)}
                  >
                    <option value="" ?selected=${!t.mode_options[n]}>${e("meaning.none")}</option>
                    ${a.map((e) => D`<option value=${e} ?selected=${t.mode_options[n] === e}>${e}</option>`)}
                  </select>
                  <span></span>
                </div>`)}
            </div>
            </div>` : j}`;
	}
	renderSummary(e) {
		let t = this.preview;
		if (!t?.operations?.length) return j;
		let n = new Map(t.operations.map((e) => [e.op, e])), r = [], i = /* @__PURE__ */ new Map(), a = this.holdFolded;
		for (let t of zn) {
			let o = n.get(t);
			if (!o || a && t === "hold") continue;
			let s = `${e.optional(`op.short.${t}`) ?? t}${a && t === "block" ? ` (${e("op.block.both")})` : ""}`;
			if (!o.possible) {
				let t = o.why ? this.whyText(e, o.why).replace(/\.$/, "") : "";
				i.set(t, [...i.get(t) ?? [], s]);
				continue;
			}
			let c = o.steps.length;
			r.push(`${s}: ${c === 1 ? e("op.steps.one") : c ? e("op.steps.many", { count: c }) : e("op.possible")}`);
		}
		for (let [t, n] of i) r.push(t ? e("summary.impossible", {
			op: n.join(", "),
			why: t
		}) : `${n.join(", ")}: ${e("op.impossible")}`);
		let o = $n.filter((e) => n.get(e) && !n.get(e).possible), s = o.length > 0;
		return D`<div class="note ${s ? "warn" : ""} ready" role="status">
      <ha-icon icon=${s ? "mdi:alert-outline" : "mdi:check-circle-outline"}></ha-icon>
      <span>
        <span class="line">${r.join(" · ")}</span>
        <span class="lines">
          ${s ? o.map((t) => D`<div>${e(`summary.missing.${t}`)}</div>`) : D`<div>${e("summary.ok")}</div>`}
        </span>
      </span>
    </div>`;
	}
	choose(e) {
		let t = this.value, n = t.adapter === qn ? {} : t.controls;
		if (e === "watch") this.emit({
			...t,
			adapter: "none",
			modbus: null
		});
		else if (e === "profile") {
			let e = this.profileKey, r = this.battery?.adapter === e ? this.battery : void 0;
			this.emit({
				...t,
				adapter: e,
				controls: { ...r?.controls ?? this.found?.controls ?? n },
				mode_options: { ...r?.mode_options ?? {} },
				modbus: null
			});
		} else if (e === "modbus") {
			let e = this.battery?.adapter === qn ? this.battery : void 0, n = {
				host: "",
				...Yn,
				...e?.modbus ?? t.modbus ?? {}
			};
			this.emit({
				...t,
				adapter: qn,
				controls: { ...e?.controls ?? {} },
				mode_options: {},
				modbus: n
			}), !n.host.trim() && !this.modbusChecking && this.checkModbus();
		} else if (e === "generic") {
			let e = !Object.keys(n).length, r = this.found?.suggested;
			this.emit({
				...t,
				adapter: "generic",
				controls: e && r ? { ...r.controls } : n,
				mode_options: e && r ? { ...r.mode_options } : t.mode_options,
				modbus: null
			});
		} else this.emit({
			...t,
			adapter: "steps",
			controls: n,
			modbus: null
		});
	}
	async pickRole(e) {
		let t = this.t, n = this.value.controls[e], r = Zn[e] ?? "writable", i = await L(this, {
			heading: t("pick.role.title", { role: this.roleName(t, e) }),
			tip: "control_roles",
			filter: r,
			selected: n ? [n] : [],
			suggestions: this.nearby(r).map((e) => ({ entity_id: e }))
		});
		i?.selected[0] && this.setRole(e, i.selected[0]);
	}
	nearby(e) {
		let t = this.hass, n = this.battery?.device_id;
		if (!n) return [];
		let r = {
			level: ["number", "input_number"],
			setpoint: ["number", "input_number"],
			toggle: ["switch", "input_boolean"],
			option: ["select", "input_select"],
			writable: [
				"number",
				"switch",
				"select",
				"script",
				"button"
			]
		}[e] ?? [];
		return Object.values(t.entities ?? {}).filter((e) => e.device_id === n && r.includes(e.entity_id.split(".", 1)[0])).map((e) => e.entity_id);
	}
	setRole(e, t) {
		let n = this.value, r = { ...n.controls };
		t ? r[e] = t : delete r[e];
		let i = e === "mode" && !t ? {} : n.mode_options;
		this.emit({
			...n,
			adapter: n.adapter === "none" ? "generic" : n.adapter,
			controls: r,
			mode_options: i
		});
	}
	setOption(e, t) {
		let n = this.value, r = { ...n.mode_options };
		t ? r[e] = t : delete r[e], this.emit({
			...n,
			mode_options: r
		});
	}
	async addStep(e) {
		let t = this.t, n = (await L(this, {
			heading: t("pick.step.title"),
			tip: "control_steps",
			tipVars: tr,
			filter: "writable",
			selected: [],
			suggestions: this.nearby("writable").map((e) => ({ entity_id: e }))
		}))?.selected[0];
		if (!n) return;
		let r = {
			entity_id: n,
			value: this.fitValue(null, n, e)
		}, i = this.value;
		this.emit({
			...i,
			steps: {
				...i.steps,
				[e]: [...this.stepsWithTyped(e), r]
			}
		});
	}
	async swapStep(e, t) {
		let n = this.t, r = this.value?.steps[e]?.[t];
		if (!r || r.service) return;
		let i = (await L(this, {
			heading: n("pick.step.title"),
			tip: "control_steps",
			tipVars: tr,
			filter: "writable",
			selected: r.entity_id ? [r.entity_id] : [],
			suggestions: this.nearby("writable").map((e) => ({ entity_id: e }))
		}))?.selected[0];
		if (!i || i === r.entity_id) return;
		let a = this.value, o = this.stepsWithTyped(e);
		o[t] = {
			entity_id: i,
			value: this.fitValue(r.value, i, e)
		}, this.emit({
			...a,
			steps: {
				...a.steps,
				[e]: o
			}
		});
	}
	setStepValue(e, t, n) {
		let r = this.value, i = this.stepsWithTyped(e), a = or(n);
		i[t] && (i[t] = {
			...i[t],
			value: a
		}, JSON.stringify(i) !== JSON.stringify(r.steps[e] ?? []) && this.emit({
			...r,
			steps: {
				...r.steps,
				[e]: i
			}
		}));
	}
	moveStep(e, t, n) {
		let r = this.value, i = this.stepsWithTyped(e), a = t + n;
		a < 0 || a >= i.length || ([i[t], i[a]] = [i[a], i[t]], this.emit({
			...r,
			steps: {
				...r.steps,
				[e]: i
			}
		}));
	}
	removeStep(e, t) {
		let n = this.value, r = this.stepsWithTyped(e).filter((e, n) => n !== t);
		this.emit({
			...n,
			steps: {
				...n.steps,
				[e]: r
			}
		});
	}
	emit(e) {
		this.dispatchEvent(new CustomEvent("joe-control-change", { detail: e }));
	}
};
d([b({ attribute: !1 })], W.prototype, "hass", void 0), d([b({ attribute: !1 })], W.prototype, "t", void 0), d([b({ attribute: !1 })], W.prototype, "battery", void 0), d([b({ attribute: !1 })], W.prototype, "found", void 0), d([b({ attribute: !1 })], W.prototype, "value", void 0), d([b({ attribute: !1 })], W.prototype, "profiles", void 0), d([b({ type: Boolean })], W.prototype, "dirty", void 0), d([b({ attribute: !1 })], W.prototype, "probes", void 0), d([b({ attribute: !1 })], W.prototype, "probeRunning", void 0), d([b({ type: Boolean })], W.prototype, "busy", void 0), d([T()], W.prototype, "preview", void 0), d([T()], W.prototype, "previewState", void 0), d([T()], W.prototype, "previewFailure", void 0), d([T()], W.prototype, "open", void 0), d([T()], W.prototype, "editing", void 0), d([T()], W.prototype, "probing", void 0), d([T()], W.prototype, "probeResults", void 0), d([T()], W.prototype, "probeErrors", void 0), d([T()], W.prototype, "modbusCheck", void 0), d([T()], W.prototype, "modbusChecking", void 0), d([T()], W.prototype, "modbusChecked", void 0), u("joe-battery-control", W);
//#endregion
//#region src/editors/battery-editor.ts
var lr = [
	"adapter",
	"controls",
	"mode_options",
	"steps",
	"prepare",
	"modbus"
], ur = class extends O {
	constructor(...e) {
		super(...e), this.batteryId = "", this.unknown = !1, this.saving = !1;
	}
	static {
		this.styles = [k, w`
      :host {
        display: block;
      }
    `];
	}
	get battery() {
		return this.config?.batteries.find((e) => e.id === this.batteryId);
	}
	willUpdate(e) {
		let t = this.battery;
		(e.has("config") || e.has("batteryId")) && t && !this.values && (this.values = Object.fromEntries(jn.map((e) => [e, structuredClone(t[e])])), this.control = {
			...nr(t),
			prepare: structuredClone(t.prepare)
		}, this.unknown = this.config?.answers[`capacity:${t.id}`] === "unknown");
	}
	render() {
		let { t: e, hass: t, config: n, values: r, control: i } = this, a = this.battery;
		if (!e || !t || !n || !r || !i || !a) return j;
		let o = this.discovery?.batteries.find((e) => e.id === a.id);
		return D`<div class="sheet-title">${y(e("edit.battery.title", { name: a.name }))}</div>
      <joe-battery-fields
        .hass=${t}
        .t=${e}
        .config=${n}
        .battery=${a}
        .floor=${this.floor}
        .draft=${r}
        .unknown=${this.unknown}
        @joe-battery-change=${(e) => {
			this.values = {
				...r,
				...e.detail.change
			}, e.detail.unknown !== void 0 && (this.unknown = e.detail.unknown);
		}}
      ></joe-battery-fields>
      <div class="field" data-tipped>
        <div class="field-label">${e("f.battery.control")} ${l(e, "control_choice")}</div>
        <joe-battery-control
          .hass=${t}
          .t=${e}
          .battery=${a}
          .found=${o}
          .profiles=${this.info?.profiles}
          .value=${i}
          @joe-control-change=${(e) => {
			this.control = rr(a, e.detail, o);
		}}
        ></joe-battery-control>
      </div>
      <div class="actions" data-notip>
        <button type="button" class="btn btn-primary" ?disabled=${this.saving} @click=${this.save}>${e("common.save")}</button>
        <button type="button" class="btn btn-ghost" @click=${this.close}>${e("common.cancel")}</button>
      </div>`;
	}
	async save() {
		let e = this.battery, { config: t, values: n, control: r } = this;
		if (!e || !t || !n || !r) return;
		let i = {
			...n,
			...r
		}, a = {};
		for (let t of [...jn, ...lr]) JSON.stringify(e[t] ?? null) !== JSON.stringify(i[t] ?? null) && (a[t] = i[t]);
		let o = `capacity:${e.id}`, s = {};
		if (Object.keys(a).length && (s.batteries = { [e.id]: a }), t.answers[o] === "unknown" !== this.unknown && (s.answers = { [o]: this.unknown ? "unknown" : null }), Object.keys(s).length) {
			this.saving = !0;
			let e = await I(this, s);
			if (this.saving = !1, !e) return;
		}
		this.close();
	}
	close() {
		this.dispatchEvent(new CustomEvent("joe-close", {
			bubbles: !0,
			composed: !0
		}));
	}
};
d([b({ attribute: !1 })], ur.prototype, "hass", void 0), d([b({ attribute: !1 })], ur.prototype, "t", void 0), d([b({ attribute: !1 })], ur.prototype, "config", void 0), d([b({ attribute: !1 })], ur.prototype, "discovery", void 0), d([b({ attribute: !1 })], ur.prototype, "info", void 0), d([b({ attribute: !1 })], ur.prototype, "floor", void 0), d([b()], ur.prototype, "batteryId", void 0), d([T()], ur.prototype, "values", void 0), d([T()], ur.prototype, "control", void 0), d([T()], ur.prototype, "unknown", void 0), d([T()], ur.prototype, "saving", void 0), u("joe-battery-editor", ur);
//#endregion
//#region src/fonts.ts
var dr = [
	[
		"Energy Joe Barlow",
		400,
		"normal",
		"barlow-latin-400-normal"
	],
	[
		"Energy Joe Barlow",
		500,
		"normal",
		"barlow-latin-500-normal"
	],
	[
		"Energy Joe Barlow",
		600,
		"normal",
		"barlow-latin-600-normal"
	],
	[
		"Energy Joe Barlow",
		700,
		"normal",
		"barlow-latin-700-normal"
	],
	[
		"Energy Joe Barlow Condensed",
		700,
		"normal",
		"barlow-condensed-latin-700-normal"
	],
	[
		"Energy Joe Barlow Condensed",
		700,
		"italic",
		"barlow-condensed-latin-700-italic"
	],
	[
		"Energy Joe Barlow Condensed",
		800,
		"italic",
		"barlow-condensed-latin-800-italic"
	]
];
function fr() {
	if (document.getElementById("energy-joe-fonts")) return;
	let e = document.createElement("style");
	e.id = "energy-joe-fonts", e.textContent = dr.map(([e, t, n, r]) => `@font-face{font-family:"${e}";font-style:${n};font-weight:${t};font-display:swap;src:url("${Ne(`fonts/${r}.woff2`)}") format("woff2")}`).join("\n"), document.head.appendChild(e);
}
//#endregion
//#region node_modules/lit-html/directive-helpers.js
var { I: pr } = De, mr = (e) => e, hr = (e) => e.strings === void 0, gr = () => document.createComment(""), _r = (e, t, n) => {
	let r = e._$AA.parentNode, i = t === void 0 ? e._$AB : t._$AA;
	if (n === void 0) n = new pr(r.insertBefore(gr(), i), r.insertBefore(gr(), i), e, e.options);
	else {
		let t = n._$AB.nextSibling, a = n._$AM, o = a !== e;
		if (o) {
			let t;
			n._$AQ?.(e), n._$AM = e, n._$AP !== void 0 && (t = e._$AU) !== a._$AU && n._$AP(t);
		}
		if (t !== i || o) {
			let e = n._$AA;
			for (; e !== t;) {
				let t = mr(e).nextSibling;
				mr(r).insertBefore(e, i), e = t;
			}
		}
	}
	return n;
}, vr = (e, t, n = e) => (e._$AI(t, n), e), yr = {}, br = (e, t = yr) => e._$AH = t, xr = (e) => e._$AH, Sr = (e) => {
	e._$AR(), e._$AA.remove();
}, Cr = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, wr = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), Tr = class {
	constructor(e) {}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AT(e, t, n) {
		this._$Ct = e, this._$AM = t, this._$Ci = n;
	}
	_$AS(e, t) {
		return this.update(e, t);
	}
	update(e, t) {
		return this.render(...t);
	}
}, Er = (e, t) => {
	let n = e._$AN;
	if (n === void 0) return !1;
	for (let e of n) e._$AO?.(t, !1), Er(e, t);
	return !0;
}, Dr = (e) => {
	let t, n;
	do {
		if ((t = e._$AM) === void 0) break;
		n = t._$AN, n.delete(e), e = t;
	} while (n?.size === 0);
}, Or = (e) => {
	for (let t; t = e._$AM; e = t) {
		let n = t._$AN;
		if (n === void 0) t._$AN = n = /* @__PURE__ */ new Set();
		else if (n.has(e)) break;
		n.add(e), jr(t);
	}
};
function kr(e) {
	this._$AN === void 0 ? this._$AM = e : (Dr(this), this._$AM = e, Or(this));
}
function Ar(e, t = !1, n = 0) {
	let r = this._$AH, i = this._$AN;
	if (i !== void 0 && i.size !== 0) {
		if (t) {
			if (Array.isArray(r)) for (let e = n; e < r.length; e++) Er(r[e], !1), Dr(r[e]);
			else r != null && (Er(r, !1), Dr(r));
		} else Er(this, e);
	}
}
var jr = (e) => {
	e.type == Cr.CHILD && (e._$AP ??= Ar, e._$AQ ??= kr);
}, Mr = class extends Tr {
	constructor() {
		super(...arguments), this._$AN = void 0;
	}
	_$AT(e, t, n) {
		super._$AT(e, t, n), Or(this), this.isConnected = e._$AU;
	}
	_$AO(e, t = !0) {
		e !== this.isConnected && (this.isConnected = e, e ? this.reconnected?.() : this.disconnected?.()), t && (Er(this, e), Dr(this));
	}
	setValue(e) {
		if (hr(this._$Ct)) this._$Ct._$AI(e, this);
		else {
			let t = [...this._$Ct._$AH];
			t[this._$Ci] = e, this._$Ct._$AI(t, this, 0);
		}
	}
	disconnected() {}
	reconnected() {}
}, Nr = /* @__PURE__ */ new WeakMap(), Pr = wr(class extends Mr {
	render(e) {
		return j;
	}
	update(e, [t]) {
		let n = t !== this.G;
		return n && this.rt(void 0), (n || this.lt !== this.ct) && (this.G = t, this.ht = e.options?.host, this.rt(this.ct = e.element)), j;
	}
	rt(e) {
		if (this.G !== void 0) {
			if (this.isConnected || (e = void 0), typeof this.G == "function") {
				let t = this.ht ?? globalThis, n = Nr.get(t);
				n === void 0 && (n = /* @__PURE__ */ new WeakMap(), Nr.set(t, n)), n.get(this.G) !== void 0 && this.G.call(this.ht, void 0), n.set(this.G, e), e !== void 0 && this.G.call(this.ht, e);
			} else this.G.value = e;
		}
	}
	get lt() {
		return typeof this.G == "function" ? Nr.get(this.ht ?? globalThis)?.get(this.G) : this.G?.value;
	}
	disconnected() {
		this.lt === this.ct && this.rt(void 0);
	}
	reconnected() {
		this.rt(this.ct);
	}
});
//#endregion
//#region src/components/section-chips.ts
function Fr(e) {
	e instanceof HTMLElement && requestAnimationFrame(() => {
		let t = e.parentElement;
		if (!t || t.scrollWidth <= t.clientWidth) return;
		let n = e.offsetLeft;
		(n < t.scrollLeft || n + e.offsetWidth > t.scrollLeft + t.clientWidth) && (t.scrollLeft = n - (t.clientWidth - e.offsetWidth) / 2);
	});
}
function Ir() {}
var Lr = /* @__PURE__ */ new WeakSet();
function Rr(e) {
	if (!(e instanceof HTMLElement)) return;
	let t = () => {
		let t = [];
		e.scrollLeft > 4 && t.push("left"), e.scrollLeft + e.clientWidth < e.scrollWidth - 4 && t.push("right"), e.dataset.more = t.join(" ");
	};
	Lr.has(e) || (Lr.add(e), e.addEventListener("scroll", t, { passive: !0 }), new ResizeObserver(t).observe(e)), requestAnimationFrame(() => requestAnimationFrame(t));
}
function zr(e, t, n, r, i) {
	return D`<nav class="section-chips" aria-label=${e("nav.sections")} ${Pr(Rr)}>
    ${r.map((e) => {
		let r = e.id === i, a = {
			tab: n,
			section: e.id
		};
		return D`<a
        class="section-chip ${r ? "on" : ""}"
        href=${E(t, a)}
        aria-current=${r ? "page" : "false"}
        @click=${C(a)}
        ${Pr(r ? Fr : Ir)}
      >
        <ha-icon icon=${e.icon}></ha-icon>
        <span>${e.label}</span>
        ${e.count ? D`<span class="section-count">${e.count}</span>` : j}
        ${e.problem ? D`<i class="section-problem" aria-hidden="true"></i>` : j}
      </a>`;
	})}
  </nav>`;
}
//#endregion
//#region node_modules/lit-html/directives/keyed.js
var Br = wr(class extends Tr {
	constructor() {
		super(...arguments), this.key = j;
	}
	render(e, t) {
		return this.key = e, t;
	}
	update(e, [t, n]) {
		return t !== this.key && (br(e), this.key = t), n;
	}
});
//#endregion
//#region src/components/car-search.ts
async function Vr(e, t) {
	if (!t) return;
	let n = await t.callWS({ type: "energy_joe/discover" });
	return e.dispatchEvent(new CustomEvent("joe-discovery", {
		detail: n,
		bubbles: !0,
		composed: !0
	})), n;
}
async function Hr(e, t, n) {
	return (await e.callWS({
		type: "energy_joe/car/attach",
		car: t,
		sources: n
	}))?.car ?? void 0;
}
var Ur = class extends O {
	constructor(...e) {
		super(...e), this.prefix = A, this.searching = !1, this.searched = !1, this.failed = !1, this.busy = !1, this.picked = [], this.asking = !1;
	}
	static {
		this.styles = [k, w`
      :host {
        display: block;
      }
      .head {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
      }
      .lead,
      .muted {
        margin: 12px 0 0;
        color: var(--joe-ink-2);
      }
      ul.finds {
        list-style: none;
        margin: 12px 0 0;
        padding: 0;
        display: grid;
        gap: 8px;
      }
      ul.finds li {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px 12px;
        padding: 10px 12px;
        border-radius: 12px;
        background: var(--joe-surface-2);
      }
      .pick {
        flex: 1 1 100%;
        display: grid;
        grid-template-columns: auto minmax(0, 1fr);
        align-items: center;
        gap: 12px;
        min-height: 44px;
        margin: -10px -12px;
        padding: 10px 12px;
        border: 0;
        border-radius: 12px;
        background: transparent;
        color: inherit;
        font: inherit;
        text-align: left;
        cursor: pointer;
      }
      .pick[aria-pressed="true"] {
        background: var(--joe-amber-soft);
      }
      .pick > ha-icon,
      li > ha-icon {
        color: var(--joe-ink-2);
      }
      .pick[aria-pressed="true"] > ha-icon {
        color: var(--joe-amber-ink, var(--joe-ink));
      }
      .what {
        flex: 1 1 160px;
        display: grid;
        gap: 2px;
        min-width: 0;
      }
      .what b {
        font-weight: 700;
        overflow-wrap: anywhere;
      }
      .what small {
        color: var(--joe-ink-2);
        font-size: 13px;
        line-height: 1.4;
      }
      .what small.left-out {
        color: var(--joe-amber-ink, var(--joe-ink));
        font-weight: 600;
      }
      .row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        margin-top: 12px;
      }
      .mini-btn {
        min-height: 44px;
      }
      a.mini-btn {
        text-decoration: none;
      }
      .acts {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-left: auto;
      }
      .ask {
        display: grid;
        gap: 6px;
        margin: 12px 0 0;
        padding: 12px;
        border-radius: 12px;
        background: var(--joe-amber-soft);
      }
      .ask p {
        margin: 0;
      }
      .ask p:first-child {
        font-weight: 600;
      }
      .bad {
        margin: 8px 0 0;
        color: var(--joe-warn, var(--joe-crit));
      }
    `];
	}
	firstUpdated() {
		this.car && this.search();
	}
	willUpdate(e) {
		e.has("car") && e.get("car")?.id !== this.car?.id && (this.picked = [], this.asking = !1);
	}
	render() {
		let { t: e, state: t } = this;
		if (!e || !t) return j;
		let n = this.found ?? this.discovery, r = ne(t.config, n);
		return D`<div class="head" data-tipped>
        <button type="button" class="btn btn-secondary" ?disabled=${this.searching || this.busy} @click=${this.search}>
          <ha-icon icon="mdi:magnify"></ha-icon>${e("car.search")}
        </button>
        ${l(e, "car_search")}
      </div>
      ${this.searching ? D`<p class="muted" role="status">${e("car.search.busy")}</p>` : j}
      ${this.failed ? D`<p class="bad" role="status">${e("car.search.failed")}</p>` : j}
      ${this.car ? this.renderAttach(e, this.car, r) : this.searched && !this.searching ? this.renderAll(e, r) : j}`;
	}
	renderAll(e, t) {
		return t.length ? D`<p class="lead">${e("car.search.lead")}</p>
      <ul class="finds">
        ${t.map((t) => D`<li data-tipped>
            <ha-icon icon=${t.source.kind === "evcc" ? "mdi:ev-station" : "mdi:car-connected"}></ha-icon>
            ${this.what(e, t)}
            <span class="acts">
              ${t.car ? D`<a class="mini-btn" href=${E(this.prefix, _e(t.car.id, "sources"))} @click=${C(_e(t.car.id, "sources"))}
                    >${e("car.find.open")}</a
                  >` : D`<button type="button" class="mini-btn go" ?disabled=${this.busy} @click=${() => this.useAsNew(t)}>
                    ${e(t.ignored ? "car.find.reuse" : "car.find.use")}
                  </button>`}
              ${l(e, "car_search_use")}
            </span>
          </li>`)}
      </ul>` : D`<p class="muted">${e("car.search.none")}</p>`;
	}
	renderAttach(e, t, n) {
		let r = n.filter((e) => e.car?.id !== t.id), i = r.filter((e) => this.picked.includes(e.source.id));
		return this.asking ? this.renderAsk(e, t, i) : D`<p class="lead">${e("car.attach.lead", { car: t.name })}</p>
      ${r.length ? D`<ul class="finds">
            ${r.map((t) => {
			let n = this.picked.includes(t.source.id);
			return D`<li>
                <button type="button" class="pick" aria-pressed=${n ? "true" : "false"} ?disabled=${this.busy} @click=${() => this.toggle(t.source.id)}>
                  <ha-icon icon=${n ? "mdi:checkbox-marked-circle" : "mdi:checkbox-blank-circle-outline"}></ha-icon>
                  ${this.what(e, t)}
                </button>
              </li>`;
		})}
          </ul>` : this.searching ? j : D`<p class="muted">${e("car.attach.none")}</p>`}
      ${r.length ? D`<div class="row" data-tipped>
            <button type="button" class="mini-btn go" ?disabled=${this.busy || !i.length} @click=${() => this.attach(t, i)}>
              <ha-icon icon="mdi:link-variant-plus"></ha-icon>${e("car.attach.do", { car: t.name })}
            </button>
            ${l(e, "car_attach")}
          </div>` : j}`;
	}
	renderAsk(e, t, n) {
		let r = n.filter((e) => e.car), i = [...new Set(r.map((e) => e.car))].filter((e) => e.sources.every((e) => n.some((t) => t.source.id === e.id)));
		return D`<div class="ask" role="alert" data-tipped>
      ${r.map((n) => D`<p>${e("car.attach.ask", {
			name: n.source.name ?? o(e, n.source),
			from: n.car.name,
			car: t.name
		})}</p>`)}
      ${i.map((t) => D`<p>${e("car.attach.empty", { from: t.name })}</p>`)}
      <div class="row">
        <button type="button" class="mini-btn go" ?disabled=${this.busy} @click=${() => this.attach(t, n, !0)}>${e("car.attach.yes")}</button>
        <button type="button" class="mini-btn quiet" ?disabled=${this.busy} @click=${() => this.asking = !1}>${e("car.attach.no")}</button>
        ${l(e, "car_attach")}
      </div>
    </div>`;
	}
	what(e, t) {
		let n = o(e, t.source), r = t.car ? e(this.car ? "car.attach.from" : "car.find.of", { car: t.car.name }) : t.ignored ? e("car.find.ignored") : e("car.find.new");
		return D`<span class="what">
      <b>${t.source.name ?? n}</b>
      <small>${e("car.source.from", { from: n })}</small>
      <small class=${t.ignored && !t.car ? "left-out" : ""}>${r}</small>
    </span>`;
	}
	toggle(e) {
		this.picked = this.picked.includes(e) ? this.picked.filter((t) => t !== e) : [...this.picked, e];
	}
	async search() {
		this.searching = !0, this.failed = !1;
		try {
			this.found = await Vr(this, this.hass) ?? this.found, this.searched = !0;
		} catch {
			this.failed = !0;
		}
		this.searching = !1;
	}
	async attach(e, t, n = !1) {
		if (this.hass && t.length) {
			if (!n && t.some((e) => e.car)) {
				this.asking = !0;
				return;
			}
			this.busy = !0, this.failed = !1;
			try {
				await Hr(this.hass, e.id, t.map((e) => e.source.id)), this.picked = [], this.asking = !1, this.dispatchEvent(new CustomEvent("joe-attached", {
					bubbles: !0,
					composed: !0
				}));
			} catch {
				this.failed = !0;
			}
			this.busy = !1;
		}
	}
	async useAsNew(e) {
		if (this.hass) {
			this.busy = !0, this.failed = !1;
			try {
				let t = await Hr(this.hass, null, [e.source.id]);
				t && x(this, _e(t));
			} catch {
				this.failed = !0;
			}
			this.busy = !1;
		}
	}
};
d([b({ attribute: !1 })], Ur.prototype, "hass", void 0), d([b({ attribute: !1 })], Ur.prototype, "t", void 0), d([b({ attribute: !1 })], Ur.prototype, "state", void 0), d([b({ attribute: !1 })], Ur.prototype, "discovery", void 0), d([b({ attribute: !1 })], Ur.prototype, "prefix", void 0), d([b({ attribute: !1 })], Ur.prototype, "car", void 0), d([T()], Ur.prototype, "searching", void 0), d([T()], Ur.prototype, "searched", void 0), d([T()], Ur.prototype, "failed", void 0), d([T()], Ur.prototype, "busy", void 0), d([T()], Ur.prototype, "found", void 0), d([T()], Ur.prototype, "picked", void 0), d([T()], Ur.prototype, "asking", void 0), u("joe-car-search", Ur);
//#endregion
//#region src/components/car-steer.ts
var Wr = /* @__PURE__ */ new Map(), Gr = (e, t) => JSON.stringify(e ?? null) === JSON.stringify(t ?? null);
function Kr(e, t) {
	let n = {};
	for (let r of Object.keys(t)) if (!(r === "id" || Gr(t[r], e[r]))) {
		if (r === "need") {
			let r = {};
			for (let [n, i] of Object.entries(t.need)) Gr(i, e.need[n]) || (r[n] = i);
			n.need = r;
		} else n[r] = t[r];
	}
	return n;
}
function qr(e, t) {
	let n = {
		...e,
		...t
	};
	return t.need && (n.need = {
		...e.need,
		...t.need
	}), n;
}
var Jr = /^([01]\d|2[0-3]):[0-5]\d$/, Yr = class extends O {
	constructor(...e) {
		super(...e), this.prefix = A, this.section = "need", this.saving = !1, this.problem = "", this.version = 0;
	}
	static {
		this.styles = [
			k,
			yn,
			w`
      :host {
        display: block;
      }
      .steer-bar {
        position: sticky;
        bottom: 0;
        z-index: 1;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
        margin: 18px -4px 0;
        padding: 12px 4px;
        background: var(--joe-surface);
        border-top: 1px solid var(--joe-line);
      }
      .steer-bar .unsaved {
        flex-basis: 100%;
        color: var(--joe-ink-2);
        font-weight: 600;
      }
      .steer-bar .with-tip {
        gap: 8px;
      }
      :host > .fields > .field:first-child {
        margin-top: 0;
      }
      .time {
        width: 120px;
      }
    `
		];
	}
	get config() {
		return this.state?.config;
	}
	get mailboxes() {
		return this.state?.mailbox;
	}
	get accounts() {
		return this.state?.accounts;
	}
	get apps() {
		return this.state?.apps;
	}
	get existing() {
		return this.car;
	}
	get key() {
		return `${this.car?.id ?? ""}|${this.section}`;
	}
	get changes() {
		let e = Wr.get(this.key);
		return e ? Kr(e.base, e.draft) : {};
	}
	get draft() {
		let e = this.car;
		return e && Wr.has(this.key) ? qr(e, this.changes) : e;
	}
	get dirty() {
		let e = Wr.get(this.key);
		return !!(e && !e.pending && this.car && Object.keys(Kr(this.car, this.draft)).length);
	}
	setDraft(e) {
		let t = this.car, n = this.draft;
		t && n && (Wr.set(this.key, {
			base: structuredClone(t),
			draft: {
				...n,
				...e
			},
			pending: !1
		}), this.problem = "", this.version++);
	}
	willUpdate(e) {
		e.has("car") && Wr.get(this.key)?.pending && Wr.delete(this.key);
	}
	render() {
		let { t: e, hass: t, draft: n } = this;
		return !e || !t || !n ? j : (this.version, D`<div class="fields">${this.fields(e, n)}</div>
      ${this.problem ? D`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.problem}</span></div>` : j}
      ${this.dirty ? D`<div class="steer-bar" role="region" aria-label=${e("action.steer.unsaved")}>
            <span class="unsaved">${e("action.steer.unsaved")}</span>
            <span class="with-tip" data-tipped>
              <button type="button" class="btn btn-primary" ?disabled=${this.saving} @click=${this.save}>${e("common.save")}</button>
              ${l(e, "car_save")}
            </span>
            <button type="button" class="btn btn-ghost" data-notip ?disabled=${this.saving} @click=${this.cancel}>${e("common.cancel")}</button>
          </div>` : j}`);
	}
	fields(e, t) {
		return this.section === "calendars" ? un(this) : this.section === "manual" ? D`${ln(this)}
      ${B(e, e("car.f.tracker"), "car_tracker", Gt(this, t.tracker_entity ?? "", () => this.pickTracker()))}` : D`${cn(this)}
      ${B(e, e("car.f.remind"), "car_remind", D`<div class="row">
          <button
            type="button"
            class="switch"
            role="switch"
            aria-checked=${String(t.remind)}
            aria-label=${e("car.f.remind")}
            @click=${() => this.setDraft({ remind: !this.draft.remind })}
          ></button>
          <span>${e("car.f.remind_at")}</span>
          <input
            class="input time"
            type="time"
            aria-label=${e("car.f.remind_time")}
            ?disabled=${!t.remind}
            .value=${t.remind_time}
            @change=${(e) => {
			let t = e.target.value;
			Jr.test(t) && this.setDraft({ remind_time: t });
		}}
          />
        </div>`)}
      ${B(e, e("car.f.name"), "car_name", D`<input
          class="input"
          type="text"
          maxlength="60"
          .value=${t.name}
          @change=${(e) => this.setDraft({ name: e.target.value.trim() || t.name })}
        />`)}`;
	}
	async pickTracker() {
		let e = this.t, t = await L(this, {
			heading: e("car.pick.tracker"),
			tip: "car_tracker",
			filter: "presence",
			selected: this.draft?.tracker_entity ? [this.draft.tracker_entity] : []
		});
		t && this.setDraft({ tracker_entity: t.selected[0] ?? null });
	}
	cancel() {
		Wr.delete(this.key), this.problem = "", this.version++;
	}
	async save() {
		let e = this.draft, t = this.car;
		if (!e || !t) return;
		let n = Kr(t, e);
		if (!Object.keys(n).length) {
			this.cancel();
			return;
		}
		let r = this.key;
		this.saving = !0;
		let i = await I(this, { cars: { [t.id]: n } });
		this.saving = !1, i && (Wr.set(r, {
			base: structuredClone(t),
			draft: e,
			pending: !0
		}), this.version++);
	}
};
d([b({ attribute: !1 })], Yr.prototype, "hass", void 0), d([b({ attribute: !1 })], Yr.prototype, "t", void 0), d([b({ attribute: !1 })], Yr.prototype, "state", void 0), d([b({ attribute: !1 })], Yr.prototype, "discovery", void 0), d([b({ attribute: !1 })], Yr.prototype, "prefix", void 0), d([b({ attribute: !1 })], Yr.prototype, "car", void 0), d([b({ attribute: !1 })], Yr.prototype, "section", void 0), d([T()], Yr.prototype, "saving", void 0), d([T()], Yr.prototype, "problem", void 0), d([T()], Yr.prototype, "version", void 0);
function Xr(e) {
	return {
		name: e,
		sources: [],
		tracker_entity: null,
		need: { ...Lt },
		remind: !0,
		remind_time: "20:00"
	};
}
u("joe-car-steer", Yr);
//#endregion
//#region src/pages/devices/device-actions.ts
async function Zr(e, t, n) {
	return await I(e, {
		batteries: { [n.id]: {
			name: n.name,
			adapter: n.adapter,
			soc_entity: n.soc_entity,
			power: n.power,
			capacity_kwh: n.capacity_kwh,
			capacity_entity: n.capacity_entity,
			max_charge_w: n.max_charge_w,
			max_discharge_w: n.max_discharge_w,
			device_id: n.device_id,
			controls: n.controls,
			priority: Math.min(t.batteries.length + 1, 9)
		} },
		answers: { ignored: Ye(t, `battery:${n.id}`, !1) }
	}, "read") ? n.id : null;
}
async function Qr(e, t, n, r) {
	let i = (await L(e, {
		heading: t("pick.battery.title"),
		tip: "pick_battery",
		filter: "soc",
		selected: [],
		exclude: r.batteries.map((e) => e.soc_entity)
	}))?.selected[0];
	if (!i) return null;
	let a = n.entities?.[i]?.device_id, o = a && !r.batteries.some((e) => e.id === a) ? a : i;
	return await I(e, { batteries: { [o]: {
		name: a && (n.devices?.[a]?.name_by_user || n.devices?.[a]?.name) || _(n, i),
		adapter: "none",
		soc_entity: i,
		device_id: a ?? null,
		priority: Math.min(r.batteries.length + 1, 9)
	} } }) ? o : null;
}
function $r(e, t, n) {
	return I(e, { answers: { ignored: Ye(t, n, !0) } });
}
//#endregion
//#region src/components/ha-open.ts
function ei(e, t, n) {
	return {
		deviceId: t ? e?.entities?.[t]?.device_id ?? null : null,
		entityId: t ?? null,
		name: n
	};
}
function G(e, t) {
	let { deviceId: n, entityId: r, name: i } = t;
	if (n) {
		let t = `/config/devices/device/${n}`, r = e("ha.open.device", { name: i });
		return D`<a
      class="ha-open"
      data-notip
      href=${t}
      title=${r}
      aria-label=${r}
      @click=${(e) => {
			e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0 || (e.preventDefault(), ee(t));
		}}
      ><ha-icon icon="mdi:open-in-new"></ha-icon
    ></a>`;
	}
	if (r) {
		let t = e("ha.open.entity", { name: i });
		return D`<button
      type="button"
      class="ha-open"
      data-notip
      title=${t}
      aria-label=${t}
      @click=${(e) => e.currentTarget.dispatchEvent(new CustomEvent("hass-more-info", {
			detail: { entityId: r },
			bubbles: !0,
			composed: !0
		}))}
    >
      <ha-icon icon="mdi:open-in-new"></ha-icon>
    </button>`;
	}
	return j;
}
//#endregion
//#region src/components/device-card.ts
function ti(e, t, n) {
	return D`<article class="dcard ${n.problem ? "problem" : ""}">
    <a class="dcard-main" href=${E(t, n.to)} @click=${C(n.to, n.sheet ? { sheet: !0 } : void 0)}>
      <ha-icon icon=${n.icon}></ha-icon>
      <span class="dcard-text">
        <span class="dcard-name"
          >${n.name}${n.problem ? D`<i class="dcard-dot" aria-hidden="true"></i>` : j}</span
        >
        ${n.area ? D`<span class="dcard-area">${n.area}</span>` : j}
        ${n.state ? D`<span class="dcard-state">${n.state}</span>` : j}
        ${n.problem ? D`<span class="dcard-problem">${n.problem}</span>` : j}
        ${n.role ? D`<span class="dcard-meta"><span class="chip">${e(`devices.role.${n.role}`)}</span></span>` : j}
      </span>
    </a>
    ${G(e, n.ha)}
    ${n.quick ? D`<div class="dcard-quick">${n.quick}</div>` : j}
  </article>`;
}
function ni(e, n, r, i) {
	let a = ie(n, t(r, i, "soc")?.entity), o = ie(n, t(r, i, "range")?.entity);
	return [a === null ? null : `${v(e.lang, a, 0)} %`, o === null ? null : `${v(e.lang, o, 0)} km`].filter(Boolean).join(" · ");
}
function ri(e, t) {
	return t === null ? void 0 : e("devices.card.kw", { value: v(e.lang, t, t >= 10 ? 1 : 2) });
}
function ii(e, t, n, r) {
	if (!t) return;
	if (r.unassigned) return e(r.deviceId ? "devices.card.unassigned" : "devices.card.unassigned_kind");
	if (r.setup) return e(r.setup === "wallbox" ? "devices.card.setup_car" : "devices.card.setup_hot_water");
	if (r.battery) {
		let n = ie(t, r.battery.soc_entity), i = re(t, r.battery.power), a = [n === null ? null : `${v(e.lang, n, 0)} %`];
		return i !== null && a.push(Math.abs(i) < .05 ? e("devices.power.idle") : e(i > 0 ? "devices.power.charge" : "devices.power.discharge", { value: v(e.lang, Math.abs(i), 2) })), a.filter(Boolean).join(" · ") || void 0;
	}
	if (r.group === "climate") {
		let n = r.entityId ? t.states[r.entityId]?.attributes : void 0, i = r.climate?.current_temperature ?? (typeof n?.current_temperature == "number" ? n.current_temperature : null), a = r.climate?.temperature ?? (typeof n?.temperature == "number" ? n.temperature : null);
		return i !== null && a !== null ? e("devices.card.climate", {
			current: v(e.lang, i, 1),
			target: v(e.lang, a, 1)
		}) : i === null ? void 0 : e("devices.card.temp", { value: v(e.lang, i, 1) });
	}
	if (r.part) {
		let i = n?.config.measurements;
		if (r.part === "connection") {
			let n = re(t, i?.grid_power);
			if (n === null) return;
			let r = v(e.lang, Math.abs(n), 2);
			return e(n >= 0 ? "devices.card.import" : "devices.card.export", { value: r });
		}
		return ri(e, r.part === "solar" ? s(t, i?.solar_power ?? []) : re(t, i?.home_power));
	}
	if (r.car && n) return [ni(e, t, n, r.car.id), i(e, n, r.car)].filter(Boolean).join(" · ");
	let a = r.action;
	if (r.point && a && n) {
		let t = n.control?.actions?.[a.id]?.on;
		return [g(e, n, a), t ? e("devices.card.running") : ""].filter(Boolean).join(" · ");
	}
	if (a && n?.control?.actions?.[a.id]?.on) return e("devices.card.running");
	if (r.group === "hot_water" && a?.sensor_entity) {
		let n = ie(t, a.sensor_entity);
		return n === null ? void 0 : e("devices.card.temp", { value: v(e.lang, n, 0) });
	}
	let o = r.consumer?.power_entity ?? a?.power_entity;
	if (o) {
		let n = t.states[o]?.attributes.unit_of_measurement, r = ie(t, o);
		return ri(e, r === null ? null : n === "W" ? r / 1e3 : r);
	}
	return r.noMeter ? e("devices.no_meter_group") : void 0;
}
function ai(e, t, n, r, i = {}) {
	return {
		name: r.name,
		area: r.area,
		icon: r.icon,
		state: ii(e, t, n, r),
		role: r.unassigned || r.setup ? void 0 : r.role,
		problem: r.problem,
		to: r.setup ? it(r.setup, r.id) : R(r),
		sheet: !!r.setup,
		ha: {
			deviceId: r.deviceId,
			entityId: r.entityId,
			name: r.name
		},
		...i
	};
}
//#endregion
//#region src/components/battery-stuck.ts
function oi(e, t, n, r, i = "") {
	if (typeof n == "boolean") return e(n ? "common.on" : "common.off");
	if (typeof n == "number") {
		let a = t?.states[r]?.attributes.unit_of_measurement, o = typeof a == "string" && a ? a : i;
		return `${v(e.lang, n, 1)}${o ? ` ${o}` : ""}`;
	}
	return n == null || n === "" ? "–" : String(n);
}
function si(e, t, n) {
	return {
		name: n.name,
		value: oi(e, t, n.value, n.entity_id, n.reason === "reserve" ? "%" : ""),
		soc: v(e.lang, n.soc, 1)
	};
}
function ci(e, t, n) {
	return e(n.reason === "charge" ? "stuck.title.charge" : "stuck.title.discharge", { name: t });
}
function li(e, t, n) {
	return e(`stuck.${n.reason}`, si(e, t, n));
}
function ui(e, t, n) {
	return e(`stuck.short.${n.reason}`, si(e, t, n));
}
function di(e, t) {
	let n = /* @__PURE__ */ new Date(), r = `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`, i = N(t);
	return t.slice(0, 10) === r ? e("stuck.since", { time: i }) : e("stuck.since.day", {
		day: U(e.lang, t, "short"),
		time: i
	});
}
function fi(e, t, n, r) {
	let i = r?.stuck?.[n.id];
	return i ? D`<div class="note warn stuck" role="status" data-tipped>
    <ha-icon icon="mdi:battery-lock"></ha-icon>
    <span>
      <b>${ci(e, n.name, i)}</b> ${ui(e, t, i)}
      <small class="stuck-since">${di(e, i.since)}</small>
      <div class="note-actions stuck-actions">${G(e, {
		entityId: i.entity_id,
		name: i.name
	})}${l(e, "stuck")}</div>
    </span>
  </div>` : j;
}
//#endregion
//#region src/components/battery-team.ts
function pi(e) {
	return (e?.config.batteries.length ?? 0) >= 2 ? e?.control?.team : void 0;
}
function mi(e, t) {
	let n = e.rules[t] ?? [], r = (t) => {
		let r = n.indexOf(t.id);
		return r < 0 ? n.length + e.batteries.indexOf(t) : r;
	};
	return [...e.batteries].sort((e, t) => r(e) - r(t));
}
function hi(e, t) {
	return e.self_regulating ?? t?.batteries[e.id]?.proposed ?? !1;
}
function gi(e, t) {
	return e.control_group ?? t?.batteries[e.id]?.group ?? `own:${e.id}`;
}
function _i(e, t, n = e.batteries) {
	let r = /* @__PURE__ */ new Map();
	for (let e of n) {
		let n = gi(e, t);
		r.set(n, [...r.get(n) ?? [], e]);
	}
	return [...r.values()];
}
function vi(e, t) {
	return t.length < 2 ? t[0] ?? "" : e("team.together", {
		first: t[0],
		rest: t.slice(1).join(", ")
	});
}
function yi(e, t, n) {
	return vi(e, n.map((e) => t.batteries[e]?.name ?? e));
}
function bi(e) {
	let t = Object.keys(e.batteries).filter((t) => e.batteries[t].charge !== null), n = /* @__PURE__ */ new Map();
	for (let r of t) {
		let t = e.batteries[r].group ?? r;
		n.set(t, [...n.get(t) ?? [], r]);
	}
	return [...n.values()];
}
function xi(e) {
	return e.active_batteries ?? (e.active ? [e.active] : []);
}
function Si(e, t, n) {
	let r = t.batteries[n[0]], i = yi(e, t, xi(t)), a = {
		name: yi(e, t, n),
		active: i
	};
	if (r.why === "active") {
		let i = n.reduce((e, n) => e + (t.batteries[n]?.power_w ?? 0), 0), o = i > 50 ? "charging" : i < -50 ? "discharging" : "idle";
		return r.charge === "blocked" ? e("team.part.active_discharge_only", a) : e(r.discharge === "blocked" ? "team.part.active_charge_only" : `team.part.active_${o}`, a);
	}
	return r.why === "base" ? e("team.part.base", {
		...a,
		w: v(e.lang, t.base?.w ?? 0, 0)
	}) : e(`team.part.${r.why ?? "waits_empty"}`, a);
}
function Ci(e, t) {
	return Object.keys(e.batteries).filter((n) => e.batteries[n].why === t);
}
function wi(e, t) {
	let n = (e) => {
		let t = /* @__PURE__ */ new Date(Date.now() - e * 864e5);
		return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
	};
	return t === n(0) ? e("team.day.today") : t === n(1) ? e("team.day.yesterday") : e("team.day.on", { date: `${t.slice(8, 10)}.${t.slice(5, 7)}.` });
}
function Ti(e, t) {
	let n = Ei(e, t);
	return n && t?.dry ? `${n} ${e("team.reason.dry")}` : n;
}
function Ei(e, t) {
	if (!t || t.state !== "on" || !t.active) return null;
	let n = yi(e, t, xi(t)), r = Ci(t, "along");
	if (t.along && r.length) return e(`team.reason.along.${t.along}`, {
		active: n,
		others: yi(e, t, r)
	});
	let i = Ci(t, "helps");
	if (t.help && i.length) return e("team.reason.help", {
		active: n,
		others: yi(e, t, i)
	});
	if (t.base?.batteries.length) return e("team.reason.base", {
		active: n,
		others: yi(e, t, t.base.batteries),
		w: v(e.lang, t.base.w, 0)
	});
	let a = t.along_plan;
	if (a && !t.parallel && new Date(a.until).getTime() > Date.now()) {
		let r = {
			active: n,
			others: yi(e, t, a.batteries),
			time: a.from.slice(11, 16)
		};
		return e(a.lead_min > 0 ? "team.reason.plan.lead" : "team.reason.plan", {
			...r,
			lead: a.lead_min
		});
	}
	return null;
}
function Di(e, t) {
	let n = t?.review;
	if (!t || !n) return null;
	let r = {
		when: wi(e, n.day),
		kwh: v(e.lang, n.room_kwh, 1)
	};
	return n.room_kwh >= .3 && n.short ? e("team.review.room", {
		...r,
		name: yi(e, t, n.short.batteries),
		soc: v(e.lang, n.short.soc ?? 0, 0)
	}) : n.room_kwh >= .3 ? e("team.review.room_full", r) : n.along_at || n.planned_at ? e("team.review.fine", r) : null;
}
function Oi(e, t) {
	let n = t?.learned;
	if (!n || !n.days) return e("team.learned.none");
	let r = Math.round(n.minutes);
	return r < 5 ? e("team.learned.no_lead", { days: n.days }) : e("team.learned.lead", {
		minutes: r,
		days: n.days
	});
}
function ki(e, t, n) {
	let r = n?.suggest;
	if (!n || !r || t.rules.team_early != null) return null;
	let i = yi(e, n, r.batteries);
	return {
		title: e("team.suggest.title", {
			when: wi(e, r.day),
			kwh: v(e.lang, r.kwh, 1),
			name: i,
			soc: v(e.lang, r.soc ?? 0, 0)
		}),
		text: e("team.suggest.text", {
			name: i,
			minutes: r.lead_min
		})
	};
}
function Ai(e, t) {
	if (t.state === "on") {
		let n = bi(t), r = xi(t)[0], i = [...n.filter((e) => e.includes(r)), ...n.filter((e) => !e.includes(r))].map((n) => Si(e, t, n)).join(" · ");
		return e(t.dry ? "team.now.dry" : "team.now", { parts: i });
	}
	return t.state === "bridging" ? e("team.state.bridging", {
		why: e.optional(`team.gap.${t.gap?.reason ?? ""}`) ?? e("team.gap.unknown"),
		time: (t.gap?.until ?? "").slice(11, 16)
	}) : t.state === "not_taken" ? e("team.state.not_taken", { names: yi(e, t, Object.keys(t.batteries).filter((e) => t.batteries[e].problem)) }) : e.optional(`team.state.${t.state}`) ?? t.state;
}
function ji(e) {
	return e.map((e) => `„${e}“`).join(", ");
}
function Mi(e, t) {
	if (!t || t.state !== "on" || t.dry || !t.active) return null;
	let n = xi(t), r = bi(t).filter((e) => !e.some((e) => n.includes(e))).map((n) => yi(e, t, n));
	return (t.along || t.help || t.base ? Ti(e, t) : null) || e(t.parallel && Object.values(t.batteries).some((e) => e.why === "parallel") ? "team.doing.parallel" : "team.doing", {
		active: yi(e, t, n),
		others: r.join(", ")
	});
}
function Ni(e) {
	return (e?.config.batteries.length ?? 0) >= 2 ? e?.control?.guard : void 0;
}
function Pi(e, t) {
	return t.map((t) => e.batteries.find((e) => e.id === t)?.name ?? t).join(", ");
}
function Fi(e) {
	let t = e.slice(0, 10), n = /* @__PURE__ */ new Date(), r = `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`, i = e.slice(11, 16);
	return t === r ? i : `${t.slice(8, 10)}.${t.slice(5, 7)}. ${i}`;
}
function Ii(e, t) {
	return t < 120 ? e("guard.seconds", { n: t }) : e("guard.minutes", { n: Math.round(t / 60) });
}
function Li(e, t, n) {
	if (t.state !== "on") return e(`guard.state.${t.state}`);
	let r = t.last;
	if (!r) return e("guard.watching");
	let i = {
		time: Fi(r.at),
		battery: Pi(n, [r.battery]),
		direction: e(`guard.direction.${r.direction}`),
		duration: Ii(e, r.seconds)
	};
	if (r.result === "inside") {
		let t = e("guard.last.inside", {
			...i,
			charging: Pi(n, r.charging),
			discharging: Pi(n, r.discharging)
		});
		return r.dry ? `${t} ${e("guard.dry")}` : t;
	}
	let a = Math.min(3, Math.max(1, r.stage)), o = r.result === "fixed" ? e(`guard.last.fixed.${a}`, i) : r.result === "running" ? e(`guard.last.running.${a === 1 ? 1 : 2}`, i) : e(`guard.last.${r.result}`, i);
	return r.dry && (r.result === "running" || r.result === "alarm" || r.result === "fixed") ? `${o} ${e("guard.dry")}` : o;
}
function Ri(e, t, n) {
	let r = t?.last;
	return !t || t.state !== "on" || !r || r.result !== "alarm" || r.dry ? null : e("guard.alarm", {
		charging: Pi(n, r.charging),
		discharging: Pi(n, r.discharging)
	});
}
function zi(e, t, n) {
	let r = t?.last;
	return !t || t.state !== "on" || !r || r.result !== "inside" || r.dry || r.over ? null : e("guard.inside", {
		charging: Pi(n, r.charging),
		discharging: Pi(n, r.discharging)
	});
}
function Bi(e, t) {
	let n = {};
	for (let r of e.batteries) {
		let e = t.batteries[r.id];
		r.control_group == null && e?.self_regulating && e.group && (n[r.id] = { control_group: e.group });
	}
	return { batteries: n };
}
function Vi(e, t) {
	return e.batteries.filter((e) => e.control_group == null && t.batteries[e.id]?.self_regulating && t.batteries[e.id]?.group_sure === !1).map((e) => e.name).join(", ");
}
//#endregion
//#region src/components/log.ts
var Hi = [
	"all",
	"battery",
	"climate",
	"car",
	"hot_water",
	"other",
	"joe"
];
function Ui(e = [], t = []) {
	return [...e.map((e) => ({
		...e,
		area: "control"
	})), ...t.map((e) => ({
		...e,
		area: "climate"
	}))].map((e, t) => ({
		entry: e,
		index: t
	})).sort((e, t) => t.entry.at.localeCompare(e.entry.at) || t.index - e.index).map(({ entry: e }) => e);
}
function Wi(e, t) {
	if (t.area === "climate") return {
		group: "climate",
		device: t.entity
	};
	let n = typeof t.battery == "string" ? t.battery : "";
	if (!n) return { group: "joe" };
	if (n.startsWith("action:")) {
		let t = n.slice(7), r = e?.actions.find((e) => e.id === t);
		if (!e || !r) return {
			group: "other",
			device: `action-${t}`
		};
		let i = rt(e, r);
		return {
			group: i.group,
			device: i.id
		};
	}
	return {
		group: "battery",
		device: n
	};
}
function Gi(e, t, n, r, i) {
	if (r === "climate") return n[i] ?? (t ? _(t, i) : i);
	if (r === "battery") return e?.batteries.find((e) => e.id === i)?.name ?? i;
	let a = i.startsWith("action-") ? i.slice(7) : i.startsWith("point:") ? i.slice(6) : i;
	return e?.actions.find((e) => e.id === a)?.name ?? e?.consumers.find((e) => e.id === i)?.name ?? i;
}
function Ki(e, t, n, r) {
	let i = t?.batteries.find((e) => e.id === n.battery)?.name ?? t?.actions.find((e) => `action:${e.id}` === n.battery)?.name ?? n.battery ?? "", a = {
		battery: i,
		entity: n.entity ? r ? _(r, n.entity) : n.entity : "",
		value: n.value == null ? "–" : String(n.value),
		target: String(n.target ?? ""),
		power: typeof n.power == "number" ? v(e.lang, n.power, 1) : "–",
		cap: typeof n.cap == "number" ? v(e.lang, n.cap, 1) : "–",
		soc: typeof n.soc == "number" ? v(e.lang, n.soc, 0) : "–",
		unit: typeof n.unit == "string" ? n.unit : "%",
		until: typeof n.until == "string" ? n.until.slice(11, 16) : "–",
		loadpoint: typeof n.loadpoint == "string" ? n.loadpoint : "evcc",
		remaining: typeof n.remaining == "number" ? v(e.lang, n.remaining, 1) : "–",
		headroom: typeof n.headroom == "number" ? v(e.lang, n.headroom, 1) : "–",
		level: typeof n.level == "number" ? v(e.lang, n.level, 0) : "–",
		planned: typeof n.planned == "number" ? v(e.lang, n.planned, 1) : "–",
		charged: typeof n.charged == "number" ? v(e.lang, n.charged, 1) : "–"
	}, o = (e) => t?.batteries.find((t) => t.id === e)?.name ?? String(e ?? ""), s = (e) => Array.isArray(e) ? e.map(o).join(", ") : "";
	if (n.kind.startsWith("team_")) {
		let t = {
			...a,
			battery: Array.isArray(n.batteries) && n.batteries.length > 1 ? vi(e, n.batteries.map(o)) : i,
			previous: o(n.previous),
			charging: s(n.charging),
			discharging: s(n.discharging),
			cutoff: typeof n.value == "number" ? v(e.lang, n.value, 1) : "–",
			level: typeof n.soc == "number" ? v(e.lang, n.soc, 1) : "–",
			names: Array.isArray(n.names) ? n.names.map((e) => `„${String(e)}“`).join(", ") : "",
			active: o(n.battery),
			others: Array.isArray(n.batteries) ? vi(e, n.batteries.map(o)) : "",
			energy: typeof n.energy == "number" ? v(e.lang, n.energy, 1) : "–",
			lead: typeof n.value == "number" ? v(e.lang, n.value, 0) : "–",
			watts: typeof n.power == "number" ? v(e.lang, n.power, 0) : "–"
		};
		return n.kind === "team_along" || n.kind === "team_along_end" ? e.optional(`log.${n.kind}.${String(n.reason)}`, t) ?? e(`log.${n.kind}`, t) : n.kind === "team_review" ? e(typeof n.batteries == "object" && n.batteries ? "log.team_review.short" : "log.team_review", t) : n.kind === "team_handover" ? e.optional(`log.team_handover.${String(n.reason)}`, t) ?? e("log.team_handover", t) : n.kind === "team_end" ? e.optional(`log.team_end.${String(n.reason)}`, t) ?? e("log.team_end", t) : n.kind === "team_block" ? e(`log.team_block.${n.charge ? n.discharge ? "both" : "charge" : n.discharge ? "discharge" : "free"}`, t) : n.kind === "team_transfer" ? e(n.blocked ? "log.team_transfer.blocked" : "log.team_transfer", t) : e.optional(`log.${n.kind}`, t) ?? n.kind;
	}
	if (n.kind.startsWith("guard_")) {
		let t = typeof n.seconds == "number" ? n.seconds : 0, i = {
			...a,
			charging: s(n.charging),
			discharging: s(n.discharging),
			names: Array.isArray(n.names) ? n.names.map((e) => `„${String(e)}“`).join(", ") : "",
			entities: Array.isArray(n.entities) ? n.entities.map((e) => r ? _(r, String(e)) : String(e)).join(", ") : "",
			duration: t < 120 ? e("guard.seconds", { n: t }) : e("guard.minutes", { n: Math.round(t / 60) })
		}, o = n.dry ? ".dry" : "", c;
		return c = n.kind === "guard_restart" ? e(n.clean ? `log.guard_restart.clean${o}` : `log.guard_restart${o}`, i) : n.kind === "guard_block" ? e(`log.guard_block.${n.direction === "discharge" ? "discharge" : "charge"}${o}`, i) : n.kind === "guard_alarm" ? e(`log.guard_alarm${o}`, i) : n.kind === "guard_inside" ? e(`log.guard_inside${o}`, i) : n.kind === "guard_fixed" ? e(`log.guard_fixed.${Math.min(3, Math.max(1, Number(n.stage) || 1))}`, i) : n.kind === "guard_restored" ? Array.isArray(n.failed) && n.failed.length > 0 ? e("log.guard_restored.failed", {
			...i,
			entities: n.failed.map((e) => r ? _(r, String(e)) : String(e)).join(", ")
		}) : e(n.reason === "start" ? "log.guard_restored.start" : "log.guard_restored", i) : e.optional(`log.${n.kind}`, i) ?? n.kind, typeof n.problem == "string" ? `${c} ${e("log.guard.problem", { code: n.problem })}` : c;
	}
	if (n.kind === "automations" || n.kind === "automations_off") {
		let t = Array.isArray(n.names) ? n.names.map((e) => `„${String(e)}“`).join(", ") : "";
		return e(`log.${n.kind}`, {
			...a,
			names: t
		});
	}
	if (n.kind === "day_buffer") return e(n.fill ? "log.day_buffer.fill" : "log.day_buffer.hold", a);
	if (n.kind === "day" && typeof n.level == "number") return e("log.day.buffer", a);
	if (n.kind === "released" && n.reason === "day_buffer") return e("log.released.day_buffer", a);
	if (n.kind === "night_none") {
		let t = typeof n.sun == "string" ? n.sun.slice(11, 16) : "–", r = typeof n.kwh == "number" ? v(e.lang, n.kwh, 1) : "–";
		return e.optional(`log.night_none.${String(n.why)}`, {
			...a,
			sun: t,
			kwh: r
		}) ?? e("log.night_none", {
			...a,
			sun: t,
			kwh: r
		});
	}
	if (n.kind === "surplus_end") return e.optional(`log.surplus_end.${String(n.reason)}`, a) ?? e("log.surplus_end", a);
	if (n.kind === "limit_ref_failed") return e.optional(`log.limit_ref_failed.${String(n.reason)}`, a) ?? e("log.limit_ref_failed", a);
	if (n.kind === "boost_end") return e.optional(`log.boost_end.${String(n.reason)}`, a) ?? e("log.boost_end.stopped", a);
	if (n.kind === "stuck") {
		let t = String(n.reason ?? ""), i = t === "reserve" && typeof n.value == "number" ? v(e.lang, n.value, 1) : oi(e, r, n.value, String(n.entity ?? ""));
		return e.optional(`log.stuck.${t}`, {
			...a,
			value: i
		}) ?? e("log.stuck", a);
	}
	if (n.kind === "answer") return e(n.yes ? "log.answer.yes" : "log.answer.no");
	if (n.kind === "test") return e(n.ok ? "log.test.ok" : "log.test.failed", a);
	if (n.kind === "probe") {
		let t = String(n.op ?? "");
		return e(n.ok ? "log.probe.ok" : "log.probe.failed", {
			...a,
			op: e.optional(`op.short.${t}`) ?? t
		});
	}
	return e.optional(`log.${n.kind}`, a) ?? n.kind;
}
function qi(e, t, n, r) {
	let i = n[t.entity] ?? (r ? _(r, t.entity) : t.entity);
	return D`<b>${i}</b> · ${e.optional(`climate.log.${t.what}`) ?? t.what}`;
}
function Ji(e, t, n) {
	if (!n || !n.group || n.group === "all") return !0;
	let r = Wi(e, t);
	return r.group === n.group && (!n.device || r.device === n.device);
}
var Yi = class extends O {
	constructor(...e) {
		super(...e), this.names = {}, this.entries = [], this.limit = Infinity;
	}
	static {
		this.styles = [k, w`
      :host {
        display: block;
      }
      .log {
        list-style: none;
        margin: 10px 0 0;
        padding: 0;
        display: grid;
        gap: 2px;
        font-size: 14px;
      }
      .log li {
        display: grid;
        grid-template-columns: 110px minmax(0, 1fr);
        gap: 10px;
        padding: 8px 0;
        border-top: 1px solid var(--joe-line);
      }
      .log li:first-child {
        border-top: 0;
      }
      .log time {
        color: var(--joe-muted);
        font-variant-numeric: tabular-nums;
      }
      .log b {
        font-weight: 600;
        overflow-wrap: anywhere;
      }
      .log span {
        overflow-wrap: anywhere;
      }
      .empty {
        margin: 10px 0 0;
        color: var(--joe-ink-2);
      }
      @media (max-width: 760px) {
        .log li {
          grid-template-columns: 1fr;
          gap: 0;
        }
      }
    `];
	}
	render() {
		let e = this.t;
		if (!e) return j;
		let t = this.entries.filter((e) => Ji(this.config, e, this.filter)).slice(0, this.limit);
		return t.length ? D`<ul class="log">
      ${t.map((t) => D`<li>
          <time datetime=${t.at}>${U(e.lang, t.at.slice(0, 10), "short")} ${t.at.slice(11, 16)}</time>
          <span
            >${t.area === "climate" ? qi(e, t, this.names, this.hass) : Ki(e, this.config, t, this.hass)}</span
          >
        </li>`)}
    </ul>` : D`<p class="empty">${this.empty ?? e("past.log.empty")}</p>`;
	}
};
d([b({ attribute: !1 })], Yi.prototype, "t", void 0), d([b({ attribute: !1 })], Yi.prototype, "hass", void 0), d([b({ attribute: !1 })], Yi.prototype, "config", void 0), d([b({ attribute: !1 })], Yi.prototype, "names", void 0), d([b({ attribute: !1 })], Yi.prototype, "entries", void 0), d([b({ attribute: !1 })], Yi.prototype, "limit", void 0), d([b({ attribute: !1 })], Yi.prototype, "filter", void 0), d([b({ attribute: !1 })], Yi.prototype, "empty", void 0), u("joe-log-list", Yi);
//#endregion
//#region src/pages/devices/device-frame.ts
var Xi = [
	"now",
	"steer",
	"power",
	"learned",
	"log",
	"intruders",
	"remove"
];
function Zi(e) {
	return e != null && e !== j && e !== "";
}
function Qi(e, t, n) {
	let r = {
		tab: "devices",
		section: n
	};
	return D`<a class="back-link" href=${E(t, r)} @click=${C(r)}
    >${e("nav.back", { name: e(`nav.devices.${n}`) })}</a
  >`;
}
function $i(e) {
	return D`<div class="note warn" role="status">
    <ha-icon icon="mdi:help-circle-outline"></ha-icon><span>${e("nav.not_found")}</span>
  </div>`;
}
function ea(e) {
	return Ui(e?.control?.log ?? [], e?.climate?.log ?? []);
}
function ta(e, t) {
	let n = t.group === "grid" ? "joe" : t.group, r = ii(e.t, e.hass, e.state, t), i = !!(t.setup || t.unassigned || t.noMeter);
	return {
		group: t.group,
		name: t.name,
		area: t.area,
		icon: t.icon,
		live: i ? void 0 : r,
		why: i ? r : void 0,
		ha: {
			deviceId: t.deviceId,
			entityId: t.entityId,
			name: t.name
		},
		problems: t.problems,
		log: t.group === "grid" ? void 0 : {
			entries: ea(e.state),
			filter: {
				group: n,
				device: t.id
			}
		}
	};
}
var na = {
	battery: "learn_battery",
	car: "learn_car",
	hot_water: "learn_hot_water",
	devices: "learn_groups",
	climate: "learn_climate"
};
function ra(e, t, n, r) {
	let { t: i } = e, a = t.tips?.[n] ?? (n === "learned" && t.learnedArea ? na[t.learnedArea] : void 0);
	return D`<section class="card dsec" data-section=${n} data-anchor=${n} ?data-tipped=${!!a}>
    <h3 class="dsec-title">${n === "remove" && t.removeTitle ? t.removeTitle : i(`devices.page.${n}`)}${a ? l(i, a) : j}</h3>
    ${r}
  </section>`;
}
function ia(e, t) {
	return D`<section class="card dsec" data-section=${t.anchor} data-anchor=${t.anchor} ?data-tipped=${!!t.tip}>
    <h3 class="dsec-title">${t.title}${t.tip ? l(e.t, t.tip) : j}</h3>
    ${t.body}
  </section>`;
}
function aa(e, t) {
	let n = t.log;
	if (!n || !n.entries.some((t) => Ji(e.state?.config, t, n.filter))) return;
	let r = n.filter, i = {
		tab: "review",
		section: "log",
		id: r.group ?? "all",
		sub: r.group && r.group !== "all" ? r.device : void 0
	};
	return D`<joe-log-list
      .t=${e.t}
      .hass=${e.hass}
      .config=${e.state?.config}
      .names=${n.names ?? {}}
      .entries=${n.entries}
      .filter=${r}
      .limit=${n.limit ?? 5}
    ></joe-log-list>
    <a class="mini-btn quiet frame-more" href=${E(e.prefix, i)} @click=${C(i)}>${e.t("devices.page.more_log")}</a>`;
}
function oa(e, t) {
	let { t: n, prefix: r } = e, i = {};
	for (let a of Xi) {
		if (a === "log") {
			let n = aa(e, t);
			n && (i.log = n);
			continue;
		}
		let o = t[a];
		if (!Zi(o)) continue;
		let s = {
			tab: "review",
			section: "learned",
			id: t.learnedArea
		};
		i[a] = a === "learned" && t.learnedArea ? D`${o}
            <a class="mini-btn quiet frame-more" href=${E(r, s)} @click=${C(s)}>${n("devices.page.more_learned")}</a>` : o;
	}
	return D`<div class="dframe">
    ${Qi(n, r, t.group)}
    <header class="card dhead">
      <div class="dhead-top">
        <ha-icon class="dhead-icon" icon=${t.icon ?? $e[t.group]}></ha-icon>
        <div class="dhead-text">
          <h2 class="dhead-name">${t.name}</h2>
          ${t.area ? D`<span class="dhead-area">${t.area}</span>` : j}
        </div>
        ${t.ha ? G(n, t.ha) : j}
      </div>
      ${Zi(t.live) ? D`<p class="dhead-live">${t.live}</p>` : j}
      ${Zi(t.why) ? D`<p class="dhead-why">${t.why}</p>` : j}
      ${(t.problems ?? []).map((e) => D`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e}</span></div>`)}
      ${Zi(t.head) ? t.head : j}
    </header>
    ${Xi.map((n) => D`${i[n] === void 0 ? j : ra(e, t, n, i[n])}
        ${n === "steer" ? (t.more ?? []).filter((e) => Zi(e.body)).map((t) => ia(e, t)) : j}`)}
  </div>`;
}
function sa(e, t, n, r) {
	let i = t.filter((e) => e.group === n);
	return D`<div class="dcards">
    ${i.map((t) => ti(e.t, e.prefix, ai(e.t, e.hass, e.state, t, r?.(t))))}
  </div>`;
}
function ca(e, t, n, r = !0) {
	return D`<div class="group-intro">
    ${y(t)} ${M}
    <p class="lead">${n}</p>
    ${r ? D`<p class="ha-hint with-tip" data-tipped>${e("climate.ha_open")} ${l(e, "ha_open")}</p>` : j}
  </div>`;
}
function la(e, t, n, r) {
	let i = it(n);
	return D`<a class="btn btn-secondary add-link" href=${E(t, i)} @click=${C(i, { sheet: !0 })}
    ><ha-icon icon="mdi:plus"></ha-icon>${r ?? e("devices.add")}</a
  >`;
}
var K = w`
  /* Group titles have one size in every group. */
  .display {
    font-size: clamp(30px, 4vw, 44px);
  }
  .group-intro {
    margin-bottom: 16px;
  }
  .ha-hint {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin: 8px 0 0;
    color: var(--joe-muted);
    font-size: 13px;
  }
  .dframe {
    max-width: 900px;
    margin: 0 auto;
  }
  .dhead {
    margin-top: 4px;
    display: grid;
    gap: 10px;
  }
  .dhead-top {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  .dhead-icon {
    --mdc-icon-size: 28px;
    margin-top: 4px;
    color: var(--joe-ink-2);
  }
  .dhead-text {
    flex: 1;
    min-width: 0;
    display: grid;
    gap: 2px;
  }
  .dhead-name {
    margin: 0;
    font-family: var(--joe-display);
    font-style: italic;
    font-weight: 800;
    font-size: clamp(26px, 4vw, 34px);
    line-height: 1.1;
    overflow-wrap: anywhere;
  }
  .dhead-area {
    color: var(--joe-muted);
    font-size: 14px;
  }
  .dhead-live {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }
  .dhead-why {
    margin: 0;
    color: var(--joe-ink-2);
  }
  .dsec {
    margin-top: 14px;
  }
  .dsec-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 10px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--joe-muted);
  }
  a.frame-more {
    min-height: 44px;
    margin-top: 6px;
    text-decoration: none;
  }
  a.add-link {
    min-height: 44px;
    text-decoration: none;
  }
`, q = class extends O {
	constructor(...e) {
		super(...e), this.prefix = A, this.checks = [], this.devices = [];
	}
	get ctx() {
		return {
			t: this.t,
			prefix: this.prefix,
			hass: this.hass,
			state: this.state
		};
	}
};
d([b({ attribute: !1 })], q.prototype, "hass", void 0), d([b({ attribute: !1 })], q.prototype, "t", void 0), d([b({ attribute: !1 })], q.prototype, "state", void 0), d([b({ attribute: !1 })], q.prototype, "route", void 0), d([b({ attribute: !1 })], q.prototype, "prefix", void 0), d([b({ attribute: !1 })], q.prototype, "discovery", void 0), d([b({ attribute: !1 })], q.prototype, "info", void 0), d([b({ attribute: !1 })], q.prototype, "checks", void 0), d([b({ attribute: !1 })], q.prototype, "climateFound", void 0), d([b({ attribute: !1 })], q.prototype, "devices", void 0);
var ua = class extends q {
	constructor(...e) {
		super(...e), this.group = "other";
	}
	static {
		this.styles = [
			k,
			K,
			w`
      :host {
        display: block;
      }
      .wrap {
        max-width: 1100px;
        margin: 0 auto;
      }
      .actions {
        margin-top: 16px;
      }
    `
		];
	}
	render() {
		let e = this.t;
		if (!e || !this.state) return j;
		let t = pt(this.devices, this.group, this.device);
		return t ? oa(this.ctx, ta(this.ctx, t)) : D`<div class="wrap">
      ${y(e(`nav.devices.${this.group}`))} ${this.device === void 0 ? j : $i(e)}
      ${sa(this.ctx, this.devices, this.group)}
      ${this.group === "grid" ? j : D`<div class="actions">${la(e, this.prefix)}</div>`}
    </div>`;
	}
};
d([b({ attribute: !1 })], ua.prototype, "device", void 0), d([b({ attribute: !1 })], ua.prototype, "sub", void 0);
//#endregion
//#region src/pages/devices/add.ts
var da = [
	{
		kind: "battery",
		icon: "mdi:home-battery-outline"
	},
	{
		kind: "car",
		icon: "mdi:car-electric"
	},
	{
		kind: "wallbox",
		icon: "mdi:ev-station"
	},
	{
		kind: "hot_water",
		icon: "mdi:water-boiler"
	},
	{
		kind: "climate",
		icon: "mdi:thermostat"
	},
	{
		kind: "night",
		icon: "mdi:weather-night"
	},
	{
		kind: "meter",
		icon: "mdi:meter-electric-outline"
	}
], fa = {
	wallbox: "ev",
	hot_water: "hot_water",
	night: "custom"
}, pa = {
	climate: {
		tab: "devices",
		section: "climate"
	},
	meter: {
		tab: "devices",
		section: "other"
	},
	other: {
		tab: "devices",
		section: "other"
	}
}, ma = class extends q {
	constructor(...e) {
		super(...e), this.behind = {
			tab: "devices",
			section: "all"
		}, this.busy = "", this.searchFailed = !1;
	}
	static {
		this.styles = [k, w`
      .lead {
        margin: 10px 0 0;
      }
      .choices {
        list-style: none;
        margin: 16px 0 0;
        padding: 0;
        display: grid;
        gap: 8px;
      }
      .choice {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        gap: 12px;
        width: 100%;
        min-height: 56px;
        padding: 10px 12px;
        border: 0;
        border-radius: 12px;
        background: var(--joe-surface-2);
        color: inherit;
        font: inherit;
        text-align: left;
        text-decoration: none;
        cursor: pointer;
        transition: background 0.12s, transform 0.12s;
      }
      .choice:hover {
        background: var(--joe-line);
      }
      .choice:active {
        transform: scale(0.99);
      }
      .choice > ha-icon {
        --mdc-icon-size: 24px;
        color: var(--joe-ink-2);
      }
      .choice span {
        display: grid;
        gap: 2px;
        min-width: 0;
      }
      .choice b {
        font-weight: 700;
      }
      .choice small {
        color: var(--joe-ink-2);
        font-size: 13.5px;
      }
      .choice .chevron {
        color: var(--joe-muted);
      }
      a.back-link {
        margin: -6px 0 6px;
      }
      .found {
        list-style: none;
        margin: 14px 0 0;
        padding: 0;
        display: grid;
      }
      .found li {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px 12px;
        padding: 10px 0;
        border-top: 1px solid var(--joe-line);
      }
      .found li:first-child {
        border-top: 0;
      }
      .found .what {
        flex: 1 1 180px;
        min-width: 0;
        display: grid;
      }
      .found b {
        font-weight: 600;
        overflow-wrap: anywhere;
      }
      .found small {
        color: var(--joe-muted);
        font-size: 13px;
      }
      .found .row-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .empty {
        margin: 14px 0 0;
        color: var(--joe-ink-2);
      }
      .by-hand {
        display: grid;
        gap: 8px;
        margin-top: 18px;
        padding-top: 14px;
        border-top: 1px solid var(--joe-line);
      }
      .by-hand .field-label {
        display: flex;
        align-items: center;
        gap: 6px;
        font-weight: 600;
      }
      .by-hand .row-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .by-hand .input {
        flex: 1 1 180px;
        min-width: 0;
      }
    `];
	}
	updated(e) {
		let t = this.kind ? pa[this.kind] : void 0;
		e.has("kind") && t && x(this, t, { replace: !0 });
	}
	render() {
		let e = this.t;
		return !e || !this.state || this.kind && pa[this.kind] ? j : D`<joe-sheet
      label=${e("devices.add.label")}
      closeLabel=${e("common.close")}
      @joe-close=${this.onClose}
      @joe-config=${this.onConfig}
    >
      ${this.kind === "battery" ? this.renderBattery(e) : this.kind === "car" ? this.renderCar(e) : this.kind && this.kind in fa ? this.renderAction(e, this.kind) : this.renderChoices(e)}
    </joe-sheet>`;
	}
	renderChoices(e) {
		return D`<div data-tipped>
      <div class="sheet-title">${y(e("devices.add.title"), "h2", l(e, "devices_add"))}</div>
      <p class="lead">${e("devices.add.lead")}</p>
      <ul class="choices">
        ${da.map(({ kind: t, icon: n }) => {
			let r = t in pa ? pa[t] : it(t, this.consumer), i = t in pa ? { replace: !0 } : {
				replace: !0,
				sheet: !0
			};
			return D`<li>
            <a class="choice" href=${E(this.prefix, r)} @click=${C(r, i)}>
              <ha-icon icon=${n}></ha-icon>
              <span><b>${e(`devices.add.${t}`)}</b><small>${e(`devices.add.${t}.text`)}</small></span>
              <ha-icon class="chevron" icon="mdi:chevron-right"></ha-icon>
            </a>
          </li>`;
		})}
        <li>
          <button type="button" class="choice" @click=${this.rediscover}>
            <ha-icon icon="mdi:magnify"></ha-icon>
            <span><b>${e("devices.add.rediscover")}</b><small>${e("devices.add.rediscover.text")}</small></span>
            <ha-icon class="chevron" icon="mdi:chevron-right"></ha-icon>
          </button>
        </li>
      </ul>
    </div>`;
	}
	backToChoices(e) {
		let t = it();
		return D`<a class="back-link" href=${E(this.prefix, t)} @click=${C(t, {
			replace: !0,
			sheet: !0
		})}
      >${e("nav.back", { name: e("devices.add.other") })}</a
    >`;
	}
	renderBattery(e) {
		let t = this.state.config, n = gt(t, this.discovery).filter((e) => e.kind === "battery" && e.battery), r = _t(t, this.discovery), i = (t, n, r) => D`<li>
        <span class="what">
          <b>${t.name}</b>
          <small>${e(n ? "devices.add.battery.ignored" : "devices.found.battery")}</small>
        </span>
        <span class="row-actions">
          <button type="button" class="mini-btn go" ?disabled=${!!this.busy} @click=${() => this.useFound(t, r)}>
            ${e(n ? "devices.add.battery.use" : "devices.found.use")}
          </button>
          ${n ? j : D`<button
                type="button"
                class="mini-btn quiet"
                ?disabled=${!!this.busy}
                @click=${() => this.ignore(r)}
              >
                ${e("devices.found.ignore")}
              </button>`}
        </span>
      </li>`;
		return D`${this.backToChoices(e)}
      <div data-tipped>
        <div class="sheet-title">${y(e("devices.add.battery.title"), "h2", l(e, "devices_found"))}</div>
        <p class="lead">${e("devices.add.battery.lead")}</p>
        ${n.length || r.length ? D`<ul class="found">
              ${n.map((e) => i(e.battery, !1, e.key))}
              ${r.map((e) => i(e, !0, `battery:${e.id}`))}
            </ul>` : D`<p class="empty">${e("devices.add.battery.none")}</p>`}
      </div>
      <div class="actions" data-tipped>
        <button type="button" class="btn btn-secondary" ?disabled=${!!this.busy} @click=${this.pick}>
          <ha-icon icon="mdi:magnify"></ha-icon>${e("devices.add.battery.pick")}
        </button>
        ${l(e, "review_battery_add")}
      </div>`;
	}
	renderCar(e) {
		let t = this.state.config, n = new Set((t.cars ?? []).flatMap((e) => e.sources.map((e) => e.id))), r = this.consumer?.startsWith("car:") ? this.consumer.slice(4) : "", i = (e) => F(t, a(e)) || F(t, `car:${e.id}`), s = (this.discovery?.car_sources ?? []).filter((e) => !n.has(e.id));
		return s.sort((e, t) => Number(t.device_id === r) - Number(e.device_id === r) || Number(i(e)) - Number(i(t))), D`${this.backToChoices(e)}
      <div data-tipped>
        <div class="sheet-title">${y(e("devices.add.car.title"), "h2", l(e, "devices_add_car"))}</div>
        <p class="lead">${e("devices.add.car.lead")}</p>
        ${s.length ? D`<ul class="found">
              ${s.map((t) => D`<li>
                  <span class="what">
                    <b>${t.name ?? t.id}</b>
                    <small>${e("car.source.from", { from: o(e, t) })}${i(t) ? ` · ${e("car.find.ignored")}` : ""}</small>
                  </span>
                  <span class="row-actions">
                    <button type="button" class="mini-btn go" ?disabled=${!!this.busy} @click=${() => this.useCar(t)}>
                      ${e(i(t) ? "car.find.reuse" : "devices.found.use")}
                    </button>
                    ${i(t) ? j : D`<button
                          type="button"
                          class="mini-btn quiet"
                          ?disabled=${!!this.busy}
                          @click=${() => this.ignore(a(t))}
                        >
                          ${e("devices.found.ignore")}
                        </button>`}
                  </span>
                </li>`)}
            </ul>` : D`<p class="empty">${e("devices.add.car.none")}</p>`}
      </div>
      <div class="actions" data-tipped>
        <button type="button" class="btn btn-secondary" ?disabled=${!!this.busy} @click=${this.searchCars}>
          <ha-icon icon="mdi:magnify"></ha-icon>${e("car.search")}
        </button>
        ${l(e, "car_search")}
      </div>
      ${this.searchFailed ? D`<p class="empty" role="status">${e("car.search.failed")}</p>` : j}
      <form
        class="by-hand"
        data-tipped
        @submit=${(e) => {
			e.preventDefault();
			let t = e.target.querySelector("input");
			this.makeCar(t.value.trim());
		}}
      >
        <label class="field-label" for="new-car">${e("devices.add.car.by_hand")} ${l(e, "devices_add_car_hand")}</label>
        <span class="row-actions">
          <input id="new-car" class="input" type="text" maxlength="60" placeholder=${e("devices.add.car.name")} />
          <button type="submit" class="btn btn-secondary" ?disabled=${!!this.busy}>${e("devices.add.car.make")}</button>
        </span>
      </form>`;
	}
	async useCar(e) {
		if (!this.hass) return;
		this.busy = e.id;
		let t;
		try {
			t = await Hr(this.hass, null, [e.id]);
		} catch {
			t = void 0;
		}
		this.busy = "", t && x(this, _e(t), { replace: !0 });
	}
	async searchCars() {
		this.busy = "search", this.searchFailed = !1;
		try {
			await Vr(this, this.hass);
		} catch {
			this.searchFailed = !0;
		}
		this.busy = "";
	}
	async makeCar(e) {
		let t = e || this.t("devices.add.car.name");
		this.busy = "hand";
		let n = ha(this.state.config, t), r = await I(this, { cars: { [n]: Xr(t) } });
		this.busy = "", r && x(this, _e(n, "sources"), { replace: !0 });
	}
	renderAction(e, t) {
		let n = this.state, r = this.consumer ?? "", i = /^(wallbox|car):/.test(r) ? r : "", a = (i ? void 0 : n.config.consumers.find((e) => e.id === r))?.name ?? (i ? gt(n.config, this.discovery).find((e) => e.key === i)?.name : void 0);
		return D`${this.backToChoices(e)}
      ${Br(`${t}:${this.consumer ?? ""}`, D`<joe-action-editor
          .hass=${this.hass}
          .mailboxes=${n.mailbox}
          .accounts=${n.accounts}
          .apps=${n.apps}
          .t=${e}
          .config=${n.config}
          .discovery=${this.discovery}
          actionId=${`new:${fa[t]}`}
          consumer=${i ? "" : r}
          found=${i}
          subtitle=${a ? e("devices.add.for", { name: a }) : ""}
        ></joe-action-editor>`)}`;
	}
	onConfig(e) {
		let t = e.detail.patch.actions, n = new Set(this.state?.config.actions.map((e) => e.id));
		for (let [r, i] of Object.entries(t ?? {})) if (i && !n.has(r)) {
			let t = e.detail;
			this.saved = {
				action: {
					...i,
					id: r
				},
				get result() {
					return t.result;
				}
			};
		}
	}
	async onClose() {
		let e = this.saved;
		this.saved = void 0;
		let t = this.state?.config;
		if (e && t && await (e.result ?? Promise.resolve(!1))) {
			let n = e.action, r = rt({
				...t,
				actions: [...t.actions.filter((e) => e.id !== n.id), n]
			}, n);
			x(this, R(r), { replace: !0 });
			return;
		}
		we(this, this.behind);
	}
	async useFound(e, t) {
		this.busy = t;
		let n = await Zr(this, this.state.config, e);
		this.busy = "", n && x(this, {
			tab: "devices",
			section: "battery",
			id: n
		}, { replace: !0 });
	}
	async ignore(e) {
		this.busy = e, await $r(this, this.state.config, e), this.busy = "";
	}
	async pick() {
		if (!this.hass) return;
		this.busy = "pick";
		let e = await Qr(this, this.t, this.hass, this.state.config);
		this.busy = "", e && x(this, {
			tab: "devices",
			section: "battery",
			id: e
		}, { replace: !0 });
	}
	rediscover() {
		this.dispatchEvent(new CustomEvent("joe-rediscover", {
			bubbles: !0,
			composed: !0
		})), x(this, {
			tab: "devices",
			section: "all"
		}, { replace: !0 });
	}
};
d([b({ attribute: !1 })], ma.prototype, "kind", void 0), d([b({ attribute: !1 })], ma.prototype, "consumer", void 0), d([b({ attribute: !1 })], ma.prototype, "behind", void 0), d([T()], ma.prototype, "busy", void 0), d([T()], ma.prototype, "searchFailed", void 0);
function ha(e, t) {
	let n = `car_${t.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "car"}`.slice(0, 40), r = new Set((e.cars ?? []).map((e) => e.id)), i = n;
	for (let e = 2; r.has(i); e++) i = `${n}_${e}`;
	return i;
}
u("joe-device-add", ma);
//#endregion
//#region src/components/day-surplus.ts
function ga(e) {
	return e?.config.rules.day_surplus ? e.control?.surplus : void 0;
}
function _a(e, t) {
	let n = t.controls?.charge_limit ?? t.controls?.system_charge_limit;
	if (!n || t.adapter === "steps" || t.adapter === "none") return "no_limit";
	let r = e?.states[n];
	if (!r || r.state === "unavailable" || r.state === "unknown") return "ok";
	let i = r.attributes.unit_of_measurement;
	return i === "W" || i === "kW" ? "ok" : i === "%" ? t.limit_ref_w ? "ok" : "need_ref" : "unit";
}
function va(e, t) {
	let n = t.controls?.charge_limit;
	return !!(n && t.adapter !== "none" && e?.states[n]?.attributes.unit_of_measurement === "%");
}
function ya(e, t) {
	let n = (t.loadpoints ?? []).filter((e) => e.wants).map((e) => e.name);
	return n.length ? e("surplus.loadpoint.named", { names: n.join(", ") }) : e("surplus.loadpoint.any");
}
function ba(e, t) {
	return t.state === "cap" ? e(t.dry ? "surplus.line.cap_dry" : "surplus.line.cap", {
		kw: v(e.lang, t.cap_kw ?? 0, 1),
		time: N(t.pv_end),
		loadpoint: ya(e, t)
	}) : e.optional(`surplus.state.${t.state}`) ?? t.state;
}
function xa(e, t) {
	return t.state === "cap" ? e("surplus.expected", {
		kwh: v(e.lang, t.expected_kwh ?? 0, 1),
		time: N(t.pv_end)
	}) : "";
}
function Sa(e, t) {
	return !t || t.state !== "cap" || t.dry ? null : e("surplus.doing", {
		kw: v(e.lang, t.cap_kw ?? 0, 1),
		loadpoint: ya(e, t),
		time: N(t.pv_end)
	});
}
var Ca = ["charge_delay", "predictive_charging"];
function wa(e, t, n = !1) {
	return (t?.conflicts ?? []).filter((e) => Ca.includes(e.code) === n).map((t) => e.optional(`surplus.conflict.${t.code}`, {
		value: v(e.lang, t.value ?? 0, 0),
		loadpoint: t.loadpoint ?? "",
		battery: t.battery ?? ""
	}) ?? t.code);
}
function Ta(e, t) {
	let n = wa(e, t), r = wa(e, t, !0);
	return !n.length && !r.length ? j : D`<div class="conflicts">
    ${n.length ? D`<div class="note warn" role="status">
        <ha-icon icon="mdi:alert-outline"></ha-icon>
        <span><b>${e("surplus.conflict.title")}</b> ${n.join(" ")} ${e("surplus.conflict.hint")}</span>
      </div>` : j}
  ${r.length ? D`<div class="note warn" role="status">
        <ha-icon icon="mdi:alert-outline"></ha-icon>
        <span><b>${e("surplus.device_conflict.title")}</b> ${r.join(" ")} ${e("surplus.device_conflict.hint")}</span>
      </div>` : j}
  </div>`;
}
//#endregion
//#region src/components/control-status.ts
function Ea(e, t) {
	let n = t.plan, r = t.control?.reason ?? "off";
	return r === "waiting" && n?.window ? e("devices.status.waiting", { time: N(n.window.start) }) : r === "day" ? me(e, n) : e(`devices.status.${r}`);
}
var Da = class extends O {
	constructor(...e) {
		super(...e), this.compact = !1, this.notice = "";
	}
	static {
		this.styles = [k, w`
      :host {
        display: block;
      }
      .card {
        padding: 18px 20px;
        margin-top: 14px;
      }
      .head {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .head .eyebrow {
        flex: 1;
        min-width: 0;
      }
      .status-text {
        margin: 10px 0 0;
        font-size: 17px;
        font-weight: 600;
      }
      .note {
        margin-top: 10px;
      }
      .actions {
        margin-top: 14px;
      }
      :host([compact]) .card {
        margin: 0;
        padding: 0;
        background: transparent;
        box-shadow: none;
      }
      :host([compact]) .actions {
        margin-top: 10px;
      }
    `];
	}
	render() {
		let e = this.t, t = this.state, n = t?.control;
		if (!e || !t || !n) return j;
		let r = ga(t)?.state === "cap" && !ga(t)?.dry, i = n.steering || n.pending || r;
		if (this.compact) return i || this.notice ? D`<section class="card status" ?data-tipped=${i}>${this.renderRelease(e, n.pending, i)}</section>` : j;
		let a = Ea(e, t), o = t.mode === "simulation" ? D`<span class="pill-sim">${e("mode.simulation")}</span>` : D`<span class="chip ${t.mode === "live" ? "ok" : t.mode === "advisory" ? "learned" : ""}"
            >${e(`mode.${t.mode}`)}</span
          >`;
		return D`<section class="card status" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:pulse"></ha-icon>${e("devices.now")}</div>
        ${o} ${l(e, "plan_steer")}
      </div>
      <p class="status-text">${a}</p>
      ${this.renderRelease(e, n.pending, i)}
    </section>`;
	}
	renderRelease(e, t, n) {
		return D`${t ? D`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("devices.pending")}</span></div>` : j}
      ${n ? D`<div class="actions">
            <button type="button" class="btn btn-danger" @click=${this.release}>
              <ha-icon icon="mdi:hand-back-left-outline"></ha-icon>${e("devices.release")}
            </button>
            ${l(e, "devices_release")}
          </div>` : j}
      ${this.notice ? D`<div class="note" role="status"><ha-icon icon="mdi:check"></ha-icon>${this.notice}</div>` : j}`;
	}
	async release() {
		try {
			await this.hass?.callWS({ type: "energy_joe/control/release" });
		} catch {
			this.notice = this.t("error.action");
		}
	}
};
d([b({ attribute: !1 })], Da.prototype, "hass", void 0), d([b({ attribute: !1 })], Da.prototype, "t", void 0), d([b({ attribute: !1 })], Da.prototype, "state", void 0), d([b({
	type: Boolean,
	reflect: !0
})], Da.prototype, "compact", void 0), d([T()], Da.prototype, "notice", void 0), u("joe-control-status", Da);
//#endregion
//#region src/pages/devices/all.ts
var Oa = {
	battery: "mdi:home-battery-outline",
	wallbox: "mdi:ev-station",
	car: "mdi:car-electric"
}, ka = class extends q {
	constructor(...e) {
		super(...e), this.busy = "";
	}
	static {
		this.styles = [
			k,
			K,
			w`
      :host {
        display: block;
      }
      .wrap {
        max-width: 1100px;
        margin: 0 auto;
      }
      .intro {
        display: grid;
        grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.7fr);
        gap: 24px;
        align-items: center;
      }
      .intro joe-pose {
        max-width: 300px;
        width: 100%;
        justify-self: end;
      }
      .display {
        font-size: clamp(30px, 4vw, 44px);
      }
      .lead-row {
        display: flex;
        align-items: flex-start;
        gap: 8px;
      }
      .lead-row .lead {
        flex: 1;
        min-width: 0;
      }
      .toolbar {
        margin-top: 14px;
      }
      .found {
        margin-top: 14px;
        padding: 16px 18px;
      }
      .found-head {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .found-head .eyebrow {
        flex: 1;
        min-width: 0;
      }
      .found-lead {
        margin: 8px 0 0;
        color: var(--joe-ink-2);
      }
      .found ul {
        list-style: none;
        margin: 10px 0 0;
        padding: 0;
        display: grid;
        gap: 4px;
      }
      .found li {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px 12px;
        padding: 8px 0;
        border-top: 1px solid var(--joe-line);
      }
      .found li:first-child {
        border-top: 0;
      }
      .found .what {
        flex: 1 1 180px;
        min-width: 0;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .found .what span {
        display: grid;
        min-width: 0;
      }
      .found b {
        font-weight: 600;
        overflow-wrap: anywhere;
      }
      .found small {
        color: var(--joe-muted);
        font-size: 13px;
      }
      .found .row-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .unassigned-text {
        margin: 0 0 10px;
        color: var(--joe-ink-2);
      }
      @media (max-width: 760px) {
        .intro {
          grid-template-columns: 1fr;
          gap: 8px;
        }
        .intro joe-pose {
          order: -1;
          justify-self: start;
          max-width: 200px;
        }
      }
    `
		];
	}
	render() {
		let e = this.t, t = this.state;
		if (!e || !t) return j;
		let n = this.devices, r = ft(n), i = n.filter((e) => e.unassigned);
		return D`<div class="wrap">
      <div class="intro">
        <div>
          ${y(e("devices.page.title"))} ${M}
          <div class="lead-row" data-tipped>
            <p class="lead">${e("devices.lead")}</p>
            ${l(e, "ha_open")}
          </div>
        </div>
        <joe-pose name="switch"></joe-pose>
      </div>
      <joe-control-status .t=${e} .hass=${this.hass} .state=${t}></joe-control-status>
      <div class="actions toolbar" data-tipped>${la(e, this.prefix)} ${l(e, "devices_add")}</div>
      ${this.renderFound(e)}
      ${Qe.filter((e) => r.includes(e)).map((t) => this.renderGroup(e, t, n))}
      ${i.length ? D`<div class="group-head">
              <span class="group-label">${e("devices.unassigned")}</span><i class="dcard-dot" aria-hidden="true"></i>
            </div>
            <p class="unassigned-text">${e("devices.unassigned.text")}</p>
            <div class="dcards">
              ${i.map((n) => ti(e, this.prefix, ai(e, this.hass, t, n)))}
            </div>` : j}
    </div>`;
	}
	renderGroup(e, t, n) {
		let r = n.filter((e) => e.group === t && !e.unassigned);
		if (!r.length) return j;
		let i = {
			tab: "devices",
			section: t
		};
		return D`<div class="group-head">
        <ha-icon icon=${$e[t]}></ha-icon>
        <span class="group-label">${e(`nav.devices.${t}`)}</span>
        ${mt(n.filter((e) => !e.unassigned), t) ? D`<i class="dcard-dot" aria-hidden="true"></i>` : j}
        <a class="mini-btn quiet group-go" href=${E(this.prefix, i)} @click=${C(i)}>${e("devices.group.go")}</a>
      </div>
      <div class="dcards">
        ${r.map((t) => ti(e, this.prefix, ai(e, this.hass, this.state, t)))}
      </div>`;
	}
	renderFound(e) {
		let t = gt(this.state.config, this.discovery);
		return t.length ? D`<section class="card found" data-tipped>
      <div class="found-head">
        <div class="eyebrow"><ha-icon icon="mdi:new-box"></ha-icon>${e("devices.found")}</div>
        ${l(e, "devices_found")}
      </div>
      <p class="found-lead">${e("devices.found.lead")}</p>
      <ul>
        ${t.map((t) => D`<li>
            <span class="what">
              <ha-icon icon=${Oa[t.kind]}></ha-icon>
              <span><b>${t.name}</b><small>${e(`devices.found.${t.kind}`)}</small></span>
            </span>
            <span class="row-actions">
              <button
                type="button"
                class="mini-btn go"
                ?disabled=${this.busy === t.key}
                @click=${() => this.use(t)}
              >
                ${e("devices.found.use")}
              </button>
              <button
                type="button"
                class="mini-btn quiet"
                ?disabled=${this.busy === t.key}
                @click=${() => this.ignore(t)}
              >
                ${e("devices.found.ignore")}
              </button>
            </span>
          </li>`)}
      </ul>
    </section>` : j;
	}
	async use(e) {
		if (e.kind !== "battery" || !e.battery) {
			x(this, it(e.kind === "wallbox" ? "wallbox" : "car", e.key), { sheet: !0 });
			return;
		}
		this.busy = e.key;
		let t = await Zr(this, this.state.config, e.battery);
		this.busy = "", t && x(this, {
			tab: "devices",
			section: "battery",
			id: t
		});
	}
	async ignore(e) {
		this.busy = e.key, await $r(this, this.state.config, e.key), this.busy = "";
	}
};
d([T()], ka.prototype, "busy", void 0), u("joe-devices-all", ka);
//#endregion
//#region src/components/battery-automations.ts
async function Aa(e) {
	try {
		return await e?.callWS({ type: "energy_joe/automations" }) ?? [];
	} catch {
		return [];
	}
}
function ja(e, t) {
	return e.filter((e) => e.writes.some((e) => e.battery_id === t));
}
var Ma = "/config/automation/dashboard", Na = class extends O {
	constructor(...e) {
		super(...e), this.batteries = "", this.mode = "", this.ready = {}, this.batteryId = "", this.bare = !1, this.items = null, this.loaded = [];
	}
	static {
		this.styles = [k, w`
      :host {
        display: block;
        margin-top: 12px;
      }
      :host([bare]) {
        margin-top: 0;
      }
      .card {
        padding: 18px 20px;
      }
      .head {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .head .eyebrow {
        flex: 1;
        min-width: 0;
      }
      .now {
        margin: 8px 0 0;
        font-weight: 600;
      }
      ul {
        list-style: none;
        margin: 10px 0 0;
        padding: 0;
        display: grid;
        gap: 6px;
      }
      li {
        display: grid;
        gap: 2px;
        padding: 8px 12px;
        border-radius: 10px;
        background: var(--joe-surface-2);
      }
      .row {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .row b {
        flex: 1 1 200px;
        min-width: 0;
        font-weight: 600;
        overflow-wrap: anywhere;
      }
      small {
        color: var(--joe-muted);
        font-size: 12.5px;
      }
      .actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-top: 12px;
      }
    `];
	}
	willUpdate(e) {
		e.has("batteries") && this.hass && this.items === null && this.load();
	}
	async load() {
		this.loaded = await Aa(this.hass);
	}
	get shown() {
		let e = this.items ?? this.loaded;
		return this.batteryId ? ja(e, this.batteryId) : e;
	}
	on(e) {
		let t = this.hass?.states[e.entity_id];
		return t ? t.state === "on" : e.on;
	}
	openHa(e) {
		e.preventDefault(), history.pushState(null, "", Ma), window.dispatchEvent(new CustomEvent("location-changed"));
	}
	render() {
		let e = this.t, t = this.shown;
		if (!e || !t.length) return j;
		let n = t.filter((e) => this.on(e)), r = (this.mode === "advisory" || this.mode === "live") && n.some((e) => e.writes.some((e) => (!this.batteryId || e.battery_id === this.batteryId) && this.ready[e.battery_id] === "ready")), i = D`<p class="now">
        ${e(n.length ? r ? "automations.lead" : "automations.lead_idle" : "automations.lead_off")}
      </p>
      <ul>
        ${t.map((t) => {
			let n = this.on(t), r = [...new Set(t.writes.map((e) => e.battery))].join(", ");
			return D`<li>
            <div class="row">
              <b>${t.name}</b>
              ${t.writes.some((e) => e.joe) ? D`<span class="chip">${e("automations.levers")}</span>` : j}
              <span class="chip ${n ? "warn" : "ok"}">${e(n ? "automations.on" : "automations.off")}</span>
            </div>
            ${t.writes.length ? D`<small>${e("automations.writes", {
				what: t.writes.map((e) => e.name).join(", "),
				batteries: r
			})}</small>` : D`<small>${e("automations.not_battery")}</small>`}
          </li>`;
		})}
      </ul>
      <div class="actions">
        <a class="mini-btn ${n.length && r ? "go" : ""}" href=${Ma} @click=${(e) => this.openHa(e)}>
          <ha-icon icon="mdi:open-in-app"></ha-icon>${e("automations.open_ha")}
        </a>
      </div>`;
		return this.bare ? i : D`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:robot-outline"></ha-icon>${e("automations.title")}</div>
        ${l(e, "battery_automations")}
      </div>
      ${i}
    </section>`;
	}
};
d([b({ attribute: !1 })], Na.prototype, "hass", void 0), d([b({ attribute: !1 })], Na.prototype, "t", void 0), d([b()], Na.prototype, "batteries", void 0), d([b()], Na.prototype, "mode", void 0), d([b({ attribute: !1 })], Na.prototype, "ready", void 0), d([b()], Na.prototype, "batteryId", void 0), d([b({ type: Boolean })], Na.prototype, "bare", void 0), d([b({ attribute: !1 })], Na.prototype, "items", void 0), d([T()], Na.prototype, "loaded", void 0), u("joe-battery-automations", Na);
//#endregion
//#region src/components/mirror.ts
function Pa(e, t, n) {
	return D`<div class="mirror">
    <div class="mirror-text">
      <span class="mirror-label">${n.label}</span>
      <span class="mirror-sep" aria-hidden="true">·</span>
      <span class="mirror-value">${n.value}</span>
      ${n.source ? S(e, n.source) : j}
      ${n.hint ? D`<small class="mirror-hint">${n.hint}</small>` : j}
    </div>
    <a class="mini-btn go mirror-go" href=${E(t, n.to)} @click=${C(n.to)}
      >${e(n.action === "set" ? "mirror.set" : "mirror.change")}</a
    >
  </div>`;
}
//#endregion
//#region src/components/choice.ts
var Fa = "unknown", Ia = class extends O {
	constructor(...e) {
		super(...e), this.options = [], this.value = [], this.multiple = !1, this.exclusive = [], this.idk = "", this.label = "", this.compact = !1;
	}
	static {
		this.styles = w`
    :host {
      display: block;
    }
    .opts {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }
    :host([compact]) .opts {
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    }
    button {
      display: flex;
      align-items: center;
      gap: 10px;
      min-height: 48px;
      padding: 10px 12px;
      border: 0;
      border-radius: 10px;
      cursor: pointer;
      text-align: left;
      font: inherit;
      font-weight: 600;
      color: var(--joe-ink);
      background: var(--joe-surface-2);
      transition: background 0.12s, box-shadow 0.12s, transform 0.12s;
    }
    :host([compact]) button {
      min-height: 40px;
      padding: 8px 12px;
    }
    @media (pointer: coarse) {
      :host([compact]) button {
        min-height: 44px;
      }
    }
    button:hover:not([disabled]) {
      background: var(--joe-line);
    }
    button:active:not([disabled]) {
      transform: scale(0.98);
    }
    button[aria-pressed="true"],
    button[aria-pressed="true"]:hover {
      background: var(--joe-amber-soft);
      box-shadow: inset 0 0 0 2px var(--joe-amber);
    }
    button[disabled] {
      cursor: not-allowed;
      opacity: 0.5;
    }
    button:focus-visible {
      outline: 3px solid var(--joe-amber);
      outline-offset: 2px;
    }
    .idk {
      grid-column: 1 / -1;
      justify-content: center;
      background: transparent;
      box-shadow: inset 0 0 0 1.5px var(--joe-line-2);
      color: var(--joe-ink-2);
    }
    .idk:hover:not([disabled]) {
      background: var(--joe-surface-2);
    }
    ha-icon {
      --mdc-icon-size: 22px;
      flex: none;
      color: var(--joe-ink-2);
    }
    button[aria-pressed="true"] ha-icon {
      color: var(--joe-amber-text);
    }
    .tick {
      margin-left: auto;
      width: 20px;
      height: 20px;
      flex: none;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: var(--joe-amber);
      color: var(--joe-amber-ink);
    }
    .tick svg {
      width: 14px;
      height: 14px;
    }
    @media (max-width: 480px) {
      .opts {
        grid-template-columns: 1fr;
      }
    }
    @media (pointer: coarse) {
      button {
        min-height: 48px;
      }
    }
  `;
	}
	render() {
		return D`<div class="opts" role="group" aria-label=${this.label}>
      ${this.options.map((e) => this.renderOption(e))}
      ${this.idk ? this.renderOption({
			value: Fa,
			label: this.idk
		}, "idk") : j}
    </div>`;
	}
	renderOption(e, t = "") {
		let n = this.value.includes(e.value);
		return D`<button
      type="button"
      class=${t}
      aria-pressed=${String(n)}
      ?disabled=${e.disabled}
      @click=${() => this.toggle(e.value)}
    >
      ${e.icon ? D`<ha-icon icon=${e.icon}></ha-icon>` : j}
      <span>${e.label}</span>
      ${n && this.multiple ? D`<span class="tick" aria-hidden="true"
            ><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12.5l4.5 4.5L19 7.5" /></svg
          ></span>` : j}
    </button>`;
	}
	toggle(e) {
		let t, n = e === "unknown" || this.exclusive.includes(e);
		t = !this.multiple || n ? this.multiple && this.value.includes(e) ? [] : [e] : this.value.includes(e) ? this.value.filter((t) => t !== e) : [...this.value.filter((e) => e !== "unknown" && !this.exclusive.includes(e)), e], this.value = t, this.dispatchEvent(new CustomEvent("joe-choice", {
			detail: { value: t },
			bubbles: !0,
			composed: !0
		}));
	}
};
d([b({ attribute: !1 })], Ia.prototype, "options", void 0), d([b({ attribute: !1 })], Ia.prototype, "value", void 0), d([b({ type: Boolean })], Ia.prototype, "multiple", void 0), d([b({ attribute: !1 })], Ia.prototype, "exclusive", void 0), d([b()], Ia.prototype, "idk", void 0), d([b()], Ia.prototype, "label", void 0), d([b({
	type: Boolean,
	reflect: !0
})], Ia.prototype, "compact", void 0), u("joe-choice", Ia);
//#endregion
//#region src/rules-view.ts
var La = {
	reserve_soc: {
		key: "reserve_soc",
		unit: "%",
		min: 0,
		max: 100,
		step: 1
	},
	max_target_soc: {
		key: "max_target_soc",
		unit: "%",
		min: 0,
		max: 100,
		step: 1
	},
	evening_min_soc: {
		key: "evening_min_soc",
		unit: "%",
		min: 0,
		max: 100,
		step: 1,
		optional: !0
	},
	grid_limit_w: {
		key: "grid_limit_w",
		unit: "kW",
		min: .1,
		max: 1e3,
		step: .1,
		scale: .001,
		optional: !0
	},
	max_night_kwh: {
		key: "max_night_kwh",
		unit: "kWh",
		min: .1,
		max: 1e3,
		step: .1,
		optional: !0
	},
	buffer_factor: {
		key: "buffer_factor",
		unit: "%",
		min: 0,
		max: 300,
		step: 1,
		scale: 100
	},
	plan_offset_min: {
		key: "plan_offset_min",
		unit: "min",
		min: 0,
		max: 180,
		step: 1,
		integer: !0
	},
	reset_lead_min: {
		key: "reset_lead_min",
		unit: "min",
		min: 0,
		max: 60,
		step: 1,
		integer: !0
	},
	max_price: {
		key: "max_price",
		unit: "ct/kWh",
		min: 0,
		max: 1e3,
		step: .1,
		scale: 100,
		optional: !0
	},
	min_saving: {
		key: "min_saving",
		unit: "ct",
		min: 0,
		max: 500,
		step: 1,
		scale: 100
	},
	balance_days: {
		key: "balance_days",
		unit: "",
		min: 3,
		max: 90,
		step: 1,
		optional: !0,
		integer: !0
	}
}, Ra = {
	battery: [
		"reserve_soc",
		"max_target_soc",
		"evening_min_soc",
		"balance_days",
		"discharge_in_window",
		"converter_losses",
		"day_surplus",
		"morning_buffer",
		"transfer_guard"
	],
	grid: [
		"grid_limit_w",
		"max_night_kwh",
		"guard_grid",
		"max_price",
		"min_saving"
	],
	plan: [
		"priority",
		"buffer_factor",
		"plan_offset_min",
		"reset_lead_min"
	]
};
[
	...Ra.battery,
	...Ra.grid,
	...Ra.plan
];
var za = [
	"until_target",
	"block",
	"free"
], Ba = [
	"tight",
	"normal",
	"careful"
];
function Va(e) {
	return e in La;
}
function Ha(e, t) {
	return t.unit || e(`rule.${t.key}.unit`);
}
function Ua(e, t) {
	return t == null ? "" : String(Math.round(t * (e.scale ?? 1) * 100) / 100);
}
function Wa(e, t, n) {
	let r = t.rules;
	if (Va(n)) {
		let t = La[n], i = r[n];
		if (i == null) return e("rule.off");
		let a = Math.round(i * (t.scale ?? 1) * 100) / 100, o = Number.isInteger(a) ? 0 : Number.isInteger(a * 10) ? 1 : 2;
		return `${v(e.lang, a, o)} ${Ha(e, t)}`;
	}
	switch (n) {
		case "priority": return r.priority.map((t) => e(`rule.priority.${t}`)).join(" · ");
		case "discharge_in_window": return e(`rule.discharge.${r.discharge_in_window}`);
		case "day_surplus": return r.day_surplus ? `${e("rule.on")} · ${e(`rule.day_caution.${r.day_caution}`)}` : e("rule.off");
		case "transfer_guard": return e(r.transfer_guard === !1 ? "rule.off" : "rule.on");
		case "morning_buffer": return r.morning_buffer_soc == null ? e("rule.morning_buffer.auto") : `${v(e.lang, r.morning_buffer_soc, 0)} %`;
		default: return e(r[n] ? "rule.on" : "rule.off");
	}
}
function Ga(e, t, n, r, i, a, o) {
	if (Va(i)) {
		let o = i === "grid_limit_w" ? Ya(e, t, n, a) : j;
		return Xa(e, t, n, r, La[i], o);
	}
	switch (i) {
		case "guard_grid": return Qa(e, t, n);
		case "converter_losses": return $a(e, t, n);
		case "priority": return to(e, t, n);
		case "discharge_in_window": return no(e, t, n);
		case "day_surplus": return ro(e, t, n);
		case "transfer_guard": return eo(e, t, n);
		case "morning_buffer": return Ja(e, t, n, o);
	}
}
function Ka(e) {
	return e?.morning_buffer ?? e?.morning?.day?.buffer ?? null;
}
var qa = 90;
function Ja(e, t, n, r) {
	let i = n.rules, a = Ka(r), o = i.morning_buffer_soc != null, s = a?.suggested, c = i.grid_friendly, u = {
		soc: v(e.lang, o ? i.morning_buffer_soc ?? 0 : s ?? 0, 0),
		kwh: v(e.lang, a?.need_kwh ?? 0, 1)
	}, d = c ? o ? e("rule.morning_buffer.own_hint", u) : s == null ? e("rule.morning_buffer.pending_hint") : a?.source === "learned" ? e("rule.morning_buffer.learned_hint", u) : e("rule.morning_buffer.start_hint", u) : e("rule.morning_buffer.off_hint"), f = (e) => {
		let n = Number.parseFloat(e.value.trim());
		if (!Number.isFinite(n) || n < 0 || n > qa) {
			e.reportValidity();
			return;
		}
		I(t, { rules: { morning_buffer_soc: Math.round(n) } });
	};
	return D`<div class="row stacked" data-tipped data-anchor="morning_buffer">
    <div>
      <div class="name">
        <b id="morning-buffer">${e("rule.morning_buffer")}</b>${l(e, "r_morning_buffer")}
        ${S(e, P(n, "rules.morning_buffer_soc"))}
      </div>
      <small>${d}</small>
    </div>
    <div class="buffer-control">
      <div class="seg" role="group" aria-labelledby="morning-buffer">
        <button
          type="button"
          aria-pressed=${String(!o)}
          ?disabled=${!c}
          @click=${() => I(t, { rules: { morning_buffer_soc: null } }, "default")}
        >
          ${s == null ? e("rule.morning_buffer.auto") : e("rule.morning_buffer.auto_n", { soc: v(e.lang, s, 0) })}
        </button>
        <button
          type="button"
          aria-pressed=${String(o)}
          ?disabled=${!c}
          @click=${() => o ? void 0 : I(t, { rules: { morning_buffer_soc: s ?? Math.max(30, i.reserve_soc) } })}
        >
          ${e("rule.morning_buffer.own")}
        </button>
      </div>
      ${l(e, o ? "r_morning_buffer_own" : "r_morning_buffer_auto")}
      ${o ? D`<span class="unit-input">
            <input
              class="input"
              type="number"
              inputmode="numeric"
              min="0"
              max=${qa}
              step="1"
              aria-label=${e("rule.morning_buffer.own_label")}
              ?disabled=${!c}
              .value=${String(i.morning_buffer_soc ?? "")}
              @change=${(e) => f(e.target)}
            />
            <span class="unit">%</span>
          </span>` : j}
    </div>
  </div>`;
}
function Ya(e, t, n, r) {
	let i = r?.grid_peak;
	if (!i?.w) return j;
	let a = Math.ceil(i.w / 100) / 10, o = new Date(i.since), s = new Intl.DateTimeFormat(e.lang, {
		day: "numeric",
		month: "long"
	}).format(o), c = Date.now() - o.getTime() >= 6048e5, u = n.rules.grid_limit_w != null;
	return D`<div class="peak">
    <small>${e(u ? "rule.grid_limit_w.measured_own" : c ? "rule.grid_limit_w.measured" : "rule.grid_limit_w.measuring", {
		kw: v(e.lang, a, 1),
		date: s
	})}</small>${l(e, "r_grid_peak")}
    ${u ? j : D`<button
          type="button"
          class="mini-btn quiet"
          @click=${() => I(t, { rules: { grid_limit_w: Math.round(a * 1e3) } })}
        >
          ${e("rule.grid_limit_w.take", { kw: v(e.lang, a, 1) })}
        </button>`}
  </div>`;
}
function Xa(e, t, n, r, i, a = j) {
	let o = r?.defaults?.rules[i.key], s = P(n, `rules.${i.key}`), c = s?.source === "user";
	return D`<div class="row" data-tipped data-anchor=${i.key}>
    <div>
      <div class="name"><b>${e(`rule.${i.key}`)}</b>${l(e, `r_${i.key}`)}</div>
      <small>${e(`rule.${i.key}.hint`)}</small>
      ${a}
    </div>
    <div class="control">
      ${S(e, s)}
      <span class="unit-input">
        <input
          class="input"
          type="number"
          inputmode="decimal"
          min=${i.min}
          max=${i.max}
          step=${i.step}
          aria-label=${e(`rule.${i.key}`)}
          placeholder=${i.optional ? e("rule.off") : ""}
          .value=${Ua(i, n.rules[i.key])}
          @change=${(e) => Za(t, i, e.target)}
        />
        <span class="unit">${Ha(e, i)}</span>
      </span>
      ${c && o !== void 0 ? D`<button
            type="button"
            class="mini-btn quiet"
            @click=${() => I(t, { rules: { [i.key]: o } }, "default")}
          >
            <ha-icon icon="mdi:restore"></ha-icon>${e("rule.reset")}
          </button>` : j}
    </div>
  </div>`;
}
function Za(e, t, n) {
	let r = n.value.trim(), i = t.scale ?? 1;
	if (r === "") {
		t.optional && I(e, { rules: { [t.key]: null } });
		return;
	}
	let a = Number.parseFloat(r);
	if (!Number.isFinite(a) || a < t.min || a > t.max) {
		n.reportValidity();
		return;
	}
	let o = t.integer ? Math.round(a) : Math.round(a / i * 1e4) / 1e4;
	I(e, { rules: { [t.key]: o } });
}
function Qa(e, t, n) {
	let r = n.rules, i = r.grid_limit_w;
	return D`<div class="row" data-tipped data-anchor="guard_grid">
    <div>
      <div class="name"><b id="guard-grid">${e("rule.guard_grid")}</b>${l(e, "r_guard_grid")}</div>
      <small>${e(i ? "rule.guard_grid.hint" : "rule.guard_grid.no_limit")}</small>
    </div>
    <div class="control">
      ${S(e, P(n, "rules.guard_grid"))}
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${String(r.guard_grid)}
        aria-labelledby="guard-grid"
        ?disabled=${!i}
        @click=${() => I(t, { rules: { guard_grid: !r.guard_grid } })}
      ></button>
    </div>
  </div>`;
}
function $a(e, t, n) {
	let r = n.rules;
	return D`<div class="row" data-tipped data-anchor="converter_losses">
    <div>
      <div class="name"><b id="converter-losses">${e("rule.converter_losses")}</b>${l(e, "r_converter_losses")}</div>
      <small>${e("rule.converter_losses.hint")}</small>
    </div>
    <div class="control">
      ${S(e, P(n, "rules.converter_losses"))}
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${String(r.converter_losses)}
        aria-labelledby="converter-losses"
        @click=${() => I(t, { rules: { converter_losses: !r.converter_losses } })}
      ></button>
    </div>
  </div>`;
}
function eo(e, t, n) {
	let r = n.rules.transfer_guard !== !1;
	return D`<div class="row" data-tipped data-anchor="transfer_guard">
    <div>
      <div class="name"><b id="transfer-guard">${e("rule.transfer_guard")}</b>${l(e, "r_transfer_guard")}</div>
      <small>${e("rule.transfer_guard.hint")}</small>
    </div>
    <div class="control">
      ${S(e, P(n, "rules.transfer_guard"))}
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${String(r)}
        aria-labelledby="transfer-guard"
        @click=${() => I(t, { rules: { transfer_guard: !r } })}
      ></button>
    </div>
  </div>`;
}
function to(e, t, n) {
	let r = n.rules.priority, i = (e, n) => {
		let i = [...r];
		[i[e], i[e + n]] = [i[e + n], i[e]], I(t, { rules: { priority: i } });
	}, a = (e) => D`<svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.6"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d=${e ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"} />
    </svg>`;
	return D`<div class="row" data-tipped data-anchor="priority">
    <div>
      <div class="name"><b>${e("rule.priority")}</b>${l(e, "r_priority")}</div>
      <small>${e("rule.priority.hint")}</small>
    </div>
    <div class="control">
      ${S(e, P(n, "rules.priority"))}
      <div class="order">
        ${r.map((t, n) => D`<div>
            <span>${n + 1}. ${e(`rule.priority.${t}`)}</span>
            <button
              type="button"
              aria-label=${e("rule.priority.up", { name: e(`rule.priority.${t}`) })}
              ?disabled=${n === 0}
              @click=${() => i(n, -1)}
            >
              ${a(!0)}
            </button>
            <button
              type="button"
              aria-label=${e("rule.priority.down", { name: e(`rule.priority.${t}`) })}
              ?disabled=${n === r.length - 1}
              @click=${() => i(n, 1)}
            >
              ${a(!1)}
            </button>
          </div>`)}
      </div>
    </div>
  </div>`;
}
function no(e, t, n) {
	let r = n.rules;
	return D`<div class="row stacked" data-tipped data-anchor="discharge_in_window">
    <div>
      <div class="name">
        <b>${e("rule.discharge_in_window")}</b>${l(e, "r_discharge_in_window")}
        ${S(e, P(n, "rules.discharge_in_window"))}
      </div>
      <small>${e("rule.discharge_in_window.hint")}</small>
    </div>
    <div>
      <joe-choice
        compact
        label=${e("rule.discharge_in_window")}
        .options=${za.map((t) => ({
		value: t,
		label: e(`rule.discharge.${t}`)
	}))}
        .value=${[r.discharge_in_window]}
        @joe-choice=${(e) => {
		e.detail.value[0] && I(t, { rules: { discharge_in_window: e.detail.value[0] } });
	}}
      ></joe-choice>
    </div>
  </div>`;
}
function ro(e, t, n) {
	let r = n.rules;
	return D`<div class="row" data-tipped data-anchor="day_surplus">
      <div>
        <div class="name"><b id="day-surplus">${e("rule.day_surplus")}</b>${l(e, "r_day_surplus")}</div>
        <small>${e("rule.day_surplus.hint")}</small>
      </div>
      <div class="control">
        ${S(e, P(n, "rules.day_surplus"))}
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(r.day_surplus)}
          aria-labelledby="day-surplus"
          @click=${() => I(t, { rules: { day_surplus: !r.day_surplus } })}
        ></button>
      </div>
    </div>
    ${r.day_surplus ? D`<div class="row stacked" data-tipped data-anchor="day_caution">
          <div>
            <div class="name">
              <b>${e("rule.day_caution")}</b>${l(e, "r_day_caution")} ${S(e, P(n, "rules.day_caution"))}
            </div>
            <small>${e(`rule.day_caution.${r.day_caution}.hint`)}</small>
          </div>
          <div>
            <joe-choice
              compact
              label=${e("rule.day_caution")}
              .options=${Ba.map((t) => ({
		value: t,
		label: e(`rule.day_caution.${t}`)
	}))}
              .value=${[r.day_caution]}
              @joe-choice=${(e) => {
		e.detail.value[0] && I(t, { rules: { day_caution: e.detail.value[0] } });
	}}
            ></joe-choice>
          </div>
        </div>` : j}`;
}
var io = w`
  .unit-input {
    width: 150px;
  }
  .peak {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 8px;
    margin-top: 6px;
  }
  .order {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 220px;
  }
  .order div {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 4px 4px 12px;
    border-radius: 9px;
    background: var(--joe-surface-2);
    font-weight: 600;
  }
  .order span {
    flex: 1;
  }
  .order button {
    width: 34px;
    height: 34px;
    border: 0;
    border-radius: 8px;
    cursor: pointer;
    background: transparent;
    color: var(--joe-ink-2);
    display: grid;
    place-items: center;
  }
  .order button:hover:not([disabled]) {
    background: var(--joe-surface);
    color: var(--joe-ink);
  }
  .order button[disabled] {
    opacity: 0.3;
    cursor: default;
  }
  .order svg {
    width: 18px;
    height: 18px;
  }
  @media (pointer: coarse) {
    .order button {
      width: 44px;
      height: 44px;
    }
  }
  .buffer-control {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 10px;
  }
  .row.stacked {
    display: grid;
    justify-content: stretch;
    align-items: stretch;
    gap: 10px;
  }
`;
//#endregion
//#region src/learned-view.ts
function ao(e) {
	return D`<div class="rows">
    ${e.map((e) => D`<div class="row-item">
        <b>${e.name}</b>
        <span class="values">${e.values.map((e) => D`<span>${e}</span>`)}</span>
        ${e.note ? D`<small>${e.note}</small>` : j}
        ${e.extra ? D`<span class="row-extra">${e.extra}</span>` : j}
      </div>`)}
  </div>`;
}
var oo = w`
  .rows {
    display: grid;
    margin-top: 10px;
  }
  .row-item {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 2px 12px;
    padding: 9px 0;
    border-top: 1px solid var(--joe-line);
  }
  .row-item:first-child {
    border-top: 0;
  }
  .row-item b {
    overflow-wrap: anywhere;
  }
  .row-item .values {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 4px 12px;
    margin-left: auto;
    font-variant-numeric: tabular-nums;
    color: var(--joe-ink-2);
  }
  .row-item small {
    flex-basis: 100%;
    color: var(--joe-muted);
    font-size: 12.5px;
    line-height: 1.4;
  }
  .row-item .row-extra {
    flex-basis: 100%;
  }
`;
function so(e, t, n, r, i) {
	let a = e.lang, o = n.battery_models?.[r.id], s = r.capacity_kwh, c = t.provenance[`batteries[${r.id}].capacity_kwh`]?.source === "user", l;
	return l = o ? c && s ? e("learn.battery.user", { value: H(a, s, 1) }) : s && (o.capacity_kwh / s < .5 || o.capacity_kwh / s > 1.15) ? e("learn.battery.odd", { value: H(a, s, 1) }) : s ? e("learn.battery.uses_nominal", { value: H(a, s, 1) }) : e("learn.battery.uses") : r.power ? e("learn.battery.learning", { need: i }) : e("learn.battery.no_power"), {
		name: r.name,
		values: o ? [
			e("learn.battery.capacity", { value: H(a, o.capacity_kwh, 1) }),
			e("learn.battery.efficiency", { value: v(a, o.efficiency * 100, 0) }),
			...o.converter ? [e("learn.battery.converter", { value: v(a, o.converter.factor * 100, 0) })] : []
		] : [e("learn.still")],
		note: l
	};
}
function co(e, t, n) {
	let r = t.group_models?.[n.id];
	return {
		name: n.name,
		values: r ? [e("learn.groups.average", { value: H(e.lang, r.average, 1) }), r.heat >= .05 ? e("learn.groups.heat", { value: H(e.lang, r.heat, 2) }) : e("learn.groups.steady")] : [e("learn.still")]
	};
}
function lo(e, t, n) {
	let r = t.action_models?.[n.id];
	return {
		name: n.name,
		values: r ? [
			e("learn.hot_water.rate", { value: H(e.lang, r.rate_k_per_h, 1) }),
			e("learn.hot_water.loss", { value: H(e.lang, r.loss_k_per_h, 1) }),
			e("learn.hot_water.demand", { value: H(e.lang, r.demand_k, 0) })
		] : [e("learn.still")],
		note: r ? void 0 : e("learn.hot_water.learning")
	};
}
function uo(e, t, n) {
	let r = e.lang, i = t.car_models?.[n.id], a = !!(n.need.odometer_entity || n.sources.some((e) => e.entities.odometer)), o = [];
	return i?.consumption != null && (o.push(e("learn.car.consumption", { value: H(r, i.consumption, 1) })), i.cold && o.push(e("learn.car.cold", { value: H(r, i.cold, 2) }))), (i?.workday_km != null || i?.day_off_km != null) && o.push(e("learn.car.km", {
		workday: i.workday_km == null ? "–" : H(r, i.workday_km, 0),
		day_off: i.day_off_km == null ? "–" : H(r, i.day_off_km, 0)
	})), {
		name: n.name,
		values: o.length ? o : [e("learn.still")],
		note: o.length ? void 0 : e(a ? "learn.car.learning" : "learn.car.no_odometer")
	};
}
function fo(e) {
	return `${String(Math.floor(e / 60)).padStart(2, "0")}:${String(Math.round(e) % 60).padStart(2, "0")}`;
}
function po(e, t, n, r) {
	let i = t.presence?.[n.id] ?? {}, a = Vn.filter((e) => i[e]).map((t) => e("learn.presence.value", {
		label: e(`label.${t}`),
		hours: H(e.lang, i[t].hours, 0)
	}));
	r != null && a.push(e("past.learned.presence.usual", { time: fo(r) }));
	let o;
	return n.person_entity ? n.calendars.length || (o = e("past.learned.presence.no_calendar")) : o = e("learn.presence.no_person"), {
		name: n.name,
		values: a.length ? a : [e("learn.still")],
		note: o
	};
}
function mo(e, t) {
	return t ? e("climate.rate", { rate: v(e.lang, t, 1) }) : e("climate.rate_default");
}
function ho(e) {
	let t = e?.config, n = e?.results;
	return [
		n?.days ?? 0,
		n?.since ?? "",
		t?.learned?.updated ?? "",
		t?.learned?.since ?? "",
		t?.rules.buffer_factor ?? "",
		t?.provenance["rules.buffer_factor"]?.source ?? "",
		e?.observe?.day_count ?? 0
	].join("|");
}
function go(e, t) {
	let n = Math.max(1, Math.ceil(t.length / 7)), r = /* @__PURE__ */ new Map();
	return t.forEach((i, a) => {
		(t.length - 1 - a) % n == 0 && r.set(a, U(e, i, "short"));
	}), r;
}
//#endregion
//#region src/components/day-questions.ts
var _o = {
	more: [
		"guests",
		"special",
		"normal"
	],
	less: [
		"away",
		"special",
		"normal"
	]
}, vo = class extends O {
	constructor(...e) {
		super(...e), this.questions = [], this.bare = !1, this.failed = !1, this.answered = /* @__PURE__ */ new Set();
	}
	static {
		this.styles = [k, w`
      :host {
        display: block;
      }
      .card {
        padding: 18px 20px;
      }
      :host([bare]) .card {
        padding: 0;
        background: transparent;
        box-shadow: none;
      }
      .head {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .head .eyebrow {
        flex: 1;
      }
      .lead {
        margin: 8px 0 0;
        color: var(--joe-ink-2);
        font-size: 14.5px;
        max-width: 62ch;
      }
      .question {
        margin-top: 14px;
        padding-top: 14px;
        border-top: 1px solid var(--joe-line);
      }
      .question p {
        margin: 0;
        font-size: 15px;
        line-height: 1.45;
      }
      .answers {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 10px;
      }
      .note {
        margin-top: 12px;
      }
    `];
	}
	render() {
		let e = this.t, t = this.questions.filter((e) => !this.answered.has(e.date));
		return !e || !t.length ? j : D`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:chat-question-outline"></ha-icon>${e("ask.title")}</div>
        ${l(e, "ask_day")}
      </div>
      <p class="lead">${e("ask.lead")}</p>
      ${t.map((t) => D`<div class="question">
          <p>
            ${e(`ask.${t.kind}`, {
			day: U(e.lang, t.date, "weekday"),
			actual: H(e.lang, t.actual, 1),
			expected: H(e.lang, t.expected, 1)
		})}
          </p>
          <div class="answers" role="group" aria-label=${e("ask.answers")}>
            ${_o[t.kind].map((n) => D`<button
                  type="button"
                  class="mini-btn ${n === "normal" ? "quiet" : ""}"
                  ?disabled=${this.busy === t.date}
                  @click=${() => this.answer(t.date, n)}
                >
                  ${e(`ask.answer.${n}`)}
                </button>`)}
          </div>
        </div>`)}
      ${this.failed ? D`<div class="note warn" role="status"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("error.action")}</div>` : j}
    </section>`;
	}
	async answer(e, t) {
		this.busy = e;
		try {
			await this.hass?.callWS({
				type: "energy_joe/learning/answer",
				date: e,
				answer: t
			}), this.answered = /* @__PURE__ */ new Set([...this.answered, e]), this.failed = !1, this.dispatchEvent(new CustomEvent("joe-answered", {
				detail: {
					date: e,
					answer: t
				},
				bubbles: !0,
				composed: !0
			}));
		} catch {
			this.failed = !0;
		} finally {
			this.busy = void 0;
		}
	}
};
d([b({ attribute: !1 })], vo.prototype, "hass", void 0), d([b({ attribute: !1 })], vo.prototype, "t", void 0), d([b({ attribute: !1 })], vo.prototype, "questions", void 0), d([b({
	type: Boolean,
	reflect: !0
})], vo.prototype, "bare", void 0), d([T()], vo.prototype, "busy", void 0), d([T()], vo.prototype, "failed", void 0), d([T()], vo.prototype, "answered", void 0), u("joe-day-questions", vo);
//#endregion
//#region src/components/steer-tonight.ts
function yo(e) {
	let t = e?.plan;
	return !!(e?.control && ["advisory", "live"].includes(e.mode) && t?.window && t.kind !== "none" && t.kind !== "unavailable");
}
function bo(e) {
	let t = e?.plan?.window?.start, n = e?.control;
	return !!(yo(e) && e?.mode === "advisory" && t && n?.skip !== t && n?.answer?.night !== t);
}
function xo(e) {
	let t = e.control?.ready ?? {};
	return e.config.batteries.filter((e) => e.adapter !== "none" && t[e.id] && t[e.id] !== "ready");
}
var So = class extends O {
	constructor(...e) {
		super(...e), this.prefix = A, this.compact = !1, this.hideUntested = !1, this.busy = !1;
	}
	static {
		this.styles = [k, w`
      :host {
        display: block;
      }
      .steer {
        margin-top: 12px;
        padding: 14px 16px;
        border-radius: 14px;
        background: var(--joe-surface);
        box-shadow: inset 0 0 0 1px var(--joe-line);
      }
      :host([compact]) .steer {
        margin: 0;
        padding: 0;
        background: transparent;
        box-shadow: none;
      }
      .head {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 700;
        font-size: 16px;
      }
      :host([compact]) .head {
        font-size: 15px;
      }
      .note {
        margin-top: 10px;
      }
      .note a {
        color: inherit;
        font-weight: 700;
      }
      .actions {
        margin-top: 12px;
      }
      :host([compact]) .actions {
        margin-top: 10px;
      }
    `];
	}
	render() {
		let e = this.t, t = this.state, n = t?.control, r = t?.plan;
		if (!e || !t || !n || !r?.window || !yo(t)) return j;
		let i = r.window.start, a = n.skip === i, o = n.answer?.night === i ? n.answer.yes : null, s, c = j;
		if (t.mode === "advisory" && !a) {
			s = e(o === !0 ? "plan.steer.answered_yes" : o === !1 ? "plan.steer.answered_no" : "plan.steer.advisory");
			let t = o === !0 ? j : D`<button type="button" class="btn btn-primary" ?disabled=${this.busy} @click=${() => this.answer(i, !0)}>
              ${e("plan.steer.yes")}
            </button>`, n = o !== !1 && !this.compact ? D`<button type="button" class="btn btn-secondary" ?disabled=${this.busy} @click=${() => this.answer(i, !1)}>
              ${e("plan.steer.no")}
            </button>` : j;
			c = t === j && n === j ? j : D`${t} ${n}`;
		} else s = e(a ? "plan.steer.skipped" : "plan.steer.live"), c = D`<button type="button" class="btn btn-secondary" ?disabled=${this.busy} @click=${() => this.skip(!a)}>
        ${e(a ? "plan.steer.unskip" : "plan.steer.skip")}
      </button>`;
		return D`<section class="steer" data-tipped>
      <div class="head">${s} ${l(e, "plan_steer")}</div>
      ${this.hideUntested ? j : this.renderUntested(e, t)}
      ${c === j ? j : D`<div class="actions">${c}</div>`}
    </section>`;
	}
	renderUntested(e, t) {
		let n = xo(t);
		if (!n.length) return j;
		let [r, i = ""] = e("plan.steer.untested", { names: "\0" }).split("\0"), a = n.map((e, t) => D`${t ? ", " : ""}${Ee(this.prefix, {
			tab: "devices",
			section: "battery",
			id: e.id
		}, e.name)}`);
		return D`<div class="note warn">
      <ha-icon icon="mdi:alert-outline"></ha-icon><span>${r}${a}${i}</span>
    </div>`;
	}
	async answer(e, t) {
		this.busy = !0;
		try {
			await this.hass?.callWS({
				type: "energy_joe/control/answer",
				night: e,
				yes: t
			});
		} catch {} finally {
			this.busy = !1;
		}
	}
	async skip(e) {
		this.busy = !0;
		try {
			await this.hass?.callWS({
				type: "energy_joe/control/skip",
				skip: e
			});
		} catch {} finally {
			this.busy = !1;
		}
	}
};
d([b({ attribute: !1 })], So.prototype, "hass", void 0), d([b({ attribute: !1 })], So.prototype, "t", void 0), d([b({ attribute: !1 })], So.prototype, "state", void 0), d([b({ attribute: !1 })], So.prototype, "prefix", void 0), d([b({
	type: Boolean,
	reflect: !0
})], So.prototype, "compact", void 0), d([b({ type: Boolean })], So.prototype, "hideUntested", void 0), d([T()], So.prototype, "busy", void 0), u("joe-steer-tonight", So);
//#endregion
//#region src/components/action-page.ts
function Co(e, t, n, r, i, a, o) {
	let s = it(n, r);
	return D`<div class="setup-block" data-tipped>
    <p>${i} ${l(e, o)}</p>
    <a class="btn btn-primary" href=${E(t, s)} @click=${C(s, { sheet: !0 })}>${a}</a>
  </div>`;
}
function wo(e, t, n) {
	let r = t.startsWith("action-") ? t.slice(7) : t;
	return e.find((e) => e.group !== n && (e.consumer?.id === t || e.id === t || e.action?.id === r));
}
function To(e, t, n, r) {
	let i = r.setup ? {
		tab: "devices",
		section: r.group,
		id: r.id
	} : R(r);
	return D`<div class="moved" role="status">
    <ha-icon icon="mdi:arrow-right-bold-circle-outline"></ha-icon>
    <span class="moved-text"><b>${n}</b></span>
    <a class="mini-btn go moved-go" href=${E(t, i)} @click=${C(i)}
      >${e("devices.moved_to", { group: e(`nav.devices.${r.group}`) })}</a
    >
  </div>`;
}
function Eo(e, t) {
	return D`<h4 class="sub-head" data-anchor=${t ?? j}>${e}</h4>`;
}
var Do = w`
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
`, Oo = [
	"soc",
	"range",
	"odometer",
	"capacity",
	"consumption",
	"plugged",
	"outside_temp",
	"location"
];
function ko(e, t, n) {
	return e("car.merge.ask", {
		a: n.a_name,
		b: n.b_name,
		from: o(e, {
			kind: "car",
			platform: n.b_platform,
			name: n.b_name
		})
	});
}
function Ao(e) {
	return {
		yes: {
			type: "energy_joe/car/merge",
			into: e.a,
			other: e.b
		},
		no: {
			type: "energy_joe/car/separate",
			a: e.a,
			b: e.b
		}
	};
}
var jo = class extends O {
	constructor(...e) {
		super(...e), this.prefix = A, this.busy = !1, this.failed = !1, this.other = "", this.adding = !1, this.manual = !1;
	}
	chosenByHand(e) {
		let t = e.need;
		return [
			"soc_entity",
			"range_entity",
			"capacity_entity",
			"odometer_entity",
			"consumption_entity"
		].some((e) => t[e]) || !!e.tracker_entity;
	}
	static {
		this.styles = [k, w`
      :host {
        display: block;
      }
      ul.sources {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 8px;
      }
      ul.sources li {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr);
        align-items: start;
        gap: 4px 12px;
        padding: 10px 12px;
        border-radius: 12px;
        background: var(--joe-surface-2);
      }
      ul.sources li > ha-icon {
        margin-top: 2px;
        color: var(--joe-ink-2);
      }
      .what {
        display: grid;
        gap: 2px;
        min-width: 0;
      }
      .what b {
        font-weight: 700;
        overflow-wrap: anywhere;
      }
      .what small {
        color: var(--joe-ink-2);
        font-size: 13px;
        line-height: 1.4;
      }
      .row {
        grid-column: 2;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
      }
      .ask {
        display: grid;
        gap: 10px;
        margin: 12px 0 0;
        padding: 12px;
        border-radius: 12px;
        background: var(--joe-amber-soft);
      }
      .ask p {
        margin: 0;
        font-weight: 600;
      }
      .merge {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        margin-top: 12px;
      }
      .merge select {
        flex: 1 1 160px;
        min-width: 0;
      }
      .muted {
        margin: 0;
        color: var(--joe-muted);
      }
      .bad {
        margin: 8px 0 0;
        color: var(--joe-warn, var(--joe-crit));
      }
      .mini-btn {
        min-height: 44px;
      }
      .add {
        margin-top: 12px;
      }
      .close-row {
        display: flex;
        justify-content: flex-end;
        margin-top: 8px;
      }
      .add-box {
        margin-top: 12px;
        padding: 12px;
        border-radius: 12px;
        border: 1px solid var(--joe-line);
      }
      .by-hand {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    `];
	}
	willUpdate(e) {
		e.has("car") && e.get("car")?.id !== this.car?.id && (this.other = "", this.manual = !1, this.adding = !1);
	}
	render() {
		let { t: e, state: t, car: n } = this;
		if (!e || !t || !n) return j;
		let r = (t.config.cars ?? []).filter((e) => e.id !== n.id), i = (t.cars?.merge ?? []).filter((e) => e.a === n.id || e.b === n.id);
		return D`${n.sources.length ? D`<ul class="sources">
            ${n.sources.map((t) => this.renderSource(e, n, t))}
          </ul>` : D`<p class="muted">${e("car.sources.none")}</p>`}
      ${i.map((n) => D`<div class="ask" role="group" data-tipped>
          <p>${ko(e, t, n)} ${l(e, "car_merge")}</p>
          <div class="row">
            <button type="button" class="mini-btn go" ?disabled=${this.busy} @click=${() => this.send(Ao(n).yes, n.a)}>
              ${e("car.merge.yes")}
            </button>
            <button type="button" class="mini-btn quiet" ?disabled=${this.busy} @click=${() => this.send(Ao(n).no)}>
              ${e("car.merge.no")}
            </button>
          </div>
        </div>`)}
      ${r.length ? D`<div class="merge" data-tipped>
            <select class="input" aria-label=${e("car.merge.with")} @change=${(e) => this.other = e.target.value}>
              <option value="" ?selected=${!this.other}>${e("car.merge.with")}</option>
              ${r.map((e) => D`<option value=${e.id} ?selected=${this.other === e.id}>${e.name}</option>`)}
            </select>
            <button
              type="button"
              class="mini-btn"
              ?disabled=${this.busy || !this.other}
              @click=${() => this.send({
			type: "energy_joe/car/merge",
			into: n.id,
			other: this.other
		}, n.id)}
            >
              <ha-icon icon="mdi:call-merge"></ha-icon>${e("car.merge.do")}
            </button>
            ${l(e, "car_merge_with")}
          </div>` : j}
      ${this.adding ? D`<div class="add-box" @joe-attached=${() => this.adding = !1}>
            <joe-car-search .hass=${this.hass} .t=${e} .state=${t} .discovery=${this.discovery} .prefix=${this.prefix} .car=${n}></joe-car-search>
            <div class="close-row">
              <button type="button" class="mini-btn quiet" @click=${() => this.adding = !1}>${e("car.attach.close")}</button>
            </div>
          </div>` : D`<div class="add by-hand" data-tipped>
            <button type="button" class="mini-btn" aria-expanded="false" @click=${() => this.adding = !0}>
              <ha-icon icon="mdi:plus"></ha-icon>${e("car.attach.open")}
            </button>
            ${l(e, "car_attach_open")}
          </div>`}
      ${this.failed ? D`<p class="bad" role="status">${e("error.action")}</p>` : j}
      ${Eo(e("car.sources.manual"))}
      ${n.sources.length && !this.manual && !this.chosenByHand(n) ? D`<div class="by-hand" data-tipped>
            <button type="button" class="mini-btn quiet" aria-expanded="false" @click=${() => this.manual = !0}>
              <ha-icon icon="mdi:chevron-down"></ha-icon>${e("car.sources.manual.open")}
            </button>
            ${l(e, "car_manual")}
          </div>` : D`<p class="muted">${e("car.sources.manual.hint")}</p>
            <joe-car-steer
              .hass=${this.hass}
              .t=${e}
              .state=${t}
              .discovery=${this.discovery}
              .prefix=${this.prefix}
              .car=${n}
              .section=${"manual"}
            ></joe-car-steer>`}`;
	}
	renderSource(e, t, n) {
		let r = Oo.filter((e) => n.entities[e]).map((t) => e(`car.role.${t}`)), i = o(e, {
			kind: n.kind,
			platform: n.platform,
			name: n.name
		});
		return D`<li>
      <ha-icon icon=${n.kind === "evcc" ? "mdi:ev-station" : "mdi:car-connected"}></ha-icon>
      <span class="what">
        <b>${n.name ?? i}</b>
        <small>${e("car.source.from", { from: i })}${n.vehicle ? ` · ${e("car.source.vehicle", { id: n.vehicle })}` : ""}</small>
        <small>${r.length ? e("car.source.gives", { roles: r.join(", ") }) : e(n.kind === "evcc" ? "car.source.evcc_only" : "car.source.nothing")}</small>
      </span>
      ${t.sources.length > 1 ? D`<span class="row" data-tipped>
            <button
              type="button"
              class="mini-btn quiet"
              ?disabled=${this.busy}
              @click=${() => this.send({
			type: "energy_joe/car/split",
			car: t.id,
			source: n.id
		})}
            >
              <ha-icon icon="mdi:call-split"></ha-icon>${e("car.source.split")}
            </button>
            ${l(e, "car_split")}
          </span>` : j}
    </li>`;
	}
	async send(e, t) {
		this.busy = !0, this.failed = !1;
		try {
			let n = (await this.hass?.callWS(e) ?? null)?.car ?? null;
			t && n && n !== this.car?.id && x(this, {
				tab: "devices",
				section: "car",
				id: n
			}, { replace: !0 });
		} catch {
			this.failed = !0;
		}
		this.busy = !1;
	}
};
d([b({ attribute: !1 })], jo.prototype, "hass", void 0), d([b({ attribute: !1 })], jo.prototype, "t", void 0), d([b({ attribute: !1 })], jo.prototype, "state", void 0), d([b({ attribute: !1 })], jo.prototype, "discovery", void 0), d([b({ attribute: !1 })], jo.prototype, "prefix", void 0), d([b({ attribute: !1 })], jo.prototype, "car", void 0), d([T()], jo.prototype, "busy", void 0), d([T()], jo.prototype, "failed", void 0), d([T()], jo.prototype, "other", void 0), d([T()], jo.prototype, "adding", void 0), d([T()], jo.prototype, "manual", void 0);
var Mo = class extends O {
	constructor(...e) {
		super(...e), this.asking = !1, this.busy = !1;
	}
	static {
		this.styles = [k, w`
      :host {
        display: block;
      }
      .ask {
        margin: 0 0 12px;
        font-weight: 600;
      }
      .row {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
      }
    `];
	}
	render() {
		let { t: e, car: t } = this;
		return !e || !t ? j : this.asking ? D`<div data-tipped>
      <p class="ask" role="alert">${e("car.delete.ask", { name: t.name })}</p>
      <div class="row">
        <button type="button" class="btn btn-danger" ?disabled=${this.busy} @click=${this.removeCar}>${e("action.delete.yes")}</button>
        <button type="button" class="btn btn-ghost" ?disabled=${this.busy} @click=${() => this.asking = !1}>${e("action.delete.no")}</button>
        ${l(e, "car_delete")}
      </div>
    </div>` : D`<div class="row" data-tipped>
        <button type="button" class="btn btn-danger" @click=${() => this.asking = !0}>${e("car.delete")}</button>
        ${l(e, "car_delete")}
      </div>`;
	}
	async removeCar() {
		let e = this.car;
		if (!e) return;
		this.busy = !0;
		let t = [...this.config?.answers.ignored ?? []];
		for (let n of e.sources) {
			let e = a(n);
			t.includes(e) || t.push(e);
		}
		let n = await I(this, {
			cars: { [e.id]: null },
			answers: { ignored: t }
		});
		this.busy = !1, n && this.leave && x(this, this.leave, { replace: !0 });
	}
};
d([b({ attribute: !1 })], Mo.prototype, "t", void 0), d([b({ attribute: !1 })], Mo.prototype, "config", void 0), d([b({ attribute: !1 })], Mo.prototype, "car", void 0), d([b({ attribute: !1 })], Mo.prototype, "leave", void 0), d([T()], Mo.prototype, "asking", void 0), d([T()], Mo.prototype, "busy", void 0), u("joe-car-sources", jo), u("joe-car-delete", Mo);
//#endregion
//#region src/homes.ts
function No(e, t) {
	let n = e(`tab.${t.tab}`), r = t.section ? e.optional(`nav.${t.tab}.${t.section}`) : void 0;
	return r ? `${n} › ${r}` : n;
}
function Po(e, t) {
	return {
		to: t,
		place: No(e, t)
	};
}
function Fo(e, t) {
	if (t.startsWith("capacity:")) return Po(e, {
		tab: "devices",
		section: "battery",
		id: t.slice(9)
	});
	switch (t) {
		case "tariff":
		case "feed_in": return Po(e, {
			tab: "devices",
			section: "grid",
			id: "tariff"
		});
		case "heating": return Po(e, {
			tab: "devices",
			section: "other"
		});
		case "climate": return Po(e, {
			tab: "devices",
			section: "climate"
		});
		case "hot_water": return Po(e, {
			tab: "devices",
			section: "hot_water"
		});
		case "ev": return Po(e, {
			tab: "devices",
			section: "car"
		});
		case "home_office": return Po(e, {
			tab: "household",
			section: "days"
		});
		default: return Po(e, {
			tab: "household",
			section: "people"
		});
	}
}
var Io = {
	battery: {
		tab: "devices",
		section: "battery"
	},
	grid: {
		tab: "devices",
		section: "grid"
	},
	car: {
		tab: "devices",
		section: "car"
	},
	other: {
		tab: "devices",
		section: "other"
	},
	people: {
		tab: "household",
		section: "people"
	},
	weather: {
		tab: "household",
		section: "travel"
	},
	holiday: {
		tab: "household",
		section: "days"
	}
};
function Lo(e, t) {
	return Po(e, Io[t]);
}
function Ro(e) {
	let t = e.answers.later;
	return Array.isArray(t) ? t.filter((e) => typeof e == "string") : [];
}
function zo(e, t) {
	let n = (t) => e.answers[t] !== void 0 && e.answers[t] !== null, r = (t) => P(e, t)?.source === "user";
	if (t.startsWith("capacity:")) {
		let r = e.batteries.find((e) => `capacity:${e.id}` === t);
		return !(!r || r.capacity_kwh != null || r.capacity_entity || n(t));
	}
	switch (t) {
		case "tariff": return e.tariff.kind === "unknown" && !n(t);
		case "feed_in": return e.tariff.feed_in_price == null && !e.tariff.feed_in_entity && !n(t);
		case "household": return !e.persons.length;
		case "heating": return !n(t) && !e.consumers.some((e) => r(`consumers[${e.id}].kind`));
		case "climate": return !e.climate?.enabled && !r("climate.enabled") && !n(t);
		case "hot_water": return !e.actions.some((t) => nt(t, Bo(e, t)) === "hot_water") && !n(t);
		case "ev": return !e.actions.some((t) => nt(t, Bo(e, t)) === "car") && !n(t);
		case "home_office": return !r("calendar.default_workday") && !n(t);
		default: return !n(t);
	}
}
function Bo(e, t) {
	return t.consumer_id ? e.consumers.find((e) => e.id === t.consumer_id) : void 0;
}
//#endregion
//#region src/pages/overview/inbox.ts
function Vo(e, t, n) {
	let r = (e) => e ? n ? _(n, e) : e : "–", i = (t) => e.optional(`role.${t}`) ?? t;
	return [...t.missing.map((t) => e("roles.todo.missing", { role: i(t) })), ...t.wrong.map((t) => e("roles.todo.wrong", {
		role: i(t.role),
		is: r(t.is),
		found: r(t.found)
	}))].join(", ");
}
function Ho(e, t) {
	return [{
		label: e("roles.todo.adopt"),
		message: {
			type: "energy_joe/battery/roles",
			battery_id: t,
			action: "adopt"
		},
		done: e("roles.todo.adopted")
	}, {
		label: e("roles.todo.keep"),
		message: {
			type: "energy_joe/battery/roles",
			battery_id: t,
			action: "dismiss"
		}
	}];
}
function Uo(e, t) {
	let n = e.measurements.solar_power ?? [];
	return n.some((e) => e.entity_id === t && !e.sleeps) ? { measurements: { solar_power: n.map((e) => e.entity_id === t ? {
		...e,
		sleeps: !0
	} : e) } } : null;
}
function Wo(e) {
	return `todo:${e}`;
}
function Go(e) {
	return e.level === "warn" || e.code === "tariff_unknown" || e.code === "missing" && e.role === "grid_power";
}
function Ko(e) {
	return typeof e.battery_id == "string" ? {
		group: "battery",
		id: e.battery_id
	} : e.code === "tariff_unknown" ? {
		group: "grid",
		id: "tariff"
	} : e.role === "home_power" || e.code === "home_negative" ? {
		group: "grid",
		id: "home"
	} : e.role === "solar_power" ? {
		group: "grid",
		id: "solar"
	} : {
		group: "grid",
		id: "connection"
	};
}
function qo(e, t, n = {}) {
	let i = t.config, a = t.control, o = n.devices ?? [], s = (t, n, r) => pt(o, t, n)?.name ?? r ?? (t === "grid" ? e("devices.grid.connection") : n), c = (e) => !F(i, Wo(e)), l = [], u = (e) => {
		c(e.id) && l.push({
			...e,
			hide: [e.id]
		});
	}, d = (e) => {
		l.push({
			...e,
			icon: "mdi:alert-outline",
			warn: !0,
			hide: []
		});
	}, f = (e, t, n) => {
		let r = e.filter((e) => c(e.id));
		if (r.length === 1) l.push({
			...r[0].one,
			id: r[0].id,
			hide: [r[0].id]
		});
		else if (r.length > 1) {
			let e = r.map((e) => e.name).join(", ");
			l.push({
				...t(e),
				id: `${n}:${r.map((e) => e.id).join(",")}`,
				hide: r.map((e) => e.id)
			});
		}
	}, m = t.config_backup;
	m && l.push({
		id: "config_backup",
		hide: [],
		icon: "mdi:backup-restore",
		warn: !0,
		title: e("overview.todo.config_backup"),
		text: m.error ? `${e("overview.todo.config_backup.text")} ${e("overview.todo.config_backup.failed", { error: m.error })}` : e("overview.todo.config_backup.text"),
		to: {
			tab: "settings",
			section: "maintenance",
			id: "backup"
		},
		choices: [{
			label: e("overview.todo.config_backup.restore"),
			message: {
				type: "energy_joe/config/backup",
				action: "restore"
			}
		}, {
			label: e("overview.todo.config_backup.discard"),
			message: {
				type: "energy_joe/config/backup",
				action: "discard"
			}
		}],
		choicesTip: "config_backup"
	});
	for (let n of i.actions.filter((e) => e.point)) t.cars?.points?.[n.id]?.ask && l.push({
		id: `which_car:${n.id}`,
		hide: [],
		icon: "mdi:car-question",
		title: e("point.ask", { point: n.name }),
		text: e("point.ask.text"),
		to: p(n.id),
		choices: [...r(i, n).map((e) => ({
			label: e.name,
			message: {
				type: "energy_joe/car/answer",
				point: n.id,
				car: e.id
			}
		})), {
			label: e("point.guest"),
			message: {
				type: "energy_joe/car/answer",
				point: n.id,
				car: "guest"
			}
		}],
		choicesTip: "point_which"
	});
	for (let n of t.cars?.merge ?? []) {
		let r = Ao(n);
		u({
			id: `car_merge:${n.a}|${n.b}`,
			icon: "mdi:call-merge",
			title: ko(e, t, n),
			text: e("car.merge.text"),
			to: _e(n.a, "sources"),
			choices: [{
				label: e("car.merge.yes"),
				message: r.yes
			}, {
				label: e("car.merge.no"),
				message: r.no
			}],
			choicesTip: "car_merge"
		});
	}
	for (let n of t.cars?.reminders ?? []) u({
		id: `unplugged:${n.car}:${t.plan?.window?.start ?? ""}`,
		icon: "mdi:power-plug-off-outline",
		title: e("car.reminder", {
			car: n.name,
			km: n.km
		}),
		text: e("car.reminder.text"),
		to: _e(n.car)
	});
	for (let t of (n.checks ?? []).filter(Go)) {
		let n = Ko(t), r = String(t.battery_id ?? t.role ?? t.entity_id ?? ""), a = t.can_sleep ? Uo(i, String(t.entity_id)) : null;
		d({
			id: `check:${t.code}:${r}`,
			title: s(n.group, n.group === "grid" && n.id === "tariff" ? "connection" : n.id, t.battery),
			text: Ke(e, t),
			to: R(n),
			fix: a ? {
				label: e("solar.sleeps.quick"),
				tip: "solar_sleeps",
				patch: a
			} : void 0
		});
	}
	let h = (t) => e.optional(`devices.problem.${t}`) ?? t;
	for (let r of t.battery_roles ?? []) {
		let t = n.profiles?.[r.profile] ?? r.profile;
		l.push({
			id: `roles:${r.battery_id}`,
			hide: [],
			icon: "mdi:swap-horizontal-variant",
			warn: !0,
			title: e("roles.todo.title", {
				name: r.name,
				profile: t
			}),
			text: e("roles.todo.text", { details: Vo(e, r, n.hass) }),
			to: {
				tab: "devices",
				section: "battery",
				id: r.battery_id,
				sub: "control"
			},
			choices: Ho(e, r.battery_id),
			choicesTip: "battery_roles"
		});
	}
	for (let [t, r] of Object.entries(a?.stuck ?? {})) {
		let a = i.batteries.find((e) => e.id === t);
		a && l.push({
			id: `stuck:${t}:${r.reason}`,
			hide: [],
			icon: "mdi:battery-lock",
			warn: !0,
			title: ci(e, a.name, r),
			text: li(e, n.hass, r),
			when: di(e, r.since),
			to: R({
				group: "battery",
				id: t
			}),
			ha: {
				target: {
					entityId: r.entity_id,
					name: r.name
				},
				tip: "stuck"
			}
		});
	}
	for (let e of i.batteries.filter((e) => e.adapter !== "none")) {
		let t = a?.batteries[e.id]?.problem ?? (a?.ready[e.id] === "controls_missing" ? "controls_missing" : null);
		t && d({
			id: `problem:battery:${e.id}:${t}`,
			title: e.name,
			text: h(t),
			to: R({
				group: "battery",
				id: e.id
			})
		});
	}
	let g = ga(t), ee = wa(e, g);
	ee.length && d({
		id: `surplus:evcc:${(g?.conflicts ?? []).map((e) => e.code).join(",")}`,
		title: e("surplus.conflict.title"),
		text: ee.join(" "),
		to: {
			tab: "devices",
			section: "battery"
		}
	});
	let _ = wa(e, g, !0);
	_.length && d({
		id: `surplus:device:${(g?.conflicts ?? []).map((e) => e.code).join(",")}`,
		title: e("surplus.device_conflict.title"),
		text: _.join(" "),
		to: {
			tab: "devices",
			section: "battery"
		}
	});
	let te = a?.automations ?? [];
	te.length && (t.mode === "advisory" || t.mode === "live") && d({
		id: `automations:${te.join("|")}`,
		title: e("overview.todo.automations.title"),
		text: e("overview.todo.automations", { names: ji(te) }),
		to: {
			tab: "devices",
			section: "battery",
			id: "automations"
		}
	});
	let ne = pi(t), re = {
		tab: "devices",
		section: "battery",
		id: "together"
	}, v = Ni(t), ie = Ri(e, v, i);
	ie && v?.last && d({
		id: `guard:alarm:${v.last.since ?? v.last.at}`,
		title: e("guard.alarm.title"),
		text: ie,
		to: re
	});
	let ae = zi(e, v, i);
	ae && v?.last && d({
		id: `guard:inside:${v.last.since ?? v.last.at}`,
		title: e("guard.inside.title"),
		text: ae,
		to: re
	}), ne?.group_question && u({
		id: "team:groups",
		icon: "mdi:help-circle-outline",
		title: e("team.groups.question"),
		text: e("team.groups.question.text", { names: Vi(i, ne) }),
		to: re,
		fix: {
			label: e("team.groups.confirm"),
			tip: "team_groups_confirm",
			patch: Bi(i, ne)
		}
	});
	let oe = ki(e, i, ne);
	if (oe && ne?.suggest && l.push({
		id: `team:early:${ne.suggest.day}`,
		hide: [],
		icon: "mdi:battery-clock-outline",
		title: oe.title,
		text: oe.text,
		to: re,
		choices: [{
			label: e("team.suggest.yes"),
			patch: { rules: { team_early: !0 } }
		}, {
			label: e("team.suggest.no"),
			patch: { rules: { team_early: !1 } }
		}],
		choicesTip: "team_early"
	}), i.rules.day_surplus) for (let t of i.batteries) {
		let r = g?.batteries?.[t.id]?.state;
		(r ? r === "need_ref" : _a(n.hass, t) === "need_ref") && t.day_surplus !== !1 && t.adapter !== "none" && u({
			id: `limit_ref:${t.id}`,
			icon: "mdi:percent-outline",
			title: e("overview.todo.limit_ref", { name: t.name }),
			text: e("overview.todo.limit_ref.text"),
			to: R({
				group: "battery",
				id: t.id
			})
		});
	}
	for (let [t, n] of Object.entries(g?.batteries ?? {})) n.problem && d({
		id: `problem:surplus:${t}:${n.problem}`,
		title: n.name,
		text: `${e("surplus.problem")} ${h(n.problem)}`,
		to: R({
			group: "battery",
			id: t
		})
	});
	for (let e of i.actions) {
		let t = a?.actions?.[e.id]?.problem;
		if (t) {
			let n = rt(i, e);
			d({
				id: `problem:${n.group}:${e.id}:${t}`,
				title: s(n.group, n.id, e.name),
				text: h(t),
				to: R(n)
			});
		}
	}
	let y = i.climate?.enabled ? i.climate.rooms ?? {} : {};
	for (let [n, r] of Object.entries(y)) {
		let i = r.enabled ? t.climate?.rooms[n]?.error : null;
		i && d({
			id: `problem:climate:${n}:${i}`,
			title: s("climate", n, n),
			text: e.optional(`week.error.${i}`) ?? e("week.error", { error: i }),
			to: R({
				group: "climate",
				id: n
			})
		});
	}
	f(i.batteries.filter((e) => e.adapter !== "none" && ["not_tested", "outdated"].includes(a?.ready[e.id] ?? "")).map((t) => ({
		id: `test:${t.id}`,
		name: t.name,
		one: {
			icon: "mdi:test-tube",
			title: e("overview.todo.test", { name: t.name }),
			text: e(a?.ready[t.id] === "outdated" ? "overview.todo.test.outdated" : "overview.todo.test.text"),
			to: R({
				group: "battery",
				id: t.id
			})
		}
	})), (t) => ({
		icon: "mdi:test-tube",
		title: e("overview.todo.test_many", { names: t }),
		text: e("overview.todo.test_many.text"),
		to: {
			tab: "devices",
			section: "battery"
		}
	}), "test"), i.notify?.service || u({
		id: "notify",
		icon: "mdi:bell-outline",
		title: e("overview.todo.notify"),
		text: e("overview.todo.notify.text"),
		to: {
			tab: "settings",
			section: "notify"
		}
	});
	let se = n.climateFound?.devices.length ?? 0, ce = !!(i.climate?.enabled && Object.values(i.climate.rooms ?? {}).some((e) => e.enabled));
	se && !ce && u({
		id: "climate",
		icon: "mdi:thermostat",
		title: e("overview.todo.climate"),
		text: e("overview.todo.climate.text"),
		to: {
			tab: "devices",
			section: "climate"
		}
	});
	let b = o.filter((e) => e.group === "car" && (e.car && !e.car.need.enabled || e.setup));
	for (let [t, n] of [[!1, "car"], [!0, "car_setup"]]) f(b.filter((e) => !!e.setup === t).map((n) => ({
		id: `car:${n.id}`,
		name: n.name,
		one: {
			icon: "mdi:car-electric",
			title: e(t ? "overview.todo.car.setup" : "overview.todo.car", { name: n.name }),
			text: e("overview.todo.car.text"),
			to: R(n)
		}
	})), (n) => ({
		icon: "mdi:car-electric",
		title: e(t ? "overview.todo.car_setup_many" : "overview.todo.car_many", { names: n }),
		text: e("overview.todo.car.text"),
		to: {
			tab: "devices",
			section: "car"
		}
	}), n);
	let le = new Set(l.map((e) => ue(e.to)));
	for (let t of Ro(i).filter((e) => zo(i, e))) {
		let n = Fo(e, t);
		if (le.has(ue(n.to))) continue;
		le.add(ue(n.to));
		let r = t.startsWith("capacity:") ? i.batteries.find((e) => `capacity:${e.id}` === t) : void 0;
		u({
			id: `later:${t}`,
			icon: "mdi:clock-outline",
			title: e("overview.todo.later", { topic: r?.name ?? e.optional(`ask.topic.${t}`) ?? t }),
			text: e("overview.todo.later.text", { place: n.place }),
			to: n.to
		});
	}
	let de = gt(i, n.discovery).filter((e) => c(`new:${e.key}`));
	return de.length && l.push({
		id: `new:${de.map((e) => e.key).join(",")}`,
		hide: de.map((e) => `new:${e.key}`),
		icon: "mdi:new-box",
		title: e("overview.todo.new", { names: de.map((e) => e.name).join(", ") }),
		text: e("overview.todo.new.text"),
		to: {
			tab: "devices",
			section: "all"
		}
	}), l;
}
var Jo = 3, Yo = class extends O {
	constructor(...e) {
		super(...e), this.prefix = A, this.items = [], this.steer = !1, this.all = !1, this.asking = !1, this.fixing = /* @__PURE__ */ new Set(), this.dismissed = /* @__PURE__ */ new Set(), this.notice = "", this.hiding = [];
	}
	static {
		this.styles = [k, w`
      :host {
        display: block;
      }
      .card {
        padding: 18px 20px;
      }
      .head {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .head .eyebrow {
        flex: 1;
        min-width: 0;
      }
      joe-day-questions {
        margin-top: 6px;
        padding: 8px 0 4px;
      }
      li.steer {
        flex-wrap: nowrap;
        align-items: flex-start;
        gap: 12px;
        padding: 12px 8px 12px 6px;
      }
      li.steer .todo-icon {
        flex: none;
      }
      li.steer joe-steer-tonight {
        flex: 1;
        min-width: 0;
        padding-top: 6px;
      }
      button.todo-main {
        width: 100%;
        border: 0;
        background: transparent;
        font: inherit;
        text-align: left;
        cursor: pointer;
      }
      .ask .todo-icon {
        background: var(--joe-surface-2);
        color: var(--joe-ink-2);
      }
      .more-row {
        display: flex;
        padding-top: 6px;
        border-top: 1px solid var(--joe-line);
      }
      ul {
        list-style: none;
        margin: 10px 0 0;
        padding: 0;
      }
      li {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 4px 8px;
        padding: 6px 0;
        border-top: 1px solid var(--joe-line);
      }
      li:first-child {
        border-top: 0;
      }
      .todo-main {
        flex: 1 1 260px;
        min-width: 0;
        min-height: 44px;
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        gap: 2px 12px;
        padding: 8px 8px 8px 6px;
        border-radius: 10px;
        color: inherit;
        text-decoration: none;
        transition: background 0.12s;
      }
      .todo-main:hover {
        background: var(--joe-surface-2);
      }
      .todo-icon {
        display: grid;
        place-items: center;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: var(--joe-amber-soft);
        color: var(--joe-amber-text);
      }
      li.warn .todo-icon {
        background: var(--joe-crit-soft);
        color: var(--joe-crit);
      }
      .todo-text {
        display: grid;
        gap: 2px;
        min-width: 0;
      }
      .todo-text b {
        font-weight: 700;
        overflow-wrap: anywhere;
      }
      .todo-text small {
        font-size: 13.5px;
        color: var(--joe-ink-2);
        line-height: 1.4;
      }
      .todo-text small.when {
        color: var(--joe-muted);
      }
      .go {
        color: var(--joe-muted);
      }
      .todo-actions {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-left: auto;
      }
      .todo-actions.choices {
        flex-wrap: wrap;
        margin-left: 46px;
        padding-bottom: 4px;
      }
      .note.after {
        margin-top: 10px;
      }
    `];
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.noticeTimer !== void 0 && clearTimeout(this.noticeTimer);
	}
	willUpdate(e) {
		if (e.has("items")) {
			let e = new Set(this.items.map((e) => e.id)), t = [...this.dismissed].filter((t) => !/^(which_car|car_merge):/.test(t) || e.has(t));
			t.length !== this.dismissed.size && (this.dismissed = new Set(t));
		}
	}
	render() {
		let e = this.t, t = this.state;
		if (!e || !t) return j;
		let n = t.questions ?? [], r = this.items.filter((e) => !this.dismissed.has(e.id));
		if (!r.length && !n.length && !this.steer && !this.notice) return j;
		let i = this.all ? r : r.slice(0, Jo), a = r.length - i.length, o = r.some((e) => e.id.startsWith("test:"));
		return D`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:bell-ring-outline"></ha-icon>${e("overview.inbox")}</div>
        <span class="chip warn">${e("overview.inbox.count", { count: r.length + n.length + +!!this.steer })}</span>
        ${l(e, "inbox")}
      </div>
      ${this.notice ? D`<div class="note after" role="status"><ha-icon icon="mdi:information-outline"></ha-icon><span>${this.notice}</span></div>` : j}
      <ul>
        ${this.steer ? D`<li class="steer">
              <span class="todo-icon"><ha-icon icon="mdi:weather-night"></ha-icon></span>
              <joe-steer-tonight
                compact
                .hideUntested=${o}
                .t=${e}
                .hass=${this.hass}
                .state=${t}
                .prefix=${this.prefix}
              ></joe-steer-tonight>
            </li>` : j}
        ${i.map((t) => this.renderItem(e, t))}
        ${n.length ? this.renderAsk(e, n.length) : j}
      </ul>
      ${a > 0 || this.all && r.length > Jo ? D`<div class="more-row" data-notip>
            <button type="button" class="mini-btn quiet" aria-expanded=${this.all ? "true" : "false"} @click=${() => this.all = !this.all}>
              <ha-icon icon=${this.all ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
              ${this.all ? e("overview.inbox.less") : e("overview.inbox.more", { count: a })}
            </button>
          </div>` : j}
      ${n.length && this.asking ? D`<joe-day-questions bare .hass=${this.hass} .t=${e} .questions=${n}></joe-day-questions>` : j}
    </section>`;
	}
	renderItem(e, t) {
		return D`<li class=${t.warn ? "warn" : ""}>
      <a class="todo-main" href=${E(this.prefix, t.to)} @click=${C(t.to)}>
        <span class="todo-icon"><ha-icon icon=${t.icon}></ha-icon></span>
        <span class="todo-text">
          <b>${t.title}</b>
          ${t.text ? D`<small>${t.text}</small>` : j}
          ${t.when ? D`<small class="when">${t.when}</small>` : j}
        </span>
        <ha-icon class="go" icon="mdi:chevron-right"></ha-icon>
      </a>
      ${t.ha ? D`<span class="todo-actions" data-tipped>${G(e, t.ha.target)}${l(e, t.ha.tip)}</span>` : j}
      ${t.choices?.length ? D`<span class="todo-actions choices" data-tipped role="group" aria-label=${t.title}>
            ${t.choices.map((e) => D`<button
                type="button"
                class="mini-btn"
                ?disabled=${this.fixing.has(t.id)}
                @click=${() => this.choose(t, e)}
              >
                ${e.label}
              </button>`)}
            ${t.choicesTip ? l(e, t.choicesTip) : j}
          </span>` : j}
      ${t.fix ? D`<span class="todo-actions" data-tipped>
            <button type="button" class="mini-btn" ?disabled=${this.fixing.has(t.id)} @click=${() => this.applyFix(t)}>
              ${t.fix.label}
            </button>
            ${l(e, t.fix.tip)}
          </span>` : j}
      ${t.hide.length ? D`<span class="todo-actions" data-tipped>
            <button type="button" class="mini-btn quiet" @click=${() => this.dismiss(t)}>${e("overview.todo.dismiss")}</button>
            ${l(e, "todo_dismiss")}
          </span>` : j}
    </li>`;
	}
	renderAsk(e, t) {
		return D`<li class="ask" data-notip>
      <button type="button" class="todo-main" aria-expanded=${this.asking ? "true" : "false"} @click=${() => this.asking = !this.asking}>
        <span class="todo-icon"><ha-icon icon="mdi:chat-question-outline"></ha-icon></span>
        <span class="todo-text">
          <b>${t === 1 ? e("overview.ask.one") : e("overview.ask.many", { count: t })}</b>
          <small>${e("overview.ask.text")}</small>
        </span>
        <ha-icon class="go" icon=${this.asking ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
      </button>
    </li>`;
	}
	async choose(e, t) {
		this.fixing = /* @__PURE__ */ new Set([...this.fixing, e.id]);
		let n = !0;
		if (t.patch) n = await I(this, t.patch);
		else if (t.message) try {
			await this.hass?.callWS(t.message);
		} catch {
			n = !1;
		}
		let r = new Set(this.fixing);
		r.delete(e.id), this.fixing = r, n && (this.dismissed = /* @__PURE__ */ new Set([...this.dismissed, e.id]), t.done && (this.notice = t.done, this.noticeTimer !== void 0 && clearTimeout(this.noticeTimer), this.noticeTimer = window.setTimeout(() => {
			this.notice = "";
		}, 12e3)));
	}
	async applyFix(e) {
		if (!e.fix) return;
		this.fixing = /* @__PURE__ */ new Set([...this.fixing, e.id]);
		let t = await I(this, e.fix.patch), n = new Set(this.fixing);
		n.delete(e.id), this.fixing = n, t && (this.dismissed = /* @__PURE__ */ new Set([...this.dismissed, e.id]));
	}
	async dismiss(e) {
		let t = this.state?.config;
		if (!t) return;
		this.dismissed = /* @__PURE__ */ new Set([...this.dismissed, e.id]), this.hiding = [...this.hiding, ...e.hide];
		let n = [...t.answers.ignored];
		for (let e of this.hiding) n.includes(Wo(e)) || n.push(Wo(e));
		if (!await I(this, { answers: { ignored: n } })) {
			let t = new Set(this.dismissed);
			t.delete(e.id), this.dismissed = t, this.hiding = this.hiding.filter((t) => !e.hide.includes(t));
		}
	}
};
d([b({ attribute: !1 })], Yo.prototype, "hass", void 0), d([b({ attribute: !1 })], Yo.prototype, "t", void 0), d([b({ attribute: !1 })], Yo.prototype, "state", void 0), d([b({ attribute: !1 })], Yo.prototype, "prefix", void 0), d([b({ attribute: !1 })], Yo.prototype, "items", void 0), d([b({ type: Boolean })], Yo.prototype, "steer", void 0), d([T()], Yo.prototype, "all", void 0), d([T()], Yo.prototype, "asking", void 0), d([T()], Yo.prototype, "fixing", void 0), d([T()], Yo.prototype, "dismissed", void 0), d([T()], Yo.prototype, "notice", void 0), u("joe-overview-inbox", Yo);
//#endregion
//#region src/pages/devices/battery-device.ts
var Xo = [
	"hold",
	"charge",
	"release"
], Zo = 14, Qo = [
	"adapter",
	"controls",
	"mode_options",
	"steps",
	"prepare",
	"modbus"
], $o = /* @__PURE__ */ new Map();
function es(e) {
	return {
		...nr(e),
		prepare: structuredClone(e.prepare)
	};
}
var ts = (e, t) => JSON.stringify(e ?? null) === JSON.stringify(t ?? null);
function ns(e, t, n) {
	switch (t.adapter) {
		case "none": return e("devices.battery.watch");
		case "generic": return e("devices.battery.generic");
		case "steps": return e("devices.battery.steps");
		default: return e("devices.battery.profile", { name: n?.profiles?.[t.adapter] ?? t.adapter });
	}
}
function rs(e, t, n) {
	if (t.adapter === "none") return e("devices.action.watch");
	let r = n?.batteries[t.id], i = r?.action === "defer" && r.level != null ? "defer_buffer" : r?.action;
	return i ? e(`devices.action.${i}`, {
		target: v(e.lang, r?.target ?? 0, 0),
		floor: v(e.lang, r?.floor ?? 0, 0),
		until: r?.until ? N(r.until) : "",
		level: v(e.lang, r?.level ?? 0, 0)
	}) : e("devices.action.idle");
}
function is(e, t) {
	return e.adapter === "none" && !!t?.suggested?.complete;
}
function as(e) {
	return {
		tab: "devices",
		section: "battery",
		id: e,
		sub: "control"
	};
}
var os = class extends q {
	constructor(...e) {
		super(...e), this.confirm = !1, this.removing = !1, this.saving = !1, this.notice = "", this.answering = !1, this.rolesNotice = "", this.automations = null, this.automationsFor = "", this.revealed = "";
	}
	static {
		this.styles = [
			k,
			K,
			oo,
			w`
      :host {
        display: block;
      }
      .head-row {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .note {
        margin-top: 0;
      }
      .note.stuck {
        margin-bottom: 12px;
      }
      .note.stuck > span {
        min-width: 0;
      }
      .note.stuck b {
        font-weight: 700;
      }
      .stuck-since {
        display: block;
        margin-top: 4px;
        color: var(--joe-ink-2);
      }
      .stuck-actions {
        align-items: center;
      }
      .test {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .test .chip {
        margin-right: auto;
      }
      .steps {
        list-style: none;
        margin: 12px 0 0;
        padding: 0;
        display: grid;
        gap: 6px;
      }
      .steps li {
        display: grid;
        grid-template-columns: 22px auto 1fr;
        gap: 8px;
        align-items: start;
        font-size: 14px;
      }
      .steps li ha-icon {
        --mdc-icon-size: 18px;
        margin-top: 1px;
      }
      .steps li.ok ha-icon {
        color: var(--joe-good);
      }
      .steps li.bad ha-icon {
        color: var(--joe-crit);
      }
      .steps li.wait ha-icon {
        color: var(--joe-muted);
      }
      .steps small {
        color: var(--joe-ink-2);
      }
      .probes {
        margin: 10px 0 0;
        font-size: 13.5px;
        color: var(--joe-ink-2);
      }
      .probes .ok {
        color: var(--joe-good);
      }
      .probes .bad {
        color: var(--joe-crit);
      }
      .roles-note {
        margin-bottom: 12px;
      }
      .control-row {
        display: flex;
        align-items: center;
        gap: 8px 12px;
        flex-wrap: wrap;
        padding-bottom: 14px;
        margin-bottom: 4px;
        border-bottom: 1px solid var(--joe-line);
      }
      .control-text {
        flex: 1 1 180px;
        min-width: 0;
        display: grid;
        gap: 2px;
      }
      .control-text small {
        color: var(--joe-muted);
        font-size: 13px;
      }
      .control-text b {
        font-weight: 700;
      }
      .control-text .mini-btn {
        justify-self: start;
        margin-top: 6px;
      }
      .ref-field {
        padding-bottom: 14px;
        margin: 0 0 4px;
        border-bottom: 1px solid var(--joe-line);
      }
      .field-row {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      @media (pointer: coarse) {
        .ref-field .input {
          min-height: 44px;
        }
      }
      a.btn {
        text-decoration: none;
      }
      .suggest {
        margin: 10px 0 0;
      }
      .remove-text,
      .sheet-text {
        margin: 0;
        color: var(--joe-ink-2);
        line-height: 1.55;
      }
      .sheet-text {
        margin-top: 12px;
      }
      .remove .actions {
        margin-top: 12px;
      }
      .remove .note {
        margin-top: 12px;
      }
      .rows {
        margin-top: 0;
      }
      /* Save and cancel stay in view at the bottom of the sheet (as in the week sheet). */
      .steer-bar {
        position: sticky;
        bottom: -22px;
        z-index: 1;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
        margin: 22px -22px -22px;
        padding: 12px 22px 16px;
        background: var(--joe-surface);
        box-shadow: 0 -1px 0 var(--joe-line);
      }
      .steer-bar .unsaved {
        flex-basis: 100%;
        color: var(--joe-ink-2);
        font-weight: 600;
      }
      @media (max-width: 600px) {
        .steer-bar {
          bottom: calc(-20px - env(safe-area-inset-bottom));
          margin: 20px -16px calc(-20px - env(safe-area-inset-bottom));
          padding: 10px 16px calc(12px + env(safe-area-inset-bottom));
        }
      }
    `
		];
	}
	get battery() {
		return this.entry?.battery;
	}
	willUpdate(e) {
		let t = this.battery?.id ?? "";
		e.has("entry") && t !== this.automationsFor && (this.removing = !1, this.notice = ""), this.hass && t && t !== this.automationsFor && (this.automationsFor = t, this.automations = null, Aa(this.hass).then((e) => {
			this.automationsFor === t && (this.automations = e);
		}));
	}
	updated() {
		let e = this.sub === "intruders" ? `${this.battery?.id}/intruders` : "";
		e ? this.revealed !== e && ve(this.renderRoot, "intruders") && (this.revealed = e) : this.revealed = "";
	}
	render() {
		let { t: e, entry: t } = this, n = this.state, r = this.battery;
		if (!e || !n || !t || !r) return j;
		let i = n.control, a = this.discovery?.batteries.find((e) => e.id === r.id), o = r.adapter !== "none", s = ja(this.automations ?? [], r.id);
		return D`${oa(this.ctx, {
			...ta(this.ctx, t),
			why: rs(e, r, i),
			head: this.renderHead(e, r, a),
			now: o ? this.renderTest(e, r, i) : void 0,
			steer: this.renderSteer(e, r),
			power: this.renderPower(e, r),
			learned: ao([so(e, n.config, n.config.learned, r, Zo)]),
			learnedArea: "battery",
			intruders: s.length ? this.renderIntruders(e, r) : void 0,
			remove: this.renderRemove(e, r),
			tips: {
				now: "devices_test",
				steer: "f_battery_control",
				intruders: "battery_intruders",
				remove: "battery_remove"
			}
		})}
      ${this.confirm ? this.renderConfirm(e, r) : j}
      ${this.sub === "control" ? this.renderControl(e, r, a) : j}`;
	}
	renderHead(e, t, n) {
		let r = as(t.id);
		return D`<div class="head-row">
        <span class="chip ${t.adapter === "none" ? "" : "read"}">${ns(e, t, this.info)}</span>
      </div>
      ${is(t, n) ? D`<div class="note">
            <ha-icon icon="mdi:lightbulb-on-outline"></ha-icon>
            <span
              >${e("devices.suggested")}
              <div class="note-actions">
                <a class="mini-btn go" href=${E(this.prefix, r)} @click=${C(r, { sheet: !0 })}>${e("devices.setup")}</a>
              </div></span
            >
          </div>` : j}
      ${Fn(e, n?.notes, t.name)}
      ${Nn(e, t, this.state?.control)}
      ${this.notice ? D`<div class="note warn" role="status"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.notice}</span></div>` : j}`;
	}
	renderTest(e, t, n) {
		let r = n?.ready[t.id] ?? "not_controllable", i = n?.testing?.battery === t.id ? n.testing : null, a = n?.tests[t.id], o = n?.probe_running, s = !!n?.testing || !!o, c = !!n?.steering, l = o?.battery === t.id ? D`<span class="chip">${e("battery.probe.running", { op: e.optional(`op.short.${o.op}`) ?? o.op })}</span>` : j, u = i ? D`<span class="chip">${e("devices.test.running")}</span>` : r === "outdated" ? D`<span class="chip warn">${e("devices.test.outdated")}</span>` : a ? D`<span class="chip ${a.ok ? "ok" : "warn"}"
              >${e(a.ok ? "devices.test.ok" : "devices.test.failed", { day: U(e.lang, a.at, "short") })}</span
            >` : D`<span class="chip">${e("devices.test.none")}</span>`, d = i?.steps ?? a?.steps ?? [];
		return D`${fi(e, this.hass, t, n)}
      <div class="test">
        ${u} ${l}
        <button type="button" class="btn btn-secondary" ?disabled=${s || c} @click=${() => this.confirm = !0}>
          <ha-icon icon="mdi:play-circle-outline"></ha-icon>${e(a ? "devices.test.again" : "devices.test.start")}
        </button>
      </div>
      ${i || a ? this.renderSteps(e, d, i?.step ?? null, a) : j}
      ${this.renderProbes(e, t)}`;
	}
	renderProbes(e, t) {
		let n = this.state?.probes?.[t.id], r = Object.entries(n ?? {}).filter((e) => !!e[1]);
		if (!r.length) return j;
		let i = r.map(([t, n]) => {
			let r = e.optional(`op.short.${t}`) ?? t;
			return D`<span class=${n.ok ? "ok" : "bad"}
        >${e(n.ok ? "battery.probes.ok" : "battery.probes.failed", {
				op: r,
				day: U(e.lang, n.at, "short")
			})}</span
      >`;
		});
		return D`<p class="probes">${e("battery.probes", { list: "" })}${i.map((e, t) => D`${t ? " · " : ""}${e}`)}</p>`;
	}
	renderSteps(e, t, n, r) {
		let i = new Map(t.map((e) => [e.step, e])), a = !n && r?.problem ? e.optional(`devices.test.problem.${r.problem}`, { missing: (r.missing ?? []).map((t) => e.optional(`role.${t}`) ?? t).join(", ") }) : null;
		return a ? D`<ul class="steps">
        <li class="bad"><ha-icon icon="mdi:close-circle"></ha-icon><b>${e("devices.test.step.check")}</b><small>${a}</small></li>
      </ul>` : D`<ul class="steps">
      ${Xo.map((t) => {
			let r = i.get(t), a = r ? r.ok ? "mdi:check-circle" : "mdi:close-circle" : n === t ? "mdi:progress-clock" : "mdi:circle-outline";
			return D`<li class=${r ? r.ok ? "ok" : "bad" : "wait"}>
          <ha-icon icon=${a}></ha-icon>
          <b>${e(`devices.test.step.${t}`)}</b>
          <small>${r ? this.stepText(e, r) : ""}</small>
        </li>`;
		})}
    </ul>`;
	}
	stepText(e, t) {
		let n = this.hass, r = [];
		return t.power != null && r.push(Math.abs(t.power) >= .05 ? e("devices.test.power", { value: v(e.lang, t.power, 2) }) : e("devices.test.no_power")), t.wrong.length && r.push(e("devices.test.wrong", { entities: t.wrong.map((e) => _(n, e)).join(", ") })), t.errors.length && r.push(e("devices.test.error", { entities: t.errors.map((e) => _(n, e.entity_id)).join(", ") })), r.join(" · ");
	}
	renderConfirm(e, t) {
		let n = () => {
			this.confirm = !1;
		};
		return D`<joe-sheet label=${e("devices.test.start")} closeLabel=${e("common.close")} @joe-close=${n}>
      <div data-tipped>
        <div class="sheet-title">${y(e("devices.test.confirm.title", { name: t.name }), "h2", l(e, "devices_test"))}</div>
        <p class="sheet-text">${e("devices.test.confirm.text")}</p>
        <div class="actions">
          <button type="button" class="btn btn-secondary" data-notip @click=${n}>${e("common.cancel")}</button>
          <button type="button" class="btn btn-primary" @click=${() => this.startTest(t)}>${e("devices.test.confirm.go")}</button>
        </div>
      </div>
    </joe-sheet>`;
	}
	async startTest(e) {
		this.confirm = !1, this.notice = "";
		try {
			await this.hass?.callWS({
				type: "energy_joe/control/test",
				battery_id: e.id
			});
		} catch {
			this.notice = this.t("error.action");
		}
	}
	renderSteer(e, t) {
		let n = as(t.id);
		return D`${this.renderRolesNote(e, t)}
      <div class="control-row" data-tipped>
        <span class="control-text">
          <small>${e("battery.page.how")}</small>
          <b>${ns(e, t, this.info)}</b>
        </span>
        <a class="btn btn-secondary" href=${E(this.prefix, n)} @click=${C(n, { sheet: !0 })}>
          <ha-icon icon="mdi:tune-variant"></ha-icon>${e("devices.setup")}
        </a>
        ${l(e, "devices_setup")}
      </div>
      ${t.adapter === "none" ? j : this.renderDaySurplus(e, t)} ${this.fields(t, "steer")}`;
	}
	renderRolesNote(e, t) {
		let n = this.state?.battery_roles?.find((e) => e.battery_id === t.id);
		if (!n) return this.rolesNotice ? D`<div class="note roles-note" role="status"><ha-icon icon="mdi:information-outline"></ha-icon><span>${this.rolesNotice}</span></div>` : j;
		let r = this.info?.profiles?.[n.profile] ?? n.profile;
		return D`<div class="note warn roles-note" role="status" data-tipped>
      <ha-icon icon="mdi:swap-horizontal-variant"></ha-icon>
      <span
        >${e("roles.todo.title", {
			name: n.name,
			profile: r
		})}: ${e("roles.todo.text", { details: Vo(e, n, this.hass) })}
        <div class="note-actions">
          ${Ho(e, t.id).map((e) => D`<button
              type="button"
              class="mini-btn ${e.done ? "go" : ""}"
              ?disabled=${this.answering}
              @click=${() => this.answerRoles(e.message, e.done ?? "")}
            >
              ${e.label}
            </button>`)}
          ${l(e, "battery_roles")}
        </div></span
      >
    </div>`;
	}
	async answerRoles(e, t) {
		this.answering = !0, this.notice = "";
		try {
			await this.hass?.callWS(e), this.rolesNotice = t;
		} catch {
			this.notice = this.t("error.action");
		}
		this.answering = !1;
	}
	renderDaySurplus(e, t) {
		let n = this.state, r = n.config.rules, i = ga(n), a = i?.batteries?.[t.id], o = _a(this.hass, t), s = o === "ok" || o === "need_ref", c = t.day_surplus !== !1, u = (t) => v(e.lang, t ?? 0, 1), d = {
			tab: "settings",
			section: "rules",
			id: "day_surplus"
		}, f = {
			tab: "devices",
			section: "battery",
			id: t.id,
			sub: "intruders"
		}, p;
		return p = s ? a && (a.state === "no_limit" || a.state === "unit" || a.state === "flash") ? e(`battery.surplus.${a.state}`) : r.day_surplus ? a?.state === "learning" ? e("battery.surplus.learning") : a?.state === "need_ref" || o === "need_ref" ? e("battery.surplus.need_ref") : a?.state === "team_wait" ? e("battery.surplus.team_wait") : a?.state === "capped" ? e("battery.surplus.capped", {
			kw: u(a.cap_kw),
			time: N(i?.pv_end)
		}) : a?.state === "would" ? e("battery.surplus.would", {
			kw: u(a.cap_kw),
			time: N(i?.pv_end)
		}) : a?.state === "unavailable" || a?.state === "unknown" ? e(`battery.surplus.${a.state}`) : a?.state === "not_tested" || n.control?.ready[t.id] !== "ready" ? e("battery.surplus.not_tested") : e(c ? "battery.surplus.takes_part" : "battery.surplus.left_out") : e("battery.surplus.rule_off") : e(`battery.surplus.${o}`), D`<div class="control-row" data-tipped>
        <span class="control-text">
          <b id="day-surplus-${t.id}">${e("battery.surplus.label")}</b>
          <small>${p}</small>
          ${!r.day_surplus && s ? D`<a class="mini-btn go" href=${E(this.prefix, d)} @click=${C(d)}>${e("battery.surplus.rule_go")}</a>` : j}
          ${r.day_surplus && a?.state === "automation" ? D`<a class="mini-btn go" href=${E(this.prefix, f)} @click=${this.jumpToIntruders(f)}
                >${e("battery.surplus.intruders_go")}</a
              >` : j}
        </span>
        ${l(e, "f_battery_day_surplus")}
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(c && s)}
          aria-labelledby="day-surplus-${t.id}"
          ?disabled=${!s}
          @click=${() => I(this, { batteries: { [t.id]: { day_surplus: !c } } })}
        ></button>
      </div>
      ${va(this.hass, t) ? this.renderLimitRef(e, t) : j}`;
	}
	renderLimitRef(e, t) {
		let n = this.state.config, r = t.limit_ref_w ?? null, i = P(n, `batteries[${t.id}].limit_ref_w`), a = r == null;
		return D`<div class="field ref-field" data-tipped>
      <div class="field-label">
        <span id="limit-ref-${t.id}">${e("battery.limit_ref.label")}</span> ${l(e, "f_battery_limit_ref")}
        ${r == null ? j : S(e, i)}
      </div>
      <div class="field-row">
        <span class="unit-input">
          <input
            class="input"
            type="number"
            inputmode="numeric"
            min="100"
            max="100000"
            step="10"
            aria-labelledby="limit-ref-${t.id}"
            .value=${r == null ? "" : String(Math.round(r))}
            placeholder=${e("battery.limit_ref.placeholder")}
            @change=${(e) => {
			let n = e.target, i = Number.parseFloat(n.value.replace(",", ".")), a = Number.isFinite(i) && i >= 100 && i <= 1e5;
			if (n.value.trim() && !a) {
				n.value = r == null ? "" : String(Math.round(r));
				return;
			}
			I(this, { batteries: { [t.id]: { limit_ref_w: a ? Math.round(i) : null } } });
		}}
          />
          <span class="unit">W</span>
        </span>
        <button
          type="button"
          class="mini-btn ${a ? "go" : ""}"
          aria-pressed=${String(a)}
          @click=${() => {
			a || I(this, { batteries: { [t.id]: { limit_ref_w: null } } });
		}}
        >
          ${e("battery.limit_ref.learn")}
        </button>
      </div>
      <p class="field-hint">
        ${r == null ? e("battery.limit_ref.learning") : i?.source === "learned" ? e("battery.limit_ref.learned", { value: v(e.lang, r, 0) }) : e("battery.limit_ref.set", { value: v(e.lang, r, 0) })}
      </p>
    </div>`;
	}
	jumpToIntruders(e) {
		let t = C(e, { replace: !0 });
		return (e) => {
			t(e), e.defaultPrevented && (this.revealed = "", ve(this.renderRoot, "intruders"));
		};
	}
	renderPower(e, t) {
		return this.fields(t, "power");
	}
	fields(e, t) {
		return D`<joe-battery-fields
      .hass=${this.hass}
      .t=${this.t}
      .config=${this.state?.config}
      .battery=${e}
      .floor=${this.state?.floors?.[e.id]}
      show=${t}
    ></joe-battery-fields>`;
	}
	renderIntruders(e, t) {
		let n = this.state;
		return D`<joe-battery-automations
      bare
      .hass=${this.hass}
      .t=${e}
      batteries=${JSON.stringify(n.config.batteries)}
      mode=${n.mode}
      .ready=${n.control?.ready ?? {}}
      batteryId=${t.id}
      .items=${this.automations}
    ></joe-battery-automations>`;
	}
	renderRemove(e, t) {
		return D`<div class="remove">
      <p class="remove-text">${e("battery.page.remove.text")}</p>
      ${this.removing ? D`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("battery.page.remove.confirm", { name: t.name })}</span></div>
            <div class="actions">
              <button type="button" class="btn btn-danger" ?disabled=${this.saving} @click=${() => this.leaveOut(t)}>
                ${e("battery.page.remove.go")}
              </button>
              <button type="button" class="btn btn-ghost" @click=${() => this.removing = !1}>${e("common.cancel")}</button>
            </div>` : D`<div class="actions">
            <button type="button" class="btn btn-secondary" @click=${() => this.removing = !0}>
              <ha-icon icon="mdi:eye-off-outline"></ha-icon>${e("review.ignore")}
            </button>
          </div>`}
    </div>`;
	}
	async leaveOut(e) {
		let t = this.state.config;
		this.saving = !0;
		let n = await I(this, {
			batteries: { [e.id]: null },
			answers: { ignored: Ye(t, `battery:${e.id}`, !0) }
		});
		this.saving = !1, n && (this.removing = !1, x(this, {
			tab: "devices",
			section: "battery"
		}, { replace: !0 }));
	}
	draftOf(e) {
		let t = es(e), n = $o.get(e.id);
		if (!n) return t;
		let r = { ...t };
		for (let e of Qo) ts(n.base[e], n.draft[e]) || (r[e] = n.draft[e]);
		return r;
	}
	controlChanges(e, t) {
		let n = {};
		for (let r of Qo) ts(e[r], t[r]) || (n[r] = t[r]);
		return n;
	}
	dirty(e, t) {
		return Object.keys(this.controlChanges(e, t)).length > 0;
	}
	renderControl(e, t, n) {
		let r = this.draftOf(t), i = this.dirty(t, r), a = {
			tab: "devices",
			section: "battery",
			id: t.id
		};
		return D`<joe-sheet wide label=${e("devices.setup")} closeLabel=${e("common.close")} @joe-close=${() => we(this, a)}>
      <div data-tipped>
        <div class="sheet-title">${y(e("battery.control.title", { name: t.name }), "h2", l(e, "control_choice"))}</div>
        <p class="sheet-text">${e("battery.control.lead")}</p>
        <div class="field">
          <joe-battery-control
          .hass=${this.hass}
          .t=${e}
          .battery=${t}
          .found=${n}
          .profiles=${this.info?.profiles}
          .value=${r}
          .dirty=${i}
          .probes=${this.state?.probes?.[t.id]}
          .probeRunning=${this.state?.control?.probe_running ?? null}
          .busy=${!!this.state?.control?.testing}
          @joe-control-change=${(e) => {
			$o.set(t.id, {
				base: es(t),
				draft: rr(t, e.detail, n)
			}), this.requestUpdate();
		}}
        ></joe-battery-control>
        </div>
      </div>
      <div class="steer-bar" data-notip role="region" aria-label=${e("devices.setup")}>
        ${i ? D`<span class="unsaved" role="status">${e("battery.control.unsaved")}</span>` : j}
        <button type="button" class="btn btn-primary" ?disabled=${this.saving || !i} @click=${() => this.saveControl(t, a)}>
          ${e("common.save")}
        </button>
        <button
          type="button"
          class="btn btn-ghost"
          @click=${() => {
			$o.delete(t.id), we(this, a);
		}}
        >
          ${e("common.cancel")}
        </button>
      </div>
    </joe-sheet>`;
	}
	async saveControl(e, t) {
		let n = this.controlChanges(e, this.draftOf(e));
		if (Object.keys(n).length) {
			this.saving = !0;
			let t = await I(this, { batteries: { [e.id]: n } });
			if (this.saving = !1, !t) return;
		}
		$o.delete(e.id), we(this, t);
	}
};
d([b({ attribute: !1 })], os.prototype, "entry", void 0), d([b({ attribute: !1 })], os.prototype, "sub", void 0), d([T()], os.prototype, "confirm", void 0), d([T()], os.prototype, "removing", void 0), d([T()], os.prototype, "saving", void 0), d([T()], os.prototype, "notice", void 0), d([T()], os.prototype, "answering", void 0), d([T()], os.prototype, "rolesNotice", void 0), d([T()], os.prototype, "automations", void 0), u("joe-battery-device", os);
//#endregion
//#region src/pages/devices/battery.ts
var ss = "together", cs = [
	"reserve_soc",
	"max_target_soc",
	"evening_min_soc",
	"balance_days",
	"discharge_in_window",
	"converter_losses",
	"day_surplus",
	"transfer_guard"
], ls = class extends q {
	constructor(...e) {
		super(...e), this.busy = "", this.revealed = "";
	}
	static {
		this.styles = [
			k,
			K,
			io,
			w`
      :host {
        display: block;
      }
      .wrap {
        max-width: 1100px;
        margin: 0 auto;
      }
      .display {
        font-size: clamp(30px, 4vw, 44px);
      }
      .card {
        padding: 18px 20px;
        margin-top: 14px;
      }
      .head {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .head .eyebrow {
        flex: 1;
        min-width: 0;
      }
      .card-lead {
        margin: 8px 0 0;
        color: var(--joe-ink-2);
      }
      .mirrors {
        display: grid;
        margin-top: 8px;
      }
      .empty {
        margin: 10px 0 0;
        color: var(--joe-ink-2);
      }
      .actions {
        margin-top: 16px;
      }
      .found {
        list-style: none;
        margin: 10px 0 0;
        padding: 0;
        display: grid;
      }
      .found li {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px 12px;
        padding: 10px 0;
        border-top: 1px solid var(--joe-line);
      }
      .found li:first-child {
        border-top: 0;
      }
      .found .what {
        flex: 1 1 180px;
        min-width: 0;
        display: grid;
      }
      .found b {
        font-weight: 600;
        overflow-wrap: anywhere;
      }
      .found small {
        color: var(--joe-muted);
        font-size: 13px;
      }
      .found .row-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      a.mini-btn {
        text-decoration: none;
      }
      .dcard-suggest {
        flex: 1 1 160px;
        color: var(--joe-ink-2);
        font-size: 13.5px;
      }
      joe-control-status {
        display: block;
      }
      .evcc {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        margin-top: 14px;
      }
      .evcc .conflicts {
        flex: 1;
        min-width: 0;
        display: grid;
        gap: 8px;
      }
      .evcc .note {
        margin: 0;
      }
      .dcards {
        margin-top: 14px;
      }
      .team-question {
        margin: 12px 0 8px;
        font-weight: 600;
      }
      .team-choice {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
      }
      .team-choice .seg {
        flex-wrap: wrap;
        border-radius: 22px;
      }
      .team-now {
        margin: 12px 0 0;
        color: var(--joe-ink-2);
      }
      .team-notes {
        display: grid;
        gap: 8px;
        margin-top: 12px;
      }
      .team-orders {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
        gap: 14px;
        margin-top: 16px;
      }
      .team-orders .order {
        min-width: 0;
        margin-top: 6px;
      }
      .team-label {
        display: flex;
        align-items: center;
        gap: 6px;
        font-weight: 600;
      }
      .team-list {
        list-style: none;
        margin: 16px 0 0;
        padding: 0;
        display: grid;
      }
      .team-list li {
        display: grid;
        gap: 8px;
        padding: 12px 0;
        border-top: 1px solid var(--joe-line);
      }
      .team-line {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
      }
      .team-line {
        flex-wrap: nowrap;
        align-items: flex-start;
      }
      .team-line .what {
        flex: 1 1 0;
        min-width: 0;
        display: grid;
        gap: 2px;
      }
      .team-line .chip {
        margin-left: 4px;
        vertical-align: middle;
      }
      .team-ctl {
        flex: none;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .team-line small {
        color: var(--joe-muted);
        font-size: 13px;
      }
      select.team-group {
        width: auto;
        max-width: min(240px, 48vw);
        font-size: 14px;
      }
      .note.amber {
        background: color-mix(in srgb, var(--joe-amber, #fea707) 16%, var(--joe-surface));
      }
      .note.amber > ha-icon {
        color: var(--joe-amber, #fea707);
      }
      details.team-style {
        margin-top: 16px;
        border-radius: 12px;
        background: var(--joe-surface-2);
      }
      details.team-style summary {
        min-height: 44px;
        display: flex;
        align-items: center;
        padding: 0 12px;
        font-weight: 600;
        cursor: pointer;
      }
      .team-style-body {
        display: grid;
        gap: 10px;
        padding: 0 12px 12px;
      }
      .team-style-body > p {
        margin: 0;
        color: var(--joe-ink-2);
        font-size: 14px;
      }
      .team-options {
        display: grid;
        gap: 8px;
      }
      .team-option {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .team-option .way {
        flex: 1 1 0;
        min-width: 0;
        display: grid;
        gap: 2px;
        min-height: 44px;
        padding: 10px 12px;
        border-radius: 12px;
        border: 2px solid var(--joe-line);
        background: var(--joe-surface);
        color: inherit;
        font: inherit;
        text-align: left;
        cursor: pointer;
        transition:
          border-color 120ms,
          transform 120ms;
      }
      .team-option .way:hover {
        border-color: color-mix(in srgb, var(--joe-amber, #fea707) 55%, var(--joe-line));
      }
      .team-option .way:active {
        transform: scale(0.98);
      }
      .team-option .way[aria-checked="true"] {
        border-color: var(--joe-amber, #fea707);
        background: color-mix(in srgb, var(--joe-amber, #fea707) 12%, var(--joe-surface));
      }
      .team-option .way small {
        color: var(--joe-muted);
        font-size: 13px;
        line-height: 1.4;
      }
    `
		];
	}
	updated(e) {
		super.updated(e), e.has("device") && this.device !== ss && (this.revealed = ""), this.device === ss && this.revealed !== ss && ve(this.renderRoot, ss) && (this.revealed = ss);
	}
	render() {
		let e = this.t, t = this.state;
		if (!e || !t) return j;
		let n = this.device === ss ? void 0 : pt(this.devices, "battery", this.device);
		if (n) return D`<joe-battery-device
        .t=${e}
        .hass=${this.hass}
        .state=${t}
        .prefix=${this.prefix}
        .route=${this.route}
        .discovery=${this.discovery}
        .info=${this.info}
        .checks=${this.checks}
        .climateFound=${this.climateFound}
        .devices=${this.devices}
        .entry=${n}
        .sub=${this.sub}
      ></joe-battery-device>`;
		let r = t.config.batteries;
		return D`<div class="wrap">
      ${ca(e, e("nav.devices.battery"), e("battery.page.lead"), r.length > 0)}
      ${this.device !== void 0 && this.device !== ss ? $i(e) : j}
      <joe-control-status .t=${e} .hass=${this.hass} .state=${t}></joe-control-status>
      ${this.renderEvcc(e)}
      ${r.length ? sa(this.ctx, this.devices, "battery", (t) => this.cardChange(e, t)) : D`<p class="empty">${e("devices.batteries.none")}</p>`}
      <div class="actions">${la(e, this.prefix, "battery", e("battery.page.add"))}</div>
      ${r.length >= 2 ? this.renderTeam(e, t.config) : j}
      ${r.length ? this.renderRules(e) : j}
      ${r.length ? D`<div data-anchor="automations">
            <joe-battery-automations
              .hass=${this.hass}
              .t=${e}
              batteries=${JSON.stringify(r)}
              mode=${t.mode}
              .ready=${t.control?.ready ?? {}}
            ></joe-battery-automations>
          </div>` : j}
      ${this.renderFound(e)}
    </div>`;
	}
	cardChange(e, t) {
		let n = t.battery;
		if (!n) return {};
		let r = this.discovery?.batteries.find((e) => e.id === n.id), i = ii(e, this.hass, this.state, t), a = rs(e, n, this.state?.control), o = as(n.id);
		return {
			state: [i, a].filter(Boolean).join(" · "),
			quick: is(n, r) ? D`<span class="dcard-suggest">${e("battery.page.suggested")}</span>
            <a class="mini-btn go" href=${E(this.prefix, o)} @click=${C(o, { sheet: !0 })}>${e("devices.setup")}</a>` : void 0
		};
	}
	renderTeam(e, t) {
		let n = pi(this.state), r = t.rules.battery_team ?? null, i = r ?? "sequence", a = (e) => {
			e !== r && I(this, { rules: { battery_team: e } });
		}, o = i === "sequence" ? Ti(e, n) : null, s = i === "sequence" ? Di(e, n) : null;
		return D`<section class="card" data-tipped data-anchor=${ss}>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:battery-sync-outline"></ha-icon>${e("team.title")}</div>
        ${l(e, "team")}
      </div>
      <p class="team-question" id="team-question">${e("team.question")}</p>
      <div class="team-choice" data-tipped>
        <div class="seg" role="group" aria-labelledby="team-question">
          ${["sequence", "together"].map((t) => D`<button type="button" aria-pressed=${String(i === t)} @click=${() => a(t)}>
                ${e(`team.mode.${t}`)}
              </button>`)}
        </div>
        ${l(e, "team_mode")}
        ${r ? S(e, P(t, "rules.battery_team")) : D`<span class="chip">${e("team.mode.default")}</span>`}
      </div>
      ${n ? D`<p class="team-now">${Ai(e, n)}</p>` : j}
      <div class="team-notes">
        ${o ? D`<div class="note" role="status" data-tipped>
              <ha-icon icon="mdi:weather-sunny"></ha-icon>
              <span>${o} ${l(e, "team_reason")}</span>
            </div>` : j}
        ${s ? D`<div class="note" role="status" data-tipped>
              <ha-icon icon="mdi:history"></ha-icon>
              <span>${s} ${l(e, "team_review")}</span>
            </div>` : j}
        ${!r && n && Object.keys(n.groups ?? {}).length >= 2 ? D`<div class="note" role="status" data-tipped>
              <ha-icon icon="mdi:shield-check-outline"></ha-icon>
              <span>${e("team.default")} ${l(e, "team_default")}</span>
            </div>` : j}
        ${n?.group_question ? this.renderGroupQuestion(e, t) : j}
        ${this.renderAutomationsNote(e, this.state?.control?.automations ?? [])}
        ${this.renderGuard(e, t)}
      </div>
      ${i === "sequence" ? D`<div class="team-orders">
              ${this.orderList(e, t, "team_charge_order")} ${this.orderList(e, t, "team_discharge_order")}
            </div>
            ${this.renderStyle(e, t)}` : j}
      <ul class="team-list">
        ${t.batteries.map((n) => this.teamBattery(e, t, n))}
      </ul>
    </section>`;
	}
	renderStyle(e, t) {
		let n = pi(this.state), r = t.rules.team_style ?? "auto", i = (e) => {
			e !== r && I(this, { rules: { team_style: e === "auto" ? null : e } });
		}, a = t.rules.team_early ?? null;
		return D`<details class="team-style" ?open=${r !== "auto"} data-notip>
      <summary>${e("team.style.title")}</summary>
      <div class="team-style-body">
        <p>${e("team.style.intro")}</p>
        <div class="team-options" role="radiogroup" aria-label=${e("team.style.title")}>
          ${[
			"auto",
			"strict",
			"base"
		].map((t) => D`<div class="team-option" data-tipped>
              <button type="button" class="way" role="radio" aria-checked=${String(r === t)} @click=${() => i(t)}>
                <b>${e(`team.style.${t}`)}</b>
                <small>${e(`team.style.${t}.text`)}</small>
              </button>
              ${l(e, `team_style_${t}`)}
            </div>`)}
        </div>
        ${r === "base" ? D`<div class="note amber" role="status" data-tipped>
              <ha-icon icon="mdi:alert-outline"></ha-icon>
              <span>${e("team.style.base.warn")} ${l(e, "team_base_warn")}</span>
            </div>` : j}
        ${r === "base" && n?.base_problem ? D`<div class="note warn" role="status" data-tipped>
              <ha-icon icon="mdi:information-outline"></ha-icon>
              <span>${e("team.style.base.no_lever")} ${l(e, "team_base_lever")}</span>
            </div>` : j}
        ${r === "strict" ? j : D`<div class="team-line" data-tipped>
              <span class="what">
                <b id="team-early">${e("team.early")}</b>
                <small>
                  ${Oi(e, n)}
                  ${a == null ? D`<span class="chip">${e("team.early.unanswered")}</span>` : S(e, P(t, "rules.team_early"))}
                </small>
              </span>
              <span class="team-ctl">
                ${l(e, "team_early")}
                <button
                  type="button"
                  class="switch"
                  role="switch"
                  aria-checked=${String(a === !0)}
                  aria-labelledby="team-early"
                  @click=${() => I(this, { rules: { team_early: a !== !0 } })}
                ></button>
              </span>
            </div>`}
      </div>
    </details>`;
	}
	renderGuard(e, t) {
		let n = Ni(this.state);
		if (!n) return j;
		let r = n.state === "on" && n.last?.result === "alarm" && !n.last.dry;
		return D`<div class="note guard ${r ? "warn" : ""}" role="status" data-tipped data-anchor="guard">
      <ha-icon icon="mdi:shield-sync-outline"></ha-icon>
      <span><b>${e("guard.title")}</b> ${l(e, "guard")} · ${Li(e, n, t)}</span>
    </div>`;
	}
	renderAutomationsNote(e, t) {
		return t.length ? D`<div class="note warn" role="status">
      <ha-icon icon="mdi:robot-confused-outline"></ha-icon>
      <span>
        ${e("team.automations", { names: ji(t) })}
        <span class="note-actions">
          <button type="button" class="mini-btn go" @click=${() => ve(this.renderRoot, "automations")}>
            ${e("team.automations.go")}
          </button>
        </span>
      </span>
    </div>` : j;
	}
	renderGroupQuestion(e, t) {
		let n = pi(this.state);
		return D`<div class="note" role="status" data-tipped>
      <ha-icon icon="mdi:help-circle-outline"></ha-icon>
      <span>
        <b>${e("team.groups.question")}</b> ${l(e, "team_group")}
        ${e("team.groups.question.text", { names: Vi(t, n) })}
        <span class="note-actions">
          <button type="button" class="mini-btn go" @click=${() => I(this, Bi(t, n))}>
            ${e("team.groups.confirm")}
          </button>
          ${l(e, "team_groups_confirm")}
        </span>
      </span>
    </div>`;
	}
	orderList(e, t, n) {
		let r = _i(t, pi(this.state), mi(t, n)), i = (e, t) => {
			let i = [...r];
			[i[e], i[e + t]] = [i[e + t], i[e]], I(this, { rules: { [n]: i.flat().map((e) => e.id) } });
		}, a = (e) => D`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d=${e ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"} />
      </svg>`, o = n === "team_charge_order" ? "team_charge_order" : "team_discharge_order";
		return D`<div data-tipped>
      <div class="team-label">${e(`team.${o}`)} ${l(e, o)}</div>
      <div class="order">
        ${r.map((t, n) => D`<div>
            <span>${n + 1}. ${t.map((e) => e.name).join(" + ")}</span>
            <button
              type="button"
              aria-label=${e("rule.priority.up", { name: t.map((e) => e.name).join(" + ") })}
              ?disabled=${n === 0}
              @click=${() => i(n, -1)}
            >
              ${a(!0)}
            </button>
            <button
              type="button"
              aria-label=${e("rule.priority.down", { name: t.map((e) => e.name).join(" + ") })}
              ?disabled=${n === r.length - 1}
              @click=${() => i(n, 1)}
            >
              ${a(!1)}
            </button>
          </div>`)}
      </div>
    </div>`;
	}
	teamBattery(e, t, n) {
		let r = pi(this.state), i = r?.batteries[n.id], a = hi(n, r), o = n.cutoff_soc ?? null, s = (t) => v(e.lang, t, 1), c = `team-self-${n.id}`;
		return D`<li>
      <div class="team-line" data-tipped>
        <span class="what">
          <b id=${c}>${n.name}</b>
          <small>
            ${e("team.self_regulating")}
            ${n.self_regulating == null && r ? D`<span class="chip">${e("team.proposed")}</span>` : S(e, P(t, `batteries[${n.id}].self_regulating`))}
          </small>
        </span>
        <span class="team-ctl">
          ${l(e, "team_self_regulating")}
          <button
            type="button"
            class="switch"
            role="switch"
            aria-checked=${String(a)}
            aria-labelledby=${c}
            @click=${() => I(this, { batteries: { [n.id]: { self_regulating: !a } } })}
          ></button>
        </span>
      </div>
      ${a ? this.groupLine(e, t, n) : j}
      ${a ? D`<div class="team-line" data-tipped>
            <span class="what">
              <small>
                ${o == null ? e("team.cutoff.unknown", { value: s(i?.floor ?? 10) }) : e("team.cutoff.known", { value: s(o) })}
                ${o == null ? j : S(e, P(t, `batteries[${n.id}].cutoff_soc`))}
              </small>
            </span>
            <span class="team-ctl">${l(e, "team_cutoff")}</span>
          </div>` : j}
    </li>`;
	}
	groupLine(e, t, n) {
		let r = pi(this.state), i = gi(n, r), a = t.batteries.filter((e) => e.id !== n.id && hi(e, r)), o = `own:${n.id}`, s = a.find((e) => gi(e, r) === i), c = s ? gi(s, r) : o, u = `team-group-${n.id}`, d = n.control_group == null && r?.batteries[n.id]?.group_sure === !1, f = (e) => {
			e !== c && I(this, { batteries: { [n.id]: { control_group: e } } });
		};
		return D`<div class="team-line" data-tipped>
      <span class="what">
        <small id=${u}>
          ${e("team.group")}
          ${n.control_group == null && r ? D`<span class="chip ${d ? "warn" : ""}">${e(d ? "team.group.check" : "team.proposed")}</span>` : S(e, P(t, `batteries[${n.id}].control_group`))}
        </small>
      </span>
      <span class="team-ctl">
        ${l(e, "team_group")}
        <select
          class="input team-group"
          aria-labelledby=${u}
          .value=${c}
          @change=${(e) => f(e.target.value)}
        >
          <option value=${o} ?selected=${c === o}>${e("team.group.own")}</option>
          ${a.map((t) => {
			let n = gi(t, r);
			return D`<option value=${n} ?selected=${c === n && s?.id === t.id}>
              ${e("team.group.with", { name: t.name })}
            </option>`;
		})}
        </select>
      </span>
    </div>`;
	}
	renderRules(e) {
		let t = this.state.config, n = ga(this.state);
		return D`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:tune-vertical"></ha-icon>${e("battery.page.rules")}</div>
        ${l(e, "battery_rules")}
      </div>
      <div class="mirrors">
        ${cs.map((r) => {
			let i = {
				tab: "settings",
				section: "rules",
				id: r
			};
			return Pa(e, this.prefix, {
				label: e(`rule.${r}`),
				value: Wa(e, t, r),
				source: P(t, `rules.${r}`),
				hint: r === "day_surplus" && n ? ba(e, n) : void 0,
				to: i
			});
		})}
      </div>
    </section>`;
	}
	renderEvcc(e) {
		let t = Ta(e, ga(this.state));
		return t === j ? j : D`<div class="evcc" data-tipped>${t} ${l(e, "surplus_evcc")}</div>`;
	}
	renderFound(e) {
		let t = this.state.config, n = gt(t, this.discovery).filter((e) => e.kind === "battery" && e.battery), r = _t(t, this.discovery), i = this.discovery?.battery_notes ?? [];
		if (!n.length && !r.length && !i.length) return j;
		let a = (t, n, r) => D`<li>
        <span class="what">
          <b>${t.name}</b>
          <small>${e(n ? "devices.add.battery.ignored" : "battery.page.found.new")}</small>
        </span>
        <span class="row-actions">
          <button type="button" class="mini-btn go" ?disabled=${!!this.busy} @click=${() => this.use(t, r)}>
            ${e(n ? "devices.add.battery.use" : "devices.found.use")}
          </button>
          ${n ? j : D`<button type="button" class="mini-btn quiet" ?disabled=${!!this.busy} @click=${() => this.ignore(r)}>
                ${e("devices.found.ignore")}
              </button>`}
        </span>
      </li>`;
		return D`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:home-battery-outline"></ha-icon>${e("battery.page.found")}</div>
        ${l(e, "battery_found")}
      </div>
      ${n.length || r.length ? D`<ul class="found">
            ${n.map((e) => a(e.battery, !1, e.key))} ${r.map((e) => a(e, !0, `battery:${e.id}`))}
          </ul>` : j}
      ${Fn(e, i)}
    </section>`;
	}
	async use(e, t) {
		this.busy = t;
		let n = await Zr(this, this.state.config, e);
		this.busy = "", n && x(this, {
			tab: "devices",
			section: "battery",
			id: n
		});
	}
	async ignore(e) {
		this.busy = e, await $r(this, this.state.config, e), this.busy = "";
	}
};
d([b({ attribute: !1 })], ls.prototype, "device", void 0), d([b({ attribute: !1 })], ls.prototype, "sub", void 0), d([T()], ls.prototype, "busy", void 0), u("joe-battery-group", ls);
//#endregion
//#region src/components/car-need.ts
var us = class extends O {
	constructor(...e) {
		super(...e), this.roundTrip = !0, this.failed = !1;
	}
	static {
		this.styles = [k, w`
      :host {
        display: block;
      }
      p {
        margin: 6px 0 0;
        font-size: 14px;
        line-height: 1.45;
        color: var(--joe-ink-2);
      }
      p.result {
        color: var(--joe-ink);
        font-weight: 600;
      }
      ul {
        list-style: none;
        margin: 8px 0 0;
        padding: 0;
        display: grid;
        gap: 4px;
      }
      li {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 4px 10px;
        padding: 6px 10px;
        border-radius: 9px;
        background: var(--joe-surface-2);
        font-size: 13.5px;
      }
      li .where {
        flex: 1 1 160px;
        min-width: 0;
        overflow-wrap: break-word;
      }
      li .km {
        margin-left: auto;
      }
      li .km {
        font-variant-numeric: tabular-nums;
        color: var(--joe-ink-2);
      }
      .mini-btn.edit {
        justify-content: center;
        padding: 6px 10px;
      }
      @media (pointer: coarse) {
        .mini-btn.edit {
          min-width: 44px;
        }
      }
      li .unknown {
        color: var(--joe-warn, var(--joe-crit));
      }
      form {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      form .input {
        width: 90px;
        min-height: 32px;
        padding: 4px 8px;
      }
      .head {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 8px;
        font-size: 13px;
        font-weight: 600;
        color: var(--joe-muted);
      }
    `];
	}
	render() {
		let { t: e, action: t } = this, n = t?.need;
		if (!e || !t || !n) return j;
		let r = (t, n = 0) => v(e.lang, t ?? 0, n);
		if (!n.known) return D`<p>${e(n.soc != null && !n.capacity_kwh ? "need.unknown_capacity" : "need.unknown")}</p>`;
		let i = [];
		i.push(D`<p>
        ${n.trips_km > 0 && n.trips_km >= (n.usual_km ?? 0) ? e("need.trips", {
			km: r(n.trips_km),
			count: n.trips.length,
			reserve: r(n.reserve_km),
			total: r(n.needed_km)
		}) : n.usual_km ? e("need.usual", {
			km: r(n.usual_km),
			reserve: r(n.reserve_km),
			total: r(n.needed_km)
		}) : e("need.reserve_only", { reserve: r(n.reserve_km) })}
        ${n.unknown_trips ? e("need.unknown_trips", { count: n.unknown_trips }) : ""}
      </p>`), i.push(D`<p>
        ${e(`need.consumption.${n.consumption_source}`, {
			value: r(n.consumption, 1),
			temp: n.temp == null ? "–" : r(n.temp)
		})}${n.rain ? ` ${e("need.rain")}` : ""}
      </p>`), n.target_unit === "%" ? i.push(D`<p>${e("need.has_soc", {
			soc: r(n.soc),
			km: r(n.have_km),
			target: r(n.target)
		})}</p>`) : i.push(D`<p>${e("need.has_range", { km: r(n.have_km) })}</p>`);
		let a = n.missing_kwh ?? 0;
		return i.push(D`<p class="result">
        ${a >= .2 ? t.run && !t.manual ? e("need.charges", {
			kwh: r(a, 1),
			start: N(t.start)
		}) : e("need.missing", { kwh: r(a, 1) }) : e("need.enough")}
      </p>`), n.fits === !1 && i.push(D`<p>${e("need.too_far")}</p>`), D`${i} ${n.trips.length ? this.renderTrips(e, n.trips) : j}`;
	}
	renderTrips(e, t) {
		return D`<div data-tipped>
      <div class="head">${e("need.trips.title")} ${l(e, "need_trips")}</div>
      <ul>
        ${t.map((t) => D`<li>
            <span>${t.start.includes("T") ? N(t.start) : e("need.all_day")}</span>
            <span class="where">${t.location}</span>
            ${this.editing === t.location ? this.renderEdit(e, t) : D`<span class=${t.km == null ? "km unknown" : "km"}>
                    ${t.km == null ? e("need.km_unknown") : e(`need.km.${t.source ?? "zone"}`, { km: v(e.lang, t.km, 0) })}
                  </span>
                  <button
                    type="button"
                    class="mini-btn quiet edit"
                    aria-label=${e("need.km_edit", { place: t.location })}
                    @click=${() => this.editing = t.location}
                  >
                    <ha-icon icon="mdi:pencil-outline"></ha-icon>
                  </button>`}
          </li>`)}
      </ul>
      ${this.failed ? D`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("error.action")}</div>` : j}
    </div>`;
	}
	renderEdit(e, t) {
		let n = t.km == null ? "" : String(Math.round(t.km / (this.roundTrip ? 2 : 1)));
		return D`<form
      @submit=${(e) => {
			e.preventDefault();
			let n = e.target.querySelector("input"), r = Number.parseFloat(n.value.replace(",", "."));
			this.save(t.location, Number.isFinite(r) && r >= 0 ? r : null);
		}}
    >
      <span class="unit-input">
        <input class="input" type="number" min="0" max="3000" step="1" .value=${n} aria-label=${e("need.km_one_way")} />
        <span class="unit">km</span>
      </span>
      <button type="submit" class="mini-btn go">${e("common.save")}</button>
      <button type="button" class="mini-btn quiet" @click=${() => this.save(t.location, null)}>${e("need.km_reset")}</button>
    </form>`;
	}
	async save(e, t) {
		try {
			await this.hass?.callWS({
				type: "energy_joe/places/set",
				location: e,
				km: t
			}), this.editing = void 0, this.failed = !1;
		} catch {
			this.failed = !0;
		}
	}
};
d([b({ attribute: !1 })], us.prototype, "hass", void 0), d([b({ attribute: !1 })], us.prototype, "t", void 0), d([b({ attribute: !1 })], us.prototype, "action", void 0), d([b({ attribute: !1 })], us.prototype, "roundTrip", void 0), d([T()], us.prototype, "editing", void 0), d([T()], us.prototype, "failed", void 0), u("joe-car-need", us);
//#endregion
//#region src/pages/devices/car-device.ts
function ds(e) {
	return D`${e.split(/\*\*(.+?)\*\*/).map((e, t) => t % 2 ? D`<strong>${e}</strong>` : e)}`;
}
var fs = [
	"soc",
	"range",
	"odometer",
	"plugged",
	"location",
	"outside_temp"
], ps = class extends q {
	constructor(...e) {
		super(...e), this.revealed = "";
	}
	static {
		this.styles = [
			k,
			K,
			oo,
			Do,
			w`
      details.explain {
        margin: 0 0 14px;
        border-radius: 12px;
        background: var(--joe-surface-2);
      }
      details.explain summary {
        min-height: 44px;
        display: flex;
        align-items: center;
        padding: 0 12px;
        font-weight: 600;
        cursor: pointer;
      }
      .explain-body {
        padding: 0 14px 12px;
        line-height: 1.5;
      }
      .explain-body h4 {
        margin: 14px 0 4px;
        font-size: 14px;
      }
      .explain-body p,
      .explain-body ul,
      .explain-body ol {
        margin: 0 0 6px;
      }
      .explain-body ul,
      .explain-body ol {
        padding-left: 20px;
      }
      .explain-body li {
        margin: 2px 0;
      }
      .car-cal {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 4px;
        padding: 8px 10px;
        border-radius: 10px;
        background: var(--joe-surface-2);
      }
      .car-cal .grow {
        flex: 1 1 0;
        min-width: 0;
        display: grid;
      }
      .car-cal b {
        font-weight: 600;
        overflow-wrap: anywhere;
      }
      .car-cal small {
        color: var(--joe-muted);
        font-size: 12.5px;
      }
      .car-cal a.mini-btn {
        min-height: 44px;
        text-decoration: none;
      }
      ul.values {
        list-style: none;
        margin: 0 0 4px;
        padding: 0;
        display: grid;
        gap: 2px;
      }
      ul.values li {
        display: grid;
        grid-template-columns: minmax(0, 8em) minmax(0, 1fr);
        align-items: baseline;
        gap: 2px 10px;
        padding: 4px 0;
      }
      ul.values .label {
        color: var(--joe-ink-2);
        overflow-wrap: anywhere;
      }
      ul.values .value {
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
        gap: 2px 8px;
        min-width: 0;
      }
      ul.values b {
        font-weight: 700;
        overflow-wrap: anywhere;
      }
      .plugged {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px 10px;
        margin: 6px 0 0;
      }
      .plugged a {
        min-height: 44px;
        text-decoration: none;
      }
    `
		];
	}
	updated(e) {
		let t = this.sub === "calendars" || this.sub === "sources" ? this.sub : "", n = t ? `${this.entry?.id}/${t}` : "";
		(e.has("sub") || e.has("entry")) && (n ? this.revealed !== n && ve(this.renderRoot, t) && (this.revealed = n) : this.revealed = "");
	}
	render() {
		let { t: e, hass: t, state: n, entry: r } = this, i = r?.car;
		if (!e || !t || !n || !r || !i) return j;
		let a = ta(this.ctx, r), o = i.need, s = {
			hass: t,
			t: e,
			state: n,
			discovery: this.discovery,
			prefix: this.prefix
		};
		return oa(this.ctx, {
			...a,
			live: ni(e, t, n, i.id) || void 0,
			why: this.whereText(e, n, i),
			log: a.log ? {
				...a.log,
				filter: { group: "car" }
			} : void 0,
			now: D`${this.values(e, n, i)} ${this.plugged(e, n, i)}
        <joe-car-charge .hass=${t} .t=${e} .state=${n} .car=${i}></joe-car-charge>
        ${o.enabled ? D`${Eo(e("car.trips"))} ${this.trips(e, n, i)}` : j}`,
			steer: D`<joe-car-steer
        .hass=${s.hass}
        .t=${e}
        .state=${n}
        .discovery=${s.discovery}
        .prefix=${s.prefix}
        .car=${i}
        .section=${"need"}
      ></joe-car-steer>`,
			more: [{
				anchor: "calendars",
				title: e("devices.car.terms"),
				tip: "car_terms",
				body: D`${this.explain(e, i)}
            ${o.enabled ? this.calendarLine(e, n, i) : D`<p class="muted">${e("devices.car.terms_off")}</p>`}
            <joe-car-steer
              .hass=${t}
              .t=${e}
              .state=${n}
              .discovery=${this.discovery}
              .prefix=${this.prefix}
              .car=${i}
              .section=${"calendars"}
            ></joe-car-steer>`
			}, {
				anchor: "sources",
				title: e("car.sources"),
				tip: "car_sources",
				body: D`<joe-car-sources
            .hass=${t}
            .t=${e}
            .state=${n}
            .discovery=${this.discovery}
            .prefix=${this.prefix}
            .car=${i}
          ></joe-car-sources>`
			}],
			learned: ao([uo(e, n.config.learned, i)]),
			learnedArea: "car",
			tips: {
				steer: "car_steer",
				now: "car_now"
			},
			removeTitle: e("devices.page.delete"),
			remove: D`<joe-car-delete .t=${e} .config=${n.config} .car=${i} .leave=${{
				tab: "devices",
				section: "car"
			}}></joe-car-delete>`
		});
	}
	whereText(e, t, n) {
		let r = h(t, n.id);
		if (!r) return e(t.cars?.cars?.[n.id]?.plugged ? "car.plugged_elsewhere" : "car.not_plugged");
		let i = m(t, r.id)?.how ?? "home";
		return `${e("car.plugged_at", { point: r.name })} · ${e(`point.how.${i}`)}`;
	}
	values(e, t, n) {
		this.hass;
		let r = t.cars?.cars?.[n.id]?.values ?? {}, i = fs.filter((e) => r[e]);
		return i.length ? D`<ul class="values">
      ${i.map((t) => {
			let n = r[t];
			return D`<li>
          <span class="label">${e(`car.role.${t}`)}</span>
          <span class="value">
            <b>${this.valueText(e, t, n.entity)}</b>
            <span class="chip">${n.kind === "manual" ? e("car.source.chip_manual") : e("car.source.chip", { from: o(e, n) })}</span>
          </span>
        </li>`;
		})}
    </ul>` : D`<p class="muted">${e("car.values.none")}</p>`;
	}
	valueText(e, t, n) {
		let r = this.hass, i = r.states[n]?.state;
		return i === void 0 || i === "unavailable" || i === "unknown" ? e("car.value.unknown") : t === "plugged" ? e([
			"on",
			"true",
			"plugged",
			"connected"
		].includes(i.toLowerCase()) ? "car.value.plugged" : "car.value.unplugged") : t === "location" ? i === "home" ? e("car.value.home") : i === "not_home" ? e("car.value.away") : i : c(r, n, e.lang);
	}
	plugged(e, t, n) {
		let r = h(t, n.id);
		if (!r) return j;
		let i = {
			tab: "devices",
			section: "car",
			id: "point",
			sub: r.id
		};
		return D`<p class="plugged">
      <ha-icon icon="mdi:ev-station"></ha-icon>
      <span>${e("car.plugged_at", { point: r.name })}</span>
      <a class="mini-btn quiet" href=${E(this.prefix, i)} @click=${C(i)}>${e("car.open_point")}</a>
    </p>`;
	}
	trips(e, t, n) {
		let r = ge(t, n.id);
		if (!r) return D`<p class="muted">${e("car.trips.none")}</p>`;
		let i = r.point ? t.plan?.actions?.find((e) => e.id === r.point) : void 0, a = i?.need ? i : {
			id: n.id,
			name: n.name,
			kind: "switch",
			run: !1,
			manual: !1,
			reasons: [],
			start: "",
			end: "",
			power_kw: null,
			energy_kwh: 0,
			priority: 1,
			need: r
		};
		return D`<joe-car-need .hass=${this.hass} .t=${e} .action=${a} .roundTrip=${n.need.round_trip ?? !0}></joe-car-need>`;
	}
	explain(e, t) {
		let n = t.need, r = !!(n.calendars?.length || n.source === "mailbox" || n.source === "account");
		return D`<details class="explain" ?open=${!r} data-notip>
      <summary>${e("car.explain.title")}</summary>
      <div class="explain-body">
        <p>${ds(e("car.explain.why"))}</p>
        <h4>${e("car.explain.two")}</h4>
        <ul>
          <li>${ds(e("car.explain.car_cal", { name: t.name }))}</li>
          <li>${ds(e("car.explain.persons"))}</li>
        </ul>
        <h4>${e("car.explain.ways")}</h4>
        <ul>
          <li>${ds(e("car.explain.way.calendar"))}</li>
          <li>${ds(e("car.explain.way.mailbox"))}</li>
          <li>${ds(e("car.explain.way.account"))}</li>
        </ul>
        <h4>${e("car.explain.example.title")}</h4>
        <ol>
          <li>${ds(e("car.explain.example.1"))}</li>
          <li>${ds(e("car.explain.example.2", { name: t.name }))}</li>
          <li>${ds(e("car.explain.example.3", { name: t.name }))}</li>
          <li>${ds(e("car.explain.example.4"))}</li>
        </ol>
        <h4>${e("car.explain.rules")}</h4>
        <ul>
          <li>${ds(e("car.explain.rule.place"))}</li>
          <li>${ds(e("car.explain.rule.online"))}</li>
          <li>${ds(e("car.explain.rule.twice"))}</li>
          <li>${ds(e("car.explain.rule.none"))}</li>
        </ul>
      </div>
    </details>`;
	}
	calendarLine(e, t, n) {
		let r = n.need, i = r.source ?? "ha", a = "", o = "none", s = null, c = t.config.persons.filter((e) => e.calendars.length && (r.persons == null || r.persons.includes(e.id)));
		if (i === "ha" && (r.calendars?.length || c.length)) a = [...(r.calendars ?? []).map((e) => _(this.hass, e)), ...c.length ? [e("devices.car.of_persons", { names: c.map((e) => e.name).join(", ") })] : []].join(" · "), o = "ok";
		else if (i === "mailbox" && r.mailbox?.address) {
			let e = t.mailbox?.[n.id];
			a = r.mailbox.address, o = e?.state === "ok" ? "ok" : "warn", s = e?.checked ?? null;
		} else if (i === "account" && r.account?.address) {
			let e = t.accounts?.[n.id];
			a = r.account.address, o = e?.state === "ok" ? "ok" : "warn", s = e?.checked ?? null;
		}
		let u = _e(n.id, "calendars");
		return D`<div class="car-cal" data-tipped>
      <ha-icon icon="mdi:calendar-month-outline"></ha-icon>
      <span class="grow">
        ${o === "none" ? D`<b>${e("devices.car.no_calendar")}</b>` : D`<b>${a}</b>
              <small>
                ${e(o === "ok" ? "devices.car.calendar_ok" : "devices.car.calendar_problem")}
                ${s ? e("devices.car.checked", { when: new Date(s).toLocaleString(e.lang, {
			weekday: "short",
			hour: "2-digit",
			minute: "2-digit"
		}) }) : j}
              </small>`}
      </span>
      <a class="mini-btn ${o === "none" ? "go" : ""}" href=${E(this.prefix, u)} @click=${C(u, { replace: !0 })}>
        ${e(o === "none" ? "devices.car.connect" : "devices.car.change")}
      </a>
      ${l(e, "car_calendar_card")}
    </div>`;
	}
};
d([b({ attribute: !1 })], ps.prototype, "entry", void 0), d([b({ attribute: !1 })], ps.prototype, "sub", void 0), u("joe-car-device", ps);
//#endregion
//#region src/pages/devices/other-list.ts
var ms = ["auto", "always"], hs = [
	"auto",
	"surplus",
	"cheap"
], gs = [
	"climate",
	"ev",
	"hot_water"
];
function _s(e, t, n) {
	return n === t.kind ? Promise.resolve(!1) : I(e, { consumers: { [t.id]: { kind: n } } });
}
function vs(e, t, n) {
	return n === (t.runs ?? "auto") ? Promise.resolve(!1) : I(e, { consumers: { [t.id]: { runs: n } } });
}
function ys(e, t, n) {
	return D`<select
    class="input"
    aria-label=${e("consumers.kind_of", { name: t.name })}
    .value=${t.kind}
    @change=${(e) => n(e.target.value)}
  >
    ${Hn.map((n) => D`<option value=${n} ?selected=${n === t.kind}>${e(`kind.${n}`)}</option>`)}
  </select>`;
}
function bs(e, t, n) {
	if (t.kind === "submeter") return j;
	let r = t.runs ?? "auto";
	return D`<select
    class="input"
    aria-label=${e("consumers.runs_of", { name: t.name })}
    .value=${r}
    @change=${(e) => n(e.target.value)}
  >
    ${t.kind === "ev" ? ms.map((t) => D`<option value=${t} ?selected=${t === r}>${e(`runs.ev.${t}`)}</option>`) : hs.map((t) => D`<option value=${t} ?selected=${t === r}>${e(`runs.${t}`)}</option>`)}
  </select>`;
}
function xs(e, t, n, r, i) {
	let a = i.power_entity ?? i.energy_entity;
	return D`${a ? D`<div class="meter-line">
          <span class="meter-label">${t("devices.meter")}</span>
          <span class="meter-value"><b>${_(n, a)}</b> · ${c(n, a, t.lang)}</span>
          ${S(t, P(r, `consumers[${i.id}].kind`))}
        </div>` : j}
    <div class="field" data-tipped>
      <div class="field-label">${t("consumers.kind")} ${l(t, "f_consumer_kind")}</div>
      ${ys(t, i, (t) => void _s(e, i, t))}
    </div>
    ${i.kind === "submeter" ? j : D`<div class="field" data-tipped>
          <div class="field-label">${t("consumers.runs")} ${l(t, "f_consumer_runs")}</div>
          ${bs(t, i, (t) => void vs(e, i, t))}
        </div>`}`;
}
var Ss = w`
  .meter-line {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px 10px;
    padding: 8px 12px;
    border-radius: 10px;
    background: var(--joe-surface-2);
  }
  .meter-label {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--joe-muted);
  }
  .meter-value {
    flex: 1 1 160px;
    min-width: 0;
    overflow-wrap: anywhere;
    font-variant-numeric: tabular-nums;
  }
  .meter-value b {
    font-weight: 600;
  }
`, Cs = class extends O {
	static {
		this.styles = [k, w`
      :host {
        display: block;
      }
      ul {
        list-style: none;
        margin: 12px 0 0;
        padding: 0;
        display: grid;
        gap: 6px;
      }
      li {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(150px, 220px);
        align-items: center;
        gap: 8px 12px;
        padding: 10px 12px;
        border-radius: 12px;
        background: var(--joe-surface);
        box-shadow: inset 0 0 0 1px var(--joe-line);
      }
      b {
        display: block;
        font-weight: 600;
        overflow-wrap: anywhere;
      }
      small {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        color: var(--joe-muted);
        font-size: 12.5px;
        margin-top: 2px;
      }
      .head {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 700;
      }
      .head.sub {
        margin-top: 6px;
        font-weight: 600;
        color: var(--joe-ink-2);
      }
      .empty {
        color: var(--joe-muted);
      }
      .selects {
        display: grid;
        gap: 6px;
      }
      @media (max-width: 480px) {
        li {
          grid-template-columns: 1fr;
        }
      }
    `];
	}
	render() {
		let { t: e, hass: t, config: n } = this;
		if (!e || !t || !n) return j;
		let r = [...n.consumers].sort((t, n) => Number(t.kind === "submeter") - Number(n.kind === "submeter") || t.name.localeCompare(n.name, e.lang));
		return D`<div data-tipped>
      <div class="head">${e("consumers.kind")} ${l(e, "f_consumer_kind")}</div>
      <div class="head sub">${e("consumers.runs")} ${l(e, "f_consumer_runs")}</div>
      ${r.length ? D`<ul>
            ${r.map((r) => {
			let i = r.power_entity ? c(t, r.power_entity, e.lang) : "";
			return D`<li>
                <div>
                  <b>${r.name}</b>
                  <small>${S(e, P(n, `consumers[${r.id}].kind`))}${i}</small>
                </div>
                <div class="selects">
                  ${ys(e, r, (e) => void _s(this, r, e))}
                  ${bs(e, r, (e) => void vs(this, r, e))}
                </div>
              </li>`;
		})}
          </ul>` : D`<p class="empty">${e("consumers.empty")}</p>`}
    </div>`;
	}
};
d([b({ attribute: !1 })], Cs.prototype, "hass", void 0), d([b({ attribute: !1 })], Cs.prototype, "t", void 0), d([b({ attribute: !1 })], Cs.prototype, "config", void 0), u("joe-consumer-list", Cs);
//#endregion
//#region src/pages/devices/car-point.ts
var ws = class extends q {
	constructor(...e) {
		super(...e), this.busy = !1, this.failed = !1;
	}
	static {
		this.styles = [
			k,
			K,
			Ss,
			Do,
			w`
      .which {
        display: grid;
        gap: 10px;
        margin: 0 0 12px;
        padding: 12px;
        border-radius: 12px;
        background: var(--joe-surface-2);
      }
      .which.ask {
        background: var(--joe-amber-soft);
      }
      .which p {
        margin: 0;
      }
      .which p.q {
        font-weight: 700;
      }
      .choices {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .choices .mini-btn {
        min-height: 44px;
      }
      .car-link {
        min-height: 44px;
        text-decoration: none;
      }
      .bad {
        margin: 0;
        color: var(--joe-warn, var(--joe-crit));
      }
    `
		];
	}
	render() {
		let { t: e, hass: t, state: n, entry: r } = this, i = r?.action;
		if (!e || !t || !n || !r || !i) return j;
		let a = ta(this.ctx, r), o = r.consumer;
		return oa(this.ctx, {
			...a,
			live: g(e, n, i),
			why: En(e, n, i),
			now: D`${this.which(e, n, i)}
        <joe-action-tonight .hass=${t} .t=${e} .state=${n} .action=${i}></joe-action-tonight>`,
			steer: D`<joe-action-steer
        .hass=${t}
        .t=${e}
        .state=${n}
        .discovery=${this.discovery}
        .prefix=${this.prefix}
        .action=${i}
        .section=${"point"}
      ></joe-action-steer>`,
			power: o ? xs(this, e, t, n.config, o) : void 0,
			tips: {
				now: "point_now",
				steer: "point_steer"
			},
			removeTitle: e("devices.page.delete"),
			remove: D`<joe-action-delete
        .t=${e}
        .config=${n.config}
        .action=${i}
        .leave=${{
				tab: "devices",
				section: "car"
			}}
      ></joe-action-delete>`
		});
	}
	which(e, t, n) {
		let i = m(t, n.id), a = r(t.config, n), o = t.cars?.answers?.[n.id], s = !!i?.ask, c = ke(t.config, i?.car), u = c ? _e(c.id) : void 0, d = (e) => this.answer(n.id, e);
		return D`<div class="which ${s ? "ask" : ""}" data-tipped>
      ${s ? D`<p class="q">${e("point.ask", { point: n.name })} ${l(e, "point_which")}</p>
            <p>${e("point.ask.text")}</p>` : D`<p>${g(e, t, n)} ${l(e, "point_which")}</p>`}
      ${u && c ? D`<a class="mini-btn quiet car-link" href=${E(this.prefix, u)} @click=${C(u)}>${e("point.open_car", { car: c.name })}</a>` : j}
      ${a.length && i && i.state !== "empty" && i.state !== "free" ? D`${s ? j : Eo(e("point.other_car"))}
            <div class="choices" role="group" aria-label=${e("point.ask", { point: n.name })}>
              ${a.map((e) => D`<button
                  type="button"
                  class="mini-btn ${i.car === e.id ? "go" : ""}"
                  aria-pressed=${String(i.car === e.id)}
                  ?disabled=${this.busy}
                  @click=${() => d(e.id)}
                >
                  <ha-icon icon="mdi:car-electric"></ha-icon>${e.name}
                </button>`)}
              <button
                type="button"
                class="mini-btn ${i.state === "guest" ? "go" : "quiet"}"
                aria-pressed=${String(i.state === "guest")}
                ?disabled=${this.busy}
                @click=${() => d("guest")}
              >
                <ha-icon icon="mdi:account-arrow-right-outline"></ha-icon>${e("point.guest")}
              </button>
              ${o ? D`<button type="button" class="mini-btn quiet" ?disabled=${this.busy} @click=${() => d(null)}>
                    ${e("point.forget")}
                  </button>` : j}
            </div>` : j}
      ${this.failed ? D`<p class="bad" role="status">${e("error.action")}</p>` : j}
    </div>`;
	}
	async answer(e, t) {
		this.busy = !0, this.failed = !1;
		try {
			await this.hass?.callWS({
				type: "energy_joe/car/answer",
				point: e,
				car: t
			});
		} catch {
			this.failed = !0;
		}
		this.busy = !1;
	}
};
d([b({ attribute: !1 })], ws.prototype, "entry", void 0), d([T()], ws.prototype, "busy", void 0), d([T()], ws.prototype, "failed", void 0);
var Ts = class extends q {
	static {
		this.styles = [
			k,
			K,
			Ss,
			Do
		];
	}
	render() {
		let { t: e, hass: t, state: n, entry: r } = this, i = r?.consumer;
		return !e || !t || !n || !r || !i ? j : oa(this.ctx, {
			...ta(this.ctx, r),
			now: Co(e, this.prefix, "wallbox", i.id, e("devices.car.lonely"), e("devices.car.set_up"), "devices_lonely_car"),
			power: xs(this, e, t, n.config, i)
		});
	}
};
d([b({ attribute: !1 })], Ts.prototype, "entry", void 0), u("joe-car-point", ws), u("joe-car-meter", Ts);
//#endregion
//#region src/pages/devices/car.ts
var Es = class extends q {
	static {
		this.styles = [
			k,
			K,
			Do,
			w`
      joe-car-search.search {
        margin-top: 20px;
      }
    `
		];
	}
	target() {
		return this.device === "point" ? pt(this.devices, "car", `point:${this.sub ?? ""}`) : pt(this.devices, "car", this.device) ?? (this.device ? pt(this.devices, "car", `point:${this.device}`) : void 0);
	}
	render() {
		let e = this.t;
		if (!e || !this.state) return j;
		let t = this.target(), n = {
			hass: this.hass,
			t: e,
			state: this.state,
			route: this.route,
			prefix: this.prefix,
			discovery: this.discovery,
			info: this.info,
			checks: this.checks,
			climateFound: this.climateFound,
			devices: this.devices
		};
		if (t?.car) return D`<joe-car-device
        .hass=${n.hass}
        .t=${e}
        .state=${n.state}
        .route=${n.route}
        .prefix=${n.prefix}
        .discovery=${n.discovery}
        .info=${n.info}
        .checks=${n.checks}
        .climateFound=${n.climateFound}
        .devices=${n.devices}
        .entry=${t}
        .sub=${this.sub}
      ></joe-car-device>`;
		if (t?.point) return D`<joe-car-point
        .hass=${n.hass}
        .t=${e}
        .state=${n.state}
        .route=${n.route}
        .prefix=${n.prefix}
        .discovery=${n.discovery}
        .info=${n.info}
        .checks=${n.checks}
        .climateFound=${n.climateFound}
        .devices=${n.devices}
        .entry=${t}
      ></joe-car-point>`;
		if (t) return D`<joe-car-meter
        .hass=${n.hass}
        .t=${e}
        .state=${n.state}
        .prefix=${n.prefix}
        .devices=${n.devices}
        .entry=${t}
      ></joe-car-meter>`;
		let r = this.device && this.device !== "point" ? wo(this.devices, this.device, "car") : void 0, i = this.devices.filter((e) => e.group === "car" && e.car), a = this.devices.filter((e) => e.group === "car" && !e.car);
		return D`<div class="wrap">
      ${ca(e, e("nav.devices.car"), e("devices.car.lead"), this.devices.some((e) => e.group === "car"))}
      ${this.device === void 0 ? j : r ? To(e, this.prefix, r.name, r) : $i(e)}
      ${i.length ? D`<h3 class="sub-group">${e("devices.car.cars")}</h3>` : j}
      ${sa(this.ctx, i, "car")}
      ${a.length ? D`<h3 class="sub-group">${e("devices.car.points")}</h3>` : j}
      ${sa(this.ctx, a, "car")}
      <div class="group-actions">
        ${la(e, this.prefix, "car", e("devices.group_add.car"))} ${la(e, this.prefix, "wallbox", e("devices.group_add.wallbox"))}
      </div>
      <joe-car-search
        class="search"
        .hass=${this.hass}
        .t=${e}
        .state=${this.state}
        .discovery=${this.discovery}
        .prefix=${this.prefix}
      ></joe-car-search>
    </div>`;
	}
};
d([b({ attribute: !1 })], Es.prototype, "device", void 0), d([b({ attribute: !1 })], Es.prototype, "sub", void 0), u("joe-car-group", Es);
//#endregion
//#region node_modules/lit-html/directives/repeat.js
var Ds = (e, t, n) => {
	let r = /* @__PURE__ */ new Map();
	for (let i = t; i <= n; i++) r.set(e[i], i);
	return r;
}, Os = wr(class extends Tr {
	constructor(e) {
		if (super(e), e.type !== Cr.CHILD) throw Error("repeat() can only be used in text expressions");
	}
	dt(e, t, n) {
		let r;
		n === void 0 ? n = t : t !== void 0 && (r = t);
		let i = [], a = [], o = 0;
		for (let t of e) i[o] = r ? r(t, o) : o, a[o] = n(t, o), o++;
		return {
			values: a,
			keys: i
		};
	}
	render(e, t, n) {
		return this.dt(e, t, n).values;
	}
	update(e, [t, n, r]) {
		let i = xr(e), { values: a, keys: o } = this.dt(t, n, r);
		if (!Array.isArray(i)) return this.ut = o, a;
		let s = this.ut ??= [], c = [], l, u, d = 0, f = i.length - 1, p = 0, m = a.length - 1;
		for (; d <= f && p <= m;) if (i[d] === null) d++;
		else if (i[f] === null) f--;
		else if (s[d] === o[p]) c[p] = vr(i[d], a[p]), d++, p++;
		else if (s[f] === o[m]) c[m] = vr(i[f], a[m]), f--, m--;
		else if (s[d] === o[m]) c[m] = vr(i[d], a[m]), _r(e, c[m + 1], i[d]), d++, m--;
		else if (s[f] === o[p]) c[p] = vr(i[f], a[p]), _r(e, i[d], i[f]), f--, p++;
		else if (l === void 0 && (l = Ds(o, p, m), u = Ds(s, d, f)), l.has(s[d])) {
			if (l.has(s[f])) {
				let t = u.get(o[p]), n = t === void 0 ? null : i[t];
				if (n === null) {
					let t = _r(e, i[d]);
					vr(t, a[p]), c[p] = t;
				} else c[p] = vr(n, a[p]), _r(e, i[d], n), i[t] = null;
				p++;
			} else Sr(i[f]), f--;
		} else Sr(i[d]), d++;
		for (; p <= m;) {
			let t = _r(e, c[m + 1]);
			vr(t, a[p]), c[p++] = t;
		}
		for (; d <= f;) {
			let e = i[d++];
			e !== null && Sr(e);
		}
		return this.ut = o, br(e, c), de;
	}
}), ks = 1435, As = 1440;
function js(e, t) {
	let n = (t ?? "").trim();
	return !n || /^profile?\s*\d+$/i.test(n) ? e : `${e} ${n}`;
}
var Ms = {
	normal: "mdi:home-outline",
	holiday: "mdi:calendar-star",
	away: "mdi:home-export-outline",
	home_office: "mdi:laptop"
}, Ns = {
	all: 1,
	week_weekend: 2,
	each: 7
};
function Ps(e, t) {
	return e === "all" ? 0 : e === "week_weekend" ? t < 5 ? 0 : 1 : t;
}
function Fs(e) {
	return `${String(Math.floor(e / 60)).padStart(2, "0")}:${String(e % 60).padStart(2, "0")}`;
}
function Is(e) {
	let t = /^(\d{1,2}):(\d{2})/.exec(e);
	if (!t) return null;
	let n = Number(t[1]), r = Number(t[2]);
	return n < 24 && r < 60 ? n * 60 + r : null;
}
function Ls(e, t) {
	let n;
	for (let [r, i] of e) r <= t && (n = i);
	return n;
}
function Rs(e) {
	let t = /* @__PURE__ */ new Date();
	try {
		let n = new Intl.DateTimeFormat("en-GB", {
			timeZone: e,
			weekday: "short",
			hour: "2-digit",
			minute: "2-digit",
			hourCycle: "h23"
		}).formatToParts(t), r = (e) => n.find((t) => t.type === e)?.value ?? "", i = [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun"
		].indexOf(r("weekday"));
		if (i >= 0) return {
			weekday: i,
			minute: Number(r("hour")) * 60 + Number(r("minute"))
		};
	} catch {}
	return {
		weekday: (t.getDay() + 6) % 7,
		minute: t.getHours() * 60 + t.getMinutes()
	};
}
function zs(e, t, n, r) {
	let i = Math.round(e / t) * t;
	return Math.round(Math.min(r, Math.max(n, i)) * 10) / 10;
}
function Bs(e, t) {
	let n = (e) => e.map(([e, t]) => [e, t]), r = (t) => n(e.curves[Ps(e.split, t)] ?? e.curves[0]);
	return t === "all" ? [r(0)] : t === "week_weekend" ? [r(0), r(5)] : [
		0,
		1,
		2,
		3,
		4,
		5,
		6
	].map(r);
}
function Vs(e) {
	let t = 0, n = -1;
	for (let r = 0; r < e.length; r++) {
		let i = e[r + 1]?.[0] ?? 1440;
		i - e[r][0] > n && (t = e[r][0], n = i - t);
	}
	if (n < 0) return null;
	let r = Math.min(ks, Math.round((t + n / 2) / 15) * 15);
	return r > t && !e.some(([e]) => e === r) ? r : null;
}
function Hs(e) {
	if (e.length !== 6) return "count";
	let t = /* @__PURE__ */ new Set();
	for (let n of e) {
		for (let e of n.tags) {
			if (t.has(e)) return "tags";
			t.add(e);
		}
		if (n.curves.length !== Ns[n.split]) return "curves";
		for (let e of n.curves) {
			if (!e.length || e.length > 12 || e[0][0] !== 0) return "points";
			for (let t = 1; t < e.length; t++) if (e[t][0] <= e[t - 1][0] || e[t][0] % 5) return "points";
		}
	}
	return null;
}
//#endregion
//#region src/components/week-bar.ts
var Us = class extends O {
	constructor(...e) {
		super(...e), this.points = [], this.mode = "heat", this.now = null, this.compact = !1, this.lang = "en", this.label = "", this.offText = "off";
	}
	static {
		this.styles = w`
    :host {
      /* Heating and cooling colors of the timeline (theme independent). */
      --wk-heat: #e8590c;
      --wk-heat-weak: #fde3c8;
      --wk-cool: #1c7ed6;
      --wk-cool-weak: #d3e9fb;
      display: block;
      min-width: 0;
    }
    .track {
      position: relative;
    }
    .bar {
      position: relative;
      height: 30px;
      border-radius: 8px;
      overflow: hidden;
      background: var(--joe-surface-2);
    }
    :host([compact]) .bar {
      height: 10px;
      border-radius: 4px;
    }
    .seg {
      position: absolute;
      top: 0;
      bottom: 0;
      display: grid;
      place-items: center;
      overflow: hidden;
      white-space: nowrap;
      font-size: 12px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      color: var(--joe-amber-ink);
      box-shadow: inset 1px 0 0 var(--joe-surface);
    }
    .seg:first-child {
      box-shadow: none;
    }
    .seg.off {
      color: var(--joe-ink-2);
      font-weight: 600;
      background: repeating-linear-gradient(-45deg, var(--joe-surface-2) 0 4px, var(--joe-line-2) 4px 6px);
    }
    .now {
      position: absolute;
      top: -4px;
      bottom: -4px;
      width: 2px;
      margin-left: -1px;
      border-radius: 1px;
      background: var(--joe-ink);
      pointer-events: none;
    }
    :host([compact]) .now {
      top: -2px;
      bottom: -2px;
    }
    .ticks {
      position: relative;
      height: 16px;
      margin-top: 2px;
      font-size: 11px;
      color: var(--joe-muted);
      font-variant-numeric: tabular-nums;
    }
    .ticks span {
      position: absolute;
      top: 0;
      transform: translateX(-50%);
    }
    .ticks span:first-child {
      transform: none;
    }
    .ticks span:last-child {
      transform: translateX(-100%);
    }
  `;
	}
	render() {
		let e = this.points, t = e.map(([t, n], r) => ({
			from: t,
			to: e[r + 1]?.[0] ?? 1440,
			value: n
		}));
		return D`<div class="track">
        <div class="bar" role="img" aria-label=${this.label}>
          ${t.map(({ from: e, to: t, value: n }) => {
			let r = `left:${e / As * 100}%;width:${(t - e) / As * 100}%;`;
			return n === "off" ? D`<span class="seg off" style=${r}>${this.compact ? j : this.offText}</span>` : D`<span class="seg" style=${r + this.color(n)}>
              ${this.compact ? j : `${v(this.lang, n, 1)}°`}
            </span>`;
		})}
        </div>
        ${this.now == null ? j : D`<span class="now" style=${`left:${this.now / As * 100}%`}></span>`}
      </div>
      ${this.compact ? j : D`<div class="ticks" aria-hidden="true">
            ${[
			0,
			6,
			12,
			18,
			24
		].map((e) => D`<span style=${`left:${e / 24 * 100}%`}>${e}</span>`)}
          </div>`}`;
	}
	color(e) {
		let t = this.mode === "cool" ? (28 - e) / 10 : (e - 16) / 10, n = Math.round(25 + Math.min(1, Math.max(0, t)) * 75), r = this.mode === "cool" ? "cool" : "heat";
		return `background:color-mix(in srgb, var(--wk-${r}) ${n}%, var(--wk-${r}-weak));`;
	}
};
d([b({ attribute: !1 })], Us.prototype, "points", void 0), d([b()], Us.prototype, "mode", void 0), d([b({ attribute: !1 })], Us.prototype, "now", void 0), d([b({
	type: Boolean,
	reflect: !0
})], Us.prototype, "compact", void 0), d([b()], Us.prototype, "lang", void 0), d([b()], Us.prototype, "label", void 0), d([b()], Us.prototype, "offText", void 0), u("joe-week-bar", Us);
//#endregion
//#region src/editors/week-editor.ts
var Ws = [
	"all",
	"week_weekend",
	"each"
], Gs = "23:00", Ks = "06:30", qs = {
	tab: "household",
	section: "days"
};
function Js(e, t, n = "long") {
	return new Intl.DateTimeFormat(e, {
		weekday: n,
		timeZone: "UTC"
	}).format(new Date(Date.UTC(2024, 0, 1 + t)));
}
var J = class extends O {
	constructor(...e) {
		super(...e), this.entityId = "", this.prefix = A, this.fetched = !1, this.failed = !1, this.drafts = {}, this.selected = {
			heat: 0,
			cool: 0
		}, this.open = 0, this.creating = !1, this.saving = !1, this.errors = {}, this.fitted = {}, this.loaded = !1, this.requested = !1;
	}
	static {
		this.styles = [k, w`
      :host {
        display: block;
      }
      .head {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px 10px;
        margin-top: 10px;
      }
      .head b {
        font-weight: 700;
        overflow-wrap: anywhere;
      }
      a.mini-btn {
        text-decoration: none;
      }
      .seg .dot {
        display: inline-block;
        width: 7px;
        height: 7px;
        margin-left: 6px;
        border-radius: 50%;
        background: var(--joe-amber);
        vertical-align: middle;
      }
      .seg .dot.bad {
        background: var(--joe-warn);
      }
      .field > .seg {
        justify-self: start;
        max-width: 100%;
      }
      .field > .seg.full {
        justify-self: stretch;
      }
      .seg.full {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        border-radius: 14px;
        width: 100%;
      }
      .seg.full button {
        border-radius: 11px;
        line-height: 1.2;
        text-wrap: balance;
      }
      .tiles {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
      }
      @media (min-width: 720px) {
        .tiles {
          grid-template-columns: repeat(6, minmax(0, 1fr));
        }
      }
      .tile {
        display: grid;
        align-content: start;
        gap: 6px;
        min-width: 0;
        min-height: 76px;
        padding: 8px 9px 9px;
        border: 0;
        border-radius: 12px;
        background: var(--joe-surface-2);
        color: var(--joe-ink);
        text-align: left;
        cursor: pointer;
        transition: background 0.12s, box-shadow 0.12s, transform 0.12s;
      }
      .tile:hover {
        background: var(--joe-line);
      }
      .tile:active {
        transform: scale(0.98);
      }
      .tile[aria-pressed="true"],
      .tile[aria-pressed="true"]:hover {
        background: var(--joe-amber-soft);
        box-shadow: inset 0 0 0 2px var(--joe-amber);
      }
      .tile-top {
        display: flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
      }
      .tile-top .no {
        flex: none;
        display: grid;
        place-items: center;
        width: 20px;
        height: 20px;
        border-radius: 6px;
        background: var(--joe-ink);
        color: var(--joe-bg);
        font-size: 12px;
        font-weight: 800;
      }
      .tile-top .name {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 700;
        font-size: 13.5px;
      }
      .running {
        flex: none;
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: var(--joe-good);
        box-shadow: 0 0 0 3px var(--joe-good-soft);
      }
      .tile-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 2px 6px;
        min-height: 16px;
        font-size: 11.5px;
        font-weight: 600;
        color: var(--joe-ink-2);
      }
      .tile-tags span {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        min-width: 0;
      }
      .tile-tags ha-icon {
        --mdc-icon-size: 13px;
      }
      .profile {
        margin-top: 6px;
        padding-top: 4px;
        border-top: 1px solid var(--joe-line);
      }
      .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .tag-btn[aria-pressed="true"] {
        background: var(--joe-amber-soft);
        box-shadow: inset 0 0 0 2px var(--joe-amber);
      }
      .tag-btn[aria-pressed="true"]:hover:not([disabled]) {
        background: var(--joe-amber-soft);
      }
      .groups {
        display: grid;
        gap: 8px;
      }
      .group {
        border-radius: 12px;
        box-shadow: inset 0 0 0 1px var(--joe-line);
        padding: 10px 12px 12px;
        min-width: 0;
      }
      .group.open {
        box-shadow: inset 0 0 0 1.5px var(--joe-line-2);
      }
      .group-head {
        display: grid;
        grid-template-columns: 112px minmax(0, 1fr);
        align-items: center;
        gap: 10px;
        width: 100%;
        padding: 0;
        border: 0;
        background: none;
        color: inherit;
        text-align: left;
      }
      button.group-head {
        cursor: pointer;
        min-height: 44px;
      }
      .day-label {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 4px 6px;
        font-weight: 700;
        min-width: 0;
      }
      .day-label ha-icon {
        color: var(--joe-muted);
      }
      .points {
        display: grid;
        margin-top: 10px;
      }
      .point {
        display: grid;
        grid-template-columns: 112px minmax(0, 1fr) auto 44px;
        grid-template-areas: "time value off del";
        align-items: center;
        gap: 6px 10px;
        padding: 6px 0;
        border-top: 1px solid var(--joe-line);
      }
      .point .time {
        grid-area: time;
      }
      .point .value {
        grid-area: value;
      }
      .point .off {
        grid-area: off;
      }
      .point .del {
        grid-area: del;
      }
      .time.input {
        width: 112px;
        min-width: 0;
      }
      .time.fixed {
        width: 112px;
        display: inline-flex;
        align-items: center;
        min-height: 42px;
        padding: 0 12px;
        border-radius: 9px;
        color: var(--joe-muted);
        font-variant-numeric: tabular-nums;
        box-shadow: inset 0 0 0 1px var(--joe-line);
      }
      .value {
        display: flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
      }
      .value .num {
        width: 76px;
        min-width: 0;
        text-align: center;
        padding: 8px 6px;
      }
      .value .unit {
        color: var(--joe-muted);
      }
      .step {
        justify-content: center;
        width: 40px;
        padding: 0;
        font-size: 18px;
        font-weight: 700;
      }
      .off-text {
        display: inline-flex;
        align-items: center;
        min-height: 42px;
        padding: 0 14px;
        border-radius: 9px;
        font-weight: 600;
        color: var(--joe-ink-2);
        background: repeating-linear-gradient(-45deg, var(--joe-surface-2) 0 4px, var(--joe-line) 4px 6px);
      }
      .off {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 13.5px;
        color: var(--joe-ink-2);
      }
      .del {
        justify-content: center;
        padding: 0;
        width: 44px;
      }
      .row-error {
        margin: 0 0 6px;
        color: var(--joe-warn);
        font-size: 13px;
        font-weight: 600;
      }
      .point-actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px 12px;
        margin-top: 10px;
      }
      .copy {
        width: auto;
        min-width: 0;
        max-width: 100%;
      }
      .note {
        margin-top: 10px;
      }
      .empty {
        display: grid;
        justify-items: start;
        gap: 12px;
        margin-top: 16px;
        padding: 16px;
        border-radius: 12px;
        border: 1.5px dashed var(--joe-line-2);
      }
      .empty p {
        margin: 0;
      }
      /* Sticks to the sheet's bottom edge, over its padding. */
      .foot {
        position: sticky;
        bottom: -22px;
        z-index: 1;
        margin: 22px -22px -22px;
        padding: 12px 22px 16px;
        background: var(--joe-surface);
        box-shadow: 0 -1px 0 var(--joe-line);
      }
      .foot .actions {
        margin-top: 0;
      }
      .foot .note {
        margin: 0 0 10px;
      }
      @media (max-width: 600px) {
        .foot {
          bottom: calc(-20px - env(safe-area-inset-bottom));
          margin: 20px -16px calc(-20px - env(safe-area-inset-bottom));
          padding: 10px 16px calc(12px + env(safe-area-inset-bottom));
        }
        .group-head {
          grid-template-columns: 1fr;
          gap: 6px;
        }
        .point {
          grid-template-columns: minmax(0, 1fr) auto 44px;
          grid-template-areas:
            "time off del"
            "value value value";
        }
        .seg.full button {
          padding: 6px 8px;
          font-size: 13.5px;
        }
        /* The dot on the mode says it already; the bar stays one line. */
        .foot .chip {
          display: none;
        }
      }
      @media (pointer: coarse) {
        .step {
          width: 44px;
        }
      }
    `];
	}
	connectedCallback() {
		super.connectedCallback(), this.timer = window.setInterval(() => this.requestUpdate(), 6e4);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), window.clearInterval(this.timer);
	}
	willUpdate(e) {
		if (e.has("entityId") && e.get("entityId") && (this.loaded = !1, this.requested = !1, this.fetched = !1, this.device = void 0, this.mode = void 0, this.drafts = {}, this.errors = {}, this.fitted = {}, this.notice = void 0, this.rowError = void 0), !this.device && !this.requested) {
			let e = this.found?.devices.find((e) => e.entity_id === this.entityId);
			e && (this.device = e, this.fetched = !0, this.requested = !0);
		}
		this.hass && !this.requested && (this.requested = !0, this.load()), (e.has("config") || e.has("entityId")) && this.config && this.entityId && !this.loaded && (this.loaded = !0, this.drafts = structuredClone(this.room?.week?.modes ?? {}), this.fitDrafts(Kn), this.pickMode()), this.device && this.loaded && !this.mode && (this.fitDrafts(Kn), this.pickMode()), e.has("startMode") && this.mode && this.startMode && this.startMode !== this.mode && this.modes.includes(this.startMode) && this.showMode(this.startMode);
	}
	get room() {
		return this.config?.climate?.rooms?.[this.entityId];
	}
	async load() {
		try {
			let e = await this.hass?.callWS({ type: "energy_joe/climate/devices" });
			this.device = e?.devices.find((e) => e.entity_id === this.entityId), this.failed = !e;
		} catch {
			this.failed = !0;
		}
		this.fetched = !0, this.fitDrafts(Kn), this.pickMode();
	}
	fitDrafts(e) {
		if (!this.device || !this.loaded) return;
		let { step: t, min: n, max: r } = this.limits, i = this.drafts, a = this.fitted;
		for (let o of e) {
			let e = i[o];
			if (!e) continue;
			let s = !1, c = e.map((e) => ({
				...e,
				curves: e.curves.map((e) => e.map(([e, i]) => {
					if (i === "off") return [e, i];
					let a = zs(i, t, n, r);
					return a !== i && (s = !0), [e, a];
				}))
			}));
			s && (i = {
				...i,
				[o]: c
			}, a = {
				...a,
				[o]: !0
			});
		}
		i !== this.drafts && (this.drafts = i, this.fitted = a);
	}
	get modes() {
		return Kn.filter((e) => this.device?.hvac_modes.includes(e));
	}
	pickMode() {
		if (this.mode || !this.device || !this.loaded) return;
		let e = this.status?.rooms?.[this.entityId], t = this.hass?.states[this.entityId]?.state ?? this.device.state, n = [
			this.startMode,
			e?.mode,
			t,
			...this.modes
		].find((e) => !!e && this.modes.includes(e));
		n && (this.mode = n, e?.mode === n && e.profile?.index != null && (this.selected = {
			...this.selected,
			[n]: e.profile.index
		}), this.openToday());
	}
	get index() {
		return this.mode ? this.selected[this.mode] : 0;
	}
	get profiles() {
		return this.mode ? this.drafts[this.mode] : void 0;
	}
	get now() {
		return Rs(this.hass?.config?.time_zone);
	}
	openToday() {
		let e = this.profiles?.[this.index];
		this.open = e ? Ps(e.split, this.now.weekday) : 0;
	}
	get limits() {
		let e = this.device?.target_temp_step || .5, t = Math.max(5, this.device?.min_temp ?? 5), n = Math.min(35, this.device?.max_temp ?? 35);
		return t < n ? {
			step: e,
			min: t,
			max: n
		} : {
			step: e,
			min: 5,
			max: 35
		};
	}
	render() {
		let { t: e, device: t } = this;
		if (!e || !this.config) return j;
		let n = D`<div class="sheet-title">${y(e("week.title"))}</div>`;
		if (!t) return D`${n}
        ${this.fetched ? D`<div class="note warn">
              <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e(this.failed ? "week.load_failed" : "week.device_missing")}</span>
            </div>` : D`<p class="field-hint">${e("week.loading")}</p>`}
        <div class="actions" data-notip>
          <button type="button" class="btn btn-secondary" @click=${this.close}>${e("mode.close")}</button>
        </div>`;
		let r = this.modes, i = this.mode, a = this.profiles;
		return D`${n}
      <div class="head">
        <b>${ae(t.device_id, t.name, e("climate.open_device", { id: t.entity_id }))}</b>
        ${t.area ? D`<span class="chip">${t.area}</span>` : j}
      </div>
      ${r.length ? D`<div class="field" data-tipped>
            <div class="field-label">${e("week.modes")} ${l(e, "week_mode")}</div>
            <span class="seg" role="group" aria-label=${e("week.modes")}>
              ${r.map((t) => D`<button type="button" aria-pressed=${String(t === i)} @click=${() => this.setMode(t)}>
                  ${e(`week.mode.${t}`)}${this.errors[t] ? D`<span class="dot bad" title=${this.errors[t]}></span>` : this.isDirty(t) ? D`<span class="dot" title=${e("week.unsaved")}></span>` : j}
                </button>`)}
            </span>
          </div>` : D`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("week.no_modes")}</span></div>`}
      ${i ? a ? this.renderSet(e, i, a) : this.renderEmpty(e, i) : j}
      <div class="foot" data-notip>
        ${i && this.errors[i] ? D`<div class="note warn" role="alert">
              <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("week.save_failed", {
			mode: e(`week.mode.${i}`),
			error: this.errors[i]
		})}</span>
            </div>` : j}
        <div class="actions">
          <button
            type="button"
            class="btn btn-primary"
            ?disabled=${this.saving || !r.length}
            @pointerdown=${() => this.pressShown = this.rowError ?? null}
            @click=${this.save}
          >
            ${e(this.saving ? "week.saving" : "common.save")}
          </button>
          <button type="button" class="btn btn-ghost" @click=${this.close}>${e("common.cancel")}</button>
          ${r.some((e) => this.isDirty(e)) ? D`<span class="chip warn">${e("week.unsaved")}</span>` : j}
        </div>
      </div>`;
	}
	renderEmpty(e, t) {
		return D`<div class="empty" data-tipped>
      <p>${e("week.empty", { mode: e(`week.mode.${t}`) })}</p>
      <span class="with-tip">
        <button type="button" class="btn btn-primary" ?disabled=${this.creating} @click=${() => void this.create(t)}>
          ${e(this.creating ? "week.creating" : "week.create")}
        </button>
        ${l(e, "week_create")}
      </span>
    </div>`;
	}
	renderSet(e, t, n) {
		let r = this.status?.rooms?.[this.entityId], i = r?.kind === "week" && r.mode === t ? r.profile?.index : void 0, a = this.now, o = this.index, s = n[o];
		return D`<div class="field" data-tipped>
        <div class="field-label">${e("week.profiles")} ${l(e, "week_profiles")}</div>
        <div class="tiles" role="group" aria-label=${e("week.profiles")}>
          ${n.map((n, r) => {
			let s = n.name || e("week.profile", { n: r + 1 });
			return D`<button
              type="button"
              class="tile"
              aria-pressed=${String(r === o)}
              @click=${() => this.select(r)}
            >
              <span class="tile-top">
                <span class="no" aria-hidden="true">${r + 1}</span>
                <span class="name">${s}</span>
                ${r === i ? D`<span class="running" role="img" aria-label=${e("week.running")} title=${e("week.running")}></span>` : j}
              </span>
              <span class="tile-tags">
                ${n.tags.map((t) => D`<span><ha-icon icon=${Ms[t]}></ha-icon>${e(`week.tag.${t}`)}</span>`)}
              </span>
              <joe-week-bar
                compact
                .points=${n.curves[Ps(n.split, a.weekday)] ?? n.curves[0] ?? []}
                .now=${a.minute}
                mode=${t}
                lang=${e.lang}
                label=${e("week.curve", { label: `${s}, ${e("week.today")}` })}
              ></joe-week-bar>
            </button>`;
		})}
        </div>
        ${n.some((e) => e.tags.includes("normal")) ? j : D`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("week.no_normal")}</span></div>`}
      </div>
      ${s ? this.renderProfile(e, t, n, s) : j}`;
	}
	renderProfile(e, t, n, r) {
		let i = this.index, a = this.status?.day, o = !a || a.home_office_available, s = a?.home_office_reason ?? "no_calendar";
		return D`<div class="profile">
      <div class="field" data-tipped>
        <div class="field-label"><label for="week-name">${e("week.name")}</label> ${l(e, "week_name")}</div>
        <input
          id="week-name"
          class="input"
          type="text"
          maxlength="30"
          placeholder=${e("week.profile", { n: i + 1 })}
          .value=${r.name}
          @input=${(e) => {
			let t = e.target.value.slice(0, 30);
			this.change((e) => {
				e.name = t;
			}, !1);
		}}
          @change=${(e) => {
			let t = e.target.value.trim().slice(0, 30);
			this.change((e) => {
				e.name = t;
			}, !1);
		}}
        />
      </div>
      <div class="field" data-tipped>
        <div class="field-label">${e("week.tags")} ${l(e, "week_tags")}</div>
        <div class="tags" role="group" aria-label=${e("week.tags")}>
          ${Gn.map((t) => {
			let i = r.tags.includes(t), a = t === "home_office" && !o && !i;
			return D`<button
              type="button"
              class="mini-btn tag-btn"
              aria-pressed=${String(i)}
              ?disabled=${a}
              title=${a ? e(`week.ho.${s}`) : ""}
              @click=${() => this.toggleTag(n, t)}
            >
              <ha-icon icon=${Ms[t]}></ha-icon>${e(`week.tag.${t}`)}
            </button>`;
		})}
        </div>
        ${o ? j : D`<p class="field-hint">${e(`week.ho.${s}`)}</p>
              <div>
                <a class="mini-btn quiet" href=${E(this.prefix, qs)} @click=${C(qs)}>
                  <ha-icon icon="mdi:calendar-text-outline"></ha-icon>${e("week.ho.rules")}
                </a>
              </div>`}
        ${r.tags.length ? j : D`<p class="field-hint">${e("week.untagged")}</p>`} ${this.noticeAt("tags")}
      </div>
      <div class="field" data-tipped>
        <div class="field-label">${e("week.days")} ${l(e, "week_split")}</div>
        <span class="seg full" role="group" aria-label=${e("week.days")}>
          ${Ws.map((t) => D`<button type="button" aria-pressed=${String(r.split === t)} @click=${() => this.setSplit(t)}>
              ${e(`week.split.${t}`)}
            </button>`)}
        </span>
      </div>
      ${this.noticeAt("days")} ${this.renderGroups(e, t, r)}
    </div>`;
	}
	noticeAt(e) {
		return this.notice?.at === e ? D`<div class="note" role="status"><ha-icon icon="mdi:information-outline"></ha-icon><span>${this.notice.text}</span></div>` : j;
	}
	groupLabel(e, t, n) {
		return t === "all" ? e("week.group.all") : t === "week_weekend" ? e(n === 0 ? "week.group.weekdays" : "week.group.weekend") : Js(e.lang, n);
	}
	renderGroups(e, t, n) {
		let r = this.now, i = Ps(n.split, r.weekday), a = n.curves.length > 1, { step: o, min: s, max: c } = this.limits, u = this.room;
		return D`<div class="field" data-tipped>
      <div class="field-label">${e("week.points")} ${l(e, "week_points")}</div>
      <p class="field-hint">
        ${e("week.limits", {
			min: v(e.lang, s, 1),
			max: v(e.lang, c, 1),
			step: v(e.lang, o, 2)
		})}
      </p>
      ${this.fitted[t] ? D`<div class="note" role="status"><ha-icon icon="mdi:information-outline"></ha-icon><span>${e("week.fitted")}</span></div>` : j}
      ${u?.night_off ? D`<p class="field-hint">
            ${this.config?.climate?.night_by === "entity" ? e("week.night_entity", { until: u.night_until ?? Ks }) : e("week.night_time", {
			from: u.night_from ?? Gs,
			until: u.night_until ?? Ks
		})}
          </p>` : j}
      <div class="groups">
        ${n.curves.map((l, u) => {
			let d = this.groupLabel(e, n.split, u), f = !a || this.open === u, p = D`<span class="day-label">
              ${a ? D`<ha-icon icon=${f ? "mdi:chevron-down" : "mdi:chevron-right"}></ha-icon>` : j}${d}
              ${u === i ? D`<span class="chip ok">${e("week.today")}</span>` : j}
            </span>
            <joe-week-bar
              .points=${l}
              .now=${u === i ? r.minute : null}
              mode=${t}
              lang=${e.lang}
              offText=${e("week.off")}
              label=${e("week.curve", { label: d })}
            ></joe-week-bar>`;
			return D`<div class="group ${f ? "open" : ""}">
            ${a ? D`<button type="button" class="group-head" aria-expanded=${String(f)} @click=${() => this.openGroup(u)}>${p}</button>` : D`<div class="group-head">${p}</div>`}
            ${f ? this.renderPoints(e, n, u, l, {
				step: o,
				min: s,
				max: c
			}) : j}
          </div>`;
		})}
      </div>
    </div>`;
	}
	renderPoints(e, t, n, r, i) {
		let { step: a, min: o, max: s } = i, c = v(e.lang, a, 2), u = this.rowError?.curve === n ? this.rowError : void 0;
		return D`<div class="points" role="list" aria-label=${e("week.points")}>
        ${Os(r, ([e]) => e, ([t, r], i) => {
			let l = Fs(t);
			return D`<div class="point" role="listitem">
              ${i === 0 ? D`<span class="time fixed" title=${e("week.point.first")}>00:00</span>` : D`<input
                    class="input time"
                    type="time"
                    step="300"
                    required
                    aria-label=${e("week.point.time")}
                    .value=${l}
                    @blur=${(e) => this.setTime(n, i, e.target)}
                    @keydown=${(e) => e.key === "Enter" && e.target.blur()}
                  />`}
              <span class="value">
                ${r === "off" ? D`<span class="off-text">${e("week.off")}</span>` : D`<button
                        type="button"
                        class="mini-btn step"
                        aria-label=${e("week.point.less", { step: c })}
                        ?disabled=${r <= o}
                        @click=${() => this.setValue(n, i, r - a)}
                      >
                        −
                      </button>
                      <input
                        class="input num"
                        type="number"
                        inputmode="decimal"
                        step=${a}
                        min=${o}
                        max=${s}
                        aria-label=${e("week.point.value", { time: l })}
                        .value=${String(r)}
                        @change=${(e) => {
				let t = e.target, a = Number.parseFloat(t.value.replace(",", "."));
				t.value = String(Number.isFinite(a) ? this.setValue(n, i, a) : r);
			}}
                      />
                      <button
                        type="button"
                        class="mini-btn step"
                        aria-label=${e("week.point.more", { step: c })}
                        ?disabled=${r >= s}
                        @click=${() => this.setValue(n, i, r + a)}
                      >
                        +
                      </button>
                      <span class="unit">°C</span>`}
              </span>
              <span class="off">
                <button
                  type="button"
                  class="switch"
                  role="switch"
                  aria-checked=${String(r === "off")}
                  aria-label=${e("week.point.off", { time: l })}
                  @click=${() => this.toggleOff(n, i)}
                ></button>
                <span aria-hidden="true">${e("week.off")}</span>
              </span>
              ${i === 0 ? D`<span class="del"></span>` : D`<button
                    type="button"
                    class="mini-btn quiet del"
                    aria-label=${e("week.point.delete", { time: l })}
                    title=${e("week.point.delete", { time: l })}
                    @click=${() => this.removePoint(n, i)}
                  >
                    <ha-icon icon="mdi:delete-outline"></ha-icon>
                  </button>`}
            </div>
            ${u?.point === i ? D`<p class="row-error" role="alert">${u.text}</p>` : j}`;
		})}
      </div>
      <div class="point-actions">
        <span class="with-tip" data-tipped>
          <button type="button" class="mini-btn" ?disabled=${r.length >= 12} @click=${() => this.addPoint(n)}>
            <ha-icon icon="mdi:plus"></ha-icon>${e("week.point.add")}
          </button>
          ${l(e, "week_add")}
        </span>
        ${t.curves.length > 1 ? this.renderCopy(e, t, n) : j}
      </div>
      ${r.length >= 12 ? D`<p class="field-hint">${e("week.point.max")}</p>` : j} ${this.noticeAt("points")}`;
	}
	renderCopy(e, t, n) {
		let r = t.split === "week_weekend" ? [{
			value: String(1 - n),
			label: e(n === 0 ? "week.group.weekend" : "week.group.weekdays")
		}] : [
			{
				value: "all",
				label: e("week.copy.all")
			},
			{
				value: "weekdays",
				label: e("week.group.weekdays")
			},
			{
				value: "weekend",
				label: e("week.group.weekend")
			},
			...[
				0,
				1,
				2,
				3,
				4,
				5,
				6
			].filter((e) => e !== n).map((t) => ({
				value: String(t),
				label: Js(e.lang, t)
			}))
		];
		return D`<span class="with-tip" data-tipped>
      <select
        class="input copy"
        aria-label=${e("week.copy")}
        @change=${(e) => {
			let t = e.target, i = r.find((e) => e.value === t.value);
			t.value = "", i && this.copyTo(n, i.value, i.label);
		}}
      >
        <option value="" selected disabled>${e("week.copy")}</option>
        ${r.map((e) => D`<option value=${e.value}>${e.label}</option>`)}
      </select>
      ${l(e, "week_copy")}
    </span>`;
	}
	change(e, t = !0) {
		let n = this.mode, r = n ? this.drafts[n] : void 0;
		if (!n || !r) return;
		t && (this.notice = void 0, this.rowError = void 0);
		let i = structuredClone(r);
		e(i[this.index], i), this.drafts = {
			...this.drafts,
			[n]: i
		}, this.errors[n] && (this.errors = {
			...this.errors,
			[n]: void 0
		});
	}
	changeCurve(e, t) {
		this.change((n) => {
			let r = n.curves[e];
			r && (t(r), r.sort((e, t) => e[0] - t[0]));
		});
	}
	setMode(e) {
		e !== this.mode && (this.showMode(e), this.dispatchEvent(new CustomEvent("joe-week-mode", {
			detail: { mode: e },
			bubbles: !0,
			composed: !0
		})));
	}
	showMode(e) {
		this.mode = e, this.notice = void 0, this.rowError = void 0, this.openToday();
	}
	select(e) {
		this.mode && e !== this.index && (this.selected = {
			...this.selected,
			[this.mode]: e
		}, this.notice = void 0, this.rowError = void 0, this.openToday());
	}
	openGroup(e) {
		this.open = e, this.rowError = void 0;
	}
	toggleTag(e, t) {
		let n = this.t, r = this.index, i = e[r].tags.includes(t);
		if (i && t === "normal") {
			this.notice = {
				text: n("week.normal_fixed"),
				at: "tags"
			};
			return;
		}
		let a = i ? -1 : e.findIndex((e, n) => n !== r && e.tags.includes(t));
		if (this.change((e, n) => {
			if (i) {
				e.tags = e.tags.filter((e) => e !== t);
				return;
			}
			a >= 0 && (n[a].tags = n[a].tags.filter((e) => e !== t)), e.tags = Gn.filter((n) => n === t || e.tags.includes(n));
		}), a >= 0) {
			let r = e[a].name || n("week.profile", { n: a + 1 });
			this.notice = {
				text: n("week.tag.moved", {
					tag: n(`week.tag.${t}`),
					from: r
				}),
				at: "tags"
			};
		}
	}
	setSplit(e) {
		let t = this.t, n = this.profiles?.[this.index];
		if (!n || n.split === e) return;
		let r = n.split;
		this.change((t) => {
			t.curves = Bs(t, e), t.split = e;
		});
		let i = Ns[e] > Ns[r] ? t("week.split.split") : r === "each" && e === "week_weekend" ? t("week.split.merged_days") : t("week.split.merged", { first: r === "each" ? Js(t.lang, 0) : t("week.group.weekdays") });
		this.notice = {
			text: i,
			at: "days"
		}, this.open = Ps(e, this.now.weekday);
	}
	setTime(e, t, n) {
		let r = this.t, i = this.profiles?.[this.index]?.curves[e];
		if (!i) return;
		let a = i[t][0], o = Is(n.value);
		if (o == null) {
			n.value = Fs(a);
			return;
		}
		let s = Math.min(ks, Math.max(5, Math.round(o / 5) * 5));
		if (s === a) {
			n.value = Fs(a);
			return;
		}
		if (i.some(([e], n) => n !== t && e === s)) {
			n.value = Fs(a), this.rowError = {
				curve: e,
				point: t,
				text: r("week.point.duplicate", { time: Fs(s) })
			};
			return;
		}
		n.value = Fs(s), this.changeCurve(e, (e) => {
			e[t][0] = s;
		});
	}
	setValue(e, t, n) {
		let { step: r, min: i, max: a } = this.limits, o = zs(n, r, i, a);
		return this.changeCurve(e, (e) => {
			e[t][1] = o;
		}), o;
	}
	toggleOff(e, t) {
		let n = this.profiles?.[this.index]?.curves[e];
		if (!n) return;
		let { step: r, min: i, max: a } = this.limits, o = "off";
		if (n[t][1] === "off") {
			let e = [...n.slice(0, t)].reverse().find(([, e]) => e !== "off")?.[1], s = n.find(([, e]) => e !== "off")?.[1];
			o = zs(Number(e ?? s ?? this.fallbackValue()), r, i, a);
		}
		this.changeCurve(e, (e) => {
			e[t][1] = o;
		});
	}
	fallbackValue() {
		let e = this.device, t = this.hass?.states[this.entityId], n = Number(t?.attributes.temperature ?? e?.temperature);
		return (t?.state ?? e?.state) === this.mode && Number.isFinite(n) ? n : this.mode === "cool" ? 25 : 21;
	}
	addPoint(e) {
		let t = this.t, n = this.profiles?.[this.index]?.curves[e];
		if (!n || n.length >= 12) return;
		let r = Vs(n);
		if (r == null) {
			this.notice = {
				text: t("week.point.no_room"),
				at: "points"
			};
			return;
		}
		let i = Ls(n, r) ?? this.fallbackValue();
		this.changeCurve(e, (e) => {
			e.push([r, i]);
		});
	}
	removePoint(e, t) {
		t !== 0 && this.changeCurve(e, (e) => {
			e.splice(t, 1);
		});
	}
	copyTo(e, t, n) {
		let r = this.t, i = this.profiles?.[this.index];
		if (!i) return;
		let a = t === "all" ? [
			0,
			1,
			2,
			3,
			4,
			5,
			6
		] : t === "weekdays" ? [
			0,
			1,
			2,
			3,
			4
		] : t === "weekend" ? [5, 6] : [Number(t)], o = i.split === "each" ? a.filter((t) => t !== e) : a;
		this.change((t) => {
			for (let n of o) t.curves[n] && (t.curves[n] = structuredClone(t.curves[e]));
		}), this.notice = {
			text: r("week.copied", { days: n }),
			at: "points"
		};
	}
	async create(e) {
		if (this.hass) {
			this.creating = !0, this.errors = {
				...this.errors,
				[e]: void 0
			};
			try {
				let t = await this.hass.callWS({
					type: "energy_joe/climate/week/default",
					entity_id: this.entityId,
					mode: e
				});
				this.drafts = {
					...this.drafts,
					[e]: t.profiles
				}, this.fitDrafts([e]), this.selected = {
					...this.selected,
					[e]: 0
				}, this.openToday();
			} catch (t) {
				this.errors = {
					...this.errors,
					[e]: Ys(t)
				};
			} finally {
				this.creating = !1;
			}
		}
	}
	isDirty(e) {
		let t = this.drafts[e];
		return !!t && JSON.stringify(t) !== JSON.stringify(this.room?.week?.modes?.[e]);
	}
	async save() {
		let e = this.t, t = this.pressShown === void 0 ? this.rowError : this.pressShown;
		this.pressShown = void 0;
		let n = this.shadowRoot?.activeElement;
		if (n instanceof HTMLInputElement && (n.dispatchEvent(new Event("change")), n.dispatchEvent(new Event("blur"))), await this.updateComplete, this.rowError && this.rowError !== (t ?? void 0)) return;
		let r = this.modes.filter((e) => this.isDirty(e));
		for (let t of r) {
			let n = Hs(this.drafts[t]);
			if (n) {
				this.errors = {
					...this.errors,
					[t]: e(`week.problem.${n}`)
				}, this.mode = t;
				return;
			}
		}
		this.saving = !0;
		for (let e of r) try {
			await this.hass?.callWS({
				type: "energy_joe/climate/week/set",
				entity_id: this.entityId,
				mode: e,
				profiles: this.drafts[e]
			});
		} catch (t) {
			let n = Ys(t);
			this.errors = {
				...this.errors,
				[e]: n
			}, this.mode = e;
			let r = Number(/\bprofile?\s*(\d)\b/i.exec(n)?.[1]);
			r >= 1 && r <= 6 && (this.selected = {
				...this.selected,
				[e]: r - 1
			}, this.openToday()), this.saving = !1;
			return;
		}
		this.saving = !1, this.close();
	}
	close() {
		this.dispatchEvent(new CustomEvent("joe-close", {
			bubbles: !0,
			composed: !0
		}));
	}
};
d([b({ attribute: !1 })], J.prototype, "hass", void 0), d([b({ attribute: !1 })], J.prototype, "t", void 0), d([b({ attribute: !1 })], J.prototype, "config", void 0), d([b({ attribute: !1 })], J.prototype, "status", void 0), d([b({ attribute: !1 })], J.prototype, "entityId", void 0), d([b({ attribute: !1 })], J.prototype, "found", void 0), d([b({ attribute: !1 })], J.prototype, "prefix", void 0), d([b({ attribute: !1 })], J.prototype, "startMode", void 0), d([T()], J.prototype, "device", void 0), d([T()], J.prototype, "fetched", void 0), d([T()], J.prototype, "failed", void 0), d([T()], J.prototype, "drafts", void 0), d([T()], J.prototype, "mode", void 0), d([T()], J.prototype, "selected", void 0), d([T()], J.prototype, "open", void 0), d([T()], J.prototype, "notice", void 0), d([T()], J.prototype, "rowError", void 0), d([T()], J.prototype, "creating", void 0), d([T()], J.prototype, "saving", void 0), d([T()], J.prototype, "errors", void 0), d([T()], J.prototype, "fitted", void 0);
function Ys(e) {
	return String(e?.message ?? e);
}
u("joe-week-editor", J);
//#endregion
//#region src/pages/devices/climate-view.ts
var Xs = {
	enabled: !1,
	away: "setback",
	setback_k: 3,
	away_preset: null,
	free_day_preset: null,
	night_off: !1,
	night_from: "23:00",
	night_until: "06:30",
	week: {
		enabled: !1,
		modes: {}
	},
	device_profiles: {}
};
function Zs(e, t) {
	let n = /^week_program_(\d+)$/.exec(e);
	return n ? Number(n[1]) : t + 1;
}
function Qs(e) {
	return JSON.stringify(Object.keys(e).sort().map((t) => [
		t,
		e[t]?.name ?? "",
		e[t]?.tags ?? []
	]));
}
function $s(e, t, n, r) {
	let i = {
		...Xs,
		...t ?? {}
	}, a = e.hvac_modes.includes("cool"), o = e.preset_modes.filter((e) => !["none", "boost"].includes(e)), s = e.week_presets ?? [], c = Object.values(i.week?.modes ?? {}).filter((e) => !!e?.length), l = a && !s.length && !!i.week?.enabled, u = l && c.length > 0 && n?.kind !== "legacy", d = s.some((e) => r[e]?.tags.includes("normal")), f = d && n?.kind !== "legacy", p = !u && !f;
	return {
		room: i,
		cooling: a,
		presets: o,
		programs: s,
		sets: c,
		weekOn: l,
		weekRuns: u,
		tagged: d,
		deviceRuns: f,
		legacy: p,
		awayTagged: u ? c.every((e) => e.some((e) => e.tags.includes("away"))) : s.some((e) => r[e]?.tags.includes("away")),
		awayWays: p ? [
			"setback",
			"off",
			...o.length ? ["preset"] : []
		] : ["setback", "off"],
		away: p ? i.away : i.away === "off" ? "off" : "setback"
	};
}
function ec(e, t, n) {
	let r = t[e.entity_id]?.meter, i = n?.suggested?.[e.entity_id]?.device_id;
	return e.hvac_modes.some((e) => [
		"cool",
		"dry",
		"fan_only",
		"heat_cool"
	].includes(e)) || r != null && r !== "none" || i != null && i === e.device_id;
}
function tc(e) {
	return !!e?.meter && e.meter !== "none";
}
function nc(e, t, n) {
	let r = e?.states[n]?.attributes, i = (e) => e == null || e === "" || !Number.isFinite(Number(e)) ? null : Number(e);
	return {
		current: i(r?.current_temperature ?? t?.current_temperature),
		target: i(r?.temperature ?? t?.temperature)
	};
}
function rc(e, t) {
	let { current: n, target: r } = t;
	return n !== null && r !== null ? e("devices.card.climate", {
		current: v(e.lang, n, 1),
		target: v(e.lang, r, 1)
	}) : n === null ? void 0 : e("devices.card.temp", { value: v(e.lang, n, 1) });
}
function ic(e, t, n, r) {
	if (!n?.kind || n.kind === "legacy") return;
	if (n.override?.reason === "off") return e("week.why.off_by_hand");
	let i = n.target;
	if (n.kind === "device") {
		let n = i?.preset;
		if (!i) return e("week.as_is");
		if (i.hvac === "off") return e("week.state_off");
		if (!n) return;
		let a = (t.week_presets ?? []).indexOf(n);
		return js(e("week.profile", { n: Zs(n, Math.max(0, a)) }), r[n]?.name);
	}
	return n.profile?.index == null ? i ? i.hvac === "off" ? e("week.state_off") : void 0 : e("week.as_is") : js(e("week.profile", { n: n.profile.index + 1 }), n.profile.name);
}
function ac(e, t, n) {
	if (t?.why) return e.optional(`week.why.${t.why}`, { min: n }) ?? e.optional(`climate.why.${t.why}`);
}
function oc(e, t, n) {
	let r = n.config.climate;
	if (r?.night_by !== "entity") return {
		text: e("climate.mirror.night.time"),
		set: !0
	};
	let i = r.night_entity ?? null;
	return i ? {
		text: String(t?.states[i]?.attributes.friendly_name ?? i),
		set: !0
	} : {
		text: e("climate.mirror.night.no_entity"),
		set: !1
	};
}
//#endregion
//#region src/pages/devices/climate-device.ts
var sc = {
	tab: "household",
	section: "days"
}, cc = {
	tab: "household",
	section: "night"
}, lc = [
	"auto",
	"surplus",
	"cheap"
], Y = class extends O {
	constructor(...e) {
		super(...e), this.prefix = A, this.devices = [], this.picking = !1, this.query = "", this.holdUntil = {}, this.pending = {}, this.moved = {}, this.weekError = {};
	}
	static {
		this.styles = [
			k,
			K,
			w`
      :host {
        display: block;
      }
      .row {
        display: flex;
        align-items: center;
        gap: 8px 12px;
        flex-wrap: wrap;
        margin-top: 12px;
      }
      .dsec > .row:first-of-type,
      .dsec > div:first-of-type > .row:first-child {
        margin-top: 0;
      }
      .row > span:first-child {
        flex: 1 1 140px;
        min-width: 0;
      }
      .row .input {
        width: auto;
        min-width: 0;
      }
      .row .input.short {
        width: 90px;
      }
      .row select.input {
        flex: 1 1 160px;
      }
      .row.hold {
        margin-top: 6px;
      }
      .hint {
        margin: 8px 0 0;
        color: var(--joe-muted);
        font-size: 13px;
      }
      .with-tip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      details.ent {
        font-size: 12.5px;
        color: var(--joe-muted);
      }
      details.ent summary {
        cursor: pointer;
        width: fit-content;
      }
      @media (pointer: coarse) {
        details.ent summary {
          line-height: 44px;
        }
      }
      details.ent code {
        display: block;
        margin-top: 2px;
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 12px;
        color: var(--joe-ink-2);
        overflow-wrap: anywhere;
      }
      .week-now {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px 8px;
        font-weight: 600;
      }
      .week-now + .week-now {
        margin-top: 6px;
      }
      .week-now .chip {
        font-weight: 600;
      }
      .week-now.quiet {
        font-weight: 400;
      }
      .note-body {
        display: grid;
        gap: 8px;
        justify-items: start;
        min-width: 0;
      }
      .sub {
        margin-top: 14px;
        padding-top: 12px;
        border-top: 1px solid var(--joe-line);
      }
      .sub > .row:first-child {
        margin-top: 0;
      }
      .sub-title {
        flex: 1 1 140px;
        min-width: 0;
        font-weight: 700;
      }
      a.btn {
        text-decoration: none;
      }
      .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .tag-btn[aria-pressed="true"] {
        background: var(--joe-amber-soft);
        box-shadow: inset 0 0 0 2px var(--joe-amber);
      }
      .tag-btn[aria-pressed="true"]:hover:not([disabled]) {
        background: var(--joe-amber-soft);
      }
      .preset {
        display: grid;
        gap: 8px;
        padding: 10px 0;
      }
      .preset + .preset {
        border-top: 1px solid var(--joe-line);
      }
      .preset-name {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
      }
      .preset-name code {
        flex: none;
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 12px;
        color: var(--joe-muted);
      }
      .preset-name .input {
        flex: 1;
        min-width: 0;
      }
      .night-mirror {
        margin-top: 4px;
      }
      .meter {
        display: grid;
        gap: 8px;
        margin-top: 10px;
      }
      .meter-pick {
        display: grid;
        gap: 6px;
        min-width: 0;
      }
      .picked-row {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
      }
      .picked {
        flex: 1;
        display: grid;
        min-width: 0;
      }
      .picked b {
        font-weight: 600;
        overflow-wrap: anywhere;
      }
      .picked small,
      .hits small {
        color: var(--joe-muted);
        font-size: 12.5px;
      }
      .via::before {
        content: "↳ ";
        color: var(--joe-amber);
        font-weight: 800;
      }
      .meter .state {
        display: flex;
        gap: 6px;
        align-items: center;
        flex-wrap: wrap;
      }
      .hits {
        display: grid;
        gap: 2px;
        max-height: 300px;
        overflow-y: auto;
      }
      .hit-row {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .hit {
        flex: 1;
        min-width: 0;
        min-height: 44px;
        display: grid;
        text-align: left;
        padding: 6px 8px;
        border: 0;
        border-radius: 8px;
        background: transparent;
        color: var(--joe-ink);
        font: inherit;
        cursor: pointer;
      }
      .hit:hover,
      .hit:focus-visible {
        background: var(--joe-surface-2);
      }
      .hit:active {
        background: var(--joe-line);
      }
      .hit b {
        font-weight: 600;
      }
      .hit-actions {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        margin-top: 4px;
      }
      .consumer {
        margin-top: 14px;
        padding-top: 12px;
        border-top: 1px solid var(--joe-line);
      }
      .meter + .consumer,
      .consumer:first-child {
        margin-top: 14px;
      }
      .consumer-name {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 4px 8px;
      }
      .consumer-name span {
        color: var(--joe-ink-2);
      }
      .learned-line {
        margin: 0;
      }
      .head-extra {
        display: grid;
        gap: 8px;
      }
    `
		];
	}
	willUpdate(e) {
		if (e.has("entry") && e.get("entry")?.id !== this.entry?.id && (this.picking = !1, this.query = "", this.kindChanged = void 0), e.has("state") && Object.keys(this.pending).length) {
			let e = this.state?.config.climate?.rooms ?? {}, t = Object.fromEntries(Object.entries(this.pending).filter(([t, n]) => Qs(e[t]?.device_profiles ?? {}) !== Qs(n)));
			Object.keys(t).length !== Object.keys(this.pending).length && (this.pending = t);
		}
	}
	get ctx() {
		return {
			t: this.t,
			prefix: this.prefix,
			hass: this.hass,
			state: this.state
		};
	}
	profilesOf(e) {
		return this.pending[e] ?? this.state?.config.climate?.rooms?.[e]?.device_profiles ?? {};
	}
	hvacText(e, t) {
		return e.optional(`climate.hvac.${t}`) ?? t;
	}
	get awayAfter() {
		return this.state?.config.climate?.away_after_min ?? 15;
	}
	render() {
		let { t: e, state: t, entry: n } = this;
		if (!e || !t || !n) return j;
		if (n.unassigned && n.consumer) return this.renderUnassigned(e, t, n, n.consumer);
		let r = this.ctx, i = ta(r, n), a = Object.fromEntries((this.found?.devices ?? []).map((e) => [e.entity_id, e.name])), o = i.log ? {
			...i.log,
			names: a
		} : void 0, s = n.climate ?? this.found?.devices.find((e) => e.entity_id === n.id);
		if (!s) return oa(r, {
			...i,
			log: o
		});
		let c = s.entity_id, l = t.climate?.rooms?.[c], u = $s(s, t.config.climate?.rooms?.[c], l, this.profilesOf(c)), d = t.climate?.rates?.[c];
		return D`${oa(r, {
			...i,
			live: rc(e, nc(this.hass, s, c)),
			why: this.renderWhy(e, s, u, l),
			head: this.renderHead(e, t, s, u, l),
			now: u.room.enabled ? this.renderNowSection(e, s, u, l) : void 0,
			steer: this.renderSteer(e, t, s, u, l),
			power: this.renderPower(e, t, n, s),
			learned: u.room.enabled || d ? D`<p class="learned-line">${mo(e, d)}</p>` : void 0,
			learnedArea: "climate",
			log: o,
			tips: { power: "climate_meter" }
		})}
    ${this.sub === "week" ? this.renderWeekSheet(e, t, s) : j}`;
	}
	nowShown(e, t) {
		if (!e.room.enabled || !t?.kind || t.kind === "legacy") return !1;
		if (e.cooling && !e.programs.length) return !!e.room.week?.enabled && e.sets.length > 0 && t.pending !== "start";
		let n = this.profilesOf(this.entry?.id ?? ""), r = e.programs.flatMap((e) => n[e]?.tags ?? []);
		return e.programs.length > 0 && r.length > 0 && t.kind === "device";
	}
	renderWhy(e, t, n, r) {
		if (!n.room.enabled) return e("climate.room.off");
		let i = n.cooling && !n.programs.length && n.room.week?.enabled && n.sets.length && r?.pending !== "start" && r?.kind === "legacy" ? D`<span class="week-now quiet">
            ${e("week.legacy_now", { state: this.hvacText(e, this.hass?.states[t.entity_id]?.state ?? t.state) })}
          </span>` : j, a = r && n.legacy ? e.optional(`climate.now.${r.why}`, { min: this.awayAfter }) ?? "" : "";
		return D`${this.nowShown(n, r) ? this.nowLine(e, t, r) : j} ${i}
    ${a ? D`<span class="week-now quiet">${a}</span>` : j}`;
	}
	nowLine(e, t, n) {
		let r = n.override;
		if (r?.reason === "off") return D`<span class="week-now"><ha-icon icon="mdi:power"></ha-icon><span>${e("week.override.off")}</span></span>`;
		if (r) {
			let t = r.reason === "preset" ? r.until ? e("week.override.preset", { time: r.until }) : e("week.override.preset_open") : r.until ? e("week.override.manual", { time: r.until }) : e("week.override.manual_open");
			return D`<span class="week-now"><ha-icon icon="mdi:hand-back-right-outline"></ha-icon><span>${t}</span></span>`;
		}
		let i = n.target, a = [];
		if (n.kind === "device") {
			let n = i?.preset;
			if (!i) a.push(e("week.as_is"));
			else if (i.hvac === "off") a.push(e("week.state_off"));
			else if (n) {
				let r = (t.week_presets ?? []).indexOf(n), i = e("week.profile", { n: Zs(n, Math.max(0, r)) });
				a.push(js(i, this.profilesOf(t.entity_id)[n]?.name));
			}
		} else {
			if (a.push(i ? i.hvac === "off" ? e("week.state_off") : e(`week.mode.${n.mode === "heat" ? "heat" : "cool"}`) : e("week.as_is")), n.profile?.index != null) {
				let t = js(e("week.profile", { n: n.profile.index + 1 }), n.profile.name);
				a.push(n.profile.held && n.why !== "held" ? `${t} (${e("week.held")})` : t);
			}
			i && i.hvac !== "off" && i.temperature != null && a.push(`${v(e.lang, i.temperature, 1)} °C`), n.next && a.push(e("week.next", {
				time: n.next.at,
				value: this.valueText(e, n.next.value)
			}));
		}
		let o = e.optional(`week.why.${n.why}`, { min: this.awayAfter });
		return D`<span class="week-now">
      <span>${e(n.would ? "week.would" : "week.now", { text: a.join(" · ") || "–" })}</span>
      ${o ? D`<span class="chip">${o}</span>` : j}
    </span>`;
	}
	valueText(e, t) {
		return t === "off" ? e("week.off") : `${v(e.lang, t, 1)} °C`;
	}
	renderHead(e, t, n, r, i) {
		let a = this.nowShown(r, i) ? this.weekError[n.entity_id] ?? i?.error : void 0, o = t.config.climate?.enabled;
		return D`<div class="head-extra">
      ${a ? D`<div class="note warn" role="alert">
            <ha-icon icon="mdi:alert-outline"></ha-icon>
            <span>${e.optional(`week.error.${a}`) ?? e("week.error", { error: a })}</span>
          </div>` : j}
      ${!o && r.room.enabled ? Pa(e, this.prefix, {
			label: e("climate.enabled"),
			value: e("climate.device.main_off"),
			to: {
				tab: "devices",
				section: "climate"
			}
		}) : j}
      <details class="ent" data-notip><summary>${e("climate.entity")}</summary><code>${n.entity_id}</code></details>
    </div>`;
	}
	renderNowSection(e, t, n, r) {
		let i = this.nowShown(n, r) && r?.override && r.override.reason !== "off", a = n.cooling && !n.programs.length && !!n.room.week?.enabled && n.sets.length > 0;
		if (i || a) return D`${i ? D`<div class="row" data-tipped>
          <span>${e("week.why.override")}</span>
          <button type="button" class="btn btn-secondary" @click=${() => void this.resume(t)}>${e("week.resume")}</button>
          ${l(e, "week_resume")}
        </div>` : j}
    ${a ? this.renderHold(e, t, n.room, n.sets, r) : j}`;
	}
	renderHold(e, t, n, r, i) {
		let a = t.entity_id, o = i?.mode ?? this.hass?.states[a]?.state ?? t.state, s = n.week?.modes?.[o === "heat" ? "heat" : "cool"] ?? r[0], c = i?.hold ?? null, u = c && c.mode === o ? c : null, d = u ? u.profile : null, f = u ? u.until ? "midnight" : "forever" : this.holdUntil[a] ?? "midnight", p = (t) => js(e("week.profile", { n: t.profile + 1 }), n.week?.modes?.[t.mode]?.[t.profile]?.name), m = i?.want, h = u && (m === "night" || m === "away") ? m : null;
		return D`<div data-tipped>
      <div class="row">
        <span>${e("week.hold")}</span>
        ${l(e, "week_hold")}
      </div>
      <div class="row hold">
        <select
          class="input"
          aria-label=${e("week.hold")}
          .value=${d == null ? "" : String(d)}
          @change=${(e) => {
			let n = e.target.value;
			this.hold(t, n === "" ? null : Number(n), f);
		}}
        >
          <option value="" ?selected=${d == null}>${e("week.hold.auto")}</option>
          ${s.map((t, n) => D`<option value=${String(n)} ?selected=${d === n}>${js(e("week.profile", { n: n + 1 }), t.name)}</option>`)}
        </select>
        <span class="seg" role="group" aria-label=${e("week.hold.until")}>
          ${["midnight", "forever"].map((n) => D`<button
              type="button"
              aria-pressed=${String(f === n)}
              @click=${() => {
			u ? n !== f && this.hold(t, u.profile, n) : this.holdUntil = {
				...this.holdUntil,
				[a]: n
			};
		}}
            >
              ${e(`week.hold.${n}`)}
            </button>`)}
        </span>
      </div>
      ${h && u ? D`<p class="hint">${e(`week.hold.later_${h}`, { profile: p(u) })}</p>` : j}
      ${c && !u ? D`<div class="note" role="status">
            <ha-icon icon="mdi:information-outline"></ha-icon>
            <span class="note-body">
              <span>
                ${e("week.hold.other_mode", {
			profile: p(c),
			mode: e(`week.mode.${c.mode}`),
			until: e(`week.hold.${c.until ? "midnight" : "forever"}`)
		})}
              </span>
              <button type="button" class="mini-btn" @click=${() => void this.hold(t, null, f)}>${e("week.hold.lift")}</button>
            </span>
          </div>` : j}
    </div>`;
	}
	async hold(e, t, n) {
		await this.weekCommand(e, {
			type: "energy_joe/climate/week/hold",
			entity_id: e.entity_id,
			profile: t,
			until: n
		});
	}
	async resume(e) {
		await this.weekCommand(e, {
			type: "energy_joe/climate/week/resume",
			entity_id: e.entity_id
		});
	}
	async weekCommand(e, t) {
		let { [e.entity_id]: n, ...r } = this.weekError;
		this.weekError = r;
		try {
			await this.hass?.callWS(t);
		} catch (t) {
			this.weekError = {
				...this.weekError,
				[e.entity_id]: String(t?.message ?? t)
			};
		}
	}
	renderSteer(e, t, n, r, i) {
		let { room: a, cooling: o, presets: s, programs: c, sets: u, deviceRuns: d, legacy: f, awayTagged: p, awayWays: m, away: h } = r;
		return D`<div class="row" data-tipped>
        <span>${e("climate.room.steer")}</span>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(a.enabled)}
          aria-label=${e("climate.room.enabled", { name: n.name })}
          @click=${() => this.save(n, { enabled: !a.enabled })}
        ></button>
        ${l(e, "climate_room")}
      </div>
      ${a.enabled ? D`${o && !c.length ? this.renderWeek(e, n, a, u, i) : j}
          ${c.length ? this.renderPrograms(e, n, c, i) : j}
          ${!p || f ? D`<div class="row" data-tipped>
                  <span>${e("climate.away")}</span>
                  <span class="seg" role="group" aria-label=${e("climate.away")}>
                    ${m.map((t) => D`<button type="button" aria-pressed=${String(h === t)} @click=${() => this.save(n, { away: t })}>
                        ${e(d && t === "setback" ? "devprof.away_keep" : `climate.away.${t}`)}
                      </button>`)}
                  </span>
                  ${l(e, f ? "climate_away" : d ? "devprof_away" : "week_away")}
                </div>
                ${f ? j : D`<p class="hint">${e("week.away_fallback")}</p>`}
                ${h === "setback" && !d ? D`<div class="row" data-tipped>
                      <span>${e(o && n.state === "cool" ? "climate.setback.cool" : "climate.setback.heat")}</span>
                      <input
                        class="input short"
                        type="number"
                        min="0.5"
                        max="10"
                        step="0.5"
                        aria-label=${e("climate.setback.heat")}
                        .value=${String(a.setback_k)}
                        @change=${(e) => {
			let t = Number.parseFloat(e.target.value.replace(",", "."));
			Number.isFinite(t) && this.save(n, { setback_k: Math.min(10, Math.max(.5, t)) });
		}}
                      />
                      <span>°C</span>
                      ${l(e, f ? "climate_away" : "week_away")}
                    </div>` : j}
                ${f && a.away === "preset" ? D`<div data-tipped>
                      ${this.presetRow(e, n, s, "away_preset", a.away_preset, "climate.away_preset")}
                    </div>` : j}` : j}
          ${f && s.length ? D`<div data-tipped>
                ${this.presetRow(e, n, s, "free_day_preset", a.free_day_preset, "climate.free_day_preset", !0)}
              </div>` : j}
          ${o ? this.renderNight(e, t, n, a) : j}` : j}`;
	}
	daysLink(e) {
		return D`<a class="mini-btn quiet" href=${E(this.prefix, sc)} @click=${C(sc)}>
      <ha-icon icon="mdi:calendar-text-outline"></ha-icon>${e("week.ho.rules")}
    </a>`;
	}
	weekRoute(e, t) {
		return {
			tab: "devices",
			section: "climate",
			id: e.entity_id,
			sub: "week",
			rest: t ? [t] : void 0
		};
	}
	renderWeek(e, t, n, r, i) {
		let a = !!n.week?.enabled, o = this.weekRoute(t);
		return D`<div class="sub" data-tipped>
      <div class="row">
        <span class="sub-title">${e("week.row")}</span>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(a)}
          aria-label=${e("week.row")}
          @click=${() => this.save(t, { week: { enabled: !a } })}
        ></button>
        ${l(e, "climate_week")}
      </div>
      ${i?.pending ? D`<p class="hint">${e(i.pending === "start" ? "week.pending.start" : "week.pending.end")}</p>` : j}
      ${a ? D`${r.length ? j : D`<p class="hint">${e("week.no_sets")}</p>`}
            <div class="row">
              <a class="btn btn-secondary" href=${E(this.prefix, o)} @click=${C(o, { sheet: !0 })}>
                <ha-icon icon="mdi:calendar-clock"></ha-icon>${e("week.edit")}
              </a>
            </div>` : j}
    </div>`;
	}
	renderPrograms(e, t, n, r) {
		let i = this.profilesOf(t.entity_id), a = n.flatMap((e) => i[e]?.tags ?? []), o = this.state?.climate?.day, s = !o || o.home_office_available, c = o?.home_office_reason ?? "no_calendar", u = this.hass?.states[t.entity_id]?.state ?? t.state;
		return D`<div class="sub" data-tipped>
      <div class="row">
        <span class="sub-title">${e("devprof.title")}</span>
        ${l(e, "climate_device_profiles")}
      </div>
      ${r?.pending ? D`<p class="hint">${e(r.pending === "start" ? "devprof.pending.start" : "devprof.pending.end")}</p>` : j}
      ${n.map((r, a) => {
			let o = i[r] ?? {
				name: "",
				tags: []
			}, l = e("week.profile", { n: Zs(r, a) });
			return D`<div class="preset">
          <div class="preset-name">
            <input
              class="input"
              type="text"
              maxlength="30"
              placeholder=${l}
              aria-label=${e("devprof.name", { preset: l })}
              .value=${o.name}
              @change=${(e) => this.savePrograms(t, n, r, { name: e.target.value.trim().slice(0, 30) })}
            />
            <code>${r}</code>
          </div>
          <div class="tags" role="group" aria-label=${e("devprof.tags", { preset: l })}>
            ${Gn.map((i) => {
				let a = o.tags.includes(i), l = i === "home_office" && !s && !a;
				return D`<button
                type="button"
                class="mini-btn tag-btn"
                aria-pressed=${String(a)}
                ?disabled=${l}
                title=${l ? e(`week.ho.${c}`) : ""}
                @click=${() => this.toggleProgramTag(e, t, n, r, i)}
              >
                <ha-icon icon=${Ms[i]}></ha-icon>${e(`week.tag.${i}`)}
              </button>`;
			})}
          </div>
        </div>`;
		})}
      ${this.moved[t.entity_id] ? D`<div class="note" role="status"><ha-icon icon="mdi:information-outline"></ha-icon><span>${this.moved[t.entity_id]}</span></div>` : j}
      ${a.length && !a.includes("normal") ? D`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("devprof.need_normal")}</span></div>` : j}
      ${r?.why === "manual_mode" ? D`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("devprof.not_auto", { state: this.hvacText(e, u) })}</span>
          </div>` : j}
      ${s ? j : D`<p class="hint">${e(`week.ho.${c}`)}</p>
            <div class="row">${this.daysLink(e)}</div>`}
    </div>`;
	}
	toggleProgramTag(e, t, n, r, i) {
		let a = this.profilesOf(t.entity_id), o = (a[r]?.tags ?? []).includes(i), s = o ? void 0 : n.find((e) => e !== r && a[e]?.tags.includes(i)), c = (t) => a[t]?.name || e("week.profile", { n: Zs(t, n.indexOf(t)) });
		this.moved = {
			...this.moved,
			[t.entity_id]: s ? e("devprof.moved", {
				tag: e(`week.tag.${i}`),
				to: c(r),
				from: c(s)
			}) : ""
		};
		let l = o ? a[r].tags.filter((e) => e !== i) : Gn.filter((e) => e === i || a[r]?.tags.includes(e));
		this.savePrograms(t, n, r, { tags: l });
	}
	savePrograms(e, t, n, r) {
		let i = e.entity_id, a = this.profilesOf(i), o = Object.fromEntries(Object.entries(structuredClone(a)).filter(([e]) => t.includes(e))), s = {
			...o[n] ?? {
				name: "",
				tags: []
			},
			...r
		};
		o[n] = s;
		for (let [e, t] of Object.entries(o)) e !== n && (o[e] = {
			...t,
			tags: t.tags.filter((e) => !s.tags.includes(e))
		});
		for (let [e, t] of Object.entries(o)) !t.name && !t.tags.length && delete o[e];
		Qs(o) !== Qs(a) && (this.pending = {
			...this.pending,
			[i]: o
		}, I(this, { climate: { rooms: { [i]: { device_profiles: o } } } }).then((e) => {
			if (!e && this.pending[i] === o) {
				let { [i]: e, ...t } = this.pending;
				this.pending = t;
			}
		}));
	}
	presetRow(e, t, n, r, i, a, o = !1) {
		return D`<div class="row">
      <span>${e(a)}</span>
      <select
        class="input"
        aria-label=${e(a)}
        @change=${(e) => this.save(t, { [r]: e.target.value || null })}
      >
        ${o ? D`<option value="" ?selected=${!i}>${e("climate.no_preset")}</option>` : j}
        ${!o && !i ? D`<option value="" selected disabled>${e("climate.pick_preset")}</option>` : j}
        ${n.map((e) => D`<option value=${e} ?selected=${e === i}>${e}</option>`)}
      </select>
      ${l(e, o ? "climate_free_day" : "climate_away")}
    </div>`;
	}
	renderNight(e, t, n, r) {
		let i = (t, r) => D`<input
      class="input short"
      type="time"
      aria-label=${e(`climate.${t}`)}
      .value=${r}
      @change=${(e) => {
			let r = e.target.value;
			/^\d{1,2}:\d{2}$/.test(r) && this.save(n, { [t]: r });
		}}
    />`, a = oc(e, this.hass, t);
		return D`<div class="sub" data-tipped>
      <div class="row">
        <span class="sub-title">${e("climate.night_off")}</span>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(r.night_off)}
          aria-label=${e("climate.night_off")}
          @click=${() => this.save(n, { night_off: !r.night_off })}
        ></button>
        ${l(e, "climate_night")}
      </div>
      ${r.night_off ? t.config.climate?.night_by === "entity" ? D`<div class="row">
              <span>${e("climate.night_back")}</span>
              ${i("night_until", r.night_until)}
            </div>` : D`<div class="row">
              <span>${e("climate.night_span")}</span>
              ${i("night_from", r.night_from)} – ${i("night_until", r.night_until)}
            </div>` : j}
      <div class="night-mirror">
        ${Pa(e, this.prefix, {
			label: e("climate.mirror.night"),
			value: a.text,
			to: cc,
			action: a.set ? "change" : "set"
		})}
      </div>
    </div>`;
	}
	save(e, t) {
		I(this, { climate: { rooms: { [e.entity_id]: t } } });
	}
	renderPower(e, t, n, r) {
		let i = t.config.climate?.rooms ?? {}, a = (this.found?.devices ?? []).filter((e) => ec(e, i, this.found)), o = a.some((e) => e.entity_id === r.entity_id), s = this.movedNote(e);
		if (o || n.consumer || s) return D`${o ? D`<p class="hint">${e("climate.meters.say")}</p>
          ${(this.found?.meters ?? []).length ? j : D`<p class="hint">${e("climate.meter.no_meters")}</p>`}
          ${this.meterLine(e, r, a, i)}` : j}
    ${n.consumer ? this.consumerRows(e, n.consumer) : j} ${s}`;
	}
	meterLine(e, t, n, r) {
		let i = r[t.entity_id]?.meter ?? null, a = i && i !== "none" ? i : null, o = i == null ? this.found?.suggested?.[t.entity_id] : void 0, s = a ? n.filter((e) => e.entity_id !== t.entity_id && this.sameMeter(r[e.entity_id]?.meter, a)) : [], c = a?.power ? this.hass?.states[a.power] : void 0, l = a ? this.option(a) ?? null : o ?? null;
		return D`<div class="meter">
      <div class="meter-pick">
        ${this.picking ? this.meterSearch(e, t) : D`<span class="picked-row">
              <span class="picked">
                ${l ? D`<b>${ae(l.device_id, `${l.name ?? l.device_id}${l.sensor ? ` · ${l.sensor}` : ""}`, e("climate.open_meter"))}</b>
                      ${l.via ? D`<small class="via">${l.via}</small>` : j}
                      ${l.area ? D`<small>${l.area}</small>` : j}` : a ? D`<b>${ae(a.device_id, a.power ?? a.energy ?? a.device_id, e("climate.open_meter"))}</b>` : D`<small>${e(i === "none" ? "climate.meter.without_long" : "climate.meter.open_long")}</small>`}
              </span>
              ${l ? G(e, this.meterTarget(l)) : a ? G(e, this.meterTarget(a)) : j}
            </span>`}
      </div>
      ${this.picking ? j : D`<div class="state">
            ${a ? D`<span class="chip ok">${c ? this.reading(e, c) : e("climate.meter.linked")}</span>
                  <button type="button" class="mini-btn" @click=${() => this.startPicking()}>${e("climate.meter.change")}</button>` : o ? D`<button type="button" class="btn btn-secondary" @click=${() => this.save(t, { meter: this.meterOf(o) })}>
                      ${e("climate.meter.confirm")}
                    </button>
                    <button type="button" class="mini-btn" @click=${() => this.startPicking()}>${e("climate.meter.other_short")}</button>` : D`<button type="button" class="mini-btn" @click=${() => this.startPicking()}>${e("climate.meter.search")}</button>`}
          </div>`}
      ${a?.power || a?.energy ? D`<details class="ent">
            <summary>${e("climate.entities")}</summary>
            ${a.power ? D`<code>${a.power}</code>` : j}
            ${a.energy ? D`<code>${a.energy}</code>` : j}
          </details>` : j}
      ${s.length ? D`<p class="hint">${e("climate.meter.shared", { names: s.map((e) => e.name).join(", ") })}</p>` : j}
    </div>`;
	}
	startPicking() {
		this.picking = !0, this.query = "", this.updateComplete.then(() => this.shadowRoot?.querySelector(".meter-pick input")?.focus());
	}
	meterSearch(e, t) {
		let n = this.query.toLowerCase().split(/\s+/).filter(Boolean), r = (this.found?.meters ?? []).filter((e) => {
			let t = [
				e.name,
				e.sensor,
				e.via,
				e.area,
				e.power,
				e.energy
			].join(" ").toLowerCase();
			return n.every((e) => t.includes(e));
		}).slice(0, 8);
		return D`<input
        class="input"
        type="search"
        placeholder=${e("climate.meter.search_placeholder")}
        aria-label=${e("climate.meter.pick", { name: t.name })}
        .value=${this.query}
        @input=${(e) => this.query = e.target.value}
        @keydown=${(e) => {
			e.key === "Escape" && (this.picking = !1), e.key === "Enter" && r[0] && this.pickMeter(t, this.key(r[0]));
		}}
      />
      <div class="hits" role="listbox" aria-label=${e("climate.meter.pick", { name: t.name })}>
        ${r.map((n) => D`<div class="hit-row">
            <button type="button" role="option" class="hit" @click=${() => this.pickMeter(t, this.key(n))}>
              <b>${n.name ?? n.device_id}${n.sensor ? ` · ${n.sensor}` : ""}</b>
              <small>${[
			n.via,
			n.area,
			n.power ? this.readingOf(e, n.power) : ""
		].filter(Boolean).join(" · ")}</small>
            </button>
            ${G(e, this.meterTarget(n))}
          </div>`)}
        ${r.length ? j : D`<small class="none">${e("climate.meter.no_hits")}</small>`}
        <div class="hit-actions">
          <button type="button" class="mini-btn" @click=${() => this.pickMeter(t, "none")}>${e("climate.meter.none_option")}</button>
          <button type="button" class="mini-btn quiet" @click=${() => this.picking = !1}>${e("climate.meter.cancel")}</button>
        </div>
      </div>`;
	}
	meterTarget(e) {
		let t = "name" in e ? e : this.option(e), n = [t?.name ?? e.device_id, t?.sensor].filter(Boolean).join(" · ");
		return {
			deviceId: e.device_id,
			entityId: e.power ?? e.energy,
			name: n
		};
	}
	readingOf(e, t) {
		let n = this.hass?.states[t];
		return n ? this.reading(e, n) : "";
	}
	key(e) {
		return [
			e.device_id,
			e.power ?? "",
			e.energy ?? ""
		].join("|");
	}
	option(e) {
		return (this.found?.meters ?? []).find((t) => this.key(t) === this.key(e));
	}
	meterOf(e) {
		return {
			device_id: e.device_id,
			power: e.power,
			energy: e.energy
		};
	}
	sameMeter(e, t) {
		return !!e && e !== "none" && this.key(e) === this.key(t);
	}
	reading(e, t) {
		let n = Number(t.state);
		return `${t.state !== "" && Number.isFinite(n) ? v(e.lang, n, n % 1 ? 1 : 0) : t.state} ${String(t.attributes.unit_of_measurement ?? "")}`.trim();
	}
	pickMeter(e, t) {
		if (this.picking = !1, t === "none") {
			this.save(e, { meter: "none" });
			return;
		}
		let n = (this.found?.meters ?? []).find((e) => this.key(e) === t);
		n && this.save(e, { meter: this.meterOf(n) });
	}
	consumerRows(e, t) {
		let n = t.power_entity ? this.readingOf(e, t.power_entity) : "", r = t.runs ?? "auto";
		return D`<div class="consumer">
      <div class="consumer-name">
        <span>${e("climate.consumer")}</span><b>${t.name}</b>${n ? D`<span>${n}</span>` : j}
      </div>
      <div class="row" data-tipped>
        <span>${e("consumers.kind")}</span>
        <select
          class="input"
          aria-label=${e("consumers.kind_of", { name: t.name })}
          .value=${t.kind}
          @change=${(e) => this.setKind(t, e.target.value)}
        >
          ${Hn.map((n) => D`<option value=${n} ?selected=${n === t.kind}>${e(`kind.${n}`)}</option>`)}
        </select>
        ${l(e, "f_consumer_kind")}
      </div>
      ${t.kind === "submeter" ? j : D`<div class="row" data-tipped>
            <span>${e("consumers.runs")}</span>
            <select
              class="input"
              aria-label=${e("consumers.runs_of", { name: t.name })}
              .value=${r}
              @change=${(e) => this.setRuns(t, e.target.value)}
            >
              ${lc.map((t) => D`<option value=${t} ?selected=${t === r}>${e(`runs.${t}`)}</option>`)}
            </select>
            ${l(e, "f_consumer_runs")}
          </div>`}
    </div>`;
	}
	setKind(e, t) {
		t !== e.kind && (this.kindChanged = e.id, I(this, { consumers: { [e.id]: { kind: t } } }));
	}
	setRuns(e, t) {
		t !== (e.runs ?? "auto") && I(this, { consumers: { [e.id]: { runs: t } } });
	}
	movedNote(e) {
		let t = this.kindChanged, n = t ? this.devices.find((e) => e.group !== "climate" && (e.consumer?.id === t || e.id === t)) : void 0;
		if (!n) return;
		let r = R(n);
		return D`<div class="note" role="status">
      <ha-icon icon="mdi:information-outline"></ha-icon>
      <a class="mini-btn go" href=${E(this.prefix, r)} @click=${C(r)}
        >${e("climate.moved", {
			name: n.name,
			group: e(`nav.devices.${n.group}`)
		})}</a
      >
    </div>`;
	}
	renderUnassigned(e, t, n, r) {
		let i = this.ctx, a = this.found?.devices ?? [], o = t.config.climate?.rooms ?? {}, s = r.power_entity ? this.readingOf(e, r.power_entity) : "", c = n.deviceId && a.length ? D`<div class="row" data-tipped>
            <span>${e("climate.assign")}</span>
            <select
              class="input"
              aria-label=${e("climate.assign")}
              @change=${(e) => {
			let t = e.target.value;
			t && this.assign(n, r, t);
		}}
            >
              <option value="" selected disabled>${e("climate.assign.pick")}</option>
              ${a.map((t) => D`<option value=${t.entity_id}>
                  ${tc(o[t.entity_id]) ? e("climate.assign.has_meter", { name: t.name }) : t.name}${t.area ? ` · ${t.area}` : ""}
                </option>`)}
            </select>
            ${l(e, "climate_assign")}
          </div>` : D`<p class="hint">${e(n.deviceId ? "climate.assign.no_climate" : "climate.assign.no_device")}</p>`;
		return oa(i, {
			...ta(i, n),
			live: s || void 0,
			why: e("climate.unassigned.lead"),
			power: D`${c} ${this.consumerRows(e, r)} ${this.movedNote(e) ?? j}`
		});
	}
	async assign(e, t, n) {
		if (!e.deviceId) return;
		let r = {
			device_id: e.deviceId,
			power: t.power_entity,
			energy: t.energy_entity
		};
		await I(this, { climate: { rooms: { [n]: { meter: r } } } }) && x(this, {
			tab: "devices",
			section: "climate",
			id: n
		}, { replace: !0 });
	}
	renderWeekSheet(e, t, n) {
		let r = {
			tab: "devices",
			section: "climate",
			id: n.entity_id
		}, i = this.route?.rest?.[0], a = Kn.find((e) => e === i);
		return D`<joe-sheet label=${e("week.label")} closeLabel=${e("common.close")} wide @joe-close=${() => we(this, r)}>
      <joe-week-editor
        .hass=${this.hass}
        .t=${e}
        .config=${t.config}
        .status=${t.climate}
        .found=${this.found}
        .prefix=${this.prefix}
        .entityId=${n.entity_id}
        .startMode=${a}
        @joe-week-mode=${(e) => this.showMode(n, e.detail.mode)}
      ></joe-week-editor>
    </joe-sheet>`;
	}
	showMode(e, t) {
		let n = !!history.state?.joeSheet;
		x(this, this.weekRoute(e, t), {
			replace: !0,
			sheet: n
		});
	}
};
d([b({ attribute: !1 })], Y.prototype, "hass", void 0), d([b({ attribute: !1 })], Y.prototype, "t", void 0), d([b({ attribute: !1 })], Y.prototype, "state", void 0), d([b({ attribute: !1 })], Y.prototype, "route", void 0), d([b({ attribute: !1 })], Y.prototype, "prefix", void 0), d([b({ attribute: !1 })], Y.prototype, "found", void 0), d([b({ attribute: !1 })], Y.prototype, "devices", void 0), d([b({ attribute: !1 })], Y.prototype, "entry", void 0), d([b({ attribute: !1 })], Y.prototype, "sub", void 0), d([T()], Y.prototype, "picking", void 0), d([T()], Y.prototype, "query", void 0), d([T()], Y.prototype, "holdUntil", void 0), d([T()], Y.prototype, "pending", void 0), d([T()], Y.prototype, "moved", void 0), d([T()], Y.prototype, "weekError", void 0), d([T()], Y.prototype, "kindChanged", void 0), u("joe-climate-device", Y);
//#endregion
//#region src/pages/devices/climate.ts
var uc = {
	tab: "household",
	section: "days"
}, dc = class extends q {
	constructor(...e) {
		super(...e), this.failed = !1, this.list = [];
	}
	static {
		this.styles = [
			k,
			K,
			w`
      :host {
        display: block;
      }
      .wrap {
        max-width: 1100px;
        margin: 0 auto;
      }
      .intro {
        display: grid;
        grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.7fr);
        gap: 24px;
        align-items: center;
      }
      .intro joe-pose {
        max-width: 260px;
        width: 100%;
        justify-self: end;
      }
      .intro .with-tip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: var(--joe-muted);
        font-size: 13px;
      }
      .card {
        padding: 18px 20px;
        margin-top: 14px;
      }
      .head {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .head .eyebrow {
        flex: 1;
        min-width: 0;
      }
      .hint {
        margin: 8px 0 0;
        color: var(--joe-muted);
        font-size: 13px;
      }
      .household {
        padding-top: 10px;
        padding-bottom: 10px;
      }
      .household .mirror + .mirror {
        border-top: 1px solid var(--joe-line);
      }
      .list-head {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 22px;
      }
      .list-head .group-label {
        margin: 0;
        flex: 1 1 auto;
      }
      .area {
        margin-top: 16px;
      }
      .cl {
        display: block;
      }
      .cl.chips {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-top: 2px;
      }
      .unassigned-text {
        margin: 0 0 10px;
        color: var(--joe-ink-2);
      }
      @media (max-width: 760px) {
        .intro {
          grid-template-columns: 1fr;
        }
        .intro joe-pose {
          display: none;
        }
      }
    `
		];
	}
	connectedCallback() {
		super.connectedCallback(), this.fallback = window.setTimeout(() => {
			!this.climateFound && !this.own && this.load();
		}, 3e3);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), window.clearTimeout(this.fallback);
	}
	get found() {
		return this.climateFound ?? this.own;
	}
	async load() {
		try {
			this.own = await this.hass?.callWS({ type: "energy_joe/climate/devices" }), this.failed = !1;
		} catch {
			this.failed = !this.climateFound;
		}
	}
	willUpdate(e) {
		[
			"devices",
			"climateFound",
			"own",
			"t",
			"state",
			"hass"
		].some((t) => e.has(t)) && (this.list = !this.climateFound && this.own && this.t && this.state ? dt(this.t, this.state, this.hass, {
			climateFound: this.own,
			discovery: this.discovery,
			checks: this.checks
		}) : this.devices);
	}
	render() {
		let { t: e, state: t } = this;
		if (!e || !t) return j;
		let n = this.entity ? pt(this.list, "climate", this.entity) : void 0;
		if (n) return D`<joe-climate-device
        .t=${e}
        .hass=${this.hass}
        .state=${t}
        .prefix=${this.prefix}
        .route=${this.route}
        .found=${this.found}
        .devices=${this.list}
        .entry=${n}
        .sub=${this.sub}
      ></joe-climate-device>`;
		let r = t.config.climate ?? {
			enabled: !1,
			rooms: {}
		}, i = this.found, a = this.list.filter((e) => e.group === "climate" && !e.unassigned), o = this.list.filter((e) => e.group === "climate" && e.unassigned), s = [...new Set(a.map((t) => t.area ?? e("climate.no_area")))], c = (i?.devices ?? []).filter((e) => ec(e, r.rooms ?? {}, i)), u = c.filter((e) => tc(r.rooms?.[e.entity_id]) || a.some((t) => t.id === e.entity_id && t.consumer)).length;
		return D`<div class="wrap">
      <div class="intro">
        <div>
          ${y(e("climate.title"))} ${M}
          <p class="lead">${e("climate.lead")}</p>
          ${a.length ? D`<p class="with-tip" data-tipped>${e("climate.ha_open")} ${l(e, "ha_open")}</p>` : j}
        </div>
        <joe-pose name="relax"></joe-pose>
      </div>
      ${this.entity === void 0 ? j : this.renderLost(e)} ${this.renderMain(e, t, r.enabled)}
      ${this.renderHousehold(e, t)}
      ${this.failed && !i ? D`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("climate.failed")}</span></div>` : j}
      ${i && !i.devices.length ? D`<p class="hint">${e("climate.none")}</p>` : j}
      ${a.length ? D`<div class="list-head">
            <h3 class="group-label">${e("climate.list")}</h3>
            ${c.length ? D`<span class="chip">${e("climate.meters.count", {
			linked: u,
			all: c.length
		})}</span>` : j}
          </div>` : j}
      ${s.map((n) => D`<div class="group-label area">${n}</div>
          <div class="dcards">
            ${a.filter((t) => (t.area ?? e("climate.no_area")) === n).map((n) => this.renderCard(e, t, n))}
          </div>`)}
      ${o.length ? D`<div class="group-head list-head">
              <span class="group-label">${e("devices.unassigned")}</span><i class="dcard-dot" aria-hidden="true"></i>
            </div>
            <p class="unassigned-text">${e("devices.unassigned.text")}</p>
            <div class="dcards">
              ${o.map((n) => ti(e, this.prefix, ai(e, this.hass, t, n)))}
            </div>` : j}
    </div>`;
	}
	renderLost(e) {
		let t = this.entity, n = this.list.find((e) => e.group !== "climate" && (e.id === t || e.consumer?.id === t));
		if (!n) return $i(e);
		let r = R(n);
		return D`<div class="note" role="status">
      <ha-icon icon="mdi:information-outline"></ha-icon>
      <a class="mini-btn go" href=${E(this.prefix, r)} @click=${C(r, { replace: !0 })}
        >${e("climate.moved", {
			name: n.name,
			group: e(`nav.devices.${n.group}`)
		})}</a
      >
    </div>`;
	}
	renderCard(e, t, n) {
		let r = n.climate, i = t.climate?.rooms?.[n.id], a = t.config.climate?.rooms?.[n.id], o = rc(e, nc(this.hass, r, n.id)), s = r && a?.enabled ? ic(e, r, i, a.device_profiles ?? {}) : void 0, c = a?.enabled ? ac(e, i, t.config.climate?.away_after_min ?? 15) : void 0, l = tc(a) || n.consumer, u = D`${o ? D`<span class="cl">${o}</span>` : j}
      ${s ? D`<span class="cl">${s}</span>` : j}
      ${c || l ? D`<span class="cl chips">
            ${c ? D`<span class="chip">${c}</span>` : j}
            ${l ? D`<span class="chip ok">${e("climate.card.measured")}</span>` : j}
          </span>` : j}`;
		return ti(e, this.prefix, ai(e, this.hass, t, n, {
			state: u,
			area: void 0
		}));
	}
	renderHousehold(e, t) {
		let n = t.config.context.presence_entity ?? null, r = n ? this.hass?.states[n]?.attributes.friendly_name ?? n : null, i = t.climate?.day, a = i ? i.holiday ? "holiday" : i.weekend && i.free ? "weekend" : "workday" : null, o = a ? [e(`climate.mirror.today.${a}`), i?.home_office_available && i.home_office.length ? e("climate.mirror.today.ho", { names: i.home_office.join(", ") }) : ""].filter(Boolean).join(", ") : e("climate.mirror.unknown"), s = oc(e, this.hass, t);
		return D`<section class="card household">
      ${Pa(e, this.prefix, {
			label: e("climate.mirror.presence"),
			value: r ? D`<span title=${n ?? ""}>${r}</span>` : e("climate.mirror.presence.none"),
			to: {
				tab: "household",
				section: "presence"
			},
			action: r ? "change" : "set"
		})}
      ${Pa(e, this.prefix, {
			label: e("climate.mirror.today"),
			value: o,
			to: uc
		})}
      ${Pa(e, this.prefix, {
			label: e("climate.mirror.night"),
			value: s.text,
			to: {
				tab: "household",
				section: "night"
			},
			action: s.set ? "change" : "set"
		})}
    </section>`;
	}
	renderMain(e, t, n) {
		return D`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:thermostat-auto"></ha-icon>${e("climate.enabled")}</div>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(n)}
          aria-label=${e("climate.enabled")}
          @click=${() => I(this, { climate: { enabled: !n } })}
        ></button>
        ${l(e, "climate_enabled")}
      </div>
      <p class="hint">${e(t.mode === "live" ? "climate.live" : "climate.not_live")}</p>
    </section>`;
	}
};
d([b({ attribute: !1 })], dc.prototype, "entity", void 0), d([b({ attribute: !1 })], dc.prototype, "sub", void 0), d([T()], dc.prototype, "own", void 0), d([T()], dc.prototype, "failed", void 0), u("joe-climate-group", dc);
//#endregion
//#region src/components/finding-rows.ts
var fc = w`
  ul.found {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 8px;
  }
  li.item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 14px;
    border-radius: 12px;
    background: var(--joe-surface);
    box-shadow: inset 0 0 0 1px var(--joe-line);
  }
  li.item.missing,
  li.item.ignored {
    background: transparent;
    box-shadow: inset 0 0 0 1.5px var(--joe-line-2);
  }
  li.item.flag {
    box-shadow: inset 0 0 0 2px var(--joe-warn);
  }
  .ico-box {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: var(--joe-surface-2);
    display: grid;
    place-items: center;
    flex: none;
    color: var(--joe-ink);
  }
  .missing .ico-box,
  .ignored .ico-box {
    color: var(--joe-muted);
  }
  li.item .text {
    min-width: 0;
    flex: 1;
  }
  li.item .head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px 12px;
    flex-wrap: wrap;
  }
  li.item .t {
    font-weight: 700;
    line-height: 1.3;
  }
  .ignored .t {
    color: var(--joe-ink-2);
  }
  li.item .chips {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  li.item .d {
    font-size: 13.5px;
    color: var(--joe-ink-2);
    margin-top: 2px;
    overflow-wrap: anywhere;
  }
  .missing .d,
  .ignored .d {
    color: var(--joe-muted);
  }
  li.item details {
    margin-top: 6px;
    font-size: 13px;
    color: var(--joe-ink-2);
  }
  li.item summary {
    cursor: pointer;
    font-weight: 600;
    color: var(--joe-ink);
    width: fit-content;
  }
  li.item details ul {
    margin: 4px 0 0;
    padding-left: 18px;
  }
  li.item .note {
    margin-top: 8px;
  }
  .row-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    margin-top: 10px;
  }
  .row-actions joe-tip {
    margin-left: 2px;
  }
  /* "In HA öffnen" sits top right, as on the device cards; notes below keep the full width. */
  li.item.has-aside {
    position: relative;
  }
  li.item.has-aside .head,
  li.item.has-aside .d {
    padding-right: 46px;
  }
  .row-aside {
    position: absolute;
    top: 8px;
    right: 8px;
  }
  @media (pointer: coarse) {
    /* 44 px to tap, but still a list item so the ▶ marker stays. */
    li.item summary {
      display: list-item;
      box-sizing: border-box;
      min-height: 44px;
      min-width: 44px;
      padding-block: 12px;
      line-height: 20px;
    }
  }
`;
function X(e, t, n, r = !1) {
	return D`<button type="button" class="mini-btn ${r ? "quiet" : ""}" @click=${n}>
    ${t ? D`<ha-icon icon=${t}></ha-icon>` : j}${e}
  </button>`;
}
function pc(e) {
	return D`<div class="note"><ha-icon icon="mdi:information-outline"></ha-icon><span>${e}</span></div>`;
}
function mc(t, n) {
	let r = n.aside && n.aside !== j;
	return D`<li class="item ${n.state ?? ""} ${r ? "has-aside" : ""}" ?data-tipped=${!!(n.actions?.length && n.tip)}>
    <span class="ico-box"><ha-icon icon=${n.icon}></ha-icon></span>
    <div class="text">
      <div class="head">
        <span class="t">${n.title}</span>
        ${n.chips?.length ? D`<span class="chips">${n.chips}</span>` : j}
      </div>
      <div class="d">${n.detail}</div>
      ${n.reasons?.length ? D`<details data-notip>
            <summary>${t("scan.why")}</summary>
            <ul>
              ${n.reasons.map((n) => D`<li>${e(t, n)}</li>`)}
            </ul>
          </details>` : j}
      ${n.notes ?? j}
      ${n.actions?.length ? D`<div class="row-actions">${n.actions}${n.tip ? l(t, n.tip) : j}</div>` : j}
    </div>
    ${r ? D`<span class="row-aside">${n.aside}</span>` : j}
  </li>`;
}
function hc(e, t) {
	return D`<ul class="found">
    ${t.map((t) => mc(e, t))}
  </ul>`;
}
var gc = {
	weather: "weather_entity",
	holiday: "holiday_entity"
};
function _c(e, t, n, r, i, a, o) {
	let s = gc[a], c = r.context[s], l = i?.[a] ?? null, u = {
		key: a,
		icon: a === "weather" ? "mdi:weather-partly-cloudy" : "mdi:calendar-star",
		title: n(a === "weather" ? "find.weather" : "find.holiday"),
		tip: a === "weather" ? "review_weather" : "review_holiday"
	}, d = () => void vc(e, n, r, i, a);
	if (c) {
		let i = l?.entity.entity_id === c;
		return {
			...u,
			detail: _(t, c),
			chips: [S(n, P(r, `context.${s}`)), ...l && i ? [oe(n, l.confidence)] : []],
			reasons: i ? l?.reasons : void 0,
			aside: o?.(c),
			actions: [X(n("review.change"), "mdi:magnify", d), X(n("review.ignore"), "", () => I(e, {
				context: { [s]: null },
				answers: { ignored: Ye(r, a, !0) }
			}), !0)]
		};
	}
	return F(r, a) ? {
		...u,
		detail: n("review.ignored"),
		state: "ignored",
		actions: [X(n("review.use"), "mdi:undo-variant", d)]
	} : {
		...u,
		detail: n("find.none"),
		state: "missing",
		notes: [pc(n(a === "weather" ? "review.weather.none" : "review.holiday.none"))],
		actions: [X(n("review.choose"), "mdi:magnify", d)]
	};
}
async function vc(e, t, n, r, i) {
	let a = gc[i], o = r?.[i], s = n.context[a], c = (await L(e, {
		heading: t(i === "weather" ? "pick.weather.title" : "pick.holiday.title"),
		tip: i === "weather" ? "pick_weather" : "pick_holiday",
		filter: i === "weather" ? "weather" : "workday",
		selected: s ? [s] : o ? [o.entity.entity_id] : [],
		suggestions: Xe(o ? [Ze(o)] : [], o?.alternatives)
	}))?.selected[0];
	c && I(e, {
		context: { [a]: c },
		answers: { ignored: Ye(n, i, !1) }
	});
}
function Z(e, t, n) {
	let [r, i] = e(n).split("|");
	return `${v(e.lang, t, 0)} ${t === 1 ? r : i}`;
}
function yc(e, t, n = []) {
	return D`<div class="note ${t.level}">
    <ha-icon icon=${t.level === "warn" ? "mdi:alert-outline" : "mdi:information-outline"}></ha-icon>
    <div>
      <span>${Ke(e, t)}</span>
      ${n.length ? D`<div class="note-actions">${n}</div>` : j}
    </div>
  </div>`;
}
function bc(e, t, n, r) {
	I(e, {
		...r,
		answers: { ignored: Ye(t, n, !0) }
	});
}
function xc(e, t, n) {
	I(e, { answers: { confirmed: [...t.answers.confirmed.filter((e) => e !== n), n] } });
}
function Sc(e) {
	let { t } = e, n = e.discovery?.energy_dashboard;
	return n?.configured ? {
		key: "energy",
		icon: "mdi:lightning-bolt",
		title: t("find.energy"),
		detail: t("find.energy.detail", {
			grid: Z(t, n.grid ?? 0, "word.grid"),
			solar: Z(t, n.solar ?? 0, "word.solar"),
			battery: Z(t, n.battery ?? 0, "word.battery"),
			devices: Z(t, n.devices ?? 0, "word.device")
		}),
		chips: [S(t, { source: "read" })]
	} : null;
}
function Cc(e, t = {}) {
	let { t: n, config: r, discovery: i } = e, a = r.tariff, o = a.kind === "unknown";
	return {
		key: "tariff",
		icon: "mdi:cash-clock",
		title: i?.tariff.provider ?? n("find.tariff"),
		detail: Ge(n, a),
		chips: o ? [] : [S(n, P(r, "tariff.kind")), ...i && i.tariff.kind !== "unknown" ? [oe(n, i.tariff.confidence)] : []],
		reasons: i?.tariff.reasons,
		notes: o ? [pc(t.missing ?? n("review.tariff.ask"))] : [],
		state: o ? "missing" : void 0,
		tip: "review_tariff",
		actions: t.actions
	};
}
function wc(e) {
	let { t, config: n, from: r } = e, i = e.discovery?.forecast, a = {
		key: "forecast",
		icon: "mdi:weather-sunny",
		title: t("find.forecast"),
		tip: "review_forecast"
	};
	return n.forecast.provider ? {
		...a,
		detail: i ? t("find.forecast.detail", {
			provider: i.provider_name,
			planes: Z(t, i.planes, "word.plane"),
			today: i.today_kwh == null ? "–" : v(t.lang, i.today_kwh, 1),
			tomorrow: i.tomorrow_kwh == null ? "–" : v(t.lang, i.tomorrow_kwh, 1)
		}) : n.forecast.provider,
		chips: [S(t, P(n, "forecast.provider")), ...i ? [oe(t, i.confidence)] : []],
		reasons: i?.reasons,
		actions: [X(t("review.ignore"), "", () => bc(r, n, "forecast", { forecast: {
			provider: null,
			config_entries: [],
			today: [],
			tomorrow: [],
			remaining_today: [],
			alternatives: []
		} }), !0)]
	} : F(n, "forecast") && i ? {
		...a,
		detail: t("review.ignored"),
		state: "ignored",
		actions: [X(t("review.use"), "mdi:undo-variant", () => Tc(e))]
	} : {
		...a,
		detail: t("find.none"),
		state: "missing",
		notes: [pc(t("review.forecast.none"))],
		tip: void 0
	};
}
function Tc(e) {
	let t = e.discovery?.forecast;
	t && I(e.from, {
		forecast: {
			provider: t.provider,
			config_entries: t.config_entries ?? [],
			today: t.today ?? [],
			tomorrow: t.tomorrow ?? [],
			remaining_today: t.remaining_today ?? [],
			alternatives: (t.others ?? []).map((e) => ({
				id: e.provider,
				name: e.provider_name,
				provider: e.provider,
				tomorrow: e.tomorrow
			}))
		},
		answers: { ignored: Ye(e.config, "forecast", !1) }
	}, "read");
}
function Ec(e, t, n = {}) {
	let { from: r, hass: i, t: a, config: o } = e, s = o.measurements[t], l = e.discovery?.measurements[t] ?? null, u = t === "grid_power", d = {
		key: t,
		icon: u ? "mdi:transmission-tower" : "mdi:home-lightning-bolt-outline",
		title: a(u ? "find.grid" : "find.home"),
		tip: u ? "review_grid" : "review_home"
	}, f = X(a(s ? "review.change" : "review.choose"), "mdi:magnify", () => void Oc(e, t)), p = n.devices ? [n.devices] : [];
	if (!s && !u && o.measurements.grid_power) return {
		...d,
		detail: a("review.home.balance"),
		notes: Dc(a, o),
		actions: [f, ...p]
	};
	if (!s) return F(o, t) ? {
		...d,
		detail: a("review.home.computed"),
		state: "ignored",
		actions: [f]
	} : {
		...d,
		detail: a("find.none"),
		state: "missing",
		notes: [pc(a(u ? "review.grid.none" : "review.home.none"))],
		actions: u ? [f] : [f, X(a("review.home.without"), "", () => bc(r, o, "home_power", { measurements: { home_power: null } }), !0)]
	};
	let m = re(i, s), h = c(i, s.entity_id, a.lang);
	if (m !== null) {
		let e = v(a.lang, Math.abs(m), 2);
		h = u ? a(m >= 0 ? "live.import" : "live.export", { value: e }) : a("live.kw", { value: v(a.lang, m, 2) });
	}
	let g = e.checks.filter((e) => e.code !== "missing" && (e.role === t || u && e.code === "grid_sign" || !u && e.code === "home_negative")), ee = () => kc(r, t, {
		...s,
		invert: !s.invert
	}), te = g.map((e) => e.code === "grid_sign" ? yc(a, e, [X(a("review.invert"), "mdi:swap-vertical", ee), X(a("review.keep"), "mdi:check", () => xc(r, o, `grid_sign:${s.entity_id}`), !0)]) : e.code === "home_negative" ? yc(a, e, [X(a("review.invert"), "mdi:swap-vertical", ee)]) : yc(a, e)), ne = g.some((e) => e.level === "warn") ? "flag" : void 0, ie = _(i, s.entity_id), ae = l?.entity.entity_id === s.entity_id;
	return !u && o.measurements.grid_power ? {
		...d,
		detail: `${a("review.home.balance")} · ${a("review.home.compare", {
			name: ie,
			live: h
		})}`,
		chips: [S(a, P(o, `measurements.${t}`))],
		notes: [...Dc(a, o), ...te],
		state: ne,
		aside: e.aside?.(s.entity_id, ie),
		actions: [
			f,
			...p,
			X(a("review.ignore"), "", () => bc(r, o, "home_power", { measurements: { home_power: null } }), !0)
		]
	} : {
		...d,
		detail: `${ie} · ${h}`,
		chips: [S(a, P(o, `measurements.${t}`)), ...l && ae ? [oe(a, l.confidence)] : []],
		reasons: ae ? l?.reasons : void 0,
		notes: te,
		state: ne,
		aside: e.aside?.(s.entity_id, ie),
		actions: [f, ...p]
	};
}
function Dc(e, t) {
	let n = [], r = Un(t.consumers);
	if (r.length) {
		let t = r.map((t) => t.kind === "ev" || t.runs === "always" || !t.runs ? t.name : `${t.name} (${e(`runs.${t.runs}`)})`).join(", ");
		n.push(pc(e(r.some((e) => e.kind === "ev") ? "review.home.flexible" : "review.home.flexible_some", { names: t })));
	} else t.consumers.some((e) => e.kind !== "submeter") && n.push(pc(e("review.home.flexible_none")));
	let i = t.learned.home_check;
	if (i && i.calc_kwh > 0) {
		let t = (i.sensor_kwh - i.calc_kwh) / i.calc_kwh;
		t <= -.5 ? n.push(pc(e("review.home.off_balance", {
			days: i.days,
			pct: v(e.lang, -t * 100, 0)
		}))) : Math.abs(t) >= .1 && n.push(pc(e("review.home.off", {
			days: i.days,
			pct: v(e.lang, Math.abs(t) * 100, 0),
			direction: e(t < 0 ? "review.home.less" : "review.home.more")
		})));
	}
	return n;
}
async function Oc(e, t) {
	let { t: n, config: r } = e, i = r.measurements[t], a = e.discovery?.measurements[t], o = t === "grid_power", s = await L(e.from, {
		heading: n(o ? "pick.grid.title" : "pick.home.title"),
		tip: o ? "pick_grid" : "pick_home",
		filter: "power",
		selected: i ? [i.entity_id] : [],
		suggestions: Xe(a ? [Ze(a)] : [], a?.alternatives),
		measurement: {
			invert: i?.invert ?? a?.measurement.invert ?? !1,
			role: o ? "grid" : "home"
		}
	}), c = s?.selected[0];
	if (!s || !c) return;
	let l = { measurements: { [t]: {
		entity_id: c,
		invert: s.invert,
		minus_entity_id: null
	} } };
	F(r, t) && (l.answers = { ignored: Ye(r, t, !1) }), I(e.from, l);
}
function kc(e, t, n) {
	I(e, { measurements: { [t]: n } });
}
function Ac(e) {
	let { from: t, hass: n, t: r, config: i } = e, a = i.measurements.solar_power, o = e.discovery?.measurements.solar_power ?? null, c = {
		key: "solar_power",
		icon: "mdi:solar-panel",
		title: r("find.solar"),
		tip: "review_solar"
	}, l = (t) => X(t, "mdi:magnify", () => void jc(e));
	if (!a.length) return F(i, "solar_power") ? {
		...c,
		detail: r("review.solar.without"),
		state: "ignored",
		actions: [l(r("review.choose"))]
	} : {
		...c,
		detail: r("find.none"),
		state: "missing",
		actions: [l(r("review.choose")), X(r("review.solar.none"), "", () => bc(t, i, "solar_power", { measurements: { solar_power: [] } }), !0)]
	};
	let u = s(n, a), d = e.checks.filter((e) => e.role === "solar_power" && e.code !== "missing"), f = a.length === 1 ? a[0].entity_id : void 0;
	return {
		...c,
		detail: r("find.solar.detail", {
			count: Z(r, a.length, "word.sensor"),
			total: u === null ? "–" : v(r.lang, u, 2)
		}),
		chips: [S(r, P(i, "measurements.solar_power")), ...o ? [oe(r, o.confidence)] : []],
		reasons: o?.reasons,
		notes: d.map((e) => yc(r, e)),
		state: d.some((e) => e.level === "warn") ? "flag" : void 0,
		aside: f ? e.aside?.(f, _(n, f)) : void 0,
		actions: [l(r("review.change")), ...d.filter((e) => e.can_sleep && a.some((t) => t.entity_id === e.entity_id && !t.sleeps)).map((e) => X(a.length > 1 ? r("solar.sleeps.quick_named", { name: _(n, String(e.entity_id)) }) : r("solar.sleeps.quick"), "mdi:weather-night", () => void I(t, { measurements: { solar_power: a.map((t) => t.entity_id === e.entity_id ? {
			...t,
			sleeps: !0
		} : t) } })))]
	};
}
async function jc(e) {
	let { t, config: n } = e, r = n.measurements.solar_power, i = e.discovery?.measurements.solar_power, a = await L(e.from, {
		heading: t("pick.solar.title"),
		tip: "pick_solar",
		filter: "power",
		multiple: !0,
		selected: r.map((e) => e.entity_id),
		suggestions: Xe((i?.entities ?? []).map((e) => ({
			entity_id: e.entity_id,
			confidence: i?.confidence,
			reasons: i?.reasons
		})), i?.alternatives)
	});
	if (!a) return;
	let o = { measurements: { solar_power: a.selected.map((e) => r.find((t) => t.entity_id === e) ?? {
		entity_id: e,
		invert: !1,
		minus_entity_id: null
	}) } };
	F(n, "solar_power") && (o.answers = { ignored: Ye(n, "solar_power", !1) }), I(e.from, o);
}
//#endregion
//#region src/editors/tariff-form.ts
var Mc = [
	"kind",
	"price_entity",
	"window",
	"night_price",
	"day_price",
	"feed_in_price",
	"feed_in_entity",
	"surcharge"
];
function Nc(e, t) {
	let n = {};
	for (let r of Mc) JSON.stringify(e[r] ?? null) !== JSON.stringify(t[r] ?? null) && (n[r] = t[r] ?? null);
	return n;
}
function Pc(e, t) {
	let n = Nc(e, t);
	if (!Object.keys(n).length) return null;
	let r = { tariff: n };
	return "kind" in n && (r.answers = { tariff: t.kind }), r;
}
var Fc = class extends O {
	constructor(...e) {
		super(...e), this.feedIn = !1, this.asQuestion = !1;
	}
	static {
		this.styles = [k, w`
      :host {
        display: block;
      }
      .field:first-child {
        margin-top: 0;
      }
      .time {
        width: 130px;
      }
      .price {
        display: grid;
        gap: 4px;
        font-size: 13.5px;
        color: var(--joe-ink-2);
        font-weight: 600;
      }
      .entity {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        padding: 8px 12px;
        border-radius: 10px;
        background: var(--joe-surface-2);
      }
      .entity b {
        font-weight: 600;
      }
      .entity small {
        color: var(--joe-muted);
      }
    `];
	}
	render() {
		let { t: e, tariff: t } = this;
		if (!e || !t) return j;
		let n = [
			{
				value: "fixed_window",
				label: e("tariff.kind.fixed_window"),
				icon: "mdi:weather-night"
			},
			{
				value: "flat",
				label: e("tariff.kind.flat"),
				icon: "mdi:equal-box"
			},
			{
				value: "dynamic",
				label: e("tariff.kind.dynamic"),
				icon: "mdi:chart-line"
			}
		], r = D`<joe-choice
      .options=${n}
      .value=${t.kind === "unknown" ? [] : [t.kind]}
      idk=${e("ask.idk")}
      label=${e("f.tariff.kind")}
      @joe-choice=${(e) => this.emit({ kind: e.detail.value[0] ?? "unknown" })}
    ></joe-choice>`;
		return D`${this.asQuestion ? r : D`<div class="field" data-tipped>
            <div class="field-label">${e("f.tariff.kind")} ${l(e, "q_tariff")}</div>
            ${r}
          </div>`}
      ${t.kind === "fixed_window" ? this.renderWindow(e, t) : j}
      ${t.kind === "flat" ? this.renderFlat(e, t) : j}
      ${t.kind === "dynamic" ? this.renderDynamic(e, t) : j}
      ${this.feedIn ? this.renderFeedIn(e, t) : j}`;
	}
	renderWindow(e, t) {
		let n = t.window ?? {
			start: "",
			end: ""
		}, r = (e, t) => {
			let r = {
				...n,
				[e]: t
			};
			this.emit({ window: r.start && r.end ? r : null });
		};
		return D`<div class="field" data-tipped>
        <div class="field-label">${e("f.window")} ${l(e, "f_window")}</div>
        <div class="field-row">
          <input
            class="input time"
            type="time"
            aria-label=${e("f.window.start")}
            .value=${n.start}
            @change=${(e) => r("start", e.target.value)}
          />
          <span>${e("f.window.until")}</span>
          <input
            class="input time"
            type="time"
            aria-label=${e("f.window.end")}
            .value=${n.end}
            @change=${(e) => r("end", e.target.value)}
          />
        </div>
      </div>
      <div class="field" data-tipped>
        <div class="field-label">${e("f.prices")} ${l(e, "f_prices")}</div>
        <div class="field-row">
          <label class="price">${e("f.price.night")} ${this.centInput(e, t.night_price, "night_price")}</label>
          <label class="price">${e("f.price.day")} ${this.centInput(e, t.day_price, "day_price")}</label>
        </div>
      </div>`;
	}
	renderFlat(e, t) {
		return D`<div class="field" data-tipped>
      <div class="field-label">${e("f.price")} ${l(e, "f_prices")}</div>
      ${this.centInput(e, t.day_price, "day_price")}
    </div>`;
	}
	renderDynamic(e, t) {
		let n = this.hass, r = t.price_entity, i = t.window ?? {
			start: "20:00",
			end: "07:00"
		}, a = (e, t) => {
			let n = {
				...i,
				[e]: t
			};
			this.emit({ window: n.start && n.end ? n : null });
		};
		return D`<div class="field" data-tipped>
        <div class="field-label">${e("f.price_entity")} ${l(e, "f_price_entity")}</div>
        <div class="entity">
          ${r && n ? D`<span><b>${_(n, r)}</b> <small>${c(n, r, e.lang)}</small></span>` : D`<small>${e("f.price_entity.none")}</small>`}
          <button type="button" class="mini-btn" @click=${this.pickPrice}>
            <ha-icon icon="mdi:magnify"></ha-icon>${e(r ? "review.change" : "review.choose")}
          </button>
        </div>
      </div>
      <div class="field" data-tipped>
        <div class="field-label">${e("f.search")} ${l(e, "f_search")}</div>
        <div class="field-row">
          <input
            class="input time"
            type="time"
            aria-label=${e("f.search.start")}
            .value=${i.start}
            @change=${(e) => a("start", e.target.value)}
          />
          <span>${e("f.window.until")}</span>
          <input
            class="input time"
            type="time"
            aria-label=${e("f.search.end")}
            .value=${i.end}
            @change=${(e) => a("end", e.target.value)}
          />
        </div>
      </div>
      <div class="field" data-tipped>
        <div class="field-label">${e("f.surcharge")} ${l(e, "f_surcharge")}</div>
        ${this.centInput(e, t.surcharge, "surcharge")}
      </div>`;
	}
	renderFeedIn(e, t) {
		let n = this.hass;
		return D`<div class="field" data-tipped>
      <div class="field-label">${e("f.feed_in")} ${l(e, "q_feed_in")}</div>
      ${t.feed_in_entity && n ? D`<p class="field-hint">
            ${e("f.feed_in.entity", { name: _(n, t.feed_in_entity) })}
          </p>` : this.centInput(e, t.feed_in_price, "feed_in_price")}
    </div>`;
	}
	centInput(e, t, n) {
		return D`<span class="unit-input">
      <input
        class="input"
        type="number"
        inputmode="decimal"
        min="0"
        max="999"
        step="0.01"
        placeholder=${e("f.price.unknown")}
        .value=${t == null ? "" : String(Math.round(t * 1e6) / 1e4)}
        @change=${(e) => {
			let t = e.target.value, r = t === "" ? null : Number.parseFloat(t);
			this.emit({ [n]: r === null || Number.isNaN(r) ? null : Math.round(r * 100) / 1e4 });
		}}
      />
      <span class="unit">ct/kWh</span>
    </span>`;
	}
	async pickPrice() {
		let { t: e, tariff: t } = this;
		if (!e || !t) return;
		let n = this.discovery?.tariff, r = (await L(this, {
			heading: e("pick.price.title"),
			tip: "pick_price",
			filter: "price",
			selected: t.price_entity ? [t.price_entity] : [],
			suggestions: Xe(n?.price_entity ? [{
				entity_id: n.price_entity,
				confidence: n.confidence,
				reasons: n.reasons
			}] : [])
		}))?.selected[0];
		r && this.emit({ price_entity: r });
	}
	emit(e) {
		this.dispatchEvent(new CustomEvent("joe-tariff", {
			detail: e,
			bubbles: !0,
			composed: !0
		}));
	}
};
d([b({ attribute: !1 })], Fc.prototype, "hass", void 0), d([b({ attribute: !1 })], Fc.prototype, "t", void 0), d([b({ attribute: !1 })], Fc.prototype, "tariff", void 0), d([b({ attribute: !1 })], Fc.prototype, "discovery", void 0), d([b({ type: Boolean })], Fc.prototype, "feedIn", void 0), d([b({ type: Boolean })], Fc.prototype, "asQuestion", void 0), u("joe-tariff-form", Fc);
var Ic, Lc = class extends O {
	constructor(...e) {
		super(...e), this.closable = !1, this.keep = !1, this.saving = !1, this.base = "";
	}
	static {
		this.styles = [k, w`
      :host {
        display: block;
      }
      .actions {
        margin-top: 18px;
      }
      .unsaved {
        margin: 14px 0 0;
        font-size: 13.5px;
        color: var(--joe-ink-2);
        font-weight: 600;
      }
    `];
	}
	willUpdate(e) {
		let t = this.config?.tariff;
		if (!e.has("config") || !t) return;
		let n = JSON.stringify(t);
		!this.draft && this.keep && Ic && (this.base = Ic.base, this.draft = Ic.draft), this.draft ? n !== this.base && (this.draft = {
			...structuredClone(t),
			...this.changes
		}, this.base = n, this.keep && (Ic = this.dirty ? {
			base: this.base,
			draft: this.draft
		} : void 0)) : (this.base = n, this.draft = structuredClone(t));
	}
	get changes() {
		return this.draft && this.base ? Nc(JSON.parse(this.base), this.draft) : {};
	}
	get dirty() {
		return Object.keys(this.changes).length > 0;
	}
	render() {
		let { t: e, draft: t } = this;
		if (!e || !t) return j;
		let n = this.dirty;
		return D`<joe-tariff-form
        .hass=${this.hass}
        .t=${e}
        .tariff=${t}
        .discovery=${this.discovery}
        feedIn
        @joe-tariff=${(e) => {
			e.stopPropagation(), this.change({
				...t,
				...e.detail
			});
		}}
      ></joe-tariff-form>
      ${n && !this.closable ? D`<p class="unsaved" role="status">${e("grid.tariff.unsaved")}</p>` : j}
      ${n || this.closable ? D`<div class="actions" data-notip>
            <button type="button" class="btn btn-primary" ?disabled=${this.saving || !n && !this.closable} @click=${this.save}>
              ${e("common.save")}
            </button>
            <button type="button" class="btn btn-ghost" @click=${this.discard}>
              ${e(this.closable ? "common.cancel" : "grid.tariff.discard")}
            </button>
          </div>` : j}`;
	}
	change(e) {
		this.draft = e, this.keep && (Ic = this.dirty ? {
			base: this.base,
			draft: e
		} : void 0);
	}
	async save() {
		let { config: e, draft: t } = this;
		if (!e || !t) return;
		let n = {
			...e.tariff,
			...this.changes
		}, r = Pc(e.tariff, n);
		if (r) {
			this.saving = !0;
			let e = await I(this, r);
			if (this.saving = !1, !e) return;
			this.base = JSON.stringify(n), this.draft = n;
		}
		this.keep && (Ic = void 0), this.finish();
	}
	discard() {
		this.config && (this.base = JSON.stringify(this.config.tariff), this.draft = structuredClone(this.config.tariff)), this.keep && (Ic = void 0), this.finish();
	}
	finish() {
		this.closable && this.dispatchEvent(new CustomEvent("joe-close", {
			bubbles: !0,
			composed: !0
		}));
	}
};
d([b({ attribute: !1 })], Lc.prototype, "hass", void 0), d([b({ attribute: !1 })], Lc.prototype, "t", void 0), d([b({ attribute: !1 })], Lc.prototype, "config", void 0), d([b({ attribute: !1 })], Lc.prototype, "discovery", void 0), d([b({ type: Boolean })], Lc.prototype, "closable", void 0), d([b({ type: Boolean })], Lc.prototype, "keep", void 0), d([T()], Lc.prototype, "draft", void 0), d([T()], Lc.prototype, "saving", void 0), u("joe-tariff-draft", Lc);
//#endregion
//#region src/pages/devices/grid.ts
var Rc = [
	"connection",
	"tariff",
	"solar",
	"home"
], zc = {
	connection: "mdi:transmission-tower",
	tariff: "mdi:cash-clock",
	solar: "mdi:solar-power-variant",
	home: "mdi:home-lightning-bolt-outline"
}, Bc = "/config/energy";
function Vc(e, t) {
	return t < .95 ? e("learn.solar.less", {
		value: v(e.lang, (1 - t) * 100, 0),
		share: v(e.lang, t * 100, 0)
	}) : t > 1.05 ? e("learn.solar.more", {
		value: v(e.lang, (t - 1) * 100, 0),
		share: v(e.lang, t * 100, 0)
	}) : e("learn.solar.fits");
}
var Hc = class extends q {
	static {
		this.styles = [
			k,
			K,
			fc,
			w`
      :host {
        display: block;
      }
      .wrap {
        max-width: 900px;
        margin: 0 auto;
      }
      .energy {
        margin-top: 14px;
      }
      .energy-none {
        margin-top: 14px;
      }
      .energy-none a {
        color: inherit;
        text-decoration: underline;
        text-underline-offset: 3px;
      }
      .gsec {
        margin-top: 14px;
      }
      .gsec-head {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0;
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 800;
        font-size: 22px;
        line-height: 1.15;
      }
      .gsec-head ha-icon {
        --mdc-icon-size: 22px;
        color: var(--joe-ink-2);
      }
      .say {
        margin: 6px 0 12px;
        font-size: 14.5px;
        line-height: 1.5;
        color: var(--joe-ink-2);
        max-width: 62ch;
      }
      .mirrors {
        margin-top: 10px;
        border-top: 1px solid var(--joe-line);
        padding-top: 4px;
      }
      .toggle-row {
        display: flex;
        align-items: center;
        gap: 8px 12px;
        flex-wrap: wrap;
        margin-top: 12px;
        min-height: 44px;
      }
      .toggle-row .with-tip {
        flex: 1 1 160px;
        min-width: 0;
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .tariff-form {
        margin-top: 16px;
      }
      li.item .row-actions a.mini-btn {
        min-height: 36px;
        text-decoration: none;
      }
      @media (pointer: coarse) {
        li.item .row-actions a.mini-btn {
          min-height: 44px;
        }
      }
    `
		];
	}
	willUpdate(e) {
		e.has("anchor") && (this.revealed = void 0);
	}
	updated() {
		this.anchor && this.revealed !== this.anchor && ve(this.renderRoot, this.anchor) && (this.revealed = this.anchor);
	}
	render() {
		let { t: e, hass: t, state: n } = this;
		if (!e || !t || !n) return j;
		let r = n.config, i = {
			from: this,
			hass: t,
			t: e,
			config: r,
			discovery: this.discovery,
			checks: this.checks,
			aside: (n, r) => G(e, ei(t, n, r))
		}, a = this.anchor !== void 0 && !Rc.includes(this.anchor);
		return D`<div class="wrap">
      ${a ? $i(e) : j}
      ${ca(e, e("nav.devices.grid"), e("grid.lead"))}
      ${this.renderEnergy(e, i)} ${this.renderConnection(e, i)} ${this.renderTariff(e, i)}
      ${this.renderSolar(e, i)} ${this.renderHome(e, i)}
    </div>`;
	}
	renderEnergy(e, t) {
		let n = Sc(t);
		return n ? D`<div class="energy">${hc(e, [n])}</div>` : D`<div class="note energy-none">
      <ha-icon icon="mdi:information-outline"></ha-icon>
      <span
        >${e("grid.energy.none")}
        <a
          href=${Bc}
          @click=${(e) => {
			e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0 || (e.preventDefault(), ee(Bc));
		}}
          >${e("grid.energy.open")}</a
        ></span
      >
    </div>`;
	}
	block(e, t, n, r, i) {
		return D`<section class="card gsec" data-anchor=${t}>
      <h3 class="gsec-head" ?data-tipped=${!!i}>
        <ha-icon icon=${zc[t]}></ha-icon>${n}${i ? l(e, i) : j}
      </h3>
      <p class="say">${e(`grid.${t}.say`)}</p>
      ${r}
    </section>`;
	}
	rule(e, t, n) {
		return Pa(e, this.prefix, {
			label: e(`rule.${n}`),
			value: Wa(e, t, n),
			source: P(t, `rules.${n}`),
			to: {
				tab: "settings",
				section: "rules",
				id: n
			}
		});
	}
	renderConnection(e, t) {
		return this.block(e, "connection", e("grid.connection"), D`${hc(e, [Ec(t, "grid_power")])}
        <div class="mirrors">${this.rule(e, t.config, "grid_limit_w")} ${this.rule(e, t.config, "guard_grid")}</div>`);
	}
	renderTariff(e, t) {
		return this.block(e, "tariff", e("find.tariff"), D`${hc(e, [Cc(t, { missing: e("grid.tariff.unknown") })])}
        <joe-tariff-draft
          class="tariff-form"
          keep
          .hass=${this.hass}
          .t=${e}
          .config=${t.config}
          .discovery=${this.discovery}
        ></joe-tariff-draft>
        <div class="mirrors">${this.rule(e, t.config, "max_price")}</div>`, "grid_tariff");
	}
	renderSolar(e, t) {
		let n = t.config, r = n.forecast, i = n.learned.solar_factor, a = {
			tab: "review",
			section: "learned",
			id: "sun"
		};
		return this.block(e, "solar", e("devices.grid.solar"), D`${hc(e, [Ac(t), wc(t)])} ${this.renderSleeps(e, t)}
        ${r.provider && r.alternatives.length ? D`<div class="toggle-row" data-tipped>
              <span class="with-tip"><span id="combine-label">${e("learn.sources.combine")}</span>${l(e, "learn_combine")}</span>
              <button
                type="button"
                class="switch"
                role="switch"
                aria-checked=${String(r.combine)}
                aria-labelledby="combine-label"
                @click=${() => I(this, { forecast: { combine: !r.combine } })}
              ></button>
            </div>` : j}
        ${r.provider ? D`<div class="mirrors">
              <div class="mirror">
                <div class="mirror-text">
                  <span class="mirror-label">${e("grid.solar.factor")}</span>
                  <span class="mirror-sep" aria-hidden="true">·</span>
                  <span class="mirror-value">${i == null ? e("learn.still") : `× ${v(e.lang, i, 2)}`}</span>
                  ${i == null ? j : S(e, { source: "learned" })}
                  ${i == null ? j : D`<small class="mirror-hint">${Vc(e, i)}</small>`}
                </div>
                <a class="mini-btn quiet mirror-go" href=${E(this.prefix, a)} @click=${C(a)}
                  >${e("devices.page.more_learned")}</a
                >
              </div>
            </div>` : j}`);
	}
	renderSleeps(e, t) {
		let n = t.config.measurements.solar_power;
		if (!n.length) return j;
		let r = (e) => I(this, { measurements: { solar_power: n.map((t) => t.entity_id === e ? {
			...t,
			sleeps: !t.sleeps
		} : t) } });
		return D`${n.map((t, i) => D`<div class="toggle-row" data-tipped>
          <span class="with-tip"
            ><span id="sleeps-label-${i}"
              >${n.length > 1 ? e("solar.sleeps.named", { name: _(this.hass, t.entity_id) }) : e("solar.sleeps")}</span
            >${l(e, "solar_sleeps")}</span
          >
          <button
            type="button"
            class="switch"
            role="switch"
            aria-checked=${String(!!t.sleeps)}
            aria-labelledby="sleeps-label-${i}"
            @click=${() => r(t.entity_id)}
          ></button>
        </div>`)}`;
	}
	renderHome(e, t) {
		let n = {
			tab: "devices",
			section: "other"
		}, r = D`<a class="mini-btn go" href=${E(this.prefix, n)} @click=${C(n)}
      >${e("grid.home.devices")}</a
    >`;
		return this.block(e, "home", e("devices.grid.home"), hc(e, [Ec(t, "home_power", { devices: r })]));
	}
};
d([b({ attribute: !1 })], Hc.prototype, "anchor", void 0), u("joe-grid-page", Hc);
//#endregion
//#region src/pages/devices/hot-water-device.ts
var Uc = class extends q {
	static {
		this.styles = [
			k,
			K,
			oo,
			Ss,
			Do
		];
	}
	render() {
		let { t: e, hass: t, state: n, entry: r } = this;
		if (!e || !t || !n || !r) return j;
		let i = ta(this.ctx, r), a = r.consumer, o = a ? xs(this, e, t, n.config, a) : void 0, s = r.action;
		return s ? oa(this.ctx, {
			...i,
			why: En(e, n, s),
			now: D`<joe-action-tonight .hass=${t} .t=${e} .state=${n} .action=${s}></joe-action-tonight>`,
			steer: D`<joe-action-steer
        .hass=${t}
        .t=${e}
        .state=${n}
        .discovery=${this.discovery}
        .prefix=${this.prefix}
        .action=${s}
        .section=${"hot_water"}
      ></joe-action-steer>`,
			power: o,
			learned: s.kind === "target" ? ao([lo(e, n.config.learned, s)]) : void 0,
			learnedArea: "hot_water",
			tips: { steer: "device_steer" },
			removeTitle: e("devices.page.delete"),
			remove: D`<joe-action-delete
        .t=${e}
        .config=${n.config}
        .action=${s}
        .leave=${{
				tab: "devices",
				section: "hot_water"
			}}
      ></joe-action-delete>`
		}) : oa(this.ctx, {
			...i,
			now: a ? Co(e, this.prefix, "hot_water", a.id, e("devices.hot_water.lonely"), e("devices.hot_water.set_up"), "devices_lonely_hot_water") : void 0,
			power: o
		});
	}
};
d([b({ attribute: !1 })], Uc.prototype, "entry", void 0), u("joe-hot-water-device", Uc);
//#endregion
//#region src/pages/devices/hot-water.ts
var Wc = class extends q {
	static {
		this.styles = [
			k,
			K,
			Do
		];
	}
	render() {
		let { t: e, hass: t, state: n } = this;
		if (!e || !n) return j;
		let r = pt(this.devices, "hot_water", this.device);
		if (r) return D`<joe-hot-water-device
        .hass=${t}
        .t=${e}
        .state=${n}
        .route=${this.route}
        .prefix=${this.prefix}
        .discovery=${this.discovery}
        .info=${this.info}
        .checks=${this.checks}
        .climateFound=${this.climateFound}
        .devices=${this.devices}
        .entry=${r}
      ></joe-hot-water-device>`;
		let i = this.device ? wo(this.devices, this.device, "hot_water") : void 0;
		return D`<div class="wrap">
      ${ca(e, e("nav.devices.hot_water"), e("devices.hot_water.lead"), this.devices.some((e) => e.group === "hot_water"))}
      ${this.device === void 0 ? j : i ? To(e, this.prefix, i.name, i) : $i(e)}
      ${sa(this.ctx, this.devices, "hot_water", (r) => r.action ? { quick: D`<joe-action-tonight .hass=${t} .t=${e} .state=${n} .action=${r.action}></joe-action-tonight>` } : {})}
      <div class="group-actions">${la(e, this.prefix, "hot_water", e("devices.group_add.hot_water"))}</div>
    </div>`;
	}
};
d([b({ attribute: !1 })], Wc.prototype, "device", void 0), d([b({ attribute: !1 })], Wc.prototype, "sub", void 0), u("joe-hot-water-group", Wc);
//#endregion
//#region src/pages/devices/other-device.ts
var Gc = class extends q {
	static {
		this.styles = [
			k,
			K,
			oo,
			Ss,
			Do
		];
	}
	render() {
		let { t: e, hass: t, state: n, entry: r } = this;
		if (!e || !t || !n || !r) return j;
		let i = ta(this.ctx, r), a = r.consumer, o = r.action, s = a && a.energy_entity && a.kind !== "submeter" ? ao([co(e, n.config.learned, a)]) : void 0, c = !!(o && a && r.id === a.id), l = it("night", a?.id);
		return oa(this.ctx, {
			...i,
			why: o ? En(e, n, o) : i.why,
			now: o ? D`<joe-action-tonight .hass=${t} .t=${e} .state=${n} .action=${o}></joe-action-tonight>` : void 0,
			steer: o ? D`<joe-action-steer
              .hass=${t}
              .t=${e}
              .state=${n}
              .discovery=${this.discovery}
              .prefix=${this.prefix}
              .action=${o}
              .section=${"night"}
            ></joe-action-steer>` : a && a.kind !== "submeter" ? D`<p class="muted">${e("devices.other.night_offer")}</p>
              <a class="btn btn-secondary add-link" href=${E(this.prefix, l)} @click=${C(l, { sheet: !0 })}
                >${e("devices.other.night_add")}</a
              >` : void 0,
			power: a ? xs(this, e, t, n.config, a) : r.noMeter ? D`<p class="muted">${e("devices.other.no_meter")}</p>` : void 0,
			learned: s,
			learnedArea: "devices",
			tips: { steer: "device_steer" },
			removeTitle: e("devices.page.delete"),
			remove: o ? D`<joe-action-delete
            .t=${e}
            .config=${n.config}
            .action=${o}
            .leave=${c ? void 0 : {
				tab: "devices",
				section: "other"
			}}
          ></joe-action-delete>` : void 0
		});
	}
};
d([b({ attribute: !1 })], Gc.prototype, "entry", void 0), u("joe-other-device", Gc);
//#endregion
//#region src/pages/devices/other.ts
var Kc = class extends q {
	constructor(...e) {
		super(...e), this.moved = /* @__PURE__ */ new Map();
	}
	static {
		this.styles = [
			k,
			K,
			Ss,
			Do
		];
	}
	render() {
		let { t: e, state: t } = this;
		if (!e || !t) return j;
		let n = pt(this.devices, "other", this.device);
		if (n) return D`<joe-other-device
        .hass=${this.hass}
        .t=${e}
        .state=${t}
        .route=${this.route}
        .prefix=${this.prefix}
        .discovery=${this.discovery}
        .info=${this.info}
        .checks=${this.checks}
        .climateFound=${this.climateFound}
        .devices=${this.devices}
        .entry=${n}
      ></joe-other-device>`;
		let r = this.device ? wo(this.devices, this.device, "other") : void 0;
		return D`<div class="wrap">
      ${ca(e, e("nav.devices.other"), e("devices.other.lead"), this.devices.some((e) => e.group === "other"))}
      ${this.device === void 0 ? j : r ? To(e, this.prefix, r.name, r) : $i(e)}
      ${this.renderList(e, t)}
      <div class="group-actions">${la(e, this.prefix, "night", e("devices.group_add.night"))}</div>
    </div>`;
	}
	renderList(e, t) {
		let n = this.devices.filter((e) => e.group === "other"), r = new Map(t.config.consumers.map((e, t) => [e.id, t])), i = n.filter((e) => r.has(e.id)), a = n.filter((e) => !r.has(e.id) && !e.noMeter), o = n.filter((e) => e.noMeter), s = i.map((n) => ({
			at: r.get(n.id),
			html: this.card(e, t, n)
		}));
		for (let [t, i] of this.moved) {
			let a = n.some((e) => e.id === t) ? void 0 : wo(this.devices, t, "other");
			a && s.push({
				at: r.get(t) ?? Infinity,
				html: To(e, this.prefix, i, a)
			});
		}
		return s.sort((e, t) => e.at - t.at), !s.length && !a.length && !o.length ? D`<p class="muted">${e("devices.other.empty")}</p>` : D`${s.length || a.length ? D`<section data-tipped>
            <div class="list-head">
              <span>${e("consumers.kind")} ${l(e, "f_consumer_kind")}</span>
              <span>${e("consumers.runs")} ${l(e, "f_consumer_runs")}</span>
            </div>
            <div class="dcards">${s.map((e) => e.html)} ${a.map((n) => this.card(e, t, n))}</div>
          </section>` : j}
      ${o.length ? D`<h3 class="sub-group">${e("devices.no_meter_group")}</h3>
            <div class="dcards">${o.map((n) => this.card(e, t, n))}</div>` : j}`;
	}
	card(e, t, n) {
		let r = n.id === n.consumer?.id ? n.consumer : void 0, i = n.action ? D`<joe-action-tonight .hass=${this.hass} .t=${e} .state=${t} .action=${n.action}></joe-action-tonight>` : j, a = r ? D`${ys(e, r, (e) => this.setKind(r, e))}
        ${bs(e, r, (e) => void vs(this, r, e))} ${i}` : n.action ? i : void 0;
		return ti(e, this.prefix, ai(e, this.hass, t, n, { quick: a }));
	}
	async setKind(e, t) {
		if (!await _s(this, e, t)) return;
		let n = new Map(this.moved);
		gs.includes(t) ? n.set(e.id, e.name) : n.delete(e.id), this.moved = n;
	}
};
d([b({ attribute: !1 })], Kc.prototype, "device", void 0), d([b({ attribute: !1 })], Kc.prototype, "sub", void 0), d([T()], Kc.prototype, "moved", void 0), u("joe-other-group", Kc);
//#endregion
//#region src/pages/devices/index.ts
var qc = {
	all: "joe-devices-all",
	battery: "joe-battery-group",
	climate: "joe-climate-group",
	car: "joe-car-group",
	hot_water: "joe-hot-water-group",
	other: "joe-other-group",
	grid: "joe-grid-page"
}, Jc = class extends O {
	constructor(...e) {
		super(...e), this.prefix = A, this.checks = [], this.devices = [], this.behind = {
			tab: "devices",
			section: "all"
		};
	}
	static {
		this.styles = [k, w`
      :host {
        display: block;
      }
    `];
	}
	willUpdate(e) {
		this.t && this.state && [
			"t",
			"hass",
			"state",
			"climateFound",
			"discovery",
			"checks"
		].some((t) => e.has(t)) && (this.devices = dt(this.t, this.state, this.hass, {
			climateFound: this.climateFound,
			discovery: this.discovery,
			checks: this.checks
		})), e.has("route") && this.route && this.route.section !== "add" && (this.behind = this.route);
	}
	chips(e, t) {
		let n = new Set(ft(this.devices));
		this.state?.config.climate?.enabled && n.add("climate"), t !== "all" && t !== "add" && n.add(t);
		let r = [{
			id: "all",
			label: e("nav.devices.all"),
			icon: "mdi:view-grid-outline"
		}];
		for (let t of [
			"battery",
			"climate",
			"car",
			"hot_water",
			"other",
			"grid"
		].filter((e) => n.has(e))) {
			let n = t === "grid" ? 0 : this.devices.filter((e) => e.group === t).length;
			r.push({
				id: t,
				label: e(`nav.devices.${t}`),
				icon: $e[t],
				count: n ? v(e.lang, n, 0) : void 0,
				problem: mt(this.devices, t)
			});
		}
		return r;
	}
	render() {
		let e = this.t;
		if (!e || !this.state) return j;
		let t = (this.route?.section ?? ye.devices) === "add", n = t ? this.behind : this.route, r = n?.section ?? ye.devices;
		return D`${zr(e, this.prefix, "devices", this.chips(e, r), r)}${this.renderSection(r, n)}${t ? this.renderAdd() : j}`;
	}
	renderSection(e, t) {
		if (!customElements.get(qc[e])) return D``;
		let { t: n, hass: r, state: i, prefix: a, discovery: o, info: s, checks: c, climateFound: l, devices: u } = this;
		switch (e) {
			case "all": return D`<joe-devices-all
          .t=${n}
          .hass=${r}
          .state=${i}
          .prefix=${a}
          .route=${t}
          .discovery=${o}
          .info=${s}
          .checks=${c}
          .climateFound=${l}
          .devices=${u}
        ></joe-devices-all>`;
			case "climate": return D`<joe-climate-group
          .t=${n}
          .hass=${r}
          .state=${i}
          .prefix=${a}
          .route=${t}
          .discovery=${o}
          .info=${s}
          .checks=${c}
          .climateFound=${l}
          .devices=${u}
          .entity=${t?.id}
          .sub=${t?.sub}
        ></joe-climate-group>`;
			case "battery": return D`<joe-battery-group
          .t=${n}
          .hass=${r}
          .state=${i}
          .prefix=${a}
          .route=${t}
          .discovery=${o}
          .info=${s}
          .checks=${c}
          .climateFound=${l}
          .devices=${u}
          .device=${t?.id}
          .sub=${t?.sub}
        ></joe-battery-group>`;
			case "car": return D`<joe-car-group
          .t=${n}
          .hass=${r}
          .state=${i}
          .prefix=${a}
          .route=${t}
          .discovery=${o}
          .info=${s}
          .checks=${c}
          .climateFound=${l}
          .devices=${u}
          .device=${t?.id}
          .sub=${t?.sub}
        ></joe-car-group>`;
			case "hot_water": return D`<joe-hot-water-group
          .t=${n}
          .hass=${r}
          .state=${i}
          .prefix=${a}
          .route=${t}
          .discovery=${o}
          .info=${s}
          .checks=${c}
          .climateFound=${l}
          .devices=${u}
          .device=${t?.id}
          .sub=${t?.sub}
        ></joe-hot-water-group>`;
			case "other": return D`<joe-other-group
          .t=${n}
          .hass=${r}
          .state=${i}
          .prefix=${a}
          .route=${t}
          .discovery=${o}
          .info=${s}
          .checks=${c}
          .climateFound=${l}
          .devices=${u}
          .device=${t?.id}
          .sub=${t?.sub}
        ></joe-other-group>`;
			case "grid": return D`<joe-grid-page
          .t=${n}
          .hass=${r}
          .state=${i}
          .prefix=${a}
          .route=${t}
          .discovery=${o}
          .info=${s}
          .checks=${c}
          .climateFound=${l}
          .devices=${u}
          .anchor=${t?.id}
        ></joe-grid-page>`;
		}
	}
	renderAdd() {
		return D`<joe-device-add
      .t=${this.t}
      .hass=${this.hass}
      .state=${this.state}
      .prefix=${this.prefix}
      .route=${this.route}
      .discovery=${this.discovery}
      .devices=${this.devices}
      .behind=${this.behind}
      .kind=${this.route?.id}
      .consumer=${this.route?.sub}
    ></joe-device-add>`;
	}
};
d([b({ attribute: !1 })], Jc.prototype, "hass", void 0), d([b({ attribute: !1 })], Jc.prototype, "t", void 0), d([b({ attribute: !1 })], Jc.prototype, "state", void 0), d([b({ attribute: !1 })], Jc.prototype, "route", void 0), d([b({ attribute: !1 })], Jc.prototype, "prefix", void 0), d([b({ attribute: !1 })], Jc.prototype, "discovery", void 0), d([b({ attribute: !1 })], Jc.prototype, "info", void 0), d([b({ attribute: !1 })], Jc.prototype, "checks", void 0), d([b({ attribute: !1 })], Jc.prototype, "climateFound", void 0), u("joe-devices-page", Jc);
//#endregion
//#region src/uses.ts
function Yc(e, t) {
	let n = e.climate;
	if (!n?.enabled) return [];
	let r = t ? new Set(t.devices.map((e) => e.entity_id)) : null;
	return Object.entries(n.rooms ?? {}).filter(([e, t]) => t.enabled && (!r || r.has(e))).map(([e]) => e);
}
function Xc(e, t) {
	return (e.cars ?? []).filter((e) => e.need.enabled).filter((e) => {
		let n = e.need.persons;
		return t === void 0 ? n === null || n.length > 0 : n === null || n.includes(t);
	}).map((e) => ({
		label: e.name,
		to: `/devices/car/${encodeURIComponent(e.id)}`
	}));
}
function Zc(e, t) {
	return t.length ? [{
		label: e("usedby.climate"),
		to: "/devices/climate",
		count: t.length
	}] : [];
}
function Qc(e, t, n) {
	let r = Zc(e, Yc(t, n));
	return t.persons.some((e) => e.person_entity) && r.push({
		label: e("usedby.learn"),
		to: "/review/learned/presence"
	}), r;
}
function $c(e, t, n) {
	let r = t.persons.some((e) => e.calendars.length), i = [];
	return (t.context.holiday_entity || r) && (i.push({
		label: e("usedby.plan"),
		to: "/plan"
	}), i.push({
		label: e("usedby.consumption"),
		to: "/review/learned/consumption"
	})), r && i.push(...Xc(t).map((t) => ({
		...t,
		label: e("usedby.car", { name: t.label })
	}))), (t.context.holiday_entity || r || t.context.free_day_entities?.length) && i.push(...Zc(e, Yc(t, n))), i;
}
function el(e, t, n) {
	return Zc(e, Yc(t, n).filter((e) => t.climate?.rooms[e]?.night_off));
}
function tl(e, t, n, r) {
	let i = [];
	return n !== "routing" && t.context.weather_entity && (i.push({
		label: e("usedby.plan"),
		to: "/plan"
	}), i.push({
		label: e("usedby.consumption"),
		to: "/review/learned/consumption"
	}), i.push(...Zc(e, Yc(t, r)))), n !== "weather" && t.routing.service && (i.push(...Xc(t).map((t) => ({
		...t,
		label: e("usedby.car", { name: t.label })
	}))), (t.climate?.route_eta ?? !0) && Yc(t, r).length && i.push({
		label: e("usedby.way"),
		to: "/household/presence/way"
	})), i.filter((e, t) => i.findIndex((t) => t.label === e.label) === t);
}
function nl(e, t, n) {
	return t.persons.find((e) => e.id === n)?.calendars.length ? Xc(t, n) : [];
}
//#endregion
//#region src/components/used-by.ts
function rl(e, t) {
	if (typeof t == "string") return t;
	let [n, r] = e("word.device").split("|");
	return `${v(e.lang, t, 0)} ${t === 1 ? n : r}`;
}
function il(e, t, n) {
	return n.length ? D`<p class="used-by">
    <ha-icon icon="mdi:link-variant"></ha-icon>
    <span class="used-by-label">${e("usedby.label")}</span>
    ${n.map((n) => {
		let r = n.count === void 0 ? n.label : `${n.label} (${rl(e, n.count)})`;
		return n.to ? D`<a class="used-by-item" href=${E(t, n.to)} @click=${C(n.to)}>${r}</a>` : D`<span class="used-by-item">${r}</span>`;
	})}
  </p>` : D`<p class="used-by none"><ha-icon icon="mdi:link-variant-off"></ha-icon>${e("usedby.none")}</p>`;
}
//#endregion
//#region src/pages/household/head.ts
function al(e, t, n, r, i) {
	return D`<div class="page-head">
    ${y(n)} ${M}
    <p class="lead">${r}</p>
    ${i ? il(e, t, i) : ""}
  </div>`;
}
function ol(e, t, n) {
	let r = new Date(t);
	if (Number.isNaN(r.getTime())) return null;
	let i = {
		hour: "2-digit",
		minute: "2-digit"
	};
	try {
		return r.toLocaleTimeString(e, {
			...i,
			timeZone: n
		});
	} catch {
		return r.toLocaleTimeString(e, i);
	}
}
function sl(e) {
	return `${String(Math.floor(e / 60)).padStart(2, "0")}:${String(e % 60).padStart(2, "0")}`;
}
function cl(e) {
	try {
		return new Intl.DateTimeFormat("en-CA", { timeZone: e }).format(/* @__PURE__ */ new Date());
	} catch {
		return new Intl.DateTimeFormat("en-CA").format(/* @__PURE__ */ new Date());
	}
}
//#endregion
//#region src/pages/household/styles.ts
var ll = w`
  :host {
    display: block;
  }
  .wrap {
    max-width: 1100px;
    margin: 0 auto;
  }
  .page-head {
    margin-top: 6px;
  }
  .page-head .lead {
    margin-bottom: 4px;
  }
  .card {
    padding: 18px 20px;
    margin-top: 14px;
  }
  .head {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .head .eyebrow {
    flex: 1;
    min-width: 0;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 8px 12px;
    flex-wrap: wrap;
    margin-top: 12px;
  }
  .row > span:first-child {
    flex: 1 1 160px;
    min-width: 0;
  }
  .row.tight {
    margin-top: 6px;
  }
  .row .input {
    width: auto;
    min-width: 0;
  }
  .row .input.short {
    width: 90px;
  }
  .hint {
    margin: 8px 0 0;
    color: var(--joe-muted);
    font-size: 13px;
  }
  .say {
    margin: 10px 0 0;
    font-size: 15px;
    line-height: 1.5;
    color: var(--joe-ink-2);
    max-width: 62ch;
  }
  .now {
    margin: 10px 0 0;
    font-weight: 600;
  }
  .chips-line {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    flex: 1 1 160px;
    min-width: 0;
  }
  .chips-line .chip {
    white-space: normal;
    overflow-wrap: anywhere;
  }
  .card .note {
    margin-top: 10px;
  }
  .card .used-by {
    margin-top: 12px;
  }
  /* Short names ("Plan") still make a 44 px target. */
  .used-by a {
    min-width: 44px;
    justify-content: center;
  }
  @media (max-width: 760px) {
    .card {
      padding: 16px;
    }
  }
`, ul = [
	"vacation",
	"travel",
	"home_office",
	"office",
	"guests",
	"home"
];
function dl(e) {
	let t = e;
	for (; t;) {
		let e = t.parentNode instanceof ShadowRoot ? t.parentNode.host : t.parentNode;
		if (e instanceof HTMLElement && e.scrollTop > 0) return e;
		t = e;
	}
	return document.scrollingElement;
}
var fl = class extends O {
	constructor(...e) {
		super(...e), this.prefix = A, this.checks = [], this.keyword = {}, this.quiet = !1;
	}
	static {
		this.styles = [
			k,
			ll,
			fc,
			w`
      .preview {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
        margin-top: 12px;
      }
      .day {
        min-width: 0;
        padding: 12px 14px;
        border-radius: 12px;
        background: var(--joe-surface-2);
      }
      .day-head {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px 10px;
      }
      .day-head b {
        flex: 1 1 auto;
        font-weight: 700;
      }
      .day .now {
        margin-top: 8px;
      }
      .day ul {
        list-style: none;
        margin: 6px 0 0;
        padding: 0;
        display: grid;
        gap: 2px;
        font-size: 14px;
        color: var(--joe-ink-2);
      }
      .found {
        margin-top: 12px;
      }
      .sub {
        margin-top: 16px;
        padding-top: 12px;
        border-top: 1px solid var(--joe-line);
      }
      .sub-head {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 16px;
        font-size: 14px;
      }
      .scopes {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 10px;
      }
      .scopes a {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        min-height: 44px;
        padding: 6px 14px;
        border-radius: 999px;
        background: var(--joe-surface-2);
        color: var(--joe-ink-2);
        font-weight: 600;
        font-size: 14px;
        text-decoration: none;
        transition: background 0.12s, color 0.12s;
      }
      .scopes a:hover {
        background: var(--joe-line);
        color: var(--joe-ink);
      }
      .scopes a[aria-current="true"] {
        background: var(--joe-ink);
        color: var(--joe-bg);
      }
      .own-rules {
        --mdc-icon-size: 16px;
      }
      .toggle-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid var(--joe-line);
      }
      .rules {
        display: grid;
        gap: 2px;
        margin-top: 12px;
      }
      .rule {
        display: grid;
        grid-template-columns: 150px minmax(0, 1fr);
        gap: 6px 12px;
        align-items: center;
        padding: 8px 0;
        border-top: 1px solid var(--joe-line);
      }
      .rule:first-child {
        border-top: 0;
      }
      .keywords {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;
        min-width: 0;
      }
      .keyword {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        max-width: 100%;
        padding: 2px 4px 2px 10px;
        border-radius: 999px;
        background: var(--joe-surface-2);
        font-size: 13.5px;
        overflow-wrap: anywhere;
      }
      .keyword button {
        display: grid;
        place-items: center;
        flex: none;
        width: 26px;
        height: 26px;
        padding: 0;
        border: 0;
        border-radius: 50%;
        background: transparent;
        color: var(--joe-muted);
        cursor: pointer;
        transition: background 0.12s, color 0.12s;
      }
      .keyword button:hover {
        background: var(--joe-line);
        color: var(--joe-ink);
      }
      .keyword button:active {
        transform: scale(0.94);
      }
      .keyword ha-icon {
        --mdc-icon-size: 15px;
      }
      form.add {
        display: inline-flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px;
        max-width: 100%;
      }
      form.add .input {
        width: 150px;
        min-height: 34px;
        padding: 6px 10px;
      }
      .defaults {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
        margin-top: 8px;
      }
      .defaults .field {
        margin-top: 0;
      }
      @media (pointer: coarse) {
        .keyword {
          padding-block: 0;
        }
        .keyword button {
          width: 44px;
          height: 44px;
          margin-right: -4px;
        }
        form.add .input {
          min-height: 44px;
        }
      }
      @media (max-width: 760px) {
        .preview,
        .defaults,
        .rule {
          grid-template-columns: 1fr;
        }
      }
    `
		];
	}
	render() {
		let { t: e, state: t, hass: n } = this;
		return !e || !t || !n ? j : D`<div class="wrap">
      ${al(e, this.prefix, e("household.days.title"), e("household.days.lead"), $c(e, t.config, this.climateFound))}
      ${this.renderPreview(e, t)} ${this.renderFree(e, n, t)} ${this.renderCalendar(e, t)}
    </div>`;
	}
	renderPreview(e, t) {
		let n = t.climate?.day, r = t.config.persons, i = this.hass?.config?.time_zone, a = cl(i), o = t.plan?.meta?.tomorrow, s = o && o.date > a ? o : void 0, c = n ? n.holiday ? "holiday" : n.weekend && n.free ? "weekend" : "workday" : null, u = n?.labels_state ?? (n?.labels_at ? "ok" : "unread"), d = u === "ok" && n?.labels_at ? ol(e.lang, n.labels_at, i) : null, f = t.climate, p = n ? !f?.home.length && f?.nobody_since ? "away" : n.holiday ? "holiday" : n.home_office.length && !n.free ? "home_office" : "normal" : null, m = null;
		if (s) {
			let e = (/* @__PURE__ */ new Date(`${s.date}T12:00:00Z`)).getUTCDay(), t = e === 0 || e === 6;
			m = s.workday ? Object.values(s.labels).includes("home_office") ? "home_office" : "normal" : t ? "normal" : "holiday";
		}
		let h = (t) => t ? D`<span class="chip ${t === "normal" ? "" : "soon"}"><ha-icon icon=${Ms[t]}></ha-icon>${e(`week.tag.${t}`)}</span>` : j;
		return D`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:calendar-today"></ha-icon>${e("household.days.preview")}</div>
        ${l(e, "household_days_preview")}
      </div>
      <div class="preview">
        <div class="day">
          <div class="day-head">
            <b>${e("household.days.preview.today")} · ${U(e.lang, a, "weekday")}</b>${h(p)}
          </div>
          ${c ? D`<p class="now">${e(`climate.today.${c}`)}</p>` : D`<p class="hint">${e("household.days.preview.unknown")}</p>`}
          ${n ? D`<p class="hint">
                ${n.home_office_available ? u === "ok" ? n.home_office.length ? e("climate.today.ho", { names: n.home_office.join(", ") }) : e("climate.today.ho_none") : e(`climate.today.labels_${u}`) : e(`week.ho.${n.home_office_reason ?? "no_calendar"}`)}
                ${d ? e("climate.today.read_at", { time: d }) : j}
              </p>` : j}
        </div>
        <div class="day">
          <div class="day-head">
            <b>${e("household.days.preview.tomorrow")}${s ? D` · ${U(e.lang, s.date, "weekday")}` : j}</b>${h(m)}
          </div>
          ${s ? D`<p class="now">${e(s.workday ? "household.days.preview.workday" : "household.days.preview.day_off")}</p>
                ${Object.keys(s.labels).length ? D`<ul>
                      ${Object.entries(s.labels).map(([t, n]) => D`<li>
                            ${e("household.days.preview.person", {
			name: r.find((e) => e.id === t)?.name ?? t,
			label: e(`label.${n}`)
		})}
                          </li>`)}
                    </ul>` : j}` : D`<p class="hint">${e("household.days.preview.no_plan")}</p>`}
        </div>
      </div>
    </section>`;
	}
	renderFree(e, t, n) {
		let r = n.config, i = r.context.free_day_entities ?? [];
		return D`<section class="card">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:calendar-star"></ha-icon>${e("household.days.free")}</div>
      </div>
      ${hc(e, [_c(this, t, e, r, this.discovery, "holiday", (n) => G(e, ei(t, n, _(t, n))))])}
      <div class="sub" data-tipped>
        <div class="row">
          <span>${e("climate.today.free_by")}</span>
          ${l(e, "climate_free_entities")}
        </div>
        <div class="row tight">
          <span class="chips-line">
            ${i.length ? i.map((e) => {
			let n = [
				"on",
				"true",
				"home"
			].includes(t.states[e]?.state ?? "");
			return D`<span class="chip ${n ? "ok" : ""}" title=${e}>${_(t, e)}</span>`;
		}) : D`<small class="hint">${e("climate.today.free_none")}</small>`}
          </span>
          <button type="button" class="btn btn-secondary" @click=${() => void this.pickFree()}>
            ${e(i.length ? "climate.today.free_change" : "climate.today.free_pick")}
          </button>
        </div>
      </div>
    </section>`;
	}
	async pickFree() {
		let e = this.t;
		if (!e) return;
		let t = await L(this, {
			heading: e("pick.free_day.title"),
			tip: "pick_free_day",
			filter: "toggle_like",
			multiple: !0,
			selected: this.state?.config.context.free_day_entities ?? []
		});
		t && I(this, { context: { free_day_entities: t.selected } });
	}
	renderCalendar(e, t) {
		let n = t.config, r = this.chosen(), i = !!r && !r.calendar, a = r?.calendar ?? n.calendar, o = (e) => a.rules.filter((t) => t.label === e), s = n.persons.some((e) => e.calendars.length), c = {
			tab: "household",
			section: "days"
		}, u = {
			tab: "household",
			section: "people"
		};
		return D`<section class="card" data-anchor="calendar" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:calendar-text-outline"></ha-icon>${e("learn.calendar")}</div>
        ${l(e, "learn_calendar")}
      </div>
      <p class="say">${e("learn.calendar.say")}</p>
      ${s ? j : D`<div class="note">
            <ha-icon icon="mdi:information-outline"></ha-icon>
            <span
              >${e("household.days.no_calendars")}
              <a href=${E(this.prefix, u)} @click=${C(u)}>${e("household.days.to_people")}</a></span
            >
          </div>`}
      ${n.persons.length ? D`<div data-tipped>
            <div class="sub-head"><b>${e("learn.calendar.for")}</b>${l(e, "cal_person")}</div>
            <nav class="scopes" aria-label=${e("learn.calendar.for")}>
              <a href=${E(this.prefix, c)} aria-current=${String(!r)} @click=${(e) => this.choose(e, c)}
                >${e("learn.calendar.everyone")}</a
              >
              ${n.persons.map((t) => {
			let n = {
				tab: "household",
				section: "days",
				id: t.id
			};
			return D`<a href=${E(this.prefix, n)} aria-current=${String(t.id === r?.id)} @click=${(e) => this.choose(e, n)}
                  >${t.name}${t.calendar ? D`<ha-icon class="own-rules" icon="mdi:account-cog-outline" title=${e("household.days.own_rules")}></ha-icon>` : j}</a
                >`;
		})}
            </nav>
          </div>` : j}
      ${this.person && !r ? D`<div class="note warn" role="status">
            <ha-icon icon="mdi:help-circle-outline"></ha-icon><span>${e("household.days.not_found")}</span>
          </div>` : j}
      ${r ? D`<div class="toggle-row" data-tipped>
            <span class="with-tip"><span id="cal-shared-label">${e("learn.calendar.shared")}</span>${l(e, "cal_shared")}</span>
            <button
              type="button"
              class="switch"
              role="switch"
              aria-checked=${String(i)}
              aria-labelledby="cal-shared-label"
              @click=${() => this.saveCalendar(r, i ? structuredClone(n.calendar) : null)}
            ></button>
          </div>` : j}
      ${i ? D`<p class="say">${e("learn.calendar.shared.say", { name: r.name })}</p>` : D`<div class="rules">
              ${ul.map((t) => D`<div class="rule">
                  <b>${e(`label.${t}`)}</b>
                  <div class="keywords">
                    ${o(t).map((t) => D`<span class="keyword"
                          >${t.keyword}<button
                            type="button"
                            aria-label=${e("learn.calendar.remove", { keyword: t.keyword })}
                            @click=${() => this.saveRules(a.rules.filter((e) => e !== t))}
                          >
                            <ha-icon icon="mdi:close"></ha-icon></button
                        ></span>`)}
                    <form
                      class="add"
                      @submit=${(e) => {
			e.preventDefault(), this.addKeyword(a, t);
		}}
                    >
                      <input
                        class="input"
                        .value=${this.keyword[t] ?? ""}
                        maxlength="40"
                        placeholder=${e("learn.calendar.keyword")}
                        aria-label=${e("learn.calendar.add_to", { label: e(`label.${t}`) })}
                        @input=${(e) => this.keyword = {
			...this.keyword,
			[t]: e.target.value
		}}
                      />
                      <button type="submit" class="mini-btn" ?disabled=${!(this.keyword[t] ?? "").trim()}>
                        <ha-icon icon="mdi:plus"></ha-icon>${e("learn.calendar.add")}
                      </button>
                    </form>
                  </div>
                </div>`)}
            </div>
            <div data-tipped>
              <div class="sub-head"><b>${e("learn.calendar.defaults")}</b>${l(e, "cal_defaults")}</div>
              <div class="defaults">
                ${["default_workday", "default_day_off"].map((t) => D`<label class="field">
                    <span class="field-label">${e(`learn.calendar.${t}`)}</span>
                    <select
                      class="input"
                      @change=${(e) => this.saveCalendarPart({ [t]: e.target.value })}
                    >
                      ${Vn.map((n) => D`<option value=${n} ?selected=${a[t] === n}>${e(`label.${n}`)}</option>`)}
                    </select>
                  </label>`)}
              </div>
            </div>`}
    </section>`;
	}
	choose(e, t) {
		if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
		e.preventDefault(), this.quiet = !0;
		let n = dl(this), r = n?.scrollTop ?? 0;
		x(this, t, { replace: !0 }), n && (n.scrollTop = r);
	}
	chosen() {
		return this.person ? this.state?.config.persons.find((e) => e.id === this.person) : void 0;
	}
	addKeyword(e, t) {
		let n = (this.keyword[t] ?? "").trim().toLowerCase();
		n && !e.rules.some((e) => e.keyword.toLowerCase() === n && e.label === t) && (this.keyword = {
			...this.keyword,
			[t]: ""
		}, this.saveRules([...e.rules, {
			keyword: n,
			label: t
		}]));
	}
	saveRules(e) {
		let t = ul.flatMap((t) => e.filter((e) => e.label === t));
		this.saveCalendarPart({ rules: t });
	}
	saveCalendarPart(e) {
		let t = this.chosen();
		t?.calendar ? this.saveCalendar(t, {
			...t.calendar,
			...e
		}) : I(this, { calendar: e });
	}
	saveCalendar(e, t) {
		I(this, { persons: { [e.id]: { calendar: t } } });
	}
	willUpdate(e) {
		e.has("person") && (this.revealed = this.quiet ? this.person : void 0, this.quiet = !1, this.keyword = {});
	}
	updated() {
		this.person && this.revealed !== this.person && ve(this.renderRoot, "calendar") && (this.revealed = this.person);
	}
};
d([b({ attribute: !1 })], fl.prototype, "hass", void 0), d([b({ attribute: !1 })], fl.prototype, "t", void 0), d([b({ attribute: !1 })], fl.prototype, "state", void 0), d([b({ attribute: !1 })], fl.prototype, "route", void 0), d([b({ attribute: !1 })], fl.prototype, "prefix", void 0), d([b({ attribute: !1 })], fl.prototype, "discovery", void 0), d([b({ attribute: !1 })], fl.prototype, "checks", void 0), d([b({ attribute: !1 })], fl.prototype, "climateFound", void 0), d([b({ attribute: !1 })], fl.prototype, "person", void 0), d([T()], fl.prototype, "keyword", void 0), u("joe-hh-days", fl);
//#endregion
//#region src/pages/household/night.ts
var pl = "23:00", ml = "06:30", hl = class extends O {
	constructor(...e) {
		super(...e), this.prefix = A, this.checks = [];
	}
	static {
		this.styles = [
			k,
			ll,
			w`
      .seg {
        flex-wrap: wrap;
      }
      .entity-row b {
        overflow-wrap: anywhere;
      }
      ul.devices {
        list-style: none;
        margin: 10px 0 0;
        padding: 0;
        display: grid;
      }
      ul.devices li {
        border-top: 1px solid var(--joe-line);
      }
      ul.devices li:first-child {
        border-top: 0;
      }
      ul.devices a {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 4px 12px;
        min-height: 44px;
        padding: 6px 0;
        color: var(--joe-ink);
        text-decoration: none;
      }
      ul.devices a:hover b {
        text-decoration: underline;
        text-decoration-color: var(--joe-amber);
        text-underline-offset: 3px;
      }
      ul.devices b {
        flex: 1 1 160px;
        min-width: 0;
        font-weight: 600;
        overflow-wrap: anywhere;
      }
      ul.devices span {
        color: var(--joe-ink-2);
        font-variant-numeric: tabular-nums;
      }
      ul.devices ha-icon {
        color: var(--joe-muted);
      }
      .go-link {
        display: inline-flex;
        align-items: center;
        min-height: 44px;
        margin-top: 4px;
        font-weight: 600;
        color: var(--joe-ink);
        text-decoration: underline;
        text-decoration-color: var(--joe-line-2);
        text-underline-offset: 3px;
      }
      .go-link:hover {
        text-decoration-color: var(--joe-amber);
      }
    `
		];
	}
	render() {
		let { t: e, state: t } = this;
		return !e || !t || !this.hass ? j : D`<div class="wrap">
      ${al(e, this.prefix, e("household.night.title"), e("household.night.lead"), el(e, t.config, this.climateFound))}
      ${this.renderSource(e, t)} ${this.renderDevices(e, t)}
    </div>`;
	}
	renderSource(e, t) {
		let n = this.hass, r = t.config.climate, i = r?.night_by ?? "time", a = r?.night_entity ?? null, o = a ? n.states[a] : void 0;
		return D`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:weather-night"></ha-icon>${e("household.night.source")}</div>
        ${l(e, "climate_night_source")}
      </div>
      <div class="row">
        <span>${e("climate.night.by")}</span>
        <span class="seg" role="group" aria-label=${e("climate.night.by")}>
          ${["time", "entity"].map((t) => D`<button type="button" aria-pressed=${String(i === t)} @click=${() => this.setNightBy(t)}>
              ${e(`climate.night.by.${t}`)}
            </button>`)}
        </span>
      </div>
      ${i === "entity" ? D`<div class="row entity-row">
              <span>${a ? D`<b title=${a}>${_(n, a)}</b>` : e("climate.night.no_entity")}</span>
              ${o ? D`<span class="chip ${o.state === "on" ? "ok" : ""}"
                    >${e(o.state === "on" ? "climate.night.now_on" : "climate.night.now_off")}</span
                  >` : j}
              ${a ? G(e, ei(n, a, _(n, a))) : j}
              <button type="button" class="btn btn-secondary" @click=${() => void this.pickNight()}>
                ${e(a ? "climate.night.change" : "climate.night.pick")}
              </button>
            </div>
            <p class="hint">${e("climate.night.entity_say")}</p>` : D`<p class="hint">${e("climate.night.time_say")}</p>`}
    </section>`;
	}
	renderDevices(e, t) {
		let n = t.config.climate, r = n?.night_by === "entity", i = Object.fromEntries((this.climateFound?.devices ?? []).map((e) => [e.entity_id, e.name])), a = Object.entries(n?.rooms ?? {}).filter(([, e]) => e.night_off), o = {
			tab: "devices",
			section: "climate"
		};
		return D`<section class="card">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:power-sleep"></ha-icon>${e("household.night.devices")}</div>
      </div>
      ${a.length ? D`<ul class="devices">
            ${a.map(([t, a]) => {
			let o = {
				tab: "devices",
				section: "climate",
				id: t
			}, s = a.night_from || pl, c = a.night_until || ml;
			return D`<li>
                <a href=${E(this.prefix, o)} @click=${C(o)}>
                  <b>${i[t] ?? _(this.hass, t)}</b>
                  <span>${r ? e("household.night.until", { until: c }) : e("household.night.span", {
				from: s,
				until: c
			})}</span>
                  ${a.enabled && n?.enabled ? j : D`<small class="hint">${e("household.night.not_steered")}</small>`}
                  <ha-icon icon="mdi:chevron-right"></ha-icon>
                </a>
              </li>`;
		})}
          </ul>` : D`<p class="hint">${e("household.night.devices.none")}</p>`}
      <a class="go-link" href=${E(this.prefix, o)} @click=${C(o)}>${e("household.night.to_climate")}</a>
    </section>`;
	}
	setNightBy(e) {
		I(this, { climate: { night_by: e } }), e === "entity" && !this.state?.config.climate?.night_entity && this.pickNight();
	}
	async pickNight() {
		let e = this.t;
		if (!e) return;
		let t = this.state?.config.climate?.night_entity, n = await L(this, {
			heading: e("pick.night.title"),
			tip: "pick_night",
			filter: "night",
			selected: t ? [t] : []
		});
		n && I(this, { climate: {
			night_by: "entity",
			night_entity: n.selected[0] ?? null
		} });
	}
};
d([b({ attribute: !1 })], hl.prototype, "hass", void 0), d([b({ attribute: !1 })], hl.prototype, "t", void 0), d([b({ attribute: !1 })], hl.prototype, "state", void 0), d([b({ attribute: !1 })], hl.prototype, "route", void 0), d([b({ attribute: !1 })], hl.prototype, "prefix", void 0), d([b({ attribute: !1 })], hl.prototype, "discovery", void 0), d([b({ attribute: !1 })], hl.prototype, "checks", void 0), d([b({ attribute: !1 })], hl.prototype, "climateFound", void 0), u("joe-hh-night", hl);
//#endregion
//#region src/household-helpers.ts
var gl = "gast";
function _l(e) {
	return Object.values(e.states).filter((e) => e.entity_id.startsWith("group.")).map((e) => ({
		state: e,
		members: e.attributes.entity_id ?? []
	})).filter(({ members: e }) => e.length && e.every((e) => /^(person|device_tracker)\./.test(e))).map(({ state: t, members: n }) => ({
		entity_id: t.entity_id,
		name: _(e, t.entity_id),
		members: n.map((t) => _(e, t))
	}));
}
async function vl(e, t, n) {
	if (!t.callApi || !t.callService) throw Error("no api");
	let r = `input_boolean.${(await t.callWS({
		type: "input_boolean/create",
		name: n("household.guest.name"),
		icon: "mdi:account-child-outline"
	})).id}`, i = `device_tracker.${gl}`;
	return await t.callApi("POST", `config/automation/config/energy_joe_${gl}`, {
		alias: n("household.guest.automation"),
		description: n("household.guest.automation_text", {
			guest: r,
			tracker: i
		}),
		triggers: [
			{
				trigger: "state",
				entity_id: r
			},
			{
				trigger: "time_pattern",
				minutes: "/1"
			},
			{
				trigger: "homeassistant",
				event: "start"
			}
		],
		conditions: [],
		actions: [{
			action: "device_tracker.see",
			data: {
				dev_id: gl,
				host_name: n("household.guest.tracker_name"),
				location_name: `{{ 'home' if is_state('${r}', 'on') else 'not_home' }}`
			}
		}],
		mode: "queued"
	}), await t.callService("device_tracker", "see", {
		dev_id: gl,
		host_name: n("household.guest.tracker_name"),
		location_name: "not_home"
	}), I(e, { context: {
		guest_switch: r,
		guest_tracker: i
	} }), i;
}
function yl(e, t) {
	let n = e.states[t]?.state === "on";
	e.callService?.("input_boolean", n ? "turn_off" : "turn_on", { entity_id: t });
}
//#endregion
//#region src/editors/household.ts
var bl = class extends O {
	constructor(...e) {
		super(...e), this.detailed = !1;
	}
	static {
		this.styles = [k, w`
      :host {
        display: block;
      }
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 8px;
      }
      li.person {
        padding: 12px 14px;
        border-radius: 12px;
        background: var(--joe-surface);
        box-shadow: inset 0 0 0 1px var(--joe-line);
      }
      .top {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px 12px;
      }
      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        flex: none;
        display: grid;
        place-items: center;
        background: var(--joe-amber-soft);
        color: var(--joe-amber-text);
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 800;
        font-size: 20px;
      }
      .who {
        flex: 1 1 120px;
        min-width: 0;
      }
      .who b {
        display: block;
        font-weight: 700;
        overflow-wrap: anywhere;
      }
      .who small {
        color: var(--joe-ink-2);
        font-size: 13px;
      }
      .home {
        color: var(--joe-good) !important;
        font-weight: 600;
      }
      .top-actions {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-left: auto;
      }
      .cals {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
        margin-top: 10px;
      }
      .cal {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        max-width: 100%;
        padding: 4px 6px 4px 10px;
        border-radius: 999px;
        background: var(--joe-info-soft);
        color: var(--joe-ink);
        font-size: 13px;
        font-weight: 600;
        overflow-wrap: anywhere;
      }
      .cal button {
        width: 24px;
        height: 24px;
        flex: none;
        border: 0;
        border-radius: 50%;
        display: grid;
        place-items: center;
        cursor: pointer;
        background: transparent;
        color: var(--joe-ink-2);
      }
      .cal button:hover {
        background: var(--joe-surface);
        color: var(--joe-ink);
      }
      .cal svg {
        width: 14px;
        height: 14px;
      }
      .cals-label {
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--joe-muted);
        margin-right: 2px;
      }
      .add {
        margin-top: 10px;
      }
      .others {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;
        margin-top: 12px;
        color: var(--joe-ink-2);
        font-size: 14px;
      }
      .empty {
        color: var(--joe-muted);
        margin: 0;
      }
      @media (pointer: coarse) {
        .cal {
          padding-block: 0;
        }
        .cal button {
          width: 44px;
          height: 44px;
          margin: 0 -6px 0 -8px;
        }
      }
    `];
	}
	render() {
		let { t: e, hass: t, config: n } = this;
		if (!e || !t || !n) return j;
		let r = (this.discovery?.persons ?? []).filter((e) => F(n, `person:${e.entity_id}`) && !n.persons.some((t) => t.id === e.entity_id));
		return D`${n.persons.length ? D`<ul>
            ${n.persons.map((n) => this.renderPerson(e, t, n))}
          </ul>` : D`<p class="empty">${e("household.empty")}</p>`}
      <div class="with-tip add" data-tipped>
        <button type="button" class="mini-btn" @click=${this.addPerson}>
          <ha-icon icon="mdi:account-plus-outline"></ha-icon>${e("household.add")}
        </button>
        ${l(e, "f_person_add")}
      </div>
      ${r.length ? D`<div class="others" data-tipped>
            <span>${e("household.left_out")}</span>
            ${r.map((e) => D`<button type="button" class="mini-btn quiet" @click=${() => this.bringBack(e)}>
                <ha-icon icon="mdi:undo-variant"></ha-icon>${e.name}
              </button>`)}
            ${l(e, "household_left_out")}
          </div>` : j}`;
	}
	renderPerson(e, t, n) {
		let r = n.person_entity ? t.states[n.person_entity]?.state : void 0, i = r === "home" ? D`<small class="home">${e("household.home")}</small>` : r === "not_home" ? D`<small>${e("household.away")}</small>` : r ? D`<small>${e("household.zone", { zone: r })}</small>` : D`<small>${e("household.no_presence")}</small>`;
		return D`<li class="person" data-anchor=${this.detailed ? n.id : j}>
      <div class="top" data-tipped>
        <span class="avatar" aria-hidden="true">${n.name.slice(0, 1).toUpperCase()}</span>
        <div class="who"><b>${n.name}</b>${i}</div>
        <span class="top-actions">
          ${this.detailed ? G(e, ei(t, n.person_entity, n.name)) : j}
          <button type="button" class="mini-btn quiet" @click=${() => this.removePerson(n)}>
            ${e("household.remove")}
          </button>
          ${l(e, "household_remove")}
        </span>
      </div>
      <div class="cals" data-tipped>
        <span class="cals-label">${e("household.calendars")}</span>
        ${n.calendars.map((r) => D`<span class="cal">
            ${_(t, r)}
            <button
              type="button"
              aria-label=${e("household.calendar_remove", { name: _(t, r) })}
              @click=${() => this.setCalendars(n, n.calendars.filter((e) => e !== r))}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </span>`)}
        <button type="button" class="mini-btn" @click=${() => this.addCalendars(n)}>
          <ha-icon icon="mdi:calendar-plus"></ha-icon>${e("household.calendar_add")}
        </button>
        ${l(e, "f_calendars")}
      </div>
      ${this.detailed ? D`<slot name=${`p:${n.id}`}></slot>` : j}
    </li>`;
	}
	async addPerson() {
		let { t: e, config: t } = this;
		if (!e || !t) return;
		let n = (await L(this, {
			heading: e("pick.person.title"),
			tip: "pick_person",
			filter: "person",
			selected: [],
			exclude: t.persons.map((e) => e.person_entity).filter((e) => !!e)
		}))?.selected[0];
		if (!n || !this.hass) return;
		let r = this.discovery?.persons.find((e) => e.entity_id === n);
		I(this, {
			persons: { [n]: {
				name: _(this.hass, n),
				person_entity: n,
				calendars: r?.calendars ?? []
			} },
			answers: { ignored: Ye(t, `person:${n}`, !1) }
		});
	}
	bringBack(e) {
		I(this, {
			persons: { [e.entity_id]: {
				name: e.name,
				person_entity: e.entity_id,
				calendars: e.calendars
			} },
			answers: { ignored: Ye(this.config, `person:${e.entity_id}`, !1) }
		});
	}
	removePerson(e) {
		I(this, {
			persons: { [e.id]: null },
			answers: { ignored: Ye(this.config, `person:${e.id}`, !0) }
		});
	}
	async addCalendars(e) {
		let t = this.t;
		if (!t) return;
		let n = await L(this, {
			heading: t("pick.calendar.title", { name: e.name }),
			tip: "pick_calendar",
			filter: "calendar",
			multiple: !0,
			selected: e.calendars
		});
		n && this.setCalendars(e, n.selected);
	}
	setCalendars(e, t) {
		I(this, { persons: { [e.id]: { calendars: t } } });
	}
};
d([b({ attribute: !1 })], bl.prototype, "hass", void 0), d([b({ attribute: !1 })], bl.prototype, "t", void 0), d([b({ attribute: !1 })], bl.prototype, "config", void 0), d([b({ attribute: !1 })], bl.prototype, "discovery", void 0), d([b({ type: Boolean })], bl.prototype, "detailed", void 0);
var xl = class extends O {
	constructor(...e) {
		super(...e), this.card = !1, this.leftOut = [], this.guest = !0, this.creating = !1, this.offerNew = !1;
	}
	static {
		this.styles = [k, w`
      :host {
        display: block;
      }
      .presence {
        margin-top: 16px;
        padding: 14px;
        border-radius: 12px;
        background: var(--joe-surface-2);
      }
      :host([card]) .presence {
        margin-top: 14px;
        padding: 18px 20px;
        border-radius: 14px;
        background: var(--joe-surface);
        box-shadow: inset 0 0 0 1px var(--joe-line);
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
      .presence p {
        margin: 6px 0 0;
        color: var(--joe-ink-2);
        font-size: 14px;
      }
      .guest {
        margin-top: 12px;
        padding-top: 10px;
        border-top: 1px solid var(--joe-line);
      }
      .guest code {
        display: block;
        margin-top: 4px;
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 12.5px;
        user-select: all;
        overflow-wrap: anywhere;
      }
      .row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        margin-top: 10px;
      }
      .row .chip {
        white-space: normal;
        overflow-wrap: anywhere;
      }
      .row small {
        min-width: 0;
        overflow-wrap: anywhere;
      }
      @media (max-width: 760px) {
        :host([card]) .presence {
          padding: 16px;
        }
      }
    `];
	}
	render() {
		let { t: e, hass: t, config: n } = this;
		if (!e || !t || !n) return j;
		let r = n.context.presence_entity, i = this.card ? D`<div class="head">
          <div class="eyebrow"><ha-icon icon="mdi:account-check-outline"></ha-icon>${e("household.presence")}</div>
          ${l(e, "household_presence")}
        </div>` : D`<div class="with-tip"><b>${e("household.presence")}</b>${l(e, "household_presence")}</div>`;
		if (r) {
			let a = ["on", "home"].includes(t.states[r]?.state ?? "");
			return D`<div class="presence" data-tipped>
        ${i}
        <div class="row">
          <span class="chip ${a ? "ok" : ""}" title=${r}>${_(t, r)}</span>
          <small>${e(a ? "household.presence.on" : "household.presence.off")}</small>
          ${G(e, ei(t, r, _(t, r)))}
        </div>
        <p>${e(r.startsWith("group.") ? "household.presence.yours_group" : "household.presence.yours")}</p>
        ${this.renderGuest(e, t, n, r)}
        <div class="row">
          <button type="button" class="mini-btn" @click=${() => void this.pickPresence()}>${e("household.presence.other")}</button>
          <button type="button" class="mini-btn quiet" @click=${() => I(this, { context: { presence_entity: null } })}>
            ${e("household.presence.stop")}
          </button>
        </div>
      </div>`;
		}
		let a = n.persons.filter((e) => e.person_entity), o = a.filter((e) => !this.leftOut.includes(e.person_entity)), s = _l(t);
		return s.length && !this.offerNew ? D`<div class="presence" data-tipped>
        ${i}
        <p>${e("household.presence.found")}</p>
        ${s.map((t) => D`<div class="row">
            <span class="chip" title=${t.entity_id}>${t.name}</span>
            <small>${t.members.join(", ")}</small>
            <button type="button" class="btn btn-primary" @click=${() => I(this, { context: { presence_entity: t.entity_id } })}>
              ${e("household.presence.use")}
            </button>
          </div>`)}
        <div class="row">
          <button type="button" class="btn btn-ghost" @click=${() => this.offerNew = !0}>${e("household.presence.new_instead")}</button>
        </div>
      </div>` : D`<div class="presence" data-tipped>
      ${i}
      <p>${e("household.presence.propose")}</p>
      <div class="row" role="group" aria-label=${e("household.presence.persons")}>
        ${a.map((e) => {
			let t = !this.leftOut.includes(e.person_entity);
			return D`<button
            type="button"
            class="mini-btn ${t ? "go" : "quiet"}"
            aria-pressed=${String(t)}
            @click=${() => this.leftOut = t ? [...this.leftOut, e.person_entity] : this.leftOut.filter((t) => t !== e.person_entity)}
          >
            ${e.name}
          </button>`;
		})}
      </div>
      <div class="row">
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(this.guest)}
          aria-labelledby="presence-guest"
          @click=${() => this.guest = !this.guest}
        ></button>
        <span id="presence-guest">${e("household.presence.guest")}</span>
      </div>
      ${this.failed ? D`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.failed}</span></div>` : j}
      <div class="row">
        <button
          type="button"
          class="btn btn-primary"
          ?disabled=${this.creating || !o.length && !this.guest}
          @click=${() => void this.createPresence(o.map((e) => e.person_entity))}
        >
          ${e(this.creating ? "household.presence.creating" : "household.presence.create")}
        </button>
        <button type="button" class="btn btn-ghost" @click=${() => void this.pickPresence()}>${e("household.presence.own")}</button>
      </div>
    </div>`;
	}
	renderGuest(e, t, n, r) {
		let { guest_switch: i, guest_tracker: a } = n.context;
		if (!i || !a) return D`<div class="guest" data-tipped>
        <div class="with-tip"><b>${e("household.guest")}</b>${l(e, "household_guest")}</div>
        <p>${e("household.guest.offer")}</p>
        ${this.failed ? D`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.failed}</span></div>` : j}
        <div class="row">
          <button type="button" class="btn btn-secondary" ?disabled=${this.creating} @click=${() => void this.addGuest()}>
            ${e(this.creating ? "household.presence.creating" : "household.guest.create")}
          </button>
        </div>
      </div>`;
		let o = t.states[i]?.state === "on", s = t.states[r]?.attributes.entity_id, c = !s || s.includes(a);
		return D`<div class="guest" data-tipped>
      <div class="row">
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(o)}
          aria-labelledby="guest-label"
          @click=${() => void t.callService?.("input_boolean", o ? "turn_off" : "turn_on", { entity_id: i })}
        ></button>
        <b id="guest-label">${e("household.guest")}</b>
        <small>${e(t.states[a]?.state === "home" ? "household.guest.home" : "household.guest.away")}</small>
        ${l(e, "household_guest")}
      </div>
      ${c ? j : D`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon>
            <span>${e("household.guest.add_to_group", { group: _(t, r) })}<code>- ${a}</code></span>
          </div>`}
    </div>`;
	}
	async addGuest() {
		let { t: e, hass: t } = this;
		if (e && t) {
			this.creating = !0, this.failed = void 0;
			try {
				await vl(this, t, e);
			} catch (t) {
				this.failed = e("household.presence.failed", { error: String(t?.message ?? t) });
			} finally {
				this.creating = !1;
			}
		}
	}
	async createPresence(e) {
		let { t, hass: n } = this;
		if (t && n) {
			this.creating = !0, this.failed = void 0;
			try {
				let r = this.guest ? this.config?.context.guest_tracker ?? await vl(this, n, t) : null;
				await n.callWS({
					type: "energy_joe/presence/create",
					name: t("household.presence.name"),
					persons: e,
					guest: r
				});
			} catch (e) {
				this.failed = t("household.presence.failed", { error: String(e?.message ?? e) });
			} finally {
				this.creating = !1;
			}
		}
	}
	async pickPresence() {
		let e = this.t;
		if (!e) return;
		let t = this.config?.context.presence_entity, n = await L(this, {
			heading: e("pick.presence.title"),
			tip: "pick_presence",
			filter: "presence",
			selected: t ? [t] : []
		});
		n?.selected[0] && I(this, { context: { presence_entity: n.selected[0] } });
	}
};
d([b({ attribute: !1 })], xl.prototype, "hass", void 0), d([b({ attribute: !1 })], xl.prototype, "t", void 0), d([b({ attribute: !1 })], xl.prototype, "config", void 0), d([b({ attribute: !1 })], xl.prototype, "discovery", void 0), d([b({
	type: Boolean,
	reflect: !0
})], xl.prototype, "card", void 0), d([T()], xl.prototype, "leftOut", void 0), d([T()], xl.prototype, "guest", void 0), d([T()], xl.prototype, "creating", void 0), d([T()], xl.prototype, "failed", void 0), d([T()], xl.prototype, "offerNew", void 0);
var Sl = class extends O {
	static {
		this.styles = w`
    :host {
      display: block;
    }
  `;
	}
	render() {
		return D`<joe-household-people
        .hass=${this.hass}
        .t=${this.t}
        .config=${this.config}
        .discovery=${this.discovery}
      ></joe-household-people>
      <joe-household-presence
        .hass=${this.hass}
        .t=${this.t}
        .config=${this.config}
        .discovery=${this.discovery}
      ></joe-household-presence>`;
	}
};
d([b({ attribute: !1 })], Sl.prototype, "hass", void 0), d([b({ attribute: !1 })], Sl.prototype, "t", void 0), d([b({ attribute: !1 })], Sl.prototype, "config", void 0), d([b({ attribute: !1 })], Sl.prototype, "discovery", void 0), u("joe-household-people", bl), u("joe-household-presence", xl), u("joe-household", Sl);
//#endregion
//#region src/pages/household/people.ts
var Cl = class extends O {
	constructor(...e) {
		super(...e), this.prefix = A, this.checks = [];
	}
	static {
		this.styles = [
			k,
			ll,
			w`
      .list-head {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 22px 0 10px;
      }
      .list-head .eyebrow {
        flex: 1;
      }
      .extra {
        display: grid;
        gap: 2px;
        margin-top: 10px;
        padding-top: 8px;
        border-top: 1px solid var(--joe-line);
      }
      .days {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
        color: var(--joe-ink);
      }
      .extra .mirror {
        padding: 2px 0;
      }
      .extra .used-by {
        margin-top: 0;
      }
    `
		];
	}
	render() {
		let { t: e, state: t } = this;
		if (!e || !t || !this.hass) return j;
		let n = t.config, r = [...Qc(e, n, this.climateFound), ...$c(e, n, this.climateFound)], i = !(!this.person || n.persons.some((e) => e.id === this.person));
		return D`<div class="wrap">
      ${al(e, this.prefix, e("household.people.title"), e("household.people.lead"), r.filter((e, t) => r.findIndex((t) => t.label === e.label) === t))}
      ${i ? D`<div class="note warn" role="status">
            <ha-icon icon="mdi:help-circle-outline"></ha-icon><span>${e("nav.not_found.person")}</span>
          </div>` : j}
      <div class="list-head">
        <span class="eyebrow"><ha-icon icon="mdi:account-group-outline"></ha-icon>${e("household.people.list")}</span>
        ${l(e, "ha_open")}
      </div>
      <joe-household-people
        detailed
        .hass=${this.hass}
        .t=${e}
        .config=${n}
        .discovery=${this.discovery}
      >
        ${n.persons.map((n) => this.renderExtra(e, t, n))}
      </joe-household-people>
    </div>`;
	}
	renderExtra(e, t, n) {
		let r = t.config, i = t.climate?.day, a = t.plan?.meta?.tomorrow, o = a && a.date > cl(this.hass?.config?.time_zone) ? a : void 0, s = [];
		i?.home_office_available && i.labels_state !== "error" && i.home_office.includes(n.name) && s.push(e("household.people.today", { label: e("label.home_office") }));
		let c = o?.labels[n.id];
		c && s.push(e("household.people.tomorrow", { label: e(`label.${c}`) }));
		let l = n.calendars.length > 0, u = nl(e, r, n.id), d = r.learned.presence?.[n.id] ?? {}, f = Vn.filter((e) => d[e]).map((t) => e("learn.presence.value", {
			label: e(`label.${t}`),
			hours: v(e.lang, d[t].hours, 0)
		})), p = n.person_entity ? t.climate?.usual?.[n.person_entity] : void 0;
		p != null && f.push(e("household.people.usual", { time: sl(p) }));
		let m = {
			tab: "household",
			section: "days",
			id: n.id
		};
		return D`<div class="extra" slot=${`p:${n.id}`}>
      ${s.length ? D`<p class="days">${s.join(" · ")}</p>` : j}
      ${l ? D`${this.mirror(e("household.people.rules"), e(n.calendar ? "household.people.rules.own" : "household.people.rules.shared"), m, e("mirror.change"))}
            <p class="used-by ${u.length ? "" : "none"}">
              <ha-icon icon=${u.length ? "mdi:car-clock" : "mdi:link-variant-off"}></ha-icon>
              ${u.length ? D`<span class="used-by-label">${e("household.people.counts")}</span>
                    ${u.map((e) => D`<a class="used-by-item" href=${E(this.prefix, e.to)} @click=${C(e.to)}
                          >${e.label}</a
                        >`)}` : e("household.people.counts.none")}
            </p>` : j}
      ${this.mirror(e("household.people.learned"), n.person_entity ? f.length ? f.join(" · ") : e("household.people.learned.none") : e("learn.presence.no_person"), {
			tab: "review",
			section: "learned",
			id: "presence"
		}, e("household.people.more"))}
    </div>`;
	}
	mirror(e, t, n, r) {
		return D`<div class="mirror">
      <div class="mirror-text">
        <span class="mirror-label">${e}</span>
        <span class="mirror-sep" aria-hidden="true">·</span>
        <span class="mirror-value">${t}</span>
      </div>
      <a class="mini-btn go mirror-go" href=${E(this.prefix, n)} @click=${C(n)}>${r}</a>
    </div>`;
	}
	willUpdate(e) {
		e.has("person") && (this.revealed = void 0);
	}
	updated() {
		let e = this.state?.config.persons.some((e) => e.id === this.person);
		this.person && e && this.revealed !== this.person && this.reveal(this.person);
	}
	async reveal(e) {
		let t = this.renderRoot.querySelector("joe-household-people");
		t && (await t.updateComplete, t.shadowRoot && ve(t.shadowRoot, e) && (this.revealed = e));
	}
};
d([b({ attribute: !1 })], Cl.prototype, "hass", void 0), d([b({ attribute: !1 })], Cl.prototype, "t", void 0), d([b({ attribute: !1 })], Cl.prototype, "state", void 0), d([b({ attribute: !1 })], Cl.prototype, "route", void 0), d([b({ attribute: !1 })], Cl.prototype, "prefix", void 0), d([b({ attribute: !1 })], Cl.prototype, "discovery", void 0), d([b({ attribute: !1 })], Cl.prototype, "checks", void 0), d([b({ attribute: !1 })], Cl.prototype, "climateFound", void 0), d([b({ attribute: !1 })], Cl.prototype, "person", void 0), u("joe-hh-people", Cl);
//#endregion
//#region src/pages/household/presence.ts
var wl = 15, Tl = 240, El = "https://my.home-assistant.io/redirect/config_flow_start/?domain=proximity";
function Dl(e, t, n) {
	let r = t.routing;
	if (r.service === "google") {
		let t = n?.routing?.google.find((e) => e.entry_id === r.google_entry);
		return e("settings.routing.google", { name: t?.title ?? "Google" });
	}
	return e(r.service ? `settings.routing.${r.service}` : "settings.routing.none");
}
var Ol = class extends O {
	constructor(...e) {
		super(...e), this.prefix = A, this.checks = [];
	}
	static {
		this.styles = [
			k,
			ll,
			w`
      .way-list {
        margin: 6px 0 0;
      }
    `
		];
	}
	render() {
		let { t: e, state: t } = this;
		if (!e || !t || !this.hass) return j;
		let n = t.config;
		return D`<div class="wrap">
      ${al(e, this.prefix, e("household.presence.title"), e("household.presence.lead"), Qc(e, n, this.climateFound))}
      ${this.renderLive(e, t)}
      <joe-household-presence card .hass=${this.hass} .t=${e} .config=${n} .discovery=${this.discovery}></joe-household-presence>
      ${this.renderWay(e, n)}
    </div>`;
	}
	renderLive(e, t) {
		let n = t.climate, r = n?.home ?? [], i = Object.entries(n?.arrivals ?? this.climateFound?.arrivals ?? {}), a = Object.fromEntries(t.config.persons.map((e) => [e.person_entity, e.name])), o = t.config.climate?.away_after_min ?? wl;
		return D`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:home-account"></ha-icon>${e("household.presence.now")}</div>
        ${l(e, "climate_presence")}
      </div>
      <p class="now">${r.length ? e("climate.home", { names: r.join(", ") }) : e("climate.nobody")}</p>
      ${i.map(([t, n]) => D`<p class="hint">
          ${e(`climate.way.${n.direction === "towards" ? "towards" : n.direction === "away_from" ? "away" : "other"}`, {
			name: a[t] ?? this.hass?.states[t]?.attributes.friendly_name ?? t,
			km: n.km == null ? "–" : v(e.lang, n.km, 1)
		})}
          ${n.direction === "towards" && n.minutes != null ? e(n.source ? "climate.way.minutes_route" : "climate.way.minutes_guess", { minutes: n.minutes }) : j}
        </p>`)}
      <div class="row" data-tipped>
        <span>${e("climate.away_after")}</span>
        <input
          class="input short"
          type="number"
          inputmode="numeric"
          min="0"
          max=${Tl}
          step="1"
          aria-label=${e("climate.away_after")}
          .value=${String(o)}
          @change=${(e) => {
			let t = e.target, n = Math.round(Number.parseFloat(t.value.replace(",", ".")));
			if (!Number.isFinite(n)) {
				t.value = String(o);
				return;
			}
			let r = Math.min(Tl, Math.max(0, n));
			t.value = String(r), I(this, { climate: { away_after_min: r } });
		}}
        />
        <span>${e("climate.away_after.unit")}</span>
        ${l(e, "climate_away_after")}
      </div>
    </section>`;
	}
	renderWay(e, t) {
		let n = t.climate?.route_eta ?? !0;
		return D`<section class="card" data-anchor="way" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:map-marker-path"></ha-icon>${e("household.presence.way")}</div>
      </div>
      <p class="say">${e("household.presence.way.say")}</p>
      <div class="row">
        <span id="route-eta">${e("climate.route_eta")}</span>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(n)}
          aria-labelledby="route-eta"
          @click=${() => I(this, { climate: { route_eta: !n } })}
        ></button>
        ${l(e, "climate_route_eta")}
      </div>
      ${Pa(e, this.prefix, {
			label: e("household.presence.routing"),
			value: Dl(e, t, this.info),
			to: {
				tab: "household",
				section: "travel"
			},
			action: t.routing.service ? "change" : "set"
		})}
      ${this.climateFound && !this.climateFound.proximity ? D`<p class="hint">
            ${e("climate.no_proximity")}
            <a href=${El} target="_blank" rel="noreferrer noopener">${e("climate.add_proximity")}</a>
          </p>` : j}
    </section>`;
	}
	willUpdate(e) {
		e.has("anchor") && (this.revealed = void 0);
	}
	updated() {
		this.anchor && this.revealed !== this.anchor && ve(this.renderRoot, this.anchor) && (this.revealed = this.anchor);
	}
};
d([b({ attribute: !1 })], Ol.prototype, "hass", void 0), d([b({ attribute: !1 })], Ol.prototype, "t", void 0), d([b({ attribute: !1 })], Ol.prototype, "state", void 0), d([b({ attribute: !1 })], Ol.prototype, "route", void 0), d([b({ attribute: !1 })], Ol.prototype, "prefix", void 0), d([b({ attribute: !1 })], Ol.prototype, "discovery", void 0), d([b({ attribute: !1 })], Ol.prototype, "checks", void 0), d([b({ attribute: !1 })], Ol.prototype, "climateFound", void 0), d([b({ attribute: !1 })], Ol.prototype, "info", void 0), d([b({ attribute: !1 })], Ol.prototype, "anchor", void 0), u("joe-hh-presence", Ol);
//#endregion
//#region src/pages/household/travel.ts
var kl = class extends O {
	constructor(...e) {
		super(...e), this.prefix = A, this.checks = [];
	}
	static {
		this.styles = [
			k,
			ll,
			fc,
			w`
      .field {
        margin-top: 14px;
      }
      .field-label {
        flex-wrap: wrap;
      }
      .field .input {
        max-width: 420px;
      }
    `
		];
	}
	render() {
		let { t: e, state: t, hass: n } = this;
		if (!e || !t || !n) return j;
		let r = t.config;
		return D`<div class="wrap">
      ${al(e, this.prefix, e("household.travel.title"), e("household.travel.lead"), null)}
      <section class="card">
        ${hc(e, [_c(this, n, e, r, this.discovery, "weather", (t) => G(e, ei(n, t, _(n, t))))])}
        ${il(e, this.prefix, tl(e, r, "weather", this.climateFound))}
      </section>
      ${this.renderRouting(e, t)}
    </div>`;
	}
	renderRouting(e, t) {
		let n = t.config.routing, r = this.info?.routing, i = n.service === "google" ? `google:${n.google_entry ?? ""}` : n.service ?? "", a = (e) => {
			e.startsWith("google:") ? I(this, { routing: {
				service: "google",
				google_entry: e.slice(7) || null
			} }) : I(this, { routing: {
				service: e || null,
				google_entry: null
			} });
		}, o = (t) => D`<div class="field" data-tipped>
      <span class="field-label"><label for="routing-${t}">${e(`settings.routing.${t}`)}</label>${l(e, "routing_osm")}</span>
      <small class="field-hint">${e(`settings.routing.${t}.hint`)}</small>
      <input
        id="routing-${t}"
        class="input"
        type="url"
        .value=${n[t]}
        @change=${(e) => {
			let n = e.target.value.trim();
			n.startsWith("http") && I(this, { routing: { [t]: n } });
		}}
      />
    </div>`;
		return D`<section class="card">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:map-marker-distance"></ha-icon>${e("settings.routing")}</div>
      </div>
      <p class="say">${e("settings.routing.intro")}</p>
      <div class="field" data-tipped>
        <span class="field-label"><label for="routing-service">${e("settings.routing.service")}</label>${l(e, "routing_service")}</span>
        <small class="field-hint">${e("settings.routing.service.hint")}</small>
        <select id="routing-service" class="input" @change=${(e) => a(e.target.value)}>
          <option value="" ?selected=${i === ""}>${e("settings.routing.none")}</option>
          ${r?.waze === !1 ? j : D`<option value="waze" ?selected=${i === "waze"}>${e("settings.routing.waze")}</option>`}
          ${(r?.google ?? []).map((t) => D`<option value=${`google:${t.entry_id}`} ?selected=${i === `google:${t.entry_id}`}>
                ${e("settings.routing.google", { name: t.title })}
              </option>`)}
          <option value="osm" ?selected=${i === "osm"}>${e("settings.routing.osm")}</option>
        </select>
      </div>
      ${n.service === "osm" ? D`${o("geocoder_url")} ${o("router_url")}` : j}
      ${il(e, this.prefix, tl(e, t.config, "routing", this.climateFound))}
    </section>`;
	}
};
d([b({ attribute: !1 })], kl.prototype, "hass", void 0), d([b({ attribute: !1 })], kl.prototype, "t", void 0), d([b({ attribute: !1 })], kl.prototype, "state", void 0), d([b({ attribute: !1 })], kl.prototype, "route", void 0), d([b({ attribute: !1 })], kl.prototype, "prefix", void 0), d([b({ attribute: !1 })], kl.prototype, "discovery", void 0), d([b({ attribute: !1 })], kl.prototype, "checks", void 0), d([b({ attribute: !1 })], kl.prototype, "climateFound", void 0), d([b({ attribute: !1 })], kl.prototype, "info", void 0), u("joe-hh-travel", kl);
//#endregion
//#region src/pages/household/index.ts
var Al = {
	people: "joe-hh-people",
	presence: "joe-hh-presence",
	days: "joe-hh-days",
	night: "joe-hh-night",
	travel: "joe-hh-travel"
}, jl = {
	people: "mdi:account-group-outline",
	presence: "mdi:home-account",
	days: "mdi:calendar-check-outline",
	night: "mdi:sleep",
	travel: "mdi:map-marker-path"
}, Ml = class extends O {
	constructor(...e) {
		super(...e), this.prefix = A, this.checks = [];
	}
	static {
		this.styles = [k, w`
      :host {
        display: block;
      }
    `];
	}
	render() {
		let e = this.t;
		if (!e || !this.state) return j;
		let t = this.route?.section ?? ye.household, n = he.household.map((t) => ({
			id: t,
			label: e(`nav.household.${t}`),
			icon: jl[t]
		}));
		return D`${zr(e, this.prefix, "household", n, t)}${this.renderSection(t)}`;
	}
	renderSection(e) {
		if (!customElements.get(Al[e])) return D``;
		let { t, hass: n, state: r, prefix: i, route: a, discovery: o, checks: s, climateFound: c, info: l } = this;
		switch (e) {
			case "people": return D`<joe-hh-people
          .t=${t}
          .hass=${n}
          .state=${r}
          .prefix=${i}
          .route=${a}
          .discovery=${o}
          .checks=${s}
          .climateFound=${c}
          .person=${a?.id}
        ></joe-hh-people>`;
			case "presence": return D`<joe-hh-presence
          .t=${t}
          .hass=${n}
          .state=${r}
          .prefix=${i}
          .route=${a}
          .discovery=${o}
          .checks=${s}
          .climateFound=${c}
          .info=${l}
          .anchor=${a?.id}
        ></joe-hh-presence>`;
			case "days": return D`<joe-hh-days
          .t=${t}
          .hass=${n}
          .state=${r}
          .prefix=${i}
          .route=${a}
          .discovery=${o}
          .checks=${s}
          .climateFound=${c}
          .person=${a?.id}
        ></joe-hh-days>`;
			case "night": return D`<joe-hh-night
          .t=${t}
          .hass=${n}
          .state=${r}
          .prefix=${i}
          .route=${a}
          .discovery=${o}
          .checks=${s}
          .climateFound=${c}
        ></joe-hh-night>`;
			case "travel": return D`<joe-hh-travel
          .t=${t}
          .hass=${n}
          .state=${r}
          .prefix=${i}
          .route=${a}
          .discovery=${o}
          .checks=${s}
          .climateFound=${c}
          .info=${l}
        ></joe-hh-travel>`;
		}
	}
};
d([b({ attribute: !1 })], Ml.prototype, "hass", void 0), d([b({ attribute: !1 })], Ml.prototype, "t", void 0), d([b({ attribute: !1 })], Ml.prototype, "state", void 0), d([b({ attribute: !1 })], Ml.prototype, "route", void 0), d([b({ attribute: !1 })], Ml.prototype, "prefix", void 0), d([b({ attribute: !1 })], Ml.prototype, "discovery", void 0), d([b({ attribute: !1 })], Ml.prototype, "checks", void 0), d([b({ attribute: !1 })], Ml.prototype, "climateFound", void 0), d([b({ attribute: !1 })], Ml.prototype, "info", void 0), u("joe-household-page", Ml);
//#endregion
//#region src/components/chart.ts
var Nl = 40, Pl = 10, Fl = 16, Il = 24;
function Ll(e) {
	let t = 10 ** Math.floor(Math.log10(e));
	for (let n of [
		1,
		2,
		2.5,
		5,
		10
	]) if (n * t >= e) return n * t;
	return 10 * t;
}
function Rl(e) {
	let t = [], n = [];
	return e.forEach((e, r) => {
		e == null ? (n.length && t.push(n), n = []) : n.push([r, e]);
	}), n.length && t.push(n), t;
}
var Q = class extends O {
	constructor(...e) {
		super(...e), this.labels = [], this.ticks = /* @__PURE__ */ new Map(), this.series = [], this.bands = [], this.markers = [], this.unit = "kWh", this.max = 0, this.height = 220, this.label = "", this.lang = "de", this.centerTicks = !1, this.width = 640, this.hover = null;
	}
	static {
		this.styles = w`
    :host {
      display: block;
      position: relative;
      user-select: none;
      -webkit-user-select: none;
    }
    svg {
      display: block;
      width: 100%;
      overflow: visible;
    }
    .grid {
      stroke: var(--joe-line);
      stroke-width: 1;
    }
    .tick {
      fill: var(--joe-muted);
      font-size: 11px;
      font-variant-numeric: tabular-nums;
    }
    .note {
      fill: var(--joe-ink-2);
      font-size: 11.5px;
    }
    .band {
      fill: var(--joe-c-band);
    }
    .marker {
      stroke: var(--joe-ink-2);
      stroke-width: 1;
      stroke-dasharray: 3 4;
    }
    .guide {
      stroke: var(--joe-ink);
      stroke-width: 1;
      opacity: 0.35;
    }
    .slot {
      fill: transparent;
      cursor: crosshair;
    }
    .box {
      position: absolute;
      top: 0;
      z-index: 1;
      min-width: 150px;
      padding: 8px 10px;
      border-radius: 10px;
      background: var(--joe-tip-bg);
      color: var(--joe-tip-ink);
      font-size: 12.5px;
      line-height: 1.4;
      pointer-events: none;
      box-shadow: 0 10px 24px -12px rgba(7, 17, 24, 0.5);
    }
    .box b {
      display: block;
      color: var(--joe-tip-accent);
      margin-bottom: 2px;
    }
    .box div {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .box i {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      flex: none;
    }
    .box span {
      flex: 1;
    }
    .box em {
      font-style: normal;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }
  `;
	}
	connectedCallback() {
		super.connectedCallback(), this.resize = new ResizeObserver((e) => {
			let t = Math.round(e[0]?.contentRect.width ?? 0);
			t > 0 && t !== this.width && (this.width = t);
		}), this.resize.observe(this);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.resize?.disconnect();
	}
	render() {
		let e = this.labels.length;
		if (!e) return j;
		let t = Math.max(260, this.width), n = this.height, r = t - Nl - Pl, i = n - Fl - Il, a = r / e, o = this.series.flatMap((e) => e.values.filter((e) => e != null)), s = this.max || Ll(Math.max(.1, ...o)), c = Math.min(0, ...o), l = c < 0 ? -Math.max(Ll(-c), s / 4) : 0, u = (e) => Fl + i - (Math.max(l, Math.min(e, s)) - l) / (s - l) * i, d = (e) => Nl + e * a, f = (e) => Nl + (e + .5) * a, p = (e, t = 2) => new Intl.NumberFormat(this.lang, { maximumFractionDigits: t }).format(e), m = [];
		for (let e of this.bands) m.push(fe`<rect class="band" x=${d(e.from)} y=${Fl} width=${Math.max(0, d(e.to) - d(e.from))} height=${i}></rect>
        <text class="note" x=${(d(e.from) + d(e.to)) / 2} y=${28} text-anchor="middle">${e.label}</text>`);
		for (let e of l < 0 ? [
			l,
			0,
			s
		] : [
			0,
			s / 2,
			s
		]) m.push(fe`<line class="grid" x1=${Nl} x2=${t - Pl} y1=${u(e)} y2=${u(e)}></line>
        <text class="tick" x=${34} y=${u(e) + 4} text-anchor="end">${p(e, 2)}</text>`);
		m.push(fe`<text class="tick" x=${34} y=${11} text-anchor="end">${this.unit}</text>`);
		for (let [e, t] of this.ticks) m.push(fe`<text class="tick" x=${this.centerTicks ? f(e) : d(e)} y=${n - 6}
        text-anchor="middle">${t}</text>`);
		let h = this.series.filter((e) => e.kind === "bar"), g = a * .68 / Math.max(1, h.length);
		for (let e of this.series) {
			if (e.kind === "bar") {
				let t = a * .16 + h.indexOf(e) * g;
				e.values.forEach((n, r) => {
					if (n != null && n !== 0) {
						let i = Math.min(u(n), u(0));
						m.push(fe`<rect x=${d(r) + t} y=${i} width=${Math.max(1, g - 1)}
              height=${Math.max(1, Math.abs(u(0) - u(n)))} rx="2"
              fill=${n < 0 ? e.negative ?? e.color : e.color}></rect>`);
					}
				});
				continue;
			}
			for (let t of Rl(e.values)) {
				let n = t.map(([e, t]) => `${f(e).toFixed(1)},${u(t).toFixed(1)}`).join(" ");
				if (e.kind === "area" && t.length > 1) {
					let r = u(0).toFixed(1);
					m.push(fe`<polygon points=${`${f(t[0][0]).toFixed(1)},${r} ${n} ${f(t[t.length - 1][0]).toFixed(1)},${r}`}
            fill=${e.fill ?? e.color}></polygon>`);
				}
				t.length > 1 ? m.push(fe`<polyline points=${n} fill="none" stroke=${e.color} stroke-width=${e.kind === "line" ? 2.4 : 2}
            stroke-linejoin="round" stroke-dasharray=${e.dashed ? "5 4" : "none"}></polyline>`) : m.push(fe`<circle cx=${f(t[0][0])} cy=${u(t[0][1])} r="2.5" fill=${e.color}></circle>`);
			}
		}
		for (let e of this.markers) {
			let n = Nl + e.at * a, o = n < Nl + r * .75;
			m.push(fe`<line class="marker" x1=${n} x2=${n} y1=${Fl} y2=${Fl + i}></line>
        <text class="note" x=${o ? n + 4 : n - 4} y=${28} text-anchor=${o ? "start" : "end"}>
          ${t < 520 ? e.short ?? e.label : e.label}
        </text>`);
		}
		this.hover != null && m.push(fe`<line class="guide" x1=${f(this.hover)} x2=${f(this.hover)} y1=${Fl} y2=${Fl + i}></line>`);
		for (let t = 0; t < e; t++) m.push(fe`<rect class="slot" x=${d(t)} y=${Fl} width=${a} height=${i}
        @pointerenter=${() => this.hover = t} @click=${() => this.hover = t}></rect>`);
		return D`<svg
        viewBox="0 0 ${t} ${n}"
        height=${n}
        role="img"
        aria-label=${this.label}
        @pointerleave=${(e) => e.pointerType === "mouse" && (this.hover = null)}
      >
        ${m}
      </svg>
      ${this.hover == null ? j : this.renderBox(this.hover, f(this.hover), t, p)}`;
	}
	renderBox(e, t, n, r) {
		let i = t + 182 > n ? Math.max(0, t - 182) : t + 12;
		return D`<div class="box" style="left:${i}px">
      <b>${this.labels[e]}</b>
      ${this.series.map((t) => {
			let n = t.values[e];
			return n == null ? j : D`<div>
              <i style="background:${n < 0 ? t.negative ?? t.color : t.color}"></i><span>${t.label}</span
              ><em>${r(n, t.digits ?? 2)} ${this.unit}</em>
            </div>`;
		})}
    </div>`;
	}
};
d([b({ attribute: !1 })], Q.prototype, "labels", void 0), d([b({ attribute: !1 })], Q.prototype, "ticks", void 0), d([b({ attribute: !1 })], Q.prototype, "series", void 0), d([b({ attribute: !1 })], Q.prototype, "bands", void 0), d([b({ attribute: !1 })], Q.prototype, "markers", void 0), d([b()], Q.prototype, "unit", void 0), d([b({ type: Number })], Q.prototype, "max", void 0), d([b({ type: Number })], Q.prototype, "height", void 0), d([b()], Q.prototype, "label", void 0), d([b()], Q.prototype, "lang", void 0), d([b({ type: Boolean })], Q.prototype, "centerTicks", void 0), d([T()], Q.prototype, "width", void 0), d([T()], Q.prototype, "hover", void 0), u("joe-chart", Q);
//#endregion
//#region src/components/day-answer.ts
var zl = {
	more: [
		"guests",
		"special",
		"normal"
	],
	less: [
		"away",
		"special",
		"normal"
	],
	any: [
		"guests",
		"away",
		"special",
		"normal"
	]
}, Bl = class extends O {
	constructor(...e) {
		super(...e), this.date = "", this.changing = !1, this.busy = !1, this.failed = !1;
	}
	static {
		this.styles = [k, w`
      :host {
        display: block;
      }
      .card {
        padding: 16px 18px;
      }
      .head {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .head .eyebrow {
        flex: 1;
      }
      p {
        margin: 8px 0 0;
        font-size: 15px;
        line-height: 1.45;
      }
      .given {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px 12px;
        margin-top: 8px;
      }
      .given p {
        margin: 0;
        flex: 1 1 200px;
      }
      .answers {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 10px;
      }
      .note {
        margin-top: 12px;
      }
    `];
	}
	willUpdate(e) {
		e.has("date") ? (this.changing = !1, this.given = void 0, this.failed = !1) : e.has("answer") && this.answer === this.given && (this.given = void 0);
	}
	render() {
		let e = this.t, t = this.given ?? this.answer ?? null;
		if (!e || !this.date || !t && !this.question) return j;
		let n = !t || this.changing;
		return D`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:chat-question-outline"></ha-icon>${e("ask.title")}</div>
        ${l(e, "ask_day")}
      </div>
      ${n ? D`<p>
              ${this.question ? e(`ask.${this.question.kind}`, {
			day: U(e.lang, this.question.date, "weekday"),
			actual: H(e.lang, this.question.actual, 1),
			expected: H(e.lang, this.question.expected, 1)
		}) : e("past.answer.ask")}
            </p>
            <div class="answers" role="group" aria-label=${e("ask.answers")}>
              ${zl[this.question?.kind ?? "any"].map((n) => D`<button
                    type="button"
                    class="mini-btn ${n === "normal" ? "quiet" : ""}"
                    aria-pressed=${String(n === t)}
                    ?disabled=${this.busy}
                    @click=${() => this.choose(n)}
                  >
                    ${e(`ask.answer.${n}`)}
                  </button>`)}
              ${t ? D`<button type="button" class="mini-btn quiet" ?disabled=${this.busy} @click=${() => this.changing = !1}>
                    ${e("common.cancel")}
                  </button>` : j}
            </div>` : D`<div class="given">
            <p>${e("past.answer.given", { answer: e(`ask.answer.${t}`) })}</p>
            <button type="button" class="mini-btn" @click=${() => this.changing = !0}>
              <ha-icon icon="mdi:pencil-outline"></ha-icon>${e("past.answer.change")}
            </button>
          </div>`}
      ${this.failed ? D`<div class="note warn" role="status"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("error.action")}</div>` : j}
    </section>`;
	}
	async choose(e) {
		let t = this.date;
		this.busy = !0;
		try {
			await this.hass?.callWS({
				type: "energy_joe/learning/answer",
				date: t,
				answer: e
			}), t === this.date && (this.given = e, this.changing = !1, this.failed = !1), this.dispatchEvent(new CustomEvent("joe-answered", {
				detail: {
					date: t,
					answer: e
				},
				bubbles: !0,
				composed: !0
			}));
		} catch {
			this.failed = !0;
		} finally {
			this.busy = !1;
		}
	}
};
d([b({ attribute: !1 })], Bl.prototype, "hass", void 0), d([b({ attribute: !1 })], Bl.prototype, "t", void 0), d([b({ attribute: !1 })], Bl.prototype, "date", void 0), d([b({ attribute: !1 })], Bl.prototype, "answer", void 0), d([b({ attribute: !1 })], Bl.prototype, "question", void 0), d([T()], Bl.prototype, "changing", void 0), d([T()], Bl.prototype, "busy", void 0), d([T()], Bl.prototype, "failed", void 0), d([T()], Bl.prototype, "given", void 0), u("joe-day-answer", Bl);
//#endregion
//#region src/pages/lookback/days.ts
var Vl = 14, Hl = [
	"var(--joe-c-soc)",
	"var(--joe-c-soc-2)",
	"var(--joe-c-grid)",
	"var(--joe-c-ist)"
];
function Ul(e, t, n) {
	let r = /* @__PURE__ */ new Date(`${t}T12:00:00Z`);
	return n === "long" ? new Intl.DateTimeFormat(e, {
		weekday: "long",
		day: "numeric",
		month: "long",
		timeZone: "UTC"
	}).format(r) : new Intl.DateTimeFormat(e, {
		weekday: "short",
		timeZone: "UTC"
	}).format(r);
}
var Wl = class extends O {
	constructor(...e) {
		super(...e), this.prefix = A, this.failed = !1, this.fromStrip = !1, this.reveal = !1;
	}
	static {
		this.styles = [k, w`
      :host {
        display: block;
      }
      .wrap {
        max-width: 1100px;
        margin: 0 auto;
      }
      .display {
        font-size: clamp(30px, 4vw, 44px);
      }
      .status {
        margin: 8px 0 0;
        color: var(--joe-ink-2);
        font-size: 14px;
      }
      a.more {
        display: inline-flex;
        align-items: center;
        min-height: 44px;
        font-weight: 600;
        font-size: 14px;
        color: var(--joe-ink);
        text-decoration: underline;
        text-decoration-color: var(--joe-line-2);
        text-underline-offset: 3px;
      }
      a.more:hover {
        text-decoration-color: var(--joe-amber);
      }
      .strip {
        display: flex;
        gap: 6px;
        overflow-x: auto;
        padding: 12px 2px 6px;
        scrollbar-width: thin;
      }
      .strip > a,
      .strip > span {
        flex: none;
        display: grid;
        justify-items: center;
        gap: 4px;
        width: 62px;
        padding: 8px 4px 6px;
        border-radius: 12px;
        background: var(--joe-surface);
        box-shadow: inset 0 0 0 1px var(--joe-line);
        color: var(--joe-ink);
        text-decoration: none;
        transition: background 0.12s, box-shadow 0.12s, transform 0.12s;
      }
      .strip > a:hover {
        background: var(--joe-surface-2);
      }
      .strip > a:active {
        transform: scale(0.97);
      }
      .strip > a[aria-current] {
        background: var(--joe-amber-soft);
        box-shadow: inset 0 0 0 2px var(--joe-amber);
      }
      .strip > span {
        opacity: 0.45;
      }
      .strip small {
        font-size: 11.5px;
        color: var(--joe-muted);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .strip b {
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 800;
        font-size: 20px;
        line-height: 1;
      }
      .mini {
        display: flex;
        align-items: flex-end;
        gap: 3px;
        height: 26px;
      }
      .mini i {
        width: 9px;
        border-radius: 2px 2px 0 0;
        min-height: 2px;
      }
      .day-head {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px 12px;
        margin-top: 18px;
        border-radius: 12px;
      }
      .day-head h3 {
        margin: 0;
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 800;
        text-transform: uppercase;
        font-size: 26px;
        line-height: 1;
      }
      joe-day-answer {
        margin-top: 12px;
      }
      .tiles {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 10px;
        margin-top: 14px;
      }
      .tile {
        padding: 12px 14px;
        border-radius: 12px;
        background: var(--joe-surface);
        box-shadow: inset 0 0 0 1px var(--joe-line);
      }
      .tile .eyebrow {
        font-size: 11.5px;
      }
      .tile .value {
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 800;
        font-size: 30px;
        line-height: 1.05;
        margin-top: 4px;
        font-variant-numeric: tabular-nums;
      }
      .tile .value small {
        font-size: 16px;
        margin-left: 2px;
      }
      .tile .sub {
        font-size: 13px;
        color: var(--joe-ink-2);
        margin-top: 2px;
      }
      .chart-card {
        margin-top: 12px;
        padding: 14px 16px 10px;
        border-radius: 14px;
        background: var(--joe-surface);
        box-shadow: inset 0 0 0 1px var(--joe-line);
      }
      .chart-head {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
        font-weight: 700;
        margin-bottom: 6px;
      }
      .legend {
        display: flex;
        flex-wrap: wrap;
        gap: 6px 14px;
        margin-top: 4px;
        font-size: 12.5px;
        color: var(--joe-ink-2);
      }
      .legend span {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .legend i {
        width: 14px;
        height: 4px;
        border-radius: 2px;
      }
      .legend i.dash {
        background: repeating-linear-gradient(90deg, currentColor 0 4px, transparent 4px 7px) !important;
      }
      .note {
        margin-top: 12px;
      }
      .eval-top {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr);
        gap: 8px 24px;
        align-items: start;
        margin-top: 4px;
      }
      .eval-big {
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 800;
        font-size: 40px;
        line-height: 1;
        font-variant-numeric: tabular-nums;
      }
      .eval-big small {
        display: block;
        margin-top: 4px;
        font-family: inherit;
        font-style: normal;
        font-weight: 600;
        font-size: 13px;
        color: var(--joe-ink-2);
      }
      .eval-big.good {
        color: var(--joe-good);
      }
      .eval-big.bad {
        color: var(--joe-crit);
      }
      .eval-top dl {
        display: grid;
        grid-template-columns: minmax(130px, auto) 1fr;
        gap: 4px 14px;
        margin: 0;
        font-size: 14px;
        font-variant-numeric: tabular-nums;
      }
      .eval-top dt {
        color: var(--joe-ink-2);
      }
      .eval-top dd {
        margin: 0;
        font-weight: 600;
      }
      .empty {
        display: grid;
        grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
        gap: 28px;
        align-items: center;
        max-width: 980px;
        margin: 0 auto;
      }
      .empty joe-pose {
        max-width: 380px;
        width: 100%;
        justify-self: center;
      }
      @media (max-width: 760px) {
        .tiles {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .tile .value {
          font-size: 26px;
        }
        .empty {
          grid-template-columns: 1fr;
        }
        .empty joe-pose {
          max-width: 260px;
        }
        .eval-top,
        .eval-top dl {
          grid-template-columns: 1fr;
        }
        .eval-top dd {
          margin-bottom: 6px;
        }
      }
    `];
	}
	connectedCallback() {
		super.connectedCallback(), this.reveal = !!this.day, this.load();
	}
	willUpdate(e) {
		let t = this.state?.observe, n = `${t?.last_hour ?? ""}|${t?.backfill.state ?? ""}|${t?.day_count ?? 0}`;
		e.has("state") && this.lastHour !== void 0 && n !== this.lastHour && this.load(), this.lastHour = n, e.has("day") && this.days && (this.reveal = !this.fromStrip, this.fromStrip = !1, this.showSelected());
	}
	async load() {
		if (this.hass) try {
			this.days = await this.hass.callWS({
				type: "energy_joe/history/days",
				days: Vl
			}), this.failed = !1, this.loading = void 0, await this.showSelected();
		} catch {
			this.failed = !0;
		}
	}
	get selected() {
		let e = this.days?.days.map((e) => e.date) ?? [];
		if (this.day) {
			if (e.includes(this.day)) return this.day;
			let t = this.days?.first_day, n = this.days?.last_day;
			return /^\d{4}-\d{2}-\d{2}$/.test(this.day) && t && n && this.day >= t && this.day <= n ? this.day : void 0;
		}
		return e[0];
	}
	get blank() {
		let e = this.detail;
		return !(!e || e.date !== this.day || this.days?.days.some((t) => t.date === e.date) || e.hours.length || e.evaluation);
	}
	async showSelected() {
		let e = this.selected;
		if (!e) {
			this.detail = void 0;
			return;
		}
		if (e !== this.loading) {
			this.loading = e;
			try {
				let t = await this.hass?.callWS({
					type: "energy_joe/history/day",
					date: e
				});
				this.loading === e && (this.detail = t);
			} catch {
				this.failed = !0;
			}
		}
	}
	async reloadDay() {
		this.loading = void 0, await this.showSelected();
	}
	updated(e) {
		let t = this.renderRoot.querySelector(".strip");
		if (t && (e.has("days") || e.has("day"))) {
			let n = t.querySelector("[aria-current]");
			if (n) {
				let e = n.offsetLeft - t.offsetLeft;
				(e < t.scrollLeft || e + n.offsetWidth > t.scrollLeft + t.clientWidth) && t.scrollTo({ left: e - t.clientWidth + n.offsetWidth + 8 });
			} else e.has("days") && t.scrollTo({ left: t.scrollWidth });
		}
		if (this.reveal && this.detail && this.detail.date === this.day) {
			this.reveal = !1;
			let e = this.renderRoot.querySelector("[data-anchor='day']");
			e?.scrollIntoView({
				block: "start",
				behavior: "smooth"
			}), window.setTimeout(() => {
				let t = e && parseFloat(getComputedStyle(e).scrollMarginTop) || 0;
				e?.isConnected && Math.abs(e.getBoundingClientRect().top - t) > 24 && e.scrollIntoView({ block: "start" });
			}, 900);
		}
	}
	render() {
		let e = this.t;
		if (!e) return j;
		if (!this.days?.days.length) return this.renderEmpty(e);
		let t = this.selected;
		return D`<div class="wrap">
      ${y(e("history.title"))} ${M}
      <p class="status">${this.statusText(e)}</p>
      ${this.rebuildLink(e)}
      ${this.failed ? D`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("history.failed")}</div>` : j}
      ${this.renderStrip(e, this.days.days, t)}
      ${this.day && (!t || this.blank) ? D`<div class="note"><ha-icon icon="mdi:calendar-remove-outline"></ha-icon>${e("past.days.unknown", { day: this.dayName(e, this.day) })}</div>` : j}
      ${this.detail && t && !this.blank ? this.renderDay(e, this.detail) : j}
    </div>`;
	}
	dayName(e, t) {
		return /^\d{4}-\d{2}-\d{2}$/.test(t) ? Ul(e.lang, t, "long") : t;
	}
	rebuildLink(e) {
		let t = this.state?.observe;
		if (!t?.active || t.backfill.state === "running") return j;
		let n = {
			tab: "settings",
			section: "maintenance",
			id: "observe"
		};
		return D`<a class="more" href=${E(this.prefix, n)} @click=${C(n)}>${e("past.days.rebuild")}</a>`;
	}
	statusText(e) {
		let t = this.state?.observe, n = [];
		if (t?.active && t.since) {
			let r = t.since.slice(0, 10) === this.days?.days[0]?.date;
			n.push(r ? e("history.live_since", { time: this.time(t.since) }) : e("history.live_since_day", { day: new Intl.DateTimeFormat(e.lang, {
				day: "numeric",
				month: "long",
				timeZone: "UTC"
			}).format(/* @__PURE__ */ new Date(`${t.since.slice(0, 10)}T12:00:00Z`)) }));
		} else this.state?.mode === "off" && n.push(e("history.paused"));
		return t?.first_day && n.push(e("history.known", {
			days: t.day_count ?? 0,
			first: new Intl.DateTimeFormat(e.lang, {
				day: "numeric",
				month: "long",
				timeZone: "UTC"
			}).format(/* @__PURE__ */ new Date(`${t.first_day}T12:00:00Z`))
		})), t?.backfill.state === "running" && n.push(e("history.reading")), n.join(" · ");
	}
	renderEmpty(e) {
		let t = this.state?.observe, n = this.state?.mode === "off" ? "history.empty.off" : t?.backfill.state === "running" ? "history.empty.reading" : t?.active ? "history.empty.soon" : "history.empty.waiting";
		return D`<div class="empty">
      <joe-pose name="inspect"></joe-pose>
      <div>
        ${y(e("history.title"))} ${M}
        <p class="lead">${e(n)}</p>
        ${this.failed ? D`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("history.failed")}</div>` : j}
      </div>
    </div>`;
	}
	renderStrip(e, t, n) {
		let r = t[0].date, i = new Map(t.map((e) => [e.date, e])), a = [];
		for (let e = 13; e >= 0; e--) {
			let t = /* @__PURE__ */ new Date(`${r}T12:00:00Z`);
			t.setUTCDate(t.getUTCDate() - e), a.push(t.toISOString().slice(0, 10));
		}
		let o = Math.max(.1, ...t.flatMap((e) => [e.home ?? 0, e.solar ?? 0]));
		return D`<nav class="strip" aria-label=${e("history.days")}>
      ${a.map((t) => {
			let r = i.get(t), a = D`<small>${Ul(e.lang, t, "short")}</small>
          <b>${Number(t.slice(8))}</b>
          <span class="mini" aria-hidden="true">
            <i style="height:${(r?.home ?? 0) / o * 26}px;background:var(--joe-c-load)"></i>
            <i style="height:${(r?.solar ?? 0) / o * 26}px;background:var(--joe-c-pv)"></i>
          </span>`;
			if (!r) return D`<span aria-disabled="true" aria-label=${Ul(e.lang, t, "long")}>${a}</span>`;
			let s = {
				tab: "review",
				section: "days",
				id: t
			}, c = C(s);
			return D`<a
          href=${E(this.prefix, s)}
          aria-current=${t === n ? "date" : j}
          aria-label=${Ul(e.lang, t, "long")}
          @click=${(e) => {
				if (t === this.day && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
					e.preventDefault();
					return;
				}
				this.fromStrip = !0, c(e), e.defaultPrevented || (this.fromStrip = !1);
			}}
          >${a}</a
        >`;
		})}
    </nav>`;
	}
	renderDay(e, t) {
		let n = t.summary, r = Math.max(0, n.expected - t.hours.filter((e) => e.cov >= .9).length), i = n.sources.live ?? 0, a = (n.sources.stats ?? 0) + (n.sources.history ?? 0);
		return D`<div class="day-head" data-anchor="day">
        <h3>${Ul(e.lang, t.date, "long")}</h3>
        ${t.workday === !0 ? D`<span class="chip">${e("history.workday")}</span>` : t.workday === !1 ? D`<span class="chip">${e("history.day_off")}</span>` : j}
        ${i ? D`<span class="chip ok"><ha-icon icon="mdi:eye-outline"></ha-icon>${e("history.live")}</span>` : j}
        ${a ? D`<span class="chip read"><ha-icon icon="mdi:database-outline"></ha-icon>${e("history.read")}</span>` : j}
      </div>
      <joe-day-answer
        .hass=${this.hass}
        .t=${e}
        .date=${t.date}
        .answer=${t.answer ?? null}
        .question=${this.state?.questions?.find((e) => e.date === t.date)}
        @joe-answered=${() => this.reloadDay()}
      ></joe-day-answer>
      ${this.renderTiles(e, n)} ${this.renderEnergyChart(e, t)} ${this.renderSocChart(e, t)}
      ${this.renderEvaluation(e, t)}
      ${r && n.date !== this.days?.days[0]?.date ? D`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("history.missing", { hours: r })}</span>
          </div>` : j}`;
	}
	renderTiles(e, t) {
		let n = (t) => t == null ? "–" : v(e.lang, t, 1), r = [], i = (e, t, n, r) => D`<div class="tile">
        <div class="eyebrow">${e}</div>
        <div class="value">${t}<small>${n}</small></div>
        ${r ? D`<div class="sub">${r}</div>` : j}
      </div>`;
		if (t.home != null && r.push(i(e("history.tile.home"), n(t.home), "kWh", t.self_sufficiency == null ? "" : e("history.tile.home.self", { value: v(e.lang, t.self_sufficiency * 100, 0) }))), t.solar != null && r.push(i(e("history.tile.solar"), n(t.solar), "kWh", t.fc_ahead == null ? e("history.tile.solar.nofc") : e("history.tile.solar.fc", {
			value: n(t.fc_ahead),
			ratio: t.solar_vs_fc == null ? "–" : v(e.lang, t.solar_vs_fc * 100, 0)
		}))), t.grid_in != null) {
			let a = [];
			t.grid_in_cheap != null && a.push(e("history.tile.grid.cheap", { value: n(t.grid_in_cheap) })), t.grid_out != null && a.push(e("history.tile.grid.out", { value: n(t.grid_out) })), r.push(i(e("history.tile.grid"), n(t.grid_in), "kWh", a.join(" · ")));
		}
		if (t.bat_in != null && r.push(i(e("history.tile.battery"), n(t.bat_in), "kWh", e("history.tile.battery.out", { value: n(t.bat_out) }))), t.temp && r.push(i(e("history.tile.temp"), v(e.lang, t.temp.mean, 1), "°C", e("history.tile.temp.range", {
			min: v(e.lang, t.temp.min, 0),
			max: v(e.lang, t.temp.max, 0)
		}))), t.present) {
			let n = new Map((this.state?.config.persons ?? []).map((e) => [e.id, e.name])), a = Object.entries(t.present), o = Math.max(...a.map(([, e]) => e));
			r.push(i(e("history.tile.present"), v(e.lang, o, 0), "h", a.map(([t, r]) => `${n.get(t) ?? t} ${v(e.lang, r, 0)} h`).join(" · ")));
		}
		return D`<div class="tiles">${r}</div>`;
	}
	chartFrame(e) {
		let t = this.t, n = e.slots.map((t, n) => `${t}–${e.slots[n + 1] ?? "24:00"}`), r = /* @__PURE__ */ new Map();
		e.slots.forEach((e, t) => {
			t % 3 == 0 && r.set(t, e.slice(0, 2));
		});
		let i = e.window_slots.map(([e, n]) => ({
			from: e,
			to: n,
			label: t("history.chart.cheap")
		})), a = [];
		if (e.sun.sunrise_slot != null) {
			let n = this.time(e.sun.sunrise);
			a.push({
				at: e.sun.sunrise_slot,
				label: t("history.chart.sunrise", { time: n }),
				short: `↑${n}`
			});
		}
		if (e.sun.sunset_slot != null) {
			let n = this.time(e.sun.sunset);
			a.push({
				at: e.sun.sunset_slot,
				label: t("history.chart.sunset", { time: n }),
				short: `↓${n}`
			});
		}
		return {
			labels: n,
			ticks: r,
			bands: i,
			markers: a
		};
	}
	renderEnergyChart(e, t) {
		let n = (e) => {
			let n = t.slots.map(() => null);
			for (let r of t.hours) r[e] != null && (n[r.slot] = r[e]);
			return n;
		}, r = t.fc_ahead_slots.some((e) => e != null) ? t.fc_ahead_slots : t.fc_slots, i = [{
			label: e("history.chart.solar"),
			kind: "area",
			values: n("solar"),
			color: "var(--joe-c-pv)",
			fill: "var(--joe-c-pv-fill)"
		}, {
			label: e("history.chart.home"),
			kind: "bar",
			values: n("home"),
			color: "var(--joe-c-load)"
		}];
		r.some((e) => e != null) && i.push({
			label: e("history.chart.forecast"),
			kind: "line",
			values: r,
			color: "var(--joe-c-ist)",
			dashed: !0
		});
		let a = this.chartFrame(t);
		return D`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("history.chart.energy")} ${l(e, "chart_energy")}</div>
      <joe-chart
        .labels=${a.labels}
        .ticks=${a.ticks}
        .series=${i}
        .bands=${a.bands}
        .markers=${a.markers}
        unit="kWh"
        lang=${e.lang}
        label=${e("history.chart.energy")}
      ></joe-chart>
      ${this.legend(i)}
    </div>`;
	}
	legend(e) {
		return D`<div class="legend">
      ${e.map((e) => D`<span><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color}"></i>${e.label}</span>`)}
    </div>`;
	}
	renderSocChart(e, t) {
		let n = (this.state?.config.batteries ?? []).map((e, n) => {
			let r = t.slots.map(() => null);
			for (let n of t.hours) {
				let t = n.bat?.[e.id]?.soc;
				t != null && (r[n.slot] = t);
			}
			return {
				label: e.name,
				kind: "line",
				values: r,
				color: Hl[n % Hl.length],
				digits: 0
			};
		});
		if (!n.some((e) => e.values.some((e) => e != null))) return j;
		t.plan_soc_slots.some((e) => e != null) && n.push({
			label: e("history.chart.plan"),
			kind: "line",
			values: t.plan_soc_slots,
			color: "var(--joe-c-ist)",
			dashed: !0,
			digits: 0
		});
		let r = this.chartFrame(t);
		return D`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("history.chart.soc")} ${l(e, "chart_soc")}</div>
      <joe-chart
        .labels=${r.labels}
        .ticks=${r.ticks}
        .series=${n}
        .bands=${r.bands}
        max="100"
        height="170"
        unit="%"
        lang=${e.lang}
        label=${e("history.chart.soc")}
      ></joe-chart>
      ${this.legend(n)}
    </div>`;
	}
	renderEvaluation(e, t) {
		let n = t.evaluation;
		if (!t.plan?.fixed) return j;
		if (!n) return D`<div class="note"><ha-icon icon="mdi:timer-sand"></ha-icon><span>${e("history.eval.pending")}</span></div>`;
		if (!n.complete) return D`<div class="note warn">
        <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("history.eval.incomplete")}</span>
      </div>`;
		let r = this.hass?.config?.currency, i = n.saving ?? 0, a = i > .005 ? "good" : i < -.005 ? "bad" : "", o = (t) => H(e.lang, t ?? 0, 1), s = (t) => t ? e("history.eval.clock", { time: this.time(t) }) : e("history.eval.never"), c = !n.final, u = [[e("history.eval.day"), e("history.eval.instead", {
			with: o(n.with_plan?.day_kwh),
			without: o(n.without?.day_kwh)
		})], [e("history.eval.night"), e("history.eval.instead", {
			with: o(n.with_plan?.night_kwh),
			without: o(n.without?.night_kwh)
		})]];
		!c && n.solar?.forecast != null && u.push([e("history.eval.solar"), e("history.eval.solar.value", {
			actual: o(n.solar.actual),
			expected: o(n.solar.forecast)
		})]), !c && n.bridge && u.push([e("history.eval.morning"), e("history.eval.morning.value", {
			actual: o(n.bridge.actual),
			expected: o(n.bridge.planned)
		})]), !c && n.takeover && u.push([e("history.eval.takeover"), e("history.eval.takeover.value", {
			actual: s(n.takeover.actual),
			expected: s(n.takeover.planned)
		})]);
		let d = [{
			label: e("history.eval.chart.with"),
			kind: "line",
			values: t.evaluation_slots.with,
			color: "var(--joe-c-soc)",
			digits: 0
		}, {
			label: e("history.eval.chart.without"),
			kind: "line",
			values: t.evaluation_slots.without,
			color: "var(--joe-c-ist)",
			dashed: !0,
			digits: 0
		}], f = this.chartFrame(t);
		return D`<div class="chart-card" data-tipped>
      <div class="chart-head">
        ${e("history.eval")} ${l(e, "chart_replay")}
        ${c && n.until ? D`<span class="chip warn">${e("history.eval.provisional", { time: this.time(n.until) })}</span>` : j}
      </div>
      <div class="eval-top">
        <div class="eval-big ${a}">
          ${a === "bad" ? Dn(e, -i, r) : Dn(e, i, r)}
          <small>${e(a === "good" ? "history.eval.saved" : a === "bad" ? "history.eval.cost" : "history.eval.same")}</small>
        </div>
        <dl>${u.map(([e, t]) => D`<dt>${e}</dt><dd>${t}</dd>`)}</dl>
      </div>
      ${c && n.until ? D`<div class="note">
            <ha-icon icon="mdi:timer-sand"></ha-icon
            ><span>${e("history.eval.provisional.note", { time: this.time(n.until) })}</span>
          </div>` : j}
      ${d.some((e) => e.values.some((e) => e != null)) ? D`<joe-chart
              .labels=${f.labels}
              .ticks=${f.ticks}
              .series=${d}
              .bands=${f.bands}
              max="100"
              height="150"
              unit="%"
              lang=${e.lang}
              label=${e("history.eval")}
            ></joe-chart>
            ${this.legend(d)}` : j}
    </div>`;
	}
	time(e) {
		return e.slice(11, 16);
	}
};
d([b({ attribute: !1 })], Wl.prototype, "hass", void 0), d([b({ attribute: !1 })], Wl.prototype, "t", void 0), d([b({ attribute: !1 })], Wl.prototype, "state", void 0), d([b({ attribute: !1 })], Wl.prototype, "prefix", void 0), d([b({ attribute: !1 })], Wl.prototype, "route", void 0), d([b({ attribute: !1 })], Wl.prototype, "climateFound", void 0), d([b({ attribute: !1 })], Wl.prototype, "day", void 0), d([T()], Wl.prototype, "days", void 0), d([T()], Wl.prototype, "detail", void 0), d([T()], Wl.prototype, "failed", void 0), u("joe-lookback-days", Wl);
//#endregion
//#region src/pages/lookback/learned.ts
var Gl = [
	"clear",
	"mixed",
	"overcast"
], Kl = {
	forecast_solar: "Forecast.Solar",
	open_meteo_solar_forecast: "Open-Meteo Solar Forecast",
	solcast_solar: "Solcast"
}, ql = [
	"all",
	...Wn,
	"climate"
];
function Jl(e, t, n) {
	let r = e.base + (t ? e.workday : 0) + e.heat * Math.max(0, 15 - n) + e.cool * Math.max(0, n - 22);
	return e.presence != null && (r += e.presence * (e.presence_mean ?? 0)), Math.max(0, r);
}
var Yl = class extends O {
	constructor(...e) {
		super(...e), this.prefix = A, this.failed = !1, this.confirming = !1, this.resetting = !1, this.scope = "all";
	}
	static {
		this.styles = [
			k,
			oo,
			w`
      :host {
        display: block;
      }
      .wrap {
        max-width: 1100px;
        margin: 0 auto;
      }
      .intro {
        display: grid;
        grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.75fr);
        gap: 24px;
        align-items: center;
      }
      .intro joe-pose {
        max-width: 340px;
        width: 100%;
        justify-self: end;
      }
      .display {
        font-size: clamp(30px, 4vw, 44px);
      }
      .intro .lead {
        max-width: 56ch;
      }
      .status {
        margin: 8px 0 0;
        color: var(--joe-ink-2);
        font-size: 14px;
      }
      .group {
        border-radius: 16px;
      }
      .eyebrow.section {
        margin: 28px 0 0;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
        margin-top: 12px;
      }
      .card {
        padding: 18px 20px;
      }
      .wide {
        margin-top: 12px;
      }
      .head {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .head .eyebrow {
        flex: 1;
      }
      .figure {
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
        gap: 6px 12px;
        margin-top: 10px;
      }
      .big {
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 800;
        font-size: clamp(40px, 5vw, 56px);
        line-height: 1;
        font-variant-numeric: tabular-nums;
      }
      .big small {
        font-size: 0.5em;
        margin-left: 2px;
      }
      .big.small {
        font-size: clamp(30px, 3.6vw, 38px);
      }
      .say {
        margin: 10px 0 0;
        font-size: 15px;
        line-height: 1.5;
        color: var(--joe-ink-2);
        max-width: 62ch;
      }
      .split {
        margin: 6px 0 0;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
      }
      joe-chart {
        margin-top: 10px;
      }
      .legend {
        display: flex;
        flex-wrap: wrap;
        gap: 6px 14px;
        margin-top: 4px;
        font-size: 12.5px;
        color: var(--joe-ink-2);
      }
      .legend span {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .legend i {
        width: 14px;
        height: 4px;
        border-radius: 2px;
      }
      .legend i.dash {
        background: repeating-linear-gradient(90deg, currentColor 0 4px, transparent 4px 7px) !important;
      }
      .mirror {
        margin-top: 8px;
        border-top: 1px solid var(--joe-line);
      }
      a.go-link {
        display: inline-flex;
        align-items: center;
        min-height: 44px;
        font-weight: 600;
        font-size: 14px;
        color: var(--joe-ink);
        text-decoration: underline;
        text-decoration-color: var(--joe-line-2);
        text-underline-offset: 3px;
      }
      a.go-link:hover {
        text-decoration-color: var(--joe-amber);
      }
      .sub-head {
        margin-top: 16px;
        font-size: 14px;
      }
      .sub-head.with-tip {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .danger p {
        margin: 10px 0 0;
        color: var(--joe-ink-2);
        max-width: 56ch;
      }
      .scopes {
        margin-top: 12px;
        flex-wrap: wrap;
        border-radius: 22px;
      }
      .danger .actions {
        margin-top: 14px;
      }
      .note {
        margin-top: 12px;
      }
      dl.forget {
        display: grid;
        gap: 4px;
        margin: 14px 0 0;
      }
      dl.forget dt {
        font-weight: 700;
        margin-top: 8px;
      }
      dl.forget dd {
        margin: 0;
        color: var(--joe-ink-2);
      }
      @media (max-width: 900px) {
        .grid {
          grid-template-columns: 1fr;
        }
      }
      @media (max-width: 760px) {
        .intro {
          grid-template-columns: 1fr;
          gap: 12px;
        }
        .intro joe-pose {
          order: -1;
          justify-self: start;
          max-width: 260px;
        }
      }
    `
		];
	}
	connectedCallback() {
		super.connectedCallback(), this.pending = this.anchor, this.load();
	}
	willUpdate(e) {
		let t = ho(this.state);
		e.has("state") && this.marker !== void 0 && t !== this.marker && this.load(), this.marker = t, e.has("anchor") && this.anchor && (this.pending = this.anchor);
	}
	updated() {
		let e = this.pending;
		e && this.data && ve(this.renderRoot, e) && (this.pending = void 0);
	}
	async load() {
		if (this.hass) try {
			this.data = await this.hass.callWS({ type: "energy_joe/learning" }), this.failed = !1;
		} catch {
			this.failed = !0;
		}
	}
	render() {
		let e = this.t;
		if (!e) return j;
		let t = this.data;
		return D`<div class="wrap">
        <div class="intro">
          <div>
            ${y(e("learn.page.title"))} ${M}
            <p class="lead">${e("learn.lead")}</p>
            <p class="status">${this.statusText(e)}</p>
          </div>
          <joe-pose name="learn"></joe-pose>
        </div>
        ${this.failed ? D`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("learn.failed")}</div>` : j}
        ${t ? D`<div class="group" data-anchor="sun">
                <div class="eyebrow section"><ha-icon icon="mdi:weather-sunny"></ha-icon>${e("past.learned.group.sun")}</div>
                <div class="grid">${this.renderSolar(e, t)} ${this.renderShift(e, t)} ${this.renderSources(e, t)}</div>
              </div>
              <div class="group" data-anchor="consumption">
                <div class="eyebrow section"><ha-icon icon="mdi:home-lightning-bolt-outline"></ha-icon>${e("past.learned.group.consumption")}</div>
                <div class="grid">${this.renderHome(e, t)} ${this.renderWeather(e, t)} ${this.renderBuffer(e, t)}</div>
              </div>
              <div class="group">
                <div class="eyebrow section"><ha-icon icon="mdi:devices"></ha-icon>${e("past.learned.group.devices")}</div>
                <div class="grid">
                  ${this.renderBatteries(e, t)} ${this.renderGroups(e, t)} ${this.renderHotWater(e, t)}
                  ${this.renderCars(e, t)} ${this.renderClimate(e)}
                </div>
              </div>
              <div class="group">
                <div class="eyebrow section"><ha-icon icon="mdi:account-group-outline"></ha-icon>${e("past.learned.group.household")}</div>
                <div class="grid">${this.renderPresence(e, t)}</div>
              </div>
              ${this.renderReset(e)}` : j}
      </div>
      ${this.confirming ? this.renderConfirm(e) : j}`;
	}
	statusText(e) {
		let t = this.state?.observe, n = this.state?.config.learned;
		if (this.state?.mode === "off") return e("learn.paused");
		if (!t?.active) return e("learn.waiting");
		let r = [];
		return n?.since ? r.push(e("learn.since", { day: U(e.lang, n.since) })) : t.first_day && r.push(e("learn.since_start", { day: U(e.lang, t.first_day) })), n?.updated && r.push(e("learn.updated", {
			day: U(e.lang, n.updated, "short"),
			time: n.updated.slice(11, 16)
		})), r.join(" · ");
	}
	goLink(e, t) {
		return D`<a class="go-link" href=${E(this.prefix, e)} @click=${C(e)}>${t}</a>`;
	}
	renderSolar(e, t) {
		let n = t.learned, r = n.solar_factor, i;
		i = r == null ? e("learn.solar.learning", {
			need: t.needs.solar,
			have: n.solar_days
		}) : r < .95 ? e("learn.solar.less", {
			value: v(e.lang, (1 - r) * 100, 0),
			share: v(e.lang, r * 100, 0)
		}) : r > 1.05 ? e("learn.solar.more", {
			value: v(e.lang, (r - 1) * 100, 0),
			share: v(e.lang, r * 100, 0)
		}) : e("learn.solar.fits");
		let a = t.solar.slice(-28), o = [{
			label: e("learn.solar.chart.actual"),
			kind: "bar",
			values: a.map((e) => e.actual),
			color: "var(--joe-c-pv)",
			digits: 1
		}, {
			label: e("learn.solar.chart.forecast"),
			kind: "line",
			values: a.map((e) => e.forecast),
			color: "var(--joe-c-ist)",
			dashed: !0,
			digits: 1
		}];
		return D`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:weather-sunny"></ha-icon>${e("learn.solar")}</div>
        ${l(e, "learn_solar")}
      </div>
      <div class="figure">
        <div class="big ${r == null ? "small" : ""}">
          ${r == null ? e("learn.still") : `× ${v(e.lang, r, 2)}`}
        </div>
        ${r == null ? j : D`${S(e, { source: "learned" })}<span class="chip">${e("learn.days", { days: n.solar_days })}</span>`}
      </div>
      <p class="say">${i}</p>
      ${a.length > 1 ? this.chartWithLegend(e, a.map((e) => e.date), o, "kWh", e("learn.solar.chart")) : j}
    </section>`;
	}
	renderShift(e, t) {
		let n = t.learned, r = n.solar_shift;
		return D`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:clock-time-four-outline"></ha-icon>${e("learn.shift")}</div>
        ${l(e, "learn_shift")}
      </div>
      <div class="figure">
        <div class="big ${r == null ? "small" : ""}">${e(r == null ? "learn.still" : `learn.shift.big.${r}`)}</div>
        ${r == null ? j : D`${S(e, { source: "learned" })}<span class="chip">${e("learn.days", { days: n.shift_days })}</span>`}
      </div>
      <p class="say">
        ${r == null ? e("learn.shift.learning", {
			need: t.needs.shift,
			have: n.shift_days
		}) : e(`learn.shift.${r}`)}
      </p>
      ${t.solar_profile ? this.hourChart(e, this.profileSeries(e, t.solar_profile), e("learn.shift.chart")) : j}
    </section>`;
	}
	profileSeries(e, t) {
		return [{
			label: e("learn.shift.chart.actual"),
			kind: "area",
			values: t.actual,
			color: "var(--joe-c-pv)",
			fill: "var(--joe-c-pv-fill)"
		}, {
			label: e("learn.shift.chart.forecast"),
			kind: "line",
			values: t.forecast,
			color: "var(--joe-c-ist)",
			dashed: !0
		}];
	}
	hourChart(e, t, n) {
		let r = Array.from({ length: 24 }, (e, t) => `${String(t).padStart(2, "0")}:00–${String((t + 1) % 24).padStart(2, "0")}:00`), i = /* @__PURE__ */ new Map();
		for (let e = 0; e < 24; e += 3) i.set(e, String(e).padStart(2, "0"));
		return D`<joe-chart
        .labels=${r}
        .ticks=${i}
        .series=${t}
        unit="kWh"
        height="150"
        lang=${e.lang}
        label=${n}
      ></joe-chart>
      <div class="legend">
        ${t.map((e) => D`<span><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color}"></i>${e.label}</span>`)}
      </div>`;
	}
	renderBuffer(e, t) {
		let { value: n, source: r } = t.buffer, i = t.learned, a = (t) => v(e.lang, t * 100, 0), o;
		o = r === "user" ? i.buffer == null ? e("learn.buffer.user") : e("learn.buffer.user_learned", { value: a(i.buffer) }) : r === "learned" ? e("learn.buffer.learned") : e("learn.buffer.default", {
			need: t.needs.buffer,
			have: i.buffer_days
		});
		let s = t.accuracy.slice(-14), c = [{
			label: e("learn.buffer.chart.planned"),
			kind: "bar",
			values: s.map((e) => e.bridge.planned),
			color: "var(--joe-c-ist)",
			digits: 1
		}, {
			label: e("learn.buffer.chart.actual"),
			kind: "bar",
			values: s.map((e) => e.bridge.actual),
			color: "var(--joe-c-soc)",
			digits: 1
		}];
		return D`<section class="card" data-tipped data-anchor="buffer">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:shield-half-full"></ha-icon>${e("learn.buffer")}</div>
        ${l(e, "learn_buffer")}
      </div>
      <div class="figure">
        <div class="big">${a(n)}<small> %</small></div>
        ${S(e, { source: r })}
        ${r === "learned" ? D`<span class="chip">${e("learn.mornings", { count: i.buffer_days })}</span>` : j}
      </div>
      <p class="say">${o}</p>
      ${s.length > 1 ? this.chartWithLegend(e, s.map((e) => e.date), c, "kWh", e("learn.buffer.chart")) : j}
      ${Pa(e, this.prefix, {
			label: e("rule.buffer_factor"),
			value: `${a(n)} %`,
			to: {
				tab: "settings",
				section: "rules",
				id: "buffer_factor"
			}
		})}
    </section>`;
	}
	renderHome(e, t) {
		let n = t.consumption, r = (t) => H(e.lang, t.reduce((e, t) => e + t, 0), 1), i = [{
			label: e("learn.home.chart.workday"),
			kind: "line",
			values: n.workday,
			color: "var(--joe-c-load)"
		}, {
			label: e("learn.home.chart.day_off"),
			kind: "line",
			values: n.day_off,
			color: "var(--joe-c-soc-2)",
			dashed: !0
		}];
		return D`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:home-lightning-bolt-outline"></ha-icon>${e("learn.home")}</div>
        ${l(e, "learn_home")}
      </div>
      <p class="say">
        ${n.source === "history" ? e("learn.home.history", { days: n.days }) : e("learn.home.default")}
      </p>
      <p class="split">${e("learn.home.totals", {
			workday: r(n.workday),
			day_off: r(n.day_off)
		})}</p>
      ${this.hourChart(e, i, e("learn.home.chart"))}
    </section>`;
	}
	chartWithLegend(e, t, n, r, i) {
		return D`<joe-chart
        .labels=${t.map((t) => U(e.lang, t, "weekday"))}
        .ticks=${go(e.lang, t)}
        .series=${n}
        centerTicks
        unit=${r}
        height="150"
        lang=${e.lang}
        label=${i}
      ></joe-chart>
      <div class="legend">
        ${n.map((e) => D`<span
              ><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color};height:${e.kind === "bar" ? "10px" : "4px"}"></i
              >${e.label}</span
            >`)}
      </div>`;
	}
	renderWeather(e, t) {
		let n = e.lang, r = t.learned.consumption_model, i = t.days.filter((e) => e.temp != null), a = i.filter((e) => !e.excluded).length, o = this.state?.config.context.weather_entity, s;
		if (!o) s = e("learn.model.no_weather");
		else if (!r) s = e("learn.model.learning", {
			need: t.needs.models,
			have: a
		});
		else {
			let t = [e("learn.model.base", { value: H(n, r.base + (r.presence ?? 0) * (r.presence_mean ?? 0), 1) })];
			Math.abs(r.workday) >= .3 && t.push(e(r.workday > 0 ? "learn.model.workday_more" : "learn.model.workday_less", { value: H(n, Math.abs(r.workday), 1) })), r.heat >= .05 && t.push(e("learn.model.heat", { value: H(n, r.heat, 2) })), r.cool >= .05 && t.push(e("learn.model.cool", { value: H(n, r.cool, 2) })), r.presence != null && Math.abs(r.presence) >= .05 && t.push(e("learn.model.presence", { value: H(n, r.presence, 2) })), t.push(e("learn.model.fit", { share: v(n, r.r2 * 100, 0) })), s = t.join(" ");
		}
		let c = r != null && r.heat >= .05;
		return D`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:thermometer"></ha-icon>${e("learn.model")}</div>
        ${l(e, "learn_model")}
      </div>
      <div class="figure">
        <div class="big ${r ? "" : "small"}">
          ${r ? c ? D`+${H(n, r.heat, 2)}<small> kWh/°C</small>` : D`${H(n, r.base + (r.presence ?? 0) * (r.presence_mean ?? 0), 1)}<small> kWh</small>` : e("learn.still")}
        </div>
        ${r ? D`${S(e, { source: "learned" })}<span class="chip">${e("learn.days", { days: r.days })}</span>` : j}
      </div>
      <p class="say">${s}</p>
      ${o ? j : Pa(e, this.prefix, {
			label: e("past.learned.weather"),
			value: e("past.learned.weather.missing"),
			to: {
				tab: "household",
				section: "travel"
			},
			action: "set"
		})}
      ${i.length > 2 ? this.temperatureChart(e, t, r) : j}
    </section>`;
	}
	temperatureChart(e, t, n) {
		let r = t.days.filter((e) => e.temp != null && !e.excluded), i = r.map((e) => e.temp), a = Math.floor(Math.min(...i) / 2) * 2, o = Math.floor(Math.max(...i) / 2) * 2 + 2, s = [];
		for (let e = a; e < o; e += 2) s.push(e);
		let c = (t) => v(e.lang, t, 0), l = [{
			label: e("learn.model.chart.actual"),
			kind: "bar",
			values: s.map((e) => {
				let t = r.filter((t) => t.temp >= e && t.temp < e + 2);
				return t.length ? t.reduce((e, t) => e + t.home, 0) / t.length : null;
			}),
			color: "var(--joe-c-ist)",
			digits: 1
		}];
		n && l.push({
			label: e("learn.model.chart.workday"),
			kind: "line",
			values: s.map((e) => Jl(n, !0, e + 1)),
			color: "var(--joe-c-soc)",
			digits: 1
		}, {
			label: e("learn.model.chart.day_off"),
			kind: "line",
			values: s.map((e) => Jl(n, !1, e + 1)),
			color: "var(--joe-c-soc-2)",
			dashed: !0,
			digits: 1
		});
		let u = Math.max(1, Math.ceil(s.length / 8)), d = /* @__PURE__ */ new Map();
		return s.forEach((e, t) => {
			t % u === 0 && d.set(t, `${c(e)}°`);
		}), D`<joe-chart
        .labels=${s.map((e) => `${c(e)} … ${c(e + 2)} °C`)}
        .ticks=${d}
        .series=${l}
        unit="kWh"
        height="150"
        lang=${e.lang}
        label=${e("learn.model.chart")}
      ></joe-chart>
      <div class="legend">
        ${l.map((e) => D`<span
              ><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color};height:${e.kind === "bar" ? "10px" : "4px"}"></i
              >${e.label}</span
            >`)}
      </div>`;
	}
	renderSources(e, t) {
		let n = e.lang, r = this.state.config, i = t.learned.solar_classes ?? {}, a = i.classes ?? {}, o = r.forecast, s = t.learned.sources ?? {}, c = Gl.filter((e) => a[e]), u = (e) => v(n, e * 100, 0), d = [["main", o.provider ? Kl[o.provider] ?? o.provider : e("learn.sources.main")], ...o.alternatives.map((e) => [e.id, e.name])], f = Object.fromEntries(d.map(([e]) => [e, s[e] ? 1 / Math.max(s[e].error, .05) ** 2 : 0])), p = Object.values(f).reduce((e, t) => e + t, 0);
		return D`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:weather-partly-cloudy"></ha-icon>${e("learn.weather")}</div>
        ${l(e, "learn_weather")}
      </div>
      <p class="say">
        ${c.length ? e("learn.weather.say", { top: H(n, i.top ?? 0, 1) }) : e("learn.weather.learning", { have: i.days ?? 0 })}
      </p>
      ${c.length ? ao(Gl.map((t) => {
			let r = a[t];
			return {
				name: e(`learn.weather.${t}`),
				values: r ? [`× ${v(n, r.factor, 2)}`, e("learn.days", { days: r.days })] : [e("learn.still")]
			};
		})) : j}
      <div class="sub-head">
        <b>${e("learn.sources")}</b>
      </div>
      ${o.alternatives.length ? D`${ao(d.map(([r, i]) => {
			let a = s[r];
			return {
				name: i,
				values: a ? [
					`× ${v(n, a.factor, 2)}`,
					e("learn.sources.error", { value: u(a.error) }),
					o.combine && p ? e("learn.sources.weight", { value: u(f[r] / p) }) : ""
				] : [e("learn.sources.learning", { need: t.needs.sources })]
			};
		}))}
            ${Pa(e, this.prefix, {
			label: e("learn.sources.combine"),
			value: e(o.combine ? "rule.on" : "rule.off"),
			to: {
				tab: "devices",
				section: "grid",
				id: "solar"
			}
		})}` : D`<p class="say">${e("learn.sources.single")}</p>`}
    </section>`;
	}
	rowsCard(e, t, n, r, i, a, o, s = j) {
		return D`<section class="card" data-tipped data-anchor=${t}>
      <div class="head">
        <div class="eyebrow"><ha-icon icon=${n}></ha-icon>${r}</div>
        ${i}
      </div>
      ${a.length ? ao(a) : D`<p class="say">${o}</p>`} ${s}
    </section>`;
	}
	renderBatteries(e, t) {
		let n = this.state.config;
		return this.rowsCard(e, "battery", "mdi:battery-heart-variant", e("learn.battery"), l(e, "learn_battery"), n.batteries.map((r) => so(e, n, t.learned, r, t.needs.models)), e("learn.battery.none"));
	}
	renderGroups(e, t) {
		let n = this.state.config.consumers.filter((e) => e.energy_entity && e.kind !== "submeter");
		return this.rowsCard(e, "devices", "mdi:chart-donut", e("learn.groups"), l(e, "learn_groups"), n.map((n) => co(e, t.learned, n)), e("learn.groups.none"));
	}
	renderHotWater(e, t) {
		let n = this.state.config.actions.filter((e) => e.kind === "target");
		return this.rowsCard(e, "hot_water", "mdi:water-boiler", e("learn.hot_water"), l(e, "learn_hot_water"), n.map((n) => lo(e, t.learned, n)), e("learn.hot_water.none"));
	}
	renderCars(e, t) {
		let n = (this.state.config.cars ?? []).filter((e) => e.need.enabled);
		return this.rowsCard(e, "car", "mdi:car-electric", e("learn.car"), l(e, "learn_car"), n.map((n) => uo(e, t.learned, n)), e("learn.car.none"));
	}
	renderClimate(e) {
		let t = this.state.config, n = this.state?.climate?.rates ?? {}, r = this.climateFound?.devices ?? [], i = Object.fromEntries(r.map((e) => [e.entity_id, e.name])), a = Object.entries(t.climate?.rooms ?? {}).filter(([, e]) => e.enabled).map(([e]) => e), o = [.../* @__PURE__ */ new Set([...a, ...Object.keys(n)])].map((t) => {
			let r = n[t];
			return {
				name: i[t] ?? (this.hass ? _(this.hass, t) : t),
				values: r ? [e("past.learned.climate.rate", { rate: v(e.lang, r, 1) })] : [e("learn.still")],
				note: r ? void 0 : e("climate.rate_default")
			};
		});
		return D`<section class="card" data-tipped data-anchor="climate">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:thermostat-auto"></ha-icon>${e("past.learned.climate")}</div>
        ${l(e, "learn_climate")}
      </div>
      ${o.length ? D`<p class="say">${e("past.learned.climate.say")}</p>
            ${Object.keys(n).length ? D`<div class="figure">${S(e, { source: "learned" })}</div>` : j}
            ${ao(o)}` : D`<p class="say">${e("past.learned.climate.none")}</p>
            ${this.goLink({
			tab: "devices",
			section: "climate"
		}, e("past.learned.climate.open"))}`}
    </section>`;
	}
	renderPresence(e, t) {
		let n = this.state.config, r = this.state?.climate?.usual ?? {}, i = n.persons, a = i.map((n) => {
			let i = po(e, t.learned, n, n.person_entity ? r[n.person_entity] : void 0);
			return n.calendars.length ? i : {
				...i,
				extra: this.goLink({
					tab: "household",
					section: "people",
					id: n.id
				}, e("learn.presence.calendars"))
			};
		});
		return this.rowsCard(e, "presence", "mdi:account-clock-outline", e("learn.presence"), l(e, "learn_presence"), a, e("learn.presence.none"), i.length ? j : this.goLink({
			tab: "household",
			section: "people"
		}, e("learn.presence.calendars")));
	}
	renderReset(e) {
		let t = !this.state?.observe?.active && this.scope !== "climate";
		return D`<section class="card danger wide" data-tipped data-anchor="reset">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:restore"></ha-icon>${e("learn.reset")}</div>
        ${l(e, "learn_reset")}
      </div>
      <p>${e("learn.reset.text")}</p>
      <div class="sub-head with-tip"><b>${e("learn.reset.scope")}</b>${l(e, "learn_reset_scope")}</div>
      <div class="seg scopes" role="group" aria-label=${e("learn.reset.scope")}>
        ${ql.map((t) => D`<button type="button" aria-pressed=${String(this.scope === t)} @click=${() => this.scope = t}>
              ${e(`learn.reset.scope.${t}`)}
            </button>`)}
      </div>
      <div class="actions">
        <button type="button" class="btn btn-danger" ?disabled=${t} @click=${() => this.confirming = !0}>
          ${e(this.scope === "all" ? "learn.reset.button" : "learn.reset.button.scope")}
        </button>
      </div>
      ${t ? D`<p>${e("learn.reset.off")}</p>` : j}
      ${this.notice ? D`<div class="note ${this.notice.ok ? "" : "warn"}" role="status">
            <ha-icon icon=${this.notice.ok ? "mdi:check" : "mdi:alert-outline"}></ha-icon>${this.notice.text}
          </div>` : j}
    </section>`;
	}
	renderConfirm(e) {
		let t = () => {
			this.confirming = !1;
		}, n = this.scope;
		return D`<joe-sheet label=${e("learn.reset.label")} closeLabel=${e("common.close")} @joe-close=${t}>
      <div data-tipped>
        <div class="sheet-title">${y(e("learn.reset.confirm.title"), "h2", l(e, "learn_reset"))}</div>
        <dl class="forget">
          <dt>${e("learn.reset.confirm.forget")}</dt>
          <dd>${e(`learn.reset.forget.${n}`)}</dd>
          <dt>${e("learn.reset.confirm.keep")}</dt>
          <dd>${e(n === "all" ? "learn.reset.confirm.keep.text" : "learn.reset.keep.scope")}</dd>
        </dl>
        <div class="actions">
          <button type="button" class="btn btn-secondary" data-notip @click=${t}>${e("common.cancel")}</button>
          <button type="button" class="btn btn-danger" ?disabled=${this.resetting} @click=${this.reset}>
            ${e("learn.reset.confirm.go")}
          </button>
        </div>
      </div>
    </joe-sheet>`;
	}
	async reset() {
		let e = this.t;
		this.resetting = !0;
		try {
			await this.hass?.callWS({
				type: "energy_joe/learning/reset",
				scope: this.scope
			}), this.confirming = !1, this.notice = {
				text: e(this.scope === "all" ? "learn.reset.done" : "learn.reset.done.scope"),
				ok: !0
			}, await this.load();
		} catch {
			this.confirming = !1, this.notice = {
				text: e("error.action"),
				ok: !1
			};
		} finally {
			this.resetting = !1;
		}
	}
};
d([b({ attribute: !1 })], Yl.prototype, "hass", void 0), d([b({ attribute: !1 })], Yl.prototype, "t", void 0), d([b({ attribute: !1 })], Yl.prototype, "state", void 0), d([b({ attribute: !1 })], Yl.prototype, "prefix", void 0), d([b({ attribute: !1 })], Yl.prototype, "route", void 0), d([b({ attribute: !1 })], Yl.prototype, "climateFound", void 0), d([b({ attribute: !1 })], Yl.prototype, "anchor", void 0), d([T()], Yl.prototype, "data", void 0), d([T()], Yl.prototype, "failed", void 0), d([T()], Yl.prototype, "confirming", void 0), d([T()], Yl.prototype, "resetting", void 0), d([T()], Yl.prototype, "scope", void 0), d([T()], Yl.prototype, "notice", void 0), u("joe-lookback-learned", Yl);
//#endregion
//#region src/pages/lookback/log.ts
var Xl = class extends O {
	constructor(...e) {
		super(...e), this.prefix = A, this.failed = !1;
	}
	static {
		this.styles = [k, w`
      :host {
        display: block;
      }
      .wrap {
        max-width: 1100px;
        margin: 0 auto;
      }
      .display {
        font-size: clamp(30px, 4vw, 44px);
      }
      .lead {
        max-width: 62ch;
      }
      .filters {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 16px;
      }
      .filters + .filters {
        margin-top: 8px;
      }
      .card {
        padding: 18px 20px;
        margin-top: 14px;
      }
      .head {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .head .eyebrow {
        flex: 1;
      }
      .note {
        margin-top: 12px;
      }
    `];
	}
	connectedCallback() {
		super.connectedCallback(), this.load();
	}
	willUpdate(e) {
		let t = this.state?.control?.log ?? [], n = this.state?.climate?.log ?? [], r = `${t.length}|${t.at(-1)?.at ?? ""}|${n.length}|${n.at(-1)?.at ?? ""}`;
		e.has("state") && this.marker !== void 0 && r !== this.marker && this.load(), this.marker = r;
	}
	updated(e) {
		e.has("group") && this.group && !Hi.includes(this.group) && x(this, {
			tab: "review",
			section: "log"
		}, { replace: !0 });
	}
	async load() {
		if (this.hass) try {
			let e = await this.hass.callWS({ type: "energy_joe/log" });
			if (!Array.isArray(e?.entries)) throw Error("no log");
			this.full = e.entries, this.failed = !1;
		} catch {
			this.full = void 0, this.failed = !0;
		}
	}
	get entries() {
		return this.full ?? Ui(this.state?.control?.log, this.state?.climate?.log);
	}
	get filter() {
		return Hi.includes(this.group ?? "") ? this.group : "all";
	}
	render() {
		let e = this.t;
		if (!e || !this.state) return j;
		let t = this.state.config, n = this.entries, r = this.filter, i = Object.fromEntries((this.climateFound?.devices ?? []).map((e) => [e.entity_id, e.name])), a = /* @__PURE__ */ new Map([["all", n.length]]), o = /* @__PURE__ */ new Map();
		for (let e of n) {
			let n = Wi(t, e);
			a.set(n.group, (a.get(n.group) ?? 0) + 1), n.group === r && n.device && o.set(n.device, (o.get(n.device) ?? 0) + 1);
		}
		let s = r === "all" ? void 0 : this.device, c = [e(r === "all" ? "past.log.all" : `past.log.filter.${r}`), ...s ? [Gi(t, this.hass, i, r, s)] : []].join(" · ");
		return D`<div class="wrap">
      ${y(e("past.log.title"))} ${M}
      <p class="lead">${e("past.log.lead")}</p>
      <nav class="filters" aria-label=${e("past.log.filters")}>
        ${Hi.filter((e) => e === "all" || e === r || a.get(e)).map((t) => this.chip({
			tab: "review",
			section: "log",
			id: t
		}, e(t === "all" ? "past.log.all" : `past.log.filter.${t}`), t === r && !s, a.get(t)))}
      </nav>
      ${r !== "all" && r !== "joe" && (o.size > 1 || s) ? D`<nav class="filters" aria-label=${e("past.log.devices")}>
            ${[.../* @__PURE__ */ new Set([...o.keys(), ...s ? [s] : []])].map((e) => this.chip({
			tab: "review",
			section: "log",
			id: r,
			sub: e
		}, Gi(t, this.hass, i, r, e), e === s, o.get(e) ?? 0))}
          </nav>` : j}
      <section class="card" data-tipped>
        <div class="head">
          <div class="eyebrow"><ha-icon icon="mdi:clipboard-text-clock-outline"></ha-icon>${c}</div>
          ${l(e, "past_log")}
        </div>
        ${this.failed && n.length ? D`<div class="note"><ha-icon icon="mdi:information-outline"></ha-icon>${e("past.log.partial")}</div>` : j}
        <joe-log-list
          .t=${e}
          .hass=${this.hass}
          .config=${t}
          .names=${i}
          .entries=${n}
          .filter=${{
			group: r,
			device: s
		}}
          .empty=${n.length ? e("past.log.empty_filter") : e("past.log.empty")}
        ></joe-log-list>
      </section>
    </div>`;
	}
	chip(e, t, n, r) {
		return D`<a
      class="section-chip ${n ? "on" : ""}"
      href=${E(this.prefix, e)}
      aria-current=${n ? "page" : j}
      @click=${C(e, { replace: !0 })}
      >${t}${r == null ? j : D`<span class="section-count">${r}</span>`}</a
    >`;
	}
};
d([b({ attribute: !1 })], Xl.prototype, "hass", void 0), d([b({ attribute: !1 })], Xl.prototype, "t", void 0), d([b({ attribute: !1 })], Xl.prototype, "state", void 0), d([b({ attribute: !1 })], Xl.prototype, "prefix", void 0), d([b({ attribute: !1 })], Xl.prototype, "route", void 0), d([b({ attribute: !1 })], Xl.prototype, "climateFound", void 0), d([b({ attribute: !1 })], Xl.prototype, "group", void 0), d([b({ attribute: !1 })], Xl.prototype, "device", void 0), d([T()], Xl.prototype, "full", void 0), d([T()], Xl.prototype, "failed", void 0), u("joe-lookback-log", Xl);
//#endregion
//#region src/pages/lookback/result.ts
var Zl = class extends O {
	constructor(...e) {
		super(...e), this.prefix = A, this.failed = !1;
	}
	static {
		this.styles = [k, w`
      :host {
        display: block;
      }
      .wrap {
        max-width: 1100px;
        margin: 0 auto;
      }
      .display {
        font-size: clamp(30px, 4vw, 44px);
      }
      .lead {
        max-width: 62ch;
      }
      .card {
        padding: 18px 20px;
        margin-top: 12px;
      }
      .hero {
        margin-top: 18px;
      }
      .head {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .head .eyebrow {
        flex: 1;
      }
      .figure {
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
        gap: 6px 12px;
        margin-top: 10px;
      }
      .big {
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 800;
        font-size: clamp(52px, 7vw, 76px);
        line-height: 1;
        font-variant-numeric: tabular-nums;
      }
      .big.good {
        color: var(--joe-good);
      }
      .big.bad {
        color: var(--joe-crit);
      }
      .say {
        margin: 10px 0 0;
        font-size: 15px;
        line-height: 1.5;
        color: var(--joe-ink-2);
        max-width: 62ch;
      }
      .split {
        margin: 6px 0 0;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
      }
      joe-chart {
        margin-top: 10px;
      }
      .table {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) minmax(0, 1fr) auto;
        align-items: center;
        margin-top: 10px;
        font-variant-numeric: tabular-nums;
      }
      .table > span {
        padding: 4px 10px;
        min-height: 44px;
        display: flex;
        align-items: center;
        border-top: 1px solid var(--joe-line);
        white-space: nowrap;
      }
      .table > span.th {
        align-self: end;
        min-height: 0;
        padding-block: 8px;
        white-space: normal;
        line-height: 1.25;
        border-top: 0;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--joe-muted);
      }
      .table .unit {
        margin-left: 4px;
        text-transform: none;
        letter-spacing: 0;
        font-weight: 400;
      }
      .table > span:nth-child(4n) {
        justify-content: flex-end;
        font-weight: 700;
      }
      .table a {
        display: inline-flex;
        align-items: center;
        min-height: 44px;
        font-weight: 600;
        color: var(--joe-ink);
        text-decoration: underline;
        text-decoration-color: var(--joe-line-2);
        text-underline-offset: 3px;
      }
      .table a:hover {
        text-decoration-color: var(--joe-amber);
      }
      .table .good {
        color: var(--joe-good);
      }
      .table .bad {
        color: var(--joe-crit);
      }
      .note {
        margin-top: 12px;
      }
      @media (max-width: 760px) {
        .table {
          font-size: 13.5px;
        }
        .table > span {
          padding: 4px 6px;
        }
      }
    `];
	}
	connectedCallback() {
		super.connectedCallback(), this.load();
	}
	willUpdate(e) {
		let t = ho(this.state);
		e.has("state") && this.marker !== void 0 && t !== this.marker && this.load(), this.marker = t;
	}
	async load() {
		if (this.hass) try {
			this.data = await this.hass.callWS({ type: "energy_joe/learning" }), this.failed = !1;
		} catch {
			this.failed = !0;
		}
	}
	get currency() {
		return this.hass?.config?.currency ?? "EUR";
	}
	render() {
		let e = this.t;
		return e ? D`<div class="wrap">
      ${y(e("past.result.title"))} ${M}
      <p class="lead">${e("past.result.lead")}</p>
      ${this.failed ? D`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("learn.failed")}</div>` : j}
      ${this.data ? D`${this.renderResults(e, this.data)} ${this.renderAccuracy(e, this.data)}` : j}
    </div>` : j;
	}
	renderResults(e, t) {
		let n = t.results, r = D`<div class="head">
      <div class="eyebrow"><ha-icon icon="mdi:cash-check"></ha-icon>${e("past.result.total")}</div>
      <span class="pill-sim">${e("mode.simulation")}</span>
      ${l(e, "sim_result")}
    </div>`;
		if (!n?.days) return D`<section class="card hero" data-tipped>${r}
        <p class="say">${e("learn.results.none")}</p>
      </section>`;
		let i = n.daily, a = [{
			label: e("learn.results.chart.saving"),
			kind: "bar",
			values: i.map((e) => e.saving),
			color: "var(--joe-good)",
			negative: "var(--joe-crit)",
			digits: 2
		}], o = n.since ?? n.first;
		return D`<section class="card hero" data-tipped>
      ${r}
      <div class="figure">
        <div class="big ${n.saving > .005 ? "good" : n.saving < -.005 ? "bad" : ""}">
          ${Dn(e, n.saving, this.currency, !0)}
        </div>
      </div>
      <p class="say">
        ${e("learn.results.say", {
			since: o ? U(e.lang, o) : "–",
			nights: An(e, n.days)
		})}
      </p>
      <p class="split">
        ${e("learn.results.split", {
			better: n.better,
			worse: n.worse,
			same: Math.max(0, n.days - n.better - n.worse)
		})}
      </p>
      ${i.length > 1 ? D`<joe-chart
            .labels=${i.map((t) => U(e.lang, t.date, "weekday"))}
            .ticks=${go(e.lang, i.map((e) => e.date))}
            .series=${a}
            centerTicks
            unit=${On(e.lang, this.currency)}
            height="160"
            lang=${e.lang}
            label=${e("learn.results.chart")}
          ></joe-chart>` : j}
    </section>`;
	}
	renderAccuracy(e, t) {
		let n = t.accuracy.slice(-14).reverse(), r = (t) => t == null ? "–" : H(e.lang, t, 1);
		return D`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:target"></ha-icon>${e("learn.accuracy")}</div>
        ${l(e, "learn_accuracy")}
      </div>
      ${n.length ? D`<div class="table" role="table" aria-label=${e("learn.accuracy")}>
            <span class="th" role="columnheader">${e("learn.accuracy.night")}</span>
            <span class="th" role="columnheader">${e("learn.accuracy.solar")}<span class="unit">kWh</span></span>
            <span class="th" role="columnheader">${e("learn.accuracy.morning")}<span class="unit">kWh</span></span>
            <span class="th" role="columnheader">${e("learn.accuracy.result")}</span>
            ${n.map((t) => {
			let n = {
				tab: "review",
				section: "days",
				id: t.end ?? t.date
			};
			return D`<span role="cell"
                  ><a href=${E(this.prefix, n)} @click=${C(n)}>${U(e.lang, t.date, "weekday")}</a></span
                >
                <span role="cell">${e("learn.accuracy.value", {
				expected: r(t.solar.forecast),
				actual: r(t.solar.actual)
			})}</span>
                <span role="cell">${e("learn.accuracy.value", {
				expected: r(t.bridge.planned),
				actual: r(t.bridge.actual)
			})}</span>
                <span role="cell" class=${t.saving > .005 ? "good" : t.saving < -.005 ? "bad" : ""}
                  >${Dn(e, t.saving, this.currency, !0)}</span
                >`;
		})}
          </div>` : D`<p class="say">${e("learn.accuracy.none")}</p>`}
    </section>`;
	}
};
d([b({ attribute: !1 })], Zl.prototype, "hass", void 0), d([b({ attribute: !1 })], Zl.prototype, "t", void 0), d([b({ attribute: !1 })], Zl.prototype, "state", void 0), d([b({ attribute: !1 })], Zl.prototype, "prefix", void 0), d([b({ attribute: !1 })], Zl.prototype, "route", void 0), d([b({ attribute: !1 })], Zl.prototype, "climateFound", void 0), d([T()], Zl.prototype, "data", void 0), d([T()], Zl.prototype, "failed", void 0), u("joe-lookback-result", Zl);
//#endregion
//#region src/pages/lookback/index.ts
var Ql = {
	result: "joe-lookback-result",
	days: "joe-lookback-days",
	learned: "joe-lookback-learned",
	log: "joe-lookback-log"
}, $l = {
	result: "mdi:piggy-bank-outline",
	days: "mdi:calendar-month-outline",
	learned: "mdi:school-outline",
	log: "mdi:format-list-bulleted"
}, eu = class extends O {
	constructor(...e) {
		super(...e), this.prefix = A;
	}
	static {
		this.styles = [k, w`
      :host {
        display: block;
      }
    `];
	}
	render() {
		let e = this.t;
		if (!e || !this.state) return j;
		let t = this.route?.section ?? ye.review, n = he.review.map((t) => ({
			id: t,
			label: e(`nav.review.${t}`),
			icon: $l[t]
		}));
		return D`${zr(e, this.prefix, "review", n, t)}${this.renderSection(t)}`;
	}
	renderSection(e) {
		if (!customElements.get(Ql[e])) return D``;
		let { t, hass: n, state: r, prefix: i, route: a, climateFound: o } = this;
		switch (e) {
			case "result": return D`<joe-lookback-result
          .t=${t}
          .hass=${n}
          .state=${r}
          .prefix=${i}
          .route=${a}
          .climateFound=${o}
        ></joe-lookback-result>`;
			case "days": return D`<joe-lookback-days
          .t=${t}
          .hass=${n}
          .state=${r}
          .prefix=${i}
          .route=${a}
          .climateFound=${o}
          .day=${a?.id}
        ></joe-lookback-days>`;
			case "learned": return D`<joe-lookback-learned
          .t=${t}
          .hass=${n}
          .state=${r}
          .prefix=${i}
          .route=${a}
          .climateFound=${o}
          .anchor=${a?.id}
        ></joe-lookback-learned>`;
			case "log": return D`<joe-lookback-log
          .t=${t}
          .hass=${n}
          .state=${r}
          .prefix=${i}
          .route=${a}
          .climateFound=${o}
          .group=${a?.id}
          .device=${a?.sub}
        ></joe-lookback-log>`;
		}
	}
};
d([b({ attribute: !1 })], eu.prototype, "hass", void 0), d([b({ attribute: !1 })], eu.prototype, "t", void 0), d([b({ attribute: !1 })], eu.prototype, "state", void 0), d([b({ attribute: !1 })], eu.prototype, "route", void 0), d([b({ attribute: !1 })], eu.prototype, "prefix", void 0), d([b({ attribute: !1 })], eu.prototype, "climateFound", void 0), u("joe-lookback-page", eu);
//#endregion
//#region src/components/review.ts
var tu = /* @__PURE__ */ new Set([
	"climate",
	"heat_pump",
	"electric_heating",
	"hot_water"
]), nu = {
	battery: "nav.devices.battery",
	grid: "nav.devices.grid",
	car: "nav.devices.car",
	other: "nav.devices.other",
	people: "nav.household.people",
	weather: "onb.part.weather",
	holiday: "onb.part.holiday"
}, ru = class extends O {
	constructor(...e) {
		super(...e), this.checks = [], this.omit = [], this.tariffOpen = !1;
	}
	static {
		this.styles = [
			k,
			fc,
			w`
      :host {
        display: block;
      }
      joe-tariff-draft {
        margin-top: 18px;
      }
      .group + .group {
        margin-top: 28px;
      }
      .group-head {
        margin: 0;
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 800;
        text-transform: uppercase;
        font-size: 24px;
        line-height: 1.1;
      }
      .group-lead {
        margin: 4px 0 0;
        color: var(--joe-ink-2);
        font-size: 14px;
      }
      .part {
        margin-top: 14px;
      }
      .part h4 {
        margin: 0 0 8px;
      }
    `
		];
	}
	render() {
		let { hass: e, t, config: n } = this;
		if (!e || !t || !n) return j;
		let r = new Set(this.omit), i = this.parts(e, t, n);
		return D`${[{
			key: "devices",
			parts: [
				"battery",
				"grid",
				"car",
				"other"
			]
		}, {
			key: "household",
			parts: [
				"people",
				"weather",
				"holiday"
			]
		}].map((e) => D`<section class="group">
          <h3 class="group-head">${t(`onb.group.${e.key}`)}</h3>
          <p class="group-lead">${t(`onb.group.${e.key}.lead`)}</p>
          ${e.parts.map((e) => {
			let n = i[e].filter((e) => !r.has(e.key));
			return n.length ? D`<div class="part">
                  <h4 class="eyebrow">${t(nu[e])}</h4>
                  <ul class="found">
                    ${n.map((e) => mc(t, e))}
                  </ul>
                </div>` : j;
		})}
        </section>`)}
      ${this.tariffOpen ? this.renderTariff(t, n) : j}`;
	}
	parts(e, t, n) {
		let r = this.discovery, i = {
			from: this,
			hass: e,
			t,
			config: n,
			discovery: r,
			checks: this.checks
		}, a = [], o = Sc(i);
		o && a.push(o);
		let s = n.tariff.kind === "unknown";
		return a.push(Cc(i, { actions: [X(t(s ? "review.enter" : "review.change"), "mdi:pencil-outline", () => {
			this.tariffOpen = !0;
		})] }), wc(i), Ec(i, "grid_power"), Ec(i, "home_power", { devices: X(t("review.home.devices"), "mdi:devices", () => this.edit("consumers")) }), Ac(i)), {
			battery: this.batteryRows(e, t, n),
			grid: a,
			car: this.carRows(t, n),
			other: [this.otherRow(t, n)],
			people: [this.peopleRow(t, n)],
			weather: [_c(this, e, t, n, r, "weather")],
			holiday: [_c(this, e, t, n, r, "holiday")]
		};
	}
	carRows(e, t) {
		let n = this.discovery, r = [];
		for (let t of n?.wallboxes.filter((e) => e.is_car) ?? []) r.push({
			key: `car:wallbox:${t.device_id ?? t.name}`,
			icon: "mdi:ev-station",
			title: t.name,
			detail: e("onb.car.wallbox")
		});
		for (let t of n?.cars ?? []) {
			let n = t.soc === null ? "" : ` · ${v(e.lang, t.soc, 0)} %`;
			r.push({
				key: `car:car:${t.device_id}`,
				icon: "mdi:car-electric",
				title: t.name,
				detail: `${e("onb.car.car")}${n}`
			});
		}
		for (let n of t.consumers.filter((e) => e.kind === "ev")) r.push({
			key: `car:meter:${n.id}`,
			icon: "mdi:meter-electric-outline",
			title: n.name,
			detail: e("onb.car.meter")
		});
		return r.length || r.push({
			key: "car:none",
			icon: "mdi:car-electric",
			title: e("nav.devices.car"),
			detail: e("find.none"),
			state: "missing",
			notes: [pc(e("onb.car.none"))]
		}), r;
	}
	otherRow(e, t) {
		let n = t.consumers.filter((e) => e.kind !== "submeter");
		return n.length ? {
			key: "devices",
			icon: "mdi:devices",
			title: e("find.devices"),
			detail: e("find.devices.detail", {
				count: Z(e, n.length, "word.device"),
				heating: n.filter((e) => tu.has(e.kind)).length
			})
		} : {
			key: "devices",
			icon: "mdi:devices",
			title: e("find.devices"),
			detail: e("find.none"),
			state: "missing",
			notes: [pc(e("onb.other.none"))]
		};
	}
	peopleRow(e, t) {
		let n = this.discovery?.calendars.length ?? 0;
		return !t.persons.length && !n ? {
			key: "people",
			icon: "mdi:account-group-outline",
			title: e("find.people"),
			detail: e("find.none"),
			state: "missing",
			notes: [pc(e("onb.people.none"))]
		} : {
			key: "people",
			icon: "mdi:account-group-outline",
			title: e("find.people"),
			detail: e("find.people.detail", {
				persons: Z(e, t.persons.length, "word.person"),
				calendars: Z(e, n, "word.calendar")
			})
		};
	}
	batteryRows(e, t, n) {
		let r = [];
		for (let i of n.batteries) {
			let a = this.discovery?.batteries.find((e) => e.id === i.id), o = ie(e, i.soc_entity), s = i.capacity_kwh ?? f(e, i.capacity_entity), c = [
				s ? `${v(t.lang, s, 2)} kWh` : t("review.capacity_unknown"),
				o === null ? null : `${v(t.lang, o, 0)} %`,
				i.adapter === "none" ? t("find.battery.read") : t("find.battery.control")
			], l = this.checks.filter((e) => e.battery_id === i.id);
			r.push({
				key: `battery:${i.id}`,
				icon: "mdi:home-battery-outline",
				title: i.name,
				detail: c.filter(Boolean).join(" · "),
				chips: [S(t, P(n, `batteries[${i.id}].soc_entity`)), ...a ? [oe(t, a.confidence)] : []],
				reasons: a?.reasons,
				notes: l.map((e) => yc(t, e)),
				state: l.some((e) => e.level === "warn") ? "flag" : void 0,
				tip: "review_battery",
				actions: [X(t("review.change"), "mdi:pencil-outline", () => this.edit("battery", i.id)), X(t("review.ignore"), "", () => this.ignoreBattery(i.id), !0)]
			});
		}
		for (let e of this.discovery?.batteries ?? []) F(n, `battery:${e.id}`) && !n.batteries.some((t) => t.id === e.id) && r.push({
			key: `battery:${e.id}`,
			icon: "mdi:home-battery-outline",
			title: e.name,
			detail: t("review.ignored"),
			state: "ignored",
			tip: "review_ignored",
			actions: [X(t("review.use"), "mdi:undo-variant", () => void Zr(this, n, e))]
		});
		return !n.batteries.length && !this.discovery?.batteries.length && r.push({
			key: "battery:add",
			icon: "mdi:home-battery-outline",
			title: t("review.battery"),
			detail: t("review.battery.none"),
			state: "missing",
			tip: "review_battery_add",
			actions: [X(t("review.add"), "mdi:plus", () => void Qr(this, t, e, n))]
		}), r;
	}
	edit(e, t) {
		this.dispatchEvent(new CustomEvent("joe-edit", {
			detail: {
				editor: e,
				id: t
			},
			bubbles: !0,
			composed: !0
		}));
	}
	ignoreBattery(e) {
		I(this, {
			batteries: { [e]: null },
			answers: { ignored: Ye(this.config, `battery:${e}`, !0) }
		});
	}
	renderTariff(e, t) {
		return D`<joe-sheet label=${e("edit.tariff.label")} closeLabel=${e("common.close")} @joe-close=${(e) => {
			e.stopPropagation(), this.tariffOpen = !1;
		}}>
      <div class="sheet-title">${y(e("edit.tariff.title"))}</div>
      <joe-tariff-draft closable .hass=${this.hass} .t=${e} .config=${t} .discovery=${this.discovery}></joe-tariff-draft>
    </joe-sheet>`;
	}
};
d([b({ attribute: !1 })], ru.prototype, "hass", void 0), d([b({ attribute: !1 })], ru.prototype, "t", void 0), d([b({ attribute: !1 })], ru.prototype, "config", void 0), d([b({ attribute: !1 })], ru.prototype, "discovery", void 0), d([b({ attribute: !1 })], ru.prototype, "checks", void 0), d([b({ attribute: !1 })], ru.prototype, "omit", void 0), d([T()], ru.prototype, "tariffOpen", void 0), u("joe-review", ru);
//#endregion
//#region src/components/step-nav.ts
function iu(e, t, n = !1) {
	let r = D`<button type="button" class="btn btn-primary" ?data-notip=${!t.nextTip} @click=${t.next}>
    ${t.nextLabel}<ha-icon icon="mdi:chevron-right"></ha-icon>
  </button>`;
	return D`<nav class="step-nav ${n ? "wide" : ""}" aria-label=${e("onb.nav")}>
    ${t.back ? D`<button type="button" class="btn btn-ghost" data-notip @click=${t.back}>
          <ha-icon icon="mdi:chevron-left"></ha-icon>${t.backLabel ?? e("onb.back")}
        </button>` : D`<span></span>`}
    ${t.nextTip ? D`<span class="with-tip" data-tipped>${r} ${l(e, t.nextTip)}</span>` : r}
  </nav>`;
}
//#endregion
//#region src/pages/questions.ts
var au = {
	tariff: "plan",
	feed_in: "plug",
	capacity: "night-charge",
	heating: "ask",
	climate: "switch",
	hot_water: "hot-water",
	ev: "ev",
	home_office: "plan",
	household: "relax"
}, ou = [
	"climate",
	"heat_pump",
	"electric_heating"
];
function su(e) {
	let t = [], n = (t) => P(e, t)?.source === "user", r = (t) => e.answers[t] !== void 0 && e.answers[t] !== null, i = e.tariff;
	(i.kind === "unknown" || n("tariff.kind") || r("tariff")) && t.push("tariff"), (i.feed_in_price == null && !i.feed_in_entity || n("tariff.feed_in_price") || r("feed_in")) && t.push("feed_in");
	for (let i of e.batteries) {
		let e = `capacity:${i.id}`;
		(i.capacity_kwh == null && !i.capacity_entity || n(`batteries[${i.id}].capacity_kwh`) || r(e)) && t.push(e);
	}
	return t.push("heating", "climate", "hot_water", "ev", "home_office", "household"), t;
}
var cu = class extends O {
	constructor(...e) {
		super(...e), this.single = "", this.index = 0;
	}
	static {
		this.styles = [k, w`
      :host {
        display: block;
      }
      .step-nav {
        max-width: 1060px;
      }
      .wrap {
        display: grid;
        grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
        gap: 32px;
        align-items: start;
        max-width: 1060px;
        margin: 0 auto;
        padding-block: 12px 32px;
      }
      joe-pose {
        width: 100%;
        max-width: 400px;
        justify-self: center;
        position: sticky;
        top: 96px;
      }
      .display {
        font-size: clamp(34px, 4.6vw, 52px);
      }
      .title-row {
        margin-top: 8px;
      }
      .content {
        margin-top: 18px;
      }
      .follow {
        margin-top: 16px;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 8px;
      }
      .inline {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
      }
      .hint {
        margin: 10px 0 0;
        color: var(--joe-ink-2);
        font-size: 14px;
      }
      .topics {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;
        margin-bottom: 10px;
      }
      .topics .eyebrow {
        margin-right: 4px;
      }
      .topic {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        min-height: 32px;
        padding: 4px 12px;
        border: 1px solid var(--joe-line-2);
        border-radius: 999px;
        background: var(--joe-surface);
        color: var(--joe-ink-2);
        font: inherit;
        font-size: 13.5px;
        cursor: pointer;
      }
      @media (pointer: coarse) {
        .topic {
          min-height: 44px;
        }
      }
      .topic:hover {
        border-color: var(--joe-amber);
      }
      .topic.done {
        color: var(--joe-ink);
      }
      .topics .arrow {
        --mdc-icon-size: 18px;
        color: var(--joe-muted);
        margin: 0 -2px;
      }
      .topic ha-icon {
        --mdc-icon-size: 16px;
      }
      .topic[aria-current="step"] {
        background: var(--joe-ink);
        border-color: var(--joe-ink);
        color: var(--joe-bg);
        font-weight: 700;
      }
      @media (max-width: 760px) {
        .wrap {
          grid-template-columns: 1fr;
          gap: 12px;
          padding-block: 4px 24px;
        }
        joe-pose {
          position: static;
          max-width: 190px;
        }
      }
    `];
	}
	topic(e, t, n) {
		return n.startsWith("capacity:") ? t.batteries.find((e) => `capacity:${e.id}` === n)?.name ?? e("ask.topic.capacity") : e.optional(`ask.topic.${n}`) ?? n;
	}
	render() {
		let { t: e, config: t } = this;
		if (!e || !t) return j;
		if (this.single) return this.renderQuestion(e, t, this.single);
		let n = su(t), r = Math.min(this.index, n.length - 1), i = n[r], a = r === n.length - 1, o = Ro(t), s = iu(e, {
			back: () => this.move(-1, n.length),
			next: () => this.move(1, n.length),
			nextLabel: e(a ? "ask.finish" : "onb.next")
		});
		return D`${s}
      <div class="wrap">
        <joe-pose name=${au[i.split(":")[0]] ?? "ask"}></joe-pose>
        <div>
          <nav class="topics" aria-label=${e("ask.topics")} data-notip>
            <span class="eyebrow">${e("ask.count", {
			n: r + 1,
			total: n.length
		})}</span>
            ${n.map((n, i) => D`${i ? D`<ha-icon class="arrow" icon="mdi:chevron-right" aria-hidden="true"></ha-icon>` : j}<button
                type="button"
                class="topic ${i < r ? "done" : ""}"
                aria-current=${i === r ? "step" : "false"}
                @click=${() => this.index = i}
              >
                ${o.includes(n) ? D`<ha-icon icon="mdi:clock-outline" title=${e("ask.later.marked")}></ha-icon>` : i < r ? D`<ha-icon icon="mdi:check"></ha-icon>` : j}${this.topic(e, t, n)}
              </button>`)}
          </nav>
          ${this.renderQuestion(e, t, i)}
          <div class="actions">
            <button type="button" class="btn btn-primary" data-notip @click=${() => this.move(1, n.length)}>
              ${e(a ? "ask.finish" : "onb.next")}
            </button>
            <span class="with-tip" data-tipped>
              <button
                type="button"
                class="btn btn-secondary"
                aria-pressed=${o.includes(i) ? "true" : "false"}
                @click=${() => this.later(i, n.length)}
              >
                <ha-icon icon="mdi:clock-outline"></ha-icon>${e("ask.later")}
              </button>
              ${l(e, "ask_later")}
            </span>
            <button type="button" class="btn btn-ghost" data-notip @click=${() => this.move(-1, n.length)}>
              ${e("onb.back")}
            </button>
          </div>
        </div>
      </div>`;
	}
	renderQuestion(e, t, n) {
		if (n.startsWith("capacity:")) return this.renderCapacity(e, t, n.slice(9));
		switch (n) {
			case "tariff": return this.question(e("q.tariff.title"), "q_tariff", D`<joe-tariff-form
            .hass=${this.hass}
            .t=${e}
            .tariff=${t.tariff}
            .discovery=${this.discovery}
            asQuestion
            @joe-tariff=${(e) => this.saveTariff(e.detail)}
          ></joe-tariff-form>`);
			case "feed_in": return this.renderFeedIn(e, t);
			case "heating": return this.renderHeating(e, t);
			case "hot_water": return this.renderHotWater(e, t);
			case "climate": return this.question(e("q.climate.title"), "q_climate", D`${this.choice(e, "climate", [{
				value: "yes",
				label: e("q.climate.yes"),
				icon: "mdi:thermostat-auto"
			}, {
				value: "no",
				label: e("q.climate.no"),
				icon: "mdi:hand-back-right-outline"
			}], !1, (e) => e === "yes" || e === "no" ? { climate: { enabled: e === "yes" } } : {})}
            <p class="hint">${e(t.climate?.enabled ? "q.climate.on" : "q.climate.hint")}</p>`);
			case "ev": return this.renderEv(e, t);
			case "home_office": return this.question(e("q.home_office.title"), "q_home_office", D`${this.choice(e, "home_office", [{
				value: "yes",
				label: e("q.home_office.yes"),
				icon: "mdi:home-account"
			}, {
				value: "no",
				label: e("q.home_office.no"),
				icon: "mdi:office-building-outline"
			}], !1, (e) => e === "yes" || e === "no" ? { calendar: { default_workday: e === "yes" ? "home_office" : "office" } } : {})}
            <p class="hint">${e("q.home_office.hint")}</p>`);
			default: return this.question(e("q.household.title"), "q_household", D`<joe-household
            .hass=${this.hass}
            .t=${e}
            .config=${t}
            .discovery=${this.discovery}
          ></joe-household>`);
		}
	}
	question(e, t, n) {
		let r = this.t;
		return D`<div data-tipped>
      <div class="title-row">${y(e, "h2", l(r, t))}</div>
      ${M}
      <div class="content">${n}</div>
    </div>`;
	}
	choice(e, t, n, r = !1, i) {
		let a = this.config?.answers[t];
		return D`<joe-choice
      .options=${n}
      .value=${Array.isArray(a) ? a : typeof a == "string" ? [a] : []}
      ?multiple=${r}
      .exclusive=${["none"]}
      idk=${e("ask.idk")}
      @joe-choice=${(e) => {
			let n = e.detail.value[0] ?? null;
			this.answer(t, {
				...i?.(n) ?? {},
				answers: { [t]: r ? e.detail.value : n }
			});
		}}
    ></joe-choice>`;
	}
	renderHotWater(e, t) {
		let n = t.answers.hot_water, r = n === "hot_water_heat_pump" || n === "electric", i = t.consumers.filter((e) => e.kind === "hot_water"), a = t.actions.find((e) => nt(e, Bo(t, e)) === "hot_water");
		return this.question(e("q.hot_water.title"), "q_hot_water", D`${this.choice(e, "hot_water", [
			{
				value: "hot_water_heat_pump",
				label: e("q.hot_water.heat_pump"),
				icon: "mdi:water-boiler"
			},
			{
				value: "electric",
				label: e("q.hot_water.electric"),
				icon: "mdi:flash"
			},
			{
				value: "heating",
				label: e("q.hot_water.heating"),
				icon: "mdi:radiator"
			},
			{
				value: "other",
				label: e("q.hot_water.other"),
				icon: "mdi:fire"
			}
		])}
      ${r ? D`<div class="follow">
            <p class="hint">${i.length ? e("q.hot_water.devices") : e("q.hot_water.no_devices")}</p>
            ${i.length ? D`<div class="chips">${i.map((e) => D`<span class="chip learned">${e.name}</span>`)}</div>` : j}
            <p class="hint">${a ? e("q.hot_water.has_action", { name: a.name }) : e("q.hot_water.offer")}</p>
            <div class="with-tip" data-tipped style="margin-top:10px">
              <button
                type="button"
                class="mini-btn ${a ? "" : "go"}"
                @click=${() => this.dispatchEvent(new CustomEvent("joe-edit", {
			detail: {
				editor: "action",
				id: a ? a.id : "new:hot_water"
			},
			bubbles: !0,
			composed: !0
		}))}
              >
                <ha-icon icon=${a ? "mdi:pencil-outline" : "mdi:water-boiler"}></ha-icon>${e(a ? "q.hot_water.edit" : "q.hot_water.set_up")}
              </button>
              ${l(e, "q_hot_water_action")}
            </div>
          </div>` : j}`);
	}
	renderEv(e, t) {
		let n = this.discovery?.wallboxes.find((e) => e.is_car), r = t.actions.find((e) => nt(e, Bo(t, e)) === "car");
		return this.question(e("q.ev.title"), "q_ev", D`${this.choice(e, "ev", [{
			value: "yes",
			label: n ? e("q.ev.yes_wallbox", { name: n.name }) : e("q.ev.yes"),
			icon: "mdi:car-electric"
		}, {
			value: "no",
			label: e("q.ev.no"),
			icon: "mdi:car-off"
		}])}
      ${t.answers.ev === "yes" ? D`<div class="follow">
            <p class="hint">${r ? e("q.ev.has_action", { name: r.name }) : e("q.ev.offer")}</p>
            <div class="with-tip" data-tipped style="margin-top:10px">
              <button
                type="button"
                class="mini-btn ${r ? "" : "go"}"
                @click=${() => this.dispatchEvent(new CustomEvent("joe-edit", {
			detail: {
				editor: "action",
				id: r ? r.id : "new:ev"
			},
			bubbles: !0,
			composed: !0
		}))}
              >
                <ha-icon icon=${r ? "mdi:pencil-outline" : "mdi:ev-station"}></ha-icon>${e(r ? "q.ev.edit" : "q.ev.set_up")}
              </button>
              ${l(e, "q_ev_action")}
            </div>
          </div>` : j}`);
	}
	renderHeating(e, t) {
		let n = t.answers.heating, r = Array.isArray(n) ? n : [], i = t.consumers.filter((e) => r.includes(e.kind)), a = r.some((e) => ou.includes(e));
		return this.question(e("q.heating.title"), "q_heating", D`${this.choice(e, "heating", [
			{
				value: "climate",
				label: e("q.heating.climate"),
				icon: "mdi:air-conditioner"
			},
			{
				value: "heat_pump",
				label: e("q.heating.heat_pump"),
				icon: "mdi:heat-pump-outline"
			},
			{
				value: "electric_heating",
				label: e("q.heating.electric"),
				icon: "mdi:radiator"
			},
			{
				value: "none",
				label: e("q.heating.none")
			}
		], !0)}
        ${a && t.consumers.length ? D`<div class="follow">
              <p class="hint">${i.length ? e("q.heating.devices") : e("q.heating.no_devices")}</p>
              ${i.length ? D`<div class="chips">
                    ${i.map((e) => D`<span class="chip learned">${e.name}</span>`)}
                  </div>` : j}
              <div class="with-tip" style="margin-top:10px">
                <button type="button" class="mini-btn" @click=${() => this.edit("consumers")}>
                  <ha-icon icon="mdi:devices"></ha-icon>${e("q.heating.assign")}
                </button>
                ${l(e, "f_consumer_kind")}
              </div>
            </div>` : j}`);
	}
	renderFeedIn(e, t) {
		let n = t.tariff.feed_in_price, r = t.answers.feed_in === Fa;
		return this.question(e("q.feed_in.title"), "q_feed_in", D`<div class="inline">
        <span class="unit-input">
          <input
            class="input"
            type="number"
            inputmode="decimal"
            min="0"
            max="999"
            step="0.01"
            aria-label=${e("f.feed_in")}
            placeholder=${e("f.price.unknown")}
            .value=${n == null ? "" : String(Math.round(n * 1e6) / 1e4)}
            @change=${(e) => {
			let t = Number.parseFloat(e.target.value), n = Number.isFinite(t) && t >= 0;
			this.answer("feed_in", {
				tariff: { feed_in_price: n ? Math.round(t * 100) / 1e4 : null },
				answers: { feed_in: n ? "known" : null }
			});
		}}
          />
          <span class="unit">ct/kWh</span>
        </span>
        <button
          type="button"
          class="mini-btn ${n === 0 ? "go" : ""}"
          @click=${() => this.answer("feed_in", {
			tariff: { feed_in_price: 0 },
			answers: { feed_in: "none" }
		})}
        >
          ${e("q.feed_in.none")}
        </button>
        <button
          type="button"
          class="mini-btn ${r ? "go" : ""}"
          @click=${() => this.answer("feed_in", {
			tariff: { feed_in_price: null },
			answers: { feed_in: Fa }
		})}
        >
          ${e("ask.idk")}
        </button>
      </div>`);
	}
	renderCapacity(e, t, n) {
		let r = t.batteries.find((e) => e.id === n);
		if (!r) return D``;
		let i = `capacity:${n}`, a = t.answers[i] === Fa;
		return this.question(e("q.capacity.title", { name: r.name }), "q_capacity", D`<div class="inline">
        <span class="unit-input">
          <input
            class="input"
            type="number"
            inputmode="decimal"
            min="0.1"
            max="1000"
            step="0.01"
            aria-label=${e("f.battery.capacity")}
            .value=${r.capacity_kwh == null ? "" : String(r.capacity_kwh)}
            @change=${(e) => {
			let t = Number.parseFloat(e.target.value), r = Number.isFinite(t) && t > 0;
			this.answer(i, {
				batteries: { [n]: { capacity_kwh: r ? t : null } },
				answers: { [i]: r ? "known" : null }
			});
		}}
          />
          <span class="unit">kWh</span>
        </span>
        <button
          type="button"
          class="mini-btn ${a ? "go" : ""}"
          @click=${() => this.answer(i, {
			batteries: { [n]: { capacity_kwh: null } },
			answers: { [i]: Fa }
		})}
        >
          ${e("ask.idk_learn")}
        </button>
      </div>`);
	}
	saveTariff(e) {
		let t = { tariff: e };
		e.kind && (t.answers = { tariff: e.kind }), this.answer("tariff", t);
	}
	answer(e, t) {
		let n = Ro(this.config);
		n.includes(e) && (t = {
			...t,
			answers: {
				...t.answers ?? {},
				later: n.filter((t) => t !== e)
			}
		}), I(this, t);
	}
	later(e, t) {
		let n = Ro(this.config);
		n.includes(e) || I(this, { answers: { later: [...n, e] } }), this.move(1, t);
	}
	edit(e) {
		this.dispatchEvent(new CustomEvent("joe-edit", {
			detail: { editor: e },
			bubbles: !0,
			composed: !0
		}));
	}
	move(e, t) {
		let n = this.index + e;
		n < 0 ? this.go("scan") : n >= t ? this.go("done") : (this.index = n, this.scrollIntoView?.({
			block: "start",
			behavior: "smooth"
		}));
	}
	go(e) {
		this.dispatchEvent(new CustomEvent("joe-onboarding", {
			detail: { step: e },
			bubbles: !0,
			composed: !0
		}));
	}
};
d([b({ attribute: !1 })], cu.prototype, "hass", void 0), d([b({ attribute: !1 })], cu.prototype, "t", void 0), d([b({ attribute: !1 })], cu.prototype, "config", void 0), d([b({ attribute: !1 })], cu.prototype, "discovery", void 0), d([b()], cu.prototype, "single", void 0), d([T()], cu.prototype, "index", void 0), u("joe-questions", cu);
//#endregion
//#region src/pages/onboarding.ts
var lu = {
	climate: "q.heating.climate",
	heat_pump: "q.heating.heat_pump",
	electric_heating: "q.heating.electric",
	none: "q.heating.none"
}, uu = class extends O {
	constructor(...e) {
		super(...e), this.step = "welcome", this.checks = [], this.prefix = A, this.discovering = !1, this.discoveryFailed = !1;
	}
	static {
		this.styles = [k, w`
      :host {
        display: block;
      }
      .wrap {
        display: grid;
        grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
        gap: 32px;
        align-items: center;
        max-width: 1000px;
        margin: 0 auto;
        padding-block: 20px 32px;
      }
      joe-pose {
        width: 100%;
        max-width: 440px;
        justify-self: center;
      }
      .display {
        font-size: clamp(38px, 5.4vw, 60px);
      }
      details {
        margin-top: 14px;
        color: var(--joe-ink-2);
        max-width: 58ch;
      }
      summary {
        cursor: pointer;
        font-weight: 600;
        color: var(--joe-ink);
      }
      @media (pointer: coarse) {
        summary {
          padding: 11px 0;
        }
      }
      details p {
        margin: 8px 0 0;
        line-height: 1.5;
      }
      .found {
        margin-top: 18px;
        max-width: 58ch;
      }
      .found p {
        margin: 0 0 8px;
        font-weight: 600;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .step-nav {
        max-width: 1000px;
      }
      .step-nav.wide {
        max-width: 1120px;
      }
      .wrap.wide {
        grid-template-columns: minmax(0, 0.55fr) minmax(0, 1.45fr);
        align-items: start;
        max-width: 1120px;
      }
      .wrap.wide joe-pose {
        position: sticky;
        top: 96px;
      }
      joe-review {
        margin-top: 18px;
      }
      .looking {
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 800;
        text-transform: uppercase;
        font-size: 28px;
        color: var(--joe-muted);
        margin-top: 18px;
      }
      .failed {
        margin-top: 16px;
        color: var(--joe-crit);
        font-weight: 600;
      }
      .lines {
        display: grid;
        margin-top: 18px;
        max-width: 520px;
        border-radius: 12px;
        background: var(--joe-surface);
        box-shadow: inset 0 0 0 1px var(--joe-line);
        padding: 4px 16px;
      }
      .lines .line {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr);
        gap: 2px 16px;
        padding: 10px 0;
        border-top: 1px solid var(--joe-line);
      }
      .lines .line:first-child {
        border-top: 0;
      }
      .lines .label {
        color: var(--joe-ink-2);
      }
      .lines .value {
        font-weight: 600;
        text-align: right;
        overflow-wrap: anywhere;
      }
      .lines .home {
        grid-column: 1 / -1;
        font-size: 13px;
        color: var(--joe-muted);
      }
      .lines .home a {
        color: var(--joe-amber-text);
        font-weight: 600;
        text-decoration: underline;
        text-underline-offset: 2px;
      }
      .homes-hint {
        margin: 14px 0 0;
        max-width: 520px;
        color: var(--joe-ink-2);
        font-size: 14px;
      }
      @media (max-width: 760px) {
        .wrap,
        .wrap.wide {
          grid-template-columns: 1fr;
          gap: 16px;
          padding-block: 4px 24px;
        }
        joe-pose {
          max-width: 300px;
        }
        .wrap.wide joe-pose {
          position: static;
          max-width: 200px;
        }
      }
    `];
	}
	render() {
		let e = this.t;
		if (!e) return j;
		switch (this.step) {
			case "welcome": return this.layout("welcome", D`${y(e("onb.welcome.title"), "h1")} ${M}
            <p class="lead">${e("onb.welcome.lead")}</p>
            <div class="calm"><span class="pill-sim">${e("mode.simulation")}</span>${e("onb.calm")}</div>
            <details data-notip>
              <summary>${e("onb.welcome.more")}</summary>
              ${e("onb.welcome.more.text").split("\n").map((e) => D`<p>${e}</p>`)}
            </details>
            <div class="actions" data-tipped>
              <button type="button" class="btn btn-primary" @click=${() => this.go("scan")}>
                ${e("onb.welcome.go")}
              </button>
              ${l(e, "scan_start")}
            </div>`);
			case "scan": return this.renderScan(e);
			case "questions": return D`<joe-questions
          .hass=${this.hass}
          .t=${e}
          .config=${this.config}
          .discovery=${this.discovery}
        ></joe-questions>`;
			case "done": return this.renderDone(e);
		}
	}
	renderScan(e) {
		if (this.discovering || !this.discovery && !this.discoveryFailed) return this.layout("scout", D`${y(e("onb.scan.title"))} ${M}
          <p class="lead">${e("onb.scan.lead")}</p>
          ${this.renderEnergy(e)}
          <div class="looking" role="status">${e("scan.looking")}</div>`);
		let t = iu(e, {
			back: () => this.go("welcome"),
			next: () => this.go("questions"),
			nextLabel: e("onb.next")
		}, !0);
		return D`${t}
      <div class="wrap wide">
        <joe-pose name="scout"></joe-pose>
        <div>
          ${y(e("scan.title"))} ${M}
          <p class="lead">${e("scan.lead")}</p>
          ${this.discoveryFailed ? D`<p class="failed">${e("scan.failed")}</p>` : j}
          <joe-review
            .hass=${this.hass}
            .t=${e}
            .config=${this.config}
            .discovery=${this.discovery}
            .checks=${this.checks}
          ></joe-review>
          <div class="actions">
            <button type="button" class="btn btn-primary" data-notip @click=${() => this.go("questions")}>
              ${e("onb.next")}
            </button>
            <span class="with-tip" data-tipped>
              <button type="button" class="btn btn-secondary" @click=${this.rediscover}>${e("scan.again")}</button>
              ${l(e, "rescan")}
            </span>
            <button type="button" class="btn btn-ghost" data-notip @click=${() => this.go("welcome")}>
              ${e("onb.back")}
            </button>
          </div>
        </div>
      </div>`;
	}
	renderDone(e) {
		let t = iu(e, {
			back: () => this.go("scan"),
			backLabel: e("onb.done.change"),
			next: () => this.complete(),
			nextLabel: e("onb.done.go"),
			nextTip: "start"
		});
		return D`${t}
    ${this.layout("thumbs", D`${y(e("onb.done.title"))} ${M}
        ${this.config ? this.renderSummary(e, this.config) : j}
        <div class="calm"><span class="pill-sim">${e("mode.simulation")}</span>${e("onb.done.lead")}</div>
        <div class="actions">
          <span class="with-tip" data-tipped>
            <button type="button" class="btn btn-primary" @click=${() => this.complete()}>${e("onb.done.go")}</button>
            ${l(e, "start")}
          </span>
          <button type="button" class="btn btn-ghost" data-notip @click=${() => this.go("scan")}>
            ${e("onb.done.change")}
          </button>
        </div>`)}`;
	}
	renderSummary(e, t) {
		let n = this.hass, r = t.batteries.reduce((e, t) => e + (t.capacity_kwh ?? (n ? f(n, t.capacity_entity) : null) ?? 0), 0), i = Ro(t), a = (e) => i.includes(e) && zo(t, e), o = (n, r) => {
			if (a(n)) return e("sum.later");
			let i = t.answers[n];
			if (i === "unknown") return e("sum.unknown");
			let o = Array.isArray(i) ? i : typeof i == "string" ? [i] : [];
			return o.length ? o.map((t) => e.optional(r[t] ?? "") ?? t).join(", ") : e("sum.open");
		}, s = (r) => {
			let i = t.context[r];
			return i ? n ? _(n, i) : i : e("sum.none");
		}, c = this.discovery?.forecast, l = [
			[
				e("sum.batteries"),
				t.batteries.length ? e("sum.batteries.value", {
					count: t.batteries.length,
					kwh: r ? v(e.lang, r, 1) : "?"
				}) : e("sum.none"),
				Lo(e, "battery")
			],
			[
				e("sum.tariff"),
				a("tariff") ? e("sum.later") : t.tariff.kind === "unknown" ? e("sum.unknown") : Ge(e, t.tariff, !1),
				Fo(e, "tariff")
			],
			[
				e("sum.feed_in"),
				t.tariff.feed_in_price == null ? t.tariff.feed_in_entity ? e("sum.from_sensor") : a("feed_in") ? e("sum.later") : e("sum.unknown") : `${We(e, t.tariff.feed_in_price)} ct`,
				Fo(e, "feed_in")
			],
			[
				e("sum.forecast"),
				t.forecast.provider ? c ? e("sum.forecast.value", {
					provider: c.provider_name,
					planes: Z(e, c.planes, "word.plane")
				}) : t.forecast.provider : e("sum.none"),
				Lo(e, "grid")
			],
			[
				e("sum.heating"),
				o("heating", lu),
				Fo(e, "heating")
			],
			[
				e("sum.climate"),
				o("climate", {
					yes: "sum.yes",
					no: "sum.no"
				}),
				Fo(e, "climate")
			],
			[
				e("sum.hot_water"),
				o("hot_water", {
					hot_water_heat_pump: "q.hot_water.heat_pump",
					electric: "q.hot_water.electric",
					heating: "q.hot_water.heating",
					other: "q.hot_water.other"
				}),
				Fo(e, "hot_water")
			],
			[
				e("sum.ev"),
				o("ev", {
					yes: "q.ev.yes",
					no: "q.ev.no"
				}),
				Fo(e, "ev")
			],
			[
				e("sum.home_office"),
				o("home_office", {
					yes: "sum.home_office.yes",
					no: "sum.home_office.no"
				}),
				Fo(e, "home_office")
			],
			[
				e("sum.household"),
				a("household") ? e("sum.later") : e("sum.household.value", {
					persons: Z(e, t.persons.length, "word.person"),
					calendars: Z(e, t.persons.reduce((e, t) => e + t.calendars.length, 0), "word.calendar")
				}),
				Fo(e, "household")
			],
			[
				e("sum.weather"),
				s("weather_entity"),
				Lo(e, "weather")
			],
			[
				e("sum.holiday"),
				s("holiday_entity"),
				Lo(e, "holiday")
			]
		];
		return D`<p class="homes-hint">${e("onb.done.homes")}</p>
      <div class="lines">
        ${l.map(([t, n, r]) => D`<div class="line">
            <span class="label">${t}</span><span class="value">${n}</span>
            <span class="home">${e("sum.lives_at")} ${this.homeLink(r)}</span>
          </div>`)}
      </div>`;
	}
	homeLink(e) {
		return D`<a
      href=${E(this.prefix, e.to)}
      @click=${(t) => {
			t.metaKey || t.ctrlKey || t.shiftKey || t.altKey || t.button !== 0 || (t.preventDefault(), this.complete(e.to));
		}}
      >${e.place}</a
    >`;
	}
	rediscover() {
		this.dispatchEvent(new CustomEvent("joe-rediscover", {
			bubbles: !0,
			composed: !0
		}));
	}
	layout(e, t) {
		return D`<div class="wrap">
      <joe-pose name=${e}></joe-pose>
      <div>${t}</div>
    </div>`;
	}
	renderEnergy(e) {
		let t = this.info?.energy;
		if (!t?.configured || !t.sources) return D`<div class="found"><p>${e("onb.scan.energy.none")}</p></div>`;
		let n = [
			Z(e, t.sources.grid ?? 0, "word.grid"),
			Z(e, t.sources.solar ?? 0, "word.solar"),
			Z(e, t.sources.battery ?? 0, "word.battery"),
			Z(e, t.devices ?? 0, "word.device")
		];
		return D`<div class="found">
      <p>${e("onb.scan.energy")}</p>
      <div class="chips">
        ${n.map((e) => D`<span class="chip read"><ha-icon icon="mdi:eye-outline"></ha-icon>${e}</span>`)}
      </div>
    </div>`;
	}
	go(e) {
		this.dispatchEvent(new CustomEvent("joe-onboarding", {
			detail: { step: e },
			bubbles: !0,
			composed: !0
		}));
	}
	complete(e) {
		this.dispatchEvent(new CustomEvent("joe-onboarding", {
			detail: {
				step: "done",
				completed: !0,
				to: e ? ue(e) : void 0
			},
			bubbles: !0,
			composed: !0
		}));
	}
};
d([b()], uu.prototype, "step", void 0), d([b({ attribute: !1 })], uu.prototype, "t", void 0), d([b({ attribute: !1 })], uu.prototype, "info", void 0), d([b({ attribute: !1 })], uu.prototype, "hass", void 0), d([b({ attribute: !1 })], uu.prototype, "config", void 0), d([b({ attribute: !1 })], uu.prototype, "discovery", void 0), d([b({ attribute: !1 })], uu.prototype, "checks", void 0), d([b({ attribute: !1 })], uu.prototype, "prefix", void 0), d([b({ type: Boolean })], uu.prototype, "discovering", void 0), d([b({ type: Boolean })], uu.prototype, "discoveryFailed", void 0), u("joe-onboarding", uu);
//#endregion
//#region src/pages/overview/climate-list.ts
function du(e) {
	let t = e?.config.climate;
	return t?.enabled ? Object.entries(t.rooms ?? {}).filter(([, e]) => e.enabled).map(([e]) => e) : [];
}
var fu = {
	tab: "devices",
	section: "climate"
}, pu = class extends O {
	constructor(...e) {
		super(...e), this.prefix = A;
	}
	static {
		this.styles = [k, w`
      :host {
        display: block;
      }
      .card {
        padding: 18px 20px;
      }
      .head {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .head .eyebrow {
        flex: 1;
        min-width: 0;
      }
      a.all {
        min-height: 44px;
        text-decoration: none;
      }
      .rooms {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
        gap: 8px;
        margin-top: 10px;
      }
      a.room {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: center;
        gap: 2px 10px;
        min-height: 44px;
        padding: 10px 12px;
        border-radius: 12px;
        background: var(--joe-surface-2);
        color: inherit;
        text-decoration: none;
        transition: background 0.12s;
      }
      a.room:hover {
        background: var(--joe-line);
      }
      .room-text {
        display: grid;
        gap: 2px;
        min-width: 0;
      }
      .room-name {
        font-weight: 700;
        overflow-wrap: anywhere;
      }
      .room-name small {
        font-weight: 500;
        color: var(--joe-muted);
        margin-left: 6px;
      }
      .room-temp {
        font-variant-numeric: tabular-nums;
        color: var(--joe-ink);
      }
      .room-why {
        font-size: 13.5px;
        color: var(--joe-ink-2);
      }
      .room .go {
        color: var(--joe-muted);
      }
    `];
	}
	render() {
		let { t: e, hass: t, state: n } = this, r = du(n);
		if (!e || !n || !r.length) return j;
		let i = n.config, a = i.climate?.away_after_min ?? 15, o = r.map((r) => {
			let o = this.climateFound?.devices.find((e) => e.entity_id === r), s = i.climate?.rooms[r], c = n.climate?.rooms[r];
			return {
				entity: r,
				name: o?.name ?? (t ? _(t, r) : r),
				area: o?.area ?? at(t, o?.device_id, r) ?? "",
				temps: rc(e, nc(t, o, r)),
				profile: o ? ic(e, o, c, s?.device_profiles ?? {}) : void 0,
				why: ac(e, c, a)
			};
		});
		o.sort((t, n) => t.area.localeCompare(n.area, e.lang) || t.name.localeCompare(n.name, e.lang));
		let s = !!n.climate?.live;
		return D`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:thermostat"></ha-icon>${e("overview.climate")}</div>
        ${s ? j : D`<span class="chip">${e("overview.climate.would")}</span>`}
        ${l(e, "overview_climate")}
        <a class="mini-btn quiet all" href=${E(this.prefix, fu)} @click=${C(fu)}>${e("overview.climate.all")}</a>
      </div>
      <div class="rooms">
        ${o.map((e) => {
			let t = R({
				group: "climate",
				id: e.entity
			}), n = [e.profile, e.why].filter(Boolean).join(" · ");
			return D`<a class="room" href=${E(this.prefix, t)} @click=${C(t)}>
            <span class="room-text">
              <span class="room-name">${e.area || e.name}${e.area ? D`<small>${e.name}</small>` : j}</span>
              ${e.temps ? D`<span class="room-temp">${e.temps}</span>` : j}
              ${n ? D`<span class="room-why">${n}</span>` : j}
            </span>
            <ha-icon class="go" icon="mdi:chevron-right"></ha-icon>
          </a>`;
		})}
      </div>
    </section>`;
	}
};
d([b({ attribute: !1 })], pu.prototype, "hass", void 0), d([b({ attribute: !1 })], pu.prototype, "t", void 0), d([b({ attribute: !1 })], pu.prototype, "state", void 0), d([b({ attribute: !1 })], pu.prototype, "prefix", void 0), d([b({ attribute: !1 })], pu.prototype, "climateFound", void 0), u("joe-overview-climate", pu);
//#endregion
//#region src/pages/overview/quick.ts
function mu(e) {
	return e.config.cars ?? [];
}
function hu(e) {
	let { guest_switch: t, guest_tracker: n } = e.config.context;
	return t && n ? t : void 0;
}
function gu(e) {
	return !!(e && (mu(e).length || hu(e)));
}
var _u = class extends O {
	constructor(...e) {
		super(...e), this.prefix = A;
	}
	static {
		this.styles = [k, w`
      :host {
        display: block;
        height: 100%;
      }
      .card {
        height: 100%;
        padding: 18px 20px;
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
      .item {
        margin-top: 12px;
        padding-top: 10px;
        border-top: 1px solid var(--joe-line);
      }
      .head + .item {
        margin-top: 6px;
        border-top: 0;
        padding-top: 0;
      }
      a.name {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-height: 44px;
        font-weight: 700;
        color: inherit;
        text-decoration: none;
      }
      a.name:hover {
        text-decoration: underline;
        text-decoration-color: var(--joe-amber);
        text-underline-offset: 3px;
      }
      a.name ha-icon {
        color: var(--joe-ink-2);
      }
      .guest {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px 10px;
      }
      .guest b {
        font-weight: 700;
      }
      .guest small {
        flex-basis: 100%;
        color: var(--joe-muted);
        font-size: 13px;
      }
    `];
	}
	render() {
		let { t: e, hass: t, state: n } = this;
		if (!e || !t || !n || !gu(n)) return j;
		let r = hu(n), i = r ? t.states[r]?.state === "on" : !1, a = n.config.context.guest_tracker;
		return D`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:lightning-bolt-outline"></ha-icon>${e("overview.quick")}</div>
        ${l(e, "quick")}
      </div>
      ${mu(n).map((r) => {
			let i = _e(r.id);
			return D`<div class="item">
          <a class="name" href=${E(this.prefix, i)} @click=${C(i)}>
            <ha-icon icon="mdi:car-electric"></ha-icon>${r.name}
          </a>
          <joe-car-charge flush .hass=${t} .t=${e} .state=${n} .car=${r}></joe-car-charge>
        </div>`;
		})}
      ${r ? D`<div class="item guest" data-tipped>
            <button
              type="button"
              class="switch"
              role="switch"
              aria-checked=${String(i)}
              aria-labelledby="quick-guest"
              @click=${() => yl(t, r)}
            ></button>
            <b id="quick-guest">${e("household.guest")}</b>
            ${l(e, "household_guest")}
            <small>${e(a && t.states[a]?.state === "home" ? "household.guest.home" : "household.guest.away")}</small>
          </div>` : j}
    </section>`;
	}
};
d([b({ attribute: !1 })], _u.prototype, "hass", void 0), d([b({ attribute: !1 })], _u.prototype, "t", void 0), d([b({ attribute: !1 })], _u.prototype, "state", void 0), d([b({ attribute: !1 })], _u.prototype, "prefix", void 0), u("joe-overview-quick", _u);
//#endregion
//#region src/pages/overview.ts
var vu = { tab: "plan" }, yu = {
	tab: "review",
	section: "days"
}, bu = {
	tab: "review",
	section: "result"
}, xu = {
	tab: "household",
	section: "presence"
}, Su = class extends O {
	constructor(...e) {
		super(...e), this.prefix = A, this.checks = [], this.devices = [];
	}
	static {
		this.styles = [k, w`
      :host {
        display: block;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
        max-width: 1180px;
        margin: 0 auto;
      }
      .card {
        padding: 22px 22px 24px;
        overflow: hidden;
        container-type: inline-size;
      }
      .card .display {
        font-size: clamp(30px, 3.6vw, 40px);
        margin-top: 12px;
        max-width: 60%;
      }
      .card .lead {
        font-size: 15px;
        max-width: 44ch;
      }
      .card > joe-pose {
        position: absolute;
        /* Inside the card's padding: never cut off at the edge. */
        right: 18px;
        top: 16px;
        /* Bigger in a wide card, smaller where the card is narrow. */
        width: clamp(120px, 30cqw, 240px);
        pointer-events: none;
      }
      /* The heading row keeps clear of the bigger picture. */
      .card:has(> joe-pose) > .head {
        padding-right: clamp(126px, calc(30cqw + 8px), 248px);
      }
      .figure-card .head .eyebrow {
        flex: 0 1 auto;
        min-width: 0;
      }
      .figure-card .when {
        margin: 4px 0 0;
        max-width: 60%;
        font-size: 13.5px;
        color: var(--joe-ink-2);
        font-variant-numeric: tabular-nums;
      }
      .figure-card .big {
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 800;
        font-size: clamp(44px, 6vw, 64px);
        line-height: 1;
        margin-top: 12px;
        max-width: 62%;
        font-variant-numeric: tabular-nums;
      }
      .figure-card .big small {
        font-size: 0.5em;
        margin-left: 2px;
      }
      .figure-card .say {
        margin: 10px 0 0;
        font-size: 15px;
        line-height: 1.5;
        color: var(--joe-ink-2);
        max-width: 60ch;
      }
      .figure-card .lines {
        display: grid;
        gap: 2px;
        margin-top: 10px;
        font-size: 14px;
        font-variant-numeric: tabular-nums;
      }
      .figure-card .cost {
        margin: 8px 0 0;
        font-size: 14px;
        font-weight: 600;
      }
      .wide {
        grid-column: 1 / -1;
      }
      .head {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .head .eyebrow {
        flex: 1;
      }
      /* A card that leads somewhere as a whole: its link stretches over it; tips, buttons and the chart stay on top. */
      a.stretch::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 14px;
      }
      .card:has(a.stretch) joe-tip,
      .card:has(a.stretch) joe-steer-tonight,
      .card:has(a.stretch) joe-chart {
        position: relative;
        z-index: 1;
      }
      .card:has(a.stretch:hover) {
        box-shadow: inset 0 0 0 1.5px var(--joe-line-2);
      }
      .now {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 10px;
        margin-top: 14px;
      }
      .flow {
        display: grid;
        grid-template-columns: auto 1fr;
        align-items: center;
        gap: 2px 12px;
        padding: 12px 14px;
        border-radius: 12px;
        background: var(--joe-surface-2);
      }
      .flow .icon {
        grid-row: span 3;
        width: 42px;
        height: 42px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        color: #071118;
      }
      .flow .icon ha-icon {
        --mdc-icon-size: 22px;
      }
      .flow.sun .icon {
        background: var(--joe-amber);
      }
      .flow.home .icon {
        background: var(--joe-ink);
        color: var(--joe-surface);
      }
      .flow.battery .icon {
        background: var(--joe-c-soc);
      }
      .flow.net .icon {
        background: var(--joe-c-grid);
        color: #ffffff;
      }
      .flow small {
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--joe-muted);
      }
      .flow b {
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 800;
        font-size: 30px;
        line-height: 1.05;
        font-variant-numeric: tabular-nums;
      }
      .flow b span {
        font-size: 16px;
        margin-left: 2px;
      }
      .flow em {
        font-style: normal;
        font-size: 13px;
        color: var(--joe-ink-2);
      }
      /* "Joe tut gerade …" below the tiles. */
      .doing {
        margin-top: 16px;
        padding-top: 14px;
        border-top: 1px solid var(--joe-line);
      }
      .doing-text {
        margin: 6px 0 0;
        font-size: 16px;
        font-weight: 600;
      }
      .doing ul {
        margin: 6px 0 0;
        padding-left: 20px;
        color: var(--joe-ink-2);
        font-size: 14.5px;
        line-height: 1.5;
      }
      .status {
        margin: 6px 0 0;
        color: var(--joe-ink-2);
        font-size: 14px;
      }
      joe-chart {
        margin-top: 10px;
      }
      joe-steer-tonight {
        margin-top: 14px;
        padding-top: 12px;
        border-top: 1px solid var(--joe-line);
      }
      .legend {
        display: flex;
        flex-wrap: wrap;
        gap: 6px 14px;
        font-size: 12.5px;
        color: var(--joe-ink-2);
      }
      .legend span {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .legend i {
        width: 12px;
        height: 12px;
        border-radius: 3px;
      }
      .bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        flex-wrap: wrap;
        margin-top: 8px;
      }
      /* One line that leads to its home ("Wer ist da", "Was es gebracht hätte"). */
      a.line {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        gap: 4px 14px;
        padding: 14px 16px 14px 18px;
        min-height: 44px;
        color: inherit;
        text-decoration: none;
        transition: box-shadow 0.12s, background 0.12s;
      }
      a.line:hover {
        box-shadow: inset 0 0 0 1.5px var(--joe-line-2);
      }
      a.line > ha-icon {
        --mdc-icon-size: 22px;
        color: var(--joe-ink-2);
      }
      a.line .go {
        --mdc-icon-size: 20px;
        color: var(--joe-muted);
      }
      .line-text {
        display: grid;
        gap: 3px;
        min-width: 0;
      }
      .line-text b {
        font-weight: 600;
        line-height: 1.4;
        overflow-wrap: anywhere;
      }
      .line-text b.good {
        color: var(--joe-good);
      }
      .line-text b.bad {
        color: var(--joe-crit);
      }
      .line-text small {
        font-size: 13px;
        color: var(--joe-ink-2);
      }
      @media (max-width: 900px) {
        .grid {
          grid-template-columns: 1fr;
        }
        .now {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (max-width: 480px) {
        .card > joe-pose {
          right: 12px;
          top: 12px;
          width: 128px;
        }
        .card:has(> joe-pose) > .head {
          padding-right: 136px;
        }
        .card .display {
          max-width: 64%;
        }
        .flow {
          padding: 10px;
          gap: 2px 8px;
        }
        .flow .icon {
          width: 34px;
          height: 34px;
        }
        .flow b {
          font-size: 24px;
        }
        a.line {
          padding-inline: 14px 10px;
          gap: 4px 10px;
        }
      }
    `];
	}
	connectedCallback() {
		super.connectedCallback(), this.loadWeek();
	}
	willUpdate(e) {
		let t = this.state?.observe, n = `${t?.last_hour ?? ""}|${t?.backfill.state ?? ""}|${t?.day_count ?? 0}`;
		e.has("state") && this.marker !== void 0 && n !== this.marker && this.loadWeek(), this.marker = n;
	}
	async loadWeek() {
		try {
			let e = await this.hass?.callWS({
				type: "energy_joe/history/days",
				days: 7
			});
			this.week = e?.days;
		} catch {
			this.week = [];
		}
	}
	render() {
		let e = this.t, t = this.state;
		if (!e || !t) return j;
		let n = qo(e, t, {
			hass: this.hass,
			climateFound: this.climateFound,
			discovery: this.discovery,
			checks: this.checks,
			devices: this.devices,
			profiles: this.info?.profiles
		}), r = bo(t), i = r || n.length > 0 || (t.questions?.length ?? 0) > 0, a = n.some((e) => e.id.startsWith("test:")), o = gu(t), s = du(t).length > 0, c = this.renderWho(e, t), l = (e) => e ? "" : "wide";
		return D`<div class="grid">
      ${this.renderNow(e, t)}
      ${i ? D`<joe-overview-inbox
            class="wide"
            .t=${e}
            .hass=${this.hass}
            .state=${t}
            .prefix=${this.prefix}
            .items=${n}
            .steer=${r}
          ></joe-overview-inbox>` : j}
      ${this.renderNight(e, t, l(o), !r, a)}
      ${o ? D`<joe-overview-quick .t=${e} .hass=${this.hass} .state=${t} .prefix=${this.prefix}></joe-overview-quick>` : j}
      ${s ? D`<joe-overview-climate
            class="wide"
            .t=${e}
            .hass=${this.hass}
            .state=${t}
            .prefix=${this.prefix}
            .climateFound=${this.climateFound}
          ></joe-overview-climate>` : j}
      ${c ? this.line(xu, "mdi:home-account", e("overview.who"), c, "", "") : j}
      ${this.renderResult(e, t, l(!!c))} ${this.renderWeek(e)}
    </div>`;
	}
	renderNow(e, t) {
		let n = this.hass, r = t.config;
		if (!n) return D``;
		let i = r.measurements, a = i.solar_power.length ? s(n, i.solar_power) : null, o = re(n, i.grid_power), c = r.batteries.map((e) => ({
			power: re(n, e.power),
			soc: ie(n, e.soc_entity)
		})), u = c.filter((e) => e.power != null), d = u.length ? u.reduce((e, t) => e + (t.power ?? 0), 0) : null, f = re(n, i.home_power), p = f == null && o != null;
		p && (f = (o ?? 0) + (a ?? 0) - (d ?? 0));
		let m = c.map((e) => e.soc).filter((e) => e != null), h = (t) => t == null ? "–" : v(e.lang, Math.abs(t), 2), g = (e, t, n, r, i) => D`<div class="flow ${e}">
        <span class="icon"><ha-icon icon=${t}></ha-icon></span>
        <small>${n}</small>
        <b>${h(r)}<span>kW</span></b>
        <em>${i}</em>
      </div>`, ee = (e) => e == null || Math.abs(e) < .05;
		return D`<section class="card wide" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:pulse"></ha-icon>${e("overview.now")}</div>
        ${l(e, "now")}
      </div>
      <div class="now">
        ${g("sun", "mdi:solar-power", e("overview.now.solar"), a, e(a == null ? "overview.now.none" : "overview.now.solar.sub"))}
        ${g("home", "mdi:home-lightning-bolt-outline", e("overview.now.home"), f, e(f == null ? "overview.now.none" : p ? "overview.now.home.calc" : "overview.now.home.sub"))}
        ${g("battery", "mdi:home-battery-outline", ee(d) ? e("overview.now.battery") : e(d > 0 ? "overview.now.battery.charge" : "overview.now.battery.discharge"), d, m.length ? m.length === 1 ? e("overview.now.soc", { value: v(e.lang, m[0], 0) }) : e("overview.now.soc_avg", {
			value: v(e.lang, m.reduce((e, t) => e + t, 0) / m.length, 0),
			count: m.length
		}) : r.batteries.length ? e("overview.now.none") : e("overview.now.no_battery"))}
        ${g("net", "mdi:transmission-tower", ee(o) ? e("overview.now.grid") : e(o > 0 ? "overview.now.grid.in" : "overview.now.grid.out"), o, o == null ? e("overview.now.none") : ee(o) ? e("overview.now.grid.idle") : e(o > 0 ? "overview.now.grid.in.sub" : "overview.now.grid.out.sub"))}
      </div>
      ${this.renderDoing(e, t)}
    </section>`;
	}
	renderDoing(e, t) {
		let n = t.control, r = this.doingLines(e, t);
		return !n && !r.length ? j : D`<div class="doing">
      <div class="eyebrow"><ha-icon icon="mdi:robot-outline"></ha-icon>${e("overview.doing")}</div>
      ${n ? D`<p class="doing-text">${Ea(e, t)}</p>` : j}
      ${r.length ? D`<ul>${r.map((e) => D`<li>${e}</li>`)}</ul>` : j}
      <joe-control-status compact .t=${e} .hass=${this.hass} .state=${t}></joe-control-status>
    </div>`;
	}
	doingLines(e, t) {
		let n = t.control, r = t.config, i = [];
		if (n?.steering) for (let t of r.batteries) {
			let r = n.batteries[t.id]?.action;
			t.adapter !== "none" && r && [
				"charge",
				"hold",
				"block",
				"defer",
				"buffer"
			].includes(r) && i.push(e("overview.doing.battery", {
				name: t.name,
				what: rs(e, t, n)
			}));
		}
		let a = Sa(e, ga(t));
		a && i.push(a);
		let o = Mi(e, pi(t));
		o && i.push(o);
		for (let t of r.actions) {
			let r = n?.actions?.[t.id];
			r?.on && i.push(e("overview.doing.action", {
				name: t.name,
				time: N(r.end)
			}));
		}
		let s = t.climate;
		if (s?.live) {
			let n = du(t).map((e) => ({
				entity: e,
				now: s.rooms[e]
			})).filter((e) => e.now && !e.now.would), r = (e) => this.climateFound?.devices.find((t) => t.entity_id === e)?.area ?? this.devices.find((t) => t.group === "climate" && t.id === e)?.name ?? e;
			for (let t of ["away", "night"]) {
				let a = n.filter((e) => e.now?.why === t);
				a.length === 1 ? i.push(e(`overview.doing.${t}_one`, { name: r(a[0].entity) })) : a.length > 1 && i.push(e(`overview.doing.${t}`, { count: a.length }));
			}
		}
		return i;
	}
	renderNight(e, t, n, r, i) {
		let a = t.plan;
		if (!a) return D`<section class="card ${n}">
        <joe-pose name="relax"></joe-pose>
        <div class="eyebrow"><ha-icon icon="mdi:weather-night"></ha-icon>${e("overview.night")}</div>
        ${y(e("overview.night.empty.title"))} ${M}
        <p class="lead">${e("overview.night.empty.text")}</p>
      </section>`;
		let o = se(e, a), s = pe(e, a, this.hass?.config?.currency), c = a.kind === "charge" || a.kind === "hold" ? D`${v(e.lang, a.target ?? 0, 0)}<small>%</small>` : D`${e(a.kind === "none" ? "plan.big.none" : "plan.big.unavailable")}`;
		return D`<section class="card figure-card ${n}" data-tipped>
      <joe-pose name=${Oe(a)}></joe-pose>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:weather-night"></ha-icon>${e("overview.night")}</div>
        ${l(e, "plan_target")}
      </div>
      ${a.window ? D`<p class="when">${te(e, a)}</p>` : j}
      <div class="big">${c}</div>
      ${M}
      <p class="say">${Ae(e, a)}</p>
      ${o.length ? D`<div class="lines">${o.map((e) => D`<div>${e}</div>`)}</div>` : j}
      ${s ? D`<p class="cost">${s}</p>` : j}
      ${r && yo(t) ? D`<joe-steer-tonight
            compact
            .hideUntested=${i}
            .t=${e}
            .hass=${this.hass}
            .state=${t}
            .prefix=${this.prefix}
          ></joe-steer-tonight>` : j}
      <div class="bottom">
        <span class="chip ${a.fixed ? "ok" : ""}">
          ${a.fixed ? e("plan.fixed_at", { time: a.created.slice(11, 16) }) : e("plan.preview_at", { time: a.created.slice(11, 16) })}
        </span>
        <a class="btn btn-secondary stretch" href=${E(this.prefix, vu)} @click=${C(vu)}>${e("overview.night.more")}</a>
      </div>
    </section>`;
	}
	renderWho(e, t) {
		let n = t.climate;
		if (!n || !t.config.persons.length && !n.home.length) return;
		let r = Object.fromEntries(t.config.persons.map((e) => [e.person_entity, e.name])), i = t.config.context.guest_tracker, a = i ? this.hass?.states[i] : void 0, o = a?.state === "home", s = o ? String(a?.attributes.friendly_name ?? i.split(".")[1].replace(/_/g, " ")) : void 0, c = n.home.filter((e) => e !== s), l = c.length ? [e("overview.who.home", { names: c.join(", ") })] : o ? [] : [e("overview.who.nobody")];
		for (let [t, i] of Object.entries(n.arrivals ?? {})) if (i.direction === "towards") {
			let n = r[t] ?? String(this.hass?.states[t]?.attributes.friendly_name ?? t);
			l.push(i.minutes == null ? e("overview.who.coming_soon", { name: n }) : e("overview.who.coming", {
				name: n,
				minutes: i.minutes
			}));
		}
		o && l.push(e("overview.who.guest"));
		let u = n.day;
		return u && l.push(u.holiday ? e("overview.who.day.holiday") : u.weekend && u.free ? e("overview.who.day.weekend") : u.home_office.length && !u.free ? e("overview.who.day.home_office", { names: u.home_office.join(", ") }) : e("overview.who.day.workday")), l.join(" · ");
	}
	line(e, t, n, r, i, a, o) {
		return D`<a class="card line ${a}" href=${E(this.prefix, e)} @click=${C(e)}>
      <ha-icon icon=${t}></ha-icon>
      <span class="line-text">
        <span class="eyebrow">${n}</span>
        <b class=${i}>${r}</b>
        ${o ? D`<small>${o}</small>` : j}
      </span>
      <ha-icon class="go" icon="mdi:chevron-right"></ha-icon>
    </a>`;
	}
	renderResult(e, t, n) {
		let r = t.results, i = r?.last, a = e("overview.result"), o = this.hass?.config?.currency, s = this.hass?.config?.time_zone, c = (t) => t === kn(s) ? e("overview.result.last") : e("overview.result.night", { day: U(e.lang, t, "weekday") }), l = r?.since ?? r?.first, u = r ? e("overview.result.total", {
			since: l ? U(e.lang, l) : "–",
			value: Dn(e, r.saving, o, !0),
			nights: An(e, r.days)
		}) : "", d = t.control?.last_night, f = d?.night.slice(0, 10), p = i?.window?.end.slice(0, 10) ?? i?.date;
		if (d && f && (!p || f >= p)) {
			let t = e.optional(`overview.left.${d.why}`) ?? e("overview.left.enough"), r = e("overview.result.left", {
				night: c(f),
				why: t
			});
			return this.line(bu, "mdi:calculator-variant-outline", a, r, "", n, u);
		}
		if (!r || !i) return this.line(bu, "mdi:calculator-variant-outline", a, e("overview.result.none"), "", n);
		let m = c(p ?? i.date), h = i.saving, g = h > .005 ? "good" : h < -.005 ? "bad" : "", ee = g === "good" ? e("overview.result.saved", {
			night: m,
			value: Dn(e, h, o)
		}) : g === "bad" ? e("overview.result.cost", {
			night: m,
			value: Dn(e, -h, o)
		}) : e("overview.result.same", { night: m }), _ = !i.final && i.until ? ` · ${e("overview.result.provisional", { time: i.until.slice(11, 16) })}` : "";
		return this.line(bu, "mdi:calculator-variant-outline", a, ee, g, n, `${u}${_}`);
	}
	renderWeek(e) {
		let t = [...this.week ?? []].reverse(), n = this.state?.observe, r = n?.backfill.state === "running" ? e("history.reading") : n?.first_day ? e("overview.week.known", { days: n.day_count ?? 0 }) : e("overview.week.none"), i = [{
			label: e("history.chart.home"),
			kind: "bar",
			values: t.map((e) => e.home),
			color: "var(--joe-c-load)",
			digits: 1
		}, {
			label: e("history.chart.solar"),
			kind: "bar",
			values: t.map((e) => e.solar),
			color: "var(--joe-c-pv)",
			digits: 1
		}], a = t.map((t) => new Intl.DateTimeFormat(e.lang, {
			weekday: "short",
			day: "numeric",
			month: "numeric",
			timeZone: "UTC"
		}).format(/* @__PURE__ */ new Date(`${t.date}T12:00:00Z`))), o = new Map(t.map((t, n) => [n, new Intl.DateTimeFormat(e.lang, {
			weekday: "short",
			timeZone: "UTC"
		}).format(/* @__PURE__ */ new Date(`${t.date}T12:00:00Z`))]));
		return D`<section class="card wide" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:chart-bar"></ha-icon>${e("overview.week")}</div>
        ${l(e, "week")}
      </div>
      <p class="status">${r}</p>
      ${t.length ? D`<joe-chart
            .labels=${a}
            .ticks=${o}
            .series=${i}
            centerTicks
            unit="kWh"
            height="120"
            lang=${e.lang}
            label=${e("overview.week")}
          ></joe-chart>` : j}
      <div class="bottom">
        ${t.length ? D`<div class="legend">
              ${i.map((e) => D`<span><i style="background:${e.color}"></i>${e.label}</span>`)}
            </div>` : D`<span></span>`}
        <a class="btn btn-secondary stretch" href=${E(this.prefix, yu)} @click=${C(yu)}>${e("overview.week.more")}</a>
      </div>
    </section>`;
	}
};
d([b({ attribute: !1 })], Su.prototype, "t", void 0), d([b({ attribute: !1 })], Su.prototype, "hass", void 0), d([b({ attribute: !1 })], Su.prototype, "state", void 0), d([b({ attribute: !1 })], Su.prototype, "prefix", void 0), d([b({ attribute: !1 })], Su.prototype, "route", void 0), d([b({ attribute: !1 })], Su.prototype, "climateFound", void 0), d([b({ attribute: !1 })], Su.prototype, "discovery", void 0), d([b({ attribute: !1 })], Su.prototype, "checks", void 0), d([b({ attribute: !1 })], Su.prototype, "devices", void 0), d([b({ attribute: !1 })], Su.prototype, "info", void 0), d([T()], Su.prototype, "week", void 0), u("joe-overview", Su);
//#endregion
//#region src/pages/plan.ts
var Cu = 36e5, wu = {
	tab: "devices",
	section: "grid",
	id: "solar"
}, Tu = {
	tab: "devices",
	section: "grid",
	id: "tariff"
}, Eu = class extends O {
	constructor(...e) {
		super(...e), this.prefix = A, this.devices = [], this.refreshing = !1;
	}
	static {
		this.styles = [k, w`
      :host {
        display: block;
      }
      .wrap {
        max-width: 1100px;
        margin: 0 auto;
      }
      .top {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        margin-top: 10px;
      }
      .display {
        font-size: clamp(30px, 4vw, 44px);
      }
      .hero {
        position: relative;
        margin-top: 16px;
        padding: 20px 22px;
        border-radius: 16px;
        background: var(--joe-surface);
        box-shadow: inset 0 0 0 1px var(--joe-line);
        overflow: hidden;
      }
      .hero joe-pose {
        position: absolute;
        /* Inside the card's padding: never cut off at the edge. */
        right: 18px;
        top: 16px;
        width: 170px;
        pointer-events: none;
      }
      .big {
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 800;
        font-size: clamp(52px, 7vw, 76px);
        line-height: 1;
        font-variant-numeric: tabular-nums;
        max-width: 60%;
      }
      .big small {
        font-size: 0.5em;
        margin-left: 2px;
      }
      .say {
        margin: 10px 0 0;
        font-size: 16px;
        line-height: 1.5;
        color: var(--joe-ink-2);
        max-width: 60ch;
      }
      .cost {
        margin: 10px 0 0;
        font-weight: 600;
      }
      .chart-card {
        margin-top: 12px;
        padding: 14px 16px 10px;
        border-radius: 14px;
        background: var(--joe-surface);
        box-shadow: inset 0 0 0 1px var(--joe-line);
      }
      .chart-head {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 700;
        margin-bottom: 6px;
      }
      .slots {
        margin: 8px 0 0;
        font-size: 13.5px;
        color: var(--joe-ink-2);
      }
      .legend {
        display: flex;
        flex-wrap: wrap;
        gap: 6px 14px;
        margin-top: 4px;
        font-size: 12.5px;
        color: var(--joe-ink-2);
      }
      .legend span {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .legend i {
        width: 14px;
        height: 4px;
        border-radius: 2px;
      }
      .legend i.dash {
        background: repeating-linear-gradient(90deg, currentColor 0 4px, transparent 4px 7px) !important;
      }
      .tonight {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .tonight li {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        gap: 4px 12px;
        padding: 10px 0;
        border-top: 1px solid var(--joe-line);
      }
      .tonight li:first-child {
        border-top: 0;
      }
      .tonight li > ha-icon {
        --mdc-icon-size: 22px;
        color: var(--joe-ink-2);
        align-self: start;
        margin-top: 1px;
      }
      .tonight .what {
        display: grid;
        gap: 1px;
        min-width: 0;
        overflow-wrap: anywhere;
      }
      .tonight .what span {
        color: var(--joe-ink-2);
      }
      .tonight .what small {
        font-size: 13px;
        color: var(--joe-muted);
      }
      .tonight .more {
        grid-column: 2 / -1;
      }
      .tonight .more .pace {
        font-size: 13px;
        color: var(--joe-ink-2);
      }
      .note {
        margin-top: 10px;
      }
      .empty {
        display: grid;
        grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
        gap: 28px;
        align-items: center;
        max-width: 980px;
        margin: 0 auto;
      }
      .empty joe-pose {
        max-width: 380px;
        width: 100%;
        justify-self: center;
      }
      /* On the phone the button goes below the text, so the text keeps the width. */
      @media (max-width: 480px) {
        .tonight li {
          grid-template-columns: auto minmax(0, 1fr);
        }
        .tonight li > a {
          grid-column: 2;
          justify-self: start;
        }
      }
      @media (max-width: 760px) {
        /* Floats on narrow screens, so the sentence wraps around Joe instead of running under him. */
        .hero joe-pose {
          position: static;
          float: right;
          margin: -8px -10px 4px 8px;
          width: 112px;
        }
        .empty {
          grid-template-columns: 1fr;
        }
        .empty joe-pose {
          max-width: 260px;
        }
      }
    `];
	}
	render() {
		let e = this.t;
		if (!e) return j;
		let t = this.state?.plan;
		if (!t || t.kind === "unavailable" || !t.hours) return this.renderEmpty(e, t);
		let n = pe(e, t, this.hass?.config?.currency);
		return D`<div class="wrap">
      <div class="eyebrow"><ha-icon icon="mdi:weather-night"></ha-icon>${e("overview.night")} · ${te(e, t)}</div>
      ${y(e("plan.page.title"))} ${M}
      <div class="top" data-tipped>
        ${this.state?.mode === "simulation" ? D`<span class="pill-sim">${e("mode.simulation")}</span>` : D`<span class="chip ${this.state?.mode === "live" ? "ok" : "learned"}">${e(`mode.${this.state?.mode ?? "off"}`)}</span>`}
        <span class="chip ${t.fixed ? "ok" : ""}">
          ${t.fixed ? e("plan.fixed_at", { time: t.created.slice(11, 16) }) : e("plan.preview_at", { time: t.created.slice(11, 16) })}
        </span>
        <button type="button" class="mini-btn" ?disabled=${this.refreshing || t.fixed} @click=${this.refresh}>
          <ha-icon icon="mdi:refresh"></ha-icon>${e("plan.refresh")}
        </button>
        ${l(e, "plan_refresh")}
      </div>
      <section class="hero" data-tipped>
        <joe-pose name=${Oe(t)}></joe-pose>
        <div class="big">
          ${t.kind === "none" ? e("plan.big.none") : D`${v(e.lang, t.target ?? 0, 0)}<small>%</small>`}
        </div>
        <p class="say">${Ae(e, t)} ${l(e, "plan_target")}</p>
        ${n ? D`<p class="cost">${n}</p>` : j}
      </section>
      <joe-steer-tonight .t=${e} .hass=${this.hass} .state=${this.state} .prefix=${this.prefix}></joe-steer-tonight>
      ${this.renderDaySurplus(e)} ${this.renderTonight(e, t)} ${this.renderEnergy(e, t, t.hours)}
      ${this.renderPrices(e, t, t.hours)} ${this.renderSoc(e, t, t.hours)}
      ${this.renderMath(e, t)}
    </div>`;
	}
	renderTonight(e, t) {
		let n = t.batteries ?? [], r = t.actions ?? [], i = Object.values(t.cars ?? {}).filter((e) => !r.some((t) => t.car === e.car && t.plugged === "car"));
		return !n.length && !r.length && !i.length ? j : D`<section class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.tonight")} ${l(e, "plan_actions")}</div>
      <ul class="tonight">
        ${n.map((n) => this.batteryRow(e, t, n))} ${r.map((n) => this.actionRow(e, t, n))}
        ${i.map((t) => this.awayRow(e, t))}
      </ul>
    </section>`;
	}
	renderDaySurplus(e) {
		let t = ga(this.state), n = pi(this.state), r = n && n.mode === "sequence";
		if ((!t || t.state === "off") && !r) return j;
		let i = Object.values(t?.batteries ?? {}).filter((e) => e.cap_kw != null), a = i.length > 1 ? i.map((t) => e("plan.day_surplus.battery", {
			name: t.name,
			kw: v(e.lang, t.cap_kw ?? 0, 1)
		})).join(" · ") : "";
		return D`<section class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.day_surplus")} ${l(e, "plan_day_surplus")}</div>
      <ul class="tonight">
        ${t && t.state !== "off" ? this.tonightRow(e, {
			icon: "mdi:solar-power-variant-outline",
			name: e("rule.day_surplus"),
			text: ba(e, t),
			extra: [xa(e, t), a].filter(Boolean).join(" · "),
			to: {
				tab: "settings",
				section: "rules",
				id: "day_surplus"
			}
		}) : j}
        ${r ? this.tonightRow(e, {
			icon: "mdi:battery-sync-outline",
			name: e("team.title"),
			text: Ai(e, n),
			extra: n.parallel ? e("team.parallel") : "",
			to: {
				tab: "devices",
				section: "battery",
				id: "together"
			}
		}) : j}
      </ul>
    </section>`;
	}
	tonightRow(e, t) {
		return D`<li>
      <ha-icon icon=${t.icon}></ha-icon>
      <div class="what">
        <b>${t.name}</b>
        <span>${t.text}</span>
        ${t.extra ? D`<small>${t.extra}</small>` : j}
      </div>
      <a class="mini-btn go mirror-go" href=${E(this.prefix, t.to)} @click=${C(t.to)}>${e("mirror.change")}</a>
      ${t.more ? D`<div class="more">${t.more}</div>` : j}
    </li>`;
	}
	batteryRow(e, t, n) {
		let r = pt(this.devices, "battery", n.id), i = (t) => v(e.lang, t, 0), a = n.slots ?? [], o = N(a[0]?.start ?? t.charge_slots?.[0]?.start ?? t.charge_from), s, c = "", u;
		if (t.kind === "charge" && n.charge_kwh >= .05) {
			s = e(o ? "plan.tonight.charge" : "plan.tonight.charge_any", {
				time: o,
				from: i(n.soc_start),
				target: i(n.target)
			});
			let r = v(e.lang, n.charge_kwh, 1);
			c = a.length ? e("plan.tonight.charge.spans", {
				kwh: r,
				spans: Ou(e, a)
			}) : e("plan.tonight.charge.energy", {
				kwh: r,
				kw: v(e.lang, n.power_kw, 1)
			});
			let d = ku(e, t, n, this.state?.config.batteries.find((e) => e.id === n.id));
			d && (u = D`<span class="pace">${d}</span> ${l(e, "plan_pace")}`);
		} else s = t.kind === "hold" ? e("plan.tonight.hold", { target: i(n.target) }) : e("plan.tonight.idle", { soc: i(n.soc) });
		return n.controllable || (c = [c, e("plan.line.watch_only")].filter(Boolean).join(" · ")), this.tonightRow(e, {
			icon: r?.icon ?? $e.battery,
			name: n.name,
			text: s,
			extra: c,
			more: u,
			to: r ? R(r) : {
				tab: "devices",
				section: "battery"
			}
		});
	}
	actionRow(e, t, n) {
		let r = this.hass?.config?.currency ?? "EUR", i = (t) => new Intl.NumberFormat(e.lang, {
			style: "currency",
			currency: r
		}).format(t), a = n.target == null ? "" : v(e.lang, n.target, 0), o = n.run ? n.kind === "target" ? e("plan.actions.target", {
			start: N(n.start),
			end: N(n.end),
			target: a
		}) : e("plan.actions.run", {
			start: N(n.start),
			end: N(n.end)
		}) : e.optional(`devices.action.why.${n.reasons[n.reasons.length - 1] ?? "manual_only"}`, {
			kwh: v(e.lang, t.meta?.tomorrow_kwh ?? 0, 0),
			temperature: v(e.lang, n.temperature ?? 0, 0)
		}) ?? "", s = n.run && n.energy_kwh ? e("plan.actions.energy", {
			kwh: v(e.lang, n.energy_kwh, 1),
			cost: i(n.cost ?? 0)
		}) : "", c = this.state?.config, l = c?.actions.find((e) => e.id === n.id), u = c && l ? rt(c, l) : void 0, d = u ? pt(this.devices, u.group, u.id) : void 0, f = u?.group ?? (n.need || n.plugged ? "car" : n.kind === "target" ? "hot_water" : "other"), p = n.plugged === "car" && c ? ke(c, n.car) : void 0;
		return this.tonightRow(e, {
			icon: p ? $e.car : d?.icon ?? $e[f],
			name: p ? e("plan.car_at", {
				car: p.name,
				point: n.name
			}) : n.name,
			text: o,
			extra: s,
			to: p ? _e(p.id) : d ? R(d) : u ? R(u) : {
				tab: "devices",
				section: f
			},
			more: n.need ? D`<joe-car-need .hass=${this.hass} .t=${e} .action=${n} .roundTrip=${p?.need.round_trip ?? !0}></joe-car-need>` : void 0
		});
	}
	awayRow(e, t) {
		let n = this.state ? ke(this.state.config, t.car) : void 0, r = {
			id: t.car,
			name: t.name,
			kind: "switch",
			run: !1,
			manual: !1,
			reasons: [],
			start: "",
			end: "",
			power_kw: null,
			energy_kwh: 0,
			priority: 1,
			need: t
		}, i = t.missing_kwh ?? 0;
		return this.tonightRow(e, {
			icon: $e.car,
			name: t.name,
			text: e(i >= .2 ? "plan.car_away.missing" : "plan.car_away.enough"),
			to: _e(t.car),
			more: D`<joe-car-need .hass=${this.hass} .t=${e} .action=${r} .roundTrip=${n?.need.round_trip ?? !0}></joe-car-need>`
		});
	}
	renderEmpty(e, t) {
		let n = t ? Ae(e, t) : e(this.state?.mode === "off" ? "plan.empty.off" : "plan.empty.waiting");
		return D`<div class="empty">
      <joe-pose name=${t ? Oe(t) : "plan"}></joe-pose>
      <div>
        ${y(e("plan.title"))} ${M}
        <p class="lead">${n}</p>
      </div>
    </div>`;
	}
	frame(e, t, n) {
		let r = (e) => `${String((Number(e.slice(0, 2)) + 1) % 24).padStart(2, "0")}:00`, i = n.map((e, t) => `${N(e.start)}–${N(n[t + 1]?.start) || r(N(e.start))}`), a = /* @__PURE__ */ new Map();
		n.forEach((t, n) => {
			let r = N(t.start);
			r === "00:00" && n > 0 ? a.set(n, new Intl.DateTimeFormat(e.lang, {
				weekday: "short",
				timeZone: "UTC"
			}).format(/* @__PURE__ */ new Date(`${t.start.slice(0, 10)}T12:00:00Z`))) : Number(r.slice(0, 2)) % 3 == 0 && a.set(n, r.slice(0, 2));
		});
		let o = [];
		return n.forEach((t, n) => {
			if (!t.window) return;
			let r = o[o.length - 1];
			r && r.to === n ? r.to = n + 1 : o.push({
				from: n,
				to: n + 1,
				label: e("history.chart.cheap")
			});
		}), {
			labels: i,
			ticks: a,
			bands: o,
			at: (e) => {
				if (!e) return null;
				let t = Date.parse(e);
				for (let e = 0; e < n.length; e++) {
					let r = Date.parse(n[e].start);
					if (t >= r && t < r + Cu) return e + (t - r) / Cu;
				}
				return null;
			}
		};
	}
	renderEnergy(e, t, n) {
		let r = this.frame(e, t, n), i = [{
			label: e("plan.chart.solar"),
			kind: "area",
			values: n.map((e) => e.solar),
			color: "var(--joe-c-pv)",
			fill: "var(--joe-c-pv-fill)"
		}, {
			label: e("plan.chart.home"),
			kind: "line",
			values: n.map((e) => e.home),
			color: "var(--joe-c-load)"
		}];
		n.some((e) => e.charge > 0) && i.push({
			label: e("plan.chart.charge"),
			kind: "bar",
			values: n.map((e) => e.charge > 0 ? e.charge : null),
			color: "var(--joe-c-grid)"
		});
		let a = [], o = r.at(t.sun_takes_over);
		if (o != null) {
			let n = N(t.sun_takes_over);
			a.push({
				at: o,
				label: e("plan.chart.sun", { time: n }),
				short: `↑${n}`
			});
		}
		return D`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.chart.energy")} ${l(e, "chart_plan_energy")}</div>
      <joe-chart
        .labels=${r.labels}
        .ticks=${r.ticks}
        .series=${i}
        .bands=${r.bands}
        .markers=${a}
        unit="kWh"
        lang=${e.lang}
        label=${e("plan.chart.energy")}
      ></joe-chart>
      <div class="legend">
        ${i.map((e) => D`<span><i style="background:${e.color}"></i>${e.label}</span>`)}
      </div>
    </div>`;
	}
	renderPrices(e, t, n) {
		if (!n.some((e) => e.price != null)) return j;
		let r = this.frame(e, t, n), i = [{
			label: e("plan.chart.price"),
			kind: "bar",
			values: n.map((e) => e.price == null ? null : Math.round(e.price * 1e3) / 10),
			color: "var(--joe-c-ist)",
			digits: 1
		}], a = (t.charge_slots ?? []).flatMap((t) => {
			let n = r.at(t.start);
			return n == null ? [] : [{
				at: n,
				label: e("plan.chart.charge_at", { time: N(t.start) }),
				short: N(t.start)
			}];
		});
		return D`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.chart.prices")} ${l(e, "chart_plan_prices")}</div>
      <joe-chart
        .labels=${r.labels}
        .ticks=${r.ticks}
        .series=${i}
        .bands=${r.bands}
        .markers=${a}
        unit="ct"
        lang=${e.lang}
        label=${e("plan.chart.prices")}
      ></joe-chart>
      ${t.charge_slots?.length ? D`<p class="slots">${e("plan.slots", { slots: le(t) })}</p>` : j}
    </div>`;
	}
	renderSoc(e, t, n) {
		let r = this.frame(e, t, n), i = t.rules?.reserve ?? 10, a = [
			{
				label: e("plan.chart.plan"),
				kind: "line",
				values: n.map((e) => e.soc),
				color: "var(--joe-c-soc)",
				digits: 0
			},
			{
				label: e("plan.chart.without"),
				kind: "line",
				values: n.map((e) => e.soc_without),
				color: "var(--joe-c-ist)",
				dashed: !0,
				digits: 0
			},
			{
				label: e("plan.chart.reserve", { value: v(e.lang, i, 0) }),
				kind: "line",
				values: n.map(() => i),
				color: "var(--joe-crit)",
				dashed: !0,
				digits: 0
			}
		], o = [], s = r.at(t.window?.end);
		s != null && t.kind !== "none" && o.push({
			at: s,
			label: e("plan.chart.target", { value: v(e.lang, t.target ?? 0, 0) })
		});
		let c = r.at(t.full_at);
		return c != null && o.push({
			at: c,
			label: e("plan.chart.full", { time: N(t.full_at) }),
			short: `${N(t.full_at)}`
		}), D`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.chart.soc")} ${l(e, "chart_plan_soc")}</div>
      <joe-chart
        .labels=${r.labels}
        .ticks=${r.ticks}
        .series=${a}
        .bands=${r.bands}
        .markers=${o}
        max="100"
        height="190"
        unit="%"
        lang=${e.lang}
        label=${e("plan.chart.soc")}
      ></joe-chart>
      <div class="legend">
        ${a.map((e) => D`<span><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color}"></i>${e.label}</span>`)}
      </div>
    </div>`;
	}
	renderMath(e, t) {
		let n = (t, n = 1) => t == null ? "–" : `${v(e.lang, t, n)} kWh`, r = (t) => t == null ? "–" : `${v(e.lang, t * 100, 1)} ct`, i = t.window?.start.slice(0, 10) ?? "", a = t.meta?.solar.sources[i] ?? "none", o = t.meta?.tomorrow, s = o?.solar_factor ?? t.meta?.solar_factor ?? 1, c = t.meta?.consumption, u = this.state?.config.persons ?? [], d = [
			{
				label: e("plan.math.battery_now"),
				value: `${v(e.lang, t.soc_now ?? 0, 0)} %`,
				hint: e("plan.math.battery_now.sub", {
					stored: v(e.lang, (t.soc_now ?? 0) / 100 * (t.capacity_kwh ?? 0), 1),
					capacity: v(e.lang, t.capacity_kwh ?? 0, 1)
				}),
				to: {
					tab: "devices",
					section: "battery"
				}
			},
			{
				label: e("plan.math.battery_start"),
				value: `${v(e.lang, t.soc_start ?? 0, 0)} %`
			},
			{
				label: e("plan.math.solar"),
				value: n(t.solar_kwh),
				hint: `${e(`plan.math.solar.${a}`)}${s === 1 ? "" : ` · ${e(o?.solar_source === "combined" ? "plan.math.solar.combined" : o?.solar_source === "weather" && o.weather ? "plan.math.solar.weather" : "plan.math.solar.factor", {
					value: v(e.lang, s, 2),
					weather: o?.weather ? e(`learn.weather.${o.weather}`) : ""
				})}`}`,
				to: wu
			},
			{
				label: e("plan.math.home"),
				value: n(t.home_kwh),
				hint: c?.source === "history" ? e("plan.math.home.history", {
					days: c.days,
					kind: e(t.meta?.workday === !1 ? "plan.math.day_off" : "plan.math.workday")
				}) : e("plan.math.home.default")
			}
		];
		o && (o.temp != null || o.weather) && d.push({
			label: e("plan.math.weather"),
			value: [o.temp == null ? "" : `${v(e.lang, o.temp, 0)} °C`, o.weather ? e(`learn.weather.${o.weather}`) : ""].filter(Boolean).join(" · "),
			to: {
				tab: "household",
				section: "travel"
			}
		}), o && d.push({
			label: e("plan.math.day"),
			value: [e(o.workday ? "plan.math.day.workday" : "plan.math.day.off"), ...Object.entries(o.labels).map(([t, n]) => e("plan.math.tomorrow.person", {
				name: u.find((e) => e.id === t)?.name ?? t,
				label: e(`label.${n}`)
			}))].join(" · "),
			hint: o.expected_kwh == null ? e("plan.math.tomorrow.usual") : e("plan.math.tomorrow.scaled", {
				expected: v(e.lang, o.expected_kwh, 1),
				usual: v(e.lang, o.profile_kwh, 1)
			}),
			to: {
				tab: "household",
				section: "days"
			}
		}), d.push({
			label: e("plan.math.target"),
			value: `${v(e.lang, t.target ?? 0, 0)} %`,
			hint: e("plan.math.target.sub", {
				optimum: v(e.lang, t.optimum ?? 0, 0),
				buffer: v(e.lang, (t.rules?.buffer ?? 0) * 100, 0)
			}),
			to: {
				tab: "settings",
				section: "rules",
				id: "buffer_factor"
			}
		}, {
			label: e("plan.math.prices"),
			value: e("plan.math.prices.value", {
				night: r(t.prices?.night),
				day: r(t.prices?.day),
				feed: r(t.prices?.feed_in)
			}),
			hint: t.prices?.assumed ? e("plan.math.prices.assumed") : void 0,
			to: Tu
		}, {
			label: e("plan.math.rules"),
			value: e("plan.math.rules.value", {
				reserve: v(e.lang, t.rules?.reserve ?? 0, 0),
				max: v(e.lang, t.rules?.max_target ?? 100, 0),
				mode: e.optional(`rule.discharge.${t.rules?.discharge_mode}`) ?? ""
			}),
			to: {
				tab: "settings",
				section: "rules"
			}
		});
		let f = [...new Set(t.notes ?? [])].filter((t) => e.optional(`plan.note.${t}`));
		return D`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.math")} ${l(e, "plan_math")}</div>
      <div class="mirrors">
        ${d.map((t) => t.to ? Pa(e, this.prefix, {
			label: t.label,
			value: t.value,
			hint: t.hint,
			to: t.to
		}) : D`<div class="mirror">
                <div class="mirror-text">
                  <span class="mirror-label">${t.label}</span><span class="mirror-sep" aria-hidden="true">·</span
                  ><span class="mirror-value">${t.value}</span>
                  ${t.hint ? D`<small class="mirror-hint">${t.hint}</small>` : j}
                </div>
              </div>`)}
      </div>
      ${f.map((n) => this.renderNote(e, t, n))}
    </div>`;
	}
	renderNote(e, t, n) {
		let r = this.noteJumps(e, t, n);
		return D`<div class="note">
      <ha-icon icon="mdi:information-outline"></ha-icon>
      <div>
        <span>${e.optional(`plan.note.${n}`)}</span>
        ${r.length ? D`<div class="note-actions">
              ${r.map((e) => D`<a class="mini-btn go mirror-go" href=${E(this.prefix, e.to)} @click=${C(e.to)}>${e.label}</a>`)}
            </div>` : j}
      </div>
    </div>`;
	}
	noteJumps(e, t, n) {
		let r = e("mirror.set"), i = this.state?.config?.batteries ?? [], a = new Set((t.batteries ?? []).map((e) => e.id)), o = i.filter((e) => !a.has(e.id)), s;
		switch (n) {
			case "capacity_unknown": {
				let e = o.filter((e) => !e.capacity_kwh);
				s = e.length ? e : o;
				break;
			}
			case "soc_unknown": {
				let e = o.filter((e) => e.capacity_kwh);
				s = e.length ? e : o;
				break;
			}
			case "floor_unknown":
				s = i.filter((e) => a.has(e.id) && e.floor_soc == null);
				break;
			case "not_controllable":
				s = i.filter((e) => e.adapter === "none");
				break;
			case "no_forecast": return [{
				to: wu,
				label: r
			}];
			case "prices_partly": return [{
				to: Tu,
				label: e("mirror.change")
			}];
			case "balance_due": return [{
				to: {
					tab: "settings",
					section: "rules",
					id: "balance_days"
				},
				label: e("mirror.change")
			}];
			default: return [];
		}
		let c = (e) => {
			let t = pt(this.devices, "battery", e.id);
			return t ? R(t) : {
				tab: "devices",
				section: "battery",
				id: e.id
			};
		};
		return s.length === 1 ? [{
			to: c(s[0]),
			label: r
		}] : s.length ? s.map((e) => ({
			to: c(e),
			label: `${e.name} →`
		})) : [{
			to: {
				tab: "devices",
				section: "battery"
			},
			label: r
		}];
	}
	async refresh() {
		this.refreshing = !0;
		try {
			await this.hass?.callWS({ type: "energy_joe/plan/refresh" });
		} catch {} finally {
			this.refreshing = !1;
		}
	}
};
d([b({ attribute: !1 })], Eu.prototype, "hass", void 0), d([b({ attribute: !1 })], Eu.prototype, "t", void 0), d([b({ attribute: !1 })], Eu.prototype, "state", void 0), d([b({ attribute: !1 })], Eu.prototype, "route", void 0), d([b({ attribute: !1 })], Eu.prototype, "prefix", void 0), d([b({ attribute: !1 })], Eu.prototype, "devices", void 0), d([T()], Eu.prototype, "refreshing", void 0);
function Du(e, t) {
	return t < 1 ? `${v(e.lang, Math.round(t * 20) * 50, 0)} W` : `${v(e.lang, t, 1)} kW`;
}
function Ou(e, t) {
	return t.map((t) => e("plan.tonight.span", {
		start: N(t.start),
		end: N(t.end),
		power: Du(e, t.power_kw)
	})).join(", ");
}
function ku(e, t, n, r) {
	let i = [];
	r?.night_cap === "ignored" ? i.push(e("plan.pace.cap_ignored")) : n.how && n.how !== "none" && (i.push(e(`plan.pace.${n.how}`, { limit: v(e.lang, t.rules?.grid_limit_kw ?? 0, 1) })), n.how === "fixed_power" && r?.controls.charge_limit && !r.limit_ref_w && i.push(e("plan.pace.need_ref"))), n.slow_kw && i.push(e("plan.pace.slow", { power: Du(e, n.slow_kw) }));
	let a = (t.batteries ?? []).filter((e) => e.grid).length;
	return n.rank === 0 && a > 1 && i.push(e("plan.pace.first")), i.join(" ");
}
u("joe-plan-page", Eu);
//#endregion
//#region src/pages/settings/base.ts
var Au = class extends O {
	constructor(...e) {
		super(...e), this.prefix = A, this.checks = [];
	}
	willUpdate(e) {
		if (!e.has("route") && !e.has("anchor")) return;
		let t = this.route ? ue(this.route) : "";
		t !== this.revealed && (this.revealed = t, this.pending = this.anchor || void 0);
	}
	async updated() {
		let e = this.pending;
		if (!e) return;
		let t = [...this.renderRoot.querySelectorAll("joe-choice")];
		await Promise.all(t.map((e) => e.updateComplete));
		for (let e = 0; e < 10 && (e === 0 || !getComputedStyle(this).getPropertyValue("--joe-head-h")); e++) await new Promise((e) => requestAnimationFrame(e));
		this.pending === e && ve(this.renderRoot, e) && (this.pending = void 0);
	}
};
d([b({ attribute: !1 })], Au.prototype, "hass", void 0), d([b({ attribute: !1 })], Au.prototype, "t", void 0), d([b({ attribute: !1 })], Au.prototype, "state", void 0), d([b({ attribute: !1 })], Au.prototype, "route", void 0), d([b({ attribute: !1 })], Au.prototype, "prefix", void 0), d([b({ attribute: !1 })], Au.prototype, "info", void 0), d([b({ attribute: !1 })], Au.prototype, "discovery", void 0), d([b({ attribute: !1 })], Au.prototype, "checks", void 0), d([b({ attribute: !1 })], Au.prototype, "anchor", void 0);
//#endregion
//#region src/pages/settings/styles.ts
var ju = w`
  :host {
    display: block;
  }
  .list {
    display: grid;
    gap: 16px;
    margin-top: 16px;
  }
  .group {
    background: var(--joe-surface);
    border-radius: 14px;
    box-shadow: inset 0 0 0 1px var(--joe-line);
    padding: 4px 18px 8px;
  }
  h2 {
    font-family: var(--joe-display);
    font-style: italic;
    font-weight: 800;
    text-transform: uppercase;
    font-size: 22px;
    margin: 0;
    padding: 14px 0 8px;
  }
  .group-title {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .group-title h2 {
    flex: 0 1 auto;
  }
  .intro {
    margin: -2px 0 12px;
    color: var(--joe-ink-2);
    font-size: 14px;
    max-width: 64ch;
  }
  .list > .intro {
    margin: 0;
  }
  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px 16px;
    flex-wrap: wrap;
    padding: 14px 0;
    border-top: 1px solid var(--joe-line);
  }
  .row > div:first-child {
    flex: 1 1 260px;
    min-width: 0;
  }
  .row b {
    display: block;
    font-weight: 700;
  }
  .name {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .row small {
    display: block;
    color: var(--joe-muted);
    font-size: 13px;
    margin-top: 2px;
    max-width: 52ch;
  }
  .control {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
  .value {
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: var(--joe-ink-2);
    overflow-wrap: anywhere;
  }
  select.input,
  .input.time {
    width: auto;
    min-width: 160px;
    max-width: 100%;
  }
  a.mini-btn {
    text-decoration: none;
  }
  .row-note {
    margin: -6px 0 12px;
  }
  @media (max-width: 600px) {
    .group {
      padding: 4px 14px 8px;
    }
    .control {
      justify-content: flex-start;
    }
  }
`, Mu = "/config/energy", Nu = [
	"control",
	"button",
	"value",
	"calendar",
	"other"
], Pu = {
	select: "control",
	switch: "control",
	button: "button",
	sensor: "value",
	binary_sensor: "value",
	calendar: "calendar"
}, Fu = [
	"control",
	"value",
	"other"
], Iu = [{
	id: "night",
	type: "energy-joe-night-card",
	icon: "mdi:weather-night"
}, {
	id: "car",
	type: "energy-joe-car-card",
	icon: "mdi:car-electric-outline"
}];
function Lu(e) {
	return D`${e.split(/(?<=[._])/).map((e, t) => D`${t ? D`<wbr />` : j}${e}`)}`;
}
var Ru = class extends Au {
	static {
		this.styles = [
			k,
			ju,
			w`
      .ent {
        display: flex;
        align-items: center;
        gap: 10px 12px;
        padding: 10px 0;
        border-top: 1px solid var(--joe-line);
      }
      .ent-text {
        flex: 1;
        min-width: 0;
      }
      .ent-text b {
        display: block;
        font-weight: 700;
        overflow-wrap: anywhere;
      }
      code {
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 12.5px;
        color: var(--joe-muted);
        overflow-wrap: anywhere;
      }
      .ent-state {
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        color: var(--joe-ink-2);
        text-align: right;
        max-width: 40%;
        overflow-wrap: anywhere;
      }
      /* Narrow: the value goes below, so the id keeps the width and breaks only at "." and "_". */
      @media (max-width: 600px) {
        .ent {
          flex-wrap: wrap;
          row-gap: 2px;
        }
        .ent-state {
          order: 3;
          flex-basis: 100%;
          max-width: none;
          text-align: left;
        }
      }
      .group-label {
        margin: 14px 0 4px;
      }
      .card-type {
        display: block;
        margin-top: 4px;
      }
      .row b.card-name {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .card-name ha-icon {
        --mdc-icon-size: 20px;
        color: var(--joe-ink-2);
      }
    `
		];
	}
	render() {
		let { t: e, hass: t } = this;
		return !e || !this.state ? j : D`<div class="list">
      ${this.renderVersions(e)} ${this.renderEntities(e, t)} ${this.renderCards(e)}
    </div>`;
	}
	renderVersions(e) {
		let t = this.info?.energy, n = !!(t?.configured && t.sources);
		return D`<section class="group" data-anchor="versions">
      <h2>${e("settings.about")}</h2>
      <div class="row"><b>${e("settings.version")}</b><span class="value">${this.info?.version ?? "–"}</span></div>
      <div class="row"><b>${e("settings.ha")}</b><span class="value">${this.info?.ha_version ?? "–"}</span></div>
      <div class="row" data-anchor="energy">
        <div>
          <b>${e("settings.energy")}</b>
          <small>${n ? this.energyText(e) : e("settings.energy.none")}</small>
        </div>
        <a
          class="mini-btn"
          data-notip
          href=${Mu}
          @click=${(e) => {
			e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0 || (e.preventDefault(), ee(Mu));
		}}
          ><ha-icon icon="mdi:open-in-new"></ha-icon>${e("grid.energy.open")}</a
        >
      </div>
    </section>`;
	}
	energyText(e) {
		let t = this.info.energy, n = t.sources ?? {};
		return e("settings.energy.sources", {
			grid: n.grid ?? 0,
			solar: n.solar ?? 0,
			battery: n.battery ?? 0,
			devices: t.devices ?? 0
		});
	}
	renderEntities(e, t) {
		let n = Object.values(t?.entities ?? {}).filter((e) => e.platform === "energy_joe"), r = /* @__PURE__ */ new Map();
		for (let e of n) {
			let n = Pu[e.entity_id.split(".", 1)[0]] ?? "other", i = t ? _(t, e.entity_id) : e.entity_id, a = i.replace(/^energy joe\s+/i, "") || i;
			r.set(n, [...r.get(n) ?? [], {
				id: e.entity_id,
				name: a
			}]);
		}
		return D`<section class="group" data-anchor="entities">
      <div class="group-title" data-tipped><h2>${e("settings.about.entities")}</h2>${l(e, "about_entities")}</div>
      <p class="intro">${e("settings.about.entities.intro")}</p>
      ${n.length ? Nu.filter((e) => r.has(e)).map((n) => D`<div class="group-label">${e(`settings.about.group.${n}`)}</div>
              ${r.get(n).sort((t, n) => t.name.localeCompare(n.name, e.lang)).map((r) => D`<div class="ent">
                    <div class="ent-text"><b>${r.name}</b><code>${Lu(r.id)}</code></div>
                    ${t && Fu.includes(n) ? D`<span class="ent-state">${c(t, r.id, e.lang)}</span>` : j}
                    ${G(e, {
			entityId: r.id,
			name: r.name
		})}
                  </div>`)}`) : D`<p class="intro">${e("settings.about.entities.none")}</p>`}
    </section>`;
	}
	renderCards(e) {
		return D`<section class="group" data-anchor="cards">
      <h2>${e("settings.about.cards")}</h2>
      <p class="intro">${e("settings.about.cards.intro")}</p>
      ${Iu.map((t) => D`<div class="row">
          <div>
            <b class="card-name"><ha-icon icon=${t.icon}></ha-icon>${e(`settings.about.cards.${t.id}`)}</b>
            <small>${e(`settings.about.cards.${t.id}.hint`)}</small>
            <code class="card-type">type: custom:${t.type}</code>
          </div>
        </div>`)}
    </section>`;
	}
};
u("joe-settings-about", Ru);
//#endregion
//#region src/pages/settings/maintenance.ts
var zu = "/config/integrations/integration/energy_joe", Bu = class extends Au {
	static {
		this.styles = [
			k,
			ju,
			w`
      label.file {
        position: relative;
        overflow: hidden;
        cursor: pointer;
      }
      label.file input {
        position: absolute;
        inset: 0;
        opacity: 0;
        cursor: pointer;
      }
      .confirm {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-top: 8px;
      }
      .group > .note {
        margin-bottom: 10px;
      }
    `
		];
	}
	render() {
		let { t: e, state: t } = this;
		return !e || !t ? j : D`<div class="list">
      ${this.renderObserve(e, t)} ${this.renderBackup(e)} ${this.renderSetup(e)}
    </div>`;
	}
	renderObserve(e, t) {
		let n = t.observe, r = !!n?.active, i = n?.backfill.state === "running", a = (t) => new Intl.DateTimeFormat(e.lang, {
			day: "numeric",
			month: "long",
			timeZone: "UTC"
		}).format(/* @__PURE__ */ new Date(`${t.slice(0, 10)}T12:00:00Z`)), o = r ? e("settings.observe.since", {
			day: a(n.since),
			time: n.since.slice(11, 16)
		}) : t.mode === "off" ? e("settings.observe.off") : e("settings.observe.waiting"), s = [];
		n?.first_day ? s.push(e("settings.observe.days", {
			days: n.day_count ?? 0,
			first: a(n.first_day)
		})) : s.push(e("settings.observe.nothing"));
		let c = n?.backfill;
		return c?.state === "running" ? s.push(e("history.reading")) : c?.state === "unavailable" ? s.push(e("settings.observe.no_recorder")) : c?.state === "failed" && s.push(e("settings.observe.failed")), D`<section class="group" data-anchor="observe">
      <h2>${e("settings.observe")}</h2>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${e("settings.observe.recording")}</b>${l(e, "observe")}</div>
          <small>${o}</small>
        </div>
        <span class="chip ${r ? "ok" : ""}">
          ${e(r ? "status.running" : t.mode === "off" ? "status.paused" : "status.waiting")}
        </span>
      </div>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${e("settings.observe.history")}</b>${l(e, "rebuild")}</div>
          <small>${s.join(" · ")}</small>
        </div>
        <button type="button" class="btn btn-secondary" ?disabled=${!r || i} @click=${this.rebuild}>
          ${e("settings.observe.rebuild")}
        </button>
      </div>
    </section>`;
	}
	async rebuild() {
		try {
			await this.hass?.callWS({ type: "energy_joe/history/rebuild" });
		} catch {}
	}
	renderBackup(e) {
		return D`<section class="group" data-anchor="backup">
      <h2>${e("settings.backup")}</h2>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${e("settings.backup.export")}</b>${l(e, "backup_export")}</div>
          <small>${e("settings.backup.export.hint")}</small>
        </div>
        <button type="button" class="btn btn-secondary" @click=${() => void this.exportSettings()}>${e("settings.backup.download")}</button>
      </div>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${e("settings.backup.import")}</b>${l(e, "backup_import")}</div>
          <small>${e("settings.backup.import.hint")}</small>
        </div>
        <label class="btn btn-secondary file">
          ${e("settings.backup.choose")}
          <input type="file" accept="application/json,.json" @change=${(e) => void this.readBackup(e)} />
        </label>
      </div>
      ${this.backup ? D`<div class="note warn" data-tipped>
            <ha-icon icon="mdi:alert-outline"></ha-icon>
            <span>
              ${e("settings.backup.confirm", {
			file: this.backup.name,
			when: this.backup.when
		})} ${l(e, "backup_import")}
              <span class="confirm">
                <button type="button" class="btn btn-danger" @click=${() => void this.importSettings()}>${e("settings.backup.replace")}</button>
                <button type="button" class="btn btn-ghost" @click=${() => this.backup = void 0}>${e("common.cancel")}</button>
              </span>
            </span>
          </div>` : j}
      ${this.backupNote ? D`<div class="note ${this.backupNote.ok ? "ok" : "warn"}">
            <ha-icon icon=${this.backupNote.ok ? "mdi:check" : "mdi:alert-outline"}></ha-icon><span>${this.backupNote.text}</span>
          </div>` : j}
    </section>`;
	}
	async exportSettings() {
		let e = this.t;
		try {
			let t = await this.hass.callWS({ type: "energy_joe/config/export" }), n = new Blob([JSON.stringify(t, null, 2)], { type: "application/json" }), r = document.createElement("a");
			r.href = URL.createObjectURL(n), r.download = `energy-joe-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`, r.click(), URL.revokeObjectURL(r.href), this.backupNote = {
				ok: !0,
				text: e("settings.backup.exported")
			};
		} catch (t) {
			this.backupNote = {
				ok: !1,
				text: e("settings.backup.failed", { error: String(t?.message ?? t) })
			};
		}
	}
	async readBackup(e) {
		let t = this.t, n = e.target, r = n.files?.[0];
		if (n.value = "", r) {
			this.backupNote = void 0;
			try {
				let e = JSON.parse(await r.text());
				if (e.kind !== "energy_joe_settings" || !e.config) throw Error(t("settings.backup.not_ours"));
				this.backup = {
					name: r.name,
					when: e.exported ? new Date(e.exported).toLocaleString(t.lang) : "–",
					config: e.config
				};
			} catch (e) {
				this.backupNote = {
					ok: !1,
					text: t("settings.backup.failed", { error: String(e?.message ?? e) })
				};
			}
		}
	}
	async importSettings() {
		let e = this.t, t = this.backup;
		if (this.backup = void 0, t) try {
			await this.hass.callWS({
				type: "energy_joe/config/import",
				config: t.config
			}), this.backupNote = {
				ok: !0,
				text: e("settings.backup.imported")
			};
		} catch (t) {
			this.backupNote = {
				ok: !1,
				text: e("settings.backup.failed", { error: String(t?.message ?? t) })
			};
		}
	}
	renderSetup(e) {
		return D`<section class="group" data-anchor="setup">
      <h2>${e("settings.setup")}</h2>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${e("settings.setup.again")}</b>${l(e, "restart")}</div>
          <small>${e("settings.setup.hint")}</small>
        </div>
        <button
          type="button"
          class="btn btn-secondary"
          @click=${() => this.dispatchEvent(new CustomEvent("joe-onboarding", {
			detail: {
				step: "welcome",
				completed: !1
			},
			bubbles: !0,
			composed: !0
		}))}
        >
          ${e("settings.setup.restart")}
        </button>
      </div>
      <div class="row" data-tipped data-anchor="diagnostics">
        <div>
          <div class="name"><b>${e("settings.maintenance.diagnostics")}</b>${l(e, "diagnostics")}</div>
          <small>${e("settings.maintenance.diagnostics.hint")}</small>
        </div>
        <a
          class="mini-btn"
          data-notip
          href=${zu}
          @click=${(e) => {
			e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0 || (e.preventDefault(), ee(zu));
		}}
          ><ha-icon icon="mdi:open-in-new"></ha-icon>${e("settings.maintenance.diagnostics.open")}</a
        >
      </div>
    </section>`;
	}
};
d([T()], Bu.prototype, "backup", void 0), d([T()], Bu.prototype, "backupNote", void 0), u("joe-settings-maintenance", Bu);
//#endregion
//#region src/pages/settings/notify.ts
var Vu = class extends Au {
	constructor(...e) {
		super(...e), this.loading = !1;
	}
	static {
		this.styles = [k, ju];
	}
	connectedCallback() {
		super.connectedCallback(), this.loadTargets();
	}
	firstUpdated() {
		this.loadTargets();
	}
	loadTargets() {
		this.loading || this.notifyTargets || !this.hass || (this.loading = !0, this.hass.callWS({ type: "energy_joe/notify/targets" }).then((e) => this.notifyTargets = e).catch(() => void 0).finally(() => this.loading = !1));
	}
	render() {
		let { t: e, state: t } = this;
		if (!e || !t) return j;
		let n = t.config, r = n.notify, i = this.notifyTargets ?? Object.keys(this.hass?.services?.notify ?? {}).filter((e) => ![
			"persistent_notification",
			"send_message",
			"notify"
		].includes(e)).sort().map((e) => ({
			service: e,
			name: e.replace(/_/g, " ")
		})), a = r.service?.replace(/^notify\./, ""), o = !!a && this.notifyTargets !== void 0 && !i.some((e) => e.service === a);
		return D`<div class="list">
      <section class="group" data-anchor="notify">
        <h2>${e("settings.notify")}</h2>
        <p class="intro">${e("settings.notify.intro")}</p>
        <div class="row" data-tipped data-anchor="service">
          <div>
            <div class="name"><label for="notify-service"><b>${e("settings.notify.service")}</b></label>${l(e, "notify_service")}</div>
            <small>${e("settings.notify.service.hint")}</small>
          </div>
          <select
            id="notify-service"
            class="input"
            @change=${(e) => {
			let t = e.target.value;
			I(this, { notify: { service: t ? `notify.${t}` : null } });
		}}
          >
            <option value="" ?selected=${!r.service}>${e("settings.notify.none")}</option>
            ${i.map((e) => D`<option value=${e.service} ?selected=${a === e.service}>${e.name}</option>`)}
            ${o ? D`<option value=${a} selected>${e("settings.notify.gone", { name: a ?? "" })}</option>` : j}
          </select>
        </div>
        ${this.toggle(e, n, "ask")} ${this.toggle(e, n, "problems")} ${this.toggle(e, n, "stuck")}
        ${this.toggle(e, n, "morning")}
        ${n.cars?.length ? this.toggle(e, n, "cars") : j}
        ${this.askTime(e, n)}
      </section>
    </div>`;
	}
	toggle(e, t, n) {
		let r = t.notify;
		return D`<div class="row" data-tipped>
      <div>
        <div class="name"><b id="notify-${n}">${e(`settings.notify.${n}`)}</b>${l(e, `notify_${n}`)}</div>
        <small>${e(`settings.notify.${n}.hint`)}</small>
      </div>
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${String(r[n] ?? !0)}
        aria-labelledby="notify-${n}"
        ?disabled=${!r.service}
        @click=${() => I(this, { notify: { [n]: !(r[n] ?? !0) } })}
      ></button>
    </div>`;
	}
	askTime(e, t) {
		return D`<div class="row" data-tipped data-anchor="ask_time">
      <div>
        <div class="name"><label for="ask-time"><b>${e("settings.ask_time")}</b></label>${l(e, "ask_time")}</div>
        <small>${e("settings.ask_time.hint")}</small>
      </div>
      <input
        id="ask-time"
        class="input time"
        type="time"
        .value=${t.rules.ask_time}
        @change=${(e) => {
			let t = e.target.value;
			/^\d{2}:\d{2}$/.test(t) && I(this, { rules: { ask_time: t } });
		}}
      />
    </div>`;
	}
};
d([T()], Vu.prototype, "notifyTargets", void 0), u("joe-settings-notify", Vu);
//#endregion
//#region src/pages/settings/operation.ts
var Hu = [
	"simulation",
	"advisory",
	"live",
	"off"
], Uu = class extends Au {
	static {
		this.styles = [
			k,
			ju,
			w`
      .modes {
        list-style: none;
        margin: 0 0 14px;
        padding: 0;
        display: grid;
        gap: 8px;
      }
      /* An explanation, not a control: a quiet bar instead of a button look. */
      .modes li {
        padding: 4px 0 4px 12px;
        border-left: 3px solid var(--joe-line);
      }
      .modes li.on {
        border-left-color: var(--joe-amber);
      }
      .modes .mode-name {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        font-weight: 700;
      }
      .modes p {
        margin: 2px 0 0;
        font-size: 13.5px;
        color: var(--joe-ink-2);
      }
      .buffer-mirror {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .buffer-mirror .mirror {
        flex: 1;
      }
    `
		];
	}
	render() {
		let { t: e, state: t } = this;
		return !e || !t ? j : D`<div class="list">
      <section class="group" data-anchor="mode">
        <h2>${e("settings.operation")}</h2>
        <div class="row" data-tipped>
          <div>
            <div class="name"><b>${e("settings.mode")}</b>${l(e, "mode")}</div>
            <small>${e("settings.mode.now", { mode: e(`mode.${t.mode}`) })}</small>
          </div>
          <div class="control">
            <button type="button" class="btn btn-secondary" @click=${this.openDialog}>${e("settings.mode.open")}</button>
            ${l(e, "mode_open")}
          </div>
        </div>
        <ul class="modes">
          ${Hu.map((n) => D`<li class=${n === t.mode ? "on" : ""}>
              <span class="mode-name"
                >${e(`mode.${n}`)}
                ${n === t.mode ? D`<span class="chip ok">${e("mode.current")}</span>` : j}</span
              >
              <p>${e(`mode.${n}.desc`)}</p>
            </li>`)}
        </ul>
        ${this.gridFriendlyRows(e, t)}
      </section>
    </div>`;
	}
	openDialog() {
		this.dispatchEvent(new CustomEvent("joe-mode-dialog", {
			bubbles: !0,
			composed: !0
		}));
	}
	gridFriendlyRows(e, t) {
		let n = t.config, r = n.rules;
		return D`<div class="row" data-tipped data-anchor="grid_friendly">
        <div>
          <div class="name"><b id="grid-friendly">${e("rule.grid_friendly")}</b>${l(e, "r_grid_friendly")}</div>
          <small>${e("rule.grid_friendly.hint")}</small>
        </div>
        <div class="control">
          ${S(e, P(n, "rules.grid_friendly"))}
          <button
            type="button"
            class="switch"
            role="switch"
            aria-checked=${String(r.grid_friendly)}
            aria-labelledby="grid-friendly"
            @click=${() => I(this, { rules: { grid_friendly: !r.grid_friendly } })}
          ></button>
        </div>
      </div>
      ${r.grid_friendly ? D`<div class="row" data-tipped>
            <div>
              <div class="name"><b>${e("rule.grid_first")}</b>${l(e, "r_grid_first")}</div>
              <small>${e(r.grid_first ? "rule.grid_first.grid.hint" : "rule.grid_first.saving.hint")}</small>
            </div>
            <div class="seg" role="group" aria-label=${e("rule.grid_first")}>
              ${[!1, !0].map((t) => D`<button
                    type="button"
                    aria-pressed=${String(r.grid_first === t)}
                    @click=${() => I(this, { rules: { grid_first: t } })}
                  >
                    ${e(t ? "rule.grid_first.grid" : "rule.grid_first.saving")}
                  </button>`)}
            </div>
          </div>
          <div class="buffer-mirror" data-tipped>
            ${Pa(e, this.prefix, {
			label: e("rule.morning_buffer"),
			value: this.bufferValue(e, t),
			source: P(n, "rules.morning_buffer_soc"),
			to: {
				tab: "settings",
				section: "rules",
				id: "morning_buffer"
			}
		})}
            ${l(e, "r_morning_buffer")}
          </div>` : j}`;
	}
	bufferValue(e, t) {
		let n = Ka(t.plan)?.suggested;
		return t.config.rules.morning_buffer_soc == null && n != null ? e("rule.morning_buffer.auto_n", { soc: String(n) }) : Wa(e, t.config, "morning_buffer");
	}
};
u("joe-settings-operation", Uu);
//#endregion
//#region src/pages/settings/rules.ts
var Wu = [
	"battery",
	"grid",
	"plan"
], Gu = class extends Au {
	static {
		this.styles = [
			k,
			ju,
			io
		];
	}
	render() {
		let { t: e, state: t } = this;
		if (!e || !t) return j;
		let n = t.config;
		return D`<div class="list">
      <p class="intro">${e("settings.rules.intro")}</p>
      ${Wu.map((r) => D`<section class="group" data-anchor=${`group-${r}`}>
          <h2>${e(`settings.rules.group.${r}`)}</h2>
          ${Ra[r].map((r) => Ga(e, this, n, this.info, r, t.control, t.plan))}
        </section>`)}
    </div>`;
	}
};
u("joe-settings-rules", Gu);
//#endregion
//#region src/pages/settings/signpost.ts
var Ku = [
	{
		id: "overview",
		to: { tab: "overview" }
	},
	{
		id: "plan",
		to: { tab: "plan" }
	},
	{
		id: "steer",
		to: { tab: "plan" }
	},
	{
		id: "result",
		to: {
			tab: "review",
			section: "result"
		}
	},
	{
		id: "days",
		to: {
			tab: "review",
			section: "days"
		}
	},
	{
		id: "learned",
		to: {
			tab: "review",
			section: "learned"
		}
	},
	{
		id: "learned_reset",
		to: {
			tab: "review",
			section: "learned",
			id: "reset"
		}
	},
	{
		id: "log",
		to: {
			tab: "review",
			section: "log"
		}
	},
	{
		id: "devices",
		to: {
			tab: "devices",
			section: "all"
		}
	},
	{
		id: "add",
		to: {
			tab: "devices",
			section: "add"
		}
	},
	{
		id: "battery",
		to: {
			tab: "devices",
			section: "battery"
		}
	},
	{
		id: "battery_team",
		to: {
			tab: "devices",
			section: "battery",
			id: "together"
		}
	},
	{
		id: "climate",
		to: {
			tab: "devices",
			section: "climate"
		}
	},
	{
		id: "car",
		to: {
			tab: "devices",
			section: "car"
		}
	},
	{
		id: "wallbox",
		to: {
			tab: "devices",
			section: "car"
		}
	},
	{
		id: "car_sources",
		to: {
			tab: "devices",
			section: "car"
		}
	},
	{
		id: "car_reminder",
		to: {
			tab: "settings",
			section: "notify"
		}
	},
	{
		id: "hot_water",
		to: {
			tab: "devices",
			section: "hot_water"
		}
	},
	{
		id: "other",
		to: {
			tab: "devices",
			section: "other"
		}
	},
	{
		id: "energy",
		to: {
			tab: "devices",
			section: "grid"
		}
	},
	{
		id: "connection",
		to: {
			tab: "devices",
			section: "grid",
			id: "connection"
		}
	},
	{
		id: "tariff",
		to: {
			tab: "devices",
			section: "grid",
			id: "tariff"
		}
	},
	{
		id: "solar",
		to: {
			tab: "devices",
			section: "grid",
			id: "solar"
		}
	},
	{
		id: "home",
		to: {
			tab: "devices",
			section: "grid",
			id: "home"
		}
	},
	{
		id: "people",
		to: {
			tab: "household",
			section: "people"
		}
	},
	{
		id: "presence",
		to: {
			tab: "household",
			section: "presence"
		}
	},
	{
		id: "guest",
		to: {
			tab: "household",
			section: "presence"
		}
	},
	{
		id: "way",
		to: {
			tab: "household",
			section: "presence",
			id: "way"
		}
	},
	{
		id: "calendar",
		to: {
			tab: "household",
			section: "days"
		}
	},
	{
		id: "night",
		to: {
			tab: "household",
			section: "night"
		}
	},
	{
		id: "travel",
		to: {
			tab: "household",
			section: "travel"
		}
	},
	{
		id: "mode",
		to: {
			tab: "settings",
			section: "operation"
		}
	},
	{
		id: "grid_friendly",
		to: {
			tab: "settings",
			section: "operation",
			id: "grid_friendly"
		}
	},
	{
		id: "rules",
		to: {
			tab: "settings",
			section: "rules"
		}
	},
	{
		id: "rule_reserve_soc",
		to: {
			tab: "settings",
			section: "rules",
			id: "reserve_soc"
		},
		title: "rule.reserve_soc"
	},
	{
		id: "rule_max_target_soc",
		to: {
			tab: "settings",
			section: "rules",
			id: "max_target_soc"
		},
		title: "rule.max_target_soc"
	},
	{
		id: "rule_evening_min_soc",
		to: {
			tab: "settings",
			section: "rules",
			id: "evening_min_soc"
		},
		title: "rule.evening_min_soc"
	},
	{
		id: "rule_balance_days",
		to: {
			tab: "settings",
			section: "rules",
			id: "balance_days"
		},
		title: "rule.balance_days"
	},
	{
		id: "rule_discharge_in_window",
		to: {
			tab: "settings",
			section: "rules",
			id: "discharge_in_window"
		},
		title: "rule.discharge_in_window"
	},
	{
		id: "rule_converter_losses",
		to: {
			tab: "settings",
			section: "rules",
			id: "converter_losses"
		},
		title: "rule.converter_losses"
	},
	{
		id: "rule_day_surplus",
		to: {
			tab: "settings",
			section: "rules",
			id: "day_surplus"
		},
		title: "rule.day_surplus"
	},
	{
		id: "rule_morning_buffer",
		to: {
			tab: "settings",
			section: "rules",
			id: "morning_buffer"
		},
		title: "rule.morning_buffer"
	},
	{
		id: "rule_transfer_guard",
		to: {
			tab: "settings",
			section: "rules",
			id: "transfer_guard"
		},
		title: "rule.transfer_guard"
	},
	{
		id: "rule_grid_limit_w",
		to: {
			tab: "settings",
			section: "rules",
			id: "grid_limit_w"
		},
		title: "rule.grid_limit_w"
	},
	{
		id: "rule_max_night_kwh",
		to: {
			tab: "settings",
			section: "rules",
			id: "max_night_kwh"
		},
		title: "rule.max_night_kwh"
	},
	{
		id: "rule_guard_grid",
		to: {
			tab: "settings",
			section: "rules",
			id: "guard_grid"
		},
		title: "rule.guard_grid"
	},
	{
		id: "rule_max_price",
		to: {
			tab: "settings",
			section: "rules",
			id: "max_price"
		},
		title: "rule.max_price"
	},
	{
		id: "rule_min_saving",
		to: {
			tab: "settings",
			section: "rules",
			id: "min_saving"
		},
		title: "rule.min_saving"
	},
	{
		id: "rule_priority",
		to: {
			tab: "settings",
			section: "rules",
			id: "priority"
		},
		title: "rule.priority"
	},
	{
		id: "rule_buffer_factor",
		to: {
			tab: "settings",
			section: "rules",
			id: "buffer_factor"
		},
		title: "rule.buffer_factor"
	},
	{
		id: "rule_plan_offset_min",
		to: {
			tab: "settings",
			section: "rules",
			id: "plan_offset_min"
		},
		title: "rule.plan_offset_min"
	},
	{
		id: "rule_reset_lead_min",
		to: {
			tab: "settings",
			section: "rules",
			id: "reset_lead_min"
		},
		title: "rule.reset_lead_min"
	},
	{
		id: "notify",
		to: {
			tab: "settings",
			section: "notify"
		}
	},
	{
		id: "ask_time",
		to: {
			tab: "settings",
			section: "notify",
			id: "ask_time"
		},
		title: "settings.ask_time"
	},
	{
		id: "observe",
		to: {
			tab: "settings",
			section: "maintenance",
			id: "observe"
		}
	},
	{
		id: "backup",
		to: {
			tab: "settings",
			section: "maintenance",
			id: "backup"
		}
	},
	{
		id: "setup",
		to: {
			tab: "settings",
			section: "maintenance",
			id: "setup"
		}
	},
	{
		id: "diagnostics",
		to: {
			tab: "settings",
			section: "maintenance",
			id: "diagnostics"
		}
	},
	{
		id: "about",
		to: {
			tab: "settings",
			section: "about"
		}
	},
	{
		id: "entities",
		to: {
			tab: "settings",
			section: "about",
			id: "entities"
		}
	},
	{
		id: "cards",
		to: {
			tab: "settings",
			section: "about",
			id: "cards"
		}
	}
], qu = 8;
function Ju(e) {
	return e.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ß/g, "ss").replace(/([aou])e/g, "$1").replace(/[-\u2010\u2011]/g, "");
}
var Yu = class extends O {
	constructor(...e) {
		super(...e), this.prefix = A, this.query = "";
	}
	static {
		this.styles = [k, w`
      :host {
        display: block;
        margin-top: 14px;
      }
      .signpost {
        background: var(--joe-surface);
        border-radius: 14px;
        box-shadow: inset 0 0 0 1px var(--joe-line);
        padding: 12px 18px 14px;
      }
      .sp-head {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }
      .sp-head label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 700;
      }
      .sp-head ha-icon {
        --mdc-icon-size: 20px;
        color: var(--joe-ink-2);
      }
      .input {
        max-width: 520px;
      }
      .hits {
        list-style: none;
        margin: 10px 0 0;
        padding: 0;
        display: grid;
        gap: 4px;
      }
      a.hit {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 44px;
        padding: 6px 10px;
        border-radius: 10px;
        text-decoration: none;
        color: var(--joe-ink);
        background: var(--joe-surface-2);
      }
      a.hit:hover,
      a.hit:focus-visible {
        background: var(--joe-line);
      }
      .hit-text {
        flex: 1;
        min-width: 0;
      }
      .hit-title {
        display: block;
        font-weight: 700;
        overflow-wrap: anywhere;
      }
      .hit-where {
        display: block;
        font-size: 13px;
        color: var(--joe-muted);
        overflow-wrap: anywhere;
      }
      .hit ha-icon {
        --mdc-icon-size: 18px;
        color: var(--joe-ink-2);
        flex: none;
      }
      .sp-status {
        margin: 8px 0 0;
        font-size: 13.5px;
        color: var(--joe-muted);
      }
      @media (max-width: 600px) {
        .signpost {
          padding: 12px 14px 14px;
        }
      }
    `];
	}
	render() {
		let e = this.t;
		if (!e) return j;
		let t = this.search(e), n = this.query.trim() !== "";
		return D`<section class="signpost" data-tipped role="search">
      <div class="sp-head">
        <label for="signpost-q"><ha-icon icon="mdi:sign-direction"></ha-icon>${e("signpost.title")}</label>${l(e, "signpost")}
      </div>
      <input
        id="signpost-q"
        class="input"
        type="search"
        autocomplete="off"
        enterkeyhint="go"
        placeholder=${e("signpost.placeholder")}
        .value=${this.query}
        @input=${(e) => this.query = e.target.value}
        @keydown=${(e) => {
			e.key === "Enter" && t[0] ? (e.preventDefault(), this.go(t[0].entry.to)) : e.key === "Escape" && (this.query = "");
		}}
      />
      ${n && t.length ? D`<ul class="hits">
            ${t.slice(0, qu).map((e) => D`<li>${this.hitLink(e)}</li>`)}
          </ul>` : j}
      <p class="sp-status" aria-live="polite" ?hidden=${!n || t.length > 0 && t.length <= qu}>
        ${n ? t.length ? e("signpost.more", { count: t.length - qu }) : e("signpost.none") : ""}
      </p>
    </section>`;
	}
	hitLink(e) {
		let t = e.entry.to;
		return D`<a
      class="hit"
      href=${E(this.prefix, t)}
      @click=${(e) => {
			C(t)(e), e.defaultPrevented && (this.query = "");
		}}
    >
      <span class="hit-text">
        <span class="hit-title">${e.term ? `${e.term} → ${e.title}` : e.title}</span>
        <span class="hit-where">${e.where}</span>
      </span>
      <ha-icon icon="mdi:arrow-right"></ha-icon>
    </a>`;
	}
	go(e) {
		this.query = "", x(this, e);
	}
	search(e) {
		let t = Ju(this.query).split(/\s+/).filter(Boolean);
		if (!t.length) return [];
		let n = [];
		return Ku.forEach((r, i) => {
			let a = e("title" in r ? r.title : `signpost.${r.id}`), o = e(`signpost.${r.id}.terms`).split(",").map((e) => e.trim()).filter(Boolean), s = Xu(e, r.to, a), c = Ju([
				a,
				...o,
				s
			].join(" | "));
			if (!t.every((e) => c.includes(e))) return;
			let l = t.join(" "), u = Ju(a), d = o.find((e) => Ju(e) === l), f = u === l ? 0 : d ? 1 : u.startsWith(l) ? 2 : u.includes(l) ? 3 : 6, p = f === 1 ? d : void 0;
			if (f > 3) {
				let e = o.find((e) => Ju(e).startsWith(l)) ?? o.find((e) => Ju(e).includes(l));
				e && (p = e, f = Ju(e).startsWith(l) ? 4 : 5);
			}
			n.push({
				entry: r,
				title: a,
				term: p,
				where: s,
				score: f * 100 + i
			});
		}), n.sort((e, t) => e.score - t.score);
	}
};
d([b({ attribute: !1 })], Yu.prototype, "t", void 0), d([b({ attribute: !1 })], Yu.prototype, "state", void 0), d([b({ attribute: !1 })], Yu.prototype, "route", void 0), d([b({ attribute: !1 })], Yu.prototype, "prefix", void 0), d([T()], Yu.prototype, "query", void 0);
function Xu(e, t, n) {
	let r = [e(`tab.${t.tab}`)];
	if (t.section) {
		let n = e.optional(`nav.${t.tab}.${t.section}`);
		n && r.push(n);
	}
	return t.id && Ju(r[r.length - 1]) !== Ju(n) && r.push(n), r.join(" › ");
}
u("joe-signpost", Yu);
//#endregion
//#region src/pages/settings/index.ts
var Zu = {
	operation: "mdi:tune-variant",
	rules: "mdi:format-list-checks",
	notify: "mdi:bell-outline",
	maintenance: "mdi:wrench-outline",
	about: "mdi:information-outline"
}, Qu = class extends O {
	constructor(...e) {
		super(...e), this.prefix = A, this.checks = [];
	}
	static {
		this.styles = [k, w`
      :host {
        display: block;
      }
      .body {
        max-width: 900px;
        margin: 0 auto;
      }
    `];
	}
	render() {
		let e = this.t;
		if (!e || !this.state) return j;
		let t = this.route?.section ?? ye.settings, n = he.settings.map((t) => ({
			id: t,
			label: e(`nav.settings.${t}`),
			icon: Zu[t]
		}));
		return D`${zr(e, this.prefix, "settings", n, t)}
      <div class="body">${this.renderSignpost()}${this.renderSection(t)}</div>`;
	}
	renderSignpost() {
		return D`<joe-signpost .t=${this.t} .state=${this.state} .prefix=${this.prefix} .route=${this.route}></joe-signpost>`;
	}
	renderSection(e) {
		let { t, hass: n, state: r, prefix: i, route: a, info: o, discovery: s, checks: c } = this;
		switch (e) {
			case "operation": return D`<joe-settings-operation
          .t=${t}
          .hass=${n}
          .state=${r}
          .prefix=${i}
          .route=${a}
          .info=${o}
          .discovery=${s}
          .checks=${c}
          .anchor=${a?.id}
        ></joe-settings-operation>`;
			case "rules": return D`<joe-settings-rules
          .t=${t}
          .hass=${n}
          .state=${r}
          .prefix=${i}
          .route=${a}
          .info=${o}
          .discovery=${s}
          .checks=${c}
          .anchor=${a?.id}
        ></joe-settings-rules>`;
			case "notify": return D`<joe-settings-notify
          .t=${t}
          .hass=${n}
          .state=${r}
          .prefix=${i}
          .route=${a}
          .info=${o}
          .discovery=${s}
          .checks=${c}
          .anchor=${a?.id}
        ></joe-settings-notify>`;
			case "maintenance": return D`<joe-settings-maintenance
          .t=${t}
          .hass=${n}
          .state=${r}
          .prefix=${i}
          .route=${a}
          .info=${o}
          .discovery=${s}
          .checks=${c}
          .anchor=${a?.id}
        ></joe-settings-maintenance>`;
			case "about": return D`<joe-settings-about
          .t=${t}
          .hass=${n}
          .state=${r}
          .prefix=${i}
          .route=${a}
          .info=${o}
          .discovery=${s}
          .checks=${c}
          .anchor=${a?.id}
        ></joe-settings-about>`;
		}
	}
};
d([b({ attribute: !1 })], Qu.prototype, "hass", void 0), d([b({ attribute: !1 })], Qu.prototype, "t", void 0), d([b({ attribute: !1 })], Qu.prototype, "state", void 0), d([b({ attribute: !1 })], Qu.prototype, "route", void 0), d([b({ attribute: !1 })], Qu.prototype, "prefix", void 0), d([b({ attribute: !1 })], Qu.prototype, "info", void 0), d([b({ attribute: !1 })], Qu.prototype, "discovery", void 0), d([b({ attribute: !1 })], Qu.prototype, "checks", void 0), u("joe-settings-page", Qu);
//#endregion
//#region src/energy-joe-panel.ts
var $u = [
	"simulation",
	"advisory",
	"live",
	"off"
], ed = {
	simulation: "mdi:pause",
	advisory: "mdi:comment-question-outline",
	live: "mdi:play",
	off: "mdi:power"
}, td = $u, nd = {
	overview: "mdi:view-dashboard-outline",
	plan: "mdi:weather-night",
	review: "mdi:history",
	devices: "mdi:power-plug-outline",
	household: "mdi:account-group-outline",
	settings: "mdi:cog-outline"
}, rd = [
	"overview",
	"devices",
	"household",
	"settings"
], id = ["action", "battery"], ad = [
	"devices",
	"household",
	"overview",
	"review"
], $ = class extends O {
	constructor() {
		super(), this.narrow = !1, this.failed = !1, this.modeDialog = !1, this.notice = "", this.discovering = !1, this.discoveryFailed = !1, this.checks = [], this.infoRequested = !1, this.adopted = !1, this.parsed = Se(""), this.climateRequested = !1, this.jumped = !1, this.addEventListener("joe-config", (e) => this.onConfig(e)), this.addEventListener("joe-pick", (e) => {
			this.picker = e.detail;
		}), this.addEventListener("joe-edit", (e) => {
			this.editor = e.detail;
		}), this.addEventListener("joe-navigate", (e) => this.onNavigate(e)), this.addEventListener("joe-mode-dialog", (e) => {
			e.stopPropagation(), this.modeDialog = !0;
		}), this.addEventListener("joe-climate-reload", (e) => {
			e.stopPropagation(), this.loadClimate();
		});
	}
	get t() {
		return be(this.hass?.language);
	}
	get base() {
		return this.route?.prefix ?? "/energy-joe";
	}
	get current() {
		return this.parsed.route;
	}
	connectedCallback() {
		super.connectedCallback(), fr(), this.subscribe();
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.unsubscribe?.then((e) => e()).catch(() => void 0), this.unsubscribe = void 0, this.headObserver?.disconnect(), this.headObserver = void 0;
	}
	willUpdate(e) {
		if (e.has("hass") && this.hass && (this.setAttribute("theme", this.hass.themes?.darkMode ? "dark" : "light"), this.subscribe(), this.infoRequested || (this.infoRequested = !0, this.hass.callWS({ type: "energy_joe/info" }).then((e) => {
			this.info = e;
		}).catch(() => void 0))), e.has("route") && this.route?.path !== this.lastPath) {
			let e = this.lastPath === void 0;
			if (this.lastPath = this.route?.path, !this.jumped) {
				let t = history.state?.joeScroll;
				(t !== void 0 || !e) && this.restoreScroll(t ?? 0);
			}
			this.jumped = !1;
			let t = this.parsed.route.tab;
			this.parsed = Se(this.route?.path ?? "");
			let { route: n, redirect: r } = this.parsed;
			r !== void 0 && this.go(r, { replace: !0 }), this.remember(n), n.tab !== t && this.joe?.onboarding.completed && (this.discoveryFailed = !1, this.climateFound || (this.climateRequested = !1));
		}
	}
	updated() {
		this.observeHead();
		let e = this.joe;
		e?.onboarding.completed && !this.climateRequested && ad.includes(this.current.tab) && this.loadClimate(), !(!e || this.discovering || this.discoveryFailed) && (!e.onboarding.completed && e.onboarding.step === "scan" && !this.adopted ? this.scan() : !this.discovery && (e.onboarding.completed ? rd.includes(this.current.tab) || id.includes(this.editor?.editor ?? "") : e.onboarding.step !== "welcome") && this.look());
	}
	async loadClimate() {
		if (this.hass) {
			this.climateRequested = !0;
			try {
				this.climateFound = await this.hass.callWS({ type: "energy_joe/climate/devices" });
			} catch {}
		}
	}
	observeHead() {
		let e = this.renderRoot.querySelector("header");
		if (!e || this.headObserver) return;
		let t = () => this.style.setProperty("--joe-head-h", `${e.getBoundingClientRect().height}px`);
		t(), this.headObserver = new ResizeObserver(t), this.headObserver.observe(e);
	}
	async scan() {
		if (this.hass && !this.discovering) {
			this.discovering = !0, this.discoveryFailed = !1;
			try {
				let e = await this.hass.callWS({ type: "energy_joe/adopt" });
				this.discovery = e.discovery, this.checks = e.checks, this.adopted = !0;
			} catch {
				this.discoveryFailed = !0;
			} finally {
				this.discovering = !1;
			}
		}
	}
	async look() {
		if (this.hass && !this.discovering) {
			this.discovering = !0;
			try {
				this.discovery = await this.hass.callWS({ type: "energy_joe/discover" }), await this.refreshChecks();
			} catch {
				this.discoveryFailed = !0;
			} finally {
				this.discovering = !1;
			}
		}
	}
	async refreshChecks() {
		try {
			let e = await this.hass?.callWS({ type: "energy_joe/check" });
			this.checks = e?.checks ?? [];
		} catch {}
	}
	onConfig(e) {
		e.stopPropagation(), e.detail.result = this.saveConfig(e.detail);
	}
	async saveConfig(e) {
		if (!this.hass) return !1;
		try {
			await this.hass.callWS({
				type: "energy_joe/config/update",
				patch: e.patch,
				source: e.source ?? "user"
			});
		} catch {
			return this.showNotice(this.t("error.action")), !1;
		}
		return this.refreshChecks(), e.patch.climate?.rooms && this.loadClimate(), !0;
	}
	subscribe() {
		this.hass && !this.unsubscribe && this.isConnected && (this.unsubscribe = this.hass.connection.subscribeMessage((e) => {
			this.joe = e, this.failed = !1;
		}, {
			type: "energy_joe/subscribe",
			language: this.hass.language
		}), this.unsubscribe.catch(() => {
			this.failed = !0, this.unsubscribe = void 0;
		}));
	}
	toggleSidebar() {
		this.dispatchEvent(new Event("hass-toggle-menu", {
			bubbles: !0,
			composed: !0
		}));
	}
	render() {
		let e = this.t;
		if (this.failed) return D`<main><joe-empty-state pose="puzzled" heading=${e("error.title")} text=${e("error.text")}></joe-empty-state></main>`;
		if (!this.joe) return D`<div class="loading">${e("loading")}</div>`;
		let t = !this.joe.onboarding.completed;
		return D`
      <header>
        ${this.joe.mode === "simulation" ? D`<div class="simband" aria-hidden="true"></div>` : j}
        <div class="bar">
          ${this.narrow || this.hass?.dockedSidebar === "always_hidden" ? D`<button class="menu" type="button" data-notip aria-label=${e("menu.sidebar")} @click=${this.toggleSidebar}>
                <ha-icon icon="mdi:menu"></ha-icon>
              </button>` : j}
          <div class="brand">
            <img class="light" src=${Ne("joe-head.webp")} alt="" width="36" height="36" />
            <img class="dark" src=${Ne("joe-head-dark.webp")} alt="" width="36" height="36" />
            <span class="wordmark">ENERGY <b>JOE</b></span>
          </div>
          ${t ? this.renderSteps(e) : this.renderTabs(e)}
          <joe-sim-switch
            data-notip
            .mode=${this.joe.mode}
            .t=${e}
            ?compact=${this.narrow}
            ?running=${!t}
            @joe-mode-switch=${this.onModeSwitch}
          ></joe-sim-switch>
        </div>
      </header>
      ${this.notice ? D`<div class="notice" role="alert">${this.notice}</div>` : j}
      <main
        @joe-onboarding=${this.onOnboarding}
        @joe-rediscover=${() => this.scan()}
        @joe-discovery=${(e) => this.discovery = e.detail}
      >
        ${t ? D`<joe-onboarding
              .step=${this.joe.onboarding.step}
              .t=${e}
              .info=${this.info}
              .hass=${this.hass}
              .config=${this.joe.config}
              .discovery=${this.discovery}
              .checks=${this.checks}
              .prefix=${this.base}
              ?discovering=${this.discovering}
              ?discoveryFailed=${this.discoveryFailed}
            ></joe-onboarding>` : this.renderPage(e)}
      </main>
      ${this.modeDialog ? this.renderModeDialog(e) : j} ${this.editor ? this.renderEditor(e) : j}
      ${this.picker ? this.renderPicker(e) : j}
    `;
	}
	renderTabs(e) {
		let t = this.current.tab;
		return D`<nav class="tabs" aria-label=${e("nav.label")} lang=${e.lang}>
      ${ce.map((n, r) => {
			let i = this.tabPath(n), a = r > 0 && xe.includes(ce[r - 1]) && !xe.includes(n);
			return D`${a ? D`<span class="gap" aria-hidden="true"></span>` : j}<a
            href=${E(this.base, i)}
            class=${n === t ? "on" : ""}
            aria-current=${n === t ? "page" : "false"}
            @click=${C(i)}
            ><ha-icon icon=${nd[n]}></ha-icon><span class="label">${e(`tab.${n}`)}</span></a
          >`;
		})}
    </nav>`;
	}
	tabPath(e) {
		let t = this.current;
		if (e === t.tab) return ue({
			tab: e,
			section: t.section
		});
		let n = null;
		try {
			n = sessionStorage.getItem(`joe.last.${e}`);
		} catch {}
		let r = e === "overview" ? "/" : `/${e}`;
		return n && (n === r || n.startsWith(`${r}/`)) ? n : ue({ tab: e });
	}
	remember(e) {
		try {
			sessionStorage.setItem(`joe.last.${e.tab}`, ue({
				tab: e.tab,
				section: e.section,
				id: e.id
			}));
		} catch {}
	}
	renderSteps(e) {
		let t = In.indexOf(this.joe?.onboarding.step ?? "welcome");
		return D`<ol class="steps" aria-label=${e("steps.label")}>
      ${In.map((n, r) => D`<li class=${r < t ? "done" : r === t ? "on" : ""} aria-current=${r === t ? "step" : "false"}>
            ${r + 1} ${e(`step.${n}`)}
          </li>`)}
    </ol>`;
	}
	renderPage(e) {
		let t = this.current, n = this.base;
		switch (t.tab) {
			case "overview": return D`<joe-overview
          .t=${e}
          .hass=${this.hass}
          .state=${this.joe}
          .prefix=${n}
          .route=${t}
          .climateFound=${this.climateFound}
          .discovery=${this.discovery}
          .checks=${this.checks}
          .devices=${this.devices(e)}
          .info=${this.info}
        ></joe-overview>`;
			case "plan": return D`<joe-plan-page
          .t=${e}
          .hass=${this.hass}
          .state=${this.joe}
          .prefix=${n}
          .route=${t}
          .devices=${this.devices(e)}
        ></joe-plan-page>`;
			case "review": return D`<joe-lookback-page
          .t=${e}
          .hass=${this.hass}
          .state=${this.joe}
          .prefix=${n}
          .route=${t}
          .climateFound=${this.climateFound}
        ></joe-lookback-page>`;
			case "devices": return D`<joe-devices-page
          .t=${e}
          .hass=${this.hass}
          .state=${this.joe}
          .prefix=${n}
          .route=${t}
          .discovery=${this.discovery}
          .info=${this.info}
          .checks=${this.checks}
          .climateFound=${this.climateFound}
        ></joe-devices-page>`;
			case "household": return D`<joe-household-page
          .t=${e}
          .hass=${this.hass}
          .state=${this.joe}
          .prefix=${n}
          .route=${t}
          .discovery=${this.discovery}
          .info=${this.info}
          .checks=${this.checks}
          .climateFound=${this.climateFound}
        ></joe-household-page>`;
			case "settings": return D`<joe-settings-page
          .t=${e}
          .hass=${this.hass}
          .state=${this.joe}
          .prefix=${n}
          .route=${t}
          .info=${this.info}
          .discovery=${this.discovery}
          .checks=${this.checks}
        ></joe-settings-page>`;
		}
	}
	devices(e) {
		let t = this.joe;
		if (!t) return [];
		let n = [
			e,
			t,
			this.hass,
			this.climateFound,
			this.discovery,
			this.checks
		], r = this.deviceCache;
		if (!r || n.some((e, t) => e !== r.inputs[t])) {
			let r = dt(e, t, this.hass, {
				climateFound: this.climateFound,
				discovery: this.discovery,
				checks: this.checks
			});
			this.deviceCache = {
				inputs: n,
				devices: r
			};
		}
		return this.deviceCache.devices;
	}
	renderModeDialog(e) {
		let t = this.joe?.mode ?? "simulation";
		return D`<div class="scrim" @click=${this.closeDialog}>
      <div
        class="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mode-title"
        @click=${(e) => e.stopPropagation()}
        @keydown=${(e) => e.key === "Escape" && this.closeDialog()}
      >
        <joe-pose name="lever"></joe-pose>
        <div data-tipped>
          <div id="mode-title">${y(e("mode.dialog.title"), "h2", l(e, "mode"))}</div>
          ${M}
          ${this.renderReadiness(e)}
          <div class="modes" role="group" aria-labelledby="mode-title">
            ${$u.map((n) => {
			let r = td.includes(n);
			return D`<button
                type="button"
                class="mode ${n}"
                aria-pressed=${String(n === t)}
                ?disabled=${!r}
                @click=${() => this.chooseMode(n)}
              >
                <span class="knob"><ha-icon icon=${ed[n]}></ha-icon></span>
                <span class="label">
                  <b>${e(`mode.${n}`)}</b>
                  <small>${e(`mode.${n}.desc`)}</small>
                </span>
                ${n === t ? D`<span class="chip ok"><ha-icon icon="mdi:check"></ha-icon>${e("mode.current")}</span>` : r ? j : D`<span class="chip soon">${e("mode.soon")}</span>`}
              </button>`;
		})}
          </div>
        </div>
        <div class="actions">
          <button type="button" class="btn btn-secondary" data-notip @click=${this.closeDialog} autofocus>
            ${e("mode.close")}
          </button>
        </div>
      </div>
    </div>`;
	}
	renderReadiness(e) {
		let t = this.joe, n = t?.control?.ready ?? {}, r = (t?.config.batteries ?? []).filter((e) => n[e.id] && n[e.id] !== "not_controllable");
		if (!r.length) return j;
		let i = r.filter((e) => n[e.id] !== "ready");
		if (!i.length) return j;
		let a = i.length === r.length ? e("mode.none_tested") : e("mode.untested", { names: i.map((e) => e.name).join(", ") }), o = {
			tab: "devices",
			section: "battery"
		}, s = C(o);
		return D`<div class="note warn readiness">
      <ha-icon icon="mdi:alert-outline"></ha-icon>
      <div>
        <span>${a}</span>
        <a
          class="mini-btn go"
          href=${E(this.base, o)}
          @click=${(e) => {
			s(e), e.defaultPrevented && (this.modeDialog = !1);
		}}
          >${e("mode.to_batteries")}</a
        >
      </div>
    </div>`;
	}
	renderEditor(e) {
		let t = this.editor, n = this.joe?.config, r = () => {
			this.editor = void 0;
		}, i = D``, a = "", o = !1;
		switch (t?.editor) {
			case "battery":
				a = e("edit.battery.label"), o = !0, i = D`<joe-battery-editor
          .hass=${this.hass}
          .t=${e}
          .config=${n}
          .discovery=${this.discovery}
          .info=${this.info}
          .floor=${this.joe?.floors?.[t.id ?? ""]}
          batteryId=${t.id ?? ""}
        ></joe-battery-editor>`;
				break;
			case "action":
				a = e("action.label"), i = D`<joe-action-editor
          .hass=${this.hass}
          .mailboxes=${this.joe?.mailbox}
          .accounts=${this.joe?.accounts}
          .apps=${this.joe?.apps}
          .t=${e}
          .config=${n}
          .discovery=${this.discovery}
          actionId=${t.id ?? ""}
          section=${t.focus ?? ""}
          consumer=${t.consumer ?? ""}
          .prefix=${this.base}
        ></joe-action-editor>`;
				break;
			case "consumers": a = e("edit.consumers.label"), o = !0, i = D`<div class="sheet-title">${y(e("edit.consumers.title"))}</div>
          <joe-consumer-list .hass=${this.hass} .t=${e} .config=${n}></joe-consumer-list>
          <div class="actions">
            <button type="button" class="btn btn-secondary" data-notip @click=${r}>${e("mode.close")}</button>
          </div>`;
		}
		return D`<joe-sheet
      label=${a}
      closeLabel=${e("common.close")}
      ?wide=${o}
      @joe-close=${r}
      @joe-navigate=${(e) => {
			r(), this.onNavigate(e);
		}}
    >
      ${i}
    </joe-sheet>`;
	}
	renderPicker(e) {
		let t = this.picker, n = (e) => {
			t?.resolve(e), this.picker = void 0;
		};
		return D`<joe-sheet
      label=${t?.request.heading.replace(/\|/g, "") ?? ""}
      closeLabel=${e("common.close")}
      @joe-close=${() => n(null)}
      @joe-picked=${(e) => n(e.detail)}
    >
      <joe-entity-picker .hass=${this.hass} .t=${e} .request=${t?.request}></joe-entity-picker>
    </joe-sheet>`;
	}
	onModeSwitch() {
		this.modeDialog = !0;
	}
	chooseMode(e) {
		this.modeDialog = !1, e !== this.joe?.mode && this.setMode(e);
	}
	closeDialog() {
		this.modeDialog = !1;
	}
	async setMode(e) {
		try {
			await this.hass?.callWS({
				type: "energy_joe/set_mode",
				mode: e
			});
		} catch {
			this.showNotice(this.t("error.action"));
		}
	}
	async onOnboarding(e) {
		let { to: t, ...n } = e.detail;
		n.step === "welcome" && (this.adopted = !1, this.discoveryFailed = !1);
		try {
			await this.hass?.callWS({
				type: "energy_joe/onboarding",
				...n
			}), n.completed && this.go(t ?? "/");
		} catch {
			this.showNotice(this.t("error.action"));
		}
	}
	showNotice(e) {
		this.notice = e, window.setTimeout(() => {
			this.notice = "";
		}, 5e3);
	}
	onNavigate(e) {
		e.stopPropagation();
		let { path: t, page: n, replace: r, sheet: i } = e.detail;
		this.go(t ?? (n && n !== "overview" ? `/${n}` : "/"), {
			replace: r,
			sheet: i
		});
	}
	go(e, t = {}) {
		let n = Se(e).redirect ?? ue(e), r = E(this.base, n);
		if (!t.replace && location.pathname === r) {
			this.scrollTop = 0;
			return;
		}
		t.replace || history.replaceState({
			...history.state ?? {},
			joeScroll: this.scrollTop
		}, ""), this.jumped = !0, history[t.replace ? "replaceState" : "pushState"](t.sheet ? { joeSheet: !0 } : null, "", r), window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: !!t.replace } }));
		let i = Se(n).route, a = i.tab === "devices" && i.section !== "grid" && i.section !== "add" && !i.sub;
		!t.sheet && (!i.id || a) && (this.scrollTop = 0);
	}
	restoreScroll(e) {
		let t = 0, n = () => {
			this.scrollTop = e, Math.abs(this.scrollTop - e) > 2 && t++ < 12 && window.setTimeout(n, 150);
		};
		requestAnimationFrame(n);
	}
	static {
		this.styles = [
			Te,
			k,
			w`
      :host {
        display: block;
        height: 100%;
        overflow-y: auto;
        background: var(--joe-bg);
        color: var(--joe-ink);
        font-size: 15px;
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
      }
      header {
        position: sticky;
        top: 0;
        z-index: 2;
        background: var(--joe-surface);
        box-shadow: 0 1px 0 var(--joe-line);
      }
      .simband {
        height: 6px;
        background: repeating-linear-gradient(-45deg, var(--joe-stripe-a) 0 10px, var(--joe-stripe-b) 10px 20px);
      }
      .bar {
        display: flex;
        align-items: center;
        gap: 10px 18px;
        padding: 10px 20px;
        min-height: 64px;
      }
      .menu {
        display: grid;
        place-items: center;
        width: 44px;
        height: 44px;
        margin-left: -8px;
        border: 0;
        border-radius: 50%;
        background: none;
        color: var(--joe-ink);
        cursor: pointer;
      }
      .menu:hover {
        background: var(--joe-line);
      }
      .menu:focus-visible {
        outline: 3px solid var(--joe-amber);
        outline-offset: 2px;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: none;
      }
      .brand img {
        width: 36px;
        height: 36px;
      }
      .brand .light {
        display: var(--joe-show-light);
      }
      .brand .dark {
        display: var(--joe-show-dark);
      }
      .wordmark {
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 800;
        font-size: 22px;
        line-height: 1;
        letter-spacing: 0.01em;
        white-space: nowrap;
      }
      .wordmark b {
        color: var(--joe-amber);
        font-weight: 800;
      }
      .tabs {
        display: flex;
        align-items: center;
        gap: 4px;
        flex: 1;
        min-width: 0;
        overflow-x: auto;
        scrollbar-width: none;
      }
      .tabs .gap {
        flex: none;
        align-self: stretch;
        width: 13px;
        margin: 8px 0;
        background: linear-gradient(var(--joe-line-2), var(--joe-line-2)) center / 1.5px 100% no-repeat;
      }
      .tabs a {
        position: relative;
        isolation: isolate;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        min-height: 44px;
        padding: 0 12px;
        border-radius: 7px;
        font-weight: 600;
        font-size: 15px;
        color: var(--joe-ink-2);
        text-decoration: none;
        white-space: nowrap;
        transition: color 0.12s, background 0.12s;
      }
      .tabs a ha-icon {
        --mdc-icon-size: 18px;
      }
      .tabs a:hover {
        background: var(--joe-surface-2);
        color: var(--joe-ink);
      }
      .tabs a:active {
        transform: scale(0.97);
      }
      .tabs a.on {
        color: var(--joe-amber-ink);
        background: transparent;
      }
      .tabs a.on::before {
        content: "";
        position: absolute;
        inset: 3px 0;
        background: var(--joe-amber);
        transform: skewX(-10deg);
        border-radius: 6px;
        z-index: -1;
      }
      .steps {
        display: flex;
        gap: 6px;
        flex: 1;
        justify-content: center;
        flex-wrap: wrap;
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .steps li {
        position: relative;
        isolation: isolate;
        padding: 6px 14px;
        font-size: 13px;
        font-weight: 700;
        color: var(--joe-muted);
        white-space: nowrap;
      }
      .steps li::before {
        content: "";
        position: absolute;
        inset: 0;
        transform: skewX(-10deg);
        border-radius: 5px;
        background: var(--joe-surface-2);
        z-index: -1;
      }
      .steps li.done {
        color: var(--joe-ink);
      }
      .steps li.done::before {
        background: var(--joe-amber-soft);
      }
      .steps li.on {
        color: var(--joe-amber-ink);
      }
      .steps li.on::before {
        background: var(--joe-amber);
      }
      joe-sim-switch {
        margin-left: auto;
        flex: none;
      }
      main {
        padding: 24px 20px 48px;
      }
      .loading {
        display: grid;
        place-items: center;
        min-height: 60vh;
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 700;
        font-size: 22px;
        color: var(--joe-muted);
      }
      .notice {
        margin: 12px 20px 0;
        padding: 10px 14px;
        border-radius: 10px;
        background: var(--joe-crit-soft);
        color: var(--joe-crit);
        font-weight: 600;
      }
      .scrim {
        position: fixed;
        inset: 0;
        z-index: 10;
        display: grid;
        place-items: center;
        padding: 16px;
        background: rgba(7, 17, 24, 0.55);
      }
      .sheet {
        width: min(520px, 100%);
        max-height: calc(100% - 32px);
        overflow-y: auto;
        background: var(--joe-surface);
        border-radius: 18px;
        padding: 22px;
        box-shadow: var(--joe-shadow);
      }
      .sheet joe-pose {
        max-width: 300px;
        margin: 0 auto 8px;
      }
      .sheet .display {
        font-size: 40px;
      }
      .modes {
        display: grid;
        gap: 8px;
        margin-top: 16px;
      }
      .mode {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        min-height: 60px;
        padding: 8px 12px 8px 8px;
        border: 0;
        border-radius: 14px;
        cursor: pointer;
        text-align: left;
        background: var(--joe-surface-2);
        color: var(--joe-ink);
        transition: background 0.12s, box-shadow 0.12s, transform 0.12s;
      }
      .mode:hover:not([disabled]) {
        background: var(--joe-line);
      }
      .mode:active:not([disabled]) {
        transform: scale(0.98);
      }
      .mode[aria-pressed="true"],
      .mode[aria-pressed="true"]:hover {
        background: var(--joe-amber-soft);
        box-shadow: inset 0 0 0 2px var(--joe-amber);
      }
      .mode[disabled] {
        cursor: not-allowed;
        opacity: 0.6;
      }
      .readiness {
        margin-top: 14px;
      }
      .readiness .mini-btn {
        display: flex;
        width: fit-content;
        margin-top: 10px;
        text-decoration: none;
      }
      .mode .knob {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        flex: none;
        background: #071118;
        color: #fea707;
      }
      .mode.simulation .knob {
        background: repeating-linear-gradient(-45deg, var(--joe-stripe-a) 0 8px, var(--joe-stripe-b) 8px 16px);
        color: #071118;
        box-shadow: inset 0 0 0 2px #071118;
      }
      .mode.live .knob {
        background: var(--joe-good);
        color: #ffffff;
      }
      .mode.advisory .knob {
        background: var(--joe-amber);
        color: #071118;
        box-shadow: inset 0 0 0 2px #071118;
      }
      .mode.off .knob {
        background: var(--joe-ink-2);
        color: var(--joe-surface);
      }
      .mode .label {
        flex: 1;
        min-width: 0;
      }
      .mode b {
        display: block;
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 800;
        font-size: 20px;
        letter-spacing: 0.03em;
        line-height: 1.05;
        text-transform: uppercase;
      }
      .mode small {
        display: block;
        font-size: 13.5px;
        color: var(--joe-ink-2);
        line-height: 1.35;
        margin-top: 2px;
      }
      /* Six tabs with icons need the whole width below the brand. */
      @media (max-width: 1100px) {
        .bar {
          flex-wrap: wrap;
        }
        .tabs {
          order: 3;
          flex-basis: 100%;
        }
      }
      @media (max-width: 760px) {
        .bar {
          flex-wrap: wrap;
          padding: 8px 12px;
        }
        .tabs,
        .steps {
          order: 3;
          flex-basis: 100%;
          justify-content: flex-start;
        }
        .steps {
          flex-wrap: nowrap;
          overflow-x: auto;
        }
        main {
          padding: 16px 16px 40px;
        }
      }
      /* Phone: six equal columns, icon over a short label, no sideways scrolling. */
      @media (max-width: 600px) {
        .bar {
          row-gap: 4px;
          padding-bottom: 0;
        }
        .tabs {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr)) 6px repeat(3, minmax(0, 1fr));
          /* All tabs as tall as the tallest, icons on one line even if a label breaks. */
          align-items: stretch;
          gap: 0;
          margin: 0 -8px;
          overflow: visible;
        }
        .tabs .gap {
          width: auto;
          margin: 12px 0;
        }
        .tabs a {
          flex-direction: column;
          justify-content: flex-start;
          gap: 2px;
          min-width: 0;
          min-height: 52px;
          padding: 7px 0 6px;
          border-radius: 0;
          font-family: var(--joe-display);
          font-size: 12px;
          font-weight: 700;
          line-height: 1.1;
          text-align: center;
        }
        .tabs a ha-icon {
          --mdc-icon-size: 20px;
        }
        /* A long word ("Einstellungen") breaks with a hyphen on the smallest phones. */
        .tabs a .label {
          max-width: 100%;
          white-space: normal;
          -webkit-hyphens: auto;
          hyphens: auto;
          overflow-wrap: anywhere;
        }
        .tabs a.on::before {
          inset: 2px 2px 3px;
        }
      }
      /* The smallest phones: a little tighter, so "Einstellungen" stays on one line. */
      @media (max-width: 340px) {
        .tabs a {
          font-size: 11px;
          letter-spacing: -0.02em;
        }
      }
    `
		];
	}
};
d([b({ attribute: !1 })], $.prototype, "hass", void 0), d([b({
	type: Boolean,
	reflect: !0
})], $.prototype, "narrow", void 0), d([b({ attribute: !1 })], $.prototype, "route", void 0), d([T()], $.prototype, "joe", void 0), d([T()], $.prototype, "info", void 0), d([T()], $.prototype, "failed", void 0), d([T()], $.prototype, "modeDialog", void 0), d([T()], $.prototype, "notice", void 0), d([T()], $.prototype, "discovery", void 0), d([T()], $.prototype, "discovering", void 0), d([T()], $.prototype, "discoveryFailed", void 0), d([T()], $.prototype, "checks", void 0), d([T()], $.prototype, "picker", void 0), d([T()], $.prototype, "editor", void 0), d([T()], $.prototype, "climateFound", void 0), u("energy-joe-panel", $);
//#endregion
export { $ as EnergyJoePanel };
