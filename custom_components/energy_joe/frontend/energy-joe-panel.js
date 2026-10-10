import { A as e, B as t, C as n, D as r, E as i, F as a, G as o, H as s, I as c, J as l, K as u, L as d, M as f, N as p, O as m, P as h, R as g, S as _, T as v, U as y, V as ee, W as b, X as x, Y as S, _ as te, a as ne, b as C, c as w, d as re, f as ie, g as ae, h as oe, i as se, j as T, k as ce, l as le, m as ue, n as de, o as fe, p as pe, q as E, r as D, s as me, t as he, u as O, v as k, w as ge, x as _e, y as ve, z as A } from "./tokens-DYPyeBX9.js";
//#region src/assets.ts
var ye = import.meta.url.replace(/[^/]*$/, ""), be = (e) => `${ye}${e}`, xe = /* @__PURE__ */ new Set(["welcome"]), Se = /* @__PURE__ */ new Set([
	"night-charge",
	"sleep",
	"learn"
]), Ce = "thumbs", we = class extends b {
	constructor(...e) {
		super(...e), this.name = "", this.alt = "";
	}
	static {
		this.styles = x`
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
		let e = Se.has(this.name) ? "scene" : "";
		if (this.name === Ce) return E`<img class="light" src=${be("logo.webp")} alt=${this.alt} decoding="async" /><img
          class="dark"
          src=${be("logo-dark.webp")}
          alt=${this.alt}
          decoding="async"
        />`;
		let t = be(`poses/${this.name}.webp`);
		return xe.has(this.name) ? E`<img class="light" src=${t} alt=${this.alt} decoding="async" /><img
        class="dark"
        src=${be(`poses/${this.name}-dark.webp`)}
        alt=${this.alt}
       
        decoding="async"
      />` : E`<img class=${e} src=${t} alt=${this.alt} decoding="async" />`;
	}
};
e([y()], we.prototype, "name", void 0), e([y()], we.prototype, "alt", void 0), f("joe-pose", we);
//#endregion
//#region src/components/empty-state.ts
var Te = class extends b {
	constructor(...e) {
		super(...e), this.pose = "", this.heading = "", this.text = "", this.note = "";
	}
	static {
		this.styles = [T, x`
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
		return E`<div class="wrap">
      <joe-pose name=${this.pose}></joe-pose>
      <div>
        ${a(this.heading)} ${A}
        <p class="lead">${this.text}</p>
        ${this.note ? E`<div class="note"><span class="chip soon">${this.note}</span></div>` : o}
        <slot></slot>
      </div>
    </div>`;
	}
};
e([y()], Te.prototype, "pose", void 0), e([y()], Te.prototype, "heading", void 0), e([y()], Te.prototype, "text", void 0), e([y()], Te.prototype, "note", void 0), f("joe-empty-state", Te);
//#endregion
//#region src/components/entity-picker.ts
var Ee = 60, De = class extends b {
	constructor(...e) {
		super(...e), this.selected = [], this.invert = !1, this.query = "", this.showAll = !1, this.limit = Ee;
	}
	static {
		this.styles = [T, x`
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
		e.has("request") && this.request && (this.selected = [...this.request.selected], this.invert = this.request.measurement?.invert ?? !1, this.query = "", this.showAll = !1, this.limit = Ee);
	}
	render() {
		let { hass: e, t, request: n } = this;
		if (!e || !t || !n) return o;
		let r = this.candidates(e, n), i = r.slice(0, this.limit), s = this.query ? [] : (n.suggestions ?? []).filter((t) => e.states[t.entity_id]);
		return E`<div data-tipped>
      <div class="sheet-title">${a(n.heading, "h2", C(t, n.tip))}</div>
      <input
        class="input search"
        type="search"
        .value=${this.query}
        placeholder=${t("pick.search")}
        aria-label=${t("pick.search")}
        @input=${(e) => {
			this.query = e.target.value, this.limit = Ee;
		}}
      />
      ${s.length ? E`<div class="group-label">${t("pick.suggested")}</div>
            <ul>
              ${s.map((r) => this.renderRow(e, t, n, r.entity_id, r))}
            </ul>` : o}
      <div class="group-label">${t(this.showAll ? "pick.all" : "pick.fitting")} · ${r.length}</div>
      ${r.length ? E`<ul>
            ${i.map((r) => this.renderRow(e, t, n, r))}
          </ul>` : E`<p class="empty">${t("pick.empty")}</p>`}
      ${r.length > i.length ? E`<button type="button" class="mini-btn more" data-notip @click=${() => this.limit += Ee}>
            ${t("pick.more", { count: r.length - i.length })}
          </button>` : o}
      <div class="line">
        <button
          type="button"
          id="all"
          class="switch"
          role="switch"
          aria-checked=${String(this.showAll)}
          aria-labelledby="all-label"
          @click=${() => {
			this.showAll = !this.showAll, this.limit = Ee;
		}}
        ></button>
        <label id="all-label" for="all">${t("pick.show_all")}</label>
        ${C(t, "pick_all")}
      </div>
      ${n.measurement ? this.renderInvert(e, t, n) : o}
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
			if (i.has(o) || !this.showAll && (!ge(s, t.filter) || e.entities?.[o]?.hidden)) continue;
			let c = _(e, o);
			if (r.length) {
				let t = `${c} ${o} ${n(e, o)}`.toLowerCase();
				if (!r.every((e) => t.includes(e))) continue;
			}
			a.push({
				id: o,
				name: c
			});
		}
		return a.sort((e, t) => e.name.localeCompare(t.name, this.t?.lang)), a.map((e) => e.id);
	}
	renderRow(e, t, r, a, s) {
		let c = this.selected.includes(a), l = n(e, a), u = s?.reasons?.[0];
		return E`<li>
      <button type="button" class="row" aria-pressed=${String(c)} @click=${() => this.toggle(a)}>
        <span class="mark ${r.multiple ? "box" : ""}" aria-hidden="true">
          ${c ? E`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>` : o}
        </span>
        <span class="txt">
          <b>${_(e, a)}</b>
          <small>${l ? `${l} · ` : ""}${a}</small>
          ${u ? E`<small class="why">${d(t, u)}</small>` : o}
        </span>
        <span class="end">
          <span class="val">${i(e, a, t.lang)}</span>
          ${s?.confidence == null ? o : p(t, s.confidence)}
        </span>
      </button>
    </li>`;
	}
	renderInvert(e, t, n) {
		let i = n.measurement?.role ?? "grid", a = this.selected[0], s = a ? r(e, {
			entity_id: a,
			invert: this.invert,
			minus_entity_id: null
		}) : null, c = "";
		if (s !== null) {
			let e = v(t.lang, Math.abs(s), 2);
			c = i === "grid" ? t(s >= 0 ? "pick.preview.import" : "pick.preview.export", { value: e }) : i === "battery" ? t(s >= 0 ? "pick.preview.charge" : "pick.preview.discharge", { value: e }) : t(s >= -.05 ? `pick.preview.${i}` : "pick.preview.negative", { value: v(t.lang, s, 2) });
		}
		return E`<div class="line">
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
        ${C(t, i === "battery" ? "pick_invert_battery" : "pick_invert")}
      </div>
      ${c ? E`<div class="note preview"><ha-icon icon="mdi:eye-outline"></ha-icon><span>${c}</span></div>` : o}`;
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
e([y({ attribute: !1 })], De.prototype, "hass", void 0), e([y({ attribute: !1 })], De.prototype, "t", void 0), e([y({ attribute: !1 })], De.prototype, "request", void 0), e([s()], De.prototype, "selected", void 0), e([s()], De.prototype, "invert", void 0), e([s()], De.prototype, "query", void 0), e([s()], De.prototype, "showAll", void 0), e([s()], De.prototype, "limit", void 0), f("joe-entity-picker", De);
//#endregion
//#region src/components/sheet.ts
var Oe = class extends b {
	constructor(...e) {
		super(...e), this.label = "", this.closeLabel = "", this.wide = !1, this.onScrim = (e) => {
			e.composedPath()[0] === this && this.close();
		};
	}
	static {
		this.styles = x`
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
		return E`<div
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
e([y()], Oe.prototype, "label", void 0), e([y()], Oe.prototype, "closeLabel", void 0), e([y({
	type: Boolean,
	reflect: !0
})], Oe.prototype, "wide", void 0), e([ee(".panel")], Oe.prototype, "panel", void 0), f("joe-sheet", Oe);
//#endregion
//#region src/components/sim-switch.ts
var ke = {
	simulation: "mdi:pause",
	advisory: "mdi:comment-question-outline",
	live: "mdi:play",
	off: "mdi:power"
}, Ae = class extends b {
	constructor(...e) {
		super(...e), this.mode = "simulation", this.compact = !1, this.running = !1;
	}
	static {
		this.styles = x`
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
		return e ? E`<button
      type="button"
      class="${this.mode}${this.running ? " running" : ""}"
      aria-label=${e("mode.switch.label")}
      @click=${this.toggle}
    >
      <span class="knob"><ha-icon icon=${ke[this.mode]}></ha-icon></span>
      <span>
        <b>${e(`mode.${this.mode}`)}</b>
        ${this.compact ? o : E`<small>${e(`mode.${this.mode}.sub`)}</small>`}
      </span>
    </button>` : o;
	}
	toggle() {
		this.dispatchEvent(new CustomEvent("joe-mode-switch", {
			bubbles: !0,
			composed: !0
		}));
	}
};
e([y()], Ae.prototype, "mode", void 0), e([y({ type: Boolean })], Ae.prototype, "compact", void 0), e([y({ type: Boolean })], Ae.prototype, "running", void 0), e([y({ attribute: !1 })], Ae.prototype, "t", void 0), f("joe-sim-switch", Ae);
//#endregion
//#region src/config.ts
var je = /\[[^\]]*\]|[^.[]+/g;
function Me(e) {
	let t = [], n = "";
	for (let r of e.match(je) ?? []) n = !n || r.startsWith("[") ? n + r : `${n}.${r}`, t.push(n);
	return t.reverse();
}
function j(e, t) {
	for (let n of Me(t)) {
		let t = e.provenance[n];
		if (t) return t;
	}
}
function Ne(e, t) {
	return e.answers.ignored.includes(t);
}
function M(e, t, n) {
	let r = e.answers.ignored.filter((e) => e !== t);
	return n ? [...r, t] : r;
}
function N(e, t, n = "user") {
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
function P(e, t) {
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
var Ie = class extends b {
	constructor(...e) {
		super(...e), this.variant = "calendar", this.address = "", this.calendar = "";
	}
	static {
		this.styles = x`
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
		return e ? E`<ol aria-label=${e(`flow.${this.variant}.title`)}>
      ${this.steps(e).map((e, t) => E`<li class=${e.joe ? "joe" : ""}>
          <span class="badge" aria-hidden="true">
            <ha-icon icon=${e.icon}></ha-icon>
            <span class="number">${t + 1}</span>
          </span>
          <span .innerHTML=${this.bold(e.text)}></span>
        </li>`)}
    </ol>` : o;
	}
	bold(e) {
		return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
	}
};
e([y({ attribute: !1 })], Ie.prototype, "t", void 0), e([y()], Ie.prototype, "variant", void 0), e([y()], Ie.prototype, "address", void 0), e([y()], Ie.prototype, "calendar", void 0), f("joe-calendar-flow", Ie);
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
}, F = class extends b {
	constructor(...e) {
		super(...e), this.actionId = "", this.saved = !1, this.password = "", this.secret = "", this.busy = !1, this.ownApp = !1;
	}
	static {
		this.styles = [T, x`
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
		if (!e) return o;
		let t = this.account, n = Re.has(t.kind);
		return E`<div class="field" data-tipped>
        <div class="head-row"><label for="account-kind"><b>${e("calendar.account.kind")}</b></label> ${C(e, "calendar_account")}</div>
        <select id="account-kind" class="input" @change=${(e) => this.set({ kind: e.target.value })}>
          ${Le.map((n) => E`<option value=${n} ?selected=${n === t.kind}>${e(`calendar.account.kind.${n}`)}</option>`)}
        </select>
      </div>
      <div class="field" data-tipped>
        <div class="head-row"><label for="account-address"><b>${e("calendar.account.address")}</b></label> ${C(e, "calendar_account_address")}</div>
        <input
          id="account-address"
          class="input"
          type="email"
          autocomplete="off"
          placeholder=${e(`calendar.account.placeholder.${t.kind}`)}
          .value=${t.address}
          @change=${(e) => this.set({ address: e.target.value.trim().toLowerCase() })}
        />
        ${t.kind === "google" ? E`<p class="hint">${e("calendar.account.google.hint")}</p>` : o}
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
        ${C(e, "calendar_account_accept")}
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
		let n = this.status, r = n?.oauth, i = t.kind === "google", a = this.joeApp(t.kind), s = !a || this.ownApp || !!t.client_id || t.kind === "microsoft", c = !!n?.has_sign_in, l = this.signInError ?? (r?.state === "error" ? r.error : void 0);
		return E`${s ? this.renderOwnApp(e, t, a) : o}
      <div class="field" data-tipped>
        <div class="inline">
          <button type="button" class="mini-btn go" ?disabled=${this.busy} @click=${() => this.act("sign_in")}>
            <ha-icon icon=${i ? "mdi:google" : "mdi:microsoft"}></ha-icon>${e(c ? "mail.sign_in.again" : i ? "mail.sign_in.google" : "mail.sign_in")}
          </button>
          ${c ? E`<button type="button" class="mini-btn quiet" @click=${() => this.act("sign_out")}>${e("mail.sign_out")}</button>` : o}
          ${s ? o : E`<button type="button" class="mini-btn quiet" @click=${() => this.ownApp = !0}>${e("calendar.account.own_app")}</button>`}
          ${C(e, "mail_sign_in")}
        </div>
        ${r?.state === "waiting" && !this.signInError ? E`<p class="code">${e("mail.sign_in.code", { code: r.user_code ?? "" })}
              <a href=${r.uri ?? ""} target="_blank" rel="noreferrer noopener">${r.uri}</a></p>` : l ? E`<p class="bad">${e.optional(`calendar.account.oauth.${l}`) ?? e("calendar.account.oauth.other")}</p>` : c ? E`<p class="hint ok">${e("mail.signed_in")}</p>` : o}
      </div>`;
	}
	renderOwnApp(e, t, n) {
		let r = t.kind === "google";
		return E`<div class="field" data-tipped>
      <div class="head-row">
        <b>${e(n ? "calendar.account.client_id" : "calendar.account.client_id.needed")}</b>
        ${C(e, r ? "google_app" : "mail_microsoft")}
      </div>
      ${n ? o : E`<p class="hint">${e("calendar.account.no_joe_app")}</p>`}
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
        ${t.kind === "microsoft" ? E`<input
              class="input"
              type="text"
              placeholder="common"
              aria-label=${e("mail.tenant")}
              .value=${t.tenant}
              @change=${(e) => this.set({ tenant: e.target.value.trim() || "common" })}
            />` : o}
      </div>
      ${r ? E`<form
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
          ${this.status?.has_client_secret ? E`<p class="hint ok">${e("mail.password.saved")}</p>` : o}` : o}
    </div>`;
	}
	renderPassword(e, t) {
		return E`${t.kind === "caldav" ? E`<div class="field" data-tipped>
            <div class="head-row"><b>${e("calendar.account.url")}</b> ${C(e, "calendar_account_url")}</div>
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
          </div>` : o}
      <div class="field" data-tipped>
        <div class="head-row"><label for="account-password"><b>${e("calendar.account.password")}</b></label> ${C(e, "calendar_account_password")}</div>
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
        ${this.status?.has_password ? E`<p class="hint ok">${e("mail.password.saved")}</p>` : o}
      </div>`;
	}
	renderStatus(e) {
		let t = this.status, n = Re.has(this.account.kind) ? t?.has_sign_in : t?.has_password, r = this.saved ? t?.state === "error" ? e("mail.state.error", { error: e.optional(`calendar.account.error.${t.error}`) ?? e("calendar.account.error.other") }) : t?.checked ? e("mail.state.ok", { time: k(t.checked) }) : "" : e("calendar.account.after_save");
		return E`<div class="inline" data-tipped>
      <button type="button" class="mini-btn" ?disabled=${this.busy || !n} @click=${() => this.act("test")}>
        <ha-icon icon="mdi:calendar-check-outline"></ha-icon>${e("calendar.account.test")}
      </button>
      ${C(e, "calendar_account_test")}
      <span class=${this.saved && t?.state === "error" ? "bad" : "hint"}>${r}</span>
      ${this.result ? E`<span class=${this.result === "ok" ? "ok" : "bad"}>
            ${e.optional(`calendar.account.result.${this.result}`) ?? e("calendar.account.result.other")}
          </span>` : o}
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
e([y({ attribute: !1 })], F.prototype, "hass", void 0), e([y({ attribute: !1 })], F.prototype, "t", void 0), e([y()], F.prototype, "actionId", void 0), e([y({ type: Boolean })], F.prototype, "saved", void 0), e([y({ attribute: !1 })], F.prototype, "need", void 0), e([y({ attribute: !1 })], F.prototype, "status", void 0), e([y({ attribute: !1 })], F.prototype, "apps", void 0), e([s()], F.prototype, "password", void 0), e([s()], F.prototype, "secret", void 0), e([s()], F.prototype, "result", void 0), e([s()], F.prototype, "signInError", void 0), e([s()], F.prototype, "busy", void 0), e([s()], F.prototype, "ownApp", void 0), f("joe-car-account", F);
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
}, I = class extends b {
	constructor(...e) {
		super(...e), this.actionId = "", this.saved = !1, this.password = "", this.busy = !1, this.servers = !1;
	}
	static {
		this.styles = [T, x`
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
		if (!e) return o;
		let t = this.mailbox, n = this.servers || t.provider === "other" && !!t.address;
		return E`<div class="field" data-tipped>
        <div class="head-row"><label for="mail-address"><b>${e("mail.address")}</b></label> ${C(e, "mail_address")}</div>
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
        <div class="head-row"><label for="mail-provider"><b>${e("mail.provider")}</b></label> ${C(e, "mail_provider")}</div>
        <select id="mail-provider" class="input" @change=${(e) => this.set({ provider: e.target.value })}>
          ${Be.map((n) => E`<option value=${n} ?selected=${n === t.provider}>${e(`mail.provider.${n}`)}</option>`)}
        </select>
        <p class="hint">${e(`mail.provider.${t.provider}.hint`)}</p>
      </div>
      ${this.renderPassword(e)} ${n ? this.renderServers(e, t) : o}
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
        ${C(e, "mail_accept")}
        ${n ? o : E`<button type="button" class="mini-btn quiet" @click=${() => this.servers = !0}>${e("mail.servers.change")}</button>`}
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
		return E`<div class="field" data-tipped>
      <div class="head-row"><label for="mail-password"><b>${e("mail.password")}</b></label> ${C(e, "mail_password")}</div>
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
      ${this.status?.has_secret ? E`<p class="hint ok">${e("mail.password.saved")}</p>` : E`<p class="hint">${e("mail.password.hint")}</p>`}
    </div>`;
	}
	renderServers(e, t) {
		let n = (n) => E`<input
      class="input"
      type="text"
      aria-label=${e(`mail.${n}`)}
      placeholder=${e(`mail.${n}`)}
      .value=${t[n] ?? ""}
      @change=${(e) => this.set({ [n]: e.target.value.trim() || null })}
    />`, r = (n) => E`<input
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
		return E`<div class="field" data-tipped>
      <div class="head-row"><b>${e("mail.servers")}</b> ${C(e, "mail_servers")}</div>
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
		return E`<div class="field" data-tipped>
      <div class="inline">
        <button type="button" class="mini-btn" ?disabled=${this.busy || !this.status?.has_secret} @click=${() => this.act("test")}>
          <ha-icon icon="mdi:connection"></ha-icon>${e("mail.test")}
        </button>
        ${this.saved ? E`<button type="button" class="mini-btn" ?disabled=${this.busy || !this.status?.has_secret} @click=${() => this.act("check")}>
              <ha-icon icon="mdi:email-sync-outline"></ha-icon>${e("mail.check")}
            </button>` : o}
        ${C(e, "mail_status")}
      </div>
      <p class=${this.saved && this.status?.state === "error" ? "hint bad" : "hint"}>
        ${this.saved ? this.statusText(e) : e("mail.after_save")}
      </p>
      ${this.result ? E`<p class=${this.result === "ok" ? "hint ok" : "hint bad"} role="status">
            ${e.optional(`mail.result.${this.result}`) ?? e("mail.result.failed")}
          </p>` : o}
    </div>`;
	}
	renderRecent(e) {
		let t = this.status?.recent ?? [];
		if (!t.length) return o;
		let n = this.need?.allowed ?? [];
		return E`<div class="field" data-tipped>
      <div class="head-row"><b>${e("mail.recent")}</b> ${C(e, "mail_recent")}</div>
      <ul>
        ${t.slice(0, 8).map((t) => E`<li>
            <span class="what">
              ${t.summary || "–"} ${t.start && t.start.includes("T") ? `· ${t.start.slice(8, 10)}.${t.start.slice(5, 7)}. ${k(t.start)}` : ""}
              · ${t.from}
            </span>
            <span class=${t.result.startsWith("not") || t.result.endsWith("not_accepted") || t.result.startsWith("no_") ? "bad" : ""}>
              ${e.optional(`mail.recent.${t.result}`) ?? t.result}
            </span>
            ${t.result === "not_allowed" && !n.includes(t.from) ? E`<button type="button" class="mini-btn" @click=${() => this.change({ allowed: [...n, t.from] })}>${e("mail.allow")}</button>` : o}
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
e([y({ attribute: !1 })], I.prototype, "hass", void 0), e([y({ attribute: !1 })], I.prototype, "t", void 0), e([y()], I.prototype, "actionId", void 0), e([y({ type: Boolean })], I.prototype, "saved", void 0), e([y({ attribute: !1 })], I.prototype, "need", void 0), e([y({ attribute: !1 })], I.prototype, "status", void 0), e([s()], I.prototype, "password", void 0), e([s()], I.prototype, "busy", void 0), e([s()], I.prototype, "result", void 0), e([s()], I.prototype, "servers", void 0), f("joe-car-mailbox", I);
//#endregion
//#region src/components/car-calendars.ts
var Ue = [
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
], We = [
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
], L = class extends b {
	constructor(...e) {
		super(...e), this.actionId = "", this.savedSource = null, this.carName = "", this.copied = !1, this.copyFailed = !1, this.linksFailed = !1, this.sender = "";
	}
	static {
		this.styles = [T, x`
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
		if (!e || !t) return o;
		let n = this.need?.source ?? "ha";
		return E`<div data-tipped>
        <div class="head-row"><b>${e("calendar.source")}</b> ${C(e, "calendar_source")}</div>
        <div class="ways-box"><div class="ways" role="radiogroup" aria-label=${e("calendar.source")}>
          ${Ue.map((t) => E`<button
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
      ${this.linksFailed ? E`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("calendar.links_failed")}</span>
            <button type="button" class="mini-btn quiet" @click=${() => this.load(!1)}>${e("calendar.retry")}</button>
          </div>` : o}`;
	}
	saved(e) {
		return this.savedSource === e;
	}
	renderLegacy(e, t) {
		let n = this.savedSource && this.savedSource !== "mailbox" && this.savedSource === (this.need?.source ?? "ha") ? this.links?.entities[this.actionId] : null;
		return n ? E`<div class="own" data-tipped>
          <div class="head-row"><ha-icon icon="mdi:calendar-clock"></ha-icon><b>${e("calendar.own.legacy")}</b> ${C(e, "calendar_legacy")}</div>
          <p class="hint">${e("calendar.own.legacy.hint", { name: _(t, n) })}</p>
        </div>` : o;
	}
	renderCalendar(e, t) {
		let n = this.need?.calendars ?? [];
		return E`<div class="part">
        <joe-calendar-flow .t=${e} variant="calendar"></joe-calendar-flow>
      </div>
      ${this.renderLegacy(e, t)}
      <div data-tipped>
        <div class="head-row"><b>${e("calendar.pick")}</b> ${C(e, "calendar_more")}</div>
        <div class="chips">
          ${n.map((r) => E`<span class="chip">
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
          ${We.map((t) => E`<a class="mini-btn" href=${t.url} target="_blank" rel="noreferrer noopener">
                <ha-icon icon="mdi:open-in-new"></ha-icon>${e(`calendar.connect.${t.key}`)}
              </a>`)}
          ${C(e, "calendar_connect")}
        </div>
      </div>`;
	}
	async pick() {
		let e = this.t, t = await P(this, {
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
		return E`<div class="part">
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
		let r = E`<div class="head-row">
      <ha-icon icon="mdi:calendar-import"></ha-icon><b>${e("calendar.own")}</b> ${C(e, "calendar_own")}
    </div>`;
		if (!n) return E`<div class="own" data-tipped>${r}<p class="hint">${e("calendar.own.after_save", { name: t })}</p></div>`;
		let i = this.links?.links[this.actionId], a = this.links?.external_url, s = i && a ? `${a.replace(/\/$/, "")}${i}` : null;
		return E`<div class="own" data-tipped>
      ${r}
      <p class="hint">${e("calendar.own.hint", { name: t })}</p>
      ${s ? E`<div class="link">
            <code>${s}</code>
            <button type="button" class="mini-btn" @click=${() => this.copy(s)}>
              <ha-icon icon=${this.copied ? "mdi:check" : "mdi:content-copy"}></ha-icon>${e(this.copied ? "calendar.copied" : "calendar.copy")}
            </button>
            <button type="button" class="mini-btn quiet" @click=${() => this.load(!0)}>
              <ha-icon icon="mdi:refresh"></ha-icon>${e("calendar.renew")}
            </button>
            ${C(e, "calendar_link")}
          </div>
          ${this.copyFailed ? E`<p class="hint bad">${e("calendar.copy_failed")}</p>` : o}` : E`<p class="hint">${e("calendar.no_external")}</p>`}
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
		return E`<div class="part">
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
      ${this.renderAllowed(e, "account_allowed")} ${this.hass ? this.renderLegacy(e, this.hass) : o}`;
	}
	renderAllowed(e, t = "mail_allowed") {
		let n = this.need?.allowed ?? [];
		return E`<div class="part" data-tipped>
      <div class="head-row"><b>${e("mail.allowed")}</b> ${C(e, t)}</div>
      <p class="hint">${e("mail.allowed.hint")}</p>
      ${n.length ? E`<div class="chips">
            ${n.map((t) => E`<span class="chip">
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
          </div>` : E`<div class="note warn"><ha-icon icon="mdi:account-alert-outline"></ha-icon><span>${e("mail.allowed.none")}</span></div>`}
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
e([y({ attribute: !1 })], L.prototype, "hass", void 0), e([y({ attribute: !1 })], L.prototype, "t", void 0), e([y()], L.prototype, "actionId", void 0), e([y({ attribute: !1 })], L.prototype, "savedSource", void 0), e([y({ attribute: !1 })], L.prototype, "need", void 0), e([y({ attribute: !1 })], L.prototype, "mailbox", void 0), e([y({ attribute: !1 })], L.prototype, "account", void 0), e([y({ attribute: !1 })], L.prototype, "apps", void 0), e([y()], L.prototype, "carName", void 0), e([s()], L.prototype, "links", void 0), e([s()], L.prototype, "copied", void 0), e([s()], L.prototype, "copyFailed", void 0), e([s()], L.prototype, "linksFailed", void 0), e([s()], L.prototype, "sender", void 0), f("joe-car-calendars", L);
//#endregion
//#region src/hot-water.ts
var Ge = [
	"warmwasser",
	"brauchwasser",
	"trinkwasser",
	"boiler",
	"hot_water",
	"hot water",
	"dhw",
	"water_heater",
	"water heater"
], Ke = [
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
], qe = [
	"switch",
	"input_boolean",
	"select",
	"input_select",
	"number",
	"input_number",
	"button",
	"script"
];
function Je(e, t) {
	let n = e.states[t], r = String(n?.attributes.friendly_name ?? ""), i = e.entities?.[t]?.device_id, a = i ? e.devices?.[i] : void 0;
	return `${t} ${r} ${a?.name_by_user ?? a?.name ?? ""}`.toLowerCase().replaceAll("-", " ");
}
function Ye(e, t) {
	return [...Ge, ...t].some((t) => e.includes(t));
}
function Xe(e) {
	return (e ?? "").toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((e) => e.length >= 5);
}
function Ze(e, t) {
	let n = Xe(t), r = [], i = [];
	for (let [t, a] of Object.entries(e.states)) {
		let o = t.split(".")[0], s = Je(e, t);
		if (!Ye(s, n)) continue;
		let c = t.toLowerCase(), l = String(a.attributes.unit_of_measurement ?? "");
		if ((o === "sensor" || o === "number") && (l === "°C" || l === "°F")) {
			let e = (Ge.some((e) => c.includes(e.replace(" ", "_"))) ? 2 : 1) - (Ke.some((e) => s.includes(e)) ? 2 : 0);
			r.push({
				entity_id: t,
				score: e
			});
		} else qe.includes(o) && i.push({
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
//#region src/editors/action-editor.ts
var Qe = [
	"eq",
	"ne",
	"lt",
	"le",
	"gt",
	"ge"
], $e = {
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
}, et = {
	reserve_km: [0, 1e3],
	consumption: [5, 60],
	daily_km: [0, 2e3],
	capacity_kwh: [.1, 300]
}, tt = {
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
function nt(e, t) {
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
var R = class extends b {
	constructor(...e) {
		super(...e), this.actionId = "", this.section = "", this.consumer = "", this.saving = !1, this.problem = "", this.focused = !1;
	}
	static {
		this.styles = [T, x`
      :host {
        display: block;
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
      .danger-zone {
        margin-top: 18px;
        padding-top: 14px;
        border-top: 1px solid var(--joe-line);
      }
      @media (pointer: coarse) {
        .icon-btn {
          width: 44px;
          height: 44px;
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
    `];
	}
	get existing() {
		return this.config?.actions.find((e) => e.id === this.actionId);
	}
	willUpdate(e) {
		if (!this.draft && this.t && (e.has("actionId") || e.has("config"))) {
			if (this.actionId.startsWith("new:")) {
				let e = nt(this.actionId.slice(4), this.t), t = this.discovery?.wallboxes.find((e) => e.is_car);
				this.actionId === "new:ev" && t && Object.assign(e, this.fromWallbox(t));
				let n = this.config?.consumers.filter((e) => e.kind === "hot_water") ?? [];
				this.actionId === "new:hot_water" && n.length === 1 && (e.consumer_id = n[0].id);
				let r = this.config?.consumers.find((e) => e.id === this.consumer);
				r && (e.name = r.name, e.consumer_id = r.id, e.power_entity = r.power_entity ?? null), this.draft = e, this.section === "need" && this.toggleNeed();
			} else this.existing && (this.draft = structuredClone(this.existing), (this.section === "calendars" || this.section === "need") && !this.draft.need?.enabled && this.toggleNeed());
		}
	}
	updated() {
		if ((this.section === "calendars" || this.section === "need") && !this.focused) {
			let e = this.shadowRoot?.querySelector(this.section === "need" ? `[aria-label="${this.t?.("action.need") ?? ""}"]` : "joe-car-calendars");
			e && (this.focused = !0, e.scrollIntoView({ block: "center" }));
		}
	}
	fromWallbox(e) {
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
	render() {
		let { t: e, hass: t, draft: n } = this;
		if (!e || !t || !n) return o;
		let r = !this.existing;
		return E`<div class="sheet-title">${a(e(r ? "action.title.new" : "action.title"))}</div>
      ${this.field(e("action.f.name"), "a_name", E`<input
          class="input"
          type="text"
          maxlength="60"
          .value=${n.name}
          @change=${(e) => this.set({ name: e.target.value.trim() || n.name })}
        />`)}
      ${this.field(e("action.f.kind"), "a_kind", E`<div class="seg" role="group" aria-label=${e("action.f.kind")}>
          ${["switch", "target"].map((t) => E`<button type="button" aria-pressed=${String(n.kind === t)} @click=${() => this.set({ kind: t })}>
                ${e(`action.kind.${t}`)}
              </button>`)}
        </div>`)}
      ${this.field(e("action.f.entity"), "a_entity", this.entityBox(e, n.entity_id, () => this.pickTarget()))}
      ${n.entity_id ? this.field(e("action.f.on_value"), "a_on_value", this.valueInput(n.entity_id, n.on_value, (e) => this.set({ on_value: e }))) : o}
      ${this.field(e("action.f.reset"), "a_reset", E`<div class="row">
          <div class="seg" role="group" aria-label=${e("action.f.reset")}>
            ${["previous", "fixed"].map((t) => E`<button type="button" aria-pressed=${String(n.reset === t)} @click=${() => this.set({ reset: t })}>
                  ${e(`action.reset.${t}`)}
                </button>`)}
          </div>
          ${n.reset === "fixed" && n.entity_id ? this.valueInput(n.entity_id, n.reset_value ?? "", (e) => this.set({ reset_value: e })) : o}
        </div>`)}
      ${this.field(e("action.f.lead"), "a_lead", E`<span class="unit-input">
          <input
            class="input"
            type="number"
            min="0"
            max="120"
            step="1"
            .value=${String(n.lead_min)}
            @change=${(e) => this.set({ lead_min: this.int(e, 0, 120) })}
          />
          <span class="unit">min</span>
        </span>`)}
      ${n.kind === "target" ? this.renderTarget(e, n) : o}
      ${this.field(e("action.f.auto"), "a_auto", E`<div class="row">
          <button
            type="button"
            class="switch"
            role="switch"
            aria-checked=${String(n.auto)}
            aria-label=${e("action.f.auto")}
            @click=${() => this.set({ auto: !n.auto })}
          ></button>
          <span>${e("action.f.below")}</span>
          <span class="unit-input">
            <input
              class="input"
              type="number"
              min="0"
              max="1000"
              step="1"
              ?disabled=${!n.auto}
              placeholder=${e("action.f.every_night")}
              .value=${n.forecast_below_kwh == null ? "" : String(n.forecast_below_kwh)}
              @change=${(e) => {
			let t = Number.parseFloat(e.target.value);
			this.set({ forecast_below_kwh: Number.isFinite(t) && t > 0 ? t : null });
		}}
            />
            <span class="unit">kWh</span>
          </span>
        </div>`)}
      ${n.auto ? this.renderConditions(e, n) : o}
      ${n.kind === "switch" ? this.renderNeed(e, n) : o}
      ${this.field(e("action.f.power"), "a_power", E`<span class="unit-input">
          <input
            class="input"
            type="number"
            inputmode="decimal"
            min="0"
            max="100"
            step="0.1"
            placeholder=${e("f.unknown")}
            .value=${n.power_kw == null ? "" : String(n.power_kw)}
            @change=${(e) => {
			let t = Number.parseFloat(e.target.value);
			this.set({ power_kw: Number.isFinite(t) && t > 0 ? t : null });
		}}
          />
          <span class="unit">kW</span>
        </span>`)}
      ${this.config?.consumers.length ?? 0 ? this.field(e("action.f.consumer"), "a_consumer", E`<select class="input" @change=${(e) => this.set({ consumer_id: e.target.value || null })}>
              <option value="" ?selected=${!n.consumer_id}>${e("action.f.consumer.none")}</option>
              ${this.config.consumers.map((e) => E`<option value=${e.id} ?selected=${n.consumer_id === e.id}>${e.name}</option>`)}
            </select>`) : o}
      ${this.field(e("action.f.priority"), "a_priority", E`<span class="unit-input">
          <input
            class="input"
            type="number"
            min="1"
            max="9"
            step="1"
            .value=${String(n.priority)}
            @change=${(e) => this.set({ priority: this.int(e, 1, 9) })}
          />
        </span>`)}
      ${this.field(e("action.f.enabled"), "a_enabled", E`<button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(n.enabled)}
          aria-label=${e("action.f.enabled")}
          @click=${() => this.set({ enabled: !n.enabled })}
        ></button>`)}
      ${this.problem ? E`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.problem}</span></div>` : o}
      <div class="actions">
        <span data-tipped class="row">
          <button type="button" class="btn btn-primary" ?disabled=${this.saving} @click=${this.save}>${e("common.save")}</button>
          ${C(e, "a_save")}
        </span>
        <button type="button" class="btn btn-ghost" data-notip @click=${this.close}>${e("common.cancel")}</button>
      </div>
      ${r ? o : E`<div class="danger-zone" data-tipped>
            <button type="button" class="btn btn-danger" @click=${this.deleteAction}>${e("action.delete")}</button>
            ${C(e, "a_delete")}
          </div>`}`;
	}
	renderTarget(e, t) {
		let n = (n, r) => E`<label>
      ${e(`action.f.${n}`)}
      <span class="unit-input">
        <input
          class="input"
          type="number"
          min="0"
          max="100"
          step="0.5"
          .value=${String(t[n])}
          @change=${(e) => {
			let t = Number.parseFloat(e.target.value);
			Number.isFinite(t) && this.set({ [n]: t });
		}}
        />
        <span class="unit">${r}</span>
      </span>
    </label>`;
		return E`${this.field(e("action.f.sensor"), "a_sensor", this.entityBox(e, t.sensor_entity ?? "", () => this.pickSensor()))}
      ${this.field(e("action.f.temps"), "a_temps", E`<div class="temps">${n("comfort", "°C")} ${n("maximum", "°C")} ${n("buffer", "K")}</div>`)}`;
	}
	renderNeed(e, t) {
		let n = t.need ?? $e, r = (this.config?.persons ?? []).filter((e) => e.calendars.length), i = (e, t, r, i = "") => E`<span
      class="unit-input"
    >
      <input
        class="input"
        type="number"
        inputmode="decimal"
        min=${et[e][0]}
        max=${Math.min(r, et[e][1])}
        step=${e === "consumption" || e === "capacity_kwh" ? "0.1" : "1"}
        placeholder=${i}
        .value=${n[e] == null ? "" : String(n[e])}
        @change=${(t) => {
			let n = t.target, r = Number.parseFloat(n.value.replace(",", ".")), [i, a] = et[e], o = Number.isFinite(r) && r >= i && r <= a, s = e === "reserve_km" ? 50 : null;
			o || (n.value = s == null ? "" : String(s)), this.setNeed({ [e]: o ? r : s });
		}}
      />
      <span class="unit">${t}</span>
    </span>`, a = (t) => this.entityBox(e, n[t] ?? "", () => this.pickNeed(t));
		return E`${this.field(e("action.need"), "a_need", E`<div class="row">
            <button
              type="button"
              class="switch"
              role="switch"
              aria-checked=${String(n.enabled)}
              aria-label=${e("action.need")}
              @click=${() => this.toggleNeed()}
            ></button>
            <span>${e(n.enabled ? "action.need.on" : "action.need.off")}</span>
          </div>
          <p class="field-hint">${e("action.need.hint")}</p>`)}
      ${n.enabled ? E`${this.field(e("action.need.soc"), "a_need_soc", a("soc_entity"))}
          ${this.field(e("action.need.range"), "a_need_range", a("range_entity"))}
          ${this.field(e("action.need.capacity"), "a_need_capacity", E`<div class="row">${i("capacity_kwh", "kWh", 300, e("action.need.from_sensor"))}</div>
              ${n.capacity_kwh == null ? a("capacity_entity") : o}`)}
          ${this.field(e("action.need.reserve"), "a_need_reserve", i("reserve_km", "km", 1e3))}
          ${this.field(e("action.need.consumption"), "a_need_consumption", E`${i("consumption", "kWh/100 km", 60, e("action.need.learned"))}
              ${n.consumption == null ? a("consumption_entity") : o}`)}
          ${this.field(e("action.need.daily"), "a_need_daily", i("daily_km", "km", 2e3, e("action.need.learned")))}
          ${this.field(e("action.need.odometer"), "a_need_odometer", a("odometer_entity"))}
          ${this.field(e("action.need.persons"), "a_need_persons", r.length ? E`<div class="row" role="group" aria-label=${e("action.need.persons")}>
                  ${r.map((e) => {
			let t = n.persons == null || n.persons.includes(e.id);
			return E`<button
                      type="button"
                      class="mini-btn ${t ? "go" : "quiet"}"
                      aria-pressed=${String(t)}
                      @click=${() => this.togglePerson(e.id, r.map((e) => e.id))}
                    >
                      ${e.name}
                    </button>`;
		})}
                </div>` : E`<p class="field-hint">${e("action.need.no_calendars")}</p>`)}
          ${this.field(e("action.need.calendars"), "a_need_calendars", E`<joe-car-calendars
              .hass=${this.hass}
              .t=${e}
              actionId=${t.id}
              .savedSource=${this.existing?.need?.enabled ? this.existing.need.source ?? "ha" : null}
              .need=${n}
              .mailbox=${this.mailboxes?.[t.id]}
              .account=${this.accounts?.[t.id]}
              .apps=${this.apps}
              carName=${t.name}
              @joe-need=${(e) => this.setNeed(e.detail)}
            ></joe-car-calendars>`)}
          ${this.field(e("action.need.round_trip"), "a_need_round_trip", E`<button
              type="button"
              class="switch"
              role="switch"
              aria-checked=${String(n.round_trip)}
              aria-label=${e("action.need.round_trip")}
              @click=${() => this.setNeed({ round_trip: !n.round_trip })}
            ></button>`)}
          ${this.config?.routing.service ? o : E`<div class="note"><ha-icon icon="mdi:map-marker-distance"></ha-icon><span>${e("action.need.no_routing")}</span></div>`}` : o}`;
	}
	setNeed(e) {
		this.set({ need: {
			...this.draft?.need ?? $e,
			...e
		} });
	}
	toggleNeed() {
		let e = this.draft?.need ?? $e;
		if (e.enabled) {
			this.setNeed({ enabled: !1 });
			return;
		}
		let t = this.discovery?.cars ?? [], n = (this.discovery?.wallboxes ?? []).filter((e) => e.is_car), r = t.length === 1 && n.length <= 1 ? t[0].entities : {}, i = { enabled: !0 };
		for (let [t, n] of Object.entries(tt)) !e[t] && r[n.role] && (i[t] = r[n.role] ?? null);
		this.setNeed(i);
	}
	togglePerson(e, t) {
		let n = (this.draft?.need ?? $e).persons ?? t, r = n.includes(e) ? n.filter((t) => t !== e) : [...n, e];
		this.setNeed({ persons: t.every((e) => r.includes(e)) ? null : r });
	}
	async pickNeed(e) {
		let t = this.t, n = tt[e], r = (this.discovery?.cars ?? []).map((e) => ({
			entity_id: e.entities[n.role] ?? "",
			confidence: e.confidence,
			reasons: e.reasons
		})).filter((e) => e.entity_id), i = await P(this, {
			heading: t(`action.need.pick.${n.role}`),
			tip: n.tip,
			filter: n.filter,
			selected: this.draft?.need?.[e] ? [this.draft.need[e]] : [],
			suggestions: Pe(r)
		});
		i && this.setNeed({ [e]: i.selected[0] ?? null });
	}
	renderConditions(e, t) {
		let n = this.hass;
		return this.field(e("action.f.conditions"), "a_conditions", E`${t.conditions.map((t, r) => E`<div class="condition">
            <span><b>${_(n, t.entity_id)}</b></span>
            <select
              class="input"
              aria-label=${e("action.f.op")}
              @change=${(e) => this.setCondition(r, { op: e.target.value })}
            >
              ${Qe.map((n) => E`<option value=${n} ?selected=${t.op === n}>${e(`action.op.${n}`)}</option>`)}
            </select>
            <input
              class="input"
              type="text"
              aria-label=${e("action.f.value")}
              .value=${String(t.value === !0 ? "on" : t.value === !1 ? "off" : t.value)}
              @change=${(e) => this.setCondition(r, { value: this.parse(e.target.value) })}
            />
            <button type="button" class="icon-btn" aria-label=${e("f.remove")} title=${e("f.remove")} @click=${() => this.removeCondition(r)}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>`)}
        <button type="button" class="mini-btn" @click=${this.addCondition}>
          <ha-icon icon="mdi:plus"></ha-icon>${e("action.f.condition.add")}
        </button>`);
	}
	field(e, t, n) {
		return E`<div class="field" data-tipped>
      <div class="field-label">${e} ${C(this.t, t)}</div>
      ${n}
    </div>`;
	}
	entityBox(e, t, n) {
		let r = this.hass;
		return E`<div class="entity">
      <span>
        ${t ? E`<b>${_(r, t)}</b><small>${i(r, t, e.lang)}</small>` : E`<small>${e("find.none")}</small>`}
      </span>
      <button type="button" class="mini-btn" @click=${n}>
        <ha-icon icon="mdi:magnify"></ha-icon>${e(t ? "review.change" : "review.choose")}
      </button>
    </div>`;
	}
	valueInput(e, t, n) {
		let r = this.t, i = e.split(".", 1)[0], a = this.hass?.states[e]?.attributes.options ?? [];
		if (["select", "input_select"].includes(i) && a.length) return E`<select class="input" aria-label=${r("action.f.value")} @change=${(e) => n(e.target.value)}>
        ${a.map((e) => E`<option value=${e} ?selected=${t === e}>${e}</option>`)}
      </select>`;
		if ([
			"switch",
			"input_boolean",
			"light",
			"fan"
		].includes(i)) {
			let e = t === !0 || t === "on";
			return E`<div class="seg" role="group" aria-label=${r("action.f.value")}>
        <button type="button" aria-pressed=${String(e)} @click=${() => n("on")}>${r("action.value.on")}</button>
        <button type="button" aria-pressed=${String(!e)} @click=${() => n("off")}>${r("action.value.off")}</button>
      </div>`;
		}
		return E`<input
      class="input"
      type="text"
      aria-label=${r("action.f.value")}
      .value=${t == null ? "" : String(t)}
      @change=${(e) => n(this.parse(e.target.value))}
    />`;
	}
	parse(e) {
		let t = e.trim();
		if (t === "on" || t === "an") return !0;
		if (t === "off" || t === "aus") return !1;
		let n = Number(t.replace(",", "."));
		return t !== "" && Number.isFinite(n) ? n : t;
	}
	int(e, t, n) {
		let r = Math.round(Number.parseFloat(e.target.value));
		return Math.min(n, Math.max(t, Number.isFinite(r) ? r : t));
	}
	hotWater() {
		if (this.draft?.kind !== "target" || !this.hass) return;
		let e = this.config?.consumers.find((e) => e.id === this.draft?.consumer_id);
		return Ze(this.hass, e?.name);
	}
	async pickTarget() {
		let e = this.t, t = (await P(this, {
			heading: e("action.pick.entity"),
			tip: "a_entity",
			filter: "writable",
			selected: this.draft?.entity_id ? [this.draft.entity_id] : [],
			suggestions: this.hotWater()?.switches
		}))?.selected[0];
		if (t) {
			let e = this.hass?.states[t]?.attributes.options ?? [], n = this.draft?.on_value;
			this.set({
				entity_id: t,
				on_value: e.length && !e.includes(String(n)) ? e.includes("now") ? "now" : e[0] : n ?? "on"
			});
		}
	}
	async pickSensor() {
		let e = this.t, t = await P(this, {
			heading: e("action.pick.sensor"),
			tip: "a_sensor",
			filter: "temperature",
			selected: this.draft?.sensor_entity ? [this.draft.sensor_entity] : [],
			suggestions: this.hotWater()?.sensors
		});
		t?.selected[0] && this.set({ sensor_entity: t.selected[0] });
	}
	async addCondition() {
		let e = this.t, t = (await P(this, {
			heading: e("action.pick.condition"),
			tip: "a_conditions",
			filter: "any",
			selected: []
		}))?.selected[0];
		if (t && this.draft) {
			let e = this.hass?.states[t]?.state, n = e === "on" || e === "off" ? e === "on" : e ?? "";
			this.set({ conditions: [...this.draft.conditions, {
				entity_id: t,
				op: "eq",
				value: n
			}] });
		}
	}
	setCondition(e, t) {
		if (!this.draft) return;
		let n = this.draft.conditions.map((n, r) => r === e ? {
			...n,
			...t
		} : n);
		this.set({ conditions: n });
	}
	removeCondition(e) {
		this.draft && this.set({ conditions: this.draft.conditions.filter((t, n) => n !== e) });
	}
	set(e) {
		this.draft && (this.draft = {
			...this.draft,
			...e
		}, this.problem = "");
	}
	async save() {
		let e = this.draft, t = this.t;
		if (!e) return;
		if (!e.entity_id) {
			this.problem = t("action.problem.entity");
			return;
		}
		if (e.kind === "target" && !e.sensor_entity) {
			this.problem = t("action.problem.sensor");
			return;
		}
		let { id: n, ...r } = e;
		this.saving = !0;
		let i = await N(this, { actions: { [n]: r } });
		this.saving = !1, i && this.close();
	}
	async deleteAction() {
		this.existing && await N(this, { actions: { [this.existing.id]: null } }) && this.close();
	}
	close() {
		this.dispatchEvent(new CustomEvent("joe-close", {
			bubbles: !0,
			composed: !0
		}));
	}
};
e([y({ attribute: !1 })], R.prototype, "hass", void 0), e([y({ attribute: !1 })], R.prototype, "mailboxes", void 0), e([y({ attribute: !1 })], R.prototype, "accounts", void 0), e([y({ attribute: !1 })], R.prototype, "apps", void 0), e([y({ attribute: !1 })], R.prototype, "t", void 0), e([y({ attribute: !1 })], R.prototype, "config", void 0), e([y({ attribute: !1 })], R.prototype, "discovery", void 0), e([y()], R.prototype, "actionId", void 0), e([y()], R.prototype, "section", void 0), e([y()], R.prototype, "consumer", void 0), e([s()], R.prototype, "draft", void 0), e([s()], R.prototype, "saving", void 0), e([s()], R.prototype, "problem", void 0), f("joe-action-editor", R);
//#endregion
//#region src/types.ts
var rt = [
	"welcome",
	"scan",
	"questions",
	"done"
], it = [
	"min_soc",
	"grid_charge",
	"charge_target",
	"mode",
	"charge_power",
	"discharge_power",
	"discharge_limit",
	"discharge_limit_enabled"
], at = [
	"normal",
	"force_charge",
	"hold",
	"force_discharge"
], ot = [
	"home_office",
	"office",
	"travel",
	"vacation",
	"guests",
	"home"
], st = [
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
function ct(e) {
	let t = e.filter((e) => e.kind !== "submeter" && (e.kind === "ev" && (e.runs ?? "auto") !== "always" || e.runs === "surplus" || e.runs === "cheap")), n = new Set(t.map((e) => e.energy_entity).filter(Boolean));
	return t.filter((e) => !e.included_in || !n.has(e.included_in));
}
var lt = [
	"forecast",
	"consumption",
	"battery",
	"hot_water",
	"car"
], ut = [
	"normal",
	"holiday",
	"away",
	"home_office"
], dt = ["heat", "cool"], ft = {
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
}, pt = [
	"charge",
	"hold",
	"release"
];
function mt(e) {
	let t = (...t) => t.every((t) => !!e.controls[t]), n = (t) => !!e.mode_options[t], r = [];
	t("mode") && n("force_charge") && r.push("mode"), t("grid_charge", "charge_target") && r.push("target"), t("grid_charge", "min_soc") && r.push("min_soc");
	let i = [];
	return t("min_soc") && i.push("min_soc"), t("mode") && n("hold") && i.push("mode_hold"), t("mode", "charge_power") && n("force_charge") && i.push("standby"), t("discharge_limit") && i.push("limit"), {
		charge: r,
		hold: i
	};
}
var ht = class extends b {
	static {
		this.styles = [T, x`
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
		if (!e || !t) return o;
		let n = [
			"watch",
			...this.profileKey ? ["profile"] : [],
			"generic",
			"steps"
		], r = this.found?.suggested;
		return E`<div class="choose">
        <div class="seg" role="group" aria-label=${e("f.battery.control")}>
          ${n.map((t) => E`<button type="button" aria-pressed=${String(this.choice === t)} @click=${() => this.choose(t)}>
                ${t === "profile" ? e("f.battery.control.profile", { name: this.profiles?.[this.profileKey ?? ""] ?? this.profileKey ?? "" }) : e(`f.battery.control.${t}`)}
              </button>`)}
        </div>
      </div>
      ${this.choice === "watch" && r?.complete ? E`<div class="note" data-tipped>
            <ha-icon icon="mdi:lightbulb-on-outline"></ha-icon>
            <span
              >${e("f.battery.control.suggested")}
              <div class="note-actions">
                <button type="button" class="mini-btn go" @click=${this.takeSuggestion}>${e("f.battery.control.take")}</button>
                ${C(e, "control_roles")}
              </div></span
            >
          </div>` : o}
      ${this.choice === "profile" && Object.keys(t.steps).length && !Object.keys(t.controls).length ? this.renderServiceSteps(e, t) : this.choice === "profile" || this.choice === "generic" ? this.renderRoles(e, t) : o}
      ${this.choice === "steps" ? this.renderSteps(e, t) : o}
      ${this.choice === "watch" ? o : E`<p class="field-hint">${e("f.battery.control.retest")}</p>`}`;
	}
	renderRoles(e, t) {
		let n = this.hass, r = mt(t), a = r.charge.length && r.hold.length, s = t.controls.mode, c = s ? n.states[s]?.attributes.options ?? [] : [];
		return E`<div data-tipped>
      <div class="sub">${e("f.battery.control.levers")} ${C(e, "control_roles")}</div>
      <div class="rows">
        ${it.map((r) => {
			let a = t.controls[r];
			return E`<div class="row">
            <span class="label">${e(`role.${r}`)}</span>
            <span class="entity">
              ${a ? E`<b>${_(n, a)}</b><small>${i(n, a, e.lang)}</small>` : E`<small>${e("find.none")}</small>`}
            </span>
            <span class="buttons">
              <button type="button" class="mini-btn" @click=${() => this.pickRole(r)}>
                <ha-icon icon="mdi:magnify"></ha-icon>${e(a ? "review.change" : "review.choose")}
              </button>
              ${a ? E`<button
                    type="button"
                    class="icon-btn"
                    aria-label=${e("f.remove")}
                    title=${e("f.remove")}
                    @click=${() => this.setRole(r, null)}
                  >
                    <ha-icon icon="mdi:close"></ha-icon>
                  </button>` : o}
            </span>
          </div>`;
		})}
      </div>
      </div>
      ${s ? E`<div data-tipped>
            <div class="sub">${e("f.battery.mode_options")} ${C(e, "mode_options")}</div>
            <div class="rows">
              ${at.map((n) => E`<div class="row">
                  <label for="opt-${n}">${e(`meaning.${n}`)}</label>
                  <select
                    id="opt-${n}"
                    class="input"
                    @change=${(e) => this.setOption(n, e.target.value)}
                  >
                    <option value="" ?selected=${!t.mode_options[n]}>${e("meaning.none")}</option>
                    ${c.map((e) => E`<option value=${e} ?selected=${t.mode_options[n] === e}>${e}</option>`)}
                  </select>
                  <span></span>
                </div>`)}
            </div>
            </div>` : o}
      <div class="note ${a ? "" : "warn"} ready">
        <ha-icon icon=${a ? "mdi:check-circle-outline" : "mdi:alert-outline"}></ha-icon>
        <span
          >${a ? e("f.battery.control.ready", {
			charge: r.charge.map((t) => e(`method.${t}`)).join(", "),
			hold: r.hold.map((t) => e(`method.${t}`)).join(", ")
		}) : e("f.battery.control.needs")}</span
        >
      </div>`;
	}
	renderServiceSteps(e, t) {
		let n = this.hass;
		return E`<div data-tipped>
      <div class="sub">${e("f.battery.control.services")} ${C(e, "control_steps")}</div>
      <div class="rows">
        ${pt.flatMap((r) => (t.steps[r] ?? []).map((t) => E`<div class="row">
              <span class="label">${e(`f.battery.steps.${r}`)}</span>
              <span class="entity">
                ${t.service ? E`<b>${t.service}</b>` : E`<b>${_(n, t.entity_id ?? "")}</b><small>${String(t.value ?? "")}</small>`}
              </span>
              <span></span>
            </div>`))}
      </div>
    </div>`;
	}
	renderSteps(e, t) {
		let n = this.hass;
		return E`<div class="sub" data-tipped>${e("f.battery.control.steps")} ${C(e, "control_steps")}</div>
      <p class="field-hint">${e("f.battery.steps.hint")}</p>
      ${pt.map((r) => {
			let i = t.steps[r] ?? [];
			return E`<div class="sub">${e(`f.battery.steps.${r}`)}</div>
          <div class="rows" data-tipped>
            ${i.map((t, i) => E`<div class="row">
                <span class="entity"
                  ><b>${t.service ?? _(n, t.entity_id ?? "")}</b><small>${t.entity_id ?? ""}</small></span
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
                  ${this.valueHints(t.entity_id ?? "", r).map((e) => E`<option value=${e}></option>`)}
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
              ${C(e, "control_steps")}
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
		let t = this.t, n = this.value.controls[e], r = await P(this, {
			heading: t("pick.role.title", { role: t(`role.${e}`) }),
			tip: "control_roles",
			filter: ft[e],
			selected: n ? [n] : [],
			suggestions: this.nearby(ft[e]).map((e) => ({ entity_id: e }))
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
		let t = this.t, n = (await P(this, {
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
e([y({ attribute: !1 })], ht.prototype, "hass", void 0), e([y({ attribute: !1 })], ht.prototype, "t", void 0), e([y({ attribute: !1 })], ht.prototype, "battery", void 0), e([y({ attribute: !1 })], ht.prototype, "found", void 0), e([y({ attribute: !1 })], ht.prototype, "value", void 0), e([y({ attribute: !1 })], ht.prototype, "profiles", void 0), f("joe-battery-control", ht);
//#endregion
//#region src/editors/battery-editor.ts
var gt = [
	"name",
	"capacity_kwh",
	"soc_entity",
	"power",
	"max_charge_w",
	"max_discharge_w",
	"floor_soc",
	"priority",
	"adapter",
	"controls",
	"mode_options",
	"prepare",
	"steps"
], z = class extends b {
	constructor(...e) {
		super(...e), this.batteryId = "", this.capacityUnknown = !1, this.saving = !1;
	}
	static {
		this.styles = [T, x`
      :host {
        display: block;
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
      .toggle {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .toggle label {
        font-weight: 600;
        cursor: pointer;
      }
      @media (max-width: 480px) {
        .limits {
          grid-template-columns: 1fr;
        }
      }
    `];
	}
	get battery() {
		return this.config?.batteries.find((e) => e.id === this.batteryId);
	}
	willUpdate(e) {
		let t = this.battery;
		(e.has("config") || e.has("batteryId")) && t && !this.draft && (this.draft = Object.fromEntries(gt.map((e) => [e, structuredClone(t[e])])), this.capacityUnknown = this.config?.answers[`capacity:${t.id}`] === "unknown");
	}
	render() {
		let { t: e, hass: t, config: n, draft: r } = this, s = this.battery;
		if (!e || !t || !n || !r || !s) return o;
		let c = this.discovery?.batteries.find((e) => e.id === s.id), l = _e(t, s.capacity_entity);
		return E`<div class="sheet-title">${a(e("edit.battery.title", { name: s.name }))}</div>
      ${this.field(e("f.battery.name"), "f_battery_name", E`<input
          class="input"
          type="text"
          maxlength="60"
          .value=${r.name}
          @change=${(e) => this.set({ name: e.target.value.trim() || s.name })}
        />`)}
      ${this.field(e("f.battery.capacity"), "q_capacity", E`<div class="field-row">
            <span class="unit-input">
              <input
                class="input"
                type="number"
                inputmode="decimal"
                min="0.1"
                max="1000"
                step="0.01"
                .value=${r.capacity_kwh == null ? "" : String(r.capacity_kwh)}
                placeholder=${l == null ? e("f.unknown") : v(e.lang, l, 2)}
                @change=${(e) => {
			let t = Number.parseFloat(e.target.value);
			this.capacityUnknown = !1, this.set({ capacity_kwh: Number.isFinite(t) && t > 0 ? t : null });
		}}
              />
              <span class="unit">kWh</span>
            </span>
            <button
              type="button"
              class="mini-btn ${this.capacityUnknown ? "go" : ""}"
              aria-pressed=${String(this.capacityUnknown)}
              @click=${() => {
			this.capacityUnknown = !this.capacityUnknown, this.capacityUnknown && this.set({ capacity_kwh: null });
		}}
            >
              ${e("ask.idk_learn")}
            </button>
          </div>
          ${l == null ? o : E`<p class="field-hint">${e("f.battery.capacity.read", { value: v(e.lang, l, 2) })}</p>`}`, g(e, j(n, `batteries[${s.id}].capacity_kwh`)))}
      ${this.field(e("f.battery.soc"), "f_battery_soc", this.entityBox(e, r.soc_entity, `${i(t, r.soc_entity, e.lang)}`, () => this.pickSoc()), g(e, j(n, `batteries[${s.id}].soc_entity`)))}
      ${this.field(e("f.battery.power"), "f_battery_power", this.entityBox(e, r.power?.entity_id ?? null, this.powerText(e, r.power), () => this.pickPower()), g(e, j(n, `batteries[${s.id}].power`)))}
      ${this.field(e("f.battery.limits"), "f_battery_limits", E`<div class="limits">
          <label>${e("f.battery.max_charge")} ${this.kwInput(e, r.max_charge_w, "max_charge_w")}</label>
          <label>${e("f.battery.max_discharge")} ${this.kwInput(e, r.max_discharge_w, "max_discharge_w")}</label>
        </div>`)}
      ${this.field(e("f.battery.floor"), "f_battery_floor", E`<span class="unit-input">
            <input
              class="input"
              type="number"
              inputmode="decimal"
              min="0"
              max="100"
              step="1"
              aria-label=${e("f.battery.floor")}
              .value=${r.floor_soc == null ? "" : String(r.floor_soc)}
              placeholder=${this.floor?.device == null ? e("f.unknown") : v(e.lang, this.floor.device, 0)}
              @change=${(e) => {
			let t = Number.parseFloat(e.target.value.replace(",", "."));
			this.set({ floor_soc: Number.isFinite(t) ? Math.min(100, Math.max(0, t)) : null });
		}}
            />
            <span class="unit">%</span>
          </span>
          ${this.floor?.device == null ? r.floor_soc == null ? E`<div class="note warn"><ha-icon icon="mdi:help-circle-outline"></ha-icon><span>${e("f.battery.floor.ask")}</span></div>` : o : E`<p class="field-hint">${e("f.battery.floor.read", { value: v(e.lang, this.floor.device, 0) })}</p>`}`, g(e, j(n, `batteries[${s.id}].floor_soc`)))}
      ${n.batteries.length > 1 ? this.field(e("f.battery.priority"), "f_battery_priority", E`<span class="unit-input">
              <input
                class="input"
                type="number"
                min="1"
                max="9"
                step="1"
                .value=${String(r.priority)}
                @change=${(e) => {
			let t = Math.round(Number.parseFloat(e.target.value));
			this.set({ priority: Math.min(9, Math.max(1, Number.isFinite(t) ? t : 1)) });
		}}
              />
            </span>`) : o}
      <div class="field" data-tipped>
        <div class="field-label">${e("f.battery.control")} ${C(e, "control_choice")}</div>
        <joe-battery-control
          .hass=${t}
          .t=${e}
          .battery=${s}
          .found=${c}
          .profiles=${this.info?.profiles}
          .value=${{
			adapter: r.adapter,
			controls: r.controls,
			mode_options: r.mode_options,
			steps: r.steps
		}}
          @joe-control-change=${(e) => this.set(this.withPrepare(e.detail, c))}
        ></joe-battery-control>
      </div>
      <div class="actions" data-notip>
        <button type="button" class="btn btn-primary" ?disabled=${this.saving} @click=${this.save}>${e("common.save")}</button>
        <button type="button" class="btn btn-ghost" @click=${this.close}>${e("common.cancel")}</button>
      </div>`;
	}
	field(e, t, n, r) {
		let i = this.t;
		return E`<div class="field" data-tipped>
      <div class="field-label">${e} ${C(i, t)} ${r ?? o}</div>
      ${n}
    </div>`;
	}
	entityBox(e, t, n, r) {
		let i = this.hass;
		return E`<div class="entity">
      <span>
        ${t ? E`<b>${_(i, t)}</b><small>${n}</small>` : E`<small>${e("find.none")}</small>`}
      </span>
      <button type="button" class="mini-btn" @click=${r}>
        <ha-icon icon="mdi:magnify"></ha-icon>${e(t ? "review.change" : "review.choose")}
      </button>
    </div>`;
	}
	kwInput(e, t, n) {
		return E`<span class="unit-input">
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
			let t = Number.parseFloat(e.target.value);
			this.set({ [n]: Number.isFinite(t) && t > 0 ? Math.round(t * 1e3) : null });
		}}
      />
      <span class="unit">kW</span>
    </span>`;
	}
	powerText(e, t) {
		let n = this.hass, a = r(n, t);
		if (!t || a === null) return t ? i(n, t.entity_id, e.lang) : "";
		let o = v(e.lang, Math.abs(a), 2);
		return e(a >= 0 ? "pick.preview.charge" : "pick.preview.discharge", { value: o });
	}
	async pickSoc() {
		let { t: e, draft: t } = this;
		if (!e || !t) return;
		let n = await P(this, {
			heading: e("pick.battery.title"),
			tip: "pick_battery",
			filter: "soc",
			selected: [t.soc_entity]
		});
		n?.selected[0] && this.set({ soc_entity: n.selected[0] });
	}
	async pickPower() {
		let { t: e, draft: t } = this;
		if (!e || !t) return;
		let n = await P(this, {
			heading: e("pick.battery_power.title"),
			tip: "pick_battery_power",
			filter: "power",
			selected: t.power ? [t.power.entity_id] : [],
			measurement: {
				invert: t.power?.invert ?? !1,
				role: "battery"
			}
		});
		n?.selected[0] && this.set({ power: {
			entity_id: n.selected[0],
			invert: n.invert,
			minus_entity_id: null
		} });
	}
	withPrepare(e, t) {
		let n = ![
			"none",
			"generic",
			"steps"
		].includes(e.adapter), r = n ? this.battery?.adapter === e.adapter ? this.battery.prepare : t?.prepare ?? [] : [], i = n && !Object.keys(e.steps).length ? t?.steps ?? e.steps : e.steps;
		return {
			...e,
			steps: i,
			prepare: r ?? []
		};
	}
	set(e) {
		this.draft &&= {
			...this.draft,
			...e
		};
	}
	async save() {
		let e = this.battery, t = this.draft;
		if (!e || !t || !this.config) return;
		let n = {};
		for (let r of gt) JSON.stringify(e[r]) !== JSON.stringify(t[r]) && (n[r] = t[r]);
		let r = `capacity:${e.id}`, i = this.config.answers[r] === "unknown", a = {};
		if (Object.keys(n).length && (a.batteries = { [e.id]: n }), i !== this.capacityUnknown && (a.answers = { [r]: this.capacityUnknown ? "unknown" : null }), Object.keys(a).length) {
			this.saving = !0;
			let e = await N(this, a);
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
e([y({ attribute: !1 })], z.prototype, "hass", void 0), e([y({ attribute: !1 })], z.prototype, "t", void 0), e([y({ attribute: !1 })], z.prototype, "config", void 0), e([y({ attribute: !1 })], z.prototype, "discovery", void 0), e([y({ attribute: !1 })], z.prototype, "info", void 0), e([y({ attribute: !1 })], z.prototype, "floor", void 0), e([y()], z.prototype, "batteryId", void 0), e([s()], z.prototype, "draft", void 0), e([s()], z.prototype, "capacityUnknown", void 0), e([s()], z.prototype, "saving", void 0), f("joe-battery-editor", z);
//#endregion
//#region src/editors/consumers.ts
var _t = ["auto", "always"], vt = [
	"auto",
	"surplus",
	"cheap"
], yt = class extends b {
	static {
		this.styles = [T, x`
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
      .empty {
        color: var(--joe-muted);
      }
      .head.sub {
        margin-top: 6px;
        font-weight: 600;
        color: var(--joe-ink-2);
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
		if (!e || !t || !n) return o;
		let r = [...n.consumers].sort((t, n) => Number(t.kind === "submeter") - Number(n.kind === "submeter") || t.name.localeCompare(n.name, e.lang));
		return E`<div data-tipped>
      <div class="head">${e("consumers.kind")} ${C(e, "f_consumer_kind")}</div>
      <div class="head sub">${e("consumers.runs")} ${C(e, "f_consumer_runs")}</div>
      ${r.length ? E`<ul>
            ${r.map((r) => this.renderConsumer(e, t, n, r))}
          </ul>` : E`<p class="empty">${e("consumers.empty")}</p>`}
    </div>`;
	}
	renderConsumer(e, t, n, r) {
		let a = r.power_entity ? i(t, r.power_entity, e.lang) : "";
		return E`<li>
      <div>
        <b>${r.name}</b>
        <small>${g(e, j(n, `consumers[${r.id}].kind`))}${a}</small>
      </div>
      <div class="selects">
        <select
          class="input"
          aria-label=${e("consumers.kind_of", { name: r.name })}
          .value=${r.kind}
          @change=${(e) => this.setKind(r, e.target.value)}
        >
          ${st.map((t) => E`<option value=${t} ?selected=${t === r.kind}>${e(`kind.${t}`)}</option>`)}
        </select>
        ${r.kind === "submeter" ? o : E`<select
              class="input"
              aria-label=${e("consumers.runs_of", { name: r.name })}
              .value=${r.runs ?? "auto"}
              @change=${(e) => this.setRuns(r, e.target.value)}
            >
              ${r.kind === "ev" ? _t.map((t) => E`<option value=${t} ?selected=${t === (r.runs ?? "auto")}>${e(`runs.ev.${t}`)}</option>`) : vt.map((t) => E`<option value=${t} ?selected=${t === (r.runs ?? "auto")}>${e(`runs.${t}`)}</option>`)}
            </select>`}
      </div>
    </li>`;
	}
	setRuns(e, t) {
		t !== (e.runs ?? "auto") && N(this, { consumers: { [e.id]: { runs: t } } });
	}
	setKind(e, t) {
		t !== e.kind && N(this, { consumers: { [e.id]: { kind: t } } });
	}
};
e([y({ attribute: !1 })], yt.prototype, "hass", void 0), e([y({ attribute: !1 })], yt.prototype, "t", void 0), e([y({ attribute: !1 })], yt.prototype, "config", void 0), f("joe-consumers", yt);
//#endregion
//#region src/components/choice.ts
var bt = "unknown", xt = class extends b {
	constructor(...e) {
		super(...e), this.options = [], this.value = [], this.multiple = !1, this.exclusive = [], this.idk = "", this.label = "", this.compact = !1;
	}
	static {
		this.styles = x`
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
		return E`<div class="opts" role="group" aria-label=${this.label}>
      ${this.options.map((e) => this.renderOption(e))}
      ${this.idk ? this.renderOption({
			value: bt,
			label: this.idk
		}, "idk") : o}
    </div>`;
	}
	renderOption(e, t = "") {
		let n = this.value.includes(e.value);
		return E`<button
      type="button"
      class=${t}
      aria-pressed=${String(n)}
      ?disabled=${e.disabled}
      @click=${() => this.toggle(e.value)}
    >
      ${e.icon ? E`<ha-icon icon=${e.icon}></ha-icon>` : o}
      <span>${e.label}</span>
      ${n && this.multiple ? E`<span class="tick" aria-hidden="true"
            ><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12.5l4.5 4.5L19 7.5" /></svg
          ></span>` : o}
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
e([y({ attribute: !1 })], xt.prototype, "options", void 0), e([y({ attribute: !1 })], xt.prototype, "value", void 0), e([y({ type: Boolean })], xt.prototype, "multiple", void 0), e([y({ attribute: !1 })], xt.prototype, "exclusive", void 0), e([y()], xt.prototype, "idk", void 0), e([y()], xt.prototype, "label", void 0), e([y({
	type: Boolean,
	reflect: !0
})], xt.prototype, "compact", void 0), f("joe-choice", xt);
//#endregion
//#region src/editors/tariff-form.ts
var St = class extends b {
	constructor(...e) {
		super(...e), this.feedIn = !1, this.asQuestion = !1;
	}
	static {
		this.styles = [T, x`
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
		if (!e || !t) return o;
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
		], r = E`<joe-choice
      .options=${n}
      .value=${t.kind === "unknown" ? [] : [t.kind]}
      idk=${e("ask.idk")}
      label=${e("f.tariff.kind")}
      @joe-choice=${(e) => this.emit({ kind: e.detail.value[0] ?? "unknown" })}
    ></joe-choice>`;
		return E`${this.asQuestion ? r : E`<div class="field" data-tipped>
            <div class="field-label">${e("f.tariff.kind")} ${C(e, "q_tariff")}</div>
            ${r}
          </div>`}
      ${t.kind === "fixed_window" ? this.renderWindow(e, t) : o}
      ${t.kind === "flat" ? this.renderFlat(e, t) : o}
      ${t.kind === "dynamic" ? this.renderDynamic(e, t) : o}
      ${this.feedIn ? this.renderFeedIn(e, t) : o}`;
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
		return E`<div class="field" data-tipped>
        <div class="field-label">${e("f.window")} ${C(e, "f_window")}</div>
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
        <div class="field-label">${e("f.prices")} ${C(e, "f_prices")}</div>
        <div class="field-row">
          <label class="price">${e("f.price.night")} ${this.centInput(e, t.night_price, "night_price")}</label>
          <label class="price">${e("f.price.day")} ${this.centInput(e, t.day_price, "day_price")}</label>
        </div>
      </div>`;
	}
	renderFlat(e, t) {
		return E`<div class="field" data-tipped>
      <div class="field-label">${e("f.price")} ${C(e, "f_prices")}</div>
      ${this.centInput(e, t.day_price, "day_price")}
    </div>`;
	}
	renderDynamic(e, t) {
		let n = this.hass, r = t.price_entity, a = t.window ?? {
			start: "20:00",
			end: "07:00"
		}, o = (e, t) => {
			let n = {
				...a,
				[e]: t
			};
			this.emit({ window: n.start && n.end ? n : null });
		};
		return E`<div class="field" data-tipped>
        <div class="field-label">${e("f.price_entity")} ${C(e, "f_price_entity")}</div>
        <div class="entity">
          ${r && n ? E`<span><b>${_(n, r)}</b> <small>${i(n, r, e.lang)}</small></span>` : E`<small>${e("f.price_entity.none")}</small>`}
          <button type="button" class="mini-btn" @click=${this.pickPrice}>
            <ha-icon icon="mdi:magnify"></ha-icon>${e(r ? "review.change" : "review.choose")}
          </button>
        </div>
      </div>
      <div class="field" data-tipped>
        <div class="field-label">${e("f.search")} ${C(e, "f_search")}</div>
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
        <div class="field-label">${e("f.surcharge")} ${C(e, "f_surcharge")}</div>
        ${this.centInput(e, t.surcharge, "surcharge")}
      </div>`;
	}
	renderFeedIn(e, t) {
		let n = this.hass;
		return E`<div class="field" data-tipped>
      <div class="field-label">${e("f.feed_in")} ${C(e, "q_feed_in")}</div>
      ${t.feed_in_entity && n ? E`<p class="field-hint">
            ${e("f.feed_in.entity", { name: _(n, t.feed_in_entity) })}
          </p>` : this.centInput(e, t.feed_in_price, "feed_in_price")}
    </div>`;
	}
	centInput(e, t, n) {
		return E`<span class="unit-input">
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
		let n = this.discovery?.tariff, r = (await P(this, {
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
e([y({ attribute: !1 })], St.prototype, "hass", void 0), e([y({ attribute: !1 })], St.prototype, "t", void 0), e([y({ attribute: !1 })], St.prototype, "tariff", void 0), e([y({ attribute: !1 })], St.prototype, "discovery", void 0), e([y({ type: Boolean })], St.prototype, "feedIn", void 0), e([y({ type: Boolean })], St.prototype, "asQuestion", void 0), f("joe-tariff-form", St);
//#endregion
//#region src/editors/tariff-editor.ts
var Ct = [
	"kind",
	"price_entity",
	"window",
	"night_price",
	"day_price",
	"feed_in_price",
	"feed_in_entity"
];
function wt(e, t) {
	let n = {};
	for (let r of Ct) JSON.stringify(e[r]) !== JSON.stringify(t[r]) && (n[r] = t[r]);
	return n;
}
var Tt = class extends b {
	constructor(...e) {
		super(...e), this.saving = !1;
	}
	static {
		this.styles = [T, x`
      :host {
        display: block;
      }
      joe-tariff-form {
        margin-top: 18px;
      }
    `];
	}
	willUpdate(e) {
		e.has("config") && this.config && !this.draft && (this.draft = structuredClone(this.config.tariff));
	}
	render() {
		let { t: e, draft: t } = this;
		return !e || !t ? o : E`<div class="sheet-title">${a(e("edit.tariff.title"))}</div>
      <joe-tariff-form
        .hass=${this.hass}
        .t=${e}
        .tariff=${t}
        .discovery=${this.discovery}
        feedIn
        @joe-tariff=${(e) => {
			this.draft = {
				...t,
				...e.detail
			};
		}}
      ></joe-tariff-form>
      <div class="actions" data-notip>
        <button type="button" class="btn btn-primary" ?disabled=${this.saving} @click=${this.save}>
          ${e("common.save")}
        </button>
        <button type="button" class="btn btn-ghost" @click=${this.close}>${e("common.cancel")}</button>
      </div>`;
	}
	async save() {
		let { config: e, draft: t } = this;
		if (!e || !t) return;
		let n = wt(e.tariff, t);
		if (Object.keys(n).length) {
			this.saving = !0;
			let e = { tariff: n };
			"kind" in n && (e.answers = { tariff: t.kind });
			let r = await N(this, e);
			if (this.saving = !1, !r) return;
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
e([y({ attribute: !1 })], Tt.prototype, "hass", void 0), e([y({ attribute: !1 })], Tt.prototype, "t", void 0), e([y({ attribute: !1 })], Tt.prototype, "config", void 0), e([y({ attribute: !1 })], Tt.prototype, "discovery", void 0), e([s()], Tt.prototype, "draft", void 0), e([s()], Tt.prototype, "saving", void 0), f("joe-tariff-editor", Tt);
//#endregion
//#region node_modules/lit-html/directive.js
var Et = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, Dt = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), Ot = class {
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
}, { I: kt } = l, At = (e) => e, jt = (e) => e.strings === void 0, Mt = () => document.createComment(""), Nt = (e, t, n) => {
	let r = e._$AA.parentNode, i = t === void 0 ? e._$AB : t._$AA;
	if (n === void 0) n = new kt(r.insertBefore(Mt(), i), r.insertBefore(Mt(), i), e, e.options);
	else {
		let t = n._$AB.nextSibling, a = n._$AM, o = a !== e;
		if (o) {
			let t;
			n._$AQ?.(e), n._$AM = e, n._$AP !== void 0 && (t = e._$AU) !== a._$AU && n._$AP(t);
		}
		if (t !== i || o) {
			let e = n._$AA;
			for (; e !== t;) {
				let t = At(e).nextSibling;
				At(r).insertBefore(e, i), e = t;
			}
		}
	}
	return n;
}, Pt = (e, t, n = e) => (e._$AI(t, n), e), Ft = {}, It = (e, t = Ft) => e._$AH = t, Lt = (e) => e._$AH, Rt = (e) => {
	e._$AR(), e._$AA.remove();
}, zt = (e, t, n) => {
	let r = /* @__PURE__ */ new Map();
	for (let i = t; i <= n; i++) r.set(e[i], i);
	return r;
}, Bt = Dt(class extends Ot {
	constructor(e) {
		if (super(e), e.type !== Et.CHILD) throw Error("repeat() can only be used in text expressions");
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
		let i = Lt(e), { values: a, keys: o } = this.dt(t, n, r);
		if (!Array.isArray(i)) return this.ut = o, a;
		let s = this.ut ??= [], c = [], l, d, f = 0, p = i.length - 1, m = 0, h = a.length - 1;
		for (; f <= p && m <= h;) if (i[f] === null) f++;
		else if (i[p] === null) p--;
		else if (s[f] === o[m]) c[m] = Pt(i[f], a[m]), f++, m++;
		else if (s[p] === o[h]) c[h] = Pt(i[p], a[h]), p--, h--;
		else if (s[f] === o[h]) c[h] = Pt(i[f], a[h]), Nt(e, c[h + 1], i[f]), f++, h--;
		else if (s[p] === o[m]) c[m] = Pt(i[p], a[m]), Nt(e, i[f], i[p]), p--, m++;
		else if (l === void 0 && (l = zt(o, m, h), d = zt(s, f, p)), l.has(s[f])) {
			if (l.has(s[p])) {
				let t = d.get(o[m]), n = t === void 0 ? null : i[t];
				if (n === null) {
					let t = Nt(e, i[f]);
					Pt(t, a[m]), c[m] = t;
				} else c[m] = Pt(n, a[m]), Nt(e, i[f], n), i[t] = null;
				m++;
			} else Rt(i[p]), p--;
		} else Rt(i[f]), f++;
		for (; m <= h;) {
			let t = Nt(e, c[h + 1]);
			Pt(t, a[m]), c[m++] = t;
		}
		for (; f <= p;) {
			let e = i[f++];
			e !== null && Rt(e);
		}
		return this.ut = o, It(e, c), u;
	}
}), Vt = 1435, Ht = 1440;
function Ut(e, t) {
	let n = (t ?? "").trim();
	return !n || /^profile?\s*\d+$/i.test(n) ? e : `${e} ${n}`;
}
var Wt = {
	normal: "mdi:home-outline",
	holiday: "mdi:calendar-star",
	away: "mdi:home-export-outline",
	home_office: "mdi:laptop"
}, Gt = {
	all: 1,
	week_weekend: 2,
	each: 7
};
function Kt(e, t) {
	return e === "all" ? 0 : e === "week_weekend" ? t < 5 ? 0 : 1 : t;
}
function qt(e) {
	return `${String(Math.floor(e / 60)).padStart(2, "0")}:${String(e % 60).padStart(2, "0")}`;
}
function Jt(e) {
	let t = /^(\d{1,2}):(\d{2})/.exec(e);
	if (!t) return null;
	let n = Number(t[1]), r = Number(t[2]);
	return n < 24 && r < 60 ? n * 60 + r : null;
}
function Yt(e, t) {
	let n;
	for (let [r, i] of e) r <= t && (n = i);
	return n;
}
function Xt(e) {
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
function Zt(e, t, n, r) {
	let i = Math.round(e / t) * t;
	return Math.round(Math.min(r, Math.max(n, i)) * 10) / 10;
}
function Qt(e, t) {
	let n = (e) => e.map(([e, t]) => [e, t]), r = (t) => n(e.curves[Kt(e.split, t)] ?? e.curves[0]);
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
function $t(e) {
	let t = 0, n = -1;
	for (let r = 0; r < e.length; r++) {
		let i = e[r + 1]?.[0] ?? 1440;
		i - e[r][0] > n && (t = e[r][0], n = i - t);
	}
	if (n < 0) return null;
	let r = Math.min(Vt, Math.round((t + n / 2) / 15) * 15);
	return r > t && !e.some(([e]) => e === r) ? r : null;
}
function en(e) {
	if (e.length !== 6) return "count";
	let t = /* @__PURE__ */ new Set();
	for (let n of e) {
		for (let e of n.tags) {
			if (t.has(e)) return "tags";
			t.add(e);
		}
		if (n.curves.length !== Gt[n.split]) return "curves";
		for (let e of n.curves) {
			if (!e.length || e.length > 12 || e[0][0] !== 0) return "points";
			for (let t = 1; t < e.length; t++) if (e[t][0] <= e[t - 1][0] || e[t][0] % 5) return "points";
		}
	}
	return null;
}
//#endregion
//#region src/components/week-bar.ts
var tn = class extends b {
	constructor(...e) {
		super(...e), this.points = [], this.mode = "heat", this.now = null, this.compact = !1, this.lang = "en", this.label = "", this.offText = "off";
	}
	static {
		this.styles = x`
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
		return E`<div class="track">
        <div class="bar" role="img" aria-label=${this.label}>
          ${t.map(({ from: e, to: t, value: n }) => {
			let r = `left:${e / Ht * 100}%;width:${(t - e) / Ht * 100}%;`;
			return n === "off" ? E`<span class="seg off" style=${r}>${this.compact ? o : this.offText}</span>` : E`<span class="seg" style=${r + this.color(n)}>
              ${this.compact ? o : `${v(this.lang, n, 1)}°`}
            </span>`;
		})}
        </div>
        ${this.now == null ? o : E`<span class="now" style=${`left:${this.now / Ht * 100}%`}></span>`}
      </div>
      ${this.compact ? o : E`<div class="ticks" aria-hidden="true">
            ${[
			0,
			6,
			12,
			18,
			24
		].map((e) => E`<span style=${`left:${e / 24 * 100}%`}>${e}</span>`)}
          </div>`}`;
	}
	color(e) {
		let t = this.mode === "cool" ? (28 - e) / 10 : (e - 16) / 10, n = Math.round(25 + Math.min(1, Math.max(0, t)) * 75), r = this.mode === "cool" ? "cool" : "heat";
		return `background:color-mix(in srgb, var(--wk-${r}) ${n}%, var(--wk-${r}-weak));`;
	}
};
e([y({ attribute: !1 })], tn.prototype, "points", void 0), e([y()], tn.prototype, "mode", void 0), e([y({ attribute: !1 })], tn.prototype, "now", void 0), e([y({
	type: Boolean,
	reflect: !0
})], tn.prototype, "compact", void 0), e([y()], tn.prototype, "lang", void 0), e([y()], tn.prototype, "label", void 0), e([y()], tn.prototype, "offText", void 0), f("joe-week-bar", tn);
//#endregion
//#region src/editors/week-editor.ts
var nn = [
	"all",
	"week_weekend",
	"each"
], rn = "23:00", an = "06:30", on = {
	tab: "household",
	section: "days"
};
function sn(e, t, n = "long") {
	return new Intl.DateTimeFormat(e, {
		weekday: n,
		timeZone: "UTC"
	}).format(new Date(Date.UTC(2024, 0, 1 + t)));
}
var B = class extends b {
	constructor(...e) {
		super(...e), this.entityId = "", this.fetched = !1, this.failed = !1, this.drafts = {}, this.selected = {
			heat: 0,
			cool: 0
		}, this.open = 0, this.creating = !1, this.saving = !1, this.errors = {}, this.fitted = {}, this.loaded = !1, this.requested = !1;
	}
	static {
		this.styles = [T, x`
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
		e.has("entityId") && e.get("entityId") && (this.loaded = !1, this.requested = !1, this.fetched = !1, this.device = void 0, this.mode = void 0, this.drafts = {}, this.errors = {}, this.fitted = {}, this.notice = void 0, this.rowError = void 0), this.hass && !this.requested && (this.requested = !0, this.load()), (e.has("config") || e.has("entityId")) && this.config && this.entityId && !this.loaded && (this.loaded = !0, this.drafts = structuredClone(this.room?.week?.modes ?? {}), this.fitDrafts(dt), this.pickMode());
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
		this.fetched = !0, this.fitDrafts(dt), this.pickMode();
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
					let a = Zt(i, t, n, r);
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
		return dt.filter((e) => this.device?.hvac_modes.includes(e));
	}
	pickMode() {
		if (this.mode || !this.device || !this.loaded) return;
		let e = this.status?.rooms?.[this.entityId], t = this.hass?.states[this.entityId]?.state ?? this.device.state, n = [
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
		return Xt(this.hass?.config?.time_zone);
	}
	openToday() {
		let e = this.profiles?.[this.index];
		this.open = e ? Kt(e.split, this.now.weekday) : 0;
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
		if (!e || !this.config) return o;
		let n = E`<div class="sheet-title">${a(e("week.title"))}</div>`;
		if (!t) return E`${n}
        ${this.fetched ? E`<div class="note warn">
              <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e(this.failed ? "week.load_failed" : "week.device_missing")}</span>
            </div>` : E`<p class="field-hint">${e("week.loading")}</p>`}
        <div class="actions" data-notip>
          <button type="button" class="btn btn-secondary" @click=${this.close}>${e("mode.close")}</button>
        </div>`;
		let r = this.modes, i = this.mode, s = this.profiles;
		return E`${n}
      <div class="head">
        <b>${h(t.device_id, t.name, e("climate.open_device", { id: t.entity_id }))}</b>
        ${t.area ? E`<span class="chip">${t.area}</span>` : o}
      </div>
      ${r.length ? E`<div class="field" data-tipped>
            <div class="field-label">${e("week.modes")} ${C(e, "week_mode")}</div>
            <span class="seg" role="group" aria-label=${e("week.modes")}>
              ${r.map((t) => E`<button type="button" aria-pressed=${String(t === i)} @click=${() => this.setMode(t)}>
                  ${e(`week.mode.${t}`)}${this.errors[t] ? E`<span class="dot bad" title=${this.errors[t]}></span>` : this.isDirty(t) ? E`<span class="dot" title=${e("week.unsaved")}></span>` : o}
                </button>`)}
            </span>
          </div>` : E`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("week.no_modes")}</span></div>`}
      ${i ? s ? this.renderSet(e, i, s) : this.renderEmpty(e, i) : o}
      <div class="foot" data-notip>
        ${i && this.errors[i] ? E`<div class="note warn" role="alert">
              <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("week.save_failed", {
			mode: e(`week.mode.${i}`),
			error: this.errors[i]
		})}</span>
            </div>` : o}
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
          ${r.some((e) => this.isDirty(e)) ? E`<span class="chip warn">${e("week.unsaved")}</span>` : o}
        </div>
      </div>`;
	}
	renderEmpty(e, t) {
		return E`<div class="empty" data-tipped>
      <p>${e("week.empty", { mode: e(`week.mode.${t}`) })}</p>
      <span class="with-tip">
        <button type="button" class="btn btn-primary" ?disabled=${this.creating} @click=${() => void this.create(t)}>
          ${e(this.creating ? "week.creating" : "week.create")}
        </button>
        ${C(e, "week_create")}
      </span>
    </div>`;
	}
	renderSet(e, t, n) {
		let r = this.status?.rooms?.[this.entityId], i = r?.kind === "week" && r.mode === t ? r.profile?.index : void 0, a = this.now, s = this.index, c = n[s];
		return E`<div class="field" data-tipped>
        <div class="field-label">${e("week.profiles")} ${C(e, "week_profiles")}</div>
        <div class="tiles" role="group" aria-label=${e("week.profiles")}>
          ${n.map((n, r) => {
			let c = n.name || e("week.profile", { n: r + 1 });
			return E`<button
              type="button"
              class="tile"
              aria-pressed=${String(r === s)}
              @click=${() => this.select(r)}
            >
              <span class="tile-top">
                <span class="no" aria-hidden="true">${r + 1}</span>
                <span class="name">${c}</span>
                ${r === i ? E`<span class="running" role="img" aria-label=${e("week.running")} title=${e("week.running")}></span>` : o}
              </span>
              <span class="tile-tags">
                ${n.tags.map((t) => E`<span><ha-icon icon=${Wt[t]}></ha-icon>${e(`week.tag.${t}`)}</span>`)}
              </span>
              <joe-week-bar
                compact
                .points=${n.curves[Kt(n.split, a.weekday)] ?? n.curves[0] ?? []}
                .now=${a.minute}
                mode=${t}
                lang=${e.lang}
                label=${e("week.curve", { label: `${c}, ${e("week.today")}` })}
              ></joe-week-bar>
            </button>`;
		})}
        </div>
        ${n.some((e) => e.tags.includes("normal")) ? o : E`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("week.no_normal")}</span></div>`}
      </div>
      ${c ? this.renderProfile(e, t, n, c) : o}`;
	}
	renderProfile(e, t, n, r) {
		let i = this.index, a = this.status?.day, s = !a || a.home_office_available, c = a?.home_office_reason ?? "no_calendar";
		return E`<div class="profile">
      <div class="field" data-tipped>
        <div class="field-label"><label for="week-name">${e("week.name")}</label> ${C(e, "week_name")}</div>
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
        <div class="field-label">${e("week.tags")} ${C(e, "week_tags")}</div>
        <div class="tags" role="group" aria-label=${e("week.tags")}>
          ${ut.map((t) => {
			let i = r.tags.includes(t), a = t === "home_office" && !s && !i;
			return E`<button
              type="button"
              class="mini-btn tag-btn"
              aria-pressed=${String(i)}
              ?disabled=${a}
              title=${a ? e(`week.ho.${c}`) : ""}
              @click=${() => this.toggleTag(n, t)}
            >
              <ha-icon icon=${Wt[t]}></ha-icon>${e(`week.tag.${t}`)}
            </button>`;
		})}
        </div>
        ${s ? o : E`<p class="field-hint">${e(`week.ho.${c}`)}</p>
              <div>
                <a class="mini-btn quiet" href=${w(D, on)} @click=${O(on)}>
                  <ha-icon icon="mdi:calendar-text-outline"></ha-icon>${e("week.ho.rules")}
                </a>
              </div>`}
        ${r.tags.length ? o : E`<p class="field-hint">${e("week.untagged")}</p>`} ${this.noticeAt("tags")}
      </div>
      <div class="field" data-tipped>
        <div class="field-label">${e("week.days")} ${C(e, "week_split")}</div>
        <span class="seg full" role="group" aria-label=${e("week.days")}>
          ${nn.map((t) => E`<button type="button" aria-pressed=${String(r.split === t)} @click=${() => this.setSplit(t)}>
              ${e(`week.split.${t}`)}
            </button>`)}
        </span>
      </div>
      ${this.noticeAt("days")} ${this.renderGroups(e, t, r)}
    </div>`;
	}
	noticeAt(e) {
		return this.notice?.at === e ? E`<div class="note" role="status"><ha-icon icon="mdi:information-outline"></ha-icon><span>${this.notice.text}</span></div>` : o;
	}
	groupLabel(e, t, n) {
		return t === "all" ? e("week.group.all") : t === "week_weekend" ? e(n === 0 ? "week.group.weekdays" : "week.group.weekend") : sn(e.lang, n);
	}
	renderGroups(e, t, n) {
		let r = this.now, i = Kt(n.split, r.weekday), a = n.curves.length > 1, { step: s, min: c, max: l } = this.limits, u = this.room;
		return E`<div class="field" data-tipped>
      <div class="field-label">${e("week.points")} ${C(e, "week_points")}</div>
      <p class="field-hint">
        ${e("week.limits", {
			min: v(e.lang, c, 1),
			max: v(e.lang, l, 1),
			step: v(e.lang, s, 2)
		})}
      </p>
      ${this.fitted[t] ? E`<div class="note" role="status"><ha-icon icon="mdi:information-outline"></ha-icon><span>${e("week.fitted")}</span></div>` : o}
      ${u?.night_off ? E`<p class="field-hint">
            ${this.config?.climate?.night_by === "entity" ? e("week.night_entity", { until: u.night_until ?? an }) : e("week.night_time", {
			from: u.night_from ?? rn,
			until: u.night_until ?? an
		})}
          </p>` : o}
      <div class="groups">
        ${n.curves.map((u, d) => {
			let f = this.groupLabel(e, n.split, d), p = !a || this.open === d, m = E`<span class="day-label">
              ${a ? E`<ha-icon icon=${p ? "mdi:chevron-down" : "mdi:chevron-right"}></ha-icon>` : o}${f}
              ${d === i ? E`<span class="chip ok">${e("week.today")}</span>` : o}
            </span>
            <joe-week-bar
              .points=${u}
              .now=${d === i ? r.minute : null}
              mode=${t}
              lang=${e.lang}
              offText=${e("week.off")}
              label=${e("week.curve", { label: f })}
            ></joe-week-bar>`;
			return E`<div class="group ${p ? "open" : ""}">
            ${a ? E`<button type="button" class="group-head" aria-expanded=${String(p)} @click=${() => this.openGroup(d)}>${m}</button>` : E`<div class="group-head">${m}</div>`}
            ${p ? this.renderPoints(e, n, d, u, {
				step: s,
				min: c,
				max: l
			}) : o}
          </div>`;
		})}
      </div>
    </div>`;
	}
	renderPoints(e, t, n, r, i) {
		let { step: a, min: s, max: c } = i, l = v(e.lang, a, 2), u = this.rowError?.curve === n ? this.rowError : void 0;
		return E`<div class="points" role="list" aria-label=${e("week.points")}>
        ${Bt(r, ([e]) => e, ([t, r], i) => {
			let d = qt(t);
			return E`<div class="point" role="listitem">
              ${i === 0 ? E`<span class="time fixed" title=${e("week.point.first")}>00:00</span>` : E`<input
                    class="input time"
                    type="time"
                    step="300"
                    required
                    aria-label=${e("week.point.time")}
                    .value=${d}
                    @blur=${(e) => this.setTime(n, i, e.target)}
                    @keydown=${(e) => e.key === "Enter" && e.target.blur()}
                  />`}
              <span class="value">
                ${r === "off" ? E`<span class="off-text">${e("week.off")}</span>` : E`<button
                        type="button"
                        class="mini-btn step"
                        aria-label=${e("week.point.less", { step: l })}
                        ?disabled=${r <= s}
                        @click=${() => this.setValue(n, i, r - a)}
                      >
                        −
                      </button>
                      <input
                        class="input num"
                        type="number"
                        inputmode="decimal"
                        step=${a}
                        min=${s}
                        max=${c}
                        aria-label=${e("week.point.value", { time: d })}
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
                  aria-label=${e("week.point.off", { time: d })}
                  @click=${() => this.toggleOff(n, i)}
                ></button>
                <span aria-hidden="true">${e("week.off")}</span>
              </span>
              ${i === 0 ? E`<span class="del"></span>` : E`<button
                    type="button"
                    class="mini-btn quiet del"
                    aria-label=${e("week.point.delete", { time: d })}
                    title=${e("week.point.delete", { time: d })}
                    @click=${() => this.removePoint(n, i)}
                  >
                    <ha-icon icon="mdi:delete-outline"></ha-icon>
                  </button>`}
            </div>
            ${u?.point === i ? E`<p class="row-error" role="alert">${u.text}</p>` : o}`;
		})}
      </div>
      <div class="point-actions">
        <span class="with-tip" data-tipped>
          <button type="button" class="mini-btn" ?disabled=${r.length >= 12} @click=${() => this.addPoint(n)}>
            <ha-icon icon="mdi:plus"></ha-icon>${e("week.point.add")}
          </button>
          ${C(e, "week_add")}
        </span>
        ${t.curves.length > 1 ? this.renderCopy(e, t, n) : o}
      </div>
      ${r.length >= 12 ? E`<p class="field-hint">${e("week.point.max")}</p>` : o} ${this.noticeAt("points")}`;
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
				label: sn(e.lang, t)
			}))
		];
		return E`<span class="with-tip" data-tipped>
      <select
        class="input copy"
        aria-label=${e("week.copy")}
        @change=${(e) => {
			let t = e.target, i = r.find((e) => e.value === t.value);
			t.value = "", i && this.copyTo(n, i.value, i.label);
		}}
      >
        <option value="" selected disabled>${e("week.copy")}</option>
        ${r.map((e) => E`<option value=${e.value}>${e.label}</option>`)}
      </select>
      ${C(e, "week_copy")}
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
		e !== this.mode && (this.mode = e, this.notice = void 0, this.rowError = void 0, this.openToday());
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
			a >= 0 && (n[a].tags = n[a].tags.filter((e) => e !== t)), e.tags = ut.filter((n) => n === t || e.tags.includes(n));
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
			t.curves = Qt(t, e), t.split = e;
		});
		let i = Gt[e] > Gt[r] ? t("week.split.split") : r === "each" && e === "week_weekend" ? t("week.split.merged_days") : t("week.split.merged", { first: r === "each" ? sn(t.lang, 0) : t("week.group.weekdays") });
		this.notice = {
			text: i,
			at: "days"
		}, this.open = Kt(e, this.now.weekday);
	}
	setTime(e, t, n) {
		let r = this.t, i = this.profiles?.[this.index]?.curves[e];
		if (!i) return;
		let a = i[t][0], o = Jt(n.value);
		if (o == null) {
			n.value = qt(a);
			return;
		}
		let s = Math.min(Vt, Math.max(5, Math.round(o / 5) * 5));
		if (s === a) {
			n.value = qt(a);
			return;
		}
		if (i.some(([e], n) => n !== t && e === s)) {
			n.value = qt(a), this.rowError = {
				curve: e,
				point: t,
				text: r("week.point.duplicate", { time: qt(s) })
			};
			return;
		}
		n.value = qt(s), this.changeCurve(e, (e) => {
			e[t][0] = s;
		});
	}
	setValue(e, t, n) {
		let { step: r, min: i, max: a } = this.limits, o = Zt(n, r, i, a);
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
			o = Zt(Number(e ?? s ?? this.fallbackValue()), r, i, a);
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
		let r = $t(n);
		if (r == null) {
			this.notice = {
				text: t("week.point.no_room"),
				at: "points"
			};
			return;
		}
		let i = Yt(n, r) ?? this.fallbackValue();
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
					[e]: cn(t)
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
			let n = en(this.drafts[t]);
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
			let n = cn(t);
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
e([y({ attribute: !1 })], B.prototype, "hass", void 0), e([y({ attribute: !1 })], B.prototype, "t", void 0), e([y({ attribute: !1 })], B.prototype, "config", void 0), e([y({ attribute: !1 })], B.prototype, "status", void 0), e([y({ attribute: !1 })], B.prototype, "entityId", void 0), e([s()], B.prototype, "device", void 0), e([s()], B.prototype, "fetched", void 0), e([s()], B.prototype, "failed", void 0), e([s()], B.prototype, "drafts", void 0), e([s()], B.prototype, "mode", void 0), e([s()], B.prototype, "selected", void 0), e([s()], B.prototype, "open", void 0), e([s()], B.prototype, "notice", void 0), e([s()], B.prototype, "rowError", void 0), e([s()], B.prototype, "creating", void 0), e([s()], B.prototype, "saving", void 0), e([s()], B.prototype, "errors", void 0), e([s()], B.prototype, "fitted", void 0);
function cn(e) {
	return String(e?.message ?? e);
}
f("joe-week-editor", B);
//#endregion
//#region src/fonts.ts
var ln = [
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
function un() {
	if (document.getElementById("energy-joe-fonts")) return;
	let e = document.createElement("style");
	e.id = "energy-joe-fonts", e.textContent = ln.map(([e, t, n, r]) => `@font-face{font-family:"${e}";font-style:${n};font-weight:${t};font-display:swap;src:url("${be(`fonts/${r}.woff2`)}") format("woff2")}`).join("\n"), document.head.appendChild(e);
}
//#endregion
//#region node_modules/lit-html/async-directive.js
var dn = (e, t) => {
	let n = e._$AN;
	if (n === void 0) return !1;
	for (let e of n) e._$AO?.(t, !1), dn(e, t);
	return !0;
}, fn = (e) => {
	let t, n;
	do {
		if ((t = e._$AM) === void 0) break;
		n = t._$AN, n.delete(e), e = t;
	} while (n?.size === 0);
}, pn = (e) => {
	for (let t; t = e._$AM; e = t) {
		let n = t._$AN;
		if (n === void 0) t._$AN = n = /* @__PURE__ */ new Set();
		else if (n.has(e)) break;
		n.add(e), gn(t);
	}
};
function mn(e) {
	this._$AN === void 0 ? this._$AM = e : (fn(this), this._$AM = e, pn(this));
}
function hn(e, t = !1, n = 0) {
	let r = this._$AH, i = this._$AN;
	if (i !== void 0 && i.size !== 0) {
		if (t) {
			if (Array.isArray(r)) for (let e = n; e < r.length; e++) dn(r[e], !1), fn(r[e]);
			else r != null && (dn(r, !1), fn(r));
		} else dn(this, e);
	}
}
var gn = (e) => {
	e.type == Et.CHILD && (e._$AP ??= hn, e._$AQ ??= mn);
}, _n = class extends Ot {
	constructor() {
		super(...arguments), this._$AN = void 0;
	}
	_$AT(e, t, n) {
		super._$AT(e, t, n), pn(this), this.isConnected = e._$AU;
	}
	_$AO(e, t = !0) {
		e !== this.isConnected && (this.isConnected = e, e ? this.reconnected?.() : this.disconnected?.()), t && (dn(this, e), fn(this));
	}
	setValue(e) {
		if (jt(this._$Ct)) this._$Ct._$AI(e, this);
		else {
			let t = [...this._$Ct._$AH];
			t[this._$Ci] = e, this._$Ct._$AI(t, this, 0);
		}
	}
	disconnected() {}
	reconnected() {}
}, vn = /* @__PURE__ */ new WeakMap(), yn = Dt(class extends _n {
	render(e) {
		return o;
	}
	update(e, [t]) {
		let n = t !== this.G;
		return n && this.rt(void 0), (n || this.lt !== this.ct) && (this.G = t, this.ht = e.options?.host, this.rt(this.ct = e.element)), o;
	}
	rt(e) {
		if (this.G !== void 0) {
			if (this.isConnected || (e = void 0), typeof this.G == "function") {
				let t = this.ht ?? globalThis, n = vn.get(t);
				n === void 0 && (n = /* @__PURE__ */ new WeakMap(), vn.set(t, n)), n.get(this.G) !== void 0 && this.G.call(this.ht, void 0), n.set(this.G, e), e !== void 0 && this.G.call(this.ht, e);
			} else this.G.value = e;
		}
	}
	get lt() {
		return typeof this.G == "function" ? vn.get(this.ht ?? globalThis)?.get(this.G) : this.G?.value;
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
function bn(e) {
	e instanceof HTMLElement && requestAnimationFrame(() => {
		let t = e.parentElement;
		if (!t || t.scrollWidth <= t.clientWidth) return;
		let n = e.offsetLeft;
		(n < t.scrollLeft || n + e.offsetWidth > t.scrollLeft + t.clientWidth) && (t.scrollLeft = n - (t.clientWidth - e.offsetWidth) / 2);
	});
}
function xn() {}
var Sn = /* @__PURE__ */ new WeakSet();
function Cn(e) {
	if (!(e instanceof HTMLElement)) return;
	let t = () => {
		let t = [];
		e.scrollLeft > 4 && t.push("left"), e.scrollLeft + e.clientWidth < e.scrollWidth - 4 && t.push("right"), e.dataset.more = t.join(" ");
	};
	Sn.has(e) || (Sn.add(e), e.addEventListener("scroll", t, { passive: !0 }), new ResizeObserver(t).observe(e)), requestAnimationFrame(() => requestAnimationFrame(t));
}
function wn(e, t, n, r, i) {
	return E`<nav class="section-chips" aria-label=${e("nav.sections")} ${yn(Cn)}>
    ${r.map((e) => {
		let r = e.id === i, a = {
			tab: n,
			section: e.id
		};
		return E`<a
        class="section-chip ${r ? "on" : ""}"
        href=${w(t, a)}
        aria-current=${r ? "page" : "false"}
        @click=${O(a)}
        ${yn(r ? bn : xn)}
      >
        <ha-icon icon=${e.icon}></ha-icon>
        <span>${e.label}</span>
        ${e.count ? E`<span class="section-count">${e.count}</span>` : o}
        ${e.problem ? E`<i class="section-problem" aria-hidden="true"></i>` : o}
      </a>`;
	})}
  </nav>`;
}
//#endregion
//#region src/components/look-back.ts
function Tn(e, t, n = "EUR", r = !1) {
	return new Intl.NumberFormat(e.lang, {
		style: "currency",
		currency: n,
		signDisplay: r ? "exceptZero" : "auto"
	}).format(Math.abs(t) < .005 ? 0 : t);
}
function V(e, t, n = 1) {
	return new Intl.NumberFormat(e, {
		minimumFractionDigits: n,
		maximumFractionDigits: n
	}).format(t);
}
function En(e, t = "EUR") {
	return new Intl.NumberFormat(e, {
		style: "currency",
		currency: t
	}).formatToParts(0).find((e) => e.type === "currency")?.value ?? t;
}
function Dn(e) {
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
function H(e, t, n = "long") {
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
function On(e, t) {
	return t === 1 ? e("learn.nights.one") : e("learn.nights.many", { count: t });
}
//#endregion
//#region src/components/battery-automations.ts
var kn = class extends b {
	constructor(...e) {
		super(...e), this.batteries = "", this.mode = "", this.ready = {}, this.items = [], this.busy = !1, this.failed = !1;
	}
	static {
		this.styles = [T, x`
      :host {
        display: block;
        margin-top: 12px;
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
		e.has("batteries") && this.hass && this.load();
	}
	async load() {
		try {
			this.items = await this.hass?.callWS({ type: "energy_joe/automations" }) ?? [];
		} catch {
			this.items = [];
		}
	}
	on(e) {
		let t = this.hass?.states[e.entity_id];
		return t ? t.state === "on" : e.on;
	}
	render() {
		let e = this.t;
		if (!e || !this.items.length) return o;
		let t = this.items.filter((e) => this.on(e)), n = this.items.filter((e) => e.switched_off && !this.on(e)), r = (this.mode === "advisory" || this.mode === "live") && t.some((e) => e.writes.some((e) => this.ready[e.battery_id] === "ready"));
		return E`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:robot-outline"></ha-icon>${e("automations.title")}</div>
        ${C(e, "battery_automations")}
      </div>
      <p class="now">${e(t.length ? r ? "automations.lead" : "automations.lead_idle" : "automations.lead_off")}</p>
      <ul>
        ${this.items.map((t) => {
			let n = this.on(t), r = [...new Set(t.writes.map((e) => e.battery))].join(", ");
			return E`<li>
            <div class="row">
              <b>${t.name}</b>
              ${t.writes.some((e) => e.joe) ? E`<span class="chip">${e("automations.levers")}</span>` : o}
              <span class="chip ${n ? "warn" : "ok"}">${e(n ? "automations.on" : "automations.off")}</span>
            </div>
            ${t.writes.length ? E`<small>${e("automations.writes", {
				what: t.writes.map((e) => e.name).join(", "),
				batteries: r
			})}</small>` : E`<small>${e("automations.not_battery")}</small>`}
            ${t.switched_off && !n ? E`<small>
                  ${e("automations.switched_off", {
				day: H(e.lang, t.switched_off.at, "short"),
				time: t.switched_off.at.slice(11, 16)
			})}
                </small>` : o}
          </li>`;
		})}
      </ul>
      <div class="actions">
        ${t.length ? E`<button type="button" class="mini-btn ${r ? "go" : ""}" ?disabled=${this.busy} @click=${() => this.switch(!1)}>
              <ha-icon icon="mdi:pause-circle-outline"></ha-icon>${e("automations.all_off", { count: t.length })}
            </button>` : o}
        ${n.length ? E`<button type="button" class="mini-btn" ?disabled=${this.busy} @click=${() => this.switch(!0)}>
              <ha-icon icon="mdi:play-circle-outline"></ha-icon>${e("automations.back_on", { count: n.length })}
            </button>` : o}
      </div>
      ${this.failed ? E`<p class="bad">${e("automations.failed")}</p>` : o}
    </section>`;
	}
	async switch(e) {
		this.busy = !0, this.failed = !1;
		try {
			let t = await this.hass?.callWS({
				type: "energy_joe/automations/switch",
				on: e
			});
			this.items = t?.automations ?? this.items, this.failed = !!t?.failed.length;
		} catch {
			this.failed = !0;
		} finally {
			this.busy = !1;
		}
	}
};
e([y({ attribute: !1 })], kn.prototype, "hass", void 0), e([y({ attribute: !1 })], kn.prototype, "t", void 0), e([y()], kn.prototype, "batteries", void 0), e([y()], kn.prototype, "mode", void 0), e([y({ attribute: !1 })], kn.prototype, "ready", void 0), e([s()], kn.prototype, "items", void 0), e([s()], kn.prototype, "busy", void 0), e([s()], kn.prototype, "failed", void 0), f("joe-battery-automations", kn);
//#endregion
//#region src/components/car-need.ts
var An = class extends b {
	constructor(...e) {
		super(...e), this.roundTrip = !0, this.failed = !1;
	}
	static {
		this.styles = [T, x`
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
		if (!e || !t || !n) return o;
		let r = (t, n = 0) => v(e.lang, t ?? 0, n);
		if (!n.known) return E`<p>${e(n.soc != null && !n.capacity_kwh ? "need.unknown_capacity" : "need.unknown")}</p>`;
		let i = [];
		i.push(E`<p>
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
      </p>`), i.push(E`<p>
        ${e(`need.consumption.${n.consumption_source}`, {
			value: r(n.consumption, 1),
			temp: n.temp == null ? "–" : r(n.temp)
		})}${n.rain ? ` ${e("need.rain")}` : ""}
      </p>`), n.target_unit === "%" ? i.push(E`<p>${e("need.has_soc", {
			soc: r(n.soc),
			km: r(n.have_km),
			target: r(n.target)
		})}</p>`) : i.push(E`<p>${e("need.has_range", { km: r(n.have_km) })}</p>`);
		let a = n.missing_kwh ?? 0;
		return i.push(E`<p class="result">
        ${a >= .2 ? t.run && !t.manual ? e("need.charges", {
			kwh: r(a, 1),
			start: k(t.start)
		}) : e("need.missing", { kwh: r(a, 1) }) : e("need.enough")}
      </p>`), n.fits === !1 && i.push(E`<p>${e("need.too_far")}</p>`), E`${i} ${n.trips.length ? this.renderTrips(e, n.trips) : o}`;
	}
	renderTrips(e, t) {
		return E`<div data-tipped>
      <div class="head">${e("need.trips.title")} ${C(e, "need_trips")}</div>
      <ul>
        ${t.map((t) => E`<li>
            <span>${t.start.includes("T") ? k(t.start) : e("need.all_day")}</span>
            <span class="where">${t.location}</span>
            ${this.editing === t.location ? this.renderEdit(e, t) : E`<span class=${t.km == null ? "km unknown" : "km"}>
                    ${t.km == null ? e("need.km_unknown") : e(`need.km.${t.source ?? "zone"}`, { km: v(e.lang, t.km, 0) })}
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
      ${this.failed ? E`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("error.action")}</div>` : o}
    </div>`;
	}
	renderEdit(e, t) {
		let n = t.km == null ? "" : String(Math.round(t.km / (this.roundTrip ? 2 : 1)));
		return E`<form
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
e([y({ attribute: !1 })], An.prototype, "hass", void 0), e([y({ attribute: !1 })], An.prototype, "t", void 0), e([y({ attribute: !1 })], An.prototype, "action", void 0), e([y({ attribute: !1 })], An.prototype, "roundTrip", void 0), e([s()], An.prototype, "editing", void 0), e([s()], An.prototype, "failed", void 0), f("joe-car-need", An);
//#endregion
//#region src/pages/devices/all.ts
var jn = [
	"hold",
	"charge",
	"release"
], U = class extends b {
	constructor(...e) {
		super(...e), this.prefix = D, this.notice = "";
	}
	static {
		this.styles = [T, x`
      .car-need {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 10px;
      }
      .car-need span {
        flex: 1;
        min-width: 0;
        display: grid;
      }
      .car-need small {
        color: var(--joe-muted);
        font-size: 12.5px;
      }
      .car-cal {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 10px;
        padding: 8px 10px;
        border-radius: 10px;
        background: var(--joe-surface-2);
      }
      .car-cal .grow {
        flex: 1;
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
      .status .actions {
        margin-top: 14px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }
      .grid .card {
        margin-top: 0;
      }
      .figures {
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
        gap: 4px 16px;
        margin-top: 10px;
      }
      .figures b {
        font-family: var(--joe-display);
        font-style: italic;
        font-weight: 800;
        font-size: 40px;
        line-height: 1;
        font-variant-numeric: tabular-nums;
      }
      .figures b small {
        font-size: 0.5em;
        margin-left: 2px;
      }
      .figures span {
        color: var(--joe-ink-2);
        font-variant-numeric: tabular-nums;
      }
      .now {
        margin: 8px 0 0;
        font-weight: 600;
      }
      .note {
        margin-top: 10px;
      }
      .test {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        margin-top: 14px;
        padding-top: 12px;
        border-top: 1px solid var(--joe-line);
      }
      .test .chip {
        margin-right: auto;
      }
      .steps {
        list-style: none;
        margin: 10px 0 0;
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
      .setup {
        margin-top: 12px;
      }
      .toggle-label {
        margin-right: auto;
        font-weight: 600;
      }
      .card.add .actions {
        margin-top: 12px;
      }
      a.climate-link {
        display: flex;
        align-items: center;
        gap: 12px;
        min-height: 44px;
        color: inherit;
        text-decoration: none;
        transition: box-shadow 0.12s;
      }
      a.climate-link:hover {
        box-shadow: inset 0 0 0 1.5px var(--joe-amber);
      }
      a.climate-link > span {
        flex: 1;
        min-width: 0;
        display: grid;
      }
      a.climate-link b {
        font-weight: 600;
      }
      a.climate-link small {
        color: var(--joe-muted);
        font-size: 13px;
      }
      a.climate-link .chevron {
        color: var(--joe-muted);
      }
      .empty {
        margin: 10px 0 0;
        color: var(--joe-ink-2);
      }
      .sheet-text {
        margin: 12px 0 0;
        color: var(--joe-ink-2);
        line-height: 1.55;
      }
      @media (max-width: 900px) {
        .grid {
          grid-template-columns: 1fr;
        }
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
    `];
	}
	render() {
		let e = this.t, t = this.state;
		if (!e || !t) return o;
		let n = t.control;
		return E`<div class="wrap">
        <div class="intro">
          <div>
            ${a(e("devices.page.title"))} ${A}
            <p class="lead">${e("devices.lead")}</p>
          </div>
          <joe-pose name="switch"></joe-pose>
        </div>
        ${n ? this.renderStatus(e, t, n) : o}
        <div class="group-label">${e("devices.batteries")}</div>
        ${t.config.batteries.length ? E`<div class="grid">${t.config.batteries.map((t) => this.renderBattery(e, t, n))}</div>
              <joe-battery-automations
                .hass=${this.hass}
                .t=${e}
                batteries=${JSON.stringify(t.config.batteries)}
                mode=${t.mode}
                .ready=${n?.ready ?? {}}
              ></joe-battery-automations>` : E`<p class="empty">${e("devices.batteries.none")}</p>`}
        <div class="group-label">${e("devices.actions")}</div>
        <div class="grid">
          ${t.config.actions.map((n) => this.renderAction(e, t, n))} ${this.renderLonelyCars(e, t)}
          ${this.renderAddAction(e)}
        </div>
        ${this.renderClimate(e, t)}
      </div>
      ${this.confirm ? this.renderConfirm(e, this.confirm) : o}`;
	}
	renderClimate(e, t) {
		let n = t.config.climate, r = n?.rooms ?? {}, i = this.climateFound?.devices.map((e) => e.entity_id) ?? Object.keys(r);
		if (!i.length && !n?.enabled) return o;
		let a = i.filter((e) => r[e]?.enabled).length, [s, c] = e("word.device").split("|"), l = {
			tab: "devices",
			section: "climate"
		};
		return E`<div class="group-label">${e("climate.title")}</div>
      <a class="card climate-link" href=${w(this.prefix, l)} @click=${O(l)}>
        <ha-icon icon="mdi:thermostat"></ha-icon>
        <span>
          <b>${e("devices.climate.summary", {
			devices: `${v(e.lang, i.length, 0)} ${i.length === 1 ? s : c}`,
			steered: v(e.lang, a, 0)
		})}</b>
          <small>${e(n?.enabled ? "devices.climate.on" : "devices.climate.off")}</small>
        </span>
        <ha-icon class="chevron" icon="mdi:chevron-right"></ha-icon>
      </a>`;
	}
	renderStatus(e, t, n) {
		let r = t.plan, i = n.reason, a = i === "waiting" && r?.window ? e("devices.status.waiting", { time: k(r.window.start) }) : i === "day" ? e("devices.status.day", { time: r?.day ? k(r.day.defer_until) : "–" }) : e(`devices.status.${i}`), s = t.mode === "simulation" ? E`<span class="pill-sim">${e("mode.simulation")}</span>` : E`<span class="chip ${t.mode === "live" ? "ok" : t.mode === "advisory" ? "learned" : ""}"
            >${e(`mode.${t.mode}`)}</span
          >`, c = n.steering || n.pending;
		return E`<section class="card status" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:pulse"></ha-icon>${e("devices.now")}</div>
        ${s} ${C(e, "plan_steer")}
      </div>
      <p class="status-text">${a}</p>
      ${n.pending ? E`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("devices.pending")}</span></div>` : o}
      ${c ? E`<div class="actions">
            <button type="button" class="btn btn-danger" @click=${this.release}>
              <ha-icon icon="mdi:hand-back-left-outline"></ha-icon>${e("devices.release")}
            </button>
            ${C(e, "devices_release")}
          </div>` : o}
      ${this.notice ? E`<div class="note" role="status"><ha-icon icon="mdi:check"></ha-icon>${this.notice}</div>` : o}
    </section>`;
	}
	renderBattery(e, t, n) {
		let i = this.hass, a = m(i, t.soc_entity), s = r(i, t.power), c = n?.ready[t.id] ?? "not_controllable", l = n?.batteries[t.id], u = n?.testing?.battery === t.id ? n.testing : null, d = n?.tests[t.id], f = t.adapter === "generic" ? e("devices.battery.generic") : t.adapter === "steps" ? e("devices.battery.steps") : t.adapter === "none" ? e("devices.battery.watch") : e("devices.battery.profile", { name: this.info?.profiles?.[t.adapter] ?? t.adapter }), p = l?.action ? e(`devices.action.${l.action}`, {
			target: v(e.lang, l.target ?? 0, 0),
			floor: v(e.lang, l.floor ?? 0, 0),
			until: l.until ? k(l.until) : ""
		}) : e("devices.action.idle"), h = l?.problem ?? (c !== "ready" && c !== "not_controllable" ? c : null);
		return E`<section class="card battery" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:home-battery-outline"></ha-icon>${t.name}</div>
        <span class="chip ${t.adapter === "none" ? "" : "read"}">${f}</span>
      </div>
      <div class="figures">
        <b>${a == null ? "–" : v(e.lang, a, 0)}<small>%</small></b>
        ${s == null ? o : E`<span
              >${Math.abs(s) < .05 ? e("devices.power.idle") : e(s > 0 ? "devices.power.charge" : "devices.power.discharge", { value: v(e.lang, Math.abs(s), 2) })}</span
            >`}
      </div>
      <p class="now">${t.adapter === "none" ? e("devices.action.watch") : p}</p>
      ${h && t.adapter !== "none" ? E`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon
            ><span>${e.optional(`devices.problem.${h === "outdated" ? "not_tested" : h}`) ?? h}</span>
          </div>` : o}
      ${t.adapter === "none" && this.hasSuggestion(t) ? E`<div class="note"><ha-icon icon="mdi:lightbulb-on-outline"></ha-icon><span>${e("devices.suggested")}</span></div>` : o}
      ${t.adapter === "none" ? o : this.renderTest(e, t, c, d, u)}
      <div class="setup">
        <button type="button" class="mini-btn" @click=${() => this.edit(t)}>
          <ha-icon icon="mdi:tune-variant"></ha-icon>${e("devices.setup")}
        </button>
        ${C(e, "devices_setup")}
      </div>
    </section>`;
	}
	renderAction(e, t, n) {
		let r = t.plan, i = r?.actions?.find((e) => e.id === n.id), a = t.control?.actions?.[n.id], s = r?.window?.start, c = !!s && t.control?.tonight?.[n.id] === s, l = n.kind === "target" ? "mdi:water-boiler" : /ev|car|auto|wallbox/i.test(n.id + n.name) ? "mdi:car-electric" : "mdi:flash-outline";
		return E`<section class="card action" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon=${l}></ha-icon>${n.name}</div>
        ${n.enabled ? o : E`<span class="chip">${e("devices.action.off")}</span>`}
      </div>
      <p class="now">${this.actionText(e, t, n, i, a)}</p>
      ${n.kind === "switch" && this.isCar(n) ? E`<div class="car-need" data-tipped>
              <button
                type="button"
                class="switch"
                role="switch"
                aria-checked=${String(!!n.need?.enabled)}
                aria-labelledby="need-${n.id}"
                @click=${() => this.toggleNeed(n)}
              ></button>
              <span id="need-${n.id}"><b>${e("action.need")}</b><small>${e(n.need?.enabled ? "action.need.on" : "action.need.off")}</small></span>
              ${C(e, "a_need")}
            </div>
            ${this.renderCarCalendar(e, t, n)}` : o}
      ${i?.need ? E`<joe-car-need .hass=${this.hass} .t=${e} .action=${i} .roundTrip=${n.need?.round_trip ?? !0}></joe-car-need>` : o}
      ${n.kind === "switch" && (n.need?.soc_entity || n.need?.range_entity) ? E`<joe-car-charge .hass=${this.hass} .t=${e} .state=${t} .action=${n}></joe-car-charge>` : E`<div class="test">
            <span class="toggle-label" id="tonight-${n.id}">${e("devices.action.tonight")}</span>
            <button
              type="button"
              class="switch"
              role="switch"
              aria-checked=${String(c)}
              aria-labelledby="tonight-${n.id}"
              ?disabled=${!s || !n.enabled}
              @click=${() => this.toggleTonight(n.id, !c)}
            ></button>
            ${C(e, "action_tonight")}
          </div>`}
      <div class="setup">
        <button type="button" class="mini-btn" @click=${() => this.editAction(n.id)}>
          <ha-icon icon="mdi:pencil-outline"></ha-icon>${e("devices.action.edit")}
        </button>
      </div>
    </section>`;
	}
	actionText(e, t, n, r, i) {
		let a = r?.target == null ? "" : v(e.lang, r.target, 0);
		if (!n.enabled) return e("devices.action.disabled");
		if (i?.reason === "boost") return e("devices.action.boost");
		if (i?.on) return n.kind === "target" ? e("devices.action.heating", {
			target: a,
			end: k(i.end)
		}) : e("devices.action.running", { end: k(i.end) });
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
			start: k(r.start),
			target: a
		}) : e("devices.action.plan_run", {
			start: k(r.start),
			end: k(r.end)
		})}`;
		let s = r.reasons[r.reasons.length - 1] ?? "manual_only";
		return e.optional(`devices.action.why.${s}`, {
			kwh: v(e.lang, t.plan?.meta?.tomorrow_kwh ?? 0, 0),
			temperature: v(e.lang, r.temperature ?? 0, 0)
		}) ?? s;
	}
	renderLonelyCars(e, t) {
		let n = new Set(t.config.actions.map((e) => e.consumer_id).filter(Boolean));
		return t.config.consumers.filter((e) => e.kind === "ev" && !n.has(e.id)).map((t) => E`<section class="card action" data-tipped>
          <div class="head">
            <div class="eyebrow"><ha-icon icon="mdi:car-electric"></ha-icon>${t.name}</div>
            ${C(e, "devices_lonely_car")}
          </div>
          <p class="now">${e("devices.car.lonely")}</p>
          <div class="setup">
            <button type="button" class="btn btn-primary" @click=${() => this.editAction("new:ev", "need", t.id)}>
              ${e("devices.car.set_up")}
            </button>
          </div>
        </section>`);
	}
	renderAddAction(e) {
		return E`<section class="card add" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:plus-circle-outline"></ha-icon>${e("devices.action.add")}</div>
        ${C(e, "devices_actions")}
      </div>
      <p class="now">${e("devices.action.add.text")}</p>
      <div class="actions">
        ${[
			"ev",
			"hot_water",
			"custom"
		].map((t) => E`<button type="button" class="mini-btn" @click=${() => this.editAction(`new:${t}`)}>
              ${e(`action.template.${t}`)}
            </button>`)}
      </div>
    </section>`;
	}
	async toggleTonight(e, t) {
		try {
			await this.hass?.callWS({
				type: "energy_joe/control/action_tonight",
				action_id: e,
				on: t
			});
		} catch {
			this.notice = this.t("error.action");
		}
	}
	toggleNeed(e) {
		let t = e.need;
		t?.enabled ? N(this, { actions: { [e.id]: { need: {
			...t,
			enabled: !1
		} } } }) : t?.soc_entity || t?.range_entity ? N(this, { actions: { [e.id]: { need: {
			...t,
			enabled: !0
		} } } }) : this.editAction(e.id, "need");
	}
	isCar(e) {
		return !!(e.need?.enabled || e.need?.soc_entity || /ev|car|auto|wallbox/i.test(e.id + e.name));
	}
	editAction(e, t, n) {
		this.dispatchEvent(new CustomEvent("joe-edit", {
			detail: {
				editor: "action",
				id: e,
				focus: t,
				consumer: n
			},
			bubbles: !0,
			composed: !0
		}));
	}
	renderCarCalendar(e, t, n) {
		let r = n.need, i = r?.enabled ? r.source ?? "ha" : null, a = "", s = "none", c = null, l = r?.enabled ? t.config.persons.filter((e) => e.calendars.length && (r.persons == null || r.persons.includes(e.id))) : [];
		if (i === "ha" && (r?.calendars?.length || l.length)) a = [...(r?.calendars ?? []).map((e) => _(this.hass, e)), ...l.length ? [e("devices.car.of_persons", { names: l.map((e) => e.name).join(", ") })] : []].join(" · "), s = "ok";
		else if (i === "mailbox" && r?.mailbox?.address) {
			let e = t.mailbox?.[n.id];
			a = r.mailbox.address, s = e?.state === "ok" ? "ok" : "warn", c = e?.checked ?? null;
		} else if (i === "account" && r?.account?.address) {
			let e = t.accounts?.[n.id];
			a = r.account.address, s = e?.state === "ok" ? "ok" : "warn", c = e?.checked ?? null;
		}
		return E`<div class="car-cal" data-tipped>
      <ha-icon icon="mdi:calendar-month-outline"></ha-icon>
      <span class="grow">
        ${s === "none" ? E`<b>${e("devices.car.no_calendar")}</b>` : E`<b>${a}</b>
              <small>
                ${e(s === "ok" ? "devices.car.calendar_ok" : "devices.car.calendar_problem")}
                ${c ? e("devices.car.checked", { when: new Date(c).toLocaleString(e.lang, {
			weekday: "short",
			hour: "2-digit",
			minute: "2-digit"
		}) }) : o}
              </small>`}
      </span>
      <button type="button" class="mini-btn ${s === "none" ? "go" : ""}" @click=${() => this.editAction(n.id, "calendars")}>
        ${e(s === "none" ? "devices.car.connect" : "devices.car.change")}
      </button>
      ${C(e, "car_calendar_card")}
    </div>`;
	}
	hasSuggestion(e) {
		return !!(this.discovery?.batteries.find((t) => t.id === e.id))?.suggested?.complete;
	}
	renderTest(e, t, n, r, i) {
		let a = !!this.state?.control?.testing, s = !!this.state?.control?.steering, c = i ? E`<span class="chip">${e("devices.test.running")}</span>` : n === "outdated" ? E`<span class="chip warn">${e("devices.test.outdated")}</span>` : r ? E`<span class="chip ${r.ok ? "ok" : "warn"}"
              >${e(r.ok ? "devices.test.ok" : "devices.test.failed", { day: H(e.lang, r.at, "short") })}</span
            >` : E`<span class="chip">${e("devices.test.none")}</span>`, l = i?.steps ?? r?.steps ?? [];
		return E`<div class="test">
        ${c}
        <button
          type="button"
          class="btn btn-secondary"
          ?disabled=${a || s}
          @click=${() => this.confirm = t}
        >
          <ha-icon icon="mdi:play-circle-outline"></ha-icon>${e(r ? "devices.test.again" : "devices.test.start")}
        </button>
        ${C(e, "devices_test")}
      </div>
      ${i || r ? this.renderSteps(e, l, i?.step ?? null, r) : o}`;
	}
	renderSteps(e, t, n, r) {
		let i = new Map(t.map((e) => [e.step, e])), a = !n && r?.problem ? e.optional(`devices.test.problem.${r.problem}`, { missing: (r.missing ?? []).map((t) => e.optional(`role.${t}`) ?? t).join(", ") }) : null;
		return E`<ul class="steps">
      ${a ? E`<li class="bad"><ha-icon icon="mdi:close-circle"></ha-icon><b>${e("devices.test.step.check")}</b><small>${a}</small></li>` : o}
      ${a ? o : jn.map((t) => {
			let r = i.get(t), a = r ? r.ok ? "ok" : "bad" : "wait", o = r ? r.ok ? "mdi:check-circle" : "mdi:close-circle" : n === t ? "mdi:progress-clock" : "mdi:circle-outline";
			return E`<li class=${a}>
              <ha-icon icon=${o}></ha-icon>
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
			this.confirm = void 0;
		};
		return E`<joe-sheet label=${e("devices.test.start")} closeLabel=${e("common.close")} @joe-close=${n}>
      <div data-tipped>
        <div class="sheet-title">
          ${a(e("devices.test.confirm.title", { name: t.name }), "h2", C(e, "devices_test"))}
        </div>
        <p class="sheet-text">${e("devices.test.confirm.text")}</p>
        <div class="actions">
          <button type="button" class="btn btn-secondary" data-notip @click=${n}>${e("common.cancel")}</button>
          <button type="button" class="btn btn-primary" @click=${() => this.startTest(t)}>
            ${e("devices.test.confirm.go")}
          </button>
        </div>
      </div>
    </joe-sheet>`;
	}
	async startTest(e) {
		this.confirm = void 0;
		try {
			await this.hass?.callWS({
				type: "energy_joe/control/test",
				battery_id: e.id
			});
		} catch {
			this.notice = this.t("error.action");
		}
	}
	async release() {
		try {
			await this.hass?.callWS({ type: "energy_joe/control/release" });
		} catch {
			this.notice = this.t("error.action");
		}
	}
	edit(e) {
		this.dispatchEvent(new CustomEvent("joe-edit", {
			detail: {
				editor: "battery",
				id: e.id
			},
			bubbles: !0,
			composed: !0
		}));
	}
};
e([y({ attribute: !1 })], U.prototype, "hass", void 0), e([y({ attribute: !1 })], U.prototype, "t", void 0), e([y({ attribute: !1 })], U.prototype, "state", void 0), e([y({ attribute: !1 })], U.prototype, "route", void 0), e([y({ attribute: !1 })], U.prototype, "prefix", void 0), e([y({ attribute: !1 })], U.prototype, "discovery", void 0), e([y({ attribute: !1 })], U.prototype, "info", void 0), e([y({ attribute: !1 })], U.prototype, "climateFound", void 0), e([s()], U.prototype, "confirm", void 0), e([s()], U.prototype, "notice", void 0), f("joe-devices-all", U);
//#endregion
//#region src/components/ha-open.ts
function Mn(e, t, n) {
	return {
		deviceId: t ? e?.entities?.[t]?.device_id ?? null : null,
		entityId: t ?? null,
		name: n
	};
}
function Nn(e, t) {
	let { deviceId: n, entityId: r, name: i } = t;
	if (n) {
		let t = `/config/devices/device/${n}`, r = e("ha.open.device", { name: i });
		return E`<a
      class="ha-open"
      data-notip
      href=${t}
      title=${r}
      aria-label=${r}
      @click=${(e) => {
			e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0 || (e.preventDefault(), c(t));
		}}
      ><ha-icon icon="mdi:open-in-new"></ha-icon
    ></a>`;
	}
	if (r) {
		let t = e("ha.open.entity", { name: i });
		return E`<button
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
	return o;
}
//#endregion
//#region src/components/mirror.ts
function Pn(e, t, n) {
	return E`<div class="mirror">
    <div class="mirror-text">
      <span class="mirror-label">${n.label}</span>
      <span class="mirror-sep" aria-hidden="true">·</span>
      <span class="mirror-value">${n.value}</span>
      ${n.source ? g(e, n.source) : o}
      ${n.hint ? E`<small class="mirror-hint">${n.hint}</small>` : o}
    </div>
    <a class="mini-btn go mirror-go" href=${w(t, n.to)} @click=${O(n.to)}
      >${e(n.action === "set" ? "mirror.set" : "mirror.change")}</a
    >
  </div>`;
}
//#endregion
//#region src/pages/devices/climate.ts
var Fn = {
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
}, In = 15, Ln = {
	tab: "household",
	section: "days"
};
function Rn(e, t) {
	let n = /^week_program_(\d+)$/.exec(e);
	return n ? Number(n[1]) : t + 1;
}
function zn(e) {
	return JSON.stringify(Object.keys(e).sort().map((t) => [
		t,
		e[t]?.name ?? "",
		e[t]?.tags ?? []
	]));
}
var W = class extends b {
	constructor(...e) {
		super(...e), this.prefix = D, this.failed = !1, this.metersOpen = !0, this.query = "", this.holdUntil = {}, this.pending = {}, this.moved = {}, this.weekError = {};
	}
	static {
		this.styles = [T, x`
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
      .head b {
        /* Narrow cards put the name on a line of its own, the controls below. */
        flex: 1 1 150px;
        min-width: 0;
        font-weight: 700;
        overflow-wrap: break-word;
      }
      /* Name and temperature wrap as one block; the Home Assistant button stays top right. */
      .device-head {
        flex-wrap: nowrap;
        align-items: flex-start;
      }
      .device-name {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px 8px;
        min-height: 44px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }
      .grid .card {
        margin-top: 0;
      }
      .row {
        display: flex;
        align-items: center;
        gap: 8px 12px;
        flex-wrap: wrap;
        margin-top: 12px;
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
      .hint {
        margin: 8px 0 0;
        color: var(--joe-muted);
        font-size: 13px;
      }
      a.mini-btn {
        text-decoration: none;
      }
      details.ent {
        margin-top: 4px;
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
      .fold {
        min-height: 44px;
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
        min-width: 0;
        padding: 0;
        border: 0;
        background: none;
        color: inherit;
        font: inherit;
        cursor: pointer;
        text-align: left;
      }
      .meter-pick {
        display: grid;
        gap: 6px;
        min-width: 0;
      }
      .picked {
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
      .hits {
        display: grid;
        gap: 2px;
        max-height: 300px;
        overflow-y: auto;
      }
      .hit {
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
      .line .state {
        display: flex;
        gap: 6px;
        align-items: center;
        flex-wrap: wrap;
      }
      .line {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr) auto;
        gap: 6px 12px;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid var(--joe-line);
      }
      .line:last-child {
        border-bottom: 0;
      }
      .line .input {
        width: 100%;
        min-width: 0;
      }
      .line .shared {
        grid-column: 1 / -1;
        margin: 0;
      }
      .dev {
        display: grid;
        gap: 2px;
        min-width: 0;
      }
      .dev b {
        font-weight: 600;
        overflow-wrap: anywhere;
      }
      .dev small {
        color: var(--joe-muted);
        font-size: 12.5px;
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
      .week-now {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px 8px;
        margin: 10px 0 0;
        font-weight: 600;
      }
      .week-now .chip {
        font-weight: 600;
      }
      .card .note {
        margin-top: 10px;
      }
      .note-body {
        display: grid;
        gap: 8px;
        justify-items: start;
        min-width: 0;
      }
      .row select.input {
        flex: 1 1 160px;
      }
      .row.hold {
        margin-top: 6px;
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
      .household {
        padding-top: 10px;
        padding-bottom: 10px;
      }
      .household .mirror + .mirror {
        border-top: 1px solid var(--joe-line);
      }
      .intro .with-tip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: var(--joe-muted);
        font-size: 13px;
      }
      .dev-name {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
      }
      .dev-name b {
        flex: 1;
        min-width: 0;
      }
      .hit-row {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .hit-row .hit {
        flex: 1;
        min-width: 0;
      }
      .hit {
        min-height: 44px;
      }
      @media (max-width: 760px) {
        .line {
          grid-template-columns: 1fr;
        }
      }
      @media (max-width: 760px) {
        .intro,
        .grid {
          grid-template-columns: 1fr;
        }
        .intro joe-pose {
          display: none;
        }
      }
    `];
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
	willUpdate(e) {
		if (e.has("entity") || e.has("route")) {
			let e = this.route ? me(this.route) : this.entity ?? "";
			e !== this.revealed && (this.revealed = e, this.anchor = this.entity || void 0);
		}
		if (e.has("state") && Object.keys(this.pending).length) {
			let e = this.state?.config.climate?.rooms ?? {}, t = Object.fromEntries(Object.entries(this.pending).filter(([t, n]) => zn(e[t]?.device_profiles ?? {}) !== zn(n)));
			Object.keys(t).length !== Object.keys(this.pending).length && (this.pending = t);
		}
	}
	profilesOf(e) {
		return this.pending[e] ?? this.state?.config.climate?.rooms?.[e]?.device_profiles ?? {};
	}
	hvacText(e, t) {
		return e.optional(`climate.hvac.${t}`) ?? t;
	}
	async load() {
		try {
			this.own = await this.hass?.callWS({ type: "energy_joe/climate/devices" }), this.failed = !1;
		} catch {
			this.failed = !this.climateFound;
		}
	}
	async updated() {
		let e = this.anchor;
		if (e && this.found) {
			for (let e = 0; e < 10 && !getComputedStyle(this).getPropertyValue("--joe-head-h"); e++) await new Promise((e) => requestAnimationFrame(e));
			this.anchor === e && ie(this.renderRoot, e) && (this.anchor = void 0);
		}
	}
	render() {
		let { t: e, state: t } = this;
		if (!e || !t) return o;
		let n = t.config.climate ?? {
			enabled: !1,
			rooms: {}
		}, r = this.found, i = r?.devices ?? [], s = [...new Set(i.map((t) => t.area ?? e("climate.no_area")))], c = !!(this.entity && r && !i.some((e) => e.entity_id === this.entity));
		return E`<div class="wrap">
      <div class="intro">
        <div>
          ${a(e("climate.title"))} ${A}
          <p class="lead">${e("climate.lead")}</p>
          ${i.length ? E`<p class="with-tip" data-tipped>${e("climate.ha_open")} ${C(e, "ha_open")}</p>` : o}
        </div>
        <joe-pose name="relax"></joe-pose>
      </div>
      ${c ? E`<div class="note warn" role="status"><ha-icon icon="mdi:help-circle-outline"></ha-icon><span>${e("nav.not_found")}</span></div>` : o}
      ${this.renderMain(e, t, n.enabled)} ${this.renderHousehold(e, t)}
      ${i.length ? this.renderMeters(e, t, i) : o}
      ${this.failed && !r ? E`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("climate.failed")}</span></div>` : o}
      ${r && !i.length ? E`<p class="hint">${e("climate.none")}</p>` : o}
      ${s.map((n) => E`<div class="group-label">${n}</div>
          <div class="grid">
            ${i.filter((t) => (t.area ?? e("climate.no_area")) === n).map((n) => this.renderDevice(e, t, n))}
          </div>`)}
    </div>`;
	}
	renderHousehold(e, t) {
		let n = t.config.context.presence_entity ?? null, r = n ? this.hass?.states[n]?.attributes.friendly_name ?? n : null, i = t.climate?.day, a = i ? i.holiday ? "holiday" : i.weekend && i.free ? "weekend" : "workday" : null, o = a ? [e(`climate.mirror.today.${a}`), i?.home_office_available && i.home_office.length ? e("climate.mirror.today.ho", { names: i.home_office.join(", ") }) : ""].filter(Boolean).join(", ") : e("climate.mirror.unknown"), s = t.config.climate, c = s?.night_by === "entity", l = s?.night_entity ?? null, u = c ? l ? this.hass?.states[l]?.attributes.friendly_name ?? l : e("climate.mirror.night.no_entity") : e("climate.mirror.night.time");
		return E`<section class="card household">
      ${Pn(e, this.prefix, {
			label: e("climate.mirror.presence"),
			value: r ? E`<span title=${n ?? ""}>${r}</span>` : e("climate.mirror.presence.none"),
			to: {
				tab: "household",
				section: "presence"
			},
			action: r ? "change" : "set"
		})}
      ${Pn(e, this.prefix, {
			label: e("climate.mirror.today"),
			value: o,
			to: Ln
		})}
      ${Pn(e, this.prefix, {
			label: e("climate.mirror.night"),
			value: u,
			to: {
				tab: "household",
				section: "night"
			},
			action: c && !l ? "set" : "change"
		})}
    </section>`;
	}
	daysLink(e) {
		return E`<a class="mini-btn quiet" href=${w(this.prefix, Ln)} @click=${O(Ln)}>
      <ha-icon icon="mdi:calendar-text-outline"></ha-icon>${e("week.ho.rules")}
    </a>`;
	}
	renderMain(e, t, n) {
		return E`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:thermostat-auto"></ha-icon>${e("climate.enabled")}</div>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(n)}
          aria-label=${e("climate.enabled")}
          @click=${() => N(this, { climate: { enabled: !n } })}
        ></button>
        ${C(e, "climate_enabled")}
      </div>
      <p class="hint">${e(t.mode === "live" ? "climate.live" : "climate.not_live")}</p>
    </section>`;
	}
	renderDevice(e, t, n) {
		let r = {
			...Fn,
			...t.config.climate?.rooms?.[n.entity_id] ?? {}
		}, i = this.hass?.states[n.entity_id], a = i?.attributes.current_temperature ?? n.current_temperature, s = i?.attributes.temperature ?? n.temperature, c = n.hvac_modes.includes("cool"), l = n.preset_modes.filter((e) => !["none", "boost"].includes(e)), u = t.climate?.rooms?.[n.entity_id], d = t.climate?.rates?.[n.entity_id], f = n.week_presets ?? [], p = Object.values(r.week?.modes ?? {}).filter((e) => !!e?.length), m = c && !f.length && !!r.week?.enabled && p.length > 0 && u?.kind !== "legacy", g = this.profilesOf(n.entity_id), _ = f.some((e) => g[e]?.tags.includes("normal")) && u?.kind !== "legacy", y = !m && !_, ee = m ? p.every((e) => e.some((e) => e.tags.includes("away"))) : f.some((e) => g[e]?.tags.includes("away")), b = y ? [
			"setback",
			"off",
			...l.length ? ["preset"] : []
		] : ["setback", "off"], x = y ? r.away : r.away === "off" ? "off" : "setback";
		return E`<section class="card" data-tipped data-anchor=${n.entity_id}>
      <div class="head device-head">
        <div class="device-name">
          <b>${h(n.device_id, n.name, e("climate.open_device", { id: n.entity_id }))}</b>
          ${a == null ? o : E`<span class="chip">${v(e.lang, Number(a), 1)} °C${s == null ? "" : ` → ${v(e.lang, Number(s), 1)} °C`}</span>`}
        </div>
        ${Nn(e, {
			deviceId: n.device_id,
			entityId: n.entity_id,
			name: n.name
		})}
      </div>
      <details class="ent"><summary>${e("climate.entity")}</summary><code>${n.entity_id}</code></details>
      <div class="row">
        <span>${e("climate.room.steer")}</span>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(r.enabled)}
          aria-label=${e("climate.room.enabled", { name: n.name })}
          @click=${() => this.save(n, { enabled: !r.enabled })}
        ></button>
        ${C(e, "climate_room")}
      </div>
      ${r.enabled ? E`${c && !f.length ? this.renderWeek(e, n, r, p, u) : o}
            ${f.length ? this.renderPrograms(e, n, f, u) : o}
            ${!ee || y ? E`<div class="row" data-tipped>
                    <span>${e("climate.away")}</span>
                    <span class="seg" role="group" aria-label=${e("climate.away")}>
                      ${b.map((t) => E`<button type="button" aria-pressed=${String(x === t)} @click=${() => this.save(n, { away: t })}>
                          ${e(_ && t === "setback" ? "devprof.away_keep" : `climate.away.${t}`)}
                        </button>`)}
                    </span>
                    ${C(e, y ? "climate_away" : _ ? "devprof_away" : "week_away")}
                  </div>
                  ${y ? o : E`<p class="hint">${e("week.away_fallback")}</p>`}
                  ${x === "setback" && !_ ? E`<div class="row">
                        <span>${e(c && n.state === "cool" ? "climate.setback.cool" : "climate.setback.heat")}</span>
                        <input
                          class="input short"
                          type="number"
                          min="0.5"
                          max="10"
                          step="0.5"
                          aria-label=${e("climate.setback.heat")}
                          .value=${String(r.setback_k)}
                          @change=${(e) => {
			let t = Number.parseFloat(e.target.value.replace(",", "."));
			Number.isFinite(t) && this.save(n, { setback_k: Math.min(10, Math.max(.5, t)) });
		}}
                        />
                        <span>°C</span>
                      </div>` : o}
                  ${y && r.away === "preset" ? this.presetRow(e, n, l, "away_preset", r.away_preset, "climate.away_preset") : o}` : o}
            ${y && l.length ? E`<div data-tipped>
                  ${this.presetRow(e, n, l, "free_day_preset", r.free_day_preset, "climate.free_day_preset", !0)}
                </div>` : o}
            ${c ? this.renderNight(e, n, r) : o}
            <p class="hint">
              ${u && y ? e.optional(`climate.now.${u.why}`, { min: this.awayAfter }) ?? "" : o}
              ${d ? e("climate.rate", { rate: v(e.lang, d, 1) }) : e("climate.rate_default")}
            </p>` : E`<p class="hint">${e("climate.room.off")}</p>`}
    </section>`;
	}
	get awayAfter() {
		return this.state?.config.climate?.away_after_min ?? In;
	}
	renderWeek(e, t, n, r, i) {
		let a = !!n.week?.enabled;
		return E`<div class="sub" data-tipped>
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
        ${C(e, "climate_week")}
      </div>
      ${i?.pending ? E`<p class="hint">${e(i.pending === "start" ? "week.pending.start" : "week.pending.end")}</p>` : o}
      ${a ? E`${r.length ? i?.pending === "start" ? o : i?.kind === "legacy" ? E`<p class="hint">
                    ${e("week.legacy_now", { state: this.hvacText(e, this.hass?.states[t.entity_id]?.state ?? t.state) })}
                  </p>` : this.renderNow(e, t, i) : E`<p class="hint">${e("week.no_sets")}</p>`}
            <div class="row">
              <button type="button" class="btn btn-secondary" @click=${() => this.editWeek(t)}>
                <ha-icon icon="mdi:calendar-clock"></ha-icon>${e("week.edit")}
              </button>
            </div>
            ${r.length ? this.renderHold(e, t, n, r, i) : o}` : o}
    </div>`;
	}
	renderNow(e, t, n) {
		if (!n || !n.kind || n.kind === "legacy") return E``;
		let r = this.weekError[t.entity_id] ?? n.error, i = r ? E`<div class="note warn" role="alert">
          <ha-icon icon="mdi:alert-outline"></ha-icon>
          <span>${e.optional(`week.error.${r}`) ?? e("week.error", { error: r })}</span>
        </div>` : o, a = n.override;
		if (a?.reason === "off") return E`<div class="note"><ha-icon icon="mdi:power"></ha-icon><span>${e("week.override.off")}</span></div>${i}`;
		if (a) {
			let n = a.reason === "preset" ? a.until ? e("week.override.preset", { time: a.until }) : e("week.override.preset_open") : a.until ? e("week.override.manual", { time: a.until }) : e("week.override.manual_open");
			return E`<div class="note" data-tipped>
          <ha-icon icon="mdi:hand-back-right-outline"></ha-icon>
          <span class="note-body">
            <span>${n}</span>
            <span class="with-tip">
              <button type="button" class="mini-btn" @click=${() => void this.resume(t)}>${e("week.resume")}</button>
              ${C(e, "week_resume")}
            </span>
          </span>
        </div>
        ${i}`;
		}
		let s = n.target, c = [];
		if (n.kind === "device") {
			let n = s?.preset;
			if (!s) c.push(e("week.as_is"));
			else if (s.hvac === "off") c.push(e("week.state_off"));
			else if (n) {
				let r = (t.week_presets ?? []).indexOf(n), i = e("week.profile", { n: Rn(n, Math.max(0, r)) });
				c.push(Ut(i, this.profilesOf(t.entity_id)[n]?.name));
			}
		} else {
			if (c.push(s ? s.hvac === "off" ? e("week.state_off") : e(`week.mode.${n.mode === "heat" ? "heat" : "cool"}`) : e("week.as_is")), n.profile?.index != null) {
				let t = Ut(e("week.profile", { n: n.profile.index + 1 }), n.profile.name);
				c.push(n.profile.held && n.why !== "held" ? `${t} (${e("week.held")})` : t);
			}
			s && s.hvac !== "off" && s.temperature != null && c.push(`${v(e.lang, s.temperature, 1)}\u00a0°C`), n.next && c.push(e("week.next", {
				time: n.next.at,
				value: this.valueText(e, n.next.value)
			}));
		}
		let l = e.optional(`week.why.${n.why}`, { min: this.awayAfter });
		return E`<p class="week-now">
        <span>${e(n.would ? "week.would" : "week.now", { text: c.join(" · ") || "–" })}</span>
        ${l ? E`<span class="chip">${l}</span>` : o}
      </p>
      ${i}`;
	}
	valueText(e, t) {
		return t === "off" ? e("week.off") : `${v(e.lang, t, 1)}\u00a0°C`;
	}
	renderHold(e, t, n, r, i) {
		let a = t.entity_id, s = i?.mode ?? this.hass?.states[a]?.state ?? t.state, c = n.week?.modes?.[s === "heat" ? "heat" : "cool"] ?? r[0], l = i?.hold ?? null, u = l && l.mode === s ? l : null, d = u ? u.profile : null, f = u ? u.until ? "midnight" : "forever" : this.holdUntil[a] ?? "midnight", p = (t) => Ut(e("week.profile", { n: t.profile + 1 }), n.week?.modes?.[t.mode]?.[t.profile]?.name), m = i?.want, h = u && (m === "night" || m === "away") ? m : null;
		return E`<div data-tipped>
      <div class="row">
        <span>${e("week.hold")}</span>
        ${C(e, "week_hold")}
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
          ${c.map((t, n) => E`<option value=${String(n)} ?selected=${d === n}>${Ut(e("week.profile", { n: n + 1 }), t.name)}</option>`)}
        </select>
        <span class="seg" role="group" aria-label=${e("week.hold.until")}>
          ${["midnight", "forever"].map((n) => E`<button
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
      ${h && u ? E`<p class="hint">${e(`week.hold.later_${h}`, { profile: p(u) })}</p>` : o}
      ${l && !u ? E`<div class="note" role="status">
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
          </div>` : o}
    </div>`;
	}
	renderPrograms(e, t, n, r) {
		let i = this.profilesOf(t.entity_id), a = n.flatMap((e) => i[e]?.tags ?? []), s = this.state?.climate?.day, c = !s || s.home_office_available, l = s?.home_office_reason ?? "no_calendar", u = this.hass?.states[t.entity_id]?.state ?? t.state;
		return E`<div class="sub" data-tipped>
      <div class="row">
        <span class="sub-title">${e("devprof.title")}</span>
        ${C(e, "climate_device_profiles")}
      </div>
      ${r?.pending ? E`<p class="hint">${e(r.pending === "start" ? "devprof.pending.start" : "devprof.pending.end")}</p>` : o}
      ${n.map((r, a) => {
			let o = i[r] ?? {
				name: "",
				tags: []
			}, s = e("week.profile", { n: Rn(r, a) });
			return E`<div class="preset">
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
            ${ut.map((i) => {
				let a = o.tags.includes(i), s = i === "home_office" && !c && !a;
				return E`<button
                type="button"
                class="mini-btn tag-btn"
                aria-pressed=${String(a)}
                ?disabled=${s}
                title=${s ? e(`week.ho.${l}`) : ""}
                @click=${() => this.toggleProgramTag(e, t, n, r, i)}
              >
                <ha-icon icon=${Wt[i]}></ha-icon>${e(`week.tag.${i}`)}
              </button>`;
			})}
          </div>
        </div>`;
		})}
      ${this.moved[t.entity_id] ? E`<div class="note" role="status"><ha-icon icon="mdi:information-outline"></ha-icon><span>${this.moved[t.entity_id]}</span></div>` : o}
      ${a.length && !a.includes("normal") ? E`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("devprof.need_normal")}</span></div>` : o}
      ${r?.why === "manual_mode" ? E`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("devprof.not_auto", { state: this.hvacText(e, u) })}</span>
          </div>` : o}
      ${c ? o : E`<p class="hint">${e(`week.ho.${l}`)}</p>
            <div class="row">${this.daysLink(e)}</div>`}
      ${a.length && r?.kind === "device" ? this.renderNow(e, t, r) : o}
    </div>`;
	}
	toggleProgramTag(e, t, n, r, i) {
		let a = this.profilesOf(t.entity_id), o = (a[r]?.tags ?? []).includes(i), s = o ? void 0 : n.find((e) => e !== r && a[e]?.tags.includes(i)), c = (t) => a[t]?.name || e("week.profile", { n: Rn(t, n.indexOf(t)) });
		this.moved = {
			...this.moved,
			[t.entity_id]: s ? e("devprof.moved", {
				tag: e(`week.tag.${i}`),
				to: c(r),
				from: c(s)
			}) : ""
		};
		let l = o ? a[r].tags.filter((e) => e !== i) : ut.filter((e) => e === i || a[r]?.tags.includes(e));
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
		zn(o) !== zn(a) && (this.pending = {
			...this.pending,
			[i]: o
		}, N(this, { climate: { rooms: { [i]: { device_profiles: o } } } }).then((e) => {
			if (!e && this.pending[i] === o) {
				let { [i]: e, ...t } = this.pending;
				this.pending = t;
			}
		}));
	}
	editWeek(e) {
		this.dispatchEvent(new CustomEvent("joe-edit", {
			detail: {
				editor: "week",
				id: e.entity_id
			},
			bubbles: !0,
			composed: !0
		}));
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
	renderMeters(e, t, n) {
		let r = this.found?.meters ?? [], i = t.config.climate?.rooms ?? {}, a = n.filter((e) => {
			let t = i[e.entity_id]?.meter, n = this.found?.suggested?.[e.entity_id]?.device_id;
			return e.hvac_modes.some((e) => [
				"cool",
				"dry",
				"fan_only",
				"heat_cool"
			].includes(e)) || t && t !== "none" || n != null && n === e.device_id;
		});
		if (!a.length) return E``;
		let s = a.filter((e) => {
			let t = i[e.entity_id]?.meter;
			return t && t !== "none";
		}).length;
		return E`<section class="card" data-tipped>
      <div class="head">
        <button type="button" class="fold" aria-expanded=${String(this.metersOpen)} @click=${() => this.metersOpen = !this.metersOpen}>
          <ha-icon icon=${this.metersOpen ? "mdi:chevron-down" : "mdi:chevron-right"}></ha-icon>
          <span class="eyebrow"><ha-icon icon="mdi:meter-electric-outline"></ha-icon>${e("climate.meters")}</span>
          <span class="chip">${e("climate.meters.count", {
			linked: s,
			all: a.length
		})}</span>
        </button>
        ${C(e, "climate_meter")}
      </div>
      ${this.metersOpen ? E`<p class="hint">${e("climate.meters.say")}</p>
            ${r.length ? o : E`<p class="hint">${e("climate.meter.no_meters")}</p>`}
            ${a.map((t) => this.meterLine(e, t, a, i))}` : o}
    </section>`;
	}
	meterLine(e, t, n, r) {
		let i = r[t.entity_id]?.meter ?? null, a = i && i !== "none" ? i : null, s = i == null ? this.found?.suggested?.[t.entity_id] : void 0, c = a ? n.filter((e) => e.entity_id !== t.entity_id && this.sameMeter(r[e.entity_id]?.meter, a)) : [], l = a?.power ? this.hass?.states[a.power] : void 0, u = a ? this.option(a) ?? null : s ?? null, d = this.picking === t.entity_id;
		return E`<div class="line">
      <div class="dev">
        <span class="dev-name">
          <b>${h(t.device_id, t.name, e("climate.open_device", { id: t.entity_id }))}</b>
          ${Nn(e, {
			deviceId: t.device_id,
			entityId: t.entity_id,
			name: t.name
		})}
        </span>
        <small>${t.area ?? e("climate.no_area")}</small>
        <details class="ent">
          <summary>${e("climate.entities")}</summary>
          <code>${t.entity_id}</code>
          ${a?.power ? E`<code>${a.power}</code>` : o}
          ${a?.energy ? E`<code>${a.energy}</code>` : o}
        </details>
      </div>
      <div class="meter-pick">
        ${d ? this.meterSearch(e, t) : E`<span class="dev-name">
              <span class="picked">
                ${u ? E`<b>${h(u.device_id, `${u.name ?? u.device_id}${u.sensor ? ` · ${u.sensor}` : ""}`, e("climate.open_meter"))}</b>
                      ${u.via ? E`<small class="via">${u.via}</small>` : o}` : a ? E`<b>${h(a.device_id, a.power ?? a.energy ?? a.device_id, e("climate.open_meter"))}</b>` : E`<small>${e(i === "none" ? "climate.meter.without_long" : "climate.meter.open_long")}</small>`}
              </span>
              ${u ? Nn(e, this.meterTarget(u)) : a ? Nn(e, this.meterTarget(a)) : o}
            </span>`}
      </div>
      <div class="state">
        ${d ? o : a ? E`<span class="chip ok">${l ? this.reading(e, l) : e("climate.meter.linked")}</span>
                <button type="button" class="mini-btn" @click=${() => this.startPicking(t)}>${e("climate.meter.change")}</button>` : s ? E`<button type="button" class="btn btn-secondary" @click=${() => this.save(t, { meter: this.meterOf(s) })}>
                    ${e("climate.meter.confirm")}
                  </button>
                  <button type="button" class="mini-btn" @click=${() => this.startPicking(t)}>${e("climate.meter.other_short")}</button>` : E`<button type="button" class="mini-btn" @click=${() => this.startPicking(t)}>${e("climate.meter.search")}</button>`}
      </div>
      ${c.length ? E`<p class="hint shared">${e("climate.meter.shared", { names: c.map((e) => e.name).join(", ") })}</p>` : o}
    </div>`;
	}
	startPicking(e) {
		this.picking = e.entity_id, this.query = "", this.updateComplete.then(() => this.shadowRoot?.querySelector(".meter-pick input")?.focus());
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
		return E`<input
        class="input"
        type="search"
        placeholder=${e("climate.meter.search_placeholder")}
        aria-label=${e("climate.meter.pick", { name: t.name })}
        .value=${this.query}
        @input=${(e) => this.query = e.target.value}
        @keydown=${(e) => {
			e.key === "Escape" && (this.picking = void 0), e.key === "Enter" && r[0] && this.pickMeter(t, this.key(r[0]));
		}}
      />
      <div class="hits" role="listbox" aria-label=${e("climate.meter.pick", { name: t.name })}>
        ${r.map((n) => E`<div class="hit-row">
            <button type="button" role="option" class="hit" @click=${() => this.pickMeter(t, this.key(n))}>
              <b>${n.name ?? n.device_id}${n.sensor ? ` · ${n.sensor}` : ""}</b>
              <small>${[
			n.via,
			n.area,
			n.power ? this.readingOf(e, n.power) : ""
		].filter(Boolean).join(" · ")}</small>
            </button>
            ${Nn(e, this.meterTarget(n))}
          </div>`)}
        ${r.length ? o : E`<small class="none">${e("climate.meter.no_hits")}</small>`}
        <div class="hit-actions">
          <button type="button" class="mini-btn" @click=${() => this.pickMeter(t, "none")}>${e("climate.meter.none_option")}</button>
          <button type="button" class="mini-btn quiet" @click=${() => this.picking = void 0}>${e("climate.meter.cancel")}</button>
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
		if (this.picking = void 0, t === "none") {
			this.save(e, { meter: "none" });
			return;
		}
		let n = (this.found?.meters ?? []).find((e) => this.key(e) === t);
		n && this.save(e, { meter: this.meterOf(n) });
	}
	presetRow(e, t, n, r, i, a, s = !1) {
		return E`<div class="row">
      <span>${e(a)}</span>
      <select
        class="input"
        aria-label=${e(a)}
        @change=${(e) => this.save(t, { [r]: e.target.value || null })}
      >
        ${s ? E`<option value="" ?selected=${!i}>${e("climate.no_preset")}</option>` : o}
        ${!s && !i ? E`<option value="" selected disabled>${e("climate.pick_preset")}</option>` : o}
        ${n.map((e) => E`<option value=${e} ?selected=${e === i}>${e}</option>`)}
      </select>
      ${s ? C(this.t, "climate_free_day") : o}
    </div>`;
	}
	renderNight(e, t, n) {
		let r = (n, r) => E`<input
      class="input short"
      type="time"
      aria-label=${e(`climate.${n}`)}
      .value=${r}
      @change=${(e) => {
			let r = e.target.value;
			/^\d{1,2}:\d{2}$/.test(r) && this.save(t, { [n]: r });
		}}
    />`;
		return E`<div class="row" data-tipped>
      <span>${e("climate.night_off")}</span>
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${String(n.night_off)}
        aria-label=${e("climate.night_off")}
        @click=${() => this.save(t, { night_off: !n.night_off })}
      ></button>
      ${C(e, "climate_night")}
    </div>
    ${n.night_off ? this.state?.config.climate?.night_by === "entity" ? E`<div class="row">
            <span>${e("climate.night_back")}</span>
            ${r("night_until", n.night_until)}
          </div>` : E`<div class="row">
            <span>${e("climate.night_span")}</span>
            ${r("night_from", n.night_from)} – ${r("night_until", n.night_until)}
          </div>` : o}`;
	}
	save(e, t) {
		N(this, { climate: { rooms: { [e.entity_id]: t } } });
	}
};
e([y({ attribute: !1 })], W.prototype, "hass", void 0), e([y({ attribute: !1 })], W.prototype, "t", void 0), e([y({ attribute: !1 })], W.prototype, "state", void 0), e([y({ attribute: !1 })], W.prototype, "route", void 0), e([y({ attribute: !1 })], W.prototype, "prefix", void 0), e([y({ attribute: !1 })], W.prototype, "climateFound", void 0), e([y({ attribute: !1 })], W.prototype, "entity", void 0), e([s()], W.prototype, "own", void 0), e([s()], W.prototype, "failed", void 0), e([s()], W.prototype, "metersOpen", void 0), e([s()], W.prototype, "picking", void 0), e([s()], W.prototype, "query", void 0), e([s()], W.prototype, "holdUntil", void 0), e([s()], W.prototype, "pending", void 0), e([s()], W.prototype, "moved", void 0), e([s()], W.prototype, "weekError", void 0), f("joe-climate-group", W);
//#endregion
//#region src/pages/devices/index.ts
var Bn = {
	all: "joe-devices-all",
	climate: "joe-climate-group"
}, Vn = {
	all: "mdi:view-grid-outline",
	climate: "mdi:thermostat"
}, Hn = class extends b {
	constructor(...e) {
		super(...e), this.prefix = D, this.checks = [];
	}
	static {
		this.styles = [T, x`
      :host {
        display: block;
      }
    `];
	}
	get hasClimate() {
		let e = this.state?.config.climate;
		return !!(this.climateFound?.devices.length || e?.enabled || Object.keys(e?.rooms ?? {}).length);
	}
	render() {
		let e = this.t;
		if (!e || !this.state) return o;
		let t = this.route?.section ?? de.devices, n = (this.hasClimate || t === "climate" ? ["all", "climate"] : ["all"]).map((t) => ({
			id: t,
			label: e(`nav.devices.${t}`),
			icon: Vn[t]
		}));
		return E`${n.length > 1 ? wn(e, this.prefix, "devices", n, t) : o}${this.renderSection(t)}`;
	}
	renderSection(e) {
		if (!customElements.get(Bn[e])) return E``;
		let { t, hass: n, state: r, prefix: i, route: a, discovery: o, info: s, checks: c, climateFound: l } = this;
		switch (e) {
			case "all": return E`<joe-devices-all
          .t=${t}
          .hass=${n}
          .state=${r}
          .prefix=${i}
          .route=${a}
          .discovery=${o}
          .info=${s}
          .checks=${c}
          .climateFound=${l}
        ></joe-devices-all>`;
			case "climate": return E`<joe-climate-group
          .t=${t}
          .hass=${n}
          .state=${r}
          .prefix=${i}
          .route=${a}
          .discovery=${o}
          .info=${s}
          .checks=${c}
          .climateFound=${l}
          .entity=${a?.id}
        ></joe-climate-group>`;
		}
	}
};
e([y({ attribute: !1 })], Hn.prototype, "hass", void 0), e([y({ attribute: !1 })], Hn.prototype, "t", void 0), e([y({ attribute: !1 })], Hn.prototype, "state", void 0), e([y({ attribute: !1 })], Hn.prototype, "route", void 0), e([y({ attribute: !1 })], Hn.prototype, "prefix", void 0), e([y({ attribute: !1 })], Hn.prototype, "discovery", void 0), e([y({ attribute: !1 })], Hn.prototype, "info", void 0), e([y({ attribute: !1 })], Hn.prototype, "checks", void 0), e([y({ attribute: !1 })], Hn.prototype, "climateFound", void 0), f("joe-devices-page", Hn);
//#endregion
//#region src/components/finding-rows.ts
var Un = x`
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
function Wn(e, t, n, r = !1) {
	return E`<button type="button" class="mini-btn ${r ? "quiet" : ""}" @click=${n}>
    ${t ? E`<ha-icon icon=${t}></ha-icon>` : o}${e}
  </button>`;
}
function Gn(e) {
	return E`<div class="note"><ha-icon icon="mdi:information-outline"></ha-icon><span>${e}</span></div>`;
}
function Kn(e, t) {
	return E`<li class="item ${t.state ?? ""}" ?data-tipped=${!!(t.actions?.length && t.tip)}>
    <span class="ico-box"><ha-icon icon=${t.icon}></ha-icon></span>
    <div class="text">
      <div class="head">
        <span class="t">${t.title}</span>
        ${t.chips?.length ? E`<span class="chips">${t.chips}</span>` : o}
      </div>
      <div class="d">${t.detail}</div>
      ${t.reasons?.length ? E`<details data-notip>
            <summary>${e("scan.why")}</summary>
            <ul>
              ${t.reasons.map((t) => E`<li>${d(e, t)}</li>`)}
            </ul>
          </details>` : o}
      ${t.notes ?? o}
      ${t.actions?.length ? E`<div class="row-actions">${t.aside ?? o}${t.actions}${t.tip ? C(e, t.tip) : o}</div>` : o}
    </div>
  </li>`;
}
function qn(e, t) {
	return E`<ul class="found">
    ${t.map((t) => Kn(e, t))}
  </ul>`;
}
var Jn = {
	weather: "weather_entity",
	holiday: "holiday_entity"
};
function Yn(e, t, n, r, i, a, o) {
	let s = Jn[a], c = r.context[s], l = i?.[a] ?? null, u = {
		key: a,
		icon: a === "weather" ? "mdi:weather-partly-cloudy" : "mdi:calendar-star",
		title: n(a === "weather" ? "find.weather" : "find.holiday"),
		tip: a === "weather" ? "review_weather" : "review_holiday"
	}, d = () => void Xn(e, n, r, i, a);
	if (c) {
		let i = l?.entity.entity_id === c;
		return {
			...u,
			detail: _(t, c),
			chips: [g(n, j(r, `context.${s}`)), ...l && i ? [p(n, l.confidence)] : []],
			reasons: i ? l?.reasons : void 0,
			aside: o?.(c),
			actions: [Wn(n("review.change"), "mdi:magnify", d), Wn(n("review.ignore"), "", () => N(e, {
				context: { [s]: null },
				answers: { ignored: M(r, a, !0) }
			}), !0)]
		};
	}
	return Ne(r, a) ? {
		...u,
		detail: n("review.ignored"),
		state: "ignored",
		actions: [Wn(n("review.use"), "mdi:undo-variant", d)]
	} : {
		...u,
		detail: n("find.none"),
		state: "missing",
		notes: [Gn(n(a === "weather" ? "review.weather.none" : "review.holiday.none"))],
		actions: [Wn(n("review.choose"), "mdi:magnify", d)]
	};
}
async function Xn(e, t, n, r, i) {
	let a = Jn[i], o = r?.[i], s = n.context[a], c = (await P(e, {
		heading: t(i === "weather" ? "pick.weather.title" : "pick.holiday.title"),
		tip: i === "weather" ? "pick_weather" : "pick_holiday",
		filter: i === "weather" ? "weather" : "workday",
		selected: s ? [s] : o ? [o.entity.entity_id] : [],
		suggestions: Pe(o ? [Fe(o)] : [], o?.alternatives)
	}))?.selected[0];
	c && N(e, {
		context: { [a]: c },
		answers: { ignored: M(n, i, !1) }
	});
}
//#endregion
//#region src/uses.ts
function Zn(e, t) {
	let n = e.climate;
	if (!n?.enabled) return [];
	let r = t ? new Set(t.devices.map((e) => e.entity_id)) : null;
	return Object.entries(n.rooms ?? {}).filter(([e, t]) => t.enabled && (!r || r.has(e))).map(([e]) => e);
}
function Qn(e, t) {
	return e.actions.filter((e) => e.enabled && e.need?.enabled).filter((e) => {
		let n = e.need.persons;
		return t === void 0 ? n === null || n.length > 0 : n === null || n.includes(t);
	}).map((e) => ({
		label: e.name,
		to: "/devices"
	}));
}
function $n(e, t) {
	return t.length ? [{
		label: e("usedby.climate"),
		to: "/devices/climate",
		count: t.length
	}] : [];
}
function er(e, t, n) {
	let r = $n(e, Zn(t, n));
	return t.persons.some((e) => e.person_entity) && r.push({
		label: e("usedby.learn"),
		to: "/review/learned/presence"
	}), r;
}
function tr(e, t, n) {
	let r = t.persons.some((e) => e.calendars.length), i = [];
	return (t.context.holiday_entity || r) && (i.push({
		label: e("usedby.plan"),
		to: "/plan"
	}), i.push({
		label: e("usedby.consumption"),
		to: "/review/learned/consumption"
	})), r && i.push(...Qn(t).map((t) => ({
		...t,
		label: e("usedby.car", { name: t.label })
	}))), (t.context.holiday_entity || r || t.context.free_day_entities?.length) && i.push(...$n(e, Zn(t, n))), i;
}
function nr(e, t, n) {
	return $n(e, Zn(t, n).filter((e) => t.climate?.rooms[e]?.night_off));
}
function rr(e, t, n, r) {
	let i = [];
	return n !== "routing" && t.context.weather_entity && (i.push({
		label: e("usedby.plan"),
		to: "/plan"
	}), i.push({
		label: e("usedby.consumption"),
		to: "/review/learned/consumption"
	}), i.push(...$n(e, Zn(t, r)))), n !== "weather" && t.routing.service && (i.push(...Qn(t).map((t) => ({
		...t,
		label: e("usedby.car", { name: t.label })
	}))), (t.climate?.route_eta ?? !0) && Zn(t, r).length && i.push({
		label: e("usedby.way"),
		to: "/household/presence/way"
	})), i.filter((e, t) => i.findIndex((t) => t.label === e.label) === t);
}
function ir(e, t, n) {
	return t.persons.find((e) => e.id === n)?.calendars.length ? Qn(t, n) : [];
}
//#endregion
//#region src/components/used-by.ts
function ar(e, t) {
	if (typeof t == "string") return t;
	let [n, r] = e("word.device").split("|");
	return `${v(e.lang, t, 0)} ${t === 1 ? n : r}`;
}
function or(e, t, n) {
	return n.length ? E`<p class="used-by">
    <ha-icon icon="mdi:link-variant"></ha-icon>
    <span class="used-by-label">${e("usedby.label")}</span>
    ${n.map((n) => {
		let r = n.count === void 0 ? n.label : `${n.label} (${ar(e, n.count)})`;
		return n.to ? E`<a class="used-by-item" href=${w(t, n.to)} @click=${O(n.to)}>${r}</a>` : E`<span class="used-by-item">${r}</span>`;
	})}
  </p>` : E`<p class="used-by none"><ha-icon icon="mdi:link-variant-off"></ha-icon>${e("usedby.none")}</p>`;
}
//#endregion
//#region src/pages/household/head.ts
function sr(e, t, n, r, i) {
	return E`<div class="page-head">
    ${a(n)} ${A}
    <p class="lead">${r}</p>
    ${i ? or(e, t, i) : ""}
  </div>`;
}
function cr(e, t, n) {
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
function lr(e) {
	return `${String(Math.floor(e / 60)).padStart(2, "0")}:${String(e % 60).padStart(2, "0")}`;
}
function ur(e) {
	try {
		return new Intl.DateTimeFormat("en-CA", { timeZone: e }).format(/* @__PURE__ */ new Date());
	} catch {
		return new Intl.DateTimeFormat("en-CA").format(/* @__PURE__ */ new Date());
	}
}
//#endregion
//#region src/pages/household/styles.ts
var dr = x`
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
`, fr = [
	"vacation",
	"travel",
	"home_office",
	"office",
	"guests",
	"home"
];
function pr(e) {
	let t = e;
	for (; t;) {
		let e = t.parentNode instanceof ShadowRoot ? t.parentNode.host : t.parentNode;
		if (e instanceof HTMLElement && e.scrollTop > 0) return e;
		t = e;
	}
	return document.scrollingElement;
}
var G = class extends b {
	constructor(...e) {
		super(...e), this.prefix = D, this.checks = [], this.keyword = {}, this.quiet = !1;
	}
	static {
		this.styles = [
			T,
			dr,
			Un,
			x`
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
		return !e || !t || !n ? o : E`<div class="wrap">
      ${sr(e, this.prefix, e("household.days.title"), e("household.days.lead"), tr(e, t.config, this.climateFound))}
      ${this.renderPreview(e, t)} ${this.renderFree(e, n, t)} ${this.renderCalendar(e, t)}
    </div>`;
	}
	renderPreview(e, t) {
		let n = t.climate?.day, r = t.config.persons, i = this.hass?.config?.time_zone, a = ur(i), s = t.plan?.meta?.tomorrow, c = s && s.date > a ? s : void 0, l = n ? n.holiday ? "holiday" : n.weekend && n.free ? "weekend" : "workday" : null, u = n?.labels_state ?? (n?.labels_at ? "ok" : "unread"), d = u === "ok" && n?.labels_at ? cr(e.lang, n.labels_at, i) : null, f = t.climate, p = n ? !f?.home.length && f?.nobody_since ? "away" : n.holiday ? "holiday" : n.home_office.length && !n.free ? "home_office" : "normal" : null, m = null;
		if (c) {
			let e = (/* @__PURE__ */ new Date(`${c.date}T12:00:00Z`)).getUTCDay(), t = e === 0 || e === 6;
			m = c.workday ? Object.values(c.labels).includes("home_office") ? "home_office" : "normal" : t ? "normal" : "holiday";
		}
		let h = (t) => t ? E`<span class="chip ${t === "normal" ? "" : "soon"}"><ha-icon icon=${Wt[t]}></ha-icon>${e(`week.tag.${t}`)}</span>` : o;
		return E`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:calendar-today"></ha-icon>${e("household.days.preview")}</div>
        ${C(e, "household_days_preview")}
      </div>
      <div class="preview">
        <div class="day">
          <div class="day-head">
            <b>${e("household.days.preview.today")} · ${H(e.lang, a, "weekday")}</b>${h(p)}
          </div>
          ${l ? E`<p class="now">${e(`climate.today.${l}`)}</p>` : E`<p class="hint">${e("household.days.preview.unknown")}</p>`}
          ${n ? E`<p class="hint">
                ${n.home_office_available ? u === "ok" ? n.home_office.length ? e("climate.today.ho", { names: n.home_office.join(", ") }) : e("climate.today.ho_none") : e(`climate.today.labels_${u}`) : e(`week.ho.${n.home_office_reason ?? "no_calendar"}`)}
                ${d ? e("climate.today.read_at", { time: d }) : o}
              </p>` : o}
        </div>
        <div class="day">
          <div class="day-head">
            <b>${e("household.days.preview.tomorrow")}${c ? E` · ${H(e.lang, c.date, "weekday")}` : o}</b>${h(m)}
          </div>
          ${c ? E`<p class="now">${e(c.workday ? "household.days.preview.workday" : "household.days.preview.day_off")}</p>
                ${Object.keys(c.labels).length ? E`<ul>
                      ${Object.entries(c.labels).map(([t, n]) => E`<li>
                            ${e("household.days.preview.person", {
			name: r.find((e) => e.id === t)?.name ?? t,
			label: e(`label.${n}`)
		})}
                          </li>`)}
                    </ul>` : o}` : E`<p class="hint">${e("household.days.preview.no_plan")}</p>`}
        </div>
      </div>
    </section>`;
	}
	renderFree(e, t, n) {
		let r = n.config, i = r.context.free_day_entities ?? [];
		return E`<section class="card">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:calendar-star"></ha-icon>${e("household.days.free")}</div>
      </div>
      ${qn(e, [Yn(this, t, e, r, this.discovery, "holiday", (n) => Nn(e, Mn(t, n, _(t, n))))])}
      <div class="sub" data-tipped>
        <div class="row">
          <span>${e("climate.today.free_by")}</span>
          ${C(e, "climate_free_entities")}
        </div>
        <div class="row tight">
          <span class="chips-line">
            ${i.length ? i.map((e) => {
			let n = [
				"on",
				"true",
				"home"
			].includes(t.states[e]?.state ?? "");
			return E`<span class="chip ${n ? "ok" : ""}" title=${e}>${_(t, e)}</span>`;
		}) : E`<small class="hint">${e("climate.today.free_none")}</small>`}
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
		let t = await P(this, {
			heading: e("pick.free_day.title"),
			tip: "pick_free_day",
			filter: "toggle_like",
			multiple: !0,
			selected: this.state?.config.context.free_day_entities ?? []
		});
		t && N(this, { context: { free_day_entities: t.selected } });
	}
	renderCalendar(e, t) {
		let n = t.config, r = this.chosen(), i = !!r && !r.calendar, a = r?.calendar ?? n.calendar, s = (e) => a.rules.filter((t) => t.label === e), c = n.persons.some((e) => e.calendars.length), l = {
			tab: "household",
			section: "days"
		}, u = {
			tab: "household",
			section: "people"
		};
		return E`<section class="card" data-anchor="calendar" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:calendar-text-outline"></ha-icon>${e("learn.calendar")}</div>
        ${C(e, "learn_calendar")}
      </div>
      <p class="say">${e("learn.calendar.say")}</p>
      ${c ? o : E`<div class="note">
            <ha-icon icon="mdi:information-outline"></ha-icon>
            <span
              >${e("household.days.no_calendars")}
              <a href=${w(this.prefix, u)} @click=${O(u)}>${e("household.days.to_people")}</a></span
            >
          </div>`}
      ${n.persons.length ? E`<div data-tipped>
            <div class="sub-head"><b>${e("learn.calendar.for")}</b>${C(e, "cal_person")}</div>
            <nav class="scopes" aria-label=${e("learn.calendar.for")}>
              <a href=${w(this.prefix, l)} aria-current=${String(!r)} @click=${(e) => this.choose(e, l)}
                >${e("learn.calendar.everyone")}</a
              >
              ${n.persons.map((t) => {
			let n = {
				tab: "household",
				section: "days",
				id: t.id
			};
			return E`<a href=${w(this.prefix, n)} aria-current=${String(t.id === r?.id)} @click=${(e) => this.choose(e, n)}
                  >${t.name}${t.calendar ? E`<ha-icon class="own-rules" icon="mdi:account-cog-outline" title=${e("household.days.own_rules")}></ha-icon>` : o}</a
                >`;
		})}
            </nav>
          </div>` : o}
      ${this.person && !r ? E`<div class="note warn" role="status">
            <ha-icon icon="mdi:help-circle-outline"></ha-icon><span>${e("household.days.not_found")}</span>
          </div>` : o}
      ${r ? E`<div class="toggle-row" data-tipped>
            <span class="with-tip"><span id="cal-shared-label">${e("learn.calendar.shared")}</span>${C(e, "cal_shared")}</span>
            <button
              type="button"
              class="switch"
              role="switch"
              aria-checked=${String(i)}
              aria-labelledby="cal-shared-label"
              @click=${() => this.saveCalendar(r, i ? structuredClone(n.calendar) : null)}
            ></button>
          </div>` : o}
      ${i ? E`<p class="say">${e("learn.calendar.shared.say", { name: r.name })}</p>` : E`<div class="rules">
              ${fr.map((t) => E`<div class="rule">
                  <b>${e(`label.${t}`)}</b>
                  <div class="keywords">
                    ${s(t).map((t) => E`<span class="keyword"
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
              <div class="sub-head"><b>${e("learn.calendar.defaults")}</b>${C(e, "cal_defaults")}</div>
              <div class="defaults">
                ${["default_workday", "default_day_off"].map((t) => E`<label class="field">
                    <span class="field-label">${e(`learn.calendar.${t}`)}</span>
                    <select
                      class="input"
                      @change=${(e) => this.saveCalendarPart({ [t]: e.target.value })}
                    >
                      ${ot.map((n) => E`<option value=${n} ?selected=${a[t] === n}>${e(`label.${n}`)}</option>`)}
                    </select>
                  </label>`)}
              </div>
            </div>`}
    </section>`;
	}
	choose(e, t) {
		if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
		e.preventDefault(), this.quiet = !0;
		let n = pr(this), r = n?.scrollTop ?? 0;
		le(this, t, { replace: !0 }), n && (n.scrollTop = r);
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
		let t = fr.flatMap((t) => e.filter((e) => e.label === t));
		this.saveCalendarPart({ rules: t });
	}
	saveCalendarPart(e) {
		let t = this.chosen();
		t?.calendar ? this.saveCalendar(t, {
			...t.calendar,
			...e
		}) : N(this, { calendar: e });
	}
	saveCalendar(e, t) {
		N(this, { persons: { [e.id]: { calendar: t } } });
	}
	willUpdate(e) {
		e.has("person") && (this.revealed = this.quiet ? this.person : void 0, this.quiet = !1, this.keyword = {});
	}
	updated() {
		this.person && this.revealed !== this.person && ie(this.renderRoot, "calendar") && (this.revealed = this.person);
	}
};
e([y({ attribute: !1 })], G.prototype, "hass", void 0), e([y({ attribute: !1 })], G.prototype, "t", void 0), e([y({ attribute: !1 })], G.prototype, "state", void 0), e([y({ attribute: !1 })], G.prototype, "route", void 0), e([y({ attribute: !1 })], G.prototype, "prefix", void 0), e([y({ attribute: !1 })], G.prototype, "discovery", void 0), e([y({ attribute: !1 })], G.prototype, "checks", void 0), e([y({ attribute: !1 })], G.prototype, "climateFound", void 0), e([y({ attribute: !1 })], G.prototype, "person", void 0), e([s()], G.prototype, "keyword", void 0), f("joe-hh-days", G);
//#endregion
//#region src/pages/household/night.ts
var mr = "23:00", hr = "06:30", gr = class extends b {
	constructor(...e) {
		super(...e), this.prefix = D, this.checks = [];
	}
	static {
		this.styles = [
			T,
			dr,
			x`
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
		return !e || !t || !this.hass ? o : E`<div class="wrap">
      ${sr(e, this.prefix, e("household.night.title"), e("household.night.lead"), nr(e, t.config, this.climateFound))}
      ${this.renderSource(e, t)} ${this.renderDevices(e, t)}
    </div>`;
	}
	renderSource(e, t) {
		let n = this.hass, r = t.config.climate, i = r?.night_by ?? "time", a = r?.night_entity ?? null, s = a ? n.states[a] : void 0;
		return E`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:weather-night"></ha-icon>${e("household.night.source")}</div>
        ${C(e, "climate_night_source")}
      </div>
      <div class="row">
        <span>${e("climate.night.by")}</span>
        <span class="seg" role="group" aria-label=${e("climate.night.by")}>
          ${["time", "entity"].map((t) => E`<button type="button" aria-pressed=${String(i === t)} @click=${() => this.setNightBy(t)}>
              ${e(`climate.night.by.${t}`)}
            </button>`)}
        </span>
      </div>
      ${i === "entity" ? E`<div class="row entity-row">
              <span>${a ? E`<b title=${a}>${_(n, a)}</b>` : e("climate.night.no_entity")}</span>
              ${s ? E`<span class="chip ${s.state === "on" ? "ok" : ""}"
                    >${e(s.state === "on" ? "climate.night.now_on" : "climate.night.now_off")}</span
                  >` : o}
              ${a ? Nn(e, Mn(n, a, _(n, a))) : o}
              <button type="button" class="btn btn-secondary" @click=${() => void this.pickNight()}>
                ${e(a ? "climate.night.change" : "climate.night.pick")}
              </button>
            </div>
            <p class="hint">${e("climate.night.entity_say")}</p>` : E`<p class="hint">${e("climate.night.time_say")}</p>`}
    </section>`;
	}
	renderDevices(e, t) {
		let n = t.config.climate, r = n?.night_by === "entity", i = Object.fromEntries((this.climateFound?.devices ?? []).map((e) => [e.entity_id, e.name])), a = Object.entries(n?.rooms ?? {}).filter(([, e]) => e.night_off), s = {
			tab: "devices",
			section: "climate"
		};
		return E`<section class="card">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:power-sleep"></ha-icon>${e("household.night.devices")}</div>
      </div>
      ${a.length ? E`<ul class="devices">
            ${a.map(([t, a]) => {
			let s = {
				tab: "devices",
				section: "climate",
				id: t
			}, c = a.night_from || mr, l = a.night_until || hr;
			return E`<li>
                <a href=${w(this.prefix, s)} @click=${O(s)}>
                  <b>${i[t] ?? _(this.hass, t)}</b>
                  <span>${r ? e("household.night.until", { until: l }) : e("household.night.span", {
				from: c,
				until: l
			})}</span>
                  ${a.enabled && n?.enabled ? o : E`<small class="hint">${e("household.night.not_steered")}</small>`}
                  <ha-icon icon="mdi:chevron-right"></ha-icon>
                </a>
              </li>`;
		})}
          </ul>` : E`<p class="hint">${e("household.night.devices.none")}</p>`}
      <a class="go-link" href=${w(this.prefix, s)} @click=${O(s)}>${e("household.night.to_climate")}</a>
    </section>`;
	}
	setNightBy(e) {
		N(this, { climate: { night_by: e } }), e === "entity" && !this.state?.config.climate?.night_entity && this.pickNight();
	}
	async pickNight() {
		let e = this.t;
		if (!e) return;
		let t = this.state?.config.climate?.night_entity, n = await P(this, {
			heading: e("pick.night.title"),
			tip: "pick_night",
			filter: "night",
			selected: t ? [t] : []
		});
		n && N(this, { climate: {
			night_by: "entity",
			night_entity: n.selected[0] ?? null
		} });
	}
};
e([y({ attribute: !1 })], gr.prototype, "hass", void 0), e([y({ attribute: !1 })], gr.prototype, "t", void 0), e([y({ attribute: !1 })], gr.prototype, "state", void 0), e([y({ attribute: !1 })], gr.prototype, "route", void 0), e([y({ attribute: !1 })], gr.prototype, "prefix", void 0), e([y({ attribute: !1 })], gr.prototype, "discovery", void 0), e([y({ attribute: !1 })], gr.prototype, "checks", void 0), e([y({ attribute: !1 })], gr.prototype, "climateFound", void 0), f("joe-hh-night", gr);
//#endregion
//#region src/household-helpers.ts
var _r = "gast";
function vr(e) {
	return Object.values(e.states).filter((e) => e.entity_id.startsWith("group.")).map((e) => ({
		state: e,
		members: e.attributes.entity_id ?? []
	})).filter(({ members: e }) => e.length && e.every((e) => /^(person|device_tracker)\./.test(e))).map(({ state: t, members: n }) => ({
		entity_id: t.entity_id,
		name: _(e, t.entity_id),
		members: n.map((t) => _(e, t))
	}));
}
async function yr(e, t, n) {
	if (!t.callApi || !t.callService) throw Error("no api");
	let r = `input_boolean.${(await t.callWS({
		type: "input_boolean/create",
		name: n("household.guest.name"),
		icon: "mdi:account-child-outline"
	})).id}`, i = `device_tracker.${_r}`;
	return await t.callApi("POST", `config/automation/config/energy_joe_${_r}`, {
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
				dev_id: _r,
				host_name: n("household.guest.tracker_name"),
				location_name: `{{ 'home' if is_state('${r}', 'on') else 'not_home' }}`
			}
		}],
		mode: "queued"
	}), await t.callService("device_tracker", "see", {
		dev_id: _r,
		host_name: n("household.guest.tracker_name"),
		location_name: "not_home"
	}), N(e, { context: {
		guest_switch: r,
		guest_tracker: i
	} }), i;
}
//#endregion
//#region src/editors/household.ts
var br = class extends b {
	constructor(...e) {
		super(...e), this.detailed = !1;
	}
	static {
		this.styles = [T, x`
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
		if (!e || !t || !n) return o;
		let r = (this.discovery?.persons ?? []).filter((e) => Ne(n, `person:${e.entity_id}`) && !n.persons.some((t) => t.id === e.entity_id));
		return E`${n.persons.length ? E`<ul>
            ${n.persons.map((n) => this.renderPerson(e, t, n))}
          </ul>` : E`<p class="empty">${e("household.empty")}</p>`}
      <div class="with-tip add" data-tipped>
        <button type="button" class="mini-btn" @click=${this.addPerson}>
          <ha-icon icon="mdi:account-plus-outline"></ha-icon>${e("household.add")}
        </button>
        ${C(e, "f_person_add")}
      </div>
      ${r.length ? E`<div class="others" data-tipped>
            <span>${e("household.left_out")}</span>
            ${r.map((e) => E`<button type="button" class="mini-btn quiet" @click=${() => this.bringBack(e)}>
                <ha-icon icon="mdi:undo-variant"></ha-icon>${e.name}
              </button>`)}
            ${C(e, "household_left_out")}
          </div>` : o}`;
	}
	renderPerson(e, t, n) {
		let r = n.person_entity ? t.states[n.person_entity]?.state : void 0, i = r === "home" ? E`<small class="home">${e("household.home")}</small>` : r === "not_home" ? E`<small>${e("household.away")}</small>` : r ? E`<small>${e("household.zone", { zone: r })}</small>` : E`<small>${e("household.no_presence")}</small>`;
		return E`<li class="person" data-anchor=${this.detailed ? n.id : o}>
      <div class="top" data-tipped>
        <span class="avatar" aria-hidden="true">${n.name.slice(0, 1).toUpperCase()}</span>
        <div class="who"><b>${n.name}</b>${i}</div>
        <span class="top-actions">
          ${this.detailed ? Nn(e, Mn(t, n.person_entity, n.name)) : o}
          <button type="button" class="mini-btn quiet" @click=${() => this.removePerson(n)}>
            ${e("household.remove")}
          </button>
          ${C(e, "household_remove")}
        </span>
      </div>
      <div class="cals" data-tipped>
        <span class="cals-label">${e("household.calendars")}</span>
        ${n.calendars.map((r) => E`<span class="cal">
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
        ${C(e, "f_calendars")}
      </div>
      ${this.detailed ? E`<slot name=${`p:${n.id}`}></slot>` : o}
    </li>`;
	}
	async addPerson() {
		let { t: e, config: t } = this;
		if (!e || !t) return;
		let n = (await P(this, {
			heading: e("pick.person.title"),
			tip: "pick_person",
			filter: "person",
			selected: [],
			exclude: t.persons.map((e) => e.person_entity).filter((e) => !!e)
		}))?.selected[0];
		if (!n || !this.hass) return;
		let r = this.discovery?.persons.find((e) => e.entity_id === n);
		N(this, {
			persons: { [n]: {
				name: _(this.hass, n),
				person_entity: n,
				calendars: r?.calendars ?? []
			} },
			answers: { ignored: M(t, `person:${n}`, !1) }
		});
	}
	bringBack(e) {
		N(this, {
			persons: { [e.entity_id]: {
				name: e.name,
				person_entity: e.entity_id,
				calendars: e.calendars
			} },
			answers: { ignored: M(this.config, `person:${e.entity_id}`, !1) }
		});
	}
	removePerson(e) {
		N(this, {
			persons: { [e.id]: null },
			answers: { ignored: M(this.config, `person:${e.id}`, !0) }
		});
	}
	async addCalendars(e) {
		let t = this.t;
		if (!t) return;
		let n = await P(this, {
			heading: t("pick.calendar.title", { name: e.name }),
			tip: "pick_calendar",
			filter: "calendar",
			multiple: !0,
			selected: e.calendars
		});
		n && this.setCalendars(e, n.selected);
	}
	setCalendars(e, t) {
		N(this, { persons: { [e.id]: { calendars: t } } });
	}
};
e([y({ attribute: !1 })], br.prototype, "hass", void 0), e([y({ attribute: !1 })], br.prototype, "t", void 0), e([y({ attribute: !1 })], br.prototype, "config", void 0), e([y({ attribute: !1 })], br.prototype, "discovery", void 0), e([y({ type: Boolean })], br.prototype, "detailed", void 0);
var K = class extends b {
	constructor(...e) {
		super(...e), this.card = !1, this.leftOut = [], this.guest = !0, this.creating = !1, this.offerNew = !1;
	}
	static {
		this.styles = [T, x`
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
		if (!e || !t || !n) return o;
		let r = n.context.presence_entity, i = this.card ? E`<div class="head">
          <div class="eyebrow"><ha-icon icon="mdi:account-check-outline"></ha-icon>${e("household.presence")}</div>
          ${C(e, "household_presence")}
        </div>` : E`<div class="with-tip"><b>${e("household.presence")}</b>${C(e, "household_presence")}</div>`;
		if (r) {
			let a = ["on", "home"].includes(t.states[r]?.state ?? "");
			return E`<div class="presence" data-tipped>
        ${i}
        <div class="row">
          <span class="chip ${a ? "ok" : ""}" title=${r}>${_(t, r)}</span>
          <small>${e(a ? "household.presence.on" : "household.presence.off")}</small>
          ${Nn(e, Mn(t, r, _(t, r)))}
        </div>
        <p>${e(r.startsWith("group.") ? "household.presence.yours_group" : "household.presence.yours")}</p>
        ${this.renderGuest(e, t, n, r)}
        <div class="row">
          <button type="button" class="mini-btn" @click=${() => void this.pickPresence()}>${e("household.presence.other")}</button>
          <button type="button" class="mini-btn quiet" @click=${() => N(this, { context: { presence_entity: null } })}>
            ${e("household.presence.stop")}
          </button>
        </div>
      </div>`;
		}
		let a = n.persons.filter((e) => e.person_entity), s = a.filter((e) => !this.leftOut.includes(e.person_entity)), c = vr(t);
		return c.length && !this.offerNew ? E`<div class="presence" data-tipped>
        ${i}
        <p>${e("household.presence.found")}</p>
        ${c.map((t) => E`<div class="row">
            <span class="chip" title=${t.entity_id}>${t.name}</span>
            <small>${t.members.join(", ")}</small>
            <button type="button" class="btn btn-primary" @click=${() => N(this, { context: { presence_entity: t.entity_id } })}>
              ${e("household.presence.use")}
            </button>
          </div>`)}
        <div class="row">
          <button type="button" class="btn btn-ghost" @click=${() => this.offerNew = !0}>${e("household.presence.new_instead")}</button>
        </div>
      </div>` : E`<div class="presence" data-tipped>
      ${i}
      <p>${e("household.presence.propose")}</p>
      <div class="row" role="group" aria-label=${e("household.presence.persons")}>
        ${a.map((e) => {
			let t = !this.leftOut.includes(e.person_entity);
			return E`<button
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
      ${this.failed ? E`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.failed}</span></div>` : o}
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
		if (!i || !a) return E`<div class="guest" data-tipped>
        <div class="with-tip"><b>${e("household.guest")}</b>${C(e, "household_guest")}</div>
        <p>${e("household.guest.offer")}</p>
        ${this.failed ? E`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.failed}</span></div>` : o}
        <div class="row">
          <button type="button" class="btn btn-secondary" ?disabled=${this.creating} @click=${() => void this.addGuest()}>
            ${e(this.creating ? "household.presence.creating" : "household.guest.create")}
          </button>
        </div>
      </div>`;
		let s = t.states[i]?.state === "on", c = t.states[r]?.attributes.entity_id, l = !c || c.includes(a);
		return E`<div class="guest" data-tipped>
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
        ${C(e, "household_guest")}
      </div>
      ${l ? o : E`<div class="note warn">
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
				await yr(this, t, e);
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
				let r = this.guest ? this.config?.context.guest_tracker ?? await yr(this, n, t) : null;
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
		let t = this.config?.context.presence_entity, n = await P(this, {
			heading: e("pick.presence.title"),
			tip: "pick_presence",
			filter: "presence",
			selected: t ? [t] : []
		});
		n?.selected[0] && N(this, { context: { presence_entity: n.selected[0] } });
	}
};
e([y({ attribute: !1 })], K.prototype, "hass", void 0), e([y({ attribute: !1 })], K.prototype, "t", void 0), e([y({ attribute: !1 })], K.prototype, "config", void 0), e([y({ attribute: !1 })], K.prototype, "discovery", void 0), e([y({
	type: Boolean,
	reflect: !0
})], K.prototype, "card", void 0), e([s()], K.prototype, "leftOut", void 0), e([s()], K.prototype, "guest", void 0), e([s()], K.prototype, "creating", void 0), e([s()], K.prototype, "failed", void 0), e([s()], K.prototype, "offerNew", void 0);
var xr = class extends b {
	static {
		this.styles = x`
    :host {
      display: block;
    }
  `;
	}
	render() {
		return E`<joe-household-people
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
e([y({ attribute: !1 })], xr.prototype, "hass", void 0), e([y({ attribute: !1 })], xr.prototype, "t", void 0), e([y({ attribute: !1 })], xr.prototype, "config", void 0), e([y({ attribute: !1 })], xr.prototype, "discovery", void 0), f("joe-household-people", br), f("joe-household-presence", K), f("joe-household", xr);
//#endregion
//#region src/pages/household/people.ts
var Sr = class extends b {
	constructor(...e) {
		super(...e), this.prefix = D, this.checks = [];
	}
	static {
		this.styles = [
			T,
			dr,
			x`
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
		if (!e || !t || !this.hass) return o;
		let n = t.config, r = [...er(e, n, this.climateFound), ...tr(e, n, this.climateFound)], i = !(!this.person || n.persons.some((e) => e.id === this.person));
		return E`<div class="wrap">
      ${sr(e, this.prefix, e("household.people.title"), e("household.people.lead"), r.filter((e, t) => r.findIndex((t) => t.label === e.label) === t))}
      ${i ? E`<div class="note warn" role="status">
            <ha-icon icon="mdi:help-circle-outline"></ha-icon><span>${e("nav.not_found.person")}</span>
          </div>` : o}
      <div class="list-head">
        <span class="eyebrow"><ha-icon icon="mdi:account-group-outline"></ha-icon>${e("household.people.list")}</span>
        ${C(e, "ha_open")}
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
		let r = t.config, i = t.climate?.day, a = t.plan?.meta?.tomorrow, s = a && a.date > ur(this.hass?.config?.time_zone) ? a : void 0, c = [];
		i?.home_office_available && i.labels_state !== "error" && i.home_office.includes(n.name) && c.push(e("household.people.today", { label: e("label.home_office") }));
		let l = s?.labels[n.id];
		l && c.push(e("household.people.tomorrow", { label: e(`label.${l}`) }));
		let u = n.calendars.length > 0, d = ir(e, r, n.id), f = r.learned.presence?.[n.id] ?? {}, p = ot.filter((e) => f[e]).map((t) => e("learn.presence.value", {
			label: e(`label.${t}`),
			hours: v(e.lang, f[t].hours, 0)
		})), m = n.person_entity ? t.climate?.usual?.[n.person_entity] : void 0;
		m != null && p.push(e("household.people.usual", { time: lr(m) }));
		let h = {
			tab: "household",
			section: "days",
			id: n.id
		};
		return E`<div class="extra" slot=${`p:${n.id}`}>
      ${c.length ? E`<p class="days">${c.join(" · ")}</p>` : o}
      ${u ? E`${this.mirror(e("household.people.rules"), e(n.calendar ? "household.people.rules.own" : "household.people.rules.shared"), h, e("mirror.change"))}
            <p class="used-by ${d.length ? "" : "none"}">
              <ha-icon icon=${d.length ? "mdi:car-clock" : "mdi:link-variant-off"}></ha-icon>
              ${d.length ? E`<span class="used-by-label">${e("household.people.counts")}</span>
                    ${d.map((e) => E`<a class="used-by-item" href=${w(this.prefix, e.to)} @click=${O(e.to)}
                          >${e.label}</a
                        >`)}` : e("household.people.counts.none")}
            </p>` : o}
      ${this.mirror(e("household.people.learned"), n.person_entity ? p.length ? p.join(" · ") : e("household.people.learned.none") : e("learn.presence.no_person"), {
			tab: "review",
			section: "learned",
			id: "presence"
		}, e("household.people.more"))}
    </div>`;
	}
	mirror(e, t, n, r) {
		return E`<div class="mirror">
      <div class="mirror-text">
        <span class="mirror-label">${e}</span>
        <span class="mirror-sep" aria-hidden="true">·</span>
        <span class="mirror-value">${t}</span>
      </div>
      <a class="mini-btn go mirror-go" href=${w(this.prefix, n)} @click=${O(n)}>${r}</a>
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
		t && (await t.updateComplete, t.shadowRoot && ie(t.shadowRoot, e) && (this.revealed = e));
	}
};
e([y({ attribute: !1 })], Sr.prototype, "hass", void 0), e([y({ attribute: !1 })], Sr.prototype, "t", void 0), e([y({ attribute: !1 })], Sr.prototype, "state", void 0), e([y({ attribute: !1 })], Sr.prototype, "route", void 0), e([y({ attribute: !1 })], Sr.prototype, "prefix", void 0), e([y({ attribute: !1 })], Sr.prototype, "discovery", void 0), e([y({ attribute: !1 })], Sr.prototype, "checks", void 0), e([y({ attribute: !1 })], Sr.prototype, "climateFound", void 0), e([y({ attribute: !1 })], Sr.prototype, "person", void 0), f("joe-hh-people", Sr);
//#endregion
//#region src/pages/household/presence.ts
var Cr = 15, wr = 240, Tr = "https://my.home-assistant.io/redirect/config_flow_start/?domain=proximity";
function Er(e, t, n) {
	let r = t.routing;
	if (r.service === "google") {
		let t = n?.routing?.google.find((e) => e.entry_id === r.google_entry);
		return e("settings.routing.google", { name: t?.title ?? "Google" });
	}
	return e(r.service ? `settings.routing.${r.service}` : "settings.routing.none");
}
var q = class extends b {
	constructor(...e) {
		super(...e), this.prefix = D, this.checks = [];
	}
	static {
		this.styles = [
			T,
			dr,
			x`
      .way-list {
        margin: 6px 0 0;
      }
    `
		];
	}
	render() {
		let { t: e, state: t } = this;
		if (!e || !t || !this.hass) return o;
		let n = t.config;
		return E`<div class="wrap">
      ${sr(e, this.prefix, e("household.presence.title"), e("household.presence.lead"), er(e, n, this.climateFound))}
      ${this.renderLive(e, t)}
      <joe-household-presence card .hass=${this.hass} .t=${e} .config=${n} .discovery=${this.discovery}></joe-household-presence>
      ${this.renderWay(e, n)}
    </div>`;
	}
	renderLive(e, t) {
		let n = t.climate, r = n?.home ?? [], i = Object.entries(n?.arrivals ?? this.climateFound?.arrivals ?? {}), a = Object.fromEntries(t.config.persons.map((e) => [e.person_entity, e.name])), s = t.config.climate?.away_after_min ?? Cr;
		return E`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:home-account"></ha-icon>${e("household.presence.now")}</div>
        ${C(e, "climate_presence")}
      </div>
      <p class="now">${r.length ? e("climate.home", { names: r.join(", ") }) : e("climate.nobody")}</p>
      ${i.map(([t, n]) => E`<p class="hint">
          ${e(`climate.way.${n.direction === "towards" ? "towards" : n.direction === "away_from" ? "away" : "other"}`, {
			name: a[t] ?? this.hass?.states[t]?.attributes.friendly_name ?? t,
			km: n.km == null ? "–" : v(e.lang, n.km, 1)
		})}
          ${n.direction === "towards" && n.minutes != null ? e(n.source ? "climate.way.minutes_route" : "climate.way.minutes_guess", { minutes: n.minutes }) : o}
        </p>`)}
      <div class="row" data-tipped>
        <span>${e("climate.away_after")}</span>
        <input
          class="input short"
          type="number"
          inputmode="numeric"
          min="0"
          max=${wr}
          step="1"
          aria-label=${e("climate.away_after")}
          .value=${String(s)}
          @change=${(e) => {
			let t = e.target, n = Math.round(Number.parseFloat(t.value.replace(",", ".")));
			if (!Number.isFinite(n)) {
				t.value = String(s);
				return;
			}
			let r = Math.min(wr, Math.max(0, n));
			t.value = String(r), N(this, { climate: { away_after_min: r } });
		}}
        />
        <span>${e("climate.away_after.unit")}</span>
        ${C(e, "climate_away_after")}
      </div>
    </section>`;
	}
	renderWay(e, t) {
		let n = t.climate?.route_eta ?? !0;
		return E`<section class="card" data-anchor="way" data-tipped>
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
          @click=${() => N(this, { climate: { route_eta: !n } })}
        ></button>
        ${C(e, "climate_route_eta")}
      </div>
      ${Pn(e, this.prefix, {
			label: e("household.presence.routing"),
			value: Er(e, t, this.info),
			to: {
				tab: "household",
				section: "travel"
			},
			action: t.routing.service ? "change" : "set"
		})}
      ${this.climateFound && !this.climateFound.proximity ? E`<p class="hint">
            ${e("climate.no_proximity")}
            <a href=${Tr} target="_blank" rel="noreferrer noopener">${e("climate.add_proximity")}</a>
          </p>` : o}
    </section>`;
	}
	willUpdate(e) {
		e.has("anchor") && (this.revealed = void 0);
	}
	updated() {
		this.anchor && this.revealed !== this.anchor && ie(this.renderRoot, this.anchor) && (this.revealed = this.anchor);
	}
};
e([y({ attribute: !1 })], q.prototype, "hass", void 0), e([y({ attribute: !1 })], q.prototype, "t", void 0), e([y({ attribute: !1 })], q.prototype, "state", void 0), e([y({ attribute: !1 })], q.prototype, "route", void 0), e([y({ attribute: !1 })], q.prototype, "prefix", void 0), e([y({ attribute: !1 })], q.prototype, "discovery", void 0), e([y({ attribute: !1 })], q.prototype, "checks", void 0), e([y({ attribute: !1 })], q.prototype, "climateFound", void 0), e([y({ attribute: !1 })], q.prototype, "info", void 0), e([y({ attribute: !1 })], q.prototype, "anchor", void 0), f("joe-hh-presence", q);
//#endregion
//#region src/pages/household/travel.ts
var Dr = class extends b {
	constructor(...e) {
		super(...e), this.prefix = D, this.checks = [];
	}
	static {
		this.styles = [
			T,
			dr,
			Un,
			x`
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
		if (!e || !t || !n) return o;
		let r = t.config;
		return E`<div class="wrap">
      ${sr(e, this.prefix, e("household.travel.title"), e("household.travel.lead"), null)}
      <section class="card">
        ${qn(e, [Yn(this, n, e, r, this.discovery, "weather", (t) => Nn(e, Mn(n, t, _(n, t))))])}
        ${or(e, this.prefix, rr(e, r, "weather", this.climateFound))}
      </section>
      ${this.renderRouting(e, t)}
    </div>`;
	}
	renderRouting(e, t) {
		let n = t.config.routing, r = this.info?.routing, i = n.service === "google" ? `google:${n.google_entry ?? ""}` : n.service ?? "", a = (e) => {
			e.startsWith("google:") ? N(this, { routing: {
				service: "google",
				google_entry: e.slice(7) || null
			} }) : N(this, { routing: {
				service: e || null,
				google_entry: null
			} });
		}, s = (t) => E`<div class="field" data-tipped>
      <span class="field-label"><label for="routing-${t}">${e(`settings.routing.${t}`)}</label>${C(e, "routing_osm")}</span>
      <small class="field-hint">${e(`settings.routing.${t}.hint`)}</small>
      <input
        id="routing-${t}"
        class="input"
        type="url"
        .value=${n[t]}
        @change=${(e) => {
			let n = e.target.value.trim();
			n.startsWith("http") && N(this, { routing: { [t]: n } });
		}}
      />
    </div>`;
		return E`<section class="card">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:map-marker-distance"></ha-icon>${e("settings.routing")}</div>
      </div>
      <p class="say">${e("settings.routing.intro")}</p>
      <div class="field" data-tipped>
        <span class="field-label"><label for="routing-service">${e("settings.routing.service")}</label>${C(e, "routing_service")}</span>
        <small class="field-hint">${e("settings.routing.service.hint")}</small>
        <select id="routing-service" class="input" @change=${(e) => a(e.target.value)}>
          <option value="" ?selected=${i === ""}>${e("settings.routing.none")}</option>
          ${r?.waze === !1 ? o : E`<option value="waze" ?selected=${i === "waze"}>${e("settings.routing.waze")}</option>`}
          ${(r?.google ?? []).map((t) => E`<option value=${`google:${t.entry_id}`} ?selected=${i === `google:${t.entry_id}`}>
                ${e("settings.routing.google", { name: t.title })}
              </option>`)}
          <option value="osm" ?selected=${i === "osm"}>${e("settings.routing.osm")}</option>
        </select>
      </div>
      ${n.service === "osm" ? E`${s("geocoder_url")} ${s("router_url")}` : o}
      ${or(e, this.prefix, rr(e, t.config, "routing", this.climateFound))}
    </section>`;
	}
};
e([y({ attribute: !1 })], Dr.prototype, "hass", void 0), e([y({ attribute: !1 })], Dr.prototype, "t", void 0), e([y({ attribute: !1 })], Dr.prototype, "state", void 0), e([y({ attribute: !1 })], Dr.prototype, "route", void 0), e([y({ attribute: !1 })], Dr.prototype, "prefix", void 0), e([y({ attribute: !1 })], Dr.prototype, "discovery", void 0), e([y({ attribute: !1 })], Dr.prototype, "checks", void 0), e([y({ attribute: !1 })], Dr.prototype, "climateFound", void 0), e([y({ attribute: !1 })], Dr.prototype, "info", void 0), f("joe-hh-travel", Dr);
//#endregion
//#region src/pages/household/index.ts
var Or = {
	people: "joe-hh-people",
	presence: "joe-hh-presence",
	days: "joe-hh-days",
	night: "joe-hh-night",
	travel: "joe-hh-travel"
}, kr = {
	people: "mdi:account-group-outline",
	presence: "mdi:home-account",
	days: "mdi:calendar-check-outline",
	night: "mdi:sleep",
	travel: "mdi:map-marker-path"
}, Ar = class extends b {
	constructor(...e) {
		super(...e), this.prefix = D, this.checks = [];
	}
	static {
		this.styles = [T, x`
      :host {
        display: block;
      }
    `];
	}
	render() {
		let e = this.t;
		if (!e || !this.state) return o;
		let t = this.route?.section ?? de.household, n = se.household.map((t) => ({
			id: t,
			label: e(`nav.household.${t}`),
			icon: kr[t]
		}));
		return E`${wn(e, this.prefix, "household", n, t)}${this.renderSection(t)}`;
	}
	renderSection(e) {
		if (!customElements.get(Or[e])) return E``;
		let { t, hass: n, state: r, prefix: i, route: a, discovery: o, checks: s, climateFound: c, info: l } = this;
		switch (e) {
			case "people": return E`<joe-hh-people
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
			case "presence": return E`<joe-hh-presence
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
			case "days": return E`<joe-hh-days
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
			case "night": return E`<joe-hh-night
          .t=${t}
          .hass=${n}
          .state=${r}
          .prefix=${i}
          .route=${a}
          .discovery=${o}
          .checks=${s}
          .climateFound=${c}
        ></joe-hh-night>`;
			case "travel": return E`<joe-hh-travel
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
e([y({ attribute: !1 })], Ar.prototype, "hass", void 0), e([y({ attribute: !1 })], Ar.prototype, "t", void 0), e([y({ attribute: !1 })], Ar.prototype, "state", void 0), e([y({ attribute: !1 })], Ar.prototype, "route", void 0), e([y({ attribute: !1 })], Ar.prototype, "prefix", void 0), e([y({ attribute: !1 })], Ar.prototype, "discovery", void 0), e([y({ attribute: !1 })], Ar.prototype, "checks", void 0), e([y({ attribute: !1 })], Ar.prototype, "climateFound", void 0), e([y({ attribute: !1 })], Ar.prototype, "info", void 0), f("joe-household-page", Ar);
//#endregion
//#region src/components/chart.ts
var jr = 40, Mr = 10, Nr = 16, Pr = 24;
function Fr(e) {
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
function Ir(e) {
	let t = [], n = [];
	return e.forEach((e, r) => {
		e == null ? (n.length && t.push(n), n = []) : n.push([r, e]);
	}), n.length && t.push(n), t;
}
var J = class extends b {
	constructor(...e) {
		super(...e), this.labels = [], this.ticks = /* @__PURE__ */ new Map(), this.series = [], this.bands = [], this.markers = [], this.unit = "kWh", this.max = 0, this.height = 220, this.label = "", this.lang = "de", this.centerTicks = !1, this.width = 640, this.hover = null;
	}
	static {
		this.styles = x`
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
		if (!e) return o;
		let t = Math.max(260, this.width), n = this.height, r = t - jr - Mr, i = n - Nr - Pr, a = r / e, s = this.series.flatMap((e) => e.values.filter((e) => e != null)), c = this.max || Fr(Math.max(.1, ...s)), l = Math.min(0, ...s), u = l < 0 ? -Math.max(Fr(-l), c / 4) : 0, d = (e) => Nr + i - (Math.max(u, Math.min(e, c)) - u) / (c - u) * i, f = (e) => jr + e * a, p = (e) => jr + (e + .5) * a, m = (e, t = 2) => new Intl.NumberFormat(this.lang, { maximumFractionDigits: t }).format(e), h = [];
		for (let e of this.bands) h.push(S`<rect class="band" x=${f(e.from)} y=${Nr} width=${Math.max(0, f(e.to) - f(e.from))} height=${i}></rect>
        <text class="note" x=${(f(e.from) + f(e.to)) / 2} y=${28} text-anchor="middle">${e.label}</text>`);
		for (let e of u < 0 ? [
			u,
			0,
			c
		] : [
			0,
			c / 2,
			c
		]) h.push(S`<line class="grid" x1=${jr} x2=${t - Mr} y1=${d(e)} y2=${d(e)}></line>
        <text class="tick" x=${34} y=${d(e) + 4} text-anchor="end">${m(e, 2)}</text>`);
		h.push(S`<text class="tick" x=${34} y=${11} text-anchor="end">${this.unit}</text>`);
		for (let [e, t] of this.ticks) h.push(S`<text class="tick" x=${this.centerTicks ? p(e) : f(e)} y=${n - 6}
        text-anchor="middle">${t}</text>`);
		let g = this.series.filter((e) => e.kind === "bar"), _ = a * .68 / Math.max(1, g.length);
		for (let e of this.series) {
			if (e.kind === "bar") {
				let t = a * .16 + g.indexOf(e) * _;
				e.values.forEach((n, r) => {
					if (n != null && n !== 0) {
						let i = Math.min(d(n), d(0));
						h.push(S`<rect x=${f(r) + t} y=${i} width=${Math.max(1, _ - 1)}
              height=${Math.max(1, Math.abs(d(0) - d(n)))} rx="2"
              fill=${n < 0 ? e.negative ?? e.color : e.color}></rect>`);
					}
				});
				continue;
			}
			for (let t of Ir(e.values)) {
				let n = t.map(([e, t]) => `${p(e).toFixed(1)},${d(t).toFixed(1)}`).join(" ");
				if (e.kind === "area" && t.length > 1) {
					let r = d(0).toFixed(1);
					h.push(S`<polygon points=${`${p(t[0][0]).toFixed(1)},${r} ${n} ${p(t[t.length - 1][0]).toFixed(1)},${r}`}
            fill=${e.fill ?? e.color}></polygon>`);
				}
				t.length > 1 ? h.push(S`<polyline points=${n} fill="none" stroke=${e.color} stroke-width=${e.kind === "line" ? 2.4 : 2}
            stroke-linejoin="round" stroke-dasharray=${e.dashed ? "5 4" : "none"}></polyline>`) : h.push(S`<circle cx=${p(t[0][0])} cy=${d(t[0][1])} r="2.5" fill=${e.color}></circle>`);
			}
		}
		for (let e of this.markers) {
			let n = jr + e.at * a, o = n < jr + r * .75;
			h.push(S`<line class="marker" x1=${n} x2=${n} y1=${Nr} y2=${Nr + i}></line>
        <text class="note" x=${o ? n + 4 : n - 4} y=${28} text-anchor=${o ? "start" : "end"}>
          ${t < 520 ? e.short ?? e.label : e.label}
        </text>`);
		}
		this.hover != null && h.push(S`<line class="guide" x1=${p(this.hover)} x2=${p(this.hover)} y1=${Nr} y2=${Nr + i}></line>`);
		for (let t = 0; t < e; t++) h.push(S`<rect class="slot" x=${f(t)} y=${Nr} width=${a} height=${i}
        @pointerenter=${() => this.hover = t} @click=${() => this.hover = t}></rect>`);
		return E`<svg
        viewBox="0 0 ${t} ${n}"
        height=${n}
        role="img"
        aria-label=${this.label}
        @pointerleave=${(e) => e.pointerType === "mouse" && (this.hover = null)}
      >
        ${h}
      </svg>
      ${this.hover == null ? o : this.renderBox(this.hover, p(this.hover), t, m)}`;
	}
	renderBox(e, t, n, r) {
		let i = t + 182 > n ? Math.max(0, t - 182) : t + 12;
		return E`<div class="box" style="left:${i}px">
      <b>${this.labels[e]}</b>
      ${this.series.map((t) => {
			let n = t.values[e];
			return n == null ? o : E`<div>
              <i style="background:${n < 0 ? t.negative ?? t.color : t.color}"></i><span>${t.label}</span
              ><em>${r(n, t.digits ?? 2)} ${this.unit}</em>
            </div>`;
		})}
    </div>`;
	}
};
e([y({ attribute: !1 })], J.prototype, "labels", void 0), e([y({ attribute: !1 })], J.prototype, "ticks", void 0), e([y({ attribute: !1 })], J.prototype, "series", void 0), e([y({ attribute: !1 })], J.prototype, "bands", void 0), e([y({ attribute: !1 })], J.prototype, "markers", void 0), e([y()], J.prototype, "unit", void 0), e([y({ type: Number })], J.prototype, "max", void 0), e([y({ type: Number })], J.prototype, "height", void 0), e([y()], J.prototype, "label", void 0), e([y()], J.prototype, "lang", void 0), e([y({ type: Boolean })], J.prototype, "centerTicks", void 0), e([s()], J.prototype, "width", void 0), e([s()], J.prototype, "hover", void 0), f("joe-chart", J);
//#endregion
//#region src/components/day-answer.ts
var Lr = {
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
}, Rr = class extends b {
	constructor(...e) {
		super(...e), this.date = "", this.changing = !1, this.busy = !1, this.failed = !1;
	}
	static {
		this.styles = [T, x`
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
		if (!e || !this.date || !t && !this.question) return o;
		let n = !t || this.changing;
		return E`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:chat-question-outline"></ha-icon>${e("ask.title")}</div>
        ${C(e, "ask_day")}
      </div>
      ${n ? E`<p>
              ${this.question ? e(`ask.${this.question.kind}`, {
			day: H(e.lang, this.question.date, "weekday"),
			actual: V(e.lang, this.question.actual, 1),
			expected: V(e.lang, this.question.expected, 1)
		}) : e("past.answer.ask")}
            </p>
            <div class="answers" role="group" aria-label=${e("ask.answers")}>
              ${Lr[this.question?.kind ?? "any"].map((n) => E`<button
                    type="button"
                    class="mini-btn ${n === "normal" ? "quiet" : ""}"
                    aria-pressed=${String(n === t)}
                    ?disabled=${this.busy}
                    @click=${() => this.choose(n)}
                  >
                    ${e(`ask.answer.${n}`)}
                  </button>`)}
              ${t ? E`<button type="button" class="mini-btn quiet" ?disabled=${this.busy} @click=${() => this.changing = !1}>
                    ${e("common.cancel")}
                  </button>` : o}
            </div>` : E`<div class="given">
            <p>${e("past.answer.given", { answer: e(`ask.answer.${t}`) })}</p>
            <button type="button" class="mini-btn" @click=${() => this.changing = !0}>
              <ha-icon icon="mdi:pencil-outline"></ha-icon>${e("past.answer.change")}
            </button>
          </div>`}
      ${this.failed ? E`<div class="note warn" role="status"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("error.action")}</div>` : o}
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
e([y({ attribute: !1 })], Rr.prototype, "hass", void 0), e([y({ attribute: !1 })], Rr.prototype, "t", void 0), e([y({ attribute: !1 })], Rr.prototype, "date", void 0), e([y({ attribute: !1 })], Rr.prototype, "answer", void 0), e([y({ attribute: !1 })], Rr.prototype, "question", void 0), e([s()], Rr.prototype, "changing", void 0), e([s()], Rr.prototype, "busy", void 0), e([s()], Rr.prototype, "failed", void 0), e([s()], Rr.prototype, "given", void 0), f("joe-day-answer", Rr);
//#endregion
//#region src/pages/lookback/days.ts
var zr = 14, Br = [
	"var(--joe-c-soc)",
	"var(--joe-c-soc-2)",
	"var(--joe-c-grid)",
	"var(--joe-c-ist)"
];
function Vr(e, t, n) {
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
var Y = class extends b {
	constructor(...e) {
		super(...e), this.prefix = D, this.failed = !1, this.fromStrip = !1, this.reveal = !1;
	}
	static {
		this.styles = [T, x`
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
				days: zr
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
		if (!e) return o;
		if (!this.days?.days.length) return this.renderEmpty(e);
		let t = this.selected;
		return E`<div class="wrap">
      ${a(e("history.title"))} ${A}
      <p class="status">${this.statusText(e)}</p>
      ${this.rebuildLink(e)}
      ${this.failed ? E`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("history.failed")}</div>` : o}
      ${this.renderStrip(e, this.days.days, t)}
      ${this.day && (!t || this.blank) ? E`<div class="note"><ha-icon icon="mdi:calendar-remove-outline"></ha-icon>${e("past.days.unknown", { day: this.dayName(e, this.day) })}</div>` : o}
      ${this.detail && t && !this.blank ? this.renderDay(e, this.detail) : o}
    </div>`;
	}
	dayName(e, t) {
		return /^\d{4}-\d{2}-\d{2}$/.test(t) ? Vr(e.lang, t, "long") : t;
	}
	rebuildLink(e) {
		let t = this.state?.observe;
		if (!t?.active || t.backfill.state === "running") return o;
		let n = {
			tab: "settings",
			section: "maintenance",
			id: "observe"
		};
		return E`<a class="more" href=${w(this.prefix, n)} @click=${O(n)}>${e("past.days.rebuild")}</a>`;
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
		return E`<div class="empty">
      <joe-pose name="inspect"></joe-pose>
      <div>
        ${a(e("history.title"))} ${A}
        <p class="lead">${e(n)}</p>
        ${this.failed ? E`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("history.failed")}</div>` : o}
      </div>
    </div>`;
	}
	renderStrip(e, t, n) {
		let r = t[0].date, i = new Map(t.map((e) => [e.date, e])), a = [];
		for (let e = 13; e >= 0; e--) {
			let t = /* @__PURE__ */ new Date(`${r}T12:00:00Z`);
			t.setUTCDate(t.getUTCDate() - e), a.push(t.toISOString().slice(0, 10));
		}
		let s = Math.max(.1, ...t.flatMap((e) => [e.home ?? 0, e.solar ?? 0]));
		return E`<nav class="strip" aria-label=${e("history.days")}>
      ${a.map((t) => {
			let r = i.get(t), a = E`<small>${Vr(e.lang, t, "short")}</small>
          <b>${Number(t.slice(8))}</b>
          <span class="mini" aria-hidden="true">
            <i style="height:${(r?.home ?? 0) / s * 26}px;background:var(--joe-c-load)"></i>
            <i style="height:${(r?.solar ?? 0) / s * 26}px;background:var(--joe-c-pv)"></i>
          </span>`;
			if (!r) return E`<span aria-disabled="true" aria-label=${Vr(e.lang, t, "long")}>${a}</span>`;
			let c = {
				tab: "review",
				section: "days",
				id: t
			}, l = O(c);
			return E`<a
          href=${w(this.prefix, c)}
          aria-current=${t === n ? "date" : o}
          aria-label=${Vr(e.lang, t, "long")}
          @click=${(e) => {
				if (t === this.day && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
					e.preventDefault();
					return;
				}
				this.fromStrip = !0, l(e), e.defaultPrevented || (this.fromStrip = !1);
			}}
          >${a}</a
        >`;
		})}
    </nav>`;
	}
	renderDay(e, t) {
		let n = t.summary, r = Math.max(0, n.expected - t.hours.filter((e) => e.cov >= .9).length), i = n.sources.live ?? 0, a = (n.sources.stats ?? 0) + (n.sources.history ?? 0);
		return E`<div class="day-head" data-anchor="day">
        <h3>${Vr(e.lang, t.date, "long")}</h3>
        ${t.workday === !0 ? E`<span class="chip">${e("history.workday")}</span>` : t.workday === !1 ? E`<span class="chip">${e("history.day_off")}</span>` : o}
        ${i ? E`<span class="chip ok"><ha-icon icon="mdi:eye-outline"></ha-icon>${e("history.live")}</span>` : o}
        ${a ? E`<span class="chip read"><ha-icon icon="mdi:database-outline"></ha-icon>${e("history.read")}</span>` : o}
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
      ${r && n.date !== this.days?.days[0]?.date ? E`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("history.missing", { hours: r })}</span>
          </div>` : o}`;
	}
	renderTiles(e, t) {
		let n = (t) => t == null ? "–" : v(e.lang, t, 1), r = [], i = (e, t, n, r) => E`<div class="tile">
        <div class="eyebrow">${e}</div>
        <div class="value">${t}<small>${n}</small></div>
        ${r ? E`<div class="sub">${r}</div>` : o}
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
		return E`<div class="tiles">${r}</div>`;
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
		return E`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("history.chart.energy")} ${C(e, "chart_energy")}</div>
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
		return E`<div class="legend">
      ${e.map((e) => E`<span><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color}"></i>${e.label}</span>`)}
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
				color: Br[n % Br.length],
				digits: 0
			};
		});
		if (!n.some((e) => e.values.some((e) => e != null))) return o;
		t.plan_soc_slots.some((e) => e != null) && n.push({
			label: e("history.chart.plan"),
			kind: "line",
			values: t.plan_soc_slots,
			color: "var(--joe-c-ist)",
			dashed: !0,
			digits: 0
		});
		let r = this.chartFrame(t);
		return E`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("history.chart.soc")} ${C(e, "chart_soc")}</div>
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
		if (!t.plan?.fixed) return o;
		if (!n) return E`<div class="note"><ha-icon icon="mdi:timer-sand"></ha-icon><span>${e("history.eval.pending")}</span></div>`;
		if (!n.complete) return E`<div class="note warn">
        <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("history.eval.incomplete")}</span>
      </div>`;
		let r = this.hass?.config?.currency, i = n.saving ?? 0, a = i > .005 ? "good" : i < -.005 ? "bad" : "", s = (t) => V(e.lang, t ?? 0, 1), c = (t) => t ? e("history.eval.clock", { time: this.time(t) }) : e("history.eval.never"), l = !n.final, u = [[e("history.eval.day"), e("history.eval.instead", {
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
		return E`<div class="chart-card" data-tipped>
      <div class="chart-head">
        ${e("history.eval")} ${C(e, "chart_replay")}
        ${l && n.until ? E`<span class="chip warn">${e("history.eval.provisional", { time: this.time(n.until) })}</span>` : o}
      </div>
      <div class="eval-top">
        <div class="eval-big ${a}">
          ${a === "bad" ? Tn(e, -i, r) : Tn(e, i, r)}
          <small>${e(a === "good" ? "history.eval.saved" : a === "bad" ? "history.eval.cost" : "history.eval.same")}</small>
        </div>
        <dl>${u.map(([e, t]) => E`<dt>${e}</dt><dd>${t}</dd>`)}</dl>
      </div>
      ${l && n.until ? E`<div class="note">
            <ha-icon icon="mdi:timer-sand"></ha-icon
            ><span>${e("history.eval.provisional.note", { time: this.time(n.until) })}</span>
          </div>` : o}
      ${d.some((e) => e.values.some((e) => e != null)) ? E`<joe-chart
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
            ${this.legend(d)}` : o}
    </div>`;
	}
	time(e) {
		return e.slice(11, 16);
	}
};
e([y({ attribute: !1 })], Y.prototype, "hass", void 0), e([y({ attribute: !1 })], Y.prototype, "t", void 0), e([y({ attribute: !1 })], Y.prototype, "state", void 0), e([y({ attribute: !1 })], Y.prototype, "prefix", void 0), e([y({ attribute: !1 })], Y.prototype, "route", void 0), e([y({ attribute: !1 })], Y.prototype, "climateFound", void 0), e([y({ attribute: !1 })], Y.prototype, "day", void 0), e([s()], Y.prototype, "days", void 0), e([s()], Y.prototype, "detail", void 0), e([s()], Y.prototype, "failed", void 0), f("joe-lookback-days", Y);
//#endregion
//#region src/learned-view.ts
function Hr(e) {
	return E`<div class="rows">
    ${e.map((e) => E`<div class="row-item">
        <b>${e.name}</b>
        <span class="values">${e.values.map((e) => E`<span>${e}</span>`)}</span>
        ${e.note ? E`<small>${e.note}</small>` : o}
        ${e.extra ? E`<span class="row-extra">${e.extra}</span>` : o}
      </div>`)}
  </div>`;
}
var Ur = x`
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
function Wr(e, t, n, r, i) {
	let a = e.lang, o = n.battery_models?.[r.id], s = r.capacity_kwh, c = t.provenance[`batteries[${r.id}].capacity_kwh`]?.source === "user", l;
	return l = o ? c && s ? e("learn.battery.user", { value: V(a, s, 1) }) : s && (o.capacity_kwh / s < .5 || o.capacity_kwh / s > 1.15) ? e("learn.battery.odd", { value: V(a, s, 1) }) : s ? e("learn.battery.uses_nominal", { value: V(a, s, 1) }) : e("learn.battery.uses") : r.power ? e("learn.battery.learning", { need: i }) : e("learn.battery.no_power"), {
		name: r.name,
		values: o ? [
			e("learn.battery.capacity", { value: V(a, o.capacity_kwh, 1) }),
			e("learn.battery.efficiency", { value: v(a, o.efficiency * 100, 0) }),
			...o.converter ? [e("learn.battery.converter", { value: v(a, o.converter.factor * 100, 0) })] : []
		] : [e("learn.still")],
		note: l
	};
}
function Gr(e, t, n) {
	let r = t.group_models?.[n.id];
	return {
		name: n.name,
		values: r ? [e("learn.groups.average", { value: V(e.lang, r.average, 1) }), r.heat >= .05 ? e("learn.groups.heat", { value: V(e.lang, r.heat, 2) }) : e("learn.groups.steady")] : [e("learn.still")]
	};
}
function Kr(e, t, n) {
	let r = t.action_models?.[n.id];
	return {
		name: n.name,
		values: r ? [
			e("learn.hot_water.rate", { value: V(e.lang, r.rate_k_per_h, 1) }),
			e("learn.hot_water.loss", { value: V(e.lang, r.loss_k_per_h, 1) }),
			e("learn.hot_water.demand", { value: V(e.lang, r.demand_k, 0) })
		] : [e("learn.still")],
		note: r ? void 0 : e("learn.hot_water.learning")
	};
}
function qr(e, t, n) {
	let r = e.lang, i = t.car_models?.[n.id], a = [];
	return i?.consumption != null && (a.push(e("learn.car.consumption", { value: V(r, i.consumption, 1) })), i.cold && a.push(e("learn.car.cold", { value: V(r, i.cold, 2) }))), (i?.workday_km != null || i?.day_off_km != null) && a.push(e("learn.car.km", {
		workday: i.workday_km == null ? "–" : V(r, i.workday_km, 0),
		day_off: i.day_off_km == null ? "–" : V(r, i.day_off_km, 0)
	})), {
		name: n.name,
		values: a.length ? a : [e("learn.still")],
		note: a.length ? void 0 : e(n.need?.odometer_entity ? "learn.car.learning" : "learn.car.no_odometer")
	};
}
function Jr(e) {
	return `${String(Math.floor(e / 60)).padStart(2, "0")}:${String(Math.round(e) % 60).padStart(2, "0")}`;
}
function Yr(e, t, n, r) {
	let i = t.presence?.[n.id] ?? {}, a = ot.filter((e) => i[e]).map((t) => e("learn.presence.value", {
		label: e(`label.${t}`),
		hours: V(e.lang, i[t].hours, 0)
	}));
	r != null && a.push(e("past.learned.presence.usual", { time: Jr(r) }));
	let o;
	return n.person_entity ? n.calendars.length || (o = e("past.learned.presence.no_calendar")) : o = e("learn.presence.no_person"), {
		name: n.name,
		values: a.length ? a : [e("learn.still")],
		note: o
	};
}
function Xr(e) {
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
function Zr(e, t) {
	let n = Math.max(1, Math.ceil(t.length / 7)), r = /* @__PURE__ */ new Map();
	return t.forEach((i, a) => {
		(t.length - 1 - a) % n == 0 && r.set(a, H(e, i, "short"));
	}), r;
}
//#endregion
//#region src/pages/lookback/learned.ts
var Qr = [
	"clear",
	"mixed",
	"overcast"
], $r = {
	forecast_solar: "Forecast.Solar",
	open_meteo_solar_forecast: "Open-Meteo Solar Forecast",
	solcast_solar: "Solcast"
}, ei = [
	"all",
	...lt,
	"climate"
];
function ti(e, t, n) {
	let r = e.base + (t ? e.workday : 0) + e.heat * Math.max(0, 15 - n) + e.cool * Math.max(0, n - 22);
	return e.presence != null && (r += e.presence * (e.presence_mean ?? 0)), Math.max(0, r);
}
var X = class extends b {
	constructor(...e) {
		super(...e), this.prefix = D, this.failed = !1, this.confirming = !1, this.resetting = !1, this.scope = "all";
	}
	static {
		this.styles = [
			T,
			Ur,
			x`
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
      .toggle-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid var(--joe-line);
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
		let t = Xr(this.state);
		e.has("state") && this.marker !== void 0 && t !== this.marker && this.load(), this.marker = t, e.has("anchor") && this.anchor && (this.pending = this.anchor);
	}
	updated() {
		let e = this.pending;
		e && this.data && ie(this.renderRoot, e) && (this.pending = void 0);
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
		if (!e) return o;
		let t = this.data;
		return E`<div class="wrap">
        <div class="intro">
          <div>
            ${a(e("learn.page.title"))} ${A}
            <p class="lead">${e("learn.lead")}</p>
            <p class="status">${this.statusText(e)}</p>
          </div>
          <joe-pose name="learn"></joe-pose>
        </div>
        ${this.failed ? E`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("learn.failed")}</div>` : o}
        ${t ? E`<div class="group" data-anchor="sun">
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
              ${this.renderReset(e)}` : o}
      </div>
      ${this.confirming ? this.renderConfirm(e) : o}`;
	}
	statusText(e) {
		let t = this.state?.observe, n = this.state?.config.learned;
		if (this.state?.mode === "off") return e("learn.paused");
		if (!t?.active) return e("learn.waiting");
		let r = [];
		return n?.since ? r.push(e("learn.since", { day: H(e.lang, n.since) })) : t.first_day && r.push(e("learn.since_start", { day: H(e.lang, t.first_day) })), n?.updated && r.push(e("learn.updated", {
			day: H(e.lang, n.updated, "short"),
			time: n.updated.slice(11, 16)
		})), r.join(" · ");
	}
	goLink(e, t) {
		return E`<a class="go-link" href=${w(this.prefix, e)} @click=${O(e)}>${t}</a>`;
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
		let a = t.solar.slice(-28), s = [{
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
		return E`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:weather-sunny"></ha-icon>${e("learn.solar")}</div>
        ${C(e, "learn_solar")}
      </div>
      <div class="figure">
        <div class="big ${r == null ? "small" : ""}">
          ${r == null ? e("learn.still") : `× ${v(e.lang, r, 2)}`}
        </div>
        ${r == null ? o : E`${g(e, { source: "learned" })}<span class="chip">${e("learn.days", { days: n.solar_days })}</span>`}
      </div>
      <p class="say">${i}</p>
      ${a.length > 1 ? this.chartWithLegend(e, a.map((e) => e.date), s, "kWh", e("learn.solar.chart")) : o}
    </section>`;
	}
	renderShift(e, t) {
		let n = t.learned, r = n.solar_shift;
		return E`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:clock-time-four-outline"></ha-icon>${e("learn.shift")}</div>
        ${C(e, "learn_shift")}
      </div>
      <div class="figure">
        <div class="big ${r == null ? "small" : ""}">${e(r == null ? "learn.still" : `learn.shift.big.${r}`)}</div>
        ${r == null ? o : E`${g(e, { source: "learned" })}<span class="chip">${e("learn.days", { days: n.shift_days })}</span>`}
      </div>
      <p class="say">
        ${r == null ? e("learn.shift.learning", {
			need: t.needs.shift,
			have: n.shift_days
		}) : e(`learn.shift.${r}`)}
      </p>
      ${t.solar_profile ? this.hourChart(e, this.profileSeries(e, t.solar_profile), e("learn.shift.chart")) : o}
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
		return E`<joe-chart
        .labels=${r}
        .ticks=${i}
        .series=${t}
        unit="kWh"
        height="150"
        lang=${e.lang}
        label=${n}
      ></joe-chart>
      <div class="legend">
        ${t.map((e) => E`<span><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color}"></i>${e.label}</span>`)}
      </div>`;
	}
	renderBuffer(e, t) {
		let { value: n, source: r } = t.buffer, i = t.learned, a = (t) => v(e.lang, t * 100, 0), s;
		s = r === "user" ? i.buffer == null ? e("learn.buffer.user") : e("learn.buffer.user_learned", { value: a(i.buffer) }) : r === "learned" ? e("learn.buffer.learned") : e("learn.buffer.default", {
			need: t.needs.buffer,
			have: i.buffer_days
		});
		let c = t.accuracy.slice(-14), l = [{
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
		return E`<section class="card" data-tipped data-anchor="buffer">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:shield-half-full"></ha-icon>${e("learn.buffer")}</div>
        ${C(e, "learn_buffer")}
      </div>
      <div class="figure">
        <div class="big">${a(n)}<small> %</small></div>
        ${g(e, { source: r })}
        ${r === "learned" ? E`<span class="chip">${e("learn.mornings", { count: i.buffer_days })}</span>` : o}
      </div>
      <p class="say">${s}</p>
      ${c.length > 1 ? this.chartWithLegend(e, c.map((e) => e.date), l, "kWh", e("learn.buffer.chart")) : o}
      ${Pn(e, this.prefix, {
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
		let n = t.consumption, r = (t) => V(e.lang, t.reduce((e, t) => e + t, 0), 1), i = [{
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
		return E`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:home-lightning-bolt-outline"></ha-icon>${e("learn.home")}</div>
        ${C(e, "learn_home")}
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
		return E`<joe-chart
        .labels=${t.map((t) => H(e.lang, t, "weekday"))}
        .ticks=${Zr(e.lang, t)}
        .series=${n}
        centerTicks
        unit=${r}
        height="150"
        lang=${e.lang}
        label=${i}
      ></joe-chart>
      <div class="legend">
        ${n.map((e) => E`<span
              ><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color};height:${e.kind === "bar" ? "10px" : "4px"}"></i
              >${e.label}</span
            >`)}
      </div>`;
	}
	renderWeather(e, t) {
		let n = e.lang, r = t.learned.consumption_model, i = t.days.filter((e) => e.temp != null), a = i.filter((e) => !e.excluded).length, s = this.state?.config.context.weather_entity, c;
		if (!s) c = e("learn.model.no_weather");
		else if (!r) c = e("learn.model.learning", {
			need: t.needs.models,
			have: a
		});
		else {
			let t = [e("learn.model.base", { value: V(n, r.base + (r.presence ?? 0) * (r.presence_mean ?? 0), 1) })];
			Math.abs(r.workday) >= .3 && t.push(e(r.workday > 0 ? "learn.model.workday_more" : "learn.model.workday_less", { value: V(n, Math.abs(r.workday), 1) })), r.heat >= .05 && t.push(e("learn.model.heat", { value: V(n, r.heat, 2) })), r.cool >= .05 && t.push(e("learn.model.cool", { value: V(n, r.cool, 2) })), r.presence != null && Math.abs(r.presence) >= .05 && t.push(e("learn.model.presence", { value: V(n, r.presence, 2) })), t.push(e("learn.model.fit", { share: v(n, r.r2 * 100, 0) })), c = t.join(" ");
		}
		let l = r != null && r.heat >= .05;
		return E`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:thermometer"></ha-icon>${e("learn.model")}</div>
        ${C(e, "learn_model")}
      </div>
      <div class="figure">
        <div class="big ${r ? "" : "small"}">
          ${r ? l ? E`+${V(n, r.heat, 2)}<small> kWh/°C</small>` : E`${V(n, r.base + (r.presence ?? 0) * (r.presence_mean ?? 0), 1)}<small> kWh</small>` : e("learn.still")}
        </div>
        ${r ? E`${g(e, { source: "learned" })}<span class="chip">${e("learn.days", { days: r.days })}</span>` : o}
      </div>
      <p class="say">${c}</p>
      ${s ? o : Pn(e, this.prefix, {
			label: e("past.learned.weather"),
			value: e("past.learned.weather.missing"),
			to: {
				tab: "household",
				section: "travel"
			},
			action: "set"
		})}
      ${i.length > 2 ? this.temperatureChart(e, t, r) : o}
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
			values: s.map((e) => ti(n, !0, e + 1)),
			color: "var(--joe-c-soc)",
			digits: 1
		}, {
			label: e("learn.model.chart.day_off"),
			kind: "line",
			values: s.map((e) => ti(n, !1, e + 1)),
			color: "var(--joe-c-soc-2)",
			dashed: !0,
			digits: 1
		});
		let u = Math.max(1, Math.ceil(s.length / 8)), d = /* @__PURE__ */ new Map();
		return s.forEach((e, t) => {
			t % u === 0 && d.set(t, `${c(e)}°`);
		}), E`<joe-chart
        .labels=${s.map((e) => `${c(e)} … ${c(e + 2)} °C`)}
        .ticks=${d}
        .series=${l}
        unit="kWh"
        height="150"
        lang=${e.lang}
        label=${e("learn.model.chart")}
      ></joe-chart>
      <div class="legend">
        ${l.map((e) => E`<span
              ><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color};height:${e.kind === "bar" ? "10px" : "4px"}"></i
              >${e.label}</span
            >`)}
      </div>`;
	}
	renderSources(e, t) {
		let n = e.lang, r = this.state.config, i = t.learned.solar_classes ?? {}, a = i.classes ?? {}, s = r.forecast, c = t.learned.sources ?? {}, l = Qr.filter((e) => a[e]), u = (e) => v(n, e * 100, 0), d = [["main", s.provider ? $r[s.provider] ?? s.provider : e("learn.sources.main")], ...s.alternatives.map((e) => [e.id, e.name])], f = Object.fromEntries(d.map(([e]) => [e, c[e] ? 1 / Math.max(c[e].error, .05) ** 2 : 0])), p = Object.values(f).reduce((e, t) => e + t, 0);
		return E`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:weather-partly-cloudy"></ha-icon>${e("learn.weather")}</div>
        ${C(e, "learn_weather")}
      </div>
      <p class="say">
        ${l.length ? e("learn.weather.say", { top: V(n, i.top ?? 0, 1) }) : e("learn.weather.learning", { have: i.days ?? 0 })}
      </p>
      ${l.length ? Hr(Qr.map((t) => {
			let r = a[t];
			return {
				name: e(`learn.weather.${t}`),
				values: r ? [`× ${v(n, r.factor, 2)}`, e("learn.days", { days: r.days })] : [e("learn.still")]
			};
		})) : o}
      <div class="sub-head">
        <b>${e("learn.sources")}</b>
      </div>
      ${s.alternatives.length ? E`${Hr(d.map(([r, i]) => {
			let a = c[r];
			return {
				name: i,
				values: a ? [
					`× ${v(n, a.factor, 2)}`,
					e("learn.sources.error", { value: u(a.error) }),
					s.combine && p ? e("learn.sources.weight", { value: u(f[r] / p) }) : ""
				] : [e("learn.sources.learning", { need: t.needs.sources })]
			};
		}))}
            <div class="toggle-row">
              <span class="with-tip"><span id="combine-label">${e("learn.sources.combine")}</span>${C(e, "learn_combine")}</span>
              <button
                type="button"
                class="switch"
                role="switch"
                aria-checked=${String(s.combine)}
                aria-labelledby="combine-label"
                @click=${() => N(this, { forecast: { combine: !s.combine } })}
              ></button>
            </div>` : E`<p class="say">${e("learn.sources.single")}</p>`}
    </section>`;
	}
	rowsCard(e, t, n, r, i, a, s, c = o) {
		return E`<section class="card" data-tipped data-anchor=${t}>
      <div class="head">
        <div class="eyebrow"><ha-icon icon=${n}></ha-icon>${r}</div>
        ${i}
      </div>
      ${a.length ? Hr(a) : E`<p class="say">${s}</p>`} ${c}
    </section>`;
	}
	renderBatteries(e, t) {
		let n = this.state.config;
		return this.rowsCard(e, "battery", "mdi:battery-heart-variant", e("learn.battery"), C(e, "learn_battery"), n.batteries.map((r) => Wr(e, n, t.learned, r, t.needs.models)), e("learn.battery.none"));
	}
	renderGroups(e, t) {
		let n = this.state.config.consumers.filter((e) => e.energy_entity && e.kind !== "submeter");
		return this.rowsCard(e, "devices", "mdi:chart-donut", e("learn.groups"), C(e, "learn_groups"), n.map((n) => Gr(e, t.learned, n)), e("learn.groups.none"));
	}
	renderHotWater(e, t) {
		let n = this.state.config.actions.filter((e) => e.kind === "target");
		return this.rowsCard(e, "hot_water", "mdi:water-boiler", e("learn.hot_water"), C(e, "learn_hot_water"), n.map((n) => Kr(e, t.learned, n)), e("learn.hot_water.none"));
	}
	renderCars(e, t) {
		let n = this.state.config.actions.filter((e) => e.kind === "switch" && e.need?.enabled);
		return this.rowsCard(e, "car", "mdi:car-electric", e("learn.car"), C(e, "learn_car"), n.map((n) => qr(e, t.learned, n)), e("learn.car.none"));
	}
	renderClimate(e) {
		let t = this.state.config, n = this.state?.climate?.rates ?? {}, r = this.climateFound?.devices ?? [], i = Object.fromEntries(r.map((e) => [e.entity_id, e.name])), a = Object.entries(t.climate?.rooms ?? {}).filter(([, e]) => e.enabled).map(([e]) => e), s = [.../* @__PURE__ */ new Set([...a, ...Object.keys(n)])].map((t) => {
			let r = n[t];
			return {
				name: i[t] ?? (this.hass ? _(this.hass, t) : t),
				values: r ? [e("past.learned.climate.rate", { rate: v(e.lang, r, 1) })] : [e("learn.still")],
				note: r ? void 0 : e("climate.rate_default")
			};
		});
		return E`<section class="card" data-tipped data-anchor="climate">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:thermostat-auto"></ha-icon>${e("past.learned.climate")}</div>
        ${C(e, "learn_climate")}
      </div>
      ${s.length ? E`<p class="say">${e("past.learned.climate.say")}</p>
            ${Object.keys(n).length ? E`<div class="figure">${g(e, { source: "learned" })}</div>` : o}
            ${Hr(s)}` : E`<p class="say">${e("past.learned.climate.none")}</p>
            ${this.goLink({
			tab: "devices",
			section: "climate"
		}, e("past.learned.climate.open"))}`}
    </section>`;
	}
	renderPresence(e, t) {
		let n = this.state.config, r = this.state?.climate?.usual ?? {}, i = n.persons, a = i.map((n) => {
			let i = Yr(e, t.learned, n, n.person_entity ? r[n.person_entity] : void 0);
			return n.calendars.length ? i : {
				...i,
				extra: this.goLink({
					tab: "household",
					section: "people",
					id: n.id
				}, e("learn.presence.calendars"))
			};
		});
		return this.rowsCard(e, "presence", "mdi:account-clock-outline", e("learn.presence"), C(e, "learn_presence"), a, e("learn.presence.none"), i.length ? o : this.goLink({
			tab: "household",
			section: "people"
		}, e("learn.presence.calendars")));
	}
	renderReset(e) {
		let t = !this.state?.observe?.active && this.scope !== "climate";
		return E`<section class="card danger wide" data-tipped data-anchor="reset">
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:restore"></ha-icon>${e("learn.reset")}</div>
        ${C(e, "learn_reset")}
      </div>
      <p>${e("learn.reset.text")}</p>
      <div class="sub-head with-tip"><b>${e("learn.reset.scope")}</b>${C(e, "learn_reset_scope")}</div>
      <div class="seg scopes" role="group" aria-label=${e("learn.reset.scope")}>
        ${ei.map((t) => E`<button type="button" aria-pressed=${String(this.scope === t)} @click=${() => this.scope = t}>
              ${e(`learn.reset.scope.${t}`)}
            </button>`)}
      </div>
      <div class="actions">
        <button type="button" class="btn btn-danger" ?disabled=${t} @click=${() => this.confirming = !0}>
          ${e(this.scope === "all" ? "learn.reset.button" : "learn.reset.button.scope")}
        </button>
      </div>
      ${t ? E`<p>${e("learn.reset.off")}</p>` : o}
      ${this.notice ? E`<div class="note ${this.notice.ok ? "" : "warn"}" role="status">
            <ha-icon icon=${this.notice.ok ? "mdi:check" : "mdi:alert-outline"}></ha-icon>${this.notice.text}
          </div>` : o}
    </section>`;
	}
	renderConfirm(e) {
		let t = () => {
			this.confirming = !1;
		}, n = this.scope;
		return E`<joe-sheet label=${e("learn.reset.label")} closeLabel=${e("common.close")} @joe-close=${t}>
      <div data-tipped>
        <div class="sheet-title">${a(e("learn.reset.confirm.title"), "h2", C(e, "learn_reset"))}</div>
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
e([y({ attribute: !1 })], X.prototype, "hass", void 0), e([y({ attribute: !1 })], X.prototype, "t", void 0), e([y({ attribute: !1 })], X.prototype, "state", void 0), e([y({ attribute: !1 })], X.prototype, "prefix", void 0), e([y({ attribute: !1 })], X.prototype, "route", void 0), e([y({ attribute: !1 })], X.prototype, "climateFound", void 0), e([y({ attribute: !1 })], X.prototype, "anchor", void 0), e([s()], X.prototype, "data", void 0), e([s()], X.prototype, "failed", void 0), e([s()], X.prototype, "confirming", void 0), e([s()], X.prototype, "resetting", void 0), e([s()], X.prototype, "scope", void 0), e([s()], X.prototype, "notice", void 0), f("joe-lookback-learned", X);
//#endregion
//#region src/components/log.ts
var ni = [
	"all",
	"battery",
	"climate",
	"car",
	"hot_water",
	"other",
	"joe"
];
function ri(e = [], t = []) {
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
function ii(e, t) {
	if (t.area === "climate") return {
		group: "climate",
		device: t.entity
	};
	let n = typeof t.battery == "string" ? t.battery : "";
	if (!n) return { group: "joe" };
	if (n.startsWith("action:")) {
		let t = n.slice(7), r = e?.actions.find((e) => e.id === t);
		return r?.kind === "target" ? {
			group: "hot_water",
			device: t
		} : r?.need?.enabled ? {
			group: "car",
			device: t
		} : {
			group: "other",
			device: r?.consumer_id ?? `action-${t}`
		};
	}
	return {
		group: "battery",
		device: n
	};
}
function ai(e, t, n, r, i) {
	if (r === "climate") return n[i] ?? (t ? _(t, i) : i);
	if (r === "battery") return e?.batteries.find((e) => e.id === i)?.name ?? i;
	let a = i.startsWith("action-") ? i.slice(7) : i;
	return e?.actions.find((e) => e.id === a)?.name ?? e?.consumers.find((e) => e.id === i)?.name ?? i;
}
function oi(e, t, n, r) {
	let i = {
		battery: t?.batteries.find((e) => e.id === n.battery)?.name ?? t?.actions.find((e) => `action:${e.id}` === n.battery)?.name ?? n.battery ?? "",
		entity: n.entity ? r ? _(r, n.entity) : n.entity : "",
		value: n.value == null ? "–" : String(n.value),
		target: String(n.target ?? ""),
		power: typeof n.power == "number" ? v(e.lang, n.power, 1) : "–",
		soc: typeof n.soc == "number" ? v(e.lang, n.soc, 0) : "–",
		unit: typeof n.unit == "string" ? n.unit : "%"
	};
	return n.kind === "boost_end" ? e.optional(`log.boost_end.${String(n.reason)}`, i) ?? e("log.boost_end.stopped", i) : n.kind === "answer" ? e(n.yes ? "log.answer.yes" : "log.answer.no") : n.kind === "test" ? e(n.ok ? "log.test.ok" : "log.test.failed", i) : e.optional(`log.${n.kind}`, i) ?? n.kind;
}
function si(e, t, n, r) {
	let i = n[t.entity] ?? (r ? _(r, t.entity) : t.entity);
	return E`<b>${i}</b> · ${e.optional(`climate.log.${t.what}`) ?? t.what}`;
}
function ci(e, t, n) {
	if (!n || !n.group || n.group === "all") return !0;
	let r = ii(e, t);
	return r.group === n.group && (!n.device || r.device === n.device);
}
var li = class extends b {
	constructor(...e) {
		super(...e), this.names = {}, this.entries = [], this.limit = Infinity;
	}
	static {
		this.styles = [T, x`
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
		if (!e) return o;
		let t = this.entries.filter((e) => ci(this.config, e, this.filter)).slice(0, this.limit);
		return t.length ? E`<ul class="log">
      ${t.map((t) => E`<li>
          <time datetime=${t.at}>${H(e.lang, t.at.slice(0, 10), "short")} ${t.at.slice(11, 16)}</time>
          <span
            >${t.area === "climate" ? si(e, t, this.names, this.hass) : oi(e, this.config, t, this.hass)}</span
          >
        </li>`)}
    </ul>` : E`<p class="empty">${this.empty ?? e("past.log.empty")}</p>`;
	}
};
e([y({ attribute: !1 })], li.prototype, "t", void 0), e([y({ attribute: !1 })], li.prototype, "hass", void 0), e([y({ attribute: !1 })], li.prototype, "config", void 0), e([y({ attribute: !1 })], li.prototype, "names", void 0), e([y({ attribute: !1 })], li.prototype, "entries", void 0), e([y({ attribute: !1 })], li.prototype, "limit", void 0), e([y({ attribute: !1 })], li.prototype, "filter", void 0), e([y({ attribute: !1 })], li.prototype, "empty", void 0), f("joe-log-list", li);
//#endregion
//#region src/pages/lookback/log.ts
var Z = class extends b {
	constructor(...e) {
		super(...e), this.prefix = D, this.failed = !1;
	}
	static {
		this.styles = [T, x`
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
		e.has("group") && this.group && !ni.includes(this.group) && le(this, {
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
		return this.full ?? ri(this.state?.control?.log, this.state?.climate?.log);
	}
	get filter() {
		return ni.includes(this.group ?? "") ? this.group : "all";
	}
	render() {
		let e = this.t;
		if (!e || !this.state) return o;
		let t = this.state.config, n = this.entries, r = this.filter, i = Object.fromEntries((this.climateFound?.devices ?? []).map((e) => [e.entity_id, e.name])), s = /* @__PURE__ */ new Map([["all", n.length]]), c = /* @__PURE__ */ new Map();
		for (let e of n) {
			let n = ii(t, e);
			s.set(n.group, (s.get(n.group) ?? 0) + 1), n.group === r && n.device && c.set(n.device, (c.get(n.device) ?? 0) + 1);
		}
		let l = r === "all" ? void 0 : this.device, u = [e(r === "all" ? "past.log.all" : `past.log.filter.${r}`), ...l ? [ai(t, this.hass, i, r, l)] : []].join(" · ");
		return E`<div class="wrap">
      ${a(e("past.log.title"))} ${A}
      <p class="lead">${e("past.log.lead")}</p>
      <nav class="filters" aria-label=${e("past.log.filters")}>
        ${ni.filter((e) => e === "all" || e === r || s.get(e)).map((t) => this.chip({
			tab: "review",
			section: "log",
			id: t
		}, e(t === "all" ? "past.log.all" : `past.log.filter.${t}`), t === r && !l, s.get(t)))}
      </nav>
      ${r !== "all" && r !== "joe" && (c.size > 1 || l) ? E`<nav class="filters" aria-label=${e("past.log.devices")}>
            ${[.../* @__PURE__ */ new Set([...c.keys(), ...l ? [l] : []])].map((e) => this.chip({
			tab: "review",
			section: "log",
			id: r,
			sub: e
		}, ai(t, this.hass, i, r, e), e === l, c.get(e) ?? 0))}
          </nav>` : o}
      <section class="card" data-tipped>
        <div class="head">
          <div class="eyebrow"><ha-icon icon="mdi:clipboard-text-clock-outline"></ha-icon>${u}</div>
          ${C(e, "past_log")}
        </div>
        ${this.failed && n.length ? E`<div class="note"><ha-icon icon="mdi:information-outline"></ha-icon>${e("past.log.partial")}</div>` : o}
        <joe-log-list
          .t=${e}
          .hass=${this.hass}
          .config=${t}
          .names=${i}
          .entries=${n}
          .filter=${{
			group: r,
			device: l
		}}
          .empty=${n.length ? e("past.log.empty_filter") : e("past.log.empty")}
        ></joe-log-list>
      </section>
    </div>`;
	}
	chip(e, t, n, r) {
		return E`<a
      class="section-chip ${n ? "on" : ""}"
      href=${w(this.prefix, e)}
      aria-current=${n ? "page" : o}
      @click=${O(e, { replace: !0 })}
      >${t}${r == null ? o : E`<span class="section-count">${r}</span>`}</a
    >`;
	}
};
e([y({ attribute: !1 })], Z.prototype, "hass", void 0), e([y({ attribute: !1 })], Z.prototype, "t", void 0), e([y({ attribute: !1 })], Z.prototype, "state", void 0), e([y({ attribute: !1 })], Z.prototype, "prefix", void 0), e([y({ attribute: !1 })], Z.prototype, "route", void 0), e([y({ attribute: !1 })], Z.prototype, "climateFound", void 0), e([y({ attribute: !1 })], Z.prototype, "group", void 0), e([y({ attribute: !1 })], Z.prototype, "device", void 0), e([s()], Z.prototype, "full", void 0), e([s()], Z.prototype, "failed", void 0), f("joe-lookback-log", Z);
//#endregion
//#region src/pages/lookback/result.ts
var ui = class extends b {
	constructor(...e) {
		super(...e), this.prefix = D, this.failed = !1;
	}
	static {
		this.styles = [T, x`
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
		let t = Xr(this.state);
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
		return e ? E`<div class="wrap">
      ${a(e("past.result.title"))} ${A}
      <p class="lead">${e("past.result.lead")}</p>
      ${this.failed ? E`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("learn.failed")}</div>` : o}
      ${this.data ? E`${this.renderResults(e, this.data)} ${this.renderAccuracy(e, this.data)}` : o}
    </div>` : o;
	}
	renderResults(e, t) {
		let n = t.results, r = E`<div class="head">
      <div class="eyebrow"><ha-icon icon="mdi:cash-check"></ha-icon>${e("past.result.total")}</div>
      <span class="pill-sim">${e("mode.simulation")}</span>
      ${C(e, "sim_result")}
    </div>`;
		if (!n?.days) return E`<section class="card hero" data-tipped>${r}
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
		return E`<section class="card hero" data-tipped>
      ${r}
      <div class="figure">
        <div class="big ${n.saving > .005 ? "good" : n.saving < -.005 ? "bad" : ""}">
          ${Tn(e, n.saving, this.currency, !0)}
        </div>
      </div>
      <p class="say">
        ${e("learn.results.say", {
			since: s ? H(e.lang, s) : "–",
			nights: On(e, n.days)
		})}
      </p>
      <p class="split">
        ${e("learn.results.split", {
			better: n.better,
			worse: n.worse,
			same: Math.max(0, n.days - n.better - n.worse)
		})}
      </p>
      ${i.length > 1 ? E`<joe-chart
            .labels=${i.map((t) => H(e.lang, t.date, "weekday"))}
            .ticks=${Zr(e.lang, i.map((e) => e.date))}
            .series=${a}
            centerTicks
            unit=${En(e.lang, this.currency)}
            height="160"
            lang=${e.lang}
            label=${e("learn.results.chart")}
          ></joe-chart>` : o}
    </section>`;
	}
	renderAccuracy(e, t) {
		let n = t.accuracy.slice(-14).reverse(), r = (t) => t == null ? "–" : V(e.lang, t, 1);
		return E`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:target"></ha-icon>${e("learn.accuracy")}</div>
        ${C(e, "learn_accuracy")}
      </div>
      ${n.length ? E`<div class="table" role="table" aria-label=${e("learn.accuracy")}>
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
			return E`<span role="cell"
                  ><a href=${w(this.prefix, n)} @click=${O(n)}>${H(e.lang, t.date, "weekday")}</a></span
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
                  >${Tn(e, t.saving, this.currency, !0)}</span
                >`;
		})}
          </div>` : E`<p class="say">${e("learn.accuracy.none")}</p>`}
    </section>`;
	}
};
e([y({ attribute: !1 })], ui.prototype, "hass", void 0), e([y({ attribute: !1 })], ui.prototype, "t", void 0), e([y({ attribute: !1 })], ui.prototype, "state", void 0), e([y({ attribute: !1 })], ui.prototype, "prefix", void 0), e([y({ attribute: !1 })], ui.prototype, "route", void 0), e([y({ attribute: !1 })], ui.prototype, "climateFound", void 0), e([s()], ui.prototype, "data", void 0), e([s()], ui.prototype, "failed", void 0), f("joe-lookback-result", ui);
//#endregion
//#region src/pages/lookback/index.ts
var di = {
	result: "joe-lookback-result",
	days: "joe-lookback-days",
	learned: "joe-lookback-learned",
	log: "joe-lookback-log"
}, fi = {
	result: "mdi:piggy-bank-outline",
	days: "mdi:calendar-month-outline",
	learned: "mdi:school-outline",
	log: "mdi:format-list-bulleted"
}, pi = class extends b {
	constructor(...e) {
		super(...e), this.prefix = D;
	}
	static {
		this.styles = [T, x`
      :host {
        display: block;
      }
    `];
	}
	render() {
		let e = this.t;
		if (!e || !this.state) return o;
		let t = this.route?.section ?? de.review, n = se.review.map((t) => ({
			id: t,
			label: e(`nav.review.${t}`),
			icon: fi[t]
		}));
		return E`${wn(e, this.prefix, "review", n, t)}${this.renderSection(t)}`;
	}
	renderSection(e) {
		if (!customElements.get(di[e])) return E``;
		let { t, hass: n, state: r, prefix: i, route: a, climateFound: o } = this;
		switch (e) {
			case "result": return E`<joe-lookback-result
          .t=${t}
          .hass=${n}
          .state=${r}
          .prefix=${i}
          .route=${a}
          .climateFound=${o}
        ></joe-lookback-result>`;
			case "days": return E`<joe-lookback-days
          .t=${t}
          .hass=${n}
          .state=${r}
          .prefix=${i}
          .route=${a}
          .climateFound=${o}
          .day=${a?.id}
        ></joe-lookback-days>`;
			case "learned": return E`<joe-lookback-learned
          .t=${t}
          .hass=${n}
          .state=${r}
          .prefix=${i}
          .route=${a}
          .climateFound=${o}
          .anchor=${a?.id}
        ></joe-lookback-learned>`;
			case "log": return E`<joe-lookback-log
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
e([y({ attribute: !1 })], pi.prototype, "hass", void 0), e([y({ attribute: !1 })], pi.prototype, "t", void 0), e([y({ attribute: !1 })], pi.prototype, "state", void 0), e([y({ attribute: !1 })], pi.prototype, "route", void 0), e([y({ attribute: !1 })], pi.prototype, "prefix", void 0), e([y({ attribute: !1 })], pi.prototype, "climateFound", void 0), f("joe-lookback-page", pi);
//#endregion
//#region src/components/texts.ts
function mi(e, t) {
	return t == null ? "–" : v(e.lang, t * 100, 2);
}
function hi(e, t, n = !0) {
	let r;
	return r = t.kind === "fixed_window" && t.window ? t.night_price == null && t.day_price == null ? e("tariff.window_only", {
		start: t.window.start,
		end: t.window.end
	}) : e("find.tariff.window", {
		start: t.window.start,
		end: t.window.end,
		night: mi(e, t.night_price),
		day: mi(e, t.day_price)
	}) : t.kind === "dynamic" ? t.night_price != null && t.day_price != null ? e("find.tariff.dynamic", {
		night: mi(e, t.night_price),
		day: mi(e, t.day_price)
	}) : e("tariff.dynamic") : t.kind === "flat" ? t.day_price == null ? e("tariff.flat") : e("find.tariff.flat", { day: mi(e, t.day_price) }) : e("find.tariff.unknown"), n && t.feed_in_price != null && (r += ` · ${e("find.tariff.feedin", { price: mi(e, t.feed_in_price) })}`), r;
}
function gi(e, t) {
	let n = {};
	for (let [r, i] of Object.entries(t)) typeof i == "number" ? n[r] = v(e.lang, i, 2) : typeof i == "string" && (n[r] = i);
	typeof t.role == "string" && (n.role = e.optional(`role.${t.role}`) ?? t.role);
	let r = `check.${t.code}`;
	return t.code === "grid_sign" && typeof t.expected == "number" && typeof t.actual == "number" && (r = t.expected < 0 ? "check.grid_sign.export" : "check.grid_sign.import", n.expected = v(e.lang, Math.abs(t.expected), 1), n.actual = v(e.lang, Math.abs(t.actual), 1)), e.optional(r, n) ?? t.code;
}
//#endregion
//#region src/components/review.ts
var _i = /* @__PURE__ */ new Set([
	"climate",
	"heat_pump",
	"electric_heating",
	"hot_water"
]), vi = [
	"people",
	"weather",
	"holiday"
], yi = class extends b {
	constructor(...e) {
		super(...e), this.checks = [], this.context = "setup", this.omit = [];
	}
	static {
		this.styles = [
			T,
			Un,
			x`
      :host {
        display: block;
      }
    `
		];
	}
	render() {
		let { hass: e, t, config: n } = this;
		if (!e || !t || !n) return o;
		let r = /* @__PURE__ */ new Set([...this.omit, ...this.context === "settings" ? vi : []]);
		return E`<ul class="found">
      ${this.rows(e, t, n).filter((e) => !r.has(e.key)).map((e) => Kn(t, e))}
    </ul>`;
	}
	rows(e, t, n) {
		let r = this.discovery, i = [], a = r?.energy_dashboard;
		a?.configured && i.push({
			key: "energy",
			icon: "mdi:lightning-bolt",
			title: t("find.energy"),
			detail: t("find.energy.detail", {
				grid: this.count(t, a.grid ?? 0, "word.grid"),
				solar: this.count(t, a.solar ?? 0, "word.solar"),
				battery: this.count(t, a.battery ?? 0, "word.battery"),
				devices: this.count(t, a.devices ?? 0, "word.device")
			}),
			chips: [g(t, { source: "read" })]
		}), i.push(...this.batteryRows(e, t, n)), i.push(this.tariffRow(t, n)), i.push(this.forecastRow(t, n)), i.push(this.powerRow(e, t, n, "grid_power")), i.push(this.powerRow(e, t, n, "home_power")), i.push(this.solarRow(e, t, n));
		let o = (e) => E`<span class="chip ${e ? "ok" : "soon"}">${t(e ? "review.used" : "review.unused")}</span>`;
		for (let e of r?.wallboxes.filter((e) => e.is_car) ?? []) {
			let r = n.actions.some((t) => t.id === `ev_${e.device_id}` || e.mode_entity && t.entity_id === e.mode_entity);
			i.push({
				key: `wallbox:${e.name}`,
				icon: "mdi:ev-station",
				title: t("find.wallbox"),
				detail: `${e.name} · ${t(r ? "review.wallbox.used" : "review.wallbox.unused")}`,
				chips: [o(r)]
			});
		}
		for (let a of r?.cars ?? []) {
			let r = a.entities.soc ? m(e, a.entities.soc) : null, s = [
				a.name,
				r === null ? null : `${v(t.lang, r, 0)} %`,
				a.range_km === null ? null : `${v(t.lang, a.range_km, 0)} km`,
				null
			], c = n.actions.some((e) => e.need?.enabled && (a.entities.soc && e.need.soc_entity === a.entities.soc || a.entities.range && e.need.range_entity === a.entities.range));
			s[3] = t(c ? "review.car.used" : "review.car.unused"), i.push({
				key: `car:${a.device_id}`,
				icon: "mdi:car-electric",
				title: t("find.car"),
				detail: s.filter(Boolean).join(" · "),
				chips: [p(t, a.confidence), o(c)]
			});
		}
		i.push(Yn(this, e, t, n, r, "weather")), i.push(Yn(this, e, t, n, r, "holiday"));
		let s = this.context === "settings", c = [E`<span class="chip soon">${t("review.ask_later")}</span>`];
		!s && (n.persons.length || r?.calendars.length) && i.push({
			key: "people",
			icon: "mdi:account-group-outline",
			title: t("find.people"),
			detail: t("find.people.detail", {
				persons: this.count(t, n.persons.length, "word.person"),
				calendars: this.count(t, r?.calendars.length ?? 0, "word.calendar")
			}),
			chips: c
		});
		let l = n.consumers.filter((e) => e.kind !== "submeter");
		return l.length && i.push({
			key: "devices",
			icon: "mdi:devices",
			title: t("find.devices"),
			detail: t("find.devices.detail", {
				count: this.count(t, l.length, "word.device"),
				heating: l.filter((e) => _i.has(e.kind)).length
			}),
			chips: s ? [] : c,
			tip: s ? "f_consumer_kind" : void 0,
			actions: s ? [this.button(t("review.assign"), "mdi:devices", () => this.edit("consumers"))] : void 0
		}), i;
	}
	batteryRows(e, t, n) {
		let r = [];
		for (let i of n.batteries) {
			let a = this.discovery?.batteries.find((e) => e.id === i.id), o = m(e, i.soc_entity), s = i.capacity_kwh ?? _e(e, i.capacity_entity), c = [
				s ? `${v(t.lang, s, 2)} kWh` : t("review.capacity_unknown"),
				o === null ? null : `${v(t.lang, o, 0)} %`,
				i.adapter === "none" ? t("find.battery.read") : t("find.battery.control")
			], l = this.checks.filter((e) => e.battery_id === i.id).map((e) => this.note(t, e));
			r.push({
				key: `battery:${i.id}`,
				icon: "mdi:home-battery-outline",
				title: i.name,
				detail: c.filter(Boolean).join(" · "),
				chips: [g(t, j(n, `batteries[${i.id}].soc_entity`)), ...a ? [p(t, a.confidence)] : []],
				reasons: a?.reasons,
				notes: l,
				state: this.checks.some((e) => e.battery_id === i.id && e.level === "warn") ? "flag" : void 0,
				tip: "review_battery",
				actions: [this.button(t("review.change"), "mdi:pencil-outline", () => this.edit("battery", i.id)), this.button(t("review.ignore"), "", () => this.ignoreBattery(i.id), !0)]
			});
		}
		for (let e of this.discovery?.batteries ?? []) Ne(n, `battery:${e.id}`) && !n.batteries.some((t) => t.id === e.id) && r.push({
			key: `battery:${e.id}`,
			icon: "mdi:home-battery-outline",
			title: e.name,
			detail: t("review.ignored"),
			state: "ignored",
			tip: "review_ignored",
			actions: [this.button(t("review.use"), "mdi:undo-variant", () => this.useBattery(e))]
		});
		let i = !n.batteries.length && !this.discovery?.batteries.length;
		return (i || this.context === "settings") && r.push({
			key: "battery:add",
			icon: "mdi:home-battery-outline",
			title: t(i ? "review.battery" : "review.battery.more"),
			detail: t(i ? "review.battery.none" : "review.battery.more_detail"),
			state: "missing",
			tip: "review_battery_add",
			actions: [this.button(t("review.add"), "mdi:plus", () => this.addBattery())]
		}), r;
	}
	ignoreBattery(e) {
		N(this, {
			batteries: { [e]: null },
			answers: { ignored: M(this.config, `battery:${e}`, !0) }
		});
	}
	useBattery(e) {
		let t = this.config;
		N(this, {
			batteries: { [e.id]: {
				name: e.name,
				adapter: e.adapter,
				soc_entity: e.soc_entity,
				power: e.power,
				capacity_kwh: e.capacity_kwh,
				capacity_entity: e.capacity_entity,
				max_charge_w: e.max_charge_w,
				max_discharge_w: e.max_discharge_w,
				device_id: e.device_id,
				controls: e.controls,
				priority: Math.min(t.batteries.length + 1, 9)
			} },
			answers: { ignored: M(t, `battery:${e.id}`, !1) }
		}, "read");
	}
	async addBattery() {
		let { t: e, hass: t, config: n } = this;
		if (!e || !t || !n) return;
		let r = (await P(this, {
			heading: e("pick.battery.title"),
			tip: "pick_battery",
			filter: "soc",
			selected: [],
			exclude: n.batteries.map((e) => e.soc_entity)
		}))?.selected[0];
		if (!r) return;
		let i = t.entities?.[r]?.device_id, a = i && !n.batteries.some((e) => e.id === i) ? i : r;
		N(this, { batteries: { [a]: {
			name: i && (t.devices?.[i]?.name_by_user || t.devices?.[i]?.name) || _(t, r),
			adapter: "none",
			soc_entity: r,
			device_id: i ?? null,
			priority: Math.min(n.batteries.length + 1, 9)
		} } });
	}
	tariffRow(e, t) {
		let n = t.tariff, r = n.kind === "unknown";
		return {
			key: "tariff",
			icon: "mdi:cash-clock",
			title: this.discovery?.tariff.provider ?? e("find.tariff"),
			detail: hi(e, n),
			chips: r ? [] : [g(e, j(t, "tariff.kind")), ...this.discovery && this.discovery.tariff.kind !== "unknown" ? [p(e, this.discovery.tariff.confidence)] : []],
			reasons: this.discovery?.tariff.reasons,
			notes: r ? [this.info(e("review.tariff.ask"))] : [],
			state: r ? "missing" : void 0,
			tip: "review_tariff",
			actions: [this.button(e(r ? "review.enter" : "review.change"), "mdi:pencil-outline", () => this.edit("tariff"))]
		};
	}
	forecastRow(e, t) {
		let n = this.discovery?.forecast, r = Ne(t, "forecast"), i = {
			key: "forecast",
			icon: "mdi:weather-sunny",
			title: e("find.forecast"),
			tip: "review_forecast"
		};
		return t.forecast.provider ? {
			...i,
			detail: n ? e("find.forecast.detail", {
				provider: n.provider_name,
				planes: this.count(e, n.planes, "word.plane"),
				today: n.today_kwh == null ? "–" : v(e.lang, n.today_kwh, 1),
				tomorrow: n.tomorrow_kwh == null ? "–" : v(e.lang, n.tomorrow_kwh, 1)
			}) : t.forecast.provider,
			chips: [g(e, j(t, "forecast.provider")), ...n ? [p(e, n.confidence)] : []],
			reasons: n?.reasons,
			actions: [this.button(e("review.ignore"), "", () => this.ignoreForecast(), !0)]
		} : r && n ? {
			...i,
			detail: e("review.ignored"),
			state: "ignored",
			actions: [this.button(e("review.use"), "mdi:undo-variant", () => this.useForecast())]
		} : {
			...i,
			detail: e("find.none"),
			state: "missing",
			notes: [this.info(e("review.forecast.none"))],
			tip: void 0
		};
	}
	ignoreForecast() {
		N(this, {
			forecast: {
				provider: null,
				config_entries: [],
				today: [],
				tomorrow: [],
				remaining_today: [],
				alternatives: []
			},
			answers: { ignored: M(this.config, "forecast", !0) }
		});
	}
	useForecast() {
		let e = this.discovery?.forecast;
		e && N(this, {
			forecast: {
				provider: e.provider,
				config_entries: e.config_entries ?? [],
				today: e.today ?? [],
				tomorrow: e.tomorrow ?? [],
				remaining_today: e.remaining_today ?? [],
				alternatives: (e.others ?? []).map((e) => ({
					id: e.provider,
					name: e.provider_name,
					provider: e.provider,
					tomorrow: e.tomorrow
				}))
			},
			answers: { ignored: M(this.config, "forecast", !1) }
		}, "read");
	}
	powerRow(e, t, n, a) {
		let o = n.measurements[a], s = this.discovery?.measurements[a] ?? null, c = a === "grid_power", l = Ne(n, a), u = {
			key: a,
			icon: c ? "mdi:transmission-tower" : "mdi:home-lightning-bolt-outline",
			title: t(c ? "find.grid" : "find.home"),
			tip: c ? "review_grid" : "review_home"
		}, d = this.button(t(o ? "review.change" : "review.choose"), "mdi:magnify", () => this.pickPower(a));
		if (!o && !c && n.measurements.grid_power) return {
			...u,
			detail: t("review.home.balance"),
			notes: this.homeNotes(t, n),
			actions: [d, this.button(t("review.home.devices"), "mdi:devices", () => this.edit("consumers"))]
		};
		if (!o) return l ? {
			...u,
			detail: t("review.home.computed"),
			state: "ignored",
			actions: [this.button(t("review.choose"), "mdi:magnify", () => this.pickPower(a))]
		} : {
			...u,
			detail: t("find.none"),
			state: "missing",
			notes: [this.info(t(c ? "review.grid.none" : "review.home.none"))],
			actions: c ? [d] : [d, this.button(t("review.home.without"), "", () => this.ignore("home_power", { measurements: { home_power: null } }), !0)]
		};
		let f = r(e, o), m = i(e, o.entity_id, t.lang);
		if (f !== null) {
			let e = v(t.lang, Math.abs(f), 2);
			m = c ? t(f >= 0 ? "live.import" : "live.export", { value: e }) : t("live.kw", { value: v(t.lang, f, 2) });
		}
		let h = this.checks.filter((e) => e.code !== "missing" && (e.role === a || c && e.code === "grid_sign" || !c && e.code === "home_negative")), y = h.map((e) => e.code === "grid_sign" ? this.note(t, e, [this.button(t("review.invert"), "mdi:swap-vertical", () => this.setPower(a, {
			...o,
			invert: !o.invert
		})), this.button(t("review.keep"), "mdi:check", () => this.confirm(`grid_sign:${o.entity_id}`), !0)]) : e.code === "home_negative" ? this.note(t, e, [this.button(t("review.invert"), "mdi:swap-vertical", () => this.setPower(a, {
			...o,
			invert: !o.invert
		}))]) : this.note(t, e)), ee = s?.entity.entity_id === o.entity_id;
		return !c && n.measurements.grid_power ? {
			...u,
			detail: `${t("review.home.balance")} · ${t("review.home.compare", {
				name: _(e, o.entity_id),
				live: m
			})}`,
			chips: [g(t, j(n, `measurements.${a}`))],
			notes: [...this.homeNotes(t, n), ...y],
			state: h.some((e) => e.level === "warn") ? "flag" : void 0,
			actions: [d, this.button(t("review.home.devices"), "mdi:devices", () => this.edit("consumers"))]
		} : {
			...u,
			detail: `${_(e, o.entity_id)} · ${m}`,
			chips: [g(t, j(n, `measurements.${a}`)), ...s && ee ? [p(t, s.confidence)] : []],
			reasons: ee ? s?.reasons : void 0,
			notes: y,
			state: h.some((e) => e.level === "warn") ? "flag" : void 0,
			actions: [d]
		};
	}
	homeNotes(e, t) {
		let n = [], r = ct(t.consumers);
		if (r.length) {
			let t = r.map((t) => t.kind === "ev" || t.runs === "always" || !t.runs ? t.name : `${t.name} (${e(`runs.${t.runs}`)})`).join(", ");
			n.push(this.info(e(r.some((e) => e.kind === "ev") ? "review.home.flexible" : "review.home.flexible_some", { names: t })));
		} else t.consumers.some((e) => e.kind !== "submeter") && n.push(this.info(e("review.home.flexible_none")));
		let i = t.learned.home_check;
		if (i && i.calc_kwh > 0) {
			let t = (i.sensor_kwh - i.calc_kwh) / i.calc_kwh;
			Math.abs(t) >= .1 && n.push(this.info(e("review.home.off", {
				days: i.days,
				pct: v(e.lang, Math.abs(t) * 100, 0),
				direction: e(t < 0 ? "review.home.less" : "review.home.more")
			})));
		}
		return n;
	}
	async pickPower(e) {
		let { t, config: n } = this;
		if (!t || !n) return;
		let r = n.measurements[e], i = this.discovery?.measurements[e], a = e === "grid_power", o = await P(this, {
			heading: t(a ? "pick.grid.title" : "pick.home.title"),
			tip: a ? "pick_grid" : "pick_home",
			filter: "power",
			selected: r ? [r.entity_id] : [],
			suggestions: Pe(i ? [Fe(i)] : [], i?.alternatives),
			measurement: {
				invert: r?.invert ?? i?.measurement.invert ?? !1,
				role: a ? "grid" : "home"
			}
		}), s = o?.selected[0];
		if (!o || !s) return;
		let c = { measurements: { [e]: {
			entity_id: s,
			invert: o.invert,
			minus_entity_id: null
		} } };
		Ne(n, e) && (c.answers = { ignored: M(n, e, !1) }), N(this, c);
	}
	setPower(e, t) {
		N(this, { measurements: { [e]: t } });
	}
	solarRow(e, t, n) {
		let r = n.measurements.solar_power, i = this.discovery?.measurements.solar_power ?? null, a = {
			key: "solar_power",
			icon: "mdi:solar-panel",
			title: t("find.solar"),
			tip: "review_solar"
		};
		if (!r.length) return Ne(n, "solar_power") ? {
			...a,
			detail: t("review.solar.without"),
			state: "ignored",
			actions: [this.button(t("review.choose"), "mdi:magnify", () => this.pickSolar())]
		} : {
			...a,
			detail: t("find.none"),
			state: "missing",
			actions: [this.button(t("review.choose"), "mdi:magnify", () => this.pickSolar()), this.button(t("review.solar.none"), "", () => this.ignore("solar_power", { measurements: { solar_power: [] } }), !0)]
		};
		let o = ce(e, r), s = this.checks.filter((e) => e.role === "solar_power" && e.code !== "missing").map((e) => this.note(t, e));
		return {
			...a,
			detail: t("find.solar.detail", {
				count: this.count(t, r.length, "word.sensor"),
				total: o === null ? "–" : v(t.lang, o, 2)
			}),
			chips: [g(t, j(n, "measurements.solar_power")), ...i ? [p(t, i.confidence)] : []],
			reasons: i?.reasons,
			notes: s,
			state: s.length && this.checks.some((e) => e.role === "solar_power" && e.level === "warn") ? "flag" : void 0,
			actions: [this.button(t("review.change"), "mdi:magnify", () => this.pickSolar())]
		};
	}
	async pickSolar() {
		let { t: e, config: t } = this;
		if (!e || !t) return;
		let n = t.measurements.solar_power, r = this.discovery?.measurements.solar_power, i = await P(this, {
			heading: e("pick.solar.title"),
			tip: "pick_solar",
			filter: "power",
			multiple: !0,
			selected: n.map((e) => e.entity_id),
			suggestions: Pe((r?.entities ?? []).map((e) => ({
				entity_id: e.entity_id,
				confidence: r?.confidence,
				reasons: r?.reasons
			})), r?.alternatives)
		});
		if (!i) return;
		let a = { measurements: { solar_power: i.selected.map((e) => n.find((t) => t.entity_id === e) ?? {
			entity_id: e,
			invert: !1,
			minus_entity_id: null
		}) } };
		Ne(t, "solar_power") && (a.answers = { ignored: M(t, "solar_power", !1) }), N(this, a);
	}
	ignore(e, t) {
		N(this, {
			...t,
			answers: { ignored: M(this.config, e, !0) }
		});
	}
	confirm(e) {
		let t = this.config.answers.confirmed.filter((t) => t !== e);
		N(this, { answers: { confirmed: [...t, e] } });
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
	button(e, t, n, r = !1) {
		return Wn(e, t, n, r);
	}
	info(e) {
		return Gn(e);
	}
	note(e, t, n = []) {
		return E`<div class="note ${t.level}">
      <ha-icon icon=${t.level === "warn" ? "mdi:alert-outline" : "mdi:information-outline"}></ha-icon>
      <div>
        <span>${gi(e, t)}</span>
        ${n.length ? E`<div class="note-actions">${n}</div>` : o}
      </div>
    </div>`;
	}
	count(e, t, n) {
		let [r, i] = e(n).split("|");
		return `${v(e.lang, t, 0)} ${t === 1 ? r : i}`;
	}
};
e([y({ attribute: !1 })], yi.prototype, "hass", void 0), e([y({ attribute: !1 })], yi.prototype, "t", void 0), e([y({ attribute: !1 })], yi.prototype, "config", void 0), e([y({ attribute: !1 })], yi.prototype, "discovery", void 0), e([y({ attribute: !1 })], yi.prototype, "checks", void 0), e([y()], yi.prototype, "context", void 0), e([y({ attribute: !1 })], yi.prototype, "omit", void 0), f("joe-review", yi);
//#endregion
//#region src/components/step-nav.ts
function bi(e, t, n = !1) {
	let r = E`<button type="button" class="btn btn-primary" ?data-notip=${!t.nextTip} @click=${t.next}>
    ${t.nextLabel}<ha-icon icon="mdi:chevron-right"></ha-icon>
  </button>`;
	return E`<nav class="step-nav ${n ? "wide" : ""}" aria-label=${e("onb.nav")}>
    ${t.back ? E`<button type="button" class="btn btn-ghost" data-notip @click=${t.back}>
          <ha-icon icon="mdi:chevron-left"></ha-icon>${t.backLabel ?? e("onb.back")}
        </button>` : E`<span></span>`}
    ${t.nextTip ? E`<span class="with-tip" data-tipped>${r} ${C(e, t.nextTip)}</span>` : r}
  </nav>`;
}
//#endregion
//#region src/pages/questions.ts
var xi = {
	tariff: "plan",
	feed_in: "plug",
	capacity: "night-charge",
	heating: "ask",
	hot_water: "hot-water",
	ev: "ev",
	household: "relax"
}, Si = [
	"climate",
	"heat_pump",
	"electric_heating"
];
function Ci(e) {
	let t = [], n = (t) => j(e, t)?.source === "user", r = (t) => e.answers[t] !== void 0 && e.answers[t] !== null, i = e.tariff;
	(i.kind === "unknown" || n("tariff.kind") || r("tariff")) && t.push("tariff"), (i.feed_in_price == null && !i.feed_in_entity || n("tariff.feed_in_price") || r("feed_in")) && t.push("feed_in");
	for (let i of e.batteries) {
		let e = `capacity:${i.id}`;
		(i.capacity_kwh == null && !i.capacity_entity || n(`batteries[${i.id}].capacity_kwh`) || r(e)) && t.push(e);
	}
	return t.push("heating", "hot_water", "ev", "household"), t;
}
var wi = class extends b {
	constructor(...e) {
		super(...e), this.single = "", this.index = 0;
	}
	static {
		this.styles = [T, x`
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
		if (!e || !t) return o;
		if (this.single) return this.renderQuestion(e, t, this.single);
		let n = Ci(t), r = Math.min(this.index, n.length - 1), i = n[r], a = r === n.length - 1, s = bi(e, {
			back: () => this.move(-1, n.length),
			next: () => this.move(1, n.length),
			nextLabel: e(a ? "ask.finish" : "onb.next")
		});
		return E`${s}
      <div class="wrap">
        <joe-pose name=${xi[i.split(":")[0]] ?? "ask"}></joe-pose>
        <div>
          <nav class="topics" aria-label=${e("ask.topics")} data-notip>
            <span class="eyebrow">${e("ask.count", {
			n: r + 1,
			total: n.length
		})}</span>
            ${n.map((n, i) => E`${i ? E`<ha-icon class="arrow" icon="mdi:chevron-right" aria-hidden="true"></ha-icon>` : o}<button
                type="button"
                class="topic ${i < r ? "done" : ""}"
                aria-current=${i === r ? "step" : "false"}
                @click=${() => this.index = i}
              >
                ${i < r ? E`<ha-icon icon="mdi:check"></ha-icon>` : o}${this.topic(e, t, n)}
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
			case "tariff": return this.question(e("q.tariff.title"), "q_tariff", E`<joe-tariff-form
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
			default: return this.question(e("q.household.title"), "q_household", E`<joe-household
            .hass=${this.hass}
            .t=${e}
            .config=${t}
            .discovery=${this.discovery}
          ></joe-household>`);
		}
	}
	question(e, t, n) {
		let r = this.t;
		return E`<div data-tipped>
      <div class="title-row">${a(e, "h2", C(r, t))}</div>
      ${A}
      <div class="content">${n}</div>
    </div>`;
	}
	choice(e, t, n, r = !1) {
		let i = this.config?.answers[t];
		return E`<joe-choice
      .options=${n}
      .value=${Array.isArray(i) ? i : typeof i == "string" ? [i] : []}
      ?multiple=${r}
      .exclusive=${["none"]}
      idk=${e("ask.idk")}
      @joe-choice=${(e) => N(this, { answers: { [t]: r ? e.detail.value : e.detail.value[0] ?? null } })}
    ></joe-choice>`;
	}
	renderHotWater(e, t) {
		let n = t.answers.hot_water, r = n === "hot_water_heat_pump" || n === "electric", i = t.consumers.filter((e) => e.kind === "hot_water"), a = t.actions.find((e) => e.kind === "target");
		return this.question(e("q.hot_water.title"), "q_hot_water", E`${this.choice(e, "hot_water", [
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
      ${r ? E`<div class="follow">
            <p class="hint">${i.length ? e("q.hot_water.devices") : e("q.hot_water.no_devices")}</p>
            ${i.length ? E`<div class="chips">${i.map((e) => E`<span class="chip learned">${e.name}</span>`)}</div>` : o}
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
              ${C(e, "q_hot_water_action")}
            </div>
          </div>` : o}`);
	}
	renderHeating(e, t) {
		let n = t.answers.heating, r = Array.isArray(n) ? n : [], i = t.consumers.filter((e) => r.includes(e.kind)), a = r.some((e) => Si.includes(e));
		return this.question(e("q.heating.title"), "q_heating", E`${this.choice(e, "heating", [
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
        ${a && t.consumers.length ? E`<div class="follow">
              <p class="hint">${i.length ? e("q.heating.devices") : e("q.heating.no_devices")}</p>
              ${i.length ? E`<div class="chips">
                    ${i.map((e) => E`<span class="chip learned">${e.name}</span>`)}
                  </div>` : o}
              <div class="with-tip" style="margin-top:10px">
                <button type="button" class="mini-btn" @click=${() => this.edit("consumers")}>
                  <ha-icon icon="mdi:devices"></ha-icon>${e("q.heating.assign")}
                </button>
                ${C(e, "f_consumer_kind")}
              </div>
            </div>` : o}`);
	}
	renderFeedIn(e, t) {
		let n = t.tariff.feed_in_price, r = t.answers.feed_in === bt;
		return this.question(e("q.feed_in.title"), "q_feed_in", E`<div class="inline">
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
			N(this, {
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
          @click=${() => N(this, {
			tariff: { feed_in_price: 0 },
			answers: { feed_in: "none" }
		})}
        >
          ${e("q.feed_in.none")}
        </button>
        <button
          type="button"
          class="mini-btn ${r ? "go" : ""}"
          @click=${() => N(this, {
			tariff: { feed_in_price: null },
			answers: { feed_in: bt }
		})}
        >
          ${e("ask.idk")}
        </button>
      </div>`);
	}
	renderCapacity(e, t, n) {
		let r = t.batteries.find((e) => e.id === n);
		if (!r) return E``;
		let i = `capacity:${n}`, a = t.answers[i] === bt;
		return this.question(e("q.capacity.title", { name: r.name }), "q_capacity", E`<div class="inline">
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
			N(this, {
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
          @click=${() => N(this, {
			batteries: { [n]: { capacity_kwh: null } },
			answers: { [i]: bt }
		})}
        >
          ${e("ask.idk_learn")}
        </button>
      </div>`);
	}
	saveTariff(e) {
		let t = { tariff: e };
		e.kind && (t.answers = { tariff: e.kind }), N(this, t);
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
e([y({ attribute: !1 })], wi.prototype, "hass", void 0), e([y({ attribute: !1 })], wi.prototype, "t", void 0), e([y({ attribute: !1 })], wi.prototype, "config", void 0), e([y({ attribute: !1 })], wi.prototype, "discovery", void 0), e([y()], wi.prototype, "single", void 0), e([s()], wi.prototype, "index", void 0), f("joe-questions", wi);
//#endregion
//#region src/pages/onboarding.ts
function Ti(e, t, n) {
	let [r, i] = e(n).split("|");
	return `${v(e.lang, t, 0)} ${t === 1 ? r : i}`;
}
var Ei = {
	climate: "q.heating.climate",
	heat_pump: "q.heating.heat_pump",
	electric_heating: "q.heating.electric",
	none: "q.heating.none"
}, Di = class extends b {
	constructor(...e) {
		super(...e), this.step = "welcome", this.checks = [], this.discovering = !1, this.discoveryFailed = !1;
	}
	static {
		this.styles = [T, x`
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
		if (!e) return o;
		switch (this.step) {
			case "welcome": return this.layout("welcome", E`${a(e("onb.welcome.title"), "h1")} ${A}
            <p class="lead">${e("onb.welcome.lead")}</p>
            <div class="calm"><span class="pill-sim">${e("mode.simulation")}</span>${e("onb.calm")}</div>
            <details data-notip>
              <summary>${e("onb.welcome.more")}</summary>
              ${e("onb.welcome.more.text").split("\n").map((e) => E`<p>${e}</p>`)}
            </details>
            <div class="actions" data-tipped>
              <button type="button" class="btn btn-primary" @click=${() => this.go("scan")}>
                ${e("onb.welcome.go")}
              </button>
              ${C(e, "scan_start")}
            </div>`);
			case "scan": return this.renderScan(e);
			case "questions": return E`<joe-questions
          .hass=${this.hass}
          .t=${e}
          .config=${this.config}
          .discovery=${this.discovery}
        ></joe-questions>`;
			case "done": return this.renderDone(e);
		}
	}
	renderScan(e) {
		if (this.discovering || !this.discovery && !this.discoveryFailed) return this.layout("scout", E`${a(e("onb.scan.title"))} ${A}
          <p class="lead">${e("onb.scan.lead")}</p>
          ${this.renderEnergy(e)}
          <div class="looking" role="status">${e("scan.looking")}</div>`);
		let t = bi(e, {
			back: () => this.go("welcome"),
			next: () => this.go("questions"),
			nextLabel: e("onb.next")
		}, !0);
		return E`${t}
      <div class="wrap wide">
        <joe-pose name="scout"></joe-pose>
        <div>
          ${a(e("scan.title"))} ${A}
          <p class="lead">${e("scan.lead")}</p>
          ${this.discoveryFailed ? E`<p class="failed">${e("scan.failed")}</p>` : o}
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
              ${C(e, "rescan")}
            </span>
            <button type="button" class="btn btn-ghost" data-notip @click=${() => this.go("welcome")}>
              ${e("onb.back")}
            </button>
          </div>
        </div>
      </div>`;
	}
	renderDone(e) {
		let t = bi(e, {
			back: () => this.go("scan"),
			backLabel: e("onb.done.change"),
			next: () => this.complete(),
			nextLabel: e("onb.done.go"),
			nextTip: "start"
		});
		return E`${t}
    ${this.layout("thumbs", E`${a(e("onb.done.title"))} ${A}
        ${this.config ? this.renderSummary(e, this.config) : o}
        <div class="calm"><span class="pill-sim">${e("mode.simulation")}</span>${e("onb.done.lead")}</div>
        <div class="actions">
          <span class="with-tip" data-tipped>
            <button type="button" class="btn btn-primary" @click=${this.complete}>${e("onb.done.go")}</button>
            ${C(e, "start")}
          </span>
          <button type="button" class="btn btn-ghost" data-notip @click=${() => this.go("scan")}>
            ${e("onb.done.change")}
          </button>
        </div>`)}`;
	}
	renderSummary(e, t) {
		let n = this.hass, r = t.batteries.reduce((e, t) => e + (t.capacity_kwh ?? (n ? _e(n, t.capacity_entity) : null) ?? 0), 0), i = (n, r) => {
			let i = t.answers[n];
			if (i === "unknown") return e("sum.unknown");
			let a = Array.isArray(i) ? i : typeof i == "string" ? [i] : [];
			return a.length ? a.map((t) => e.optional(r[t] ?? "") ?? t).join(", ") : e("sum.open");
		}, a = this.discovery?.forecast, o = [
			[e("sum.batteries"), t.batteries.length ? e("sum.batteries.value", {
				count: t.batteries.length,
				kwh: r ? v(e.lang, r, 1) : "?"
			}) : e("sum.none")],
			[e("sum.tariff"), t.tariff.kind === "unknown" ? e("sum.unknown") : hi(e, t.tariff, !1)],
			[e("sum.feed_in"), t.tariff.feed_in_price == null ? t.tariff.feed_in_entity ? e("sum.from_sensor") : e("sum.unknown") : `${mi(e, t.tariff.feed_in_price)} ct`],
			[e("sum.forecast"), t.forecast.provider ? a ? e("sum.forecast.value", {
				provider: a.provider_name,
				planes: Ti(e, a.planes, "word.plane")
			}) : t.forecast.provider : e("sum.none")],
			[e("sum.heating"), i("heating", Ei)],
			[e("sum.hot_water"), i("hot_water", {
				hot_water_heat_pump: "q.hot_water.heat_pump",
				electric: "q.hot_water.electric",
				heating: "q.hot_water.heating",
				other: "q.hot_water.other"
			})],
			[e("sum.ev"), i("ev", {
				yes: "q.ev.yes",
				no: "q.ev.no"
			})],
			[e("sum.household"), e("sum.household.value", {
				persons: Ti(e, t.persons.length, "word.person"),
				calendars: Ti(e, t.persons.reduce((e, t) => e + t.calendars.length, 0), "word.calendar")
			})]
		];
		return E`<div class="lines">
      ${o.map(([e, t]) => E`<div><span>${e}</span><span>${t}</span></div>`)}
    </div>`;
	}
	rediscover() {
		this.dispatchEvent(new CustomEvent("joe-rediscover", {
			bubbles: !0,
			composed: !0
		}));
	}
	layout(e, t) {
		return E`<div class="wrap">
      <joe-pose name=${e}></joe-pose>
      <div>${t}</div>
    </div>`;
	}
	renderEnergy(e) {
		let t = this.info?.energy;
		if (!t?.configured || !t.sources) return E`<div class="found"><p>${e("onb.scan.energy.none")}</p></div>`;
		let n = [
			[t.sources.grid ?? 0, e("energy.grid")],
			[t.sources.solar ?? 0, e("energy.solar")],
			[t.sources.battery ?? 0, e("energy.battery")],
			[t.devices ?? 0, e("energy.devices")]
		];
		return E`<div class="found">
      <p>${e("onb.scan.energy")}</p>
      <div class="chips">
        ${n.map(([e, t]) => E`<span class="chip read"><ha-icon icon="mdi:eye-outline"></ha-icon>${e} ${t}</span>`)}
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
e([y()], Di.prototype, "step", void 0), e([y({ attribute: !1 })], Di.prototype, "t", void 0), e([y({ attribute: !1 })], Di.prototype, "info", void 0), e([y({ attribute: !1 })], Di.prototype, "hass", void 0), e([y({ attribute: !1 })], Di.prototype, "config", void 0), e([y({ attribute: !1 })], Di.prototype, "discovery", void 0), e([y({ attribute: !1 })], Di.prototype, "checks", void 0), e([y({ type: Boolean })], Di.prototype, "discovering", void 0), e([y({ type: Boolean })], Di.prototype, "discoveryFailed", void 0), f("joe-onboarding", Di);
//#endregion
//#region src/components/day-questions.ts
var Oi = {
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
}, ki = class extends b {
	constructor(...e) {
		super(...e), this.questions = [], this.failed = !1, this.answered = /* @__PURE__ */ new Set();
	}
	static {
		this.styles = [T, x`
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
		return !e || !t.length ? o : E`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:chat-question-outline"></ha-icon>${e("ask.title")}</div>
        ${C(e, "ask_day")}
      </div>
      <p class="lead">${e("ask.lead")}</p>
      ${t.map((t) => E`<div class="question">
          <p>
            ${e(`ask.${t.kind}`, {
			day: H(e.lang, t.date, "weekday"),
			actual: V(e.lang, t.actual, 1),
			expected: V(e.lang, t.expected, 1)
		})}
          </p>
          <div class="answers" role="group" aria-label=${e("ask.answers")}>
            ${Oi[t.kind].map((n) => E`<button
                  type="button"
                  class="mini-btn ${n === "normal" ? "quiet" : ""}"
                  ?disabled=${this.busy === t.date}
                  @click=${() => this.answer(t.date, n)}
                >
                  ${e(`ask.answer.${n}`)}
                </button>`)}
          </div>
        </div>`)}
      ${this.failed ? E`<div class="note warn" role="status"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("error.action")}</div>` : o}
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
e([y({ attribute: !1 })], ki.prototype, "hass", void 0), e([y({ attribute: !1 })], ki.prototype, "t", void 0), e([y({ attribute: !1 })], ki.prototype, "questions", void 0), e([s()], ki.prototype, "busy", void 0), e([s()], ki.prototype, "failed", void 0), e([s()], ki.prototype, "answered", void 0), f("joe-day-questions", ki);
//#endregion
//#region src/pages/overview.ts
var Ai = class extends b {
	constructor(...e) {
		super(...e), this.prefix = D;
	}
	static {
		this.styles = [T, x`
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
		if (!e) return o;
		let t = !!this.state?.observe?.active, n = !!(this.state?.plan && this.state.plan.kind !== "unavailable"), r = (this.state?.results?.days ?? 0) > 0, i = this.state?.questions ?? [];
		return E`<div class="grid">
      ${i.length ? E`<joe-day-questions class="wide" .hass=${this.hass} .t=${e} .questions=${i}></joe-day-questions>` : o}
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
		return t ? E`<span class="chip ok"><ha-icon icon="mdi:check"></ha-icon>${e("status.running")}</span>` : E`<span class="chip">${e(this.state?.mode === "off" ? "status.paused" : "status.waiting")}</span>`;
	}
	renderNight(e) {
		let t = this.state?.plan;
		if (!t) return E`<section class="card">
        <joe-pose name="relax"></joe-pose>
        <div class="eyebrow"><ha-icon icon="mdi:weather-night"></ha-icon>${e("overview.night")}</div>
        ${a(e("overview.night.empty.title"))} ${A}
        <p class="lead">${e("overview.night.empty.text")}</p>
      </section>`;
		let n = ue(e, t), r = pe(e, t, this.hass?.config?.currency), i = t.kind === "charge" || t.kind === "hold" ? E`${v(e.lang, t.target ?? 0, 0)}<small>%</small>` : E`${e(t.kind === "none" ? "plan.big.none" : "plan.big.unavailable")}`;
		return E`<section class="card figure-card" data-tipped>
      <joe-pose name=${oe(t)}></joe-pose>
      <div class="head">
        <div class="eyebrow">
          <ha-icon icon="mdi:weather-night"></ha-icon>${e("overview.night")}${t.window ? ` · ${ve(e, t)}` : ""}
        </div>
        ${C(e, "plan_target")}
      </div>
      <div class="big">${i}</div>
      ${A}
      <p class="say">${ae(e, t)}</p>
      ${n.length ? E`<div class="lines">${n.map((e) => E`<div>${e}</div>`)}</div>` : o}
      ${r ? E`<p class="cost">${r}</p>` : o}
      <div class="bottom">
        <span class="chip ${t.fixed ? "ok" : ""}">
          ${t.fixed ? e("plan.fixed_at", { time: t.created.slice(11, 16) }) : e("plan.preview_at", { time: t.created.slice(11, 16) })}
        </span>
        <a class="btn btn-secondary" data-notip href=${w(this.prefix, "/plan")} @click=${O("/plan")}
          >${e("overview.night.more")}</a
        >
      </div>
    </section>`;
	}
	renderSim(e) {
		let t = this.state?.results, n = t?.last;
		if (!t || !n) return E`<section class="card">
        <joe-pose name="plan"></joe-pose>
        <div class="eyebrow"><ha-icon icon="mdi:calculator-variant-outline"></ha-icon>${e("overview.sim")}</div>
        ${a(e("overview.sim.empty.title"))} ${A}
        <p class="lead">${e("overview.sim.empty.text")}</p>
      </section>`;
		let r = this.hass?.config?.currency, i = n.window?.end.slice(0, 10) ?? n.date, o = i === Dn(this.hass?.config?.time_zone) ? e("overview.sim.last") : e("overview.sim.night", { day: H(e.lang, i, "weekday") }), s = n.saving, c = s > .005 ? "good" : s < -.005 ? "bad" : "", l = c === "good" ? e("overview.sim.saved", {
			value: Tn(e, s, r),
			day: v(e.lang, Math.max(0, n.day_kwh_without - n.day_kwh), 1),
			night: v(e.lang, Math.max(0, n.night_kwh - n.night_kwh_without), 1)
		}) : c === "bad" ? e("overview.sim.cost", { value: Tn(e, -s, r) }) : e("overview.sim.same"), u = t.since ?? t.first;
		return E`<section class="card figure-card" data-tipped>
      <joe-pose name=${c === "good" ? "relax" : "inspect"}></joe-pose>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:calculator-variant-outline"></ha-icon>${e("overview.sim")} · ${o}</div>
        ${C(e, "sim_result")}
      </div>
      <div class="big ${c}">${Tn(e, s, r, !0)}</div>
      ${A}
      <p class="say">${l}</p>
      <p class="cost">
        ${e("overview.sim.total", {
			since: u ? H(e.lang, u) : "–",
			value: Tn(e, t.saving, r, !0),
			nights: On(e, t.days)
		})}
      </p>
      <div class="bottom">
        ${n.final || !n.until ? E`<span class="chip">
              ${e("learn.results.split", {
			better: t.better,
			worse: t.worse,
			same: Math.max(0, t.days - t.better - t.worse)
		})}
            </span>` : E`<span class="chip warn">${e("overview.sim.provisional", { time: n.until.slice(11, 16) })}</span>`}
        <a class="btn btn-secondary" data-notip href=${w(this.prefix, "/review/result")} @click=${O("/review/result")}
          >${e("overview.sim.more")}</a
        >
      </div>
    </section>`;
	}
	renderNow(e) {
		let t = this.hass, n = this.state?.config;
		if (!t || !n) return E``;
		let i = n.measurements, a = i.solar_power.length ? ce(t, i.solar_power) : null, o = r(t, i.grid_power), s = n.batteries.map((e) => ({
			power: r(t, e.power),
			soc: m(t, e.soc_entity)
		})), c = s.filter((e) => e.power != null), l = c.length ? c.reduce((e, t) => e + (t.power ?? 0), 0) : null, u = r(t, i.home_power), d = u == null && o != null;
		d && (u = (o ?? 0) + (a ?? 0) - (l ?? 0));
		let f = s.map((e) => e.soc).filter((e) => e != null), p = (t) => t == null ? "–" : v(e.lang, Math.abs(t), 2), h = (e, t, n, r, i) => E`<div class="flow ${e}">
        <span class="icon"><ha-icon icon=${t}></ha-icon></span>
        <small>${n}</small>
        <b>${p(r)}<span>kW</span></b>
        <em>${i}</em>
      </div>`, g = (e) => e == null || Math.abs(e) < .05;
		return E`<section class="card wide" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:pulse"></ha-icon>${e("overview.now")}</div>
        ${C(e, "now")}
      </div>
      <div class="now">
        ${h("sun", "mdi:solar-power", e("overview.now.solar"), a, e(a == null ? "overview.now.none" : "overview.now.solar.sub"))}
        ${h("home", "mdi:home-lightning-bolt-outline", e("overview.now.home"), u, e(u == null ? "overview.now.none" : d ? "overview.now.home.calc" : "overview.now.home.sub"))}
        ${h("battery", "mdi:home-battery-outline", g(l) ? e("overview.now.battery") : e(l > 0 ? "overview.now.battery.charge" : "overview.now.battery.discharge"), l, f.length ? f.length === 1 ? e("overview.now.soc", { value: v(e.lang, f[0], 0) }) : e("overview.now.soc_avg", {
			value: v(e.lang, f.reduce((e, t) => e + t, 0) / f.length, 0),
			count: f.length
		}) : n.batteries.length ? e("overview.now.none") : e("overview.now.no_battery"))}
        ${h("net", "mdi:transmission-tower", g(o) ? e("overview.now.grid") : e(o > 0 ? "overview.now.grid.in" : "overview.now.grid.out"), o, o == null ? e("overview.now.none") : g(o) ? e("overview.now.grid.idle") : e(o > 0 ? "overview.now.grid.in.sub" : "overview.now.grid.out.sub"))}
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
		}).format(/* @__PURE__ */ new Date(`${t.date}T12:00:00Z`))), s = new Map(t.map((t, n) => [n, new Intl.DateTimeFormat(e.lang, {
			weekday: "short",
			timeZone: "UTC"
		}).format(/* @__PURE__ */ new Date(`${t.date}T12:00:00Z`))]));
		return E`<section class="card wide" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:chart-bar"></ha-icon>${e("overview.week")}</div>
        ${C(e, "week")}
      </div>
      <p class="status">${r}</p>
      ${t.length ? E`<joe-chart
              .labels=${a}
              .ticks=${s}
              .series=${i}
              centerTicks
              unit="kWh"
              height="190"
              lang=${e.lang}
              label=${e("overview.week")}
            ></joe-chart>
            <div class="bottom">
              <div class="legend">
                ${i.map((e) => E`<span><i style="background:${e.color}"></i>${e.label}</span>`)}
              </div>
              <a class="btn btn-secondary" data-notip href=${w(this.prefix, "/review/days")} @click=${O("/review/days")}
                >${e("overview.week.more")}</a
              >
            </div>` : o}
    </section>`;
	}
};
e([y({ attribute: !1 })], Ai.prototype, "t", void 0), e([y({ attribute: !1 })], Ai.prototype, "hass", void 0), e([y({ attribute: !1 })], Ai.prototype, "state", void 0), e([y()], Ai.prototype, "prefix", void 0), e([s()], Ai.prototype, "week", void 0), f("joe-overview", Ai);
//#endregion
//#region src/pages/plan.ts
var ji = 36e5, Mi = class extends b {
	constructor(...e) {
		super(...e), this.prefix = D, this.refreshing = !1;
	}
	static {
		this.styles = [T, x`
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
		if (!e) return o;
		let t = this.state?.plan;
		if (!t || t.kind === "unavailable" || !t.hours) return this.renderEmpty(e, t);
		let n = ue(e, t), r = pe(e, t, this.hass?.config?.currency);
		return E`<div class="wrap">
      <div class="eyebrow"><ha-icon icon="mdi:weather-night"></ha-icon>${e("overview.night")} · ${ve(e, t)}</div>
      ${a(e("plan.page.title"))} ${A}
      <div class="top" data-tipped>
        ${this.state?.mode === "simulation" ? E`<span class="pill-sim">${e("mode.simulation")}</span>` : E`<span class="chip ${this.state?.mode === "live" ? "ok" : "learned"}">${e(`mode.${this.state?.mode ?? "off"}`)}</span>`}
        <span class="chip ${t.fixed ? "ok" : ""}">
          ${t.fixed ? e("plan.fixed_at", { time: t.created.slice(11, 16) }) : e("plan.preview_at", { time: t.created.slice(11, 16) })}
        </span>
        <button type="button" class="mini-btn" ?disabled=${this.refreshing || t.fixed} @click=${this.refresh}>
          <ha-icon icon="mdi:refresh"></ha-icon>${e("plan.refresh")}
        </button>
        ${C(e, "plan_refresh")}
      </div>
      <section class="hero" data-tipped>
        <joe-pose name=${oe(t)}></joe-pose>
        <div class="big">
          ${t.kind === "none" ? e("plan.big.none") : E`${v(e.lang, t.target ?? 0, 0)}<small>%</small>`}
        </div>
        <p class="say">${ae(e, t)} ${C(e, "plan_target")}</p>
        ${n.length ? E`<div class="lines">${n.map((e) => E`<div>${e}</div>`)}</div>` : o}
        ${r ? E`<p class="cost">${r}</p>` : o}
      </section>
      ${this.renderSteer(e, t)} ${this.renderActions(e, t)} ${this.renderEnergy(e, t, t.hours)}
      ${this.renderPrices(e, t, t.hours)} ${this.renderSoc(e, t, t.hours)}
      ${this.renderMath(e, t)}
    </div>`;
	}
	renderSteer(e, t) {
		let n = this.state, r = n?.control;
		if (!n || !r || !["advisory", "live"].includes(n.mode) || !t.window || t.kind === "none") return o;
		let i = t.window.start, a = r.skip === i, s = r.answer?.night === i ? r.answer.yes : null, c = n.config.batteries.filter((e) => e.adapter !== "none" && r.ready[e.id] && r.ready[e.id] !== "ready"), l, u;
		return n.mode === "advisory" && !a ? (l = e(s === !0 ? "plan.steer.answered_yes" : s === !1 ? "plan.steer.answered_no" : "plan.steer.advisory"), u = E`${s === !0 ? o : E`<button type="button" class="btn btn-primary" @click=${() => this.answer(i, !0)}>${e("plan.steer.yes")}</button>`}
      ${s === !1 ? o : E`<button type="button" class="btn btn-secondary" @click=${() => this.answer(i, !1)}>${e("plan.steer.no")}</button>`}`) : (l = e(a ? "plan.steer.skipped" : "plan.steer.live"), u = E`<button type="button" class="btn btn-secondary" @click=${() => this.skip(!a)}>
        ${e(a ? "plan.steer.unskip" : "plan.steer.skip")}
      </button>`), E`<section class="chart-card steer" data-tipped>
      <div class="chart-head">${l} ${C(e, "plan_steer")}</div>
      ${c.length ? E`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("plan.steer.untested", { names: c.map((e) => e.name).join(", ") })}</span>
          </div>` : o}
      <div class="actions">${u}</div>
    </section>`;
	}
	renderActions(e, t) {
		let n = t.actions ?? [];
		if (!n.length) return o;
		let r = this.hass?.config?.currency ?? "EUR", i = (t) => new Intl.NumberFormat(e.lang, {
			style: "currency",
			currency: r
		}).format(t);
		return E`<section class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.actions")} ${C(e, "plan_actions")}</div>
      <dl>
        ${n.map((n) => {
			let r = n.target == null ? "" : v(e.lang, n.target, 0), a = n.run ? n.kind === "target" ? e("plan.actions.target", {
				start: k(n.start),
				end: k(n.end),
				target: r
			}) : e("plan.actions.run", {
				start: k(n.start),
				end: k(n.end)
			}) : e.optional(`devices.action.why.${n.reasons[n.reasons.length - 1] ?? "manual_only"}`, {
				kwh: v(e.lang, t.meta?.tomorrow_kwh ?? 0, 0),
				temperature: v(e.lang, n.temperature ?? 0, 0)
			}) ?? "", s = n.run && n.energy_kwh ? e("plan.actions.energy", {
				kwh: v(e.lang, n.energy_kwh, 1),
				cost: i(n.cost ?? 0)
			}) : "", c = this.state?.config.actions.find((e) => e.id === n.id);
			return E`<dt>${n.name}</dt>
            <dd>
              ${a}${s ? E`<small>${s}</small>` : o}
              ${n.need ? E`<joe-car-need .hass=${this.hass} .t=${e} .action=${n} .roundTrip=${c?.need?.round_trip ?? !0}></joe-car-need>` : o}
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
	renderEmpty(e, t) {
		let n = t ? ae(e, t) : e(this.state?.mode === "off" ? "plan.empty.off" : "plan.empty.waiting");
		return E`<div class="empty">
      <joe-pose name=${t ? oe(t) : "plan"}></joe-pose>
      <div>
        ${a(e("plan.title"))} ${A}
        <p class="lead">${n}</p>
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
					if (t >= r && t < r + ji) return e + (t - r) / ji;
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
		return E`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.chart.energy")} ${C(e, "chart_plan_energy")}</div>
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
        ${i.map((e) => E`<span><i style="background:${e.color}"></i>${e.label}</span>`)}
      </div>
    </div>`;
	}
	renderPrices(e, t, n) {
		if (!n.some((e) => e.price != null)) return o;
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
		return E`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.chart.prices")} ${C(e, "chart_plan_prices")}</div>
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
      ${t.charge_slots?.length ? E`<p class="slots">${e("plan.slots", { slots: te(t) })}</p>` : o}
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
			label: e("plan.chart.full", { time: k(t.full_at) }),
			short: `${k(t.full_at)}`
		}), E`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.chart.soc")} ${C(e, "chart_plan_soc")}</div>
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
        ${a.map((e) => E`<span><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color}"></i>${e.label}</span>`)}
      </div>
    </div>`;
	}
	renderMath(e, t) {
		let n = (t, n = 1) => t == null ? "–" : `${v(e.lang, t, n)} kWh`, r = (t) => t == null ? "–" : `${v(e.lang, t * 100, 1)} ct`, i = t.window?.start.slice(0, 10) ?? "", a = t.meta?.solar.sources[i] ?? "none", s = t.meta?.tomorrow, c = s?.solar_factor ?? t.meta?.solar_factor ?? 1, l = t.meta?.consumption, u = this.state?.config.persons ?? [], d = [
			[e("plan.math.battery_now"), E`${v(e.lang, t.soc_now ?? 0, 0)} %<small
            >${e("plan.math.battery_now.sub", {
				stored: v(e.lang, (t.soc_now ?? 0) / 100 * (t.capacity_kwh ?? 0), 1),
				capacity: v(e.lang, t.capacity_kwh ?? 0, 1)
			})}</small
          >`],
			[e("plan.math.battery_start"), `${v(e.lang, t.soc_start ?? 0, 0)} %`],
			[e("plan.math.solar"), E`${n(t.solar_kwh)}<small
            >${e(`plan.math.solar.${a}`)}${c === 1 ? "" : ` · ${e(s?.solar_source === "combined" ? "plan.math.solar.combined" : s?.solar_source === "weather" && s.weather ? "plan.math.solar.weather" : "plan.math.solar.factor", {
				value: v(e.lang, c, 2),
				weather: s?.weather ? e(`learn.weather.${s.weather}`) : ""
			})}`}</small
          >`],
			[e("plan.math.home"), E`${n(t.home_kwh)}<small
            >${l?.source === "history" ? e("plan.math.home.history", {
				days: l.days,
				kind: e(t.meta?.workday === !1 ? "plan.math.day_off" : "plan.math.workday")
			}) : e("plan.math.home.default")}</small
          >`],
			...s && (s.temp != null || Object.keys(s.labels).length) ? [[e("plan.math.tomorrow"), E`${[s.temp == null ? "" : `${v(e.lang, s.temp, 0)} °C`, ...Object.entries(s.labels).map(([t, n]) => e("plan.math.tomorrow.person", {
				name: u.find((e) => e.id === t)?.name ?? t,
				label: e(`label.${n}`)
			}))].filter(Boolean).join(" · ")}<small
                  >${s.expected_kwh == null ? e("plan.math.tomorrow.usual") : e("plan.math.tomorrow.scaled", {
				expected: v(e.lang, s.expected_kwh, 1),
				usual: v(e.lang, s.profile_kwh, 1)
			})}</small
                >`]] : [],
			[e("plan.math.target"), E`${v(e.lang, t.target ?? 0, 0)} %<small
            >${e("plan.math.target.sub", {
				optimum: v(e.lang, t.optimum ?? 0, 0),
				buffer: v(e.lang, (t.rules?.buffer ?? 0) * 100, 0)
			})}</small
          >`],
			[e("plan.math.prices"), E`${e("plan.math.prices.value", {
				night: r(t.prices?.night),
				day: r(t.prices?.day),
				feed: r(t.prices?.feed_in)
			})}${t.prices?.assumed ? E`<small>${e("plan.math.prices.assumed")}</small>` : o}`],
			[e("plan.math.rules"), e("plan.math.rules.value", {
				reserve: v(e.lang, t.rules?.reserve ?? 0, 0),
				max: v(e.lang, t.rules?.max_target ?? 100, 0),
				mode: e.optional(`rule.discharge.${t.rules?.discharge_mode}`) ?? ""
			})]
		], f = [...new Set(t.notes ?? [])].map((t) => e.optional(`plan.note.${t}`)).filter(Boolean);
		return E`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.math")} ${C(e, "plan_math")}</div>
      <dl>${d.map(([e, t]) => E`<dt>${e}</dt><dd>${t}</dd>`)}</dl>
      ${f.map((e) => E`<div class="note"><ha-icon icon="mdi:information-outline"></ha-icon><span>${e}</span></div>`)}
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
e([y({ attribute: !1 })], Mi.prototype, "hass", void 0), e([y({ attribute: !1 })], Mi.prototype, "t", void 0), e([y({ attribute: !1 })], Mi.prototype, "state", void 0), e([y({ attribute: !1 })], Mi.prototype, "route", void 0), e([y({ attribute: !1 })], Mi.prototype, "prefix", void 0), e([s()], Mi.prototype, "refreshing", void 0), f("joe-plan-page", Mi);
//#endregion
//#region src/rules-view.ts
var Ni = {
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
}, Pi = [
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
], Fi = [
	"until_target",
	"block",
	"free"
];
function Ii(e) {
	return Pi.includes(e);
}
function Li(e) {
	return e in Ni;
}
function Ri(e, t) {
	return t.unit || e(`rule.${t.key}.unit`);
}
function zi(e, t) {
	return t == null ? "" : String(Math.round(t * (e.scale ?? 1) * 100) / 100);
}
function Bi(e, t, n, r, i) {
	if (Li(i)) return Vi(e, t, n, r, Ni[i]);
	switch (i) {
		case "guard_grid": return Ui(e, t, n);
		case "converter_losses": return Wi(e, t, n);
		case "priority": return Gi(e, t, n);
		case "discharge_in_window": return Ki(e, t, n);
	}
}
function Vi(e, t, n, r, i) {
	let a = r?.defaults?.rules[i.key], s = j(n, `rules.${i.key}`), c = s?.source === "user";
	return E`<div class="row" data-tipped data-anchor=${i.key}>
    <div>
      <div class="name"><b>${e(`rule.${i.key}`)}</b>${C(e, `r_${i.key}`)}</div>
      <small>${e(`rule.${i.key}.hint`)}</small>
    </div>
    <div class="control">
      ${g(e, s)}
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
          .value=${zi(i, n.rules[i.key])}
          @change=${(e) => Hi(t, i, e.target)}
        />
        <span class="unit">${Ri(e, i)}</span>
      </span>
      ${c && a !== void 0 ? E`<button
            type="button"
            class="mini-btn quiet"
            @click=${() => N(t, { rules: { [i.key]: a } }, "default")}
          >
            <ha-icon icon="mdi:restore"></ha-icon>${e("rule.reset")}
          </button>` : o}
    </div>
  </div>`;
}
function Hi(e, t, n) {
	let r = n.value.trim(), i = t.scale ?? 1;
	if (r === "") {
		t.optional && N(e, { rules: { [t.key]: null } });
		return;
	}
	let a = Number.parseFloat(r);
	if (!Number.isFinite(a) || a < t.min || a > t.max) {
		n.reportValidity();
		return;
	}
	let o = t.integer ? Math.round(a) : Math.round(a / i * 1e4) / 1e4;
	N(e, { rules: { [t.key]: o } });
}
function Ui(e, t, n) {
	let r = n.rules, i = r.grid_limit_w;
	return E`<div class="row" data-tipped data-anchor="guard_grid">
    <div>
      <div class="name"><b id="guard-grid">${e("rule.guard_grid")}</b>${C(e, "r_guard_grid")}</div>
      <small>${e(i ? "rule.guard_grid.hint" : "rule.guard_grid.no_limit")}</small>
    </div>
    <div class="control">
      ${g(e, j(n, "rules.guard_grid"))}
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${String(r.guard_grid)}
        aria-labelledby="guard-grid"
        ?disabled=${!i}
        @click=${() => N(t, { rules: { guard_grid: !r.guard_grid } })}
      ></button>
    </div>
  </div>`;
}
function Wi(e, t, n) {
	let r = n.rules;
	return E`<div class="row" data-tipped data-anchor="converter_losses">
    <div>
      <div class="name"><b id="converter-losses">${e("rule.converter_losses")}</b>${C(e, "r_converter_losses")}</div>
      <small>${e("rule.converter_losses.hint")}</small>
    </div>
    <div class="control">
      ${g(e, j(n, "rules.converter_losses"))}
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${String(r.converter_losses)}
        aria-labelledby="converter-losses"
        @click=${() => N(t, { rules: { converter_losses: !r.converter_losses } })}
      ></button>
    </div>
  </div>`;
}
function Gi(e, t, n) {
	let r = n.rules.priority, i = (e, n) => {
		let i = [...r];
		[i[e], i[e + n]] = [i[e + n], i[e]], N(t, { rules: { priority: i } });
	}, a = (e) => E`<svg
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
	return E`<div class="row" data-tipped data-anchor="priority">
    <div>
      <div class="name"><b>${e("rule.priority")}</b>${C(e, "r_priority")}</div>
      <small>${e("rule.priority.hint")}</small>
    </div>
    <div class="control">
      ${g(e, j(n, "rules.priority"))}
      <div class="order">
        ${r.map((t, n) => E`<div>
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
function Ki(e, t, n) {
	let r = n.rules;
	return E`<div class="row stacked" data-tipped data-anchor="discharge_in_window">
    <div>
      <div class="name">
        <b>${e("rule.discharge_in_window")}</b>${C(e, "r_discharge_in_window")}
        ${g(e, j(n, "rules.discharge_in_window"))}
      </div>
      <small>${e("rule.discharge_in_window.hint")}</small>
    </div>
    <div>
      <joe-choice
        compact
        label=${e("rule.discharge_in_window")}
        .options=${Fi.map((t) => ({
		value: t,
		label: e(`rule.discharge.${t}`)
	}))}
        .value=${[r.discharge_in_window]}
        @joe-choice=${(e) => {
		e.detail.value[0] && N(t, { rules: { discharge_in_window: e.detail.value[0] } });
	}}
      ></joe-choice>
    </div>
  </div>`;
}
var qi = x`
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
`, Ji = [
	"simulation",
	"advisory",
	"live",
	"off"
], Yi = [
	"weather",
	"holiday",
	"people"
], Xi = [
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
], Zi = {
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
}, Q = class extends b {
	constructor(...e) {
		super(...e), this.checks = [], this.prefix = D, this.pro = !1, this.question = "", this.anchorSince = 0;
	}
	static {
		this.styles = [
			T,
			qi,
			x`
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
		let t = this.route ? me(this.route) : "";
		if (t === this.revealed) return;
		this.revealed = t, this.anchorSince = Date.now();
		let { section: n, id: r } = this.route ?? {};
		n === "rules" ? (this.pro = !0, this.anchor = r && Ii(r) ? r : "rules") : this.anchor = n === "maintenance" ? r === "backup" || r === "setup" ? r : "maintenance" : n && n !== "operation" ? n : void 0;
	}
	async updated() {
		let e = this.anchor;
		if (!e) return;
		if (!this.discovery && Date.now() - this.anchorSince < 3e3) {
			this.anchorRetry ??= window.setTimeout(() => {
				this.anchorRetry = void 0, this.requestUpdate();
			}, 3e3);
			return;
		}
		let t = [...this.renderRoot.querySelectorAll("joe-review, joe-choice")];
		await Promise.all(t.map((e) => e.updateComplete));
		for (let e = 0; e < 10 && (e === 0 || !getComputedStyle(this).getPropertyValue("--joe-head-h")); e++) await new Promise((e) => requestAnimationFrame(e));
		this.anchor === e && ie(this.renderRoot, e) && (this.anchor = void 0);
	}
	render() {
		let e = this.t, t = this.state;
		if (!e || !t) return o;
		let n = t.config;
		return E`<div class="list">
        <section class="group" data-anchor="operation">
          <h2>${e("settings.operation")}</h2>
          <div class="row" data-tipped>
            <div>
              <div class="name"><b>${e("settings.mode")}</b>${C(e, "mode")}</div>
              <small>${e("settings.mode.hint")}</small>
            </div>
            <div class="seg" role="group" aria-label=${e("settings.mode")}>
              ${Ji.map((n) => E`<button
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
              <div class="name"><b>${e("settings.setup")}</b>${C(e, "restart")}</div>
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

        <section class="group plain">
          <h2>${e("settings.uses")}</h2>
          <p class="intro">${e("settings.uses.intro")}</p>
          <joe-review
            .hass=${this.hass}
            .t=${e}
            .config=${n}
            .discovery=${this.discovery}
            .checks=${this.checks}
            .omit=${Yi}
            context="settings"
          ></joe-review>
        </section>

        <section class="group">
          <h2>${e("settings.answers")}</h2>
          ${Xi.map((t) => this.answerRow(e, t.key, t.tip))}
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
          ${this.pro ? E`<p class="intro">${e("settings.pro.intro")}</p>
                ${Pi.map((t) => Bi(e, this, n, this.info, t))}` : o}
        </section>

        ${this.renderBackup(e)}

        <section class="group" data-anchor="about">
          <h2>${e("settings.about")}</h2>
          <div class="row"><b>${e("settings.version")}</b><span class="value">${this.info?.version ?? "–"}</span></div>
          <div class="row"><b>${e("settings.ha")}</b><span class="value">${this.info?.ha_version ?? "–"}</span></div>
          <div class="row"><b>${e("settings.energy")}</b><span class="value">${this.energyText(e)}</span></div>
        </section>
      </div>
      ${this.question ? this.renderQuestionSheet(e) : o}`;
	}
	renderBackup(e) {
		return E`<section class="group" data-anchor="backup">
      <h2>${e("settings.backup")}</h2>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${e("settings.backup.export")}</b>${C(e, "backup_export")}</div>
          <small>${e("settings.backup.export.hint")}</small>
        </div>
        <button type="button" class="btn btn-secondary" @click=${() => void this.exportSettings()}>${e("settings.backup.download")}</button>
      </div>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${e("settings.backup.import")}</b>${C(e, "backup_import")}</div>
          <small>${e("settings.backup.import.hint")}</small>
        </div>
        <label class="btn btn-secondary file">
          ${e("settings.backup.choose")}
          <input type="file" accept="application/json,.json" @change=${(e) => void this.readBackup(e)} />
        </label>
      </div>
      ${this.backup ? E`<div class="note warn">
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
          </div>` : o}
      ${this.backupNote ? E`<div class="note ${this.backupNote.ok ? "ok" : "warn"}">
            <ha-icon icon=${this.backupNote.ok ? "mdi:check" : "mdi:alert-outline"}></ha-icon><span>${this.backupNote.text}</span>
          </div>` : o}
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
	disconnectedCallback() {
		super.disconnectedCallback(), window.clearTimeout(this.anchorRetry), this.anchorRetry = void 0;
	}
	renderNotify(e) {
		let t = this.state.config, n = t.notify, r = this.notifyTargets ?? Object.keys(this.hass?.services?.notify ?? {}).filter((e) => ![
			"persistent_notification",
			"send_message",
			"notify"
		].includes(e)).sort().map((e) => ({
			service: e,
			name: e.replace(/_/g, " ")
		})), i = n.service?.replace(/^notify\./, ""), a = !!i && this.notifyTargets !== void 0 && !r.some((e) => e.service === i), s = (t, r) => E`<div class="row" data-tipped>
        <div>
          <div class="name"><b id="notify-${t}">${e(`settings.notify.${t}`)}</b>${C(e, r)}</div>
          <small>${e(`settings.notify.${t}.hint`)}</small>
        </div>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(n[t])}
          aria-labelledby="notify-${t}"
          ?disabled=${!n.service}
          @click=${() => N(this, { notify: { [t]: !n[t] } })}
        ></button>
      </div>`;
		return E`<section class="group" data-anchor="notify">
      <h2>${e("settings.notify")}</h2>
      <p class="intro">${e("settings.notify.intro")}</p>
      <div class="row" data-tipped>
        <div>
          <div class="name"><label for="notify-service"><b>${e("settings.notify.service")}</b></label>${C(e, "notify_service")}</div>
          <small>${e("settings.notify.service.hint")}</small>
        </div>
        <select
          id="notify-service"
          class="input"
          @change=${(e) => {
			let t = e.target.value;
			N(this, { notify: { service: t ? `notify.${t}` : null } });
		}}
        >
          <option value="" ?selected=${!n.service}>${e("settings.notify.none")}</option>
          ${r.map((e) => E`<option value=${e.service} ?selected=${i === e.service}>${e.name}</option>`)}
          ${a ? E`<option value=${i} selected>${e("settings.notify.gone", { name: i ?? "" })}</option>` : o}
        </select>
      </div>
      ${s("ask", "notify_ask")} ${s("problems", "notify_problems")} ${s("morning", "notify_morning")}
      <div class="row" data-tipped>
        <div>
          <div class="name"><label for="ask-time"><b>${e("settings.ask_time")}</b></label>${C(e, "ask_time")}</div>
          <small>${e("settings.ask_time.hint")}</small>
        </div>
        <input
          id="ask-time"
          class="input time"
          type="time"
          .value=${t.rules.ask_time}
          @change=${(e) => {
			let t = e.target.value;
			/^\d{2}:\d{2}$/.test(t) && N(this, { rules: { ask_time: t } });
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
		return c?.state === "running" ? s.push(e("history.reading")) : c?.state === "unavailable" ? s.push(e("settings.observe.no_recorder")) : c?.state === "failed" && s.push(e("settings.observe.failed")), E`<section class="group" data-anchor="maintenance">
      <h2>${e("settings.observe")}</h2>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${e("settings.observe.recording")}</b>${C(e, "observe")}</div>
          <small>${o}</small>
        </div>
        <span class="chip ${r ? "ok" : ""}">
          ${e(r ? "status.running" : t.mode === "off" ? "status.paused" : "status.waiting")}
        </span>
      </div>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${e("settings.observe.history")}</b>${C(e, "rebuild")}</div>
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
		let r = this.state.config, i = r.answers[t], a = Array.isArray(i) ? i : typeof i == "string" ? [i] : [], s = i === "unknown" ? e("sum.unknown") : a.length ? a.map((n) => Zi[t][n] ? e(Zi[t][n]) : n).join(", ") : e("sum.open");
		return E`<div class="row" data-tipped>
      <div>
        <div class="name"><b>${e(`settings.answer.${t}`)}</b>${C(e, n)}</div>
        <small>${s}</small>
      </div>
      <div class="control">
        ${i == null ? o : g(e, j(r, `answers.${t}`))}
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
		return E`<joe-sheet label=${e("settings.answers")} closeLabel=${e("common.close")} @joe-close=${t}>
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
		return E`<div class="row" data-tipped>
        <div>
          <div class="name"><b id="grid-friendly">${e("rule.grid_friendly")}</b>${C(e, "r_grid_friendly")}</div>
          <small>${e("rule.grid_friendly.hint")}</small>
        </div>
        <div class="control">
          ${g(e, j(n, "rules.grid_friendly"))}
          <button
            type="button"
            class="switch"
            role="switch"
            aria-checked=${String(t.grid_friendly)}
            aria-labelledby="grid-friendly"
            @click=${() => N(this, { rules: { grid_friendly: !t.grid_friendly } })}
          ></button>
        </div>
      </div>
      ${t.grid_friendly ? E`<div class="row" data-tipped>
            <div>
              <div class="name"><b>${e("rule.grid_first")}</b>${C(e, "r_grid_first")}</div>
              <small>${e(t.grid_first ? "rule.grid_first.grid.hint" : "rule.grid_first.saving.hint")}</small>
            </div>
            <div class="seg" role="group" aria-label=${e("rule.grid_first")}>
              ${[!1, !0].map((n) => E`<button
                    type="button"
                    aria-pressed=${String(t.grid_first === n)}
                    @click=${() => N(this, { rules: { grid_first: n } })}
                  >
                    ${e(n ? "rule.grid_first.grid" : "rule.grid_first.saving")}
                  </button>`)}
            </div>
          </div>` : o}`;
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
e([y({ attribute: !1 })], Q.prototype, "t", void 0), e([y({ attribute: !1 })], Q.prototype, "hass", void 0), e([y({ attribute: !1 })], Q.prototype, "state", void 0), e([y({ attribute: !1 })], Q.prototype, "info", void 0), e([y({ attribute: !1 })], Q.prototype, "discovery", void 0), e([y({ attribute: !1 })], Q.prototype, "checks", void 0), e([y({ attribute: !1 })], Q.prototype, "route", void 0), e([y({ attribute: !1 })], Q.prototype, "prefix", void 0), e([s()], Q.prototype, "backup", void 0), e([s()], Q.prototype, "backupNote", void 0), e([s()], Q.prototype, "pro", void 0), e([s()], Q.prototype, "notifyTargets", void 0), e([s()], Q.prototype, "question", void 0), f("joe-settings", Q);
//#endregion
//#region src/energy-joe-panel.ts
var Qi = [
	"simulation",
	"advisory",
	"live",
	"off"
], $i = {
	simulation: "mdi:pause",
	advisory: "mdi:comment-question-outline",
	live: "mdi:play",
	off: "mdi:power"
}, ea = Qi, ta = {
	overview: "mdi:view-dashboard-outline",
	plan: "mdi:weather-night",
	review: "mdi:history",
	devices: "mdi:power-plug-outline",
	household: "mdi:account-group-outline",
	settings: "mdi:cog-outline"
}, na = [
	"devices",
	"household",
	"settings"
], ra = [
	"battery",
	"action",
	"consumers",
	"tariff"
], ia = [
	"devices",
	"household",
	"overview",
	"review"
], $ = class extends b {
	constructor() {
		super(), this.narrow = !1, this.failed = !1, this.modeDialog = !1, this.notice = "", this.discovering = !1, this.discoveryFailed = !1, this.checks = [], this.infoRequested = !1, this.adopted = !1, this.parsed = re(""), this.climateRequested = !1, this.jumped = !1, this.addEventListener("joe-config", (e) => this.onConfig(e)), this.addEventListener("joe-pick", (e) => {
			this.picker = e.detail;
		}), this.addEventListener("joe-edit", (e) => {
			this.editor = e.detail;
		}), this.addEventListener("joe-navigate", (e) => this.onNavigate(e)), this.addEventListener("joe-climate-reload", (e) => {
			e.stopPropagation(), this.loadClimate();
		});
	}
	get t() {
		return t(this.hass?.language);
	}
	get base() {
		return this.route?.prefix ?? "/energy-joe";
	}
	get current() {
		return this.parsed.route;
	}
	connectedCallback() {
		super.connectedCallback(), un(), this.subscribe();
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
			this.parsed = re(this.route?.path ?? "");
			let { route: n, redirect: r } = this.parsed;
			r !== void 0 && this.go(r, { replace: !0 }), this.remember(n), n.tab !== t && this.joe?.onboarding.completed && (this.discoveryFailed = !1, this.climateFound || (this.climateRequested = !1));
		}
	}
	updated() {
		this.observeHead();
		let e = this.joe;
		e?.onboarding.completed && !this.climateRequested && ia.includes(this.current.tab) && this.loadClimate(), !(!e || this.discovering || this.discoveryFailed) && (!e.onboarding.completed && e.onboarding.step === "scan" && !this.adopted ? this.scan() : !this.discovery && (e.onboarding.completed ? na.includes(this.current.tab) || ra.includes(this.editor?.editor ?? "") : e.onboarding.step !== "welcome") && this.look());
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
		if (this.failed) return E`<main><joe-empty-state pose="puzzled" heading=${e("error.title")} text=${e("error.text")}></joe-empty-state></main>`;
		if (!this.joe) return E`<div class="loading">${e("loading")}</div>`;
		let t = !this.joe.onboarding.completed;
		return E`
      <header>
        ${this.joe.mode === "simulation" ? E`<div class="simband" aria-hidden="true"></div>` : o}
        <div class="bar">
          ${this.narrow ? E`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : o}
          <div class="brand">
            <img class="light" src=${be("joe-head.webp")} alt="" width="36" height="36" />
            <img class="dark" src=${be("joe-head-dark.webp")} alt="" width="36" height="36" />
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
      ${this.notice ? E`<div class="notice" role="alert">${this.notice}</div>` : o}
      <main
        @joe-onboarding=${this.onOnboarding}
        @joe-rediscover=${() => this.scan()}
        @joe-set-mode=${(e) => this.setMode(e.detail.mode)}
      >
        ${t ? E`<joe-onboarding
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
      ${this.modeDialog ? this.renderModeDialog(e) : o} ${this.editor ? this.renderEditor(e) : o}
      ${this.picker ? this.renderPicker(e) : o}
    `;
	}
	renderTabs(e) {
		let t = this.current.tab;
		return E`<nav class="tabs" aria-label=${e("nav.label")} lang=${e.lang}>
      ${ne.map((n, r) => {
			let i = this.tabPath(n), a = r > 0 && fe.includes(ne[r - 1]) && !fe.includes(n);
			return E`${a ? E`<span class="gap" aria-hidden="true"></span>` : o}<a
            href=${w(this.base, i)}
            class=${n === t ? "on" : ""}
            aria-current=${n === t ? "page" : "false"}
            @click=${O(i)}
            ><ha-icon icon=${ta[n]}></ha-icon><span class="label">${e(`tab.${n}`)}</span></a
          >`;
		})}
    </nav>`;
	}
	tabPath(e) {
		let t = this.current;
		if (e === t.tab) return me({
			tab: e,
			section: t.section
		});
		let n = null;
		try {
			n = sessionStorage.getItem(`joe.last.${e}`);
		} catch {}
		let r = e === "overview" ? "/" : `/${e}`;
		return n && (n === r || n.startsWith(`${r}/`)) ? n : me({ tab: e });
	}
	remember(e) {
		try {
			sessionStorage.setItem(`joe.last.${e.tab}`, me({
				tab: e.tab,
				section: e.section,
				id: e.id
			}));
		} catch {}
	}
	renderSteps(e) {
		let t = rt.indexOf(this.joe?.onboarding.step ?? "welcome");
		return E`<ol class="steps" aria-label=${e("steps.label")}>
      ${rt.map((n, r) => E`<li class=${r < t ? "done" : r === t ? "on" : ""} aria-current=${r === t ? "step" : "false"}>
            ${r + 1} ${e(`step.${n}`)}
          </li>`)}
    </ol>`;
	}
	renderPage(e) {
		let t = this.current, n = this.base;
		switch (t.tab) {
			case "overview": return E`<joe-overview
          .t=${e}
          .hass=${this.hass}
          .state=${this.joe}
          .prefix=${n}
          .route=${t}
          .climateFound=${this.climateFound}
        ></joe-overview>`;
			case "plan": return E`<joe-plan-page .t=${e} .hass=${this.hass} .state=${this.joe} .prefix=${n} .route=${t}></joe-plan-page>`;
			case "review": return E`<joe-lookback-page
          .t=${e}
          .hass=${this.hass}
          .state=${this.joe}
          .prefix=${n}
          .route=${t}
          .climateFound=${this.climateFound}
        ></joe-lookback-page>`;
			case "devices": return E`<joe-devices-page
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
			case "household": return E`<joe-household-page
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
			case "settings": return E`<joe-settings
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
		let t = this.joe?.mode ?? "simulation";
		return E`<div class="scrim" @click=${this.closeDialog}>
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
          <div id="mode-title">${a(e("mode.dialog.title"), "h2", C(e, "mode"))}</div>
          ${A}
          ${this.renderReadiness(e)}
          <div class="modes" role="group" aria-labelledby="mode-title">
            ${Qi.map((n) => {
			let r = ea.includes(n);
			return E`<button
                type="button"
                class="mode ${n}"
                aria-pressed=${String(n === t)}
                ?disabled=${!r}
                @click=${() => this.chooseMode(n)}
              >
                <span class="knob"><ha-icon icon=${$i[n]}></ha-icon></span>
                <span class="label">
                  <b>${e(`mode.${n}`)}</b>
                  <small>${e(`mode.${n}.desc`)}</small>
                </span>
                ${n === t ? E`<span class="chip ok"><ha-icon icon="mdi:check"></ha-icon>${e("mode.current")}</span>` : r ? o : E`<span class="chip soon">${e("mode.soon")}</span>`}
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
		if (!r.length) return o;
		let i = r.filter((e) => n[e.id] !== "ready");
		if (!i.length) return o;
		let a = i.length === r.length ? e("mode.none_tested") : e("mode.untested", { names: i.map((e) => e.name).join(", ") });
		return E`<div class="note warn readiness"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${a}</span></div>`;
	}
	renderEditor(e) {
		let t = this.editor, n = this.joe?.config, r = () => {
			this.editor = void 0;
		}, i = E``, o = "", s = !1;
		switch (t?.editor) {
			case "battery":
				o = e("edit.battery.label"), i = E`<joe-battery-editor
          .hass=${this.hass}
          .t=${e}
          .config=${n}
          .discovery=${this.discovery}
          .info=${this.info}
          .floor=${this.joe?.floors?.[t.id ?? ""]}
          batteryId=${t.id ?? ""}
        ></joe-battery-editor>`;
				break;
			case "tariff":
				o = e("edit.tariff.label"), i = E`<joe-tariff-editor
          .hass=${this.hass}
          .t=${e}
          .config=${n}
          .discovery=${this.discovery}
        ></joe-tariff-editor>`;
				break;
			case "action":
				o = e("action.label"), i = E`<joe-action-editor
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
        ></joe-action-editor>`;
				break;
			case "consumers":
				o = e("edit.consumers.label"), s = !0, i = E`<div class="sheet-title">${a(e("edit.consumers.title"))}</div>
          <joe-consumers .hass=${this.hass} .t=${e} .config=${n}></joe-consumers>
          <div class="actions">
            <button type="button" class="btn btn-secondary" data-notip @click=${r}>${e("mode.close")}</button>
          </div>`;
				break;
			case "week": o = e("week.label"), s = !0, i = E`<joe-week-editor
          .hass=${this.hass}
          .t=${e}
          .config=${n}
          .status=${this.joe?.climate}
          .entityId=${t.id ?? ""}
        ></joe-week-editor>`;
		}
		return E`<joe-sheet
      label=${o}
      closeLabel=${e("common.close")}
      ?wide=${s}
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
		return E`<joe-sheet
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
		let n = re(e).redirect ?? me(e), r = w(this.base, n);
		if (!t.replace && location.pathname === r) {
			this.scrollTop = 0;
			return;
		}
		t.replace || history.replaceState({
			...history.state ?? {},
			joeScroll: this.scrollTop
		}, ""), this.jumped = !0, history[t.replace ? "replaceState" : "pushState"](t.sheet ? { joeSheet: !0 } : null, "", r), window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: !!t.replace } })), !t.sheet && !re(n).route.id && (this.scrollTop = 0);
	}
	restoreScroll(e) {
		let t = 0, n = () => {
			this.scrollTop = e, Math.abs(this.scrollTop - e) > 2 && t++ < 12 && window.setTimeout(n, 150);
		};
		requestAnimationFrame(n);
	}
	static {
		this.styles = [
			he,
			T,
			x`
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
e([y({ attribute: !1 })], $.prototype, "hass", void 0), e([y({
	type: Boolean,
	reflect: !0
})], $.prototype, "narrow", void 0), e([y({ attribute: !1 })], $.prototype, "route", void 0), e([s()], $.prototype, "joe", void 0), e([s()], $.prototype, "info", void 0), e([s()], $.prototype, "failed", void 0), e([s()], $.prototype, "modeDialog", void 0), e([s()], $.prototype, "notice", void 0), e([s()], $.prototype, "discovery", void 0), e([s()], $.prototype, "discovering", void 0), e([s()], $.prototype, "discoveryFailed", void 0), e([s()], $.prototype, "checks", void 0), e([s()], $.prototype, "picker", void 0), e([s()], $.prototype, "editor", void 0), e([s()], $.prototype, "climateFound", void 0), f("energy-joe-panel", $);
//#endregion
export { $ as EnergyJoePanel };
