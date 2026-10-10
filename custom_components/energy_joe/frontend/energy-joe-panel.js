import { A as e, B as t, C as n, D as r, E as i, F as a, G as o, H as s, I as c, J as l, K as u, L as d, M as f, N as p, O as m, P as h, Q as g, R as _, S as v, T as ee, U as te, V as y, W as b, X as ne, Y as x, Z as re, _ as ie, a as ae, b as S, c as oe, d as C, f as w, g as se, h as ce, i as le, j as ue, k as de, l as T, m as fe, n as pe, o as me, p as he, q as E, r as D, s as ge, t as _e, u as ve, v as ye, w as O, x as be, y as xe, z as Se } from "./tokens-D4fDg2jP.js";
//#region src/assets.ts
var Ce = import.meta.url.replace(/[^/]*$/, ""), we = (e) => `${Ce}${e}`, Te = /* @__PURE__ */ new Set(["welcome"]), Ee = /* @__PURE__ */ new Set([
	"night-charge",
	"sleep",
	"learn"
]), De = "thumbs", Oe = class extends u {
	constructor(...e) {
		super(...e), this.name = "", this.alt = "";
	}
	static {
		this.styles = g`
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
		let e = Ee.has(this.name) ? "scene" : "";
		if (this.name === De) return x`<img class="light" src=${we("logo.webp")} alt=${this.alt} decoding="async" /><img
          class="dark"
          src=${we("logo-dark.webp")}
          alt=${this.alt}
          decoding="async"
        />`;
		let t = we(`poses/${this.name}.webp`);
		return Te.has(this.name) ? x`<img class="light" src=${t} alt=${this.alt} decoding="async" /><img
        class="dark"
        src=${we(`poses/${this.name}-dark.webp`)}
        alt=${this.alt}
       
        decoding="async"
      />` : x`<img class=${e} src=${t} alt=${this.alt} decoding="async" />`;
	}
};
f([o()], Oe.prototype, "name", void 0), f([o()], Oe.prototype, "alt", void 0), h("joe-pose", Oe);
//#endregion
//#region src/components/empty-state.ts
var ke = class extends u {
	constructor(...e) {
		super(...e), this.pose = "", this.heading = "", this.text = "", this.note = "";
	}
	static {
		this.styles = [p, g`
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
		return x`<div class="wrap">
      <joe-pose name=${this.pose}></joe-pose>
      <div>
        ${d(this.heading)} ${y}
        <p class="lead">${this.text}</p>
        ${this.note ? x`<div class="note"><span class="chip soon">${this.note}</span></div>` : E}
        <slot></slot>
      </div>
    </div>`;
	}
};
f([o()], ke.prototype, "pose", void 0), f([o()], ke.prototype, "heading", void 0), f([o()], ke.prototype, "text", void 0), f([o()], ke.prototype, "note", void 0), h("joe-empty-state", ke);
//#endregion
//#region src/components/entity-picker.ts
var Ae = 60, je = class extends u {
	constructor(...e) {
		super(...e), this.selected = [], this.invert = !1, this.query = "", this.showAll = !1, this.limit = Ae;
	}
	static {
		this.styles = [p, g`
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
		e.has("request") && this.request && (this.selected = [...this.request.selected], this.invert = this.request.measurement?.invert ?? !1, this.query = "", this.showAll = !1, this.limit = Ae);
	}
	render() {
		let { hass: e, t, request: n } = this;
		if (!e || !t || !n) return E;
		let r = this.candidates(e, n), i = r.slice(0, this.limit), a = this.query ? [] : (n.suggestions ?? []).filter((t) => e.states[t.entity_id]);
		return x`<div data-tipped>
      <div class="sheet-title">${d(n.heading, "h2", v(t, n.tip))}</div>
      <input
        class="input search"
        type="search"
        .value=${this.query}
        placeholder=${t("pick.search")}
        aria-label=${t("pick.search")}
        @input=${(e) => {
			this.query = e.target.value, this.limit = Ae;
		}}
      />
      ${a.length ? x`<div class="group-label">${t("pick.suggested")}</div>
            <ul>
              ${a.map((r) => this.renderRow(e, t, n, r.entity_id, r))}
            </ul>` : E}
      <div class="group-label">${t(this.showAll ? "pick.all" : "pick.fitting")} · ${r.length}</div>
      ${r.length ? x`<ul>
            ${i.map((r) => this.renderRow(e, t, n, r))}
          </ul>` : x`<p class="empty">${t("pick.empty")}</p>`}
      ${r.length > i.length ? x`<button type="button" class="mini-btn more" data-notip @click=${() => this.limit += Ae}>
            ${t("pick.more", { count: r.length - i.length })}
          </button>` : E}
      <div class="line">
        <button
          type="button"
          id="all"
          class="switch"
          role="switch"
          aria-checked=${String(this.showAll)}
          aria-labelledby="all-label"
          @click=${() => {
			this.showAll = !this.showAll, this.limit = Ae;
		}}
        ></button>
        <label id="all-label" for="all">${t("pick.show_all")}</label>
        ${v(t, "pick_all")}
      </div>
      ${n.measurement ? this.renderInvert(e, t, n) : E}
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
		let n = this.query.toLowerCase().split(/\s+/).filter(Boolean), r = new Set(t.exclude ?? []), a = [];
		for (let [o, s] of Object.entries(e.states)) {
			if (r.has(o) || !this.showAll && (!i(s, t.filter) || e.entities?.[o]?.hidden)) continue;
			let c = O(e, o);
			if (n.length) {
				let t = `${c} ${o} ${ee(e, o)}`.toLowerCase();
				if (!n.every((e) => t.includes(e))) continue;
			}
			a.push({
				id: o,
				name: c
			});
		}
		return a.sort((e, t) => e.name.localeCompare(t.name, this.t?.lang)), a.map((e) => e.id);
	}
	renderRow(e, t, n, r, i) {
		let o = this.selected.includes(r), s = ee(e, r), c = i?.reasons?.[0];
		return x`<li>
      <button type="button" class="row" aria-pressed=${String(o)} @click=${() => this.toggle(r)}>
        <span class="mark ${n.multiple ? "box" : ""}" aria-hidden="true">
          ${o ? x`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>` : E}
        </span>
        <span class="txt">
          <b>${O(e, r)}</b>
          <small>${s ? `${s} · ` : ""}${r}</small>
          ${c ? x`<small class="why">${Se(t, c)}</small>` : E}
        </span>
        <span class="end">
          <span class="val">${m(e, r, t.lang)}</span>
          ${i?.confidence == null ? E : a(t, i.confidence)}
        </span>
      </button>
    </li>`;
	}
	renderInvert(e, t, n) {
		let i = n.measurement?.role ?? "grid", a = this.selected[0], o = a ? de(e, {
			entity_id: a,
			invert: this.invert,
			minus_entity_id: null
		}) : null, s = "";
		if (o !== null) {
			let e = r(t.lang, Math.abs(o), 2);
			s = i === "grid" ? t(o >= 0 ? "pick.preview.import" : "pick.preview.export", { value: e }) : i === "battery" ? t(o >= 0 ? "pick.preview.charge" : "pick.preview.discharge", { value: e }) : t(o >= -.05 ? `pick.preview.${i}` : "pick.preview.negative", { value: r(t.lang, o, 2) });
		}
		return x`<div class="line">
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
        ${v(t, i === "battery" ? "pick_invert_battery" : "pick_invert")}
      </div>
      ${s ? x`<div class="note preview"><ha-icon icon="mdi:eye-outline"></ha-icon><span>${s}</span></div>` : E}`;
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
f([o({ attribute: !1 })], je.prototype, "hass", void 0), f([o({ attribute: !1 })], je.prototype, "t", void 0), f([o({ attribute: !1 })], je.prototype, "request", void 0), f([b()], je.prototype, "selected", void 0), f([b()], je.prototype, "invert", void 0), f([b()], je.prototype, "query", void 0), f([b()], je.prototype, "showAll", void 0), f([b()], je.prototype, "limit", void 0), h("joe-entity-picker", je);
//#endregion
//#region src/components/sheet.ts
var Me = class extends u {
	constructor(...e) {
		super(...e), this.label = "", this.closeLabel = "", this.wide = !1, this.onScrim = (e) => {
			e.composedPath()[0] === this && this.close();
		};
	}
	static {
		this.styles = g`
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
		return x`<div
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
f([o()], Me.prototype, "label", void 0), f([o()], Me.prototype, "closeLabel", void 0), f([o({
	type: Boolean,
	reflect: !0
})], Me.prototype, "wide", void 0), f([te(".panel")], Me.prototype, "panel", void 0), h("joe-sheet", Me);
//#endregion
//#region src/components/sim-switch.ts
var Ne = {
	simulation: "mdi:pause",
	advisory: "mdi:comment-question-outline",
	live: "mdi:play",
	off: "mdi:power"
}, Pe = class extends u {
	constructor(...e) {
		super(...e), this.mode = "simulation", this.compact = !1, this.running = !1;
	}
	static {
		this.styles = g`
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
		return e ? x`<button
      type="button"
      class="${this.mode}${this.running ? " running" : ""}"
      aria-label=${e("mode.switch.label")}
      @click=${this.toggle}
    >
      <span class="knob"><ha-icon icon=${Ne[this.mode]}></ha-icon></span>
      <span>
        <b>${e(`mode.${this.mode}`)}</b>
        ${this.compact ? E : x`<small>${e(`mode.${this.mode}.sub`)}</small>`}
      </span>
    </button>` : E;
	}
	toggle() {
		this.dispatchEvent(new CustomEvent("joe-mode-switch", {
			bubbles: !0,
			composed: !0
		}));
	}
};
f([o()], Pe.prototype, "mode", void 0), f([o({ type: Boolean })], Pe.prototype, "compact", void 0), f([o({ type: Boolean })], Pe.prototype, "running", void 0), f([o({ attribute: !1 })], Pe.prototype, "t", void 0), h("joe-sim-switch", Pe);
//#endregion
//#region src/components/texts.ts
function Fe(e, t) {
	return t == null ? "–" : r(e.lang, t * 100, 2);
}
function Ie(e, t, n = !0) {
	let r;
	return r = t.kind === "fixed_window" && t.window ? t.night_price == null && t.day_price == null ? e("tariff.window_only", {
		start: t.window.start,
		end: t.window.end
	}) : e("find.tariff.window", {
		start: t.window.start,
		end: t.window.end,
		night: Fe(e, t.night_price),
		day: Fe(e, t.day_price)
	}) : t.kind === "dynamic" ? t.night_price != null && t.day_price != null ? e("find.tariff.dynamic", {
		night: Fe(e, t.night_price),
		day: Fe(e, t.day_price)
	}) : e("tariff.dynamic") : t.kind === "flat" ? t.day_price == null ? e("tariff.flat") : e("find.tariff.flat", { day: Fe(e, t.day_price) }) : e("find.tariff.unknown"), n && t.feed_in_price != null && (r += ` · ${e("find.tariff.feedin", { price: Fe(e, t.feed_in_price) })}`), r;
}
function Le(e, t) {
	let n = {};
	for (let [i, a] of Object.entries(t)) typeof a == "number" ? n[i] = r(e.lang, a, 2) : typeof a == "string" && (n[i] = a);
	typeof t.role == "string" && (n.role = e.optional(`role.${t.role}`) ?? t.role);
	let i = `check.${t.code}`;
	return t.code === "grid_sign" && typeof t.expected == "number" && typeof t.actual == "number" && (i = t.expected < 0 ? "check.grid_sign.export" : "check.grid_sign.import", n.expected = r(e.lang, Math.abs(t.expected), 1), n.actual = r(e.lang, Math.abs(t.actual), 1)), e.optional(i, n) ?? t.code;
}
//#endregion
//#region src/config.ts
var Re = /\[[^\]]*\]|[^.[]+/g;
function ze(e) {
	let t = [], n = "";
	for (let r of e.match(Re) ?? []) n = !n || r.startsWith("[") ? n + r : `${n}.${r}`, t.push(n);
	return t.reverse();
}
function k(e, t) {
	for (let n of ze(t)) {
		let t = e.provenance[n];
		if (t) return t;
	}
}
function A(e, t) {
	return e.answers.ignored.includes(t);
}
function j(e, t, n) {
	let r = e.answers.ignored.filter((e) => e !== t);
	return n ? [...r, t] : r;
}
function M(e, t, n = "user") {
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
function N(e, t) {
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
function Be(e, t = []) {
	let n = /* @__PURE__ */ new Set(), r = [];
	for (let i of [...e, ...t.map((e) => ({ entity_id: e.entity_id }))]) n.has(i.entity_id) || (n.add(i.entity_id), r.push(i));
	return r;
}
function Ve(e) {
	return {
		entity_id: e.entity.entity_id,
		confidence: e.confidence,
		reasons: e.reasons
	};
}
//#endregion
//#region src/device-model.ts
var He = [
	"battery",
	"climate",
	"car",
	"hot_water",
	"other",
	"grid"
], Ue = {
	battery: "mdi:home-battery-outline",
	climate: "mdi:thermostat",
	car: "mdi:car-electric",
	hot_water: "mdi:water-boiler",
	other: "mdi:power-plug-outline",
	grid: "mdi:transmission-tower"
}, We = (e) => !!(e.need?.enabled || e.need?.soc_entity || e.need?.range_entity), Ge = /(^|[^\p{L}\d])(e-?auto|auto|car|ev|wallbox)([^\p{L}\d]|$)/iu;
function Ke(e) {
	if (e.id.startsWith("hot_water_")) return "hot_water";
	if (e.id.startsWith("ev_")) return "car";
	if (e.id.startsWith("custom_")) return "other";
}
function qe(e, t) {
	if (e.kind === "target") return "hot_water";
	if (We(e) || t?.kind === "ev") return "car";
	if (t?.kind === "hot_water") return "hot_water";
	let n = Ke(e);
	return n === "hot_water" || n === "car" ? n : !t && !n && Ge.test(`${e.id} ${e.name}`) ? "car" : "other";
}
function Je(e, t) {
	let n = t.consumer_id ? e.consumers.find((e) => e.id === t.consumer_id) : void 0, r = qe(t, n);
	return r === "other" ? n && n.kind !== "climate" && e.actions.find((e) => e.consumer_id === n.id && qe(e, n) === "other")?.id === t.id ? {
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
function P(e) {
	return {
		tab: "devices",
		section: e.group,
		id: e.id
	};
}
function Ye(e, t) {
	return {
		tab: "devices",
		section: "add",
		id: e,
		sub: e ? t : void 0
	};
}
function Xe(e, t, n) {
	if (!e) return;
	let r = n ? e.entities?.[n] : void 0, i = t ?? r?.device_id ?? void 0, a = r?.area_id ?? (i ? e.devices?.[i]?.area_id : void 0);
	return a ? e.areas?.[a]?.name : void 0;
}
function Ze(e, t) {
	return (t ? e?.entities?.[t]?.device_id : void 0) ?? void 0;
}
function Qe(e, t) {
	return Ze(e, t.power_entity) ?? Ze(e, t.energy_entity);
}
function $e(e, t) {
	let n = t.filter((e) => !!e);
	return {
		...e,
		problems: n,
		problem: n[0]
	};
}
function et(e, t) {
	return t ? e.optional(`devices.problem.${t}`) ?? t : void 0;
}
function tt(e) {
	return e.level === "warn" || e.code === "tariff_unknown" || e.code === "missing" && e.role === "grid_power";
}
function nt(e, t, n, r = {}) {
	let i = t.config, a = t.control, o = (r.checks ?? []).filter(tt), s = [];
	for (let t of i.batteries) {
		let r = t.adapter !== "none", i = a?.ready[t.id], c = t.device_id ?? Ze(n, t.soc_entity);
		s.push($e({
			group: "battery",
			id: t.id,
			name: t.name,
			area: Xe(n, c, t.soc_entity),
			icon: Ue.battery,
			deviceId: c,
			entityId: t.soc_entity,
			role: r ? "steers" : "watches",
			battery: t
		}, [
			...o.filter((e) => e.battery_id === t.id).map((t) => Le(e, t)),
			r ? et(e, a?.batteries[t.id]?.problem) : void 0,
			r && i && i !== "ready" && i !== "not_controllable" ? et(e, i === "outdated" ? "not_tested" : i) : void 0
		]));
	}
	let c = i.climate?.rooms ?? {}, l = r.climateFound?.devices, u = l ? l.map((e) => e.entity_id) : Object.keys(c);
	for (let e of Object.keys(c)) u.includes(e) || u.push(e);
	let d = i.consumers.filter((e) => e.kind === "climate"), f = /* @__PURE__ */ new Set();
	for (let r of u) {
		let i = l?.find((e) => e.entity_id === r), a = c[r], o = i?.device_id ?? Ze(n, r), u = a?.meter && a.meter !== "none" ? a.meter : void 0, p = d.find((e) => {
			let t = Qe(n, e);
			return t !== void 0 && !f.has(e.id) && (t === o || t === u?.device_id);
		}) ?? d.find((e) => !f.has(e.id) && i && e.name.trim().toLowerCase() === i.name.trim().toLowerCase());
		p && f.add(p.id);
		let m = t.climate?.rooms[r]?.error;
		s.push($e({
			group: "climate",
			id: r,
			name: i?.name ?? (n ? O(n, r) : r),
			area: i?.area ?? Xe(n, o, r),
			icon: Ue.climate,
			deviceId: o,
			entityId: r,
			role: a?.enabled ? "steers" : "watches",
			climate: i,
			room: a,
			meter: u ? {
				deviceId: u.device_id,
				power: u.power ?? void 0
			} : void 0,
			consumer: p
		}, [l && !i ? e("devices.problem.gone") : void 0, m ? e.optional(`week.error.${m}`) ?? e("week.error", { error: m }) : void 0]));
	}
	for (let e of d.filter((e) => !f.has(e.id))) {
		let t = Qe(n, e);
		s.push($e({
			group: "climate",
			id: e.id,
			name: e.name,
			area: Xe(n, t, e.power_entity ?? e.energy_entity),
			icon: "mdi:help-circle-outline",
			deviceId: t,
			entityId: e.power_entity ?? e.energy_entity ?? void 0,
			role: "measures",
			consumer: e,
			unassigned: !0
		}, []));
	}
	let p = new Map(i.consumers.map((e) => [e.id, e])), m = {
		car: [],
		hot_water: [],
		other: []
	}, h = /* @__PURE__ */ new Set(), g = (t, r, i) => {
		let o = t.consumer_id ? p.get(t.consumer_id) : void 0, s = r === "car" ? t.need?.soc_entity ?? t.need?.range_entity ?? t.entity_id : r === "hot_water" ? t.sensor_entity ?? t.entity_id : t.entity_id, c = Ze(n, t.entity_id) ?? (o ? Qe(n, o) : void 0) ?? Ze(n, s);
		return $e({
			group: r,
			id: i,
			name: i === o?.id ? o.name : t.name,
			area: Xe(n, c, s || void 0),
			icon: Ue[r],
			deviceId: c,
			entityId: s || void 0,
			role: t.enabled ? "steers" : "watches",
			action: t,
			consumer: o,
			noMeter: r === "other" && !o
		}, [et(e, a?.actions?.[t.id]?.problem)]);
	};
	for (let e of i.actions) {
		let t = Je(i, e);
		e.consumer_id && t.group !== "other" && h.add(e.consumer_id), e.consumer_id && t.id === e.consumer_id && h.add(e.consumer_id), m[t.group].push(g(e, t.group, t.id));
	}
	for (let e of i.consumers) {
		if (e.kind === "climate" || h.has(e.id)) continue;
		let t = e.kind === "ev" ? "car" : e.kind === "hot_water" ? "hot_water" : "other", r = Qe(n, e), i = e.power_entity ?? e.energy_entity ?? void 0, a = $e({
			group: t,
			id: e.id,
			name: e.name,
			area: Xe(n, r, i),
			icon: t === "other" ? Ue.other : Ue[t],
			deviceId: r,
			entityId: i,
			role: "measures",
			consumer: e,
			setup: t === "other" ? void 0 : t
		}, []);
		m[t].push(a);
	}
	let _ = new Map(i.consumers.map((e, t) => [e.id, t]));
	m.other.sort((e, t) => (_.get(e.id) ?? Infinity) - (_.get(t.id) ?? Infinity)), s.push(...m.car, ...m.hot_water, ...m.other);
	let v = i.measurements, ee = (t) => o.filter((e) => t === "connection" ? e.role === "grid_power" || e.code === "grid_sign" || e.code === "tariff_unknown" : t === "home" ? e.role === "home_power" || e.code === "home_negative" : e.role === "solar_power").map((t) => Le(e, t)), te = (e, t, r, i) => $e({
		group: "grid",
		id: e,
		part: e,
		name: t,
		icon: r,
		deviceId: Ze(n, i),
		entityId: i ?? void 0,
		area: Xe(n, void 0, i),
		role: "measures"
	}, ee(e));
	return s.push(te("connection", e("devices.grid.connection"), "mdi:transmission-tower", v.grid_power?.entity_id)), (v.solar_power.length || i.forecast.provider) && s.push(te("solar", e("devices.grid.solar"), "mdi:solar-power-variant", v.solar_power[0]?.entity_id)), s.push(te("home", e("devices.grid.home"), "mdi:home-lightning-bolt-outline", v.home_power?.entity_id)), s;
}
function rt(e) {
	return He.filter((t) => t === "grid" || e.some((e) => e.group === t));
}
function it(e, t, n) {
	return n === void 0 ? void 0 : e.find((e) => e.group === t && e.id === n);
}
function at(e, t) {
	return e.some((e) => e.group === t && e.problems.length > 0);
}
function ot(e, t) {
	return `${e}:${t}`;
}
function st(e, t) {
	if (!t) return [];
	let n = [];
	for (let r of t.batteries) {
		let t = ot("battery", r.id);
		!e.batteries.some((e) => e.id === r.id) && !A(e, t) && n.push({
			kind: "battery",
			key: t,
			name: r.name,
			battery: r
		});
	}
	for (let r of t.wallboxes.filter((e) => e.is_car)) {
		let t = ot("wallbox", r.device_id ?? r.name);
		!e.actions.some((e) => e.id === `ev_${r.device_id}` || r.mode_entity && e.entity_id === r.mode_entity) && !A(e, t) && n.push({
			kind: "wallbox",
			key: t,
			name: r.name,
			wallbox: r
		});
	}
	for (let r of t.cars ?? []) {
		let t = ot("car", r.device_id);
		!e.actions.some((e) => r.entities.soc && e.need?.soc_entity === r.entities.soc || r.entities.range && e.need?.range_entity === r.entities.range) && !A(e, t) && n.push({
			kind: "car",
			key: t,
			name: r.name,
			car: r
		});
	}
	return n;
}
function ct(e, t) {
	return (t?.batteries ?? []).filter((t) => A(e, ot("battery", t.id)) && !e.batteries.some((e) => e.id === t.id));
}
//#endregion
//#region src/components/calendar-flow.ts
var lt = class extends u {
	constructor(...e) {
		super(...e), this.variant = "calendar", this.address = "", this.calendar = "";
	}
	static {
		this.styles = g`
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
		return e ? x`<ol aria-label=${e(`flow.${this.variant}.title`)}>
      ${this.steps(e).map((e, t) => x`<li class=${e.joe ? "joe" : ""}>
          <span class="badge" aria-hidden="true">
            <ha-icon icon=${e.icon}></ha-icon>
            <span class="number">${t + 1}</span>
          </span>
          <span .innerHTML=${this.bold(e.text)}></span>
        </li>`)}
    </ol>` : E;
	}
	bold(e) {
		return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
	}
};
f([o({ attribute: !1 })], lt.prototype, "t", void 0), f([o()], lt.prototype, "variant", void 0), f([o()], lt.prototype, "address", void 0), f([o()], lt.prototype, "calendar", void 0), h("joe-calendar-flow", lt);
//#endregion
//#region src/components/car-account.ts
var ut = [
	"google",
	"outlook",
	"microsoft",
	"icloud",
	"infomaniak",
	"caldav"
], dt = /* @__PURE__ */ new Set([
	"google",
	"outlook",
	"microsoft"
]), ft = {
	kind: "outlook",
	address: "",
	username: null,
	url: null,
	client_id: null,
	tenant: "common",
	accept: !0
}, F = class extends u {
	constructor(...e) {
		super(...e), this.actionId = "", this.saved = !1, this.password = "", this.secret = "", this.busy = !1, this.ownApp = !1;
	}
	static {
		this.styles = [p, g`
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
		if (!e) return E;
		let t = this.account, n = dt.has(t.kind);
		return x`<div class="field" data-tipped>
        <div class="head-row"><label for="account-kind"><b>${e("calendar.account.kind")}</b></label> ${v(e, "calendar_account")}</div>
        <select id="account-kind" class="input" @change=${(e) => this.set({ kind: e.target.value })}>
          ${ut.map((n) => x`<option value=${n} ?selected=${n === t.kind}>${e(`calendar.account.kind.${n}`)}</option>`)}
        </select>
      </div>
      <div class="field" data-tipped>
        <div class="head-row"><label for="account-address"><b>${e("calendar.account.address")}</b></label> ${v(e, "calendar_account_address")}</div>
        <input
          id="account-address"
          class="input"
          type="email"
          autocomplete="off"
          placeholder=${e(`calendar.account.placeholder.${t.kind}`)}
          .value=${t.address}
          @change=${(e) => this.set({ address: e.target.value.trim().toLowerCase() })}
        />
        ${t.kind === "google" ? x`<p class="hint">${e("calendar.account.google.hint")}</p>` : E}
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
        ${v(e, "calendar_account_accept")}
      </div>
      ${this.renderStatus(e)}`;
	}
	get account() {
		return {
			...ft,
			...this.need?.account ?? {}
		};
	}
	joeApp(e) {
		return e === "google" ? !!this.apps?.google : !!this.apps?.microsoft;
	}
	renderSignIn(e, t) {
		let n = this.status, r = n?.oauth, i = t.kind === "google", a = this.joeApp(t.kind), o = !a || this.ownApp || !!t.client_id || t.kind === "microsoft", s = !!n?.has_sign_in, c = this.signInError ?? (r?.state === "error" ? r.error : void 0);
		return x`${o ? this.renderOwnApp(e, t, a) : E}
      <div class="field" data-tipped>
        <div class="inline">
          <button type="button" class="mini-btn go" ?disabled=${this.busy} @click=${() => this.act("sign_in")}>
            <ha-icon icon=${i ? "mdi:google" : "mdi:microsoft"}></ha-icon>${e(s ? "mail.sign_in.again" : i ? "mail.sign_in.google" : "mail.sign_in")}
          </button>
          ${s ? x`<button type="button" class="mini-btn quiet" @click=${() => this.act("sign_out")}>${e("mail.sign_out")}</button>` : E}
          ${o ? E : x`<button type="button" class="mini-btn quiet" @click=${() => this.ownApp = !0}>${e("calendar.account.own_app")}</button>`}
          ${v(e, "mail_sign_in")}
        </div>
        ${r?.state === "waiting" && !this.signInError ? x`<p class="code">${e("mail.sign_in.code", { code: r.user_code ?? "" })}
              <a href=${r.uri ?? ""} target="_blank" rel="noreferrer noopener">${r.uri}</a></p>` : c ? x`<p class="bad">${e.optional(`calendar.account.oauth.${c}`) ?? e("calendar.account.oauth.other")}</p>` : s ? x`<p class="hint ok">${e("mail.signed_in")}</p>` : E}
      </div>`;
	}
	renderOwnApp(e, t, n) {
		let r = t.kind === "google";
		return x`<div class="field" data-tipped>
      <div class="head-row">
        <b>${e(n ? "calendar.account.client_id" : "calendar.account.client_id.needed")}</b>
        ${v(e, r ? "google_app" : "mail_microsoft")}
      </div>
      ${n ? E : x`<p class="hint">${e("calendar.account.no_joe_app")}</p>`}
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
        ${t.kind === "microsoft" ? x`<input
              class="input"
              type="text"
              placeholder="common"
              aria-label=${e("mail.tenant")}
              .value=${t.tenant}
              @change=${(e) => this.set({ tenant: e.target.value.trim() || "common" })}
            />` : E}
      </div>
      ${r ? x`<form
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
          ${this.status?.has_client_secret ? x`<p class="hint ok">${e("mail.password.saved")}</p>` : E}` : E}
    </div>`;
	}
	renderPassword(e, t) {
		return x`${t.kind === "caldav" ? x`<div class="field" data-tipped>
            <div class="head-row"><b>${e("calendar.account.url")}</b> ${v(e, "calendar_account_url")}</div>
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
          </div>` : E}
      <div class="field" data-tipped>
        <div class="head-row"><label for="account-password"><b>${e("calendar.account.password")}</b></label> ${v(e, "calendar_account_password")}</div>
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
        ${this.status?.has_password ? x`<p class="hint ok">${e("mail.password.saved")}</p>` : E}
      </div>`;
	}
	renderStatus(e) {
		let t = this.status, n = dt.has(this.account.kind) ? t?.has_sign_in : t?.has_password, r = this.saved ? t?.state === "error" ? e("mail.state.error", { error: e.optional(`calendar.account.error.${t.error}`) ?? e("calendar.account.error.other") }) : t?.checked ? e("mail.state.ok", { time: S(t.checked) }) : "" : e("calendar.account.after_save");
		return x`<div class="inline" data-tipped>
      <button type="button" class="mini-btn" ?disabled=${this.busy || !n} @click=${() => this.act("test")}>
        <ha-icon icon="mdi:calendar-check-outline"></ha-icon>${e("calendar.account.test")}
      </button>
      ${v(e, "calendar_account_test")}
      <span class=${this.saved && t?.state === "error" ? "bad" : "hint"}>${r}</span>
      ${this.result ? x`<span class=${this.result === "ok" ? "ok" : "bad"}>
            ${e.optional(`calendar.account.result.${this.result}`) ?? e("calendar.account.result.other")}
          </span>` : E}
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
f([o({ attribute: !1 })], F.prototype, "hass", void 0), f([o({ attribute: !1 })], F.prototype, "t", void 0), f([o()], F.prototype, "actionId", void 0), f([o({ type: Boolean })], F.prototype, "saved", void 0), f([o({ attribute: !1 })], F.prototype, "need", void 0), f([o({ attribute: !1 })], F.prototype, "status", void 0), f([o({ attribute: !1 })], F.prototype, "apps", void 0), f([b()], F.prototype, "password", void 0), f([b()], F.prototype, "secret", void 0), f([b()], F.prototype, "result", void 0), f([b()], F.prototype, "signInError", void 0), f([b()], F.prototype, "busy", void 0), f([b()], F.prototype, "ownApp", void 0), h("joe-car-account", F);
//#endregion
//#region src/components/car-mailbox.ts
var pt = [
	"webde",
	"gmx",
	"google",
	"tonline",
	"other"
], mt = {
	"web.de": "webde",
	"gmx.de": "gmx",
	"gmx.net": "gmx",
	"gmx.at": "gmx",
	"gmx.ch": "gmx",
	"gmail.com": "google",
	"googlemail.com": "google",
	"t-online.de": "tonline"
}, ht = {
	provider: "other",
	address: "",
	username: null,
	imap_host: null,
	imap_port: null,
	smtp_host: null,
	smtp_port: null,
	smtp_security: null,
	accept: !0
}, gt = class extends u {
	constructor(...e) {
		super(...e), this.actionId = "", this.saved = !1, this.password = "", this.busy = !1, this.servers = !1;
	}
	static {
		this.styles = [p, g`
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
		if (!e) return E;
		let t = this.mailbox, n = this.servers || t.provider === "other" && !!t.address;
		return x`<div class="field" data-tipped>
        <div class="head-row"><label for="mail-address"><b>${e("mail.address")}</b></label> ${v(e, "mail_address")}</div>
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
        <div class="head-row"><label for="mail-provider"><b>${e("mail.provider")}</b></label> ${v(e, "mail_provider")}</div>
        <select id="mail-provider" class="input" @change=${(e) => this.set({ provider: e.target.value })}>
          ${pt.map((n) => x`<option value=${n} ?selected=${n === t.provider}>${e(`mail.provider.${n}`)}</option>`)}
        </select>
        <p class="hint">${e(`mail.provider.${t.provider}.hint`)}</p>
      </div>
      ${this.renderPassword(e)} ${n ? this.renderServers(e, t) : E}
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
        ${v(e, "mail_accept")}
        ${n ? E : x`<button type="button" class="mini-btn quiet" @click=${() => this.servers = !0}>${e("mail.servers.change")}</button>`}
      </div>
      ${this.renderStatus(e)} ${this.renderRecent(e)}`;
	}
	get mailbox() {
		return {
			...ht,
			...this.need?.mailbox ?? {}
		};
	}
	renderPassword(e) {
		return x`<div class="field" data-tipped>
      <div class="head-row"><label for="mail-password"><b>${e("mail.password")}</b></label> ${v(e, "mail_password")}</div>
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
      ${this.status?.has_secret ? x`<p class="hint ok">${e("mail.password.saved")}</p>` : x`<p class="hint">${e("mail.password.hint")}</p>`}
    </div>`;
	}
	renderServers(e, t) {
		let n = (n) => x`<input
      class="input"
      type="text"
      aria-label=${e(`mail.${n}`)}
      placeholder=${e(`mail.${n}`)}
      .value=${t[n] ?? ""}
      @change=${(e) => this.set({ [n]: e.target.value.trim() || null })}
    />`, r = (n) => x`<input
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
		return x`<div class="field" data-tipped>
      <div class="head-row"><b>${e("mail.servers")}</b> ${v(e, "mail_servers")}</div>
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
		return x`<div class="field" data-tipped>
      <div class="inline">
        <button type="button" class="mini-btn" ?disabled=${this.busy || !this.status?.has_secret} @click=${() => this.act("test")}>
          <ha-icon icon="mdi:connection"></ha-icon>${e("mail.test")}
        </button>
        ${this.saved ? x`<button type="button" class="mini-btn" ?disabled=${this.busy || !this.status?.has_secret} @click=${() => this.act("check")}>
              <ha-icon icon="mdi:email-sync-outline"></ha-icon>${e("mail.check")}
            </button>` : E}
        ${v(e, "mail_status")}
      </div>
      <p class=${this.saved && this.status?.state === "error" ? "hint bad" : "hint"}>
        ${this.saved ? this.statusText(e) : e("mail.after_save")}
      </p>
      ${this.result ? x`<p class=${this.result === "ok" ? "hint ok" : "hint bad"} role="status">
            ${e.optional(`mail.result.${this.result}`) ?? e("mail.result.failed")}
          </p>` : E}
    </div>`;
	}
	renderRecent(e) {
		let t = this.status?.recent ?? [];
		if (!t.length) return E;
		let n = this.need?.allowed ?? [];
		return x`<div class="field" data-tipped>
      <div class="head-row"><b>${e("mail.recent")}</b> ${v(e, "mail_recent")}</div>
      <ul>
        ${t.slice(0, 8).map((t) => x`<li>
            <span class="what">
              ${t.summary || "–"} ${t.start && t.start.includes("T") ? `· ${t.start.slice(8, 10)}.${t.start.slice(5, 7)}. ${S(t.start)}` : ""}
              · ${t.from}
            </span>
            <span class=${t.result.startsWith("not") || t.result.endsWith("not_accepted") || t.result.startsWith("no_") ? "bad" : ""}>
              ${e.optional(`mail.recent.${t.result}`) ?? t.result}
            </span>
            ${t.result === "not_allowed" && !n.includes(t.from) ? x`<button type="button" class="mini-btn" @click=${() => this.change({ allowed: [...n, t.from] })}>${e("mail.allow")}</button>` : E}
          </li>`)}
      </ul>
    </div>`;
	}
	statusText(e) {
		let t = this.status;
		return !t || t.state === "off" || t.state === "waiting" ? e("mail.state.waiting") : t.state === "no_secret" ? e("mail.state.no_secret") : t.state === "error" ? e("mail.state.error", { error: e.optional(`mail.error.${t.error}`) ?? String(t.error) }) : e("mail.state.ok", { time: t.checked ? S(t.checked) : "–" });
	}
	setAddress(e) {
		let t = mt[e.split("@")[1] ?? ""], n = this.mailbox, r = n.provider === "other" || n.provider === mt[n.address.split("@")[1] ?? ""];
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
f([o({ attribute: !1 })], gt.prototype, "hass", void 0), f([o({ attribute: !1 })], gt.prototype, "t", void 0), f([o()], gt.prototype, "actionId", void 0), f([o({ type: Boolean })], gt.prototype, "saved", void 0), f([o({ attribute: !1 })], gt.prototype, "need", void 0), f([o({ attribute: !1 })], gt.prototype, "status", void 0), f([b()], gt.prototype, "password", void 0), f([b()], gt.prototype, "busy", void 0), f([b()], gt.prototype, "result", void 0), f([b()], gt.prototype, "servers", void 0), h("joe-car-mailbox", gt);
//#endregion
//#region src/components/car-calendars.ts
var _t = [
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
], vt = [
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
], I = class extends u {
	constructor(...e) {
		super(...e), this.actionId = "", this.savedSource = null, this.carName = "", this.copied = !1, this.copyFailed = !1, this.linksFailed = !1, this.sender = "";
	}
	static {
		this.styles = [p, g`
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
		if (!e || !t) return E;
		let n = this.need?.source ?? "ha";
		return x`<div data-tipped>
        <div class="head-row"><b>${e("calendar.source")}</b> ${v(e, "calendar_source")}</div>
        <div class="ways-box"><div class="ways" role="radiogroup" aria-label=${e("calendar.source")}>
          ${_t.map((t) => x`<button
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
      ${this.linksFailed ? x`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("calendar.links_failed")}</span>
            <button type="button" class="mini-btn quiet" @click=${() => this.load(!1)}>${e("calendar.retry")}</button>
          </div>` : E}`;
	}
	saved(e) {
		return this.savedSource === e;
	}
	renderLegacy(e, t) {
		let n = this.savedSource && this.savedSource !== "mailbox" && this.savedSource === (this.need?.source ?? "ha") ? this.links?.entities[this.actionId] : null;
		return n ? x`<div class="own" data-tipped>
          <div class="head-row"><ha-icon icon="mdi:calendar-clock"></ha-icon><b>${e("calendar.own.legacy")}</b> ${v(e, "calendar_legacy")}</div>
          <p class="hint">${e("calendar.own.legacy.hint", { name: O(t, n) })}</p>
        </div>` : E;
	}
	renderCalendar(e, t) {
		let n = this.need?.calendars ?? [];
		return x`<div class="part">
        <joe-calendar-flow .t=${e} variant="calendar"></joe-calendar-flow>
      </div>
      ${this.renderLegacy(e, t)}
      <div data-tipped>
        <div class="head-row"><b>${e("calendar.pick")}</b> ${v(e, "calendar_more")}</div>
        <div class="chips">
          ${n.map((r) => x`<span class="chip">
              ${O(t, r)}
              <button
                type="button"
                class="mini-btn quiet"
                aria-label=${e("calendar.remove", { name: O(t, r) })}
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
          ${vt.map((t) => x`<a class="mini-btn" href=${t.url} target="_blank" rel="noreferrer noopener">
                <ha-icon icon="mdi:open-in-new"></ha-icon>${e(`calendar.connect.${t.key}`)}
              </a>`)}
          ${v(e, "calendar_connect")}
        </div>
      </div>`;
	}
	async pick() {
		let e = this.t, t = await N(this, {
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
		let n = this.saved("mailbox"), r = n ? this.links?.entities[this.actionId] : null, i = r ? O(t, r) : e("calendar.own.name", { car: this.carName });
		return x`<div class="part">
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
		let r = x`<div class="head-row">
      <ha-icon icon="mdi:calendar-import"></ha-icon><b>${e("calendar.own")}</b> ${v(e, "calendar_own")}
    </div>`;
		if (!n) return x`<div class="own" data-tipped>${r}<p class="hint">${e("calendar.own.after_save", { name: t })}</p></div>`;
		let i = this.links?.links[this.actionId], a = this.links?.external_url, o = i && a ? `${a.replace(/\/$/, "")}${i}` : null;
		return x`<div class="own" data-tipped>
      ${r}
      <p class="hint">${e("calendar.own.hint", { name: t })}</p>
      ${o ? x`<div class="link">
            <code>${o}</code>
            <button type="button" class="mini-btn" @click=${() => this.copy(o)}>
              <ha-icon icon=${this.copied ? "mdi:check" : "mdi:content-copy"}></ha-icon>${e(this.copied ? "calendar.copied" : "calendar.copy")}
            </button>
            <button type="button" class="mini-btn quiet" @click=${() => this.load(!0)}>
              <ha-icon icon="mdi:refresh"></ha-icon>${e("calendar.renew")}
            </button>
            ${v(e, "calendar_link")}
          </div>
          ${this.copyFailed ? x`<p class="hint bad">${e("calendar.copy_failed")}</p>` : E}` : x`<p class="hint">${e("calendar.no_external")}</p>`}
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
		return x`<div class="part">
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
      ${this.renderAllowed(e, "account_allowed")} ${this.hass ? this.renderLegacy(e, this.hass) : E}`;
	}
	renderAllowed(e, t = "mail_allowed") {
		let n = this.need?.allowed ?? [];
		return x`<div class="part" data-tipped>
      <div class="head-row"><b>${e("mail.allowed")}</b> ${v(e, t)}</div>
      <p class="hint">${e("mail.allowed.hint")}</p>
      ${n.length ? x`<div class="chips">
            ${n.map((t) => x`<span class="chip">
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
          </div>` : x`<div class="note warn"><ha-icon icon="mdi:account-alert-outline"></ha-icon><span>${e("mail.allowed.none")}</span></div>`}
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
f([o({ attribute: !1 })], I.prototype, "hass", void 0), f([o({ attribute: !1 })], I.prototype, "t", void 0), f([o()], I.prototype, "actionId", void 0), f([o({ attribute: !1 })], I.prototype, "savedSource", void 0), f([o({ attribute: !1 })], I.prototype, "need", void 0), f([o({ attribute: !1 })], I.prototype, "mailbox", void 0), f([o({ attribute: !1 })], I.prototype, "account", void 0), f([o({ attribute: !1 })], I.prototype, "apps", void 0), f([o()], I.prototype, "carName", void 0), f([b()], I.prototype, "links", void 0), f([b()], I.prototype, "copied", void 0), f([b()], I.prototype, "copyFailed", void 0), f([b()], I.prototype, "linksFailed", void 0), f([b()], I.prototype, "sender", void 0), h("joe-car-calendars", I);
//#endregion
//#region src/hot-water.ts
var yt = [
	"warmwasser",
	"brauchwasser",
	"trinkwasser",
	"boiler",
	"hot_water",
	"hot water",
	"dhw",
	"water_heater",
	"water heater"
], bt = [
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
], xt = [
	"switch",
	"input_boolean",
	"select",
	"input_select",
	"number",
	"input_number",
	"button",
	"script"
];
function St(e, t) {
	let n = e.states[t], r = String(n?.attributes.friendly_name ?? ""), i = e.entities?.[t]?.device_id, a = i ? e.devices?.[i] : void 0;
	return `${t} ${r} ${a?.name_by_user ?? a?.name ?? ""}`.toLowerCase().replaceAll("-", " ");
}
function Ct(e, t) {
	return [...yt, ...t].some((t) => e.includes(t));
}
function wt(e) {
	return (e ?? "").toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((e) => e.length >= 5);
}
function Tt(e, t) {
	let n = wt(t), r = [], i = [];
	for (let [t, a] of Object.entries(e.states)) {
		let o = t.split(".")[0], s = St(e, t);
		if (!Ct(s, n)) continue;
		let c = t.toLowerCase(), l = String(a.attributes.unit_of_measurement ?? "");
		if ((o === "sensor" || o === "number") && (l === "°C" || l === "°F")) {
			let e = (yt.some((e) => c.includes(e.replace(" ", "_"))) ? 2 : 1) - (bt.some((e) => s.includes(e)) ? 2 : 0);
			r.push({
				entity_id: t,
				score: e
			});
		} else xt.includes(o) && i.push({
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
var Et = [
	"eq",
	"ne",
	"lt",
	"le",
	"gt",
	"ge"
], Dt = {
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
	allowed: []
}, Ot = {
	reserve_km: [0, 1e3],
	consumption: [5, 60],
	daily_km: [0, 2e3],
	capacity_kwh: [.1, 300]
}, kt = {
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
function At(e, t) {
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
		priority: 1
	} : e === "hot_water" ? {
		...n,
		kind: "target",
		forecast_below_kwh: 20,
		power_kw: .5,
		priority: 2
	} : n;
}
function jt(e) {
	let t = e.entities?.connected ? [{
		entity_id: e.entities.connected,
		op: "eq",
		value: !0
	}] : [];
	return {
		name: e.name,
		entity_id: e.mode_entity ?? "",
		conditions: t,
		power_entity: e.entities?.power ?? null
	};
}
function Mt(e, t) {
	let n = {};
	for (let [r, i] of Object.entries(kt)) {
		let a = e.entities[i.role];
		!t[r] && a && (n[r] = a);
	}
	return n;
}
function Nt(e) {
	return e === "ev" || e === "car" ? "car" : e === "hot_water" ? "hot_water" : "night";
}
function Pt(e, t, n) {
	return n === "calendars" ? "" : t.entity_id ? t.kind === "target" && !t.sensor_entity ? e("action.problem.sensor") : "" : e("action.problem.entity");
}
function L(e, t, n, r) {
	return x`<div class="field" data-tipped>
    <div class="field-label">${t} ${v(e, n)}</div>
    ${r}
  </div>`;
}
function Ft(e, t, n) {
	let r = e.t, i = e.hass;
	return x`<div class="entity">
    <span>
      ${t ? x`<b>${O(i, t)}</b><small>${m(i, t, r.lang)}</small>` : x`<small>${r("find.none")}</small>`}
    </span>
    <button type="button" class="mini-btn" @click=${n}>
      <ha-icon icon="mdi:magnify"></ha-icon>${r(t ? "review.change" : "review.choose")}
    </button>
  </div>`;
}
function It(e) {
	let t = e.trim();
	if (t === "on" || t === "an") return !0;
	if (t === "off" || t === "aus") return !1;
	let n = Number(t.replace(",", "."));
	return t !== "" && Number.isFinite(n) ? n : t;
}
function Lt(e, t, n) {
	let r = Math.round(Number.parseFloat(e.target.value));
	return Math.min(n, Math.max(t, Number.isFinite(r) ? r : t));
}
function Rt(e, t, n, r) {
	let i = e.t, a = t.split(".", 1)[0], o = e.hass?.states[t]?.attributes.options ?? [];
	if (["select", "input_select"].includes(a) && o.length) return x`<select class="input" aria-label=${i("action.f.value")} @change=${(e) => r(e.target.value)}>
      ${o.map((e) => x`<option value=${e} ?selected=${n === e}>${e}</option>`)}
    </select>`;
	if ([
		"switch",
		"input_boolean",
		"light",
		"fan"
	].includes(a)) {
		let e = n === !0 || n === "on";
		return x`<div class="seg" role="group" aria-label=${i("action.f.value")}>
      <button type="button" aria-pressed=${String(e)} @click=${() => r("on")}>${i("action.value.on")}</button>
      <button type="button" aria-pressed=${String(!e)} @click=${() => r("off")}>${i("action.value.off")}</button>
    </div>`;
	}
	return x`<input
    class="input"
    type="text"
    aria-label=${i("action.f.value")}
    .value=${n == null ? "" : String(n)}
    @change=${(e) => r(It(e.target.value))}
  />`;
}
function zt(e, t, n) {
	return x`<button type="button" class="switch" role="switch" aria-checked=${String(t)} aria-label=${e} @click=${n}></button>`;
}
function Bt(e, t, n, r) {
	return x`<a class="mini-btn quiet go-link" href=${T(e || "/energy-joe", t)} aria-label=${r ?? n} @click=${w(t)}
    >${n}</a
  >`;
}
function Vt(e) {
	let t = e.t, n = e.draft;
	return L(t, t("action.f.name"), "a_name", x`<input
      class="input"
      type="text"
      maxlength="60"
      .value=${n.name}
      @change=${(t) => e.setDraft({ name: t.target.value.trim() || n.name })}
    />`);
}
function Ht(e) {
	let t = e.t, n = e.draft;
	return L(t, t("action.f.kind"), "a_kind", x`<div class="seg" role="group" aria-label=${t("action.f.kind")}>
      ${["switch", "target"].map((r) => x`<button type="button" aria-pressed=${String(n.kind === r)} @click=${() => e.setDraft({ kind: r })}>
            ${t(`action.kind.${r}`)}
          </button>`)}
    </div>`);
}
function Ut(e) {
	let t = e.t, n = e.draft;
	return x`${L(t, t("action.f.entity"), "a_entity", Ft(e, n.entity_id, () => tn(e)))}
    ${n.entity_id ? L(t, t("action.f.on_value"), "a_on_value", Rt(e, n.entity_id, n.on_value, (t) => e.setDraft({ on_value: t }))) : E}
    ${L(t, t("action.f.reset"), "a_reset", x`<div class="row">
        <div class="seg" role="group" aria-label=${t("action.f.reset")}>
          ${["previous", "fixed"].map((r) => x`<button type="button" aria-pressed=${String(n.reset === r)} @click=${() => e.setDraft({ reset: r })}>
                ${t(`action.reset.${r}`)}
              </button>`)}
        </div>
        ${n.reset === "fixed" && n.entity_id ? Rt(e, n.entity_id, n.reset_value ?? "", (t) => e.setDraft({ reset_value: t })) : E}
      </div>`)}
    ${L(t, t("action.f.lead"), "a_lead", x`<span class="unit-input">
        <input
          class="input"
          type="number"
          min="0"
          max="120"
          step="1"
          .value=${String(n.lead_min)}
          @change=${(t) => e.setDraft({ lead_min: Lt(t, 0, 120) })}
        />
        <span class="unit">min</span>
      </span>`)}`;
}
function Wt(e) {
	let t = e.t, n = e.draft, r = (r, i) => x`<label>
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
	return x`${L(t, t("action.f.sensor"), "a_sensor", Ft(e, n.sensor_entity ?? "", () => nn(e)))}
    ${L(t, t("action.f.temps"), "a_temps", x`<div class="temps">${r("comfort", "°C")} ${r("maximum", "°C")} ${r("buffer", "K")}</div>`)}`;
}
function Gt(e) {
	let t = e.t, n = e.draft;
	return x`${L(t, t("action.f.auto"), "a_auto", x`<div class="row">
        ${zt(t("action.f.auto"), n.auto, () => e.setDraft({ auto: !n.auto }))}
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
    ${n.auto ? Kt(e) : E}`;
}
function Kt(e) {
	let t = e.t, n = e.hass, r = e.draft, i = (t, n) => e.setDraft({ conditions: (e.draft?.conditions ?? []).map((e, r) => r === t ? {
		...e,
		...n
	} : e) });
	return L(t, t("action.f.conditions"), "a_conditions", x`${r.conditions.map((r, a) => x`<div class="condition">
          <span><b>${O(n, r.entity_id)}</b></span>
          <select
            class="input"
            aria-label=${t("action.f.op")}
            @change=${(e) => i(a, { op: e.target.value })}
          >
            ${Et.map((e) => x`<option value=${e} ?selected=${r.op === e}>${t(`action.op.${e}`)}</option>`)}
          </select>
          <input
            class="input"
            type="text"
            aria-label=${t("action.f.value")}
            .value=${String(r.value === !0 ? "on" : r.value === !1 ? "off" : r.value)}
            @change=${(e) => i(a, { value: It(e.target.value) })}
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
      <button type="button" class="mini-btn" @click=${() => an(e)}>
        <ha-icon icon="mdi:plus"></ha-icon>${t("action.f.condition.add")}
      </button>`);
}
function qt(e) {
	let t = e.t, n = e.draft, r = e.config?.consumers ?? [];
	return x`${L(t, t("action.f.power"), "a_power", x`<span class="unit-input">
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
    ${r.length ? L(t, t("action.f.consumer"), "a_consumer", x`<select class="input" @change=${(t) => e.setDraft({ consumer_id: t.target.value || null })}>
            <option value="" ?selected=${!n.consumer_id}>${t("action.f.consumer.none")}</option>
            ${r.map((e) => x`<option value=${e.id} ?selected=${n.consumer_id === e.id}>${e.name}</option>`)}
          </select>`) : E}
    ${L(t, t("action.f.priority"), "a_priority", x`<span class="unit-input">
        <input
          class="input"
          type="number"
          min="1"
          max="9"
          step="1"
          .value=${String(n.priority)}
          @change=${(t) => e.setDraft({ priority: Lt(t, 1, 9) })}
        />
      </span>`)}`;
}
function Jt(e) {
	let t = e.t, n = e.draft;
	return L(t, t("action.f.enabled"), "a_enabled", zt(t("action.f.enabled"), n.enabled, () => e.setDraft({ enabled: !n.enabled })));
}
function Yt(e, t) {
	e.setDraft({ need: {
		...e.draft?.need ?? Dt,
		...t
	} });
}
function Xt(e) {
	let t = e.draft?.need ?? Dt;
	if (t.enabled) {
		Yt(e, { enabled: !1 });
		return;
	}
	let n = e.discovery?.cars ?? [], r = (e.discovery?.wallboxes ?? []).filter((e) => e.is_car), i = n.length === 1 && r.length <= 1 ? n[0].entities : {}, a = { enabled: !0 };
	for (let [e, n] of Object.entries(kt)) !t[e] && i[n.role] && (a[e] = i[n.role] ?? null);
	Yt(e, a);
}
function Zt(e) {
	let t = e.t, n = e.draft?.need ?? Dt, r = (t, r, i, a = "") => x`<span
    class="unit-input"
  >
    <input
      class="input"
      type="number"
      inputmode="decimal"
      min=${Ot[t][0]}
      max=${Math.min(i, Ot[t][1])}
      step=${t === "consumption" || t === "capacity_kwh" ? "0.1" : "1"}
      placeholder=${a}
      .value=${n[t] == null ? "" : String(n[t])}
      @change=${(n) => {
		let r = n.target, i = Number.parseFloat(r.value.replace(",", ".")), [a, o] = Ot[t], s = Number.isFinite(i) && i >= a && i <= o, c = t === "reserve_km" ? 50 : null;
		s || (r.value = c == null ? "" : String(c)), Yt(e, { [t]: s ? i : c });
	}}
    />
    <span class="unit">${r}</span>
  </span>`, i = (t) => Ft(e, n[t] ?? "", () => rn(e, t));
	return x`${L(t, t("action.need"), "a_need", x`<div class="row">
          ${zt(t("action.need"), n.enabled, () => Xt(e))}
          <span>${t(n.enabled ? "action.need.on" : "action.need.off")}</span>
        </div>
        <p class="field-hint">${t("action.need.hint")}</p>`)}
    ${n.enabled ? x`${L(t, t("action.need.soc"), "a_need_soc", i("soc_entity"))}
        ${L(t, t("action.need.range"), "a_need_range", i("range_entity"))}
        ${L(t, t("action.need.capacity"), "a_need_capacity", x`<div class="row">${r("capacity_kwh", "kWh", 300, t("action.need.from_sensor"))}</div>
            ${n.capacity_kwh == null ? i("capacity_entity") : E}`)}
        ${L(t, t("action.need.reserve"), "a_need_reserve", r("reserve_km", "km", 1e3))}
        ${L(t, t("action.need.consumption"), "a_need_consumption", x`${r("consumption", "kWh/100 km", 60, t("action.need.learned"))}
            ${n.consumption == null ? i("consumption_entity") : E}`)}
        ${L(t, t("action.need.daily"), "a_need_daily", r("daily_km", "km", 2e3, t("action.need.learned")))}
        ${L(t, t("action.need.odometer"), "a_need_odometer", i("odometer_entity"))}` : E}`;
}
function Qt(e) {
	let t = e.t, n = e.draft, r = n.need ?? Dt, i = (e.config?.persons ?? []).filter((e) => e.calendars.length), a = i.map((e) => e.id), o = (t) => {
		let n = (e.draft?.need ?? Dt).persons ?? a, r = n.includes(t) ? n.filter((e) => e !== t) : [...n, t];
		Yt(e, { persons: a.every((e) => r.includes(e)) ? null : r });
	};
	return x`${L(t, t("action.need.persons"), "a_need_persons", i.length ? x`<ul class="people" role="group" aria-label=${t("action.need.persons")}>
            ${i.map((n) => {
		let i = r.persons == null || r.persons.includes(n.id);
		return x`<li>
                <button type="button" class="mini-btn ${i ? "go" : "quiet"}" aria-pressed=${String(i)} @click=${() => o(n.id)}>
                  <ha-icon icon=${i ? "mdi:check" : "mdi:minus"}></ha-icon>${n.name}
                </button>
                ${Bt(e.prefix, {
			tab: "household",
			section: "people",
			id: n.id
		}, t("action.need.person_open"), t("action.need.person_open_of", { name: n.name }))}
              </li>`;
	})}
          </ul>` : x`<p class="field-hint">${t("action.need.no_calendars")}</p>
            ${Bt(e.prefix, {
		tab: "household",
		section: "people"
	}, t("action.need.people_link"))}`)}
    ${L(t, t("action.need.calendars"), "a_need_calendars", x`<joe-car-calendars
        .hass=${e.hass}
        .t=${t}
        actionId=${n.id}
        .savedSource=${e.existing?.need?.enabled ? e.existing.need.source ?? "ha" : null}
        .need=${r}
        .mailbox=${e.mailboxes?.[n.id]}
        .account=${e.accounts?.[n.id]}
        .apps=${e.apps}
        carName=${n.name}
        @joe-need=${(t) => Yt(e, t.detail)}
      ></joe-car-calendars>`)}
    ${L(t, t("action.need.round_trip"), "a_need_round_trip", zt(t("action.need.round_trip"), r.round_trip, () => Yt(e, { round_trip: !(e.draft?.need ?? Dt).round_trip })))}
    ${e.config?.routing.service ? E : x`<div class="note">
          <ha-icon icon="mdi:map-marker-distance"></ha-icon>
          <span>${t("action.need.no_routing")} ${Bt(e.prefix, {
		tab: "household",
		section: "travel"
	}, t("action.need.routing_link"))}</span>
        </div>`}`;
}
function $t(e, t, n = {}) {
	let r = e.t, i = e.draft;
	return t === "calendars" ? Qt(e) : t === "car" ? x`${Zt(e)} ${n.calendars && i.need?.enabled ? Qt(e) : E}
      <h4 class="fields-head">${r("devices.car.wallbox")}</h4>
      ${Ut(e)} ${Gt(e)} ${qt(e)} ${Vt(e)} ${Jt(e)}` : t === "hot_water" ? x`${Ht(e)} ${Ut(e)} ${i.kind === "target" ? Wt(e) : E} ${Gt(e)}
    ${qt(e)} ${Vt(e)} ${Jt(e)}` : x`${Ut(e)} ${i.kind === "target" ? Wt(e) : E} ${Gt(e)} ${qt(e)}
  ${Vt(e)} ${Jt(e)}`;
}
function en(e) {
	if (e.draft?.kind !== "target" || !e.hass) return;
	let t = e.config?.consumers.find((t) => t.id === e.draft?.consumer_id);
	return Tt(e.hass, t?.name);
}
async function tn(e) {
	let t = e.t, n = (await N(e, {
		heading: t("action.pick.entity"),
		tip: "a_entity",
		filter: "writable",
		selected: e.draft?.entity_id ? [e.draft.entity_id] : [],
		suggestions: en(e)?.switches
	}))?.selected[0];
	if (n) {
		let t = e.hass?.states[n]?.attributes.options ?? [], r = e.draft?.on_value;
		e.setDraft({
			entity_id: n,
			on_value: t.length && !t.includes(String(r)) ? t.includes("now") ? "now" : t[0] : r ?? "on"
		});
	}
}
async function nn(e) {
	let t = e.t, n = await N(e, {
		heading: t("action.pick.sensor"),
		tip: "a_sensor",
		filter: "temperature",
		selected: e.draft?.sensor_entity ? [e.draft.sensor_entity] : [],
		suggestions: en(e)?.sensors
	});
	n?.selected[0] && e.setDraft({ sensor_entity: n.selected[0] });
}
async function rn(e, t) {
	let n = e.t, r = kt[t], i = (e.discovery?.cars ?? []).map((e) => ({
		entity_id: e.entities[r.role] ?? "",
		confidence: e.confidence,
		reasons: e.reasons
	})).filter((e) => e.entity_id), a = await N(e, {
		heading: n(`action.need.pick.${r.role}`),
		tip: r.tip,
		filter: r.filter,
		selected: e.draft?.need?.[t] ? [e.draft.need[t]] : [],
		suggestions: Be(i)
	});
	a && Yt(e, { [t]: a.selected[0] ?? null });
}
async function an(e) {
	let t = e.t, n = (await N(e, {
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
var on = g`
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
`, sn = /* @__PURE__ */ new Map();
function cn(e, t) {
	let n = (e, t) => JSON.stringify(e ?? null) === JSON.stringify(t ?? null), r = {};
	for (let i of Object.keys(t)) if (!(i === "id" || n(t[i], e[i]))) {
		if (i === "need" && t.need && e.need) {
			let i = {};
			for (let [r, a] of Object.entries(t.need)) n(a, e.need[r]) || (i[r] = a);
			r.need = i;
		} else r[i] = t[i];
	}
	return r;
}
function ln(e, t) {
	let n = {
		...e,
		...t
	};
	return t.need && e.need && (n.need = {
		...e.need,
		...t.need
	}), n;
}
var un = class extends u {
	constructor(...e) {
		super(...e), this.prefix = D, this.section = "night", this.saving = !1, this.problem = "", this.version = 0;
	}
	static {
		this.styles = [
			p,
			on,
			g`
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
		let e = sn.get(this.key);
		return e ? cn(e.base, e.draft) : {};
	}
	get draft() {
		let e = this.action;
		return e && sn.has(this.key) ? ln(e, this.changes) : e;
	}
	get dirty() {
		let e = sn.get(this.key);
		return !!(e && !e.pending && this.action && Object.keys(cn(this.action, this.draft)).length);
	}
	setDraft(e) {
		let t = this.action, n = this.draft;
		t && n && (sn.set(this.key, {
			base: structuredClone(t),
			draft: {
				...n,
				...e
			},
			pending: !1
		}), this.problem = "", this.version++);
	}
	willUpdate(e) {
		e.has("action") && sn.get(this.key)?.pending && sn.delete(this.key);
	}
	render() {
		let { t: e, hass: t, draft: n } = this;
		return !e || !t || !n ? E : (this.version, x`<div class="fields">${$t(this, this.section)}</div>
      ${this.problem ? x`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.problem}</span></div>` : E}
      ${this.dirty ? x`<div class="steer-bar" role="region" aria-label=${e("action.steer.unsaved")}>
            <span class="unsaved">${e("action.steer.unsaved")}</span>
            <span class="with-tip" data-tipped>
              <button type="button" class="btn btn-primary" ?disabled=${this.saving} @click=${this.save}>${e("common.save")}</button>
              ${v(e, "a_save")}
            </span>
            <button type="button" class="btn btn-ghost" data-notip ?disabled=${this.saving} @click=${this.cancel}>${e("common.cancel")}</button>
          </div>` : E}`);
	}
	cancel() {
		sn.delete(this.key), this.problem = "", this.version++;
	}
	async save() {
		let e = this.draft, t = this.action;
		if (!e || !t || (this.problem = Pt(this.t, e, this.section), this.problem)) return;
		let n = cn(t, e);
		if (!Object.keys(n).length) {
			this.cancel();
			return;
		}
		let r = this.key;
		this.saving = !0;
		let i = await M(this, { actions: { [t.id]: n } });
		this.saving = !1, i && (sn.set(r, {
			base: structuredClone(t),
			draft: e,
			pending: !0
		}), this.version++);
	}
};
f([o({ attribute: !1 })], un.prototype, "hass", void 0), f([o({ attribute: !1 })], un.prototype, "t", void 0), f([o({ attribute: !1 })], un.prototype, "state", void 0), f([o({ attribute: !1 })], un.prototype, "discovery", void 0), f([o({ attribute: !1 })], un.prototype, "prefix", void 0), f([o({ attribute: !1 })], un.prototype, "action", void 0), f([o({ attribute: !1 })], un.prototype, "section", void 0), f([b()], un.prototype, "saving", void 0), f([b()], un.prototype, "problem", void 0), f([b()], un.prototype, "version", void 0);
var dn = class extends u {
	constructor(...e) {
		super(...e), this.asking = !1, this.busy = !1;
	}
	static {
		this.styles = [p, g`
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
		if (!e || !t) return E;
		let n = this.config?.consumers.find((e) => e.id === t.consumer_id), r = qe(t, n);
		return this.asking ? x`<div data-tipped>
      <p class="ask" role="alert">${e(`action.delete.ask.${r}`, { name: t.name })}</p>
      <div class="row">
        <button type="button" class="btn btn-danger" ?disabled=${this.busy} @click=${this.removeAction}>${e("action.delete.yes")}</button>
        <button type="button" class="btn btn-ghost" ?disabled=${this.busy} @click=${() => this.asking = !1}>
          ${e("action.delete.no")}
        </button>
        ${v(e, "a_delete")}
      </div>
    </div>` : x`<div class="row" data-tipped>
        <button type="button" class="btn btn-danger" @click=${() => this.asking = !0}>${e("action.delete")}</button>
        ${v(e, "a_delete")}
      </div>`;
	}
	async removeAction() {
		let e = this.action;
		if (!e) return;
		this.busy = !0;
		let t = await M(this, { actions: { [e.id]: null } });
		this.busy = !1, t && (this.asking = !1, this.dispatchEvent(new CustomEvent("joe-deleted", {
			detail: { id: e.id },
			bubbles: !0,
			composed: !0
		})), this.leave && C(this, this.leave, { replace: !0 }));
	}
};
f([o({ attribute: !1 })], dn.prototype, "t", void 0), f([o({ attribute: !1 })], dn.prototype, "config", void 0), f([o({ attribute: !1 })], dn.prototype, "action", void 0), f([o({ attribute: !1 })], dn.prototype, "leave", void 0), f([b()], dn.prototype, "asking", void 0), f([b()], dn.prototype, "busy", void 0);
var fn = class extends u {
	constructor(...e) {
		super(...e), this.failed = !1;
	}
	static {
		this.styles = [p, g`
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
		if (!e || !t || !n) return E;
		let r = t.plan?.window?.start, i = !!r && t.control?.tonight?.[n.id] === r, a = `tonight-${n.id}`;
		return x`<div class="tonight" data-tipped>
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
        ${v(e, "action_tonight")}
      </div>
      ${this.failed ? x`<p class="bad" role="status">${e("error.action")}</p>` : E}`;
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
f([o({ attribute: !1 })], fn.prototype, "hass", void 0), f([o({ attribute: !1 })], fn.prototype, "t", void 0), f([o({ attribute: !1 })], fn.prototype, "state", void 0), f([o({ attribute: !1 })], fn.prototype, "action", void 0), f([b()], fn.prototype, "failed", void 0);
function pn(e, t, n) {
	let i = t.plan?.actions?.find((e) => e.id === n.id), a = t.control?.actions?.[n.id], o = i?.target == null ? "" : r(e.lang, i.target, 0);
	if (!n.enabled) return e("devices.action.disabled");
	if (a?.reason === "boost") return e("devices.action.boost");
	if (a?.on) return n.kind === "target" ? e("devices.action.heating", {
		target: o,
		end: S(a.end)
	}) : e("devices.action.running", { end: S(a.end) });
	if (a?.reason === "reached") {
		let a = t.control?.tonight_target?.[n.id];
		return n.kind === "switch" && a && a.night === t.plan?.window?.start ? e("devices.action.reached_need", {
			target: r(e.lang, a.chosen, 0),
			unit: a.unit
		}) : n.kind === "switch" ? i?.need && o ? e("devices.action.reached_need", {
			target: o,
			unit: i.need.target_unit === "km" ? "km" : "%"
		}) : e("devices.action.reached_plain") : e("devices.action.reached", { target: o });
	}
	if (!i) return e("devices.action.no_plan");
	let s = t.mode === "simulation" ? e("devices.action.would") : "";
	if (i.run) return `${s}${n.kind === "target" ? e("devices.action.plan_target", {
		start: S(i.start),
		target: o
	}) : e("devices.action.plan_run", {
		start: S(i.start),
		end: S(i.end)
	})}`;
	let c = i.reasons[i.reasons.length - 1] ?? "manual_only";
	return e.optional(`devices.action.why.${c}`, {
		kwh: r(e.lang, t.plan?.meta?.tomorrow_kwh ?? 0, 0),
		temperature: r(e.lang, i.temperature ?? 0, 0)
	}) ?? c;
}
h("joe-action-steer", un), h("joe-action-delete", dn), h("joe-action-tonight", fn);
//#endregion
//#region src/editors/action-editor.ts
var R = class extends u {
	constructor(...e) {
		super(...e), this.prefix = D, this.actionId = "", this.section = "", this.consumer = "", this.subtitle = "", this.found = "", this.saving = !1, this.problem = "", this.touched = !1, this.focused = !1;
	}
	static {
		this.styles = [
			p,
			on,
			g`
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
		return this.actionId.startsWith("new:") ? Nt(this.actionId.slice(4)) : this.openLayout ?? "night";
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
				let e = At(this.actionId.slice(4), this.t), [t, n] = this.found.split(/:(.*)/s), r = this.config?.actions ?? [], i = (this.discovery?.wallboxes ?? []).filter((e) => e.is_car), a = t === "wallbox" ? i.find((e) => (e.device_id ?? e.name) === n) : i.find((e) => !r.some((t) => t.id === `ev_${e.device_id}` || e.mode_entity && t.entity_id === e.mode_entity));
				this.actionId === "new:ev" && a && Object.assign(e, jt(a));
				let o = t === "car" ? this.discovery?.cars?.find((e) => e.device_id === n) : void 0;
				o && (e.name = o.name);
				let s = this.config?.consumers.filter((e) => e.kind === "hot_water") ?? [];
				this.actionId === "new:hot_water" && s.length === 1 && (e.consumer_id = s[0].id);
				let c = this.config?.consumers.find((e) => e.id === this.consumer);
				c && (e.name = c.name, e.consumer_id = c.id, e.power_entity = c.power_entity ?? null), this.draft = e, this.section === "need" && Xt(this), o && this.actionId === "new:ev" && Yt(this, {
					enabled: !0,
					...Mt(o, this.draft.need ?? Dt)
				}), this.touched = !1;
			} else if (this.existing) {
				this.draft = structuredClone(this.existing);
				let e = this.config?.consumers.find((e) => e.id === this.existing?.consumer_id);
				this.openLayout = Nt(qe(this.existing, e)), (this.section === "calendars" || this.section === "need") && !this.draft.need?.enabled && Xt(this);
			}
		}
	}
	updated() {
		if ((this.section === "calendars" || this.section === "need") && !this.focused) {
			let e = this.shadowRoot?.querySelector(this.section === "need" ? `[aria-label="${this.t?.("action.need") ?? ""}"]` : "joe-car-calendars");
			e && (this.focused = !0, e.scrollIntoView({ block: "center" }));
		}
	}
	render() {
		let { t: e, hass: t, draft: n } = this;
		if (!e || !t || !n) return E;
		let r = this.existing, i = e(r ? "action.title" : `action.title.${this.actionId.slice(4)}`);
		return x`<div class="sheet-title">${d(i)}</div>
      ${this.subtitle ? x`<p class="sheet-sub">${this.subtitle}</p>` : E}
      ${$t(this, this.layout, { calendars: !0 })}
      ${this.problem ? x`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.problem}</span></div>` : E}
      <div class="actions">
        <span data-tipped class="row">
          <button type="button" class="btn btn-primary" ?disabled=${this.saving} @click=${this.save}>${e("common.save")}</button>
          ${v(e, "a_save")}
        </span>
        <button type="button" class="btn btn-ghost" data-notip @click=${this.close}>${e("common.cancel")}</button>
      </div>
      ${r ? x`<div class="danger-zone">
            <joe-action-delete .t=${e} .config=${this.config} .action=${r} @joe-deleted=${this.close}></joe-action-delete>
          </div>` : E}`;
	}
	async save() {
		let e = this.draft;
		if (!e || (this.problem = Pt(this.t, e, this.layout), this.problem)) return;
		let { id: t, ...n } = e;
		this.saving = !0;
		let r = await M(this, { actions: { [t]: n } });
		this.saving = !1, r && this.close();
	}
	close() {
		this.dispatchEvent(new CustomEvent("joe-close", {
			bubbles: !0,
			composed: !0
		}));
	}
};
f([o({ attribute: !1 })], R.prototype, "hass", void 0), f([o({ attribute: !1 })], R.prototype, "mailboxes", void 0), f([o({ attribute: !1 })], R.prototype, "accounts", void 0), f([o({ attribute: !1 })], R.prototype, "apps", void 0), f([o({ attribute: !1 })], R.prototype, "t", void 0), f([o({ attribute: !1 })], R.prototype, "config", void 0), f([o({ attribute: !1 })], R.prototype, "discovery", void 0), f([o({ attribute: !1 })], R.prototype, "prefix", void 0), f([o()], R.prototype, "actionId", void 0), f([o()], R.prototype, "section", void 0), f([o()], R.prototype, "consumer", void 0), f([o()], R.prototype, "subtitle", void 0), f([o()], R.prototype, "found", void 0), f([b()], R.prototype, "draft", void 0), f([b()], R.prototype, "saving", void 0), f([b()], R.prototype, "problem", void 0), h("joe-action-editor", R);
//#endregion
//#region src/components/look-back.ts
function mn(e, t, n = "EUR", r = !1) {
	return new Intl.NumberFormat(e.lang, {
		style: "currency",
		currency: n,
		signDisplay: r ? "exceptZero" : "auto"
	}).format(Math.abs(t) < .005 ? 0 : t);
}
function z(e, t, n = 1) {
	return new Intl.NumberFormat(e, {
		minimumFractionDigits: n,
		maximumFractionDigits: n
	}).format(t);
}
function hn(e, t = "EUR") {
	return new Intl.NumberFormat(e, {
		style: "currency",
		currency: t
	}).formatToParts(0).find((e) => e.type === "currency")?.value ?? t;
}
function gn(e) {
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
function B(e, t, n = "long") {
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
function _n(e, t) {
	return t === 1 ? e("learn.nights.one") : e("learn.nights.many", { count: t });
}
//#endregion
//#region src/pages/devices/battery-fields.ts
var vn = [
	"name",
	"capacity_kwh",
	"soc_entity",
	"power",
	"max_charge_w",
	"max_discharge_w",
	"floor_soc",
	"priority"
], yn = class extends u {
	constructor(...e) {
		super(...e), this.show = "all";
	}
	static {
		this.styles = [p, g`
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
		return this.draft ? this.draft : e ? Object.fromEntries(vn.map((t) => [t, e[t]])) : void 0;
	}
	get capacityUnknown() {
		let e = this.battery;
		return this.unknown === void 0 ? !!(e && this.config?.answers[`capacity:${e.id}`] === "unknown") : this.unknown;
	}
	render() {
		let { t: e, hass: t, config: n, battery: r } = this, i = this.values;
		if (!e || !t || !n || !r || !i) return E;
		let a = this.show !== "power", o = this.show !== "steer";
		return x`${a ? this.renderName(e, r, i) : E} ${a ? this.renderCapacity(e, r, i) : E}
    ${o ? this.renderSensors(e, r, i) : E} ${a ? this.renderLimits(e, r, i) : E}`;
	}
	renderName(e, t, n) {
		return this.field(e("f.battery.name"), "f_battery_name", x`<input
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
	renderCapacity(e, i, a) {
		let o = this.hass, s = this.config, c = this.capacityUnknown, l = n(o, i.capacity_entity), u = s.learned?.battery_models?.[i.id];
		return this.field(e("f.battery.capacity"), "q_capacity", x`<div class="field-row">
          <span class="unit-input">
            <input
              class="input"
              type="number"
              inputmode="decimal"
              min="0.1"
              max="1000"
              step="0.01"
              aria-label=${e("f.battery.capacity")}
              .value=${a.capacity_kwh == null ? "" : String(a.capacity_kwh)}
              placeholder=${l == null ? e("f.unknown") : r(e.lang, l, 2)}
              @change=${(e) => {
			let t = Number.parseFloat(e.target.value.replace(",", "."));
			this.change({ capacity_kwh: Number.isFinite(t) && t > 0 ? t : null }, !1);
		}}
            />
            <span class="unit">kWh</span>
          </span>
          <button
            type="button"
            class="mini-btn ${c ? "go" : ""}"
            aria-pressed=${String(c)}
            @click=${() => c ? this.change({}, !1) : this.change({ capacity_kwh: null }, !0)}
          >
            ${e("ask.idk_learn")}
          </button>
        </div>
        ${l == null ? E : x`<p class="field-hint">${e("f.battery.capacity.read", { value: r(e.lang, l, 2) })}</p>`}
        ${u ? x`<p class="field-hint learned">
              ${t(e, { source: "learned" })}
              ${e("battery.page.capacity.learned", { value: z(e.lang, u.capacity_kwh, 1) })}
            </p>` : c ? x`<p class="field-hint">${e("battery.page.capacity.learning")}</p>` : E}`, t(e, k(s, `batteries[${i.id}].capacity_kwh`)));
	}
	renderSensors(e, n, r) {
		let i = this.hass, a = this.config;
		return x`${this.field(e("f.battery.soc"), "f_battery_soc", this.entityBox(e, r.soc_entity, m(i, r.soc_entity, e.lang), () => this.pickSoc(r)), t(e, k(a, `batteries[${n.id}].soc_entity`)))}
    ${this.field(e("f.battery.power"), "f_battery_power", this.entityBox(e, r.power?.entity_id ?? null, this.powerText(e, r.power), () => this.pickPower(r)), t(e, k(a, `batteries[${n.id}].power`)))}`;
	}
	renderLimits(e, n, i) {
		let a = this.config, o = this.floor;
		return x`${this.field(e("f.battery.limits"), "f_battery_limits", x`<div class="limits">
        <label>${e("f.battery.max_charge")} ${this.kwInput(e, i.max_charge_w, "max_charge_w")}</label>
        <label>${e("f.battery.max_discharge")} ${this.kwInput(e, i.max_discharge_w, "max_discharge_w")}</label>
      </div>`)}
    ${this.field(e("f.battery.floor"), "f_battery_floor", x`<span class="unit-input">
          <input
            class="input"
            type="number"
            inputmode="decimal"
            min="0"
            max="100"
            step="1"
            aria-label=${e("f.battery.floor")}
            .value=${i.floor_soc == null ? "" : String(i.floor_soc)}
            placeholder=${o?.device == null ? e("f.unknown") : r(e.lang, o.device, 0)}
            @change=${(e) => {
			let t = Number.parseFloat(e.target.value.replace(",", "."));
			this.change({ floor_soc: Number.isFinite(t) ? Math.min(100, Math.max(0, t)) : null });
		}}
          />
          <span class="unit">%</span>
        </span>
        ${o?.device == null ? i.floor_soc == null ? x`<div class="note warn"><ha-icon icon="mdi:help-circle-outline"></ha-icon><span>${e("f.battery.floor.ask")}</span></div>` : E : x`<p class="field-hint">${e("f.battery.floor.read", { value: r(e.lang, o.device, 0) })}</p>`}`, t(e, k(a, `batteries[${n.id}].floor_soc`)))}
    ${a.batteries.length > 1 ? this.field(e("f.battery.priority"), "f_battery_priority", x`<span class="unit-input">
            <input
              class="input"
              type="number"
              inputmode="numeric"
              min="1"
              max="9"
              step="1"
              aria-label=${e("f.battery.priority")}
              .value=${String(i.priority)}
              @change=${(e) => {
			let t = Math.round(Number.parseFloat(e.target.value));
			this.change({ priority: Math.min(9, Math.max(1, Number.isFinite(t) ? t : 1)) });
		}}
            />
          </span>`) : E}`;
	}
	field(e, t, n, r) {
		let i = this.t;
		return x`<div class="field" data-tipped>
      <div class="field-label">${e} ${v(i, t)} ${r ?? E}</div>
      ${n}
    </div>`;
	}
	entityBox(e, t, n, r) {
		let i = this.hass;
		return x`<div class="entity">
      <span>
        ${t ? x`<b>${O(i, t)}</b><small>${n}</small>` : x`<small>${e("find.none")}</small>`}
      </span>
      <button type="button" class="mini-btn" @click=${r}>
        <ha-icon icon="mdi:magnify"></ha-icon>${e(t ? "review.change" : "review.choose")}
      </button>
    </div>`;
	}
	kwInput(e, t, n) {
		return x`<span class="unit-input">
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
		let n = this.hass, i = de(n, t);
		if (!t || i === null) return t ? m(n, t.entity_id, e.lang) : "";
		let a = r(e.lang, Math.abs(i), 2);
		return e(i >= 0 ? "pick.preview.charge" : "pick.preview.discharge", { value: a });
	}
	async pickSoc(e) {
		let t = this.t, n = (await N(this, {
			heading: t("pick.battery.title"),
			tip: "pick_battery",
			filter: "soc",
			selected: [e.soc_entity]
		}))?.selected[0];
		n && n !== e.soc_entity && this.change({ soc_entity: n });
	}
	async pickPower(e) {
		let t = this.t, n = await N(this, {
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
		Object.keys(a).length && (o.batteries = { [n.id]: a }), i !== void 0 && (o.answers = { [`capacity:${n.id}`]: i ? "unknown" : null }), Object.keys(o).length && M(this, o);
	}
};
f([o({ attribute: !1 })], yn.prototype, "hass", void 0), f([o({ attribute: !1 })], yn.prototype, "t", void 0), f([o({ attribute: !1 })], yn.prototype, "config", void 0), f([o({ attribute: !1 })], yn.prototype, "battery", void 0), f([o({ attribute: !1 })], yn.prototype, "floor", void 0), f([o({ attribute: !1 })], yn.prototype, "draft", void 0), f([o({ attribute: !1 })], yn.prototype, "unknown", void 0), f([o()], yn.prototype, "show", void 0), h("joe-battery-fields", yn);
//#endregion
//#region src/types.ts
var bn = [
	"welcome",
	"scan",
	"questions",
	"done"
], xn = [
	"min_soc",
	"grid_charge",
	"charge_target",
	"mode",
	"charge_power",
	"discharge_power",
	"discharge_limit",
	"discharge_limit_enabled"
], Sn = [
	"normal",
	"force_charge",
	"hold",
	"force_discharge"
], Cn = [
	"home_office",
	"office",
	"travel",
	"vacation",
	"guests",
	"home"
], wn = [
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
function Tn(e) {
	let t = e.filter((e) => e.kind !== "submeter" && (e.kind === "ev" && (e.runs ?? "auto") !== "always" || e.runs === "surplus" || e.runs === "cheap")), n = new Set(t.map((e) => e.energy_entity).filter(Boolean));
	return t.filter((e) => !e.included_in || !n.has(e.included_in));
}
var En = [
	"forecast",
	"consumption",
	"battery",
	"hot_water",
	"car"
], Dn = [
	"normal",
	"holiday",
	"away",
	"home_office"
], On = ["heat", "cool"], kn = {
	min_soc: "level",
	charge_target: "level",
	grid_charge: "toggle",
	mode: "option",
	charge_power: "setpoint",
	discharge_power: "setpoint",
	discharge_limit: "setpoint",
	discharge_limit_enabled: "toggle",
	charge_limit: "setpoint",
	charge_limit_enabled: "toggle"
}, An = [
	"charge",
	"hold",
	"release"
];
function jn(e) {
	let t = (...t) => t.every((t) => !!e.controls[t]), n = (t) => !!e.mode_options[t], r = [];
	t("mode") && n("force_charge") && r.push("mode"), t("grid_charge", "charge_target") && r.push("target"), t("grid_charge", "min_soc") && r.push("min_soc");
	let i = [];
	return t("min_soc") && i.push("min_soc"), t("mode") && n("hold") && i.push("mode_hold"), t("mode", "charge_power") && n("force_charge") && i.push("standby"), t("discharge_limit") && i.push("limit"), {
		charge: r,
		hold: i
	};
}
function Mn(e) {
	return {
		adapter: e.adapter,
		controls: structuredClone(e.controls),
		mode_options: structuredClone(e.mode_options),
		steps: structuredClone(e.steps)
	};
}
function Nn(e, t, n) {
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
var Pn = class extends u {
	static {
		this.styles = [p, g`
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
		if (!e || !t) return E;
		let n = [
			"watch",
			...this.profileKey ? ["profile"] : [],
			"generic",
			"steps"
		], r = this.found?.suggested;
		return x`<div class="choose">
        <div class="seg" role="group" aria-label=${e("f.battery.control")}>
          ${n.map((t) => x`<button type="button" aria-pressed=${String(this.choice === t)} @click=${() => this.choose(t)}>
                ${t === "profile" ? e("f.battery.control.profile", { name: this.profiles?.[this.profileKey ?? ""] ?? this.profileKey ?? "" }) : e(`f.battery.control.${t}`)}
              </button>`)}
        </div>
      </div>
      ${this.choice === "watch" && r?.complete ? x`<div class="note" data-tipped>
            <ha-icon icon="mdi:lightbulb-on-outline"></ha-icon>
            <span
              >${e("f.battery.control.suggested")}
              <div class="note-actions">
                <button type="button" class="mini-btn go" @click=${this.takeSuggestion}>${e("f.battery.control.take")}</button>
                ${v(e, "control_roles")}
              </div></span
            >
          </div>` : E}
      ${this.choice === "profile" && Object.keys(t.steps).length && !Object.keys(t.controls).length ? this.renderServiceSteps(e, t) : this.choice === "profile" || this.choice === "generic" ? this.renderRoles(e, t) : E}
      ${this.choice === "steps" ? this.renderSteps(e, t) : E}
      ${this.choice === "watch" ? E : x`<p class="field-hint">${e("f.battery.control.retest")}</p>`}`;
	}
	renderRoles(e, t) {
		let n = this.hass, r = jn(t), i = r.charge.length && r.hold.length, a = t.controls.mode, o = a ? n.states[a]?.attributes.options ?? [] : [];
		return x`<div data-tipped>
      <div class="sub">${e("f.battery.control.levers")} ${v(e, "control_roles")}</div>
      <div class="rows">
        ${xn.map((r) => {
			let i = t.controls[r];
			return x`<div class="row">
            <span class="label">${e(`role.${r}`)}</span>
            <span class="entity">
              ${i ? x`<b>${O(n, i)}</b><small>${m(n, i, e.lang)}</small>` : x`<small>${e("find.none")}</small>`}
            </span>
            <span class="buttons">
              <button type="button" class="mini-btn" @click=${() => this.pickRole(r)}>
                <ha-icon icon="mdi:magnify"></ha-icon>${e(i ? "review.change" : "review.choose")}
              </button>
              ${i ? x`<button
                    type="button"
                    class="icon-btn"
                    aria-label=${e("f.remove")}
                    title=${e("f.remove")}
                    @click=${() => this.setRole(r, null)}
                  >
                    <ha-icon icon="mdi:close"></ha-icon>
                  </button>` : E}
            </span>
          </div>`;
		})}
      </div>
      </div>
      ${a ? x`<div data-tipped>
            <div class="sub">${e("f.battery.mode_options")} ${v(e, "mode_options")}</div>
            <div class="rows">
              ${Sn.map((n) => x`<div class="row">
                  <label for="opt-${n}">${e(`meaning.${n}`)}</label>
                  <select
                    id="opt-${n}"
                    class="input"
                    @change=${(e) => this.setOption(n, e.target.value)}
                  >
                    <option value="" ?selected=${!t.mode_options[n]}>${e("meaning.none")}</option>
                    ${o.map((e) => x`<option value=${e} ?selected=${t.mode_options[n] === e}>${e}</option>`)}
                  </select>
                  <span></span>
                </div>`)}
            </div>
            </div>` : E}
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
		return x`<div data-tipped>
      <div class="sub">${e("f.battery.control.services")} ${v(e, "control_steps")}</div>
      <div class="rows">
        ${An.flatMap((r) => (t.steps[r] ?? []).map((t) => x`<div class="row">
              <span class="label">${e(`f.battery.steps.${r}`)}</span>
              <span class="entity">
                ${t.service ? x`<b>${t.service}</b>` : x`<b>${O(n, t.entity_id ?? "")}</b><small>${String(t.value ?? "")}</small>`}
              </span>
              <span></span>
            </div>`))}
      </div>
    </div>`;
	}
	renderSteps(e, t) {
		let n = this.hass;
		return x`<div class="sub" data-tipped>${e("f.battery.control.steps")} ${v(e, "control_steps")}</div>
      <p class="field-hint">${e("f.battery.steps.hint")}</p>
      ${An.map((r) => {
			let i = t.steps[r] ?? [];
			return x`<div class="sub">${e(`f.battery.steps.${r}`)}</div>
          <div class="rows" data-tipped>
            ${i.map((t, i) => x`<div class="row">
                <span class="entity"
                  ><b>${t.service ?? O(n, t.entity_id ?? "")}</b><small>${t.entity_id ?? ""}</small></span
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
                  ${this.valueHints(t.entity_id ?? "", r).map((e) => x`<option value=${e}></option>`)}
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
              ${v(e, "control_steps")}
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
		let t = this.t, n = this.value.controls[e], r = await N(this, {
			heading: t("pick.role.title", { role: t(`role.${e}`) }),
			tip: "control_roles",
			filter: kn[e],
			selected: n ? [n] : [],
			suggestions: this.nearby(kn[e]).map((e) => ({ entity_id: e }))
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
		let t = this.t, n = (await N(this, {
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
f([o({ attribute: !1 })], Pn.prototype, "hass", void 0), f([o({ attribute: !1 })], Pn.prototype, "t", void 0), f([o({ attribute: !1 })], Pn.prototype, "battery", void 0), f([o({ attribute: !1 })], Pn.prototype, "found", void 0), f([o({ attribute: !1 })], Pn.prototype, "value", void 0), f([o({ attribute: !1 })], Pn.prototype, "profiles", void 0), h("joe-battery-control", Pn);
//#endregion
//#region src/editors/battery-editor.ts
var Fn = [
	"adapter",
	"controls",
	"mode_options",
	"steps",
	"prepare"
], V = class extends u {
	constructor(...e) {
		super(...e), this.batteryId = "", this.unknown = !1, this.saving = !1;
	}
	static {
		this.styles = [p, g`
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
		(e.has("config") || e.has("batteryId")) && t && !this.values && (this.values = Object.fromEntries(vn.map((e) => [e, structuredClone(t[e])])), this.control = {
			...Mn(t),
			prepare: structuredClone(t.prepare)
		}, this.unknown = this.config?.answers[`capacity:${t.id}`] === "unknown");
	}
	render() {
		let { t: e, hass: t, config: n, values: r, control: i } = this, a = this.battery;
		if (!e || !t || !n || !r || !i || !a) return E;
		let o = this.discovery?.batteries.find((e) => e.id === a.id);
		return x`<div class="sheet-title">${d(e("edit.battery.title", { name: a.name }))}</div>
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
        <div class="field-label">${e("f.battery.control")} ${v(e, "control_choice")}</div>
        <joe-battery-control
          .hass=${t}
          .t=${e}
          .battery=${a}
          .found=${o}
          .profiles=${this.info?.profiles}
          .value=${i}
          @joe-control-change=${(e) => {
			this.control = Nn(a, e.detail, o);
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
		for (let t of [...vn, ...Fn]) JSON.stringify(e[t] ?? null) !== JSON.stringify(i[t] ?? null) && (a[t] = i[t]);
		let o = `capacity:${e.id}`, s = {};
		if (Object.keys(a).length && (s.batteries = { [e.id]: a }), t.answers[o] === "unknown" !== this.unknown && (s.answers = { [o]: this.unknown ? "unknown" : null }), Object.keys(s).length) {
			this.saving = !0;
			let e = await M(this, s);
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
f([o({ attribute: !1 })], V.prototype, "hass", void 0), f([o({ attribute: !1 })], V.prototype, "t", void 0), f([o({ attribute: !1 })], V.prototype, "config", void 0), f([o({ attribute: !1 })], V.prototype, "discovery", void 0), f([o({ attribute: !1 })], V.prototype, "info", void 0), f([o({ attribute: !1 })], V.prototype, "floor", void 0), f([o()], V.prototype, "batteryId", void 0), f([b()], V.prototype, "values", void 0), f([b()], V.prototype, "control", void 0), f([b()], V.prototype, "unknown", void 0), f([b()], V.prototype, "saving", void 0), h("joe-battery-editor", V);
//#endregion
//#region src/fonts.ts
var In = [
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
function Ln() {
	if (document.getElementById("energy-joe-fonts")) return;
	let e = document.createElement("style");
	e.id = "energy-joe-fonts", e.textContent = In.map(([e, t, n, r]) => `@font-face{font-family:"${e}";font-style:${n};font-weight:${t};font-display:swap;src:url("${we(`fonts/${r}.woff2`)}") format("woff2")}`).join("\n"), document.head.appendChild(e);
}
//#endregion
//#region node_modules/lit-html/directive-helpers.js
var { I: Rn } = ne, zn = (e) => e, Bn = (e) => e.strings === void 0, Vn = () => document.createComment(""), Hn = (e, t, n) => {
	let r = e._$AA.parentNode, i = t === void 0 ? e._$AB : t._$AA;
	if (n === void 0) n = new Rn(r.insertBefore(Vn(), i), r.insertBefore(Vn(), i), e, e.options);
	else {
		let t = n._$AB.nextSibling, a = n._$AM, o = a !== e;
		if (o) {
			let t;
			n._$AQ?.(e), n._$AM = e, n._$AP !== void 0 && (t = e._$AU) !== a._$AU && n._$AP(t);
		}
		if (t !== i || o) {
			let e = n._$AA;
			for (; e !== t;) {
				let t = zn(e).nextSibling;
				zn(r).insertBefore(e, i), e = t;
			}
		}
	}
	return n;
}, Un = (e, t, n = e) => (e._$AI(t, n), e), Wn = {}, Gn = (e, t = Wn) => e._$AH = t, Kn = (e) => e._$AH, qn = (e) => {
	e._$AR(), e._$AA.remove();
}, Jn = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, Yn = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), Xn = class {
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
}, Zn = (e, t) => {
	let n = e._$AN;
	if (n === void 0) return !1;
	for (let e of n) e._$AO?.(t, !1), Zn(e, t);
	return !0;
}, Qn = (e) => {
	let t, n;
	do {
		if ((t = e._$AM) === void 0) break;
		n = t._$AN, n.delete(e), e = t;
	} while (n?.size === 0);
}, $n = (e) => {
	for (let t; t = e._$AM; e = t) {
		let n = t._$AN;
		if (n === void 0) t._$AN = n = /* @__PURE__ */ new Set();
		else if (n.has(e)) break;
		n.add(e), nr(t);
	}
};
function er(e) {
	this._$AN === void 0 ? this._$AM = e : (Qn(this), this._$AM = e, $n(this));
}
function tr(e, t = !1, n = 0) {
	let r = this._$AH, i = this._$AN;
	if (i !== void 0 && i.size !== 0) {
		if (t) {
			if (Array.isArray(r)) for (let e = n; e < r.length; e++) Zn(r[e], !1), Qn(r[e]);
			else r != null && (Zn(r, !1), Qn(r));
		} else Zn(this, e);
	}
}
var nr = (e) => {
	e.type == Jn.CHILD && (e._$AP ??= tr, e._$AQ ??= er);
}, rr = class extends Xn {
	constructor() {
		super(...arguments), this._$AN = void 0;
	}
	_$AT(e, t, n) {
		super._$AT(e, t, n), $n(this), this.isConnected = e._$AU;
	}
	_$AO(e, t = !0) {
		e !== this.isConnected && (this.isConnected = e, e ? this.reconnected?.() : this.disconnected?.()), t && (Zn(this, e), Qn(this));
	}
	setValue(e) {
		if (Bn(this._$Ct)) this._$Ct._$AI(e, this);
		else {
			let t = [...this._$Ct._$AH];
			t[this._$Ci] = e, this._$Ct._$AI(t, this, 0);
		}
	}
	disconnected() {}
	reconnected() {}
}, ir = /* @__PURE__ */ new WeakMap(), ar = Yn(class extends rr {
	render(e) {
		return E;
	}
	update(e, [t]) {
		let n = t !== this.G;
		return n && this.rt(void 0), (n || this.lt !== this.ct) && (this.G = t, this.ht = e.options?.host, this.rt(this.ct = e.element)), E;
	}
	rt(e) {
		if (this.G !== void 0) {
			if (this.isConnected || (e = void 0), typeof this.G == "function") {
				let t = this.ht ?? globalThis, n = ir.get(t);
				n === void 0 && (n = /* @__PURE__ */ new WeakMap(), ir.set(t, n)), n.get(this.G) !== void 0 && this.G.call(this.ht, void 0), n.set(this.G, e), e !== void 0 && this.G.call(this.ht, e);
			} else this.G.value = e;
		}
	}
	get lt() {
		return typeof this.G == "function" ? ir.get(this.ht ?? globalThis)?.get(this.G) : this.G?.value;
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
function or(e) {
	e instanceof HTMLElement && requestAnimationFrame(() => {
		let t = e.parentElement;
		if (!t || t.scrollWidth <= t.clientWidth) return;
		let n = e.offsetLeft;
		(n < t.scrollLeft || n + e.offsetWidth > t.scrollLeft + t.clientWidth) && (t.scrollLeft = n - (t.clientWidth - e.offsetWidth) / 2);
	});
}
function sr() {}
var cr = /* @__PURE__ */ new WeakSet();
function lr(e) {
	if (!(e instanceof HTMLElement)) return;
	let t = () => {
		let t = [];
		e.scrollLeft > 4 && t.push("left"), e.scrollLeft + e.clientWidth < e.scrollWidth - 4 && t.push("right"), e.dataset.more = t.join(" ");
	};
	cr.has(e) || (cr.add(e), e.addEventListener("scroll", t, { passive: !0 }), new ResizeObserver(t).observe(e)), requestAnimationFrame(() => requestAnimationFrame(t));
}
function ur(e, t, n, r, i) {
	return x`<nav class="section-chips" aria-label=${e("nav.sections")} ${ar(lr)}>
    ${r.map((e) => {
		let r = e.id === i, a = {
			tab: n,
			section: e.id
		};
		return x`<a
        class="section-chip ${r ? "on" : ""}"
        href=${T(t, a)}
        aria-current=${r ? "page" : "false"}
        @click=${w(a)}
        ${ar(r ? or : sr)}
      >
        <ha-icon icon=${e.icon}></ha-icon>
        <span>${e.label}</span>
        ${e.count ? x`<span class="section-count">${e.count}</span>` : E}
        ${e.problem ? x`<i class="section-problem" aria-hidden="true"></i>` : E}
      </a>`;
	})}
  </nav>`;
}
//#endregion
//#region node_modules/lit-html/directives/keyed.js
var dr = Yn(class extends Xn {
	constructor() {
		super(...arguments), this.key = E;
	}
	render(e, t) {
		return this.key = e, t;
	}
	update(e, [t, n]) {
		return t !== this.key && (Gn(e), this.key = t), n;
	}
});
//#endregion
//#region src/pages/devices/device-actions.ts
async function fr(e, t, n) {
	return await M(e, {
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
		answers: { ignored: j(t, `battery:${n.id}`, !1) }
	}, "read") ? n.id : null;
}
async function pr(e, t, n, r) {
	let i = (await N(e, {
		heading: t("pick.battery.title"),
		tip: "pick_battery",
		filter: "soc",
		selected: [],
		exclude: r.batteries.map((e) => e.soc_entity)
	}))?.selected[0];
	if (!i) return null;
	let a = n.entities?.[i]?.device_id, o = a && !r.batteries.some((e) => e.id === a) ? a : i;
	return await M(e, { batteries: { [o]: {
		name: a && (n.devices?.[a]?.name_by_user || n.devices?.[a]?.name) || O(n, i),
		adapter: "none",
		soc_entity: i,
		device_id: a ?? null,
		priority: Math.min(r.batteries.length + 1, 9)
	} } }) ? o : null;
}
function mr(e, t, n) {
	return M(e, { answers: { ignored: j(t, n, !0) } });
}
//#endregion
//#region src/components/ha-open.ts
function hr(e, t, n) {
	return {
		deviceId: t ? e?.entities?.[t]?.device_id ?? null : null,
		entityId: t ?? null,
		name: n
	};
}
function H(e, t) {
	let { deviceId: n, entityId: r, name: i } = t;
	if (n) {
		let t = `/config/devices/device/${n}`, r = e("ha.open.device", { name: i });
		return x`<a
      class="ha-open"
      data-notip
      href=${t}
      title=${r}
      aria-label=${r}
      @click=${(e) => {
			e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0 || (e.preventDefault(), _(t));
		}}
      ><ha-icon icon="mdi:open-in-new"></ha-icon
    ></a>`;
	}
	if (r) {
		let t = e("ha.open.entity", { name: i });
		return x`<button
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
	return E;
}
//#endregion
//#region src/components/device-card.ts
function gr(e, t, n) {
	return x`<article class="dcard ${n.problem ? "problem" : ""}">
    <a class="dcard-main" href=${T(t, n.to)} @click=${w(n.to, n.sheet ? { sheet: !0 } : void 0)}>
      <ha-icon icon=${n.icon}></ha-icon>
      <span class="dcard-text">
        <span class="dcard-name"
          >${n.name}${n.problem ? x`<i class="dcard-dot" aria-hidden="true"></i>` : E}</span
        >
        ${n.area ? x`<span class="dcard-area">${n.area}</span>` : E}
        ${n.state ? x`<span class="dcard-state">${n.state}</span>` : E}
        ${n.problem ? x`<span class="dcard-problem">${n.problem}</span>` : E}
        ${n.role ? x`<span class="dcard-meta"><span class="chip">${e(`devices.role.${n.role}`)}</span></span>` : E}
      </span>
    </a>
    ${H(e, n.ha)}
    ${n.quick ? x`<div class="dcard-quick">${n.quick}</div>` : E}
  </article>`;
}
function _r(e, t) {
	return t === null ? void 0 : e("devices.card.kw", { value: r(e.lang, t, t >= 10 ? 1 : 2) });
}
function vr(t, n, i, a) {
	if (!n) return;
	if (a.unassigned) return t(a.deviceId ? "devices.card.unassigned" : "devices.card.unassigned_kind");
	if (a.setup) return t(a.setup === "car" ? "devices.card.setup_car" : "devices.card.setup_hot_water");
	if (a.battery) {
		let i = e(n, a.battery.soc_entity), o = de(n, a.battery.power), s = [i === null ? null : `${r(t.lang, i, 0)} %`];
		return o !== null && s.push(Math.abs(o) < .05 ? t("devices.power.idle") : t(o > 0 ? "devices.power.charge" : "devices.power.discharge", { value: r(t.lang, Math.abs(o), 2) })), s.filter(Boolean).join(" · ") || void 0;
	}
	if (a.group === "climate") {
		let e = a.entityId ? n.states[a.entityId]?.attributes : void 0, i = a.climate?.current_temperature ?? (typeof e?.current_temperature == "number" ? e.current_temperature : null), o = a.climate?.temperature ?? (typeof e?.temperature == "number" ? e.temperature : null);
		return i !== null && o !== null ? t("devices.card.climate", {
			current: r(t.lang, i, 1),
			target: r(t.lang, o, 1)
		}) : i === null ? void 0 : t("devices.card.temp", { value: r(t.lang, i, 1) });
	}
	if (a.part) {
		let e = i?.config.measurements;
		if (a.part === "connection") {
			let i = de(n, e?.grid_power);
			if (i === null) return;
			let a = r(t.lang, Math.abs(i), 2);
			return t(i >= 0 ? "devices.card.import" : "devices.card.export", { value: a });
		}
		return _r(t, a.part === "solar" ? ue(n, e?.solar_power ?? []) : de(n, e?.home_power));
	}
	let o = a.action;
	if (o && i?.control?.actions?.[o.id]?.on) return t("devices.card.running");
	if (a.group === "car" && o?.need) {
		let i = e(n, o.need.soc_entity), a = e(n, o.need.range_entity);
		return [i === null ? null : `${r(t.lang, i, 0)} %`, a === null ? null : `${r(t.lang, a, 0)} km`].filter(Boolean).join(" · ") || void 0;
	}
	if (a.group === "hot_water" && o?.sensor_entity) {
		let i = e(n, o.sensor_entity);
		return i === null ? void 0 : t("devices.card.temp", { value: r(t.lang, i, 0) });
	}
	let s = a.consumer?.power_entity ?? o?.power_entity;
	if (s) {
		let r = n.states[s]?.attributes.unit_of_measurement, i = e(n, s);
		return _r(t, i === null ? null : r === "W" ? i / 1e3 : i);
	}
	return a.noMeter ? t("devices.no_meter_group") : void 0;
}
function yr(e, t, n, r, i = {}) {
	return {
		name: r.name,
		area: r.area,
		icon: r.icon,
		state: vr(e, t, n, r),
		role: r.unassigned || r.setup ? void 0 : r.role,
		problem: r.problem,
		to: r.setup ? Ye(r.setup, r.id) : P(r),
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
var br = [
	"all",
	"battery",
	"climate",
	"car",
	"hot_water",
	"other",
	"joe"
];
function xr(e = [], t = []) {
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
function Sr(e, t) {
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
		let i = Je(e, r);
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
function Cr(e, t, n, r, i) {
	if (r === "climate") return n[i] ?? (t ? O(t, i) : i);
	if (r === "battery") return e?.batteries.find((e) => e.id === i)?.name ?? i;
	let a = i.startsWith("action-") ? i.slice(7) : i;
	return e?.actions.find((e) => e.id === a)?.name ?? e?.consumers.find((e) => e.id === i)?.name ?? i;
}
function wr(e, t, n, i) {
	let a = {
		battery: t?.batteries.find((e) => e.id === n.battery)?.name ?? t?.actions.find((e) => `action:${e.id}` === n.battery)?.name ?? n.battery ?? "",
		entity: n.entity ? i ? O(i, n.entity) : n.entity : "",
		value: n.value == null ? "–" : String(n.value),
		target: String(n.target ?? ""),
		power: typeof n.power == "number" ? r(e.lang, n.power, 1) : "–",
		soc: typeof n.soc == "number" ? r(e.lang, n.soc, 0) : "–",
		unit: typeof n.unit == "string" ? n.unit : "%"
	};
	return n.kind === "boost_end" ? e.optional(`log.boost_end.${String(n.reason)}`, a) ?? e("log.boost_end.stopped", a) : n.kind === "answer" ? e(n.yes ? "log.answer.yes" : "log.answer.no") : n.kind === "test" ? e(n.ok ? "log.test.ok" : "log.test.failed", a) : e.optional(`log.${n.kind}`, a) ?? n.kind;
}
function Tr(e, t, n, r) {
	let i = n[t.entity] ?? (r ? O(r, t.entity) : t.entity);
	return x`<b>${i}</b> · ${e.optional(`climate.log.${t.what}`) ?? t.what}`;
}
function Er(e, t, n) {
	if (!n || !n.group || n.group === "all") return !0;
	let r = Sr(e, t);
	return r.group === n.group && (!n.device || r.device === n.device);
}
var Dr = class extends u {
	constructor(...e) {
		super(...e), this.names = {}, this.entries = [], this.limit = Infinity;
	}
	static {
		this.styles = [p, g`
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
		if (!e) return E;
		let t = this.entries.filter((e) => Er(this.config, e, this.filter)).slice(0, this.limit);
		return t.length ? x`<ul class="log">
      ${t.map((t) => x`<li>
          <time datetime=${t.at}>${B(e.lang, t.at.slice(0, 10), "short")} ${t.at.slice(11, 16)}</time>
          <span
            >${t.area === "climate" ? Tr(e, t, this.names, this.hass) : wr(e, this.config, t, this.hass)}</span
          >
        </li>`)}
    </ul>` : x`<p class="empty">${this.empty ?? e("past.log.empty")}</p>`;
	}
};
f([o({ attribute: !1 })], Dr.prototype, "t", void 0), f([o({ attribute: !1 })], Dr.prototype, "hass", void 0), f([o({ attribute: !1 })], Dr.prototype, "config", void 0), f([o({ attribute: !1 })], Dr.prototype, "names", void 0), f([o({ attribute: !1 })], Dr.prototype, "entries", void 0), f([o({ attribute: !1 })], Dr.prototype, "limit", void 0), f([o({ attribute: !1 })], Dr.prototype, "filter", void 0), f([o({ attribute: !1 })], Dr.prototype, "empty", void 0), h("joe-log-list", Dr);
//#endregion
//#region src/pages/devices/device-frame.ts
var Or = [
	"now",
	"steer",
	"power",
	"learned",
	"log",
	"intruders",
	"remove"
];
function kr(e) {
	return e != null && e !== E && e !== "";
}
function Ar(e, t, n) {
	let r = {
		tab: "devices",
		section: n
	};
	return x`<a class="back-link" href=${T(t, r)} @click=${w(r)}
    >${e("nav.back", { name: e(`nav.devices.${n}`) })}</a
  >`;
}
function jr(e) {
	return x`<div class="note warn" role="status">
    <ha-icon icon="mdi:help-circle-outline"></ha-icon><span>${e("nav.not_found")}</span>
  </div>`;
}
function Mr(e) {
	return xr(e?.control?.log ?? [], e?.climate?.log ?? []);
}
function Nr(e, t) {
	let n = t.group === "grid" ? "joe" : t.group, r = vr(e.t, e.hass, e.state, t), i = !!(t.setup || t.unassigned || t.noMeter);
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
			entries: Mr(e.state),
			filter: {
				group: n,
				device: t.id
			}
		}
	};
}
var Pr = {
	battery: "learn_battery",
	car: "learn_car",
	hot_water: "learn_hot_water",
	devices: "learn_groups",
	climate: "learn_climate"
};
function Fr(e, t, n, r) {
	let { t: i } = e, a = t.tips?.[n] ?? (n === "learned" && t.learnedArea ? Pr[t.learnedArea] : void 0);
	return x`<section class="card dsec" data-section=${n} ?data-tipped=${!!a}>
    <h3 class="dsec-title">${n === "remove" && t.removeTitle ? t.removeTitle : i(`devices.page.${n}`)}${a ? v(i, a) : E}</h3>
    ${r}
  </section>`;
}
function Ir(e, t) {
	let n = t.log;
	if (!n || !n.entries.some((t) => Er(e.state?.config, t, n.filter))) return;
	let r = n.filter, i = {
		tab: "review",
		section: "log",
		id: r.group ?? "all",
		sub: r.group && r.group !== "all" ? r.device : void 0
	};
	return x`<joe-log-list
      .t=${e.t}
      .hass=${e.hass}
      .config=${e.state?.config}
      .names=${n.names ?? {}}
      .entries=${n.entries}
      .filter=${r}
      .limit=${n.limit ?? 5}
    ></joe-log-list>
    <a class="mini-btn quiet frame-more" href=${T(e.prefix, i)} @click=${w(i)}>${e.t("devices.page.more_log")}</a>`;
}
function Lr(e, t) {
	let { t: n, prefix: r } = e, i = {};
	for (let a of Or) {
		if (a === "log") {
			let n = Ir(e, t);
			n && (i.log = n);
			continue;
		}
		let o = t[a];
		if (!kr(o)) continue;
		let s = {
			tab: "review",
			section: "learned",
			id: t.learnedArea
		};
		i[a] = a === "learned" && t.learnedArea ? x`${o}
            <a class="mini-btn quiet frame-more" href=${T(r, s)} @click=${w(s)}>${n("devices.page.more_learned")}</a>` : o;
	}
	return x`<div class="dframe">
    ${Ar(n, r, t.group)}
    <header class="card dhead">
      <div class="dhead-top">
        <ha-icon class="dhead-icon" icon=${t.icon ?? Ue[t.group]}></ha-icon>
        <div class="dhead-text">
          <h2 class="dhead-name">${t.name}</h2>
          ${t.area ? x`<span class="dhead-area">${t.area}</span>` : E}
        </div>
        ${t.ha ? H(n, t.ha) : E}
      </div>
      ${kr(t.live) ? x`<p class="dhead-live">${t.live}</p>` : E}
      ${kr(t.why) ? x`<p class="dhead-why">${t.why}</p>` : E}
      ${(t.problems ?? []).map((e) => x`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e}</span></div>`)}
      ${kr(t.head) ? t.head : E}
    </header>
    ${Or.map((n) => i[n] === void 0 ? E : Fr(e, t, n, i[n]))}
  </div>`;
}
function Rr(e, t, n, r) {
	let i = t.filter((e) => e.group === n);
	return x`<div class="dcards">
    ${i.map((t) => gr(e.t, e.prefix, yr(e.t, e.hass, e.state, t, r?.(t))))}
  </div>`;
}
function zr(e, t, n, r = !0) {
	return x`<div class="group-intro">
    ${d(t)} ${y}
    <p class="lead">${n}</p>
    ${r ? x`<p class="ha-hint with-tip" data-tipped>${e("climate.ha_open")} ${v(e, "ha_open")}</p>` : E}
  </div>`;
}
function Br(e, t, n, r) {
	let i = Ye(n);
	return x`<a class="btn btn-secondary add-link" href=${T(t, i)} @click=${w(i, { sheet: !0 })}
    ><ha-icon icon="mdi:plus"></ha-icon>${r ?? e("devices.add")}</a
  >`;
}
var U = g`
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
`, W = class extends u {
	constructor(...e) {
		super(...e), this.prefix = D, this.checks = [], this.devices = [];
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
f([o({ attribute: !1 })], W.prototype, "hass", void 0), f([o({ attribute: !1 })], W.prototype, "t", void 0), f([o({ attribute: !1 })], W.prototype, "state", void 0), f([o({ attribute: !1 })], W.prototype, "route", void 0), f([o({ attribute: !1 })], W.prototype, "prefix", void 0), f([o({ attribute: !1 })], W.prototype, "discovery", void 0), f([o({ attribute: !1 })], W.prototype, "info", void 0), f([o({ attribute: !1 })], W.prototype, "checks", void 0), f([o({ attribute: !1 })], W.prototype, "climateFound", void 0), f([o({ attribute: !1 })], W.prototype, "devices", void 0);
var Vr = class extends W {
	constructor(...e) {
		super(...e), this.group = "other";
	}
	static {
		this.styles = [
			p,
			U,
			g`
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
		if (!e || !this.state) return E;
		let t = it(this.devices, this.group, this.device);
		return t ? Lr(this.ctx, Nr(this.ctx, t)) : x`<div class="wrap">
      ${d(e(`nav.devices.${this.group}`))} ${this.device === void 0 ? E : jr(e)}
      ${Rr(this.ctx, this.devices, this.group)}
      ${this.group === "grid" ? E : x`<div class="actions">${Br(e, this.prefix)}</div>`}
    </div>`;
	}
};
f([o({ attribute: !1 })], Vr.prototype, "device", void 0), f([o({ attribute: !1 })], Vr.prototype, "sub", void 0);
//#endregion
//#region src/pages/devices/add.ts
var Hr = [
	{
		kind: "battery",
		icon: "mdi:home-battery-outline"
	},
	{
		kind: "car",
		icon: "mdi:car-electric"
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
], Ur = {
	car: "ev",
	hot_water: "hot_water",
	night: "custom"
}, Wr = {
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
}, Gr = class extends W {
	constructor(...e) {
		super(...e), this.behind = {
			tab: "devices",
			section: "all"
		}, this.busy = "";
	}
	static {
		this.styles = [p, g`
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
    `];
	}
	updated(e) {
		let t = this.kind ? Wr[this.kind] : void 0;
		e.has("kind") && t && C(this, t, { replace: !0 });
	}
	render() {
		let e = this.t;
		return !e || !this.state || this.kind && Wr[this.kind] ? E : x`<joe-sheet
      label=${e("devices.add.label")}
      closeLabel=${e("common.close")}
      @joe-close=${this.onClose}
      @joe-config=${this.onConfig}
    >
      ${this.kind === "battery" ? this.renderBattery(e) : this.kind && this.kind in Ur ? this.renderAction(e, this.kind) : this.renderChoices(e)}
    </joe-sheet>`;
	}
	renderChoices(e) {
		return x`<div data-tipped>
      <div class="sheet-title">${d(e("devices.add.title"), "h2", v(e, "devices_add"))}</div>
      <p class="lead">${e("devices.add.lead")}</p>
      <ul class="choices">
        ${Hr.map(({ kind: t, icon: n }) => {
			let r = t in Wr ? Wr[t] : Ye(t, this.consumer), i = t in Wr ? { replace: !0 } : {
				replace: !0,
				sheet: !0
			};
			return x`<li>
            <a class="choice" href=${T(this.prefix, r)} @click=${w(r, i)}>
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
		let t = Ye();
		return x`<a class="back-link" href=${T(this.prefix, t)} @click=${w(t, {
			replace: !0,
			sheet: !0
		})}
      >${e("nav.back", { name: e("devices.add.other") })}</a
    >`;
	}
	renderBattery(e) {
		let t = this.state.config, n = st(t, this.discovery).filter((e) => e.kind === "battery" && e.battery), r = ct(t, this.discovery), i = (t, n, r) => x`<li>
        <span class="what">
          <b>${t.name}</b>
          <small>${e(n ? "devices.add.battery.ignored" : "devices.found.battery")}</small>
        </span>
        <span class="row-actions">
          <button type="button" class="mini-btn go" ?disabled=${!!this.busy} @click=${() => this.useFound(t, r)}>
            ${e(n ? "devices.add.battery.use" : "devices.found.use")}
          </button>
          ${n ? E : x`<button
                type="button"
                class="mini-btn quiet"
                ?disabled=${!!this.busy}
                @click=${() => this.ignore(r)}
              >
                ${e("devices.found.ignore")}
              </button>`}
        </span>
      </li>`;
		return x`${this.backToChoices(e)}
      <div data-tipped>
        <div class="sheet-title">${d(e("devices.add.battery.title"), "h2", v(e, "devices_found"))}</div>
        <p class="lead">${e("devices.add.battery.lead")}</p>
        ${n.length || r.length ? x`<ul class="found">
              ${n.map((e) => i(e.battery, !1, e.key))}
              ${r.map((e) => i(e, !0, `battery:${e.id}`))}
            </ul>` : x`<p class="empty">${e("devices.add.battery.none")}</p>`}
      </div>
      <div class="actions" data-tipped>
        <button type="button" class="btn btn-secondary" ?disabled=${!!this.busy} @click=${this.pick}>
          <ha-icon icon="mdi:magnify"></ha-icon>${e("devices.add.battery.pick")}
        </button>
        ${v(e, "review_battery_add")}
      </div>`;
	}
	renderAction(e, t) {
		let n = this.state, r = this.consumer ?? "", i = /^(wallbox|car):/.test(r) ? r : "", a = (i ? void 0 : n.config.consumers.find((e) => e.id === r))?.name ?? (i ? st(n.config, this.discovery).find((e) => e.key === i)?.name : void 0);
		return x`${this.backToChoices(e)}
      ${dr(`${t}:${this.consumer ?? ""}`, x`<joe-action-editor
          .hass=${this.hass}
          .mailboxes=${n.mailbox}
          .accounts=${n.accounts}
          .apps=${n.apps}
          .t=${e}
          .config=${n.config}
          .discovery=${this.discovery}
          actionId=${`new:${Ur[t]}`}
          section=${t === "car" ? "need" : ""}
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
			let n = e.action, r = Je({
				...t,
				actions: [...t.actions.filter((e) => e.id !== n.id), n]
			}, n);
			C(this, {
				tab: "devices",
				section: r.group,
				id: r.id
			}, { replace: !0 });
			return;
		}
		ge(this, this.behind);
	}
	async useFound(e, t) {
		this.busy = t;
		let n = await fr(this, this.state.config, e);
		this.busy = "", n && C(this, {
			tab: "devices",
			section: "battery",
			id: n
		}, { replace: !0 });
	}
	async ignore(e) {
		this.busy = e, await mr(this, this.state.config, e), this.busy = "";
	}
	async pick() {
		if (!this.hass) return;
		this.busy = "pick";
		let e = await pr(this, this.t, this.hass, this.state.config);
		this.busy = "", e && C(this, {
			tab: "devices",
			section: "battery",
			id: e
		}, { replace: !0 });
	}
	rediscover() {
		this.dispatchEvent(new CustomEvent("joe-rediscover", {
			bubbles: !0,
			composed: !0
		})), C(this, {
			tab: "devices",
			section: "all"
		}, { replace: !0 });
	}
};
f([o({ attribute: !1 })], Gr.prototype, "kind", void 0), f([o({ attribute: !1 })], Gr.prototype, "consumer", void 0), f([o({ attribute: !1 })], Gr.prototype, "behind", void 0), f([b()], Gr.prototype, "busy", void 0), h("joe-device-add", Gr);
//#endregion
//#region src/components/control-status.ts
function Kr(e, t) {
	let n = t.plan, r = t.control?.reason ?? "off";
	return r === "waiting" && n?.window ? e("devices.status.waiting", { time: S(n.window.start) }) : r === "day" ? e("devices.status.day", { time: n?.day ? S(n.day.defer_until) : "–" }) : e(`devices.status.${r}`);
}
var qr = class extends u {
	constructor(...e) {
		super(...e), this.compact = !1, this.notice = "";
	}
	static {
		this.styles = [p, g`
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
		if (!e || !t || !n) return E;
		let r = n.steering || n.pending;
		if (this.compact) return r || this.notice ? x`<section class="card status" ?data-tipped=${r}>${this.renderRelease(e, n.pending, r)}</section>` : E;
		let i = Kr(e, t), a = t.mode === "simulation" ? x`<span class="pill-sim">${e("mode.simulation")}</span>` : x`<span class="chip ${t.mode === "live" ? "ok" : t.mode === "advisory" ? "learned" : ""}"
            >${e(`mode.${t.mode}`)}</span
          >`;
		return x`<section class="card status" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:pulse"></ha-icon>${e("devices.now")}</div>
        ${a} ${v(e, "plan_steer")}
      </div>
      <p class="status-text">${i}</p>
      ${this.renderRelease(e, n.pending, r)}
    </section>`;
	}
	renderRelease(e, t, n) {
		return x`${t ? x`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("devices.pending")}</span></div>` : E}
      ${n ? x`<div class="actions">
            <button type="button" class="btn btn-danger" @click=${this.release}>
              <ha-icon icon="mdi:hand-back-left-outline"></ha-icon>${e("devices.release")}
            </button>
            ${v(e, "devices_release")}
          </div>` : E}
      ${this.notice ? x`<div class="note" role="status"><ha-icon icon="mdi:check"></ha-icon>${this.notice}</div>` : E}`;
	}
	async release() {
		try {
			await this.hass?.callWS({ type: "energy_joe/control/release" });
		} catch {
			this.notice = this.t("error.action");
		}
	}
};
f([o({ attribute: !1 })], qr.prototype, "hass", void 0), f([o({ attribute: !1 })], qr.prototype, "t", void 0), f([o({ attribute: !1 })], qr.prototype, "state", void 0), f([o({
	type: Boolean,
	reflect: !0
})], qr.prototype, "compact", void 0), f([b()], qr.prototype, "notice", void 0), h("joe-control-status", qr);
//#endregion
//#region src/pages/devices/all.ts
var Jr = {
	battery: "mdi:home-battery-outline",
	wallbox: "mdi:ev-station",
	car: "mdi:car-electric"
}, Yr = class extends W {
	constructor(...e) {
		super(...e), this.busy = "";
	}
	static {
		this.styles = [
			p,
			U,
			g`
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
		if (!e || !t) return E;
		let n = this.devices, r = rt(n), i = n.filter((e) => e.unassigned);
		return x`<div class="wrap">
      <div class="intro">
        <div>
          ${d(e("devices.page.title"))} ${y}
          <div class="lead-row" data-tipped>
            <p class="lead">${e("devices.lead")}</p>
            ${v(e, "ha_open")}
          </div>
        </div>
        <joe-pose name="switch"></joe-pose>
      </div>
      <joe-control-status .t=${e} .hass=${this.hass} .state=${t}></joe-control-status>
      <div class="actions toolbar" data-tipped>${Br(e, this.prefix)} ${v(e, "devices_add")}</div>
      ${this.renderFound(e)}
      ${He.filter((e) => r.includes(e)).map((t) => this.renderGroup(e, t, n))}
      ${i.length ? x`<div class="group-head">
              <span class="group-label">${e("devices.unassigned")}</span><i class="dcard-dot" aria-hidden="true"></i>
            </div>
            <p class="unassigned-text">${e("devices.unassigned.text")}</p>
            <div class="dcards">
              ${i.map((n) => gr(e, this.prefix, yr(e, this.hass, t, n)))}
            </div>` : E}
    </div>`;
	}
	renderGroup(e, t, n) {
		let r = n.filter((e) => e.group === t && !e.unassigned);
		if (!r.length) return E;
		let i = {
			tab: "devices",
			section: t
		};
		return x`<div class="group-head">
        <ha-icon icon=${Ue[t]}></ha-icon>
        <span class="group-label">${e(`nav.devices.${t}`)}</span>
        ${at(n.filter((e) => !e.unassigned), t) ? x`<i class="dcard-dot" aria-hidden="true"></i>` : E}
        <a class="mini-btn quiet group-go" href=${T(this.prefix, i)} @click=${w(i)}>${e("devices.group.go")}</a>
      </div>
      <div class="dcards">
        ${r.map((t) => gr(e, this.prefix, yr(e, this.hass, this.state, t)))}
      </div>`;
	}
	renderFound(e) {
		let t = st(this.state.config, this.discovery);
		return t.length ? x`<section class="card found" data-tipped>
      <div class="found-head">
        <div class="eyebrow"><ha-icon icon="mdi:new-box"></ha-icon>${e("devices.found")}</div>
        ${v(e, "devices_found")}
      </div>
      <p class="found-lead">${e("devices.found.lead")}</p>
      <ul>
        ${t.map((t) => x`<li>
            <span class="what">
              <ha-icon icon=${Jr[t.kind]}></ha-icon>
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
    </section>` : E;
	}
	async use(e) {
		if (e.kind !== "battery" || !e.battery) {
			C(this, Ye("car", e.key), { sheet: !0 });
			return;
		}
		this.busy = e.key;
		let t = await fr(this, this.state.config, e.battery);
		this.busy = "", t && C(this, {
			tab: "devices",
			section: "battery",
			id: t
		});
	}
	async ignore(e) {
		this.busy = e.key, await mr(this, this.state.config, e.key), this.busy = "";
	}
};
f([b()], Yr.prototype, "busy", void 0), h("joe-devices-all", Yr);
//#endregion
//#region src/components/battery-automations.ts
async function Xr(e) {
	try {
		return await e?.callWS({ type: "energy_joe/automations" }) ?? [];
	} catch {
		return [];
	}
}
function Zr(e, t) {
	return e.filter((e) => e.writes.some((e) => e.battery_id === t));
}
var G = class extends u {
	constructor(...e) {
		super(...e), this.batteries = "", this.mode = "", this.ready = {}, this.batteryId = "", this.bare = !1, this.items = null, this.loaded = [], this.busy = !1, this.failed = !1;
	}
	static {
		this.styles = [p, g`
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
		this.loaded = await Xr(this.hass);
	}
	get shown() {
		let e = this.items ?? this.loaded;
		return this.batteryId ? Zr(e, this.batteryId) : e;
	}
	on(e) {
		let t = this.hass?.states[e.entity_id];
		return t ? t.state === "on" : e.on;
	}
	render() {
		let e = this.t, t = this.shown;
		if (!e || !t.length) return E;
		let n = t.filter((e) => this.on(e)), r = t.filter((e) => e.switched_off && !this.on(e)), i = (this.mode === "advisory" || this.mode === "live") && n.some((e) => e.writes.some((e) => (!this.batteryId || e.battery_id === this.batteryId) && this.ready[e.battery_id] === "ready")), a = x`<p class="now">
        ${e(n.length ? i ? "automations.lead" : "automations.lead_idle" : "automations.lead_off")}
      </p>
      <ul>
        ${t.map((t) => {
			let n = this.on(t), r = [...new Set(t.writes.map((e) => e.battery))].join(", ");
			return x`<li>
            <div class="row">
              <b>${t.name}</b>
              ${t.writes.some((e) => e.joe) ? x`<span class="chip">${e("automations.levers")}</span>` : E}
              <span class="chip ${n ? "warn" : "ok"}">${e(n ? "automations.on" : "automations.off")}</span>
            </div>
            ${t.writes.length ? x`<small>${e("automations.writes", {
				what: t.writes.map((e) => e.name).join(", "),
				batteries: r
			})}</small>` : x`<small>${e("automations.not_battery")}</small>`}
            ${t.switched_off && !n ? x`<small>
                  ${e("automations.switched_off", {
				day: B(e.lang, t.switched_off.at, "short"),
				time: t.switched_off.at.slice(11, 16)
			})}
                </small>` : E}
          </li>`;
		})}
      </ul>
      <div class="actions">
        ${n.length ? x`<button type="button" class="mini-btn ${i ? "go" : ""}" ?disabled=${this.busy} @click=${() => this.switch(!1)}>
              <ha-icon icon="mdi:pause-circle-outline"></ha-icon>${e("automations.all_off", { count: n.length })}
            </button>` : E}
        ${r.length ? x`<button type="button" class="mini-btn" ?disabled=${this.busy} @click=${() => this.switch(!0)}>
              <ha-icon icon="mdi:play-circle-outline"></ha-icon>${e("automations.back_on", { count: r.length })}
            </button>` : E}
      </div>
      ${this.failed ? x`<p class="bad">${e("automations.failed")}</p>` : E}`;
		return this.bare ? a : x`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:robot-outline"></ha-icon>${e("automations.title")}</div>
        ${v(e, "battery_automations")}
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
f([o({ attribute: !1 })], G.prototype, "hass", void 0), f([o({ attribute: !1 })], G.prototype, "t", void 0), f([o()], G.prototype, "batteries", void 0), f([o()], G.prototype, "mode", void 0), f([o({ attribute: !1 })], G.prototype, "ready", void 0), f([o()], G.prototype, "batteryId", void 0), f([o({ type: Boolean })], G.prototype, "bare", void 0), f([o({ attribute: !1 })], G.prototype, "items", void 0), f([b()], G.prototype, "loaded", void 0), f([b()], G.prototype, "busy", void 0), f([b()], G.prototype, "failed", void 0), h("joe-battery-automations", G);
//#endregion
//#region src/components/mirror.ts
function K(e, n, r) {
	return x`<div class="mirror">
    <div class="mirror-text">
      <span class="mirror-label">${r.label}</span>
      <span class="mirror-sep" aria-hidden="true">·</span>
      <span class="mirror-value">${r.value}</span>
      ${r.source ? t(e, r.source) : E}
      ${r.hint ? x`<small class="mirror-hint">${r.hint}</small>` : E}
    </div>
    <a class="mini-btn go mirror-go" href=${T(n, r.to)} @click=${w(r.to)}
      >${e(r.action === "set" ? "mirror.set" : "mirror.change")}</a
    >
  </div>`;
}
//#endregion
//#region src/components/choice.ts
var Qr = "unknown", $r = class extends u {
	constructor(...e) {
		super(...e), this.options = [], this.value = [], this.multiple = !1, this.exclusive = [], this.idk = "", this.label = "", this.compact = !1;
	}
	static {
		this.styles = g`
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
		return x`<div class="opts" role="group" aria-label=${this.label}>
      ${this.options.map((e) => this.renderOption(e))}
      ${this.idk ? this.renderOption({
			value: Qr,
			label: this.idk
		}, "idk") : E}
    </div>`;
	}
	renderOption(e, t = "") {
		let n = this.value.includes(e.value);
		return x`<button
      type="button"
      class=${t}
      aria-pressed=${String(n)}
      ?disabled=${e.disabled}
      @click=${() => this.toggle(e.value)}
    >
      ${e.icon ? x`<ha-icon icon=${e.icon}></ha-icon>` : E}
      <span>${e.label}</span>
      ${n && this.multiple ? x`<span class="tick" aria-hidden="true"
            ><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12.5l4.5 4.5L19 7.5" /></svg
          ></span>` : E}
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
f([o({ attribute: !1 })], $r.prototype, "options", void 0), f([o({ attribute: !1 })], $r.prototype, "value", void 0), f([o({ type: Boolean })], $r.prototype, "multiple", void 0), f([o({ attribute: !1 })], $r.prototype, "exclusive", void 0), f([o()], $r.prototype, "idk", void 0), f([o()], $r.prototype, "label", void 0), f([o({
	type: Boolean,
	reflect: !0
})], $r.prototype, "compact", void 0), h("joe-choice", $r);
//#endregion
//#region src/rules-view.ts
var ei = {
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
}, ti = {
	battery: [
		"reserve_soc",
		"max_target_soc",
		"evening_min_soc",
		"balance_days",
		"discharge_in_window",
		"converter_losses"
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
	...ti.battery,
	...ti.grid,
	...ti.plan
];
var ni = [
	"until_target",
	"block",
	"free"
];
function ri(e) {
	return e in ei;
}
function ii(e, t) {
	return t.unit || e(`rule.${t.key}.unit`);
}
function ai(e, t) {
	return t == null ? "" : String(Math.round(t * (e.scale ?? 1) * 100) / 100);
}
function oi(e, t, n) {
	let i = t.rules;
	if (ri(n)) {
		let t = ei[n], a = i[n];
		if (a == null) return e("rule.off");
		let o = Math.round(a * (t.scale ?? 1) * 100) / 100, s = Number.isInteger(o) ? 0 : Number.isInteger(o * 10) ? 1 : 2;
		return `${r(e.lang, o, s)} ${ii(e, t)}`;
	}
	switch (n) {
		case "priority": return i.priority.map((t) => e(`rule.priority.${t}`)).join(" · ");
		case "discharge_in_window": return e(`rule.discharge.${i.discharge_in_window}`);
		default: return e(i[n] ? "rule.on" : "rule.off");
	}
}
function si(e, t, n, r, i) {
	if (ri(i)) return ci(e, t, n, r, ei[i]);
	switch (i) {
		case "guard_grid": return ui(e, t, n);
		case "converter_losses": return di(e, t, n);
		case "priority": return fi(e, t, n);
		case "discharge_in_window": return pi(e, t, n);
	}
}
function ci(e, n, r, i, a) {
	let o = i?.defaults?.rules[a.key], s = k(r, `rules.${a.key}`), c = s?.source === "user";
	return x`<div class="row" data-tipped data-anchor=${a.key}>
    <div>
      <div class="name"><b>${e(`rule.${a.key}`)}</b>${v(e, `r_${a.key}`)}</div>
      <small>${e(`rule.${a.key}.hint`)}</small>
    </div>
    <div class="control">
      ${t(e, s)}
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
          .value=${ai(a, r.rules[a.key])}
          @change=${(e) => li(n, a, e.target)}
        />
        <span class="unit">${ii(e, a)}</span>
      </span>
      ${c && o !== void 0 ? x`<button
            type="button"
            class="mini-btn quiet"
            @click=${() => M(n, { rules: { [a.key]: o } }, "default")}
          >
            <ha-icon icon="mdi:restore"></ha-icon>${e("rule.reset")}
          </button>` : E}
    </div>
  </div>`;
}
function li(e, t, n) {
	let r = n.value.trim(), i = t.scale ?? 1;
	if (r === "") {
		t.optional && M(e, { rules: { [t.key]: null } });
		return;
	}
	let a = Number.parseFloat(r);
	if (!Number.isFinite(a) || a < t.min || a > t.max) {
		n.reportValidity();
		return;
	}
	let o = t.integer ? Math.round(a) : Math.round(a / i * 1e4) / 1e4;
	M(e, { rules: { [t.key]: o } });
}
function ui(e, n, r) {
	let i = r.rules, a = i.grid_limit_w;
	return x`<div class="row" data-tipped data-anchor="guard_grid">
    <div>
      <div class="name"><b id="guard-grid">${e("rule.guard_grid")}</b>${v(e, "r_guard_grid")}</div>
      <small>${e(a ? "rule.guard_grid.hint" : "rule.guard_grid.no_limit")}</small>
    </div>
    <div class="control">
      ${t(e, k(r, "rules.guard_grid"))}
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${String(i.guard_grid)}
        aria-labelledby="guard-grid"
        ?disabled=${!a}
        @click=${() => M(n, { rules: { guard_grid: !i.guard_grid } })}
      ></button>
    </div>
  </div>`;
}
function di(e, n, r) {
	let i = r.rules;
	return x`<div class="row" data-tipped data-anchor="converter_losses">
    <div>
      <div class="name"><b id="converter-losses">${e("rule.converter_losses")}</b>${v(e, "r_converter_losses")}</div>
      <small>${e("rule.converter_losses.hint")}</small>
    </div>
    <div class="control">
      ${t(e, k(r, "rules.converter_losses"))}
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${String(i.converter_losses)}
        aria-labelledby="converter-losses"
        @click=${() => M(n, { rules: { converter_losses: !i.converter_losses } })}
      ></button>
    </div>
  </div>`;
}
function fi(e, n, r) {
	let i = r.rules.priority, a = (e, t) => {
		let r = [...i];
		[r[e], r[e + t]] = [r[e + t], r[e]], M(n, { rules: { priority: r } });
	}, o = (e) => x`<svg
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
	return x`<div class="row" data-tipped data-anchor="priority">
    <div>
      <div class="name"><b>${e("rule.priority")}</b>${v(e, "r_priority")}</div>
      <small>${e("rule.priority.hint")}</small>
    </div>
    <div class="control">
      ${t(e, k(r, "rules.priority"))}
      <div class="order">
        ${i.map((t, n) => x`<div>
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
function pi(e, n, r) {
	let i = r.rules;
	return x`<div class="row stacked" data-tipped data-anchor="discharge_in_window">
    <div>
      <div class="name">
        <b>${e("rule.discharge_in_window")}</b>${v(e, "r_discharge_in_window")}
        ${t(e, k(r, "rules.discharge_in_window"))}
      </div>
      <small>${e("rule.discharge_in_window.hint")}</small>
    </div>
    <div>
      <joe-choice
        compact
        label=${e("rule.discharge_in_window")}
        .options=${ni.map((t) => ({
		value: t,
		label: e(`rule.discharge.${t}`)
	}))}
        .value=${[i.discharge_in_window]}
        @joe-choice=${(e) => {
		e.detail.value[0] && M(n, { rules: { discharge_in_window: e.detail.value[0] } });
	}}
      ></joe-choice>
    </div>
  </div>`;
}
var mi = g`
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
function hi(e) {
	return x`<div class="rows">
    ${e.map((e) => x`<div class="row-item">
        <b>${e.name}</b>
        <span class="values">${e.values.map((e) => x`<span>${e}</span>`)}</span>
        ${e.note ? x`<small>${e.note}</small>` : E}
        ${e.extra ? x`<span class="row-extra">${e.extra}</span>` : E}
      </div>`)}
  </div>`;
}
var gi = g`
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
function _i(e, t, n, i, a) {
	let o = e.lang, s = n.battery_models?.[i.id], c = i.capacity_kwh, l = t.provenance[`batteries[${i.id}].capacity_kwh`]?.source === "user", u;
	return u = s ? l && c ? e("learn.battery.user", { value: z(o, c, 1) }) : c && (s.capacity_kwh / c < .5 || s.capacity_kwh / c > 1.15) ? e("learn.battery.odd", { value: z(o, c, 1) }) : c ? e("learn.battery.uses_nominal", { value: z(o, c, 1) }) : e("learn.battery.uses") : i.power ? e("learn.battery.learning", { need: a }) : e("learn.battery.no_power"), {
		name: i.name,
		values: s ? [
			e("learn.battery.capacity", { value: z(o, s.capacity_kwh, 1) }),
			e("learn.battery.efficiency", { value: r(o, s.efficiency * 100, 0) }),
			...s.converter ? [e("learn.battery.converter", { value: r(o, s.converter.factor * 100, 0) })] : []
		] : [e("learn.still")],
		note: u
	};
}
function vi(e, t, n) {
	let r = t.group_models?.[n.id];
	return {
		name: n.name,
		values: r ? [e("learn.groups.average", { value: z(e.lang, r.average, 1) }), r.heat >= .05 ? e("learn.groups.heat", { value: z(e.lang, r.heat, 2) }) : e("learn.groups.steady")] : [e("learn.still")]
	};
}
function yi(e, t, n) {
	let r = t.action_models?.[n.id];
	return {
		name: n.name,
		values: r ? [
			e("learn.hot_water.rate", { value: z(e.lang, r.rate_k_per_h, 1) }),
			e("learn.hot_water.loss", { value: z(e.lang, r.loss_k_per_h, 1) }),
			e("learn.hot_water.demand", { value: z(e.lang, r.demand_k, 0) })
		] : [e("learn.still")],
		note: r ? void 0 : e("learn.hot_water.learning")
	};
}
function bi(e, t, n) {
	let r = e.lang, i = t.car_models?.[n.id], a = [];
	return i?.consumption != null && (a.push(e("learn.car.consumption", { value: z(r, i.consumption, 1) })), i.cold && a.push(e("learn.car.cold", { value: z(r, i.cold, 2) }))), (i?.workday_km != null || i?.day_off_km != null) && a.push(e("learn.car.km", {
		workday: i.workday_km == null ? "–" : z(r, i.workday_km, 0),
		day_off: i.day_off_km == null ? "–" : z(r, i.day_off_km, 0)
	})), {
		name: n.name,
		values: a.length ? a : [e("learn.still")],
		note: a.length ? void 0 : e(n.need?.odometer_entity ? "learn.car.learning" : "learn.car.no_odometer")
	};
}
function xi(e) {
	return `${String(Math.floor(e / 60)).padStart(2, "0")}:${String(Math.round(e) % 60).padStart(2, "0")}`;
}
function Si(e, t, n, r) {
	let i = t.presence?.[n.id] ?? {}, a = Cn.filter((e) => i[e]).map((t) => e("learn.presence.value", {
		label: e(`label.${t}`),
		hours: z(e.lang, i[t].hours, 0)
	}));
	r != null && a.push(e("past.learned.presence.usual", { time: xi(r) }));
	let o;
	return n.person_entity ? n.calendars.length || (o = e("past.learned.presence.no_calendar")) : o = e("learn.presence.no_person"), {
		name: n.name,
		values: a.length ? a : [e("learn.still")],
		note: o
	};
}
function Ci(e, t) {
	return t ? e("climate.rate", { rate: r(e.lang, t, 1) }) : e("climate.rate_default");
}
function wi(e) {
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
function Ti(e, t) {
	let n = Math.max(1, Math.ceil(t.length / 7)), r = /* @__PURE__ */ new Map();
	return t.forEach((i, a) => {
		(t.length - 1 - a) % n == 0 && r.set(a, B(e, i, "short"));
	}), r;
}
//#endregion
//#region src/pages/devices/battery-device.ts
var Ei = [
	"hold",
	"charge",
	"release"
], Di = 14, Oi = [
	"adapter",
	"controls",
	"mode_options",
	"steps",
	"prepare"
], ki = /* @__PURE__ */ new Map();
function Ai(e) {
	return {
		...Mn(e),
		prepare: structuredClone(e.prepare)
	};
}
var ji = (e, t) => JSON.stringify(e ?? null) === JSON.stringify(t ?? null);
function Mi(e, t, n) {
	switch (t.adapter) {
		case "none": return e("devices.battery.watch");
		case "generic": return e("devices.battery.generic");
		case "steps": return e("devices.battery.steps");
		default: return e("devices.battery.profile", { name: n?.profiles?.[t.adapter] ?? t.adapter });
	}
}
function Ni(e, t, n) {
	if (t.adapter === "none") return e("devices.action.watch");
	let i = n?.batteries[t.id];
	return i?.action ? e(`devices.action.${i.action}`, {
		target: r(e.lang, i.target ?? 0, 0),
		floor: r(e.lang, i.floor ?? 0, 0),
		until: i.until ? S(i.until) : ""
	}) : e("devices.action.idle");
}
function Pi(e, t) {
	return e.adapter === "none" && !!t?.suggested?.complete;
}
function Fi(e) {
	return {
		tab: "devices",
		section: "battery",
		id: e,
		sub: "control"
	};
}
var Ii = class extends W {
	constructor(...e) {
		super(...e), this.confirm = !1, this.removing = !1, this.saving = !1, this.notice = "", this.automations = null, this.automationsFor = "";
	}
	static {
		this.styles = [
			p,
			U,
			gi,
			g`
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
		e.has("entry") && t !== this.automationsFor && (this.removing = !1, this.notice = ""), this.hass && t && t !== this.automationsFor && (this.automationsFor = t, this.automations = null, Xr(this.hass).then((e) => {
			this.automationsFor === t && (this.automations = e);
		}));
	}
	render() {
		let { t: e, entry: t } = this, n = this.state, r = this.battery;
		if (!e || !n || !t || !r) return E;
		let i = n.control, a = this.discovery?.batteries.find((e) => e.id === r.id), o = r.adapter !== "none", s = Zr(this.automations ?? [], r.id);
		return x`${Lr(this.ctx, {
			...Nr(this.ctx, t),
			why: Ni(e, r, i),
			head: this.renderHead(e, r, a),
			now: o ? this.renderTest(e, r, i) : void 0,
			steer: this.renderSteer(e, r),
			power: this.renderPower(e, r),
			learned: hi([_i(e, n.config, n.config.learned, r, Di)]),
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
      ${this.confirm ? this.renderConfirm(e, r) : E}
      ${this.sub === "control" ? this.renderControl(e, r, a) : E}`;
	}
	renderHead(e, t, n) {
		let r = Fi(t.id);
		return x`<div class="head-row">
        <span class="chip ${t.adapter === "none" ? "" : "read"}">${Mi(e, t, this.info)}</span>
      </div>
      ${Pi(t, n) ? x`<div class="note">
            <ha-icon icon="mdi:lightbulb-on-outline"></ha-icon>
            <span
              >${e("devices.suggested")}
              <div class="note-actions">
                <a class="mini-btn go" href=${T(this.prefix, r)} @click=${w(r, { sheet: !0 })}>${e("devices.setup")}</a>
              </div></span
            >
          </div>` : E}
      ${this.notice ? x`<div class="note warn" role="status"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.notice}</span></div>` : E}`;
	}
	renderTest(e, t, n) {
		let r = n?.ready[t.id] ?? "not_controllable", i = n?.testing?.battery === t.id ? n.testing : null, a = n?.tests[t.id], o = !!n?.testing, s = !!n?.steering, c = i ? x`<span class="chip">${e("devices.test.running")}</span>` : r === "outdated" ? x`<span class="chip warn">${e("devices.test.outdated")}</span>` : a ? x`<span class="chip ${a.ok ? "ok" : "warn"}"
              >${e(a.ok ? "devices.test.ok" : "devices.test.failed", { day: B(e.lang, a.at, "short") })}</span
            >` : x`<span class="chip">${e("devices.test.none")}</span>`, l = i?.steps ?? a?.steps ?? [];
		return x`<div class="test">
        ${c}
        <button type="button" class="btn btn-secondary" ?disabled=${o || s} @click=${() => this.confirm = !0}>
          <ha-icon icon="mdi:play-circle-outline"></ha-icon>${e(a ? "devices.test.again" : "devices.test.start")}
        </button>
      </div>
      ${i || a ? this.renderSteps(e, l, i?.step ?? null, a) : E}`;
	}
	renderSteps(e, t, n, r) {
		let i = new Map(t.map((e) => [e.step, e])), a = !n && r?.problem ? e.optional(`devices.test.problem.${r.problem}`, { missing: (r.missing ?? []).map((t) => e.optional(`role.${t}`) ?? t).join(", ") }) : null;
		return a ? x`<ul class="steps">
        <li class="bad"><ha-icon icon="mdi:close-circle"></ha-icon><b>${e("devices.test.step.check")}</b><small>${a}</small></li>
      </ul>` : x`<ul class="steps">
      ${Ei.map((t) => {
			let r = i.get(t), a = r ? r.ok ? "mdi:check-circle" : "mdi:close-circle" : n === t ? "mdi:progress-clock" : "mdi:circle-outline";
			return x`<li class=${r ? r.ok ? "ok" : "bad" : "wait"}>
          <ha-icon icon=${a}></ha-icon>
          <b>${e(`devices.test.step.${t}`)}</b>
          <small>${r ? this.stepText(e, r) : ""}</small>
        </li>`;
		})}
    </ul>`;
	}
	stepText(e, t) {
		let n = this.hass, i = [];
		return t.power != null && i.push(Math.abs(t.power) >= .05 ? e("devices.test.power", { value: r(e.lang, t.power, 2) }) : e("devices.test.no_power")), t.wrong.length && i.push(e("devices.test.wrong", { entities: t.wrong.map((e) => O(n, e)).join(", ") })), t.errors.length && i.push(e("devices.test.error", { entities: t.errors.map((e) => O(n, e.entity_id)).join(", ") })), i.join(" · ");
	}
	renderConfirm(e, t) {
		let n = () => {
			this.confirm = !1;
		};
		return x`<joe-sheet label=${e("devices.test.start")} closeLabel=${e("common.close")} @joe-close=${n}>
      <div data-tipped>
        <div class="sheet-title">${d(e("devices.test.confirm.title", { name: t.name }), "h2", v(e, "devices_test"))}</div>
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
		let n = Fi(t.id);
		return x`<div class="control-row" data-tipped>
        <span class="control-text">
          <small>${e("battery.page.how")}</small>
          <b>${Mi(e, t, this.info)}</b>
        </span>
        <a class="btn btn-secondary" href=${T(this.prefix, n)} @click=${w(n, { sheet: !0 })}>
          <ha-icon icon="mdi:tune-variant"></ha-icon>${e("devices.setup")}
        </a>
        ${v(e, "devices_setup")}
      </div>
      ${this.fields(t, "steer")}`;
	}
	renderPower(e, t) {
		return this.fields(t, "power");
	}
	fields(e, t) {
		return x`<joe-battery-fields
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
		return x`<joe-battery-automations
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
		return x`<div class="remove">
      <p class="remove-text">${e("battery.page.remove.text")}</p>
      ${this.removing ? x`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("battery.page.remove.confirm", { name: t.name })}</span></div>
            <div class="actions">
              <button type="button" class="btn btn-danger" ?disabled=${this.saving} @click=${() => this.leaveOut(t)}>
                ${e("battery.page.remove.go")}
              </button>
              <button type="button" class="btn btn-ghost" @click=${() => this.removing = !1}>${e("common.cancel")}</button>
            </div>` : x`<div class="actions">
            <button type="button" class="btn btn-secondary" @click=${() => this.removing = !0}>
              <ha-icon icon="mdi:eye-off-outline"></ha-icon>${e("review.ignore")}
            </button>
          </div>`}
    </div>`;
	}
	async leaveOut(e) {
		let t = this.state.config;
		this.saving = !0;
		let n = await M(this, {
			batteries: { [e.id]: null },
			answers: { ignored: j(t, `battery:${e.id}`, !0) }
		});
		this.saving = !1, n && (this.removing = !1, C(this, {
			tab: "devices",
			section: "battery"
		}, { replace: !0 }));
	}
	draftOf(e) {
		let t = Ai(e), n = ki.get(e.id);
		if (!n) return t;
		let r = { ...t };
		for (let e of Oi) ji(n.base[e], n.draft[e]) || (r[e] = n.draft[e]);
		return r;
	}
	controlChanges(e, t) {
		let n = {};
		for (let r of Oi) ji(e[r], t[r]) || (n[r] = t[r]);
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
		return x`<joe-sheet wide label=${e("devices.setup")} closeLabel=${e("common.close")} @joe-close=${() => ge(this, a)}>
      <div data-tipped>
        <div class="sheet-title">${d(e("battery.control.title", { name: t.name }), "h2", v(e, "control_choice"))}</div>
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
			ki.set(t.id, {
				base: Ai(t),
				draft: Nn(t, e.detail, n)
			}), this.requestUpdate();
		}}
        ></joe-battery-control>
        </div>
      </div>
      <div class="steer-bar" data-notip role="region" aria-label=${e("devices.setup")}>
        ${i ? x`<span class="unsaved" role="status">${e("battery.control.unsaved")}</span>` : E}
        <button type="button" class="btn btn-primary" ?disabled=${this.saving || !i} @click=${() => this.saveControl(t, a)}>
          ${e("common.save")}
        </button>
        <button
          type="button"
          class="btn btn-ghost"
          @click=${() => {
			ki.delete(t.id), ge(this, a);
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
			let t = await M(this, { batteries: { [e.id]: n } });
			if (this.saving = !1, !t) return;
		}
		ki.delete(e.id), ge(this, t);
	}
};
f([o({ attribute: !1 })], Ii.prototype, "entry", void 0), f([o({ attribute: !1 })], Ii.prototype, "sub", void 0), f([b()], Ii.prototype, "confirm", void 0), f([b()], Ii.prototype, "removing", void 0), f([b()], Ii.prototype, "saving", void 0), f([b()], Ii.prototype, "notice", void 0), f([b()], Ii.prototype, "automations", void 0), h("joe-battery-device", Ii);
//#endregion
//#region src/pages/devices/battery.ts
var Li = [
	"reserve_soc",
	"max_target_soc",
	"evening_min_soc",
	"balance_days",
	"discharge_in_window",
	"converter_losses"
], Ri = class extends W {
	constructor(...e) {
		super(...e), this.busy = "";
	}
	static {
		this.styles = [
			p,
			U,
			g`
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
      .dcards {
        margin-top: 14px;
      }
    `
		];
	}
	render() {
		let e = this.t, t = this.state;
		if (!e || !t) return E;
		let n = it(this.devices, "battery", this.device);
		if (n) return x`<joe-battery-device
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
		return x`<div class="wrap">
      ${zr(e, e("nav.devices.battery"), e("battery.page.lead"), r.length > 0)}
      ${this.device === void 0 ? E : jr(e)}
      <joe-control-status .t=${e} .hass=${this.hass} .state=${t}></joe-control-status>
      ${r.length ? Rr(this.ctx, this.devices, "battery", (t) => this.cardChange(e, t)) : x`<p class="empty">${e("devices.batteries.none")}</p>`}
      <div class="actions">${Br(e, this.prefix, "battery", e("battery.page.add"))}</div>
      ${r.length ? this.renderRules(e) : E}
      ${r.length ? x`<joe-battery-automations
            .hass=${this.hass}
            .t=${e}
            batteries=${JSON.stringify(r)}
            mode=${t.mode}
            .ready=${t.control?.ready ?? {}}
          ></joe-battery-automations>` : E}
      ${this.renderFound(e)}
    </div>`;
	}
	cardChange(e, t) {
		let n = t.battery;
		if (!n) return {};
		let r = this.discovery?.batteries.find((e) => e.id === n.id), i = vr(e, this.hass, this.state, t), a = Ni(e, n, this.state?.control), o = Fi(n.id);
		return {
			state: [i, a].filter(Boolean).join(" · "),
			quick: Pi(n, r) ? x`<span class="dcard-suggest">${e("battery.page.suggested")}</span>
            <a class="mini-btn go" href=${T(this.prefix, o)} @click=${w(o, { sheet: !0 })}>${e("devices.setup")}</a>` : void 0
		};
	}
	renderRules(e) {
		let t = this.state.config;
		return x`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:tune-vertical"></ha-icon>${e("battery.page.rules")}</div>
        ${v(e, "battery_rules")}
      </div>
      <div class="mirrors">
        ${Li.map((n) => {
			let r = {
				tab: "settings",
				section: "rules",
				id: n
			};
			return K(e, this.prefix, {
				label: e(`rule.${n}`),
				value: oi(e, t, n),
				source: k(t, `rules.${n}`),
				to: r
			});
		})}
      </div>
    </section>`;
	}
	renderFound(e) {
		let t = this.state.config, n = st(t, this.discovery).filter((e) => e.kind === "battery" && e.battery), r = ct(t, this.discovery);
		if (!n.length && !r.length) return E;
		let i = (t, n, r) => x`<li>
        <span class="what">
          <b>${t.name}</b>
          <small>${e(n ? "devices.add.battery.ignored" : "battery.page.found.new")}</small>
        </span>
        <span class="row-actions">
          <button type="button" class="mini-btn go" ?disabled=${!!this.busy} @click=${() => this.use(t, r)}>
            ${e(n ? "devices.add.battery.use" : "devices.found.use")}
          </button>
          ${n ? E : x`<button type="button" class="mini-btn quiet" ?disabled=${!!this.busy} @click=${() => this.ignore(r)}>
                ${e("devices.found.ignore")}
              </button>`}
        </span>
      </li>`;
		return x`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:home-battery-outline"></ha-icon>${e("battery.page.found")}</div>
        ${v(e, "battery_found")}
      </div>
      <ul class="found">
        ${n.map((e) => i(e.battery, !1, e.key))} ${r.map((e) => i(e, !0, `battery:${e.id}`))}
      </ul>
    </section>`;
	}
	async use(e, t) {
		this.busy = t;
		let n = await fr(this, this.state.config, e);
		this.busy = "", n && C(this, {
			tab: "devices",
			section: "battery",
			id: n
		});
	}
	async ignore(e) {
		this.busy = e, await mr(this, this.state.config, e), this.busy = "";
	}
};
f([o({ attribute: !1 })], Ri.prototype, "device", void 0), f([o({ attribute: !1 })], Ri.prototype, "sub", void 0), f([b()], Ri.prototype, "busy", void 0), h("joe-battery-group", Ri);
//#endregion
//#region src/components/action-page.ts
function zi(e, t, n, r, i, a, o) {
	let s = Ye(n, r);
	return x`<div class="setup-block" data-tipped>
    <p>${i} ${v(e, o)}</p>
    <a class="btn btn-primary" href=${T(t, s)} @click=${w(s, { sheet: !0 })}>${a}</a>
  </div>`;
}
function Bi(e, t, n) {
	let r = t.startsWith("action-") ? t.slice(7) : t;
	return e.find((e) => e.group !== n && (e.consumer?.id === t || e.id === t || e.action?.id === r));
}
function Vi(e, t, n, r) {
	let i = r.setup ? {
		tab: "devices",
		section: r.group,
		id: r.id
	} : P(r);
	return x`<div class="moved" role="status">
    <ha-icon icon="mdi:arrow-right-bold-circle-outline"></ha-icon>
    <span class="moved-text"><b>${n}</b></span>
    <a class="mini-btn go moved-go" href=${T(t, i)} @click=${w(i)}
      >${e("devices.moved_to", { group: e(`nav.devices.${r.group}`) })}</a
    >
  </div>`;
}
function Hi(e, t) {
	return x`<h4 class="sub-head" data-anchor=${t ?? E}>${e}</h4>`;
}
var Ui = g`
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
`, Wi = class extends u {
	constructor(...e) {
		super(...e), this.roundTrip = !0, this.failed = !1;
	}
	static {
		this.styles = [p, g`
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
		if (!e || !t || !n) return E;
		let i = (t, n = 0) => r(e.lang, t ?? 0, n);
		if (!n.known) return x`<p>${e(n.soc != null && !n.capacity_kwh ? "need.unknown_capacity" : "need.unknown")}</p>`;
		let a = [];
		a.push(x`<p>
        ${n.trips_km > 0 && n.trips_km >= (n.usual_km ?? 0) ? e("need.trips", {
			km: i(n.trips_km),
			count: n.trips.length,
			reserve: i(n.reserve_km),
			total: i(n.needed_km)
		}) : n.usual_km ? e("need.usual", {
			km: i(n.usual_km),
			reserve: i(n.reserve_km),
			total: i(n.needed_km)
		}) : e("need.reserve_only", { reserve: i(n.reserve_km) })}
        ${n.unknown_trips ? e("need.unknown_trips", { count: n.unknown_trips }) : ""}
      </p>`), a.push(x`<p>
        ${e(`need.consumption.${n.consumption_source}`, {
			value: i(n.consumption, 1),
			temp: n.temp == null ? "–" : i(n.temp)
		})}${n.rain ? ` ${e("need.rain")}` : ""}
      </p>`), n.target_unit === "%" ? a.push(x`<p>${e("need.has_soc", {
			soc: i(n.soc),
			km: i(n.have_km),
			target: i(n.target)
		})}</p>`) : a.push(x`<p>${e("need.has_range", { km: i(n.have_km) })}</p>`);
		let o = n.missing_kwh ?? 0;
		return a.push(x`<p class="result">
        ${o >= .2 ? t.run && !t.manual ? e("need.charges", {
			kwh: i(o, 1),
			start: S(t.start)
		}) : e("need.missing", { kwh: i(o, 1) }) : e("need.enough")}
      </p>`), n.fits === !1 && a.push(x`<p>${e("need.too_far")}</p>`), x`${a} ${n.trips.length ? this.renderTrips(e, n.trips) : E}`;
	}
	renderTrips(e, t) {
		return x`<div data-tipped>
      <div class="head">${e("need.trips.title")} ${v(e, "need_trips")}</div>
      <ul>
        ${t.map((t) => x`<li>
            <span>${t.start.includes("T") ? S(t.start) : e("need.all_day")}</span>
            <span class="where">${t.location}</span>
            ${this.editing === t.location ? this.renderEdit(e, t) : x`<span class=${t.km == null ? "km unknown" : "km"}>
                    ${t.km == null ? e("need.km_unknown") : e(`need.km.${t.source ?? "zone"}`, { km: r(e.lang, t.km, 0) })}
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
      ${this.failed ? x`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("error.action")}</div>` : E}
    </div>`;
	}
	renderEdit(e, t) {
		let n = t.km == null ? "" : String(Math.round(t.km / (this.roundTrip ? 2 : 1)));
		return x`<form
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
f([o({ attribute: !1 })], Wi.prototype, "hass", void 0), f([o({ attribute: !1 })], Wi.prototype, "t", void 0), f([o({ attribute: !1 })], Wi.prototype, "action", void 0), f([o({ attribute: !1 })], Wi.prototype, "roundTrip", void 0), f([b()], Wi.prototype, "editing", void 0), f([b()], Wi.prototype, "failed", void 0), h("joe-car-need", Wi);
//#endregion
//#region src/pages/devices/other-list.ts
var Gi = ["auto", "always"], Ki = [
	"auto",
	"surplus",
	"cheap"
], qi = [
	"climate",
	"ev",
	"hot_water"
];
function Ji(e, t, n) {
	return n === t.kind ? Promise.resolve(!1) : M(e, { consumers: { [t.id]: { kind: n } } });
}
function Yi(e, t, n) {
	return n === (t.runs ?? "auto") ? Promise.resolve(!1) : M(e, { consumers: { [t.id]: { runs: n } } });
}
function Xi(e, t, n) {
	return x`<select
    class="input"
    aria-label=${e("consumers.kind_of", { name: t.name })}
    .value=${t.kind}
    @change=${(e) => n(e.target.value)}
  >
    ${wn.map((n) => x`<option value=${n} ?selected=${n === t.kind}>${e(`kind.${n}`)}</option>`)}
  </select>`;
}
function Zi(e, t, n) {
	if (t.kind === "submeter") return E;
	let r = t.runs ?? "auto";
	return x`<select
    class="input"
    aria-label=${e("consumers.runs_of", { name: t.name })}
    .value=${r}
    @change=${(e) => n(e.target.value)}
  >
    ${t.kind === "ev" ? Gi.map((t) => x`<option value=${t} ?selected=${t === r}>${e(`runs.ev.${t}`)}</option>`) : Ki.map((t) => x`<option value=${t} ?selected=${t === r}>${e(`runs.${t}`)}</option>`)}
  </select>`;
}
function Qi(e, n, r, i, a) {
	let o = a.power_entity ?? a.energy_entity;
	return x`${o ? x`<div class="meter-line">
          <span class="meter-label">${n("devices.meter")}</span>
          <span class="meter-value"><b>${O(r, o)}</b> · ${m(r, o, n.lang)}</span>
          ${t(n, k(i, `consumers[${a.id}].kind`))}
        </div>` : E}
    <div class="field" data-tipped>
      <div class="field-label">${n("consumers.kind")} ${v(n, "f_consumer_kind")}</div>
      ${Xi(n, a, (t) => void Ji(e, a, t))}
    </div>
    ${a.kind === "submeter" ? E : x`<div class="field" data-tipped>
          <div class="field-label">${n("consumers.runs")} ${v(n, "f_consumer_runs")}</div>
          ${Zi(n, a, (t) => void Yi(e, a, t))}
        </div>`}`;
}
var $i = g`
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
`, ea = class extends u {
	static {
		this.styles = [p, g`
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
		let { t: e, hass: n, config: r } = this;
		if (!e || !n || !r) return E;
		let i = [...r.consumers].sort((t, n) => Number(t.kind === "submeter") - Number(n.kind === "submeter") || t.name.localeCompare(n.name, e.lang));
		return x`<div data-tipped>
      <div class="head">${e("consumers.kind")} ${v(e, "f_consumer_kind")}</div>
      <div class="head sub">${e("consumers.runs")} ${v(e, "f_consumer_runs")}</div>
      ${i.length ? x`<ul>
            ${i.map((i) => {
			let a = i.power_entity ? m(n, i.power_entity, e.lang) : "";
			return x`<li>
                <div>
                  <b>${i.name}</b>
                  <small>${t(e, k(r, `consumers[${i.id}].kind`))}${a}</small>
                </div>
                <div class="selects">
                  ${Xi(e, i, (e) => void Ji(this, i, e))}
                  ${Zi(e, i, (e) => void Yi(this, i, e))}
                </div>
              </li>`;
		})}
          </ul>` : x`<p class="empty">${e("consumers.empty")}</p>`}
    </div>`;
	}
};
f([o({ attribute: !1 })], ea.prototype, "hass", void 0), f([o({ attribute: !1 })], ea.prototype, "t", void 0), f([o({ attribute: !1 })], ea.prototype, "config", void 0), h("joe-consumer-list", ea);
//#endregion
//#region src/pages/devices/car-device.ts
var ta = class extends W {
	constructor(...e) {
		super(...e), this.revealed = "";
	}
	static {
		this.styles = [
			p,
			U,
			gi,
			$i,
			Ui,
			g`
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
    `
		];
	}
	updated(e) {
		let t = this.sub === "calendars" ? `${this.entry?.id}/calendars` : "";
		(e.has("sub") || e.has("entry")) && (t ? this.revealed !== t && fe(this.renderRoot, "calendars") && (this.revealed = t) : this.revealed = "");
	}
	render() {
		let { t: e, hass: t, state: n, entry: r } = this;
		if (!e || !t || !n || !r) return E;
		let i = Nr(this.ctx, r), a = r.consumer, o = a ? Qi(this, e, t, n.config, a) : void 0, s = r.action;
		if (!s) return Lr(this.ctx, {
			...i,
			now: a ? zi(e, this.prefix, "car", a.id, e("devices.car.lonely"), e("devices.car.set_up"), "devices_lonely_car") : void 0,
			power: o
		});
		let c = n.plan?.actions?.find((e) => e.id === s.id), l = s.need, u = s.kind === "switch" && !!(l?.soc_entity || l?.range_entity), d = {
			hass: t,
			t: e,
			state: n,
			discovery: this.discovery,
			prefix: this.prefix,
			action: s
		};
		return Lr(this.ctx, {
			...i,
			why: pn(e, n, s),
			now: x`${l?.enabled ? this.calendarLine(e, n, s) : E}
        ${c?.need ? x`<joe-car-need .hass=${t} .t=${e} .action=${c} .roundTrip=${l?.round_trip ?? !0}></joe-car-need>` : E}
        ${u ? x`<joe-car-charge
              .hass=${t}
              .t=${e}
              .state=${n}
              .action=${s}
              ?flush=${!l?.enabled && !c?.need}
            ></joe-car-charge>` : x`<joe-action-tonight .hass=${t} .t=${e} .state=${n} .action=${s}></joe-action-tonight>`}`,
			steer: x`<joe-action-steer
          .hass=${d.hass}
          .t=${e}
          .state=${n}
          .discovery=${d.discovery}
          .prefix=${d.prefix}
          .action=${s}
          .section=${"car"}
        ></joe-action-steer>
        ${Hi(e("devices.car.terms"), "calendars")}
        ${l?.enabled ? x`<joe-action-steer
              .hass=${t}
              .t=${e}
              .state=${n}
              .discovery=${this.discovery}
              .prefix=${this.prefix}
              .action=${s}
              .section=${"calendars"}
            ></joe-action-steer>` : x`<p class="muted">${e("devices.car.terms_off")}</p>`}`,
			power: o,
			learned: s.kind === "switch" ? hi([bi(e, n.config.learned, s)]) : void 0,
			learnedArea: "car",
			tips: { steer: "device_steer" },
			removeTitle: e("devices.page.delete"),
			remove: x`<joe-action-delete
        .t=${e}
        .config=${n.config}
        .action=${s}
        .leave=${{
				tab: "devices",
				section: "car"
			}}
      ></joe-action-delete>`
		});
	}
	calendarLine(e, t, n) {
		let r = n.need, i = r?.enabled ? r.source ?? "ha" : null, a = "", o = "none", s = null, c = r?.enabled ? t.config.persons.filter((e) => e.calendars.length && (r.persons == null || r.persons.includes(e.id))) : [];
		if (i === "ha" && (r?.calendars?.length || c.length)) a = [...(r?.calendars ?? []).map((e) => O(this.hass, e)), ...c.length ? [e("devices.car.of_persons", { names: c.map((e) => e.name).join(", ") })] : []].join(" · "), o = "ok";
		else if (i === "mailbox" && r?.mailbox?.address) {
			let e = t.mailbox?.[n.id];
			a = r.mailbox.address, o = e?.state === "ok" ? "ok" : "warn", s = e?.checked ?? null;
		} else if (i === "account" && r?.account?.address) {
			let e = t.accounts?.[n.id];
			a = r.account.address, o = e?.state === "ok" ? "ok" : "warn", s = e?.checked ?? null;
		}
		let l = {
			tab: "devices",
			section: "car",
			id: this.entry.id,
			sub: "calendars"
		};
		return x`<div class="car-cal" data-tipped>
      <ha-icon icon="mdi:calendar-month-outline"></ha-icon>
      <span class="grow">
        ${o === "none" ? x`<b>${e("devices.car.no_calendar")}</b>` : x`<b>${a}</b>
              <small>
                ${e(o === "ok" ? "devices.car.calendar_ok" : "devices.car.calendar_problem")}
                ${s ? e("devices.car.checked", { when: new Date(s).toLocaleString(e.lang, {
			weekday: "short",
			hour: "2-digit",
			minute: "2-digit"
		}) }) : E}
              </small>`}
      </span>
      <a class="mini-btn ${o === "none" ? "go" : ""}" href=${T(this.prefix, l)} @click=${this.jumpToCalendars(l)}>
        ${e(o === "none" ? "devices.car.connect" : "devices.car.change")}
      </a>
      ${v(e, "car_calendar_card")}
    </div>`;
	}
	jumpToCalendars(e) {
		let t = w(e, { replace: !0 });
		return (e) => {
			t(e), e.defaultPrevented && (this.revealed = "", fe(this.renderRoot, "calendars"));
		};
	}
};
f([o({ attribute: !1 })], ta.prototype, "entry", void 0), f([o({ attribute: !1 })], ta.prototype, "sub", void 0), h("joe-car-device", ta);
//#endregion
//#region src/pages/devices/car.ts
var na = class extends W {
	static {
		this.styles = [
			p,
			U,
			Ui
		];
	}
	render() {
		let e = this.t;
		if (!e || !this.state) return E;
		let t = it(this.devices, "car", this.device);
		if (t) return x`<joe-car-device
        .hass=${this.hass}
        .t=${e}
        .state=${this.state}
        .route=${this.route}
        .prefix=${this.prefix}
        .discovery=${this.discovery}
        .info=${this.info}
        .checks=${this.checks}
        .climateFound=${this.climateFound}
        .devices=${this.devices}
        .entry=${t}
        .sub=${this.sub}
      ></joe-car-device>`;
		let n = this.device ? Bi(this.devices, this.device, "car") : void 0;
		return x`<div class="wrap">
      ${zr(e, e("nav.devices.car"), e("devices.car.lead"), this.devices.some((e) => e.group === "car"))}
      ${this.device === void 0 ? E : n ? Vi(e, this.prefix, n.name, n) : jr(e)}
      ${Rr(this.ctx, this.devices, "car", (t) => {
			let n = t.action?.need;
			return t.action && (t.action.kind !== "switch" || !n?.soc_entity && !n?.range_entity) ? { quick: x`<joe-action-tonight .hass=${this.hass} .t=${e} .state=${this.state} .action=${t.action}></joe-action-tonight>` } : {};
		})}
      <div class="group-actions">${Br(e, this.prefix, "car", e("devices.group_add.car"))}</div>
    </div>`;
	}
};
f([o({ attribute: !1 })], na.prototype, "device", void 0), f([o({ attribute: !1 })], na.prototype, "sub", void 0), h("joe-car-group", na);
//#endregion
//#region node_modules/lit-html/directives/repeat.js
var ra = (e, t, n) => {
	let r = /* @__PURE__ */ new Map();
	for (let i = t; i <= n; i++) r.set(e[i], i);
	return r;
}, ia = Yn(class extends Xn {
	constructor(e) {
		if (super(e), e.type !== Jn.CHILD) throw Error("repeat() can only be used in text expressions");
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
		let i = Kn(e), { values: a, keys: o } = this.dt(t, n, r);
		if (!Array.isArray(i)) return this.ut = o, a;
		let s = this.ut ??= [], c = [], u, d, f = 0, p = i.length - 1, m = 0, h = a.length - 1;
		for (; f <= p && m <= h;) if (i[f] === null) f++;
		else if (i[p] === null) p--;
		else if (s[f] === o[m]) c[m] = Un(i[f], a[m]), f++, m++;
		else if (s[p] === o[h]) c[h] = Un(i[p], a[h]), p--, h--;
		else if (s[f] === o[h]) c[h] = Un(i[f], a[h]), Hn(e, c[h + 1], i[f]), f++, h--;
		else if (s[p] === o[m]) c[m] = Un(i[p], a[m]), Hn(e, i[f], i[p]), p--, m++;
		else if (u === void 0 && (u = ra(o, m, h), d = ra(s, f, p)), u.has(s[f])) {
			if (u.has(s[p])) {
				let t = d.get(o[m]), n = t === void 0 ? null : i[t];
				if (n === null) {
					let t = Hn(e, i[f]);
					Un(t, a[m]), c[m] = t;
				} else c[m] = Un(n, a[m]), Hn(e, i[f], n), i[t] = null;
				m++;
			} else qn(i[p]), p--;
		} else qn(i[f]), f++;
		for (; m <= h;) {
			let t = Hn(e, c[h + 1]);
			Un(t, a[m]), c[m++] = t;
		}
		for (; f <= p;) {
			let e = i[f++];
			e !== null && qn(e);
		}
		return this.ut = o, Gn(e, c), l;
	}
}), aa = 1435, oa = 1440;
function sa(e, t) {
	let n = (t ?? "").trim();
	return !n || /^profile?\s*\d+$/i.test(n) ? e : `${e} ${n}`;
}
var ca = {
	normal: "mdi:home-outline",
	holiday: "mdi:calendar-star",
	away: "mdi:home-export-outline",
	home_office: "mdi:laptop"
}, la = {
	all: 1,
	week_weekend: 2,
	each: 7
};
function ua(e, t) {
	return e === "all" ? 0 : e === "week_weekend" ? t < 5 ? 0 : 1 : t;
}
function da(e) {
	return `${String(Math.floor(e / 60)).padStart(2, "0")}:${String(e % 60).padStart(2, "0")}`;
}
function fa(e) {
	let t = /^(\d{1,2}):(\d{2})/.exec(e);
	if (!t) return null;
	let n = Number(t[1]), r = Number(t[2]);
	return n < 24 && r < 60 ? n * 60 + r : null;
}
function pa(e, t) {
	let n;
	for (let [r, i] of e) r <= t && (n = i);
	return n;
}
function ma(e) {
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
function ha(e, t, n, r) {
	let i = Math.round(e / t) * t;
	return Math.round(Math.min(r, Math.max(n, i)) * 10) / 10;
}
function ga(e, t) {
	let n = (e) => e.map(([e, t]) => [e, t]), r = (t) => n(e.curves[ua(e.split, t)] ?? e.curves[0]);
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
function _a(e) {
	let t = 0, n = -1;
	for (let r = 0; r < e.length; r++) {
		let i = e[r + 1]?.[0] ?? 1440;
		i - e[r][0] > n && (t = e[r][0], n = i - t);
	}
	if (n < 0) return null;
	let r = Math.min(aa, Math.round((t + n / 2) / 15) * 15);
	return r > t && !e.some(([e]) => e === r) ? r : null;
}
function va(e) {
	if (e.length !== 6) return "count";
	let t = /* @__PURE__ */ new Set();
	for (let n of e) {
		for (let e of n.tags) {
			if (t.has(e)) return "tags";
			t.add(e);
		}
		if (n.curves.length !== la[n.split]) return "curves";
		for (let e of n.curves) {
			if (!e.length || e.length > 12 || e[0][0] !== 0) return "points";
			for (let t = 1; t < e.length; t++) if (e[t][0] <= e[t - 1][0] || e[t][0] % 5) return "points";
		}
	}
	return null;
}
//#endregion
//#region src/components/week-bar.ts
var ya = class extends u {
	constructor(...e) {
		super(...e), this.points = [], this.mode = "heat", this.now = null, this.compact = !1, this.lang = "en", this.label = "", this.offText = "off";
	}
	static {
		this.styles = g`
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
		return x`<div class="track">
        <div class="bar" role="img" aria-label=${this.label}>
          ${t.map(({ from: e, to: t, value: n }) => {
			let i = `left:${e / oa * 100}%;width:${(t - e) / oa * 100}%;`;
			return n === "off" ? x`<span class="seg off" style=${i}>${this.compact ? E : this.offText}</span>` : x`<span class="seg" style=${i + this.color(n)}>
              ${this.compact ? E : `${r(this.lang, n, 1)}°`}
            </span>`;
		})}
        </div>
        ${this.now == null ? E : x`<span class="now" style=${`left:${this.now / oa * 100}%`}></span>`}
      </div>
      ${this.compact ? E : x`<div class="ticks" aria-hidden="true">
            ${[
			0,
			6,
			12,
			18,
			24
		].map((e) => x`<span style=${`left:${e / 24 * 100}%`}>${e}</span>`)}
          </div>`}`;
	}
	color(e) {
		let t = this.mode === "cool" ? (28 - e) / 10 : (e - 16) / 10, n = Math.round(25 + Math.min(1, Math.max(0, t)) * 75), r = this.mode === "cool" ? "cool" : "heat";
		return `background:color-mix(in srgb, var(--wk-${r}) ${n}%, var(--wk-${r}-weak));`;
	}
};
f([o({ attribute: !1 })], ya.prototype, "points", void 0), f([o()], ya.prototype, "mode", void 0), f([o({ attribute: !1 })], ya.prototype, "now", void 0), f([o({
	type: Boolean,
	reflect: !0
})], ya.prototype, "compact", void 0), f([o()], ya.prototype, "lang", void 0), f([o()], ya.prototype, "label", void 0), f([o()], ya.prototype, "offText", void 0), h("joe-week-bar", ya);
//#endregion
//#region src/editors/week-editor.ts
var ba = [
	"all",
	"week_weekend",
	"each"
], xa = "23:00", Sa = "06:30", Ca = {
	tab: "household",
	section: "days"
};
function wa(e, t, n = "long") {
	return new Intl.DateTimeFormat(e, {
		weekday: n,
		timeZone: "UTC"
	}).format(new Date(Date.UTC(2024, 0, 1 + t)));
}
var q = class extends u {
	constructor(...e) {
		super(...e), this.entityId = "", this.prefix = D, this.fetched = !1, this.failed = !1, this.drafts = {}, this.selected = {
			heat: 0,
			cool: 0
		}, this.open = 0, this.creating = !1, this.saving = !1, this.errors = {}, this.fitted = {}, this.loaded = !1, this.requested = !1;
	}
	static {
		this.styles = [p, g`
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
		this.hass && !this.requested && (this.requested = !0, this.load()), (e.has("config") || e.has("entityId")) && this.config && this.entityId && !this.loaded && (this.loaded = !0, this.drafts = structuredClone(this.room?.week?.modes ?? {}), this.fitDrafts(On), this.pickMode()), this.device && this.loaded && !this.mode && (this.fitDrafts(On), this.pickMode()), e.has("startMode") && this.mode && this.startMode && this.startMode !== this.mode && this.modes.includes(this.startMode) && this.showMode(this.startMode);
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
		this.fetched = !0, this.fitDrafts(On), this.pickMode();
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
					let a = ha(i, t, n, r);
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
		return On.filter((e) => this.device?.hvac_modes.includes(e));
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
		return ma(this.hass?.config?.time_zone);
	}
	openToday() {
		let e = this.profiles?.[this.index];
		this.open = e ? ua(e.split, this.now.weekday) : 0;
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
		if (!e || !this.config) return E;
		let n = x`<div class="sheet-title">${d(e("week.title"))}</div>`;
		if (!t) return x`${n}
        ${this.fetched ? x`<div class="note warn">
              <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e(this.failed ? "week.load_failed" : "week.device_missing")}</span>
            </div>` : x`<p class="field-hint">${e("week.loading")}</p>`}
        <div class="actions" data-notip>
          <button type="button" class="btn btn-secondary" @click=${this.close}>${e("mode.close")}</button>
        </div>`;
		let r = this.modes, i = this.mode, a = this.profiles;
		return x`${n}
      <div class="head">
        <b>${c(t.device_id, t.name, e("climate.open_device", { id: t.entity_id }))}</b>
        ${t.area ? x`<span class="chip">${t.area}</span>` : E}
      </div>
      ${r.length ? x`<div class="field" data-tipped>
            <div class="field-label">${e("week.modes")} ${v(e, "week_mode")}</div>
            <span class="seg" role="group" aria-label=${e("week.modes")}>
              ${r.map((t) => x`<button type="button" aria-pressed=${String(t === i)} @click=${() => this.setMode(t)}>
                  ${e(`week.mode.${t}`)}${this.errors[t] ? x`<span class="dot bad" title=${this.errors[t]}></span>` : this.isDirty(t) ? x`<span class="dot" title=${e("week.unsaved")}></span>` : E}
                </button>`)}
            </span>
          </div>` : x`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("week.no_modes")}</span></div>`}
      ${i ? a ? this.renderSet(e, i, a) : this.renderEmpty(e, i) : E}
      <div class="foot" data-notip>
        ${i && this.errors[i] ? x`<div class="note warn" role="alert">
              <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("week.save_failed", {
			mode: e(`week.mode.${i}`),
			error: this.errors[i]
		})}</span>
            </div>` : E}
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
          ${r.some((e) => this.isDirty(e)) ? x`<span class="chip warn">${e("week.unsaved")}</span>` : E}
        </div>
      </div>`;
	}
	renderEmpty(e, t) {
		return x`<div class="empty" data-tipped>
      <p>${e("week.empty", { mode: e(`week.mode.${t}`) })}</p>
      <span class="with-tip">
        <button type="button" class="btn btn-primary" ?disabled=${this.creating} @click=${() => void this.create(t)}>
          ${e(this.creating ? "week.creating" : "week.create")}
        </button>
        ${v(e, "week_create")}
      </span>
    </div>`;
	}
	renderSet(e, t, n) {
		let r = this.status?.rooms?.[this.entityId], i = r?.kind === "week" && r.mode === t ? r.profile?.index : void 0, a = this.now, o = this.index, s = n[o];
		return x`<div class="field" data-tipped>
        <div class="field-label">${e("week.profiles")} ${v(e, "week_profiles")}</div>
        <div class="tiles" role="group" aria-label=${e("week.profiles")}>
          ${n.map((n, r) => {
			let s = n.name || e("week.profile", { n: r + 1 });
			return x`<button
              type="button"
              class="tile"
              aria-pressed=${String(r === o)}
              @click=${() => this.select(r)}
            >
              <span class="tile-top">
                <span class="no" aria-hidden="true">${r + 1}</span>
                <span class="name">${s}</span>
                ${r === i ? x`<span class="running" role="img" aria-label=${e("week.running")} title=${e("week.running")}></span>` : E}
              </span>
              <span class="tile-tags">
                ${n.tags.map((t) => x`<span><ha-icon icon=${ca[t]}></ha-icon>${e(`week.tag.${t}`)}</span>`)}
              </span>
              <joe-week-bar
                compact
                .points=${n.curves[ua(n.split, a.weekday)] ?? n.curves[0] ?? []}
                .now=${a.minute}
                mode=${t}
                lang=${e.lang}
                label=${e("week.curve", { label: `${s}, ${e("week.today")}` })}
              ></joe-week-bar>
            </button>`;
		})}
        </div>
        ${n.some((e) => e.tags.includes("normal")) ? E : x`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("week.no_normal")}</span></div>`}
      </div>
      ${s ? this.renderProfile(e, t, n, s) : E}`;
	}
	renderProfile(e, t, n, r) {
		let i = this.index, a = this.status?.day, o = !a || a.home_office_available, s = a?.home_office_reason ?? "no_calendar";
		return x`<div class="profile">
      <div class="field" data-tipped>
        <div class="field-label"><label for="week-name">${e("week.name")}</label> ${v(e, "week_name")}</div>
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
        <div class="field-label">${e("week.tags")} ${v(e, "week_tags")}</div>
        <div class="tags" role="group" aria-label=${e("week.tags")}>
          ${Dn.map((t) => {
			let i = r.tags.includes(t), a = t === "home_office" && !o && !i;
			return x`<button
              type="button"
              class="mini-btn tag-btn"
              aria-pressed=${String(i)}
              ?disabled=${a}
              title=${a ? e(`week.ho.${s}`) : ""}
              @click=${() => this.toggleTag(n, t)}
            >
              <ha-icon icon=${ca[t]}></ha-icon>${e(`week.tag.${t}`)}
            </button>`;
		})}
        </div>
        ${o ? E : x`<p class="field-hint">${e(`week.ho.${s}`)}</p>
              <div>
                <a class="mini-btn quiet" href=${T(this.prefix, Ca)} @click=${w(Ca)}>
                  <ha-icon icon="mdi:calendar-text-outline"></ha-icon>${e("week.ho.rules")}
                </a>
              </div>`}
        ${r.tags.length ? E : x`<p class="field-hint">${e("week.untagged")}</p>`} ${this.noticeAt("tags")}
      </div>
      <div class="field" data-tipped>
        <div class="field-label">${e("week.days")} ${v(e, "week_split")}</div>
        <span class="seg full" role="group" aria-label=${e("week.days")}>
          ${ba.map((t) => x`<button type="button" aria-pressed=${String(r.split === t)} @click=${() => this.setSplit(t)}>
              ${e(`week.split.${t}`)}
            </button>`)}
        </span>
      </div>
      ${this.noticeAt("days")} ${this.renderGroups(e, t, r)}
    </div>`;
	}
	noticeAt(e) {
		return this.notice?.at === e ? x`<div class="note" role="status"><ha-icon icon="mdi:information-outline"></ha-icon><span>${this.notice.text}</span></div>` : E;
	}
	groupLabel(e, t, n) {
		return t === "all" ? e("week.group.all") : t === "week_weekend" ? e(n === 0 ? "week.group.weekdays" : "week.group.weekend") : wa(e.lang, n);
	}
	renderGroups(e, t, n) {
		let i = this.now, a = ua(n.split, i.weekday), o = n.curves.length > 1, { step: s, min: c, max: l } = this.limits, u = this.room;
		return x`<div class="field" data-tipped>
      <div class="field-label">${e("week.points")} ${v(e, "week_points")}</div>
      <p class="field-hint">
        ${e("week.limits", {
			min: r(e.lang, c, 1),
			max: r(e.lang, l, 1),
			step: r(e.lang, s, 2)
		})}
      </p>
      ${this.fitted[t] ? x`<div class="note" role="status"><ha-icon icon="mdi:information-outline"></ha-icon><span>${e("week.fitted")}</span></div>` : E}
      ${u?.night_off ? x`<p class="field-hint">
            ${this.config?.climate?.night_by === "entity" ? e("week.night_entity", { until: u.night_until ?? Sa }) : e("week.night_time", {
			from: u.night_from ?? xa,
			until: u.night_until ?? Sa
		})}
          </p>` : E}
      <div class="groups">
        ${n.curves.map((r, u) => {
			let d = this.groupLabel(e, n.split, u), f = !o || this.open === u, p = x`<span class="day-label">
              ${o ? x`<ha-icon icon=${f ? "mdi:chevron-down" : "mdi:chevron-right"}></ha-icon>` : E}${d}
              ${u === a ? x`<span class="chip ok">${e("week.today")}</span>` : E}
            </span>
            <joe-week-bar
              .points=${r}
              .now=${u === a ? i.minute : null}
              mode=${t}
              lang=${e.lang}
              offText=${e("week.off")}
              label=${e("week.curve", { label: d })}
            ></joe-week-bar>`;
			return x`<div class="group ${f ? "open" : ""}">
            ${o ? x`<button type="button" class="group-head" aria-expanded=${String(f)} @click=${() => this.openGroup(u)}>${p}</button>` : x`<div class="group-head">${p}</div>`}
            ${f ? this.renderPoints(e, n, u, r, {
				step: s,
				min: c,
				max: l
			}) : E}
          </div>`;
		})}
      </div>
    </div>`;
	}
	renderPoints(e, t, n, i, a) {
		let { step: o, min: s, max: c } = a, l = r(e.lang, o, 2), u = this.rowError?.curve === n ? this.rowError : void 0;
		return x`<div class="points" role="list" aria-label=${e("week.points")}>
        ${ia(i, ([e]) => e, ([t, r], i) => {
			let a = da(t);
			return x`<div class="point" role="listitem">
              ${i === 0 ? x`<span class="time fixed" title=${e("week.point.first")}>00:00</span>` : x`<input
                    class="input time"
                    type="time"
                    step="300"
                    required
                    aria-label=${e("week.point.time")}
                    .value=${a}
                    @blur=${(e) => this.setTime(n, i, e.target)}
                    @keydown=${(e) => e.key === "Enter" && e.target.blur()}
                  />`}
              <span class="value">
                ${r === "off" ? x`<span class="off-text">${e("week.off")}</span>` : x`<button
                        type="button"
                        class="mini-btn step"
                        aria-label=${e("week.point.less", { step: l })}
                        ?disabled=${r <= s}
                        @click=${() => this.setValue(n, i, r - o)}
                      >
                        −
                      </button>
                      <input
                        class="input num"
                        type="number"
                        inputmode="decimal"
                        step=${o}
                        min=${s}
                        max=${c}
                        aria-label=${e("week.point.value", { time: a })}
                        .value=${String(r)}
                        @change=${(e) => {
				let t = e.target, a = Number.parseFloat(t.value.replace(",", "."));
				t.value = String(Number.isFinite(a) ? this.setValue(n, i, a) : r);
			}}
                      />
                      <button
                        type="button"
                        class="mini-btn step"
                        aria-label=${e("week.point.more", { step: l })}
                        ?disabled=${r >= c}
                        @click=${() => this.setValue(n, i, r + o)}
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
                  aria-label=${e("week.point.off", { time: a })}
                  @click=${() => this.toggleOff(n, i)}
                ></button>
                <span aria-hidden="true">${e("week.off")}</span>
              </span>
              ${i === 0 ? x`<span class="del"></span>` : x`<button
                    type="button"
                    class="mini-btn quiet del"
                    aria-label=${e("week.point.delete", { time: a })}
                    title=${e("week.point.delete", { time: a })}
                    @click=${() => this.removePoint(n, i)}
                  >
                    <ha-icon icon="mdi:delete-outline"></ha-icon>
                  </button>`}
            </div>
            ${u?.point === i ? x`<p class="row-error" role="alert">${u.text}</p>` : E}`;
		})}
      </div>
      <div class="point-actions">
        <span class="with-tip" data-tipped>
          <button type="button" class="mini-btn" ?disabled=${i.length >= 12} @click=${() => this.addPoint(n)}>
            <ha-icon icon="mdi:plus"></ha-icon>${e("week.point.add")}
          </button>
          ${v(e, "week_add")}
        </span>
        ${t.curves.length > 1 ? this.renderCopy(e, t, n) : E}
      </div>
      ${i.length >= 12 ? x`<p class="field-hint">${e("week.point.max")}</p>` : E} ${this.noticeAt("points")}`;
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
				label: wa(e.lang, t)
			}))
		];
		return x`<span class="with-tip" data-tipped>
      <select
        class="input copy"
        aria-label=${e("week.copy")}
        @change=${(e) => {
			let t = e.target, i = r.find((e) => e.value === t.value);
			t.value = "", i && this.copyTo(n, i.value, i.label);
		}}
      >
        <option value="" selected disabled>${e("week.copy")}</option>
        ${r.map((e) => x`<option value=${e.value}>${e.label}</option>`)}
      </select>
      ${v(e, "week_copy")}
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
			a >= 0 && (n[a].tags = n[a].tags.filter((e) => e !== t)), e.tags = Dn.filter((n) => n === t || e.tags.includes(n));
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
			t.curves = ga(t, e), t.split = e;
		});
		let i = la[e] > la[r] ? t("week.split.split") : r === "each" && e === "week_weekend" ? t("week.split.merged_days") : t("week.split.merged", { first: r === "each" ? wa(t.lang, 0) : t("week.group.weekdays") });
		this.notice = {
			text: i,
			at: "days"
		}, this.open = ua(e, this.now.weekday);
	}
	setTime(e, t, n) {
		let r = this.t, i = this.profiles?.[this.index]?.curves[e];
		if (!i) return;
		let a = i[t][0], o = fa(n.value);
		if (o == null) {
			n.value = da(a);
			return;
		}
		let s = Math.min(aa, Math.max(5, Math.round(o / 5) * 5));
		if (s === a) {
			n.value = da(a);
			return;
		}
		if (i.some(([e], n) => n !== t && e === s)) {
			n.value = da(a), this.rowError = {
				curve: e,
				point: t,
				text: r("week.point.duplicate", { time: da(s) })
			};
			return;
		}
		n.value = da(s), this.changeCurve(e, (e) => {
			e[t][0] = s;
		});
	}
	setValue(e, t, n) {
		let { step: r, min: i, max: a } = this.limits, o = ha(n, r, i, a);
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
			o = ha(Number(e ?? s ?? this.fallbackValue()), r, i, a);
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
		let r = _a(n);
		if (r == null) {
			this.notice = {
				text: t("week.point.no_room"),
				at: "points"
			};
			return;
		}
		let i = pa(n, r) ?? this.fallbackValue();
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
					[e]: Ta(t)
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
			let n = va(this.drafts[t]);
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
			let n = Ta(t);
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
f([o({ attribute: !1 })], q.prototype, "hass", void 0), f([o({ attribute: !1 })], q.prototype, "t", void 0), f([o({ attribute: !1 })], q.prototype, "config", void 0), f([o({ attribute: !1 })], q.prototype, "status", void 0), f([o({ attribute: !1 })], q.prototype, "entityId", void 0), f([o({ attribute: !1 })], q.prototype, "found", void 0), f([o({ attribute: !1 })], q.prototype, "prefix", void 0), f([o({ attribute: !1 })], q.prototype, "startMode", void 0), f([b()], q.prototype, "device", void 0), f([b()], q.prototype, "fetched", void 0), f([b()], q.prototype, "failed", void 0), f([b()], q.prototype, "drafts", void 0), f([b()], q.prototype, "mode", void 0), f([b()], q.prototype, "selected", void 0), f([b()], q.prototype, "open", void 0), f([b()], q.prototype, "notice", void 0), f([b()], q.prototype, "rowError", void 0), f([b()], q.prototype, "creating", void 0), f([b()], q.prototype, "saving", void 0), f([b()], q.prototype, "errors", void 0), f([b()], q.prototype, "fitted", void 0);
function Ta(e) {
	return String(e?.message ?? e);
}
h("joe-week-editor", q);
//#endregion
//#region src/pages/devices/climate-view.ts
var Ea = {
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
function Da(e, t) {
	let n = /^week_program_(\d+)$/.exec(e);
	return n ? Number(n[1]) : t + 1;
}
function Oa(e) {
	return JSON.stringify(Object.keys(e).sort().map((t) => [
		t,
		e[t]?.name ?? "",
		e[t]?.tags ?? []
	]));
}
function ka(e, t, n, r) {
	let i = {
		...Ea,
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
function Aa(e, t, n) {
	let r = t[e.entity_id]?.meter, i = n?.suggested?.[e.entity_id]?.device_id;
	return e.hvac_modes.some((e) => [
		"cool",
		"dry",
		"fan_only",
		"heat_cool"
	].includes(e)) || r != null && r !== "none" || i != null && i === e.device_id;
}
function ja(e) {
	return !!e?.meter && e.meter !== "none";
}
function Ma(e, t, n) {
	let r = e?.states[n]?.attributes, i = (e) => e == null || e === "" || !Number.isFinite(Number(e)) ? null : Number(e);
	return {
		current: i(r?.current_temperature ?? t?.current_temperature),
		target: i(r?.temperature ?? t?.temperature)
	};
}
function Na(e, t) {
	let { current: n, target: i } = t;
	return n !== null && i !== null ? e("devices.card.climate", {
		current: r(e.lang, n, 1),
		target: r(e.lang, i, 1)
	}) : n === null ? void 0 : e("devices.card.temp", { value: r(e.lang, n, 1) });
}
function Pa(e, t, n, r) {
	if (!n?.kind || n.kind === "legacy") return;
	if (n.override?.reason === "off") return e("week.why.off_by_hand");
	let i = n.target;
	if (n.kind === "device") {
		let n = i?.preset;
		if (!i) return e("week.as_is");
		if (i.hvac === "off") return e("week.state_off");
		if (!n) return;
		let a = (t.week_presets ?? []).indexOf(n);
		return sa(e("week.profile", { n: Da(n, Math.max(0, a)) }), r[n]?.name);
	}
	return n.profile?.index == null ? i ? i.hvac === "off" ? e("week.state_off") : void 0 : e("week.as_is") : sa(e("week.profile", { n: n.profile.index + 1 }), n.profile.name);
}
function Fa(e, t, n) {
	if (t?.why) return e.optional(`week.why.${t.why}`, { min: n }) ?? e.optional(`climate.why.${t.why}`);
}
function Ia(e, t, n) {
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
var La = {
	tab: "household",
	section: "days"
}, Ra = {
	tab: "household",
	section: "night"
}, za = [
	"auto",
	"surplus",
	"cheap"
], J = class extends u {
	constructor(...e) {
		super(...e), this.prefix = D, this.devices = [], this.picking = !1, this.query = "", this.holdUntil = {}, this.pending = {}, this.moved = {}, this.weekError = {};
	}
	static {
		this.styles = [
			p,
			U,
			g`
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
			let e = this.state?.config.climate?.rooms ?? {}, t = Object.fromEntries(Object.entries(this.pending).filter(([t, n]) => Oa(e[t]?.device_profiles ?? {}) !== Oa(n)));
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
		if (!e || !t || !n) return E;
		if (n.unassigned && n.consumer) return this.renderUnassigned(e, t, n, n.consumer);
		let r = this.ctx, i = Nr(r, n), a = Object.fromEntries((this.found?.devices ?? []).map((e) => [e.entity_id, e.name])), o = i.log ? {
			...i.log,
			names: a
		} : void 0, s = n.climate ?? this.found?.devices.find((e) => e.entity_id === n.id);
		if (!s) return Lr(r, {
			...i,
			log: o
		});
		let c = s.entity_id, l = t.climate?.rooms?.[c], u = ka(s, t.config.climate?.rooms?.[c], l, this.profilesOf(c)), d = t.climate?.rates?.[c];
		return x`${Lr(r, {
			...i,
			live: Na(e, Ma(this.hass, s, c)),
			why: this.renderWhy(e, s, u, l),
			head: this.renderHead(e, t, s, u, l),
			now: u.room.enabled ? this.renderNowSection(e, s, u, l) : void 0,
			steer: this.renderSteer(e, t, s, u, l),
			power: this.renderPower(e, t, n, s),
			learned: u.room.enabled || d ? x`<p class="learned-line">${Ci(e, d)}</p>` : void 0,
			learnedArea: "climate",
			log: o,
			tips: { power: "climate_meter" }
		})}
    ${this.sub === "week" ? this.renderWeekSheet(e, t, s) : E}`;
	}
	nowShown(e, t) {
		if (!e.room.enabled || !t?.kind || t.kind === "legacy") return !1;
		if (e.cooling && !e.programs.length) return !!e.room.week?.enabled && e.sets.length > 0 && t.pending !== "start";
		let n = this.profilesOf(this.entry?.id ?? ""), r = e.programs.flatMap((e) => n[e]?.tags ?? []);
		return e.programs.length > 0 && r.length > 0 && t.kind === "device";
	}
	renderWhy(e, t, n, r) {
		if (!n.room.enabled) return e("climate.room.off");
		let i = n.cooling && !n.programs.length && n.room.week?.enabled && n.sets.length && r?.pending !== "start" && r?.kind === "legacy" ? x`<span class="week-now quiet">
            ${e("week.legacy_now", { state: this.hvacText(e, this.hass?.states[t.entity_id]?.state ?? t.state) })}
          </span>` : E, a = r && n.legacy ? e.optional(`climate.now.${r.why}`, { min: this.awayAfter }) ?? "" : "";
		return x`${this.nowShown(n, r) ? this.nowLine(e, t, r) : E} ${i}
    ${a ? x`<span class="week-now quiet">${a}</span>` : E}`;
	}
	nowLine(e, t, n) {
		let i = n.override;
		if (i?.reason === "off") return x`<span class="week-now"><ha-icon icon="mdi:power"></ha-icon><span>${e("week.override.off")}</span></span>`;
		if (i) {
			let t = i.reason === "preset" ? i.until ? e("week.override.preset", { time: i.until }) : e("week.override.preset_open") : i.until ? e("week.override.manual", { time: i.until }) : e("week.override.manual_open");
			return x`<span class="week-now"><ha-icon icon="mdi:hand-back-right-outline"></ha-icon><span>${t}</span></span>`;
		}
		let a = n.target, o = [];
		if (n.kind === "device") {
			let n = a?.preset;
			if (!a) o.push(e("week.as_is"));
			else if (a.hvac === "off") o.push(e("week.state_off"));
			else if (n) {
				let r = (t.week_presets ?? []).indexOf(n), i = e("week.profile", { n: Da(n, Math.max(0, r)) });
				o.push(sa(i, this.profilesOf(t.entity_id)[n]?.name));
			}
		} else {
			if (o.push(a ? a.hvac === "off" ? e("week.state_off") : e(`week.mode.${n.mode === "heat" ? "heat" : "cool"}`) : e("week.as_is")), n.profile?.index != null) {
				let t = sa(e("week.profile", { n: n.profile.index + 1 }), n.profile.name);
				o.push(n.profile.held && n.why !== "held" ? `${t} (${e("week.held")})` : t);
			}
			a && a.hvac !== "off" && a.temperature != null && o.push(`${r(e.lang, a.temperature, 1)} °C`), n.next && o.push(e("week.next", {
				time: n.next.at,
				value: this.valueText(e, n.next.value)
			}));
		}
		let s = e.optional(`week.why.${n.why}`, { min: this.awayAfter });
		return x`<span class="week-now">
      <span>${e(n.would ? "week.would" : "week.now", { text: o.join(" · ") || "–" })}</span>
      ${s ? x`<span class="chip">${s}</span>` : E}
    </span>`;
	}
	valueText(e, t) {
		return t === "off" ? e("week.off") : `${r(e.lang, t, 1)} °C`;
	}
	renderHead(e, t, n, r, i) {
		let a = this.nowShown(r, i) ? this.weekError[n.entity_id] ?? i?.error : void 0, o = t.config.climate?.enabled;
		return x`<div class="head-extra">
      ${a ? x`<div class="note warn" role="alert">
            <ha-icon icon="mdi:alert-outline"></ha-icon>
            <span>${e.optional(`week.error.${a}`) ?? e("week.error", { error: a })}</span>
          </div>` : E}
      ${!o && r.room.enabled ? K(e, this.prefix, {
			label: e("climate.enabled"),
			value: e("climate.device.main_off"),
			to: {
				tab: "devices",
				section: "climate"
			}
		}) : E}
      <details class="ent" data-notip><summary>${e("climate.entity")}</summary><code>${n.entity_id}</code></details>
    </div>`;
	}
	renderNowSection(e, t, n, r) {
		let i = this.nowShown(n, r) && r?.override && r.override.reason !== "off", a = n.cooling && !n.programs.length && !!n.room.week?.enabled && n.sets.length > 0;
		if (i || a) return x`${i ? x`<div class="row" data-tipped>
          <span>${e("week.why.override")}</span>
          <button type="button" class="btn btn-secondary" @click=${() => void this.resume(t)}>${e("week.resume")}</button>
          ${v(e, "week_resume")}
        </div>` : E}
    ${a ? this.renderHold(e, t, n.room, n.sets, r) : E}`;
	}
	renderHold(e, t, n, r, i) {
		let a = t.entity_id, o = i?.mode ?? this.hass?.states[a]?.state ?? t.state, s = n.week?.modes?.[o === "heat" ? "heat" : "cool"] ?? r[0], c = i?.hold ?? null, l = c && c.mode === o ? c : null, u = l ? l.profile : null, d = l ? l.until ? "midnight" : "forever" : this.holdUntil[a] ?? "midnight", f = (t) => sa(e("week.profile", { n: t.profile + 1 }), n.week?.modes?.[t.mode]?.[t.profile]?.name), p = i?.want, m = l && (p === "night" || p === "away") ? p : null;
		return x`<div data-tipped>
      <div class="row">
        <span>${e("week.hold")}</span>
        ${v(e, "week_hold")}
      </div>
      <div class="row hold">
        <select
          class="input"
          aria-label=${e("week.hold")}
          .value=${u == null ? "" : String(u)}
          @change=${(e) => {
			let n = e.target.value;
			this.hold(t, n === "" ? null : Number(n), d);
		}}
        >
          <option value="" ?selected=${u == null}>${e("week.hold.auto")}</option>
          ${s.map((t, n) => x`<option value=${String(n)} ?selected=${u === n}>${sa(e("week.profile", { n: n + 1 }), t.name)}</option>`)}
        </select>
        <span class="seg" role="group" aria-label=${e("week.hold.until")}>
          ${["midnight", "forever"].map((n) => x`<button
              type="button"
              aria-pressed=${String(d === n)}
              @click=${() => {
			l ? n !== d && this.hold(t, l.profile, n) : this.holdUntil = {
				...this.holdUntil,
				[a]: n
			};
		}}
            >
              ${e(`week.hold.${n}`)}
            </button>`)}
        </span>
      </div>
      ${m && l ? x`<p class="hint">${e(`week.hold.later_${m}`, { profile: f(l) })}</p>` : E}
      ${c && !l ? x`<div class="note" role="status">
            <ha-icon icon="mdi:information-outline"></ha-icon>
            <span class="note-body">
              <span>
                ${e("week.hold.other_mode", {
			profile: f(c),
			mode: e(`week.mode.${c.mode}`),
			until: e(`week.hold.${c.until ? "midnight" : "forever"}`)
		})}
              </span>
              <button type="button" class="mini-btn" @click=${() => void this.hold(t, null, d)}>${e("week.hold.lift")}</button>
            </span>
          </div>` : E}
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
		let { room: a, cooling: o, presets: s, programs: c, sets: l, deviceRuns: u, legacy: d, awayTagged: f, awayWays: p, away: m } = r;
		return x`<div class="row" data-tipped>
        <span>${e("climate.room.steer")}</span>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(a.enabled)}
          aria-label=${e("climate.room.enabled", { name: n.name })}
          @click=${() => this.save(n, { enabled: !a.enabled })}
        ></button>
        ${v(e, "climate_room")}
      </div>
      ${a.enabled ? x`${o && !c.length ? this.renderWeek(e, n, a, l, i) : E}
          ${c.length ? this.renderPrograms(e, n, c, i) : E}
          ${!f || d ? x`<div class="row" data-tipped>
                  <span>${e("climate.away")}</span>
                  <span class="seg" role="group" aria-label=${e("climate.away")}>
                    ${p.map((t) => x`<button type="button" aria-pressed=${String(m === t)} @click=${() => this.save(n, { away: t })}>
                        ${e(u && t === "setback" ? "devprof.away_keep" : `climate.away.${t}`)}
                      </button>`)}
                  </span>
                  ${v(e, d ? "climate_away" : u ? "devprof_away" : "week_away")}
                </div>
                ${d ? E : x`<p class="hint">${e("week.away_fallback")}</p>`}
                ${m === "setback" && !u ? x`<div class="row" data-tipped>
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
                      ${v(e, d ? "climate_away" : "week_away")}
                    </div>` : E}
                ${d && a.away === "preset" ? x`<div data-tipped>
                      ${this.presetRow(e, n, s, "away_preset", a.away_preset, "climate.away_preset")}
                    </div>` : E}` : E}
          ${d && s.length ? x`<div data-tipped>
                ${this.presetRow(e, n, s, "free_day_preset", a.free_day_preset, "climate.free_day_preset", !0)}
              </div>` : E}
          ${o ? this.renderNight(e, t, n, a) : E}` : E}`;
	}
	daysLink(e) {
		return x`<a class="mini-btn quiet" href=${T(this.prefix, La)} @click=${w(La)}>
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
		return x`<div class="sub" data-tipped>
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
        ${v(e, "climate_week")}
      </div>
      ${i?.pending ? x`<p class="hint">${e(i.pending === "start" ? "week.pending.start" : "week.pending.end")}</p>` : E}
      ${a ? x`${r.length ? E : x`<p class="hint">${e("week.no_sets")}</p>`}
            <div class="row">
              <a class="btn btn-secondary" href=${T(this.prefix, o)} @click=${w(o, { sheet: !0 })}>
                <ha-icon icon="mdi:calendar-clock"></ha-icon>${e("week.edit")}
              </a>
            </div>` : E}
    </div>`;
	}
	renderPrograms(e, t, n, r) {
		let i = this.profilesOf(t.entity_id), a = n.flatMap((e) => i[e]?.tags ?? []), o = this.state?.climate?.day, s = !o || o.home_office_available, c = o?.home_office_reason ?? "no_calendar", l = this.hass?.states[t.entity_id]?.state ?? t.state;
		return x`<div class="sub" data-tipped>
      <div class="row">
        <span class="sub-title">${e("devprof.title")}</span>
        ${v(e, "climate_device_profiles")}
      </div>
      ${r?.pending ? x`<p class="hint">${e(r.pending === "start" ? "devprof.pending.start" : "devprof.pending.end")}</p>` : E}
      ${n.map((r, a) => {
			let o = i[r] ?? {
				name: "",
				tags: []
			}, l = e("week.profile", { n: Da(r, a) });
			return x`<div class="preset">
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
            ${Dn.map((i) => {
				let a = o.tags.includes(i), l = i === "home_office" && !s && !a;
				return x`<button
                type="button"
                class="mini-btn tag-btn"
                aria-pressed=${String(a)}
                ?disabled=${l}
                title=${l ? e(`week.ho.${c}`) : ""}
                @click=${() => this.toggleProgramTag(e, t, n, r, i)}
              >
                <ha-icon icon=${ca[i]}></ha-icon>${e(`week.tag.${i}`)}
              </button>`;
			})}
          </div>
        </div>`;
		})}
      ${this.moved[t.entity_id] ? x`<div class="note" role="status"><ha-icon icon="mdi:information-outline"></ha-icon><span>${this.moved[t.entity_id]}</span></div>` : E}
      ${a.length && !a.includes("normal") ? x`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("devprof.need_normal")}</span></div>` : E}
      ${r?.why === "manual_mode" ? x`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("devprof.not_auto", { state: this.hvacText(e, l) })}</span>
          </div>` : E}
      ${s ? E : x`<p class="hint">${e(`week.ho.${c}`)}</p>
            <div class="row">${this.daysLink(e)}</div>`}
    </div>`;
	}
	toggleProgramTag(e, t, n, r, i) {
		let a = this.profilesOf(t.entity_id), o = (a[r]?.tags ?? []).includes(i), s = o ? void 0 : n.find((e) => e !== r && a[e]?.tags.includes(i)), c = (t) => a[t]?.name || e("week.profile", { n: Da(t, n.indexOf(t)) });
		this.moved = {
			...this.moved,
			[t.entity_id]: s ? e("devprof.moved", {
				tag: e(`week.tag.${i}`),
				to: c(r),
				from: c(s)
			}) : ""
		};
		let l = o ? a[r].tags.filter((e) => e !== i) : Dn.filter((e) => e === i || a[r]?.tags.includes(e));
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
		Oa(o) !== Oa(a) && (this.pending = {
			...this.pending,
			[i]: o
		}, M(this, { climate: { rooms: { [i]: { device_profiles: o } } } }).then((e) => {
			if (!e && this.pending[i] === o) {
				let { [i]: e, ...t } = this.pending;
				this.pending = t;
			}
		}));
	}
	presetRow(e, t, n, r, i, a, o = !1) {
		return x`<div class="row">
      <span>${e(a)}</span>
      <select
        class="input"
        aria-label=${e(a)}
        @change=${(e) => this.save(t, { [r]: e.target.value || null })}
      >
        ${o ? x`<option value="" ?selected=${!i}>${e("climate.no_preset")}</option>` : E}
        ${!o && !i ? x`<option value="" selected disabled>${e("climate.pick_preset")}</option>` : E}
        ${n.map((e) => x`<option value=${e} ?selected=${e === i}>${e}</option>`)}
      </select>
      ${v(e, o ? "climate_free_day" : "climate_away")}
    </div>`;
	}
	renderNight(e, t, n, r) {
		let i = (t, r) => x`<input
      class="input short"
      type="time"
      aria-label=${e(`climate.${t}`)}
      .value=${r}
      @change=${(e) => {
			let r = e.target.value;
			/^\d{1,2}:\d{2}$/.test(r) && this.save(n, { [t]: r });
		}}
    />`, a = Ia(e, this.hass, t);
		return x`<div class="sub" data-tipped>
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
        ${v(e, "climate_night")}
      </div>
      ${r.night_off ? t.config.climate?.night_by === "entity" ? x`<div class="row">
              <span>${e("climate.night_back")}</span>
              ${i("night_until", r.night_until)}
            </div>` : x`<div class="row">
              <span>${e("climate.night_span")}</span>
              ${i("night_from", r.night_from)} – ${i("night_until", r.night_until)}
            </div>` : E}
      <div class="night-mirror">
        ${K(e, this.prefix, {
			label: e("climate.mirror.night"),
			value: a.text,
			to: Ra,
			action: a.set ? "change" : "set"
		})}
      </div>
    </div>`;
	}
	save(e, t) {
		M(this, { climate: { rooms: { [e.entity_id]: t } } });
	}
	renderPower(e, t, n, r) {
		let i = t.config.climate?.rooms ?? {}, a = (this.found?.devices ?? []).filter((e) => Aa(e, i, this.found)), o = a.some((e) => e.entity_id === r.entity_id), s = this.movedNote(e);
		if (o || n.consumer || s) return x`${o ? x`<p class="hint">${e("climate.meters.say")}</p>
          ${(this.found?.meters ?? []).length ? E : x`<p class="hint">${e("climate.meter.no_meters")}</p>`}
          ${this.meterLine(e, r, a, i)}` : E}
    ${n.consumer ? this.consumerRows(e, n.consumer) : E} ${s}`;
	}
	meterLine(e, t, n, r) {
		let i = r[t.entity_id]?.meter ?? null, a = i && i !== "none" ? i : null, o = i == null ? this.found?.suggested?.[t.entity_id] : void 0, s = a ? n.filter((e) => e.entity_id !== t.entity_id && this.sameMeter(r[e.entity_id]?.meter, a)) : [], l = a?.power ? this.hass?.states[a.power] : void 0, u = a ? this.option(a) ?? null : o ?? null;
		return x`<div class="meter">
      <div class="meter-pick">
        ${this.picking ? this.meterSearch(e, t) : x`<span class="picked-row">
              <span class="picked">
                ${u ? x`<b>${c(u.device_id, `${u.name ?? u.device_id}${u.sensor ? ` · ${u.sensor}` : ""}`, e("climate.open_meter"))}</b>
                      ${u.via ? x`<small class="via">${u.via}</small>` : E}
                      ${u.area ? x`<small>${u.area}</small>` : E}` : a ? x`<b>${c(a.device_id, a.power ?? a.energy ?? a.device_id, e("climate.open_meter"))}</b>` : x`<small>${e(i === "none" ? "climate.meter.without_long" : "climate.meter.open_long")}</small>`}
              </span>
              ${u ? H(e, this.meterTarget(u)) : a ? H(e, this.meterTarget(a)) : E}
            </span>`}
      </div>
      ${this.picking ? E : x`<div class="state">
            ${a ? x`<span class="chip ok">${l ? this.reading(e, l) : e("climate.meter.linked")}</span>
                  <button type="button" class="mini-btn" @click=${() => this.startPicking()}>${e("climate.meter.change")}</button>` : o ? x`<button type="button" class="btn btn-secondary" @click=${() => this.save(t, { meter: this.meterOf(o) })}>
                      ${e("climate.meter.confirm")}
                    </button>
                    <button type="button" class="mini-btn" @click=${() => this.startPicking()}>${e("climate.meter.other_short")}</button>` : x`<button type="button" class="mini-btn" @click=${() => this.startPicking()}>${e("climate.meter.search")}</button>`}
          </div>`}
      ${a?.power || a?.energy ? x`<details class="ent">
            <summary>${e("climate.entities")}</summary>
            ${a.power ? x`<code>${a.power}</code>` : E}
            ${a.energy ? x`<code>${a.energy}</code>` : E}
          </details>` : E}
      ${s.length ? x`<p class="hint">${e("climate.meter.shared", { names: s.map((e) => e.name).join(", ") })}</p>` : E}
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
		return x`<input
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
        ${r.map((n) => x`<div class="hit-row">
            <button type="button" role="option" class="hit" @click=${() => this.pickMeter(t, this.key(n))}>
              <b>${n.name ?? n.device_id}${n.sensor ? ` · ${n.sensor}` : ""}</b>
              <small>${[
			n.via,
			n.area,
			n.power ? this.readingOf(e, n.power) : ""
		].filter(Boolean).join(" · ")}</small>
            </button>
            ${H(e, this.meterTarget(n))}
          </div>`)}
        ${r.length ? E : x`<small class="none">${e("climate.meter.no_hits")}</small>`}
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
		return `${t.state !== "" && Number.isFinite(n) ? r(e.lang, n, n % 1 ? 1 : 0) : t.state} ${String(t.attributes.unit_of_measurement ?? "")}`.trim();
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
		return x`<div class="consumer">
      <div class="consumer-name">
        <span>${e("climate.consumer")}</span><b>${t.name}</b>${n ? x`<span>${n}</span>` : E}
      </div>
      <div class="row" data-tipped>
        <span>${e("consumers.kind")}</span>
        <select
          class="input"
          aria-label=${e("consumers.kind_of", { name: t.name })}
          .value=${t.kind}
          @change=${(e) => this.setKind(t, e.target.value)}
        >
          ${wn.map((n) => x`<option value=${n} ?selected=${n === t.kind}>${e(`kind.${n}`)}</option>`)}
        </select>
        ${v(e, "f_consumer_kind")}
      </div>
      ${t.kind === "submeter" ? E : x`<div class="row" data-tipped>
            <span>${e("consumers.runs")}</span>
            <select
              class="input"
              aria-label=${e("consumers.runs_of", { name: t.name })}
              .value=${r}
              @change=${(e) => this.setRuns(t, e.target.value)}
            >
              ${za.map((t) => x`<option value=${t} ?selected=${t === r}>${e(`runs.${t}`)}</option>`)}
            </select>
            ${v(e, "f_consumer_runs")}
          </div>`}
    </div>`;
	}
	setKind(e, t) {
		t !== e.kind && (this.kindChanged = e.id, M(this, { consumers: { [e.id]: { kind: t } } }));
	}
	setRuns(e, t) {
		t !== (e.runs ?? "auto") && M(this, { consumers: { [e.id]: { runs: t } } });
	}
	movedNote(e) {
		let t = this.kindChanged, n = t ? this.devices.find((e) => e.group !== "climate" && (e.consumer?.id === t || e.id === t)) : void 0;
		if (!n) return;
		let r = P(n);
		return x`<div class="note" role="status">
      <ha-icon icon="mdi:information-outline"></ha-icon>
      <a class="mini-btn go" href=${T(this.prefix, r)} @click=${w(r)}
        >${e("climate.moved", {
			name: n.name,
			group: e(`nav.devices.${n.group}`)
		})}</a
      >
    </div>`;
	}
	renderUnassigned(e, t, n, r) {
		let i = this.ctx, a = this.found?.devices ?? [], o = t.config.climate?.rooms ?? {}, s = r.power_entity ? this.readingOf(e, r.power_entity) : "", c = n.deviceId && a.length ? x`<div class="row" data-tipped>
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
              ${a.map((t) => x`<option value=${t.entity_id}>
                  ${ja(o[t.entity_id]) ? e("climate.assign.has_meter", { name: t.name }) : t.name}${t.area ? ` · ${t.area}` : ""}
                </option>`)}
            </select>
            ${v(e, "climate_assign")}
          </div>` : x`<p class="hint">${e(n.deviceId ? "climate.assign.no_climate" : "climate.assign.no_device")}</p>`;
		return Lr(i, {
			...Nr(i, n),
			live: s || void 0,
			why: e("climate.unassigned.lead"),
			power: x`${c} ${this.consumerRows(e, r)} ${this.movedNote(e) ?? E}`
		});
	}
	async assign(e, t, n) {
		if (!e.deviceId) return;
		let r = {
			device_id: e.deviceId,
			power: t.power_entity,
			energy: t.energy_entity
		};
		await M(this, { climate: { rooms: { [n]: { meter: r } } } }) && C(this, {
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
		}, i = this.route?.rest?.[0], a = On.find((e) => e === i);
		return x`<joe-sheet label=${e("week.label")} closeLabel=${e("common.close")} wide @joe-close=${() => ge(this, r)}>
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
		C(this, this.weekRoute(e, t), {
			replace: !0,
			sheet: n
		});
	}
};
f([o({ attribute: !1 })], J.prototype, "hass", void 0), f([o({ attribute: !1 })], J.prototype, "t", void 0), f([o({ attribute: !1 })], J.prototype, "state", void 0), f([o({ attribute: !1 })], J.prototype, "route", void 0), f([o({ attribute: !1 })], J.prototype, "prefix", void 0), f([o({ attribute: !1 })], J.prototype, "found", void 0), f([o({ attribute: !1 })], J.prototype, "devices", void 0), f([o({ attribute: !1 })], J.prototype, "entry", void 0), f([o({ attribute: !1 })], J.prototype, "sub", void 0), f([b()], J.prototype, "picking", void 0), f([b()], J.prototype, "query", void 0), f([b()], J.prototype, "holdUntil", void 0), f([b()], J.prototype, "pending", void 0), f([b()], J.prototype, "moved", void 0), f([b()], J.prototype, "weekError", void 0), f([b()], J.prototype, "kindChanged", void 0), h("joe-climate-device", J);
//#endregion
//#region src/pages/devices/climate.ts
var Ba = {
	tab: "household",
	section: "days"
}, Va = class extends W {
	constructor(...e) {
		super(...e), this.failed = !1, this.list = [];
	}
	static {
		this.styles = [
			p,
			U,
			g`
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
		].some((t) => e.has(t)) && (this.list = !this.climateFound && this.own && this.t && this.state ? nt(this.t, this.state, this.hass, {
			climateFound: this.own,
			discovery: this.discovery,
			checks: this.checks
		}) : this.devices);
	}
	render() {
		let { t: e, state: t } = this;
		if (!e || !t) return E;
		let n = this.entity ? it(this.list, "climate", this.entity) : void 0;
		if (n) return x`<joe-climate-device
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
		}, i = this.found, a = this.list.filter((e) => e.group === "climate" && !e.unassigned), o = this.list.filter((e) => e.group === "climate" && e.unassigned), s = [...new Set(a.map((t) => t.area ?? e("climate.no_area")))], c = (i?.devices ?? []).filter((e) => Aa(e, r.rooms ?? {}, i)), l = c.filter((e) => ja(r.rooms?.[e.entity_id]) || a.some((t) => t.id === e.entity_id && t.consumer)).length;
		return x`<div class="wrap">
      <div class="intro">
        <div>
          ${d(e("climate.title"))} ${y}
          <p class="lead">${e("climate.lead")}</p>
          ${a.length ? x`<p class="with-tip" data-tipped>${e("climate.ha_open")} ${v(e, "ha_open")}</p>` : E}
        </div>
        <joe-pose name="relax"></joe-pose>
      </div>
      ${this.entity === void 0 ? E : this.renderLost(e)} ${this.renderMain(e, t, r.enabled)}
      ${this.renderHousehold(e, t)}
      ${this.failed && !i ? x`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("climate.failed")}</span></div>` : E}
      ${i && !i.devices.length ? x`<p class="hint">${e("climate.none")}</p>` : E}
      ${a.length ? x`<div class="list-head">
            <h3 class="group-label">${e("climate.list")}</h3>
            ${c.length ? x`<span class="chip">${e("climate.meters.count", {
			linked: l,
			all: c.length
		})}</span>` : E}
          </div>` : E}
      ${s.map((n) => x`<div class="group-label area">${n}</div>
          <div class="dcards">
            ${a.filter((t) => (t.area ?? e("climate.no_area")) === n).map((n) => this.renderCard(e, t, n))}
          </div>`)}
      ${o.length ? x`<div class="group-head list-head">
              <span class="group-label">${e("devices.unassigned")}</span><i class="dcard-dot" aria-hidden="true"></i>
            </div>
            <p class="unassigned-text">${e("devices.unassigned.text")}</p>
            <div class="dcards">
              ${o.map((n) => gr(e, this.prefix, yr(e, this.hass, t, n)))}
            </div>` : E}
    </div>`;
	}
	renderLost(e) {
		let t = this.entity, n = this.list.find((e) => e.group !== "climate" && (e.id === t || e.consumer?.id === t));
		if (!n) return jr(e);
		let r = P(n);
		return x`<div class="note" role="status">
      <ha-icon icon="mdi:information-outline"></ha-icon>
      <a class="mini-btn go" href=${T(this.prefix, r)} @click=${w(r, { replace: !0 })}
        >${e("climate.moved", {
			name: n.name,
			group: e(`nav.devices.${n.group}`)
		})}</a
      >
    </div>`;
	}
	renderCard(e, t, n) {
		let r = n.climate, i = t.climate?.rooms?.[n.id], a = t.config.climate?.rooms?.[n.id], o = Na(e, Ma(this.hass, r, n.id)), s = r && a?.enabled ? Pa(e, r, i, a.device_profiles ?? {}) : void 0, c = a?.enabled ? Fa(e, i, t.config.climate?.away_after_min ?? 15) : void 0, l = ja(a) || n.consumer, u = x`${o ? x`<span class="cl">${o}</span>` : E}
      ${s ? x`<span class="cl">${s}</span>` : E}
      ${c || l ? x`<span class="cl chips">
            ${c ? x`<span class="chip">${c}</span>` : E}
            ${l ? x`<span class="chip ok">${e("climate.card.measured")}</span>` : E}
          </span>` : E}`;
		return gr(e, this.prefix, yr(e, this.hass, t, n, {
			state: u,
			area: void 0
		}));
	}
	renderHousehold(e, t) {
		let n = t.config.context.presence_entity ?? null, r = n ? this.hass?.states[n]?.attributes.friendly_name ?? n : null, i = t.climate?.day, a = i ? i.holiday ? "holiday" : i.weekend && i.free ? "weekend" : "workday" : null, o = a ? [e(`climate.mirror.today.${a}`), i?.home_office_available && i.home_office.length ? e("climate.mirror.today.ho", { names: i.home_office.join(", ") }) : ""].filter(Boolean).join(", ") : e("climate.mirror.unknown"), s = Ia(e, this.hass, t);
		return x`<section class="card household">
      ${K(e, this.prefix, {
			label: e("climate.mirror.presence"),
			value: r ? x`<span title=${n ?? ""}>${r}</span>` : e("climate.mirror.presence.none"),
			to: {
				tab: "household",
				section: "presence"
			},
			action: r ? "change" : "set"
		})}
      ${K(e, this.prefix, {
			label: e("climate.mirror.today"),
			value: o,
			to: Ba
		})}
      ${K(e, this.prefix, {
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
		return x`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:thermostat-auto"></ha-icon>${e("climate.enabled")}</div>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(n)}
          aria-label=${e("climate.enabled")}
          @click=${() => M(this, { climate: { enabled: !n } })}
        ></button>
        ${v(e, "climate_enabled")}
      </div>
      <p class="hint">${e(t.mode === "live" ? "climate.live" : "climate.not_live")}</p>
    </section>`;
	}
};
f([o({ attribute: !1 })], Va.prototype, "entity", void 0), f([o({ attribute: !1 })], Va.prototype, "sub", void 0), f([b()], Va.prototype, "own", void 0), f([b()], Va.prototype, "failed", void 0), h("joe-climate-group", Va);
//#endregion
//#region src/components/finding-rows.ts
var Ha = g`
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
function Y(e, t, n, r = !1) {
	return x`<button type="button" class="mini-btn ${r ? "quiet" : ""}" @click=${n}>
    ${t ? x`<ha-icon icon=${t}></ha-icon>` : E}${e}
  </button>`;
}
function Ua(e) {
	return x`<div class="note"><ha-icon icon="mdi:information-outline"></ha-icon><span>${e}</span></div>`;
}
function Wa(e, t) {
	let n = t.aside && t.aside !== E;
	return x`<li class="item ${t.state ?? ""} ${n ? "has-aside" : ""}" ?data-tipped=${!!(t.actions?.length && t.tip)}>
    <span class="ico-box"><ha-icon icon=${t.icon}></ha-icon></span>
    <div class="text">
      <div class="head">
        <span class="t">${t.title}</span>
        ${t.chips?.length ? x`<span class="chips">${t.chips}</span>` : E}
      </div>
      <div class="d">${t.detail}</div>
      ${t.reasons?.length ? x`<details data-notip>
            <summary>${e("scan.why")}</summary>
            <ul>
              ${t.reasons.map((t) => x`<li>${Se(e, t)}</li>`)}
            </ul>
          </details>` : E}
      ${t.notes ?? E}
      ${t.actions?.length ? x`<div class="row-actions">${t.actions}${t.tip ? v(e, t.tip) : E}</div>` : E}
    </div>
    ${n ? x`<span class="row-aside">${t.aside}</span>` : E}
  </li>`;
}
function Ga(e, t) {
	return x`<ul class="found">
    ${t.map((t) => Wa(e, t))}
  </ul>`;
}
var Ka = {
	weather: "weather_entity",
	holiday: "holiday_entity"
};
function qa(e, n, r, i, o, s, c) {
	let l = Ka[s], u = i.context[l], d = o?.[s] ?? null, f = {
		key: s,
		icon: s === "weather" ? "mdi:weather-partly-cloudy" : "mdi:calendar-star",
		title: r(s === "weather" ? "find.weather" : "find.holiday"),
		tip: s === "weather" ? "review_weather" : "review_holiday"
	}, p = () => void Ja(e, r, i, o, s);
	if (u) {
		let o = d?.entity.entity_id === u;
		return {
			...f,
			detail: O(n, u),
			chips: [t(r, k(i, `context.${l}`)), ...d && o ? [a(r, d.confidence)] : []],
			reasons: o ? d?.reasons : void 0,
			aside: c?.(u),
			actions: [Y(r("review.change"), "mdi:magnify", p), Y(r("review.ignore"), "", () => M(e, {
				context: { [l]: null },
				answers: { ignored: j(i, s, !0) }
			}), !0)]
		};
	}
	return A(i, s) ? {
		...f,
		detail: r("review.ignored"),
		state: "ignored",
		actions: [Y(r("review.use"), "mdi:undo-variant", p)]
	} : {
		...f,
		detail: r("find.none"),
		state: "missing",
		notes: [Ua(r(s === "weather" ? "review.weather.none" : "review.holiday.none"))],
		actions: [Y(r("review.choose"), "mdi:magnify", p)]
	};
}
async function Ja(e, t, n, r, i) {
	let a = Ka[i], o = r?.[i], s = n.context[a], c = (await N(e, {
		heading: t(i === "weather" ? "pick.weather.title" : "pick.holiday.title"),
		tip: i === "weather" ? "pick_weather" : "pick_holiday",
		filter: i === "weather" ? "weather" : "workday",
		selected: s ? [s] : o ? [o.entity.entity_id] : [],
		suggestions: Be(o ? [Ve(o)] : [], o?.alternatives)
	}))?.selected[0];
	c && M(e, {
		context: { [a]: c },
		answers: { ignored: j(n, i, !1) }
	});
}
function Ya(e, t, n) {
	let [i, a] = e(n).split("|");
	return `${r(e.lang, t, 0)} ${t === 1 ? i : a}`;
}
function Xa(e, t, n = []) {
	return x`<div class="note ${t.level}">
    <ha-icon icon=${t.level === "warn" ? "mdi:alert-outline" : "mdi:information-outline"}></ha-icon>
    <div>
      <span>${Le(e, t)}</span>
      ${n.length ? x`<div class="note-actions">${n}</div>` : E}
    </div>
  </div>`;
}
function Za(e, t, n, r) {
	M(e, {
		...r,
		answers: { ignored: j(t, n, !0) }
	});
}
function Qa(e, t, n) {
	M(e, { answers: { confirmed: [...t.answers.confirmed.filter((e) => e !== n), n] } });
}
function $a(e) {
	let { t: n } = e, r = e.discovery?.energy_dashboard;
	return r?.configured ? {
		key: "energy",
		icon: "mdi:lightning-bolt",
		title: n("find.energy"),
		detail: n("find.energy.detail", {
			grid: Ya(n, r.grid ?? 0, "word.grid"),
			solar: Ya(n, r.solar ?? 0, "word.solar"),
			battery: Ya(n, r.battery ?? 0, "word.battery"),
			devices: Ya(n, r.devices ?? 0, "word.device")
		}),
		chips: [t(n, { source: "read" })]
	} : null;
}
function eo(e, n = {}) {
	let { t: r, config: i, discovery: o } = e, s = i.tariff, c = s.kind === "unknown";
	return {
		key: "tariff",
		icon: "mdi:cash-clock",
		title: o?.tariff.provider ?? r("find.tariff"),
		detail: Ie(r, s),
		chips: c ? [] : [t(r, k(i, "tariff.kind")), ...o && o.tariff.kind !== "unknown" ? [a(r, o.tariff.confidence)] : []],
		reasons: o?.tariff.reasons,
		notes: c ? [Ua(n.missing ?? r("review.tariff.ask"))] : [],
		state: c ? "missing" : void 0,
		tip: "review_tariff",
		actions: n.actions
	};
}
function to(e) {
	let { t: n, config: i, from: o } = e, s = e.discovery?.forecast, c = {
		key: "forecast",
		icon: "mdi:weather-sunny",
		title: n("find.forecast"),
		tip: "review_forecast"
	};
	return i.forecast.provider ? {
		...c,
		detail: s ? n("find.forecast.detail", {
			provider: s.provider_name,
			planes: Ya(n, s.planes, "word.plane"),
			today: s.today_kwh == null ? "–" : r(n.lang, s.today_kwh, 1),
			tomorrow: s.tomorrow_kwh == null ? "–" : r(n.lang, s.tomorrow_kwh, 1)
		}) : i.forecast.provider,
		chips: [t(n, k(i, "forecast.provider")), ...s ? [a(n, s.confidence)] : []],
		reasons: s?.reasons,
		actions: [Y(n("review.ignore"), "", () => Za(o, i, "forecast", { forecast: {
			provider: null,
			config_entries: [],
			today: [],
			tomorrow: [],
			remaining_today: [],
			alternatives: []
		} }), !0)]
	} : A(i, "forecast") && s ? {
		...c,
		detail: n("review.ignored"),
		state: "ignored",
		actions: [Y(n("review.use"), "mdi:undo-variant", () => no(e))]
	} : {
		...c,
		detail: n("find.none"),
		state: "missing",
		notes: [Ua(n("review.forecast.none"))],
		tip: void 0
	};
}
function no(e) {
	let t = e.discovery?.forecast;
	t && M(e.from, {
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
		answers: { ignored: j(e.config, "forecast", !1) }
	}, "read");
}
function ro(e, n, i = {}) {
	let { from: o, hass: s, t: c, config: l } = e, u = l.measurements[n], d = e.discovery?.measurements[n] ?? null, f = n === "grid_power", p = {
		key: n,
		icon: f ? "mdi:transmission-tower" : "mdi:home-lightning-bolt-outline",
		title: c(f ? "find.grid" : "find.home"),
		tip: f ? "review_grid" : "review_home"
	}, h = Y(c(u ? "review.change" : "review.choose"), "mdi:magnify", () => void ao(e, n)), g = i.devices ? [i.devices] : [];
	if (!u && !f && l.measurements.grid_power) return {
		...p,
		detail: c("review.home.balance"),
		notes: io(c, l),
		actions: [h, ...g]
	};
	if (!u) return A(l, n) ? {
		...p,
		detail: c("review.home.computed"),
		state: "ignored",
		actions: [h]
	} : {
		...p,
		detail: c("find.none"),
		state: "missing",
		notes: [Ua(c(f ? "review.grid.none" : "review.home.none"))],
		actions: f ? [h] : [h, Y(c("review.home.without"), "", () => Za(o, l, "home_power", { measurements: { home_power: null } }), !0)]
	};
	let _ = de(s, u), v = m(s, u.entity_id, c.lang);
	if (_ !== null) {
		let e = r(c.lang, Math.abs(_), 2);
		v = f ? c(_ >= 0 ? "live.import" : "live.export", { value: e }) : c("live.kw", { value: r(c.lang, _, 2) });
	}
	let ee = e.checks.filter((e) => e.code !== "missing" && (e.role === n || f && e.code === "grid_sign" || !f && e.code === "home_negative")), te = () => oo(o, n, {
		...u,
		invert: !u.invert
	}), y = ee.map((e) => e.code === "grid_sign" ? Xa(c, e, [Y(c("review.invert"), "mdi:swap-vertical", te), Y(c("review.keep"), "mdi:check", () => Qa(o, l, `grid_sign:${u.entity_id}`), !0)]) : e.code === "home_negative" ? Xa(c, e, [Y(c("review.invert"), "mdi:swap-vertical", te)]) : Xa(c, e)), b = ee.some((e) => e.level === "warn") ? "flag" : void 0, ne = O(s, u.entity_id), x = d?.entity.entity_id === u.entity_id;
	return !f && l.measurements.grid_power ? {
		...p,
		detail: `${c("review.home.balance")} · ${c("review.home.compare", {
			name: ne,
			live: v
		})}`,
		chips: [t(c, k(l, `measurements.${n}`))],
		notes: [...io(c, l), ...y],
		state: b,
		aside: e.aside?.(u.entity_id, ne),
		actions: [
			h,
			...g,
			Y(c("review.ignore"), "", () => Za(o, l, "home_power", { measurements: { home_power: null } }), !0)
		]
	} : {
		...p,
		detail: `${ne} · ${v}`,
		chips: [t(c, k(l, `measurements.${n}`)), ...d && x ? [a(c, d.confidence)] : []],
		reasons: x ? d?.reasons : void 0,
		notes: y,
		state: b,
		aside: e.aside?.(u.entity_id, ne),
		actions: [h, ...g]
	};
}
function io(e, t) {
	let n = [], i = Tn(t.consumers);
	if (i.length) {
		let t = i.map((t) => t.kind === "ev" || t.runs === "always" || !t.runs ? t.name : `${t.name} (${e(`runs.${t.runs}`)})`).join(", ");
		n.push(Ua(e(i.some((e) => e.kind === "ev") ? "review.home.flexible" : "review.home.flexible_some", { names: t })));
	} else t.consumers.some((e) => e.kind !== "submeter") && n.push(Ua(e("review.home.flexible_none")));
	let a = t.learned.home_check;
	if (a && a.calc_kwh > 0) {
		let t = (a.sensor_kwh - a.calc_kwh) / a.calc_kwh;
		Math.abs(t) >= .1 && n.push(Ua(e("review.home.off", {
			days: a.days,
			pct: r(e.lang, Math.abs(t) * 100, 0),
			direction: e(t < 0 ? "review.home.less" : "review.home.more")
		})));
	}
	return n;
}
async function ao(e, t) {
	let { t: n, config: r } = e, i = r.measurements[t], a = e.discovery?.measurements[t], o = t === "grid_power", s = await N(e.from, {
		heading: n(o ? "pick.grid.title" : "pick.home.title"),
		tip: o ? "pick_grid" : "pick_home",
		filter: "power",
		selected: i ? [i.entity_id] : [],
		suggestions: Be(a ? [Ve(a)] : [], a?.alternatives),
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
	A(r, t) && (l.answers = { ignored: j(r, t, !1) }), M(e.from, l);
}
function oo(e, t, n) {
	M(e, { measurements: { [t]: n } });
}
function so(e) {
	let { from: n, hass: i, t: o, config: s } = e, c = s.measurements.solar_power, l = e.discovery?.measurements.solar_power ?? null, u = {
		key: "solar_power",
		icon: "mdi:solar-panel",
		title: o("find.solar"),
		tip: "review_solar"
	}, d = (t) => Y(t, "mdi:magnify", () => void co(e));
	if (!c.length) return A(s, "solar_power") ? {
		...u,
		detail: o("review.solar.without"),
		state: "ignored",
		actions: [d(o("review.choose"))]
	} : {
		...u,
		detail: o("find.none"),
		state: "missing",
		actions: [d(o("review.choose")), Y(o("review.solar.none"), "", () => Za(n, s, "solar_power", { measurements: { solar_power: [] } }), !0)]
	};
	let f = ue(i, c), p = e.checks.filter((e) => e.role === "solar_power" && e.code !== "missing"), m = c.length === 1 ? c[0].entity_id : void 0;
	return {
		...u,
		detail: o("find.solar.detail", {
			count: Ya(o, c.length, "word.sensor"),
			total: f === null ? "–" : r(o.lang, f, 2)
		}),
		chips: [t(o, k(s, "measurements.solar_power")), ...l ? [a(o, l.confidence)] : []],
		reasons: l?.reasons,
		notes: p.map((e) => Xa(o, e)),
		state: p.some((e) => e.level === "warn") ? "flag" : void 0,
		aside: m ? e.aside?.(m, O(i, m)) : void 0,
		actions: [d(o("review.change"))]
	};
}
async function co(e) {
	let { t, config: n } = e, r = n.measurements.solar_power, i = e.discovery?.measurements.solar_power, a = await N(e.from, {
		heading: t("pick.solar.title"),
		tip: "pick_solar",
		filter: "power",
		multiple: !0,
		selected: r.map((e) => e.entity_id),
		suggestions: Be((i?.entities ?? []).map((e) => ({
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
	A(n, "solar_power") && (o.answers = { ignored: j(n, "solar_power", !1) }), M(e.from, o);
}
//#endregion
//#region src/editors/tariff-form.ts
var lo = [
	"kind",
	"price_entity",
	"window",
	"night_price",
	"day_price",
	"feed_in_price",
	"feed_in_entity",
	"surcharge"
];
function uo(e, t) {
	let n = {};
	for (let r of lo) JSON.stringify(e[r] ?? null) !== JSON.stringify(t[r] ?? null) && (n[r] = t[r] ?? null);
	return n;
}
function fo(e, t) {
	let n = uo(e, t);
	if (!Object.keys(n).length) return null;
	let r = { tariff: n };
	return "kind" in n && (r.answers = { tariff: t.kind }), r;
}
var po = class extends u {
	constructor(...e) {
		super(...e), this.feedIn = !1, this.asQuestion = !1;
	}
	static {
		this.styles = [p, g`
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
		if (!e || !t) return E;
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
		], r = x`<joe-choice
      .options=${n}
      .value=${t.kind === "unknown" ? [] : [t.kind]}
      idk=${e("ask.idk")}
      label=${e("f.tariff.kind")}
      @joe-choice=${(e) => this.emit({ kind: e.detail.value[0] ?? "unknown" })}
    ></joe-choice>`;
		return x`${this.asQuestion ? r : x`<div class="field" data-tipped>
            <div class="field-label">${e("f.tariff.kind")} ${v(e, "q_tariff")}</div>
            ${r}
          </div>`}
      ${t.kind === "fixed_window" ? this.renderWindow(e, t) : E}
      ${t.kind === "flat" ? this.renderFlat(e, t) : E}
      ${t.kind === "dynamic" ? this.renderDynamic(e, t) : E}
      ${this.feedIn ? this.renderFeedIn(e, t) : E}`;
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
		return x`<div class="field" data-tipped>
        <div class="field-label">${e("f.window")} ${v(e, "f_window")}</div>
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
        <div class="field-label">${e("f.prices")} ${v(e, "f_prices")}</div>
        <div class="field-row">
          <label class="price">${e("f.price.night")} ${this.centInput(e, t.night_price, "night_price")}</label>
          <label class="price">${e("f.price.day")} ${this.centInput(e, t.day_price, "day_price")}</label>
        </div>
      </div>`;
	}
	renderFlat(e, t) {
		return x`<div class="field" data-tipped>
      <div class="field-label">${e("f.price")} ${v(e, "f_prices")}</div>
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
		return x`<div class="field" data-tipped>
        <div class="field-label">${e("f.price_entity")} ${v(e, "f_price_entity")}</div>
        <div class="entity">
          ${r && n ? x`<span><b>${O(n, r)}</b> <small>${m(n, r, e.lang)}</small></span>` : x`<small>${e("f.price_entity.none")}</small>`}
          <button type="button" class="mini-btn" @click=${this.pickPrice}>
            <ha-icon icon="mdi:magnify"></ha-icon>${e(r ? "review.change" : "review.choose")}
          </button>
        </div>
      </div>
      <div class="field" data-tipped>
        <div class="field-label">${e("f.search")} ${v(e, "f_search")}</div>
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
        <div class="field-label">${e("f.surcharge")} ${v(e, "f_surcharge")}</div>
        ${this.centInput(e, t.surcharge, "surcharge")}
      </div>`;
	}
	renderFeedIn(e, t) {
		let n = this.hass;
		return x`<div class="field" data-tipped>
      <div class="field-label">${e("f.feed_in")} ${v(e, "q_feed_in")}</div>
      ${t.feed_in_entity && n ? x`<p class="field-hint">
            ${e("f.feed_in.entity", { name: O(n, t.feed_in_entity) })}
          </p>` : this.centInput(e, t.feed_in_price, "feed_in_price")}
    </div>`;
	}
	centInput(e, t, n) {
		return x`<span class="unit-input">
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
		let n = this.discovery?.tariff, r = (await N(this, {
			heading: e("pick.price.title"),
			tip: "pick_price",
			filter: "price",
			selected: t.price_entity ? [t.price_entity] : [],
			suggestions: Be(n?.price_entity ? [{
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
f([o({ attribute: !1 })], po.prototype, "hass", void 0), f([o({ attribute: !1 })], po.prototype, "t", void 0), f([o({ attribute: !1 })], po.prototype, "tariff", void 0), f([o({ attribute: !1 })], po.prototype, "discovery", void 0), f([o({ type: Boolean })], po.prototype, "feedIn", void 0), f([o({ type: Boolean })], po.prototype, "asQuestion", void 0), h("joe-tariff-form", po);
var mo, ho = class extends u {
	constructor(...e) {
		super(...e), this.closable = !1, this.keep = !1, this.saving = !1, this.base = "";
	}
	static {
		this.styles = [p, g`
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
		!this.draft && this.keep && mo && (this.base = mo.base, this.draft = mo.draft), this.draft ? n !== this.base && (this.draft = {
			...structuredClone(t),
			...this.changes
		}, this.base = n, this.keep && (mo = this.dirty ? {
			base: this.base,
			draft: this.draft
		} : void 0)) : (this.base = n, this.draft = structuredClone(t));
	}
	get changes() {
		return this.draft && this.base ? uo(JSON.parse(this.base), this.draft) : {};
	}
	get dirty() {
		return Object.keys(this.changes).length > 0;
	}
	render() {
		let { t: e, draft: t } = this;
		if (!e || !t) return E;
		let n = this.dirty;
		return x`<joe-tariff-form
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
      ${n && !this.closable ? x`<p class="unsaved" role="status">${e("grid.tariff.unsaved")}</p>` : E}
      ${n || this.closable ? x`<div class="actions" data-notip>
            <button type="button" class="btn btn-primary" ?disabled=${this.saving || !n && !this.closable} @click=${this.save}>
              ${e("common.save")}
            </button>
            <button type="button" class="btn btn-ghost" @click=${this.discard}>
              ${e(this.closable ? "common.cancel" : "grid.tariff.discard")}
            </button>
          </div>` : E}`;
	}
	change(e) {
		this.draft = e, this.keep && (mo = this.dirty ? {
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
		}, r = fo(e.tariff, n);
		if (r) {
			this.saving = !0;
			let e = await M(this, r);
			if (this.saving = !1, !e) return;
			this.base = JSON.stringify(n), this.draft = n;
		}
		this.keep && (mo = void 0), this.finish();
	}
	discard() {
		this.config && (this.base = JSON.stringify(this.config.tariff), this.draft = structuredClone(this.config.tariff)), this.keep && (mo = void 0), this.finish();
	}
	finish() {
		this.closable && this.dispatchEvent(new CustomEvent("joe-close", {
			bubbles: !0,
			composed: !0
		}));
	}
};
f([o({ attribute: !1 })], ho.prototype, "hass", void 0), f([o({ attribute: !1 })], ho.prototype, "t", void 0), f([o({ attribute: !1 })], ho.prototype, "config", void 0), f([o({ attribute: !1 })], ho.prototype, "discovery", void 0), f([o({ type: Boolean })], ho.prototype, "closable", void 0), f([o({ type: Boolean })], ho.prototype, "keep", void 0), f([b()], ho.prototype, "draft", void 0), f([b()], ho.prototype, "saving", void 0), h("joe-tariff-draft", ho);
//#endregion
//#region src/pages/devices/grid.ts
var go = [
	"connection",
	"tariff",
	"solar",
	"home"
], _o = {
	connection: "mdi:transmission-tower",
	tariff: "mdi:cash-clock",
	solar: "mdi:solar-power-variant",
	home: "mdi:home-lightning-bolt-outline"
}, vo = "/config/energy";
function yo(e, t) {
	return t < .95 ? e("learn.solar.less", {
		value: r(e.lang, (1 - t) * 100, 0),
		share: r(e.lang, t * 100, 0)
	}) : t > 1.05 ? e("learn.solar.more", {
		value: r(e.lang, (t - 1) * 100, 0),
		share: r(e.lang, t * 100, 0)
	}) : e("learn.solar.fits");
}
var bo = class extends W {
	static {
		this.styles = [
			p,
			U,
			Ha,
			g`
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
		this.anchor && this.revealed !== this.anchor && fe(this.renderRoot, this.anchor) && (this.revealed = this.anchor);
	}
	render() {
		let { t: e, hass: t, state: n } = this;
		if (!e || !t || !n) return E;
		let r = n.config, i = {
			from: this,
			hass: t,
			t: e,
			config: r,
			discovery: this.discovery,
			checks: this.checks,
			aside: (n, r) => H(e, hr(t, n, r))
		}, a = this.anchor !== void 0 && !go.includes(this.anchor);
		return x`<div class="wrap">
      ${a ? jr(e) : E}
      ${zr(e, e("nav.devices.grid"), e("grid.lead"))}
      ${this.renderEnergy(e, i)} ${this.renderConnection(e, i)} ${this.renderTariff(e, i)}
      ${this.renderSolar(e, i)} ${this.renderHome(e, i)}
    </div>`;
	}
	renderEnergy(e, t) {
		let n = $a(t);
		return n ? x`<div class="energy">${Ga(e, [n])}</div>` : x`<div class="note energy-none">
      <ha-icon icon="mdi:information-outline"></ha-icon>
      <span
        >${e("grid.energy.none")}
        <a
          href=${vo}
          @click=${(e) => {
			e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0 || (e.preventDefault(), _(vo));
		}}
          >${e("grid.energy.open")}</a
        ></span
      >
    </div>`;
	}
	block(e, t, n, r, i) {
		return x`<section class="card gsec" data-anchor=${t}>
      <h3 class="gsec-head" ?data-tipped=${!!i}>
        <ha-icon icon=${_o[t]}></ha-icon>${n}${i ? v(e, i) : E}
      </h3>
      <p class="say">${e(`grid.${t}.say`)}</p>
      ${r}
    </section>`;
	}
	rule(e, t, n) {
		return K(e, this.prefix, {
			label: e(`rule.${n}`),
			value: oi(e, t, n),
			source: k(t, `rules.${n}`),
			to: {
				tab: "settings",
				section: "rules",
				id: n
			}
		});
	}
	renderConnection(e, t) {
		return this.block(e, "connection", e("grid.connection"), x`${Ga(e, [ro(t, "grid_power")])}
        <div class="mirrors">${this.rule(e, t.config, "grid_limit_w")} ${this.rule(e, t.config, "guard_grid")}</div>`);
	}
	renderTariff(e, t) {
		return this.block(e, "tariff", e("find.tariff"), x`${Ga(e, [eo(t, { missing: e("grid.tariff.unknown") })])}
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
	renderSolar(e, n) {
		let i = n.config, a = i.forecast, o = i.learned.solar_factor, s = {
			tab: "review",
			section: "learned",
			id: "sun"
		};
		return this.block(e, "solar", e("devices.grid.solar"), x`${Ga(e, [so(n), to(n)])}
        ${a.provider && a.alternatives.length ? x`<div class="toggle-row" data-tipped>
              <span class="with-tip"><span id="combine-label">${e("learn.sources.combine")}</span>${v(e, "learn_combine")}</span>
              <button
                type="button"
                class="switch"
                role="switch"
                aria-checked=${String(a.combine)}
                aria-labelledby="combine-label"
                @click=${() => M(this, { forecast: { combine: !a.combine } })}
              ></button>
            </div>` : E}
        ${a.provider ? x`<div class="mirrors">
              <div class="mirror">
                <div class="mirror-text">
                  <span class="mirror-label">${e("grid.solar.factor")}</span>
                  <span class="mirror-sep" aria-hidden="true">·</span>
                  <span class="mirror-value">${o == null ? e("learn.still") : `× ${r(e.lang, o, 2)}`}</span>
                  ${o == null ? E : t(e, { source: "learned" })}
                  ${o == null ? E : x`<small class="mirror-hint">${yo(e, o)}</small>`}
                </div>
                <a class="mini-btn quiet mirror-go" href=${T(this.prefix, s)} @click=${w(s)}
                  >${e("devices.page.more_learned")}</a
                >
              </div>
            </div>` : E}`);
	}
	renderHome(e, t) {
		let n = {
			tab: "devices",
			section: "other"
		}, r = x`<a class="mini-btn go" href=${T(this.prefix, n)} @click=${w(n)}
      >${e("grid.home.devices")}</a
    >`;
		return this.block(e, "home", e("devices.grid.home"), Ga(e, [ro(t, "home_power", { devices: r })]));
	}
};
f([o({ attribute: !1 })], bo.prototype, "anchor", void 0), h("joe-grid-page", bo);
//#endregion
//#region src/pages/devices/hot-water-device.ts
var xo = class extends W {
	static {
		this.styles = [
			p,
			U,
			gi,
			$i,
			Ui
		];
	}
	render() {
		let { t: e, hass: t, state: n, entry: r } = this;
		if (!e || !t || !n || !r) return E;
		let i = Nr(this.ctx, r), a = r.consumer, o = a ? Qi(this, e, t, n.config, a) : void 0, s = r.action;
		return s ? Lr(this.ctx, {
			...i,
			why: pn(e, n, s),
			now: x`<joe-action-tonight .hass=${t} .t=${e} .state=${n} .action=${s}></joe-action-tonight>`,
			steer: x`<joe-action-steer
        .hass=${t}
        .t=${e}
        .state=${n}
        .discovery=${this.discovery}
        .prefix=${this.prefix}
        .action=${s}
        .section=${"hot_water"}
      ></joe-action-steer>`,
			power: o,
			learned: s.kind === "target" ? hi([yi(e, n.config.learned, s)]) : void 0,
			learnedArea: "hot_water",
			tips: { steer: "device_steer" },
			removeTitle: e("devices.page.delete"),
			remove: x`<joe-action-delete
        .t=${e}
        .config=${n.config}
        .action=${s}
        .leave=${{
				tab: "devices",
				section: "hot_water"
			}}
      ></joe-action-delete>`
		}) : Lr(this.ctx, {
			...i,
			now: a ? zi(e, this.prefix, "hot_water", a.id, e("devices.hot_water.lonely"), e("devices.hot_water.set_up"), "devices_lonely_hot_water") : void 0,
			power: o
		});
	}
};
f([o({ attribute: !1 })], xo.prototype, "entry", void 0), h("joe-hot-water-device", xo);
//#endregion
//#region src/pages/devices/hot-water.ts
var So = class extends W {
	static {
		this.styles = [
			p,
			U,
			Ui
		];
	}
	render() {
		let { t: e, hass: t, state: n } = this;
		if (!e || !n) return E;
		let r = it(this.devices, "hot_water", this.device);
		if (r) return x`<joe-hot-water-device
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
		let i = this.device ? Bi(this.devices, this.device, "hot_water") : void 0;
		return x`<div class="wrap">
      ${zr(e, e("nav.devices.hot_water"), e("devices.hot_water.lead"), this.devices.some((e) => e.group === "hot_water"))}
      ${this.device === void 0 ? E : i ? Vi(e, this.prefix, i.name, i) : jr(e)}
      ${Rr(this.ctx, this.devices, "hot_water", (r) => r.action ? { quick: x`<joe-action-tonight .hass=${t} .t=${e} .state=${n} .action=${r.action}></joe-action-tonight>` } : {})}
      <div class="group-actions">${Br(e, this.prefix, "hot_water", e("devices.group_add.hot_water"))}</div>
    </div>`;
	}
};
f([o({ attribute: !1 })], So.prototype, "device", void 0), f([o({ attribute: !1 })], So.prototype, "sub", void 0), h("joe-hot-water-group", So);
//#endregion
//#region src/pages/devices/other-device.ts
var Co = class extends W {
	static {
		this.styles = [
			p,
			U,
			gi,
			$i,
			Ui
		];
	}
	render() {
		let { t: e, hass: t, state: n, entry: r } = this;
		if (!e || !t || !n || !r) return E;
		let i = Nr(this.ctx, r), a = r.consumer, o = r.action, s = a && a.energy_entity && a.kind !== "submeter" ? hi([vi(e, n.config.learned, a)]) : void 0, c = !!(o && a && r.id === a.id), l = Ye("night", a?.id);
		return Lr(this.ctx, {
			...i,
			why: o ? pn(e, n, o) : i.why,
			now: o ? x`<joe-action-tonight .hass=${t} .t=${e} .state=${n} .action=${o}></joe-action-tonight>` : void 0,
			steer: o ? x`<joe-action-steer
              .hass=${t}
              .t=${e}
              .state=${n}
              .discovery=${this.discovery}
              .prefix=${this.prefix}
              .action=${o}
              .section=${"night"}
            ></joe-action-steer>` : a && a.kind !== "submeter" ? x`<p class="muted">${e("devices.other.night_offer")}</p>
              <a class="btn btn-secondary add-link" href=${T(this.prefix, l)} @click=${w(l, { sheet: !0 })}
                >${e("devices.other.night_add")}</a
              >` : void 0,
			power: a ? Qi(this, e, t, n.config, a) : r.noMeter ? x`<p class="muted">${e("devices.other.no_meter")}</p>` : void 0,
			learned: s,
			learnedArea: "devices",
			tips: { steer: "device_steer" },
			removeTitle: e("devices.page.delete"),
			remove: o ? x`<joe-action-delete
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
f([o({ attribute: !1 })], Co.prototype, "entry", void 0), h("joe-other-device", Co);
//#endregion
//#region src/pages/devices/other.ts
var wo = class extends W {
	constructor(...e) {
		super(...e), this.moved = /* @__PURE__ */ new Map();
	}
	static {
		this.styles = [
			p,
			U,
			$i,
			Ui
		];
	}
	render() {
		let { t: e, state: t } = this;
		if (!e || !t) return E;
		let n = it(this.devices, "other", this.device);
		if (n) return x`<joe-other-device
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
		let r = this.device ? Bi(this.devices, this.device, "other") : void 0;
		return x`<div class="wrap">
      ${zr(e, e("nav.devices.other"), e("devices.other.lead"), this.devices.some((e) => e.group === "other"))}
      ${this.device === void 0 ? E : r ? Vi(e, this.prefix, r.name, r) : jr(e)}
      ${this.renderList(e, t)}
      <div class="group-actions">${Br(e, this.prefix, "night", e("devices.group_add.night"))}</div>
    </div>`;
	}
	renderList(e, t) {
		let n = this.devices.filter((e) => e.group === "other"), r = new Map(t.config.consumers.map((e, t) => [e.id, t])), i = n.filter((e) => r.has(e.id)), a = n.filter((e) => !r.has(e.id) && !e.noMeter), o = n.filter((e) => e.noMeter), s = i.map((n) => ({
			at: r.get(n.id),
			html: this.card(e, t, n)
		}));
		for (let [t, i] of this.moved) {
			let a = n.some((e) => e.id === t) ? void 0 : Bi(this.devices, t, "other");
			a && s.push({
				at: r.get(t) ?? Infinity,
				html: Vi(e, this.prefix, i, a)
			});
		}
		return s.sort((e, t) => e.at - t.at), !s.length && !a.length && !o.length ? x`<p class="muted">${e("devices.other.empty")}</p>` : x`${s.length || a.length ? x`<section data-tipped>
            <div class="list-head">
              <span>${e("consumers.kind")} ${v(e, "f_consumer_kind")}</span>
              <span>${e("consumers.runs")} ${v(e, "f_consumer_runs")}</span>
            </div>
            <div class="dcards">${s.map((e) => e.html)} ${a.map((n) => this.card(e, t, n))}</div>
          </section>` : E}
      ${o.length ? x`<h3 class="sub-group">${e("devices.no_meter_group")}</h3>
            <div class="dcards">${o.map((n) => this.card(e, t, n))}</div>` : E}`;
	}
	card(e, t, n) {
		let r = n.id === n.consumer?.id ? n.consumer : void 0, i = n.action ? x`<joe-action-tonight .hass=${this.hass} .t=${e} .state=${t} .action=${n.action}></joe-action-tonight>` : E, a = r ? x`${Xi(e, r, (e) => this.setKind(r, e))}
        ${Zi(e, r, (e) => void Yi(this, r, e))} ${i}` : n.action ? i : void 0;
		return gr(e, this.prefix, yr(e, this.hass, t, n, { quick: a }));
	}
	async setKind(e, t) {
		if (!await Ji(this, e, t)) return;
		let n = new Map(this.moved);
		qi.includes(t) ? n.set(e.id, e.name) : n.delete(e.id), this.moved = n;
	}
};
f([o({ attribute: !1 })], wo.prototype, "device", void 0), f([o({ attribute: !1 })], wo.prototype, "sub", void 0), f([b()], wo.prototype, "moved", void 0), h("joe-other-group", wo);
//#endregion
//#region src/pages/devices/index.ts
var To = {
	all: "joe-devices-all",
	battery: "joe-battery-group",
	climate: "joe-climate-group",
	car: "joe-car-group",
	hot_water: "joe-hot-water-group",
	other: "joe-other-group",
	grid: "joe-grid-page"
}, Eo = class extends u {
	constructor(...e) {
		super(...e), this.prefix = D, this.checks = [], this.devices = [], this.behind = {
			tab: "devices",
			section: "all"
		};
	}
	static {
		this.styles = [p, g`
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
		].some((t) => e.has(t)) && (this.devices = nt(this.t, this.state, this.hass, {
			climateFound: this.climateFound,
			discovery: this.discovery,
			checks: this.checks
		})), e.has("route") && this.route && this.route.section !== "add" && (this.behind = this.route);
	}
	chips(e, t) {
		let n = new Set(rt(this.devices));
		this.state?.config.climate?.enabled && n.add("climate"), t !== "all" && t !== "add" && n.add(t);
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
		].filter((e) => n.has(e))) {
			let n = t === "grid" ? 0 : this.devices.filter((e) => e.group === t).length;
			i.push({
				id: t,
				label: e(`nav.devices.${t}`),
				icon: Ue[t],
				count: n ? r(e.lang, n, 0) : void 0,
				problem: at(this.devices, t)
			});
		}
		return i;
	}
	render() {
		let e = this.t;
		if (!e || !this.state) return E;
		let t = (this.route?.section ?? pe.devices) === "add", n = t ? this.behind : this.route, r = n?.section ?? pe.devices;
		return x`${ur(e, this.prefix, "devices", this.chips(e, r), r)}${this.renderSection(r, n)}${t ? this.renderAdd() : E}`;
	}
	renderSection(e, t) {
		if (!customElements.get(To[e])) return x``;
		let { t: n, hass: r, state: i, prefix: a, discovery: o, info: s, checks: c, climateFound: l, devices: u } = this;
		switch (e) {
			case "all": return x`<joe-devices-all
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
			case "climate": return x`<joe-climate-group
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
			case "battery": return x`<joe-battery-group
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
			case "car": return x`<joe-car-group
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
			case "hot_water": return x`<joe-hot-water-group
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
			case "other": return x`<joe-other-group
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
			case "grid": return x`<joe-grid-page
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
		return x`<joe-device-add
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
f([o({ attribute: !1 })], Eo.prototype, "hass", void 0), f([o({ attribute: !1 })], Eo.prototype, "t", void 0), f([o({ attribute: !1 })], Eo.prototype, "state", void 0), f([o({ attribute: !1 })], Eo.prototype, "route", void 0), f([o({ attribute: !1 })], Eo.prototype, "prefix", void 0), f([o({ attribute: !1 })], Eo.prototype, "discovery", void 0), f([o({ attribute: !1 })], Eo.prototype, "info", void 0), f([o({ attribute: !1 })], Eo.prototype, "checks", void 0), f([o({ attribute: !1 })], Eo.prototype, "climateFound", void 0), h("joe-devices-page", Eo);
//#endregion
//#region src/uses.ts
function Do(e, t) {
	let n = e.climate;
	if (!n?.enabled) return [];
	let r = t ? new Set(t.devices.map((e) => e.entity_id)) : null;
	return Object.entries(n.rooms ?? {}).filter(([e, t]) => t.enabled && (!r || r.has(e))).map(([e]) => e);
}
function Oo(e, t) {
	return e.actions.filter((e) => e.enabled && e.need?.enabled).filter((e) => {
		let n = e.need.persons;
		return t === void 0 ? n === null || n.length > 0 : n === null || n.includes(t);
	}).map((e) => ({
		label: e.name,
		to: "/devices"
	}));
}
function ko(e, t) {
	return t.length ? [{
		label: e("usedby.climate"),
		to: "/devices/climate",
		count: t.length
	}] : [];
}
function Ao(e, t, n) {
	let r = ko(e, Do(t, n));
	return t.persons.some((e) => e.person_entity) && r.push({
		label: e("usedby.learn"),
		to: "/review/learned/presence"
	}), r;
}
function jo(e, t, n) {
	let r = t.persons.some((e) => e.calendars.length), i = [];
	return (t.context.holiday_entity || r) && (i.push({
		label: e("usedby.plan"),
		to: "/plan"
	}), i.push({
		label: e("usedby.consumption"),
		to: "/review/learned/consumption"
	})), r && i.push(...Oo(t).map((t) => ({
		...t,
		label: e("usedby.car", { name: t.label })
	}))), (t.context.holiday_entity || r || t.context.free_day_entities?.length) && i.push(...ko(e, Do(t, n))), i;
}
function Mo(e, t, n) {
	return ko(e, Do(t, n).filter((e) => t.climate?.rooms[e]?.night_off));
}
function No(e, t, n, r) {
	let i = [];
	return n !== "routing" && t.context.weather_entity && (i.push({
		label: e("usedby.plan"),
		to: "/plan"
	}), i.push({
		label: e("usedby.consumption"),
		to: "/review/learned/consumption"
	}), i.push(...ko(e, Do(t, r)))), n !== "weather" && t.routing.service && (i.push(...Oo(t).map((t) => ({
		...t,
		label: e("usedby.car", { name: t.label })
	}))), (t.climate?.route_eta ?? !0) && Do(t, r).length && i.push({
		label: e("usedby.way"),
		to: "/household/presence/way"
	})), i.filter((e, t) => i.findIndex((t) => t.label === e.label) === t);
}
function Po(e, t, n) {
	return t.persons.find((e) => e.id === n)?.calendars.length ? Oo(t, n) : [];
}
//#endregion
//#region src/components/used-by.ts
function Fo(e, t) {
	if (typeof t == "string") return t;
	let [n, i] = e("word.device").split("|");
	return `${r(e.lang, t, 0)} ${t === 1 ? n : i}`;
}
function Io(e, t, n) {
	return n.length ? x`<p class="used-by">
    <ha-icon icon="mdi:link-variant"></ha-icon>
    <span class="used-by-label">${e("usedby.label")}</span>
    ${n.map((n) => {
		let r = n.count === void 0 ? n.label : `${n.label} (${Fo(e, n.count)})`;
		return n.to ? x`<a class="used-by-item" href=${T(t, n.to)} @click=${w(n.to)}>${r}</a>` : x`<span class="used-by-item">${r}</span>`;
	})}
  </p>` : x`<p class="used-by none"><ha-icon icon="mdi:link-variant-off"></ha-icon>${e("usedby.none")}</p>`;
}
//#endregion
//#region src/pages/household/head.ts
function Lo(e, t, n, r, i) {
	return x`<div class="page-head">
    ${d(n)} ${y}
    <p class="lead">${r}</p>
    ${i ? Io(e, t, i) : ""}
  </div>`;
}
function Ro(e, t, n) {
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
function zo(e) {
	return `${String(Math.floor(e / 60)).padStart(2, "0")}:${String(e % 60).padStart(2, "0")}`;
}
function Bo(e) {
	try {
		return new Intl.DateTimeFormat("en-CA", { timeZone: e }).format(/* @__PURE__ */ new Date());
	} catch {
		return new Intl.DateTimeFormat("en-CA").format(/* @__PURE__ */ new Date());
	}
}
//#endregion
//#region src/pages/household/styles.ts
var Vo = g`
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
`, Ho = [
	"vacation",
	"travel",
	"home_office",
	"office",
	"guests",
	"home"
];
function Uo(e) {
	let t = e;
	for (; t;) {
		let e = t.parentNode instanceof ShadowRoot ? t.parentNode.host : t.parentNode;
		if (e instanceof HTMLElement && e.scrollTop > 0) return e;
		t = e;
	}
	return document.scrollingElement;
}
var Wo = class extends u {
	constructor(...e) {
		super(...e), this.prefix = D, this.checks = [], this.keyword = {}, this.quiet = !1;
	}
	static {
		this.styles = [
			p,
			Vo,
			Ha,
			g`
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
		return !e || !t || !n ? E : x`<div class="wrap">
      ${Lo(e, this.prefix, e("household.days.title"), e("household.days.lead"), jo(e, t.config, this.climateFound))}
      ${this.renderPreview(e, t)} ${this.renderFree(e, n, t)} ${this.renderCalendar(e, t)}
    </div>`;
	}
	renderPreview(e, t) {
		let n = t.climate?.day, r = t.config.persons, i = this.hass?.config?.time_zone, a = Bo(i), o = t.plan?.meta?.tomorrow, s = o && o.date > a ? o : void 0, c = n ? n.holiday ? "holiday" : n.weekend && n.free ? "weekend" : "workday" : null, l = n?.labels_state ?? (n?.labels_at ? "ok" : "unread"), u = l === "ok" && n?.labels_at ? Ro(e.lang, n.labels_at, i) : null, d = t.climate, f = n ? !d?.home.length && d?.nobody_since ? "away" : n.holiday ? "holiday" : n.home_office.length && !n.free ? "home_office" : "normal" : null, p = null;
		if (s) {
			let e = (/* @__PURE__ */ new Date(`${s.date}T12:00:00Z`)).getUTCDay(), t = e === 0 || e === 6;
			p = s.workday ? Object.values(s.labels).includes("home_office") ? "home_office" : "normal" : t ? "normal" : "holiday";
		}
		let m = (t) => t ? x`<span class="chip ${t === "normal" ? "" : "soon"}"><ha-icon icon=${ca[t]}></ha-icon>${e(`week.tag.${t}`)}</span>` : E;
		return x`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:calendar-today"></ha-icon>${e("household.days.preview")}</div>
        ${v(e, "household_days_preview")}
      </div>
      <div class="preview">
        <div class="day">
          <div class="day-head">
            <b>${e("household.days.preview.today")} · ${B(e.lang, a, "weekday")}</b>${m(f)}
          </div>
          ${c ? x`<p class="now">${e(`climate.today.${c}`)}</p>` : x`<p class="hint">${e("household.days.preview.unknown")}</p>`}
          ${n ? x`<p class="hint">
                ${n.home_office_available ? l === "ok" ? n.home_office.length ? e("climate.today.ho", { names: n.home_office.join(", ") }) : e("climate.today.ho_none") : e(`climate.today.labels_${l}`) : e(`week.ho.${n.home_office_reason ?? "no_calendar"}`)}
                ${u ? e("climate.today.read_at", { time: u }) : E}
              </p>` : E}
        </div>
        <div class="day">
          <div class="day-head">
            <b>${e("household.days.preview.tomorrow")}${s ? x` · ${B(e.lang, s.date, "weekday")}` : E}</b>${m(p)}
          </div>
          ${s ? x`<p class="now">${e(s.workday ? "household.days.preview.workday" : "household.days.preview.day_off")}</p>
                ${Object.keys(s.labels).length ? x`<ul>
                      ${Object.entries(s.labels).map(([t, n]) => x`<li>
                            ${e("household.days.preview.person", {
			name: r.find((e) => e.id === t)?.name ?? t,
			label: e(`label.${n}`)
		})}
                          </li>`)}
                    </ul>` : E}` : x`<p class="hint">${e("household.days.preview.no_plan")}</p>`}
        </div>
      </div>
    </section>`;
	}
	renderFree(e, t, n) {
		let r = n.config, i = r.context.free_day_entities ?? [];
		return x`<section class="card">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:calendar-star"></ha-icon>${e("household.days.free")}</div>
      </div>
      ${Ga(e, [qa(this, t, e, r, this.discovery, "holiday", (n) => H(e, hr(t, n, O(t, n))))])}
      <div class="sub" data-tipped>
        <div class="row">
          <span>${e("climate.today.free_by")}</span>
          ${v(e, "climate_free_entities")}
        </div>
        <div class="row tight">
          <span class="chips-line">
            ${i.length ? i.map((e) => {
			let n = [
				"on",
				"true",
				"home"
			].includes(t.states[e]?.state ?? "");
			return x`<span class="chip ${n ? "ok" : ""}" title=${e}>${O(t, e)}</span>`;
		}) : x`<small class="hint">${e("climate.today.free_none")}</small>`}
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
		let t = await N(this, {
			heading: e("pick.free_day.title"),
			tip: "pick_free_day",
			filter: "toggle_like",
			multiple: !0,
			selected: this.state?.config.context.free_day_entities ?? []
		});
		t && M(this, { context: { free_day_entities: t.selected } });
	}
	renderCalendar(e, t) {
		let n = t.config, r = this.chosen(), i = !!r && !r.calendar, a = r?.calendar ?? n.calendar, o = (e) => a.rules.filter((t) => t.label === e), s = n.persons.some((e) => e.calendars.length), c = {
			tab: "household",
			section: "days"
		}, l = {
			tab: "household",
			section: "people"
		};
		return x`<section class="card" data-anchor="calendar" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:calendar-text-outline"></ha-icon>${e("learn.calendar")}</div>
        ${v(e, "learn_calendar")}
      </div>
      <p class="say">${e("learn.calendar.say")}</p>
      ${s ? E : x`<div class="note">
            <ha-icon icon="mdi:information-outline"></ha-icon>
            <span
              >${e("household.days.no_calendars")}
              <a href=${T(this.prefix, l)} @click=${w(l)}>${e("household.days.to_people")}</a></span
            >
          </div>`}
      ${n.persons.length ? x`<div data-tipped>
            <div class="sub-head"><b>${e("learn.calendar.for")}</b>${v(e, "cal_person")}</div>
            <nav class="scopes" aria-label=${e("learn.calendar.for")}>
              <a href=${T(this.prefix, c)} aria-current=${String(!r)} @click=${(e) => this.choose(e, c)}
                >${e("learn.calendar.everyone")}</a
              >
              ${n.persons.map((t) => {
			let n = {
				tab: "household",
				section: "days",
				id: t.id
			};
			return x`<a href=${T(this.prefix, n)} aria-current=${String(t.id === r?.id)} @click=${(e) => this.choose(e, n)}
                  >${t.name}${t.calendar ? x`<ha-icon class="own-rules" icon="mdi:account-cog-outline" title=${e("household.days.own_rules")}></ha-icon>` : E}</a
                >`;
		})}
            </nav>
          </div>` : E}
      ${this.person && !r ? x`<div class="note warn" role="status">
            <ha-icon icon="mdi:help-circle-outline"></ha-icon><span>${e("household.days.not_found")}</span>
          </div>` : E}
      ${r ? x`<div class="toggle-row" data-tipped>
            <span class="with-tip"><span id="cal-shared-label">${e("learn.calendar.shared")}</span>${v(e, "cal_shared")}</span>
            <button
              type="button"
              class="switch"
              role="switch"
              aria-checked=${String(i)}
              aria-labelledby="cal-shared-label"
              @click=${() => this.saveCalendar(r, i ? structuredClone(n.calendar) : null)}
            ></button>
          </div>` : E}
      ${i ? x`<p class="say">${e("learn.calendar.shared.say", { name: r.name })}</p>` : x`<div class="rules">
              ${Ho.map((t) => x`<div class="rule">
                  <b>${e(`label.${t}`)}</b>
                  <div class="keywords">
                    ${o(t).map((t) => x`<span class="keyword"
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
              <div class="sub-head"><b>${e("learn.calendar.defaults")}</b>${v(e, "cal_defaults")}</div>
              <div class="defaults">
                ${["default_workday", "default_day_off"].map((t) => x`<label class="field">
                    <span class="field-label">${e(`learn.calendar.${t}`)}</span>
                    <select
                      class="input"
                      @change=${(e) => this.saveCalendarPart({ [t]: e.target.value })}
                    >
                      ${Cn.map((n) => x`<option value=${n} ?selected=${a[t] === n}>${e(`label.${n}`)}</option>`)}
                    </select>
                  </label>`)}
              </div>
            </div>`}
    </section>`;
	}
	choose(e, t) {
		if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
		e.preventDefault(), this.quiet = !0;
		let n = Uo(this), r = n?.scrollTop ?? 0;
		C(this, t, { replace: !0 }), n && (n.scrollTop = r);
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
		let t = Ho.flatMap((t) => e.filter((e) => e.label === t));
		this.saveCalendarPart({ rules: t });
	}
	saveCalendarPart(e) {
		let t = this.chosen();
		t?.calendar ? this.saveCalendar(t, {
			...t.calendar,
			...e
		}) : M(this, { calendar: e });
	}
	saveCalendar(e, t) {
		M(this, { persons: { [e.id]: { calendar: t } } });
	}
	willUpdate(e) {
		e.has("person") && (this.revealed = this.quiet ? this.person : void 0, this.quiet = !1, this.keyword = {});
	}
	updated() {
		this.person && this.revealed !== this.person && fe(this.renderRoot, "calendar") && (this.revealed = this.person);
	}
};
f([o({ attribute: !1 })], Wo.prototype, "hass", void 0), f([o({ attribute: !1 })], Wo.prototype, "t", void 0), f([o({ attribute: !1 })], Wo.prototype, "state", void 0), f([o({ attribute: !1 })], Wo.prototype, "route", void 0), f([o({ attribute: !1 })], Wo.prototype, "prefix", void 0), f([o({ attribute: !1 })], Wo.prototype, "discovery", void 0), f([o({ attribute: !1 })], Wo.prototype, "checks", void 0), f([o({ attribute: !1 })], Wo.prototype, "climateFound", void 0), f([o({ attribute: !1 })], Wo.prototype, "person", void 0), f([b()], Wo.prototype, "keyword", void 0), h("joe-hh-days", Wo);
//#endregion
//#region src/pages/household/night.ts
var Go = "23:00", Ko = "06:30", qo = class extends u {
	constructor(...e) {
		super(...e), this.prefix = D, this.checks = [];
	}
	static {
		this.styles = [
			p,
			Vo,
			g`
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
		return !e || !t || !this.hass ? E : x`<div class="wrap">
      ${Lo(e, this.prefix, e("household.night.title"), e("household.night.lead"), Mo(e, t.config, this.climateFound))}
      ${this.renderSource(e, t)} ${this.renderDevices(e, t)}
    </div>`;
	}
	renderSource(e, t) {
		let n = this.hass, r = t.config.climate, i = r?.night_by ?? "time", a = r?.night_entity ?? null, o = a ? n.states[a] : void 0;
		return x`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:weather-night"></ha-icon>${e("household.night.source")}</div>
        ${v(e, "climate_night_source")}
      </div>
      <div class="row">
        <span>${e("climate.night.by")}</span>
        <span class="seg" role="group" aria-label=${e("climate.night.by")}>
          ${["time", "entity"].map((t) => x`<button type="button" aria-pressed=${String(i === t)} @click=${() => this.setNightBy(t)}>
              ${e(`climate.night.by.${t}`)}
            </button>`)}
        </span>
      </div>
      ${i === "entity" ? x`<div class="row entity-row">
              <span>${a ? x`<b title=${a}>${O(n, a)}</b>` : e("climate.night.no_entity")}</span>
              ${o ? x`<span class="chip ${o.state === "on" ? "ok" : ""}"
                    >${e(o.state === "on" ? "climate.night.now_on" : "climate.night.now_off")}</span
                  >` : E}
              ${a ? H(e, hr(n, a, O(n, a))) : E}
              <button type="button" class="btn btn-secondary" @click=${() => void this.pickNight()}>
                ${e(a ? "climate.night.change" : "climate.night.pick")}
              </button>
            </div>
            <p class="hint">${e("climate.night.entity_say")}</p>` : x`<p class="hint">${e("climate.night.time_say")}</p>`}
    </section>`;
	}
	renderDevices(e, t) {
		let n = t.config.climate, r = n?.night_by === "entity", i = Object.fromEntries((this.climateFound?.devices ?? []).map((e) => [e.entity_id, e.name])), a = Object.entries(n?.rooms ?? {}).filter(([, e]) => e.night_off), o = {
			tab: "devices",
			section: "climate"
		};
		return x`<section class="card">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:power-sleep"></ha-icon>${e("household.night.devices")}</div>
      </div>
      ${a.length ? x`<ul class="devices">
            ${a.map(([t, a]) => {
			let o = {
				tab: "devices",
				section: "climate",
				id: t
			}, s = a.night_from || Go, c = a.night_until || Ko;
			return x`<li>
                <a href=${T(this.prefix, o)} @click=${w(o)}>
                  <b>${i[t] ?? O(this.hass, t)}</b>
                  <span>${r ? e("household.night.until", { until: c }) : e("household.night.span", {
				from: s,
				until: c
			})}</span>
                  ${a.enabled && n?.enabled ? E : x`<small class="hint">${e("household.night.not_steered")}</small>`}
                  <ha-icon icon="mdi:chevron-right"></ha-icon>
                </a>
              </li>`;
		})}
          </ul>` : x`<p class="hint">${e("household.night.devices.none")}</p>`}
      <a class="go-link" href=${T(this.prefix, o)} @click=${w(o)}>${e("household.night.to_climate")}</a>
    </section>`;
	}
	setNightBy(e) {
		M(this, { climate: { night_by: e } }), e === "entity" && !this.state?.config.climate?.night_entity && this.pickNight();
	}
	async pickNight() {
		let e = this.t;
		if (!e) return;
		let t = this.state?.config.climate?.night_entity, n = await N(this, {
			heading: e("pick.night.title"),
			tip: "pick_night",
			filter: "night",
			selected: t ? [t] : []
		});
		n && M(this, { climate: {
			night_by: "entity",
			night_entity: n.selected[0] ?? null
		} });
	}
};
f([o({ attribute: !1 })], qo.prototype, "hass", void 0), f([o({ attribute: !1 })], qo.prototype, "t", void 0), f([o({ attribute: !1 })], qo.prototype, "state", void 0), f([o({ attribute: !1 })], qo.prototype, "route", void 0), f([o({ attribute: !1 })], qo.prototype, "prefix", void 0), f([o({ attribute: !1 })], qo.prototype, "discovery", void 0), f([o({ attribute: !1 })], qo.prototype, "checks", void 0), f([o({ attribute: !1 })], qo.prototype, "climateFound", void 0), h("joe-hh-night", qo);
//#endregion
//#region src/household-helpers.ts
var Jo = "gast";
function Yo(e) {
	return Object.values(e.states).filter((e) => e.entity_id.startsWith("group.")).map((e) => ({
		state: e,
		members: e.attributes.entity_id ?? []
	})).filter(({ members: e }) => e.length && e.every((e) => /^(person|device_tracker)\./.test(e))).map(({ state: t, members: n }) => ({
		entity_id: t.entity_id,
		name: O(e, t.entity_id),
		members: n.map((t) => O(e, t))
	}));
}
async function Xo(e, t, n) {
	if (!t.callApi || !t.callService) throw Error("no api");
	let r = `input_boolean.${(await t.callWS({
		type: "input_boolean/create",
		name: n("household.guest.name"),
		icon: "mdi:account-child-outline"
	})).id}`, i = `device_tracker.${Jo}`;
	return await t.callApi("POST", `config/automation/config/energy_joe_${Jo}`, {
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
				dev_id: Jo,
				host_name: n("household.guest.tracker_name"),
				location_name: `{{ 'home' if is_state('${r}', 'on') else 'not_home' }}`
			}
		}],
		mode: "queued"
	}), await t.callService("device_tracker", "see", {
		dev_id: Jo,
		host_name: n("household.guest.tracker_name"),
		location_name: "not_home"
	}), M(e, { context: {
		guest_switch: r,
		guest_tracker: i
	} }), i;
}
function Zo(e, t) {
	let n = e.states[t]?.state === "on";
	e.callService?.("input_boolean", n ? "turn_off" : "turn_on", { entity_id: t });
}
//#endregion
//#region src/editors/household.ts
var Qo = class extends u {
	constructor(...e) {
		super(...e), this.detailed = !1;
	}
	static {
		this.styles = [p, g`
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
		if (!e || !t || !n) return E;
		let r = (this.discovery?.persons ?? []).filter((e) => A(n, `person:${e.entity_id}`) && !n.persons.some((t) => t.id === e.entity_id));
		return x`${n.persons.length ? x`<ul>
            ${n.persons.map((n) => this.renderPerson(e, t, n))}
          </ul>` : x`<p class="empty">${e("household.empty")}</p>`}
      <div class="with-tip add" data-tipped>
        <button type="button" class="mini-btn" @click=${this.addPerson}>
          <ha-icon icon="mdi:account-plus-outline"></ha-icon>${e("household.add")}
        </button>
        ${v(e, "f_person_add")}
      </div>
      ${r.length ? x`<div class="others" data-tipped>
            <span>${e("household.left_out")}</span>
            ${r.map((e) => x`<button type="button" class="mini-btn quiet" @click=${() => this.bringBack(e)}>
                <ha-icon icon="mdi:undo-variant"></ha-icon>${e.name}
              </button>`)}
            ${v(e, "household_left_out")}
          </div>` : E}`;
	}
	renderPerson(e, t, n) {
		let r = n.person_entity ? t.states[n.person_entity]?.state : void 0, i = r === "home" ? x`<small class="home">${e("household.home")}</small>` : r === "not_home" ? x`<small>${e("household.away")}</small>` : r ? x`<small>${e("household.zone", { zone: r })}</small>` : x`<small>${e("household.no_presence")}</small>`;
		return x`<li class="person" data-anchor=${this.detailed ? n.id : E}>
      <div class="top" data-tipped>
        <span class="avatar" aria-hidden="true">${n.name.slice(0, 1).toUpperCase()}</span>
        <div class="who"><b>${n.name}</b>${i}</div>
        <span class="top-actions">
          ${this.detailed ? H(e, hr(t, n.person_entity, n.name)) : E}
          <button type="button" class="mini-btn quiet" @click=${() => this.removePerson(n)}>
            ${e("household.remove")}
          </button>
          ${v(e, "household_remove")}
        </span>
      </div>
      <div class="cals" data-tipped>
        <span class="cals-label">${e("household.calendars")}</span>
        ${n.calendars.map((r) => x`<span class="cal">
            ${O(t, r)}
            <button
              type="button"
              aria-label=${e("household.calendar_remove", { name: O(t, r) })}
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
        ${v(e, "f_calendars")}
      </div>
      ${this.detailed ? x`<slot name=${`p:${n.id}`}></slot>` : E}
    </li>`;
	}
	async addPerson() {
		let { t: e, config: t } = this;
		if (!e || !t) return;
		let n = (await N(this, {
			heading: e("pick.person.title"),
			tip: "pick_person",
			filter: "person",
			selected: [],
			exclude: t.persons.map((e) => e.person_entity).filter((e) => !!e)
		}))?.selected[0];
		if (!n || !this.hass) return;
		let r = this.discovery?.persons.find((e) => e.entity_id === n);
		M(this, {
			persons: { [n]: {
				name: O(this.hass, n),
				person_entity: n,
				calendars: r?.calendars ?? []
			} },
			answers: { ignored: j(t, `person:${n}`, !1) }
		});
	}
	bringBack(e) {
		M(this, {
			persons: { [e.entity_id]: {
				name: e.name,
				person_entity: e.entity_id,
				calendars: e.calendars
			} },
			answers: { ignored: j(this.config, `person:${e.entity_id}`, !1) }
		});
	}
	removePerson(e) {
		M(this, {
			persons: { [e.id]: null },
			answers: { ignored: j(this.config, `person:${e.id}`, !0) }
		});
	}
	async addCalendars(e) {
		let t = this.t;
		if (!t) return;
		let n = await N(this, {
			heading: t("pick.calendar.title", { name: e.name }),
			tip: "pick_calendar",
			filter: "calendar",
			multiple: !0,
			selected: e.calendars
		});
		n && this.setCalendars(e, n.selected);
	}
	setCalendars(e, t) {
		M(this, { persons: { [e.id]: { calendars: t } } });
	}
};
f([o({ attribute: !1 })], Qo.prototype, "hass", void 0), f([o({ attribute: !1 })], Qo.prototype, "t", void 0), f([o({ attribute: !1 })], Qo.prototype, "config", void 0), f([o({ attribute: !1 })], Qo.prototype, "discovery", void 0), f([o({ type: Boolean })], Qo.prototype, "detailed", void 0);
var $o = class extends u {
	constructor(...e) {
		super(...e), this.card = !1, this.leftOut = [], this.guest = !0, this.creating = !1, this.offerNew = !1;
	}
	static {
		this.styles = [p, g`
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
		if (!e || !t || !n) return E;
		let r = n.context.presence_entity, i = this.card ? x`<div class="head">
          <div class="eyebrow"><ha-icon icon="mdi:account-check-outline"></ha-icon>${e("household.presence")}</div>
          ${v(e, "household_presence")}
        </div>` : x`<div class="with-tip"><b>${e("household.presence")}</b>${v(e, "household_presence")}</div>`;
		if (r) {
			let a = ["on", "home"].includes(t.states[r]?.state ?? "");
			return x`<div class="presence" data-tipped>
        ${i}
        <div class="row">
          <span class="chip ${a ? "ok" : ""}" title=${r}>${O(t, r)}</span>
          <small>${e(a ? "household.presence.on" : "household.presence.off")}</small>
          ${H(e, hr(t, r, O(t, r)))}
        </div>
        <p>${e(r.startsWith("group.") ? "household.presence.yours_group" : "household.presence.yours")}</p>
        ${this.renderGuest(e, t, n, r)}
        <div class="row">
          <button type="button" class="mini-btn" @click=${() => void this.pickPresence()}>${e("household.presence.other")}</button>
          <button type="button" class="mini-btn quiet" @click=${() => M(this, { context: { presence_entity: null } })}>
            ${e("household.presence.stop")}
          </button>
        </div>
      </div>`;
		}
		let a = n.persons.filter((e) => e.person_entity), o = a.filter((e) => !this.leftOut.includes(e.person_entity)), s = Yo(t);
		return s.length && !this.offerNew ? x`<div class="presence" data-tipped>
        ${i}
        <p>${e("household.presence.found")}</p>
        ${s.map((t) => x`<div class="row">
            <span class="chip" title=${t.entity_id}>${t.name}</span>
            <small>${t.members.join(", ")}</small>
            <button type="button" class="btn btn-primary" @click=${() => M(this, { context: { presence_entity: t.entity_id } })}>
              ${e("household.presence.use")}
            </button>
          </div>`)}
        <div class="row">
          <button type="button" class="btn btn-ghost" @click=${() => this.offerNew = !0}>${e("household.presence.new_instead")}</button>
        </div>
      </div>` : x`<div class="presence" data-tipped>
      ${i}
      <p>${e("household.presence.propose")}</p>
      <div class="row" role="group" aria-label=${e("household.presence.persons")}>
        ${a.map((e) => {
			let t = !this.leftOut.includes(e.person_entity);
			return x`<button
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
      ${this.failed ? x`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.failed}</span></div>` : E}
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
		if (!i || !a) return x`<div class="guest" data-tipped>
        <div class="with-tip"><b>${e("household.guest")}</b>${v(e, "household_guest")}</div>
        <p>${e("household.guest.offer")}</p>
        ${this.failed ? x`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.failed}</span></div>` : E}
        <div class="row">
          <button type="button" class="btn btn-secondary" ?disabled=${this.creating} @click=${() => void this.addGuest()}>
            ${e(this.creating ? "household.presence.creating" : "household.guest.create")}
          </button>
        </div>
      </div>`;
		let o = t.states[i]?.state === "on", s = t.states[r]?.attributes.entity_id, c = !s || s.includes(a);
		return x`<div class="guest" data-tipped>
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
        ${v(e, "household_guest")}
      </div>
      ${c ? E : x`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon>
            <span>${e("household.guest.add_to_group", { group: O(t, r) })}<code>- ${a}</code></span>
          </div>`}
    </div>`;
	}
	async addGuest() {
		let { t: e, hass: t } = this;
		if (e && t) {
			this.creating = !0, this.failed = void 0;
			try {
				await Xo(this, t, e);
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
				let r = this.guest ? this.config?.context.guest_tracker ?? await Xo(this, n, t) : null;
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
		let t = this.config?.context.presence_entity, n = await N(this, {
			heading: e("pick.presence.title"),
			tip: "pick_presence",
			filter: "presence",
			selected: t ? [t] : []
		});
		n?.selected[0] && M(this, { context: { presence_entity: n.selected[0] } });
	}
};
f([o({ attribute: !1 })], $o.prototype, "hass", void 0), f([o({ attribute: !1 })], $o.prototype, "t", void 0), f([o({ attribute: !1 })], $o.prototype, "config", void 0), f([o({ attribute: !1 })], $o.prototype, "discovery", void 0), f([o({
	type: Boolean,
	reflect: !0
})], $o.prototype, "card", void 0), f([b()], $o.prototype, "leftOut", void 0), f([b()], $o.prototype, "guest", void 0), f([b()], $o.prototype, "creating", void 0), f([b()], $o.prototype, "failed", void 0), f([b()], $o.prototype, "offerNew", void 0);
var es = class extends u {
	static {
		this.styles = g`
    :host {
      display: block;
    }
  `;
	}
	render() {
		return x`<joe-household-people
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
f([o({ attribute: !1 })], es.prototype, "hass", void 0), f([o({ attribute: !1 })], es.prototype, "t", void 0), f([o({ attribute: !1 })], es.prototype, "config", void 0), f([o({ attribute: !1 })], es.prototype, "discovery", void 0), h("joe-household-people", Qo), h("joe-household-presence", $o), h("joe-household", es);
//#endregion
//#region src/pages/household/people.ts
var ts = class extends u {
	constructor(...e) {
		super(...e), this.prefix = D, this.checks = [];
	}
	static {
		this.styles = [
			p,
			Vo,
			g`
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
		if (!e || !t || !this.hass) return E;
		let n = t.config, r = [...Ao(e, n, this.climateFound), ...jo(e, n, this.climateFound)], i = !(!this.person || n.persons.some((e) => e.id === this.person));
		return x`<div class="wrap">
      ${Lo(e, this.prefix, e("household.people.title"), e("household.people.lead"), r.filter((e, t) => r.findIndex((t) => t.label === e.label) === t))}
      ${i ? x`<div class="note warn" role="status">
            <ha-icon icon="mdi:help-circle-outline"></ha-icon><span>${e("nav.not_found.person")}</span>
          </div>` : E}
      <div class="list-head">
        <span class="eyebrow"><ha-icon icon="mdi:account-group-outline"></ha-icon>${e("household.people.list")}</span>
        ${v(e, "ha_open")}
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
		let i = t.config, a = t.climate?.day, o = t.plan?.meta?.tomorrow, s = o && o.date > Bo(this.hass?.config?.time_zone) ? o : void 0, c = [];
		a?.home_office_available && a.labels_state !== "error" && a.home_office.includes(n.name) && c.push(e("household.people.today", { label: e("label.home_office") }));
		let l = s?.labels[n.id];
		l && c.push(e("household.people.tomorrow", { label: e(`label.${l}`) }));
		let u = n.calendars.length > 0, d = Po(e, i, n.id), f = i.learned.presence?.[n.id] ?? {}, p = Cn.filter((e) => f[e]).map((t) => e("learn.presence.value", {
			label: e(`label.${t}`),
			hours: r(e.lang, f[t].hours, 0)
		})), m = n.person_entity ? t.climate?.usual?.[n.person_entity] : void 0;
		m != null && p.push(e("household.people.usual", { time: zo(m) }));
		let h = {
			tab: "household",
			section: "days",
			id: n.id
		};
		return x`<div class="extra" slot=${`p:${n.id}`}>
      ${c.length ? x`<p class="days">${c.join(" · ")}</p>` : E}
      ${u ? x`${this.mirror(e("household.people.rules"), e(n.calendar ? "household.people.rules.own" : "household.people.rules.shared"), h, e("mirror.change"))}
            <p class="used-by ${d.length ? "" : "none"}">
              <ha-icon icon=${d.length ? "mdi:car-clock" : "mdi:link-variant-off"}></ha-icon>
              ${d.length ? x`<span class="used-by-label">${e("household.people.counts")}</span>
                    ${d.map((e) => x`<a class="used-by-item" href=${T(this.prefix, e.to)} @click=${w(e.to)}
                          >${e.label}</a
                        >`)}` : e("household.people.counts.none")}
            </p>` : E}
      ${this.mirror(e("household.people.learned"), n.person_entity ? p.length ? p.join(" · ") : e("household.people.learned.none") : e("learn.presence.no_person"), {
			tab: "review",
			section: "learned",
			id: "presence"
		}, e("household.people.more"))}
    </div>`;
	}
	mirror(e, t, n, r) {
		return x`<div class="mirror">
      <div class="mirror-text">
        <span class="mirror-label">${e}</span>
        <span class="mirror-sep" aria-hidden="true">·</span>
        <span class="mirror-value">${t}</span>
      </div>
      <a class="mini-btn go mirror-go" href=${T(this.prefix, n)} @click=${w(n)}>${r}</a>
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
		t && (await t.updateComplete, t.shadowRoot && fe(t.shadowRoot, e) && (this.revealed = e));
	}
};
f([o({ attribute: !1 })], ts.prototype, "hass", void 0), f([o({ attribute: !1 })], ts.prototype, "t", void 0), f([o({ attribute: !1 })], ts.prototype, "state", void 0), f([o({ attribute: !1 })], ts.prototype, "route", void 0), f([o({ attribute: !1 })], ts.prototype, "prefix", void 0), f([o({ attribute: !1 })], ts.prototype, "discovery", void 0), f([o({ attribute: !1 })], ts.prototype, "checks", void 0), f([o({ attribute: !1 })], ts.prototype, "climateFound", void 0), f([o({ attribute: !1 })], ts.prototype, "person", void 0), h("joe-hh-people", ts);
//#endregion
//#region src/pages/household/presence.ts
var ns = 15, rs = 240, is = "https://my.home-assistant.io/redirect/config_flow_start/?domain=proximity";
function as(e, t, n) {
	let r = t.routing;
	if (r.service === "google") {
		let t = n?.routing?.google.find((e) => e.entry_id === r.google_entry);
		return e("settings.routing.google", { name: t?.title ?? "Google" });
	}
	return e(r.service ? `settings.routing.${r.service}` : "settings.routing.none");
}
var os = class extends u {
	constructor(...e) {
		super(...e), this.prefix = D, this.checks = [];
	}
	static {
		this.styles = [
			p,
			Vo,
			g`
      .way-list {
        margin: 6px 0 0;
      }
    `
		];
	}
	render() {
		let { t: e, state: t } = this;
		if (!e || !t || !this.hass) return E;
		let n = t.config;
		return x`<div class="wrap">
      ${Lo(e, this.prefix, e("household.presence.title"), e("household.presence.lead"), Ao(e, n, this.climateFound))}
      ${this.renderLive(e, t)}
      <joe-household-presence card .hass=${this.hass} .t=${e} .config=${n} .discovery=${this.discovery}></joe-household-presence>
      ${this.renderWay(e, n)}
    </div>`;
	}
	renderLive(e, t) {
		let n = t.climate, i = n?.home ?? [], a = Object.entries(n?.arrivals ?? this.climateFound?.arrivals ?? {}), o = Object.fromEntries(t.config.persons.map((e) => [e.person_entity, e.name])), s = t.config.climate?.away_after_min ?? ns;
		return x`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:home-account"></ha-icon>${e("household.presence.now")}</div>
        ${v(e, "climate_presence")}
      </div>
      <p class="now">${i.length ? e("climate.home", { names: i.join(", ") }) : e("climate.nobody")}</p>
      ${a.map(([t, n]) => x`<p class="hint">
          ${e(`climate.way.${n.direction === "towards" ? "towards" : n.direction === "away_from" ? "away" : "other"}`, {
			name: o[t] ?? this.hass?.states[t]?.attributes.friendly_name ?? t,
			km: n.km == null ? "–" : r(e.lang, n.km, 1)
		})}
          ${n.direction === "towards" && n.minutes != null ? e(n.source ? "climate.way.minutes_route" : "climate.way.minutes_guess", { minutes: n.minutes }) : E}
        </p>`)}
      <div class="row" data-tipped>
        <span>${e("climate.away_after")}</span>
        <input
          class="input short"
          type="number"
          inputmode="numeric"
          min="0"
          max=${rs}
          step="1"
          aria-label=${e("climate.away_after")}
          .value=${String(s)}
          @change=${(e) => {
			let t = e.target, n = Math.round(Number.parseFloat(t.value.replace(",", ".")));
			if (!Number.isFinite(n)) {
				t.value = String(s);
				return;
			}
			let r = Math.min(rs, Math.max(0, n));
			t.value = String(r), M(this, { climate: { away_after_min: r } });
		}}
        />
        <span>${e("climate.away_after.unit")}</span>
        ${v(e, "climate_away_after")}
      </div>
    </section>`;
	}
	renderWay(e, t) {
		let n = t.climate?.route_eta ?? !0;
		return x`<section class="card" data-anchor="way" data-tipped>
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
          @click=${() => M(this, { climate: { route_eta: !n } })}
        ></button>
        ${v(e, "climate_route_eta")}
      </div>
      ${K(e, this.prefix, {
			label: e("household.presence.routing"),
			value: as(e, t, this.info),
			to: {
				tab: "household",
				section: "travel"
			},
			action: t.routing.service ? "change" : "set"
		})}
      ${this.climateFound && !this.climateFound.proximity ? x`<p class="hint">
            ${e("climate.no_proximity")}
            <a href=${is} target="_blank" rel="noreferrer noopener">${e("climate.add_proximity")}</a>
          </p>` : E}
    </section>`;
	}
	willUpdate(e) {
		e.has("anchor") && (this.revealed = void 0);
	}
	updated() {
		this.anchor && this.revealed !== this.anchor && fe(this.renderRoot, this.anchor) && (this.revealed = this.anchor);
	}
};
f([o({ attribute: !1 })], os.prototype, "hass", void 0), f([o({ attribute: !1 })], os.prototype, "t", void 0), f([o({ attribute: !1 })], os.prototype, "state", void 0), f([o({ attribute: !1 })], os.prototype, "route", void 0), f([o({ attribute: !1 })], os.prototype, "prefix", void 0), f([o({ attribute: !1 })], os.prototype, "discovery", void 0), f([o({ attribute: !1 })], os.prototype, "checks", void 0), f([o({ attribute: !1 })], os.prototype, "climateFound", void 0), f([o({ attribute: !1 })], os.prototype, "info", void 0), f([o({ attribute: !1 })], os.prototype, "anchor", void 0), h("joe-hh-presence", os);
//#endregion
//#region src/pages/household/travel.ts
var ss = class extends u {
	constructor(...e) {
		super(...e), this.prefix = D, this.checks = [];
	}
	static {
		this.styles = [
			p,
			Vo,
			Ha,
			g`
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
		if (!e || !t || !n) return E;
		let r = t.config;
		return x`<div class="wrap">
      ${Lo(e, this.prefix, e("household.travel.title"), e("household.travel.lead"), null)}
      <section class="card">
        ${Ga(e, [qa(this, n, e, r, this.discovery, "weather", (t) => H(e, hr(n, t, O(n, t))))])}
        ${Io(e, this.prefix, No(e, r, "weather", this.climateFound))}
      </section>
      ${this.renderRouting(e, t)}
    </div>`;
	}
	renderRouting(e, t) {
		let n = t.config.routing, r = this.info?.routing, i = n.service === "google" ? `google:${n.google_entry ?? ""}` : n.service ?? "", a = (e) => {
			e.startsWith("google:") ? M(this, { routing: {
				service: "google",
				google_entry: e.slice(7) || null
			} }) : M(this, { routing: {
				service: e || null,
				google_entry: null
			} });
		}, o = (t) => x`<div class="field" data-tipped>
      <span class="field-label"><label for="routing-${t}">${e(`settings.routing.${t}`)}</label>${v(e, "routing_osm")}</span>
      <small class="field-hint">${e(`settings.routing.${t}.hint`)}</small>
      <input
        id="routing-${t}"
        class="input"
        type="url"
        .value=${n[t]}
        @change=${(e) => {
			let n = e.target.value.trim();
			n.startsWith("http") && M(this, { routing: { [t]: n } });
		}}
      />
    </div>`;
		return x`<section class="card">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:map-marker-distance"></ha-icon>${e("settings.routing")}</div>
      </div>
      <p class="say">${e("settings.routing.intro")}</p>
      <div class="field" data-tipped>
        <span class="field-label"><label for="routing-service">${e("settings.routing.service")}</label>${v(e, "routing_service")}</span>
        <small class="field-hint">${e("settings.routing.service.hint")}</small>
        <select id="routing-service" class="input" @change=${(e) => a(e.target.value)}>
          <option value="" ?selected=${i === ""}>${e("settings.routing.none")}</option>
          ${r?.waze === !1 ? E : x`<option value="waze" ?selected=${i === "waze"}>${e("settings.routing.waze")}</option>`}
          ${(r?.google ?? []).map((t) => x`<option value=${`google:${t.entry_id}`} ?selected=${i === `google:${t.entry_id}`}>
                ${e("settings.routing.google", { name: t.title })}
              </option>`)}
          <option value="osm" ?selected=${i === "osm"}>${e("settings.routing.osm")}</option>
        </select>
      </div>
      ${n.service === "osm" ? x`${o("geocoder_url")} ${o("router_url")}` : E}
      ${Io(e, this.prefix, No(e, t.config, "routing", this.climateFound))}
    </section>`;
	}
};
f([o({ attribute: !1 })], ss.prototype, "hass", void 0), f([o({ attribute: !1 })], ss.prototype, "t", void 0), f([o({ attribute: !1 })], ss.prototype, "state", void 0), f([o({ attribute: !1 })], ss.prototype, "route", void 0), f([o({ attribute: !1 })], ss.prototype, "prefix", void 0), f([o({ attribute: !1 })], ss.prototype, "discovery", void 0), f([o({ attribute: !1 })], ss.prototype, "checks", void 0), f([o({ attribute: !1 })], ss.prototype, "climateFound", void 0), f([o({ attribute: !1 })], ss.prototype, "info", void 0), h("joe-hh-travel", ss);
//#endregion
//#region src/pages/household/index.ts
var cs = {
	people: "joe-hh-people",
	presence: "joe-hh-presence",
	days: "joe-hh-days",
	night: "joe-hh-night",
	travel: "joe-hh-travel"
}, ls = {
	people: "mdi:account-group-outline",
	presence: "mdi:home-account",
	days: "mdi:calendar-check-outline",
	night: "mdi:sleep",
	travel: "mdi:map-marker-path"
}, us = class extends u {
	constructor(...e) {
		super(...e), this.prefix = D, this.checks = [];
	}
	static {
		this.styles = [p, g`
      :host {
        display: block;
      }
    `];
	}
	render() {
		let e = this.t;
		if (!e || !this.state) return E;
		let t = this.route?.section ?? pe.household, n = le.household.map((t) => ({
			id: t,
			label: e(`nav.household.${t}`),
			icon: ls[t]
		}));
		return x`${ur(e, this.prefix, "household", n, t)}${this.renderSection(t)}`;
	}
	renderSection(e) {
		if (!customElements.get(cs[e])) return x``;
		let { t, hass: n, state: r, prefix: i, route: a, discovery: o, checks: s, climateFound: c, info: l } = this;
		switch (e) {
			case "people": return x`<joe-hh-people
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
			case "presence": return x`<joe-hh-presence
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
			case "days": return x`<joe-hh-days
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
			case "night": return x`<joe-hh-night
          .t=${t}
          .hass=${n}
          .state=${r}
          .prefix=${i}
          .route=${a}
          .discovery=${o}
          .checks=${s}
          .climateFound=${c}
        ></joe-hh-night>`;
			case "travel": return x`<joe-hh-travel
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
f([o({ attribute: !1 })], us.prototype, "hass", void 0), f([o({ attribute: !1 })], us.prototype, "t", void 0), f([o({ attribute: !1 })], us.prototype, "state", void 0), f([o({ attribute: !1 })], us.prototype, "route", void 0), f([o({ attribute: !1 })], us.prototype, "prefix", void 0), f([o({ attribute: !1 })], us.prototype, "discovery", void 0), f([o({ attribute: !1 })], us.prototype, "checks", void 0), f([o({ attribute: !1 })], us.prototype, "climateFound", void 0), f([o({ attribute: !1 })], us.prototype, "info", void 0), h("joe-household-page", us);
//#endregion
//#region src/components/chart.ts
var ds = 40, fs = 10, ps = 16, ms = 24;
function hs(e) {
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
function gs(e) {
	let t = [], n = [];
	return e.forEach((e, r) => {
		e == null ? (n.length && t.push(n), n = []) : n.push([r, e]);
	}), n.length && t.push(n), t;
}
var X = class extends u {
	constructor(...e) {
		super(...e), this.labels = [], this.ticks = /* @__PURE__ */ new Map(), this.series = [], this.bands = [], this.markers = [], this.unit = "kWh", this.max = 0, this.height = 220, this.label = "", this.lang = "de", this.centerTicks = !1, this.width = 640, this.hover = null;
	}
	static {
		this.styles = g`
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
		if (!e) return E;
		let t = Math.max(260, this.width), n = this.height, r = t - ds - fs, i = n - ps - ms, a = r / e, o = this.series.flatMap((e) => e.values.filter((e) => e != null)), s = this.max || hs(Math.max(.1, ...o)), c = Math.min(0, ...o), l = c < 0 ? -Math.max(hs(-c), s / 4) : 0, u = (e) => ps + i - (Math.max(l, Math.min(e, s)) - l) / (s - l) * i, d = (e) => ds + e * a, f = (e) => ds + (e + .5) * a, p = (e, t = 2) => new Intl.NumberFormat(this.lang, { maximumFractionDigits: t }).format(e), m = [];
		for (let e of this.bands) m.push(re`<rect class="band" x=${d(e.from)} y=${ps} width=${Math.max(0, d(e.to) - d(e.from))} height=${i}></rect>
        <text class="note" x=${(d(e.from) + d(e.to)) / 2} y=${28} text-anchor="middle">${e.label}</text>`);
		for (let e of l < 0 ? [
			l,
			0,
			s
		] : [
			0,
			s / 2,
			s
		]) m.push(re`<line class="grid" x1=${ds} x2=${t - fs} y1=${u(e)} y2=${u(e)}></line>
        <text class="tick" x=${34} y=${u(e) + 4} text-anchor="end">${p(e, 2)}</text>`);
		m.push(re`<text class="tick" x=${34} y=${11} text-anchor="end">${this.unit}</text>`);
		for (let [e, t] of this.ticks) m.push(re`<text class="tick" x=${this.centerTicks ? f(e) : d(e)} y=${n - 6}
        text-anchor="middle">${t}</text>`);
		let h = this.series.filter((e) => e.kind === "bar"), g = a * .68 / Math.max(1, h.length);
		for (let e of this.series) {
			if (e.kind === "bar") {
				let t = a * .16 + h.indexOf(e) * g;
				e.values.forEach((n, r) => {
					if (n != null && n !== 0) {
						let i = Math.min(u(n), u(0));
						m.push(re`<rect x=${d(r) + t} y=${i} width=${Math.max(1, g - 1)}
              height=${Math.max(1, Math.abs(u(0) - u(n)))} rx="2"
              fill=${n < 0 ? e.negative ?? e.color : e.color}></rect>`);
					}
				});
				continue;
			}
			for (let t of gs(e.values)) {
				let n = t.map(([e, t]) => `${f(e).toFixed(1)},${u(t).toFixed(1)}`).join(" ");
				if (e.kind === "area" && t.length > 1) {
					let r = u(0).toFixed(1);
					m.push(re`<polygon points=${`${f(t[0][0]).toFixed(1)},${r} ${n} ${f(t[t.length - 1][0]).toFixed(1)},${r}`}
            fill=${e.fill ?? e.color}></polygon>`);
				}
				t.length > 1 ? m.push(re`<polyline points=${n} fill="none" stroke=${e.color} stroke-width=${e.kind === "line" ? 2.4 : 2}
            stroke-linejoin="round" stroke-dasharray=${e.dashed ? "5 4" : "none"}></polyline>`) : m.push(re`<circle cx=${f(t[0][0])} cy=${u(t[0][1])} r="2.5" fill=${e.color}></circle>`);
			}
		}
		for (let e of this.markers) {
			let n = ds + e.at * a, o = n < ds + r * .75;
			m.push(re`<line class="marker" x1=${n} x2=${n} y1=${ps} y2=${ps + i}></line>
        <text class="note" x=${o ? n + 4 : n - 4} y=${28} text-anchor=${o ? "start" : "end"}>
          ${t < 520 ? e.short ?? e.label : e.label}
        </text>`);
		}
		this.hover != null && m.push(re`<line class="guide" x1=${f(this.hover)} x2=${f(this.hover)} y1=${ps} y2=${ps + i}></line>`);
		for (let t = 0; t < e; t++) m.push(re`<rect class="slot" x=${d(t)} y=${ps} width=${a} height=${i}
        @pointerenter=${() => this.hover = t} @click=${() => this.hover = t}></rect>`);
		return x`<svg
        viewBox="0 0 ${t} ${n}"
        height=${n}
        role="img"
        aria-label=${this.label}
        @pointerleave=${(e) => e.pointerType === "mouse" && (this.hover = null)}
      >
        ${m}
      </svg>
      ${this.hover == null ? E : this.renderBox(this.hover, f(this.hover), t, p)}`;
	}
	renderBox(e, t, n, r) {
		let i = t + 182 > n ? Math.max(0, t - 182) : t + 12;
		return x`<div class="box" style="left:${i}px">
      <b>${this.labels[e]}</b>
      ${this.series.map((t) => {
			let n = t.values[e];
			return n == null ? E : x`<div>
              <i style="background:${n < 0 ? t.negative ?? t.color : t.color}"></i><span>${t.label}</span
              ><em>${r(n, t.digits ?? 2)} ${this.unit}</em>
            </div>`;
		})}
    </div>`;
	}
};
f([o({ attribute: !1 })], X.prototype, "labels", void 0), f([o({ attribute: !1 })], X.prototype, "ticks", void 0), f([o({ attribute: !1 })], X.prototype, "series", void 0), f([o({ attribute: !1 })], X.prototype, "bands", void 0), f([o({ attribute: !1 })], X.prototype, "markers", void 0), f([o()], X.prototype, "unit", void 0), f([o({ type: Number })], X.prototype, "max", void 0), f([o({ type: Number })], X.prototype, "height", void 0), f([o()], X.prototype, "label", void 0), f([o()], X.prototype, "lang", void 0), f([o({ type: Boolean })], X.prototype, "centerTicks", void 0), f([b()], X.prototype, "width", void 0), f([b()], X.prototype, "hover", void 0), h("joe-chart", X);
//#endregion
//#region src/components/day-answer.ts
var _s = {
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
}, vs = class extends u {
	constructor(...e) {
		super(...e), this.date = "", this.changing = !1, this.busy = !1, this.failed = !1;
	}
	static {
		this.styles = [p, g`
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
		if (!e || !this.date || !t && !this.question) return E;
		let n = !t || this.changing;
		return x`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:chat-question-outline"></ha-icon>${e("ask.title")}</div>
        ${v(e, "ask_day")}
      </div>
      ${n ? x`<p>
              ${this.question ? e(`ask.${this.question.kind}`, {
			day: B(e.lang, this.question.date, "weekday"),
			actual: z(e.lang, this.question.actual, 1),
			expected: z(e.lang, this.question.expected, 1)
		}) : e("past.answer.ask")}
            </p>
            <div class="answers" role="group" aria-label=${e("ask.answers")}>
              ${_s[this.question?.kind ?? "any"].map((n) => x`<button
                    type="button"
                    class="mini-btn ${n === "normal" ? "quiet" : ""}"
                    aria-pressed=${String(n === t)}
                    ?disabled=${this.busy}
                    @click=${() => this.choose(n)}
                  >
                    ${e(`ask.answer.${n}`)}
                  </button>`)}
              ${t ? x`<button type="button" class="mini-btn quiet" ?disabled=${this.busy} @click=${() => this.changing = !1}>
                    ${e("common.cancel")}
                  </button>` : E}
            </div>` : x`<div class="given">
            <p>${e("past.answer.given", { answer: e(`ask.answer.${t}`) })}</p>
            <button type="button" class="mini-btn" @click=${() => this.changing = !0}>
              <ha-icon icon="mdi:pencil-outline"></ha-icon>${e("past.answer.change")}
            </button>
          </div>`}
      ${this.failed ? x`<div class="note warn" role="status"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("error.action")}</div>` : E}
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
f([o({ attribute: !1 })], vs.prototype, "hass", void 0), f([o({ attribute: !1 })], vs.prototype, "t", void 0), f([o({ attribute: !1 })], vs.prototype, "date", void 0), f([o({ attribute: !1 })], vs.prototype, "answer", void 0), f([o({ attribute: !1 })], vs.prototype, "question", void 0), f([b()], vs.prototype, "changing", void 0), f([b()], vs.prototype, "busy", void 0), f([b()], vs.prototype, "failed", void 0), f([b()], vs.prototype, "given", void 0), h("joe-day-answer", vs);
//#endregion
//#region src/pages/lookback/days.ts
var ys = 14, bs = [
	"var(--joe-c-soc)",
	"var(--joe-c-soc-2)",
	"var(--joe-c-grid)",
	"var(--joe-c-ist)"
];
function xs(e, t, n) {
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
var Ss = class extends u {
	constructor(...e) {
		super(...e), this.prefix = D, this.failed = !1, this.fromStrip = !1, this.reveal = !1;
	}
	static {
		this.styles = [p, g`
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
				days: ys
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
		if (!e) return E;
		if (!this.days?.days.length) return this.renderEmpty(e);
		let t = this.selected;
		return x`<div class="wrap">
      ${d(e("history.title"))} ${y}
      <p class="status">${this.statusText(e)}</p>
      ${this.rebuildLink(e)}
      ${this.failed ? x`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("history.failed")}</div>` : E}
      ${this.renderStrip(e, this.days.days, t)}
      ${this.day && (!t || this.blank) ? x`<div class="note"><ha-icon icon="mdi:calendar-remove-outline"></ha-icon>${e("past.days.unknown", { day: this.dayName(e, this.day) })}</div>` : E}
      ${this.detail && t && !this.blank ? this.renderDay(e, this.detail) : E}
    </div>`;
	}
	dayName(e, t) {
		return /^\d{4}-\d{2}-\d{2}$/.test(t) ? xs(e.lang, t, "long") : t;
	}
	rebuildLink(e) {
		let t = this.state?.observe;
		if (!t?.active || t.backfill.state === "running") return E;
		let n = {
			tab: "settings",
			section: "maintenance",
			id: "observe"
		};
		return x`<a class="more" href=${T(this.prefix, n)} @click=${w(n)}>${e("past.days.rebuild")}</a>`;
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
		return x`<div class="empty">
      <joe-pose name="inspect"></joe-pose>
      <div>
        ${d(e("history.title"))} ${y}
        <p class="lead">${e(n)}</p>
        ${this.failed ? x`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("history.failed")}</div>` : E}
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
		return x`<nav class="strip" aria-label=${e("history.days")}>
      ${a.map((t) => {
			let r = i.get(t), a = x`<small>${xs(e.lang, t, "short")}</small>
          <b>${Number(t.slice(8))}</b>
          <span class="mini" aria-hidden="true">
            <i style="height:${(r?.home ?? 0) / o * 26}px;background:var(--joe-c-load)"></i>
            <i style="height:${(r?.solar ?? 0) / o * 26}px;background:var(--joe-c-pv)"></i>
          </span>`;
			if (!r) return x`<span aria-disabled="true" aria-label=${xs(e.lang, t, "long")}>${a}</span>`;
			let s = {
				tab: "review",
				section: "days",
				id: t
			}, c = w(s);
			return x`<a
          href=${T(this.prefix, s)}
          aria-current=${t === n ? "date" : E}
          aria-label=${xs(e.lang, t, "long")}
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
		return x`<div class="day-head" data-anchor="day">
        <h3>${xs(e.lang, t.date, "long")}</h3>
        ${t.workday === !0 ? x`<span class="chip">${e("history.workday")}</span>` : t.workday === !1 ? x`<span class="chip">${e("history.day_off")}</span>` : E}
        ${i ? x`<span class="chip ok"><ha-icon icon="mdi:eye-outline"></ha-icon>${e("history.live")}</span>` : E}
        ${a ? x`<span class="chip read"><ha-icon icon="mdi:database-outline"></ha-icon>${e("history.read")}</span>` : E}
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
      ${r && n.date !== this.days?.days[0]?.date ? x`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("history.missing", { hours: r })}</span>
          </div>` : E}`;
	}
	renderTiles(e, t) {
		let n = (t) => t == null ? "–" : r(e.lang, t, 1), i = [], a = (e, t, n, r) => x`<div class="tile">
        <div class="eyebrow">${e}</div>
        <div class="value">${t}<small>${n}</small></div>
        ${r ? x`<div class="sub">${r}</div>` : E}
      </div>`;
		if (t.home != null && i.push(a(e("history.tile.home"), n(t.home), "kWh", t.self_sufficiency == null ? "" : e("history.tile.home.self", { value: r(e.lang, t.self_sufficiency * 100, 0) }))), t.solar != null && i.push(a(e("history.tile.solar"), n(t.solar), "kWh", t.fc_ahead == null ? e("history.tile.solar.nofc") : e("history.tile.solar.fc", {
			value: n(t.fc_ahead),
			ratio: t.solar_vs_fc == null ? "–" : r(e.lang, t.solar_vs_fc * 100, 0)
		}))), t.grid_in != null) {
			let r = [];
			t.grid_in_cheap != null && r.push(e("history.tile.grid.cheap", { value: n(t.grid_in_cheap) })), t.grid_out != null && r.push(e("history.tile.grid.out", { value: n(t.grid_out) })), i.push(a(e("history.tile.grid"), n(t.grid_in), "kWh", r.join(" · ")));
		}
		if (t.bat_in != null && i.push(a(e("history.tile.battery"), n(t.bat_in), "kWh", e("history.tile.battery.out", { value: n(t.bat_out) }))), t.temp && i.push(a(e("history.tile.temp"), r(e.lang, t.temp.mean, 1), "°C", e("history.tile.temp.range", {
			min: r(e.lang, t.temp.min, 0),
			max: r(e.lang, t.temp.max, 0)
		}))), t.present) {
			let n = new Map((this.state?.config.persons ?? []).map((e) => [e.id, e.name])), o = Object.entries(t.present), s = Math.max(...o.map(([, e]) => e));
			i.push(a(e("history.tile.present"), r(e.lang, s, 0), "h", o.map(([t, i]) => `${n.get(t) ?? t} ${r(e.lang, i, 0)} h`).join(" · ")));
		}
		return x`<div class="tiles">${i}</div>`;
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
		return x`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("history.chart.energy")} ${v(e, "chart_energy")}</div>
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
		return x`<div class="legend">
      ${e.map((e) => x`<span><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color}"></i>${e.label}</span>`)}
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
				color: bs[n % bs.length],
				digits: 0
			};
		});
		if (!n.some((e) => e.values.some((e) => e != null))) return E;
		t.plan_soc_slots.some((e) => e != null) && n.push({
			label: e("history.chart.plan"),
			kind: "line",
			values: t.plan_soc_slots,
			color: "var(--joe-c-ist)",
			dashed: !0,
			digits: 0
		});
		let r = this.chartFrame(t);
		return x`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("history.chart.soc")} ${v(e, "chart_soc")}</div>
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
		if (!t.plan?.fixed) return E;
		if (!n) return x`<div class="note"><ha-icon icon="mdi:timer-sand"></ha-icon><span>${e("history.eval.pending")}</span></div>`;
		if (!n.complete) return x`<div class="note warn">
        <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("history.eval.incomplete")}</span>
      </div>`;
		let r = this.hass?.config?.currency, i = n.saving ?? 0, a = i > .005 ? "good" : i < -.005 ? "bad" : "", o = (t) => z(e.lang, t ?? 0, 1), s = (t) => t ? e("history.eval.clock", { time: this.time(t) }) : e("history.eval.never"), c = !n.final, l = [[e("history.eval.day"), e("history.eval.instead", {
			with: o(n.with_plan?.day_kwh),
			without: o(n.without?.day_kwh)
		})], [e("history.eval.night"), e("history.eval.instead", {
			with: o(n.with_plan?.night_kwh),
			without: o(n.without?.night_kwh)
		})]];
		!c && n.solar?.forecast != null && l.push([e("history.eval.solar"), e("history.eval.solar.value", {
			actual: o(n.solar.actual),
			expected: o(n.solar.forecast)
		})]), !c && n.bridge && l.push([e("history.eval.morning"), e("history.eval.morning.value", {
			actual: o(n.bridge.actual),
			expected: o(n.bridge.planned)
		})]), !c && n.takeover && l.push([e("history.eval.takeover"), e("history.eval.takeover.value", {
			actual: s(n.takeover.actual),
			expected: s(n.takeover.planned)
		})]);
		let u = [{
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
		}], d = this.chartFrame(t);
		return x`<div class="chart-card" data-tipped>
      <div class="chart-head">
        ${e("history.eval")} ${v(e, "chart_replay")}
        ${c && n.until ? x`<span class="chip warn">${e("history.eval.provisional", { time: this.time(n.until) })}</span>` : E}
      </div>
      <div class="eval-top">
        <div class="eval-big ${a}">
          ${a === "bad" ? mn(e, -i, r) : mn(e, i, r)}
          <small>${e(a === "good" ? "history.eval.saved" : a === "bad" ? "history.eval.cost" : "history.eval.same")}</small>
        </div>
        <dl>${l.map(([e, t]) => x`<dt>${e}</dt><dd>${t}</dd>`)}</dl>
      </div>
      ${c && n.until ? x`<div class="note">
            <ha-icon icon="mdi:timer-sand"></ha-icon
            ><span>${e("history.eval.provisional.note", { time: this.time(n.until) })}</span>
          </div>` : E}
      ${u.some((e) => e.values.some((e) => e != null)) ? x`<joe-chart
              .labels=${d.labels}
              .ticks=${d.ticks}
              .series=${u}
              .bands=${d.bands}
              max="100"
              height="150"
              unit="%"
              lang=${e.lang}
              label=${e("history.eval")}
            ></joe-chart>
            ${this.legend(u)}` : E}
    </div>`;
	}
	time(e) {
		return e.slice(11, 16);
	}
};
f([o({ attribute: !1 })], Ss.prototype, "hass", void 0), f([o({ attribute: !1 })], Ss.prototype, "t", void 0), f([o({ attribute: !1 })], Ss.prototype, "state", void 0), f([o({ attribute: !1 })], Ss.prototype, "prefix", void 0), f([o({ attribute: !1 })], Ss.prototype, "route", void 0), f([o({ attribute: !1 })], Ss.prototype, "climateFound", void 0), f([o({ attribute: !1 })], Ss.prototype, "day", void 0), f([b()], Ss.prototype, "days", void 0), f([b()], Ss.prototype, "detail", void 0), f([b()], Ss.prototype, "failed", void 0), h("joe-lookback-days", Ss);
//#endregion
//#region src/pages/lookback/learned.ts
var Cs = [
	"clear",
	"mixed",
	"overcast"
], ws = {
	forecast_solar: "Forecast.Solar",
	open_meteo_solar_forecast: "Open-Meteo Solar Forecast",
	solcast_solar: "Solcast"
}, Ts = [
	"all",
	...En,
	"climate"
];
function Es(e, t, n) {
	let r = e.base + (t ? e.workday : 0) + e.heat * Math.max(0, 15 - n) + e.cool * Math.max(0, n - 22);
	return e.presence != null && (r += e.presence * (e.presence_mean ?? 0)), Math.max(0, r);
}
var Z = class extends u {
	constructor(...e) {
		super(...e), this.prefix = D, this.failed = !1, this.confirming = !1, this.resetting = !1, this.scope = "all";
	}
	static {
		this.styles = [
			p,
			gi,
			g`
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
		let t = wi(this.state);
		e.has("state") && this.marker !== void 0 && t !== this.marker && this.load(), this.marker = t, e.has("anchor") && this.anchor && (this.pending = this.anchor);
	}
	updated() {
		let e = this.pending;
		e && this.data && fe(this.renderRoot, e) && (this.pending = void 0);
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
		if (!e) return E;
		let t = this.data;
		return x`<div class="wrap">
        <div class="intro">
          <div>
            ${d(e("learn.page.title"))} ${y}
            <p class="lead">${e("learn.lead")}</p>
            <p class="status">${this.statusText(e)}</p>
          </div>
          <joe-pose name="learn"></joe-pose>
        </div>
        ${this.failed ? x`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("learn.failed")}</div>` : E}
        ${t ? x`<div class="group" data-anchor="sun">
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
              ${this.renderReset(e)}` : E}
      </div>
      ${this.confirming ? this.renderConfirm(e) : E}`;
	}
	statusText(e) {
		let t = this.state?.observe, n = this.state?.config.learned;
		if (this.state?.mode === "off") return e("learn.paused");
		if (!t?.active) return e("learn.waiting");
		let r = [];
		return n?.since ? r.push(e("learn.since", { day: B(e.lang, n.since) })) : t.first_day && r.push(e("learn.since_start", { day: B(e.lang, t.first_day) })), n?.updated && r.push(e("learn.updated", {
			day: B(e.lang, n.updated, "short"),
			time: n.updated.slice(11, 16)
		})), r.join(" · ");
	}
	goLink(e, t) {
		return x`<a class="go-link" href=${T(this.prefix, e)} @click=${w(e)}>${t}</a>`;
	}
	renderSolar(e, n) {
		let i = n.learned, a = i.solar_factor, o;
		o = a == null ? e("learn.solar.learning", {
			need: n.needs.solar,
			have: i.solar_days
		}) : a < .95 ? e("learn.solar.less", {
			value: r(e.lang, (1 - a) * 100, 0),
			share: r(e.lang, a * 100, 0)
		}) : a > 1.05 ? e("learn.solar.more", {
			value: r(e.lang, (a - 1) * 100, 0),
			share: r(e.lang, a * 100, 0)
		}) : e("learn.solar.fits");
		let s = n.solar.slice(-28), c = [{
			label: e("learn.solar.chart.actual"),
			kind: "bar",
			values: s.map((e) => e.actual),
			color: "var(--joe-c-pv)",
			digits: 1
		}, {
			label: e("learn.solar.chart.forecast"),
			kind: "line",
			values: s.map((e) => e.forecast),
			color: "var(--joe-c-ist)",
			dashed: !0,
			digits: 1
		}];
		return x`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:weather-sunny"></ha-icon>${e("learn.solar")}</div>
        ${v(e, "learn_solar")}
      </div>
      <div class="figure">
        <div class="big ${a == null ? "small" : ""}">
          ${a == null ? e("learn.still") : `× ${r(e.lang, a, 2)}`}
        </div>
        ${a == null ? E : x`${t(e, { source: "learned" })}<span class="chip">${e("learn.days", { days: i.solar_days })}</span>`}
      </div>
      <p class="say">${o}</p>
      ${s.length > 1 ? this.chartWithLegend(e, s.map((e) => e.date), c, "kWh", e("learn.solar.chart")) : E}
    </section>`;
	}
	renderShift(e, n) {
		let r = n.learned, i = r.solar_shift;
		return x`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:clock-time-four-outline"></ha-icon>${e("learn.shift")}</div>
        ${v(e, "learn_shift")}
      </div>
      <div class="figure">
        <div class="big ${i == null ? "small" : ""}">${e(i == null ? "learn.still" : `learn.shift.big.${i}`)}</div>
        ${i == null ? E : x`${t(e, { source: "learned" })}<span class="chip">${e("learn.days", { days: r.shift_days })}</span>`}
      </div>
      <p class="say">
        ${i == null ? e("learn.shift.learning", {
			need: n.needs.shift,
			have: r.shift_days
		}) : e(`learn.shift.${i}`)}
      </p>
      ${n.solar_profile ? this.hourChart(e, this.profileSeries(e, n.solar_profile), e("learn.shift.chart")) : E}
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
		return x`<joe-chart
        .labels=${r}
        .ticks=${i}
        .series=${t}
        unit="kWh"
        height="150"
        lang=${e.lang}
        label=${n}
      ></joe-chart>
      <div class="legend">
        ${t.map((e) => x`<span><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color}"></i>${e.label}</span>`)}
      </div>`;
	}
	renderBuffer(e, n) {
		let { value: i, source: a } = n.buffer, o = n.learned, s = (t) => r(e.lang, t * 100, 0), c;
		c = a === "user" ? o.buffer == null ? e("learn.buffer.user") : e("learn.buffer.user_learned", { value: s(o.buffer) }) : a === "learned" ? e("learn.buffer.learned") : e("learn.buffer.default", {
			need: n.needs.buffer,
			have: o.buffer_days
		});
		let l = n.accuracy.slice(-14), u = [{
			label: e("learn.buffer.chart.planned"),
			kind: "bar",
			values: l.map((e) => e.bridge.planned),
			color: "var(--joe-c-ist)",
			digits: 1
		}, {
			label: e("learn.buffer.chart.actual"),
			kind: "bar",
			values: l.map((e) => e.bridge.actual),
			color: "var(--joe-c-soc)",
			digits: 1
		}];
		return x`<section class="card" data-tipped data-anchor="buffer">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:shield-half-full"></ha-icon>${e("learn.buffer")}</div>
        ${v(e, "learn_buffer")}
      </div>
      <div class="figure">
        <div class="big">${s(i)}<small> %</small></div>
        ${t(e, { source: a })}
        ${a === "learned" ? x`<span class="chip">${e("learn.mornings", { count: o.buffer_days })}</span>` : E}
      </div>
      <p class="say">${c}</p>
      ${l.length > 1 ? this.chartWithLegend(e, l.map((e) => e.date), u, "kWh", e("learn.buffer.chart")) : E}
      ${K(e, this.prefix, {
			label: e("rule.buffer_factor"),
			value: `${s(i)} %`,
			to: {
				tab: "settings",
				section: "rules",
				id: "buffer_factor"
			}
		})}
    </section>`;
	}
	renderHome(e, t) {
		let n = t.consumption, r = (t) => z(e.lang, t.reduce((e, t) => e + t, 0), 1), i = [{
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
		return x`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:home-lightning-bolt-outline"></ha-icon>${e("learn.home")}</div>
        ${v(e, "learn_home")}
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
		return x`<joe-chart
        .labels=${t.map((t) => B(e.lang, t, "weekday"))}
        .ticks=${Ti(e.lang, t)}
        .series=${n}
        centerTicks
        unit=${r}
        height="150"
        lang=${e.lang}
        label=${i}
      ></joe-chart>
      <div class="legend">
        ${n.map((e) => x`<span
              ><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color};height:${e.kind === "bar" ? "10px" : "4px"}"></i
              >${e.label}</span
            >`)}
      </div>`;
	}
	renderWeather(e, n) {
		let i = e.lang, a = n.learned.consumption_model, o = n.days.filter((e) => e.temp != null), s = o.filter((e) => !e.excluded).length, c = this.state?.config.context.weather_entity, l;
		if (!c) l = e("learn.model.no_weather");
		else if (!a) l = e("learn.model.learning", {
			need: n.needs.models,
			have: s
		});
		else {
			let t = [e("learn.model.base", { value: z(i, a.base + (a.presence ?? 0) * (a.presence_mean ?? 0), 1) })];
			Math.abs(a.workday) >= .3 && t.push(e(a.workday > 0 ? "learn.model.workday_more" : "learn.model.workday_less", { value: z(i, Math.abs(a.workday), 1) })), a.heat >= .05 && t.push(e("learn.model.heat", { value: z(i, a.heat, 2) })), a.cool >= .05 && t.push(e("learn.model.cool", { value: z(i, a.cool, 2) })), a.presence != null && Math.abs(a.presence) >= .05 && t.push(e("learn.model.presence", { value: z(i, a.presence, 2) })), t.push(e("learn.model.fit", { share: r(i, a.r2 * 100, 0) })), l = t.join(" ");
		}
		let u = a != null && a.heat >= .05;
		return x`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:thermometer"></ha-icon>${e("learn.model")}</div>
        ${v(e, "learn_model")}
      </div>
      <div class="figure">
        <div class="big ${a ? "" : "small"}">
          ${a ? u ? x`+${z(i, a.heat, 2)}<small> kWh/°C</small>` : x`${z(i, a.base + (a.presence ?? 0) * (a.presence_mean ?? 0), 1)}<small> kWh</small>` : e("learn.still")}
        </div>
        ${a ? x`${t(e, { source: "learned" })}<span class="chip">${e("learn.days", { days: a.days })}</span>` : E}
      </div>
      <p class="say">${l}</p>
      ${c ? E : K(e, this.prefix, {
			label: e("past.learned.weather"),
			value: e("past.learned.weather.missing"),
			to: {
				tab: "household",
				section: "travel"
			},
			action: "set"
		})}
      ${o.length > 2 ? this.temperatureChart(e, n, a) : E}
    </section>`;
	}
	temperatureChart(e, t, n) {
		let i = t.days.filter((e) => e.temp != null && !e.excluded), a = i.map((e) => e.temp), o = Math.floor(Math.min(...a) / 2) * 2, s = Math.floor(Math.max(...a) / 2) * 2 + 2, c = [];
		for (let e = o; e < s; e += 2) c.push(e);
		let l = (t) => r(e.lang, t, 0), u = [{
			label: e("learn.model.chart.actual"),
			kind: "bar",
			values: c.map((e) => {
				let t = i.filter((t) => t.temp >= e && t.temp < e + 2);
				return t.length ? t.reduce((e, t) => e + t.home, 0) / t.length : null;
			}),
			color: "var(--joe-c-ist)",
			digits: 1
		}];
		n && u.push({
			label: e("learn.model.chart.workday"),
			kind: "line",
			values: c.map((e) => Es(n, !0, e + 1)),
			color: "var(--joe-c-soc)",
			digits: 1
		}, {
			label: e("learn.model.chart.day_off"),
			kind: "line",
			values: c.map((e) => Es(n, !1, e + 1)),
			color: "var(--joe-c-soc-2)",
			dashed: !0,
			digits: 1
		});
		let d = Math.max(1, Math.ceil(c.length / 8)), f = /* @__PURE__ */ new Map();
		return c.forEach((e, t) => {
			t % d === 0 && f.set(t, `${l(e)}°`);
		}), x`<joe-chart
        .labels=${c.map((e) => `${l(e)} … ${l(e + 2)} °C`)}
        .ticks=${f}
        .series=${u}
        unit="kWh"
        height="150"
        lang=${e.lang}
        label=${e("learn.model.chart")}
      ></joe-chart>
      <div class="legend">
        ${u.map((e) => x`<span
              ><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color};height:${e.kind === "bar" ? "10px" : "4px"}"></i
              >${e.label}</span
            >`)}
      </div>`;
	}
	renderSources(e, t) {
		let n = e.lang, i = this.state.config, a = t.learned.solar_classes ?? {}, o = a.classes ?? {}, s = i.forecast, c = t.learned.sources ?? {}, l = Cs.filter((e) => o[e]), u = (e) => r(n, e * 100, 0), d = [["main", s.provider ? ws[s.provider] ?? s.provider : e("learn.sources.main")], ...s.alternatives.map((e) => [e.id, e.name])], f = Object.fromEntries(d.map(([e]) => [e, c[e] ? 1 / Math.max(c[e].error, .05) ** 2 : 0])), p = Object.values(f).reduce((e, t) => e + t, 0);
		return x`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:weather-partly-cloudy"></ha-icon>${e("learn.weather")}</div>
        ${v(e, "learn_weather")}
      </div>
      <p class="say">
        ${l.length ? e("learn.weather.say", { top: z(n, a.top ?? 0, 1) }) : e("learn.weather.learning", { have: a.days ?? 0 })}
      </p>
      ${l.length ? hi(Cs.map((t) => {
			let i = o[t];
			return {
				name: e(`learn.weather.${t}`),
				values: i ? [`× ${r(n, i.factor, 2)}`, e("learn.days", { days: i.days })] : [e("learn.still")]
			};
		})) : E}
      <div class="sub-head">
        <b>${e("learn.sources")}</b>
      </div>
      ${s.alternatives.length ? x`${hi(d.map(([i, a]) => {
			let o = c[i];
			return {
				name: a,
				values: o ? [
					`× ${r(n, o.factor, 2)}`,
					e("learn.sources.error", { value: u(o.error) }),
					s.combine && p ? e("learn.sources.weight", { value: u(f[i] / p) }) : ""
				] : [e("learn.sources.learning", { need: t.needs.sources })]
			};
		}))}
            ${K(e, this.prefix, {
			label: e("learn.sources.combine"),
			value: e(s.combine ? "rule.on" : "rule.off"),
			to: {
				tab: "devices",
				section: "grid",
				id: "solar"
			}
		})}` : x`<p class="say">${e("learn.sources.single")}</p>`}
    </section>`;
	}
	rowsCard(e, t, n, r, i, a, o, s = E) {
		return x`<section class="card" data-tipped data-anchor=${t}>
      <div class="head">
        <div class="eyebrow"><ha-icon icon=${n}></ha-icon>${r}</div>
        ${i}
      </div>
      ${a.length ? hi(a) : x`<p class="say">${o}</p>`} ${s}
    </section>`;
	}
	renderBatteries(e, t) {
		let n = this.state.config;
		return this.rowsCard(e, "battery", "mdi:battery-heart-variant", e("learn.battery"), v(e, "learn_battery"), n.batteries.map((r) => _i(e, n, t.learned, r, t.needs.models)), e("learn.battery.none"));
	}
	renderGroups(e, t) {
		let n = this.state.config.consumers.filter((e) => e.energy_entity && e.kind !== "submeter");
		return this.rowsCard(e, "devices", "mdi:chart-donut", e("learn.groups"), v(e, "learn_groups"), n.map((n) => vi(e, t.learned, n)), e("learn.groups.none"));
	}
	renderHotWater(e, t) {
		let n = this.state.config.actions.filter((e) => e.kind === "target");
		return this.rowsCard(e, "hot_water", "mdi:water-boiler", e("learn.hot_water"), v(e, "learn_hot_water"), n.map((n) => yi(e, t.learned, n)), e("learn.hot_water.none"));
	}
	renderCars(e, t) {
		let n = this.state.config.actions.filter((e) => e.kind === "switch" && e.need?.enabled);
		return this.rowsCard(e, "car", "mdi:car-electric", e("learn.car"), v(e, "learn_car"), n.map((n) => bi(e, t.learned, n)), e("learn.car.none"));
	}
	renderClimate(e) {
		let n = this.state.config, i = this.state?.climate?.rates ?? {}, a = this.climateFound?.devices ?? [], o = Object.fromEntries(a.map((e) => [e.entity_id, e.name])), s = Object.entries(n.climate?.rooms ?? {}).filter(([, e]) => e.enabled).map(([e]) => e), c = [.../* @__PURE__ */ new Set([...s, ...Object.keys(i)])].map((t) => {
			let n = i[t];
			return {
				name: o[t] ?? (this.hass ? O(this.hass, t) : t),
				values: n ? [e("past.learned.climate.rate", { rate: r(e.lang, n, 1) })] : [e("learn.still")],
				note: n ? void 0 : e("climate.rate_default")
			};
		});
		return x`<section class="card" data-tipped data-anchor="climate">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:thermostat-auto"></ha-icon>${e("past.learned.climate")}</div>
        ${v(e, "learn_climate")}
      </div>
      ${c.length ? x`<p class="say">${e("past.learned.climate.say")}</p>
            ${Object.keys(i).length ? x`<div class="figure">${t(e, { source: "learned" })}</div>` : E}
            ${hi(c)}` : x`<p class="say">${e("past.learned.climate.none")}</p>
            ${this.goLink({
			tab: "devices",
			section: "climate"
		}, e("past.learned.climate.open"))}`}
    </section>`;
	}
	renderPresence(e, t) {
		let n = this.state.config, r = this.state?.climate?.usual ?? {}, i = n.persons, a = i.map((n) => {
			let i = Si(e, t.learned, n, n.person_entity ? r[n.person_entity] : void 0);
			return n.calendars.length ? i : {
				...i,
				extra: this.goLink({
					tab: "household",
					section: "people",
					id: n.id
				}, e("learn.presence.calendars"))
			};
		});
		return this.rowsCard(e, "presence", "mdi:account-clock-outline", e("learn.presence"), v(e, "learn_presence"), a, e("learn.presence.none"), i.length ? E : this.goLink({
			tab: "household",
			section: "people"
		}, e("learn.presence.calendars")));
	}
	renderReset(e) {
		let t = !this.state?.observe?.active && this.scope !== "climate";
		return x`<section class="card danger wide" data-tipped data-anchor="reset">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:restore"></ha-icon>${e("learn.reset")}</div>
        ${v(e, "learn_reset")}
      </div>
      <p>${e("learn.reset.text")}</p>
      <div class="sub-head with-tip"><b>${e("learn.reset.scope")}</b>${v(e, "learn_reset_scope")}</div>
      <div class="seg scopes" role="group" aria-label=${e("learn.reset.scope")}>
        ${Ts.map((t) => x`<button type="button" aria-pressed=${String(this.scope === t)} @click=${() => this.scope = t}>
              ${e(`learn.reset.scope.${t}`)}
            </button>`)}
      </div>
      <div class="actions">
        <button type="button" class="btn btn-danger" ?disabled=${t} @click=${() => this.confirming = !0}>
          ${e(this.scope === "all" ? "learn.reset.button" : "learn.reset.button.scope")}
        </button>
      </div>
      ${t ? x`<p>${e("learn.reset.off")}</p>` : E}
      ${this.notice ? x`<div class="note ${this.notice.ok ? "" : "warn"}" role="status">
            <ha-icon icon=${this.notice.ok ? "mdi:check" : "mdi:alert-outline"}></ha-icon>${this.notice.text}
          </div>` : E}
    </section>`;
	}
	renderConfirm(e) {
		let t = () => {
			this.confirming = !1;
		}, n = this.scope;
		return x`<joe-sheet label=${e("learn.reset.label")} closeLabel=${e("common.close")} @joe-close=${t}>
      <div data-tipped>
        <div class="sheet-title">${d(e("learn.reset.confirm.title"), "h2", v(e, "learn_reset"))}</div>
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
f([o({ attribute: !1 })], Z.prototype, "hass", void 0), f([o({ attribute: !1 })], Z.prototype, "t", void 0), f([o({ attribute: !1 })], Z.prototype, "state", void 0), f([o({ attribute: !1 })], Z.prototype, "prefix", void 0), f([o({ attribute: !1 })], Z.prototype, "route", void 0), f([o({ attribute: !1 })], Z.prototype, "climateFound", void 0), f([o({ attribute: !1 })], Z.prototype, "anchor", void 0), f([b()], Z.prototype, "data", void 0), f([b()], Z.prototype, "failed", void 0), f([b()], Z.prototype, "confirming", void 0), f([b()], Z.prototype, "resetting", void 0), f([b()], Z.prototype, "scope", void 0), f([b()], Z.prototype, "notice", void 0), h("joe-lookback-learned", Z);
//#endregion
//#region src/pages/lookback/log.ts
var Ds = class extends u {
	constructor(...e) {
		super(...e), this.prefix = D, this.failed = !1;
	}
	static {
		this.styles = [p, g`
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
		e.has("group") && this.group && !br.includes(this.group) && C(this, {
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
		return this.full ?? xr(this.state?.control?.log, this.state?.climate?.log);
	}
	get filter() {
		return br.includes(this.group ?? "") ? this.group : "all";
	}
	render() {
		let e = this.t;
		if (!e || !this.state) return E;
		let t = this.state.config, n = this.entries, r = this.filter, i = Object.fromEntries((this.climateFound?.devices ?? []).map((e) => [e.entity_id, e.name])), a = /* @__PURE__ */ new Map([["all", n.length]]), o = /* @__PURE__ */ new Map();
		for (let e of n) {
			let n = Sr(t, e);
			a.set(n.group, (a.get(n.group) ?? 0) + 1), n.group === r && n.device && o.set(n.device, (o.get(n.device) ?? 0) + 1);
		}
		let s = r === "all" ? void 0 : this.device, c = [e(r === "all" ? "past.log.all" : `past.log.filter.${r}`), ...s ? [Cr(t, this.hass, i, r, s)] : []].join(" · ");
		return x`<div class="wrap">
      ${d(e("past.log.title"))} ${y}
      <p class="lead">${e("past.log.lead")}</p>
      <nav class="filters" aria-label=${e("past.log.filters")}>
        ${br.filter((e) => e === "all" || e === r || a.get(e)).map((t) => this.chip({
			tab: "review",
			section: "log",
			id: t
		}, e(t === "all" ? "past.log.all" : `past.log.filter.${t}`), t === r && !s, a.get(t)))}
      </nav>
      ${r !== "all" && r !== "joe" && (o.size > 1 || s) ? x`<nav class="filters" aria-label=${e("past.log.devices")}>
            ${[.../* @__PURE__ */ new Set([...o.keys(), ...s ? [s] : []])].map((e) => this.chip({
			tab: "review",
			section: "log",
			id: r,
			sub: e
		}, Cr(t, this.hass, i, r, e), e === s, o.get(e) ?? 0))}
          </nav>` : E}
      <section class="card" data-tipped>
        <div class="head">
          <div class="eyebrow"><ha-icon icon="mdi:clipboard-text-clock-outline"></ha-icon>${c}</div>
          ${v(e, "past_log")}
        </div>
        ${this.failed && n.length ? x`<div class="note"><ha-icon icon="mdi:information-outline"></ha-icon>${e("past.log.partial")}</div>` : E}
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
		return x`<a
      class="section-chip ${n ? "on" : ""}"
      href=${T(this.prefix, e)}
      aria-current=${n ? "page" : E}
      @click=${w(e, { replace: !0 })}
      >${t}${r == null ? E : x`<span class="section-count">${r}</span>`}</a
    >`;
	}
};
f([o({ attribute: !1 })], Ds.prototype, "hass", void 0), f([o({ attribute: !1 })], Ds.prototype, "t", void 0), f([o({ attribute: !1 })], Ds.prototype, "state", void 0), f([o({ attribute: !1 })], Ds.prototype, "prefix", void 0), f([o({ attribute: !1 })], Ds.prototype, "route", void 0), f([o({ attribute: !1 })], Ds.prototype, "climateFound", void 0), f([o({ attribute: !1 })], Ds.prototype, "group", void 0), f([o({ attribute: !1 })], Ds.prototype, "device", void 0), f([b()], Ds.prototype, "full", void 0), f([b()], Ds.prototype, "failed", void 0), h("joe-lookback-log", Ds);
//#endregion
//#region src/pages/lookback/result.ts
var Os = class extends u {
	constructor(...e) {
		super(...e), this.prefix = D, this.failed = !1;
	}
	static {
		this.styles = [p, g`
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
		let t = wi(this.state);
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
		return e ? x`<div class="wrap">
      ${d(e("past.result.title"))} ${y}
      <p class="lead">${e("past.result.lead")}</p>
      ${this.failed ? x`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("learn.failed")}</div>` : E}
      ${this.data ? x`${this.renderResults(e, this.data)} ${this.renderAccuracy(e, this.data)}` : E}
    </div>` : E;
	}
	renderResults(e, t) {
		let n = t.results, r = x`<div class="head">
      <div class="eyebrow"><ha-icon icon="mdi:cash-check"></ha-icon>${e("past.result.total")}</div>
      <span class="pill-sim">${e("mode.simulation")}</span>
      ${v(e, "sim_result")}
    </div>`;
		if (!n?.days) return x`<section class="card hero" data-tipped>${r}
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
		return x`<section class="card hero" data-tipped>
      ${r}
      <div class="figure">
        <div class="big ${n.saving > .005 ? "good" : n.saving < -.005 ? "bad" : ""}">
          ${mn(e, n.saving, this.currency, !0)}
        </div>
      </div>
      <p class="say">
        ${e("learn.results.say", {
			since: o ? B(e.lang, o) : "–",
			nights: _n(e, n.days)
		})}
      </p>
      <p class="split">
        ${e("learn.results.split", {
			better: n.better,
			worse: n.worse,
			same: Math.max(0, n.days - n.better - n.worse)
		})}
      </p>
      ${i.length > 1 ? x`<joe-chart
            .labels=${i.map((t) => B(e.lang, t.date, "weekday"))}
            .ticks=${Ti(e.lang, i.map((e) => e.date))}
            .series=${a}
            centerTicks
            unit=${hn(e.lang, this.currency)}
            height="160"
            lang=${e.lang}
            label=${e("learn.results.chart")}
          ></joe-chart>` : E}
    </section>`;
	}
	renderAccuracy(e, t) {
		let n = t.accuracy.slice(-14).reverse(), r = (t) => t == null ? "–" : z(e.lang, t, 1);
		return x`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:target"></ha-icon>${e("learn.accuracy")}</div>
        ${v(e, "learn_accuracy")}
      </div>
      ${n.length ? x`<div class="table" role="table" aria-label=${e("learn.accuracy")}>
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
			return x`<span role="cell"
                  ><a href=${T(this.prefix, n)} @click=${w(n)}>${B(e.lang, t.date, "weekday")}</a></span
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
                  >${mn(e, t.saving, this.currency, !0)}</span
                >`;
		})}
          </div>` : x`<p class="say">${e("learn.accuracy.none")}</p>`}
    </section>`;
	}
};
f([o({ attribute: !1 })], Os.prototype, "hass", void 0), f([o({ attribute: !1 })], Os.prototype, "t", void 0), f([o({ attribute: !1 })], Os.prototype, "state", void 0), f([o({ attribute: !1 })], Os.prototype, "prefix", void 0), f([o({ attribute: !1 })], Os.prototype, "route", void 0), f([o({ attribute: !1 })], Os.prototype, "climateFound", void 0), f([b()], Os.prototype, "data", void 0), f([b()], Os.prototype, "failed", void 0), h("joe-lookback-result", Os);
//#endregion
//#region src/pages/lookback/index.ts
var ks = {
	result: "joe-lookback-result",
	days: "joe-lookback-days",
	learned: "joe-lookback-learned",
	log: "joe-lookback-log"
}, As = {
	result: "mdi:piggy-bank-outline",
	days: "mdi:calendar-month-outline",
	learned: "mdi:school-outline",
	log: "mdi:format-list-bulleted"
}, js = class extends u {
	constructor(...e) {
		super(...e), this.prefix = D;
	}
	static {
		this.styles = [p, g`
      :host {
        display: block;
      }
    `];
	}
	render() {
		let e = this.t;
		if (!e || !this.state) return E;
		let t = this.route?.section ?? pe.review, n = le.review.map((t) => ({
			id: t,
			label: e(`nav.review.${t}`),
			icon: As[t]
		}));
		return x`${ur(e, this.prefix, "review", n, t)}${this.renderSection(t)}`;
	}
	renderSection(e) {
		if (!customElements.get(ks[e])) return x``;
		let { t, hass: n, state: r, prefix: i, route: a, climateFound: o } = this;
		switch (e) {
			case "result": return x`<joe-lookback-result
          .t=${t}
          .hass=${n}
          .state=${r}
          .prefix=${i}
          .route=${a}
          .climateFound=${o}
        ></joe-lookback-result>`;
			case "days": return x`<joe-lookback-days
          .t=${t}
          .hass=${n}
          .state=${r}
          .prefix=${i}
          .route=${a}
          .climateFound=${o}
          .day=${a?.id}
        ></joe-lookback-days>`;
			case "learned": return x`<joe-lookback-learned
          .t=${t}
          .hass=${n}
          .state=${r}
          .prefix=${i}
          .route=${a}
          .climateFound=${o}
          .anchor=${a?.id}
        ></joe-lookback-learned>`;
			case "log": return x`<joe-lookback-log
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
f([o({ attribute: !1 })], js.prototype, "hass", void 0), f([o({ attribute: !1 })], js.prototype, "t", void 0), f([o({ attribute: !1 })], js.prototype, "state", void 0), f([o({ attribute: !1 })], js.prototype, "route", void 0), f([o({ attribute: !1 })], js.prototype, "prefix", void 0), f([o({ attribute: !1 })], js.prototype, "climateFound", void 0), h("joe-lookback-page", js);
//#endregion
//#region src/components/review.ts
var Ms = /* @__PURE__ */ new Set([
	"climate",
	"heat_pump",
	"electric_heating",
	"hot_water"
]), Ns = class extends u {
	constructor(...e) {
		super(...e), this.checks = [], this.omit = [], this.tariffOpen = !1;
	}
	static {
		this.styles = [
			p,
			Ha,
			g`
      :host {
        display: block;
      }
      joe-tariff-draft {
        margin-top: 18px;
      }
    `
		];
	}
	render() {
		let { hass: e, t, config: n } = this;
		if (!e || !t || !n) return E;
		let r = new Set(this.omit);
		return x`<ul class="found">
        ${this.rows(e, t, n).filter((e) => !r.has(e.key)).map((e) => Wa(t, e))}
      </ul>
      ${this.tariffOpen ? this.renderTariff(t, n) : E}`;
	}
	rows(e, t, n) {
		let r = this.discovery, i = {
			from: this,
			hass: e,
			t,
			config: n,
			discovery: r,
			checks: this.checks
		}, a = [], o = $a(i);
		o && a.push(o), a.push(...this.batteryRows(e, t, n));
		let s = n.tariff.kind === "unknown";
		a.push(eo(i, { actions: [Y(t(s ? "review.enter" : "review.change"), "mdi:pencil-outline", () => {
			this.tariffOpen = !0;
		})] })), a.push(to(i)), a.push(ro(i, "grid_power")), a.push(ro(i, "home_power", { devices: Y(t("review.home.devices"), "mdi:devices", () => this.edit("consumers")) })), a.push(so(i)), a.push(qa(this, e, t, n, r, "weather")), a.push(qa(this, e, t, n, r, "holiday"));
		let c = [x`<span class="chip soon">${t("review.ask_later")}</span>`];
		(n.persons.length || r?.calendars.length) && a.push({
			key: "people",
			icon: "mdi:account-group-outline",
			title: t("find.people"),
			detail: t("find.people.detail", {
				persons: Ya(t, n.persons.length, "word.person"),
				calendars: Ya(t, r?.calendars.length ?? 0, "word.calendar")
			}),
			chips: c
		});
		let l = n.consumers.filter((e) => e.kind !== "submeter");
		return l.length && a.push({
			key: "devices",
			icon: "mdi:devices",
			title: t("find.devices"),
			detail: t("find.devices.detail", {
				count: Ya(t, l.length, "word.device"),
				heating: l.filter((e) => Ms.has(e.kind)).length
			}),
			chips: c
		}), a;
	}
	batteryRows(i, o, s) {
		let c = [];
		for (let l of s.batteries) {
			let u = this.discovery?.batteries.find((e) => e.id === l.id), d = e(i, l.soc_entity), f = l.capacity_kwh ?? n(i, l.capacity_entity), p = [
				f ? `${r(o.lang, f, 2)} kWh` : o("review.capacity_unknown"),
				d === null ? null : `${r(o.lang, d, 0)} %`,
				l.adapter === "none" ? o("find.battery.read") : o("find.battery.control")
			], m = this.checks.filter((e) => e.battery_id === l.id);
			c.push({
				key: `battery:${l.id}`,
				icon: "mdi:home-battery-outline",
				title: l.name,
				detail: p.filter(Boolean).join(" · "),
				chips: [t(o, k(s, `batteries[${l.id}].soc_entity`)), ...u ? [a(o, u.confidence)] : []],
				reasons: u?.reasons,
				notes: m.map((e) => Xa(o, e)),
				state: m.some((e) => e.level === "warn") ? "flag" : void 0,
				tip: "review_battery",
				actions: [Y(o("review.change"), "mdi:pencil-outline", () => this.edit("battery", l.id)), Y(o("review.ignore"), "", () => this.ignoreBattery(l.id), !0)]
			});
		}
		for (let e of this.discovery?.batteries ?? []) A(s, `battery:${e.id}`) && !s.batteries.some((t) => t.id === e.id) && c.push({
			key: `battery:${e.id}`,
			icon: "mdi:home-battery-outline",
			title: e.name,
			detail: o("review.ignored"),
			state: "ignored",
			tip: "review_ignored",
			actions: [Y(o("review.use"), "mdi:undo-variant", () => void fr(this, s, e))]
		});
		return !s.batteries.length && !this.discovery?.batteries.length && c.push({
			key: "battery:add",
			icon: "mdi:home-battery-outline",
			title: o("review.battery"),
			detail: o("review.battery.none"),
			state: "missing",
			tip: "review_battery_add",
			actions: [Y(o("review.add"), "mdi:plus", () => void pr(this, o, i, s))]
		}), c;
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
		M(this, {
			batteries: { [e]: null },
			answers: { ignored: j(this.config, `battery:${e}`, !0) }
		});
	}
	renderTariff(e, t) {
		return x`<joe-sheet label=${e("edit.tariff.label")} closeLabel=${e("common.close")} @joe-close=${(e) => {
			e.stopPropagation(), this.tariffOpen = !1;
		}}>
      <div class="sheet-title">${d(e("edit.tariff.title"))}</div>
      <joe-tariff-draft closable .hass=${this.hass} .t=${e} .config=${t} .discovery=${this.discovery}></joe-tariff-draft>
    </joe-sheet>`;
	}
};
f([o({ attribute: !1 })], Ns.prototype, "hass", void 0), f([o({ attribute: !1 })], Ns.prototype, "t", void 0), f([o({ attribute: !1 })], Ns.prototype, "config", void 0), f([o({ attribute: !1 })], Ns.prototype, "discovery", void 0), f([o({ attribute: !1 })], Ns.prototype, "checks", void 0), f([o({ attribute: !1 })], Ns.prototype, "omit", void 0), f([b()], Ns.prototype, "tariffOpen", void 0), h("joe-review", Ns);
//#endregion
//#region src/components/step-nav.ts
function Ps(e, t, n = !1) {
	let r = x`<button type="button" class="btn btn-primary" ?data-notip=${!t.nextTip} @click=${t.next}>
    ${t.nextLabel}<ha-icon icon="mdi:chevron-right"></ha-icon>
  </button>`;
	return x`<nav class="step-nav ${n ? "wide" : ""}" aria-label=${e("onb.nav")}>
    ${t.back ? x`<button type="button" class="btn btn-ghost" data-notip @click=${t.back}>
          <ha-icon icon="mdi:chevron-left"></ha-icon>${t.backLabel ?? e("onb.back")}
        </button>` : x`<span></span>`}
    ${t.nextTip ? x`<span class="with-tip" data-tipped>${r} ${v(e, t.nextTip)}</span>` : r}
  </nav>`;
}
//#endregion
//#region src/pages/questions.ts
var Fs = {
	tariff: "plan",
	feed_in: "plug",
	capacity: "night-charge",
	heating: "ask",
	hot_water: "hot-water",
	ev: "ev",
	household: "relax"
}, Is = [
	"climate",
	"heat_pump",
	"electric_heating"
];
function Ls(e) {
	let t = [], n = (t) => k(e, t)?.source === "user", r = (t) => e.answers[t] !== void 0 && e.answers[t] !== null, i = e.tariff;
	(i.kind === "unknown" || n("tariff.kind") || r("tariff")) && t.push("tariff"), (i.feed_in_price == null && !i.feed_in_entity || n("tariff.feed_in_price") || r("feed_in")) && t.push("feed_in");
	for (let i of e.batteries) {
		let e = `capacity:${i.id}`;
		(i.capacity_kwh == null && !i.capacity_entity || n(`batteries[${i.id}].capacity_kwh`) || r(e)) && t.push(e);
	}
	return t.push("heating", "hot_water", "ev", "household"), t;
}
var Rs = class extends u {
	constructor(...e) {
		super(...e), this.single = "", this.index = 0;
	}
	static {
		this.styles = [p, g`
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
		if (!e || !t) return E;
		if (this.single) return this.renderQuestion(e, t, this.single);
		let n = Ls(t), r = Math.min(this.index, n.length - 1), i = n[r], a = r === n.length - 1, o = Ps(e, {
			back: () => this.move(-1, n.length),
			next: () => this.move(1, n.length),
			nextLabel: e(a ? "ask.finish" : "onb.next")
		});
		return x`${o}
      <div class="wrap">
        <joe-pose name=${Fs[i.split(":")[0]] ?? "ask"}></joe-pose>
        <div>
          <nav class="topics" aria-label=${e("ask.topics")} data-notip>
            <span class="eyebrow">${e("ask.count", {
			n: r + 1,
			total: n.length
		})}</span>
            ${n.map((n, i) => x`${i ? x`<ha-icon class="arrow" icon="mdi:chevron-right" aria-hidden="true"></ha-icon>` : E}<button
                type="button"
                class="topic ${i < r ? "done" : ""}"
                aria-current=${i === r ? "step" : "false"}
                @click=${() => this.index = i}
              >
                ${i < r ? x`<ha-icon icon="mdi:check"></ha-icon>` : E}${this.topic(e, t, n)}
              </button>`)}
          </nav>
          ${this.renderQuestion(e, t, i)}
          <div class="actions" data-notip>
            <button type="button" class="btn btn-primary" @click=${() => this.move(1, n.length)}>
              ${e(a ? "ask.finish" : "onb.next")}
            </button>
            <button type="button" class="btn btn-ghost" @click=${() => this.move(-1, n.length)}>
              ${e("onb.back")}
            </button>
          </div>
        </div>
      </div>`;
	}
	renderQuestion(e, t, n) {
		if (n.startsWith("capacity:")) return this.renderCapacity(e, t, n.slice(9));
		switch (n) {
			case "tariff": return this.question(e("q.tariff.title"), "q_tariff", x`<joe-tariff-form
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
			case "ev": {
				let t = this.discovery?.wallboxes.find((e) => e.is_car);
				return this.question(e("q.ev.title"), "q_ev", this.choice(e, "ev", [{
					value: "yes",
					label: t ? e("q.ev.yes_wallbox", { name: t.name }) : e("q.ev.yes"),
					icon: "mdi:car-electric"
				}, {
					value: "no",
					label: e("q.ev.no"),
					icon: "mdi:car-off"
				}]));
			}
			default: return this.question(e("q.household.title"), "q_household", x`<joe-household
            .hass=${this.hass}
            .t=${e}
            .config=${t}
            .discovery=${this.discovery}
          ></joe-household>`);
		}
	}
	question(e, t, n) {
		let r = this.t;
		return x`<div data-tipped>
      <div class="title-row">${d(e, "h2", v(r, t))}</div>
      ${y}
      <div class="content">${n}</div>
    </div>`;
	}
	choice(e, t, n, r = !1) {
		let i = this.config?.answers[t];
		return x`<joe-choice
      .options=${n}
      .value=${Array.isArray(i) ? i : typeof i == "string" ? [i] : []}
      ?multiple=${r}
      .exclusive=${["none"]}
      idk=${e("ask.idk")}
      @joe-choice=${(e) => M(this, { answers: { [t]: r ? e.detail.value : e.detail.value[0] ?? null } })}
    ></joe-choice>`;
	}
	renderHotWater(e, t) {
		let n = t.answers.hot_water, r = n === "hot_water_heat_pump" || n === "electric", i = t.consumers.filter((e) => e.kind === "hot_water"), a = t.actions.find((e) => e.kind === "target");
		return this.question(e("q.hot_water.title"), "q_hot_water", x`${this.choice(e, "hot_water", [
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
      ${r ? x`<div class="follow">
            <p class="hint">${i.length ? e("q.hot_water.devices") : e("q.hot_water.no_devices")}</p>
            ${i.length ? x`<div class="chips">${i.map((e) => x`<span class="chip learned">${e.name}</span>`)}</div>` : E}
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
              ${v(e, "q_hot_water_action")}
            </div>
          </div>` : E}`);
	}
	renderHeating(e, t) {
		let n = t.answers.heating, r = Array.isArray(n) ? n : [], i = t.consumers.filter((e) => r.includes(e.kind)), a = r.some((e) => Is.includes(e));
		return this.question(e("q.heating.title"), "q_heating", x`${this.choice(e, "heating", [
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
        ${a && t.consumers.length ? x`<div class="follow">
              <p class="hint">${i.length ? e("q.heating.devices") : e("q.heating.no_devices")}</p>
              ${i.length ? x`<div class="chips">
                    ${i.map((e) => x`<span class="chip learned">${e.name}</span>`)}
                  </div>` : E}
              <div class="with-tip" style="margin-top:10px">
                <button type="button" class="mini-btn" @click=${() => this.edit("consumers")}>
                  <ha-icon icon="mdi:devices"></ha-icon>${e("q.heating.assign")}
                </button>
                ${v(e, "f_consumer_kind")}
              </div>
            </div>` : E}`);
	}
	renderFeedIn(e, t) {
		let n = t.tariff.feed_in_price, r = t.answers.feed_in === Qr;
		return this.question(e("q.feed_in.title"), "q_feed_in", x`<div class="inline">
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
			M(this, {
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
          @click=${() => M(this, {
			tariff: { feed_in_price: 0 },
			answers: { feed_in: "none" }
		})}
        >
          ${e("q.feed_in.none")}
        </button>
        <button
          type="button"
          class="mini-btn ${r ? "go" : ""}"
          @click=${() => M(this, {
			tariff: { feed_in_price: null },
			answers: { feed_in: Qr }
		})}
        >
          ${e("ask.idk")}
        </button>
      </div>`);
	}
	renderCapacity(e, t, n) {
		let r = t.batteries.find((e) => e.id === n);
		if (!r) return x``;
		let i = `capacity:${n}`, a = t.answers[i] === Qr;
		return this.question(e("q.capacity.title", { name: r.name }), "q_capacity", x`<div class="inline">
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
			M(this, {
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
          @click=${() => M(this, {
			batteries: { [n]: { capacity_kwh: null } },
			answers: { [i]: Qr }
		})}
        >
          ${e("ask.idk_learn")}
        </button>
      </div>`);
	}
	saveTariff(e) {
		let t = { tariff: e };
		e.kind && (t.answers = { tariff: e.kind }), M(this, t);
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
f([o({ attribute: !1 })], Rs.prototype, "hass", void 0), f([o({ attribute: !1 })], Rs.prototype, "t", void 0), f([o({ attribute: !1 })], Rs.prototype, "config", void 0), f([o({ attribute: !1 })], Rs.prototype, "discovery", void 0), f([o()], Rs.prototype, "single", void 0), f([b()], Rs.prototype, "index", void 0), h("joe-questions", Rs);
//#endregion
//#region src/pages/onboarding.ts
function zs(e, t, n) {
	let [i, a] = e(n).split("|");
	return `${r(e.lang, t, 0)} ${t === 1 ? i : a}`;
}
var Bs = {
	climate: "q.heating.climate",
	heat_pump: "q.heating.heat_pump",
	electric_heating: "q.heating.electric",
	none: "q.heating.none"
}, Vs = class extends u {
	constructor(...e) {
		super(...e), this.step = "welcome", this.checks = [], this.discovering = !1, this.discoveryFailed = !1;
	}
	static {
		this.styles = [p, g`
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
      .lines div {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        padding: 10px 0;
        border-top: 1px solid var(--joe-line);
      }
      .lines div:first-child {
        border-top: 0;
      }
      .lines span:first-child {
        color: var(--joe-ink-2);
      }
      .lines span:last-child {
        font-weight: 600;
        text-align: right;
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
		if (!e) return E;
		switch (this.step) {
			case "welcome": return this.layout("welcome", x`${d(e("onb.welcome.title"), "h1")} ${y}
            <p class="lead">${e("onb.welcome.lead")}</p>
            <div class="calm"><span class="pill-sim">${e("mode.simulation")}</span>${e("onb.calm")}</div>
            <details data-notip>
              <summary>${e("onb.welcome.more")}</summary>
              ${e("onb.welcome.more.text").split("\n").map((e) => x`<p>${e}</p>`)}
            </details>
            <div class="actions" data-tipped>
              <button type="button" class="btn btn-primary" @click=${() => this.go("scan")}>
                ${e("onb.welcome.go")}
              </button>
              ${v(e, "scan_start")}
            </div>`);
			case "scan": return this.renderScan(e);
			case "questions": return x`<joe-questions
          .hass=${this.hass}
          .t=${e}
          .config=${this.config}
          .discovery=${this.discovery}
        ></joe-questions>`;
			case "done": return this.renderDone(e);
		}
	}
	renderScan(e) {
		if (this.discovering || !this.discovery && !this.discoveryFailed) return this.layout("scout", x`${d(e("onb.scan.title"))} ${y}
          <p class="lead">${e("onb.scan.lead")}</p>
          ${this.renderEnergy(e)}
          <div class="looking" role="status">${e("scan.looking")}</div>`);
		let t = Ps(e, {
			back: () => this.go("welcome"),
			next: () => this.go("questions"),
			nextLabel: e("onb.next")
		}, !0);
		return x`${t}
      <div class="wrap wide">
        <joe-pose name="scout"></joe-pose>
        <div>
          ${d(e("scan.title"))} ${y}
          <p class="lead">${e("scan.lead")}</p>
          ${this.discoveryFailed ? x`<p class="failed">${e("scan.failed")}</p>` : E}
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
              ${v(e, "rescan")}
            </span>
            <button type="button" class="btn btn-ghost" data-notip @click=${() => this.go("welcome")}>
              ${e("onb.back")}
            </button>
          </div>
        </div>
      </div>`;
	}
	renderDone(e) {
		let t = Ps(e, {
			back: () => this.go("scan"),
			backLabel: e("onb.done.change"),
			next: () => this.complete(),
			nextLabel: e("onb.done.go"),
			nextTip: "start"
		});
		return x`${t}
    ${this.layout("thumbs", x`${d(e("onb.done.title"))} ${y}
        ${this.config ? this.renderSummary(e, this.config) : E}
        <div class="calm"><span class="pill-sim">${e("mode.simulation")}</span>${e("onb.done.lead")}</div>
        <div class="actions">
          <span class="with-tip" data-tipped>
            <button type="button" class="btn btn-primary" @click=${this.complete}>${e("onb.done.go")}</button>
            ${v(e, "start")}
          </span>
          <button type="button" class="btn btn-ghost" data-notip @click=${() => this.go("scan")}>
            ${e("onb.done.change")}
          </button>
        </div>`)}`;
	}
	renderSummary(e, t) {
		let i = this.hass, a = t.batteries.reduce((e, t) => e + (t.capacity_kwh ?? (i ? n(i, t.capacity_entity) : null) ?? 0), 0), o = (n, r) => {
			let i = t.answers[n];
			if (i === "unknown") return e("sum.unknown");
			let a = Array.isArray(i) ? i : typeof i == "string" ? [i] : [];
			return a.length ? a.map((t) => e.optional(r[t] ?? "") ?? t).join(", ") : e("sum.open");
		}, s = this.discovery?.forecast, c = [
			[e("sum.batteries"), t.batteries.length ? e("sum.batteries.value", {
				count: t.batteries.length,
				kwh: a ? r(e.lang, a, 1) : "?"
			}) : e("sum.none")],
			[e("sum.tariff"), t.tariff.kind === "unknown" ? e("sum.unknown") : Ie(e, t.tariff, !1)],
			[e("sum.feed_in"), t.tariff.feed_in_price == null ? t.tariff.feed_in_entity ? e("sum.from_sensor") : e("sum.unknown") : `${Fe(e, t.tariff.feed_in_price)} ct`],
			[e("sum.forecast"), t.forecast.provider ? s ? e("sum.forecast.value", {
				provider: s.provider_name,
				planes: zs(e, s.planes, "word.plane")
			}) : t.forecast.provider : e("sum.none")],
			[e("sum.heating"), o("heating", Bs)],
			[e("sum.hot_water"), o("hot_water", {
				hot_water_heat_pump: "q.hot_water.heat_pump",
				electric: "q.hot_water.electric",
				heating: "q.hot_water.heating",
				other: "q.hot_water.other"
			})],
			[e("sum.ev"), o("ev", {
				yes: "q.ev.yes",
				no: "q.ev.no"
			})],
			[e("sum.household"), e("sum.household.value", {
				persons: zs(e, t.persons.length, "word.person"),
				calendars: zs(e, t.persons.reduce((e, t) => e + t.calendars.length, 0), "word.calendar")
			})]
		];
		return x`<div class="lines">
      ${c.map(([e, t]) => x`<div><span>${e}</span><span>${t}</span></div>`)}
    </div>`;
	}
	rediscover() {
		this.dispatchEvent(new CustomEvent("joe-rediscover", {
			bubbles: !0,
			composed: !0
		}));
	}
	layout(e, t) {
		return x`<div class="wrap">
      <joe-pose name=${e}></joe-pose>
      <div>${t}</div>
    </div>`;
	}
	renderEnergy(e) {
		let t = this.info?.energy;
		if (!t?.configured || !t.sources) return x`<div class="found"><p>${e("onb.scan.energy.none")}</p></div>`;
		let n = [
			[t.sources.grid ?? 0, e("energy.grid")],
			[t.sources.solar ?? 0, e("energy.solar")],
			[t.sources.battery ?? 0, e("energy.battery")],
			[t.devices ?? 0, e("energy.devices")]
		];
		return x`<div class="found">
      <p>${e("onb.scan.energy")}</p>
      <div class="chips">
        ${n.map(([e, t]) => x`<span class="chip read"><ha-icon icon="mdi:eye-outline"></ha-icon>${e} ${t}</span>`)}
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
	complete() {
		this.dispatchEvent(new CustomEvent("joe-onboarding", {
			detail: {
				step: "done",
				completed: !0
			},
			bubbles: !0,
			composed: !0
		}));
	}
};
f([o()], Vs.prototype, "step", void 0), f([o({ attribute: !1 })], Vs.prototype, "t", void 0), f([o({ attribute: !1 })], Vs.prototype, "info", void 0), f([o({ attribute: !1 })], Vs.prototype, "hass", void 0), f([o({ attribute: !1 })], Vs.prototype, "config", void 0), f([o({ attribute: !1 })], Vs.prototype, "discovery", void 0), f([o({ attribute: !1 })], Vs.prototype, "checks", void 0), f([o({ type: Boolean })], Vs.prototype, "discovering", void 0), f([o({ type: Boolean })], Vs.prototype, "discoveryFailed", void 0), h("joe-onboarding", Vs);
//#endregion
//#region src/components/steer-tonight.ts
function Hs(e) {
	let t = e?.plan;
	return !!(e?.control && ["advisory", "live"].includes(e.mode) && t?.window && t.kind !== "none" && t.kind !== "unavailable");
}
function Us(e) {
	let t = e?.plan?.window?.start, n = e?.control;
	return !!(Hs(e) && e?.mode === "advisory" && t && n?.skip !== t && n?.answer?.night !== t);
}
function Ws(e) {
	let t = e.control?.ready ?? {};
	return e.config.batteries.filter((e) => e.adapter !== "none" && t[e.id] && t[e.id] !== "ready");
}
var Gs = class extends u {
	constructor(...e) {
		super(...e), this.prefix = D, this.compact = !1, this.hideUntested = !1, this.busy = !1;
	}
	static {
		this.styles = [p, g`
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
		if (!e || !t || !n || !r?.window || !Hs(t)) return E;
		let i = r.window.start, a = n.skip === i, o = n.answer?.night === i ? n.answer.yes : null, s, c = E;
		if (t.mode === "advisory" && !a) {
			s = e(o === !0 ? "plan.steer.answered_yes" : o === !1 ? "plan.steer.answered_no" : "plan.steer.advisory");
			let t = o === !0 ? E : x`<button type="button" class="btn btn-primary" ?disabled=${this.busy} @click=${() => this.answer(i, !0)}>
              ${e("plan.steer.yes")}
            </button>`, n = o !== !1 && !this.compact ? x`<button type="button" class="btn btn-secondary" ?disabled=${this.busy} @click=${() => this.answer(i, !1)}>
              ${e("plan.steer.no")}
            </button>` : E;
			c = t === E && n === E ? E : x`${t} ${n}`;
		} else s = e(a ? "plan.steer.skipped" : "plan.steer.live"), c = x`<button type="button" class="btn btn-secondary" ?disabled=${this.busy} @click=${() => this.skip(!a)}>
        ${e(a ? "plan.steer.unskip" : "plan.steer.skip")}
      </button>`;
		return x`<section class="steer" data-tipped>
      <div class="head">${s} ${v(e, "plan_steer")}</div>
      ${this.hideUntested ? E : this.renderUntested(e, t)}
      ${c === E ? E : x`<div class="actions">${c}</div>`}
    </section>`;
	}
	renderUntested(e, t) {
		let n = Ws(t);
		if (!n.length) return E;
		let [r, i = ""] = e("plan.steer.untested", { names: "\0" }).split("\0"), a = n.map((e, t) => x`${t ? ", " : ""}${ve(this.prefix, {
			tab: "devices",
			section: "battery",
			id: e.id
		}, e.name)}`);
		return x`<div class="note warn">
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
f([o({ attribute: !1 })], Gs.prototype, "hass", void 0), f([o({ attribute: !1 })], Gs.prototype, "t", void 0), f([o({ attribute: !1 })], Gs.prototype, "state", void 0), f([o({ attribute: !1 })], Gs.prototype, "prefix", void 0), f([o({
	type: Boolean,
	reflect: !0
})], Gs.prototype, "compact", void 0), f([o({ type: Boolean })], Gs.prototype, "hideUntested", void 0), f([b()], Gs.prototype, "busy", void 0), h("joe-steer-tonight", Gs);
//#endregion
//#region src/pages/overview/climate-list.ts
function Ks(e) {
	let t = e?.config.climate;
	return t?.enabled ? Object.entries(t.rooms ?? {}).filter(([, e]) => e.enabled).map(([e]) => e) : [];
}
var qs = {
	tab: "devices",
	section: "climate"
}, Js = class extends u {
	constructor(...e) {
		super(...e), this.prefix = D;
	}
	static {
		this.styles = [p, g`
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
		let { t: e, hass: t, state: n } = this, r = Ks(n);
		if (!e || !n || !r.length) return E;
		let i = n.config, a = i.climate?.away_after_min ?? 15, o = r.map((r) => {
			let o = this.climateFound?.devices.find((e) => e.entity_id === r), s = i.climate?.rooms[r], c = n.climate?.rooms[r];
			return {
				entity: r,
				name: o?.name ?? (t ? O(t, r) : r),
				area: o?.area ?? Xe(t, o?.device_id, r) ?? "",
				temps: Na(e, Ma(t, o, r)),
				profile: o ? Pa(e, o, c, s?.device_profiles ?? {}) : void 0,
				why: Fa(e, c, a)
			};
		});
		o.sort((t, n) => t.area.localeCompare(n.area, e.lang) || t.name.localeCompare(n.name, e.lang));
		let s = !!n.climate?.live;
		return x`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:thermostat"></ha-icon>${e("overview.climate")}</div>
        ${s ? E : x`<span class="chip">${e("overview.climate.would")}</span>`}
        ${v(e, "overview_climate")}
        <a class="mini-btn quiet all" href=${T(this.prefix, qs)} @click=${w(qs)}>${e("overview.climate.all")}</a>
      </div>
      <div class="rooms">
        ${o.map((e) => {
			let t = P({
				group: "climate",
				id: e.entity
			}), n = [e.profile, e.why].filter(Boolean).join(" · ");
			return x`<a class="room" href=${T(this.prefix, t)} @click=${w(t)}>
            <span class="room-text">
              <span class="room-name">${e.area || e.name}${e.area ? x`<small>${e.name}</small>` : E}</span>
              ${e.temps ? x`<span class="room-temp">${e.temps}</span>` : E}
              ${n ? x`<span class="room-why">${n}</span>` : E}
            </span>
            <ha-icon class="go" icon="mdi:chevron-right"></ha-icon>
          </a>`;
		})}
      </div>
    </section>`;
	}
};
f([o({ attribute: !1 })], Js.prototype, "hass", void 0), f([o({ attribute: !1 })], Js.prototype, "t", void 0), f([o({ attribute: !1 })], Js.prototype, "state", void 0), f([o({ attribute: !1 })], Js.prototype, "prefix", void 0), f([o({ attribute: !1 })], Js.prototype, "climateFound", void 0), h("joe-overview-climate", Js);
//#endregion
//#region src/components/day-questions.ts
var Ys = {
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
}, Xs = class extends u {
	constructor(...e) {
		super(...e), this.questions = [], this.bare = !1, this.failed = !1, this.answered = /* @__PURE__ */ new Set();
	}
	static {
		this.styles = [p, g`
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
		return !e || !t.length ? E : x`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:chat-question-outline"></ha-icon>${e("ask.title")}</div>
        ${v(e, "ask_day")}
      </div>
      <p class="lead">${e("ask.lead")}</p>
      ${t.map((t) => x`<div class="question">
          <p>
            ${e(`ask.${t.kind}`, {
			day: B(e.lang, t.date, "weekday"),
			actual: z(e.lang, t.actual, 1),
			expected: z(e.lang, t.expected, 1)
		})}
          </p>
          <div class="answers" role="group" aria-label=${e("ask.answers")}>
            ${Ys[t.kind].map((n) => x`<button
                  type="button"
                  class="mini-btn ${n === "normal" ? "quiet" : ""}"
                  ?disabled=${this.busy === t.date}
                  @click=${() => this.answer(t.date, n)}
                >
                  ${e(`ask.answer.${n}`)}
                </button>`)}
          </div>
        </div>`)}
      ${this.failed ? x`<div class="note warn" role="status"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("error.action")}</div>` : E}
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
f([o({ attribute: !1 })], Xs.prototype, "hass", void 0), f([o({ attribute: !1 })], Xs.prototype, "t", void 0), f([o({ attribute: !1 })], Xs.prototype, "questions", void 0), f([o({
	type: Boolean,
	reflect: !0
})], Xs.prototype, "bare", void 0), f([b()], Xs.prototype, "busy", void 0), f([b()], Xs.prototype, "failed", void 0), f([b()], Xs.prototype, "answered", void 0), h("joe-day-questions", Xs);
//#endregion
//#region src/pages/overview/inbox.ts
function Zs(e) {
	return `todo:${e}`;
}
function Qs(e) {
	return e.level === "warn" || e.code === "tariff_unknown" || e.code === "missing" && e.role === "grid_power";
}
function $s(e) {
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
function ec(e, t, n = {}) {
	let r = t.config, i = t.control, a = n.devices ?? [], o = (t, n, r) => it(a, t, n)?.name ?? r ?? (t === "grid" ? e("devices.grid.connection") : n), s = (e) => !A(r, Zs(e)), c = [], l = (e) => {
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
	for (let t of (n.checks ?? []).filter(Qs)) {
		let n = $s(t), r = String(t.battery_id ?? t.role ?? t.entity_id ?? "");
		u({
			id: `check:${t.code}:${r}`,
			title: o(n.group, n.group === "grid" && n.id === "tariff" ? "connection" : n.id, t.battery),
			text: Le(e, t),
			to: P(n)
		});
	}
	let f = (t) => e.optional(`devices.problem.${t}`) ?? t;
	for (let e of r.batteries.filter((e) => e.adapter !== "none")) {
		let t = i?.batteries[e.id]?.problem ?? (i?.ready[e.id] === "controls_missing" ? "controls_missing" : null);
		t && u({
			id: `problem:battery:${e.id}:${t}`,
			title: e.name,
			text: f(t),
			to: P({
				group: "battery",
				id: e.id
			})
		});
	}
	for (let e of r.actions) {
		let t = i?.actions?.[e.id]?.problem;
		if (t) {
			let n = Je(r, e);
			u({
				id: `problem:${n.group}:${e.id}:${t}`,
				title: o(n.group, n.id, e.name),
				text: f(t),
				to: P(n)
			});
		}
	}
	let p = r.climate?.enabled ? r.climate.rooms ?? {} : {};
	for (let [n, r] of Object.entries(p)) {
		let i = r.enabled ? t.climate?.rooms[n]?.error : null;
		i && u({
			id: `problem:climate:${n}:${i}`,
			title: o("climate", n, n),
			text: e.optional(`week.error.${i}`) ?? e("week.error", { error: i }),
			to: P({
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
			to: P({
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
	let m = n.climateFound?.devices.length ?? 0, h = !!(r.climate?.enabled && Object.values(r.climate.rooms ?? {}).some((e) => e.enabled));
	m && !h && l({
		id: "climate",
		icon: "mdi:thermostat",
		title: e("overview.todo.climate"),
		text: e("overview.todo.climate.text"),
		to: {
			tab: "devices",
			section: "climate"
		}
	});
	let g = a.filter((e) => e.group === "car" && !e.action?.need?.enabled);
	for (let [t, n] of [[!1, "car"], [!0, "car_setup"]]) d(g.filter((e) => !!e.setup === t).map((n) => ({
		id: `car:${n.id}`,
		name: n.name,
		one: {
			icon: "mdi:car-electric",
			title: e(t ? "overview.todo.car.setup" : "overview.todo.car", { name: n.name }),
			text: e("overview.todo.car.text"),
			to: P(n)
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
	let _ = st(r, n.discovery).filter((e) => s(`new:${e.key}`));
	return _.length && c.push({
		id: `new:${_.map((e) => e.key).join(",")}`,
		hide: _.map((e) => `new:${e.key}`),
		icon: "mdi:new-box",
		title: e("overview.todo.new", { names: _.map((e) => e.name).join(", ") }),
		text: e("overview.todo.new.text"),
		to: {
			tab: "devices",
			section: "all"
		}
	}), c;
}
var tc = 3, nc = class extends u {
	constructor(...e) {
		super(...e), this.prefix = D, this.items = [], this.steer = !1, this.all = !1, this.asking = !1, this.dismissed = /* @__PURE__ */ new Set(), this.hiding = [];
	}
	static {
		this.styles = [p, g`
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
    `];
	}
	render() {
		let e = this.t, t = this.state;
		if (!e || !t) return E;
		let n = t.questions ?? [], r = this.items.filter((e) => !this.dismissed.has(e.id));
		if (!r.length && !n.length && !this.steer) return E;
		let i = this.all ? r : r.slice(0, tc), a = r.length - i.length, o = r.some((e) => e.id.startsWith("test:"));
		return x`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:bell-ring-outline"></ha-icon>${e("overview.inbox")}</div>
        <span class="chip warn">${e("overview.inbox.count", { count: r.length + n.length + +!!this.steer })}</span>
        ${v(e, "inbox")}
      </div>
      <ul>
        ${this.steer ? x`<li class="steer">
              <span class="todo-icon"><ha-icon icon="mdi:weather-night"></ha-icon></span>
              <joe-steer-tonight
                compact
                .hideUntested=${o}
                .t=${e}
                .hass=${this.hass}
                .state=${t}
                .prefix=${this.prefix}
              ></joe-steer-tonight>
            </li>` : E}
        ${i.map((t) => this.renderItem(e, t))}
        ${n.length ? this.renderAsk(e, n.length) : E}
      </ul>
      ${a > 0 || this.all && r.length > tc ? x`<div class="more-row" data-notip>
            <button type="button" class="mini-btn quiet" aria-expanded=${this.all ? "true" : "false"} @click=${() => this.all = !this.all}>
              <ha-icon icon=${this.all ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
              ${this.all ? e("overview.inbox.less") : e("overview.inbox.more", { count: a })}
            </button>
          </div>` : E}
      ${n.length && this.asking ? x`<joe-day-questions bare .hass=${this.hass} .t=${e} .questions=${n}></joe-day-questions>` : E}
    </section>`;
	}
	renderItem(e, t) {
		return x`<li class=${t.warn ? "warn" : ""}>
      <a class="todo-main" href=${T(this.prefix, t.to)} @click=${w(t.to)}>
        <span class="todo-icon"><ha-icon icon=${t.icon}></ha-icon></span>
        <span class="todo-text">
          <b>${t.title}</b>
          ${t.text ? x`<small>${t.text}</small>` : E}
        </span>
        <ha-icon class="go" icon="mdi:chevron-right"></ha-icon>
      </a>
      ${t.hide.length ? x`<span class="todo-actions" data-tipped>
            <button type="button" class="mini-btn quiet" @click=${() => this.dismiss(t)}>${e("overview.todo.dismiss")}</button>
            ${v(e, "todo_dismiss")}
          </span>` : E}
    </li>`;
	}
	renderAsk(e, t) {
		return x`<li class="ask" data-notip>
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
	async dismiss(e) {
		let t = this.state?.config;
		if (!t) return;
		this.dismissed = /* @__PURE__ */ new Set([...this.dismissed, e.id]), this.hiding = [...this.hiding, ...e.hide];
		let n = [...t.answers.ignored];
		for (let e of this.hiding) n.includes(Zs(e)) || n.push(Zs(e));
		if (!await M(this, { answers: { ignored: n } })) {
			let t = new Set(this.dismissed);
			t.delete(e.id), this.dismissed = t, this.hiding = this.hiding.filter((t) => !e.hide.includes(t));
		}
	}
};
f([o({ attribute: !1 })], nc.prototype, "hass", void 0), f([o({ attribute: !1 })], nc.prototype, "t", void 0), f([o({ attribute: !1 })], nc.prototype, "state", void 0), f([o({ attribute: !1 })], nc.prototype, "prefix", void 0), f([o({ attribute: !1 })], nc.prototype, "items", void 0), f([o({ type: Boolean })], nc.prototype, "steer", void 0), f([b()], nc.prototype, "all", void 0), f([b()], nc.prototype, "asking", void 0), f([b()], nc.prototype, "dismissed", void 0), h("joe-overview-inbox", nc);
//#endregion
//#region src/pages/overview/quick.ts
function rc(e) {
	return e.config.actions.filter((e) => e.kind === "switch" && !!(e.need?.soc_entity || e.need?.range_entity));
}
function ic(e) {
	let { guest_switch: t, guest_tracker: n } = e.config.context;
	return t && n ? t : void 0;
}
function ac(e) {
	return !!(e && (rc(e).length || ic(e)));
}
var oc = class extends u {
	constructor(...e) {
		super(...e), this.prefix = D;
	}
	static {
		this.styles = [p, g`
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
		if (!e || !t || !n || !ac(n)) return E;
		let r = ic(n), i = r ? t.states[r]?.state === "on" : !1, a = n.config.context.guest_tracker;
		return x`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:lightning-bolt-outline"></ha-icon>${e("overview.quick")}</div>
        ${v(e, "quick")}
      </div>
      ${rc(n).map((r) => {
			let i = P(Je(n.config, r));
			return x`<div class="item">
          <a class="name" href=${T(this.prefix, i)} @click=${w(i)}>
            <ha-icon icon="mdi:car-electric"></ha-icon>${r.name}
          </a>
          <joe-car-charge flush .hass=${t} .t=${e} .state=${n} .action=${r}></joe-car-charge>
        </div>`;
		})}
      ${r ? x`<div class="item guest" data-tipped>
            <button
              type="button"
              class="switch"
              role="switch"
              aria-checked=${String(i)}
              aria-labelledby="quick-guest"
              @click=${() => Zo(t, r)}
            ></button>
            <b id="quick-guest">${e("household.guest")}</b>
            ${v(e, "household_guest")}
            <small>${e(a && t.states[a]?.state === "home" ? "household.guest.home" : "household.guest.away")}</small>
          </div>` : E}
    </section>`;
	}
};
f([o({ attribute: !1 })], oc.prototype, "hass", void 0), f([o({ attribute: !1 })], oc.prototype, "t", void 0), f([o({ attribute: !1 })], oc.prototype, "state", void 0), f([o({ attribute: !1 })], oc.prototype, "prefix", void 0), h("joe-overview-quick", oc);
//#endregion
//#region src/pages/overview.ts
var sc = { tab: "plan" }, cc = {
	tab: "review",
	section: "days"
}, lc = {
	tab: "review",
	section: "result"
}, uc = {
	tab: "household",
	section: "presence"
}, dc = class extends u {
	constructor(...e) {
		super(...e), this.prefix = D, this.checks = [], this.devices = [];
	}
	static {
		this.styles = [p, g`
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
		if (!e || !t) return E;
		let n = ec(e, t, {
			climateFound: this.climateFound,
			discovery: this.discovery,
			checks: this.checks,
			devices: this.devices
		}), r = Us(t), i = r || n.length > 0 || (t.questions?.length ?? 0) > 0, a = n.some((e) => e.id.startsWith("test:")), o = ac(t), s = Ks(t).length > 0, c = this.renderWho(e, t), l = (e) => e ? "" : "wide";
		return x`<div class="grid">
      ${this.renderNow(e, t)}
      ${i ? x`<joe-overview-inbox
            class="wide"
            .t=${e}
            .hass=${this.hass}
            .state=${t}
            .prefix=${this.prefix}
            .items=${n}
            .steer=${r}
          ></joe-overview-inbox>` : E}
      ${this.renderNight(e, t, l(o), !r, a)}
      ${o ? x`<joe-overview-quick .t=${e} .hass=${this.hass} .state=${t} .prefix=${this.prefix}></joe-overview-quick>` : E}
      ${s ? x`<joe-overview-climate
            class="wide"
            .t=${e}
            .hass=${this.hass}
            .state=${t}
            .prefix=${this.prefix}
            .climateFound=${this.climateFound}
          ></joe-overview-climate>` : E}
      ${c ? this.line(uc, "mdi:home-account", e("overview.who"), c, "", "") : E}
      ${this.renderResult(e, t, l(!!c))} ${this.renderWeek(e)}
    </div>`;
	}
	renderNow(t, n) {
		let i = this.hass, a = n.config;
		if (!i) return x``;
		let o = a.measurements, s = o.solar_power.length ? ue(i, o.solar_power) : null, c = de(i, o.grid_power), l = a.batteries.map((t) => ({
			power: de(i, t.power),
			soc: e(i, t.soc_entity)
		})), u = l.filter((e) => e.power != null), d = u.length ? u.reduce((e, t) => e + (t.power ?? 0), 0) : null, f = de(i, o.home_power), p = f == null && c != null;
		p && (f = (c ?? 0) + (s ?? 0) - (d ?? 0));
		let m = l.map((e) => e.soc).filter((e) => e != null), h = (e) => e == null ? "–" : r(t.lang, Math.abs(e), 2), g = (e, t, n, r, i) => x`<div class="flow ${e}">
        <span class="icon"><ha-icon icon=${t}></ha-icon></span>
        <small>${n}</small>
        <b>${h(r)}<span>kW</span></b>
        <em>${i}</em>
      </div>`, _ = (e) => e == null || Math.abs(e) < .05;
		return x`<section class="card wide" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:pulse"></ha-icon>${t("overview.now")}</div>
        ${v(t, "now")}
      </div>
      <div class="now">
        ${g("sun", "mdi:solar-power", t("overview.now.solar"), s, t(s == null ? "overview.now.none" : "overview.now.solar.sub"))}
        ${g("home", "mdi:home-lightning-bolt-outline", t("overview.now.home"), f, t(f == null ? "overview.now.none" : p ? "overview.now.home.calc" : "overview.now.home.sub"))}
        ${g("battery", "mdi:home-battery-outline", _(d) ? t("overview.now.battery") : t(d > 0 ? "overview.now.battery.charge" : "overview.now.battery.discharge"), d, m.length ? m.length === 1 ? t("overview.now.soc", { value: r(t.lang, m[0], 0) }) : t("overview.now.soc_avg", {
			value: r(t.lang, m.reduce((e, t) => e + t, 0) / m.length, 0),
			count: m.length
		}) : a.batteries.length ? t("overview.now.none") : t("overview.now.no_battery"))}
        ${g("net", "mdi:transmission-tower", _(c) ? t("overview.now.grid") : t(c > 0 ? "overview.now.grid.in" : "overview.now.grid.out"), c, c == null ? t("overview.now.none") : _(c) ? t("overview.now.grid.idle") : t(c > 0 ? "overview.now.grid.in.sub" : "overview.now.grid.out.sub"))}
      </div>
      ${this.renderDoing(t, n)}
    </section>`;
	}
	renderDoing(e, t) {
		let n = t.control, r = this.doingLines(e, t);
		return !n && !r.length ? E : x`<div class="doing">
      <div class="eyebrow"><ha-icon icon="mdi:robot-outline"></ha-icon>${e("overview.doing")}</div>
      ${n ? x`<p class="doing-text">${Kr(e, t)}</p>` : E}
      ${r.length ? x`<ul>${r.map((e) => x`<li>${e}</li>`)}</ul>` : E}
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
				what: Ni(e, t, n)
			}));
		}
		for (let t of r.actions) {
			let r = n?.actions?.[t.id];
			r?.on && i.push(e("overview.doing.action", {
				name: t.name,
				time: S(r.end)
			}));
		}
		let a = t.climate;
		if (a?.live) {
			let n = Ks(t).map((e) => ({
				entity: e,
				now: a.rooms[e]
			})).filter((e) => e.now && !e.now.would), r = (e) => this.climateFound?.devices.find((t) => t.entity_id === e)?.area ?? this.devices.find((t) => t.group === "climate" && t.id === e)?.name ?? e;
			for (let t of ["away", "night"]) {
				let a = n.filter((e) => e.now?.why === t);
				a.length === 1 ? i.push(e(`overview.doing.${t}_one`, { name: r(a[0].entity) })) : a.length > 1 && i.push(e(`overview.doing.${t}`, { count: a.length }));
			}
		}
		return i;
	}
	renderNight(e, t, n, i, a) {
		let o = t.plan;
		if (!o) return x`<section class="card ${n}">
        <joe-pose name="relax"></joe-pose>
        <div class="eyebrow"><ha-icon icon="mdi:weather-night"></ha-icon>${e("overview.night")}</div>
        ${d(e("overview.night.empty.title"))} ${y}
        <p class="lead">${e("overview.night.empty.text")}</p>
      </section>`;
		let s = se(e, o), c = ce(e, o, this.hass?.config?.currency), l = o.kind === "charge" || o.kind === "hold" ? x`${r(e.lang, o.target ?? 0, 0)}<small>%</small>` : x`${e(o.kind === "none" ? "plan.big.none" : "plan.big.unavailable")}`;
		return x`<section class="card figure-card ${n}" data-tipped>
      <joe-pose name=${ie(o)}></joe-pose>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:weather-night"></ha-icon>${e("overview.night")}</div>
        ${v(e, "plan_target")}
      </div>
      ${o.window ? x`<p class="when">${be(e, o)}</p>` : E}
      <div class="big">${l}</div>
      ${y}
      <p class="say">${ye(e, o)}</p>
      ${s.length ? x`<div class="lines">${s.map((e) => x`<div>${e}</div>`)}</div>` : E}
      ${c ? x`<p class="cost">${c}</p>` : E}
      ${i && Hs(t) ? x`<joe-steer-tonight
            compact
            .hideUntested=${a}
            .t=${e}
            .hass=${this.hass}
            .state=${t}
            .prefix=${this.prefix}
          ></joe-steer-tonight>` : E}
      <div class="bottom">
        <span class="chip ${o.fixed ? "ok" : ""}">
          ${o.fixed ? e("plan.fixed_at", { time: o.created.slice(11, 16) }) : e("plan.preview_at", { time: o.created.slice(11, 16) })}
        </span>
        <a class="btn btn-secondary stretch" href=${T(this.prefix, sc)} @click=${w(sc)}>${e("overview.night.more")}</a>
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
		return x`<a class="card line ${a}" href=${T(this.prefix, e)} @click=${w(e)}>
      <ha-icon icon=${t}></ha-icon>
      <span class="line-text">
        <span class="eyebrow">${n}</span>
        <b class=${i}>${r}</b>
        ${o ? x`<small>${o}</small>` : E}
      </span>
      <ha-icon class="go" icon="mdi:chevron-right"></ha-icon>
    </a>`;
	}
	renderResult(e, t, n) {
		let r = t.results, i = r?.last, a = e("overview.result");
		if (!r || !i) return this.line(lc, "mdi:calculator-variant-outline", a, e("overview.result.none"), "", n);
		let o = this.hass?.config?.currency, s = i.window?.end.slice(0, 10) ?? i.date, c = s === gn(this.hass?.config?.time_zone) ? e("overview.result.last") : e("overview.result.night", { day: B(e.lang, s, "weekday") }), l = i.saving, u = l > .005 ? "good" : l < -.005 ? "bad" : "", d = u === "good" ? e("overview.result.saved", {
			night: c,
			value: mn(e, l, o)
		}) : u === "bad" ? e("overview.result.cost", {
			night: c,
			value: mn(e, -l, o)
		}) : e("overview.result.same", { night: c }), f = r.since ?? r.first, p = e("overview.result.total", {
			since: f ? B(e.lang, f) : "–",
			value: mn(e, r.saving, o, !0),
			nights: _n(e, r.days)
		}), m = !i.final && i.until ? ` · ${e("overview.result.provisional", { time: i.until.slice(11, 16) })}` : "";
		return this.line(lc, "mdi:calculator-variant-outline", a, d, u, n, `${p}${m}`);
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
		return x`<section class="card wide" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:chart-bar"></ha-icon>${e("overview.week")}</div>
        ${v(e, "week")}
      </div>
      <p class="status">${r}</p>
      ${t.length ? x`<joe-chart
            .labels=${a}
            .ticks=${o}
            .series=${i}
            centerTicks
            unit="kWh"
            height="120"
            lang=${e.lang}
            label=${e("overview.week")}
          ></joe-chart>` : E}
      <div class="bottom">
        ${t.length ? x`<div class="legend">
              ${i.map((e) => x`<span><i style="background:${e.color}"></i>${e.label}</span>`)}
            </div>` : x`<span></span>`}
        <a class="btn btn-secondary stretch" href=${T(this.prefix, cc)} @click=${w(cc)}>${e("overview.week.more")}</a>
      </div>
    </section>`;
	}
};
f([o({ attribute: !1 })], dc.prototype, "t", void 0), f([o({ attribute: !1 })], dc.prototype, "hass", void 0), f([o({ attribute: !1 })], dc.prototype, "state", void 0), f([o({ attribute: !1 })], dc.prototype, "prefix", void 0), f([o({ attribute: !1 })], dc.prototype, "route", void 0), f([o({ attribute: !1 })], dc.prototype, "climateFound", void 0), f([o({ attribute: !1 })], dc.prototype, "discovery", void 0), f([o({ attribute: !1 })], dc.prototype, "checks", void 0), f([o({ attribute: !1 })], dc.prototype, "devices", void 0), f([b()], dc.prototype, "week", void 0), h("joe-overview", dc);
//#endregion
//#region src/pages/plan.ts
var fc = 36e5, pc = {
	tab: "devices",
	section: "grid",
	id: "solar"
}, mc = {
	tab: "devices",
	section: "grid",
	id: "tariff"
}, hc = class extends u {
	constructor(...e) {
		super(...e), this.prefix = D, this.devices = [], this.refreshing = !1;
	}
	static {
		this.styles = [p, g`
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
		if (!e) return E;
		let t = this.state?.plan;
		if (!t || t.kind === "unavailable" || !t.hours) return this.renderEmpty(e, t);
		let n = ce(e, t, this.hass?.config?.currency);
		return x`<div class="wrap">
      <div class="eyebrow"><ha-icon icon="mdi:weather-night"></ha-icon>${e("overview.night")} · ${be(e, t)}</div>
      ${d(e("plan.page.title"))} ${y}
      <div class="top" data-tipped>
        ${this.state?.mode === "simulation" ? x`<span class="pill-sim">${e("mode.simulation")}</span>` : x`<span class="chip ${this.state?.mode === "live" ? "ok" : "learned"}">${e(`mode.${this.state?.mode ?? "off"}`)}</span>`}
        <span class="chip ${t.fixed ? "ok" : ""}">
          ${t.fixed ? e("plan.fixed_at", { time: t.created.slice(11, 16) }) : e("plan.preview_at", { time: t.created.slice(11, 16) })}
        </span>
        <button type="button" class="mini-btn" ?disabled=${this.refreshing || t.fixed} @click=${this.refresh}>
          <ha-icon icon="mdi:refresh"></ha-icon>${e("plan.refresh")}
        </button>
        ${v(e, "plan_refresh")}
      </div>
      <section class="hero" data-tipped>
        <joe-pose name=${ie(t)}></joe-pose>
        <div class="big">
          ${t.kind === "none" ? e("plan.big.none") : x`${r(e.lang, t.target ?? 0, 0)}<small>%</small>`}
        </div>
        <p class="say">${ye(e, t)} ${v(e, "plan_target")}</p>
        ${n ? x`<p class="cost">${n}</p>` : E}
      </section>
      <joe-steer-tonight .t=${e} .hass=${this.hass} .state=${this.state} .prefix=${this.prefix}></joe-steer-tonight>
      ${this.renderTonight(e, t)} ${this.renderEnergy(e, t, t.hours)}
      ${this.renderPrices(e, t, t.hours)} ${this.renderSoc(e, t, t.hours)}
      ${this.renderMath(e, t)}
    </div>`;
	}
	renderTonight(e, t) {
		let n = t.batteries ?? [], r = t.actions ?? [];
		return !n.length && !r.length ? E : x`<section class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.tonight")} ${v(e, "plan_actions")}</div>
      <ul class="tonight">
        ${n.map((n) => this.batteryRow(e, t, n))} ${r.map((n) => this.actionRow(e, t, n))}
      </ul>
    </section>`;
	}
	tonightRow(e, t) {
		return x`<li>
      <ha-icon icon=${t.icon}></ha-icon>
      <div class="what">
        <b>${t.name}</b>
        <span>${t.text}</span>
        ${t.extra ? x`<small>${t.extra}</small>` : E}
      </div>
      <a class="mini-btn go mirror-go" href=${T(this.prefix, t.to)} @click=${w(t.to)}>${e("mirror.change")}</a>
      ${t.more ? x`<div class="more">${t.more}</div>` : E}
    </li>`;
	}
	batteryRow(e, t, n) {
		let i = it(this.devices, "battery", n.id), a = (t) => r(e.lang, t, 0), o = S(t.charge_slots?.[0]?.start ?? t.charge_from), s, c = "";
		return t.kind === "charge" && n.charge_kwh >= .05 ? (s = e(o ? "plan.tonight.charge" : "plan.tonight.charge_any", {
			time: o,
			from: a(n.soc_start),
			target: a(n.target)
		}), c = e("plan.tonight.charge.energy", {
			kwh: r(e.lang, n.charge_kwh, 1),
			kw: r(e.lang, n.power_kw, 1)
		})) : s = t.kind === "hold" ? e("plan.tonight.hold", { target: a(n.target) }) : e("plan.tonight.idle", { soc: a(n.soc) }), n.controllable || (c = [c, e("plan.line.watch_only")].filter(Boolean).join(" · ")), this.tonightRow(e, {
			icon: i?.icon ?? Ue.battery,
			name: n.name,
			text: s,
			extra: c,
			to: i ? P(i) : {
				tab: "devices",
				section: "battery"
			}
		});
	}
	actionRow(e, t, n) {
		let i = this.hass?.config?.currency ?? "EUR", a = (t) => new Intl.NumberFormat(e.lang, {
			style: "currency",
			currency: i
		}).format(t), o = n.target == null ? "" : r(e.lang, n.target, 0), s = n.run ? n.kind === "target" ? e("plan.actions.target", {
			start: S(n.start),
			end: S(n.end),
			target: o
		}) : e("plan.actions.run", {
			start: S(n.start),
			end: S(n.end)
		}) : e.optional(`devices.action.why.${n.reasons[n.reasons.length - 1] ?? "manual_only"}`, {
			kwh: r(e.lang, t.meta?.tomorrow_kwh ?? 0, 0),
			temperature: r(e.lang, n.temperature ?? 0, 0)
		}) ?? "", c = n.run && n.energy_kwh ? e("plan.actions.energy", {
			kwh: r(e.lang, n.energy_kwh, 1),
			cost: a(n.cost ?? 0)
		}) : "", l = this.state?.config, u = l?.actions.find((e) => e.id === n.id), d = l && u ? Je(l, u) : void 0, f = d ? it(this.devices, d.group, d.id) : void 0, p = d?.group ?? (n.need ? "car" : n.kind === "target" ? "hot_water" : "other");
		return this.tonightRow(e, {
			icon: f?.icon ?? Ue[p],
			name: n.name,
			text: s,
			extra: c,
			to: f ? P(f) : d ? {
				tab: "devices",
				section: d.group,
				id: d.id
			} : {
				tab: "devices",
				section: p
			},
			more: n.need ? x`<joe-car-need .hass=${this.hass} .t=${e} .action=${n} .roundTrip=${u?.need?.round_trip ?? !0}></joe-car-need>` : void 0
		});
	}
	renderEmpty(e, t) {
		let n = t ? ye(e, t) : e(this.state?.mode === "off" ? "plan.empty.off" : "plan.empty.waiting");
		return x`<div class="empty">
      <joe-pose name=${t ? ie(t) : "plan"}></joe-pose>
      <div>
        ${d(e("plan.title"))} ${y}
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
					if (t >= r && t < r + fc) return e + (t - r) / fc;
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
			let n = S(t.sun_takes_over);
			a.push({
				at: o,
				label: e("plan.chart.sun", { time: n }),
				short: `↑${n}`
			});
		}
		return x`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.chart.energy")} ${v(e, "chart_plan_energy")}</div>
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
        ${i.map((e) => x`<span><i style="background:${e.color}"></i>${e.label}</span>`)}
      </div>
    </div>`;
	}
	renderPrices(e, t, n) {
		if (!n.some((e) => e.price != null)) return E;
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
		return x`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.chart.prices")} ${v(e, "chart_plan_prices")}</div>
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
      ${t.charge_slots?.length ? x`<p class="slots">${e("plan.slots", { slots: xe(t) })}</p>` : E}
    </div>`;
	}
	renderSoc(e, t, n) {
		let i = this.frame(e, t, n), a = t.rules?.reserve ?? 10, o = [
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
				label: e("plan.chart.reserve", { value: r(e.lang, a, 0) }),
				kind: "line",
				values: n.map(() => a),
				color: "var(--joe-crit)",
				dashed: !0,
				digits: 0
			}
		], s = [], c = i.at(t.window?.end);
		c != null && t.kind !== "none" && s.push({
			at: c,
			label: e("plan.chart.target", { value: r(e.lang, t.target ?? 0, 0) })
		});
		let l = i.at(t.full_at);
		return l != null && s.push({
			at: l,
			label: e("plan.chart.full", { time: S(t.full_at) }),
			short: `${S(t.full_at)}`
		}), x`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.chart.soc")} ${v(e, "chart_plan_soc")}</div>
      <joe-chart
        .labels=${i.labels}
        .ticks=${i.ticks}
        .series=${o}
        .bands=${i.bands}
        .markers=${s}
        max="100"
        height="190"
        unit="%"
        lang=${e.lang}
        label=${e("plan.chart.soc")}
      ></joe-chart>
      <div class="legend">
        ${o.map((e) => x`<span><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color}"></i>${e.label}</span>`)}
      </div>
    </div>`;
	}
	renderMath(e, t) {
		let n = (t, n = 1) => t == null ? "–" : `${r(e.lang, t, n)} kWh`, i = (t) => t == null ? "–" : `${r(e.lang, t * 100, 1)} ct`, a = t.window?.start.slice(0, 10) ?? "", o = t.meta?.solar.sources[a] ?? "none", s = t.meta?.tomorrow, c = s?.solar_factor ?? t.meta?.solar_factor ?? 1, l = t.meta?.consumption, u = this.state?.config.persons ?? [], d = [
			{
				label: e("plan.math.battery_now"),
				value: `${r(e.lang, t.soc_now ?? 0, 0)} %`,
				hint: e("plan.math.battery_now.sub", {
					stored: r(e.lang, (t.soc_now ?? 0) / 100 * (t.capacity_kwh ?? 0), 1),
					capacity: r(e.lang, t.capacity_kwh ?? 0, 1)
				}),
				to: {
					tab: "devices",
					section: "battery"
				}
			},
			{
				label: e("plan.math.battery_start"),
				value: `${r(e.lang, t.soc_start ?? 0, 0)} %`
			},
			{
				label: e("plan.math.solar"),
				value: n(t.solar_kwh),
				hint: `${e(`plan.math.solar.${o}`)}${c === 1 ? "" : ` · ${e(s?.solar_source === "combined" ? "plan.math.solar.combined" : s?.solar_source === "weather" && s.weather ? "plan.math.solar.weather" : "plan.math.solar.factor", {
					value: r(e.lang, c, 2),
					weather: s?.weather ? e(`learn.weather.${s.weather}`) : ""
				})}`}`,
				to: pc
			},
			{
				label: e("plan.math.home"),
				value: n(t.home_kwh),
				hint: l?.source === "history" ? e("plan.math.home.history", {
					days: l.days,
					kind: e(t.meta?.workday === !1 ? "plan.math.day_off" : "plan.math.workday")
				}) : e("plan.math.home.default")
			}
		];
		s && (s.temp != null || s.weather) && d.push({
			label: e("plan.math.weather"),
			value: [s.temp == null ? "" : `${r(e.lang, s.temp, 0)} °C`, s.weather ? e(`learn.weather.${s.weather}`) : ""].filter(Boolean).join(" · "),
			to: {
				tab: "household",
				section: "travel"
			}
		}), s && d.push({
			label: e("plan.math.day"),
			value: [e(s.workday ? "plan.math.day.workday" : "plan.math.day.off"), ...Object.entries(s.labels).map(([t, n]) => e("plan.math.tomorrow.person", {
				name: u.find((e) => e.id === t)?.name ?? t,
				label: e(`label.${n}`)
			}))].join(" · "),
			hint: s.expected_kwh == null ? e("plan.math.tomorrow.usual") : e("plan.math.tomorrow.scaled", {
				expected: r(e.lang, s.expected_kwh, 1),
				usual: r(e.lang, s.profile_kwh, 1)
			}),
			to: {
				tab: "household",
				section: "days"
			}
		}), d.push({
			label: e("plan.math.target"),
			value: `${r(e.lang, t.target ?? 0, 0)} %`,
			hint: e("plan.math.target.sub", {
				optimum: r(e.lang, t.optimum ?? 0, 0),
				buffer: r(e.lang, (t.rules?.buffer ?? 0) * 100, 0)
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
			to: mc
		}, {
			label: e("plan.math.rules"),
			value: e("plan.math.rules.value", {
				reserve: r(e.lang, t.rules?.reserve ?? 0, 0),
				max: r(e.lang, t.rules?.max_target ?? 100, 0),
				mode: e.optional(`rule.discharge.${t.rules?.discharge_mode}`) ?? ""
			}),
			to: {
				tab: "settings",
				section: "rules"
			}
		});
		let f = [...new Set(t.notes ?? [])].filter((t) => e.optional(`plan.note.${t}`));
		return x`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.math")} ${v(e, "plan_math")}</div>
      <div class="mirrors">
        ${d.map((t) => t.to ? K(e, this.prefix, {
			label: t.label,
			value: t.value,
			hint: t.hint,
			to: t.to
		}) : x`<div class="mirror">
                <div class="mirror-text">
                  <span class="mirror-label">${t.label}</span><span class="mirror-sep" aria-hidden="true">·</span
                  ><span class="mirror-value">${t.value}</span>
                  ${t.hint ? x`<small class="mirror-hint">${t.hint}</small>` : E}
                </div>
              </div>`)}
      </div>
      ${f.map((n) => this.renderNote(e, t, n))}
    </div>`;
	}
	renderNote(e, t, n) {
		let r = this.noteJumps(e, t, n);
		return x`<div class="note">
      <ha-icon icon="mdi:information-outline"></ha-icon>
      <div>
        <span>${e.optional(`plan.note.${n}`)}</span>
        ${r.length ? x`<div class="note-actions">
              ${r.map((e) => x`<a class="mini-btn go mirror-go" href=${T(this.prefix, e.to)} @click=${w(e.to)}>${e.label}</a>`)}
            </div>` : E}
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
				to: pc,
				label: r
			}];
			case "prices_partly": return [{
				to: mc,
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
			let t = it(this.devices, "battery", e.id);
			return t ? P(t) : {
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
f([o({ attribute: !1 })], hc.prototype, "hass", void 0), f([o({ attribute: !1 })], hc.prototype, "t", void 0), f([o({ attribute: !1 })], hc.prototype, "state", void 0), f([o({ attribute: !1 })], hc.prototype, "route", void 0), f([o({ attribute: !1 })], hc.prototype, "prefix", void 0), f([o({ attribute: !1 })], hc.prototype, "devices", void 0), f([b()], hc.prototype, "refreshing", void 0), h("joe-plan-page", hc);
//#endregion
//#region src/pages/settings/base.ts
var Q = class extends u {
	constructor(...e) {
		super(...e), this.prefix = D, this.checks = [];
	}
	willUpdate(e) {
		if (!e.has("route") && !e.has("anchor")) return;
		let t = this.route ? oe(this.route) : "";
		t !== this.revealed && (this.revealed = t, this.pending = this.anchor || void 0);
	}
	async updated() {
		let e = this.pending;
		if (!e) return;
		let t = [...this.renderRoot.querySelectorAll("joe-choice")];
		await Promise.all(t.map((e) => e.updateComplete));
		for (let e = 0; e < 10 && (e === 0 || !getComputedStyle(this).getPropertyValue("--joe-head-h")); e++) await new Promise((e) => requestAnimationFrame(e));
		this.pending === e && fe(this.renderRoot, e) && (this.pending = void 0);
	}
};
f([o({ attribute: !1 })], Q.prototype, "hass", void 0), f([o({ attribute: !1 })], Q.prototype, "t", void 0), f([o({ attribute: !1 })], Q.prototype, "state", void 0), f([o({ attribute: !1 })], Q.prototype, "route", void 0), f([o({ attribute: !1 })], Q.prototype, "prefix", void 0), f([o({ attribute: !1 })], Q.prototype, "info", void 0), f([o({ attribute: !1 })], Q.prototype, "discovery", void 0), f([o({ attribute: !1 })], Q.prototype, "checks", void 0), f([o({ attribute: !1 })], Q.prototype, "anchor", void 0);
//#endregion
//#region src/pages/settings/styles.ts
var gc = g`
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
`, _c = "/config/energy", vc = [
	"control",
	"button",
	"value",
	"calendar",
	"other"
], yc = {
	select: "control",
	switch: "control",
	button: "button",
	sensor: "value",
	binary_sensor: "value",
	calendar: "calendar"
}, bc = [
	"control",
	"value",
	"other"
], xc = [{
	id: "night",
	type: "energy-joe-night-card",
	icon: "mdi:weather-night"
}, {
	id: "car",
	type: "energy-joe-car-card",
	icon: "mdi:car-electric-outline"
}];
function Sc(e) {
	return x`${e.split(/(?<=[._])/).map((e, t) => x`${t ? x`<wbr />` : E}${e}`)}`;
}
var Cc = class extends Q {
	static {
		this.styles = [
			p,
			gc,
			g`
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
		return !e || !this.state ? E : x`<div class="list">
      ${this.renderVersions(e)} ${this.renderEntities(e, t)} ${this.renderCards(e)}
    </div>`;
	}
	renderVersions(e) {
		let t = this.info?.energy, n = !!(t?.configured && t.sources);
		return x`<section class="group" data-anchor="versions">
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
          href=${_c}
          @click=${(e) => {
			e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0 || (e.preventDefault(), _(_c));
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
			let n = yc[e.entity_id.split(".", 1)[0]] ?? "other", i = t ? O(t, e.entity_id) : e.entity_id, a = i.replace(/^energy joe\s+/i, "") || i;
			r.set(n, [...r.get(n) ?? [], {
				id: e.entity_id,
				name: a
			}]);
		}
		return x`<section class="group" data-anchor="entities">
      <div class="group-title" data-tipped><h2>${e("settings.about.entities")}</h2>${v(e, "about_entities")}</div>
      <p class="intro">${e("settings.about.entities.intro")}</p>
      ${n.length ? vc.filter((e) => r.has(e)).map((n) => x`<div class="group-label">${e(`settings.about.group.${n}`)}</div>
              ${r.get(n).sort((t, n) => t.name.localeCompare(n.name, e.lang)).map((r) => x`<div class="ent">
                    <div class="ent-text"><b>${r.name}</b><code>${Sc(r.id)}</code></div>
                    ${t && bc.includes(n) ? x`<span class="ent-state">${m(t, r.id, e.lang)}</span>` : E}
                    ${H(e, {
			entityId: r.id,
			name: r.name
		})}
                  </div>`)}`) : x`<p class="intro">${e("settings.about.entities.none")}</p>`}
    </section>`;
	}
	renderCards(e) {
		return x`<section class="group" data-anchor="cards">
      <h2>${e("settings.about.cards")}</h2>
      <p class="intro">${e("settings.about.cards.intro")}</p>
      ${xc.map((t) => x`<div class="row">
          <div>
            <b class="card-name"><ha-icon icon=${t.icon}></ha-icon>${e(`settings.about.cards.${t.id}`)}</b>
            <small>${e(`settings.about.cards.${t.id}.hint`)}</small>
            <code class="card-type">type: custom:${t.type}</code>
          </div>
        </div>`)}
    </section>`;
	}
};
h("joe-settings-about", Cc);
//#endregion
//#region src/pages/settings/maintenance.ts
var wc = "/config/integrations/integration/energy_joe", Tc = class extends Q {
	static {
		this.styles = [
			p,
			gc,
			g`
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
		return !e || !t ? E : x`<div class="list">
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
		return c?.state === "running" ? s.push(e("history.reading")) : c?.state === "unavailable" ? s.push(e("settings.observe.no_recorder")) : c?.state === "failed" && s.push(e("settings.observe.failed")), x`<section class="group" data-anchor="observe">
      <h2>${e("settings.observe")}</h2>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${e("settings.observe.recording")}</b>${v(e, "observe")}</div>
          <small>${o}</small>
        </div>
        <span class="chip ${r ? "ok" : ""}">
          ${e(r ? "status.running" : t.mode === "off" ? "status.paused" : "status.waiting")}
        </span>
      </div>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${e("settings.observe.history")}</b>${v(e, "rebuild")}</div>
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
		return x`<section class="group" data-anchor="backup">
      <h2>${e("settings.backup")}</h2>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${e("settings.backup.export")}</b>${v(e, "backup_export")}</div>
          <small>${e("settings.backup.export.hint")}</small>
        </div>
        <button type="button" class="btn btn-secondary" @click=${() => void this.exportSettings()}>${e("settings.backup.download")}</button>
      </div>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${e("settings.backup.import")}</b>${v(e, "backup_import")}</div>
          <small>${e("settings.backup.import.hint")}</small>
        </div>
        <label class="btn btn-secondary file">
          ${e("settings.backup.choose")}
          <input type="file" accept="application/json,.json" @change=${(e) => void this.readBackup(e)} />
        </label>
      </div>
      ${this.backup ? x`<div class="note warn" data-tipped>
            <ha-icon icon="mdi:alert-outline"></ha-icon>
            <span>
              ${e("settings.backup.confirm", {
			file: this.backup.name,
			when: this.backup.when
		})} ${v(e, "backup_import")}
              <span class="confirm">
                <button type="button" class="btn btn-danger" @click=${() => void this.importSettings()}>${e("settings.backup.replace")}</button>
                <button type="button" class="btn btn-ghost" @click=${() => this.backup = void 0}>${e("common.cancel")}</button>
              </span>
            </span>
          </div>` : E}
      ${this.backupNote ? x`<div class="note ${this.backupNote.ok ? "ok" : "warn"}">
            <ha-icon icon=${this.backupNote.ok ? "mdi:check" : "mdi:alert-outline"}></ha-icon><span>${this.backupNote.text}</span>
          </div>` : E}
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
		return x`<section class="group" data-anchor="setup">
      <h2>${e("settings.setup")}</h2>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${e("settings.setup.again")}</b>${v(e, "restart")}</div>
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
          <div class="name"><b>${e("settings.maintenance.diagnostics")}</b>${v(e, "diagnostics")}</div>
          <small>${e("settings.maintenance.diagnostics.hint")}</small>
        </div>
        <a
          class="mini-btn"
          data-notip
          href=${wc}
          @click=${(e) => {
			e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0 || (e.preventDefault(), _(wc));
		}}
          ><ha-icon icon="mdi:open-in-new"></ha-icon>${e("settings.maintenance.diagnostics.open")}</a
        >
      </div>
    </section>`;
	}
};
f([b()], Tc.prototype, "backup", void 0), f([b()], Tc.prototype, "backupNote", void 0), h("joe-settings-maintenance", Tc);
//#endregion
//#region src/pages/settings/notify.ts
var Ec = class extends Q {
	constructor(...e) {
		super(...e), this.loading = !1;
	}
	static {
		this.styles = [p, gc];
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
		if (!e || !t) return E;
		let n = t.config, r = n.notify, i = this.notifyTargets ?? Object.keys(this.hass?.services?.notify ?? {}).filter((e) => ![
			"persistent_notification",
			"send_message",
			"notify"
		].includes(e)).sort().map((e) => ({
			service: e,
			name: e.replace(/_/g, " ")
		})), a = r.service?.replace(/^notify\./, ""), o = !!a && this.notifyTargets !== void 0 && !i.some((e) => e.service === a);
		return x`<div class="list">
      <section class="group" data-anchor="notify">
        <h2>${e("settings.notify")}</h2>
        <p class="intro">${e("settings.notify.intro")}</p>
        <div class="row" data-tipped data-anchor="service">
          <div>
            <div class="name"><label for="notify-service"><b>${e("settings.notify.service")}</b></label>${v(e, "notify_service")}</div>
            <small>${e("settings.notify.service.hint")}</small>
          </div>
          <select
            id="notify-service"
            class="input"
            @change=${(e) => {
			let t = e.target.value;
			M(this, { notify: { service: t ? `notify.${t}` : null } });
		}}
          >
            <option value="" ?selected=${!r.service}>${e("settings.notify.none")}</option>
            ${i.map((e) => x`<option value=${e.service} ?selected=${a === e.service}>${e.name}</option>`)}
            ${o ? x`<option value=${a} selected>${e("settings.notify.gone", { name: a ?? "" })}</option>` : E}
          </select>
        </div>
        ${this.toggle(e, n, "ask")} ${this.toggle(e, n, "problems")} ${this.toggle(e, n, "morning")}
        ${this.askTime(e, n)}
      </section>
    </div>`;
	}
	toggle(e, t, n) {
		let r = t.notify;
		return x`<div class="row" data-tipped>
      <div>
        <div class="name"><b id="notify-${n}">${e(`settings.notify.${n}`)}</b>${v(e, `notify_${n}`)}</div>
        <small>${e(`settings.notify.${n}.hint`)}</small>
      </div>
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${String(r[n])}
        aria-labelledby="notify-${n}"
        ?disabled=${!r.service}
        @click=${() => M(this, { notify: { [n]: !r[n] } })}
      ></button>
    </div>`;
	}
	askTime(e, t) {
		return x`<div class="row" data-tipped data-anchor="ask_time">
      <div>
        <div class="name"><label for="ask-time"><b>${e("settings.ask_time")}</b></label>${v(e, "ask_time")}</div>
        <small>${e("settings.ask_time.hint")}</small>
      </div>
      <input
        id="ask-time"
        class="input time"
        type="time"
        .value=${t.rules.ask_time}
        @change=${(e) => {
			let t = e.target.value;
			/^\d{2}:\d{2}$/.test(t) && M(this, { rules: { ask_time: t } });
		}}
      />
    </div>`;
	}
};
f([b()], Ec.prototype, "notifyTargets", void 0), h("joe-settings-notify", Ec);
//#endregion
//#region src/pages/settings/operation.ts
var Dc = [
	"simulation",
	"advisory",
	"live",
	"off"
], Oc = class extends Q {
	static {
		this.styles = [
			p,
			gc,
			g`
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
		return !e || !t ? E : x`<div class="list">
      <section class="group" data-anchor="mode">
        <h2>${e("settings.operation")}</h2>
        <div class="row" data-tipped>
          <div>
            <div class="name"><b>${e("settings.mode")}</b>${v(e, "mode")}</div>
            <small>${e("settings.mode.now", { mode: e(`mode.${t.mode}`) })}</small>
          </div>
          <div class="control">
            <button type="button" class="btn btn-secondary" @click=${this.openDialog}>${e("settings.mode.open")}</button>
            ${v(e, "mode_open")}
          </div>
        </div>
        <ul class="modes">
          ${Dc.map((n) => x`<li class=${n === t.mode ? "on" : ""}>
              <span class="mode-name"
                >${e(`mode.${n}`)}
                ${n === t.mode ? x`<span class="chip ok">${e("mode.current")}</span>` : E}</span
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
	gridFriendlyRows(e, n) {
		let r = n.config, i = r.rules;
		return x`<div class="row" data-tipped data-anchor="grid_friendly">
        <div>
          <div class="name"><b id="grid-friendly">${e("rule.grid_friendly")}</b>${v(e, "r_grid_friendly")}</div>
          <small>${e("rule.grid_friendly.hint")}</small>
        </div>
        <div class="control">
          ${t(e, k(r, "rules.grid_friendly"))}
          <button
            type="button"
            class="switch"
            role="switch"
            aria-checked=${String(i.grid_friendly)}
            aria-labelledby="grid-friendly"
            @click=${() => M(this, { rules: { grid_friendly: !i.grid_friendly } })}
          ></button>
        </div>
      </div>
      ${i.grid_friendly ? x`<div class="row" data-tipped>
            <div>
              <div class="name"><b>${e("rule.grid_first")}</b>${v(e, "r_grid_first")}</div>
              <small>${e(i.grid_first ? "rule.grid_first.grid.hint" : "rule.grid_first.saving.hint")}</small>
            </div>
            <div class="seg" role="group" aria-label=${e("rule.grid_first")}>
              ${[!1, !0].map((t) => x`<button
                    type="button"
                    aria-pressed=${String(i.grid_first === t)}
                    @click=${() => M(this, { rules: { grid_first: t } })}
                  >
                    ${e(t ? "rule.grid_first.grid" : "rule.grid_first.saving")}
                  </button>`)}
            </div>
          </div>` : E}`;
	}
};
h("joe-settings-operation", Oc);
//#endregion
//#region src/pages/settings/rules.ts
var kc = [
	"battery",
	"grid",
	"plan"
], Ac = class extends Q {
	static {
		this.styles = [
			p,
			gc,
			mi
		];
	}
	render() {
		let { t: e, state: t } = this;
		if (!e || !t) return E;
		let n = t.config;
		return x`<div class="list">
      <p class="intro">${e("settings.rules.intro")}</p>
      ${kc.map((t) => x`<section class="group" data-anchor=${`group-${t}`}>
          <h2>${e(`settings.rules.group.${t}`)}</h2>
          ${ti[t].map((t) => si(e, this, n, this.info, t))}
        </section>`)}
    </div>`;
	}
};
h("joe-settings-rules", Ac);
//#endregion
//#region src/pages/settings/signpost.ts
var jc = [
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
], Mc = 8;
function Nc(e) {
	return e.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ß/g, "ss").replace(/([aou])e/g, "$1").replace(/[-\u2010\u2011]/g, "");
}
var Pc = class extends u {
	constructor(...e) {
		super(...e), this.prefix = D, this.query = "";
	}
	static {
		this.styles = [p, g`
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
		if (!e) return E;
		let t = this.search(e), n = this.query.trim() !== "";
		return x`<section class="signpost" data-tipped role="search">
      <div class="sp-head">
        <label for="signpost-q"><ha-icon icon="mdi:sign-direction"></ha-icon>${e("signpost.title")}</label>${v(e, "signpost")}
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
      ${n && t.length ? x`<ul class="hits">
            ${t.slice(0, Mc).map((e) => x`<li>${this.hitLink(e)}</li>`)}
          </ul>` : E}
      <p class="sp-status" aria-live="polite" ?hidden=${!n || t.length > 0 && t.length <= Mc}>
        ${n ? t.length ? e("signpost.more", { count: t.length - Mc }) : e("signpost.none") : ""}
      </p>
    </section>`;
	}
	hitLink(e) {
		let t = e.entry.to;
		return x`<a
      class="hit"
      href=${T(this.prefix, t)}
      @click=${(e) => {
			w(t)(e), e.defaultPrevented && (this.query = "");
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
		this.query = "", C(this, e);
	}
	search(e) {
		let t = Nc(this.query).split(/\s+/).filter(Boolean);
		if (!t.length) return [];
		let n = [];
		return jc.forEach((r, i) => {
			let a = e("title" in r ? r.title : `signpost.${r.id}`), o = e(`signpost.${r.id}.terms`).split(",").map((e) => e.trim()).filter(Boolean), s = Fc(e, r.to, a), c = Nc([
				a,
				...o,
				s
			].join(" | "));
			if (!t.every((e) => c.includes(e))) return;
			let l = t.join(" "), u = Nc(a), d = o.find((e) => Nc(e) === l), f = u === l ? 0 : d ? 1 : u.startsWith(l) ? 2 : u.includes(l) ? 3 : 6, p = f === 1 ? d : void 0;
			if (f > 3) {
				let e = o.find((e) => Nc(e).startsWith(l)) ?? o.find((e) => Nc(e).includes(l));
				e && (p = e, f = Nc(e).startsWith(l) ? 4 : 5);
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
f([o({ attribute: !1 })], Pc.prototype, "t", void 0), f([o({ attribute: !1 })], Pc.prototype, "state", void 0), f([o({ attribute: !1 })], Pc.prototype, "route", void 0), f([o({ attribute: !1 })], Pc.prototype, "prefix", void 0), f([b()], Pc.prototype, "query", void 0);
function Fc(e, t, n) {
	let r = [e(`tab.${t.tab}`)];
	if (t.section) {
		let n = e.optional(`nav.${t.tab}.${t.section}`);
		n && r.push(n);
	}
	return t.id && Nc(r[r.length - 1]) !== Nc(n) && r.push(n), r.join(" › ");
}
h("joe-signpost", Pc);
//#endregion
//#region src/pages/settings/index.ts
var Ic = {
	operation: "mdi:tune-variant",
	rules: "mdi:format-list-checks",
	notify: "mdi:bell-outline",
	maintenance: "mdi:wrench-outline",
	about: "mdi:information-outline"
}, Lc = class extends u {
	constructor(...e) {
		super(...e), this.prefix = D, this.checks = [];
	}
	static {
		this.styles = [p, g`
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
		if (!e || !this.state) return E;
		let t = this.route?.section ?? pe.settings, n = le.settings.map((t) => ({
			id: t,
			label: e(`nav.settings.${t}`),
			icon: Ic[t]
		}));
		return x`${ur(e, this.prefix, "settings", n, t)}
      <div class="body">${this.renderSignpost()}${this.renderSection(t)}</div>`;
	}
	renderSignpost() {
		return x`<joe-signpost .t=${this.t} .state=${this.state} .prefix=${this.prefix} .route=${this.route}></joe-signpost>`;
	}
	renderSection(e) {
		let { t, hass: n, state: r, prefix: i, route: a, info: o, discovery: s, checks: c } = this;
		switch (e) {
			case "operation": return x`<joe-settings-operation
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
			case "rules": return x`<joe-settings-rules
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
			case "notify": return x`<joe-settings-notify
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
			case "maintenance": return x`<joe-settings-maintenance
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
			case "about": return x`<joe-settings-about
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
f([o({ attribute: !1 })], Lc.prototype, "hass", void 0), f([o({ attribute: !1 })], Lc.prototype, "t", void 0), f([o({ attribute: !1 })], Lc.prototype, "state", void 0), f([o({ attribute: !1 })], Lc.prototype, "route", void 0), f([o({ attribute: !1 })], Lc.prototype, "prefix", void 0), f([o({ attribute: !1 })], Lc.prototype, "info", void 0), f([o({ attribute: !1 })], Lc.prototype, "discovery", void 0), f([o({ attribute: !1 })], Lc.prototype, "checks", void 0), h("joe-settings-page", Lc);
//#endregion
//#region src/energy-joe-panel.ts
var Rc = [
	"simulation",
	"advisory",
	"live",
	"off"
], zc = {
	simulation: "mdi:pause",
	advisory: "mdi:comment-question-outline",
	live: "mdi:play",
	off: "mdi:power"
}, Bc = Rc, Vc = {
	overview: "mdi:view-dashboard-outline",
	plan: "mdi:weather-night",
	review: "mdi:history",
	devices: "mdi:power-plug-outline",
	household: "mdi:account-group-outline",
	settings: "mdi:cog-outline"
}, Hc = [
	"overview",
	"devices",
	"household",
	"settings"
], Uc = ["action", "battery"], Wc = [
	"devices",
	"household",
	"overview",
	"review"
], $ = class extends u {
	constructor() {
		super(), this.narrow = !1, this.failed = !1, this.modeDialog = !1, this.notice = "", this.discovering = !1, this.discoveryFailed = !1, this.checks = [], this.infoRequested = !1, this.adopted = !1, this.parsed = he(""), this.climateRequested = !1, this.jumped = !1, this.addEventListener("joe-config", (e) => this.onConfig(e)), this.addEventListener("joe-pick", (e) => {
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
		return s(this.hass?.language);
	}
	get base() {
		return this.route?.prefix ?? "/energy-joe";
	}
	get current() {
		return this.parsed.route;
	}
	connectedCallback() {
		super.connectedCallback(), Ln(), this.subscribe();
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
			this.parsed = he(this.route?.path ?? "");
			let { route: n, redirect: r } = this.parsed;
			r !== void 0 && this.go(r, { replace: !0 }), this.remember(n), n.tab !== t && this.joe?.onboarding.completed && (this.discoveryFailed = !1, this.climateFound || (this.climateRequested = !1));
		}
	}
	updated() {
		this.observeHead();
		let e = this.joe;
		e?.onboarding.completed && !this.climateRequested && Wc.includes(this.current.tab) && this.loadClimate(), !(!e || this.discovering || this.discoveryFailed) && (!e.onboarding.completed && e.onboarding.step === "scan" && !this.adopted ? this.scan() : !this.discovery && (e.onboarding.completed ? Hc.includes(this.current.tab) || Uc.includes(this.editor?.editor ?? "") : e.onboarding.step !== "welcome") && this.look());
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
	render() {
		let e = this.t;
		if (this.failed) return x`<main><joe-empty-state pose="puzzled" heading=${e("error.title")} text=${e("error.text")}></joe-empty-state></main>`;
		if (!this.joe) return x`<div class="loading">${e("loading")}</div>`;
		let t = !this.joe.onboarding.completed;
		return x`
      <header>
        ${this.joe.mode === "simulation" ? x`<div class="simband" aria-hidden="true"></div>` : E}
        <div class="bar">
          ${this.narrow ? x`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : E}
          <div class="brand">
            <img class="light" src=${we("joe-head.webp")} alt="" width="36" height="36" />
            <img class="dark" src=${we("joe-head-dark.webp")} alt="" width="36" height="36" />
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
      ${this.notice ? x`<div class="notice" role="alert">${this.notice}</div>` : E}
      <main
        @joe-onboarding=${this.onOnboarding}
        @joe-rediscover=${() => this.scan()}
      >
        ${t ? x`<joe-onboarding
              .step=${this.joe.onboarding.step}
              .t=${e}
              .info=${this.info}
              .hass=${this.hass}
              .config=${this.joe.config}
              .discovery=${this.discovery}
              .checks=${this.checks}
              ?discovering=${this.discovering}
              ?discoveryFailed=${this.discoveryFailed}
            ></joe-onboarding>` : this.renderPage(e)}
      </main>
      ${this.modeDialog ? this.renderModeDialog(e) : E} ${this.editor ? this.renderEditor(e) : E}
      ${this.picker ? this.renderPicker(e) : E}
    `;
	}
	renderTabs(e) {
		let t = this.current.tab;
		return x`<nav class="tabs" aria-label=${e("nav.label")} lang=${e.lang}>
      ${ae.map((n, r) => {
			let i = this.tabPath(n), a = r > 0 && me.includes(ae[r - 1]) && !me.includes(n);
			return x`${a ? x`<span class="gap" aria-hidden="true"></span>` : E}<a
            href=${T(this.base, i)}
            class=${n === t ? "on" : ""}
            aria-current=${n === t ? "page" : "false"}
            @click=${w(i)}
            ><ha-icon icon=${Vc[n]}></ha-icon><span class="label">${e(`tab.${n}`)}</span></a
          >`;
		})}
    </nav>`;
	}
	tabPath(e) {
		let t = this.current;
		if (e === t.tab) return oe({
			tab: e,
			section: t.section
		});
		let n = null;
		try {
			n = sessionStorage.getItem(`joe.last.${e}`);
		} catch {}
		let r = e === "overview" ? "/" : `/${e}`;
		return n && (n === r || n.startsWith(`${r}/`)) ? n : oe({ tab: e });
	}
	remember(e) {
		try {
			sessionStorage.setItem(`joe.last.${e.tab}`, oe({
				tab: e.tab,
				section: e.section,
				id: e.id
			}));
		} catch {}
	}
	renderSteps(e) {
		let t = bn.indexOf(this.joe?.onboarding.step ?? "welcome");
		return x`<ol class="steps" aria-label=${e("steps.label")}>
      ${bn.map((n, r) => x`<li class=${r < t ? "done" : r === t ? "on" : ""} aria-current=${r === t ? "step" : "false"}>
            ${r + 1} ${e(`step.${n}`)}
          </li>`)}
    </ol>`;
	}
	renderPage(e) {
		let t = this.current, n = this.base;
		switch (t.tab) {
			case "overview": return x`<joe-overview
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
			case "plan": return x`<joe-plan-page
          .t=${e}
          .hass=${this.hass}
          .state=${this.joe}
          .prefix=${n}
          .route=${t}
          .devices=${this.devices(e)}
        ></joe-plan-page>`;
			case "review": return x`<joe-lookback-page
          .t=${e}
          .hass=${this.hass}
          .state=${this.joe}
          .prefix=${n}
          .route=${t}
          .climateFound=${this.climateFound}
        ></joe-lookback-page>`;
			case "devices": return x`<joe-devices-page
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
			case "household": return x`<joe-household-page
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
			case "settings": return x`<joe-settings-page
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
			let r = nt(e, t, this.hass, {
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
		return x`<div class="scrim" @click=${this.closeDialog}>
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
          <div id="mode-title">${d(e("mode.dialog.title"), "h2", v(e, "mode"))}</div>
          ${y}
          ${this.renderReadiness(e)}
          <div class="modes" role="group" aria-labelledby="mode-title">
            ${Rc.map((n) => {
			let r = Bc.includes(n);
			return x`<button
                type="button"
                class="mode ${n}"
                aria-pressed=${String(n === t)}
                ?disabled=${!r}
                @click=${() => this.chooseMode(n)}
              >
                <span class="knob"><ha-icon icon=${zc[n]}></ha-icon></span>
                <span class="label">
                  <b>${e(`mode.${n}`)}</b>
                  <small>${e(`mode.${n}.desc`)}</small>
                </span>
                ${n === t ? x`<span class="chip ok"><ha-icon icon="mdi:check"></ha-icon>${e("mode.current")}</span>` : r ? E : x`<span class="chip soon">${e("mode.soon")}</span>`}
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
		if (!r.length) return E;
		let i = r.filter((e) => n[e.id] !== "ready");
		if (!i.length) return E;
		let a = i.length === r.length ? e("mode.none_tested") : e("mode.untested", { names: i.map((e) => e.name).join(", ") }), o = {
			tab: "devices",
			section: "battery"
		}, s = w(o);
		return x`<div class="note warn readiness">
      <ha-icon icon="mdi:alert-outline"></ha-icon>
      <div>
        <span>${a}</span>
        <a
          class="mini-btn go"
          href=${T(this.base, o)}
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
		}, i = x``, a = "", o = !1;
		switch (t?.editor) {
			case "battery":
				a = e("edit.battery.label"), o = !0, i = x`<joe-battery-editor
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
				a = e("action.label"), i = x`<joe-action-editor
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
			case "consumers": a = e("edit.consumers.label"), o = !0, i = x`<div class="sheet-title">${d(e("edit.consumers.title"))}</div>
          <joe-consumer-list .hass=${this.hass} .t=${e} .config=${n}></joe-consumer-list>
          <div class="actions">
            <button type="button" class="btn btn-secondary" data-notip @click=${r}>${e("mode.close")}</button>
          </div>`;
		}
		return x`<joe-sheet
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
		return x`<joe-sheet
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
		e.detail.step === "welcome" && (this.adopted = !1, this.discoveryFailed = !1);
		try {
			await this.hass?.callWS({
				type: "energy_joe/onboarding",
				...e.detail
			}), e.detail.completed && this.go("/");
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
		let n = he(e).redirect ?? oe(e), r = T(this.base, n);
		if (!t.replace && location.pathname === r) {
			this.scrollTop = 0;
			return;
		}
		t.replace || history.replaceState({
			...history.state ?? {},
			joeScroll: this.scrollTop
		}, ""), this.jumped = !0, history[t.replace ? "replaceState" : "pushState"](t.sheet ? { joeSheet: !0 } : null, "", r), window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: !!t.replace } }));
		let i = he(n).route, a = i.tab === "devices" && i.section !== "grid" && i.section !== "add" && !i.sub;
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
			_e,
			p,
			g`
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
f([o({ attribute: !1 })], $.prototype, "hass", void 0), f([o({
	type: Boolean,
	reflect: !0
})], $.prototype, "narrow", void 0), f([o({ attribute: !1 })], $.prototype, "route", void 0), f([b()], $.prototype, "joe", void 0), f([b()], $.prototype, "info", void 0), f([b()], $.prototype, "failed", void 0), f([b()], $.prototype, "modeDialog", void 0), f([b()], $.prototype, "notice", void 0), f([b()], $.prototype, "discovery", void 0), f([b()], $.prototype, "discovering", void 0), f([b()], $.prototype, "discoveryFailed", void 0), f([b()], $.prototype, "checks", void 0), f([b()], $.prototype, "picker", void 0), f([b()], $.prototype, "editor", void 0), f([b()], $.prototype, "climateFound", void 0), h("energy-joe-panel", $);
//#endregion
export { $ as EnergyJoePanel };
