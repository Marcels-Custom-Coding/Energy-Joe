import { $ as e, A as t, B as n, C as r, D as i, E as a, F as o, G as s, H as c, I as l, J as u, K as d, L as f, M as p, N as m, O as h, P as g, Q as _, R as v, S as ee, T as te, U as y, V as ne, W as re, X as b, Y as ie, Z as ae, _ as oe, a as se, at as x, b as S, c as ce, ct as C, d as w, dt as T, et as E, f as D, g as le, h as ue, i as de, it as O, j as fe, k as pe, l as k, lt as me, m as he, n as ge, nt as _e, o as ve, ot as A, p as ye, q as j, r as M, rt as N, s as be, st as xe, t as Se, tt as Ce, u as we, ut as Te, v as Ee, w as De, x as Oe, y as ke, z as Ae } from "./tokens-DdTZAFJc.js";
//#region src/assets.ts
var je = import.meta.url.replace(/[^/]*$/, ""), Me = (e) => `${je}${e}`, Ne = /* @__PURE__ */ new Set(["welcome"]), Pe = /* @__PURE__ */ new Set([
	"night-charge",
	"sleep",
	"learn"
]), Fe = "thumbs", Ie = class extends x {
	constructor(...e) {
		super(...e), this.name = "", this.alt = "";
	}
	static {
		this.styles = T`
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
		let e = Pe.has(this.name) ? "scene" : "";
		if (this.name === Fe) return C`<img class="light" src=${Me("logo.webp")} alt=${this.alt} decoding="async" /><img
          class="dark"
          src=${Me("logo-dark.webp")}
          alt=${this.alt}
          decoding="async"
        />`;
		let t = Me(`poses/${this.name}.webp`);
		return Ne.has(this.name) ? C`<img class="light" src=${t} alt=${this.alt} decoding="async" /><img
        class="dark"
        src=${Me(`poses/${this.name}-dark.webp`)}
        alt=${this.alt}
       
        decoding="async"
      />` : C`<img class=${e} src=${t} alt=${this.alt} decoding="async" />`;
	}
};
s([O()], Ie.prototype, "name", void 0), s([O()], Ie.prototype, "alt", void 0), j("joe-pose", Ie);
//#endregion
//#region src/components/empty-state.ts
var Le = class extends x {
	constructor(...e) {
		super(...e), this.pose = "", this.heading = "", this.text = "", this.note = "";
	}
	static {
		this.styles = [d, T`
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
		return C`<div class="wrap">
      <joe-pose name=${this.pose}></joe-pose>
      <div>
        ${b(this.heading)} ${E}
        <p class="lead">${this.text}</p>
        ${this.note ? C`<div class="note"><span class="chip soon">${this.note}</span></div>` : A}
        <slot></slot>
      </div>
    </div>`;
	}
};
s([O()], Le.prototype, "pose", void 0), s([O()], Le.prototype, "heading", void 0), s([O()], Le.prototype, "text", void 0), s([O()], Le.prototype, "note", void 0), j("joe-empty-state", Le);
//#endregion
//#region src/components/entity-picker.ts
var Re = 60, ze = class extends x {
	constructor(...e) {
		super(...e), this.selected = [], this.invert = !1, this.query = "", this.showAll = !1, this.limit = Re;
	}
	static {
		this.styles = [d, T`
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
		e.has("request") && this.request && (this.selected = [...this.request.selected], this.invert = this.request.measurement?.invert ?? !1, this.query = "", this.showAll = !1, this.limit = Re);
	}
	render() {
		let { hass: e, t, request: n } = this;
		if (!e || !t || !n) return A;
		let r = this.candidates(e, n), i = r.slice(0, this.limit), a = this.query ? [] : (n.suggestions ?? []).filter((t) => e.states[t.entity_id]);
		return C`<div data-tipped>
      <div class="sheet-title">${b(n.heading, "h2", o(t, n.tip))}</div>
      <input
        class="input search"
        type="search"
        .value=${this.query}
        placeholder=${t("pick.search")}
        aria-label=${t("pick.search")}
        @input=${(e) => {
			this.query = e.target.value, this.limit = Re;
		}}
      />
      ${a.length ? C`<div class="group-label">${t("pick.suggested")}</div>
            <ul>
              ${a.map((r) => this.renderRow(e, t, n, r.entity_id, r))}
            </ul>` : A}
      <div class="group-label">${t(this.showAll ? "pick.all" : "pick.fitting")} · ${r.length}</div>
      ${r.length ? C`<ul>
            ${i.map((r) => this.renderRow(e, t, n, r))}
          </ul>` : C`<p class="empty">${t("pick.empty")}</p>`}
      ${r.length > i.length ? C`<button type="button" class="mini-btn more" data-notip @click=${() => this.limit += Re}>
            ${t("pick.more", { count: r.length - i.length })}
          </button>` : A}
      <div class="line">
        <button
          type="button"
          id="all"
          class="switch"
          role="switch"
          aria-checked=${String(this.showAll)}
          aria-labelledby="all-label"
          @click=${() => {
			this.showAll = !this.showAll, this.limit = Re;
		}}
        ></button>
        <label id="all-label" for="all">${t("pick.show_all")}</label>
        ${o(t, "pick_all")}
      </div>
      ${n.measurement ? this.renderInvert(e, t, n) : A}
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
		let n = this.query.toLowerCase().split(/\s+/).filter(Boolean), r = new Set(t.exclude ?? []), i = [];
		for (let [a, o] of Object.entries(e.states)) {
			if (r.has(a) || !this.showAll && (!Ae(o, t.filter) || e.entities?.[a]?.hidden)) continue;
			let s = f(e, a);
			if (n.length) {
				let t = `${s} ${a} ${v(e, a)}`.toLowerCase();
				if (!n.every((e) => t.includes(e))) continue;
			}
			i.push({
				id: a,
				name: s
			});
		}
		return i.sort((e, t) => e.name.localeCompare(t.name, this.t?.lang)), i.map((e) => e.id);
	}
	renderRow(e, t, n, r, i) {
		let a = this.selected.includes(r), o = v(e, r), s = i?.reasons?.[0];
		return C`<li>
      <button type="button" class="row" aria-pressed=${String(a)} @click=${() => this.toggle(r)}>
        <span class="mark ${n.multiple ? "box" : ""}" aria-hidden="true">
          ${a ? C`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>` : A}
        </span>
        <span class="txt">
          <b>${f(e, r)}</b>
          <small>${o ? `${o} · ` : ""}${r}</small>
          ${s ? C`<small class="why">${_(t, s)}</small>` : A}
        </span>
        <span class="end">
          <span class="val">${ne(e, r, t.lang)}</span>
          ${i?.confidence == null ? A : u(t, i.confidence)}
        </span>
      </button>
    </li>`;
	}
	renderInvert(e, t, r) {
		let i = r.measurement?.role ?? "grid", a = this.selected[0], s = a ? c(e, {
			entity_id: a,
			invert: this.invert,
			minus_entity_id: null
		}) : null, l = "";
		if (s !== null) {
			let e = n(t.lang, Math.abs(s), 2);
			l = i === "grid" ? t(s >= 0 ? "pick.preview.import" : "pick.preview.export", { value: e }) : i === "battery" ? t(s >= 0 ? "pick.preview.charge" : "pick.preview.discharge", { value: e }) : t(s >= -.05 ? `pick.preview.${i}` : "pick.preview.negative", { value: n(t.lang, s, 2) });
		}
		return C`<div class="line">
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
        ${o(t, i === "battery" ? "pick_invert_battery" : "pick_invert")}
      </div>
      ${l ? C`<div class="note preview"><ha-icon icon="mdi:eye-outline"></ha-icon><span>${l}</span></div>` : A}`;
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
s([O({ attribute: !1 })], ze.prototype, "hass", void 0), s([O({ attribute: !1 })], ze.prototype, "t", void 0), s([O({ attribute: !1 })], ze.prototype, "request", void 0), s([N()], ze.prototype, "selected", void 0), s([N()], ze.prototype, "invert", void 0), s([N()], ze.prototype, "query", void 0), s([N()], ze.prototype, "showAll", void 0), s([N()], ze.prototype, "limit", void 0), j("joe-entity-picker", ze);
//#endregion
//#region src/components/sheet.ts
var Be = class extends x {
	constructor(...e) {
		super(...e), this.label = "", this.closeLabel = "", this.wide = !1, this.onScrim = (e) => {
			e.composedPath()[0] === this && this.close();
		};
	}
	static {
		this.styles = T`
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
		return C`<div
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
s([O()], Be.prototype, "label", void 0), s([O()], Be.prototype, "closeLabel", void 0), s([O({
	type: Boolean,
	reflect: !0
})], Be.prototype, "wide", void 0), s([_e(".panel")], Be.prototype, "panel", void 0), j("joe-sheet", Be);
//#endregion
//#region src/components/sim-switch.ts
var Ve = {
	simulation: "mdi:pause",
	advisory: "mdi:comment-question-outline",
	live: "mdi:play",
	off: "mdi:power"
}, He = class extends x {
	constructor(...e) {
		super(...e), this.mode = "simulation", this.compact = !1, this.running = !1;
	}
	static {
		this.styles = T`
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
		return e ? C`<button
      type="button"
      class="${this.mode}${this.running ? " running" : ""}"
      aria-label=${e("mode.switch.label")}
      @click=${this.toggle}
    >
      <span class="knob"><ha-icon icon=${Ve[this.mode]}></ha-icon></span>
      <span>
        <b>${e(`mode.${this.mode}`)}</b>
        ${this.compact ? A : C`<small>${e(`mode.${this.mode}.sub`)}</small>`}
      </span>
    </button>` : A;
	}
	toggle() {
		this.dispatchEvent(new CustomEvent("joe-mode-switch", {
			bubbles: !0,
			composed: !0
		}));
	}
};
s([O()], He.prototype, "mode", void 0), s([O({ type: Boolean })], He.prototype, "compact", void 0), s([O({ type: Boolean })], He.prototype, "running", void 0), s([O({ attribute: !1 })], He.prototype, "t", void 0), j("joe-sim-switch", He);
//#endregion
//#region src/components/texts.ts
function Ue(e, t) {
	return t == null ? "–" : n(e.lang, t * 100, 2);
}
function We(e, t, n = !0) {
	let r;
	return r = t.kind === "fixed_window" && t.window ? t.night_price == null && t.day_price == null ? e("tariff.window_only", {
		start: t.window.start,
		end: t.window.end
	}) : e("find.tariff.window", {
		start: t.window.start,
		end: t.window.end,
		night: Ue(e, t.night_price),
		day: Ue(e, t.day_price)
	}) : t.kind === "dynamic" ? t.night_price != null && t.day_price != null ? e("find.tariff.dynamic", {
		night: Ue(e, t.night_price),
		day: Ue(e, t.day_price)
	}) : e("tariff.dynamic") : t.kind === "flat" ? t.day_price == null ? e("tariff.flat") : e("find.tariff.flat", { day: Ue(e, t.day_price) }) : e("find.tariff.unknown"), n && t.feed_in_price != null && (r += ` · ${e("find.tariff.feedin", { price: Ue(e, t.feed_in_price) })}`), r;
}
function Ge(e, t) {
	let r = {};
	for (let [i, a] of Object.entries(t)) typeof a == "number" ? r[i] = n(e.lang, a, 2) : typeof a == "string" && (r[i] = a);
	typeof t.role == "string" && (r.role = e.optional(`role.${t.role}`) ?? t.role);
	let i = `check.${t.code}`;
	return t.code === "grid_sign" && typeof t.expected == "number" && typeof t.actual == "number" && (i = t.expected < 0 ? "check.grid_sign.export" : "check.grid_sign.import", r.expected = n(e.lang, Math.abs(t.expected), 1), r.actual = n(e.lang, Math.abs(t.actual), 1)), e.optional(i, r) ?? t.code;
}
//#endregion
//#region src/config.ts
var Ke = /\[[^\]]*\]|[^.[]+/g;
function qe(e) {
	let t = [], n = "";
	for (let r of e.match(Ke) ?? []) n = !n || r.startsWith("[") ? n + r : `${n}.${r}`, t.push(n);
	return t.reverse();
}
function P(e, t) {
	for (let n of qe(t)) {
		let t = e.provenance[n];
		if (t) return t;
	}
}
function F(e, t) {
	return e.answers.ignored.includes(t);
}
function Je(e, t, n) {
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
function Ye(e, t = []) {
	let n = /* @__PURE__ */ new Set(), r = [];
	for (let i of [...e, ...t.map((e) => ({ entity_id: e.entity_id }))]) n.has(i.entity_id) || (n.add(i.entity_id), r.push(i));
	return r;
}
function Xe(e) {
	return {
		entity_id: e.entity.entity_id,
		confidence: e.confidence,
		reasons: e.reasons
	};
}
//#endregion
//#region src/device-model.ts
var Ze = [
	"battery",
	"climate",
	"car",
	"hot_water",
	"other",
	"grid"
], Qe = {
	battery: "mdi:home-battery-outline",
	climate: "mdi:thermostat",
	car: "mdi:car-electric",
	hot_water: "mdi:water-boiler",
	other: "mdi:power-plug-outline",
	grid: "mdi:transmission-tower"
}, $e = /(^|[^\p{L}\d])(e-?auto|auto|car|ev|wallbox)([^\p{L}\d]|$)/iu;
function et(e) {
	if (e.id.startsWith("hot_water_")) return "hot_water";
	if (e.id.startsWith("ev_")) return "car";
	if (e.id.startsWith("custom_")) return "other";
}
function tt(e, t) {
	if (e.kind === "target") return "hot_water";
	if (e.point != null || t?.kind === "ev") return "car";
	if (t?.kind === "hot_water") return "hot_water";
	let n = et(e);
	return n === "hot_water" || n === "car" ? n : !t && !n && $e.test(`${e.id} ${e.name}`) ? "car" : "other";
}
function nt(e, t) {
	let n = t.consumer_id ? e.consumers.find((e) => e.id === t.consumer_id) : void 0, r = tt(t, n);
	return r === "car" ? {
		group: r,
		id: `point:${t.id}`
	} : r === "other" ? n && n.kind !== "climate" && e.actions.find((e) => e.consumer_id === n.id && tt(e, n) === "other")?.id === t.id ? {
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
	return e.group === "car" && e.id.startsWith("point:") ? fe(e.id.slice(6)) : {
		tab: "devices",
		section: e.group,
		id: e.id
	};
}
function rt(e, t) {
	return {
		tab: "devices",
		section: "add",
		id: e,
		sub: e ? t : void 0
	};
}
function it(e, t, n) {
	if (!e) return;
	let r = n ? e.entities?.[n] : void 0, i = t ?? r?.device_id ?? void 0, a = r?.area_id ?? (i ? e.devices?.[i]?.area_id : void 0);
	return a ? e.areas?.[a]?.name : void 0;
}
function at(e, t) {
	return (t ? e?.entities?.[t]?.device_id : void 0) ?? void 0;
}
function ot(e, t) {
	return at(e, t.power_entity) ?? at(e, t.energy_entity);
}
function st(e, t) {
	let n = t.filter((e) => !!e);
	return {
		...e,
		problems: n,
		problem: n[0]
	};
}
function ct(e, t) {
	return t ? e.optional(`devices.problem.${t}`) ?? t : void 0;
}
function lt(e) {
	return e.level === "warn" || e.code === "tariff_unknown" || e.code === "missing" && e.role === "grid_power";
}
function ut(e, t, n, r = {}) {
	let i = t.config, a = t.control, o = (r.checks ?? []).filter(lt), s = [];
	for (let t of i.batteries) {
		let r = t.adapter !== "none", i = a?.ready[t.id], c = t.device_id ?? at(n, t.soc_entity);
		s.push(st({
			group: "battery",
			id: t.id,
			name: t.name,
			area: it(n, c, t.soc_entity),
			icon: Qe.battery,
			deviceId: c,
			entityId: t.soc_entity,
			role: r ? "steers" : "watches",
			battery: t
		}, [
			...o.filter((e) => e.battery_id === t.id).map((t) => Ge(e, t)),
			r ? ct(e, a?.batteries[t.id]?.problem) : void 0,
			r && i && i !== "ready" && i !== "not_controllable" ? ct(e, i === "outdated" ? "not_tested" : i) : void 0
		]));
	}
	let c = i.climate?.rooms ?? {}, l = r.climateFound?.devices, u = l ? l.map((e) => e.entity_id) : Object.keys(c);
	for (let e of Object.keys(c)) u.includes(e) || u.push(e);
	let d = i.consumers.filter((e) => e.kind === "climate"), p = /* @__PURE__ */ new Set();
	for (let r of u) {
		let i = l?.find((e) => e.entity_id === r), a = c[r], o = i?.device_id ?? at(n, r), u = a?.meter && a.meter !== "none" ? a.meter : void 0, m = d.find((e) => {
			let t = ot(n, e);
			return t !== void 0 && !p.has(e.id) && (t === o || t === u?.device_id);
		}) ?? d.find((e) => !p.has(e.id) && i && e.name.trim().toLowerCase() === i.name.trim().toLowerCase());
		m && p.add(m.id);
		let h = t.climate?.rooms[r]?.error;
		s.push(st({
			group: "climate",
			id: r,
			name: i?.name ?? (n ? f(n, r) : r),
			area: i?.area ?? it(n, o, r),
			icon: Qe.climate,
			deviceId: o,
			entityId: r,
			role: a?.enabled ? "steers" : "watches",
			climate: i,
			room: a,
			meter: u ? {
				deviceId: u.device_id,
				power: u.power ?? void 0
			} : void 0,
			consumer: m
		}, [l && !i ? e("devices.problem.gone") : void 0, h ? e.optional(`week.error.${h}`) ?? e("week.error", { error: h }) : void 0]));
	}
	for (let e of d.filter((e) => !p.has(e.id))) {
		let t = ot(n, e);
		s.push(st({
			group: "climate",
			id: e.id,
			name: e.name,
			area: it(n, t, e.power_entity ?? e.energy_entity),
			icon: "mdi:help-circle-outline",
			deviceId: t,
			entityId: e.power_entity ?? e.energy_entity ?? void 0,
			role: "measures",
			consumer: e,
			unassigned: !0
		}, []));
	}
	let m = new Map(i.consumers.map((e) => [e.id, e])), h = {
		car: [],
		hot_water: [],
		other: []
	}, g = /* @__PURE__ */ new Set(), _ = (t, r, i) => {
		let o = t.consumer_id ? m.get(t.consumer_id) : void 0, s = r === "car" ? t.entity_id : r === "hot_water" ? t.sensor_entity ?? t.entity_id : t.entity_id, c = at(n, t.entity_id) ?? (o ? ot(n, o) : void 0) ?? at(n, s);
		return st({
			group: r,
			id: i,
			name: i === o?.id ? o.name : t.name,
			area: it(n, c, s || void 0),
			deviceId: c,
			entityId: s || void 0,
			role: t.enabled ? "steers" : "watches",
			action: t,
			consumer: o,
			point: r === "car" || void 0,
			icon: r === "car" ? "mdi:ev-station" : Qe[r],
			noMeter: r === "other" && !o
		}, [ct(e, a?.actions?.[t.id]?.problem)]);
	};
	for (let e of i.cars ?? []) {
		let r = pe(t, e.id, "soc")?.entity, i = (e.sources.find((e) => e.kind === "car") ?? e.sources[0])?.device_id ?? at(n, r);
		h.car.push(st({
			group: "car",
			id: e.id,
			name: e.name,
			area: it(n, i, r),
			icon: Qe.car,
			deviceId: i ?? void 0,
			entityId: r,
			role: e.need.enabled ? "steers" : "watches",
			car: e
		}, []));
	}
	for (let e of i.actions) {
		let t = nt(i, e);
		e.consumer_id && t.group !== "other" && g.add(e.consumer_id), e.consumer_id && t.id === e.consumer_id && g.add(e.consumer_id), h[t.group].push(_(e, t.group, t.id));
	}
	for (let e of i.consumers) {
		if (e.kind === "climate" || g.has(e.id)) continue;
		let t = e.kind === "ev" ? "car" : e.kind === "hot_water" ? "hot_water" : "other", r = ot(n, e), i = e.power_entity ?? e.energy_entity ?? void 0, a = st({
			group: t,
			id: e.id,
			name: e.name,
			area: it(n, r, i),
			icon: t === "other" ? Qe.other : Qe[t],
			deviceId: r,
			entityId: i,
			role: "measures",
			consumer: e,
			setup: t === "other" ? void 0 : t === "car" ? "wallbox" : t
		}, []);
		h[t].push(a);
	}
	let v = new Map(i.consumers.map((e, t) => [e.id, t]));
	h.other.sort((e, t) => (v.get(e.id) ?? Infinity) - (v.get(t.id) ?? Infinity)), s.push(...h.car, ...h.hot_water, ...h.other);
	let ee = i.measurements, te = (t) => o.filter((e) => t === "connection" ? e.role === "grid_power" || e.code === "grid_sign" || e.code === "tariff_unknown" : t === "home" ? e.role === "home_power" || e.code === "home_negative" : e.role === "solar_power").map((t) => Ge(e, t)), y = (e, t, r, i) => st({
		group: "grid",
		id: e,
		part: e,
		name: t,
		icon: r,
		deviceId: at(n, i),
		entityId: i ?? void 0,
		area: it(n, void 0, i),
		role: "measures"
	}, te(e));
	return s.push(y("connection", e("devices.grid.connection"), "mdi:transmission-tower", ee.grid_power?.entity_id)), (ee.solar_power.length || i.forecast.provider) && s.push(y("solar", e("devices.grid.solar"), "mdi:solar-power-variant", ee.solar_power[0]?.entity_id)), s.push(y("home", e("devices.grid.home"), "mdi:home-lightning-bolt-outline", ee.home_power?.entity_id)), s;
}
function dt(e) {
	return Ze.filter((t) => t === "grid" || e.some((e) => e.group === t));
}
function ft(e, t, n) {
	return n === void 0 ? void 0 : e.find((e) => e.group === t && e.id === n);
}
function pt(e, t) {
	return e.some((e) => e.group === t && e.problems.length > 0);
}
function mt(e, t) {
	return `${e}:${t}`;
}
function ht(e, t) {
	if (!t) return [];
	let n = [];
	for (let r of t.batteries) {
		let t = mt("battery", r.id);
		!e.batteries.some((e) => e.id === r.id) && !F(e, t) && n.push({
			kind: "battery",
			key: t,
			name: r.name,
			battery: r
		});
	}
	for (let r of t.wallboxes.filter((e) => e.is_car)) {
		let t = mt("wallbox", r.device_id ?? r.name);
		!e.actions.some((e) => e.id === `ev_${r.device_id}` || r.mode_entity && e.entity_id === r.mode_entity) && !F(e, t) && n.push({
			kind: "wallbox",
			key: t,
			name: r.name,
			wallbox: r
		});
	}
	for (let r of t.cars ?? []) {
		let t = mt("car", r.device_id);
		!(e.cars ?? []).some((e) => e.sources.some((e) => e.device_id === r.device_id) || r.entities.soc && e.need.soc_entity === r.entities.soc || r.entities.range && e.need.range_entity === r.entities.range) && !F(e, t) && n.push({
			kind: "car",
			key: t,
			name: r.name,
			car: r
		});
	}
	return n;
}
function gt(e, t) {
	return (t?.batteries ?? []).filter((t) => F(e, mt("battery", t.id)) && !e.batteries.some((e) => e.id === t.id));
}
//#endregion
//#region src/components/calendar-flow.ts
var _t = class extends x {
	constructor(...e) {
		super(...e), this.variant = "calendar", this.address = "", this.calendar = "";
	}
	static {
		this.styles = T`
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
		return e ? C`<ol aria-label=${e(`flow.${this.variant}.title`)}>
      ${this.steps(e).map((e, t) => C`<li class=${e.joe ? "joe" : ""}>
          <span class="badge" aria-hidden="true">
            <ha-icon icon=${e.icon}></ha-icon>
            <span class="number">${t + 1}</span>
          </span>
          <span .innerHTML=${this.bold(e.text)}></span>
        </li>`)}
    </ol>` : A;
	}
	bold(e) {
		return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
	}
};
s([O({ attribute: !1 })], _t.prototype, "t", void 0), s([O()], _t.prototype, "variant", void 0), s([O()], _t.prototype, "address", void 0), s([O()], _t.prototype, "calendar", void 0), j("joe-calendar-flow", _t);
//#endregion
//#region src/components/car-account.ts
var vt = [
	"google",
	"outlook",
	"microsoft",
	"icloud",
	"infomaniak",
	"caldav"
], yt = /* @__PURE__ */ new Set([
	"google",
	"outlook",
	"microsoft"
]), bt = {
	kind: "outlook",
	address: "",
	username: null,
	url: null,
	client_id: null,
	tenant: "common",
	accept: !0
}, xt = class extends x {
	constructor(...e) {
		super(...e), this.actionId = "", this.saved = !1, this.password = "", this.secret = "", this.busy = !1, this.ownApp = !1;
	}
	static {
		this.styles = [d, T`
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
		if (!e) return A;
		let t = this.account, n = yt.has(t.kind);
		return C`<div class="field" data-tipped>
        <div class="head-row"><label for="account-kind"><b>${e("calendar.account.kind")}</b></label> ${o(e, "calendar_account")}</div>
        <select id="account-kind" class="input" @change=${(e) => this.set({ kind: e.target.value })}>
          ${vt.map((n) => C`<option value=${n} ?selected=${n === t.kind}>${e(`calendar.account.kind.${n}`)}</option>`)}
        </select>
      </div>
      <div class="field" data-tipped>
        <div class="head-row"><label for="account-address"><b>${e("calendar.account.address")}</b></label> ${o(e, "calendar_account_address")}</div>
        <input
          id="account-address"
          class="input"
          type="email"
          autocomplete="off"
          placeholder=${e(`calendar.account.placeholder.${t.kind}`)}
          .value=${t.address}
          @change=${(e) => this.set({ address: e.target.value.trim().toLowerCase() })}
        />
        ${t.kind === "google" ? C`<p class="hint">${e("calendar.account.google.hint")}</p>` : A}
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
        ${o(e, "calendar_account_accept")}
      </div>
      ${this.renderStatus(e)}`;
	}
	get account() {
		return {
			...bt,
			...this.need?.account ?? {}
		};
	}
	joeApp(e) {
		return e === "google" ? !!this.apps?.google : !!this.apps?.microsoft;
	}
	renderSignIn(e, t) {
		let n = this.status, r = n?.oauth, i = t.kind === "google", a = this.joeApp(t.kind), s = !a || this.ownApp || !!t.client_id || t.kind === "microsoft", c = !!n?.has_sign_in, l = this.signInError ?? (r?.state === "error" ? r.error : void 0);
		return C`${s ? this.renderOwnApp(e, t, a) : A}
      <div class="field" data-tipped>
        <div class="inline">
          <button type="button" class="mini-btn go" ?disabled=${this.busy} @click=${() => this.act("sign_in")}>
            <ha-icon icon=${i ? "mdi:google" : "mdi:microsoft"}></ha-icon>${e(c ? "mail.sign_in.again" : i ? "mail.sign_in.google" : "mail.sign_in")}
          </button>
          ${c ? C`<button type="button" class="mini-btn quiet" @click=${() => this.act("sign_out")}>${e("mail.sign_out")}</button>` : A}
          ${s ? A : C`<button type="button" class="mini-btn quiet" @click=${() => this.ownApp = !0}>${e("calendar.account.own_app")}</button>`}
          ${o(e, "mail_sign_in")}
        </div>
        ${r?.state === "waiting" && !this.signInError ? C`<p class="code">${e("mail.sign_in.code", { code: r.user_code ?? "" })}
              <a href=${r.uri ?? ""} target="_blank" rel="noreferrer noopener">${r.uri}</a></p>` : l ? C`<p class="bad">${e.optional(`calendar.account.oauth.${l}`) ?? e("calendar.account.oauth.other")}</p>` : c ? C`<p class="hint ok">${e("mail.signed_in")}</p>` : A}
      </div>`;
	}
	renderOwnApp(e, t, n) {
		let r = t.kind === "google";
		return C`<div class="field" data-tipped>
      <div class="head-row">
        <b>${e(n ? "calendar.account.client_id" : "calendar.account.client_id.needed")}</b>
        ${o(e, r ? "google_app" : "mail_microsoft")}
      </div>
      ${n ? A : C`<p class="hint">${e("calendar.account.no_joe_app")}</p>`}
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
        ${t.kind === "microsoft" ? C`<input
              class="input"
              type="text"
              placeholder="common"
              aria-label=${e("mail.tenant")}
              .value=${t.tenant}
              @change=${(e) => this.set({ tenant: e.target.value.trim() || "common" })}
            />` : A}
      </div>
      ${r ? C`<form
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
          ${this.status?.has_client_secret ? C`<p class="hint ok">${e("mail.password.saved")}</p>` : A}` : A}
    </div>`;
	}
	renderPassword(e, t) {
		return C`${t.kind === "caldav" ? C`<div class="field" data-tipped>
            <div class="head-row"><b>${e("calendar.account.url")}</b> ${o(e, "calendar_account_url")}</div>
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
          </div>` : A}
      <div class="field" data-tipped>
        <div class="head-row"><label for="account-password"><b>${e("calendar.account.password")}</b></label> ${o(e, "calendar_account_password")}</div>
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
        ${this.status?.has_password ? C`<p class="hint ok">${e("mail.password.saved")}</p>` : A}
      </div>`;
	}
	renderStatus(e) {
		let t = this.status, n = yt.has(this.account.kind) ? t?.has_sign_in : t?.has_password, r = this.saved ? t?.state === "error" ? e("mail.state.error", { error: e.optional(`calendar.account.error.${t.error}`) ?? e("calendar.account.error.other") }) : t?.checked ? e("mail.state.ok", { time: S(t.checked) }) : "" : e("calendar.account.after_save");
		return C`<div class="inline" data-tipped>
      <button type="button" class="mini-btn" ?disabled=${this.busy || !n} @click=${() => this.act("test")}>
        <ha-icon icon="mdi:calendar-check-outline"></ha-icon>${e("calendar.account.test")}
      </button>
      ${o(e, "calendar_account_test")}
      <span class=${this.saved && t?.state === "error" ? "bad" : "hint"}>${r}</span>
      ${this.result ? C`<span class=${this.result === "ok" ? "ok" : "bad"}>
            ${e.optional(`calendar.account.result.${this.result}`) ?? e("calendar.account.result.other")}
          </span>` : A}
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
s([O({ attribute: !1 })], xt.prototype, "hass", void 0), s([O({ attribute: !1 })], xt.prototype, "t", void 0), s([O()], xt.prototype, "actionId", void 0), s([O({ type: Boolean })], xt.prototype, "saved", void 0), s([O({ attribute: !1 })], xt.prototype, "need", void 0), s([O({ attribute: !1 })], xt.prototype, "status", void 0), s([O({ attribute: !1 })], xt.prototype, "apps", void 0), s([N()], xt.prototype, "password", void 0), s([N()], xt.prototype, "secret", void 0), s([N()], xt.prototype, "result", void 0), s([N()], xt.prototype, "signInError", void 0), s([N()], xt.prototype, "busy", void 0), s([N()], xt.prototype, "ownApp", void 0), j("joe-car-account", xt);
//#endregion
//#region src/components/car-mailbox.ts
var St = [
	"webde",
	"gmx",
	"google",
	"tonline",
	"other"
], Ct = {
	"web.de": "webde",
	"gmx.de": "gmx",
	"gmx.net": "gmx",
	"gmx.at": "gmx",
	"gmx.ch": "gmx",
	"gmail.com": "google",
	"googlemail.com": "google",
	"t-online.de": "tonline"
}, wt = {
	provider: "other",
	address: "",
	username: null,
	imap_host: null,
	imap_port: null,
	smtp_host: null,
	smtp_port: null,
	smtp_security: null,
	accept: !0
}, Tt = class extends x {
	constructor(...e) {
		super(...e), this.actionId = "", this.saved = !1, this.password = "", this.busy = !1, this.servers = !1;
	}
	static {
		this.styles = [d, T`
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
		if (!e) return A;
		let t = this.mailbox, n = this.servers || t.provider === "other" && !!t.address;
		return C`<div class="field" data-tipped>
        <div class="head-row"><label for="mail-address"><b>${e("mail.address")}</b></label> ${o(e, "mail_address")}</div>
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
        <div class="head-row"><label for="mail-provider"><b>${e("mail.provider")}</b></label> ${o(e, "mail_provider")}</div>
        <select id="mail-provider" class="input" @change=${(e) => this.set({ provider: e.target.value })}>
          ${St.map((n) => C`<option value=${n} ?selected=${n === t.provider}>${e(`mail.provider.${n}`)}</option>`)}
        </select>
        <p class="hint">${e(`mail.provider.${t.provider}.hint`)}</p>
      </div>
      ${this.renderPassword(e)} ${n ? this.renderServers(e, t) : A}
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
        ${o(e, "mail_accept")}
        ${n ? A : C`<button type="button" class="mini-btn quiet" @click=${() => this.servers = !0}>${e("mail.servers.change")}</button>`}
      </div>
      ${this.renderStatus(e)} ${this.renderRecent(e)}`;
	}
	get mailbox() {
		return {
			...wt,
			...this.need?.mailbox ?? {}
		};
	}
	renderPassword(e) {
		return C`<div class="field" data-tipped>
      <div class="head-row"><label for="mail-password"><b>${e("mail.password")}</b></label> ${o(e, "mail_password")}</div>
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
      ${this.status?.has_secret ? C`<p class="hint ok">${e("mail.password.saved")}</p>` : C`<p class="hint">${e("mail.password.hint")}</p>`}
    </div>`;
	}
	renderServers(e, t) {
		let n = (n) => C`<input
      class="input"
      type="text"
      aria-label=${e(`mail.${n}`)}
      placeholder=${e(`mail.${n}`)}
      .value=${t[n] ?? ""}
      @change=${(e) => this.set({ [n]: e.target.value.trim() || null })}
    />`, r = (n) => C`<input
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
		return C`<div class="field" data-tipped>
      <div class="head-row"><b>${e("mail.servers")}</b> ${o(e, "mail_servers")}</div>
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
		return C`<div class="field" data-tipped>
      <div class="inline">
        <button type="button" class="mini-btn" ?disabled=${this.busy || !this.status?.has_secret} @click=${() => this.act("test")}>
          <ha-icon icon="mdi:connection"></ha-icon>${e("mail.test")}
        </button>
        ${this.saved ? C`<button type="button" class="mini-btn" ?disabled=${this.busy || !this.status?.has_secret} @click=${() => this.act("check")}>
              <ha-icon icon="mdi:email-sync-outline"></ha-icon>${e("mail.check")}
            </button>` : A}
        ${o(e, "mail_status")}
      </div>
      <p class=${this.saved && this.status?.state === "error" ? "hint bad" : "hint"}>
        ${this.saved ? this.statusText(e) : e("mail.after_save")}
      </p>
      ${this.result ? C`<p class=${this.result === "ok" ? "hint ok" : "hint bad"} role="status">
            ${e.optional(`mail.result.${this.result}`) ?? e("mail.result.failed")}
          </p>` : A}
    </div>`;
	}
	renderRecent(e) {
		let t = this.status?.recent ?? [];
		if (!t.length) return A;
		let n = this.need?.allowed ?? [];
		return C`<div class="field" data-tipped>
      <div class="head-row"><b>${e("mail.recent")}</b> ${o(e, "mail_recent")}</div>
      <ul>
        ${t.slice(0, 8).map((t) => C`<li>
            <span class="what">
              ${t.summary || "–"} ${t.start && t.start.includes("T") ? `· ${t.start.slice(8, 10)}.${t.start.slice(5, 7)}. ${S(t.start)}` : ""}
              · ${t.from}
            </span>
            <span class=${t.result.startsWith("not") || t.result.endsWith("not_accepted") || t.result.startsWith("no_") ? "bad" : ""}>
              ${e.optional(`mail.recent.${t.result}`) ?? t.result}
            </span>
            ${t.result === "not_allowed" && !n.includes(t.from) ? C`<button type="button" class="mini-btn" @click=${() => this.change({ allowed: [...n, t.from] })}>${e("mail.allow")}</button>` : A}
          </li>`)}
      </ul>
    </div>`;
	}
	statusText(e) {
		let t = this.status;
		return !t || t.state === "off" || t.state === "waiting" ? e("mail.state.waiting") : t.state === "no_secret" ? e("mail.state.no_secret") : t.state === "error" ? e("mail.state.error", { error: e.optional(`mail.error.${t.error}`) ?? String(t.error) }) : e("mail.state.ok", { time: t.checked ? S(t.checked) : "–" });
	}
	setAddress(e) {
		let t = Ct[e.split("@")[1] ?? ""], n = this.mailbox, r = n.provider === "other" || n.provider === Ct[n.address.split("@")[1] ?? ""];
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
s([O({ attribute: !1 })], Tt.prototype, "hass", void 0), s([O({ attribute: !1 })], Tt.prototype, "t", void 0), s([O()], Tt.prototype, "actionId", void 0), s([O({ type: Boolean })], Tt.prototype, "saved", void 0), s([O({ attribute: !1 })], Tt.prototype, "need", void 0), s([O({ attribute: !1 })], Tt.prototype, "status", void 0), s([N()], Tt.prototype, "password", void 0), s([N()], Tt.prototype, "busy", void 0), s([N()], Tt.prototype, "result", void 0), s([N()], Tt.prototype, "servers", void 0), j("joe-car-mailbox", Tt);
//#endregion
//#region src/components/car-calendars.ts
var Et = [
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
], Dt = [
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
], z = class extends x {
	constructor(...e) {
		super(...e), this.actionId = "", this.savedSource = null, this.carName = "", this.copied = !1, this.copyFailed = !1, this.linksFailed = !1, this.sender = "";
	}
	static {
		this.styles = [d, T`
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
		if (!e || !t) return A;
		let n = this.need?.source ?? "ha";
		return C`<div data-tipped>
        <div class="head-row"><b>${e("calendar.source")}</b> ${o(e, "calendar_source")}</div>
        <div class="ways-box"><div class="ways" role="radiogroup" aria-label=${e("calendar.source")}>
          ${Et.map((t) => C`<button
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
      ${this.linksFailed ? C`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("calendar.links_failed")}</span>
            <button type="button" class="mini-btn quiet" @click=${() => this.load(!1)}>${e("calendar.retry")}</button>
          </div>` : A}`;
	}
	saved(e) {
		return this.savedSource === e;
	}
	renderLegacy(e, t) {
		let n = this.savedSource && this.savedSource !== "mailbox" && this.savedSource === (this.need?.source ?? "ha") ? this.links?.entities[this.actionId] : null;
		return n ? C`<div class="own" data-tipped>
          <div class="head-row"><ha-icon icon="mdi:calendar-clock"></ha-icon><b>${e("calendar.own.legacy")}</b> ${o(e, "calendar_legacy")}</div>
          <p class="hint">${e("calendar.own.legacy.hint", { name: f(t, n) })}</p>
        </div>` : A;
	}
	renderCalendar(e, t) {
		let n = this.need?.calendars ?? [];
		return C`<div class="part">
        <joe-calendar-flow .t=${e} variant="calendar"></joe-calendar-flow>
      </div>
      ${this.renderLegacy(e, t)}
      <div data-tipped>
        <div class="head-row"><b>${e("calendar.pick")}</b> ${o(e, "calendar_more")}</div>
        <div class="chips">
          ${n.map((r) => C`<span class="chip">
              ${f(t, r)}
              <button
                type="button"
                class="mini-btn quiet"
                aria-label=${e("calendar.remove", { name: f(t, r) })}
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
          ${Dt.map((t) => C`<a class="mini-btn" href=${t.url} target="_blank" rel="noreferrer noopener">
                <ha-icon icon="mdi:open-in-new"></ha-icon>${e(`calendar.connect.${t.key}`)}
              </a>`)}
          ${o(e, "calendar_connect")}
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
		let n = this.saved("mailbox"), r = n ? this.links?.entities[this.actionId] : null, i = r ? f(t, r) : e("calendar.own.name", { car: this.carName });
		return C`<div class="part">
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
		let r = C`<div class="head-row">
      <ha-icon icon="mdi:calendar-import"></ha-icon><b>${e("calendar.own")}</b> ${o(e, "calendar_own")}
    </div>`;
		if (!n) return C`<div class="own" data-tipped>${r}<p class="hint">${e("calendar.own.after_save", { name: t })}</p></div>`;
		let i = this.links?.links[this.actionId], a = this.links?.external_url, s = i && a ? `${a.replace(/\/$/, "")}${i}` : null;
		return C`<div class="own" data-tipped>
      ${r}
      <p class="hint">${e("calendar.own.hint", { name: t })}</p>
      ${s ? C`<div class="link">
            <code>${s}</code>
            <button type="button" class="mini-btn" @click=${() => this.copy(s)}>
              <ha-icon icon=${this.copied ? "mdi:check" : "mdi:content-copy"}></ha-icon>${e(this.copied ? "calendar.copied" : "calendar.copy")}
            </button>
            <button type="button" class="mini-btn quiet" @click=${() => this.load(!0)}>
              <ha-icon icon="mdi:refresh"></ha-icon>${e("calendar.renew")}
            </button>
            ${o(e, "calendar_link")}
          </div>
          ${this.copyFailed ? C`<p class="hint bad">${e("calendar.copy_failed")}</p>` : A}` : C`<p class="hint">${e("calendar.no_external")}</p>`}
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
		return C`<div class="part">
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
      ${this.renderAllowed(e, "account_allowed")} ${this.hass ? this.renderLegacy(e, this.hass) : A}`;
	}
	renderAllowed(e, t = "mail_allowed") {
		let n = this.need?.allowed ?? [];
		return C`<div class="part" data-tipped>
      <div class="head-row"><b>${e("mail.allowed")}</b> ${o(e, t)}</div>
      <p class="hint">${e("mail.allowed.hint")}</p>
      ${n.length ? C`<div class="chips">
            ${n.map((t) => C`<span class="chip">
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
          </div>` : C`<div class="note warn"><ha-icon icon="mdi:account-alert-outline"></ha-icon><span>${e("mail.allowed.none")}</span></div>`}
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
s([O({ attribute: !1 })], z.prototype, "hass", void 0), s([O({ attribute: !1 })], z.prototype, "t", void 0), s([O()], z.prototype, "actionId", void 0), s([O({ attribute: !1 })], z.prototype, "savedSource", void 0), s([O({ attribute: !1 })], z.prototype, "need", void 0), s([O({ attribute: !1 })], z.prototype, "mailbox", void 0), s([O({ attribute: !1 })], z.prototype, "account", void 0), s([O({ attribute: !1 })], z.prototype, "apps", void 0), s([O()], z.prototype, "carName", void 0), s([N()], z.prototype, "links", void 0), s([N()], z.prototype, "copied", void 0), s([N()], z.prototype, "copyFailed", void 0), s([N()], z.prototype, "linksFailed", void 0), s([N()], z.prototype, "sender", void 0), j("joe-car-calendars", z);
//#endregion
//#region src/hot-water.ts
var Ot = [
	"warmwasser",
	"brauchwasser",
	"trinkwasser",
	"boiler",
	"hot_water",
	"hot water",
	"dhw",
	"water_heater",
	"water heater"
], kt = [
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
], At = [
	"switch",
	"input_boolean",
	"select",
	"input_select",
	"number",
	"input_number",
	"button",
	"script"
];
function jt(e, t) {
	let n = e.states[t], r = String(n?.attributes.friendly_name ?? ""), i = e.entities?.[t]?.device_id, a = i ? e.devices?.[i] : void 0;
	return `${t} ${r} ${a?.name_by_user ?? a?.name ?? ""}`.toLowerCase().replaceAll("-", " ");
}
function Mt(e, t) {
	return [...Ot, ...t].some((t) => e.includes(t));
}
function Nt(e) {
	return (e ?? "").toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((e) => e.length >= 5);
}
function Pt(e, t) {
	let n = Nt(t), r = [], i = [];
	for (let [t, a] of Object.entries(e.states)) {
		let o = t.split(".")[0], s = jt(e, t);
		if (!Mt(s, n)) continue;
		let c = t.toLowerCase(), l = String(a.attributes.unit_of_measurement ?? "");
		if ((o === "sensor" || o === "number") && (l === "°C" || l === "°F")) {
			let e = (Ot.some((e) => c.includes(e.replace(" ", "_"))) ? 2 : 1) - (kt.some((e) => s.includes(e)) ? 2 : 0);
			r.push({
				entity_id: t,
				score: e
			});
		} else At.includes(o) && i.push({
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
var Ft = [
	"eq",
	"ne",
	"lt",
	"le",
	"gt",
	"ge"
], It = {
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
}, Lt = {
	vehicle_entity: null,
	connected_entity: null,
	soc_entity: null,
	range_entity: null,
	odometer_entity: null,
	cars: null,
	unknown: "ask",
	assume_car: null
}, Rt = {
	reserve_km: [0, 1e3],
	consumption: [5, 60],
	daily_km: [0, 2e3],
	capacity_kwh: [.1, 300],
	max_soc: [20, 100]
}, zt = {
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
function Bt(e, t) {
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
		point: { ...Lt }
	} : e === "hot_water" ? {
		...n,
		kind: "target",
		forecast_below_kwh: 20,
		power_kw: .5,
		priority: 2
	} : n;
}
function Vt(e) {
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
			...Lt,
			vehicle_entity: n.vehicle ?? null,
			connected_entity: n.connected ?? null,
			soc_entity: n.vehicle_soc ?? null,
			range_entity: n.vehicle_range ?? null,
			odometer_entity: n.vehicle_odometer ?? null
		}
	};
}
function Ht(e) {
	return e === "ev" || e === "car" ? "point" : e === "hot_water" ? "hot_water" : "night";
}
function Ut(e, t, n) {
	return t.entity_id ? t.kind === "target" && !t.sensor_entity ? e("action.problem.sensor") : "" : e("action.problem.entity");
}
function B(e, t, n, r) {
	return C`<div class="field" data-tipped>
    <div class="field-label">${t} ${o(e, n)}</div>
    ${r}
  </div>`;
}
function Wt(e, t, n) {
	let r = e.t, i = e.hass;
	return C`<div class="entity">
    <span>
      ${t ? C`<b>${f(i, t)}</b><small>${ne(i, t, r.lang)}</small>` : C`<small>${r("find.none")}</small>`}
    </span>
    <button type="button" class="mini-btn" @click=${n}>
      <ha-icon icon="mdi:magnify"></ha-icon>${r(t ? "review.change" : "review.choose")}
    </button>
  </div>`;
}
function Gt(e) {
	let t = e.trim();
	if (t === "on" || t === "an") return !0;
	if (t === "off" || t === "aus") return !1;
	let n = Number(t.replace(",", "."));
	return t !== "" && Number.isFinite(n) ? n : t;
}
function Kt(e, t, n) {
	let r = Math.round(Number.parseFloat(e.target.value));
	return Math.min(n, Math.max(t, Number.isFinite(r) ? r : t));
}
function qt(e, t, n, r) {
	let i = e.t, a = t.split(".", 1)[0], o = e.hass?.states[t]?.attributes.options ?? [];
	if (["select", "input_select"].includes(a) && o.length) return C`<select class="input" aria-label=${i("action.f.value")} @change=${(e) => r(e.target.value)}>
      ${o.map((e) => C`<option value=${e} ?selected=${n === e}>${e}</option>`)}
    </select>`;
	if ([
		"switch",
		"input_boolean",
		"light",
		"fan"
	].includes(a)) {
		let e = n === !0 || n === "on";
		return C`<div class="seg" role="group" aria-label=${i("action.f.value")}>
      <button type="button" aria-pressed=${String(e)} @click=${() => r("on")}>${i("action.value.on")}</button>
      <button type="button" aria-pressed=${String(!e)} @click=${() => r("off")}>${i("action.value.off")}</button>
    </div>`;
	}
	return C`<input
    class="input"
    type="text"
    aria-label=${i("action.f.value")}
    .value=${n == null ? "" : String(n)}
    @change=${(e) => r(Gt(e.target.value))}
  />`;
}
function Jt(e, t, n) {
	return C`<button type="button" class="switch" role="switch" aria-checked=${String(t)} aria-label=${e} @click=${n}></button>`;
}
function Yt(e, t, n, r) {
	return C`<a class="mini-btn quiet go-link" href=${k(e || "/energy-joe", t)} aria-label=${r ?? n} @click=${D(t)}
    >${n}</a
  >`;
}
function Xt(e) {
	let t = e.t, n = e.draft;
	return B(t, t("action.f.name"), "a_name", C`<input
      class="input"
      type="text"
      maxlength="60"
      .value=${n.name}
      @change=${(t) => e.setDraft({ name: t.target.value.trim() || n.name })}
    />`);
}
function Zt(e) {
	let t = e.t, n = e.draft;
	return B(t, t("action.f.kind"), "a_kind", C`<div class="seg" role="group" aria-label=${t("action.f.kind")}>
      ${["switch", "target"].map((r) => C`<button type="button" aria-pressed=${String(n.kind === r)} @click=${() => e.setDraft({ kind: r })}>
            ${t(`action.kind.${r}`)}
          </button>`)}
    </div>`);
}
function Qt(e) {
	let t = e.t, n = e.draft;
	return C`${B(t, t("action.f.entity"), "a_entity", Wt(e, n.entity_id, () => mn(e)))}
    ${n.entity_id ? B(t, t("action.f.on_value"), "a_on_value", qt(e, n.entity_id, n.on_value, (t) => e.setDraft({ on_value: t }))) : A}
    ${B(t, t("action.f.reset"), "a_reset", C`<div class="row">
        <div class="seg" role="group" aria-label=${t("action.f.reset")}>
          ${["previous", "fixed"].map((r) => C`<button type="button" aria-pressed=${String(n.reset === r)} @click=${() => e.setDraft({ reset: r })}>
                ${t(`action.reset.${r}`)}
              </button>`)}
        </div>
        ${n.reset === "fixed" && n.entity_id ? qt(e, n.entity_id, n.reset_value ?? "", (t) => e.setDraft({ reset_value: t })) : A}
      </div>`)}
    ${B(t, t("action.f.lead"), "a_lead", C`<span class="unit-input">
        <input
          class="input"
          type="number"
          min="0"
          max="120"
          step="1"
          .value=${String(n.lead_min)}
          @change=${(t) => e.setDraft({ lead_min: Kt(t, 0, 120) })}
        />
        <span class="unit">min</span>
      </span>`)}`;
}
function $t(e) {
	let t = e.t, n = e.draft, r = (r, i) => C`<label>
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
	return C`${B(t, t("action.f.sensor"), "a_sensor", Wt(e, n.sensor_entity ?? "", () => hn(e)))}
    ${B(t, t("action.f.temps"), "a_temps", C`<div class="temps">${r("comfort", "°C")} ${r("maximum", "°C")} ${r("buffer", "K")}</div>`)}`;
}
function en(e) {
	let t = e.t, n = e.draft;
	return C`${B(t, t("action.f.auto"), "a_auto", C`<div class="row">
        ${Jt(t("action.f.auto"), n.auto, () => e.setDraft({ auto: !n.auto }))}
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
    ${n.auto ? tn(e) : A}`;
}
function tn(e) {
	let t = e.t, n = e.hass, r = e.draft, i = (t, n) => e.setDraft({ conditions: (e.draft?.conditions ?? []).map((e, r) => r === t ? {
		...e,
		...n
	} : e) });
	return B(t, t("action.f.conditions"), "a_conditions", C`${r.conditions.map((r, a) => C`<div class="condition">
          <span><b>${f(n, r.entity_id)}</b></span>
          <select
            class="input"
            aria-label=${t("action.f.op")}
            @change=${(e) => i(a, { op: e.target.value })}
          >
            ${Ft.map((e) => C`<option value=${e} ?selected=${r.op === e}>${t(`action.op.${e}`)}</option>`)}
          </select>
          <input
            class="input"
            type="text"
            aria-label=${t("action.f.value")}
            .value=${String(r.value === !0 ? "on" : r.value === !1 ? "off" : r.value)}
            @change=${(e) => i(a, { value: Gt(e.target.value) })}
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
      <button type="button" class="mini-btn" @click=${() => _n(e)}>
        <ha-icon icon="mdi:plus"></ha-icon>${t("action.f.condition.add")}
      </button>`);
}
function nn(e) {
	let t = e.t, n = e.draft, r = e.config?.consumers ?? [];
	return C`${B(t, t("action.f.power"), "a_power", C`<span class="unit-input">
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
    ${r.length ? B(t, t("action.f.consumer"), "a_consumer", C`<select class="input" @change=${(t) => e.setDraft({ consumer_id: t.target.value || null })}>
            <option value="" ?selected=${!n.consumer_id}>${t("action.f.consumer.none")}</option>
            ${r.map((e) => C`<option value=${e.id} ?selected=${n.consumer_id === e.id}>${e.name}</option>`)}
          </select>`) : A}
    ${B(t, t("action.f.priority"), "a_priority", C`<span class="unit-input">
        <input
          class="input"
          type="number"
          min="1"
          max="9"
          step="1"
          .value=${String(n.priority)}
          @change=${(t) => e.setDraft({ priority: Kt(t, 1, 9) })}
        />
      </span>`)}`;
}
function rn(e) {
	let t = e.t, n = e.draft;
	return B(t, t("action.f.enabled"), "a_enabled", Jt(t("action.f.enabled"), n.enabled, () => e.setDraft({ enabled: !n.enabled })));
}
function an(e, t) {
	e.setDraft({ need: {
		...It,
		...e.draft?.need ?? {},
		...t
	} });
}
function on(e, t, n, r = "") {
	let i = e.t, a = e.draft?.need ?? It, [o, s] = Rt[t], c = a[t];
	return C`<span class="unit-input">
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
		a || (r.value = c == null ? "" : String(c)), an(e, { [t]: a ? i : c });
	}}
    />
    <span class="unit">${n}</span>
  </span>`;
}
function sn(e) {
	let t = e.t, n = e.draft?.need ?? It;
	return C`${B(t, t("action.need"), "a_need", C`<div class="row">
          ${Jt(t("action.need"), n.enabled, () => an(e, { enabled: !(e.draft?.need ?? It).enabled }))}
          <span>${t(n.enabled ? "action.need.on" : "action.need.off")}</span>
        </div>
        <p class="field-hint">${t("action.need.hint")}</p>`)}
    ${n.enabled ? C`${B(t, t("action.need.reserve"), "a_need_reserve", on(e, "reserve_km", "km"))}
        ${B(t, t("action.need.max_soc"), "a_need_max_soc", on(e, "max_soc", "%"))}
        ${B(t, t("action.need.capacity"), "a_need_capacity", on(e, "capacity_kwh", "kWh", t("action.need.from_sensor")))}
        ${B(t, t("action.need.consumption"), "a_need_consumption", on(e, "consumption", "kWh/100 km", t("action.need.learned")))}
        ${B(t, t("action.need.daily"), "a_need_daily", on(e, "daily_km", "km", t("action.need.learned")))}` : A}`;
}
function cn(e) {
	let t = e.t, n = e.draft?.need ?? It, r = (t) => Wt(e, n[t] ?? "", () => gn(e, t));
	return C`${B(t, t("action.need.soc"), "a_need_soc", r("soc_entity"))}
    ${B(t, t("action.need.range"), "a_need_range", r("range_entity"))}
    ${B(t, t("action.need.capacity_sensor"), "a_need_capacity_sensor", r("capacity_entity"))}
    ${B(t, t("action.need.consumption_sensor"), "a_need_consumption_sensor", r("consumption_entity"))}
    ${B(t, t("action.need.odometer"), "a_need_odometer", r("odometer_entity"))}`;
}
function ln(e) {
	let t = e.t, n = e.draft, r = n.need ?? It, i = (e.config?.persons ?? []).filter((e) => e.calendars.length), a = i.map((e) => e.id), o = (t) => {
		let n = (e.draft?.need ?? It).persons ?? a, r = n.includes(t) ? n.filter((e) => e !== t) : [...n, t];
		an(e, { persons: a.every((e) => r.includes(e)) ? null : r });
	};
	return C`${B(t, t("action.need.persons"), "a_need_persons", i.length ? C`<ul class="people" role="group" aria-label=${t("action.need.persons")}>
            ${i.map((n) => {
		let i = r.persons == null || r.persons.includes(n.id);
		return C`<li>
                <button type="button" class="mini-btn ${i ? "go" : "quiet"}" aria-pressed=${String(i)} @click=${() => o(n.id)}>
                  <ha-icon icon=${i ? "mdi:check" : "mdi:minus"}></ha-icon>${n.name}
                </button>
                ${Yt(e.prefix, {
			tab: "household",
			section: "people",
			id: n.id
		}, t("action.need.person_open"), t("action.need.person_open_of", { name: n.name }))}
              </li>`;
	})}
          </ul>` : C`<p class="field-hint">${t("action.need.no_calendars")}</p>
            ${Yt(e.prefix, {
		tab: "household",
		section: "people"
	}, t("action.need.people_link"))}`)}
    ${B(t, t("action.need.calendars"), "a_need_calendars", C`<joe-car-calendars
        .hass=${e.hass}
        .t=${t}
        actionId=${n.id}
        .savedSource=${e.existing?.need?.enabled ? e.existing.need.source ?? "ha" : null}
        .need=${r}
        .mailbox=${e.mailboxes?.[n.id]}
        .account=${e.accounts?.[n.id]}
        .apps=${e.apps}
        carName=${n.name}
        @joe-need=${(t) => an(e, t.detail)}
      ></joe-car-calendars>`)}
    ${B(t, t("action.need.round_trip"), "a_need_round_trip", Jt(t("action.need.round_trip"), r.round_trip, () => an(e, { round_trip: !(e.draft?.need ?? It).round_trip })))}
    ${e.config?.routing.service ? A : C`<div class="note">
          <ha-icon icon="mdi:map-marker-distance"></ha-icon>
          <span>${t("action.need.no_routing")} ${Yt(e.prefix, {
		tab: "household",
		section: "travel"
	}, t("action.need.routing_link"))}</span>
        </div>`}`;
}
function un(e, t) {
	e.setDraft({ point: {
		...Lt,
		...e.draft?.point ?? {},
		...t
	} });
}
function dn(e) {
	let t = e.t, n = e.draft?.point ?? Lt, r = e.config?.cars ?? [], i = r.map((e) => e.id), a = (t) => {
		let n = (e.draft?.point ?? Lt).cars ?? i, r = n.includes(t) ? n.filter((e) => e !== t) : [...n, t];
		un(e, { cars: i.every((e) => r.includes(e)) ? null : r });
	};
	return C`${B(t, t("point.f.cars"), "point_cars", r.length ? C`<ul class="people" role="group" aria-label=${t("point.f.cars")}>
            ${r.map((e) => {
		let t = n.cars == null || n.cars.includes(e.id);
		return C`<li>
                <button type="button" class="mini-btn ${t ? "go" : "quiet"}" aria-pressed=${String(t)} @click=${() => a(e.id)}>
                  <ha-icon icon=${t ? "mdi:check" : "mdi:minus"}></ha-icon>${e.name}
                </button>
              </li>`;
	})}
          </ul>` : C`<p class="field-hint">${t("point.f.no_cars")}</p>`)}
    ${B(t, t("point.f.unknown"), "point_unknown", C`<div class="row">
          <div class="seg" role="group" aria-label=${t("point.f.unknown")}>
            ${["ask", "assume"].map((i) => C`<button
                  type="button"
                  aria-pressed=${String(n.unknown === i)}
                  ?disabled=${i === "assume" && !r.length}
                  @click=${() => un(e, {
		unknown: i,
		assume_car: i === "assume" ? n.assume_car ?? r[0]?.id ?? null : n.assume_car
	})}
                >
                  ${t(`point.unknown.${i}`)}
                </button>`)}
          </div>
          ${n.unknown === "assume" && r.length ? C`<select
                class="input"
                aria-label=${t("point.f.assume")}
                @change=${(t) => un(e, { assume_car: t.target.value })}
              >
                ${r.map((e) => C`<option value=${e.id} ?selected=${n.assume_car === e.id}>${e.name}</option>`)}
              </select>` : A}
        </div>
        <p class="field-hint">${t("point.f.unknown.hint")}</p>`)}`;
}
function fn(e, t) {
	let n = e.draft;
	return t === "point" ? C`${Qt(e)} ${en(e)} ${dn(e)} ${nn(e)} ${Xt(e)} ${rn(e)}` : t === "hot_water" ? C`${Zt(e)} ${Qt(e)} ${n.kind === "target" ? $t(e) : A} ${en(e)}
    ${nn(e)} ${Xt(e)} ${rn(e)}` : C`${Qt(e)} ${n.kind === "target" ? $t(e) : A} ${en(e)} ${nn(e)}
  ${Xt(e)} ${rn(e)}`;
}
function pn(e) {
	if (e.draft?.kind !== "target" || !e.hass) return;
	let t = e.config?.consumers.find((t) => t.id === e.draft?.consumer_id);
	return Pt(e.hass, t?.name);
}
async function mn(e) {
	let t = e.t, n = (await L(e, {
		heading: t("action.pick.entity"),
		tip: "a_entity",
		filter: "writable",
		selected: e.draft?.entity_id ? [e.draft.entity_id] : [],
		suggestions: pn(e)?.switches
	}))?.selected[0];
	if (n) {
		let t = e.hass?.states[n]?.attributes.options ?? [], r = e.draft?.on_value;
		e.setDraft({
			entity_id: n,
			on_value: t.length && !t.includes(String(r)) ? t.includes("now") ? "now" : t[0] : r ?? "on"
		});
	}
}
async function hn(e) {
	let t = e.t, n = await L(e, {
		heading: t("action.pick.sensor"),
		tip: "a_sensor",
		filter: "temperature",
		selected: e.draft?.sensor_entity ? [e.draft.sensor_entity] : [],
		suggestions: pn(e)?.sensors
	});
	n?.selected[0] && e.setDraft({ sensor_entity: n.selected[0] });
}
async function gn(e, t) {
	let n = e.t, r = zt[t], i = (e.discovery?.cars ?? []).map((e) => ({
		entity_id: e.entities[r.role] ?? "",
		confidence: e.confidence,
		reasons: e.reasons
	})).filter((e) => e.entity_id), a = await L(e, {
		heading: n(`action.need.pick.${r.role}`),
		tip: r.tip,
		filter: r.filter,
		selected: e.draft?.need?.[t] ? [e.draft.need[t]] : [],
		suggestions: Ye(i)
	});
	a && an(e, { [t]: a.selected[0] ?? null });
}
async function _n(e) {
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
var vn = T`
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
`, yn = /* @__PURE__ */ new Map();
function bn(e, t) {
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
function xn(e, t) {
	let n = {
		...e,
		...t
	};
	return t.point && e.point && (n.point = {
		...e.point,
		...t.point
	}), n;
}
var Sn = class extends x {
	constructor(...e) {
		super(...e), this.prefix = M, this.section = "night", this.saving = !1, this.problem = "", this.version = 0;
	}
	static {
		this.styles = [
			d,
			vn,
			T`
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
		let e = yn.get(this.key);
		return e ? bn(e.base, e.draft) : {};
	}
	get draft() {
		let e = this.action;
		return e && yn.has(this.key) ? xn(e, this.changes) : e;
	}
	get dirty() {
		let e = yn.get(this.key);
		return !!(e && !e.pending && this.action && Object.keys(bn(this.action, this.draft)).length);
	}
	setDraft(e) {
		let t = this.action, n = this.draft;
		t && n && (yn.set(this.key, {
			base: structuredClone(t),
			draft: {
				...n,
				...e
			},
			pending: !1
		}), this.problem = "", this.version++);
	}
	willUpdate(e) {
		e.has("action") && yn.get(this.key)?.pending && yn.delete(this.key);
	}
	render() {
		let { t: e, hass: t, draft: n } = this;
		return !e || !t || !n ? A : (this.version, C`<div class="fields">${fn(this, this.section)}</div>
      ${this.problem ? C`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.problem}</span></div>` : A}
      ${this.dirty ? C`<div class="steer-bar" role="region" aria-label=${e("action.steer.unsaved")}>
            <span class="unsaved">${e("action.steer.unsaved")}</span>
            <span class="with-tip" data-tipped>
              <button type="button" class="btn btn-primary" ?disabled=${this.saving} @click=${this.save}>${e("common.save")}</button>
              ${o(e, "a_save")}
            </span>
            <button type="button" class="btn btn-ghost" data-notip ?disabled=${this.saving} @click=${this.cancel}>${e("common.cancel")}</button>
          </div>` : A}`);
	}
	cancel() {
		yn.delete(this.key), this.problem = "", this.version++;
	}
	async save() {
		let e = this.draft, t = this.action;
		if (!e || !t || (this.problem = Ut(this.t, e, this.section), this.problem)) return;
		let n = bn(t, e);
		if (!Object.keys(n).length) {
			this.cancel();
			return;
		}
		let r = this.key;
		this.saving = !0;
		let i = await I(this, { actions: { [t.id]: n } });
		this.saving = !1, i && (yn.set(r, {
			base: structuredClone(t),
			draft: e,
			pending: !0
		}), this.version++);
	}
};
s([O({ attribute: !1 })], Sn.prototype, "hass", void 0), s([O({ attribute: !1 })], Sn.prototype, "t", void 0), s([O({ attribute: !1 })], Sn.prototype, "state", void 0), s([O({ attribute: !1 })], Sn.prototype, "discovery", void 0), s([O({ attribute: !1 })], Sn.prototype, "prefix", void 0), s([O({ attribute: !1 })], Sn.prototype, "action", void 0), s([O({ attribute: !1 })], Sn.prototype, "section", void 0), s([N()], Sn.prototype, "saving", void 0), s([N()], Sn.prototype, "problem", void 0), s([N()], Sn.prototype, "version", void 0);
var Cn = class extends x {
	constructor(...e) {
		super(...e), this.asking = !1, this.busy = !1;
	}
	static {
		this.styles = [d, T`
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
		if (!e || !t) return A;
		let n = this.config?.consumers.find((e) => e.id === t.consumer_id), r = tt(t, n);
		return this.asking ? C`<div data-tipped>
      <p class="ask" role="alert">${e(`action.delete.ask.${r}`, { name: t.name })}</p>
      <div class="row">
        <button type="button" class="btn btn-danger" ?disabled=${this.busy} @click=${this.removeAction}>${e("action.delete.yes")}</button>
        <button type="button" class="btn btn-ghost" ?disabled=${this.busy} @click=${() => this.asking = !1}>
          ${e("action.delete.no")}
        </button>
        ${o(e, "a_delete")}
      </div>
    </div>` : C`<div class="row" data-tipped>
        <button type="button" class="btn btn-danger" @click=${() => this.asking = !0}>${e("action.delete")}</button>
        ${o(e, "a_delete")}
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
		})), this.leave && w(this, this.leave, { replace: !0 }));
	}
};
s([O({ attribute: !1 })], Cn.prototype, "t", void 0), s([O({ attribute: !1 })], Cn.prototype, "config", void 0), s([O({ attribute: !1 })], Cn.prototype, "action", void 0), s([O({ attribute: !1 })], Cn.prototype, "leave", void 0), s([N()], Cn.prototype, "asking", void 0), s([N()], Cn.prototype, "busy", void 0);
var wn = class extends x {
	constructor(...e) {
		super(...e), this.failed = !1;
	}
	static {
		this.styles = [d, T`
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
		if (!e || !t || !n) return A;
		let r = t.plan?.window?.start, i = !!r && t.control?.tonight?.[n.id] === r, a = `tonight-${n.id}`;
		return C`<div class="tonight" data-tipped>
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
        ${o(e, "action_tonight")}
      </div>
      ${this.failed ? C`<p class="bad" role="status">${e("error.action")}</p>` : A}`;
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
s([O({ attribute: !1 })], wn.prototype, "hass", void 0), s([O({ attribute: !1 })], wn.prototype, "t", void 0), s([O({ attribute: !1 })], wn.prototype, "state", void 0), s([O({ attribute: !1 })], wn.prototype, "action", void 0), s([N()], wn.prototype, "failed", void 0);
function Tn(e, t, r) {
	let i = t.plan?.actions?.find((e) => e.id === r.id), a = t.control?.actions?.[r.id], o = i?.target == null ? "" : n(e.lang, i.target, 0);
	if (!r.enabled) return e("devices.action.disabled");
	if (a?.reason === "boost") return e("devices.action.boost");
	if (a?.on) return r.kind === "target" ? e("devices.action.heating", {
		target: o,
		end: S(a.end)
	}) : e("devices.action.running", { end: S(a.end) });
	if (a?.reason === "reached") {
		let a = t.control?.tonight_target?.[r.id];
		return r.kind === "switch" && a && a.night === t.plan?.window?.start ? e("devices.action.reached_need", {
			target: n(e.lang, a.chosen, 0),
			unit: a.unit
		}) : r.kind === "switch" ? i?.need && o ? e("devices.action.reached_need", {
			target: o,
			unit: i.need.target_unit === "km" ? "km" : "%"
		}) : e("devices.action.reached_plain") : e("devices.action.reached", { target: o });
	}
	if (!i) return e("devices.action.no_plan");
	let s = t.mode === "simulation" ? e("devices.action.would") : "";
	if (i.run) return `${s}${r.kind === "target" ? e("devices.action.plan_target", {
		start: S(i.start),
		target: o
	}) : e("devices.action.plan_run", {
		start: S(i.start),
		end: S(i.end)
	})}`;
	let c = i.reasons[i.reasons.length - 1] ?? "manual_only";
	return e.optional(`devices.action.why.${c}`, {
		kwh: n(e.lang, t.plan?.meta?.tomorrow_kwh ?? 0, 0),
		temperature: n(e.lang, i.temperature ?? 0, 0)
	}) ?? c;
}
j("joe-action-steer", Sn), j("joe-action-delete", Cn), j("joe-action-tonight", wn);
//#endregion
//#region src/editors/action-editor.ts
var V = class extends x {
	constructor(...e) {
		super(...e), this.prefix = M, this.actionId = "", this.section = "", this.consumer = "", this.subtitle = "", this.found = "", this.saving = !1, this.problem = "", this.touched = !1;
	}
	static {
		this.styles = [
			d,
			vn,
			T`
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
		return this.actionId.startsWith("new:") ? Ht(this.actionId.slice(4)) : this.openLayout ?? "night";
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
				let e = Bt(this.actionId.slice(4), this.t), [t, n] = this.found.split(/:(.*)/s), r = this.config?.actions ?? [], i = (this.discovery?.wallboxes ?? []).filter((e) => e.is_car), a = t === "wallbox" ? i.find((e) => (e.device_id ?? e.name) === n) : i.find((e) => !r.some((t) => t.id === `ev_${e.device_id}` || e.mode_entity && t.entity_id === e.mode_entity));
				this.actionId === "new:ev" && a && Object.assign(e, Vt(a));
				let o = this.config?.consumers.filter((e) => e.kind === "hot_water") ?? [];
				this.actionId === "new:hot_water" && o.length === 1 && (e.consumer_id = o[0].id);
				let s = this.config?.consumers.find((e) => e.id === this.consumer);
				s && (e.name = s.name, e.consumer_id = s.id, e.power_entity = s.power_entity ?? null), this.draft = e, this.touched = !1;
			} else if (this.existing) {
				this.draft = structuredClone(this.existing);
				let e = this.config?.consumers.find((e) => e.id === this.existing?.consumer_id);
				this.openLayout = Ht(tt(this.existing, e));
			}
		}
	}
	render() {
		let { t: e, hass: t, draft: n } = this;
		if (!e || !t || !n) return A;
		let r = this.existing, i = e(r ? "action.title" : `action.title.${this.actionId.slice(4)}`);
		return C`<div class="sheet-title">${b(i)}</div>
      ${this.subtitle ? C`<p class="sheet-sub">${this.subtitle}</p>` : A}
      ${fn(this, this.layout)}
      ${this.problem ? C`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.problem}</span></div>` : A}
      <div class="actions">
        <span data-tipped class="row">
          <button type="button" class="btn btn-primary" ?disabled=${this.saving} @click=${this.save}>${e("common.save")}</button>
          ${o(e, "a_save")}
        </span>
        <button type="button" class="btn btn-ghost" data-notip @click=${this.close}>${e("common.cancel")}</button>
      </div>
      ${r ? C`<div class="danger-zone">
            <joe-action-delete .t=${e} .config=${this.config} .action=${r} @joe-deleted=${this.close}></joe-action-delete>
          </div>` : A}`;
	}
	async save() {
		let e = this.draft;
		if (!e || (this.problem = Ut(this.t, e, this.layout), this.problem)) return;
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
s([O({ attribute: !1 })], V.prototype, "hass", void 0), s([O({ attribute: !1 })], V.prototype, "mailboxes", void 0), s([O({ attribute: !1 })], V.prototype, "accounts", void 0), s([O({ attribute: !1 })], V.prototype, "apps", void 0), s([O({ attribute: !1 })], V.prototype, "t", void 0), s([O({ attribute: !1 })], V.prototype, "config", void 0), s([O({ attribute: !1 })], V.prototype, "discovery", void 0), s([O({ attribute: !1 })], V.prototype, "prefix", void 0), s([O()], V.prototype, "actionId", void 0), s([O()], V.prototype, "section", void 0), s([O()], V.prototype, "consumer", void 0), s([O()], V.prototype, "subtitle", void 0), s([O()], V.prototype, "found", void 0), s([N()], V.prototype, "draft", void 0), s([N()], V.prototype, "saving", void 0), s([N()], V.prototype, "problem", void 0), j("joe-action-editor", V);
//#endregion
//#region src/components/look-back.ts
function En(e, t, n = "EUR", r = !1) {
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
function Dn(e, t = "EUR") {
	return new Intl.NumberFormat(e, {
		style: "currency",
		currency: t
	}).formatToParts(0).find((e) => e.type === "currency")?.value ?? t;
}
function On(e) {
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
function kn(e, t) {
	return t === 1 ? e("learn.nights.one") : e("learn.nights.many", { count: t });
}
//#endregion
//#region src/pages/devices/battery-fields.ts
var An = [
	"name",
	"capacity_kwh",
	"soc_entity",
	"power",
	"max_charge_w",
	"max_discharge_w",
	"floor_soc",
	"priority"
], jn = class extends x {
	constructor(...e) {
		super(...e), this.show = "all";
	}
	static {
		this.styles = [d, T`
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
		return this.draft ? this.draft : e ? Object.fromEntries(An.map((t) => [t, e[t]])) : void 0;
	}
	get capacityUnknown() {
		let e = this.battery;
		return this.unknown === void 0 ? !!(e && this.config?.answers[`capacity:${e.id}`] === "unknown") : this.unknown;
	}
	render() {
		let { t: e, hass: t, config: n, battery: r } = this, i = this.values;
		if (!e || !t || !n || !r || !i) return A;
		let a = this.show !== "power", o = this.show !== "steer";
		return C`${a ? this.renderName(e, r, i) : A} ${a ? this.renderCapacity(e, r, i) : A}
    ${o ? this.renderSensors(e, r, i) : A} ${a ? this.renderLimits(e, r, i) : A}`;
	}
	renderName(e, t, n) {
		return this.field(e("f.battery.name"), "f_battery_name", C`<input
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
	renderCapacity(t, r, i) {
		let a = this.hass, o = this.config, s = this.capacityUnknown, c = l(a, r.capacity_entity), u = o.learned?.battery_models?.[r.id];
		return this.field(t("f.battery.capacity"), "q_capacity", C`<div class="field-row">
          <span class="unit-input">
            <input
              class="input"
              type="number"
              inputmode="decimal"
              min="0.1"
              max="1000"
              step="0.01"
              aria-label=${t("f.battery.capacity")}
              .value=${i.capacity_kwh == null ? "" : String(i.capacity_kwh)}
              placeholder=${c == null ? t("f.unknown") : n(t.lang, c, 2)}
              @change=${(e) => {
			let t = Number.parseFloat(e.target.value.replace(",", "."));
			this.change({ capacity_kwh: Number.isFinite(t) && t > 0 ? t : null }, !1);
		}}
            />
            <span class="unit">kWh</span>
          </span>
          <button
            type="button"
            class="mini-btn ${s ? "go" : ""}"
            aria-pressed=${String(s)}
            @click=${() => s ? this.change({}, !1) : this.change({ capacity_kwh: null }, !0)}
          >
            ${t("ask.idk_learn")}
          </button>
        </div>
        ${c == null ? A : C`<p class="field-hint">${t("f.battery.capacity.read", { value: n(t.lang, c, 2) })}</p>`}
        ${u ? C`<p class="field-hint learned">
              ${e(t, { source: "learned" })}
              ${t("battery.page.capacity.learned", { value: H(t.lang, u.capacity_kwh, 1) })}
            </p>` : s ? C`<p class="field-hint">${t("battery.page.capacity.learning")}</p>` : A}`, e(t, P(o, `batteries[${r.id}].capacity_kwh`)));
	}
	renderSensors(t, n, r) {
		let i = this.hass, a = this.config;
		return C`${this.field(t("f.battery.soc"), "f_battery_soc", this.entityBox(t, r.soc_entity, ne(i, r.soc_entity, t.lang), () => this.pickSoc(r)), e(t, P(a, `batteries[${n.id}].soc_entity`)))}
    ${this.field(t("f.battery.power"), "f_battery_power", this.entityBox(t, r.power?.entity_id ?? null, this.powerText(t, r.power), () => this.pickPower(r)), e(t, P(a, `batteries[${n.id}].power`)))}`;
	}
	renderLimits(t, r, i) {
		let a = this.config, o = this.floor;
		return C`${this.field(t("f.battery.limits"), "f_battery_limits", C`<div class="limits">
        <label>${t("f.battery.max_charge")} ${this.kwInput(t, i.max_charge_w, "max_charge_w")}</label>
        <label>${t("f.battery.max_discharge")} ${this.kwInput(t, i.max_discharge_w, "max_discharge_w")}</label>
      </div>`)}
    ${this.field(t("f.battery.floor"), "f_battery_floor", C`<span class="unit-input">
          <input
            class="input"
            type="number"
            inputmode="decimal"
            min="0"
            max="100"
            step="1"
            aria-label=${t("f.battery.floor")}
            .value=${i.floor_soc == null ? "" : String(i.floor_soc)}
            placeholder=${o?.device == null ? t("f.unknown") : n(t.lang, o.device, 0)}
            @change=${(e) => {
			let t = Number.parseFloat(e.target.value.replace(",", "."));
			this.change({ floor_soc: Number.isFinite(t) ? Math.min(100, Math.max(0, t)) : null });
		}}
          />
          <span class="unit">%</span>
        </span>
        ${o?.device == null ? i.floor_soc == null ? C`<div class="note warn"><ha-icon icon="mdi:help-circle-outline"></ha-icon><span>${t("f.battery.floor.ask")}</span></div>` : A : C`<p class="field-hint">${t("f.battery.floor.read", { value: n(t.lang, o.device, 0) })}</p>`}`, e(t, P(a, `batteries[${r.id}].floor_soc`)))}
    ${a.batteries.length > 1 ? this.field(t("f.battery.priority"), "f_battery_priority", C`<span class="unit-input">
            <input
              class="input"
              type="number"
              inputmode="numeric"
              min="1"
              max="9"
              step="1"
              aria-label=${t("f.battery.priority")}
              .value=${String(i.priority)}
              @change=${(e) => {
			let t = Math.round(Number.parseFloat(e.target.value));
			this.change({ priority: Math.min(9, Math.max(1, Number.isFinite(t) ? t : 1)) });
		}}
            />
          </span>`) : A}`;
	}
	field(e, t, n, r) {
		let i = this.t;
		return C`<div class="field" data-tipped>
      <div class="field-label">${e} ${o(i, t)} ${r ?? A}</div>
      ${n}
    </div>`;
	}
	entityBox(e, t, n, r) {
		let i = this.hass;
		return C`<div class="entity">
      <span>
        ${t ? C`<b>${f(i, t)}</b><small>${n}</small>` : C`<small>${e("find.none")}</small>`}
      </span>
      <button type="button" class="mini-btn" @click=${r}>
        <ha-icon icon="mdi:magnify"></ha-icon>${e(t ? "review.change" : "review.choose")}
      </button>
    </div>`;
	}
	kwInput(e, t, n) {
		return C`<span class="unit-input">
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
		let r = this.hass, i = c(r, t);
		if (!t || i === null) return t ? ne(r, t.entity_id, e.lang) : "";
		let a = n(e.lang, Math.abs(i), 2);
		return e(i >= 0 ? "pick.preview.charge" : "pick.preview.discharge", { value: a });
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
s([O({ attribute: !1 })], jn.prototype, "hass", void 0), s([O({ attribute: !1 })], jn.prototype, "t", void 0), s([O({ attribute: !1 })], jn.prototype, "config", void 0), s([O({ attribute: !1 })], jn.prototype, "battery", void 0), s([O({ attribute: !1 })], jn.prototype, "floor", void 0), s([O({ attribute: !1 })], jn.prototype, "draft", void 0), s([O({ attribute: !1 })], jn.prototype, "unknown", void 0), s([O()], jn.prototype, "show", void 0), j("joe-battery-fields", jn);
//#endregion
//#region src/types.ts
var Mn = [
	"welcome",
	"scan",
	"questions",
	"done"
], Nn = [
	"min_soc",
	"grid_charge",
	"charge_target",
	"mode",
	"charge_power",
	"discharge_power",
	"discharge_limit",
	"discharge_limit_enabled"
], Pn = [
	"normal",
	"force_charge",
	"hold",
	"force_discharge"
], Fn = [
	"home_office",
	"office",
	"travel",
	"vacation",
	"guests",
	"home"
], In = [
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
function Ln(e) {
	let t = e.filter((e) => e.kind !== "submeter" && (e.kind === "ev" && (e.runs ?? "auto") !== "always" || e.runs === "surplus" || e.runs === "cheap")), n = new Set(t.map((e) => e.energy_entity).filter(Boolean));
	return t.filter((e) => !e.included_in || !n.has(e.included_in));
}
var Rn = [
	"forecast",
	"consumption",
	"battery",
	"hot_water",
	"car"
], zn = [
	"normal",
	"holiday",
	"away",
	"home_office"
], Bn = ["heat", "cool"], Vn = {
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
	allow_discharge: "toggle"
}, Hn = [
	"charge",
	"hold",
	"release"
];
function Un(e) {
	let t = (...t) => t.every((t) => !!e.controls[t]), n = (t) => !!e.mode_options[t], r = [];
	t("mode") && n("force_charge") && r.push("mode"), t("grid_charge", "charge_target") && r.push("target"), t("grid_charge", "min_soc") && r.push("min_soc");
	let i = [];
	return t("min_soc") && i.push("min_soc"), t("mode") && n("hold") && i.push("mode_hold"), t("mode", "charge_power") && n("force_charge") && i.push("standby"), t("discharge_limit") && i.push("limit"), {
		charge: r,
		hold: i
	};
}
function Wn(e) {
	return {
		adapter: e.adapter,
		controls: structuredClone(e.controls),
		mode_options: structuredClone(e.mode_options),
		steps: structuredClone(e.steps)
	};
}
function Gn(e, t, n) {
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
var Kn = class extends x {
	static {
		this.styles = [d, T`
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
      }
      .row .entity {
        min-width: 0;
      }
      .row .entity b {
        display: block;
        font-weight: 600;
        overflow-wrap: anywhere;
      }
      .row .entity small {
        color: var(--joe-muted);
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
      .ready {
        margin-top: 12px;
      }
      .step-value {
        width: 100%;
        min-width: 0;
      }
      @media (pointer: coarse) {
        .icon-btn {
          width: 44px;
          height: 44px;
        }
      }
      @media (max-width: 520px) {
        .row {
          grid-template-columns: 1fr auto;
        }
        .row label,
        .row .label {
          grid-column: 1 / -1;
        }
      }
    `];
	}
	get profileKey() {
		let e = this.battery;
		if (e && ![
			"none",
			"generic",
			"steps"
		].includes(e.adapter)) return e.adapter;
		let t = this.found;
		return t && t.controllable && t.adapter !== "none" ? t.adapter : null;
	}
	get choice() {
		let e = this.value?.adapter ?? "none";
		return e === "none" ? "watch" : e === "generic" ? "generic" : e === "steps" ? "steps" : "profile";
	}
	render() {
		let { t: e, value: t } = this;
		if (!e || !t) return A;
		let n = [
			"watch",
			...this.profileKey ? ["profile"] : [],
			"generic",
			"steps"
		], r = this.found?.suggested;
		return C`<div class="choose">
        <div class="seg" role="group" aria-label=${e("f.battery.control")}>
          ${n.map((t) => C`<button type="button" aria-pressed=${String(this.choice === t)} @click=${() => this.choose(t)}>
                ${t === "profile" ? e("f.battery.control.profile", { name: this.profiles?.[this.profileKey ?? ""] ?? this.profileKey ?? "" }) : e(`f.battery.control.${t}`)}
              </button>`)}
        </div>
      </div>
      ${this.choice === "watch" && r?.complete ? C`<div class="note" data-tipped>
            <ha-icon icon="mdi:lightbulb-on-outline"></ha-icon>
            <span
              >${e("f.battery.control.suggested")}
              <div class="note-actions">
                <button type="button" class="mini-btn go" @click=${this.takeSuggestion}>${e("f.battery.control.take")}</button>
                ${o(e, "control_roles")}
              </div></span
            >
          </div>` : A}
      ${this.choice === "profile" && Object.keys(t.steps).length && !Object.keys(t.controls).length ? this.renderServiceSteps(e, t) : this.choice === "profile" || this.choice === "generic" ? this.renderRoles(e, t) : A}
      ${this.choice === "steps" ? this.renderSteps(e, t) : A}
      ${this.choice === "watch" ? A : C`<p class="field-hint">${e("f.battery.control.retest")}</p>`}`;
	}
	renderRoles(e, t) {
		let n = this.hass, r = Un(t), i = r.charge.length && r.hold.length, a = t.controls.mode, s = a ? n.states[a]?.attributes.options ?? [] : [];
		return C`<div data-tipped>
      <div class="sub">${e("f.battery.control.levers")} ${o(e, "control_roles")}</div>
      <div class="rows">
        ${Nn.map((r) => {
			let i = t.controls[r];
			return C`<div class="row">
            <span class="label">${e(`role.${r}`)}</span>
            <span class="entity">
              ${i ? C`<b>${f(n, i)}</b><small>${ne(n, i, e.lang)}</small>` : C`<small>${e("find.none")}</small>`}
            </span>
            <span class="buttons">
              <button type="button" class="mini-btn" @click=${() => this.pickRole(r)}>
                <ha-icon icon="mdi:magnify"></ha-icon>${e(i ? "review.change" : "review.choose")}
              </button>
              ${i ? C`<button
                    type="button"
                    class="icon-btn"
                    aria-label=${e("f.remove")}
                    title=${e("f.remove")}
                    @click=${() => this.setRole(r, null)}
                  >
                    <ha-icon icon="mdi:close"></ha-icon>
                  </button>` : A}
            </span>
          </div>`;
		})}
      </div>
      </div>
      ${a ? C`<div data-tipped>
            <div class="sub">${e("f.battery.mode_options")} ${o(e, "mode_options")}</div>
            <div class="rows">
              ${Pn.map((n) => C`<div class="row">
                  <label for="opt-${n}">${e(`meaning.${n}`)}</label>
                  <select
                    id="opt-${n}"
                    class="input"
                    @change=${(e) => this.setOption(n, e.target.value)}
                  >
                    <option value="" ?selected=${!t.mode_options[n]}>${e("meaning.none")}</option>
                    ${s.map((e) => C`<option value=${e} ?selected=${t.mode_options[n] === e}>${e}</option>`)}
                  </select>
                  <span></span>
                </div>`)}
            </div>
            </div>` : A}
      <div class="note ${i ? "" : "warn"} ready">
        <ha-icon icon=${i ? "mdi:check-circle-outline" : "mdi:alert-outline"}></ha-icon>
        <span
          >${i ? e("f.battery.control.ready", {
			charge: r.charge.map((t) => e(`method.${t}`)).join(", "),
			hold: r.hold.map((t) => e(`method.${t}`)).join(", ")
		}) : e("f.battery.control.needs")}</span
        >
      </div>`;
	}
	renderServiceSteps(e, t) {
		let n = this.hass;
		return C`<div data-tipped>
      <div class="sub">${e("f.battery.control.services")} ${o(e, "control_steps")}</div>
      <div class="rows">
        ${Hn.flatMap((r) => (t.steps[r] ?? []).map((t) => C`<div class="row">
              <span class="label">${e(`f.battery.steps.${r}`)}</span>
              <span class="entity">
                ${t.service ? C`<b>${t.service}</b>` : C`<b>${f(n, t.entity_id ?? "")}</b><small>${String(t.value ?? "")}</small>`}
              </span>
              <span></span>
            </div>`))}
      </div>
    </div>`;
	}
	renderSteps(e, t) {
		let n = this.hass;
		return C`<div class="sub" data-tipped>${e("f.battery.control.steps")} ${o(e, "control_steps")}</div>
      <p class="field-hint">${e("f.battery.steps.hint")}</p>
      ${Hn.map((r) => {
			let i = t.steps[r] ?? [];
			return C`<div class="sub">${e(`f.battery.steps.${r}`)}</div>
          <div class="rows" data-tipped>
            ${i.map((t, i) => C`<div class="row">
                <span class="entity"
                  ><b>${t.service ?? f(n, t.entity_id ?? "")}</b><small>${t.entity_id ?? ""}</small></span
                >
                <input
                  class="input step-value"
                  type="text"
                  aria-label=${e("f.battery.steps.value")}
                  placeholder=${e("f.battery.steps.value")}
                  list="values-${r}-${i}"
                  .value=${t.value == null ? "" : String(t.value)}
                  @change=${(e) => this.setStep(r, i, e.target.value)}
                />
                <datalist id="values-${r}-${i}">
                  ${this.valueHints(t.entity_id ?? "", r).map((e) => C`<option value=${e}></option>`)}
                </datalist>
                <button
                  type="button"
                  class="icon-btn"
                  aria-label=${e("f.remove")}
                  title=${e("f.remove")}
                  @click=${() => this.removeStep(r, i)}
                >
                  <ha-icon icon="mdi:close"></ha-icon>
                </button>
              </div>`)}
            <div>
              <button type="button" class="mini-btn" @click=${() => this.addStep(r)}>
                <ha-icon icon="mdi:plus"></ha-icon>${e("f.battery.steps.add")}
              </button>
              ${o(e, "control_steps")}
            </div>
          </div>`;
		})}`;
	}
	valueHints(e, t) {
		let n = e.split(".", 1)[0];
		return ["switch", "input_boolean"].includes(n) ? ["on", "off"] : ["select", "input_select"].includes(n) ? this.hass?.states[e]?.attributes.options ?? [] : ["number", "input_number"].includes(n) ? t === "charge" ? ["{target}", "{power}"] : t === "hold" ? ["{floor}"] : [] : [];
	}
	choose(e) {
		let t = this.value;
		if (e === "watch") this.emit({
			...t,
			adapter: "none"
		});
		else if (e === "profile") {
			let e = this.profileKey, n = this.battery?.adapter === e ? this.battery : void 0;
			this.emit({
				...t,
				adapter: e,
				controls: { ...n?.controls ?? this.found?.controls ?? t.controls },
				mode_options: { ...n?.mode_options ?? {} }
			});
		} else if (e === "generic") {
			let e = !Object.keys(t.controls).length, n = this.found?.suggested;
			this.emit({
				...t,
				adapter: "generic",
				controls: e && n ? { ...n.controls } : t.controls,
				mode_options: e && n ? { ...n.mode_options } : t.mode_options
			});
		} else this.emit({
			...t,
			adapter: "steps"
		});
	}
	takeSuggestion() {
		let e = this.found?.suggested;
		e && this.emit({
			...this.value,
			adapter: "generic",
			controls: { ...e.controls },
			mode_options: { ...e.mode_options }
		});
	}
	async pickRole(e) {
		let t = this.t, n = this.value.controls[e], r = await L(this, {
			heading: t("pick.role.title", { role: t(`role.${e}`) }),
			tip: "control_roles",
			filter: Vn[e],
			selected: n ? [n] : [],
			suggestions: this.nearby(Vn[e]).map((e) => ({ entity_id: e }))
		});
		r?.selected[0] && this.setRole(e, r.selected[0]);
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
			filter: "writable",
			selected: []
		}))?.selected[0];
		if (!n) return;
		let r = {
			entity_id: n,
			value: this.valueHints(n, e)[0] ?? null
		}, i = this.value;
		this.emit({
			...i,
			steps: {
				...i.steps,
				[e]: [...i.steps[e] ?? [], r]
			}
		});
	}
	setStep(e, t, n) {
		let r = this.value, i = [...r.steps[e] ?? []], a = Number(n.replace(",", ".")), o = n.trim() === "" ? null : n.startsWith("{") || Number.isNaN(a) ? n.trim() : a;
		i[t] = {
			...i[t],
			value: o
		}, this.emit({
			...r,
			steps: {
				...r.steps,
				[e]: i
			}
		});
	}
	removeStep(e, t) {
		let n = this.value, r = (n.steps[e] ?? []).filter((e, n) => n !== t);
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
s([O({ attribute: !1 })], Kn.prototype, "hass", void 0), s([O({ attribute: !1 })], Kn.prototype, "t", void 0), s([O({ attribute: !1 })], Kn.prototype, "battery", void 0), s([O({ attribute: !1 })], Kn.prototype, "found", void 0), s([O({ attribute: !1 })], Kn.prototype, "value", void 0), s([O({ attribute: !1 })], Kn.prototype, "profiles", void 0), j("joe-battery-control", Kn);
//#endregion
//#region src/editors/battery-editor.ts
var qn = [
	"adapter",
	"controls",
	"mode_options",
	"steps",
	"prepare"
], Jn = class extends x {
	constructor(...e) {
		super(...e), this.batteryId = "", this.unknown = !1, this.saving = !1;
	}
	static {
		this.styles = [d, T`
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
		(e.has("config") || e.has("batteryId")) && t && !this.values && (this.values = Object.fromEntries(An.map((e) => [e, structuredClone(t[e])])), this.control = {
			...Wn(t),
			prepare: structuredClone(t.prepare)
		}, this.unknown = this.config?.answers[`capacity:${t.id}`] === "unknown");
	}
	render() {
		let { t: e, hass: t, config: n, values: r, control: i } = this, a = this.battery;
		if (!e || !t || !n || !r || !i || !a) return A;
		let s = this.discovery?.batteries.find((e) => e.id === a.id);
		return C`<div class="sheet-title">${b(e("edit.battery.title", { name: a.name }))}</div>
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
        <div class="field-label">${e("f.battery.control")} ${o(e, "control_choice")}</div>
        <joe-battery-control
          .hass=${t}
          .t=${e}
          .battery=${a}
          .found=${s}
          .profiles=${this.info?.profiles}
          .value=${i}
          @joe-control-change=${(e) => {
			this.control = Gn(a, e.detail, s);
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
		for (let t of [...An, ...qn]) JSON.stringify(e[t] ?? null) !== JSON.stringify(i[t] ?? null) && (a[t] = i[t]);
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
s([O({ attribute: !1 })], Jn.prototype, "hass", void 0), s([O({ attribute: !1 })], Jn.prototype, "t", void 0), s([O({ attribute: !1 })], Jn.prototype, "config", void 0), s([O({ attribute: !1 })], Jn.prototype, "discovery", void 0), s([O({ attribute: !1 })], Jn.prototype, "info", void 0), s([O({ attribute: !1 })], Jn.prototype, "floor", void 0), s([O()], Jn.prototype, "batteryId", void 0), s([N()], Jn.prototype, "values", void 0), s([N()], Jn.prototype, "control", void 0), s([N()], Jn.prototype, "unknown", void 0), s([N()], Jn.prototype, "saving", void 0), j("joe-battery-editor", Jn);
//#endregion
//#region src/fonts.ts
var Yn = [
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
function Xn() {
	if (document.getElementById("energy-joe-fonts")) return;
	let e = document.createElement("style");
	e.id = "energy-joe-fonts", e.textContent = Yn.map(([e, t, n, r]) => `@font-face{font-family:"${e}";font-style:${n};font-weight:${t};font-display:swap;src:url("${Me(`fonts/${r}.woff2`)}") format("woff2")}`).join("\n"), document.head.appendChild(e);
}
//#endregion
//#region node_modules/lit-html/directive-helpers.js
var { I: Zn } = me, Qn = (e) => e, $n = (e) => e.strings === void 0, er = () => document.createComment(""), tr = (e, t, n) => {
	let r = e._$AA.parentNode, i = t === void 0 ? e._$AB : t._$AA;
	if (n === void 0) n = new Zn(r.insertBefore(er(), i), r.insertBefore(er(), i), e, e.options);
	else {
		let t = n._$AB.nextSibling, a = n._$AM, o = a !== e;
		if (o) {
			let t;
			n._$AQ?.(e), n._$AM = e, n._$AP !== void 0 && (t = e._$AU) !== a._$AU && n._$AP(t);
		}
		if (t !== i || o) {
			let e = n._$AA;
			for (; e !== t;) {
				let t = Qn(e).nextSibling;
				Qn(r).insertBefore(e, i), e = t;
			}
		}
	}
	return n;
}, nr = (e, t, n = e) => (e._$AI(t, n), e), rr = {}, ir = (e, t = rr) => e._$AH = t, ar = (e) => e._$AH, or = (e) => {
	e._$AR(), e._$AA.remove();
}, sr = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, cr = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), lr = class {
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
}, ur = (e, t) => {
	let n = e._$AN;
	if (n === void 0) return !1;
	for (let e of n) e._$AO?.(t, !1), ur(e, t);
	return !0;
}, dr = (e) => {
	let t, n;
	do {
		if ((t = e._$AM) === void 0) break;
		n = t._$AN, n.delete(e), e = t;
	} while (n?.size === 0);
}, fr = (e) => {
	for (let t; t = e._$AM; e = t) {
		let n = t._$AN;
		if (n === void 0) t._$AN = n = /* @__PURE__ */ new Set();
		else if (n.has(e)) break;
		n.add(e), hr(t);
	}
};
function pr(e) {
	this._$AN === void 0 ? this._$AM = e : (dr(this), this._$AM = e, fr(this));
}
function mr(e, t = !1, n = 0) {
	let r = this._$AH, i = this._$AN;
	if (i !== void 0 && i.size !== 0) {
		if (t) {
			if (Array.isArray(r)) for (let e = n; e < r.length; e++) ur(r[e], !1), dr(r[e]);
			else r != null && (ur(r, !1), dr(r));
		} else ur(this, e);
	}
}
var hr = (e) => {
	e.type == sr.CHILD && (e._$AP ??= mr, e._$AQ ??= pr);
}, gr = class extends lr {
	constructor() {
		super(...arguments), this._$AN = void 0;
	}
	_$AT(e, t, n) {
		super._$AT(e, t, n), fr(this), this.isConnected = e._$AU;
	}
	_$AO(e, t = !0) {
		e !== this.isConnected && (this.isConnected = e, e ? this.reconnected?.() : this.disconnected?.()), t && (ur(this, e), dr(this));
	}
	setValue(e) {
		if ($n(this._$Ct)) this._$Ct._$AI(e, this);
		else {
			let t = [...this._$Ct._$AH];
			t[this._$Ci] = e, this._$Ct._$AI(t, this, 0);
		}
	}
	disconnected() {}
	reconnected() {}
}, _r = /* @__PURE__ */ new WeakMap(), vr = cr(class extends gr {
	render(e) {
		return A;
	}
	update(e, [t]) {
		let n = t !== this.G;
		return n && this.rt(void 0), (n || this.lt !== this.ct) && (this.G = t, this.ht = e.options?.host, this.rt(this.ct = e.element)), A;
	}
	rt(e) {
		if (this.G !== void 0) {
			if (this.isConnected || (e = void 0), typeof this.G == "function") {
				let t = this.ht ?? globalThis, n = _r.get(t);
				n === void 0 && (n = /* @__PURE__ */ new WeakMap(), _r.set(t, n)), n.get(this.G) !== void 0 && this.G.call(this.ht, void 0), n.set(this.G, e), e !== void 0 && this.G.call(this.ht, e);
			} else this.G.value = e;
		}
	}
	get lt() {
		return typeof this.G == "function" ? _r.get(this.ht ?? globalThis)?.get(this.G) : this.G?.value;
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
function yr(e) {
	e instanceof HTMLElement && requestAnimationFrame(() => {
		let t = e.parentElement;
		if (!t || t.scrollWidth <= t.clientWidth) return;
		let n = e.offsetLeft;
		(n < t.scrollLeft || n + e.offsetWidth > t.scrollLeft + t.clientWidth) && (t.scrollLeft = n - (t.clientWidth - e.offsetWidth) / 2);
	});
}
function br() {}
var xr = /* @__PURE__ */ new WeakSet();
function Sr(e) {
	if (!(e instanceof HTMLElement)) return;
	let t = () => {
		let t = [];
		e.scrollLeft > 4 && t.push("left"), e.scrollLeft + e.clientWidth < e.scrollWidth - 4 && t.push("right"), e.dataset.more = t.join(" ");
	};
	xr.has(e) || (xr.add(e), e.addEventListener("scroll", t, { passive: !0 }), new ResizeObserver(t).observe(e)), requestAnimationFrame(() => requestAnimationFrame(t));
}
function Cr(e, t, n, r, i) {
	return C`<nav class="section-chips" aria-label=${e("nav.sections")} ${vr(Sr)}>
    ${r.map((e) => {
		let r = e.id === i, a = {
			tab: n,
			section: e.id
		};
		return C`<a
        class="section-chip ${r ? "on" : ""}"
        href=${k(t, a)}
        aria-current=${r ? "page" : "false"}
        @click=${D(a)}
        ${vr(r ? yr : br)}
      >
        <ha-icon icon=${e.icon}></ha-icon>
        <span>${e.label}</span>
        ${e.count ? C`<span class="section-count">${e.count}</span>` : A}
        ${e.problem ? C`<i class="section-problem" aria-hidden="true"></i>` : A}
      </a>`;
	})}
  </nav>`;
}
//#endregion
//#region node_modules/lit-html/directives/keyed.js
var wr = cr(class extends lr {
	constructor() {
		super(...arguments), this.key = A;
	}
	render(e, t) {
		return this.key = e, t;
	}
	update(e, [t, n]) {
		return t !== this.key && (ir(e), this.key = t), n;
	}
});
//#endregion
//#region src/components/car-search.ts
async function Tr(e, t) {
	if (!t) return;
	let n = await t.callWS({ type: "energy_joe/discover" });
	return e.dispatchEvent(new CustomEvent("joe-discovery", {
		detail: n,
		bubbles: !0,
		composed: !0
	})), n;
}
async function Er(e, t, n) {
	return (await e.callWS({
		type: "energy_joe/car/attach",
		car: t,
		sources: n
	}))?.car ?? void 0;
}
var W = class extends x {
	constructor(...e) {
		super(...e), this.prefix = M, this.searching = !1, this.searched = !1, this.failed = !1, this.busy = !1, this.picked = [], this.asking = !1;
	}
	static {
		this.styles = [d, T`
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
		if (!e || !t) return A;
		let n = this.found ?? this.discovery, r = De(t.config, n);
		return C`<div class="head" data-tipped>
        <button type="button" class="btn btn-secondary" ?disabled=${this.searching || this.busy} @click=${this.search}>
          <ha-icon icon="mdi:magnify"></ha-icon>${e("car.search")}
        </button>
        ${o(e, "car_search")}
      </div>
      ${this.searching ? C`<p class="muted" role="status">${e("car.search.busy")}</p>` : A}
      ${this.failed ? C`<p class="bad" role="status">${e("car.search.failed")}</p>` : A}
      ${this.car ? this.renderAttach(e, this.car, r) : this.searched && !this.searching ? this.renderAll(e, r) : A}`;
	}
	renderAll(e, t) {
		return t.length ? C`<p class="lead">${e("car.search.lead")}</p>
      <ul class="finds">
        ${t.map((t) => C`<li data-tipped>
            <ha-icon icon=${t.source.kind === "evcc" ? "mdi:ev-station" : "mdi:car-connected"}></ha-icon>
            ${this.what(e, t)}
            <span class="acts">
              ${t.car ? C`<a class="mini-btn" href=${k(this.prefix, h(t.car.id, "sources"))} @click=${D(h(t.car.id, "sources"))}
                    >${e("car.find.open")}</a
                  >` : C`<button type="button" class="mini-btn go" ?disabled=${this.busy} @click=${() => this.useAsNew(t)}>
                    ${e(t.ignored ? "car.find.reuse" : "car.find.use")}
                  </button>`}
              ${o(e, "car_search_use")}
            </span>
          </li>`)}
      </ul>` : C`<p class="muted">${e("car.search.none")}</p>`;
	}
	renderAttach(e, t, n) {
		let r = n.filter((e) => e.car?.id !== t.id), i = r.filter((e) => this.picked.includes(e.source.id));
		return this.asking ? this.renderAsk(e, t, i) : C`<p class="lead">${e("car.attach.lead", { car: t.name })}</p>
      ${r.length ? C`<ul class="finds">
            ${r.map((t) => {
			let n = this.picked.includes(t.source.id);
			return C`<li>
                <button type="button" class="pick" aria-pressed=${n ? "true" : "false"} ?disabled=${this.busy} @click=${() => this.toggle(t.source.id)}>
                  <ha-icon icon=${n ? "mdi:checkbox-marked-circle" : "mdi:checkbox-blank-circle-outline"}></ha-icon>
                  ${this.what(e, t)}
                </button>
              </li>`;
		})}
          </ul>` : this.searching ? A : C`<p class="muted">${e("car.attach.none")}</p>`}
      ${r.length ? C`<div class="row" data-tipped>
            <button type="button" class="mini-btn go" ?disabled=${this.busy || !i.length} @click=${() => this.attach(t, i)}>
              <ha-icon icon="mdi:link-variant-plus"></ha-icon>${e("car.attach.do", { car: t.name })}
            </button>
            ${o(e, "car_attach")}
          </div>` : A}`;
	}
	renderAsk(e, t, n) {
		let r = n.filter((e) => e.car), i = [...new Set(r.map((e) => e.car))].filter((e) => e.sources.every((e) => n.some((t) => t.source.id === e.id)));
		return C`<div class="ask" role="alert" data-tipped>
      ${r.map((n) => C`<p>${e("car.attach.ask", {
			name: n.source.name ?? g(e, n.source),
			from: n.car.name,
			car: t.name
		})}</p>`)}
      ${i.map((t) => C`<p>${e("car.attach.empty", { from: t.name })}</p>`)}
      <div class="row">
        <button type="button" class="mini-btn go" ?disabled=${this.busy} @click=${() => this.attach(t, n, !0)}>${e("car.attach.yes")}</button>
        <button type="button" class="mini-btn quiet" ?disabled=${this.busy} @click=${() => this.asking = !1}>${e("car.attach.no")}</button>
        ${o(e, "car_attach")}
      </div>
    </div>`;
	}
	what(e, t) {
		let n = g(e, t.source), r = t.car ? e(this.car ? "car.attach.from" : "car.find.of", { car: t.car.name }) : t.ignored ? e("car.find.ignored") : e("car.find.new");
		return C`<span class="what">
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
			this.found = await Tr(this, this.hass) ?? this.found, this.searched = !0;
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
				await Er(this.hass, e.id, t.map((e) => e.source.id)), this.picked = [], this.asking = !1, this.dispatchEvent(new CustomEvent("joe-attached", {
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
				let t = await Er(this.hass, null, [e.source.id]);
				t && w(this, h(t));
			} catch {
				this.failed = !0;
			}
			this.busy = !1;
		}
	}
};
s([O({ attribute: !1 })], W.prototype, "hass", void 0), s([O({ attribute: !1 })], W.prototype, "t", void 0), s([O({ attribute: !1 })], W.prototype, "state", void 0), s([O({ attribute: !1 })], W.prototype, "discovery", void 0), s([O({ attribute: !1 })], W.prototype, "prefix", void 0), s([O({ attribute: !1 })], W.prototype, "car", void 0), s([N()], W.prototype, "searching", void 0), s([N()], W.prototype, "searched", void 0), s([N()], W.prototype, "failed", void 0), s([N()], W.prototype, "busy", void 0), s([N()], W.prototype, "found", void 0), s([N()], W.prototype, "picked", void 0), s([N()], W.prototype, "asking", void 0), j("joe-car-search", W);
//#endregion
//#region src/components/car-steer.ts
var Dr = /* @__PURE__ */ new Map(), Or = (e, t) => JSON.stringify(e ?? null) === JSON.stringify(t ?? null);
function kr(e, t) {
	let n = {};
	for (let r of Object.keys(t)) if (!(r === "id" || Or(t[r], e[r]))) {
		if (r === "need") {
			let r = {};
			for (let [n, i] of Object.entries(t.need)) Or(i, e.need[n]) || (r[n] = i);
			n.need = r;
		} else n[r] = t[r];
	}
	return n;
}
function Ar(e, t) {
	let n = {
		...e,
		...t
	};
	return t.need && (n.need = {
		...e.need,
		...t.need
	}), n;
}
var jr = /^([01]\d|2[0-3]):[0-5]\d$/, Mr = class extends x {
	constructor(...e) {
		super(...e), this.prefix = M, this.section = "need", this.saving = !1, this.problem = "", this.version = 0;
	}
	static {
		this.styles = [
			d,
			vn,
			T`
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
		let e = Dr.get(this.key);
		return e ? kr(e.base, e.draft) : {};
	}
	get draft() {
		let e = this.car;
		return e && Dr.has(this.key) ? Ar(e, this.changes) : e;
	}
	get dirty() {
		let e = Dr.get(this.key);
		return !!(e && !e.pending && this.car && Object.keys(kr(this.car, this.draft)).length);
	}
	setDraft(e) {
		let t = this.car, n = this.draft;
		t && n && (Dr.set(this.key, {
			base: structuredClone(t),
			draft: {
				...n,
				...e
			},
			pending: !1
		}), this.problem = "", this.version++);
	}
	willUpdate(e) {
		e.has("car") && Dr.get(this.key)?.pending && Dr.delete(this.key);
	}
	render() {
		let { t: e, hass: t, draft: n } = this;
		return !e || !t || !n ? A : (this.version, C`<div class="fields">${this.fields(e, n)}</div>
      ${this.problem ? C`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.problem}</span></div>` : A}
      ${this.dirty ? C`<div class="steer-bar" role="region" aria-label=${e("action.steer.unsaved")}>
            <span class="unsaved">${e("action.steer.unsaved")}</span>
            <span class="with-tip" data-tipped>
              <button type="button" class="btn btn-primary" ?disabled=${this.saving} @click=${this.save}>${e("common.save")}</button>
              ${o(e, "car_save")}
            </span>
            <button type="button" class="btn btn-ghost" data-notip ?disabled=${this.saving} @click=${this.cancel}>${e("common.cancel")}</button>
          </div>` : A}`);
	}
	fields(e, t) {
		return this.section === "calendars" ? ln(this) : this.section === "manual" ? C`${cn(this)}
      ${B(e, e("car.f.tracker"), "car_tracker", Wt(this, t.tracker_entity ?? "", () => this.pickTracker()))}` : C`${sn(this)}
      ${B(e, e("car.f.remind"), "car_remind", C`<div class="row">
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
			jr.test(t) && this.setDraft({ remind_time: t });
		}}
          />
        </div>`)}
      ${B(e, e("car.f.name"), "car_name", C`<input
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
		Dr.delete(this.key), this.problem = "", this.version++;
	}
	async save() {
		let e = this.draft, t = this.car;
		if (!e || !t) return;
		let n = kr(t, e);
		if (!Object.keys(n).length) {
			this.cancel();
			return;
		}
		let r = this.key;
		this.saving = !0;
		let i = await I(this, { cars: { [t.id]: n } });
		this.saving = !1, i && (Dr.set(r, {
			base: structuredClone(t),
			draft: e,
			pending: !0
		}), this.version++);
	}
};
s([O({ attribute: !1 })], Mr.prototype, "hass", void 0), s([O({ attribute: !1 })], Mr.prototype, "t", void 0), s([O({ attribute: !1 })], Mr.prototype, "state", void 0), s([O({ attribute: !1 })], Mr.prototype, "discovery", void 0), s([O({ attribute: !1 })], Mr.prototype, "prefix", void 0), s([O({ attribute: !1 })], Mr.prototype, "car", void 0), s([O({ attribute: !1 })], Mr.prototype, "section", void 0), s([N()], Mr.prototype, "saving", void 0), s([N()], Mr.prototype, "problem", void 0), s([N()], Mr.prototype, "version", void 0);
function Nr(e) {
	return {
		name: e,
		sources: [],
		tracker_entity: null,
		need: { ...It },
		remind: !0,
		remind_time: "20:00"
	};
}
j("joe-car-steer", Mr);
//#endregion
//#region src/pages/devices/device-actions.ts
async function Pr(e, t, n) {
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
		answers: { ignored: Je(t, `battery:${n.id}`, !1) }
	}, "read") ? n.id : null;
}
async function Fr(e, t, n, r) {
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
		name: a && (n.devices?.[a]?.name_by_user || n.devices?.[a]?.name) || f(n, i),
		adapter: "none",
		soc_entity: i,
		device_id: a ?? null,
		priority: Math.min(r.batteries.length + 1, 9)
	} } }) ? o : null;
}
function Ir(e, t, n) {
	return I(e, { answers: { ignored: Je(t, n, !0) } });
}
//#endregion
//#region src/components/ha-open.ts
function Lr(e, t, n) {
	return {
		deviceId: t ? e?.entities?.[t]?.device_id ?? null : null,
		entityId: t ?? null,
		name: n
	};
}
function Rr(e, t) {
	let { deviceId: n, entityId: r, name: i } = t;
	if (n) {
		let t = `/config/devices/device/${n}`, r = e("ha.open.device", { name: i });
		return C`<a
      class="ha-open"
      data-notip
      href=${t}
      title=${r}
      aria-label=${r}
      @click=${(e) => {
			e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0 || (e.preventDefault(), ae(t));
		}}
      ><ha-icon icon="mdi:open-in-new"></ha-icon
    ></a>`;
	}
	if (r) {
		let t = e("ha.open.entity", { name: i });
		return C`<button
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
	return A;
}
//#endregion
//#region src/components/device-card.ts
function zr(e, t, n) {
	return C`<article class="dcard ${n.problem ? "problem" : ""}">
    <a class="dcard-main" href=${k(t, n.to)} @click=${D(n.to, n.sheet ? { sheet: !0 } : void 0)}>
      <ha-icon icon=${n.icon}></ha-icon>
      <span class="dcard-text">
        <span class="dcard-name"
          >${n.name}${n.problem ? C`<i class="dcard-dot" aria-hidden="true"></i>` : A}</span
        >
        ${n.area ? C`<span class="dcard-area">${n.area}</span>` : A}
        ${n.state ? C`<span class="dcard-state">${n.state}</span>` : A}
        ${n.problem ? C`<span class="dcard-problem">${n.problem}</span>` : A}
        ${n.role ? C`<span class="dcard-meta"><span class="chip">${e(`devices.role.${n.role}`)}</span></span>` : A}
      </span>
    </a>
    ${Rr(e, n.ha)}
    ${n.quick ? C`<div class="dcard-quick">${n.quick}</div>` : A}
  </article>`;
}
function Br(e, t, r, i) {
	let a = y(t, pe(r, i, "soc")?.entity), o = y(t, pe(r, i, "range")?.entity);
	return [a === null ? null : `${n(e.lang, a, 0)} %`, o === null ? null : `${n(e.lang, o, 0)} km`].filter(Boolean).join(" · ");
}
function Vr(e, t) {
	return t === null ? void 0 : e("devices.card.kw", { value: n(e.lang, t, t >= 10 ? 1 : 2) });
}
function Hr(e, t, r, i) {
	if (!t) return;
	if (i.unassigned) return e(i.deviceId ? "devices.card.unassigned" : "devices.card.unassigned_kind");
	if (i.setup) return e(i.setup === "wallbox" ? "devices.card.setup_car" : "devices.card.setup_hot_water");
	if (i.battery) {
		let r = y(t, i.battery.soc_entity), a = c(t, i.battery.power), o = [r === null ? null : `${n(e.lang, r, 0)} %`];
		return a !== null && o.push(Math.abs(a) < .05 ? e("devices.power.idle") : e(a > 0 ? "devices.power.charge" : "devices.power.discharge", { value: n(e.lang, Math.abs(a), 2) })), o.filter(Boolean).join(" · ") || void 0;
	}
	if (i.group === "climate") {
		let r = i.entityId ? t.states[i.entityId]?.attributes : void 0, a = i.climate?.current_temperature ?? (typeof r?.current_temperature == "number" ? r.current_temperature : null), o = i.climate?.temperature ?? (typeof r?.temperature == "number" ? r.temperature : null);
		return a !== null && o !== null ? e("devices.card.climate", {
			current: n(e.lang, a, 1),
			target: n(e.lang, o, 1)
		}) : a === null ? void 0 : e("devices.card.temp", { value: n(e.lang, a, 1) });
	}
	if (i.part) {
		let a = r?.config.measurements;
		if (i.part === "connection") {
			let r = c(t, a?.grid_power);
			if (r === null) return;
			let i = n(e.lang, Math.abs(r), 2);
			return e(r >= 0 ? "devices.card.import" : "devices.card.export", { value: i });
		}
		return Vr(e, i.part === "solar" ? re(t, a?.solar_power ?? []) : c(t, a?.home_power));
	}
	if (i.car && r) return [Br(e, t, r, i.car.id), a(e, r, i.car)].filter(Boolean).join(" · ");
	let o = i.action;
	if (i.point && o && r) {
		let t = r.control?.actions?.[o.id]?.on;
		return [m(e, r, o), t ? e("devices.card.running") : ""].filter(Boolean).join(" · ");
	}
	if (o && r?.control?.actions?.[o.id]?.on) return e("devices.card.running");
	if (i.group === "hot_water" && o?.sensor_entity) {
		let r = y(t, o.sensor_entity);
		return r === null ? void 0 : e("devices.card.temp", { value: n(e.lang, r, 0) });
	}
	let s = i.consumer?.power_entity ?? o?.power_entity;
	if (s) {
		let n = t.states[s]?.attributes.unit_of_measurement, r = y(t, s);
		return Vr(e, r === null ? null : n === "W" ? r / 1e3 : r);
	}
	return i.noMeter ? e("devices.no_meter_group") : void 0;
}
function Ur(e, t, n, r, i = {}) {
	return {
		name: r.name,
		area: r.area,
		icon: r.icon,
		state: Hr(e, t, n, r),
		role: r.unassigned || r.setup ? void 0 : r.role,
		problem: r.problem,
		to: r.setup ? rt(r.setup, r.id) : R(r),
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
//#region src/components/log.ts
var Wr = [
	"all",
	"battery",
	"climate",
	"car",
	"hot_water",
	"other",
	"joe"
];
function Gr(e = [], t = []) {
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
function Kr(e, t) {
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
		let i = nt(e, r);
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
function qr(e, t, n, r, i) {
	if (r === "climate") return n[i] ?? (t ? f(t, i) : i);
	if (r === "battery") return e?.batteries.find((e) => e.id === i)?.name ?? i;
	let a = i.startsWith("action-") ? i.slice(7) : i.startsWith("point:") ? i.slice(6) : i;
	return e?.actions.find((e) => e.id === a)?.name ?? e?.consumers.find((e) => e.id === i)?.name ?? i;
}
function Jr(e, t, r, i) {
	let a = t?.batteries.find((e) => e.id === r.battery)?.name ?? t?.actions.find((e) => `action:${e.id}` === r.battery)?.name ?? r.battery ?? "", o = {
		battery: a,
		entity: r.entity ? i ? f(i, r.entity) : r.entity : "",
		value: r.value == null ? "–" : String(r.value),
		target: String(r.target ?? ""),
		power: typeof r.power == "number" ? n(e.lang, r.power, 1) : "–",
		soc: typeof r.soc == "number" ? n(e.lang, r.soc, 0) : "–",
		unit: typeof r.unit == "string" ? r.unit : "%",
		until: typeof r.until == "string" ? r.until.slice(11, 16) : "–",
		loadpoint: typeof r.loadpoint == "string" ? r.loadpoint : "evcc",
		remaining: typeof r.remaining == "number" ? n(e.lang, r.remaining, 1) : "–",
		headroom: typeof r.headroom == "number" ? n(e.lang, r.headroom, 1) : "–"
	}, s = (e) => t?.batteries.find((t) => t.id === e)?.name ?? String(e ?? ""), c = (e) => Array.isArray(e) ? e.map(s).join(", ") : "";
	if (r.kind.startsWith("team_")) {
		let t = {
			...o,
			battery: Array.isArray(r.batteries) && r.batteries.length > 1 ? r.batteries.map(s).join(" + ") : a,
			previous: s(r.previous),
			charging: c(r.charging),
			discharging: c(r.discharging),
			cutoff: typeof r.value == "number" ? n(e.lang, r.value, 1) : "–",
			level: typeof r.soc == "number" ? n(e.lang, r.soc, 1) : "–"
		};
		return r.kind === "team_handover" ? e.optional(`log.team_handover.${String(r.reason)}`, t) ?? e("log.team_handover", t) : r.kind === "team_end" ? e.optional(`log.team_end.${String(r.reason)}`, t) ?? e("log.team_end", t) : r.kind === "team_block" ? e(`log.team_block.${r.charge ? r.discharge ? "both" : "charge" : r.discharge ? "discharge" : "free"}`, t) : r.kind === "team_transfer" ? e(r.blocked ? "log.team_transfer.blocked" : "log.team_transfer", t) : e.optional(`log.${r.kind}`, t) ?? r.kind;
	}
	if (r.kind.startsWith("guard_")) {
		let t = typeof r.seconds == "number" ? r.seconds : 0, n = {
			...o,
			charging: c(r.charging),
			discharging: c(r.discharging),
			names: Array.isArray(r.names) ? r.names.map((e) => `„${String(e)}“`).join(", ") : "",
			entities: Array.isArray(r.entities) ? r.entities.map((e) => i ? f(i, String(e)) : String(e)).join(", ") : "",
			duration: t < 120 ? e("guard.seconds", { n: t }) : e("guard.minutes", { n: Math.round(t / 60) })
		}, a = r.dry ? ".dry" : "", s;
		return s = r.kind === "guard_restart" ? e(r.clean ? `log.guard_restart.clean${a}` : `log.guard_restart${a}`, n) : r.kind === "guard_block" ? e(`log.guard_block.${r.direction === "discharge" ? "discharge" : "charge"}${a}`, n) : r.kind === "guard_alarm" ? e(`log.guard_alarm${a}`, n) : r.kind === "guard_inside" ? e(`log.guard_inside${a}`, n) : r.kind === "guard_fixed" ? e(`log.guard_fixed.${Math.min(3, Math.max(1, Number(r.stage) || 1))}`, n) : r.kind === "guard_restored" ? Array.isArray(r.failed) && r.failed.length > 0 ? e("log.guard_restored.failed", {
			...n,
			entities: r.failed.map((e) => i ? f(i, String(e)) : String(e)).join(", ")
		}) : e(r.reason === "start" ? "log.guard_restored.start" : "log.guard_restored", n) : e.optional(`log.${r.kind}`, n) ?? r.kind, typeof r.problem == "string" ? `${s} ${e("log.guard.problem", { code: r.problem })}` : s;
	}
	return r.kind === "surplus_end" ? e.optional(`log.surplus_end.${String(r.reason)}`, o) ?? e("log.surplus_end", o) : r.kind === "limit_ref_failed" ? e.optional(`log.limit_ref_failed.${String(r.reason)}`, o) ?? e("log.limit_ref_failed", o) : r.kind === "boost_end" ? e.optional(`log.boost_end.${String(r.reason)}`, o) ?? e("log.boost_end.stopped", o) : r.kind === "answer" ? e(r.yes ? "log.answer.yes" : "log.answer.no") : r.kind === "test" ? e(r.ok ? "log.test.ok" : "log.test.failed", o) : e.optional(`log.${r.kind}`, o) ?? r.kind;
}
function Yr(e, t, n, r) {
	let i = n[t.entity] ?? (r ? f(r, t.entity) : t.entity);
	return C`<b>${i}</b> · ${e.optional(`climate.log.${t.what}`) ?? t.what}`;
}
function Xr(e, t, n) {
	if (!n || !n.group || n.group === "all") return !0;
	let r = Kr(e, t);
	return r.group === n.group && (!n.device || r.device === n.device);
}
var Zr = class extends x {
	constructor(...e) {
		super(...e), this.names = {}, this.entries = [], this.limit = Infinity;
	}
	static {
		this.styles = [d, T`
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
		if (!e) return A;
		let t = this.entries.filter((e) => Xr(this.config, e, this.filter)).slice(0, this.limit);
		return t.length ? C`<ul class="log">
      ${t.map((t) => C`<li>
          <time datetime=${t.at}>${U(e.lang, t.at.slice(0, 10), "short")} ${t.at.slice(11, 16)}</time>
          <span
            >${t.area === "climate" ? Yr(e, t, this.names, this.hass) : Jr(e, this.config, t, this.hass)}</span
          >
        </li>`)}
    </ul>` : C`<p class="empty">${this.empty ?? e("past.log.empty")}</p>`;
	}
};
s([O({ attribute: !1 })], Zr.prototype, "t", void 0), s([O({ attribute: !1 })], Zr.prototype, "hass", void 0), s([O({ attribute: !1 })], Zr.prototype, "config", void 0), s([O({ attribute: !1 })], Zr.prototype, "names", void 0), s([O({ attribute: !1 })], Zr.prototype, "entries", void 0), s([O({ attribute: !1 })], Zr.prototype, "limit", void 0), s([O({ attribute: !1 })], Zr.prototype, "filter", void 0), s([O({ attribute: !1 })], Zr.prototype, "empty", void 0), j("joe-log-list", Zr);
//#endregion
//#region src/pages/devices/device-frame.ts
var Qr = [
	"now",
	"steer",
	"power",
	"learned",
	"log",
	"intruders",
	"remove"
];
function $r(e) {
	return e != null && e !== A && e !== "";
}
function ei(e, t, n) {
	let r = {
		tab: "devices",
		section: n
	};
	return C`<a class="back-link" href=${k(t, r)} @click=${D(r)}
    >${e("nav.back", { name: e(`nav.devices.${n}`) })}</a
  >`;
}
function ti(e) {
	return C`<div class="note warn" role="status">
    <ha-icon icon="mdi:help-circle-outline"></ha-icon><span>${e("nav.not_found")}</span>
  </div>`;
}
function ni(e) {
	return Gr(e?.control?.log ?? [], e?.climate?.log ?? []);
}
function ri(e, t) {
	let n = t.group === "grid" ? "joe" : t.group, r = Hr(e.t, e.hass, e.state, t), i = !!(t.setup || t.unassigned || t.noMeter);
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
			entries: ni(e.state),
			filter: {
				group: n,
				device: t.id
			}
		}
	};
}
var ii = {
	battery: "learn_battery",
	car: "learn_car",
	hot_water: "learn_hot_water",
	devices: "learn_groups",
	climate: "learn_climate"
};
function ai(e, t, n, r) {
	let { t: i } = e, a = t.tips?.[n] ?? (n === "learned" && t.learnedArea ? ii[t.learnedArea] : void 0);
	return C`<section class="card dsec" data-section=${n} data-anchor=${n} ?data-tipped=${!!a}>
    <h3 class="dsec-title">${n === "remove" && t.removeTitle ? t.removeTitle : i(`devices.page.${n}`)}${a ? o(i, a) : A}</h3>
    ${r}
  </section>`;
}
function oi(e, t) {
	return C`<section class="card dsec" data-section=${t.anchor} data-anchor=${t.anchor} ?data-tipped=${!!t.tip}>
    <h3 class="dsec-title">${t.title}${t.tip ? o(e.t, t.tip) : A}</h3>
    ${t.body}
  </section>`;
}
function si(e, t) {
	let n = t.log;
	if (!n || !n.entries.some((t) => Xr(e.state?.config, t, n.filter))) return;
	let r = n.filter, i = {
		tab: "review",
		section: "log",
		id: r.group ?? "all",
		sub: r.group && r.group !== "all" ? r.device : void 0
	};
	return C`<joe-log-list
      .t=${e.t}
      .hass=${e.hass}
      .config=${e.state?.config}
      .names=${n.names ?? {}}
      .entries=${n.entries}
      .filter=${r}
      .limit=${n.limit ?? 5}
    ></joe-log-list>
    <a class="mini-btn quiet frame-more" href=${k(e.prefix, i)} @click=${D(i)}>${e.t("devices.page.more_log")}</a>`;
}
function ci(e, t) {
	let { t: n, prefix: r } = e, i = {};
	for (let a of Qr) {
		if (a === "log") {
			let n = si(e, t);
			n && (i.log = n);
			continue;
		}
		let o = t[a];
		if (!$r(o)) continue;
		let s = {
			tab: "review",
			section: "learned",
			id: t.learnedArea
		};
		i[a] = a === "learned" && t.learnedArea ? C`${o}
            <a class="mini-btn quiet frame-more" href=${k(r, s)} @click=${D(s)}>${n("devices.page.more_learned")}</a>` : o;
	}
	return C`<div class="dframe">
    ${ei(n, r, t.group)}
    <header class="card dhead">
      <div class="dhead-top">
        <ha-icon class="dhead-icon" icon=${t.icon ?? Qe[t.group]}></ha-icon>
        <div class="dhead-text">
          <h2 class="dhead-name">${t.name}</h2>
          ${t.area ? C`<span class="dhead-area">${t.area}</span>` : A}
        </div>
        ${t.ha ? Rr(n, t.ha) : A}
      </div>
      ${$r(t.live) ? C`<p class="dhead-live">${t.live}</p>` : A}
      ${$r(t.why) ? C`<p class="dhead-why">${t.why}</p>` : A}
      ${(t.problems ?? []).map((e) => C`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e}</span></div>`)}
      ${$r(t.head) ? t.head : A}
    </header>
    ${Qr.map((n) => C`${i[n] === void 0 ? A : ai(e, t, n, i[n])}
        ${n === "steer" ? (t.more ?? []).filter((e) => $r(e.body)).map((t) => oi(e, t)) : A}`)}
  </div>`;
}
function li(e, t, n, r) {
	let i = t.filter((e) => e.group === n);
	return C`<div class="dcards">
    ${i.map((t) => zr(e.t, e.prefix, Ur(e.t, e.hass, e.state, t, r?.(t))))}
  </div>`;
}
function ui(e, t, n, r = !0) {
	return C`<div class="group-intro">
    ${b(t)} ${E}
    <p class="lead">${n}</p>
    ${r ? C`<p class="ha-hint with-tip" data-tipped>${e("climate.ha_open")} ${o(e, "ha_open")}</p>` : A}
  </div>`;
}
function di(e, t, n, r) {
	let i = rt(n);
	return C`<a class="btn btn-secondary add-link" href=${k(t, i)} @click=${D(i, { sheet: !0 })}
    ><ha-icon icon="mdi:plus"></ha-icon>${r ?? e("devices.add")}</a
  >`;
}
var G = T`
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
`, K = class extends x {
	constructor(...e) {
		super(...e), this.prefix = M, this.checks = [], this.devices = [];
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
s([O({ attribute: !1 })], K.prototype, "hass", void 0), s([O({ attribute: !1 })], K.prototype, "t", void 0), s([O({ attribute: !1 })], K.prototype, "state", void 0), s([O({ attribute: !1 })], K.prototype, "route", void 0), s([O({ attribute: !1 })], K.prototype, "prefix", void 0), s([O({ attribute: !1 })], K.prototype, "discovery", void 0), s([O({ attribute: !1 })], K.prototype, "info", void 0), s([O({ attribute: !1 })], K.prototype, "checks", void 0), s([O({ attribute: !1 })], K.prototype, "climateFound", void 0), s([O({ attribute: !1 })], K.prototype, "devices", void 0);
var fi = class extends K {
	constructor(...e) {
		super(...e), this.group = "other";
	}
	static {
		this.styles = [
			d,
			G,
			T`
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
		if (!e || !this.state) return A;
		let t = ft(this.devices, this.group, this.device);
		return t ? ci(this.ctx, ri(this.ctx, t)) : C`<div class="wrap">
      ${b(e(`nav.devices.${this.group}`))} ${this.device === void 0 ? A : ti(e)}
      ${li(this.ctx, this.devices, this.group)}
      ${this.group === "grid" ? A : C`<div class="actions">${di(e, this.prefix)}</div>`}
    </div>`;
	}
};
s([O({ attribute: !1 })], fi.prototype, "device", void 0), s([O({ attribute: !1 })], fi.prototype, "sub", void 0);
//#endregion
//#region src/pages/devices/add.ts
var pi = [
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
], mi = {
	wallbox: "ev",
	hot_water: "hot_water",
	night: "custom"
}, hi = {
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
}, gi = class extends K {
	constructor(...e) {
		super(...e), this.behind = {
			tab: "devices",
			section: "all"
		}, this.busy = "", this.searchFailed = !1;
	}
	static {
		this.styles = [d, T`
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
		let t = this.kind ? hi[this.kind] : void 0;
		e.has("kind") && t && w(this, t, { replace: !0 });
	}
	render() {
		let e = this.t;
		return !e || !this.state || this.kind && hi[this.kind] ? A : C`<joe-sheet
      label=${e("devices.add.label")}
      closeLabel=${e("common.close")}
      @joe-close=${this.onClose}
      @joe-config=${this.onConfig}
    >
      ${this.kind === "battery" ? this.renderBattery(e) : this.kind === "car" ? this.renderCar(e) : this.kind && this.kind in mi ? this.renderAction(e, this.kind) : this.renderChoices(e)}
    </joe-sheet>`;
	}
	renderChoices(e) {
		return C`<div data-tipped>
      <div class="sheet-title">${b(e("devices.add.title"), "h2", o(e, "devices_add"))}</div>
      <p class="lead">${e("devices.add.lead")}</p>
      <ul class="choices">
        ${pi.map(({ kind: t, icon: n }) => {
			let r = t in hi ? hi[t] : rt(t, this.consumer), i = t in hi ? { replace: !0 } : {
				replace: !0,
				sheet: !0
			};
			return C`<li>
            <a class="choice" href=${k(this.prefix, r)} @click=${D(r, i)}>
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
		let t = rt();
		return C`<a class="back-link" href=${k(this.prefix, t)} @click=${D(t, {
			replace: !0,
			sheet: !0
		})}
      >${e("nav.back", { name: e("devices.add.other") })}</a
    >`;
	}
	renderBattery(e) {
		let t = this.state.config, n = ht(t, this.discovery).filter((e) => e.kind === "battery" && e.battery), r = gt(t, this.discovery), i = (t, n, r) => C`<li>
        <span class="what">
          <b>${t.name}</b>
          <small>${e(n ? "devices.add.battery.ignored" : "devices.found.battery")}</small>
        </span>
        <span class="row-actions">
          <button type="button" class="mini-btn go" ?disabled=${!!this.busy} @click=${() => this.useFound(t, r)}>
            ${e(n ? "devices.add.battery.use" : "devices.found.use")}
          </button>
          ${n ? A : C`<button
                type="button"
                class="mini-btn quiet"
                ?disabled=${!!this.busy}
                @click=${() => this.ignore(r)}
              >
                ${e("devices.found.ignore")}
              </button>`}
        </span>
      </li>`;
		return C`${this.backToChoices(e)}
      <div data-tipped>
        <div class="sheet-title">${b(e("devices.add.battery.title"), "h2", o(e, "devices_found"))}</div>
        <p class="lead">${e("devices.add.battery.lead")}</p>
        ${n.length || r.length ? C`<ul class="found">
              ${n.map((e) => i(e.battery, !1, e.key))}
              ${r.map((e) => i(e, !0, `battery:${e.id}`))}
            </ul>` : C`<p class="empty">${e("devices.add.battery.none")}</p>`}
      </div>
      <div class="actions" data-tipped>
        <button type="button" class="btn btn-secondary" ?disabled=${!!this.busy} @click=${this.pick}>
          <ha-icon icon="mdi:magnify"></ha-icon>${e("devices.add.battery.pick")}
        </button>
        ${o(e, "review_battery_add")}
      </div>`;
	}
	renderCar(e) {
		let t = this.state.config, n = new Set((t.cars ?? []).flatMap((e) => e.sources.map((e) => e.id))), r = this.consumer?.startsWith("car:") ? this.consumer.slice(4) : "", i = (e) => F(t, te(e)) || F(t, `car:${e.id}`), a = (this.discovery?.car_sources ?? []).filter((e) => !n.has(e.id));
		return a.sort((e, t) => Number(t.device_id === r) - Number(e.device_id === r) || Number(i(e)) - Number(i(t))), C`${this.backToChoices(e)}
      <div data-tipped>
        <div class="sheet-title">${b(e("devices.add.car.title"), "h2", o(e, "devices_add_car"))}</div>
        <p class="lead">${e("devices.add.car.lead")}</p>
        ${a.length ? C`<ul class="found">
              ${a.map((t) => C`<li>
                  <span class="what">
                    <b>${t.name ?? t.id}</b>
                    <small>${e("car.source.from", { from: g(e, t) })}${i(t) ? ` · ${e("car.find.ignored")}` : ""}</small>
                  </span>
                  <span class="row-actions">
                    <button type="button" class="mini-btn go" ?disabled=${!!this.busy} @click=${() => this.useCar(t)}>
                      ${e(i(t) ? "car.find.reuse" : "devices.found.use")}
                    </button>
                    ${i(t) ? A : C`<button
                          type="button"
                          class="mini-btn quiet"
                          ?disabled=${!!this.busy}
                          @click=${() => this.ignore(te(t))}
                        >
                          ${e("devices.found.ignore")}
                        </button>`}
                  </span>
                </li>`)}
            </ul>` : C`<p class="empty">${e("devices.add.car.none")}</p>`}
      </div>
      <div class="actions" data-tipped>
        <button type="button" class="btn btn-secondary" ?disabled=${!!this.busy} @click=${this.searchCars}>
          <ha-icon icon="mdi:magnify"></ha-icon>${e("car.search")}
        </button>
        ${o(e, "car_search")}
      </div>
      ${this.searchFailed ? C`<p class="empty" role="status">${e("car.search.failed")}</p>` : A}
      <form
        class="by-hand"
        data-tipped
        @submit=${(e) => {
			e.preventDefault();
			let t = e.target.querySelector("input");
			this.makeCar(t.value.trim());
		}}
      >
        <label class="field-label" for="new-car">${e("devices.add.car.by_hand")} ${o(e, "devices_add_car_hand")}</label>
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
			t = await Er(this.hass, null, [e.id]);
		} catch {
			t = void 0;
		}
		this.busy = "", t && w(this, h(t), { replace: !0 });
	}
	async searchCars() {
		this.busy = "search", this.searchFailed = !1;
		try {
			await Tr(this, this.hass);
		} catch {
			this.searchFailed = !0;
		}
		this.busy = "";
	}
	async makeCar(e) {
		let t = e || this.t("devices.add.car.name");
		this.busy = "hand";
		let n = _i(this.state.config, t), r = await I(this, { cars: { [n]: Nr(t) } });
		this.busy = "", r && w(this, h(n, "sources"), { replace: !0 });
	}
	renderAction(e, t) {
		let n = this.state, r = this.consumer ?? "", i = /^(wallbox|car):/.test(r) ? r : "", a = (i ? void 0 : n.config.consumers.find((e) => e.id === r))?.name ?? (i ? ht(n.config, this.discovery).find((e) => e.key === i)?.name : void 0);
		return C`${this.backToChoices(e)}
      ${wr(`${t}:${this.consumer ?? ""}`, C`<joe-action-editor
          .hass=${this.hass}
          .mailboxes=${n.mailbox}
          .accounts=${n.accounts}
          .apps=${n.apps}
          .t=${e}
          .config=${n.config}
          .discovery=${this.discovery}
          actionId=${`new:${mi[t]}`}
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
			let n = e.action, r = nt({
				...t,
				actions: [...t.actions.filter((e) => e.id !== n.id), n]
			}, n);
			w(this, R(r), { replace: !0 });
			return;
		}
		be(this, this.behind);
	}
	async useFound(e, t) {
		this.busy = t;
		let n = await Pr(this, this.state.config, e);
		this.busy = "", n && w(this, {
			tab: "devices",
			section: "battery",
			id: n
		}, { replace: !0 });
	}
	async ignore(e) {
		this.busy = e, await Ir(this, this.state.config, e), this.busy = "";
	}
	async pick() {
		if (!this.hass) return;
		this.busy = "pick";
		let e = await Fr(this, this.t, this.hass, this.state.config);
		this.busy = "", e && w(this, {
			tab: "devices",
			section: "battery",
			id: e
		}, { replace: !0 });
	}
	rediscover() {
		this.dispatchEvent(new CustomEvent("joe-rediscover", {
			bubbles: !0,
			composed: !0
		})), w(this, {
			tab: "devices",
			section: "all"
		}, { replace: !0 });
	}
};
s([O({ attribute: !1 })], gi.prototype, "kind", void 0), s([O({ attribute: !1 })], gi.prototype, "consumer", void 0), s([O({ attribute: !1 })], gi.prototype, "behind", void 0), s([N()], gi.prototype, "busy", void 0), s([N()], gi.prototype, "searchFailed", void 0);
function _i(e, t) {
	let n = `car_${t.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "car"}`.slice(0, 40), r = new Set((e.cars ?? []).map((e) => e.id)), i = n;
	for (let e = 2; r.has(i); e++) i = `${n}_${e}`;
	return i;
}
j("joe-device-add", gi);
//#endregion
//#region src/components/day-surplus.ts
function vi(e) {
	return e?.config.rules.day_surplus ? e.control?.surplus : void 0;
}
function yi(e, t) {
	let n = t.controls?.charge_limit ?? t.controls?.system_charge_limit;
	if (!n || t.adapter === "steps" || t.adapter === "none") return "no_limit";
	let r = e?.states[n];
	if (!r || r.state === "unavailable" || r.state === "unknown") return "ok";
	let i = r.attributes.unit_of_measurement;
	return i === "W" || i === "kW" ? "ok" : i === "%" ? t.limit_ref_w ? "ok" : "need_ref" : "unit";
}
function bi(e, t) {
	let n = t.controls?.charge_limit;
	return !!(n && t.adapter !== "none" && e?.states[n]?.attributes.unit_of_measurement === "%");
}
function xi(e, t) {
	let n = (t.loadpoints ?? []).filter((e) => e.wants).map((e) => e.name);
	return n.length ? e("surplus.loadpoint.named", { names: n.join(", ") }) : e("surplus.loadpoint.any");
}
function Si(e, t) {
	return t.state === "cap" ? e(t.dry ? "surplus.line.cap_dry" : "surplus.line.cap", {
		kw: n(e.lang, t.cap_kw ?? 0, 1),
		time: S(t.pv_end),
		loadpoint: xi(e, t)
	}) : e.optional(`surplus.state.${t.state}`) ?? t.state;
}
function Ci(e, t) {
	return t.state === "cap" ? e("surplus.expected", {
		kwh: n(e.lang, t.expected_kwh ?? 0, 1),
		time: S(t.pv_end)
	}) : "";
}
function wi(e, t) {
	return !t || t.state !== "cap" || t.dry ? null : e("surplus.doing", {
		kw: n(e.lang, t.cap_kw ?? 0, 1),
		loadpoint: xi(e, t),
		time: S(t.pv_end)
	});
}
var Ti = ["charge_delay", "predictive_charging"];
function Ei(e, t, r = !1) {
	return (t?.conflicts ?? []).filter((e) => Ti.includes(e.code) === r).map((t) => e.optional(`surplus.conflict.${t.code}`, {
		value: n(e.lang, t.value ?? 0, 0),
		loadpoint: t.loadpoint ?? "",
		battery: t.battery ?? ""
	}) ?? t.code);
}
function Di(e, t) {
	let n = Ei(e, t), r = Ei(e, t, !0);
	return !n.length && !r.length ? A : C`<div class="conflicts">
    ${n.length ? C`<div class="note warn" role="status">
        <ha-icon icon="mdi:alert-outline"></ha-icon>
        <span><b>${e("surplus.conflict.title")}</b> ${n.join(" ")} ${e("surplus.conflict.hint")}</span>
      </div>` : A}
  ${r.length ? C`<div class="note warn" role="status">
        <ha-icon icon="mdi:alert-outline"></ha-icon>
        <span><b>${e("surplus.device_conflict.title")}</b> ${r.join(" ")} ${e("surplus.device_conflict.hint")}</span>
      </div>` : A}
  </div>`;
}
//#endregion
//#region src/components/control-status.ts
function Oi(e, t) {
	let n = t.plan, r = t.control?.reason ?? "off";
	return r === "waiting" && n?.window ? e("devices.status.waiting", { time: S(n.window.start) }) : r === "day" ? e("devices.status.day", { time: n?.day ? S(n.day.defer_until) : "–" }) : e(`devices.status.${r}`);
}
var ki = class extends x {
	constructor(...e) {
		super(...e), this.compact = !1, this.notice = "";
	}
	static {
		this.styles = [d, T`
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
		if (!e || !t || !n) return A;
		let r = vi(t)?.state === "cap" && !vi(t)?.dry, i = n.steering || n.pending || r;
		if (this.compact) return i || this.notice ? C`<section class="card status" ?data-tipped=${i}>${this.renderRelease(e, n.pending, i)}</section>` : A;
		let a = Oi(e, t), s = t.mode === "simulation" ? C`<span class="pill-sim">${e("mode.simulation")}</span>` : C`<span class="chip ${t.mode === "live" ? "ok" : t.mode === "advisory" ? "learned" : ""}"
            >${e(`mode.${t.mode}`)}</span
          >`;
		return C`<section class="card status" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:pulse"></ha-icon>${e("devices.now")}</div>
        ${s} ${o(e, "plan_steer")}
      </div>
      <p class="status-text">${a}</p>
      ${this.renderRelease(e, n.pending, i)}
    </section>`;
	}
	renderRelease(e, t, n) {
		return C`${t ? C`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("devices.pending")}</span></div>` : A}
      ${n ? C`<div class="actions">
            <button type="button" class="btn btn-danger" @click=${this.release}>
              <ha-icon icon="mdi:hand-back-left-outline"></ha-icon>${e("devices.release")}
            </button>
            ${o(e, "devices_release")}
          </div>` : A}
      ${this.notice ? C`<div class="note" role="status"><ha-icon icon="mdi:check"></ha-icon>${this.notice}</div>` : A}`;
	}
	async release() {
		try {
			await this.hass?.callWS({ type: "energy_joe/control/release" });
		} catch {
			this.notice = this.t("error.action");
		}
	}
};
s([O({ attribute: !1 })], ki.prototype, "hass", void 0), s([O({ attribute: !1 })], ki.prototype, "t", void 0), s([O({ attribute: !1 })], ki.prototype, "state", void 0), s([O({
	type: Boolean,
	reflect: !0
})], ki.prototype, "compact", void 0), s([N()], ki.prototype, "notice", void 0), j("joe-control-status", ki);
//#endregion
//#region src/pages/devices/all.ts
var Ai = {
	battery: "mdi:home-battery-outline",
	wallbox: "mdi:ev-station",
	car: "mdi:car-electric"
}, ji = class extends K {
	constructor(...e) {
		super(...e), this.busy = "";
	}
	static {
		this.styles = [
			d,
			G,
			T`
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
		if (!e || !t) return A;
		let n = this.devices, r = dt(n), i = n.filter((e) => e.unassigned);
		return C`<div class="wrap">
      <div class="intro">
        <div>
          ${b(e("devices.page.title"))} ${E}
          <div class="lead-row" data-tipped>
            <p class="lead">${e("devices.lead")}</p>
            ${o(e, "ha_open")}
          </div>
        </div>
        <joe-pose name="switch"></joe-pose>
      </div>
      <joe-control-status .t=${e} .hass=${this.hass} .state=${t}></joe-control-status>
      <div class="actions toolbar" data-tipped>${di(e, this.prefix)} ${o(e, "devices_add")}</div>
      ${this.renderFound(e)}
      ${Ze.filter((e) => r.includes(e)).map((t) => this.renderGroup(e, t, n))}
      ${i.length ? C`<div class="group-head">
              <span class="group-label">${e("devices.unassigned")}</span><i class="dcard-dot" aria-hidden="true"></i>
            </div>
            <p class="unassigned-text">${e("devices.unassigned.text")}</p>
            <div class="dcards">
              ${i.map((n) => zr(e, this.prefix, Ur(e, this.hass, t, n)))}
            </div>` : A}
    </div>`;
	}
	renderGroup(e, t, n) {
		let r = n.filter((e) => e.group === t && !e.unassigned);
		if (!r.length) return A;
		let i = {
			tab: "devices",
			section: t
		};
		return C`<div class="group-head">
        <ha-icon icon=${Qe[t]}></ha-icon>
        <span class="group-label">${e(`nav.devices.${t}`)}</span>
        ${pt(n.filter((e) => !e.unassigned), t) ? C`<i class="dcard-dot" aria-hidden="true"></i>` : A}
        <a class="mini-btn quiet group-go" href=${k(this.prefix, i)} @click=${D(i)}>${e("devices.group.go")}</a>
      </div>
      <div class="dcards">
        ${r.map((t) => zr(e, this.prefix, Ur(e, this.hass, this.state, t)))}
      </div>`;
	}
	renderFound(e) {
		let t = ht(this.state.config, this.discovery);
		return t.length ? C`<section class="card found" data-tipped>
      <div class="found-head">
        <div class="eyebrow"><ha-icon icon="mdi:new-box"></ha-icon>${e("devices.found")}</div>
        ${o(e, "devices_found")}
      </div>
      <p class="found-lead">${e("devices.found.lead")}</p>
      <ul>
        ${t.map((t) => C`<li>
            <span class="what">
              <ha-icon icon=${Ai[t.kind]}></ha-icon>
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
    </section>` : A;
	}
	async use(e) {
		if (e.kind !== "battery" || !e.battery) {
			w(this, rt(e.kind === "wallbox" ? "wallbox" : "car", e.key), { sheet: !0 });
			return;
		}
		this.busy = e.key;
		let t = await Pr(this, this.state.config, e.battery);
		this.busy = "", t && w(this, {
			tab: "devices",
			section: "battery",
			id: t
		});
	}
	async ignore(e) {
		this.busy = e.key, await Ir(this, this.state.config, e.key), this.busy = "";
	}
};
s([N()], ji.prototype, "busy", void 0), j("joe-devices-all", ji);
//#endregion
//#region src/components/battery-automations.ts
async function Mi(e) {
	try {
		return await e?.callWS({ type: "energy_joe/automations" }) ?? [];
	} catch {
		return [];
	}
}
function Ni(e, t) {
	return e.filter((e) => e.writes.some((e) => e.battery_id === t));
}
var Pi = class extends x {
	constructor(...e) {
		super(...e), this.batteries = "", this.mode = "", this.ready = {}, this.batteryId = "", this.bare = !1, this.items = null, this.loaded = [], this.busy = !1, this.failed = !1;
	}
	static {
		this.styles = [d, T`
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
      .bad {
        color: var(--joe-warn, var(--joe-crit));
      }
    `];
	}
	willUpdate(e) {
		e.has("batteries") && this.hass && this.items === null && this.load();
	}
	async load() {
		this.loaded = await Mi(this.hass);
	}
	get shown() {
		let e = this.items ?? this.loaded;
		return this.batteryId ? Ni(e, this.batteryId) : e;
	}
	on(e) {
		let t = this.hass?.states[e.entity_id];
		return t ? t.state === "on" : e.on;
	}
	render() {
		let e = this.t, t = this.shown;
		if (!e || !t.length) return A;
		let n = t.filter((e) => this.on(e)), r = t.filter((e) => e.switched_off && !this.on(e)), i = (this.mode === "advisory" || this.mode === "live") && n.some((e) => e.writes.some((e) => (!this.batteryId || e.battery_id === this.batteryId) && this.ready[e.battery_id] === "ready")), a = C`<p class="now">
        ${e(n.length ? i ? "automations.lead" : "automations.lead_idle" : "automations.lead_off")}
      </p>
      <ul>
        ${t.map((t) => {
			let n = this.on(t), r = [...new Set(t.writes.map((e) => e.battery))].join(", ");
			return C`<li>
            <div class="row">
              <b>${t.name}</b>
              ${t.writes.some((e) => e.joe) ? C`<span class="chip">${e("automations.levers")}</span>` : A}
              <span class="chip ${n ? "warn" : "ok"}">${e(n ? "automations.on" : "automations.off")}</span>
            </div>
            ${t.writes.length ? C`<small>${e("automations.writes", {
				what: t.writes.map((e) => e.name).join(", "),
				batteries: r
			})}</small>` : C`<small>${e("automations.not_battery")}</small>`}
            ${t.switched_off && !n ? C`<small>
                  ${e("automations.switched_off", {
				day: U(e.lang, t.switched_off.at, "short"),
				time: t.switched_off.at.slice(11, 16)
			})}
                </small>` : A}
          </li>`;
		})}
      </ul>
      <div class="actions">
        ${n.length ? C`<button type="button" class="mini-btn ${i ? "go" : ""}" ?disabled=${this.busy} @click=${() => this.switch(!1)}>
              <ha-icon icon="mdi:pause-circle-outline"></ha-icon>${e("automations.all_off", { count: n.length })}
            </button>` : A}
        ${r.length ? C`<button type="button" class="mini-btn" ?disabled=${this.busy} @click=${() => this.switch(!0)}>
              <ha-icon icon="mdi:play-circle-outline"></ha-icon>${e("automations.back_on", { count: r.length })}
            </button>` : A}
      </div>
      ${this.failed ? C`<p class="bad">${e("automations.failed")}</p>` : A}`;
		return this.bare ? a : C`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:robot-outline"></ha-icon>${e("automations.title")}</div>
        ${o(e, "battery_automations")}
      </div>
      ${a}
    </section>`;
	}
	async switch(e) {
		this.busy = !0, this.failed = !1;
		let t = this.batteryId ? this.shown.filter((t) => e ? t.switched_off && !this.on(t) : this.on(t)).map((e) => e.entity_id) : void 0;
		try {
			let n = await this.hass?.callWS({
				type: "energy_joe/automations/switch",
				on: e,
				...t ? { entity_ids: t } : {}
			});
			n?.automations && (this.loaded = n.automations, this.items !== null && (this.items = n.automations), this.dispatchEvent(new CustomEvent("joe-automations", { detail: n.automations }))), this.failed = !!n?.failed.length;
		} catch {
			this.failed = !0;
		} finally {
			this.busy = !1;
		}
	}
};
s([O({ attribute: !1 })], Pi.prototype, "hass", void 0), s([O({ attribute: !1 })], Pi.prototype, "t", void 0), s([O()], Pi.prototype, "batteries", void 0), s([O()], Pi.prototype, "mode", void 0), s([O({ attribute: !1 })], Pi.prototype, "ready", void 0), s([O()], Pi.prototype, "batteryId", void 0), s([O({ type: Boolean })], Pi.prototype, "bare", void 0), s([O({ attribute: !1 })], Pi.prototype, "items", void 0), s([N()], Pi.prototype, "loaded", void 0), s([N()], Pi.prototype, "busy", void 0), s([N()], Pi.prototype, "failed", void 0), j("joe-battery-automations", Pi);
//#endregion
//#region src/components/battery-team.ts
function Fi(e) {
	return (e?.config.batteries.length ?? 0) >= 2 ? e?.control?.team : void 0;
}
function Ii(e, t) {
	let n = e.rules[t] ?? [], r = (t) => {
		let r = n.indexOf(t.id);
		return r < 0 ? n.length + e.batteries.indexOf(t) : r;
	};
	return [...e.batteries].sort((e, t) => r(e) - r(t));
}
function Li(e, t) {
	return e.self_regulating ?? t?.batteries[e.id]?.proposed ?? !1;
}
function Ri(e, t) {
	return e.control_group ?? t?.batteries[e.id]?.group ?? `own:${e.id}`;
}
function zi(e, t, n = e.batteries) {
	let r = /* @__PURE__ */ new Map();
	for (let e of n) {
		let n = Ri(e, t);
		r.set(n, [...r.get(n) ?? [], e]);
	}
	return [...r.values()];
}
function Bi(e, t) {
	return t.map((t) => e.batteries[t]?.name ?? t).join(" + ");
}
function Vi(e) {
	let t = Object.keys(e.batteries).filter((t) => e.batteries[t].charge !== null), n = /* @__PURE__ */ new Map();
	for (let r of t) {
		let t = e.batteries[r].group ?? r;
		n.set(t, [...n.get(t) ?? [], r]);
	}
	return [...n.values()];
}
function Hi(e) {
	return e.active_batteries ?? (e.active ? [e.active] : []);
}
function Ui(e, t, n) {
	let r = t.batteries[n[0]], i = Bi(t, Hi(t)), a = {
		name: Bi(t, n),
		active: i
	};
	if (r.why === "active") {
		let i = n.reduce((e, n) => e + (t.batteries[n]?.power_w ?? 0), 0), o = i > 50 ? "charging" : i < -50 ? "discharging" : "idle";
		return e(r.discharge === "blocked" ? "team.part.active_charge_only" : `team.part.active_${o}`, a);
	}
	return e(`team.part.${r.why ?? "waits_empty"}`, a);
}
function Wi(e, t) {
	if (t.state === "on") {
		let n = Vi(t), r = Hi(t)[0], i = [...n.filter((e) => e.includes(r)), ...n.filter((e) => !e.includes(r))].map((n) => Ui(e, t, n)).join(" · ");
		return e(t.dry ? "team.now.dry" : "team.now", { parts: i });
	}
	return t.state === "automation" ? e("team.state.automation", { names: t.automations.map((e) => `„${e}“`).join(", ") }) : e.optional(`team.state.${t.state}`) ?? t.state;
}
function Gi(e, t) {
	if (!t || t.state !== "on" || t.dry || !t.active) return null;
	let n = Hi(t), r = Vi(t).filter((e) => !e.some((e) => n.includes(e))).map((e) => Bi(t, e));
	return e(t.parallel && Object.values(t.batteries).some((e) => e.why === "parallel") ? "team.doing.parallel" : "team.doing", {
		active: Bi(t, n),
		others: r.join(", ")
	});
}
function Ki(e) {
	return (e?.config.batteries.length ?? 0) >= 2 ? e?.control?.guard : void 0;
}
function qi(e, t) {
	return t.map((t) => e.batteries.find((e) => e.id === t)?.name ?? t).join(", ");
}
function Ji(e) {
	let t = e.slice(0, 10), n = /* @__PURE__ */ new Date(), r = `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`, i = e.slice(11, 16);
	return t === r ? i : `${t.slice(8, 10)}.${t.slice(5, 7)}. ${i}`;
}
function Yi(e, t) {
	return t < 120 ? e("guard.seconds", { n: t }) : e("guard.minutes", { n: Math.round(t / 60) });
}
function Xi(e, t, n) {
	if (t.state !== "on") return e(`guard.state.${t.state}`);
	if (t.automations.length) return e("guard.automation", { names: t.automations.map((e) => `„${e}“`).join(", ") });
	let r = t.last;
	if (!r) return e("guard.watching");
	let i = {
		time: Ji(r.at),
		battery: qi(n, [r.battery]),
		direction: e(`guard.direction.${r.direction}`),
		duration: Yi(e, r.seconds)
	};
	if (r.result === "inside") {
		let t = e("guard.last.inside", {
			...i,
			charging: qi(n, r.charging),
			discharging: qi(n, r.discharging)
		});
		return r.dry ? `${t} ${e("guard.dry")}` : t;
	}
	let a = Math.min(3, Math.max(1, r.stage)), o = r.result === "fixed" ? e(`guard.last.fixed.${a}`, i) : r.result === "running" ? e(`guard.last.running.${a === 1 ? 1 : 2}`, i) : e(`guard.last.${r.result}`, i);
	return r.dry && (r.result === "running" || r.result === "alarm" || r.result === "fixed") ? `${o} ${e("guard.dry")}` : o;
}
function Zi(e, t, n) {
	let r = t?.last;
	return !t || t.state !== "on" || !r || r.result !== "alarm" || r.dry ? null : e("guard.alarm", {
		charging: qi(n, r.charging),
		discharging: qi(n, r.discharging)
	});
}
function Qi(e, t, n) {
	let r = t?.last;
	return !t || t.state !== "on" || !r || r.result !== "inside" || r.dry || r.over ? null : e("guard.inside", {
		charging: qi(n, r.charging),
		discharging: qi(n, r.discharging)
	});
}
function $i(e, t) {
	let n = {};
	for (let r of e.batteries) {
		let e = t.batteries[r.id];
		r.control_group == null && e?.self_regulating && e.group && (n[r.id] = { control_group: e.group });
	}
	return { batteries: n };
}
function ea(e, t) {
	return e.batteries.filter((e) => e.control_group == null && t.batteries[e.id]?.self_regulating && t.batteries[e.id]?.group_sure === !1).map((e) => e.name).join(", ");
}
//#endregion
//#region src/components/mirror.ts
function ta(t, n, r) {
	return C`<div class="mirror">
    <div class="mirror-text">
      <span class="mirror-label">${r.label}</span>
      <span class="mirror-sep" aria-hidden="true">·</span>
      <span class="mirror-value">${r.value}</span>
      ${r.source ? e(t, r.source) : A}
      ${r.hint ? C`<small class="mirror-hint">${r.hint}</small>` : A}
    </div>
    <a class="mini-btn go mirror-go" href=${k(n, r.to)} @click=${D(r.to)}
      >${t(r.action === "set" ? "mirror.set" : "mirror.change")}</a
    >
  </div>`;
}
//#endregion
//#region src/components/choice.ts
var na = "unknown", ra = class extends x {
	constructor(...e) {
		super(...e), this.options = [], this.value = [], this.multiple = !1, this.exclusive = [], this.idk = "", this.label = "", this.compact = !1;
	}
	static {
		this.styles = T`
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
		return C`<div class="opts" role="group" aria-label=${this.label}>
      ${this.options.map((e) => this.renderOption(e))}
      ${this.idk ? this.renderOption({
			value: na,
			label: this.idk
		}, "idk") : A}
    </div>`;
	}
	renderOption(e, t = "") {
		let n = this.value.includes(e.value);
		return C`<button
      type="button"
      class=${t}
      aria-pressed=${String(n)}
      ?disabled=${e.disabled}
      @click=${() => this.toggle(e.value)}
    >
      ${e.icon ? C`<ha-icon icon=${e.icon}></ha-icon>` : A}
      <span>${e.label}</span>
      ${n && this.multiple ? C`<span class="tick" aria-hidden="true"
            ><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12.5l4.5 4.5L19 7.5" /></svg
          ></span>` : A}
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
s([O({ attribute: !1 })], ra.prototype, "options", void 0), s([O({ attribute: !1 })], ra.prototype, "value", void 0), s([O({ type: Boolean })], ra.prototype, "multiple", void 0), s([O({ attribute: !1 })], ra.prototype, "exclusive", void 0), s([O()], ra.prototype, "idk", void 0), s([O()], ra.prototype, "label", void 0), s([O({
	type: Boolean,
	reflect: !0
})], ra.prototype, "compact", void 0), j("joe-choice", ra);
//#endregion
//#region src/rules-view.ts
var ia = {
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
}, aa = {
	battery: [
		"reserve_soc",
		"max_target_soc",
		"evening_min_soc",
		"balance_days",
		"discharge_in_window",
		"converter_losses",
		"day_surplus",
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
	...aa.battery,
	...aa.grid,
	...aa.plan
];
var oa = [
	"until_target",
	"block",
	"free"
], sa = [
	"tight",
	"normal",
	"careful"
];
function ca(e) {
	return e in ia;
}
function la(e, t) {
	return t.unit || e(`rule.${t.key}.unit`);
}
function ua(e, t) {
	return t == null ? "" : String(Math.round(t * (e.scale ?? 1) * 100) / 100);
}
function da(e, t, r) {
	let i = t.rules;
	if (ca(r)) {
		let t = ia[r], a = i[r];
		if (a == null) return e("rule.off");
		let o = Math.round(a * (t.scale ?? 1) * 100) / 100, s = Number.isInteger(o) ? 0 : Number.isInteger(o * 10) ? 1 : 2;
		return `${n(e.lang, o, s)} ${la(e, t)}`;
	}
	switch (r) {
		case "priority": return i.priority.map((t) => e(`rule.priority.${t}`)).join(" · ");
		case "discharge_in_window": return e(`rule.discharge.${i.discharge_in_window}`);
		case "day_surplus": return i.day_surplus ? `${e("rule.on")} · ${e(`rule.day_caution.${i.day_caution}`)}` : e("rule.off");
		case "transfer_guard": return e(i.transfer_guard === !1 ? "rule.off" : "rule.on");
		default: return e(i[r] ? "rule.on" : "rule.off");
	}
}
function fa(e, t, n, r, i) {
	if (ca(i)) return pa(e, t, n, r, ia[i]);
	switch (i) {
		case "guard_grid": return ha(e, t, n);
		case "converter_losses": return ga(e, t, n);
		case "priority": return va(e, t, n);
		case "discharge_in_window": return ya(e, t, n);
		case "day_surplus": return ba(e, t, n);
		case "transfer_guard": return _a(e, t, n);
	}
}
function pa(t, n, r, i, a) {
	let s = i?.defaults?.rules[a.key], c = P(r, `rules.${a.key}`), l = c?.source === "user";
	return C`<div class="row" data-tipped data-anchor=${a.key}>
    <div>
      <div class="name"><b>${t(`rule.${a.key}`)}</b>${o(t, `r_${a.key}`)}</div>
      <small>${t(`rule.${a.key}.hint`)}</small>
    </div>
    <div class="control">
      ${e(t, c)}
      <span class="unit-input">
        <input
          class="input"
          type="number"
          inputmode="decimal"
          min=${a.min}
          max=${a.max}
          step=${a.step}
          aria-label=${t(`rule.${a.key}`)}
          placeholder=${a.optional ? t("rule.off") : ""}
          .value=${ua(a, r.rules[a.key])}
          @change=${(e) => ma(n, a, e.target)}
        />
        <span class="unit">${la(t, a)}</span>
      </span>
      ${l && s !== void 0 ? C`<button
            type="button"
            class="mini-btn quiet"
            @click=${() => I(n, { rules: { [a.key]: s } }, "default")}
          >
            <ha-icon icon="mdi:restore"></ha-icon>${t("rule.reset")}
          </button>` : A}
    </div>
  </div>`;
}
function ma(e, t, n) {
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
function ha(t, n, r) {
	let i = r.rules, a = i.grid_limit_w;
	return C`<div class="row" data-tipped data-anchor="guard_grid">
    <div>
      <div class="name"><b id="guard-grid">${t("rule.guard_grid")}</b>${o(t, "r_guard_grid")}</div>
      <small>${t(a ? "rule.guard_grid.hint" : "rule.guard_grid.no_limit")}</small>
    </div>
    <div class="control">
      ${e(t, P(r, "rules.guard_grid"))}
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${String(i.guard_grid)}
        aria-labelledby="guard-grid"
        ?disabled=${!a}
        @click=${() => I(n, { rules: { guard_grid: !i.guard_grid } })}
      ></button>
    </div>
  </div>`;
}
function ga(t, n, r) {
	let i = r.rules;
	return C`<div class="row" data-tipped data-anchor="converter_losses">
    <div>
      <div class="name"><b id="converter-losses">${t("rule.converter_losses")}</b>${o(t, "r_converter_losses")}</div>
      <small>${t("rule.converter_losses.hint")}</small>
    </div>
    <div class="control">
      ${e(t, P(r, "rules.converter_losses"))}
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${String(i.converter_losses)}
        aria-labelledby="converter-losses"
        @click=${() => I(n, { rules: { converter_losses: !i.converter_losses } })}
      ></button>
    </div>
  </div>`;
}
function _a(t, n, r) {
	let i = r.rules.transfer_guard !== !1;
	return C`<div class="row" data-tipped data-anchor="transfer_guard">
    <div>
      <div class="name"><b id="transfer-guard">${t("rule.transfer_guard")}</b>${o(t, "r_transfer_guard")}</div>
      <small>${t("rule.transfer_guard.hint")}</small>
    </div>
    <div class="control">
      ${e(t, P(r, "rules.transfer_guard"))}
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${String(i)}
        aria-labelledby="transfer-guard"
        @click=${() => I(n, { rules: { transfer_guard: !i } })}
      ></button>
    </div>
  </div>`;
}
function va(t, n, r) {
	let i = r.rules.priority, a = (e, t) => {
		let r = [...i];
		[r[e], r[e + t]] = [r[e + t], r[e]], I(n, { rules: { priority: r } });
	}, s = (e) => C`<svg
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
	return C`<div class="row" data-tipped data-anchor="priority">
    <div>
      <div class="name"><b>${t("rule.priority")}</b>${o(t, "r_priority")}</div>
      <small>${t("rule.priority.hint")}</small>
    </div>
    <div class="control">
      ${e(t, P(r, "rules.priority"))}
      <div class="order">
        ${i.map((e, n) => C`<div>
            <span>${n + 1}. ${t(`rule.priority.${e}`)}</span>
            <button
              type="button"
              aria-label=${t("rule.priority.up", { name: t(`rule.priority.${e}`) })}
              ?disabled=${n === 0}
              @click=${() => a(n, -1)}
            >
              ${s(!0)}
            </button>
            <button
              type="button"
              aria-label=${t("rule.priority.down", { name: t(`rule.priority.${e}`) })}
              ?disabled=${n === i.length - 1}
              @click=${() => a(n, 1)}
            >
              ${s(!1)}
            </button>
          </div>`)}
      </div>
    </div>
  </div>`;
}
function ya(t, n, r) {
	let i = r.rules;
	return C`<div class="row stacked" data-tipped data-anchor="discharge_in_window">
    <div>
      <div class="name">
        <b>${t("rule.discharge_in_window")}</b>${o(t, "r_discharge_in_window")}
        ${e(t, P(r, "rules.discharge_in_window"))}
      </div>
      <small>${t("rule.discharge_in_window.hint")}</small>
    </div>
    <div>
      <joe-choice
        compact
        label=${t("rule.discharge_in_window")}
        .options=${oa.map((e) => ({
		value: e,
		label: t(`rule.discharge.${e}`)
	}))}
        .value=${[i.discharge_in_window]}
        @joe-choice=${(e) => {
		e.detail.value[0] && I(n, { rules: { discharge_in_window: e.detail.value[0] } });
	}}
      ></joe-choice>
    </div>
  </div>`;
}
function ba(t, n, r) {
	let i = r.rules;
	return C`<div class="row" data-tipped data-anchor="day_surplus">
      <div>
        <div class="name"><b id="day-surplus">${t("rule.day_surplus")}</b>${o(t, "r_day_surplus")}</div>
        <small>${t("rule.day_surplus.hint")}</small>
      </div>
      <div class="control">
        ${e(t, P(r, "rules.day_surplus"))}
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(i.day_surplus)}
          aria-labelledby="day-surplus"
          @click=${() => I(n, { rules: { day_surplus: !i.day_surplus } })}
        ></button>
      </div>
    </div>
    ${i.day_surplus ? C`<div class="row stacked" data-tipped data-anchor="day_caution">
          <div>
            <div class="name">
              <b>${t("rule.day_caution")}</b>${o(t, "r_day_caution")} ${e(t, P(r, "rules.day_caution"))}
            </div>
            <small>${t(`rule.day_caution.${i.day_caution}.hint`)}</small>
          </div>
          <div>
            <joe-choice
              compact
              label=${t("rule.day_caution")}
              .options=${sa.map((e) => ({
		value: e,
		label: t(`rule.day_caution.${e}`)
	}))}
              .value=${[i.day_caution]}
              @joe-choice=${(e) => {
		e.detail.value[0] && I(n, { rules: { day_caution: e.detail.value[0] } });
	}}
            ></joe-choice>
          </div>
        </div>` : A}`;
}
var xa = T`
  .unit-input {
    width: 150px;
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
  .row.stacked {
    display: grid;
    justify-content: stretch;
    align-items: stretch;
    gap: 10px;
  }
`;
//#endregion
//#region src/learned-view.ts
function Sa(e) {
	return C`<div class="rows">
    ${e.map((e) => C`<div class="row-item">
        <b>${e.name}</b>
        <span class="values">${e.values.map((e) => C`<span>${e}</span>`)}</span>
        ${e.note ? C`<small>${e.note}</small>` : A}
        ${e.extra ? C`<span class="row-extra">${e.extra}</span>` : A}
      </div>`)}
  </div>`;
}
var Ca = T`
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
function wa(e, t, r, i, a) {
	let o = e.lang, s = r.battery_models?.[i.id], c = i.capacity_kwh, l = t.provenance[`batteries[${i.id}].capacity_kwh`]?.source === "user", u;
	return u = s ? l && c ? e("learn.battery.user", { value: H(o, c, 1) }) : c && (s.capacity_kwh / c < .5 || s.capacity_kwh / c > 1.15) ? e("learn.battery.odd", { value: H(o, c, 1) }) : c ? e("learn.battery.uses_nominal", { value: H(o, c, 1) }) : e("learn.battery.uses") : i.power ? e("learn.battery.learning", { need: a }) : e("learn.battery.no_power"), {
		name: i.name,
		values: s ? [
			e("learn.battery.capacity", { value: H(o, s.capacity_kwh, 1) }),
			e("learn.battery.efficiency", { value: n(o, s.efficiency * 100, 0) }),
			...s.converter ? [e("learn.battery.converter", { value: n(o, s.converter.factor * 100, 0) })] : []
		] : [e("learn.still")],
		note: u
	};
}
function Ta(e, t, n) {
	let r = t.group_models?.[n.id];
	return {
		name: n.name,
		values: r ? [e("learn.groups.average", { value: H(e.lang, r.average, 1) }), r.heat >= .05 ? e("learn.groups.heat", { value: H(e.lang, r.heat, 2) }) : e("learn.groups.steady")] : [e("learn.still")]
	};
}
function Ea(e, t, n) {
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
function Da(e, t, n) {
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
function Oa(e) {
	return `${String(Math.floor(e / 60)).padStart(2, "0")}:${String(Math.round(e) % 60).padStart(2, "0")}`;
}
function ka(e, t, n, r) {
	let i = t.presence?.[n.id] ?? {}, a = Fn.filter((e) => i[e]).map((t) => e("learn.presence.value", {
		label: e(`label.${t}`),
		hours: H(e.lang, i[t].hours, 0)
	}));
	r != null && a.push(e("past.learned.presence.usual", { time: Oa(r) }));
	let o;
	return n.person_entity ? n.calendars.length || (o = e("past.learned.presence.no_calendar")) : o = e("learn.presence.no_person"), {
		name: n.name,
		values: a.length ? a : [e("learn.still")],
		note: o
	};
}
function Aa(e, t) {
	return t ? e("climate.rate", { rate: n(e.lang, t, 1) }) : e("climate.rate_default");
}
function ja(e) {
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
function Ma(e, t) {
	let n = Math.max(1, Math.ceil(t.length / 7)), r = /* @__PURE__ */ new Map();
	return t.forEach((i, a) => {
		(t.length - 1 - a) % n == 0 && r.set(a, U(e, i, "short"));
	}), r;
}
//#endregion
//#region src/pages/devices/battery-device.ts
var Na = [
	"hold",
	"charge",
	"release"
], Pa = 14, Fa = [
	"adapter",
	"controls",
	"mode_options",
	"steps",
	"prepare"
], Ia = /* @__PURE__ */ new Map();
function La(e) {
	return {
		...Wn(e),
		prepare: structuredClone(e.prepare)
	};
}
var Ra = (e, t) => JSON.stringify(e ?? null) === JSON.stringify(t ?? null);
function za(e, t, n) {
	switch (t.adapter) {
		case "none": return e("devices.battery.watch");
		case "generic": return e("devices.battery.generic");
		case "steps": return e("devices.battery.steps");
		default: return e("devices.battery.profile", { name: n?.profiles?.[t.adapter] ?? t.adapter });
	}
}
function Ba(e, t, r) {
	if (t.adapter === "none") return e("devices.action.watch");
	let i = r?.batteries[t.id];
	return i?.action ? e(`devices.action.${i.action}`, {
		target: n(e.lang, i.target ?? 0, 0),
		floor: n(e.lang, i.floor ?? 0, 0),
		until: i.until ? S(i.until) : ""
	}) : e("devices.action.idle");
}
function Va(e, t) {
	return e.adapter === "none" && !!t?.suggested?.complete;
}
function Ha(e) {
	return {
		tab: "devices",
		section: "battery",
		id: e,
		sub: "control"
	};
}
var Ua = class extends K {
	constructor(...e) {
		super(...e), this.confirm = !1, this.removing = !1, this.saving = !1, this.notice = "", this.automations = null, this.automationsFor = "", this.revealed = "";
	}
	static {
		this.styles = [
			d,
			G,
			Ca,
			T`
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
		e.has("entry") && t !== this.automationsFor && (this.removing = !1, this.notice = ""), this.hass && t && t !== this.automationsFor && (this.automationsFor = t, this.automations = null, Mi(this.hass).then((e) => {
			this.automationsFor === t && (this.automations = e);
		}));
	}
	updated() {
		let e = this.sub === "intruders" ? `${this.battery?.id}/intruders` : "";
		e ? this.revealed !== e && he(this.renderRoot, "intruders") && (this.revealed = e) : this.revealed = "";
	}
	render() {
		let { t: e, entry: t } = this, n = this.state, r = this.battery;
		if (!e || !n || !t || !r) return A;
		let i = n.control, a = this.discovery?.batteries.find((e) => e.id === r.id), o = r.adapter !== "none", s = Ni(this.automations ?? [], r.id);
		return C`${ci(this.ctx, {
			...ri(this.ctx, t),
			why: Ba(e, r, i),
			head: this.renderHead(e, r, a),
			now: o ? this.renderTest(e, r, i) : void 0,
			steer: this.renderSteer(e, r),
			power: this.renderPower(e, r),
			learned: Sa([wa(e, n.config, n.config.learned, r, Pa)]),
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
      ${this.confirm ? this.renderConfirm(e, r) : A}
      ${this.sub === "control" ? this.renderControl(e, r, a) : A}`;
	}
	renderHead(e, t, n) {
		let r = Ha(t.id);
		return C`<div class="head-row">
        <span class="chip ${t.adapter === "none" ? "" : "read"}">${za(e, t, this.info)}</span>
      </div>
      ${Va(t, n) ? C`<div class="note">
            <ha-icon icon="mdi:lightbulb-on-outline"></ha-icon>
            <span
              >${e("devices.suggested")}
              <div class="note-actions">
                <a class="mini-btn go" href=${k(this.prefix, r)} @click=${D(r, { sheet: !0 })}>${e("devices.setup")}</a>
              </div></span
            >
          </div>` : A}
      ${this.notice ? C`<div class="note warn" role="status"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.notice}</span></div>` : A}`;
	}
	renderTest(e, t, n) {
		let r = n?.ready[t.id] ?? "not_controllable", i = n?.testing?.battery === t.id ? n.testing : null, a = n?.tests[t.id], o = !!n?.testing, s = !!n?.steering, c = i ? C`<span class="chip">${e("devices.test.running")}</span>` : r === "outdated" ? C`<span class="chip warn">${e("devices.test.outdated")}</span>` : a ? C`<span class="chip ${a.ok ? "ok" : "warn"}"
              >${e(a.ok ? "devices.test.ok" : "devices.test.failed", { day: U(e.lang, a.at, "short") })}</span
            >` : C`<span class="chip">${e("devices.test.none")}</span>`, l = i?.steps ?? a?.steps ?? [];
		return C`<div class="test">
        ${c}
        <button type="button" class="btn btn-secondary" ?disabled=${o || s} @click=${() => this.confirm = !0}>
          <ha-icon icon="mdi:play-circle-outline"></ha-icon>${e(a ? "devices.test.again" : "devices.test.start")}
        </button>
      </div>
      ${i || a ? this.renderSteps(e, l, i?.step ?? null, a) : A}`;
	}
	renderSteps(e, t, n, r) {
		let i = new Map(t.map((e) => [e.step, e])), a = !n && r?.problem ? e.optional(`devices.test.problem.${r.problem}`, { missing: (r.missing ?? []).map((t) => e.optional(`role.${t}`) ?? t).join(", ") }) : null;
		return a ? C`<ul class="steps">
        <li class="bad"><ha-icon icon="mdi:close-circle"></ha-icon><b>${e("devices.test.step.check")}</b><small>${a}</small></li>
      </ul>` : C`<ul class="steps">
      ${Na.map((t) => {
			let r = i.get(t), a = r ? r.ok ? "mdi:check-circle" : "mdi:close-circle" : n === t ? "mdi:progress-clock" : "mdi:circle-outline";
			return C`<li class=${r ? r.ok ? "ok" : "bad" : "wait"}>
          <ha-icon icon=${a}></ha-icon>
          <b>${e(`devices.test.step.${t}`)}</b>
          <small>${r ? this.stepText(e, r) : ""}</small>
        </li>`;
		})}
    </ul>`;
	}
	stepText(e, t) {
		let r = this.hass, i = [];
		return t.power != null && i.push(Math.abs(t.power) >= .05 ? e("devices.test.power", { value: n(e.lang, t.power, 2) }) : e("devices.test.no_power")), t.wrong.length && i.push(e("devices.test.wrong", { entities: t.wrong.map((e) => f(r, e)).join(", ") })), t.errors.length && i.push(e("devices.test.error", { entities: t.errors.map((e) => f(r, e.entity_id)).join(", ") })), i.join(" · ");
	}
	renderConfirm(e, t) {
		let n = () => {
			this.confirm = !1;
		};
		return C`<joe-sheet label=${e("devices.test.start")} closeLabel=${e("common.close")} @joe-close=${n}>
      <div data-tipped>
        <div class="sheet-title">${b(e("devices.test.confirm.title", { name: t.name }), "h2", o(e, "devices_test"))}</div>
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
		let n = Ha(t.id);
		return C`<div class="control-row" data-tipped>
        <span class="control-text">
          <small>${e("battery.page.how")}</small>
          <b>${za(e, t, this.info)}</b>
        </span>
        <a class="btn btn-secondary" href=${k(this.prefix, n)} @click=${D(n, { sheet: !0 })}>
          <ha-icon icon="mdi:tune-variant"></ha-icon>${e("devices.setup")}
        </a>
        ${o(e, "devices_setup")}
      </div>
      ${t.adapter === "none" ? A : this.renderDaySurplus(e, t)} ${this.fields(t, "steer")}`;
	}
	renderDaySurplus(e, t) {
		let r = this.state, i = r.config.rules, a = vi(r), s = a?.batteries?.[t.id], c = yi(this.hass, t), l = c === "ok" || c === "need_ref", u = t.day_surplus !== !1, d = (t) => n(e.lang, t ?? 0, 1), f = {
			tab: "settings",
			section: "rules",
			id: "day_surplus"
		}, p = {
			tab: "devices",
			section: "battery",
			id: t.id,
			sub: "intruders"
		}, m;
		return m = l ? s && (s.state === "no_limit" || s.state === "unit") ? e(`battery.surplus.${s.state}`) : i.day_surplus ? s?.state === "automation" ? e("battery.surplus.automation", { names: (s.automations ?? []).map((e) => `„${e}“`).join(", ") }) : s?.state === "learning" ? e("battery.surplus.learning") : s?.state === "need_ref" || c === "need_ref" ? e("battery.surplus.need_ref") : s?.state === "team_wait" ? e("battery.surplus.team_wait") : s?.state === "capped" ? e("battery.surplus.capped", {
			kw: d(s.cap_kw),
			time: S(a?.pv_end)
		}) : s?.state === "would" ? e("battery.surplus.would", {
			kw: d(s.cap_kw),
			time: S(a?.pv_end)
		}) : s?.state === "unavailable" || s?.state === "unknown" ? e(`battery.surplus.${s.state}`) : s?.state === "not_tested" || r.control?.ready[t.id] !== "ready" ? e("battery.surplus.not_tested") : e(u ? "battery.surplus.takes_part" : "battery.surplus.left_out") : e("battery.surplus.rule_off") : e(`battery.surplus.${c}`), C`<div class="control-row" data-tipped>
        <span class="control-text">
          <b id="day-surplus-${t.id}">${e("battery.surplus.label")}</b>
          <small>${m}</small>
          ${!i.day_surplus && l ? C`<a class="mini-btn go" href=${k(this.prefix, f)} @click=${D(f)}>${e("battery.surplus.rule_go")}</a>` : A}
          ${i.day_surplus && s?.state === "automation" ? C`<a class="mini-btn go" href=${k(this.prefix, p)} @click=${this.jumpToIntruders(p)}
                >${e("battery.surplus.intruders_go")}</a
              >` : A}
        </span>
        ${o(e, "f_battery_day_surplus")}
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(u && l)}
          aria-labelledby="day-surplus-${t.id}"
          ?disabled=${!l}
          @click=${() => I(this, { batteries: { [t.id]: { day_surplus: !u } } })}
        ></button>
      </div>
      ${bi(this.hass, t) ? this.renderLimitRef(e, t) : A}`;
	}
	renderLimitRef(t, r) {
		let i = this.state.config, a = r.limit_ref_w ?? null, s = P(i, `batteries[${r.id}].limit_ref_w`), c = a == null;
		return C`<div class="field ref-field" data-tipped>
      <div class="field-label">
        <span id="limit-ref-${r.id}">${t("battery.limit_ref.label")}</span> ${o(t, "f_battery_limit_ref")}
        ${a == null ? A : e(t, s)}
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
            aria-labelledby="limit-ref-${r.id}"
            .value=${a == null ? "" : String(Math.round(a))}
            placeholder=${t("battery.limit_ref.placeholder")}
            @change=${(e) => {
			let t = e.target, n = Number.parseFloat(t.value.replace(",", ".")), i = Number.isFinite(n) && n >= 100 && n <= 1e5;
			if (t.value.trim() && !i) {
				t.value = a == null ? "" : String(Math.round(a));
				return;
			}
			I(this, { batteries: { [r.id]: { limit_ref_w: i ? Math.round(n) : null } } });
		}}
          />
          <span class="unit">W</span>
        </span>
        <button
          type="button"
          class="mini-btn ${c ? "go" : ""}"
          aria-pressed=${String(c)}
          @click=${() => {
			c || I(this, { batteries: { [r.id]: { limit_ref_w: null } } });
		}}
        >
          ${t("battery.limit_ref.learn")}
        </button>
      </div>
      <p class="field-hint">
        ${a == null ? t("battery.limit_ref.learning") : s?.source === "learned" ? t("battery.limit_ref.learned", { value: n(t.lang, a, 0) }) : t("battery.limit_ref.set", { value: n(t.lang, a, 0) })}
      </p>
    </div>`;
	}
	jumpToIntruders(e) {
		let t = D(e, { replace: !0 });
		return (e) => {
			t(e), e.defaultPrevented && (this.revealed = "", he(this.renderRoot, "intruders"));
		};
	}
	renderPower(e, t) {
		return this.fields(t, "power");
	}
	fields(e, t) {
		return C`<joe-battery-fields
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
		return C`<joe-battery-automations
      bare
      .hass=${this.hass}
      .t=${e}
      batteries=${JSON.stringify(n.config.batteries)}
      mode=${n.mode}
      .ready=${n.control?.ready ?? {}}
      batteryId=${t.id}
      .items=${this.automations}
      @joe-automations=${(e) => this.automations = e.detail}
    ></joe-battery-automations>`;
	}
	renderRemove(e, t) {
		return C`<div class="remove">
      <p class="remove-text">${e("battery.page.remove.text")}</p>
      ${this.removing ? C`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("battery.page.remove.confirm", { name: t.name })}</span></div>
            <div class="actions">
              <button type="button" class="btn btn-danger" ?disabled=${this.saving} @click=${() => this.leaveOut(t)}>
                ${e("battery.page.remove.go")}
              </button>
              <button type="button" class="btn btn-ghost" @click=${() => this.removing = !1}>${e("common.cancel")}</button>
            </div>` : C`<div class="actions">
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
			answers: { ignored: Je(t, `battery:${e.id}`, !0) }
		});
		this.saving = !1, n && (this.removing = !1, w(this, {
			tab: "devices",
			section: "battery"
		}, { replace: !0 }));
	}
	draftOf(e) {
		let t = La(e), n = Ia.get(e.id);
		if (!n) return t;
		let r = { ...t };
		for (let e of Fa) Ra(n.base[e], n.draft[e]) || (r[e] = n.draft[e]);
		return r;
	}
	controlChanges(e, t) {
		let n = {};
		for (let r of Fa) Ra(e[r], t[r]) || (n[r] = t[r]);
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
		return C`<joe-sheet wide label=${e("devices.setup")} closeLabel=${e("common.close")} @joe-close=${() => be(this, a)}>
      <div data-tipped>
        <div class="sheet-title">${b(e("battery.control.title", { name: t.name }), "h2", o(e, "control_choice"))}</div>
        <p class="sheet-text">${e("battery.control.lead")}</p>
        <div class="field">
          <joe-battery-control
          .hass=${this.hass}
          .t=${e}
          .battery=${t}
          .found=${n}
          .profiles=${this.info?.profiles}
          .value=${r}
          @joe-control-change=${(e) => {
			Ia.set(t.id, {
				base: La(t),
				draft: Gn(t, e.detail, n)
			}), this.requestUpdate();
		}}
        ></joe-battery-control>
        </div>
      </div>
      <div class="steer-bar" data-notip role="region" aria-label=${e("devices.setup")}>
        ${i ? C`<span class="unsaved" role="status">${e("battery.control.unsaved")}</span>` : A}
        <button type="button" class="btn btn-primary" ?disabled=${this.saving || !i} @click=${() => this.saveControl(t, a)}>
          ${e("common.save")}
        </button>
        <button
          type="button"
          class="btn btn-ghost"
          @click=${() => {
			Ia.delete(t.id), be(this, a);
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
		Ia.delete(e.id), be(this, t);
	}
};
s([O({ attribute: !1 })], Ua.prototype, "entry", void 0), s([O({ attribute: !1 })], Ua.prototype, "sub", void 0), s([N()], Ua.prototype, "confirm", void 0), s([N()], Ua.prototype, "removing", void 0), s([N()], Ua.prototype, "saving", void 0), s([N()], Ua.prototype, "notice", void 0), s([N()], Ua.prototype, "automations", void 0), j("joe-battery-device", Ua);
//#endregion
//#region src/pages/devices/battery.ts
var Wa = "together", Ga = [
	"reserve_soc",
	"max_target_soc",
	"evening_min_soc",
	"balance_days",
	"discharge_in_window",
	"converter_losses",
	"day_surplus",
	"transfer_guard"
], Ka = class extends K {
	constructor(...e) {
		super(...e), this.busy = "", this.revealed = "";
	}
	static {
		this.styles = [
			d,
			G,
			xa,
			T`
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
    `
		];
	}
	updated(e) {
		super.updated(e), e.has("device") && this.device !== Wa && (this.revealed = ""), this.device === Wa && this.revealed !== Wa && he(this.renderRoot, Wa) && (this.revealed = Wa);
	}
	render() {
		let e = this.t, t = this.state;
		if (!e || !t) return A;
		let n = this.device === Wa ? void 0 : ft(this.devices, "battery", this.device);
		if (n) return C`<joe-battery-device
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
		return C`<div class="wrap">
      ${ui(e, e("nav.devices.battery"), e("battery.page.lead"), r.length > 0)}
      ${this.device !== void 0 && this.device !== Wa ? ti(e) : A}
      <joe-control-status .t=${e} .hass=${this.hass} .state=${t}></joe-control-status>
      ${this.renderEvcc(e)}
      ${r.length ? li(this.ctx, this.devices, "battery", (t) => this.cardChange(e, t)) : C`<p class="empty">${e("devices.batteries.none")}</p>`}
      <div class="actions">${di(e, this.prefix, "battery", e("battery.page.add"))}</div>
      ${r.length >= 2 ? this.renderTeam(e, t.config) : A}
      ${r.length ? this.renderRules(e) : A}
      ${r.length ? C`<div data-anchor="automations">
            <joe-battery-automations
              .hass=${this.hass}
              .t=${e}
              batteries=${JSON.stringify(r)}
              mode=${t.mode}
              .ready=${t.control?.ready ?? {}}
            ></joe-battery-automations>
          </div>` : A}
      ${this.renderFound(e)}
    </div>`;
	}
	cardChange(e, t) {
		let n = t.battery;
		if (!n) return {};
		let r = this.discovery?.batteries.find((e) => e.id === n.id), i = Hr(e, this.hass, this.state, t), a = Ba(e, n, this.state?.control), o = Ha(n.id);
		return {
			state: [i, a].filter(Boolean).join(" · "),
			quick: Va(n, r) ? C`<span class="dcard-suggest">${e("battery.page.suggested")}</span>
            <a class="mini-btn go" href=${k(this.prefix, o)} @click=${D(o, { sheet: !0 })}>${e("devices.setup")}</a>` : void 0
		};
	}
	renderTeam(t, n) {
		let r = Fi(this.state), i = n.rules.battery_team ?? null, a = (e) => {
			e !== i && I(this, { rules: { battery_team: e } });
		}, s = r?.state === "automation";
		return C`<section class="card" data-tipped data-anchor=${Wa}>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:battery-sync-outline"></ha-icon>${t("team.title")}</div>
        ${o(t, "team")}
      </div>
      <p class="team-question" id="team-question">${t("team.question")}</p>
      <div class="team-choice" data-tipped>
        <div class="seg" role="group" aria-labelledby="team-question">
          ${["sequence", "together"].map((e) => C`<button type="button" aria-pressed=${String(i === e)} @click=${() => a(e)}>
                ${t(`team.mode.${e}`)}
              </button>`)}
        </div>
        ${o(t, "team_mode")} ${i ? e(t, P(n, "rules.battery_team")) : A}
      </div>
      ${r && !s ? C`<p class="team-now">${Wi(t, r)}</p>` : A}
      <div class="team-notes">
        ${r?.group_question ? this.renderGroupQuestion(t, n) : A}
        ${s ? C`<div class="note warn" role="status">
              <ha-icon icon="mdi:robot-confused-outline"></ha-icon>
              <span>
                ${t("team.automations", { names: (r?.automations ?? []).map((e) => `„${e}“`).join(", ") })}
                <span class="note-actions">
                  <button type="button" class="mini-btn go" @click=${() => he(this.renderRoot, "automations")}>
                    ${t("team.automations.go")}
                  </button>
                </span>
              </span>
            </div>` : A}
        ${this.renderGuard(t, n)}
      </div>
      ${i === "sequence" ? C`<div class="team-orders">
            ${this.orderList(t, n, "team_charge_order")} ${this.orderList(t, n, "team_discharge_order")}
          </div>` : A}
      <ul class="team-list">
        ${n.batteries.map((e) => this.teamBattery(t, n, e))}
      </ul>
    </section>`;
	}
	renderGuard(e, t) {
		let n = Ki(this.state);
		if (!n) return A;
		let r = n.state === "on" && n.last?.result === "alarm" && !n.last.dry, i = n.state === "on" && n.automations.length > 0;
		return C`<div class="note guard ${r || i ? "warn" : ""}" role="status" data-tipped data-anchor="guard">
      <ha-icon icon="mdi:shield-sync-outline"></ha-icon>
      <span>
        <b>${e("guard.title")}</b> ${o(e, "guard")} · ${Xi(e, n, t)}
        ${i ? C`<span class="note-actions">
              <button type="button" class="mini-btn go" @click=${() => he(this.renderRoot, "automations")}>
                ${e("team.automations.go")}
              </button>
            </span>` : A}
      </span>
    </div>`;
	}
	renderGroupQuestion(e, t) {
		let n = Fi(this.state);
		return C`<div class="note" role="status" data-tipped>
      <ha-icon icon="mdi:help-circle-outline"></ha-icon>
      <span>
        <b>${e("team.groups.question")}</b> ${o(e, "team_group")}
        ${e("team.groups.question.text", { names: ea(t, n) })}
        <span class="note-actions">
          <button type="button" class="mini-btn go" @click=${() => I(this, $i(t, n))}>
            ${e("team.groups.confirm")}
          </button>
          ${o(e, "team_groups_confirm")}
        </span>
      </span>
    </div>`;
	}
	orderList(e, t, n) {
		let r = zi(t, Fi(this.state), Ii(t, n)), i = (e, t) => {
			let i = [...r];
			[i[e], i[e + t]] = [i[e + t], i[e]], I(this, { rules: { [n]: i.flat().map((e) => e.id) } });
		}, a = (e) => C`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d=${e ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"} />
      </svg>`, s = n === "team_charge_order" ? "team_charge_order" : "team_discharge_order";
		return C`<div data-tipped>
      <div class="team-label">${e(`team.${s}`)} ${o(e, s)}</div>
      <div class="order">
        ${r.map((t, n) => C`<div>
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
	teamBattery(t, r, i) {
		let a = Fi(this.state), s = a?.batteries[i.id], c = Li(i, a), l = i.cutoff_soc ?? null, u = (e) => n(t.lang, e, 1), d = `team-self-${i.id}`;
		return C`<li>
      <div class="team-line" data-tipped>
        <span class="what">
          <b id=${d}>${i.name}</b>
          <small>
            ${t("team.self_regulating")}
            ${i.self_regulating == null && a ? C`<span class="chip">${t("team.proposed")}</span>` : e(t, P(r, `batteries[${i.id}].self_regulating`))}
          </small>
        </span>
        <span class="team-ctl">
          ${o(t, "team_self_regulating")}
          <button
            type="button"
            class="switch"
            role="switch"
            aria-checked=${String(c)}
            aria-labelledby=${d}
            @click=${() => I(this, { batteries: { [i.id]: { self_regulating: !c } } })}
          ></button>
        </span>
      </div>
      ${c ? this.groupLine(t, r, i) : A}
      ${c ? C`<div class="team-line" data-tipped>
            <span class="what">
              <small>
                ${l == null ? t("team.cutoff.unknown", { value: u(s?.floor ?? 10) }) : t("team.cutoff.known", { value: u(l) })}
                ${l == null ? A : e(t, P(r, `batteries[${i.id}].cutoff_soc`))}
              </small>
            </span>
            <span class="team-ctl">${o(t, "team_cutoff")}</span>
          </div>` : A}
    </li>`;
	}
	groupLine(t, n, r) {
		let i = Fi(this.state), a = Ri(r, i), s = n.batteries.filter((e) => e.id !== r.id && Li(e, i)), c = `own:${r.id}`, l = s.find((e) => Ri(e, i) === a), u = l ? Ri(l, i) : c, d = `team-group-${r.id}`, f = r.control_group == null && i?.batteries[r.id]?.group_sure === !1, p = (e) => {
			e !== u && I(this, { batteries: { [r.id]: { control_group: e } } });
		};
		return C`<div class="team-line" data-tipped>
      <span class="what">
        <small id=${d}>
          ${t("team.group")}
          ${r.control_group == null && i ? C`<span class="chip ${f ? "warn" : ""}">${t(f ? "team.group.check" : "team.proposed")}</span>` : e(t, P(n, `batteries[${r.id}].control_group`))}
        </small>
      </span>
      <span class="team-ctl">
        ${o(t, "team_group")}
        <select
          class="input team-group"
          aria-labelledby=${d}
          .value=${u}
          @change=${(e) => p(e.target.value)}
        >
          <option value=${c} ?selected=${u === c}>${t("team.group.own")}</option>
          ${s.map((e) => {
			let n = Ri(e, i);
			return C`<option value=${n} ?selected=${u === n && l?.id === e.id}>
              ${t("team.group.with", { name: e.name })}
            </option>`;
		})}
        </select>
      </span>
    </div>`;
	}
	renderRules(e) {
		let t = this.state.config, n = vi(this.state);
		return C`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:tune-vertical"></ha-icon>${e("battery.page.rules")}</div>
        ${o(e, "battery_rules")}
      </div>
      <div class="mirrors">
        ${Ga.map((r) => {
			let i = {
				tab: "settings",
				section: "rules",
				id: r
			};
			return ta(e, this.prefix, {
				label: e(`rule.${r}`),
				value: da(e, t, r),
				source: P(t, `rules.${r}`),
				hint: r === "day_surplus" && n ? Si(e, n) : void 0,
				to: i
			});
		})}
      </div>
    </section>`;
	}
	renderEvcc(e) {
		let t = Di(e, vi(this.state));
		return t === A ? A : C`<div class="evcc" data-tipped>${t} ${o(e, "surplus_evcc")}</div>`;
	}
	renderFound(e) {
		let t = this.state.config, n = ht(t, this.discovery).filter((e) => e.kind === "battery" && e.battery), r = gt(t, this.discovery);
		if (!n.length && !r.length) return A;
		let i = (t, n, r) => C`<li>
        <span class="what">
          <b>${t.name}</b>
          <small>${e(n ? "devices.add.battery.ignored" : "battery.page.found.new")}</small>
        </span>
        <span class="row-actions">
          <button type="button" class="mini-btn go" ?disabled=${!!this.busy} @click=${() => this.use(t, r)}>
            ${e(n ? "devices.add.battery.use" : "devices.found.use")}
          </button>
          ${n ? A : C`<button type="button" class="mini-btn quiet" ?disabled=${!!this.busy} @click=${() => this.ignore(r)}>
                ${e("devices.found.ignore")}
              </button>`}
        </span>
      </li>`;
		return C`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:home-battery-outline"></ha-icon>${e("battery.page.found")}</div>
        ${o(e, "battery_found")}
      </div>
      <ul class="found">
        ${n.map((e) => i(e.battery, !1, e.key))} ${r.map((e) => i(e, !0, `battery:${e.id}`))}
      </ul>
    </section>`;
	}
	async use(e, t) {
		this.busy = t;
		let n = await Pr(this, this.state.config, e);
		this.busy = "", n && w(this, {
			tab: "devices",
			section: "battery",
			id: n
		});
	}
	async ignore(e) {
		this.busy = e, await Ir(this, this.state.config, e), this.busy = "";
	}
};
s([O({ attribute: !1 })], Ka.prototype, "device", void 0), s([O({ attribute: !1 })], Ka.prototype, "sub", void 0), s([N()], Ka.prototype, "busy", void 0), j("joe-battery-group", Ka);
//#endregion
//#region src/components/action-page.ts
function qa(e, t, n, r, i, a, s) {
	let c = rt(n, r);
	return C`<div class="setup-block" data-tipped>
    <p>${i} ${o(e, s)}</p>
    <a class="btn btn-primary" href=${k(t, c)} @click=${D(c, { sheet: !0 })}>${a}</a>
  </div>`;
}
function Ja(e, t, n) {
	let r = t.startsWith("action-") ? t.slice(7) : t;
	return e.find((e) => e.group !== n && (e.consumer?.id === t || e.id === t || e.action?.id === r));
}
function Ya(e, t, n, r) {
	let i = r.setup ? {
		tab: "devices",
		section: r.group,
		id: r.id
	} : R(r);
	return C`<div class="moved" role="status">
    <ha-icon icon="mdi:arrow-right-bold-circle-outline"></ha-icon>
    <span class="moved-text"><b>${n}</b></span>
    <a class="mini-btn go moved-go" href=${k(t, i)} @click=${D(i)}
      >${e("devices.moved_to", { group: e(`nav.devices.${r.group}`) })}</a
    >
  </div>`;
}
function Xa(e, t) {
	return C`<h4 class="sub-head" data-anchor=${t ?? A}>${e}</h4>`;
}
var Za = T`
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
`, Qa = class extends x {
	constructor(...e) {
		super(...e), this.roundTrip = !0, this.failed = !1;
	}
	static {
		this.styles = [d, T`
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
		let { t: e, action: t } = this, r = t?.need;
		if (!e || !t || !r) return A;
		let i = (t, r = 0) => n(e.lang, t ?? 0, r);
		if (!r.known) return C`<p>${e(r.soc != null && !r.capacity_kwh ? "need.unknown_capacity" : "need.unknown")}</p>`;
		let a = [];
		a.push(C`<p>
        ${r.trips_km > 0 && r.trips_km >= (r.usual_km ?? 0) ? e("need.trips", {
			km: i(r.trips_km),
			count: r.trips.length,
			reserve: i(r.reserve_km),
			total: i(r.needed_km)
		}) : r.usual_km ? e("need.usual", {
			km: i(r.usual_km),
			reserve: i(r.reserve_km),
			total: i(r.needed_km)
		}) : e("need.reserve_only", { reserve: i(r.reserve_km) })}
        ${r.unknown_trips ? e("need.unknown_trips", { count: r.unknown_trips }) : ""}
      </p>`), a.push(C`<p>
        ${e(`need.consumption.${r.consumption_source}`, {
			value: i(r.consumption, 1),
			temp: r.temp == null ? "–" : i(r.temp)
		})}${r.rain ? ` ${e("need.rain")}` : ""}
      </p>`), r.target_unit === "%" ? a.push(C`<p>${e("need.has_soc", {
			soc: i(r.soc),
			km: i(r.have_km),
			target: i(r.target)
		})}</p>`) : a.push(C`<p>${e("need.has_range", { km: i(r.have_km) })}</p>`);
		let o = r.missing_kwh ?? 0;
		return a.push(C`<p class="result">
        ${o >= .2 ? t.run && !t.manual ? e("need.charges", {
			kwh: i(o, 1),
			start: S(t.start)
		}) : e("need.missing", { kwh: i(o, 1) }) : e("need.enough")}
      </p>`), r.fits === !1 && a.push(C`<p>${e("need.too_far")}</p>`), C`${a} ${r.trips.length ? this.renderTrips(e, r.trips) : A}`;
	}
	renderTrips(e, t) {
		return C`<div data-tipped>
      <div class="head">${e("need.trips.title")} ${o(e, "need_trips")}</div>
      <ul>
        ${t.map((t) => C`<li>
            <span>${t.start.includes("T") ? S(t.start) : e("need.all_day")}</span>
            <span class="where">${t.location}</span>
            ${this.editing === t.location ? this.renderEdit(e, t) : C`<span class=${t.km == null ? "km unknown" : "km"}>
                    ${t.km == null ? e("need.km_unknown") : e(`need.km.${t.source ?? "zone"}`, { km: n(e.lang, t.km, 0) })}
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
      ${this.failed ? C`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("error.action")}</div>` : A}
    </div>`;
	}
	renderEdit(e, t) {
		let n = t.km == null ? "" : String(Math.round(t.km / (this.roundTrip ? 2 : 1)));
		return C`<form
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
s([O({ attribute: !1 })], Qa.prototype, "hass", void 0), s([O({ attribute: !1 })], Qa.prototype, "t", void 0), s([O({ attribute: !1 })], Qa.prototype, "action", void 0), s([O({ attribute: !1 })], Qa.prototype, "roundTrip", void 0), s([N()], Qa.prototype, "editing", void 0), s([N()], Qa.prototype, "failed", void 0), j("joe-car-need", Qa);
//#endregion
//#region src/components/car-sources.ts
var $a = [
	"soc",
	"range",
	"odometer",
	"capacity",
	"consumption",
	"plugged",
	"outside_temp",
	"location"
];
function eo(e, t, n) {
	return e("car.merge.ask", {
		a: n.a_name,
		b: n.b_name,
		from: g(e, {
			kind: "car",
			platform: n.b_platform,
			name: n.b_name
		})
	});
}
function to(e) {
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
var no = class extends x {
	constructor(...e) {
		super(...e), this.prefix = M, this.busy = !1, this.failed = !1, this.other = "", this.adding = !1, this.manual = !1;
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
		this.styles = [d, T`
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
		if (!e || !t || !n) return A;
		let r = (t.config.cars ?? []).filter((e) => e.id !== n.id), i = (t.cars?.merge ?? []).filter((e) => e.a === n.id || e.b === n.id);
		return C`${n.sources.length ? C`<ul class="sources">
            ${n.sources.map((t) => this.renderSource(e, n, t))}
          </ul>` : C`<p class="muted">${e("car.sources.none")}</p>`}
      ${i.map((n) => C`<div class="ask" role="group" data-tipped>
          <p>${eo(e, t, n)} ${o(e, "car_merge")}</p>
          <div class="row">
            <button type="button" class="mini-btn go" ?disabled=${this.busy} @click=${() => this.send(to(n).yes, n.a)}>
              ${e("car.merge.yes")}
            </button>
            <button type="button" class="mini-btn quiet" ?disabled=${this.busy} @click=${() => this.send(to(n).no)}>
              ${e("car.merge.no")}
            </button>
          </div>
        </div>`)}
      ${r.length ? C`<div class="merge" data-tipped>
            <select class="input" aria-label=${e("car.merge.with")} @change=${(e) => this.other = e.target.value}>
              <option value="" ?selected=${!this.other}>${e("car.merge.with")}</option>
              ${r.map((e) => C`<option value=${e.id} ?selected=${this.other === e.id}>${e.name}</option>`)}
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
            ${o(e, "car_merge_with")}
          </div>` : A}
      ${this.adding ? C`<div class="add-box" @joe-attached=${() => this.adding = !1}>
            <joe-car-search .hass=${this.hass} .t=${e} .state=${t} .discovery=${this.discovery} .prefix=${this.prefix} .car=${n}></joe-car-search>
            <div class="close-row">
              <button type="button" class="mini-btn quiet" @click=${() => this.adding = !1}>${e("car.attach.close")}</button>
            </div>
          </div>` : C`<div class="add by-hand" data-tipped>
            <button type="button" class="mini-btn" aria-expanded="false" @click=${() => this.adding = !0}>
              <ha-icon icon="mdi:plus"></ha-icon>${e("car.attach.open")}
            </button>
            ${o(e, "car_attach_open")}
          </div>`}
      ${this.failed ? C`<p class="bad" role="status">${e("error.action")}</p>` : A}
      ${Xa(e("car.sources.manual"))}
      ${n.sources.length && !this.manual && !this.chosenByHand(n) ? C`<div class="by-hand" data-tipped>
            <button type="button" class="mini-btn quiet" aria-expanded="false" @click=${() => this.manual = !0}>
              <ha-icon icon="mdi:chevron-down"></ha-icon>${e("car.sources.manual.open")}
            </button>
            ${o(e, "car_manual")}
          </div>` : C`<p class="muted">${e("car.sources.manual.hint")}</p>
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
		let r = $a.filter((e) => n.entities[e]).map((t) => e(`car.role.${t}`)), i = g(e, {
			kind: n.kind,
			platform: n.platform,
			name: n.name
		});
		return C`<li>
      <ha-icon icon=${n.kind === "evcc" ? "mdi:ev-station" : "mdi:car-connected"}></ha-icon>
      <span class="what">
        <b>${n.name ?? i}</b>
        <small>${e("car.source.from", { from: i })}${n.vehicle ? ` · ${e("car.source.vehicle", { id: n.vehicle })}` : ""}</small>
        <small>${r.length ? e("car.source.gives", { roles: r.join(", ") }) : e(n.kind === "evcc" ? "car.source.evcc_only" : "car.source.nothing")}</small>
      </span>
      ${t.sources.length > 1 ? C`<span class="row" data-tipped>
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
            ${o(e, "car_split")}
          </span>` : A}
    </li>`;
	}
	async send(e, t) {
		this.busy = !0, this.failed = !1;
		try {
			let n = (await this.hass?.callWS(e) ?? null)?.car ?? null;
			t && n && n !== this.car?.id && w(this, {
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
s([O({ attribute: !1 })], no.prototype, "hass", void 0), s([O({ attribute: !1 })], no.prototype, "t", void 0), s([O({ attribute: !1 })], no.prototype, "state", void 0), s([O({ attribute: !1 })], no.prototype, "discovery", void 0), s([O({ attribute: !1 })], no.prototype, "prefix", void 0), s([O({ attribute: !1 })], no.prototype, "car", void 0), s([N()], no.prototype, "busy", void 0), s([N()], no.prototype, "failed", void 0), s([N()], no.prototype, "other", void 0), s([N()], no.prototype, "adding", void 0), s([N()], no.prototype, "manual", void 0);
var ro = class extends x {
	constructor(...e) {
		super(...e), this.asking = !1, this.busy = !1;
	}
	static {
		this.styles = [d, T`
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
		return !e || !t ? A : this.asking ? C`<div data-tipped>
      <p class="ask" role="alert">${e("car.delete.ask", { name: t.name })}</p>
      <div class="row">
        <button type="button" class="btn btn-danger" ?disabled=${this.busy} @click=${this.removeCar}>${e("action.delete.yes")}</button>
        <button type="button" class="btn btn-ghost" ?disabled=${this.busy} @click=${() => this.asking = !1}>${e("action.delete.no")}</button>
        ${o(e, "car_delete")}
      </div>
    </div>` : C`<div class="row" data-tipped>
        <button type="button" class="btn btn-danger" @click=${() => this.asking = !0}>${e("car.delete")}</button>
        ${o(e, "car_delete")}
      </div>`;
	}
	async removeCar() {
		let e = this.car;
		if (!e) return;
		this.busy = !0;
		let t = [...this.config?.answers.ignored ?? []];
		for (let n of e.sources) {
			let e = te(n);
			t.includes(e) || t.push(e);
		}
		let n = await I(this, {
			cars: { [e.id]: null },
			answers: { ignored: t }
		});
		this.busy = !1, n && this.leave && w(this, this.leave, { replace: !0 });
	}
};
s([O({ attribute: !1 })], ro.prototype, "t", void 0), s([O({ attribute: !1 })], ro.prototype, "config", void 0), s([O({ attribute: !1 })], ro.prototype, "car", void 0), s([O({ attribute: !1 })], ro.prototype, "leave", void 0), s([N()], ro.prototype, "asking", void 0), s([N()], ro.prototype, "busy", void 0), j("joe-car-sources", no), j("joe-car-delete", ro);
//#endregion
//#region src/pages/devices/car-device.ts
function q(e) {
	return C`${e.split(/\*\*(.+?)\*\*/).map((e, t) => t % 2 ? C`<strong>${e}</strong>` : e)}`;
}
var io = [
	"soc",
	"range",
	"odometer",
	"plugged",
	"location",
	"outside_temp"
], ao = class extends K {
	constructor(...e) {
		super(...e), this.revealed = "";
	}
	static {
		this.styles = [
			d,
			G,
			Ca,
			Za,
			T`
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
		(e.has("sub") || e.has("entry")) && (n ? this.revealed !== n && he(this.renderRoot, t) && (this.revealed = n) : this.revealed = "");
	}
	render() {
		let { t: e, hass: t, state: n, entry: r } = this, i = r?.car;
		if (!e || !t || !n || !r || !i) return A;
		let a = ri(this.ctx, r), o = i.need, s = {
			hass: t,
			t: e,
			state: n,
			discovery: this.discovery,
			prefix: this.prefix
		};
		return ci(this.ctx, {
			...a,
			live: Br(e, t, n, i.id) || void 0,
			why: this.whereText(e, n, i),
			log: a.log ? {
				...a.log,
				filter: { group: "car" }
			} : void 0,
			now: C`${this.values(e, n, i)} ${this.plugged(e, n, i)}
        <joe-car-charge .hass=${t} .t=${e} .state=${n} .car=${i}></joe-car-charge>
        ${o.enabled ? C`${Xa(e("car.trips"))} ${this.trips(e, n, i)}` : A}`,
			steer: C`<joe-car-steer
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
				body: C`${this.explain(e, i)}
            ${o.enabled ? this.calendarLine(e, n, i) : C`<p class="muted">${e("devices.car.terms_off")}</p>`}
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
				body: C`<joe-car-sources
            .hass=${t}
            .t=${e}
            .state=${n}
            .discovery=${this.discovery}
            .prefix=${this.prefix}
            .car=${i}
          ></joe-car-sources>`
			}],
			learned: Sa([Da(e, n.config.learned, i)]),
			learnedArea: "car",
			tips: {
				steer: "car_steer",
				now: "car_now"
			},
			removeTitle: e("devices.page.delete"),
			remove: C`<joe-car-delete .t=${e} .config=${n.config} .car=${i} .leave=${{
				tab: "devices",
				section: "car"
			}}></joe-car-delete>`
		});
	}
	whereText(e, t, n) {
		let r = i(t, n.id);
		if (!r) return e(t.cars?.cars?.[n.id]?.plugged ? "car.plugged_elsewhere" : "car.not_plugged");
		let a = p(t, r.id)?.how ?? "home";
		return `${e("car.plugged_at", { point: r.name })} · ${e(`point.how.${a}`)}`;
	}
	values(e, t, n) {
		this.hass;
		let r = t.cars?.cars?.[n.id]?.values ?? {}, i = io.filter((e) => r[e]);
		return i.length ? C`<ul class="values">
      ${i.map((t) => {
			let n = r[t];
			return C`<li>
          <span class="label">${e(`car.role.${t}`)}</span>
          <span class="value">
            <b>${this.valueText(e, t, n.entity)}</b>
            <span class="chip">${n.kind === "manual" ? e("car.source.chip_manual") : e("car.source.chip", { from: g(e, n) })}</span>
          </span>
        </li>`;
		})}
    </ul>` : C`<p class="muted">${e("car.values.none")}</p>`;
	}
	valueText(e, t, n) {
		let r = this.hass, i = r.states[n]?.state;
		return i === void 0 || i === "unavailable" || i === "unknown" ? e("car.value.unknown") : t === "plugged" ? e([
			"on",
			"true",
			"plugged",
			"connected"
		].includes(i.toLowerCase()) ? "car.value.plugged" : "car.value.unplugged") : t === "location" ? i === "home" ? e("car.value.home") : i === "not_home" ? e("car.value.away") : i : ne(r, n, e.lang);
	}
	plugged(e, t, n) {
		let r = i(t, n.id);
		if (!r) return A;
		let a = {
			tab: "devices",
			section: "car",
			id: "point",
			sub: r.id
		};
		return C`<p class="plugged">
      <ha-icon icon="mdi:ev-station"></ha-icon>
      <span>${e("car.plugged_at", { point: r.name })}</span>
      <a class="mini-btn quiet" href=${k(this.prefix, a)} @click=${D(a)}>${e("car.open_point")}</a>
    </p>`;
	}
	trips(e, n, r) {
		let i = t(n, r.id);
		if (!i) return C`<p class="muted">${e("car.trips.none")}</p>`;
		let a = i.point ? n.plan?.actions?.find((e) => e.id === i.point) : void 0, o = a?.need ? a : {
			id: r.id,
			name: r.name,
			kind: "switch",
			run: !1,
			manual: !1,
			reasons: [],
			start: "",
			end: "",
			power_kw: null,
			energy_kwh: 0,
			priority: 1,
			need: i
		};
		return C`<joe-car-need .hass=${this.hass} .t=${e} .action=${o} .roundTrip=${r.need.round_trip ?? !0}></joe-car-need>`;
	}
	explain(e, t) {
		let n = t.need, r = !!(n.calendars?.length || n.source === "mailbox" || n.source === "account");
		return C`<details class="explain" ?open=${!r} data-notip>
      <summary>${e("car.explain.title")}</summary>
      <div class="explain-body">
        <p>${q(e("car.explain.why"))}</p>
        <h4>${e("car.explain.two")}</h4>
        <ul>
          <li>${q(e("car.explain.car_cal", { name: t.name }))}</li>
          <li>${q(e("car.explain.persons"))}</li>
        </ul>
        <h4>${e("car.explain.ways")}</h4>
        <ul>
          <li>${q(e("car.explain.way.calendar"))}</li>
          <li>${q(e("car.explain.way.mailbox"))}</li>
          <li>${q(e("car.explain.way.account"))}</li>
        </ul>
        <h4>${e("car.explain.example.title")}</h4>
        <ol>
          <li>${q(e("car.explain.example.1"))}</li>
          <li>${q(e("car.explain.example.2", { name: t.name }))}</li>
          <li>${q(e("car.explain.example.3", { name: t.name }))}</li>
          <li>${q(e("car.explain.example.4"))}</li>
        </ol>
        <h4>${e("car.explain.rules")}</h4>
        <ul>
          <li>${q(e("car.explain.rule.place"))}</li>
          <li>${q(e("car.explain.rule.online"))}</li>
          <li>${q(e("car.explain.rule.twice"))}</li>
          <li>${q(e("car.explain.rule.none"))}</li>
        </ul>
      </div>
    </details>`;
	}
	calendarLine(e, t, n) {
		let r = n.need, i = r.source ?? "ha", a = "", s = "none", c = null, l = t.config.persons.filter((e) => e.calendars.length && (r.persons == null || r.persons.includes(e.id)));
		if (i === "ha" && (r.calendars?.length || l.length)) a = [...(r.calendars ?? []).map((e) => f(this.hass, e)), ...l.length ? [e("devices.car.of_persons", { names: l.map((e) => e.name).join(", ") })] : []].join(" · "), s = "ok";
		else if (i === "mailbox" && r.mailbox?.address) {
			let e = t.mailbox?.[n.id];
			a = r.mailbox.address, s = e?.state === "ok" ? "ok" : "warn", c = e?.checked ?? null;
		} else if (i === "account" && r.account?.address) {
			let e = t.accounts?.[n.id];
			a = r.account.address, s = e?.state === "ok" ? "ok" : "warn", c = e?.checked ?? null;
		}
		let u = h(n.id, "calendars");
		return C`<div class="car-cal" data-tipped>
      <ha-icon icon="mdi:calendar-month-outline"></ha-icon>
      <span class="grow">
        ${s === "none" ? C`<b>${e("devices.car.no_calendar")}</b>` : C`<b>${a}</b>
              <small>
                ${e(s === "ok" ? "devices.car.calendar_ok" : "devices.car.calendar_problem")}
                ${c ? e("devices.car.checked", { when: new Date(c).toLocaleString(e.lang, {
			weekday: "short",
			hour: "2-digit",
			minute: "2-digit"
		}) }) : A}
              </small>`}
      </span>
      <a class="mini-btn ${s === "none" ? "go" : ""}" href=${k(this.prefix, u)} @click=${D(u, { replace: !0 })}>
        ${e(s === "none" ? "devices.car.connect" : "devices.car.change")}
      </a>
      ${o(e, "car_calendar_card")}
    </div>`;
	}
};
s([O({ attribute: !1 })], ao.prototype, "entry", void 0), s([O({ attribute: !1 })], ao.prototype, "sub", void 0), j("joe-car-device", ao);
//#endregion
//#region src/pages/devices/other-list.ts
var oo = ["auto", "always"], so = [
	"auto",
	"surplus",
	"cheap"
], co = [
	"climate",
	"ev",
	"hot_water"
];
function lo(e, t, n) {
	return n === t.kind ? Promise.resolve(!1) : I(e, { consumers: { [t.id]: { kind: n } } });
}
function uo(e, t, n) {
	return n === (t.runs ?? "auto") ? Promise.resolve(!1) : I(e, { consumers: { [t.id]: { runs: n } } });
}
function fo(e, t, n) {
	return C`<select
    class="input"
    aria-label=${e("consumers.kind_of", { name: t.name })}
    .value=${t.kind}
    @change=${(e) => n(e.target.value)}
  >
    ${In.map((n) => C`<option value=${n} ?selected=${n === t.kind}>${e(`kind.${n}`)}</option>`)}
  </select>`;
}
function po(e, t, n) {
	if (t.kind === "submeter") return A;
	let r = t.runs ?? "auto";
	return C`<select
    class="input"
    aria-label=${e("consumers.runs_of", { name: t.name })}
    .value=${r}
    @change=${(e) => n(e.target.value)}
  >
    ${t.kind === "ev" ? oo.map((t) => C`<option value=${t} ?selected=${t === r}>${e(`runs.ev.${t}`)}</option>`) : so.map((t) => C`<option value=${t} ?selected=${t === r}>${e(`runs.${t}`)}</option>`)}
  </select>`;
}
function mo(t, n, r, i, a) {
	let s = a.power_entity ?? a.energy_entity;
	return C`${s ? C`<div class="meter-line">
          <span class="meter-label">${n("devices.meter")}</span>
          <span class="meter-value"><b>${f(r, s)}</b> · ${ne(r, s, n.lang)}</span>
          ${e(n, P(i, `consumers[${a.id}].kind`))}
        </div>` : A}
    <div class="field" data-tipped>
      <div class="field-label">${n("consumers.kind")} ${o(n, "f_consumer_kind")}</div>
      ${fo(n, a, (e) => void lo(t, a, e))}
    </div>
    ${a.kind === "submeter" ? A : C`<div class="field" data-tipped>
          <div class="field-label">${n("consumers.runs")} ${o(n, "f_consumer_runs")}</div>
          ${po(n, a, (e) => void uo(t, a, e))}
        </div>`}`;
}
var ho = T`
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
`, go = class extends x {
	static {
		this.styles = [d, T`
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
		let { t, hass: n, config: r } = this;
		if (!t || !n || !r) return A;
		let i = [...r.consumers].sort((e, n) => Number(e.kind === "submeter") - Number(n.kind === "submeter") || e.name.localeCompare(n.name, t.lang));
		return C`<div data-tipped>
      <div class="head">${t("consumers.kind")} ${o(t, "f_consumer_kind")}</div>
      <div class="head sub">${t("consumers.runs")} ${o(t, "f_consumer_runs")}</div>
      ${i.length ? C`<ul>
            ${i.map((i) => {
			let a = i.power_entity ? ne(n, i.power_entity, t.lang) : "";
			return C`<li>
                <div>
                  <b>${i.name}</b>
                  <small>${e(t, P(r, `consumers[${i.id}].kind`))}${a}</small>
                </div>
                <div class="selects">
                  ${fo(t, i, (e) => void lo(this, i, e))}
                  ${po(t, i, (e) => void uo(this, i, e))}
                </div>
              </li>`;
		})}
          </ul>` : C`<p class="empty">${t("consumers.empty")}</p>`}
    </div>`;
	}
};
s([O({ attribute: !1 })], go.prototype, "hass", void 0), s([O({ attribute: !1 })], go.prototype, "t", void 0), s([O({ attribute: !1 })], go.prototype, "config", void 0), j("joe-consumer-list", go);
//#endregion
//#region src/pages/devices/car-point.ts
var _o = class extends K {
	constructor(...e) {
		super(...e), this.busy = !1, this.failed = !1;
	}
	static {
		this.styles = [
			d,
			G,
			ho,
			Za,
			T`
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
		if (!e || !t || !n || !r || !i) return A;
		let a = ri(this.ctx, r), o = r.consumer;
		return ci(this.ctx, {
			...a,
			live: m(e, n, i),
			why: Tn(e, n, i),
			now: C`${this.which(e, n, i)}
        <joe-action-tonight .hass=${t} .t=${e} .state=${n} .action=${i}></joe-action-tonight>`,
			steer: C`<joe-action-steer
        .hass=${t}
        .t=${e}
        .state=${n}
        .discovery=${this.discovery}
        .prefix=${this.prefix}
        .action=${i}
        .section=${"point"}
      ></joe-action-steer>`,
			power: o ? mo(this, e, t, n.config, o) : void 0,
			tips: {
				now: "point_now",
				steer: "point_steer"
			},
			removeTitle: e("devices.page.delete"),
			remove: C`<joe-action-delete
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
		let i = p(t, n.id), a = ee(t.config, n), s = t.cars?.answers?.[n.id], c = !!i?.ask, l = r(t.config, i?.car), u = l ? h(l.id) : void 0, d = (e) => this.answer(n.id, e);
		return C`<div class="which ${c ? "ask" : ""}" data-tipped>
      ${c ? C`<p class="q">${e("point.ask", { point: n.name })} ${o(e, "point_which")}</p>
            <p>${e("point.ask.text")}</p>` : C`<p>${m(e, t, n)} ${o(e, "point_which")}</p>`}
      ${u && l ? C`<a class="mini-btn quiet car-link" href=${k(this.prefix, u)} @click=${D(u)}>${e("point.open_car", { car: l.name })}</a>` : A}
      ${a.length && i && i.state !== "empty" && i.state !== "free" ? C`${c ? A : Xa(e("point.other_car"))}
            <div class="choices" role="group" aria-label=${e("point.ask", { point: n.name })}>
              ${a.map((e) => C`<button
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
              ${s ? C`<button type="button" class="mini-btn quiet" ?disabled=${this.busy} @click=${() => d(null)}>
                    ${e("point.forget")}
                  </button>` : A}
            </div>` : A}
      ${this.failed ? C`<p class="bad" role="status">${e("error.action")}</p>` : A}
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
s([O({ attribute: !1 })], _o.prototype, "entry", void 0), s([N()], _o.prototype, "busy", void 0), s([N()], _o.prototype, "failed", void 0);
var vo = class extends K {
	static {
		this.styles = [
			d,
			G,
			ho,
			Za
		];
	}
	render() {
		let { t: e, hass: t, state: n, entry: r } = this, i = r?.consumer;
		return !e || !t || !n || !r || !i ? A : ci(this.ctx, {
			...ri(this.ctx, r),
			now: qa(e, this.prefix, "wallbox", i.id, e("devices.car.lonely"), e("devices.car.set_up"), "devices_lonely_car"),
			power: mo(this, e, t, n.config, i)
		});
	}
};
s([O({ attribute: !1 })], vo.prototype, "entry", void 0), j("joe-car-point", _o), j("joe-car-meter", vo);
//#endregion
//#region src/pages/devices/car.ts
var yo = class extends K {
	static {
		this.styles = [
			d,
			G,
			Za,
			T`
      joe-car-search.search {
        margin-top: 20px;
      }
    `
		];
	}
	target() {
		return this.device === "point" ? ft(this.devices, "car", `point:${this.sub ?? ""}`) : ft(this.devices, "car", this.device) ?? (this.device ? ft(this.devices, "car", `point:${this.device}`) : void 0);
	}
	render() {
		let e = this.t;
		if (!e || !this.state) return A;
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
		if (t?.car) return C`<joe-car-device
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
		if (t?.point) return C`<joe-car-point
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
		if (t) return C`<joe-car-meter
        .hass=${n.hass}
        .t=${e}
        .state=${n.state}
        .prefix=${n.prefix}
        .devices=${n.devices}
        .entry=${t}
      ></joe-car-meter>`;
		let r = this.device && this.device !== "point" ? Ja(this.devices, this.device, "car") : void 0, i = this.devices.filter((e) => e.group === "car" && e.car), a = this.devices.filter((e) => e.group === "car" && !e.car);
		return C`<div class="wrap">
      ${ui(e, e("nav.devices.car"), e("devices.car.lead"), this.devices.some((e) => e.group === "car"))}
      ${this.device === void 0 ? A : r ? Ya(e, this.prefix, r.name, r) : ti(e)}
      ${i.length ? C`<h3 class="sub-group">${e("devices.car.cars")}</h3>` : A}
      ${li(this.ctx, i, "car")}
      ${a.length ? C`<h3 class="sub-group">${e("devices.car.points")}</h3>` : A}
      ${li(this.ctx, a, "car")}
      <div class="group-actions">
        ${di(e, this.prefix, "car", e("devices.group_add.car"))} ${di(e, this.prefix, "wallbox", e("devices.group_add.wallbox"))}
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
s([O({ attribute: !1 })], yo.prototype, "device", void 0), s([O({ attribute: !1 })], yo.prototype, "sub", void 0), j("joe-car-group", yo);
//#endregion
//#region node_modules/lit-html/directives/repeat.js
var bo = (e, t, n) => {
	let r = /* @__PURE__ */ new Map();
	for (let i = t; i <= n; i++) r.set(e[i], i);
	return r;
}, xo = cr(class extends lr {
	constructor(e) {
		if (super(e), e.type !== sr.CHILD) throw Error("repeat() can only be used in text expressions");
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
		let i = ar(e), { values: a, keys: o } = this.dt(t, n, r);
		if (!Array.isArray(i)) return this.ut = o, a;
		let s = this.ut ??= [], c = [], l, u, d = 0, f = i.length - 1, p = 0, m = a.length - 1;
		for (; d <= f && p <= m;) if (i[d] === null) d++;
		else if (i[f] === null) f--;
		else if (s[d] === o[p]) c[p] = nr(i[d], a[p]), d++, p++;
		else if (s[f] === o[m]) c[m] = nr(i[f], a[m]), f--, m--;
		else if (s[d] === o[m]) c[m] = nr(i[d], a[m]), tr(e, c[m + 1], i[d]), d++, m--;
		else if (s[f] === o[p]) c[p] = nr(i[f], a[p]), tr(e, i[d], i[f]), f--, p++;
		else if (l === void 0 && (l = bo(o, p, m), u = bo(s, d, f)), l.has(s[d])) {
			if (l.has(s[f])) {
				let t = u.get(o[p]), n = t === void 0 ? null : i[t];
				if (n === null) {
					let t = tr(e, i[d]);
					nr(t, a[p]), c[p] = t;
				} else c[p] = nr(n, a[p]), tr(e, i[d], n), i[t] = null;
				p++;
			} else or(i[f]), f--;
		} else or(i[d]), d++;
		for (; p <= m;) {
			let t = tr(e, c[m + 1]);
			nr(t, a[p]), c[p++] = t;
		}
		for (; d <= f;) {
			let e = i[d++];
			e !== null && or(e);
		}
		return this.ut = o, ir(e, c), xe;
	}
}), So = 1435, Co = 1440;
function wo(e, t) {
	let n = (t ?? "").trim();
	return !n || /^profile?\s*\d+$/i.test(n) ? e : `${e} ${n}`;
}
var To = {
	normal: "mdi:home-outline",
	holiday: "mdi:calendar-star",
	away: "mdi:home-export-outline",
	home_office: "mdi:laptop"
}, Eo = {
	all: 1,
	week_weekend: 2,
	each: 7
};
function Do(e, t) {
	return e === "all" ? 0 : e === "week_weekend" ? t < 5 ? 0 : 1 : t;
}
function Oo(e) {
	return `${String(Math.floor(e / 60)).padStart(2, "0")}:${String(e % 60).padStart(2, "0")}`;
}
function ko(e) {
	let t = /^(\d{1,2}):(\d{2})/.exec(e);
	if (!t) return null;
	let n = Number(t[1]), r = Number(t[2]);
	return n < 24 && r < 60 ? n * 60 + r : null;
}
function Ao(e, t) {
	let n;
	for (let [r, i] of e) r <= t && (n = i);
	return n;
}
function jo(e) {
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
function Mo(e, t, n, r) {
	let i = Math.round(e / t) * t;
	return Math.round(Math.min(r, Math.max(n, i)) * 10) / 10;
}
function No(e, t) {
	let n = (e) => e.map(([e, t]) => [e, t]), r = (t) => n(e.curves[Do(e.split, t)] ?? e.curves[0]);
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
function Po(e) {
	let t = 0, n = -1;
	for (let r = 0; r < e.length; r++) {
		let i = e[r + 1]?.[0] ?? 1440;
		i - e[r][0] > n && (t = e[r][0], n = i - t);
	}
	if (n < 0) return null;
	let r = Math.min(So, Math.round((t + n / 2) / 15) * 15);
	return r > t && !e.some(([e]) => e === r) ? r : null;
}
function Fo(e) {
	if (e.length !== 6) return "count";
	let t = /* @__PURE__ */ new Set();
	for (let n of e) {
		for (let e of n.tags) {
			if (t.has(e)) return "tags";
			t.add(e);
		}
		if (n.curves.length !== Eo[n.split]) return "curves";
		for (let e of n.curves) {
			if (!e.length || e.length > 12 || e[0][0] !== 0) return "points";
			for (let t = 1; t < e.length; t++) if (e[t][0] <= e[t - 1][0] || e[t][0] % 5) return "points";
		}
	}
	return null;
}
//#endregion
//#region src/components/week-bar.ts
var Io = class extends x {
	constructor(...e) {
		super(...e), this.points = [], this.mode = "heat", this.now = null, this.compact = !1, this.lang = "en", this.label = "", this.offText = "off";
	}
	static {
		this.styles = T`
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
		return C`<div class="track">
        <div class="bar" role="img" aria-label=${this.label}>
          ${t.map(({ from: e, to: t, value: r }) => {
			let i = `left:${e / Co * 100}%;width:${(t - e) / Co * 100}%;`;
			return r === "off" ? C`<span class="seg off" style=${i}>${this.compact ? A : this.offText}</span>` : C`<span class="seg" style=${i + this.color(r)}>
              ${this.compact ? A : `${n(this.lang, r, 1)}°`}
            </span>`;
		})}
        </div>
        ${this.now == null ? A : C`<span class="now" style=${`left:${this.now / Co * 100}%`}></span>`}
      </div>
      ${this.compact ? A : C`<div class="ticks" aria-hidden="true">
            ${[
			0,
			6,
			12,
			18,
			24
		].map((e) => C`<span style=${`left:${e / 24 * 100}%`}>${e}</span>`)}
          </div>`}`;
	}
	color(e) {
		let t = this.mode === "cool" ? (28 - e) / 10 : (e - 16) / 10, n = Math.round(25 + Math.min(1, Math.max(0, t)) * 75), r = this.mode === "cool" ? "cool" : "heat";
		return `background:color-mix(in srgb, var(--wk-${r}) ${n}%, var(--wk-${r}-weak));`;
	}
};
s([O({ attribute: !1 })], Io.prototype, "points", void 0), s([O()], Io.prototype, "mode", void 0), s([O({ attribute: !1 })], Io.prototype, "now", void 0), s([O({
	type: Boolean,
	reflect: !0
})], Io.prototype, "compact", void 0), s([O()], Io.prototype, "lang", void 0), s([O()], Io.prototype, "label", void 0), s([O()], Io.prototype, "offText", void 0), j("joe-week-bar", Io);
//#endregion
//#region src/editors/week-editor.ts
var Lo = [
	"all",
	"week_weekend",
	"each"
], Ro = "23:00", zo = "06:30", Bo = {
	tab: "household",
	section: "days"
};
function Vo(e, t, n = "long") {
	return new Intl.DateTimeFormat(e, {
		weekday: n,
		timeZone: "UTC"
	}).format(new Date(Date.UTC(2024, 0, 1 + t)));
}
var J = class extends x {
	constructor(...e) {
		super(...e), this.entityId = "", this.prefix = M, this.fetched = !1, this.failed = !1, this.drafts = {}, this.selected = {
			heat: 0,
			cool: 0
		}, this.open = 0, this.creating = !1, this.saving = !1, this.errors = {}, this.fitted = {}, this.loaded = !1, this.requested = !1;
	}
	static {
		this.styles = [d, T`
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
		this.hass && !this.requested && (this.requested = !0, this.load()), (e.has("config") || e.has("entityId")) && this.config && this.entityId && !this.loaded && (this.loaded = !0, this.drafts = structuredClone(this.room?.week?.modes ?? {}), this.fitDrafts(Bn), this.pickMode()), this.device && this.loaded && !this.mode && (this.fitDrafts(Bn), this.pickMode()), e.has("startMode") && this.mode && this.startMode && this.startMode !== this.mode && this.modes.includes(this.startMode) && this.showMode(this.startMode);
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
		this.fetched = !0, this.fitDrafts(Bn), this.pickMode();
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
					let a = Mo(i, t, n, r);
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
		return Bn.filter((e) => this.device?.hvac_modes.includes(e));
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
		return jo(this.hass?.config?.time_zone);
	}
	openToday() {
		let e = this.profiles?.[this.index];
		this.open = e ? Do(e.split, this.now.weekday) : 0;
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
		if (!e || !this.config) return A;
		let n = C`<div class="sheet-title">${b(e("week.title"))}</div>`;
		if (!t) return C`${n}
        ${this.fetched ? C`<div class="note warn">
              <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e(this.failed ? "week.load_failed" : "week.device_missing")}</span>
            </div>` : C`<p class="field-hint">${e("week.loading")}</p>`}
        <div class="actions" data-notip>
          <button type="button" class="btn btn-secondary" @click=${this.close}>${e("mode.close")}</button>
        </div>`;
		let r = this.modes, i = this.mode, a = this.profiles;
		return C`${n}
      <div class="head">
        <b>${ie(t.device_id, t.name, e("climate.open_device", { id: t.entity_id }))}</b>
        ${t.area ? C`<span class="chip">${t.area}</span>` : A}
      </div>
      ${r.length ? C`<div class="field" data-tipped>
            <div class="field-label">${e("week.modes")} ${o(e, "week_mode")}</div>
            <span class="seg" role="group" aria-label=${e("week.modes")}>
              ${r.map((t) => C`<button type="button" aria-pressed=${String(t === i)} @click=${() => this.setMode(t)}>
                  ${e(`week.mode.${t}`)}${this.errors[t] ? C`<span class="dot bad" title=${this.errors[t]}></span>` : this.isDirty(t) ? C`<span class="dot" title=${e("week.unsaved")}></span>` : A}
                </button>`)}
            </span>
          </div>` : C`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("week.no_modes")}</span></div>`}
      ${i ? a ? this.renderSet(e, i, a) : this.renderEmpty(e, i) : A}
      <div class="foot" data-notip>
        ${i && this.errors[i] ? C`<div class="note warn" role="alert">
              <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("week.save_failed", {
			mode: e(`week.mode.${i}`),
			error: this.errors[i]
		})}</span>
            </div>` : A}
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
          ${r.some((e) => this.isDirty(e)) ? C`<span class="chip warn">${e("week.unsaved")}</span>` : A}
        </div>
      </div>`;
	}
	renderEmpty(e, t) {
		return C`<div class="empty" data-tipped>
      <p>${e("week.empty", { mode: e(`week.mode.${t}`) })}</p>
      <span class="with-tip">
        <button type="button" class="btn btn-primary" ?disabled=${this.creating} @click=${() => void this.create(t)}>
          ${e(this.creating ? "week.creating" : "week.create")}
        </button>
        ${o(e, "week_create")}
      </span>
    </div>`;
	}
	renderSet(e, t, n) {
		let r = this.status?.rooms?.[this.entityId], i = r?.kind === "week" && r.mode === t ? r.profile?.index : void 0, a = this.now, s = this.index, c = n[s];
		return C`<div class="field" data-tipped>
        <div class="field-label">${e("week.profiles")} ${o(e, "week_profiles")}</div>
        <div class="tiles" role="group" aria-label=${e("week.profiles")}>
          ${n.map((n, r) => {
			let o = n.name || e("week.profile", { n: r + 1 });
			return C`<button
              type="button"
              class="tile"
              aria-pressed=${String(r === s)}
              @click=${() => this.select(r)}
            >
              <span class="tile-top">
                <span class="no" aria-hidden="true">${r + 1}</span>
                <span class="name">${o}</span>
                ${r === i ? C`<span class="running" role="img" aria-label=${e("week.running")} title=${e("week.running")}></span>` : A}
              </span>
              <span class="tile-tags">
                ${n.tags.map((t) => C`<span><ha-icon icon=${To[t]}></ha-icon>${e(`week.tag.${t}`)}</span>`)}
              </span>
              <joe-week-bar
                compact
                .points=${n.curves[Do(n.split, a.weekday)] ?? n.curves[0] ?? []}
                .now=${a.minute}
                mode=${t}
                lang=${e.lang}
                label=${e("week.curve", { label: `${o}, ${e("week.today")}` })}
              ></joe-week-bar>
            </button>`;
		})}
        </div>
        ${n.some((e) => e.tags.includes("normal")) ? A : C`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("week.no_normal")}</span></div>`}
      </div>
      ${c ? this.renderProfile(e, t, n, c) : A}`;
	}
	renderProfile(e, t, n, r) {
		let i = this.index, a = this.status?.day, s = !a || a.home_office_available, c = a?.home_office_reason ?? "no_calendar";
		return C`<div class="profile">
      <div class="field" data-tipped>
        <div class="field-label"><label for="week-name">${e("week.name")}</label> ${o(e, "week_name")}</div>
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
        <div class="field-label">${e("week.tags")} ${o(e, "week_tags")}</div>
        <div class="tags" role="group" aria-label=${e("week.tags")}>
          ${zn.map((t) => {
			let i = r.tags.includes(t), a = t === "home_office" && !s && !i;
			return C`<button
              type="button"
              class="mini-btn tag-btn"
              aria-pressed=${String(i)}
              ?disabled=${a}
              title=${a ? e(`week.ho.${c}`) : ""}
              @click=${() => this.toggleTag(n, t)}
            >
              <ha-icon icon=${To[t]}></ha-icon>${e(`week.tag.${t}`)}
            </button>`;
		})}
        </div>
        ${s ? A : C`<p class="field-hint">${e(`week.ho.${c}`)}</p>
              <div>
                <a class="mini-btn quiet" href=${k(this.prefix, Bo)} @click=${D(Bo)}>
                  <ha-icon icon="mdi:calendar-text-outline"></ha-icon>${e("week.ho.rules")}
                </a>
              </div>`}
        ${r.tags.length ? A : C`<p class="field-hint">${e("week.untagged")}</p>`} ${this.noticeAt("tags")}
      </div>
      <div class="field" data-tipped>
        <div class="field-label">${e("week.days")} ${o(e, "week_split")}</div>
        <span class="seg full" role="group" aria-label=${e("week.days")}>
          ${Lo.map((t) => C`<button type="button" aria-pressed=${String(r.split === t)} @click=${() => this.setSplit(t)}>
              ${e(`week.split.${t}`)}
            </button>`)}
        </span>
      </div>
      ${this.noticeAt("days")} ${this.renderGroups(e, t, r)}
    </div>`;
	}
	noticeAt(e) {
		return this.notice?.at === e ? C`<div class="note" role="status"><ha-icon icon="mdi:information-outline"></ha-icon><span>${this.notice.text}</span></div>` : A;
	}
	groupLabel(e, t, n) {
		return t === "all" ? e("week.group.all") : t === "week_weekend" ? e(n === 0 ? "week.group.weekdays" : "week.group.weekend") : Vo(e.lang, n);
	}
	renderGroups(e, t, r) {
		let i = this.now, a = Do(r.split, i.weekday), s = r.curves.length > 1, { step: c, min: l, max: u } = this.limits, d = this.room;
		return C`<div class="field" data-tipped>
      <div class="field-label">${e("week.points")} ${o(e, "week_points")}</div>
      <p class="field-hint">
        ${e("week.limits", {
			min: n(e.lang, l, 1),
			max: n(e.lang, u, 1),
			step: n(e.lang, c, 2)
		})}
      </p>
      ${this.fitted[t] ? C`<div class="note" role="status"><ha-icon icon="mdi:information-outline"></ha-icon><span>${e("week.fitted")}</span></div>` : A}
      ${d?.night_off ? C`<p class="field-hint">
            ${this.config?.climate?.night_by === "entity" ? e("week.night_entity", { until: d.night_until ?? zo }) : e("week.night_time", {
			from: d.night_from ?? Ro,
			until: d.night_until ?? zo
		})}
          </p>` : A}
      <div class="groups">
        ${r.curves.map((n, o) => {
			let d = this.groupLabel(e, r.split, o), f = !s || this.open === o, p = C`<span class="day-label">
              ${s ? C`<ha-icon icon=${f ? "mdi:chevron-down" : "mdi:chevron-right"}></ha-icon>` : A}${d}
              ${o === a ? C`<span class="chip ok">${e("week.today")}</span>` : A}
            </span>
            <joe-week-bar
              .points=${n}
              .now=${o === a ? i.minute : null}
              mode=${t}
              lang=${e.lang}
              offText=${e("week.off")}
              label=${e("week.curve", { label: d })}
            ></joe-week-bar>`;
			return C`<div class="group ${f ? "open" : ""}">
            ${s ? C`<button type="button" class="group-head" aria-expanded=${String(f)} @click=${() => this.openGroup(o)}>${p}</button>` : C`<div class="group-head">${p}</div>`}
            ${f ? this.renderPoints(e, r, o, n, {
				step: c,
				min: l,
				max: u
			}) : A}
          </div>`;
		})}
      </div>
    </div>`;
	}
	renderPoints(e, t, r, i, a) {
		let { step: s, min: c, max: l } = a, u = n(e.lang, s, 2), d = this.rowError?.curve === r ? this.rowError : void 0;
		return C`<div class="points" role="list" aria-label=${e("week.points")}>
        ${xo(i, ([e]) => e, ([t, n], i) => {
			let a = Oo(t);
			return C`<div class="point" role="listitem">
              ${i === 0 ? C`<span class="time fixed" title=${e("week.point.first")}>00:00</span>` : C`<input
                    class="input time"
                    type="time"
                    step="300"
                    required
                    aria-label=${e("week.point.time")}
                    .value=${a}
                    @blur=${(e) => this.setTime(r, i, e.target)}
                    @keydown=${(e) => e.key === "Enter" && e.target.blur()}
                  />`}
              <span class="value">
                ${n === "off" ? C`<span class="off-text">${e("week.off")}</span>` : C`<button
                        type="button"
                        class="mini-btn step"
                        aria-label=${e("week.point.less", { step: u })}
                        ?disabled=${n <= c}
                        @click=${() => this.setValue(r, i, n - s)}
                      >
                        −
                      </button>
                      <input
                        class="input num"
                        type="number"
                        inputmode="decimal"
                        step=${s}
                        min=${c}
                        max=${l}
                        aria-label=${e("week.point.value", { time: a })}
                        .value=${String(n)}
                        @change=${(e) => {
				let t = e.target, a = Number.parseFloat(t.value.replace(",", "."));
				t.value = String(Number.isFinite(a) ? this.setValue(r, i, a) : n);
			}}
                      />
                      <button
                        type="button"
                        class="mini-btn step"
                        aria-label=${e("week.point.more", { step: u })}
                        ?disabled=${n >= l}
                        @click=${() => this.setValue(r, i, n + s)}
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
                  aria-checked=${String(n === "off")}
                  aria-label=${e("week.point.off", { time: a })}
                  @click=${() => this.toggleOff(r, i)}
                ></button>
                <span aria-hidden="true">${e("week.off")}</span>
              </span>
              ${i === 0 ? C`<span class="del"></span>` : C`<button
                    type="button"
                    class="mini-btn quiet del"
                    aria-label=${e("week.point.delete", { time: a })}
                    title=${e("week.point.delete", { time: a })}
                    @click=${() => this.removePoint(r, i)}
                  >
                    <ha-icon icon="mdi:delete-outline"></ha-icon>
                  </button>`}
            </div>
            ${d?.point === i ? C`<p class="row-error" role="alert">${d.text}</p>` : A}`;
		})}
      </div>
      <div class="point-actions">
        <span class="with-tip" data-tipped>
          <button type="button" class="mini-btn" ?disabled=${i.length >= 12} @click=${() => this.addPoint(r)}>
            <ha-icon icon="mdi:plus"></ha-icon>${e("week.point.add")}
          </button>
          ${o(e, "week_add")}
        </span>
        ${t.curves.length > 1 ? this.renderCopy(e, t, r) : A}
      </div>
      ${i.length >= 12 ? C`<p class="field-hint">${e("week.point.max")}</p>` : A} ${this.noticeAt("points")}`;
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
				label: Vo(e.lang, t)
			}))
		];
		return C`<span class="with-tip" data-tipped>
      <select
        class="input copy"
        aria-label=${e("week.copy")}
        @change=${(e) => {
			let t = e.target, i = r.find((e) => e.value === t.value);
			t.value = "", i && this.copyTo(n, i.value, i.label);
		}}
      >
        <option value="" selected disabled>${e("week.copy")}</option>
        ${r.map((e) => C`<option value=${e.value}>${e.label}</option>`)}
      </select>
      ${o(e, "week_copy")}
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
			a >= 0 && (n[a].tags = n[a].tags.filter((e) => e !== t)), e.tags = zn.filter((n) => n === t || e.tags.includes(n));
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
			t.curves = No(t, e), t.split = e;
		});
		let i = Eo[e] > Eo[r] ? t("week.split.split") : r === "each" && e === "week_weekend" ? t("week.split.merged_days") : t("week.split.merged", { first: r === "each" ? Vo(t.lang, 0) : t("week.group.weekdays") });
		this.notice = {
			text: i,
			at: "days"
		}, this.open = Do(e, this.now.weekday);
	}
	setTime(e, t, n) {
		let r = this.t, i = this.profiles?.[this.index]?.curves[e];
		if (!i) return;
		let a = i[t][0], o = ko(n.value);
		if (o == null) {
			n.value = Oo(a);
			return;
		}
		let s = Math.min(So, Math.max(5, Math.round(o / 5) * 5));
		if (s === a) {
			n.value = Oo(a);
			return;
		}
		if (i.some(([e], n) => n !== t && e === s)) {
			n.value = Oo(a), this.rowError = {
				curve: e,
				point: t,
				text: r("week.point.duplicate", { time: Oo(s) })
			};
			return;
		}
		n.value = Oo(s), this.changeCurve(e, (e) => {
			e[t][0] = s;
		});
	}
	setValue(e, t, n) {
		let { step: r, min: i, max: a } = this.limits, o = Mo(n, r, i, a);
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
			o = Mo(Number(e ?? s ?? this.fallbackValue()), r, i, a);
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
		let r = Po(n);
		if (r == null) {
			this.notice = {
				text: t("week.point.no_room"),
				at: "points"
			};
			return;
		}
		let i = Ao(n, r) ?? this.fallbackValue();
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
					[e]: Ho(t)
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
			let n = Fo(this.drafts[t]);
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
			let n = Ho(t);
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
s([O({ attribute: !1 })], J.prototype, "hass", void 0), s([O({ attribute: !1 })], J.prototype, "t", void 0), s([O({ attribute: !1 })], J.prototype, "config", void 0), s([O({ attribute: !1 })], J.prototype, "status", void 0), s([O({ attribute: !1 })], J.prototype, "entityId", void 0), s([O({ attribute: !1 })], J.prototype, "found", void 0), s([O({ attribute: !1 })], J.prototype, "prefix", void 0), s([O({ attribute: !1 })], J.prototype, "startMode", void 0), s([N()], J.prototype, "device", void 0), s([N()], J.prototype, "fetched", void 0), s([N()], J.prototype, "failed", void 0), s([N()], J.prototype, "drafts", void 0), s([N()], J.prototype, "mode", void 0), s([N()], J.prototype, "selected", void 0), s([N()], J.prototype, "open", void 0), s([N()], J.prototype, "notice", void 0), s([N()], J.prototype, "rowError", void 0), s([N()], J.prototype, "creating", void 0), s([N()], J.prototype, "saving", void 0), s([N()], J.prototype, "errors", void 0), s([N()], J.prototype, "fitted", void 0);
function Ho(e) {
	return String(e?.message ?? e);
}
j("joe-week-editor", J);
//#endregion
//#region src/pages/devices/climate-view.ts
var Uo = {
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
function Wo(e, t) {
	let n = /^week_program_(\d+)$/.exec(e);
	return n ? Number(n[1]) : t + 1;
}
function Go(e) {
	return JSON.stringify(Object.keys(e).sort().map((t) => [
		t,
		e[t]?.name ?? "",
		e[t]?.tags ?? []
	]));
}
function Ko(e, t, n, r) {
	let i = {
		...Uo,
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
function qo(e, t, n) {
	let r = t[e.entity_id]?.meter, i = n?.suggested?.[e.entity_id]?.device_id;
	return e.hvac_modes.some((e) => [
		"cool",
		"dry",
		"fan_only",
		"heat_cool"
	].includes(e)) || r != null && r !== "none" || i != null && i === e.device_id;
}
function Jo(e) {
	return !!e?.meter && e.meter !== "none";
}
function Yo(e, t, n) {
	let r = e?.states[n]?.attributes, i = (e) => e == null || e === "" || !Number.isFinite(Number(e)) ? null : Number(e);
	return {
		current: i(r?.current_temperature ?? t?.current_temperature),
		target: i(r?.temperature ?? t?.temperature)
	};
}
function Xo(e, t) {
	let { current: r, target: i } = t;
	return r !== null && i !== null ? e("devices.card.climate", {
		current: n(e.lang, r, 1),
		target: n(e.lang, i, 1)
	}) : r === null ? void 0 : e("devices.card.temp", { value: n(e.lang, r, 1) });
}
function Zo(e, t, n, r) {
	if (!n?.kind || n.kind === "legacy") return;
	if (n.override?.reason === "off") return e("week.why.off_by_hand");
	let i = n.target;
	if (n.kind === "device") {
		let n = i?.preset;
		if (!i) return e("week.as_is");
		if (i.hvac === "off") return e("week.state_off");
		if (!n) return;
		let a = (t.week_presets ?? []).indexOf(n);
		return wo(e("week.profile", { n: Wo(n, Math.max(0, a)) }), r[n]?.name);
	}
	return n.profile?.index == null ? i ? i.hvac === "off" ? e("week.state_off") : void 0 : e("week.as_is") : wo(e("week.profile", { n: n.profile.index + 1 }), n.profile.name);
}
function Qo(e, t, n) {
	if (t?.why) return e.optional(`week.why.${t.why}`, { min: n }) ?? e.optional(`climate.why.${t.why}`);
}
function $o(e, t, n) {
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
var es = {
	tab: "household",
	section: "days"
}, ts = {
	tab: "household",
	section: "night"
}, ns = [
	"auto",
	"surplus",
	"cheap"
], Y = class extends x {
	constructor(...e) {
		super(...e), this.prefix = M, this.devices = [], this.picking = !1, this.query = "", this.holdUntil = {}, this.pending = {}, this.moved = {}, this.weekError = {};
	}
	static {
		this.styles = [
			d,
			G,
			T`
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
			let e = this.state?.config.climate?.rooms ?? {}, t = Object.fromEntries(Object.entries(this.pending).filter(([t, n]) => Go(e[t]?.device_profiles ?? {}) !== Go(n)));
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
		if (!e || !t || !n) return A;
		if (n.unassigned && n.consumer) return this.renderUnassigned(e, t, n, n.consumer);
		let r = this.ctx, i = ri(r, n), a = Object.fromEntries((this.found?.devices ?? []).map((e) => [e.entity_id, e.name])), o = i.log ? {
			...i.log,
			names: a
		} : void 0, s = n.climate ?? this.found?.devices.find((e) => e.entity_id === n.id);
		if (!s) return ci(r, {
			...i,
			log: o
		});
		let c = s.entity_id, l = t.climate?.rooms?.[c], u = Ko(s, t.config.climate?.rooms?.[c], l, this.profilesOf(c)), d = t.climate?.rates?.[c];
		return C`${ci(r, {
			...i,
			live: Xo(e, Yo(this.hass, s, c)),
			why: this.renderWhy(e, s, u, l),
			head: this.renderHead(e, t, s, u, l),
			now: u.room.enabled ? this.renderNowSection(e, s, u, l) : void 0,
			steer: this.renderSteer(e, t, s, u, l),
			power: this.renderPower(e, t, n, s),
			learned: u.room.enabled || d ? C`<p class="learned-line">${Aa(e, d)}</p>` : void 0,
			learnedArea: "climate",
			log: o,
			tips: { power: "climate_meter" }
		})}
    ${this.sub === "week" ? this.renderWeekSheet(e, t, s) : A}`;
	}
	nowShown(e, t) {
		if (!e.room.enabled || !t?.kind || t.kind === "legacy") return !1;
		if (e.cooling && !e.programs.length) return !!e.room.week?.enabled && e.sets.length > 0 && t.pending !== "start";
		let n = this.profilesOf(this.entry?.id ?? ""), r = e.programs.flatMap((e) => n[e]?.tags ?? []);
		return e.programs.length > 0 && r.length > 0 && t.kind === "device";
	}
	renderWhy(e, t, n, r) {
		if (!n.room.enabled) return e("climate.room.off");
		let i = n.cooling && !n.programs.length && n.room.week?.enabled && n.sets.length && r?.pending !== "start" && r?.kind === "legacy" ? C`<span class="week-now quiet">
            ${e("week.legacy_now", { state: this.hvacText(e, this.hass?.states[t.entity_id]?.state ?? t.state) })}
          </span>` : A, a = r && n.legacy ? e.optional(`climate.now.${r.why}`, { min: this.awayAfter }) ?? "" : "";
		return C`${this.nowShown(n, r) ? this.nowLine(e, t, r) : A} ${i}
    ${a ? C`<span class="week-now quiet">${a}</span>` : A}`;
	}
	nowLine(e, t, r) {
		let i = r.override;
		if (i?.reason === "off") return C`<span class="week-now"><ha-icon icon="mdi:power"></ha-icon><span>${e("week.override.off")}</span></span>`;
		if (i) {
			let t = i.reason === "preset" ? i.until ? e("week.override.preset", { time: i.until }) : e("week.override.preset_open") : i.until ? e("week.override.manual", { time: i.until }) : e("week.override.manual_open");
			return C`<span class="week-now"><ha-icon icon="mdi:hand-back-right-outline"></ha-icon><span>${t}</span></span>`;
		}
		let a = r.target, o = [];
		if (r.kind === "device") {
			let n = a?.preset;
			if (!a) o.push(e("week.as_is"));
			else if (a.hvac === "off") o.push(e("week.state_off"));
			else if (n) {
				let r = (t.week_presets ?? []).indexOf(n), i = e("week.profile", { n: Wo(n, Math.max(0, r)) });
				o.push(wo(i, this.profilesOf(t.entity_id)[n]?.name));
			}
		} else {
			if (o.push(a ? a.hvac === "off" ? e("week.state_off") : e(`week.mode.${r.mode === "heat" ? "heat" : "cool"}`) : e("week.as_is")), r.profile?.index != null) {
				let t = wo(e("week.profile", { n: r.profile.index + 1 }), r.profile.name);
				o.push(r.profile.held && r.why !== "held" ? `${t} (${e("week.held")})` : t);
			}
			a && a.hvac !== "off" && a.temperature != null && o.push(`${n(e.lang, a.temperature, 1)} °C`), r.next && o.push(e("week.next", {
				time: r.next.at,
				value: this.valueText(e, r.next.value)
			}));
		}
		let s = e.optional(`week.why.${r.why}`, { min: this.awayAfter });
		return C`<span class="week-now">
      <span>${e(r.would ? "week.would" : "week.now", { text: o.join(" · ") || "–" })}</span>
      ${s ? C`<span class="chip">${s}</span>` : A}
    </span>`;
	}
	valueText(e, t) {
		return t === "off" ? e("week.off") : `${n(e.lang, t, 1)} °C`;
	}
	renderHead(e, t, n, r, i) {
		let a = this.nowShown(r, i) ? this.weekError[n.entity_id] ?? i?.error : void 0, o = t.config.climate?.enabled;
		return C`<div class="head-extra">
      ${a ? C`<div class="note warn" role="alert">
            <ha-icon icon="mdi:alert-outline"></ha-icon>
            <span>${e.optional(`week.error.${a}`) ?? e("week.error", { error: a })}</span>
          </div>` : A}
      ${!o && r.room.enabled ? ta(e, this.prefix, {
			label: e("climate.enabled"),
			value: e("climate.device.main_off"),
			to: {
				tab: "devices",
				section: "climate"
			}
		}) : A}
      <details class="ent" data-notip><summary>${e("climate.entity")}</summary><code>${n.entity_id}</code></details>
    </div>`;
	}
	renderNowSection(e, t, n, r) {
		let i = this.nowShown(n, r) && r?.override && r.override.reason !== "off", a = n.cooling && !n.programs.length && !!n.room.week?.enabled && n.sets.length > 0;
		if (i || a) return C`${i ? C`<div class="row" data-tipped>
          <span>${e("week.why.override")}</span>
          <button type="button" class="btn btn-secondary" @click=${() => void this.resume(t)}>${e("week.resume")}</button>
          ${o(e, "week_resume")}
        </div>` : A}
    ${a ? this.renderHold(e, t, n.room, n.sets, r) : A}`;
	}
	renderHold(e, t, n, r, i) {
		let a = t.entity_id, s = i?.mode ?? this.hass?.states[a]?.state ?? t.state, c = n.week?.modes?.[s === "heat" ? "heat" : "cool"] ?? r[0], l = i?.hold ?? null, u = l && l.mode === s ? l : null, d = u ? u.profile : null, f = u ? u.until ? "midnight" : "forever" : this.holdUntil[a] ?? "midnight", p = (t) => wo(e("week.profile", { n: t.profile + 1 }), n.week?.modes?.[t.mode]?.[t.profile]?.name), m = i?.want, h = u && (m === "night" || m === "away") ? m : null;
		return C`<div data-tipped>
      <div class="row">
        <span>${e("week.hold")}</span>
        ${o(e, "week_hold")}
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
          ${c.map((t, n) => C`<option value=${String(n)} ?selected=${d === n}>${wo(e("week.profile", { n: n + 1 }), t.name)}</option>`)}
        </select>
        <span class="seg" role="group" aria-label=${e("week.hold.until")}>
          ${["midnight", "forever"].map((n) => C`<button
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
      ${h && u ? C`<p class="hint">${e(`week.hold.later_${h}`, { profile: p(u) })}</p>` : A}
      ${l && !u ? C`<div class="note" role="status">
            <ha-icon icon="mdi:information-outline"></ha-icon>
            <span class="note-body">
              <span>
                ${e("week.hold.other_mode", {
			profile: p(l),
			mode: e(`week.mode.${l.mode}`),
			until: e(`week.hold.${l.until ? "midnight" : "forever"}`)
		})}
              </span>
              <button type="button" class="mini-btn" @click=${() => void this.hold(t, null, f)}>${e("week.hold.lift")}</button>
            </span>
          </div>` : A}
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
		let { room: a, cooling: s, presets: c, programs: l, sets: u, deviceRuns: d, legacy: f, awayTagged: p, awayWays: m, away: h } = r;
		return C`<div class="row" data-tipped>
        <span>${e("climate.room.steer")}</span>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(a.enabled)}
          aria-label=${e("climate.room.enabled", { name: n.name })}
          @click=${() => this.save(n, { enabled: !a.enabled })}
        ></button>
        ${o(e, "climate_room")}
      </div>
      ${a.enabled ? C`${s && !l.length ? this.renderWeek(e, n, a, u, i) : A}
          ${l.length ? this.renderPrograms(e, n, l, i) : A}
          ${!p || f ? C`<div class="row" data-tipped>
                  <span>${e("climate.away")}</span>
                  <span class="seg" role="group" aria-label=${e("climate.away")}>
                    ${m.map((t) => C`<button type="button" aria-pressed=${String(h === t)} @click=${() => this.save(n, { away: t })}>
                        ${e(d && t === "setback" ? "devprof.away_keep" : `climate.away.${t}`)}
                      </button>`)}
                  </span>
                  ${o(e, f ? "climate_away" : d ? "devprof_away" : "week_away")}
                </div>
                ${f ? A : C`<p class="hint">${e("week.away_fallback")}</p>`}
                ${h === "setback" && !d ? C`<div class="row" data-tipped>
                      <span>${e(s && n.state === "cool" ? "climate.setback.cool" : "climate.setback.heat")}</span>
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
                      ${o(e, f ? "climate_away" : "week_away")}
                    </div>` : A}
                ${f && a.away === "preset" ? C`<div data-tipped>
                      ${this.presetRow(e, n, c, "away_preset", a.away_preset, "climate.away_preset")}
                    </div>` : A}` : A}
          ${f && c.length ? C`<div data-tipped>
                ${this.presetRow(e, n, c, "free_day_preset", a.free_day_preset, "climate.free_day_preset", !0)}
              </div>` : A}
          ${s ? this.renderNight(e, t, n, a) : A}` : A}`;
	}
	daysLink(e) {
		return C`<a class="mini-btn quiet" href=${k(this.prefix, es)} @click=${D(es)}>
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
		let a = !!n.week?.enabled, s = this.weekRoute(t);
		return C`<div class="sub" data-tipped>
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
        ${o(e, "climate_week")}
      </div>
      ${i?.pending ? C`<p class="hint">${e(i.pending === "start" ? "week.pending.start" : "week.pending.end")}</p>` : A}
      ${a ? C`${r.length ? A : C`<p class="hint">${e("week.no_sets")}</p>`}
            <div class="row">
              <a class="btn btn-secondary" href=${k(this.prefix, s)} @click=${D(s, { sheet: !0 })}>
                <ha-icon icon="mdi:calendar-clock"></ha-icon>${e("week.edit")}
              </a>
            </div>` : A}
    </div>`;
	}
	renderPrograms(e, t, n, r) {
		let i = this.profilesOf(t.entity_id), a = n.flatMap((e) => i[e]?.tags ?? []), s = this.state?.climate?.day, c = !s || s.home_office_available, l = s?.home_office_reason ?? "no_calendar", u = this.hass?.states[t.entity_id]?.state ?? t.state;
		return C`<div class="sub" data-tipped>
      <div class="row">
        <span class="sub-title">${e("devprof.title")}</span>
        ${o(e, "climate_device_profiles")}
      </div>
      ${r?.pending ? C`<p class="hint">${e(r.pending === "start" ? "devprof.pending.start" : "devprof.pending.end")}</p>` : A}
      ${n.map((r, a) => {
			let o = i[r] ?? {
				name: "",
				tags: []
			}, s = e("week.profile", { n: Wo(r, a) });
			return C`<div class="preset">
          <div class="preset-name">
            <input
              class="input"
              type="text"
              maxlength="30"
              placeholder=${s}
              aria-label=${e("devprof.name", { preset: s })}
              .value=${o.name}
              @change=${(e) => this.savePrograms(t, n, r, { name: e.target.value.trim().slice(0, 30) })}
            />
            <code>${r}</code>
          </div>
          <div class="tags" role="group" aria-label=${e("devprof.tags", { preset: s })}>
            ${zn.map((i) => {
				let a = o.tags.includes(i), s = i === "home_office" && !c && !a;
				return C`<button
                type="button"
                class="mini-btn tag-btn"
                aria-pressed=${String(a)}
                ?disabled=${s}
                title=${s ? e(`week.ho.${l}`) : ""}
                @click=${() => this.toggleProgramTag(e, t, n, r, i)}
              >
                <ha-icon icon=${To[i]}></ha-icon>${e(`week.tag.${i}`)}
              </button>`;
			})}
          </div>
        </div>`;
		})}
      ${this.moved[t.entity_id] ? C`<div class="note" role="status"><ha-icon icon="mdi:information-outline"></ha-icon><span>${this.moved[t.entity_id]}</span></div>` : A}
      ${a.length && !a.includes("normal") ? C`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("devprof.need_normal")}</span></div>` : A}
      ${r?.why === "manual_mode" ? C`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("devprof.not_auto", { state: this.hvacText(e, u) })}</span>
          </div>` : A}
      ${c ? A : C`<p class="hint">${e(`week.ho.${l}`)}</p>
            <div class="row">${this.daysLink(e)}</div>`}
    </div>`;
	}
	toggleProgramTag(e, t, n, r, i) {
		let a = this.profilesOf(t.entity_id), o = (a[r]?.tags ?? []).includes(i), s = o ? void 0 : n.find((e) => e !== r && a[e]?.tags.includes(i)), c = (t) => a[t]?.name || e("week.profile", { n: Wo(t, n.indexOf(t)) });
		this.moved = {
			...this.moved,
			[t.entity_id]: s ? e("devprof.moved", {
				tag: e(`week.tag.${i}`),
				to: c(r),
				from: c(s)
			}) : ""
		};
		let l = o ? a[r].tags.filter((e) => e !== i) : zn.filter((e) => e === i || a[r]?.tags.includes(e));
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
		Go(o) !== Go(a) && (this.pending = {
			...this.pending,
			[i]: o
		}, I(this, { climate: { rooms: { [i]: { device_profiles: o } } } }).then((e) => {
			if (!e && this.pending[i] === o) {
				let { [i]: e, ...t } = this.pending;
				this.pending = t;
			}
		}));
	}
	presetRow(e, t, n, r, i, a, s = !1) {
		return C`<div class="row">
      <span>${e(a)}</span>
      <select
        class="input"
        aria-label=${e(a)}
        @change=${(e) => this.save(t, { [r]: e.target.value || null })}
      >
        ${s ? C`<option value="" ?selected=${!i}>${e("climate.no_preset")}</option>` : A}
        ${!s && !i ? C`<option value="" selected disabled>${e("climate.pick_preset")}</option>` : A}
        ${n.map((e) => C`<option value=${e} ?selected=${e === i}>${e}</option>`)}
      </select>
      ${o(e, s ? "climate_free_day" : "climate_away")}
    </div>`;
	}
	renderNight(e, t, n, r) {
		let i = (t, r) => C`<input
      class="input short"
      type="time"
      aria-label=${e(`climate.${t}`)}
      .value=${r}
      @change=${(e) => {
			let r = e.target.value;
			/^\d{1,2}:\d{2}$/.test(r) && this.save(n, { [t]: r });
		}}
    />`, a = $o(e, this.hass, t);
		return C`<div class="sub" data-tipped>
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
        ${o(e, "climate_night")}
      </div>
      ${r.night_off ? t.config.climate?.night_by === "entity" ? C`<div class="row">
              <span>${e("climate.night_back")}</span>
              ${i("night_until", r.night_until)}
            </div>` : C`<div class="row">
              <span>${e("climate.night_span")}</span>
              ${i("night_from", r.night_from)} – ${i("night_until", r.night_until)}
            </div>` : A}
      <div class="night-mirror">
        ${ta(e, this.prefix, {
			label: e("climate.mirror.night"),
			value: a.text,
			to: ts,
			action: a.set ? "change" : "set"
		})}
      </div>
    </div>`;
	}
	save(e, t) {
		I(this, { climate: { rooms: { [e.entity_id]: t } } });
	}
	renderPower(e, t, n, r) {
		let i = t.config.climate?.rooms ?? {}, a = (this.found?.devices ?? []).filter((e) => qo(e, i, this.found)), o = a.some((e) => e.entity_id === r.entity_id), s = this.movedNote(e);
		if (o || n.consumer || s) return C`${o ? C`<p class="hint">${e("climate.meters.say")}</p>
          ${(this.found?.meters ?? []).length ? A : C`<p class="hint">${e("climate.meter.no_meters")}</p>`}
          ${this.meterLine(e, r, a, i)}` : A}
    ${n.consumer ? this.consumerRows(e, n.consumer) : A} ${s}`;
	}
	meterLine(e, t, n, r) {
		let i = r[t.entity_id]?.meter ?? null, a = i && i !== "none" ? i : null, o = i == null ? this.found?.suggested?.[t.entity_id] : void 0, s = a ? n.filter((e) => e.entity_id !== t.entity_id && this.sameMeter(r[e.entity_id]?.meter, a)) : [], c = a?.power ? this.hass?.states[a.power] : void 0, l = a ? this.option(a) ?? null : o ?? null;
		return C`<div class="meter">
      <div class="meter-pick">
        ${this.picking ? this.meterSearch(e, t) : C`<span class="picked-row">
              <span class="picked">
                ${l ? C`<b>${ie(l.device_id, `${l.name ?? l.device_id}${l.sensor ? ` · ${l.sensor}` : ""}`, e("climate.open_meter"))}</b>
                      ${l.via ? C`<small class="via">${l.via}</small>` : A}
                      ${l.area ? C`<small>${l.area}</small>` : A}` : a ? C`<b>${ie(a.device_id, a.power ?? a.energy ?? a.device_id, e("climate.open_meter"))}</b>` : C`<small>${e(i === "none" ? "climate.meter.without_long" : "climate.meter.open_long")}</small>`}
              </span>
              ${l ? Rr(e, this.meterTarget(l)) : a ? Rr(e, this.meterTarget(a)) : A}
            </span>`}
      </div>
      ${this.picking ? A : C`<div class="state">
            ${a ? C`<span class="chip ok">${c ? this.reading(e, c) : e("climate.meter.linked")}</span>
                  <button type="button" class="mini-btn" @click=${() => this.startPicking()}>${e("climate.meter.change")}</button>` : o ? C`<button type="button" class="btn btn-secondary" @click=${() => this.save(t, { meter: this.meterOf(o) })}>
                      ${e("climate.meter.confirm")}
                    </button>
                    <button type="button" class="mini-btn" @click=${() => this.startPicking()}>${e("climate.meter.other_short")}</button>` : C`<button type="button" class="mini-btn" @click=${() => this.startPicking()}>${e("climate.meter.search")}</button>`}
          </div>`}
      ${a?.power || a?.energy ? C`<details class="ent">
            <summary>${e("climate.entities")}</summary>
            ${a.power ? C`<code>${a.power}</code>` : A}
            ${a.energy ? C`<code>${a.energy}</code>` : A}
          </details>` : A}
      ${s.length ? C`<p class="hint">${e("climate.meter.shared", { names: s.map((e) => e.name).join(", ") })}</p>` : A}
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
		return C`<input
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
        ${r.map((n) => C`<div class="hit-row">
            <button type="button" role="option" class="hit" @click=${() => this.pickMeter(t, this.key(n))}>
              <b>${n.name ?? n.device_id}${n.sensor ? ` · ${n.sensor}` : ""}</b>
              <small>${[
			n.via,
			n.area,
			n.power ? this.readingOf(e, n.power) : ""
		].filter(Boolean).join(" · ")}</small>
            </button>
            ${Rr(e, this.meterTarget(n))}
          </div>`)}
        ${r.length ? A : C`<small class="none">${e("climate.meter.no_hits")}</small>`}
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
		let r = Number(t.state);
		return `${t.state !== "" && Number.isFinite(r) ? n(e.lang, r, r % 1 ? 1 : 0) : t.state} ${String(t.attributes.unit_of_measurement ?? "")}`.trim();
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
		return C`<div class="consumer">
      <div class="consumer-name">
        <span>${e("climate.consumer")}</span><b>${t.name}</b>${n ? C`<span>${n}</span>` : A}
      </div>
      <div class="row" data-tipped>
        <span>${e("consumers.kind")}</span>
        <select
          class="input"
          aria-label=${e("consumers.kind_of", { name: t.name })}
          .value=${t.kind}
          @change=${(e) => this.setKind(t, e.target.value)}
        >
          ${In.map((n) => C`<option value=${n} ?selected=${n === t.kind}>${e(`kind.${n}`)}</option>`)}
        </select>
        ${o(e, "f_consumer_kind")}
      </div>
      ${t.kind === "submeter" ? A : C`<div class="row" data-tipped>
            <span>${e("consumers.runs")}</span>
            <select
              class="input"
              aria-label=${e("consumers.runs_of", { name: t.name })}
              .value=${r}
              @change=${(e) => this.setRuns(t, e.target.value)}
            >
              ${ns.map((t) => C`<option value=${t} ?selected=${t === r}>${e(`runs.${t}`)}</option>`)}
            </select>
            ${o(e, "f_consumer_runs")}
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
		return C`<div class="note" role="status">
      <ha-icon icon="mdi:information-outline"></ha-icon>
      <a class="mini-btn go" href=${k(this.prefix, r)} @click=${D(r)}
        >${e("climate.moved", {
			name: n.name,
			group: e(`nav.devices.${n.group}`)
		})}</a
      >
    </div>`;
	}
	renderUnassigned(e, t, n, r) {
		let i = this.ctx, a = this.found?.devices ?? [], s = t.config.climate?.rooms ?? {}, c = r.power_entity ? this.readingOf(e, r.power_entity) : "", l = n.deviceId && a.length ? C`<div class="row" data-tipped>
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
              ${a.map((t) => C`<option value=${t.entity_id}>
                  ${Jo(s[t.entity_id]) ? e("climate.assign.has_meter", { name: t.name }) : t.name}${t.area ? ` · ${t.area}` : ""}
                </option>`)}
            </select>
            ${o(e, "climate_assign")}
          </div>` : C`<p class="hint">${e(n.deviceId ? "climate.assign.no_climate" : "climate.assign.no_device")}</p>`;
		return ci(i, {
			...ri(i, n),
			live: c || void 0,
			why: e("climate.unassigned.lead"),
			power: C`${l} ${this.consumerRows(e, r)} ${this.movedNote(e) ?? A}`
		});
	}
	async assign(e, t, n) {
		if (!e.deviceId) return;
		let r = {
			device_id: e.deviceId,
			power: t.power_entity,
			energy: t.energy_entity
		};
		await I(this, { climate: { rooms: { [n]: { meter: r } } } }) && w(this, {
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
		}, i = this.route?.rest?.[0], a = Bn.find((e) => e === i);
		return C`<joe-sheet label=${e("week.label")} closeLabel=${e("common.close")} wide @joe-close=${() => be(this, r)}>
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
		w(this, this.weekRoute(e, t), {
			replace: !0,
			sheet: n
		});
	}
};
s([O({ attribute: !1 })], Y.prototype, "hass", void 0), s([O({ attribute: !1 })], Y.prototype, "t", void 0), s([O({ attribute: !1 })], Y.prototype, "state", void 0), s([O({ attribute: !1 })], Y.prototype, "route", void 0), s([O({ attribute: !1 })], Y.prototype, "prefix", void 0), s([O({ attribute: !1 })], Y.prototype, "found", void 0), s([O({ attribute: !1 })], Y.prototype, "devices", void 0), s([O({ attribute: !1 })], Y.prototype, "entry", void 0), s([O({ attribute: !1 })], Y.prototype, "sub", void 0), s([N()], Y.prototype, "picking", void 0), s([N()], Y.prototype, "query", void 0), s([N()], Y.prototype, "holdUntil", void 0), s([N()], Y.prototype, "pending", void 0), s([N()], Y.prototype, "moved", void 0), s([N()], Y.prototype, "weekError", void 0), s([N()], Y.prototype, "kindChanged", void 0), j("joe-climate-device", Y);
//#endregion
//#region src/pages/devices/climate.ts
var rs = {
	tab: "household",
	section: "days"
}, is = class extends K {
	constructor(...e) {
		super(...e), this.failed = !1, this.list = [];
	}
	static {
		this.styles = [
			d,
			G,
			T`
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
		].some((t) => e.has(t)) && (this.list = !this.climateFound && this.own && this.t && this.state ? ut(this.t, this.state, this.hass, {
			climateFound: this.own,
			discovery: this.discovery,
			checks: this.checks
		}) : this.devices);
	}
	render() {
		let { t: e, state: t } = this;
		if (!e || !t) return A;
		let n = this.entity ? ft(this.list, "climate", this.entity) : void 0;
		if (n) return C`<joe-climate-device
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
		}, i = this.found, a = this.list.filter((e) => e.group === "climate" && !e.unassigned), s = this.list.filter((e) => e.group === "climate" && e.unassigned), c = [...new Set(a.map((t) => t.area ?? e("climate.no_area")))], l = (i?.devices ?? []).filter((e) => qo(e, r.rooms ?? {}, i)), u = l.filter((e) => Jo(r.rooms?.[e.entity_id]) || a.some((t) => t.id === e.entity_id && t.consumer)).length;
		return C`<div class="wrap">
      <div class="intro">
        <div>
          ${b(e("climate.title"))} ${E}
          <p class="lead">${e("climate.lead")}</p>
          ${a.length ? C`<p class="with-tip" data-tipped>${e("climate.ha_open")} ${o(e, "ha_open")}</p>` : A}
        </div>
        <joe-pose name="relax"></joe-pose>
      </div>
      ${this.entity === void 0 ? A : this.renderLost(e)} ${this.renderMain(e, t, r.enabled)}
      ${this.renderHousehold(e, t)}
      ${this.failed && !i ? C`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("climate.failed")}</span></div>` : A}
      ${i && !i.devices.length ? C`<p class="hint">${e("climate.none")}</p>` : A}
      ${a.length ? C`<div class="list-head">
            <h3 class="group-label">${e("climate.list")}</h3>
            ${l.length ? C`<span class="chip">${e("climate.meters.count", {
			linked: u,
			all: l.length
		})}</span>` : A}
          </div>` : A}
      ${c.map((n) => C`<div class="group-label area">${n}</div>
          <div class="dcards">
            ${a.filter((t) => (t.area ?? e("climate.no_area")) === n).map((n) => this.renderCard(e, t, n))}
          </div>`)}
      ${s.length ? C`<div class="group-head list-head">
              <span class="group-label">${e("devices.unassigned")}</span><i class="dcard-dot" aria-hidden="true"></i>
            </div>
            <p class="unassigned-text">${e("devices.unassigned.text")}</p>
            <div class="dcards">
              ${s.map((n) => zr(e, this.prefix, Ur(e, this.hass, t, n)))}
            </div>` : A}
    </div>`;
	}
	renderLost(e) {
		let t = this.entity, n = this.list.find((e) => e.group !== "climate" && (e.id === t || e.consumer?.id === t));
		if (!n) return ti(e);
		let r = R(n);
		return C`<div class="note" role="status">
      <ha-icon icon="mdi:information-outline"></ha-icon>
      <a class="mini-btn go" href=${k(this.prefix, r)} @click=${D(r, { replace: !0 })}
        >${e("climate.moved", {
			name: n.name,
			group: e(`nav.devices.${n.group}`)
		})}</a
      >
    </div>`;
	}
	renderCard(e, t, n) {
		let r = n.climate, i = t.climate?.rooms?.[n.id], a = t.config.climate?.rooms?.[n.id], o = Xo(e, Yo(this.hass, r, n.id)), s = r && a?.enabled ? Zo(e, r, i, a.device_profiles ?? {}) : void 0, c = a?.enabled ? Qo(e, i, t.config.climate?.away_after_min ?? 15) : void 0, l = Jo(a) || n.consumer, u = C`${o ? C`<span class="cl">${o}</span>` : A}
      ${s ? C`<span class="cl">${s}</span>` : A}
      ${c || l ? C`<span class="cl chips">
            ${c ? C`<span class="chip">${c}</span>` : A}
            ${l ? C`<span class="chip ok">${e("climate.card.measured")}</span>` : A}
          </span>` : A}`;
		return zr(e, this.prefix, Ur(e, this.hass, t, n, {
			state: u,
			area: void 0
		}));
	}
	renderHousehold(e, t) {
		let n = t.config.context.presence_entity ?? null, r = n ? this.hass?.states[n]?.attributes.friendly_name ?? n : null, i = t.climate?.day, a = i ? i.holiday ? "holiday" : i.weekend && i.free ? "weekend" : "workday" : null, o = a ? [e(`climate.mirror.today.${a}`), i?.home_office_available && i.home_office.length ? e("climate.mirror.today.ho", { names: i.home_office.join(", ") }) : ""].filter(Boolean).join(", ") : e("climate.mirror.unknown"), s = $o(e, this.hass, t);
		return C`<section class="card household">
      ${ta(e, this.prefix, {
			label: e("climate.mirror.presence"),
			value: r ? C`<span title=${n ?? ""}>${r}</span>` : e("climate.mirror.presence.none"),
			to: {
				tab: "household",
				section: "presence"
			},
			action: r ? "change" : "set"
		})}
      ${ta(e, this.prefix, {
			label: e("climate.mirror.today"),
			value: o,
			to: rs
		})}
      ${ta(e, this.prefix, {
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
		return C`<section class="card" data-tipped>
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
        ${o(e, "climate_enabled")}
      </div>
      <p class="hint">${e(t.mode === "live" ? "climate.live" : "climate.not_live")}</p>
    </section>`;
	}
};
s([O({ attribute: !1 })], is.prototype, "entity", void 0), s([O({ attribute: !1 })], is.prototype, "sub", void 0), s([N()], is.prototype, "own", void 0), s([N()], is.prototype, "failed", void 0), j("joe-climate-group", is);
//#endregion
//#region src/components/finding-rows.ts
var as = T`
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
	return C`<button type="button" class="mini-btn ${r ? "quiet" : ""}" @click=${n}>
    ${t ? C`<ha-icon icon=${t}></ha-icon>` : A}${e}
  </button>`;
}
function os(e) {
	return C`<div class="note"><ha-icon icon="mdi:information-outline"></ha-icon><span>${e}</span></div>`;
}
function ss(e, t) {
	let n = t.aside && t.aside !== A;
	return C`<li class="item ${t.state ?? ""} ${n ? "has-aside" : ""}" ?data-tipped=${!!(t.actions?.length && t.tip)}>
    <span class="ico-box"><ha-icon icon=${t.icon}></ha-icon></span>
    <div class="text">
      <div class="head">
        <span class="t">${t.title}</span>
        ${t.chips?.length ? C`<span class="chips">${t.chips}</span>` : A}
      </div>
      <div class="d">${t.detail}</div>
      ${t.reasons?.length ? C`<details data-notip>
            <summary>${e("scan.why")}</summary>
            <ul>
              ${t.reasons.map((t) => C`<li>${_(e, t)}</li>`)}
            </ul>
          </details>` : A}
      ${t.notes ?? A}
      ${t.actions?.length ? C`<div class="row-actions">${t.actions}${t.tip ? o(e, t.tip) : A}</div>` : A}
    </div>
    ${n ? C`<span class="row-aside">${t.aside}</span>` : A}
  </li>`;
}
function cs(e, t) {
	return C`<ul class="found">
    ${t.map((t) => ss(e, t))}
  </ul>`;
}
var ls = {
	weather: "weather_entity",
	holiday: "holiday_entity"
};
function us(t, n, r, i, a, o, s) {
	let c = ls[o], l = i.context[c], d = a?.[o] ?? null, p = {
		key: o,
		icon: o === "weather" ? "mdi:weather-partly-cloudy" : "mdi:calendar-star",
		title: r(o === "weather" ? "find.weather" : "find.holiday"),
		tip: o === "weather" ? "review_weather" : "review_holiday"
	}, m = () => void ds(t, r, i, a, o);
	if (l) {
		let a = d?.entity.entity_id === l;
		return {
			...p,
			detail: f(n, l),
			chips: [e(r, P(i, `context.${c}`)), ...d && a ? [u(r, d.confidence)] : []],
			reasons: a ? d?.reasons : void 0,
			aside: s?.(l),
			actions: [X(r("review.change"), "mdi:magnify", m), X(r("review.ignore"), "", () => I(t, {
				context: { [c]: null },
				answers: { ignored: Je(i, o, !0) }
			}), !0)]
		};
	}
	return F(i, o) ? {
		...p,
		detail: r("review.ignored"),
		state: "ignored",
		actions: [X(r("review.use"), "mdi:undo-variant", m)]
	} : {
		...p,
		detail: r("find.none"),
		state: "missing",
		notes: [os(r(o === "weather" ? "review.weather.none" : "review.holiday.none"))],
		actions: [X(r("review.choose"), "mdi:magnify", m)]
	};
}
async function ds(e, t, n, r, i) {
	let a = ls[i], o = r?.[i], s = n.context[a], c = (await L(e, {
		heading: t(i === "weather" ? "pick.weather.title" : "pick.holiday.title"),
		tip: i === "weather" ? "pick_weather" : "pick_holiday",
		filter: i === "weather" ? "weather" : "workday",
		selected: s ? [s] : o ? [o.entity.entity_id] : [],
		suggestions: Ye(o ? [Xe(o)] : [], o?.alternatives)
	}))?.selected[0];
	c && I(e, {
		context: { [a]: c },
		answers: { ignored: Je(n, i, !1) }
	});
}
function Z(e, t, r) {
	let [i, a] = e(r).split("|");
	return `${n(e.lang, t, 0)} ${t === 1 ? i : a}`;
}
function fs(e, t, n = []) {
	return C`<div class="note ${t.level}">
    <ha-icon icon=${t.level === "warn" ? "mdi:alert-outline" : "mdi:information-outline"}></ha-icon>
    <div>
      <span>${Ge(e, t)}</span>
      ${n.length ? C`<div class="note-actions">${n}</div>` : A}
    </div>
  </div>`;
}
function ps(e, t, n, r) {
	I(e, {
		...r,
		answers: { ignored: Je(t, n, !0) }
	});
}
function ms(e, t, n) {
	I(e, { answers: { confirmed: [...t.answers.confirmed.filter((e) => e !== n), n] } });
}
function hs(t) {
	let { t: n } = t, r = t.discovery?.energy_dashboard;
	return r?.configured ? {
		key: "energy",
		icon: "mdi:lightning-bolt",
		title: n("find.energy"),
		detail: n("find.energy.detail", {
			grid: Z(n, r.grid ?? 0, "word.grid"),
			solar: Z(n, r.solar ?? 0, "word.solar"),
			battery: Z(n, r.battery ?? 0, "word.battery"),
			devices: Z(n, r.devices ?? 0, "word.device")
		}),
		chips: [e(n, { source: "read" })]
	} : null;
}
function gs(t, n = {}) {
	let { t: r, config: i, discovery: a } = t, o = i.tariff, s = o.kind === "unknown";
	return {
		key: "tariff",
		icon: "mdi:cash-clock",
		title: a?.tariff.provider ?? r("find.tariff"),
		detail: We(r, o),
		chips: s ? [] : [e(r, P(i, "tariff.kind")), ...a && a.tariff.kind !== "unknown" ? [u(r, a.tariff.confidence)] : []],
		reasons: a?.tariff.reasons,
		notes: s ? [os(n.missing ?? r("review.tariff.ask"))] : [],
		state: s ? "missing" : void 0,
		tip: "review_tariff",
		actions: n.actions
	};
}
function _s(t) {
	let { t: r, config: i, from: a } = t, o = t.discovery?.forecast, s = {
		key: "forecast",
		icon: "mdi:weather-sunny",
		title: r("find.forecast"),
		tip: "review_forecast"
	};
	return i.forecast.provider ? {
		...s,
		detail: o ? r("find.forecast.detail", {
			provider: o.provider_name,
			planes: Z(r, o.planes, "word.plane"),
			today: o.today_kwh == null ? "–" : n(r.lang, o.today_kwh, 1),
			tomorrow: o.tomorrow_kwh == null ? "–" : n(r.lang, o.tomorrow_kwh, 1)
		}) : i.forecast.provider,
		chips: [e(r, P(i, "forecast.provider")), ...o ? [u(r, o.confidence)] : []],
		reasons: o?.reasons,
		actions: [X(r("review.ignore"), "", () => ps(a, i, "forecast", { forecast: {
			provider: null,
			config_entries: [],
			today: [],
			tomorrow: [],
			remaining_today: [],
			alternatives: []
		} }), !0)]
	} : F(i, "forecast") && o ? {
		...s,
		detail: r("review.ignored"),
		state: "ignored",
		actions: [X(r("review.use"), "mdi:undo-variant", () => vs(t))]
	} : {
		...s,
		detail: r("find.none"),
		state: "missing",
		notes: [os(r("review.forecast.none"))],
		tip: void 0
	};
}
function vs(e) {
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
		answers: { ignored: Je(e.config, "forecast", !1) }
	}, "read");
}
function ys(t, r, i = {}) {
	let { from: a, hass: o, t: s, config: l } = t, d = l.measurements[r], p = t.discovery?.measurements[r] ?? null, m = r === "grid_power", h = {
		key: r,
		icon: m ? "mdi:transmission-tower" : "mdi:home-lightning-bolt-outline",
		title: s(m ? "find.grid" : "find.home"),
		tip: m ? "review_grid" : "review_home"
	}, g = X(s(d ? "review.change" : "review.choose"), "mdi:magnify", () => void xs(t, r)), _ = i.devices ? [i.devices] : [];
	if (!d && !m && l.measurements.grid_power) return {
		...h,
		detail: s("review.home.balance"),
		notes: bs(s, l),
		actions: [g, ..._]
	};
	if (!d) return F(l, r) ? {
		...h,
		detail: s("review.home.computed"),
		state: "ignored",
		actions: [g]
	} : {
		...h,
		detail: s("find.none"),
		state: "missing",
		notes: [os(s(m ? "review.grid.none" : "review.home.none"))],
		actions: m ? [g] : [g, X(s("review.home.without"), "", () => ps(a, l, "home_power", { measurements: { home_power: null } }), !0)]
	};
	let v = c(o, d), ee = ne(o, d.entity_id, s.lang);
	if (v !== null) {
		let e = n(s.lang, Math.abs(v), 2);
		ee = m ? s(v >= 0 ? "live.import" : "live.export", { value: e }) : s("live.kw", { value: n(s.lang, v, 2) });
	}
	let te = t.checks.filter((e) => e.code !== "missing" && (e.role === r || m && e.code === "grid_sign" || !m && e.code === "home_negative")), y = () => Ss(a, r, {
		...d,
		invert: !d.invert
	}), re = te.map((e) => e.code === "grid_sign" ? fs(s, e, [X(s("review.invert"), "mdi:swap-vertical", y), X(s("review.keep"), "mdi:check", () => ms(a, l, `grid_sign:${d.entity_id}`), !0)]) : e.code === "home_negative" ? fs(s, e, [X(s("review.invert"), "mdi:swap-vertical", y)]) : fs(s, e)), b = te.some((e) => e.level === "warn") ? "flag" : void 0, ie = f(o, d.entity_id), ae = p?.entity.entity_id === d.entity_id;
	return !m && l.measurements.grid_power ? {
		...h,
		detail: `${s("review.home.balance")} · ${s("review.home.compare", {
			name: ie,
			live: ee
		})}`,
		chips: [e(s, P(l, `measurements.${r}`))],
		notes: [...bs(s, l), ...re],
		state: b,
		aside: t.aside?.(d.entity_id, ie),
		actions: [
			g,
			..._,
			X(s("review.ignore"), "", () => ps(a, l, "home_power", { measurements: { home_power: null } }), !0)
		]
	} : {
		...h,
		detail: `${ie} · ${ee}`,
		chips: [e(s, P(l, `measurements.${r}`)), ...p && ae ? [u(s, p.confidence)] : []],
		reasons: ae ? p?.reasons : void 0,
		notes: re,
		state: b,
		aside: t.aside?.(d.entity_id, ie),
		actions: [g, ..._]
	};
}
function bs(e, t) {
	let r = [], i = Ln(t.consumers);
	if (i.length) {
		let t = i.map((t) => t.kind === "ev" || t.runs === "always" || !t.runs ? t.name : `${t.name} (${e(`runs.${t.runs}`)})`).join(", ");
		r.push(os(e(i.some((e) => e.kind === "ev") ? "review.home.flexible" : "review.home.flexible_some", { names: t })));
	} else t.consumers.some((e) => e.kind !== "submeter") && r.push(os(e("review.home.flexible_none")));
	let a = t.learned.home_check;
	if (a && a.calc_kwh > 0) {
		let t = (a.sensor_kwh - a.calc_kwh) / a.calc_kwh;
		Math.abs(t) >= .1 && r.push(os(e("review.home.off", {
			days: a.days,
			pct: n(e.lang, Math.abs(t) * 100, 0),
			direction: e(t < 0 ? "review.home.less" : "review.home.more")
		})));
	}
	return r;
}
async function xs(e, t) {
	let { t: n, config: r } = e, i = r.measurements[t], a = e.discovery?.measurements[t], o = t === "grid_power", s = await L(e.from, {
		heading: n(o ? "pick.grid.title" : "pick.home.title"),
		tip: o ? "pick_grid" : "pick_home",
		filter: "power",
		selected: i ? [i.entity_id] : [],
		suggestions: Ye(a ? [Xe(a)] : [], a?.alternatives),
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
	F(r, t) && (l.answers = { ignored: Je(r, t, !1) }), I(e.from, l);
}
function Ss(e, t, n) {
	I(e, { measurements: { [t]: n } });
}
function Cs(t) {
	let { from: r, hass: i, t: a, config: o } = t, s = o.measurements.solar_power, c = t.discovery?.measurements.solar_power ?? null, l = {
		key: "solar_power",
		icon: "mdi:solar-panel",
		title: a("find.solar"),
		tip: "review_solar"
	}, d = (e) => X(e, "mdi:magnify", () => void ws(t));
	if (!s.length) return F(o, "solar_power") ? {
		...l,
		detail: a("review.solar.without"),
		state: "ignored",
		actions: [d(a("review.choose"))]
	} : {
		...l,
		detail: a("find.none"),
		state: "missing",
		actions: [d(a("review.choose")), X(a("review.solar.none"), "", () => ps(r, o, "solar_power", { measurements: { solar_power: [] } }), !0)]
	};
	let p = re(i, s), m = t.checks.filter((e) => e.role === "solar_power" && e.code !== "missing"), h = s.length === 1 ? s[0].entity_id : void 0;
	return {
		...l,
		detail: a("find.solar.detail", {
			count: Z(a, s.length, "word.sensor"),
			total: p === null ? "–" : n(a.lang, p, 2)
		}),
		chips: [e(a, P(o, "measurements.solar_power")), ...c ? [u(a, c.confidence)] : []],
		reasons: c?.reasons,
		notes: m.map((e) => fs(a, e)),
		state: m.some((e) => e.level === "warn") ? "flag" : void 0,
		aside: h ? t.aside?.(h, f(i, h)) : void 0,
		actions: [d(a("review.change")), ...m.filter((e) => e.can_sleep && s.some((t) => t.entity_id === e.entity_id && !t.sleeps)).map((e) => X(s.length > 1 ? a("solar.sleeps.quick_named", { name: f(i, String(e.entity_id)) }) : a("solar.sleeps.quick"), "mdi:weather-night", () => void I(r, { measurements: { solar_power: s.map((t) => t.entity_id === e.entity_id ? {
			...t,
			sleeps: !0
		} : t) } })))]
	};
}
async function ws(e) {
	let { t, config: n } = e, r = n.measurements.solar_power, i = e.discovery?.measurements.solar_power, a = await L(e.from, {
		heading: t("pick.solar.title"),
		tip: "pick_solar",
		filter: "power",
		multiple: !0,
		selected: r.map((e) => e.entity_id),
		suggestions: Ye((i?.entities ?? []).map((e) => ({
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
	F(n, "solar_power") && (o.answers = { ignored: Je(n, "solar_power", !1) }), I(e.from, o);
}
//#endregion
//#region src/editors/tariff-form.ts
var Ts = [
	"kind",
	"price_entity",
	"window",
	"night_price",
	"day_price",
	"feed_in_price",
	"feed_in_entity",
	"surcharge"
];
function Es(e, t) {
	let n = {};
	for (let r of Ts) JSON.stringify(e[r] ?? null) !== JSON.stringify(t[r] ?? null) && (n[r] = t[r] ?? null);
	return n;
}
function Ds(e, t) {
	let n = Es(e, t);
	if (!Object.keys(n).length) return null;
	let r = { tariff: n };
	return "kind" in n && (r.answers = { tariff: t.kind }), r;
}
var Os = class extends x {
	constructor(...e) {
		super(...e), this.feedIn = !1, this.asQuestion = !1;
	}
	static {
		this.styles = [d, T`
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
		if (!e || !t) return A;
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
		], r = C`<joe-choice
      .options=${n}
      .value=${t.kind === "unknown" ? [] : [t.kind]}
      idk=${e("ask.idk")}
      label=${e("f.tariff.kind")}
      @joe-choice=${(e) => this.emit({ kind: e.detail.value[0] ?? "unknown" })}
    ></joe-choice>`;
		return C`${this.asQuestion ? r : C`<div class="field" data-tipped>
            <div class="field-label">${e("f.tariff.kind")} ${o(e, "q_tariff")}</div>
            ${r}
          </div>`}
      ${t.kind === "fixed_window" ? this.renderWindow(e, t) : A}
      ${t.kind === "flat" ? this.renderFlat(e, t) : A}
      ${t.kind === "dynamic" ? this.renderDynamic(e, t) : A}
      ${this.feedIn ? this.renderFeedIn(e, t) : A}`;
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
		return C`<div class="field" data-tipped>
        <div class="field-label">${e("f.window")} ${o(e, "f_window")}</div>
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
        <div class="field-label">${e("f.prices")} ${o(e, "f_prices")}</div>
        <div class="field-row">
          <label class="price">${e("f.price.night")} ${this.centInput(e, t.night_price, "night_price")}</label>
          <label class="price">${e("f.price.day")} ${this.centInput(e, t.day_price, "day_price")}</label>
        </div>
      </div>`;
	}
	renderFlat(e, t) {
		return C`<div class="field" data-tipped>
      <div class="field-label">${e("f.price")} ${o(e, "f_prices")}</div>
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
		return C`<div class="field" data-tipped>
        <div class="field-label">${e("f.price_entity")} ${o(e, "f_price_entity")}</div>
        <div class="entity">
          ${r && n ? C`<span><b>${f(n, r)}</b> <small>${ne(n, r, e.lang)}</small></span>` : C`<small>${e("f.price_entity.none")}</small>`}
          <button type="button" class="mini-btn" @click=${this.pickPrice}>
            <ha-icon icon="mdi:magnify"></ha-icon>${e(r ? "review.change" : "review.choose")}
          </button>
        </div>
      </div>
      <div class="field" data-tipped>
        <div class="field-label">${e("f.search")} ${o(e, "f_search")}</div>
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
        <div class="field-label">${e("f.surcharge")} ${o(e, "f_surcharge")}</div>
        ${this.centInput(e, t.surcharge, "surcharge")}
      </div>`;
	}
	renderFeedIn(e, t) {
		let n = this.hass;
		return C`<div class="field" data-tipped>
      <div class="field-label">${e("f.feed_in")} ${o(e, "q_feed_in")}</div>
      ${t.feed_in_entity && n ? C`<p class="field-hint">
            ${e("f.feed_in.entity", { name: f(n, t.feed_in_entity) })}
          </p>` : this.centInput(e, t.feed_in_price, "feed_in_price")}
    </div>`;
	}
	centInput(e, t, n) {
		return C`<span class="unit-input">
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
			suggestions: Ye(n?.price_entity ? [{
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
s([O({ attribute: !1 })], Os.prototype, "hass", void 0), s([O({ attribute: !1 })], Os.prototype, "t", void 0), s([O({ attribute: !1 })], Os.prototype, "tariff", void 0), s([O({ attribute: !1 })], Os.prototype, "discovery", void 0), s([O({ type: Boolean })], Os.prototype, "feedIn", void 0), s([O({ type: Boolean })], Os.prototype, "asQuestion", void 0), j("joe-tariff-form", Os);
var ks, As = class extends x {
	constructor(...e) {
		super(...e), this.closable = !1, this.keep = !1, this.saving = !1, this.base = "";
	}
	static {
		this.styles = [d, T`
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
		!this.draft && this.keep && ks && (this.base = ks.base, this.draft = ks.draft), this.draft ? n !== this.base && (this.draft = {
			...structuredClone(t),
			...this.changes
		}, this.base = n, this.keep && (ks = this.dirty ? {
			base: this.base,
			draft: this.draft
		} : void 0)) : (this.base = n, this.draft = structuredClone(t));
	}
	get changes() {
		return this.draft && this.base ? Es(JSON.parse(this.base), this.draft) : {};
	}
	get dirty() {
		return Object.keys(this.changes).length > 0;
	}
	render() {
		let { t: e, draft: t } = this;
		if (!e || !t) return A;
		let n = this.dirty;
		return C`<joe-tariff-form
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
      ${n && !this.closable ? C`<p class="unsaved" role="status">${e("grid.tariff.unsaved")}</p>` : A}
      ${n || this.closable ? C`<div class="actions" data-notip>
            <button type="button" class="btn btn-primary" ?disabled=${this.saving || !n && !this.closable} @click=${this.save}>
              ${e("common.save")}
            </button>
            <button type="button" class="btn btn-ghost" @click=${this.discard}>
              ${e(this.closable ? "common.cancel" : "grid.tariff.discard")}
            </button>
          </div>` : A}`;
	}
	change(e) {
		this.draft = e, this.keep && (ks = this.dirty ? {
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
		}, r = Ds(e.tariff, n);
		if (r) {
			this.saving = !0;
			let e = await I(this, r);
			if (this.saving = !1, !e) return;
			this.base = JSON.stringify(n), this.draft = n;
		}
		this.keep && (ks = void 0), this.finish();
	}
	discard() {
		this.config && (this.base = JSON.stringify(this.config.tariff), this.draft = structuredClone(this.config.tariff)), this.keep && (ks = void 0), this.finish();
	}
	finish() {
		this.closable && this.dispatchEvent(new CustomEvent("joe-close", {
			bubbles: !0,
			composed: !0
		}));
	}
};
s([O({ attribute: !1 })], As.prototype, "hass", void 0), s([O({ attribute: !1 })], As.prototype, "t", void 0), s([O({ attribute: !1 })], As.prototype, "config", void 0), s([O({ attribute: !1 })], As.prototype, "discovery", void 0), s([O({ type: Boolean })], As.prototype, "closable", void 0), s([O({ type: Boolean })], As.prototype, "keep", void 0), s([N()], As.prototype, "draft", void 0), s([N()], As.prototype, "saving", void 0), j("joe-tariff-draft", As);
//#endregion
//#region src/pages/devices/grid.ts
var js = [
	"connection",
	"tariff",
	"solar",
	"home"
], Ms = {
	connection: "mdi:transmission-tower",
	tariff: "mdi:cash-clock",
	solar: "mdi:solar-power-variant",
	home: "mdi:home-lightning-bolt-outline"
}, Ns = "/config/energy";
function Ps(e, t) {
	return t < .95 ? e("learn.solar.less", {
		value: n(e.lang, (1 - t) * 100, 0),
		share: n(e.lang, t * 100, 0)
	}) : t > 1.05 ? e("learn.solar.more", {
		value: n(e.lang, (t - 1) * 100, 0),
		share: n(e.lang, t * 100, 0)
	}) : e("learn.solar.fits");
}
var Fs = class extends K {
	static {
		this.styles = [
			d,
			G,
			as,
			T`
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
		this.anchor && this.revealed !== this.anchor && he(this.renderRoot, this.anchor) && (this.revealed = this.anchor);
	}
	render() {
		let { t: e, hass: t, state: n } = this;
		if (!e || !t || !n) return A;
		let r = n.config, i = {
			from: this,
			hass: t,
			t: e,
			config: r,
			discovery: this.discovery,
			checks: this.checks,
			aside: (n, r) => Rr(e, Lr(t, n, r))
		}, a = this.anchor !== void 0 && !js.includes(this.anchor);
		return C`<div class="wrap">
      ${a ? ti(e) : A}
      ${ui(e, e("nav.devices.grid"), e("grid.lead"))}
      ${this.renderEnergy(e, i)} ${this.renderConnection(e, i)} ${this.renderTariff(e, i)}
      ${this.renderSolar(e, i)} ${this.renderHome(e, i)}
    </div>`;
	}
	renderEnergy(e, t) {
		let n = hs(t);
		return n ? C`<div class="energy">${cs(e, [n])}</div>` : C`<div class="note energy-none">
      <ha-icon icon="mdi:information-outline"></ha-icon>
      <span
        >${e("grid.energy.none")}
        <a
          href=${Ns}
          @click=${(e) => {
			e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0 || (e.preventDefault(), ae(Ns));
		}}
          >${e("grid.energy.open")}</a
        ></span
      >
    </div>`;
	}
	block(e, t, n, r, i) {
		return C`<section class="card gsec" data-anchor=${t}>
      <h3 class="gsec-head" ?data-tipped=${!!i}>
        <ha-icon icon=${Ms[t]}></ha-icon>${n}${i ? o(e, i) : A}
      </h3>
      <p class="say">${e(`grid.${t}.say`)}</p>
      ${r}
    </section>`;
	}
	rule(e, t, n) {
		return ta(e, this.prefix, {
			label: e(`rule.${n}`),
			value: da(e, t, n),
			source: P(t, `rules.${n}`),
			to: {
				tab: "settings",
				section: "rules",
				id: n
			}
		});
	}
	renderConnection(e, t) {
		return this.block(e, "connection", e("grid.connection"), C`${cs(e, [ys(t, "grid_power")])}
        <div class="mirrors">${this.rule(e, t.config, "grid_limit_w")} ${this.rule(e, t.config, "guard_grid")}</div>`);
	}
	renderTariff(e, t) {
		return this.block(e, "tariff", e("find.tariff"), C`${cs(e, [gs(t, { missing: e("grid.tariff.unknown") })])}
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
	renderSolar(t, r) {
		let i = r.config, a = i.forecast, s = i.learned.solar_factor, c = {
			tab: "review",
			section: "learned",
			id: "sun"
		};
		return this.block(t, "solar", t("devices.grid.solar"), C`${cs(t, [Cs(r), _s(r)])} ${this.renderSleeps(t, r)}
        ${a.provider && a.alternatives.length ? C`<div class="toggle-row" data-tipped>
              <span class="with-tip"><span id="combine-label">${t("learn.sources.combine")}</span>${o(t, "learn_combine")}</span>
              <button
                type="button"
                class="switch"
                role="switch"
                aria-checked=${String(a.combine)}
                aria-labelledby="combine-label"
                @click=${() => I(this, { forecast: { combine: !a.combine } })}
              ></button>
            </div>` : A}
        ${a.provider ? C`<div class="mirrors">
              <div class="mirror">
                <div class="mirror-text">
                  <span class="mirror-label">${t("grid.solar.factor")}</span>
                  <span class="mirror-sep" aria-hidden="true">·</span>
                  <span class="mirror-value">${s == null ? t("learn.still") : `× ${n(t.lang, s, 2)}`}</span>
                  ${s == null ? A : e(t, { source: "learned" })}
                  ${s == null ? A : C`<small class="mirror-hint">${Ps(t, s)}</small>`}
                </div>
                <a class="mini-btn quiet mirror-go" href=${k(this.prefix, c)} @click=${D(c)}
                  >${t("devices.page.more_learned")}</a
                >
              </div>
            </div>` : A}`);
	}
	renderSleeps(e, t) {
		let n = t.config.measurements.solar_power;
		if (!n.length) return A;
		let r = (e) => I(this, { measurements: { solar_power: n.map((t) => t.entity_id === e ? {
			...t,
			sleeps: !t.sleeps
		} : t) } });
		return C`${n.map((t, i) => C`<div class="toggle-row" data-tipped>
          <span class="with-tip"
            ><span id="sleeps-label-${i}"
              >${n.length > 1 ? e("solar.sleeps.named", { name: f(this.hass, t.entity_id) }) : e("solar.sleeps")}</span
            >${o(e, "solar_sleeps")}</span
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
		}, r = C`<a class="mini-btn go" href=${k(this.prefix, n)} @click=${D(n)}
      >${e("grid.home.devices")}</a
    >`;
		return this.block(e, "home", e("devices.grid.home"), cs(e, [ys(t, "home_power", { devices: r })]));
	}
};
s([O({ attribute: !1 })], Fs.prototype, "anchor", void 0), j("joe-grid-page", Fs);
//#endregion
//#region src/pages/devices/hot-water-device.ts
var Is = class extends K {
	static {
		this.styles = [
			d,
			G,
			Ca,
			ho,
			Za
		];
	}
	render() {
		let { t: e, hass: t, state: n, entry: r } = this;
		if (!e || !t || !n || !r) return A;
		let i = ri(this.ctx, r), a = r.consumer, o = a ? mo(this, e, t, n.config, a) : void 0, s = r.action;
		return s ? ci(this.ctx, {
			...i,
			why: Tn(e, n, s),
			now: C`<joe-action-tonight .hass=${t} .t=${e} .state=${n} .action=${s}></joe-action-tonight>`,
			steer: C`<joe-action-steer
        .hass=${t}
        .t=${e}
        .state=${n}
        .discovery=${this.discovery}
        .prefix=${this.prefix}
        .action=${s}
        .section=${"hot_water"}
      ></joe-action-steer>`,
			power: o,
			learned: s.kind === "target" ? Sa([Ea(e, n.config.learned, s)]) : void 0,
			learnedArea: "hot_water",
			tips: { steer: "device_steer" },
			removeTitle: e("devices.page.delete"),
			remove: C`<joe-action-delete
        .t=${e}
        .config=${n.config}
        .action=${s}
        .leave=${{
				tab: "devices",
				section: "hot_water"
			}}
      ></joe-action-delete>`
		}) : ci(this.ctx, {
			...i,
			now: a ? qa(e, this.prefix, "hot_water", a.id, e("devices.hot_water.lonely"), e("devices.hot_water.set_up"), "devices_lonely_hot_water") : void 0,
			power: o
		});
	}
};
s([O({ attribute: !1 })], Is.prototype, "entry", void 0), j("joe-hot-water-device", Is);
//#endregion
//#region src/pages/devices/hot-water.ts
var Ls = class extends K {
	static {
		this.styles = [
			d,
			G,
			Za
		];
	}
	render() {
		let { t: e, hass: t, state: n } = this;
		if (!e || !n) return A;
		let r = ft(this.devices, "hot_water", this.device);
		if (r) return C`<joe-hot-water-device
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
		let i = this.device ? Ja(this.devices, this.device, "hot_water") : void 0;
		return C`<div class="wrap">
      ${ui(e, e("nav.devices.hot_water"), e("devices.hot_water.lead"), this.devices.some((e) => e.group === "hot_water"))}
      ${this.device === void 0 ? A : i ? Ya(e, this.prefix, i.name, i) : ti(e)}
      ${li(this.ctx, this.devices, "hot_water", (r) => r.action ? { quick: C`<joe-action-tonight .hass=${t} .t=${e} .state=${n} .action=${r.action}></joe-action-tonight>` } : {})}
      <div class="group-actions">${di(e, this.prefix, "hot_water", e("devices.group_add.hot_water"))}</div>
    </div>`;
	}
};
s([O({ attribute: !1 })], Ls.prototype, "device", void 0), s([O({ attribute: !1 })], Ls.prototype, "sub", void 0), j("joe-hot-water-group", Ls);
//#endregion
//#region src/pages/devices/other-device.ts
var Rs = class extends K {
	static {
		this.styles = [
			d,
			G,
			Ca,
			ho,
			Za
		];
	}
	render() {
		let { t: e, hass: t, state: n, entry: r } = this;
		if (!e || !t || !n || !r) return A;
		let i = ri(this.ctx, r), a = r.consumer, o = r.action, s = a && a.energy_entity && a.kind !== "submeter" ? Sa([Ta(e, n.config.learned, a)]) : void 0, c = !!(o && a && r.id === a.id), l = rt("night", a?.id);
		return ci(this.ctx, {
			...i,
			why: o ? Tn(e, n, o) : i.why,
			now: o ? C`<joe-action-tonight .hass=${t} .t=${e} .state=${n} .action=${o}></joe-action-tonight>` : void 0,
			steer: o ? C`<joe-action-steer
              .hass=${t}
              .t=${e}
              .state=${n}
              .discovery=${this.discovery}
              .prefix=${this.prefix}
              .action=${o}
              .section=${"night"}
            ></joe-action-steer>` : a && a.kind !== "submeter" ? C`<p class="muted">${e("devices.other.night_offer")}</p>
              <a class="btn btn-secondary add-link" href=${k(this.prefix, l)} @click=${D(l, { sheet: !0 })}
                >${e("devices.other.night_add")}</a
              >` : void 0,
			power: a ? mo(this, e, t, n.config, a) : r.noMeter ? C`<p class="muted">${e("devices.other.no_meter")}</p>` : void 0,
			learned: s,
			learnedArea: "devices",
			tips: { steer: "device_steer" },
			removeTitle: e("devices.page.delete"),
			remove: o ? C`<joe-action-delete
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
s([O({ attribute: !1 })], Rs.prototype, "entry", void 0), j("joe-other-device", Rs);
//#endregion
//#region src/pages/devices/other.ts
var zs = class extends K {
	constructor(...e) {
		super(...e), this.moved = /* @__PURE__ */ new Map();
	}
	static {
		this.styles = [
			d,
			G,
			ho,
			Za
		];
	}
	render() {
		let { t: e, state: t } = this;
		if (!e || !t) return A;
		let n = ft(this.devices, "other", this.device);
		if (n) return C`<joe-other-device
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
		let r = this.device ? Ja(this.devices, this.device, "other") : void 0;
		return C`<div class="wrap">
      ${ui(e, e("nav.devices.other"), e("devices.other.lead"), this.devices.some((e) => e.group === "other"))}
      ${this.device === void 0 ? A : r ? Ya(e, this.prefix, r.name, r) : ti(e)}
      ${this.renderList(e, t)}
      <div class="group-actions">${di(e, this.prefix, "night", e("devices.group_add.night"))}</div>
    </div>`;
	}
	renderList(e, t) {
		let n = this.devices.filter((e) => e.group === "other"), r = new Map(t.config.consumers.map((e, t) => [e.id, t])), i = n.filter((e) => r.has(e.id)), a = n.filter((e) => !r.has(e.id) && !e.noMeter), s = n.filter((e) => e.noMeter), c = i.map((n) => ({
			at: r.get(n.id),
			html: this.card(e, t, n)
		}));
		for (let [t, i] of this.moved) {
			let a = n.some((e) => e.id === t) ? void 0 : Ja(this.devices, t, "other");
			a && c.push({
				at: r.get(t) ?? Infinity,
				html: Ya(e, this.prefix, i, a)
			});
		}
		return c.sort((e, t) => e.at - t.at), !c.length && !a.length && !s.length ? C`<p class="muted">${e("devices.other.empty")}</p>` : C`${c.length || a.length ? C`<section data-tipped>
            <div class="list-head">
              <span>${e("consumers.kind")} ${o(e, "f_consumer_kind")}</span>
              <span>${e("consumers.runs")} ${o(e, "f_consumer_runs")}</span>
            </div>
            <div class="dcards">${c.map((e) => e.html)} ${a.map((n) => this.card(e, t, n))}</div>
          </section>` : A}
      ${s.length ? C`<h3 class="sub-group">${e("devices.no_meter_group")}</h3>
            <div class="dcards">${s.map((n) => this.card(e, t, n))}</div>` : A}`;
	}
	card(e, t, n) {
		let r = n.id === n.consumer?.id ? n.consumer : void 0, i = n.action ? C`<joe-action-tonight .hass=${this.hass} .t=${e} .state=${t} .action=${n.action}></joe-action-tonight>` : A, a = r ? C`${fo(e, r, (e) => this.setKind(r, e))}
        ${po(e, r, (e) => void uo(this, r, e))} ${i}` : n.action ? i : void 0;
		return zr(e, this.prefix, Ur(e, this.hass, t, n, { quick: a }));
	}
	async setKind(e, t) {
		if (!await lo(this, e, t)) return;
		let n = new Map(this.moved);
		co.includes(t) ? n.set(e.id, e.name) : n.delete(e.id), this.moved = n;
	}
};
s([O({ attribute: !1 })], zs.prototype, "device", void 0), s([O({ attribute: !1 })], zs.prototype, "sub", void 0), s([N()], zs.prototype, "moved", void 0), j("joe-other-group", zs);
//#endregion
//#region src/pages/devices/index.ts
var Bs = {
	all: "joe-devices-all",
	battery: "joe-battery-group",
	climate: "joe-climate-group",
	car: "joe-car-group",
	hot_water: "joe-hot-water-group",
	other: "joe-other-group",
	grid: "joe-grid-page"
}, Vs = class extends x {
	constructor(...e) {
		super(...e), this.prefix = M, this.checks = [], this.devices = [], this.behind = {
			tab: "devices",
			section: "all"
		};
	}
	static {
		this.styles = [d, T`
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
		].some((t) => e.has(t)) && (this.devices = ut(this.t, this.state, this.hass, {
			climateFound: this.climateFound,
			discovery: this.discovery,
			checks: this.checks
		})), e.has("route") && this.route && this.route.section !== "add" && (this.behind = this.route);
	}
	chips(e, t) {
		let r = new Set(dt(this.devices));
		this.state?.config.climate?.enabled && r.add("climate"), t !== "all" && t !== "add" && r.add(t);
		let i = [{
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
		].filter((e) => r.has(e))) {
			let r = t === "grid" ? 0 : this.devices.filter((e) => e.group === t).length;
			i.push({
				id: t,
				label: e(`nav.devices.${t}`),
				icon: Qe[t],
				count: r ? n(e.lang, r, 0) : void 0,
				problem: pt(this.devices, t)
			});
		}
		return i;
	}
	render() {
		let e = this.t;
		if (!e || !this.state) return A;
		let t = (this.route?.section ?? ge.devices) === "add", n = t ? this.behind : this.route, r = n?.section ?? ge.devices;
		return C`${Cr(e, this.prefix, "devices", this.chips(e, r), r)}${this.renderSection(r, n)}${t ? this.renderAdd() : A}`;
	}
	renderSection(e, t) {
		if (!customElements.get(Bs[e])) return C``;
		let { t: n, hass: r, state: i, prefix: a, discovery: o, info: s, checks: c, climateFound: l, devices: u } = this;
		switch (e) {
			case "all": return C`<joe-devices-all
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
			case "climate": return C`<joe-climate-group
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
			case "battery": return C`<joe-battery-group
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
			case "car": return C`<joe-car-group
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
			case "hot_water": return C`<joe-hot-water-group
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
			case "other": return C`<joe-other-group
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
			case "grid": return C`<joe-grid-page
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
		return C`<joe-device-add
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
s([O({ attribute: !1 })], Vs.prototype, "hass", void 0), s([O({ attribute: !1 })], Vs.prototype, "t", void 0), s([O({ attribute: !1 })], Vs.prototype, "state", void 0), s([O({ attribute: !1 })], Vs.prototype, "route", void 0), s([O({ attribute: !1 })], Vs.prototype, "prefix", void 0), s([O({ attribute: !1 })], Vs.prototype, "discovery", void 0), s([O({ attribute: !1 })], Vs.prototype, "info", void 0), s([O({ attribute: !1 })], Vs.prototype, "checks", void 0), s([O({ attribute: !1 })], Vs.prototype, "climateFound", void 0), j("joe-devices-page", Vs);
//#endregion
//#region src/uses.ts
function Hs(e, t) {
	let n = e.climate;
	if (!n?.enabled) return [];
	let r = t ? new Set(t.devices.map((e) => e.entity_id)) : null;
	return Object.entries(n.rooms ?? {}).filter(([e, t]) => t.enabled && (!r || r.has(e))).map(([e]) => e);
}
function Us(e, t) {
	return (e.cars ?? []).filter((e) => e.need.enabled).filter((e) => {
		let n = e.need.persons;
		return t === void 0 ? n === null || n.length > 0 : n === null || n.includes(t);
	}).map((e) => ({
		label: e.name,
		to: `/devices/car/${encodeURIComponent(e.id)}`
	}));
}
function Ws(e, t) {
	return t.length ? [{
		label: e("usedby.climate"),
		to: "/devices/climate",
		count: t.length
	}] : [];
}
function Gs(e, t, n) {
	let r = Ws(e, Hs(t, n));
	return t.persons.some((e) => e.person_entity) && r.push({
		label: e("usedby.learn"),
		to: "/review/learned/presence"
	}), r;
}
function Ks(e, t, n) {
	let r = t.persons.some((e) => e.calendars.length), i = [];
	return (t.context.holiday_entity || r) && (i.push({
		label: e("usedby.plan"),
		to: "/plan"
	}), i.push({
		label: e("usedby.consumption"),
		to: "/review/learned/consumption"
	})), r && i.push(...Us(t).map((t) => ({
		...t,
		label: e("usedby.car", { name: t.label })
	}))), (t.context.holiday_entity || r || t.context.free_day_entities?.length) && i.push(...Ws(e, Hs(t, n))), i;
}
function qs(e, t, n) {
	return Ws(e, Hs(t, n).filter((e) => t.climate?.rooms[e]?.night_off));
}
function Js(e, t, n, r) {
	let i = [];
	return n !== "routing" && t.context.weather_entity && (i.push({
		label: e("usedby.plan"),
		to: "/plan"
	}), i.push({
		label: e("usedby.consumption"),
		to: "/review/learned/consumption"
	}), i.push(...Ws(e, Hs(t, r)))), n !== "weather" && t.routing.service && (i.push(...Us(t).map((t) => ({
		...t,
		label: e("usedby.car", { name: t.label })
	}))), (t.climate?.route_eta ?? !0) && Hs(t, r).length && i.push({
		label: e("usedby.way"),
		to: "/household/presence/way"
	})), i.filter((e, t) => i.findIndex((t) => t.label === e.label) === t);
}
function Ys(e, t, n) {
	return t.persons.find((e) => e.id === n)?.calendars.length ? Us(t, n) : [];
}
//#endregion
//#region src/components/used-by.ts
function Xs(e, t) {
	if (typeof t == "string") return t;
	let [r, i] = e("word.device").split("|");
	return `${n(e.lang, t, 0)} ${t === 1 ? r : i}`;
}
function Zs(e, t, n) {
	return n.length ? C`<p class="used-by">
    <ha-icon icon="mdi:link-variant"></ha-icon>
    <span class="used-by-label">${e("usedby.label")}</span>
    ${n.map((n) => {
		let r = n.count === void 0 ? n.label : `${n.label} (${Xs(e, n.count)})`;
		return n.to ? C`<a class="used-by-item" href=${k(t, n.to)} @click=${D(n.to)}>${r}</a>` : C`<span class="used-by-item">${r}</span>`;
	})}
  </p>` : C`<p class="used-by none"><ha-icon icon="mdi:link-variant-off"></ha-icon>${e("usedby.none")}</p>`;
}
//#endregion
//#region src/pages/household/head.ts
function Qs(e, t, n, r, i) {
	return C`<div class="page-head">
    ${b(n)} ${E}
    <p class="lead">${r}</p>
    ${i ? Zs(e, t, i) : ""}
  </div>`;
}
function $s(e, t, n) {
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
function ec(e) {
	return `${String(Math.floor(e / 60)).padStart(2, "0")}:${String(e % 60).padStart(2, "0")}`;
}
function tc(e) {
	try {
		return new Intl.DateTimeFormat("en-CA", { timeZone: e }).format(/* @__PURE__ */ new Date());
	} catch {
		return new Intl.DateTimeFormat("en-CA").format(/* @__PURE__ */ new Date());
	}
}
//#endregion
//#region src/pages/household/styles.ts
var nc = T`
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
`, rc = [
	"vacation",
	"travel",
	"home_office",
	"office",
	"guests",
	"home"
];
function ic(e) {
	let t = e;
	for (; t;) {
		let e = t.parentNode instanceof ShadowRoot ? t.parentNode.host : t.parentNode;
		if (e instanceof HTMLElement && e.scrollTop > 0) return e;
		t = e;
	}
	return document.scrollingElement;
}
var ac = class extends x {
	constructor(...e) {
		super(...e), this.prefix = M, this.checks = [], this.keyword = {}, this.quiet = !1;
	}
	static {
		this.styles = [
			d,
			nc,
			as,
			T`
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
		return !e || !t || !n ? A : C`<div class="wrap">
      ${Qs(e, this.prefix, e("household.days.title"), e("household.days.lead"), Ks(e, t.config, this.climateFound))}
      ${this.renderPreview(e, t)} ${this.renderFree(e, n, t)} ${this.renderCalendar(e, t)}
    </div>`;
	}
	renderPreview(e, t) {
		let n = t.climate?.day, r = t.config.persons, i = this.hass?.config?.time_zone, a = tc(i), s = t.plan?.meta?.tomorrow, c = s && s.date > a ? s : void 0, l = n ? n.holiday ? "holiday" : n.weekend && n.free ? "weekend" : "workday" : null, u = n?.labels_state ?? (n?.labels_at ? "ok" : "unread"), d = u === "ok" && n?.labels_at ? $s(e.lang, n.labels_at, i) : null, f = t.climate, p = n ? !f?.home.length && f?.nobody_since ? "away" : n.holiday ? "holiday" : n.home_office.length && !n.free ? "home_office" : "normal" : null, m = null;
		if (c) {
			let e = (/* @__PURE__ */ new Date(`${c.date}T12:00:00Z`)).getUTCDay(), t = e === 0 || e === 6;
			m = c.workday ? Object.values(c.labels).includes("home_office") ? "home_office" : "normal" : t ? "normal" : "holiday";
		}
		let h = (t) => t ? C`<span class="chip ${t === "normal" ? "" : "soon"}"><ha-icon icon=${To[t]}></ha-icon>${e(`week.tag.${t}`)}</span>` : A;
		return C`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:calendar-today"></ha-icon>${e("household.days.preview")}</div>
        ${o(e, "household_days_preview")}
      </div>
      <div class="preview">
        <div class="day">
          <div class="day-head">
            <b>${e("household.days.preview.today")} · ${U(e.lang, a, "weekday")}</b>${h(p)}
          </div>
          ${l ? C`<p class="now">${e(`climate.today.${l}`)}</p>` : C`<p class="hint">${e("household.days.preview.unknown")}</p>`}
          ${n ? C`<p class="hint">
                ${n.home_office_available ? u === "ok" ? n.home_office.length ? e("climate.today.ho", { names: n.home_office.join(", ") }) : e("climate.today.ho_none") : e(`climate.today.labels_${u}`) : e(`week.ho.${n.home_office_reason ?? "no_calendar"}`)}
                ${d ? e("climate.today.read_at", { time: d }) : A}
              </p>` : A}
        </div>
        <div class="day">
          <div class="day-head">
            <b>${e("household.days.preview.tomorrow")}${c ? C` · ${U(e.lang, c.date, "weekday")}` : A}</b>${h(m)}
          </div>
          ${c ? C`<p class="now">${e(c.workday ? "household.days.preview.workday" : "household.days.preview.day_off")}</p>
                ${Object.keys(c.labels).length ? C`<ul>
                      ${Object.entries(c.labels).map(([t, n]) => C`<li>
                            ${e("household.days.preview.person", {
			name: r.find((e) => e.id === t)?.name ?? t,
			label: e(`label.${n}`)
		})}
                          </li>`)}
                    </ul>` : A}` : C`<p class="hint">${e("household.days.preview.no_plan")}</p>`}
        </div>
      </div>
    </section>`;
	}
	renderFree(e, t, n) {
		let r = n.config, i = r.context.free_day_entities ?? [];
		return C`<section class="card">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:calendar-star"></ha-icon>${e("household.days.free")}</div>
      </div>
      ${cs(e, [us(this, t, e, r, this.discovery, "holiday", (n) => Rr(e, Lr(t, n, f(t, n))))])}
      <div class="sub" data-tipped>
        <div class="row">
          <span>${e("climate.today.free_by")}</span>
          ${o(e, "climate_free_entities")}
        </div>
        <div class="row tight">
          <span class="chips-line">
            ${i.length ? i.map((e) => {
			let n = [
				"on",
				"true",
				"home"
			].includes(t.states[e]?.state ?? "");
			return C`<span class="chip ${n ? "ok" : ""}" title=${e}>${f(t, e)}</span>`;
		}) : C`<small class="hint">${e("climate.today.free_none")}</small>`}
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
		let n = t.config, r = this.chosen(), i = !!r && !r.calendar, a = r?.calendar ?? n.calendar, s = (e) => a.rules.filter((t) => t.label === e), c = n.persons.some((e) => e.calendars.length), l = {
			tab: "household",
			section: "days"
		}, u = {
			tab: "household",
			section: "people"
		};
		return C`<section class="card" data-anchor="calendar" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:calendar-text-outline"></ha-icon>${e("learn.calendar")}</div>
        ${o(e, "learn_calendar")}
      </div>
      <p class="say">${e("learn.calendar.say")}</p>
      ${c ? A : C`<div class="note">
            <ha-icon icon="mdi:information-outline"></ha-icon>
            <span
              >${e("household.days.no_calendars")}
              <a href=${k(this.prefix, u)} @click=${D(u)}>${e("household.days.to_people")}</a></span
            >
          </div>`}
      ${n.persons.length ? C`<div data-tipped>
            <div class="sub-head"><b>${e("learn.calendar.for")}</b>${o(e, "cal_person")}</div>
            <nav class="scopes" aria-label=${e("learn.calendar.for")}>
              <a href=${k(this.prefix, l)} aria-current=${String(!r)} @click=${(e) => this.choose(e, l)}
                >${e("learn.calendar.everyone")}</a
              >
              ${n.persons.map((t) => {
			let n = {
				tab: "household",
				section: "days",
				id: t.id
			};
			return C`<a href=${k(this.prefix, n)} aria-current=${String(t.id === r?.id)} @click=${(e) => this.choose(e, n)}
                  >${t.name}${t.calendar ? C`<ha-icon class="own-rules" icon="mdi:account-cog-outline" title=${e("household.days.own_rules")}></ha-icon>` : A}</a
                >`;
		})}
            </nav>
          </div>` : A}
      ${this.person && !r ? C`<div class="note warn" role="status">
            <ha-icon icon="mdi:help-circle-outline"></ha-icon><span>${e("household.days.not_found")}</span>
          </div>` : A}
      ${r ? C`<div class="toggle-row" data-tipped>
            <span class="with-tip"><span id="cal-shared-label">${e("learn.calendar.shared")}</span>${o(e, "cal_shared")}</span>
            <button
              type="button"
              class="switch"
              role="switch"
              aria-checked=${String(i)}
              aria-labelledby="cal-shared-label"
              @click=${() => this.saveCalendar(r, i ? structuredClone(n.calendar) : null)}
            ></button>
          </div>` : A}
      ${i ? C`<p class="say">${e("learn.calendar.shared.say", { name: r.name })}</p>` : C`<div class="rules">
              ${rc.map((t) => C`<div class="rule">
                  <b>${e(`label.${t}`)}</b>
                  <div class="keywords">
                    ${s(t).map((t) => C`<span class="keyword"
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
              <div class="sub-head"><b>${e("learn.calendar.defaults")}</b>${o(e, "cal_defaults")}</div>
              <div class="defaults">
                ${["default_workday", "default_day_off"].map((t) => C`<label class="field">
                    <span class="field-label">${e(`learn.calendar.${t}`)}</span>
                    <select
                      class="input"
                      @change=${(e) => this.saveCalendarPart({ [t]: e.target.value })}
                    >
                      ${Fn.map((n) => C`<option value=${n} ?selected=${a[t] === n}>${e(`label.${n}`)}</option>`)}
                    </select>
                  </label>`)}
              </div>
            </div>`}
    </section>`;
	}
	choose(e, t) {
		if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
		e.preventDefault(), this.quiet = !0;
		let n = ic(this), r = n?.scrollTop ?? 0;
		w(this, t, { replace: !0 }), n && (n.scrollTop = r);
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
		let t = rc.flatMap((t) => e.filter((e) => e.label === t));
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
		this.person && this.revealed !== this.person && he(this.renderRoot, "calendar") && (this.revealed = this.person);
	}
};
s([O({ attribute: !1 })], ac.prototype, "hass", void 0), s([O({ attribute: !1 })], ac.prototype, "t", void 0), s([O({ attribute: !1 })], ac.prototype, "state", void 0), s([O({ attribute: !1 })], ac.prototype, "route", void 0), s([O({ attribute: !1 })], ac.prototype, "prefix", void 0), s([O({ attribute: !1 })], ac.prototype, "discovery", void 0), s([O({ attribute: !1 })], ac.prototype, "checks", void 0), s([O({ attribute: !1 })], ac.prototype, "climateFound", void 0), s([O({ attribute: !1 })], ac.prototype, "person", void 0), s([N()], ac.prototype, "keyword", void 0), j("joe-hh-days", ac);
//#endregion
//#region src/pages/household/night.ts
var oc = "23:00", sc = "06:30", cc = class extends x {
	constructor(...e) {
		super(...e), this.prefix = M, this.checks = [];
	}
	static {
		this.styles = [
			d,
			nc,
			T`
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
		return !e || !t || !this.hass ? A : C`<div class="wrap">
      ${Qs(e, this.prefix, e("household.night.title"), e("household.night.lead"), qs(e, t.config, this.climateFound))}
      ${this.renderSource(e, t)} ${this.renderDevices(e, t)}
    </div>`;
	}
	renderSource(e, t) {
		let n = this.hass, r = t.config.climate, i = r?.night_by ?? "time", a = r?.night_entity ?? null, s = a ? n.states[a] : void 0;
		return C`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:weather-night"></ha-icon>${e("household.night.source")}</div>
        ${o(e, "climate_night_source")}
      </div>
      <div class="row">
        <span>${e("climate.night.by")}</span>
        <span class="seg" role="group" aria-label=${e("climate.night.by")}>
          ${["time", "entity"].map((t) => C`<button type="button" aria-pressed=${String(i === t)} @click=${() => this.setNightBy(t)}>
              ${e(`climate.night.by.${t}`)}
            </button>`)}
        </span>
      </div>
      ${i === "entity" ? C`<div class="row entity-row">
              <span>${a ? C`<b title=${a}>${f(n, a)}</b>` : e("climate.night.no_entity")}</span>
              ${s ? C`<span class="chip ${s.state === "on" ? "ok" : ""}"
                    >${e(s.state === "on" ? "climate.night.now_on" : "climate.night.now_off")}</span
                  >` : A}
              ${a ? Rr(e, Lr(n, a, f(n, a))) : A}
              <button type="button" class="btn btn-secondary" @click=${() => void this.pickNight()}>
                ${e(a ? "climate.night.change" : "climate.night.pick")}
              </button>
            </div>
            <p class="hint">${e("climate.night.entity_say")}</p>` : C`<p class="hint">${e("climate.night.time_say")}</p>`}
    </section>`;
	}
	renderDevices(e, t) {
		let n = t.config.climate, r = n?.night_by === "entity", i = Object.fromEntries((this.climateFound?.devices ?? []).map((e) => [e.entity_id, e.name])), a = Object.entries(n?.rooms ?? {}).filter(([, e]) => e.night_off), o = {
			tab: "devices",
			section: "climate"
		};
		return C`<section class="card">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:power-sleep"></ha-icon>${e("household.night.devices")}</div>
      </div>
      ${a.length ? C`<ul class="devices">
            ${a.map(([t, a]) => {
			let o = {
				tab: "devices",
				section: "climate",
				id: t
			}, s = a.night_from || oc, c = a.night_until || sc;
			return C`<li>
                <a href=${k(this.prefix, o)} @click=${D(o)}>
                  <b>${i[t] ?? f(this.hass, t)}</b>
                  <span>${r ? e("household.night.until", { until: c }) : e("household.night.span", {
				from: s,
				until: c
			})}</span>
                  ${a.enabled && n?.enabled ? A : C`<small class="hint">${e("household.night.not_steered")}</small>`}
                  <ha-icon icon="mdi:chevron-right"></ha-icon>
                </a>
              </li>`;
		})}
          </ul>` : C`<p class="hint">${e("household.night.devices.none")}</p>`}
      <a class="go-link" href=${k(this.prefix, o)} @click=${D(o)}>${e("household.night.to_climate")}</a>
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
s([O({ attribute: !1 })], cc.prototype, "hass", void 0), s([O({ attribute: !1 })], cc.prototype, "t", void 0), s([O({ attribute: !1 })], cc.prototype, "state", void 0), s([O({ attribute: !1 })], cc.prototype, "route", void 0), s([O({ attribute: !1 })], cc.prototype, "prefix", void 0), s([O({ attribute: !1 })], cc.prototype, "discovery", void 0), s([O({ attribute: !1 })], cc.prototype, "checks", void 0), s([O({ attribute: !1 })], cc.prototype, "climateFound", void 0), j("joe-hh-night", cc);
//#endregion
//#region src/household-helpers.ts
var lc = "gast";
function uc(e) {
	return Object.values(e.states).filter((e) => e.entity_id.startsWith("group.")).map((e) => ({
		state: e,
		members: e.attributes.entity_id ?? []
	})).filter(({ members: e }) => e.length && e.every((e) => /^(person|device_tracker)\./.test(e))).map(({ state: t, members: n }) => ({
		entity_id: t.entity_id,
		name: f(e, t.entity_id),
		members: n.map((t) => f(e, t))
	}));
}
async function dc(e, t, n) {
	if (!t.callApi || !t.callService) throw Error("no api");
	let r = `input_boolean.${(await t.callWS({
		type: "input_boolean/create",
		name: n("household.guest.name"),
		icon: "mdi:account-child-outline"
	})).id}`, i = `device_tracker.${lc}`;
	return await t.callApi("POST", `config/automation/config/energy_joe_${lc}`, {
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
				dev_id: lc,
				host_name: n("household.guest.tracker_name"),
				location_name: `{{ 'home' if is_state('${r}', 'on') else 'not_home' }}`
			}
		}],
		mode: "queued"
	}), await t.callService("device_tracker", "see", {
		dev_id: lc,
		host_name: n("household.guest.tracker_name"),
		location_name: "not_home"
	}), I(e, { context: {
		guest_switch: r,
		guest_tracker: i
	} }), i;
}
function fc(e, t) {
	let n = e.states[t]?.state === "on";
	e.callService?.("input_boolean", n ? "turn_off" : "turn_on", { entity_id: t });
}
//#endregion
//#region src/editors/household.ts
var pc = class extends x {
	constructor(...e) {
		super(...e), this.detailed = !1;
	}
	static {
		this.styles = [d, T`
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
		if (!e || !t || !n) return A;
		let r = (this.discovery?.persons ?? []).filter((e) => F(n, `person:${e.entity_id}`) && !n.persons.some((t) => t.id === e.entity_id));
		return C`${n.persons.length ? C`<ul>
            ${n.persons.map((n) => this.renderPerson(e, t, n))}
          </ul>` : C`<p class="empty">${e("household.empty")}</p>`}
      <div class="with-tip add" data-tipped>
        <button type="button" class="mini-btn" @click=${this.addPerson}>
          <ha-icon icon="mdi:account-plus-outline"></ha-icon>${e("household.add")}
        </button>
        ${o(e, "f_person_add")}
      </div>
      ${r.length ? C`<div class="others" data-tipped>
            <span>${e("household.left_out")}</span>
            ${r.map((e) => C`<button type="button" class="mini-btn quiet" @click=${() => this.bringBack(e)}>
                <ha-icon icon="mdi:undo-variant"></ha-icon>${e.name}
              </button>`)}
            ${o(e, "household_left_out")}
          </div>` : A}`;
	}
	renderPerson(e, t, n) {
		let r = n.person_entity ? t.states[n.person_entity]?.state : void 0, i = r === "home" ? C`<small class="home">${e("household.home")}</small>` : r === "not_home" ? C`<small>${e("household.away")}</small>` : r ? C`<small>${e("household.zone", { zone: r })}</small>` : C`<small>${e("household.no_presence")}</small>`;
		return C`<li class="person" data-anchor=${this.detailed ? n.id : A}>
      <div class="top" data-tipped>
        <span class="avatar" aria-hidden="true">${n.name.slice(0, 1).toUpperCase()}</span>
        <div class="who"><b>${n.name}</b>${i}</div>
        <span class="top-actions">
          ${this.detailed ? Rr(e, Lr(t, n.person_entity, n.name)) : A}
          <button type="button" class="mini-btn quiet" @click=${() => this.removePerson(n)}>
            ${e("household.remove")}
          </button>
          ${o(e, "household_remove")}
        </span>
      </div>
      <div class="cals" data-tipped>
        <span class="cals-label">${e("household.calendars")}</span>
        ${n.calendars.map((r) => C`<span class="cal">
            ${f(t, r)}
            <button
              type="button"
              aria-label=${e("household.calendar_remove", { name: f(t, r) })}
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
        ${o(e, "f_calendars")}
      </div>
      ${this.detailed ? C`<slot name=${`p:${n.id}`}></slot>` : A}
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
				name: f(this.hass, n),
				person_entity: n,
				calendars: r?.calendars ?? []
			} },
			answers: { ignored: Je(t, `person:${n}`, !1) }
		});
	}
	bringBack(e) {
		I(this, {
			persons: { [e.entity_id]: {
				name: e.name,
				person_entity: e.entity_id,
				calendars: e.calendars
			} },
			answers: { ignored: Je(this.config, `person:${e.entity_id}`, !1) }
		});
	}
	removePerson(e) {
		I(this, {
			persons: { [e.id]: null },
			answers: { ignored: Je(this.config, `person:${e.id}`, !0) }
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
s([O({ attribute: !1 })], pc.prototype, "hass", void 0), s([O({ attribute: !1 })], pc.prototype, "t", void 0), s([O({ attribute: !1 })], pc.prototype, "config", void 0), s([O({ attribute: !1 })], pc.prototype, "discovery", void 0), s([O({ type: Boolean })], pc.prototype, "detailed", void 0);
var mc = class extends x {
	constructor(...e) {
		super(...e), this.card = !1, this.leftOut = [], this.guest = !0, this.creating = !1, this.offerNew = !1;
	}
	static {
		this.styles = [d, T`
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
		if (!e || !t || !n) return A;
		let r = n.context.presence_entity, i = this.card ? C`<div class="head">
          <div class="eyebrow"><ha-icon icon="mdi:account-check-outline"></ha-icon>${e("household.presence")}</div>
          ${o(e, "household_presence")}
        </div>` : C`<div class="with-tip"><b>${e("household.presence")}</b>${o(e, "household_presence")}</div>`;
		if (r) {
			let a = ["on", "home"].includes(t.states[r]?.state ?? "");
			return C`<div class="presence" data-tipped>
        ${i}
        <div class="row">
          <span class="chip ${a ? "ok" : ""}" title=${r}>${f(t, r)}</span>
          <small>${e(a ? "household.presence.on" : "household.presence.off")}</small>
          ${Rr(e, Lr(t, r, f(t, r)))}
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
		let a = n.persons.filter((e) => e.person_entity), s = a.filter((e) => !this.leftOut.includes(e.person_entity)), c = uc(t);
		return c.length && !this.offerNew ? C`<div class="presence" data-tipped>
        ${i}
        <p>${e("household.presence.found")}</p>
        ${c.map((t) => C`<div class="row">
            <span class="chip" title=${t.entity_id}>${t.name}</span>
            <small>${t.members.join(", ")}</small>
            <button type="button" class="btn btn-primary" @click=${() => I(this, { context: { presence_entity: t.entity_id } })}>
              ${e("household.presence.use")}
            </button>
          </div>`)}
        <div class="row">
          <button type="button" class="btn btn-ghost" @click=${() => this.offerNew = !0}>${e("household.presence.new_instead")}</button>
        </div>
      </div>` : C`<div class="presence" data-tipped>
      ${i}
      <p>${e("household.presence.propose")}</p>
      <div class="row" role="group" aria-label=${e("household.presence.persons")}>
        ${a.map((e) => {
			let t = !this.leftOut.includes(e.person_entity);
			return C`<button
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
      ${this.failed ? C`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.failed}</span></div>` : A}
      <div class="row">
        <button
          type="button"
          class="btn btn-primary"
          ?disabled=${this.creating || !s.length && !this.guest}
          @click=${() => void this.createPresence(s.map((e) => e.person_entity))}
        >
          ${e(this.creating ? "household.presence.creating" : "household.presence.create")}
        </button>
        <button type="button" class="btn btn-ghost" @click=${() => void this.pickPresence()}>${e("household.presence.own")}</button>
      </div>
    </div>`;
	}
	renderGuest(e, t, n, r) {
		let { guest_switch: i, guest_tracker: a } = n.context;
		if (!i || !a) return C`<div class="guest" data-tipped>
        <div class="with-tip"><b>${e("household.guest")}</b>${o(e, "household_guest")}</div>
        <p>${e("household.guest.offer")}</p>
        ${this.failed ? C`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.failed}</span></div>` : A}
        <div class="row">
          <button type="button" class="btn btn-secondary" ?disabled=${this.creating} @click=${() => void this.addGuest()}>
            ${e(this.creating ? "household.presence.creating" : "household.guest.create")}
          </button>
        </div>
      </div>`;
		let s = t.states[i]?.state === "on", c = t.states[r]?.attributes.entity_id, l = !c || c.includes(a);
		return C`<div class="guest" data-tipped>
      <div class="row">
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(s)}
          aria-labelledby="guest-label"
          @click=${() => void t.callService?.("input_boolean", s ? "turn_off" : "turn_on", { entity_id: i })}
        ></button>
        <b id="guest-label">${e("household.guest")}</b>
        <small>${e(t.states[a]?.state === "home" ? "household.guest.home" : "household.guest.away")}</small>
        ${o(e, "household_guest")}
      </div>
      ${l ? A : C`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon>
            <span>${e("household.guest.add_to_group", { group: f(t, r) })}<code>- ${a}</code></span>
          </div>`}
    </div>`;
	}
	async addGuest() {
		let { t: e, hass: t } = this;
		if (e && t) {
			this.creating = !0, this.failed = void 0;
			try {
				await dc(this, t, e);
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
				let r = this.guest ? this.config?.context.guest_tracker ?? await dc(this, n, t) : null;
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
s([O({ attribute: !1 })], mc.prototype, "hass", void 0), s([O({ attribute: !1 })], mc.prototype, "t", void 0), s([O({ attribute: !1 })], mc.prototype, "config", void 0), s([O({ attribute: !1 })], mc.prototype, "discovery", void 0), s([O({
	type: Boolean,
	reflect: !0
})], mc.prototype, "card", void 0), s([N()], mc.prototype, "leftOut", void 0), s([N()], mc.prototype, "guest", void 0), s([N()], mc.prototype, "creating", void 0), s([N()], mc.prototype, "failed", void 0), s([N()], mc.prototype, "offerNew", void 0);
var hc = class extends x {
	static {
		this.styles = T`
    :host {
      display: block;
    }
  `;
	}
	render() {
		return C`<joe-household-people
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
s([O({ attribute: !1 })], hc.prototype, "hass", void 0), s([O({ attribute: !1 })], hc.prototype, "t", void 0), s([O({ attribute: !1 })], hc.prototype, "config", void 0), s([O({ attribute: !1 })], hc.prototype, "discovery", void 0), j("joe-household-people", pc), j("joe-household-presence", mc), j("joe-household", hc);
//#endregion
//#region src/pages/household/people.ts
var gc = class extends x {
	constructor(...e) {
		super(...e), this.prefix = M, this.checks = [];
	}
	static {
		this.styles = [
			d,
			nc,
			T`
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
		if (!e || !t || !this.hass) return A;
		let n = t.config, r = [...Gs(e, n, this.climateFound), ...Ks(e, n, this.climateFound)], i = !(!this.person || n.persons.some((e) => e.id === this.person));
		return C`<div class="wrap">
      ${Qs(e, this.prefix, e("household.people.title"), e("household.people.lead"), r.filter((e, t) => r.findIndex((t) => t.label === e.label) === t))}
      ${i ? C`<div class="note warn" role="status">
            <ha-icon icon="mdi:help-circle-outline"></ha-icon><span>${e("nav.not_found.person")}</span>
          </div>` : A}
      <div class="list-head">
        <span class="eyebrow"><ha-icon icon="mdi:account-group-outline"></ha-icon>${e("household.people.list")}</span>
        ${o(e, "ha_open")}
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
	renderExtra(e, t, r) {
		let i = t.config, a = t.climate?.day, o = t.plan?.meta?.tomorrow, s = o && o.date > tc(this.hass?.config?.time_zone) ? o : void 0, c = [];
		a?.home_office_available && a.labels_state !== "error" && a.home_office.includes(r.name) && c.push(e("household.people.today", { label: e("label.home_office") }));
		let l = s?.labels[r.id];
		l && c.push(e("household.people.tomorrow", { label: e(`label.${l}`) }));
		let u = r.calendars.length > 0, d = Ys(e, i, r.id), f = i.learned.presence?.[r.id] ?? {}, p = Fn.filter((e) => f[e]).map((t) => e("learn.presence.value", {
			label: e(`label.${t}`),
			hours: n(e.lang, f[t].hours, 0)
		})), m = r.person_entity ? t.climate?.usual?.[r.person_entity] : void 0;
		m != null && p.push(e("household.people.usual", { time: ec(m) }));
		let h = {
			tab: "household",
			section: "days",
			id: r.id
		};
		return C`<div class="extra" slot=${`p:${r.id}`}>
      ${c.length ? C`<p class="days">${c.join(" · ")}</p>` : A}
      ${u ? C`${this.mirror(e("household.people.rules"), e(r.calendar ? "household.people.rules.own" : "household.people.rules.shared"), h, e("mirror.change"))}
            <p class="used-by ${d.length ? "" : "none"}">
              <ha-icon icon=${d.length ? "mdi:car-clock" : "mdi:link-variant-off"}></ha-icon>
              ${d.length ? C`<span class="used-by-label">${e("household.people.counts")}</span>
                    ${d.map((e) => C`<a class="used-by-item" href=${k(this.prefix, e.to)} @click=${D(e.to)}
                          >${e.label}</a
                        >`)}` : e("household.people.counts.none")}
            </p>` : A}
      ${this.mirror(e("household.people.learned"), r.person_entity ? p.length ? p.join(" · ") : e("household.people.learned.none") : e("learn.presence.no_person"), {
			tab: "review",
			section: "learned",
			id: "presence"
		}, e("household.people.more"))}
    </div>`;
	}
	mirror(e, t, n, r) {
		return C`<div class="mirror">
      <div class="mirror-text">
        <span class="mirror-label">${e}</span>
        <span class="mirror-sep" aria-hidden="true">·</span>
        <span class="mirror-value">${t}</span>
      </div>
      <a class="mini-btn go mirror-go" href=${k(this.prefix, n)} @click=${D(n)}>${r}</a>
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
		t && (await t.updateComplete, t.shadowRoot && he(t.shadowRoot, e) && (this.revealed = e));
	}
};
s([O({ attribute: !1 })], gc.prototype, "hass", void 0), s([O({ attribute: !1 })], gc.prototype, "t", void 0), s([O({ attribute: !1 })], gc.prototype, "state", void 0), s([O({ attribute: !1 })], gc.prototype, "route", void 0), s([O({ attribute: !1 })], gc.prototype, "prefix", void 0), s([O({ attribute: !1 })], gc.prototype, "discovery", void 0), s([O({ attribute: !1 })], gc.prototype, "checks", void 0), s([O({ attribute: !1 })], gc.prototype, "climateFound", void 0), s([O({ attribute: !1 })], gc.prototype, "person", void 0), j("joe-hh-people", gc);
//#endregion
//#region src/pages/household/presence.ts
var _c = 15, vc = 240, yc = "https://my.home-assistant.io/redirect/config_flow_start/?domain=proximity";
function bc(e, t, n) {
	let r = t.routing;
	if (r.service === "google") {
		let t = n?.routing?.google.find((e) => e.entry_id === r.google_entry);
		return e("settings.routing.google", { name: t?.title ?? "Google" });
	}
	return e(r.service ? `settings.routing.${r.service}` : "settings.routing.none");
}
var xc = class extends x {
	constructor(...e) {
		super(...e), this.prefix = M, this.checks = [];
	}
	static {
		this.styles = [
			d,
			nc,
			T`
      .way-list {
        margin: 6px 0 0;
      }
    `
		];
	}
	render() {
		let { t: e, state: t } = this;
		if (!e || !t || !this.hass) return A;
		let n = t.config;
		return C`<div class="wrap">
      ${Qs(e, this.prefix, e("household.presence.title"), e("household.presence.lead"), Gs(e, n, this.climateFound))}
      ${this.renderLive(e, t)}
      <joe-household-presence card .hass=${this.hass} .t=${e} .config=${n} .discovery=${this.discovery}></joe-household-presence>
      ${this.renderWay(e, n)}
    </div>`;
	}
	renderLive(e, t) {
		let r = t.climate, i = r?.home ?? [], a = Object.entries(r?.arrivals ?? this.climateFound?.arrivals ?? {}), s = Object.fromEntries(t.config.persons.map((e) => [e.person_entity, e.name])), c = t.config.climate?.away_after_min ?? _c;
		return C`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:home-account"></ha-icon>${e("household.presence.now")}</div>
        ${o(e, "climate_presence")}
      </div>
      <p class="now">${i.length ? e("climate.home", { names: i.join(", ") }) : e("climate.nobody")}</p>
      ${a.map(([t, r]) => C`<p class="hint">
          ${e(`climate.way.${r.direction === "towards" ? "towards" : r.direction === "away_from" ? "away" : "other"}`, {
			name: s[t] ?? this.hass?.states[t]?.attributes.friendly_name ?? t,
			km: r.km == null ? "–" : n(e.lang, r.km, 1)
		})}
          ${r.direction === "towards" && r.minutes != null ? e(r.source ? "climate.way.minutes_route" : "climate.way.minutes_guess", { minutes: r.minutes }) : A}
        </p>`)}
      <div class="row" data-tipped>
        <span>${e("climate.away_after")}</span>
        <input
          class="input short"
          type="number"
          inputmode="numeric"
          min="0"
          max=${vc}
          step="1"
          aria-label=${e("climate.away_after")}
          .value=${String(c)}
          @change=${(e) => {
			let t = e.target, n = Math.round(Number.parseFloat(t.value.replace(",", ".")));
			if (!Number.isFinite(n)) {
				t.value = String(c);
				return;
			}
			let r = Math.min(vc, Math.max(0, n));
			t.value = String(r), I(this, { climate: { away_after_min: r } });
		}}
        />
        <span>${e("climate.away_after.unit")}</span>
        ${o(e, "climate_away_after")}
      </div>
    </section>`;
	}
	renderWay(e, t) {
		let n = t.climate?.route_eta ?? !0;
		return C`<section class="card" data-anchor="way" data-tipped>
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
        ${o(e, "climate_route_eta")}
      </div>
      ${ta(e, this.prefix, {
			label: e("household.presence.routing"),
			value: bc(e, t, this.info),
			to: {
				tab: "household",
				section: "travel"
			},
			action: t.routing.service ? "change" : "set"
		})}
      ${this.climateFound && !this.climateFound.proximity ? C`<p class="hint">
            ${e("climate.no_proximity")}
            <a href=${yc} target="_blank" rel="noreferrer noopener">${e("climate.add_proximity")}</a>
          </p>` : A}
    </section>`;
	}
	willUpdate(e) {
		e.has("anchor") && (this.revealed = void 0);
	}
	updated() {
		this.anchor && this.revealed !== this.anchor && he(this.renderRoot, this.anchor) && (this.revealed = this.anchor);
	}
};
s([O({ attribute: !1 })], xc.prototype, "hass", void 0), s([O({ attribute: !1 })], xc.prototype, "t", void 0), s([O({ attribute: !1 })], xc.prototype, "state", void 0), s([O({ attribute: !1 })], xc.prototype, "route", void 0), s([O({ attribute: !1 })], xc.prototype, "prefix", void 0), s([O({ attribute: !1 })], xc.prototype, "discovery", void 0), s([O({ attribute: !1 })], xc.prototype, "checks", void 0), s([O({ attribute: !1 })], xc.prototype, "climateFound", void 0), s([O({ attribute: !1 })], xc.prototype, "info", void 0), s([O({ attribute: !1 })], xc.prototype, "anchor", void 0), j("joe-hh-presence", xc);
//#endregion
//#region src/pages/household/travel.ts
var Sc = class extends x {
	constructor(...e) {
		super(...e), this.prefix = M, this.checks = [];
	}
	static {
		this.styles = [
			d,
			nc,
			as,
			T`
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
		if (!e || !t || !n) return A;
		let r = t.config;
		return C`<div class="wrap">
      ${Qs(e, this.prefix, e("household.travel.title"), e("household.travel.lead"), null)}
      <section class="card">
        ${cs(e, [us(this, n, e, r, this.discovery, "weather", (t) => Rr(e, Lr(n, t, f(n, t))))])}
        ${Zs(e, this.prefix, Js(e, r, "weather", this.climateFound))}
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
		}, s = (t) => C`<div class="field" data-tipped>
      <span class="field-label"><label for="routing-${t}">${e(`settings.routing.${t}`)}</label>${o(e, "routing_osm")}</span>
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
		return C`<section class="card">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:map-marker-distance"></ha-icon>${e("settings.routing")}</div>
      </div>
      <p class="say">${e("settings.routing.intro")}</p>
      <div class="field" data-tipped>
        <span class="field-label"><label for="routing-service">${e("settings.routing.service")}</label>${o(e, "routing_service")}</span>
        <small class="field-hint">${e("settings.routing.service.hint")}</small>
        <select id="routing-service" class="input" @change=${(e) => a(e.target.value)}>
          <option value="" ?selected=${i === ""}>${e("settings.routing.none")}</option>
          ${r?.waze === !1 ? A : C`<option value="waze" ?selected=${i === "waze"}>${e("settings.routing.waze")}</option>`}
          ${(r?.google ?? []).map((t) => C`<option value=${`google:${t.entry_id}`} ?selected=${i === `google:${t.entry_id}`}>
                ${e("settings.routing.google", { name: t.title })}
              </option>`)}
          <option value="osm" ?selected=${i === "osm"}>${e("settings.routing.osm")}</option>
        </select>
      </div>
      ${n.service === "osm" ? C`${s("geocoder_url")} ${s("router_url")}` : A}
      ${Zs(e, this.prefix, Js(e, t.config, "routing", this.climateFound))}
    </section>`;
	}
};
s([O({ attribute: !1 })], Sc.prototype, "hass", void 0), s([O({ attribute: !1 })], Sc.prototype, "t", void 0), s([O({ attribute: !1 })], Sc.prototype, "state", void 0), s([O({ attribute: !1 })], Sc.prototype, "route", void 0), s([O({ attribute: !1 })], Sc.prototype, "prefix", void 0), s([O({ attribute: !1 })], Sc.prototype, "discovery", void 0), s([O({ attribute: !1 })], Sc.prototype, "checks", void 0), s([O({ attribute: !1 })], Sc.prototype, "climateFound", void 0), s([O({ attribute: !1 })], Sc.prototype, "info", void 0), j("joe-hh-travel", Sc);
//#endregion
//#region src/pages/household/index.ts
var Cc = {
	people: "joe-hh-people",
	presence: "joe-hh-presence",
	days: "joe-hh-days",
	night: "joe-hh-night",
	travel: "joe-hh-travel"
}, wc = {
	people: "mdi:account-group-outline",
	presence: "mdi:home-account",
	days: "mdi:calendar-check-outline",
	night: "mdi:sleep",
	travel: "mdi:map-marker-path"
}, Tc = class extends x {
	constructor(...e) {
		super(...e), this.prefix = M, this.checks = [];
	}
	static {
		this.styles = [d, T`
      :host {
        display: block;
      }
    `];
	}
	render() {
		let e = this.t;
		if (!e || !this.state) return A;
		let t = this.route?.section ?? ge.household, n = de.household.map((t) => ({
			id: t,
			label: e(`nav.household.${t}`),
			icon: wc[t]
		}));
		return C`${Cr(e, this.prefix, "household", n, t)}${this.renderSection(t)}`;
	}
	renderSection(e) {
		if (!customElements.get(Cc[e])) return C``;
		let { t, hass: n, state: r, prefix: i, route: a, discovery: o, checks: s, climateFound: c, info: l } = this;
		switch (e) {
			case "people": return C`<joe-hh-people
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
			case "presence": return C`<joe-hh-presence
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
			case "days": return C`<joe-hh-days
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
			case "night": return C`<joe-hh-night
          .t=${t}
          .hass=${n}
          .state=${r}
          .prefix=${i}
          .route=${a}
          .discovery=${o}
          .checks=${s}
          .climateFound=${c}
        ></joe-hh-night>`;
			case "travel": return C`<joe-hh-travel
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
s([O({ attribute: !1 })], Tc.prototype, "hass", void 0), s([O({ attribute: !1 })], Tc.prototype, "t", void 0), s([O({ attribute: !1 })], Tc.prototype, "state", void 0), s([O({ attribute: !1 })], Tc.prototype, "route", void 0), s([O({ attribute: !1 })], Tc.prototype, "prefix", void 0), s([O({ attribute: !1 })], Tc.prototype, "discovery", void 0), s([O({ attribute: !1 })], Tc.prototype, "checks", void 0), s([O({ attribute: !1 })], Tc.prototype, "climateFound", void 0), s([O({ attribute: !1 })], Tc.prototype, "info", void 0), j("joe-household-page", Tc);
//#endregion
//#region src/components/chart.ts
var Ec = 40, Dc = 10, Oc = 16, kc = 24;
function Ac(e) {
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
function jc(e) {
	let t = [], n = [];
	return e.forEach((e, r) => {
		e == null ? (n.length && t.push(n), n = []) : n.push([r, e]);
	}), n.length && t.push(n), t;
}
var Q = class extends x {
	constructor(...e) {
		super(...e), this.labels = [], this.ticks = /* @__PURE__ */ new Map(), this.series = [], this.bands = [], this.markers = [], this.unit = "kWh", this.max = 0, this.height = 220, this.label = "", this.lang = "de", this.centerTicks = !1, this.width = 640, this.hover = null;
	}
	static {
		this.styles = T`
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
		if (!e) return A;
		let t = Math.max(260, this.width), n = this.height, r = t - Ec - Dc, i = n - Oc - kc, a = r / e, o = this.series.flatMap((e) => e.values.filter((e) => e != null)), s = this.max || Ac(Math.max(.1, ...o)), c = Math.min(0, ...o), l = c < 0 ? -Math.max(Ac(-c), s / 4) : 0, u = (e) => Oc + i - (Math.max(l, Math.min(e, s)) - l) / (s - l) * i, d = (e) => Ec + e * a, f = (e) => Ec + (e + .5) * a, p = (e, t = 2) => new Intl.NumberFormat(this.lang, { maximumFractionDigits: t }).format(e), m = [];
		for (let e of this.bands) m.push(Te`<rect class="band" x=${d(e.from)} y=${Oc} width=${Math.max(0, d(e.to) - d(e.from))} height=${i}></rect>
        <text class="note" x=${(d(e.from) + d(e.to)) / 2} y=${28} text-anchor="middle">${e.label}</text>`);
		for (let e of l < 0 ? [
			l,
			0,
			s
		] : [
			0,
			s / 2,
			s
		]) m.push(Te`<line class="grid" x1=${Ec} x2=${t - Dc} y1=${u(e)} y2=${u(e)}></line>
        <text class="tick" x=${34} y=${u(e) + 4} text-anchor="end">${p(e, 2)}</text>`);
		m.push(Te`<text class="tick" x=${34} y=${11} text-anchor="end">${this.unit}</text>`);
		for (let [e, t] of this.ticks) m.push(Te`<text class="tick" x=${this.centerTicks ? f(e) : d(e)} y=${n - 6}
        text-anchor="middle">${t}</text>`);
		let h = this.series.filter((e) => e.kind === "bar"), g = a * .68 / Math.max(1, h.length);
		for (let e of this.series) {
			if (e.kind === "bar") {
				let t = a * .16 + h.indexOf(e) * g;
				e.values.forEach((n, r) => {
					if (n != null && n !== 0) {
						let i = Math.min(u(n), u(0));
						m.push(Te`<rect x=${d(r) + t} y=${i} width=${Math.max(1, g - 1)}
              height=${Math.max(1, Math.abs(u(0) - u(n)))} rx="2"
              fill=${n < 0 ? e.negative ?? e.color : e.color}></rect>`);
					}
				});
				continue;
			}
			for (let t of jc(e.values)) {
				let n = t.map(([e, t]) => `${f(e).toFixed(1)},${u(t).toFixed(1)}`).join(" ");
				if (e.kind === "area" && t.length > 1) {
					let r = u(0).toFixed(1);
					m.push(Te`<polygon points=${`${f(t[0][0]).toFixed(1)},${r} ${n} ${f(t[t.length - 1][0]).toFixed(1)},${r}`}
            fill=${e.fill ?? e.color}></polygon>`);
				}
				t.length > 1 ? m.push(Te`<polyline points=${n} fill="none" stroke=${e.color} stroke-width=${e.kind === "line" ? 2.4 : 2}
            stroke-linejoin="round" stroke-dasharray=${e.dashed ? "5 4" : "none"}></polyline>`) : m.push(Te`<circle cx=${f(t[0][0])} cy=${u(t[0][1])} r="2.5" fill=${e.color}></circle>`);
			}
		}
		for (let e of this.markers) {
			let n = Ec + e.at * a, o = n < Ec + r * .75;
			m.push(Te`<line class="marker" x1=${n} x2=${n} y1=${Oc} y2=${Oc + i}></line>
        <text class="note" x=${o ? n + 4 : n - 4} y=${28} text-anchor=${o ? "start" : "end"}>
          ${t < 520 ? e.short ?? e.label : e.label}
        </text>`);
		}
		this.hover != null && m.push(Te`<line class="guide" x1=${f(this.hover)} x2=${f(this.hover)} y1=${Oc} y2=${Oc + i}></line>`);
		for (let t = 0; t < e; t++) m.push(Te`<rect class="slot" x=${d(t)} y=${Oc} width=${a} height=${i}
        @pointerenter=${() => this.hover = t} @click=${() => this.hover = t}></rect>`);
		return C`<svg
        viewBox="0 0 ${t} ${n}"
        height=${n}
        role="img"
        aria-label=${this.label}
        @pointerleave=${(e) => e.pointerType === "mouse" && (this.hover = null)}
      >
        ${m}
      </svg>
      ${this.hover == null ? A : this.renderBox(this.hover, f(this.hover), t, p)}`;
	}
	renderBox(e, t, n, r) {
		let i = t + 182 > n ? Math.max(0, t - 182) : t + 12;
		return C`<div class="box" style="left:${i}px">
      <b>${this.labels[e]}</b>
      ${this.series.map((t) => {
			let n = t.values[e];
			return n == null ? A : C`<div>
              <i style="background:${n < 0 ? t.negative ?? t.color : t.color}"></i><span>${t.label}</span
              ><em>${r(n, t.digits ?? 2)} ${this.unit}</em>
            </div>`;
		})}
    </div>`;
	}
};
s([O({ attribute: !1 })], Q.prototype, "labels", void 0), s([O({ attribute: !1 })], Q.prototype, "ticks", void 0), s([O({ attribute: !1 })], Q.prototype, "series", void 0), s([O({ attribute: !1 })], Q.prototype, "bands", void 0), s([O({ attribute: !1 })], Q.prototype, "markers", void 0), s([O()], Q.prototype, "unit", void 0), s([O({ type: Number })], Q.prototype, "max", void 0), s([O({ type: Number })], Q.prototype, "height", void 0), s([O()], Q.prototype, "label", void 0), s([O()], Q.prototype, "lang", void 0), s([O({ type: Boolean })], Q.prototype, "centerTicks", void 0), s([N()], Q.prototype, "width", void 0), s([N()], Q.prototype, "hover", void 0), j("joe-chart", Q);
//#endregion
//#region src/components/day-answer.ts
var Mc = {
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
}, Nc = class extends x {
	constructor(...e) {
		super(...e), this.date = "", this.changing = !1, this.busy = !1, this.failed = !1;
	}
	static {
		this.styles = [d, T`
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
		if (!e || !this.date || !t && !this.question) return A;
		let n = !t || this.changing;
		return C`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:chat-question-outline"></ha-icon>${e("ask.title")}</div>
        ${o(e, "ask_day")}
      </div>
      ${n ? C`<p>
              ${this.question ? e(`ask.${this.question.kind}`, {
			day: U(e.lang, this.question.date, "weekday"),
			actual: H(e.lang, this.question.actual, 1),
			expected: H(e.lang, this.question.expected, 1)
		}) : e("past.answer.ask")}
            </p>
            <div class="answers" role="group" aria-label=${e("ask.answers")}>
              ${Mc[this.question?.kind ?? "any"].map((n) => C`<button
                    type="button"
                    class="mini-btn ${n === "normal" ? "quiet" : ""}"
                    aria-pressed=${String(n === t)}
                    ?disabled=${this.busy}
                    @click=${() => this.choose(n)}
                  >
                    ${e(`ask.answer.${n}`)}
                  </button>`)}
              ${t ? C`<button type="button" class="mini-btn quiet" ?disabled=${this.busy} @click=${() => this.changing = !1}>
                    ${e("common.cancel")}
                  </button>` : A}
            </div>` : C`<div class="given">
            <p>${e("past.answer.given", { answer: e(`ask.answer.${t}`) })}</p>
            <button type="button" class="mini-btn" @click=${() => this.changing = !0}>
              <ha-icon icon="mdi:pencil-outline"></ha-icon>${e("past.answer.change")}
            </button>
          </div>`}
      ${this.failed ? C`<div class="note warn" role="status"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("error.action")}</div>` : A}
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
s([O({ attribute: !1 })], Nc.prototype, "hass", void 0), s([O({ attribute: !1 })], Nc.prototype, "t", void 0), s([O({ attribute: !1 })], Nc.prototype, "date", void 0), s([O({ attribute: !1 })], Nc.prototype, "answer", void 0), s([O({ attribute: !1 })], Nc.prototype, "question", void 0), s([N()], Nc.prototype, "changing", void 0), s([N()], Nc.prototype, "busy", void 0), s([N()], Nc.prototype, "failed", void 0), s([N()], Nc.prototype, "given", void 0), j("joe-day-answer", Nc);
//#endregion
//#region src/pages/lookback/days.ts
var Pc = 14, Fc = [
	"var(--joe-c-soc)",
	"var(--joe-c-soc-2)",
	"var(--joe-c-grid)",
	"var(--joe-c-ist)"
];
function Ic(e, t, n) {
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
var Lc = class extends x {
	constructor(...e) {
		super(...e), this.prefix = M, this.failed = !1, this.fromStrip = !1, this.reveal = !1;
	}
	static {
		this.styles = [d, T`
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
				days: Pc
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
		if (!e) return A;
		if (!this.days?.days.length) return this.renderEmpty(e);
		let t = this.selected;
		return C`<div class="wrap">
      ${b(e("history.title"))} ${E}
      <p class="status">${this.statusText(e)}</p>
      ${this.rebuildLink(e)}
      ${this.failed ? C`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("history.failed")}</div>` : A}
      ${this.renderStrip(e, this.days.days, t)}
      ${this.day && (!t || this.blank) ? C`<div class="note"><ha-icon icon="mdi:calendar-remove-outline"></ha-icon>${e("past.days.unknown", { day: this.dayName(e, this.day) })}</div>` : A}
      ${this.detail && t && !this.blank ? this.renderDay(e, this.detail) : A}
    </div>`;
	}
	dayName(e, t) {
		return /^\d{4}-\d{2}-\d{2}$/.test(t) ? Ic(e.lang, t, "long") : t;
	}
	rebuildLink(e) {
		let t = this.state?.observe;
		if (!t?.active || t.backfill.state === "running") return A;
		let n = {
			tab: "settings",
			section: "maintenance",
			id: "observe"
		};
		return C`<a class="more" href=${k(this.prefix, n)} @click=${D(n)}>${e("past.days.rebuild")}</a>`;
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
		return C`<div class="empty">
      <joe-pose name="inspect"></joe-pose>
      <div>
        ${b(e("history.title"))} ${E}
        <p class="lead">${e(n)}</p>
        ${this.failed ? C`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("history.failed")}</div>` : A}
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
		return C`<nav class="strip" aria-label=${e("history.days")}>
      ${a.map((t) => {
			let r = i.get(t), a = C`<small>${Ic(e.lang, t, "short")}</small>
          <b>${Number(t.slice(8))}</b>
          <span class="mini" aria-hidden="true">
            <i style="height:${(r?.home ?? 0) / o * 26}px;background:var(--joe-c-load)"></i>
            <i style="height:${(r?.solar ?? 0) / o * 26}px;background:var(--joe-c-pv)"></i>
          </span>`;
			if (!r) return C`<span aria-disabled="true" aria-label=${Ic(e.lang, t, "long")}>${a}</span>`;
			let s = {
				tab: "review",
				section: "days",
				id: t
			}, c = D(s);
			return C`<a
          href=${k(this.prefix, s)}
          aria-current=${t === n ? "date" : A}
          aria-label=${Ic(e.lang, t, "long")}
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
		return C`<div class="day-head" data-anchor="day">
        <h3>${Ic(e.lang, t.date, "long")}</h3>
        ${t.workday === !0 ? C`<span class="chip">${e("history.workday")}</span>` : t.workday === !1 ? C`<span class="chip">${e("history.day_off")}</span>` : A}
        ${i ? C`<span class="chip ok"><ha-icon icon="mdi:eye-outline"></ha-icon>${e("history.live")}</span>` : A}
        ${a ? C`<span class="chip read"><ha-icon icon="mdi:database-outline"></ha-icon>${e("history.read")}</span>` : A}
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
      ${r && n.date !== this.days?.days[0]?.date ? C`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("history.missing", { hours: r })}</span>
          </div>` : A}`;
	}
	renderTiles(e, t) {
		let r = (t) => t == null ? "–" : n(e.lang, t, 1), i = [], a = (e, t, n, r) => C`<div class="tile">
        <div class="eyebrow">${e}</div>
        <div class="value">${t}<small>${n}</small></div>
        ${r ? C`<div class="sub">${r}</div>` : A}
      </div>`;
		if (t.home != null && i.push(a(e("history.tile.home"), r(t.home), "kWh", t.self_sufficiency == null ? "" : e("history.tile.home.self", { value: n(e.lang, t.self_sufficiency * 100, 0) }))), t.solar != null && i.push(a(e("history.tile.solar"), r(t.solar), "kWh", t.fc_ahead == null ? e("history.tile.solar.nofc") : e("history.tile.solar.fc", {
			value: r(t.fc_ahead),
			ratio: t.solar_vs_fc == null ? "–" : n(e.lang, t.solar_vs_fc * 100, 0)
		}))), t.grid_in != null) {
			let n = [];
			t.grid_in_cheap != null && n.push(e("history.tile.grid.cheap", { value: r(t.grid_in_cheap) })), t.grid_out != null && n.push(e("history.tile.grid.out", { value: r(t.grid_out) })), i.push(a(e("history.tile.grid"), r(t.grid_in), "kWh", n.join(" · ")));
		}
		if (t.bat_in != null && i.push(a(e("history.tile.battery"), r(t.bat_in), "kWh", e("history.tile.battery.out", { value: r(t.bat_out) }))), t.temp && i.push(a(e("history.tile.temp"), n(e.lang, t.temp.mean, 1), "°C", e("history.tile.temp.range", {
			min: n(e.lang, t.temp.min, 0),
			max: n(e.lang, t.temp.max, 0)
		}))), t.present) {
			let r = new Map((this.state?.config.persons ?? []).map((e) => [e.id, e.name])), o = Object.entries(t.present), s = Math.max(...o.map(([, e]) => e));
			i.push(a(e("history.tile.present"), n(e.lang, s, 0), "h", o.map(([t, i]) => `${r.get(t) ?? t} ${n(e.lang, i, 0)} h`).join(" · ")));
		}
		return C`<div class="tiles">${i}</div>`;
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
		return C`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("history.chart.energy")} ${o(e, "chart_energy")}</div>
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
		return C`<div class="legend">
      ${e.map((e) => C`<span><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color}"></i>${e.label}</span>`)}
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
				color: Fc[n % Fc.length],
				digits: 0
			};
		});
		if (!n.some((e) => e.values.some((e) => e != null))) return A;
		t.plan_soc_slots.some((e) => e != null) && n.push({
			label: e("history.chart.plan"),
			kind: "line",
			values: t.plan_soc_slots,
			color: "var(--joe-c-ist)",
			dashed: !0,
			digits: 0
		});
		let r = this.chartFrame(t);
		return C`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("history.chart.soc")} ${o(e, "chart_soc")}</div>
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
		if (!t.plan?.fixed) return A;
		if (!n) return C`<div class="note"><ha-icon icon="mdi:timer-sand"></ha-icon><span>${e("history.eval.pending")}</span></div>`;
		if (!n.complete) return C`<div class="note warn">
        <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("history.eval.incomplete")}</span>
      </div>`;
		let r = this.hass?.config?.currency, i = n.saving ?? 0, a = i > .005 ? "good" : i < -.005 ? "bad" : "", s = (t) => H(e.lang, t ?? 0, 1), c = (t) => t ? e("history.eval.clock", { time: this.time(t) }) : e("history.eval.never"), l = !n.final, u = [[e("history.eval.day"), e("history.eval.instead", {
			with: s(n.with_plan?.day_kwh),
			without: s(n.without?.day_kwh)
		})], [e("history.eval.night"), e("history.eval.instead", {
			with: s(n.with_plan?.night_kwh),
			without: s(n.without?.night_kwh)
		})]];
		!l && n.solar?.forecast != null && u.push([e("history.eval.solar"), e("history.eval.solar.value", {
			actual: s(n.solar.actual),
			expected: s(n.solar.forecast)
		})]), !l && n.bridge && u.push([e("history.eval.morning"), e("history.eval.morning.value", {
			actual: s(n.bridge.actual),
			expected: s(n.bridge.planned)
		})]), !l && n.takeover && u.push([e("history.eval.takeover"), e("history.eval.takeover.value", {
			actual: c(n.takeover.actual),
			expected: c(n.takeover.planned)
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
		return C`<div class="chart-card" data-tipped>
      <div class="chart-head">
        ${e("history.eval")} ${o(e, "chart_replay")}
        ${l && n.until ? C`<span class="chip warn">${e("history.eval.provisional", { time: this.time(n.until) })}</span>` : A}
      </div>
      <div class="eval-top">
        <div class="eval-big ${a}">
          ${a === "bad" ? En(e, -i, r) : En(e, i, r)}
          <small>${e(a === "good" ? "history.eval.saved" : a === "bad" ? "history.eval.cost" : "history.eval.same")}</small>
        </div>
        <dl>${u.map(([e, t]) => C`<dt>${e}</dt><dd>${t}</dd>`)}</dl>
      </div>
      ${l && n.until ? C`<div class="note">
            <ha-icon icon="mdi:timer-sand"></ha-icon
            ><span>${e("history.eval.provisional.note", { time: this.time(n.until) })}</span>
          </div>` : A}
      ${d.some((e) => e.values.some((e) => e != null)) ? C`<joe-chart
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
            ${this.legend(d)}` : A}
    </div>`;
	}
	time(e) {
		return e.slice(11, 16);
	}
};
s([O({ attribute: !1 })], Lc.prototype, "hass", void 0), s([O({ attribute: !1 })], Lc.prototype, "t", void 0), s([O({ attribute: !1 })], Lc.prototype, "state", void 0), s([O({ attribute: !1 })], Lc.prototype, "prefix", void 0), s([O({ attribute: !1 })], Lc.prototype, "route", void 0), s([O({ attribute: !1 })], Lc.prototype, "climateFound", void 0), s([O({ attribute: !1 })], Lc.prototype, "day", void 0), s([N()], Lc.prototype, "days", void 0), s([N()], Lc.prototype, "detail", void 0), s([N()], Lc.prototype, "failed", void 0), j("joe-lookback-days", Lc);
//#endregion
//#region src/pages/lookback/learned.ts
var Rc = [
	"clear",
	"mixed",
	"overcast"
], zc = {
	forecast_solar: "Forecast.Solar",
	open_meteo_solar_forecast: "Open-Meteo Solar Forecast",
	solcast_solar: "Solcast"
}, Bc = [
	"all",
	...Rn,
	"climate"
];
function Vc(e, t, n) {
	let r = e.base + (t ? e.workday : 0) + e.heat * Math.max(0, 15 - n) + e.cool * Math.max(0, n - 22);
	return e.presence != null && (r += e.presence * (e.presence_mean ?? 0)), Math.max(0, r);
}
var Hc = class extends x {
	constructor(...e) {
		super(...e), this.prefix = M, this.failed = !1, this.confirming = !1, this.resetting = !1, this.scope = "all";
	}
	static {
		this.styles = [
			d,
			Ca,
			T`
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
		let t = ja(this.state);
		e.has("state") && this.marker !== void 0 && t !== this.marker && this.load(), this.marker = t, e.has("anchor") && this.anchor && (this.pending = this.anchor);
	}
	updated() {
		let e = this.pending;
		e && this.data && he(this.renderRoot, e) && (this.pending = void 0);
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
		if (!e) return A;
		let t = this.data;
		return C`<div class="wrap">
        <div class="intro">
          <div>
            ${b(e("learn.page.title"))} ${E}
            <p class="lead">${e("learn.lead")}</p>
            <p class="status">${this.statusText(e)}</p>
          </div>
          <joe-pose name="learn"></joe-pose>
        </div>
        ${this.failed ? C`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("learn.failed")}</div>` : A}
        ${t ? C`<div class="group" data-anchor="sun">
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
              ${this.renderReset(e)}` : A}
      </div>
      ${this.confirming ? this.renderConfirm(e) : A}`;
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
		return C`<a class="go-link" href=${k(this.prefix, e)} @click=${D(e)}>${t}</a>`;
	}
	renderSolar(t, r) {
		let i = r.learned, a = i.solar_factor, s;
		s = a == null ? t("learn.solar.learning", {
			need: r.needs.solar,
			have: i.solar_days
		}) : a < .95 ? t("learn.solar.less", {
			value: n(t.lang, (1 - a) * 100, 0),
			share: n(t.lang, a * 100, 0)
		}) : a > 1.05 ? t("learn.solar.more", {
			value: n(t.lang, (a - 1) * 100, 0),
			share: n(t.lang, a * 100, 0)
		}) : t("learn.solar.fits");
		let c = r.solar.slice(-28), l = [{
			label: t("learn.solar.chart.actual"),
			kind: "bar",
			values: c.map((e) => e.actual),
			color: "var(--joe-c-pv)",
			digits: 1
		}, {
			label: t("learn.solar.chart.forecast"),
			kind: "line",
			values: c.map((e) => e.forecast),
			color: "var(--joe-c-ist)",
			dashed: !0,
			digits: 1
		}];
		return C`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:weather-sunny"></ha-icon>${t("learn.solar")}</div>
        ${o(t, "learn_solar")}
      </div>
      <div class="figure">
        <div class="big ${a == null ? "small" : ""}">
          ${a == null ? t("learn.still") : `× ${n(t.lang, a, 2)}`}
        </div>
        ${a == null ? A : C`${e(t, { source: "learned" })}<span class="chip">${t("learn.days", { days: i.solar_days })}</span>`}
      </div>
      <p class="say">${s}</p>
      ${c.length > 1 ? this.chartWithLegend(t, c.map((e) => e.date), l, "kWh", t("learn.solar.chart")) : A}
    </section>`;
	}
	renderShift(t, n) {
		let r = n.learned, i = r.solar_shift;
		return C`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:clock-time-four-outline"></ha-icon>${t("learn.shift")}</div>
        ${o(t, "learn_shift")}
      </div>
      <div class="figure">
        <div class="big ${i == null ? "small" : ""}">${t(i == null ? "learn.still" : `learn.shift.big.${i}`)}</div>
        ${i == null ? A : C`${e(t, { source: "learned" })}<span class="chip">${t("learn.days", { days: r.shift_days })}</span>`}
      </div>
      <p class="say">
        ${i == null ? t("learn.shift.learning", {
			need: n.needs.shift,
			have: r.shift_days
		}) : t(`learn.shift.${i}`)}
      </p>
      ${n.solar_profile ? this.hourChart(t, this.profileSeries(t, n.solar_profile), t("learn.shift.chart")) : A}
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
		return C`<joe-chart
        .labels=${r}
        .ticks=${i}
        .series=${t}
        unit="kWh"
        height="150"
        lang=${e.lang}
        label=${n}
      ></joe-chart>
      <div class="legend">
        ${t.map((e) => C`<span><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color}"></i>${e.label}</span>`)}
      </div>`;
	}
	renderBuffer(t, r) {
		let { value: i, source: a } = r.buffer, s = r.learned, c = (e) => n(t.lang, e * 100, 0), l;
		l = a === "user" ? s.buffer == null ? t("learn.buffer.user") : t("learn.buffer.user_learned", { value: c(s.buffer) }) : a === "learned" ? t("learn.buffer.learned") : t("learn.buffer.default", {
			need: r.needs.buffer,
			have: s.buffer_days
		});
		let u = r.accuracy.slice(-14), d = [{
			label: t("learn.buffer.chart.planned"),
			kind: "bar",
			values: u.map((e) => e.bridge.planned),
			color: "var(--joe-c-ist)",
			digits: 1
		}, {
			label: t("learn.buffer.chart.actual"),
			kind: "bar",
			values: u.map((e) => e.bridge.actual),
			color: "var(--joe-c-soc)",
			digits: 1
		}];
		return C`<section class="card" data-tipped data-anchor="buffer">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:shield-half-full"></ha-icon>${t("learn.buffer")}</div>
        ${o(t, "learn_buffer")}
      </div>
      <div class="figure">
        <div class="big">${c(i)}<small> %</small></div>
        ${e(t, { source: a })}
        ${a === "learned" ? C`<span class="chip">${t("learn.mornings", { count: s.buffer_days })}</span>` : A}
      </div>
      <p class="say">${l}</p>
      ${u.length > 1 ? this.chartWithLegend(t, u.map((e) => e.date), d, "kWh", t("learn.buffer.chart")) : A}
      ${ta(t, this.prefix, {
			label: t("rule.buffer_factor"),
			value: `${c(i)} %`,
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
		return C`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:home-lightning-bolt-outline"></ha-icon>${e("learn.home")}</div>
        ${o(e, "learn_home")}
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
		return C`<joe-chart
        .labels=${t.map((t) => U(e.lang, t, "weekday"))}
        .ticks=${Ma(e.lang, t)}
        .series=${n}
        centerTicks
        unit=${r}
        height="150"
        lang=${e.lang}
        label=${i}
      ></joe-chart>
      <div class="legend">
        ${n.map((e) => C`<span
              ><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color};height:${e.kind === "bar" ? "10px" : "4px"}"></i
              >${e.label}</span
            >`)}
      </div>`;
	}
	renderWeather(t, r) {
		let i = t.lang, a = r.learned.consumption_model, s = r.days.filter((e) => e.temp != null), c = s.filter((e) => !e.excluded).length, l = this.state?.config.context.weather_entity, u;
		if (!l) u = t("learn.model.no_weather");
		else if (!a) u = t("learn.model.learning", {
			need: r.needs.models,
			have: c
		});
		else {
			let e = [t("learn.model.base", { value: H(i, a.base + (a.presence ?? 0) * (a.presence_mean ?? 0), 1) })];
			Math.abs(a.workday) >= .3 && e.push(t(a.workday > 0 ? "learn.model.workday_more" : "learn.model.workday_less", { value: H(i, Math.abs(a.workday), 1) })), a.heat >= .05 && e.push(t("learn.model.heat", { value: H(i, a.heat, 2) })), a.cool >= .05 && e.push(t("learn.model.cool", { value: H(i, a.cool, 2) })), a.presence != null && Math.abs(a.presence) >= .05 && e.push(t("learn.model.presence", { value: H(i, a.presence, 2) })), e.push(t("learn.model.fit", { share: n(i, a.r2 * 100, 0) })), u = e.join(" ");
		}
		let d = a != null && a.heat >= .05;
		return C`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:thermometer"></ha-icon>${t("learn.model")}</div>
        ${o(t, "learn_model")}
      </div>
      <div class="figure">
        <div class="big ${a ? "" : "small"}">
          ${a ? d ? C`+${H(i, a.heat, 2)}<small> kWh/°C</small>` : C`${H(i, a.base + (a.presence ?? 0) * (a.presence_mean ?? 0), 1)}<small> kWh</small>` : t("learn.still")}
        </div>
        ${a ? C`${e(t, { source: "learned" })}<span class="chip">${t("learn.days", { days: a.days })}</span>` : A}
      </div>
      <p class="say">${u}</p>
      ${l ? A : ta(t, this.prefix, {
			label: t("past.learned.weather"),
			value: t("past.learned.weather.missing"),
			to: {
				tab: "household",
				section: "travel"
			},
			action: "set"
		})}
      ${s.length > 2 ? this.temperatureChart(t, r, a) : A}
    </section>`;
	}
	temperatureChart(e, t, r) {
		let i = t.days.filter((e) => e.temp != null && !e.excluded), a = i.map((e) => e.temp), o = Math.floor(Math.min(...a) / 2) * 2, s = Math.floor(Math.max(...a) / 2) * 2 + 2, c = [];
		for (let e = o; e < s; e += 2) c.push(e);
		let l = (t) => n(e.lang, t, 0), u = [{
			label: e("learn.model.chart.actual"),
			kind: "bar",
			values: c.map((e) => {
				let t = i.filter((t) => t.temp >= e && t.temp < e + 2);
				return t.length ? t.reduce((e, t) => e + t.home, 0) / t.length : null;
			}),
			color: "var(--joe-c-ist)",
			digits: 1
		}];
		r && u.push({
			label: e("learn.model.chart.workday"),
			kind: "line",
			values: c.map((e) => Vc(r, !0, e + 1)),
			color: "var(--joe-c-soc)",
			digits: 1
		}, {
			label: e("learn.model.chart.day_off"),
			kind: "line",
			values: c.map((e) => Vc(r, !1, e + 1)),
			color: "var(--joe-c-soc-2)",
			dashed: !0,
			digits: 1
		});
		let d = Math.max(1, Math.ceil(c.length / 8)), f = /* @__PURE__ */ new Map();
		return c.forEach((e, t) => {
			t % d === 0 && f.set(t, `${l(e)}°`);
		}), C`<joe-chart
        .labels=${c.map((e) => `${l(e)} … ${l(e + 2)} °C`)}
        .ticks=${f}
        .series=${u}
        unit="kWh"
        height="150"
        lang=${e.lang}
        label=${e("learn.model.chart")}
      ></joe-chart>
      <div class="legend">
        ${u.map((e) => C`<span
              ><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color};height:${e.kind === "bar" ? "10px" : "4px"}"></i
              >${e.label}</span
            >`)}
      </div>`;
	}
	renderSources(e, t) {
		let r = e.lang, i = this.state.config, a = t.learned.solar_classes ?? {}, s = a.classes ?? {}, c = i.forecast, l = t.learned.sources ?? {}, u = Rc.filter((e) => s[e]), d = (e) => n(r, e * 100, 0), f = [["main", c.provider ? zc[c.provider] ?? c.provider : e("learn.sources.main")], ...c.alternatives.map((e) => [e.id, e.name])], p = Object.fromEntries(f.map(([e]) => [e, l[e] ? 1 / Math.max(l[e].error, .05) ** 2 : 0])), m = Object.values(p).reduce((e, t) => e + t, 0);
		return C`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:weather-partly-cloudy"></ha-icon>${e("learn.weather")}</div>
        ${o(e, "learn_weather")}
      </div>
      <p class="say">
        ${u.length ? e("learn.weather.say", { top: H(r, a.top ?? 0, 1) }) : e("learn.weather.learning", { have: a.days ?? 0 })}
      </p>
      ${u.length ? Sa(Rc.map((t) => {
			let i = s[t];
			return {
				name: e(`learn.weather.${t}`),
				values: i ? [`× ${n(r, i.factor, 2)}`, e("learn.days", { days: i.days })] : [e("learn.still")]
			};
		})) : A}
      <div class="sub-head">
        <b>${e("learn.sources")}</b>
      </div>
      ${c.alternatives.length ? C`${Sa(f.map(([i, a]) => {
			let o = l[i];
			return {
				name: a,
				values: o ? [
					`× ${n(r, o.factor, 2)}`,
					e("learn.sources.error", { value: d(o.error) }),
					c.combine && m ? e("learn.sources.weight", { value: d(p[i] / m) }) : ""
				] : [e("learn.sources.learning", { need: t.needs.sources })]
			};
		}))}
            ${ta(e, this.prefix, {
			label: e("learn.sources.combine"),
			value: e(c.combine ? "rule.on" : "rule.off"),
			to: {
				tab: "devices",
				section: "grid",
				id: "solar"
			}
		})}` : C`<p class="say">${e("learn.sources.single")}</p>`}
    </section>`;
	}
	rowsCard(e, t, n, r, i, a, o, s = A) {
		return C`<section class="card" data-tipped data-anchor=${t}>
      <div class="head">
        <div class="eyebrow"><ha-icon icon=${n}></ha-icon>${r}</div>
        ${i}
      </div>
      ${a.length ? Sa(a) : C`<p class="say">${o}</p>`} ${s}
    </section>`;
	}
	renderBatteries(e, t) {
		let n = this.state.config;
		return this.rowsCard(e, "battery", "mdi:battery-heart-variant", e("learn.battery"), o(e, "learn_battery"), n.batteries.map((r) => wa(e, n, t.learned, r, t.needs.models)), e("learn.battery.none"));
	}
	renderGroups(e, t) {
		let n = this.state.config.consumers.filter((e) => e.energy_entity && e.kind !== "submeter");
		return this.rowsCard(e, "devices", "mdi:chart-donut", e("learn.groups"), o(e, "learn_groups"), n.map((n) => Ta(e, t.learned, n)), e("learn.groups.none"));
	}
	renderHotWater(e, t) {
		let n = this.state.config.actions.filter((e) => e.kind === "target");
		return this.rowsCard(e, "hot_water", "mdi:water-boiler", e("learn.hot_water"), o(e, "learn_hot_water"), n.map((n) => Ea(e, t.learned, n)), e("learn.hot_water.none"));
	}
	renderCars(e, t) {
		let n = (this.state.config.cars ?? []).filter((e) => e.need.enabled);
		return this.rowsCard(e, "car", "mdi:car-electric", e("learn.car"), o(e, "learn_car"), n.map((n) => Da(e, t.learned, n)), e("learn.car.none"));
	}
	renderClimate(t) {
		let r = this.state.config, i = this.state?.climate?.rates ?? {}, a = this.climateFound?.devices ?? [], s = Object.fromEntries(a.map((e) => [e.entity_id, e.name])), c = Object.entries(r.climate?.rooms ?? {}).filter(([, e]) => e.enabled).map(([e]) => e), l = [.../* @__PURE__ */ new Set([...c, ...Object.keys(i)])].map((e) => {
			let r = i[e];
			return {
				name: s[e] ?? (this.hass ? f(this.hass, e) : e),
				values: r ? [t("past.learned.climate.rate", { rate: n(t.lang, r, 1) })] : [t("learn.still")],
				note: r ? void 0 : t("climate.rate_default")
			};
		});
		return C`<section class="card" data-tipped data-anchor="climate">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:thermostat-auto"></ha-icon>${t("past.learned.climate")}</div>
        ${o(t, "learn_climate")}
      </div>
      ${l.length ? C`<p class="say">${t("past.learned.climate.say")}</p>
            ${Object.keys(i).length ? C`<div class="figure">${e(t, { source: "learned" })}</div>` : A}
            ${Sa(l)}` : C`<p class="say">${t("past.learned.climate.none")}</p>
            ${this.goLink({
			tab: "devices",
			section: "climate"
		}, t("past.learned.climate.open"))}`}
    </section>`;
	}
	renderPresence(e, t) {
		let n = this.state.config, r = this.state?.climate?.usual ?? {}, i = n.persons, a = i.map((n) => {
			let i = ka(e, t.learned, n, n.person_entity ? r[n.person_entity] : void 0);
			return n.calendars.length ? i : {
				...i,
				extra: this.goLink({
					tab: "household",
					section: "people",
					id: n.id
				}, e("learn.presence.calendars"))
			};
		});
		return this.rowsCard(e, "presence", "mdi:account-clock-outline", e("learn.presence"), o(e, "learn_presence"), a, e("learn.presence.none"), i.length ? A : this.goLink({
			tab: "household",
			section: "people"
		}, e("learn.presence.calendars")));
	}
	renderReset(e) {
		let t = !this.state?.observe?.active && this.scope !== "climate";
		return C`<section class="card danger wide" data-tipped data-anchor="reset">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:restore"></ha-icon>${e("learn.reset")}</div>
        ${o(e, "learn_reset")}
      </div>
      <p>${e("learn.reset.text")}</p>
      <div class="sub-head with-tip"><b>${e("learn.reset.scope")}</b>${o(e, "learn_reset_scope")}</div>
      <div class="seg scopes" role="group" aria-label=${e("learn.reset.scope")}>
        ${Bc.map((t) => C`<button type="button" aria-pressed=${String(this.scope === t)} @click=${() => this.scope = t}>
              ${e(`learn.reset.scope.${t}`)}
            </button>`)}
      </div>
      <div class="actions">
        <button type="button" class="btn btn-danger" ?disabled=${t} @click=${() => this.confirming = !0}>
          ${e(this.scope === "all" ? "learn.reset.button" : "learn.reset.button.scope")}
        </button>
      </div>
      ${t ? C`<p>${e("learn.reset.off")}</p>` : A}
      ${this.notice ? C`<div class="note ${this.notice.ok ? "" : "warn"}" role="status">
            <ha-icon icon=${this.notice.ok ? "mdi:check" : "mdi:alert-outline"}></ha-icon>${this.notice.text}
          </div>` : A}
    </section>`;
	}
	renderConfirm(e) {
		let t = () => {
			this.confirming = !1;
		}, n = this.scope;
		return C`<joe-sheet label=${e("learn.reset.label")} closeLabel=${e("common.close")} @joe-close=${t}>
      <div data-tipped>
        <div class="sheet-title">${b(e("learn.reset.confirm.title"), "h2", o(e, "learn_reset"))}</div>
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
s([O({ attribute: !1 })], Hc.prototype, "hass", void 0), s([O({ attribute: !1 })], Hc.prototype, "t", void 0), s([O({ attribute: !1 })], Hc.prototype, "state", void 0), s([O({ attribute: !1 })], Hc.prototype, "prefix", void 0), s([O({ attribute: !1 })], Hc.prototype, "route", void 0), s([O({ attribute: !1 })], Hc.prototype, "climateFound", void 0), s([O({ attribute: !1 })], Hc.prototype, "anchor", void 0), s([N()], Hc.prototype, "data", void 0), s([N()], Hc.prototype, "failed", void 0), s([N()], Hc.prototype, "confirming", void 0), s([N()], Hc.prototype, "resetting", void 0), s([N()], Hc.prototype, "scope", void 0), s([N()], Hc.prototype, "notice", void 0), j("joe-lookback-learned", Hc);
//#endregion
//#region src/pages/lookback/log.ts
var Uc = class extends x {
	constructor(...e) {
		super(...e), this.prefix = M, this.failed = !1;
	}
	static {
		this.styles = [d, T`
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
		e.has("group") && this.group && !Wr.includes(this.group) && w(this, {
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
		return this.full ?? Gr(this.state?.control?.log, this.state?.climate?.log);
	}
	get filter() {
		return Wr.includes(this.group ?? "") ? this.group : "all";
	}
	render() {
		let e = this.t;
		if (!e || !this.state) return A;
		let t = this.state.config, n = this.entries, r = this.filter, i = Object.fromEntries((this.climateFound?.devices ?? []).map((e) => [e.entity_id, e.name])), a = /* @__PURE__ */ new Map([["all", n.length]]), s = /* @__PURE__ */ new Map();
		for (let e of n) {
			let n = Kr(t, e);
			a.set(n.group, (a.get(n.group) ?? 0) + 1), n.group === r && n.device && s.set(n.device, (s.get(n.device) ?? 0) + 1);
		}
		let c = r === "all" ? void 0 : this.device, l = [e(r === "all" ? "past.log.all" : `past.log.filter.${r}`), ...c ? [qr(t, this.hass, i, r, c)] : []].join(" · ");
		return C`<div class="wrap">
      ${b(e("past.log.title"))} ${E}
      <p class="lead">${e("past.log.lead")}</p>
      <nav class="filters" aria-label=${e("past.log.filters")}>
        ${Wr.filter((e) => e === "all" || e === r || a.get(e)).map((t) => this.chip({
			tab: "review",
			section: "log",
			id: t
		}, e(t === "all" ? "past.log.all" : `past.log.filter.${t}`), t === r && !c, a.get(t)))}
      </nav>
      ${r !== "all" && r !== "joe" && (s.size > 1 || c) ? C`<nav class="filters" aria-label=${e("past.log.devices")}>
            ${[.../* @__PURE__ */ new Set([...s.keys(), ...c ? [c] : []])].map((e) => this.chip({
			tab: "review",
			section: "log",
			id: r,
			sub: e
		}, qr(t, this.hass, i, r, e), e === c, s.get(e) ?? 0))}
          </nav>` : A}
      <section class="card" data-tipped>
        <div class="head">
          <div class="eyebrow"><ha-icon icon="mdi:clipboard-text-clock-outline"></ha-icon>${l}</div>
          ${o(e, "past_log")}
        </div>
        ${this.failed && n.length ? C`<div class="note"><ha-icon icon="mdi:information-outline"></ha-icon>${e("past.log.partial")}</div>` : A}
        <joe-log-list
          .t=${e}
          .hass=${this.hass}
          .config=${t}
          .names=${i}
          .entries=${n}
          .filter=${{
			group: r,
			device: c
		}}
          .empty=${n.length ? e("past.log.empty_filter") : e("past.log.empty")}
        ></joe-log-list>
      </section>
    </div>`;
	}
	chip(e, t, n, r) {
		return C`<a
      class="section-chip ${n ? "on" : ""}"
      href=${k(this.prefix, e)}
      aria-current=${n ? "page" : A}
      @click=${D(e, { replace: !0 })}
      >${t}${r == null ? A : C`<span class="section-count">${r}</span>`}</a
    >`;
	}
};
s([O({ attribute: !1 })], Uc.prototype, "hass", void 0), s([O({ attribute: !1 })], Uc.prototype, "t", void 0), s([O({ attribute: !1 })], Uc.prototype, "state", void 0), s([O({ attribute: !1 })], Uc.prototype, "prefix", void 0), s([O({ attribute: !1 })], Uc.prototype, "route", void 0), s([O({ attribute: !1 })], Uc.prototype, "climateFound", void 0), s([O({ attribute: !1 })], Uc.prototype, "group", void 0), s([O({ attribute: !1 })], Uc.prototype, "device", void 0), s([N()], Uc.prototype, "full", void 0), s([N()], Uc.prototype, "failed", void 0), j("joe-lookback-log", Uc);
//#endregion
//#region src/pages/lookback/result.ts
var Wc = class extends x {
	constructor(...e) {
		super(...e), this.prefix = M, this.failed = !1;
	}
	static {
		this.styles = [d, T`
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
		let t = ja(this.state);
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
		return e ? C`<div class="wrap">
      ${b(e("past.result.title"))} ${E}
      <p class="lead">${e("past.result.lead")}</p>
      ${this.failed ? C`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("learn.failed")}</div>` : A}
      ${this.data ? C`${this.renderResults(e, this.data)} ${this.renderAccuracy(e, this.data)}` : A}
    </div>` : A;
	}
	renderResults(e, t) {
		let n = t.results, r = C`<div class="head">
      <div class="eyebrow"><ha-icon icon="mdi:cash-check"></ha-icon>${e("past.result.total")}</div>
      <span class="pill-sim">${e("mode.simulation")}</span>
      ${o(e, "sim_result")}
    </div>`;
		if (!n?.days) return C`<section class="card hero" data-tipped>${r}
        <p class="say">${e("learn.results.none")}</p>
      </section>`;
		let i = n.daily, a = [{
			label: e("learn.results.chart.saving"),
			kind: "bar",
			values: i.map((e) => e.saving),
			color: "var(--joe-good)",
			negative: "var(--joe-crit)",
			digits: 2
		}], s = n.since ?? n.first;
		return C`<section class="card hero" data-tipped>
      ${r}
      <div class="figure">
        <div class="big ${n.saving > .005 ? "good" : n.saving < -.005 ? "bad" : ""}">
          ${En(e, n.saving, this.currency, !0)}
        </div>
      </div>
      <p class="say">
        ${e("learn.results.say", {
			since: s ? U(e.lang, s) : "–",
			nights: kn(e, n.days)
		})}
      </p>
      <p class="split">
        ${e("learn.results.split", {
			better: n.better,
			worse: n.worse,
			same: Math.max(0, n.days - n.better - n.worse)
		})}
      </p>
      ${i.length > 1 ? C`<joe-chart
            .labels=${i.map((t) => U(e.lang, t.date, "weekday"))}
            .ticks=${Ma(e.lang, i.map((e) => e.date))}
            .series=${a}
            centerTicks
            unit=${Dn(e.lang, this.currency)}
            height="160"
            lang=${e.lang}
            label=${e("learn.results.chart")}
          ></joe-chart>` : A}
    </section>`;
	}
	renderAccuracy(e, t) {
		let n = t.accuracy.slice(-14).reverse(), r = (t) => t == null ? "–" : H(e.lang, t, 1);
		return C`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:target"></ha-icon>${e("learn.accuracy")}</div>
        ${o(e, "learn_accuracy")}
      </div>
      ${n.length ? C`<div class="table" role="table" aria-label=${e("learn.accuracy")}>
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
			return C`<span role="cell"
                  ><a href=${k(this.prefix, n)} @click=${D(n)}>${U(e.lang, t.date, "weekday")}</a></span
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
                  >${En(e, t.saving, this.currency, !0)}</span
                >`;
		})}
          </div>` : C`<p class="say">${e("learn.accuracy.none")}</p>`}
    </section>`;
	}
};
s([O({ attribute: !1 })], Wc.prototype, "hass", void 0), s([O({ attribute: !1 })], Wc.prototype, "t", void 0), s([O({ attribute: !1 })], Wc.prototype, "state", void 0), s([O({ attribute: !1 })], Wc.prototype, "prefix", void 0), s([O({ attribute: !1 })], Wc.prototype, "route", void 0), s([O({ attribute: !1 })], Wc.prototype, "climateFound", void 0), s([N()], Wc.prototype, "data", void 0), s([N()], Wc.prototype, "failed", void 0), j("joe-lookback-result", Wc);
//#endregion
//#region src/pages/lookback/index.ts
var Gc = {
	result: "joe-lookback-result",
	days: "joe-lookback-days",
	learned: "joe-lookback-learned",
	log: "joe-lookback-log"
}, Kc = {
	result: "mdi:piggy-bank-outline",
	days: "mdi:calendar-month-outline",
	learned: "mdi:school-outline",
	log: "mdi:format-list-bulleted"
}, qc = class extends x {
	constructor(...e) {
		super(...e), this.prefix = M;
	}
	static {
		this.styles = [d, T`
      :host {
        display: block;
      }
    `];
	}
	render() {
		let e = this.t;
		if (!e || !this.state) return A;
		let t = this.route?.section ?? ge.review, n = de.review.map((t) => ({
			id: t,
			label: e(`nav.review.${t}`),
			icon: Kc[t]
		}));
		return C`${Cr(e, this.prefix, "review", n, t)}${this.renderSection(t)}`;
	}
	renderSection(e) {
		if (!customElements.get(Gc[e])) return C``;
		let { t, hass: n, state: r, prefix: i, route: a, climateFound: o } = this;
		switch (e) {
			case "result": return C`<joe-lookback-result
          .t=${t}
          .hass=${n}
          .state=${r}
          .prefix=${i}
          .route=${a}
          .climateFound=${o}
        ></joe-lookback-result>`;
			case "days": return C`<joe-lookback-days
          .t=${t}
          .hass=${n}
          .state=${r}
          .prefix=${i}
          .route=${a}
          .climateFound=${o}
          .day=${a?.id}
        ></joe-lookback-days>`;
			case "learned": return C`<joe-lookback-learned
          .t=${t}
          .hass=${n}
          .state=${r}
          .prefix=${i}
          .route=${a}
          .climateFound=${o}
          .anchor=${a?.id}
        ></joe-lookback-learned>`;
			case "log": return C`<joe-lookback-log
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
s([O({ attribute: !1 })], qc.prototype, "hass", void 0), s([O({ attribute: !1 })], qc.prototype, "t", void 0), s([O({ attribute: !1 })], qc.prototype, "state", void 0), s([O({ attribute: !1 })], qc.prototype, "route", void 0), s([O({ attribute: !1 })], qc.prototype, "prefix", void 0), s([O({ attribute: !1 })], qc.prototype, "climateFound", void 0), j("joe-lookback-page", qc);
//#endregion
//#region src/components/review.ts
var Jc = /* @__PURE__ */ new Set([
	"climate",
	"heat_pump",
	"electric_heating",
	"hot_water"
]), Yc = {
	battery: "nav.devices.battery",
	grid: "nav.devices.grid",
	car: "nav.devices.car",
	other: "nav.devices.other",
	people: "nav.household.people",
	weather: "onb.part.weather",
	holiday: "onb.part.holiday"
}, Xc = class extends x {
	constructor(...e) {
		super(...e), this.checks = [], this.omit = [], this.tariffOpen = !1;
	}
	static {
		this.styles = [
			d,
			as,
			T`
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
		if (!e || !t || !n) return A;
		let r = new Set(this.omit), i = this.parts(e, t, n);
		return C`${[{
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
		}].map((e) => C`<section class="group">
          <h3 class="group-head">${t(`onb.group.${e.key}`)}</h3>
          <p class="group-lead">${t(`onb.group.${e.key}.lead`)}</p>
          ${e.parts.map((e) => {
			let n = i[e].filter((e) => !r.has(e.key));
			return n.length ? C`<div class="part">
                  <h4 class="eyebrow">${t(Yc[e])}</h4>
                  <ul class="found">
                    ${n.map((e) => ss(t, e))}
                  </ul>
                </div>` : A;
		})}
        </section>`)}
      ${this.tariffOpen ? this.renderTariff(t, n) : A}`;
	}
	parts(e, t, n) {
		let r = this.discovery, i = {
			from: this,
			hass: e,
			t,
			config: n,
			discovery: r,
			checks: this.checks
		}, a = [], o = hs(i);
		o && a.push(o);
		let s = n.tariff.kind === "unknown";
		return a.push(gs(i, { actions: [X(t(s ? "review.enter" : "review.change"), "mdi:pencil-outline", () => {
			this.tariffOpen = !0;
		})] }), _s(i), ys(i, "grid_power"), ys(i, "home_power", { devices: X(t("review.home.devices"), "mdi:devices", () => this.edit("consumers")) }), Cs(i)), {
			battery: this.batteryRows(e, t, n),
			grid: a,
			car: this.carRows(t, n),
			other: [this.otherRow(t, n)],
			people: [this.peopleRow(t, n)],
			weather: [us(this, e, t, n, r, "weather")],
			holiday: [us(this, e, t, n, r, "holiday")]
		};
	}
	carRows(e, t) {
		let r = this.discovery, i = [];
		for (let t of r?.wallboxes.filter((e) => e.is_car) ?? []) i.push({
			key: `car:wallbox:${t.device_id ?? t.name}`,
			icon: "mdi:ev-station",
			title: t.name,
			detail: e("onb.car.wallbox")
		});
		for (let t of r?.cars ?? []) {
			let r = t.soc === null ? "" : ` · ${n(e.lang, t.soc, 0)} %`;
			i.push({
				key: `car:car:${t.device_id}`,
				icon: "mdi:car-electric",
				title: t.name,
				detail: `${e("onb.car.car")}${r}`
			});
		}
		for (let n of t.consumers.filter((e) => e.kind === "ev")) i.push({
			key: `car:meter:${n.id}`,
			icon: "mdi:meter-electric-outline",
			title: n.name,
			detail: e("onb.car.meter")
		});
		return i.length || i.push({
			key: "car:none",
			icon: "mdi:car-electric",
			title: e("nav.devices.car"),
			detail: e("find.none"),
			state: "missing",
			notes: [os(e("onb.car.none"))]
		}), i;
	}
	otherRow(e, t) {
		let n = t.consumers.filter((e) => e.kind !== "submeter");
		return n.length ? {
			key: "devices",
			icon: "mdi:devices",
			title: e("find.devices"),
			detail: e("find.devices.detail", {
				count: Z(e, n.length, "word.device"),
				heating: n.filter((e) => Jc.has(e.kind)).length
			})
		} : {
			key: "devices",
			icon: "mdi:devices",
			title: e("find.devices"),
			detail: e("find.none"),
			state: "missing",
			notes: [os(e("onb.other.none"))]
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
			notes: [os(e("onb.people.none"))]
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
	batteryRows(t, r, i) {
		let a = [];
		for (let o of i.batteries) {
			let s = this.discovery?.batteries.find((e) => e.id === o.id), c = y(t, o.soc_entity), d = o.capacity_kwh ?? l(t, o.capacity_entity), f = [
				d ? `${n(r.lang, d, 2)} kWh` : r("review.capacity_unknown"),
				c === null ? null : `${n(r.lang, c, 0)} %`,
				o.adapter === "none" ? r("find.battery.read") : r("find.battery.control")
			], p = this.checks.filter((e) => e.battery_id === o.id);
			a.push({
				key: `battery:${o.id}`,
				icon: "mdi:home-battery-outline",
				title: o.name,
				detail: f.filter(Boolean).join(" · "),
				chips: [e(r, P(i, `batteries[${o.id}].soc_entity`)), ...s ? [u(r, s.confidence)] : []],
				reasons: s?.reasons,
				notes: p.map((e) => fs(r, e)),
				state: p.some((e) => e.level === "warn") ? "flag" : void 0,
				tip: "review_battery",
				actions: [X(r("review.change"), "mdi:pencil-outline", () => this.edit("battery", o.id)), X(r("review.ignore"), "", () => this.ignoreBattery(o.id), !0)]
			});
		}
		for (let e of this.discovery?.batteries ?? []) F(i, `battery:${e.id}`) && !i.batteries.some((t) => t.id === e.id) && a.push({
			key: `battery:${e.id}`,
			icon: "mdi:home-battery-outline",
			title: e.name,
			detail: r("review.ignored"),
			state: "ignored",
			tip: "review_ignored",
			actions: [X(r("review.use"), "mdi:undo-variant", () => void Pr(this, i, e))]
		});
		return !i.batteries.length && !this.discovery?.batteries.length && a.push({
			key: "battery:add",
			icon: "mdi:home-battery-outline",
			title: r("review.battery"),
			detail: r("review.battery.none"),
			state: "missing",
			tip: "review_battery_add",
			actions: [X(r("review.add"), "mdi:plus", () => void Fr(this, r, t, i))]
		}), a;
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
			answers: { ignored: Je(this.config, `battery:${e}`, !0) }
		});
	}
	renderTariff(e, t) {
		return C`<joe-sheet label=${e("edit.tariff.label")} closeLabel=${e("common.close")} @joe-close=${(e) => {
			e.stopPropagation(), this.tariffOpen = !1;
		}}>
      <div class="sheet-title">${b(e("edit.tariff.title"))}</div>
      <joe-tariff-draft closable .hass=${this.hass} .t=${e} .config=${t} .discovery=${this.discovery}></joe-tariff-draft>
    </joe-sheet>`;
	}
};
s([O({ attribute: !1 })], Xc.prototype, "hass", void 0), s([O({ attribute: !1 })], Xc.prototype, "t", void 0), s([O({ attribute: !1 })], Xc.prototype, "config", void 0), s([O({ attribute: !1 })], Xc.prototype, "discovery", void 0), s([O({ attribute: !1 })], Xc.prototype, "checks", void 0), s([O({ attribute: !1 })], Xc.prototype, "omit", void 0), s([N()], Xc.prototype, "tariffOpen", void 0), j("joe-review", Xc);
//#endregion
//#region src/components/step-nav.ts
function Zc(e, t, n = !1) {
	let r = C`<button type="button" class="btn btn-primary" ?data-notip=${!t.nextTip} @click=${t.next}>
    ${t.nextLabel}<ha-icon icon="mdi:chevron-right"></ha-icon>
  </button>`;
	return C`<nav class="step-nav ${n ? "wide" : ""}" aria-label=${e("onb.nav")}>
    ${t.back ? C`<button type="button" class="btn btn-ghost" data-notip @click=${t.back}>
          <ha-icon icon="mdi:chevron-left"></ha-icon>${t.backLabel ?? e("onb.back")}
        </button>` : C`<span></span>`}
    ${t.nextTip ? C`<span class="with-tip" data-tipped>${r} ${o(e, t.nextTip)}</span>` : r}
  </nav>`;
}
//#endregion
//#region src/homes.ts
function Qc(e, t) {
	let n = e(`tab.${t.tab}`), r = t.section ? e.optional(`nav.${t.tab}.${t.section}`) : void 0;
	return r ? `${n} › ${r}` : n;
}
function $c(e, t) {
	return {
		to: t,
		place: Qc(e, t)
	};
}
function el(e, t) {
	if (t.startsWith("capacity:")) return $c(e, {
		tab: "devices",
		section: "battery",
		id: t.slice(9)
	});
	switch (t) {
		case "tariff":
		case "feed_in": return $c(e, {
			tab: "devices",
			section: "grid",
			id: "tariff"
		});
		case "heating": return $c(e, {
			tab: "devices",
			section: "other"
		});
		case "climate": return $c(e, {
			tab: "devices",
			section: "climate"
		});
		case "hot_water": return $c(e, {
			tab: "devices",
			section: "hot_water"
		});
		case "ev": return $c(e, {
			tab: "devices",
			section: "car"
		});
		case "home_office": return $c(e, {
			tab: "household",
			section: "days"
		});
		default: return $c(e, {
			tab: "household",
			section: "people"
		});
	}
}
var tl = {
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
function nl(e, t) {
	return $c(e, tl[t]);
}
function rl(e) {
	let t = e.answers.later;
	return Array.isArray(t) ? t.filter((e) => typeof e == "string") : [];
}
function il(e, t) {
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
		case "hot_water": return !e.actions.some((t) => tt(t, al(e, t)) === "hot_water") && !n(t);
		case "ev": return !e.actions.some((t) => tt(t, al(e, t)) === "car") && !n(t);
		case "home_office": return !r("calendar.default_workday") && !n(t);
		default: return !n(t);
	}
}
function al(e, t) {
	return t.consumer_id ? e.consumers.find((e) => e.id === t.consumer_id) : void 0;
}
//#endregion
//#region src/pages/questions.ts
var ol = {
	tariff: "plan",
	feed_in: "plug",
	capacity: "night-charge",
	heating: "ask",
	climate: "switch",
	hot_water: "hot-water",
	ev: "ev",
	home_office: "plan",
	household: "relax"
}, sl = [
	"climate",
	"heat_pump",
	"electric_heating"
];
function cl(e) {
	let t = [], n = (t) => P(e, t)?.source === "user", r = (t) => e.answers[t] !== void 0 && e.answers[t] !== null, i = e.tariff;
	(i.kind === "unknown" || n("tariff.kind") || r("tariff")) && t.push("tariff"), (i.feed_in_price == null && !i.feed_in_entity || n("tariff.feed_in_price") || r("feed_in")) && t.push("feed_in");
	for (let i of e.batteries) {
		let e = `capacity:${i.id}`;
		(i.capacity_kwh == null && !i.capacity_entity || n(`batteries[${i.id}].capacity_kwh`) || r(e)) && t.push(e);
	}
	return t.push("heating", "climate", "hot_water", "ev", "home_office", "household"), t;
}
var ll = class extends x {
	constructor(...e) {
		super(...e), this.single = "", this.index = 0;
	}
	static {
		this.styles = [d, T`
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
		if (!e || !t) return A;
		if (this.single) return this.renderQuestion(e, t, this.single);
		let n = cl(t), r = Math.min(this.index, n.length - 1), i = n[r], a = r === n.length - 1, s = rl(t), c = Zc(e, {
			back: () => this.move(-1, n.length),
			next: () => this.move(1, n.length),
			nextLabel: e(a ? "ask.finish" : "onb.next")
		});
		return C`${c}
      <div class="wrap">
        <joe-pose name=${ol[i.split(":")[0]] ?? "ask"}></joe-pose>
        <div>
          <nav class="topics" aria-label=${e("ask.topics")} data-notip>
            <span class="eyebrow">${e("ask.count", {
			n: r + 1,
			total: n.length
		})}</span>
            ${n.map((n, i) => C`${i ? C`<ha-icon class="arrow" icon="mdi:chevron-right" aria-hidden="true"></ha-icon>` : A}<button
                type="button"
                class="topic ${i < r ? "done" : ""}"
                aria-current=${i === r ? "step" : "false"}
                @click=${() => this.index = i}
              >
                ${s.includes(n) ? C`<ha-icon icon="mdi:clock-outline" title=${e("ask.later.marked")}></ha-icon>` : i < r ? C`<ha-icon icon="mdi:check"></ha-icon>` : A}${this.topic(e, t, n)}
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
                aria-pressed=${s.includes(i) ? "true" : "false"}
                @click=${() => this.later(i, n.length)}
              >
                <ha-icon icon="mdi:clock-outline"></ha-icon>${e("ask.later")}
              </button>
              ${o(e, "ask_later")}
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
			case "tariff": return this.question(e("q.tariff.title"), "q_tariff", C`<joe-tariff-form
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
			case "climate": return this.question(e("q.climate.title"), "q_climate", C`${this.choice(e, "climate", [{
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
			case "home_office": return this.question(e("q.home_office.title"), "q_home_office", C`${this.choice(e, "home_office", [{
				value: "yes",
				label: e("q.home_office.yes"),
				icon: "mdi:home-account"
			}, {
				value: "no",
				label: e("q.home_office.no"),
				icon: "mdi:office-building-outline"
			}], !1, (e) => e === "yes" || e === "no" ? { calendar: { default_workday: e === "yes" ? "home_office" : "office" } } : {})}
            <p class="hint">${e("q.home_office.hint")}</p>`);
			default: return this.question(e("q.household.title"), "q_household", C`<joe-household
            .hass=${this.hass}
            .t=${e}
            .config=${t}
            .discovery=${this.discovery}
          ></joe-household>`);
		}
	}
	question(e, t, n) {
		let r = this.t;
		return C`<div data-tipped>
      <div class="title-row">${b(e, "h2", o(r, t))}</div>
      ${E}
      <div class="content">${n}</div>
    </div>`;
	}
	choice(e, t, n, r = !1, i) {
		let a = this.config?.answers[t];
		return C`<joe-choice
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
		let n = t.answers.hot_water, r = n === "hot_water_heat_pump" || n === "electric", i = t.consumers.filter((e) => e.kind === "hot_water"), a = t.actions.find((e) => tt(e, al(t, e)) === "hot_water");
		return this.question(e("q.hot_water.title"), "q_hot_water", C`${this.choice(e, "hot_water", [
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
      ${r ? C`<div class="follow">
            <p class="hint">${i.length ? e("q.hot_water.devices") : e("q.hot_water.no_devices")}</p>
            ${i.length ? C`<div class="chips">${i.map((e) => C`<span class="chip learned">${e.name}</span>`)}</div>` : A}
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
              ${o(e, "q_hot_water_action")}
            </div>
          </div>` : A}`);
	}
	renderEv(e, t) {
		let n = this.discovery?.wallboxes.find((e) => e.is_car), r = t.actions.find((e) => tt(e, al(t, e)) === "car");
		return this.question(e("q.ev.title"), "q_ev", C`${this.choice(e, "ev", [{
			value: "yes",
			label: n ? e("q.ev.yes_wallbox", { name: n.name }) : e("q.ev.yes"),
			icon: "mdi:car-electric"
		}, {
			value: "no",
			label: e("q.ev.no"),
			icon: "mdi:car-off"
		}])}
      ${t.answers.ev === "yes" ? C`<div class="follow">
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
              ${o(e, "q_ev_action")}
            </div>
          </div>` : A}`);
	}
	renderHeating(e, t) {
		let n = t.answers.heating, r = Array.isArray(n) ? n : [], i = t.consumers.filter((e) => r.includes(e.kind)), a = r.some((e) => sl.includes(e));
		return this.question(e("q.heating.title"), "q_heating", C`${this.choice(e, "heating", [
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
        ${a && t.consumers.length ? C`<div class="follow">
              <p class="hint">${i.length ? e("q.heating.devices") : e("q.heating.no_devices")}</p>
              ${i.length ? C`<div class="chips">
                    ${i.map((e) => C`<span class="chip learned">${e.name}</span>`)}
                  </div>` : A}
              <div class="with-tip" style="margin-top:10px">
                <button type="button" class="mini-btn" @click=${() => this.edit("consumers")}>
                  <ha-icon icon="mdi:devices"></ha-icon>${e("q.heating.assign")}
                </button>
                ${o(e, "f_consumer_kind")}
              </div>
            </div>` : A}`);
	}
	renderFeedIn(e, t) {
		let n = t.tariff.feed_in_price, r = t.answers.feed_in === na;
		return this.question(e("q.feed_in.title"), "q_feed_in", C`<div class="inline">
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
			answers: { feed_in: na }
		})}
        >
          ${e("ask.idk")}
        </button>
      </div>`);
	}
	renderCapacity(e, t, n) {
		let r = t.batteries.find((e) => e.id === n);
		if (!r) return C``;
		let i = `capacity:${n}`, a = t.answers[i] === na;
		return this.question(e("q.capacity.title", { name: r.name }), "q_capacity", C`<div class="inline">
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
			answers: { [i]: na }
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
		let n = rl(this.config);
		n.includes(e) && (t = {
			...t,
			answers: {
				...t.answers ?? {},
				later: n.filter((t) => t !== e)
			}
		}), I(this, t);
	}
	later(e, t) {
		let n = rl(this.config);
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
s([O({ attribute: !1 })], ll.prototype, "hass", void 0), s([O({ attribute: !1 })], ll.prototype, "t", void 0), s([O({ attribute: !1 })], ll.prototype, "config", void 0), s([O({ attribute: !1 })], ll.prototype, "discovery", void 0), s([O()], ll.prototype, "single", void 0), s([N()], ll.prototype, "index", void 0), j("joe-questions", ll);
//#endregion
//#region src/pages/onboarding.ts
var ul = {
	climate: "q.heating.climate",
	heat_pump: "q.heating.heat_pump",
	electric_heating: "q.heating.electric",
	none: "q.heating.none"
}, dl = class extends x {
	constructor(...e) {
		super(...e), this.step = "welcome", this.checks = [], this.prefix = M, this.discovering = !1, this.discoveryFailed = !1;
	}
	static {
		this.styles = [d, T`
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
		if (!e) return A;
		switch (this.step) {
			case "welcome": return this.layout("welcome", C`${b(e("onb.welcome.title"), "h1")} ${E}
            <p class="lead">${e("onb.welcome.lead")}</p>
            <div class="calm"><span class="pill-sim">${e("mode.simulation")}</span>${e("onb.calm")}</div>
            <details data-notip>
              <summary>${e("onb.welcome.more")}</summary>
              ${e("onb.welcome.more.text").split("\n").map((e) => C`<p>${e}</p>`)}
            </details>
            <div class="actions" data-tipped>
              <button type="button" class="btn btn-primary" @click=${() => this.go("scan")}>
                ${e("onb.welcome.go")}
              </button>
              ${o(e, "scan_start")}
            </div>`);
			case "scan": return this.renderScan(e);
			case "questions": return C`<joe-questions
          .hass=${this.hass}
          .t=${e}
          .config=${this.config}
          .discovery=${this.discovery}
        ></joe-questions>`;
			case "done": return this.renderDone(e);
		}
	}
	renderScan(e) {
		if (this.discovering || !this.discovery && !this.discoveryFailed) return this.layout("scout", C`${b(e("onb.scan.title"))} ${E}
          <p class="lead">${e("onb.scan.lead")}</p>
          ${this.renderEnergy(e)}
          <div class="looking" role="status">${e("scan.looking")}</div>`);
		let t = Zc(e, {
			back: () => this.go("welcome"),
			next: () => this.go("questions"),
			nextLabel: e("onb.next")
		}, !0);
		return C`${t}
      <div class="wrap wide">
        <joe-pose name="scout"></joe-pose>
        <div>
          ${b(e("scan.title"))} ${E}
          <p class="lead">${e("scan.lead")}</p>
          ${this.discoveryFailed ? C`<p class="failed">${e("scan.failed")}</p>` : A}
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
              ${o(e, "rescan")}
            </span>
            <button type="button" class="btn btn-ghost" data-notip @click=${() => this.go("welcome")}>
              ${e("onb.back")}
            </button>
          </div>
        </div>
      </div>`;
	}
	renderDone(e) {
		let t = Zc(e, {
			back: () => this.go("scan"),
			backLabel: e("onb.done.change"),
			next: () => this.complete(),
			nextLabel: e("onb.done.go"),
			nextTip: "start"
		});
		return C`${t}
    ${this.layout("thumbs", C`${b(e("onb.done.title"))} ${E}
        ${this.config ? this.renderSummary(e, this.config) : A}
        <div class="calm"><span class="pill-sim">${e("mode.simulation")}</span>${e("onb.done.lead")}</div>
        <div class="actions">
          <span class="with-tip" data-tipped>
            <button type="button" class="btn btn-primary" @click=${() => this.complete()}>${e("onb.done.go")}</button>
            ${o(e, "start")}
          </span>
          <button type="button" class="btn btn-ghost" data-notip @click=${() => this.go("scan")}>
            ${e("onb.done.change")}
          </button>
        </div>`)}`;
	}
	renderSummary(e, t) {
		let r = this.hass, i = t.batteries.reduce((e, t) => e + (t.capacity_kwh ?? (r ? l(r, t.capacity_entity) : null) ?? 0), 0), a = rl(t), o = (e) => a.includes(e) && il(t, e), s = (n, r) => {
			if (o(n)) return e("sum.later");
			let i = t.answers[n];
			if (i === "unknown") return e("sum.unknown");
			let a = Array.isArray(i) ? i : typeof i == "string" ? [i] : [];
			return a.length ? a.map((t) => e.optional(r[t] ?? "") ?? t).join(", ") : e("sum.open");
		}, c = (n) => {
			let i = t.context[n];
			return i ? r ? f(r, i) : i : e("sum.none");
		}, u = this.discovery?.forecast, d = [
			[
				e("sum.batteries"),
				t.batteries.length ? e("sum.batteries.value", {
					count: t.batteries.length,
					kwh: i ? n(e.lang, i, 1) : "?"
				}) : e("sum.none"),
				nl(e, "battery")
			],
			[
				e("sum.tariff"),
				o("tariff") ? e("sum.later") : t.tariff.kind === "unknown" ? e("sum.unknown") : We(e, t.tariff, !1),
				el(e, "tariff")
			],
			[
				e("sum.feed_in"),
				t.tariff.feed_in_price == null ? t.tariff.feed_in_entity ? e("sum.from_sensor") : o("feed_in") ? e("sum.later") : e("sum.unknown") : `${Ue(e, t.tariff.feed_in_price)} ct`,
				el(e, "feed_in")
			],
			[
				e("sum.forecast"),
				t.forecast.provider ? u ? e("sum.forecast.value", {
					provider: u.provider_name,
					planes: Z(e, u.planes, "word.plane")
				}) : t.forecast.provider : e("sum.none"),
				nl(e, "grid")
			],
			[
				e("sum.heating"),
				s("heating", ul),
				el(e, "heating")
			],
			[
				e("sum.climate"),
				s("climate", {
					yes: "sum.yes",
					no: "sum.no"
				}),
				el(e, "climate")
			],
			[
				e("sum.hot_water"),
				s("hot_water", {
					hot_water_heat_pump: "q.hot_water.heat_pump",
					electric: "q.hot_water.electric",
					heating: "q.hot_water.heating",
					other: "q.hot_water.other"
				}),
				el(e, "hot_water")
			],
			[
				e("sum.ev"),
				s("ev", {
					yes: "q.ev.yes",
					no: "q.ev.no"
				}),
				el(e, "ev")
			],
			[
				e("sum.home_office"),
				s("home_office", {
					yes: "sum.home_office.yes",
					no: "sum.home_office.no"
				}),
				el(e, "home_office")
			],
			[
				e("sum.household"),
				o("household") ? e("sum.later") : e("sum.household.value", {
					persons: Z(e, t.persons.length, "word.person"),
					calendars: Z(e, t.persons.reduce((e, t) => e + t.calendars.length, 0), "word.calendar")
				}),
				el(e, "household")
			],
			[
				e("sum.weather"),
				c("weather_entity"),
				nl(e, "weather")
			],
			[
				e("sum.holiday"),
				c("holiday_entity"),
				nl(e, "holiday")
			]
		];
		return C`<p class="homes-hint">${e("onb.done.homes")}</p>
      <div class="lines">
        ${d.map(([t, n, r]) => C`<div class="line">
            <span class="label">${t}</span><span class="value">${n}</span>
            <span class="home">${e("sum.lives_at")} ${this.homeLink(r)}</span>
          </div>`)}
      </div>`;
	}
	homeLink(e) {
		return C`<a
      href=${k(this.prefix, e.to)}
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
		return C`<div class="wrap">
      <joe-pose name=${e}></joe-pose>
      <div>${t}</div>
    </div>`;
	}
	renderEnergy(e) {
		let t = this.info?.energy;
		if (!t?.configured || !t.sources) return C`<div class="found"><p>${e("onb.scan.energy.none")}</p></div>`;
		let n = [
			Z(e, t.sources.grid ?? 0, "word.grid"),
			Z(e, t.sources.solar ?? 0, "word.solar"),
			Z(e, t.sources.battery ?? 0, "word.battery"),
			Z(e, t.devices ?? 0, "word.device")
		];
		return C`<div class="found">
      <p>${e("onb.scan.energy")}</p>
      <div class="chips">
        ${n.map((e) => C`<span class="chip read"><ha-icon icon="mdi:eye-outline"></ha-icon>${e}</span>`)}
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
				to: e ? ce(e) : void 0
			},
			bubbles: !0,
			composed: !0
		}));
	}
};
s([O()], dl.prototype, "step", void 0), s([O({ attribute: !1 })], dl.prototype, "t", void 0), s([O({ attribute: !1 })], dl.prototype, "info", void 0), s([O({ attribute: !1 })], dl.prototype, "hass", void 0), s([O({ attribute: !1 })], dl.prototype, "config", void 0), s([O({ attribute: !1 })], dl.prototype, "discovery", void 0), s([O({ attribute: !1 })], dl.prototype, "checks", void 0), s([O({ attribute: !1 })], dl.prototype, "prefix", void 0), s([O({ type: Boolean })], dl.prototype, "discovering", void 0), s([O({ type: Boolean })], dl.prototype, "discoveryFailed", void 0), j("joe-onboarding", dl);
//#endregion
//#region src/components/steer-tonight.ts
function fl(e) {
	let t = e?.plan;
	return !!(e?.control && ["advisory", "live"].includes(e.mode) && t?.window && t.kind !== "none" && t.kind !== "unavailable");
}
function pl(e) {
	let t = e?.plan?.window?.start, n = e?.control;
	return !!(fl(e) && e?.mode === "advisory" && t && n?.skip !== t && n?.answer?.night !== t);
}
function ml(e) {
	let t = e.control?.ready ?? {};
	return e.config.batteries.filter((e) => e.adapter !== "none" && t[e.id] && t[e.id] !== "ready");
}
var hl = class extends x {
	constructor(...e) {
		super(...e), this.prefix = M, this.compact = !1, this.hideUntested = !1, this.busy = !1;
	}
	static {
		this.styles = [d, T`
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
		if (!e || !t || !n || !r?.window || !fl(t)) return A;
		let i = r.window.start, a = n.skip === i, s = n.answer?.night === i ? n.answer.yes : null, c, l = A;
		if (t.mode === "advisory" && !a) {
			c = e(s === !0 ? "plan.steer.answered_yes" : s === !1 ? "plan.steer.answered_no" : "plan.steer.advisory");
			let t = s === !0 ? A : C`<button type="button" class="btn btn-primary" ?disabled=${this.busy} @click=${() => this.answer(i, !0)}>
              ${e("plan.steer.yes")}
            </button>`, n = s !== !1 && !this.compact ? C`<button type="button" class="btn btn-secondary" ?disabled=${this.busy} @click=${() => this.answer(i, !1)}>
              ${e("plan.steer.no")}
            </button>` : A;
			l = t === A && n === A ? A : C`${t} ${n}`;
		} else c = e(a ? "plan.steer.skipped" : "plan.steer.live"), l = C`<button type="button" class="btn btn-secondary" ?disabled=${this.busy} @click=${() => this.skip(!a)}>
        ${e(a ? "plan.steer.unskip" : "plan.steer.skip")}
      </button>`;
		return C`<section class="steer" data-tipped>
      <div class="head">${c} ${o(e, "plan_steer")}</div>
      ${this.hideUntested ? A : this.renderUntested(e, t)}
      ${l === A ? A : C`<div class="actions">${l}</div>`}
    </section>`;
	}
	renderUntested(e, t) {
		let n = ml(t);
		if (!n.length) return A;
		let [r, i = ""] = e("plan.steer.untested", { names: "\0" }).split("\0"), a = n.map((e, t) => C`${t ? ", " : ""}${we(this.prefix, {
			tab: "devices",
			section: "battery",
			id: e.id
		}, e.name)}`);
		return C`<div class="note warn">
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
s([O({ attribute: !1 })], hl.prototype, "hass", void 0), s([O({ attribute: !1 })], hl.prototype, "t", void 0), s([O({ attribute: !1 })], hl.prototype, "state", void 0), s([O({ attribute: !1 })], hl.prototype, "prefix", void 0), s([O({
	type: Boolean,
	reflect: !0
})], hl.prototype, "compact", void 0), s([O({ type: Boolean })], hl.prototype, "hideUntested", void 0), s([N()], hl.prototype, "busy", void 0), j("joe-steer-tonight", hl);
//#endregion
//#region src/pages/overview/climate-list.ts
function gl(e) {
	let t = e?.config.climate;
	return t?.enabled ? Object.entries(t.rooms ?? {}).filter(([, e]) => e.enabled).map(([e]) => e) : [];
}
var _l = {
	tab: "devices",
	section: "climate"
}, vl = class extends x {
	constructor(...e) {
		super(...e), this.prefix = M;
	}
	static {
		this.styles = [d, T`
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
		let { t: e, hass: t, state: n } = this, r = gl(n);
		if (!e || !n || !r.length) return A;
		let i = n.config, a = i.climate?.away_after_min ?? 15, s = r.map((r) => {
			let o = this.climateFound?.devices.find((e) => e.entity_id === r), s = i.climate?.rooms[r], c = n.climate?.rooms[r];
			return {
				entity: r,
				name: o?.name ?? (t ? f(t, r) : r),
				area: o?.area ?? it(t, o?.device_id, r) ?? "",
				temps: Xo(e, Yo(t, o, r)),
				profile: o ? Zo(e, o, c, s?.device_profiles ?? {}) : void 0,
				why: Qo(e, c, a)
			};
		});
		s.sort((t, n) => t.area.localeCompare(n.area, e.lang) || t.name.localeCompare(n.name, e.lang));
		let c = !!n.climate?.live;
		return C`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:thermostat"></ha-icon>${e("overview.climate")}</div>
        ${c ? A : C`<span class="chip">${e("overview.climate.would")}</span>`}
        ${o(e, "overview_climate")}
        <a class="mini-btn quiet all" href=${k(this.prefix, _l)} @click=${D(_l)}>${e("overview.climate.all")}</a>
      </div>
      <div class="rooms">
        ${s.map((e) => {
			let t = R({
				group: "climate",
				id: e.entity
			}), n = [e.profile, e.why].filter(Boolean).join(" · ");
			return C`<a class="room" href=${k(this.prefix, t)} @click=${D(t)}>
            <span class="room-text">
              <span class="room-name">${e.area || e.name}${e.area ? C`<small>${e.name}</small>` : A}</span>
              ${e.temps ? C`<span class="room-temp">${e.temps}</span>` : A}
              ${n ? C`<span class="room-why">${n}</span>` : A}
            </span>
            <ha-icon class="go" icon="mdi:chevron-right"></ha-icon>
          </a>`;
		})}
      </div>
    </section>`;
	}
};
s([O({ attribute: !1 })], vl.prototype, "hass", void 0), s([O({ attribute: !1 })], vl.prototype, "t", void 0), s([O({ attribute: !1 })], vl.prototype, "state", void 0), s([O({ attribute: !1 })], vl.prototype, "prefix", void 0), s([O({ attribute: !1 })], vl.prototype, "climateFound", void 0), j("joe-overview-climate", vl);
//#endregion
//#region src/components/day-questions.ts
var yl = {
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
}, bl = class extends x {
	constructor(...e) {
		super(...e), this.questions = [], this.bare = !1, this.failed = !1, this.answered = /* @__PURE__ */ new Set();
	}
	static {
		this.styles = [d, T`
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
		return !e || !t.length ? A : C`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:chat-question-outline"></ha-icon>${e("ask.title")}</div>
        ${o(e, "ask_day")}
      </div>
      <p class="lead">${e("ask.lead")}</p>
      ${t.map((t) => C`<div class="question">
          <p>
            ${e(`ask.${t.kind}`, {
			day: U(e.lang, t.date, "weekday"),
			actual: H(e.lang, t.actual, 1),
			expected: H(e.lang, t.expected, 1)
		})}
          </p>
          <div class="answers" role="group" aria-label=${e("ask.answers")}>
            ${yl[t.kind].map((n) => C`<button
                  type="button"
                  class="mini-btn ${n === "normal" ? "quiet" : ""}"
                  ?disabled=${this.busy === t.date}
                  @click=${() => this.answer(t.date, n)}
                >
                  ${e(`ask.answer.${n}`)}
                </button>`)}
          </div>
        </div>`)}
      ${this.failed ? C`<div class="note warn" role="status"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("error.action")}</div>` : A}
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
s([O({ attribute: !1 })], bl.prototype, "hass", void 0), s([O({ attribute: !1 })], bl.prototype, "t", void 0), s([O({ attribute: !1 })], bl.prototype, "questions", void 0), s([O({
	type: Boolean,
	reflect: !0
})], bl.prototype, "bare", void 0), s([N()], bl.prototype, "busy", void 0), s([N()], bl.prototype, "failed", void 0), s([N()], bl.prototype, "answered", void 0), j("joe-day-questions", bl);
//#endregion
//#region src/pages/overview/inbox.ts
function xl(e, t) {
	let n = e.measurements.solar_power ?? [];
	return n.some((e) => e.entity_id === t && !e.sleeps) ? { measurements: { solar_power: n.map((e) => e.entity_id === t ? {
		...e,
		sleeps: !0
	} : e) } } : null;
}
function Sl(e) {
	return `todo:${e}`;
}
function Cl(e) {
	return e.level === "warn" || e.code === "tariff_unknown" || e.code === "missing" && e.role === "grid_power";
}
function wl(e) {
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
function Tl(e, t, n = {}) {
	let r = t.config, i = t.control, a = n.devices ?? [], o = (t, n, r) => ft(a, t, n)?.name ?? r ?? (t === "grid" ? e("devices.grid.connection") : n), s = (e) => !F(r, Sl(e)), c = [], l = (e) => {
		s(e.id) && c.push({
			...e,
			hide: [e.id]
		});
	}, u = (e) => {
		c.push({
			...e,
			icon: "mdi:alert-outline",
			warn: !0,
			hide: []
		});
	}, d = (e, t, n) => {
		let r = e.filter((e) => s(e.id));
		if (r.length === 1) c.push({
			...r[0].one,
			id: r[0].id,
			hide: [r[0].id]
		});
		else if (r.length > 1) {
			let e = r.map((e) => e.name).join(", ");
			c.push({
				...t(e),
				id: `${n}:${r.map((e) => e.id).join(",")}`,
				hide: r.map((e) => e.id)
			});
		}
	};
	for (let n of r.actions.filter((e) => e.point)) t.cars?.points?.[n.id]?.ask && c.push({
		id: `which_car:${n.id}`,
		hide: [],
		icon: "mdi:car-question",
		title: e("point.ask", { point: n.name }),
		text: e("point.ask.text"),
		to: fe(n.id),
		choices: [...ee(r, n).map((e) => ({
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
		let r = to(n);
		l({
			id: `car_merge:${n.a}|${n.b}`,
			icon: "mdi:call-merge",
			title: eo(e, t, n),
			text: e("car.merge.text"),
			to: h(n.a, "sources"),
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
	for (let n of t.cars?.reminders ?? []) l({
		id: `unplugged:${n.car}:${t.plan?.window?.start ?? ""}`,
		icon: "mdi:power-plug-off-outline",
		title: e("car.reminder", {
			car: n.name,
			km: n.km
		}),
		text: e("car.reminder.text"),
		to: h(n.car)
	});
	for (let t of (n.checks ?? []).filter(Cl)) {
		let n = wl(t), i = String(t.battery_id ?? t.role ?? t.entity_id ?? ""), a = t.can_sleep ? xl(r, String(t.entity_id)) : null;
		u({
			id: `check:${t.code}:${i}`,
			title: o(n.group, n.group === "grid" && n.id === "tariff" ? "connection" : n.id, t.battery),
			text: Ge(e, t),
			to: R(n),
			fix: a ? {
				label: e("solar.sleeps.quick"),
				tip: "solar_sleeps",
				patch: a
			} : void 0
		});
	}
	let f = (t) => e.optional(`devices.problem.${t}`) ?? t;
	for (let e of r.batteries.filter((e) => e.adapter !== "none")) {
		let t = i?.batteries[e.id]?.problem ?? (i?.ready[e.id] === "controls_missing" ? "controls_missing" : null);
		t && u({
			id: `problem:battery:${e.id}:${t}`,
			title: e.name,
			text: f(t),
			to: R({
				group: "battery",
				id: e.id
			})
		});
	}
	let p = vi(t), m = Ei(e, p);
	m.length && u({
		id: `surplus:evcc:${(p?.conflicts ?? []).map((e) => e.code).join(",")}`,
		title: e("surplus.conflict.title"),
		text: m.join(" "),
		to: {
			tab: "devices",
			section: "battery"
		}
	});
	let g = Ei(e, p, !0);
	g.length && u({
		id: `surplus:device:${(p?.conflicts ?? []).map((e) => e.code).join(",")}`,
		title: e("surplus.device_conflict.title"),
		text: g.join(" "),
		to: {
			tab: "devices",
			section: "battery"
		}
	});
	for (let [t, n] of Object.entries(p?.batteries ?? {})) n.state === "automation" && u({
		id: `surplus:automation:${t}`,
		title: n.name,
		text: e("overview.todo.surplus_automation", { names: (n.automations ?? []).map((e) => `„${e}“`).join(", ") }),
		to: {
			tab: "devices",
			section: "battery",
			id: t,
			sub: "intruders"
		}
	});
	let _ = Fi(t), v = {
		tab: "devices",
		section: "battery",
		id: "together"
	}, te = Ki(t), y = Zi(e, te, r);
	y && te?.last && u({
		id: `guard:alarm:${te.last.since ?? te.last.at}`,
		title: e("guard.alarm.title"),
		text: y,
		to: v
	});
	let ne = Qi(e, te, r);
	if (ne && te?.last && u({
		id: `guard:inside:${te.last.since ?? te.last.at}`,
		title: e("guard.inside.title"),
		text: ne,
		to: v
	}), _?.group_question && l({
		id: "team:groups",
		icon: "mdi:help-circle-outline",
		title: e("team.groups.question"),
		text: e("team.groups.question.text", { names: ea(r, _) }),
		to: v,
		fix: {
			label: e("team.groups.confirm"),
			tip: "team_groups_confirm",
			patch: $i(r, _)
		}
	}), _?.state === "automation" && l({
		id: "team:automations",
		icon: "mdi:robot-confused-outline",
		title: e("team.title"),
		text: e("team.automations", { names: _.automations.map((e) => `„${e}“`).join(", ") }),
		to: v
	}), _?.proposal && l({
		id: "team:proposal",
		icon: "mdi:battery-sync-outline",
		title: e("overview.todo.team"),
		text: e("overview.todo.team.text"),
		to: v,
		fix: {
			label: e("team.mode.sequence"),
			tip: "team_mode",
			patch: { rules: { battery_team: "sequence" } }
		}
	}), r.rules.day_surplus) for (let t of r.batteries) {
		let r = p?.batteries?.[t.id]?.state;
		(r ? r === "need_ref" : yi(n.hass, t) === "need_ref") && t.day_surplus !== !1 && t.adapter !== "none" && l({
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
	for (let [t, n] of Object.entries(p?.batteries ?? {})) n.problem && u({
		id: `problem:surplus:${t}:${n.problem}`,
		title: n.name,
		text: `${e("surplus.problem")} ${f(n.problem)}`,
		to: R({
			group: "battery",
			id: t
		})
	});
	for (let e of r.actions) {
		let t = i?.actions?.[e.id]?.problem;
		if (t) {
			let n = nt(r, e);
			u({
				id: `problem:${n.group}:${e.id}:${t}`,
				title: o(n.group, n.id, e.name),
				text: f(t),
				to: R(n)
			});
		}
	}
	let re = r.climate?.enabled ? r.climate.rooms ?? {} : {};
	for (let [n, r] of Object.entries(re)) {
		let i = r.enabled ? t.climate?.rooms[n]?.error : null;
		i && u({
			id: `problem:climate:${n}:${i}`,
			title: o("climate", n, n),
			text: e.optional(`week.error.${i}`) ?? e("week.error", { error: i }),
			to: R({
				group: "climate",
				id: n
			})
		});
	}
	d(r.batteries.filter((e) => e.adapter !== "none" && ["not_tested", "outdated"].includes(i?.ready[e.id] ?? "")).map((t) => ({
		id: `test:${t.id}`,
		name: t.name,
		one: {
			icon: "mdi:test-tube",
			title: e("overview.todo.test", { name: t.name }),
			text: e(i?.ready[t.id] === "outdated" ? "overview.todo.test.outdated" : "overview.todo.test.text"),
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
	}), "test"), r.notify?.service || l({
		id: "notify",
		icon: "mdi:bell-outline",
		title: e("overview.todo.notify"),
		text: e("overview.todo.notify.text"),
		to: {
			tab: "settings",
			section: "notify"
		}
	});
	let b = n.climateFound?.devices.length ?? 0, ie = !!(r.climate?.enabled && Object.values(r.climate.rooms ?? {}).some((e) => e.enabled));
	b && !ie && l({
		id: "climate",
		icon: "mdi:thermostat",
		title: e("overview.todo.climate"),
		text: e("overview.todo.climate.text"),
		to: {
			tab: "devices",
			section: "climate"
		}
	});
	let ae = a.filter((e) => e.group === "car" && (e.car && !e.car.need.enabled || e.setup));
	for (let [t, n] of [[!1, "car"], [!0, "car_setup"]]) d(ae.filter((e) => !!e.setup === t).map((n) => ({
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
	let oe = new Set(c.map((e) => ce(e.to)));
	for (let t of rl(r).filter((e) => il(r, e))) {
		let n = el(e, t);
		if (oe.has(ce(n.to))) continue;
		oe.add(ce(n.to));
		let i = t.startsWith("capacity:") ? r.batteries.find((e) => `capacity:${e.id}` === t) : void 0;
		l({
			id: `later:${t}`,
			icon: "mdi:clock-outline",
			title: e("overview.todo.later", { topic: i?.name ?? e.optional(`ask.topic.${t}`) ?? t }),
			text: e("overview.todo.later.text", { place: n.place }),
			to: n.to
		});
	}
	let se = ht(r, n.discovery).filter((e) => s(`new:${e.key}`));
	return se.length && c.push({
		id: `new:${se.map((e) => e.key).join(",")}`,
		hide: se.map((e) => `new:${e.key}`),
		icon: "mdi:new-box",
		title: e("overview.todo.new", { names: se.map((e) => e.name).join(", ") }),
		text: e("overview.todo.new.text"),
		to: {
			tab: "devices",
			section: "all"
		}
	}), c;
}
var El = 3, Dl = class extends x {
	constructor(...e) {
		super(...e), this.prefix = M, this.items = [], this.steer = !1, this.all = !1, this.asking = !1, this.fixing = /* @__PURE__ */ new Set(), this.dismissed = /* @__PURE__ */ new Set(), this.hiding = [];
	}
	static {
		this.styles = [d, T`
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
    `];
	}
	willUpdate(e) {
		if (e.has("items")) {
			let e = new Set(this.items.map((e) => e.id)), t = [...this.dismissed].filter((t) => !/^(which_car|car_merge):/.test(t) || e.has(t));
			t.length !== this.dismissed.size && (this.dismissed = new Set(t));
		}
	}
	render() {
		let e = this.t, t = this.state;
		if (!e || !t) return A;
		let n = t.questions ?? [], r = this.items.filter((e) => !this.dismissed.has(e.id));
		if (!r.length && !n.length && !this.steer) return A;
		let i = this.all ? r : r.slice(0, El), a = r.length - i.length, s = r.some((e) => e.id.startsWith("test:"));
		return C`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:bell-ring-outline"></ha-icon>${e("overview.inbox")}</div>
        <span class="chip warn">${e("overview.inbox.count", { count: r.length + n.length + +!!this.steer })}</span>
        ${o(e, "inbox")}
      </div>
      <ul>
        ${this.steer ? C`<li class="steer">
              <span class="todo-icon"><ha-icon icon="mdi:weather-night"></ha-icon></span>
              <joe-steer-tonight
                compact
                .hideUntested=${s}
                .t=${e}
                .hass=${this.hass}
                .state=${t}
                .prefix=${this.prefix}
              ></joe-steer-tonight>
            </li>` : A}
        ${i.map((t) => this.renderItem(e, t))}
        ${n.length ? this.renderAsk(e, n.length) : A}
      </ul>
      ${a > 0 || this.all && r.length > El ? C`<div class="more-row" data-notip>
            <button type="button" class="mini-btn quiet" aria-expanded=${this.all ? "true" : "false"} @click=${() => this.all = !this.all}>
              <ha-icon icon=${this.all ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
              ${this.all ? e("overview.inbox.less") : e("overview.inbox.more", { count: a })}
            </button>
          </div>` : A}
      ${n.length && this.asking ? C`<joe-day-questions bare .hass=${this.hass} .t=${e} .questions=${n}></joe-day-questions>` : A}
    </section>`;
	}
	renderItem(e, t) {
		return C`<li class=${t.warn ? "warn" : ""}>
      <a class="todo-main" href=${k(this.prefix, t.to)} @click=${D(t.to)}>
        <span class="todo-icon"><ha-icon icon=${t.icon}></ha-icon></span>
        <span class="todo-text">
          <b>${t.title}</b>
          ${t.text ? C`<small>${t.text}</small>` : A}
        </span>
        <ha-icon class="go" icon="mdi:chevron-right"></ha-icon>
      </a>
      ${t.choices?.length ? C`<span class="todo-actions choices" data-tipped role="group" aria-label=${t.title}>
            ${t.choices.map((e) => C`<button
                type="button"
                class="mini-btn"
                ?disabled=${this.fixing.has(t.id)}
                @click=${() => this.choose(t, e.message)}
              >
                ${e.label}
              </button>`)}
            ${t.choicesTip ? o(e, t.choicesTip) : A}
          </span>` : A}
      ${t.fix ? C`<span class="todo-actions" data-tipped>
            <button type="button" class="mini-btn" ?disabled=${this.fixing.has(t.id)} @click=${() => this.applyFix(t)}>
              ${t.fix.label}
            </button>
            ${o(e, t.fix.tip)}
          </span>` : A}
      ${t.hide.length ? C`<span class="todo-actions" data-tipped>
            <button type="button" class="mini-btn quiet" @click=${() => this.dismiss(t)}>${e("overview.todo.dismiss")}</button>
            ${o(e, "todo_dismiss")}
          </span>` : A}
    </li>`;
	}
	renderAsk(e, t) {
		return C`<li class="ask" data-notip>
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
		try {
			await this.hass?.callWS(t);
		} catch {
			n = !1;
		}
		let r = new Set(this.fixing);
		r.delete(e.id), this.fixing = r, n && (this.dismissed = /* @__PURE__ */ new Set([...this.dismissed, e.id]));
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
		for (let e of this.hiding) n.includes(Sl(e)) || n.push(Sl(e));
		if (!await I(this, { answers: { ignored: n } })) {
			let t = new Set(this.dismissed);
			t.delete(e.id), this.dismissed = t, this.hiding = this.hiding.filter((t) => !e.hide.includes(t));
		}
	}
};
s([O({ attribute: !1 })], Dl.prototype, "hass", void 0), s([O({ attribute: !1 })], Dl.prototype, "t", void 0), s([O({ attribute: !1 })], Dl.prototype, "state", void 0), s([O({ attribute: !1 })], Dl.prototype, "prefix", void 0), s([O({ attribute: !1 })], Dl.prototype, "items", void 0), s([O({ type: Boolean })], Dl.prototype, "steer", void 0), s([N()], Dl.prototype, "all", void 0), s([N()], Dl.prototype, "asking", void 0), s([N()], Dl.prototype, "fixing", void 0), s([N()], Dl.prototype, "dismissed", void 0), j("joe-overview-inbox", Dl);
//#endregion
//#region src/pages/overview/quick.ts
function Ol(e) {
	return e.config.cars ?? [];
}
function kl(e) {
	let { guest_switch: t, guest_tracker: n } = e.config.context;
	return t && n ? t : void 0;
}
function Al(e) {
	return !!(e && (Ol(e).length || kl(e)));
}
var jl = class extends x {
	constructor(...e) {
		super(...e), this.prefix = M;
	}
	static {
		this.styles = [d, T`
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
		if (!e || !t || !n || !Al(n)) return A;
		let r = kl(n), i = r ? t.states[r]?.state === "on" : !1, a = n.config.context.guest_tracker;
		return C`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:lightning-bolt-outline"></ha-icon>${e("overview.quick")}</div>
        ${o(e, "quick")}
      </div>
      ${Ol(n).map((r) => {
			let i = h(r.id);
			return C`<div class="item">
          <a class="name" href=${k(this.prefix, i)} @click=${D(i)}>
            <ha-icon icon="mdi:car-electric"></ha-icon>${r.name}
          </a>
          <joe-car-charge flush .hass=${t} .t=${e} .state=${n} .car=${r}></joe-car-charge>
        </div>`;
		})}
      ${r ? C`<div class="item guest" data-tipped>
            <button
              type="button"
              class="switch"
              role="switch"
              aria-checked=${String(i)}
              aria-labelledby="quick-guest"
              @click=${() => fc(t, r)}
            ></button>
            <b id="quick-guest">${e("household.guest")}</b>
            ${o(e, "household_guest")}
            <small>${e(a && t.states[a]?.state === "home" ? "household.guest.home" : "household.guest.away")}</small>
          </div>` : A}
    </section>`;
	}
};
s([O({ attribute: !1 })], jl.prototype, "hass", void 0), s([O({ attribute: !1 })], jl.prototype, "t", void 0), s([O({ attribute: !1 })], jl.prototype, "state", void 0), s([O({ attribute: !1 })], jl.prototype, "prefix", void 0), j("joe-overview-quick", jl);
//#endregion
//#region src/pages/overview.ts
var Ml = { tab: "plan" }, Nl = {
	tab: "review",
	section: "days"
}, Pl = {
	tab: "review",
	section: "result"
}, Fl = {
	tab: "household",
	section: "presence"
}, Il = class extends x {
	constructor(...e) {
		super(...e), this.prefix = M, this.checks = [], this.devices = [];
	}
	static {
		this.styles = [d, T`
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
		if (!e || !t) return A;
		let n = Tl(e, t, {
			hass: this.hass,
			climateFound: this.climateFound,
			discovery: this.discovery,
			checks: this.checks,
			devices: this.devices
		}), r = pl(t), i = r || n.length > 0 || (t.questions?.length ?? 0) > 0, a = n.some((e) => e.id.startsWith("test:")), o = Al(t), s = gl(t).length > 0, c = this.renderWho(e, t), l = (e) => e ? "" : "wide";
		return C`<div class="grid">
      ${this.renderNow(e, t)}
      ${i ? C`<joe-overview-inbox
            class="wide"
            .t=${e}
            .hass=${this.hass}
            .state=${t}
            .prefix=${this.prefix}
            .items=${n}
            .steer=${r}
          ></joe-overview-inbox>` : A}
      ${this.renderNight(e, t, l(o), !r, a)}
      ${o ? C`<joe-overview-quick .t=${e} .hass=${this.hass} .state=${t} .prefix=${this.prefix}></joe-overview-quick>` : A}
      ${s ? C`<joe-overview-climate
            class="wide"
            .t=${e}
            .hass=${this.hass}
            .state=${t}
            .prefix=${this.prefix}
            .climateFound=${this.climateFound}
          ></joe-overview-climate>` : A}
      ${c ? this.line(Fl, "mdi:home-account", e("overview.who"), c, "", "") : A}
      ${this.renderResult(e, t, l(!!c))} ${this.renderWeek(e)}
    </div>`;
	}
	renderNow(e, t) {
		let r = this.hass, i = t.config;
		if (!r) return C``;
		let a = i.measurements, s = a.solar_power.length ? re(r, a.solar_power) : null, l = c(r, a.grid_power), u = i.batteries.map((e) => ({
			power: c(r, e.power),
			soc: y(r, e.soc_entity)
		})), d = u.filter((e) => e.power != null), f = d.length ? d.reduce((e, t) => e + (t.power ?? 0), 0) : null, p = c(r, a.home_power), m = p == null && l != null;
		m && (p = (l ?? 0) + (s ?? 0) - (f ?? 0));
		let h = u.map((e) => e.soc).filter((e) => e != null), g = (t) => t == null ? "–" : n(e.lang, Math.abs(t), 2), _ = (e, t, n, r, i) => C`<div class="flow ${e}">
        <span class="icon"><ha-icon icon=${t}></ha-icon></span>
        <small>${n}</small>
        <b>${g(r)}<span>kW</span></b>
        <em>${i}</em>
      </div>`, v = (e) => e == null || Math.abs(e) < .05;
		return C`<section class="card wide" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:pulse"></ha-icon>${e("overview.now")}</div>
        ${o(e, "now")}
      </div>
      <div class="now">
        ${_("sun", "mdi:solar-power", e("overview.now.solar"), s, e(s == null ? "overview.now.none" : "overview.now.solar.sub"))}
        ${_("home", "mdi:home-lightning-bolt-outline", e("overview.now.home"), p, e(p == null ? "overview.now.none" : m ? "overview.now.home.calc" : "overview.now.home.sub"))}
        ${_("battery", "mdi:home-battery-outline", v(f) ? e("overview.now.battery") : e(f > 0 ? "overview.now.battery.charge" : "overview.now.battery.discharge"), f, h.length ? h.length === 1 ? e("overview.now.soc", { value: n(e.lang, h[0], 0) }) : e("overview.now.soc_avg", {
			value: n(e.lang, h.reduce((e, t) => e + t, 0) / h.length, 0),
			count: h.length
		}) : i.batteries.length ? e("overview.now.none") : e("overview.now.no_battery"))}
        ${_("net", "mdi:transmission-tower", v(l) ? e("overview.now.grid") : e(l > 0 ? "overview.now.grid.in" : "overview.now.grid.out"), l, l == null ? e("overview.now.none") : v(l) ? e("overview.now.grid.idle") : e(l > 0 ? "overview.now.grid.in.sub" : "overview.now.grid.out.sub"))}
      </div>
      ${this.renderDoing(e, t)}
    </section>`;
	}
	renderDoing(e, t) {
		let n = t.control, r = this.doingLines(e, t);
		return !n && !r.length ? A : C`<div class="doing">
      <div class="eyebrow"><ha-icon icon="mdi:robot-outline"></ha-icon>${e("overview.doing")}</div>
      ${n ? C`<p class="doing-text">${Oi(e, t)}</p>` : A}
      ${r.length ? C`<ul>${r.map((e) => C`<li>${e}</li>`)}</ul>` : A}
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
				"defer"
			].includes(r) && i.push(e("overview.doing.battery", {
				name: t.name,
				what: Ba(e, t, n)
			}));
		}
		let a = wi(e, vi(t));
		a && i.push(a);
		let o = Gi(e, Fi(t));
		o && i.push(o);
		for (let t of r.actions) {
			let r = n?.actions?.[t.id];
			r?.on && i.push(e("overview.doing.action", {
				name: t.name,
				time: S(r.end)
			}));
		}
		let s = t.climate;
		if (s?.live) {
			let n = gl(t).map((e) => ({
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
	renderNight(e, t, r, i, a) {
		let s = t.plan;
		if (!s) return C`<section class="card ${r}">
        <joe-pose name="relax"></joe-pose>
        <div class="eyebrow"><ha-icon icon="mdi:weather-night"></ha-icon>${e("overview.night")}</div>
        ${b(e("overview.night.empty.title"))} ${E}
        <p class="lead">${e("overview.night.empty.text")}</p>
      </section>`;
		let c = le(e, s), l = ue(e, s, this.hass?.config?.currency), u = s.kind === "charge" || s.kind === "hold" ? C`${n(e.lang, s.target ?? 0, 0)}<small>%</small>` : C`${e(s.kind === "none" ? "plan.big.none" : "plan.big.unavailable")}`;
		return C`<section class="card figure-card ${r}" data-tipped>
      <joe-pose name=${oe(s)}></joe-pose>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:weather-night"></ha-icon>${e("overview.night")}</div>
        ${o(e, "plan_target")}
      </div>
      ${s.window ? C`<p class="when">${Oe(e, s)}</p>` : A}
      <div class="big">${u}</div>
      ${E}
      <p class="say">${Ee(e, s)}</p>
      ${c.length ? C`<div class="lines">${c.map((e) => C`<div>${e}</div>`)}</div>` : A}
      ${l ? C`<p class="cost">${l}</p>` : A}
      ${i && fl(t) ? C`<joe-steer-tonight
            compact
            .hideUntested=${a}
            .t=${e}
            .hass=${this.hass}
            .state=${t}
            .prefix=${this.prefix}
          ></joe-steer-tonight>` : A}
      <div class="bottom">
        <span class="chip ${s.fixed ? "ok" : ""}">
          ${s.fixed ? e("plan.fixed_at", { time: s.created.slice(11, 16) }) : e("plan.preview_at", { time: s.created.slice(11, 16) })}
        </span>
        <a class="btn btn-secondary stretch" href=${k(this.prefix, Ml)} @click=${D(Ml)}>${e("overview.night.more")}</a>
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
		return C`<a class="card line ${a}" href=${k(this.prefix, e)} @click=${D(e)}>
      <ha-icon icon=${t}></ha-icon>
      <span class="line-text">
        <span class="eyebrow">${n}</span>
        <b class=${i}>${r}</b>
        ${o ? C`<small>${o}</small>` : A}
      </span>
      <ha-icon class="go" icon="mdi:chevron-right"></ha-icon>
    </a>`;
	}
	renderResult(e, t, n) {
		let r = t.results, i = r?.last, a = e("overview.result");
		if (!r || !i) return this.line(Pl, "mdi:calculator-variant-outline", a, e("overview.result.none"), "", n);
		let o = this.hass?.config?.currency, s = i.window?.end.slice(0, 10) ?? i.date, c = s === On(this.hass?.config?.time_zone) ? e("overview.result.last") : e("overview.result.night", { day: U(e.lang, s, "weekday") }), l = i.saving, u = l > .005 ? "good" : l < -.005 ? "bad" : "", d = u === "good" ? e("overview.result.saved", {
			night: c,
			value: En(e, l, o)
		}) : u === "bad" ? e("overview.result.cost", {
			night: c,
			value: En(e, -l, o)
		}) : e("overview.result.same", { night: c }), f = r.since ?? r.first, p = e("overview.result.total", {
			since: f ? U(e.lang, f) : "–",
			value: En(e, r.saving, o, !0),
			nights: kn(e, r.days)
		}), m = !i.final && i.until ? ` · ${e("overview.result.provisional", { time: i.until.slice(11, 16) })}` : "";
		return this.line(Pl, "mdi:calculator-variant-outline", a, d, u, n, `${p}${m}`);
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
		}).format(/* @__PURE__ */ new Date(`${t.date}T12:00:00Z`))), s = new Map(t.map((t, n) => [n, new Intl.DateTimeFormat(e.lang, {
			weekday: "short",
			timeZone: "UTC"
		}).format(/* @__PURE__ */ new Date(`${t.date}T12:00:00Z`))]));
		return C`<section class="card wide" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:chart-bar"></ha-icon>${e("overview.week")}</div>
        ${o(e, "week")}
      </div>
      <p class="status">${r}</p>
      ${t.length ? C`<joe-chart
            .labels=${a}
            .ticks=${s}
            .series=${i}
            centerTicks
            unit="kWh"
            height="120"
            lang=${e.lang}
            label=${e("overview.week")}
          ></joe-chart>` : A}
      <div class="bottom">
        ${t.length ? C`<div class="legend">
              ${i.map((e) => C`<span><i style="background:${e.color}"></i>${e.label}</span>`)}
            </div>` : C`<span></span>`}
        <a class="btn btn-secondary stretch" href=${k(this.prefix, Nl)} @click=${D(Nl)}>${e("overview.week.more")}</a>
      </div>
    </section>`;
	}
};
s([O({ attribute: !1 })], Il.prototype, "t", void 0), s([O({ attribute: !1 })], Il.prototype, "hass", void 0), s([O({ attribute: !1 })], Il.prototype, "state", void 0), s([O({ attribute: !1 })], Il.prototype, "prefix", void 0), s([O({ attribute: !1 })], Il.prototype, "route", void 0), s([O({ attribute: !1 })], Il.prototype, "climateFound", void 0), s([O({ attribute: !1 })], Il.prototype, "discovery", void 0), s([O({ attribute: !1 })], Il.prototype, "checks", void 0), s([O({ attribute: !1 })], Il.prototype, "devices", void 0), s([N()], Il.prototype, "week", void 0), j("joe-overview", Il);
//#endregion
//#region src/pages/plan.ts
var Ll = 36e5, Rl = {
	tab: "devices",
	section: "grid",
	id: "solar"
}, zl = {
	tab: "devices",
	section: "grid",
	id: "tariff"
}, Bl = class extends x {
	constructor(...e) {
		super(...e), this.prefix = M, this.devices = [], this.refreshing = !1;
	}
	static {
		this.styles = [d, T`
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
		if (!e) return A;
		let t = this.state?.plan;
		if (!t || t.kind === "unavailable" || !t.hours) return this.renderEmpty(e, t);
		let r = ue(e, t, this.hass?.config?.currency);
		return C`<div class="wrap">
      <div class="eyebrow"><ha-icon icon="mdi:weather-night"></ha-icon>${e("overview.night")} · ${Oe(e, t)}</div>
      ${b(e("plan.page.title"))} ${E}
      <div class="top" data-tipped>
        ${this.state?.mode === "simulation" ? C`<span class="pill-sim">${e("mode.simulation")}</span>` : C`<span class="chip ${this.state?.mode === "live" ? "ok" : "learned"}">${e(`mode.${this.state?.mode ?? "off"}`)}</span>`}
        <span class="chip ${t.fixed ? "ok" : ""}">
          ${t.fixed ? e("plan.fixed_at", { time: t.created.slice(11, 16) }) : e("plan.preview_at", { time: t.created.slice(11, 16) })}
        </span>
        <button type="button" class="mini-btn" ?disabled=${this.refreshing || t.fixed} @click=${this.refresh}>
          <ha-icon icon="mdi:refresh"></ha-icon>${e("plan.refresh")}
        </button>
        ${o(e, "plan_refresh")}
      </div>
      <section class="hero" data-tipped>
        <joe-pose name=${oe(t)}></joe-pose>
        <div class="big">
          ${t.kind === "none" ? e("plan.big.none") : C`${n(e.lang, t.target ?? 0, 0)}<small>%</small>`}
        </div>
        <p class="say">${Ee(e, t)} ${o(e, "plan_target")}</p>
        ${r ? C`<p class="cost">${r}</p>` : A}
      </section>
      <joe-steer-tonight .t=${e} .hass=${this.hass} .state=${this.state} .prefix=${this.prefix}></joe-steer-tonight>
      ${this.renderDaySurplus(e)} ${this.renderTonight(e, t)} ${this.renderEnergy(e, t, t.hours)}
      ${this.renderPrices(e, t, t.hours)} ${this.renderSoc(e, t, t.hours)}
      ${this.renderMath(e, t)}
    </div>`;
	}
	renderTonight(e, t) {
		let n = t.batteries ?? [], r = t.actions ?? [], i = Object.values(t.cars ?? {}).filter((e) => !r.some((t) => t.car === e.car && t.plugged === "car"));
		return !n.length && !r.length && !i.length ? A : C`<section class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.tonight")} ${o(e, "plan_actions")}</div>
      <ul class="tonight">
        ${n.map((n) => this.batteryRow(e, t, n))} ${r.map((n) => this.actionRow(e, t, n))}
        ${i.map((t) => this.awayRow(e, t))}
      </ul>
    </section>`;
	}
	renderDaySurplus(e) {
		let t = vi(this.state), r = Fi(this.state), i = r && r.mode === "sequence";
		if ((!t || t.state === "off") && !i) return A;
		let a = Object.values(t?.batteries ?? {}).filter((e) => e.cap_kw != null), s = a.length > 1 ? a.map((t) => e("plan.day_surplus.battery", {
			name: t.name,
			kw: n(e.lang, t.cap_kw ?? 0, 1)
		})).join(" · ") : "";
		return C`<section class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.day_surplus")} ${o(e, "plan_day_surplus")}</div>
      <ul class="tonight">
        ${t && t.state !== "off" ? this.tonightRow(e, {
			icon: "mdi:solar-power-variant-outline",
			name: e("rule.day_surplus"),
			text: Si(e, t),
			extra: [Ci(e, t), s].filter(Boolean).join(" · "),
			to: {
				tab: "settings",
				section: "rules",
				id: "day_surplus"
			}
		}) : A}
        ${i ? this.tonightRow(e, {
			icon: "mdi:battery-sync-outline",
			name: e("team.title"),
			text: Wi(e, r),
			extra: r.parallel ? e("team.parallel") : "",
			to: {
				tab: "devices",
				section: "battery",
				id: "together"
			}
		}) : A}
      </ul>
    </section>`;
	}
	tonightRow(e, t) {
		return C`<li>
      <ha-icon icon=${t.icon}></ha-icon>
      <div class="what">
        <b>${t.name}</b>
        <span>${t.text}</span>
        ${t.extra ? C`<small>${t.extra}</small>` : A}
      </div>
      <a class="mini-btn go mirror-go" href=${k(this.prefix, t.to)} @click=${D(t.to)}>${e("mirror.change")}</a>
      ${t.more ? C`<div class="more">${t.more}</div>` : A}
    </li>`;
	}
	batteryRow(e, t, r) {
		let i = ft(this.devices, "battery", r.id), a = (t) => n(e.lang, t, 0), o = S(t.charge_slots?.[0]?.start ?? t.charge_from), s, c = "";
		return t.kind === "charge" && r.charge_kwh >= .05 ? (s = e(o ? "plan.tonight.charge" : "plan.tonight.charge_any", {
			time: o,
			from: a(r.soc_start),
			target: a(r.target)
		}), c = e("plan.tonight.charge.energy", {
			kwh: n(e.lang, r.charge_kwh, 1),
			kw: n(e.lang, r.power_kw, 1)
		})) : s = t.kind === "hold" ? e("plan.tonight.hold", { target: a(r.target) }) : e("plan.tonight.idle", { soc: a(r.soc) }), r.controllable || (c = [c, e("plan.line.watch_only")].filter(Boolean).join(" · ")), this.tonightRow(e, {
			icon: i?.icon ?? Qe.battery,
			name: r.name,
			text: s,
			extra: c,
			to: i ? R(i) : {
				tab: "devices",
				section: "battery"
			}
		});
	}
	actionRow(e, t, i) {
		let a = this.hass?.config?.currency ?? "EUR", o = (t) => new Intl.NumberFormat(e.lang, {
			style: "currency",
			currency: a
		}).format(t), s = i.target == null ? "" : n(e.lang, i.target, 0), c = i.run ? i.kind === "target" ? e("plan.actions.target", {
			start: S(i.start),
			end: S(i.end),
			target: s
		}) : e("plan.actions.run", {
			start: S(i.start),
			end: S(i.end)
		}) : e.optional(`devices.action.why.${i.reasons[i.reasons.length - 1] ?? "manual_only"}`, {
			kwh: n(e.lang, t.meta?.tomorrow_kwh ?? 0, 0),
			temperature: n(e.lang, i.temperature ?? 0, 0)
		}) ?? "", l = i.run && i.energy_kwh ? e("plan.actions.energy", {
			kwh: n(e.lang, i.energy_kwh, 1),
			cost: o(i.cost ?? 0)
		}) : "", u = this.state?.config, d = u?.actions.find((e) => e.id === i.id), f = u && d ? nt(u, d) : void 0, p = f ? ft(this.devices, f.group, f.id) : void 0, m = f?.group ?? (i.need || i.plugged ? "car" : i.kind === "target" ? "hot_water" : "other"), g = i.plugged === "car" && u ? r(u, i.car) : void 0;
		return this.tonightRow(e, {
			icon: g ? Qe.car : p?.icon ?? Qe[m],
			name: g ? e("plan.car_at", {
				car: g.name,
				point: i.name
			}) : i.name,
			text: c,
			extra: l,
			to: g ? h(g.id) : p ? R(p) : f ? R(f) : {
				tab: "devices",
				section: m
			},
			more: i.need ? C`<joe-car-need .hass=${this.hass} .t=${e} .action=${i} .roundTrip=${g?.need.round_trip ?? !0}></joe-car-need>` : void 0
		});
	}
	awayRow(e, t) {
		let n = this.state ? r(this.state.config, t.car) : void 0, i = {
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
		}, a = t.missing_kwh ?? 0;
		return this.tonightRow(e, {
			icon: Qe.car,
			name: t.name,
			text: e(a >= .2 ? "plan.car_away.missing" : "plan.car_away.enough"),
			to: h(t.car),
			more: C`<joe-car-need .hass=${this.hass} .t=${e} .action=${i} .roundTrip=${n?.need.round_trip ?? !0}></joe-car-need>`
		});
	}
	renderEmpty(e, t) {
		let n = t ? Ee(e, t) : e(this.state?.mode === "off" ? "plan.empty.off" : "plan.empty.waiting");
		return C`<div class="empty">
      <joe-pose name=${t ? oe(t) : "plan"}></joe-pose>
      <div>
        ${b(e("plan.title"))} ${E}
        <p class="lead">${n}</p>
      </div>
    </div>`;
	}
	frame(e, t, n) {
		let r = (e) => `${String((Number(e.slice(0, 2)) + 1) % 24).padStart(2, "0")}:00`, i = n.map((e, t) => `${S(e.start)}–${S(n[t + 1]?.start) || r(S(e.start))}`), a = /* @__PURE__ */ new Map();
		n.forEach((t, n) => {
			let r = S(t.start);
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
					if (t >= r && t < r + Ll) return e + (t - r) / Ll;
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
		let a = [], s = r.at(t.sun_takes_over);
		if (s != null) {
			let n = S(t.sun_takes_over);
			a.push({
				at: s,
				label: e("plan.chart.sun", { time: n }),
				short: `↑${n}`
			});
		}
		return C`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.chart.energy")} ${o(e, "chart_plan_energy")}</div>
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
        ${i.map((e) => C`<span><i style="background:${e.color}"></i>${e.label}</span>`)}
      </div>
    </div>`;
	}
	renderPrices(e, t, n) {
		if (!n.some((e) => e.price != null)) return A;
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
				label: e("plan.chart.charge_at", { time: S(t.start) }),
				short: S(t.start)
			}];
		});
		return C`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.chart.prices")} ${o(e, "chart_plan_prices")}</div>
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
      ${t.charge_slots?.length ? C`<p class="slots">${e("plan.slots", { slots: ke(t) })}</p>` : A}
    </div>`;
	}
	renderSoc(e, t, r) {
		let i = this.frame(e, t, r), a = t.rules?.reserve ?? 10, s = [
			{
				label: e("plan.chart.plan"),
				kind: "line",
				values: r.map((e) => e.soc),
				color: "var(--joe-c-soc)",
				digits: 0
			},
			{
				label: e("plan.chart.without"),
				kind: "line",
				values: r.map((e) => e.soc_without),
				color: "var(--joe-c-ist)",
				dashed: !0,
				digits: 0
			},
			{
				label: e("plan.chart.reserve", { value: n(e.lang, a, 0) }),
				kind: "line",
				values: r.map(() => a),
				color: "var(--joe-crit)",
				dashed: !0,
				digits: 0
			}
		], c = [], l = i.at(t.window?.end);
		l != null && t.kind !== "none" && c.push({
			at: l,
			label: e("plan.chart.target", { value: n(e.lang, t.target ?? 0, 0) })
		});
		let u = i.at(t.full_at);
		return u != null && c.push({
			at: u,
			label: e("plan.chart.full", { time: S(t.full_at) }),
			short: `${S(t.full_at)}`
		}), C`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.chart.soc")} ${o(e, "chart_plan_soc")}</div>
      <joe-chart
        .labels=${i.labels}
        .ticks=${i.ticks}
        .series=${s}
        .bands=${i.bands}
        .markers=${c}
        max="100"
        height="190"
        unit="%"
        lang=${e.lang}
        label=${e("plan.chart.soc")}
      ></joe-chart>
      <div class="legend">
        ${s.map((e) => C`<span><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color}"></i>${e.label}</span>`)}
      </div>
    </div>`;
	}
	renderMath(e, t) {
		let r = (t, r = 1) => t == null ? "–" : `${n(e.lang, t, r)} kWh`, i = (t) => t == null ? "–" : `${n(e.lang, t * 100, 1)} ct`, a = t.window?.start.slice(0, 10) ?? "", s = t.meta?.solar.sources[a] ?? "none", c = t.meta?.tomorrow, l = c?.solar_factor ?? t.meta?.solar_factor ?? 1, u = t.meta?.consumption, d = this.state?.config.persons ?? [], f = [
			{
				label: e("plan.math.battery_now"),
				value: `${n(e.lang, t.soc_now ?? 0, 0)} %`,
				hint: e("plan.math.battery_now.sub", {
					stored: n(e.lang, (t.soc_now ?? 0) / 100 * (t.capacity_kwh ?? 0), 1),
					capacity: n(e.lang, t.capacity_kwh ?? 0, 1)
				}),
				to: {
					tab: "devices",
					section: "battery"
				}
			},
			{
				label: e("plan.math.battery_start"),
				value: `${n(e.lang, t.soc_start ?? 0, 0)} %`
			},
			{
				label: e("plan.math.solar"),
				value: r(t.solar_kwh),
				hint: `${e(`plan.math.solar.${s}`)}${l === 1 ? "" : ` · ${e(c?.solar_source === "combined" ? "plan.math.solar.combined" : c?.solar_source === "weather" && c.weather ? "plan.math.solar.weather" : "plan.math.solar.factor", {
					value: n(e.lang, l, 2),
					weather: c?.weather ? e(`learn.weather.${c.weather}`) : ""
				})}`}`,
				to: Rl
			},
			{
				label: e("plan.math.home"),
				value: r(t.home_kwh),
				hint: u?.source === "history" ? e("plan.math.home.history", {
					days: u.days,
					kind: e(t.meta?.workday === !1 ? "plan.math.day_off" : "plan.math.workday")
				}) : e("plan.math.home.default")
			}
		];
		c && (c.temp != null || c.weather) && f.push({
			label: e("plan.math.weather"),
			value: [c.temp == null ? "" : `${n(e.lang, c.temp, 0)} °C`, c.weather ? e(`learn.weather.${c.weather}`) : ""].filter(Boolean).join(" · "),
			to: {
				tab: "household",
				section: "travel"
			}
		}), c && f.push({
			label: e("plan.math.day"),
			value: [e(c.workday ? "plan.math.day.workday" : "plan.math.day.off"), ...Object.entries(c.labels).map(([t, n]) => e("plan.math.tomorrow.person", {
				name: d.find((e) => e.id === t)?.name ?? t,
				label: e(`label.${n}`)
			}))].join(" · "),
			hint: c.expected_kwh == null ? e("plan.math.tomorrow.usual") : e("plan.math.tomorrow.scaled", {
				expected: n(e.lang, c.expected_kwh, 1),
				usual: n(e.lang, c.profile_kwh, 1)
			}),
			to: {
				tab: "household",
				section: "days"
			}
		}), f.push({
			label: e("plan.math.target"),
			value: `${n(e.lang, t.target ?? 0, 0)} %`,
			hint: e("plan.math.target.sub", {
				optimum: n(e.lang, t.optimum ?? 0, 0),
				buffer: n(e.lang, (t.rules?.buffer ?? 0) * 100, 0)
			}),
			to: {
				tab: "settings",
				section: "rules",
				id: "buffer_factor"
			}
		}, {
			label: e("plan.math.prices"),
			value: e("plan.math.prices.value", {
				night: i(t.prices?.night),
				day: i(t.prices?.day),
				feed: i(t.prices?.feed_in)
			}),
			hint: t.prices?.assumed ? e("plan.math.prices.assumed") : void 0,
			to: zl
		}, {
			label: e("plan.math.rules"),
			value: e("plan.math.rules.value", {
				reserve: n(e.lang, t.rules?.reserve ?? 0, 0),
				max: n(e.lang, t.rules?.max_target ?? 100, 0),
				mode: e.optional(`rule.discharge.${t.rules?.discharge_mode}`) ?? ""
			}),
			to: {
				tab: "settings",
				section: "rules"
			}
		});
		let p = [...new Set(t.notes ?? [])].filter((t) => e.optional(`plan.note.${t}`));
		return C`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.math")} ${o(e, "plan_math")}</div>
      <div class="mirrors">
        ${f.map((t) => t.to ? ta(e, this.prefix, {
			label: t.label,
			value: t.value,
			hint: t.hint,
			to: t.to
		}) : C`<div class="mirror">
                <div class="mirror-text">
                  <span class="mirror-label">${t.label}</span><span class="mirror-sep" aria-hidden="true">·</span
                  ><span class="mirror-value">${t.value}</span>
                  ${t.hint ? C`<small class="mirror-hint">${t.hint}</small>` : A}
                </div>
              </div>`)}
      </div>
      ${p.map((n) => this.renderNote(e, t, n))}
    </div>`;
	}
	renderNote(e, t, n) {
		let r = this.noteJumps(e, t, n);
		return C`<div class="note">
      <ha-icon icon="mdi:information-outline"></ha-icon>
      <div>
        <span>${e.optional(`plan.note.${n}`)}</span>
        ${r.length ? C`<div class="note-actions">
              ${r.map((e) => C`<a class="mini-btn go mirror-go" href=${k(this.prefix, e.to)} @click=${D(e.to)}>${e.label}</a>`)}
            </div>` : A}
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
				to: Rl,
				label: r
			}];
			case "prices_partly": return [{
				to: zl,
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
			let t = ft(this.devices, "battery", e.id);
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
s([O({ attribute: !1 })], Bl.prototype, "hass", void 0), s([O({ attribute: !1 })], Bl.prototype, "t", void 0), s([O({ attribute: !1 })], Bl.prototype, "state", void 0), s([O({ attribute: !1 })], Bl.prototype, "route", void 0), s([O({ attribute: !1 })], Bl.prototype, "prefix", void 0), s([O({ attribute: !1 })], Bl.prototype, "devices", void 0), s([N()], Bl.prototype, "refreshing", void 0), j("joe-plan-page", Bl);
//#endregion
//#region src/pages/settings/base.ts
var Vl = class extends x {
	constructor(...e) {
		super(...e), this.prefix = M, this.checks = [];
	}
	willUpdate(e) {
		if (!e.has("route") && !e.has("anchor")) return;
		let t = this.route ? ce(this.route) : "";
		t !== this.revealed && (this.revealed = t, this.pending = this.anchor || void 0);
	}
	async updated() {
		let e = this.pending;
		if (!e) return;
		let t = [...this.renderRoot.querySelectorAll("joe-choice")];
		await Promise.all(t.map((e) => e.updateComplete));
		for (let e = 0; e < 10 && (e === 0 || !getComputedStyle(this).getPropertyValue("--joe-head-h")); e++) await new Promise((e) => requestAnimationFrame(e));
		this.pending === e && he(this.renderRoot, e) && (this.pending = void 0);
	}
};
s([O({ attribute: !1 })], Vl.prototype, "hass", void 0), s([O({ attribute: !1 })], Vl.prototype, "t", void 0), s([O({ attribute: !1 })], Vl.prototype, "state", void 0), s([O({ attribute: !1 })], Vl.prototype, "route", void 0), s([O({ attribute: !1 })], Vl.prototype, "prefix", void 0), s([O({ attribute: !1 })], Vl.prototype, "info", void 0), s([O({ attribute: !1 })], Vl.prototype, "discovery", void 0), s([O({ attribute: !1 })], Vl.prototype, "checks", void 0), s([O({ attribute: !1 })], Vl.prototype, "anchor", void 0);
//#endregion
//#region src/pages/settings/styles.ts
var Hl = T`
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
`, Ul = "/config/energy", Wl = [
	"control",
	"button",
	"value",
	"calendar",
	"other"
], Gl = {
	select: "control",
	switch: "control",
	button: "button",
	sensor: "value",
	binary_sensor: "value",
	calendar: "calendar"
}, Kl = [
	"control",
	"value",
	"other"
], ql = [{
	id: "night",
	type: "energy-joe-night-card",
	icon: "mdi:weather-night"
}, {
	id: "car",
	type: "energy-joe-car-card",
	icon: "mdi:car-electric-outline"
}];
function Jl(e) {
	return C`${e.split(/(?<=[._])/).map((e, t) => C`${t ? C`<wbr />` : A}${e}`)}`;
}
var Yl = class extends Vl {
	static {
		this.styles = [
			d,
			Hl,
			T`
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
		return !e || !this.state ? A : C`<div class="list">
      ${this.renderVersions(e)} ${this.renderEntities(e, t)} ${this.renderCards(e)}
    </div>`;
	}
	renderVersions(e) {
		let t = this.info?.energy, n = !!(t?.configured && t.sources);
		return C`<section class="group" data-anchor="versions">
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
          href=${Ul}
          @click=${(e) => {
			e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0 || (e.preventDefault(), ae(Ul));
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
			let n = Gl[e.entity_id.split(".", 1)[0]] ?? "other", i = t ? f(t, e.entity_id) : e.entity_id, a = i.replace(/^energy joe\s+/i, "") || i;
			r.set(n, [...r.get(n) ?? [], {
				id: e.entity_id,
				name: a
			}]);
		}
		return C`<section class="group" data-anchor="entities">
      <div class="group-title" data-tipped><h2>${e("settings.about.entities")}</h2>${o(e, "about_entities")}</div>
      <p class="intro">${e("settings.about.entities.intro")}</p>
      ${n.length ? Wl.filter((e) => r.has(e)).map((n) => C`<div class="group-label">${e(`settings.about.group.${n}`)}</div>
              ${r.get(n).sort((t, n) => t.name.localeCompare(n.name, e.lang)).map((r) => C`<div class="ent">
                    <div class="ent-text"><b>${r.name}</b><code>${Jl(r.id)}</code></div>
                    ${t && Kl.includes(n) ? C`<span class="ent-state">${ne(t, r.id, e.lang)}</span>` : A}
                    ${Rr(e, {
			entityId: r.id,
			name: r.name
		})}
                  </div>`)}`) : C`<p class="intro">${e("settings.about.entities.none")}</p>`}
    </section>`;
	}
	renderCards(e) {
		return C`<section class="group" data-anchor="cards">
      <h2>${e("settings.about.cards")}</h2>
      <p class="intro">${e("settings.about.cards.intro")}</p>
      ${ql.map((t) => C`<div class="row">
          <div>
            <b class="card-name"><ha-icon icon=${t.icon}></ha-icon>${e(`settings.about.cards.${t.id}`)}</b>
            <small>${e(`settings.about.cards.${t.id}.hint`)}</small>
            <code class="card-type">type: custom:${t.type}</code>
          </div>
        </div>`)}
    </section>`;
	}
};
j("joe-settings-about", Yl);
//#endregion
//#region src/pages/settings/maintenance.ts
var Xl = "/config/integrations/integration/energy_joe", Zl = class extends Vl {
	static {
		this.styles = [
			d,
			Hl,
			T`
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
		return !e || !t ? A : C`<div class="list">
      ${this.renderObserve(e, t)} ${this.renderBackup(e)} ${this.renderSetup(e)}
    </div>`;
	}
	renderObserve(e, t) {
		let n = t.observe, r = !!n?.active, i = n?.backfill.state === "running", a = (t) => new Intl.DateTimeFormat(e.lang, {
			day: "numeric",
			month: "long",
			timeZone: "UTC"
		}).format(/* @__PURE__ */ new Date(`${t.slice(0, 10)}T12:00:00Z`)), s = r ? e("settings.observe.since", {
			day: a(n.since),
			time: n.since.slice(11, 16)
		}) : t.mode === "off" ? e("settings.observe.off") : e("settings.observe.waiting"), c = [];
		n?.first_day ? c.push(e("settings.observe.days", {
			days: n.day_count ?? 0,
			first: a(n.first_day)
		})) : c.push(e("settings.observe.nothing"));
		let l = n?.backfill;
		return l?.state === "running" ? c.push(e("history.reading")) : l?.state === "unavailable" ? c.push(e("settings.observe.no_recorder")) : l?.state === "failed" && c.push(e("settings.observe.failed")), C`<section class="group" data-anchor="observe">
      <h2>${e("settings.observe")}</h2>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${e("settings.observe.recording")}</b>${o(e, "observe")}</div>
          <small>${s}</small>
        </div>
        <span class="chip ${r ? "ok" : ""}">
          ${e(r ? "status.running" : t.mode === "off" ? "status.paused" : "status.waiting")}
        </span>
      </div>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${e("settings.observe.history")}</b>${o(e, "rebuild")}</div>
          <small>${c.join(" · ")}</small>
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
		return C`<section class="group" data-anchor="backup">
      <h2>${e("settings.backup")}</h2>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${e("settings.backup.export")}</b>${o(e, "backup_export")}</div>
          <small>${e("settings.backup.export.hint")}</small>
        </div>
        <button type="button" class="btn btn-secondary" @click=${() => void this.exportSettings()}>${e("settings.backup.download")}</button>
      </div>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${e("settings.backup.import")}</b>${o(e, "backup_import")}</div>
          <small>${e("settings.backup.import.hint")}</small>
        </div>
        <label class="btn btn-secondary file">
          ${e("settings.backup.choose")}
          <input type="file" accept="application/json,.json" @change=${(e) => void this.readBackup(e)} />
        </label>
      </div>
      ${this.backup ? C`<div class="note warn" data-tipped>
            <ha-icon icon="mdi:alert-outline"></ha-icon>
            <span>
              ${e("settings.backup.confirm", {
			file: this.backup.name,
			when: this.backup.when
		})} ${o(e, "backup_import")}
              <span class="confirm">
                <button type="button" class="btn btn-danger" @click=${() => void this.importSettings()}>${e("settings.backup.replace")}</button>
                <button type="button" class="btn btn-ghost" @click=${() => this.backup = void 0}>${e("common.cancel")}</button>
              </span>
            </span>
          </div>` : A}
      ${this.backupNote ? C`<div class="note ${this.backupNote.ok ? "ok" : "warn"}">
            <ha-icon icon=${this.backupNote.ok ? "mdi:check" : "mdi:alert-outline"}></ha-icon><span>${this.backupNote.text}</span>
          </div>` : A}
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
		return C`<section class="group" data-anchor="setup">
      <h2>${e("settings.setup")}</h2>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${e("settings.setup.again")}</b>${o(e, "restart")}</div>
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
          <div class="name"><b>${e("settings.maintenance.diagnostics")}</b>${o(e, "diagnostics")}</div>
          <small>${e("settings.maintenance.diagnostics.hint")}</small>
        </div>
        <a
          class="mini-btn"
          data-notip
          href=${Xl}
          @click=${(e) => {
			e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0 || (e.preventDefault(), ae(Xl));
		}}
          ><ha-icon icon="mdi:open-in-new"></ha-icon>${e("settings.maintenance.diagnostics.open")}</a
        >
      </div>
    </section>`;
	}
};
s([N()], Zl.prototype, "backup", void 0), s([N()], Zl.prototype, "backupNote", void 0), j("joe-settings-maintenance", Zl);
//#endregion
//#region src/pages/settings/notify.ts
var Ql = class extends Vl {
	constructor(...e) {
		super(...e), this.loading = !1;
	}
	static {
		this.styles = [d, Hl];
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
		if (!e || !t) return A;
		let n = t.config, r = n.notify, i = this.notifyTargets ?? Object.keys(this.hass?.services?.notify ?? {}).filter((e) => ![
			"persistent_notification",
			"send_message",
			"notify"
		].includes(e)).sort().map((e) => ({
			service: e,
			name: e.replace(/_/g, " ")
		})), a = r.service?.replace(/^notify\./, ""), s = !!a && this.notifyTargets !== void 0 && !i.some((e) => e.service === a);
		return C`<div class="list">
      <section class="group" data-anchor="notify">
        <h2>${e("settings.notify")}</h2>
        <p class="intro">${e("settings.notify.intro")}</p>
        <div class="row" data-tipped data-anchor="service">
          <div>
            <div class="name"><label for="notify-service"><b>${e("settings.notify.service")}</b></label>${o(e, "notify_service")}</div>
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
            ${i.map((e) => C`<option value=${e.service} ?selected=${a === e.service}>${e.name}</option>`)}
            ${s ? C`<option value=${a} selected>${e("settings.notify.gone", { name: a ?? "" })}</option>` : A}
          </select>
        </div>
        ${this.toggle(e, n, "ask")} ${this.toggle(e, n, "problems")} ${this.toggle(e, n, "morning")}
        ${n.cars?.length ? this.toggle(e, n, "cars") : A}
        ${this.askTime(e, n)}
      </section>
    </div>`;
	}
	toggle(e, t, n) {
		let r = t.notify;
		return C`<div class="row" data-tipped>
      <div>
        <div class="name"><b id="notify-${n}">${e(`settings.notify.${n}`)}</b>${o(e, `notify_${n}`)}</div>
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
		return C`<div class="row" data-tipped data-anchor="ask_time">
      <div>
        <div class="name"><label for="ask-time"><b>${e("settings.ask_time")}</b></label>${o(e, "ask_time")}</div>
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
s([N()], Ql.prototype, "notifyTargets", void 0), j("joe-settings-notify", Ql);
//#endregion
//#region src/pages/settings/operation.ts
var $l = [
	"simulation",
	"advisory",
	"live",
	"off"
], eu = class extends Vl {
	static {
		this.styles = [
			d,
			Hl,
			T`
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
    `
		];
	}
	render() {
		let { t: e, state: t } = this;
		return !e || !t ? A : C`<div class="list">
      <section class="group" data-anchor="mode">
        <h2>${e("settings.operation")}</h2>
        <div class="row" data-tipped>
          <div>
            <div class="name"><b>${e("settings.mode")}</b>${o(e, "mode")}</div>
            <small>${e("settings.mode.now", { mode: e(`mode.${t.mode}`) })}</small>
          </div>
          <div class="control">
            <button type="button" class="btn btn-secondary" @click=${this.openDialog}>${e("settings.mode.open")}</button>
            ${o(e, "mode_open")}
          </div>
        </div>
        <ul class="modes">
          ${$l.map((n) => C`<li class=${n === t.mode ? "on" : ""}>
              <span class="mode-name"
                >${e(`mode.${n}`)}
                ${n === t.mode ? C`<span class="chip ok">${e("mode.current")}</span>` : A}</span
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
	gridFriendlyRows(t, n) {
		let r = n.config, i = r.rules;
		return C`<div class="row" data-tipped data-anchor="grid_friendly">
        <div>
          <div class="name"><b id="grid-friendly">${t("rule.grid_friendly")}</b>${o(t, "r_grid_friendly")}</div>
          <small>${t("rule.grid_friendly.hint")}</small>
        </div>
        <div class="control">
          ${e(t, P(r, "rules.grid_friendly"))}
          <button
            type="button"
            class="switch"
            role="switch"
            aria-checked=${String(i.grid_friendly)}
            aria-labelledby="grid-friendly"
            @click=${() => I(this, { rules: { grid_friendly: !i.grid_friendly } })}
          ></button>
        </div>
      </div>
      ${i.grid_friendly ? C`<div class="row" data-tipped>
            <div>
              <div class="name"><b>${t("rule.grid_first")}</b>${o(t, "r_grid_first")}</div>
              <small>${t(i.grid_first ? "rule.grid_first.grid.hint" : "rule.grid_first.saving.hint")}</small>
            </div>
            <div class="seg" role="group" aria-label=${t("rule.grid_first")}>
              ${[!1, !0].map((e) => C`<button
                    type="button"
                    aria-pressed=${String(i.grid_first === e)}
                    @click=${() => I(this, { rules: { grid_first: e } })}
                  >
                    ${t(e ? "rule.grid_first.grid" : "rule.grid_first.saving")}
                  </button>`)}
            </div>
          </div>` : A}`;
	}
};
j("joe-settings-operation", eu);
//#endregion
//#region src/pages/settings/rules.ts
var tu = [
	"battery",
	"grid",
	"plan"
], nu = class extends Vl {
	static {
		this.styles = [
			d,
			Hl,
			xa
		];
	}
	render() {
		let { t: e, state: t } = this;
		if (!e || !t) return A;
		let n = t.config;
		return C`<div class="list">
      <p class="intro">${e("settings.rules.intro")}</p>
      ${tu.map((t) => C`<section class="group" data-anchor=${`group-${t}`}>
          <h2>${e(`settings.rules.group.${t}`)}</h2>
          ${aa[t].map((t) => fa(e, this, n, this.info, t))}
        </section>`)}
    </div>`;
	}
};
j("joe-settings-rules", nu);
//#endregion
//#region src/pages/settings/signpost.ts
var ru = [
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
], iu = 8;
function au(e) {
	return e.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ß/g, "ss").replace(/([aou])e/g, "$1").replace(/[-\u2010\u2011]/g, "");
}
var ou = class extends x {
	constructor(...e) {
		super(...e), this.prefix = M, this.query = "";
	}
	static {
		this.styles = [d, T`
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
		if (!e) return A;
		let t = this.search(e), n = this.query.trim() !== "";
		return C`<section class="signpost" data-tipped role="search">
      <div class="sp-head">
        <label for="signpost-q"><ha-icon icon="mdi:sign-direction"></ha-icon>${e("signpost.title")}</label>${o(e, "signpost")}
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
      ${n && t.length ? C`<ul class="hits">
            ${t.slice(0, iu).map((e) => C`<li>${this.hitLink(e)}</li>`)}
          </ul>` : A}
      <p class="sp-status" aria-live="polite" ?hidden=${!n || t.length > 0 && t.length <= iu}>
        ${n ? t.length ? e("signpost.more", { count: t.length - iu }) : e("signpost.none") : ""}
      </p>
    </section>`;
	}
	hitLink(e) {
		let t = e.entry.to;
		return C`<a
      class="hit"
      href=${k(this.prefix, t)}
      @click=${(e) => {
			D(t)(e), e.defaultPrevented && (this.query = "");
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
		this.query = "", w(this, e);
	}
	search(e) {
		let t = au(this.query).split(/\s+/).filter(Boolean);
		if (!t.length) return [];
		let n = [];
		return ru.forEach((r, i) => {
			let a = e("title" in r ? r.title : `signpost.${r.id}`), o = e(`signpost.${r.id}.terms`).split(",").map((e) => e.trim()).filter(Boolean), s = su(e, r.to, a), c = au([
				a,
				...o,
				s
			].join(" | "));
			if (!t.every((e) => c.includes(e))) return;
			let l = t.join(" "), u = au(a), d = o.find((e) => au(e) === l), f = u === l ? 0 : d ? 1 : u.startsWith(l) ? 2 : u.includes(l) ? 3 : 6, p = f === 1 ? d : void 0;
			if (f > 3) {
				let e = o.find((e) => au(e).startsWith(l)) ?? o.find((e) => au(e).includes(l));
				e && (p = e, f = au(e).startsWith(l) ? 4 : 5);
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
s([O({ attribute: !1 })], ou.prototype, "t", void 0), s([O({ attribute: !1 })], ou.prototype, "state", void 0), s([O({ attribute: !1 })], ou.prototype, "route", void 0), s([O({ attribute: !1 })], ou.prototype, "prefix", void 0), s([N()], ou.prototype, "query", void 0);
function su(e, t, n) {
	let r = [e(`tab.${t.tab}`)];
	if (t.section) {
		let n = e.optional(`nav.${t.tab}.${t.section}`);
		n && r.push(n);
	}
	return t.id && au(r[r.length - 1]) !== au(n) && r.push(n), r.join(" › ");
}
j("joe-signpost", ou);
//#endregion
//#region src/pages/settings/index.ts
var cu = {
	operation: "mdi:tune-variant",
	rules: "mdi:format-list-checks",
	notify: "mdi:bell-outline",
	maintenance: "mdi:wrench-outline",
	about: "mdi:information-outline"
}, lu = class extends x {
	constructor(...e) {
		super(...e), this.prefix = M, this.checks = [];
	}
	static {
		this.styles = [d, T`
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
		if (!e || !this.state) return A;
		let t = this.route?.section ?? ge.settings, n = de.settings.map((t) => ({
			id: t,
			label: e(`nav.settings.${t}`),
			icon: cu[t]
		}));
		return C`${Cr(e, this.prefix, "settings", n, t)}
      <div class="body">${this.renderSignpost()}${this.renderSection(t)}</div>`;
	}
	renderSignpost() {
		return C`<joe-signpost .t=${this.t} .state=${this.state} .prefix=${this.prefix} .route=${this.route}></joe-signpost>`;
	}
	renderSection(e) {
		let { t, hass: n, state: r, prefix: i, route: a, info: o, discovery: s, checks: c } = this;
		switch (e) {
			case "operation": return C`<joe-settings-operation
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
			case "rules": return C`<joe-settings-rules
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
			case "notify": return C`<joe-settings-notify
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
			case "maintenance": return C`<joe-settings-maintenance
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
			case "about": return C`<joe-settings-about
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
s([O({ attribute: !1 })], lu.prototype, "hass", void 0), s([O({ attribute: !1 })], lu.prototype, "t", void 0), s([O({ attribute: !1 })], lu.prototype, "state", void 0), s([O({ attribute: !1 })], lu.prototype, "route", void 0), s([O({ attribute: !1 })], lu.prototype, "prefix", void 0), s([O({ attribute: !1 })], lu.prototype, "info", void 0), s([O({ attribute: !1 })], lu.prototype, "discovery", void 0), s([O({ attribute: !1 })], lu.prototype, "checks", void 0), j("joe-settings-page", lu);
//#endregion
//#region src/energy-joe-panel.ts
var uu = [
	"simulation",
	"advisory",
	"live",
	"off"
], du = {
	simulation: "mdi:pause",
	advisory: "mdi:comment-question-outline",
	live: "mdi:play",
	off: "mdi:power"
}, fu = uu, pu = {
	overview: "mdi:view-dashboard-outline",
	plan: "mdi:weather-night",
	review: "mdi:history",
	devices: "mdi:power-plug-outline",
	household: "mdi:account-group-outline",
	settings: "mdi:cog-outline"
}, mu = [
	"overview",
	"devices",
	"household",
	"settings"
], hu = ["action", "battery"], gu = [
	"devices",
	"household",
	"overview",
	"review"
], $ = class extends x {
	constructor() {
		super(), this.narrow = !1, this.failed = !1, this.modeDialog = !1, this.notice = "", this.discovering = !1, this.discoveryFailed = !1, this.checks = [], this.infoRequested = !1, this.adopted = !1, this.parsed = ye(""), this.climateRequested = !1, this.jumped = !1, this.addEventListener("joe-config", (e) => this.onConfig(e)), this.addEventListener("joe-pick", (e) => {
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
		return Ce(this.hass?.language);
	}
	get base() {
		return this.route?.prefix ?? "/energy-joe";
	}
	get current() {
		return this.parsed.route;
	}
	connectedCallback() {
		super.connectedCallback(), Xn(), this.subscribe();
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
			this.parsed = ye(this.route?.path ?? "");
			let { route: n, redirect: r } = this.parsed;
			r !== void 0 && this.go(r, { replace: !0 }), this.remember(n), n.tab !== t && this.joe?.onboarding.completed && (this.discoveryFailed = !1, this.climateFound || (this.climateRequested = !1));
		}
	}
	updated() {
		this.observeHead();
		let e = this.joe;
		e?.onboarding.completed && !this.climateRequested && gu.includes(this.current.tab) && this.loadClimate(), !(!e || this.discovering || this.discoveryFailed) && (!e.onboarding.completed && e.onboarding.step === "scan" && !this.adopted ? this.scan() : !this.discovery && (e.onboarding.completed ? mu.includes(this.current.tab) || hu.includes(this.editor?.editor ?? "") : e.onboarding.step !== "welcome") && this.look());
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
		}, { type: "energy_joe/subscribe" }), this.unsubscribe.catch(() => {
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
		if (this.failed) return C`<main><joe-empty-state pose="puzzled" heading=${e("error.title")} text=${e("error.text")}></joe-empty-state></main>`;
		if (!this.joe) return C`<div class="loading">${e("loading")}</div>`;
		let t = !this.joe.onboarding.completed;
		return C`
      <header>
        ${this.joe.mode === "simulation" ? C`<div class="simband" aria-hidden="true"></div>` : A}
        <div class="bar">
          ${this.narrow || this.hass?.dockedSidebar === "always_hidden" ? C`<button class="menu" type="button" data-notip aria-label=${e("menu.sidebar")} @click=${this.toggleSidebar}>
                <ha-icon icon="mdi:menu"></ha-icon>
              </button>` : A}
          <div class="brand">
            <img class="light" src=${Me("joe-head.webp")} alt="" width="36" height="36" />
            <img class="dark" src=${Me("joe-head-dark.webp")} alt="" width="36" height="36" />
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
      ${this.notice ? C`<div class="notice" role="alert">${this.notice}</div>` : A}
      <main
        @joe-onboarding=${this.onOnboarding}
        @joe-rediscover=${() => this.scan()}
        @joe-discovery=${(e) => this.discovery = e.detail}
      >
        ${t ? C`<joe-onboarding
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
      ${this.modeDialog ? this.renderModeDialog(e) : A} ${this.editor ? this.renderEditor(e) : A}
      ${this.picker ? this.renderPicker(e) : A}
    `;
	}
	renderTabs(e) {
		let t = this.current.tab;
		return C`<nav class="tabs" aria-label=${e("nav.label")} lang=${e.lang}>
      ${se.map((n, r) => {
			let i = this.tabPath(n), a = r > 0 && ve.includes(se[r - 1]) && !ve.includes(n);
			return C`${a ? C`<span class="gap" aria-hidden="true"></span>` : A}<a
            href=${k(this.base, i)}
            class=${n === t ? "on" : ""}
            aria-current=${n === t ? "page" : "false"}
            @click=${D(i)}
            ><ha-icon icon=${pu[n]}></ha-icon><span class="label">${e(`tab.${n}`)}</span></a
          >`;
		})}
    </nav>`;
	}
	tabPath(e) {
		let t = this.current;
		if (e === t.tab) return ce({
			tab: e,
			section: t.section
		});
		let n = null;
		try {
			n = sessionStorage.getItem(`joe.last.${e}`);
		} catch {}
		let r = e === "overview" ? "/" : `/${e}`;
		return n && (n === r || n.startsWith(`${r}/`)) ? n : ce({ tab: e });
	}
	remember(e) {
		try {
			sessionStorage.setItem(`joe.last.${e.tab}`, ce({
				tab: e.tab,
				section: e.section,
				id: e.id
			}));
		} catch {}
	}
	renderSteps(e) {
		let t = Mn.indexOf(this.joe?.onboarding.step ?? "welcome");
		return C`<ol class="steps" aria-label=${e("steps.label")}>
      ${Mn.map((n, r) => C`<li class=${r < t ? "done" : r === t ? "on" : ""} aria-current=${r === t ? "step" : "false"}>
            ${r + 1} ${e(`step.${n}`)}
          </li>`)}
    </ol>`;
	}
	renderPage(e) {
		let t = this.current, n = this.base;
		switch (t.tab) {
			case "overview": return C`<joe-overview
          .t=${e}
          .hass=${this.hass}
          .state=${this.joe}
          .prefix=${n}
          .route=${t}
          .climateFound=${this.climateFound}
          .discovery=${this.discovery}
          .checks=${this.checks}
          .devices=${this.devices(e)}
        ></joe-overview>`;
			case "plan": return C`<joe-plan-page
          .t=${e}
          .hass=${this.hass}
          .state=${this.joe}
          .prefix=${n}
          .route=${t}
          .devices=${this.devices(e)}
        ></joe-plan-page>`;
			case "review": return C`<joe-lookback-page
          .t=${e}
          .hass=${this.hass}
          .state=${this.joe}
          .prefix=${n}
          .route=${t}
          .climateFound=${this.climateFound}
        ></joe-lookback-page>`;
			case "devices": return C`<joe-devices-page
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
			case "household": return C`<joe-household-page
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
			case "settings": return C`<joe-settings-page
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
			let r = ut(e, t, this.hass, {
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
		return C`<div class="scrim" @click=${this.closeDialog}>
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
          <div id="mode-title">${b(e("mode.dialog.title"), "h2", o(e, "mode"))}</div>
          ${E}
          ${this.renderReadiness(e)}
          <div class="modes" role="group" aria-labelledby="mode-title">
            ${uu.map((n) => {
			let r = fu.includes(n);
			return C`<button
                type="button"
                class="mode ${n}"
                aria-pressed=${String(n === t)}
                ?disabled=${!r}
                @click=${() => this.chooseMode(n)}
              >
                <span class="knob"><ha-icon icon=${du[n]}></ha-icon></span>
                <span class="label">
                  <b>${e(`mode.${n}`)}</b>
                  <small>${e(`mode.${n}.desc`)}</small>
                </span>
                ${n === t ? C`<span class="chip ok"><ha-icon icon="mdi:check"></ha-icon>${e("mode.current")}</span>` : r ? A : C`<span class="chip soon">${e("mode.soon")}</span>`}
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
		if (!r.length) return A;
		let i = r.filter((e) => n[e.id] !== "ready");
		if (!i.length) return A;
		let a = i.length === r.length ? e("mode.none_tested") : e("mode.untested", { names: i.map((e) => e.name).join(", ") }), o = {
			tab: "devices",
			section: "battery"
		}, s = D(o);
		return C`<div class="note warn readiness">
      <ha-icon icon="mdi:alert-outline"></ha-icon>
      <div>
        <span>${a}</span>
        <a
          class="mini-btn go"
          href=${k(this.base, o)}
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
		}, i = C``, a = "", o = !1;
		switch (t?.editor) {
			case "battery":
				a = e("edit.battery.label"), o = !0, i = C`<joe-battery-editor
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
				a = e("action.label"), i = C`<joe-action-editor
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
			case "consumers": a = e("edit.consumers.label"), o = !0, i = C`<div class="sheet-title">${b(e("edit.consumers.title"))}</div>
          <joe-consumer-list .hass=${this.hass} .t=${e} .config=${n}></joe-consumer-list>
          <div class="actions">
            <button type="button" class="btn btn-secondary" data-notip @click=${r}>${e("mode.close")}</button>
          </div>`;
		}
		return C`<joe-sheet
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
		return C`<joe-sheet
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
		let n = ye(e).redirect ?? ce(e), r = k(this.base, n);
		if (!t.replace && location.pathname === r) {
			this.scrollTop = 0;
			return;
		}
		t.replace || history.replaceState({
			...history.state ?? {},
			joeScroll: this.scrollTop
		}, ""), this.jumped = !0, history[t.replace ? "replaceState" : "pushState"](t.sheet ? { joeSheet: !0 } : null, "", r), window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: !!t.replace } }));
		let i = ye(n).route, a = i.tab === "devices" && i.section !== "grid" && i.section !== "add" && !i.sub;
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
			Se,
			d,
			T`
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
s([O({ attribute: !1 })], $.prototype, "hass", void 0), s([O({
	type: Boolean,
	reflect: !0
})], $.prototype, "narrow", void 0), s([O({ attribute: !1 })], $.prototype, "route", void 0), s([N()], $.prototype, "joe", void 0), s([N()], $.prototype, "info", void 0), s([N()], $.prototype, "failed", void 0), s([N()], $.prototype, "modeDialog", void 0), s([N()], $.prototype, "notice", void 0), s([N()], $.prototype, "discovery", void 0), s([N()], $.prototype, "discovering", void 0), s([N()], $.prototype, "discoveryFailed", void 0), s([N()], $.prototype, "checks", void 0), s([N()], $.prototype, "picker", void 0), s([N()], $.prototype, "editor", void 0), s([N()], $.prototype, "climateFound", void 0), j("energy-joe-panel", $);
//#endregion
export { $ as EnergyJoePanel };
