import { $ as e, A as t, B as n, C as r, D as i, E as a, F as o, G as s, H as c, I as l, J as u, K as d, L as f, M as p, N as m, O as h, P as g, Q as _, R as ee, S as te, T as v, U as ne, V as y, W as re, X as b, Y as ie, Z as x, _ as ae, a as oe, at as S, b as se, c as ce, ct as C, d as w, dt as T, et as le, f as E, ft as ue, g as de, gt as D, h as fe, ht as pe, i as me, it as O, j as he, k as ge, l as k, lt as A, m as _e, mt as ve, n as ye, nt as be, o as xe, ot as Se, p as Ce, pt as j, q as we, r as M, rt as Te, s as Ee, st as De, t as Oe, tt as N, u as ke, ut as P, v as Ae, w as je, x as Me, y as Ne, z as Pe } from "./tokens-db0nnYVG.js";
//#region src/assets.ts
var Fe = import.meta.url.replace(/[^/]*$/, ""), Ie = (e) => `${Fe}${e}`, Le = /* @__PURE__ */ new Set(["welcome"]), Re = /* @__PURE__ */ new Set([
	"night-charge",
	"sleep",
	"learn"
]), ze = "thumbs", Be = class extends P {
	constructor(...e) {
		super(...e), this.name = "", this.alt = "";
	}
	static {
		this.styles = D`
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
		let e = Re.has(this.name) ? "scene" : "";
		if (this.name === ze) return j`<img class="light" src=${Ie("logo.webp")} alt=${this.alt} decoding="async" /><img
          class="dark"
          src=${Ie("logo-dark.webp")}
          alt=${this.alt}
          decoding="async"
        />`;
		let t = Ie(`poses/${this.name}.webp`);
		return Le.has(this.name) ? j`<img class="light" src=${t} alt=${this.alt} decoding="async" /><img
        class="dark"
        src=${Ie(`poses/${this.name}-dark.webp`)}
        alt=${this.alt}
       
        decoding="async"
      />` : j`<img class=${e} src=${t} alt=${this.alt} decoding="async" />`;
	}
};
b([A()], Be.prototype, "name", void 0), b([A()], Be.prototype, "alt", void 0), _("joe-pose", Be);
//#endregion
//#region src/components/empty-state.ts
var Ve = class extends P {
	constructor(...e) {
		super(...e), this.pose = "", this.heading = "", this.text = "", this.note = "";
	}
	static {
		this.styles = [x, D`
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
		return j`<div class="wrap">
      <joe-pose name=${this.pose}></joe-pose>
      <div>
        ${N(this.heading)} ${S}
        <p class="lead">${this.text}</p>
        ${this.note ? j`<div class="note"><span class="chip soon">${this.note}</span></div>` : T}
        <slot></slot>
      </div>
    </div>`;
	}
};
b([A()], Ve.prototype, "pose", void 0), b([A()], Ve.prototype, "heading", void 0), b([A()], Ve.prototype, "text", void 0), b([A()], Ve.prototype, "note", void 0), _("joe-empty-state", Ve);
//#endregion
//#region src/components/entity-picker.ts
var He = 60, Ue = class extends P {
	constructor(...e) {
		super(...e), this.selected = [], this.invert = !1, this.query = "", this.showAll = !1, this.limit = He;
	}
	static {
		this.styles = [x, D`
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
		e.has("request") && this.request && (this.selected = [...this.request.selected], this.invert = this.request.measurement?.invert ?? !1, this.query = "", this.showAll = !1, this.limit = He);
	}
	render() {
		let { hass: e, t, request: r } = this;
		if (!e || !t || !r) return T;
		let i = this.candidates(e, r), a = i.slice(0, this.limit), o = this.query ? [] : (r.suggestions ?? []).filter((t) => e.states[t.entity_id]);
		return j`<div data-tipped>
      <div class="sheet-title">${N(r.heading, "h2", n(t, r.tip, r.tipVars))}</div>
      <input
        class="input search"
        type="search"
        .value=${this.query}
        placeholder=${t("pick.search")}
        aria-label=${t("pick.search")}
        @input=${(e) => {
			this.query = e.target.value, this.limit = He;
		}}
      />
      ${o.length ? j`<div class="group-label">${t("pick.suggested")}</div>
            <ul>
              ${o.map((n) => this.renderRow(e, t, r, n.entity_id, n))}
            </ul>` : T}
      <div class="group-label">${t(this.showAll ? "pick.all" : "pick.fitting")} · ${i.length}</div>
      ${i.length ? j`<ul>
            ${a.map((n) => this.renderRow(e, t, r, n))}
          </ul>` : j`<p class="empty">${t("pick.empty")}</p>`}
      ${i.length > a.length ? j`<button type="button" class="mini-btn more" data-notip @click=${() => this.limit += He}>
            ${t("pick.more", { count: i.length - a.length })}
          </button>` : T}
      <div class="line">
        <button
          type="button"
          id="all"
          class="switch"
          role="switch"
          aria-checked=${String(this.showAll)}
          aria-labelledby="all-label"
          @click=${() => {
			this.showAll = !this.showAll, this.limit = He;
		}}
        ></button>
        <label id="all-label" for="all">${t("pick.show_all")}</label>
        ${n(t, "pick_all")}
      </div>
      ${r.measurement ? this.renderInvert(e, t, r) : T}
      <div class="sticky">
        <div class="actions">
          <button
            type="button"
            class="btn btn-primary"
            ?disabled=${!r.multiple && !this.selected.length}
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
			if (r.has(a) || !this.showAll && (!re(o, t.filter) || e.entities?.[a]?.hidden)) continue;
			let s = c(e, a);
			if (n.length) {
				let t = `${s} ${a} ${ne(e, a)}`.toLowerCase();
				if (!n.every((e) => t.includes(e))) continue;
			}
			i.push({
				id: a,
				name: s
			});
		}
		return i.sort((e, t) => e.name.localeCompare(t.name, this.t?.lang)), i.map((e) => e.id);
	}
	renderRow(t, n, r, i, a) {
		let o = this.selected.includes(i), s = ne(t, i), l = a?.reasons?.[0];
		return j`<li>
      <button type="button" class="row" aria-pressed=${String(o)} @click=${() => this.toggle(i)}>
        <span class="mark ${r.multiple ? "box" : ""}" aria-hidden="true">
          ${o ? j`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>` : T}
        </span>
        <span class="txt">
          <b>${c(t, i)}</b>
          <small>${s ? `${s} · ` : ""}${i}</small>
          ${l ? j`<small class="why">${Te(n, l)}</small>` : T}
        </span>
        <span class="end">
          <span class="val">${d(t, i, n.lang)}</span>
          ${a?.confidence == null ? T : e(n, a.confidence)}
        </span>
      </button>
    </li>`;
	}
	renderInvert(e, t, r) {
		let i = r.measurement?.role ?? "grid", a = this.selected[0], o = a ? we(e, {
			entity_id: a,
			invert: this.invert,
			minus_entity_id: null
		}) : null, c = "";
		if (o !== null) {
			let e = s(t.lang, Math.abs(o), 2);
			c = i === "grid" ? t(o >= 0 ? "pick.preview.import" : "pick.preview.export", { value: e }) : i === "battery" ? t(o >= 0 ? "pick.preview.charge" : "pick.preview.discharge", { value: e }) : t(o >= -.05 ? `pick.preview.${i}` : "pick.preview.negative", { value: s(t.lang, o, 2) });
		}
		return j`<div class="line">
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
        ${n(t, i === "battery" ? "pick_invert_battery" : "pick_invert")}
      </div>
      ${c ? j`<div class="note preview"><ha-icon icon="mdi:eye-outline"></ha-icon><span>${c}</span></div>` : T}`;
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
b([A({ attribute: !1 })], Ue.prototype, "hass", void 0), b([A({ attribute: !1 })], Ue.prototype, "t", void 0), b([A({ attribute: !1 })], Ue.prototype, "request", void 0), b([C()], Ue.prototype, "selected", void 0), b([C()], Ue.prototype, "invert", void 0), b([C()], Ue.prototype, "query", void 0), b([C()], Ue.prototype, "showAll", void 0), b([C()], Ue.prototype, "limit", void 0), _("joe-entity-picker", Ue);
//#endregion
//#region src/components/sheet.ts
var We = class extends P {
	constructor(...e) {
		super(...e), this.label = "", this.closeLabel = "", this.wide = !1, this.onScrim = (e) => {
			e.composedPath()[0] === this && this.close();
		};
	}
	static {
		this.styles = D`
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
		return j`<div
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
b([A()], We.prototype, "label", void 0), b([A()], We.prototype, "closeLabel", void 0), b([A({
	type: Boolean,
	reflect: !0
})], We.prototype, "wide", void 0), b([De(".panel")], We.prototype, "panel", void 0), _("joe-sheet", We);
//#endregion
//#region src/components/sim-switch.ts
var Ge = {
	simulation: "mdi:pause",
	advisory: "mdi:comment-question-outline",
	live: "mdi:play",
	off: "mdi:power"
}, Ke = class extends P {
	constructor(...e) {
		super(...e), this.mode = "simulation", this.compact = !1, this.running = !1;
	}
	static {
		this.styles = D`
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
		return e ? j`<button
      type="button"
      class="${this.mode}${this.running ? " running" : ""}"
      aria-label=${e("mode.switch.label")}
      @click=${this.toggle}
    >
      <span class="knob"><ha-icon icon=${Ge[this.mode]}></ha-icon></span>
      <span>
        <b>${e(`mode.${this.mode}`)}</b>
        ${this.compact ? T : j`<small>${e(`mode.${this.mode}.sub`)}</small>`}
      </span>
    </button>` : T;
	}
	toggle() {
		this.dispatchEvent(new CustomEvent("joe-mode-switch", {
			bubbles: !0,
			composed: !0
		}));
	}
};
b([A()], Ke.prototype, "mode", void 0), b([A({ type: Boolean })], Ke.prototype, "compact", void 0), b([A({ type: Boolean })], Ke.prototype, "running", void 0), b([A({ attribute: !1 })], Ke.prototype, "t", void 0), _("joe-sim-switch", Ke);
//#endregion
//#region src/components/texts.ts
function qe(e, t) {
	return t == null ? "–" : s(e.lang, t * 100, 2);
}
function Je(e, t, n = !0) {
	let r;
	return r = t.kind === "fixed_window" && t.window ? t.night_price == null && t.day_price == null ? e("tariff.window_only", {
		start: t.window.start,
		end: t.window.end
	}) : e("find.tariff.window", {
		start: t.window.start,
		end: t.window.end,
		night: qe(e, t.night_price),
		day: qe(e, t.day_price)
	}) : t.kind === "dynamic" ? t.night_price != null && t.day_price != null ? e("find.tariff.dynamic", {
		night: qe(e, t.night_price),
		day: qe(e, t.day_price)
	}) : e("tariff.dynamic") : t.kind === "flat" ? t.day_price == null ? e("tariff.flat") : e("find.tariff.flat", { day: qe(e, t.day_price) }) : e("find.tariff.unknown"), n && t.feed_in_price != null && (r += ` · ${e("find.tariff.feedin", { price: qe(e, t.feed_in_price) })}`), r;
}
function Ye(e, t) {
	let n = {};
	for (let [r, i] of Object.entries(t)) typeof i == "number" ? n[r] = s(e.lang, i, 2) : typeof i == "string" && (n[r] = i);
	typeof t.role == "string" && (n.role = e.optional(`role.${t.role}`) ?? t.role);
	let r = `check.${t.code}`;
	return t.code === "grid_sign" && typeof t.expected == "number" && typeof t.actual == "number" && (r = t.expected < 0 ? "check.grid_sign.export" : "check.grid_sign.import", n.expected = s(e.lang, Math.abs(t.expected), 1), n.actual = s(e.lang, Math.abs(t.actual), 1)), e.optional(r, n) ?? t.code;
}
//#endregion
//#region src/config.ts
var Xe = /\[[^\]]*\]|[^.[]+/g;
function Ze(e) {
	let t = [], n = "";
	for (let r of e.match(Xe) ?? []) n = !n || r.startsWith("[") ? n + r : `${n}.${r}`, t.push(n);
	return t.reverse();
}
function F(e, t) {
	for (let n of Ze(t)) {
		let t = e.provenance[n];
		if (t) return t;
	}
}
function I(e, t) {
	return e.answers.ignored.includes(t);
}
function Qe(e, t, n) {
	let r = e.answers.ignored.filter((e) => e !== t);
	return n ? [...r, t] : r;
}
function L(e, t, n = "user") {
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
function R(e, t) {
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
function $e(e, t = []) {
	let n = /* @__PURE__ */ new Set(), r = [];
	for (let i of [...e, ...t.map((e) => ({ entity_id: e.entity_id }))]) n.has(i.entity_id) || (n.add(i.entity_id), r.push(i));
	return r;
}
function et(e) {
	return {
		entity_id: e.entity.entity_id,
		confidence: e.confidence,
		reasons: e.reasons
	};
}
//#endregion
//#region src/device-model.ts
var tt = [
	"battery",
	"climate",
	"car",
	"hot_water",
	"other",
	"grid"
], nt = {
	battery: "mdi:home-battery-outline",
	climate: "mdi:thermostat",
	car: "mdi:car-electric",
	hot_water: "mdi:water-boiler",
	other: "mdi:power-plug-outline",
	grid: "mdi:transmission-tower"
}, rt = /(^|[^\p{L}\d])(e-?auto|auto|car|ev|wallbox)([^\p{L}\d]|$)/iu;
function it(e) {
	if (e.id.startsWith("hot_water_")) return "hot_water";
	if (e.id.startsWith("ev_")) return "car";
	if (e.id.startsWith("custom_")) return "other";
}
function at(e, t) {
	if (e.kind === "target") return "hot_water";
	if (e.point != null || t?.kind === "ev") return "car";
	if (t?.kind === "hot_water") return "hot_water";
	let n = it(e);
	return n === "hot_water" || n === "car" ? n : !t && !n && rt.test(`${e.id} ${e.name}`) ? "car" : "other";
}
function ot(e, t) {
	let n = t.consumer_id ? e.consumers.find((e) => e.id === t.consumer_id) : void 0, r = at(t, n);
	return r === "car" ? {
		group: r,
		id: `point:${t.id}`
	} : r === "other" ? n && n.kind !== "climate" && e.actions.find((e) => e.consumer_id === n.id && at(e, n) === "other")?.id === t.id ? {
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
function z(e) {
	return e.group === "car" && e.id.startsWith("point:") ? l(e.id.slice(6)) : {
		tab: "devices",
		section: e.group,
		id: e.id
	};
}
function st(e, t) {
	return {
		tab: "devices",
		section: "add",
		id: e,
		sub: e ? t : void 0
	};
}
function ct(e, t, n) {
	if (!e) return;
	let r = n ? e.entities?.[n] : void 0, i = t ?? r?.device_id ?? void 0, a = r?.area_id ?? (i ? e.devices?.[i]?.area_id : void 0);
	return a ? e.areas?.[a]?.name : void 0;
}
function lt(e, t) {
	return (t ? e?.entities?.[t]?.device_id : void 0) ?? void 0;
}
function ut(e, t) {
	return lt(e, t.power_entity) ?? lt(e, t.energy_entity);
}
function dt(e, t) {
	let n = t.filter((e) => !!e);
	return {
		...e,
		problems: n,
		problem: n[0]
	};
}
function ft(e, t) {
	return t ? e.optional(`devices.problem.${t}`) ?? t : void 0;
}
function pt(e) {
	return e.level === "warn" || e.code === "tariff_unknown" || e.code === "missing" && e.role === "grid_power";
}
function mt(e, t, n, r = {}) {
	let i = t.config, a = t.control, o = (r.checks ?? []).filter(pt), s = [];
	for (let t of i.batteries) {
		let r = t.adapter !== "none", i = a?.ready[t.id], c = t.device_id ?? lt(n, t.soc_entity);
		s.push(dt({
			group: "battery",
			id: t.id,
			name: t.name,
			area: ct(n, c, t.soc_entity),
			icon: nt.battery,
			deviceId: c,
			entityId: t.soc_entity,
			role: r ? "steers" : "watches",
			battery: t
		}, [
			...o.filter((e) => e.battery_id === t.id).map((t) => Ye(e, t)),
			r ? ft(e, a?.batteries[t.id]?.problem) : void 0,
			r && i && i !== "ready" && i !== "not_controllable" ? ft(e, i === "outdated" ? "not_tested" : i) : void 0
		]));
	}
	let l = i.climate?.rooms ?? {}, u = r.climateFound?.devices, d = u ? u.map((e) => e.entity_id) : Object.keys(l);
	for (let e of Object.keys(l)) d.includes(e) || d.push(e);
	let f = i.consumers.filter((e) => e.kind === "climate"), p = /* @__PURE__ */ new Set();
	for (let r of d) {
		let i = u?.find((e) => e.entity_id === r), a = l[r], o = i?.device_id ?? lt(n, r), d = a?.meter && a.meter !== "none" ? a.meter : void 0, m = f.find((e) => {
			let t = ut(n, e);
			return t !== void 0 && !p.has(e.id) && (t === o || t === d?.device_id);
		}) ?? f.find((e) => !p.has(e.id) && i && e.name.trim().toLowerCase() === i.name.trim().toLowerCase());
		m && p.add(m.id);
		let h = t.climate?.rooms[r]?.error;
		s.push(dt({
			group: "climate",
			id: r,
			name: i?.name ?? (n ? c(n, r) : r),
			area: i?.area ?? ct(n, o, r),
			icon: nt.climate,
			deviceId: o,
			entityId: r,
			role: a?.enabled ? "steers" : "watches",
			climate: i,
			room: a,
			meter: d ? {
				deviceId: d.device_id,
				power: d.power ?? void 0
			} : void 0,
			consumer: m
		}, [u && !i ? e("devices.problem.gone") : void 0, h ? e.optional(`week.error.${h}`) ?? e("week.error", { error: h }) : void 0]));
	}
	for (let e of f.filter((e) => !p.has(e.id))) {
		let t = ut(n, e);
		s.push(dt({
			group: "climate",
			id: e.id,
			name: e.name,
			area: ct(n, t, e.power_entity ?? e.energy_entity),
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
	}, _ = /* @__PURE__ */ new Set(), ee = (t, r, i) => {
		let o = t.consumer_id ? m.get(t.consumer_id) : void 0, s = r === "car" ? t.entity_id : r === "hot_water" ? t.sensor_entity ?? t.entity_id : t.entity_id, c = lt(n, t.entity_id) ?? (o ? ut(n, o) : void 0) ?? lt(n, s);
		return dt({
			group: r,
			id: i,
			name: i === o?.id ? o.name : t.name,
			area: ct(n, c, s || void 0),
			deviceId: c,
			entityId: s || void 0,
			role: t.enabled ? "steers" : "watches",
			action: t,
			consumer: o,
			point: r === "car" || void 0,
			icon: r === "car" ? "mdi:ev-station" : nt[r],
			noMeter: r === "other" && !o
		}, [ft(e, a?.actions?.[t.id]?.problem)]);
	};
	for (let e of i.cars ?? []) {
		let r = g(t, e.id, "soc")?.entity, i = (e.sources.find((e) => e.kind === "car") ?? e.sources[0])?.device_id ?? lt(n, r);
		h.car.push(dt({
			group: "car",
			id: e.id,
			name: e.name,
			area: ct(n, i, r),
			icon: nt.car,
			deviceId: i ?? void 0,
			entityId: r,
			role: e.need.enabled ? "steers" : "watches",
			car: e
		}, []));
	}
	for (let e of i.actions) {
		let t = ot(i, e);
		e.consumer_id && t.group !== "other" && _.add(e.consumer_id), e.consumer_id && t.id === e.consumer_id && _.add(e.consumer_id), h[t.group].push(ee(e, t.group, t.id));
	}
	for (let e of i.consumers) {
		if (e.kind === "climate" || _.has(e.id)) continue;
		let t = e.kind === "ev" ? "car" : e.kind === "hot_water" ? "hot_water" : "other", r = ut(n, e), i = e.power_entity ?? e.energy_entity ?? void 0, a = dt({
			group: t,
			id: e.id,
			name: e.name,
			area: ct(n, r, i),
			icon: t === "other" ? nt.other : nt[t],
			deviceId: r,
			entityId: i,
			role: "measures",
			consumer: e,
			setup: t === "other" ? void 0 : t === "car" ? "wallbox" : t
		}, []);
		h[t].push(a);
	}
	let te = new Map(i.consumers.map((e, t) => [e.id, t]));
	h.other.sort((e, t) => (te.get(e.id) ?? Infinity) - (te.get(t.id) ?? Infinity)), s.push(...h.car, ...h.hot_water, ...h.other);
	let v = i.measurements, ne = (t) => o.filter((e) => t === "connection" ? e.role === "grid_power" || e.code === "grid_sign" || e.code === "tariff_unknown" : t === "home" ? e.role === "home_power" || e.code === "home_negative" : e.role === "solar_power").map((t) => Ye(e, t)), y = (e, t, r, i) => dt({
		group: "grid",
		id: e,
		part: e,
		name: t,
		icon: r,
		deviceId: lt(n, i),
		entityId: i ?? void 0,
		area: ct(n, void 0, i),
		role: "measures"
	}, ne(e));
	return s.push(y("connection", e("devices.grid.connection"), "mdi:transmission-tower", v.grid_power?.entity_id)), (v.solar_power.length || i.forecast.provider) && s.push(y("solar", e("devices.grid.solar"), "mdi:solar-power-variant", v.solar_power[0]?.entity_id)), s.push(y("home", e("devices.grid.home"), "mdi:home-lightning-bolt-outline", v.home_power?.entity_id)), s;
}
function ht(e) {
	return tt.filter((t) => t === "grid" || e.some((e) => e.group === t));
}
function gt(e, t, n) {
	return n === void 0 ? void 0 : e.find((e) => e.group === t && e.id === n);
}
function _t(e, t) {
	return e.some((e) => e.group === t && e.problems.length > 0);
}
function vt(e, t) {
	return `${e}:${t}`;
}
function yt(e, t) {
	if (!t) return [];
	let n = [];
	for (let r of t.batteries) {
		let t = vt("battery", r.id);
		!e.batteries.some((e) => e.id === r.id) && !I(e, t) && n.push({
			kind: "battery",
			key: t,
			name: r.name,
			battery: r
		});
	}
	for (let r of t.wallboxes.filter((e) => e.is_car)) {
		let t = vt("wallbox", r.device_id ?? r.name);
		!e.actions.some((e) => e.id === `ev_${r.device_id}` || r.mode_entity && e.entity_id === r.mode_entity) && !I(e, t) && n.push({
			kind: "wallbox",
			key: t,
			name: r.name,
			wallbox: r
		});
	}
	for (let r of t.cars ?? []) {
		let t = vt("car", r.device_id);
		!(e.cars ?? []).some((e) => e.sources.some((e) => e.device_id === r.device_id) || r.entities.soc && e.need.soc_entity === r.entities.soc || r.entities.range && e.need.range_entity === r.entities.range) && !I(e, t) && n.push({
			kind: "car",
			key: t,
			name: r.name,
			car: r
		});
	}
	return n;
}
function bt(e, t) {
	return (t?.batteries ?? []).filter((t) => I(e, vt("battery", t.id)) && !e.batteries.some((e) => e.id === t.id));
}
//#endregion
//#region src/components/calendar-flow.ts
var xt = class extends P {
	constructor(...e) {
		super(...e), this.variant = "calendar", this.address = "", this.calendar = "";
	}
	static {
		this.styles = D`
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
		return e ? j`<ol aria-label=${e(`flow.${this.variant}.title`)}>
      ${this.steps(e).map((e, t) => j`<li class=${e.joe ? "joe" : ""}>
          <span class="badge" aria-hidden="true">
            <ha-icon icon=${e.icon}></ha-icon>
            <span class="number">${t + 1}</span>
          </span>
          <span .innerHTML=${this.bold(e.text)}></span>
        </li>`)}
    </ol>` : T;
	}
	bold(e) {
		return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
	}
};
b([A({ attribute: !1 })], xt.prototype, "t", void 0), b([A()], xt.prototype, "variant", void 0), b([A()], xt.prototype, "address", void 0), b([A()], xt.prototype, "calendar", void 0), _("joe-calendar-flow", xt);
//#endregion
//#region src/components/car-account.ts
var St = [
	"google",
	"outlook",
	"microsoft",
	"icloud",
	"infomaniak",
	"caldav"
], Ct = /* @__PURE__ */ new Set([
	"google",
	"outlook",
	"microsoft"
]), wt = {
	kind: "outlook",
	address: "",
	username: null,
	url: null,
	client_id: null,
	tenant: "common",
	accept: !0
}, Tt = class extends P {
	constructor(...e) {
		super(...e), this.actionId = "", this.saved = !1, this.password = "", this.secret = "", this.busy = !1, this.ownApp = !1;
	}
	static {
		this.styles = [x, D`
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
		if (!e) return T;
		let t = this.account, r = Ct.has(t.kind);
		return j`<div class="field" data-tipped>
        <div class="head-row"><label for="account-kind"><b>${e("calendar.account.kind")}</b></label> ${n(e, "calendar_account")}</div>
        <select id="account-kind" class="input" @change=${(e) => this.set({ kind: e.target.value })}>
          ${St.map((n) => j`<option value=${n} ?selected=${n === t.kind}>${e(`calendar.account.kind.${n}`)}</option>`)}
        </select>
      </div>
      <div class="field" data-tipped>
        <div class="head-row"><label for="account-address"><b>${e("calendar.account.address")}</b></label> ${n(e, "calendar_account_address")}</div>
        <input
          id="account-address"
          class="input"
          type="email"
          autocomplete="off"
          placeholder=${e(`calendar.account.placeholder.${t.kind}`)}
          .value=${t.address}
          @change=${(e) => this.set({ address: e.target.value.trim().toLowerCase() })}
        />
        ${t.kind === "google" ? j`<p class="hint">${e("calendar.account.google.hint")}</p>` : T}
      </div>
      ${r ? this.renderSignIn(e, t) : this.renderPassword(e, t)}
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
        ${n(e, "calendar_account_accept")}
      </div>
      ${this.renderStatus(e)}`;
	}
	get account() {
		return {
			...wt,
			...this.need?.account ?? {}
		};
	}
	joeApp(e) {
		return e === "google" ? !!this.apps?.google : !!this.apps?.microsoft;
	}
	renderSignIn(e, t) {
		let r = this.status, i = r?.oauth, a = t.kind === "google", o = this.joeApp(t.kind), s = !o || this.ownApp || !!t.client_id || t.kind === "microsoft", c = !!r?.has_sign_in, l = this.signInError ?? (i?.state === "error" ? i.error : void 0);
		return j`${s ? this.renderOwnApp(e, t, o) : T}
      <div class="field" data-tipped>
        <div class="inline">
          <button type="button" class="mini-btn go" ?disabled=${this.busy} @click=${() => this.act("sign_in")}>
            <ha-icon icon=${a ? "mdi:google" : "mdi:microsoft"}></ha-icon>${e(c ? "mail.sign_in.again" : a ? "mail.sign_in.google" : "mail.sign_in")}
          </button>
          ${c ? j`<button type="button" class="mini-btn quiet" @click=${() => this.act("sign_out")}>${e("mail.sign_out")}</button>` : T}
          ${s ? T : j`<button type="button" class="mini-btn quiet" @click=${() => this.ownApp = !0}>${e("calendar.account.own_app")}</button>`}
          ${n(e, "mail_sign_in")}
        </div>
        ${i?.state === "waiting" && !this.signInError ? j`<p class="code">${e("mail.sign_in.code", { code: i.user_code ?? "" })}
              <a href=${i.uri ?? ""} target="_blank" rel="noreferrer noopener">${i.uri}</a></p>` : l ? j`<p class="bad">${e.optional(`calendar.account.oauth.${l}`) ?? e("calendar.account.oauth.other")}</p>` : c ? j`<p class="hint ok">${e("mail.signed_in")}</p>` : T}
      </div>`;
	}
	renderOwnApp(e, t, r) {
		let i = t.kind === "google";
		return j`<div class="field" data-tipped>
      <div class="head-row">
        <b>${e(r ? "calendar.account.client_id" : "calendar.account.client_id.needed")}</b>
        ${n(e, i ? "google_app" : "mail_microsoft")}
      </div>
      ${r ? T : j`<p class="hint">${e("calendar.account.no_joe_app")}</p>`}
      <div class="inline">
        <input
          class="input"
          type="text"
          autocomplete="off"
          placeholder=${i ? "1234567890-abc.apps.googleusercontent.com" : "00000000-0000-0000-0000-000000000000"}
          aria-label=${e("calendar.account.client_id")}
          .value=${t.client_id ?? ""}
          @change=${(e) => this.set({ client_id: e.target.value.trim() || null })}
        />
        ${t.kind === "microsoft" ? j`<input
              class="input"
              type="text"
              placeholder="common"
              aria-label=${e("mail.tenant")}
              .value=${t.tenant}
              @change=${(e) => this.set({ tenant: e.target.value.trim() || "common" })}
            />` : T}
      </div>
      ${i ? j`<form
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
          ${this.status?.has_client_secret ? j`<p class="hint ok">${e("mail.password.saved")}</p>` : T}` : T}
    </div>`;
	}
	renderPassword(e, t) {
		return j`${t.kind === "caldav" ? j`<div class="field" data-tipped>
            <div class="head-row"><b>${e("calendar.account.url")}</b> ${n(e, "calendar_account_url")}</div>
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
          </div>` : T}
      <div class="field" data-tipped>
        <div class="head-row"><label for="account-password"><b>${e("calendar.account.password")}</b></label> ${n(e, "calendar_account_password")}</div>
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
        ${this.status?.has_password ? j`<p class="hint ok">${e("mail.password.saved")}</p>` : T}
      </div>`;
	}
	renderStatus(e) {
		let t = this.status, r = Ct.has(this.account.kind) ? t?.has_sign_in : t?.has_password, i = this.saved ? t?.state === "error" ? e("mail.state.error", { error: e.optional(`calendar.account.error.${t.error}`) ?? e("calendar.account.error.other") }) : t?.checked ? e("mail.state.ok", { time: v(t.checked) }) : "" : e("calendar.account.after_save");
		return j`<div class="inline" data-tipped>
      <button type="button" class="mini-btn" ?disabled=${this.busy || !r} @click=${() => this.act("test")}>
        <ha-icon icon="mdi:calendar-check-outline"></ha-icon>${e("calendar.account.test")}
      </button>
      ${n(e, "calendar_account_test")}
      <span class=${this.saved && t?.state === "error" ? "bad" : "hint"}>${i}</span>
      ${this.result ? j`<span class=${this.result === "ok" ? "ok" : "bad"}>
            ${e.optional(`calendar.account.result.${this.result}`) ?? e("calendar.account.result.other")}
          </span>` : T}
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
b([A({ attribute: !1 })], Tt.prototype, "hass", void 0), b([A({ attribute: !1 })], Tt.prototype, "t", void 0), b([A()], Tt.prototype, "actionId", void 0), b([A({ type: Boolean })], Tt.prototype, "saved", void 0), b([A({ attribute: !1 })], Tt.prototype, "need", void 0), b([A({ attribute: !1 })], Tt.prototype, "status", void 0), b([A({ attribute: !1 })], Tt.prototype, "apps", void 0), b([C()], Tt.prototype, "password", void 0), b([C()], Tt.prototype, "secret", void 0), b([C()], Tt.prototype, "result", void 0), b([C()], Tt.prototype, "signInError", void 0), b([C()], Tt.prototype, "busy", void 0), b([C()], Tt.prototype, "ownApp", void 0), _("joe-car-account", Tt);
//#endregion
//#region src/components/car-mailbox.ts
var Et = [
	"webde",
	"gmx",
	"google",
	"tonline",
	"other"
], Dt = {
	"web.de": "webde",
	"gmx.de": "gmx",
	"gmx.net": "gmx",
	"gmx.at": "gmx",
	"gmx.ch": "gmx",
	"gmail.com": "google",
	"googlemail.com": "google",
	"t-online.de": "tonline"
}, Ot = {
	provider: "other",
	address: "",
	username: null,
	imap_host: null,
	imap_port: null,
	smtp_host: null,
	smtp_port: null,
	smtp_security: null,
	accept: !0
}, kt = class extends P {
	constructor(...e) {
		super(...e), this.actionId = "", this.saved = !1, this.password = "", this.busy = !1, this.servers = !1;
	}
	static {
		this.styles = [x, D`
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
		if (!e) return T;
		let t = this.mailbox, r = this.servers || t.provider === "other" && !!t.address;
		return j`<div class="field" data-tipped>
        <div class="head-row"><label for="mail-address"><b>${e("mail.address")}</b></label> ${n(e, "mail_address")}</div>
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
        <div class="head-row"><label for="mail-provider"><b>${e("mail.provider")}</b></label> ${n(e, "mail_provider")}</div>
        <select id="mail-provider" class="input" @change=${(e) => this.set({ provider: e.target.value })}>
          ${Et.map((n) => j`<option value=${n} ?selected=${n === t.provider}>${e(`mail.provider.${n}`)}</option>`)}
        </select>
        <p class="hint">${e(`mail.provider.${t.provider}.hint`)}</p>
      </div>
      ${this.renderPassword(e)} ${r ? this.renderServers(e, t) : T}
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
        ${n(e, "mail_accept")}
        ${r ? T : j`<button type="button" class="mini-btn quiet" @click=${() => this.servers = !0}>${e("mail.servers.change")}</button>`}
      </div>
      ${this.renderStatus(e)} ${this.renderRecent(e)}`;
	}
	get mailbox() {
		return {
			...Ot,
			...this.need?.mailbox ?? {}
		};
	}
	renderPassword(e) {
		return j`<div class="field" data-tipped>
      <div class="head-row"><label for="mail-password"><b>${e("mail.password")}</b></label> ${n(e, "mail_password")}</div>
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
      ${this.status?.has_secret ? j`<p class="hint ok">${e("mail.password.saved")}</p>` : j`<p class="hint">${e("mail.password.hint")}</p>`}
    </div>`;
	}
	renderServers(e, t) {
		let r = (n) => j`<input
      class="input"
      type="text"
      aria-label=${e(`mail.${n}`)}
      placeholder=${e(`mail.${n}`)}
      .value=${t[n] ?? ""}
      @change=${(e) => this.set({ [n]: e.target.value.trim() || null })}
    />`, i = (n) => j`<input
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
		return j`<div class="field" data-tipped>
      <div class="head-row"><b>${e("mail.servers")}</b> ${n(e, "mail_servers")}</div>
      <p class="hint">${e("mail.servers.hint")}</p>
      <div class="inline">${r("username")}</div>
      <div class="inline">${r("imap_host")} ${i("imap_port")}</div>
      <div class="inline">
        ${r("smtp_host")} ${i("smtp_port")}
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
		return j`<div class="field" data-tipped>
      <div class="inline">
        <button type="button" class="mini-btn" ?disabled=${this.busy || !this.status?.has_secret} @click=${() => this.act("test")}>
          <ha-icon icon="mdi:connection"></ha-icon>${e("mail.test")}
        </button>
        ${this.saved ? j`<button type="button" class="mini-btn" ?disabled=${this.busy || !this.status?.has_secret} @click=${() => this.act("check")}>
              <ha-icon icon="mdi:email-sync-outline"></ha-icon>${e("mail.check")}
            </button>` : T}
        ${n(e, "mail_status")}
      </div>
      <p class=${this.saved && this.status?.state === "error" ? "hint bad" : "hint"}>
        ${this.saved ? this.statusText(e) : e("mail.after_save")}
      </p>
      ${this.result ? j`<p class=${this.result === "ok" ? "hint ok" : "hint bad"} role="status">
            ${e.optional(`mail.result.${this.result}`) ?? e("mail.result.failed")}
          </p>` : T}
    </div>`;
	}
	renderRecent(e) {
		let t = this.status?.recent ?? [];
		if (!t.length) return T;
		let r = this.need?.allowed ?? [];
		return j`<div class="field" data-tipped>
      <div class="head-row"><b>${e("mail.recent")}</b> ${n(e, "mail_recent")}</div>
      <ul>
        ${t.slice(0, 8).map((t) => j`<li>
            <span class="what">
              ${t.summary || "–"} ${t.start && t.start.includes("T") ? `· ${t.start.slice(8, 10)}.${t.start.slice(5, 7)}. ${v(t.start)}` : ""}
              · ${t.from}
            </span>
            <span class=${t.result.startsWith("not") || t.result.endsWith("not_accepted") || t.result.startsWith("no_") ? "bad" : ""}>
              ${e.optional(`mail.recent.${t.result}`) ?? t.result}
            </span>
            ${t.result === "not_allowed" && !r.includes(t.from) ? j`<button type="button" class="mini-btn" @click=${() => this.change({ allowed: [...r, t.from] })}>${e("mail.allow")}</button>` : T}
          </li>`)}
      </ul>
    </div>`;
	}
	statusText(e) {
		let t = this.status;
		return !t || t.state === "off" || t.state === "waiting" ? e("mail.state.waiting") : t.state === "no_secret" ? e("mail.state.no_secret") : t.state === "error" ? e("mail.state.error", { error: e.optional(`mail.error.${t.error}`) ?? String(t.error) }) : e("mail.state.ok", { time: t.checked ? v(t.checked) : "–" });
	}
	setAddress(e) {
		let t = Dt[e.split("@")[1] ?? ""], n = this.mailbox, r = n.provider === "other" || n.provider === Dt[n.address.split("@")[1] ?? ""];
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
b([A({ attribute: !1 })], kt.prototype, "hass", void 0), b([A({ attribute: !1 })], kt.prototype, "t", void 0), b([A()], kt.prototype, "actionId", void 0), b([A({ type: Boolean })], kt.prototype, "saved", void 0), b([A({ attribute: !1 })], kt.prototype, "need", void 0), b([A({ attribute: !1 })], kt.prototype, "status", void 0), b([C()], kt.prototype, "password", void 0), b([C()], kt.prototype, "busy", void 0), b([C()], kt.prototype, "result", void 0), b([C()], kt.prototype, "servers", void 0), _("joe-car-mailbox", kt);
//#endregion
//#region src/components/car-calendars.ts
var At = [
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
], jt = [
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
], B = class extends P {
	constructor(...e) {
		super(...e), this.actionId = "", this.savedSource = null, this.carName = "", this.copied = !1, this.copyFailed = !1, this.linksFailed = !1, this.sender = "";
	}
	static {
		this.styles = [x, D`
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
		if (!e || !t) return T;
		let r = this.need?.source ?? "ha";
		return j`<div data-tipped>
        <div class="head-row"><b>${e("calendar.source")}</b> ${n(e, "calendar_source")}</div>
        <div class="ways-box"><div class="ways" role="radiogroup" aria-label=${e("calendar.source")}>
          ${At.map((t) => j`<button
              type="button"
              class="way"
              role="radio"
              aria-checked=${String(r === t.source)}
              @click=${() => this.change({ source: t.source })}
            >
              <ha-icon icon=${t.icon}></ha-icon>
              <b>${e(`calendar.way.${t.source}`)}</b>
              <small>${e(`calendar.way.${t.source}.hint`)}</small>
            </button>`)}
        </div></div>
      </div>
      ${r === "mailbox" ? this.renderMailbox(e, t) : r === "account" ? this.renderAccount(e) : this.renderCalendar(e, t)}
      ${this.linksFailed ? j`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("calendar.links_failed")}</span>
            <button type="button" class="mini-btn quiet" @click=${() => this.load(!1)}>${e("calendar.retry")}</button>
          </div>` : T}`;
	}
	saved(e) {
		return this.savedSource === e;
	}
	renderLegacy(e, t) {
		let r = this.savedSource && this.savedSource !== "mailbox" && this.savedSource === (this.need?.source ?? "ha") ? this.links?.entities[this.actionId] : null;
		return r ? j`<div class="own" data-tipped>
          <div class="head-row"><ha-icon icon="mdi:calendar-clock"></ha-icon><b>${e("calendar.own.legacy")}</b> ${n(e, "calendar_legacy")}</div>
          <p class="hint">${e("calendar.own.legacy.hint", { name: c(t, r) })}</p>
        </div>` : T;
	}
	renderCalendar(e, t) {
		let r = this.need?.calendars ?? [];
		return j`<div class="part">
        <joe-calendar-flow .t=${e} variant="calendar"></joe-calendar-flow>
      </div>
      ${this.renderLegacy(e, t)}
      <div data-tipped>
        <div class="head-row"><b>${e("calendar.pick")}</b> ${n(e, "calendar_more")}</div>
        <div class="chips">
          ${r.map((n) => j`<span class="chip">
              ${c(t, n)}
              <button
                type="button"
                class="mini-btn quiet"
                aria-label=${e("calendar.remove", { name: c(t, n) })}
                @click=${() => this.change({ calendars: r.filter((e) => e !== n) })}
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
          ${jt.map((t) => j`<a class="mini-btn" href=${t.url} target="_blank" rel="noreferrer noopener">
                <ha-icon icon="mdi:open-in-new"></ha-icon>${e(`calendar.connect.${t.key}`)}
              </a>`)}
          ${n(e, "calendar_connect")}
        </div>
      </div>`;
	}
	async pick() {
		let e = this.t, t = await R(this, {
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
		let n = this.saved("mailbox"), r = n ? this.links?.entities[this.actionId] : null, i = r ? c(t, r) : e("calendar.own.name", { car: this.carName });
		return j`<div class="part">
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
	renderOwn(e, t, r) {
		let i = j`<div class="head-row">
      <ha-icon icon="mdi:calendar-import"></ha-icon><b>${e("calendar.own")}</b> ${n(e, "calendar_own")}
    </div>`;
		if (!r) return j`<div class="own" data-tipped>${i}<p class="hint">${e("calendar.own.after_save", { name: t })}</p></div>`;
		let a = this.links?.links[this.actionId], o = this.links?.external_url, s = a && o ? `${o.replace(/\/$/, "")}${a}` : null;
		return j`<div class="own" data-tipped>
      ${i}
      <p class="hint">${e("calendar.own.hint", { name: t })}</p>
      ${s ? j`<div class="link">
            <code>${s}</code>
            <button type="button" class="mini-btn" @click=${() => this.copy(s)}>
              <ha-icon icon=${this.copied ? "mdi:check" : "mdi:content-copy"}></ha-icon>${e(this.copied ? "calendar.copied" : "calendar.copy")}
            </button>
            <button type="button" class="mini-btn quiet" @click=${() => this.load(!0)}>
              <ha-icon icon="mdi:refresh"></ha-icon>${e("calendar.renew")}
            </button>
            ${n(e, "calendar_link")}
          </div>
          ${this.copyFailed ? j`<p class="hint bad">${e("calendar.copy_failed")}</p>` : T}` : j`<p class="hint">${e("calendar.no_external")}</p>`}
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
		return j`<div class="part">
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
      ${this.renderAllowed(e, "account_allowed")} ${this.hass ? this.renderLegacy(e, this.hass) : T}`;
	}
	renderAllowed(e, t = "mail_allowed") {
		let r = this.need?.allowed ?? [];
		return j`<div class="part" data-tipped>
      <div class="head-row"><b>${e("mail.allowed")}</b> ${n(e, t)}</div>
      <p class="hint">${e("mail.allowed.hint")}</p>
      ${r.length ? j`<div class="chips">
            ${r.map((t) => j`<span class="chip">
                ${t}
                <button
                  type="button"
                  class="mini-btn quiet"
                  aria-label=${e("mail.allowed.remove", { rule: t })}
                  @click=${() => this.change({ allowed: r.filter((e) => e !== t) })}
                >
                  <ha-icon icon="mdi:close"></ha-icon>
                </button>
              </span>`)}
          </div>` : j`<div class="note warn"><ha-icon icon="mdi:account-alert-outline"></ha-icon><span>${e("mail.allowed.none")}</span></div>`}
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
b([A({ attribute: !1 })], B.prototype, "hass", void 0), b([A({ attribute: !1 })], B.prototype, "t", void 0), b([A()], B.prototype, "actionId", void 0), b([A({ attribute: !1 })], B.prototype, "savedSource", void 0), b([A({ attribute: !1 })], B.prototype, "need", void 0), b([A({ attribute: !1 })], B.prototype, "mailbox", void 0), b([A({ attribute: !1 })], B.prototype, "account", void 0), b([A({ attribute: !1 })], B.prototype, "apps", void 0), b([A()], B.prototype, "carName", void 0), b([C()], B.prototype, "links", void 0), b([C()], B.prototype, "copied", void 0), b([C()], B.prototype, "copyFailed", void 0), b([C()], B.prototype, "linksFailed", void 0), b([C()], B.prototype, "sender", void 0), _("joe-car-calendars", B);
//#endregion
//#region src/hot-water.ts
var Mt = [
	"warmwasser",
	"brauchwasser",
	"trinkwasser",
	"boiler",
	"hot_water",
	"hot water",
	"dhw",
	"water_heater",
	"water heater"
], Nt = [
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
], Pt = [
	"switch",
	"input_boolean",
	"select",
	"input_select",
	"number",
	"input_number",
	"button",
	"script"
];
function Ft(e, t) {
	let n = e.states[t], r = String(n?.attributes.friendly_name ?? ""), i = e.entities?.[t]?.device_id, a = i ? e.devices?.[i] : void 0;
	return `${t} ${r} ${a?.name_by_user ?? a?.name ?? ""}`.toLowerCase().replaceAll("-", " ");
}
function It(e, t) {
	return [...Mt, ...t].some((t) => e.includes(t));
}
function Lt(e) {
	return (e ?? "").toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((e) => e.length >= 5);
}
function Rt(e, t) {
	let n = Lt(t), r = [], i = [];
	for (let [t, a] of Object.entries(e.states)) {
		let o = t.split(".")[0], s = Ft(e, t);
		if (!It(s, n)) continue;
		let c = t.toLowerCase(), l = String(a.attributes.unit_of_measurement ?? "");
		if ((o === "sensor" || o === "number") && (l === "°C" || l === "°F")) {
			let e = (Mt.some((e) => c.includes(e.replace(" ", "_"))) ? 2 : 1) - (Nt.some((e) => s.includes(e)) ? 2 : 0);
			r.push({
				entity_id: t,
				score: e
			});
		} else Pt.includes(o) && i.push({
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
var zt = [
	"eq",
	"ne",
	"lt",
	"le",
	"gt",
	"ge"
], Bt = {
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
}, Vt = {
	vehicle_entity: null,
	connected_entity: null,
	soc_entity: null,
	range_entity: null,
	odometer_entity: null,
	cars: null,
	unknown: "ask",
	assume_car: null
}, Ht = {
	reserve_km: [0, 1e3],
	consumption: [5, 60],
	daily_km: [0, 2e3],
	capacity_kwh: [.1, 300],
	max_soc: [20, 100]
}, Ut = {
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
function Wt(e, t) {
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
		point: { ...Vt }
	} : e === "hot_water" ? {
		...n,
		kind: "target",
		forecast_below_kwh: 20,
		power_kw: .5,
		priority: 2
	} : n;
}
function Gt(e) {
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
			...Vt,
			vehicle_entity: n.vehicle ?? null,
			connected_entity: n.connected ?? null,
			soc_entity: n.vehicle_soc ?? null,
			range_entity: n.vehicle_range ?? null,
			odometer_entity: n.vehicle_odometer ?? null
		}
	};
}
function Kt(e) {
	return e === "ev" || e === "car" ? "point" : e === "hot_water" ? "hot_water" : "night";
}
function qt(e, t, n) {
	return t.entity_id ? t.kind === "target" && !t.sensor_entity ? e("action.problem.sensor") : "" : e("action.problem.entity");
}
function V(e, t, r, i) {
	return j`<div class="field" data-tipped>
    <div class="field-label">${t} ${n(e, r)}</div>
    ${i}
  </div>`;
}
function Jt(e, t, n) {
	let r = e.t, i = e.hass;
	return j`<div class="entity">
    <span>
      ${t ? j`<b>${c(i, t)}</b><small>${d(i, t, r.lang)}</small>` : j`<small>${r("find.none")}</small>`}
    </span>
    <button type="button" class="mini-btn" @click=${n}>
      <ha-icon icon="mdi:magnify"></ha-icon>${r(t ? "review.change" : "review.choose")}
    </button>
  </div>`;
}
function Yt(e) {
	let t = e.trim();
	if (t === "on" || t === "an") return !0;
	if (t === "off" || t === "aus") return !1;
	let n = Number(t.replace(",", "."));
	return t !== "" && Number.isFinite(n) ? n : t;
}
function Xt(e, t, n) {
	let r = Math.round(Number.parseFloat(e.target.value));
	return Math.min(n, Math.max(t, Number.isFinite(r) ? r : t));
}
function Zt(e, t, n, r) {
	let i = e.t, a = t.split(".", 1)[0], o = e.hass?.states[t]?.attributes.options ?? [];
	if (["select", "input_select"].includes(a) && o.length) return j`<select class="input" aria-label=${i("action.f.value")} @change=${(e) => r(e.target.value)}>
      ${o.map((e) => j`<option value=${e} ?selected=${n === e}>${e}</option>`)}
    </select>`;
	if ([
		"switch",
		"input_boolean",
		"light",
		"fan"
	].includes(a)) {
		let e = n === !0 || n === "on";
		return j`<div class="seg" role="group" aria-label=${i("action.f.value")}>
      <button type="button" aria-pressed=${String(e)} @click=${() => r("on")}>${i("action.value.on")}</button>
      <button type="button" aria-pressed=${String(!e)} @click=${() => r("off")}>${i("action.value.off")}</button>
    </div>`;
	}
	return j`<input
    class="input"
    type="text"
    aria-label=${i("action.f.value")}
    .value=${n == null ? "" : String(n)}
    @change=${(e) => r(Yt(e.target.value))}
  />`;
}
function Qt(e, t, n) {
	return j`<button type="button" class="switch" role="switch" aria-checked=${String(t)} aria-label=${e} @click=${n}></button>`;
}
function $t(e, t, n, r) {
	return j`<a class="mini-btn quiet go-link" href=${k(e || "/energy-joe", t)} aria-label=${r ?? n} @click=${E(t)}
    >${n}</a
  >`;
}
function en(e) {
	let t = e.t, n = e.draft;
	return V(t, t("action.f.name"), "a_name", j`<input
      class="input"
      type="text"
      maxlength="60"
      .value=${n.name}
      @change=${(t) => e.setDraft({ name: t.target.value.trim() || n.name })}
    />`);
}
function tn(e) {
	let t = e.t, n = e.draft;
	return V(t, t("action.f.kind"), "a_kind", j`<div class="seg" role="group" aria-label=${t("action.f.kind")}>
      ${["switch", "target"].map((r) => j`<button type="button" aria-pressed=${String(n.kind === r)} @click=${() => e.setDraft({ kind: r })}>
            ${t(`action.kind.${r}`)}
          </button>`)}
    </div>`);
}
function nn(e) {
	let t = e.t, n = e.draft;
	return j`${V(t, t("action.f.entity"), "a_entity", Jt(e, n.entity_id, () => vn(e)))}
    ${n.entity_id ? V(t, t("action.f.on_value"), "a_on_value", Zt(e, n.entity_id, n.on_value, (t) => e.setDraft({ on_value: t }))) : T}
    ${V(t, t("action.f.reset"), "a_reset", j`<div class="row">
        <div class="seg" role="group" aria-label=${t("action.f.reset")}>
          ${["previous", "fixed"].map((r) => j`<button type="button" aria-pressed=${String(n.reset === r)} @click=${() => e.setDraft({ reset: r })}>
                ${t(`action.reset.${r}`)}
              </button>`)}
        </div>
        ${n.reset === "fixed" && n.entity_id ? Zt(e, n.entity_id, n.reset_value ?? "", (t) => e.setDraft({ reset_value: t })) : T}
      </div>`)}
    ${V(t, t("action.f.lead"), "a_lead", j`<span class="unit-input">
        <input
          class="input"
          type="number"
          min="0"
          max="120"
          step="1"
          .value=${String(n.lead_min)}
          @change=${(t) => e.setDraft({ lead_min: Xt(t, 0, 120) })}
        />
        <span class="unit">min</span>
      </span>`)}`;
}
function rn(e) {
	let t = e.t, n = e.draft, r = (r, i) => j`<label>
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
	return j`${V(t, t("action.f.sensor"), "a_sensor", Jt(e, n.sensor_entity ?? "", () => yn(e)))}
    ${V(t, t("action.f.temps"), "a_temps", j`<div class="temps">${r("comfort", "°C")} ${r("maximum", "°C")} ${r("buffer", "K")}</div>`)}`;
}
function an(e) {
	let t = e.t, n = e.draft;
	return j`${V(t, t("action.f.auto"), "a_auto", j`<div class="row">
        ${Qt(t("action.f.auto"), n.auto, () => e.setDraft({ auto: !n.auto }))}
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
    ${n.auto ? on(e) : T}`;
}
function on(e) {
	let t = e.t, n = e.hass, r = e.draft, i = (t, n) => e.setDraft({ conditions: (e.draft?.conditions ?? []).map((e, r) => r === t ? {
		...e,
		...n
	} : e) });
	return V(t, t("action.f.conditions"), "a_conditions", j`${r.conditions.map((r, a) => j`<div class="condition">
          <span><b>${c(n, r.entity_id)}</b></span>
          <select
            class="input"
            aria-label=${t("action.f.op")}
            @change=${(e) => i(a, { op: e.target.value })}
          >
            ${zt.map((e) => j`<option value=${e} ?selected=${r.op === e}>${t(`action.op.${e}`)}</option>`)}
          </select>
          <input
            class="input"
            type="text"
            aria-label=${t("action.f.value")}
            .value=${String(r.value === !0 ? "on" : r.value === !1 ? "off" : r.value)}
            @change=${(e) => i(a, { value: Yt(e.target.value) })}
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
      <button type="button" class="mini-btn" @click=${() => xn(e)}>
        <ha-icon icon="mdi:plus"></ha-icon>${t("action.f.condition.add")}
      </button>`);
}
function sn(e) {
	let t = e.t, n = e.draft, r = e.config?.consumers ?? [];
	return j`${V(t, t("action.f.power"), "a_power", j`<span class="unit-input">
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
    ${r.length ? V(t, t("action.f.consumer"), "a_consumer", j`<select class="input" @change=${(t) => e.setDraft({ consumer_id: t.target.value || null })}>
            <option value="" ?selected=${!n.consumer_id}>${t("action.f.consumer.none")}</option>
            ${r.map((e) => j`<option value=${e.id} ?selected=${n.consumer_id === e.id}>${e.name}</option>`)}
          </select>`) : T}
    ${V(t, t("action.f.priority"), "a_priority", j`<span class="unit-input">
        <input
          class="input"
          type="number"
          min="1"
          max="9"
          step="1"
          .value=${String(n.priority)}
          @change=${(t) => e.setDraft({ priority: Xt(t, 1, 9) })}
        />
      </span>`)}`;
}
function cn(e) {
	let t = e.t, n = e.draft;
	return V(t, t("action.f.enabled"), "a_enabled", Qt(t("action.f.enabled"), n.enabled, () => e.setDraft({ enabled: !n.enabled })));
}
function ln(e, t) {
	e.setDraft({ need: {
		...Bt,
		...e.draft?.need ?? {},
		...t
	} });
}
function un(e, t, n, r = "") {
	let i = e.t, a = e.draft?.need ?? Bt, [o, s] = Ht[t], c = a[t];
	return j`<span class="unit-input">
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
		a || (r.value = c == null ? "" : String(c)), ln(e, { [t]: a ? i : c });
	}}
    />
    <span class="unit">${n}</span>
  </span>`;
}
function dn(e) {
	let t = e.t, n = e.draft?.need ?? Bt;
	return j`${V(t, t("action.need"), "a_need", j`<div class="row">
          ${Qt(t("action.need"), n.enabled, () => ln(e, { enabled: !(e.draft?.need ?? Bt).enabled }))}
          <span>${t(n.enabled ? "action.need.on" : "action.need.off")}</span>
        </div>
        <p class="field-hint">${t("action.need.hint")}</p>`)}
    ${n.enabled ? j`${V(t, t("action.need.reserve"), "a_need_reserve", un(e, "reserve_km", "km"))}
        ${V(t, t("action.need.max_soc"), "a_need_max_soc", un(e, "max_soc", "%"))}
        ${V(t, t("action.need.capacity"), "a_need_capacity", un(e, "capacity_kwh", "kWh", t("action.need.from_sensor")))}
        ${V(t, t("action.need.consumption"), "a_need_consumption", un(e, "consumption", "kWh/100 km", t("action.need.learned")))}
        ${V(t, t("action.need.daily"), "a_need_daily", un(e, "daily_km", "km", t("action.need.learned")))}` : T}`;
}
function fn(e) {
	let t = e.t, n = e.draft?.need ?? Bt, r = (t) => Jt(e, n[t] ?? "", () => bn(e, t));
	return j`${V(t, t("action.need.soc"), "a_need_soc", r("soc_entity"))}
    ${V(t, t("action.need.range"), "a_need_range", r("range_entity"))}
    ${V(t, t("action.need.capacity_sensor"), "a_need_capacity_sensor", r("capacity_entity"))}
    ${V(t, t("action.need.consumption_sensor"), "a_need_consumption_sensor", r("consumption_entity"))}
    ${V(t, t("action.need.odometer"), "a_need_odometer", r("odometer_entity"))}`;
}
function pn(e) {
	let t = e.t, n = e.draft, r = n.need ?? Bt, i = (e.config?.persons ?? []).filter((e) => e.calendars.length), a = i.map((e) => e.id), o = (t) => {
		let n = (e.draft?.need ?? Bt).persons ?? a, r = n.includes(t) ? n.filter((e) => e !== t) : [...n, t];
		ln(e, { persons: a.every((e) => r.includes(e)) ? null : r });
	};
	return j`${V(t, t("action.need.persons"), "a_need_persons", i.length ? j`<ul class="people" role="group" aria-label=${t("action.need.persons")}>
            ${i.map((n) => {
		let i = r.persons == null || r.persons.includes(n.id);
		return j`<li>
                <button type="button" class="mini-btn ${i ? "go" : "quiet"}" aria-pressed=${String(i)} @click=${() => o(n.id)}>
                  <ha-icon icon=${i ? "mdi:check" : "mdi:minus"}></ha-icon>${n.name}
                </button>
                ${$t(e.prefix, {
			tab: "household",
			section: "people",
			id: n.id
		}, t("action.need.person_open"), t("action.need.person_open_of", { name: n.name }))}
              </li>`;
	})}
          </ul>` : j`<p class="field-hint">${t("action.need.no_calendars")}</p>
            ${$t(e.prefix, {
		tab: "household",
		section: "people"
	}, t("action.need.people_link"))}`)}
    ${V(t, t("action.need.calendars"), "a_need_calendars", j`<joe-car-calendars
        .hass=${e.hass}
        .t=${t}
        actionId=${n.id}
        .savedSource=${e.existing?.need?.enabled ? e.existing.need.source ?? "ha" : null}
        .need=${r}
        .mailbox=${e.mailboxes?.[n.id]}
        .account=${e.accounts?.[n.id]}
        .apps=${e.apps}
        carName=${n.name}
        @joe-need=${(t) => ln(e, t.detail)}
      ></joe-car-calendars>`)}
    ${V(t, t("action.need.round_trip"), "a_need_round_trip", Qt(t("action.need.round_trip"), r.round_trip, () => ln(e, { round_trip: !(e.draft?.need ?? Bt).round_trip })))}
    ${e.config?.routing.service ? T : j`<div class="note">
          <ha-icon icon="mdi:map-marker-distance"></ha-icon>
          <span>${t("action.need.no_routing")} ${$t(e.prefix, {
		tab: "household",
		section: "travel"
	}, t("action.need.routing_link"))}</span>
        </div>`}`;
}
function mn(e, t) {
	e.setDraft({ point: {
		...Vt,
		...e.draft?.point ?? {},
		...t
	} });
}
function hn(e) {
	let t = e.t, n = e.draft?.point ?? Vt, r = e.config?.cars ?? [], i = r.map((e) => e.id), a = (t) => {
		let n = (e.draft?.point ?? Vt).cars ?? i, r = n.includes(t) ? n.filter((e) => e !== t) : [...n, t];
		mn(e, { cars: i.every((e) => r.includes(e)) ? null : r });
	};
	return j`${V(t, t("point.f.cars"), "point_cars", r.length ? j`<ul class="people" role="group" aria-label=${t("point.f.cars")}>
            ${r.map((e) => {
		let t = n.cars == null || n.cars.includes(e.id);
		return j`<li>
                <button type="button" class="mini-btn ${t ? "go" : "quiet"}" aria-pressed=${String(t)} @click=${() => a(e.id)}>
                  <ha-icon icon=${t ? "mdi:check" : "mdi:minus"}></ha-icon>${e.name}
                </button>
              </li>`;
	})}
          </ul>` : j`<p class="field-hint">${t("point.f.no_cars")}</p>`)}
    ${V(t, t("point.f.unknown"), "point_unknown", j`<div class="row">
          <div class="seg" role="group" aria-label=${t("point.f.unknown")}>
            ${["ask", "assume"].map((i) => j`<button
                  type="button"
                  aria-pressed=${String(n.unknown === i)}
                  ?disabled=${i === "assume" && !r.length}
                  @click=${() => mn(e, {
		unknown: i,
		assume_car: i === "assume" ? n.assume_car ?? r[0]?.id ?? null : n.assume_car
	})}
                >
                  ${t(`point.unknown.${i}`)}
                </button>`)}
          </div>
          ${n.unknown === "assume" && r.length ? j`<select
                class="input"
                aria-label=${t("point.f.assume")}
                @change=${(t) => mn(e, { assume_car: t.target.value })}
              >
                ${r.map((e) => j`<option value=${e.id} ?selected=${n.assume_car === e.id}>${e.name}</option>`)}
              </select>` : T}
        </div>
        <p class="field-hint">${t("point.f.unknown.hint")}</p>`)}`;
}
function gn(e, t) {
	let n = e.draft;
	return t === "point" ? j`${nn(e)} ${an(e)} ${hn(e)} ${sn(e)} ${en(e)} ${cn(e)}` : t === "hot_water" ? j`${tn(e)} ${nn(e)} ${n.kind === "target" ? rn(e) : T} ${an(e)}
    ${sn(e)} ${en(e)} ${cn(e)}` : j`${nn(e)} ${n.kind === "target" ? rn(e) : T} ${an(e)} ${sn(e)}
  ${en(e)} ${cn(e)}`;
}
function _n(e) {
	if (e.draft?.kind !== "target" || !e.hass) return;
	let t = e.config?.consumers.find((t) => t.id === e.draft?.consumer_id);
	return Rt(e.hass, t?.name);
}
async function vn(e) {
	let t = e.t, n = (await R(e, {
		heading: t("action.pick.entity"),
		tip: "a_entity",
		filter: "writable",
		selected: e.draft?.entity_id ? [e.draft.entity_id] : [],
		suggestions: _n(e)?.switches
	}))?.selected[0];
	if (n) {
		let t = e.hass?.states[n]?.attributes.options ?? [], r = e.draft?.on_value;
		e.setDraft({
			entity_id: n,
			on_value: t.length && !t.includes(String(r)) ? t.includes("now") ? "now" : t[0] : r ?? "on"
		});
	}
}
async function yn(e) {
	let t = e.t, n = await R(e, {
		heading: t("action.pick.sensor"),
		tip: "a_sensor",
		filter: "temperature",
		selected: e.draft?.sensor_entity ? [e.draft.sensor_entity] : [],
		suggestions: _n(e)?.sensors
	});
	n?.selected[0] && e.setDraft({ sensor_entity: n.selected[0] });
}
async function bn(e, t) {
	let n = e.t, r = Ut[t], i = (e.discovery?.cars ?? []).map((e) => ({
		entity_id: e.entities[r.role] ?? "",
		confidence: e.confidence,
		reasons: e.reasons
	})).filter((e) => e.entity_id), a = await R(e, {
		heading: n(`action.need.pick.${r.role}`),
		tip: r.tip,
		filter: r.filter,
		selected: e.draft?.need?.[t] ? [e.draft.need[t]] : [],
		suggestions: $e(i)
	});
	a && ln(e, { [t]: a.selected[0] ?? null });
}
async function xn(e) {
	let t = e.t, n = (await R(e, {
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
var Sn = D`
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
`, Cn = /* @__PURE__ */ new Map();
function wn(e, t) {
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
function Tn(e, t) {
	let n = {
		...e,
		...t
	};
	return t.point && e.point && (n.point = {
		...e.point,
		...t.point
	}), n;
}
var En = class extends P {
	constructor(...e) {
		super(...e), this.prefix = M, this.section = "night", this.saving = !1, this.problem = "", this.version = 0;
	}
	static {
		this.styles = [
			x,
			Sn,
			D`
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
		let e = Cn.get(this.key);
		return e ? wn(e.base, e.draft) : {};
	}
	get draft() {
		let e = this.action;
		return e && Cn.has(this.key) ? Tn(e, this.changes) : e;
	}
	get dirty() {
		let e = Cn.get(this.key);
		return !!(e && !e.pending && this.action && Object.keys(wn(this.action, this.draft)).length);
	}
	setDraft(e) {
		let t = this.action, n = this.draft;
		t && n && (Cn.set(this.key, {
			base: structuredClone(t),
			draft: {
				...n,
				...e
			},
			pending: !1
		}), this.problem = "", this.version++);
	}
	willUpdate(e) {
		e.has("action") && Cn.get(this.key)?.pending && Cn.delete(this.key);
	}
	render() {
		let { t: e, hass: t, draft: r } = this;
		return !e || !t || !r ? T : (this.version, j`<div class="fields">${gn(this, this.section)}</div>
      ${this.problem ? j`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.problem}</span></div>` : T}
      ${this.dirty ? j`<div class="steer-bar" role="region" aria-label=${e("action.steer.unsaved")}>
            <span class="unsaved">${e("action.steer.unsaved")}</span>
            <span class="with-tip" data-tipped>
              <button type="button" class="btn btn-primary" ?disabled=${this.saving} @click=${this.save}>${e("common.save")}</button>
              ${n(e, "a_save")}
            </span>
            <button type="button" class="btn btn-ghost" data-notip ?disabled=${this.saving} @click=${this.cancel}>${e("common.cancel")}</button>
          </div>` : T}`);
	}
	cancel() {
		Cn.delete(this.key), this.problem = "", this.version++;
	}
	async save() {
		let e = this.draft, t = this.action;
		if (!e || !t || (this.problem = qt(this.t, e, this.section), this.problem)) return;
		let n = wn(t, e);
		if (!Object.keys(n).length) {
			this.cancel();
			return;
		}
		let r = this.key;
		this.saving = !0;
		let i = await L(this, { actions: { [t.id]: n } });
		this.saving = !1, i && (Cn.set(r, {
			base: structuredClone(t),
			draft: e,
			pending: !0
		}), this.version++);
	}
};
b([A({ attribute: !1 })], En.prototype, "hass", void 0), b([A({ attribute: !1 })], En.prototype, "t", void 0), b([A({ attribute: !1 })], En.prototype, "state", void 0), b([A({ attribute: !1 })], En.prototype, "discovery", void 0), b([A({ attribute: !1 })], En.prototype, "prefix", void 0), b([A({ attribute: !1 })], En.prototype, "action", void 0), b([A({ attribute: !1 })], En.prototype, "section", void 0), b([C()], En.prototype, "saving", void 0), b([C()], En.prototype, "problem", void 0), b([C()], En.prototype, "version", void 0);
var Dn = class extends P {
	constructor(...e) {
		super(...e), this.asking = !1, this.busy = !1;
	}
	static {
		this.styles = [x, D`
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
		if (!e || !t) return T;
		let r = this.config?.consumers.find((e) => e.id === t.consumer_id), i = at(t, r);
		return this.asking ? j`<div data-tipped>
      <p class="ask" role="alert">${e(`action.delete.ask.${i}`, { name: t.name })}</p>
      <div class="row">
        <button type="button" class="btn btn-danger" ?disabled=${this.busy} @click=${this.removeAction}>${e("action.delete.yes")}</button>
        <button type="button" class="btn btn-ghost" ?disabled=${this.busy} @click=${() => this.asking = !1}>
          ${e("action.delete.no")}
        </button>
        ${n(e, "a_delete")}
      </div>
    </div>` : j`<div class="row" data-tipped>
        <button type="button" class="btn btn-danger" @click=${() => this.asking = !0}>${e("action.delete")}</button>
        ${n(e, "a_delete")}
      </div>`;
	}
	async removeAction() {
		let e = this.action;
		if (!e) return;
		this.busy = !0;
		let t = await L(this, { actions: { [e.id]: null } });
		this.busy = !1, t && (this.asking = !1, this.dispatchEvent(new CustomEvent("joe-deleted", {
			detail: { id: e.id },
			bubbles: !0,
			composed: !0
		})), this.leave && w(this, this.leave, { replace: !0 }));
	}
};
b([A({ attribute: !1 })], Dn.prototype, "t", void 0), b([A({ attribute: !1 })], Dn.prototype, "config", void 0), b([A({ attribute: !1 })], Dn.prototype, "action", void 0), b([A({ attribute: !1 })], Dn.prototype, "leave", void 0), b([C()], Dn.prototype, "asking", void 0), b([C()], Dn.prototype, "busy", void 0);
var On = class extends P {
	constructor(...e) {
		super(...e), this.failed = !1;
	}
	static {
		this.styles = [x, D`
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
		let { t: e, state: t, action: r } = this;
		if (!e || !t || !r) return T;
		let i = t.plan?.window?.start, a = !!i && t.control?.tonight?.[r.id] === i, o = `tonight-${r.id}`;
		return j`<div class="tonight" data-tipped>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(a)}
          aria-labelledby=${o}
          ?disabled=${!i || !r.enabled}
          @click=${() => this.toggle(r.id, !a)}
        ></button>
        <span id=${o}>${e("devices.action.tonight")}</span>
        ${n(e, "action_tonight")}
      </div>
      ${this.failed ? j`<p class="bad" role="status">${e("error.action")}</p>` : T}`;
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
b([A({ attribute: !1 })], On.prototype, "hass", void 0), b([A({ attribute: !1 })], On.prototype, "t", void 0), b([A({ attribute: !1 })], On.prototype, "state", void 0), b([A({ attribute: !1 })], On.prototype, "action", void 0), b([C()], On.prototype, "failed", void 0);
function kn(e, t, n) {
	let r = t.plan?.actions?.find((e) => e.id === n.id), i = t.control?.actions?.[n.id], a = r?.target == null ? "" : s(e.lang, r.target, 0);
	if (!n.enabled) return e("devices.action.disabled");
	if (i?.reason === "boost") return e("devices.action.boost");
	if (i?.on) return n.kind === "target" ? e("devices.action.heating", {
		target: a,
		end: v(i.end)
	}) : e("devices.action.running", { end: v(i.end) });
	if (i?.reason === "reached") {
		let i = t.control?.tonight_target?.[n.id];
		return n.kind === "switch" && i && i.night === t.plan?.window?.start ? e("devices.action.reached_need", {
			target: s(e.lang, i.chosen, 0),
			unit: i.unit
		}) : n.kind === "switch" ? r?.need && a ? e("devices.action.reached_need", {
			target: a,
			unit: r.need.target_unit === "km" ? "km" : "%"
		}) : e("devices.action.reached_plain") : e("devices.action.reached", { target: a });
	}
	if (!r) return e("devices.action.no_plan");
	let o = t.mode === "simulation" ? e("devices.action.would") : "";
	if (r.run) return `${o}${n.kind === "target" ? e("devices.action.plan_target", {
		start: v(r.start),
		target: a
	}) : e("devices.action.plan_run", {
		start: v(r.start),
		end: v(r.end)
	})}`;
	let c = r.reasons[r.reasons.length - 1] ?? "manual_only";
	return e.optional(`devices.action.why.${c}`, {
		kwh: s(e.lang, t.plan?.meta?.tomorrow_kwh ?? 0, 0),
		temperature: s(e.lang, r.temperature ?? 0, 0)
	}) ?? c;
}
_("joe-action-steer", En), _("joe-action-delete", Dn), _("joe-action-tonight", On);
//#endregion
//#region src/editors/action-editor.ts
var H = class extends P {
	constructor(...e) {
		super(...e), this.prefix = M, this.actionId = "", this.section = "", this.consumer = "", this.subtitle = "", this.found = "", this.saving = !1, this.problem = "", this.touched = !1;
	}
	static {
		this.styles = [
			x,
			Sn,
			D`
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
		return this.actionId.startsWith("new:") ? Kt(this.actionId.slice(4)) : this.openLayout ?? "night";
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
				let e = Wt(this.actionId.slice(4), this.t), [t, n] = this.found.split(/:(.*)/s), r = this.config?.actions ?? [], i = (this.discovery?.wallboxes ?? []).filter((e) => e.is_car), a = t === "wallbox" ? i.find((e) => (e.device_id ?? e.name) === n) : i.find((e) => !r.some((t) => t.id === `ev_${e.device_id}` || e.mode_entity && t.entity_id === e.mode_entity));
				this.actionId === "new:ev" && a && Object.assign(e, Gt(a));
				let o = this.config?.consumers.filter((e) => e.kind === "hot_water") ?? [];
				this.actionId === "new:hot_water" && o.length === 1 && (e.consumer_id = o[0].id);
				let s = this.config?.consumers.find((e) => e.id === this.consumer);
				s && (e.name = s.name, e.consumer_id = s.id, e.power_entity = s.power_entity ?? null), this.draft = e, this.touched = !1;
			} else if (this.existing) {
				this.draft = structuredClone(this.existing);
				let e = this.config?.consumers.find((e) => e.id === this.existing?.consumer_id);
				this.openLayout = Kt(at(this.existing, e));
			}
		}
	}
	render() {
		let { t: e, hass: t, draft: r } = this;
		if (!e || !t || !r) return T;
		let i = this.existing, a = e(i ? "action.title" : `action.title.${this.actionId.slice(4)}`);
		return j`<div class="sheet-title">${N(a)}</div>
      ${this.subtitle ? j`<p class="sheet-sub">${this.subtitle}</p>` : T}
      ${gn(this, this.layout)}
      ${this.problem ? j`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.problem}</span></div>` : T}
      <div class="actions">
        <span data-tipped class="row">
          <button type="button" class="btn btn-primary" ?disabled=${this.saving} @click=${this.save}>${e("common.save")}</button>
          ${n(e, "a_save")}
        </span>
        <button type="button" class="btn btn-ghost" data-notip @click=${this.close}>${e("common.cancel")}</button>
      </div>
      ${i ? j`<div class="danger-zone">
            <joe-action-delete .t=${e} .config=${this.config} .action=${i} @joe-deleted=${this.close}></joe-action-delete>
          </div>` : T}`;
	}
	async save() {
		let e = this.draft;
		if (!e || (this.problem = qt(this.t, e, this.layout), this.problem)) return;
		let { id: t, ...n } = e;
		this.saving = !0;
		let r = await L(this, { actions: { [t]: n } });
		this.saving = !1, r && this.close();
	}
	close() {
		this.dispatchEvent(new CustomEvent("joe-close", {
			bubbles: !0,
			composed: !0
		}));
	}
};
b([A({ attribute: !1 })], H.prototype, "hass", void 0), b([A({ attribute: !1 })], H.prototype, "mailboxes", void 0), b([A({ attribute: !1 })], H.prototype, "accounts", void 0), b([A({ attribute: !1 })], H.prototype, "apps", void 0), b([A({ attribute: !1 })], H.prototype, "t", void 0), b([A({ attribute: !1 })], H.prototype, "config", void 0), b([A({ attribute: !1 })], H.prototype, "discovery", void 0), b([A({ attribute: !1 })], H.prototype, "prefix", void 0), b([A()], H.prototype, "actionId", void 0), b([A()], H.prototype, "section", void 0), b([A()], H.prototype, "consumer", void 0), b([A()], H.prototype, "subtitle", void 0), b([A()], H.prototype, "found", void 0), b([C()], H.prototype, "draft", void 0), b([C()], H.prototype, "saving", void 0), b([C()], H.prototype, "problem", void 0), _("joe-action-editor", H);
//#endregion
//#region src/components/look-back.ts
function An(e, t, n = "EUR", r = !1) {
	return new Intl.NumberFormat(e.lang, {
		style: "currency",
		currency: n,
		signDisplay: r ? "exceptZero" : "auto"
	}).format(Math.abs(t) < .005 ? 0 : t);
}
function U(e, t, n = 1) {
	return new Intl.NumberFormat(e, {
		minimumFractionDigits: n,
		maximumFractionDigits: n
	}).format(t);
}
function jn(e, t = "EUR") {
	return new Intl.NumberFormat(e, {
		style: "currency",
		currency: t
	}).formatToParts(0).find((e) => e.type === "currency")?.value ?? t;
}
function Mn(e) {
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
function W(e, t, n = "long") {
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
function Nn(e, t) {
	return t === 1 ? e("learn.nights.one") : e("learn.nights.many", { count: t });
}
//#endregion
//#region src/types.ts
var Pn = [
	"welcome",
	"scan",
	"questions",
	"done"
], Fn = [
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
], In = [
	"normal",
	"force_charge",
	"hold",
	"force_discharge"
], Ln = [
	"charge",
	"hold",
	"block",
	"block_charge",
	"block_discharge",
	"cap",
	"release"
], Rn = [
	"charge",
	"hold",
	"block",
	"block_charge",
	"block_discharge",
	"cap",
	"release"
], zn = [
	"home_office",
	"office",
	"travel",
	"vacation",
	"guests",
	"home"
], Bn = [
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
function Vn(e) {
	let t = e.filter((e) => e.kind !== "submeter" && (e.kind === "ev" && (e.runs ?? "auto") !== "always" || e.runs === "surplus" || e.runs === "cheap")), n = new Set(t.map((e) => e.energy_entity).filter(Boolean));
	return t.filter((e) => !e.included_in || !n.has(e.included_in));
}
var Hn = [
	"forecast",
	"consumption",
	"battery",
	"hot_water",
	"car"
], Un = [
	"normal",
	"holiday",
	"away",
	"home_office"
], Wn = ["heat", "cool"];
//#endregion
//#region src/learned-view.ts
function Gn(e) {
	return j`<div class="rows">
    ${e.map((e) => j`<div class="row-item">
        <b>${e.name}</b>
        <span class="values">${e.values.map((e) => j`<span>${e}</span>`)}</span>
        ${e.note ? j`<small>${e.note}</small>` : T}
        ${e.extra ? j`<span class="row-extra">${e.extra}</span>` : T}
      </div>`)}
  </div>`;
}
var Kn = D`
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
function qn(e, t, n) {
	let r = n.capacity_kwh != null && e.provenance[`batteries[${n.id}].capacity_kwh`]?.source === "user", i = n.capacity_kwh ?? (t ? y(t, n.capacity_entity) : null);
	if (i) return {
		value: i,
		own: r
	};
	let a = e.learned?.battery_models?.[n.id]?.measured_kwh;
	return a ? {
		value: a,
		own: !1,
		measured: !0
	} : null;
}
function Jn(e, t) {
	return e != null && t != null && e > 0 && Math.abs(t - e) / e > .15;
}
function Yn(e, t) {
	let [n, r] = e("word.run").split("|");
	return `${s(e.lang, t, 0)} ${t === 1 ? n : r}`;
}
function Xn(e, t, n, r, i, a) {
	let o = e.lang, c = r.battery_models?.[i.id], l = qn(t, n, i), u = c?.measured_kwh ?? null, d = [];
	l?.measured ? d.push(e("learn.battery.basis.measured", {
		value: U(o, l.value, 1),
		runs: Yn(e, c?.runs ?? 0)
	})) : l && d.push(e(l.own ? "learn.battery.basis.user" : "learn.battery.basis.device", { value: U(o, l.value, 1) })), u != null && !l?.measured && d.push(e("learn.battery.measured", {
		value: U(o, u, 1),
		runs: Yn(e, c?.runs ?? 0)
	})), c?.efficiency != null && d.push(e("learn.battery.efficiency", { value: s(o, c.efficiency * 100, 0) })), c?.converter && d.push(e("learn.battery.converter", { value: s(o, c.converter.factor * 100, 0) }));
	let f = [];
	return l || f.push(e("learn.battery.basis.none")), i.power ? (u == null ? f.push(e("learn.battery.measuring")) : l && Jn(l.value, u) && f.push(e("learn.battery.mismatch", { value: U(o, l.value, 1) })), c?.efficiency ?? f.push(e("learn.battery.learning", { need: a }))) : f.push(e("learn.battery.no_power")), {
		name: i.name,
		values: d.length ? d : [e("learn.still")],
		note: f.length ? f.join(" ") : void 0
	};
}
function Zn(e, t, n) {
	let r = t.group_models?.[n.id];
	return {
		name: n.name,
		values: r ? [e("learn.groups.average", { value: U(e.lang, r.average, 1) }), r.heat >= .05 ? e("learn.groups.heat", { value: U(e.lang, r.heat, 2) }) : e("learn.groups.steady")] : [e("learn.still")]
	};
}
function Qn(e, t, n) {
	let r = t.action_models?.[n.id];
	return {
		name: n.name,
		values: r ? [
			e("learn.hot_water.rate", { value: U(e.lang, r.rate_k_per_h, 1) }),
			e("learn.hot_water.loss", { value: U(e.lang, r.loss_k_per_h, 1) }),
			e("learn.hot_water.demand", { value: U(e.lang, r.demand_k, 0) })
		] : [e("learn.still")],
		note: r ? void 0 : e("learn.hot_water.learning")
	};
}
function $n(e, t, n) {
	let r = e.lang, i = t.car_models?.[n.id], a = !!(n.need.odometer_entity || n.sources.some((e) => e.entities.odometer)), o = [];
	return i?.consumption != null && (o.push(e("learn.car.consumption", { value: U(r, i.consumption, 1) })), i.cold && o.push(e("learn.car.cold", { value: U(r, i.cold, 2) }))), (i?.workday_km != null || i?.day_off_km != null) && o.push(e("learn.car.km", {
		workday: i.workday_km == null ? "–" : U(r, i.workday_km, 0),
		day_off: i.day_off_km == null ? "–" : U(r, i.day_off_km, 0)
	})), {
		name: n.name,
		values: o.length ? o : [e("learn.still")],
		note: o.length ? void 0 : e(a ? "learn.car.learning" : "learn.car.no_odometer")
	};
}
function er(e) {
	return `${String(Math.floor(e / 60)).padStart(2, "0")}:${String(Math.round(e) % 60).padStart(2, "0")}`;
}
function tr(e, t, n, r) {
	let i = t.presence?.[n.id] ?? {}, a = zn.filter((e) => i[e]).map((t) => e("learn.presence.value", {
		label: e(`label.${t}`),
		hours: U(e.lang, i[t].hours, 0)
	}));
	r != null && a.push(e("past.learned.presence.usual", { time: er(r) }));
	let o;
	return n.person_entity ? n.calendars.length || (o = e("past.learned.presence.no_calendar")) : o = e("learn.presence.no_person"), {
		name: n.name,
		values: a.length ? a : [e("learn.still")],
		note: o
	};
}
function nr(e, t) {
	return t ? e("climate.rate", { rate: s(e.lang, t, 1) }) : e("climate.rate_default");
}
function rr(e) {
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
function ir(e, t) {
	let n = Math.max(1, Math.ceil(t.length / 7)), r = /* @__PURE__ */ new Map();
	return t.forEach((i, a) => {
		(t.length - 1 - a) % n == 0 && r.set(a, W(e, i, "short"));
	}), r;
}
//#endregion
//#region src/pages/devices/battery-fields.ts
var ar = [
	"name",
	"capacity_kwh",
	"soc_entity",
	"power",
	"max_charge_w",
	"max_discharge_w",
	"floor_soc",
	"priority"
], or = class extends P {
	constructor(...e) {
		super(...e), this.show = "all";
	}
	static {
		this.styles = [x, D`
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
		return this.draft ? this.draft : e ? Object.fromEntries(ar.map((t) => [t, e[t]])) : void 0;
	}
	get capacityUnknown() {
		let e = this.battery;
		return this.unknown === void 0 ? !!(e && this.config?.answers[`capacity:${e.id}`] === "unknown") : this.unknown;
	}
	render() {
		let { t: e, hass: t, config: n, battery: r } = this, i = this.values;
		if (!e || !t || !n || !r || !i) return T;
		let a = this.show !== "power", o = this.show !== "steer";
		return j`${a ? this.renderName(e, r, i) : T} ${a ? this.renderCapacity(e, r, i) : T}
    ${o ? this.renderSensors(e, r, i) : T} ${a ? this.renderLimits(e, r, i) : T}`;
	}
	renderName(e, t, n) {
		return this.field(e("f.battery.name"), "f_battery_name", j`<input
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
		let r = this.hass, i = this.config, a = this.capacityUnknown, o = y(r, t.capacity_entity), c = i.learned?.battery_models?.[t.id];
		return this.field(e("f.battery.capacity"), "q_capacity", j`<div class="field-row">
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
              placeholder=${o == null ? e("f.unknown") : s(e.lang, o, 2)}
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
        ${o == null ? T : j`<p class="field-hint">${e("f.battery.capacity.read", { value: s(e.lang, o, 2) })}</p>`}
        ${c?.measured_kwh == null ? a ? j`<p class="field-hint">${e("battery.page.capacity.learning")}</p>` : T : j`<p class="field-hint">
              ${e("battery.page.capacity.measured", {
			runs: Yn(e, c.runs ?? 0),
			value: U(e.lang, c.measured_kwh, 1)
		})}
            </p>`}`, O(e, F(i, `batteries[${t.id}].capacity_kwh`)));
	}
	renderSensors(e, t, n) {
		let r = this.hass, i = this.config;
		return j`${this.field(e("f.battery.soc"), "f_battery_soc", this.entityBox(e, n.soc_entity, d(r, n.soc_entity, e.lang), () => this.pickSoc(n)), O(e, F(i, `batteries[${t.id}].soc_entity`)))}
    ${this.field(e("f.battery.power"), "f_battery_power", this.entityBox(e, n.power?.entity_id ?? null, this.powerText(e, n.power), () => this.pickPower(n)), O(e, F(i, `batteries[${t.id}].power`)))}`;
	}
	renderLimits(e, t, n) {
		let r = this.config, i = this.floor;
		return j`${this.field(e("f.battery.limits"), "f_battery_limits", j`<div class="limits">
        <label>${e("f.battery.max_charge")} ${this.kwInput(e, n.max_charge_w, "max_charge_w")}</label>
        <label>${e("f.battery.max_discharge")} ${this.kwInput(e, n.max_discharge_w, "max_discharge_w")}</label>
      </div>`)}
    ${this.field(e("f.battery.floor"), "f_battery_floor", j`<span class="unit-input">
          <input
            class="input"
            type="number"
            inputmode="decimal"
            min="0"
            max="100"
            step="1"
            aria-label=${e("f.battery.floor")}
            .value=${n.floor_soc == null ? "" : String(n.floor_soc)}
            placeholder=${i?.device == null ? e("f.unknown") : s(e.lang, i.device, 0)}
            @change=${(e) => {
			let t = Number.parseFloat(e.target.value.replace(",", "."));
			this.change({ floor_soc: Number.isFinite(t) ? Math.min(100, Math.max(0, t)) : null });
		}}
          />
          <span class="unit">%</span>
        </span>
        ${i?.device == null ? n.floor_soc == null ? j`<div class="note warn"><ha-icon icon="mdi:help-circle-outline"></ha-icon><span>${e("f.battery.floor.ask")}</span></div>` : T : j`<p class="field-hint">${e("f.battery.floor.read", { value: s(e.lang, i.device, 0) })}</p>`}`, O(e, F(r, `batteries[${t.id}].floor_soc`)))}
    ${r.batteries.length > 1 ? this.field(e("f.battery.priority"), "f_battery_priority", j`<span class="unit-input">
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
          </span>`) : T}`;
	}
	field(e, t, r, i) {
		let a = this.t;
		return j`<div class="field" data-tipped>
      <div class="field-label">${e} ${n(a, t)} ${i ?? T}</div>
      ${r}
    </div>`;
	}
	entityBox(e, t, n, r) {
		let i = this.hass;
		return j`<div class="entity">
      <span>
        ${t ? j`<b>${c(i, t)}</b><small>${n}</small>` : j`<small>${e("find.none")}</small>`}
      </span>
      <button type="button" class="mini-btn" @click=${r}>
        <ha-icon icon="mdi:magnify"></ha-icon>${e(t ? "review.change" : "review.choose")}
      </button>
    </div>`;
	}
	kwInput(e, t, n) {
		return j`<span class="unit-input">
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
		let n = this.hass, r = we(n, t);
		if (!t || r === null) return t ? d(n, t.entity_id, e.lang) : "";
		let i = s(e.lang, Math.abs(r), 2);
		return e(r >= 0 ? "pick.preview.charge" : "pick.preview.discharge", { value: i });
	}
	async pickSoc(e) {
		let t = this.t, n = (await R(this, {
			heading: t("pick.battery.title"),
			tip: "pick_battery",
			filter: "soc",
			selected: [e.soc_entity]
		}))?.selected[0];
		n && n !== e.soc_entity && this.change({ soc_entity: n });
	}
	async pickPower(e) {
		let t = this.t, n = await R(this, {
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
		Object.keys(a).length && (o.batteries = { [n.id]: a }), i !== void 0 && (o.answers = { [`capacity:${n.id}`]: i ? "unknown" : null }), Object.keys(o).length && L(this, o);
	}
};
b([A({ attribute: !1 })], or.prototype, "hass", void 0), b([A({ attribute: !1 })], or.prototype, "t", void 0), b([A({ attribute: !1 })], or.prototype, "config", void 0), b([A({ attribute: !1 })], or.prototype, "battery", void 0), b([A({ attribute: !1 })], or.prototype, "floor", void 0), b([A({ attribute: !1 })], or.prototype, "draft", void 0), b([A({ attribute: !1 })], or.prototype, "unknown", void 0), b([A()], or.prototype, "show", void 0), _("joe-battery-fields", or);
//#endregion
//#region src/components/battery-notes.ts
function sr(e, t, n) {
	let r = n?.night_slow?.[t.id];
	if (!r) return T;
	let i = {
		measured: s(e.lang, r.measured_w / 1e3, 1),
		planned: s(e.lang, r.planned_w / 1e3, 1)
	}, a = e.optional(`devices.slow.${t.adapter}`, i) ?? e("devices.slow", i);
	return j`<div class="note warn" role="status"><ha-icon icon="mdi:speedometer-slow"></ha-icon><span>${a}</span></div>`;
}
function cr(e) {
	return e.startsWith("cannot.") || e.startsWith("check.") || e.startsWith("no_charge.") || e === "no_level";
}
function lr(e, t, r = "") {
	return t?.length ? j`<div class="battery-notes" style="display:grid;gap:8px;margin:12px 0" data-tipped>
    ${t.map((t) => {
		let i = (t.entities ?? []).map((e) => `„${e.name}“`).join(", ") || e("bnote.entities.none"), a = e.optional(`bnote.${t.code}`, {
			name: t.name ?? r,
			entities: i
		}) ?? e(t.code.startsWith("cannot.") ? "bnote.cannot.levers" : "bnote.other"), o = cr(t.code);
		return j`<div class="note ${o ? "warn" : ""}" role=${o ? "status" : T}>
        <ha-icon icon=${o ? "mdi:information-off-outline" : "mdi:information-outline"}></ha-icon>
        <span
          >${a}
          <div class="note-actions">${n(e, "battery_notes")}</div></span
        >
      </div>`;
	})}
  </div>` : T;
}
//#endregion
//#region src/editors/battery-control.ts
var ur = "fronius_modbus", dr = "fronius", fr = {
	port: 502,
	unit: 1
};
function pr(e) {
	return e ? `${e.host.trim()}:${e.port}/${e.unit}` : "";
}
var mr = {
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
}, hr = new Set(Rn), gr = [
	"charge",
	"hold",
	"block",
	"cap"
], _r = 300, vr = {
	target: "{target}",
	power: "{power}",
	floor: "{floor}",
	percent: "{percent}"
};
function yr(e) {
	return {
		adapter: e.adapter,
		controls: structuredClone(e.controls),
		mode_options: structuredClone(e.mode_options),
		steps: structuredClone(e.steps),
		modbus: e.modbus ? { ...e.modbus } : null
	};
}
function br(e, t, n) {
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
function xr(e) {
	if (e instanceof Error) return e.message;
	let t = e;
	return t?.message || t?.code || String(e);
}
function Sr(e) {
	return typeof e == "string" && /^\{\w+\}$/.test(e);
}
function Cr(e) {
	let t = e.trim();
	if (t === "") return null;
	let n = Number(t.replace(",", "."));
	return t.startsWith("{") || Number.isNaN(n) ? t : n;
}
function wr(e, t, n) {
	if (e.param) return `{${e.param}}`;
	let r = e.value;
	if (Sr(r)) return r;
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
function Tr(e) {
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
var G = class extends P {
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
		this.styles = [x, D`
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
		return e?.adapter === ur ? n ?? dr : e && ![
			"none",
			"generic",
			"steps"
		].includes(e.adapter) ? e.adapter : n;
	}
	get modbusOffered() {
		let e = this.battery?.adapter;
		return e === ur || e === dr || this.found?.integration === dr || this.found?.adapter === dr;
	}
	get modbusSaved() {
		return this.battery?.adapter === ur;
	}
	get modbusPending() {
		return this.modbusSaved && this.value?.adapter === ur && !Object.keys(this.battery?.controls ?? {}).length;
	}
	get choice() {
		let e = this.value?.adapter ?? "none";
		return e === "none" ? "watch" : e === "generic" ? "generic" : e === "steps" ? "steps" : e === ur ? "modbus" : "profile";
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
		if (e.adapter === "none" || e.adapter === ur && !this.modbusSaved) {
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
		this.previewFor = i, this.previewTimer !== void 0 && clearTimeout(this.previewTimer), this.previewTimer = window.setTimeout(() => void this.fetchPreview(t.id, r), a ? 0 : _r);
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
			this.previewFailure = { error: xr(e) }, this.previewState = "error";
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
		if (!e || !t) return T;
		let r = [
			"watch",
			...this.profileKey ? ["profile"] : [],
			...this.modbusOffered ? ["modbus"] : [],
			"generic",
			"steps"
		], i = this.found?.suggested, a = this.choice, o = a !== "watch" && (a !== "modbus" || this.modbusSaved), s = a === "profile" || a === "generic" || a === "modbus" && this.modbusSaved;
		return j`<div class="choose">
        <div class="seg" role="group" aria-label=${e("f.battery.control")}>
          ${r.map((t) => j`<button type="button" aria-pressed=${String(a === t)} @click=${() => this.choose(t)}>
                ${t === "profile" ? e("f.battery.control.profile", { name: this.profiles?.[this.profileKey ?? ""] ?? this.profileKey ?? "" }) : e(`f.battery.control.${t}`)}
              </button>`)}
        </div>
      </div>
      ${a === "modbus" ? this.renderModbus(e, t) : T}
      ${a === "watch" ? lr(e, this.found?.notes) : T}
      ${a === "watch" && i?.complete ? j`<div class="note" data-tipped>
            <ha-icon icon="mdi:lightbulb-on-outline"></ha-icon>
            <span
              >${e("f.battery.control.suggested")}
              <div class="note-actions">
                <button type="button" class="mini-btn go" @click=${this.takeSuggestion}>${e("f.battery.control.take")}</button>
                ${n(e, "control_roles")}
              </div></span
            >
          </div>` : T}
      ${a === "watch" ? j`<p class="field-hint hint">${e("preview.watch")}</p>` : T}
      ${a === "profile" ? lr(e, this.found?.notes) : T}
      ${o ? this.renderOperations(e, t) : T}
      ${s ? this.renderRoles(e, t) : T}
      ${o ? this.renderSummary(e) : T}
      ${o ? j`<p class="field-hint">${e("f.battery.control.retest")}</p>` : T}`;
	}
	renderModbus(e, t) {
		let r = {
			host: "",
			...fr,
			...t.modbus ?? {}
		}, i = this.modbusSaved, a = pr(r), o = a === this.modbusChecked || i && a === pr(this.battery?.modbus), s = (this.modbusCheck?.hosts ?? []).filter((e) => e !== r.host), c = this.profileName || this.profiles?.[ur] || ur, l = (e, t, n) => (i) => {
			let a = i.target, o = Number.parseInt(a.value, 10);
			if (!Number.isFinite(o) || o < t || o > n) {
				a.value = String(r[e]);
				return;
			}
			this.setModbus(e === "port" ? { port: o } : { unit: o });
		}, u = (e) => {
			e.key === "Enter" && (e.preventDefault(), e.target.blur());
		};
		return j`<div class="modbus" data-tipped>
      <div class="modbus-head">
        <span class="chip read"><ha-icon icon="mdi:lan-connect"></ha-icon>${c}</span>
        ${i ? j`<button type="button" class="mini-btn quiet" @click=${() => this.choose("profile")}>
                <ha-icon icon="mdi:undo-variant"></ha-icon>${e("modbus.back")}
              </button>
              ${n(e, "modbus_back")}` : T}
      </div>
      <p class="modbus-text">${e("modbus.why")}</p>
      <p class="modbus-text">${e("modbus.what")}</p>
      <div class="note">
        <ha-icon icon="mdi:wrench-outline"></ha-icon>
        <span>${e("modbus.setup")} ${e("modbus.exclusive")}</span>
      </div>
      <div class="modbus-fields">
        <div class="modbus-field host">
          <label class="field-label" for="modbus-host">${e("modbus.host")} ${n(e, "modbus_host")}</label>
          <input
            id="modbus-host"
            class="input"
            type="text"
            inputmode="url"
            autocomplete="off"
            spellcheck="false"
            placeholder=${e("modbus.host.placeholder")}
            .value=${r.host}
            @change=${(e) => this.setModbus({ host: e.target.value.trim() })}
            @keydown=${u}
          />
        </div>
        <div class="modbus-field">
          <label class="field-label" for="modbus-port">${e("modbus.port")} ${n(e, "modbus_port")}</label>
          <input id="modbus-port" class="input" type="number" inputmode="numeric" min="1" max="65535" step="1" .value=${String(r.port)} @change=${l("port", 1, 65535)} @keydown=${u} />
        </div>
        <div class="modbus-field">
          <label class="field-label" for="modbus-unit">${e("modbus.unit")} ${n(e, "modbus_unit")}</label>
          <input id="modbus-unit" class="input" type="number" inputmode="numeric" min="0" max="255" step="1" .value=${String(r.unit)} @change=${l("unit", 0, 255)} @keydown=${u} />
        </div>
      </div>
      ${s.length ? j`<div class="modbus-hosts">
            <span>${e("modbus.hosts")}</span>
            ${s.map((e) => j`<button type="button" class="mini-btn" @click=${() => this.setModbus({ host: e })}>${e}</button>`)}
          </div>` : T}
      <div class="op-actions">
        <button type="button" class="mini-btn go" ?disabled=${this.modbusChecking} @click=${() => void this.checkModbus(r)}>
          <ha-icon icon="mdi:lan-check"></ha-icon>${e("modbus.check")}
        </button>
        ${n(e, "modbus_check")}
        ${this.modbusChecking ? j`<span class="last" role="status">${e("modbus.checking")}</span>` : T}
      </div>
      ${this.modbusCheck && !this.modbusChecking ? this.renderModbusResult(e, this.modbusCheck) : T}
      ${!o && !this.modbusChecking ? j`<div class="note warn" role="status"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("modbus.unchecked")}</span></div>` : T}
      ${i ? T : j`<p class="field-hint hint">${e("modbus.after_save")}</p>`}
    </div>`;
	}
	renderModbusResult(e, t) {
		if (!t.ok) {
			let n = t.problem ?? "unknown", r = {
				host: t.host ?? "",
				port: t.port ?? fr.port,
				problem: n,
				detail: t.detail ?? ""
			}, i = n === "connect" || n === "timeout" ? e("modbus.problem.connect", r) : n.startsWith("illegal_") ? e("modbus.problem.illegal", r) : e.optional(`modbus.problem.${n}`, r) ?? e("modbus.problem.other", r);
			return j`<div class="probe bad" role="status"><p class="problem">${i}</p></div>`;
		}
		let n = (t, n = 0) => t == null ? "–" : s(e.lang, t, n), r = (t) => e(t ? "op.step.on" : "op.step.off"), i = [
			t.model || e("modbus.found.inverter"),
			t.version ? e("modbus.found.version", { version: t.version }) : "",
			t.serial ? e("modbus.found.serial", { serial: t.serial }) : ""
		].filter(Boolean).join(" · "), a = t.kind && e.optional(`modbus.kind.${t.kind}`) || t.kind || "", o = t.status && e.optional(`modbus.status.${t.status}`) || t.status || e("modbus.status.unknown");
		return j`<div class="probe ok" role="status">
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
            ${t.inverter_w == null ? T : j`<small>${e("modbus.found.inverter_w", { power: n(t.inverter_w) })}</small>`}</span
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
			}, i.ok && (this.modbusChecked = pr({
				host: i.host ?? e?.host ?? "",
				port: i.port ?? e?.port ?? fr.port,
				unit: i.unit ?? e?.unit ?? fr.unit
			}));
			let a = i.ok && i.host || i.hosts?.[0] || i.host;
			a && !this.value?.modbus?.host.trim() && this.setModbus({ host: a });
		} catch (e) {
			if (n !== this.modbusSeq) return;
			this.modbusCheck = {
				ok: !1,
				problem: "error",
				detail: xr(e),
				hosts: []
			};
		} finally {
			n === this.modbusSeq && (this.modbusChecking = !1);
		}
	}
	setModbus(e) {
		let t = this.value, n = {
			host: "",
			...fr,
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
		return t?.operations?.length ? t.operations : Ln.map((t) => {
			let n = e.steps[t];
			return {
				op: t,
				possible: !!n?.length,
				why: null,
				source: n ? "own" : "none",
				params: {},
				steps: n ? Tr(n) : [],
				restore: [],
				note: null
			};
		});
	}
	renderOperations(e, t) {
		let r = this.previewState === "loading", i = this.previewState === "error" ? this.failureText(e) : "";
		return j`<div class="sub" data-tipped>${e("preview.title")} ${n(e, "operations")}</div>
      ${this.choice === "steps" ? j`<p class="field-hint hint">${e("preview.steps_tab")}</p>` : T}
      ${this.dirty ? j`<p class="field-hint hint" role="status">${e("preview.dirty")}</p>` : T}
      ${this.modbusPending ? j`<div class="note" role="status"><ha-icon icon="mdi:progress-clock"></ha-icon><span>${e("modbus.pending")}</span></div>` : T}
      ${i ? j`<div class="note warn" role="status"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${i}</span></div>` : T}
      ${r ? j`<p class="field-hint hint" role="status">${e("preview.loading")}</p>` : T}
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
	renderOperation(e, t, r) {
		let i = r.op, a = this.open.has(i), o = this.editing.has(i), s = o || (this.preview ? r.source === "own" : !!t.steps[i]), c = r.steps.length, l = e.optional(`tip.op_${i}.title`) ? `op_${i}` : "operations", u = this.sourceChip(e, r), d = i === "block" && this.holdFolded ? j`<span class="chip both">${e("op.block.both")}</span>` : T;
		return j`<div class="op ${r.possible ? "" : "off"}" data-tipped>
      <div class="op-row">
        <button type="button" class="op-head" aria-expanded=${String(a)} @click=${() => this.toggle(i)}>
          <ha-icon icon=${a ? "mdi:chevron-down" : "mdi:chevron-right"}></ha-icon>
          <span class="op-title">
            <span><b>${e.optional(`op.${i}`) ?? i}</b>${u}${d}</span>
            ${this.example(e, r) ? j`<small>${this.example(e, r)}</small>` : T}
          </span>
          <span class="op-status ${r.possible ? "ok" : "bad"}">
            <ha-icon icon=${r.possible ? "mdi:check-circle" : "mdi:minus-circle-outline"}></ha-icon>
            ${r.possible ? c === 1 ? e("op.steps.one") : c ? e("op.steps.many", { count: c }) : e("op.possible") : e("op.impossible")}
          </span>
        </button>
        ${n(e, l)}
      </div>
      ${a ? j`<div class="op-body">
            ${!r.possible && r.why ? j`<p class="op-why">${this.whyText(e, r.why)}</p>` : T}
            ${o ? this.renderEditor(e, t, i, r) : this.renderSteps(e, r)}
            ${r.note ? this.renderNote(e, r.note) : T}
            ${this.renderActions(e, r, s, o)}
            ${this.renderProbe(e, i)}
          </div>` : T}
    </div>`;
	}
	sourceChip(e, t) {
		switch (t.source) {
			case "profile": return j`<span class="chip read">${e("op.source.profile", { name: this.profileName })}</span>`;
			case "generic": return j`<span class="chip">${e("op.source.generic")}</span>`;
			case "own": return j`<span class="chip user">${e("op.source.own")}</span>`;
			case "service": return j`<span class="chip read">${e("op.source.service", { name: this.profileName })}</span>`;
			default: return T;
		}
	}
	example(e, t) {
		let n = t.params ?? {}, r = (t) => s(e.lang, t ?? 0, 0);
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
		return j`<p class="op-note"><ha-icon icon="mdi:information-outline"></ha-icon><span>${r}</span></p>`;
	}
	renderSteps(e, t) {
		let n = this.hass, r = t.params ?? {};
		return j`${t.steps.length ? j`<ol class="op-steps">
          ${t.steps.map((t, n) => j`<li>
              <span class="n">${n + 1}.</span>
              <span class="what">${this.stepText(e, t, r)}</span>
            </li>`)}
        </ol>` : t.possible ? j`<p class="field-hint hint">${e("op.steps.none")}</p>` : T}
    ${t.restore?.length ? j`<div class="op-restore">
          <small>${e("op.restore.title")}</small>
          <ol class="op-steps">
            ${t.restore.map((t, i) => j`<li>
                <span class="n">${i + 1}.</span>
                <span class="what"
                  >${this.rolePrefix(e, t.role, t.name || c(n, t.entity_id))}<b
                    >${t.name || c(n, t.entity_id)}</b
                  ><span class="arrow">→</span
                  ><b>${t.value === "saved" ? e("op.step.saved") : this.valueText(e, t.value, this.unitOf(t.entity_id), r)}</b>
                  ${t.current == null ? T : j` <span class="now">(${e("op.step.now", { value: this.currentText(e, t.current, this.unitOf(t.entity_id)) })})</span>`}
                </span>
              </li>`)}
          </ol>
        </div>` : t.possible && t.steps.length && t.op !== "release" ? j`<div class="op-restore"><small>${e("op.restore.none")}</small></div>` : T}`;
	}
	stepText(e, t, n) {
		let r = this.hass;
		if (t.kind === "call" || t.service) {
			let r = Object.entries(t.data ?? {}).filter(([e]) => e !== "device_id" && e !== "entity_id").map(([t, r]) => `${e.optional(`op.data.${t}`) ?? t} ${this.valueText(e, r, e.optional(`op.data.unit.${t}`), n)}`);
			return j`<b>${e("op.step.service", { service: t.service ?? "" })}</b>${r.length ? j` <span class="now">(${r.join(" · ")})</span>` : T}`;
		}
		let i = t.name || (t.entity_id ? c(r, t.entity_id) : ""), a = t.role && t.role !== "prepare" ? this.rolePrefix(e, t.role, i) : T, o = t.unit ?? this.unitOf(t.entity_id);
		return t.keep ? j`${a}<b>${i}</b><span class="arrow">·</span
        ><span class="keep">${e("op.step.keep", { value: this.valueText(e, t.value, o, n) })}</span>` : j`${a}<b>${i}</b><span class="arrow">→</span
      ><b>${this.valueText(e, t.value, o, n)}</b>
      ${t.current == null ? T : j` <span class="now">(${e("op.step.now", { value: this.currentText(e, t.current, o) })})</span>`}`;
	}
	rolePrefix(e, t, n) {
		if (!t) return T;
		let r = this.roleName(e, t);
		return r === n ? T : j`<span class="role">${r} · </span>`;
	}
	valueText(e, t, n, r) {
		if (t === !0 || t === "on" || t === "true") return e("op.step.on");
		if (t === !1 || t === "off" || t === "false") return e("op.step.off");
		if (t == null) return "–";
		if (Sr(t)) {
			let n = t.slice(1, -1), i = (n, r) => n == null ? t : `${s(e.lang, n, 0)} ${r}`;
			switch (n) {
				case "target": return i(r.target, "%");
				case "power": return i(r.power_w, "W");
				case "power_neg": return r.power_w == null ? t : `−${s(e.lang, r.power_w, 0)} W`;
				case "floor": return i(r.floor, "%");
				case "percent": return i(r.percent, "%");
				case "seconds": return i(r.seconds, "s");
				case "minutes": return i(r.minutes, "min");
				default: return t;
			}
		}
		if (typeof t == "number") return `${s(e.lang, t, 2)}${n ? ` ${n}` : ""}`;
		let i = Number(t);
		return typeof t == "string" && t.trim() !== "" && Number.isFinite(i) ? `${s(e.lang, i, 2)}${n ? ` ${n}` : ""}` : String(t);
	}
	currentText(e, t, n) {
		if (t === "on") return e("op.step.on");
		if (t === "off") return e("op.step.off");
		let r = Number(t);
		return t.trim() !== "" && Number.isFinite(r) ? `${s(e.lang, r, 2)}${n ? ` ${n}` : ""}` : t;
	}
	renderActions(e, t, r, i) {
		let a = t.op, o = hr.has(a), s = this.probeRunning && this.battery && this.probeRunning.battery === this.battery.id ? this.probeRunning.op : null, c = this.probing === a || s === a, l = !!(this.probing || this.probeRunning || this.busy), u = t.possible && !t.steps.length, d = t.possible && !u && !this.dirty && !l && !i, f = this.lastProbe(a), p = this.choice === "steps" ? e("op.own.back.steps") : this.choice === "generic" ? e("op.own.back.generic") : e("op.own.back.profile");
		return j`<div class="op-actions" data-tipped>
      ${c ? j`<span class="chip">${e("op.probe.running")}</span>` : u ? j`<span class="last">${e("op.probe.nothing")}</span>` : j`<button type="button" class="mini-btn" ?disabled=${!d} @click=${() => this.probe(a)}>
              <ha-icon icon="mdi:test-tube"></ha-icon>${e("op.probe")}
            </button>`}
      ${n(e, "probe")}
      ${u ? T : j`<span class="last ${f ? f.ok ? "ok" : "bad" : ""}">
            ${f ? e(f.ok ? "op.probe.last.ok" : "op.probe.last.failed", { when: `${W(e.lang, f.at, "short")}, ${v(f.at)}` }) : e("op.probe.never")}
          </span>`}
      ${l && !c && t.possible && !u ? j`<span class="last" role="status">${e("op.probe.busy")}</span>` : T}
      ${o ? i ? j`<button type="button" class="mini-btn go" @click=${() => this.finishEditing(a)}>${e("op.own.done")}</button>
              ${n(e, "own_done")}
              <button type="button" class="mini-btn quiet" @click=${() => this.discardEditing(a)}>${e("op.own.discard")}</button>
              ${n(e, "own_discard")}` : j`<button type="button" class="mini-btn" @click=${() => this.startEditing(a, t, r)}>
                <ha-icon icon="mdi:pencil-outline"></ha-icon>${e(r ? "op.own.edit" : "op.own")}
              </button>
              ${n(e, "own_steps", vr)}` : T}
      ${o && r ? j`<button type="button" class="mini-btn quiet" @click=${() => this.resetOwn(a)}>${p}</button> ${n(e, "own_back")}` : T}
    </div>`;
	}
	renderEditor(e, t, r, i) {
		let a = t.steps[r] ?? [], o = i.params ?? {};
		return j`<div class="editor" data-op=${r} data-tipped>
      ${a.length ? j`<ol class="op-steps edit">
            ${a.map((n, i) => this.renderEditRow(e, t, r, n, i, a.length, o))}
          </ol>` : j`<p class="field-hint hint">${e("op.own.empty")}</p>`}
      <div class="add">
        <button type="button" class="mini-btn" @click=${() => this.addStep(r)}>
          <ha-icon icon="mdi:plus"></ha-icon>${e("f.battery.steps.add")}
        </button>
        ${n(e, "control_steps", vr)}
      </div>
      <div class="op-restore"><small class="own-restore">${e("op.own.restore")}</small></div>
    </div>`;
	}
	renderEditRow(e, t, r, i, a, o, s) {
		let l = this.hass, u = i.entity_id ?? "", d = i.service ? "service" : this.stepKind(u), f = `step_${d === "trigger" ? "text" : d}`, p = j`<span class="tools">
      <button
        type="button"
        class="icon-btn"
        aria-label=${e("op.own.up")}
        title=${e("op.own.up")}
        ?disabled=${a === 0}
        @click=${() => this.moveStep(r, a, -1)}
      >
        <ha-icon icon="mdi:arrow-up"></ha-icon>
      </button>
      <button
        type="button"
        class="icon-btn"
        aria-label=${e("op.own.down")}
        title=${e("op.own.down")}
        ?disabled=${a === o - 1}
        @click=${() => this.moveStep(r, a, 1)}
      >
        <ha-icon icon="mdi:arrow-down"></ha-icon>
      </button>
      <button type="button" class="icon-btn" aria-label=${e("f.remove")} title=${e("f.remove")} @click=${() => this.removeStep(r, a)}>
        <ha-icon icon="mdi:close"></ha-icon>
      </button>
      ${n(e, f, vr)}
    </span>`;
		if (i.service) return j`<li class="edit" data-tipped>
        <span class="n">${a + 1}.</span>
        <span class="what"><span class="who">${this.stepText(e, {
			kind: "call",
			service: i.service,
			data: i.data ?? {}
		}, s)}</span></span>
        ${p}
      </li>`;
		let m = this.roleOf(t, u), h = c(l, u);
		return j`<li class="edit" data-tipped>
      <span class="n">${a + 1}.</span>
      <span class="what">
        <span class="who">
          ${this.rolePrefix(e, m, h)}
          <button
            type="button"
            class="name-btn"
            title=${e("op.own.swap")}
            aria-label=${`${e("op.own.swap")}: ${h}`}
            @click=${() => this.swapStep(r, a)}
          >
            <b>${h}</b><ha-icon icon="mdi:swap-horizontal"></ha-icon>
          </button>
        </span>
        ${this.renderStepValue(e, r, i, a, d)}
      </span>
      ${p}
    </li>`;
	}
	renderStepValue(e, t, n, r, i) {
		let a = n.entity_id ?? "", o = n.value, c = o == null ? "" : String(o), l = e("f.battery.steps.value"), u = (e) => this.setStepValue(t, r, e.target.value), d = (e) => {
			e.key === "Enter" && (e.preventDefault(), e.target.blur());
		};
		switch (i) {
			case "toggle": {
				let n = o === !0 || o === "on" || o === "true", i = o === !1 || o === "off" || o === "false";
				return j`<span class="seg onoff" role="group" aria-label=${l}>
          <button type="button" aria-pressed=${String(n)} @click=${() => this.setStepValue(t, r, "on")}>${e("op.step.on")}</button>
          <button type="button" aria-pressed=${String(i)} @click=${() => this.setStepValue(t, r, "off")}>${e("op.step.off")}</button>
        </span>`;
			}
			case "option": {
				let e = this.valueHints(a, t), n = c && !e.includes(c) ? [c, ...e] : e;
				return j`<select class="input value-select" aria-label=${l} @change=${u}>
          ${n.map((e) => j`<option value=${e} ?selected=${e === c}>${e}</option>`)}
        </select>`;
			}
			case "number": {
				let n = this.hass?.states[a]?.attributes ?? {}, i = this.unitOf(a), o = typeof n.min == "number" && typeof n.max == "number" ? `${s(e.lang, n.min, 2)} – ${s(e.lang, n.max, 2)}` : "", f = this.valueHints(a, t);
				return j`<span class="value-number">
          <span class="unit-input">
            <input
              class="input"
              type="text"
              inputmode="decimal"
              aria-label=${l}
              placeholder=${o}
              .value=${c}
              @change=${u}
              @keydown=${d}
            />
            ${i ? j`<span class="unit">${i}</span>` : T}
          </span>
          ${f.map((n) => j`<button
              type="button"
              class="ph"
              aria-pressed=${String(c === n)}
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
			case "trigger": return j`<span class="now">${e("op.own.trigger")}</span>`;
			default: return j`<input class="input value-text" type="text" aria-label=${l} placeholder=${l} .value=${c} @change=${u} @keydown=${d} />`;
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
		let r = this.valueHints(t, n), i = r.length ? Cr(r[0]) : null;
		switch (this.stepKind(t)) {
			case "toggle": return e === !0 || e === "on" || e === "true" ? "on" : e === !1 || e === "off" || e === "false" ? "off" : i;
			case "option": return typeof e == "string" && r.includes(e) ? e : i;
			case "number": return typeof e == "number" ? e : typeof e == "string" && e.trim() !== "" && Number.isFinite(Number(e.replace(",", "."))) ? Number(e.replace(",", ".")) : Sr(e) && r.includes(e) ? e : i;
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
				value: wr(n, e, t.params ?? {})
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
			let a = Cr(r.value);
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
				[e]: xr(t)
			};
		} finally {
			this.probing = null, this.refreshPreview();
		}
	}
	renderProbe(e, t) {
		let n = this.hass, r = this.probeErrors[t];
		if (r) return j`<div class="probe bad" role="status">
        <p class="problem">${e("op.probe.failed")} ${e("op.probe.error", { error: r })}</p>
      </div>`;
		let i = this.probeResults[t];
		if (!i) return T;
		let a = i.problem ? this.problemText(e, i) : "", o = (t) => t.service ? e("op.step.service", { service: t.service }) : t.entity_id ? c(n, t.entity_id) : "", l = i.power_kw != null && Math.abs(i.power_kw) < .005 ? 0 : i.power_kw;
		return j`<div class="probe ${i.ok ? "ok" : "bad"}" role="status">
      ${a ? j`<p class="problem">${a}</p>` : T}
      ${i.steps?.length || !a ? j`<ul>
            ${(i.steps ?? []).map((t) => {
			let n = t.taken && !t.error, r = this.unitOf(t.entity_id), i = t.error ? e("op.probe.error", { error: e.optional(`devices.problem.${t.error}`) ?? t.error }) : e(n ? t.service ? "op.probe.call_taken" : "op.probe.taken" : "op.probe.not_taken"), a = t.service ? [i] : [e("op.probe.wrote", {
				wrote: this.valueText(e, t.wrote, r, {}),
				read: t.read == null ? "–" : this.currentText(e, String(t.read), r)
			}), i];
			return j`<li class=${n ? "ok" : "bad"}>
                <ha-icon icon=${n ? "mdi:check-circle" : "mdi:close-circle"}></ha-icon>
                <span><b>${o(t)}</b><small>${a.join(" · ")}</small></span>
              </li>`;
		})}
            <li class=${i.restored ? "ok" : "bad"}>
              <ha-icon icon=${i.restored ? "mdi:check-circle" : "mdi:close-circle"}></ha-icon>
              <span
                >${i.restored ? e("op.probe.restored") : e("op.probe.not_restored", { entities: (i.restore_errors ?? []).map((e) => c(n, e)).join(", ") })}</span
              >
            </li>
          </ul>` : T}
      ${l == null ? T : j`<small>${e("devices.test.power", { value: s(e.lang, l, 2) })}</small>`}
    </div>`;
	}
	problemText(e, t) {
		let n = t.problem ?? "";
		return n === "not_possible" && t.why ? `${e("op.probe.problem.not_possible")} ${this.whyText(e, t.why)}` : n === "controls_missing" && t.missing?.length ? e("op.probe.problem.controls_missing.list", { missing: t.missing.map((t) => this.roleName(e, t)).join(", ") }) : e.optional(`op.probe.problem.${n}`) ?? e("op.probe.problem.other", { code: n });
	}
	roleRows(e) {
		let t = this.hass, n = (this.preview?.roles ?? []).filter((t) => t.relevant || t.deviates || t.found || e.controls[t.role]), r = new Set(n.map((e) => e.role)), i = [...n], a = [...Fn, ...Object.keys(e.controls)];
		for (let n of a) {
			if (r.has(n)) continue;
			r.add(n);
			let a = e.controls[n] ?? null, o = mr[n];
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
		switch (t.kind ?? mr[t.role] ?? null) {
			case "toggle": return e("role.kind.toggle");
			case "option": return e("role.kind.option");
			case "level": return e("role.kind.level", { unit: n ?? "%" });
			case "setpoint": return t.role.includes("limit") ? n ? e("role.kind.limit", { unit: n }) : e("role.kind.limit.nounit") : n ? e("role.kind.setpoint", { unit: n }) : e("role.kind.setpoint.nounit");
			default: return "";
		}
	}
	renderRoles(e, t) {
		let r = this.hass, i = this.roleRows(t), a = t.controls.mode, o = a ? r.states[a]?.attributes.options ?? [] : [], s = !!this.preview?.deviates && this.choice === "profile", l = (this.preview?.operations ?? []).filter((e) => !e.possible).map((t) => e.optional(`op.short.${t.op}`) ?? t.op), u = this.profileName;
		return j`<div data-tipped>
      <div class="sub">${e("roles.title")} ${n(e, "roles_list")}</div>
      ${s ? j`<div class="note warn reset" role="status">
            <ha-icon icon="mdi:alert-outline"></ha-icon>
            <span
              >${e("roles.warn", { name: u })}
              ${l.length ? j` ${e("roles.warn.ops", { ops: l.join(", ") })}` : T}
              <div class="note-actions">
                <button type="button" class="mini-btn go" @click=${this.resetToProfile}>${e("roles.reset", { name: u })}</button>
                ${n(e, "roles_reset")}
              </div></span
            >
          </div>` : T}
      <div class="rows">
        ${i.map((t) => {
			let n = t.role, i = t.entity_id, a = this.kindText(e, t), o = t.used_by?.length ? t.used_by.map((t) => e.optional(`op.short.${t}`) ?? t).join(", ") : "";
			return j`<div class="row ${t.deviates ? "dev" : ""}">
            <span class="label">
              ${this.roleName(e, n)}${a ? j` <span class="kind">(${a})</span>` : T}
              ${o ? j`<small>${e("roles.used_by", { ops: o })}</small>` : T}
            </span>
            <span class="entity">
              ${i ? j`<b>${c(r, i)}</b><small>${d(r, i, e.lang)}</small>` : j`<small>${e("roles.unassigned")}</small>`}
              ${t.deviates && t.found && t.found !== i ? j`<small class="found">${e("roles.by_profile", { name: c(r, t.found) })}</small>` : T}
              ${t.deviates ? j`<span class="chip warn">${e("roles.deviates")}</span>` : T}
            </span>
            <span class="buttons">
              <button type="button" class="mini-btn" @click=${() => this.pickRole(n)}>
                <ha-icon icon="mdi:magnify"></ha-icon>${e(i ? "review.change" : "review.choose")}
              </button>
              ${i ? j`<button
                    type="button"
                    class="icon-btn"
                    aria-label=${e("f.remove")}
                    title=${e("f.remove")}
                    @click=${() => this.setRole(n, null)}
                  >
                    <ha-icon icon="mdi:close"></ha-icon>
                  </button>` : T}
            </span>
          </div>`;
		})}
      </div>
      </div>
      ${a ? j`<div data-tipped>
            <div class="sub">${e("f.battery.mode_options")} ${n(e, "mode_options")}</div>
            <div class="rows">
              ${In.map((n) => j`<div class="row">
                  <label for="opt-${n}">${e(`meaning.${n}`)}</label>
                  <select
                    id="opt-${n}"
                    class="input"
                    @change=${(e) => this.setOption(n, e.target.value)}
                  >
                    <option value="" ?selected=${!t.mode_options[n]}>${e("meaning.none")}</option>
                    ${o.map((e) => j`<option value=${e} ?selected=${t.mode_options[n] === e}>${e}</option>`)}
                  </select>
                  <span></span>
                </div>`)}
            </div>
            </div>` : T}`;
	}
	renderSummary(e) {
		let t = this.preview;
		if (!t?.operations?.length) return T;
		let n = new Map(t.operations.map((e) => [e.op, e])), r = [], i = /* @__PURE__ */ new Map(), a = this.holdFolded;
		for (let t of Ln) {
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
		let o = gr.filter((e) => n.get(e) && !n.get(e).possible), s = o.length > 0;
		return j`<div class="note ${s ? "warn" : ""} ready" role="status">
      <ha-icon icon=${s ? "mdi:alert-outline" : "mdi:check-circle-outline"}></ha-icon>
      <span>
        <span class="line">${r.join(" · ")}</span>
        <span class="lines">
          ${s ? o.map((t) => j`<div>${e(`summary.missing.${t}`)}</div>`) : j`<div>${e("summary.ok")}</div>`}
        </span>
      </span>
    </div>`;
	}
	choose(e) {
		let t = this.value, n = t.adapter === ur ? {} : t.controls;
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
			let e = this.battery?.adapter === ur ? this.battery : void 0, n = {
				host: "",
				...fr,
				...e?.modbus ?? t.modbus ?? {}
			};
			this.emit({
				...t,
				adapter: ur,
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
		let t = this.t, n = this.value.controls[e], r = mr[e] ?? "writable", i = await R(this, {
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
		let t = this.t, n = (await R(this, {
			heading: t("pick.step.title"),
			tip: "control_steps",
			tipVars: vr,
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
		let i = (await R(this, {
			heading: n("pick.step.title"),
			tip: "control_steps",
			tipVars: vr,
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
		let r = this.value, i = this.stepsWithTyped(e), a = Cr(n);
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
b([A({ attribute: !1 })], G.prototype, "hass", void 0), b([A({ attribute: !1 })], G.prototype, "t", void 0), b([A({ attribute: !1 })], G.prototype, "battery", void 0), b([A({ attribute: !1 })], G.prototype, "found", void 0), b([A({ attribute: !1 })], G.prototype, "value", void 0), b([A({ attribute: !1 })], G.prototype, "profiles", void 0), b([A({ type: Boolean })], G.prototype, "dirty", void 0), b([A({ attribute: !1 })], G.prototype, "probes", void 0), b([A({ attribute: !1 })], G.prototype, "probeRunning", void 0), b([A({ type: Boolean })], G.prototype, "busy", void 0), b([C()], G.prototype, "preview", void 0), b([C()], G.prototype, "previewState", void 0), b([C()], G.prototype, "previewFailure", void 0), b([C()], G.prototype, "open", void 0), b([C()], G.prototype, "editing", void 0), b([C()], G.prototype, "probing", void 0), b([C()], G.prototype, "probeResults", void 0), b([C()], G.prototype, "probeErrors", void 0), b([C()], G.prototype, "modbusCheck", void 0), b([C()], G.prototype, "modbusChecking", void 0), b([C()], G.prototype, "modbusChecked", void 0), _("joe-battery-control", G);
//#endregion
//#region src/editors/battery-editor.ts
var Er = [
	"adapter",
	"controls",
	"mode_options",
	"steps",
	"prepare",
	"modbus"
], Dr = class extends P {
	constructor(...e) {
		super(...e), this.batteryId = "", this.unknown = !1, this.saving = !1;
	}
	static {
		this.styles = [x, D`
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
		(e.has("config") || e.has("batteryId")) && t && !this.values && (this.values = Object.fromEntries(ar.map((e) => [e, structuredClone(t[e])])), this.control = {
			...yr(t),
			prepare: structuredClone(t.prepare)
		}, this.unknown = this.config?.answers[`capacity:${t.id}`] === "unknown");
	}
	render() {
		let { t: e, hass: t, config: r, values: i, control: a } = this, o = this.battery;
		if (!e || !t || !r || !i || !a || !o) return T;
		let s = this.discovery?.batteries.find((e) => e.id === o.id);
		return j`<div class="sheet-title">${N(e("edit.battery.title", { name: o.name }))}</div>
      <joe-battery-fields
        .hass=${t}
        .t=${e}
        .config=${r}
        .battery=${o}
        .floor=${this.floor}
        .draft=${i}
        .unknown=${this.unknown}
        @joe-battery-change=${(e) => {
			this.values = {
				...i,
				...e.detail.change
			}, e.detail.unknown !== void 0 && (this.unknown = e.detail.unknown);
		}}
      ></joe-battery-fields>
      <div class="field" data-tipped>
        <div class="field-label">${e("f.battery.control")} ${n(e, "control_choice")}</div>
        <joe-battery-control
          .hass=${t}
          .t=${e}
          .battery=${o}
          .found=${s}
          .profiles=${this.info?.profiles}
          .value=${a}
          @joe-control-change=${(e) => {
			this.control = br(o, e.detail, s);
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
		for (let t of [...ar, ...Er]) JSON.stringify(e[t] ?? null) !== JSON.stringify(i[t] ?? null) && (a[t] = i[t]);
		let o = `capacity:${e.id}`, s = {};
		if (Object.keys(a).length && (s.batteries = { [e.id]: a }), t.answers[o] === "unknown" !== this.unknown && (s.answers = { [o]: this.unknown ? "unknown" : null }), Object.keys(s).length) {
			this.saving = !0;
			let e = await L(this, s);
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
b([A({ attribute: !1 })], Dr.prototype, "hass", void 0), b([A({ attribute: !1 })], Dr.prototype, "t", void 0), b([A({ attribute: !1 })], Dr.prototype, "config", void 0), b([A({ attribute: !1 })], Dr.prototype, "discovery", void 0), b([A({ attribute: !1 })], Dr.prototype, "info", void 0), b([A({ attribute: !1 })], Dr.prototype, "floor", void 0), b([A()], Dr.prototype, "batteryId", void 0), b([C()], Dr.prototype, "values", void 0), b([C()], Dr.prototype, "control", void 0), b([C()], Dr.prototype, "unknown", void 0), b([C()], Dr.prototype, "saving", void 0), _("joe-battery-editor", Dr);
//#endregion
//#region src/fonts.ts
var Or = [
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
function kr() {
	if (document.getElementById("energy-joe-fonts")) return;
	let e = document.createElement("style");
	e.id = "energy-joe-fonts", e.textContent = Or.map(([e, t, n, r]) => `@font-face{font-family:"${e}";font-style:${n};font-weight:${t};font-display:swap;src:url("${Ie(`fonts/${r}.woff2`)}") format("woff2")}`).join("\n"), document.head.appendChild(e);
}
//#endregion
//#region node_modules/lit-html/directive-helpers.js
var { I: Ar } = ve, jr = (e) => e, Mr = (e) => e.strings === void 0, Nr = () => document.createComment(""), Pr = (e, t, n) => {
	let r = e._$AA.parentNode, i = t === void 0 ? e._$AB : t._$AA;
	if (n === void 0) n = new Ar(r.insertBefore(Nr(), i), r.insertBefore(Nr(), i), e, e.options);
	else {
		let t = n._$AB.nextSibling, a = n._$AM, o = a !== e;
		if (o) {
			let t;
			n._$AQ?.(e), n._$AM = e, n._$AP !== void 0 && (t = e._$AU) !== a._$AU && n._$AP(t);
		}
		if (t !== i || o) {
			let e = n._$AA;
			for (; e !== t;) {
				let t = jr(e).nextSibling;
				jr(r).insertBefore(e, i), e = t;
			}
		}
	}
	return n;
}, Fr = (e, t, n = e) => (e._$AI(t, n), e), Ir = {}, Lr = (e, t = Ir) => e._$AH = t, Rr = (e) => e._$AH, zr = (e) => {
	e._$AR(), e._$AA.remove();
}, Br = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, Vr = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), Hr = class {
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
}, Ur = (e, t) => {
	let n = e._$AN;
	if (n === void 0) return !1;
	for (let e of n) e._$AO?.(t, !1), Ur(e, t);
	return !0;
}, Wr = (e) => {
	let t, n;
	do {
		if ((t = e._$AM) === void 0) break;
		n = t._$AN, n.delete(e), e = t;
	} while (n?.size === 0);
}, Gr = (e) => {
	for (let t; t = e._$AM; e = t) {
		let n = t._$AN;
		if (n === void 0) t._$AN = n = /* @__PURE__ */ new Set();
		else if (n.has(e)) break;
		n.add(e), Jr(t);
	}
};
function Kr(e) {
	this._$AN === void 0 ? this._$AM = e : (Wr(this), this._$AM = e, Gr(this));
}
function qr(e, t = !1, n = 0) {
	let r = this._$AH, i = this._$AN;
	if (i !== void 0 && i.size !== 0) {
		if (t) {
			if (Array.isArray(r)) for (let e = n; e < r.length; e++) Ur(r[e], !1), Wr(r[e]);
			else r != null && (Ur(r, !1), Wr(r));
		} else Ur(this, e);
	}
}
var Jr = (e) => {
	e.type == Br.CHILD && (e._$AP ??= qr, e._$AQ ??= Kr);
}, Yr = class extends Hr {
	constructor() {
		super(...arguments), this._$AN = void 0;
	}
	_$AT(e, t, n) {
		super._$AT(e, t, n), Gr(this), this.isConnected = e._$AU;
	}
	_$AO(e, t = !0) {
		e !== this.isConnected && (this.isConnected = e, e ? this.reconnected?.() : this.disconnected?.()), t && (Ur(this, e), Wr(this));
	}
	setValue(e) {
		if (Mr(this._$Ct)) this._$Ct._$AI(e, this);
		else {
			let t = [...this._$Ct._$AH];
			t[this._$Ci] = e, this._$Ct._$AI(t, this, 0);
		}
	}
	disconnected() {}
	reconnected() {}
}, Xr = /* @__PURE__ */ new WeakMap(), Zr = Vr(class extends Yr {
	render(e) {
		return T;
	}
	update(e, [t]) {
		let n = t !== this.G;
		return n && this.rt(void 0), (n || this.lt !== this.ct) && (this.G = t, this.ht = e.options?.host, this.rt(this.ct = e.element)), T;
	}
	rt(e) {
		if (this.G !== void 0) {
			if (this.isConnected || (e = void 0), typeof this.G == "function") {
				let t = this.ht ?? globalThis, n = Xr.get(t);
				n === void 0 && (n = /* @__PURE__ */ new WeakMap(), Xr.set(t, n)), n.get(this.G) !== void 0 && this.G.call(this.ht, void 0), n.set(this.G, e), e !== void 0 && this.G.call(this.ht, e);
			} else this.G.value = e;
		}
	}
	get lt() {
		return typeof this.G == "function" ? Xr.get(this.ht ?? globalThis)?.get(this.G) : this.G?.value;
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
function Qr(e) {
	e instanceof HTMLElement && requestAnimationFrame(() => {
		let t = e.parentElement;
		if (!t || t.scrollWidth <= t.clientWidth) return;
		let n = e.offsetLeft;
		(n < t.scrollLeft || n + e.offsetWidth > t.scrollLeft + t.clientWidth) && (t.scrollLeft = n - (t.clientWidth - e.offsetWidth) / 2);
	});
}
function $r() {}
var ei = /* @__PURE__ */ new WeakSet();
function ti(e) {
	if (!(e instanceof HTMLElement)) return;
	let t = () => {
		let t = [];
		e.scrollLeft > 4 && t.push("left"), e.scrollLeft + e.clientWidth < e.scrollWidth - 4 && t.push("right"), e.dataset.more = t.join(" ");
	};
	ei.has(e) || (ei.add(e), e.addEventListener("scroll", t, { passive: !0 }), new ResizeObserver(t).observe(e)), requestAnimationFrame(() => requestAnimationFrame(t));
}
function ni(e, t, n, r, i) {
	return j`<nav class="section-chips" aria-label=${e("nav.sections")} ${Zr(ti)}>
    ${r.map((e) => {
		let r = e.id === i, a = {
			tab: n,
			section: e.id
		};
		return j`<a
        class="section-chip ${r ? "on" : ""}"
        href=${k(t, a)}
        aria-current=${r ? "page" : "false"}
        @click=${E(a)}
        ${Zr(r ? Qr : $r)}
      >
        <ha-icon icon=${e.icon}></ha-icon>
        <span>${e.label}</span>
        ${e.count ? j`<span class="section-count">${e.count}</span>` : T}
        ${e.problem ? j`<i class="section-problem" aria-hidden="true"></i>` : T}
      </a>`;
	})}
  </nav>`;
}
//#endregion
//#region node_modules/lit-html/directives/keyed.js
var ri = Vr(class extends Hr {
	constructor() {
		super(...arguments), this.key = T;
	}
	render(e, t) {
		return this.key = e, t;
	}
	update(e, [t, n]) {
		return t !== this.key && (Lr(e), this.key = t), n;
	}
});
//#endregion
//#region src/components/car-search.ts
async function ii(e, t) {
	if (!t) return;
	let n = await t.callWS({ type: "energy_joe/discover" });
	return e.dispatchEvent(new CustomEvent("joe-discovery", {
		detail: n,
		bubbles: !0,
		composed: !0
	})), n;
}
async function ai(e, t, n) {
	return (await e.callWS({
		type: "energy_joe/car/attach",
		car: t,
		sources: n
	}))?.car ?? void 0;
}
var oi = class extends P {
	constructor(...e) {
		super(...e), this.prefix = M, this.searching = !1, this.searched = !1, this.failed = !1, this.busy = !1, this.picked = [], this.asking = !1;
	}
	static {
		this.styles = [x, D`
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
		if (!e || !t) return T;
		let r = this.found ?? this.discovery, i = ge(t.config, r);
		return j`<div class="head" data-tipped>
        <button type="button" class="btn btn-secondary" ?disabled=${this.searching || this.busy} @click=${this.search}>
          <ha-icon icon="mdi:magnify"></ha-icon>${e("car.search")}
        </button>
        ${n(e, "car_search")}
      </div>
      ${this.searching ? j`<p class="muted" role="status">${e("car.search.busy")}</p>` : T}
      ${this.failed ? j`<p class="bad" role="status">${e("car.search.failed")}</p>` : T}
      ${this.car ? this.renderAttach(e, this.car, i) : this.searched && !this.searching ? this.renderAll(e, i) : T}`;
	}
	renderAll(e, t) {
		return t.length ? j`<p class="lead">${e("car.search.lead")}</p>
      <ul class="finds">
        ${t.map((t) => j`<li data-tipped>
            <ha-icon icon=${t.source.kind === "evcc" ? "mdi:ev-station" : "mdi:car-connected"}></ha-icon>
            ${this.what(e, t)}
            <span class="acts">
              ${t.car ? j`<a class="mini-btn" href=${k(this.prefix, m(t.car.id, "sources"))} @click=${E(m(t.car.id, "sources"))}
                    >${e("car.find.open")}</a
                  >` : j`<button type="button" class="mini-btn go" ?disabled=${this.busy} @click=${() => this.useAsNew(t)}>
                    ${e(t.ignored ? "car.find.reuse" : "car.find.use")}
                  </button>`}
              ${n(e, "car_search_use")}
            </span>
          </li>`)}
      </ul>` : j`<p class="muted">${e("car.search.none")}</p>`;
	}
	renderAttach(e, t, r) {
		let i = r.filter((e) => e.car?.id !== t.id), a = i.filter((e) => this.picked.includes(e.source.id));
		return this.asking ? this.renderAsk(e, t, a) : j`<p class="lead">${e("car.attach.lead", { car: t.name })}</p>
      ${i.length ? j`<ul class="finds">
            ${i.map((t) => {
			let n = this.picked.includes(t.source.id);
			return j`<li>
                <button type="button" class="pick" aria-pressed=${n ? "true" : "false"} ?disabled=${this.busy} @click=${() => this.toggle(t.source.id)}>
                  <ha-icon icon=${n ? "mdi:checkbox-marked-circle" : "mdi:checkbox-blank-circle-outline"}></ha-icon>
                  ${this.what(e, t)}
                </button>
              </li>`;
		})}
          </ul>` : this.searching ? T : j`<p class="muted">${e("car.attach.none")}</p>`}
      ${i.length ? j`<div class="row" data-tipped>
            <button type="button" class="mini-btn go" ?disabled=${this.busy || !a.length} @click=${() => this.attach(t, a)}>
              <ha-icon icon="mdi:link-variant-plus"></ha-icon>${e("car.attach.do", { car: t.name })}
            </button>
            ${n(e, "car_attach")}
          </div>` : T}`;
	}
	renderAsk(e, t, r) {
		let i = r.filter((e) => e.car), a = [...new Set(i.map((e) => e.car))].filter((e) => e.sources.every((e) => r.some((t) => t.source.id === e.id)));
		return j`<div class="ask" role="alert" data-tipped>
      ${i.map((n) => j`<p>${e("car.attach.ask", {
			name: n.source.name ?? Pe(e, n.source),
			from: n.car.name,
			car: t.name
		})}</p>`)}
      ${a.map((t) => j`<p>${e("car.attach.empty", { from: t.name })}</p>`)}
      <div class="row">
        <button type="button" class="mini-btn go" ?disabled=${this.busy} @click=${() => this.attach(t, r, !0)}>${e("car.attach.yes")}</button>
        <button type="button" class="mini-btn quiet" ?disabled=${this.busy} @click=${() => this.asking = !1}>${e("car.attach.no")}</button>
        ${n(e, "car_attach")}
      </div>
    </div>`;
	}
	what(e, t) {
		let n = Pe(e, t.source), r = t.car ? e(this.car ? "car.attach.from" : "car.find.of", { car: t.car.name }) : t.ignored ? e("car.find.ignored") : e("car.find.new");
		return j`<span class="what">
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
			this.found = await ii(this, this.hass) ?? this.found, this.searched = !0;
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
				await ai(this.hass, e.id, t.map((e) => e.source.id)), this.picked = [], this.asking = !1, this.dispatchEvent(new CustomEvent("joe-attached", {
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
				let t = await ai(this.hass, null, [e.source.id]);
				t && w(this, m(t));
			} catch {
				this.failed = !0;
			}
			this.busy = !1;
		}
	}
};
b([A({ attribute: !1 })], oi.prototype, "hass", void 0), b([A({ attribute: !1 })], oi.prototype, "t", void 0), b([A({ attribute: !1 })], oi.prototype, "state", void 0), b([A({ attribute: !1 })], oi.prototype, "discovery", void 0), b([A({ attribute: !1 })], oi.prototype, "prefix", void 0), b([A({ attribute: !1 })], oi.prototype, "car", void 0), b([C()], oi.prototype, "searching", void 0), b([C()], oi.prototype, "searched", void 0), b([C()], oi.prototype, "failed", void 0), b([C()], oi.prototype, "busy", void 0), b([C()], oi.prototype, "found", void 0), b([C()], oi.prototype, "picked", void 0), b([C()], oi.prototype, "asking", void 0), _("joe-car-search", oi);
//#endregion
//#region src/components/car-steer.ts
var si = /* @__PURE__ */ new Map(), ci = (e, t) => JSON.stringify(e ?? null) === JSON.stringify(t ?? null);
function li(e, t) {
	let n = {};
	for (let r of Object.keys(t)) if (!(r === "id" || ci(t[r], e[r]))) {
		if (r === "need") {
			let r = {};
			for (let [n, i] of Object.entries(t.need)) ci(i, e.need[n]) || (r[n] = i);
			n.need = r;
		} else n[r] = t[r];
	}
	return n;
}
function ui(e, t) {
	let n = {
		...e,
		...t
	};
	return t.need && (n.need = {
		...e.need,
		...t.need
	}), n;
}
var di = /^([01]\d|2[0-3]):[0-5]\d$/, fi = class extends P {
	constructor(...e) {
		super(...e), this.prefix = M, this.section = "need", this.saving = !1, this.problem = "", this.version = 0;
	}
	static {
		this.styles = [
			x,
			Sn,
			D`
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
		let e = si.get(this.key);
		return e ? li(e.base, e.draft) : {};
	}
	get draft() {
		let e = this.car;
		return e && si.has(this.key) ? ui(e, this.changes) : e;
	}
	get dirty() {
		let e = si.get(this.key);
		return !!(e && !e.pending && this.car && Object.keys(li(this.car, this.draft)).length);
	}
	setDraft(e) {
		let t = this.car, n = this.draft;
		t && n && (si.set(this.key, {
			base: structuredClone(t),
			draft: {
				...n,
				...e
			},
			pending: !1
		}), this.problem = "", this.version++);
	}
	willUpdate(e) {
		e.has("car") && si.get(this.key)?.pending && si.delete(this.key);
	}
	render() {
		let { t: e, hass: t, draft: r } = this;
		return !e || !t || !r ? T : (this.version, j`<div class="fields">${this.fields(e, r)}</div>
      ${this.problem ? j`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.problem}</span></div>` : T}
      ${this.dirty ? j`<div class="steer-bar" role="region" aria-label=${e("action.steer.unsaved")}>
            <span class="unsaved">${e("action.steer.unsaved")}</span>
            <span class="with-tip" data-tipped>
              <button type="button" class="btn btn-primary" ?disabled=${this.saving} @click=${this.save}>${e("common.save")}</button>
              ${n(e, "car_save")}
            </span>
            <button type="button" class="btn btn-ghost" data-notip ?disabled=${this.saving} @click=${this.cancel}>${e("common.cancel")}</button>
          </div>` : T}`);
	}
	fields(e, t) {
		return this.section === "calendars" ? pn(this) : this.section === "manual" ? j`${fn(this)}
      ${V(e, e("car.f.tracker"), "car_tracker", Jt(this, t.tracker_entity ?? "", () => this.pickTracker()))}` : j`${dn(this)}
      ${V(e, e("car.f.remind"), "car_remind", j`<div class="row">
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
			di.test(t) && this.setDraft({ remind_time: t });
		}}
          />
        </div>`)}
      ${V(e, e("car.f.name"), "car_name", j`<input
          class="input"
          type="text"
          maxlength="60"
          .value=${t.name}
          @change=${(e) => this.setDraft({ name: e.target.value.trim() || t.name })}
        />`)}`;
	}
	async pickTracker() {
		let e = this.t, t = await R(this, {
			heading: e("car.pick.tracker"),
			tip: "car_tracker",
			filter: "presence",
			selected: this.draft?.tracker_entity ? [this.draft.tracker_entity] : []
		});
		t && this.setDraft({ tracker_entity: t.selected[0] ?? null });
	}
	cancel() {
		si.delete(this.key), this.problem = "", this.version++;
	}
	async save() {
		let e = this.draft, t = this.car;
		if (!e || !t) return;
		let n = li(t, e);
		if (!Object.keys(n).length) {
			this.cancel();
			return;
		}
		let r = this.key;
		this.saving = !0;
		let i = await L(this, { cars: { [t.id]: n } });
		this.saving = !1, i && (si.set(r, {
			base: structuredClone(t),
			draft: e,
			pending: !0
		}), this.version++);
	}
};
b([A({ attribute: !1 })], fi.prototype, "hass", void 0), b([A({ attribute: !1 })], fi.prototype, "t", void 0), b([A({ attribute: !1 })], fi.prototype, "state", void 0), b([A({ attribute: !1 })], fi.prototype, "discovery", void 0), b([A({ attribute: !1 })], fi.prototype, "prefix", void 0), b([A({ attribute: !1 })], fi.prototype, "car", void 0), b([A({ attribute: !1 })], fi.prototype, "section", void 0), b([C()], fi.prototype, "saving", void 0), b([C()], fi.prototype, "problem", void 0), b([C()], fi.prototype, "version", void 0);
function pi(e) {
	return {
		name: e,
		sources: [],
		tracker_entity: null,
		need: { ...Bt },
		remind: !0,
		remind_time: "20:00"
	};
}
_("joe-car-steer", fi);
//#endregion
//#region src/pages/devices/device-actions.ts
async function mi(e, t, n) {
	return await L(e, {
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
		answers: { ignored: Qe(t, `battery:${n.id}`, !1) }
	}, "read") ? n.id : null;
}
async function hi(e, t, n, r) {
	let i = (await R(e, {
		heading: t("pick.battery.title"),
		tip: "pick_battery",
		filter: "soc",
		selected: [],
		exclude: r.batteries.map((e) => e.soc_entity)
	}))?.selected[0];
	if (!i) return null;
	let a = n.entities?.[i]?.device_id, o = a && !r.batteries.some((e) => e.id === a) ? a : i;
	return await L(e, { batteries: { [o]: {
		name: a && (n.devices?.[a]?.name_by_user || n.devices?.[a]?.name) || c(n, i),
		adapter: "none",
		soc_entity: i,
		device_id: a ?? null,
		priority: Math.min(r.batteries.length + 1, 9)
	} } }) ? o : null;
}
function gi(e, t, n) {
	return L(e, { answers: { ignored: Qe(t, n, !0) } });
}
//#endregion
//#region src/components/ha-open.ts
function _i(e, t, n) {
	return {
		deviceId: t ? e?.entities?.[t]?.device_id ?? null : null,
		entityId: t ?? null,
		name: n
	};
}
function vi(e, t) {
	let { deviceId: n, entityId: r, name: i } = t;
	if (n) {
		let t = `/config/devices/device/${n}`, r = e("ha.open.device", { name: i });
		return j`<a
      class="ha-open"
      data-notip
      href=${t}
      title=${r}
      aria-label=${r}
      @click=${(e) => {
			e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0 || (e.preventDefault(), be(t));
		}}
      ><ha-icon icon="mdi:open-in-new"></ha-icon
    ></a>`;
	}
	if (r) {
		let t = e("ha.open.entity", { name: i });
		return j`<button
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
	return T;
}
//#endregion
//#region src/components/device-card.ts
function yi(e, t, n) {
	return j`<article class="dcard ${n.problem ? "problem" : ""}">
    <a class="dcard-main" href=${k(t, n.to)} @click=${E(n.to, n.sheet ? { sheet: !0 } : void 0)}>
      <ha-icon icon=${n.icon}></ha-icon>
      <span class="dcard-text">
        <span class="dcard-name"
          >${n.name}${n.problem ? j`<i class="dcard-dot" aria-hidden="true"></i>` : T}</span
        >
        ${n.area ? j`<span class="dcard-area">${n.area}</span>` : T}
        ${n.state ? j`<span class="dcard-state">${n.state}</span>` : T}
        ${n.problem ? j`<span class="dcard-problem">${n.problem}</span>` : T}
        ${n.role ? j`<span class="dcard-meta"><span class="chip">${e(`devices.role.${n.role}`)}</span></span>` : T}
      </span>
    </a>
    ${vi(e, n.ha)}
    ${n.quick ? j`<div class="dcard-quick">${n.quick}</div>` : T}
  </article>`;
}
function bi(e, t, n, r) {
	let i = u(t, g(n, r, "soc")?.entity), a = u(t, g(n, r, "range")?.entity);
	return [i === null ? null : `${s(e.lang, i, 0)} %`, a === null ? null : `${s(e.lang, a, 0)} km`].filter(Boolean).join(" · ");
}
function xi(e, t) {
	return t === null ? void 0 : e("devices.card.kw", { value: s(e.lang, t, t >= 10 ? 1 : 2) });
}
function Si(e, t, n, r) {
	if (!t) return;
	if (r.unassigned) return e(r.deviceId ? "devices.card.unassigned" : "devices.card.unassigned_kind");
	if (r.setup) return e(r.setup === "wallbox" ? "devices.card.setup_car" : "devices.card.setup_hot_water");
	if (r.battery) {
		let n = u(t, r.battery.soc_entity), i = we(t, r.battery.power), a = [n === null ? null : `${s(e.lang, n, 0)} %`];
		return i !== null && a.push(Math.abs(i) < .05 ? e("devices.power.idle") : e(i > 0 ? "devices.power.charge" : "devices.power.discharge", { value: s(e.lang, Math.abs(i), 2) })), a.filter(Boolean).join(" · ") || void 0;
	}
	if (r.group === "climate") {
		let n = r.entityId ? t.states[r.entityId]?.attributes : void 0, i = r.climate?.current_temperature ?? (typeof n?.current_temperature == "number" ? n.current_temperature : null), a = r.climate?.temperature ?? (typeof n?.temperature == "number" ? n.temperature : null);
		return i !== null && a !== null ? e("devices.card.climate", {
			current: s(e.lang, i, 1),
			target: s(e.lang, a, 1)
		}) : i === null ? void 0 : e("devices.card.temp", { value: s(e.lang, i, 1) });
	}
	if (r.part) {
		let i = n?.config.measurements;
		if (r.part === "connection") {
			let n = we(t, i?.grid_power);
			if (n === null) return;
			let r = s(e.lang, Math.abs(n), 2);
			return e(n >= 0 ? "devices.card.import" : "devices.card.export", { value: r });
		}
		return xi(e, r.part === "solar" ? ie(t, i?.solar_power ?? []) : we(t, i?.home_power));
	}
	if (r.car && n) return [bi(e, t, n, r.car.id), he(e, n, r.car)].filter(Boolean).join(" · ");
	let i = r.action;
	if (r.point && i && n) {
		let t = n.control?.actions?.[i.id]?.on;
		return [ee(e, n, i), t ? e("devices.card.running") : ""].filter(Boolean).join(" · ");
	}
	if (i && n?.control?.actions?.[i.id]?.on) return e("devices.card.running");
	if (r.group === "hot_water" && i?.sensor_entity) {
		let n = u(t, i.sensor_entity);
		return n === null ? void 0 : e("devices.card.temp", { value: s(e.lang, n, 0) });
	}
	let a = r.consumer?.power_entity ?? i?.power_entity;
	if (a) {
		let n = t.states[a]?.attributes.unit_of_measurement, r = u(t, a);
		return xi(e, r === null ? null : n === "W" ? r / 1e3 : r);
	}
	return r.noMeter ? e("devices.no_meter_group") : void 0;
}
function Ci(e, t, n, r, i = {}) {
	return {
		name: r.name,
		area: r.area,
		icon: r.icon,
		state: Si(e, t, n, r),
		role: r.unassigned || r.setup ? void 0 : r.role,
		problem: r.problem,
		to: r.setup ? st(r.setup, r.id) : z(r),
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
function wi(e, t, n, r, i = "") {
	if (typeof n == "boolean") return e(n ? "common.on" : "common.off");
	if (typeof n == "number") {
		let a = t?.states[r]?.attributes.unit_of_measurement, o = typeof a == "string" && a ? a : i;
		return `${s(e.lang, n, 1)}${o ? ` ${o}` : ""}`;
	}
	return n == null || n === "" ? "–" : String(n);
}
function Ti(e, t, n) {
	return {
		name: n.name,
		value: wi(e, t, n.value, n.entity_id, n.reason === "reserve" ? "%" : ""),
		soc: s(e.lang, n.soc, 1)
	};
}
function Ei(e, t, n) {
	return e(n.reason === "charge" ? "stuck.title.charge" : "stuck.title.discharge", { name: t });
}
function Di(e, t, n) {
	return e(`stuck.${n.reason}`, Ti(e, t, n));
}
function Oi(e, t, n) {
	return e(`stuck.short.${n.reason}`, Ti(e, t, n));
}
function ki(e, t) {
	let n = /* @__PURE__ */ new Date(), r = `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`, i = v(t);
	return t.slice(0, 10) === r ? e("stuck.since", { time: i }) : e("stuck.since.day", {
		day: W(e.lang, t, "short"),
		time: i
	});
}
function Ai(e, t, r, i) {
	let a = i?.stuck?.[r.id];
	return a ? j`<div class="note warn stuck" role="status" data-tipped>
    <ha-icon icon="mdi:battery-lock"></ha-icon>
    <span>
      <b>${Ei(e, r.name, a)}</b> ${Oi(e, t, a)}
      <small class="stuck-since">${ki(e, a.since)}</small>
      <div class="note-actions stuck-actions">${vi(e, {
		entityId: a.entity_id,
		name: a.name
	})}${n(e, "stuck")}</div>
    </span>
  </div>` : T;
}
//#endregion
//#region src/components/battery-team.ts
function ji(e) {
	return (e?.config.batteries.length ?? 0) >= 2 ? e?.control?.team : void 0;
}
function Mi(e, t) {
	let n = e.rules[t] ?? [], r = (t) => {
		let r = n.indexOf(t.id);
		return r < 0 ? n.length + e.batteries.indexOf(t) : r;
	};
	return [...e.batteries].sort((e, t) => r(e) - r(t));
}
function Ni(e, t) {
	return e.self_regulating ?? t?.batteries[e.id]?.proposed ?? !1;
}
function Pi(e, t) {
	return e.control_group ?? t?.batteries[e.id]?.group ?? `own:${e.id}`;
}
function Fi(e, t, n = e.batteries) {
	let r = /* @__PURE__ */ new Map();
	for (let e of n) {
		let n = Pi(e, t);
		r.set(n, [...r.get(n) ?? [], e]);
	}
	return [...r.values()];
}
function Ii(e, t) {
	return t.length < 2 ? t[0] ?? "" : e("team.together", {
		first: t[0],
		rest: t.slice(1).join(", ")
	});
}
function Li(e, t, n) {
	return Ii(e, n.map((e) => t.batteries[e]?.name ?? e));
}
function Ri(e) {
	let t = Object.keys(e.batteries).filter((t) => e.batteries[t].charge !== null), n = /* @__PURE__ */ new Map();
	for (let r of t) {
		let t = e.batteries[r].group ?? r;
		n.set(t, [...n.get(t) ?? [], r]);
	}
	return [...n.values()];
}
function zi(e) {
	return e.active_batteries ?? (e.active ? [e.active] : []);
}
function Bi(e, t, n) {
	let r = t.batteries[n[0]], i = Li(e, t, zi(t)), a = {
		name: Li(e, t, n),
		active: i
	};
	if (r.why === "active") {
		let i = n.reduce((e, n) => e + (t.batteries[n]?.power_w ?? 0), 0), o = i > 50 ? "charging" : i < -50 ? "discharging" : "idle";
		return r.charge === "blocked" ? e("team.part.active_discharge_only", a) : e(r.discharge === "blocked" ? "team.part.active_charge_only" : `team.part.active_${o}`, a);
	}
	return r.why === "base" ? e("team.part.base", {
		...a,
		w: s(e.lang, t.base?.w ?? 0, 0)
	}) : r.why === "house" ? e("team.part.house", {
		...a,
		w: s(e.lang, t.house_w ?? 0, 0)
	}) : e(`team.part.${r.why ?? "waits_empty"}`, a);
}
function Vi(e, t) {
	return Object.keys(e.batteries).filter((n) => e.batteries[n].why === t);
}
function Hi(e, t) {
	let n = (e) => {
		let t = /* @__PURE__ */ new Date(Date.now() - e * 864e5);
		return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
	};
	return t === n(0) ? e("team.day.today") : t === n(1) ? e("team.day.yesterday") : e("team.day.on", { date: `${t.slice(8, 10)}.${t.slice(5, 7)}.` });
}
function Ui(e, t) {
	let n = Wi(e, t);
	return n && t?.dry ? `${n} ${e("team.reason.dry")}` : n;
}
function Wi(e, t) {
	if (!t || t.state !== "on" || !t.active) return null;
	let n = Li(e, t, zi(t)), r = Vi(t, "along");
	if (t.along && r.length) {
		let i = Object.values(t.along_w ?? {}).reduce((e, t) => e + t, 0);
		return e(`team.reason.along.${t.along}`, {
			active: n,
			others: Li(e, t, r),
			watts: s(e.lang, i, 0)
		});
	}
	let i = Vi(t, "helps");
	if (t.help && i.length) return e("team.reason.help", {
		active: n,
		others: Li(e, t, i)
	});
	if (t.base?.batteries.length) return e("team.reason.base", {
		active: n,
		others: Li(e, t, t.base.batteries),
		w: s(e.lang, t.base.w, 0)
	});
	let a = t.along_plan;
	if (a && !t.parallel && new Date(a.until).getTime() > Date.now()) {
		let r = {
			active: n,
			others: Li(e, t, a.batteries),
			time: a.from.slice(11, 16)
		};
		return e(a.lead_min > 0 ? "team.reason.plan.lead" : "team.reason.plan", {
			...r,
			lead: a.lead_min
		});
	}
	return null;
}
function Gi(e, t) {
	let n = t?.review;
	if (!t || !n) return null;
	let r = {
		when: Hi(e, n.day),
		kwh: s(e.lang, n.room_kwh, 1)
	};
	return n.room_kwh >= .3 && n.short ? e("team.review.room", {
		...r,
		name: Li(e, t, n.short.batteries),
		soc: s(e.lang, n.short.soc ?? 0, 0)
	}) : n.room_kwh >= .3 ? e("team.review.room_full", r) : n.along_at || n.planned_at ? e("team.review.fine", r) : null;
}
function Ki(e, t) {
	let n = t?.learned;
	if (!n || !n.days) return e("team.learned.none");
	let r = Math.round(n.minutes);
	return r < 5 ? e("team.learned.no_lead", { days: n.days }) : e("team.learned.lead", {
		minutes: r,
		days: n.days
	});
}
function qi(e, t, n) {
	let r = n?.suggest;
	if (!n || !r || t.rules.team_early != null) return null;
	let i = Li(e, n, r.batteries);
	return {
		title: e("team.suggest.title", {
			when: Hi(e, r.day),
			kwh: s(e.lang, r.kwh, 1),
			name: i,
			soc: s(e.lang, r.soc ?? 0, 0)
		}),
		text: e("team.suggest.text", {
			name: i,
			minutes: r.lead_min
		})
	};
}
function Ji(e, t) {
	if (t.state === "on") {
		let n = Ri(t), r = zi(t)[0], i = [...n.filter((e) => e.includes(r)), ...n.filter((e) => !e.includes(r))].map((n) => Bi(e, t, n)).join(" · ");
		return e(t.dry ? "team.now.dry" : "team.now", { parts: i });
	}
	return t.state === "bridging" ? e("team.state.bridging", {
		why: e.optional(`team.gap.${t.gap?.reason ?? ""}`) ?? e("team.gap.unknown"),
		time: (t.gap?.until ?? "").slice(11, 16)
	}) : t.state === "not_taken" ? e("team.state.not_taken", { names: Li(e, t, Object.keys(t.batteries).filter((e) => t.batteries[e].problem)) }) : e.optional(`team.state.${t.state}`) ?? t.state;
}
function Yi(e) {
	return e.map((e) => `„${e}“`).join(", ");
}
function Xi(e, t) {
	if (!t || t.state !== "on" || t.dry || !t.active) return null;
	let n = zi(t), r = Ri(t).filter((e) => !e.some((e) => n.includes(e))).map((n) => Li(e, t, n));
	return (t.along || t.help || t.base ? Ui(e, t) : null) || e(t.parallel && Object.values(t.batteries).some((e) => e.why === "parallel") ? "team.doing.parallel" : "team.doing", {
		active: Li(e, t, n),
		others: r.join(", ")
	});
}
function Zi(e) {
	return (e?.config.batteries.length ?? 0) >= 2 ? e?.control?.guard : void 0;
}
function Qi(e, t) {
	return t.map((t) => e.batteries.find((e) => e.id === t)?.name ?? t).join(", ");
}
function $i(e) {
	let t = e.slice(0, 10), n = /* @__PURE__ */ new Date(), r = `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`, i = e.slice(11, 16);
	return t === r ? i : `${t.slice(8, 10)}.${t.slice(5, 7)}. ${i}`;
}
function ea(e, t) {
	return t < 120 ? e("guard.seconds", { n: t }) : e("guard.minutes", { n: Math.round(t / 60) });
}
function ta(e, t, n) {
	if (t.state !== "on") return e(`guard.state.${t.state}`);
	let r = t.last;
	if (!r) return e("guard.watching");
	let i = {
		time: $i(r.at),
		battery: Qi(n, [r.battery]),
		direction: e(`guard.direction.${r.direction}`),
		duration: ea(e, r.seconds)
	};
	if (r.result === "inside") {
		let t = e("guard.last.inside", {
			...i,
			charging: Qi(n, r.charging),
			discharging: Qi(n, r.discharging)
		});
		return r.dry ? `${t} ${e("guard.dry")}` : t;
	}
	let a = Math.min(3, Math.max(1, r.stage)), o = r.result === "fixed" ? e(`guard.last.fixed.${a}`, i) : r.result === "running" ? e(`guard.last.running.${a === 1 ? 1 : 2}`, i) : e(`guard.last.${r.result}`, i);
	return r.dry && (r.result === "running" || r.result === "alarm" || r.result === "fixed") ? `${o} ${e("guard.dry")}` : o;
}
function na(e, t, n) {
	let r = t?.last;
	return !t || t.state !== "on" || !r || r.result !== "alarm" || r.dry ? null : e("guard.alarm", {
		charging: Qi(n, r.charging),
		discharging: Qi(n, r.discharging)
	});
}
function ra(e, t, n) {
	let r = t?.last;
	return !t || t.state !== "on" || !r || r.result !== "inside" || r.dry || r.over ? null : e("guard.inside", {
		charging: Qi(n, r.charging),
		discharging: Qi(n, r.discharging)
	});
}
function ia(e, t) {
	let n = {};
	for (let r of e.batteries) {
		let e = t.batteries[r.id];
		r.control_group == null && e?.self_regulating && e.group && (n[r.id] = { control_group: e.group });
	}
	return { batteries: n };
}
function aa(e, t) {
	return e.batteries.filter((e) => e.control_group == null && t.batteries[e.id]?.self_regulating && t.batteries[e.id]?.group_sure === !1).map((e) => e.name).join(", ");
}
//#endregion
//#region src/components/log.ts
var oa = [
	"all",
	"battery",
	"climate",
	"car",
	"hot_water",
	"other",
	"joe"
];
function sa(e = [], t = []) {
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
function ca(e, t) {
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
		let i = ot(e, r);
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
function la(e, t, n, r, i) {
	if (r === "climate") return n[i] ?? (t ? c(t, i) : i);
	if (r === "battery") return e?.batteries.find((e) => e.id === i)?.name ?? i;
	let a = i.startsWith("action-") ? i.slice(7) : i.startsWith("point:") ? i.slice(6) : i;
	return e?.actions.find((e) => e.id === a)?.name ?? e?.consumers.find((e) => e.id === i)?.name ?? i;
}
function ua(e, t, n, r) {
	let i = t?.batteries.find((e) => e.id === n.battery)?.name ?? t?.actions.find((e) => `action:${e.id}` === n.battery)?.name ?? n.battery ?? "", a = {
		battery: i,
		entity: n.entity ? r ? c(r, n.entity) : n.entity : "",
		value: n.value == null ? "–" : String(n.value),
		target: String(n.target ?? ""),
		power: typeof n.power == "number" ? s(e.lang, n.power, 1) : "–",
		cap: typeof n.cap == "number" ? s(e.lang, n.cap, 1) : "–",
		soc: typeof n.soc == "number" ? s(e.lang, n.soc, 0) : "–",
		unit: typeof n.unit == "string" ? n.unit : "%",
		until: typeof n.until == "string" ? n.until.slice(11, 16) : "–",
		loadpoint: typeof n.loadpoint == "string" ? n.loadpoint : "evcc",
		remaining: typeof n.remaining == "number" ? s(e.lang, n.remaining, 1) : "–",
		headroom: typeof n.headroom == "number" ? s(e.lang, n.headroom, 1) : "–",
		level: typeof n.level == "number" ? s(e.lang, n.level, 0) : "–",
		planned: typeof n.planned == "number" ? s(e.lang, n.planned, 1) : "–",
		charged: typeof n.charged == "number" ? s(e.lang, n.charged, 1) : "–"
	}, o = (e) => t?.batteries.find((t) => t.id === e)?.name ?? String(e ?? ""), l = (e) => Array.isArray(e) ? e.map(o).join(", ") : "";
	if (n.kind.startsWith("team_")) {
		let t = {
			...a,
			battery: Array.isArray(n.batteries) && n.batteries.length > 1 ? Ii(e, n.batteries.map(o)) : i,
			previous: o(n.previous),
			charging: l(n.charging),
			discharging: l(n.discharging),
			cutoff: typeof n.value == "number" ? s(e.lang, n.value, 1) : "–",
			level: typeof n.soc == "number" ? s(e.lang, n.soc, 1) : "–",
			names: Array.isArray(n.names) ? n.names.map((e) => `„${String(e)}“`).join(", ") : "",
			active: o(n.battery),
			others: Array.isArray(n.batteries) ? Ii(e, n.batteries.map(o)) : "",
			energy: typeof n.energy == "number" ? s(e.lang, n.energy, 1) : "–",
			lead: typeof n.value == "number" ? s(e.lang, n.value, 0) : "–",
			watts: typeof n.power == "number" ? s(e.lang, n.power, 0) : "–"
		};
		return n.kind === "team_along" || n.kind === "team_along_end" ? e.optional(`log.${n.kind}.${String(n.reason)}`, t) ?? e(`log.${n.kind}`, t) : n.kind === "team_review" ? e(typeof n.batteries == "object" && n.batteries ? "log.team_review.short" : "log.team_review", t) : n.kind === "team_handover" ? e.optional(`log.team_handover.${String(n.reason)}`, t) ?? e("log.team_handover", t) : n.kind === "team_end" ? e.optional(`log.team_end.${String(n.reason)}`, t) ?? e("log.team_end", t) : n.kind === "team_block" ? e(`log.team_block.${n.charge ? n.discharge ? "both" : "charge" : n.discharge ? "discharge" : "free"}`, t) : n.kind === "team_transfer" ? e(n.blocked ? "log.team_transfer.blocked" : "log.team_transfer", t) : e.optional(`log.${n.kind}`, t) ?? n.kind;
	}
	if (n.kind.startsWith("guard_")) {
		let t = typeof n.seconds == "number" ? n.seconds : 0, i = {
			...a,
			charging: l(n.charging),
			discharging: l(n.discharging),
			names: Array.isArray(n.names) ? n.names.map((e) => `„${String(e)}“`).join(", ") : "",
			entities: Array.isArray(n.entities) ? n.entities.map((e) => r ? c(r, String(e)) : String(e)).join(", ") : "",
			duration: t < 120 ? e("guard.seconds", { n: t }) : e("guard.minutes", { n: Math.round(t / 60) })
		}, o = n.dry ? ".dry" : "", s;
		return s = n.kind === "guard_restart" ? e(n.clean ? `log.guard_restart.clean${o}` : `log.guard_restart${o}`, i) : n.kind === "guard_block" ? e(`log.guard_block.${n.direction === "discharge" ? "discharge" : "charge"}${o}`, i) : n.kind === "guard_hold" ? e(`log.guard_hold.${n.direction === "discharge" ? "discharge" : "charge"}`, i) : n.kind === "guard_hold_end" ? e(`log.guard_hold_end.${[
			"needed",
			"sun",
			"night",
			"team",
			"max",
			"off"
		].find((e) => e === n.reason) ?? "off"}`, i) : n.kind === "guard_alarm" ? e(`log.guard_alarm${o}`, i) : n.kind === "guard_inside" ? e(`log.guard_inside${o}`, i) : n.kind === "guard_fixed" ? e(`log.guard_fixed.${Math.min(3, Math.max(1, Number(n.stage) || 1))}`, i) : n.kind === "guard_restored" ? Array.isArray(n.failed) && n.failed.length > 0 ? e("log.guard_restored.failed", {
			...i,
			entities: n.failed.map((e) => r ? c(r, String(e)) : String(e)).join(", ")
		}) : e(n.reason === "start" ? "log.guard_restored.start" : "log.guard_restored", i) : e.optional(`log.${n.kind}`, i) ?? n.kind, typeof n.problem == "string" ? `${s} ${e("log.guard.problem", { code: n.problem })}` : s;
	}
	if (n.kind === "house" || n.kind === "house_end") {
		let t = {
			...a,
			watts: typeof n.power == "number" ? s(e.lang, n.power, 0) : "–"
		};
		return n.kind === "house_end" ? e.optional(`log.house_end.${String(n.reason)}`, t) ?? e("log.house_end", t) : e("log.house", t);
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
		let t = typeof n.sun == "string" ? n.sun.slice(11, 16) : "–", r = typeof n.kwh == "number" ? s(e.lang, n.kwh, 1) : "–";
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
		let t = String(n.reason ?? ""), i = t === "reserve" && typeof n.value == "number" ? s(e.lang, n.value, 1) : wi(e, r, n.value, String(n.entity ?? ""));
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
function da(e, t, n, r) {
	let i = n[t.entity] ?? (r ? c(r, t.entity) : t.entity);
	return j`<b>${i}</b> · ${e.optional(`climate.log.${t.what}`) ?? t.what}`;
}
function fa(e, t, n) {
	if (!n || !n.group || n.group === "all") return !0;
	let r = ca(e, t);
	return r.group === n.group && (!n.device || r.device === n.device);
}
var pa = class extends P {
	constructor(...e) {
		super(...e), this.names = {}, this.entries = [], this.limit = Infinity;
	}
	static {
		this.styles = [x, D`
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
		if (!e) return T;
		let t = this.entries.filter((e) => fa(this.config, e, this.filter)).slice(0, this.limit);
		return t.length ? j`<ul class="log">
      ${t.map((t) => j`<li>
          <time datetime=${t.at}>${W(e.lang, t.at.slice(0, 10), "short")} ${t.at.slice(11, 16)}</time>
          <span
            >${t.area === "climate" ? da(e, t, this.names, this.hass) : ua(e, this.config, t, this.hass)}</span
          >
        </li>`)}
    </ul>` : j`<p class="empty">${this.empty ?? e("past.log.empty")}</p>`;
	}
};
b([A({ attribute: !1 })], pa.prototype, "t", void 0), b([A({ attribute: !1 })], pa.prototype, "hass", void 0), b([A({ attribute: !1 })], pa.prototype, "config", void 0), b([A({ attribute: !1 })], pa.prototype, "names", void 0), b([A({ attribute: !1 })], pa.prototype, "entries", void 0), b([A({ attribute: !1 })], pa.prototype, "limit", void 0), b([A({ attribute: !1 })], pa.prototype, "filter", void 0), b([A({ attribute: !1 })], pa.prototype, "empty", void 0), _("joe-log-list", pa);
//#endregion
//#region src/pages/devices/device-frame.ts
var ma = [
	"now",
	"steer",
	"power",
	"learned",
	"log",
	"intruders",
	"remove"
];
function ha(e) {
	return e != null && e !== T && e !== "";
}
function ga(e, t, n) {
	let r = {
		tab: "devices",
		section: n
	};
	return j`<a class="back-link" href=${k(t, r)} @click=${E(r)}
    >${e("nav.back", { name: e(`nav.devices.${n}`) })}</a
  >`;
}
function _a(e) {
	return j`<div class="note warn" role="status">
    <ha-icon icon="mdi:help-circle-outline"></ha-icon><span>${e("nav.not_found")}</span>
  </div>`;
}
function va(e) {
	return sa(e?.control?.log ?? [], e?.climate?.log ?? []);
}
function ya(e, t) {
	let n = t.group === "grid" ? "joe" : t.group, r = Si(e.t, e.hass, e.state, t), i = !!(t.setup || t.unassigned || t.noMeter);
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
			entries: va(e.state),
			filter: {
				group: n,
				device: t.id
			}
		}
	};
}
var ba = {
	battery: "learn_battery",
	car: "learn_car",
	hot_water: "learn_hot_water",
	devices: "learn_groups",
	climate: "learn_climate"
};
function xa(e, t, r, i) {
	let { t: a } = e, o = t.tips?.[r] ?? (r === "learned" && t.learnedArea ? ba[t.learnedArea] : void 0);
	return j`<section class="card dsec" data-section=${r} data-anchor=${r} ?data-tipped=${!!o}>
    <h3 class="dsec-title">${r === "remove" && t.removeTitle ? t.removeTitle : a(`devices.page.${r}`)}${o ? n(a, o) : T}</h3>
    ${i}
  </section>`;
}
function Sa(e, t) {
	return j`<section class="card dsec" data-section=${t.anchor} data-anchor=${t.anchor} ?data-tipped=${!!t.tip}>
    <h3 class="dsec-title">${t.title}${t.tip ? n(e.t, t.tip) : T}</h3>
    ${t.body}
  </section>`;
}
function Ca(e, t) {
	let n = t.log;
	if (!n || !n.entries.some((t) => fa(e.state?.config, t, n.filter))) return;
	let r = n.filter, i = {
		tab: "review",
		section: "log",
		id: r.group ?? "all",
		sub: r.group && r.group !== "all" ? r.device : void 0
	};
	return j`<joe-log-list
      .t=${e.t}
      .hass=${e.hass}
      .config=${e.state?.config}
      .names=${n.names ?? {}}
      .entries=${n.entries}
      .filter=${r}
      .limit=${n.limit ?? 5}
    ></joe-log-list>
    <a class="mini-btn quiet frame-more" href=${k(e.prefix, i)} @click=${E(i)}>${e.t("devices.page.more_log")}</a>`;
}
function wa(e, t) {
	let { t: n, prefix: r } = e, i = {};
	for (let a of ma) {
		if (a === "log") {
			let n = Ca(e, t);
			n && (i.log = n);
			continue;
		}
		let o = t[a];
		if (!ha(o)) continue;
		let s = {
			tab: "review",
			section: "learned",
			id: t.learnedArea
		};
		i[a] = a === "learned" && t.learnedArea ? j`${o}
            <a class="mini-btn quiet frame-more" href=${k(r, s)} @click=${E(s)}>${n("devices.page.more_learned")}</a>` : o;
	}
	return j`<div class="dframe">
    ${ga(n, r, t.group)}
    <header class="card dhead">
      <div class="dhead-top">
        <ha-icon class="dhead-icon" icon=${t.icon ?? nt[t.group]}></ha-icon>
        <div class="dhead-text">
          <h2 class="dhead-name">${t.name}</h2>
          ${t.area ? j`<span class="dhead-area">${t.area}</span>` : T}
        </div>
        ${t.ha ? vi(n, t.ha) : T}
      </div>
      ${ha(t.live) ? j`<p class="dhead-live">${t.live}</p>` : T}
      ${ha(t.why) ? j`<p class="dhead-why">${t.why}</p>` : T}
      ${(t.problems ?? []).map((e) => j`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e}</span></div>`)}
      ${ha(t.head) ? t.head : T}
    </header>
    ${ma.map((n) => j`${i[n] === void 0 ? T : xa(e, t, n, i[n])}
        ${n === "steer" ? (t.more ?? []).filter((e) => ha(e.body)).map((t) => Sa(e, t)) : T}`)}
  </div>`;
}
function Ta(e, t, n, r) {
	let i = t.filter((e) => e.group === n);
	return j`<div class="dcards">
    ${i.map((t) => yi(e.t, e.prefix, Ci(e.t, e.hass, e.state, t, r?.(t))))}
  </div>`;
}
function Ea(e, t, r, i = !0) {
	return j`<div class="group-intro">
    ${N(t)} ${S}
    <p class="lead">${r}</p>
    ${i ? j`<p class="ha-hint with-tip" data-tipped>${e("climate.ha_open")} ${n(e, "ha_open")}</p>` : T}
  </div>`;
}
function Da(e, t, n, r) {
	let i = st(n);
	return j`<a class="btn btn-secondary add-link" href=${k(t, i)} @click=${E(i, { sheet: !0 })}
    ><ha-icon icon="mdi:plus"></ha-icon>${r ?? e("devices.add")}</a
  >`;
}
var K = D`
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
`, q = class extends P {
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
b([A({ attribute: !1 })], q.prototype, "hass", void 0), b([A({ attribute: !1 })], q.prototype, "t", void 0), b([A({ attribute: !1 })], q.prototype, "state", void 0), b([A({ attribute: !1 })], q.prototype, "route", void 0), b([A({ attribute: !1 })], q.prototype, "prefix", void 0), b([A({ attribute: !1 })], q.prototype, "discovery", void 0), b([A({ attribute: !1 })], q.prototype, "info", void 0), b([A({ attribute: !1 })], q.prototype, "checks", void 0), b([A({ attribute: !1 })], q.prototype, "climateFound", void 0), b([A({ attribute: !1 })], q.prototype, "devices", void 0);
var Oa = class extends q {
	constructor(...e) {
		super(...e), this.group = "other";
	}
	static {
		this.styles = [
			x,
			K,
			D`
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
		if (!e || !this.state) return T;
		let t = gt(this.devices, this.group, this.device);
		return t ? wa(this.ctx, ya(this.ctx, t)) : j`<div class="wrap">
      ${N(e(`nav.devices.${this.group}`))} ${this.device === void 0 ? T : _a(e)}
      ${Ta(this.ctx, this.devices, this.group)}
      ${this.group === "grid" ? T : j`<div class="actions">${Da(e, this.prefix)}</div>`}
    </div>`;
	}
};
b([A({ attribute: !1 })], Oa.prototype, "device", void 0), b([A({ attribute: !1 })], Oa.prototype, "sub", void 0);
//#endregion
//#region src/pages/devices/add.ts
var ka = [
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
], Aa = {
	wallbox: "ev",
	hot_water: "hot_water",
	night: "custom"
}, ja = {
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
}, Ma = class extends q {
	constructor(...e) {
		super(...e), this.behind = {
			tab: "devices",
			section: "all"
		}, this.busy = "", this.searchFailed = !1;
	}
	static {
		this.styles = [x, D`
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
		let t = this.kind ? ja[this.kind] : void 0;
		e.has("kind") && t && w(this, t, { replace: !0 });
	}
	render() {
		let e = this.t;
		return !e || !this.state || this.kind && ja[this.kind] ? T : j`<joe-sheet
      label=${e("devices.add.label")}
      closeLabel=${e("common.close")}
      @joe-close=${this.onClose}
      @joe-config=${this.onConfig}
    >
      ${this.kind === "battery" ? this.renderBattery(e) : this.kind === "car" ? this.renderCar(e) : this.kind && this.kind in Aa ? this.renderAction(e, this.kind) : this.renderChoices(e)}
    </joe-sheet>`;
	}
	renderChoices(e) {
		return j`<div data-tipped>
      <div class="sheet-title">${N(e("devices.add.title"), "h2", n(e, "devices_add"))}</div>
      <p class="lead">${e("devices.add.lead")}</p>
      <ul class="choices">
        ${ka.map(({ kind: t, icon: n }) => {
			let r = t in ja ? ja[t] : st(t, this.consumer), i = t in ja ? { replace: !0 } : {
				replace: !0,
				sheet: !0
			};
			return j`<li>
            <a class="choice" href=${k(this.prefix, r)} @click=${E(r, i)}>
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
		let t = st();
		return j`<a class="back-link" href=${k(this.prefix, t)} @click=${E(t, {
			replace: !0,
			sheet: !0
		})}
      >${e("nav.back", { name: e("devices.add.other") })}</a
    >`;
	}
	renderBattery(e) {
		let t = this.state.config, r = yt(t, this.discovery).filter((e) => e.kind === "battery" && e.battery), i = bt(t, this.discovery), a = (t, n, r) => j`<li>
        <span class="what">
          <b>${t.name}</b>
          <small>${e(n ? "devices.add.battery.ignored" : "devices.found.battery")}</small>
        </span>
        <span class="row-actions">
          <button type="button" class="mini-btn go" ?disabled=${!!this.busy} @click=${() => this.useFound(t, r)}>
            ${e(n ? "devices.add.battery.use" : "devices.found.use")}
          </button>
          ${n ? T : j`<button
                type="button"
                class="mini-btn quiet"
                ?disabled=${!!this.busy}
                @click=${() => this.ignore(r)}
              >
                ${e("devices.found.ignore")}
              </button>`}
        </span>
      </li>`;
		return j`${this.backToChoices(e)}
      <div data-tipped>
        <div class="sheet-title">${N(e("devices.add.battery.title"), "h2", n(e, "devices_found"))}</div>
        <p class="lead">${e("devices.add.battery.lead")}</p>
        ${r.length || i.length ? j`<ul class="found">
              ${r.map((e) => a(e.battery, !1, e.key))}
              ${i.map((e) => a(e, !0, `battery:${e.id}`))}
            </ul>` : j`<p class="empty">${e("devices.add.battery.none")}</p>`}
      </div>
      <div class="actions" data-tipped>
        <button type="button" class="btn btn-secondary" ?disabled=${!!this.busy} @click=${this.pick}>
          <ha-icon icon="mdi:magnify"></ha-icon>${e("devices.add.battery.pick")}
        </button>
        ${n(e, "review_battery_add")}
      </div>`;
	}
	renderCar(e) {
		let r = this.state.config, i = new Set((r.cars ?? []).flatMap((e) => e.sources.map((e) => e.id))), a = this.consumer?.startsWith("car:") ? this.consumer.slice(4) : "", o = (e) => I(r, t(e)) || I(r, `car:${e.id}`), s = (this.discovery?.car_sources ?? []).filter((e) => !i.has(e.id));
		return s.sort((e, t) => Number(t.device_id === a) - Number(e.device_id === a) || Number(o(e)) - Number(o(t))), j`${this.backToChoices(e)}
      <div data-tipped>
        <div class="sheet-title">${N(e("devices.add.car.title"), "h2", n(e, "devices_add_car"))}</div>
        <p class="lead">${e("devices.add.car.lead")}</p>
        ${s.length ? j`<ul class="found">
              ${s.map((n) => j`<li>
                  <span class="what">
                    <b>${n.name ?? n.id}</b>
                    <small>${e("car.source.from", { from: Pe(e, n) })}${o(n) ? ` · ${e("car.find.ignored")}` : ""}</small>
                  </span>
                  <span class="row-actions">
                    <button type="button" class="mini-btn go" ?disabled=${!!this.busy} @click=${() => this.useCar(n)}>
                      ${e(o(n) ? "car.find.reuse" : "devices.found.use")}
                    </button>
                    ${o(n) ? T : j`<button
                          type="button"
                          class="mini-btn quiet"
                          ?disabled=${!!this.busy}
                          @click=${() => this.ignore(t(n))}
                        >
                          ${e("devices.found.ignore")}
                        </button>`}
                  </span>
                </li>`)}
            </ul>` : j`<p class="empty">${e("devices.add.car.none")}</p>`}
      </div>
      <div class="actions" data-tipped>
        <button type="button" class="btn btn-secondary" ?disabled=${!!this.busy} @click=${this.searchCars}>
          <ha-icon icon="mdi:magnify"></ha-icon>${e("car.search")}
        </button>
        ${n(e, "car_search")}
      </div>
      ${this.searchFailed ? j`<p class="empty" role="status">${e("car.search.failed")}</p>` : T}
      <form
        class="by-hand"
        data-tipped
        @submit=${(e) => {
			e.preventDefault();
			let t = e.target.querySelector("input");
			this.makeCar(t.value.trim());
		}}
      >
        <label class="field-label" for="new-car">${e("devices.add.car.by_hand")} ${n(e, "devices_add_car_hand")}</label>
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
			t = await ai(this.hass, null, [e.id]);
		} catch {
			t = void 0;
		}
		this.busy = "", t && w(this, m(t), { replace: !0 });
	}
	async searchCars() {
		this.busy = "search", this.searchFailed = !1;
		try {
			await ii(this, this.hass);
		} catch {
			this.searchFailed = !0;
		}
		this.busy = "";
	}
	async makeCar(e) {
		let t = e || this.t("devices.add.car.name");
		this.busy = "hand";
		let n = Na(this.state.config, t), r = await L(this, { cars: { [n]: pi(t) } });
		this.busy = "", r && w(this, m(n, "sources"), { replace: !0 });
	}
	renderAction(e, t) {
		let n = this.state, r = this.consumer ?? "", i = /^(wallbox|car):/.test(r) ? r : "", a = (i ? void 0 : n.config.consumers.find((e) => e.id === r))?.name ?? (i ? yt(n.config, this.discovery).find((e) => e.key === i)?.name : void 0);
		return j`${this.backToChoices(e)}
      ${ri(`${t}:${this.consumer ?? ""}`, j`<joe-action-editor
          .hass=${this.hass}
          .mailboxes=${n.mailbox}
          .accounts=${n.accounts}
          .apps=${n.apps}
          .t=${e}
          .config=${n.config}
          .discovery=${this.discovery}
          actionId=${`new:${Aa[t]}`}
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
			let n = e.action, r = ot({
				...t,
				actions: [...t.actions.filter((e) => e.id !== n.id), n]
			}, n);
			w(this, z(r), { replace: !0 });
			return;
		}
		Ee(this, this.behind);
	}
	async useFound(e, t) {
		this.busy = t;
		let n = await mi(this, this.state.config, e);
		this.busy = "", n && w(this, {
			tab: "devices",
			section: "battery",
			id: n
		}, { replace: !0 });
	}
	async ignore(e) {
		this.busy = e, await gi(this, this.state.config, e), this.busy = "";
	}
	async pick() {
		if (!this.hass) return;
		this.busy = "pick";
		let e = await hi(this, this.t, this.hass, this.state.config);
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
b([A({ attribute: !1 })], Ma.prototype, "kind", void 0), b([A({ attribute: !1 })], Ma.prototype, "consumer", void 0), b([A({ attribute: !1 })], Ma.prototype, "behind", void 0), b([C()], Ma.prototype, "busy", void 0), b([C()], Ma.prototype, "searchFailed", void 0);
function Na(e, t) {
	let n = `car_${t.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "car"}`.slice(0, 40), r = new Set((e.cars ?? []).map((e) => e.id)), i = n;
	for (let e = 2; r.has(i); e++) i = `${n}_${e}`;
	return i;
}
_("joe-device-add", Ma);
//#endregion
//#region src/components/choice.ts
var Pa = "unknown", Fa = class extends P {
	constructor(...e) {
		super(...e), this.options = [], this.value = [], this.multiple = !1, this.exclusive = [], this.idk = "", this.label = "", this.compact = !1;
	}
	static {
		this.styles = D`
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
		return j`<div class="opts" role="group" aria-label=${this.label}>
      ${this.options.map((e) => this.renderOption(e))}
      ${this.idk ? this.renderOption({
			value: Pa,
			label: this.idk
		}, "idk") : T}
    </div>`;
	}
	renderOption(e, t = "") {
		let n = this.value.includes(e.value);
		return j`<button
      type="button"
      class=${t}
      aria-pressed=${String(n)}
      ?disabled=${e.disabled}
      @click=${() => this.toggle(e.value)}
    >
      ${e.icon ? j`<ha-icon icon=${e.icon}></ha-icon>` : T}
      <span>${e.label}</span>
      ${n && this.multiple ? j`<span class="tick" aria-hidden="true"
            ><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12.5l4.5 4.5L19 7.5" /></svg
          ></span>` : T}
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
b([A({ attribute: !1 })], Fa.prototype, "options", void 0), b([A({ attribute: !1 })], Fa.prototype, "value", void 0), b([A({ type: Boolean })], Fa.prototype, "multiple", void 0), b([A({ attribute: !1 })], Fa.prototype, "exclusive", void 0), b([A()], Fa.prototype, "idk", void 0), b([A()], Fa.prototype, "label", void 0), b([A({
	type: Boolean,
	reflect: !0
})], Fa.prototype, "compact", void 0), _("joe-choice", Fa);
//#endregion
//#region src/rules-view.ts
var Ia = {
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
}, La = {
	battery: [
		"reserve_soc",
		"max_target_soc",
		"evening_min_soc",
		"balance_days",
		"discharge_in_window",
		"converter_losses",
		"day_surplus",
		"car_house_only",
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
		"night_caution",
		"buffer_factor",
		"plan_offset_min",
		"reset_lead_min"
	]
};
[
	...La.battery,
	...La.grid,
	...La.plan
];
var Ra = [
	"until_target",
	"block",
	"free"
], za = [
	"tight",
	"normal",
	"careful"
], Ba = [
	"bold",
	"brave",
	"balanced",
	"careful",
	"cautious"
];
function Va(e) {
	return e in Ia;
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
		let t = Ia[n], i = r[n];
		if (i == null) return e("rule.off");
		let a = Math.round(i * (t.scale ?? 1) * 100) / 100, o = Number.isInteger(a) ? 0 : Number.isInteger(a * 10) ? 1 : 2;
		return `${s(e.lang, a, o)} ${Ha(e, t)}`;
	}
	switch (n) {
		case "priority": return r.priority.map((t) => e(`rule.priority.${t}`)).join(" · ");
		case "discharge_in_window": return e(`rule.discharge.${r.discharge_in_window}`);
		case "day_surplus": return r.day_surplus ? `${e("rule.on")} · ${e(`rule.day_caution.${r.day_caution}`)}` : e("rule.off");
		case "transfer_guard": return e(r.transfer_guard === !1 ? "rule.off" : "rule.on");
		case "night_caution": return e(`rule.night_caution.${r.night_caution ?? "brave"}`);
		case "morning_buffer": return r.morning_buffer_soc == null ? e("rule.morning_buffer.auto") : `${s(e.lang, r.morning_buffer_soc, 0)} %`;
		default: return e(r[n] ? "rule.on" : "rule.off");
	}
}
function Ga(e, t, n, r, i, a, o) {
	if (Va(i)) {
		let o = i === "grid_limit_w" ? Ya(e, t, n, a) : T;
		return Xa(e, t, n, r, Ia[i], o);
	}
	switch (i) {
		case "guard_grid": return Qa(e, t, n);
		case "converter_losses": return $a(e, t, n);
		case "priority": return ro(e, t, n);
		case "discharge_in_window": return io(e, t, n);
		case "day_surplus": return ao(e, t, n);
		case "transfer_guard": return no(e, t, n);
		case "car_house_only": return to(e, t, n, a);
		case "morning_buffer": return Ja(e, t, n, o);
		case "night_caution": return oo(e, t, n);
	}
}
function Ka(e) {
	return e?.morning_buffer ?? e?.morning?.day?.buffer ?? null;
}
var qa = 90;
function Ja(e, t, r, i) {
	let a = r.rules, o = Ka(i), c = a.morning_buffer_soc != null, l = o?.suggested, u = a.grid_friendly, d = {
		soc: s(e.lang, c ? a.morning_buffer_soc ?? 0 : l ?? 0, 0),
		kwh: s(e.lang, o?.need_kwh ?? 0, 1)
	}, f = u ? c ? e("rule.morning_buffer.own_hint", d) : l == null ? e("rule.morning_buffer.pending_hint") : o?.source === "learned" ? e("rule.morning_buffer.learned_hint", d) : e("rule.morning_buffer.start_hint", d) : e("rule.morning_buffer.off_hint"), p = (e) => {
		let n = Number.parseFloat(e.value.trim());
		if (!Number.isFinite(n) || n < 0 || n > qa) {
			e.reportValidity();
			return;
		}
		L(t, { rules: { morning_buffer_soc: Math.round(n) } });
	};
	return j`<div class="row stacked" data-tipped data-anchor="morning_buffer">
    <div>
      <div class="name">
        <b id="morning-buffer">${e("rule.morning_buffer")}</b>${n(e, "r_morning_buffer")}
        ${O(e, F(r, "rules.morning_buffer_soc"))}
      </div>
      <small>${f}</small>
    </div>
    <div class="buffer-control">
      <div class="seg" role="group" aria-labelledby="morning-buffer">
        <button
          type="button"
          aria-pressed=${String(!c)}
          ?disabled=${!u}
          @click=${() => L(t, { rules: { morning_buffer_soc: null } }, "default")}
        >
          ${l == null ? e("rule.morning_buffer.auto") : e("rule.morning_buffer.auto_n", { soc: s(e.lang, l, 0) })}
        </button>
        <button
          type="button"
          aria-pressed=${String(c)}
          ?disabled=${!u}
          @click=${() => c ? void 0 : L(t, { rules: { morning_buffer_soc: l ?? Math.max(30, a.reserve_soc) } })}
        >
          ${e("rule.morning_buffer.own")}
        </button>
      </div>
      ${n(e, c ? "r_morning_buffer_own" : "r_morning_buffer_auto")}
      ${c ? j`<span class="unit-input">
            <input
              class="input"
              type="number"
              inputmode="numeric"
              min="0"
              max=${qa}
              step="1"
              aria-label=${e("rule.morning_buffer.own_label")}
              ?disabled=${!u}
              .value=${String(a.morning_buffer_soc ?? "")}
              @change=${(e) => p(e.target)}
            />
            <span class="unit">%</span>
          </span>` : T}
    </div>
  </div>`;
}
function Ya(e, t, r, i) {
	let a = i?.grid_peak;
	if (!a?.w) return T;
	let o = Math.ceil(a.w / 100) / 10, c = new Date(a.since), l = new Intl.DateTimeFormat(e.lang, {
		day: "numeric",
		month: "long"
	}).format(c), u = Date.now() - c.getTime() >= 6048e5, d = r.rules.grid_limit_w != null;
	return j`<div class="peak">
    <small>${e(d ? "rule.grid_limit_w.measured_own" : u ? "rule.grid_limit_w.measured" : "rule.grid_limit_w.measuring", {
		kw: s(e.lang, o, 1),
		date: l
	})}</small>${n(e, "r_grid_peak")}
    ${d ? T : j`<button
          type="button"
          class="mini-btn quiet"
          @click=${() => L(t, { rules: { grid_limit_w: Math.round(o * 1e3) } })}
        >
          ${e("rule.grid_limit_w.take", { kw: s(e.lang, o, 1) })}
        </button>`}
  </div>`;
}
function Xa(e, t, r, i, a, o = T) {
	let s = i?.defaults?.rules[a.key], c = F(r, `rules.${a.key}`), l = c?.source === "user";
	return j`<div class="row" data-tipped data-anchor=${a.key}>
    <div>
      <div class="name"><b>${e(`rule.${a.key}`)}</b>${n(e, `r_${a.key}`)}</div>
      <small>${e(`rule.${a.key}.hint`)}</small>
      ${o}
    </div>
    <div class="control">
      ${O(e, c)}
      <span class="unit-input">
        <input
          class="input"
          type="number"
          inputmode="decimal"
          min=${a.min}
          max=${a.max}
          step=${a.step}
          aria-label=${e(`rule.${a.key}`)}
          placeholder=${a.optional ? e("rule.off") : ""}
          .value=${Ua(a, r.rules[a.key])}
          @change=${(e) => Za(t, a, e.target)}
        />
        <span class="unit">${Ha(e, a)}</span>
      </span>
      ${l && s !== void 0 ? j`<button
            type="button"
            class="mini-btn quiet"
            @click=${() => L(t, { rules: { [a.key]: s } }, "default")}
          >
            <ha-icon icon="mdi:restore"></ha-icon>${e("rule.reset")}
          </button>` : T}
    </div>
  </div>`;
}
function Za(e, t, n) {
	let r = n.value.trim(), i = t.scale ?? 1;
	if (r === "") {
		t.optional && L(e, { rules: { [t.key]: null } });
		return;
	}
	let a = Number.parseFloat(r);
	if (!Number.isFinite(a) || a < t.min || a > t.max) {
		n.reportValidity();
		return;
	}
	let o = t.integer ? Math.round(a) : Math.round(a / i * 1e4) / 1e4;
	L(e, { rules: { [t.key]: o } });
}
function Qa(e, t, r) {
	let i = r.rules, a = i.grid_limit_w;
	return j`<div class="row" data-tipped data-anchor="guard_grid">
    <div>
      <div class="name"><b id="guard-grid">${e("rule.guard_grid")}</b>${n(e, "r_guard_grid")}</div>
      <small>${e(a ? "rule.guard_grid.hint" : "rule.guard_grid.no_limit")}</small>
    </div>
    <div class="control">
      ${O(e, F(r, "rules.guard_grid"))}
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${String(i.guard_grid)}
        aria-labelledby="guard-grid"
        ?disabled=${!a}
        @click=${() => L(t, { rules: { guard_grid: !i.guard_grid } })}
      ></button>
    </div>
  </div>`;
}
function $a(e, t, r) {
	let i = r.rules;
	return j`<div class="row" data-tipped data-anchor="converter_losses">
    <div>
      <div class="name"><b id="converter-losses">${e("rule.converter_losses")}</b>${n(e, "r_converter_losses")}</div>
      <small>${e("rule.converter_losses.hint")}</small>
    </div>
    <div class="control">
      ${O(e, F(r, "rules.converter_losses"))}
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${String(i.converter_losses)}
        aria-labelledby="converter-losses"
        @click=${() => L(t, { rules: { converter_losses: !i.converter_losses } })}
      ></button>
    </div>
  </div>`;
}
function eo(e, t, n) {
	if (!t.rules.car_house_only || !n || n.state === "off") return "";
	let r = (e) => t.batteries.find((t) => t.id === e)?.name ?? e, i = (n.batteries ?? []).map(r).join(", "), a = {
		w: s(e.lang, n.w ?? 0, 0),
		names: i || e("rule.car_house_only.battery"),
		loadpoint: (n.loadpoints ?? []).join(", ") || "evcc"
	};
	if (n.state === "no_lever") {
		let t = Object.entries(n.problems ?? {}).map(([t, n]) => e(`rule.car_house_only.problem.${n}`, { name: r(t) }));
		return `${e("rule.car_house_only.state.no_lever")} ${t.join(" ")}`;
	}
	return e(`rule.car_house_only.state.${n.state}`, a);
}
function to(e, t, r, i) {
	let a = r.rules.car_house_only === !0, o = eo(e, r, i?.house);
	return j`<div class="row" data-tipped data-anchor="car_house_only">
    <div>
      <div class="name"><b id="car-house-only">${e("rule.car_house_only")}</b>${n(e, "r_car_house_only")}</div>
      <small>${e("rule.car_house_only.hint")}</small>
      ${o ? j`<small class="replay">${o}</small>` : T}
    </div>
    <div class="control">
      ${O(e, F(r, "rules.car_house_only"))}
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${String(a)}
        aria-labelledby="car-house-only"
        @click=${() => L(t, { rules: { car_house_only: !a } })}
      ></button>
    </div>
  </div>`;
}
function no(e, t, r) {
	let i = r.rules.transfer_guard !== !1;
	return j`<div class="row" data-tipped data-anchor="transfer_guard">
    <div>
      <div class="name"><b id="transfer-guard">${e("rule.transfer_guard")}</b>${n(e, "r_transfer_guard")}</div>
      <small>${e("rule.transfer_guard.hint")}</small>
    </div>
    <div class="control">
      ${O(e, F(r, "rules.transfer_guard"))}
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${String(i)}
        aria-labelledby="transfer-guard"
        @click=${() => L(t, { rules: { transfer_guard: !i } })}
      ></button>
    </div>
  </div>`;
}
function ro(e, t, r) {
	let i = r.rules.priority, a = (e, n) => {
		let r = [...i];
		[r[e], r[e + n]] = [r[e + n], r[e]], L(t, { rules: { priority: r } });
	}, o = (e) => j`<svg
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
	return j`<div class="row" data-tipped data-anchor="priority">
    <div>
      <div class="name"><b>${e("rule.priority")}</b>${n(e, "r_priority")}</div>
      <small>${e("rule.priority.hint")}</small>
    </div>
    <div class="control">
      ${O(e, F(r, "rules.priority"))}
      <div class="order">
        ${i.map((t, n) => j`<div>
            <span>${n + 1}. ${e(`rule.priority.${t}`)}</span>
            <button
              type="button"
              aria-label=${e("rule.priority.up", { name: e(`rule.priority.${t}`) })}
              ?disabled=${n === 0}
              @click=${() => a(n, -1)}
            >
              ${o(!0)}
            </button>
            <button
              type="button"
              aria-label=${e("rule.priority.down", { name: e(`rule.priority.${t}`) })}
              ?disabled=${n === i.length - 1}
              @click=${() => a(n, 1)}
            >
              ${o(!1)}
            </button>
          </div>`)}
      </div>
    </div>
  </div>`;
}
function io(e, t, r) {
	let i = r.rules;
	return j`<div class="row stacked" data-tipped data-anchor="discharge_in_window">
    <div>
      <div class="name">
        <b>${e("rule.discharge_in_window")}</b>${n(e, "r_discharge_in_window")}
        ${O(e, F(r, "rules.discharge_in_window"))}
      </div>
      <small>${e("rule.discharge_in_window.hint")}</small>
    </div>
    <div>
      <joe-choice
        compact
        label=${e("rule.discharge_in_window")}
        .options=${Ra.map((t) => ({
		value: t,
		label: e(`rule.discharge.${t}`)
	}))}
        .value=${[i.discharge_in_window]}
        @joe-choice=${(e) => {
		e.detail.value[0] && L(t, { rules: { discharge_in_window: e.detail.value[0] } });
	}}
      ></joe-choice>
    </div>
  </div>`;
}
function ao(e, t, r) {
	let i = r.rules;
	return j`<div class="row" data-tipped data-anchor="day_surplus">
      <div>
        <div class="name"><b id="day-surplus">${e("rule.day_surplus")}</b>${n(e, "r_day_surplus")}</div>
        <small>${e("rule.day_surplus.hint")}</small>
      </div>
      <div class="control">
        ${O(e, F(r, "rules.day_surplus"))}
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(i.day_surplus)}
          aria-labelledby="day-surplus"
          @click=${() => L(t, { rules: { day_surplus: !i.day_surplus } })}
        ></button>
      </div>
    </div>
    ${i.day_surplus ? j`<div class="row stacked" data-tipped data-anchor="day_caution">
          <div>
            <div class="name">
              <b>${e("rule.day_caution")}</b>${n(e, "r_day_caution")} ${O(e, F(r, "rules.day_caution"))}
            </div>
            <small>${e(`rule.day_caution.${i.day_caution}.hint`)}</small>
          </div>
          <div>
            <joe-choice
              compact
              label=${e("rule.day_caution")}
              .options=${za.map((t) => ({
		value: t,
		label: e(`rule.day_caution.${t}`)
	}))}
              .value=${[i.day_caution]}
              @joe-choice=${(e) => {
		e.detail.value[0] && L(t, { rules: { day_caution: e.detail.value[0] } });
	}}
            ></joe-choice>
          </div>
        </div>` : T}`;
}
function oo(e, t, r) {
	let i = r.rules.night_caution ?? "brave";
	return j`<div class="row stacked" data-tipped data-anchor="night_caution">
    <div>
      <div class="name">
        <b>${e("rule.night_caution")}</b>${n(e, "r_night_caution")} ${O(e, F(r, "rules.night_caution"))}
      </div>
      <small>${e(`rule.night_caution.${i}.hint`)}</small>
      ${so(e, t, r, i)}
    </div>
    <div>
      <joe-choice
        compact
        label=${e("rule.night_caution")}
        .options=${Ba.map((t) => ({
		value: t,
		label: e(`rule.night_caution.${t}`)
	}))}
        .value=${[i]}
        @joe-choice=${(e) => {
		e.detail.value[0] && L(t, { rules: { night_caution: e.detail.value[0] } });
	}}
      ></joe-choice>
    </div>
  </div>`;
}
function so(e, t, n, r) {
	let i = n.learned?.replay;
	if (!i) return T;
	if (i.best === r) return j`<small class="replay">${e("rule.night_caution.replay_same")}</small>`;
	let a = i.costs[r], o = i.costs[i.best];
	if (a == null || o == null) return T;
	let s = t.hass?.config?.currency;
	return j`<small class="replay">
    ${e("rule.night_caution.replay", {
		nights: i.nights,
		best: e(`rule.night_caution.${i.best}`),
		diff: de(e, a - o, s)
	})}
  </small>`;
}
var co = D`
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
  small.replay {
    display: block;
    margin-top: 4px;
    color: var(--joe-ink-2);
  }
  .row.stacked {
    display: grid;
    justify-content: stretch;
    align-items: stretch;
    gap: 10px;
  }
`;
//#endregion
//#region src/components/day-surplus.ts
function lo(e) {
	return e?.config.rules.day_surplus ? e.control?.surplus : void 0;
}
function uo(e, t) {
	let n = t.controls?.charge_limit ?? t.controls?.system_charge_limit;
	if (!n || t.adapter === "steps" || t.adapter === "none") return "no_limit";
	let r = e?.states[n];
	if (!r || r.state === "unavailable" || r.state === "unknown") return "ok";
	let i = r.attributes.unit_of_measurement;
	return i === "W" || i === "kW" ? "ok" : i === "%" ? t.limit_ref_w ? "ok" : "need_ref" : "unit";
}
function fo(e, t) {
	let n = t.controls?.charge_limit;
	return !!(n && t.adapter !== "none" && e?.states[n]?.attributes.unit_of_measurement === "%");
}
function po(e, t) {
	let n = (t.loadpoints ?? []).filter((e) => e.wants).map((e) => e.name);
	return n.length ? e("surplus.loadpoint.named", { names: n.join(", ") }) : e("surplus.loadpoint.any");
}
function mo(e, t) {
	return t.state === "cap" ? e(t.dry ? "surplus.line.cap_dry" : "surplus.line.cap", {
		kw: s(e.lang, t.cap_kw ?? 0, 1),
		time: v(t.pv_end),
		loadpoint: po(e, t)
	}) : e.optional(`surplus.state.${t.state}`) ?? t.state;
}
function ho(e, t) {
	return t.state === "cap" ? e("surplus.expected", {
		kwh: s(e.lang, t.expected_kwh ?? 0, 1),
		time: v(t.pv_end)
	}) : "";
}
function go(e, t) {
	return !t || t.state !== "cap" || t.dry ? null : e("surplus.doing", {
		kw: s(e.lang, t.cap_kw ?? 0, 1),
		loadpoint: po(e, t),
		time: v(t.pv_end)
	});
}
var _o = ["charge_delay", "predictive_charging"];
function vo(e, t, n = !1) {
	return (t?.conflicts ?? []).filter((e) => _o.includes(e.code) === n).map((t) => e.optional(`surplus.conflict.${t.code}`, {
		value: s(e.lang, t.value ?? 0, 0),
		loadpoint: t.loadpoint ?? "",
		battery: t.battery ?? ""
	}) ?? t.code);
}
function yo(e, t) {
	let n = vo(e, t), r = vo(e, t, !0);
	return !n.length && !r.length ? T : j`<div class="conflicts">
    ${n.length ? j`<div class="note warn" role="status">
        <ha-icon icon="mdi:alert-outline"></ha-icon>
        <span><b>${e("surplus.conflict.title")}</b> ${n.join(" ")} ${e("surplus.conflict.hint")}</span>
      </div>` : T}
  ${r.length ? j`<div class="note warn" role="status">
        <ha-icon icon="mdi:alert-outline"></ha-icon>
        <span><b>${e("surplus.device_conflict.title")}</b> ${r.join(" ")} ${e("surplus.device_conflict.hint")}</span>
      </div>` : T}
  </div>`;
}
//#endregion
//#region src/components/control-status.ts
function bo(e, t) {
	let n = t.plan, r = t.control?.reason ?? "off";
	return r === "waiting" && n?.window ? e("devices.status.waiting", { time: v(n.window.start) }) : r === "day" ? fe(e, n) : e(`devices.status.${r}`);
}
var xo = class extends P {
	constructor(...e) {
		super(...e), this.compact = !1, this.notice = "";
	}
	static {
		this.styles = [x, D`
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
		let e = this.t, t = this.state, r = t?.control;
		if (!e || !t || !r) return T;
		let i = lo(t)?.state === "cap" && !lo(t)?.dry, a = r.steering || r.pending || i;
		if (this.compact) return a || this.notice ? j`<section class="card status" ?data-tipped=${a}>${this.renderRelease(e, r.pending, a)}</section>` : T;
		let o = bo(e, t), s = ["on", "wait"].includes(r.house?.state ?? "") ? eo(e, t.config, r.house) : "", c = t.mode === "simulation" ? j`<span class="pill-sim">${e("mode.simulation")}</span>` : j`<span class="chip ${t.mode === "live" ? "ok" : t.mode === "advisory" ? "learned" : ""}"
            >${e(`mode.${t.mode}`)}</span
          >`;
		return j`<section class="card status" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:pulse"></ha-icon>${e("devices.now")}</div>
        ${c} ${n(e, "plan_steer")}
      </div>
      <p class="status-text">${o}</p>
      ${s ? j`<div class="note"><ha-icon icon="mdi:ev-station"></ha-icon><span>${s}</span>${n(e, "r_car_house_only")}</div>` : T}
      ${this.renderRelease(e, r.pending, a)}
    </section>`;
	}
	renderRelease(e, t, r) {
		return j`${t ? j`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("devices.pending")}</span></div>` : T}
      ${r ? j`<div class="actions">
            <button type="button" class="btn btn-danger" @click=${this.release}>
              <ha-icon icon="mdi:hand-back-left-outline"></ha-icon>${e("devices.release")}
            </button>
            ${n(e, "devices_release")}
          </div>` : T}
      ${this.notice ? j`<div class="note" role="status"><ha-icon icon="mdi:check"></ha-icon>${this.notice}</div>` : T}`;
	}
	async release() {
		try {
			await this.hass?.callWS({ type: "energy_joe/control/release" });
		} catch {
			this.notice = this.t("error.action");
		}
	}
};
b([A({ attribute: !1 })], xo.prototype, "hass", void 0), b([A({ attribute: !1 })], xo.prototype, "t", void 0), b([A({ attribute: !1 })], xo.prototype, "state", void 0), b([A({
	type: Boolean,
	reflect: !0
})], xo.prototype, "compact", void 0), b([C()], xo.prototype, "notice", void 0), _("joe-control-status", xo);
//#endregion
//#region src/pages/devices/all.ts
var So = {
	battery: "mdi:home-battery-outline",
	wallbox: "mdi:ev-station",
	car: "mdi:car-electric"
}, Co = class extends q {
	constructor(...e) {
		super(...e), this.busy = "";
	}
	static {
		this.styles = [
			x,
			K,
			D`
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
		if (!e || !t) return T;
		let r = this.devices, i = ht(r), a = r.filter((e) => e.unassigned);
		return j`<div class="wrap">
      <div class="intro">
        <div>
          ${N(e("devices.page.title"))} ${S}
          <div class="lead-row" data-tipped>
            <p class="lead">${e("devices.lead")}</p>
            ${n(e, "ha_open")}
          </div>
        </div>
        <joe-pose name="switch"></joe-pose>
      </div>
      <joe-control-status .t=${e} .hass=${this.hass} .state=${t}></joe-control-status>
      <div class="actions toolbar" data-tipped>${Da(e, this.prefix)} ${n(e, "devices_add")}</div>
      ${this.renderFound(e)}
      ${tt.filter((e) => i.includes(e)).map((t) => this.renderGroup(e, t, r))}
      ${a.length ? j`<div class="group-head">
              <span class="group-label">${e("devices.unassigned")}</span><i class="dcard-dot" aria-hidden="true"></i>
            </div>
            <p class="unassigned-text">${e("devices.unassigned.text")}</p>
            <div class="dcards">
              ${a.map((n) => yi(e, this.prefix, Ci(e, this.hass, t, n)))}
            </div>` : T}
    </div>`;
	}
	renderGroup(e, t, n) {
		let r = n.filter((e) => e.group === t && !e.unassigned);
		if (!r.length) return T;
		let i = {
			tab: "devices",
			section: t
		};
		return j`<div class="group-head">
        <ha-icon icon=${nt[t]}></ha-icon>
        <span class="group-label">${e(`nav.devices.${t}`)}</span>
        ${_t(n.filter((e) => !e.unassigned), t) ? j`<i class="dcard-dot" aria-hidden="true"></i>` : T}
        <a class="mini-btn quiet group-go" href=${k(this.prefix, i)} @click=${E(i)}>${e("devices.group.go")}</a>
      </div>
      <div class="dcards">
        ${r.map((t) => yi(e, this.prefix, Ci(e, this.hass, this.state, t)))}
      </div>`;
	}
	renderFound(e) {
		let t = yt(this.state.config, this.discovery);
		return t.length ? j`<section class="card found" data-tipped>
      <div class="found-head">
        <div class="eyebrow"><ha-icon icon="mdi:new-box"></ha-icon>${e("devices.found")}</div>
        ${n(e, "devices_found")}
      </div>
      <p class="found-lead">${e("devices.found.lead")}</p>
      <ul>
        ${t.map((t) => j`<li>
            <span class="what">
              <ha-icon icon=${So[t.kind]}></ha-icon>
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
    </section>` : T;
	}
	async use(e) {
		if (e.kind !== "battery" || !e.battery) {
			w(this, st(e.kind === "wallbox" ? "wallbox" : "car", e.key), { sheet: !0 });
			return;
		}
		this.busy = e.key;
		let t = await mi(this, this.state.config, e.battery);
		this.busy = "", t && w(this, {
			tab: "devices",
			section: "battery",
			id: t
		});
	}
	async ignore(e) {
		this.busy = e.key, await gi(this, this.state.config, e.key), this.busy = "";
	}
};
b([C()], Co.prototype, "busy", void 0), _("joe-devices-all", Co);
//#endregion
//#region src/components/battery-automations.ts
async function wo(e) {
	try {
		return await e?.callWS({ type: "energy_joe/automations" }) ?? [];
	} catch {
		return [];
	}
}
function To(e, t) {
	return e.filter((e) => e.writes.some((e) => e.battery_id === t));
}
var Eo = "/config/automation/dashboard", Do = class extends P {
	constructor(...e) {
		super(...e), this.batteries = "", this.mode = "", this.ready = {}, this.batteryId = "", this.bare = !1, this.items = null, this.loaded = [];
	}
	static {
		this.styles = [x, D`
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
		this.loaded = await wo(this.hass);
	}
	get shown() {
		let e = this.items ?? this.loaded;
		return this.batteryId ? To(e, this.batteryId) : e;
	}
	on(e) {
		let t = this.hass?.states[e.entity_id];
		return t ? t.state === "on" : e.on;
	}
	openHa(e) {
		e.preventDefault(), history.pushState(null, "", Eo), window.dispatchEvent(new CustomEvent("location-changed"));
	}
	render() {
		let e = this.t, t = this.shown;
		if (!e || !t.length) return T;
		let r = t.filter((e) => this.on(e)), i = (this.mode === "advisory" || this.mode === "live") && r.some((e) => e.writes.some((e) => (!this.batteryId || e.battery_id === this.batteryId) && this.ready[e.battery_id] === "ready")), a = j`<p class="now">
        ${e(r.length ? i ? "automations.lead" : "automations.lead_idle" : "automations.lead_off")}
      </p>
      <ul>
        ${t.map((t) => {
			let n = this.on(t), r = [...new Set(t.writes.map((e) => e.battery))].join(", ");
			return j`<li>
            <div class="row">
              <b>${t.name}</b>
              ${t.writes.some((e) => e.joe) ? j`<span class="chip">${e("automations.levers")}</span>` : T}
              <span class="chip ${n ? "warn" : "ok"}">${e(n ? "automations.on" : "automations.off")}</span>
            </div>
            ${t.writes.length ? j`<small>${e("automations.writes", {
				what: t.writes.map((e) => e.name).join(", "),
				batteries: r
			})}</small>` : j`<small>${e("automations.not_battery")}</small>`}
          </li>`;
		})}
      </ul>
      <div class="actions">
        <a class="mini-btn ${r.length && i ? "go" : ""}" href=${Eo} @click=${(e) => this.openHa(e)}>
          <ha-icon icon="mdi:open-in-app"></ha-icon>${e("automations.open_ha")}
        </a>
      </div>`;
		return this.bare ? a : j`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:robot-outline"></ha-icon>${e("automations.title")}</div>
        ${n(e, "battery_automations")}
      </div>
      ${a}
    </section>`;
	}
};
b([A({ attribute: !1 })], Do.prototype, "hass", void 0), b([A({ attribute: !1 })], Do.prototype, "t", void 0), b([A()], Do.prototype, "batteries", void 0), b([A()], Do.prototype, "mode", void 0), b([A({ attribute: !1 })], Do.prototype, "ready", void 0), b([A()], Do.prototype, "batteryId", void 0), b([A({ type: Boolean })], Do.prototype, "bare", void 0), b([A({ attribute: !1 })], Do.prototype, "items", void 0), b([C()], Do.prototype, "loaded", void 0), _("joe-battery-automations", Do);
//#endregion
//#region src/components/mirror.ts
function J(e, t, n) {
	return j`<div class="mirror">
    <div class="mirror-text">
      <span class="mirror-label">${n.label}</span>
      <span class="mirror-sep" aria-hidden="true">·</span>
      <span class="mirror-value">${n.value}</span>
      ${n.source ? O(e, n.source) : T}
      ${n.hint ? j`<small class="mirror-hint">${n.hint}</small>` : T}
    </div>
    <a class="mini-btn go mirror-go" href=${k(t, n.to)} @click=${E(n.to)}
      >${e(n.action === "set" ? "mirror.set" : "mirror.change")}</a
    >
  </div>`;
}
//#endregion
//#region src/components/day-questions.ts
var Oo = {
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
}, ko = class extends P {
	constructor(...e) {
		super(...e), this.questions = [], this.bare = !1, this.failed = !1, this.answered = /* @__PURE__ */ new Set();
	}
	static {
		this.styles = [x, D`
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
		return !e || !t.length ? T : j`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:chat-question-outline"></ha-icon>${e("ask.title")}</div>
        ${n(e, "ask_day")}
      </div>
      <p class="lead">${e("ask.lead")}</p>
      ${t.map((t) => j`<div class="question">
          <p>
            ${e(`ask.${t.kind}`, {
			day: W(e.lang, t.date, "weekday"),
			actual: U(e.lang, t.actual, 1),
			expected: U(e.lang, t.expected, 1)
		})}
          </p>
          <div class="answers" role="group" aria-label=${e("ask.answers")}>
            ${Oo[t.kind].map((n) => j`<button
                  type="button"
                  class="mini-btn ${n === "normal" ? "quiet" : ""}"
                  ?disabled=${this.busy === t.date}
                  @click=${() => this.answer(t.date, n)}
                >
                  ${e(`ask.answer.${n}`)}
                </button>`)}
          </div>
        </div>`)}
      ${this.failed ? j`<div class="note warn" role="status"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("error.action")}</div>` : T}
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
b([A({ attribute: !1 })], ko.prototype, "hass", void 0), b([A({ attribute: !1 })], ko.prototype, "t", void 0), b([A({ attribute: !1 })], ko.prototype, "questions", void 0), b([A({
	type: Boolean,
	reflect: !0
})], ko.prototype, "bare", void 0), b([C()], ko.prototype, "busy", void 0), b([C()], ko.prototype, "failed", void 0), b([C()], ko.prototype, "answered", void 0), _("joe-day-questions", ko);
//#endregion
//#region src/components/steer-tonight.ts
function Ao(e) {
	let t = e?.plan;
	return !!(e?.control && ["advisory", "live"].includes(e.mode) && t?.window && t.kind !== "none" && t.kind !== "unavailable");
}
function jo(e) {
	let t = e?.plan?.window?.start, n = e?.control;
	return !!(Ao(e) && e?.mode === "advisory" && t && n?.skip !== t && n?.answer?.night !== t);
}
function Mo(e) {
	let t = e.control?.ready ?? {};
	return e.config.batteries.filter((e) => e.adapter !== "none" && t[e.id] && t[e.id] !== "ready");
}
var No = class extends P {
	constructor(...e) {
		super(...e), this.prefix = M, this.compact = !1, this.hideUntested = !1, this.busy = !1;
	}
	static {
		this.styles = [x, D`
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
		let e = this.t, t = this.state, r = t?.control, i = t?.plan;
		if (!e || !t || !r || !i?.window || !Ao(t)) return T;
		let a = i.window.start, o = r.skip === a, s = r.answer?.night === a ? r.answer.yes : null, c, l = T;
		if (t.mode === "advisory" && !o) {
			c = e(s === !0 ? "plan.steer.answered_yes" : s === !1 ? "plan.steer.answered_no" : "plan.steer.advisory");
			let t = s === !0 ? T : j`<button type="button" class="btn btn-primary" ?disabled=${this.busy} @click=${() => this.answer(a, !0)}>
              ${e("plan.steer.yes")}
            </button>`, n = s !== !1 && !this.compact ? j`<button type="button" class="btn btn-secondary" ?disabled=${this.busy} @click=${() => this.answer(a, !1)}>
              ${e("plan.steer.no")}
            </button>` : T;
			l = t === T && n === T ? T : j`${t} ${n}`;
		} else c = e(o ? "plan.steer.skipped" : "plan.steer.live"), l = j`<button type="button" class="btn btn-secondary" ?disabled=${this.busy} @click=${() => this.skip(!o)}>
        ${e(o ? "plan.steer.unskip" : "plan.steer.skip")}
      </button>`;
		return j`<section class="steer" data-tipped>
      <div class="head">${c} ${n(e, "plan_steer")}</div>
      ${this.hideUntested ? T : this.renderUntested(e, t)}
      ${l === T ? T : j`<div class="actions">${l}</div>`}
    </section>`;
	}
	renderUntested(e, t) {
		let n = Mo(t);
		if (!n.length) return T;
		let [r, i = ""] = e("plan.steer.untested", { names: "\0" }).split("\0"), a = n.map((e, t) => j`${t ? ", " : ""}${ke(this.prefix, {
			tab: "devices",
			section: "battery",
			id: e.id
		}, e.name)}`);
		return j`<div class="note warn">
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
b([A({ attribute: !1 })], No.prototype, "hass", void 0), b([A({ attribute: !1 })], No.prototype, "t", void 0), b([A({ attribute: !1 })], No.prototype, "state", void 0), b([A({ attribute: !1 })], No.prototype, "prefix", void 0), b([A({
	type: Boolean,
	reflect: !0
})], No.prototype, "compact", void 0), b([A({ type: Boolean })], No.prototype, "hideUntested", void 0), b([C()], No.prototype, "busy", void 0), _("joe-steer-tonight", No);
//#endregion
//#region src/components/action-page.ts
function Po(e, t, r, i, a, o, s) {
	let c = st(r, i);
	return j`<div class="setup-block" data-tipped>
    <p>${a} ${n(e, s)}</p>
    <a class="btn btn-primary" href=${k(t, c)} @click=${E(c, { sheet: !0 })}>${o}</a>
  </div>`;
}
function Fo(e, t, n) {
	let r = t.startsWith("action-") ? t.slice(7) : t;
	return e.find((e) => e.group !== n && (e.consumer?.id === t || e.id === t || e.action?.id === r));
}
function Io(e, t, n, r) {
	let i = r.setup ? {
		tab: "devices",
		section: r.group,
		id: r.id
	} : z(r);
	return j`<div class="moved" role="status">
    <ha-icon icon="mdi:arrow-right-bold-circle-outline"></ha-icon>
    <span class="moved-text"><b>${n}</b></span>
    <a class="mini-btn go moved-go" href=${k(t, i)} @click=${E(i)}
      >${e("devices.moved_to", { group: e(`nav.devices.${r.group}`) })}</a
    >
  </div>`;
}
function Lo(e, t) {
	return j`<h4 class="sub-head" data-anchor=${t ?? T}>${e}</h4>`;
}
var Ro = D`
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
`, zo = [
	"soc",
	"range",
	"odometer",
	"capacity",
	"consumption",
	"plugged",
	"outside_temp",
	"location"
];
function Bo(e, t, n) {
	return e("car.merge.ask", {
		a: n.a_name,
		b: n.b_name,
		from: Pe(e, {
			kind: "car",
			platform: n.b_platform,
			name: n.b_name
		})
	});
}
function Vo(e) {
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
var Ho = class extends P {
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
		this.styles = [x, D`
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
		let { t: e, state: t, car: r } = this;
		if (!e || !t || !r) return T;
		let i = (t.config.cars ?? []).filter((e) => e.id !== r.id), a = (t.cars?.merge ?? []).filter((e) => e.a === r.id || e.b === r.id);
		return j`${r.sources.length ? j`<ul class="sources">
            ${r.sources.map((t) => this.renderSource(e, r, t))}
          </ul>` : j`<p class="muted">${e("car.sources.none")}</p>`}
      ${a.map((r) => j`<div class="ask" role="group" data-tipped>
          <p>${Bo(e, t, r)} ${n(e, "car_merge")}</p>
          <div class="row">
            <button type="button" class="mini-btn go" ?disabled=${this.busy} @click=${() => this.send(Vo(r).yes, r.a)}>
              ${e("car.merge.yes")}
            </button>
            <button type="button" class="mini-btn quiet" ?disabled=${this.busy} @click=${() => this.send(Vo(r).no)}>
              ${e("car.merge.no")}
            </button>
          </div>
        </div>`)}
      ${i.length ? j`<div class="merge" data-tipped>
            <select class="input" aria-label=${e("car.merge.with")} @change=${(e) => this.other = e.target.value}>
              <option value="" ?selected=${!this.other}>${e("car.merge.with")}</option>
              ${i.map((e) => j`<option value=${e.id} ?selected=${this.other === e.id}>${e.name}</option>`)}
            </select>
            <button
              type="button"
              class="mini-btn"
              ?disabled=${this.busy || !this.other}
              @click=${() => this.send({
			type: "energy_joe/car/merge",
			into: r.id,
			other: this.other
		}, r.id)}
            >
              <ha-icon icon="mdi:call-merge"></ha-icon>${e("car.merge.do")}
            </button>
            ${n(e, "car_merge_with")}
          </div>` : T}
      ${this.adding ? j`<div class="add-box" @joe-attached=${() => this.adding = !1}>
            <joe-car-search .hass=${this.hass} .t=${e} .state=${t} .discovery=${this.discovery} .prefix=${this.prefix} .car=${r}></joe-car-search>
            <div class="close-row">
              <button type="button" class="mini-btn quiet" @click=${() => this.adding = !1}>${e("car.attach.close")}</button>
            </div>
          </div>` : j`<div class="add by-hand" data-tipped>
            <button type="button" class="mini-btn" aria-expanded="false" @click=${() => this.adding = !0}>
              <ha-icon icon="mdi:plus"></ha-icon>${e("car.attach.open")}
            </button>
            ${n(e, "car_attach_open")}
          </div>`}
      ${this.failed ? j`<p class="bad" role="status">${e("error.action")}</p>` : T}
      ${Lo(e("car.sources.manual"))}
      ${r.sources.length && !this.manual && !this.chosenByHand(r) ? j`<div class="by-hand" data-tipped>
            <button type="button" class="mini-btn quiet" aria-expanded="false" @click=${() => this.manual = !0}>
              <ha-icon icon="mdi:chevron-down"></ha-icon>${e("car.sources.manual.open")}
            </button>
            ${n(e, "car_manual")}
          </div>` : j`<p class="muted">${e("car.sources.manual.hint")}</p>
            <joe-car-steer
              .hass=${this.hass}
              .t=${e}
              .state=${t}
              .discovery=${this.discovery}
              .prefix=${this.prefix}
              .car=${r}
              .section=${"manual"}
            ></joe-car-steer>`}`;
	}
	renderSource(e, t, r) {
		let i = zo.filter((e) => r.entities[e]).map((t) => e(`car.role.${t}`)), a = Pe(e, {
			kind: r.kind,
			platform: r.platform,
			name: r.name
		});
		return j`<li>
      <ha-icon icon=${r.kind === "evcc" ? "mdi:ev-station" : "mdi:car-connected"}></ha-icon>
      <span class="what">
        <b>${r.name ?? a}</b>
        <small>${e("car.source.from", { from: a })}${r.vehicle ? ` · ${e("car.source.vehicle", { id: r.vehicle })}` : ""}</small>
        <small>${i.length ? e("car.source.gives", { roles: i.join(", ") }) : e(r.kind === "evcc" ? "car.source.evcc_only" : "car.source.nothing")}</small>
      </span>
      ${t.sources.length > 1 ? j`<span class="row" data-tipped>
            <button
              type="button"
              class="mini-btn quiet"
              ?disabled=${this.busy}
              @click=${() => this.send({
			type: "energy_joe/car/split",
			car: t.id,
			source: r.id
		})}
            >
              <ha-icon icon="mdi:call-split"></ha-icon>${e("car.source.split")}
            </button>
            ${n(e, "car_split")}
          </span>` : T}
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
b([A({ attribute: !1 })], Ho.prototype, "hass", void 0), b([A({ attribute: !1 })], Ho.prototype, "t", void 0), b([A({ attribute: !1 })], Ho.prototype, "state", void 0), b([A({ attribute: !1 })], Ho.prototype, "discovery", void 0), b([A({ attribute: !1 })], Ho.prototype, "prefix", void 0), b([A({ attribute: !1 })], Ho.prototype, "car", void 0), b([C()], Ho.prototype, "busy", void 0), b([C()], Ho.prototype, "failed", void 0), b([C()], Ho.prototype, "other", void 0), b([C()], Ho.prototype, "adding", void 0), b([C()], Ho.prototype, "manual", void 0);
var Uo = class extends P {
	constructor(...e) {
		super(...e), this.asking = !1, this.busy = !1;
	}
	static {
		this.styles = [x, D`
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
		return !e || !t ? T : this.asking ? j`<div data-tipped>
      <p class="ask" role="alert">${e("car.delete.ask", { name: t.name })}</p>
      <div class="row">
        <button type="button" class="btn btn-danger" ?disabled=${this.busy} @click=${this.removeCar}>${e("action.delete.yes")}</button>
        <button type="button" class="btn btn-ghost" ?disabled=${this.busy} @click=${() => this.asking = !1}>${e("action.delete.no")}</button>
        ${n(e, "car_delete")}
      </div>
    </div>` : j`<div class="row" data-tipped>
        <button type="button" class="btn btn-danger" @click=${() => this.asking = !0}>${e("car.delete")}</button>
        ${n(e, "car_delete")}
      </div>`;
	}
	async removeCar() {
		let e = this.car;
		if (!e) return;
		this.busy = !0;
		let n = [...this.config?.answers.ignored ?? []];
		for (let r of e.sources) {
			let e = t(r);
			n.includes(e) || n.push(e);
		}
		let r = await L(this, {
			cars: { [e.id]: null },
			answers: { ignored: n }
		});
		this.busy = !1, r && this.leave && w(this, this.leave, { replace: !0 });
	}
};
b([A({ attribute: !1 })], Uo.prototype, "t", void 0), b([A({ attribute: !1 })], Uo.prototype, "config", void 0), b([A({ attribute: !1 })], Uo.prototype, "car", void 0), b([A({ attribute: !1 })], Uo.prototype, "leave", void 0), b([C()], Uo.prototype, "asking", void 0), b([C()], Uo.prototype, "busy", void 0), _("joe-car-sources", Ho), _("joe-car-delete", Uo);
//#endregion
//#region src/components/sparring.ts
var Wo = {
	tab: "review",
	section: "learned",
	id: "sparring"
}, Go = {
	tab: "settings",
	section: "operation",
	id: "sparring"
};
async function Ko(e) {
	if (e) try {
		return await e.callWS({ type: "energy_joe/sparring" });
	} catch {
		return;
	}
}
function qo(e) {
	return e.findings.length + e.texts.length + e.proposals.length + e.questions.length;
}
function Jo(e) {
	let t = e?.reports[0];
	return t && t.ok && !t.seen && qo(t) > 0 ? t : void 0;
}
function Yo(e, t) {
	let [n, r] = e("sparring.points").split("|");
	return `${s(e.lang, t, 0)} ${t === 1 ? n : r}`;
}
function Xo(e, t) {
	return e("sparring.when", {
		day: W(e.lang, t.slice(0, 10)),
		time: t.slice(11, 16)
	});
}
var Zo = 12;
function Qo(e) {
	return e === null || [
		"string",
		"number",
		"boolean"
	].includes(typeof e);
}
function $o(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function es(e) {
	return $o(e) && Object.values(e).every(Qo);
}
function ts(e, t) {
	return e.optional(`sparring.brief.${t}`) || (/^[a-z0-9_]+$/.test(t) ? t.replace(/_/g, " ").replace(/^./, (e) => e.toUpperCase()) : t);
}
function ns(e, t) {
	return t === null || t === "" ? "–" : typeof t == "boolean" ? e(t ? "sparring.yes" : "sparring.no") : typeof t == "number" ? new Intl.NumberFormat(e.lang, { maximumFractionDigits: 2 }).format(t) : t;
}
function rs(e) {
	return Array.isArray(e) ? e.length : $o(e) ? Object.keys(e).length : 0;
}
function is(e, t) {
	return Qo(t) ? j`<span class="brief-v">${ns(e, t)}</span>` : Array.isArray(t) ? t.length ? t.every(Qo) ? j`<span class="brief-v">${t.map((t) => ns(e, t)).join(", ")}</span>` : t.every(es) ? as(e, t) : j`<ol class="brief-list">
      ${t.map((t) => j`<li>${is(e, t)}</li>`)}
    </ol>` : j`<span class="brief-v">–</span>` : $o(t) ? os(e, t) : j`<span class="brief-v">–</span>`;
}
function as(e, t) {
	let n = [...new Set(t.flatMap((e) => Object.keys(e)))];
	return j`<div class="brief-table">
    <table>
      <thead>
        <tr>
          ${n.map((t) => j`<th scope="col">${ts(e, t)}</th>`)}
        </tr>
      </thead>
      <tbody>
        ${t.map((t) => j`<tr>
            ${n.map((n) => j`<td>${ns(e, t[n] ?? null)}</td>`)}
          </tr>`)}
      </tbody>
    </table>
  </div>`;
}
function os(e, t) {
	return j`<dl class="brief-fields">
    ${Object.entries(t).map(([t, n]) => {
		let r = ts(e, t);
		return rs(n) > Zo ? j`<div class="brief-wide">
          <details class="brief-more" data-notip>
            <summary>${e("sparring.brief.more", {
			label: r,
			count: rs(n)
		})}</summary>
            ${is(e, n)}
          </details>
        </div>` : Qo(n) || Array.isArray(n) && n.every(Qo) ? j`<dt>${r}</dt>
          <dd>${is(e, n)}</dd>` : j`<div class="brief-wide">
        <dt>${r}</dt>
        <dd>${is(e, n)}</dd>
      </div>`;
	})}
  </dl>`;
}
function ss(e, t) {
	return j`<div class="brief">
    ${Object.entries(t).map(([t, n]) => j`<section class="brief-part">
        <h4>${ts(e, t)}</h4>
        ${rs(n) > Zo ? j`<details class="brief-more" data-notip>
              <summary>${e("sparring.brief.more", {
		label: ts(e, t),
		count: rs(n)
	})}</summary>
              ${is(e, n)}
            </details>` : is(e, n)}
      </section>`)}
    <details class="brief-more" data-notip>
      <summary>${e("sparring.brief.json")}</summary>
      <pre>${JSON.stringify(t, null, 2)}</pre>
    </details>
  </div>`;
}
function cs(e, t) {
	if (!t.ok) return j`<span class="chip warn">${e("sparring.chip.failed")}</span>`;
	let n = qo(t);
	return n ? j`<span class="chip ${t.seen ? "" : "warn"}">${Yo(e, n)}</span>` : j`<span class="chip ok">${e("sparring.chip.clean")}</span>`;
}
var ls = D`
  .brief {
    display: grid;
    gap: 14px;
    min-width: 0;
    font-size: 14px;
  }
  /* Wide tables and the JSON scroll inside, the page never sideways. */
  .brief > *,
  .brief-wide,
  details.brief-more {
    min-width: 0;
    max-width: 100%;
  }
  .brief h4 {
    margin: 0 0 4px;
    font-size: 14px;
  }
  .brief-fields {
    display: grid;
    grid-template-columns: minmax(0, 16em) minmax(0, 1fr);
    gap: 4px 14px;
    margin: 0;
  }
  .brief-fields dt {
    color: var(--joe-ink-2);
    overflow-wrap: anywhere;
  }
  .brief-fields dd {
    margin: 0;
    min-width: 0;
    font-variant-numeric: tabular-nums;
    overflow-wrap: anywhere;
  }
  .brief-wide {
    grid-column: 1 / -1;
  }
  .brief-wide > dd {
    margin: 2px 0 6px 12px;
  }
  .brief-list {
    margin: 0;
    padding-left: 20px;
  }
  .brief-list li + li {
    margin-top: 6px;
  }
  .brief-table {
    overflow-x: auto;
  }
  .brief-table table {
    border-collapse: collapse;
    font-variant-numeric: tabular-nums;
  }
  .brief-table th,
  .brief-table td {
    padding: 4px 10px 4px 0;
    text-align: left;
    white-space: nowrap;
    border-top: 1px solid var(--joe-line);
  }
  .brief-table th {
    border-top: 0;
    font-size: 12px;
    font-weight: 600;
    color: var(--joe-muted);
  }
  details.brief-more summary {
    min-height: 32px;
    display: flex;
    align-items: center;
    cursor: pointer;
    font-weight: 600;
    width: fit-content;
  }
  details.brief-more pre {
    margin: 4px 0 0;
    padding: 10px 12px;
    border-radius: 10px;
    background: var(--joe-surface);
    box-shadow: inset 0 0 0 1px var(--joe-line);
    font-size: 12px;
    overflow: auto;
    max-height: 420px;
  }
  @media (max-width: 600px) {
    .brief-fields {
      grid-template-columns: 1fr;
      gap: 0;
    }
    .brief-fields dd {
      margin-bottom: 6px;
    }
  }
  @media (pointer: coarse) {
    details.brief-more summary {
      min-height: 44px;
    }
  }
`;
//#endregion
//#region src/homes.ts
function us(e, t) {
	let n = e(`tab.${t.tab}`), r = t.section ? e.optional(`nav.${t.tab}.${t.section}`) : void 0;
	return r ? `${n} › ${r}` : n;
}
function ds(e, t) {
	return {
		to: t,
		place: us(e, t)
	};
}
function fs(e, t) {
	if (t.startsWith("capacity:")) return ds(e, {
		tab: "devices",
		section: "battery",
		id: t.slice(9)
	});
	switch (t) {
		case "tariff":
		case "feed_in": return ds(e, {
			tab: "devices",
			section: "grid",
			id: "tariff"
		});
		case "heating": return ds(e, {
			tab: "devices",
			section: "other"
		});
		case "climate": return ds(e, {
			tab: "devices",
			section: "climate"
		});
		case "hot_water": return ds(e, {
			tab: "devices",
			section: "hot_water"
		});
		case "ev": return ds(e, {
			tab: "devices",
			section: "car"
		});
		case "home_office": return ds(e, {
			tab: "household",
			section: "days"
		});
		default: return ds(e, {
			tab: "household",
			section: "people"
		});
	}
}
var ps = {
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
function ms(e, t) {
	return ds(e, ps[t]);
}
function hs(e) {
	let t = e.answers.later;
	return Array.isArray(t) ? t.filter((e) => typeof e == "string") : [];
}
function gs(e, t) {
	let n = (t) => e.answers[t] !== void 0 && e.answers[t] !== null, r = (t) => F(e, t)?.source === "user";
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
		case "hot_water": return !e.actions.some((t) => at(t, _s(e, t)) === "hot_water") && !n(t);
		case "ev": return !e.actions.some((t) => at(t, _s(e, t)) === "car") && !n(t);
		case "home_office": return !r("calendar.default_workday") && !n(t);
		default: return !n(t);
	}
}
function _s(e, t) {
	return t.consumer_id ? e.consumers.find((e) => e.id === t.consumer_id) : void 0;
}
//#endregion
//#region src/pages/overview/inbox.ts
function vs(e, t, n) {
	let r = (e) => e ? n ? c(n, e) : e : "–", i = (t) => e.optional(`role.${t}`) ?? t;
	return [...t.missing.map((t) => e("roles.todo.missing", { role: i(t) })), ...t.wrong.map((t) => e("roles.todo.wrong", {
		role: i(t.role),
		is: r(t.is),
		found: r(t.found)
	}))].join(", ");
}
function ys(e, t) {
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
function bs(e, t) {
	let n = e.measurements.solar_power ?? [];
	return n.some((e) => e.entity_id === t && !e.sleeps) ? { measurements: { solar_power: n.map((e) => e.entity_id === t ? {
		...e,
		sleeps: !0
	} : e) } } : null;
}
function xs(e) {
	return `todo:${e}`;
}
function Ss(e) {
	return e.level === "warn" || e.code === "tariff_unknown" || e.code === "missing" && e.role === "grid_power";
}
function Cs(e) {
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
function ws(e, t, n = {}) {
	let r = t.config, a = t.control, o = n.devices ?? [], s = (t, n, r) => gt(o, t, n)?.name ?? r ?? (t === "grid" ? e("devices.grid.connection") : n), c = (e) => !I(r, xs(e)), u = [], d = (e) => {
		c(e.id) && u.push({
			...e,
			hide: [e.id]
		});
	}, f = (e) => {
		u.push({
			...e,
			icon: "mdi:alert-outline",
			warn: !0,
			hide: []
		});
	}, p = (e, t, n) => {
		let r = e.filter((e) => c(e.id));
		if (r.length === 1) u.push({
			...r[0].one,
			id: r[0].id,
			hide: [r[0].id]
		});
		else if (r.length > 1) {
			let e = r.map((e) => e.name).join(", ");
			u.push({
				...t(e),
				id: `${n}:${r.map((e) => e.id).join(",")}`,
				hide: r.map((e) => e.id)
			});
		}
	}, h = t.config_backup;
	h && u.push({
		id: "config_backup",
		hide: [],
		icon: "mdi:backup-restore",
		warn: !0,
		title: e("overview.todo.config_backup"),
		text: h.error ? `${e("overview.todo.config_backup.text")} ${e("overview.todo.config_backup.failed", { error: h.error })}` : e("overview.todo.config_backup.text"),
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
	for (let n of r.actions.filter((e) => e.point)) t.cars?.points?.[n.id]?.ask && u.push({
		id: `which_car:${n.id}`,
		hide: [],
		icon: "mdi:car-question",
		title: e("point.ask", { point: n.name }),
		text: e("point.ask.text"),
		to: l(n.id),
		choices: [...i(r, n).map((e) => ({
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
		let r = Vo(n);
		d({
			id: `car_merge:${n.a}|${n.b}`,
			icon: "mdi:call-merge",
			title: Bo(e, t, n),
			text: e("car.merge.text"),
			to: m(n.a, "sources"),
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
	for (let n of t.cars?.reminders ?? []) d({
		id: `unplugged:${n.car}:${t.plan?.window?.start ?? ""}`,
		icon: "mdi:power-plug-off-outline",
		title: e("car.reminder", {
			car: n.name,
			km: n.km
		}),
		text: e("car.reminder.text"),
		to: m(n.car)
	});
	for (let t of (n.checks ?? []).filter(Ss)) {
		let n = Cs(t), i = String(t.battery_id ?? t.role ?? t.entity_id ?? ""), a = t.can_sleep ? bs(r, String(t.entity_id)) : null;
		f({
			id: `check:${t.code}:${i}`,
			title: s(n.group, n.group === "grid" && n.id === "tariff" ? "connection" : n.id, t.battery),
			text: Ye(e, t),
			to: z(n),
			fix: a ? {
				label: e("solar.sleeps.quick"),
				tip: "solar_sleeps",
				patch: a
			} : void 0
		});
	}
	let g = (t) => e.optional(`devices.problem.${t}`) ?? t;
	for (let r of t.battery_roles ?? []) {
		let t = n.profiles?.[r.profile] ?? r.profile;
		u.push({
			id: `roles:${r.battery_id}`,
			hide: [],
			icon: "mdi:swap-horizontal-variant",
			warn: !0,
			title: e("roles.todo.title", {
				name: r.name,
				profile: t
			}),
			text: e("roles.todo.text", { details: vs(e, r, n.hass) }),
			to: {
				tab: "devices",
				section: "battery",
				id: r.battery_id,
				sub: "control"
			},
			choices: ys(e, r.battery_id),
			choicesTip: "battery_roles"
		});
	}
	for (let [t, i] of Object.entries(a?.stuck ?? {})) {
		let a = r.batteries.find((e) => e.id === t);
		a && u.push({
			id: `stuck:${t}:${i.reason}`,
			hide: [],
			icon: "mdi:battery-lock",
			warn: !0,
			title: Ei(e, a.name, i),
			text: Di(e, n.hass, i),
			when: ki(e, i.since),
			to: z({
				group: "battery",
				id: t
			}),
			ha: {
				target: {
					entityId: i.entity_id,
					name: i.name
				},
				tip: "stuck"
			}
		});
	}
	for (let e of r.batteries.filter((e) => e.adapter !== "none")) {
		let t = a?.batteries[e.id]?.problem ?? (a?.ready[e.id] === "controls_missing" ? "controls_missing" : null);
		t && f({
			id: `problem:battery:${e.id}:${t}`,
			title: e.name,
			text: g(t),
			to: z({
				group: "battery",
				id: e.id
			})
		});
	}
	for (let t of r.batteries) {
		let i = r.learned?.battery_models?.[t.id]?.measured_kwh, a = qn(r, n.hass, t);
		if (i == null || !a || !Jn(a.value, i)) continue;
		let o = {
			name: t.name,
			measured: U(e.lang, i, 1),
			basis: U(e.lang, a.value, 1)
		};
		u.push({
			id: `capacity:${t.id}`,
			hide: [],
			icon: "mdi:battery-alert-variant-outline",
			title: e(a.own ? "overview.todo.capacity.user" : "overview.todo.capacity.device", o),
			text: e("overview.todo.capacity.text", o),
			to: z({
				group: "battery",
				id: t.id
			})
		});
	}
	let _ = lo(t), ee = vo(e, _);
	ee.length && f({
		id: `surplus:evcc:${(_?.conflicts ?? []).map((e) => e.code).join(",")}`,
		title: e("surplus.conflict.title"),
		text: ee.join(" "),
		to: {
			tab: "devices",
			section: "battery"
		}
	});
	let te = vo(e, _, !0);
	te.length && f({
		id: `surplus:device:${(_?.conflicts ?? []).map((e) => e.code).join(",")}`,
		title: e("surplus.device_conflict.title"),
		text: te.join(" "),
		to: {
			tab: "devices",
			section: "battery"
		}
	});
	let v = a?.automations ?? [];
	v.length && (t.mode === "advisory" || t.mode === "live") && f({
		id: `automations:${v.join("|")}`,
		title: e("overview.todo.automations.title"),
		text: e("overview.todo.automations", { names: Yi(v) }),
		to: {
			tab: "devices",
			section: "battery",
			id: "automations"
		}
	});
	let ne = ji(t), y = {
		tab: "devices",
		section: "battery",
		id: "together"
	}, re = Zi(t), b = na(e, re, r);
	b && re?.last && f({
		id: `guard:alarm:${re.last.since ?? re.last.at}`,
		title: e("guard.alarm.title"),
		text: b,
		to: y
	});
	let ie = ra(e, re, r);
	ie && re?.last && f({
		id: `guard:inside:${re.last.since ?? re.last.at}`,
		title: e("guard.inside.title"),
		text: ie,
		to: y
	});
	let x = re?.last;
	if (ne?.state === "together" && x && !x.dry && [
		"running",
		"fixed",
		"hold",
		"alarm"
	].includes(x.result) && Date.now() - Date.parse(x.at) < 864e5) {
		let t = `team:together:${x.at.slice(0, 10)}`;
		u.push({
			id: t,
			hide: [t],
			icon: "mdi:battery-sync-outline",
			warn: !0,
			title: e("overview.todo.together.title"),
			text: e("overview.todo.together.text", {
				discharging: x.discharging.map((e) => r.batteries.find((t) => t.id === e)?.name ?? e).join(", "),
				charging: x.charging.map((e) => r.batteries.find((t) => t.id === e)?.name ?? e).join(", "),
				time: x.at.slice(11, 16)
			}),
			to: y,
			fix: {
				label: e("overview.todo.together.fix"),
				tip: "team_sequence_on",
				patch: { rules: { battery_team: "sequence" } }
			}
		});
	}
	ne?.group_question && d({
		id: "team:groups",
		icon: "mdi:help-circle-outline",
		title: e("team.groups.question"),
		text: e("team.groups.question.text", { names: aa(r, ne) }),
		to: y,
		fix: {
			label: e("team.groups.confirm"),
			tip: "team_groups_confirm",
			patch: ia(r, ne)
		}
	});
	let ae = qi(e, r, ne);
	if (ae && ne?.suggest && u.push({
		id: `team:early:${ne.suggest.day}`,
		hide: [],
		icon: "mdi:battery-clock-outline",
		title: ae.title,
		text: ae.text,
		to: y,
		choices: [{
			label: e("team.suggest.yes"),
			patch: { rules: { team_early: !0 } }
		}, {
			label: e("team.suggest.no"),
			patch: { rules: { team_early: !1 } }
		}],
		choicesTip: "team_early"
	}), r.rules.day_surplus) for (let t of r.batteries) {
		let r = _?.batteries?.[t.id]?.state;
		(r ? r === "need_ref" : uo(n.hass, t) === "need_ref") && t.day_surplus !== !1 && t.adapter !== "none" && d({
			id: `limit_ref:${t.id}`,
			icon: "mdi:percent-outline",
			title: e("overview.todo.limit_ref", { name: t.name }),
			text: e("overview.todo.limit_ref.text"),
			to: z({
				group: "battery",
				id: t.id
			})
		});
	}
	for (let [t, n] of Object.entries(_?.batteries ?? {})) n.problem && f({
		id: `problem:surplus:${t}:${n.problem}`,
		title: n.name,
		text: `${e("surplus.problem")} ${g(n.problem)}`,
		to: z({
			group: "battery",
			id: t
		})
	});
	for (let e of r.actions) {
		let t = a?.actions?.[e.id]?.problem;
		if (t) {
			let n = ot(r, e);
			f({
				id: `problem:${n.group}:${e.id}:${t}`,
				title: s(n.group, n.id, e.name),
				text: g(t),
				to: z(n)
			});
		}
	}
	let oe = r.climate?.enabled ? r.climate.rooms ?? {} : {};
	for (let [n, r] of Object.entries(oe)) {
		let i = r.enabled ? t.climate?.rooms[n]?.error : null;
		i && f({
			id: `problem:climate:${n}:${i}`,
			title: s("climate", n, n),
			text: e.optional(`week.error.${i}`) ?? e("week.error", { error: i }),
			to: z({
				group: "climate",
				id: n
			})
		});
	}
	p(r.batteries.filter((e) => e.adapter !== "none" && ["not_tested", "outdated"].includes(a?.ready[e.id] ?? "")).map((t) => ({
		id: `test:${t.id}`,
		name: t.name,
		one: {
			icon: "mdi:test-tube",
			title: e("overview.todo.test", { name: t.name }),
			text: e(a?.ready[t.id] === "outdated" ? "overview.todo.test.outdated" : "overview.todo.test.text"),
			to: z({
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
	}), "test"), r.notify?.service || d({
		id: "notify",
		icon: "mdi:bell-outline",
		title: e("overview.todo.notify"),
		text: e("overview.todo.notify.text"),
		to: {
			tab: "settings",
			section: "notify"
		}
	});
	let S = n.climateFound?.devices.length ?? 0, se = !!(r.climate?.enabled && Object.values(r.climate.rooms ?? {}).some((e) => e.enabled));
	S && !se && d({
		id: "climate",
		icon: "mdi:thermostat",
		title: e("overview.todo.climate"),
		text: e("overview.todo.climate.text"),
		to: {
			tab: "devices",
			section: "climate"
		}
	});
	let C = o.filter((e) => e.group === "car" && (e.car && !e.car.need.enabled || e.setup));
	for (let [t, n] of [[!1, "car"], [!0, "car_setup"]]) p(C.filter((e) => !!e.setup === t).map((n) => ({
		id: `car:${n.id}`,
		name: n.name,
		one: {
			icon: "mdi:car-electric",
			title: e(t ? "overview.todo.car.setup" : "overview.todo.car", { name: n.name }),
			text: e("overview.todo.car.text"),
			to: z(n)
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
	let w = new Set(u.map((e) => ce(e.to)));
	for (let t of hs(r).filter((e) => gs(r, e))) {
		let n = fs(e, t);
		if (w.has(ce(n.to))) continue;
		w.add(ce(n.to));
		let i = t.startsWith("capacity:") ? r.batteries.find((e) => `capacity:${e.id}` === t) : void 0;
		d({
			id: `later:${t}`,
			icon: "mdi:clock-outline",
			title: e("overview.todo.later", { topic: i?.name ?? e.optional(`ask.topic.${t}`) ?? t }),
			text: e("overview.todo.later.text", { place: n.place }),
			to: n.to
		});
	}
	let T = n.sparring;
	T && u.push({
		id: `sparring:${T.at}`,
		hide: [],
		icon: "mdi:eye-check-outline",
		title: e("sparring.todo", { points: Yo(e, qo(T)) }),
		text: T.summary || e("sparring.todo.text"),
		to: Wo
	});
	let le = yt(r, n.discovery).filter((e) => c(`new:${e.key}`));
	return le.length && u.push({
		id: `new:${le.map((e) => e.key).join(",")}`,
		hide: le.map((e) => `new:${e.key}`),
		icon: "mdi:new-box",
		title: e("overview.todo.new", { names: le.map((e) => e.name).join(", ") }),
		text: e("overview.todo.new.text"),
		to: {
			tab: "devices",
			section: "all"
		}
	}), u;
}
var Ts = 3, Es = class extends P {
	constructor(...e) {
		super(...e), this.prefix = M, this.items = [], this.steer = !1, this.all = !1, this.asking = !1, this.fixing = /* @__PURE__ */ new Set(), this.dismissed = /* @__PURE__ */ new Set(), this.notice = "", this.hiding = [];
	}
	static {
		this.styles = [x, D`
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
		if (!e || !t) return T;
		let r = t.questions ?? [], i = this.items.filter((e) => !this.dismissed.has(e.id));
		if (!i.length && !r.length && !this.steer && !this.notice) return T;
		let a = this.all ? i : i.slice(0, Ts), o = i.length - a.length, s = i.some((e) => e.id.startsWith("test:"));
		return j`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:bell-ring-outline"></ha-icon>${e("overview.inbox")}</div>
        <span class="chip warn">${e("overview.inbox.count", { count: i.length + r.length + +!!this.steer })}</span>
        ${n(e, "inbox")}
      </div>
      ${this.notice ? j`<div class="note after" role="status"><ha-icon icon="mdi:information-outline"></ha-icon><span>${this.notice}</span></div>` : T}
      <ul>
        ${this.steer ? j`<li class="steer">
              <span class="todo-icon"><ha-icon icon="mdi:weather-night"></ha-icon></span>
              <joe-steer-tonight
                compact
                .hideUntested=${s}
                .t=${e}
                .hass=${this.hass}
                .state=${t}
                .prefix=${this.prefix}
              ></joe-steer-tonight>
            </li>` : T}
        ${a.map((t) => this.renderItem(e, t))}
        ${r.length ? this.renderAsk(e, r.length) : T}
      </ul>
      ${o > 0 || this.all && i.length > Ts ? j`<div class="more-row" data-notip>
            <button type="button" class="mini-btn quiet" aria-expanded=${this.all ? "true" : "false"} @click=${() => this.all = !this.all}>
              <ha-icon icon=${this.all ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
              ${this.all ? e("overview.inbox.less") : e("overview.inbox.more", { count: o })}
            </button>
          </div>` : T}
      ${r.length && this.asking ? j`<joe-day-questions bare .hass=${this.hass} .t=${e} .questions=${r}></joe-day-questions>` : T}
    </section>`;
	}
	renderItem(e, t) {
		return j`<li class=${t.warn ? "warn" : ""}>
      <a class="todo-main" href=${k(this.prefix, t.to)} @click=${E(t.to)}>
        <span class="todo-icon"><ha-icon icon=${t.icon}></ha-icon></span>
        <span class="todo-text">
          <b>${t.title}</b>
          ${t.text ? j`<small>${t.text}</small>` : T}
          ${t.when ? j`<small class="when">${t.when}</small>` : T}
        </span>
        <ha-icon class="go" icon="mdi:chevron-right"></ha-icon>
      </a>
      ${t.ha ? j`<span class="todo-actions" data-tipped>${vi(e, t.ha.target)}${n(e, t.ha.tip)}</span>` : T}
      ${t.choices?.length ? j`<span class="todo-actions choices" data-tipped role="group" aria-label=${t.title}>
            ${t.choices.map((e) => j`<button
                type="button"
                class="mini-btn"
                ?disabled=${this.fixing.has(t.id)}
                @click=${() => this.choose(t, e)}
              >
                ${e.label}
              </button>`)}
            ${t.choicesTip ? n(e, t.choicesTip) : T}
          </span>` : T}
      ${t.fix ? j`<span class="todo-actions" data-tipped>
            <button type="button" class="mini-btn" ?disabled=${this.fixing.has(t.id)} @click=${() => this.applyFix(t)}>
              ${t.fix.label}
            </button>
            ${n(e, t.fix.tip)}
          </span>` : T}
      ${t.hide.length ? j`<span class="todo-actions" data-tipped>
            <button type="button" class="mini-btn quiet" @click=${() => this.dismiss(t)}>${e("overview.todo.dismiss")}</button>
            ${n(e, "todo_dismiss")}
          </span>` : T}
    </li>`;
	}
	renderAsk(e, t) {
		return j`<li class="ask" data-notip>
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
		if (t.patch) n = await L(this, t.patch);
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
		let t = await L(this, e.fix.patch), n = new Set(this.fixing);
		n.delete(e.id), this.fixing = n, t && (this.dismissed = /* @__PURE__ */ new Set([...this.dismissed, e.id]));
	}
	async dismiss(e) {
		let t = this.state?.config;
		if (!t) return;
		this.dismissed = /* @__PURE__ */ new Set([...this.dismissed, e.id]), this.hiding = [...this.hiding, ...e.hide];
		let n = [...t.answers.ignored];
		for (let e of this.hiding) n.includes(xs(e)) || n.push(xs(e));
		if (!await L(this, { answers: { ignored: n } })) {
			let t = new Set(this.dismissed);
			t.delete(e.id), this.dismissed = t, this.hiding = this.hiding.filter((t) => !e.hide.includes(t));
		}
	}
};
b([A({ attribute: !1 })], Es.prototype, "hass", void 0), b([A({ attribute: !1 })], Es.prototype, "t", void 0), b([A({ attribute: !1 })], Es.prototype, "state", void 0), b([A({ attribute: !1 })], Es.prototype, "prefix", void 0), b([A({ attribute: !1 })], Es.prototype, "items", void 0), b([A({ type: Boolean })], Es.prototype, "steer", void 0), b([C()], Es.prototype, "all", void 0), b([C()], Es.prototype, "asking", void 0), b([C()], Es.prototype, "fixing", void 0), b([C()], Es.prototype, "dismissed", void 0), b([C()], Es.prototype, "notice", void 0), _("joe-overview-inbox", Es);
//#endregion
//#region src/pages/devices/battery-device.ts
var Ds = [
	"hold",
	"charge",
	"release"
], Os = 14, ks = [
	"adapter",
	"controls",
	"mode_options",
	"steps",
	"prepare",
	"modbus"
], As = /* @__PURE__ */ new Map();
function js(e) {
	return {
		...yr(e),
		prepare: structuredClone(e.prepare)
	};
}
var Ms = (e, t) => JSON.stringify(e ?? null) === JSON.stringify(t ?? null);
function Ns(e, t, n) {
	switch (t.adapter) {
		case "none": return e("devices.battery.watch");
		case "generic": return e("devices.battery.generic");
		case "steps": return e("devices.battery.steps");
		default: return e("devices.battery.profile", { name: n?.profiles?.[t.adapter] ?? t.adapter });
	}
}
function Ps(e, t, n) {
	if (t.adapter === "none") return e("devices.action.watch");
	let r = n?.batteries[t.id], i = r?.action === "defer" && r.level != null ? "defer_buffer" : r?.action;
	return i ? e(`devices.action.${i}`, {
		target: s(e.lang, r?.target ?? 0, 0),
		floor: s(e.lang, r?.floor ?? 0, 0),
		until: r?.until ? v(r.until) : "",
		level: s(e.lang, r?.level ?? 0, 0)
	}) : e("devices.action.idle");
}
function Fs(e, t) {
	return e.adapter === "none" && !!t?.suggested?.complete;
}
function Is(e) {
	return {
		tab: "devices",
		section: "battery",
		id: e,
		sub: "control"
	};
}
var Ls = class extends q {
	constructor(...e) {
		super(...e), this.confirm = !1, this.removing = !1, this.saving = !1, this.notice = "", this.answering = !1, this.rolesNotice = "", this.automations = null, this.automationsFor = "", this.revealed = "";
	}
	static {
		this.styles = [
			x,
			K,
			Kn,
			D`
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
		e.has("entry") && t !== this.automationsFor && (this.removing = !1, this.notice = ""), this.hass && t && t !== this.automationsFor && (this.automationsFor = t, this.automations = null, wo(this.hass).then((e) => {
			this.automationsFor === t && (this.automations = e);
		}));
	}
	updated() {
		let e = this.sub === "intruders" ? `${this.battery?.id}/intruders` : "";
		e ? this.revealed !== e && _e(this.renderRoot, "intruders") && (this.revealed = e) : this.revealed = "";
	}
	render() {
		let { t: e, entry: t } = this, n = this.state, r = this.battery;
		if (!e || !n || !t || !r) return T;
		let i = n.control, a = this.discovery?.batteries.find((e) => e.id === r.id), o = r.adapter !== "none", s = To(this.automations ?? [], r.id);
		return j`${wa(this.ctx, {
			...ya(this.ctx, t),
			why: Ps(e, r, i),
			head: this.renderHead(e, r, a),
			now: o ? this.renderTest(e, r, i) : void 0,
			steer: this.renderSteer(e, r),
			power: this.renderPower(e, r),
			learned: Gn([Xn(e, n.config, this.hass, n.config.learned, r, Os)]),
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
      ${this.confirm ? this.renderConfirm(e, r) : T}
      ${this.sub === "control" ? this.renderControl(e, r, a) : T}`;
	}
	renderHead(e, t, n) {
		let r = Is(t.id);
		return j`<div class="head-row">
        <span class="chip ${t.adapter === "none" ? "" : "read"}">${Ns(e, t, this.info)}</span>
      </div>
      ${Fs(t, n) ? j`<div class="note">
            <ha-icon icon="mdi:lightbulb-on-outline"></ha-icon>
            <span
              >${e("devices.suggested")}
              <div class="note-actions">
                <a class="mini-btn go" href=${k(this.prefix, r)} @click=${E(r, { sheet: !0 })}>${e("devices.setup")}</a>
              </div></span
            >
          </div>` : T}
      ${lr(e, n?.notes, t.name)}
      ${sr(e, t, this.state?.control)}
      ${this.notice ? j`<div class="note warn" role="status"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.notice}</span></div>` : T}`;
	}
	renderTest(e, t, n) {
		let r = n?.ready[t.id] ?? "not_controllable", i = n?.testing?.battery === t.id ? n.testing : null, a = n?.tests[t.id], o = n?.probe_running, s = !!n?.testing || !!o, c = !!n?.steering, l = o?.battery === t.id ? j`<span class="chip">${e("battery.probe.running", { op: e.optional(`op.short.${o.op}`) ?? o.op })}</span>` : T, u = i ? j`<span class="chip">${e("devices.test.running")}</span>` : r === "outdated" ? j`<span class="chip warn">${e("devices.test.outdated")}</span>` : a ? j`<span class="chip ${a.ok ? "ok" : "warn"}"
              >${e(a.ok ? "devices.test.ok" : "devices.test.failed", { day: W(e.lang, a.at, "short") })}</span
            >` : j`<span class="chip">${e("devices.test.none")}</span>`, d = i?.steps ?? a?.steps ?? [];
		return j`${Ai(e, this.hass, t, n)}
      <div class="test">
        ${u} ${l}
        <button type="button" class="btn btn-secondary" ?disabled=${s || c} @click=${() => this.confirm = !0}>
          <ha-icon icon="mdi:play-circle-outline"></ha-icon>${e(a ? "devices.test.again" : "devices.test.start")}
        </button>
      </div>
      ${i || a ? this.renderSteps(e, d, i?.step ?? null, a) : T}
      ${this.renderProbes(e, t)}`;
	}
	renderProbes(e, t) {
		let n = this.state?.probes?.[t.id], r = Object.entries(n ?? {}).filter((e) => !!e[1]);
		if (!r.length) return T;
		let i = r.map(([t, n]) => {
			let r = e.optional(`op.short.${t}`) ?? t;
			return j`<span class=${n.ok ? "ok" : "bad"}
        >${e(n.ok ? "battery.probes.ok" : "battery.probes.failed", {
				op: r,
				day: W(e.lang, n.at, "short")
			})}</span
      >`;
		});
		return j`<p class="probes">${e("battery.probes", { list: "" })}${i.map((e, t) => j`${t ? " · " : ""}${e}`)}</p>`;
	}
	renderSteps(e, t, n, r) {
		let i = new Map(t.map((e) => [e.step, e])), a = !n && r?.problem ? e.optional(`devices.test.problem.${r.problem}`, { missing: (r.missing ?? []).map((t) => e.optional(`role.${t}`) ?? t).join(", ") }) : null;
		return a ? j`<ul class="steps">
        <li class="bad"><ha-icon icon="mdi:close-circle"></ha-icon><b>${e("devices.test.step.check")}</b><small>${a}</small></li>
      </ul>` : j`<ul class="steps">
      ${Ds.map((t) => {
			let r = i.get(t), a = r ? r.ok ? "mdi:check-circle" : "mdi:close-circle" : n === t ? "mdi:progress-clock" : "mdi:circle-outline";
			return j`<li class=${r ? r.ok ? "ok" : "bad" : "wait"}>
          <ha-icon icon=${a}></ha-icon>
          <b>${e(`devices.test.step.${t}`)}</b>
          <small>${r ? this.stepText(e, r) : ""}</small>
        </li>`;
		})}
    </ul>`;
	}
	stepText(e, t) {
		let n = this.hass, r = [];
		return t.power != null && r.push(Math.abs(t.power) >= .05 ? e("devices.test.power", { value: s(e.lang, t.power, 2) }) : e("devices.test.no_power")), t.wrong.length && r.push(e("devices.test.wrong", { entities: t.wrong.map((e) => c(n, e)).join(", ") })), t.errors.length && r.push(e("devices.test.error", { entities: t.errors.map((e) => c(n, e.entity_id)).join(", ") })), r.join(" · ");
	}
	renderConfirm(e, t) {
		let r = () => {
			this.confirm = !1;
		};
		return j`<joe-sheet label=${e("devices.test.start")} closeLabel=${e("common.close")} @joe-close=${r}>
      <div data-tipped>
        <div class="sheet-title">${N(e("devices.test.confirm.title", { name: t.name }), "h2", n(e, "devices_test"))}</div>
        <p class="sheet-text">${e("devices.test.confirm.text")}</p>
        <div class="actions">
          <button type="button" class="btn btn-secondary" data-notip @click=${r}>${e("common.cancel")}</button>
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
		let r = Is(t.id);
		return j`${this.renderRolesNote(e, t)}
      <div class="control-row" data-tipped>
        <span class="control-text">
          <small>${e("battery.page.how")}</small>
          <b>${Ns(e, t, this.info)}</b>
        </span>
        <a class="btn btn-secondary" href=${k(this.prefix, r)} @click=${E(r, { sheet: !0 })}>
          <ha-icon icon="mdi:tune-variant"></ha-icon>${e("devices.setup")}
        </a>
        ${n(e, "devices_setup")}
      </div>
      ${t.adapter === "none" ? T : this.renderDaySurplus(e, t)} ${this.fields(t, "steer")}`;
	}
	renderRolesNote(e, t) {
		let r = this.state?.battery_roles?.find((e) => e.battery_id === t.id);
		if (!r) return this.rolesNotice ? j`<div class="note roles-note" role="status"><ha-icon icon="mdi:information-outline"></ha-icon><span>${this.rolesNotice}</span></div>` : T;
		let i = this.info?.profiles?.[r.profile] ?? r.profile;
		return j`<div class="note warn roles-note" role="status" data-tipped>
      <ha-icon icon="mdi:swap-horizontal-variant"></ha-icon>
      <span
        >${e("roles.todo.title", {
			name: r.name,
			profile: i
		})}: ${e("roles.todo.text", { details: vs(e, r, this.hass) })}
        <div class="note-actions">
          ${ys(e, t.id).map((e) => j`<button
              type="button"
              class="mini-btn ${e.done ? "go" : ""}"
              ?disabled=${this.answering}
              @click=${() => this.answerRoles(e.message, e.done ?? "")}
            >
              ${e.label}
            </button>`)}
          ${n(e, "battery_roles")}
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
		let r = this.state, i = r.config.rules, a = lo(r), o = a?.batteries?.[t.id], c = uo(this.hass, t), l = c === "ok" || c === "need_ref", u = t.day_surplus !== !1, d = (t) => s(e.lang, t ?? 0, 1), f = {
			tab: "settings",
			section: "rules",
			id: "day_surplus"
		}, p = {
			tab: "devices",
			section: "battery",
			id: t.id,
			sub: "intruders"
		}, m;
		return m = l ? o && (o.state === "no_limit" || o.state === "unit" || o.state === "flash") ? e(`battery.surplus.${o.state}`) : i.day_surplus ? o?.state === "learning" ? e("battery.surplus.learning") : o?.state === "need_ref" || c === "need_ref" ? e("battery.surplus.need_ref") : o?.state === "team_wait" ? e("battery.surplus.team_wait") : o?.state === "capped" ? e("battery.surplus.capped", {
			kw: d(o.cap_kw),
			time: v(a?.pv_end)
		}) : o?.state === "would" ? e("battery.surplus.would", {
			kw: d(o.cap_kw),
			time: v(a?.pv_end)
		}) : o?.state === "unavailable" || o?.state === "unknown" ? e(`battery.surplus.${o.state}`) : o?.state === "not_tested" || r.control?.ready[t.id] !== "ready" ? e("battery.surplus.not_tested") : e(u ? "battery.surplus.takes_part" : "battery.surplus.left_out") : e("battery.surplus.rule_off") : e(`battery.surplus.${c}`), j`<div class="control-row" data-tipped>
        <span class="control-text">
          <b id="day-surplus-${t.id}">${e("battery.surplus.label")}</b>
          <small>${m}</small>
          ${!i.day_surplus && l ? j`<a class="mini-btn go" href=${k(this.prefix, f)} @click=${E(f)}>${e("battery.surplus.rule_go")}</a>` : T}
          ${i.day_surplus && o?.state === "automation" ? j`<a class="mini-btn go" href=${k(this.prefix, p)} @click=${this.jumpToIntruders(p)}
                >${e("battery.surplus.intruders_go")}</a
              >` : T}
        </span>
        ${n(e, "f_battery_day_surplus")}
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(u && l)}
          aria-labelledby="day-surplus-${t.id}"
          ?disabled=${!l}
          @click=${() => L(this, { batteries: { [t.id]: { day_surplus: !u } } })}
        ></button>
      </div>
      ${fo(this.hass, t) ? this.renderLimitRef(e, t) : T}`;
	}
	renderLimitRef(e, t) {
		let r = this.state.config, i = t.limit_ref_w ?? null, a = F(r, `batteries[${t.id}].limit_ref_w`), o = i == null;
		return j`<div class="field ref-field" data-tipped>
      <div class="field-label">
        <span id="limit-ref-${t.id}">${e("battery.limit_ref.label")}</span> ${n(e, "f_battery_limit_ref")}
        ${i == null ? T : O(e, a)}
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
            .value=${i == null ? "" : String(Math.round(i))}
            placeholder=${e("battery.limit_ref.placeholder")}
            @change=${(e) => {
			let n = e.target, r = Number.parseFloat(n.value.replace(",", ".")), a = Number.isFinite(r) && r >= 100 && r <= 1e5;
			if (n.value.trim() && !a) {
				n.value = i == null ? "" : String(Math.round(i));
				return;
			}
			L(this, { batteries: { [t.id]: { limit_ref_w: a ? Math.round(r) : null } } });
		}}
          />
          <span class="unit">W</span>
        </span>
        <button
          type="button"
          class="mini-btn ${o ? "go" : ""}"
          aria-pressed=${String(o)}
          @click=${() => {
			o || L(this, { batteries: { [t.id]: { limit_ref_w: null } } });
		}}
        >
          ${e("battery.limit_ref.learn")}
        </button>
      </div>
      <p class="field-hint">
        ${i == null ? e("battery.limit_ref.learning") : a?.source === "learned" ? e("battery.limit_ref.learned", { value: s(e.lang, i, 0) }) : e("battery.limit_ref.set", { value: s(e.lang, i, 0) })}
      </p>
    </div>`;
	}
	jumpToIntruders(e) {
		let t = E(e, { replace: !0 });
		return (e) => {
			t(e), e.defaultPrevented && (this.revealed = "", _e(this.renderRoot, "intruders"));
		};
	}
	renderPower(e, t) {
		return this.fields(t, "power");
	}
	fields(e, t) {
		return j`<joe-battery-fields
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
		return j`<joe-battery-automations
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
		return j`<div class="remove">
      <p class="remove-text">${e("battery.page.remove.text")}</p>
      ${this.removing ? j`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("battery.page.remove.confirm", { name: t.name })}</span></div>
            <div class="actions">
              <button type="button" class="btn btn-danger" ?disabled=${this.saving} @click=${() => this.leaveOut(t)}>
                ${e("battery.page.remove.go")}
              </button>
              <button type="button" class="btn btn-ghost" @click=${() => this.removing = !1}>${e("common.cancel")}</button>
            </div>` : j`<div class="actions">
            <button type="button" class="btn btn-secondary" @click=${() => this.removing = !0}>
              <ha-icon icon="mdi:eye-off-outline"></ha-icon>${e("review.ignore")}
            </button>
          </div>`}
    </div>`;
	}
	async leaveOut(e) {
		let t = this.state.config;
		this.saving = !0;
		let n = await L(this, {
			batteries: { [e.id]: null },
			answers: { ignored: Qe(t, `battery:${e.id}`, !0) }
		});
		this.saving = !1, n && (this.removing = !1, w(this, {
			tab: "devices",
			section: "battery"
		}, { replace: !0 }));
	}
	draftOf(e) {
		let t = js(e), n = As.get(e.id);
		if (!n) return t;
		let r = { ...t };
		for (let e of ks) Ms(n.base[e], n.draft[e]) || (r[e] = n.draft[e]);
		return r;
	}
	controlChanges(e, t) {
		let n = {};
		for (let r of ks) Ms(e[r], t[r]) || (n[r] = t[r]);
		return n;
	}
	dirty(e, t) {
		return Object.keys(this.controlChanges(e, t)).length > 0;
	}
	renderControl(e, t, r) {
		let i = this.draftOf(t), a = this.dirty(t, i), o = {
			tab: "devices",
			section: "battery",
			id: t.id
		};
		return j`<joe-sheet wide label=${e("devices.setup")} closeLabel=${e("common.close")} @joe-close=${() => Ee(this, o)}>
      <div data-tipped>
        <div class="sheet-title">${N(e("battery.control.title", { name: t.name }), "h2", n(e, "control_choice"))}</div>
        <p class="sheet-text">${e("battery.control.lead")}</p>
        <div class="field">
          <joe-battery-control
          .hass=${this.hass}
          .t=${e}
          .battery=${t}
          .found=${r}
          .profiles=${this.info?.profiles}
          .value=${i}
          .dirty=${a}
          .probes=${this.state?.probes?.[t.id]}
          .probeRunning=${this.state?.control?.probe_running ?? null}
          .busy=${!!this.state?.control?.testing}
          @joe-control-change=${(e) => {
			As.set(t.id, {
				base: js(t),
				draft: br(t, e.detail, r)
			}), this.requestUpdate();
		}}
        ></joe-battery-control>
        </div>
      </div>
      <div class="steer-bar" data-notip role="region" aria-label=${e("devices.setup")}>
        ${a ? j`<span class="unsaved" role="status">${e("battery.control.unsaved")}</span>` : T}
        <button type="button" class="btn btn-primary" ?disabled=${this.saving || !a} @click=${() => this.saveControl(t, o)}>
          ${e("common.save")}
        </button>
        <button
          type="button"
          class="btn btn-ghost"
          @click=${() => {
			As.delete(t.id), Ee(this, o);
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
			let t = await L(this, { batteries: { [e.id]: n } });
			if (this.saving = !1, !t) return;
		}
		As.delete(e.id), Ee(this, t);
	}
};
b([A({ attribute: !1 })], Ls.prototype, "entry", void 0), b([A({ attribute: !1 })], Ls.prototype, "sub", void 0), b([C()], Ls.prototype, "confirm", void 0), b([C()], Ls.prototype, "removing", void 0), b([C()], Ls.prototype, "saving", void 0), b([C()], Ls.prototype, "notice", void 0), b([C()], Ls.prototype, "answering", void 0), b([C()], Ls.prototype, "rolesNotice", void 0), b([C()], Ls.prototype, "automations", void 0), _("joe-battery-device", Ls);
//#endregion
//#region src/pages/devices/battery.ts
var Rs = "together", zs = [
	"reserve_soc",
	"max_target_soc",
	"evening_min_soc",
	"balance_days",
	"discharge_in_window",
	"converter_losses",
	"day_surplus",
	"car_house_only",
	"transfer_guard"
], Bs = class extends q {
	constructor(...e) {
		super(...e), this.busy = "", this.revealed = "";
	}
	static {
		this.styles = [
			x,
			K,
			co,
			D`
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
		super.updated(e), e.has("device") && this.device !== Rs && (this.revealed = ""), this.device === Rs && this.revealed !== Rs && _e(this.renderRoot, Rs) && (this.revealed = Rs);
	}
	render() {
		let e = this.t, t = this.state;
		if (!e || !t) return T;
		let n = this.device === Rs ? void 0 : gt(this.devices, "battery", this.device);
		if (n) return j`<joe-battery-device
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
		return j`<div class="wrap">
      ${Ea(e, e("nav.devices.battery"), e("battery.page.lead"), r.length > 0)}
      ${this.device !== void 0 && this.device !== Rs ? _a(e) : T}
      <joe-control-status .t=${e} .hass=${this.hass} .state=${t}></joe-control-status>
      ${this.renderEvcc(e)}
      ${r.length ? Ta(this.ctx, this.devices, "battery", (t) => this.cardChange(e, t)) : j`<p class="empty">${e("devices.batteries.none")}</p>`}
      <div class="actions">${Da(e, this.prefix, "battery", e("battery.page.add"))}</div>
      ${r.length >= 2 ? this.renderTeam(e, t.config) : T}
      ${r.length ? this.renderRules(e) : T}
      ${r.length ? j`<div data-anchor="automations">
            <joe-battery-automations
              .hass=${this.hass}
              .t=${e}
              batteries=${JSON.stringify(r)}
              mode=${t.mode}
              .ready=${t.control?.ready ?? {}}
            ></joe-battery-automations>
          </div>` : T}
      ${this.renderFound(e)}
    </div>`;
	}
	cardChange(e, t) {
		let n = t.battery;
		if (!n) return {};
		let r = this.discovery?.batteries.find((e) => e.id === n.id), i = Si(e, this.hass, this.state, t), a = Ps(e, n, this.state?.control), o = Is(n.id);
		return {
			state: [i, a].filter(Boolean).join(" · "),
			quick: Fs(n, r) ? j`<span class="dcard-suggest">${e("battery.page.suggested")}</span>
            <a class="mini-btn go" href=${k(this.prefix, o)} @click=${E(o, { sheet: !0 })}>${e("devices.setup")}</a>` : void 0
		};
	}
	renderTeam(e, t) {
		let r = ji(this.state), i = t.rules.battery_team ?? null, a = i ?? "sequence", o = (e) => {
			e !== i && L(this, { rules: { battery_team: e } });
		}, s = a === "sequence" ? Ui(e, r) : null, c = a === "sequence" ? Gi(e, r) : null;
		return j`<section class="card" data-tipped data-anchor=${Rs}>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:battery-sync-outline"></ha-icon>${e("team.title")}</div>
        ${n(e, "team")}
      </div>
      <p class="team-question" id="team-question">${e("team.question")}</p>
      <div class="team-choice" data-tipped>
        <div class="seg" role="group" aria-labelledby="team-question">
          ${["sequence", "together"].map((t) => j`<button type="button" aria-pressed=${String(a === t)} @click=${() => o(t)}>
                ${e(`team.mode.${t}`)}
              </button>`)}
        </div>
        ${n(e, "team_mode")}
        ${i ? O(e, F(t, "rules.battery_team")) : j`<span class="chip">${e("team.mode.default")}</span>`}
      </div>
      ${r ? j`<p class="team-now">${Ji(e, r)}</p>` : T}
      <div class="team-notes">
        ${s ? j`<div class="note" role="status" data-tipped>
              <ha-icon icon="mdi:weather-sunny"></ha-icon>
              <span>${s} ${n(e, "team_reason")}</span>
            </div>` : T}
        ${c ? j`<div class="note" role="status" data-tipped>
              <ha-icon icon="mdi:history"></ha-icon>
              <span>${c} ${n(e, "team_review")}</span>
            </div>` : T}
        ${!i && r && Object.keys(r.groups ?? {}).length >= 2 ? j`<div class="note" role="status" data-tipped>
              <ha-icon icon="mdi:shield-check-outline"></ha-icon>
              <span>${e("team.default")} ${n(e, "team_default")}</span>
            </div>` : T}
        ${r?.group_question ? this.renderGroupQuestion(e, t) : T}
        ${this.renderAutomationsNote(e, this.state?.control?.automations ?? [])}
        ${this.renderGuard(e, t)}
      </div>
      ${a === "sequence" ? j`<div class="team-orders">
              ${this.orderList(e, t, "team_charge_order")} ${this.orderList(e, t, "team_discharge_order")}
            </div>
            ${this.renderStyle(e, t)}` : T}
      <ul class="team-list">
        ${t.batteries.map((n) => this.teamBattery(e, t, n))}
      </ul>
    </section>`;
	}
	renderStyle(e, t) {
		let r = ji(this.state), i = t.rules.team_style ?? "auto", a = (e) => {
			e !== i && L(this, { rules: { team_style: e === "auto" ? null : e } });
		}, o = t.rules.team_early ?? null;
		return j`<details class="team-style" ?open=${i !== "auto"} data-notip>
      <summary>${e("team.style.title")}</summary>
      <div class="team-style-body">
        <p>${e("team.style.intro")}</p>
        <div class="team-options" role="radiogroup" aria-label=${e("team.style.title")}>
          ${[
			"auto",
			"strict",
			"base"
		].map((t) => j`<div class="team-option" data-tipped>
              <button type="button" class="way" role="radio" aria-checked=${String(i === t)} @click=${() => a(t)}>
                <b>${e(`team.style.${t}`)}</b>
                <small>${e(`team.style.${t}.text`)}</small>
              </button>
              ${n(e, `team_style_${t}`)}
            </div>`)}
        </div>
        ${i === "base" ? j`<div class="note amber" role="status" data-tipped>
              <ha-icon icon="mdi:alert-outline"></ha-icon>
              <span>${e("team.style.base.warn")} ${n(e, "team_base_warn")}</span>
            </div>` : T}
        ${i === "base" && r?.base_problem ? j`<div class="note warn" role="status" data-tipped>
              <ha-icon icon="mdi:information-outline"></ha-icon>
              <span>${e("team.style.base.no_lever")} ${n(e, "team_base_lever")}</span>
            </div>` : T}
        ${i === "strict" ? T : j`<div class="team-line" data-tipped>
              <span class="what">
                <b id="team-early">${e("team.early")}</b>
                <small>
                  ${Ki(e, r)}
                  ${o == null ? j`<span class="chip">${e("team.early.unanswered")}</span>` : O(e, F(t, "rules.team_early"))}
                </small>
              </span>
              <span class="team-ctl">
                ${n(e, "team_early")}
                <button
                  type="button"
                  class="switch"
                  role="switch"
                  aria-checked=${String(o === !0)}
                  aria-labelledby="team-early"
                  @click=${() => L(this, { rules: { team_early: o !== !0 } })}
                ></button>
              </span>
            </div>`}
      </div>
    </details>`;
	}
	renderGuard(e, t) {
		let r = Zi(this.state);
		if (!r) return T;
		let i = r.state === "on" && r.last?.result === "alarm" && !r.last.dry;
		return j`<div class="note guard ${i ? "warn" : ""}" role="status" data-tipped data-anchor="guard">
      <ha-icon icon="mdi:shield-sync-outline"></ha-icon>
      <span><b>${e("guard.title")}</b> ${n(e, "guard")} · ${ta(e, r, t)}</span>
    </div>`;
	}
	renderAutomationsNote(e, t) {
		return t.length ? j`<div class="note warn" role="status">
      <ha-icon icon="mdi:robot-confused-outline"></ha-icon>
      <span>
        ${e("team.automations", { names: Yi(t) })}
        <span class="note-actions">
          <button type="button" class="mini-btn go" @click=${() => _e(this.renderRoot, "automations")}>
            ${e("team.automations.go")}
          </button>
        </span>
      </span>
    </div>` : T;
	}
	renderGroupQuestion(e, t) {
		let r = ji(this.state);
		return j`<div class="note" role="status" data-tipped>
      <ha-icon icon="mdi:help-circle-outline"></ha-icon>
      <span>
        <b>${e("team.groups.question")}</b> ${n(e, "team_group")}
        ${e("team.groups.question.text", { names: aa(t, r) })}
        <span class="note-actions">
          <button type="button" class="mini-btn go" @click=${() => L(this, ia(t, r))}>
            ${e("team.groups.confirm")}
          </button>
          ${n(e, "team_groups_confirm")}
        </span>
      </span>
    </div>`;
	}
	orderList(e, t, r) {
		let i = Fi(t, ji(this.state), Mi(t, r)), a = (e, t) => {
			let n = [...i];
			[n[e], n[e + t]] = [n[e + t], n[e]], L(this, { rules: { [r]: n.flat().map((e) => e.id) } });
		}, o = (e) => j`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d=${e ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"} />
      </svg>`, s = r === "team_charge_order" ? "team_charge_order" : "team_discharge_order";
		return j`<div data-tipped>
      <div class="team-label">${e(`team.${s}`)} ${n(e, s)}</div>
      <div class="order">
        ${i.map((t, n) => j`<div>
            <span>${n + 1}. ${t.map((e) => e.name).join(" + ")}</span>
            <button
              type="button"
              aria-label=${e("rule.priority.up", { name: t.map((e) => e.name).join(" + ") })}
              ?disabled=${n === 0}
              @click=${() => a(n, -1)}
            >
              ${o(!0)}
            </button>
            <button
              type="button"
              aria-label=${e("rule.priority.down", { name: t.map((e) => e.name).join(" + ") })}
              ?disabled=${n === i.length - 1}
              @click=${() => a(n, 1)}
            >
              ${o(!1)}
            </button>
          </div>`)}
      </div>
    </div>`;
	}
	teamBattery(e, t, r) {
		let i = ji(this.state), a = i?.batteries[r.id], o = Ni(r, i), c = r.cutoff_soc ?? null, l = (t) => s(e.lang, t, 1), u = `team-self-${r.id}`;
		return j`<li>
      <div class="team-line" data-tipped>
        <span class="what">
          <b id=${u}>${r.name}</b>
          <small>
            ${e("team.self_regulating")}
            ${r.self_regulating == null && i ? j`<span class="chip">${e("team.proposed")}</span>` : O(e, F(t, `batteries[${r.id}].self_regulating`))}
          </small>
        </span>
        <span class="team-ctl">
          ${n(e, "team_self_regulating")}
          <button
            type="button"
            class="switch"
            role="switch"
            aria-checked=${String(o)}
            aria-labelledby=${u}
            @click=${() => L(this, { batteries: { [r.id]: { self_regulating: !o } } })}
          ></button>
        </span>
      </div>
      ${o ? this.groupLine(e, t, r) : T}
      ${o ? j`<div class="team-line" data-tipped>
            <span class="what">
              <small>
                ${c == null ? e("team.cutoff.unknown", { value: l(a?.floor ?? 10) }) : e("team.cutoff.known", { value: l(c) })}
                ${c == null ? T : O(e, F(t, `batteries[${r.id}].cutoff_soc`))}
              </small>
            </span>
            <span class="team-ctl">${n(e, "team_cutoff")}</span>
          </div>` : T}
    </li>`;
	}
	groupLine(e, t, r) {
		let i = ji(this.state), a = Pi(r, i), o = t.batteries.filter((e) => e.id !== r.id && Ni(e, i)), s = `own:${r.id}`, c = o.find((e) => Pi(e, i) === a), l = c ? Pi(c, i) : s, u = `team-group-${r.id}`, d = r.control_group == null && i?.batteries[r.id]?.group_sure === !1, f = (e) => {
			e !== l && L(this, { batteries: { [r.id]: { control_group: e } } });
		};
		return j`<div class="team-line" data-tipped>
      <span class="what">
        <small id=${u}>
          ${e("team.group")}
          ${r.control_group == null && i ? j`<span class="chip ${d ? "warn" : ""}">${e(d ? "team.group.check" : "team.proposed")}</span>` : O(e, F(t, `batteries[${r.id}].control_group`))}
        </small>
      </span>
      <span class="team-ctl">
        ${n(e, "team_group")}
        <select
          class="input team-group"
          aria-labelledby=${u}
          .value=${l}
          @change=${(e) => f(e.target.value)}
        >
          <option value=${s} ?selected=${l === s}>${e("team.group.own")}</option>
          ${o.map((t) => {
			let n = Pi(t, i);
			return j`<option value=${n} ?selected=${l === n && c?.id === t.id}>
              ${e("team.group.with", { name: t.name })}
            </option>`;
		})}
        </select>
      </span>
    </div>`;
	}
	renderRules(e) {
		let t = this.state.config, r = lo(this.state);
		return j`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:tune-vertical"></ha-icon>${e("battery.page.rules")}</div>
        ${n(e, "battery_rules")}
      </div>
      <div class="mirrors">
        ${zs.map((n) => {
			let i = {
				tab: "settings",
				section: "rules",
				id: n
			};
			return J(e, this.prefix, {
				label: e(`rule.${n}`),
				value: Wa(e, t, n),
				source: F(t, `rules.${n}`),
				hint: n === "day_surplus" && r ? mo(e, r) : n === "car_house_only" && eo(e, t, this.state?.control?.house) || void 0,
				to: i
			});
		})}
      </div>
    </section>`;
	}
	renderEvcc(e) {
		let t = yo(e, lo(this.state));
		return t === T ? T : j`<div class="evcc" data-tipped>${t} ${n(e, "surplus_evcc")}</div>`;
	}
	renderFound(e) {
		let t = this.state.config, r = yt(t, this.discovery).filter((e) => e.kind === "battery" && e.battery), i = bt(t, this.discovery), a = this.discovery?.battery_notes ?? [];
		if (!r.length && !i.length && !a.length) return T;
		let o = (t, n, r) => j`<li>
        <span class="what">
          <b>${t.name}</b>
          <small>${e(n ? "devices.add.battery.ignored" : "battery.page.found.new")}</small>
        </span>
        <span class="row-actions">
          <button type="button" class="mini-btn go" ?disabled=${!!this.busy} @click=${() => this.use(t, r)}>
            ${e(n ? "devices.add.battery.use" : "devices.found.use")}
          </button>
          ${n ? T : j`<button type="button" class="mini-btn quiet" ?disabled=${!!this.busy} @click=${() => this.ignore(r)}>
                ${e("devices.found.ignore")}
              </button>`}
        </span>
      </li>`;
		return j`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:home-battery-outline"></ha-icon>${e("battery.page.found")}</div>
        ${n(e, "battery_found")}
      </div>
      ${r.length || i.length ? j`<ul class="found">
            ${r.map((e) => o(e.battery, !1, e.key))} ${i.map((e) => o(e, !0, `battery:${e.id}`))}
          </ul>` : T}
      ${lr(e, a)}
    </section>`;
	}
	async use(e, t) {
		this.busy = t;
		let n = await mi(this, this.state.config, e);
		this.busy = "", n && w(this, {
			tab: "devices",
			section: "battery",
			id: n
		});
	}
	async ignore(e) {
		this.busy = e, await gi(this, this.state.config, e), this.busy = "";
	}
};
b([A({ attribute: !1 })], Bs.prototype, "device", void 0), b([A({ attribute: !1 })], Bs.prototype, "sub", void 0), b([C()], Bs.prototype, "busy", void 0), _("joe-battery-group", Bs);
//#endregion
//#region src/components/car-need.ts
var Vs = class extends P {
	constructor(...e) {
		super(...e), this.roundTrip = !0, this.failed = !1;
	}
	static {
		this.styles = [x, D`
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
		if (!e || !t || !n) return T;
		let r = (t, n = 0) => s(e.lang, t ?? 0, n);
		if (!n.known) return j`<p>${e(n.soc != null && !n.capacity_kwh ? "need.unknown_capacity" : "need.unknown")}</p>`;
		let i = [];
		i.push(j`<p>
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
      </p>`), i.push(j`<p>
        ${e(`need.consumption.${n.consumption_source}`, {
			value: r(n.consumption, 1),
			temp: n.temp == null ? "–" : r(n.temp)
		})}${n.rain ? ` ${e("need.rain")}` : ""}
      </p>`), n.target_unit === "%" ? i.push(j`<p>${e("need.has_soc", {
			soc: r(n.soc),
			km: r(n.have_km),
			target: r(n.target)
		})}</p>`) : i.push(j`<p>${e("need.has_range", { km: r(n.have_km) })}</p>`);
		let a = n.missing_kwh ?? 0;
		return i.push(j`<p class="result">
        ${a >= .2 ? t.run && !t.manual ? e("need.charges", {
			kwh: r(a, 1),
			start: v(t.start)
		}) : e("need.missing", { kwh: r(a, 1) }) : e("need.enough")}
      </p>`), n.fits === !1 && i.push(j`<p>${e("need.too_far")}</p>`), j`${i} ${n.trips.length ? this.renderTrips(e, n.trips) : T}`;
	}
	renderTrips(e, t) {
		return j`<div data-tipped>
      <div class="head">${e("need.trips.title")} ${n(e, "need_trips")}</div>
      <ul>
        ${t.map((t) => j`<li>
            <span>${t.start.includes("T") ? v(t.start) : e("need.all_day")}</span>
            <span class="where"
              >${t.location}${t.from ? j`<small> ${e("need.leg_from", { place: t.from })}</small>` : T}</span
            >
            ${this.editing === t.location ? this.renderEdit(e, t) : j`<span class=${t.km == null ? "km unknown" : "km"}>
                    ${t.km == null ? e("need.km_unknown") : e(`need.km.${t.source ?? "zone"}`, { km: s(e.lang, t.km, 0) })}
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
        ${this.renderBack(e, t[t.length - 1])}
      </ul>
      ${this.failed ? j`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("error.action")}</div>` : T}
    </div>`;
	}
	renderBack(e, t) {
		if (!t || !("back_km" in t)) return T;
		let n = t.back_km;
		return j`<li>
      <span></span>
      <span class="where">${e("need.leg_home")}</span>
      <span class=${n == null ? "km unknown" : "km"}>
        ${n == null ? e("need.km_unknown") : e(`need.km.${t.back_source ?? "zone"}`, { km: s(e.lang, n, 0) })}
      </span>
      <span></span>
    </li>`;
	}
	renderEdit(e, t) {
		let n = t.km == null || t.from ? "" : String(Math.round(t.km));
		return j`<form
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
b([A({ attribute: !1 })], Vs.prototype, "hass", void 0), b([A({ attribute: !1 })], Vs.prototype, "t", void 0), b([A({ attribute: !1 })], Vs.prototype, "action", void 0), b([A({ attribute: !1 })], Vs.prototype, "roundTrip", void 0), b([C()], Vs.prototype, "editing", void 0), b([C()], Vs.prototype, "failed", void 0), _("joe-car-need", Vs);
//#endregion
//#region src/pages/devices/car-device.ts
function Hs(e) {
	return j`${e.split(/\*\*(.+?)\*\*/).map((e, t) => t % 2 ? j`<strong>${e}</strong>` : e)}`;
}
var Us = [
	"soc",
	"range",
	"odometer",
	"plugged",
	"location",
	"outside_temp"
], Ws = class extends q {
	constructor(...e) {
		super(...e), this.revealed = "";
	}
	static {
		this.styles = [
			x,
			K,
			Kn,
			Ro,
			D`
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
		(e.has("sub") || e.has("entry")) && (n ? this.revealed !== n && _e(this.renderRoot, t) && (this.revealed = n) : this.revealed = "");
	}
	render() {
		let { t: e, hass: t, state: n, entry: r } = this, i = r?.car;
		if (!e || !t || !n || !r || !i) return T;
		let a = ya(this.ctx, r), o = i.need, s = {
			hass: t,
			t: e,
			state: n,
			discovery: this.discovery,
			prefix: this.prefix
		};
		return wa(this.ctx, {
			...a,
			live: bi(e, t, n, i.id) || void 0,
			why: this.whereText(e, n, i),
			log: a.log ? {
				...a.log,
				filter: { group: "car" }
			} : void 0,
			now: j`${this.values(e, n, i)} ${this.plugged(e, n, i)}
        <joe-car-charge .hass=${t} .t=${e} .state=${n} .car=${i}></joe-car-charge>
        ${o.enabled ? j`${Lo(e("car.trips"))} ${this.trips(e, n, i)}` : T}`,
			steer: j`<joe-car-steer
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
				body: j`${this.explain(e, i)}
            ${o.enabled ? this.calendarLine(e, n, i) : j`<p class="muted">${e("devices.car.terms_off")}</p>`}
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
				body: j`<joe-car-sources
            .hass=${t}
            .t=${e}
            .state=${n}
            .discovery=${this.discovery}
            .prefix=${this.prefix}
            .car=${i}
          ></joe-car-sources>`
			}],
			learned: Gn([$n(e, n.config.learned, i)]),
			learnedArea: "car",
			tips: {
				steer: "car_steer",
				now: "car_now"
			},
			removeTitle: e("devices.page.delete"),
			remove: j`<joe-car-delete .t=${e} .config=${n.config} .car=${i} .leave=${{
				tab: "devices",
				section: "car"
			}}></joe-car-delete>`
		});
	}
	whereText(e, t, n) {
		let r = p(t, n.id);
		if (!r) return e(t.cars?.cars?.[n.id]?.plugged ? "car.plugged_elsewhere" : "car.not_plugged");
		let i = f(t, r.id)?.how ?? "home";
		return `${e("car.plugged_at", { point: r.name })} · ${e(`point.how.${i}`)}`;
	}
	values(e, t, n) {
		this.hass;
		let r = t.cars?.cars?.[n.id]?.values ?? {}, i = Us.filter((e) => r[e]);
		return i.length ? j`<ul class="values">
      ${i.map((t) => {
			let n = r[t];
			return j`<li>
          <span class="label">${e(`car.role.${t}`)}</span>
          <span class="value">
            <b>${this.valueText(e, t, n.entity)}</b>
            <span class="chip">${n.kind === "manual" ? e("car.source.chip_manual") : e("car.source.chip", { from: Pe(e, n) })}</span>
          </span>
        </li>`;
		})}
    </ul>` : j`<p class="muted">${e("car.values.none")}</p>`;
	}
	valueText(e, t, n) {
		let r = this.hass, i = r.states[n]?.state;
		return i === void 0 || i === "unavailable" || i === "unknown" ? e("car.value.unknown") : t === "plugged" ? e([
			"on",
			"true",
			"plugged",
			"connected"
		].includes(i.toLowerCase()) ? "car.value.plugged" : "car.value.unplugged") : t === "location" ? i === "home" ? e("car.value.home") : i === "not_home" ? e("car.value.away") : i : d(r, n, e.lang);
	}
	plugged(e, t, n) {
		let r = p(t, n.id);
		if (!r) return T;
		let i = {
			tab: "devices",
			section: "car",
			id: "point",
			sub: r.id
		};
		return j`<p class="plugged">
      <ha-icon icon="mdi:ev-station"></ha-icon>
      <span>${e("car.plugged_at", { point: r.name })}</span>
      <a class="mini-btn quiet" href=${k(this.prefix, i)} @click=${E(i)}>${e("car.open_point")}</a>
    </p>`;
	}
	trips(e, t, n) {
		let r = o(t, n.id);
		if (!r) return j`<p class="muted">${e("car.trips.none")}</p>`;
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
		return j`<joe-car-need .hass=${this.hass} .t=${e} .action=${a} .roundTrip=${n.need.round_trip ?? !0}></joe-car-need>`;
	}
	explain(e, t) {
		let n = t.need, r = !!(n.calendars?.length || n.source === "mailbox" || n.source === "account");
		return j`<details class="explain" ?open=${!r} data-notip>
      <summary>${e("car.explain.title")}</summary>
      <div class="explain-body">
        <p>${Hs(e("car.explain.why"))}</p>
        <h4>${e("car.explain.two")}</h4>
        <ul>
          <li>${Hs(e("car.explain.car_cal", { name: t.name }))}</li>
          <li>${Hs(e("car.explain.persons"))}</li>
        </ul>
        <h4>${e("car.explain.ways")}</h4>
        <ul>
          <li>${Hs(e("car.explain.way.calendar"))}</li>
          <li>${Hs(e("car.explain.way.mailbox"))}</li>
          <li>${Hs(e("car.explain.way.account"))}</li>
        </ul>
        <h4>${e("car.explain.example.title")}</h4>
        <ol>
          <li>${Hs(e("car.explain.example.1"))}</li>
          <li>${Hs(e("car.explain.example.2", { name: t.name }))}</li>
          <li>${Hs(e("car.explain.example.3", { name: t.name }))}</li>
          <li>${Hs(e("car.explain.example.4"))}</li>
        </ol>
        <h4>${e("car.explain.rules")}</h4>
        <ul>
          <li>${Hs(e("car.explain.rule.place"))}</li>
          <li>${Hs(e("car.explain.rule.online"))}</li>
          <li>${Hs(e("car.explain.rule.twice"))}</li>
          <li>${Hs(e("car.explain.rule.none"))}</li>
        </ul>
      </div>
    </details>`;
	}
	calendarLine(e, t, r) {
		let i = r.need, a = i.source ?? "ha", o = "", s = "none", l = null, u = t.config.persons.filter((e) => e.calendars.length && (i.persons == null || i.persons.includes(e.id)));
		if (a === "ha" && (i.calendars?.length || u.length)) o = [...(i.calendars ?? []).map((e) => c(this.hass, e)), ...u.length ? [e("devices.car.of_persons", { names: u.map((e) => e.name).join(", ") })] : []].join(" · "), s = "ok";
		else if (a === "mailbox" && i.mailbox?.address) {
			let e = t.mailbox?.[r.id];
			o = i.mailbox.address, s = e?.state === "ok" ? "ok" : "warn", l = e?.checked ?? null;
		} else if (a === "account" && i.account?.address) {
			let e = t.accounts?.[r.id];
			o = i.account.address, s = e?.state === "ok" ? "ok" : "warn", l = e?.checked ?? null;
		}
		let d = m(r.id, "calendars");
		return j`<div class="car-cal" data-tipped>
      <ha-icon icon="mdi:calendar-month-outline"></ha-icon>
      <span class="grow">
        ${s === "none" ? j`<b>${e("devices.car.no_calendar")}</b>` : j`<b>${o}</b>
              <small>
                ${e(s === "ok" ? "devices.car.calendar_ok" : "devices.car.calendar_problem")}
                ${l ? e("devices.car.checked", { when: new Date(l).toLocaleString(e.lang, {
			weekday: "short",
			hour: "2-digit",
			minute: "2-digit"
		}) }) : T}
              </small>`}
      </span>
      <a class="mini-btn ${s === "none" ? "go" : ""}" href=${k(this.prefix, d)} @click=${E(d, { replace: !0 })}>
        ${e(s === "none" ? "devices.car.connect" : "devices.car.change")}
      </a>
      ${n(e, "car_calendar_card")}
    </div>`;
	}
};
b([A({ attribute: !1 })], Ws.prototype, "entry", void 0), b([A({ attribute: !1 })], Ws.prototype, "sub", void 0), _("joe-car-device", Ws);
//#endregion
//#region src/pages/devices/other-list.ts
var Gs = ["auto", "always"], Ks = [
	"auto",
	"surplus",
	"cheap"
], qs = [
	"climate",
	"ev",
	"hot_water"
];
function Js(e, t, n) {
	return n === t.kind ? Promise.resolve(!1) : L(e, { consumers: { [t.id]: { kind: n } } });
}
function Ys(e, t, n) {
	return n === (t.runs ?? "auto") ? Promise.resolve(!1) : L(e, { consumers: { [t.id]: { runs: n } } });
}
function Xs(e, t, n) {
	return j`<select
    class="input"
    aria-label=${e("consumers.kind_of", { name: t.name })}
    .value=${t.kind}
    @change=${(e) => n(e.target.value)}
  >
    ${Bn.map((n) => j`<option value=${n} ?selected=${n === t.kind}>${e(`kind.${n}`)}</option>`)}
  </select>`;
}
function Zs(e, t, n) {
	if (t.kind === "submeter") return T;
	let r = t.runs ?? "auto";
	return j`<select
    class="input"
    aria-label=${e("consumers.runs_of", { name: t.name })}
    .value=${r}
    @change=${(e) => n(e.target.value)}
  >
    ${t.kind === "ev" ? Gs.map((t) => j`<option value=${t} ?selected=${t === r}>${e(`runs.ev.${t}`)}</option>`) : Ks.map((t) => j`<option value=${t} ?selected=${t === r}>${e(`runs.${t}`)}</option>`)}
  </select>`;
}
function Qs(e, t, r, i, a) {
	let o = a.power_entity ?? a.energy_entity;
	return j`${o ? j`<div class="meter-line">
          <span class="meter-label">${t("devices.meter")}</span>
          <span class="meter-value"><b>${c(r, o)}</b> · ${d(r, o, t.lang)}</span>
          ${O(t, F(i, `consumers[${a.id}].kind`))}
        </div>` : T}
    <div class="field" data-tipped>
      <div class="field-label">${t("consumers.kind")} ${n(t, "f_consumer_kind")}</div>
      ${Xs(t, a, (t) => void Js(e, a, t))}
    </div>
    ${a.kind === "submeter" ? T : j`<div class="field" data-tipped>
          <div class="field-label">${t("consumers.runs")} ${n(t, "f_consumer_runs")}</div>
          ${Zs(t, a, (t) => void Ys(e, a, t))}
        </div>`}`;
}
var $s = D`
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
`, ec = class extends P {
	static {
		this.styles = [x, D`
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
		let { t: e, hass: t, config: r } = this;
		if (!e || !t || !r) return T;
		let i = [...r.consumers].sort((t, n) => Number(t.kind === "submeter") - Number(n.kind === "submeter") || t.name.localeCompare(n.name, e.lang));
		return j`<div data-tipped>
      <div class="head">${e("consumers.kind")} ${n(e, "f_consumer_kind")}</div>
      <div class="head sub">${e("consumers.runs")} ${n(e, "f_consumer_runs")}</div>
      ${i.length ? j`<ul>
            ${i.map((n) => {
			let i = n.power_entity ? d(t, n.power_entity, e.lang) : "";
			return j`<li>
                <div>
                  <b>${n.name}</b>
                  <small>${O(e, F(r, `consumers[${n.id}].kind`))}${i}</small>
                </div>
                <div class="selects">
                  ${Xs(e, n, (e) => void Js(this, n, e))}
                  ${Zs(e, n, (e) => void Ys(this, n, e))}
                </div>
              </li>`;
		})}
          </ul>` : j`<p class="empty">${e("consumers.empty")}</p>`}
    </div>`;
	}
};
b([A({ attribute: !1 })], ec.prototype, "hass", void 0), b([A({ attribute: !1 })], ec.prototype, "t", void 0), b([A({ attribute: !1 })], ec.prototype, "config", void 0), _("joe-consumer-list", ec);
//#endregion
//#region src/pages/devices/car-point.ts
var tc = class extends q {
	constructor(...e) {
		super(...e), this.busy = !1, this.failed = !1;
	}
	static {
		this.styles = [
			x,
			K,
			$s,
			Ro,
			D`
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
		if (!e || !t || !n || !r || !i) return T;
		let a = ya(this.ctx, r), o = r.consumer;
		return wa(this.ctx, {
			...a,
			live: ee(e, n, i),
			why: kn(e, n, i),
			now: j`${this.which(e, n, i)}
        <joe-action-tonight .hass=${t} .t=${e} .state=${n} .action=${i}></joe-action-tonight>`,
			steer: j`<joe-action-steer
        .hass=${t}
        .t=${e}
        .state=${n}
        .discovery=${this.discovery}
        .prefix=${this.prefix}
        .action=${i}
        .section=${"point"}
      ></joe-action-steer>`,
			power: o ? Qs(this, e, t, n.config, o) : void 0,
			tips: {
				now: "point_now",
				steer: "point_steer"
			},
			removeTitle: e("devices.page.delete"),
			remove: j`<joe-action-delete
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
	which(e, t, r) {
		let a = f(t, r.id), o = i(t.config, r), s = t.cars?.answers?.[r.id], c = !!a?.ask, l = h(t.config, a?.car), u = l ? m(l.id) : void 0, d = (e) => this.answer(r.id, e);
		return j`<div class="which ${c ? "ask" : ""}" data-tipped>
      ${c ? j`<p class="q">${e("point.ask", { point: r.name })} ${n(e, "point_which")}</p>
            <p>${e("point.ask.text")}</p>` : j`<p>${ee(e, t, r)} ${n(e, "point_which")}</p>`}
      ${u && l ? j`<a class="mini-btn quiet car-link" href=${k(this.prefix, u)} @click=${E(u)}>${e("point.open_car", { car: l.name })}</a>` : T}
      ${o.length && a && a.state !== "empty" && a.state !== "free" ? j`${c ? T : Lo(e("point.other_car"))}
            <div class="choices" role="group" aria-label=${e("point.ask", { point: r.name })}>
              ${o.map((e) => j`<button
                  type="button"
                  class="mini-btn ${a.car === e.id ? "go" : ""}"
                  aria-pressed=${String(a.car === e.id)}
                  ?disabled=${this.busy}
                  @click=${() => d(e.id)}
                >
                  <ha-icon icon="mdi:car-electric"></ha-icon>${e.name}
                </button>`)}
              <button
                type="button"
                class="mini-btn ${a.state === "guest" ? "go" : "quiet"}"
                aria-pressed=${String(a.state === "guest")}
                ?disabled=${this.busy}
                @click=${() => d("guest")}
              >
                <ha-icon icon="mdi:account-arrow-right-outline"></ha-icon>${e("point.guest")}
              </button>
              ${s ? j`<button type="button" class="mini-btn quiet" ?disabled=${this.busy} @click=${() => d(null)}>
                    ${e("point.forget")}
                  </button>` : T}
            </div>` : T}
      ${this.failed ? j`<p class="bad" role="status">${e("error.action")}</p>` : T}
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
b([A({ attribute: !1 })], tc.prototype, "entry", void 0), b([C()], tc.prototype, "busy", void 0), b([C()], tc.prototype, "failed", void 0);
var nc = class extends q {
	static {
		this.styles = [
			x,
			K,
			$s,
			Ro
		];
	}
	render() {
		let { t: e, hass: t, state: n, entry: r } = this, i = r?.consumer;
		return !e || !t || !n || !r || !i ? T : wa(this.ctx, {
			...ya(this.ctx, r),
			now: Po(e, this.prefix, "wallbox", i.id, e("devices.car.lonely"), e("devices.car.set_up"), "devices_lonely_car"),
			power: Qs(this, e, t, n.config, i)
		});
	}
};
b([A({ attribute: !1 })], nc.prototype, "entry", void 0), _("joe-car-point", tc), _("joe-car-meter", nc);
//#endregion
//#region src/pages/devices/car.ts
var rc = class extends q {
	static {
		this.styles = [
			x,
			K,
			Ro,
			D`
      joe-car-search.search {
        margin-top: 20px;
      }
    `
		];
	}
	target() {
		return this.device === "point" ? gt(this.devices, "car", `point:${this.sub ?? ""}`) : gt(this.devices, "car", this.device) ?? (this.device ? gt(this.devices, "car", `point:${this.device}`) : void 0);
	}
	render() {
		let e = this.t;
		if (!e || !this.state) return T;
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
		if (t?.car) return j`<joe-car-device
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
		if (t?.point) return j`<joe-car-point
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
		if (t) return j`<joe-car-meter
        .hass=${n.hass}
        .t=${e}
        .state=${n.state}
        .prefix=${n.prefix}
        .devices=${n.devices}
        .entry=${t}
      ></joe-car-meter>`;
		let r = this.device && this.device !== "point" ? Fo(this.devices, this.device, "car") : void 0, i = this.devices.filter((e) => e.group === "car" && e.car), a = this.devices.filter((e) => e.group === "car" && !e.car);
		return j`<div class="wrap">
      ${Ea(e, e("nav.devices.car"), e("devices.car.lead"), this.devices.some((e) => e.group === "car"))}
      ${this.device === void 0 ? T : r ? Io(e, this.prefix, r.name, r) : _a(e)}
      ${i.length ? j`<h3 class="sub-group">${e("devices.car.cars")}</h3>` : T}
      ${Ta(this.ctx, i, "car")}
      ${a.length ? j`<h3 class="sub-group">${e("devices.car.points")}</h3>` : T}
      ${Ta(this.ctx, a, "car")}
      <div class="group-actions">
        ${Da(e, this.prefix, "car", e("devices.group_add.car"))} ${Da(e, this.prefix, "wallbox", e("devices.group_add.wallbox"))}
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
b([A({ attribute: !1 })], rc.prototype, "device", void 0), b([A({ attribute: !1 })], rc.prototype, "sub", void 0), _("joe-car-group", rc);
//#endregion
//#region node_modules/lit-html/directives/repeat.js
var ic = (e, t, n) => {
	let r = /* @__PURE__ */ new Map();
	for (let i = t; i <= n; i++) r.set(e[i], i);
	return r;
}, ac = Vr(class extends Hr {
	constructor(e) {
		if (super(e), e.type !== Br.CHILD) throw Error("repeat() can only be used in text expressions");
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
		let i = Rr(e), { values: a, keys: o } = this.dt(t, n, r);
		if (!Array.isArray(i)) return this.ut = o, a;
		let s = this.ut ??= [], c = [], l, u, d = 0, f = i.length - 1, p = 0, m = a.length - 1;
		for (; d <= f && p <= m;) if (i[d] === null) d++;
		else if (i[f] === null) f--;
		else if (s[d] === o[p]) c[p] = Fr(i[d], a[p]), d++, p++;
		else if (s[f] === o[m]) c[m] = Fr(i[f], a[m]), f--, m--;
		else if (s[d] === o[m]) c[m] = Fr(i[d], a[m]), Pr(e, c[m + 1], i[d]), d++, m--;
		else if (s[f] === o[p]) c[p] = Fr(i[f], a[p]), Pr(e, i[d], i[f]), f--, p++;
		else if (l === void 0 && (l = ic(o, p, m), u = ic(s, d, f)), l.has(s[d])) {
			if (l.has(s[f])) {
				let t = u.get(o[p]), n = t === void 0 ? null : i[t];
				if (n === null) {
					let t = Pr(e, i[d]);
					Fr(t, a[p]), c[p] = t;
				} else c[p] = Fr(n, a[p]), Pr(e, i[d], n), i[t] = null;
				p++;
			} else zr(i[f]), f--;
		} else zr(i[d]), d++;
		for (; p <= m;) {
			let t = Pr(e, c[m + 1]);
			Fr(t, a[p]), c[p++] = t;
		}
		for (; d <= f;) {
			let e = i[d++];
			e !== null && zr(e);
		}
		return this.ut = o, Lr(e, c), ue;
	}
}), oc = 1435, sc = 1440;
function cc(e, t) {
	let n = (t ?? "").trim();
	return !n || /^profile?\s*\d+$/i.test(n) ? e : `${e} ${n}`;
}
var lc = {
	normal: "mdi:home-outline",
	holiday: "mdi:calendar-star",
	away: "mdi:home-export-outline",
	home_office: "mdi:laptop"
}, uc = {
	all: 1,
	week_weekend: 2,
	each: 7
};
function dc(e, t) {
	return e === "all" ? 0 : e === "week_weekend" ? t < 5 ? 0 : 1 : t;
}
function fc(e) {
	return `${String(Math.floor(e / 60)).padStart(2, "0")}:${String(e % 60).padStart(2, "0")}`;
}
function pc(e) {
	let t = /^(\d{1,2}):(\d{2})/.exec(e);
	if (!t) return null;
	let n = Number(t[1]), r = Number(t[2]);
	return n < 24 && r < 60 ? n * 60 + r : null;
}
function mc(e, t) {
	let n;
	for (let [r, i] of e) r <= t && (n = i);
	return n;
}
function hc(e) {
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
function gc(e, t, n, r) {
	let i = Math.round(e / t) * t;
	return Math.round(Math.min(r, Math.max(n, i)) * 10) / 10;
}
function _c(e, t) {
	let n = (e) => e.map(([e, t]) => [e, t]), r = (t) => n(e.curves[dc(e.split, t)] ?? e.curves[0]);
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
function vc(e) {
	let t = 0, n = -1;
	for (let r = 0; r < e.length; r++) {
		let i = e[r + 1]?.[0] ?? 1440;
		i - e[r][0] > n && (t = e[r][0], n = i - t);
	}
	if (n < 0) return null;
	let r = Math.min(oc, Math.round((t + n / 2) / 15) * 15);
	return r > t && !e.some(([e]) => e === r) ? r : null;
}
function yc(e) {
	if (e.length !== 6) return "count";
	let t = /* @__PURE__ */ new Set();
	for (let n of e) {
		for (let e of n.tags) {
			if (t.has(e)) return "tags";
			t.add(e);
		}
		if (n.curves.length !== uc[n.split]) return "curves";
		for (let e of n.curves) {
			if (!e.length || e.length > 12 || e[0][0] !== 0) return "points";
			for (let t = 1; t < e.length; t++) if (e[t][0] <= e[t - 1][0] || e[t][0] % 5) return "points";
		}
	}
	return null;
}
//#endregion
//#region src/components/week-bar.ts
var bc = class extends P {
	constructor(...e) {
		super(...e), this.points = [], this.mode = "heat", this.now = null, this.compact = !1, this.lang = "en", this.label = "", this.offText = "off";
	}
	static {
		this.styles = D`
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
		return j`<div class="track">
        <div class="bar" role="img" aria-label=${this.label}>
          ${t.map(({ from: e, to: t, value: n }) => {
			let r = `left:${e / sc * 100}%;width:${(t - e) / sc * 100}%;`;
			return n === "off" ? j`<span class="seg off" style=${r}>${this.compact ? T : this.offText}</span>` : j`<span class="seg" style=${r + this.color(n)}>
              ${this.compact ? T : `${s(this.lang, n, 1)}°`}
            </span>`;
		})}
        </div>
        ${this.now == null ? T : j`<span class="now" style=${`left:${this.now / sc * 100}%`}></span>`}
      </div>
      ${this.compact ? T : j`<div class="ticks" aria-hidden="true">
            ${[
			0,
			6,
			12,
			18,
			24
		].map((e) => j`<span style=${`left:${e / 24 * 100}%`}>${e}</span>`)}
          </div>`}`;
	}
	color(e) {
		let t = this.mode === "cool" ? (28 - e) / 10 : (e - 16) / 10, n = Math.round(25 + Math.min(1, Math.max(0, t)) * 75), r = this.mode === "cool" ? "cool" : "heat";
		return `background:color-mix(in srgb, var(--wk-${r}) ${n}%, var(--wk-${r}-weak));`;
	}
};
b([A({ attribute: !1 })], bc.prototype, "points", void 0), b([A()], bc.prototype, "mode", void 0), b([A({ attribute: !1 })], bc.prototype, "now", void 0), b([A({
	type: Boolean,
	reflect: !0
})], bc.prototype, "compact", void 0), b([A()], bc.prototype, "lang", void 0), b([A()], bc.prototype, "label", void 0), b([A()], bc.prototype, "offText", void 0), _("joe-week-bar", bc);
//#endregion
//#region src/editors/week-editor.ts
var xc = [
	"all",
	"week_weekend",
	"each"
], Sc = "23:00", Cc = "06:30", wc = {
	tab: "household",
	section: "days"
};
function Tc(e, t, n = "long") {
	return new Intl.DateTimeFormat(e, {
		weekday: n,
		timeZone: "UTC"
	}).format(new Date(Date.UTC(2024, 0, 1 + t)));
}
var Y = class extends P {
	constructor(...e) {
		super(...e), this.entityId = "", this.prefix = M, this.fetched = !1, this.failed = !1, this.drafts = {}, this.selected = {
			heat: 0,
			cool: 0
		}, this.open = 0, this.creating = !1, this.saving = !1, this.errors = {}, this.fitted = {}, this.loaded = !1, this.requested = !1;
	}
	static {
		this.styles = [x, D`
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
		this.hass && !this.requested && (this.requested = !0, this.load()), (e.has("config") || e.has("entityId")) && this.config && this.entityId && !this.loaded && (this.loaded = !0, this.drafts = structuredClone(this.room?.week?.modes ?? {}), this.fitDrafts(Wn), this.pickMode()), this.device && this.loaded && !this.mode && (this.fitDrafts(Wn), this.pickMode()), e.has("startMode") && this.mode && this.startMode && this.startMode !== this.mode && this.modes.includes(this.startMode) && this.showMode(this.startMode);
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
		this.fetched = !0, this.fitDrafts(Wn), this.pickMode();
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
					let a = gc(i, t, n, r);
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
		return Wn.filter((e) => this.device?.hvac_modes.includes(e));
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
		return hc(this.hass?.config?.time_zone);
	}
	openToday() {
		let e = this.profiles?.[this.index];
		this.open = e ? dc(e.split, this.now.weekday) : 0;
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
		if (!e || !this.config) return T;
		let r = j`<div class="sheet-title">${N(e("week.title"))}</div>`;
		if (!t) return j`${r}
        ${this.fetched ? j`<div class="note warn">
              <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e(this.failed ? "week.load_failed" : "week.device_missing")}</span>
            </div>` : j`<p class="field-hint">${e("week.loading")}</p>`}
        <div class="actions" data-notip>
          <button type="button" class="btn btn-secondary" @click=${this.close}>${e("mode.close")}</button>
        </div>`;
		let i = this.modes, a = this.mode, o = this.profiles;
		return j`${r}
      <div class="head">
        <b>${le(t.device_id, t.name, e("climate.open_device", { id: t.entity_id }))}</b>
        ${t.area ? j`<span class="chip">${t.area}</span>` : T}
      </div>
      ${i.length ? j`<div class="field" data-tipped>
            <div class="field-label">${e("week.modes")} ${n(e, "week_mode")}</div>
            <span class="seg" role="group" aria-label=${e("week.modes")}>
              ${i.map((t) => j`<button type="button" aria-pressed=${String(t === a)} @click=${() => this.setMode(t)}>
                  ${e(`week.mode.${t}`)}${this.errors[t] ? j`<span class="dot bad" title=${this.errors[t]}></span>` : this.isDirty(t) ? j`<span class="dot" title=${e("week.unsaved")}></span>` : T}
                </button>`)}
            </span>
          </div>` : j`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("week.no_modes")}</span></div>`}
      ${a ? o ? this.renderSet(e, a, o) : this.renderEmpty(e, a) : T}
      <div class="foot" data-notip>
        ${a && this.errors[a] ? j`<div class="note warn" role="alert">
              <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("week.save_failed", {
			mode: e(`week.mode.${a}`),
			error: this.errors[a]
		})}</span>
            </div>` : T}
        <div class="actions">
          <button
            type="button"
            class="btn btn-primary"
            ?disabled=${this.saving || !i.length}
            @pointerdown=${() => this.pressShown = this.rowError ?? null}
            @click=${this.save}
          >
            ${e(this.saving ? "week.saving" : "common.save")}
          </button>
          <button type="button" class="btn btn-ghost" @click=${this.close}>${e("common.cancel")}</button>
          ${i.some((e) => this.isDirty(e)) ? j`<span class="chip warn">${e("week.unsaved")}</span>` : T}
        </div>
      </div>`;
	}
	renderEmpty(e, t) {
		return j`<div class="empty" data-tipped>
      <p>${e("week.empty", { mode: e(`week.mode.${t}`) })}</p>
      <span class="with-tip">
        <button type="button" class="btn btn-primary" ?disabled=${this.creating} @click=${() => void this.create(t)}>
          ${e(this.creating ? "week.creating" : "week.create")}
        </button>
        ${n(e, "week_create")}
      </span>
    </div>`;
	}
	renderSet(e, t, r) {
		let i = this.status?.rooms?.[this.entityId], a = i?.kind === "week" && i.mode === t ? i.profile?.index : void 0, o = this.now, s = this.index, c = r[s];
		return j`<div class="field" data-tipped>
        <div class="field-label">${e("week.profiles")} ${n(e, "week_profiles")}</div>
        <div class="tiles" role="group" aria-label=${e("week.profiles")}>
          ${r.map((n, r) => {
			let i = n.name || e("week.profile", { n: r + 1 });
			return j`<button
              type="button"
              class="tile"
              aria-pressed=${String(r === s)}
              @click=${() => this.select(r)}
            >
              <span class="tile-top">
                <span class="no" aria-hidden="true">${r + 1}</span>
                <span class="name">${i}</span>
                ${r === a ? j`<span class="running" role="img" aria-label=${e("week.running")} title=${e("week.running")}></span>` : T}
              </span>
              <span class="tile-tags">
                ${n.tags.map((t) => j`<span><ha-icon icon=${lc[t]}></ha-icon>${e(`week.tag.${t}`)}</span>`)}
              </span>
              <joe-week-bar
                compact
                .points=${n.curves[dc(n.split, o.weekday)] ?? n.curves[0] ?? []}
                .now=${o.minute}
                mode=${t}
                lang=${e.lang}
                label=${e("week.curve", { label: `${i}, ${e("week.today")}` })}
              ></joe-week-bar>
            </button>`;
		})}
        </div>
        ${r.some((e) => e.tags.includes("normal")) ? T : j`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("week.no_normal")}</span></div>`}
      </div>
      ${c ? this.renderProfile(e, t, r, c) : T}`;
	}
	renderProfile(e, t, r, i) {
		let a = this.index, o = this.status?.day, s = !o || o.home_office_available, c = o?.home_office_reason ?? "no_calendar";
		return j`<div class="profile">
      <div class="field" data-tipped>
        <div class="field-label"><label for="week-name">${e("week.name")}</label> ${n(e, "week_name")}</div>
        <input
          id="week-name"
          class="input"
          type="text"
          maxlength="30"
          placeholder=${e("week.profile", { n: a + 1 })}
          .value=${i.name}
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
        <div class="field-label">${e("week.tags")} ${n(e, "week_tags")}</div>
        <div class="tags" role="group" aria-label=${e("week.tags")}>
          ${Un.map((t) => {
			let n = i.tags.includes(t), a = t === "home_office" && !s && !n;
			return j`<button
              type="button"
              class="mini-btn tag-btn"
              aria-pressed=${String(n)}
              ?disabled=${a}
              title=${a ? e(`week.ho.${c}`) : ""}
              @click=${() => this.toggleTag(r, t)}
            >
              <ha-icon icon=${lc[t]}></ha-icon>${e(`week.tag.${t}`)}
            </button>`;
		})}
        </div>
        ${s ? T : j`<p class="field-hint">${e(`week.ho.${c}`)}</p>
              <div>
                <a class="mini-btn quiet" href=${k(this.prefix, wc)} @click=${E(wc)}>
                  <ha-icon icon="mdi:calendar-text-outline"></ha-icon>${e("week.ho.rules")}
                </a>
              </div>`}
        ${i.tags.length ? T : j`<p class="field-hint">${e("week.untagged")}</p>`} ${this.noticeAt("tags")}
      </div>
      <div class="field" data-tipped>
        <div class="field-label">${e("week.days")} ${n(e, "week_split")}</div>
        <span class="seg full" role="group" aria-label=${e("week.days")}>
          ${xc.map((t) => j`<button type="button" aria-pressed=${String(i.split === t)} @click=${() => this.setSplit(t)}>
              ${e(`week.split.${t}`)}
            </button>`)}
        </span>
      </div>
      ${this.noticeAt("days")} ${this.renderGroups(e, t, i)}
    </div>`;
	}
	noticeAt(e) {
		return this.notice?.at === e ? j`<div class="note" role="status"><ha-icon icon="mdi:information-outline"></ha-icon><span>${this.notice.text}</span></div>` : T;
	}
	groupLabel(e, t, n) {
		return t === "all" ? e("week.group.all") : t === "week_weekend" ? e(n === 0 ? "week.group.weekdays" : "week.group.weekend") : Tc(e.lang, n);
	}
	renderGroups(e, t, r) {
		let i = this.now, a = dc(r.split, i.weekday), o = r.curves.length > 1, { step: c, min: l, max: u } = this.limits, d = this.room;
		return j`<div class="field" data-tipped>
      <div class="field-label">${e("week.points")} ${n(e, "week_points")}</div>
      <p class="field-hint">
        ${e("week.limits", {
			min: s(e.lang, l, 1),
			max: s(e.lang, u, 1),
			step: s(e.lang, c, 2)
		})}
      </p>
      ${this.fitted[t] ? j`<div class="note" role="status"><ha-icon icon="mdi:information-outline"></ha-icon><span>${e("week.fitted")}</span></div>` : T}
      ${d?.night_off ? j`<p class="field-hint">
            ${this.config?.climate?.night_by === "entity" ? e("week.night_entity", { until: d.night_until ?? Cc }) : e("week.night_time", {
			from: d.night_from ?? Sc,
			until: d.night_until ?? Cc
		})}
          </p>` : T}
      <div class="groups">
        ${r.curves.map((n, s) => {
			let d = this.groupLabel(e, r.split, s), f = !o || this.open === s, p = j`<span class="day-label">
              ${o ? j`<ha-icon icon=${f ? "mdi:chevron-down" : "mdi:chevron-right"}></ha-icon>` : T}${d}
              ${s === a ? j`<span class="chip ok">${e("week.today")}</span>` : T}
            </span>
            <joe-week-bar
              .points=${n}
              .now=${s === a ? i.minute : null}
              mode=${t}
              lang=${e.lang}
              offText=${e("week.off")}
              label=${e("week.curve", { label: d })}
            ></joe-week-bar>`;
			return j`<div class="group ${f ? "open" : ""}">
            ${o ? j`<button type="button" class="group-head" aria-expanded=${String(f)} @click=${() => this.openGroup(s)}>${p}</button>` : j`<div class="group-head">${p}</div>`}
            ${f ? this.renderPoints(e, r, s, n, {
				step: c,
				min: l,
				max: u
			}) : T}
          </div>`;
		})}
      </div>
    </div>`;
	}
	renderPoints(e, t, r, i, a) {
		let { step: o, min: c, max: l } = a, u = s(e.lang, o, 2), d = this.rowError?.curve === r ? this.rowError : void 0;
		return j`<div class="points" role="list" aria-label=${e("week.points")}>
        ${ac(i, ([e]) => e, ([t, n], i) => {
			let a = fc(t);
			return j`<div class="point" role="listitem">
              ${i === 0 ? j`<span class="time fixed" title=${e("week.point.first")}>00:00</span>` : j`<input
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
                ${n === "off" ? j`<span class="off-text">${e("week.off")}</span>` : j`<button
                        type="button"
                        class="mini-btn step"
                        aria-label=${e("week.point.less", { step: u })}
                        ?disabled=${n <= c}
                        @click=${() => this.setValue(r, i, n - o)}
                      >
                        −
                      </button>
                      <input
                        class="input num"
                        type="number"
                        inputmode="decimal"
                        step=${o}
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
                        @click=${() => this.setValue(r, i, n + o)}
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
              ${i === 0 ? j`<span class="del"></span>` : j`<button
                    type="button"
                    class="mini-btn quiet del"
                    aria-label=${e("week.point.delete", { time: a })}
                    title=${e("week.point.delete", { time: a })}
                    @click=${() => this.removePoint(r, i)}
                  >
                    <ha-icon icon="mdi:delete-outline"></ha-icon>
                  </button>`}
            </div>
            ${d?.point === i ? j`<p class="row-error" role="alert">${d.text}</p>` : T}`;
		})}
      </div>
      <div class="point-actions">
        <span class="with-tip" data-tipped>
          <button type="button" class="mini-btn" ?disabled=${i.length >= 12} @click=${() => this.addPoint(r)}>
            <ha-icon icon="mdi:plus"></ha-icon>${e("week.point.add")}
          </button>
          ${n(e, "week_add")}
        </span>
        ${t.curves.length > 1 ? this.renderCopy(e, t, r) : T}
      </div>
      ${i.length >= 12 ? j`<p class="field-hint">${e("week.point.max")}</p>` : T} ${this.noticeAt("points")}`;
	}
	renderCopy(e, t, r) {
		let i = t.split === "week_weekend" ? [{
			value: String(1 - r),
			label: e(r === 0 ? "week.group.weekend" : "week.group.weekdays")
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
			].filter((e) => e !== r).map((t) => ({
				value: String(t),
				label: Tc(e.lang, t)
			}))
		];
		return j`<span class="with-tip" data-tipped>
      <select
        class="input copy"
        aria-label=${e("week.copy")}
        @change=${(e) => {
			let t = e.target, n = i.find((e) => e.value === t.value);
			t.value = "", n && this.copyTo(r, n.value, n.label);
		}}
      >
        <option value="" selected disabled>${e("week.copy")}</option>
        ${i.map((e) => j`<option value=${e.value}>${e.label}</option>`)}
      </select>
      ${n(e, "week_copy")}
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
			a >= 0 && (n[a].tags = n[a].tags.filter((e) => e !== t)), e.tags = Un.filter((n) => n === t || e.tags.includes(n));
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
			t.curves = _c(t, e), t.split = e;
		});
		let i = uc[e] > uc[r] ? t("week.split.split") : r === "each" && e === "week_weekend" ? t("week.split.merged_days") : t("week.split.merged", { first: r === "each" ? Tc(t.lang, 0) : t("week.group.weekdays") });
		this.notice = {
			text: i,
			at: "days"
		}, this.open = dc(e, this.now.weekday);
	}
	setTime(e, t, n) {
		let r = this.t, i = this.profiles?.[this.index]?.curves[e];
		if (!i) return;
		let a = i[t][0], o = pc(n.value);
		if (o == null) {
			n.value = fc(a);
			return;
		}
		let s = Math.min(oc, Math.max(5, Math.round(o / 5) * 5));
		if (s === a) {
			n.value = fc(a);
			return;
		}
		if (i.some(([e], n) => n !== t && e === s)) {
			n.value = fc(a), this.rowError = {
				curve: e,
				point: t,
				text: r("week.point.duplicate", { time: fc(s) })
			};
			return;
		}
		n.value = fc(s), this.changeCurve(e, (e) => {
			e[t][0] = s;
		});
	}
	setValue(e, t, n) {
		let { step: r, min: i, max: a } = this.limits, o = gc(n, r, i, a);
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
			o = gc(Number(e ?? s ?? this.fallbackValue()), r, i, a);
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
		let r = vc(n);
		if (r == null) {
			this.notice = {
				text: t("week.point.no_room"),
				at: "points"
			};
			return;
		}
		let i = mc(n, r) ?? this.fallbackValue();
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
					[e]: Ec(t)
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
			let n = yc(this.drafts[t]);
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
			let n = Ec(t);
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
b([A({ attribute: !1 })], Y.prototype, "hass", void 0), b([A({ attribute: !1 })], Y.prototype, "t", void 0), b([A({ attribute: !1 })], Y.prototype, "config", void 0), b([A({ attribute: !1 })], Y.prototype, "status", void 0), b([A({ attribute: !1 })], Y.prototype, "entityId", void 0), b([A({ attribute: !1 })], Y.prototype, "found", void 0), b([A({ attribute: !1 })], Y.prototype, "prefix", void 0), b([A({ attribute: !1 })], Y.prototype, "startMode", void 0), b([C()], Y.prototype, "device", void 0), b([C()], Y.prototype, "fetched", void 0), b([C()], Y.prototype, "failed", void 0), b([C()], Y.prototype, "drafts", void 0), b([C()], Y.prototype, "mode", void 0), b([C()], Y.prototype, "selected", void 0), b([C()], Y.prototype, "open", void 0), b([C()], Y.prototype, "notice", void 0), b([C()], Y.prototype, "rowError", void 0), b([C()], Y.prototype, "creating", void 0), b([C()], Y.prototype, "saving", void 0), b([C()], Y.prototype, "errors", void 0), b([C()], Y.prototype, "fitted", void 0);
function Ec(e) {
	return String(e?.message ?? e);
}
_("joe-week-editor", Y);
//#endregion
//#region src/pages/devices/climate-view.ts
var Dc = {
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
function Oc(e, t) {
	let n = /^week_program_(\d+)$/.exec(e);
	return n ? Number(n[1]) : t + 1;
}
function kc(e) {
	return JSON.stringify(Object.keys(e).sort().map((t) => [
		t,
		e[t]?.name ?? "",
		e[t]?.tags ?? []
	]));
}
function Ac(e, t, n, r) {
	let i = {
		...Dc,
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
function jc(e, t, n) {
	let r = t[e.entity_id]?.meter, i = n?.suggested?.[e.entity_id]?.device_id;
	return e.hvac_modes.some((e) => [
		"cool",
		"dry",
		"fan_only",
		"heat_cool"
	].includes(e)) || r != null && r !== "none" || i != null && i === e.device_id;
}
function Mc(e) {
	return !!e?.meter && e.meter !== "none";
}
function Nc(e, t, n) {
	let r = e?.states[n]?.attributes, i = (e) => e == null || e === "" || !Number.isFinite(Number(e)) ? null : Number(e);
	return {
		current: i(r?.current_temperature ?? t?.current_temperature),
		target: i(r?.temperature ?? t?.temperature)
	};
}
function Pc(e, t) {
	let { current: n, target: r } = t;
	return n !== null && r !== null ? e("devices.card.climate", {
		current: s(e.lang, n, 1),
		target: s(e.lang, r, 1)
	}) : n === null ? void 0 : e("devices.card.temp", { value: s(e.lang, n, 1) });
}
function Fc(e, t, n, r) {
	if (!n?.kind || n.kind === "legacy") return;
	if (n.override?.reason === "off") return e("week.why.off_by_hand");
	let i = n.target;
	if (n.kind === "device") {
		let n = i?.preset;
		if (!i) return e("week.as_is");
		if (i.hvac === "off") return e("week.state_off");
		if (!n) return;
		let a = (t.week_presets ?? []).indexOf(n);
		return cc(e("week.profile", { n: Oc(n, Math.max(0, a)) }), r[n]?.name);
	}
	return n.profile?.index == null ? i ? i.hvac === "off" ? e("week.state_off") : void 0 : e("week.as_is") : cc(e("week.profile", { n: n.profile.index + 1 }), n.profile.name);
}
function Ic(e, t, n) {
	if (t?.why) return e.optional(`week.why.${t.why}`, { min: n }) ?? e.optional(`climate.why.${t.why}`);
}
function Lc(e, t, n) {
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
var Rc = {
	tab: "household",
	section: "days"
}, zc = {
	tab: "household",
	section: "night"
}, Bc = [
	"auto",
	"surplus",
	"cheap"
], X = class extends P {
	constructor(...e) {
		super(...e), this.prefix = M, this.devices = [], this.picking = !1, this.query = "", this.holdUntil = {}, this.pending = {}, this.moved = {}, this.weekError = {};
	}
	static {
		this.styles = [
			x,
			K,
			D`
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
			let e = this.state?.config.climate?.rooms ?? {}, t = Object.fromEntries(Object.entries(this.pending).filter(([t, n]) => kc(e[t]?.device_profiles ?? {}) !== kc(n)));
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
		if (!e || !t || !n) return T;
		if (n.unassigned && n.consumer) return this.renderUnassigned(e, t, n, n.consumer);
		let r = this.ctx, i = ya(r, n), a = Object.fromEntries((this.found?.devices ?? []).map((e) => [e.entity_id, e.name])), o = i.log ? {
			...i.log,
			names: a
		} : void 0, s = n.climate ?? this.found?.devices.find((e) => e.entity_id === n.id);
		if (!s) return wa(r, {
			...i,
			log: o
		});
		let c = s.entity_id, l = t.climate?.rooms?.[c], u = Ac(s, t.config.climate?.rooms?.[c], l, this.profilesOf(c)), d = t.climate?.rates?.[c];
		return j`${wa(r, {
			...i,
			live: Pc(e, Nc(this.hass, s, c)),
			why: this.renderWhy(e, s, u, l),
			head: this.renderHead(e, t, s, u, l),
			now: u.room.enabled ? this.renderNowSection(e, s, u, l) : void 0,
			steer: this.renderSteer(e, t, s, u, l),
			power: this.renderPower(e, t, n, s),
			learned: u.room.enabled || d ? j`<p class="learned-line">${nr(e, d)}</p>` : void 0,
			learnedArea: "climate",
			log: o,
			tips: { power: "climate_meter" }
		})}
    ${this.sub === "week" ? this.renderWeekSheet(e, t, s) : T}`;
	}
	nowShown(e, t) {
		if (!e.room.enabled || !t?.kind || t.kind === "legacy") return !1;
		if (e.cooling && !e.programs.length) return !!e.room.week?.enabled && e.sets.length > 0 && t.pending !== "start";
		let n = this.profilesOf(this.entry?.id ?? ""), r = e.programs.flatMap((e) => n[e]?.tags ?? []);
		return e.programs.length > 0 && r.length > 0 && t.kind === "device";
	}
	renderWhy(e, t, n, r) {
		if (!n.room.enabled) return e("climate.room.off");
		let i = n.cooling && !n.programs.length && n.room.week?.enabled && n.sets.length && r?.pending !== "start" && r?.kind === "legacy" ? j`<span class="week-now quiet">
            ${e("week.legacy_now", { state: this.hvacText(e, this.hass?.states[t.entity_id]?.state ?? t.state) })}
          </span>` : T, a = r && n.legacy ? e.optional(`climate.now.${r.why}`, { min: this.awayAfter }) ?? "" : "";
		return j`${this.nowShown(n, r) ? this.nowLine(e, t, r) : T} ${i}
    ${a ? j`<span class="week-now quiet">${a}</span>` : T}`;
	}
	nowLine(e, t, n) {
		let r = n.override;
		if (r?.reason === "off") return j`<span class="week-now"><ha-icon icon="mdi:power"></ha-icon><span>${e("week.override.off")}</span></span>`;
		if (r) {
			let t = r.reason === "preset" ? r.until ? e("week.override.preset", { time: r.until }) : e("week.override.preset_open") : r.until ? e("week.override.manual", { time: r.until }) : e("week.override.manual_open");
			return j`<span class="week-now"><ha-icon icon="mdi:hand-back-right-outline"></ha-icon><span>${t}</span></span>`;
		}
		let i = n.target, a = [];
		if (n.kind === "device") {
			let n = i?.preset;
			if (!i) a.push(e("week.as_is"));
			else if (i.hvac === "off") a.push(e("week.state_off"));
			else if (n) {
				let r = (t.week_presets ?? []).indexOf(n), i = e("week.profile", { n: Oc(n, Math.max(0, r)) });
				a.push(cc(i, this.profilesOf(t.entity_id)[n]?.name));
			}
		} else {
			if (a.push(i ? i.hvac === "off" ? e("week.state_off") : e(`week.mode.${n.mode === "heat" ? "heat" : "cool"}`) : e("week.as_is")), n.profile?.index != null) {
				let t = cc(e("week.profile", { n: n.profile.index + 1 }), n.profile.name);
				a.push(n.profile.held && n.why !== "held" ? `${t} (${e("week.held")})` : t);
			}
			i && i.hvac !== "off" && i.temperature != null && a.push(`${s(e.lang, i.temperature, 1)} °C`), n.next && a.push(e("week.next", {
				time: n.next.at,
				value: this.valueText(e, n.next.value)
			}));
		}
		let o = e.optional(`week.why.${n.why}`, { min: this.awayAfter });
		return j`<span class="week-now">
      <span>${e(n.would ? "week.would" : "week.now", { text: a.join(" · ") || "–" })}</span>
      ${o ? j`<span class="chip">${o}</span>` : T}
    </span>`;
	}
	valueText(e, t) {
		return t === "off" ? e("week.off") : `${s(e.lang, t, 1)} °C`;
	}
	renderHead(e, t, n, r, i) {
		let a = this.nowShown(r, i) ? this.weekError[n.entity_id] ?? i?.error : void 0, o = t.config.climate?.enabled;
		return j`<div class="head-extra">
      ${a ? j`<div class="note warn" role="alert">
            <ha-icon icon="mdi:alert-outline"></ha-icon>
            <span>${e.optional(`week.error.${a}`) ?? e("week.error", { error: a })}</span>
          </div>` : T}
      ${!o && r.room.enabled ? J(e, this.prefix, {
			label: e("climate.enabled"),
			value: e("climate.device.main_off"),
			to: {
				tab: "devices",
				section: "climate"
			}
		}) : T}
      <details class="ent" data-notip><summary>${e("climate.entity")}</summary><code>${n.entity_id}</code></details>
    </div>`;
	}
	renderNowSection(e, t, r, i) {
		let a = this.nowShown(r, i) && i?.override && i.override.reason !== "off", o = r.cooling && !r.programs.length && !!r.room.week?.enabled && r.sets.length > 0;
		if (a || o) return j`${a ? j`<div class="row" data-tipped>
          <span>${e("week.why.override")}</span>
          <button type="button" class="btn btn-secondary" @click=${() => void this.resume(t)}>${e("week.resume")}</button>
          ${n(e, "week_resume")}
        </div>` : T}
    ${o ? this.renderHold(e, t, r.room, r.sets, i) : T}`;
	}
	renderHold(e, t, r, i, a) {
		let o = t.entity_id, s = a?.mode ?? this.hass?.states[o]?.state ?? t.state, c = r.week?.modes?.[s === "heat" ? "heat" : "cool"] ?? i[0], l = a?.hold ?? null, u = l && l.mode === s ? l : null, d = u ? u.profile : null, f = u ? u.until ? "midnight" : "forever" : this.holdUntil[o] ?? "midnight", p = (t) => cc(e("week.profile", { n: t.profile + 1 }), r.week?.modes?.[t.mode]?.[t.profile]?.name), m = a?.want, h = u && (m === "night" || m === "away") ? m : null;
		return j`<div data-tipped>
      <div class="row">
        <span>${e("week.hold")}</span>
        ${n(e, "week_hold")}
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
          ${c.map((t, n) => j`<option value=${String(n)} ?selected=${d === n}>${cc(e("week.profile", { n: n + 1 }), t.name)}</option>`)}
        </select>
        <span class="seg" role="group" aria-label=${e("week.hold.until")}>
          ${["midnight", "forever"].map((n) => j`<button
              type="button"
              aria-pressed=${String(f === n)}
              @click=${() => {
			u ? n !== f && this.hold(t, u.profile, n) : this.holdUntil = {
				...this.holdUntil,
				[o]: n
			};
		}}
            >
              ${e(`week.hold.${n}`)}
            </button>`)}
        </span>
      </div>
      ${h && u ? j`<p class="hint">${e(`week.hold.later_${h}`, { profile: p(u) })}</p>` : T}
      ${l && !u ? j`<div class="note" role="status">
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
          </div>` : T}
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
	renderSteer(e, t, r, i, a) {
		let { room: o, cooling: s, presets: c, programs: l, sets: u, deviceRuns: d, legacy: f, awayTagged: p, awayWays: m, away: h } = i;
		return j`<div class="row" data-tipped>
        <span>${e("climate.room.steer")}</span>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(o.enabled)}
          aria-label=${e("climate.room.enabled", { name: r.name })}
          @click=${() => this.save(r, { enabled: !o.enabled })}
        ></button>
        ${n(e, "climate_room")}
      </div>
      ${o.enabled ? j`${s && !l.length ? this.renderWeek(e, r, o, u, a) : T}
          ${l.length ? this.renderPrograms(e, r, l, a) : T}
          ${!p || f ? j`<div class="row" data-tipped>
                  <span>${e("climate.away")}</span>
                  <span class="seg" role="group" aria-label=${e("climate.away")}>
                    ${m.map((t) => j`<button type="button" aria-pressed=${String(h === t)} @click=${() => this.save(r, { away: t })}>
                        ${e(d && t === "setback" ? "devprof.away_keep" : `climate.away.${t}`)}
                      </button>`)}
                  </span>
                  ${n(e, f ? "climate_away" : d ? "devprof_away" : "week_away")}
                </div>
                ${f ? T : j`<p class="hint">${e("week.away_fallback")}</p>`}
                ${h === "setback" && !d ? j`<div class="row" data-tipped>
                      <span>${e(s && r.state === "cool" ? "climate.setback.cool" : "climate.setback.heat")}</span>
                      <input
                        class="input short"
                        type="number"
                        min="0.5"
                        max="10"
                        step="0.5"
                        aria-label=${e("climate.setback.heat")}
                        .value=${String(o.setback_k)}
                        @change=${(e) => {
			let t = Number.parseFloat(e.target.value.replace(",", "."));
			Number.isFinite(t) && this.save(r, { setback_k: Math.min(10, Math.max(.5, t)) });
		}}
                      />
                      <span>°C</span>
                      ${n(e, f ? "climate_away" : "week_away")}
                    </div>` : T}
                ${f && o.away === "preset" ? j`<div data-tipped>
                      ${this.presetRow(e, r, c, "away_preset", o.away_preset, "climate.away_preset")}
                    </div>` : T}` : T}
          ${f && c.length ? j`<div data-tipped>
                ${this.presetRow(e, r, c, "free_day_preset", o.free_day_preset, "climate.free_day_preset", !0)}
              </div>` : T}
          ${s ? this.renderNight(e, t, r, o) : T}` : T}`;
	}
	daysLink(e) {
		return j`<a class="mini-btn quiet" href=${k(this.prefix, Rc)} @click=${E(Rc)}>
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
	renderWeek(e, t, r, i, a) {
		let o = !!r.week?.enabled, s = this.weekRoute(t);
		return j`<div class="sub" data-tipped>
      <div class="row">
        <span class="sub-title">${e("week.row")}</span>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(o)}
          aria-label=${e("week.row")}
          @click=${() => this.save(t, { week: { enabled: !o } })}
        ></button>
        ${n(e, "climate_week")}
      </div>
      ${a?.pending ? j`<p class="hint">${e(a.pending === "start" ? "week.pending.start" : "week.pending.end")}</p>` : T}
      ${o ? j`${i.length ? T : j`<p class="hint">${e("week.no_sets")}</p>`}
            <div class="row">
              <a class="btn btn-secondary" href=${k(this.prefix, s)} @click=${E(s, { sheet: !0 })}>
                <ha-icon icon="mdi:calendar-clock"></ha-icon>${e("week.edit")}
              </a>
            </div>` : T}
    </div>`;
	}
	renderPrograms(e, t, r, i) {
		let a = this.profilesOf(t.entity_id), o = r.flatMap((e) => a[e]?.tags ?? []), s = this.state?.climate?.day, c = !s || s.home_office_available, l = s?.home_office_reason ?? "no_calendar", u = this.hass?.states[t.entity_id]?.state ?? t.state;
		return j`<div class="sub" data-tipped>
      <div class="row">
        <span class="sub-title">${e("devprof.title")}</span>
        ${n(e, "climate_device_profiles")}
      </div>
      ${i?.pending ? j`<p class="hint">${e(i.pending === "start" ? "devprof.pending.start" : "devprof.pending.end")}</p>` : T}
      ${r.map((n, i) => {
			let o = a[n] ?? {
				name: "",
				tags: []
			}, s = e("week.profile", { n: Oc(n, i) });
			return j`<div class="preset">
          <div class="preset-name">
            <input
              class="input"
              type="text"
              maxlength="30"
              placeholder=${s}
              aria-label=${e("devprof.name", { preset: s })}
              .value=${o.name}
              @change=${(e) => this.savePrograms(t, r, n, { name: e.target.value.trim().slice(0, 30) })}
            />
            <code>${n}</code>
          </div>
          <div class="tags" role="group" aria-label=${e("devprof.tags", { preset: s })}>
            ${Un.map((i) => {
				let a = o.tags.includes(i), s = i === "home_office" && !c && !a;
				return j`<button
                type="button"
                class="mini-btn tag-btn"
                aria-pressed=${String(a)}
                ?disabled=${s}
                title=${s ? e(`week.ho.${l}`) : ""}
                @click=${() => this.toggleProgramTag(e, t, r, n, i)}
              >
                <ha-icon icon=${lc[i]}></ha-icon>${e(`week.tag.${i}`)}
              </button>`;
			})}
          </div>
        </div>`;
		})}
      ${this.moved[t.entity_id] ? j`<div class="note" role="status"><ha-icon icon="mdi:information-outline"></ha-icon><span>${this.moved[t.entity_id]}</span></div>` : T}
      ${o.length && !o.includes("normal") ? j`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("devprof.need_normal")}</span></div>` : T}
      ${i?.why === "manual_mode" ? j`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("devprof.not_auto", { state: this.hvacText(e, u) })}</span>
          </div>` : T}
      ${c ? T : j`<p class="hint">${e(`week.ho.${l}`)}</p>
            <div class="row">${this.daysLink(e)}</div>`}
    </div>`;
	}
	toggleProgramTag(e, t, n, r, i) {
		let a = this.profilesOf(t.entity_id), o = (a[r]?.tags ?? []).includes(i), s = o ? void 0 : n.find((e) => e !== r && a[e]?.tags.includes(i)), c = (t) => a[t]?.name || e("week.profile", { n: Oc(t, n.indexOf(t)) });
		this.moved = {
			...this.moved,
			[t.entity_id]: s ? e("devprof.moved", {
				tag: e(`week.tag.${i}`),
				to: c(r),
				from: c(s)
			}) : ""
		};
		let l = o ? a[r].tags.filter((e) => e !== i) : Un.filter((e) => e === i || a[r]?.tags.includes(e));
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
		kc(o) !== kc(a) && (this.pending = {
			...this.pending,
			[i]: o
		}, L(this, { climate: { rooms: { [i]: { device_profiles: o } } } }).then((e) => {
			if (!e && this.pending[i] === o) {
				let { [i]: e, ...t } = this.pending;
				this.pending = t;
			}
		}));
	}
	presetRow(e, t, r, i, a, o, s = !1) {
		return j`<div class="row">
      <span>${e(o)}</span>
      <select
        class="input"
        aria-label=${e(o)}
        @change=${(e) => this.save(t, { [i]: e.target.value || null })}
      >
        ${s ? j`<option value="" ?selected=${!a}>${e("climate.no_preset")}</option>` : T}
        ${!s && !a ? j`<option value="" selected disabled>${e("climate.pick_preset")}</option>` : T}
        ${r.map((e) => j`<option value=${e} ?selected=${e === a}>${e}</option>`)}
      </select>
      ${n(e, s ? "climate_free_day" : "climate_away")}
    </div>`;
	}
	renderNight(e, t, r, i) {
		let a = (t, n) => j`<input
      class="input short"
      type="time"
      aria-label=${e(`climate.${t}`)}
      .value=${n}
      @change=${(e) => {
			let n = e.target.value;
			/^\d{1,2}:\d{2}$/.test(n) && this.save(r, { [t]: n });
		}}
    />`, o = Lc(e, this.hass, t);
		return j`<div class="sub" data-tipped>
      <div class="row">
        <span class="sub-title">${e("climate.night_off")}</span>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(i.night_off)}
          aria-label=${e("climate.night_off")}
          @click=${() => this.save(r, { night_off: !i.night_off })}
        ></button>
        ${n(e, "climate_night")}
      </div>
      ${i.night_off ? t.config.climate?.night_by === "entity" ? j`<div class="row">
              <span>${e("climate.night_back")}</span>
              ${a("night_until", i.night_until)}
            </div>` : j`<div class="row">
              <span>${e("climate.night_span")}</span>
              ${a("night_from", i.night_from)} – ${a("night_until", i.night_until)}
            </div>` : T}
      <div class="night-mirror">
        ${J(e, this.prefix, {
			label: e("climate.mirror.night"),
			value: o.text,
			to: zc,
			action: o.set ? "change" : "set"
		})}
      </div>
    </div>`;
	}
	save(e, t) {
		L(this, { climate: { rooms: { [e.entity_id]: t } } });
	}
	renderPower(e, t, n, r) {
		let i = t.config.climate?.rooms ?? {}, a = (this.found?.devices ?? []).filter((e) => jc(e, i, this.found)), o = a.some((e) => e.entity_id === r.entity_id), s = this.movedNote(e);
		if (o || n.consumer || s) return j`${o ? j`<p class="hint">${e("climate.meters.say")}</p>
          ${(this.found?.meters ?? []).length ? T : j`<p class="hint">${e("climate.meter.no_meters")}</p>`}
          ${this.meterLine(e, r, a, i)}` : T}
    ${n.consumer ? this.consumerRows(e, n.consumer) : T} ${s}`;
	}
	meterLine(e, t, n, r) {
		let i = r[t.entity_id]?.meter ?? null, a = i && i !== "none" ? i : null, o = i == null ? this.found?.suggested?.[t.entity_id] : void 0, s = a ? n.filter((e) => e.entity_id !== t.entity_id && this.sameMeter(r[e.entity_id]?.meter, a)) : [], c = a?.power ? this.hass?.states[a.power] : void 0, l = a ? this.option(a) ?? null : o ?? null;
		return j`<div class="meter">
      <div class="meter-pick">
        ${this.picking ? this.meterSearch(e, t) : j`<span class="picked-row">
              <span class="picked">
                ${l ? j`<b>${le(l.device_id, `${l.name ?? l.device_id}${l.sensor ? ` · ${l.sensor}` : ""}`, e("climate.open_meter"))}</b>
                      ${l.via ? j`<small class="via">${l.via}</small>` : T}
                      ${l.area ? j`<small>${l.area}</small>` : T}` : a ? j`<b>${le(a.device_id, a.power ?? a.energy ?? a.device_id, e("climate.open_meter"))}</b>` : j`<small>${e(i === "none" ? "climate.meter.without_long" : "climate.meter.open_long")}</small>`}
              </span>
              ${l ? vi(e, this.meterTarget(l)) : a ? vi(e, this.meterTarget(a)) : T}
            </span>`}
      </div>
      ${this.picking ? T : j`<div class="state">
            ${a ? j`<span class="chip ok">${c ? this.reading(e, c) : e("climate.meter.linked")}</span>
                  <button type="button" class="mini-btn" @click=${() => this.startPicking()}>${e("climate.meter.change")}</button>` : o ? j`<button type="button" class="btn btn-secondary" @click=${() => this.save(t, { meter: this.meterOf(o) })}>
                      ${e("climate.meter.confirm")}
                    </button>
                    <button type="button" class="mini-btn" @click=${() => this.startPicking()}>${e("climate.meter.other_short")}</button>` : j`<button type="button" class="mini-btn" @click=${() => this.startPicking()}>${e("climate.meter.search")}</button>`}
          </div>`}
      ${a?.power || a?.energy ? j`<details class="ent">
            <summary>${e("climate.entities")}</summary>
            ${a.power ? j`<code>${a.power}</code>` : T}
            ${a.energy ? j`<code>${a.energy}</code>` : T}
          </details>` : T}
      ${s.length ? j`<p class="hint">${e("climate.meter.shared", { names: s.map((e) => e.name).join(", ") })}</p>` : T}
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
		return j`<input
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
        ${r.map((n) => j`<div class="hit-row">
            <button type="button" role="option" class="hit" @click=${() => this.pickMeter(t, this.key(n))}>
              <b>${n.name ?? n.device_id}${n.sensor ? ` · ${n.sensor}` : ""}</b>
              <small>${[
			n.via,
			n.area,
			n.power ? this.readingOf(e, n.power) : ""
		].filter(Boolean).join(" · ")}</small>
            </button>
            ${vi(e, this.meterTarget(n))}
          </div>`)}
        ${r.length ? T : j`<small class="none">${e("climate.meter.no_hits")}</small>`}
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
		return `${t.state !== "" && Number.isFinite(n) ? s(e.lang, n, n % 1 ? 1 : 0) : t.state} ${String(t.attributes.unit_of_measurement ?? "")}`.trim();
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
		let r = t.power_entity ? this.readingOf(e, t.power_entity) : "", i = t.runs ?? "auto";
		return j`<div class="consumer">
      <div class="consumer-name">
        <span>${e("climate.consumer")}</span><b>${t.name}</b>${r ? j`<span>${r}</span>` : T}
      </div>
      <div class="row" data-tipped>
        <span>${e("consumers.kind")}</span>
        <select
          class="input"
          aria-label=${e("consumers.kind_of", { name: t.name })}
          .value=${t.kind}
          @change=${(e) => this.setKind(t, e.target.value)}
        >
          ${Bn.map((n) => j`<option value=${n} ?selected=${n === t.kind}>${e(`kind.${n}`)}</option>`)}
        </select>
        ${n(e, "f_consumer_kind")}
      </div>
      ${t.kind === "submeter" ? T : j`<div class="row" data-tipped>
            <span>${e("consumers.runs")}</span>
            <select
              class="input"
              aria-label=${e("consumers.runs_of", { name: t.name })}
              .value=${i}
              @change=${(e) => this.setRuns(t, e.target.value)}
            >
              ${Bc.map((t) => j`<option value=${t} ?selected=${t === i}>${e(`runs.${t}`)}</option>`)}
            </select>
            ${n(e, "f_consumer_runs")}
          </div>`}
    </div>`;
	}
	setKind(e, t) {
		t !== e.kind && (this.kindChanged = e.id, L(this, { consumers: { [e.id]: { kind: t } } }));
	}
	setRuns(e, t) {
		t !== (e.runs ?? "auto") && L(this, { consumers: { [e.id]: { runs: t } } });
	}
	movedNote(e) {
		let t = this.kindChanged, n = t ? this.devices.find((e) => e.group !== "climate" && (e.consumer?.id === t || e.id === t)) : void 0;
		if (!n) return;
		let r = z(n);
		return j`<div class="note" role="status">
      <ha-icon icon="mdi:information-outline"></ha-icon>
      <a class="mini-btn go" href=${k(this.prefix, r)} @click=${E(r)}
        >${e("climate.moved", {
			name: n.name,
			group: e(`nav.devices.${n.group}`)
		})}</a
      >
    </div>`;
	}
	renderUnassigned(e, t, r, i) {
		let a = this.ctx, o = this.found?.devices ?? [], s = t.config.climate?.rooms ?? {}, c = i.power_entity ? this.readingOf(e, i.power_entity) : "", l = r.deviceId && o.length ? j`<div class="row" data-tipped>
            <span>${e("climate.assign")}</span>
            <select
              class="input"
              aria-label=${e("climate.assign")}
              @change=${(e) => {
			let t = e.target.value;
			t && this.assign(r, i, t);
		}}
            >
              <option value="" selected disabled>${e("climate.assign.pick")}</option>
              ${o.map((t) => j`<option value=${t.entity_id}>
                  ${Mc(s[t.entity_id]) ? e("climate.assign.has_meter", { name: t.name }) : t.name}${t.area ? ` · ${t.area}` : ""}
                </option>`)}
            </select>
            ${n(e, "climate_assign")}
          </div>` : j`<p class="hint">${e(r.deviceId ? "climate.assign.no_climate" : "climate.assign.no_device")}</p>`;
		return wa(a, {
			...ya(a, r),
			live: c || void 0,
			why: e("climate.unassigned.lead"),
			power: j`${l} ${this.consumerRows(e, i)} ${this.movedNote(e) ?? T}`
		});
	}
	async assign(e, t, n) {
		if (!e.deviceId) return;
		let r = {
			device_id: e.deviceId,
			power: t.power_entity,
			energy: t.energy_entity
		};
		await L(this, { climate: { rooms: { [n]: { meter: r } } } }) && w(this, {
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
		}, i = this.route?.rest?.[0], a = Wn.find((e) => e === i);
		return j`<joe-sheet label=${e("week.label")} closeLabel=${e("common.close")} wide @joe-close=${() => Ee(this, r)}>
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
b([A({ attribute: !1 })], X.prototype, "hass", void 0), b([A({ attribute: !1 })], X.prototype, "t", void 0), b([A({ attribute: !1 })], X.prototype, "state", void 0), b([A({ attribute: !1 })], X.prototype, "route", void 0), b([A({ attribute: !1 })], X.prototype, "prefix", void 0), b([A({ attribute: !1 })], X.prototype, "found", void 0), b([A({ attribute: !1 })], X.prototype, "devices", void 0), b([A({ attribute: !1 })], X.prototype, "entry", void 0), b([A({ attribute: !1 })], X.prototype, "sub", void 0), b([C()], X.prototype, "picking", void 0), b([C()], X.prototype, "query", void 0), b([C()], X.prototype, "holdUntil", void 0), b([C()], X.prototype, "pending", void 0), b([C()], X.prototype, "moved", void 0), b([C()], X.prototype, "weekError", void 0), b([C()], X.prototype, "kindChanged", void 0), _("joe-climate-device", X);
//#endregion
//#region src/pages/devices/climate.ts
var Vc = {
	tab: "household",
	section: "days"
}, Hc = class extends q {
	constructor(...e) {
		super(...e), this.failed = !1, this.list = [];
	}
	static {
		this.styles = [
			x,
			K,
			D`
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
		].some((t) => e.has(t)) && (this.list = !this.climateFound && this.own && this.t && this.state ? mt(this.t, this.state, this.hass, {
			climateFound: this.own,
			discovery: this.discovery,
			checks: this.checks
		}) : this.devices);
	}
	render() {
		let { t: e, state: t } = this;
		if (!e || !t) return T;
		let r = this.entity ? gt(this.list, "climate", this.entity) : void 0;
		if (r) return j`<joe-climate-device
        .t=${e}
        .hass=${this.hass}
        .state=${t}
        .prefix=${this.prefix}
        .route=${this.route}
        .found=${this.found}
        .devices=${this.list}
        .entry=${r}
        .sub=${this.sub}
      ></joe-climate-device>`;
		let i = t.config.climate ?? {
			enabled: !1,
			rooms: {}
		}, a = this.found, o = this.list.filter((e) => e.group === "climate" && !e.unassigned), s = this.list.filter((e) => e.group === "climate" && e.unassigned), c = [...new Set(o.map((t) => t.area ?? e("climate.no_area")))], l = (a?.devices ?? []).filter((e) => jc(e, i.rooms ?? {}, a)), u = l.filter((e) => Mc(i.rooms?.[e.entity_id]) || o.some((t) => t.id === e.entity_id && t.consumer)).length;
		return j`<div class="wrap">
      <div class="intro">
        <div>
          ${N(e("climate.title"))} ${S}
          <p class="lead">${e("climate.lead")}</p>
          ${o.length ? j`<p class="with-tip" data-tipped>${e("climate.ha_open")} ${n(e, "ha_open")}</p>` : T}
        </div>
        <joe-pose name="relax"></joe-pose>
      </div>
      ${this.entity === void 0 ? T : this.renderLost(e)} ${this.renderMain(e, t, i.enabled)}
      ${this.renderHousehold(e, t)}
      ${this.failed && !a ? j`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("climate.failed")}</span></div>` : T}
      ${a && !a.devices.length ? j`<p class="hint">${e("climate.none")}</p>` : T}
      ${o.length ? j`<div class="list-head">
            <h3 class="group-label">${e("climate.list")}</h3>
            ${l.length ? j`<span class="chip">${e("climate.meters.count", {
			linked: u,
			all: l.length
		})}</span>` : T}
          </div>` : T}
      ${c.map((n) => j`<div class="group-label area">${n}</div>
          <div class="dcards">
            ${o.filter((t) => (t.area ?? e("climate.no_area")) === n).map((n) => this.renderCard(e, t, n))}
          </div>`)}
      ${s.length ? j`<div class="group-head list-head">
              <span class="group-label">${e("devices.unassigned")}</span><i class="dcard-dot" aria-hidden="true"></i>
            </div>
            <p class="unassigned-text">${e("devices.unassigned.text")}</p>
            <div class="dcards">
              ${s.map((n) => yi(e, this.prefix, Ci(e, this.hass, t, n)))}
            </div>` : T}
    </div>`;
	}
	renderLost(e) {
		let t = this.entity, n = this.list.find((e) => e.group !== "climate" && (e.id === t || e.consumer?.id === t));
		if (!n) return _a(e);
		let r = z(n);
		return j`<div class="note" role="status">
      <ha-icon icon="mdi:information-outline"></ha-icon>
      <a class="mini-btn go" href=${k(this.prefix, r)} @click=${E(r, { replace: !0 })}
        >${e("climate.moved", {
			name: n.name,
			group: e(`nav.devices.${n.group}`)
		})}</a
      >
    </div>`;
	}
	renderCard(e, t, n) {
		let r = n.climate, i = t.climate?.rooms?.[n.id], a = t.config.climate?.rooms?.[n.id], o = Pc(e, Nc(this.hass, r, n.id)), s = r && a?.enabled ? Fc(e, r, i, a.device_profiles ?? {}) : void 0, c = a?.enabled ? Ic(e, i, t.config.climate?.away_after_min ?? 15) : void 0, l = Mc(a) || n.consumer, u = j`${o ? j`<span class="cl">${o}</span>` : T}
      ${s ? j`<span class="cl">${s}</span>` : T}
      ${c || l ? j`<span class="cl chips">
            ${c ? j`<span class="chip">${c}</span>` : T}
            ${l ? j`<span class="chip ok">${e("climate.card.measured")}</span>` : T}
          </span>` : T}`;
		return yi(e, this.prefix, Ci(e, this.hass, t, n, {
			state: u,
			area: void 0
		}));
	}
	renderHousehold(e, t) {
		let n = t.config.context.presence_entity ?? null, r = n ? this.hass?.states[n]?.attributes.friendly_name ?? n : null, i = t.climate?.day, a = i ? i.holiday ? "holiday" : i.weekend && i.free ? "weekend" : "workday" : null, o = a ? [e(`climate.mirror.today.${a}`), i?.home_office_available && i.home_office.length ? e("climate.mirror.today.ho", { names: i.home_office.join(", ") }) : ""].filter(Boolean).join(", ") : e("climate.mirror.unknown"), s = Lc(e, this.hass, t);
		return j`<section class="card household">
      ${J(e, this.prefix, {
			label: e("climate.mirror.presence"),
			value: r ? j`<span title=${n ?? ""}>${r}</span>` : e("climate.mirror.presence.none"),
			to: {
				tab: "household",
				section: "presence"
			},
			action: r ? "change" : "set"
		})}
      ${J(e, this.prefix, {
			label: e("climate.mirror.today"),
			value: o,
			to: Vc
		})}
      ${J(e, this.prefix, {
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
	renderMain(e, t, r) {
		return j`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:thermostat-auto"></ha-icon>${e("climate.enabled")}</div>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(r)}
          aria-label=${e("climate.enabled")}
          @click=${() => L(this, { climate: { enabled: !r } })}
        ></button>
        ${n(e, "climate_enabled")}
      </div>
      <p class="hint">${e(t.mode === "live" ? "climate.live" : "climate.not_live")}</p>
    </section>`;
	}
};
b([A({ attribute: !1 })], Hc.prototype, "entity", void 0), b([A({ attribute: !1 })], Hc.prototype, "sub", void 0), b([C()], Hc.prototype, "own", void 0), b([C()], Hc.prototype, "failed", void 0), _("joe-climate-group", Hc);
//#endregion
//#region src/components/finding-rows.ts
var Uc = D`
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
function Z(e, t, n, r = !1) {
	return j`<button type="button" class="mini-btn ${r ? "quiet" : ""}" @click=${n}>
    ${t ? j`<ha-icon icon=${t}></ha-icon>` : T}${e}
  </button>`;
}
function Wc(e) {
	return j`<div class="note"><ha-icon icon="mdi:information-outline"></ha-icon><span>${e}</span></div>`;
}
function Gc(e, t) {
	let r = t.aside && t.aside !== T;
	return j`<li class="item ${t.state ?? ""} ${r ? "has-aside" : ""}" ?data-tipped=${!!(t.actions?.length && t.tip)}>
    <span class="ico-box"><ha-icon icon=${t.icon}></ha-icon></span>
    <div class="text">
      <div class="head">
        <span class="t">${t.title}</span>
        ${t.chips?.length ? j`<span class="chips">${t.chips}</span>` : T}
      </div>
      <div class="d">${t.detail}</div>
      ${t.reasons?.length ? j`<details data-notip>
            <summary>${e("scan.why")}</summary>
            <ul>
              ${t.reasons.map((t) => j`<li>${Te(e, t)}</li>`)}
            </ul>
          </details>` : T}
      ${t.notes ?? T}
      ${t.actions?.length ? j`<div class="row-actions">${t.actions}${t.tip ? n(e, t.tip) : T}</div>` : T}
    </div>
    ${r ? j`<span class="row-aside">${t.aside}</span>` : T}
  </li>`;
}
function Kc(e, t) {
	return j`<ul class="found">
    ${t.map((t) => Gc(e, t))}
  </ul>`;
}
var qc = {
	weather: "weather_entity",
	holiday: "holiday_entity"
};
function Jc(t, n, r, i, a, o, s) {
	let l = qc[o], u = i.context[l], d = a?.[o] ?? null, f = {
		key: o,
		icon: o === "weather" ? "mdi:weather-partly-cloudy" : "mdi:calendar-star",
		title: r(o === "weather" ? "find.weather" : "find.holiday"),
		tip: o === "weather" ? "review_weather" : "review_holiday"
	}, p = () => void Yc(t, r, i, a, o);
	if (u) {
		let a = d?.entity.entity_id === u;
		return {
			...f,
			detail: c(n, u),
			chips: [O(r, F(i, `context.${l}`)), ...d && a ? [e(r, d.confidence)] : []],
			reasons: a ? d?.reasons : void 0,
			aside: s?.(u),
			actions: [Z(r("review.change"), "mdi:magnify", p), Z(r("review.ignore"), "", () => L(t, {
				context: { [l]: null },
				answers: { ignored: Qe(i, o, !0) }
			}), !0)]
		};
	}
	return I(i, o) ? {
		...f,
		detail: r("review.ignored"),
		state: "ignored",
		actions: [Z(r("review.use"), "mdi:undo-variant", p)]
	} : {
		...f,
		detail: r("find.none"),
		state: "missing",
		notes: [Wc(r(o === "weather" ? "review.weather.none" : "review.holiday.none"))],
		actions: [Z(r("review.choose"), "mdi:magnify", p)]
	};
}
async function Yc(e, t, n, r, i) {
	let a = qc[i], o = r?.[i], s = n.context[a], c = (await R(e, {
		heading: t(i === "weather" ? "pick.weather.title" : "pick.holiday.title"),
		tip: i === "weather" ? "pick_weather" : "pick_holiday",
		filter: i === "weather" ? "weather" : "workday",
		selected: s ? [s] : o ? [o.entity.entity_id] : [],
		suggestions: $e(o ? [et(o)] : [], o?.alternatives)
	}))?.selected[0];
	c && L(e, {
		context: { [a]: c },
		answers: { ignored: Qe(n, i, !1) }
	});
}
function Q(e, t, n) {
	let [r, i] = e(n).split("|");
	return `${s(e.lang, t, 0)} ${t === 1 ? r : i}`;
}
function Xc(e, t, n = []) {
	return j`<div class="note ${t.level}">
    <ha-icon icon=${t.level === "warn" ? "mdi:alert-outline" : "mdi:information-outline"}></ha-icon>
    <div>
      <span>${Ye(e, t)}</span>
      ${n.length ? j`<div class="note-actions">${n}</div>` : T}
    </div>
  </div>`;
}
function Zc(e, t, n, r) {
	L(e, {
		...r,
		answers: { ignored: Qe(t, n, !0) }
	});
}
function Qc(e, t, n) {
	L(e, { answers: { confirmed: [...t.answers.confirmed.filter((e) => e !== n), n] } });
}
function $c(e) {
	let { t } = e, n = e.discovery?.energy_dashboard;
	return n?.configured ? {
		key: "energy",
		icon: "mdi:lightning-bolt",
		title: t("find.energy"),
		detail: t("find.energy.detail", {
			grid: Q(t, n.grid ?? 0, "word.grid"),
			solar: Q(t, n.solar ?? 0, "word.solar"),
			battery: Q(t, n.battery ?? 0, "word.battery"),
			devices: Q(t, n.devices ?? 0, "word.device")
		}),
		chips: [O(t, { source: "read" })]
	} : null;
}
function el(t, n = {}) {
	let { t: r, config: i, discovery: a } = t, o = i.tariff, s = o.kind === "unknown";
	return {
		key: "tariff",
		icon: "mdi:cash-clock",
		title: a?.tariff.provider ?? r("find.tariff"),
		detail: Je(r, o),
		chips: s ? [] : [O(r, F(i, "tariff.kind")), ...a && a.tariff.kind !== "unknown" ? [e(r, a.tariff.confidence)] : []],
		reasons: a?.tariff.reasons,
		notes: s ? [Wc(n.missing ?? r("review.tariff.ask"))] : [],
		state: s ? "missing" : void 0,
		tip: "review_tariff",
		actions: n.actions
	};
}
function tl(t) {
	let { t: n, config: r, from: i } = t, a = t.discovery?.forecast, o = {
		key: "forecast",
		icon: "mdi:weather-sunny",
		title: n("find.forecast"),
		tip: "review_forecast"
	};
	return r.forecast.provider ? {
		...o,
		detail: a ? n("find.forecast.detail", {
			provider: a.provider_name,
			planes: Q(n, a.planes, "word.plane"),
			today: a.today_kwh == null ? "–" : s(n.lang, a.today_kwh, 1),
			tomorrow: a.tomorrow_kwh == null ? "–" : s(n.lang, a.tomorrow_kwh, 1)
		}) : r.forecast.provider,
		chips: [O(n, F(r, "forecast.provider")), ...a ? [e(n, a.confidence)] : []],
		reasons: a?.reasons,
		actions: [Z(n("review.ignore"), "", () => Zc(i, r, "forecast", { forecast: {
			provider: null,
			config_entries: [],
			today: [],
			tomorrow: [],
			remaining_today: [],
			alternatives: []
		} }), !0)]
	} : I(r, "forecast") && a ? {
		...o,
		detail: n("review.ignored"),
		state: "ignored",
		actions: [Z(n("review.use"), "mdi:undo-variant", () => nl(t))]
	} : {
		...o,
		detail: n("find.none"),
		state: "missing",
		notes: [Wc(n("review.forecast.none"))],
		tip: void 0
	};
}
function nl(e) {
	let t = e.discovery?.forecast;
	t && L(e.from, {
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
		answers: { ignored: Qe(e.config, "forecast", !1) }
	}, "read");
}
function rl(t, n, r = {}) {
	let { from: i, hass: a, t: o, config: l } = t, u = l.measurements[n], f = t.discovery?.measurements[n] ?? null, p = n === "grid_power", m = {
		key: n,
		icon: p ? "mdi:transmission-tower" : "mdi:home-lightning-bolt-outline",
		title: o(p ? "find.grid" : "find.home"),
		tip: p ? "review_grid" : "review_home"
	}, h = Z(o(u ? "review.change" : "review.choose"), "mdi:magnify", () => void al(t, n)), g = r.devices ? [r.devices] : [];
	if (!u && !p && l.measurements.grid_power) return {
		...m,
		detail: o("review.home.balance"),
		notes: il(o, l),
		actions: [h, ...g]
	};
	if (!u) return I(l, n) ? {
		...m,
		detail: o("review.home.computed"),
		state: "ignored",
		actions: [h]
	} : {
		...m,
		detail: o("find.none"),
		state: "missing",
		notes: [Wc(o(p ? "review.grid.none" : "review.home.none"))],
		actions: p ? [h] : [h, Z(o("review.home.without"), "", () => Zc(i, l, "home_power", { measurements: { home_power: null } }), !0)]
	};
	let _ = we(a, u), ee = d(a, u.entity_id, o.lang);
	if (_ !== null) {
		let e = s(o.lang, Math.abs(_), 2);
		ee = p ? o(_ >= 0 ? "live.import" : "live.export", { value: e }) : o("live.kw", { value: s(o.lang, _, 2) });
	}
	let te = t.checks.filter((e) => e.code !== "missing" && (e.role === n || p && e.code === "grid_sign" || !p && e.code === "home_negative")), v = () => ol(i, n, {
		...u,
		invert: !u.invert
	}), ne = te.map((e) => e.code === "grid_sign" ? Xc(o, e, [Z(o("review.invert"), "mdi:swap-vertical", v), Z(o("review.keep"), "mdi:check", () => Qc(i, l, `grid_sign:${u.entity_id}`), !0)]) : e.code === "home_negative" ? Xc(o, e, [Z(o("review.invert"), "mdi:swap-vertical", v)]) : Xc(o, e)), y = te.some((e) => e.level === "warn") ? "flag" : void 0, re = c(a, u.entity_id), b = f?.entity.entity_id === u.entity_id;
	return !p && l.measurements.grid_power ? {
		...m,
		detail: `${o("review.home.balance")} · ${o("review.home.compare", {
			name: re,
			live: ee
		})}`,
		chips: [O(o, F(l, `measurements.${n}`))],
		notes: [...il(o, l), ...ne],
		state: y,
		aside: t.aside?.(u.entity_id, re),
		actions: [
			h,
			...g,
			Z(o("review.ignore"), "", () => Zc(i, l, "home_power", { measurements: { home_power: null } }), !0)
		]
	} : {
		...m,
		detail: `${re} · ${ee}`,
		chips: [O(o, F(l, `measurements.${n}`)), ...f && b ? [e(o, f.confidence)] : []],
		reasons: b ? f?.reasons : void 0,
		notes: ne,
		state: y,
		aside: t.aside?.(u.entity_id, re),
		actions: [h, ...g]
	};
}
function il(e, t) {
	let n = [], r = Vn(t.consumers);
	if (r.length) {
		let t = r.map((t) => t.kind === "ev" || t.runs === "always" || !t.runs ? t.name : `${t.name} (${e(`runs.${t.runs}`)})`).join(", ");
		n.push(Wc(e(r.some((e) => e.kind === "ev") ? "review.home.flexible" : "review.home.flexible_some", { names: t })));
	} else t.consumers.some((e) => e.kind !== "submeter") && n.push(Wc(e("review.home.flexible_none")));
	let i = t.learned.home_check;
	if (i && i.calc_kwh > 0) {
		let t = (i.sensor_kwh - i.calc_kwh) / i.calc_kwh;
		t <= -.5 ? n.push(Wc(e("review.home.off_balance", {
			days: i.days,
			pct: s(e.lang, -t * 100, 0)
		}))) : Math.abs(t) >= .1 && n.push(Wc(e("review.home.off", {
			days: i.days,
			pct: s(e.lang, Math.abs(t) * 100, 0),
			direction: e(t < 0 ? "review.home.less" : "review.home.more")
		})));
	}
	return n;
}
async function al(e, t) {
	let { t: n, config: r } = e, i = r.measurements[t], a = e.discovery?.measurements[t], o = t === "grid_power", s = await R(e.from, {
		heading: n(o ? "pick.grid.title" : "pick.home.title"),
		tip: o ? "pick_grid" : "pick_home",
		filter: "power",
		selected: i ? [i.entity_id] : [],
		suggestions: $e(a ? [et(a)] : [], a?.alternatives),
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
	I(r, t) && (l.answers = { ignored: Qe(r, t, !1) }), L(e.from, l);
}
function ol(e, t, n) {
	L(e, { measurements: { [t]: n } });
}
function sl(t) {
	let { from: n, hass: r, t: i, config: a } = t, o = a.measurements.solar_power, l = t.discovery?.measurements.solar_power ?? null, u = {
		key: "solar_power",
		icon: "mdi:solar-panel",
		title: i("find.solar"),
		tip: "review_solar"
	}, d = (e) => Z(e, "mdi:magnify", () => void cl(t));
	if (!o.length) return I(a, "solar_power") ? {
		...u,
		detail: i("review.solar.without"),
		state: "ignored",
		actions: [d(i("review.choose"))]
	} : {
		...u,
		detail: i("find.none"),
		state: "missing",
		actions: [d(i("review.choose")), Z(i("review.solar.none"), "", () => Zc(n, a, "solar_power", { measurements: { solar_power: [] } }), !0)]
	};
	let f = ie(r, o), p = t.checks.filter((e) => e.role === "solar_power" && e.code !== "missing"), m = o.length === 1 ? o[0].entity_id : void 0;
	return {
		...u,
		detail: i("find.solar.detail", {
			count: Q(i, o.length, "word.sensor"),
			total: f === null ? "–" : s(i.lang, f, 2)
		}),
		chips: [O(i, F(a, "measurements.solar_power")), ...l ? [e(i, l.confidence)] : []],
		reasons: l?.reasons,
		notes: p.map((e) => Xc(i, e)),
		state: p.some((e) => e.level === "warn") ? "flag" : void 0,
		aside: m ? t.aside?.(m, c(r, m)) : void 0,
		actions: [d(i("review.change")), ...p.filter((e) => e.can_sleep && o.some((t) => t.entity_id === e.entity_id && !t.sleeps)).map((e) => Z(o.length > 1 ? i("solar.sleeps.quick_named", { name: c(r, String(e.entity_id)) }) : i("solar.sleeps.quick"), "mdi:weather-night", () => void L(n, { measurements: { solar_power: o.map((t) => t.entity_id === e.entity_id ? {
			...t,
			sleeps: !0
		} : t) } })))]
	};
}
async function cl(e) {
	let { t, config: n } = e, r = n.measurements.solar_power, i = e.discovery?.measurements.solar_power, a = await R(e.from, {
		heading: t("pick.solar.title"),
		tip: "pick_solar",
		filter: "power",
		multiple: !0,
		selected: r.map((e) => e.entity_id),
		suggestions: $e((i?.entities ?? []).map((e) => ({
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
	I(n, "solar_power") && (o.answers = { ignored: Qe(n, "solar_power", !1) }), L(e.from, o);
}
//#endregion
//#region src/editors/tariff-form.ts
var ll = [
	"kind",
	"price_entity",
	"window",
	"night_price",
	"day_price",
	"feed_in_price",
	"feed_in_entity",
	"surcharge"
];
function ul(e, t) {
	let n = {};
	for (let r of ll) JSON.stringify(e[r] ?? null) !== JSON.stringify(t[r] ?? null) && (n[r] = t[r] ?? null);
	return n;
}
function dl(e, t) {
	let n = ul(e, t);
	if (!Object.keys(n).length) return null;
	let r = { tariff: n };
	return "kind" in n && (r.answers = { tariff: t.kind }), r;
}
var fl = class extends P {
	constructor(...e) {
		super(...e), this.feedIn = !1, this.asQuestion = !1;
	}
	static {
		this.styles = [x, D`
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
		if (!e || !t) return T;
		let r = [
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
		], i = j`<joe-choice
      .options=${r}
      .value=${t.kind === "unknown" ? [] : [t.kind]}
      idk=${e("ask.idk")}
      label=${e("f.tariff.kind")}
      @joe-choice=${(e) => this.emit({ kind: e.detail.value[0] ?? "unknown" })}
    ></joe-choice>`;
		return j`${this.asQuestion ? i : j`<div class="field" data-tipped>
            <div class="field-label">${e("f.tariff.kind")} ${n(e, "q_tariff")}</div>
            ${i}
          </div>`}
      ${t.kind === "fixed_window" ? this.renderWindow(e, t) : T}
      ${t.kind === "flat" ? this.renderFlat(e, t) : T}
      ${t.kind === "dynamic" ? this.renderDynamic(e, t) : T}
      ${this.feedIn ? this.renderFeedIn(e, t) : T}`;
	}
	renderWindow(e, t) {
		let r = t.window ?? {
			start: "",
			end: ""
		}, i = (e, t) => {
			let n = {
				...r,
				[e]: t
			};
			this.emit({ window: n.start && n.end ? n : null });
		};
		return j`<div class="field" data-tipped>
        <div class="field-label">${e("f.window")} ${n(e, "f_window")}</div>
        <div class="field-row">
          <input
            class="input time"
            type="time"
            aria-label=${e("f.window.start")}
            .value=${r.start}
            @change=${(e) => i("start", e.target.value)}
          />
          <span>${e("f.window.until")}</span>
          <input
            class="input time"
            type="time"
            aria-label=${e("f.window.end")}
            .value=${r.end}
            @change=${(e) => i("end", e.target.value)}
          />
        </div>
      </div>
      <div class="field" data-tipped>
        <div class="field-label">${e("f.prices")} ${n(e, "f_prices")}</div>
        <div class="field-row">
          <label class="price">${e("f.price.night")} ${this.centInput(e, t.night_price, "night_price")}</label>
          <label class="price">${e("f.price.day")} ${this.centInput(e, t.day_price, "day_price")}</label>
        </div>
      </div>`;
	}
	renderFlat(e, t) {
		return j`<div class="field" data-tipped>
      <div class="field-label">${e("f.price")} ${n(e, "f_prices")}</div>
      ${this.centInput(e, t.day_price, "day_price")}
    </div>`;
	}
	renderDynamic(e, t) {
		let r = this.hass, i = t.price_entity, a = t.window ?? {
			start: "20:00",
			end: "07:00"
		}, o = (e, t) => {
			let n = {
				...a,
				[e]: t
			};
			this.emit({ window: n.start && n.end ? n : null });
		};
		return j`<div class="field" data-tipped>
        <div class="field-label">${e("f.price_entity")} ${n(e, "f_price_entity")}</div>
        <div class="entity">
          ${i && r ? j`<span><b>${c(r, i)}</b> <small>${d(r, i, e.lang)}</small></span>` : j`<small>${e("f.price_entity.none")}</small>`}
          <button type="button" class="mini-btn" @click=${this.pickPrice}>
            <ha-icon icon="mdi:magnify"></ha-icon>${e(i ? "review.change" : "review.choose")}
          </button>
        </div>
      </div>
      <div class="field" data-tipped>
        <div class="field-label">${e("f.search")} ${n(e, "f_search")}</div>
        <div class="field-row">
          <input
            class="input time"
            type="time"
            aria-label=${e("f.search.start")}
            .value=${a.start}
            @change=${(e) => o("start", e.target.value)}
          />
          <span>${e("f.window.until")}</span>
          <input
            class="input time"
            type="time"
            aria-label=${e("f.search.end")}
            .value=${a.end}
            @change=${(e) => o("end", e.target.value)}
          />
        </div>
      </div>
      <div class="field" data-tipped>
        <div class="field-label">${e("f.surcharge")} ${n(e, "f_surcharge")}</div>
        ${this.centInput(e, t.surcharge, "surcharge")}
      </div>`;
	}
	renderFeedIn(e, t) {
		let r = this.hass;
		return j`<div class="field" data-tipped>
      <div class="field-label">${e("f.feed_in")} ${n(e, "q_feed_in")}</div>
      ${t.feed_in_entity && r ? j`<p class="field-hint">
            ${e("f.feed_in.entity", { name: c(r, t.feed_in_entity) })}
          </p>` : this.centInput(e, t.feed_in_price, "feed_in_price")}
    </div>`;
	}
	centInput(e, t, n) {
		return j`<span class="unit-input">
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
		let n = this.discovery?.tariff, r = (await R(this, {
			heading: e("pick.price.title"),
			tip: "pick_price",
			filter: "price",
			selected: t.price_entity ? [t.price_entity] : [],
			suggestions: $e(n?.price_entity ? [{
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
b([A({ attribute: !1 })], fl.prototype, "hass", void 0), b([A({ attribute: !1 })], fl.prototype, "t", void 0), b([A({ attribute: !1 })], fl.prototype, "tariff", void 0), b([A({ attribute: !1 })], fl.prototype, "discovery", void 0), b([A({ type: Boolean })], fl.prototype, "feedIn", void 0), b([A({ type: Boolean })], fl.prototype, "asQuestion", void 0), _("joe-tariff-form", fl);
var pl, ml = class extends P {
	constructor(...e) {
		super(...e), this.closable = !1, this.keep = !1, this.saving = !1, this.base = "";
	}
	static {
		this.styles = [x, D`
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
		!this.draft && this.keep && pl && (this.base = pl.base, this.draft = pl.draft), this.draft ? n !== this.base && (this.draft = {
			...structuredClone(t),
			...this.changes
		}, this.base = n, this.keep && (pl = this.dirty ? {
			base: this.base,
			draft: this.draft
		} : void 0)) : (this.base = n, this.draft = structuredClone(t));
	}
	get changes() {
		return this.draft && this.base ? ul(JSON.parse(this.base), this.draft) : {};
	}
	get dirty() {
		return Object.keys(this.changes).length > 0;
	}
	render() {
		let { t: e, draft: t } = this;
		if (!e || !t) return T;
		let n = this.dirty;
		return j`<joe-tariff-form
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
      ${n && !this.closable ? j`<p class="unsaved" role="status">${e("grid.tariff.unsaved")}</p>` : T}
      ${n || this.closable ? j`<div class="actions" data-notip>
            <button type="button" class="btn btn-primary" ?disabled=${this.saving || !n && !this.closable} @click=${this.save}>
              ${e("common.save")}
            </button>
            <button type="button" class="btn btn-ghost" @click=${this.discard}>
              ${e(this.closable ? "common.cancel" : "grid.tariff.discard")}
            </button>
          </div>` : T}`;
	}
	change(e) {
		this.draft = e, this.keep && (pl = this.dirty ? {
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
		}, r = dl(e.tariff, n);
		if (r) {
			this.saving = !0;
			let e = await L(this, r);
			if (this.saving = !1, !e) return;
			this.base = JSON.stringify(n), this.draft = n;
		}
		this.keep && (pl = void 0), this.finish();
	}
	discard() {
		this.config && (this.base = JSON.stringify(this.config.tariff), this.draft = structuredClone(this.config.tariff)), this.keep && (pl = void 0), this.finish();
	}
	finish() {
		this.closable && this.dispatchEvent(new CustomEvent("joe-close", {
			bubbles: !0,
			composed: !0
		}));
	}
};
b([A({ attribute: !1 })], ml.prototype, "hass", void 0), b([A({ attribute: !1 })], ml.prototype, "t", void 0), b([A({ attribute: !1 })], ml.prototype, "config", void 0), b([A({ attribute: !1 })], ml.prototype, "discovery", void 0), b([A({ type: Boolean })], ml.prototype, "closable", void 0), b([A({ type: Boolean })], ml.prototype, "keep", void 0), b([C()], ml.prototype, "draft", void 0), b([C()], ml.prototype, "saving", void 0), _("joe-tariff-draft", ml);
//#endregion
//#region src/pages/devices/grid.ts
var hl = [
	"connection",
	"tariff",
	"solar",
	"home"
], gl = {
	connection: "mdi:transmission-tower",
	tariff: "mdi:cash-clock",
	solar: "mdi:solar-power-variant",
	home: "mdi:home-lightning-bolt-outline"
}, _l = "/config/energy";
function vl(e, t) {
	return t < .95 ? e("learn.solar.less", {
		value: s(e.lang, (1 - t) * 100, 0),
		share: s(e.lang, t * 100, 0)
	}) : t > 1.05 ? e("learn.solar.more", {
		value: s(e.lang, (t - 1) * 100, 0),
		share: s(e.lang, t * 100, 0)
	}) : e("learn.solar.fits");
}
var yl = class extends q {
	static {
		this.styles = [
			x,
			K,
			Uc,
			D`
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
		this.anchor && this.revealed !== this.anchor && _e(this.renderRoot, this.anchor) && (this.revealed = this.anchor);
	}
	render() {
		let { t: e, hass: t, state: n } = this;
		if (!e || !t || !n) return T;
		let r = n.config, i = {
			from: this,
			hass: t,
			t: e,
			config: r,
			discovery: this.discovery,
			checks: this.checks,
			aside: (n, r) => vi(e, _i(t, n, r))
		}, a = this.anchor !== void 0 && !hl.includes(this.anchor);
		return j`<div class="wrap">
      ${a ? _a(e) : T}
      ${Ea(e, e("nav.devices.grid"), e("grid.lead"))}
      ${this.renderEnergy(e, i)} ${this.renderConnection(e, i)} ${this.renderTariff(e, i)}
      ${this.renderSolar(e, i)} ${this.renderHome(e, i)}
    </div>`;
	}
	renderEnergy(e, t) {
		let n = $c(t);
		return n ? j`<div class="energy">${Kc(e, [n])}</div>` : j`<div class="note energy-none">
      <ha-icon icon="mdi:information-outline"></ha-icon>
      <span
        >${e("grid.energy.none")}
        <a
          href=${_l}
          @click=${(e) => {
			e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0 || (e.preventDefault(), be(_l));
		}}
          >${e("grid.energy.open")}</a
        ></span
      >
    </div>`;
	}
	block(e, t, r, i, a) {
		return j`<section class="card gsec" data-anchor=${t}>
      <h3 class="gsec-head" ?data-tipped=${!!a}>
        <ha-icon icon=${gl[t]}></ha-icon>${r}${a ? n(e, a) : T}
      </h3>
      <p class="say">${e(`grid.${t}.say`)}</p>
      ${i}
    </section>`;
	}
	rule(e, t, n) {
		return J(e, this.prefix, {
			label: e(`rule.${n}`),
			value: Wa(e, t, n),
			source: F(t, `rules.${n}`),
			to: {
				tab: "settings",
				section: "rules",
				id: n
			}
		});
	}
	renderConnection(e, t) {
		return this.block(e, "connection", e("grid.connection"), j`${Kc(e, [rl(t, "grid_power")])}
        <div class="mirrors">${this.rule(e, t.config, "grid_limit_w")} ${this.rule(e, t.config, "guard_grid")}</div>`);
	}
	renderTariff(e, t) {
		return this.block(e, "tariff", e("find.tariff"), j`${Kc(e, [el(t, { missing: e("grid.tariff.unknown") })])}
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
		let r = t.config, i = r.forecast, a = r.learned.solar_factor, o = {
			tab: "review",
			section: "learned",
			id: "sun"
		};
		return this.block(e, "solar", e("devices.grid.solar"), j`${Kc(e, [sl(t), tl(t)])} ${this.renderSleeps(e, t)}
        ${i.provider && i.alternatives.length ? j`<div class="toggle-row" data-tipped>
              <span class="with-tip"><span id="combine-label">${e("learn.sources.combine")}</span>${n(e, "learn_combine")}</span>
              <button
                type="button"
                class="switch"
                role="switch"
                aria-checked=${String(i.combine)}
                aria-labelledby="combine-label"
                @click=${() => L(this, { forecast: { combine: !i.combine } })}
              ></button>
            </div>` : T}
        ${i.provider ? j`<div class="mirrors">
              ${this.renderForecastHistory(e, t)}
              <div class="mirror">
                <div class="mirror-text">
                  <span class="mirror-label">${e("grid.solar.factor")}</span>
                  <span class="mirror-sep" aria-hidden="true">·</span>
                  <span class="mirror-value">${a == null ? e("learn.still") : `× ${s(e.lang, a, 2)}`}</span>
                  ${a == null ? T : O(e, { source: "learned" })}
                  ${a == null ? T : j`<small class="mirror-hint">${vl(e, a)}</small>`}
                </div>
                <a class="mini-btn quiet mirror-go" href=${k(this.prefix, o)} @click=${E(o)}
                  >${e("devices.page.more_learned")}</a
                >
              </div>
            </div>` : T}`);
	}
	renderForecastHistory(e, t) {
		let r = t.config.forecast.history_entity ?? null, i = this.state?.observe?.forecast_history, a = i?.entity ?? r, o = a ? c(t.hass, a) : e("grid.forecast_history.auto"), s, l = r ? void 0 : e("grid.forecast_history.auto_hint");
		switch (i?.state) {
			case "done":
				s = i.from ? `${o} · ${e("grid.forecast_history.done", {
					days: i.days,
					from: W(e.lang, i.from)
				})}` : o;
				break;
			case "running":
				s = e("grid.forecast_history.running");
				break;
			case "none":
				s = e("grid.forecast_history.none"), l = void 0;
				break;
			case "failed":
				s = e("grid.forecast_history.failed");
				break;
			default: s = o;
		}
		return j`<div class="mirror" data-tipped>
      <div class="mirror-text">
        <span class="mirror-label">${e("grid.forecast_history")}</span>${n(e, "forecast_history")}
        <span class="mirror-sep" aria-hidden="true">·</span>
        <span class="mirror-value">${s}</span>
        ${r ? O(e, F(t.config, "forecast.history_entity") ?? { source: "user" }) : T}
        ${l ? j`<small class="mirror-hint">${l}</small>` : T}
      </div>
      <button type="button" class="mini-btn quiet" @click=${() => void this.pickHistory(r)}>
        ${e(r ? "grid.forecast_history.change" : "grid.forecast_history.pick")}
      </button>
      ${r ? j`<button
            type="button"
            class="mini-btn quiet"
            @click=${() => void L(this, { forecast: { history_entity: null } })}
          >
            ${e("grid.forecast_history.auto_back")}
          </button>` : T}
    </div>`;
	}
	async pickHistory(e) {
		let t = this.t;
		if (!t) return;
		let n = await R(this, {
			heading: t("pick.forecast_history.title"),
			tip: "forecast_history",
			filter: "energy",
			selected: e ? [e] : []
		});
		n && L(this, { forecast: { history_entity: n.selected[0] ?? null } });
	}
	renderSleeps(e, t) {
		let r = t.config.measurements.solar_power;
		if (!r.length) return T;
		let i = (e) => L(this, { measurements: { solar_power: r.map((t) => t.entity_id === e ? {
			...t,
			sleeps: !t.sleeps
		} : t) } });
		return j`${r.map((t, a) => j`<div class="toggle-row" data-tipped>
          <span class="with-tip"
            ><span id="sleeps-label-${a}"
              >${r.length > 1 ? e("solar.sleeps.named", { name: c(this.hass, t.entity_id) }) : e("solar.sleeps")}</span
            >${n(e, "solar_sleeps")}</span
          >
          <button
            type="button"
            class="switch"
            role="switch"
            aria-checked=${String(!!t.sleeps)}
            aria-labelledby="sleeps-label-${a}"
            @click=${() => i(t.entity_id)}
          ></button>
        </div>`)}`;
	}
	renderHome(e, t) {
		let n = {
			tab: "devices",
			section: "other"
		}, r = j`<a class="mini-btn go" href=${k(this.prefix, n)} @click=${E(n)}
      >${e("grid.home.devices")}</a
    >`;
		return this.block(e, "home", e("devices.grid.home"), Kc(e, [rl(t, "home_power", { devices: r })]));
	}
};
b([A({ attribute: !1 })], yl.prototype, "anchor", void 0), _("joe-grid-page", yl);
//#endregion
//#region src/pages/devices/hot-water-device.ts
var bl = class extends q {
	static {
		this.styles = [
			x,
			K,
			Kn,
			$s,
			Ro
		];
	}
	render() {
		let { t: e, hass: t, state: n, entry: r } = this;
		if (!e || !t || !n || !r) return T;
		let i = ya(this.ctx, r), a = r.consumer, o = a ? Qs(this, e, t, n.config, a) : void 0, s = r.action;
		return s ? wa(this.ctx, {
			...i,
			why: kn(e, n, s),
			now: j`<joe-action-tonight .hass=${t} .t=${e} .state=${n} .action=${s}></joe-action-tonight>`,
			steer: j`<joe-action-steer
        .hass=${t}
        .t=${e}
        .state=${n}
        .discovery=${this.discovery}
        .prefix=${this.prefix}
        .action=${s}
        .section=${"hot_water"}
      ></joe-action-steer>`,
			power: o,
			learned: s.kind === "target" ? Gn([Qn(e, n.config.learned, s)]) : void 0,
			learnedArea: "hot_water",
			tips: { steer: "device_steer" },
			removeTitle: e("devices.page.delete"),
			remove: j`<joe-action-delete
        .t=${e}
        .config=${n.config}
        .action=${s}
        .leave=${{
				tab: "devices",
				section: "hot_water"
			}}
      ></joe-action-delete>`
		}) : wa(this.ctx, {
			...i,
			now: a ? Po(e, this.prefix, "hot_water", a.id, e("devices.hot_water.lonely"), e("devices.hot_water.set_up"), "devices_lonely_hot_water") : void 0,
			power: o
		});
	}
};
b([A({ attribute: !1 })], bl.prototype, "entry", void 0), _("joe-hot-water-device", bl);
//#endregion
//#region src/pages/devices/hot-water.ts
var xl = class extends q {
	static {
		this.styles = [
			x,
			K,
			Ro
		];
	}
	render() {
		let { t: e, hass: t, state: n } = this;
		if (!e || !n) return T;
		let r = gt(this.devices, "hot_water", this.device);
		if (r) return j`<joe-hot-water-device
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
		let i = this.device ? Fo(this.devices, this.device, "hot_water") : void 0;
		return j`<div class="wrap">
      ${Ea(e, e("nav.devices.hot_water"), e("devices.hot_water.lead"), this.devices.some((e) => e.group === "hot_water"))}
      ${this.device === void 0 ? T : i ? Io(e, this.prefix, i.name, i) : _a(e)}
      ${Ta(this.ctx, this.devices, "hot_water", (r) => r.action ? { quick: j`<joe-action-tonight .hass=${t} .t=${e} .state=${n} .action=${r.action}></joe-action-tonight>` } : {})}
      <div class="group-actions">${Da(e, this.prefix, "hot_water", e("devices.group_add.hot_water"))}</div>
    </div>`;
	}
};
b([A({ attribute: !1 })], xl.prototype, "device", void 0), b([A({ attribute: !1 })], xl.prototype, "sub", void 0), _("joe-hot-water-group", xl);
//#endregion
//#region src/pages/devices/other-device.ts
var Sl = class extends q {
	static {
		this.styles = [
			x,
			K,
			Kn,
			$s,
			Ro
		];
	}
	render() {
		let { t: e, hass: t, state: n, entry: r } = this;
		if (!e || !t || !n || !r) return T;
		let i = ya(this.ctx, r), a = r.consumer, o = r.action, s = a && a.energy_entity && a.kind !== "submeter" ? Gn([Zn(e, n.config.learned, a)]) : void 0, c = !!(o && a && r.id === a.id), l = st("night", a?.id);
		return wa(this.ctx, {
			...i,
			why: o ? kn(e, n, o) : i.why,
			now: o ? j`<joe-action-tonight .hass=${t} .t=${e} .state=${n} .action=${o}></joe-action-tonight>` : void 0,
			steer: o ? j`<joe-action-steer
              .hass=${t}
              .t=${e}
              .state=${n}
              .discovery=${this.discovery}
              .prefix=${this.prefix}
              .action=${o}
              .section=${"night"}
            ></joe-action-steer>` : a && a.kind !== "submeter" ? j`<p class="muted">${e("devices.other.night_offer")}</p>
              <a class="btn btn-secondary add-link" href=${k(this.prefix, l)} @click=${E(l, { sheet: !0 })}
                >${e("devices.other.night_add")}</a
              >` : void 0,
			power: a ? Qs(this, e, t, n.config, a) : r.noMeter ? j`<p class="muted">${e("devices.other.no_meter")}</p>` : void 0,
			learned: s,
			learnedArea: "devices",
			tips: { steer: "device_steer" },
			removeTitle: e("devices.page.delete"),
			remove: o ? j`<joe-action-delete
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
b([A({ attribute: !1 })], Sl.prototype, "entry", void 0), _("joe-other-device", Sl);
//#endregion
//#region src/pages/devices/other.ts
var Cl = class extends q {
	constructor(...e) {
		super(...e), this.moved = /* @__PURE__ */ new Map();
	}
	static {
		this.styles = [
			x,
			K,
			$s,
			Ro
		];
	}
	render() {
		let { t: e, state: t } = this;
		if (!e || !t) return T;
		let n = gt(this.devices, "other", this.device);
		if (n) return j`<joe-other-device
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
		let r = this.device ? Fo(this.devices, this.device, "other") : void 0;
		return j`<div class="wrap">
      ${Ea(e, e("nav.devices.other"), e("devices.other.lead"), this.devices.some((e) => e.group === "other"))}
      ${this.device === void 0 ? T : r ? Io(e, this.prefix, r.name, r) : _a(e)}
      ${this.renderList(e, t)}
      <div class="group-actions">${Da(e, this.prefix, "night", e("devices.group_add.night"))}</div>
    </div>`;
	}
	renderList(e, t) {
		let r = this.devices.filter((e) => e.group === "other"), i = new Map(t.config.consumers.map((e, t) => [e.id, t])), a = r.filter((e) => i.has(e.id)), o = r.filter((e) => !i.has(e.id) && !e.noMeter), s = r.filter((e) => e.noMeter), c = a.map((n) => ({
			at: i.get(n.id),
			html: this.card(e, t, n)
		}));
		for (let [t, n] of this.moved) {
			let a = r.some((e) => e.id === t) ? void 0 : Fo(this.devices, t, "other");
			a && c.push({
				at: i.get(t) ?? Infinity,
				html: Io(e, this.prefix, n, a)
			});
		}
		return c.sort((e, t) => e.at - t.at), !c.length && !o.length && !s.length ? j`<p class="muted">${e("devices.other.empty")}</p>` : j`${c.length || o.length ? j`<section data-tipped>
            <div class="list-head">
              <span>${e("consumers.kind")} ${n(e, "f_consumer_kind")}</span>
              <span>${e("consumers.runs")} ${n(e, "f_consumer_runs")}</span>
            </div>
            <div class="dcards">${c.map((e) => e.html)} ${o.map((n) => this.card(e, t, n))}</div>
          </section>` : T}
      ${s.length ? j`<h3 class="sub-group">${e("devices.no_meter_group")}</h3>
            <div class="dcards">${s.map((n) => this.card(e, t, n))}</div>` : T}`;
	}
	card(e, t, n) {
		let r = n.id === n.consumer?.id ? n.consumer : void 0, i = n.action ? j`<joe-action-tonight .hass=${this.hass} .t=${e} .state=${t} .action=${n.action}></joe-action-tonight>` : T, a = r ? j`${Xs(e, r, (e) => this.setKind(r, e))}
        ${Zs(e, r, (e) => void Ys(this, r, e))} ${i}` : n.action ? i : void 0;
		return yi(e, this.prefix, Ci(e, this.hass, t, n, { quick: a }));
	}
	async setKind(e, t) {
		if (!await Js(this, e, t)) return;
		let n = new Map(this.moved);
		qs.includes(t) ? n.set(e.id, e.name) : n.delete(e.id), this.moved = n;
	}
};
b([A({ attribute: !1 })], Cl.prototype, "device", void 0), b([A({ attribute: !1 })], Cl.prototype, "sub", void 0), b([C()], Cl.prototype, "moved", void 0), _("joe-other-group", Cl);
//#endregion
//#region src/pages/devices/index.ts
var wl = {
	all: "joe-devices-all",
	battery: "joe-battery-group",
	climate: "joe-climate-group",
	car: "joe-car-group",
	hot_water: "joe-hot-water-group",
	other: "joe-other-group",
	grid: "joe-grid-page"
}, Tl = class extends P {
	constructor(...e) {
		super(...e), this.prefix = M, this.checks = [], this.devices = [], this.behind = {
			tab: "devices",
			section: "all"
		};
	}
	static {
		this.styles = [x, D`
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
		].some((t) => e.has(t)) && (this.devices = mt(this.t, this.state, this.hass, {
			climateFound: this.climateFound,
			discovery: this.discovery,
			checks: this.checks
		})), e.has("route") && this.route && this.route.section !== "add" && (this.behind = this.route);
	}
	chips(e, t) {
		let n = new Set(ht(this.devices));
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
				icon: nt[t],
				count: n ? s(e.lang, n, 0) : void 0,
				problem: _t(this.devices, t)
			});
		}
		return r;
	}
	render() {
		let e = this.t;
		if (!e || !this.state) return T;
		let t = (this.route?.section ?? ye.devices) === "add", n = t ? this.behind : this.route, r = n?.section ?? ye.devices;
		return j`${ni(e, this.prefix, "devices", this.chips(e, r), r)}${this.renderSection(r, n)}${t ? this.renderAdd() : T}`;
	}
	renderSection(e, t) {
		if (!customElements.get(wl[e])) return j``;
		let { t: n, hass: r, state: i, prefix: a, discovery: o, info: s, checks: c, climateFound: l, devices: u } = this;
		switch (e) {
			case "all": return j`<joe-devices-all
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
			case "climate": return j`<joe-climate-group
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
			case "battery": return j`<joe-battery-group
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
			case "car": return j`<joe-car-group
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
			case "hot_water": return j`<joe-hot-water-group
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
			case "other": return j`<joe-other-group
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
			case "grid": return j`<joe-grid-page
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
		return j`<joe-device-add
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
b([A({ attribute: !1 })], Tl.prototype, "hass", void 0), b([A({ attribute: !1 })], Tl.prototype, "t", void 0), b([A({ attribute: !1 })], Tl.prototype, "state", void 0), b([A({ attribute: !1 })], Tl.prototype, "route", void 0), b([A({ attribute: !1 })], Tl.prototype, "prefix", void 0), b([A({ attribute: !1 })], Tl.prototype, "discovery", void 0), b([A({ attribute: !1 })], Tl.prototype, "info", void 0), b([A({ attribute: !1 })], Tl.prototype, "checks", void 0), b([A({ attribute: !1 })], Tl.prototype, "climateFound", void 0), _("joe-devices-page", Tl);
//#endregion
//#region src/uses.ts
function El(e, t) {
	let n = e.climate;
	if (!n?.enabled) return [];
	let r = t ? new Set(t.devices.map((e) => e.entity_id)) : null;
	return Object.entries(n.rooms ?? {}).filter(([e, t]) => t.enabled && (!r || r.has(e))).map(([e]) => e);
}
function Dl(e, t) {
	return (e.cars ?? []).filter((e) => e.need.enabled).filter((e) => {
		let n = e.need.persons;
		return t === void 0 ? n === null || n.length > 0 : n === null || n.includes(t);
	}).map((e) => ({
		label: e.name,
		to: `/devices/car/${encodeURIComponent(e.id)}`
	}));
}
function Ol(e, t) {
	return t.length ? [{
		label: e("usedby.climate"),
		to: "/devices/climate",
		count: t.length
	}] : [];
}
function kl(e, t, n) {
	let r = Ol(e, El(t, n));
	return t.persons.some((e) => e.person_entity) && r.push({
		label: e("usedby.learn"),
		to: "/review/learned/presence"
	}), r;
}
function Al(e, t, n) {
	let r = t.persons.some((e) => e.calendars.length), i = [];
	return (t.context.holiday_entity || r) && (i.push({
		label: e("usedby.plan"),
		to: "/plan"
	}), i.push({
		label: e("usedby.consumption"),
		to: "/review/learned/consumption"
	})), r && i.push(...Dl(t).map((t) => ({
		...t,
		label: e("usedby.car", { name: t.label })
	}))), (t.context.holiday_entity || r || t.context.free_day_entities?.length) && i.push(...Ol(e, El(t, n))), i;
}
function jl(e, t, n) {
	return Ol(e, El(t, n).filter((e) => t.climate?.rooms[e]?.night_off));
}
function Ml(e, t, n, r) {
	let i = [];
	return n !== "routing" && t.context.weather_entity && (i.push({
		label: e("usedby.plan"),
		to: "/plan"
	}), i.push({
		label: e("usedby.consumption"),
		to: "/review/learned/consumption"
	}), i.push(...Ol(e, El(t, r)))), n !== "weather" && t.routing.service && (i.push(...Dl(t).map((t) => ({
		...t,
		label: e("usedby.car", { name: t.label })
	}))), (t.climate?.route_eta ?? !0) && El(t, r).length && i.push({
		label: e("usedby.way"),
		to: "/household/presence/way"
	})), i.filter((e, t) => i.findIndex((t) => t.label === e.label) === t);
}
function Nl(e, t, n) {
	return t.persons.find((e) => e.id === n)?.calendars.length ? Dl(t, n) : [];
}
//#endregion
//#region src/components/used-by.ts
function Pl(e, t) {
	if (typeof t == "string") return t;
	let [n, r] = e("word.device").split("|");
	return `${s(e.lang, t, 0)} ${t === 1 ? n : r}`;
}
function Fl(e, t, n) {
	return n.length ? j`<p class="used-by">
    <ha-icon icon="mdi:link-variant"></ha-icon>
    <span class="used-by-label">${e("usedby.label")}</span>
    ${n.map((n) => {
		let r = n.count === void 0 ? n.label : `${n.label} (${Pl(e, n.count)})`;
		return n.to ? j`<a class="used-by-item" href=${k(t, n.to)} @click=${E(n.to)}>${r}</a>` : j`<span class="used-by-item">${r}</span>`;
	})}
  </p>` : j`<p class="used-by none"><ha-icon icon="mdi:link-variant-off"></ha-icon>${e("usedby.none")}</p>`;
}
//#endregion
//#region src/pages/household/head.ts
function Il(e, t, n, r, i) {
	return j`<div class="page-head">
    ${N(n)} ${S}
    <p class="lead">${r}</p>
    ${i ? Fl(e, t, i) : ""}
  </div>`;
}
function Ll(e, t, n) {
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
function Rl(e) {
	return `${String(Math.floor(e / 60)).padStart(2, "0")}:${String(e % 60).padStart(2, "0")}`;
}
function zl(e) {
	try {
		return new Intl.DateTimeFormat("en-CA", { timeZone: e }).format(/* @__PURE__ */ new Date());
	} catch {
		return new Intl.DateTimeFormat("en-CA").format(/* @__PURE__ */ new Date());
	}
}
//#endregion
//#region src/pages/household/styles.ts
var Bl = D`
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
`, Vl = [
	"vacation",
	"travel",
	"home_office",
	"office",
	"guests",
	"home"
];
function Hl(e) {
	let t = e;
	for (; t;) {
		let e = t.parentNode instanceof ShadowRoot ? t.parentNode.host : t.parentNode;
		if (e instanceof HTMLElement && e.scrollTop > 0) return e;
		t = e;
	}
	return document.scrollingElement;
}
var Ul = class extends P {
	constructor(...e) {
		super(...e), this.prefix = M, this.checks = [], this.keyword = {}, this.quiet = !1;
	}
	static {
		this.styles = [
			x,
			Bl,
			Uc,
			D`
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
		return !e || !t || !n ? T : j`<div class="wrap">
      ${Il(e, this.prefix, e("household.days.title"), e("household.days.lead"), Al(e, t.config, this.climateFound))}
      ${this.renderPreview(e, t)} ${this.renderFree(e, n, t)} ${this.renderCalendar(e, t)}
    </div>`;
	}
	renderPreview(e, t) {
		let r = t.climate?.day, i = t.config.persons, a = this.hass?.config?.time_zone, o = zl(a), s = t.plan?.meta?.tomorrow, c = s && s.date > o ? s : void 0, l = r ? r.holiday ? "holiday" : r.weekend && r.free ? "weekend" : "workday" : null, u = r?.labels_state ?? (r?.labels_at ? "ok" : "unread"), d = u === "ok" && r?.labels_at ? Ll(e.lang, r.labels_at, a) : null, f = t.climate, p = r ? !f?.home.length && f?.nobody_since ? "away" : r.holiday ? "holiday" : r.home_office.length && !r.free ? "home_office" : "normal" : null, m = null;
		if (c) {
			let e = (/* @__PURE__ */ new Date(`${c.date}T12:00:00Z`)).getUTCDay(), t = e === 0 || e === 6;
			m = c.workday ? Object.values(c.labels).includes("home_office") ? "home_office" : "normal" : t ? "normal" : "holiday";
		}
		let h = (t) => t ? j`<span class="chip ${t === "normal" ? "" : "soon"}"><ha-icon icon=${lc[t]}></ha-icon>${e(`week.tag.${t}`)}</span>` : T;
		return j`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:calendar-today"></ha-icon>${e("household.days.preview")}</div>
        ${n(e, "household_days_preview")}
      </div>
      <div class="preview">
        <div class="day">
          <div class="day-head">
            <b>${e("household.days.preview.today")} · ${W(e.lang, o, "weekday")}</b>${h(p)}
          </div>
          ${l ? j`<p class="now">${e(`climate.today.${l}`)}</p>` : j`<p class="hint">${e("household.days.preview.unknown")}</p>`}
          ${r ? j`<p class="hint">
                ${r.home_office_available ? u === "ok" ? r.home_office.length ? e("climate.today.ho", { names: r.home_office.join(", ") }) : e("climate.today.ho_none") : e(`climate.today.labels_${u}`) : e(`week.ho.${r.home_office_reason ?? "no_calendar"}`)}
                ${d ? e("climate.today.read_at", { time: d }) : T}
              </p>` : T}
        </div>
        <div class="day">
          <div class="day-head">
            <b>${e("household.days.preview.tomorrow")}${c ? j` · ${W(e.lang, c.date, "weekday")}` : T}</b>${h(m)}
          </div>
          ${c ? j`<p class="now">${e(c.workday ? "household.days.preview.workday" : "household.days.preview.day_off")}</p>
                ${Object.keys(c.labels).length ? j`<ul>
                      ${Object.entries(c.labels).map(([t, n]) => j`<li>
                            ${e("household.days.preview.person", {
			name: i.find((e) => e.id === t)?.name ?? t,
			label: e(`label.${n}`)
		})}
                          </li>`)}
                    </ul>` : T}` : j`<p class="hint">${e("household.days.preview.no_plan")}</p>`}
        </div>
      </div>
    </section>`;
	}
	renderFree(e, t, r) {
		let i = r.config, a = i.context.free_day_entities ?? [];
		return j`<section class="card">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:calendar-star"></ha-icon>${e("household.days.free")}</div>
      </div>
      ${Kc(e, [Jc(this, t, e, i, this.discovery, "holiday", (n) => vi(e, _i(t, n, c(t, n))))])}
      <div class="sub" data-tipped>
        <div class="row">
          <span>${e("climate.today.free_by")}</span>
          ${n(e, "climate_free_entities")}
        </div>
        <div class="row tight">
          <span class="chips-line">
            ${a.length ? a.map((e) => {
			let n = [
				"on",
				"true",
				"home"
			].includes(t.states[e]?.state ?? "");
			return j`<span class="chip ${n ? "ok" : ""}" title=${e}>${c(t, e)}</span>`;
		}) : j`<small class="hint">${e("climate.today.free_none")}</small>`}
          </span>
          <button type="button" class="btn btn-secondary" @click=${() => void this.pickFree()}>
            ${e(a.length ? "climate.today.free_change" : "climate.today.free_pick")}
          </button>
        </div>
      </div>
    </section>`;
	}
	async pickFree() {
		let e = this.t;
		if (!e) return;
		let t = await R(this, {
			heading: e("pick.free_day.title"),
			tip: "pick_free_day",
			filter: "toggle_like",
			multiple: !0,
			selected: this.state?.config.context.free_day_entities ?? []
		});
		t && L(this, { context: { free_day_entities: t.selected } });
	}
	renderCalendar(e, t) {
		let r = t.config, i = this.chosen(), a = !!i && !i.calendar, o = i?.calendar ?? r.calendar, s = (e) => o.rules.filter((t) => t.label === e), c = r.persons.some((e) => e.calendars.length), l = {
			tab: "household",
			section: "days"
		}, u = {
			tab: "household",
			section: "people"
		};
		return j`<section class="card" data-anchor="calendar" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:calendar-text-outline"></ha-icon>${e("learn.calendar")}</div>
        ${n(e, "learn_calendar")}
      </div>
      <p class="say">${e("learn.calendar.say")}</p>
      ${c ? T : j`<div class="note">
            <ha-icon icon="mdi:information-outline"></ha-icon>
            <span
              >${e("household.days.no_calendars")}
              <a href=${k(this.prefix, u)} @click=${E(u)}>${e("household.days.to_people")}</a></span
            >
          </div>`}
      ${r.persons.length ? j`<div data-tipped>
            <div class="sub-head"><b>${e("learn.calendar.for")}</b>${n(e, "cal_person")}</div>
            <nav class="scopes" aria-label=${e("learn.calendar.for")}>
              <a href=${k(this.prefix, l)} aria-current=${String(!i)} @click=${(e) => this.choose(e, l)}
                >${e("learn.calendar.everyone")}</a
              >
              ${r.persons.map((t) => {
			let n = {
				tab: "household",
				section: "days",
				id: t.id
			};
			return j`<a href=${k(this.prefix, n)} aria-current=${String(t.id === i?.id)} @click=${(e) => this.choose(e, n)}
                  >${t.name}${t.calendar ? j`<ha-icon class="own-rules" icon="mdi:account-cog-outline" title=${e("household.days.own_rules")}></ha-icon>` : T}</a
                >`;
		})}
            </nav>
          </div>` : T}
      ${this.person && !i ? j`<div class="note warn" role="status">
            <ha-icon icon="mdi:help-circle-outline"></ha-icon><span>${e("household.days.not_found")}</span>
          </div>` : T}
      ${i ? j`<div class="toggle-row" data-tipped>
            <span class="with-tip"><span id="cal-shared-label">${e("learn.calendar.shared")}</span>${n(e, "cal_shared")}</span>
            <button
              type="button"
              class="switch"
              role="switch"
              aria-checked=${String(a)}
              aria-labelledby="cal-shared-label"
              @click=${() => this.saveCalendar(i, a ? structuredClone(r.calendar) : null)}
            ></button>
          </div>` : T}
      ${a ? j`<p class="say">${e("learn.calendar.shared.say", { name: i.name })}</p>` : j`<div class="rules">
              ${Vl.map((t) => j`<div class="rule">
                  <b>${e(`label.${t}`)}</b>
                  <div class="keywords">
                    ${s(t).map((t) => j`<span class="keyword"
                          >${t.keyword}<button
                            type="button"
                            aria-label=${e("learn.calendar.remove", { keyword: t.keyword })}
                            @click=${() => this.saveRules(o.rules.filter((e) => e !== t))}
                          >
                            <ha-icon icon="mdi:close"></ha-icon></button
                        ></span>`)}
                    <form
                      class="add"
                      @submit=${(e) => {
			e.preventDefault(), this.addKeyword(o, t);
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
              <div class="sub-head"><b>${e("learn.calendar.defaults")}</b>${n(e, "cal_defaults")}</div>
              <div class="defaults">
                ${["default_workday", "default_day_off"].map((t) => j`<label class="field">
                    <span class="field-label">${e(`learn.calendar.${t}`)}</span>
                    <select
                      class="input"
                      @change=${(e) => this.saveCalendarPart({ [t]: e.target.value })}
                    >
                      ${zn.map((n) => j`<option value=${n} ?selected=${o[t] === n}>${e(`label.${n}`)}</option>`)}
                    </select>
                  </label>`)}
              </div>
            </div>`}
    </section>`;
	}
	choose(e, t) {
		if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
		e.preventDefault(), this.quiet = !0;
		let n = Hl(this), r = n?.scrollTop ?? 0;
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
		let t = Vl.flatMap((t) => e.filter((e) => e.label === t));
		this.saveCalendarPart({ rules: t });
	}
	saveCalendarPart(e) {
		let t = this.chosen();
		t?.calendar ? this.saveCalendar(t, {
			...t.calendar,
			...e
		}) : L(this, { calendar: e });
	}
	saveCalendar(e, t) {
		L(this, { persons: { [e.id]: { calendar: t } } });
	}
	willUpdate(e) {
		e.has("person") && (this.revealed = this.quiet ? this.person : void 0, this.quiet = !1, this.keyword = {});
	}
	updated() {
		this.person && this.revealed !== this.person && _e(this.renderRoot, "calendar") && (this.revealed = this.person);
	}
};
b([A({ attribute: !1 })], Ul.prototype, "hass", void 0), b([A({ attribute: !1 })], Ul.prototype, "t", void 0), b([A({ attribute: !1 })], Ul.prototype, "state", void 0), b([A({ attribute: !1 })], Ul.prototype, "route", void 0), b([A({ attribute: !1 })], Ul.prototype, "prefix", void 0), b([A({ attribute: !1 })], Ul.prototype, "discovery", void 0), b([A({ attribute: !1 })], Ul.prototype, "checks", void 0), b([A({ attribute: !1 })], Ul.prototype, "climateFound", void 0), b([A({ attribute: !1 })], Ul.prototype, "person", void 0), b([C()], Ul.prototype, "keyword", void 0), _("joe-hh-days", Ul);
//#endregion
//#region src/pages/household/night.ts
var Wl = "23:00", Gl = "06:30", Kl = class extends P {
	constructor(...e) {
		super(...e), this.prefix = M, this.checks = [];
	}
	static {
		this.styles = [
			x,
			Bl,
			D`
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
		return !e || !t || !this.hass ? T : j`<div class="wrap">
      ${Il(e, this.prefix, e("household.night.title"), e("household.night.lead"), jl(e, t.config, this.climateFound))}
      ${this.renderSource(e, t)} ${this.renderDevices(e, t)}
    </div>`;
	}
	renderSource(e, t) {
		let r = this.hass, i = t.config.climate, a = i?.night_by ?? "time", o = i?.night_entity ?? null, s = o ? r.states[o] : void 0;
		return j`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:weather-night"></ha-icon>${e("household.night.source")}</div>
        ${n(e, "climate_night_source")}
      </div>
      <div class="row">
        <span>${e("climate.night.by")}</span>
        <span class="seg" role="group" aria-label=${e("climate.night.by")}>
          ${["time", "entity"].map((t) => j`<button type="button" aria-pressed=${String(a === t)} @click=${() => this.setNightBy(t)}>
              ${e(`climate.night.by.${t}`)}
            </button>`)}
        </span>
      </div>
      ${a === "entity" ? j`<div class="row entity-row">
              <span>${o ? j`<b title=${o}>${c(r, o)}</b>` : e("climate.night.no_entity")}</span>
              ${s ? j`<span class="chip ${s.state === "on" ? "ok" : ""}"
                    >${e(s.state === "on" ? "climate.night.now_on" : "climate.night.now_off")}</span
                  >` : T}
              ${o ? vi(e, _i(r, o, c(r, o))) : T}
              <button type="button" class="btn btn-secondary" @click=${() => void this.pickNight()}>
                ${e(o ? "climate.night.change" : "climate.night.pick")}
              </button>
            </div>
            <p class="hint">${e("climate.night.entity_say")}</p>` : j`<p class="hint">${e("climate.night.time_say")}</p>`}
    </section>`;
	}
	renderDevices(e, t) {
		let n = t.config.climate, r = n?.night_by === "entity", i = Object.fromEntries((this.climateFound?.devices ?? []).map((e) => [e.entity_id, e.name])), a = Object.entries(n?.rooms ?? {}).filter(([, e]) => e.night_off), o = {
			tab: "devices",
			section: "climate"
		};
		return j`<section class="card">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:power-sleep"></ha-icon>${e("household.night.devices")}</div>
      </div>
      ${a.length ? j`<ul class="devices">
            ${a.map(([t, a]) => {
			let o = {
				tab: "devices",
				section: "climate",
				id: t
			}, s = a.night_from || Wl, l = a.night_until || Gl;
			return j`<li>
                <a href=${k(this.prefix, o)} @click=${E(o)}>
                  <b>${i[t] ?? c(this.hass, t)}</b>
                  <span>${r ? e("household.night.until", { until: l }) : e("household.night.span", {
				from: s,
				until: l
			})}</span>
                  ${a.enabled && n?.enabled ? T : j`<small class="hint">${e("household.night.not_steered")}</small>`}
                  <ha-icon icon="mdi:chevron-right"></ha-icon>
                </a>
              </li>`;
		})}
          </ul>` : j`<p class="hint">${e("household.night.devices.none")}</p>`}
      <a class="go-link" href=${k(this.prefix, o)} @click=${E(o)}>${e("household.night.to_climate")}</a>
    </section>`;
	}
	setNightBy(e) {
		L(this, { climate: { night_by: e } }), e === "entity" && !this.state?.config.climate?.night_entity && this.pickNight();
	}
	async pickNight() {
		let e = this.t;
		if (!e) return;
		let t = this.state?.config.climate?.night_entity, n = await R(this, {
			heading: e("pick.night.title"),
			tip: "pick_night",
			filter: "night",
			selected: t ? [t] : []
		});
		n && L(this, { climate: {
			night_by: "entity",
			night_entity: n.selected[0] ?? null
		} });
	}
};
b([A({ attribute: !1 })], Kl.prototype, "hass", void 0), b([A({ attribute: !1 })], Kl.prototype, "t", void 0), b([A({ attribute: !1 })], Kl.prototype, "state", void 0), b([A({ attribute: !1 })], Kl.prototype, "route", void 0), b([A({ attribute: !1 })], Kl.prototype, "prefix", void 0), b([A({ attribute: !1 })], Kl.prototype, "discovery", void 0), b([A({ attribute: !1 })], Kl.prototype, "checks", void 0), b([A({ attribute: !1 })], Kl.prototype, "climateFound", void 0), _("joe-hh-night", Kl);
//#endregion
//#region src/household-helpers.ts
var ql = "gast";
function Jl(e) {
	return Object.values(e.states).filter((e) => e.entity_id.startsWith("group.")).map((e) => ({
		state: e,
		members: e.attributes.entity_id ?? []
	})).filter(({ members: e }) => e.length && e.every((e) => /^(person|device_tracker)\./.test(e))).map(({ state: t, members: n }) => ({
		entity_id: t.entity_id,
		name: c(e, t.entity_id),
		members: n.map((t) => c(e, t))
	}));
}
async function Yl(e, t, n) {
	if (!t.callApi || !t.callService) throw Error("no api");
	let r = `input_boolean.${(await t.callWS({
		type: "input_boolean/create",
		name: n("household.guest.name"),
		icon: "mdi:account-child-outline"
	})).id}`, i = `device_tracker.${ql}`;
	return await t.callApi("POST", `config/automation/config/energy_joe_${ql}`, {
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
				dev_id: ql,
				host_name: n("household.guest.tracker_name"),
				location_name: `{{ 'home' if is_state('${r}', 'on') else 'not_home' }}`
			}
		}],
		mode: "queued"
	}), await t.callService("device_tracker", "see", {
		dev_id: ql,
		host_name: n("household.guest.tracker_name"),
		location_name: "not_home"
	}), L(e, { context: {
		guest_switch: r,
		guest_tracker: i
	} }), i;
}
function Xl(e, t) {
	let n = e.states[t]?.state === "on";
	e.callService?.("input_boolean", n ? "turn_off" : "turn_on", { entity_id: t });
}
//#endregion
//#region src/editors/household.ts
var Zl = class extends P {
	constructor(...e) {
		super(...e), this.detailed = !1;
	}
	static {
		this.styles = [x, D`
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
		let { t: e, hass: t, config: r } = this;
		if (!e || !t || !r) return T;
		let i = (this.discovery?.persons ?? []).filter((e) => I(r, `person:${e.entity_id}`) && !r.persons.some((t) => t.id === e.entity_id));
		return j`${r.persons.length ? j`<ul>
            ${r.persons.map((n) => this.renderPerson(e, t, n))}
          </ul>` : j`<p class="empty">${e("household.empty")}</p>`}
      <div class="with-tip add" data-tipped>
        <button type="button" class="mini-btn" @click=${this.addPerson}>
          <ha-icon icon="mdi:account-plus-outline"></ha-icon>${e("household.add")}
        </button>
        ${n(e, "f_person_add")}
      </div>
      ${i.length ? j`<div class="others" data-tipped>
            <span>${e("household.left_out")}</span>
            ${i.map((e) => j`<button type="button" class="mini-btn quiet" @click=${() => this.bringBack(e)}>
                <ha-icon icon="mdi:undo-variant"></ha-icon>${e.name}
              </button>`)}
            ${n(e, "household_left_out")}
          </div>` : T}`;
	}
	renderPerson(e, t, r) {
		let i = r.person_entity ? t.states[r.person_entity]?.state : void 0, a = i === "home" ? j`<small class="home">${e("household.home")}</small>` : i === "not_home" ? j`<small>${e("household.away")}</small>` : i ? j`<small>${e("household.zone", { zone: i })}</small>` : j`<small>${e("household.no_presence")}</small>`;
		return j`<li class="person" data-anchor=${this.detailed ? r.id : T}>
      <div class="top" data-tipped>
        <span class="avatar" aria-hidden="true">${r.name.slice(0, 1).toUpperCase()}</span>
        <div class="who"><b>${r.name}</b>${a}</div>
        <span class="top-actions">
          ${this.detailed ? vi(e, _i(t, r.person_entity, r.name)) : T}
          <button type="button" class="mini-btn quiet" @click=${() => this.removePerson(r)}>
            ${e("household.remove")}
          </button>
          ${n(e, "household_remove")}
        </span>
      </div>
      <div class="cals" data-tipped>
        <span class="cals-label">${e("household.calendars")}</span>
        ${r.calendars.map((n) => j`<span class="cal">
            ${c(t, n)}
            <button
              type="button"
              aria-label=${e("household.calendar_remove", { name: c(t, n) })}
              @click=${() => this.setCalendars(r, r.calendars.filter((e) => e !== n))}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </span>`)}
        <button type="button" class="mini-btn" @click=${() => this.addCalendars(r)}>
          <ha-icon icon="mdi:calendar-plus"></ha-icon>${e("household.calendar_add")}
        </button>
        ${n(e, "f_calendars")}
      </div>
      ${this.detailed ? j`<slot name=${`p:${r.id}`}></slot>` : T}
    </li>`;
	}
	async addPerson() {
		let { t: e, config: t } = this;
		if (!e || !t) return;
		let n = (await R(this, {
			heading: e("pick.person.title"),
			tip: "pick_person",
			filter: "person",
			selected: [],
			exclude: t.persons.map((e) => e.person_entity).filter((e) => !!e)
		}))?.selected[0];
		if (!n || !this.hass) return;
		let r = this.discovery?.persons.find((e) => e.entity_id === n);
		L(this, {
			persons: { [n]: {
				name: c(this.hass, n),
				person_entity: n,
				calendars: r?.calendars ?? []
			} },
			answers: { ignored: Qe(t, `person:${n}`, !1) }
		});
	}
	bringBack(e) {
		L(this, {
			persons: { [e.entity_id]: {
				name: e.name,
				person_entity: e.entity_id,
				calendars: e.calendars
			} },
			answers: { ignored: Qe(this.config, `person:${e.entity_id}`, !1) }
		});
	}
	removePerson(e) {
		L(this, {
			persons: { [e.id]: null },
			answers: { ignored: Qe(this.config, `person:${e.id}`, !0) }
		});
	}
	async addCalendars(e) {
		let t = this.t;
		if (!t) return;
		let n = await R(this, {
			heading: t("pick.calendar.title", { name: e.name }),
			tip: "pick_calendar",
			filter: "calendar",
			multiple: !0,
			selected: e.calendars
		});
		n && this.setCalendars(e, n.selected);
	}
	setCalendars(e, t) {
		L(this, { persons: { [e.id]: { calendars: t } } });
	}
};
b([A({ attribute: !1 })], Zl.prototype, "hass", void 0), b([A({ attribute: !1 })], Zl.prototype, "t", void 0), b([A({ attribute: !1 })], Zl.prototype, "config", void 0), b([A({ attribute: !1 })], Zl.prototype, "discovery", void 0), b([A({ type: Boolean })], Zl.prototype, "detailed", void 0);
var Ql = class extends P {
	constructor(...e) {
		super(...e), this.card = !1, this.leftOut = [], this.guest = !0, this.creating = !1, this.offerNew = !1;
	}
	static {
		this.styles = [x, D`
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
		let { t: e, hass: t, config: r } = this;
		if (!e || !t || !r) return T;
		let i = r.context.presence_entity, a = this.card ? j`<div class="head">
          <div class="eyebrow"><ha-icon icon="mdi:account-check-outline"></ha-icon>${e("household.presence")}</div>
          ${n(e, "household_presence")}
        </div>` : j`<div class="with-tip"><b>${e("household.presence")}</b>${n(e, "household_presence")}</div>`;
		if (i) {
			let n = ["on", "home"].includes(t.states[i]?.state ?? "");
			return j`<div class="presence" data-tipped>
        ${a}
        <div class="row">
          <span class="chip ${n ? "ok" : ""}" title=${i}>${c(t, i)}</span>
          <small>${e(n ? "household.presence.on" : "household.presence.off")}</small>
          ${vi(e, _i(t, i, c(t, i)))}
        </div>
        <p>${e(i.startsWith("group.") ? "household.presence.yours_group" : "household.presence.yours")}</p>
        ${this.renderGuest(e, t, r, i)}
        <div class="row">
          <button type="button" class="mini-btn" @click=${() => void this.pickPresence()}>${e("household.presence.other")}</button>
          <button type="button" class="mini-btn quiet" @click=${() => L(this, { context: { presence_entity: null } })}>
            ${e("household.presence.stop")}
          </button>
        </div>
      </div>`;
		}
		let o = r.persons.filter((e) => e.person_entity), s = o.filter((e) => !this.leftOut.includes(e.person_entity)), l = Jl(t);
		return l.length && !this.offerNew ? j`<div class="presence" data-tipped>
        ${a}
        <p>${e("household.presence.found")}</p>
        ${l.map((t) => j`<div class="row">
            <span class="chip" title=${t.entity_id}>${t.name}</span>
            <small>${t.members.join(", ")}</small>
            <button type="button" class="btn btn-primary" @click=${() => L(this, { context: { presence_entity: t.entity_id } })}>
              ${e("household.presence.use")}
            </button>
          </div>`)}
        <div class="row">
          <button type="button" class="btn btn-ghost" @click=${() => this.offerNew = !0}>${e("household.presence.new_instead")}</button>
        </div>
      </div>` : j`<div class="presence" data-tipped>
      ${a}
      <p>${e("household.presence.propose")}</p>
      <div class="row" role="group" aria-label=${e("household.presence.persons")}>
        ${o.map((e) => {
			let t = !this.leftOut.includes(e.person_entity);
			return j`<button
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
      ${this.failed ? j`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.failed}</span></div>` : T}
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
	renderGuest(e, t, r, i) {
		let { guest_switch: a, guest_tracker: o } = r.context;
		if (!a || !o) return j`<div class="guest" data-tipped>
        <div class="with-tip"><b>${e("household.guest")}</b>${n(e, "household_guest")}</div>
        <p>${e("household.guest.offer")}</p>
        ${this.failed ? j`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.failed}</span></div>` : T}
        <div class="row">
          <button type="button" class="btn btn-secondary" ?disabled=${this.creating} @click=${() => void this.addGuest()}>
            ${e(this.creating ? "household.presence.creating" : "household.guest.create")}
          </button>
        </div>
      </div>`;
		let s = t.states[a]?.state === "on", l = t.states[i]?.attributes.entity_id, u = !l || l.includes(o);
		return j`<div class="guest" data-tipped>
      <div class="row">
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(s)}
          aria-labelledby="guest-label"
          @click=${() => void t.callService?.("input_boolean", s ? "turn_off" : "turn_on", { entity_id: a })}
        ></button>
        <b id="guest-label">${e("household.guest")}</b>
        <small>${e(t.states[o]?.state === "home" ? "household.guest.home" : "household.guest.away")}</small>
        ${n(e, "household_guest")}
      </div>
      ${u ? T : j`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon>
            <span>${e("household.guest.add_to_group", { group: c(t, i) })}<code>- ${o}</code></span>
          </div>`}
    </div>`;
	}
	async addGuest() {
		let { t: e, hass: t } = this;
		if (e && t) {
			this.creating = !0, this.failed = void 0;
			try {
				await Yl(this, t, e);
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
				let r = this.guest ? this.config?.context.guest_tracker ?? await Yl(this, n, t) : null;
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
		let t = this.config?.context.presence_entity, n = await R(this, {
			heading: e("pick.presence.title"),
			tip: "pick_presence",
			filter: "presence",
			selected: t ? [t] : []
		});
		n?.selected[0] && L(this, { context: { presence_entity: n.selected[0] } });
	}
};
b([A({ attribute: !1 })], Ql.prototype, "hass", void 0), b([A({ attribute: !1 })], Ql.prototype, "t", void 0), b([A({ attribute: !1 })], Ql.prototype, "config", void 0), b([A({ attribute: !1 })], Ql.prototype, "discovery", void 0), b([A({
	type: Boolean,
	reflect: !0
})], Ql.prototype, "card", void 0), b([C()], Ql.prototype, "leftOut", void 0), b([C()], Ql.prototype, "guest", void 0), b([C()], Ql.prototype, "creating", void 0), b([C()], Ql.prototype, "failed", void 0), b([C()], Ql.prototype, "offerNew", void 0);
var $l = class extends P {
	static {
		this.styles = D`
    :host {
      display: block;
    }
  `;
	}
	render() {
		return j`<joe-household-people
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
b([A({ attribute: !1 })], $l.prototype, "hass", void 0), b([A({ attribute: !1 })], $l.prototype, "t", void 0), b([A({ attribute: !1 })], $l.prototype, "config", void 0), b([A({ attribute: !1 })], $l.prototype, "discovery", void 0), _("joe-household-people", Zl), _("joe-household-presence", Ql), _("joe-household", $l);
//#endregion
//#region src/pages/household/people.ts
var eu = class extends P {
	constructor(...e) {
		super(...e), this.prefix = M, this.checks = [];
	}
	static {
		this.styles = [
			x,
			Bl,
			D`
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
		if (!e || !t || !this.hass) return T;
		let r = t.config, i = [...kl(e, r, this.climateFound), ...Al(e, r, this.climateFound)], a = !(!this.person || r.persons.some((e) => e.id === this.person));
		return j`<div class="wrap">
      ${Il(e, this.prefix, e("household.people.title"), e("household.people.lead"), i.filter((e, t) => i.findIndex((t) => t.label === e.label) === t))}
      ${a ? j`<div class="note warn" role="status">
            <ha-icon icon="mdi:help-circle-outline"></ha-icon><span>${e("nav.not_found.person")}</span>
          </div>` : T}
      <div class="list-head">
        <span class="eyebrow"><ha-icon icon="mdi:account-group-outline"></ha-icon>${e("household.people.list")}</span>
        ${n(e, "ha_open")}
      </div>
      <joe-household-people
        detailed
        .hass=${this.hass}
        .t=${e}
        .config=${r}
        .discovery=${this.discovery}
      >
        ${r.persons.map((n) => this.renderExtra(e, t, n))}
      </joe-household-people>
    </div>`;
	}
	renderExtra(e, t, n) {
		let r = t.config, i = t.climate?.day, a = t.plan?.meta?.tomorrow, o = a && a.date > zl(this.hass?.config?.time_zone) ? a : void 0, c = [];
		i?.home_office_available && i.labels_state !== "error" && i.home_office.includes(n.name) && c.push(e("household.people.today", { label: e("label.home_office") }));
		let l = o?.labels[n.id];
		l && c.push(e("household.people.tomorrow", { label: e(`label.${l}`) }));
		let u = n.calendars.length > 0, d = Nl(e, r, n.id), f = r.learned.presence?.[n.id] ?? {}, p = zn.filter((e) => f[e]).map((t) => e("learn.presence.value", {
			label: e(`label.${t}`),
			hours: s(e.lang, f[t].hours, 0)
		})), m = n.person_entity ? t.climate?.usual?.[n.person_entity] : void 0;
		m != null && p.push(e("household.people.usual", { time: Rl(m) }));
		let h = {
			tab: "household",
			section: "days",
			id: n.id
		};
		return j`<div class="extra" slot=${`p:${n.id}`}>
      ${c.length ? j`<p class="days">${c.join(" · ")}</p>` : T}
      ${u ? j`${this.mirror(e("household.people.rules"), e(n.calendar ? "household.people.rules.own" : "household.people.rules.shared"), h, e("mirror.change"))}
            <p class="used-by ${d.length ? "" : "none"}">
              <ha-icon icon=${d.length ? "mdi:car-clock" : "mdi:link-variant-off"}></ha-icon>
              ${d.length ? j`<span class="used-by-label">${e("household.people.counts")}</span>
                    ${d.map((e) => j`<a class="used-by-item" href=${k(this.prefix, e.to)} @click=${E(e.to)}
                          >${e.label}</a
                        >`)}` : e("household.people.counts.none")}
            </p>` : T}
      ${this.mirror(e("household.people.learned"), n.person_entity ? p.length ? p.join(" · ") : e("household.people.learned.none") : e("learn.presence.no_person"), {
			tab: "review",
			section: "learned",
			id: "presence"
		}, e("household.people.more"))}
    </div>`;
	}
	mirror(e, t, n, r) {
		return j`<div class="mirror">
      <div class="mirror-text">
        <span class="mirror-label">${e}</span>
        <span class="mirror-sep" aria-hidden="true">·</span>
        <span class="mirror-value">${t}</span>
      </div>
      <a class="mini-btn go mirror-go" href=${k(this.prefix, n)} @click=${E(n)}>${r}</a>
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
		t && (await t.updateComplete, t.shadowRoot && _e(t.shadowRoot, e) && (this.revealed = e));
	}
};
b([A({ attribute: !1 })], eu.prototype, "hass", void 0), b([A({ attribute: !1 })], eu.prototype, "t", void 0), b([A({ attribute: !1 })], eu.prototype, "state", void 0), b([A({ attribute: !1 })], eu.prototype, "route", void 0), b([A({ attribute: !1 })], eu.prototype, "prefix", void 0), b([A({ attribute: !1 })], eu.prototype, "discovery", void 0), b([A({ attribute: !1 })], eu.prototype, "checks", void 0), b([A({ attribute: !1 })], eu.prototype, "climateFound", void 0), b([A({ attribute: !1 })], eu.prototype, "person", void 0), _("joe-hh-people", eu);
//#endregion
//#region src/pages/household/presence.ts
var tu = 15, nu = 240, ru = "https://my.home-assistant.io/redirect/config_flow_start/?domain=proximity";
function iu(e, t, n) {
	let r = t.routing;
	if (r.service === "google") {
		let t = n?.routing?.google.find((e) => e.entry_id === r.google_entry);
		return e("settings.routing.google", { name: t?.title ?? "Google" });
	}
	return e(r.service ? `settings.routing.${r.service}` : "settings.routing.none");
}
var au = class extends P {
	constructor(...e) {
		super(...e), this.prefix = M, this.checks = [];
	}
	static {
		this.styles = [
			x,
			Bl,
			D`
      .way-list {
        margin: 6px 0 0;
      }
    `
		];
	}
	render() {
		let { t: e, state: t } = this;
		if (!e || !t || !this.hass) return T;
		let n = t.config;
		return j`<div class="wrap">
      ${Il(e, this.prefix, e("household.presence.title"), e("household.presence.lead"), kl(e, n, this.climateFound))}
      ${this.renderLive(e, t)}
      <joe-household-presence card .hass=${this.hass} .t=${e} .config=${n} .discovery=${this.discovery}></joe-household-presence>
      ${this.renderWay(e, n)}
    </div>`;
	}
	renderLive(e, t) {
		let r = t.climate, i = r?.home ?? [], a = Object.entries(r?.arrivals ?? this.climateFound?.arrivals ?? {}), o = Object.fromEntries(t.config.persons.map((e) => [e.person_entity, e.name])), c = t.config.climate?.away_after_min ?? tu;
		return j`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:home-account"></ha-icon>${e("household.presence.now")}</div>
        ${n(e, "climate_presence")}
      </div>
      <p class="now">${i.length ? e("climate.home", { names: i.join(", ") }) : e("climate.nobody")}</p>
      ${a.map(([t, n]) => j`<p class="hint">
          ${e(`climate.way.${n.direction === "towards" ? "towards" : n.direction === "away_from" ? "away" : "other"}`, {
			name: o[t] ?? this.hass?.states[t]?.attributes.friendly_name ?? t,
			km: n.km == null ? "–" : s(e.lang, n.km, 1)
		})}
          ${n.direction === "towards" && n.minutes != null ? e(n.source ? "climate.way.minutes_route" : "climate.way.minutes_guess", { minutes: n.minutes }) : T}
        </p>`)}
      <div class="row" data-tipped>
        <span>${e("climate.away_after")}</span>
        <input
          class="input short"
          type="number"
          inputmode="numeric"
          min="0"
          max=${nu}
          step="1"
          aria-label=${e("climate.away_after")}
          .value=${String(c)}
          @change=${(e) => {
			let t = e.target, n = Math.round(Number.parseFloat(t.value.replace(",", ".")));
			if (!Number.isFinite(n)) {
				t.value = String(c);
				return;
			}
			let r = Math.min(nu, Math.max(0, n));
			t.value = String(r), L(this, { climate: { away_after_min: r } });
		}}
        />
        <span>${e("climate.away_after.unit")}</span>
        ${n(e, "climate_away_after")}
      </div>
    </section>`;
	}
	renderWay(e, t) {
		let r = t.climate?.route_eta ?? !0;
		return j`<section class="card" data-anchor="way" data-tipped>
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
          aria-checked=${String(r)}
          aria-labelledby="route-eta"
          @click=${() => L(this, { climate: { route_eta: !r } })}
        ></button>
        ${n(e, "climate_route_eta")}
      </div>
      ${J(e, this.prefix, {
			label: e("household.presence.routing"),
			value: iu(e, t, this.info),
			to: {
				tab: "household",
				section: "travel"
			},
			action: t.routing.service ? "change" : "set"
		})}
      ${this.climateFound && !this.climateFound.proximity ? j`<p class="hint">
            ${e("climate.no_proximity")}
            <a href=${ru} target="_blank" rel="noreferrer noopener">${e("climate.add_proximity")}</a>
          </p>` : T}
    </section>`;
	}
	willUpdate(e) {
		e.has("anchor") && (this.revealed = void 0);
	}
	updated() {
		this.anchor && this.revealed !== this.anchor && _e(this.renderRoot, this.anchor) && (this.revealed = this.anchor);
	}
};
b([A({ attribute: !1 })], au.prototype, "hass", void 0), b([A({ attribute: !1 })], au.prototype, "t", void 0), b([A({ attribute: !1 })], au.prototype, "state", void 0), b([A({ attribute: !1 })], au.prototype, "route", void 0), b([A({ attribute: !1 })], au.prototype, "prefix", void 0), b([A({ attribute: !1 })], au.prototype, "discovery", void 0), b([A({ attribute: !1 })], au.prototype, "checks", void 0), b([A({ attribute: !1 })], au.prototype, "climateFound", void 0), b([A({ attribute: !1 })], au.prototype, "info", void 0), b([A({ attribute: !1 })], au.prototype, "anchor", void 0), _("joe-hh-presence", au);
//#endregion
//#region src/pages/household/travel.ts
var ou = class extends P {
	constructor(...e) {
		super(...e), this.prefix = M, this.checks = [];
	}
	static {
		this.styles = [
			x,
			Bl,
			Uc,
			D`
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
		if (!e || !t || !n) return T;
		let r = t.config;
		return j`<div class="wrap">
      ${Il(e, this.prefix, e("household.travel.title"), e("household.travel.lead"), null)}
      <section class="card">
        ${Kc(e, [Jc(this, n, e, r, this.discovery, "weather", (t) => vi(e, _i(n, t, c(n, t))))])}
        ${Fl(e, this.prefix, Ml(e, r, "weather", this.climateFound))}
      </section>
      ${this.renderRouting(e, t)}
    </div>`;
	}
	renderRouting(e, t) {
		let r = t.config.routing, i = this.info?.routing, a = r.service === "google" ? `google:${r.google_entry ?? ""}` : r.service ?? "", o = (e) => {
			e.startsWith("google:") ? L(this, { routing: {
				service: "google",
				google_entry: e.slice(7) || null
			} }) : L(this, { routing: {
				service: e || null,
				google_entry: null
			} });
		}, s = (t) => j`<div class="field" data-tipped>
      <span class="field-label"><label for="routing-${t}">${e(`settings.routing.${t}`)}</label>${n(e, "routing_osm")}</span>
      <small class="field-hint">${e(`settings.routing.${t}.hint`)}</small>
      <input
        id="routing-${t}"
        class="input"
        type="url"
        .value=${r[t]}
        @change=${(e) => {
			let n = e.target.value.trim();
			n.startsWith("http") && L(this, { routing: { [t]: n } });
		}}
      />
    </div>`;
		return j`<section class="card">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:map-marker-distance"></ha-icon>${e("settings.routing")}</div>
      </div>
      <p class="say">${e("settings.routing.intro")}</p>
      <div class="field" data-tipped>
        <span class="field-label"><label for="routing-service">${e("settings.routing.service")}</label>${n(e, "routing_service")}</span>
        <small class="field-hint">${e("settings.routing.service.hint")}</small>
        <select id="routing-service" class="input" @change=${(e) => o(e.target.value)}>
          <option value="" ?selected=${a === ""}>${e("settings.routing.none")}</option>
          ${i?.waze === !1 ? T : j`<option value="waze" ?selected=${a === "waze"}>${e("settings.routing.waze")}</option>`}
          ${(i?.google ?? []).map((t) => j`<option value=${`google:${t.entry_id}`} ?selected=${a === `google:${t.entry_id}`}>
                ${e("settings.routing.google", { name: t.title })}
              </option>`)}
          <option value="osm" ?selected=${a === "osm"}>${e("settings.routing.osm")}</option>
        </select>
      </div>
      ${r.service === "osm" ? j`${s("geocoder_url")} ${s("router_url")}` : T}
      ${Fl(e, this.prefix, Ml(e, t.config, "routing", this.climateFound))}
    </section>`;
	}
};
b([A({ attribute: !1 })], ou.prototype, "hass", void 0), b([A({ attribute: !1 })], ou.prototype, "t", void 0), b([A({ attribute: !1 })], ou.prototype, "state", void 0), b([A({ attribute: !1 })], ou.prototype, "route", void 0), b([A({ attribute: !1 })], ou.prototype, "prefix", void 0), b([A({ attribute: !1 })], ou.prototype, "discovery", void 0), b([A({ attribute: !1 })], ou.prototype, "checks", void 0), b([A({ attribute: !1 })], ou.prototype, "climateFound", void 0), b([A({ attribute: !1 })], ou.prototype, "info", void 0), _("joe-hh-travel", ou);
//#endregion
//#region src/pages/household/index.ts
var su = {
	people: "joe-hh-people",
	presence: "joe-hh-presence",
	days: "joe-hh-days",
	night: "joe-hh-night",
	travel: "joe-hh-travel"
}, cu = {
	people: "mdi:account-group-outline",
	presence: "mdi:home-account",
	days: "mdi:calendar-check-outline",
	night: "mdi:sleep",
	travel: "mdi:map-marker-path"
}, lu = class extends P {
	constructor(...e) {
		super(...e), this.prefix = M, this.checks = [];
	}
	static {
		this.styles = [x, D`
      :host {
        display: block;
      }
    `];
	}
	render() {
		let e = this.t;
		if (!e || !this.state) return T;
		let t = this.route?.section ?? ye.household, n = me.household.map((t) => ({
			id: t,
			label: e(`nav.household.${t}`),
			icon: cu[t]
		}));
		return j`${ni(e, this.prefix, "household", n, t)}${this.renderSection(t)}`;
	}
	renderSection(e) {
		if (!customElements.get(su[e])) return j``;
		let { t, hass: n, state: r, prefix: i, route: a, discovery: o, checks: s, climateFound: c, info: l } = this;
		switch (e) {
			case "people": return j`<joe-hh-people
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
			case "presence": return j`<joe-hh-presence
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
			case "days": return j`<joe-hh-days
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
			case "night": return j`<joe-hh-night
          .t=${t}
          .hass=${n}
          .state=${r}
          .prefix=${i}
          .route=${a}
          .discovery=${o}
          .checks=${s}
          .climateFound=${c}
        ></joe-hh-night>`;
			case "travel": return j`<joe-hh-travel
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
b([A({ attribute: !1 })], lu.prototype, "hass", void 0), b([A({ attribute: !1 })], lu.prototype, "t", void 0), b([A({ attribute: !1 })], lu.prototype, "state", void 0), b([A({ attribute: !1 })], lu.prototype, "route", void 0), b([A({ attribute: !1 })], lu.prototype, "prefix", void 0), b([A({ attribute: !1 })], lu.prototype, "discovery", void 0), b([A({ attribute: !1 })], lu.prototype, "checks", void 0), b([A({ attribute: !1 })], lu.prototype, "climateFound", void 0), b([A({ attribute: !1 })], lu.prototype, "info", void 0), _("joe-household-page", lu);
//#endregion
//#region src/components/chart.ts
var uu = 40, du = 10, fu = 16, pu = 24;
function mu(e) {
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
function hu(e) {
	let t = [], n = [];
	return e.forEach((e, r) => {
		e == null ? (n.length && t.push(n), n = []) : n.push([r, e]);
	}), n.length && t.push(n), t;
}
var gu = class extends P {
	constructor(...e) {
		super(...e), this.labels = [], this.ticks = /* @__PURE__ */ new Map(), this.series = [], this.bands = [], this.markers = [], this.unit = "kWh", this.max = 0, this.height = 220, this.label = "", this.lang = "de", this.centerTicks = !1, this.width = 640, this.hover = null;
	}
	static {
		this.styles = D`
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
		if (!e) return T;
		let t = Math.max(260, this.width), n = this.height, r = t - uu - du, i = n - fu - pu, a = r / e, o = this.series.flatMap((e) => e.values.filter((e) => e != null)), s = this.max || mu(Math.max(.1, ...o)), c = Math.min(0, ...o), l = c < 0 ? -Math.max(mu(-c), s / 4) : 0, u = (e) => fu + i - (Math.max(l, Math.min(e, s)) - l) / (s - l) * i, d = (e) => uu + e * a, f = (e) => uu + (e + .5) * a, p = (e, t = 2) => new Intl.NumberFormat(this.lang, { maximumFractionDigits: t }).format(e), m = [];
		for (let e of this.bands) m.push(pe`<rect class="band" x=${d(e.from)} y=${fu} width=${Math.max(0, d(e.to) - d(e.from))} height=${i}></rect>
        <text class="note" x=${(d(e.from) + d(e.to)) / 2} y=${28} text-anchor="middle">${e.label}</text>`);
		for (let e of l < 0 ? [
			l,
			0,
			s
		] : [
			0,
			s / 2,
			s
		]) m.push(pe`<line class="grid" x1=${uu} x2=${t - du} y1=${u(e)} y2=${u(e)}></line>
        <text class="tick" x=${34} y=${u(e) + 4} text-anchor="end">${p(e, 2)}</text>`);
		m.push(pe`<text class="tick" x=${34} y=${11} text-anchor="end">${this.unit}</text>`);
		for (let [e, t] of this.ticks) m.push(pe`<text class="tick" x=${this.centerTicks ? f(e) : d(e)} y=${n - 6}
        text-anchor="middle">${t}</text>`);
		let h = this.series.filter((e) => e.kind === "bar"), g = a * .68 / Math.max(1, h.length);
		for (let e of this.series) {
			if (e.kind === "bar") {
				let t = a * .16 + h.indexOf(e) * g;
				e.values.forEach((n, r) => {
					if (n != null && n !== 0) {
						let i = Math.min(u(n), u(0));
						m.push(pe`<rect x=${d(r) + t} y=${i} width=${Math.max(1, g - 1)}
              height=${Math.max(1, Math.abs(u(0) - u(n)))} rx="2"
              fill=${n < 0 ? e.negative ?? e.color : e.color}></rect>`);
					}
				});
				continue;
			}
			for (let t of hu(e.values)) {
				let n = t.map(([e, t]) => `${f(e).toFixed(1)},${u(t).toFixed(1)}`).join(" ");
				if (e.kind === "area" && t.length > 1) {
					let r = u(0).toFixed(1);
					m.push(pe`<polygon points=${`${f(t[0][0]).toFixed(1)},${r} ${n} ${f(t[t.length - 1][0]).toFixed(1)},${r}`}
            fill=${e.fill ?? e.color}></polygon>`);
				}
				t.length > 1 ? m.push(pe`<polyline points=${n} fill="none" stroke=${e.color} stroke-width=${e.kind === "line" ? 2.4 : 2}
            stroke-linejoin="round" stroke-dasharray=${e.dashed ? "5 4" : "none"}></polyline>`) : m.push(pe`<circle cx=${f(t[0][0])} cy=${u(t[0][1])} r="2.5" fill=${e.color}></circle>`);
			}
		}
		for (let e of this.markers) {
			let n = uu + e.at * a, o = n < uu + r * .75;
			m.push(pe`<line class="marker" x1=${n} x2=${n} y1=${fu} y2=${fu + i}></line>
        <text class="note" x=${o ? n + 4 : n - 4} y=${28} text-anchor=${o ? "start" : "end"}>
          ${t < 520 ? e.short ?? e.label : e.label}
        </text>`);
		}
		this.hover != null && m.push(pe`<line class="guide" x1=${f(this.hover)} x2=${f(this.hover)} y1=${fu} y2=${fu + i}></line>`);
		for (let t = 0; t < e; t++) m.push(pe`<rect class="slot" x=${d(t)} y=${fu} width=${a} height=${i}
        @pointerenter=${() => this.hover = t} @click=${() => this.hover = t}></rect>`);
		return j`<svg
        viewBox="0 0 ${t} ${n}"
        height=${n}
        role="img"
        aria-label=${this.label}
        @pointerleave=${(e) => e.pointerType === "mouse" && (this.hover = null)}
      >
        ${m}
      </svg>
      ${this.hover == null ? T : this.renderBox(this.hover, f(this.hover), t, p)}`;
	}
	renderBox(e, t, n, r) {
		let i = t + 182 > n ? Math.max(0, t - 182) : t + 12;
		return j`<div class="box" style="left:${i}px">
      <b>${this.labels[e]}</b>
      ${this.series.map((t) => {
			let n = t.values[e];
			return n == null ? T : j`<div>
              <i style="background:${n < 0 ? t.negative ?? t.color : t.color}"></i><span>${t.label}</span
              ><em>${r(n, t.digits ?? 2)} ${this.unit}</em>
            </div>`;
		})}
    </div>`;
	}
};
b([A({ attribute: !1 })], gu.prototype, "labels", void 0), b([A({ attribute: !1 })], gu.prototype, "ticks", void 0), b([A({ attribute: !1 })], gu.prototype, "series", void 0), b([A({ attribute: !1 })], gu.prototype, "bands", void 0), b([A({ attribute: !1 })], gu.prototype, "markers", void 0), b([A()], gu.prototype, "unit", void 0), b([A({ type: Number })], gu.prototype, "max", void 0), b([A({ type: Number })], gu.prototype, "height", void 0), b([A()], gu.prototype, "label", void 0), b([A()], gu.prototype, "lang", void 0), b([A({ type: Boolean })], gu.prototype, "centerTicks", void 0), b([C()], gu.prototype, "width", void 0), b([C()], gu.prototype, "hover", void 0), _("joe-chart", gu);
//#endregion
//#region src/components/day-answer.ts
var _u = {
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
}, vu = class extends P {
	constructor(...e) {
		super(...e), this.date = "", this.changing = !1, this.busy = !1, this.failed = !1;
	}
	static {
		this.styles = [x, D`
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
		if (!e || !this.date || !t && !this.question) return T;
		let r = !t || this.changing;
		return j`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:chat-question-outline"></ha-icon>${e("ask.title")}</div>
        ${n(e, "ask_day")}
      </div>
      ${r ? j`<p>
              ${this.question ? e(`ask.${this.question.kind}`, {
			day: W(e.lang, this.question.date, "weekday"),
			actual: U(e.lang, this.question.actual, 1),
			expected: U(e.lang, this.question.expected, 1)
		}) : e("past.answer.ask")}
            </p>
            <div class="answers" role="group" aria-label=${e("ask.answers")}>
              ${_u[this.question?.kind ?? "any"].map((n) => j`<button
                    type="button"
                    class="mini-btn ${n === "normal" ? "quiet" : ""}"
                    aria-pressed=${String(n === t)}
                    ?disabled=${this.busy}
                    @click=${() => this.choose(n)}
                  >
                    ${e(`ask.answer.${n}`)}
                  </button>`)}
              ${t ? j`<button type="button" class="mini-btn quiet" ?disabled=${this.busy} @click=${() => this.changing = !1}>
                    ${e("common.cancel")}
                  </button>` : T}
            </div>` : j`<div class="given">
            <p>${e("past.answer.given", { answer: e(`ask.answer.${t}`) })}</p>
            <button type="button" class="mini-btn" @click=${() => this.changing = !0}>
              <ha-icon icon="mdi:pencil-outline"></ha-icon>${e("past.answer.change")}
            </button>
          </div>`}
      ${this.failed ? j`<div class="note warn" role="status"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("error.action")}</div>` : T}
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
b([A({ attribute: !1 })], vu.prototype, "hass", void 0), b([A({ attribute: !1 })], vu.prototype, "t", void 0), b([A({ attribute: !1 })], vu.prototype, "date", void 0), b([A({ attribute: !1 })], vu.prototype, "answer", void 0), b([A({ attribute: !1 })], vu.prototype, "question", void 0), b([C()], vu.prototype, "changing", void 0), b([C()], vu.prototype, "busy", void 0), b([C()], vu.prototype, "failed", void 0), b([C()], vu.prototype, "given", void 0), _("joe-day-answer", vu);
//#endregion
//#region src/pages/lookback/days.ts
var yu = 14, bu = [
	"var(--joe-c-soc)",
	"var(--joe-c-soc-2)",
	"var(--joe-c-grid)",
	"var(--joe-c-ist)"
];
function xu(e, t, n) {
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
var Su = class extends P {
	constructor(...e) {
		super(...e), this.prefix = M, this.failed = !1, this.fromStrip = !1, this.reveal = !1;
	}
	static {
		this.styles = [x, D`
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
				days: yu
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
		if (!e) return T;
		if (!this.days?.days.length) return this.renderEmpty(e);
		let t = this.selected;
		return j`<div class="wrap">
      ${N(e("history.title"))} ${S}
      <p class="status">${this.statusText(e)}</p>
      ${this.rebuildLink(e)}
      ${this.failed ? j`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("history.failed")}</div>` : T}
      ${this.renderStrip(e, this.days.days, t)}
      ${this.day && (!t || this.blank) ? j`<div class="note"><ha-icon icon="mdi:calendar-remove-outline"></ha-icon>${e("past.days.unknown", { day: this.dayName(e, this.day) })}</div>` : T}
      ${this.detail && t && !this.blank ? this.renderDay(e, this.detail) : T}
    </div>`;
	}
	dayName(e, t) {
		return /^\d{4}-\d{2}-\d{2}$/.test(t) ? xu(e.lang, t, "long") : t;
	}
	rebuildLink(e) {
		let t = this.state?.observe;
		if (!t?.active || t.backfill.state === "running") return T;
		let n = {
			tab: "settings",
			section: "maintenance",
			id: "observe"
		};
		return j`<a class="more" href=${k(this.prefix, n)} @click=${E(n)}>${e("past.days.rebuild")}</a>`;
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
		return j`<div class="empty">
      <joe-pose name="inspect"></joe-pose>
      <div>
        ${N(e("history.title"))} ${S}
        <p class="lead">${e(n)}</p>
        ${this.failed ? j`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("history.failed")}</div>` : T}
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
		return j`<nav class="strip" aria-label=${e("history.days")}>
      ${a.map((t) => {
			let r = i.get(t), a = j`<small>${xu(e.lang, t, "short")}</small>
          <b>${Number(t.slice(8))}</b>
          <span class="mini" aria-hidden="true">
            <i style="height:${(r?.home ?? 0) / o * 26}px;background:var(--joe-c-load)"></i>
            <i style="height:${(r?.solar ?? 0) / o * 26}px;background:var(--joe-c-pv)"></i>
          </span>`;
			if (!r) return j`<span aria-disabled="true" aria-label=${xu(e.lang, t, "long")}>${a}</span>`;
			let s = {
				tab: "review",
				section: "days",
				id: t
			}, c = E(s);
			return j`<a
          href=${k(this.prefix, s)}
          aria-current=${t === n ? "date" : T}
          aria-label=${xu(e.lang, t, "long")}
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
		return j`<div class="day-head" data-anchor="day">
        <h3>${xu(e.lang, t.date, "long")}</h3>
        ${t.workday === !0 ? j`<span class="chip">${e("history.workday")}</span>` : t.workday === !1 ? j`<span class="chip">${e("history.day_off")}</span>` : T}
        ${i ? j`<span class="chip ok"><ha-icon icon="mdi:eye-outline"></ha-icon>${e("history.live")}</span>` : T}
        ${a ? j`<span class="chip read"><ha-icon icon="mdi:database-outline"></ha-icon>${e("history.read")}</span>` : T}
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
      ${r && n.date !== this.days?.days[0]?.date ? j`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("history.missing", { hours: r })}</span>
          </div>` : T}`;
	}
	renderTiles(e, t) {
		let n = (t) => t == null ? "–" : s(e.lang, t, 1), r = [], i = (e, t, n, r) => j`<div class="tile">
        <div class="eyebrow">${e}</div>
        <div class="value">${t}<small>${n}</small></div>
        ${r ? j`<div class="sub">${r}</div>` : T}
      </div>`;
		if (t.home != null && r.push(i(e("history.tile.home"), n(t.home), "kWh", t.self_sufficiency == null ? "" : e("history.tile.home.self", { value: s(e.lang, t.self_sufficiency * 100, 0) }))), t.solar != null && r.push(i(e("history.tile.solar"), n(t.solar), "kWh", t.fc_ahead == null ? e("history.tile.solar.nofc") : e("history.tile.solar.fc", {
			value: n(t.fc_ahead),
			ratio: t.solar_vs_fc == null ? "–" : s(e.lang, t.solar_vs_fc * 100, 0)
		}))), t.grid_in != null) {
			let a = [];
			t.grid_in_cheap != null && a.push(e("history.tile.grid.cheap", { value: n(t.grid_in_cheap) })), t.grid_out != null && a.push(e("history.tile.grid.out", { value: n(t.grid_out) })), r.push(i(e("history.tile.grid"), n(t.grid_in), "kWh", a.join(" · ")));
		}
		if (t.bat_in != null && r.push(i(e("history.tile.battery"), n(t.bat_in), "kWh", e("history.tile.battery.out", { value: n(t.bat_out) }))), t.temp && r.push(i(e("history.tile.temp"), s(e.lang, t.temp.mean, 1), "°C", e("history.tile.temp.range", {
			min: s(e.lang, t.temp.min, 0),
			max: s(e.lang, t.temp.max, 0)
		}))), t.present) {
			let n = new Map((this.state?.config.persons ?? []).map((e) => [e.id, e.name])), a = Object.entries(t.present), o = Math.max(...a.map(([, e]) => e));
			r.push(i(e("history.tile.present"), s(e.lang, o, 0), "h", a.map(([t, r]) => `${n.get(t) ?? t} ${s(e.lang, r, 0)} h`).join(" · ")));
		}
		return j`<div class="tiles">${r}</div>`;
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
		let r = (e) => {
			let n = t.slots.map(() => null);
			for (let r of t.hours) r[e] != null && (n[r.slot] = r[e]);
			return n;
		}, i = t.fc_ahead_slots.some((e) => e != null) ? t.fc_ahead_slots : t.fc_slots, a = [{
			label: e("history.chart.solar"),
			kind: "area",
			values: r("solar"),
			color: "var(--joe-c-pv)",
			fill: "var(--joe-c-pv-fill)"
		}, {
			label: e("history.chart.home"),
			kind: "bar",
			values: r("home"),
			color: "var(--joe-c-load)"
		}];
		i.some((e) => e != null) && a.push({
			label: e("history.chart.forecast"),
			kind: "line",
			values: i,
			color: "var(--joe-c-ist)",
			dashed: !0
		});
		let o = this.chartFrame(t);
		return j`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("history.chart.energy")} ${n(e, "chart_energy")}</div>
      <joe-chart
        .labels=${o.labels}
        .ticks=${o.ticks}
        .series=${a}
        .bands=${o.bands}
        .markers=${o.markers}
        unit="kWh"
        lang=${e.lang}
        label=${e("history.chart.energy")}
      ></joe-chart>
      ${this.legend(a)}
    </div>`;
	}
	legend(e) {
		return j`<div class="legend">
      ${e.map((e) => j`<span><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color}"></i>${e.label}</span>`)}
    </div>`;
	}
	renderSocChart(e, t) {
		let r = (this.state?.config.batteries ?? []).map((e, n) => {
			let r = t.slots.map(() => null);
			for (let n of t.hours) {
				let t = n.bat?.[e.id]?.soc;
				t != null && (r[n.slot] = t);
			}
			return {
				label: e.name,
				kind: "line",
				values: r,
				color: bu[n % bu.length],
				digits: 0
			};
		});
		if (!r.some((e) => e.values.some((e) => e != null))) return T;
		t.plan_soc_slots.some((e) => e != null) && r.push({
			label: e("history.chart.plan"),
			kind: "line",
			values: t.plan_soc_slots,
			color: "var(--joe-c-ist)",
			dashed: !0,
			digits: 0
		});
		let i = this.chartFrame(t);
		return j`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("history.chart.soc")} ${n(e, "chart_soc")}</div>
      <joe-chart
        .labels=${i.labels}
        .ticks=${i.ticks}
        .series=${r}
        .bands=${i.bands}
        max="100"
        height="170"
        unit="%"
        lang=${e.lang}
        label=${e("history.chart.soc")}
      ></joe-chart>
      ${this.legend(r)}
    </div>`;
	}
	renderEvaluation(e, t) {
		let r = t.evaluation;
		if (!t.plan?.fixed) return T;
		if (!r) return j`<div class="note"><ha-icon icon="mdi:timer-sand"></ha-icon><span>${e("history.eval.pending")}</span></div>`;
		if (!r.complete) return j`<div class="note warn">
        <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("history.eval.incomplete")}</span>
      </div>`;
		let i = this.hass?.config?.currency, a = r.saving ?? 0, o = a > .005 ? "good" : a < -.005 ? "bad" : "", s = (t) => U(e.lang, t ?? 0, 1), c = (t) => t ? e("history.eval.clock", { time: this.time(t) }) : e("history.eval.never"), l = !r.final, u = [[e("history.eval.day"), e("history.eval.instead", {
			with: s(r.with_plan?.day_kwh),
			without: s(r.without?.day_kwh)
		})], [e("history.eval.night"), e("history.eval.instead", {
			with: s(r.with_plan?.night_kwh),
			without: s(r.without?.night_kwh)
		})]];
		!l && r.solar?.forecast != null && u.push([e("history.eval.solar"), e("history.eval.solar.value", {
			actual: s(r.solar.actual),
			expected: s(r.solar.forecast)
		})]), !l && r.bridge && u.push([e("history.eval.morning"), e("history.eval.morning.value", {
			actual: s(r.bridge.actual),
			expected: s(r.bridge.planned)
		})]), !l && r.takeover && u.push([e("history.eval.takeover"), e("history.eval.takeover.value", {
			actual: c(r.takeover.actual),
			expected: c(r.takeover.planned)
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
		return j`<div class="chart-card" data-tipped>
      <div class="chart-head">
        ${e("history.eval")} ${n(e, "chart_replay")}
        ${l && r.until ? j`<span class="chip warn">${e("history.eval.provisional", { time: this.time(r.until) })}</span>` : T}
      </div>
      <div class="eval-top">
        <div class="eval-big ${o}">
          ${o === "bad" ? An(e, -a, i) : An(e, a, i)}
          <small>${e(o === "good" ? "history.eval.saved" : o === "bad" ? "history.eval.cost" : "history.eval.same")}</small>
        </div>
        <dl>${u.map(([e, t]) => j`<dt>${e}</dt><dd>${t}</dd>`)}</dl>
      </div>
      ${l && r.until ? j`<div class="note">
            <ha-icon icon="mdi:timer-sand"></ha-icon
            ><span>${e("history.eval.provisional.note", { time: this.time(r.until) })}</span>
          </div>` : T}
      ${d.some((e) => e.values.some((e) => e != null)) ? j`<joe-chart
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
            ${this.legend(d)}` : T}
    </div>`;
	}
	time(e) {
		return e.slice(11, 16);
	}
};
b([A({ attribute: !1 })], Su.prototype, "hass", void 0), b([A({ attribute: !1 })], Su.prototype, "t", void 0), b([A({ attribute: !1 })], Su.prototype, "state", void 0), b([A({ attribute: !1 })], Su.prototype, "prefix", void 0), b([A({ attribute: !1 })], Su.prototype, "route", void 0), b([A({ attribute: !1 })], Su.prototype, "climateFound", void 0), b([A({ attribute: !1 })], Su.prototype, "day", void 0), b([C()], Su.prototype, "days", void 0), b([C()], Su.prototype, "detail", void 0), b([C()], Su.prototype, "failed", void 0), _("joe-lookback-days", Su);
//#endregion
//#region src/pages/lookback/sparring.ts
var Cu = {
	night: "mdi:weather-night",
	solar: "mdi:weather-sunny",
	consumption: "mdi:home-lightning-bolt-outline",
	battery: "mdi:battery-charging-medium",
	car: "mdi:car-electric-outline",
	other: "mdi:magnify"
}, wu = class extends P {
	constructor(...e) {
		super(...e), this.prefix = M, this.failed = !1;
	}
	static {
		this.styles = [
			x,
			Uc,
			D`
      :host {
        display: block;
      }
      .card {
        padding: 18px 20px;
        margin-top: 28px;
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
      .say {
        margin: 10px 0 0;
        font-size: 15px;
        line-height: 1.5;
        color: var(--joe-ink-2);
        max-width: 62ch;
      }
      .when {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        margin-top: 10px;
        font-weight: 600;
      }
      .when small {
        font-weight: 400;
        color: var(--joe-muted);
      }
      blockquote {
        margin: 10px 0 0;
        padding: 10px 14px;
        border-radius: 12px;
        background: var(--joe-surface-2);
        font-size: 15px;
        line-height: 1.5;
        max-width: 66ch;
      }
      h4 {
        margin: 18px 0 8px;
        font-size: 14px;
      }
      dl.text-steps {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr);
        gap: 4px 10px;
        margin: 8px 0 0;
        font-size: 13.5px;
      }
      dl.text-steps dt {
        font-weight: 700;
      }
      dl.text-steps dd {
        margin: 0;
        color: var(--joe-ink-2);
        overflow-wrap: anywhere;
      }
      ul.questions {
        margin: 0;
        padding-left: 20px;
        line-height: 1.5;
      }
      .note {
        margin-top: 12px;
      }
      .muted {
        margin: 12px 0 0;
        font-size: 13px;
        color: var(--joe-muted);
      }
      details.older {
        margin-top: 16px;
        border-radius: 12px;
        background: var(--joe-surface-2);
      }
      details.older > summary,
      details.report > summary {
        min-height: 44px;
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        padding: 0 12px;
        font-weight: 600;
        cursor: pointer;
      }
      .older-body {
        padding: 0 12px 12px;
      }
      details.report {
        border-top: 1px solid var(--joe-line);
      }
      details.report > .report-body {
        padding: 0 4px 12px;
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
    `
		];
	}
	connectedCallback() {
		super.connectedCallback(), this.load();
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.observer?.disconnect(), this.observer = void 0;
	}
	updated() {
		!this.observer && Jo(this.data) && "IntersectionObserver" in window && (this.observer = new IntersectionObserver((e) => {
			e.some((e) => e.isIntersecting) && this.markSeen();
		}), this.observer.observe(this));
	}
	async load() {
		let e = await Ko(this.hass);
		this.failed = !e, e && (this.data = e);
	}
	async markSeen() {
		let e = Jo(this.data);
		if (this.observer?.disconnect(), this.observer = void 0, e && this.marked !== e.at && this.hass) {
			this.marked = e.at;
			try {
				await this.hass.callWS({
					type: "energy_joe/sparring/seen",
					at: e.at
				}), this.data &&= {
					...this.data,
					reports: this.data.reports.map((t) => t.at === e.at ? {
						...t,
						seen: !0
					} : t)
				};
			} catch {
				this.marked = void 0;
			}
		}
	}
	render() {
		let e = this.t;
		if (!e) return T;
		let t = this.data, [r, ...i] = t?.reports ?? [];
		return j`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:eye-check-outline"></ha-icon>${e("sparring.title")}</div>
        ${n(e, "sparring_reports")}
      </div>
      <p class="say">${e("sparring.reports.lead")}</p>
      ${this.failed && !t ? j`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("sparring.reports.failed")}</span></div>` : T}
      ${t && !r ? this.renderEmpty(e, t) : T}
      ${r ? this.renderReport(e, r) : T}
      ${i.length ? j`<details class="older" data-notip>
            <summary>${e("sparring.older", { count: i.length })}</summary>
            <div class="older-body">
              ${i.map((t) => j`<details class="report">
                  <summary>${Xo(e, t.at)} ${cs(e, t)}</summary>
                  <div class="report-body">${this.renderReport(e, t, !1)}</div>
                </details>`)}
            </div>
          </details>` : T}
      ${ke(this.prefix, Go, e("sparring.reports.settings"), "go-link")}
    </section>`;
	}
	renderEmpty(e, t) {
		return t.enabled ? j`<p class="say">
      ${t.next ? e("sparring.reports.waiting", { when: Xo(e, t.next) }) : e("sparring.reports.waiting_soon")}
    </p>` : j`<p class="say">${e("sparring.reports.off")}</p>`;
	}
	renderReport(e, t, n = !0) {
		let r = t.entity && this.hass ? c(this.hass, t.entity) : t.entity, i = n ? j`<div class="when">
          ${e("sparring.report.at", { when: Xo(e, t.at) })} ${cs(e, t)}
          ${r ? j`<small>${e("sparring.report.by", { model: r })}</small>` : T}
        </div>` : T;
		if (!t.ok) return j`${i}
        <div class="note warn">
          <ha-icon icon="mdi:alert-outline"></ha-icon>
          <span>${e("sparring.report.error", { error: t.error || e("sparring.report.error.unknown") })}</span>
        </div>
        <p class="muted">${e("sparring.report.error.retry")}</p>`;
		let a = qo(t);
		return j`${i}
      ${t.summary ? j`<blockquote>${t.summary}</blockquote>` : T}
      ${a ? T : j`<p class="say">${e("sparring.report.clean")}</p>`}
      ${t.findings.length ? j`<h4>${e("sparring.findings")}</h4>
            ${Kc(e, t.findings.map((t) => this.findingRow(e, t)))}` : T}
      ${t.texts.length ? j`<h4>${e("sparring.texts")}</h4>
            ${Kc(e, t.texts.map((t) => this.textRow(e, t)))}` : T}
      ${t.proposals.length ? j`<h4>${e("sparring.proposals")}</h4>
            ${Kc(e, t.proposals.map((t) => this.proposalRow(e, t)))}` : T}
      ${t.questions.length ? j`<h4>${e("sparring.questions")}</h4>
            <ul class="questions">
              ${t.questions.map((e) => j`<li>${e}</li>`)}
            </ul>` : T}
      ${t.dropped > 0 ? j`<p class="muted">
            ${t.dropped === 1 ? e("sparring.report.dropped.one") : e("sparring.report.dropped.many", { count: t.dropped })}
          </p>` : T}`;
	}
	findingRow(e, t) {
		let n = Cu[t.area] ? t.area : "other";
		return {
			key: t.title,
			icon: Cu[n],
			title: t.title,
			detail: e("sparring.evidence", { evidence: t.evidence }),
			chips: [j`<span class="chip">${e(`sparring.area.${n}`)}</span>`],
			state: t.checked ? void 0 : "flag",
			notes: t.checked ? void 0 : [j`<div class="note warn">
              <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("sparring.findings.unchecked")}</span>
            </div>`]
		};
	}
	textRow(e, t) {
		return {
			key: t.key,
			icon: "mdi:text-box-edit-outline",
			title: e("sparring.text.title"),
			detail: `„${t.template}“`,
			chips: [j`<span class="chip" title=${e("sparring.text.key")}>${t.key}</span>`],
			notes: [j`<dl class="text-steps">
          <dt>${e("sparring.text.problem")}</dt>
          <dd>${t.problem}</dd>
          <dt>${e("sparring.text.better")}</dt>
          <dd>„${t.better}“</dd>
        </dl>`]
		};
	}
	proposalRow(e, t) {
		let n = t.setting.replace(/^rules\./, ""), r = this.state?.config, i = r ? r.rules[n] : void 0, a = t.current ?? i ?? null, o = (t) => t == null ? "–" : e.optional(`rule.${n}.${String(t)}`) ?? String(t), s = [];
		t.reason && s.push(Wc(e("sparring.proposal.reason", { reason: t.reason }))), s.push(Wc(this.replayText(e, t, n, a)));
		let c = t.setting.startsWith("rules.");
		return {
			key: t.setting,
			icon: "mdi:tune-variant",
			title: e.optional(`rule.${n}`) ?? t.setting,
			detail: e("sparring.proposal.values", {
				current: o(a),
				value: o(t.value)
			}),
			notes: s,
			tip: c ? "sparring_change" : void 0,
			actions: c ? [Z(e("sparring.proposal.change"), "mdi:arrow-right", () => w(this, {
				tab: "settings",
				section: "rules",
				id: n
			}))] : void 0
		};
	}
	replayText(e, t, n, r) {
		let i = t.replay;
		if (!i?.best) return e("sparring.proposal.replay.none");
		let a = e.optional(`rule.${n}.${i.best}`) ?? i.best, o = i.best === String(t.value) ? e("sparring.proposal.replay.agrees", { best: a }) : i.best === String(r) ? e("sparring.proposal.replay.yours", { best: a }) : e("sparring.proposal.replay.other", { best: a }), s = i.cost, c = r == null ? void 0 : s?.[String(r)], l = s?.[String(t.value)];
		if (typeof c != "number" || typeof l != "number") return o;
		let u = l - c, d = this.hass?.config?.currency;
		return `${o} ${e("sparring.proposal.replay.cost", { diff: Math.abs(u) < .005 ? e("learn.replay.equal") : e(u > 0 ? "learn.replay.more" : "learn.replay.less", { value: de(e, Math.abs(u), d) }) })}`;
	}
};
b([A({ attribute: !1 })], wu.prototype, "hass", void 0), b([A({ attribute: !1 })], wu.prototype, "t", void 0), b([A({ attribute: !1 })], wu.prototype, "state", void 0), b([A({ attribute: !1 })], wu.prototype, "prefix", void 0), b([C()], wu.prototype, "data", void 0), b([C()], wu.prototype, "failed", void 0), _("joe-sparring-reports", wu);
//#endregion
//#region src/pages/lookback/learned.ts
var Tu = [
	"clear",
	"mixed",
	"overcast"
], Eu = [
	"clear",
	"mixed",
	"overcast",
	"rain",
	"all"
], Du = [
	"cold",
	"mild",
	"all"
];
function Ou(e, t, n) {
	return Math.abs(t) < .005 ? e("learn.replay.equal") : e(t > 0 ? "learn.replay.more" : "learn.replay.less", { value: de(e, Math.abs(t), n) });
}
var ku = [
	"bold",
	"brave",
	"balanced",
	"careful",
	"cautious",
	"typical"
], Au = {
	forecast_solar: "Forecast.Solar",
	open_meteo_solar_forecast: "Open-Meteo Solar Forecast",
	solcast_solar: "Solcast"
}, ju = [
	"all",
	...Hn,
	"climate"
];
function Mu(e, t, n) {
	let r = e.base + (t ? e.workday : 0) + e.heat * Math.max(0, 15 - n) + e.cool * Math.max(0, n - 22);
	return e.presence != null && (r += e.presence * (e.presence_mean ?? 0)), Math.max(0, r);
}
var Nu = class extends P {
	constructor(...e) {
		super(...e), this.prefix = M, this.failed = !1, this.confirming = !1, this.resetting = !1, this.scope = "all";
	}
	static {
		this.styles = [
			x,
			Kn,
			D`
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
      .season-note {
        margin: 8px 0 0;
        font-size: 12.5px;
        line-height: 1.4;
        color: var(--joe-muted);
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
		let t = rr(this.state);
		e.has("state") && this.marker !== void 0 && t !== this.marker && this.load(), this.marker = t, e.has("anchor") && this.anchor && (this.pending = this.anchor);
	}
	updated() {
		let e = this.pending;
		e && this.data && _e(this.renderRoot, e) && (this.pending = void 0);
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
		if (!e) return T;
		let t = this.data;
		return j`<div class="wrap">
        <div class="intro">
          <div>
            ${N(e("learn.page.title"))} ${S}
            <p class="lead">${e("learn.lead")}</p>
            <p class="status">${this.statusText(e)}</p>
          </div>
          <joe-pose name="learn"></joe-pose>
        </div>
        ${this.failed ? j`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("learn.failed")}</div>` : T}
        ${t ? j`<div class="group" data-anchor="sun">
                <div class="eyebrow section"><ha-icon icon="mdi:weather-sunny"></ha-icon>${e("past.learned.group.sun")}</div>
                <div class="grid">${this.renderSolar(e, t)} ${this.renderShift(e, t)} ${this.renderSources(e, t)}</div>
              </div>
              <div class="group" data-anchor="consumption">
                <div class="eyebrow section"><ha-icon icon="mdi:home-lightning-bolt-outline"></ha-icon>${e("past.learned.group.consumption")}</div>
                <div class="grid">
                  ${this.renderHome(e, t)} ${this.renderWeather(e, t)} ${this.renderSpread(e, t)}
                  ${this.renderReplay(e, t)}
                </div>
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
              <div class="group" data-anchor="sparring">
                <joe-sparring-reports .t=${e} .hass=${this.hass} .state=${this.state} .prefix=${this.prefix}></joe-sparring-reports>
              </div>
              ${this.renderReset(e)}` : T}
      </div>
      ${this.confirming ? this.renderConfirm(e) : T}`;
	}
	statusText(e) {
		let t = this.state?.observe, n = this.state?.config.learned;
		if (this.state?.mode === "off") return e("learn.paused");
		if (!t?.active) return e("learn.waiting");
		let r = [];
		return n?.since ? r.push(e("learn.since", { day: W(e.lang, n.since) })) : t.first_day && r.push(e("learn.since_start", { day: W(e.lang, t.first_day) })), n?.updated && r.push(e("learn.updated", {
			day: W(e.lang, n.updated, "short"),
			time: n.updated.slice(11, 16)
		})), r.join(" · ");
	}
	goLink(e, t) {
		return j`<a class="go-link" href=${k(this.prefix, e)} @click=${E(e)}>${t}</a>`;
	}
	renderSolar(e, t) {
		let r = t.learned, i = r.solar_factor, a;
		a = i == null ? e("learn.solar.learning", {
			need: t.needs.solar,
			have: r.solar_days
		}) : i < .95 ? e("learn.solar.less", {
			value: s(e.lang, (1 - i) * 100, 0),
			share: s(e.lang, i * 100, 0)
		}) : i > 1.05 ? e("learn.solar.more", {
			value: s(e.lang, (i - 1) * 100, 0),
			share: s(e.lang, i * 100, 0)
		}) : e("learn.solar.fits");
		let o = t.solar.slice(-28), c = [{
			label: e("learn.solar.chart.actual"),
			kind: "bar",
			values: o.map((e) => e.actual),
			color: "var(--joe-c-pv)",
			digits: 1
		}, {
			label: e("learn.solar.chart.forecast"),
			kind: "line",
			values: o.map((e) => e.forecast),
			color: "var(--joe-c-ist)",
			dashed: !0,
			digits: 1
		}];
		return j`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:weather-sunny"></ha-icon>${e("learn.solar")}</div>
        ${n(e, "learn_solar")}
      </div>
      <div class="figure">
        <div class="big ${i == null ? "small" : ""}">
          ${i == null ? e("learn.still") : `× ${s(e.lang, i, 2)}`}
        </div>
        ${i == null ? T : j`${O(e, { source: "learned" })}<span class="chip">${e("learn.days", { days: r.solar_days })}</span>`}
      </div>
      <p class="say">${a}</p>
      ${o.length > 1 ? this.chartWithLegend(e, o.map((e) => e.date), c, "kWh", e("learn.solar.chart")) : T}
    </section>`;
	}
	renderShift(e, t) {
		let r = t.learned, i = r.solar_shift;
		return j`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:clock-time-four-outline"></ha-icon>${e("learn.shift")}</div>
        ${n(e, "learn_shift")}
      </div>
      <div class="figure">
        <div class="big ${i == null ? "small" : ""}">${e(i == null ? "learn.still" : `learn.shift.big.${i}`)}</div>
        ${i == null ? T : j`${O(e, { source: "learned" })}<span class="chip">${e("learn.days", { days: r.shift_days })}</span>`}
      </div>
      <p class="say">
        ${i == null ? e("learn.shift.learning", {
			need: t.needs.shift,
			have: r.shift_days
		}) : e(`learn.shift.${i}`)}
      </p>
      ${t.solar_profile ? this.hourChart(e, this.profileSeries(e, t.solar_profile), e("learn.shift.chart")) : T}
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
		return j`<joe-chart
        .labels=${r}
        .ticks=${i}
        .series=${t}
        unit="kWh"
        height="150"
        lang=${e.lang}
        label=${n}
      ></joe-chart>
      <div class="legend">
        ${t.map((e) => j`<span><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color}"></i>${e.label}</span>`)}
      </div>`;
	}
	renderSpread(e, t) {
		let r = e.lang, i = t.learned, a = this.state.config, o = (e) => s(r, e * 100, 0), c = i.solar_spread ?? {}, l = i.home_spread ?? {}, u = [...Eu.filter((e) => c[e]).map((t) => {
			let n = c[t];
			return {
				name: e("learn.spread.solar", { class: e(`learn.spread.class.${t}`) }),
				values: [
					e("learn.spread.bad", { value: o(n.low) }),
					e("learn.spread.good", { value: o(n.high) }),
					e("learn.days", { days: n.days })
				]
			};
		}), ...Du.filter((e) => l[e]).map((t) => {
			let n = l[t];
			return {
				name: e("learn.spread.home", { group: e(`learn.spread.group.${t}`) }),
				values: [e("learn.spread.range", {
					low: o(n.low),
					high: o(n.high)
				}), e("learn.days", { days: n.days })]
			};
		})], d = t.accuracy.slice(-14), f = [{
			label: e("learn.buffer.chart.planned"),
			kind: "bar",
			values: d.map((e) => e.bridge.planned),
			color: "var(--joe-c-ist)",
			digits: 1
		}, {
			label: e("learn.buffer.chart.actual"),
			kind: "bar",
			values: d.map((e) => e.bridge.actual),
			color: "var(--joe-c-soc)",
			digits: 1
		}];
		return j`<section class="card" data-tipped data-anchor="spread">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:shield-half-full"></ha-icon>${e("learn.spread")}</div>
        ${n(e, "learn_spread")}
      </div>
      <p class="say">${u.length ? e("learn.spread.say") : e("learn.spread.none")}</p>
      ${u.length ? j`${Gn(u)}<p class="season-note">${e("learn.spread.season")}</p>` : T}
      ${d.length > 1 ? this.chartWithLegend(e, d.map((e) => e.date), f, "kWh", e("learn.buffer.chart")) : T}
      ${J(e, this.prefix, {
			label: e("rule.night_caution"),
			value: Wa(e, a, "night_caution"),
			to: {
				tab: "settings",
				section: "rules",
				id: "night_caution"
			}
		})}
      ${J(e, this.prefix, {
			label: e("rule.buffer_factor"),
			value: Wa(e, a, "buffer_factor"),
			hint: e("learn.spread.buffer"),
			to: {
				tab: "settings",
				section: "rules",
				id: "buffer_factor"
			}
		})}
    </section>`;
	}
	renderReplay(e, t) {
		let r = t.learned.replay ?? this.state?.config.learned.replay ?? null, i = this.state?.config.rules.night_caution ?? "brave", a = this.hass?.config?.currency, o = (t) => ku.filter((e) => t.costs[e] != null).map((n) => ({
			name: e(n === "typical" ? "learn.replay.typical" : `rule.night_caution.${n}`),
			values: [
				...n === i ? [j`<span class="chip">${e("learn.replay.yours")}</span>`] : [],
				...n === t.best ? [j`<span class="chip ok">${e("learn.replay.best")}</span>`] : [],
				j`<b>${Ou(e, t.costs[n] - (t.costs[i] ?? t.costs[n]), a)}</b>`
			]
		}));
		return j`<section class="card" data-tipped data-anchor="replay">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:history"></ha-icon>${e("learn.replay")}</div>
        ${n(e, "learn_replay")}
      </div>
      ${r ? j`<p class="say">
              ${e("learn.replay.say", {
			nights: r.nights,
			first: W(e.lang, r.first),
			last: W(e.lang, r.last)
		})}
            </p>
            ${Gn(o(r))}
            ${r.season ? j`<div class="sub-head"><b>${e("learn.replay.season", { nights: r.season.nights })}</b></div>
                  ${Gn(o(r.season))}` : T}
            <p class="season-note">${e("learn.replay.only")}</p>` : j`<p class="say">${e("learn.replay.none")}</p>`}
    </section>`;
	}
	renderHome(e, t) {
		let r = t.consumption, i = (t) => U(e.lang, t.reduce((e, t) => e + t, 0), 1), a = [{
			label: e("learn.home.chart.workday"),
			kind: "line",
			values: r.workday,
			color: "var(--joe-c-load)"
		}, {
			label: e("learn.home.chart.day_off"),
			kind: "line",
			values: r.day_off,
			color: "var(--joe-c-soc-2)",
			dashed: !0
		}];
		return j`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:home-lightning-bolt-outline"></ha-icon>${e("learn.home")}</div>
        ${n(e, "learn_home")}
      </div>
      <p class="say">
        ${r.source === "history" ? e("learn.home.history", { days: r.days }) : e("learn.home.default")}
      </p>
      <p class="split">${e("learn.home.totals", {
			workday: i(r.workday),
			day_off: i(r.day_off)
		})}</p>
      ${this.hourChart(e, a, e("learn.home.chart"))}
    </section>`;
	}
	chartWithLegend(e, t, n, r, i) {
		return j`<joe-chart
        .labels=${t.map((t) => W(e.lang, t, "weekday"))}
        .ticks=${ir(e.lang, t)}
        .series=${n}
        centerTicks
        unit=${r}
        height="150"
        lang=${e.lang}
        label=${i}
      ></joe-chart>
      <div class="legend">
        ${n.map((e) => j`<span
              ><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color};height:${e.kind === "bar" ? "10px" : "4px"}"></i
              >${e.label}</span
            >`)}
      </div>`;
	}
	renderWeather(e, t) {
		let r = e.lang, i = t.learned.consumption_model, a = t.days.filter((e) => e.temp != null), o = a.filter((e) => !e.excluded).length, c = this.state?.config.context.weather_entity, l;
		if (!c) l = e("learn.model.no_weather");
		else if (!i) l = e("learn.model.learning", {
			need: t.needs.models,
			have: o
		});
		else {
			let t = [e("learn.model.base", { value: U(r, i.base + (i.presence ?? 0) * (i.presence_mean ?? 0), 1) })];
			Math.abs(i.workday) >= .3 && t.push(e(i.workday > 0 ? "learn.model.workday_more" : "learn.model.workday_less", { value: U(r, Math.abs(i.workday), 1) })), i.heat >= .05 && t.push(e("learn.model.heat", { value: U(r, i.heat, 2) })), i.cool >= .05 && t.push(e("learn.model.cool", { value: U(r, i.cool, 2) })), i.presence != null && Math.abs(i.presence) >= .05 && t.push(e("learn.model.presence", { value: U(r, i.presence, 2) })), t.push(e("learn.model.fit", { share: s(r, i.r2 * 100, 0) })), l = t.join(" ");
		}
		let u = i != null && i.heat >= .05;
		return j`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:thermometer"></ha-icon>${e("learn.model")}</div>
        ${n(e, "learn_model")}
      </div>
      <div class="figure">
        <div class="big ${i ? "" : "small"}">
          ${i ? u ? j`+${U(r, i.heat, 2)}<small> kWh/°C</small>` : j`${U(r, i.base + (i.presence ?? 0) * (i.presence_mean ?? 0), 1)}<small> kWh</small>` : e("learn.still")}
        </div>
        ${i ? j`${O(e, { source: "learned" })}<span class="chip">${e("learn.days", { days: i.days })}</span>` : T}
      </div>
      <p class="say">${l}</p>
      ${c ? T : J(e, this.prefix, {
			label: e("past.learned.weather"),
			value: e("past.learned.weather.missing"),
			to: {
				tab: "household",
				section: "travel"
			},
			action: "set"
		})}
      ${a.length > 2 ? this.temperatureChart(e, t, i) : T}
    </section>`;
	}
	temperatureChart(e, t, n) {
		let r = t.days.filter((e) => e.temp != null && !e.excluded), i = r.map((e) => e.temp), a = Math.floor(Math.min(...i) / 2) * 2, o = Math.floor(Math.max(...i) / 2) * 2 + 2, c = [];
		for (let e = a; e < o; e += 2) c.push(e);
		let l = (t) => s(e.lang, t, 0), u = [{
			label: e("learn.model.chart.actual"),
			kind: "bar",
			values: c.map((e) => {
				let t = r.filter((t) => t.temp >= e && t.temp < e + 2);
				return t.length ? t.reduce((e, t) => e + t.home, 0) / t.length : null;
			}),
			color: "var(--joe-c-ist)",
			digits: 1
		}];
		n && u.push({
			label: e("learn.model.chart.workday"),
			kind: "line",
			values: c.map((e) => Mu(n, !0, e + 1)),
			color: "var(--joe-c-soc)",
			digits: 1
		}, {
			label: e("learn.model.chart.day_off"),
			kind: "line",
			values: c.map((e) => Mu(n, !1, e + 1)),
			color: "var(--joe-c-soc-2)",
			dashed: !0,
			digits: 1
		});
		let d = Math.max(1, Math.ceil(c.length / 8)), f = /* @__PURE__ */ new Map();
		return c.forEach((e, t) => {
			t % d === 0 && f.set(t, `${l(e)}°`);
		}), j`<joe-chart
        .labels=${c.map((e) => `${l(e)} … ${l(e + 2)} °C`)}
        .ticks=${f}
        .series=${u}
        unit="kWh"
        height="150"
        lang=${e.lang}
        label=${e("learn.model.chart")}
      ></joe-chart>
      <div class="legend">
        ${u.map((e) => j`<span
              ><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color};height:${e.kind === "bar" ? "10px" : "4px"}"></i
              >${e.label}</span
            >`)}
      </div>`;
	}
	renderSources(e, t) {
		let r = e.lang, i = this.state.config, a = t.learned.solar_classes ?? {}, o = a.classes ?? {}, c = i.forecast, l = t.learned.sources ?? {}, u = Tu.filter((e) => o[e]), d = (e) => s(r, e * 100, 0), f = [["main", c.provider ? Au[c.provider] ?? c.provider : e("learn.sources.main")], ...c.alternatives.map((e) => [e.id, e.name])], p = Object.fromEntries(f.map(([e]) => [e, l[e] ? 1 / Math.max(l[e].error, .05) ** 2 : 0])), m = Object.values(p).reduce((e, t) => e + t, 0);
		return j`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:weather-partly-cloudy"></ha-icon>${e("learn.weather")}</div>
        ${n(e, "learn_weather")}
      </div>
      <p class="say">
        ${u.length ? e("learn.weather.say", { top: U(r, a.top ?? 0, 1) }) : e("learn.weather.learning", { have: a.days ?? 0 })}
      </p>
      ${u.length ? Gn(Tu.map((t) => {
			let n = o[t];
			return {
				name: e(`learn.weather.${t}`),
				values: n ? [`× ${s(r, n.factor, 2)}`, e("learn.days", { days: n.days })] : [e("learn.still")]
			};
		})) : T}
      <div class="sub-head">
        <b>${e("learn.sources")}</b>
      </div>
      ${c.alternatives.length ? j`${Gn(f.map(([n, i]) => {
			let a = l[n];
			return {
				name: i,
				values: a ? [
					`× ${s(r, a.factor, 2)}`,
					e("learn.sources.error", { value: d(a.error) }),
					c.combine && m ? e("learn.sources.weight", { value: d(p[n] / m) }) : ""
				] : [e("learn.sources.learning", { need: t.needs.sources })]
			};
		}))}
            ${J(e, this.prefix, {
			label: e("learn.sources.combine"),
			value: e(c.combine ? "rule.on" : "rule.off"),
			to: {
				tab: "devices",
				section: "grid",
				id: "solar"
			}
		})}` : j`<p class="say">${e("learn.sources.single")}</p>`}
    </section>`;
	}
	rowsCard(e, t, n, r, i, a, o, s = T) {
		return j`<section class="card" data-tipped data-anchor=${t}>
      <div class="head">
        <div class="eyebrow"><ha-icon icon=${n}></ha-icon>${r}</div>
        ${i}
      </div>
      ${a.length ? Gn(a) : j`<p class="say">${o}</p>`} ${s}
    </section>`;
	}
	renderBatteries(e, t) {
		let r = this.state.config;
		return this.rowsCard(e, "battery", "mdi:battery-heart-variant", e("learn.battery"), n(e, "learn_battery"), r.batteries.map((n) => Xn(e, r, this.hass, t.learned, n, t.needs.models)), e("learn.battery.none"));
	}
	renderGroups(e, t) {
		let r = this.state.config.consumers.filter((e) => e.energy_entity && e.kind !== "submeter");
		return this.rowsCard(e, "devices", "mdi:chart-donut", e("learn.groups"), n(e, "learn_groups"), r.map((n) => Zn(e, t.learned, n)), e("learn.groups.none"));
	}
	renderHotWater(e, t) {
		let r = this.state.config.actions.filter((e) => e.kind === "target");
		return this.rowsCard(e, "hot_water", "mdi:water-boiler", e("learn.hot_water"), n(e, "learn_hot_water"), r.map((n) => Qn(e, t.learned, n)), e("learn.hot_water.none"));
	}
	renderCars(e, t) {
		let r = (this.state.config.cars ?? []).filter((e) => e.need.enabled);
		return this.rowsCard(e, "car", "mdi:car-electric", e("learn.car"), n(e, "learn_car"), r.map((n) => $n(e, t.learned, n)), e("learn.car.none"));
	}
	renderClimate(e) {
		let t = this.state.config, r = this.state?.climate?.rates ?? {}, i = this.climateFound?.devices ?? [], a = Object.fromEntries(i.map((e) => [e.entity_id, e.name])), o = Object.entries(t.climate?.rooms ?? {}).filter(([, e]) => e.enabled).map(([e]) => e), l = [.../* @__PURE__ */ new Set([...o, ...Object.keys(r)])].map((t) => {
			let n = r[t];
			return {
				name: a[t] ?? (this.hass ? c(this.hass, t) : t),
				values: n ? [e("past.learned.climate.rate", { rate: s(e.lang, n, 1) })] : [e("learn.still")],
				note: n ? void 0 : e("climate.rate_default")
			};
		});
		return j`<section class="card" data-tipped data-anchor="climate">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:thermostat-auto"></ha-icon>${e("past.learned.climate")}</div>
        ${n(e, "learn_climate")}
      </div>
      ${l.length ? j`<p class="say">${e("past.learned.climate.say")}</p>
            ${Object.keys(r).length ? j`<div class="figure">${O(e, { source: "learned" })}</div>` : T}
            ${Gn(l)}` : j`<p class="say">${e("past.learned.climate.none")}</p>
            ${this.goLink({
			tab: "devices",
			section: "climate"
		}, e("past.learned.climate.open"))}`}
    </section>`;
	}
	renderPresence(e, t) {
		let r = this.state.config, i = this.state?.climate?.usual ?? {}, a = r.persons, o = a.map((n) => {
			let r = tr(e, t.learned, n, n.person_entity ? i[n.person_entity] : void 0);
			return n.calendars.length ? r : {
				...r,
				extra: this.goLink({
					tab: "household",
					section: "people",
					id: n.id
				}, e("learn.presence.calendars"))
			};
		});
		return this.rowsCard(e, "presence", "mdi:account-clock-outline", e("learn.presence"), n(e, "learn_presence"), o, e("learn.presence.none"), a.length ? T : this.goLink({
			tab: "household",
			section: "people"
		}, e("learn.presence.calendars")));
	}
	renderReset(e) {
		let t = !this.state?.observe?.active && this.scope !== "climate";
		return j`<section class="card danger wide" data-tipped data-anchor="reset">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:restore"></ha-icon>${e("learn.reset")}</div>
        ${n(e, "learn_reset")}
      </div>
      <p>${e("learn.reset.text")}</p>
      <div class="sub-head with-tip"><b>${e("learn.reset.scope")}</b>${n(e, "learn_reset_scope")}</div>
      <div class="seg scopes" role="group" aria-label=${e("learn.reset.scope")}>
        ${ju.map((t) => j`<button type="button" aria-pressed=${String(this.scope === t)} @click=${() => this.scope = t}>
              ${e(`learn.reset.scope.${t}`)}
            </button>`)}
      </div>
      <div class="actions">
        <button type="button" class="btn btn-danger" ?disabled=${t} @click=${() => this.confirming = !0}>
          ${e(this.scope === "all" ? "learn.reset.button" : "learn.reset.button.scope")}
        </button>
      </div>
      ${t ? j`<p>${e("learn.reset.off")}</p>` : T}
      ${this.notice ? j`<div class="note ${this.notice.ok ? "" : "warn"}" role="status">
            <ha-icon icon=${this.notice.ok ? "mdi:check" : "mdi:alert-outline"}></ha-icon>${this.notice.text}
          </div>` : T}
    </section>`;
	}
	renderConfirm(e) {
		let t = () => {
			this.confirming = !1;
		}, r = this.scope;
		return j`<joe-sheet label=${e("learn.reset.label")} closeLabel=${e("common.close")} @joe-close=${t}>
      <div data-tipped>
        <div class="sheet-title">${N(e("learn.reset.confirm.title"), "h2", n(e, "learn_reset"))}</div>
        <dl class="forget">
          <dt>${e("learn.reset.confirm.forget")}</dt>
          <dd>${e(`learn.reset.forget.${r}`)}</dd>
          <dt>${e("learn.reset.confirm.keep")}</dt>
          <dd>${e(r === "all" ? "learn.reset.confirm.keep.text" : "learn.reset.keep.scope")}</dd>
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
b([A({ attribute: !1 })], Nu.prototype, "hass", void 0), b([A({ attribute: !1 })], Nu.prototype, "t", void 0), b([A({ attribute: !1 })], Nu.prototype, "state", void 0), b([A({ attribute: !1 })], Nu.prototype, "prefix", void 0), b([A({ attribute: !1 })], Nu.prototype, "route", void 0), b([A({ attribute: !1 })], Nu.prototype, "climateFound", void 0), b([A({ attribute: !1 })], Nu.prototype, "anchor", void 0), b([C()], Nu.prototype, "data", void 0), b([C()], Nu.prototype, "failed", void 0), b([C()], Nu.prototype, "confirming", void 0), b([C()], Nu.prototype, "resetting", void 0), b([C()], Nu.prototype, "scope", void 0), b([C()], Nu.prototype, "notice", void 0), _("joe-lookback-learned", Nu);
//#endregion
//#region src/pages/lookback/log.ts
var Pu = class extends P {
	constructor(...e) {
		super(...e), this.prefix = M, this.failed = !1;
	}
	static {
		this.styles = [x, D`
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
		e.has("group") && this.group && !oa.includes(this.group) && w(this, {
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
		return this.full ?? sa(this.state?.control?.log, this.state?.climate?.log);
	}
	get filter() {
		return oa.includes(this.group ?? "") ? this.group : "all";
	}
	render() {
		let e = this.t;
		if (!e || !this.state) return T;
		let t = this.state.config, r = this.entries, i = this.filter, a = Object.fromEntries((this.climateFound?.devices ?? []).map((e) => [e.entity_id, e.name])), o = /* @__PURE__ */ new Map([["all", r.length]]), s = /* @__PURE__ */ new Map();
		for (let e of r) {
			let n = ca(t, e);
			o.set(n.group, (o.get(n.group) ?? 0) + 1), n.group === i && n.device && s.set(n.device, (s.get(n.device) ?? 0) + 1);
		}
		let c = i === "all" ? void 0 : this.device, l = [e(i === "all" ? "past.log.all" : `past.log.filter.${i}`), ...c ? [la(t, this.hass, a, i, c)] : []].join(" · ");
		return j`<div class="wrap">
      ${N(e("past.log.title"))} ${S}
      <p class="lead">${e("past.log.lead")}</p>
      <nav class="filters" aria-label=${e("past.log.filters")}>
        ${oa.filter((e) => e === "all" || e === i || o.get(e)).map((t) => this.chip({
			tab: "review",
			section: "log",
			id: t
		}, e(t === "all" ? "past.log.all" : `past.log.filter.${t}`), t === i && !c, o.get(t)))}
      </nav>
      ${i !== "all" && i !== "joe" && (s.size > 1 || c) ? j`<nav class="filters" aria-label=${e("past.log.devices")}>
            ${[.../* @__PURE__ */ new Set([...s.keys(), ...c ? [c] : []])].map((e) => this.chip({
			tab: "review",
			section: "log",
			id: i,
			sub: e
		}, la(t, this.hass, a, i, e), e === c, s.get(e) ?? 0))}
          </nav>` : T}
      <section class="card" data-tipped>
        <div class="head">
          <div class="eyebrow"><ha-icon icon="mdi:clipboard-text-clock-outline"></ha-icon>${l}</div>
          ${n(e, "past_log")}
        </div>
        ${this.failed && r.length ? j`<div class="note"><ha-icon icon="mdi:information-outline"></ha-icon>${e("past.log.partial")}</div>` : T}
        <joe-log-list
          .t=${e}
          .hass=${this.hass}
          .config=${t}
          .names=${a}
          .entries=${r}
          .filter=${{
			group: i,
			device: c
		}}
          .empty=${r.length ? e("past.log.empty_filter") : e("past.log.empty")}
        ></joe-log-list>
      </section>
    </div>`;
	}
	chip(e, t, n, r) {
		return j`<a
      class="section-chip ${n ? "on" : ""}"
      href=${k(this.prefix, e)}
      aria-current=${n ? "page" : T}
      @click=${E(e, { replace: !0 })}
      >${t}${r == null ? T : j`<span class="section-count">${r}</span>`}</a
    >`;
	}
};
b([A({ attribute: !1 })], Pu.prototype, "hass", void 0), b([A({ attribute: !1 })], Pu.prototype, "t", void 0), b([A({ attribute: !1 })], Pu.prototype, "state", void 0), b([A({ attribute: !1 })], Pu.prototype, "prefix", void 0), b([A({ attribute: !1 })], Pu.prototype, "route", void 0), b([A({ attribute: !1 })], Pu.prototype, "climateFound", void 0), b([A({ attribute: !1 })], Pu.prototype, "group", void 0), b([A({ attribute: !1 })], Pu.prototype, "device", void 0), b([C()], Pu.prototype, "full", void 0), b([C()], Pu.prototype, "failed", void 0), _("joe-lookback-log", Pu);
//#endregion
//#region src/pages/lookback/result.ts
var Fu = class extends P {
	constructor(...e) {
		super(...e), this.prefix = M, this.failed = !1;
	}
	static {
		this.styles = [x, D`
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
		let t = rr(this.state);
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
		return e ? j`<div class="wrap">
      ${N(e("past.result.title"))} ${S}
      <p class="lead">${e("past.result.lead")}</p>
      ${this.failed ? j`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("learn.failed")}</div>` : T}
      ${this.data ? j`${this.renderResults(e, this.data)} ${this.renderAccuracy(e, this.data)}` : T}
    </div>` : T;
	}
	renderResults(e, t) {
		let r = t.results, i = j`<div class="head">
      <div class="eyebrow"><ha-icon icon="mdi:cash-check"></ha-icon>${e("past.result.total")}</div>
      <span class="pill-sim">${e("mode.simulation")}</span>
      ${n(e, "sim_result")}
    </div>`;
		if (!r?.days) return j`<section class="card hero" data-tipped>${i}
        <p class="say">${e("learn.results.none")}</p>
      </section>`;
		let a = r.daily, o = [{
			label: e("learn.results.chart.saving"),
			kind: "bar",
			values: a.map((e) => e.saving),
			color: "var(--joe-good)",
			negative: "var(--joe-crit)",
			digits: 2
		}], s = r.since ?? r.first;
		return j`<section class="card hero" data-tipped>
      ${i}
      <div class="figure">
        <div class="big ${r.saving > .005 ? "good" : r.saving < -.005 ? "bad" : ""}">
          ${An(e, r.saving, this.currency, !0)}
        </div>
      </div>
      <p class="say">
        ${e("learn.results.say", {
			since: s ? W(e.lang, s) : "–",
			nights: Nn(e, r.days)
		})}
      </p>
      <p class="split">
        ${e("learn.results.split", {
			better: r.better,
			worse: r.worse,
			same: Math.max(0, r.days - r.better - r.worse)
		})}
      </p>
      ${a.length > 1 ? j`<joe-chart
            .labels=${a.map((t) => W(e.lang, t.date, "weekday"))}
            .ticks=${ir(e.lang, a.map((e) => e.date))}
            .series=${o}
            centerTicks
            unit=${jn(e.lang, this.currency)}
            height="160"
            lang=${e.lang}
            label=${e("learn.results.chart")}
          ></joe-chart>` : T}
    </section>`;
	}
	renderAccuracy(e, t) {
		let r = t.accuracy.slice(-14).reverse(), i = (t) => t == null ? "–" : U(e.lang, t, 1);
		return j`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:target"></ha-icon>${e("learn.accuracy")}</div>
        ${n(e, "learn_accuracy")}
      </div>
      ${r.length ? j`<div class="table" role="table" aria-label=${e("learn.accuracy")}>
            <span class="th" role="columnheader">${e("learn.accuracy.night")}</span>
            <span class="th" role="columnheader">${e("learn.accuracy.solar")}<span class="unit">kWh</span></span>
            <span class="th" role="columnheader">${e("learn.accuracy.morning")}<span class="unit">kWh</span></span>
            <span class="th" role="columnheader">${e("learn.accuracy.result")}</span>
            ${r.map((t) => {
			let n = {
				tab: "review",
				section: "days",
				id: t.end ?? t.date
			};
			return j`<span role="cell"
                  ><a href=${k(this.prefix, n)} @click=${E(n)}>${W(e.lang, t.date, "weekday")}</a></span
                >
                <span role="cell">${e("learn.accuracy.value", {
				expected: i(t.solar.forecast),
				actual: i(t.solar.actual)
			})}</span>
                <span role="cell">${e("learn.accuracy.value", {
				expected: i(t.bridge.planned),
				actual: i(t.bridge.actual)
			})}</span>
                <span role="cell" class=${t.saving > .005 ? "good" : t.saving < -.005 ? "bad" : ""}
                  >${An(e, t.saving, this.currency, !0)}</span
                >`;
		})}
          </div>` : j`<p class="say">${e("learn.accuracy.none")}</p>`}
    </section>`;
	}
};
b([A({ attribute: !1 })], Fu.prototype, "hass", void 0), b([A({ attribute: !1 })], Fu.prototype, "t", void 0), b([A({ attribute: !1 })], Fu.prototype, "state", void 0), b([A({ attribute: !1 })], Fu.prototype, "prefix", void 0), b([A({ attribute: !1 })], Fu.prototype, "route", void 0), b([A({ attribute: !1 })], Fu.prototype, "climateFound", void 0), b([C()], Fu.prototype, "data", void 0), b([C()], Fu.prototype, "failed", void 0), _("joe-lookback-result", Fu);
//#endregion
//#region src/pages/lookback/index.ts
var Iu = {
	result: "joe-lookback-result",
	days: "joe-lookback-days",
	learned: "joe-lookback-learned",
	log: "joe-lookback-log"
}, Lu = {
	result: "mdi:piggy-bank-outline",
	days: "mdi:calendar-month-outline",
	learned: "mdi:school-outline",
	log: "mdi:format-list-bulleted"
}, Ru = class extends P {
	constructor(...e) {
		super(...e), this.prefix = M;
	}
	static {
		this.styles = [x, D`
      :host {
        display: block;
      }
    `];
	}
	render() {
		let e = this.t;
		if (!e || !this.state) return T;
		let t = this.route?.section ?? ye.review, n = me.review.map((t) => ({
			id: t,
			label: e(`nav.review.${t}`),
			icon: Lu[t]
		}));
		return j`${ni(e, this.prefix, "review", n, t)}${this.renderSection(t)}`;
	}
	renderSection(e) {
		if (!customElements.get(Iu[e])) return j``;
		let { t, hass: n, state: r, prefix: i, route: a, climateFound: o } = this;
		switch (e) {
			case "result": return j`<joe-lookback-result
          .t=${t}
          .hass=${n}
          .state=${r}
          .prefix=${i}
          .route=${a}
          .climateFound=${o}
        ></joe-lookback-result>`;
			case "days": return j`<joe-lookback-days
          .t=${t}
          .hass=${n}
          .state=${r}
          .prefix=${i}
          .route=${a}
          .climateFound=${o}
          .day=${a?.id}
        ></joe-lookback-days>`;
			case "learned": return j`<joe-lookback-learned
          .t=${t}
          .hass=${n}
          .state=${r}
          .prefix=${i}
          .route=${a}
          .climateFound=${o}
          .anchor=${a?.id}
        ></joe-lookback-learned>`;
			case "log": return j`<joe-lookback-log
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
b([A({ attribute: !1 })], Ru.prototype, "hass", void 0), b([A({ attribute: !1 })], Ru.prototype, "t", void 0), b([A({ attribute: !1 })], Ru.prototype, "state", void 0), b([A({ attribute: !1 })], Ru.prototype, "route", void 0), b([A({ attribute: !1 })], Ru.prototype, "prefix", void 0), b([A({ attribute: !1 })], Ru.prototype, "climateFound", void 0), _("joe-lookback-page", Ru);
//#endregion
//#region src/components/review.ts
var zu = /* @__PURE__ */ new Set([
	"climate",
	"heat_pump",
	"electric_heating",
	"hot_water"
]), Bu = {
	battery: "nav.devices.battery",
	grid: "nav.devices.grid",
	car: "nav.devices.car",
	other: "nav.devices.other",
	people: "nav.household.people",
	weather: "onb.part.weather",
	holiday: "onb.part.holiday"
}, Vu = class extends P {
	constructor(...e) {
		super(...e), this.checks = [], this.omit = [], this.tariffOpen = !1;
	}
	static {
		this.styles = [
			x,
			Uc,
			D`
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
		if (!e || !t || !n) return T;
		let r = new Set(this.omit), i = this.parts(e, t, n);
		return j`${[{
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
		}].map((e) => j`<section class="group">
          <h3 class="group-head">${t(`onb.group.${e.key}`)}</h3>
          <p class="group-lead">${t(`onb.group.${e.key}.lead`)}</p>
          ${e.parts.map((e) => {
			let n = i[e].filter((e) => !r.has(e.key));
			return n.length ? j`<div class="part">
                  <h4 class="eyebrow">${t(Bu[e])}</h4>
                  <ul class="found">
                    ${n.map((e) => Gc(t, e))}
                  </ul>
                </div>` : T;
		})}
        </section>`)}
      ${this.tariffOpen ? this.renderTariff(t, n) : T}`;
	}
	parts(e, t, n) {
		let r = this.discovery, i = {
			from: this,
			hass: e,
			t,
			config: n,
			discovery: r,
			checks: this.checks
		}, a = [], o = $c(i);
		o && a.push(o);
		let s = n.tariff.kind === "unknown";
		return a.push(el(i, { actions: [Z(t(s ? "review.enter" : "review.change"), "mdi:pencil-outline", () => {
			this.tariffOpen = !0;
		})] }), tl(i), rl(i, "grid_power"), rl(i, "home_power", { devices: Z(t("review.home.devices"), "mdi:devices", () => this.edit("consumers")) }), sl(i)), {
			battery: this.batteryRows(e, t, n),
			grid: a,
			car: this.carRows(t, n),
			other: [this.otherRow(t, n)],
			people: [this.peopleRow(t, n)],
			weather: [Jc(this, e, t, n, r, "weather")],
			holiday: [Jc(this, e, t, n, r, "holiday")]
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
			let n = t.soc === null ? "" : ` · ${s(e.lang, t.soc, 0)} %`;
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
			notes: [Wc(e("onb.car.none"))]
		}), r;
	}
	otherRow(e, t) {
		let n = t.consumers.filter((e) => e.kind !== "submeter");
		return n.length ? {
			key: "devices",
			icon: "mdi:devices",
			title: e("find.devices"),
			detail: e("find.devices.detail", {
				count: Q(e, n.length, "word.device"),
				heating: n.filter((e) => zu.has(e.kind)).length
			})
		} : {
			key: "devices",
			icon: "mdi:devices",
			title: e("find.devices"),
			detail: e("find.none"),
			state: "missing",
			notes: [Wc(e("onb.other.none"))]
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
			notes: [Wc(e("onb.people.none"))]
		} : {
			key: "people",
			icon: "mdi:account-group-outline",
			title: e("find.people"),
			detail: e("find.people.detail", {
				persons: Q(e, t.persons.length, "word.person"),
				calendars: Q(e, n, "word.calendar")
			})
		};
	}
	batteryRows(t, n, r) {
		let i = [];
		for (let a of r.batteries) {
			let o = this.discovery?.batteries.find((e) => e.id === a.id), c = u(t, a.soc_entity), l = a.capacity_kwh ?? y(t, a.capacity_entity), d = [
				l ? `${s(n.lang, l, 2)} kWh` : n("review.capacity_unknown"),
				c === null ? null : `${s(n.lang, c, 0)} %`,
				a.adapter === "none" ? n("find.battery.read") : n("find.battery.control")
			], f = this.checks.filter((e) => e.battery_id === a.id);
			i.push({
				key: `battery:${a.id}`,
				icon: "mdi:home-battery-outline",
				title: a.name,
				detail: d.filter(Boolean).join(" · "),
				chips: [O(n, F(r, `batteries[${a.id}].soc_entity`)), ...o ? [e(n, o.confidence)] : []],
				reasons: o?.reasons,
				notes: f.map((e) => Xc(n, e)),
				state: f.some((e) => e.level === "warn") ? "flag" : void 0,
				tip: "review_battery",
				actions: [Z(n("review.change"), "mdi:pencil-outline", () => this.edit("battery", a.id)), Z(n("review.ignore"), "", () => this.ignoreBattery(a.id), !0)]
			});
		}
		for (let e of this.discovery?.batteries ?? []) I(r, `battery:${e.id}`) && !r.batteries.some((t) => t.id === e.id) && i.push({
			key: `battery:${e.id}`,
			icon: "mdi:home-battery-outline",
			title: e.name,
			detail: n("review.ignored"),
			state: "ignored",
			tip: "review_ignored",
			actions: [Z(n("review.use"), "mdi:undo-variant", () => void mi(this, r, e))]
		});
		return !r.batteries.length && !this.discovery?.batteries.length && i.push({
			key: "battery:add",
			icon: "mdi:home-battery-outline",
			title: n("review.battery"),
			detail: n("review.battery.none"),
			state: "missing",
			tip: "review_battery_add",
			actions: [Z(n("review.add"), "mdi:plus", () => void hi(this, n, t, r))]
		}), i;
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
		L(this, {
			batteries: { [e]: null },
			answers: { ignored: Qe(this.config, `battery:${e}`, !0) }
		});
	}
	renderTariff(e, t) {
		return j`<joe-sheet label=${e("edit.tariff.label")} closeLabel=${e("common.close")} @joe-close=${(e) => {
			e.stopPropagation(), this.tariffOpen = !1;
		}}>
      <div class="sheet-title">${N(e("edit.tariff.title"))}</div>
      <joe-tariff-draft closable .hass=${this.hass} .t=${e} .config=${t} .discovery=${this.discovery}></joe-tariff-draft>
    </joe-sheet>`;
	}
};
b([A({ attribute: !1 })], Vu.prototype, "hass", void 0), b([A({ attribute: !1 })], Vu.prototype, "t", void 0), b([A({ attribute: !1 })], Vu.prototype, "config", void 0), b([A({ attribute: !1 })], Vu.prototype, "discovery", void 0), b([A({ attribute: !1 })], Vu.prototype, "checks", void 0), b([A({ attribute: !1 })], Vu.prototype, "omit", void 0), b([C()], Vu.prototype, "tariffOpen", void 0), _("joe-review", Vu);
//#endregion
//#region src/components/step-nav.ts
function Hu(e, t, r = !1) {
	let i = j`<button type="button" class="btn btn-primary" ?data-notip=${!t.nextTip} @click=${t.next}>
    ${t.nextLabel}<ha-icon icon="mdi:chevron-right"></ha-icon>
  </button>`;
	return j`<nav class="step-nav ${r ? "wide" : ""}" aria-label=${e("onb.nav")}>
    ${t.back ? j`<button type="button" class="btn btn-ghost" data-notip @click=${t.back}>
          <ha-icon icon="mdi:chevron-left"></ha-icon>${t.backLabel ?? e("onb.back")}
        </button>` : j`<span></span>`}
    ${t.nextTip ? j`<span class="with-tip" data-tipped>${i} ${n(e, t.nextTip)}</span>` : i}
  </nav>`;
}
//#endregion
//#region src/pages/questions.ts
var Uu = {
	tariff: "plan",
	feed_in: "plug",
	capacity: "night-charge",
	heating: "ask",
	climate: "switch",
	hot_water: "hot-water",
	ev: "ev",
	home_office: "plan",
	household: "relax"
}, Wu = [
	"climate",
	"heat_pump",
	"electric_heating"
];
function Gu(e) {
	let t = [], n = (t) => F(e, t)?.source === "user", r = (t) => e.answers[t] !== void 0 && e.answers[t] !== null, i = e.tariff;
	(i.kind === "unknown" || n("tariff.kind") || r("tariff")) && t.push("tariff"), (i.feed_in_price == null && !i.feed_in_entity || n("tariff.feed_in_price") || r("feed_in")) && t.push("feed_in");
	for (let i of e.batteries) {
		let e = `capacity:${i.id}`;
		(i.capacity_kwh == null && !i.capacity_entity || n(`batteries[${i.id}].capacity_kwh`) || r(e)) && t.push(e);
	}
	return t.push("heating", "climate", "hot_water", "ev", "home_office", "household"), t;
}
var Ku = class extends P {
	constructor(...e) {
		super(...e), this.single = "", this.index = 0;
	}
	static {
		this.styles = [x, D`
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
		if (!e || !t) return T;
		if (this.single) return this.renderQuestion(e, t, this.single);
		let r = Gu(t), i = Math.min(this.index, r.length - 1), a = r[i], o = i === r.length - 1, s = hs(t), c = Hu(e, {
			back: () => this.move(-1, r.length),
			next: () => this.move(1, r.length),
			nextLabel: e(o ? "ask.finish" : "onb.next")
		});
		return j`${c}
      <div class="wrap">
        <joe-pose name=${Uu[a.split(":")[0]] ?? "ask"}></joe-pose>
        <div>
          <nav class="topics" aria-label=${e("ask.topics")} data-notip>
            <span class="eyebrow">${e("ask.count", {
			n: i + 1,
			total: r.length
		})}</span>
            ${r.map((n, r) => j`${r ? j`<ha-icon class="arrow" icon="mdi:chevron-right" aria-hidden="true"></ha-icon>` : T}<button
                type="button"
                class="topic ${r < i ? "done" : ""}"
                aria-current=${r === i ? "step" : "false"}
                @click=${() => this.index = r}
              >
                ${s.includes(n) ? j`<ha-icon icon="mdi:clock-outline" title=${e("ask.later.marked")}></ha-icon>` : r < i ? j`<ha-icon icon="mdi:check"></ha-icon>` : T}${this.topic(e, t, n)}
              </button>`)}
          </nav>
          ${this.renderQuestion(e, t, a)}
          <div class="actions">
            <button type="button" class="btn btn-primary" data-notip @click=${() => this.move(1, r.length)}>
              ${e(o ? "ask.finish" : "onb.next")}
            </button>
            <span class="with-tip" data-tipped>
              <button
                type="button"
                class="btn btn-secondary"
                aria-pressed=${s.includes(a) ? "true" : "false"}
                @click=${() => this.later(a, r.length)}
              >
                <ha-icon icon="mdi:clock-outline"></ha-icon>${e("ask.later")}
              </button>
              ${n(e, "ask_later")}
            </span>
            <button type="button" class="btn btn-ghost" data-notip @click=${() => this.move(-1, r.length)}>
              ${e("onb.back")}
            </button>
          </div>
        </div>
      </div>`;
	}
	renderQuestion(e, t, n) {
		if (n.startsWith("capacity:")) return this.renderCapacity(e, t, n.slice(9));
		switch (n) {
			case "tariff": return this.question(e("q.tariff.title"), "q_tariff", j`<joe-tariff-form
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
			case "climate": return this.question(e("q.climate.title"), "q_climate", j`${this.choice(e, "climate", [{
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
			case "home_office": return this.question(e("q.home_office.title"), "q_home_office", j`${this.choice(e, "home_office", [{
				value: "yes",
				label: e("q.home_office.yes"),
				icon: "mdi:home-account"
			}, {
				value: "no",
				label: e("q.home_office.no"),
				icon: "mdi:office-building-outline"
			}], !1, (e) => e === "yes" || e === "no" ? { calendar: { default_workday: e === "yes" ? "home_office" : "office" } } : {})}
            <p class="hint">${e("q.home_office.hint")}</p>`);
			default: return this.question(e("q.household.title"), "q_household", j`<joe-household
            .hass=${this.hass}
            .t=${e}
            .config=${t}
            .discovery=${this.discovery}
          ></joe-household>`);
		}
	}
	question(e, t, r) {
		let i = this.t;
		return j`<div data-tipped>
      <div class="title-row">${N(e, "h2", n(i, t))}</div>
      ${S}
      <div class="content">${r}</div>
    </div>`;
	}
	choice(e, t, n, r = !1, i) {
		let a = this.config?.answers[t];
		return j`<joe-choice
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
		let r = t.answers.hot_water, i = r === "hot_water_heat_pump" || r === "electric", a = t.consumers.filter((e) => e.kind === "hot_water"), o = t.actions.find((e) => at(e, _s(t, e)) === "hot_water");
		return this.question(e("q.hot_water.title"), "q_hot_water", j`${this.choice(e, "hot_water", [
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
      ${i ? j`<div class="follow">
            <p class="hint">${a.length ? e("q.hot_water.devices") : e("q.hot_water.no_devices")}</p>
            ${a.length ? j`<div class="chips">${a.map((e) => j`<span class="chip learned">${e.name}</span>`)}</div>` : T}
            <p class="hint">${o ? e("q.hot_water.has_action", { name: o.name }) : e("q.hot_water.offer")}</p>
            <div class="with-tip" data-tipped style="margin-top:10px">
              <button
                type="button"
                class="mini-btn ${o ? "" : "go"}"
                @click=${() => this.dispatchEvent(new CustomEvent("joe-edit", {
			detail: {
				editor: "action",
				id: o ? o.id : "new:hot_water"
			},
			bubbles: !0,
			composed: !0
		}))}
              >
                <ha-icon icon=${o ? "mdi:pencil-outline" : "mdi:water-boiler"}></ha-icon>${e(o ? "q.hot_water.edit" : "q.hot_water.set_up")}
              </button>
              ${n(e, "q_hot_water_action")}
            </div>
          </div>` : T}`);
	}
	renderEv(e, t) {
		let r = this.discovery?.wallboxes.find((e) => e.is_car), i = t.actions.find((e) => at(e, _s(t, e)) === "car");
		return this.question(e("q.ev.title"), "q_ev", j`${this.choice(e, "ev", [{
			value: "yes",
			label: r ? e("q.ev.yes_wallbox", { name: r.name }) : e("q.ev.yes"),
			icon: "mdi:car-electric"
		}, {
			value: "no",
			label: e("q.ev.no"),
			icon: "mdi:car-off"
		}])}
      ${t.answers.ev === "yes" ? j`<div class="follow">
            <p class="hint">${i ? e("q.ev.has_action", { name: i.name }) : e("q.ev.offer")}</p>
            <div class="with-tip" data-tipped style="margin-top:10px">
              <button
                type="button"
                class="mini-btn ${i ? "" : "go"}"
                @click=${() => this.dispatchEvent(new CustomEvent("joe-edit", {
			detail: {
				editor: "action",
				id: i ? i.id : "new:ev"
			},
			bubbles: !0,
			composed: !0
		}))}
              >
                <ha-icon icon=${i ? "mdi:pencil-outline" : "mdi:ev-station"}></ha-icon>${e(i ? "q.ev.edit" : "q.ev.set_up")}
              </button>
              ${n(e, "q_ev_action")}
            </div>
          </div>` : T}`);
	}
	renderHeating(e, t) {
		let r = t.answers.heating, i = Array.isArray(r) ? r : [], a = t.consumers.filter((e) => i.includes(e.kind)), o = i.some((e) => Wu.includes(e));
		return this.question(e("q.heating.title"), "q_heating", j`${this.choice(e, "heating", [
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
        ${o && t.consumers.length ? j`<div class="follow">
              <p class="hint">${a.length ? e("q.heating.devices") : e("q.heating.no_devices")}</p>
              ${a.length ? j`<div class="chips">
                    ${a.map((e) => j`<span class="chip learned">${e.name}</span>`)}
                  </div>` : T}
              <div class="with-tip" style="margin-top:10px">
                <button type="button" class="mini-btn" @click=${() => this.edit("consumers")}>
                  <ha-icon icon="mdi:devices"></ha-icon>${e("q.heating.assign")}
                </button>
                ${n(e, "f_consumer_kind")}
              </div>
            </div>` : T}`);
	}
	renderFeedIn(e, t) {
		let n = t.tariff.feed_in_price, r = t.answers.feed_in === Pa;
		return this.question(e("q.feed_in.title"), "q_feed_in", j`<div class="inline">
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
			answers: { feed_in: Pa }
		})}
        >
          ${e("ask.idk")}
        </button>
      </div>`);
	}
	renderCapacity(e, t, n) {
		let r = t.batteries.find((e) => e.id === n);
		if (!r) return j``;
		let i = `capacity:${n}`, a = t.answers[i] === Pa;
		return this.question(e("q.capacity.title", { name: r.name }), "q_capacity", j`<div class="inline">
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
			answers: { [i]: Pa }
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
		let n = hs(this.config);
		n.includes(e) && (t = {
			...t,
			answers: {
				...t.answers ?? {},
				later: n.filter((t) => t !== e)
			}
		}), L(this, t);
	}
	later(e, t) {
		let n = hs(this.config);
		n.includes(e) || L(this, { answers: { later: [...n, e] } }), this.move(1, t);
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
b([A({ attribute: !1 })], Ku.prototype, "hass", void 0), b([A({ attribute: !1 })], Ku.prototype, "t", void 0), b([A({ attribute: !1 })], Ku.prototype, "config", void 0), b([A({ attribute: !1 })], Ku.prototype, "discovery", void 0), b([A()], Ku.prototype, "single", void 0), b([C()], Ku.prototype, "index", void 0), _("joe-questions", Ku);
//#endregion
//#region src/pages/onboarding.ts
var qu = {
	climate: "q.heating.climate",
	heat_pump: "q.heating.heat_pump",
	electric_heating: "q.heating.electric",
	none: "q.heating.none"
}, Ju = class extends P {
	constructor(...e) {
		super(...e), this.step = "welcome", this.checks = [], this.prefix = M, this.discovering = !1, this.discoveryFailed = !1;
	}
	static {
		this.styles = [x, D`
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
		if (!e) return T;
		switch (this.step) {
			case "welcome": return this.layout("welcome", j`${N(e("onb.welcome.title"), "h1")} ${S}
            <p class="lead">${e("onb.welcome.lead")}</p>
            <div class="calm"><span class="pill-sim">${e("mode.simulation")}</span>${e("onb.calm")}</div>
            <details data-notip>
              <summary>${e("onb.welcome.more")}</summary>
              ${e("onb.welcome.more.text").split("\n").map((e) => j`<p>${e}</p>`)}
            </details>
            <div class="actions" data-tipped>
              <button type="button" class="btn btn-primary" @click=${() => this.go("scan")}>
                ${e("onb.welcome.go")}
              </button>
              ${n(e, "scan_start")}
            </div>`);
			case "scan": return this.renderScan(e);
			case "questions": return j`<joe-questions
          .hass=${this.hass}
          .t=${e}
          .config=${this.config}
          .discovery=${this.discovery}
        ></joe-questions>`;
			case "done": return this.renderDone(e);
		}
	}
	renderScan(e) {
		if (this.discovering || !this.discovery && !this.discoveryFailed) return this.layout("scout", j`${N(e("onb.scan.title"))} ${S}
          <p class="lead">${e("onb.scan.lead")}</p>
          ${this.renderEnergy(e)}
          <div class="looking" role="status">${e("scan.looking")}</div>`);
		let t = Hu(e, {
			back: () => this.go("welcome"),
			next: () => this.go("questions"),
			nextLabel: e("onb.next")
		}, !0);
		return j`${t}
      <div class="wrap wide">
        <joe-pose name="scout"></joe-pose>
        <div>
          ${N(e("scan.title"))} ${S}
          <p class="lead">${e("scan.lead")}</p>
          ${this.discoveryFailed ? j`<p class="failed">${e("scan.failed")}</p>` : T}
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
              ${n(e, "rescan")}
            </span>
            <button type="button" class="btn btn-ghost" data-notip @click=${() => this.go("welcome")}>
              ${e("onb.back")}
            </button>
          </div>
        </div>
      </div>`;
	}
	renderDone(e) {
		let t = Hu(e, {
			back: () => this.go("scan"),
			backLabel: e("onb.done.change"),
			next: () => this.complete(),
			nextLabel: e("onb.done.go"),
			nextTip: "start"
		});
		return j`${t}
    ${this.layout("thumbs", j`${N(e("onb.done.title"))} ${S}
        ${this.config ? this.renderSummary(e, this.config) : T}
        <div class="calm"><span class="pill-sim">${e("mode.simulation")}</span>${e("onb.done.lead")}</div>
        <div class="actions">
          <span class="with-tip" data-tipped>
            <button type="button" class="btn btn-primary" @click=${() => this.complete()}>${e("onb.done.go")}</button>
            ${n(e, "start")}
          </span>
          <button type="button" class="btn btn-ghost" data-notip @click=${() => this.go("scan")}>
            ${e("onb.done.change")}
          </button>
        </div>`)}`;
	}
	renderSummary(e, t) {
		let n = this.hass, r = t.batteries.reduce((e, t) => e + (t.capacity_kwh ?? (n ? y(n, t.capacity_entity) : null) ?? 0), 0), i = hs(t), a = (e) => i.includes(e) && gs(t, e), o = (n, r) => {
			if (a(n)) return e("sum.later");
			let i = t.answers[n];
			if (i === "unknown") return e("sum.unknown");
			let o = Array.isArray(i) ? i : typeof i == "string" ? [i] : [];
			return o.length ? o.map((t) => e.optional(r[t] ?? "") ?? t).join(", ") : e("sum.open");
		}, l = (r) => {
			let i = t.context[r];
			return i ? n ? c(n, i) : i : e("sum.none");
		}, u = this.discovery?.forecast, d = [
			[
				e("sum.batteries"),
				t.batteries.length ? e("sum.batteries.value", {
					count: t.batteries.length,
					kwh: r ? s(e.lang, r, 1) : "?"
				}) : e("sum.none"),
				ms(e, "battery")
			],
			[
				e("sum.tariff"),
				a("tariff") ? e("sum.later") : t.tariff.kind === "unknown" ? e("sum.unknown") : Je(e, t.tariff, !1),
				fs(e, "tariff")
			],
			[
				e("sum.feed_in"),
				t.tariff.feed_in_price == null ? t.tariff.feed_in_entity ? e("sum.from_sensor") : a("feed_in") ? e("sum.later") : e("sum.unknown") : `${qe(e, t.tariff.feed_in_price)} ct`,
				fs(e, "feed_in")
			],
			[
				e("sum.forecast"),
				t.forecast.provider ? u ? e("sum.forecast.value", {
					provider: u.provider_name,
					planes: Q(e, u.planes, "word.plane")
				}) : t.forecast.provider : e("sum.none"),
				ms(e, "grid")
			],
			[
				e("sum.heating"),
				o("heating", qu),
				fs(e, "heating")
			],
			[
				e("sum.climate"),
				o("climate", {
					yes: "sum.yes",
					no: "sum.no"
				}),
				fs(e, "climate")
			],
			[
				e("sum.hot_water"),
				o("hot_water", {
					hot_water_heat_pump: "q.hot_water.heat_pump",
					electric: "q.hot_water.electric",
					heating: "q.hot_water.heating",
					other: "q.hot_water.other"
				}),
				fs(e, "hot_water")
			],
			[
				e("sum.ev"),
				o("ev", {
					yes: "q.ev.yes",
					no: "q.ev.no"
				}),
				fs(e, "ev")
			],
			[
				e("sum.home_office"),
				o("home_office", {
					yes: "sum.home_office.yes",
					no: "sum.home_office.no"
				}),
				fs(e, "home_office")
			],
			[
				e("sum.household"),
				a("household") ? e("sum.later") : e("sum.household.value", {
					persons: Q(e, t.persons.length, "word.person"),
					calendars: Q(e, t.persons.reduce((e, t) => e + t.calendars.length, 0), "word.calendar")
				}),
				fs(e, "household")
			],
			[
				e("sum.weather"),
				l("weather_entity"),
				ms(e, "weather")
			],
			[
				e("sum.holiday"),
				l("holiday_entity"),
				ms(e, "holiday")
			]
		];
		return j`<p class="homes-hint">${e("onb.done.homes")}</p>
      <div class="lines">
        ${d.map(([t, n, r]) => j`<div class="line">
            <span class="label">${t}</span><span class="value">${n}</span>
            <span class="home">${e("sum.lives_at")} ${this.homeLink(r)}</span>
          </div>`)}
      </div>`;
	}
	homeLink(e) {
		return j`<a
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
		return j`<div class="wrap">
      <joe-pose name=${e}></joe-pose>
      <div>${t}</div>
    </div>`;
	}
	renderEnergy(e) {
		let t = this.info?.energy;
		if (!t?.configured || !t.sources) return j`<div class="found"><p>${e("onb.scan.energy.none")}</p></div>`;
		let n = [
			Q(e, t.sources.grid ?? 0, "word.grid"),
			Q(e, t.sources.solar ?? 0, "word.solar"),
			Q(e, t.sources.battery ?? 0, "word.battery"),
			Q(e, t.devices ?? 0, "word.device")
		];
		return j`<div class="found">
      <p>${e("onb.scan.energy")}</p>
      <div class="chips">
        ${n.map((e) => j`<span class="chip read"><ha-icon icon="mdi:eye-outline"></ha-icon>${e}</span>`)}
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
b([A()], Ju.prototype, "step", void 0), b([A({ attribute: !1 })], Ju.prototype, "t", void 0), b([A({ attribute: !1 })], Ju.prototype, "info", void 0), b([A({ attribute: !1 })], Ju.prototype, "hass", void 0), b([A({ attribute: !1 })], Ju.prototype, "config", void 0), b([A({ attribute: !1 })], Ju.prototype, "discovery", void 0), b([A({ attribute: !1 })], Ju.prototype, "checks", void 0), b([A({ attribute: !1 })], Ju.prototype, "prefix", void 0), b([A({ type: Boolean })], Ju.prototype, "discovering", void 0), b([A({ type: Boolean })], Ju.prototype, "discoveryFailed", void 0), _("joe-onboarding", Ju);
//#endregion
//#region src/pages/overview/climate-list.ts
function Yu(e) {
	let t = e?.config.climate;
	return t?.enabled ? Object.entries(t.rooms ?? {}).filter(([, e]) => e.enabled).map(([e]) => e) : [];
}
var Xu = {
	tab: "devices",
	section: "climate"
}, Zu = class extends P {
	constructor(...e) {
		super(...e), this.prefix = M;
	}
	static {
		this.styles = [x, D`
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
		let { t: e, hass: t, state: r } = this, i = Yu(r);
		if (!e || !r || !i.length) return T;
		let a = r.config, o = a.climate?.away_after_min ?? 15, s = i.map((n) => {
			let i = this.climateFound?.devices.find((e) => e.entity_id === n), s = a.climate?.rooms[n], l = r.climate?.rooms[n];
			return {
				entity: n,
				name: i?.name ?? (t ? c(t, n) : n),
				area: i?.area ?? ct(t, i?.device_id, n) ?? "",
				temps: Pc(e, Nc(t, i, n)),
				profile: i ? Fc(e, i, l, s?.device_profiles ?? {}) : void 0,
				why: Ic(e, l, o)
			};
		});
		s.sort((t, n) => t.area.localeCompare(n.area, e.lang) || t.name.localeCompare(n.name, e.lang));
		let l = !!r.climate?.live;
		return j`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:thermostat"></ha-icon>${e("overview.climate")}</div>
        ${l ? T : j`<span class="chip">${e("overview.climate.would")}</span>`}
        ${n(e, "overview_climate")}
        <a class="mini-btn quiet all" href=${k(this.prefix, Xu)} @click=${E(Xu)}>${e("overview.climate.all")}</a>
      </div>
      <div class="rooms">
        ${s.map((e) => {
			let t = z({
				group: "climate",
				id: e.entity
			}), n = [e.profile, e.why].filter(Boolean).join(" · ");
			return j`<a class="room" href=${k(this.prefix, t)} @click=${E(t)}>
            <span class="room-text">
              <span class="room-name">${e.area || e.name}${e.area ? j`<small>${e.name}</small>` : T}</span>
              ${e.temps ? j`<span class="room-temp">${e.temps}</span>` : T}
              ${n ? j`<span class="room-why">${n}</span>` : T}
            </span>
            <ha-icon class="go" icon="mdi:chevron-right"></ha-icon>
          </a>`;
		})}
      </div>
    </section>`;
	}
};
b([A({ attribute: !1 })], Zu.prototype, "hass", void 0), b([A({ attribute: !1 })], Zu.prototype, "t", void 0), b([A({ attribute: !1 })], Zu.prototype, "state", void 0), b([A({ attribute: !1 })], Zu.prototype, "prefix", void 0), b([A({ attribute: !1 })], Zu.prototype, "climateFound", void 0), _("joe-overview-climate", Zu);
//#endregion
//#region src/pages/overview/quick.ts
function Qu(e) {
	return e.config.cars ?? [];
}
function $u(e) {
	let { guest_switch: t, guest_tracker: n } = e.config.context;
	return t && n ? t : void 0;
}
function ed(e) {
	return !!(e && (Qu(e).length || $u(e)));
}
var td = class extends P {
	constructor(...e) {
		super(...e), this.prefix = M;
	}
	static {
		this.styles = [x, D`
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
		let { t: e, hass: t, state: r } = this;
		if (!e || !t || !r || !ed(r)) return T;
		let i = $u(r), a = i ? t.states[i]?.state === "on" : !1, o = r.config.context.guest_tracker;
		return j`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:lightning-bolt-outline"></ha-icon>${e("overview.quick")}</div>
        ${n(e, "quick")}
      </div>
      ${Qu(r).map((n) => {
			let i = m(n.id);
			return j`<div class="item">
          <a class="name" href=${k(this.prefix, i)} @click=${E(i)}>
            <ha-icon icon="mdi:car-electric"></ha-icon>${n.name}
          </a>
          <joe-car-charge flush .hass=${t} .t=${e} .state=${r} .car=${n}></joe-car-charge>
        </div>`;
		})}
      ${i ? j`<div class="item guest" data-tipped>
            <button
              type="button"
              class="switch"
              role="switch"
              aria-checked=${String(a)}
              aria-labelledby="quick-guest"
              @click=${() => Xl(t, i)}
            ></button>
            <b id="quick-guest">${e("household.guest")}</b>
            ${n(e, "household_guest")}
            <small>${e(o && t.states[o]?.state === "home" ? "household.guest.home" : "household.guest.away")}</small>
          </div>` : T}
    </section>`;
	}
};
b([A({ attribute: !1 })], td.prototype, "hass", void 0), b([A({ attribute: !1 })], td.prototype, "t", void 0), b([A({ attribute: !1 })], td.prototype, "state", void 0), b([A({ attribute: !1 })], td.prototype, "prefix", void 0), _("joe-overview-quick", td);
//#endregion
//#region src/pages/overview.ts
var nd = { tab: "plan" }, rd = {
	tab: "review",
	section: "days"
}, id = {
	tab: "review",
	section: "result"
}, ad = {
	tab: "household",
	section: "presence"
}, od = class extends P {
	constructor(...e) {
		super(...e), this.prefix = M, this.checks = [], this.devices = [], this.loadingSparring = !1;
	}
	static {
		this.styles = [x, D`
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
		super.connectedCallback(), this.loadWeek(), this.loadSparring();
	}
	willUpdate(e) {
		let t = this.state?.observe, n = `${t?.last_hour ?? ""}|${t?.backfill.state ?? ""}|${t?.day_count ?? 0}`;
		e.has("state") && this.marker !== void 0 && n !== this.marker ? (this.loadWeek(), this.loadSparring()) : e.has("state") && !!this.state?.config.sparring?.enabled !== this.sparringOn && this.loadSparring(), this.marker = n;
	}
	async loadSparring() {
		if (this.state) {
			if (this.sparringOn = !!this.state.config.sparring?.enabled, !this.sparringOn) {
				this.sparring = void 0;
				return;
			}
			this.loadingSparring ||= (this.loadingSparring = !0, this.sparring = await Ko(this.hass) ?? this.sparring, !1);
		}
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
		if (!e || !t) return T;
		let n = ws(e, t, {
			hass: this.hass,
			climateFound: this.climateFound,
			discovery: this.discovery,
			checks: this.checks,
			devices: this.devices,
			profiles: this.info?.profiles,
			sparring: Jo(this.sparring)
		}), r = jo(t), i = r || n.length > 0 || (t.questions?.length ?? 0) > 0, a = n.some((e) => e.id.startsWith("test:")), o = ed(t), s = Yu(t).length > 0, c = this.renderWho(e, t), l = (e) => e ? "" : "wide";
		return j`<div class="grid">
      ${this.renderNow(e, t)}
      ${i ? j`<joe-overview-inbox
            class="wide"
            .t=${e}
            .hass=${this.hass}
            .state=${t}
            .prefix=${this.prefix}
            .items=${n}
            .steer=${r}
          ></joe-overview-inbox>` : T}
      ${this.renderNight(e, t, l(o), !r, a)}
      ${o ? j`<joe-overview-quick .t=${e} .hass=${this.hass} .state=${t} .prefix=${this.prefix}></joe-overview-quick>` : T}
      ${s ? j`<joe-overview-climate
            class="wide"
            .t=${e}
            .hass=${this.hass}
            .state=${t}
            .prefix=${this.prefix}
            .climateFound=${this.climateFound}
          ></joe-overview-climate>` : T}
      ${c ? this.line(ad, "mdi:home-account", e("overview.who"), c, "", "") : T}
      ${this.renderResult(e, t, l(!!c))} ${this.renderWeek(e)}
    </div>`;
	}
	renderNow(e, t) {
		let r = this.hass, i = t.config;
		if (!r) return j``;
		let a = i.measurements, o = a.solar_power.length ? ie(r, a.solar_power) : null, c = we(r, a.grid_power), l = i.batteries.map((e) => ({
			power: we(r, e.power),
			soc: u(r, e.soc_entity)
		})), d = l.filter((e) => e.power != null), f = d.length ? d.reduce((e, t) => e + (t.power ?? 0), 0) : null, p = we(r, a.home_power), m = p == null && c != null;
		m && (p = (c ?? 0) + (o ?? 0) - (f ?? 0));
		let h = l.map((e) => e.soc).filter((e) => e != null), g = (t) => t == null ? "–" : s(e.lang, Math.abs(t), 2), _ = (e, t, n, r, i) => j`<div class="flow ${e}">
        <span class="icon"><ha-icon icon=${t}></ha-icon></span>
        <small>${n}</small>
        <b>${g(r)}<span>kW</span></b>
        <em>${i}</em>
      </div>`, ee = (e) => e == null || Math.abs(e) < .05;
		return j`<section class="card wide" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:pulse"></ha-icon>${e("overview.now")}</div>
        ${n(e, "now")}
      </div>
      <div class="now">
        ${_("sun", "mdi:solar-power", e("overview.now.solar"), o, e(o == null ? "overview.now.none" : "overview.now.solar.sub"))}
        ${_("home", "mdi:home-lightning-bolt-outline", e("overview.now.home"), p, e(p == null ? "overview.now.none" : m ? "overview.now.home.calc" : "overview.now.home.sub"))}
        ${_("battery", "mdi:home-battery-outline", ee(f) ? e("overview.now.battery") : e(f > 0 ? "overview.now.battery.charge" : "overview.now.battery.discharge"), f, h.length ? h.length === 1 ? e("overview.now.soc", { value: s(e.lang, h[0], 0) }) : e("overview.now.soc_avg", {
			value: s(e.lang, h.reduce((e, t) => e + t, 0) / h.length, 0),
			count: h.length
		}) : i.batteries.length ? e("overview.now.none") : e("overview.now.no_battery"))}
        ${_("net", "mdi:transmission-tower", ee(c) ? e("overview.now.grid") : e(c > 0 ? "overview.now.grid.in" : "overview.now.grid.out"), c, c == null ? e("overview.now.none") : ee(c) ? e("overview.now.grid.idle") : e(c > 0 ? "overview.now.grid.in.sub" : "overview.now.grid.out.sub"))}
      </div>
      ${this.renderDoing(e, t)}
    </section>`;
	}
	renderDoing(e, t) {
		let n = t.control, r = this.doingLines(e, t);
		return !n && !r.length ? T : j`<div class="doing">
      <div class="eyebrow"><ha-icon icon="mdi:robot-outline"></ha-icon>${e("overview.doing")}</div>
      ${n ? j`<p class="doing-text">${bo(e, t)}</p>` : T}
      ${r.length ? j`<ul>${r.map((e) => j`<li>${e}</li>`)}</ul>` : T}
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
				what: Ps(e, t, n)
			}));
		}
		let a = go(e, lo(t));
		a && i.push(a);
		let o = Xi(e, ji(t));
		o && i.push(o);
		for (let t of r.actions) {
			let r = n?.actions?.[t.id];
			r?.on && i.push(e("overview.doing.action", {
				name: t.name,
				time: v(r.end)
			}));
		}
		let s = t.climate;
		if (s?.live) {
			let n = Yu(t).map((e) => ({
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
	renderNight(e, t, r, i, o) {
		let c = t.plan;
		if (!c) return j`<section class="card ${r}">
        <joe-pose name="relax"></joe-pose>
        <div class="eyebrow"><ha-icon icon="mdi:weather-night"></ha-icon>${e("overview.night")}</div>
        ${N(e("overview.night.empty.title"))} ${S}
        <p class="lead">${e("overview.night.empty.text")}</p>
      </section>`;
		let l = Ae(e, c), u = ae(e, c, this.hass?.config?.currency), d = c.kind === "charge" || c.kind === "hold" ? j`${s(e.lang, c.target ?? 0, 0)}<small>%</small>` : j`${e(c.kind === "none" ? "plan.big.none" : "plan.big.unavailable")}`;
		return j`<section class="card figure-card ${r}" data-tipped>
      <joe-pose name=${Ne(c)}></joe-pose>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:weather-night"></ha-icon>${e("overview.night")}</div>
        ${n(e, "plan_target")}
      </div>
      ${c.window ? j`<p class="when">${a(e, c)}</p>` : T}
      <div class="big">${d}</div>
      ${S}
      <p class="say">${se(e, c)}</p>
      ${l.length ? j`<div class="lines">${l.map((e) => j`<div>${e}</div>`)}</div>` : T}
      ${u ? j`<p class="cost">${u}</p>` : T}
      ${i && Ao(t) ? j`<joe-steer-tonight
            compact
            .hideUntested=${o}
            .t=${e}
            .hass=${this.hass}
            .state=${t}
            .prefix=${this.prefix}
          ></joe-steer-tonight>` : T}
      <div class="bottom">
        <span class="chip ${c.fixed ? "ok" : ""}">
          ${c.fixed ? e("plan.fixed_at", { time: c.created.slice(11, 16) }) : e("plan.preview_at", { time: c.created.slice(11, 16) })}
        </span>
        <a class="btn btn-secondary stretch" href=${k(this.prefix, nd)} @click=${E(nd)}>${e("overview.night.more")}</a>
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
		return j`<a class="card line ${a}" href=${k(this.prefix, e)} @click=${E(e)}>
      <ha-icon icon=${t}></ha-icon>
      <span class="line-text">
        <span class="eyebrow">${n}</span>
        <b class=${i}>${r}</b>
        ${o ? j`<small>${o}</small>` : T}
      </span>
      <ha-icon class="go" icon="mdi:chevron-right"></ha-icon>
    </a>`;
	}
	renderResult(e, t, n) {
		let r = t.results, i = r?.last, a = e("overview.result"), o = this.hass?.config?.currency, s = this.hass?.config?.time_zone, c = (t) => t === Mn(s) ? e("overview.result.last") : e("overview.result.night", { day: W(e.lang, t, "weekday") }), l = r?.since ?? r?.first, u = r ? e("overview.result.total", {
			since: l ? W(e.lang, l) : "–",
			value: An(e, r.saving, o, !0),
			nights: Nn(e, r.days)
		}) : "", d = t.control?.last_night, f = d?.night.slice(0, 10), p = i?.window?.end.slice(0, 10) ?? i?.date;
		if (d && f && (!p || f >= p)) {
			let t = e.optional(`overview.left.${d.why}`) ?? e("overview.left.enough"), r = e("overview.result.left", {
				night: c(f),
				why: t
			});
			return this.line(id, "mdi:calculator-variant-outline", a, r, "", n, u);
		}
		if (!r || !i) return this.line(id, "mdi:calculator-variant-outline", a, e("overview.result.none"), "", n);
		let m = c(p ?? i.date), h = i.saving, g = h > .005 ? "good" : h < -.005 ? "bad" : "", _ = g === "good" ? e("overview.result.saved", {
			night: m,
			value: An(e, h, o)
		}) : g === "bad" ? e("overview.result.cost", {
			night: m,
			value: An(e, -h, o)
		}) : e("overview.result.same", { night: m }), ee = !i.final && i.until ? ` · ${e("overview.result.provisional", { time: i.until.slice(11, 16) })}` : "";
		return this.line(id, "mdi:calculator-variant-outline", a, _, g, n, `${u}${ee}`);
	}
	renderWeek(e) {
		let t = [...this.week ?? []].reverse(), r = this.state?.observe, i = r?.backfill.state === "running" ? e("history.reading") : r?.first_day ? e("overview.week.known", { days: r.day_count ?? 0 }) : e("overview.week.none"), a = [{
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
		}], o = t.map((t) => new Intl.DateTimeFormat(e.lang, {
			weekday: "short",
			day: "numeric",
			month: "numeric",
			timeZone: "UTC"
		}).format(/* @__PURE__ */ new Date(`${t.date}T12:00:00Z`))), s = new Map(t.map((t, n) => [n, new Intl.DateTimeFormat(e.lang, {
			weekday: "short",
			timeZone: "UTC"
		}).format(/* @__PURE__ */ new Date(`${t.date}T12:00:00Z`))]));
		return j`<section class="card wide" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:chart-bar"></ha-icon>${e("overview.week")}</div>
        ${n(e, "week")}
      </div>
      <p class="status">${i}</p>
      ${t.length ? j`<joe-chart
            .labels=${o}
            .ticks=${s}
            .series=${a}
            centerTicks
            unit="kWh"
            height="120"
            lang=${e.lang}
            label=${e("overview.week")}
          ></joe-chart>` : T}
      <div class="bottom">
        ${t.length ? j`<div class="legend">
              ${a.map((e) => j`<span><i style="background:${e.color}"></i>${e.label}</span>`)}
            </div>` : j`<span></span>`}
        <a class="btn btn-secondary stretch" href=${k(this.prefix, rd)} @click=${E(rd)}>${e("overview.week.more")}</a>
      </div>
    </section>`;
	}
};
b([A({ attribute: !1 })], od.prototype, "t", void 0), b([A({ attribute: !1 })], od.prototype, "hass", void 0), b([A({ attribute: !1 })], od.prototype, "state", void 0), b([A({ attribute: !1 })], od.prototype, "prefix", void 0), b([A({ attribute: !1 })], od.prototype, "route", void 0), b([A({ attribute: !1 })], od.prototype, "climateFound", void 0), b([A({ attribute: !1 })], od.prototype, "discovery", void 0), b([A({ attribute: !1 })], od.prototype, "checks", void 0), b([A({ attribute: !1 })], od.prototype, "devices", void 0), b([A({ attribute: !1 })], od.prototype, "info", void 0), b([C()], od.prototype, "week", void 0), b([C()], od.prototype, "sparring", void 0), _("joe-overview", od);
//#endregion
//#region src/pages/plan.ts
var sd = 36e5, cd = {
	tab: "devices",
	section: "grid",
	id: "solar"
}, ld = {
	tab: "devices",
	section: "grid",
	id: "tariff"
}, ud = class extends P {
	constructor(...e) {
		super(...e), this.prefix = M, this.devices = [], this.refreshing = !1;
	}
	static {
		this.styles = [x, D`
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
      .risk-say {
        margin: 0 0 4px;
        line-height: 1.5;
        color: var(--joe-ink-2);
        max-width: 70ch;
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
		if (!e) return T;
		let t = this.state?.plan;
		if (!t || t.kind === "unavailable" || !t.hours) return this.renderEmpty(e, t);
		let r = ae(e, t, this.hass?.config?.currency);
		return j`<div class="wrap">
      <div class="eyebrow"><ha-icon icon="mdi:weather-night"></ha-icon>${e("overview.night")} · ${a(e, t)}</div>
      ${N(e("plan.page.title"))} ${S}
      <div class="top" data-tipped>
        ${this.state?.mode === "simulation" ? j`<span class="pill-sim">${e("mode.simulation")}</span>` : j`<span class="chip ${this.state?.mode === "live" ? "ok" : "learned"}">${e(`mode.${this.state?.mode ?? "off"}`)}</span>`}
        <span class="chip ${t.fixed ? "ok" : ""}">
          ${t.fixed ? e("plan.fixed_at", { time: t.created.slice(11, 16) }) : e("plan.preview_at", { time: t.created.slice(11, 16) })}
        </span>
        <button type="button" class="mini-btn" ?disabled=${this.refreshing || t.fixed} @click=${this.refresh}>
          <ha-icon icon="mdi:refresh"></ha-icon>${e("plan.refresh")}
        </button>
        ${n(e, "plan_refresh")}
      </div>
      <section class="hero" data-tipped>
        <joe-pose name=${Ne(t)}></joe-pose>
        <div class="big">
          ${t.kind === "none" ? e("plan.big.none") : j`${s(e.lang, t.target ?? 0, 0)}<small>%</small>`}
        </div>
        <p class="say">${se(e, t)} ${n(e, "plan_target")}</p>
        ${r ? j`<p class="cost">${r}</p>` : T}
      </section>
      ${this.renderRisk(e, t)}
      <joe-steer-tonight .t=${e} .hass=${this.hass} .state=${this.state} .prefix=${this.prefix}></joe-steer-tonight>
      ${this.renderDaySurplus(e)} ${this.renderTonight(e, t)} ${this.renderEnergy(e, t, t.hours)}
      ${this.renderPrices(e, t, t.hours)} ${this.renderSoc(e, t, t.hours)}
      ${this.renderMath(e, t)}
    </div>`;
	}
	renderRisk(e, t) {
		return !t.risk || t.kind === "none" ? T : j`<section class="chart-card" data-tipped data-anchor="risk">
      <div class="chart-head">${e("plan.risk", { target: s(e.lang, t.target ?? 0, 0) })} ${n(e, "plan_risk")}</div>
      <p class="risk-say">${r(e, t, this.hass?.config?.currency)}</p>
      ${J(e, this.prefix, {
			label: e("rule.night_caution"),
			value: te(e, t),
			hint: Me(e, t),
			to: {
				tab: "settings",
				section: "rules",
				id: "night_caution"
			}
		})}
    </section>`;
	}
	renderTonight(e, t) {
		let r = t.batteries ?? [], i = t.actions ?? [], a = Object.values(t.cars ?? {}).filter((e) => !i.some((t) => t.car === e.car && t.plugged === "car"));
		return !r.length && !i.length && !a.length ? T : j`<section class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.tonight")} ${n(e, "plan_actions")}</div>
      <ul class="tonight">
        ${r.map((n) => this.batteryRow(e, t, n))} ${i.map((n) => this.actionRow(e, t, n))}
        ${a.map((t) => this.awayRow(e, t))}
      </ul>
    </section>`;
	}
	renderDaySurplus(e) {
		let t = lo(this.state), r = ji(this.state), i = r && r.mode === "sequence";
		if ((!t || t.state === "off") && !i) return T;
		let a = Object.values(t?.batteries ?? {}).filter((e) => e.cap_kw != null), o = a.length > 1 ? a.map((t) => e("plan.day_surplus.battery", {
			name: t.name,
			kw: s(e.lang, t.cap_kw ?? 0, 1)
		})).join(" · ") : "";
		return j`<section class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.day_surplus")} ${n(e, "plan_day_surplus")}</div>
      <ul class="tonight">
        ${t && t.state !== "off" ? this.tonightRow(e, {
			icon: "mdi:solar-power-variant-outline",
			name: e("rule.day_surplus"),
			text: mo(e, t),
			extra: [ho(e, t), o].filter(Boolean).join(" · "),
			to: {
				tab: "settings",
				section: "rules",
				id: "day_surplus"
			}
		}) : T}
        ${i ? this.tonightRow(e, {
			icon: "mdi:battery-sync-outline",
			name: e("team.title"),
			text: Ji(e, r),
			extra: r.parallel ? e("team.parallel") : "",
			to: {
				tab: "devices",
				section: "battery",
				id: "together"
			}
		}) : T}
      </ul>
    </section>`;
	}
	tonightRow(e, t) {
		return j`<li>
      <ha-icon icon=${t.icon}></ha-icon>
      <div class="what">
        <b>${t.name}</b>
        <span>${t.text}</span>
        ${t.extra ? j`<small>${t.extra}</small>` : T}
      </div>
      <a class="mini-btn go mirror-go" href=${k(this.prefix, t.to)} @click=${E(t.to)}>${e("mirror.change")}</a>
      ${t.more ? j`<div class="more">${t.more}</div>` : T}
    </li>`;
	}
	batteryRow(e, t, r) {
		let i = gt(this.devices, "battery", r.id), a = (t) => s(e.lang, t, 0), o = r.slots ?? [], c = v(o[0]?.start ?? t.charge_slots?.[0]?.start ?? t.charge_from), l, u = "", d;
		if (t.kind === "charge" && r.charge_kwh >= .05) {
			l = e(c ? "plan.tonight.charge" : "plan.tonight.charge_any", {
				time: c,
				from: a(r.soc_start),
				target: a(r.target)
			});
			let i = s(e.lang, r.charge_kwh, 1);
			u = o.length ? e("plan.tonight.charge.spans", {
				kwh: i,
				spans: fd(e, o)
			}) : e("plan.tonight.charge.energy", {
				kwh: i,
				kw: s(e.lang, r.power_kw, 1)
			});
			let f = pd(e, t, r, this.state?.config.batteries.find((e) => e.id === r.id));
			f && (d = j`<span class="pace">${f}</span> ${n(e, "plan_pace")}`);
		} else l = t.kind === "hold" ? e("plan.tonight.hold", { target: a(r.target) }) : e("plan.tonight.idle", { soc: a(r.soc) });
		return r.controllable || (u = [u, e("plan.line.watch_only")].filter(Boolean).join(" · ")), this.tonightRow(e, {
			icon: i?.icon ?? nt.battery,
			name: r.name,
			text: l,
			extra: u,
			more: d,
			to: i ? z(i) : {
				tab: "devices",
				section: "battery"
			}
		});
	}
	actionRow(e, t, n) {
		let r = this.hass?.config?.currency ?? "EUR", i = (t) => new Intl.NumberFormat(e.lang, {
			style: "currency",
			currency: r
		}).format(t), a = n.target == null ? "" : s(e.lang, n.target, 0), o = n.run ? n.kind === "target" ? e("plan.actions.target", {
			start: v(n.start),
			end: v(n.end),
			target: a
		}) : e("plan.actions.run", {
			start: v(n.start),
			end: v(n.end)
		}) : e.optional(`devices.action.why.${n.reasons[n.reasons.length - 1] ?? "manual_only"}`, {
			kwh: s(e.lang, t.meta?.tomorrow_kwh ?? 0, 0),
			temperature: s(e.lang, n.temperature ?? 0, 0)
		}) ?? "", c = n.run && n.energy_kwh ? e("plan.actions.energy", {
			kwh: s(e.lang, n.energy_kwh, 1),
			cost: i(n.cost ?? 0)
		}) : "", l = this.state?.config, u = l?.actions.find((e) => e.id === n.id), d = l && u ? ot(l, u) : void 0, f = d ? gt(this.devices, d.group, d.id) : void 0, p = d?.group ?? (n.need || n.plugged ? "car" : n.kind === "target" ? "hot_water" : "other"), g = n.plugged === "car" && l ? h(l, n.car) : void 0;
		return this.tonightRow(e, {
			icon: g ? nt.car : f?.icon ?? nt[p],
			name: g ? e("plan.car_at", {
				car: g.name,
				point: n.name
			}) : n.name,
			text: o,
			extra: c,
			to: g ? m(g.id) : f ? z(f) : d ? z(d) : {
				tab: "devices",
				section: p
			},
			more: n.need ? j`<joe-car-need .hass=${this.hass} .t=${e} .action=${n} .roundTrip=${g?.need.round_trip ?? !0}></joe-car-need>` : void 0
		});
	}
	awayRow(e, t) {
		let n = this.state ? h(this.state.config, t.car) : void 0, r = {
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
			icon: nt.car,
			name: t.name,
			text: e(i >= .2 ? "plan.car_away.missing" : "plan.car_away.enough"),
			to: m(t.car),
			more: j`<joe-car-need .hass=${this.hass} .t=${e} .action=${r} .roundTrip=${n?.need.round_trip ?? !0}></joe-car-need>`
		});
	}
	renderEmpty(e, t) {
		let n = t ? se(e, t) : e(this.state?.mode === "off" ? "plan.empty.off" : "plan.empty.waiting");
		return j`<div class="empty">
      <joe-pose name=${t ? Ne(t) : "plan"}></joe-pose>
      <div>
        ${N(e("plan.title"))} ${S}
        <p class="lead">${n}</p>
      </div>
    </div>`;
	}
	frame(e, t, n) {
		let r = (e) => `${String((Number(e.slice(0, 2)) + 1) % 24).padStart(2, "0")}:00`, i = n.map((e, t) => `${v(e.start)}–${v(n[t + 1]?.start) || r(v(e.start))}`), a = /* @__PURE__ */ new Map();
		n.forEach((t, n) => {
			let r = v(t.start);
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
					if (t >= r && t < r + sd) return e + (t - r) / sd;
				}
				return null;
			}
		};
	}
	renderEnergy(e, t, r) {
		let i = this.frame(e, t, r), a = [{
			label: e("plan.chart.solar"),
			kind: "area",
			values: r.map((e) => e.solar),
			color: "var(--joe-c-pv)",
			fill: "var(--joe-c-pv-fill)"
		}, {
			label: e("plan.chart.home"),
			kind: "line",
			values: r.map((e) => e.home),
			color: "var(--joe-c-load)"
		}];
		r.some((e) => e.charge > 0) && a.push({
			label: e("plan.chart.charge"),
			kind: "bar",
			values: r.map((e) => e.charge > 0 ? e.charge : null),
			color: "var(--joe-c-grid)"
		});
		let o = [], s = i.at(t.sun_takes_over);
		if (s != null) {
			let n = v(t.sun_takes_over);
			o.push({
				at: s,
				label: e("plan.chart.sun", { time: n }),
				short: `↑${n}`
			});
		}
		return j`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.chart.energy")} ${n(e, "chart_plan_energy")}</div>
      <joe-chart
        .labels=${i.labels}
        .ticks=${i.ticks}
        .series=${a}
        .bands=${i.bands}
        .markers=${o}
        unit="kWh"
        lang=${e.lang}
        label=${e("plan.chart.energy")}
      ></joe-chart>
      <div class="legend">
        ${a.map((e) => j`<span><i style="background:${e.color}"></i>${e.label}</span>`)}
      </div>
    </div>`;
	}
	renderPrices(e, t, r) {
		if (!r.some((e) => e.price != null)) return T;
		let i = this.frame(e, t, r), a = [{
			label: e("plan.chart.price"),
			kind: "bar",
			values: r.map((e) => e.price == null ? null : Math.round(e.price * 1e3) / 10),
			color: "var(--joe-c-ist)",
			digits: 1
		}], o = (t.charge_slots ?? []).flatMap((t) => {
			let n = i.at(t.start);
			return n == null ? [] : [{
				at: n,
				label: e("plan.chart.charge_at", { time: v(t.start) }),
				short: v(t.start)
			}];
		});
		return j`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.chart.prices")} ${n(e, "chart_plan_prices")}</div>
      <joe-chart
        .labels=${i.labels}
        .ticks=${i.ticks}
        .series=${a}
        .bands=${i.bands}
        .markers=${o}
        unit="ct"
        lang=${e.lang}
        label=${e("plan.chart.prices")}
      ></joe-chart>
      ${t.charge_slots?.length ? j`<p class="slots">${e("plan.slots", { slots: je(t) })}</p>` : T}
    </div>`;
	}
	renderSoc(e, t, r) {
		let i = this.frame(e, t, r), a = t.rules?.reserve ?? 10, o = [
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
				label: e("plan.chart.reserve", { value: s(e.lang, a, 0) }),
				kind: "line",
				values: r.map(() => a),
				color: "var(--joe-crit)",
				dashed: !0,
				digits: 0
			}
		], c = [], l = i.at(t.window?.end);
		l != null && t.kind !== "none" && c.push({
			at: l,
			label: e("plan.chart.target", { value: s(e.lang, t.target ?? 0, 0) })
		});
		let u = i.at(t.full_at);
		return u != null && c.push({
			at: u,
			label: e("plan.chart.full", { time: v(t.full_at) }),
			short: `${v(t.full_at)}`
		}), j`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.chart.soc")} ${n(e, "chart_plan_soc")}</div>
      <joe-chart
        .labels=${i.labels}
        .ticks=${i.ticks}
        .series=${o}
        .bands=${i.bands}
        .markers=${c}
        max="100"
        height="190"
        unit="%"
        lang=${e.lang}
        label=${e("plan.chart.soc")}
      ></joe-chart>
      <div class="legend">
        ${o.map((e) => j`<span><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color}"></i>${e.label}</span>`)}
      </div>
    </div>`;
	}
	renderMath(e, t) {
		let r = (t, n = 1) => t == null ? "–" : `${s(e.lang, t, n)} kWh`, i = (t) => t == null ? "–" : `${s(e.lang, t * 100, 1)} ct`, a = t.window?.start.slice(0, 10) ?? "", o = t.meta?.solar.sources[a] ?? "none", c = t.meta?.tomorrow, l = c?.solar_factor ?? t.meta?.solar_factor ?? 1, u = t.meta?.consumption, d = this.state?.config.persons ?? [], f = [
			{
				label: e("plan.math.battery_now"),
				value: `${s(e.lang, t.soc_now ?? 0, 0)} %`,
				hint: e("plan.math.battery_now.sub", {
					stored: s(e.lang, (t.soc_now ?? 0) / 100 * (t.capacity_kwh ?? 0), 1),
					capacity: s(e.lang, t.capacity_kwh ?? 0, 1)
				}),
				to: {
					tab: "devices",
					section: "battery"
				}
			},
			{
				label: e("plan.math.battery_start"),
				value: `${s(e.lang, t.soc_start ?? 0, 0)} %`
			},
			{
				label: e("plan.math.solar"),
				value: r(t.solar_kwh),
				hint: `${e(`plan.math.solar.${o}`)}${l === 1 ? "" : ` · ${e(c?.solar_source === "combined" ? "plan.math.solar.combined" : c?.solar_source === "weather" && c.weather ? "plan.math.solar.weather" : "plan.math.solar.factor", {
					value: s(e.lang, l, 2),
					weather: c?.weather ? e(`learn.weather.${c.weather}`) : ""
				})}`}`,
				to: cd
			},
			{
				label: e("plan.math.home"),
				value: r(t.home_kwh),
				hint: u?.source === "history" ? `${e("plan.math.home.history", {
					days: u.days,
					kind: e(t.meta?.workday === !1 ? "plan.math.day_off" : "plan.math.workday")
				})}${u.years ? `, ${e("plan.math.home.years", { days: u.years })}` : ""}` : e("plan.math.home.default")
			}
		];
		c && (c.temp != null || c.weather) && f.push({
			label: e("plan.math.weather"),
			value: [c.temp == null ? "" : `${s(e.lang, c.temp, 0)} °C`, c.weather ? e(`learn.weather.${c.weather}`) : ""].filter(Boolean).join(" · "),
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
				expected: s(e.lang, c.expected_kwh, 1),
				usual: s(e.lang, c.profile_kwh, 1)
			}),
			to: {
				tab: "household",
				section: "days"
			}
		}), f.push({
			label: e("plan.math.target"),
			value: `${s(e.lang, t.target ?? 0, 0)} %`,
			hint: t.rules?.buffer ? e("plan.math.target.sub", {
				optimum: s(e.lang, t.optimum ?? 0, 0),
				buffer: s(e.lang, t.rules.buffer * 100, 0)
			}) : e("plan.math.target.sub_none", { optimum: s(e.lang, t.optimum ?? 0, 0) }),
			to: {
				tab: "settings",
				section: "rules",
				id: t.rules?.buffer ? "buffer_factor" : "night_caution"
			}
		}, {
			label: e("plan.math.prices"),
			value: e("plan.math.prices.value", {
				night: i(t.prices?.night),
				day: i(t.prices?.day),
				feed: i(t.prices?.feed_in)
			}),
			hint: t.prices?.assumed ? e("plan.math.prices.assumed") : void 0,
			to: ld
		}, {
			label: e("plan.math.rules"),
			value: e("plan.math.rules.value", {
				reserve: s(e.lang, t.rules?.reserve ?? 0, 0),
				max: s(e.lang, t.rules?.max_target ?? 100, 0),
				mode: e.optional(`rule.discharge.${t.rules?.discharge_mode}`) ?? ""
			}),
			to: {
				tab: "settings",
				section: "rules"
			}
		});
		let p = [...new Set(t.notes ?? [])].filter((t) => e.optional(`plan.note.${t}`));
		return j`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.math")} ${n(e, "plan_math")}</div>
      <div class="mirrors">
        ${f.map((t) => t.to ? J(e, this.prefix, {
			label: t.label,
			value: t.value,
			hint: t.hint,
			to: t.to
		}) : j`<div class="mirror">
                <div class="mirror-text">
                  <span class="mirror-label">${t.label}</span><span class="mirror-sep" aria-hidden="true">·</span
                  ><span class="mirror-value">${t.value}</span>
                  ${t.hint ? j`<small class="mirror-hint">${t.hint}</small>` : T}
                </div>
              </div>`)}
      </div>
      ${p.map((n) => this.renderNote(e, t, n))}
    </div>`;
	}
	renderNote(e, t, n) {
		let r = this.noteJumps(e, t, n);
		return j`<div class="note">
      <ha-icon icon="mdi:information-outline"></ha-icon>
      <div>
        <span>${e.optional(`plan.note.${n}`)}</span>
        ${r.length ? j`<div class="note-actions">
              ${r.map((e) => j`<a class="mini-btn go mirror-go" href=${k(this.prefix, e.to)} @click=${E(e.to)}>${e.label}</a>`)}
            </div>` : T}
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
				to: cd,
				label: r
			}];
			case "prices_partly": return [{
				to: ld,
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
			let t = gt(this.devices, "battery", e.id);
			return t ? z(t) : {
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
b([A({ attribute: !1 })], ud.prototype, "hass", void 0), b([A({ attribute: !1 })], ud.prototype, "t", void 0), b([A({ attribute: !1 })], ud.prototype, "state", void 0), b([A({ attribute: !1 })], ud.prototype, "route", void 0), b([A({ attribute: !1 })], ud.prototype, "prefix", void 0), b([A({ attribute: !1 })], ud.prototype, "devices", void 0), b([C()], ud.prototype, "refreshing", void 0);
function dd(e, t) {
	return t < 1 ? `${s(e.lang, Math.round(t * 20) * 50, 0)} W` : `${s(e.lang, t, 1)} kW`;
}
function fd(e, t) {
	return t.map((t) => e("plan.tonight.span", {
		start: v(t.start),
		end: v(t.end),
		power: dd(e, t.power_kw)
	})).join(", ");
}
function pd(e, t, n, r) {
	let i = [];
	r?.night_cap === "ignored" ? i.push(e("plan.pace.cap_ignored")) : n.how && n.how !== "none" && (i.push(e(`plan.pace.${n.how}`, { limit: s(e.lang, t.rules?.grid_limit_kw ?? 0, 1) })), n.how === "fixed_power" && r?.controls.charge_limit && !r.limit_ref_w && i.push(e("plan.pace.need_ref"))), n.slow_kw && i.push(e("plan.pace.slow", { power: dd(e, n.slow_kw) }));
	let a = (t.batteries ?? []).filter((e) => e.grid).length;
	return n.rank === 0 && a > 1 && i.push(e("plan.pace.first")), i.join(" ");
}
_("joe-plan-page", ud);
//#endregion
//#region src/pages/settings/base.ts
var md = class extends P {
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
		this.pending === e && _e(this.renderRoot, e) && (this.pending = void 0);
	}
};
b([A({ attribute: !1 })], md.prototype, "hass", void 0), b([A({ attribute: !1 })], md.prototype, "t", void 0), b([A({ attribute: !1 })], md.prototype, "state", void 0), b([A({ attribute: !1 })], md.prototype, "route", void 0), b([A({ attribute: !1 })], md.prototype, "prefix", void 0), b([A({ attribute: !1 })], md.prototype, "info", void 0), b([A({ attribute: !1 })], md.prototype, "discovery", void 0), b([A({ attribute: !1 })], md.prototype, "checks", void 0), b([A({ attribute: !1 })], md.prototype, "anchor", void 0);
//#endregion
//#region src/pages/settings/styles.ts
var hd = D`
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
`, gd = "/config/energy", _d = [
	"control",
	"button",
	"value",
	"calendar",
	"other"
], vd = {
	select: "control",
	switch: "control",
	button: "button",
	sensor: "value",
	binary_sensor: "value",
	calendar: "calendar"
}, yd = [
	"control",
	"value",
	"other"
], bd = [{
	id: "night",
	type: "energy-joe-night-card",
	icon: "mdi:weather-night"
}, {
	id: "car",
	type: "energy-joe-car-card",
	icon: "mdi:car-electric-outline"
}];
function xd(e) {
	return j`${e.split(/(?<=[._])/).map((e, t) => j`${t ? j`<wbr />` : T}${e}`)}`;
}
var Sd = class extends md {
	static {
		this.styles = [
			x,
			hd,
			D`
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
		return !e || !this.state ? T : j`<div class="list">
      ${this.renderVersions(e)} ${this.renderEntities(e, t)} ${this.renderCards(e)}
    </div>`;
	}
	renderVersions(e) {
		let t = this.info?.energy, n = !!(t?.configured && t.sources);
		return j`<section class="group" data-anchor="versions">
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
          href=${gd}
          @click=${(e) => {
			e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0 || (e.preventDefault(), be(gd));
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
		let r = Object.values(t?.entities ?? {}).filter((e) => e.platform === "energy_joe"), i = /* @__PURE__ */ new Map();
		for (let e of r) {
			let n = vd[e.entity_id.split(".", 1)[0]] ?? "other", r = t ? c(t, e.entity_id) : e.entity_id, a = r.replace(/^energy joe\s+/i, "") || r;
			i.set(n, [...i.get(n) ?? [], {
				id: e.entity_id,
				name: a
			}]);
		}
		return j`<section class="group" data-anchor="entities">
      <div class="group-title" data-tipped><h2>${e("settings.about.entities")}</h2>${n(e, "about_entities")}</div>
      <p class="intro">${e("settings.about.entities.intro")}</p>
      ${r.length ? _d.filter((e) => i.has(e)).map((n) => j`<div class="group-label">${e(`settings.about.group.${n}`)}</div>
              ${i.get(n).sort((t, n) => t.name.localeCompare(n.name, e.lang)).map((r) => j`<div class="ent">
                    <div class="ent-text"><b>${r.name}</b><code>${xd(r.id)}</code></div>
                    ${t && yd.includes(n) ? j`<span class="ent-state">${d(t, r.id, e.lang)}</span>` : T}
                    ${vi(e, {
			entityId: r.id,
			name: r.name
		})}
                  </div>`)}`) : j`<p class="intro">${e("settings.about.entities.none")}</p>`}
    </section>`;
	}
	renderCards(e) {
		return j`<section class="group" data-anchor="cards">
      <h2>${e("settings.about.cards")}</h2>
      <p class="intro">${e("settings.about.cards.intro")}</p>
      ${bd.map((t) => j`<div class="row">
          <div>
            <b class="card-name"><ha-icon icon=${t.icon}></ha-icon>${e(`settings.about.cards.${t.id}`)}</b>
            <small>${e(`settings.about.cards.${t.id}.hint`)}</small>
            <code class="card-type">type: custom:${t.type}</code>
          </div>
        </div>`)}
    </section>`;
	}
};
_("joe-settings-about", Sd);
//#endregion
//#region src/pages/settings/maintenance.ts
var Cd = "/config/integrations/integration/energy_joe", wd = class extends md {
	constructor(...e) {
		super(...e), this.confirmReset = !1, this.resetting = !1;
	}
	static {
		this.styles = [
			x,
			hd,
			D`
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
      .group.danger {
        margin-top: 24px;
      }
      .group.danger h2 {
        color: var(--error-color);
      }
    `
		];
	}
	render() {
		let { t: e, state: t } = this;
		return !e || !t ? T : j`<div class="list">
      ${this.renderObserve(e, t)} ${this.renderBackup(e)} ${this.renderSetup(e)} ${this.renderReset(e)}
    </div>`;
	}
	renderObserve(e, t) {
		let r = t.observe, i = !!r?.active, a = r?.backfill.state === "running", o = (t) => new Intl.DateTimeFormat(e.lang, {
			day: "numeric",
			month: "long",
			timeZone: "UTC"
		}).format(/* @__PURE__ */ new Date(`${t.slice(0, 10)}T12:00:00Z`)), s = i ? e("settings.observe.since", {
			day: o(r.since),
			time: r.since.slice(11, 16)
		}) : t.mode === "off" ? e("settings.observe.off") : e("settings.observe.waiting"), c = [];
		r?.first_day ? c.push(e("settings.observe.days", {
			days: r.day_count ?? 0,
			first: o(r.first_day)
		})) : c.push(e("settings.observe.nothing"));
		let l = r?.backfill;
		return l?.state === "running" ? c.push(e("history.reading")) : l?.state === "unavailable" ? c.push(e("settings.observe.no_recorder")) : l?.state === "failed" && c.push(e("settings.observe.failed")), j`<section class="group" data-anchor="observe">
      <h2>${e("settings.observe")}</h2>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${e("settings.observe.recording")}</b>${n(e, "observe")}</div>
          <small>${s}</small>
        </div>
        <span class="chip ${i ? "ok" : ""}">
          ${e(i ? "status.running" : t.mode === "off" ? "status.paused" : "status.waiting")}
        </span>
      </div>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${e("settings.observe.history")}</b>${n(e, "rebuild")}</div>
          <small>${c.join(" · ")}</small>
        </div>
        <button type="button" class="btn btn-secondary" ?disabled=${!i || a} @click=${this.rebuild}>
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
		return j`<section class="group" data-anchor="backup">
      <h2>${e("settings.backup")}</h2>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${e("settings.backup.export")}</b>${n(e, "backup_export")}</div>
          <small>${e("settings.backup.export.hint")}</small>
        </div>
        <button type="button" class="btn btn-secondary" @click=${() => void this.exportSettings()}>${e("settings.backup.download")}</button>
      </div>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${e("settings.backup.import")}</b>${n(e, "backup_import")}</div>
          <small>${e("settings.backup.import.hint")}</small>
        </div>
        <label class="btn btn-secondary file">
          ${e("settings.backup.choose")}
          <input type="file" accept="application/json,.json" @change=${(e) => void this.readBackup(e)} />
        </label>
      </div>
      ${this.backup ? j`<div class="note warn" data-tipped>
            <ha-icon icon="mdi:alert-outline"></ha-icon>
            <span>
              ${e("settings.backup.confirm", {
			file: this.backup.name,
			when: this.backup.when
		})} ${n(e, "backup_import")}
              <span class="confirm">
                <button type="button" class="btn btn-danger" @click=${() => void this.importSettings()}>${e("settings.backup.replace")}</button>
                <button type="button" class="btn btn-ghost" @click=${() => this.backup = void 0}>${e("common.cancel")}</button>
              </span>
            </span>
          </div>` : T}
      ${this.backupNote ? j`<div class="note ${this.backupNote.ok ? "ok" : "warn"}">
            <ha-icon icon=${this.backupNote.ok ? "mdi:check" : "mdi:alert-outline"}></ha-icon><span>${this.backupNote.text}</span>
          </div>` : T}
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
		return j`<section class="group" data-anchor="setup">
      <h2>${e("settings.setup")}</h2>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${e("settings.setup.again")}</b>${n(e, "restart")}</div>
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
          <div class="name"><b>${e("settings.maintenance.diagnostics")}</b>${n(e, "diagnostics")}</div>
          <small>${e("settings.maintenance.diagnostics.hint")}</small>
        </div>
        <a
          class="mini-btn"
          data-notip
          href=${Cd}
          @click=${(e) => {
			e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0 || (e.preventDefault(), be(Cd));
		}}
          ><ha-icon icon="mdi:open-in-new"></ha-icon>${e("settings.maintenance.diagnostics.open")}</a
        >
      </div>
    </section>`;
	}
	renderReset(e) {
		return j`<section class="group danger" data-anchor="reset">
      <h2>${e("settings.reset")}</h2>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${e("settings.reset.all")}</b>${n(e, "reset_all")}</div>
          <small>${e("settings.reset.hint")}</small>
        </div>
        <button type="button" class="btn btn-danger" ?disabled=${this.resetting || this.confirmReset} @click=${() => this.confirmReset = !0}>
          ${e("settings.reset.button")}
        </button>
      </div>
      ${this.confirmReset ? j`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon>
            <span>
              ${this.resetting ? e("settings.reset.working") : e("settings.reset.confirm")}
              <span class="confirm">
                <button type="button" class="btn btn-danger" ?disabled=${this.resetting} @click=${() => void this.resetAll()}>
                  ${e("settings.reset.go")}
                </button>
                <button type="button" class="btn btn-ghost" ?disabled=${this.resetting} @click=${() => this.confirmReset = !1}>
                  ${e("common.cancel")}
                </button>
              </span>
            </span>
          </div>` : T}
      ${this.resetNote ? j`<div class="note ${this.resetNote.ok ? "ok" : "warn"}">
            <ha-icon icon=${this.resetNote.ok ? "mdi:check" : "mdi:alert-outline"}></ha-icon><span>${this.resetNote.text}</span>
          </div>` : T}
    </section>`;
	}
	async resetAll() {
		let e = this.t;
		this.resetting = !0;
		try {
			let t = await this.hass.callWS({ type: "energy_joe/reset_all" }), n = Object.keys(t?.left ?? {});
			this.confirmReset = !1, this.resetNote = n.length ? {
				ok: !1,
				text: e("settings.reset.left", { entities: n.join(", ") })
			} : {
				ok: !0,
				text: e("settings.reset.done")
			}, window.setTimeout(() => window.location.reload(), n.length ? 8e3 : 2500);
		} catch (t) {
			this.confirmReset = !1, this.resetNote = {
				ok: !1,
				text: e("settings.backup.failed", { error: String(t?.message ?? t) })
			};
		} finally {
			this.resetting = !1;
		}
	}
};
b([C()], wd.prototype, "backup", void 0), b([C()], wd.prototype, "backupNote", void 0), b([C()], wd.prototype, "confirmReset", void 0), b([C()], wd.prototype, "resetting", void 0), b([C()], wd.prototype, "resetNote", void 0), _("joe-settings-maintenance", wd);
//#endregion
//#region src/pages/settings/notify.ts
var Td = class extends md {
	constructor(...e) {
		super(...e), this.loading = !1;
	}
	static {
		this.styles = [x, hd];
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
		if (!e || !t) return T;
		let r = t.config, i = r.notify, a = this.notifyTargets ?? Object.keys(this.hass?.services?.notify ?? {}).filter((e) => ![
			"persistent_notification",
			"send_message",
			"notify"
		].includes(e)).sort().map((e) => ({
			service: e,
			name: e.replace(/_/g, " ")
		})), o = i.service?.replace(/^notify\./, ""), s = !!o && this.notifyTargets !== void 0 && !a.some((e) => e.service === o);
		return j`<div class="list">
      <section class="group" data-anchor="notify">
        <h2>${e("settings.notify")}</h2>
        <p class="intro">${e("settings.notify.intro")}</p>
        <div class="row" data-tipped data-anchor="service">
          <div>
            <div class="name"><label for="notify-service"><b>${e("settings.notify.service")}</b></label>${n(e, "notify_service")}</div>
            <small>${e("settings.notify.service.hint")}</small>
          </div>
          <select
            id="notify-service"
            class="input"
            @change=${(e) => {
			let t = e.target.value;
			L(this, { notify: { service: t ? `notify.${t}` : null } });
		}}
          >
            <option value="" ?selected=${!i.service}>${e("settings.notify.none")}</option>
            ${a.map((e) => j`<option value=${e.service} ?selected=${o === e.service}>${e.name}</option>`)}
            ${s ? j`<option value=${o} selected>${e("settings.notify.gone", { name: o ?? "" })}</option>` : T}
          </select>
        </div>
        ${this.toggle(e, r, "ask")} ${this.toggle(e, r, "problems")} ${this.toggle(e, r, "stuck")}
        ${this.toggle(e, r, "morning")}
        ${r.cars?.length ? this.toggle(e, r, "cars") : T}
        ${this.askTime(e, r)}
      </section>
    </div>`;
	}
	toggle(e, t, r) {
		let i = t.notify;
		return j`<div class="row" data-tipped>
      <div>
        <div class="name"><b id="notify-${r}">${e(`settings.notify.${r}`)}</b>${n(e, `notify_${r}`)}</div>
        <small>${e(`settings.notify.${r}.hint`)}</small>
      </div>
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${String(i[r] ?? !0)}
        aria-labelledby="notify-${r}"
        ?disabled=${!i.service}
        @click=${() => L(this, { notify: { [r]: !(i[r] ?? !0) } })}
      ></button>
    </div>`;
	}
	askTime(e, t) {
		return j`<div class="row" data-tipped data-anchor="ask_time">
      <div>
        <div class="name"><label for="ask-time"><b>${e("settings.ask_time")}</b></label>${n(e, "ask_time")}</div>
        <small>${e("settings.ask_time.hint")}</small>
      </div>
      <input
        id="ask-time"
        class="input time"
        type="time"
        .value=${t.rules.ask_time}
        @change=${(e) => {
			let t = e.target.value;
			/^\d{2}:\d{2}$/.test(t) && L(this, { rules: { ask_time: t } });
		}}
      />
    </div>`;
	}
};
b([C()], Td.prototype, "notifyTargets", void 0), _("joe-settings-notify", Td);
//#endregion
//#region src/pages/settings/sparring.ts
var Ed = "/config/integrations/dashboard", Dd = class extends P {
	constructor(...e) {
		super(...e), this.prefix = M, this.running = !1, this.run = async () => {
			let e = this.t;
			if (e && this.hass && !this.running) {
				this.running = !0, this.notice = void 0;
				try {
					let t = await this.hass.callWS({ type: "energy_joe/sparring/run" }), n = t ? qo(t) : 0;
					this.notice = t?.ok ? n ? {
						ok: !0,
						text: e("sparring.run.done", { points: Yo(e, n) })
					} : {
						ok: !0,
						text: e("sparring.run.clean")
					} : {
						ok: !1,
						text: e("sparring.run.failed", { error: t?.error || e("sparring.report.error.unknown") })
					};
				} catch (t) {
					let n = t;
					this.notice = {
						ok: !1,
						text: n?.code === "not_ready" ? e("sparring.run.not_ready") : e("sparring.run.failed", { error: n?.message ?? String(t) })
					};
				} finally {
					this.running = !1, this.load();
				}
			}
		};
	}
	static {
		this.styles = [
			x,
			hd,
			ls,
			D`
      :host {
        min-width: 0;
      }
      .group > .note {
        margin-bottom: 12px;
      }
      details.explain {
        margin: 0 0 14px;
        border-radius: 12px;
        background: var(--joe-surface-2);
      }
      details.explain > summary {
        min-height: 44px;
        display: flex;
        align-items: center;
        padding: 0 12px;
        font-weight: 600;
        cursor: pointer;
      }
      .explain-body {
        padding: 0 14px 14px;
      }
      .explain-body > p {
        margin: 0 0 12px;
        color: var(--joe-ink-2);
        font-size: 13.5px;
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
      .last {
        display: flex;
        align-items: center;
        gap: 6px 8px;
        flex-wrap: wrap;
        margin-top: 4px;
      }
    `
		];
	}
	willUpdate(e) {
		if (!e.has("state") && !e.has("hass")) return;
		let t = this.state?.config.sparring, n = `${t?.enabled ?? !1}|${t?.entity ?? ""}`;
		this.hass && n !== this.loadedFor && (this.loadedFor = n, this.load());
	}
	async load() {
		let e = await Ko(this.hass);
		e && (this.data = e);
	}
	models() {
		return Object.keys(this.hass?.states ?? {}).filter((e) => e.startsWith("ai_task."));
	}
	render() {
		let { t: e, state: t } = this;
		if (!e || !t) return T;
		let r = t.config.sparring ?? {
			enabled: !1,
			entity: null
		}, i = this.models();
		return j`<section class="group">
      <div class="group-title"><h2>${e("sparring.title")}</h2>${n(e, "sparring")}</div>
      <p class="intro">${e("sparring.intro")}</p>
      <div class="note"><ha-icon icon="mdi:shield-check-outline"></ha-icon><span>${e("sparring.promise")}</span></div>
      ${!i.length && !r.entity ? this.renderSetup(e) : j`${this.renderModel(e, r.entity)} ${this.renderSwitch(e, r.enabled, r.entity)}
          ${this.renderRun(e, r.enabled, r.entity)}`}
      ${this.renderBrief(e)}
    </section>`;
	}
	renderSetup(e) {
		return j`<div class="note" data-tipped>
      <ha-icon icon="mdi:robot-outline"></ha-icon>
      <div>
        <b>${e("sparring.setup.title")}</b>
        <div>${e("sparring.setup.text")}</div>
        <div class="note-actions">
          <button type="button" class="mini-btn" @click=${() => be(Ed)}>
            <ha-icon icon="mdi:open-in-new"></ha-icon>${e("sparring.setup.open")}
          </button>
          ${n(e, "sparring_setup")}
        </div>
      </div>
    </div>`;
	}
	renderModel(e, t) {
		let r = !!t && !this.hass?.states[t], i = t ? r ? e("sparring.entity.gone", { entity: t }) : c(this.hass, t) : e("sparring.entity.none");
		return j`<div class="row" data-tipped>
      <div>
        <div class="name"><b>${e("sparring.entity")}</b>${n(e, "sparring_entity")}</div>
        <small>${i}</small>
      </div>
      <button type="button" class="btn btn-secondary" @click=${() => this.pick(t)}>
        ${e(t ? "sparring.change" : "sparring.choose")}
      </button>
    </div>`;
	}
	renderSwitch(e, t, r) {
		let i = r ? t ? this.data?.next ? e("sparring.enabled.next", { when: Xo(e, this.data.next) }) : e("sparring.enabled.on") : e("sparring.enabled.off") : e("sparring.enabled.no_entity");
		return j`<div class="row" data-tipped>
      <div>
        <div class="name"><b id="sparring-enabled">${e("sparring.enabled")}</b>${n(e, "sparring_enabled")}</div>
        <small>${i}</small>
      </div>
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${String(t)}
        aria-labelledby="sparring-enabled"
        ?disabled=${!r && !t}
        @click=${() => L(this, { sparring: { enabled: !t } })}
      ></button>
    </div>`;
	}
	renderRun(e, t, r) {
		let i = this.running || !!this.data?.running, a = this.data?.reports[0];
		return j`<div class="row" data-tipped>
      <div>
        <div class="name"><b>${e("sparring.run.label")}</b>${n(e, "sparring_run")}</div>
        <small>${e(i ? "sparring.run.running" : t && r ? "sparring.run.hint" : "sparring.run.off")}</small>
        ${a ? this.renderLast(e, a) : T}
      </div>
      <button type="button" class="btn btn-secondary" ?disabled=${i || !t || !r} @click=${this.run}>
        ${e("sparring.run")}
      </button>
    </div>
    ${this.notice ? j`<div class="note ${this.notice.ok ? "" : "warn"} row-note" role="status">
          <ha-icon icon=${this.notice.ok ? "mdi:check" : "mdi:alert-outline"}></ha-icon><span>${this.notice.text}</span>
        </div>` : T}`;
	}
	renderLast(e, t) {
		return j`<div class="last">
      <small>${e("sparring.last", { when: Xo(e, t.at) })}</small>
      ${cs(e, t)} ${ke(this.prefix, Wo, e("sparring.open_reports"), "go-link")}
    </div>`;
	}
	renderBrief(e) {
		let t = this.data?.brief, r = !this.data?.reports.length;
		return j`<div class="row" data-tipped>
        <div>
          <div class="name"><b>${e("sparring.brief")}</b>${n(e, "sparring_brief")}</div>
          <small>${e("sparring.brief.hint")}</small>
        </div>
      </div>
      <details class="explain" data-notip>
        <summary>${e("sparring.brief.show")}</summary>
        <div class="explain-body">
          ${t ? j`${r ? j`<p>${e("sparring.brief.preview")}</p>` : T}${ss(e, t)}` : j`<p>${e("sparring.brief.none")}</p>`}
        </div>
      </details>`;
	}
	async pick(e) {
		let t = this.t;
		if (!t) return;
		let n = this.models(), r = (await R(this, {
			heading: t("sparring.pick.title"),
			tip: "pick_ai_task",
			filter: "ai_task",
			selected: e ? [e] : n.length === 1 ? n : []
		}))?.selected[0];
		r && r !== e && L(this, { sparring: { entity: r } });
	}
};
b([A({ attribute: !1 })], Dd.prototype, "hass", void 0), b([A({ attribute: !1 })], Dd.prototype, "t", void 0), b([A({ attribute: !1 })], Dd.prototype, "state", void 0), b([A({ attribute: !1 })], Dd.prototype, "prefix", void 0), b([C()], Dd.prototype, "data", void 0), b([C()], Dd.prototype, "running", void 0), b([C()], Dd.prototype, "notice", void 0), _("joe-settings-sparring", Dd);
//#endregion
//#region src/pages/settings/operation.ts
var Od = [
	"simulation",
	"advisory",
	"live",
	"off"
], kd = class extends md {
	static {
		this.styles = [
			x,
			hd,
			D`
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
		return !e || !t ? T : j`<div class="list">
      <section class="group" data-anchor="mode">
        <h2>${e("settings.operation")}</h2>
        <div class="row" data-tipped>
          <div>
            <div class="name"><b>${e("settings.mode")}</b>${n(e, "mode")}</div>
            <small>${e("settings.mode.now", { mode: e(`mode.${t.mode}`) })}</small>
          </div>
          <div class="control">
            <button type="button" class="btn btn-secondary" @click=${this.openDialog}>${e("settings.mode.open")}</button>
            ${n(e, "mode_open")}
          </div>
        </div>
        <ul class="modes">
          ${Od.map((n) => j`<li class=${n === t.mode ? "on" : ""}>
              <span class="mode-name"
                >${e(`mode.${n}`)}
                ${n === t.mode ? j`<span class="chip ok">${e("mode.current")}</span>` : T}</span
              >
              <p>${e(`mode.${n}.desc`)}</p>
            </li>`)}
        </ul>
        ${this.gridFriendlyRows(e, t)}
      </section>
      <joe-settings-sparring
        data-anchor="sparring"
        .t=${e}
        .hass=${this.hass}
        .state=${t}
        .prefix=${this.prefix}
      ></joe-settings-sparring>
    </div>`;
	}
	openDialog() {
		this.dispatchEvent(new CustomEvent("joe-mode-dialog", {
			bubbles: !0,
			composed: !0
		}));
	}
	gridFriendlyRows(e, t) {
		let r = t.config, i = r.rules;
		return j`<div class="row" data-tipped data-anchor="grid_friendly">
        <div>
          <div class="name"><b id="grid-friendly">${e("rule.grid_friendly")}</b>${n(e, "r_grid_friendly")}</div>
          <small>${e("rule.grid_friendly.hint")}</small>
        </div>
        <div class="control">
          ${O(e, F(r, "rules.grid_friendly"))}
          <button
            type="button"
            class="switch"
            role="switch"
            aria-checked=${String(i.grid_friendly)}
            aria-labelledby="grid-friendly"
            @click=${() => L(this, { rules: { grid_friendly: !i.grid_friendly } })}
          ></button>
        </div>
      </div>
      ${i.grid_friendly ? j`<div class="row" data-tipped>
            <div>
              <div class="name"><b>${e("rule.grid_first")}</b>${n(e, "r_grid_first")}</div>
              <small>${e(i.grid_first ? "rule.grid_first.grid.hint" : "rule.grid_first.saving.hint")}</small>
            </div>
            <div class="seg" role="group" aria-label=${e("rule.grid_first")}>
              ${[!1, !0].map((t) => j`<button
                    type="button"
                    aria-pressed=${String(i.grid_first === t)}
                    @click=${() => L(this, { rules: { grid_first: t } })}
                  >
                    ${e(t ? "rule.grid_first.grid" : "rule.grid_first.saving")}
                  </button>`)}
            </div>
          </div>
          <div class="buffer-mirror" data-tipped>
            ${J(e, this.prefix, {
			label: e("rule.morning_buffer"),
			value: this.bufferValue(e, t),
			source: F(r, "rules.morning_buffer_soc"),
			to: {
				tab: "settings",
				section: "rules",
				id: "morning_buffer"
			}
		})}
            ${n(e, "r_morning_buffer")}
          </div>` : T}`;
	}
	bufferValue(e, t) {
		let n = Ka(t.plan)?.suggested;
		return t.config.rules.morning_buffer_soc == null && n != null ? e("rule.morning_buffer.auto_n", { soc: String(n) }) : Wa(e, t.config, "morning_buffer");
	}
};
_("joe-settings-operation", kd);
//#endregion
//#region src/pages/settings/rules.ts
var Ad = [
	"battery",
	"grid",
	"plan"
], jd = class extends md {
	static {
		this.styles = [
			x,
			hd,
			co
		];
	}
	render() {
		let { t: e, state: t } = this;
		if (!e || !t) return T;
		let n = t.config;
		return j`<div class="list">
      <p class="intro">${e("settings.rules.intro")}</p>
      ${Ad.map((r) => j`<section class="group" data-anchor=${`group-${r}`}>
          <h2>${e(`settings.rules.group.${r}`)}</h2>
          ${La[r].map((r) => Ga(e, this, n, this.info, r, t.control, t.plan))}
        </section>`)}
    </div>`;
	}
};
_("joe-settings-rules", jd);
//#endregion
//#region src/pages/settings/signpost.ts
var Md = [
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
		id: "sparring_reports",
		to: {
			tab: "review",
			section: "learned",
			id: "sparring"
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
		id: "sparring",
		to: {
			tab: "settings",
			section: "operation",
			id: "sparring"
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
		id: "rule_car_house_only",
		to: {
			tab: "settings",
			section: "rules",
			id: "car_house_only"
		},
		title: "rule.car_house_only"
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
		id: "rule_night_caution",
		to: {
			tab: "settings",
			section: "rules",
			id: "night_caution"
		},
		title: "rule.night_caution"
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
		id: "reset_all",
		to: {
			tab: "settings",
			section: "maintenance",
			id: "reset"
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
], Nd = 8;
function Pd(e) {
	return e.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ß/g, "ss").replace(/([aou])e/g, "$1").replace(/[-\u2010\u2011]/g, "");
}
var Fd = class extends P {
	constructor(...e) {
		super(...e), this.prefix = M, this.query = "";
	}
	static {
		this.styles = [x, D`
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
		if (!e) return T;
		let t = this.search(e), r = this.query.trim() !== "";
		return j`<section class="signpost" data-tipped role="search">
      <div class="sp-head">
        <label for="signpost-q"><ha-icon icon="mdi:sign-direction"></ha-icon>${e("signpost.title")}</label>${n(e, "signpost")}
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
      ${r && t.length ? j`<ul class="hits">
            ${t.slice(0, Nd).map((e) => j`<li>${this.hitLink(e)}</li>`)}
          </ul>` : T}
      <p class="sp-status" aria-live="polite" ?hidden=${!r || t.length > 0 && t.length <= Nd}>
        ${r ? t.length ? e("signpost.more", { count: t.length - Nd }) : e("signpost.none") : ""}
      </p>
    </section>`;
	}
	hitLink(e) {
		let t = e.entry.to;
		return j`<a
      class="hit"
      href=${k(this.prefix, t)}
      @click=${(e) => {
			E(t)(e), e.defaultPrevented && (this.query = "");
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
		let t = Pd(this.query).split(/\s+/).filter(Boolean);
		if (!t.length) return [];
		let n = [];
		return Md.forEach((r, i) => {
			let a = e("title" in r ? r.title : `signpost.${r.id}`), o = e(`signpost.${r.id}.terms`).split(",").map((e) => e.trim()).filter(Boolean), s = Id(e, r.to, a), c = Pd([
				a,
				...o,
				s
			].join(" | "));
			if (!t.every((e) => c.includes(e))) return;
			let l = t.join(" "), u = Pd(a), d = o.find((e) => Pd(e) === l), f = u === l ? 0 : d ? 1 : u.startsWith(l) ? 2 : u.includes(l) ? 3 : 6, p = f === 1 ? d : void 0;
			if (f > 3) {
				let e = o.find((e) => Pd(e).startsWith(l)) ?? o.find((e) => Pd(e).includes(l));
				e && (p = e, f = Pd(e).startsWith(l) ? 4 : 5);
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
b([A({ attribute: !1 })], Fd.prototype, "t", void 0), b([A({ attribute: !1 })], Fd.prototype, "state", void 0), b([A({ attribute: !1 })], Fd.prototype, "route", void 0), b([A({ attribute: !1 })], Fd.prototype, "prefix", void 0), b([C()], Fd.prototype, "query", void 0);
function Id(e, t, n) {
	let r = [e(`tab.${t.tab}`)];
	if (t.section) {
		let n = e.optional(`nav.${t.tab}.${t.section}`);
		n && r.push(n);
	}
	return t.id && Pd(r[r.length - 1]) !== Pd(n) && r.push(n), r.join(" › ");
}
_("joe-signpost", Fd);
//#endregion
//#region src/pages/settings/index.ts
var Ld = {
	operation: "mdi:tune-variant",
	rules: "mdi:format-list-checks",
	notify: "mdi:bell-outline",
	maintenance: "mdi:wrench-outline",
	about: "mdi:information-outline"
}, Rd = class extends P {
	constructor(...e) {
		super(...e), this.prefix = M, this.checks = [];
	}
	static {
		this.styles = [x, D`
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
		if (!e || !this.state) return T;
		let t = this.route?.section ?? ye.settings, n = me.settings.map((t) => ({
			id: t,
			label: e(`nav.settings.${t}`),
			icon: Ld[t]
		}));
		return j`${ni(e, this.prefix, "settings", n, t)}
      <div class="body">${this.renderSignpost()}${this.renderSection(t)}</div>`;
	}
	renderSignpost() {
		return j`<joe-signpost .t=${this.t} .state=${this.state} .prefix=${this.prefix} .route=${this.route}></joe-signpost>`;
	}
	renderSection(e) {
		let { t, hass: n, state: r, prefix: i, route: a, info: o, discovery: s, checks: c } = this;
		switch (e) {
			case "operation": return j`<joe-settings-operation
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
			case "rules": return j`<joe-settings-rules
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
			case "notify": return j`<joe-settings-notify
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
			case "maintenance": return j`<joe-settings-maintenance
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
			case "about": return j`<joe-settings-about
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
b([A({ attribute: !1 })], Rd.prototype, "hass", void 0), b([A({ attribute: !1 })], Rd.prototype, "t", void 0), b([A({ attribute: !1 })], Rd.prototype, "state", void 0), b([A({ attribute: !1 })], Rd.prototype, "route", void 0), b([A({ attribute: !1 })], Rd.prototype, "prefix", void 0), b([A({ attribute: !1 })], Rd.prototype, "info", void 0), b([A({ attribute: !1 })], Rd.prototype, "discovery", void 0), b([A({ attribute: !1 })], Rd.prototype, "checks", void 0), _("joe-settings-page", Rd);
//#endregion
//#region src/energy-joe-panel.ts
var zd = [
	"simulation",
	"advisory",
	"live",
	"off"
], Bd = {
	simulation: "mdi:pause",
	advisory: "mdi:comment-question-outline",
	live: "mdi:play",
	off: "mdi:power"
}, Vd = zd, Hd = {
	overview: "mdi:view-dashboard-outline",
	plan: "mdi:weather-night",
	review: "mdi:history",
	devices: "mdi:power-plug-outline",
	household: "mdi:account-group-outline",
	settings: "mdi:cog-outline"
}, Ud = [
	"overview",
	"devices",
	"household",
	"settings"
], Wd = ["action", "battery"], Gd = [
	"devices",
	"household",
	"overview",
	"review"
], $ = class extends P {
	constructor() {
		super(), this.narrow = !1, this.failed = !1, this.modeDialog = !1, this.notice = "", this.discovering = !1, this.discoveryFailed = !1, this.checks = [], this.infoRequested = !1, this.adopted = !1, this.parsed = Ce(""), this.climateRequested = !1, this.jumped = !1, this.addEventListener("joe-config", (e) => this.onConfig(e)), this.addEventListener("joe-pick", (e) => {
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
		return Se(this.hass?.language);
	}
	get base() {
		return this.route?.prefix ?? "/energy-joe";
	}
	get current() {
		return this.parsed.route;
	}
	connectedCallback() {
		super.connectedCallback(), kr(), this.subscribe();
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
			this.parsed = Ce(this.route?.path ?? "");
			let { route: n, redirect: r } = this.parsed;
			r !== void 0 && this.go(r, { replace: !0 }), this.remember(n), n.tab !== t && this.joe?.onboarding.completed && (this.discoveryFailed = !1, this.climateFound || (this.climateRequested = !1));
		}
	}
	updated() {
		this.observeHead();
		let e = this.joe;
		e?.onboarding.completed && !this.climateRequested && Gd.includes(this.current.tab) && this.loadClimate(), !(!e || this.discovering || this.discoveryFailed) && (!e.onboarding.completed && e.onboarding.step === "scan" && !this.adopted ? this.scan() : !this.discovery && (e.onboarding.completed ? Ud.includes(this.current.tab) || Wd.includes(this.editor?.editor ?? "") : e.onboarding.step !== "welcome") && this.look());
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
		if (this.failed) return j`<main><joe-empty-state pose="puzzled" heading=${e("error.title")} text=${e("error.text")}></joe-empty-state></main>`;
		if (!this.joe) return j`<div class="loading">${e("loading")}</div>`;
		let t = !this.joe.onboarding.completed;
		return j`
      <header>
        ${this.joe.mode === "simulation" ? j`<div class="simband" aria-hidden="true"></div>` : T}
        <div class="bar">
          ${this.narrow || this.hass?.dockedSidebar === "always_hidden" ? j`<button class="menu" type="button" data-notip aria-label=${e("menu.sidebar")} @click=${this.toggleSidebar}>
                <ha-icon icon="mdi:menu"></ha-icon>
              </button>` : T}
          <div class="brand">
            <img class="light" src=${Ie("joe-head.webp")} alt="" width="36" height="36" />
            <img class="dark" src=${Ie("joe-head-dark.webp")} alt="" width="36" height="36" />
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
      ${this.notice ? j`<div class="notice" role="alert">${this.notice}</div>` : T}
      <main
        @joe-onboarding=${this.onOnboarding}
        @joe-rediscover=${() => this.scan()}
        @joe-discovery=${(e) => this.discovery = e.detail}
      >
        ${t ? j`<joe-onboarding
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
      ${this.modeDialog ? this.renderModeDialog(e) : T} ${this.editor ? this.renderEditor(e) : T}
      ${this.picker ? this.renderPicker(e) : T}
    `;
	}
	renderTabs(e) {
		let t = this.current.tab;
		return j`<nav class="tabs" aria-label=${e("nav.label")} lang=${e.lang}>
      ${oe.map((n, r) => {
			let i = this.tabPath(n), a = r > 0 && xe.includes(oe[r - 1]) && !xe.includes(n);
			return j`${a ? j`<span class="gap" aria-hidden="true"></span>` : T}<a
            href=${k(this.base, i)}
            class=${n === t ? "on" : ""}
            aria-current=${n === t ? "page" : "false"}
            @click=${E(i)}
            ><ha-icon icon=${Hd[n]}></ha-icon><span class="label">${e(`tab.${n}`)}</span></a
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
		let t = Pn.indexOf(this.joe?.onboarding.step ?? "welcome");
		return j`<ol class="steps" aria-label=${e("steps.label")}>
      ${Pn.map((n, r) => j`<li class=${r < t ? "done" : r === t ? "on" : ""} aria-current=${r === t ? "step" : "false"}>
            ${r + 1} ${e(`step.${n}`)}
          </li>`)}
    </ol>`;
	}
	renderPage(e) {
		let t = this.current, n = this.base;
		switch (t.tab) {
			case "overview": return j`<joe-overview
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
			case "plan": return j`<joe-plan-page
          .t=${e}
          .hass=${this.hass}
          .state=${this.joe}
          .prefix=${n}
          .route=${t}
          .devices=${this.devices(e)}
        ></joe-plan-page>`;
			case "review": return j`<joe-lookback-page
          .t=${e}
          .hass=${this.hass}
          .state=${this.joe}
          .prefix=${n}
          .route=${t}
          .climateFound=${this.climateFound}
        ></joe-lookback-page>`;
			case "devices": return j`<joe-devices-page
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
			case "household": return j`<joe-household-page
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
			case "settings": return j`<joe-settings-page
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
			let r = mt(e, t, this.hass, {
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
		return j`<div class="scrim" @click=${this.closeDialog}>
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
          <div id="mode-title">${N(e("mode.dialog.title"), "h2", n(e, "mode"))}</div>
          ${S}
          ${this.renderReadiness(e)}
          <div class="modes" role="group" aria-labelledby="mode-title">
            ${zd.map((n) => {
			let r = Vd.includes(n);
			return j`<button
                type="button"
                class="mode ${n}"
                aria-pressed=${String(n === t)}
                ?disabled=${!r}
                @click=${() => this.chooseMode(n)}
              >
                <span class="knob"><ha-icon icon=${Bd[n]}></ha-icon></span>
                <span class="label">
                  <b>${e(`mode.${n}`)}</b>
                  <small>${e(`mode.${n}.desc`)}</small>
                </span>
                ${n === t ? j`<span class="chip ok"><ha-icon icon="mdi:check"></ha-icon>${e("mode.current")}</span>` : r ? T : j`<span class="chip soon">${e("mode.soon")}</span>`}
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
		if (!r.length) return T;
		let i = r.filter((e) => n[e.id] !== "ready");
		if (!i.length) return T;
		let a = i.length === r.length ? e("mode.none_tested") : e("mode.untested", { names: i.map((e) => e.name).join(", ") }), o = {
			tab: "devices",
			section: "battery"
		}, s = E(o);
		return j`<div class="note warn readiness">
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
		}, i = j``, a = "", o = !1;
		switch (t?.editor) {
			case "battery":
				a = e("edit.battery.label"), o = !0, i = j`<joe-battery-editor
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
				a = e("action.label"), i = j`<joe-action-editor
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
			case "consumers": a = e("edit.consumers.label"), o = !0, i = j`<div class="sheet-title">${N(e("edit.consumers.title"))}</div>
          <joe-consumer-list .hass=${this.hass} .t=${e} .config=${n}></joe-consumer-list>
          <div class="actions">
            <button type="button" class="btn btn-secondary" data-notip @click=${r}>${e("mode.close")}</button>
          </div>`;
		}
		return j`<joe-sheet
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
		return j`<joe-sheet
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
		let n = Ce(e).redirect ?? ce(e), r = k(this.base, n);
		if (!t.replace && location.pathname === r) {
			this.scrollTop = 0;
			return;
		}
		t.replace || history.replaceState({
			...history.state ?? {},
			joeScroll: this.scrollTop
		}, ""), this.jumped = !0, history[t.replace ? "replaceState" : "pushState"](t.sheet ? { joeSheet: !0 } : null, "", r), window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: !!t.replace } }));
		let i = Ce(n).route, a = i.tab === "devices" && i.section !== "grid" && i.section !== "add" && !i.sub;
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
			Oe,
			x,
			D`
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
b([A({ attribute: !1 })], $.prototype, "hass", void 0), b([A({
	type: Boolean,
	reflect: !0
})], $.prototype, "narrow", void 0), b([A({ attribute: !1 })], $.prototype, "route", void 0), b([C()], $.prototype, "joe", void 0), b([C()], $.prototype, "info", void 0), b([C()], $.prototype, "failed", void 0), b([C()], $.prototype, "modeDialog", void 0), b([C()], $.prototype, "notice", void 0), b([C()], $.prototype, "discovery", void 0), b([C()], $.prototype, "discovering", void 0), b([C()], $.prototype, "discoveryFailed", void 0), b([C()], $.prototype, "checks", void 0), b([C()], $.prototype, "picker", void 0), b([C()], $.prototype, "editor", void 0), b([C()], $.prototype, "climateFound", void 0), _("energy-joe-panel", $);
//#endregion
export { $ as EnergyJoePanel };
