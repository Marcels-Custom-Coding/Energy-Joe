import { A as e, B as t, C as n, D as r, E as i, F as a, G as o, H as s, I as c, J as l, K as u, L as d, M as f, N as p, O as m, P as h, R as g, S as _, T as v, U as y, V as ee, W as b, X as x, Y as te, Z as S, _ as ne, a as re, b as ie, c as ae, d as C, f as oe, g as se, h as ce, i as le, j as w, k as ue, l as T, m as de, n as fe, o as pe, p as me, q as he, r as E, s as ge, t as _e, u as D, v as ve, w as ye, x as O, y as k, z as A } from "./tokens-S1IR84Db.js";
//#region src/assets.ts
var be = import.meta.url.replace(/[^/]*$/, ""), xe = (e) => `${be}${e}`, Se = /* @__PURE__ */ new Set(["welcome"]), Ce = /* @__PURE__ */ new Set([
	"night-charge",
	"sleep",
	"learn"
]), we = "thumbs", Te = class extends o {
	constructor(...e) {
		super(...e), this.name = "", this.alt = "";
	}
	static {
		this.styles = S`
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
		let e = Ce.has(this.name) ? "scene" : "";
		if (this.name === we) return l`<img class="light" src=${xe("logo.webp")} alt=${this.alt} decoding="async" /><img
          class="dark"
          src=${xe("logo-dark.webp")}
          alt=${this.alt}
          decoding="async"
        />`;
		let t = xe(`poses/${this.name}.webp`);
		return Se.has(this.name) ? l`<img class="light" src=${t} alt=${this.alt} decoding="async" /><img
        class="dark"
        src=${xe(`poses/${this.name}-dark.webp`)}
        alt=${this.alt}
       
        decoding="async"
      />` : l`<img class=${e} src=${t} alt=${this.alt} decoding="async" />`;
	}
};
w([b()], Te.prototype, "name", void 0), w([b()], Te.prototype, "alt", void 0), p("joe-pose", Te);
//#endregion
//#region src/components/empty-state.ts
var Ee = class extends o {
	constructor(...e) {
		super(...e), this.pose = "", this.heading = "", this.text = "", this.note = "";
	}
	static {
		this.styles = [f, S`
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
		return l`<div class="wrap">
      <joe-pose name=${this.pose}></joe-pose>
      <div>
        ${c(this.heading)} ${t}
        <p class="lead">${this.text}</p>
        ${this.note ? l`<div class="note"><span class="chip soon">${this.note}</span></div>` : u}
        <slot></slot>
      </div>
    </div>`;
	}
};
w([b()], Ee.prototype, "pose", void 0), w([b()], Ee.prototype, "heading", void 0), w([b()], Ee.prototype, "text", void 0), w([b()], Ee.prototype, "note", void 0), p("joe-empty-state", Ee);
//#endregion
//#region src/components/entity-picker.ts
var De = 60, Oe = class extends o {
	constructor(...e) {
		super(...e), this.selected = [], this.invert = !1, this.query = "", this.showAll = !1, this.limit = De;
	}
	static {
		this.styles = [f, S`
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
		e.has("request") && this.request && (this.selected = [...this.request.selected], this.invert = this.request.measurement?.invert ?? !1, this.query = "", this.showAll = !1, this.limit = De);
	}
	render() {
		let { hass: e, t, request: n } = this;
		if (!e || !t || !n) return u;
		let r = this.candidates(e, n), i = r.slice(0, this.limit), a = this.query ? [] : (n.suggestions ?? []).filter((t) => e.states[t.entity_id]);
		return l`<div data-tipped>
      <div class="sheet-title">${c(n.heading, "h2", O(t, n.tip))}</div>
      <input
        class="input search"
        type="search"
        .value=${this.query}
        placeholder=${t("pick.search")}
        aria-label=${t("pick.search")}
        @input=${(e) => {
			this.query = e.target.value, this.limit = De;
		}}
      />
      ${a.length ? l`<div class="group-label">${t("pick.suggested")}</div>
            <ul>
              ${a.map((r) => this.renderRow(e, t, n, r.entity_id, r))}
            </ul>` : u}
      <div class="group-label">${t(this.showAll ? "pick.all" : "pick.fitting")} · ${r.length}</div>
      ${r.length ? l`<ul>
            ${i.map((r) => this.renderRow(e, t, n, r))}
          </ul>` : l`<p class="empty">${t("pick.empty")}</p>`}
      ${r.length > i.length ? l`<button type="button" class="mini-btn more" data-notip @click=${() => this.limit += De}>
            ${t("pick.more", { count: r.length - i.length })}
          </button>` : u}
      <div class="line">
        <button
          type="button"
          id="all"
          class="switch"
          role="switch"
          aria-checked=${String(this.showAll)}
          aria-labelledby="all-label"
          @click=${() => {
			this.showAll = !this.showAll, this.limit = De;
		}}
        ></button>
        <label id="all-label" for="all">${t("pick.show_all")}</label>
        ${O(t, "pick_all")}
      </div>
      ${n.measurement ? this.renderInvert(e, t, n) : u}
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
			if (i.has(o) || !this.showAll && (!v(s, t.filter) || e.entities?.[o]?.hidden)) continue;
			let c = n(e, o);
			if (r.length) {
				let t = `${c} ${o} ${ye(e, o)}`.toLowerCase();
				if (!r.every((e) => t.includes(e))) continue;
			}
			a.push({
				id: o,
				name: c
			});
		}
		return a.sort((e, t) => e.name.localeCompare(t.name, this.t?.lang)), a.map((e) => e.id);
	}
	renderRow(e, t, i, a, o) {
		let s = this.selected.includes(a), c = ye(e, a), d = o?.reasons?.[0];
		return l`<li>
      <button type="button" class="row" aria-pressed=${String(s)} @click=${() => this.toggle(a)}>
        <span class="mark ${i.multiple ? "box" : ""}" aria-hidden="true">
          ${s ? l`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>` : u}
        </span>
        <span class="txt">
          <b>${n(e, a)}</b>
          <small>${c ? `${c} · ` : ""}${a}</small>
          ${d ? l`<small class="why">${g(t, d)}</small>` : u}
        </span>
        <span class="end">
          <span class="val">${r(e, a, t.lang)}</span>
          ${o?.confidence == null ? u : h(t, o.confidence)}
        </span>
      </button>
    </li>`;
	}
	renderInvert(e, t, n) {
		let r = n.measurement?.role ?? "grid", a = this.selected[0], o = a ? m(e, {
			entity_id: a,
			invert: this.invert,
			minus_entity_id: null
		}) : null, s = "";
		if (o !== null) {
			let e = i(t.lang, Math.abs(o), 2);
			s = r === "grid" ? t(o >= 0 ? "pick.preview.import" : "pick.preview.export", { value: e }) : r === "battery" ? t(o >= 0 ? "pick.preview.charge" : "pick.preview.discharge", { value: e }) : t(o >= -.05 ? `pick.preview.${r}` : "pick.preview.negative", { value: i(t.lang, o, 2) });
		}
		return l`<div class="line">
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
        ${O(t, r === "battery" ? "pick_invert_battery" : "pick_invert")}
      </div>
      ${s ? l`<div class="note preview"><ha-icon icon="mdi:eye-outline"></ha-icon><span>${s}</span></div>` : u}`;
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
w([b({ attribute: !1 })], Oe.prototype, "hass", void 0), w([b({ attribute: !1 })], Oe.prototype, "t", void 0), w([b({ attribute: !1 })], Oe.prototype, "request", void 0), w([y()], Oe.prototype, "selected", void 0), w([y()], Oe.prototype, "invert", void 0), w([y()], Oe.prototype, "query", void 0), w([y()], Oe.prototype, "showAll", void 0), w([y()], Oe.prototype, "limit", void 0), p("joe-entity-picker", Oe);
//#endregion
//#region src/components/sheet.ts
var ke = class extends o {
	constructor(...e) {
		super(...e), this.label = "", this.closeLabel = "", this.wide = !1, this.onScrim = (e) => {
			e.composedPath()[0] === this && this.close();
		};
	}
	static {
		this.styles = S`
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
		return l`<div
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
w([b()], ke.prototype, "label", void 0), w([b()], ke.prototype, "closeLabel", void 0), w([b({
	type: Boolean,
	reflect: !0
})], ke.prototype, "wide", void 0), w([s(".panel")], ke.prototype, "panel", void 0), p("joe-sheet", ke);
//#endregion
//#region src/components/sim-switch.ts
var Ae = {
	simulation: "mdi:pause",
	advisory: "mdi:comment-question-outline",
	live: "mdi:play",
	off: "mdi:power"
}, je = class extends o {
	constructor(...e) {
		super(...e), this.mode = "simulation", this.compact = !1, this.running = !1;
	}
	static {
		this.styles = S`
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
		return e ? l`<button
      type="button"
      class="${this.mode}${this.running ? " running" : ""}"
      aria-label=${e("mode.switch.label")}
      @click=${this.toggle}
    >
      <span class="knob"><ha-icon icon=${Ae[this.mode]}></ha-icon></span>
      <span>
        <b>${e(`mode.${this.mode}`)}</b>
        ${this.compact ? u : l`<small>${e(`mode.${this.mode}.sub`)}</small>`}
      </span>
    </button>` : u;
	}
	toggle() {
		this.dispatchEvent(new CustomEvent("joe-mode-switch", {
			bubbles: !0,
			composed: !0
		}));
	}
};
w([b()], je.prototype, "mode", void 0), w([b({ type: Boolean })], je.prototype, "compact", void 0), w([b({ type: Boolean })], je.prototype, "running", void 0), w([b({ attribute: !1 })], je.prototype, "t", void 0), p("joe-sim-switch", je);
//#endregion
//#region src/config.ts
var Me = /\[[^\]]*\]|[^.[]+/g;
function Ne(e) {
	let t = [], n = "";
	for (let r of e.match(Me) ?? []) n = !n || r.startsWith("[") ? n + r : `${n}.${r}`, t.push(n);
	return t.reverse();
}
function j(e, t) {
	for (let n of Ne(t)) {
		let t = e.provenance[n];
		if (t) return t;
	}
}
function M(e, t) {
	return e.answers.ignored.includes(t);
}
function N(e, t, n) {
	let r = e.answers.ignored.filter((e) => e !== t);
	return n ? [...r, t] : r;
}
function P(e, t, n = "user") {
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
function F(e, t) {
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
function Pe(e, t = []) {
	let n = /* @__PURE__ */ new Set(), r = [];
	for (let i of [...e, ...t.map((e) => ({ entity_id: e.entity_id }))]) n.has(i.entity_id) || (n.add(i.entity_id), r.push(i));
	return r;
}
function Fe(e) {
	return {
		entity_id: e.entity.entity_id,
		confidence: e.confidence,
		reasons: e.reasons
	};
}
//#endregion
//#region src/components/calendar-flow.ts
var Ie = class extends o {
	constructor(...e) {
		super(...e), this.variant = "calendar", this.address = "", this.calendar = "";
	}
	static {
		this.styles = S`
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
		return e ? l`<ol aria-label=${e(`flow.${this.variant}.title`)}>
      ${this.steps(e).map((e, t) => l`<li class=${e.joe ? "joe" : ""}>
          <span class="badge" aria-hidden="true">
            <ha-icon icon=${e.icon}></ha-icon>
            <span class="number">${t + 1}</span>
          </span>
          <span .innerHTML=${this.bold(e.text)}></span>
        </li>`)}
    </ol>` : u;
	}
	bold(e) {
		return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
	}
};
w([b({ attribute: !1 })], Ie.prototype, "t", void 0), w([b()], Ie.prototype, "variant", void 0), w([b()], Ie.prototype, "address", void 0), w([b()], Ie.prototype, "calendar", void 0), p("joe-calendar-flow", Ie);
//#endregion
//#region src/components/car-account.ts
var Le = [
	"google",
	"outlook",
	"microsoft",
	"icloud",
	"infomaniak",
	"caldav"
], Re = /* @__PURE__ */ new Set([
	"google",
	"outlook",
	"microsoft"
]), ze = {
	kind: "outlook",
	address: "",
	username: null,
	url: null,
	client_id: null,
	tenant: "common",
	accept: !0
}, I = class extends o {
	constructor(...e) {
		super(...e), this.actionId = "", this.saved = !1, this.password = "", this.secret = "", this.busy = !1, this.ownApp = !1;
	}
	static {
		this.styles = [f, S`
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
		if (!e) return u;
		let t = this.account, n = Re.has(t.kind);
		return l`<div class="field" data-tipped>
        <div class="head-row"><label for="account-kind"><b>${e("calendar.account.kind")}</b></label> ${O(e, "calendar_account")}</div>
        <select id="account-kind" class="input" @change=${(e) => this.set({ kind: e.target.value })}>
          ${Le.map((n) => l`<option value=${n} ?selected=${n === t.kind}>${e(`calendar.account.kind.${n}`)}</option>`)}
        </select>
      </div>
      <div class="field" data-tipped>
        <div class="head-row"><label for="account-address"><b>${e("calendar.account.address")}</b></label> ${O(e, "calendar_account_address")}</div>
        <input
          id="account-address"
          class="input"
          type="email"
          autocomplete="off"
          placeholder=${e(`calendar.account.placeholder.${t.kind}`)}
          .value=${t.address}
          @change=${(e) => this.set({ address: e.target.value.trim().toLowerCase() })}
        />
        ${t.kind === "google" ? l`<p class="hint">${e("calendar.account.google.hint")}</p>` : u}
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
        ${O(e, "calendar_account_accept")}
      </div>
      ${this.renderStatus(e)}`;
	}
	get account() {
		return {
			...ze,
			...this.need?.account ?? {}
		};
	}
	joeApp(e) {
		return e === "google" ? !!this.apps?.google : !!this.apps?.microsoft;
	}
	renderSignIn(e, t) {
		let n = this.status, r = n?.oauth, i = t.kind === "google", a = this.joeApp(t.kind), o = !a || this.ownApp || !!t.client_id || t.kind === "microsoft", s = !!n?.has_sign_in, c = this.signInError ?? (r?.state === "error" ? r.error : void 0);
		return l`${o ? this.renderOwnApp(e, t, a) : u}
      <div class="field" data-tipped>
        <div class="inline">
          <button type="button" class="mini-btn go" ?disabled=${this.busy} @click=${() => this.act("sign_in")}>
            <ha-icon icon=${i ? "mdi:google" : "mdi:microsoft"}></ha-icon>${e(s ? "mail.sign_in.again" : i ? "mail.sign_in.google" : "mail.sign_in")}
          </button>
          ${s ? l`<button type="button" class="mini-btn quiet" @click=${() => this.act("sign_out")}>${e("mail.sign_out")}</button>` : u}
          ${o ? u : l`<button type="button" class="mini-btn quiet" @click=${() => this.ownApp = !0}>${e("calendar.account.own_app")}</button>`}
          ${O(e, "mail_sign_in")}
        </div>
        ${r?.state === "waiting" && !this.signInError ? l`<p class="code">${e("mail.sign_in.code", { code: r.user_code ?? "" })}
              <a href=${r.uri ?? ""} target="_blank" rel="noreferrer noopener">${r.uri}</a></p>` : c ? l`<p class="bad">${e.optional(`calendar.account.oauth.${c}`) ?? e("calendar.account.oauth.other")}</p>` : s ? l`<p class="hint ok">${e("mail.signed_in")}</p>` : u}
      </div>`;
	}
	renderOwnApp(e, t, n) {
		let r = t.kind === "google";
		return l`<div class="field" data-tipped>
      <div class="head-row">
        <b>${e(n ? "calendar.account.client_id" : "calendar.account.client_id.needed")}</b>
        ${O(e, r ? "google_app" : "mail_microsoft")}
      </div>
      ${n ? u : l`<p class="hint">${e("calendar.account.no_joe_app")}</p>`}
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
        ${t.kind === "microsoft" ? l`<input
              class="input"
              type="text"
              placeholder="common"
              aria-label=${e("mail.tenant")}
              .value=${t.tenant}
              @change=${(e) => this.set({ tenant: e.target.value.trim() || "common" })}
            />` : u}
      </div>
      ${r ? l`<form
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
          ${this.status?.has_client_secret ? l`<p class="hint ok">${e("mail.password.saved")}</p>` : u}` : u}
    </div>`;
	}
	renderPassword(e, t) {
		return l`${t.kind === "caldav" ? l`<div class="field" data-tipped>
            <div class="head-row"><b>${e("calendar.account.url")}</b> ${O(e, "calendar_account_url")}</div>
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
          </div>` : u}
      <div class="field" data-tipped>
        <div class="head-row"><label for="account-password"><b>${e("calendar.account.password")}</b></label> ${O(e, "calendar_account_password")}</div>
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
        ${this.status?.has_password ? l`<p class="hint ok">${e("mail.password.saved")}</p>` : u}
      </div>`;
	}
	renderStatus(e) {
		let t = this.status, n = Re.has(this.account.kind) ? t?.has_sign_in : t?.has_password, r = this.saved ? t?.state === "error" ? e("mail.state.error", { error: e.optional(`calendar.account.error.${t.error}`) ?? e("calendar.account.error.other") }) : t?.checked ? e("mail.state.ok", { time: k(t.checked) }) : "" : e("calendar.account.after_save");
		return l`<div class="inline" data-tipped>
      <button type="button" class="mini-btn" ?disabled=${this.busy || !n} @click=${() => this.act("test")}>
        <ha-icon icon="mdi:calendar-check-outline"></ha-icon>${e("calendar.account.test")}
      </button>
      ${O(e, "calendar_account_test")}
      <span class=${this.saved && t?.state === "error" ? "bad" : "hint"}>${r}</span>
      ${this.result ? l`<span class=${this.result === "ok" ? "ok" : "bad"}>
            ${e.optional(`calendar.account.result.${this.result}`) ?? e("calendar.account.result.other")}
          </span>` : u}
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
w([b({ attribute: !1 })], I.prototype, "hass", void 0), w([b({ attribute: !1 })], I.prototype, "t", void 0), w([b()], I.prototype, "actionId", void 0), w([b({ type: Boolean })], I.prototype, "saved", void 0), w([b({ attribute: !1 })], I.prototype, "need", void 0), w([b({ attribute: !1 })], I.prototype, "status", void 0), w([b({ attribute: !1 })], I.prototype, "apps", void 0), w([y()], I.prototype, "password", void 0), w([y()], I.prototype, "secret", void 0), w([y()], I.prototype, "result", void 0), w([y()], I.prototype, "signInError", void 0), w([y()], I.prototype, "busy", void 0), w([y()], I.prototype, "ownApp", void 0), p("joe-car-account", I);
//#endregion
//#region src/components/car-mailbox.ts
var Be = [
	"webde",
	"gmx",
	"google",
	"tonline",
	"other"
], Ve = {
	"web.de": "webde",
	"gmx.de": "gmx",
	"gmx.net": "gmx",
	"gmx.at": "gmx",
	"gmx.ch": "gmx",
	"gmail.com": "google",
	"googlemail.com": "google",
	"t-online.de": "tonline"
}, He = {
	provider: "other",
	address: "",
	username: null,
	imap_host: null,
	imap_port: null,
	smtp_host: null,
	smtp_port: null,
	smtp_security: null,
	accept: !0
}, Ue = class extends o {
	constructor(...e) {
		super(...e), this.actionId = "", this.saved = !1, this.password = "", this.busy = !1, this.servers = !1;
	}
	static {
		this.styles = [f, S`
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
		if (!e) return u;
		let t = this.mailbox, n = this.servers || t.provider === "other" && !!t.address;
		return l`<div class="field" data-tipped>
        <div class="head-row"><label for="mail-address"><b>${e("mail.address")}</b></label> ${O(e, "mail_address")}</div>
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
        <div class="head-row"><label for="mail-provider"><b>${e("mail.provider")}</b></label> ${O(e, "mail_provider")}</div>
        <select id="mail-provider" class="input" @change=${(e) => this.set({ provider: e.target.value })}>
          ${Be.map((n) => l`<option value=${n} ?selected=${n === t.provider}>${e(`mail.provider.${n}`)}</option>`)}
        </select>
        <p class="hint">${e(`mail.provider.${t.provider}.hint`)}</p>
      </div>
      ${this.renderPassword(e)} ${n ? this.renderServers(e, t) : u}
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
        ${O(e, "mail_accept")}
        ${n ? u : l`<button type="button" class="mini-btn quiet" @click=${() => this.servers = !0}>${e("mail.servers.change")}</button>`}
      </div>
      ${this.renderStatus(e)} ${this.renderRecent(e)}`;
	}
	get mailbox() {
		return {
			...He,
			...this.need?.mailbox ?? {}
		};
	}
	renderPassword(e) {
		return l`<div class="field" data-tipped>
      <div class="head-row"><label for="mail-password"><b>${e("mail.password")}</b></label> ${O(e, "mail_password")}</div>
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
      ${this.status?.has_secret ? l`<p class="hint ok">${e("mail.password.saved")}</p>` : l`<p class="hint">${e("mail.password.hint")}</p>`}
    </div>`;
	}
	renderServers(e, t) {
		let n = (n) => l`<input
      class="input"
      type="text"
      aria-label=${e(`mail.${n}`)}
      placeholder=${e(`mail.${n}`)}
      .value=${t[n] ?? ""}
      @change=${(e) => this.set({ [n]: e.target.value.trim() || null })}
    />`, r = (n) => l`<input
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
		return l`<div class="field" data-tipped>
      <div class="head-row"><b>${e("mail.servers")}</b> ${O(e, "mail_servers")}</div>
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
		return l`<div class="field" data-tipped>
      <div class="inline">
        <button type="button" class="mini-btn" ?disabled=${this.busy || !this.status?.has_secret} @click=${() => this.act("test")}>
          <ha-icon icon="mdi:connection"></ha-icon>${e("mail.test")}
        </button>
        ${this.saved ? l`<button type="button" class="mini-btn" ?disabled=${this.busy || !this.status?.has_secret} @click=${() => this.act("check")}>
              <ha-icon icon="mdi:email-sync-outline"></ha-icon>${e("mail.check")}
            </button>` : u}
        ${O(e, "mail_status")}
      </div>
      <p class=${this.saved && this.status?.state === "error" ? "hint bad" : "hint"}>
        ${this.saved ? this.statusText(e) : e("mail.after_save")}
      </p>
      ${this.result ? l`<p class=${this.result === "ok" ? "hint ok" : "hint bad"} role="status">
            ${e.optional(`mail.result.${this.result}`) ?? e("mail.result.failed")}
          </p>` : u}
    </div>`;
	}
	renderRecent(e) {
		let t = this.status?.recent ?? [];
		if (!t.length) return u;
		let n = this.need?.allowed ?? [];
		return l`<div class="field" data-tipped>
      <div class="head-row"><b>${e("mail.recent")}</b> ${O(e, "mail_recent")}</div>
      <ul>
        ${t.slice(0, 8).map((t) => l`<li>
            <span class="what">
              ${t.summary || "–"} ${t.start && t.start.includes("T") ? `· ${t.start.slice(8, 10)}.${t.start.slice(5, 7)}. ${k(t.start)}` : ""}
              · ${t.from}
            </span>
            <span class=${t.result.startsWith("not") || t.result.endsWith("not_accepted") || t.result.startsWith("no_") ? "bad" : ""}>
              ${e.optional(`mail.recent.${t.result}`) ?? t.result}
            </span>
            ${t.result === "not_allowed" && !n.includes(t.from) ? l`<button type="button" class="mini-btn" @click=${() => this.change({ allowed: [...n, t.from] })}>${e("mail.allow")}</button>` : u}
          </li>`)}
      </ul>
    </div>`;
	}
	statusText(e) {
		let t = this.status;
		return !t || t.state === "off" || t.state === "waiting" ? e("mail.state.waiting") : t.state === "no_secret" ? e("mail.state.no_secret") : t.state === "error" ? e("mail.state.error", { error: e.optional(`mail.error.${t.error}`) ?? String(t.error) }) : e("mail.state.ok", { time: t.checked ? k(t.checked) : "–" });
	}
	setAddress(e) {
		let t = Ve[e.split("@")[1] ?? ""], n = this.mailbox, r = n.provider === "other" || n.provider === Ve[n.address.split("@")[1] ?? ""];
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
w([b({ attribute: !1 })], Ue.prototype, "hass", void 0), w([b({ attribute: !1 })], Ue.prototype, "t", void 0), w([b()], Ue.prototype, "actionId", void 0), w([b({ type: Boolean })], Ue.prototype, "saved", void 0), w([b({ attribute: !1 })], Ue.prototype, "need", void 0), w([b({ attribute: !1 })], Ue.prototype, "status", void 0), w([y()], Ue.prototype, "password", void 0), w([y()], Ue.prototype, "busy", void 0), w([y()], Ue.prototype, "result", void 0), w([y()], Ue.prototype, "servers", void 0), p("joe-car-mailbox", Ue);
//#endregion
//#region src/components/car-calendars.ts
var We = [
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
], Ge = [
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
], L = class extends o {
	constructor(...e) {
		super(...e), this.actionId = "", this.savedSource = null, this.carName = "", this.copied = !1, this.copyFailed = !1, this.linksFailed = !1, this.sender = "";
	}
	static {
		this.styles = [f, S`
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
		if (!e || !t) return u;
		let n = this.need?.source ?? "ha";
		return l`<div data-tipped>
        <div class="head-row"><b>${e("calendar.source")}</b> ${O(e, "calendar_source")}</div>
        <div class="ways-box"><div class="ways" role="radiogroup" aria-label=${e("calendar.source")}>
          ${We.map((t) => l`<button
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
      ${this.linksFailed ? l`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("calendar.links_failed")}</span>
            <button type="button" class="mini-btn quiet" @click=${() => this.load(!1)}>${e("calendar.retry")}</button>
          </div>` : u}`;
	}
	saved(e) {
		return this.savedSource === e;
	}
	renderLegacy(e, t) {
		let r = this.savedSource && this.savedSource !== "mailbox" && this.savedSource === (this.need?.source ?? "ha") ? this.links?.entities[this.actionId] : null;
		return r ? l`<div class="own" data-tipped>
          <div class="head-row"><ha-icon icon="mdi:calendar-clock"></ha-icon><b>${e("calendar.own.legacy")}</b> ${O(e, "calendar_legacy")}</div>
          <p class="hint">${e("calendar.own.legacy.hint", { name: n(t, r) })}</p>
        </div>` : u;
	}
	renderCalendar(e, t) {
		let r = this.need?.calendars ?? [];
		return l`<div class="part">
        <joe-calendar-flow .t=${e} variant="calendar"></joe-calendar-flow>
      </div>
      ${this.renderLegacy(e, t)}
      <div data-tipped>
        <div class="head-row"><b>${e("calendar.pick")}</b> ${O(e, "calendar_more")}</div>
        <div class="chips">
          ${r.map((i) => l`<span class="chip">
              ${n(t, i)}
              <button
                type="button"
                class="mini-btn quiet"
                aria-label=${e("calendar.remove", { name: n(t, i) })}
                @click=${() => this.change({ calendars: r.filter((e) => e !== i) })}
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
          ${Ge.map((t) => l`<a class="mini-btn" href=${t.url} target="_blank" rel="noreferrer noopener">
                <ha-icon icon="mdi:open-in-new"></ha-icon>${e(`calendar.connect.${t.key}`)}
              </a>`)}
          ${O(e, "calendar_connect")}
        </div>
      </div>`;
	}
	async pick() {
		let e = this.t, t = await F(this, {
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
		let r = this.saved("mailbox"), i = r ? this.links?.entities[this.actionId] : null, a = i ? n(t, i) : e("calendar.own.name", { car: this.carName });
		return l`<div class="part">
        <joe-calendar-flow .t=${e} variant="mailbox" address=${this.need?.mailbox?.address ?? ""} calendar=${a}></joe-calendar-flow>
      </div>
      <div class="head-row"><b>${e("calendar.mailbox")}</b></div>
      <joe-car-mailbox
        .hass=${t}
        .t=${e}
        actionId=${this.actionId}
        ?saved=${r}
        .need=${this.need}
        .status=${this.mailbox}
      ></joe-car-mailbox>
      ${this.renderAllowed(e)} ${this.renderOwn(e, a, i)}`;
	}
	renderOwn(e, t, n) {
		let r = l`<div class="head-row">
      <ha-icon icon="mdi:calendar-import"></ha-icon><b>${e("calendar.own")}</b> ${O(e, "calendar_own")}
    </div>`;
		if (!n) return l`<div class="own" data-tipped>${r}<p class="hint">${e("calendar.own.after_save", { name: t })}</p></div>`;
		let i = this.links?.links[this.actionId], a = this.links?.external_url, o = i && a ? `${a.replace(/\/$/, "")}${i}` : null;
		return l`<div class="own" data-tipped>
      ${r}
      <p class="hint">${e("calendar.own.hint", { name: t })}</p>
      ${o ? l`<div class="link">
            <code>${o}</code>
            <button type="button" class="mini-btn" @click=${() => this.copy(o)}>
              <ha-icon icon=${this.copied ? "mdi:check" : "mdi:content-copy"}></ha-icon>${e(this.copied ? "calendar.copied" : "calendar.copy")}
            </button>
            <button type="button" class="mini-btn quiet" @click=${() => this.load(!0)}>
              <ha-icon icon="mdi:refresh"></ha-icon>${e("calendar.renew")}
            </button>
            ${O(e, "calendar_link")}
          </div>
          ${this.copyFailed ? l`<p class="hint bad">${e("calendar.copy_failed")}</p>` : u}` : l`<p class="hint">${e("calendar.no_external")}</p>`}
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
		return l`<div class="part">
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
      ${this.renderAllowed(e, "account_allowed")} ${this.hass ? this.renderLegacy(e, this.hass) : u}`;
	}
	renderAllowed(e, t = "mail_allowed") {
		let n = this.need?.allowed ?? [];
		return l`<div class="part" data-tipped>
      <div class="head-row"><b>${e("mail.allowed")}</b> ${O(e, t)}</div>
      <p class="hint">${e("mail.allowed.hint")}</p>
      ${n.length ? l`<div class="chips">
            ${n.map((t) => l`<span class="chip">
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
          </div>` : l`<div class="note warn"><ha-icon icon="mdi:account-alert-outline"></ha-icon><span>${e("mail.allowed.none")}</span></div>`}
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
w([b({ attribute: !1 })], L.prototype, "hass", void 0), w([b({ attribute: !1 })], L.prototype, "t", void 0), w([b()], L.prototype, "actionId", void 0), w([b({ attribute: !1 })], L.prototype, "savedSource", void 0), w([b({ attribute: !1 })], L.prototype, "need", void 0), w([b({ attribute: !1 })], L.prototype, "mailbox", void 0), w([b({ attribute: !1 })], L.prototype, "account", void 0), w([b({ attribute: !1 })], L.prototype, "apps", void 0), w([b()], L.prototype, "carName", void 0), w([y()], L.prototype, "links", void 0), w([y()], L.prototype, "copied", void 0), w([y()], L.prototype, "copyFailed", void 0), w([y()], L.prototype, "linksFailed", void 0), w([y()], L.prototype, "sender", void 0), p("joe-car-calendars", L);
//#endregion
//#region src/hot-water.ts
var Ke = [
	"warmwasser",
	"brauchwasser",
	"trinkwasser",
	"boiler",
	"hot_water",
	"hot water",
	"dhw",
	"water_heater",
	"water heater"
], qe = [
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
], Je = [
	"switch",
	"input_boolean",
	"select",
	"input_select",
	"number",
	"input_number",
	"button",
	"script"
];
function Ye(e, t) {
	let n = e.states[t], r = String(n?.attributes.friendly_name ?? ""), i = e.entities?.[t]?.device_id, a = i ? e.devices?.[i] : void 0;
	return `${t} ${r} ${a?.name_by_user ?? a?.name ?? ""}`.toLowerCase().replaceAll("-", " ");
}
function Xe(e, t) {
	return [...Ke, ...t].some((t) => e.includes(t));
}
function Ze(e) {
	return (e ?? "").toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((e) => e.length >= 5);
}
function Qe(e, t) {
	let n = Ze(t), r = [], i = [];
	for (let [t, a] of Object.entries(e.states)) {
		let o = t.split(".")[0], s = Ye(e, t);
		if (!Xe(s, n)) continue;
		let c = t.toLowerCase(), l = String(a.attributes.unit_of_measurement ?? "");
		if ((o === "sensor" || o === "number") && (l === "°C" || l === "°F")) {
			let e = (Ke.some((e) => c.includes(e.replace(" ", "_"))) ? 2 : 1) - (qe.some((e) => s.includes(e)) ? 2 : 0);
			r.push({
				entity_id: t,
				score: e
			});
		} else Je.includes(o) && i.push({
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
var $e = [
	"eq",
	"ne",
	"lt",
	"le",
	"gt",
	"ge"
], et = {
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
}, tt = {
	reserve_km: [0, 1e3],
	consumption: [5, 60],
	daily_km: [0, 2e3],
	capacity_kwh: [.1, 300]
}, nt = {
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
function rt(e, t) {
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
function it(e) {
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
function at(e, t) {
	let n = {};
	for (let [r, i] of Object.entries(nt)) {
		let a = e.entities[i.role];
		!t[r] && a && (n[r] = a);
	}
	return n;
}
function ot(e) {
	return e === "ev" || e === "car" ? "car" : e === "hot_water" ? "hot_water" : "night";
}
function st(e, t, n) {
	return n === "calendars" ? "" : t.entity_id ? t.kind === "target" && !t.sensor_entity ? e("action.problem.sensor") : "" : e("action.problem.entity");
}
function R(e, t, n, r) {
	return l`<div class="field" data-tipped>
    <div class="field-label">${t} ${O(e, n)}</div>
    ${r}
  </div>`;
}
function ct(e, t, i) {
	let a = e.t, o = e.hass;
	return l`<div class="entity">
    <span>
      ${t ? l`<b>${n(o, t)}</b><small>${r(o, t, a.lang)}</small>` : l`<small>${a("find.none")}</small>`}
    </span>
    <button type="button" class="mini-btn" @click=${i}>
      <ha-icon icon="mdi:magnify"></ha-icon>${a(t ? "review.change" : "review.choose")}
    </button>
  </div>`;
}
function lt(e) {
	let t = e.trim();
	if (t === "on" || t === "an") return !0;
	if (t === "off" || t === "aus") return !1;
	let n = Number(t.replace(",", "."));
	return t !== "" && Number.isFinite(n) ? n : t;
}
function ut(e, t, n) {
	let r = Math.round(Number.parseFloat(e.target.value));
	return Math.min(n, Math.max(t, Number.isFinite(r) ? r : t));
}
function dt(e, t, n, r) {
	let i = e.t, a = t.split(".", 1)[0], o = e.hass?.states[t]?.attributes.options ?? [];
	if (["select", "input_select"].includes(a) && o.length) return l`<select class="input" aria-label=${i("action.f.value")} @change=${(e) => r(e.target.value)}>
      ${o.map((e) => l`<option value=${e} ?selected=${n === e}>${e}</option>`)}
    </select>`;
	if ([
		"switch",
		"input_boolean",
		"light",
		"fan"
	].includes(a)) {
		let e = n === !0 || n === "on";
		return l`<div class="seg" role="group" aria-label=${i("action.f.value")}>
      <button type="button" aria-pressed=${String(e)} @click=${() => r("on")}>${i("action.value.on")}</button>
      <button type="button" aria-pressed=${String(!e)} @click=${() => r("off")}>${i("action.value.off")}</button>
    </div>`;
	}
	return l`<input
    class="input"
    type="text"
    aria-label=${i("action.f.value")}
    .value=${n == null ? "" : String(n)}
    @change=${(e) => r(lt(e.target.value))}
  />`;
}
function ft(e, t, n) {
	return l`<button type="button" class="switch" role="switch" aria-checked=${String(t)} aria-label=${e} @click=${n}></button>`;
}
function pt(e, t, n, r) {
	return l`<a class="mini-btn quiet go-link" href=${T(e || "/energy-joe", t)} aria-label=${r ?? n} @click=${C(t)}
    >${n}</a
  >`;
}
function mt(e) {
	let t = e.t, n = e.draft;
	return R(t, t("action.f.name"), "a_name", l`<input
      class="input"
      type="text"
      maxlength="60"
      .value=${n.name}
      @change=${(t) => e.setDraft({ name: t.target.value.trim() || n.name })}
    />`);
}
function ht(e) {
	let t = e.t, n = e.draft;
	return R(t, t("action.f.kind"), "a_kind", l`<div class="seg" role="group" aria-label=${t("action.f.kind")}>
      ${["switch", "target"].map((r) => l`<button type="button" aria-pressed=${String(n.kind === r)} @click=${() => e.setDraft({ kind: r })}>
            ${t(`action.kind.${r}`)}
          </button>`)}
    </div>`);
}
function gt(e) {
	let t = e.t, n = e.draft;
	return l`${R(t, t("action.f.entity"), "a_entity", ct(e, n.entity_id, () => Ot(e)))}
    ${n.entity_id ? R(t, t("action.f.on_value"), "a_on_value", dt(e, n.entity_id, n.on_value, (t) => e.setDraft({ on_value: t }))) : u}
    ${R(t, t("action.f.reset"), "a_reset", l`<div class="row">
        <div class="seg" role="group" aria-label=${t("action.f.reset")}>
          ${["previous", "fixed"].map((r) => l`<button type="button" aria-pressed=${String(n.reset === r)} @click=${() => e.setDraft({ reset: r })}>
                ${t(`action.reset.${r}`)}
              </button>`)}
        </div>
        ${n.reset === "fixed" && n.entity_id ? dt(e, n.entity_id, n.reset_value ?? "", (t) => e.setDraft({ reset_value: t })) : u}
      </div>`)}
    ${R(t, t("action.f.lead"), "a_lead", l`<span class="unit-input">
        <input
          class="input"
          type="number"
          min="0"
          max="120"
          step="1"
          .value=${String(n.lead_min)}
          @change=${(t) => e.setDraft({ lead_min: ut(t, 0, 120) })}
        />
        <span class="unit">min</span>
      </span>`)}`;
}
function _t(e) {
	let t = e.t, n = e.draft, r = (r, i) => l`<label>
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
	return l`${R(t, t("action.f.sensor"), "a_sensor", ct(e, n.sensor_entity ?? "", () => kt(e)))}
    ${R(t, t("action.f.temps"), "a_temps", l`<div class="temps">${r("comfort", "°C")} ${r("maximum", "°C")} ${r("buffer", "K")}</div>`)}`;
}
function vt(e) {
	let t = e.t, n = e.draft;
	return l`${R(t, t("action.f.auto"), "a_auto", l`<div class="row">
        ${ft(t("action.f.auto"), n.auto, () => e.setDraft({ auto: !n.auto }))}
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
    ${n.auto ? yt(e) : u}`;
}
function yt(e) {
	let t = e.t, r = e.hass, i = e.draft, a = (t, n) => e.setDraft({ conditions: (e.draft?.conditions ?? []).map((e, r) => r === t ? {
		...e,
		...n
	} : e) });
	return R(t, t("action.f.conditions"), "a_conditions", l`${i.conditions.map((i, o) => l`<div class="condition">
          <span><b>${n(r, i.entity_id)}</b></span>
          <select
            class="input"
            aria-label=${t("action.f.op")}
            @change=${(e) => a(o, { op: e.target.value })}
          >
            ${$e.map((e) => l`<option value=${e} ?selected=${i.op === e}>${t(`action.op.${e}`)}</option>`)}
          </select>
          <input
            class="input"
            type="text"
            aria-label=${t("action.f.value")}
            .value=${String(i.value === !0 ? "on" : i.value === !1 ? "off" : i.value)}
            @change=${(e) => a(o, { value: lt(e.target.value) })}
          />
          <button
            type="button"
            class="icon-btn"
            aria-label=${t("f.remove")}
            title=${t("f.remove")}
            @click=${() => e.setDraft({ conditions: (e.draft?.conditions ?? []).filter((e, t) => t !== o) })}
          >
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>`)}
      <button type="button" class="mini-btn" @click=${() => jt(e)}>
        <ha-icon icon="mdi:plus"></ha-icon>${t("action.f.condition.add")}
      </button>`);
}
function bt(e) {
	let t = e.t, n = e.draft, r = e.config?.consumers ?? [];
	return l`${R(t, t("action.f.power"), "a_power", l`<span class="unit-input">
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
    ${r.length ? R(t, t("action.f.consumer"), "a_consumer", l`<select class="input" @change=${(t) => e.setDraft({ consumer_id: t.target.value || null })}>
            <option value="" ?selected=${!n.consumer_id}>${t("action.f.consumer.none")}</option>
            ${r.map((e) => l`<option value=${e.id} ?selected=${n.consumer_id === e.id}>${e.name}</option>`)}
          </select>`) : u}
    ${R(t, t("action.f.priority"), "a_priority", l`<span class="unit-input">
        <input
          class="input"
          type="number"
          min="1"
          max="9"
          step="1"
          .value=${String(n.priority)}
          @change=${(t) => e.setDraft({ priority: ut(t, 1, 9) })}
        />
      </span>`)}`;
}
function xt(e) {
	let t = e.t, n = e.draft;
	return R(t, t("action.f.enabled"), "a_enabled", ft(t("action.f.enabled"), n.enabled, () => e.setDraft({ enabled: !n.enabled })));
}
function St(e, t) {
	e.setDraft({ need: {
		...e.draft?.need ?? et,
		...t
	} });
}
function Ct(e) {
	let t = e.draft?.need ?? et;
	if (t.enabled) {
		St(e, { enabled: !1 });
		return;
	}
	let n = e.discovery?.cars ?? [], r = (e.discovery?.wallboxes ?? []).filter((e) => e.is_car), i = n.length === 1 && r.length <= 1 ? n[0].entities : {}, a = { enabled: !0 };
	for (let [e, n] of Object.entries(nt)) !t[e] && i[n.role] && (a[e] = i[n.role] ?? null);
	St(e, a);
}
function wt(e) {
	let t = e.t, n = e.draft?.need ?? et, r = (t, r, i, a = "") => l`<span
    class="unit-input"
  >
    <input
      class="input"
      type="number"
      inputmode="decimal"
      min=${tt[t][0]}
      max=${Math.min(i, tt[t][1])}
      step=${t === "consumption" || t === "capacity_kwh" ? "0.1" : "1"}
      placeholder=${a}
      .value=${n[t] == null ? "" : String(n[t])}
      @change=${(n) => {
		let r = n.target, i = Number.parseFloat(r.value.replace(",", ".")), [a, o] = tt[t], s = Number.isFinite(i) && i >= a && i <= o, c = t === "reserve_km" ? 50 : null;
		s || (r.value = c == null ? "" : String(c)), St(e, { [t]: s ? i : c });
	}}
    />
    <span class="unit">${r}</span>
  </span>`, i = (t) => ct(e, n[t] ?? "", () => At(e, t));
	return l`${R(t, t("action.need"), "a_need", l`<div class="row">
          ${ft(t("action.need"), n.enabled, () => Ct(e))}
          <span>${t(n.enabled ? "action.need.on" : "action.need.off")}</span>
        </div>
        <p class="field-hint">${t("action.need.hint")}</p>`)}
    ${n.enabled ? l`${R(t, t("action.need.soc"), "a_need_soc", i("soc_entity"))}
        ${R(t, t("action.need.range"), "a_need_range", i("range_entity"))}
        ${R(t, t("action.need.capacity"), "a_need_capacity", l`<div class="row">${r("capacity_kwh", "kWh", 300, t("action.need.from_sensor"))}</div>
            ${n.capacity_kwh == null ? i("capacity_entity") : u}`)}
        ${R(t, t("action.need.reserve"), "a_need_reserve", r("reserve_km", "km", 1e3))}
        ${R(t, t("action.need.consumption"), "a_need_consumption", l`${r("consumption", "kWh/100 km", 60, t("action.need.learned"))}
            ${n.consumption == null ? i("consumption_entity") : u}`)}
        ${R(t, t("action.need.daily"), "a_need_daily", r("daily_km", "km", 2e3, t("action.need.learned")))}
        ${R(t, t("action.need.odometer"), "a_need_odometer", i("odometer_entity"))}` : u}`;
}
function Tt(e) {
	let t = e.t, n = e.draft, r = n.need ?? et, i = (e.config?.persons ?? []).filter((e) => e.calendars.length), a = i.map((e) => e.id), o = (t) => {
		let n = (e.draft?.need ?? et).persons ?? a, r = n.includes(t) ? n.filter((e) => e !== t) : [...n, t];
		St(e, { persons: a.every((e) => r.includes(e)) ? null : r });
	};
	return l`${R(t, t("action.need.persons"), "a_need_persons", i.length ? l`<ul class="people" role="group" aria-label=${t("action.need.persons")}>
            ${i.map((n) => {
		let i = r.persons == null || r.persons.includes(n.id);
		return l`<li>
                <button type="button" class="mini-btn ${i ? "go" : "quiet"}" aria-pressed=${String(i)} @click=${() => o(n.id)}>
                  <ha-icon icon=${i ? "mdi:check" : "mdi:minus"}></ha-icon>${n.name}
                </button>
                ${pt(e.prefix, {
			tab: "household",
			section: "people",
			id: n.id
		}, t("action.need.person_open"), t("action.need.person_open_of", { name: n.name }))}
              </li>`;
	})}
          </ul>` : l`<p class="field-hint">${t("action.need.no_calendars")}</p>
            ${pt(e.prefix, {
		tab: "household",
		section: "people"
	}, t("action.need.people_link"))}`)}
    ${R(t, t("action.need.calendars"), "a_need_calendars", l`<joe-car-calendars
        .hass=${e.hass}
        .t=${t}
        actionId=${n.id}
        .savedSource=${e.existing?.need?.enabled ? e.existing.need.source ?? "ha" : null}
        .need=${r}
        .mailbox=${e.mailboxes?.[n.id]}
        .account=${e.accounts?.[n.id]}
        .apps=${e.apps}
        carName=${n.name}
        @joe-need=${(t) => St(e, t.detail)}
      ></joe-car-calendars>`)}
    ${R(t, t("action.need.round_trip"), "a_need_round_trip", ft(t("action.need.round_trip"), r.round_trip, () => St(e, { round_trip: !(e.draft?.need ?? et).round_trip })))}
    ${e.config?.routing.service ? u : l`<div class="note">
          <ha-icon icon="mdi:map-marker-distance"></ha-icon>
          <span>${t("action.need.no_routing")} ${pt(e.prefix, {
		tab: "household",
		section: "travel"
	}, t("action.need.routing_link"))}</span>
        </div>`}`;
}
function Et(e, t, n = {}) {
	let r = e.t, i = e.draft;
	return t === "calendars" ? Tt(e) : t === "car" ? l`${wt(e)} ${n.calendars && i.need?.enabled ? Tt(e) : u}
      <h4 class="fields-head">${r("devices.car.wallbox")}</h4>
      ${gt(e)} ${vt(e)} ${bt(e)} ${mt(e)} ${xt(e)}` : t === "hot_water" ? l`${ht(e)} ${gt(e)} ${i.kind === "target" ? _t(e) : u} ${vt(e)}
    ${bt(e)} ${mt(e)} ${xt(e)}` : l`${gt(e)} ${i.kind === "target" ? _t(e) : u} ${vt(e)} ${bt(e)}
  ${mt(e)} ${xt(e)}`;
}
function Dt(e) {
	if (e.draft?.kind !== "target" || !e.hass) return;
	let t = e.config?.consumers.find((t) => t.id === e.draft?.consumer_id);
	return Qe(e.hass, t?.name);
}
async function Ot(e) {
	let t = e.t, n = (await F(e, {
		heading: t("action.pick.entity"),
		tip: "a_entity",
		filter: "writable",
		selected: e.draft?.entity_id ? [e.draft.entity_id] : [],
		suggestions: Dt(e)?.switches
	}))?.selected[0];
	if (n) {
		let t = e.hass?.states[n]?.attributes.options ?? [], r = e.draft?.on_value;
		e.setDraft({
			entity_id: n,
			on_value: t.length && !t.includes(String(r)) ? t.includes("now") ? "now" : t[0] : r ?? "on"
		});
	}
}
async function kt(e) {
	let t = e.t, n = await F(e, {
		heading: t("action.pick.sensor"),
		tip: "a_sensor",
		filter: "temperature",
		selected: e.draft?.sensor_entity ? [e.draft.sensor_entity] : [],
		suggestions: Dt(e)?.sensors
	});
	n?.selected[0] && e.setDraft({ sensor_entity: n.selected[0] });
}
async function At(e, t) {
	let n = e.t, r = nt[t], i = (e.discovery?.cars ?? []).map((e) => ({
		entity_id: e.entities[r.role] ?? "",
		confidence: e.confidence,
		reasons: e.reasons
	})).filter((e) => e.entity_id), a = await F(e, {
		heading: n(`action.need.pick.${r.role}`),
		tip: r.tip,
		filter: r.filter,
		selected: e.draft?.need?.[t] ? [e.draft.need[t]] : [],
		suggestions: Pe(i)
	});
	a && St(e, { [t]: a.selected[0] ?? null });
}
async function jt(e) {
	let t = e.t, n = (await F(e, {
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
var Mt = S`
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
`;
//#endregion
//#region src/components/texts.ts
function Nt(e, t) {
	return t == null ? "–" : i(e.lang, t * 100, 2);
}
function Pt(e, t, n = !0) {
	let r;
	return r = t.kind === "fixed_window" && t.window ? t.night_price == null && t.day_price == null ? e("tariff.window_only", {
		start: t.window.start,
		end: t.window.end
	}) : e("find.tariff.window", {
		start: t.window.start,
		end: t.window.end,
		night: Nt(e, t.night_price),
		day: Nt(e, t.day_price)
	}) : t.kind === "dynamic" ? t.night_price != null && t.day_price != null ? e("find.tariff.dynamic", {
		night: Nt(e, t.night_price),
		day: Nt(e, t.day_price)
	}) : e("tariff.dynamic") : t.kind === "flat" ? t.day_price == null ? e("tariff.flat") : e("find.tariff.flat", { day: Nt(e, t.day_price) }) : e("find.tariff.unknown"), n && t.feed_in_price != null && (r += ` · ${e("find.tariff.feedin", { price: Nt(e, t.feed_in_price) })}`), r;
}
function Ft(e, t) {
	let n = {};
	for (let [r, a] of Object.entries(t)) typeof a == "number" ? n[r] = i(e.lang, a, 2) : typeof a == "string" && (n[r] = a);
	typeof t.role == "string" && (n.role = e.optional(`role.${t.role}`) ?? t.role);
	let r = `check.${t.code}`;
	return t.code === "grid_sign" && typeof t.expected == "number" && typeof t.actual == "number" && (r = t.expected < 0 ? "check.grid_sign.export" : "check.grid_sign.import", n.expected = i(e.lang, Math.abs(t.expected), 1), n.actual = i(e.lang, Math.abs(t.actual), 1)), e.optional(r, n) ?? t.code;
}
//#endregion
//#region src/device-model.ts
var It = [
	"battery",
	"climate",
	"car",
	"hot_water",
	"other",
	"grid"
], Lt = {
	battery: "mdi:home-battery-outline",
	climate: "mdi:thermostat",
	car: "mdi:car-electric",
	hot_water: "mdi:water-boiler",
	other: "mdi:power-plug-outline",
	grid: "mdi:transmission-tower"
}, Rt = (e) => !!(e.need?.enabled || e.need?.soc_entity || e.need?.range_entity), zt = /(^|[^\p{L}\d])(e-?auto|auto|car|ev|wallbox)([^\p{L}\d]|$)/iu;
function Bt(e) {
	if (e.id.startsWith("hot_water_")) return "hot_water";
	if (e.id.startsWith("ev_")) return "car";
	if (e.id.startsWith("custom_")) return "other";
}
function Vt(e, t) {
	if (e.kind === "target") return "hot_water";
	if (Rt(e) || t?.kind === "ev") return "car";
	if (t?.kind === "hot_water") return "hot_water";
	let n = Bt(e);
	return n === "hot_water" || n === "car" ? n : !t && !n && zt.test(`${e.id} ${e.name}`) ? "car" : "other";
}
function Ht(e, t) {
	let n = t.consumer_id ? e.consumers.find((e) => e.id === t.consumer_id) : void 0, r = Vt(t, n);
	return r === "other" ? n && n.kind !== "climate" && e.actions.find((e) => e.consumer_id === n.id && Vt(e, n) === "other")?.id === t.id ? {
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
function Ut(e) {
	return {
		tab: "devices",
		section: e.group,
		id: e.id
	};
}
function Wt(e, t) {
	return {
		tab: "devices",
		section: "add",
		id: e,
		sub: e ? t : void 0
	};
}
function Gt(e, t, n) {
	if (!e) return;
	let r = n ? e.entities?.[n] : void 0, i = t ?? r?.device_id ?? void 0, a = r?.area_id ?? (i ? e.devices?.[i]?.area_id : void 0);
	return a ? e.areas?.[a]?.name : void 0;
}
function Kt(e, t) {
	return (t ? e?.entities?.[t]?.device_id : void 0) ?? void 0;
}
function qt(e, t) {
	return Kt(e, t.power_entity) ?? Kt(e, t.energy_entity);
}
function Jt(e, t) {
	let n = t.filter((e) => !!e);
	return {
		...e,
		problems: n,
		problem: n[0]
	};
}
function Yt(e, t) {
	return t ? e.optional(`devices.problem.${t}`) ?? t : void 0;
}
function Xt(e) {
	return e.level === "warn" || e.code === "tariff_unknown" || e.code === "missing" && e.role === "grid_power";
}
function Zt(e, t, r, i = {}) {
	let a = t.config, o = t.control, s = (i.checks ?? []).filter(Xt), c = [];
	for (let t of a.batteries) {
		let n = t.adapter !== "none", i = o?.ready[t.id], a = t.device_id ?? Kt(r, t.soc_entity);
		c.push(Jt({
			group: "battery",
			id: t.id,
			name: t.name,
			area: Gt(r, a, t.soc_entity),
			icon: Lt.battery,
			deviceId: a,
			entityId: t.soc_entity,
			role: n ? "steers" : "watches",
			battery: t
		}, [
			...s.filter((e) => e.battery_id === t.id).map((t) => Ft(e, t)),
			n ? Yt(e, o?.batteries[t.id]?.problem) : void 0,
			n && i && i !== "ready" && i !== "not_controllable" ? Yt(e, i === "outdated" ? "not_tested" : i) : void 0
		]));
	}
	let l = a.climate?.rooms ?? {}, u = i.climateFound?.devices, d = u ? u.map((e) => e.entity_id) : Object.keys(l);
	for (let e of Object.keys(l)) d.includes(e) || d.push(e);
	let f = a.consumers.filter((e) => e.kind === "climate"), p = /* @__PURE__ */ new Set();
	for (let i of d) {
		let a = u?.find((e) => e.entity_id === i), o = l[i], s = a?.device_id ?? Kt(r, i), d = o?.meter && o.meter !== "none" ? o.meter : void 0, m = f.find((e) => {
			let t = qt(r, e);
			return t !== void 0 && !p.has(e.id) && (t === s || t === d?.device_id);
		}) ?? f.find((e) => !p.has(e.id) && a && e.name.trim().toLowerCase() === a.name.trim().toLowerCase());
		m && p.add(m.id);
		let h = t.climate?.rooms[i]?.error;
		c.push(Jt({
			group: "climate",
			id: i,
			name: a?.name ?? (r ? n(r, i) : i),
			area: a?.area ?? Gt(r, s, i),
			icon: Lt.climate,
			deviceId: s,
			entityId: i,
			role: o?.enabled ? "steers" : "watches",
			climate: a,
			room: o,
			meter: d ? {
				deviceId: d.device_id,
				power: d.power ?? void 0
			} : void 0,
			consumer: m
		}, [u && !a ? e("devices.problem.gone") : void 0, h ? e.optional(`week.error.${h}`) ?? e("week.error", { error: h }) : void 0]));
	}
	for (let e of f.filter((e) => !p.has(e.id))) {
		let t = qt(r, e);
		c.push(Jt({
			group: "climate",
			id: e.id,
			name: e.name,
			area: Gt(r, t, e.power_entity ?? e.energy_entity),
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
	}, g = /* @__PURE__ */ new Set(), _ = (t, n, i) => {
		let a = t.consumer_id ? m.get(t.consumer_id) : void 0, s = n === "car" ? t.need?.soc_entity ?? t.need?.range_entity ?? t.entity_id : n === "hot_water" ? t.sensor_entity ?? t.entity_id : t.entity_id, c = Kt(r, t.entity_id) ?? (a ? qt(r, a) : void 0) ?? Kt(r, s);
		return Jt({
			group: n,
			id: i,
			name: i === a?.id ? a.name : t.name,
			area: Gt(r, c, s || void 0),
			icon: Lt[n],
			deviceId: c,
			entityId: s || void 0,
			role: t.enabled ? "steers" : "watches",
			action: t,
			consumer: a,
			noMeter: n === "other" && !a
		}, [Yt(e, o?.actions?.[t.id]?.problem)]);
	};
	for (let e of a.actions) {
		let t = Ht(a, e);
		e.consumer_id && t.group !== "other" && g.add(e.consumer_id), e.consumer_id && t.id === e.consumer_id && g.add(e.consumer_id), h[t.group].push(_(e, t.group, t.id));
	}
	for (let e of a.consumers) {
		if (e.kind === "climate" || g.has(e.id)) continue;
		let t = e.kind === "ev" ? "car" : e.kind === "hot_water" ? "hot_water" : "other", n = qt(r, e), i = e.power_entity ?? e.energy_entity ?? void 0, a = Jt({
			group: t,
			id: e.id,
			name: e.name,
			area: Gt(r, n, i),
			icon: t === "other" ? Lt.other : Lt[t],
			deviceId: n,
			entityId: i,
			role: "measures",
			consumer: e,
			setup: t === "other" ? void 0 : t
		}, []);
		h[t].push(a);
	}
	let v = new Map(a.consumers.map((e, t) => [e.id, t]));
	h.other.sort((e, t) => (v.get(e.id) ?? Infinity) - (v.get(t.id) ?? Infinity)), c.push(...h.car, ...h.hot_water, ...h.other);
	let y = a.measurements, ee = (t) => s.filter((e) => t === "connection" ? e.role === "grid_power" || e.code === "grid_sign" || e.code === "tariff_unknown" : t === "home" ? e.role === "home_power" || e.code === "home_negative" : e.role === "solar_power").map((t) => Ft(e, t)), b = (e, t, n, i) => Jt({
		group: "grid",
		id: e,
		part: e,
		name: t,
		icon: n,
		deviceId: Kt(r, i),
		entityId: i ?? void 0,
		area: Gt(r, void 0, i),
		role: "measures"
	}, ee(e));
	return c.push(b("connection", e("devices.grid.connection"), "mdi:transmission-tower", y.grid_power?.entity_id)), (y.solar_power.length || a.forecast.provider) && c.push(b("solar", e("devices.grid.solar"), "mdi:solar-power-variant", y.solar_power[0]?.entity_id)), c.push(b("home", e("devices.grid.home"), "mdi:home-lightning-bolt-outline", y.home_power?.entity_id)), c;
}
function Qt(e) {
	return It.filter((t) => t === "grid" || e.some((e) => e.group === t));
}
function $t(e, t, n) {
	return n === void 0 ? void 0 : e.find((e) => e.group === t && e.id === n);
}
function en(e, t) {
	return e.some((e) => e.group === t && e.problems.length > 0);
}
function tn(e, t) {
	return `${e}:${t}`;
}
function nn(e, t) {
	if (!t) return [];
	let n = [];
	for (let r of t.batteries) {
		let t = tn("battery", r.id);
		!e.batteries.some((e) => e.id === r.id) && !M(e, t) && n.push({
			kind: "battery",
			key: t,
			name: r.name,
			battery: r
		});
	}
	for (let r of t.wallboxes.filter((e) => e.is_car)) {
		let t = tn("wallbox", r.device_id ?? r.name);
		!e.actions.some((e) => e.id === `ev_${r.device_id}` || r.mode_entity && e.entity_id === r.mode_entity) && !M(e, t) && n.push({
			kind: "wallbox",
			key: t,
			name: r.name,
			wallbox: r
		});
	}
	for (let r of t.cars ?? []) {
		let t = tn("car", r.device_id);
		!e.actions.some((e) => r.entities.soc && e.need?.soc_entity === r.entities.soc || r.entities.range && e.need?.range_entity === r.entities.range) && !M(e, t) && n.push({
			kind: "car",
			key: t,
			name: r.name,
			car: r
		});
	}
	return n;
}
function rn(e, t) {
	return (t?.batteries ?? []).filter((t) => M(e, tn("battery", t.id)) && !e.batteries.some((e) => e.id === t.id));
}
//#endregion
//#region src/components/action-steer.ts
var an = /* @__PURE__ */ new Map();
function on(e, t) {
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
function sn(e, t) {
	let n = {
		...e,
		...t
	};
	return t.need && e.need && (n.need = {
		...e.need,
		...t.need
	}), n;
}
var cn = class extends o {
	constructor(...e) {
		super(...e), this.prefix = E, this.section = "night", this.saving = !1, this.problem = "", this.version = 0;
	}
	static {
		this.styles = [
			f,
			Mt,
			S`
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
		let e = an.get(this.key);
		return e ? on(e.base, e.draft) : {};
	}
	get draft() {
		let e = this.action;
		return e && an.has(this.key) ? sn(e, this.changes) : e;
	}
	get dirty() {
		let e = an.get(this.key);
		return !!(e && !e.pending && this.action && Object.keys(on(this.action, this.draft)).length);
	}
	setDraft(e) {
		let t = this.action, n = this.draft;
		t && n && (an.set(this.key, {
			base: structuredClone(t),
			draft: {
				...n,
				...e
			},
			pending: !1
		}), this.problem = "", this.version++);
	}
	willUpdate(e) {
		e.has("action") && an.get(this.key)?.pending && an.delete(this.key);
	}
	render() {
		let { t: e, hass: t, draft: n } = this;
		return !e || !t || !n ? u : (this.version, l`<div class="fields">${Et(this, this.section)}</div>
      ${this.problem ? l`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.problem}</span></div>` : u}
      ${this.dirty ? l`<div class="steer-bar" role="region" aria-label=${e("action.steer.unsaved")}>
            <span class="unsaved">${e("action.steer.unsaved")}</span>
            <span class="with-tip" data-tipped>
              <button type="button" class="btn btn-primary" ?disabled=${this.saving} @click=${this.save}>${e("common.save")}</button>
              ${O(e, "a_save")}
            </span>
            <button type="button" class="btn btn-ghost" data-notip ?disabled=${this.saving} @click=${this.cancel}>${e("common.cancel")}</button>
          </div>` : u}`);
	}
	cancel() {
		an.delete(this.key), this.problem = "", this.version++;
	}
	async save() {
		let e = this.draft, t = this.action;
		if (!e || !t || (this.problem = st(this.t, e, this.section), this.problem)) return;
		let n = on(t, e);
		if (!Object.keys(n).length) {
			this.cancel();
			return;
		}
		let r = this.key;
		this.saving = !0;
		let i = await P(this, { actions: { [t.id]: n } });
		this.saving = !1, i && (an.set(r, {
			base: structuredClone(t),
			draft: e,
			pending: !0
		}), this.version++);
	}
};
w([b({ attribute: !1 })], cn.prototype, "hass", void 0), w([b({ attribute: !1 })], cn.prototype, "t", void 0), w([b({ attribute: !1 })], cn.prototype, "state", void 0), w([b({ attribute: !1 })], cn.prototype, "discovery", void 0), w([b({ attribute: !1 })], cn.prototype, "prefix", void 0), w([b({ attribute: !1 })], cn.prototype, "action", void 0), w([b({ attribute: !1 })], cn.prototype, "section", void 0), w([y()], cn.prototype, "saving", void 0), w([y()], cn.prototype, "problem", void 0), w([y()], cn.prototype, "version", void 0);
var ln = class extends o {
	constructor(...e) {
		super(...e), this.asking = !1, this.busy = !1;
	}
	static {
		this.styles = [f, S`
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
		if (!e || !t) return u;
		let n = this.config?.consumers.find((e) => e.id === t.consumer_id), r = Vt(t, n);
		return this.asking ? l`<div data-tipped>
      <p class="ask" role="alert">${e(`action.delete.ask.${r}`, { name: t.name })}</p>
      <div class="row">
        <button type="button" class="btn btn-danger" ?disabled=${this.busy} @click=${this.removeAction}>${e("action.delete.yes")}</button>
        <button type="button" class="btn btn-ghost" ?disabled=${this.busy} @click=${() => this.asking = !1}>
          ${e("action.delete.no")}
        </button>
        ${O(e, "a_delete")}
      </div>
    </div>` : l`<div class="row" data-tipped>
        <button type="button" class="btn btn-danger" @click=${() => this.asking = !0}>${e("action.delete")}</button>
        ${O(e, "a_delete")}
      </div>`;
	}
	async removeAction() {
		let e = this.action;
		if (!e) return;
		this.busy = !0;
		let t = await P(this, { actions: { [e.id]: null } });
		this.busy = !1, t && (this.asking = !1, this.dispatchEvent(new CustomEvent("joe-deleted", {
			detail: { id: e.id },
			bubbles: !0,
			composed: !0
		})), this.leave && D(this, this.leave, { replace: !0 }));
	}
};
w([b({ attribute: !1 })], ln.prototype, "t", void 0), w([b({ attribute: !1 })], ln.prototype, "config", void 0), w([b({ attribute: !1 })], ln.prototype, "action", void 0), w([b({ attribute: !1 })], ln.prototype, "leave", void 0), w([y()], ln.prototype, "asking", void 0), w([y()], ln.prototype, "busy", void 0);
var un = class extends o {
	constructor(...e) {
		super(...e), this.failed = !1;
	}
	static {
		this.styles = [f, S`
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
		if (!e || !t || !n) return u;
		let r = t.plan?.window?.start, i = !!r && t.control?.tonight?.[n.id] === r, a = `tonight-${n.id}`;
		return l`<div class="tonight" data-tipped>
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
        ${O(e, "action_tonight")}
      </div>
      ${this.failed ? l`<p class="bad" role="status">${e("error.action")}</p>` : u}`;
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
w([b({ attribute: !1 })], un.prototype, "hass", void 0), w([b({ attribute: !1 })], un.prototype, "t", void 0), w([b({ attribute: !1 })], un.prototype, "state", void 0), w([b({ attribute: !1 })], un.prototype, "action", void 0), w([y()], un.prototype, "failed", void 0);
function dn(e, t, n) {
	let r = t.plan?.actions?.find((e) => e.id === n.id), a = t.control?.actions?.[n.id], o = r?.target == null ? "" : i(e.lang, r.target, 0);
	if (!n.enabled) return e("devices.action.disabled");
	if (a?.reason === "boost") return e("devices.action.boost");
	if (a?.on) return n.kind === "target" ? e("devices.action.heating", {
		target: o,
		end: k(a.end)
	}) : e("devices.action.running", { end: k(a.end) });
	if (a?.reason === "reached") {
		let a = t.control?.tonight_target?.[n.id];
		return n.kind === "switch" && a && a.night === t.plan?.window?.start ? e("devices.action.reached_need", {
			target: i(e.lang, a.chosen, 0),
			unit: a.unit
		}) : n.kind === "switch" ? r?.need && o ? e("devices.action.reached_need", {
			target: o,
			unit: r.need.target_unit === "km" ? "km" : "%"
		}) : e("devices.action.reached_plain") : e("devices.action.reached", { target: o });
	}
	if (!r) return e("devices.action.no_plan");
	let s = t.mode === "simulation" ? e("devices.action.would") : "";
	if (r.run) return `${s}${n.kind === "target" ? e("devices.action.plan_target", {
		start: k(r.start),
		target: o
	}) : e("devices.action.plan_run", {
		start: k(r.start),
		end: k(r.end)
	})}`;
	let c = r.reasons[r.reasons.length - 1] ?? "manual_only";
	return e.optional(`devices.action.why.${c}`, {
		kwh: i(e.lang, t.plan?.meta?.tomorrow_kwh ?? 0, 0),
		temperature: i(e.lang, r.temperature ?? 0, 0)
	}) ?? c;
}
p("joe-action-steer", cn), p("joe-action-delete", ln), p("joe-action-tonight", un);
//#endregion
//#region src/editors/action-editor.ts
var z = class extends o {
	constructor(...e) {
		super(...e), this.prefix = E, this.actionId = "", this.section = "", this.consumer = "", this.subtitle = "", this.found = "", this.saving = !1, this.problem = "", this.touched = !1, this.focused = !1;
	}
	static {
		this.styles = [
			f,
			Mt,
			S`
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
		return this.actionId.startsWith("new:") ? ot(this.actionId.slice(4)) : this.openLayout ?? "night";
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
				let e = rt(this.actionId.slice(4), this.t), [t, n] = this.found.split(/:(.*)/s), r = this.config?.actions ?? [], i = (this.discovery?.wallboxes ?? []).filter((e) => e.is_car), a = t === "wallbox" ? i.find((e) => (e.device_id ?? e.name) === n) : i.find((e) => !r.some((t) => t.id === `ev_${e.device_id}` || e.mode_entity && t.entity_id === e.mode_entity));
				this.actionId === "new:ev" && a && Object.assign(e, it(a));
				let o = t === "car" ? this.discovery?.cars?.find((e) => e.device_id === n) : void 0;
				o && (e.name = o.name);
				let s = this.config?.consumers.filter((e) => e.kind === "hot_water") ?? [];
				this.actionId === "new:hot_water" && s.length === 1 && (e.consumer_id = s[0].id);
				let c = this.config?.consumers.find((e) => e.id === this.consumer);
				c && (e.name = c.name, e.consumer_id = c.id, e.power_entity = c.power_entity ?? null), this.draft = e, this.section === "need" && Ct(this), o && this.actionId === "new:ev" && St(this, {
					enabled: !0,
					...at(o, this.draft.need ?? et)
				}), this.touched = !1;
			} else if (this.existing) {
				this.draft = structuredClone(this.existing);
				let e = this.config?.consumers.find((e) => e.id === this.existing?.consumer_id);
				this.openLayout = ot(Vt(this.existing, e)), (this.section === "calendars" || this.section === "need") && !this.draft.need?.enabled && Ct(this);
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
		if (!e || !t || !n) return u;
		let r = this.existing, i = e(r ? "action.title" : `action.title.${this.actionId.slice(4)}`);
		return l`<div class="sheet-title">${c(i)}</div>
      ${this.subtitle ? l`<p class="sheet-sub">${this.subtitle}</p>` : u}
      ${Et(this, this.layout, { calendars: !0 })}
      ${this.problem ? l`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.problem}</span></div>` : u}
      <div class="actions">
        <span data-tipped class="row">
          <button type="button" class="btn btn-primary" ?disabled=${this.saving} @click=${this.save}>${e("common.save")}</button>
          ${O(e, "a_save")}
        </span>
        <button type="button" class="btn btn-ghost" data-notip @click=${this.close}>${e("common.cancel")}</button>
      </div>
      ${r ? l`<div class="danger-zone">
            <joe-action-delete .t=${e} .config=${this.config} .action=${r} @joe-deleted=${this.close}></joe-action-delete>
          </div>` : u}`;
	}
	async save() {
		let e = this.draft;
		if (!e || (this.problem = st(this.t, e, this.layout), this.problem)) return;
		let { id: t, ...n } = e;
		this.saving = !0;
		let r = await P(this, { actions: { [t]: n } });
		this.saving = !1, r && this.close();
	}
	close() {
		this.dispatchEvent(new CustomEvent("joe-close", {
			bubbles: !0,
			composed: !0
		}));
	}
};
w([b({ attribute: !1 })], z.prototype, "hass", void 0), w([b({ attribute: !1 })], z.prototype, "mailboxes", void 0), w([b({ attribute: !1 })], z.prototype, "accounts", void 0), w([b({ attribute: !1 })], z.prototype, "apps", void 0), w([b({ attribute: !1 })], z.prototype, "t", void 0), w([b({ attribute: !1 })], z.prototype, "config", void 0), w([b({ attribute: !1 })], z.prototype, "discovery", void 0), w([b({ attribute: !1 })], z.prototype, "prefix", void 0), w([b()], z.prototype, "actionId", void 0), w([b()], z.prototype, "section", void 0), w([b()], z.prototype, "consumer", void 0), w([b()], z.prototype, "subtitle", void 0), w([b()], z.prototype, "found", void 0), w([y()], z.prototype, "draft", void 0), w([y()], z.prototype, "saving", void 0), w([y()], z.prototype, "problem", void 0), p("joe-action-editor", z);
//#endregion
//#region src/components/look-back.ts
function fn(e, t, n = "EUR", r = !1) {
	return new Intl.NumberFormat(e.lang, {
		style: "currency",
		currency: n,
		signDisplay: r ? "exceptZero" : "auto"
	}).format(Math.abs(t) < .005 ? 0 : t);
}
function B(e, t, n = 1) {
	return new Intl.NumberFormat(e, {
		minimumFractionDigits: n,
		maximumFractionDigits: n
	}).format(t);
}
function pn(e, t = "EUR") {
	return new Intl.NumberFormat(e, {
		style: "currency",
		currency: t
	}).formatToParts(0).find((e) => e.type === "currency")?.value ?? t;
}
function mn(e) {
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
function V(e, t, n = "long") {
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
function hn(e, t) {
	return t === 1 ? e("learn.nights.one") : e("learn.nights.many", { count: t });
}
//#endregion
//#region src/pages/devices/battery-fields.ts
var gn = [
	"name",
	"capacity_kwh",
	"soc_entity",
	"power",
	"max_charge_w",
	"max_discharge_w",
	"floor_soc",
	"priority"
], _n = class extends o {
	constructor(...e) {
		super(...e), this.show = "all";
	}
	static {
		this.styles = [f, S`
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
		return this.draft ? this.draft : e ? Object.fromEntries(gn.map((t) => [t, e[t]])) : void 0;
	}
	get capacityUnknown() {
		let e = this.battery;
		return this.unknown === void 0 ? !!(e && this.config?.answers[`capacity:${e.id}`] === "unknown") : this.unknown;
	}
	render() {
		let { t: e, hass: t, config: n, battery: r } = this, i = this.values;
		if (!e || !t || !n || !r || !i) return u;
		let a = this.show !== "power", o = this.show !== "steer";
		return l`${a ? this.renderName(e, r, i) : u} ${a ? this.renderCapacity(e, r, i) : u}
    ${o ? this.renderSensors(e, r, i) : u} ${a ? this.renderLimits(e, r, i) : u}`;
	}
	renderName(e, t, n) {
		return this.field(e("f.battery.name"), "f_battery_name", l`<input
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
		let r = this.hass, a = this.config, o = this.capacityUnknown, s = _(r, t.capacity_entity), c = a.learned?.battery_models?.[t.id];
		return this.field(e("f.battery.capacity"), "q_capacity", l`<div class="field-row">
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
              placeholder=${s == null ? e("f.unknown") : i(e.lang, s, 2)}
              @change=${(e) => {
			let t = Number.parseFloat(e.target.value.replace(",", "."));
			this.change({ capacity_kwh: Number.isFinite(t) && t > 0 ? t : null }, !1);
		}}
            />
            <span class="unit">kWh</span>
          </span>
          <button
            type="button"
            class="mini-btn ${o ? "go" : ""}"
            aria-pressed=${String(o)}
            @click=${() => o ? this.change({}, !1) : this.change({ capacity_kwh: null }, !0)}
          >
            ${e("ask.idk_learn")}
          </button>
        </div>
        ${s == null ? u : l`<p class="field-hint">${e("f.battery.capacity.read", { value: i(e.lang, s, 2) })}</p>`}
        ${c ? l`<p class="field-hint learned">
              ${A(e, { source: "learned" })}
              ${e("battery.page.capacity.learned", { value: B(e.lang, c.capacity_kwh, 1) })}
            </p>` : o ? l`<p class="field-hint">${e("battery.page.capacity.learning")}</p>` : u}`, A(e, j(a, `batteries[${t.id}].capacity_kwh`)));
	}
	renderSensors(e, t, n) {
		let i = this.hass, a = this.config;
		return l`${this.field(e("f.battery.soc"), "f_battery_soc", this.entityBox(e, n.soc_entity, r(i, n.soc_entity, e.lang), () => this.pickSoc(n)), A(e, j(a, `batteries[${t.id}].soc_entity`)))}
    ${this.field(e("f.battery.power"), "f_battery_power", this.entityBox(e, n.power?.entity_id ?? null, this.powerText(e, n.power), () => this.pickPower(n)), A(e, j(a, `batteries[${t.id}].power`)))}`;
	}
	renderLimits(e, t, n) {
		let r = this.config, a = this.floor;
		return l`${this.field(e("f.battery.limits"), "f_battery_limits", l`<div class="limits">
        <label>${e("f.battery.max_charge")} ${this.kwInput(e, n.max_charge_w, "max_charge_w")}</label>
        <label>${e("f.battery.max_discharge")} ${this.kwInput(e, n.max_discharge_w, "max_discharge_w")}</label>
      </div>`)}
    ${this.field(e("f.battery.floor"), "f_battery_floor", l`<span class="unit-input">
          <input
            class="input"
            type="number"
            inputmode="decimal"
            min="0"
            max="100"
            step="1"
            aria-label=${e("f.battery.floor")}
            .value=${n.floor_soc == null ? "" : String(n.floor_soc)}
            placeholder=${a?.device == null ? e("f.unknown") : i(e.lang, a.device, 0)}
            @change=${(e) => {
			let t = Number.parseFloat(e.target.value.replace(",", "."));
			this.change({ floor_soc: Number.isFinite(t) ? Math.min(100, Math.max(0, t)) : null });
		}}
          />
          <span class="unit">%</span>
        </span>
        ${a?.device == null ? n.floor_soc == null ? l`<div class="note warn"><ha-icon icon="mdi:help-circle-outline"></ha-icon><span>${e("f.battery.floor.ask")}</span></div>` : u : l`<p class="field-hint">${e("f.battery.floor.read", { value: i(e.lang, a.device, 0) })}</p>`}`, A(e, j(r, `batteries[${t.id}].floor_soc`)))}
    ${r.batteries.length > 1 ? this.field(e("f.battery.priority"), "f_battery_priority", l`<span class="unit-input">
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
          </span>`) : u}`;
	}
	field(e, t, n, r) {
		let i = this.t;
		return l`<div class="field" data-tipped>
      <div class="field-label">${e} ${O(i, t)} ${r ?? u}</div>
      ${n}
    </div>`;
	}
	entityBox(e, t, r, i) {
		let a = this.hass;
		return l`<div class="entity">
      <span>
        ${t ? l`<b>${n(a, t)}</b><small>${r}</small>` : l`<small>${e("find.none")}</small>`}
      </span>
      <button type="button" class="mini-btn" @click=${i}>
        <ha-icon icon="mdi:magnify"></ha-icon>${e(t ? "review.change" : "review.choose")}
      </button>
    </div>`;
	}
	kwInput(e, t, n) {
		return l`<span class="unit-input">
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
		let n = this.hass, a = m(n, t);
		if (!t || a === null) return t ? r(n, t.entity_id, e.lang) : "";
		let o = i(e.lang, Math.abs(a), 2);
		return e(a >= 0 ? "pick.preview.charge" : "pick.preview.discharge", { value: o });
	}
	async pickSoc(e) {
		let t = this.t, n = (await F(this, {
			heading: t("pick.battery.title"),
			tip: "pick_battery",
			filter: "soc",
			selected: [e.soc_entity]
		}))?.selected[0];
		n && n !== e.soc_entity && this.change({ soc_entity: n });
	}
	async pickPower(e) {
		let t = this.t, n = await F(this, {
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
		Object.keys(a).length && (o.batteries = { [n.id]: a }), i !== void 0 && (o.answers = { [`capacity:${n.id}`]: i ? "unknown" : null }), Object.keys(o).length && P(this, o);
	}
};
w([b({ attribute: !1 })], _n.prototype, "hass", void 0), w([b({ attribute: !1 })], _n.prototype, "t", void 0), w([b({ attribute: !1 })], _n.prototype, "config", void 0), w([b({ attribute: !1 })], _n.prototype, "battery", void 0), w([b({ attribute: !1 })], _n.prototype, "floor", void 0), w([b({ attribute: !1 })], _n.prototype, "draft", void 0), w([b({ attribute: !1 })], _n.prototype, "unknown", void 0), w([b()], _n.prototype, "show", void 0), p("joe-battery-fields", _n);
//#endregion
//#region src/types.ts
var vn = [
	"welcome",
	"scan",
	"questions",
	"done"
], yn = [
	"min_soc",
	"grid_charge",
	"charge_target",
	"mode",
	"charge_power",
	"discharge_power",
	"discharge_limit",
	"discharge_limit_enabled"
], bn = [
	"normal",
	"force_charge",
	"hold",
	"force_discharge"
], xn = [
	"home_office",
	"office",
	"travel",
	"vacation",
	"guests",
	"home"
], Sn = [
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
function Cn(e) {
	let t = e.filter((e) => e.kind !== "submeter" && (e.kind === "ev" && (e.runs ?? "auto") !== "always" || e.runs === "surplus" || e.runs === "cheap")), n = new Set(t.map((e) => e.energy_entity).filter(Boolean));
	return t.filter((e) => !e.included_in || !n.has(e.included_in));
}
var wn = [
	"forecast",
	"consumption",
	"battery",
	"hot_water",
	"car"
], Tn = [
	"normal",
	"holiday",
	"away",
	"home_office"
], En = ["heat", "cool"], Dn = {
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
}, On = [
	"charge",
	"hold",
	"release"
];
function kn(e) {
	let t = (...t) => t.every((t) => !!e.controls[t]), n = (t) => !!e.mode_options[t], r = [];
	t("mode") && n("force_charge") && r.push("mode"), t("grid_charge", "charge_target") && r.push("target"), t("grid_charge", "min_soc") && r.push("min_soc");
	let i = [];
	return t("min_soc") && i.push("min_soc"), t("mode") && n("hold") && i.push("mode_hold"), t("mode", "charge_power") && n("force_charge") && i.push("standby"), t("discharge_limit") && i.push("limit"), {
		charge: r,
		hold: i
	};
}
function An(e) {
	return {
		adapter: e.adapter,
		controls: structuredClone(e.controls),
		mode_options: structuredClone(e.mode_options),
		steps: structuredClone(e.steps)
	};
}
function jn(e, t, n) {
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
var Mn = class extends o {
	static {
		this.styles = [f, S`
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
		if (!e || !t) return u;
		let n = [
			"watch",
			...this.profileKey ? ["profile"] : [],
			"generic",
			"steps"
		], r = this.found?.suggested;
		return l`<div class="choose">
        <div class="seg" role="group" aria-label=${e("f.battery.control")}>
          ${n.map((t) => l`<button type="button" aria-pressed=${String(this.choice === t)} @click=${() => this.choose(t)}>
                ${t === "profile" ? e("f.battery.control.profile", { name: this.profiles?.[this.profileKey ?? ""] ?? this.profileKey ?? "" }) : e(`f.battery.control.${t}`)}
              </button>`)}
        </div>
      </div>
      ${this.choice === "watch" && r?.complete ? l`<div class="note" data-tipped>
            <ha-icon icon="mdi:lightbulb-on-outline"></ha-icon>
            <span
              >${e("f.battery.control.suggested")}
              <div class="note-actions">
                <button type="button" class="mini-btn go" @click=${this.takeSuggestion}>${e("f.battery.control.take")}</button>
                ${O(e, "control_roles")}
              </div></span
            >
          </div>` : u}
      ${this.choice === "profile" && Object.keys(t.steps).length && !Object.keys(t.controls).length ? this.renderServiceSteps(e, t) : this.choice === "profile" || this.choice === "generic" ? this.renderRoles(e, t) : u}
      ${this.choice === "steps" ? this.renderSteps(e, t) : u}
      ${this.choice === "watch" ? u : l`<p class="field-hint">${e("f.battery.control.retest")}</p>`}`;
	}
	renderRoles(e, t) {
		let i = this.hass, a = kn(t), o = a.charge.length && a.hold.length, s = t.controls.mode, c = s ? i.states[s]?.attributes.options ?? [] : [];
		return l`<div data-tipped>
      <div class="sub">${e("f.battery.control.levers")} ${O(e, "control_roles")}</div>
      <div class="rows">
        ${yn.map((a) => {
			let o = t.controls[a];
			return l`<div class="row">
            <span class="label">${e(`role.${a}`)}</span>
            <span class="entity">
              ${o ? l`<b>${n(i, o)}</b><small>${r(i, o, e.lang)}</small>` : l`<small>${e("find.none")}</small>`}
            </span>
            <span class="buttons">
              <button type="button" class="mini-btn" @click=${() => this.pickRole(a)}>
                <ha-icon icon="mdi:magnify"></ha-icon>${e(o ? "review.change" : "review.choose")}
              </button>
              ${o ? l`<button
                    type="button"
                    class="icon-btn"
                    aria-label=${e("f.remove")}
                    title=${e("f.remove")}
                    @click=${() => this.setRole(a, null)}
                  >
                    <ha-icon icon="mdi:close"></ha-icon>
                  </button>` : u}
            </span>
          </div>`;
		})}
      </div>
      </div>
      ${s ? l`<div data-tipped>
            <div class="sub">${e("f.battery.mode_options")} ${O(e, "mode_options")}</div>
            <div class="rows">
              ${bn.map((n) => l`<div class="row">
                  <label for="opt-${n}">${e(`meaning.${n}`)}</label>
                  <select
                    id="opt-${n}"
                    class="input"
                    @change=${(e) => this.setOption(n, e.target.value)}
                  >
                    <option value="" ?selected=${!t.mode_options[n]}>${e("meaning.none")}</option>
                    ${c.map((e) => l`<option value=${e} ?selected=${t.mode_options[n] === e}>${e}</option>`)}
                  </select>
                  <span></span>
                </div>`)}
            </div>
            </div>` : u}
      <div class="note ${o ? "" : "warn"} ready">
        <ha-icon icon=${o ? "mdi:check-circle-outline" : "mdi:alert-outline"}></ha-icon>
        <span
          >${o ? e("f.battery.control.ready", {
			charge: a.charge.map((t) => e(`method.${t}`)).join(", "),
			hold: a.hold.map((t) => e(`method.${t}`)).join(", ")
		}) : e("f.battery.control.needs")}</span
        >
      </div>`;
	}
	renderServiceSteps(e, t) {
		let r = this.hass;
		return l`<div data-tipped>
      <div class="sub">${e("f.battery.control.services")} ${O(e, "control_steps")}</div>
      <div class="rows">
        ${On.flatMap((i) => (t.steps[i] ?? []).map((t) => l`<div class="row">
              <span class="label">${e(`f.battery.steps.${i}`)}</span>
              <span class="entity">
                ${t.service ? l`<b>${t.service}</b>` : l`<b>${n(r, t.entity_id ?? "")}</b><small>${String(t.value ?? "")}</small>`}
              </span>
              <span></span>
            </div>`))}
      </div>
    </div>`;
	}
	renderSteps(e, t) {
		let r = this.hass;
		return l`<div class="sub" data-tipped>${e("f.battery.control.steps")} ${O(e, "control_steps")}</div>
      <p class="field-hint">${e("f.battery.steps.hint")}</p>
      ${On.map((i) => {
			let a = t.steps[i] ?? [];
			return l`<div class="sub">${e(`f.battery.steps.${i}`)}</div>
          <div class="rows" data-tipped>
            ${a.map((t, a) => l`<div class="row">
                <span class="entity"
                  ><b>${t.service ?? n(r, t.entity_id ?? "")}</b><small>${t.entity_id ?? ""}</small></span
                >
                <input
                  class="input step-value"
                  type="text"
                  aria-label=${e("f.battery.steps.value")}
                  placeholder=${e("f.battery.steps.value")}
                  list="values-${i}-${a}"
                  .value=${t.value == null ? "" : String(t.value)}
                  @change=${(e) => this.setStep(i, a, e.target.value)}
                />
                <datalist id="values-${i}-${a}">
                  ${this.valueHints(t.entity_id ?? "", i).map((e) => l`<option value=${e}></option>`)}
                </datalist>
                <button
                  type="button"
                  class="icon-btn"
                  aria-label=${e("f.remove")}
                  title=${e("f.remove")}
                  @click=${() => this.removeStep(i, a)}
                >
                  <ha-icon icon="mdi:close"></ha-icon>
                </button>
              </div>`)}
            <div>
              <button type="button" class="mini-btn" @click=${() => this.addStep(i)}>
                <ha-icon icon="mdi:plus"></ha-icon>${e("f.battery.steps.add")}
              </button>
              ${O(e, "control_steps")}
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
		let t = this.t, n = this.value.controls[e], r = await F(this, {
			heading: t("pick.role.title", { role: t(`role.${e}`) }),
			tip: "control_roles",
			filter: Dn[e],
			selected: n ? [n] : [],
			suggestions: this.nearby(Dn[e]).map((e) => ({ entity_id: e }))
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
		let t = this.t, n = (await F(this, {
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
w([b({ attribute: !1 })], Mn.prototype, "hass", void 0), w([b({ attribute: !1 })], Mn.prototype, "t", void 0), w([b({ attribute: !1 })], Mn.prototype, "battery", void 0), w([b({ attribute: !1 })], Mn.prototype, "found", void 0), w([b({ attribute: !1 })], Mn.prototype, "value", void 0), w([b({ attribute: !1 })], Mn.prototype, "profiles", void 0), p("joe-battery-control", Mn);
//#endregion
//#region src/editors/battery-editor.ts
var Nn = [
	"adapter",
	"controls",
	"mode_options",
	"steps",
	"prepare"
], H = class extends o {
	constructor(...e) {
		super(...e), this.batteryId = "", this.unknown = !1, this.saving = !1;
	}
	static {
		this.styles = [f, S`
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
		(e.has("config") || e.has("batteryId")) && t && !this.values && (this.values = Object.fromEntries(gn.map((e) => [e, structuredClone(t[e])])), this.control = {
			...An(t),
			prepare: structuredClone(t.prepare)
		}, this.unknown = this.config?.answers[`capacity:${t.id}`] === "unknown");
	}
	render() {
		let { t: e, hass: t, config: n, values: r, control: i } = this, a = this.battery;
		if (!e || !t || !n || !r || !i || !a) return u;
		let o = this.discovery?.batteries.find((e) => e.id === a.id);
		return l`<div class="sheet-title">${c(e("edit.battery.title", { name: a.name }))}</div>
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
        <div class="field-label">${e("f.battery.control")} ${O(e, "control_choice")}</div>
        <joe-battery-control
          .hass=${t}
          .t=${e}
          .battery=${a}
          .found=${o}
          .profiles=${this.info?.profiles}
          .value=${i}
          @joe-control-change=${(e) => {
			this.control = jn(a, e.detail, o);
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
		for (let t of [...gn, ...Nn]) JSON.stringify(e[t] ?? null) !== JSON.stringify(i[t] ?? null) && (a[t] = i[t]);
		let o = `capacity:${e.id}`, s = {};
		if (Object.keys(a).length && (s.batteries = { [e.id]: a }), t.answers[o] === "unknown" !== this.unknown && (s.answers = { [o]: this.unknown ? "unknown" : null }), Object.keys(s).length) {
			this.saving = !0;
			let e = await P(this, s);
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
w([b({ attribute: !1 })], H.prototype, "hass", void 0), w([b({ attribute: !1 })], H.prototype, "t", void 0), w([b({ attribute: !1 })], H.prototype, "config", void 0), w([b({ attribute: !1 })], H.prototype, "discovery", void 0), w([b({ attribute: !1 })], H.prototype, "info", void 0), w([b({ attribute: !1 })], H.prototype, "floor", void 0), w([b()], H.prototype, "batteryId", void 0), w([y()], H.prototype, "values", void 0), w([y()], H.prototype, "control", void 0), w([y()], H.prototype, "unknown", void 0), w([y()], H.prototype, "saving", void 0), p("joe-battery-editor", H);
//#endregion
//#region src/fonts.ts
var Pn = [
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
function Fn() {
	if (document.getElementById("energy-joe-fonts")) return;
	let e = document.createElement("style");
	e.id = "energy-joe-fonts", e.textContent = Pn.map(([e, t, n, r]) => `@font-face{font-family:"${e}";font-style:${n};font-weight:${t};font-display:swap;src:url("${xe(`fonts/${r}.woff2`)}") format("woff2")}`).join("\n"), document.head.appendChild(e);
}
//#endregion
//#region node_modules/lit-html/directive-helpers.js
var { I: In } = te, Ln = (e) => e, Rn = (e) => e.strings === void 0, zn = () => document.createComment(""), Bn = (e, t, n) => {
	let r = e._$AA.parentNode, i = t === void 0 ? e._$AB : t._$AA;
	if (n === void 0) n = new In(r.insertBefore(zn(), i), r.insertBefore(zn(), i), e, e.options);
	else {
		let t = n._$AB.nextSibling, a = n._$AM, o = a !== e;
		if (o) {
			let t;
			n._$AQ?.(e), n._$AM = e, n._$AP !== void 0 && (t = e._$AU) !== a._$AU && n._$AP(t);
		}
		if (t !== i || o) {
			let e = n._$AA;
			for (; e !== t;) {
				let t = Ln(e).nextSibling;
				Ln(r).insertBefore(e, i), e = t;
			}
		}
	}
	return n;
}, Vn = (e, t, n = e) => (e._$AI(t, n), e), Hn = {}, Un = (e, t = Hn) => e._$AH = t, Wn = (e) => e._$AH, Gn = (e) => {
	e._$AR(), e._$AA.remove();
}, Kn = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, qn = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), Jn = class {
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
}, Yn = (e, t) => {
	let n = e._$AN;
	if (n === void 0) return !1;
	for (let e of n) e._$AO?.(t, !1), Yn(e, t);
	return !0;
}, Xn = (e) => {
	let t, n;
	do {
		if ((t = e._$AM) === void 0) break;
		n = t._$AN, n.delete(e), e = t;
	} while (n?.size === 0);
}, Zn = (e) => {
	for (let t; t = e._$AM; e = t) {
		let n = t._$AN;
		if (n === void 0) t._$AN = n = /* @__PURE__ */ new Set();
		else if (n.has(e)) break;
		n.add(e), er(t);
	}
};
function Qn(e) {
	this._$AN === void 0 ? this._$AM = e : (Xn(this), this._$AM = e, Zn(this));
}
function $n(e, t = !1, n = 0) {
	let r = this._$AH, i = this._$AN;
	if (i !== void 0 && i.size !== 0) {
		if (t) {
			if (Array.isArray(r)) for (let e = n; e < r.length; e++) Yn(r[e], !1), Xn(r[e]);
			else r != null && (Yn(r, !1), Xn(r));
		} else Yn(this, e);
	}
}
var er = (e) => {
	e.type == Kn.CHILD && (e._$AP ??= $n, e._$AQ ??= Qn);
}, tr = class extends Jn {
	constructor() {
		super(...arguments), this._$AN = void 0;
	}
	_$AT(e, t, n) {
		super._$AT(e, t, n), Zn(this), this.isConnected = e._$AU;
	}
	_$AO(e, t = !0) {
		e !== this.isConnected && (this.isConnected = e, e ? this.reconnected?.() : this.disconnected?.()), t && (Yn(this, e), Xn(this));
	}
	setValue(e) {
		if (Rn(this._$Ct)) this._$Ct._$AI(e, this);
		else {
			let t = [...this._$Ct._$AH];
			t[this._$Ci] = e, this._$Ct._$AI(t, this, 0);
		}
	}
	disconnected() {}
	reconnected() {}
}, nr = /* @__PURE__ */ new WeakMap(), rr = qn(class extends tr {
	render(e) {
		return u;
	}
	update(e, [t]) {
		let n = t !== this.G;
		return n && this.rt(void 0), (n || this.lt !== this.ct) && (this.G = t, this.ht = e.options?.host, this.rt(this.ct = e.element)), u;
	}
	rt(e) {
		if (this.G !== void 0) {
			if (this.isConnected || (e = void 0), typeof this.G == "function") {
				let t = this.ht ?? globalThis, n = nr.get(t);
				n === void 0 && (n = /* @__PURE__ */ new WeakMap(), nr.set(t, n)), n.get(this.G) !== void 0 && this.G.call(this.ht, void 0), n.set(this.G, e), e !== void 0 && this.G.call(this.ht, e);
			} else this.G.value = e;
		}
	}
	get lt() {
		return typeof this.G == "function" ? nr.get(this.ht ?? globalThis)?.get(this.G) : this.G?.value;
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
function ir(e) {
	e instanceof HTMLElement && requestAnimationFrame(() => {
		let t = e.parentElement;
		if (!t || t.scrollWidth <= t.clientWidth) return;
		let n = e.offsetLeft;
		(n < t.scrollLeft || n + e.offsetWidth > t.scrollLeft + t.clientWidth) && (t.scrollLeft = n - (t.clientWidth - e.offsetWidth) / 2);
	});
}
function ar() {}
var or = /* @__PURE__ */ new WeakSet();
function sr(e) {
	if (!(e instanceof HTMLElement)) return;
	let t = () => {
		let t = [];
		e.scrollLeft > 4 && t.push("left"), e.scrollLeft + e.clientWidth < e.scrollWidth - 4 && t.push("right"), e.dataset.more = t.join(" ");
	};
	or.has(e) || (or.add(e), e.addEventListener("scroll", t, { passive: !0 }), new ResizeObserver(t).observe(e)), requestAnimationFrame(() => requestAnimationFrame(t));
}
function cr(e, t, n, r, i) {
	return l`<nav class="section-chips" aria-label=${e("nav.sections")} ${rr(sr)}>
    ${r.map((e) => {
		let r = e.id === i, a = {
			tab: n,
			section: e.id
		};
		return l`<a
        class="section-chip ${r ? "on" : ""}"
        href=${T(t, a)}
        aria-current=${r ? "page" : "false"}
        @click=${C(a)}
        ${rr(r ? ir : ar)}
      >
        <ha-icon icon=${e.icon}></ha-icon>
        <span>${e.label}</span>
        ${e.count ? l`<span class="section-count">${e.count}</span>` : u}
        ${e.problem ? l`<i class="section-problem" aria-hidden="true"></i>` : u}
      </a>`;
	})}
  </nav>`;
}
//#endregion
//#region node_modules/lit-html/directives/keyed.js
var lr = qn(class extends Jn {
	constructor() {
		super(...arguments), this.key = u;
	}
	render(e, t) {
		return this.key = e, t;
	}
	update(e, [t, n]) {
		return t !== this.key && (Un(e), this.key = t), n;
	}
});
//#endregion
//#region src/pages/devices/device-actions.ts
async function ur(e, t, n) {
	return await P(e, {
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
		answers: { ignored: N(t, `battery:${n.id}`, !1) }
	}, "read") ? n.id : null;
}
async function dr(e, t, r, i) {
	let a = (await F(e, {
		heading: t("pick.battery.title"),
		tip: "pick_battery",
		filter: "soc",
		selected: [],
		exclude: i.batteries.map((e) => e.soc_entity)
	}))?.selected[0];
	if (!a) return null;
	let o = r.entities?.[a]?.device_id, s = o && !i.batteries.some((e) => e.id === o) ? o : a;
	return await P(e, { batteries: { [s]: {
		name: o && (r.devices?.[o]?.name_by_user || r.devices?.[o]?.name) || n(r, a),
		adapter: "none",
		soc_entity: a,
		device_id: o ?? null,
		priority: Math.min(i.batteries.length + 1, 9)
	} } }) ? s : null;
}
function fr(e, t, n) {
	return P(e, { answers: { ignored: N(t, n, !0) } });
}
//#endregion
//#region src/components/ha-open.ts
function pr(e, t, n) {
	return {
		deviceId: t ? e?.entities?.[t]?.device_id ?? null : null,
		entityId: t ?? null,
		name: n
	};
}
function U(e, t) {
	let { deviceId: n, entityId: r, name: i } = t;
	if (n) {
		let t = `/config/devices/device/${n}`, r = e("ha.open.device", { name: i });
		return l`<a
      class="ha-open"
      data-notip
      href=${t}
      title=${r}
      aria-label=${r}
      @click=${(e) => {
			e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0 || (e.preventDefault(), d(t));
		}}
      ><ha-icon icon="mdi:open-in-new"></ha-icon
    ></a>`;
	}
	if (r) {
		let t = e("ha.open.entity", { name: i });
		return l`<button
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
	return u;
}
//#endregion
//#region src/components/device-card.ts
function mr(e, t, n) {
	return l`<article class="dcard ${n.problem ? "problem" : ""}">
    <a class="dcard-main" href=${T(t, n.to)} @click=${C(n.to, n.sheet ? { sheet: !0 } : void 0)}>
      <ha-icon icon=${n.icon}></ha-icon>
      <span class="dcard-text">
        <span class="dcard-name"
          >${n.name}${n.problem ? l`<i class="dcard-dot" aria-hidden="true"></i>` : u}</span
        >
        ${n.area ? l`<span class="dcard-area">${n.area}</span>` : u}
        ${n.state ? l`<span class="dcard-state">${n.state}</span>` : u}
        ${n.problem ? l`<span class="dcard-problem">${n.problem}</span>` : u}
        ${n.role ? l`<span class="dcard-meta"><span class="chip">${e(`devices.role.${n.role}`)}</span></span>` : u}
      </span>
    </a>
    ${U(e, n.ha)}
    ${n.quick ? l`<div class="dcard-quick">${n.quick}</div>` : u}
  </article>`;
}
function hr(e, t) {
	return t === null ? void 0 : e("devices.card.kw", { value: i(e.lang, t, t >= 10 ? 1 : 2) });
}
function gr(t, n, r, a) {
	if (!n) return;
	if (a.unassigned) return t(a.deviceId ? "devices.card.unassigned" : "devices.card.unassigned_kind");
	if (a.setup) return t(a.setup === "car" ? "devices.card.setup_car" : "devices.card.setup_hot_water");
	if (a.battery) {
		let e = ue(n, a.battery.soc_entity), r = m(n, a.battery.power), o = [e === null ? null : `${i(t.lang, e, 0)} %`];
		return r !== null && o.push(Math.abs(r) < .05 ? t("devices.power.idle") : t(r > 0 ? "devices.power.charge" : "devices.power.discharge", { value: i(t.lang, Math.abs(r), 2) })), o.filter(Boolean).join(" · ") || void 0;
	}
	if (a.group === "climate") {
		let e = a.entityId ? n.states[a.entityId]?.attributes : void 0, r = a.climate?.current_temperature ?? (typeof e?.current_temperature == "number" ? e.current_temperature : null), o = a.climate?.temperature ?? (typeof e?.temperature == "number" ? e.temperature : null);
		return r !== null && o !== null ? t("devices.card.climate", {
			current: i(t.lang, r, 1),
			target: i(t.lang, o, 1)
		}) : r === null ? void 0 : t("devices.card.temp", { value: i(t.lang, r, 1) });
	}
	if (a.part) {
		let o = r?.config.measurements;
		if (a.part === "connection") {
			let e = m(n, o?.grid_power);
			if (e === null) return;
			let r = i(t.lang, Math.abs(e), 2);
			return t(e >= 0 ? "devices.card.import" : "devices.card.export", { value: r });
		}
		return hr(t, a.part === "solar" ? e(n, o?.solar_power ?? []) : m(n, o?.home_power));
	}
	let o = a.action;
	if (o && r?.control?.actions?.[o.id]?.on) return t("devices.card.running");
	if (a.group === "car" && o?.need) {
		let e = ue(n, o.need.soc_entity), r = ue(n, o.need.range_entity);
		return [e === null ? null : `${i(t.lang, e, 0)} %`, r === null ? null : `${i(t.lang, r, 0)} km`].filter(Boolean).join(" · ") || void 0;
	}
	if (a.group === "hot_water" && o?.sensor_entity) {
		let e = ue(n, o.sensor_entity);
		return e === null ? void 0 : t("devices.card.temp", { value: i(t.lang, e, 0) });
	}
	let s = a.consumer?.power_entity ?? o?.power_entity;
	if (s) {
		let e = n.states[s]?.attributes.unit_of_measurement, r = ue(n, s);
		return hr(t, r === null ? null : e === "W" ? r / 1e3 : r);
	}
	return a.noMeter ? t("devices.no_meter_group") : void 0;
}
function _r(e, t, n, r, i = {}) {
	return {
		name: r.name,
		area: r.area,
		icon: r.icon,
		state: gr(e, t, n, r),
		role: r.unassigned || r.setup ? void 0 : r.role,
		problem: r.problem,
		to: r.setup ? Wt(r.setup, r.id) : Ut(r),
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
var vr = [
	"all",
	"battery",
	"climate",
	"car",
	"hot_water",
	"other",
	"joe"
];
function yr(e = [], t = []) {
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
function br(e, t) {
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
		let i = Ht(e, r);
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
function xr(e, t, r, i, a) {
	if (i === "climate") return r[a] ?? (t ? n(t, a) : a);
	if (i === "battery") return e?.batteries.find((e) => e.id === a)?.name ?? a;
	let o = a.startsWith("action-") ? a.slice(7) : a;
	return e?.actions.find((e) => e.id === o)?.name ?? e?.consumers.find((e) => e.id === a)?.name ?? a;
}
function Sr(e, t, r, a) {
	let o = {
		battery: t?.batteries.find((e) => e.id === r.battery)?.name ?? t?.actions.find((e) => `action:${e.id}` === r.battery)?.name ?? r.battery ?? "",
		entity: r.entity ? a ? n(a, r.entity) : r.entity : "",
		value: r.value == null ? "–" : String(r.value),
		target: String(r.target ?? ""),
		power: typeof r.power == "number" ? i(e.lang, r.power, 1) : "–",
		soc: typeof r.soc == "number" ? i(e.lang, r.soc, 0) : "–",
		unit: typeof r.unit == "string" ? r.unit : "%"
	};
	return r.kind === "boost_end" ? e.optional(`log.boost_end.${String(r.reason)}`, o) ?? e("log.boost_end.stopped", o) : r.kind === "answer" ? e(r.yes ? "log.answer.yes" : "log.answer.no") : r.kind === "test" ? e(r.ok ? "log.test.ok" : "log.test.failed", o) : e.optional(`log.${r.kind}`, o) ?? r.kind;
}
function Cr(e, t, r, i) {
	let a = r[t.entity] ?? (i ? n(i, t.entity) : t.entity);
	return l`<b>${a}</b> · ${e.optional(`climate.log.${t.what}`) ?? t.what}`;
}
function wr(e, t, n) {
	if (!n || !n.group || n.group === "all") return !0;
	let r = br(e, t);
	return r.group === n.group && (!n.device || r.device === n.device);
}
var Tr = class extends o {
	constructor(...e) {
		super(...e), this.names = {}, this.entries = [], this.limit = Infinity;
	}
	static {
		this.styles = [f, S`
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
		if (!e) return u;
		let t = this.entries.filter((e) => wr(this.config, e, this.filter)).slice(0, this.limit);
		return t.length ? l`<ul class="log">
      ${t.map((t) => l`<li>
          <time datetime=${t.at}>${V(e.lang, t.at.slice(0, 10), "short")} ${t.at.slice(11, 16)}</time>
          <span
            >${t.area === "climate" ? Cr(e, t, this.names, this.hass) : Sr(e, this.config, t, this.hass)}</span
          >
        </li>`)}
    </ul>` : l`<p class="empty">${this.empty ?? e("past.log.empty")}</p>`;
	}
};
w([b({ attribute: !1 })], Tr.prototype, "t", void 0), w([b({ attribute: !1 })], Tr.prototype, "hass", void 0), w([b({ attribute: !1 })], Tr.prototype, "config", void 0), w([b({ attribute: !1 })], Tr.prototype, "names", void 0), w([b({ attribute: !1 })], Tr.prototype, "entries", void 0), w([b({ attribute: !1 })], Tr.prototype, "limit", void 0), w([b({ attribute: !1 })], Tr.prototype, "filter", void 0), w([b({ attribute: !1 })], Tr.prototype, "empty", void 0), p("joe-log-list", Tr);
//#endregion
//#region src/pages/devices/device-frame.ts
var Er = [
	"now",
	"steer",
	"power",
	"learned",
	"log",
	"intruders",
	"remove"
];
function Dr(e) {
	return e != null && e !== u && e !== "";
}
function Or(e, t, n) {
	let r = {
		tab: "devices",
		section: n
	};
	return l`<a class="back-link" href=${T(t, r)} @click=${C(r)}
    >${e("nav.back", { name: e(`nav.devices.${n}`) })}</a
  >`;
}
function kr(e) {
	return l`<div class="note warn" role="status">
    <ha-icon icon="mdi:help-circle-outline"></ha-icon><span>${e("nav.not_found")}</span>
  </div>`;
}
function Ar(e) {
	return yr(e?.control?.log ?? [], e?.climate?.log ?? []);
}
function jr(e, t) {
	let n = t.group === "grid" ? "joe" : t.group, r = gr(e.t, e.hass, e.state, t), i = !!(t.setup || t.unassigned || t.noMeter);
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
			entries: Ar(e.state),
			filter: {
				group: n,
				device: t.id
			}
		}
	};
}
var Mr = {
	battery: "learn_battery",
	car: "learn_car",
	hot_water: "learn_hot_water",
	devices: "learn_groups",
	climate: "learn_climate"
};
function Nr(e, t, n, r) {
	let { t: i } = e, a = t.tips?.[n] ?? (n === "learned" && t.learnedArea ? Mr[t.learnedArea] : void 0);
	return l`<section class="card dsec" data-section=${n} ?data-tipped=${!!a}>
    <h3 class="dsec-title">${n === "remove" && t.removeTitle ? t.removeTitle : i(`devices.page.${n}`)}${a ? O(i, a) : u}</h3>
    ${r}
  </section>`;
}
function Pr(e, t) {
	let n = t.log;
	if (!n || !n.entries.some((t) => wr(e.state?.config, t, n.filter))) return;
	let r = n.filter, i = {
		tab: "review",
		section: "log",
		id: r.group ?? "all",
		sub: r.group && r.group !== "all" ? r.device : void 0
	};
	return l`<joe-log-list
      .t=${e.t}
      .hass=${e.hass}
      .config=${e.state?.config}
      .names=${n.names ?? {}}
      .entries=${n.entries}
      .filter=${r}
      .limit=${n.limit ?? 5}
    ></joe-log-list>
    <a class="mini-btn quiet frame-more" href=${T(e.prefix, i)} @click=${C(i)}>${e.t("devices.page.more_log")}</a>`;
}
function Fr(e, t) {
	let { t: n, prefix: r } = e, i = {};
	for (let a of Er) {
		if (a === "log") {
			let n = Pr(e, t);
			n && (i.log = n);
			continue;
		}
		let o = t[a];
		if (!Dr(o)) continue;
		let s = {
			tab: "review",
			section: "learned",
			id: t.learnedArea
		};
		i[a] = a === "learned" && t.learnedArea ? l`${o}
            <a class="mini-btn quiet frame-more" href=${T(r, s)} @click=${C(s)}>${n("devices.page.more_learned")}</a>` : o;
	}
	return l`<div class="dframe">
    ${Or(n, r, t.group)}
    <header class="card dhead">
      <div class="dhead-top">
        <ha-icon class="dhead-icon" icon=${t.icon ?? Lt[t.group]}></ha-icon>
        <div class="dhead-text">
          <h2 class="dhead-name">${t.name}</h2>
          ${t.area ? l`<span class="dhead-area">${t.area}</span>` : u}
        </div>
        ${t.ha ? U(n, t.ha) : u}
      </div>
      ${Dr(t.live) ? l`<p class="dhead-live">${t.live}</p>` : u}
      ${Dr(t.why) ? l`<p class="dhead-why">${t.why}</p>` : u}
      ${(t.problems ?? []).map((e) => l`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e}</span></div>`)}
      ${Dr(t.head) ? t.head : u}
    </header>
    ${Er.map((n) => i[n] === void 0 ? u : Nr(e, t, n, i[n]))}
  </div>`;
}
function Ir(e, t, n, r) {
	let i = t.filter((e) => e.group === n);
	return l`<div class="dcards">
    ${i.map((t) => mr(e.t, e.prefix, _r(e.t, e.hass, e.state, t, r?.(t))))}
  </div>`;
}
function Lr(e, n, r, i = !0) {
	return l`<div class="group-intro">
    ${c(n)} ${t}
    <p class="lead">${r}</p>
    ${i ? l`<p class="ha-hint with-tip" data-tipped>${e("climate.ha_open")} ${O(e, "ha_open")}</p>` : u}
  </div>`;
}
function Rr(e, t, n, r) {
	let i = Wt(n);
	return l`<a class="btn btn-secondary add-link" href=${T(t, i)} @click=${C(i, { sheet: !0 })}
    ><ha-icon icon="mdi:plus"></ha-icon>${r ?? e("devices.add")}</a
  >`;
}
var W = S`
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
`, G = class extends o {
	constructor(...e) {
		super(...e), this.prefix = E, this.checks = [], this.devices = [];
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
w([b({ attribute: !1 })], G.prototype, "hass", void 0), w([b({ attribute: !1 })], G.prototype, "t", void 0), w([b({ attribute: !1 })], G.prototype, "state", void 0), w([b({ attribute: !1 })], G.prototype, "route", void 0), w([b({ attribute: !1 })], G.prototype, "prefix", void 0), w([b({ attribute: !1 })], G.prototype, "discovery", void 0), w([b({ attribute: !1 })], G.prototype, "info", void 0), w([b({ attribute: !1 })], G.prototype, "checks", void 0), w([b({ attribute: !1 })], G.prototype, "climateFound", void 0), w([b({ attribute: !1 })], G.prototype, "devices", void 0);
var zr = class extends G {
	constructor(...e) {
		super(...e), this.group = "other";
	}
	static {
		this.styles = [
			f,
			W,
			S`
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
		if (!e || !this.state) return u;
		let t = $t(this.devices, this.group, this.device);
		return t ? Fr(this.ctx, jr(this.ctx, t)) : l`<div class="wrap">
      ${c(e(`nav.devices.${this.group}`))} ${this.device === void 0 ? u : kr(e)}
      ${Ir(this.ctx, this.devices, this.group)}
      ${this.group === "grid" ? u : l`<div class="actions">${Rr(e, this.prefix)}</div>`}
    </div>`;
	}
};
w([b({ attribute: !1 })], zr.prototype, "device", void 0), w([b({ attribute: !1 })], zr.prototype, "sub", void 0);
//#endregion
//#region src/pages/devices/add.ts
var Br = [
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
], Vr = {
	car: "ev",
	hot_water: "hot_water",
	night: "custom"
}, Hr = {
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
}, Ur = class extends G {
	constructor(...e) {
		super(...e), this.behind = {
			tab: "devices",
			section: "all"
		}, this.busy = "";
	}
	static {
		this.styles = [f, S`
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
		let t = this.kind ? Hr[this.kind] : void 0;
		e.has("kind") && t && D(this, t, { replace: !0 });
	}
	render() {
		let e = this.t;
		return !e || !this.state || this.kind && Hr[this.kind] ? u : l`<joe-sheet
      label=${e("devices.add.label")}
      closeLabel=${e("common.close")}
      @joe-close=${this.onClose}
      @joe-config=${this.onConfig}
    >
      ${this.kind === "battery" ? this.renderBattery(e) : this.kind && this.kind in Vr ? this.renderAction(e, this.kind) : this.renderChoices(e)}
    </joe-sheet>`;
	}
	renderChoices(e) {
		return l`<div data-tipped>
      <div class="sheet-title">${c(e("devices.add.title"), "h2", O(e, "devices_add"))}</div>
      <p class="lead">${e("devices.add.lead")}</p>
      <ul class="choices">
        ${Br.map(({ kind: t, icon: n }) => {
			let r = t in Hr ? Hr[t] : Wt(t, this.consumer), i = t in Hr ? { replace: !0 } : {
				replace: !0,
				sheet: !0
			};
			return l`<li>
            <a class="choice" href=${T(this.prefix, r)} @click=${C(r, i)}>
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
		let t = Wt();
		return l`<a class="back-link" href=${T(this.prefix, t)} @click=${C(t, {
			replace: !0,
			sheet: !0
		})}
      >${e("nav.back", { name: e("devices.add.other") })}</a
    >`;
	}
	renderBattery(e) {
		let t = this.state.config, n = nn(t, this.discovery).filter((e) => e.kind === "battery" && e.battery), r = rn(t, this.discovery), i = (t, n, r) => l`<li>
        <span class="what">
          <b>${t.name}</b>
          <small>${e(n ? "devices.add.battery.ignored" : "devices.found.battery")}</small>
        </span>
        <span class="row-actions">
          <button type="button" class="mini-btn go" ?disabled=${!!this.busy} @click=${() => this.useFound(t, r)}>
            ${e(n ? "devices.add.battery.use" : "devices.found.use")}
          </button>
          ${n ? u : l`<button
                type="button"
                class="mini-btn quiet"
                ?disabled=${!!this.busy}
                @click=${() => this.ignore(r)}
              >
                ${e("devices.found.ignore")}
              </button>`}
        </span>
      </li>`;
		return l`${this.backToChoices(e)}
      <div data-tipped>
        <div class="sheet-title">${c(e("devices.add.battery.title"), "h2", O(e, "devices_found"))}</div>
        <p class="lead">${e("devices.add.battery.lead")}</p>
        ${n.length || r.length ? l`<ul class="found">
              ${n.map((e) => i(e.battery, !1, e.key))}
              ${r.map((e) => i(e, !0, `battery:${e.id}`))}
            </ul>` : l`<p class="empty">${e("devices.add.battery.none")}</p>`}
      </div>
      <div class="actions" data-tipped>
        <button type="button" class="btn btn-secondary" ?disabled=${!!this.busy} @click=${this.pick}>
          <ha-icon icon="mdi:magnify"></ha-icon>${e("devices.add.battery.pick")}
        </button>
        ${O(e, "review_battery_add")}
      </div>`;
	}
	renderAction(e, t) {
		let n = this.state, r = this.consumer ?? "", i = /^(wallbox|car):/.test(r) ? r : "", a = (i ? void 0 : n.config.consumers.find((e) => e.id === r))?.name ?? (i ? nn(n.config, this.discovery).find((e) => e.key === i)?.name : void 0);
		return l`${this.backToChoices(e)}
      ${lr(`${t}:${this.consumer ?? ""}`, l`<joe-action-editor
          .hass=${this.hass}
          .mailboxes=${n.mailbox}
          .accounts=${n.accounts}
          .apps=${n.apps}
          .t=${e}
          .config=${n.config}
          .discovery=${this.discovery}
          actionId=${`new:${Vr[t]}`}
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
			let n = e.action, r = Ht({
				...t,
				actions: [...t.actions.filter((e) => e.id !== n.id), n]
			}, n);
			D(this, {
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
		let n = await ur(this, this.state.config, e);
		this.busy = "", n && D(this, {
			tab: "devices",
			section: "battery",
			id: n
		}, { replace: !0 });
	}
	async ignore(e) {
		this.busy = e, await fr(this, this.state.config, e), this.busy = "";
	}
	async pick() {
		if (!this.hass) return;
		this.busy = "pick";
		let e = await dr(this, this.t, this.hass, this.state.config);
		this.busy = "", e && D(this, {
			tab: "devices",
			section: "battery",
			id: e
		}, { replace: !0 });
	}
	rediscover() {
		this.dispatchEvent(new CustomEvent("joe-rediscover", {
			bubbles: !0,
			composed: !0
		})), D(this, {
			tab: "devices",
			section: "all"
		}, { replace: !0 });
	}
};
w([b({ attribute: !1 })], Ur.prototype, "kind", void 0), w([b({ attribute: !1 })], Ur.prototype, "consumer", void 0), w([b({ attribute: !1 })], Ur.prototype, "behind", void 0), w([y()], Ur.prototype, "busy", void 0), p("joe-device-add", Ur);
//#endregion
//#region src/components/control-status.ts
var Wr = class extends o {
	constructor(...e) {
		super(...e), this.notice = "";
	}
	static {
		this.styles = [f, S`
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
    `];
	}
	render() {
		let e = this.t, t = this.state, n = t?.control;
		if (!e || !t || !n) return u;
		let r = t.plan, i = n.reason, a = i === "waiting" && r?.window ? e("devices.status.waiting", { time: k(r.window.start) }) : i === "day" ? e("devices.status.day", { time: r?.day ? k(r.day.defer_until) : "–" }) : e(`devices.status.${i}`), o = t.mode === "simulation" ? l`<span class="pill-sim">${e("mode.simulation")}</span>` : l`<span class="chip ${t.mode === "live" ? "ok" : t.mode === "advisory" ? "learned" : ""}"
            >${e(`mode.${t.mode}`)}</span
          >`, s = n.steering || n.pending;
		return l`<section class="card status" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:pulse"></ha-icon>${e("devices.now")}</div>
        ${o} ${O(e, "plan_steer")}
      </div>
      <p class="status-text">${a}</p>
      ${n.pending ? l`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("devices.pending")}</span></div>` : u}
      ${s ? l`<div class="actions">
            <button type="button" class="btn btn-danger" @click=${this.release}>
              <ha-icon icon="mdi:hand-back-left-outline"></ha-icon>${e("devices.release")}
            </button>
            ${O(e, "devices_release")}
          </div>` : u}
      ${this.notice ? l`<div class="note" role="status"><ha-icon icon="mdi:check"></ha-icon>${this.notice}</div>` : u}
    </section>`;
	}
	async release() {
		try {
			await this.hass?.callWS({ type: "energy_joe/control/release" });
		} catch {
			this.notice = this.t("error.action");
		}
	}
};
w([b({ attribute: !1 })], Wr.prototype, "hass", void 0), w([b({ attribute: !1 })], Wr.prototype, "t", void 0), w([b({ attribute: !1 })], Wr.prototype, "state", void 0), w([y()], Wr.prototype, "notice", void 0), p("joe-control-status", Wr);
//#endregion
//#region src/pages/devices/all.ts
var Gr = {
	battery: "mdi:home-battery-outline",
	wallbox: "mdi:ev-station",
	car: "mdi:car-electric"
}, Kr = class extends G {
	constructor(...e) {
		super(...e), this.busy = "";
	}
	static {
		this.styles = [
			f,
			W,
			S`
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
		let e = this.t, n = this.state;
		if (!e || !n) return u;
		let r = this.devices, i = Qt(r), a = r.filter((e) => e.unassigned);
		return l`<div class="wrap">
      <div class="intro">
        <div>
          ${c(e("devices.page.title"))} ${t}
          <div class="lead-row" data-tipped>
            <p class="lead">${e("devices.lead")}</p>
            ${O(e, "ha_open")}
          </div>
        </div>
        <joe-pose name="switch"></joe-pose>
      </div>
      <joe-control-status .t=${e} .hass=${this.hass} .state=${n}></joe-control-status>
      <div class="actions toolbar" data-tipped>${Rr(e, this.prefix)} ${O(e, "devices_add")}</div>
      ${this.renderFound(e)}
      ${It.filter((e) => i.includes(e)).map((t) => this.renderGroup(e, t, r))}
      ${a.length ? l`<div class="group-head">
              <span class="group-label">${e("devices.unassigned")}</span><i class="dcard-dot" aria-hidden="true"></i>
            </div>
            <p class="unassigned-text">${e("devices.unassigned.text")}</p>
            <div class="dcards">
              ${a.map((t) => mr(e, this.prefix, _r(e, this.hass, n, t)))}
            </div>` : u}
    </div>`;
	}
	renderGroup(e, t, n) {
		let r = n.filter((e) => e.group === t && !e.unassigned);
		if (!r.length) return u;
		let i = {
			tab: "devices",
			section: t
		};
		return l`<div class="group-head">
        <ha-icon icon=${Lt[t]}></ha-icon>
        <span class="group-label">${e(`nav.devices.${t}`)}</span>
        ${en(n.filter((e) => !e.unassigned), t) ? l`<i class="dcard-dot" aria-hidden="true"></i>` : u}
        <a class="mini-btn quiet group-go" href=${T(this.prefix, i)} @click=${C(i)}>${e("devices.group.go")}</a>
      </div>
      <div class="dcards">
        ${r.map((t) => mr(e, this.prefix, _r(e, this.hass, this.state, t)))}
      </div>`;
	}
	renderFound(e) {
		let t = nn(this.state.config, this.discovery);
		return t.length ? l`<section class="card found" data-tipped>
      <div class="found-head">
        <div class="eyebrow"><ha-icon icon="mdi:new-box"></ha-icon>${e("devices.found")}</div>
        ${O(e, "devices_found")}
      </div>
      <p class="found-lead">${e("devices.found.lead")}</p>
      <ul>
        ${t.map((t) => l`<li>
            <span class="what">
              <ha-icon icon=${Gr[t.kind]}></ha-icon>
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
    </section>` : u;
	}
	async use(e) {
		if (e.kind !== "battery" || !e.battery) {
			D(this, Wt("car", e.key), { sheet: !0 });
			return;
		}
		this.busy = e.key;
		let t = await ur(this, this.state.config, e.battery);
		this.busy = "", t && D(this, {
			tab: "devices",
			section: "battery",
			id: t
		});
	}
	async ignore(e) {
		this.busy = e.key, await fr(this, this.state.config, e.key), this.busy = "";
	}
};
w([y()], Kr.prototype, "busy", void 0), p("joe-devices-all", Kr);
//#endregion
//#region src/components/battery-automations.ts
async function qr(e) {
	try {
		return await e?.callWS({ type: "energy_joe/automations" }) ?? [];
	} catch {
		return [];
	}
}
function Jr(e, t) {
	return e.filter((e) => e.writes.some((e) => e.battery_id === t));
}
var K = class extends o {
	constructor(...e) {
		super(...e), this.batteries = "", this.mode = "", this.ready = {}, this.batteryId = "", this.bare = !1, this.items = null, this.loaded = [], this.busy = !1, this.failed = !1;
	}
	static {
		this.styles = [f, S`
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
		this.loaded = await qr(this.hass);
	}
	get shown() {
		let e = this.items ?? this.loaded;
		return this.batteryId ? Jr(e, this.batteryId) : e;
	}
	on(e) {
		let t = this.hass?.states[e.entity_id];
		return t ? t.state === "on" : e.on;
	}
	render() {
		let e = this.t, t = this.shown;
		if (!e || !t.length) return u;
		let n = t.filter((e) => this.on(e)), r = t.filter((e) => e.switched_off && !this.on(e)), i = (this.mode === "advisory" || this.mode === "live") && n.some((e) => e.writes.some((e) => (!this.batteryId || e.battery_id === this.batteryId) && this.ready[e.battery_id] === "ready")), a = l`<p class="now">
        ${e(n.length ? i ? "automations.lead" : "automations.lead_idle" : "automations.lead_off")}
      </p>
      <ul>
        ${t.map((t) => {
			let n = this.on(t), r = [...new Set(t.writes.map((e) => e.battery))].join(", ");
			return l`<li>
            <div class="row">
              <b>${t.name}</b>
              ${t.writes.some((e) => e.joe) ? l`<span class="chip">${e("automations.levers")}</span>` : u}
              <span class="chip ${n ? "warn" : "ok"}">${e(n ? "automations.on" : "automations.off")}</span>
            </div>
            ${t.writes.length ? l`<small>${e("automations.writes", {
				what: t.writes.map((e) => e.name).join(", "),
				batteries: r
			})}</small>` : l`<small>${e("automations.not_battery")}</small>`}
            ${t.switched_off && !n ? l`<small>
                  ${e("automations.switched_off", {
				day: V(e.lang, t.switched_off.at, "short"),
				time: t.switched_off.at.slice(11, 16)
			})}
                </small>` : u}
          </li>`;
		})}
      </ul>
      <div class="actions">
        ${n.length ? l`<button type="button" class="mini-btn ${i ? "go" : ""}" ?disabled=${this.busy} @click=${() => this.switch(!1)}>
              <ha-icon icon="mdi:pause-circle-outline"></ha-icon>${e("automations.all_off", { count: n.length })}
            </button>` : u}
        ${r.length ? l`<button type="button" class="mini-btn" ?disabled=${this.busy} @click=${() => this.switch(!0)}>
              <ha-icon icon="mdi:play-circle-outline"></ha-icon>${e("automations.back_on", { count: r.length })}
            </button>` : u}
      </div>
      ${this.failed ? l`<p class="bad">${e("automations.failed")}</p>` : u}`;
		return this.bare ? a : l`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:robot-outline"></ha-icon>${e("automations.title")}</div>
        ${O(e, "battery_automations")}
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
w([b({ attribute: !1 })], K.prototype, "hass", void 0), w([b({ attribute: !1 })], K.prototype, "t", void 0), w([b()], K.prototype, "batteries", void 0), w([b()], K.prototype, "mode", void 0), w([b({ attribute: !1 })], K.prototype, "ready", void 0), w([b()], K.prototype, "batteryId", void 0), w([b({ type: Boolean })], K.prototype, "bare", void 0), w([b({ attribute: !1 })], K.prototype, "items", void 0), w([y()], K.prototype, "loaded", void 0), w([y()], K.prototype, "busy", void 0), w([y()], K.prototype, "failed", void 0), p("joe-battery-automations", K);
//#endregion
//#region src/components/mirror.ts
function Yr(e, t, n) {
	return l`<div class="mirror">
    <div class="mirror-text">
      <span class="mirror-label">${n.label}</span>
      <span class="mirror-sep" aria-hidden="true">·</span>
      <span class="mirror-value">${n.value}</span>
      ${n.source ? A(e, n.source) : u}
      ${n.hint ? l`<small class="mirror-hint">${n.hint}</small>` : u}
    </div>
    <a class="mini-btn go mirror-go" href=${T(t, n.to)} @click=${C(n.to)}
      >${e(n.action === "set" ? "mirror.set" : "mirror.change")}</a
    >
  </div>`;
}
//#endregion
//#region src/components/choice.ts
var Xr = "unknown", Zr = class extends o {
	constructor(...e) {
		super(...e), this.options = [], this.value = [], this.multiple = !1, this.exclusive = [], this.idk = "", this.label = "", this.compact = !1;
	}
	static {
		this.styles = S`
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
		return l`<div class="opts" role="group" aria-label=${this.label}>
      ${this.options.map((e) => this.renderOption(e))}
      ${this.idk ? this.renderOption({
			value: Xr,
			label: this.idk
		}, "idk") : u}
    </div>`;
	}
	renderOption(e, t = "") {
		let n = this.value.includes(e.value);
		return l`<button
      type="button"
      class=${t}
      aria-pressed=${String(n)}
      ?disabled=${e.disabled}
      @click=${() => this.toggle(e.value)}
    >
      ${e.icon ? l`<ha-icon icon=${e.icon}></ha-icon>` : u}
      <span>${e.label}</span>
      ${n && this.multiple ? l`<span class="tick" aria-hidden="true"
            ><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12.5l4.5 4.5L19 7.5" /></svg
          ></span>` : u}
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
w([b({ attribute: !1 })], Zr.prototype, "options", void 0), w([b({ attribute: !1 })], Zr.prototype, "value", void 0), w([b({ type: Boolean })], Zr.prototype, "multiple", void 0), w([b({ attribute: !1 })], Zr.prototype, "exclusive", void 0), w([b()], Zr.prototype, "idk", void 0), w([b()], Zr.prototype, "label", void 0), w([b({
	type: Boolean,
	reflect: !0
})], Zr.prototype, "compact", void 0), p("joe-choice", Zr);
//#endregion
//#region src/rules-view.ts
var Qr = {
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
}, $r = [
	"reserve_soc",
	"max_target_soc",
	"evening_min_soc",
	"grid_limit_w",
	"max_night_kwh",
	"max_price",
	"min_saving",
	"guard_grid",
	"balance_days",
	"priority",
	"discharge_in_window",
	"converter_losses",
	"buffer_factor",
	"plan_offset_min",
	"reset_lead_min"
], ei = [
	"until_target",
	"block",
	"free"
];
function ti(e) {
	return $r.includes(e);
}
function ni(e) {
	return e in Qr;
}
function ri(e, t) {
	return t.unit || e(`rule.${t.key}.unit`);
}
function ii(e, t) {
	return t == null ? "" : String(Math.round(t * (e.scale ?? 1) * 100) / 100);
}
function ai(e, t, n) {
	let r = t.rules;
	if (ni(n)) {
		let t = Qr[n], a = r[n];
		if (a == null) return e("rule.off");
		let o = Math.round(a * (t.scale ?? 1) * 100) / 100, s = Number.isInteger(o) ? 0 : Number.isInteger(o * 10) ? 1 : 2;
		return `${i(e.lang, o, s)} ${ri(e, t)}`;
	}
	switch (n) {
		case "priority": return r.priority.map((t) => e(`rule.priority.${t}`)).join(" · ");
		case "discharge_in_window": return e(`rule.discharge.${r.discharge_in_window}`);
		default: return e(r[n] ? "rule.on" : "rule.off");
	}
}
function oi(e, t, n, r, i) {
	if (ni(i)) return si(e, t, n, r, Qr[i]);
	switch (i) {
		case "guard_grid": return li(e, t, n);
		case "converter_losses": return ui(e, t, n);
		case "priority": return di(e, t, n);
		case "discharge_in_window": return fi(e, t, n);
	}
}
function si(e, t, n, r, i) {
	let a = r?.defaults?.rules[i.key], o = j(n, `rules.${i.key}`), s = o?.source === "user";
	return l`<div class="row" data-tipped data-anchor=${i.key}>
    <div>
      <div class="name"><b>${e(`rule.${i.key}`)}</b>${O(e, `r_${i.key}`)}</div>
      <small>${e(`rule.${i.key}.hint`)}</small>
    </div>
    <div class="control">
      ${A(e, o)}
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
          .value=${ii(i, n.rules[i.key])}
          @change=${(e) => ci(t, i, e.target)}
        />
        <span class="unit">${ri(e, i)}</span>
      </span>
      ${s && a !== void 0 ? l`<button
            type="button"
            class="mini-btn quiet"
            @click=${() => P(t, { rules: { [i.key]: a } }, "default")}
          >
            <ha-icon icon="mdi:restore"></ha-icon>${e("rule.reset")}
          </button>` : u}
    </div>
  </div>`;
}
function ci(e, t, n) {
	let r = n.value.trim(), i = t.scale ?? 1;
	if (r === "") {
		t.optional && P(e, { rules: { [t.key]: null } });
		return;
	}
	let a = Number.parseFloat(r);
	if (!Number.isFinite(a) || a < t.min || a > t.max) {
		n.reportValidity();
		return;
	}
	let o = t.integer ? Math.round(a) : Math.round(a / i * 1e4) / 1e4;
	P(e, { rules: { [t.key]: o } });
}
function li(e, t, n) {
	let r = n.rules, i = r.grid_limit_w;
	return l`<div class="row" data-tipped data-anchor="guard_grid">
    <div>
      <div class="name"><b id="guard-grid">${e("rule.guard_grid")}</b>${O(e, "r_guard_grid")}</div>
      <small>${e(i ? "rule.guard_grid.hint" : "rule.guard_grid.no_limit")}</small>
    </div>
    <div class="control">
      ${A(e, j(n, "rules.guard_grid"))}
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${String(r.guard_grid)}
        aria-labelledby="guard-grid"
        ?disabled=${!i}
        @click=${() => P(t, { rules: { guard_grid: !r.guard_grid } })}
      ></button>
    </div>
  </div>`;
}
function ui(e, t, n) {
	let r = n.rules;
	return l`<div class="row" data-tipped data-anchor="converter_losses">
    <div>
      <div class="name"><b id="converter-losses">${e("rule.converter_losses")}</b>${O(e, "r_converter_losses")}</div>
      <small>${e("rule.converter_losses.hint")}</small>
    </div>
    <div class="control">
      ${A(e, j(n, "rules.converter_losses"))}
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${String(r.converter_losses)}
        aria-labelledby="converter-losses"
        @click=${() => P(t, { rules: { converter_losses: !r.converter_losses } })}
      ></button>
    </div>
  </div>`;
}
function di(e, t, n) {
	let r = n.rules.priority, i = (e, n) => {
		let i = [...r];
		[i[e], i[e + n]] = [i[e + n], i[e]], P(t, { rules: { priority: i } });
	}, a = (e) => l`<svg
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
	return l`<div class="row" data-tipped data-anchor="priority">
    <div>
      <div class="name"><b>${e("rule.priority")}</b>${O(e, "r_priority")}</div>
      <small>${e("rule.priority.hint")}</small>
    </div>
    <div class="control">
      ${A(e, j(n, "rules.priority"))}
      <div class="order">
        ${r.map((t, n) => l`<div>
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
function fi(e, t, n) {
	let r = n.rules;
	return l`<div class="row stacked" data-tipped data-anchor="discharge_in_window">
    <div>
      <div class="name">
        <b>${e("rule.discharge_in_window")}</b>${O(e, "r_discharge_in_window")}
        ${A(e, j(n, "rules.discharge_in_window"))}
      </div>
      <small>${e("rule.discharge_in_window.hint")}</small>
    </div>
    <div>
      <joe-choice
        compact
        label=${e("rule.discharge_in_window")}
        .options=${ei.map((t) => ({
		value: t,
		label: e(`rule.discharge.${t}`)
	}))}
        .value=${[r.discharge_in_window]}
        @joe-choice=${(e) => {
		e.detail.value[0] && P(t, { rules: { discharge_in_window: e.detail.value[0] } });
	}}
      ></joe-choice>
    </div>
  </div>`;
}
var pi = S`
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
function mi(e) {
	return l`<div class="rows">
    ${e.map((e) => l`<div class="row-item">
        <b>${e.name}</b>
        <span class="values">${e.values.map((e) => l`<span>${e}</span>`)}</span>
        ${e.note ? l`<small>${e.note}</small>` : u}
        ${e.extra ? l`<span class="row-extra">${e.extra}</span>` : u}
      </div>`)}
  </div>`;
}
var hi = S`
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
function gi(e, t, n, r, a) {
	let o = e.lang, s = n.battery_models?.[r.id], c = r.capacity_kwh, l = t.provenance[`batteries[${r.id}].capacity_kwh`]?.source === "user", u;
	return u = s ? l && c ? e("learn.battery.user", { value: B(o, c, 1) }) : c && (s.capacity_kwh / c < .5 || s.capacity_kwh / c > 1.15) ? e("learn.battery.odd", { value: B(o, c, 1) }) : c ? e("learn.battery.uses_nominal", { value: B(o, c, 1) }) : e("learn.battery.uses") : r.power ? e("learn.battery.learning", { need: a }) : e("learn.battery.no_power"), {
		name: r.name,
		values: s ? [
			e("learn.battery.capacity", { value: B(o, s.capacity_kwh, 1) }),
			e("learn.battery.efficiency", { value: i(o, s.efficiency * 100, 0) }),
			...s.converter ? [e("learn.battery.converter", { value: i(o, s.converter.factor * 100, 0) })] : []
		] : [e("learn.still")],
		note: u
	};
}
function _i(e, t, n) {
	let r = t.group_models?.[n.id];
	return {
		name: n.name,
		values: r ? [e("learn.groups.average", { value: B(e.lang, r.average, 1) }), r.heat >= .05 ? e("learn.groups.heat", { value: B(e.lang, r.heat, 2) }) : e("learn.groups.steady")] : [e("learn.still")]
	};
}
function vi(e, t, n) {
	let r = t.action_models?.[n.id];
	return {
		name: n.name,
		values: r ? [
			e("learn.hot_water.rate", { value: B(e.lang, r.rate_k_per_h, 1) }),
			e("learn.hot_water.loss", { value: B(e.lang, r.loss_k_per_h, 1) }),
			e("learn.hot_water.demand", { value: B(e.lang, r.demand_k, 0) })
		] : [e("learn.still")],
		note: r ? void 0 : e("learn.hot_water.learning")
	};
}
function yi(e, t, n) {
	let r = e.lang, i = t.car_models?.[n.id], a = [];
	return i?.consumption != null && (a.push(e("learn.car.consumption", { value: B(r, i.consumption, 1) })), i.cold && a.push(e("learn.car.cold", { value: B(r, i.cold, 2) }))), (i?.workday_km != null || i?.day_off_km != null) && a.push(e("learn.car.km", {
		workday: i.workday_km == null ? "–" : B(r, i.workday_km, 0),
		day_off: i.day_off_km == null ? "–" : B(r, i.day_off_km, 0)
	})), {
		name: n.name,
		values: a.length ? a : [e("learn.still")],
		note: a.length ? void 0 : e(n.need?.odometer_entity ? "learn.car.learning" : "learn.car.no_odometer")
	};
}
function bi(e) {
	return `${String(Math.floor(e / 60)).padStart(2, "0")}:${String(Math.round(e) % 60).padStart(2, "0")}`;
}
function xi(e, t, n, r) {
	let i = t.presence?.[n.id] ?? {}, a = xn.filter((e) => i[e]).map((t) => e("learn.presence.value", {
		label: e(`label.${t}`),
		hours: B(e.lang, i[t].hours, 0)
	}));
	r != null && a.push(e("past.learned.presence.usual", { time: bi(r) }));
	let o;
	return n.person_entity ? n.calendars.length || (o = e("past.learned.presence.no_calendar")) : o = e("learn.presence.no_person"), {
		name: n.name,
		values: a.length ? a : [e("learn.still")],
		note: o
	};
}
function Si(e, t) {
	return t ? e("climate.rate", { rate: i(e.lang, t, 1) }) : e("climate.rate_default");
}
function Ci(e) {
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
function wi(e, t) {
	let n = Math.max(1, Math.ceil(t.length / 7)), r = /* @__PURE__ */ new Map();
	return t.forEach((i, a) => {
		(t.length - 1 - a) % n == 0 && r.set(a, V(e, i, "short"));
	}), r;
}
//#endregion
//#region src/pages/devices/battery-device.ts
var Ti = [
	"hold",
	"charge",
	"release"
], Ei = 14, Di = [
	"adapter",
	"controls",
	"mode_options",
	"steps",
	"prepare"
], Oi = /* @__PURE__ */ new Map();
function ki(e) {
	return {
		...An(e),
		prepare: structuredClone(e.prepare)
	};
}
var Ai = (e, t) => JSON.stringify(e ?? null) === JSON.stringify(t ?? null);
function ji(e, t, n) {
	switch (t.adapter) {
		case "none": return e("devices.battery.watch");
		case "generic": return e("devices.battery.generic");
		case "steps": return e("devices.battery.steps");
		default: return e("devices.battery.profile", { name: n?.profiles?.[t.adapter] ?? t.adapter });
	}
}
function Mi(e, t, n) {
	if (t.adapter === "none") return e("devices.action.watch");
	let r = n?.batteries[t.id];
	return r?.action ? e(`devices.action.${r.action}`, {
		target: i(e.lang, r.target ?? 0, 0),
		floor: i(e.lang, r.floor ?? 0, 0),
		until: r.until ? k(r.until) : ""
	}) : e("devices.action.idle");
}
function Ni(e, t) {
	return e.adapter === "none" && !!t?.suggested?.complete;
}
function Pi(e) {
	return {
		tab: "devices",
		section: "battery",
		id: e,
		sub: "control"
	};
}
var Fi = class extends G {
	constructor(...e) {
		super(...e), this.confirm = !1, this.removing = !1, this.saving = !1, this.notice = "", this.automations = null, this.automationsFor = "";
	}
	static {
		this.styles = [
			f,
			W,
			hi,
			S`
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
		e.has("entry") && t !== this.automationsFor && (this.removing = !1, this.notice = ""), this.hass && t && t !== this.automationsFor && (this.automationsFor = t, this.automations = null, qr(this.hass).then((e) => {
			this.automationsFor === t && (this.automations = e);
		}));
	}
	render() {
		let { t: e, entry: t } = this, n = this.state, r = this.battery;
		if (!e || !n || !t || !r) return u;
		let i = n.control, a = this.discovery?.batteries.find((e) => e.id === r.id), o = r.adapter !== "none", s = Jr(this.automations ?? [], r.id);
		return l`${Fr(this.ctx, {
			...jr(this.ctx, t),
			why: Mi(e, r, i),
			head: this.renderHead(e, r, a),
			now: o ? this.renderTest(e, r, i) : void 0,
			steer: this.renderSteer(e, r),
			power: this.renderPower(e, r),
			learned: mi([gi(e, n.config, n.config.learned, r, Ei)]),
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
      ${this.confirm ? this.renderConfirm(e, r) : u}
      ${this.sub === "control" ? this.renderControl(e, r, a) : u}`;
	}
	renderHead(e, t, n) {
		let r = Pi(t.id);
		return l`<div class="head-row">
        <span class="chip ${t.adapter === "none" ? "" : "read"}">${ji(e, t, this.info)}</span>
      </div>
      ${Ni(t, n) ? l`<div class="note">
            <ha-icon icon="mdi:lightbulb-on-outline"></ha-icon>
            <span
              >${e("devices.suggested")}
              <div class="note-actions">
                <a class="mini-btn go" href=${T(this.prefix, r)} @click=${C(r, { sheet: !0 })}>${e("devices.setup")}</a>
              </div></span
            >
          </div>` : u}
      ${this.notice ? l`<div class="note warn" role="status"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.notice}</span></div>` : u}`;
	}
	renderTest(e, t, n) {
		let r = n?.ready[t.id] ?? "not_controllable", i = n?.testing?.battery === t.id ? n.testing : null, a = n?.tests[t.id], o = !!n?.testing, s = !!n?.steering, c = i ? l`<span class="chip">${e("devices.test.running")}</span>` : r === "outdated" ? l`<span class="chip warn">${e("devices.test.outdated")}</span>` : a ? l`<span class="chip ${a.ok ? "ok" : "warn"}"
              >${e(a.ok ? "devices.test.ok" : "devices.test.failed", { day: V(e.lang, a.at, "short") })}</span
            >` : l`<span class="chip">${e("devices.test.none")}</span>`, d = i?.steps ?? a?.steps ?? [];
		return l`<div class="test">
        ${c}
        <button type="button" class="btn btn-secondary" ?disabled=${o || s} @click=${() => this.confirm = !0}>
          <ha-icon icon="mdi:play-circle-outline"></ha-icon>${e(a ? "devices.test.again" : "devices.test.start")}
        </button>
      </div>
      ${i || a ? this.renderSteps(e, d, i?.step ?? null, a) : u}`;
	}
	renderSteps(e, t, n, r) {
		let i = new Map(t.map((e) => [e.step, e])), a = !n && r?.problem ? e.optional(`devices.test.problem.${r.problem}`, { missing: (r.missing ?? []).map((t) => e.optional(`role.${t}`) ?? t).join(", ") }) : null;
		return a ? l`<ul class="steps">
        <li class="bad"><ha-icon icon="mdi:close-circle"></ha-icon><b>${e("devices.test.step.check")}</b><small>${a}</small></li>
      </ul>` : l`<ul class="steps">
      ${Ti.map((t) => {
			let r = i.get(t), a = r ? r.ok ? "mdi:check-circle" : "mdi:close-circle" : n === t ? "mdi:progress-clock" : "mdi:circle-outline";
			return l`<li class=${r ? r.ok ? "ok" : "bad" : "wait"}>
          <ha-icon icon=${a}></ha-icon>
          <b>${e(`devices.test.step.${t}`)}</b>
          <small>${r ? this.stepText(e, r) : ""}</small>
        </li>`;
		})}
    </ul>`;
	}
	stepText(e, t) {
		let r = this.hass, a = [];
		return t.power != null && a.push(Math.abs(t.power) >= .05 ? e("devices.test.power", { value: i(e.lang, t.power, 2) }) : e("devices.test.no_power")), t.wrong.length && a.push(e("devices.test.wrong", { entities: t.wrong.map((e) => n(r, e)).join(", ") })), t.errors.length && a.push(e("devices.test.error", { entities: t.errors.map((e) => n(r, e.entity_id)).join(", ") })), a.join(" · ");
	}
	renderConfirm(e, t) {
		let n = () => {
			this.confirm = !1;
		};
		return l`<joe-sheet label=${e("devices.test.start")} closeLabel=${e("common.close")} @joe-close=${n}>
      <div data-tipped>
        <div class="sheet-title">${c(e("devices.test.confirm.title", { name: t.name }), "h2", O(e, "devices_test"))}</div>
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
		let n = Pi(t.id);
		return l`<div class="control-row" data-tipped>
        <span class="control-text">
          <small>${e("battery.page.how")}</small>
          <b>${ji(e, t, this.info)}</b>
        </span>
        <a class="btn btn-secondary" href=${T(this.prefix, n)} @click=${C(n, { sheet: !0 })}>
          <ha-icon icon="mdi:tune-variant"></ha-icon>${e("devices.setup")}
        </a>
        ${O(e, "devices_setup")}
      </div>
      ${this.fields(t, "steer")}`;
	}
	renderPower(e, t) {
		return this.fields(t, "power");
	}
	fields(e, t) {
		return l`<joe-battery-fields
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
		return l`<joe-battery-automations
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
		return l`<div class="remove">
      <p class="remove-text">${e("battery.page.remove.text")}</p>
      ${this.removing ? l`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("battery.page.remove.confirm", { name: t.name })}</span></div>
            <div class="actions">
              <button type="button" class="btn btn-danger" ?disabled=${this.saving} @click=${() => this.leaveOut(t)}>
                ${e("battery.page.remove.go")}
              </button>
              <button type="button" class="btn btn-ghost" @click=${() => this.removing = !1}>${e("common.cancel")}</button>
            </div>` : l`<div class="actions">
            <button type="button" class="btn btn-secondary" @click=${() => this.removing = !0}>
              <ha-icon icon="mdi:eye-off-outline"></ha-icon>${e("review.ignore")}
            </button>
          </div>`}
    </div>`;
	}
	async leaveOut(e) {
		let t = this.state.config;
		this.saving = !0;
		let n = await P(this, {
			batteries: { [e.id]: null },
			answers: { ignored: N(t, `battery:${e.id}`, !0) }
		});
		this.saving = !1, n && (this.removing = !1, D(this, {
			tab: "devices",
			section: "battery"
		}, { replace: !0 }));
	}
	draftOf(e) {
		let t = ki(e), n = Oi.get(e.id);
		if (!n) return t;
		let r = { ...t };
		for (let e of Di) Ai(n.base[e], n.draft[e]) || (r[e] = n.draft[e]);
		return r;
	}
	controlChanges(e, t) {
		let n = {};
		for (let r of Di) Ai(e[r], t[r]) || (n[r] = t[r]);
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
		return l`<joe-sheet wide label=${e("devices.setup")} closeLabel=${e("common.close")} @joe-close=${() => ge(this, a)}>
      <div data-tipped>
        <div class="sheet-title">${c(e("battery.control.title", { name: t.name }), "h2", O(e, "control_choice"))}</div>
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
			Oi.set(t.id, {
				base: ki(t),
				draft: jn(t, e.detail, n)
			}), this.requestUpdate();
		}}
        ></joe-battery-control>
        </div>
      </div>
      <div class="steer-bar" data-notip role="region" aria-label=${e("devices.setup")}>
        ${i ? l`<span class="unsaved" role="status">${e("battery.control.unsaved")}</span>` : u}
        <button type="button" class="btn btn-primary" ?disabled=${this.saving || !i} @click=${() => this.saveControl(t, a)}>
          ${e("common.save")}
        </button>
        <button
          type="button"
          class="btn btn-ghost"
          @click=${() => {
			Oi.delete(t.id), ge(this, a);
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
			let t = await P(this, { batteries: { [e.id]: n } });
			if (this.saving = !1, !t) return;
		}
		Oi.delete(e.id), ge(this, t);
	}
};
w([b({ attribute: !1 })], Fi.prototype, "entry", void 0), w([b({ attribute: !1 })], Fi.prototype, "sub", void 0), w([y()], Fi.prototype, "confirm", void 0), w([y()], Fi.prototype, "removing", void 0), w([y()], Fi.prototype, "saving", void 0), w([y()], Fi.prototype, "notice", void 0), w([y()], Fi.prototype, "automations", void 0), p("joe-battery-device", Fi);
//#endregion
//#region src/pages/devices/battery.ts
var Ii = [
	"reserve_soc",
	"max_target_soc",
	"evening_min_soc",
	"balance_days",
	"discharge_in_window",
	"converter_losses"
], Li = class extends G {
	constructor(...e) {
		super(...e), this.busy = "";
	}
	static {
		this.styles = [
			f,
			W,
			S`
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
		if (!e || !t) return u;
		let n = $t(this.devices, "battery", this.device);
		if (n) return l`<joe-battery-device
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
		return l`<div class="wrap">
      ${Lr(e, e("nav.devices.battery"), e("battery.page.lead"), r.length > 0)}
      ${this.device === void 0 ? u : kr(e)}
      <joe-control-status .t=${e} .hass=${this.hass} .state=${t}></joe-control-status>
      ${r.length ? Ir(this.ctx, this.devices, "battery", (t) => this.cardChange(e, t)) : l`<p class="empty">${e("devices.batteries.none")}</p>`}
      <div class="actions">${Rr(e, this.prefix, "battery", e("battery.page.add"))}</div>
      ${r.length ? this.renderRules(e) : u}
      ${r.length ? l`<joe-battery-automations
            .hass=${this.hass}
            .t=${e}
            batteries=${JSON.stringify(r)}
            mode=${t.mode}
            .ready=${t.control?.ready ?? {}}
          ></joe-battery-automations>` : u}
      ${this.renderFound(e)}
    </div>`;
	}
	cardChange(e, t) {
		let n = t.battery;
		if (!n) return {};
		let r = this.discovery?.batteries.find((e) => e.id === n.id), i = gr(e, this.hass, this.state, t), a = Mi(e, n, this.state?.control), o = Pi(n.id);
		return {
			state: [i, a].filter(Boolean).join(" · "),
			quick: Ni(n, r) ? l`<span class="dcard-suggest">${e("battery.page.suggested")}</span>
            <a class="mini-btn go" href=${T(this.prefix, o)} @click=${C(o, { sheet: !0 })}>${e("devices.setup")}</a>` : void 0
		};
	}
	renderRules(e) {
		let t = this.state.config;
		return l`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:tune-vertical"></ha-icon>${e("battery.page.rules")}</div>
        ${O(e, "battery_rules")}
      </div>
      <div class="mirrors">
        ${Ii.map((n) => {
			let r = {
				tab: "settings",
				section: "rules",
				id: n
			};
			return Yr(e, this.prefix, {
				label: e(`rule.${n}`),
				value: ai(e, t, n),
				source: j(t, `rules.${n}`),
				to: r
			});
		})}
      </div>
    </section>`;
	}
	renderFound(e) {
		let t = this.state.config, n = nn(t, this.discovery).filter((e) => e.kind === "battery" && e.battery), r = rn(t, this.discovery);
		if (!n.length && !r.length) return u;
		let i = (t, n, r) => l`<li>
        <span class="what">
          <b>${t.name}</b>
          <small>${e(n ? "devices.add.battery.ignored" : "battery.page.found.new")}</small>
        </span>
        <span class="row-actions">
          <button type="button" class="mini-btn go" ?disabled=${!!this.busy} @click=${() => this.use(t, r)}>
            ${e(n ? "devices.add.battery.use" : "devices.found.use")}
          </button>
          ${n ? u : l`<button type="button" class="mini-btn quiet" ?disabled=${!!this.busy} @click=${() => this.ignore(r)}>
                ${e("devices.found.ignore")}
              </button>`}
        </span>
      </li>`;
		return l`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:home-battery-outline"></ha-icon>${e("battery.page.found")}</div>
        ${O(e, "battery_found")}
      </div>
      <ul class="found">
        ${n.map((e) => i(e.battery, !1, e.key))} ${r.map((e) => i(e, !0, `battery:${e.id}`))}
      </ul>
    </section>`;
	}
	async use(e, t) {
		this.busy = t;
		let n = await ur(this, this.state.config, e);
		this.busy = "", n && D(this, {
			tab: "devices",
			section: "battery",
			id: n
		});
	}
	async ignore(e) {
		this.busy = e, await fr(this, this.state.config, e), this.busy = "";
	}
};
w([b({ attribute: !1 })], Li.prototype, "device", void 0), w([b({ attribute: !1 })], Li.prototype, "sub", void 0), w([y()], Li.prototype, "busy", void 0), p("joe-battery-group", Li);
//#endregion
//#region src/components/action-page.ts
function Ri(e, t, n, r, i, a, o) {
	let s = Wt(n, r);
	return l`<div class="setup-block" data-tipped>
    <p>${i} ${O(e, o)}</p>
    <a class="btn btn-primary" href=${T(t, s)} @click=${C(s, { sheet: !0 })}>${a}</a>
  </div>`;
}
function zi(e, t, n) {
	let r = t.startsWith("action-") ? t.slice(7) : t;
	return e.find((e) => e.group !== n && (e.consumer?.id === t || e.id === t || e.action?.id === r));
}
function Bi(e, t, n, r) {
	let i = r.setup ? {
		tab: "devices",
		section: r.group,
		id: r.id
	} : Ut(r);
	return l`<div class="moved" role="status">
    <ha-icon icon="mdi:arrow-right-bold-circle-outline"></ha-icon>
    <span class="moved-text"><b>${n}</b></span>
    <a class="mini-btn go moved-go" href=${T(t, i)} @click=${C(i)}
      >${e("devices.moved_to", { group: e(`nav.devices.${r.group}`) })}</a
    >
  </div>`;
}
function Vi(e, t) {
	return l`<h4 class="sub-head" data-anchor=${t ?? u}>${e}</h4>`;
}
var Hi = S`
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
`, Ui = class extends o {
	constructor(...e) {
		super(...e), this.roundTrip = !0, this.failed = !1;
	}
	static {
		this.styles = [f, S`
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
		if (!e || !t || !n) return u;
		let r = (t, n = 0) => i(e.lang, t ?? 0, n);
		if (!n.known) return l`<p>${e(n.soc != null && !n.capacity_kwh ? "need.unknown_capacity" : "need.unknown")}</p>`;
		let a = [];
		a.push(l`<p>
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
      </p>`), a.push(l`<p>
        ${e(`need.consumption.${n.consumption_source}`, {
			value: r(n.consumption, 1),
			temp: n.temp == null ? "–" : r(n.temp)
		})}${n.rain ? ` ${e("need.rain")}` : ""}
      </p>`), n.target_unit === "%" ? a.push(l`<p>${e("need.has_soc", {
			soc: r(n.soc),
			km: r(n.have_km),
			target: r(n.target)
		})}</p>`) : a.push(l`<p>${e("need.has_range", { km: r(n.have_km) })}</p>`);
		let o = n.missing_kwh ?? 0;
		return a.push(l`<p class="result">
        ${o >= .2 ? t.run && !t.manual ? e("need.charges", {
			kwh: r(o, 1),
			start: k(t.start)
		}) : e("need.missing", { kwh: r(o, 1) }) : e("need.enough")}
      </p>`), n.fits === !1 && a.push(l`<p>${e("need.too_far")}</p>`), l`${a} ${n.trips.length ? this.renderTrips(e, n.trips) : u}`;
	}
	renderTrips(e, t) {
		return l`<div data-tipped>
      <div class="head">${e("need.trips.title")} ${O(e, "need_trips")}</div>
      <ul>
        ${t.map((t) => l`<li>
            <span>${t.start.includes("T") ? k(t.start) : e("need.all_day")}</span>
            <span class="where">${t.location}</span>
            ${this.editing === t.location ? this.renderEdit(e, t) : l`<span class=${t.km == null ? "km unknown" : "km"}>
                    ${t.km == null ? e("need.km_unknown") : e(`need.km.${t.source ?? "zone"}`, { km: i(e.lang, t.km, 0) })}
                  </span>
                  <button
                    type="button"
                    class="mini-btn quiet"
                    aria-label=${e("need.km_edit", { place: t.location })}
                    @click=${() => this.editing = t.location}
                  >
                    <ha-icon icon="mdi:pencil-outline"></ha-icon>
                  </button>`}
          </li>`)}
      </ul>
      ${this.failed ? l`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("error.action")}</div>` : u}
    </div>`;
	}
	renderEdit(e, t) {
		let n = t.km == null ? "" : String(Math.round(t.km / (this.roundTrip ? 2 : 1)));
		return l`<form
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
w([b({ attribute: !1 })], Ui.prototype, "hass", void 0), w([b({ attribute: !1 })], Ui.prototype, "t", void 0), w([b({ attribute: !1 })], Ui.prototype, "action", void 0), w([b({ attribute: !1 })], Ui.prototype, "roundTrip", void 0), w([y()], Ui.prototype, "editing", void 0), w([y()], Ui.prototype, "failed", void 0), p("joe-car-need", Ui);
//#endregion
//#region src/pages/devices/other-list.ts
var Wi = ["auto", "always"], Gi = [
	"auto",
	"surplus",
	"cheap"
], Ki = [
	"climate",
	"ev",
	"hot_water"
];
function qi(e, t, n) {
	return n === t.kind ? Promise.resolve(!1) : P(e, { consumers: { [t.id]: { kind: n } } });
}
function Ji(e, t, n) {
	return n === (t.runs ?? "auto") ? Promise.resolve(!1) : P(e, { consumers: { [t.id]: { runs: n } } });
}
function Yi(e, t, n) {
	return l`<select
    class="input"
    aria-label=${e("consumers.kind_of", { name: t.name })}
    .value=${t.kind}
    @change=${(e) => n(e.target.value)}
  >
    ${Sn.map((n) => l`<option value=${n} ?selected=${n === t.kind}>${e(`kind.${n}`)}</option>`)}
  </select>`;
}
function Xi(e, t, n) {
	if (t.kind === "submeter") return u;
	let r = t.runs ?? "auto";
	return l`<select
    class="input"
    aria-label=${e("consumers.runs_of", { name: t.name })}
    .value=${r}
    @change=${(e) => n(e.target.value)}
  >
    ${t.kind === "ev" ? Wi.map((t) => l`<option value=${t} ?selected=${t === r}>${e(`runs.ev.${t}`)}</option>`) : Gi.map((t) => l`<option value=${t} ?selected=${t === r}>${e(`runs.${t}`)}</option>`)}
  </select>`;
}
function Zi(e, t, i, a, o) {
	let s = o.power_entity ?? o.energy_entity;
	return l`${s ? l`<div class="meter-line">
          <span class="meter-label">${t("devices.meter")}</span>
          <span class="meter-value"><b>${n(i, s)}</b> · ${r(i, s, t.lang)}</span>
          ${A(t, j(a, `consumers[${o.id}].kind`))}
        </div>` : u}
    <div class="field" data-tipped>
      <div class="field-label">${t("consumers.kind")} ${O(t, "f_consumer_kind")}</div>
      ${Yi(t, o, (t) => void qi(e, o, t))}
    </div>
    ${o.kind === "submeter" ? u : l`<div class="field" data-tipped>
          <div class="field-label">${t("consumers.runs")} ${O(t, "f_consumer_runs")}</div>
          ${Xi(t, o, (t) => void Ji(e, o, t))}
        </div>`}`;
}
var Qi = S`
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
`, $i = class extends o {
	static {
		this.styles = [f, S`
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
		if (!e || !t || !n) return u;
		let i = [...n.consumers].sort((t, n) => Number(t.kind === "submeter") - Number(n.kind === "submeter") || t.name.localeCompare(n.name, e.lang));
		return l`<div data-tipped>
      <div class="head">${e("consumers.kind")} ${O(e, "f_consumer_kind")}</div>
      <div class="head sub">${e("consumers.runs")} ${O(e, "f_consumer_runs")}</div>
      ${i.length ? l`<ul>
            ${i.map((i) => {
			let a = i.power_entity ? r(t, i.power_entity, e.lang) : "";
			return l`<li>
                <div>
                  <b>${i.name}</b>
                  <small>${A(e, j(n, `consumers[${i.id}].kind`))}${a}</small>
                </div>
                <div class="selects">
                  ${Yi(e, i, (e) => void qi(this, i, e))}
                  ${Xi(e, i, (e) => void Ji(this, i, e))}
                </div>
              </li>`;
		})}
          </ul>` : l`<p class="empty">${e("consumers.empty")}</p>`}
    </div>`;
	}
};
w([b({ attribute: !1 })], $i.prototype, "hass", void 0), w([b({ attribute: !1 })], $i.prototype, "t", void 0), w([b({ attribute: !1 })], $i.prototype, "config", void 0), p("joe-consumer-list", $i);
//#endregion
//#region src/pages/devices/car-device.ts
var ea = class extends G {
	constructor(...e) {
		super(...e), this.revealed = "";
	}
	static {
		this.styles = [
			f,
			W,
			hi,
			Qi,
			Hi,
			S`
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
		(e.has("sub") || e.has("entry")) && (t ? this.revealed !== t && me(this.renderRoot, "calendars") && (this.revealed = t) : this.revealed = "");
	}
	render() {
		let { t: e, hass: t, state: n, entry: r } = this;
		if (!e || !t || !n || !r) return u;
		let i = jr(this.ctx, r), a = r.consumer, o = a ? Zi(this, e, t, n.config, a) : void 0, s = r.action;
		if (!s) return Fr(this.ctx, {
			...i,
			now: a ? Ri(e, this.prefix, "car", a.id, e("devices.car.lonely"), e("devices.car.set_up"), "devices_lonely_car") : void 0,
			power: o
		});
		let c = n.plan?.actions?.find((e) => e.id === s.id), d = s.need, f = s.kind === "switch" && !!(d?.soc_entity || d?.range_entity), p = {
			hass: t,
			t: e,
			state: n,
			discovery: this.discovery,
			prefix: this.prefix,
			action: s
		};
		return Fr(this.ctx, {
			...i,
			why: dn(e, n, s),
			now: l`${d?.enabled ? this.calendarLine(e, n, s) : u}
        ${c?.need ? l`<joe-car-need .hass=${t} .t=${e} .action=${c} .roundTrip=${d?.round_trip ?? !0}></joe-car-need>` : u}
        ${f ? l`<joe-car-charge
              .hass=${t}
              .t=${e}
              .state=${n}
              .action=${s}
              ?flush=${!d?.enabled && !c?.need}
            ></joe-car-charge>` : l`<joe-action-tonight .hass=${t} .t=${e} .state=${n} .action=${s}></joe-action-tonight>`}`,
			steer: l`<joe-action-steer
          .hass=${p.hass}
          .t=${e}
          .state=${n}
          .discovery=${p.discovery}
          .prefix=${p.prefix}
          .action=${s}
          .section=${"car"}
        ></joe-action-steer>
        ${Vi(e("devices.car.terms"), "calendars")}
        ${d?.enabled ? l`<joe-action-steer
              .hass=${t}
              .t=${e}
              .state=${n}
              .discovery=${this.discovery}
              .prefix=${this.prefix}
              .action=${s}
              .section=${"calendars"}
            ></joe-action-steer>` : l`<p class="muted">${e("devices.car.terms_off")}</p>`}`,
			power: o,
			learned: s.kind === "switch" ? mi([yi(e, n.config.learned, s)]) : void 0,
			learnedArea: "car",
			tips: { steer: "device_steer" },
			removeTitle: e("devices.page.delete"),
			remove: l`<joe-action-delete
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
	calendarLine(e, t, r) {
		let i = r.need, a = i?.enabled ? i.source ?? "ha" : null, o = "", s = "none", c = null, d = i?.enabled ? t.config.persons.filter((e) => e.calendars.length && (i.persons == null || i.persons.includes(e.id))) : [];
		if (a === "ha" && (i?.calendars?.length || d.length)) o = [...(i?.calendars ?? []).map((e) => n(this.hass, e)), ...d.length ? [e("devices.car.of_persons", { names: d.map((e) => e.name).join(", ") })] : []].join(" · "), s = "ok";
		else if (a === "mailbox" && i?.mailbox?.address) {
			let e = t.mailbox?.[r.id];
			o = i.mailbox.address, s = e?.state === "ok" ? "ok" : "warn", c = e?.checked ?? null;
		} else if (a === "account" && i?.account?.address) {
			let e = t.accounts?.[r.id];
			o = i.account.address, s = e?.state === "ok" ? "ok" : "warn", c = e?.checked ?? null;
		}
		let f = {
			tab: "devices",
			section: "car",
			id: this.entry.id,
			sub: "calendars"
		};
		return l`<div class="car-cal" data-tipped>
      <ha-icon icon="mdi:calendar-month-outline"></ha-icon>
      <span class="grow">
        ${s === "none" ? l`<b>${e("devices.car.no_calendar")}</b>` : l`<b>${o}</b>
              <small>
                ${e(s === "ok" ? "devices.car.calendar_ok" : "devices.car.calendar_problem")}
                ${c ? e("devices.car.checked", { when: new Date(c).toLocaleString(e.lang, {
			weekday: "short",
			hour: "2-digit",
			minute: "2-digit"
		}) }) : u}
              </small>`}
      </span>
      <a class="mini-btn ${s === "none" ? "go" : ""}" href=${T(this.prefix, f)} @click=${this.jumpToCalendars(f)}>
        ${e(s === "none" ? "devices.car.connect" : "devices.car.change")}
      </a>
      ${O(e, "car_calendar_card")}
    </div>`;
	}
	jumpToCalendars(e) {
		let t = C(e, { replace: !0 });
		return (e) => {
			t(e), e.defaultPrevented && (this.revealed = "", me(this.renderRoot, "calendars"));
		};
	}
};
w([b({ attribute: !1 })], ea.prototype, "entry", void 0), w([b({ attribute: !1 })], ea.prototype, "sub", void 0), p("joe-car-device", ea);
//#endregion
//#region src/pages/devices/car.ts
var ta = class extends G {
	static {
		this.styles = [
			f,
			W,
			Hi
		];
	}
	render() {
		let e = this.t;
		if (!e || !this.state) return u;
		let t = $t(this.devices, "car", this.device);
		if (t) return l`<joe-car-device
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
		let n = this.device ? zi(this.devices, this.device, "car") : void 0;
		return l`<div class="wrap">
      ${Lr(e, e("nav.devices.car"), e("devices.car.lead"), this.devices.some((e) => e.group === "car"))}
      ${this.device === void 0 ? u : n ? Bi(e, this.prefix, n.name, n) : kr(e)}
      ${Ir(this.ctx, this.devices, "car", (t) => {
			let n = t.action?.need;
			return t.action && (t.action.kind !== "switch" || !n?.soc_entity && !n?.range_entity) ? { quick: l`<joe-action-tonight .hass=${this.hass} .t=${e} .state=${this.state} .action=${t.action}></joe-action-tonight>` } : {};
		})}
      <div class="group-actions">${Rr(e, this.prefix, "car", e("devices.group_add.car"))}</div>
    </div>`;
	}
};
w([b({ attribute: !1 })], ta.prototype, "device", void 0), w([b({ attribute: !1 })], ta.prototype, "sub", void 0), p("joe-car-group", ta);
//#endregion
//#region node_modules/lit-html/directives/repeat.js
var na = (e, t, n) => {
	let r = /* @__PURE__ */ new Map();
	for (let i = t; i <= n; i++) r.set(e[i], i);
	return r;
}, ra = qn(class extends Jn {
	constructor(e) {
		if (super(e), e.type !== Kn.CHILD) throw Error("repeat() can only be used in text expressions");
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
		let i = Wn(e), { values: a, keys: o } = this.dt(t, n, r);
		if (!Array.isArray(i)) return this.ut = o, a;
		let s = this.ut ??= [], c = [], l, u, d = 0, f = i.length - 1, p = 0, m = a.length - 1;
		for (; d <= f && p <= m;) if (i[d] === null) d++;
		else if (i[f] === null) f--;
		else if (s[d] === o[p]) c[p] = Vn(i[d], a[p]), d++, p++;
		else if (s[f] === o[m]) c[m] = Vn(i[f], a[m]), f--, m--;
		else if (s[d] === o[m]) c[m] = Vn(i[d], a[m]), Bn(e, c[m + 1], i[d]), d++, m--;
		else if (s[f] === o[p]) c[p] = Vn(i[f], a[p]), Bn(e, i[d], i[f]), f--, p++;
		else if (l === void 0 && (l = na(o, p, m), u = na(s, d, f)), l.has(s[d])) {
			if (l.has(s[f])) {
				let t = u.get(o[p]), n = t === void 0 ? null : i[t];
				if (n === null) {
					let t = Bn(e, i[d]);
					Vn(t, a[p]), c[p] = t;
				} else c[p] = Vn(n, a[p]), Bn(e, i[d], n), i[t] = null;
				p++;
			} else Gn(i[f]), f--;
		} else Gn(i[d]), d++;
		for (; p <= m;) {
			let t = Bn(e, c[m + 1]);
			Vn(t, a[p]), c[p++] = t;
		}
		for (; d <= f;) {
			let e = i[d++];
			e !== null && Gn(e);
		}
		return this.ut = o, Un(e, c), he;
	}
}), ia = 1435, aa = 1440;
function oa(e, t) {
	let n = (t ?? "").trim();
	return !n || /^profile?\s*\d+$/i.test(n) ? e : `${e} ${n}`;
}
var sa = {
	normal: "mdi:home-outline",
	holiday: "mdi:calendar-star",
	away: "mdi:home-export-outline",
	home_office: "mdi:laptop"
}, ca = {
	all: 1,
	week_weekend: 2,
	each: 7
};
function la(e, t) {
	return e === "all" ? 0 : e === "week_weekend" ? t < 5 ? 0 : 1 : t;
}
function ua(e) {
	return `${String(Math.floor(e / 60)).padStart(2, "0")}:${String(e % 60).padStart(2, "0")}`;
}
function da(e) {
	let t = /^(\d{1,2}):(\d{2})/.exec(e);
	if (!t) return null;
	let n = Number(t[1]), r = Number(t[2]);
	return n < 24 && r < 60 ? n * 60 + r : null;
}
function fa(e, t) {
	let n;
	for (let [r, i] of e) r <= t && (n = i);
	return n;
}
function pa(e) {
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
function ma(e, t, n, r) {
	let i = Math.round(e / t) * t;
	return Math.round(Math.min(r, Math.max(n, i)) * 10) / 10;
}
function ha(e, t) {
	let n = (e) => e.map(([e, t]) => [e, t]), r = (t) => n(e.curves[la(e.split, t)] ?? e.curves[0]);
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
function ga(e) {
	let t = 0, n = -1;
	for (let r = 0; r < e.length; r++) {
		let i = e[r + 1]?.[0] ?? 1440;
		i - e[r][0] > n && (t = e[r][0], n = i - t);
	}
	if (n < 0) return null;
	let r = Math.min(ia, Math.round((t + n / 2) / 15) * 15);
	return r > t && !e.some(([e]) => e === r) ? r : null;
}
function _a(e) {
	if (e.length !== 6) return "count";
	let t = /* @__PURE__ */ new Set();
	for (let n of e) {
		for (let e of n.tags) {
			if (t.has(e)) return "tags";
			t.add(e);
		}
		if (n.curves.length !== ca[n.split]) return "curves";
		for (let e of n.curves) {
			if (!e.length || e.length > 12 || e[0][0] !== 0) return "points";
			for (let t = 1; t < e.length; t++) if (e[t][0] <= e[t - 1][0] || e[t][0] % 5) return "points";
		}
	}
	return null;
}
//#endregion
//#region src/components/week-bar.ts
var va = class extends o {
	constructor(...e) {
		super(...e), this.points = [], this.mode = "heat", this.now = null, this.compact = !1, this.lang = "en", this.label = "", this.offText = "off";
	}
	static {
		this.styles = S`
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
		return l`<div class="track">
        <div class="bar" role="img" aria-label=${this.label}>
          ${t.map(({ from: e, to: t, value: n }) => {
			let r = `left:${e / aa * 100}%;width:${(t - e) / aa * 100}%;`;
			return n === "off" ? l`<span class="seg off" style=${r}>${this.compact ? u : this.offText}</span>` : l`<span class="seg" style=${r + this.color(n)}>
              ${this.compact ? u : `${i(this.lang, n, 1)}°`}
            </span>`;
		})}
        </div>
        ${this.now == null ? u : l`<span class="now" style=${`left:${this.now / aa * 100}%`}></span>`}
      </div>
      ${this.compact ? u : l`<div class="ticks" aria-hidden="true">
            ${[
			0,
			6,
			12,
			18,
			24
		].map((e) => l`<span style=${`left:${e / 24 * 100}%`}>${e}</span>`)}
          </div>`}`;
	}
	color(e) {
		let t = this.mode === "cool" ? (28 - e) / 10 : (e - 16) / 10, n = Math.round(25 + Math.min(1, Math.max(0, t)) * 75), r = this.mode === "cool" ? "cool" : "heat";
		return `background:color-mix(in srgb, var(--wk-${r}) ${n}%, var(--wk-${r}-weak));`;
	}
};
w([b({ attribute: !1 })], va.prototype, "points", void 0), w([b()], va.prototype, "mode", void 0), w([b({ attribute: !1 })], va.prototype, "now", void 0), w([b({
	type: Boolean,
	reflect: !0
})], va.prototype, "compact", void 0), w([b()], va.prototype, "lang", void 0), w([b()], va.prototype, "label", void 0), w([b()], va.prototype, "offText", void 0), p("joe-week-bar", va);
//#endregion
//#region src/editors/week-editor.ts
var ya = [
	"all",
	"week_weekend",
	"each"
], ba = "23:00", xa = "06:30", Sa = {
	tab: "household",
	section: "days"
};
function Ca(e, t, n = "long") {
	return new Intl.DateTimeFormat(e, {
		weekday: n,
		timeZone: "UTC"
	}).format(new Date(Date.UTC(2024, 0, 1 + t)));
}
var q = class extends o {
	constructor(...e) {
		super(...e), this.entityId = "", this.prefix = E, this.fetched = !1, this.failed = !1, this.drafts = {}, this.selected = {
			heat: 0,
			cool: 0
		}, this.open = 0, this.creating = !1, this.saving = !1, this.errors = {}, this.fitted = {}, this.loaded = !1, this.requested = !1;
	}
	static {
		this.styles = [f, S`
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
		this.hass && !this.requested && (this.requested = !0, this.load()), (e.has("config") || e.has("entityId")) && this.config && this.entityId && !this.loaded && (this.loaded = !0, this.drafts = structuredClone(this.room?.week?.modes ?? {}), this.fitDrafts(En), this.pickMode()), this.device && this.loaded && !this.mode && (this.fitDrafts(En), this.pickMode()), e.has("startMode") && this.mode && this.startMode && this.startMode !== this.mode && this.modes.includes(this.startMode) && this.showMode(this.startMode);
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
		this.fetched = !0, this.fitDrafts(En), this.pickMode();
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
					let a = ma(i, t, n, r);
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
		return En.filter((e) => this.device?.hvac_modes.includes(e));
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
		return pa(this.hass?.config?.time_zone);
	}
	openToday() {
		let e = this.profiles?.[this.index];
		this.open = e ? la(e.split, this.now.weekday) : 0;
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
		if (!e || !this.config) return u;
		let n = l`<div class="sheet-title">${c(e("week.title"))}</div>`;
		if (!t) return l`${n}
        ${this.fetched ? l`<div class="note warn">
              <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e(this.failed ? "week.load_failed" : "week.device_missing")}</span>
            </div>` : l`<p class="field-hint">${e("week.loading")}</p>`}
        <div class="actions" data-notip>
          <button type="button" class="btn btn-secondary" @click=${this.close}>${e("mode.close")}</button>
        </div>`;
		let r = this.modes, i = this.mode, o = this.profiles;
		return l`${n}
      <div class="head">
        <b>${a(t.device_id, t.name, e("climate.open_device", { id: t.entity_id }))}</b>
        ${t.area ? l`<span class="chip">${t.area}</span>` : u}
      </div>
      ${r.length ? l`<div class="field" data-tipped>
            <div class="field-label">${e("week.modes")} ${O(e, "week_mode")}</div>
            <span class="seg" role="group" aria-label=${e("week.modes")}>
              ${r.map((t) => l`<button type="button" aria-pressed=${String(t === i)} @click=${() => this.setMode(t)}>
                  ${e(`week.mode.${t}`)}${this.errors[t] ? l`<span class="dot bad" title=${this.errors[t]}></span>` : this.isDirty(t) ? l`<span class="dot" title=${e("week.unsaved")}></span>` : u}
                </button>`)}
            </span>
          </div>` : l`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("week.no_modes")}</span></div>`}
      ${i ? o ? this.renderSet(e, i, o) : this.renderEmpty(e, i) : u}
      <div class="foot" data-notip>
        ${i && this.errors[i] ? l`<div class="note warn" role="alert">
              <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("week.save_failed", {
			mode: e(`week.mode.${i}`),
			error: this.errors[i]
		})}</span>
            </div>` : u}
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
          ${r.some((e) => this.isDirty(e)) ? l`<span class="chip warn">${e("week.unsaved")}</span>` : u}
        </div>
      </div>`;
	}
	renderEmpty(e, t) {
		return l`<div class="empty" data-tipped>
      <p>${e("week.empty", { mode: e(`week.mode.${t}`) })}</p>
      <span class="with-tip">
        <button type="button" class="btn btn-primary" ?disabled=${this.creating} @click=${() => void this.create(t)}>
          ${e(this.creating ? "week.creating" : "week.create")}
        </button>
        ${O(e, "week_create")}
      </span>
    </div>`;
	}
	renderSet(e, t, n) {
		let r = this.status?.rooms?.[this.entityId], i = r?.kind === "week" && r.mode === t ? r.profile?.index : void 0, a = this.now, o = this.index, s = n[o];
		return l`<div class="field" data-tipped>
        <div class="field-label">${e("week.profiles")} ${O(e, "week_profiles")}</div>
        <div class="tiles" role="group" aria-label=${e("week.profiles")}>
          ${n.map((n, r) => {
			let s = n.name || e("week.profile", { n: r + 1 });
			return l`<button
              type="button"
              class="tile"
              aria-pressed=${String(r === o)}
              @click=${() => this.select(r)}
            >
              <span class="tile-top">
                <span class="no" aria-hidden="true">${r + 1}</span>
                <span class="name">${s}</span>
                ${r === i ? l`<span class="running" role="img" aria-label=${e("week.running")} title=${e("week.running")}></span>` : u}
              </span>
              <span class="tile-tags">
                ${n.tags.map((t) => l`<span><ha-icon icon=${sa[t]}></ha-icon>${e(`week.tag.${t}`)}</span>`)}
              </span>
              <joe-week-bar
                compact
                .points=${n.curves[la(n.split, a.weekday)] ?? n.curves[0] ?? []}
                .now=${a.minute}
                mode=${t}
                lang=${e.lang}
                label=${e("week.curve", { label: `${s}, ${e("week.today")}` })}
              ></joe-week-bar>
            </button>`;
		})}
        </div>
        ${n.some((e) => e.tags.includes("normal")) ? u : l`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("week.no_normal")}</span></div>`}
      </div>
      ${s ? this.renderProfile(e, t, n, s) : u}`;
	}
	renderProfile(e, t, n, r) {
		let i = this.index, a = this.status?.day, o = !a || a.home_office_available, s = a?.home_office_reason ?? "no_calendar";
		return l`<div class="profile">
      <div class="field" data-tipped>
        <div class="field-label"><label for="week-name">${e("week.name")}</label> ${O(e, "week_name")}</div>
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
        <div class="field-label">${e("week.tags")} ${O(e, "week_tags")}</div>
        <div class="tags" role="group" aria-label=${e("week.tags")}>
          ${Tn.map((t) => {
			let i = r.tags.includes(t), a = t === "home_office" && !o && !i;
			return l`<button
              type="button"
              class="mini-btn tag-btn"
              aria-pressed=${String(i)}
              ?disabled=${a}
              title=${a ? e(`week.ho.${s}`) : ""}
              @click=${() => this.toggleTag(n, t)}
            >
              <ha-icon icon=${sa[t]}></ha-icon>${e(`week.tag.${t}`)}
            </button>`;
		})}
        </div>
        ${o ? u : l`<p class="field-hint">${e(`week.ho.${s}`)}</p>
              <div>
                <a class="mini-btn quiet" href=${T(this.prefix, Sa)} @click=${C(Sa)}>
                  <ha-icon icon="mdi:calendar-text-outline"></ha-icon>${e("week.ho.rules")}
                </a>
              </div>`}
        ${r.tags.length ? u : l`<p class="field-hint">${e("week.untagged")}</p>`} ${this.noticeAt("tags")}
      </div>
      <div class="field" data-tipped>
        <div class="field-label">${e("week.days")} ${O(e, "week_split")}</div>
        <span class="seg full" role="group" aria-label=${e("week.days")}>
          ${ya.map((t) => l`<button type="button" aria-pressed=${String(r.split === t)} @click=${() => this.setSplit(t)}>
              ${e(`week.split.${t}`)}
            </button>`)}
        </span>
      </div>
      ${this.noticeAt("days")} ${this.renderGroups(e, t, r)}
    </div>`;
	}
	noticeAt(e) {
		return this.notice?.at === e ? l`<div class="note" role="status"><ha-icon icon="mdi:information-outline"></ha-icon><span>${this.notice.text}</span></div>` : u;
	}
	groupLabel(e, t, n) {
		return t === "all" ? e("week.group.all") : t === "week_weekend" ? e(n === 0 ? "week.group.weekdays" : "week.group.weekend") : Ca(e.lang, n);
	}
	renderGroups(e, t, n) {
		let r = this.now, a = la(n.split, r.weekday), o = n.curves.length > 1, { step: s, min: c, max: d } = this.limits, f = this.room;
		return l`<div class="field" data-tipped>
      <div class="field-label">${e("week.points")} ${O(e, "week_points")}</div>
      <p class="field-hint">
        ${e("week.limits", {
			min: i(e.lang, c, 1),
			max: i(e.lang, d, 1),
			step: i(e.lang, s, 2)
		})}
      </p>
      ${this.fitted[t] ? l`<div class="note" role="status"><ha-icon icon="mdi:information-outline"></ha-icon><span>${e("week.fitted")}</span></div>` : u}
      ${f?.night_off ? l`<p class="field-hint">
            ${this.config?.climate?.night_by === "entity" ? e("week.night_entity", { until: f.night_until ?? xa }) : e("week.night_time", {
			from: f.night_from ?? ba,
			until: f.night_until ?? xa
		})}
          </p>` : u}
      <div class="groups">
        ${n.curves.map((i, f) => {
			let p = this.groupLabel(e, n.split, f), m = !o || this.open === f, h = l`<span class="day-label">
              ${o ? l`<ha-icon icon=${m ? "mdi:chevron-down" : "mdi:chevron-right"}></ha-icon>` : u}${p}
              ${f === a ? l`<span class="chip ok">${e("week.today")}</span>` : u}
            </span>
            <joe-week-bar
              .points=${i}
              .now=${f === a ? r.minute : null}
              mode=${t}
              lang=${e.lang}
              offText=${e("week.off")}
              label=${e("week.curve", { label: p })}
            ></joe-week-bar>`;
			return l`<div class="group ${m ? "open" : ""}">
            ${o ? l`<button type="button" class="group-head" aria-expanded=${String(m)} @click=${() => this.openGroup(f)}>${h}</button>` : l`<div class="group-head">${h}</div>`}
            ${m ? this.renderPoints(e, n, f, i, {
				step: s,
				min: c,
				max: d
			}) : u}
          </div>`;
		})}
      </div>
    </div>`;
	}
	renderPoints(e, t, n, r, a) {
		let { step: o, min: s, max: c } = a, d = i(e.lang, o, 2), f = this.rowError?.curve === n ? this.rowError : void 0;
		return l`<div class="points" role="list" aria-label=${e("week.points")}>
        ${ra(r, ([e]) => e, ([t, r], i) => {
			let a = ua(t);
			return l`<div class="point" role="listitem">
              ${i === 0 ? l`<span class="time fixed" title=${e("week.point.first")}>00:00</span>` : l`<input
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
                ${r === "off" ? l`<span class="off-text">${e("week.off")}</span>` : l`<button
                        type="button"
                        class="mini-btn step"
                        aria-label=${e("week.point.less", { step: d })}
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
                        aria-label=${e("week.point.more", { step: d })}
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
              ${i === 0 ? l`<span class="del"></span>` : l`<button
                    type="button"
                    class="mini-btn quiet del"
                    aria-label=${e("week.point.delete", { time: a })}
                    title=${e("week.point.delete", { time: a })}
                    @click=${() => this.removePoint(n, i)}
                  >
                    <ha-icon icon="mdi:delete-outline"></ha-icon>
                  </button>`}
            </div>
            ${f?.point === i ? l`<p class="row-error" role="alert">${f.text}</p>` : u}`;
		})}
      </div>
      <div class="point-actions">
        <span class="with-tip" data-tipped>
          <button type="button" class="mini-btn" ?disabled=${r.length >= 12} @click=${() => this.addPoint(n)}>
            <ha-icon icon="mdi:plus"></ha-icon>${e("week.point.add")}
          </button>
          ${O(e, "week_add")}
        </span>
        ${t.curves.length > 1 ? this.renderCopy(e, t, n) : u}
      </div>
      ${r.length >= 12 ? l`<p class="field-hint">${e("week.point.max")}</p>` : u} ${this.noticeAt("points")}`;
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
				label: Ca(e.lang, t)
			}))
		];
		return l`<span class="with-tip" data-tipped>
      <select
        class="input copy"
        aria-label=${e("week.copy")}
        @change=${(e) => {
			let t = e.target, i = r.find((e) => e.value === t.value);
			t.value = "", i && this.copyTo(n, i.value, i.label);
		}}
      >
        <option value="" selected disabled>${e("week.copy")}</option>
        ${r.map((e) => l`<option value=${e.value}>${e.label}</option>`)}
      </select>
      ${O(e, "week_copy")}
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
			a >= 0 && (n[a].tags = n[a].tags.filter((e) => e !== t)), e.tags = Tn.filter((n) => n === t || e.tags.includes(n));
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
			t.curves = ha(t, e), t.split = e;
		});
		let i = ca[e] > ca[r] ? t("week.split.split") : r === "each" && e === "week_weekend" ? t("week.split.merged_days") : t("week.split.merged", { first: r === "each" ? Ca(t.lang, 0) : t("week.group.weekdays") });
		this.notice = {
			text: i,
			at: "days"
		}, this.open = la(e, this.now.weekday);
	}
	setTime(e, t, n) {
		let r = this.t, i = this.profiles?.[this.index]?.curves[e];
		if (!i) return;
		let a = i[t][0], o = da(n.value);
		if (o == null) {
			n.value = ua(a);
			return;
		}
		let s = Math.min(ia, Math.max(5, Math.round(o / 5) * 5));
		if (s === a) {
			n.value = ua(a);
			return;
		}
		if (i.some(([e], n) => n !== t && e === s)) {
			n.value = ua(a), this.rowError = {
				curve: e,
				point: t,
				text: r("week.point.duplicate", { time: ua(s) })
			};
			return;
		}
		n.value = ua(s), this.changeCurve(e, (e) => {
			e[t][0] = s;
		});
	}
	setValue(e, t, n) {
		let { step: r, min: i, max: a } = this.limits, o = ma(n, r, i, a);
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
			o = ma(Number(e ?? s ?? this.fallbackValue()), r, i, a);
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
		let r = ga(n);
		if (r == null) {
			this.notice = {
				text: t("week.point.no_room"),
				at: "points"
			};
			return;
		}
		let i = fa(n, r) ?? this.fallbackValue();
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
					[e]: wa(t)
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
			let n = _a(this.drafts[t]);
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
			let n = wa(t);
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
w([b({ attribute: !1 })], q.prototype, "hass", void 0), w([b({ attribute: !1 })], q.prototype, "t", void 0), w([b({ attribute: !1 })], q.prototype, "config", void 0), w([b({ attribute: !1 })], q.prototype, "status", void 0), w([b({ attribute: !1 })], q.prototype, "entityId", void 0), w([b({ attribute: !1 })], q.prototype, "found", void 0), w([b({ attribute: !1 })], q.prototype, "prefix", void 0), w([b({ attribute: !1 })], q.prototype, "startMode", void 0), w([y()], q.prototype, "device", void 0), w([y()], q.prototype, "fetched", void 0), w([y()], q.prototype, "failed", void 0), w([y()], q.prototype, "drafts", void 0), w([y()], q.prototype, "mode", void 0), w([y()], q.prototype, "selected", void 0), w([y()], q.prototype, "open", void 0), w([y()], q.prototype, "notice", void 0), w([y()], q.prototype, "rowError", void 0), w([y()], q.prototype, "creating", void 0), w([y()], q.prototype, "saving", void 0), w([y()], q.prototype, "errors", void 0), w([y()], q.prototype, "fitted", void 0);
function wa(e) {
	return String(e?.message ?? e);
}
p("joe-week-editor", q);
//#endregion
//#region src/pages/devices/climate-view.ts
var Ta = {
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
function Ea(e, t) {
	let n = /^week_program_(\d+)$/.exec(e);
	return n ? Number(n[1]) : t + 1;
}
function Da(e) {
	return JSON.stringify(Object.keys(e).sort().map((t) => [
		t,
		e[t]?.name ?? "",
		e[t]?.tags ?? []
	]));
}
function Oa(e, t, n, r) {
	let i = {
		...Ta,
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
function ka(e, t, n) {
	let r = t[e.entity_id]?.meter, i = n?.suggested?.[e.entity_id]?.device_id;
	return e.hvac_modes.some((e) => [
		"cool",
		"dry",
		"fan_only",
		"heat_cool"
	].includes(e)) || r != null && r !== "none" || i != null && i === e.device_id;
}
function Aa(e) {
	return !!e?.meter && e.meter !== "none";
}
function ja(e, t, n) {
	let r = e?.states[n]?.attributes, i = (e) => e == null || e === "" || !Number.isFinite(Number(e)) ? null : Number(e);
	return {
		current: i(r?.current_temperature ?? t?.current_temperature),
		target: i(r?.temperature ?? t?.temperature)
	};
}
function Ma(e, t) {
	let { current: n, target: r } = t;
	return n !== null && r !== null ? e("devices.card.climate", {
		current: i(e.lang, n, 1),
		target: i(e.lang, r, 1)
	}) : n === null ? void 0 : e("devices.card.temp", { value: i(e.lang, n, 1) });
}
function Na(e, t, n, r) {
	if (!n?.kind || n.kind === "legacy") return;
	if (n.override?.reason === "off") return e("week.why.off_by_hand");
	let i = n.target;
	if (n.kind === "device") {
		let n = i?.preset;
		if (!i) return e("week.as_is");
		if (i.hvac === "off") return e("week.state_off");
		if (!n) return;
		let a = (t.week_presets ?? []).indexOf(n);
		return oa(e("week.profile", { n: Ea(n, Math.max(0, a)) }), r[n]?.name);
	}
	return n.profile?.index == null ? i ? i.hvac === "off" ? e("week.state_off") : void 0 : e("week.as_is") : oa(e("week.profile", { n: n.profile.index + 1 }), n.profile.name);
}
function Pa(e, t, n) {
	if (t?.why) return e.optional(`week.why.${t.why}`, { min: n }) ?? e.optional(`climate.why.${t.why}`);
}
function Fa(e, t, n) {
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
var Ia = {
	tab: "household",
	section: "days"
}, La = {
	tab: "household",
	section: "night"
}, Ra = [
	"auto",
	"surplus",
	"cheap"
], J = class extends o {
	constructor(...e) {
		super(...e), this.prefix = E, this.devices = [], this.picking = !1, this.query = "", this.holdUntil = {}, this.pending = {}, this.moved = {}, this.weekError = {};
	}
	static {
		this.styles = [
			f,
			W,
			S`
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
			let e = this.state?.config.climate?.rooms ?? {}, t = Object.fromEntries(Object.entries(this.pending).filter(([t, n]) => Da(e[t]?.device_profiles ?? {}) !== Da(n)));
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
		if (!e || !t || !n) return u;
		if (n.unassigned && n.consumer) return this.renderUnassigned(e, t, n, n.consumer);
		let r = this.ctx, i = jr(r, n), a = Object.fromEntries((this.found?.devices ?? []).map((e) => [e.entity_id, e.name])), o = i.log ? {
			...i.log,
			names: a
		} : void 0, s = n.climate ?? this.found?.devices.find((e) => e.entity_id === n.id);
		if (!s) return Fr(r, {
			...i,
			log: o
		});
		let c = s.entity_id, d = t.climate?.rooms?.[c], f = Oa(s, t.config.climate?.rooms?.[c], d, this.profilesOf(c)), p = t.climate?.rates?.[c];
		return l`${Fr(r, {
			...i,
			live: Ma(e, ja(this.hass, s, c)),
			why: this.renderWhy(e, s, f, d),
			head: this.renderHead(e, t, s, f, d),
			now: f.room.enabled ? this.renderNowSection(e, s, f, d) : void 0,
			steer: this.renderSteer(e, t, s, f, d),
			power: this.renderPower(e, t, n, s),
			learned: f.room.enabled || p ? l`<p class="learned-line">${Si(e, p)}</p>` : void 0,
			learnedArea: "climate",
			log: o,
			tips: { power: "climate_meter" }
		})}
    ${this.sub === "week" ? this.renderWeekSheet(e, t, s) : u}`;
	}
	nowShown(e, t) {
		if (!e.room.enabled || !t?.kind || t.kind === "legacy") return !1;
		if (e.cooling && !e.programs.length) return !!e.room.week?.enabled && e.sets.length > 0 && t.pending !== "start";
		let n = this.profilesOf(this.entry?.id ?? ""), r = e.programs.flatMap((e) => n[e]?.tags ?? []);
		return e.programs.length > 0 && r.length > 0 && t.kind === "device";
	}
	renderWhy(e, t, n, r) {
		if (!n.room.enabled) return e("climate.room.off");
		let i = n.cooling && !n.programs.length && n.room.week?.enabled && n.sets.length && r?.pending !== "start" && r?.kind === "legacy" ? l`<span class="week-now quiet">
            ${e("week.legacy_now", { state: this.hvacText(e, this.hass?.states[t.entity_id]?.state ?? t.state) })}
          </span>` : u, a = r && n.legacy ? e.optional(`climate.now.${r.why}`, { min: this.awayAfter }) ?? "" : "";
		return l`${this.nowShown(n, r) ? this.nowLine(e, t, r) : u} ${i}
    ${a ? l`<span class="week-now quiet">${a}</span>` : u}`;
	}
	nowLine(e, t, n) {
		let r = n.override;
		if (r?.reason === "off") return l`<span class="week-now"><ha-icon icon="mdi:power"></ha-icon><span>${e("week.override.off")}</span></span>`;
		if (r) {
			let t = r.reason === "preset" ? r.until ? e("week.override.preset", { time: r.until }) : e("week.override.preset_open") : r.until ? e("week.override.manual", { time: r.until }) : e("week.override.manual_open");
			return l`<span class="week-now"><ha-icon icon="mdi:hand-back-right-outline"></ha-icon><span>${t}</span></span>`;
		}
		let a = n.target, o = [];
		if (n.kind === "device") {
			let n = a?.preset;
			if (!a) o.push(e("week.as_is"));
			else if (a.hvac === "off") o.push(e("week.state_off"));
			else if (n) {
				let r = (t.week_presets ?? []).indexOf(n), i = e("week.profile", { n: Ea(n, Math.max(0, r)) });
				o.push(oa(i, this.profilesOf(t.entity_id)[n]?.name));
			}
		} else {
			if (o.push(a ? a.hvac === "off" ? e("week.state_off") : e(`week.mode.${n.mode === "heat" ? "heat" : "cool"}`) : e("week.as_is")), n.profile?.index != null) {
				let t = oa(e("week.profile", { n: n.profile.index + 1 }), n.profile.name);
				o.push(n.profile.held && n.why !== "held" ? `${t} (${e("week.held")})` : t);
			}
			a && a.hvac !== "off" && a.temperature != null && o.push(`${i(e.lang, a.temperature, 1)} °C`), n.next && o.push(e("week.next", {
				time: n.next.at,
				value: this.valueText(e, n.next.value)
			}));
		}
		let s = e.optional(`week.why.${n.why}`, { min: this.awayAfter });
		return l`<span class="week-now">
      <span>${e(n.would ? "week.would" : "week.now", { text: o.join(" · ") || "–" })}</span>
      ${s ? l`<span class="chip">${s}</span>` : u}
    </span>`;
	}
	valueText(e, t) {
		return t === "off" ? e("week.off") : `${i(e.lang, t, 1)} °C`;
	}
	renderHead(e, t, n, r, i) {
		let a = this.nowShown(r, i) ? this.weekError[n.entity_id] ?? i?.error : void 0, o = t.config.climate?.enabled;
		return l`<div class="head-extra">
      ${a ? l`<div class="note warn" role="alert">
            <ha-icon icon="mdi:alert-outline"></ha-icon>
            <span>${e.optional(`week.error.${a}`) ?? e("week.error", { error: a })}</span>
          </div>` : u}
      ${!o && r.room.enabled ? Yr(e, this.prefix, {
			label: e("climate.enabled"),
			value: e("climate.device.main_off"),
			to: {
				tab: "devices",
				section: "climate"
			}
		}) : u}
      <details class="ent" data-notip><summary>${e("climate.entity")}</summary><code>${n.entity_id}</code></details>
    </div>`;
	}
	renderNowSection(e, t, n, r) {
		let i = this.nowShown(n, r) && r?.override && r.override.reason !== "off", a = n.cooling && !n.programs.length && !!n.room.week?.enabled && n.sets.length > 0;
		if (i || a) return l`${i ? l`<div class="row" data-tipped>
          <span>${e("week.why.override")}</span>
          <button type="button" class="btn btn-secondary" @click=${() => void this.resume(t)}>${e("week.resume")}</button>
          ${O(e, "week_resume")}
        </div>` : u}
    ${a ? this.renderHold(e, t, n.room, n.sets, r) : u}`;
	}
	renderHold(e, t, n, r, i) {
		let a = t.entity_id, o = i?.mode ?? this.hass?.states[a]?.state ?? t.state, s = n.week?.modes?.[o === "heat" ? "heat" : "cool"] ?? r[0], c = i?.hold ?? null, d = c && c.mode === o ? c : null, f = d ? d.profile : null, p = d ? d.until ? "midnight" : "forever" : this.holdUntil[a] ?? "midnight", m = (t) => oa(e("week.profile", { n: t.profile + 1 }), n.week?.modes?.[t.mode]?.[t.profile]?.name), h = i?.want, g = d && (h === "night" || h === "away") ? h : null;
		return l`<div data-tipped>
      <div class="row">
        <span>${e("week.hold")}</span>
        ${O(e, "week_hold")}
      </div>
      <div class="row hold">
        <select
          class="input"
          aria-label=${e("week.hold")}
          .value=${f == null ? "" : String(f)}
          @change=${(e) => {
			let n = e.target.value;
			this.hold(t, n === "" ? null : Number(n), p);
		}}
        >
          <option value="" ?selected=${f == null}>${e("week.hold.auto")}</option>
          ${s.map((t, n) => l`<option value=${String(n)} ?selected=${f === n}>${oa(e("week.profile", { n: n + 1 }), t.name)}</option>`)}
        </select>
        <span class="seg" role="group" aria-label=${e("week.hold.until")}>
          ${["midnight", "forever"].map((n) => l`<button
              type="button"
              aria-pressed=${String(p === n)}
              @click=${() => {
			d ? n !== p && this.hold(t, d.profile, n) : this.holdUntil = {
				...this.holdUntil,
				[a]: n
			};
		}}
            >
              ${e(`week.hold.${n}`)}
            </button>`)}
        </span>
      </div>
      ${g && d ? l`<p class="hint">${e(`week.hold.later_${g}`, { profile: m(d) })}</p>` : u}
      ${c && !d ? l`<div class="note" role="status">
            <ha-icon icon="mdi:information-outline"></ha-icon>
            <span class="note-body">
              <span>
                ${e("week.hold.other_mode", {
			profile: m(c),
			mode: e(`week.mode.${c.mode}`),
			until: e(`week.hold.${c.until ? "midnight" : "forever"}`)
		})}
              </span>
              <button type="button" class="mini-btn" @click=${() => void this.hold(t, null, p)}>${e("week.hold.lift")}</button>
            </span>
          </div>` : u}
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
		let { room: a, cooling: o, presets: s, programs: c, sets: d, deviceRuns: f, legacy: p, awayTagged: m, awayWays: h, away: g } = r;
		return l`<div class="row" data-tipped>
        <span>${e("climate.room.steer")}</span>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(a.enabled)}
          aria-label=${e("climate.room.enabled", { name: n.name })}
          @click=${() => this.save(n, { enabled: !a.enabled })}
        ></button>
        ${O(e, "climate_room")}
      </div>
      ${a.enabled ? l`${o && !c.length ? this.renderWeek(e, n, a, d, i) : u}
          ${c.length ? this.renderPrograms(e, n, c, i) : u}
          ${!m || p ? l`<div class="row" data-tipped>
                  <span>${e("climate.away")}</span>
                  <span class="seg" role="group" aria-label=${e("climate.away")}>
                    ${h.map((t) => l`<button type="button" aria-pressed=${String(g === t)} @click=${() => this.save(n, { away: t })}>
                        ${e(f && t === "setback" ? "devprof.away_keep" : `climate.away.${t}`)}
                      </button>`)}
                  </span>
                  ${O(e, p ? "climate_away" : f ? "devprof_away" : "week_away")}
                </div>
                ${p ? u : l`<p class="hint">${e("week.away_fallback")}</p>`}
                ${g === "setback" && !f ? l`<div class="row" data-tipped>
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
                      ${O(e, p ? "climate_away" : "week_away")}
                    </div>` : u}
                ${p && a.away === "preset" ? l`<div data-tipped>
                      ${this.presetRow(e, n, s, "away_preset", a.away_preset, "climate.away_preset")}
                    </div>` : u}` : u}
          ${p && s.length ? l`<div data-tipped>
                ${this.presetRow(e, n, s, "free_day_preset", a.free_day_preset, "climate.free_day_preset", !0)}
              </div>` : u}
          ${o ? this.renderNight(e, t, n, a) : u}` : u}`;
	}
	daysLink(e) {
		return l`<a class="mini-btn quiet" href=${T(this.prefix, Ia)} @click=${C(Ia)}>
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
		return l`<div class="sub" data-tipped>
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
        ${O(e, "climate_week")}
      </div>
      ${i?.pending ? l`<p class="hint">${e(i.pending === "start" ? "week.pending.start" : "week.pending.end")}</p>` : u}
      ${a ? l`${r.length ? u : l`<p class="hint">${e("week.no_sets")}</p>`}
            <div class="row">
              <a class="btn btn-secondary" href=${T(this.prefix, o)} @click=${C(o, { sheet: !0 })}>
                <ha-icon icon="mdi:calendar-clock"></ha-icon>${e("week.edit")}
              </a>
            </div>` : u}
    </div>`;
	}
	renderPrograms(e, t, n, r) {
		let i = this.profilesOf(t.entity_id), a = n.flatMap((e) => i[e]?.tags ?? []), o = this.state?.climate?.day, s = !o || o.home_office_available, c = o?.home_office_reason ?? "no_calendar", d = this.hass?.states[t.entity_id]?.state ?? t.state;
		return l`<div class="sub" data-tipped>
      <div class="row">
        <span class="sub-title">${e("devprof.title")}</span>
        ${O(e, "climate_device_profiles")}
      </div>
      ${r?.pending ? l`<p class="hint">${e(r.pending === "start" ? "devprof.pending.start" : "devprof.pending.end")}</p>` : u}
      ${n.map((r, a) => {
			let o = i[r] ?? {
				name: "",
				tags: []
			}, u = e("week.profile", { n: Ea(r, a) });
			return l`<div class="preset">
          <div class="preset-name">
            <input
              class="input"
              type="text"
              maxlength="30"
              placeholder=${u}
              aria-label=${e("devprof.name", { preset: u })}
              .value=${o.name}
              @change=${(e) => this.savePrograms(t, n, r, { name: e.target.value.trim().slice(0, 30) })}
            />
            <code>${r}</code>
          </div>
          <div class="tags" role="group" aria-label=${e("devprof.tags", { preset: u })}>
            ${Tn.map((i) => {
				let a = o.tags.includes(i), u = i === "home_office" && !s && !a;
				return l`<button
                type="button"
                class="mini-btn tag-btn"
                aria-pressed=${String(a)}
                ?disabled=${u}
                title=${u ? e(`week.ho.${c}`) : ""}
                @click=${() => this.toggleProgramTag(e, t, n, r, i)}
              >
                <ha-icon icon=${sa[i]}></ha-icon>${e(`week.tag.${i}`)}
              </button>`;
			})}
          </div>
        </div>`;
		})}
      ${this.moved[t.entity_id] ? l`<div class="note" role="status"><ha-icon icon="mdi:information-outline"></ha-icon><span>${this.moved[t.entity_id]}</span></div>` : u}
      ${a.length && !a.includes("normal") ? l`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("devprof.need_normal")}</span></div>` : u}
      ${r?.why === "manual_mode" ? l`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("devprof.not_auto", { state: this.hvacText(e, d) })}</span>
          </div>` : u}
      ${s ? u : l`<p class="hint">${e(`week.ho.${c}`)}</p>
            <div class="row">${this.daysLink(e)}</div>`}
    </div>`;
	}
	toggleProgramTag(e, t, n, r, i) {
		let a = this.profilesOf(t.entity_id), o = (a[r]?.tags ?? []).includes(i), s = o ? void 0 : n.find((e) => e !== r && a[e]?.tags.includes(i)), c = (t) => a[t]?.name || e("week.profile", { n: Ea(t, n.indexOf(t)) });
		this.moved = {
			...this.moved,
			[t.entity_id]: s ? e("devprof.moved", {
				tag: e(`week.tag.${i}`),
				to: c(r),
				from: c(s)
			}) : ""
		};
		let l = o ? a[r].tags.filter((e) => e !== i) : Tn.filter((e) => e === i || a[r]?.tags.includes(e));
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
		Da(o) !== Da(a) && (this.pending = {
			...this.pending,
			[i]: o
		}, P(this, { climate: { rooms: { [i]: { device_profiles: o } } } }).then((e) => {
			if (!e && this.pending[i] === o) {
				let { [i]: e, ...t } = this.pending;
				this.pending = t;
			}
		}));
	}
	presetRow(e, t, n, r, i, a, o = !1) {
		return l`<div class="row">
      <span>${e(a)}</span>
      <select
        class="input"
        aria-label=${e(a)}
        @change=${(e) => this.save(t, { [r]: e.target.value || null })}
      >
        ${o ? l`<option value="" ?selected=${!i}>${e("climate.no_preset")}</option>` : u}
        ${!o && !i ? l`<option value="" selected disabled>${e("climate.pick_preset")}</option>` : u}
        ${n.map((e) => l`<option value=${e} ?selected=${e === i}>${e}</option>`)}
      </select>
      ${O(e, o ? "climate_free_day" : "climate_away")}
    </div>`;
	}
	renderNight(e, t, n, r) {
		let i = (t, r) => l`<input
      class="input short"
      type="time"
      aria-label=${e(`climate.${t}`)}
      .value=${r}
      @change=${(e) => {
			let r = e.target.value;
			/^\d{1,2}:\d{2}$/.test(r) && this.save(n, { [t]: r });
		}}
    />`, a = Fa(e, this.hass, t);
		return l`<div class="sub" data-tipped>
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
        ${O(e, "climate_night")}
      </div>
      ${r.night_off ? t.config.climate?.night_by === "entity" ? l`<div class="row">
              <span>${e("climate.night_back")}</span>
              ${i("night_until", r.night_until)}
            </div>` : l`<div class="row">
              <span>${e("climate.night_span")}</span>
              ${i("night_from", r.night_from)} – ${i("night_until", r.night_until)}
            </div>` : u}
      <div class="night-mirror">
        ${Yr(e, this.prefix, {
			label: e("climate.mirror.night"),
			value: a.text,
			to: La,
			action: a.set ? "change" : "set"
		})}
      </div>
    </div>`;
	}
	save(e, t) {
		P(this, { climate: { rooms: { [e.entity_id]: t } } });
	}
	renderPower(e, t, n, r) {
		let i = t.config.climate?.rooms ?? {}, a = (this.found?.devices ?? []).filter((e) => ka(e, i, this.found)), o = a.some((e) => e.entity_id === r.entity_id), s = this.movedNote(e);
		if (o || n.consumer || s) return l`${o ? l`<p class="hint">${e("climate.meters.say")}</p>
          ${(this.found?.meters ?? []).length ? u : l`<p class="hint">${e("climate.meter.no_meters")}</p>`}
          ${this.meterLine(e, r, a, i)}` : u}
    ${n.consumer ? this.consumerRows(e, n.consumer) : u} ${s}`;
	}
	meterLine(e, t, n, r) {
		let i = r[t.entity_id]?.meter ?? null, o = i && i !== "none" ? i : null, s = i == null ? this.found?.suggested?.[t.entity_id] : void 0, c = o ? n.filter((e) => e.entity_id !== t.entity_id && this.sameMeter(r[e.entity_id]?.meter, o)) : [], d = o?.power ? this.hass?.states[o.power] : void 0, f = o ? this.option(o) ?? null : s ?? null;
		return l`<div class="meter">
      <div class="meter-pick">
        ${this.picking ? this.meterSearch(e, t) : l`<span class="picked-row">
              <span class="picked">
                ${f ? l`<b>${a(f.device_id, `${f.name ?? f.device_id}${f.sensor ? ` · ${f.sensor}` : ""}`, e("climate.open_meter"))}</b>
                      ${f.via ? l`<small class="via">${f.via}</small>` : u}
                      ${f.area ? l`<small>${f.area}</small>` : u}` : o ? l`<b>${a(o.device_id, o.power ?? o.energy ?? o.device_id, e("climate.open_meter"))}</b>` : l`<small>${e(i === "none" ? "climate.meter.without_long" : "climate.meter.open_long")}</small>`}
              </span>
              ${f ? U(e, this.meterTarget(f)) : o ? U(e, this.meterTarget(o)) : u}
            </span>`}
      </div>
      ${this.picking ? u : l`<div class="state">
            ${o ? l`<span class="chip ok">${d ? this.reading(e, d) : e("climate.meter.linked")}</span>
                  <button type="button" class="mini-btn" @click=${() => this.startPicking()}>${e("climate.meter.change")}</button>` : s ? l`<button type="button" class="btn btn-secondary" @click=${() => this.save(t, { meter: this.meterOf(s) })}>
                      ${e("climate.meter.confirm")}
                    </button>
                    <button type="button" class="mini-btn" @click=${() => this.startPicking()}>${e("climate.meter.other_short")}</button>` : l`<button type="button" class="mini-btn" @click=${() => this.startPicking()}>${e("climate.meter.search")}</button>`}
          </div>`}
      ${o?.power || o?.energy ? l`<details class="ent">
            <summary>${e("climate.entities")}</summary>
            ${o.power ? l`<code>${o.power}</code>` : u}
            ${o.energy ? l`<code>${o.energy}</code>` : u}
          </details>` : u}
      ${c.length ? l`<p class="hint">${e("climate.meter.shared", { names: c.map((e) => e.name).join(", ") })}</p>` : u}
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
		return l`<input
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
        ${r.map((n) => l`<div class="hit-row">
            <button type="button" role="option" class="hit" @click=${() => this.pickMeter(t, this.key(n))}>
              <b>${n.name ?? n.device_id}${n.sensor ? ` · ${n.sensor}` : ""}</b>
              <small>${[
			n.via,
			n.area,
			n.power ? this.readingOf(e, n.power) : ""
		].filter(Boolean).join(" · ")}</small>
            </button>
            ${U(e, this.meterTarget(n))}
          </div>`)}
        ${r.length ? u : l`<small class="none">${e("climate.meter.no_hits")}</small>`}
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
		return `${t.state !== "" && Number.isFinite(n) ? i(e.lang, n, n % 1 ? 1 : 0) : t.state} ${String(t.attributes.unit_of_measurement ?? "")}`.trim();
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
		return l`<div class="consumer">
      <div class="consumer-name">
        <span>${e("climate.consumer")}</span><b>${t.name}</b>${n ? l`<span>${n}</span>` : u}
      </div>
      <div class="row" data-tipped>
        <span>${e("consumers.kind")}</span>
        <select
          class="input"
          aria-label=${e("consumers.kind_of", { name: t.name })}
          .value=${t.kind}
          @change=${(e) => this.setKind(t, e.target.value)}
        >
          ${Sn.map((n) => l`<option value=${n} ?selected=${n === t.kind}>${e(`kind.${n}`)}</option>`)}
        </select>
        ${O(e, "f_consumer_kind")}
      </div>
      ${t.kind === "submeter" ? u : l`<div class="row" data-tipped>
            <span>${e("consumers.runs")}</span>
            <select
              class="input"
              aria-label=${e("consumers.runs_of", { name: t.name })}
              .value=${r}
              @change=${(e) => this.setRuns(t, e.target.value)}
            >
              ${Ra.map((t) => l`<option value=${t} ?selected=${t === r}>${e(`runs.${t}`)}</option>`)}
            </select>
            ${O(e, "f_consumer_runs")}
          </div>`}
    </div>`;
	}
	setKind(e, t) {
		t !== e.kind && (this.kindChanged = e.id, P(this, { consumers: { [e.id]: { kind: t } } }));
	}
	setRuns(e, t) {
		t !== (e.runs ?? "auto") && P(this, { consumers: { [e.id]: { runs: t } } });
	}
	movedNote(e) {
		let t = this.kindChanged, n = t ? this.devices.find((e) => e.group !== "climate" && (e.consumer?.id === t || e.id === t)) : void 0;
		if (!n) return;
		let r = Ut(n);
		return l`<div class="note" role="status">
      <ha-icon icon="mdi:information-outline"></ha-icon>
      <a class="mini-btn go" href=${T(this.prefix, r)} @click=${C(r)}
        >${e("climate.moved", {
			name: n.name,
			group: e(`nav.devices.${n.group}`)
		})}</a
      >
    </div>`;
	}
	renderUnassigned(e, t, n, r) {
		let i = this.ctx, a = this.found?.devices ?? [], o = t.config.climate?.rooms ?? {}, s = r.power_entity ? this.readingOf(e, r.power_entity) : "", c = n.deviceId && a.length ? l`<div class="row" data-tipped>
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
              ${a.map((t) => l`<option value=${t.entity_id}>
                  ${Aa(o[t.entity_id]) ? e("climate.assign.has_meter", { name: t.name }) : t.name}${t.area ? ` · ${t.area}` : ""}
                </option>`)}
            </select>
            ${O(e, "climate_assign")}
          </div>` : l`<p class="hint">${e(n.deviceId ? "climate.assign.no_climate" : "climate.assign.no_device")}</p>`;
		return Fr(i, {
			...jr(i, n),
			live: s || void 0,
			why: e("climate.unassigned.lead"),
			power: l`${c} ${this.consumerRows(e, r)} ${this.movedNote(e) ?? u}`
		});
	}
	async assign(e, t, n) {
		if (!e.deviceId) return;
		let r = {
			device_id: e.deviceId,
			power: t.power_entity,
			energy: t.energy_entity
		};
		await P(this, { climate: { rooms: { [n]: { meter: r } } } }) && D(this, {
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
		}, i = this.route?.rest?.[0], a = En.find((e) => e === i);
		return l`<joe-sheet label=${e("week.label")} closeLabel=${e("common.close")} wide @joe-close=${() => ge(this, r)}>
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
		D(this, this.weekRoute(e, t), {
			replace: !0,
			sheet: n
		});
	}
};
w([b({ attribute: !1 })], J.prototype, "hass", void 0), w([b({ attribute: !1 })], J.prototype, "t", void 0), w([b({ attribute: !1 })], J.prototype, "state", void 0), w([b({ attribute: !1 })], J.prototype, "route", void 0), w([b({ attribute: !1 })], J.prototype, "prefix", void 0), w([b({ attribute: !1 })], J.prototype, "found", void 0), w([b({ attribute: !1 })], J.prototype, "devices", void 0), w([b({ attribute: !1 })], J.prototype, "entry", void 0), w([b({ attribute: !1 })], J.prototype, "sub", void 0), w([y()], J.prototype, "picking", void 0), w([y()], J.prototype, "query", void 0), w([y()], J.prototype, "holdUntil", void 0), w([y()], J.prototype, "pending", void 0), w([y()], J.prototype, "moved", void 0), w([y()], J.prototype, "weekError", void 0), w([y()], J.prototype, "kindChanged", void 0), p("joe-climate-device", J);
//#endregion
//#region src/pages/devices/climate.ts
var za = {
	tab: "household",
	section: "days"
}, Ba = class extends G {
	constructor(...e) {
		super(...e), this.failed = !1, this.list = [];
	}
	static {
		this.styles = [
			f,
			W,
			S`
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
		].some((t) => e.has(t)) && (this.list = !this.climateFound && this.own && this.t && this.state ? Zt(this.t, this.state, this.hass, {
			climateFound: this.own,
			discovery: this.discovery,
			checks: this.checks
		}) : this.devices);
	}
	render() {
		let { t: e, state: n } = this;
		if (!e || !n) return u;
		let r = this.entity ? $t(this.list, "climate", this.entity) : void 0;
		if (r) return l`<joe-climate-device
        .t=${e}
        .hass=${this.hass}
        .state=${n}
        .prefix=${this.prefix}
        .route=${this.route}
        .found=${this.found}
        .devices=${this.list}
        .entry=${r}
        .sub=${this.sub}
      ></joe-climate-device>`;
		let i = n.config.climate ?? {
			enabled: !1,
			rooms: {}
		}, a = this.found, o = this.list.filter((e) => e.group === "climate" && !e.unassigned), s = this.list.filter((e) => e.group === "climate" && e.unassigned), d = [...new Set(o.map((t) => t.area ?? e("climate.no_area")))], f = (a?.devices ?? []).filter((e) => ka(e, i.rooms ?? {}, a)), p = f.filter((e) => Aa(i.rooms?.[e.entity_id]) || o.some((t) => t.id === e.entity_id && t.consumer)).length;
		return l`<div class="wrap">
      <div class="intro">
        <div>
          ${c(e("climate.title"))} ${t}
          <p class="lead">${e("climate.lead")}</p>
          ${o.length ? l`<p class="with-tip" data-tipped>${e("climate.ha_open")} ${O(e, "ha_open")}</p>` : u}
        </div>
        <joe-pose name="relax"></joe-pose>
      </div>
      ${this.entity === void 0 ? u : this.renderLost(e)} ${this.renderMain(e, n, i.enabled)}
      ${this.renderHousehold(e, n)}
      ${this.failed && !a ? l`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("climate.failed")}</span></div>` : u}
      ${a && !a.devices.length ? l`<p class="hint">${e("climate.none")}</p>` : u}
      ${o.length ? l`<div class="list-head">
            <h3 class="group-label">${e("climate.list")}</h3>
            ${f.length ? l`<span class="chip">${e("climate.meters.count", {
			linked: p,
			all: f.length
		})}</span>` : u}
          </div>` : u}
      ${d.map((t) => l`<div class="group-label area">${t}</div>
          <div class="dcards">
            ${o.filter((n) => (n.area ?? e("climate.no_area")) === t).map((t) => this.renderCard(e, n, t))}
          </div>`)}
      ${s.length ? l`<div class="group-head list-head">
              <span class="group-label">${e("devices.unassigned")}</span><i class="dcard-dot" aria-hidden="true"></i>
            </div>
            <p class="unassigned-text">${e("devices.unassigned.text")}</p>
            <div class="dcards">
              ${s.map((t) => mr(e, this.prefix, _r(e, this.hass, n, t)))}
            </div>` : u}
    </div>`;
	}
	renderLost(e) {
		let t = this.entity, n = this.list.find((e) => e.group !== "climate" && (e.id === t || e.consumer?.id === t));
		if (!n) return kr(e);
		let r = Ut(n);
		return l`<div class="note" role="status">
      <ha-icon icon="mdi:information-outline"></ha-icon>
      <a class="mini-btn go" href=${T(this.prefix, r)} @click=${C(r, { replace: !0 })}
        >${e("climate.moved", {
			name: n.name,
			group: e(`nav.devices.${n.group}`)
		})}</a
      >
    </div>`;
	}
	renderCard(e, t, n) {
		let r = n.climate, i = t.climate?.rooms?.[n.id], a = t.config.climate?.rooms?.[n.id], o = Ma(e, ja(this.hass, r, n.id)), s = r && a?.enabled ? Na(e, r, i, a.device_profiles ?? {}) : void 0, c = a?.enabled ? Pa(e, i, t.config.climate?.away_after_min ?? 15) : void 0, d = Aa(a) || n.consumer, f = l`${o ? l`<span class="cl">${o}</span>` : u}
      ${s ? l`<span class="cl">${s}</span>` : u}
      ${c || d ? l`<span class="cl chips">
            ${c ? l`<span class="chip">${c}</span>` : u}
            ${d ? l`<span class="chip ok">${e("climate.card.measured")}</span>` : u}
          </span>` : u}`;
		return mr(e, this.prefix, _r(e, this.hass, t, n, {
			state: f,
			area: void 0
		}));
	}
	renderHousehold(e, t) {
		let n = t.config.context.presence_entity ?? null, r = n ? this.hass?.states[n]?.attributes.friendly_name ?? n : null, i = t.climate?.day, a = i ? i.holiday ? "holiday" : i.weekend && i.free ? "weekend" : "workday" : null, o = a ? [e(`climate.mirror.today.${a}`), i?.home_office_available && i.home_office.length ? e("climate.mirror.today.ho", { names: i.home_office.join(", ") }) : ""].filter(Boolean).join(", ") : e("climate.mirror.unknown"), s = Fa(e, this.hass, t);
		return l`<section class="card household">
      ${Yr(e, this.prefix, {
			label: e("climate.mirror.presence"),
			value: r ? l`<span title=${n ?? ""}>${r}</span>` : e("climate.mirror.presence.none"),
			to: {
				tab: "household",
				section: "presence"
			},
			action: r ? "change" : "set"
		})}
      ${Yr(e, this.prefix, {
			label: e("climate.mirror.today"),
			value: o,
			to: za
		})}
      ${Yr(e, this.prefix, {
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
		return l`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:thermostat-auto"></ha-icon>${e("climate.enabled")}</div>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(n)}
          aria-label=${e("climate.enabled")}
          @click=${() => P(this, { climate: { enabled: !n } })}
        ></button>
        ${O(e, "climate_enabled")}
      </div>
      <p class="hint">${e(t.mode === "live" ? "climate.live" : "climate.not_live")}</p>
    </section>`;
	}
};
w([b({ attribute: !1 })], Ba.prototype, "entity", void 0), w([b({ attribute: !1 })], Ba.prototype, "sub", void 0), w([y()], Ba.prototype, "own", void 0), w([y()], Ba.prototype, "failed", void 0), p("joe-climate-group", Ba);
//#endregion
//#region src/components/finding-rows.ts
var Va = S`
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
	return l`<button type="button" class="mini-btn ${r ? "quiet" : ""}" @click=${n}>
    ${t ? l`<ha-icon icon=${t}></ha-icon>` : u}${e}
  </button>`;
}
function Ha(e) {
	return l`<div class="note"><ha-icon icon="mdi:information-outline"></ha-icon><span>${e}</span></div>`;
}
function Ua(e, t) {
	let n = t.aside && t.aside !== u;
	return l`<li class="item ${t.state ?? ""} ${n ? "has-aside" : ""}" ?data-tipped=${!!(t.actions?.length && t.tip)}>
    <span class="ico-box"><ha-icon icon=${t.icon}></ha-icon></span>
    <div class="text">
      <div class="head">
        <span class="t">${t.title}</span>
        ${t.chips?.length ? l`<span class="chips">${t.chips}</span>` : u}
      </div>
      <div class="d">${t.detail}</div>
      ${t.reasons?.length ? l`<details data-notip>
            <summary>${e("scan.why")}</summary>
            <ul>
              ${t.reasons.map((t) => l`<li>${g(e, t)}</li>`)}
            </ul>
          </details>` : u}
      ${t.notes ?? u}
      ${t.actions?.length ? l`<div class="row-actions">${t.actions}${t.tip ? O(e, t.tip) : u}</div>` : u}
    </div>
    ${n ? l`<span class="row-aside">${t.aside}</span>` : u}
  </li>`;
}
function Wa(e, t) {
	return l`<ul class="found">
    ${t.map((t) => Ua(e, t))}
  </ul>`;
}
var Ga = {
	weather: "weather_entity",
	holiday: "holiday_entity"
};
function Ka(e, t, r, i, a, o, s) {
	let c = Ga[o], l = i.context[c], u = a?.[o] ?? null, d = {
		key: o,
		icon: o === "weather" ? "mdi:weather-partly-cloudy" : "mdi:calendar-star",
		title: r(o === "weather" ? "find.weather" : "find.holiday"),
		tip: o === "weather" ? "review_weather" : "review_holiday"
	}, f = () => void qa(e, r, i, a, o);
	if (l) {
		let a = u?.entity.entity_id === l;
		return {
			...d,
			detail: n(t, l),
			chips: [A(r, j(i, `context.${c}`)), ...u && a ? [h(r, u.confidence)] : []],
			reasons: a ? u?.reasons : void 0,
			aside: s?.(l),
			actions: [Y(r("review.change"), "mdi:magnify", f), Y(r("review.ignore"), "", () => P(e, {
				context: { [c]: null },
				answers: { ignored: N(i, o, !0) }
			}), !0)]
		};
	}
	return M(i, o) ? {
		...d,
		detail: r("review.ignored"),
		state: "ignored",
		actions: [Y(r("review.use"), "mdi:undo-variant", f)]
	} : {
		...d,
		detail: r("find.none"),
		state: "missing",
		notes: [Ha(r(o === "weather" ? "review.weather.none" : "review.holiday.none"))],
		actions: [Y(r("review.choose"), "mdi:magnify", f)]
	};
}
async function qa(e, t, n, r, i) {
	let a = Ga[i], o = r?.[i], s = n.context[a], c = (await F(e, {
		heading: t(i === "weather" ? "pick.weather.title" : "pick.holiday.title"),
		tip: i === "weather" ? "pick_weather" : "pick_holiday",
		filter: i === "weather" ? "weather" : "workday",
		selected: s ? [s] : o ? [o.entity.entity_id] : [],
		suggestions: Pe(o ? [Fe(o)] : [], o?.alternatives)
	}))?.selected[0];
	c && P(e, {
		context: { [a]: c },
		answers: { ignored: N(n, i, !1) }
	});
}
function Ja(e, t, n) {
	let [r, a] = e(n).split("|");
	return `${i(e.lang, t, 0)} ${t === 1 ? r : a}`;
}
function Ya(e, t, n = []) {
	return l`<div class="note ${t.level}">
    <ha-icon icon=${t.level === "warn" ? "mdi:alert-outline" : "mdi:information-outline"}></ha-icon>
    <div>
      <span>${Ft(e, t)}</span>
      ${n.length ? l`<div class="note-actions">${n}</div>` : u}
    </div>
  </div>`;
}
function Xa(e, t, n, r) {
	P(e, {
		...r,
		answers: { ignored: N(t, n, !0) }
	});
}
function Za(e, t, n) {
	P(e, { answers: { confirmed: [...t.answers.confirmed.filter((e) => e !== n), n] } });
}
function Qa(e) {
	let { t } = e, n = e.discovery?.energy_dashboard;
	return n?.configured ? {
		key: "energy",
		icon: "mdi:lightning-bolt",
		title: t("find.energy"),
		detail: t("find.energy.detail", {
			grid: Ja(t, n.grid ?? 0, "word.grid"),
			solar: Ja(t, n.solar ?? 0, "word.solar"),
			battery: Ja(t, n.battery ?? 0, "word.battery"),
			devices: Ja(t, n.devices ?? 0, "word.device")
		}),
		chips: [A(t, { source: "read" })]
	} : null;
}
function $a(e, t = {}) {
	let { t: n, config: r, discovery: i } = e, a = r.tariff, o = a.kind === "unknown";
	return {
		key: "tariff",
		icon: "mdi:cash-clock",
		title: i?.tariff.provider ?? n("find.tariff"),
		detail: Pt(n, a),
		chips: o ? [] : [A(n, j(r, "tariff.kind")), ...i && i.tariff.kind !== "unknown" ? [h(n, i.tariff.confidence)] : []],
		reasons: i?.tariff.reasons,
		notes: o ? [Ha(t.missing ?? n("review.tariff.ask"))] : [],
		state: o ? "missing" : void 0,
		tip: "review_tariff",
		actions: t.actions
	};
}
function eo(e) {
	let { t, config: n, from: r } = e, a = e.discovery?.forecast, o = {
		key: "forecast",
		icon: "mdi:weather-sunny",
		title: t("find.forecast"),
		tip: "review_forecast"
	};
	return n.forecast.provider ? {
		...o,
		detail: a ? t("find.forecast.detail", {
			provider: a.provider_name,
			planes: Ja(t, a.planes, "word.plane"),
			today: a.today_kwh == null ? "–" : i(t.lang, a.today_kwh, 1),
			tomorrow: a.tomorrow_kwh == null ? "–" : i(t.lang, a.tomorrow_kwh, 1)
		}) : n.forecast.provider,
		chips: [A(t, j(n, "forecast.provider")), ...a ? [h(t, a.confidence)] : []],
		reasons: a?.reasons,
		actions: [Y(t("review.ignore"), "", () => Xa(r, n, "forecast", { forecast: {
			provider: null,
			config_entries: [],
			today: [],
			tomorrow: [],
			remaining_today: [],
			alternatives: []
		} }), !0)]
	} : M(n, "forecast") && a ? {
		...o,
		detail: t("review.ignored"),
		state: "ignored",
		actions: [Y(t("review.use"), "mdi:undo-variant", () => to(e))]
	} : {
		...o,
		detail: t("find.none"),
		state: "missing",
		notes: [Ha(t("review.forecast.none"))],
		tip: void 0
	};
}
function to(e) {
	let t = e.discovery?.forecast;
	t && P(e.from, {
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
		answers: { ignored: N(e.config, "forecast", !1) }
	}, "read");
}
function no(e, t, a = {}) {
	let { from: o, hass: s, t: c, config: l } = e, u = l.measurements[t], d = e.discovery?.measurements[t] ?? null, f = t === "grid_power", p = {
		key: t,
		icon: f ? "mdi:transmission-tower" : "mdi:home-lightning-bolt-outline",
		title: c(f ? "find.grid" : "find.home"),
		tip: f ? "review_grid" : "review_home"
	}, g = Y(c(u ? "review.change" : "review.choose"), "mdi:magnify", () => void io(e, t)), _ = a.devices ? [a.devices] : [];
	if (!u && !f && l.measurements.grid_power) return {
		...p,
		detail: c("review.home.balance"),
		notes: ro(c, l),
		actions: [g, ..._]
	};
	if (!u) return M(l, t) ? {
		...p,
		detail: c("review.home.computed"),
		state: "ignored",
		actions: [g]
	} : {
		...p,
		detail: c("find.none"),
		state: "missing",
		notes: [Ha(c(f ? "review.grid.none" : "review.home.none"))],
		actions: f ? [g] : [g, Y(c("review.home.without"), "", () => Xa(o, l, "home_power", { measurements: { home_power: null } }), !0)]
	};
	let v = m(s, u), y = r(s, u.entity_id, c.lang);
	if (v !== null) {
		let e = i(c.lang, Math.abs(v), 2);
		y = f ? c(v >= 0 ? "live.import" : "live.export", { value: e }) : c("live.kw", { value: i(c.lang, v, 2) });
	}
	let ee = e.checks.filter((e) => e.code !== "missing" && (e.role === t || f && e.code === "grid_sign" || !f && e.code === "home_negative")), b = () => ao(o, t, {
		...u,
		invert: !u.invert
	}), x = ee.map((e) => e.code === "grid_sign" ? Ya(c, e, [Y(c("review.invert"), "mdi:swap-vertical", b), Y(c("review.keep"), "mdi:check", () => Za(o, l, `grid_sign:${u.entity_id}`), !0)]) : e.code === "home_negative" ? Ya(c, e, [Y(c("review.invert"), "mdi:swap-vertical", b)]) : Ya(c, e)), te = ee.some((e) => e.level === "warn") ? "flag" : void 0, S = n(s, u.entity_id), ne = d?.entity.entity_id === u.entity_id;
	return !f && l.measurements.grid_power ? {
		...p,
		detail: `${c("review.home.balance")} · ${c("review.home.compare", {
			name: S,
			live: y
		})}`,
		chips: [A(c, j(l, `measurements.${t}`))],
		notes: [...ro(c, l), ...x],
		state: te,
		aside: e.aside?.(u.entity_id, S),
		actions: [
			g,
			..._,
			Y(c("review.ignore"), "", () => Xa(o, l, "home_power", { measurements: { home_power: null } }), !0)
		]
	} : {
		...p,
		detail: `${S} · ${y}`,
		chips: [A(c, j(l, `measurements.${t}`)), ...d && ne ? [h(c, d.confidence)] : []],
		reasons: ne ? d?.reasons : void 0,
		notes: x,
		state: te,
		aside: e.aside?.(u.entity_id, S),
		actions: [g, ..._]
	};
}
function ro(e, t) {
	let n = [], r = Cn(t.consumers);
	if (r.length) {
		let t = r.map((t) => t.kind === "ev" || t.runs === "always" || !t.runs ? t.name : `${t.name} (${e(`runs.${t.runs}`)})`).join(", ");
		n.push(Ha(e(r.some((e) => e.kind === "ev") ? "review.home.flexible" : "review.home.flexible_some", { names: t })));
	} else t.consumers.some((e) => e.kind !== "submeter") && n.push(Ha(e("review.home.flexible_none")));
	let a = t.learned.home_check;
	if (a && a.calc_kwh > 0) {
		let t = (a.sensor_kwh - a.calc_kwh) / a.calc_kwh;
		Math.abs(t) >= .1 && n.push(Ha(e("review.home.off", {
			days: a.days,
			pct: i(e.lang, Math.abs(t) * 100, 0),
			direction: e(t < 0 ? "review.home.less" : "review.home.more")
		})));
	}
	return n;
}
async function io(e, t) {
	let { t: n, config: r } = e, i = r.measurements[t], a = e.discovery?.measurements[t], o = t === "grid_power", s = await F(e.from, {
		heading: n(o ? "pick.grid.title" : "pick.home.title"),
		tip: o ? "pick_grid" : "pick_home",
		filter: "power",
		selected: i ? [i.entity_id] : [],
		suggestions: Pe(a ? [Fe(a)] : [], a?.alternatives),
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
	M(r, t) && (l.answers = { ignored: N(r, t, !1) }), P(e.from, l);
}
function ao(e, t, n) {
	P(e, { measurements: { [t]: n } });
}
function oo(t) {
	let { from: r, hass: a, t: o, config: s } = t, c = s.measurements.solar_power, l = t.discovery?.measurements.solar_power ?? null, u = {
		key: "solar_power",
		icon: "mdi:solar-panel",
		title: o("find.solar"),
		tip: "review_solar"
	}, d = (e) => Y(e, "mdi:magnify", () => void so(t));
	if (!c.length) return M(s, "solar_power") ? {
		...u,
		detail: o("review.solar.without"),
		state: "ignored",
		actions: [d(o("review.choose"))]
	} : {
		...u,
		detail: o("find.none"),
		state: "missing",
		actions: [d(o("review.choose")), Y(o("review.solar.none"), "", () => Xa(r, s, "solar_power", { measurements: { solar_power: [] } }), !0)]
	};
	let f = e(a, c), p = t.checks.filter((e) => e.role === "solar_power" && e.code !== "missing"), m = c.length === 1 ? c[0].entity_id : void 0;
	return {
		...u,
		detail: o("find.solar.detail", {
			count: Ja(o, c.length, "word.sensor"),
			total: f === null ? "–" : i(o.lang, f, 2)
		}),
		chips: [A(o, j(s, "measurements.solar_power")), ...l ? [h(o, l.confidence)] : []],
		reasons: l?.reasons,
		notes: p.map((e) => Ya(o, e)),
		state: p.some((e) => e.level === "warn") ? "flag" : void 0,
		aside: m ? t.aside?.(m, n(a, m)) : void 0,
		actions: [d(o("review.change"))]
	};
}
async function so(e) {
	let { t, config: n } = e, r = n.measurements.solar_power, i = e.discovery?.measurements.solar_power, a = await F(e.from, {
		heading: t("pick.solar.title"),
		tip: "pick_solar",
		filter: "power",
		multiple: !0,
		selected: r.map((e) => e.entity_id),
		suggestions: Pe((i?.entities ?? []).map((e) => ({
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
	M(n, "solar_power") && (o.answers = { ignored: N(n, "solar_power", !1) }), P(e.from, o);
}
//#endregion
//#region src/editors/tariff-form.ts
var co = [
	"kind",
	"price_entity",
	"window",
	"night_price",
	"day_price",
	"feed_in_price",
	"feed_in_entity",
	"surcharge"
];
function lo(e, t) {
	let n = {};
	for (let r of co) JSON.stringify(e[r] ?? null) !== JSON.stringify(t[r] ?? null) && (n[r] = t[r] ?? null);
	return n;
}
function uo(e, t) {
	let n = lo(e, t);
	if (!Object.keys(n).length) return null;
	let r = { tariff: n };
	return "kind" in n && (r.answers = { tariff: t.kind }), r;
}
var fo = class extends o {
	constructor(...e) {
		super(...e), this.feedIn = !1, this.asQuestion = !1;
	}
	static {
		this.styles = [f, S`
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
		if (!e || !t) return u;
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
		], r = l`<joe-choice
      .options=${n}
      .value=${t.kind === "unknown" ? [] : [t.kind]}
      idk=${e("ask.idk")}
      label=${e("f.tariff.kind")}
      @joe-choice=${(e) => this.emit({ kind: e.detail.value[0] ?? "unknown" })}
    ></joe-choice>`;
		return l`${this.asQuestion ? r : l`<div class="field" data-tipped>
            <div class="field-label">${e("f.tariff.kind")} ${O(e, "q_tariff")}</div>
            ${r}
          </div>`}
      ${t.kind === "fixed_window" ? this.renderWindow(e, t) : u}
      ${t.kind === "flat" ? this.renderFlat(e, t) : u}
      ${t.kind === "dynamic" ? this.renderDynamic(e, t) : u}
      ${this.feedIn ? this.renderFeedIn(e, t) : u}`;
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
		return l`<div class="field" data-tipped>
        <div class="field-label">${e("f.window")} ${O(e, "f_window")}</div>
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
        <div class="field-label">${e("f.prices")} ${O(e, "f_prices")}</div>
        <div class="field-row">
          <label class="price">${e("f.price.night")} ${this.centInput(e, t.night_price, "night_price")}</label>
          <label class="price">${e("f.price.day")} ${this.centInput(e, t.day_price, "day_price")}</label>
        </div>
      </div>`;
	}
	renderFlat(e, t) {
		return l`<div class="field" data-tipped>
      <div class="field-label">${e("f.price")} ${O(e, "f_prices")}</div>
      ${this.centInput(e, t.day_price, "day_price")}
    </div>`;
	}
	renderDynamic(e, t) {
		let i = this.hass, a = t.price_entity, o = t.window ?? {
			start: "20:00",
			end: "07:00"
		}, s = (e, t) => {
			let n = {
				...o,
				[e]: t
			};
			this.emit({ window: n.start && n.end ? n : null });
		};
		return l`<div class="field" data-tipped>
        <div class="field-label">${e("f.price_entity")} ${O(e, "f_price_entity")}</div>
        <div class="entity">
          ${a && i ? l`<span><b>${n(i, a)}</b> <small>${r(i, a, e.lang)}</small></span>` : l`<small>${e("f.price_entity.none")}</small>`}
          <button type="button" class="mini-btn" @click=${this.pickPrice}>
            <ha-icon icon="mdi:magnify"></ha-icon>${e(a ? "review.change" : "review.choose")}
          </button>
        </div>
      </div>
      <div class="field" data-tipped>
        <div class="field-label">${e("f.search")} ${O(e, "f_search")}</div>
        <div class="field-row">
          <input
            class="input time"
            type="time"
            aria-label=${e("f.search.start")}
            .value=${o.start}
            @change=${(e) => s("start", e.target.value)}
          />
          <span>${e("f.window.until")}</span>
          <input
            class="input time"
            type="time"
            aria-label=${e("f.search.end")}
            .value=${o.end}
            @change=${(e) => s("end", e.target.value)}
          />
        </div>
      </div>
      <div class="field" data-tipped>
        <div class="field-label">${e("f.surcharge")} ${O(e, "f_surcharge")}</div>
        ${this.centInput(e, t.surcharge, "surcharge")}
      </div>`;
	}
	renderFeedIn(e, t) {
		let r = this.hass;
		return l`<div class="field" data-tipped>
      <div class="field-label">${e("f.feed_in")} ${O(e, "q_feed_in")}</div>
      ${t.feed_in_entity && r ? l`<p class="field-hint">
            ${e("f.feed_in.entity", { name: n(r, t.feed_in_entity) })}
          </p>` : this.centInput(e, t.feed_in_price, "feed_in_price")}
    </div>`;
	}
	centInput(e, t, n) {
		return l`<span class="unit-input">
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
		let n = this.discovery?.tariff, r = (await F(this, {
			heading: e("pick.price.title"),
			tip: "pick_price",
			filter: "price",
			selected: t.price_entity ? [t.price_entity] : [],
			suggestions: Pe(n?.price_entity ? [{
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
w([b({ attribute: !1 })], fo.prototype, "hass", void 0), w([b({ attribute: !1 })], fo.prototype, "t", void 0), w([b({ attribute: !1 })], fo.prototype, "tariff", void 0), w([b({ attribute: !1 })], fo.prototype, "discovery", void 0), w([b({ type: Boolean })], fo.prototype, "feedIn", void 0), w([b({ type: Boolean })], fo.prototype, "asQuestion", void 0), p("joe-tariff-form", fo);
var po, mo = class extends o {
	constructor(...e) {
		super(...e), this.closable = !1, this.keep = !1, this.saving = !1, this.base = "";
	}
	static {
		this.styles = [f, S`
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
		!this.draft && this.keep && po && (this.base = po.base, this.draft = po.draft), this.draft ? n !== this.base && (this.draft = {
			...structuredClone(t),
			...this.changes
		}, this.base = n, this.keep && (po = this.dirty ? {
			base: this.base,
			draft: this.draft
		} : void 0)) : (this.base = n, this.draft = structuredClone(t));
	}
	get changes() {
		return this.draft && this.base ? lo(JSON.parse(this.base), this.draft) : {};
	}
	get dirty() {
		return Object.keys(this.changes).length > 0;
	}
	render() {
		let { t: e, draft: t } = this;
		if (!e || !t) return u;
		let n = this.dirty;
		return l`<joe-tariff-form
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
      ${n && !this.closable ? l`<p class="unsaved" role="status">${e("grid.tariff.unsaved")}</p>` : u}
      ${n || this.closable ? l`<div class="actions" data-notip>
            <button type="button" class="btn btn-primary" ?disabled=${this.saving || !n && !this.closable} @click=${this.save}>
              ${e("common.save")}
            </button>
            <button type="button" class="btn btn-ghost" @click=${this.discard}>
              ${e(this.closable ? "common.cancel" : "grid.tariff.discard")}
            </button>
          </div>` : u}`;
	}
	change(e) {
		this.draft = e, this.keep && (po = this.dirty ? {
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
		}, r = uo(e.tariff, n);
		if (r) {
			this.saving = !0;
			let e = await P(this, r);
			if (this.saving = !1, !e) return;
			this.base = JSON.stringify(n), this.draft = n;
		}
		this.keep && (po = void 0), this.finish();
	}
	discard() {
		this.config && (this.base = JSON.stringify(this.config.tariff), this.draft = structuredClone(this.config.tariff)), this.keep && (po = void 0), this.finish();
	}
	finish() {
		this.closable && this.dispatchEvent(new CustomEvent("joe-close", {
			bubbles: !0,
			composed: !0
		}));
	}
};
w([b({ attribute: !1 })], mo.prototype, "hass", void 0), w([b({ attribute: !1 })], mo.prototype, "t", void 0), w([b({ attribute: !1 })], mo.prototype, "config", void 0), w([b({ attribute: !1 })], mo.prototype, "discovery", void 0), w([b({ type: Boolean })], mo.prototype, "closable", void 0), w([b({ type: Boolean })], mo.prototype, "keep", void 0), w([y()], mo.prototype, "draft", void 0), w([y()], mo.prototype, "saving", void 0), p("joe-tariff-draft", mo);
//#endregion
//#region src/pages/devices/grid.ts
var ho = [
	"connection",
	"tariff",
	"solar",
	"home"
], go = {
	connection: "mdi:transmission-tower",
	tariff: "mdi:cash-clock",
	solar: "mdi:solar-power-variant",
	home: "mdi:home-lightning-bolt-outline"
}, _o = "/config/energy";
function vo(e, t) {
	return t < .95 ? e("learn.solar.less", {
		value: i(e.lang, (1 - t) * 100, 0),
		share: i(e.lang, t * 100, 0)
	}) : t > 1.05 ? e("learn.solar.more", {
		value: i(e.lang, (t - 1) * 100, 0),
		share: i(e.lang, t * 100, 0)
	}) : e("learn.solar.fits");
}
var yo = class extends G {
	static {
		this.styles = [
			f,
			W,
			Va,
			S`
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
		this.anchor && this.revealed !== this.anchor && me(this.renderRoot, this.anchor) && (this.revealed = this.anchor);
	}
	render() {
		let { t: e, hass: t, state: n } = this;
		if (!e || !t || !n) return u;
		let r = n.config, i = {
			from: this,
			hass: t,
			t: e,
			config: r,
			discovery: this.discovery,
			checks: this.checks,
			aside: (n, r) => U(e, pr(t, n, r))
		}, a = this.anchor !== void 0 && !ho.includes(this.anchor);
		return l`<div class="wrap">
      ${a ? kr(e) : u}
      ${Lr(e, e("nav.devices.grid"), e("grid.lead"))}
      ${this.renderEnergy(e, i)} ${this.renderConnection(e, i)} ${this.renderTariff(e, i)}
      ${this.renderSolar(e, i)} ${this.renderHome(e, i)}
    </div>`;
	}
	renderEnergy(e, t) {
		let n = Qa(t);
		return n ? l`<div class="energy">${Wa(e, [n])}</div>` : l`<div class="note energy-none">
      <ha-icon icon="mdi:information-outline"></ha-icon>
      <span
        >${e("grid.energy.none")}
        <a
          href=${_o}
          @click=${(e) => {
			e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0 || (e.preventDefault(), d(_o));
		}}
          >${e("grid.energy.open")}</a
        ></span
      >
    </div>`;
	}
	block(e, t, n, r, i) {
		return l`<section class="card gsec" data-anchor=${t}>
      <h3 class="gsec-head" ?data-tipped=${!!i}>
        <ha-icon icon=${go[t]}></ha-icon>${n}${i ? O(e, i) : u}
      </h3>
      <p class="say">${e(`grid.${t}.say`)}</p>
      ${r}
    </section>`;
	}
	rule(e, t, n) {
		return Yr(e, this.prefix, {
			label: e(`rule.${n}`),
			value: ai(e, t, n),
			source: j(t, `rules.${n}`),
			to: {
				tab: "settings",
				section: "rules",
				id: n
			}
		});
	}
	renderConnection(e, t) {
		return this.block(e, "connection", e("grid.connection"), l`${Wa(e, [no(t, "grid_power")])}
        <div class="mirrors">${this.rule(e, t.config, "grid_limit_w")} ${this.rule(e, t.config, "guard_grid")}</div>`);
	}
	renderTariff(e, t) {
		return this.block(e, "tariff", e("find.tariff"), l`${Wa(e, [$a(t, { missing: e("grid.tariff.unknown") })])}
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
		let n = t.config, r = n.forecast, a = n.learned.solar_factor, o = {
			tab: "review",
			section: "learned",
			id: "sun"
		};
		return this.block(e, "solar", e("devices.grid.solar"), l`${Wa(e, [oo(t), eo(t)])}
        ${r.provider && r.alternatives.length ? l`<div class="toggle-row" data-tipped>
              <span class="with-tip"><span id="combine-label">${e("learn.sources.combine")}</span>${O(e, "learn_combine")}</span>
              <button
                type="button"
                class="switch"
                role="switch"
                aria-checked=${String(r.combine)}
                aria-labelledby="combine-label"
                @click=${() => P(this, { forecast: { combine: !r.combine } })}
              ></button>
            </div>` : u}
        ${r.provider ? l`<div class="mirrors">
              <div class="mirror">
                <div class="mirror-text">
                  <span class="mirror-label">${e("grid.solar.factor")}</span>
                  <span class="mirror-sep" aria-hidden="true">·</span>
                  <span class="mirror-value">${a == null ? e("learn.still") : `× ${i(e.lang, a, 2)}`}</span>
                  ${a == null ? u : A(e, { source: "learned" })}
                  ${a == null ? u : l`<small class="mirror-hint">${vo(e, a)}</small>`}
                </div>
                <a class="mini-btn quiet mirror-go" href=${T(this.prefix, o)} @click=${C(o)}
                  >${e("devices.page.more_learned")}</a
                >
              </div>
            </div>` : u}`);
	}
	renderHome(e, t) {
		let n = {
			tab: "devices",
			section: "other"
		}, r = l`<a class="mini-btn go" href=${T(this.prefix, n)} @click=${C(n)}
      >${e("grid.home.devices")}</a
    >`;
		return this.block(e, "home", e("devices.grid.home"), Wa(e, [no(t, "home_power", { devices: r })]));
	}
};
w([b({ attribute: !1 })], yo.prototype, "anchor", void 0), p("joe-grid-page", yo);
//#endregion
//#region src/pages/devices/hot-water-device.ts
var bo = class extends G {
	static {
		this.styles = [
			f,
			W,
			hi,
			Qi,
			Hi
		];
	}
	render() {
		let { t: e, hass: t, state: n, entry: r } = this;
		if (!e || !t || !n || !r) return u;
		let i = jr(this.ctx, r), a = r.consumer, o = a ? Zi(this, e, t, n.config, a) : void 0, s = r.action;
		return s ? Fr(this.ctx, {
			...i,
			why: dn(e, n, s),
			now: l`<joe-action-tonight .hass=${t} .t=${e} .state=${n} .action=${s}></joe-action-tonight>`,
			steer: l`<joe-action-steer
        .hass=${t}
        .t=${e}
        .state=${n}
        .discovery=${this.discovery}
        .prefix=${this.prefix}
        .action=${s}
        .section=${"hot_water"}
      ></joe-action-steer>`,
			power: o,
			learned: s.kind === "target" ? mi([vi(e, n.config.learned, s)]) : void 0,
			learnedArea: "hot_water",
			tips: { steer: "device_steer" },
			removeTitle: e("devices.page.delete"),
			remove: l`<joe-action-delete
        .t=${e}
        .config=${n.config}
        .action=${s}
        .leave=${{
				tab: "devices",
				section: "hot_water"
			}}
      ></joe-action-delete>`
		}) : Fr(this.ctx, {
			...i,
			now: a ? Ri(e, this.prefix, "hot_water", a.id, e("devices.hot_water.lonely"), e("devices.hot_water.set_up"), "devices_lonely_hot_water") : void 0,
			power: o
		});
	}
};
w([b({ attribute: !1 })], bo.prototype, "entry", void 0), p("joe-hot-water-device", bo);
//#endregion
//#region src/pages/devices/hot-water.ts
var xo = class extends G {
	static {
		this.styles = [
			f,
			W,
			Hi
		];
	}
	render() {
		let { t: e, hass: t, state: n } = this;
		if (!e || !n) return u;
		let r = $t(this.devices, "hot_water", this.device);
		if (r) return l`<joe-hot-water-device
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
		let i = this.device ? zi(this.devices, this.device, "hot_water") : void 0;
		return l`<div class="wrap">
      ${Lr(e, e("nav.devices.hot_water"), e("devices.hot_water.lead"), this.devices.some((e) => e.group === "hot_water"))}
      ${this.device === void 0 ? u : i ? Bi(e, this.prefix, i.name, i) : kr(e)}
      ${Ir(this.ctx, this.devices, "hot_water", (r) => r.action ? { quick: l`<joe-action-tonight .hass=${t} .t=${e} .state=${n} .action=${r.action}></joe-action-tonight>` } : {})}
      <div class="group-actions">${Rr(e, this.prefix, "hot_water", e("devices.group_add.hot_water"))}</div>
    </div>`;
	}
};
w([b({ attribute: !1 })], xo.prototype, "device", void 0), w([b({ attribute: !1 })], xo.prototype, "sub", void 0), p("joe-hot-water-group", xo);
//#endregion
//#region src/pages/devices/other-device.ts
var So = class extends G {
	static {
		this.styles = [
			f,
			W,
			hi,
			Qi,
			Hi
		];
	}
	render() {
		let { t: e, hass: t, state: n, entry: r } = this;
		if (!e || !t || !n || !r) return u;
		let i = jr(this.ctx, r), a = r.consumer, o = r.action, s = a && a.energy_entity && a.kind !== "submeter" ? mi([_i(e, n.config.learned, a)]) : void 0, c = !!(o && a && r.id === a.id), d = Wt("night", a?.id);
		return Fr(this.ctx, {
			...i,
			why: o ? dn(e, n, o) : i.why,
			now: o ? l`<joe-action-tonight .hass=${t} .t=${e} .state=${n} .action=${o}></joe-action-tonight>` : void 0,
			steer: o ? l`<joe-action-steer
              .hass=${t}
              .t=${e}
              .state=${n}
              .discovery=${this.discovery}
              .prefix=${this.prefix}
              .action=${o}
              .section=${"night"}
            ></joe-action-steer>` : a && a.kind !== "submeter" ? l`<p class="muted">${e("devices.other.night_offer")}</p>
              <a class="btn btn-secondary add-link" href=${T(this.prefix, d)} @click=${C(d, { sheet: !0 })}
                >${e("devices.other.night_add")}</a
              >` : void 0,
			power: a ? Zi(this, e, t, n.config, a) : r.noMeter ? l`<p class="muted">${e("devices.other.no_meter")}</p>` : void 0,
			learned: s,
			learnedArea: "devices",
			tips: { steer: "device_steer" },
			removeTitle: e("devices.page.delete"),
			remove: o ? l`<joe-action-delete
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
w([b({ attribute: !1 })], So.prototype, "entry", void 0), p("joe-other-device", So);
//#endregion
//#region src/pages/devices/other.ts
var Co = class extends G {
	constructor(...e) {
		super(...e), this.moved = /* @__PURE__ */ new Map();
	}
	static {
		this.styles = [
			f,
			W,
			Qi,
			Hi
		];
	}
	render() {
		let { t: e, state: t } = this;
		if (!e || !t) return u;
		let n = $t(this.devices, "other", this.device);
		if (n) return l`<joe-other-device
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
		let r = this.device ? zi(this.devices, this.device, "other") : void 0;
		return l`<div class="wrap">
      ${Lr(e, e("nav.devices.other"), e("devices.other.lead"), this.devices.some((e) => e.group === "other"))}
      ${this.device === void 0 ? u : r ? Bi(e, this.prefix, r.name, r) : kr(e)}
      ${this.renderList(e, t)}
      <div class="group-actions">${Rr(e, this.prefix, "night", e("devices.group_add.night"))}</div>
    </div>`;
	}
	renderList(e, t) {
		let n = this.devices.filter((e) => e.group === "other"), r = new Map(t.config.consumers.map((e, t) => [e.id, t])), i = n.filter((e) => r.has(e.id)), a = n.filter((e) => !r.has(e.id) && !e.noMeter), o = n.filter((e) => e.noMeter), s = i.map((n) => ({
			at: r.get(n.id),
			html: this.card(e, t, n)
		}));
		for (let [t, i] of this.moved) {
			let a = n.some((e) => e.id === t) ? void 0 : zi(this.devices, t, "other");
			a && s.push({
				at: r.get(t) ?? Infinity,
				html: Bi(e, this.prefix, i, a)
			});
		}
		return s.sort((e, t) => e.at - t.at), !s.length && !a.length && !o.length ? l`<p class="muted">${e("devices.other.empty")}</p>` : l`${s.length || a.length ? l`<section data-tipped>
            <div class="list-head">
              <span>${e("consumers.kind")} ${O(e, "f_consumer_kind")}</span>
              <span>${e("consumers.runs")} ${O(e, "f_consumer_runs")}</span>
            </div>
            <div class="dcards">${s.map((e) => e.html)} ${a.map((n) => this.card(e, t, n))}</div>
          </section>` : u}
      ${o.length ? l`<h3 class="sub-group">${e("devices.no_meter_group")}</h3>
            <div class="dcards">${o.map((n) => this.card(e, t, n))}</div>` : u}`;
	}
	card(e, t, n) {
		let r = n.id === n.consumer?.id ? n.consumer : void 0, i = n.action ? l`<joe-action-tonight .hass=${this.hass} .t=${e} .state=${t} .action=${n.action}></joe-action-tonight>` : u, a = r ? l`${Yi(e, r, (e) => this.setKind(r, e))}
        ${Xi(e, r, (e) => void Ji(this, r, e))} ${i}` : n.action ? i : void 0;
		return mr(e, this.prefix, _r(e, this.hass, t, n, { quick: a }));
	}
	async setKind(e, t) {
		if (!await qi(this, e, t)) return;
		let n = new Map(this.moved);
		Ki.includes(t) ? n.set(e.id, e.name) : n.delete(e.id), this.moved = n;
	}
};
w([b({ attribute: !1 })], Co.prototype, "device", void 0), w([b({ attribute: !1 })], Co.prototype, "sub", void 0), w([y()], Co.prototype, "moved", void 0), p("joe-other-group", Co);
//#endregion
//#region src/pages/devices/index.ts
var wo = {
	all: "joe-devices-all",
	battery: "joe-battery-group",
	climate: "joe-climate-group",
	car: "joe-car-group",
	hot_water: "joe-hot-water-group",
	other: "joe-other-group",
	grid: "joe-grid-page"
}, To = class extends o {
	constructor(...e) {
		super(...e), this.prefix = E, this.checks = [], this.devices = [], this.behind = {
			tab: "devices",
			section: "all"
		};
	}
	static {
		this.styles = [f, S`
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
		].some((t) => e.has(t)) && (this.devices = Zt(this.t, this.state, this.hass, {
			climateFound: this.climateFound,
			discovery: this.discovery,
			checks: this.checks
		})), e.has("route") && this.route && this.route.section !== "add" && (this.behind = this.route);
	}
	chips(e, t) {
		let n = new Set(Qt(this.devices));
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
				icon: Lt[t],
				count: n ? i(e.lang, n, 0) : void 0,
				problem: en(this.devices, t)
			});
		}
		return r;
	}
	render() {
		let e = this.t;
		if (!e || !this.state) return u;
		let t = (this.route?.section ?? fe.devices) === "add", n = t ? this.behind : this.route, r = n?.section ?? fe.devices;
		return l`${cr(e, this.prefix, "devices", this.chips(e, r), r)}${this.renderSection(r, n)}${t ? this.renderAdd() : u}`;
	}
	renderSection(e, t) {
		if (!customElements.get(wo[e])) return l``;
		let { t: n, hass: r, state: i, prefix: a, discovery: o, info: s, checks: c, climateFound: u, devices: d } = this;
		switch (e) {
			case "all": return l`<joe-devices-all
          .t=${n}
          .hass=${r}
          .state=${i}
          .prefix=${a}
          .route=${t}
          .discovery=${o}
          .info=${s}
          .checks=${c}
          .climateFound=${u}
          .devices=${d}
        ></joe-devices-all>`;
			case "climate": return l`<joe-climate-group
          .t=${n}
          .hass=${r}
          .state=${i}
          .prefix=${a}
          .route=${t}
          .discovery=${o}
          .info=${s}
          .checks=${c}
          .climateFound=${u}
          .devices=${d}
          .entity=${t?.id}
          .sub=${t?.sub}
        ></joe-climate-group>`;
			case "battery": return l`<joe-battery-group
          .t=${n}
          .hass=${r}
          .state=${i}
          .prefix=${a}
          .route=${t}
          .discovery=${o}
          .info=${s}
          .checks=${c}
          .climateFound=${u}
          .devices=${d}
          .device=${t?.id}
          .sub=${t?.sub}
        ></joe-battery-group>`;
			case "car": return l`<joe-car-group
          .t=${n}
          .hass=${r}
          .state=${i}
          .prefix=${a}
          .route=${t}
          .discovery=${o}
          .info=${s}
          .checks=${c}
          .climateFound=${u}
          .devices=${d}
          .device=${t?.id}
          .sub=${t?.sub}
        ></joe-car-group>`;
			case "hot_water": return l`<joe-hot-water-group
          .t=${n}
          .hass=${r}
          .state=${i}
          .prefix=${a}
          .route=${t}
          .discovery=${o}
          .info=${s}
          .checks=${c}
          .climateFound=${u}
          .devices=${d}
          .device=${t?.id}
          .sub=${t?.sub}
        ></joe-hot-water-group>`;
			case "other": return l`<joe-other-group
          .t=${n}
          .hass=${r}
          .state=${i}
          .prefix=${a}
          .route=${t}
          .discovery=${o}
          .info=${s}
          .checks=${c}
          .climateFound=${u}
          .devices=${d}
          .device=${t?.id}
          .sub=${t?.sub}
        ></joe-other-group>`;
			case "grid": return l`<joe-grid-page
          .t=${n}
          .hass=${r}
          .state=${i}
          .prefix=${a}
          .route=${t}
          .discovery=${o}
          .info=${s}
          .checks=${c}
          .climateFound=${u}
          .devices=${d}
          .anchor=${t?.id}
        ></joe-grid-page>`;
		}
	}
	renderAdd() {
		return l`<joe-device-add
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
w([b({ attribute: !1 })], To.prototype, "hass", void 0), w([b({ attribute: !1 })], To.prototype, "t", void 0), w([b({ attribute: !1 })], To.prototype, "state", void 0), w([b({ attribute: !1 })], To.prototype, "route", void 0), w([b({ attribute: !1 })], To.prototype, "prefix", void 0), w([b({ attribute: !1 })], To.prototype, "discovery", void 0), w([b({ attribute: !1 })], To.prototype, "info", void 0), w([b({ attribute: !1 })], To.prototype, "checks", void 0), w([b({ attribute: !1 })], To.prototype, "climateFound", void 0), p("joe-devices-page", To);
//#endregion
//#region src/uses.ts
function Eo(e, t) {
	let n = e.climate;
	if (!n?.enabled) return [];
	let r = t ? new Set(t.devices.map((e) => e.entity_id)) : null;
	return Object.entries(n.rooms ?? {}).filter(([e, t]) => t.enabled && (!r || r.has(e))).map(([e]) => e);
}
function Do(e, t) {
	return e.actions.filter((e) => e.enabled && e.need?.enabled).filter((e) => {
		let n = e.need.persons;
		return t === void 0 ? n === null || n.length > 0 : n === null || n.includes(t);
	}).map((e) => ({
		label: e.name,
		to: "/devices"
	}));
}
function Oo(e, t) {
	return t.length ? [{
		label: e("usedby.climate"),
		to: "/devices/climate",
		count: t.length
	}] : [];
}
function ko(e, t, n) {
	let r = Oo(e, Eo(t, n));
	return t.persons.some((e) => e.person_entity) && r.push({
		label: e("usedby.learn"),
		to: "/review/learned/presence"
	}), r;
}
function Ao(e, t, n) {
	let r = t.persons.some((e) => e.calendars.length), i = [];
	return (t.context.holiday_entity || r) && (i.push({
		label: e("usedby.plan"),
		to: "/plan"
	}), i.push({
		label: e("usedby.consumption"),
		to: "/review/learned/consumption"
	})), r && i.push(...Do(t).map((t) => ({
		...t,
		label: e("usedby.car", { name: t.label })
	}))), (t.context.holiday_entity || r || t.context.free_day_entities?.length) && i.push(...Oo(e, Eo(t, n))), i;
}
function jo(e, t, n) {
	return Oo(e, Eo(t, n).filter((e) => t.climate?.rooms[e]?.night_off));
}
function Mo(e, t, n, r) {
	let i = [];
	return n !== "routing" && t.context.weather_entity && (i.push({
		label: e("usedby.plan"),
		to: "/plan"
	}), i.push({
		label: e("usedby.consumption"),
		to: "/review/learned/consumption"
	}), i.push(...Oo(e, Eo(t, r)))), n !== "weather" && t.routing.service && (i.push(...Do(t).map((t) => ({
		...t,
		label: e("usedby.car", { name: t.label })
	}))), (t.climate?.route_eta ?? !0) && Eo(t, r).length && i.push({
		label: e("usedby.way"),
		to: "/household/presence/way"
	})), i.filter((e, t) => i.findIndex((t) => t.label === e.label) === t);
}
function No(e, t, n) {
	return t.persons.find((e) => e.id === n)?.calendars.length ? Do(t, n) : [];
}
//#endregion
//#region src/components/used-by.ts
function Po(e, t) {
	if (typeof t == "string") return t;
	let [n, r] = e("word.device").split("|");
	return `${i(e.lang, t, 0)} ${t === 1 ? n : r}`;
}
function Fo(e, t, n) {
	return n.length ? l`<p class="used-by">
    <ha-icon icon="mdi:link-variant"></ha-icon>
    <span class="used-by-label">${e("usedby.label")}</span>
    ${n.map((n) => {
		let r = n.count === void 0 ? n.label : `${n.label} (${Po(e, n.count)})`;
		return n.to ? l`<a class="used-by-item" href=${T(t, n.to)} @click=${C(n.to)}>${r}</a>` : l`<span class="used-by-item">${r}</span>`;
	})}
  </p>` : l`<p class="used-by none"><ha-icon icon="mdi:link-variant-off"></ha-icon>${e("usedby.none")}</p>`;
}
//#endregion
//#region src/pages/household/head.ts
function Io(e, n, r, i, a) {
	return l`<div class="page-head">
    ${c(r)} ${t}
    <p class="lead">${i}</p>
    ${a ? Fo(e, n, a) : ""}
  </div>`;
}
function Lo(e, t, n) {
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
function Ro(e) {
	return `${String(Math.floor(e / 60)).padStart(2, "0")}:${String(e % 60).padStart(2, "0")}`;
}
function zo(e) {
	try {
		return new Intl.DateTimeFormat("en-CA", { timeZone: e }).format(/* @__PURE__ */ new Date());
	} catch {
		return new Intl.DateTimeFormat("en-CA").format(/* @__PURE__ */ new Date());
	}
}
//#endregion
//#region src/pages/household/styles.ts
var Bo = S`
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
`, Vo = [
	"vacation",
	"travel",
	"home_office",
	"office",
	"guests",
	"home"
];
function Ho(e) {
	let t = e;
	for (; t;) {
		let e = t.parentNode instanceof ShadowRoot ? t.parentNode.host : t.parentNode;
		if (e instanceof HTMLElement && e.scrollTop > 0) return e;
		t = e;
	}
	return document.scrollingElement;
}
var Uo = class extends o {
	constructor(...e) {
		super(...e), this.prefix = E, this.checks = [], this.keyword = {}, this.quiet = !1;
	}
	static {
		this.styles = [
			f,
			Bo,
			Va,
			S`
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
		return !e || !t || !n ? u : l`<div class="wrap">
      ${Io(e, this.prefix, e("household.days.title"), e("household.days.lead"), Ao(e, t.config, this.climateFound))}
      ${this.renderPreview(e, t)} ${this.renderFree(e, n, t)} ${this.renderCalendar(e, t)}
    </div>`;
	}
	renderPreview(e, t) {
		let n = t.climate?.day, r = t.config.persons, i = this.hass?.config?.time_zone, a = zo(i), o = t.plan?.meta?.tomorrow, s = o && o.date > a ? o : void 0, c = n ? n.holiday ? "holiday" : n.weekend && n.free ? "weekend" : "workday" : null, d = n?.labels_state ?? (n?.labels_at ? "ok" : "unread"), f = d === "ok" && n?.labels_at ? Lo(e.lang, n.labels_at, i) : null, p = t.climate, m = n ? !p?.home.length && p?.nobody_since ? "away" : n.holiday ? "holiday" : n.home_office.length && !n.free ? "home_office" : "normal" : null, h = null;
		if (s) {
			let e = (/* @__PURE__ */ new Date(`${s.date}T12:00:00Z`)).getUTCDay(), t = e === 0 || e === 6;
			h = s.workday ? Object.values(s.labels).includes("home_office") ? "home_office" : "normal" : t ? "normal" : "holiday";
		}
		let g = (t) => t ? l`<span class="chip ${t === "normal" ? "" : "soon"}"><ha-icon icon=${sa[t]}></ha-icon>${e(`week.tag.${t}`)}</span>` : u;
		return l`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:calendar-today"></ha-icon>${e("household.days.preview")}</div>
        ${O(e, "household_days_preview")}
      </div>
      <div class="preview">
        <div class="day">
          <div class="day-head">
            <b>${e("household.days.preview.today")} · ${V(e.lang, a, "weekday")}</b>${g(m)}
          </div>
          ${c ? l`<p class="now">${e(`climate.today.${c}`)}</p>` : l`<p class="hint">${e("household.days.preview.unknown")}</p>`}
          ${n ? l`<p class="hint">
                ${n.home_office_available ? d === "ok" ? n.home_office.length ? e("climate.today.ho", { names: n.home_office.join(", ") }) : e("climate.today.ho_none") : e(`climate.today.labels_${d}`) : e(`week.ho.${n.home_office_reason ?? "no_calendar"}`)}
                ${f ? e("climate.today.read_at", { time: f }) : u}
              </p>` : u}
        </div>
        <div class="day">
          <div class="day-head">
            <b>${e("household.days.preview.tomorrow")}${s ? l` · ${V(e.lang, s.date, "weekday")}` : u}</b>${g(h)}
          </div>
          ${s ? l`<p class="now">${e(s.workday ? "household.days.preview.workday" : "household.days.preview.day_off")}</p>
                ${Object.keys(s.labels).length ? l`<ul>
                      ${Object.entries(s.labels).map(([t, n]) => l`<li>
                            ${e("household.days.preview.person", {
			name: r.find((e) => e.id === t)?.name ?? t,
			label: e(`label.${n}`)
		})}
                          </li>`)}
                    </ul>` : u}` : l`<p class="hint">${e("household.days.preview.no_plan")}</p>`}
        </div>
      </div>
    </section>`;
	}
	renderFree(e, t, r) {
		let i = r.config, a = i.context.free_day_entities ?? [];
		return l`<section class="card">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:calendar-star"></ha-icon>${e("household.days.free")}</div>
      </div>
      ${Wa(e, [Ka(this, t, e, i, this.discovery, "holiday", (r) => U(e, pr(t, r, n(t, r))))])}
      <div class="sub" data-tipped>
        <div class="row">
          <span>${e("climate.today.free_by")}</span>
          ${O(e, "climate_free_entities")}
        </div>
        <div class="row tight">
          <span class="chips-line">
            ${a.length ? a.map((e) => {
			let r = [
				"on",
				"true",
				"home"
			].includes(t.states[e]?.state ?? "");
			return l`<span class="chip ${r ? "ok" : ""}" title=${e}>${n(t, e)}</span>`;
		}) : l`<small class="hint">${e("climate.today.free_none")}</small>`}
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
		let t = await F(this, {
			heading: e("pick.free_day.title"),
			tip: "pick_free_day",
			filter: "toggle_like",
			multiple: !0,
			selected: this.state?.config.context.free_day_entities ?? []
		});
		t && P(this, { context: { free_day_entities: t.selected } });
	}
	renderCalendar(e, t) {
		let n = t.config, r = this.chosen(), i = !!r && !r.calendar, a = r?.calendar ?? n.calendar, o = (e) => a.rules.filter((t) => t.label === e), s = n.persons.some((e) => e.calendars.length), c = {
			tab: "household",
			section: "days"
		}, d = {
			tab: "household",
			section: "people"
		};
		return l`<section class="card" data-anchor="calendar" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:calendar-text-outline"></ha-icon>${e("learn.calendar")}</div>
        ${O(e, "learn_calendar")}
      </div>
      <p class="say">${e("learn.calendar.say")}</p>
      ${s ? u : l`<div class="note">
            <ha-icon icon="mdi:information-outline"></ha-icon>
            <span
              >${e("household.days.no_calendars")}
              <a href=${T(this.prefix, d)} @click=${C(d)}>${e("household.days.to_people")}</a></span
            >
          </div>`}
      ${n.persons.length ? l`<div data-tipped>
            <div class="sub-head"><b>${e("learn.calendar.for")}</b>${O(e, "cal_person")}</div>
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
			return l`<a href=${T(this.prefix, n)} aria-current=${String(t.id === r?.id)} @click=${(e) => this.choose(e, n)}
                  >${t.name}${t.calendar ? l`<ha-icon class="own-rules" icon="mdi:account-cog-outline" title=${e("household.days.own_rules")}></ha-icon>` : u}</a
                >`;
		})}
            </nav>
          </div>` : u}
      ${this.person && !r ? l`<div class="note warn" role="status">
            <ha-icon icon="mdi:help-circle-outline"></ha-icon><span>${e("household.days.not_found")}</span>
          </div>` : u}
      ${r ? l`<div class="toggle-row" data-tipped>
            <span class="with-tip"><span id="cal-shared-label">${e("learn.calendar.shared")}</span>${O(e, "cal_shared")}</span>
            <button
              type="button"
              class="switch"
              role="switch"
              aria-checked=${String(i)}
              aria-labelledby="cal-shared-label"
              @click=${() => this.saveCalendar(r, i ? structuredClone(n.calendar) : null)}
            ></button>
          </div>` : u}
      ${i ? l`<p class="say">${e("learn.calendar.shared.say", { name: r.name })}</p>` : l`<div class="rules">
              ${Vo.map((t) => l`<div class="rule">
                  <b>${e(`label.${t}`)}</b>
                  <div class="keywords">
                    ${o(t).map((t) => l`<span class="keyword"
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
              <div class="sub-head"><b>${e("learn.calendar.defaults")}</b>${O(e, "cal_defaults")}</div>
              <div class="defaults">
                ${["default_workday", "default_day_off"].map((t) => l`<label class="field">
                    <span class="field-label">${e(`learn.calendar.${t}`)}</span>
                    <select
                      class="input"
                      @change=${(e) => this.saveCalendarPart({ [t]: e.target.value })}
                    >
                      ${xn.map((n) => l`<option value=${n} ?selected=${a[t] === n}>${e(`label.${n}`)}</option>`)}
                    </select>
                  </label>`)}
              </div>
            </div>`}
    </section>`;
	}
	choose(e, t) {
		if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
		e.preventDefault(), this.quiet = !0;
		let n = Ho(this), r = n?.scrollTop ?? 0;
		D(this, t, { replace: !0 }), n && (n.scrollTop = r);
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
		let t = Vo.flatMap((t) => e.filter((e) => e.label === t));
		this.saveCalendarPart({ rules: t });
	}
	saveCalendarPart(e) {
		let t = this.chosen();
		t?.calendar ? this.saveCalendar(t, {
			...t.calendar,
			...e
		}) : P(this, { calendar: e });
	}
	saveCalendar(e, t) {
		P(this, { persons: { [e.id]: { calendar: t } } });
	}
	willUpdate(e) {
		e.has("person") && (this.revealed = this.quiet ? this.person : void 0, this.quiet = !1, this.keyword = {});
	}
	updated() {
		this.person && this.revealed !== this.person && me(this.renderRoot, "calendar") && (this.revealed = this.person);
	}
};
w([b({ attribute: !1 })], Uo.prototype, "hass", void 0), w([b({ attribute: !1 })], Uo.prototype, "t", void 0), w([b({ attribute: !1 })], Uo.prototype, "state", void 0), w([b({ attribute: !1 })], Uo.prototype, "route", void 0), w([b({ attribute: !1 })], Uo.prototype, "prefix", void 0), w([b({ attribute: !1 })], Uo.prototype, "discovery", void 0), w([b({ attribute: !1 })], Uo.prototype, "checks", void 0), w([b({ attribute: !1 })], Uo.prototype, "climateFound", void 0), w([b({ attribute: !1 })], Uo.prototype, "person", void 0), w([y()], Uo.prototype, "keyword", void 0), p("joe-hh-days", Uo);
//#endregion
//#region src/pages/household/night.ts
var Wo = "23:00", Go = "06:30", Ko = class extends o {
	constructor(...e) {
		super(...e), this.prefix = E, this.checks = [];
	}
	static {
		this.styles = [
			f,
			Bo,
			S`
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
		return !e || !t || !this.hass ? u : l`<div class="wrap">
      ${Io(e, this.prefix, e("household.night.title"), e("household.night.lead"), jo(e, t.config, this.climateFound))}
      ${this.renderSource(e, t)} ${this.renderDevices(e, t)}
    </div>`;
	}
	renderSource(e, t) {
		let r = this.hass, i = t.config.climate, a = i?.night_by ?? "time", o = i?.night_entity ?? null, s = o ? r.states[o] : void 0;
		return l`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:weather-night"></ha-icon>${e("household.night.source")}</div>
        ${O(e, "climate_night_source")}
      </div>
      <div class="row">
        <span>${e("climate.night.by")}</span>
        <span class="seg" role="group" aria-label=${e("climate.night.by")}>
          ${["time", "entity"].map((t) => l`<button type="button" aria-pressed=${String(a === t)} @click=${() => this.setNightBy(t)}>
              ${e(`climate.night.by.${t}`)}
            </button>`)}
        </span>
      </div>
      ${a === "entity" ? l`<div class="row entity-row">
              <span>${o ? l`<b title=${o}>${n(r, o)}</b>` : e("climate.night.no_entity")}</span>
              ${s ? l`<span class="chip ${s.state === "on" ? "ok" : ""}"
                    >${e(s.state === "on" ? "climate.night.now_on" : "climate.night.now_off")}</span
                  >` : u}
              ${o ? U(e, pr(r, o, n(r, o))) : u}
              <button type="button" class="btn btn-secondary" @click=${() => void this.pickNight()}>
                ${e(o ? "climate.night.change" : "climate.night.pick")}
              </button>
            </div>
            <p class="hint">${e("climate.night.entity_say")}</p>` : l`<p class="hint">${e("climate.night.time_say")}</p>`}
    </section>`;
	}
	renderDevices(e, t) {
		let r = t.config.climate, i = r?.night_by === "entity", a = Object.fromEntries((this.climateFound?.devices ?? []).map((e) => [e.entity_id, e.name])), o = Object.entries(r?.rooms ?? {}).filter(([, e]) => e.night_off), s = {
			tab: "devices",
			section: "climate"
		};
		return l`<section class="card">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:power-sleep"></ha-icon>${e("household.night.devices")}</div>
      </div>
      ${o.length ? l`<ul class="devices">
            ${o.map(([t, o]) => {
			let s = {
				tab: "devices",
				section: "climate",
				id: t
			}, c = o.night_from || Wo, d = o.night_until || Go;
			return l`<li>
                <a href=${T(this.prefix, s)} @click=${C(s)}>
                  <b>${a[t] ?? n(this.hass, t)}</b>
                  <span>${i ? e("household.night.until", { until: d }) : e("household.night.span", {
				from: c,
				until: d
			})}</span>
                  ${o.enabled && r?.enabled ? u : l`<small class="hint">${e("household.night.not_steered")}</small>`}
                  <ha-icon icon="mdi:chevron-right"></ha-icon>
                </a>
              </li>`;
		})}
          </ul>` : l`<p class="hint">${e("household.night.devices.none")}</p>`}
      <a class="go-link" href=${T(this.prefix, s)} @click=${C(s)}>${e("household.night.to_climate")}</a>
    </section>`;
	}
	setNightBy(e) {
		P(this, { climate: { night_by: e } }), e === "entity" && !this.state?.config.climate?.night_entity && this.pickNight();
	}
	async pickNight() {
		let e = this.t;
		if (!e) return;
		let t = this.state?.config.climate?.night_entity, n = await F(this, {
			heading: e("pick.night.title"),
			tip: "pick_night",
			filter: "night",
			selected: t ? [t] : []
		});
		n && P(this, { climate: {
			night_by: "entity",
			night_entity: n.selected[0] ?? null
		} });
	}
};
w([b({ attribute: !1 })], Ko.prototype, "hass", void 0), w([b({ attribute: !1 })], Ko.prototype, "t", void 0), w([b({ attribute: !1 })], Ko.prototype, "state", void 0), w([b({ attribute: !1 })], Ko.prototype, "route", void 0), w([b({ attribute: !1 })], Ko.prototype, "prefix", void 0), w([b({ attribute: !1 })], Ko.prototype, "discovery", void 0), w([b({ attribute: !1 })], Ko.prototype, "checks", void 0), w([b({ attribute: !1 })], Ko.prototype, "climateFound", void 0), p("joe-hh-night", Ko);
//#endregion
//#region src/household-helpers.ts
var qo = "gast";
function Jo(e) {
	return Object.values(e.states).filter((e) => e.entity_id.startsWith("group.")).map((e) => ({
		state: e,
		members: e.attributes.entity_id ?? []
	})).filter(({ members: e }) => e.length && e.every((e) => /^(person|device_tracker)\./.test(e))).map(({ state: t, members: r }) => ({
		entity_id: t.entity_id,
		name: n(e, t.entity_id),
		members: r.map((t) => n(e, t))
	}));
}
async function Yo(e, t, n) {
	if (!t.callApi || !t.callService) throw Error("no api");
	let r = `input_boolean.${(await t.callWS({
		type: "input_boolean/create",
		name: n("household.guest.name"),
		icon: "mdi:account-child-outline"
	})).id}`, i = `device_tracker.${qo}`;
	return await t.callApi("POST", `config/automation/config/energy_joe_${qo}`, {
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
				dev_id: qo,
				host_name: n("household.guest.tracker_name"),
				location_name: `{{ 'home' if is_state('${r}', 'on') else 'not_home' }}`
			}
		}],
		mode: "queued"
	}), await t.callService("device_tracker", "see", {
		dev_id: qo,
		host_name: n("household.guest.tracker_name"),
		location_name: "not_home"
	}), P(e, { context: {
		guest_switch: r,
		guest_tracker: i
	} }), i;
}
//#endregion
//#region src/editors/household.ts
var Xo = class extends o {
	constructor(...e) {
		super(...e), this.detailed = !1;
	}
	static {
		this.styles = [f, S`
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
		if (!e || !t || !n) return u;
		let r = (this.discovery?.persons ?? []).filter((e) => M(n, `person:${e.entity_id}`) && !n.persons.some((t) => t.id === e.entity_id));
		return l`${n.persons.length ? l`<ul>
            ${n.persons.map((n) => this.renderPerson(e, t, n))}
          </ul>` : l`<p class="empty">${e("household.empty")}</p>`}
      <div class="with-tip add" data-tipped>
        <button type="button" class="mini-btn" @click=${this.addPerson}>
          <ha-icon icon="mdi:account-plus-outline"></ha-icon>${e("household.add")}
        </button>
        ${O(e, "f_person_add")}
      </div>
      ${r.length ? l`<div class="others" data-tipped>
            <span>${e("household.left_out")}</span>
            ${r.map((e) => l`<button type="button" class="mini-btn quiet" @click=${() => this.bringBack(e)}>
                <ha-icon icon="mdi:undo-variant"></ha-icon>${e.name}
              </button>`)}
            ${O(e, "household_left_out")}
          </div>` : u}`;
	}
	renderPerson(e, t, r) {
		let i = r.person_entity ? t.states[r.person_entity]?.state : void 0, a = i === "home" ? l`<small class="home">${e("household.home")}</small>` : i === "not_home" ? l`<small>${e("household.away")}</small>` : i ? l`<small>${e("household.zone", { zone: i })}</small>` : l`<small>${e("household.no_presence")}</small>`;
		return l`<li class="person" data-anchor=${this.detailed ? r.id : u}>
      <div class="top" data-tipped>
        <span class="avatar" aria-hidden="true">${r.name.slice(0, 1).toUpperCase()}</span>
        <div class="who"><b>${r.name}</b>${a}</div>
        <span class="top-actions">
          ${this.detailed ? U(e, pr(t, r.person_entity, r.name)) : u}
          <button type="button" class="mini-btn quiet" @click=${() => this.removePerson(r)}>
            ${e("household.remove")}
          </button>
          ${O(e, "household_remove")}
        </span>
      </div>
      <div class="cals" data-tipped>
        <span class="cals-label">${e("household.calendars")}</span>
        ${r.calendars.map((i) => l`<span class="cal">
            ${n(t, i)}
            <button
              type="button"
              aria-label=${e("household.calendar_remove", { name: n(t, i) })}
              @click=${() => this.setCalendars(r, r.calendars.filter((e) => e !== i))}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </span>`)}
        <button type="button" class="mini-btn" @click=${() => this.addCalendars(r)}>
          <ha-icon icon="mdi:calendar-plus"></ha-icon>${e("household.calendar_add")}
        </button>
        ${O(e, "f_calendars")}
      </div>
      ${this.detailed ? l`<slot name=${`p:${r.id}`}></slot>` : u}
    </li>`;
	}
	async addPerson() {
		let { t: e, config: t } = this;
		if (!e || !t) return;
		let r = (await F(this, {
			heading: e("pick.person.title"),
			tip: "pick_person",
			filter: "person",
			selected: [],
			exclude: t.persons.map((e) => e.person_entity).filter((e) => !!e)
		}))?.selected[0];
		if (!r || !this.hass) return;
		let i = this.discovery?.persons.find((e) => e.entity_id === r);
		P(this, {
			persons: { [r]: {
				name: n(this.hass, r),
				person_entity: r,
				calendars: i?.calendars ?? []
			} },
			answers: { ignored: N(t, `person:${r}`, !1) }
		});
	}
	bringBack(e) {
		P(this, {
			persons: { [e.entity_id]: {
				name: e.name,
				person_entity: e.entity_id,
				calendars: e.calendars
			} },
			answers: { ignored: N(this.config, `person:${e.entity_id}`, !1) }
		});
	}
	removePerson(e) {
		P(this, {
			persons: { [e.id]: null },
			answers: { ignored: N(this.config, `person:${e.id}`, !0) }
		});
	}
	async addCalendars(e) {
		let t = this.t;
		if (!t) return;
		let n = await F(this, {
			heading: t("pick.calendar.title", { name: e.name }),
			tip: "pick_calendar",
			filter: "calendar",
			multiple: !0,
			selected: e.calendars
		});
		n && this.setCalendars(e, n.selected);
	}
	setCalendars(e, t) {
		P(this, { persons: { [e.id]: { calendars: t } } });
	}
};
w([b({ attribute: !1 })], Xo.prototype, "hass", void 0), w([b({ attribute: !1 })], Xo.prototype, "t", void 0), w([b({ attribute: !1 })], Xo.prototype, "config", void 0), w([b({ attribute: !1 })], Xo.prototype, "discovery", void 0), w([b({ type: Boolean })], Xo.prototype, "detailed", void 0);
var Zo = class extends o {
	constructor(...e) {
		super(...e), this.card = !1, this.leftOut = [], this.guest = !0, this.creating = !1, this.offerNew = !1;
	}
	static {
		this.styles = [f, S`
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
		if (!e || !t || !r) return u;
		let i = r.context.presence_entity, a = this.card ? l`<div class="head">
          <div class="eyebrow"><ha-icon icon="mdi:account-check-outline"></ha-icon>${e("household.presence")}</div>
          ${O(e, "household_presence")}
        </div>` : l`<div class="with-tip"><b>${e("household.presence")}</b>${O(e, "household_presence")}</div>`;
		if (i) {
			let o = ["on", "home"].includes(t.states[i]?.state ?? "");
			return l`<div class="presence" data-tipped>
        ${a}
        <div class="row">
          <span class="chip ${o ? "ok" : ""}" title=${i}>${n(t, i)}</span>
          <small>${e(o ? "household.presence.on" : "household.presence.off")}</small>
          ${U(e, pr(t, i, n(t, i)))}
        </div>
        <p>${e(i.startsWith("group.") ? "household.presence.yours_group" : "household.presence.yours")}</p>
        ${this.renderGuest(e, t, r, i)}
        <div class="row">
          <button type="button" class="mini-btn" @click=${() => void this.pickPresence()}>${e("household.presence.other")}</button>
          <button type="button" class="mini-btn quiet" @click=${() => P(this, { context: { presence_entity: null } })}>
            ${e("household.presence.stop")}
          </button>
        </div>
      </div>`;
		}
		let o = r.persons.filter((e) => e.person_entity), s = o.filter((e) => !this.leftOut.includes(e.person_entity)), c = Jo(t);
		return c.length && !this.offerNew ? l`<div class="presence" data-tipped>
        ${a}
        <p>${e("household.presence.found")}</p>
        ${c.map((t) => l`<div class="row">
            <span class="chip" title=${t.entity_id}>${t.name}</span>
            <small>${t.members.join(", ")}</small>
            <button type="button" class="btn btn-primary" @click=${() => P(this, { context: { presence_entity: t.entity_id } })}>
              ${e("household.presence.use")}
            </button>
          </div>`)}
        <div class="row">
          <button type="button" class="btn btn-ghost" @click=${() => this.offerNew = !0}>${e("household.presence.new_instead")}</button>
        </div>
      </div>` : l`<div class="presence" data-tipped>
      ${a}
      <p>${e("household.presence.propose")}</p>
      <div class="row" role="group" aria-label=${e("household.presence.persons")}>
        ${o.map((e) => {
			let t = !this.leftOut.includes(e.person_entity);
			return l`<button
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
      ${this.failed ? l`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.failed}</span></div>` : u}
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
		if (!a || !o) return l`<div class="guest" data-tipped>
        <div class="with-tip"><b>${e("household.guest")}</b>${O(e, "household_guest")}</div>
        <p>${e("household.guest.offer")}</p>
        ${this.failed ? l`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.failed}</span></div>` : u}
        <div class="row">
          <button type="button" class="btn btn-secondary" ?disabled=${this.creating} @click=${() => void this.addGuest()}>
            ${e(this.creating ? "household.presence.creating" : "household.guest.create")}
          </button>
        </div>
      </div>`;
		let s = t.states[a]?.state === "on", c = t.states[i]?.attributes.entity_id, d = !c || c.includes(o);
		return l`<div class="guest" data-tipped>
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
        ${O(e, "household_guest")}
      </div>
      ${d ? u : l`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon>
            <span>${e("household.guest.add_to_group", { group: n(t, i) })}<code>- ${o}</code></span>
          </div>`}
    </div>`;
	}
	async addGuest() {
		let { t: e, hass: t } = this;
		if (e && t) {
			this.creating = !0, this.failed = void 0;
			try {
				await Yo(this, t, e);
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
				let r = this.guest ? this.config?.context.guest_tracker ?? await Yo(this, n, t) : null;
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
		let t = this.config?.context.presence_entity, n = await F(this, {
			heading: e("pick.presence.title"),
			tip: "pick_presence",
			filter: "presence",
			selected: t ? [t] : []
		});
		n?.selected[0] && P(this, { context: { presence_entity: n.selected[0] } });
	}
};
w([b({ attribute: !1 })], Zo.prototype, "hass", void 0), w([b({ attribute: !1 })], Zo.prototype, "t", void 0), w([b({ attribute: !1 })], Zo.prototype, "config", void 0), w([b({ attribute: !1 })], Zo.prototype, "discovery", void 0), w([b({
	type: Boolean,
	reflect: !0
})], Zo.prototype, "card", void 0), w([y()], Zo.prototype, "leftOut", void 0), w([y()], Zo.prototype, "guest", void 0), w([y()], Zo.prototype, "creating", void 0), w([y()], Zo.prototype, "failed", void 0), w([y()], Zo.prototype, "offerNew", void 0);
var Qo = class extends o {
	static {
		this.styles = S`
    :host {
      display: block;
    }
  `;
	}
	render() {
		return l`<joe-household-people
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
w([b({ attribute: !1 })], Qo.prototype, "hass", void 0), w([b({ attribute: !1 })], Qo.prototype, "t", void 0), w([b({ attribute: !1 })], Qo.prototype, "config", void 0), w([b({ attribute: !1 })], Qo.prototype, "discovery", void 0), p("joe-household-people", Xo), p("joe-household-presence", Zo), p("joe-household", Qo);
//#endregion
//#region src/pages/household/people.ts
var $o = class extends o {
	constructor(...e) {
		super(...e), this.prefix = E, this.checks = [];
	}
	static {
		this.styles = [
			f,
			Bo,
			S`
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
		if (!e || !t || !this.hass) return u;
		let n = t.config, r = [...ko(e, n, this.climateFound), ...Ao(e, n, this.climateFound)], i = !(!this.person || n.persons.some((e) => e.id === this.person));
		return l`<div class="wrap">
      ${Io(e, this.prefix, e("household.people.title"), e("household.people.lead"), r.filter((e, t) => r.findIndex((t) => t.label === e.label) === t))}
      ${i ? l`<div class="note warn" role="status">
            <ha-icon icon="mdi:help-circle-outline"></ha-icon><span>${e("nav.not_found.person")}</span>
          </div>` : u}
      <div class="list-head">
        <span class="eyebrow"><ha-icon icon="mdi:account-group-outline"></ha-icon>${e("household.people.list")}</span>
        ${O(e, "ha_open")}
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
		let r = t.config, a = t.climate?.day, o = t.plan?.meta?.tomorrow, s = o && o.date > zo(this.hass?.config?.time_zone) ? o : void 0, c = [];
		a?.home_office_available && a.labels_state !== "error" && a.home_office.includes(n.name) && c.push(e("household.people.today", { label: e("label.home_office") }));
		let d = s?.labels[n.id];
		d && c.push(e("household.people.tomorrow", { label: e(`label.${d}`) }));
		let f = n.calendars.length > 0, p = No(e, r, n.id), m = r.learned.presence?.[n.id] ?? {}, h = xn.filter((e) => m[e]).map((t) => e("learn.presence.value", {
			label: e(`label.${t}`),
			hours: i(e.lang, m[t].hours, 0)
		})), g = n.person_entity ? t.climate?.usual?.[n.person_entity] : void 0;
		g != null && h.push(e("household.people.usual", { time: Ro(g) }));
		let _ = {
			tab: "household",
			section: "days",
			id: n.id
		};
		return l`<div class="extra" slot=${`p:${n.id}`}>
      ${c.length ? l`<p class="days">${c.join(" · ")}</p>` : u}
      ${f ? l`${this.mirror(e("household.people.rules"), e(n.calendar ? "household.people.rules.own" : "household.people.rules.shared"), _, e("mirror.change"))}
            <p class="used-by ${p.length ? "" : "none"}">
              <ha-icon icon=${p.length ? "mdi:car-clock" : "mdi:link-variant-off"}></ha-icon>
              ${p.length ? l`<span class="used-by-label">${e("household.people.counts")}</span>
                    ${p.map((e) => l`<a class="used-by-item" href=${T(this.prefix, e.to)} @click=${C(e.to)}
                          >${e.label}</a
                        >`)}` : e("household.people.counts.none")}
            </p>` : u}
      ${this.mirror(e("household.people.learned"), n.person_entity ? h.length ? h.join(" · ") : e("household.people.learned.none") : e("learn.presence.no_person"), {
			tab: "review",
			section: "learned",
			id: "presence"
		}, e("household.people.more"))}
    </div>`;
	}
	mirror(e, t, n, r) {
		return l`<div class="mirror">
      <div class="mirror-text">
        <span class="mirror-label">${e}</span>
        <span class="mirror-sep" aria-hidden="true">·</span>
        <span class="mirror-value">${t}</span>
      </div>
      <a class="mini-btn go mirror-go" href=${T(this.prefix, n)} @click=${C(n)}>${r}</a>
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
		t && (await t.updateComplete, t.shadowRoot && me(t.shadowRoot, e) && (this.revealed = e));
	}
};
w([b({ attribute: !1 })], $o.prototype, "hass", void 0), w([b({ attribute: !1 })], $o.prototype, "t", void 0), w([b({ attribute: !1 })], $o.prototype, "state", void 0), w([b({ attribute: !1 })], $o.prototype, "route", void 0), w([b({ attribute: !1 })], $o.prototype, "prefix", void 0), w([b({ attribute: !1 })], $o.prototype, "discovery", void 0), w([b({ attribute: !1 })], $o.prototype, "checks", void 0), w([b({ attribute: !1 })], $o.prototype, "climateFound", void 0), w([b({ attribute: !1 })], $o.prototype, "person", void 0), p("joe-hh-people", $o);
//#endregion
//#region src/pages/household/presence.ts
var es = 15, ts = 240, ns = "https://my.home-assistant.io/redirect/config_flow_start/?domain=proximity";
function rs(e, t, n) {
	let r = t.routing;
	if (r.service === "google") {
		let t = n?.routing?.google.find((e) => e.entry_id === r.google_entry);
		return e("settings.routing.google", { name: t?.title ?? "Google" });
	}
	return e(r.service ? `settings.routing.${r.service}` : "settings.routing.none");
}
var is = class extends o {
	constructor(...e) {
		super(...e), this.prefix = E, this.checks = [];
	}
	static {
		this.styles = [
			f,
			Bo,
			S`
      .way-list {
        margin: 6px 0 0;
      }
    `
		];
	}
	render() {
		let { t: e, state: t } = this;
		if (!e || !t || !this.hass) return u;
		let n = t.config;
		return l`<div class="wrap">
      ${Io(e, this.prefix, e("household.presence.title"), e("household.presence.lead"), ko(e, n, this.climateFound))}
      ${this.renderLive(e, t)}
      <joe-household-presence card .hass=${this.hass} .t=${e} .config=${n} .discovery=${this.discovery}></joe-household-presence>
      ${this.renderWay(e, n)}
    </div>`;
	}
	renderLive(e, t) {
		let n = t.climate, r = n?.home ?? [], a = Object.entries(n?.arrivals ?? this.climateFound?.arrivals ?? {}), o = Object.fromEntries(t.config.persons.map((e) => [e.person_entity, e.name])), s = t.config.climate?.away_after_min ?? es;
		return l`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:home-account"></ha-icon>${e("household.presence.now")}</div>
        ${O(e, "climate_presence")}
      </div>
      <p class="now">${r.length ? e("climate.home", { names: r.join(", ") }) : e("climate.nobody")}</p>
      ${a.map(([t, n]) => l`<p class="hint">
          ${e(`climate.way.${n.direction === "towards" ? "towards" : n.direction === "away_from" ? "away" : "other"}`, {
			name: o[t] ?? this.hass?.states[t]?.attributes.friendly_name ?? t,
			km: n.km == null ? "–" : i(e.lang, n.km, 1)
		})}
          ${n.direction === "towards" && n.minutes != null ? e(n.source ? "climate.way.minutes_route" : "climate.way.minutes_guess", { minutes: n.minutes }) : u}
        </p>`)}
      <div class="row" data-tipped>
        <span>${e("climate.away_after")}</span>
        <input
          class="input short"
          type="number"
          inputmode="numeric"
          min="0"
          max=${ts}
          step="1"
          aria-label=${e("climate.away_after")}
          .value=${String(s)}
          @change=${(e) => {
			let t = e.target, n = Math.round(Number.parseFloat(t.value.replace(",", ".")));
			if (!Number.isFinite(n)) {
				t.value = String(s);
				return;
			}
			let r = Math.min(ts, Math.max(0, n));
			t.value = String(r), P(this, { climate: { away_after_min: r } });
		}}
        />
        <span>${e("climate.away_after.unit")}</span>
        ${O(e, "climate_away_after")}
      </div>
    </section>`;
	}
	renderWay(e, t) {
		let n = t.climate?.route_eta ?? !0;
		return l`<section class="card" data-anchor="way" data-tipped>
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
          @click=${() => P(this, { climate: { route_eta: !n } })}
        ></button>
        ${O(e, "climate_route_eta")}
      </div>
      ${Yr(e, this.prefix, {
			label: e("household.presence.routing"),
			value: rs(e, t, this.info),
			to: {
				tab: "household",
				section: "travel"
			},
			action: t.routing.service ? "change" : "set"
		})}
      ${this.climateFound && !this.climateFound.proximity ? l`<p class="hint">
            ${e("climate.no_proximity")}
            <a href=${ns} target="_blank" rel="noreferrer noopener">${e("climate.add_proximity")}</a>
          </p>` : u}
    </section>`;
	}
	willUpdate(e) {
		e.has("anchor") && (this.revealed = void 0);
	}
	updated() {
		this.anchor && this.revealed !== this.anchor && me(this.renderRoot, this.anchor) && (this.revealed = this.anchor);
	}
};
w([b({ attribute: !1 })], is.prototype, "hass", void 0), w([b({ attribute: !1 })], is.prototype, "t", void 0), w([b({ attribute: !1 })], is.prototype, "state", void 0), w([b({ attribute: !1 })], is.prototype, "route", void 0), w([b({ attribute: !1 })], is.prototype, "prefix", void 0), w([b({ attribute: !1 })], is.prototype, "discovery", void 0), w([b({ attribute: !1 })], is.prototype, "checks", void 0), w([b({ attribute: !1 })], is.prototype, "climateFound", void 0), w([b({ attribute: !1 })], is.prototype, "info", void 0), w([b({ attribute: !1 })], is.prototype, "anchor", void 0), p("joe-hh-presence", is);
//#endregion
//#region src/pages/household/travel.ts
var as = class extends o {
	constructor(...e) {
		super(...e), this.prefix = E, this.checks = [];
	}
	static {
		this.styles = [
			f,
			Bo,
			Va,
			S`
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
		let { t: e, state: t, hass: r } = this;
		if (!e || !t || !r) return u;
		let i = t.config;
		return l`<div class="wrap">
      ${Io(e, this.prefix, e("household.travel.title"), e("household.travel.lead"), null)}
      <section class="card">
        ${Wa(e, [Ka(this, r, e, i, this.discovery, "weather", (t) => U(e, pr(r, t, n(r, t))))])}
        ${Fo(e, this.prefix, Mo(e, i, "weather", this.climateFound))}
      </section>
      ${this.renderRouting(e, t)}
    </div>`;
	}
	renderRouting(e, t) {
		let n = t.config.routing, r = this.info?.routing, i = n.service === "google" ? `google:${n.google_entry ?? ""}` : n.service ?? "", a = (e) => {
			e.startsWith("google:") ? P(this, { routing: {
				service: "google",
				google_entry: e.slice(7) || null
			} }) : P(this, { routing: {
				service: e || null,
				google_entry: null
			} });
		}, o = (t) => l`<div class="field" data-tipped>
      <span class="field-label"><label for="routing-${t}">${e(`settings.routing.${t}`)}</label>${O(e, "routing_osm")}</span>
      <small class="field-hint">${e(`settings.routing.${t}.hint`)}</small>
      <input
        id="routing-${t}"
        class="input"
        type="url"
        .value=${n[t]}
        @change=${(e) => {
			let n = e.target.value.trim();
			n.startsWith("http") && P(this, { routing: { [t]: n } });
		}}
      />
    </div>`;
		return l`<section class="card">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:map-marker-distance"></ha-icon>${e("settings.routing")}</div>
      </div>
      <p class="say">${e("settings.routing.intro")}</p>
      <div class="field" data-tipped>
        <span class="field-label"><label for="routing-service">${e("settings.routing.service")}</label>${O(e, "routing_service")}</span>
        <small class="field-hint">${e("settings.routing.service.hint")}</small>
        <select id="routing-service" class="input" @change=${(e) => a(e.target.value)}>
          <option value="" ?selected=${i === ""}>${e("settings.routing.none")}</option>
          ${r?.waze === !1 ? u : l`<option value="waze" ?selected=${i === "waze"}>${e("settings.routing.waze")}</option>`}
          ${(r?.google ?? []).map((t) => l`<option value=${`google:${t.entry_id}`} ?selected=${i === `google:${t.entry_id}`}>
                ${e("settings.routing.google", { name: t.title })}
              </option>`)}
          <option value="osm" ?selected=${i === "osm"}>${e("settings.routing.osm")}</option>
        </select>
      </div>
      ${n.service === "osm" ? l`${o("geocoder_url")} ${o("router_url")}` : u}
      ${Fo(e, this.prefix, Mo(e, t.config, "routing", this.climateFound))}
    </section>`;
	}
};
w([b({ attribute: !1 })], as.prototype, "hass", void 0), w([b({ attribute: !1 })], as.prototype, "t", void 0), w([b({ attribute: !1 })], as.prototype, "state", void 0), w([b({ attribute: !1 })], as.prototype, "route", void 0), w([b({ attribute: !1 })], as.prototype, "prefix", void 0), w([b({ attribute: !1 })], as.prototype, "discovery", void 0), w([b({ attribute: !1 })], as.prototype, "checks", void 0), w([b({ attribute: !1 })], as.prototype, "climateFound", void 0), w([b({ attribute: !1 })], as.prototype, "info", void 0), p("joe-hh-travel", as);
//#endregion
//#region src/pages/household/index.ts
var os = {
	people: "joe-hh-people",
	presence: "joe-hh-presence",
	days: "joe-hh-days",
	night: "joe-hh-night",
	travel: "joe-hh-travel"
}, ss = {
	people: "mdi:account-group-outline",
	presence: "mdi:home-account",
	days: "mdi:calendar-check-outline",
	night: "mdi:sleep",
	travel: "mdi:map-marker-path"
}, cs = class extends o {
	constructor(...e) {
		super(...e), this.prefix = E, this.checks = [];
	}
	static {
		this.styles = [f, S`
      :host {
        display: block;
      }
    `];
	}
	render() {
		let e = this.t;
		if (!e || !this.state) return u;
		let t = this.route?.section ?? fe.household, n = le.household.map((t) => ({
			id: t,
			label: e(`nav.household.${t}`),
			icon: ss[t]
		}));
		return l`${cr(e, this.prefix, "household", n, t)}${this.renderSection(t)}`;
	}
	renderSection(e) {
		if (!customElements.get(os[e])) return l``;
		let { t, hass: n, state: r, prefix: i, route: a, discovery: o, checks: s, climateFound: c, info: u } = this;
		switch (e) {
			case "people": return l`<joe-hh-people
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
			case "presence": return l`<joe-hh-presence
          .t=${t}
          .hass=${n}
          .state=${r}
          .prefix=${i}
          .route=${a}
          .discovery=${o}
          .checks=${s}
          .climateFound=${c}
          .info=${u}
          .anchor=${a?.id}
        ></joe-hh-presence>`;
			case "days": return l`<joe-hh-days
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
			case "night": return l`<joe-hh-night
          .t=${t}
          .hass=${n}
          .state=${r}
          .prefix=${i}
          .route=${a}
          .discovery=${o}
          .checks=${s}
          .climateFound=${c}
        ></joe-hh-night>`;
			case "travel": return l`<joe-hh-travel
          .t=${t}
          .hass=${n}
          .state=${r}
          .prefix=${i}
          .route=${a}
          .discovery=${o}
          .checks=${s}
          .climateFound=${c}
          .info=${u}
        ></joe-hh-travel>`;
		}
	}
};
w([b({ attribute: !1 })], cs.prototype, "hass", void 0), w([b({ attribute: !1 })], cs.prototype, "t", void 0), w([b({ attribute: !1 })], cs.prototype, "state", void 0), w([b({ attribute: !1 })], cs.prototype, "route", void 0), w([b({ attribute: !1 })], cs.prototype, "prefix", void 0), w([b({ attribute: !1 })], cs.prototype, "discovery", void 0), w([b({ attribute: !1 })], cs.prototype, "checks", void 0), w([b({ attribute: !1 })], cs.prototype, "climateFound", void 0), w([b({ attribute: !1 })], cs.prototype, "info", void 0), p("joe-household-page", cs);
//#endregion
//#region src/components/chart.ts
var ls = 40, us = 10, ds = 16, fs = 24;
function ps(e) {
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
function ms(e) {
	let t = [], n = [];
	return e.forEach((e, r) => {
		e == null ? (n.length && t.push(n), n = []) : n.push([r, e]);
	}), n.length && t.push(n), t;
}
var X = class extends o {
	constructor(...e) {
		super(...e), this.labels = [], this.ticks = /* @__PURE__ */ new Map(), this.series = [], this.bands = [], this.markers = [], this.unit = "kWh", this.max = 0, this.height = 220, this.label = "", this.lang = "de", this.centerTicks = !1, this.width = 640, this.hover = null;
	}
	static {
		this.styles = S`
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
		if (!e) return u;
		let t = Math.max(260, this.width), n = this.height, r = t - ls - us, i = n - ds - fs, a = r / e, o = this.series.flatMap((e) => e.values.filter((e) => e != null)), s = this.max || ps(Math.max(.1, ...o)), c = Math.min(0, ...o), d = c < 0 ? -Math.max(ps(-c), s / 4) : 0, f = (e) => ds + i - (Math.max(d, Math.min(e, s)) - d) / (s - d) * i, p = (e) => ls + e * a, m = (e) => ls + (e + .5) * a, h = (e, t = 2) => new Intl.NumberFormat(this.lang, { maximumFractionDigits: t }).format(e), g = [];
		for (let e of this.bands) g.push(x`<rect class="band" x=${p(e.from)} y=${ds} width=${Math.max(0, p(e.to) - p(e.from))} height=${i}></rect>
        <text class="note" x=${(p(e.from) + p(e.to)) / 2} y=${28} text-anchor="middle">${e.label}</text>`);
		for (let e of d < 0 ? [
			d,
			0,
			s
		] : [
			0,
			s / 2,
			s
		]) g.push(x`<line class="grid" x1=${ls} x2=${t - us} y1=${f(e)} y2=${f(e)}></line>
        <text class="tick" x=${34} y=${f(e) + 4} text-anchor="end">${h(e, 2)}</text>`);
		g.push(x`<text class="tick" x=${34} y=${11} text-anchor="end">${this.unit}</text>`);
		for (let [e, t] of this.ticks) g.push(x`<text class="tick" x=${this.centerTicks ? m(e) : p(e)} y=${n - 6}
        text-anchor="middle">${t}</text>`);
		let _ = this.series.filter((e) => e.kind === "bar"), v = a * .68 / Math.max(1, _.length);
		for (let e of this.series) {
			if (e.kind === "bar") {
				let t = a * .16 + _.indexOf(e) * v;
				e.values.forEach((n, r) => {
					if (n != null && n !== 0) {
						let i = Math.min(f(n), f(0));
						g.push(x`<rect x=${p(r) + t} y=${i} width=${Math.max(1, v - 1)}
              height=${Math.max(1, Math.abs(f(0) - f(n)))} rx="2"
              fill=${n < 0 ? e.negative ?? e.color : e.color}></rect>`);
					}
				});
				continue;
			}
			for (let t of ms(e.values)) {
				let n = t.map(([e, t]) => `${m(e).toFixed(1)},${f(t).toFixed(1)}`).join(" ");
				if (e.kind === "area" && t.length > 1) {
					let r = f(0).toFixed(1);
					g.push(x`<polygon points=${`${m(t[0][0]).toFixed(1)},${r} ${n} ${m(t[t.length - 1][0]).toFixed(1)},${r}`}
            fill=${e.fill ?? e.color}></polygon>`);
				}
				t.length > 1 ? g.push(x`<polyline points=${n} fill="none" stroke=${e.color} stroke-width=${e.kind === "line" ? 2.4 : 2}
            stroke-linejoin="round" stroke-dasharray=${e.dashed ? "5 4" : "none"}></polyline>`) : g.push(x`<circle cx=${m(t[0][0])} cy=${f(t[0][1])} r="2.5" fill=${e.color}></circle>`);
			}
		}
		for (let e of this.markers) {
			let n = ls + e.at * a, o = n < ls + r * .75;
			g.push(x`<line class="marker" x1=${n} x2=${n} y1=${ds} y2=${ds + i}></line>
        <text class="note" x=${o ? n + 4 : n - 4} y=${28} text-anchor=${o ? "start" : "end"}>
          ${t < 520 ? e.short ?? e.label : e.label}
        </text>`);
		}
		this.hover != null && g.push(x`<line class="guide" x1=${m(this.hover)} x2=${m(this.hover)} y1=${ds} y2=${ds + i}></line>`);
		for (let t = 0; t < e; t++) g.push(x`<rect class="slot" x=${p(t)} y=${ds} width=${a} height=${i}
        @pointerenter=${() => this.hover = t} @click=${() => this.hover = t}></rect>`);
		return l`<svg
        viewBox="0 0 ${t} ${n}"
        height=${n}
        role="img"
        aria-label=${this.label}
        @pointerleave=${(e) => e.pointerType === "mouse" && (this.hover = null)}
      >
        ${g}
      </svg>
      ${this.hover == null ? u : this.renderBox(this.hover, m(this.hover), t, h)}`;
	}
	renderBox(e, t, n, r) {
		let i = t + 182 > n ? Math.max(0, t - 182) : t + 12;
		return l`<div class="box" style="left:${i}px">
      <b>${this.labels[e]}</b>
      ${this.series.map((t) => {
			let n = t.values[e];
			return n == null ? u : l`<div>
              <i style="background:${n < 0 ? t.negative ?? t.color : t.color}"></i><span>${t.label}</span
              ><em>${r(n, t.digits ?? 2)} ${this.unit}</em>
            </div>`;
		})}
    </div>`;
	}
};
w([b({ attribute: !1 })], X.prototype, "labels", void 0), w([b({ attribute: !1 })], X.prototype, "ticks", void 0), w([b({ attribute: !1 })], X.prototype, "series", void 0), w([b({ attribute: !1 })], X.prototype, "bands", void 0), w([b({ attribute: !1 })], X.prototype, "markers", void 0), w([b()], X.prototype, "unit", void 0), w([b({ type: Number })], X.prototype, "max", void 0), w([b({ type: Number })], X.prototype, "height", void 0), w([b()], X.prototype, "label", void 0), w([b()], X.prototype, "lang", void 0), w([b({ type: Boolean })], X.prototype, "centerTicks", void 0), w([y()], X.prototype, "width", void 0), w([y()], X.prototype, "hover", void 0), p("joe-chart", X);
//#endregion
//#region src/components/day-answer.ts
var hs = {
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
}, gs = class extends o {
	constructor(...e) {
		super(...e), this.date = "", this.changing = !1, this.busy = !1, this.failed = !1;
	}
	static {
		this.styles = [f, S`
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
		if (!e || !this.date || !t && !this.question) return u;
		let n = !t || this.changing;
		return l`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:chat-question-outline"></ha-icon>${e("ask.title")}</div>
        ${O(e, "ask_day")}
      </div>
      ${n ? l`<p>
              ${this.question ? e(`ask.${this.question.kind}`, {
			day: V(e.lang, this.question.date, "weekday"),
			actual: B(e.lang, this.question.actual, 1),
			expected: B(e.lang, this.question.expected, 1)
		}) : e("past.answer.ask")}
            </p>
            <div class="answers" role="group" aria-label=${e("ask.answers")}>
              ${hs[this.question?.kind ?? "any"].map((n) => l`<button
                    type="button"
                    class="mini-btn ${n === "normal" ? "quiet" : ""}"
                    aria-pressed=${String(n === t)}
                    ?disabled=${this.busy}
                    @click=${() => this.choose(n)}
                  >
                    ${e(`ask.answer.${n}`)}
                  </button>`)}
              ${t ? l`<button type="button" class="mini-btn quiet" ?disabled=${this.busy} @click=${() => this.changing = !1}>
                    ${e("common.cancel")}
                  </button>` : u}
            </div>` : l`<div class="given">
            <p>${e("past.answer.given", { answer: e(`ask.answer.${t}`) })}</p>
            <button type="button" class="mini-btn" @click=${() => this.changing = !0}>
              <ha-icon icon="mdi:pencil-outline"></ha-icon>${e("past.answer.change")}
            </button>
          </div>`}
      ${this.failed ? l`<div class="note warn" role="status"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("error.action")}</div>` : u}
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
w([b({ attribute: !1 })], gs.prototype, "hass", void 0), w([b({ attribute: !1 })], gs.prototype, "t", void 0), w([b({ attribute: !1 })], gs.prototype, "date", void 0), w([b({ attribute: !1 })], gs.prototype, "answer", void 0), w([b({ attribute: !1 })], gs.prototype, "question", void 0), w([y()], gs.prototype, "changing", void 0), w([y()], gs.prototype, "busy", void 0), w([y()], gs.prototype, "failed", void 0), w([y()], gs.prototype, "given", void 0), p("joe-day-answer", gs);
//#endregion
//#region src/pages/lookback/days.ts
var _s = 14, vs = [
	"var(--joe-c-soc)",
	"var(--joe-c-soc-2)",
	"var(--joe-c-grid)",
	"var(--joe-c-ist)"
];
function ys(e, t, n) {
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
var bs = class extends o {
	constructor(...e) {
		super(...e), this.prefix = E, this.failed = !1, this.fromStrip = !1, this.reveal = !1;
	}
	static {
		this.styles = [f, S`
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
				days: _s
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
		if (!e) return u;
		if (!this.days?.days.length) return this.renderEmpty(e);
		let n = this.selected;
		return l`<div class="wrap">
      ${c(e("history.title"))} ${t}
      <p class="status">${this.statusText(e)}</p>
      ${this.rebuildLink(e)}
      ${this.failed ? l`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("history.failed")}</div>` : u}
      ${this.renderStrip(e, this.days.days, n)}
      ${this.day && (!n || this.blank) ? l`<div class="note"><ha-icon icon="mdi:calendar-remove-outline"></ha-icon>${e("past.days.unknown", { day: this.dayName(e, this.day) })}</div>` : u}
      ${this.detail && n && !this.blank ? this.renderDay(e, this.detail) : u}
    </div>`;
	}
	dayName(e, t) {
		return /^\d{4}-\d{2}-\d{2}$/.test(t) ? ys(e.lang, t, "long") : t;
	}
	rebuildLink(e) {
		let t = this.state?.observe;
		if (!t?.active || t.backfill.state === "running") return u;
		let n = {
			tab: "settings",
			section: "maintenance",
			id: "observe"
		};
		return l`<a class="more" href=${T(this.prefix, n)} @click=${C(n)}>${e("past.days.rebuild")}</a>`;
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
		let n = this.state?.observe, r = this.state?.mode === "off" ? "history.empty.off" : n?.backfill.state === "running" ? "history.empty.reading" : n?.active ? "history.empty.soon" : "history.empty.waiting";
		return l`<div class="empty">
      <joe-pose name="inspect"></joe-pose>
      <div>
        ${c(e("history.title"))} ${t}
        <p class="lead">${e(r)}</p>
        ${this.failed ? l`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("history.failed")}</div>` : u}
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
		return l`<nav class="strip" aria-label=${e("history.days")}>
      ${a.map((t) => {
			let r = i.get(t), a = l`<small>${ys(e.lang, t, "short")}</small>
          <b>${Number(t.slice(8))}</b>
          <span class="mini" aria-hidden="true">
            <i style="height:${(r?.home ?? 0) / o * 26}px;background:var(--joe-c-load)"></i>
            <i style="height:${(r?.solar ?? 0) / o * 26}px;background:var(--joe-c-pv)"></i>
          </span>`;
			if (!r) return l`<span aria-disabled="true" aria-label=${ys(e.lang, t, "long")}>${a}</span>`;
			let s = {
				tab: "review",
				section: "days",
				id: t
			}, c = C(s);
			return l`<a
          href=${T(this.prefix, s)}
          aria-current=${t === n ? "date" : u}
          aria-label=${ys(e.lang, t, "long")}
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
		return l`<div class="day-head" data-anchor="day">
        <h3>${ys(e.lang, t.date, "long")}</h3>
        ${t.workday === !0 ? l`<span class="chip">${e("history.workday")}</span>` : t.workday === !1 ? l`<span class="chip">${e("history.day_off")}</span>` : u}
        ${i ? l`<span class="chip ok"><ha-icon icon="mdi:eye-outline"></ha-icon>${e("history.live")}</span>` : u}
        ${a ? l`<span class="chip read"><ha-icon icon="mdi:database-outline"></ha-icon>${e("history.read")}</span>` : u}
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
      ${r && n.date !== this.days?.days[0]?.date ? l`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("history.missing", { hours: r })}</span>
          </div>` : u}`;
	}
	renderTiles(e, t) {
		let n = (t) => t == null ? "–" : i(e.lang, t, 1), r = [], a = (e, t, n, r) => l`<div class="tile">
        <div class="eyebrow">${e}</div>
        <div class="value">${t}<small>${n}</small></div>
        ${r ? l`<div class="sub">${r}</div>` : u}
      </div>`;
		if (t.home != null && r.push(a(e("history.tile.home"), n(t.home), "kWh", t.self_sufficiency == null ? "" : e("history.tile.home.self", { value: i(e.lang, t.self_sufficiency * 100, 0) }))), t.solar != null && r.push(a(e("history.tile.solar"), n(t.solar), "kWh", t.fc_ahead == null ? e("history.tile.solar.nofc") : e("history.tile.solar.fc", {
			value: n(t.fc_ahead),
			ratio: t.solar_vs_fc == null ? "–" : i(e.lang, t.solar_vs_fc * 100, 0)
		}))), t.grid_in != null) {
			let i = [];
			t.grid_in_cheap != null && i.push(e("history.tile.grid.cheap", { value: n(t.grid_in_cheap) })), t.grid_out != null && i.push(e("history.tile.grid.out", { value: n(t.grid_out) })), r.push(a(e("history.tile.grid"), n(t.grid_in), "kWh", i.join(" · ")));
		}
		if (t.bat_in != null && r.push(a(e("history.tile.battery"), n(t.bat_in), "kWh", e("history.tile.battery.out", { value: n(t.bat_out) }))), t.temp && r.push(a(e("history.tile.temp"), i(e.lang, t.temp.mean, 1), "°C", e("history.tile.temp.range", {
			min: i(e.lang, t.temp.min, 0),
			max: i(e.lang, t.temp.max, 0)
		}))), t.present) {
			let n = new Map((this.state?.config.persons ?? []).map((e) => [e.id, e.name])), o = Object.entries(t.present), s = Math.max(...o.map(([, e]) => e));
			r.push(a(e("history.tile.present"), i(e.lang, s, 0), "h", o.map(([t, r]) => `${n.get(t) ?? t} ${i(e.lang, r, 0)} h`).join(" · ")));
		}
		return l`<div class="tiles">${r}</div>`;
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
		return l`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("history.chart.energy")} ${O(e, "chart_energy")}</div>
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
		return l`<div class="legend">
      ${e.map((e) => l`<span><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color}"></i>${e.label}</span>`)}
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
				color: vs[n % vs.length],
				digits: 0
			};
		});
		if (!n.some((e) => e.values.some((e) => e != null))) return u;
		t.plan_soc_slots.some((e) => e != null) && n.push({
			label: e("history.chart.plan"),
			kind: "line",
			values: t.plan_soc_slots,
			color: "var(--joe-c-ist)",
			dashed: !0,
			digits: 0
		});
		let r = this.chartFrame(t);
		return l`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("history.chart.soc")} ${O(e, "chart_soc")}</div>
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
		if (!t.plan?.fixed) return u;
		if (!n) return l`<div class="note"><ha-icon icon="mdi:timer-sand"></ha-icon><span>${e("history.eval.pending")}</span></div>`;
		if (!n.complete) return l`<div class="note warn">
        <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("history.eval.incomplete")}</span>
      </div>`;
		let r = this.hass?.config?.currency, i = n.saving ?? 0, a = i > .005 ? "good" : i < -.005 ? "bad" : "", o = (t) => B(e.lang, t ?? 0, 1), s = (t) => t ? e("history.eval.clock", { time: this.time(t) }) : e("history.eval.never"), c = !n.final, d = [[e("history.eval.day"), e("history.eval.instead", {
			with: o(n.with_plan?.day_kwh),
			without: o(n.without?.day_kwh)
		})], [e("history.eval.night"), e("history.eval.instead", {
			with: o(n.with_plan?.night_kwh),
			without: o(n.without?.night_kwh)
		})]];
		!c && n.solar?.forecast != null && d.push([e("history.eval.solar"), e("history.eval.solar.value", {
			actual: o(n.solar.actual),
			expected: o(n.solar.forecast)
		})]), !c && n.bridge && d.push([e("history.eval.morning"), e("history.eval.morning.value", {
			actual: o(n.bridge.actual),
			expected: o(n.bridge.planned)
		})]), !c && n.takeover && d.push([e("history.eval.takeover"), e("history.eval.takeover.value", {
			actual: s(n.takeover.actual),
			expected: s(n.takeover.planned)
		})]);
		let f = [{
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
		}], p = this.chartFrame(t);
		return l`<div class="chart-card" data-tipped>
      <div class="chart-head">
        ${e("history.eval")} ${O(e, "chart_replay")}
        ${c && n.until ? l`<span class="chip warn">${e("history.eval.provisional", { time: this.time(n.until) })}</span>` : u}
      </div>
      <div class="eval-top">
        <div class="eval-big ${a}">
          ${a === "bad" ? fn(e, -i, r) : fn(e, i, r)}
          <small>${e(a === "good" ? "history.eval.saved" : a === "bad" ? "history.eval.cost" : "history.eval.same")}</small>
        </div>
        <dl>${d.map(([e, t]) => l`<dt>${e}</dt><dd>${t}</dd>`)}</dl>
      </div>
      ${c && n.until ? l`<div class="note">
            <ha-icon icon="mdi:timer-sand"></ha-icon
            ><span>${e("history.eval.provisional.note", { time: this.time(n.until) })}</span>
          </div>` : u}
      ${f.some((e) => e.values.some((e) => e != null)) ? l`<joe-chart
              .labels=${p.labels}
              .ticks=${p.ticks}
              .series=${f}
              .bands=${p.bands}
              max="100"
              height="150"
              unit="%"
              lang=${e.lang}
              label=${e("history.eval")}
            ></joe-chart>
            ${this.legend(f)}` : u}
    </div>`;
	}
	time(e) {
		return e.slice(11, 16);
	}
};
w([b({ attribute: !1 })], bs.prototype, "hass", void 0), w([b({ attribute: !1 })], bs.prototype, "t", void 0), w([b({ attribute: !1 })], bs.prototype, "state", void 0), w([b({ attribute: !1 })], bs.prototype, "prefix", void 0), w([b({ attribute: !1 })], bs.prototype, "route", void 0), w([b({ attribute: !1 })], bs.prototype, "climateFound", void 0), w([b({ attribute: !1 })], bs.prototype, "day", void 0), w([y()], bs.prototype, "days", void 0), w([y()], bs.prototype, "detail", void 0), w([y()], bs.prototype, "failed", void 0), p("joe-lookback-days", bs);
//#endregion
//#region src/pages/lookback/learned.ts
var xs = [
	"clear",
	"mixed",
	"overcast"
], Ss = {
	forecast_solar: "Forecast.Solar",
	open_meteo_solar_forecast: "Open-Meteo Solar Forecast",
	solcast_solar: "Solcast"
}, Cs = [
	"all",
	...wn,
	"climate"
];
function ws(e, t, n) {
	let r = e.base + (t ? e.workday : 0) + e.heat * Math.max(0, 15 - n) + e.cool * Math.max(0, n - 22);
	return e.presence != null && (r += e.presence * (e.presence_mean ?? 0)), Math.max(0, r);
}
var Z = class extends o {
	constructor(...e) {
		super(...e), this.prefix = E, this.failed = !1, this.confirming = !1, this.resetting = !1, this.scope = "all";
	}
	static {
		this.styles = [
			f,
			hi,
			S`
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
		let t = Ci(this.state);
		e.has("state") && this.marker !== void 0 && t !== this.marker && this.load(), this.marker = t, e.has("anchor") && this.anchor && (this.pending = this.anchor);
	}
	updated() {
		let e = this.pending;
		e && this.data && me(this.renderRoot, e) && (this.pending = void 0);
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
		if (!e) return u;
		let n = this.data;
		return l`<div class="wrap">
        <div class="intro">
          <div>
            ${c(e("learn.page.title"))} ${t}
            <p class="lead">${e("learn.lead")}</p>
            <p class="status">${this.statusText(e)}</p>
          </div>
          <joe-pose name="learn"></joe-pose>
        </div>
        ${this.failed ? l`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("learn.failed")}</div>` : u}
        ${n ? l`<div class="group" data-anchor="sun">
                <div class="eyebrow section"><ha-icon icon="mdi:weather-sunny"></ha-icon>${e("past.learned.group.sun")}</div>
                <div class="grid">${this.renderSolar(e, n)} ${this.renderShift(e, n)} ${this.renderSources(e, n)}</div>
              </div>
              <div class="group" data-anchor="consumption">
                <div class="eyebrow section"><ha-icon icon="mdi:home-lightning-bolt-outline"></ha-icon>${e("past.learned.group.consumption")}</div>
                <div class="grid">${this.renderHome(e, n)} ${this.renderWeather(e, n)} ${this.renderBuffer(e, n)}</div>
              </div>
              <div class="group">
                <div class="eyebrow section"><ha-icon icon="mdi:devices"></ha-icon>${e("past.learned.group.devices")}</div>
                <div class="grid">
                  ${this.renderBatteries(e, n)} ${this.renderGroups(e, n)} ${this.renderHotWater(e, n)}
                  ${this.renderCars(e, n)} ${this.renderClimate(e)}
                </div>
              </div>
              <div class="group">
                <div class="eyebrow section"><ha-icon icon="mdi:account-group-outline"></ha-icon>${e("past.learned.group.household")}</div>
                <div class="grid">${this.renderPresence(e, n)}</div>
              </div>
              ${this.renderReset(e)}` : u}
      </div>
      ${this.confirming ? this.renderConfirm(e) : u}`;
	}
	statusText(e) {
		let t = this.state?.observe, n = this.state?.config.learned;
		if (this.state?.mode === "off") return e("learn.paused");
		if (!t?.active) return e("learn.waiting");
		let r = [];
		return n?.since ? r.push(e("learn.since", { day: V(e.lang, n.since) })) : t.first_day && r.push(e("learn.since_start", { day: V(e.lang, t.first_day) })), n?.updated && r.push(e("learn.updated", {
			day: V(e.lang, n.updated, "short"),
			time: n.updated.slice(11, 16)
		})), r.join(" · ");
	}
	goLink(e, t) {
		return l`<a class="go-link" href=${T(this.prefix, e)} @click=${C(e)}>${t}</a>`;
	}
	renderSolar(e, t) {
		let n = t.learned, r = n.solar_factor, a;
		a = r == null ? e("learn.solar.learning", {
			need: t.needs.solar,
			have: n.solar_days
		}) : r < .95 ? e("learn.solar.less", {
			value: i(e.lang, (1 - r) * 100, 0),
			share: i(e.lang, r * 100, 0)
		}) : r > 1.05 ? e("learn.solar.more", {
			value: i(e.lang, (r - 1) * 100, 0),
			share: i(e.lang, r * 100, 0)
		}) : e("learn.solar.fits");
		let o = t.solar.slice(-28), s = [{
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
		return l`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:weather-sunny"></ha-icon>${e("learn.solar")}</div>
        ${O(e, "learn_solar")}
      </div>
      <div class="figure">
        <div class="big ${r == null ? "small" : ""}">
          ${r == null ? e("learn.still") : `× ${i(e.lang, r, 2)}`}
        </div>
        ${r == null ? u : l`${A(e, { source: "learned" })}<span class="chip">${e("learn.days", { days: n.solar_days })}</span>`}
      </div>
      <p class="say">${a}</p>
      ${o.length > 1 ? this.chartWithLegend(e, o.map((e) => e.date), s, "kWh", e("learn.solar.chart")) : u}
    </section>`;
	}
	renderShift(e, t) {
		let n = t.learned, r = n.solar_shift;
		return l`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:clock-time-four-outline"></ha-icon>${e("learn.shift")}</div>
        ${O(e, "learn_shift")}
      </div>
      <div class="figure">
        <div class="big ${r == null ? "small" : ""}">${e(r == null ? "learn.still" : `learn.shift.big.${r}`)}</div>
        ${r == null ? u : l`${A(e, { source: "learned" })}<span class="chip">${e("learn.days", { days: n.shift_days })}</span>`}
      </div>
      <p class="say">
        ${r == null ? e("learn.shift.learning", {
			need: t.needs.shift,
			have: n.shift_days
		}) : e(`learn.shift.${r}`)}
      </p>
      ${t.solar_profile ? this.hourChart(e, this.profileSeries(e, t.solar_profile), e("learn.shift.chart")) : u}
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
		return l`<joe-chart
        .labels=${r}
        .ticks=${i}
        .series=${t}
        unit="kWh"
        height="150"
        lang=${e.lang}
        label=${n}
      ></joe-chart>
      <div class="legend">
        ${t.map((e) => l`<span><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color}"></i>${e.label}</span>`)}
      </div>`;
	}
	renderBuffer(e, t) {
		let { value: n, source: r } = t.buffer, a = t.learned, o = (t) => i(e.lang, t * 100, 0), s;
		s = r === "user" ? a.buffer == null ? e("learn.buffer.user") : e("learn.buffer.user_learned", { value: o(a.buffer) }) : r === "learned" ? e("learn.buffer.learned") : e("learn.buffer.default", {
			need: t.needs.buffer,
			have: a.buffer_days
		});
		let c = t.accuracy.slice(-14), d = [{
			label: e("learn.buffer.chart.planned"),
			kind: "bar",
			values: c.map((e) => e.bridge.planned),
			color: "var(--joe-c-ist)",
			digits: 1
		}, {
			label: e("learn.buffer.chart.actual"),
			kind: "bar",
			values: c.map((e) => e.bridge.actual),
			color: "var(--joe-c-soc)",
			digits: 1
		}];
		return l`<section class="card" data-tipped data-anchor="buffer">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:shield-half-full"></ha-icon>${e("learn.buffer")}</div>
        ${O(e, "learn_buffer")}
      </div>
      <div class="figure">
        <div class="big">${o(n)}<small> %</small></div>
        ${A(e, { source: r })}
        ${r === "learned" ? l`<span class="chip">${e("learn.mornings", { count: a.buffer_days })}</span>` : u}
      </div>
      <p class="say">${s}</p>
      ${c.length > 1 ? this.chartWithLegend(e, c.map((e) => e.date), d, "kWh", e("learn.buffer.chart")) : u}
      ${Yr(e, this.prefix, {
			label: e("rule.buffer_factor"),
			value: `${o(n)} %`,
			to: {
				tab: "settings",
				section: "rules",
				id: "buffer_factor"
			}
		})}
    </section>`;
	}
	renderHome(e, t) {
		let n = t.consumption, r = (t) => B(e.lang, t.reduce((e, t) => e + t, 0), 1), i = [{
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
		return l`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:home-lightning-bolt-outline"></ha-icon>${e("learn.home")}</div>
        ${O(e, "learn_home")}
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
		return l`<joe-chart
        .labels=${t.map((t) => V(e.lang, t, "weekday"))}
        .ticks=${wi(e.lang, t)}
        .series=${n}
        centerTicks
        unit=${r}
        height="150"
        lang=${e.lang}
        label=${i}
      ></joe-chart>
      <div class="legend">
        ${n.map((e) => l`<span
              ><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color};height:${e.kind === "bar" ? "10px" : "4px"}"></i
              >${e.label}</span
            >`)}
      </div>`;
	}
	renderWeather(e, t) {
		let n = e.lang, r = t.learned.consumption_model, a = t.days.filter((e) => e.temp != null), o = a.filter((e) => !e.excluded).length, s = this.state?.config.context.weather_entity, c;
		if (!s) c = e("learn.model.no_weather");
		else if (!r) c = e("learn.model.learning", {
			need: t.needs.models,
			have: o
		});
		else {
			let t = [e("learn.model.base", { value: B(n, r.base + (r.presence ?? 0) * (r.presence_mean ?? 0), 1) })];
			Math.abs(r.workday) >= .3 && t.push(e(r.workday > 0 ? "learn.model.workday_more" : "learn.model.workday_less", { value: B(n, Math.abs(r.workday), 1) })), r.heat >= .05 && t.push(e("learn.model.heat", { value: B(n, r.heat, 2) })), r.cool >= .05 && t.push(e("learn.model.cool", { value: B(n, r.cool, 2) })), r.presence != null && Math.abs(r.presence) >= .05 && t.push(e("learn.model.presence", { value: B(n, r.presence, 2) })), t.push(e("learn.model.fit", { share: i(n, r.r2 * 100, 0) })), c = t.join(" ");
		}
		let d = r != null && r.heat >= .05;
		return l`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:thermometer"></ha-icon>${e("learn.model")}</div>
        ${O(e, "learn_model")}
      </div>
      <div class="figure">
        <div class="big ${r ? "" : "small"}">
          ${r ? d ? l`+${B(n, r.heat, 2)}<small> kWh/°C</small>` : l`${B(n, r.base + (r.presence ?? 0) * (r.presence_mean ?? 0), 1)}<small> kWh</small>` : e("learn.still")}
        </div>
        ${r ? l`${A(e, { source: "learned" })}<span class="chip">${e("learn.days", { days: r.days })}</span>` : u}
      </div>
      <p class="say">${c}</p>
      ${s ? u : Yr(e, this.prefix, {
			label: e("past.learned.weather"),
			value: e("past.learned.weather.missing"),
			to: {
				tab: "household",
				section: "travel"
			},
			action: "set"
		})}
      ${a.length > 2 ? this.temperatureChart(e, t, r) : u}
    </section>`;
	}
	temperatureChart(e, t, n) {
		let r = t.days.filter((e) => e.temp != null && !e.excluded), a = r.map((e) => e.temp), o = Math.floor(Math.min(...a) / 2) * 2, s = Math.floor(Math.max(...a) / 2) * 2 + 2, c = [];
		for (let e = o; e < s; e += 2) c.push(e);
		let u = (t) => i(e.lang, t, 0), d = [{
			label: e("learn.model.chart.actual"),
			kind: "bar",
			values: c.map((e) => {
				let t = r.filter((t) => t.temp >= e && t.temp < e + 2);
				return t.length ? t.reduce((e, t) => e + t.home, 0) / t.length : null;
			}),
			color: "var(--joe-c-ist)",
			digits: 1
		}];
		n && d.push({
			label: e("learn.model.chart.workday"),
			kind: "line",
			values: c.map((e) => ws(n, !0, e + 1)),
			color: "var(--joe-c-soc)",
			digits: 1
		}, {
			label: e("learn.model.chart.day_off"),
			kind: "line",
			values: c.map((e) => ws(n, !1, e + 1)),
			color: "var(--joe-c-soc-2)",
			dashed: !0,
			digits: 1
		});
		let f = Math.max(1, Math.ceil(c.length / 8)), p = /* @__PURE__ */ new Map();
		return c.forEach((e, t) => {
			t % f === 0 && p.set(t, `${u(e)}°`);
		}), l`<joe-chart
        .labels=${c.map((e) => `${u(e)} … ${u(e + 2)} °C`)}
        .ticks=${p}
        .series=${d}
        unit="kWh"
        height="150"
        lang=${e.lang}
        label=${e("learn.model.chart")}
      ></joe-chart>
      <div class="legend">
        ${d.map((e) => l`<span
              ><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color};height:${e.kind === "bar" ? "10px" : "4px"}"></i
              >${e.label}</span
            >`)}
      </div>`;
	}
	renderSources(e, t) {
		let n = e.lang, r = this.state.config, a = t.learned.solar_classes ?? {}, o = a.classes ?? {}, s = r.forecast, c = t.learned.sources ?? {}, d = xs.filter((e) => o[e]), f = (e) => i(n, e * 100, 0), p = [["main", s.provider ? Ss[s.provider] ?? s.provider : e("learn.sources.main")], ...s.alternatives.map((e) => [e.id, e.name])], m = Object.fromEntries(p.map(([e]) => [e, c[e] ? 1 / Math.max(c[e].error, .05) ** 2 : 0])), h = Object.values(m).reduce((e, t) => e + t, 0);
		return l`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:weather-partly-cloudy"></ha-icon>${e("learn.weather")}</div>
        ${O(e, "learn_weather")}
      </div>
      <p class="say">
        ${d.length ? e("learn.weather.say", { top: B(n, a.top ?? 0, 1) }) : e("learn.weather.learning", { have: a.days ?? 0 })}
      </p>
      ${d.length ? mi(xs.map((t) => {
			let r = o[t];
			return {
				name: e(`learn.weather.${t}`),
				values: r ? [`× ${i(n, r.factor, 2)}`, e("learn.days", { days: r.days })] : [e("learn.still")]
			};
		})) : u}
      <div class="sub-head">
        <b>${e("learn.sources")}</b>
      </div>
      ${s.alternatives.length ? l`${mi(p.map(([r, a]) => {
			let o = c[r];
			return {
				name: a,
				values: o ? [
					`× ${i(n, o.factor, 2)}`,
					e("learn.sources.error", { value: f(o.error) }),
					s.combine && h ? e("learn.sources.weight", { value: f(m[r] / h) }) : ""
				] : [e("learn.sources.learning", { need: t.needs.sources })]
			};
		}))}
            ${Yr(e, this.prefix, {
			label: e("learn.sources.combine"),
			value: e(s.combine ? "rule.on" : "rule.off"),
			to: {
				tab: "devices",
				section: "grid",
				id: "solar"
			}
		})}` : l`<p class="say">${e("learn.sources.single")}</p>`}
    </section>`;
	}
	rowsCard(e, t, n, r, i, a, o, s = u) {
		return l`<section class="card" data-tipped data-anchor=${t}>
      <div class="head">
        <div class="eyebrow"><ha-icon icon=${n}></ha-icon>${r}</div>
        ${i}
      </div>
      ${a.length ? mi(a) : l`<p class="say">${o}</p>`} ${s}
    </section>`;
	}
	renderBatteries(e, t) {
		let n = this.state.config;
		return this.rowsCard(e, "battery", "mdi:battery-heart-variant", e("learn.battery"), O(e, "learn_battery"), n.batteries.map((r) => gi(e, n, t.learned, r, t.needs.models)), e("learn.battery.none"));
	}
	renderGroups(e, t) {
		let n = this.state.config.consumers.filter((e) => e.energy_entity && e.kind !== "submeter");
		return this.rowsCard(e, "devices", "mdi:chart-donut", e("learn.groups"), O(e, "learn_groups"), n.map((n) => _i(e, t.learned, n)), e("learn.groups.none"));
	}
	renderHotWater(e, t) {
		let n = this.state.config.actions.filter((e) => e.kind === "target");
		return this.rowsCard(e, "hot_water", "mdi:water-boiler", e("learn.hot_water"), O(e, "learn_hot_water"), n.map((n) => vi(e, t.learned, n)), e("learn.hot_water.none"));
	}
	renderCars(e, t) {
		let n = this.state.config.actions.filter((e) => e.kind === "switch" && e.need?.enabled);
		return this.rowsCard(e, "car", "mdi:car-electric", e("learn.car"), O(e, "learn_car"), n.map((n) => yi(e, t.learned, n)), e("learn.car.none"));
	}
	renderClimate(e) {
		let t = this.state.config, r = this.state?.climate?.rates ?? {}, a = this.climateFound?.devices ?? [], o = Object.fromEntries(a.map((e) => [e.entity_id, e.name])), s = Object.entries(t.climate?.rooms ?? {}).filter(([, e]) => e.enabled).map(([e]) => e), c = [.../* @__PURE__ */ new Set([...s, ...Object.keys(r)])].map((t) => {
			let a = r[t];
			return {
				name: o[t] ?? (this.hass ? n(this.hass, t) : t),
				values: a ? [e("past.learned.climate.rate", { rate: i(e.lang, a, 1) })] : [e("learn.still")],
				note: a ? void 0 : e("climate.rate_default")
			};
		});
		return l`<section class="card" data-tipped data-anchor="climate">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:thermostat-auto"></ha-icon>${e("past.learned.climate")}</div>
        ${O(e, "learn_climate")}
      </div>
      ${c.length ? l`<p class="say">${e("past.learned.climate.say")}</p>
            ${Object.keys(r).length ? l`<div class="figure">${A(e, { source: "learned" })}</div>` : u}
            ${mi(c)}` : l`<p class="say">${e("past.learned.climate.none")}</p>
            ${this.goLink({
			tab: "devices",
			section: "climate"
		}, e("past.learned.climate.open"))}`}
    </section>`;
	}
	renderPresence(e, t) {
		let n = this.state.config, r = this.state?.climate?.usual ?? {}, i = n.persons, a = i.map((n) => {
			let i = xi(e, t.learned, n, n.person_entity ? r[n.person_entity] : void 0);
			return n.calendars.length ? i : {
				...i,
				extra: this.goLink({
					tab: "household",
					section: "people",
					id: n.id
				}, e("learn.presence.calendars"))
			};
		});
		return this.rowsCard(e, "presence", "mdi:account-clock-outline", e("learn.presence"), O(e, "learn_presence"), a, e("learn.presence.none"), i.length ? u : this.goLink({
			tab: "household",
			section: "people"
		}, e("learn.presence.calendars")));
	}
	renderReset(e) {
		let t = !this.state?.observe?.active && this.scope !== "climate";
		return l`<section class="card danger wide" data-tipped data-anchor="reset">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:restore"></ha-icon>${e("learn.reset")}</div>
        ${O(e, "learn_reset")}
      </div>
      <p>${e("learn.reset.text")}</p>
      <div class="sub-head with-tip"><b>${e("learn.reset.scope")}</b>${O(e, "learn_reset_scope")}</div>
      <div class="seg scopes" role="group" aria-label=${e("learn.reset.scope")}>
        ${Cs.map((t) => l`<button type="button" aria-pressed=${String(this.scope === t)} @click=${() => this.scope = t}>
              ${e(`learn.reset.scope.${t}`)}
            </button>`)}
      </div>
      <div class="actions">
        <button type="button" class="btn btn-danger" ?disabled=${t} @click=${() => this.confirming = !0}>
          ${e(this.scope === "all" ? "learn.reset.button" : "learn.reset.button.scope")}
        </button>
      </div>
      ${t ? l`<p>${e("learn.reset.off")}</p>` : u}
      ${this.notice ? l`<div class="note ${this.notice.ok ? "" : "warn"}" role="status">
            <ha-icon icon=${this.notice.ok ? "mdi:check" : "mdi:alert-outline"}></ha-icon>${this.notice.text}
          </div>` : u}
    </section>`;
	}
	renderConfirm(e) {
		let t = () => {
			this.confirming = !1;
		}, n = this.scope;
		return l`<joe-sheet label=${e("learn.reset.label")} closeLabel=${e("common.close")} @joe-close=${t}>
      <div data-tipped>
        <div class="sheet-title">${c(e("learn.reset.confirm.title"), "h2", O(e, "learn_reset"))}</div>
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
w([b({ attribute: !1 })], Z.prototype, "hass", void 0), w([b({ attribute: !1 })], Z.prototype, "t", void 0), w([b({ attribute: !1 })], Z.prototype, "state", void 0), w([b({ attribute: !1 })], Z.prototype, "prefix", void 0), w([b({ attribute: !1 })], Z.prototype, "route", void 0), w([b({ attribute: !1 })], Z.prototype, "climateFound", void 0), w([b({ attribute: !1 })], Z.prototype, "anchor", void 0), w([y()], Z.prototype, "data", void 0), w([y()], Z.prototype, "failed", void 0), w([y()], Z.prototype, "confirming", void 0), w([y()], Z.prototype, "resetting", void 0), w([y()], Z.prototype, "scope", void 0), w([y()], Z.prototype, "notice", void 0), p("joe-lookback-learned", Z);
//#endregion
//#region src/pages/lookback/log.ts
var Ts = class extends o {
	constructor(...e) {
		super(...e), this.prefix = E, this.failed = !1;
	}
	static {
		this.styles = [f, S`
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
		e.has("group") && this.group && !vr.includes(this.group) && D(this, {
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
		return this.full ?? yr(this.state?.control?.log, this.state?.climate?.log);
	}
	get filter() {
		return vr.includes(this.group ?? "") ? this.group : "all";
	}
	render() {
		let e = this.t;
		if (!e || !this.state) return u;
		let n = this.state.config, r = this.entries, i = this.filter, a = Object.fromEntries((this.climateFound?.devices ?? []).map((e) => [e.entity_id, e.name])), o = /* @__PURE__ */ new Map([["all", r.length]]), s = /* @__PURE__ */ new Map();
		for (let e of r) {
			let t = br(n, e);
			o.set(t.group, (o.get(t.group) ?? 0) + 1), t.group === i && t.device && s.set(t.device, (s.get(t.device) ?? 0) + 1);
		}
		let d = i === "all" ? void 0 : this.device, f = [e(i === "all" ? "past.log.all" : `past.log.filter.${i}`), ...d ? [xr(n, this.hass, a, i, d)] : []].join(" · ");
		return l`<div class="wrap">
      ${c(e("past.log.title"))} ${t}
      <p class="lead">${e("past.log.lead")}</p>
      <nav class="filters" aria-label=${e("past.log.filters")}>
        ${vr.filter((e) => e === "all" || e === i || o.get(e)).map((t) => this.chip({
			tab: "review",
			section: "log",
			id: t
		}, e(t === "all" ? "past.log.all" : `past.log.filter.${t}`), t === i && !d, o.get(t)))}
      </nav>
      ${i !== "all" && i !== "joe" && (s.size > 1 || d) ? l`<nav class="filters" aria-label=${e("past.log.devices")}>
            ${[.../* @__PURE__ */ new Set([...s.keys(), ...d ? [d] : []])].map((e) => this.chip({
			tab: "review",
			section: "log",
			id: i,
			sub: e
		}, xr(n, this.hass, a, i, e), e === d, s.get(e) ?? 0))}
          </nav>` : u}
      <section class="card" data-tipped>
        <div class="head">
          <div class="eyebrow"><ha-icon icon="mdi:clipboard-text-clock-outline"></ha-icon>${f}</div>
          ${O(e, "past_log")}
        </div>
        ${this.failed && r.length ? l`<div class="note"><ha-icon icon="mdi:information-outline"></ha-icon>${e("past.log.partial")}</div>` : u}
        <joe-log-list
          .t=${e}
          .hass=${this.hass}
          .config=${n}
          .names=${a}
          .entries=${r}
          .filter=${{
			group: i,
			device: d
		}}
          .empty=${r.length ? e("past.log.empty_filter") : e("past.log.empty")}
        ></joe-log-list>
      </section>
    </div>`;
	}
	chip(e, t, n, r) {
		return l`<a
      class="section-chip ${n ? "on" : ""}"
      href=${T(this.prefix, e)}
      aria-current=${n ? "page" : u}
      @click=${C(e, { replace: !0 })}
      >${t}${r == null ? u : l`<span class="section-count">${r}</span>`}</a
    >`;
	}
};
w([b({ attribute: !1 })], Ts.prototype, "hass", void 0), w([b({ attribute: !1 })], Ts.prototype, "t", void 0), w([b({ attribute: !1 })], Ts.prototype, "state", void 0), w([b({ attribute: !1 })], Ts.prototype, "prefix", void 0), w([b({ attribute: !1 })], Ts.prototype, "route", void 0), w([b({ attribute: !1 })], Ts.prototype, "climateFound", void 0), w([b({ attribute: !1 })], Ts.prototype, "group", void 0), w([b({ attribute: !1 })], Ts.prototype, "device", void 0), w([y()], Ts.prototype, "full", void 0), w([y()], Ts.prototype, "failed", void 0), p("joe-lookback-log", Ts);
//#endregion
//#region src/pages/lookback/result.ts
var Es = class extends o {
	constructor(...e) {
		super(...e), this.prefix = E, this.failed = !1;
	}
	static {
		this.styles = [f, S`
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
		let t = Ci(this.state);
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
		return e ? l`<div class="wrap">
      ${c(e("past.result.title"))} ${t}
      <p class="lead">${e("past.result.lead")}</p>
      ${this.failed ? l`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("learn.failed")}</div>` : u}
      ${this.data ? l`${this.renderResults(e, this.data)} ${this.renderAccuracy(e, this.data)}` : u}
    </div>` : u;
	}
	renderResults(e, t) {
		let n = t.results, r = l`<div class="head">
      <div class="eyebrow"><ha-icon icon="mdi:cash-check"></ha-icon>${e("past.result.total")}</div>
      <span class="pill-sim">${e("mode.simulation")}</span>
      ${O(e, "sim_result")}
    </div>`;
		if (!n?.days) return l`<section class="card hero" data-tipped>${r}
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
		return l`<section class="card hero" data-tipped>
      ${r}
      <div class="figure">
        <div class="big ${n.saving > .005 ? "good" : n.saving < -.005 ? "bad" : ""}">
          ${fn(e, n.saving, this.currency, !0)}
        </div>
      </div>
      <p class="say">
        ${e("learn.results.say", {
			since: o ? V(e.lang, o) : "–",
			nights: hn(e, n.days)
		})}
      </p>
      <p class="split">
        ${e("learn.results.split", {
			better: n.better,
			worse: n.worse,
			same: Math.max(0, n.days - n.better - n.worse)
		})}
      </p>
      ${i.length > 1 ? l`<joe-chart
            .labels=${i.map((t) => V(e.lang, t.date, "weekday"))}
            .ticks=${wi(e.lang, i.map((e) => e.date))}
            .series=${a}
            centerTicks
            unit=${pn(e.lang, this.currency)}
            height="160"
            lang=${e.lang}
            label=${e("learn.results.chart")}
          ></joe-chart>` : u}
    </section>`;
	}
	renderAccuracy(e, t) {
		let n = t.accuracy.slice(-14).reverse(), r = (t) => t == null ? "–" : B(e.lang, t, 1);
		return l`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:target"></ha-icon>${e("learn.accuracy")}</div>
        ${O(e, "learn_accuracy")}
      </div>
      ${n.length ? l`<div class="table" role="table" aria-label=${e("learn.accuracy")}>
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
			return l`<span role="cell"
                  ><a href=${T(this.prefix, n)} @click=${C(n)}>${V(e.lang, t.date, "weekday")}</a></span
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
                  >${fn(e, t.saving, this.currency, !0)}</span
                >`;
		})}
          </div>` : l`<p class="say">${e("learn.accuracy.none")}</p>`}
    </section>`;
	}
};
w([b({ attribute: !1 })], Es.prototype, "hass", void 0), w([b({ attribute: !1 })], Es.prototype, "t", void 0), w([b({ attribute: !1 })], Es.prototype, "state", void 0), w([b({ attribute: !1 })], Es.prototype, "prefix", void 0), w([b({ attribute: !1 })], Es.prototype, "route", void 0), w([b({ attribute: !1 })], Es.prototype, "climateFound", void 0), w([y()], Es.prototype, "data", void 0), w([y()], Es.prototype, "failed", void 0), p("joe-lookback-result", Es);
//#endregion
//#region src/pages/lookback/index.ts
var Ds = {
	result: "joe-lookback-result",
	days: "joe-lookback-days",
	learned: "joe-lookback-learned",
	log: "joe-lookback-log"
}, Os = {
	result: "mdi:piggy-bank-outline",
	days: "mdi:calendar-month-outline",
	learned: "mdi:school-outline",
	log: "mdi:format-list-bulleted"
}, ks = class extends o {
	constructor(...e) {
		super(...e), this.prefix = E;
	}
	static {
		this.styles = [f, S`
      :host {
        display: block;
      }
    `];
	}
	render() {
		let e = this.t;
		if (!e || !this.state) return u;
		let t = this.route?.section ?? fe.review, n = le.review.map((t) => ({
			id: t,
			label: e(`nav.review.${t}`),
			icon: Os[t]
		}));
		return l`${cr(e, this.prefix, "review", n, t)}${this.renderSection(t)}`;
	}
	renderSection(e) {
		if (!customElements.get(Ds[e])) return l``;
		let { t, hass: n, state: r, prefix: i, route: a, climateFound: o } = this;
		switch (e) {
			case "result": return l`<joe-lookback-result
          .t=${t}
          .hass=${n}
          .state=${r}
          .prefix=${i}
          .route=${a}
          .climateFound=${o}
        ></joe-lookback-result>`;
			case "days": return l`<joe-lookback-days
          .t=${t}
          .hass=${n}
          .state=${r}
          .prefix=${i}
          .route=${a}
          .climateFound=${o}
          .day=${a?.id}
        ></joe-lookback-days>`;
			case "learned": return l`<joe-lookback-learned
          .t=${t}
          .hass=${n}
          .state=${r}
          .prefix=${i}
          .route=${a}
          .climateFound=${o}
          .anchor=${a?.id}
        ></joe-lookback-learned>`;
			case "log": return l`<joe-lookback-log
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
w([b({ attribute: !1 })], ks.prototype, "hass", void 0), w([b({ attribute: !1 })], ks.prototype, "t", void 0), w([b({ attribute: !1 })], ks.prototype, "state", void 0), w([b({ attribute: !1 })], ks.prototype, "route", void 0), w([b({ attribute: !1 })], ks.prototype, "prefix", void 0), w([b({ attribute: !1 })], ks.prototype, "climateFound", void 0), p("joe-lookback-page", ks);
//#endregion
//#region src/components/review.ts
var As = /* @__PURE__ */ new Set([
	"climate",
	"heat_pump",
	"electric_heating",
	"hot_water"
]), js = class extends o {
	constructor(...e) {
		super(...e), this.checks = [], this.omit = [], this.tariffOpen = !1;
	}
	static {
		this.styles = [
			f,
			Va,
			S`
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
		if (!e || !t || !n) return u;
		let r = new Set(this.omit);
		return l`<ul class="found">
        ${this.rows(e, t, n).filter((e) => !r.has(e.key)).map((e) => Ua(t, e))}
      </ul>
      ${this.tariffOpen ? this.renderTariff(t, n) : u}`;
	}
	rows(e, t, n) {
		let r = this.discovery, i = {
			from: this,
			hass: e,
			t,
			config: n,
			discovery: r,
			checks: this.checks
		}, a = [], o = Qa(i);
		o && a.push(o), a.push(...this.batteryRows(e, t, n));
		let s = n.tariff.kind === "unknown";
		a.push($a(i, { actions: [Y(t(s ? "review.enter" : "review.change"), "mdi:pencil-outline", () => {
			this.tariffOpen = !0;
		})] })), a.push(eo(i)), a.push(no(i, "grid_power")), a.push(no(i, "home_power", { devices: Y(t("review.home.devices"), "mdi:devices", () => this.edit("consumers")) })), a.push(oo(i)), a.push(Ka(this, e, t, n, r, "weather")), a.push(Ka(this, e, t, n, r, "holiday"));
		let c = [l`<span class="chip soon">${t("review.ask_later")}</span>`];
		(n.persons.length || r?.calendars.length) && a.push({
			key: "people",
			icon: "mdi:account-group-outline",
			title: t("find.people"),
			detail: t("find.people.detail", {
				persons: Ja(t, n.persons.length, "word.person"),
				calendars: Ja(t, r?.calendars.length ?? 0, "word.calendar")
			}),
			chips: c
		});
		let u = n.consumers.filter((e) => e.kind !== "submeter");
		return u.length && a.push({
			key: "devices",
			icon: "mdi:devices",
			title: t("find.devices"),
			detail: t("find.devices.detail", {
				count: Ja(t, u.length, "word.device"),
				heating: u.filter((e) => As.has(e.kind)).length
			}),
			chips: c
		}), a;
	}
	batteryRows(e, t, n) {
		let r = [];
		for (let a of n.batteries) {
			let o = this.discovery?.batteries.find((e) => e.id === a.id), s = ue(e, a.soc_entity), c = a.capacity_kwh ?? _(e, a.capacity_entity), l = [
				c ? `${i(t.lang, c, 2)} kWh` : t("review.capacity_unknown"),
				s === null ? null : `${i(t.lang, s, 0)} %`,
				a.adapter === "none" ? t("find.battery.read") : t("find.battery.control")
			], u = this.checks.filter((e) => e.battery_id === a.id);
			r.push({
				key: `battery:${a.id}`,
				icon: "mdi:home-battery-outline",
				title: a.name,
				detail: l.filter(Boolean).join(" · "),
				chips: [A(t, j(n, `batteries[${a.id}].soc_entity`)), ...o ? [h(t, o.confidence)] : []],
				reasons: o?.reasons,
				notes: u.map((e) => Ya(t, e)),
				state: u.some((e) => e.level === "warn") ? "flag" : void 0,
				tip: "review_battery",
				actions: [Y(t("review.change"), "mdi:pencil-outline", () => this.edit("battery", a.id)), Y(t("review.ignore"), "", () => this.ignoreBattery(a.id), !0)]
			});
		}
		for (let e of this.discovery?.batteries ?? []) M(n, `battery:${e.id}`) && !n.batteries.some((t) => t.id === e.id) && r.push({
			key: `battery:${e.id}`,
			icon: "mdi:home-battery-outline",
			title: e.name,
			detail: t("review.ignored"),
			state: "ignored",
			tip: "review_ignored",
			actions: [Y(t("review.use"), "mdi:undo-variant", () => void ur(this, n, e))]
		});
		return !n.batteries.length && !this.discovery?.batteries.length && r.push({
			key: "battery:add",
			icon: "mdi:home-battery-outline",
			title: t("review.battery"),
			detail: t("review.battery.none"),
			state: "missing",
			tip: "review_battery_add",
			actions: [Y(t("review.add"), "mdi:plus", () => void dr(this, t, e, n))]
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
		P(this, {
			batteries: { [e]: null },
			answers: { ignored: N(this.config, `battery:${e}`, !0) }
		});
	}
	renderTariff(e, t) {
		return l`<joe-sheet label=${e("edit.tariff.label")} closeLabel=${e("common.close")} @joe-close=${(e) => {
			e.stopPropagation(), this.tariffOpen = !1;
		}}>
      <div class="sheet-title">${c(e("edit.tariff.title"))}</div>
      <joe-tariff-draft closable .hass=${this.hass} .t=${e} .config=${t} .discovery=${this.discovery}></joe-tariff-draft>
    </joe-sheet>`;
	}
};
w([b({ attribute: !1 })], js.prototype, "hass", void 0), w([b({ attribute: !1 })], js.prototype, "t", void 0), w([b({ attribute: !1 })], js.prototype, "config", void 0), w([b({ attribute: !1 })], js.prototype, "discovery", void 0), w([b({ attribute: !1 })], js.prototype, "checks", void 0), w([b({ attribute: !1 })], js.prototype, "omit", void 0), w([y()], js.prototype, "tariffOpen", void 0), p("joe-review", js);
//#endregion
//#region src/components/step-nav.ts
function Ms(e, t, n = !1) {
	let r = l`<button type="button" class="btn btn-primary" ?data-notip=${!t.nextTip} @click=${t.next}>
    ${t.nextLabel}<ha-icon icon="mdi:chevron-right"></ha-icon>
  </button>`;
	return l`<nav class="step-nav ${n ? "wide" : ""}" aria-label=${e("onb.nav")}>
    ${t.back ? l`<button type="button" class="btn btn-ghost" data-notip @click=${t.back}>
          <ha-icon icon="mdi:chevron-left"></ha-icon>${t.backLabel ?? e("onb.back")}
        </button>` : l`<span></span>`}
    ${t.nextTip ? l`<span class="with-tip" data-tipped>${r} ${O(e, t.nextTip)}</span>` : r}
  </nav>`;
}
//#endregion
//#region src/pages/questions.ts
var Ns = {
	tariff: "plan",
	feed_in: "plug",
	capacity: "night-charge",
	heating: "ask",
	hot_water: "hot-water",
	ev: "ev",
	household: "relax"
}, Ps = [
	"climate",
	"heat_pump",
	"electric_heating"
];
function Fs(e) {
	let t = [], n = (t) => j(e, t)?.source === "user", r = (t) => e.answers[t] !== void 0 && e.answers[t] !== null, i = e.tariff;
	(i.kind === "unknown" || n("tariff.kind") || r("tariff")) && t.push("tariff"), (i.feed_in_price == null && !i.feed_in_entity || n("tariff.feed_in_price") || r("feed_in")) && t.push("feed_in");
	for (let i of e.batteries) {
		let e = `capacity:${i.id}`;
		(i.capacity_kwh == null && !i.capacity_entity || n(`batteries[${i.id}].capacity_kwh`) || r(e)) && t.push(e);
	}
	return t.push("heating", "hot_water", "ev", "household"), t;
}
var Is = class extends o {
	constructor(...e) {
		super(...e), this.single = "", this.index = 0;
	}
	static {
		this.styles = [f, S`
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
		if (!e || !t) return u;
		if (this.single) return this.renderQuestion(e, t, this.single);
		let n = Fs(t), r = Math.min(this.index, n.length - 1), i = n[r], a = r === n.length - 1, o = Ms(e, {
			back: () => this.move(-1, n.length),
			next: () => this.move(1, n.length),
			nextLabel: e(a ? "ask.finish" : "onb.next")
		});
		return l`${o}
      <div class="wrap">
        <joe-pose name=${Ns[i.split(":")[0]] ?? "ask"}></joe-pose>
        <div>
          <nav class="topics" aria-label=${e("ask.topics")} data-notip>
            <span class="eyebrow">${e("ask.count", {
			n: r + 1,
			total: n.length
		})}</span>
            ${n.map((n, i) => l`${i ? l`<ha-icon class="arrow" icon="mdi:chevron-right" aria-hidden="true"></ha-icon>` : u}<button
                type="button"
                class="topic ${i < r ? "done" : ""}"
                aria-current=${i === r ? "step" : "false"}
                @click=${() => this.index = i}
              >
                ${i < r ? l`<ha-icon icon="mdi:check"></ha-icon>` : u}${this.topic(e, t, n)}
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
			case "tariff": return this.question(e("q.tariff.title"), "q_tariff", l`<joe-tariff-form
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
			default: return this.question(e("q.household.title"), "q_household", l`<joe-household
            .hass=${this.hass}
            .t=${e}
            .config=${t}
            .discovery=${this.discovery}
          ></joe-household>`);
		}
	}
	question(e, n, r) {
		let i = this.t;
		return l`<div data-tipped>
      <div class="title-row">${c(e, "h2", O(i, n))}</div>
      ${t}
      <div class="content">${r}</div>
    </div>`;
	}
	choice(e, t, n, r = !1) {
		let i = this.config?.answers[t];
		return l`<joe-choice
      .options=${n}
      .value=${Array.isArray(i) ? i : typeof i == "string" ? [i] : []}
      ?multiple=${r}
      .exclusive=${["none"]}
      idk=${e("ask.idk")}
      @joe-choice=${(e) => P(this, { answers: { [t]: r ? e.detail.value : e.detail.value[0] ?? null } })}
    ></joe-choice>`;
	}
	renderHotWater(e, t) {
		let n = t.answers.hot_water, r = n === "hot_water_heat_pump" || n === "electric", i = t.consumers.filter((e) => e.kind === "hot_water"), a = t.actions.find((e) => e.kind === "target");
		return this.question(e("q.hot_water.title"), "q_hot_water", l`${this.choice(e, "hot_water", [
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
      ${r ? l`<div class="follow">
            <p class="hint">${i.length ? e("q.hot_water.devices") : e("q.hot_water.no_devices")}</p>
            ${i.length ? l`<div class="chips">${i.map((e) => l`<span class="chip learned">${e.name}</span>`)}</div>` : u}
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
              ${O(e, "q_hot_water_action")}
            </div>
          </div>` : u}`);
	}
	renderHeating(e, t) {
		let n = t.answers.heating, r = Array.isArray(n) ? n : [], i = t.consumers.filter((e) => r.includes(e.kind)), a = r.some((e) => Ps.includes(e));
		return this.question(e("q.heating.title"), "q_heating", l`${this.choice(e, "heating", [
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
        ${a && t.consumers.length ? l`<div class="follow">
              <p class="hint">${i.length ? e("q.heating.devices") : e("q.heating.no_devices")}</p>
              ${i.length ? l`<div class="chips">
                    ${i.map((e) => l`<span class="chip learned">${e.name}</span>`)}
                  </div>` : u}
              <div class="with-tip" style="margin-top:10px">
                <button type="button" class="mini-btn" @click=${() => this.edit("consumers")}>
                  <ha-icon icon="mdi:devices"></ha-icon>${e("q.heating.assign")}
                </button>
                ${O(e, "f_consumer_kind")}
              </div>
            </div>` : u}`);
	}
	renderFeedIn(e, t) {
		let n = t.tariff.feed_in_price, r = t.answers.feed_in === Xr;
		return this.question(e("q.feed_in.title"), "q_feed_in", l`<div class="inline">
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
			P(this, {
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
          @click=${() => P(this, {
			tariff: { feed_in_price: 0 },
			answers: { feed_in: "none" }
		})}
        >
          ${e("q.feed_in.none")}
        </button>
        <button
          type="button"
          class="mini-btn ${r ? "go" : ""}"
          @click=${() => P(this, {
			tariff: { feed_in_price: null },
			answers: { feed_in: Xr }
		})}
        >
          ${e("ask.idk")}
        </button>
      </div>`);
	}
	renderCapacity(e, t, n) {
		let r = t.batteries.find((e) => e.id === n);
		if (!r) return l``;
		let i = `capacity:${n}`, a = t.answers[i] === Xr;
		return this.question(e("q.capacity.title", { name: r.name }), "q_capacity", l`<div class="inline">
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
			P(this, {
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
          @click=${() => P(this, {
			batteries: { [n]: { capacity_kwh: null } },
			answers: { [i]: Xr }
		})}
        >
          ${e("ask.idk_learn")}
        </button>
      </div>`);
	}
	saveTariff(e) {
		let t = { tariff: e };
		e.kind && (t.answers = { tariff: e.kind }), P(this, t);
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
w([b({ attribute: !1 })], Is.prototype, "hass", void 0), w([b({ attribute: !1 })], Is.prototype, "t", void 0), w([b({ attribute: !1 })], Is.prototype, "config", void 0), w([b({ attribute: !1 })], Is.prototype, "discovery", void 0), w([b()], Is.prototype, "single", void 0), w([y()], Is.prototype, "index", void 0), p("joe-questions", Is);
//#endregion
//#region src/pages/onboarding.ts
function Ls(e, t, n) {
	let [r, a] = e(n).split("|");
	return `${i(e.lang, t, 0)} ${t === 1 ? r : a}`;
}
var Rs = {
	climate: "q.heating.climate",
	heat_pump: "q.heating.heat_pump",
	electric_heating: "q.heating.electric",
	none: "q.heating.none"
}, zs = class extends o {
	constructor(...e) {
		super(...e), this.step = "welcome", this.checks = [], this.discovering = !1, this.discoveryFailed = !1;
	}
	static {
		this.styles = [f, S`
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
		if (!e) return u;
		switch (this.step) {
			case "welcome": return this.layout("welcome", l`${c(e("onb.welcome.title"), "h1")} ${t}
            <p class="lead">${e("onb.welcome.lead")}</p>
            <div class="calm"><span class="pill-sim">${e("mode.simulation")}</span>${e("onb.calm")}</div>
            <details data-notip>
              <summary>${e("onb.welcome.more")}</summary>
              ${e("onb.welcome.more.text").split("\n").map((e) => l`<p>${e}</p>`)}
            </details>
            <div class="actions" data-tipped>
              <button type="button" class="btn btn-primary" @click=${() => this.go("scan")}>
                ${e("onb.welcome.go")}
              </button>
              ${O(e, "scan_start")}
            </div>`);
			case "scan": return this.renderScan(e);
			case "questions": return l`<joe-questions
          .hass=${this.hass}
          .t=${e}
          .config=${this.config}
          .discovery=${this.discovery}
        ></joe-questions>`;
			case "done": return this.renderDone(e);
		}
	}
	renderScan(e) {
		if (this.discovering || !this.discovery && !this.discoveryFailed) return this.layout("scout", l`${c(e("onb.scan.title"))} ${t}
          <p class="lead">${e("onb.scan.lead")}</p>
          ${this.renderEnergy(e)}
          <div class="looking" role="status">${e("scan.looking")}</div>`);
		let n = Ms(e, {
			back: () => this.go("welcome"),
			next: () => this.go("questions"),
			nextLabel: e("onb.next")
		}, !0);
		return l`${n}
      <div class="wrap wide">
        <joe-pose name="scout"></joe-pose>
        <div>
          ${c(e("scan.title"))} ${t}
          <p class="lead">${e("scan.lead")}</p>
          ${this.discoveryFailed ? l`<p class="failed">${e("scan.failed")}</p>` : u}
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
              ${O(e, "rescan")}
            </span>
            <button type="button" class="btn btn-ghost" data-notip @click=${() => this.go("welcome")}>
              ${e("onb.back")}
            </button>
          </div>
        </div>
      </div>`;
	}
	renderDone(e) {
		let n = Ms(e, {
			back: () => this.go("scan"),
			backLabel: e("onb.done.change"),
			next: () => this.complete(),
			nextLabel: e("onb.done.go"),
			nextTip: "start"
		});
		return l`${n}
    ${this.layout("thumbs", l`${c(e("onb.done.title"))} ${t}
        ${this.config ? this.renderSummary(e, this.config) : u}
        <div class="calm"><span class="pill-sim">${e("mode.simulation")}</span>${e("onb.done.lead")}</div>
        <div class="actions">
          <span class="with-tip" data-tipped>
            <button type="button" class="btn btn-primary" @click=${this.complete}>${e("onb.done.go")}</button>
            ${O(e, "start")}
          </span>
          <button type="button" class="btn btn-ghost" data-notip @click=${() => this.go("scan")}>
            ${e("onb.done.change")}
          </button>
        </div>`)}`;
	}
	renderSummary(e, t) {
		let n = this.hass, r = t.batteries.reduce((e, t) => e + (t.capacity_kwh ?? (n ? _(n, t.capacity_entity) : null) ?? 0), 0), a = (n, r) => {
			let i = t.answers[n];
			if (i === "unknown") return e("sum.unknown");
			let a = Array.isArray(i) ? i : typeof i == "string" ? [i] : [];
			return a.length ? a.map((t) => e.optional(r[t] ?? "") ?? t).join(", ") : e("sum.open");
		}, o = this.discovery?.forecast, s = [
			[e("sum.batteries"), t.batteries.length ? e("sum.batteries.value", {
				count: t.batteries.length,
				kwh: r ? i(e.lang, r, 1) : "?"
			}) : e("sum.none")],
			[e("sum.tariff"), t.tariff.kind === "unknown" ? e("sum.unknown") : Pt(e, t.tariff, !1)],
			[e("sum.feed_in"), t.tariff.feed_in_price == null ? t.tariff.feed_in_entity ? e("sum.from_sensor") : e("sum.unknown") : `${Nt(e, t.tariff.feed_in_price)} ct`],
			[e("sum.forecast"), t.forecast.provider ? o ? e("sum.forecast.value", {
				provider: o.provider_name,
				planes: Ls(e, o.planes, "word.plane")
			}) : t.forecast.provider : e("sum.none")],
			[e("sum.heating"), a("heating", Rs)],
			[e("sum.hot_water"), a("hot_water", {
				hot_water_heat_pump: "q.hot_water.heat_pump",
				electric: "q.hot_water.electric",
				heating: "q.hot_water.heating",
				other: "q.hot_water.other"
			})],
			[e("sum.ev"), a("ev", {
				yes: "q.ev.yes",
				no: "q.ev.no"
			})],
			[e("sum.household"), e("sum.household.value", {
				persons: Ls(e, t.persons.length, "word.person"),
				calendars: Ls(e, t.persons.reduce((e, t) => e + t.calendars.length, 0), "word.calendar")
			})]
		];
		return l`<div class="lines">
      ${s.map(([e, t]) => l`<div><span>${e}</span><span>${t}</span></div>`)}
    </div>`;
	}
	rediscover() {
		this.dispatchEvent(new CustomEvent("joe-rediscover", {
			bubbles: !0,
			composed: !0
		}));
	}
	layout(e, t) {
		return l`<div class="wrap">
      <joe-pose name=${e}></joe-pose>
      <div>${t}</div>
    </div>`;
	}
	renderEnergy(e) {
		let t = this.info?.energy;
		if (!t?.configured || !t.sources) return l`<div class="found"><p>${e("onb.scan.energy.none")}</p></div>`;
		let n = [
			[t.sources.grid ?? 0, e("energy.grid")],
			[t.sources.solar ?? 0, e("energy.solar")],
			[t.sources.battery ?? 0, e("energy.battery")],
			[t.devices ?? 0, e("energy.devices")]
		];
		return l`<div class="found">
      <p>${e("onb.scan.energy")}</p>
      <div class="chips">
        ${n.map(([e, t]) => l`<span class="chip read"><ha-icon icon="mdi:eye-outline"></ha-icon>${e} ${t}</span>`)}
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
w([b()], zs.prototype, "step", void 0), w([b({ attribute: !1 })], zs.prototype, "t", void 0), w([b({ attribute: !1 })], zs.prototype, "info", void 0), w([b({ attribute: !1 })], zs.prototype, "hass", void 0), w([b({ attribute: !1 })], zs.prototype, "config", void 0), w([b({ attribute: !1 })], zs.prototype, "discovery", void 0), w([b({ attribute: !1 })], zs.prototype, "checks", void 0), w([b({ type: Boolean })], zs.prototype, "discovering", void 0), w([b({ type: Boolean })], zs.prototype, "discoveryFailed", void 0), p("joe-onboarding", zs);
//#endregion
//#region src/components/day-questions.ts
var Bs = {
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
}, Vs = class extends o {
	constructor(...e) {
		super(...e), this.questions = [], this.failed = !1, this.answered = /* @__PURE__ */ new Set();
	}
	static {
		this.styles = [f, S`
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
		return !e || !t.length ? u : l`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:chat-question-outline"></ha-icon>${e("ask.title")}</div>
        ${O(e, "ask_day")}
      </div>
      <p class="lead">${e("ask.lead")}</p>
      ${t.map((t) => l`<div class="question">
          <p>
            ${e(`ask.${t.kind}`, {
			day: V(e.lang, t.date, "weekday"),
			actual: B(e.lang, t.actual, 1),
			expected: B(e.lang, t.expected, 1)
		})}
          </p>
          <div class="answers" role="group" aria-label=${e("ask.answers")}>
            ${Bs[t.kind].map((n) => l`<button
                  type="button"
                  class="mini-btn ${n === "normal" ? "quiet" : ""}"
                  ?disabled=${this.busy === t.date}
                  @click=${() => this.answer(t.date, n)}
                >
                  ${e(`ask.answer.${n}`)}
                </button>`)}
          </div>
        </div>`)}
      ${this.failed ? l`<div class="note warn" role="status"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("error.action")}</div>` : u}
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
w([b({ attribute: !1 })], Vs.prototype, "hass", void 0), w([b({ attribute: !1 })], Vs.prototype, "t", void 0), w([b({ attribute: !1 })], Vs.prototype, "questions", void 0), w([y()], Vs.prototype, "busy", void 0), w([y()], Vs.prototype, "failed", void 0), w([y()], Vs.prototype, "answered", void 0), p("joe-day-questions", Vs);
//#endregion
//#region src/pages/overview.ts
var Hs = class extends o {
	constructor(...e) {
		super(...e), this.prefix = E;
	}
	static {
		this.styles = [f, S`
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
        flex: none;
        max-width: calc(100% - 210px);
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
      .figure-card .big.good {
        color: var(--joe-good);
      }
      .figure-card .big.bad {
        color: var(--joe-crit);
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
      .status {
        margin: 6px 0 0;
        color: var(--joe-ink-2);
        font-size: 14px;
      }
      joe-chart {
        margin-top: 10px;
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
      .next {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
        list-style: none;
        margin: 14px 0 0;
        padding: 0;
        counter-reset: step;
      }
      .next li {
        counter-increment: step;
        display: grid;
        gap: 4px;
        align-content: start;
        padding: 14px;
        border-radius: 12px;
        background: var(--joe-surface-2);
      }
      .next li::before {
        content: counter(step);
        display: grid;
        place-items: center;
        width: 30px;
        height: 30px;
        margin-bottom: 4px;
        border-radius: 50%;
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 800;
        font-size: 17px;
        background: var(--joe-surface);
        color: var(--joe-ink-2);
        box-shadow: inset 0 0 0 2px var(--joe-line-2);
      }
      .next li.done::before {
        background: var(--joe-amber);
        color: var(--joe-amber-ink);
        box-shadow: none;
      }
      .next b {
        font-weight: 700;
      }
      .next span {
        color: var(--joe-ink-2);
        font-size: 14px;
      }
      .next .chip {
        justify-self: start;
        margin-top: 6px;
      }
      @media (max-width: 900px) {
        .grid {
          grid-template-columns: 1fr;
        }
        .now,
        .next {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (max-width: 480px) {
        .next {
          grid-template-columns: 1fr;
        }
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
        .figure-card .head .eyebrow {
          max-width: calc(100% - 150px);
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
		let e = this.t;
		if (!e) return u;
		let t = !!this.state?.observe?.active, n = !!(this.state?.plan && this.state.plan.kind !== "unavailable"), r = (this.state?.results?.days ?? 0) > 0, i = this.state?.questions ?? [];
		return l`<div class="grid">
      ${i.length ? l`<joe-day-questions class="wide" .hass=${this.hass} .t=${e} .questions=${i}></joe-day-questions>` : u}
      ${this.renderNow(e)} ${this.renderWeek(e)}
      ${this.renderNight(e)} ${this.renderSim(e)}
      <section class="card wide">
        <div class="eyebrow"><ha-icon icon="mdi:map-marker-path"></ha-icon>${e("overview.next")}</div>
        <ol class="next">
          <li class="done">
            <b>${e("overview.next.1.title")}</b><span>${e("overview.next.1.text")}</span>
            <span class="chip ok"><ha-icon icon="mdi:check"></ha-icon>${e("status.done")}</span>
          </li>
          <li class=${t ? "done" : ""}>
            <b>${e("overview.next.2.title")}</b><span>${e("overview.next.2.text")}</span>
            ${this.stepChip(e, t)}
          </li>
          <li class=${n ? "done" : ""}>
            <b>${e("overview.next.3.title")}</b><span>${e("overview.next.3.text")}</span>
            ${this.stepChip(e, n)}
          </li>
          <li class=${r ? "done" : ""}>
            <b>${e("overview.next.4.title")}</b><span>${e("overview.next.4.text")}</span>
            ${this.stepChip(e, r)}
          </li>
        </ol>
      </section>
    </div>`;
	}
	stepChip(e, t) {
		return t ? l`<span class="chip ok"><ha-icon icon="mdi:check"></ha-icon>${e("status.running")}</span>` : l`<span class="chip">${e(this.state?.mode === "off" ? "status.paused" : "status.waiting")}</span>`;
	}
	renderNight(e) {
		let n = this.state?.plan;
		if (!n) return l`<section class="card">
        <joe-pose name="relax"></joe-pose>
        <div class="eyebrow"><ha-icon icon="mdi:weather-night"></ha-icon>${e("overview.night")}</div>
        ${c(e("overview.night.empty.title"))} ${t}
        <p class="lead">${e("overview.night.empty.text")}</p>
      </section>`;
		let r = ce(e, n), a = de(e, n, this.hass?.config?.currency), o = n.kind === "charge" || n.kind === "hold" ? l`${i(e.lang, n.target ?? 0, 0)}<small>%</small>` : l`${e(n.kind === "none" ? "plan.big.none" : "plan.big.unavailable")}`;
		return l`<section class="card figure-card" data-tipped>
      <joe-pose name=${se(n)}></joe-pose>
      <div class="head">
        <div class="eyebrow">
          <ha-icon icon="mdi:weather-night"></ha-icon>${e("overview.night")}${n.window ? ` · ${ie(e, n)}` : ""}
        </div>
        ${O(e, "plan_target")}
      </div>
      <div class="big">${o}</div>
      ${t}
      <p class="say">${ne(e, n)}</p>
      ${r.length ? l`<div class="lines">${r.map((e) => l`<div>${e}</div>`)}</div>` : u}
      ${a ? l`<p class="cost">${a}</p>` : u}
      <div class="bottom">
        <span class="chip ${n.fixed ? "ok" : ""}">
          ${n.fixed ? e("plan.fixed_at", { time: n.created.slice(11, 16) }) : e("plan.preview_at", { time: n.created.slice(11, 16) })}
        </span>
        <a class="btn btn-secondary" data-notip href=${T(this.prefix, "/plan")} @click=${C("/plan")}
          >${e("overview.night.more")}</a
        >
      </div>
    </section>`;
	}
	renderSim(e) {
		let n = this.state?.results, r = n?.last;
		if (!n || !r) return l`<section class="card">
        <joe-pose name="plan"></joe-pose>
        <div class="eyebrow"><ha-icon icon="mdi:calculator-variant-outline"></ha-icon>${e("overview.sim")}</div>
        ${c(e("overview.sim.empty.title"))} ${t}
        <p class="lead">${e("overview.sim.empty.text")}</p>
      </section>`;
		let a = this.hass?.config?.currency, o = r.window?.end.slice(0, 10) ?? r.date, s = o === mn(this.hass?.config?.time_zone) ? e("overview.sim.last") : e("overview.sim.night", { day: V(e.lang, o, "weekday") }), u = r.saving, d = u > .005 ? "good" : u < -.005 ? "bad" : "", f = d === "good" ? e("overview.sim.saved", {
			value: fn(e, u, a),
			day: i(e.lang, Math.max(0, r.day_kwh_without - r.day_kwh), 1),
			night: i(e.lang, Math.max(0, r.night_kwh - r.night_kwh_without), 1)
		}) : d === "bad" ? e("overview.sim.cost", { value: fn(e, -u, a) }) : e("overview.sim.same"), p = n.since ?? n.first;
		return l`<section class="card figure-card" data-tipped>
      <joe-pose name=${d === "good" ? "relax" : "inspect"}></joe-pose>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:calculator-variant-outline"></ha-icon>${e("overview.sim")} · ${s}</div>
        ${O(e, "sim_result")}
      </div>
      <div class="big ${d}">${fn(e, u, a, !0)}</div>
      ${t}
      <p class="say">${f}</p>
      <p class="cost">
        ${e("overview.sim.total", {
			since: p ? V(e.lang, p) : "–",
			value: fn(e, n.saving, a, !0),
			nights: hn(e, n.days)
		})}
      </p>
      <div class="bottom">
        ${r.final || !r.until ? l`<span class="chip">
              ${e("learn.results.split", {
			better: n.better,
			worse: n.worse,
			same: Math.max(0, n.days - n.better - n.worse)
		})}
            </span>` : l`<span class="chip warn">${e("overview.sim.provisional", { time: r.until.slice(11, 16) })}</span>`}
        <a class="btn btn-secondary" data-notip href=${T(this.prefix, "/review/result")} @click=${C("/review/result")}
          >${e("overview.sim.more")}</a
        >
      </div>
    </section>`;
	}
	renderNow(t) {
		let n = this.hass, r = this.state?.config;
		if (!n || !r) return l``;
		let a = r.measurements, o = a.solar_power.length ? e(n, a.solar_power) : null, s = m(n, a.grid_power), c = r.batteries.map((e) => ({
			power: m(n, e.power),
			soc: ue(n, e.soc_entity)
		})), u = c.filter((e) => e.power != null), d = u.length ? u.reduce((e, t) => e + (t.power ?? 0), 0) : null, f = m(n, a.home_power), p = f == null && s != null;
		p && (f = (s ?? 0) + (o ?? 0) - (d ?? 0));
		let h = c.map((e) => e.soc).filter((e) => e != null), g = (e) => e == null ? "–" : i(t.lang, Math.abs(e), 2), _ = (e, t, n, r, i) => l`<div class="flow ${e}">
        <span class="icon"><ha-icon icon=${t}></ha-icon></span>
        <small>${n}</small>
        <b>${g(r)}<span>kW</span></b>
        <em>${i}</em>
      </div>`, v = (e) => e == null || Math.abs(e) < .05;
		return l`<section class="card wide" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:pulse"></ha-icon>${t("overview.now")}</div>
        ${O(t, "now")}
      </div>
      <div class="now">
        ${_("sun", "mdi:solar-power", t("overview.now.solar"), o, t(o == null ? "overview.now.none" : "overview.now.solar.sub"))}
        ${_("home", "mdi:home-lightning-bolt-outline", t("overview.now.home"), f, t(f == null ? "overview.now.none" : p ? "overview.now.home.calc" : "overview.now.home.sub"))}
        ${_("battery", "mdi:home-battery-outline", v(d) ? t("overview.now.battery") : t(d > 0 ? "overview.now.battery.charge" : "overview.now.battery.discharge"), d, h.length ? h.length === 1 ? t("overview.now.soc", { value: i(t.lang, h[0], 0) }) : t("overview.now.soc_avg", {
			value: i(t.lang, h.reduce((e, t) => e + t, 0) / h.length, 0),
			count: h.length
		}) : r.batteries.length ? t("overview.now.none") : t("overview.now.no_battery"))}
        ${_("net", "mdi:transmission-tower", v(s) ? t("overview.now.grid") : t(s > 0 ? "overview.now.grid.in" : "overview.now.grid.out"), s, s == null ? t("overview.now.none") : v(s) ? t("overview.now.grid.idle") : t(s > 0 ? "overview.now.grid.in.sub" : "overview.now.grid.out.sub"))}
      </div>
    </section>`;
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
		return l`<section class="card wide" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:chart-bar"></ha-icon>${e("overview.week")}</div>
        ${O(e, "week")}
      </div>
      <p class="status">${r}</p>
      ${t.length ? l`<joe-chart
              .labels=${a}
              .ticks=${o}
              .series=${i}
              centerTicks
              unit="kWh"
              height="190"
              lang=${e.lang}
              label=${e("overview.week")}
            ></joe-chart>
            <div class="bottom">
              <div class="legend">
                ${i.map((e) => l`<span><i style="background:${e.color}"></i>${e.label}</span>`)}
              </div>
              <a class="btn btn-secondary" data-notip href=${T(this.prefix, "/review/days")} @click=${C("/review/days")}
                >${e("overview.week.more")}</a
              >
            </div>` : u}
    </section>`;
	}
};
w([b({ attribute: !1 })], Hs.prototype, "t", void 0), w([b({ attribute: !1 })], Hs.prototype, "hass", void 0), w([b({ attribute: !1 })], Hs.prototype, "state", void 0), w([b()], Hs.prototype, "prefix", void 0), w([y()], Hs.prototype, "week", void 0), p("joe-overview", Hs);
//#endregion
//#region src/pages/plan.ts
var Us = 36e5, Ws = class extends o {
	constructor(...e) {
		super(...e), this.prefix = E, this.refreshing = !1;
	}
	static {
		this.styles = [f, S`
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
      .lines {
        display: grid;
        gap: 2px;
        margin-top: 12px;
        font-variant-numeric: tabular-nums;
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
      dl {
        display: grid;
        grid-template-columns: minmax(140px, auto) 1fr;
        gap: 8px 16px;
        margin: 6px 0 0;
      }
      dt {
        color: var(--joe-ink-2);
      }
      dd {
        margin: 0;
        font-weight: 600;
      }
      dd small {
        display: block;
        font-weight: 400;
        color: var(--joe-muted);
        font-size: 13px;
      }
      .note {
        margin-top: 10px;
      }
      .steer .actions {
        margin-top: 12px;
      }
      .steer .chart-head {
        font-size: 16px;
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
        .hero joe-pose {
          right: 12px;
          top: 12px;
          width: 112px;
        }
        dl {
          grid-template-columns: 1fr;
          gap: 2px;
        }
        dd {
          margin-bottom: 8px;
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
		if (!e) return u;
		let n = this.state?.plan;
		if (!n || n.kind === "unavailable" || !n.hours) return this.renderEmpty(e, n);
		let r = ce(e, n), a = de(e, n, this.hass?.config?.currency);
		return l`<div class="wrap">
      <div class="eyebrow"><ha-icon icon="mdi:weather-night"></ha-icon>${e("overview.night")} · ${ie(e, n)}</div>
      ${c(e("plan.page.title"))} ${t}
      <div class="top" data-tipped>
        ${this.state?.mode === "simulation" ? l`<span class="pill-sim">${e("mode.simulation")}</span>` : l`<span class="chip ${this.state?.mode === "live" ? "ok" : "learned"}">${e(`mode.${this.state?.mode ?? "off"}`)}</span>`}
        <span class="chip ${n.fixed ? "ok" : ""}">
          ${n.fixed ? e("plan.fixed_at", { time: n.created.slice(11, 16) }) : e("plan.preview_at", { time: n.created.slice(11, 16) })}
        </span>
        <button type="button" class="mini-btn" ?disabled=${this.refreshing || n.fixed} @click=${this.refresh}>
          <ha-icon icon="mdi:refresh"></ha-icon>${e("plan.refresh")}
        </button>
        ${O(e, "plan_refresh")}
      </div>
      <section class="hero" data-tipped>
        <joe-pose name=${se(n)}></joe-pose>
        <div class="big">
          ${n.kind === "none" ? e("plan.big.none") : l`${i(e.lang, n.target ?? 0, 0)}<small>%</small>`}
        </div>
        <p class="say">${ne(e, n)} ${O(e, "plan_target")}</p>
        ${r.length ? l`<div class="lines">${r.map((e) => l`<div>${e}</div>`)}</div>` : u}
        ${a ? l`<p class="cost">${a}</p>` : u}
      </section>
      ${this.renderSteer(e, n)} ${this.renderActions(e, n)} ${this.renderEnergy(e, n, n.hours)}
      ${this.renderPrices(e, n, n.hours)} ${this.renderSoc(e, n, n.hours)}
      ${this.renderMath(e, n)}
    </div>`;
	}
	renderSteer(e, t) {
		let n = this.state, r = n?.control;
		if (!n || !r || !["advisory", "live"].includes(n.mode) || !t.window || t.kind === "none") return u;
		let i = t.window.start, a = r.skip === i, o = r.answer?.night === i ? r.answer.yes : null, s = n.config.batteries.filter((e) => e.adapter !== "none" && r.ready[e.id] && r.ready[e.id] !== "ready"), c, d;
		return n.mode === "advisory" && !a ? (c = e(o === !0 ? "plan.steer.answered_yes" : o === !1 ? "plan.steer.answered_no" : "plan.steer.advisory"), d = l`${o === !0 ? u : l`<button type="button" class="btn btn-primary" @click=${() => this.answer(i, !0)}>${e("plan.steer.yes")}</button>`}
      ${o === !1 ? u : l`<button type="button" class="btn btn-secondary" @click=${() => this.answer(i, !1)}>${e("plan.steer.no")}</button>`}`) : (c = e(a ? "plan.steer.skipped" : "plan.steer.live"), d = l`<button type="button" class="btn btn-secondary" @click=${() => this.skip(!a)}>
        ${e(a ? "plan.steer.unskip" : "plan.steer.skip")}
      </button>`), l`<section class="chart-card steer" data-tipped>
      <div class="chart-head">${c} ${O(e, "plan_steer")}</div>
      ${s.length ? l`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("plan.steer.untested", { names: s.map((e) => e.name).join(", ") })}</span>
          </div>` : u}
      <div class="actions">${d}</div>
    </section>`;
	}
	renderActions(e, t) {
		let n = t.actions ?? [];
		if (!n.length) return u;
		let r = this.hass?.config?.currency ?? "EUR", a = (t) => new Intl.NumberFormat(e.lang, {
			style: "currency",
			currency: r
		}).format(t);
		return l`<section class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.actions")} ${O(e, "plan_actions")}</div>
      <dl>
        ${n.map((n) => {
			let r = n.target == null ? "" : i(e.lang, n.target, 0), o = n.run ? n.kind === "target" ? e("plan.actions.target", {
				start: k(n.start),
				end: k(n.end),
				target: r
			}) : e("plan.actions.run", {
				start: k(n.start),
				end: k(n.end)
			}) : e.optional(`devices.action.why.${n.reasons[n.reasons.length - 1] ?? "manual_only"}`, {
				kwh: i(e.lang, t.meta?.tomorrow_kwh ?? 0, 0),
				temperature: i(e.lang, n.temperature ?? 0, 0)
			}) ?? "", s = n.run && n.energy_kwh ? e("plan.actions.energy", {
				kwh: i(e.lang, n.energy_kwh, 1),
				cost: a(n.cost ?? 0)
			}) : "", c = this.state?.config.actions.find((e) => e.id === n.id);
			return l`<dt>${n.name}</dt>
            <dd>
              ${o}${s ? l`<small>${s}</small>` : u}
              ${n.need ? l`<joe-car-need .hass=${this.hass} .t=${e} .action=${n} .roundTrip=${c?.need?.round_trip ?? !0}></joe-car-need>` : u}
            </dd>`;
		})}
      </dl>
    </section>`;
	}
	async answer(e, t) {
		try {
			await this.hass?.callWS({
				type: "energy_joe/control/answer",
				night: e,
				yes: t
			});
		} catch {}
	}
	async skip(e) {
		try {
			await this.hass?.callWS({
				type: "energy_joe/control/skip",
				skip: e
			});
		} catch {}
	}
	renderEmpty(e, n) {
		let r = n ? ne(e, n) : e(this.state?.mode === "off" ? "plan.empty.off" : "plan.empty.waiting");
		return l`<div class="empty">
      <joe-pose name=${n ? se(n) : "plan"}></joe-pose>
      <div>
        ${c(e("plan.title"))} ${t}
        <p class="lead">${r}</p>
      </div>
    </div>`;
	}
	frame(e, t, n) {
		let r = (e) => `${String((Number(e.slice(0, 2)) + 1) % 24).padStart(2, "0")}:00`, i = n.map((e, t) => `${k(e.start)}–${k(n[t + 1]?.start) || r(k(e.start))}`), a = /* @__PURE__ */ new Map();
		n.forEach((t, n) => {
			let r = k(t.start);
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
					if (t >= r && t < r + Us) return e + (t - r) / Us;
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
			let n = k(t.sun_takes_over);
			a.push({
				at: o,
				label: e("plan.chart.sun", { time: n }),
				short: `↑${n}`
			});
		}
		return l`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.chart.energy")} ${O(e, "chart_plan_energy")}</div>
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
        ${i.map((e) => l`<span><i style="background:${e.color}"></i>${e.label}</span>`)}
      </div>
    </div>`;
	}
	renderPrices(e, t, n) {
		if (!n.some((e) => e.price != null)) return u;
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
				label: e("plan.chart.charge_at", { time: k(t.start) }),
				short: k(t.start)
			}];
		});
		return l`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.chart.prices")} ${O(e, "chart_plan_prices")}</div>
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
      ${t.charge_slots?.length ? l`<p class="slots">${e("plan.slots", { slots: ve(t) })}</p>` : u}
    </div>`;
	}
	renderSoc(e, t, n) {
		let r = this.frame(e, t, n), a = t.rules?.reserve ?? 10, o = [
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
				label: e("plan.chart.reserve", { value: i(e.lang, a, 0) }),
				kind: "line",
				values: n.map(() => a),
				color: "var(--joe-crit)",
				dashed: !0,
				digits: 0
			}
		], s = [], c = r.at(t.window?.end);
		c != null && t.kind !== "none" && s.push({
			at: c,
			label: e("plan.chart.target", { value: i(e.lang, t.target ?? 0, 0) })
		});
		let u = r.at(t.full_at);
		return u != null && s.push({
			at: u,
			label: e("plan.chart.full", { time: k(t.full_at) }),
			short: `${k(t.full_at)}`
		}), l`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.chart.soc")} ${O(e, "chart_plan_soc")}</div>
      <joe-chart
        .labels=${r.labels}
        .ticks=${r.ticks}
        .series=${o}
        .bands=${r.bands}
        .markers=${s}
        max="100"
        height="190"
        unit="%"
        lang=${e.lang}
        label=${e("plan.chart.soc")}
      ></joe-chart>
      <div class="legend">
        ${o.map((e) => l`<span><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color}"></i>${e.label}</span>`)}
      </div>
    </div>`;
	}
	renderMath(e, t) {
		let n = (t, n = 1) => t == null ? "–" : `${i(e.lang, t, n)} kWh`, r = (t) => t == null ? "–" : `${i(e.lang, t * 100, 1)} ct`, a = t.window?.start.slice(0, 10) ?? "", o = t.meta?.solar.sources[a] ?? "none", s = t.meta?.tomorrow, c = s?.solar_factor ?? t.meta?.solar_factor ?? 1, d = t.meta?.consumption, f = this.state?.config.persons ?? [], p = [
			[e("plan.math.battery_now"), l`${i(e.lang, t.soc_now ?? 0, 0)} %<small
            >${e("plan.math.battery_now.sub", {
				stored: i(e.lang, (t.soc_now ?? 0) / 100 * (t.capacity_kwh ?? 0), 1),
				capacity: i(e.lang, t.capacity_kwh ?? 0, 1)
			})}</small
          >`],
			[e("plan.math.battery_start"), `${i(e.lang, t.soc_start ?? 0, 0)} %`],
			[e("plan.math.solar"), l`${n(t.solar_kwh)}<small
            >${e(`plan.math.solar.${o}`)}${c === 1 ? "" : ` · ${e(s?.solar_source === "combined" ? "plan.math.solar.combined" : s?.solar_source === "weather" && s.weather ? "plan.math.solar.weather" : "plan.math.solar.factor", {
				value: i(e.lang, c, 2),
				weather: s?.weather ? e(`learn.weather.${s.weather}`) : ""
			})}`}</small
          >`],
			[e("plan.math.home"), l`${n(t.home_kwh)}<small
            >${d?.source === "history" ? e("plan.math.home.history", {
				days: d.days,
				kind: e(t.meta?.workday === !1 ? "plan.math.day_off" : "plan.math.workday")
			}) : e("plan.math.home.default")}</small
          >`],
			...s && (s.temp != null || Object.keys(s.labels).length) ? [[e("plan.math.tomorrow"), l`${[s.temp == null ? "" : `${i(e.lang, s.temp, 0)} °C`, ...Object.entries(s.labels).map(([t, n]) => e("plan.math.tomorrow.person", {
				name: f.find((e) => e.id === t)?.name ?? t,
				label: e(`label.${n}`)
			}))].filter(Boolean).join(" · ")}<small
                  >${s.expected_kwh == null ? e("plan.math.tomorrow.usual") : e("plan.math.tomorrow.scaled", {
				expected: i(e.lang, s.expected_kwh, 1),
				usual: i(e.lang, s.profile_kwh, 1)
			})}</small
                >`]] : [],
			[e("plan.math.target"), l`${i(e.lang, t.target ?? 0, 0)} %<small
            >${e("plan.math.target.sub", {
				optimum: i(e.lang, t.optimum ?? 0, 0),
				buffer: i(e.lang, (t.rules?.buffer ?? 0) * 100, 0)
			})}</small
          >`],
			[e("plan.math.prices"), l`${e("plan.math.prices.value", {
				night: r(t.prices?.night),
				day: r(t.prices?.day),
				feed: r(t.prices?.feed_in)
			})}${t.prices?.assumed ? l`<small>${e("plan.math.prices.assumed")}</small>` : u}`],
			[e("plan.math.rules"), e("plan.math.rules.value", {
				reserve: i(e.lang, t.rules?.reserve ?? 0, 0),
				max: i(e.lang, t.rules?.max_target ?? 100, 0),
				mode: e.optional(`rule.discharge.${t.rules?.discharge_mode}`) ?? ""
			})]
		], m = [...new Set(t.notes ?? [])].map((t) => e.optional(`plan.note.${t}`)).filter(Boolean);
		return l`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.math")} ${O(e, "plan_math")}</div>
      <dl>${p.map(([e, t]) => l`<dt>${e}</dt><dd>${t}</dd>`)}</dl>
      ${m.map((e) => l`<div class="note"><ha-icon icon="mdi:information-outline"></ha-icon><span>${e}</span></div>`)}
    </div>`;
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
w([b({ attribute: !1 })], Ws.prototype, "hass", void 0), w([b({ attribute: !1 })], Ws.prototype, "t", void 0), w([b({ attribute: !1 })], Ws.prototype, "state", void 0), w([b({ attribute: !1 })], Ws.prototype, "route", void 0), w([b({ attribute: !1 })], Ws.prototype, "prefix", void 0), w([y()], Ws.prototype, "refreshing", void 0), p("joe-plan-page", Ws);
//#endregion
//#region src/pages/settings.ts
var Gs = [
	"simulation",
	"advisory",
	"live",
	"off"
], Ks = [
	{
		key: "heating",
		tip: "q_heating"
	},
	{
		key: "hot_water",
		tip: "q_hot_water"
	},
	{
		key: "ev",
		tip: "q_ev"
	}
], qs = {
	heating: {
		climate: "q.heating.climate",
		heat_pump: "q.heating.heat_pump",
		electric_heating: "q.heating.electric",
		none: "q.heating.none"
	},
	hot_water: {
		hot_water_heat_pump: "q.hot_water.heat_pump",
		electric: "q.hot_water.electric",
		heating: "q.hot_water.heating",
		other: "q.hot_water.other"
	},
	ev: {
		yes: "q.ev.yes",
		no: "q.ev.no"
	}
}, Q = class extends o {
	constructor(...e) {
		super(...e), this.checks = [], this.prefix = E, this.pro = !1, this.question = "";
	}
	static {
		this.styles = [
			f,
			pi,
			S`
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
      :host {
        display: block;
      }
      .list {
        display: grid;
        gap: 16px;
        max-width: 900px;
        margin: 0 auto;
      }
      .group {
        background: var(--joe-surface);
        border-radius: 14px;
        box-shadow: inset 0 0 0 1px var(--joe-line);
        padding: 4px 18px 8px;
      }
      .group.plain {
        background: transparent;
        box-shadow: none;
        padding: 0;
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
      .plain h2 {
        padding-top: 4px;
      }
      .intro {
        margin: -2px 0 12px;
        color: var(--joe-ink-2);
        font-size: 14px;
        max-width: 64ch;
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
      }
      select.input,
      .input.time {
        width: auto;
        min-width: 160px;
      }
      .pro-toggle {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        border: 0;
        background: transparent;
        cursor: pointer;
        padding: 14px 0 10px;
        text-align: left;
        color: var(--joe-ink);
      }
      .pro-toggle h2 {
        padding: 0;
      }
      .pro-toggle svg {
        width: 20px;
        height: 20px;
        transition: transform 0.12s;
      }
      .pro-toggle[aria-expanded="true"] svg {
        transform: rotate(90deg);
      }
      @media (pointer: coarse) {
        .seg button {
          min-height: 44px;
        }
      }
      @media (max-width: 600px) {
        .control {
          justify-content: flex-start;
        }
      }
    `
		];
	}
	willUpdate(e) {
		if (!e.has("route")) return;
		let t = this.route ? ae(this.route) : "";
		if (t === this.revealed) return;
		this.revealed = t;
		let { section: n, id: r } = this.route ?? {};
		n === "rules" ? (this.pro = !0, this.anchor = r && ti(r) ? r : "rules") : this.anchor = n === "maintenance" ? r === "backup" || r === "setup" ? r : "maintenance" : n && n !== "operation" ? n : void 0;
	}
	async updated() {
		let e = this.anchor;
		if (!e) return;
		let t = [...this.renderRoot.querySelectorAll("joe-choice")];
		await Promise.all(t.map((e) => e.updateComplete));
		for (let e = 0; e < 10 && (e === 0 || !getComputedStyle(this).getPropertyValue("--joe-head-h")); e++) await new Promise((e) => requestAnimationFrame(e));
		this.anchor === e && me(this.renderRoot, e) && (this.anchor = void 0);
	}
	render() {
		let e = this.t, t = this.state;
		if (!e || !t) return u;
		let n = t.config;
		return l`<div class="list">
        <section class="group" data-anchor="operation">
          <h2>${e("settings.operation")}</h2>
          <div class="row" data-tipped>
            <div>
              <div class="name"><b>${e("settings.mode")}</b>${O(e, "mode")}</div>
              <small>${e("settings.mode.hint")}</small>
            </div>
            <div class="seg" role="group" aria-label=${e("settings.mode")}>
              ${Gs.map((n) => l`<button
                    type="button"
                    aria-pressed=${String(t.mode === n)}
                    @click=${() => this.emit("joe-set-mode", { mode: n })}
                  >
                    ${e(`mode.${n}`)}
                  </button>`)}
            </div>
          </div>
          ${this.gridFriendlyRows(e, n.rules)}
          <div class="row" data-tipped data-anchor="setup">
            <div>
              <div class="name"><b>${e("settings.setup")}</b>${O(e, "restart")}</div>
              <small>${e("settings.setup.hint")}</small>
            </div>
            <button
              type="button"
              class="btn btn-secondary"
              @click=${() => this.emit("joe-onboarding", {
			step: "welcome",
			completed: !1
		})}
            >
              ${e("settings.setup.restart")}
            </button>
          </div>
        </section>

        ${this.renderNotify(e)}

        <section class="group">
          <h2>${e("settings.answers")}</h2>
          ${Ks.map((t) => this.answerRow(e, t.key, t.tip))}
        </section>

        ${this.renderObserve(e)}

        <section class="group" data-anchor="rules">
          <button
            type="button"
            class="pro-toggle"
            data-notip
            aria-expanded=${String(this.pro)}
            @click=${() => this.pro = !this.pro}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.6"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
            <h2>${e("settings.pro")}</h2>
          </button>
          ${this.pro ? l`<p class="intro">${e("settings.pro.intro")}</p>
                ${$r.map((t) => oi(e, this, n, this.info, t))}` : u}
        </section>

        ${this.renderBackup(e)}

        <section class="group" data-anchor="about">
          <h2>${e("settings.about")}</h2>
          <div class="row"><b>${e("settings.version")}</b><span class="value">${this.info?.version ?? "–"}</span></div>
          <div class="row"><b>${e("settings.ha")}</b><span class="value">${this.info?.ha_version ?? "–"}</span></div>
          <div class="row"><b>${e("settings.energy")}</b><span class="value">${this.energyText(e)}</span></div>
        </section>
      </div>
      ${this.question ? this.renderQuestionSheet(e) : u}`;
	}
	renderBackup(e) {
		return l`<section class="group" data-anchor="backup">
      <h2>${e("settings.backup")}</h2>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${e("settings.backup.export")}</b>${O(e, "backup_export")}</div>
          <small>${e("settings.backup.export.hint")}</small>
        </div>
        <button type="button" class="btn btn-secondary" @click=${() => void this.exportSettings()}>${e("settings.backup.download")}</button>
      </div>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${e("settings.backup.import")}</b>${O(e, "backup_import")}</div>
          <small>${e("settings.backup.import.hint")}</small>
        </div>
        <label class="btn btn-secondary file">
          ${e("settings.backup.choose")}
          <input type="file" accept="application/json,.json" @change=${(e) => void this.readBackup(e)} />
        </label>
      </div>
      ${this.backup ? l`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon>
            <span>
              ${e("settings.backup.confirm", {
			file: this.backup.name,
			when: this.backup.when
		})}
              <span class="confirm">
                <button type="button" class="btn btn-danger" @click=${() => void this.importSettings()}>${e("settings.backup.replace")}</button>
                <button type="button" class="btn btn-ghost" @click=${() => this.backup = void 0}>${e("common.cancel")}</button>
              </span>
            </span>
          </div>` : u}
      ${this.backupNote ? l`<div class="note ${this.backupNote.ok ? "ok" : "warn"}">
            <ha-icon icon=${this.backupNote.ok ? "mdi:check" : "mdi:alert-outline"}></ha-icon><span>${this.backupNote.text}</span>
          </div>` : u}
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
	connectedCallback() {
		super.connectedCallback(), this.hass?.callWS({ type: "energy_joe/notify/targets" }).then((e) => this.notifyTargets = e).catch(() => void 0);
	}
	renderNotify(e) {
		let t = this.state.config, n = t.notify, r = this.notifyTargets ?? Object.keys(this.hass?.services?.notify ?? {}).filter((e) => ![
			"persistent_notification",
			"send_message",
			"notify"
		].includes(e)).sort().map((e) => ({
			service: e,
			name: e.replace(/_/g, " ")
		})), i = n.service?.replace(/^notify\./, ""), a = !!i && this.notifyTargets !== void 0 && !r.some((e) => e.service === i), o = (t, r) => l`<div class="row" data-tipped>
        <div>
          <div class="name"><b id="notify-${t}">${e(`settings.notify.${t}`)}</b>${O(e, r)}</div>
          <small>${e(`settings.notify.${t}.hint`)}</small>
        </div>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(n[t])}
          aria-labelledby="notify-${t}"
          ?disabled=${!n.service}
          @click=${() => P(this, { notify: { [t]: !n[t] } })}
        ></button>
      </div>`;
		return l`<section class="group" data-anchor="notify">
      <h2>${e("settings.notify")}</h2>
      <p class="intro">${e("settings.notify.intro")}</p>
      <div class="row" data-tipped>
        <div>
          <div class="name"><label for="notify-service"><b>${e("settings.notify.service")}</b></label>${O(e, "notify_service")}</div>
          <small>${e("settings.notify.service.hint")}</small>
        </div>
        <select
          id="notify-service"
          class="input"
          @change=${(e) => {
			let t = e.target.value;
			P(this, { notify: { service: t ? `notify.${t}` : null } });
		}}
        >
          <option value="" ?selected=${!n.service}>${e("settings.notify.none")}</option>
          ${r.map((e) => l`<option value=${e.service} ?selected=${i === e.service}>${e.name}</option>`)}
          ${a ? l`<option value=${i} selected>${e("settings.notify.gone", { name: i ?? "" })}</option>` : u}
        </select>
      </div>
      ${o("ask", "notify_ask")} ${o("problems", "notify_problems")} ${o("morning", "notify_morning")}
      <div class="row" data-tipped>
        <div>
          <div class="name"><label for="ask-time"><b>${e("settings.ask_time")}</b></label>${O(e, "ask_time")}</div>
          <small>${e("settings.ask_time.hint")}</small>
        </div>
        <input
          id="ask-time"
          class="input time"
          type="time"
          .value=${t.rules.ask_time}
          @change=${(e) => {
			let t = e.target.value;
			/^\d{2}:\d{2}$/.test(t) && P(this, { rules: { ask_time: t } });
		}}
        />
      </div>
    </section>`;
	}
	renderObserve(e) {
		let t = this.state, n = t.observe, r = !!n?.active, i = n?.backfill.state === "running", a = (t) => new Intl.DateTimeFormat(e.lang, {
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
		return c?.state === "running" ? s.push(e("history.reading")) : c?.state === "unavailable" ? s.push(e("settings.observe.no_recorder")) : c?.state === "failed" && s.push(e("settings.observe.failed")), l`<section class="group" data-anchor="maintenance">
      <h2>${e("settings.observe")}</h2>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${e("settings.observe.recording")}</b>${O(e, "observe")}</div>
          <small>${o}</small>
        </div>
        <span class="chip ${r ? "ok" : ""}">
          ${e(r ? "status.running" : t.mode === "off" ? "status.paused" : "status.waiting")}
        </span>
      </div>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${e("settings.observe.history")}</b>${O(e, "rebuild")}</div>
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
	answerRow(e, t, n) {
		let r = this.state.config, i = r.answers[t], a = Array.isArray(i) ? i : typeof i == "string" ? [i] : [], o = i === "unknown" ? e("sum.unknown") : a.length ? a.map((n) => qs[t][n] ? e(qs[t][n]) : n).join(", ") : e("sum.open");
		return l`<div class="row" data-tipped>
      <div>
        <div class="name"><b>${e(`settings.answer.${t}`)}</b>${O(e, n)}</div>
        <small>${o}</small>
      </div>
      <div class="control">
        ${i == null ? u : A(e, j(r, `answers.${t}`))}
        <button type="button" class="mini-btn" @click=${() => this.question = t}>
          <ha-icon icon="mdi:pencil-outline"></ha-icon>${e("review.change")}
        </button>
      </div>
    </div>`;
	}
	renderQuestionSheet(e) {
		let t = () => {
			this.question = "";
		};
		return l`<joe-sheet label=${e("settings.answers")} closeLabel=${e("common.close")} @joe-close=${t}>
      <joe-questions
        .hass=${this.hass}
        .t=${e}
        .config=${this.state?.config}
        .discovery=${this.discovery}
        single=${this.question}
      ></joe-questions>
      <div class="actions">
        <button type="button" class="btn btn-secondary" data-notip @click=${t}>${e("mode.close")}</button>
      </div>
    </joe-sheet>`;
	}
	gridFriendlyRows(e, t) {
		let n = this.state.config;
		return l`<div class="row" data-tipped>
        <div>
          <div class="name"><b id="grid-friendly">${e("rule.grid_friendly")}</b>${O(e, "r_grid_friendly")}</div>
          <small>${e("rule.grid_friendly.hint")}</small>
        </div>
        <div class="control">
          ${A(e, j(n, "rules.grid_friendly"))}
          <button
            type="button"
            class="switch"
            role="switch"
            aria-checked=${String(t.grid_friendly)}
            aria-labelledby="grid-friendly"
            @click=${() => P(this, { rules: { grid_friendly: !t.grid_friendly } })}
          ></button>
        </div>
      </div>
      ${t.grid_friendly ? l`<div class="row" data-tipped>
            <div>
              <div class="name"><b>${e("rule.grid_first")}</b>${O(e, "r_grid_first")}</div>
              <small>${e(t.grid_first ? "rule.grid_first.grid.hint" : "rule.grid_first.saving.hint")}</small>
            </div>
            <div class="seg" role="group" aria-label=${e("rule.grid_first")}>
              ${[!1, !0].map((n) => l`<button
                    type="button"
                    aria-pressed=${String(t.grid_first === n)}
                    @click=${() => P(this, { rules: { grid_first: n } })}
                  >
                    ${e(n ? "rule.grid_first.grid" : "rule.grid_first.saving")}
                  </button>`)}
            </div>
          </div>` : u}`;
	}
	energyText(e) {
		let t = this.info?.energy;
		return t?.configured && t.sources ? `${t.sources.solar ?? 0} ${e("energy.solar")} · ${t.sources.battery ?? 0} ${e("energy.battery")} · ${t.devices ?? 0} ${e("energy.devices")}` : e("settings.energy.none");
	}
	emit(e, t) {
		this.dispatchEvent(new CustomEvent(e, {
			detail: t,
			bubbles: !0,
			composed: !0
		}));
	}
};
w([b({ attribute: !1 })], Q.prototype, "t", void 0), w([b({ attribute: !1 })], Q.prototype, "hass", void 0), w([b({ attribute: !1 })], Q.prototype, "state", void 0), w([b({ attribute: !1 })], Q.prototype, "info", void 0), w([b({ attribute: !1 })], Q.prototype, "discovery", void 0), w([b({ attribute: !1 })], Q.prototype, "checks", void 0), w([b({ attribute: !1 })], Q.prototype, "route", void 0), w([b({ attribute: !1 })], Q.prototype, "prefix", void 0), w([y()], Q.prototype, "backup", void 0), w([y()], Q.prototype, "backupNote", void 0), w([y()], Q.prototype, "pro", void 0), w([y()], Q.prototype, "notifyTargets", void 0), w([y()], Q.prototype, "question", void 0), p("joe-settings", Q);
//#endregion
//#region src/energy-joe-panel.ts
var Js = [
	"simulation",
	"advisory",
	"live",
	"off"
], Ys = {
	simulation: "mdi:pause",
	advisory: "mdi:comment-question-outline",
	live: "mdi:play",
	off: "mdi:power"
}, Xs = Js, Zs = {
	overview: "mdi:view-dashboard-outline",
	plan: "mdi:weather-night",
	review: "mdi:history",
	devices: "mdi:power-plug-outline",
	household: "mdi:account-group-outline",
	settings: "mdi:cog-outline"
}, Qs = [
	"devices",
	"household",
	"settings"
], $s = ["action", "battery"], ec = [
	"devices",
	"household",
	"overview",
	"review"
], $ = class extends o {
	constructor() {
		super(), this.narrow = !1, this.failed = !1, this.modeDialog = !1, this.notice = "", this.discovering = !1, this.discoveryFailed = !1, this.checks = [], this.infoRequested = !1, this.adopted = !1, this.parsed = oe(""), this.climateRequested = !1, this.jumped = !1, this.addEventListener("joe-config", (e) => this.onConfig(e)), this.addEventListener("joe-pick", (e) => {
			this.picker = e.detail;
		}), this.addEventListener("joe-edit", (e) => {
			this.editor = e.detail;
		}), this.addEventListener("joe-navigate", (e) => this.onNavigate(e)), this.addEventListener("joe-climate-reload", (e) => {
			e.stopPropagation(), this.loadClimate();
		});
	}
	get t() {
		return ee(this.hass?.language);
	}
	get base() {
		return this.route?.prefix ?? "/energy-joe";
	}
	get current() {
		return this.parsed.route;
	}
	connectedCallback() {
		super.connectedCallback(), Fn(), this.subscribe();
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
			this.parsed = oe(this.route?.path ?? "");
			let { route: n, redirect: r } = this.parsed;
			r !== void 0 && this.go(r, { replace: !0 }), this.remember(n), n.tab !== t && this.joe?.onboarding.completed && (this.discoveryFailed = !1, this.climateFound || (this.climateRequested = !1));
		}
	}
	updated() {
		this.observeHead();
		let e = this.joe;
		e?.onboarding.completed && !this.climateRequested && ec.includes(this.current.tab) && this.loadClimate(), !(!e || this.discovering || this.discoveryFailed) && (!e.onboarding.completed && e.onboarding.step === "scan" && !this.adopted ? this.scan() : !this.discovery && (e.onboarding.completed ? Qs.includes(this.current.tab) || $s.includes(this.editor?.editor ?? "") : e.onboarding.step !== "welcome") && this.look());
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
		if (this.failed) return l`<main><joe-empty-state pose="puzzled" heading=${e("error.title")} text=${e("error.text")}></joe-empty-state></main>`;
		if (!this.joe) return l`<div class="loading">${e("loading")}</div>`;
		let t = !this.joe.onboarding.completed;
		return l`
      <header>
        ${this.joe.mode === "simulation" ? l`<div class="simband" aria-hidden="true"></div>` : u}
        <div class="bar">
          ${this.narrow ? l`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : u}
          <div class="brand">
            <img class="light" src=${xe("joe-head.webp")} alt="" width="36" height="36" />
            <img class="dark" src=${xe("joe-head-dark.webp")} alt="" width="36" height="36" />
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
      ${this.notice ? l`<div class="notice" role="alert">${this.notice}</div>` : u}
      <main
        @joe-onboarding=${this.onOnboarding}
        @joe-rediscover=${() => this.scan()}
        @joe-set-mode=${(e) => this.setMode(e.detail.mode)}
      >
        ${t ? l`<joe-onboarding
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
      ${this.modeDialog ? this.renderModeDialog(e) : u} ${this.editor ? this.renderEditor(e) : u}
      ${this.picker ? this.renderPicker(e) : u}
    `;
	}
	renderTabs(e) {
		let t = this.current.tab;
		return l`<nav class="tabs" aria-label=${e("nav.label")} lang=${e.lang}>
      ${re.map((n, r) => {
			let i = this.tabPath(n), a = r > 0 && pe.includes(re[r - 1]) && !pe.includes(n);
			return l`${a ? l`<span class="gap" aria-hidden="true"></span>` : u}<a
            href=${T(this.base, i)}
            class=${n === t ? "on" : ""}
            aria-current=${n === t ? "page" : "false"}
            @click=${C(i)}
            ><ha-icon icon=${Zs[n]}></ha-icon><span class="label">${e(`tab.${n}`)}</span></a
          >`;
		})}
    </nav>`;
	}
	tabPath(e) {
		let t = this.current;
		if (e === t.tab) return ae({
			tab: e,
			section: t.section
		});
		let n = null;
		try {
			n = sessionStorage.getItem(`joe.last.${e}`);
		} catch {}
		let r = e === "overview" ? "/" : `/${e}`;
		return n && (n === r || n.startsWith(`${r}/`)) ? n : ae({ tab: e });
	}
	remember(e) {
		try {
			sessionStorage.setItem(`joe.last.${e.tab}`, ae({
				tab: e.tab,
				section: e.section,
				id: e.id
			}));
		} catch {}
	}
	renderSteps(e) {
		let t = vn.indexOf(this.joe?.onboarding.step ?? "welcome");
		return l`<ol class="steps" aria-label=${e("steps.label")}>
      ${vn.map((n, r) => l`<li class=${r < t ? "done" : r === t ? "on" : ""} aria-current=${r === t ? "step" : "false"}>
            ${r + 1} ${e(`step.${n}`)}
          </li>`)}
    </ol>`;
	}
	renderPage(e) {
		let t = this.current, n = this.base;
		switch (t.tab) {
			case "overview": return l`<joe-overview
          .t=${e}
          .hass=${this.hass}
          .state=${this.joe}
          .prefix=${n}
          .route=${t}
          .climateFound=${this.climateFound}
        ></joe-overview>`;
			case "plan": return l`<joe-plan-page .t=${e} .hass=${this.hass} .state=${this.joe} .prefix=${n} .route=${t}></joe-plan-page>`;
			case "review": return l`<joe-lookback-page
          .t=${e}
          .hass=${this.hass}
          .state=${this.joe}
          .prefix=${n}
          .route=${t}
          .climateFound=${this.climateFound}
        ></joe-lookback-page>`;
			case "devices": return l`<joe-devices-page
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
			case "household": return l`<joe-household-page
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
			case "settings": return l`<joe-settings
          .t=${e}
          .hass=${this.hass}
          .state=${this.joe}
          .prefix=${n}
          .route=${t}
          .info=${this.info}
          .discovery=${this.discovery}
          .checks=${this.checks}
        ></joe-settings>`;
		}
	}
	renderModeDialog(e) {
		let n = this.joe?.mode ?? "simulation";
		return l`<div class="scrim" @click=${this.closeDialog}>
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
          <div id="mode-title">${c(e("mode.dialog.title"), "h2", O(e, "mode"))}</div>
          ${t}
          ${this.renderReadiness(e)}
          <div class="modes" role="group" aria-labelledby="mode-title">
            ${Js.map((t) => {
			let r = Xs.includes(t);
			return l`<button
                type="button"
                class="mode ${t}"
                aria-pressed=${String(t === n)}
                ?disabled=${!r}
                @click=${() => this.chooseMode(t)}
              >
                <span class="knob"><ha-icon icon=${Ys[t]}></ha-icon></span>
                <span class="label">
                  <b>${e(`mode.${t}`)}</b>
                  <small>${e(`mode.${t}.desc`)}</small>
                </span>
                ${t === n ? l`<span class="chip ok"><ha-icon icon="mdi:check"></ha-icon>${e("mode.current")}</span>` : r ? u : l`<span class="chip soon">${e("mode.soon")}</span>`}
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
		if (!r.length) return u;
		let i = r.filter((e) => n[e.id] !== "ready");
		if (!i.length) return u;
		let a = i.length === r.length ? e("mode.none_tested") : e("mode.untested", { names: i.map((e) => e.name).join(", ") }), o = {
			tab: "devices",
			section: "battery"
		}, s = C(o);
		return l`<div class="note warn readiness">
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
		}, i = l``, a = "", o = !1;
		switch (t?.editor) {
			case "battery":
				a = e("edit.battery.label"), o = !0, i = l`<joe-battery-editor
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
				a = e("action.label"), i = l`<joe-action-editor
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
			case "consumers": a = e("edit.consumers.label"), o = !0, i = l`<div class="sheet-title">${c(e("edit.consumers.title"))}</div>
          <joe-consumer-list .hass=${this.hass} .t=${e} .config=${n}></joe-consumer-list>
          <div class="actions">
            <button type="button" class="btn btn-secondary" data-notip @click=${r}>${e("mode.close")}</button>
          </div>`;
		}
		return l`<joe-sheet
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
		return l`<joe-sheet
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
		let n = oe(e).redirect ?? ae(e), r = T(this.base, n);
		if (!t.replace && location.pathname === r) {
			this.scrollTop = 0;
			return;
		}
		t.replace || history.replaceState({
			...history.state ?? {},
			joeScroll: this.scrollTop
		}, ""), this.jumped = !0, history[t.replace ? "replaceState" : "pushState"](t.sheet ? { joeSheet: !0 } : null, "", r), window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: !!t.replace } }));
		let i = oe(n).route, a = i.tab === "devices" && i.section !== "grid" && i.section !== "add" && !i.sub;
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
			f,
			S`
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
w([b({ attribute: !1 })], $.prototype, "hass", void 0), w([b({
	type: Boolean,
	reflect: !0
})], $.prototype, "narrow", void 0), w([b({ attribute: !1 })], $.prototype, "route", void 0), w([y()], $.prototype, "joe", void 0), w([y()], $.prototype, "info", void 0), w([y()], $.prototype, "failed", void 0), w([y()], $.prototype, "modeDialog", void 0), w([y()], $.prototype, "notice", void 0), w([y()], $.prototype, "discovery", void 0), w([y()], $.prototype, "discovering", void 0), w([y()], $.prototype, "discoveryFailed", void 0), w([y()], $.prototype, "checks", void 0), w([y()], $.prototype, "picker", void 0), w([y()], $.prototype, "editor", void 0), w([y()], $.prototype, "climateFound", void 0), p("energy-joe-panel", $);
//#endregion
export { $ as EnergyJoePanel };
