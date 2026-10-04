import { A as e, C as t, D as n, E as r, O as i, S as a, T as o, _ as s, a as c, b as l, c as u, d, f, g as p, h as m, i as h, j as g, k as _, l as v, m as y, n as ee, o as te, p as ne, r as re, s as b, t as ie, u as ae, v as oe, w as se, x, y as S } from "./tokens-4ZRvXhwd.js";
//#region src/assets.ts
var ce = import.meta.url.replace(/[^/]*$/, ""), le = (e) => `${ce}${e}`, C = _`<svg
  class="swoosh"
  viewBox="0 0 300 16"
  preserveAspectRatio="none"
  aria-hidden="true"
>
  <path d="M2 13 C 70 5, 190 1, 298 3 L 298 6 C 190 5, 80 9, 4 15 Z" fill="currentColor" />
</svg>`;
function w(e, t = "h2", n) {
	let r = a(e), i = r.length - 1, o = r.map((e, t) => t === i && r.length > 1 ? _`<span class="hl">${e}</span>` : e.endsWith("!") ? _`${e}<br />` : _`${e}`), s = n ? _`<span class="title-tip">${n}</span>` : "";
	return t === "h1" ? _`<h1 class="display">${o}${s}</h1>` : _`<h2 class="display">${o}${s}</h2>`;
}
function T(e, t) {
	let n = t >= .85 ? 4 : t >= .65 ? 3 : t >= .45 ? 2 : 1, r = e(`conf.${n}`);
	return _`<span class="conf" role="img" aria-label=${r} title=${r}>
    ${[
		1,
		2,
		3,
		4
	].map((e) => _`<i class=${e <= n ? "on" : ""}></i>`)}
  </span>`;
}
var ue = {
	read: "mdi:eye-outline",
	learned: "mdi:auto-fix",
	user: "mdi:account-edit-outline",
	default: "mdi:tune-variant"
};
function E(e, t) {
	let n = t?.source ?? "default";
	return _`<span class="chip ${n}"
    ><ha-icon icon=${ue[n]}></ha-icon>${e(`source.${n}`)}</span
  >`;
}
function de(e, t) {
	let n = {};
	for (let [e, r] of Object.entries(t)) (typeof r == "string" || typeof r == "number") && (n[e] = r);
	return e.optional(`reason.${t.code}`, n) ?? t.code;
}
//#endregion
//#region src/components/pose.ts
var fe = /* @__PURE__ */ new Set(["welcome"]), pe = /* @__PURE__ */ new Set([
	"night-charge",
	"sleep",
	"learn"
]), me = "thumbs", he = class extends n {
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
		let e = pe.has(this.name) ? "scene" : "";
		if (this.name === me) return _`<img class="light" src=${le("logo.webp")} alt=${this.alt} decoding="async" /><img
          class="dark"
          src=${le("logo-dark.webp")}
          alt=${this.alt}
          decoding="async"
        />`;
		let t = le(`poses/${this.name}.webp`);
		return fe.has(this.name) ? _`<img class="light" src=${t} alt=${this.alt} decoding="async" /><img
        class="dark"
        src=${le(`poses/${this.name}-dark.webp`)}
        alt=${this.alt}
       
        decoding="async"
      />` : _`<img class=${e} src=${t} alt=${this.alt} decoding="async" />`;
	}
};
S([r()], he.prototype, "name", void 0), S([r()], he.prototype, "alt", void 0), x("joe-pose", he);
//#endregion
//#region src/components/empty-state.ts
var ge = class extends n {
	constructor(...e) {
		super(...e), this.pose = "", this.heading = "", this.text = "", this.note = "";
	}
	static {
		this.styles = [l, g`
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
		return _`<div class="wrap">
      <joe-pose name=${this.pose}></joe-pose>
      <div>
        ${w(this.heading)} ${C}
        <p class="lead">${this.text}</p>
        ${this.note ? _`<div class="note"><span class="chip soon">${this.note}</span></div>` : i}
        <slot></slot>
      </div>
    </div>`;
	}
};
S([r()], ge.prototype, "pose", void 0), S([r()], ge.prototype, "heading", void 0), S([r()], ge.prototype, "text", void 0), S([r()], ge.prototype, "note", void 0), x("joe-empty-state", ge);
//#endregion
//#region src/components/entity-picker.ts
var _e = 60, D = class extends n {
	constructor(...e) {
		super(...e), this.selected = [], this.invert = !1, this.query = "", this.showAll = !1, this.limit = _e;
	}
	static {
		this.styles = [l, g`
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
		e.has("request") && this.request && (this.selected = [...this.request.selected], this.invert = this.request.measurement?.invert ?? !1, this.query = "", this.showAll = !1, this.limit = _e);
	}
	render() {
		let { hass: e, t, request: n } = this;
		if (!e || !t || !n) return i;
		let r = this.candidates(e, n), a = r.slice(0, this.limit), o = this.query ? [] : (n.suggestions ?? []).filter((t) => e.states[t.entity_id]);
		return _`<div data-tipped>
      <div class="sheet-title">${w(n.heading, "h2", v(t, n.tip))}</div>
      <input
        class="input search"
        type="search"
        .value=${this.query}
        placeholder=${t("pick.search")}
        aria-label=${t("pick.search")}
        @input=${(e) => {
			this.query = e.target.value, this.limit = _e;
		}}
      />
      ${o.length ? _`<div class="group-label">${t("pick.suggested")}</div>
            <ul>
              ${o.map((r) => this.renderRow(e, t, n, r.entity_id, r))}
            </ul>` : i}
      <div class="group-label">${t(this.showAll ? "pick.all" : "pick.fitting")} · ${r.length}</div>
      ${r.length ? _`<ul>
            ${a.map((r) => this.renderRow(e, t, n, r))}
          </ul>` : _`<p class="empty">${t("pick.empty")}</p>`}
      ${r.length > a.length ? _`<button type="button" class="mini-btn more" data-notip @click=${() => this.limit += _e}>
            ${t("pick.more", { count: r.length - a.length })}
          </button>` : i}
      <div class="line">
        <button
          type="button"
          id="all"
          class="switch"
          role="switch"
          aria-checked=${String(this.showAll)}
          aria-labelledby="all-label"
          @click=${() => {
			this.showAll = !this.showAll, this.limit = _e;
		}}
        ></button>
        <label id="all-label" for="all">${t("pick.show_all")}</label>
        ${v(t, "pick_all")}
      </div>
      ${n.measurement ? this.renderInvert(e, t, n) : i}
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
			if (r.has(a) || !this.showAll && (!ne(o, t.filter) || e.entities?.[a]?.hidden)) continue;
			let s = d(e, a);
			if (n.length) {
				let t = `${s} ${a} ${f(e, a)}`.toLowerCase();
				if (!n.every((e) => t.includes(e))) continue;
			}
			i.push({
				id: a,
				name: s
			});
		}
		return i.sort((e, t) => e.name.localeCompare(t.name, this.t?.lang)), i.map((e) => e.id);
	}
	renderRow(e, t, n, r, a) {
		let o = this.selected.includes(r), s = f(e, r), c = a?.reasons?.[0];
		return _`<li>
      <button type="button" class="row" aria-pressed=${String(o)} @click=${() => this.toggle(r)}>
        <span class="mark ${n.multiple ? "box" : ""}" aria-hidden="true">
          ${o ? _`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>` : i}
        </span>
        <span class="txt">
          <b>${d(e, r)}</b>
          <small>${s ? `${s} · ` : ""}${r}</small>
          ${c ? _`<small class="why">${de(t, c)}</small>` : i}
        </span>
        <span class="end">
          <span class="val">${m(e, r, t.lang)}</span>
          ${a?.confidence == null ? i : T(t, a.confidence)}
        </span>
      </button>
    </li>`;
	}
	renderInvert(e, t, n) {
		let r = n.measurement?.role ?? "grid", a = this.selected[0], o = a ? p(e, {
			entity_id: a,
			invert: this.invert,
			minus_entity_id: null
		}) : null, s = "";
		if (o !== null) {
			let e = y(t.lang, Math.abs(o), 2);
			s = r === "grid" ? t(o >= 0 ? "pick.preview.import" : "pick.preview.export", { value: e }) : r === "battery" ? t(o >= 0 ? "pick.preview.charge" : "pick.preview.discharge", { value: e }) : t(o >= -.05 ? `pick.preview.${r}` : "pick.preview.negative", { value: y(t.lang, o, 2) });
		}
		return _`<div class="line">
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
        ${v(t, r === "battery" ? "pick_invert_battery" : "pick_invert")}
      </div>
      ${s ? _`<div class="note preview"><ha-icon icon="mdi:eye-outline"></ha-icon><span>${s}</span></div>` : i}`;
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
S([r({ attribute: !1 })], D.prototype, "hass", void 0), S([r({ attribute: !1 })], D.prototype, "t", void 0), S([r({ attribute: !1 })], D.prototype, "request", void 0), S([o()], D.prototype, "selected", void 0), S([o()], D.prototype, "invert", void 0), S([o()], D.prototype, "query", void 0), S([o()], D.prototype, "showAll", void 0), S([o()], D.prototype, "limit", void 0), x("joe-entity-picker", D);
//#endregion
//#region src/components/sheet.ts
var ve = class extends n {
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
		return _`<div
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
S([r()], ve.prototype, "label", void 0), S([r()], ve.prototype, "closeLabel", void 0), S([r({
	type: Boolean,
	reflect: !0
})], ve.prototype, "wide", void 0), S([se(".panel")], ve.prototype, "panel", void 0), x("joe-sheet", ve);
//#endregion
//#region src/components/sim-switch.ts
var ye = {
	simulation: "mdi:pause",
	advisory: "mdi:comment-question-outline",
	live: "mdi:play",
	off: "mdi:power"
}, be = class extends n {
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
		return e ? _`<button
      type="button"
      class="${this.mode}${this.running ? " running" : ""}"
      aria-label=${e("mode.switch.label")}
      @click=${this.toggle}
    >
      <span class="knob"><ha-icon icon=${ye[this.mode]}></ha-icon></span>
      <span>
        <b>${e(`mode.${this.mode}`)}</b>
        ${this.compact ? i : _`<small>${e(`mode.${this.mode}.sub`)}</small>`}
      </span>
    </button>` : i;
	}
	toggle() {
		this.dispatchEvent(new CustomEvent("joe-mode-switch", {
			bubbles: !0,
			composed: !0
		}));
	}
};
S([r()], be.prototype, "mode", void 0), S([r({ type: Boolean })], be.prototype, "compact", void 0), S([r({ type: Boolean })], be.prototype, "running", void 0), S([r({ attribute: !1 })], be.prototype, "t", void 0), x("joe-sim-switch", be);
//#endregion
//#region src/config.ts
var xe = /\[[^\]]*\]|[^.[]+/g;
function Se(e) {
	let t = [], n = "";
	for (let r of e.match(xe) ?? []) n = !n || r.startsWith("[") ? n + r : `${n}.${r}`, t.push(n);
	return t.reverse();
}
function O(e, t) {
	for (let n of Se(t)) {
		let t = e.provenance[n];
		if (t) return t;
	}
}
function k(e, t) {
	return e.answers.ignored.includes(t);
}
function A(e, t, n) {
	let r = e.answers.ignored.filter((e) => e !== t);
	return n ? [...r, t] : r;
}
function j(e, t, n = "user") {
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
function M(e, t) {
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
function Ce(e, t = []) {
	let n = /* @__PURE__ */ new Set(), r = [];
	for (let i of [...e, ...t.map((e) => ({ entity_id: e.entity_id }))]) n.has(i.entity_id) || (n.add(i.entity_id), r.push(i));
	return r;
}
function we(e) {
	return {
		entity_id: e.entity.entity_id,
		confidence: e.confidence,
		reasons: e.reasons
	};
}
//#endregion
//#region src/components/calendar-flow.ts
var Te = class extends n {
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
		return e ? _`<ol aria-label=${e(`flow.${this.variant}.title`)}>
      ${this.steps(e).map((e, t) => _`<li class=${e.joe ? "joe" : ""}>
          <span class="badge" aria-hidden="true">
            <ha-icon icon=${e.icon}></ha-icon>
            <span class="number">${t + 1}</span>
          </span>
          <span .innerHTML=${this.bold(e.text)}></span>
        </li>`)}
    </ol>` : i;
	}
	bold(e) {
		return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
	}
};
S([r({ attribute: !1 })], Te.prototype, "t", void 0), S([r()], Te.prototype, "variant", void 0), S([r()], Te.prototype, "address", void 0), S([r()], Te.prototype, "calendar", void 0), x("joe-calendar-flow", Te);
//#endregion
//#region src/components/car-account.ts
var Ee = [
	"google",
	"outlook",
	"microsoft",
	"icloud",
	"infomaniak",
	"caldav"
], De = /* @__PURE__ */ new Set([
	"google",
	"outlook",
	"microsoft"
]), Oe = {
	kind: "outlook",
	address: "",
	username: null,
	url: null,
	client_id: null,
	tenant: "common",
	accept: !0
}, N = class extends n {
	constructor(...e) {
		super(...e), this.actionId = "", this.saved = !1, this.password = "", this.secret = "", this.busy = !1, this.ownApp = !1;
	}
	static {
		this.styles = [l, g`
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
		if (!e) return i;
		let t = this.account, n = De.has(t.kind);
		return _`<div class="field" data-tipped>
        <div class="head-row"><label for="account-kind"><b>${e("calendar.account.kind")}</b></label> ${v(e, "calendar_account")}</div>
        <select id="account-kind" class="input" @change=${(e) => this.set({ kind: e.target.value })}>
          ${Ee.map((n) => _`<option value=${n} ?selected=${n === t.kind}>${e(`calendar.account.kind.${n}`)}</option>`)}
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
        ${t.kind === "google" ? _`<p class="hint">${e("calendar.account.google.hint")}</p>` : i}
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
			...Oe,
			...this.need?.account ?? {}
		};
	}
	joeApp(e) {
		return e === "google" ? !!this.apps?.google : !!this.apps?.microsoft;
	}
	renderSignIn(e, t) {
		let n = this.status, r = n?.oauth, a = t.kind === "google", o = this.joeApp(t.kind), s = !o || this.ownApp || !!t.client_id || t.kind === "microsoft", c = !!n?.has_sign_in, l = this.signInError ?? (r?.state === "error" ? r.error : void 0);
		return _`${s ? this.renderOwnApp(e, t, o) : i}
      <div class="field" data-tipped>
        <div class="inline">
          <button type="button" class="mini-btn go" ?disabled=${this.busy} @click=${() => this.act("sign_in")}>
            <ha-icon icon=${a ? "mdi:google" : "mdi:microsoft"}></ha-icon>${e(c ? "mail.sign_in.again" : a ? "mail.sign_in.google" : "mail.sign_in")}
          </button>
          ${c ? _`<button type="button" class="mini-btn quiet" @click=${() => this.act("sign_out")}>${e("mail.sign_out")}</button>` : i}
          ${s ? i : _`<button type="button" class="mini-btn quiet" @click=${() => this.ownApp = !0}>${e("calendar.account.own_app")}</button>`}
          ${v(e, "mail_sign_in")}
        </div>
        ${r?.state === "waiting" && !this.signInError ? _`<p class="code">${e("mail.sign_in.code", { code: r.user_code ?? "" })}
              <a href=${r.uri ?? ""} target="_blank" rel="noreferrer noopener">${r.uri}</a></p>` : l ? _`<p class="bad">${e.optional(`calendar.account.oauth.${l}`) ?? e("calendar.account.oauth.other")}</p>` : c ? _`<p class="hint ok">${e("mail.signed_in")}</p>` : i}
      </div>`;
	}
	renderOwnApp(e, t, n) {
		let r = t.kind === "google";
		return _`<div class="field" data-tipped>
      <div class="head-row">
        <b>${e(n ? "calendar.account.client_id" : "calendar.account.client_id.needed")}</b>
        ${v(e, r ? "google_app" : "mail_microsoft")}
      </div>
      ${n ? i : _`<p class="hint">${e("calendar.account.no_joe_app")}</p>`}
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
        ${t.kind === "microsoft" ? _`<input
              class="input"
              type="text"
              placeholder="common"
              aria-label=${e("mail.tenant")}
              .value=${t.tenant}
              @change=${(e) => this.set({ tenant: e.target.value.trim() || "common" })}
            />` : i}
      </div>
      ${r ? _`<form
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
          ${this.status?.has_client_secret ? _`<p class="hint ok">${e("mail.password.saved")}</p>` : i}` : i}
    </div>`;
	}
	renderPassword(e, t) {
		return _`${t.kind === "caldav" ? _`<div class="field" data-tipped>
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
          </div>` : i}
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
        ${this.status?.has_password ? _`<p class="hint ok">${e("mail.password.saved")}</p>` : i}
      </div>`;
	}
	renderStatus(e) {
		let t = this.status, n = De.has(this.account.kind) ? t?.has_sign_in : t?.has_password, r = this.saved ? t?.state === "error" ? e("mail.state.error", { error: e.optional(`calendar.account.error.${t.error}`) ?? e("calendar.account.error.other") }) : t?.checked ? e("mail.state.ok", { time: b(t.checked) }) : "" : e("calendar.account.after_save");
		return _`<div class="inline" data-tipped>
      <button type="button" class="mini-btn" ?disabled=${this.busy || !n} @click=${() => this.act("test")}>
        <ha-icon icon="mdi:calendar-check-outline"></ha-icon>${e("calendar.account.test")}
      </button>
      ${v(e, "calendar_account_test")}
      <span class=${this.saved && t?.state === "error" ? "bad" : "hint"}>${r}</span>
      ${this.result ? _`<span class=${this.result === "ok" ? "ok" : "bad"}>
            ${e.optional(`calendar.account.result.${this.result}`) ?? e("calendar.account.result.other")}
          </span>` : i}
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
S([r({ attribute: !1 })], N.prototype, "hass", void 0), S([r({ attribute: !1 })], N.prototype, "t", void 0), S([r()], N.prototype, "actionId", void 0), S([r({ type: Boolean })], N.prototype, "saved", void 0), S([r({ attribute: !1 })], N.prototype, "need", void 0), S([r({ attribute: !1 })], N.prototype, "status", void 0), S([r({ attribute: !1 })], N.prototype, "apps", void 0), S([o()], N.prototype, "password", void 0), S([o()], N.prototype, "secret", void 0), S([o()], N.prototype, "result", void 0), S([o()], N.prototype, "signInError", void 0), S([o()], N.prototype, "busy", void 0), S([o()], N.prototype, "ownApp", void 0), x("joe-car-account", N);
//#endregion
//#region src/components/car-mailbox.ts
var ke = [
	"webde",
	"gmx",
	"google",
	"tonline",
	"other"
], Ae = {
	"web.de": "webde",
	"gmx.de": "gmx",
	"gmx.net": "gmx",
	"gmx.at": "gmx",
	"gmx.ch": "gmx",
	"gmail.com": "google",
	"googlemail.com": "google",
	"t-online.de": "tonline"
}, je = {
	provider: "other",
	address: "",
	username: null,
	imap_host: null,
	imap_port: null,
	smtp_host: null,
	smtp_port: null,
	smtp_security: null,
	accept: !0
}, P = class extends n {
	constructor(...e) {
		super(...e), this.actionId = "", this.saved = !1, this.password = "", this.busy = !1, this.servers = !1;
	}
	static {
		this.styles = [l, g`
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
		if (!e) return i;
		let t = this.mailbox, n = this.servers || t.provider === "other" && !!t.address;
		return _`<div class="field" data-tipped>
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
          ${ke.map((n) => _`<option value=${n} ?selected=${n === t.provider}>${e(`mail.provider.${n}`)}</option>`)}
        </select>
        <p class="hint">${e(`mail.provider.${t.provider}.hint`)}</p>
      </div>
      ${this.renderPassword(e)} ${n ? this.renderServers(e, t) : i}
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
        ${n ? i : _`<button type="button" class="mini-btn quiet" @click=${() => this.servers = !0}>${e("mail.servers.change")}</button>`}
      </div>
      ${this.renderStatus(e)} ${this.renderRecent(e)}`;
	}
	get mailbox() {
		return {
			...je,
			...this.need?.mailbox ?? {}
		};
	}
	renderPassword(e) {
		return _`<div class="field" data-tipped>
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
      ${this.status?.has_secret ? _`<p class="hint ok">${e("mail.password.saved")}</p>` : _`<p class="hint">${e("mail.password.hint")}</p>`}
    </div>`;
	}
	renderServers(e, t) {
		let n = (n) => _`<input
      class="input"
      type="text"
      aria-label=${e(`mail.${n}`)}
      placeholder=${e(`mail.${n}`)}
      .value=${t[n] ?? ""}
      @change=${(e) => this.set({ [n]: e.target.value.trim() || null })}
    />`, r = (n) => _`<input
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
		return _`<div class="field" data-tipped>
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
		return _`<div class="field" data-tipped>
      <div class="inline">
        <button type="button" class="mini-btn" ?disabled=${this.busy || !this.status?.has_secret} @click=${() => this.act("test")}>
          <ha-icon icon="mdi:connection"></ha-icon>${e("mail.test")}
        </button>
        ${this.saved ? _`<button type="button" class="mini-btn" ?disabled=${this.busy || !this.status?.has_secret} @click=${() => this.act("check")}>
              <ha-icon icon="mdi:email-sync-outline"></ha-icon>${e("mail.check")}
            </button>` : i}
        ${v(e, "mail_status")}
      </div>
      <p class=${this.saved && this.status?.state === "error" ? "hint bad" : "hint"}>
        ${this.saved ? this.statusText(e) : e("mail.after_save")}
      </p>
      ${this.result ? _`<p class=${this.result === "ok" ? "hint ok" : "hint bad"} role="status">
            ${e.optional(`mail.result.${this.result}`) ?? e("mail.result.failed")}
          </p>` : i}
    </div>`;
	}
	renderRecent(e) {
		let t = this.status?.recent ?? [];
		if (!t.length) return i;
		let n = this.need?.allowed ?? [];
		return _`<div class="field" data-tipped>
      <div class="head-row"><b>${e("mail.recent")}</b> ${v(e, "mail_recent")}</div>
      <ul>
        ${t.slice(0, 8).map((t) => _`<li>
            <span class="what">
              ${t.summary || "–"} ${t.start && t.start.includes("T") ? `· ${t.start.slice(8, 10)}.${t.start.slice(5, 7)}. ${b(t.start)}` : ""}
              · ${t.from}
            </span>
            <span class=${t.result.startsWith("not") || t.result.endsWith("not_accepted") || t.result.startsWith("no_") ? "bad" : ""}>
              ${e.optional(`mail.recent.${t.result}`) ?? t.result}
            </span>
            ${t.result === "not_allowed" && !n.includes(t.from) ? _`<button type="button" class="mini-btn" @click=${() => this.change({ allowed: [...n, t.from] })}>${e("mail.allow")}</button>` : i}
          </li>`)}
      </ul>
    </div>`;
	}
	statusText(e) {
		let t = this.status;
		return !t || t.state === "off" || t.state === "waiting" ? e("mail.state.waiting") : t.state === "no_secret" ? e("mail.state.no_secret") : t.state === "error" ? e("mail.state.error", { error: e.optional(`mail.error.${t.error}`) ?? String(t.error) }) : e("mail.state.ok", { time: t.checked ? b(t.checked) : "–" });
	}
	setAddress(e) {
		let t = Ae[e.split("@")[1] ?? ""], n = this.mailbox, r = n.provider === "other" || n.provider === Ae[n.address.split("@")[1] ?? ""];
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
S([r({ attribute: !1 })], P.prototype, "hass", void 0), S([r({ attribute: !1 })], P.prototype, "t", void 0), S([r()], P.prototype, "actionId", void 0), S([r({ type: Boolean })], P.prototype, "saved", void 0), S([r({ attribute: !1 })], P.prototype, "need", void 0), S([r({ attribute: !1 })], P.prototype, "status", void 0), S([o()], P.prototype, "password", void 0), S([o()], P.prototype, "busy", void 0), S([o()], P.prototype, "result", void 0), S([o()], P.prototype, "servers", void 0), x("joe-car-mailbox", P);
//#endregion
//#region src/components/car-calendars.ts
var Me = [
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
], Ne = [
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
], F = class extends n {
	constructor(...e) {
		super(...e), this.actionId = "", this.savedSource = null, this.carName = "", this.copied = !1, this.copyFailed = !1, this.linksFailed = !1, this.sender = "";
	}
	static {
		this.styles = [l, g`
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
		if (!e || !t) return i;
		let n = this.need?.source ?? "ha";
		return _`<div data-tipped>
        <div class="head-row"><b>${e("calendar.source")}</b> ${v(e, "calendar_source")}</div>
        <div class="ways-box"><div class="ways" role="radiogroup" aria-label=${e("calendar.source")}>
          ${Me.map((t) => _`<button
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
      ${this.linksFailed ? _`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("calendar.links_failed")}</span>
            <button type="button" class="mini-btn quiet" @click=${() => this.load(!1)}>${e("calendar.retry")}</button>
          </div>` : i}`;
	}
	saved(e) {
		return this.savedSource === e;
	}
	renderLegacy(e, t) {
		let n = this.savedSource && this.savedSource !== "mailbox" && this.savedSource === (this.need?.source ?? "ha") ? this.links?.entities[this.actionId] : null;
		return n ? _`<div class="own" data-tipped>
          <div class="head-row"><ha-icon icon="mdi:calendar-clock"></ha-icon><b>${e("calendar.own.legacy")}</b> ${v(e, "calendar_legacy")}</div>
          <p class="hint">${e("calendar.own.legacy.hint", { name: d(t, n) })}</p>
        </div>` : i;
	}
	renderCalendar(e, t) {
		let n = this.need?.calendars ?? [];
		return _`<div class="part">
        <joe-calendar-flow .t=${e} variant="calendar"></joe-calendar-flow>
      </div>
      ${this.renderLegacy(e, t)}
      <div data-tipped>
        <div class="head-row"><b>${e("calendar.pick")}</b> ${v(e, "calendar_more")}</div>
        <div class="chips">
          ${n.map((r) => _`<span class="chip">
              ${d(t, r)}
              <button
                type="button"
                class="mini-btn quiet"
                aria-label=${e("calendar.remove", { name: d(t, r) })}
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
          ${Ne.map((t) => _`<a class="mini-btn" href=${t.url} target="_blank" rel="noreferrer noopener">
                <ha-icon icon="mdi:open-in-new"></ha-icon>${e(`calendar.connect.${t.key}`)}
              </a>`)}
          ${v(e, "calendar_connect")}
        </div>
      </div>`;
	}
	async pick() {
		let e = this.t, t = await M(this, {
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
		let n = this.saved("mailbox"), r = n ? this.links?.entities[this.actionId] : null, i = r ? d(t, r) : e("calendar.own.name", { car: this.carName });
		return _`<div class="part">
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
		let r = _`<div class="head-row">
      <ha-icon icon="mdi:calendar-import"></ha-icon><b>${e("calendar.own")}</b> ${v(e, "calendar_own")}
    </div>`;
		if (!n) return _`<div class="own" data-tipped>${r}<p class="hint">${e("calendar.own.after_save", { name: t })}</p></div>`;
		let a = this.links?.links[this.actionId], o = this.links?.external_url, s = a && o ? `${o.replace(/\/$/, "")}${a}` : null;
		return _`<div class="own" data-tipped>
      ${r}
      <p class="hint">${e("calendar.own.hint", { name: t })}</p>
      ${s ? _`<div class="link">
            <code>${s}</code>
            <button type="button" class="mini-btn" @click=${() => this.copy(s)}>
              <ha-icon icon=${this.copied ? "mdi:check" : "mdi:content-copy"}></ha-icon>${e(this.copied ? "calendar.copied" : "calendar.copy")}
            </button>
            <button type="button" class="mini-btn quiet" @click=${() => this.load(!0)}>
              <ha-icon icon="mdi:refresh"></ha-icon>${e("calendar.renew")}
            </button>
            ${v(e, "calendar_link")}
          </div>
          ${this.copyFailed ? _`<p class="hint bad">${e("calendar.copy_failed")}</p>` : i}` : _`<p class="hint">${e("calendar.no_external")}</p>`}
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
		return _`<div class="part">
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
      ${this.renderAllowed(e, "account_allowed")} ${this.hass ? this.renderLegacy(e, this.hass) : i}`;
	}
	renderAllowed(e, t = "mail_allowed") {
		let n = this.need?.allowed ?? [];
		return _`<div class="part" data-tipped>
      <div class="head-row"><b>${e("mail.allowed")}</b> ${v(e, t)}</div>
      <p class="hint">${e("mail.allowed.hint")}</p>
      ${n.length ? _`<div class="chips">
            ${n.map((t) => _`<span class="chip">
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
          </div>` : _`<div class="note warn"><ha-icon icon="mdi:account-alert-outline"></ha-icon><span>${e("mail.allowed.none")}</span></div>`}
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
S([r({ attribute: !1 })], F.prototype, "hass", void 0), S([r({ attribute: !1 })], F.prototype, "t", void 0), S([r()], F.prototype, "actionId", void 0), S([r({ attribute: !1 })], F.prototype, "savedSource", void 0), S([r({ attribute: !1 })], F.prototype, "need", void 0), S([r({ attribute: !1 })], F.prototype, "mailbox", void 0), S([r({ attribute: !1 })], F.prototype, "account", void 0), S([r({ attribute: !1 })], F.prototype, "apps", void 0), S([r()], F.prototype, "carName", void 0), S([o()], F.prototype, "links", void 0), S([o()], F.prototype, "copied", void 0), S([o()], F.prototype, "copyFailed", void 0), S([o()], F.prototype, "linksFailed", void 0), S([o()], F.prototype, "sender", void 0), x("joe-car-calendars", F);
//#endregion
//#region src/hot-water.ts
var Pe = [
	"warmwasser",
	"brauchwasser",
	"trinkwasser",
	"boiler",
	"hot_water",
	"hot water",
	"dhw",
	"water_heater",
	"water heater"
], Fe = [
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
], Ie = [
	"switch",
	"input_boolean",
	"select",
	"input_select",
	"number",
	"input_number",
	"button",
	"script"
];
function Le(e, t) {
	let n = e.states[t], r = String(n?.attributes.friendly_name ?? ""), i = e.entities?.[t]?.device_id, a = i ? e.devices?.[i] : void 0;
	return `${t} ${r} ${a?.name_by_user ?? a?.name ?? ""}`.toLowerCase().replaceAll("-", " ");
}
function Re(e, t) {
	return [...Pe, ...t].some((t) => e.includes(t));
}
function ze(e) {
	return (e ?? "").toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((e) => e.length >= 5);
}
function Be(e, t) {
	let n = ze(t), r = [], i = [];
	for (let [t, a] of Object.entries(e.states)) {
		let o = t.split(".")[0], s = Le(e, t);
		if (!Re(s, n)) continue;
		let c = t.toLowerCase(), l = String(a.attributes.unit_of_measurement ?? "");
		if ((o === "sensor" || o === "number") && (l === "°C" || l === "°F")) {
			let e = (Pe.some((e) => c.includes(e.replace(" ", "_"))) ? 2 : 1) - (Fe.some((e) => s.includes(e)) ? 2 : 0);
			r.push({
				entity_id: t,
				score: e
			});
		} else Ie.includes(o) && i.push({
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
var Ve = [
	"eq",
	"ne",
	"lt",
	"le",
	"gt",
	"ge"
], He = {
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
}, Ue = {
	reserve_km: [0, 1e3],
	consumption: [5, 60],
	daily_km: [0, 2e3],
	capacity_kwh: [.1, 300]
}, We = {
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
function Ge(e, t) {
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
var I = class extends n {
	constructor(...e) {
		super(...e), this.actionId = "", this.saving = !1, this.problem = "";
	}
	static {
		this.styles = [l, g`
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
				let e = Ge(this.actionId.slice(4), this.t), t = this.discovery?.wallboxes.find((e) => e.is_car);
				this.actionId === "new:ev" && t && Object.assign(e, this.fromWallbox(t));
				let n = this.config?.consumers.filter((e) => e.kind === "hot_water") ?? [];
				this.actionId === "new:hot_water" && n.length === 1 && (e.consumer_id = n[0].id), this.draft = e;
			} else this.existing && (this.draft = structuredClone(this.existing));
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
		if (!e || !t || !n) return i;
		let r = !this.existing;
		return _`<div class="sheet-title">${w(e(r ? "action.title.new" : "action.title"))}</div>
      ${this.field(e("action.f.name"), "a_name", _`<input
          class="input"
          type="text"
          maxlength="60"
          .value=${n.name}
          @change=${(e) => this.set({ name: e.target.value.trim() || n.name })}
        />`)}
      ${this.field(e("action.f.kind"), "a_kind", _`<div class="seg" role="group" aria-label=${e("action.f.kind")}>
          ${["switch", "target"].map((t) => _`<button type="button" aria-pressed=${String(n.kind === t)} @click=${() => this.set({ kind: t })}>
                ${e(`action.kind.${t}`)}
              </button>`)}
        </div>`)}
      ${this.field(e("action.f.entity"), "a_entity", this.entityBox(e, n.entity_id, () => this.pickTarget()))}
      ${n.entity_id ? this.field(e("action.f.on_value"), "a_on_value", this.valueInput(n.entity_id, n.on_value, (e) => this.set({ on_value: e }))) : i}
      ${this.field(e("action.f.reset"), "a_reset", _`<div class="row">
          <div class="seg" role="group" aria-label=${e("action.f.reset")}>
            ${["previous", "fixed"].map((t) => _`<button type="button" aria-pressed=${String(n.reset === t)} @click=${() => this.set({ reset: t })}>
                  ${e(`action.reset.${t}`)}
                </button>`)}
          </div>
          ${n.reset === "fixed" && n.entity_id ? this.valueInput(n.entity_id, n.reset_value ?? "", (e) => this.set({ reset_value: e })) : i}
        </div>`)}
      ${this.field(e("action.f.lead"), "a_lead", _`<span class="unit-input">
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
      ${n.kind === "target" ? this.renderTarget(e, n) : i}
      ${this.field(e("action.f.auto"), "a_auto", _`<div class="row">
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
      ${n.auto ? this.renderConditions(e, n) : i}
      ${n.kind === "switch" ? this.renderNeed(e, n) : i}
      ${this.field(e("action.f.power"), "a_power", _`<span class="unit-input">
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
      ${this.config?.consumers.length ?? 0 ? this.field(e("action.f.consumer"), "a_consumer", _`<select class="input" @change=${(e) => this.set({ consumer_id: e.target.value || null })}>
              <option value="" ?selected=${!n.consumer_id}>${e("action.f.consumer.none")}</option>
              ${this.config.consumers.map((e) => _`<option value=${e.id} ?selected=${n.consumer_id === e.id}>${e.name}</option>`)}
            </select>`) : i}
      ${this.field(e("action.f.priority"), "a_priority", _`<span class="unit-input">
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
      ${this.field(e("action.f.enabled"), "a_enabled", _`<button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(n.enabled)}
          aria-label=${e("action.f.enabled")}
          @click=${() => this.set({ enabled: !n.enabled })}
        ></button>`)}
      ${this.problem ? _`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.problem}</span></div>` : i}
      <div class="actions">
        <span data-tipped class="row">
          <button type="button" class="btn btn-primary" ?disabled=${this.saving} @click=${this.save}>${e("common.save")}</button>
          ${v(e, "a_save")}
        </span>
        <button type="button" class="btn btn-ghost" data-notip @click=${this.close}>${e("common.cancel")}</button>
      </div>
      ${r ? i : _`<div class="danger-zone" data-tipped>
            <button type="button" class="btn btn-danger" @click=${this.deleteAction}>${e("action.delete")}</button>
            ${v(e, "a_delete")}
          </div>`}`;
	}
	renderTarget(e, t) {
		let n = (n, r) => _`<label>
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
		return _`${this.field(e("action.f.sensor"), "a_sensor", this.entityBox(e, t.sensor_entity ?? "", () => this.pickSensor()))}
      ${this.field(e("action.f.temps"), "a_temps", _`<div class="temps">${n("comfort", "°C")} ${n("maximum", "°C")} ${n("buffer", "K")}</div>`)}`;
	}
	renderNeed(e, t) {
		let n = t.need ?? He, r = (this.config?.persons ?? []).filter((e) => e.calendars.length), a = (e, t, r, i = "") => _`<span
      class="unit-input"
    >
      <input
        class="input"
        type="number"
        inputmode="decimal"
        min=${Ue[e][0]}
        max=${Math.min(r, Ue[e][1])}
        step=${e === "consumption" || e === "capacity_kwh" ? "0.1" : "1"}
        placeholder=${i}
        .value=${n[e] == null ? "" : String(n[e])}
        @change=${(t) => {
			let n = t.target, r = Number.parseFloat(n.value.replace(",", ".")), [i, a] = Ue[e], o = Number.isFinite(r) && r >= i && r <= a, s = e === "reserve_km" ? 50 : null;
			o || (n.value = s == null ? "" : String(s)), this.setNeed({ [e]: o ? r : s });
		}}
      />
      <span class="unit">${t}</span>
    </span>`, o = (t) => this.entityBox(e, n[t] ?? "", () => this.pickNeed(t));
		return _`${this.field(e("action.need"), "a_need", _`<div class="row">
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
      ${n.enabled ? _`${this.field(e("action.need.soc"), "a_need_soc", o("soc_entity"))}
          ${this.field(e("action.need.range"), "a_need_range", o("range_entity"))}
          ${this.field(e("action.need.capacity"), "a_need_capacity", _`<div class="row">${a("capacity_kwh", "kWh", 300, e("action.need.from_sensor"))}</div>
              ${n.capacity_kwh == null ? o("capacity_entity") : i}`)}
          ${this.field(e("action.need.reserve"), "a_need_reserve", a("reserve_km", "km", 1e3))}
          ${this.field(e("action.need.consumption"), "a_need_consumption", _`${a("consumption", "kWh/100 km", 60, e("action.need.learned"))}
              ${n.consumption == null ? o("consumption_entity") : i}`)}
          ${this.field(e("action.need.daily"), "a_need_daily", a("daily_km", "km", 2e3, e("action.need.learned")))}
          ${this.field(e("action.need.odometer"), "a_need_odometer", o("odometer_entity"))}
          ${this.field(e("action.need.persons"), "a_need_persons", r.length ? _`<div class="row" role="group" aria-label=${e("action.need.persons")}>
                  ${r.map((e) => {
			let t = n.persons == null || n.persons.includes(e.id);
			return _`<button
                      type="button"
                      class="mini-btn ${t ? "go" : "quiet"}"
                      aria-pressed=${String(t)}
                      @click=${() => this.togglePerson(e.id, r.map((e) => e.id))}
                    >
                      ${e.name}
                    </button>`;
		})}
                </div>` : _`<p class="field-hint">${e("action.need.no_calendars")}</p>`)}
          ${this.field(e("action.need.calendars"), "a_need_calendars", _`<joe-car-calendars
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
          ${this.field(e("action.need.round_trip"), "a_need_round_trip", _`<button
              type="button"
              class="switch"
              role="switch"
              aria-checked=${String(n.round_trip)}
              aria-label=${e("action.need.round_trip")}
              @click=${() => this.setNeed({ round_trip: !n.round_trip })}
            ></button>`)}
          ${this.config?.routing.service ? i : _`<div class="note"><ha-icon icon="mdi:map-marker-distance"></ha-icon><span>${e("action.need.no_routing")}</span></div>`}` : i}`;
	}
	setNeed(e) {
		this.set({ need: {
			...this.draft?.need ?? He,
			...e
		} });
	}
	toggleNeed() {
		let e = this.draft?.need ?? He;
		if (e.enabled) {
			this.setNeed({ enabled: !1 });
			return;
		}
		let t = this.discovery?.cars ?? [], n = (this.discovery?.wallboxes ?? []).filter((e) => e.is_car), r = t.length === 1 && n.length <= 1 ? t[0].entities : {}, i = { enabled: !0 };
		for (let [t, n] of Object.entries(We)) !e[t] && r[n.role] && (i[t] = r[n.role] ?? null);
		this.setNeed(i);
	}
	togglePerson(e, t) {
		let n = (this.draft?.need ?? He).persons ?? t, r = n.includes(e) ? n.filter((t) => t !== e) : [...n, e];
		this.setNeed({ persons: t.every((e) => r.includes(e)) ? null : r });
	}
	async pickNeed(e) {
		let t = this.t, n = We[e], r = (this.discovery?.cars ?? []).map((e) => ({
			entity_id: e.entities[n.role] ?? "",
			confidence: e.confidence,
			reasons: e.reasons
		})).filter((e) => e.entity_id), i = await M(this, {
			heading: t(`action.need.pick.${n.role}`),
			tip: n.tip,
			filter: n.filter,
			selected: this.draft?.need?.[e] ? [this.draft.need[e]] : [],
			suggestions: Ce(r)
		});
		i && this.setNeed({ [e]: i.selected[0] ?? null });
	}
	renderConditions(e, t) {
		let n = this.hass;
		return this.field(e("action.f.conditions"), "a_conditions", _`${t.conditions.map((t, r) => _`<div class="condition">
            <span><b>${d(n, t.entity_id)}</b></span>
            <select
              class="input"
              aria-label=${e("action.f.op")}
              @change=${(e) => this.setCondition(r, { op: e.target.value })}
            >
              ${Ve.map((n) => _`<option value=${n} ?selected=${t.op === n}>${e(`action.op.${n}`)}</option>`)}
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
		return _`<div class="field" data-tipped>
      <div class="field-label">${e} ${v(this.t, t)}</div>
      ${n}
    </div>`;
	}
	entityBox(e, t, n) {
		let r = this.hass;
		return _`<div class="entity">
      <span>
        ${t ? _`<b>${d(r, t)}</b><small>${m(r, t, e.lang)}</small>` : _`<small>${e("find.none")}</small>`}
      </span>
      <button type="button" class="mini-btn" @click=${n}>
        <ha-icon icon="mdi:magnify"></ha-icon>${e(t ? "review.change" : "review.choose")}
      </button>
    </div>`;
	}
	valueInput(e, t, n) {
		let r = this.t, i = e.split(".", 1)[0], a = this.hass?.states[e]?.attributes.options ?? [];
		if (["select", "input_select"].includes(i) && a.length) return _`<select class="input" aria-label=${r("action.f.value")} @change=${(e) => n(e.target.value)}>
        ${a.map((e) => _`<option value=${e} ?selected=${t === e}>${e}</option>`)}
      </select>`;
		if ([
			"switch",
			"input_boolean",
			"light",
			"fan"
		].includes(i)) {
			let e = t === !0 || t === "on";
			return _`<div class="seg" role="group" aria-label=${r("action.f.value")}>
        <button type="button" aria-pressed=${String(e)} @click=${() => n("on")}>${r("action.value.on")}</button>
        <button type="button" aria-pressed=${String(!e)} @click=${() => n("off")}>${r("action.value.off")}</button>
      </div>`;
		}
		return _`<input
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
		return Be(this.hass, e?.name);
	}
	async pickTarget() {
		let e = this.t, t = (await M(this, {
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
		let e = this.t, t = await M(this, {
			heading: e("action.pick.sensor"),
			tip: "a_sensor",
			filter: "temperature",
			selected: this.draft?.sensor_entity ? [this.draft.sensor_entity] : [],
			suggestions: this.hotWater()?.sensors
		});
		t?.selected[0] && this.set({ sensor_entity: t.selected[0] });
	}
	async addCondition() {
		let e = this.t, t = (await M(this, {
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
		let i = await j(this, { actions: { [n]: r } });
		this.saving = !1, i && this.close();
	}
	async deleteAction() {
		this.existing && await j(this, { actions: { [this.existing.id]: null } }) && this.close();
	}
	close() {
		this.dispatchEvent(new CustomEvent("joe-close", {
			bubbles: !0,
			composed: !0
		}));
	}
};
S([r({ attribute: !1 })], I.prototype, "hass", void 0), S([r({ attribute: !1 })], I.prototype, "mailboxes", void 0), S([r({ attribute: !1 })], I.prototype, "accounts", void 0), S([r({ attribute: !1 })], I.prototype, "apps", void 0), S([r({ attribute: !1 })], I.prototype, "t", void 0), S([r({ attribute: !1 })], I.prototype, "config", void 0), S([r({ attribute: !1 })], I.prototype, "discovery", void 0), S([r()], I.prototype, "actionId", void 0), S([o()], I.prototype, "draft", void 0), S([o()], I.prototype, "saving", void 0), S([o()], I.prototype, "problem", void 0), x("joe-action-editor", I);
//#endregion
//#region src/types.ts
var Ke = [
	"welcome",
	"scan",
	"questions",
	"done"
], qe = [
	"min_soc",
	"grid_charge",
	"charge_target",
	"mode",
	"charge_power",
	"discharge_power",
	"discharge_limit",
	"discharge_limit_enabled"
], Je = [
	"normal",
	"force_charge",
	"hold",
	"force_discharge"
], Ye = [
	"home_office",
	"office",
	"travel",
	"vacation",
	"guests",
	"home"
], Xe = [
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
function Ze(e) {
	let t = e.filter((e) => e.kind !== "submeter" && (e.kind === "ev" && (e.runs ?? "auto") !== "always" || e.runs === "surplus" || e.runs === "cheap")), n = new Set(t.map((e) => e.energy_entity).filter(Boolean));
	return t.filter((e) => !e.included_in || !n.has(e.included_in));
}
var Qe = [
	"forecast",
	"consumption",
	"battery",
	"hot_water",
	"car"
], $e = [
	"overview",
	"plan",
	"history",
	"learn",
	"devices",
	"climate",
	"settings"
], et = {
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
}, tt = [
	"charge",
	"hold",
	"release"
];
function nt(e) {
	let t = (...t) => t.every((t) => !!e.controls[t]), n = (t) => !!e.mode_options[t], r = [];
	t("mode") && n("force_charge") && r.push("mode"), t("grid_charge", "charge_target") && r.push("target"), t("grid_charge", "min_soc") && r.push("min_soc");
	let i = [];
	return t("min_soc") && i.push("min_soc"), t("mode") && n("hold") && i.push("mode_hold"), t("mode", "charge_power") && n("force_charge") && i.push("standby"), t("discharge_limit") && i.push("limit"), {
		charge: r,
		hold: i
	};
}
var L = class extends n {
	static {
		this.styles = [l, g`
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
		if (!e || !t) return i;
		let n = [
			"watch",
			...this.profileKey ? ["profile"] : [],
			"generic",
			"steps"
		], r = this.found?.suggested;
		return _`<div class="choose">
        <div class="seg" role="group" aria-label=${e("f.battery.control")}>
          ${n.map((t) => _`<button type="button" aria-pressed=${String(this.choice === t)} @click=${() => this.choose(t)}>
                ${t === "profile" ? e("f.battery.control.profile", { name: this.profiles?.[this.profileKey ?? ""] ?? this.profileKey ?? "" }) : e(`f.battery.control.${t}`)}
              </button>`)}
        </div>
      </div>
      ${this.choice === "watch" && r?.complete ? _`<div class="note" data-tipped>
            <ha-icon icon="mdi:lightbulb-on-outline"></ha-icon>
            <span
              >${e("f.battery.control.suggested")}
              <div class="note-actions">
                <button type="button" class="mini-btn go" @click=${this.takeSuggestion}>${e("f.battery.control.take")}</button>
                ${v(e, "control_roles")}
              </div></span
            >
          </div>` : i}
      ${this.choice === "profile" && Object.keys(t.steps).length && !Object.keys(t.controls).length ? this.renderServiceSteps(e, t) : this.choice === "profile" || this.choice === "generic" ? this.renderRoles(e, t) : i}
      ${this.choice === "steps" ? this.renderSteps(e, t) : i}
      ${this.choice === "watch" ? i : _`<p class="field-hint">${e("f.battery.control.retest")}</p>`}`;
	}
	renderRoles(e, t) {
		let n = this.hass, r = nt(t), a = r.charge.length && r.hold.length, o = t.controls.mode, s = o ? n.states[o]?.attributes.options ?? [] : [];
		return _`<div data-tipped>
      <div class="sub">${e("f.battery.control.levers")} ${v(e, "control_roles")}</div>
      <div class="rows">
        ${qe.map((r) => {
			let a = t.controls[r];
			return _`<div class="row">
            <span class="label">${e(`role.${r}`)}</span>
            <span class="entity">
              ${a ? _`<b>${d(n, a)}</b><small>${m(n, a, e.lang)}</small>` : _`<small>${e("find.none")}</small>`}
            </span>
            <span class="buttons">
              <button type="button" class="mini-btn" @click=${() => this.pickRole(r)}>
                <ha-icon icon="mdi:magnify"></ha-icon>${e(a ? "review.change" : "review.choose")}
              </button>
              ${a ? _`<button
                    type="button"
                    class="icon-btn"
                    aria-label=${e("f.remove")}
                    title=${e("f.remove")}
                    @click=${() => this.setRole(r, null)}
                  >
                    <ha-icon icon="mdi:close"></ha-icon>
                  </button>` : i}
            </span>
          </div>`;
		})}
      </div>
      </div>
      ${o ? _`<div data-tipped>
            <div class="sub">${e("f.battery.mode_options")} ${v(e, "mode_options")}</div>
            <div class="rows">
              ${Je.map((n) => _`<div class="row">
                  <label for="opt-${n}">${e(`meaning.${n}`)}</label>
                  <select
                    id="opt-${n}"
                    class="input"
                    @change=${(e) => this.setOption(n, e.target.value)}
                  >
                    <option value="" ?selected=${!t.mode_options[n]}>${e("meaning.none")}</option>
                    ${s.map((e) => _`<option value=${e} ?selected=${t.mode_options[n] === e}>${e}</option>`)}
                  </select>
                  <span></span>
                </div>`)}
            </div>
            </div>` : i}
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
		return _`<div data-tipped>
      <div class="sub">${e("f.battery.control.services")} ${v(e, "control_steps")}</div>
      <div class="rows">
        ${tt.flatMap((r) => (t.steps[r] ?? []).map((t) => _`<div class="row">
              <span class="label">${e(`f.battery.steps.${r}`)}</span>
              <span class="entity">
                ${t.service ? _`<b>${t.service}</b>` : _`<b>${d(n, t.entity_id ?? "")}</b><small>${String(t.value ?? "")}</small>`}
              </span>
              <span></span>
            </div>`))}
      </div>
    </div>`;
	}
	renderSteps(e, t) {
		let n = this.hass;
		return _`<div class="sub" data-tipped>${e("f.battery.control.steps")} ${v(e, "control_steps")}</div>
      <p class="field-hint">${e("f.battery.steps.hint")}</p>
      ${tt.map((r) => {
			let i = t.steps[r] ?? [];
			return _`<div class="sub">${e(`f.battery.steps.${r}`)}</div>
          <div class="rows" data-tipped>
            ${i.map((t, i) => _`<div class="row">
                <span class="entity"
                  ><b>${t.service ?? d(n, t.entity_id ?? "")}</b><small>${t.entity_id ?? ""}</small></span
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
                  ${this.valueHints(t.entity_id ?? "", r).map((e) => _`<option value=${e}></option>`)}
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
		let t = this.t, n = this.value.controls[e], r = await M(this, {
			heading: t("pick.role.title", { role: t(`role.${e}`) }),
			tip: "control_roles",
			filter: et[e],
			selected: n ? [n] : [],
			suggestions: this.nearby(et[e]).map((e) => ({ entity_id: e }))
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
		let t = this.t, n = (await M(this, {
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
S([r({ attribute: !1 })], L.prototype, "hass", void 0), S([r({ attribute: !1 })], L.prototype, "t", void 0), S([r({ attribute: !1 })], L.prototype, "battery", void 0), S([r({ attribute: !1 })], L.prototype, "found", void 0), S([r({ attribute: !1 })], L.prototype, "value", void 0), S([r({ attribute: !1 })], L.prototype, "profiles", void 0), x("joe-battery-control", L);
//#endregion
//#region src/editors/battery-editor.ts
var rt = [
	"name",
	"capacity_kwh",
	"soc_entity",
	"power",
	"max_charge_w",
	"max_discharge_w",
	"priority",
	"adapter",
	"controls",
	"mode_options",
	"prepare",
	"steps"
], R = class extends n {
	constructor(...e) {
		super(...e), this.batteryId = "", this.capacityUnknown = !1, this.saving = !1;
	}
	static {
		this.styles = [l, g`
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
		(e.has("config") || e.has("batteryId")) && t && !this.draft && (this.draft = Object.fromEntries(rt.map((e) => [e, structuredClone(t[e])])), this.capacityUnknown = this.config?.answers[`capacity:${t.id}`] === "unknown");
	}
	render() {
		let { t: e, hass: t, config: n, draft: r } = this, a = this.battery;
		if (!e || !t || !n || !r || !a) return i;
		let o = this.discovery?.batteries.find((e) => e.id === a.id), s = ae(t, a.capacity_entity);
		return _`<div class="sheet-title">${w(e("edit.battery.title", { name: a.name }))}</div>
      ${this.field(e("f.battery.name"), "f_battery_name", _`<input
          class="input"
          type="text"
          maxlength="60"
          .value=${r.name}
          @change=${(e) => this.set({ name: e.target.value.trim() || a.name })}
        />`)}
      ${this.field(e("f.battery.capacity"), "q_capacity", _`<div class="field-row">
            <span class="unit-input">
              <input
                class="input"
                type="number"
                inputmode="decimal"
                min="0.1"
                max="1000"
                step="0.01"
                .value=${r.capacity_kwh == null ? "" : String(r.capacity_kwh)}
                placeholder=${s == null ? e("f.unknown") : y(e.lang, s, 2)}
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
          ${s == null ? i : _`<p class="field-hint">${e("f.battery.capacity.read", { value: y(e.lang, s, 2) })}</p>`}`, E(e, O(n, `batteries[${a.id}].capacity_kwh`)))}
      ${this.field(e("f.battery.soc"), "f_battery_soc", this.entityBox(e, r.soc_entity, `${m(t, r.soc_entity, e.lang)}`, () => this.pickSoc()), E(e, O(n, `batteries[${a.id}].soc_entity`)))}
      ${this.field(e("f.battery.power"), "f_battery_power", this.entityBox(e, r.power?.entity_id ?? null, this.powerText(e, r.power), () => this.pickPower()), E(e, O(n, `batteries[${a.id}].power`)))}
      ${this.field(e("f.battery.limits"), "f_battery_limits", _`<div class="limits">
          <label>${e("f.battery.max_charge")} ${this.kwInput(e, r.max_charge_w, "max_charge_w")}</label>
          <label>${e("f.battery.max_discharge")} ${this.kwInput(e, r.max_discharge_w, "max_discharge_w")}</label>
        </div>`)}
      ${n.batteries.length > 1 ? this.field(e("f.battery.priority"), "f_battery_priority", _`<span class="unit-input">
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
            </span>`) : i}
      <div class="field" data-tipped>
        <div class="field-label">${e("f.battery.control")} ${v(e, "control_choice")}</div>
        <joe-battery-control
          .hass=${t}
          .t=${e}
          .battery=${a}
          .found=${o}
          .profiles=${this.info?.profiles}
          .value=${{
			adapter: r.adapter,
			controls: r.controls,
			mode_options: r.mode_options,
			steps: r.steps
		}}
          @joe-control-change=${(e) => this.set(this.withPrepare(e.detail, o))}
        ></joe-battery-control>
      </div>
      <div class="actions" data-notip>
        <button type="button" class="btn btn-primary" ?disabled=${this.saving} @click=${this.save}>${e("common.save")}</button>
        <button type="button" class="btn btn-ghost" @click=${this.close}>${e("common.cancel")}</button>
      </div>`;
	}
	field(e, t, n, r) {
		let a = this.t;
		return _`<div class="field" data-tipped>
      <div class="field-label">${e} ${v(a, t)} ${r ?? i}</div>
      ${n}
    </div>`;
	}
	entityBox(e, t, n, r) {
		let i = this.hass;
		return _`<div class="entity">
      <span>
        ${t ? _`<b>${d(i, t)}</b><small>${n}</small>` : _`<small>${e("find.none")}</small>`}
      </span>
      <button type="button" class="mini-btn" @click=${r}>
        <ha-icon icon="mdi:magnify"></ha-icon>${e(t ? "review.change" : "review.choose")}
      </button>
    </div>`;
	}
	kwInput(e, t, n) {
		return _`<span class="unit-input">
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
		let n = this.hass, r = p(n, t);
		if (!t || r === null) return t ? m(n, t.entity_id, e.lang) : "";
		let i = y(e.lang, Math.abs(r), 2);
		return e(r >= 0 ? "pick.preview.charge" : "pick.preview.discharge", { value: i });
	}
	async pickSoc() {
		let { t: e, draft: t } = this;
		if (!e || !t) return;
		let n = await M(this, {
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
		let n = await M(this, {
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
		for (let r of rt) JSON.stringify(e[r]) !== JSON.stringify(t[r]) && (n[r] = t[r]);
		let r = `capacity:${e.id}`, i = this.config.answers[r] === "unknown", a = {};
		if (Object.keys(n).length && (a.batteries = { [e.id]: n }), i !== this.capacityUnknown && (a.answers = { [r]: this.capacityUnknown ? "unknown" : null }), Object.keys(a).length) {
			this.saving = !0;
			let e = await j(this, a);
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
S([r({ attribute: !1 })], R.prototype, "hass", void 0), S([r({ attribute: !1 })], R.prototype, "t", void 0), S([r({ attribute: !1 })], R.prototype, "config", void 0), S([r({ attribute: !1 })], R.prototype, "discovery", void 0), S([r({ attribute: !1 })], R.prototype, "info", void 0), S([r()], R.prototype, "batteryId", void 0), S([o()], R.prototype, "draft", void 0), S([o()], R.prototype, "capacityUnknown", void 0), S([o()], R.prototype, "saving", void 0), x("joe-battery-editor", R);
//#endregion
//#region src/editors/consumers.ts
var it = ["auto", "always"], at = [
	"auto",
	"surplus",
	"cheap"
], ot = class extends n {
	static {
		this.styles = [l, g`
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
		if (!e || !t || !n) return i;
		let r = [...n.consumers].sort((t, n) => Number(t.kind === "submeter") - Number(n.kind === "submeter") || t.name.localeCompare(n.name, e.lang));
		return _`<div data-tipped>
      <div class="head">${e("consumers.kind")} ${v(e, "f_consumer_kind")}</div>
      <div class="head sub">${e("consumers.runs")} ${v(e, "f_consumer_runs")}</div>
      ${r.length ? _`<ul>
            ${r.map((r) => this.renderConsumer(e, t, n, r))}
          </ul>` : _`<p class="empty">${e("consumers.empty")}</p>`}
    </div>`;
	}
	renderConsumer(e, t, n, r) {
		let a = r.power_entity ? m(t, r.power_entity, e.lang) : "";
		return _`<li>
      <div>
        <b>${r.name}</b>
        <small>${E(e, O(n, `consumers[${r.id}].kind`))}${a}</small>
      </div>
      <div class="selects">
        <select
          class="input"
          aria-label=${e("consumers.kind_of", { name: r.name })}
          .value=${r.kind}
          @change=${(e) => this.setKind(r, e.target.value)}
        >
          ${Xe.map((t) => _`<option value=${t} ?selected=${t === r.kind}>${e(`kind.${t}`)}</option>`)}
        </select>
        ${r.kind === "submeter" ? i : _`<select
              class="input"
              aria-label=${e("consumers.runs_of", { name: r.name })}
              .value=${r.runs ?? "auto"}
              @change=${(e) => this.setRuns(r, e.target.value)}
            >
              ${r.kind === "ev" ? it.map((t) => _`<option value=${t} ?selected=${t === (r.runs ?? "auto")}>${e(`runs.ev.${t}`)}</option>`) : at.map((t) => _`<option value=${t} ?selected=${t === (r.runs ?? "auto")}>${e(`runs.${t}`)}</option>`)}
            </select>`}
      </div>
    </li>`;
	}
	setRuns(e, t) {
		t !== (e.runs ?? "auto") && j(this, { consumers: { [e.id]: { runs: t } } });
	}
	setKind(e, t) {
		t !== e.kind && j(this, { consumers: { [e.id]: { kind: t } } });
	}
};
S([r({ attribute: !1 })], ot.prototype, "hass", void 0), S([r({ attribute: !1 })], ot.prototype, "t", void 0), S([r({ attribute: !1 })], ot.prototype, "config", void 0), x("joe-consumers", ot);
//#endregion
//#region src/editors/household.ts
var st = class extends n {
	static {
		this.styles = [l, g`
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
        gap: 12px;
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
        flex: 1;
        min-width: 0;
      }
      .who b {
        display: block;
        font-weight: 700;
      }
      .who small {
        color: var(--joe-ink-2);
        font-size: 13px;
      }
      .home {
        color: var(--joe-good) !important;
        font-weight: 600;
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
        padding: 4px 6px 4px 10px;
        border-radius: 999px;
        background: var(--joe-info-soft);
        color: var(--joe-ink);
        font-size: 13px;
        font-weight: 600;
      }
      .cal button {
        width: 24px;
        height: 24px;
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
    `];
	}
	render() {
		let { t: e, hass: t, config: n } = this;
		if (!e || !t || !n) return i;
		let r = (this.discovery?.persons ?? []).filter((e) => k(n, `person:${e.entity_id}`) && !n.persons.some((t) => t.id === e.entity_id));
		return _`<div data-tipped>
      ${n.persons.length ? _`<ul>
            ${n.persons.map((n) => this.renderPerson(e, t, n))}
          </ul>` : _`<p class="empty">${e("household.empty")}</p>`}
      <div class="with-tip add">
        <button type="button" class="mini-btn" @click=${this.addPerson}>
          <ha-icon icon="mdi:account-plus-outline"></ha-icon>${e("household.add")}
        </button>
        ${v(e, "f_person_add")}
      </div>
      ${r.length ? _`<div class="others">
            <span>${e("household.left_out")}</span>
            ${r.map((e) => _`<button type="button" class="mini-btn quiet" @click=${() => this.bringBack(e)}>
                <ha-icon icon="mdi:undo-variant"></ha-icon>${e.name}
              </button>`)}
          </div>` : i}
    </div>`;
	}
	renderPerson(e, t, n) {
		let r = n.person_entity ? t.states[n.person_entity]?.state : void 0, i = r === "home" ? _`<small class="home">${e("household.home")}</small>` : r === "not_home" ? _`<small>${e("household.away")}</small>` : r ? _`<small>${e("household.zone", { zone: r })}</small>` : _`<small>${e("household.no_presence")}</small>`;
		return _`<li class="person">
      <div class="top">
        <span class="avatar" aria-hidden="true">${n.name.slice(0, 1).toUpperCase()}</span>
        <div class="who"><b>${n.name}</b>${i}</div>
        <button type="button" class="mini-btn quiet" @click=${() => this.removePerson(n)}>
          ${e("household.remove")}
        </button>
      </div>
      <div class="cals">
        <span class="cals-label">${e("household.calendars")}</span>
        ${n.calendars.map((r) => _`<span class="cal">
            ${d(t, r)}
            <button
              type="button"
              aria-label=${e("household.calendar_remove", { name: d(t, r) })}
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
    </li>`;
	}
	async addPerson() {
		let { t: e, config: t } = this;
		if (!e || !t) return;
		let n = (await M(this, {
			heading: e("pick.person.title"),
			tip: "pick_person",
			filter: "person",
			selected: [],
			exclude: t.persons.map((e) => e.person_entity).filter((e) => !!e)
		}))?.selected[0];
		if (!n || !this.hass) return;
		let r = this.discovery?.persons.find((e) => e.entity_id === n);
		j(this, {
			persons: { [n]: {
				name: d(this.hass, n),
				person_entity: n,
				calendars: r?.calendars ?? []
			} },
			answers: { ignored: A(t, `person:${n}`, !1) }
		});
	}
	bringBack(e) {
		j(this, {
			persons: { [e.entity_id]: {
				name: e.name,
				person_entity: e.entity_id,
				calendars: e.calendars
			} },
			answers: { ignored: A(this.config, `person:${e.entity_id}`, !1) }
		});
	}
	removePerson(e) {
		j(this, {
			persons: { [e.id]: null },
			answers: { ignored: A(this.config, `person:${e.id}`, !0) }
		});
	}
	async addCalendars(e) {
		let t = this.t;
		if (!t) return;
		let n = await M(this, {
			heading: t("pick.calendar.title", { name: e.name }),
			tip: "pick_calendar",
			filter: "calendar",
			multiple: !0,
			selected: e.calendars
		});
		n && this.setCalendars(e, n.selected);
	}
	setCalendars(e, t) {
		j(this, { persons: { [e.id]: { calendars: t } } });
	}
};
S([r({ attribute: !1 })], st.prototype, "hass", void 0), S([r({ attribute: !1 })], st.prototype, "t", void 0), S([r({ attribute: !1 })], st.prototype, "config", void 0), S([r({ attribute: !1 })], st.prototype, "discovery", void 0), x("joe-household", st);
//#endregion
//#region src/components/choice.ts
var ct = "unknown", z = class extends n {
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
		return _`<div class="opts" role="group" aria-label=${this.label}>
      ${this.options.map((e) => this.renderOption(e))}
      ${this.idk ? this.renderOption({
			value: ct,
			label: this.idk
		}, "idk") : i}
    </div>`;
	}
	renderOption(e, t = "") {
		let n = this.value.includes(e.value);
		return _`<button
      type="button"
      class=${t}
      aria-pressed=${String(n)}
      ?disabled=${e.disabled}
      @click=${() => this.toggle(e.value)}
    >
      ${e.icon ? _`<ha-icon icon=${e.icon}></ha-icon>` : i}
      <span>${e.label}</span>
      ${n && this.multiple ? _`<span class="tick" aria-hidden="true"
            ><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12.5l4.5 4.5L19 7.5" /></svg
          ></span>` : i}
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
S([r({ attribute: !1 })], z.prototype, "options", void 0), S([r({ attribute: !1 })], z.prototype, "value", void 0), S([r({ type: Boolean })], z.prototype, "multiple", void 0), S([r({ attribute: !1 })], z.prototype, "exclusive", void 0), S([r()], z.prototype, "idk", void 0), S([r()], z.prototype, "label", void 0), S([r({
	type: Boolean,
	reflect: !0
})], z.prototype, "compact", void 0), x("joe-choice", z);
//#endregion
//#region src/editors/tariff-form.ts
var B = class extends n {
	constructor(...e) {
		super(...e), this.feedIn = !1, this.asQuestion = !1;
	}
	static {
		this.styles = [l, g`
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
		if (!e || !t) return i;
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
		], r = _`<joe-choice
      .options=${n}
      .value=${t.kind === "unknown" ? [] : [t.kind]}
      idk=${e("ask.idk")}
      label=${e("f.tariff.kind")}
      @joe-choice=${(e) => this.emit({ kind: e.detail.value[0] ?? "unknown" })}
    ></joe-choice>`;
		return _`${this.asQuestion ? r : _`<div class="field" data-tipped>
            <div class="field-label">${e("f.tariff.kind")} ${v(e, "q_tariff")}</div>
            ${r}
          </div>`}
      ${t.kind === "fixed_window" ? this.renderWindow(e, t) : i}
      ${t.kind === "flat" ? this.renderFlat(e, t) : i}
      ${t.kind === "dynamic" ? this.renderDynamic(e, t) : i}
      ${this.feedIn ? this.renderFeedIn(e, t) : i}`;
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
		return _`<div class="field" data-tipped>
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
		return _`<div class="field" data-tipped>
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
		return _`<div class="field" data-tipped>
        <div class="field-label">${e("f.price_entity")} ${v(e, "f_price_entity")}</div>
        <div class="entity">
          ${r && n ? _`<span><b>${d(n, r)}</b> <small>${m(n, r, e.lang)}</small></span>` : _`<small>${e("f.price_entity.none")}</small>`}
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
		return _`<div class="field" data-tipped>
      <div class="field-label">${e("f.feed_in")} ${v(e, "q_feed_in")}</div>
      ${t.feed_in_entity && n ? _`<p class="field-hint">
            ${e("f.feed_in.entity", { name: d(n, t.feed_in_entity) })}
          </p>` : this.centInput(e, t.feed_in_price, "feed_in_price")}
    </div>`;
	}
	centInput(e, t, n) {
		return _`<span class="unit-input">
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
		let n = this.discovery?.tariff, r = (await M(this, {
			heading: e("pick.price.title"),
			tip: "pick_price",
			filter: "price",
			selected: t.price_entity ? [t.price_entity] : [],
			suggestions: Ce(n?.price_entity ? [{
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
S([r({ attribute: !1 })], B.prototype, "hass", void 0), S([r({ attribute: !1 })], B.prototype, "t", void 0), S([r({ attribute: !1 })], B.prototype, "tariff", void 0), S([r({ attribute: !1 })], B.prototype, "discovery", void 0), S([r({ type: Boolean })], B.prototype, "feedIn", void 0), S([r({ type: Boolean })], B.prototype, "asQuestion", void 0), x("joe-tariff-form", B);
//#endregion
//#region src/editors/tariff-editor.ts
var lt = [
	"kind",
	"price_entity",
	"window",
	"night_price",
	"day_price",
	"feed_in_price",
	"feed_in_entity"
];
function ut(e, t) {
	let n = {};
	for (let r of lt) JSON.stringify(e[r]) !== JSON.stringify(t[r]) && (n[r] = t[r]);
	return n;
}
var V = class extends n {
	constructor(...e) {
		super(...e), this.saving = !1;
	}
	static {
		this.styles = [l, g`
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
		return !e || !t ? i : _`<div class="sheet-title">${w(e("edit.tariff.title"))}</div>
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
		let n = ut(e.tariff, t);
		if (Object.keys(n).length) {
			this.saving = !0;
			let e = { tariff: n };
			"kind" in n && (e.answers = { tariff: t.kind });
			let r = await j(this, e);
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
S([r({ attribute: !1 })], V.prototype, "hass", void 0), S([r({ attribute: !1 })], V.prototype, "t", void 0), S([r({ attribute: !1 })], V.prototype, "config", void 0), S([r({ attribute: !1 })], V.prototype, "discovery", void 0), S([o()], V.prototype, "draft", void 0), S([o()], V.prototype, "saving", void 0), x("joe-tariff-editor", V);
//#endregion
//#region src/fonts.ts
var dt = [
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
function ft() {
	if (document.getElementById("energy-joe-fonts")) return;
	let e = document.createElement("style");
	e.id = "energy-joe-fonts", e.textContent = dt.map(([e, t, n, r]) => `@font-face{font-family:"${e}";font-style:${n};font-weight:${t};font-display:swap;src:url("${le(`fonts/${r}.woff2`)}") format("woff2")}`).join("\n"), document.head.appendChild(e);
}
//#endregion
//#region src/pages/climate.ts
var pt = {
	enabled: !1,
	away: "setback",
	setback_k: 3,
	away_preset: null,
	free_day_preset: null,
	night_off: !1,
	night_from: "23:00",
	night_until: "06:30"
}, mt = "https://my.home-assistant.io/redirect/config_flow_start/?domain=proximity", ht = class extends n {
	constructor(...e) {
		super(...e), this.failed = !1;
	}
	static {
		this.styles = [l, g`
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
      .head .eyebrow,
      .head b {
        flex: 1;
        min-width: 0;
      }
      .head b {
        font-weight: 700;
        overflow-wrap: anywhere;
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
      .now {
        margin: 10px 0 0;
        font-weight: 600;
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
		super.connectedCallback(), this.load();
	}
	async load() {
		try {
			this.found = await this.hass?.callWS({ type: "energy_joe/climate/devices" }), this.failed = !1;
		} catch {
			this.failed = !0;
		}
	}
	render() {
		let { t: e, state: t } = this;
		if (!e || !t) return i;
		let n = t.config.climate ?? {
			enabled: !1,
			rooms: {}
		}, r = this.found?.devices ?? [], a = [...new Set(r.map((t) => t.area ?? e("climate.no_area")))];
		return _`<div class="wrap">
      <div class="intro">
        <div>
          ${w(e("climate.title"))} ${C}
          <p class="lead">${e("climate.lead")}</p>
        </div>
        <joe-pose name="relax"></joe-pose>
      </div>
      ${this.renderMain(e, t, n.enabled)} ${this.renderPresence(e, t)}
      ${this.failed ? _`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("climate.failed")}</span></div>` : i}
      ${this.found && !r.length ? _`<p class="hint">${e("climate.none")}</p>` : i}
      ${a.map((n) => _`<div class="group-label">${n}</div>
          <div class="grid">
            ${r.filter((t) => (t.area ?? e("climate.no_area")) === n).map((n) => this.renderDevice(e, t, n))}
          </div>`)}
    </div>`;
	}
	renderMain(e, t, n) {
		return _`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:thermostat-auto"></ha-icon>${e("climate.enabled")}</div>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(n)}
          aria-label=${e("climate.enabled")}
          @click=${() => j(this, { climate: { enabled: !n } })}
        ></button>
        ${v(e, "climate_enabled")}
      </div>
      <p class="hint">${e(t.mode === "live" ? "climate.live" : "climate.not_live")}</p>
    </section>`;
	}
	renderPresence(e, t) {
		let n = t.climate, r = n?.home ?? [], a = Object.entries(this.found?.arrivals ?? n?.arrivals ?? {}), o = Object.fromEntries(t.config.persons.map((e) => [e.person_entity, e.name]));
		return _`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:home-account"></ha-icon>${e("climate.presence")}</div>
        ${v(e, "climate_presence")}
      </div>
      <p class="now">${r.length ? e("climate.home", { names: r.join(", ") }) : e("climate.nobody")}</p>
      ${a.map(([t, n]) => _`<p class="hint">
          ${e(`climate.way.${n.direction === "towards" ? "towards" : n.direction === "away_from" ? "away" : "other"}`, {
			name: o[t] ?? this.hass?.states[t]?.attributes.friendly_name ?? t,
			km: n.km == null ? "–" : y(e.lang, n.km, 1)
		})}
        </p>`)}
      ${this.found && !this.found.proximity ? _`<p class="hint">
            ${e("climate.no_proximity")}
            <a href=${mt} target="_blank" rel="noreferrer noopener">${e("climate.add_proximity")}</a>
          </p>` : i}
      ${n?.free_day ? _`<p class="hint">${e("climate.free_day")}</p>` : i}
    </section>`;
	}
	renderDevice(e, t, n) {
		let r = {
			...pt,
			...t.config.climate?.rooms?.[n.entity_id] ?? {}
		}, a = this.hass?.states[n.entity_id], o = a?.attributes.current_temperature ?? n.current_temperature, s = a?.attributes.temperature ?? n.temperature, c = n.hvac_modes.includes("cool"), l = n.preset_modes.filter((e) => !["none", "boost"].includes(e)), u = t.climate?.rooms?.[n.entity_id], d = t.climate?.rates?.[n.entity_id];
		return _`<section class="card" data-tipped>
      <div class="head">
        <b>${n.name}</b>
        ${o == null ? i : _`<span class="chip">${y(e.lang, Number(o), 1)} °C${s == null ? "" : ` → ${y(e.lang, Number(s), 1)} °C`}</span>`}
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(r.enabled)}
          aria-label=${e("climate.room.enabled", { name: n.name })}
          @click=${() => this.save(n, { enabled: !r.enabled })}
        ></button>
        ${v(e, "climate_room")}
      </div>
      ${r.enabled ? _`<div class="row" data-tipped>
              <span>${e("climate.away")}</span>
              <span class="seg" role="group" aria-label=${e("climate.away")}>
                ${[
			"setback",
			"off",
			...l.length ? ["preset"] : []
		].map((t) => _`<button type="button" aria-pressed=${String(r.away === t)} @click=${() => this.save(n, { away: t })}>
                    ${e(`climate.away.${t}`)}
                  </button>`)}
              </span>
              ${v(e, "climate_away")}
            </div>
            ${r.away === "setback" ? _`<div class="row">
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
                </div>` : i}
            ${r.away === "preset" ? this.presetRow(e, n, l, "away_preset", r.away_preset, "climate.away_preset") : i}
            ${l.length ? _`<div data-tipped>
                  ${this.presetRow(e, n, l, "free_day_preset", r.free_day_preset, "climate.free_day_preset", !0)}
                </div>` : i}
            ${c ? this.renderNight(e, n, r) : i}
            <p class="hint">
              ${u ? e.optional(`climate.now.${u.why}`) ?? "" : i}
              ${d ? e("climate.rate", { rate: y(e.lang, d, 1) }) : e("climate.rate_default")}
            </p>` : _`<p class="hint">${e("climate.room.off")}</p>`}
    </section>`;
	}
	presetRow(e, t, n, r, a, o, s = !1) {
		return _`<div class="row">
      <span>${e(o)}</span>
      <select
        class="input"
        aria-label=${e(o)}
        @change=${(e) => this.save(t, { [r]: e.target.value || null })}
      >
        ${s ? _`<option value="" ?selected=${!a}>${e("climate.no_preset")}</option>` : i}
        ${!s && !a ? _`<option value="" selected disabled>${e("climate.pick_preset")}</option>` : i}
        ${n.map((e) => _`<option value=${e} ?selected=${e === a}>${e}</option>`)}
      </select>
      ${s ? v(this.t, "climate_free_day") : i}
    </div>`;
	}
	renderNight(e, t, n) {
		let r = (n, r) => _`<input
      class="input short"
      type="time"
      aria-label=${e(`climate.${n}`)}
      .value=${r}
      @change=${(e) => {
			let r = e.target.value;
			/^\d{1,2}:\d{2}$/.test(r) && this.save(t, { [n]: r });
		}}
    />`;
		return _`<div class="row" data-tipped>
      <span>${e("climate.night_off")}</span>
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${String(n.night_off)}
        aria-label=${e("climate.night_off")}
        @click=${() => this.save(t, { night_off: !n.night_off })}
      ></button>
      ${v(e, "climate_night")}
    </div>
    ${n.night_off ? _`<div class="row">
          <span>${e("climate.night_span")}</span>
          ${r("night_from", n.night_from)} – ${r("night_until", n.night_until)}
        </div>` : i}`;
	}
	save(e, t) {
		let n = {
			...pt,
			...this.state?.config.climate?.rooms?.[e.entity_id] ?? {},
			...t
		};
		j(this, { climate: { rooms: { [e.entity_id]: n } } });
	}
};
S([r({ attribute: !1 })], ht.prototype, "hass", void 0), S([r({ attribute: !1 })], ht.prototype, "t", void 0), S([r({ attribute: !1 })], ht.prototype, "state", void 0), S([o()], ht.prototype, "found", void 0), S([o()], ht.prototype, "failed", void 0), x("joe-climate-page", ht);
//#endregion
//#region src/components/look-back.ts
function H(e, t, n = "EUR", r = !1) {
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
function gt(e, t = "EUR") {
	return new Intl.NumberFormat(e, {
		style: "currency",
		currency: t
	}).formatToParts(0).find((e) => e.type === "currency")?.value ?? t;
}
function _t(e) {
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
function vt(e, t) {
	return t === 1 ? e("learn.nights.one") : e("learn.nights.many", { count: t });
}
//#endregion
//#region src/components/battery-automations.ts
var G = class extends n {
	constructor(...e) {
		super(...e), this.batteries = "", this.mode = "", this.ready = {}, this.items = [], this.busy = !1, this.failed = !1;
	}
	static {
		this.styles = [l, g`
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
		if (!e || !this.items.length) return i;
		let t = this.items.filter((e) => this.on(e)), n = this.items.filter((e) => e.switched_off && !this.on(e)), r = (this.mode === "advisory" || this.mode === "live") && t.some((e) => e.writes.some((e) => this.ready[e.battery_id] === "ready"));
		return _`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:robot-outline"></ha-icon>${e("automations.title")}</div>
        ${v(e, "battery_automations")}
      </div>
      <p class="now">${e(t.length ? r ? "automations.lead" : "automations.lead_idle" : "automations.lead_off")}</p>
      <ul>
        ${this.items.map((t) => {
			let n = this.on(t), r = [...new Set(t.writes.map((e) => e.battery))].join(", ");
			return _`<li>
            <div class="row">
              <b>${t.name}</b>
              ${t.writes.some((e) => e.joe) ? _`<span class="chip">${e("automations.levers")}</span>` : i}
              <span class="chip ${n ? "warn" : "ok"}">${e(n ? "automations.on" : "automations.off")}</span>
            </div>
            ${t.writes.length ? _`<small>${e("automations.writes", {
				what: t.writes.map((e) => e.name).join(", "),
				batteries: r
			})}</small>` : _`<small>${e("automations.not_battery")}</small>`}
            ${t.switched_off && !n ? _`<small>
                  ${e("automations.switched_off", {
				day: W(e.lang, t.switched_off.at, "short"),
				time: t.switched_off.at.slice(11, 16)
			})}
                </small>` : i}
          </li>`;
		})}
      </ul>
      <div class="actions">
        ${t.length ? _`<button type="button" class="mini-btn ${r ? "go" : ""}" ?disabled=${this.busy} @click=${() => this.switch(!1)}>
              <ha-icon icon="mdi:pause-circle-outline"></ha-icon>${e("automations.all_off", { count: t.length })}
            </button>` : i}
        ${n.length ? _`<button type="button" class="mini-btn" ?disabled=${this.busy} @click=${() => this.switch(!0)}>
              <ha-icon icon="mdi:play-circle-outline"></ha-icon>${e("automations.back_on", { count: n.length })}
            </button>` : i}
      </div>
      ${this.failed ? _`<p class="bad">${e("automations.failed")}</p>` : i}
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
S([r({ attribute: !1 })], G.prototype, "hass", void 0), S([r({ attribute: !1 })], G.prototype, "t", void 0), S([r()], G.prototype, "batteries", void 0), S([r()], G.prototype, "mode", void 0), S([r({ attribute: !1 })], G.prototype, "ready", void 0), S([o()], G.prototype, "items", void 0), S([o()], G.prototype, "busy", void 0), S([o()], G.prototype, "failed", void 0), x("joe-battery-automations", G);
//#endregion
//#region src/components/car-need.ts
var yt = class extends n {
	constructor(...e) {
		super(...e), this.roundTrip = !0, this.failed = !1;
	}
	static {
		this.styles = [l, g`
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
		if (!e || !t || !n) return i;
		let r = (t, n = 0) => y(e.lang, t ?? 0, n);
		if (!n.known) return _`<p>${e(n.soc != null && !n.capacity_kwh ? "need.unknown_capacity" : "need.unknown")}</p>`;
		let a = [];
		a.push(_`<p>
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
      </p>`), a.push(_`<p>
        ${e(`need.consumption.${n.consumption_source}`, {
			value: r(n.consumption, 1),
			temp: n.temp == null ? "–" : r(n.temp)
		})}${n.rain ? ` ${e("need.rain")}` : ""}
      </p>`), n.target_unit === "%" ? a.push(_`<p>${e("need.has_soc", {
			soc: r(n.soc),
			km: r(n.have_km),
			target: r(n.target)
		})}</p>`) : a.push(_`<p>${e("need.has_range", { km: r(n.have_km) })}</p>`);
		let o = n.missing_kwh ?? 0;
		return a.push(_`<p class="result">
        ${o >= .2 ? t.run && !t.manual ? e("need.charges", {
			kwh: r(o, 1),
			start: b(t.start)
		}) : e("need.missing", { kwh: r(o, 1) }) : e("need.enough")}
      </p>`), n.fits === !1 && a.push(_`<p>${e("need.too_far")}</p>`), _`${a} ${n.trips.length ? this.renderTrips(e, n.trips) : i}`;
	}
	renderTrips(e, t) {
		return _`<div data-tipped>
      <div class="head">${e("need.trips.title")} ${v(e, "need_trips")}</div>
      <ul>
        ${t.map((t) => _`<li>
            <span>${t.start.includes("T") ? b(t.start) : e("need.all_day")}</span>
            <span class="where">${t.location}</span>
            ${this.editing === t.location ? this.renderEdit(e, t) : _`<span class=${t.km == null ? "km unknown" : "km"}>
                    ${t.km == null ? e("need.km_unknown") : e(`need.km.${t.source ?? "zone"}`, { km: y(e.lang, t.km, 0) })}
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
      ${this.failed ? _`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("error.action")}</div>` : i}
    </div>`;
	}
	renderEdit(e, t) {
		let n = t.km == null ? "" : String(Math.round(t.km / (this.roundTrip ? 2 : 1)));
		return _`<form
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
S([r({ attribute: !1 })], yt.prototype, "hass", void 0), S([r({ attribute: !1 })], yt.prototype, "t", void 0), S([r({ attribute: !1 })], yt.prototype, "action", void 0), S([r({ attribute: !1 })], yt.prototype, "roundTrip", void 0), S([o()], yt.prototype, "editing", void 0), S([o()], yt.prototype, "failed", void 0), x("joe-car-need", yt);
//#endregion
//#region src/pages/devices.ts
var bt = [
	"hold",
	"charge",
	"release"
], K = class extends n {
	constructor(...e) {
		super(...e), this.notice = "";
	}
	static {
		this.styles = [l, g`
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
        grid-template-columns: 110px 1fr;
        gap: 10px;
        padding: 6px 0;
        border-top: 1px solid var(--joe-line);
      }
      .log li:first-child {
        border-top: 0;
      }
      .log time {
        color: var(--joe-muted);
        font-variant-numeric: tabular-nums;
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
        .log li {
          grid-template-columns: 1fr;
          gap: 0;
        }
      }
    `];
	}
	render() {
		let e = this.t, t = this.state;
		if (!e || !t) return i;
		let n = t.control;
		return _`<div class="wrap">
        <div class="intro">
          <div>
            ${w(e("devices.page.title"))} ${C}
            <p class="lead">${e("devices.lead")}</p>
          </div>
          <joe-pose name="switch"></joe-pose>
        </div>
        ${n ? this.renderStatus(e, t, n) : i}
        <div class="group-label">${e("devices.batteries")}</div>
        ${t.config.batteries.length ? _`<div class="grid">${t.config.batteries.map((t) => this.renderBattery(e, t, n))}</div>
              <joe-battery-automations
                .hass=${this.hass}
                .t=${e}
                batteries=${JSON.stringify(t.config.batteries)}
                mode=${t.mode}
                .ready=${n?.ready ?? {}}
              ></joe-battery-automations>` : _`<p class="empty">${e("devices.batteries.none")}</p>`}
        <div class="group-label">${e("devices.actions")}</div>
        <div class="grid">
          ${t.config.actions.map((n) => this.renderAction(e, t, n))} ${this.renderAddAction(e)}
        </div>
        ${n ? this.renderLog(e, n) : i}
      </div>
      ${this.confirm ? this.renderConfirm(e, this.confirm) : i}`;
	}
	renderStatus(e, t, n) {
		let r = t.plan, a = n.reason, o = a === "waiting" && r?.window ? e("devices.status.waiting", { time: b(r.window.start) }) : a === "day" ? e("devices.status.day", { time: r?.day ? b(r.day.defer_until) : "–" }) : e(`devices.status.${a}`), s = t.mode === "simulation" ? _`<span class="pill-sim">${e("mode.simulation")}</span>` : _`<span class="chip ${t.mode === "live" ? "ok" : t.mode === "advisory" ? "learned" : ""}"
            >${e(`mode.${t.mode}`)}</span
          >`, c = n.steering || n.pending;
		return _`<section class="card status" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:pulse"></ha-icon>${e("devices.now")}</div>
        ${s} ${v(e, "plan_steer")}
      </div>
      <p class="status-text">${o}</p>
      ${n.pending ? _`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("devices.pending")}</span></div>` : i}
      ${c ? _`<div class="actions">
            <button type="button" class="btn btn-danger" @click=${this.release}>
              <ha-icon icon="mdi:hand-back-left-outline"></ha-icon>${e("devices.release")}
            </button>
            ${v(e, "devices_release")}
          </div>` : i}
      ${this.notice ? _`<div class="note" role="status"><ha-icon icon="mdi:check"></ha-icon>${this.notice}</div>` : i}
    </section>`;
	}
	renderBattery(e, t, n) {
		let r = this.hass, a = s(r, t.soc_entity), o = p(r, t.power), c = n?.ready[t.id] ?? "not_controllable", l = n?.batteries[t.id], u = n?.testing?.battery === t.id ? n.testing : null, d = n?.tests[t.id], f = t.adapter === "generic" ? e("devices.battery.generic") : t.adapter === "steps" ? e("devices.battery.steps") : t.adapter === "none" ? e("devices.battery.watch") : e("devices.battery.profile", { name: this.info?.profiles?.[t.adapter] ?? t.adapter }), m = l?.action ? e(`devices.action.${l.action}`, {
			target: y(e.lang, l.target ?? 0, 0),
			floor: y(e.lang, l.floor ?? 0, 0),
			until: l.until ? b(l.until) : ""
		}) : e("devices.action.idle"), h = l?.problem ?? (c !== "ready" && c !== "not_controllable" ? c : null);
		return _`<section class="card battery" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:home-battery-outline"></ha-icon>${t.name}</div>
        <span class="chip ${t.adapter === "none" ? "" : "read"}">${f}</span>
      </div>
      <div class="figures">
        <b>${a == null ? "–" : y(e.lang, a, 0)}<small>%</small></b>
        ${o == null ? i : _`<span
              >${Math.abs(o) < .05 ? e("devices.power.idle") : e(o > 0 ? "devices.power.charge" : "devices.power.discharge", { value: y(e.lang, Math.abs(o), 2) })}</span
            >`}
      </div>
      <p class="now">${t.adapter === "none" ? e("devices.action.watch") : m}</p>
      ${h && t.adapter !== "none" ? _`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon
            ><span>${e.optional(`devices.problem.${h === "outdated" ? "not_tested" : h}`) ?? h}</span>
          </div>` : i}
      ${t.adapter === "none" && this.hasSuggestion(t) ? _`<div class="note"><ha-icon icon="mdi:lightbulb-on-outline"></ha-icon><span>${e("devices.suggested")}</span></div>` : i}
      ${t.adapter === "none" ? i : this.renderTest(e, t, c, d, u)}
      <div class="setup">
        <button type="button" class="mini-btn" @click=${() => this.edit(t)}>
          <ha-icon icon="mdi:tune-variant"></ha-icon>${e("devices.setup")}
        </button>
        ${v(e, "devices_setup")}
      </div>
    </section>`;
	}
	renderAction(e, t, n) {
		let r = t.plan, a = r?.actions?.find((e) => e.id === n.id), o = t.control?.actions?.[n.id], s = r?.window?.start, c = !!s && t.control?.tonight?.[n.id] === s, l = n.kind === "target" ? "mdi:water-boiler" : /ev|car|auto|wallbox/i.test(n.id + n.name) ? "mdi:car-electric" : "mdi:flash-outline";
		return _`<section class="card action" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon=${l}></ha-icon>${n.name}</div>
        ${n.enabled ? i : _`<span class="chip">${e("devices.action.off")}</span>`}
      </div>
      <p class="now">${this.actionText(e, t, n, a, o)}</p>
      ${a?.need ? _`<joe-car-need .hass=${this.hass} .t=${e} .action=${a} .roundTrip=${n.need?.round_trip ?? !0}></joe-car-need>` : i}
      ${n.kind === "switch" && (n.need?.soc_entity || n.need?.range_entity) ? _`<joe-car-charge .hass=${this.hass} .t=${e} .state=${t} .action=${n}></joe-car-charge>` : _`<div class="test">
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
            ${v(e, "action_tonight")}
          </div>`}
      <div class="setup">
        <button type="button" class="mini-btn" @click=${() => this.editAction(n.id)}>
          <ha-icon icon="mdi:pencil-outline"></ha-icon>${e("devices.action.edit")}
        </button>
      </div>
    </section>`;
	}
	actionText(e, t, n, r, i) {
		let a = r?.target == null ? "" : y(e.lang, r.target, 0);
		if (!n.enabled) return e("devices.action.disabled");
		if (i?.reason === "boost") return e("devices.action.boost");
		if (i?.on) return n.kind === "target" ? e("devices.action.heating", {
			target: a,
			end: b(i.end)
		}) : e("devices.action.running", { end: b(i.end) });
		if (i?.reason === "reached") {
			let i = t.control?.tonight_target?.[n.id];
			return n.kind === "switch" && i && i.night === t.plan?.window?.start ? e("devices.action.reached_need", {
				target: y(e.lang, i.chosen, 0),
				unit: i.unit
			}) : n.kind === "switch" ? r?.need && a ? e("devices.action.reached_need", {
				target: a,
				unit: r.need.target_unit === "km" ? "km" : "%"
			}) : e("devices.action.reached_plain") : e("devices.action.reached", { target: a });
		}
		if (!r) return e("devices.action.no_plan");
		let o = t.mode === "simulation" ? e("devices.action.would") : "";
		if (r.run) return `${o}${n.kind === "target" ? e("devices.action.plan_target", {
			start: b(r.start),
			target: a
		}) : e("devices.action.plan_run", {
			start: b(r.start),
			end: b(r.end)
		})}`;
		let s = r.reasons[r.reasons.length - 1] ?? "manual_only";
		return e.optional(`devices.action.why.${s}`, {
			kwh: y(e.lang, t.plan?.meta?.tomorrow_kwh ?? 0, 0),
			temperature: y(e.lang, r.temperature ?? 0, 0)
		}) ?? s;
	}
	renderAddAction(e) {
		return _`<section class="card add" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:plus-circle-outline"></ha-icon>${e("devices.action.add")}</div>
        ${v(e, "devices_actions")}
      </div>
      <p class="now">${e("devices.action.add.text")}</p>
      <div class="actions">
        ${[
			"ev",
			"hot_water",
			"custom"
		].map((t) => _`<button type="button" class="mini-btn" @click=${() => this.editAction(`new:${t}`)}>
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
	editAction(e) {
		this.dispatchEvent(new CustomEvent("joe-edit", {
			detail: {
				editor: "action",
				id: e
			},
			bubbles: !0,
			composed: !0
		}));
	}
	hasSuggestion(e) {
		return !!(this.discovery?.batteries.find((t) => t.id === e.id))?.suggested?.complete;
	}
	renderTest(e, t, n, r, a) {
		let o = !!this.state?.control?.testing, s = !!this.state?.control?.steering, c = a ? _`<span class="chip">${e("devices.test.running")}</span>` : n === "outdated" ? _`<span class="chip warn">${e("devices.test.outdated")}</span>` : r ? _`<span class="chip ${r.ok ? "ok" : "warn"}"
              >${e(r.ok ? "devices.test.ok" : "devices.test.failed", { day: W(e.lang, r.at, "short") })}</span
            >` : _`<span class="chip">${e("devices.test.none")}</span>`, l = a?.steps ?? r?.steps ?? [];
		return _`<div class="test">
        ${c}
        <button
          type="button"
          class="btn btn-secondary"
          ?disabled=${o || s}
          @click=${() => this.confirm = t}
        >
          <ha-icon icon="mdi:play-circle-outline"></ha-icon>${e(r ? "devices.test.again" : "devices.test.start")}
        </button>
        ${v(e, "devices_test")}
      </div>
      ${a || r ? this.renderSteps(e, l, a?.step ?? null, r) : i}`;
	}
	renderSteps(e, t, n, r) {
		let a = new Map(t.map((e) => [e.step, e])), o = !n && r?.problem ? e.optional(`devices.test.problem.${r.problem}`, { missing: (r.missing ?? []).map((t) => e.optional(`role.${t}`) ?? t).join(", ") }) : null;
		return _`<ul class="steps">
      ${o ? _`<li class="bad"><ha-icon icon="mdi:close-circle"></ha-icon><b>${e("devices.test.step.check")}</b><small>${o}</small></li>` : i}
      ${o ? i : bt.map((t) => {
			let r = a.get(t), i = r ? r.ok ? "ok" : "bad" : "wait", o = r ? r.ok ? "mdi:check-circle" : "mdi:close-circle" : n === t ? "mdi:progress-clock" : "mdi:circle-outline";
			return _`<li class=${i}>
              <ha-icon icon=${o}></ha-icon>
              <b>${e(`devices.test.step.${t}`)}</b>
              <small>${r ? this.stepText(e, r) : ""}</small>
            </li>`;
		})}
    </ul>`;
	}
	stepText(e, t) {
		let n = this.hass, r = [];
		return t.power != null && r.push(Math.abs(t.power) >= .05 ? e("devices.test.power", { value: y(e.lang, t.power, 2) }) : e("devices.test.no_power")), t.wrong.length && r.push(e("devices.test.wrong", { entities: t.wrong.map((e) => d(n, e)).join(", ") })), t.errors.length && r.push(e("devices.test.error", { entities: t.errors.map((e) => d(n, e.entity_id)).join(", ") })), r.join(" · ");
	}
	renderLog(e, t) {
		let n = [...t.log].reverse().slice(0, 30);
		return _`<section class="card">
      <div class="eyebrow"><ha-icon icon="mdi:clipboard-text-clock-outline"></ha-icon>${e("devices.log")}</div>
      ${n.length ? _`<ul class="log">
            ${n.map((t) => _`<li>
                <time>${W(e.lang, t.at, "short")} ${t.at.slice(11, 16)}</time>
                <span>${this.logText(e, t)}</span>
              </li>`)}
          </ul>` : _`<p class="empty">${e("devices.log.empty")}</p>`}
    </section>`;
	}
	logText(e, t) {
		let n = this.hass, r = this.state?.config, i = {
			battery: r?.batteries.find((e) => e.id === t.battery)?.name ?? r?.actions.find((e) => `action:${e.id}` === t.battery)?.name ?? t.battery ?? "",
			entity: t.entity ? d(n, t.entity) : "",
			value: t.value == null ? "–" : String(t.value),
			target: String(t.target ?? ""),
			power: typeof t.power == "number" ? y(e.lang, t.power, 1) : "–",
			soc: typeof t.soc == "number" ? y(e.lang, t.soc, 0) : "–",
			unit: typeof t.unit == "string" ? t.unit : "%"
		};
		return t.kind === "boost_end" ? e.optional(`log.boost_end.${String(t.reason)}`, i) ?? e("log.boost_end.stopped", i) : t.kind === "answer" ? e(t.yes ? "log.answer.yes" : "log.answer.no") : t.kind === "test" ? e(t.ok ? "log.test.ok" : "log.test.failed", i) : e.optional(`log.${t.kind}`, i) ?? t.kind;
	}
	renderConfirm(e, t) {
		let n = () => {
			this.confirm = void 0;
		};
		return _`<joe-sheet label=${e("devices.test.start")} closeLabel=${e("common.close")} @joe-close=${n}>
      <div data-tipped>
        <div class="sheet-title">
          ${w(e("devices.test.confirm.title", { name: t.name }), "h2", v(e, "devices_test"))}
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
S([r({ attribute: !1 })], K.prototype, "hass", void 0), S([r({ attribute: !1 })], K.prototype, "t", void 0), S([r({ attribute: !1 })], K.prototype, "state", void 0), S([r({ attribute: !1 })], K.prototype, "discovery", void 0), S([r({ attribute: !1 })], K.prototype, "info", void 0), S([o()], K.prototype, "confirm", void 0), S([o()], K.prototype, "notice", void 0), x("joe-devices-page", K);
//#endregion
//#region src/components/chart.ts
var xt = 40, St = 10, q = 16, Ct = 24;
function wt(e) {
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
function Tt(e) {
	let t = [], n = [];
	return e.forEach((e, r) => {
		e == null ? (n.length && t.push(n), n = []) : n.push([r, e]);
	}), n.length && t.push(n), t;
}
var J = class extends n {
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
		let t = this.labels.length;
		if (!t) return i;
		let n = Math.max(260, this.width), r = this.height, a = n - xt - St, o = r - q - Ct, s = a / t, c = this.series.flatMap((e) => e.values.filter((e) => e != null)), l = this.max || wt(Math.max(.1, ...c)), u = Math.min(0, ...c), d = u < 0 ? -Math.max(wt(-u), l / 4) : 0, f = (e) => q + o - (Math.max(d, Math.min(e, l)) - d) / (l - d) * o, p = (e) => xt + e * s, m = (e) => xt + (e + .5) * s, h = (e, t = 2) => new Intl.NumberFormat(this.lang, { maximumFractionDigits: t }).format(e), g = [];
		for (let t of this.bands) g.push(e`<rect class="band" x=${p(t.from)} y=${q} width=${Math.max(0, p(t.to) - p(t.from))} height=${o}></rect>
        <text class="note" x=${(p(t.from) + p(t.to)) / 2} y=${28} text-anchor="middle">${t.label}</text>`);
		for (let t of d < 0 ? [
			d,
			0,
			l
		] : [
			0,
			l / 2,
			l
		]) g.push(e`<line class="grid" x1=${xt} x2=${n - St} y1=${f(t)} y2=${f(t)}></line>
        <text class="tick" x=${34} y=${f(t) + 4} text-anchor="end">${h(t, 2)}</text>`);
		g.push(e`<text class="tick" x=${34} y=${11} text-anchor="end">${this.unit}</text>`);
		for (let [t, n] of this.ticks) g.push(e`<text class="tick" x=${this.centerTicks ? m(t) : p(t)} y=${r - 6}
        text-anchor="middle">${n}</text>`);
		let v = this.series.filter((e) => e.kind === "bar"), y = s * .68 / Math.max(1, v.length);
		for (let t of this.series) {
			if (t.kind === "bar") {
				let n = s * .16 + v.indexOf(t) * y;
				t.values.forEach((r, i) => {
					if (r != null && r !== 0) {
						let a = Math.min(f(r), f(0));
						g.push(e`<rect x=${p(i) + n} y=${a} width=${Math.max(1, y - 1)}
              height=${Math.max(1, Math.abs(f(0) - f(r)))} rx="2"
              fill=${r < 0 ? t.negative ?? t.color : t.color}></rect>`);
					}
				});
				continue;
			}
			for (let n of Tt(t.values)) {
				let r = n.map(([e, t]) => `${m(e).toFixed(1)},${f(t).toFixed(1)}`).join(" ");
				if (t.kind === "area" && n.length > 1) {
					let i = f(0).toFixed(1);
					g.push(e`<polygon points=${`${m(n[0][0]).toFixed(1)},${i} ${r} ${m(n[n.length - 1][0]).toFixed(1)},${i}`}
            fill=${t.fill ?? t.color}></polygon>`);
				}
				n.length > 1 ? g.push(e`<polyline points=${r} fill="none" stroke=${t.color} stroke-width=${t.kind === "line" ? 2.4 : 2}
            stroke-linejoin="round" stroke-dasharray=${t.dashed ? "5 4" : "none"}></polyline>`) : g.push(e`<circle cx=${m(n[0][0])} cy=${f(n[0][1])} r="2.5" fill=${t.color}></circle>`);
			}
		}
		for (let t of this.markers) {
			let r = xt + t.at * s, i = r < xt + a * .75;
			g.push(e`<line class="marker" x1=${r} x2=${r} y1=${q} y2=${q + o}></line>
        <text class="note" x=${i ? r + 4 : r - 4} y=${28} text-anchor=${i ? "start" : "end"}>
          ${n < 520 ? t.short ?? t.label : t.label}
        </text>`);
		}
		this.hover != null && g.push(e`<line class="guide" x1=${m(this.hover)} x2=${m(this.hover)} y1=${q} y2=${q + o}></line>`);
		for (let n = 0; n < t; n++) g.push(e`<rect class="slot" x=${p(n)} y=${q} width=${s} height=${o}
        @pointerenter=${() => this.hover = n} @click=${() => this.hover = n}></rect>`);
		return _`<svg
        viewBox="0 0 ${n} ${r}"
        height=${r}
        role="img"
        aria-label=${this.label}
        @pointerleave=${(e) => e.pointerType === "mouse" && (this.hover = null)}
      >
        ${g}
      </svg>
      ${this.hover == null ? i : this.renderBox(this.hover, m(this.hover), n, h)}`;
	}
	renderBox(e, t, n, r) {
		let a = t + 182 > n ? Math.max(0, t - 182) : t + 12;
		return _`<div class="box" style="left:${a}px">
      <b>${this.labels[e]}</b>
      ${this.series.map((t) => {
			let n = t.values[e];
			return n == null ? i : _`<div>
              <i style="background:${n < 0 ? t.negative ?? t.color : t.color}"></i><span>${t.label}</span
              ><em>${r(n, t.digits ?? 2)} ${this.unit}</em>
            </div>`;
		})}
    </div>`;
	}
};
S([r({ attribute: !1 })], J.prototype, "labels", void 0), S([r({ attribute: !1 })], J.prototype, "ticks", void 0), S([r({ attribute: !1 })], J.prototype, "series", void 0), S([r({ attribute: !1 })], J.prototype, "bands", void 0), S([r({ attribute: !1 })], J.prototype, "markers", void 0), S([r()], J.prototype, "unit", void 0), S([r({ type: Number })], J.prototype, "max", void 0), S([r({ type: Number })], J.prototype, "height", void 0), S([r()], J.prototype, "label", void 0), S([r()], J.prototype, "lang", void 0), S([r({ type: Boolean })], J.prototype, "centerTicks", void 0), S([o()], J.prototype, "width", void 0), S([o()], J.prototype, "hover", void 0), x("joe-chart", J);
//#endregion
//#region src/pages/history.ts
var Et = 14, Dt = [
	"var(--joe-c-soc)",
	"var(--joe-c-soc-2)",
	"var(--joe-c-grid)",
	"var(--joe-c-ist)"
];
function Ot(e, t, n) {
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
var Y = class extends n {
	constructor(...e) {
		super(...e), this.failed = !1;
	}
	static {
		this.styles = [l, g`
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
      .strip {
        display: flex;
        gap: 6px;
        overflow-x: auto;
        padding: 18px 2px 6px;
        scrollbar-width: thin;
      }
      .strip button {
        flex: none;
        display: grid;
        justify-items: center;
        gap: 4px;
        width: 62px;
        padding: 8px 4px 6px;
        border: 0;
        border-radius: 12px;
        cursor: pointer;
        background: var(--joe-surface);
        box-shadow: inset 0 0 0 1px var(--joe-line);
        color: var(--joe-ink);
        transition: background 0.12s, box-shadow 0.12s, transform 0.12s;
      }
      .strip button:hover:not([disabled]) {
        background: var(--joe-surface-2);
      }
      .strip button:active:not([disabled]) {
        transform: scale(0.97);
      }
      .strip button[aria-pressed="true"] {
        background: var(--joe-amber-soft);
        box-shadow: inset 0 0 0 2px var(--joe-amber);
      }
      .strip button[disabled] {
        cursor: default;
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
		super.connectedCallback(), this.load();
	}
	willUpdate(e) {
		let t = this.state?.observe, n = `${t?.last_hour ?? ""}|${t?.backfill.state ?? ""}|${t?.day_count ?? 0}`;
		e.has("state") && this.lastHour !== void 0 && n !== this.lastHour && this.load(), this.lastHour = n;
	}
	async load() {
		if (this.hass) try {
			this.days = await this.hass.callWS({
				type: "energy_joe/history/days",
				days: Et
			}), this.failed = !1;
			let e = this.days.days.map((e) => e.date), t = this.selected && e.includes(this.selected) ? this.selected : e[0];
			t && await this.select(t);
		} catch {
			this.failed = !0;
		}
	}
	updated(e) {
		if (e.has("days")) {
			let e = this.renderRoot.querySelector(".strip");
			e?.scrollTo({ left: e.scrollWidth });
		}
	}
	async select(e) {
		this.selected = e;
		try {
			this.detail = await this.hass?.callWS({
				type: "energy_joe/history/day",
				date: e
			});
		} catch {
			this.failed = !0;
		}
	}
	render() {
		let e = this.t;
		return e ? this.days?.days.length ? _`<div class="wrap">
      ${w(e("history.title"))} ${C}
      <p class="status">${this.statusText(e)}</p>
      ${this.renderStrip(e, this.days.days)} ${this.detail ? this.renderDay(e, this.detail) : i}
    </div>` : this.renderEmpty(e) : i;
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
		return _`<div class="empty">
      <joe-pose name="inspect"></joe-pose>
      <div>
        ${w(e("history.title"))} ${C}
        <p class="lead">${e(n)}</p>
        ${this.failed ? _`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("history.failed")}</div>` : i}
      </div>
    </div>`;
	}
	renderStrip(e, t) {
		let n = t[0].date, r = new Map(t.map((e) => [e.date, e])), i = [];
		for (let e = 13; e >= 0; e--) {
			let t = /* @__PURE__ */ new Date(`${n}T12:00:00Z`);
			t.setUTCDate(t.getUTCDate() - e), i.push(t.toISOString().slice(0, 10));
		}
		let a = Math.max(.1, ...t.flatMap((e) => [e.home ?? 0, e.solar ?? 0]));
		return _`<div class="strip" role="group" aria-label=${e("history.days")} data-notip>
      ${i.map((t) => {
			let n = r.get(t);
			return _`<button
          type="button"
          aria-pressed=${String(t === this.selected)}
          ?disabled=${!n}
          aria-label=${Ot(e.lang, t, "long")}
          @click=${() => this.select(t)}
        >
          <small>${Ot(e.lang, t, "short")}</small>
          <b>${Number(t.slice(8))}</b>
          <span class="mini" aria-hidden="true">
            <i style="height:${(n?.home ?? 0) / a * 26}px;background:var(--joe-c-load)"></i>
            <i style="height:${(n?.solar ?? 0) / a * 26}px;background:var(--joe-c-pv)"></i>
          </span>
        </button>`;
		})}
    </div>`;
	}
	renderDay(e, t) {
		let n = t.summary, r = Math.max(0, n.expected - t.hours.filter((e) => e.cov >= .9).length), a = n.sources.live ?? 0, o = (n.sources.stats ?? 0) + (n.sources.history ?? 0);
		return _`<div class="day-head">
        <h3>${Ot(e.lang, t.date, "long")}</h3>
        ${t.workday === !0 ? _`<span class="chip">${e("history.workday")}</span>` : t.workday === !1 ? _`<span class="chip">${e("history.day_off")}</span>` : i}
        ${a ? _`<span class="chip ok"><ha-icon icon="mdi:eye-outline"></ha-icon>${e("history.live")}</span>` : i}
        ${o ? _`<span class="chip read"><ha-icon icon="mdi:database-outline"></ha-icon>${e("history.read")}</span>` : i}
      </div>
      ${this.renderTiles(e, n)} ${this.renderEnergyChart(e, t)} ${this.renderSocChart(e, t)}
      ${this.renderEvaluation(e, t)}
      ${r && n.date !== this.days?.days[0]?.date ? _`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("history.missing", { hours: r })}</span>
          </div>` : i}`;
	}
	renderTiles(e, t) {
		let n = (t) => t == null ? "–" : y(e.lang, t, 1), r = [], a = (e, t, n, r) => _`<div class="tile">
        <div class="eyebrow">${e}</div>
        <div class="value">${t}<small>${n}</small></div>
        ${r ? _`<div class="sub">${r}</div>` : i}
      </div>`;
		if (t.home != null && r.push(a(e("history.tile.home"), n(t.home), "kWh", t.self_sufficiency == null ? "" : e("history.tile.home.self", { value: y(e.lang, t.self_sufficiency * 100, 0) }))), t.solar != null && r.push(a(e("history.tile.solar"), n(t.solar), "kWh", t.fc_ahead == null ? e("history.tile.solar.nofc") : e("history.tile.solar.fc", {
			value: n(t.fc_ahead),
			ratio: t.solar_vs_fc == null ? "–" : y(e.lang, t.solar_vs_fc * 100, 0)
		}))), t.grid_in != null) {
			let i = [];
			t.grid_in_cheap != null && i.push(e("history.tile.grid.cheap", { value: n(t.grid_in_cheap) })), t.grid_out != null && i.push(e("history.tile.grid.out", { value: n(t.grid_out) })), r.push(a(e("history.tile.grid"), n(t.grid_in), "kWh", i.join(" · ")));
		}
		if (t.bat_in != null && r.push(a(e("history.tile.battery"), n(t.bat_in), "kWh", e("history.tile.battery.out", { value: n(t.bat_out) }))), t.temp && r.push(a(e("history.tile.temp"), y(e.lang, t.temp.mean, 1), "°C", e("history.tile.temp.range", {
			min: y(e.lang, t.temp.min, 0),
			max: y(e.lang, t.temp.max, 0)
		}))), t.present) {
			let n = new Map((this.state?.config.persons ?? []).map((e) => [e.id, e.name])), i = Object.entries(t.present), o = Math.max(...i.map(([, e]) => e));
			r.push(a(e("history.tile.present"), y(e.lang, o, 0), "h", i.map(([t, r]) => `${n.get(t) ?? t} ${y(e.lang, r, 0)} h`).join(" · ")));
		}
		return _`<div class="tiles">${r}</div>`;
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
		return _`<div class="chart-card" data-tipped>
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
      <div class="legend">
        ${i.map((e) => _`<span><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color}"></i>${e.label}</span>`)}
      </div>
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
				color: Dt[n % Dt.length],
				digits: 0
			};
		});
		if (!n.some((e) => e.values.some((e) => e != null))) return i;
		t.plan_soc_slots.some((e) => e != null) && n.push({
			label: e("history.chart.plan"),
			kind: "line",
			values: t.plan_soc_slots,
			color: "var(--joe-c-ist)",
			dashed: !0,
			digits: 0
		});
		let r = this.chartFrame(t);
		return _`<div class="chart-card" data-tipped>
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
      <div class="legend">
        ${n.map((e) => _`<span><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color}"></i>${e.label}</span>`)}
      </div>
    </div>`;
	}
	renderEvaluation(e, t) {
		let n = t.evaluation;
		if (!t.plan?.fixed) return i;
		if (!n) return _`<div class="note"><ha-icon icon="mdi:timer-sand"></ha-icon><span>${e("history.eval.pending")}</span></div>`;
		if (!n.complete) return _`<div class="note warn">
        <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("history.eval.incomplete")}</span>
      </div>`;
		let r = this.hass?.config?.currency, a = n.saving ?? 0, o = a > .005 ? "good" : a < -.005 ? "bad" : "", s = (t) => U(e.lang, t ?? 0, 1), c = (t) => t ? e("history.eval.clock", { time: this.time(t) }) : e("history.eval.never"), l = !n.final, u = [[e("history.eval.day"), e("history.eval.instead", {
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
		return _`<div class="chart-card" data-tipped>
      <div class="chart-head">
        ${e("history.eval")} ${v(e, "chart_replay")}
        ${l && n.until ? _`<span class="chip warn">${e("history.eval.provisional", { time: this.time(n.until) })}</span>` : i}
      </div>
      <div class="eval-top">
        <div class="eval-big ${o}">
          ${o === "bad" ? H(e, -a, r) : H(e, a, r)}
          <small>${e(o === "good" ? "history.eval.saved" : o === "bad" ? "history.eval.cost" : "history.eval.same")}</small>
        </div>
        <dl>${u.map(([e, t]) => _`<dt>${e}</dt><dd>${t}</dd>`)}</dl>
      </div>
      ${l && n.until ? _`<div class="note">
            <ha-icon icon="mdi:timer-sand"></ha-icon
            ><span>${e("history.eval.provisional.note", { time: this.time(n.until) })}</span>
          </div>` : i}
      ${d.some((e) => e.values.some((e) => e != null)) ? _`<joe-chart
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
            <div class="legend">
              ${d.map((e) => _`<span><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color}"></i>${e.label}</span>`)}
            </div>` : i}
    </div>`;
	}
	time(e) {
		return e.slice(11, 16);
	}
};
S([r({ attribute: !1 })], Y.prototype, "hass", void 0), S([r({ attribute: !1 })], Y.prototype, "t", void 0), S([r({ attribute: !1 })], Y.prototype, "state", void 0), S([o()], Y.prototype, "days", void 0), S([o()], Y.prototype, "selected", void 0), S([o()], Y.prototype, "detail", void 0), S([o()], Y.prototype, "failed", void 0), x("joe-history", Y);
//#endregion
//#region src/components/day-questions.ts
var kt = {
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
}, At = class extends n {
	constructor(...e) {
		super(...e), this.questions = [], this.failed = !1, this.answered = /* @__PURE__ */ new Set();
	}
	static {
		this.styles = [l, g`
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
		return !e || !t.length ? i : _`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:chat-question-outline"></ha-icon>${e("ask.title")}</div>
        ${v(e, "ask_day")}
      </div>
      <p class="lead">${e("ask.lead")}</p>
      ${t.map((t) => _`<div class="question">
          <p>
            ${e(`ask.${t.kind}`, {
			day: W(e.lang, t.date, "weekday"),
			actual: U(e.lang, t.actual, 1),
			expected: U(e.lang, t.expected, 1)
		})}
          </p>
          <div class="answers" role="group" aria-label=${e("ask.answers")}>
            ${kt[t.kind].map((n) => _`<button
                  type="button"
                  class="mini-btn ${n === "normal" ? "quiet" : ""}"
                  ?disabled=${this.busy === t.date}
                  @click=${() => this.answer(t.date, n)}
                >
                  ${e(`ask.answer.${n}`)}
                </button>`)}
          </div>
        </div>`)}
      ${this.failed ? _`<div class="note warn" role="status"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("error.action")}</div>` : i}
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
S([r({ attribute: !1 })], At.prototype, "hass", void 0), S([r({ attribute: !1 })], At.prototype, "t", void 0), S([r({ attribute: !1 })], At.prototype, "questions", void 0), S([o()], At.prototype, "busy", void 0), S([o()], At.prototype, "failed", void 0), S([o()], At.prototype, "answered", void 0), x("joe-day-questions", At);
//#endregion
//#region src/pages/learn.ts
var jt = [
	"clear",
	"mixed",
	"overcast"
], Mt = [
	"vacation",
	"travel",
	"home_office",
	"office",
	"guests",
	"home"
], Nt = {
	forecast_solar: "Forecast.Solar",
	open_meteo_solar_forecast: "Open-Meteo Solar Forecast",
	solcast_solar: "Solcast"
};
function Pt(e, t, n) {
	let r = e.base + (t ? e.workday : 0) + e.heat * Math.max(0, 15 - n) + e.cool * Math.max(0, n - 22);
	return e.presence != null && (r += e.presence * (e.presence_mean ?? 0)), Math.max(0, r);
}
function Ft(e, t) {
	let n = Math.max(1, Math.ceil(t.length / 7)), r = /* @__PURE__ */ new Map();
	return t.forEach((i, a) => {
		(t.length - 1 - a) % n == 0 && r.set(a, W(e, i, "short"));
	}), r;
}
var X = class extends n {
	constructor(...e) {
		super(...e), this.failed = !1, this.confirming = !1, this.resetting = !1, this.scope = "all", this.keyword = {};
	}
	static {
		this.styles = [l, g`
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
      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
        margin-top: 12px;
      }
      .card {
        padding: 18px 20px;
      }
      .hero {
        margin-top: 18px;
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
      .hero .big {
        font-size: clamp(52px, 7vw, 76px);
      }
      .big small {
        font-size: 0.5em;
        margin-left: 2px;
      }
      .big.small {
        font-size: clamp(30px, 3.6vw, 38px);
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
      .own {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        margin-top: 12px;
      }
      .table {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) minmax(0, 1fr) auto;
        margin-top: 10px;
        font-variant-numeric: tabular-nums;
      }
      .table > span {
        padding: 8px 10px;
        border-top: 1px solid var(--joe-line);
        white-space: nowrap;
      }
      .table > span.th {
        align-self: end;
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
        text-align: right;
        font-weight: 700;
      }
      .table .good {
        color: var(--joe-good);
      }
      .table .bad {
        color: var(--joe-crit);
      }
      .danger p {
        margin: 10px 0 0;
        color: var(--joe-ink-2);
        max-width: 56ch;
      }
      .scopes {
        margin-top: 12px;
        flex-wrap: wrap;
      }
      .eyebrow.section {
        margin: 28px 0 0;
      }
      joe-day-questions.wide {
        margin-top: 12px;
      }
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
      .sub-head {
        margin-top: 16px;
        font-size: 14px;
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
      }
      .keyword {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        padding: 2px 4px 2px 10px;
        border-radius: 999px;
        background: var(--joe-surface-2);
        font-size: 13.5px;
      }
      .keyword button {
        display: grid;
        place-items: center;
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
      .add {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .add .input {
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
      .sub-head.with-tip {
        display: flex;
        align-items: center;
        gap: 6px;
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
        .grid,
        .defaults {
          grid-template-columns: 1fr;
        }
        .rule {
          grid-template-columns: 1fr;
        }
      }
      @media (pointer: coarse) {
        .keyword button {
          width: 36px;
          height: 36px;
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
        .table {
          font-size: 13.5px;
        }
        .table > span {
          padding: 8px 6px;
        }
      }
    `];
	}
	connectedCallback() {
		super.connectedCallback(), this.load();
	}
	willUpdate(e) {
		let t = this.state?.config, n = this.state?.results, r = [
			n?.days ?? 0,
			n?.since ?? "",
			t?.learned?.updated ?? "",
			t?.learned?.since ?? "",
			t?.rules.buffer_factor ?? "",
			t?.provenance["rules.buffer_factor"]?.source ?? "",
			this.state?.observe?.day_count ?? 0
		].join("|");
		e.has("state") && this.marker !== void 0 && r !== this.marker && this.load(), this.marker = r;
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
		if (!e) return i;
		let t = this.data;
		return _`<div class="wrap">
        <div class="intro">
          <div>
            ${w(e("learn.page.title"))} ${C}
            <p class="lead">${e("learn.lead")}</p>
            <p class="status">${this.statusText(e)}</p>
          </div>
          <joe-pose name="learn"></joe-pose>
        </div>
        ${this.failed ? _`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${e("learn.failed")}</div>` : i}
        ${t ? _`${this.renderResults(e, t)}
              <joe-day-questions
                class="wide"
                .hass=${this.hass}
                .t=${e}
                .questions=${t.questions}
                @joe-answered=${() => this.load()}
              ></joe-day-questions>
              <div class="grid">
                ${this.renderSolar(e, t)} ${this.renderShift(e, t)} ${this.renderBuffer(e, t)} ${this.renderHome(e, t)}
              </div>
              <div class="eyebrow section"><ha-icon icon="mdi:brain"></ha-icon>${e("learn.models")}</div>
              <div class="grid">
                ${this.renderWeather(e, t)} ${this.renderSources(e, t)} ${this.renderBatteries(e, t)}
                ${this.renderGroups(e, t)} ${this.renderHotWater(e, t)} ${this.renderCars(e, t)}
                ${this.renderPresence(e, t)}
              </div>
              ${this.renderCalendar(e)} ${this.renderAccuracy(e, t)} ${this.renderReset(e)}` : i}
      </div>
      ${this.confirming ? this.renderConfirm(e) : i}`;
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
	renderResults(e, t) {
		let n = t.results, r = _`<div class="head">
      <div class="eyebrow"><ha-icon icon="mdi:cash-check"></ha-icon>${e("learn.results")}</div>
      <span class="pill-sim">${e("mode.simulation")}</span>
      ${v(e, "sim_result")}
    </div>`;
		if (!n?.days) return _`<section class="card hero" data-tipped>${r}
        <p class="say">${e("learn.results.none")}</p>
      </section>`;
		let a = n.daily, o = [{
			label: e("learn.results.chart.saving"),
			kind: "bar",
			values: a.map((e) => e.saving),
			color: "var(--joe-good)",
			negative: "var(--joe-crit)",
			digits: 2
		}], s = n.since ?? n.first;
		return _`<section class="card hero" data-tipped>
      ${r}
      <div class="figure">
        <div class="big ${n.saving > .005 ? "good" : n.saving < -.005 ? "bad" : ""}">
          ${H(e, n.saving, this.currency, !0)}
        </div>
      </div>
      <p class="say">
        ${e("learn.results.say", {
			since: s ? W(e.lang, s) : "–",
			nights: vt(e, n.days)
		})}
      </p>
      <p class="split">
        ${e("learn.results.split", {
			better: n.better,
			worse: n.worse,
			same: Math.max(0, n.days - n.better - n.worse)
		})}
      </p>
      ${a.length > 1 ? _`<joe-chart
            .labels=${a.map((t) => W(e.lang, t.date, "weekday"))}
            .ticks=${Ft(e.lang, a.map((e) => e.date))}
            .series=${o}
            centerTicks
            unit=${gt(e.lang, this.currency)}
            height="160"
            lang=${e.lang}
            label=${e("learn.results.chart")}
          ></joe-chart>` : i}
    </section>`;
	}
	renderSolar(e, t) {
		let n = t.learned, r = n.solar_factor, a;
		a = r == null ? e("learn.solar.learning", {
			need: t.needs.solar,
			have: n.solar_days
		}) : r < .95 ? e("learn.solar.less", {
			value: y(e.lang, (1 - r) * 100, 0),
			share: y(e.lang, r * 100, 0)
		}) : r > 1.05 ? e("learn.solar.more", {
			value: y(e.lang, (r - 1) * 100, 0),
			share: y(e.lang, r * 100, 0)
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
		return _`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:weather-sunny"></ha-icon>${e("learn.solar")}</div>
        ${v(e, "learn_solar")}
      </div>
      <div class="figure">
        <div class="big ${r == null ? "small" : ""}">
          ${r == null ? e("learn.still") : `× ${y(e.lang, r, 2)}`}
        </div>
        ${r == null ? i : _`${E(e, { source: "learned" })}<span class="chip">${e("learn.days", { days: n.solar_days })}</span>`}
      </div>
      <p class="say">${a}</p>
      ${o.length > 1 ? this.chartWithLegend(e, o.map((e) => e.date), s, "kWh", e("learn.solar.chart")) : i}
    </section>`;
	}
	renderShift(e, t) {
		let n = t.learned, r = n.solar_shift;
		return _`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:clock-time-four-outline"></ha-icon>${e("learn.shift")}</div>
        ${v(e, "learn_shift")}
      </div>
      <div class="figure">
        <div class="big ${r == null ? "small" : ""}">${e(r == null ? "learn.still" : `learn.shift.big.${r}`)}</div>
        ${r == null ? i : _`${E(e, { source: "learned" })}<span class="chip">${e("learn.days", { days: n.shift_days })}</span>`}
      </div>
      <p class="say">
        ${r == null ? e("learn.shift.learning", {
			need: t.needs.shift,
			have: n.shift_days
		}) : e(`learn.shift.${r}`)}
      </p>
      ${t.solar_profile ? this.hourChart(e, this.profileSeries(e, t.solar_profile), e("learn.shift.chart")) : i}
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
		return _`<joe-chart
        .labels=${r}
        .ticks=${i}
        .series=${t}
        unit="kWh"
        height="150"
        lang=${e.lang}
        label=${n}
      ></joe-chart>
      <div class="legend">
        ${t.map((e) => _`<span><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color}"></i>${e.label}</span>`)}
      </div>`;
	}
	renderBuffer(e, t) {
		let { value: n, source: r } = t.buffer, a = t.learned, o = (t) => y(e.lang, t * 100, 0), s;
		s = r === "user" ? a.buffer == null ? e("learn.buffer.user") : e("learn.buffer.user_learned", { value: o(a.buffer) }) : r === "learned" ? e("learn.buffer.learned") : e("learn.buffer.default", {
			need: t.needs.buffer,
			have: a.buffer_days
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
		return _`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:shield-half-full"></ha-icon>${e("learn.buffer")}</div>
        ${v(e, "learn_buffer")}
      </div>
      <div class="figure">
        <div class="big">${o(n)}<small> %</small></div>
        ${E(e, { source: r })}
        ${r === "learned" ? _`<span class="chip">${e("learn.mornings", { count: a.buffer_days })}</span>` : i}
      </div>
      <p class="say">${s}</p>
      ${r === "user" ? _`<div class="own">
            <button
              type="button"
              class="mini-btn"
              @click=${() => j(this, { rules: { buffer_factor: t.buffer.default } }, "default")}
            >
              <ha-icon icon="mdi:auto-fix"></ha-icon>${e("learn.buffer.own")}
            </button>
            ${v(e, "learn_buffer_own")}
          </div>` : i}
      ${c.length > 1 ? this.chartWithLegend(e, c.map((e) => e.date), l, "kWh", e("learn.buffer.chart")) : i}
    </section>`;
	}
	renderHome(e, t) {
		let n = t.consumption, r = (t) => U(e.lang, t.reduce((e, t) => e + t, 0), 1), i = [{
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
		return _`<section class="card" data-tipped>
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
		return _`<joe-chart
        .labels=${t.map((t) => W(e.lang, t, "weekday"))}
        .ticks=${Ft(e.lang, t)}
        .series=${n}
        centerTicks
        unit=${r}
        height="150"
        lang=${e.lang}
        label=${i}
      ></joe-chart>
      <div class="legend">
        ${n.map((e) => _`<span
              ><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color};height:${e.kind === "bar" ? "10px" : "4px"}"></i
              >${e.label}</span
            >`)}
      </div>`;
	}
	rows(e) {
		return _`<div class="rows">
      ${e.map((e) => _`<div class="row-item">
          <b>${e.name}</b>
          <span class="values">${e.values.map((e) => _`<span>${e}</span>`)}</span>
          ${e.note ? _`<small>${e.note}</small>` : i}
        </div>`)}
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
			let t = [e("learn.model.base", { value: U(n, r.base + (r.presence ?? 0) * (r.presence_mean ?? 0), 1) })];
			Math.abs(r.workday) >= .3 && t.push(e(r.workday > 0 ? "learn.model.workday_more" : "learn.model.workday_less", { value: U(n, Math.abs(r.workday), 1) })), r.heat >= .05 && t.push(e("learn.model.heat", { value: U(n, r.heat, 2) })), r.cool >= .05 && t.push(e("learn.model.cool", { value: U(n, r.cool, 2) })), r.presence != null && Math.abs(r.presence) >= .05 && t.push(e("learn.model.presence", { value: U(n, r.presence, 2) })), t.push(e("learn.model.fit", { share: y(n, r.r2 * 100, 0) })), c = t.join(" ");
		}
		let l = r != null && r.heat >= .05;
		return _`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:thermometer"></ha-icon>${e("learn.model")}</div>
        ${v(e, "learn_model")}
      </div>
      <div class="figure">
        <div class="big ${r ? "" : "small"}">
          ${r ? l ? _`+${U(n, r.heat, 2)}<small> kWh/°C</small>` : _`${U(n, r.base + (r.presence ?? 0) * (r.presence_mean ?? 0), 1)}<small> kWh</small>` : e("learn.still")}
        </div>
        ${r ? _`${E(e, { source: "learned" })}<span class="chip">${e("learn.days", { days: r.days })}</span>` : i}
      </div>
      <p class="say">${c}</p>
      ${a.length > 2 ? this.temperatureChart(e, t, r) : i}
    </section>`;
	}
	temperatureChart(e, t, n) {
		let r = t.days.filter((e) => e.temp != null && !e.excluded), i = r.map((e) => e.temp), a = Math.floor(Math.min(...i) / 2) * 2, o = Math.floor(Math.max(...i) / 2) * 2 + 2, s = [];
		for (let e = a; e < o; e += 2) s.push(e);
		let c = (t) => y(e.lang, t, 0), l = [{
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
			values: s.map((e) => Pt(n, !0, e + 1)),
			color: "var(--joe-c-soc)",
			digits: 1
		}, {
			label: e("learn.model.chart.day_off"),
			kind: "line",
			values: s.map((e) => Pt(n, !1, e + 1)),
			color: "var(--joe-c-soc-2)",
			dashed: !0,
			digits: 1
		});
		let u = Math.max(1, Math.ceil(s.length / 8)), d = /* @__PURE__ */ new Map();
		return s.forEach((e, t) => {
			t % u === 0 && d.set(t, `${c(e)}°`);
		}), _`<joe-chart
        .labels=${s.map((e) => `${c(e)} … ${c(e + 2)} °C`)}
        .ticks=${d}
        .series=${l}
        unit="kWh"
        height="150"
        lang=${e.lang}
        label=${e("learn.model.chart")}
      ></joe-chart>
      <div class="legend">
        ${l.map((e) => _`<span
              ><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color};height:${e.kind === "bar" ? "10px" : "4px"}"></i
              >${e.label}</span
            >`)}
      </div>`;
	}
	renderSources(e, t) {
		let n = e.lang, r = this.state.config, a = t.learned.solar_classes ?? {}, o = a.classes ?? {}, s = r.forecast, c = t.learned.sources ?? {}, l = jt.filter((e) => o[e]), u = (e) => y(n, e * 100, 0), d = [["main", s.provider ? Nt[s.provider] ?? s.provider : e("learn.sources.main")], ...s.alternatives.map((e) => [e.id, e.name])], f = Object.fromEntries(d.map(([e]) => [e, c[e] ? 1 / Math.max(c[e].error, .05) ** 2 : 0])), p = Object.values(f).reduce((e, t) => e + t, 0);
		return _`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:weather-partly-cloudy"></ha-icon>${e("learn.weather")}</div>
        ${v(e, "learn_weather")}
      </div>
      <p class="say">
        ${l.length ? e("learn.weather.say", { top: U(n, a.top ?? 0, 1) }) : e("learn.weather.learning", { have: a.days ?? 0 })}
      </p>
      ${l.length ? this.rows(jt.map((t) => {
			let r = o[t];
			return {
				name: e(`learn.weather.${t}`),
				values: r ? [`× ${y(n, r.factor, 2)}`, e("learn.days", { days: r.days })] : [e("learn.still")]
			};
		})) : i}
      <div class="sub-head">
        <b>${e("learn.sources")}</b>
      </div>
      ${s.alternatives.length ? _`${this.rows(d.map(([r, i]) => {
			let a = c[r];
			return {
				name: i,
				values: a ? [
					`× ${y(n, a.factor, 2)}`,
					e("learn.sources.error", { value: u(a.error) }),
					s.combine && p ? e("learn.sources.weight", { value: u(f[r] / p) }) : ""
				] : [e("learn.sources.learning", { need: t.needs.sources })]
			};
		}))}
            <div class="toggle-row">
              <span class="with-tip"><span id="combine-label">${e("learn.sources.combine")}</span>${v(e, "learn_combine")}</span>
              <button
                type="button"
                class="switch"
                role="switch"
                aria-checked=${String(s.combine)}
                aria-labelledby="combine-label"
                @click=${() => j(this, { forecast: { combine: !s.combine } })}
              ></button>
            </div>` : _`<p class="say">${e("learn.sources.single")}</p>`}
    </section>`;
	}
	renderBatteries(e, t) {
		let n = e.lang, r = this.state.config, i = t.learned.battery_models ?? {};
		return _`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:battery-heart-variant"></ha-icon>${e("learn.battery")}</div>
        ${v(e, "learn_battery")}
      </div>
      ${r.batteries.length ? this.rows(r.batteries.map((a) => {
			let o = i[a.id], s = a.capacity_kwh, c = r.provenance[`batteries[${a.id}].capacity_kwh`]?.source === "user", l;
			return l = o ? c && s ? e("learn.battery.user", { value: U(n, s, 1) }) : s && (o.capacity_kwh / s < .5 || o.capacity_kwh / s > 1.15) ? e("learn.battery.odd", { value: U(n, s, 1) }) : s ? e("learn.battery.uses_nominal", { value: U(n, s, 1) }) : e("learn.battery.uses") : a.power ? e("learn.battery.learning", { need: t.needs.models }) : e("learn.battery.no_power"), {
				name: a.name,
				values: o ? [e("learn.battery.capacity", { value: U(n, o.capacity_kwh, 1) }), e("learn.battery.efficiency", { value: y(n, o.efficiency * 100, 0) })] : [e("learn.still")],
				note: l
			};
		})) : _`<p class="say">${e("learn.battery.none")}</p>`}
    </section>`;
	}
	renderGroups(e, t) {
		let n = e.lang, r = this.state.config, i = t.learned.group_models ?? {}, a = r.consumers.filter((e) => e.energy_entity && e.kind !== "submeter");
		return _`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:chart-donut"></ha-icon>${e("learn.groups")}</div>
        ${v(e, "learn_groups")}
      </div>
      ${a.length ? this.rows(a.map((t) => {
			let r = i[t.id];
			return {
				name: t.name,
				values: r ? [e("learn.groups.average", { value: U(n, r.average, 1) }), r.heat >= .05 ? e("learn.groups.heat", { value: U(n, r.heat, 2) }) : e("learn.groups.steady")] : [e("learn.still")]
			};
		})) : _`<p class="say">${e("learn.groups.none")}</p>`}
    </section>`;
	}
	renderHotWater(e, t) {
		let n = e.lang, r = this.state.config, i = t.learned.action_models ?? {}, a = r.actions.filter((e) => e.kind === "target");
		return _`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:water-boiler"></ha-icon>${e("learn.hot_water")}</div>
        ${v(e, "learn_hot_water")}
      </div>
      ${a.length ? this.rows(a.map((t) => {
			let r = i[t.id];
			return {
				name: t.name,
				values: r ? [
					e("learn.hot_water.rate", { value: U(n, r.rate_k_per_h, 1) }),
					e("learn.hot_water.loss", { value: U(n, r.loss_k_per_h, 1) }),
					e("learn.hot_water.demand", { value: U(n, r.demand_k, 0) })
				] : [e("learn.still")],
				note: r ? void 0 : e("learn.hot_water.learning")
			};
		})) : _`<p class="say">${e("learn.hot_water.none")}</p>`}
    </section>`;
	}
	renderCars(e, t) {
		let n = e.lang, r = this.state.config, i = t.learned.car_models ?? {}, a = r.actions.filter((e) => e.kind === "switch" && e.need?.enabled);
		return _`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:car-electric"></ha-icon>${e("learn.car")}</div>
        ${v(e, "learn_car")}
      </div>
      ${a.length ? this.rows(a.map((t) => {
			let r = i[t.id], a = [];
			return r?.consumption != null && (a.push(e("learn.car.consumption", { value: U(n, r.consumption, 1) })), r.cold && a.push(e("learn.car.cold", { value: U(n, r.cold, 2) }))), (r?.workday_km != null || r?.day_off_km != null) && a.push(e("learn.car.km", {
				workday: r.workday_km == null ? "–" : U(n, r.workday_km, 0),
				day_off: r.day_off_km == null ? "–" : U(n, r.day_off_km, 0)
			})), {
				name: t.name,
				values: a.length ? a : [e("learn.still")],
				note: a.length ? void 0 : e(t.need?.odometer_entity ? "learn.car.learning" : "learn.car.no_odometer")
			};
		})) : _`<p class="say">${e("learn.car.none")}</p>`}
    </section>`;
	}
	renderPresence(e, t) {
		let n = e.lang, r = this.state.config, i = t.learned.presence ?? {}, a = r.persons.filter((e) => e.calendars.length);
		return _`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:account-clock-outline"></ha-icon>${e("learn.presence")}</div>
        ${v(e, "learn_presence")}
      </div>
      ${a.length ? this.rows(a.map((t) => {
			let r = Ye.filter((e) => i[t.id]?.[e]);
			return {
				name: t.name,
				values: r.length ? r.map((r) => e("learn.presence.value", {
					label: e(`label.${r}`),
					hours: U(n, i[t.id][r].hours, 0)
				})) : [e("learn.still")],
				note: t.person_entity ? void 0 : e("learn.presence.no_person")
			};
		})) : _`<p class="say">${e("learn.presence.none")}</p>`}
      <div class="own">
        <button type="button" class="mini-btn" @click=${() => this.edit("household")}>
          <ha-icon icon="mdi:calendar-account-outline"></ha-icon>${e("learn.presence.calendars")}
        </button>
      </div>
    </section>`;
	}
	renderCalendar(e) {
		let t = this.state.config.calendar, n = (e) => t.rules.filter((t) => t.label === e);
		return _`<section class="card wide" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:calendar-text-outline"></ha-icon>${e("learn.calendar")}</div>
        ${v(e, "learn_calendar")}
      </div>
      <p class="say">${e("learn.calendar.say")}</p>
      <div class="rules">
        ${Mt.map((r) => _`<div class="rule">
            <b>${e(`label.${r}`)}</b>
            <div class="keywords">
              ${n(r).map((n) => _`<span class="keyword"
                    >${n.keyword}<button
                      type="button"
                      aria-label=${e("learn.calendar.remove", { keyword: n.keyword })}
                      @click=${() => this.saveRules(t.rules.filter((e) => e !== n))}
                    >
                      <ha-icon icon="mdi:close"></ha-icon></button
                  ></span>`)}
              <form
                class="add"
                @submit=${(e) => {
			e.preventDefault(), this.addKeyword(t, r);
		}}
              >
                <input
                  class="input"
                  .value=${this.keyword[r] ?? ""}
                  maxlength="40"
                  placeholder=${e("learn.calendar.keyword")}
                  aria-label=${e("learn.calendar.add_to", { label: e(`label.${r}`) })}
                  @input=${(e) => this.keyword = {
			...this.keyword,
			[r]: e.target.value
		}}
                />
                <button type="submit" class="mini-btn" ?disabled=${!(this.keyword[r] ?? "").trim()}>
                  <ha-icon icon="mdi:plus"></ha-icon>${e("learn.calendar.add")}
                </button>
              </form>
            </div>
          </div>`)}
      </div>
      <div class="sub-head with-tip"><b>${e("learn.calendar.defaults")}</b>${v(e, "cal_defaults")}</div>
      <div class="defaults">
        ${["default_workday", "default_day_off"].map((n) => _`<label class="field">
            <span class="field-label">${e(`learn.calendar.${n}`)}</span>
            <select
              class="input"
              @change=${(e) => j(this, { calendar: { [n]: e.target.value } })}
            >
              ${Ye.map((r) => _`<option value=${r} ?selected=${t[n] === r}>${e(`label.${r}`)}</option>`)}
            </select>
          </label>`)}
      </div>
    </section>`;
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
		let t = Mt.flatMap((t) => e.filter((e) => e.label === t));
		j(this, { calendar: { rules: t } });
	}
	edit(e) {
		this.dispatchEvent(new CustomEvent("joe-edit", {
			detail: { editor: e },
			bubbles: !0,
			composed: !0
		}));
	}
	renderAccuracy(e, t) {
		let n = t.accuracy.slice(-14).reverse(), r = (t) => t == null ? "–" : U(e.lang, t, 1);
		return _`<section class="card wide" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:target"></ha-icon>${e("learn.accuracy")}</div>
        ${v(e, "learn_accuracy")}
      </div>
      ${n.length ? _`<div class="table" role="table" aria-label=${e("learn.accuracy")}>
            <span class="th" role="columnheader">${e("learn.accuracy.night")}</span>
            <span class="th" role="columnheader">${e("learn.accuracy.solar")}<span class="unit">kWh</span></span>
            <span class="th" role="columnheader">${e("learn.accuracy.morning")}<span class="unit">kWh</span></span>
            <span class="th" role="columnheader">${e("learn.accuracy.result")}</span>
            ${n.map((t) => _`<span role="cell">${W(e.lang, t.date, "weekday")}</span>
                <span role="cell">${e("learn.accuracy.value", {
			expected: r(t.solar.forecast),
			actual: r(t.solar.actual)
		})}</span>
                <span role="cell">${e("learn.accuracy.value", {
			expected: r(t.bridge.planned),
			actual: r(t.bridge.actual)
		})}</span>
                <span role="cell" class=${t.saving > .005 ? "good" : t.saving < -.005 ? "bad" : ""}
                  >${H(e, t.saving, this.currency, !0)}</span
                >`)}
          </div>` : _`<p class="say">${e("learn.accuracy.none")}</p>`}
    </section>`;
	}
	renderReset(e) {
		let t = !!this.state?.observe?.active;
		return _`<section class="card danger wide" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:restore"></ha-icon>${e("learn.reset")}</div>
        ${v(e, "learn_reset")}
      </div>
      <p>${e("learn.reset.text")}</p>
      <div class="sub-head with-tip"><b>${e("learn.reset.scope")}</b>${v(e, "learn_reset_scope")}</div>
      <div class="seg scopes" role="group" aria-label=${e("learn.reset.scope")}>
        ${["all", ...Qe].map((t) => _`<button type="button" aria-pressed=${String(this.scope === t)} @click=${() => this.scope = t}>
              ${e(`learn.reset.scope.${t}`)}
            </button>`)}
      </div>
      <div class="actions">
        <button type="button" class="btn btn-danger" ?disabled=${!t} @click=${() => this.confirming = !0}>
          ${e(this.scope === "all" ? "learn.reset.button" : "learn.reset.button.scope")}
        </button>
      </div>
      ${t ? i : _`<p>${e("learn.reset.off")}</p>`}
      ${this.notice ? _`<div class="note ${this.notice.ok ? "" : "warn"}" role="status">
            <ha-icon icon=${this.notice.ok ? "mdi:check" : "mdi:alert-outline"}></ha-icon>${this.notice.text}
          </div>` : i}
    </section>`;
	}
	renderConfirm(e) {
		let t = () => {
			this.confirming = !1;
		}, n = this.scope;
		return _`<joe-sheet label=${e("learn.reset.label")} closeLabel=${e("common.close")} @joe-close=${t}>
      <div data-tipped>
        <div class="sheet-title">${w(e("learn.reset.confirm.title"), "h2", v(e, "learn_reset"))}</div>
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
S([r({ attribute: !1 })], X.prototype, "hass", void 0), S([r({ attribute: !1 })], X.prototype, "t", void 0), S([r({ attribute: !1 })], X.prototype, "state", void 0), S([o()], X.prototype, "data", void 0), S([o()], X.prototype, "failed", void 0), S([o()], X.prototype, "confirming", void 0), S([o()], X.prototype, "resetting", void 0), S([o()], X.prototype, "scope", void 0), S([o()], X.prototype, "keyword", void 0), S([o()], X.prototype, "notice", void 0), x("joe-learn-page", X);
//#endregion
//#region src/components/texts.ts
function It(e, t) {
	return t == null ? "–" : y(e.lang, t * 100, 2);
}
function Lt(e, t, n = !0) {
	let r;
	return r = t.kind === "fixed_window" && t.window ? t.night_price == null && t.day_price == null ? e("tariff.window_only", {
		start: t.window.start,
		end: t.window.end
	}) : e("find.tariff.window", {
		start: t.window.start,
		end: t.window.end,
		night: It(e, t.night_price),
		day: It(e, t.day_price)
	}) : t.kind === "dynamic" ? t.night_price != null && t.day_price != null ? e("find.tariff.dynamic", {
		night: It(e, t.night_price),
		day: It(e, t.day_price)
	}) : e("tariff.dynamic") : t.kind === "flat" ? t.day_price == null ? e("tariff.flat") : e("find.tariff.flat", { day: It(e, t.day_price) }) : e("find.tariff.unknown"), n && t.feed_in_price != null && (r += ` · ${e("find.tariff.feedin", { price: It(e, t.feed_in_price) })}`), r;
}
function Rt(e, t) {
	let n = {};
	for (let [r, i] of Object.entries(t)) typeof i == "number" ? n[r] = y(e.lang, i, 2) : typeof i == "string" && (n[r] = i);
	typeof t.role == "string" && (n.role = e.optional(`role.${t.role}`) ?? t.role);
	let r = `check.${t.code}`;
	return t.code === "grid_sign" && typeof t.expected == "number" && typeof t.actual == "number" && (r = t.expected < 0 ? "check.grid_sign.export" : "check.grid_sign.import", n.expected = y(e.lang, Math.abs(t.expected), 1), n.actual = y(e.lang, Math.abs(t.actual), 1)), e.optional(r, n) ?? t.code;
}
//#endregion
//#region src/components/review.ts
var zt = /* @__PURE__ */ new Set([
	"climate",
	"heat_pump",
	"electric_heating",
	"hot_water"
]), Bt = class extends n {
	constructor(...e) {
		super(...e), this.checks = [], this.context = "setup";
	}
	static {
		this.styles = [l, g`
      :host {
        display: block;
      }
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
      .text {
        min-width: 0;
        flex: 1;
      }
      .head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 8px 12px;
        flex-wrap: wrap;
      }
      .t {
        font-weight: 700;
        line-height: 1.3;
      }
      .ignored .t {
        color: var(--joe-ink-2);
      }
      .chips {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .d {
        font-size: 13.5px;
        color: var(--joe-ink-2);
        margin-top: 2px;
        overflow-wrap: anywhere;
      }
      .missing .d,
      .ignored .d {
        color: var(--joe-muted);
      }
      details {
        margin-top: 6px;
        font-size: 13px;
        color: var(--joe-ink-2);
      }
      summary {
        cursor: pointer;
        font-weight: 600;
        color: var(--joe-ink);
        width: fit-content;
      }
      details ul {
        margin: 4px 0 0;
        padding-left: 18px;
      }
      .note {
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
    `];
	}
	render() {
		let { hass: e, t, config: n } = this;
		return !e || !t || !n ? i : _`<ul class="found">
      ${this.rows(e, t, n).map((e) => this.renderRow(t, e))}
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
			chips: [E(t, { source: "read" })]
		}), i.push(...this.batteryRows(e, t, n)), i.push(this.tariffRow(t, n)), i.push(this.forecastRow(t, n)), i.push(this.powerRow(e, t, n, "grid_power")), i.push(this.powerRow(e, t, n, "home_power")), i.push(this.solarRow(e, t, n));
		let o = (e) => _`<span class="chip ${e ? "ok" : "soon"}">${t(e ? "review.used" : "review.unused")}</span>`;
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
			let r = a.entities.soc ? s(e, a.entities.soc) : null, c = [
				a.name,
				r === null ? null : `${y(t.lang, r, 0)} %`,
				a.range_km === null ? null : `${y(t.lang, a.range_km, 0)} km`,
				null
			], l = n.actions.some((e) => e.need?.enabled && (a.entities.soc && e.need.soc_entity === a.entities.soc || a.entities.range && e.need.range_entity === a.entities.range));
			c[3] = t(l ? "review.car.used" : "review.car.unused"), i.push({
				key: `car:${a.device_id}`,
				icon: "mdi:car-electric",
				title: t("find.car"),
				detail: c.filter(Boolean).join(" · "),
				chips: [T(t, a.confidence), o(l)]
			});
		}
		i.push(this.contextRow(e, t, n, "weather")), i.push(this.contextRow(e, t, n, "holiday"));
		let c = this.context === "settings", l = [_`<span class="chip soon">${t("review.ask_later")}</span>`];
		if (c || n.persons.length || r?.calendars.length) {
			let e = c ? n.persons.reduce((e, t) => e + t.calendars.length, 0) : r?.calendars.length ?? 0;
			i.push({
				key: "people",
				icon: "mdi:account-group-outline",
				title: t("find.people"),
				detail: t("find.people.detail", {
					persons: this.count(t, n.persons.length, "word.person"),
					calendars: this.count(t, e, "word.calendar")
				}),
				chips: c ? [] : l,
				tip: c ? "q_household" : void 0,
				actions: c ? [this.button(t("review.change"), "mdi:account-edit-outline", () => this.edit("household"))] : void 0
			});
		}
		let u = n.consumers.filter((e) => e.kind !== "submeter");
		return u.length && i.push({
			key: "devices",
			icon: "mdi:devices",
			title: t("find.devices"),
			detail: t("find.devices.detail", {
				count: this.count(t, u.length, "word.device"),
				heating: u.filter((e) => zt.has(e.kind)).length
			}),
			chips: c ? [] : l,
			tip: c ? "f_consumer_kind" : void 0,
			actions: c ? [this.button(t("review.assign"), "mdi:devices", () => this.edit("consumers"))] : void 0
		}), i;
	}
	batteryRows(e, t, n) {
		let r = [];
		for (let i of n.batteries) {
			let a = this.discovery?.batteries.find((e) => e.id === i.id), o = s(e, i.soc_entity), c = i.capacity_kwh ?? ae(e, i.capacity_entity), l = [
				c ? `${y(t.lang, c, 2)} kWh` : t("review.capacity_unknown"),
				o === null ? null : `${y(t.lang, o, 0)} %`,
				i.adapter === "none" ? t("find.battery.read") : t("find.battery.control")
			], u = this.checks.filter((e) => e.battery_id === i.id).map((e) => this.note(t, e));
			r.push({
				key: `battery:${i.id}`,
				icon: "mdi:home-battery-outline",
				title: i.name,
				detail: l.filter(Boolean).join(" · "),
				chips: [E(t, O(n, `batteries[${i.id}].soc_entity`)), ...a ? [T(t, a.confidence)] : []],
				reasons: a?.reasons,
				notes: u,
				state: this.checks.some((e) => e.battery_id === i.id && e.level === "warn") ? "flag" : void 0,
				tip: "review_battery",
				actions: [this.button(t("review.change"), "mdi:pencil-outline", () => this.edit("battery", i.id)), this.button(t("review.ignore"), "", () => this.ignoreBattery(i.id), !0)]
			});
		}
		for (let e of this.discovery?.batteries ?? []) k(n, `battery:${e.id}`) && !n.batteries.some((t) => t.id === e.id) && r.push({
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
		j(this, {
			batteries: { [e]: null },
			answers: { ignored: A(this.config, `battery:${e}`, !0) }
		});
	}
	useBattery(e) {
		let t = this.config;
		j(this, {
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
			answers: { ignored: A(t, `battery:${e.id}`, !1) }
		}, "read");
	}
	async addBattery() {
		let { t: e, hass: t, config: n } = this;
		if (!e || !t || !n) return;
		let r = (await M(this, {
			heading: e("pick.battery.title"),
			tip: "pick_battery",
			filter: "soc",
			selected: [],
			exclude: n.batteries.map((e) => e.soc_entity)
		}))?.selected[0];
		if (!r) return;
		let i = t.entities?.[r]?.device_id, a = i && !n.batteries.some((e) => e.id === i) ? i : r;
		j(this, { batteries: { [a]: {
			name: i && (t.devices?.[i]?.name_by_user || t.devices?.[i]?.name) || d(t, r),
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
			detail: Lt(e, n),
			chips: r ? [] : [E(e, O(t, "tariff.kind")), ...this.discovery && this.discovery.tariff.kind !== "unknown" ? [T(e, this.discovery.tariff.confidence)] : []],
			reasons: this.discovery?.tariff.reasons,
			notes: r ? [this.info(e("review.tariff.ask"))] : [],
			state: r ? "missing" : void 0,
			tip: "review_tariff",
			actions: [this.button(e(r ? "review.enter" : "review.change"), "mdi:pencil-outline", () => this.edit("tariff"))]
		};
	}
	forecastRow(e, t) {
		let n = this.discovery?.forecast, r = k(t, "forecast"), i = {
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
				today: n.today_kwh == null ? "–" : y(e.lang, n.today_kwh, 1),
				tomorrow: n.tomorrow_kwh == null ? "–" : y(e.lang, n.tomorrow_kwh, 1)
			}) : t.forecast.provider,
			chips: [E(e, O(t, "forecast.provider")), ...n ? [T(e, n.confidence)] : []],
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
		j(this, {
			forecast: {
				provider: null,
				config_entries: [],
				today: [],
				tomorrow: [],
				remaining_today: [],
				alternatives: []
			},
			answers: { ignored: A(this.config, "forecast", !0) }
		});
	}
	useForecast() {
		let e = this.discovery?.forecast;
		e && j(this, {
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
			answers: { ignored: A(this.config, "forecast", !1) }
		}, "read");
	}
	powerRow(e, t, n, r) {
		let i = n.measurements[r], a = this.discovery?.measurements[r] ?? null, o = r === "grid_power", s = k(n, r), c = {
			key: r,
			icon: o ? "mdi:transmission-tower" : "mdi:home-lightning-bolt-outline",
			title: t(o ? "find.grid" : "find.home"),
			tip: o ? "review_grid" : "review_home"
		}, l = this.button(t(i ? "review.change" : "review.choose"), "mdi:magnify", () => this.pickPower(r));
		if (!i && !o && n.measurements.grid_power) return {
			...c,
			detail: t("review.home.balance"),
			notes: this.homeNotes(t, n),
			actions: [l, this.button(t("review.home.devices"), "mdi:devices", () => this.edit("consumers"))]
		};
		if (!i) return s ? {
			...c,
			detail: t("review.home.computed"),
			state: "ignored",
			actions: [this.button(t("review.choose"), "mdi:magnify", () => this.pickPower(r))]
		} : {
			...c,
			detail: t("find.none"),
			state: "missing",
			notes: [this.info(t(o ? "review.grid.none" : "review.home.none"))],
			actions: o ? [l] : [l, this.button(t("review.home.without"), "", () => this.ignore("home_power", { measurements: { home_power: null } }), !0)]
		};
		let u = p(e, i), f = m(e, i.entity_id, t.lang);
		if (u !== null) {
			let e = y(t.lang, Math.abs(u), 2);
			f = o ? t(u >= 0 ? "live.import" : "live.export", { value: e }) : t("live.kw", { value: y(t.lang, u, 2) });
		}
		let h = this.checks.filter((e) => e.code !== "missing" && (e.role === r || o && e.code === "grid_sign" || !o && e.code === "home_negative")), g = h.map((e) => e.code === "grid_sign" ? this.note(t, e, [this.button(t("review.invert"), "mdi:swap-vertical", () => this.setPower(r, {
			...i,
			invert: !i.invert
		})), this.button(t("review.keep"), "mdi:check", () => this.confirm(`grid_sign:${i.entity_id}`), !0)]) : e.code === "home_negative" ? this.note(t, e, [this.button(t("review.invert"), "mdi:swap-vertical", () => this.setPower(r, {
			...i,
			invert: !i.invert
		}))]) : this.note(t, e)), _ = a?.entity.entity_id === i.entity_id;
		return !o && n.measurements.grid_power ? {
			...c,
			detail: `${t("review.home.balance")} · ${t("review.home.compare", {
				name: d(e, i.entity_id),
				live: f
			})}`,
			chips: [E(t, O(n, `measurements.${r}`))],
			notes: [...this.homeNotes(t, n), ...g],
			state: h.some((e) => e.level === "warn") ? "flag" : void 0,
			actions: [l, this.button(t("review.home.devices"), "mdi:devices", () => this.edit("consumers"))]
		} : {
			...c,
			detail: `${d(e, i.entity_id)} · ${f}`,
			chips: [E(t, O(n, `measurements.${r}`)), ...a && _ ? [T(t, a.confidence)] : []],
			reasons: _ ? a?.reasons : void 0,
			notes: g,
			state: h.some((e) => e.level === "warn") ? "flag" : void 0,
			actions: [l]
		};
	}
	homeNotes(e, t) {
		let n = [], r = Ze(t.consumers);
		if (r.length) {
			let t = r.map((t) => t.kind === "ev" || t.runs === "always" || !t.runs ? t.name : `${t.name} (${e(`runs.${t.runs}`)})`).join(", ");
			n.push(this.info(e(r.some((e) => e.kind === "ev") ? "review.home.flexible" : "review.home.flexible_some", { names: t })));
		} else t.consumers.some((e) => e.kind !== "submeter") && n.push(this.info(e("review.home.flexible_none")));
		let i = t.learned.home_check;
		if (i && i.calc_kwh > 0) {
			let t = (i.sensor_kwh - i.calc_kwh) / i.calc_kwh;
			Math.abs(t) >= .1 && n.push(this.info(e("review.home.off", {
				days: i.days,
				pct: y(e.lang, Math.abs(t) * 100, 0),
				direction: e(t < 0 ? "review.home.less" : "review.home.more")
			})));
		}
		return n;
	}
	async pickPower(e) {
		let { t, config: n } = this;
		if (!t || !n) return;
		let r = n.measurements[e], i = this.discovery?.measurements[e], a = e === "grid_power", o = await M(this, {
			heading: t(a ? "pick.grid.title" : "pick.home.title"),
			tip: a ? "pick_grid" : "pick_home",
			filter: "power",
			selected: r ? [r.entity_id] : [],
			suggestions: Ce(i ? [we(i)] : [], i?.alternatives),
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
		k(n, e) && (c.answers = { ignored: A(n, e, !1) }), j(this, c);
	}
	setPower(e, t) {
		j(this, { measurements: { [e]: t } });
	}
	solarRow(e, t, n) {
		let r = n.measurements.solar_power, i = this.discovery?.measurements.solar_power ?? null, a = {
			key: "solar_power",
			icon: "mdi:solar-panel",
			title: t("find.solar"),
			tip: "review_solar"
		};
		if (!r.length) return k(n, "solar_power") ? {
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
		let o = oe(e, r), s = this.checks.filter((e) => e.role === "solar_power" && e.code !== "missing").map((e) => this.note(t, e));
		return {
			...a,
			detail: t("find.solar.detail", {
				count: this.count(t, r.length, "word.sensor"),
				total: o === null ? "–" : y(t.lang, o, 2)
			}),
			chips: [E(t, O(n, "measurements.solar_power")), ...i ? [T(t, i.confidence)] : []],
			reasons: i?.reasons,
			notes: s,
			state: s.length && this.checks.some((e) => e.role === "solar_power" && e.level === "warn") ? "flag" : void 0,
			actions: [this.button(t("review.change"), "mdi:magnify", () => this.pickSolar())]
		};
	}
	async pickSolar() {
		let { t: e, config: t } = this;
		if (!e || !t) return;
		let n = t.measurements.solar_power, r = this.discovery?.measurements.solar_power, i = await M(this, {
			heading: e("pick.solar.title"),
			tip: "pick_solar",
			filter: "power",
			multiple: !0,
			selected: n.map((e) => e.entity_id),
			suggestions: Ce((r?.entities ?? []).map((e) => ({
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
		k(t, "solar_power") && (a.answers = { ignored: A(t, "solar_power", !1) }), j(this, a);
	}
	contextRow(e, t, n, r) {
		let i = r === "weather" ? "weather_entity" : "holiday_entity", a = n.context[i], o = this.discovery?.[r] ?? null, s = {
			key: r,
			icon: r === "weather" ? "mdi:weather-partly-cloudy" : "mdi:calendar-star",
			title: t(r === "weather" ? "find.weather" : "find.holiday"),
			tip: r === "weather" ? "review_weather" : "review_holiday"
		}, c = () => this.pickContext(r);
		if (a) {
			let l = o?.entity.entity_id === a;
			return {
				...s,
				detail: d(e, a),
				chips: [E(t, O(n, `context.${i}`)), ...o && l ? [T(t, o.confidence)] : []],
				reasons: l ? o?.reasons : void 0,
				actions: [this.button(t("review.change"), "mdi:magnify", c), this.button(t("review.ignore"), "", () => this.ignore(r, { context: { [i]: null } }), !0)]
			};
		}
		return k(n, r) ? {
			...s,
			detail: t("review.ignored"),
			state: "ignored",
			actions: [this.button(t("review.use"), "mdi:undo-variant", c)]
		} : {
			...s,
			detail: t("find.none"),
			state: "missing",
			notes: [this.info(t(r === "weather" ? "review.weather.none" : "review.holiday.none"))],
			actions: [this.button(t("review.choose"), "mdi:magnify", c)]
		};
	}
	async pickContext(e) {
		let { t, config: n } = this;
		if (!t || !n) return;
		let r = e === "weather" ? "weather_entity" : "holiday_entity", i = this.discovery?.[e], a = n.context[r], o = (await M(this, {
			heading: t(e === "weather" ? "pick.weather.title" : "pick.holiday.title"),
			tip: e === "weather" ? "pick_weather" : "pick_holiday",
			filter: e === "weather" ? "weather" : "workday",
			selected: a ? [a] : i ? [i.entity.entity_id] : [],
			suggestions: Ce(i ? [we(i)] : [], i?.alternatives)
		}))?.selected[0];
		o && j(this, {
			context: { [r]: o },
			answers: { ignored: A(n, e, !1) }
		});
	}
	ignore(e, t) {
		j(this, {
			...t,
			answers: { ignored: A(this.config, e, !0) }
		});
	}
	confirm(e) {
		let t = this.config.answers.confirmed.filter((t) => t !== e);
		j(this, { answers: { confirmed: [...t, e] } });
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
		return _`<button type="button" class="mini-btn ${r ? "quiet" : ""}" @click=${n}>
      ${t ? _`<ha-icon icon=${t}></ha-icon>` : i}${e}
    </button>`;
	}
	info(e) {
		return _`<div class="note"><ha-icon icon="mdi:information-outline"></ha-icon><span>${e}</span></div>`;
	}
	note(e, t, n = []) {
		return _`<div class="note ${t.level}">
      <ha-icon icon=${t.level === "warn" ? "mdi:alert-outline" : "mdi:information-outline"}></ha-icon>
      <div>
        <span>${Rt(e, t)}</span>
        ${n.length ? _`<div class="note-actions">${n}</div>` : i}
      </div>
    </div>`;
	}
	count(e, t, n) {
		let [r, i] = e(n).split("|");
		return `${y(e.lang, t, 0)} ${t === 1 ? r : i}`;
	}
	renderRow(e, t) {
		return _`<li class="item ${t.state ?? ""}" ?data-tipped=${!!(t.actions?.length && t.tip)}>
      <span class="ico-box"><ha-icon icon=${t.icon}></ha-icon></span>
      <div class="text">
        <div class="head">
          <span class="t">${t.title}</span>
          ${t.chips?.length ? _`<span class="chips">${t.chips}</span>` : i}
        </div>
        <div class="d">${t.detail}</div>
        ${t.reasons?.length ? _`<details data-notip>
              <summary>${e("scan.why")}</summary>
              <ul>
                ${t.reasons.map((t) => _`<li>${de(e, t)}</li>`)}
              </ul>
            </details>` : i}
        ${t.notes ?? i}
        ${t.actions?.length ? _`<div class="row-actions">${t.actions}${t.tip ? v(e, t.tip) : i}</div>` : i}
      </div>
    </li>`;
	}
};
S([r({ attribute: !1 })], Bt.prototype, "hass", void 0), S([r({ attribute: !1 })], Bt.prototype, "t", void 0), S([r({ attribute: !1 })], Bt.prototype, "config", void 0), S([r({ attribute: !1 })], Bt.prototype, "discovery", void 0), S([r({ attribute: !1 })], Bt.prototype, "checks", void 0), S([r()], Bt.prototype, "context", void 0), x("joe-review", Bt);
//#endregion
//#region src/components/step-nav.ts
function Vt(e, t, n = !1) {
	let r = _`<button type="button" class="btn btn-primary" ?data-notip=${!t.nextTip} @click=${t.next}>
    ${t.nextLabel}<ha-icon icon="mdi:chevron-right"></ha-icon>
  </button>`;
	return _`<nav class="step-nav ${n ? "wide" : ""}" aria-label=${e("onb.nav")}>
    ${t.back ? _`<button type="button" class="btn btn-ghost" data-notip @click=${t.back}>
          <ha-icon icon="mdi:chevron-left"></ha-icon>${t.backLabel ?? e("onb.back")}
        </button>` : _`<span></span>`}
    ${t.nextTip ? _`<span class="with-tip" data-tipped>${r} ${v(e, t.nextTip)}</span>` : r}
  </nav>`;
}
//#endregion
//#region src/pages/questions.ts
var Ht = {
	tariff: "plan",
	feed_in: "plug",
	capacity: "night-charge",
	heating: "ask",
	hot_water: "hot-water",
	ev: "ev",
	household: "relax"
}, Ut = [
	"climate",
	"heat_pump",
	"electric_heating"
];
function Wt(e) {
	let t = [], n = (t) => O(e, t)?.source === "user", r = (t) => e.answers[t] !== void 0 && e.answers[t] !== null, i = e.tariff;
	(i.kind === "unknown" || n("tariff.kind") || r("tariff")) && t.push("tariff"), (i.feed_in_price == null && !i.feed_in_entity || n("tariff.feed_in_price") || r("feed_in")) && t.push("feed_in");
	for (let i of e.batteries) {
		let e = `capacity:${i.id}`;
		(i.capacity_kwh == null && !i.capacity_entity || n(`batteries[${i.id}].capacity_kwh`) || r(e)) && t.push(e);
	}
	return t.push("heating", "hot_water", "ev", "household"), t;
}
var Gt = class extends n {
	constructor(...e) {
		super(...e), this.single = "", this.index = 0;
	}
	static {
		this.styles = [l, g`
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
	render() {
		let { t: e, config: t } = this;
		if (!e || !t) return i;
		if (this.single) return this.renderQuestion(e, t, this.single);
		let n = Wt(t), r = Math.min(this.index, n.length - 1), a = n[r], o = r === n.length - 1, s = Vt(e, {
			back: () => this.move(-1, n.length),
			next: () => this.move(1, n.length),
			nextLabel: e(o ? "ask.finish" : "onb.next")
		});
		return _`${s}
      <div class="wrap">
        <joe-pose name=${Ht[a.split(":")[0]] ?? "ask"}></joe-pose>
        <div>
          <div class="eyebrow">${e("ask.count", {
			n: r + 1,
			total: n.length
		})}</div>
          ${this.renderQuestion(e, t, a)}
          <div class="actions" data-notip>
            <button type="button" class="btn btn-primary" @click=${() => this.move(1, n.length)}>
              ${e(o ? "ask.finish" : "onb.next")}
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
			case "tariff": return this.question(e("q.tariff.title"), "q_tariff", _`<joe-tariff-form
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
			default: return this.question(e("q.household.title"), "q_household", _`<joe-household
            .hass=${this.hass}
            .t=${e}
            .config=${t}
            .discovery=${this.discovery}
          ></joe-household>`);
		}
	}
	question(e, t, n) {
		let r = this.t;
		return _`<div data-tipped>
      <div class="title-row">${w(e, "h2", v(r, t))}</div>
      ${C}
      <div class="content">${n}</div>
    </div>`;
	}
	choice(e, t, n, r = !1) {
		let i = this.config?.answers[t];
		return _`<joe-choice
      .options=${n}
      .value=${Array.isArray(i) ? i : typeof i == "string" ? [i] : []}
      ?multiple=${r}
      .exclusive=${["none"]}
      idk=${e("ask.idk")}
      @joe-choice=${(e) => j(this, { answers: { [t]: r ? e.detail.value : e.detail.value[0] ?? null } })}
    ></joe-choice>`;
	}
	renderHotWater(e, t) {
		let n = t.answers.hot_water, r = n === "hot_water_heat_pump" || n === "electric", a = t.consumers.filter((e) => e.kind === "hot_water"), o = t.actions.find((e) => e.kind === "target");
		return this.question(e("q.hot_water.title"), "q_hot_water", _`${this.choice(e, "hot_water", [
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
      ${r ? _`<div class="follow">
            <p class="hint">${a.length ? e("q.hot_water.devices") : e("q.hot_water.no_devices")}</p>
            ${a.length ? _`<div class="chips">${a.map((e) => _`<span class="chip learned">${e.name}</span>`)}</div>` : i}
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
              ${v(e, "q_hot_water_action")}
            </div>
          </div>` : i}`);
	}
	renderHeating(e, t) {
		let n = t.answers.heating, r = Array.isArray(n) ? n : [], a = t.consumers.filter((e) => r.includes(e.kind)), o = r.some((e) => Ut.includes(e));
		return this.question(e("q.heating.title"), "q_heating", _`${this.choice(e, "heating", [
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
        ${o && t.consumers.length ? _`<div class="follow">
              <p class="hint">${a.length ? e("q.heating.devices") : e("q.heating.no_devices")}</p>
              ${a.length ? _`<div class="chips">
                    ${a.map((e) => _`<span class="chip learned">${e.name}</span>`)}
                  </div>` : i}
              <div class="with-tip" style="margin-top:10px">
                <button type="button" class="mini-btn" @click=${() => this.edit("consumers")}>
                  <ha-icon icon="mdi:devices"></ha-icon>${e("q.heating.assign")}
                </button>
                ${v(e, "f_consumer_kind")}
              </div>
            </div>` : i}`);
	}
	renderFeedIn(e, t) {
		let n = t.tariff.feed_in_price, r = t.answers.feed_in === ct;
		return this.question(e("q.feed_in.title"), "q_feed_in", _`<div class="inline">
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
			j(this, {
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
          @click=${() => j(this, {
			tariff: { feed_in_price: 0 },
			answers: { feed_in: "none" }
		})}
        >
          ${e("q.feed_in.none")}
        </button>
        <button
          type="button"
          class="mini-btn ${r ? "go" : ""}"
          @click=${() => j(this, {
			tariff: { feed_in_price: null },
			answers: { feed_in: ct }
		})}
        >
          ${e("ask.idk")}
        </button>
      </div>`);
	}
	renderCapacity(e, t, n) {
		let r = t.batteries.find((e) => e.id === n);
		if (!r) return _``;
		let i = `capacity:${n}`, a = t.answers[i] === ct;
		return this.question(e("q.capacity.title", { name: r.name }), "q_capacity", _`<div class="inline">
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
			j(this, {
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
          @click=${() => j(this, {
			batteries: { [n]: { capacity_kwh: null } },
			answers: { [i]: ct }
		})}
        >
          ${e("ask.idk_learn")}
        </button>
      </div>`);
	}
	saveTariff(e) {
		let t = { tariff: e };
		e.kind && (t.answers = { tariff: e.kind }), j(this, t);
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
S([r({ attribute: !1 })], Gt.prototype, "hass", void 0), S([r({ attribute: !1 })], Gt.prototype, "t", void 0), S([r({ attribute: !1 })], Gt.prototype, "config", void 0), S([r({ attribute: !1 })], Gt.prototype, "discovery", void 0), S([r()], Gt.prototype, "single", void 0), S([o()], Gt.prototype, "index", void 0), x("joe-questions", Gt);
//#endregion
//#region src/pages/onboarding.ts
function Kt(e, t, n) {
	let [r, i] = e(n).split("|");
	return `${y(e.lang, t, 0)} ${t === 1 ? r : i}`;
}
var qt = {
	climate: "q.heating.climate",
	heat_pump: "q.heating.heat_pump",
	electric_heating: "q.heating.electric",
	none: "q.heating.none"
}, Z = class extends n {
	constructor(...e) {
		super(...e), this.step = "welcome", this.checks = [], this.discovering = !1, this.discoveryFailed = !1;
	}
	static {
		this.styles = [l, g`
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
		if (!e) return i;
		switch (this.step) {
			case "welcome": return this.layout("welcome", _`${w(e("onb.welcome.title"), "h1")} ${C}
            <p class="lead">${e("onb.welcome.lead")}</p>
            <div class="calm"><span class="pill-sim">${e("mode.simulation")}</span>${e("onb.calm")}</div>
            <details data-notip>
              <summary>${e("onb.welcome.more")}</summary>
              ${e("onb.welcome.more.text").split("\n").map((e) => _`<p>${e}</p>`)}
            </details>
            <div class="actions" data-tipped>
              <button type="button" class="btn btn-primary" @click=${() => this.go("scan")}>
                ${e("onb.welcome.go")}
              </button>
              ${v(e, "scan_start")}
            </div>`);
			case "scan": return this.renderScan(e);
			case "questions": return _`<joe-questions
          .hass=${this.hass}
          .t=${e}
          .config=${this.config}
          .discovery=${this.discovery}
        ></joe-questions>`;
			case "done": return this.renderDone(e);
		}
	}
	renderScan(e) {
		if (this.discovering || !this.discovery && !this.discoveryFailed) return this.layout("scout", _`${w(e("onb.scan.title"))} ${C}
          <p class="lead">${e("onb.scan.lead")}</p>
          ${this.renderEnergy(e)}
          <div class="looking" role="status">${e("scan.looking")}</div>`);
		let t = Vt(e, {
			back: () => this.go("welcome"),
			next: () => this.go("questions"),
			nextLabel: e("onb.next")
		}, !0);
		return _`${t}
      <div class="wrap wide">
        <joe-pose name="scout"></joe-pose>
        <div>
          ${w(e("scan.title"))} ${C}
          <p class="lead">${e("scan.lead")}</p>
          ${this.discoveryFailed ? _`<p class="failed">${e("scan.failed")}</p>` : i}
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
		let t = Vt(e, {
			back: () => this.go("scan"),
			backLabel: e("onb.done.change"),
			next: () => this.complete(),
			nextLabel: e("onb.done.go"),
			nextTip: "start"
		});
		return _`${t}
    ${this.layout("thumbs", _`${w(e("onb.done.title"))} ${C}
        ${this.config ? this.renderSummary(e, this.config) : i}
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
		let n = this.hass, r = t.batteries.reduce((e, t) => e + (t.capacity_kwh ?? (n ? ae(n, t.capacity_entity) : null) ?? 0), 0), i = (n, r) => {
			let i = t.answers[n];
			if (i === "unknown") return e("sum.unknown");
			let a = Array.isArray(i) ? i : typeof i == "string" ? [i] : [];
			return a.length ? a.map((t) => e.optional(r[t] ?? "") ?? t).join(", ") : e("sum.open");
		}, a = this.discovery?.forecast, o = [
			[e("sum.batteries"), t.batteries.length ? e("sum.batteries.value", {
				count: t.batteries.length,
				kwh: r ? y(e.lang, r, 1) : "?"
			}) : e("sum.none")],
			[e("sum.tariff"), t.tariff.kind === "unknown" ? e("sum.unknown") : Lt(e, t.tariff, !1)],
			[e("sum.feed_in"), t.tariff.feed_in_price == null ? t.tariff.feed_in_entity ? e("sum.from_sensor") : e("sum.unknown") : `${It(e, t.tariff.feed_in_price)} ct`],
			[e("sum.forecast"), t.forecast.provider ? a ? e("sum.forecast.value", {
				provider: a.provider_name,
				planes: Kt(e, a.planes, "word.plane")
			}) : t.forecast.provider : e("sum.none")],
			[e("sum.heating"), i("heating", qt)],
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
				persons: Kt(e, t.persons.length, "word.person"),
				calendars: Kt(e, t.persons.reduce((e, t) => e + t.calendars.length, 0), "word.calendar")
			})]
		];
		return _`<div class="lines">
      ${o.map(([e, t]) => _`<div><span>${e}</span><span>${t}</span></div>`)}
    </div>`;
	}
	rediscover() {
		this.dispatchEvent(new CustomEvent("joe-rediscover", {
			bubbles: !0,
			composed: !0
		}));
	}
	layout(e, t) {
		return _`<div class="wrap">
      <joe-pose name=${e}></joe-pose>
      <div>${t}</div>
    </div>`;
	}
	renderEnergy(e) {
		let t = this.info?.energy;
		if (!t?.configured || !t.sources) return _`<div class="found"><p>${e("onb.scan.energy.none")}</p></div>`;
		let n = [
			[t.sources.grid ?? 0, e("energy.grid")],
			[t.sources.solar ?? 0, e("energy.solar")],
			[t.sources.battery ?? 0, e("energy.battery")],
			[t.devices ?? 0, e("energy.devices")]
		];
		return _`<div class="found">
      <p>${e("onb.scan.energy")}</p>
      <div class="chips">
        ${n.map(([e, t]) => _`<span class="chip read"><ha-icon icon="mdi:eye-outline"></ha-icon>${e} ${t}</span>`)}
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
S([r()], Z.prototype, "step", void 0), S([r({ attribute: !1 })], Z.prototype, "t", void 0), S([r({ attribute: !1 })], Z.prototype, "info", void 0), S([r({ attribute: !1 })], Z.prototype, "hass", void 0), S([r({ attribute: !1 })], Z.prototype, "config", void 0), S([r({ attribute: !1 })], Z.prototype, "discovery", void 0), S([r({ attribute: !1 })], Z.prototype, "checks", void 0), S([r({ type: Boolean })], Z.prototype, "discovering", void 0), S([r({ type: Boolean })], Z.prototype, "discoveryFailed", void 0), x("joe-onboarding", Z);
//#endregion
//#region src/pages/overview.ts
var Jt = class extends n {
	constructor(...e) {
		super(...e), this.prefix = "/energy-joe";
	}
	static {
		this.styles = [l, g`
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
        width: 160px;
        pointer-events: none;
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
          width: 112px;
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
		if (!e) return i;
		let t = !!this.state?.observe?.active, n = !!(this.state?.plan && this.state.plan.kind !== "unavailable"), r = (this.state?.results?.days ?? 0) > 0, a = this.state?.questions ?? [];
		return _`<div class="grid">
      ${a.length ? _`<joe-day-questions class="wide" .hass=${this.hass} .t=${e} .questions=${a}></joe-day-questions>` : i}
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
		return t ? _`<span class="chip ok"><ha-icon icon="mdi:check"></ha-icon>${e("status.running")}</span>` : _`<span class="chip">${e(this.state?.mode === "off" ? "status.paused" : "status.waiting")}</span>`;
	}
	renderNight(e) {
		let t = this.state?.plan;
		if (!t) return _`<section class="card">
        <joe-pose name="relax"></joe-pose>
        <div class="eyebrow"><ha-icon icon="mdi:weather-night"></ha-icon>${e("overview.night")}</div>
        ${w(e("overview.night.empty.title"))} ${C}
        <p class="lead">${e("overview.night.empty.text")}</p>
      </section>`;
		let n = re(e, t), r = ee(e, t, this.hass?.config?.currency), a = t.kind === "charge" || t.kind === "hold" ? _`${y(e.lang, t.target ?? 0, 0)}<small>%</small>` : _`${e(t.kind === "none" ? "plan.big.none" : "plan.big.unavailable")}`;
		return _`<section class="card figure-card" data-tipped>
      <joe-pose name=${h(t)}></joe-pose>
      <div class="head">
        <div class="eyebrow">
          <ha-icon icon="mdi:weather-night"></ha-icon>${e("overview.night")}${t.window ? ` · ${u(e, t)}` : ""}
        </div>
        ${v(e, "plan_target")}
      </div>
      <div class="big">${a}</div>
      ${C}
      <p class="say">${c(e, t)}</p>
      ${n.length ? _`<div class="lines">${n.map((e) => _`<div>${e}</div>`)}</div>` : i}
      ${r ? _`<p class="cost">${r}</p>` : i}
      <div class="bottom">
        <span class="chip ${t.fixed ? "ok" : ""}">
          ${t.fixed ? e("plan.fixed_at", { time: t.created.slice(11, 16) }) : e("plan.preview_at", { time: t.created.slice(11, 16) })}
        </span>
        <a class="btn btn-secondary" data-notip href=${`${this.prefix}/plan`} @click=${(e) => this.open(e, "plan")}
          >${e("overview.night.more")}</a
        >
      </div>
    </section>`;
	}
	renderSim(e) {
		let t = this.state?.results, n = t?.last;
		if (!t || !n) return _`<section class="card">
        <joe-pose name="plan"></joe-pose>
        <div class="eyebrow"><ha-icon icon="mdi:calculator-variant-outline"></ha-icon>${e("overview.sim")}</div>
        ${w(e("overview.sim.empty.title"))} ${C}
        <p class="lead">${e("overview.sim.empty.text")}</p>
      </section>`;
		let r = this.hass?.config?.currency, i = n.window?.end.slice(0, 10) ?? n.date, a = i === _t(this.hass?.config?.time_zone) ? e("overview.sim.last") : e("overview.sim.night", { day: W(e.lang, i, "weekday") }), o = n.saving, s = o > .005 ? "good" : o < -.005 ? "bad" : "", c = s === "good" ? e("overview.sim.saved", {
			value: H(e, o, r),
			day: y(e.lang, Math.max(0, n.day_kwh_without - n.day_kwh), 1),
			night: y(e.lang, Math.max(0, n.night_kwh - n.night_kwh_without), 1)
		}) : s === "bad" ? e("overview.sim.cost", { value: H(e, -o, r) }) : e("overview.sim.same"), l = t.since ?? t.first;
		return _`<section class="card figure-card" data-tipped>
      <joe-pose name=${s === "good" ? "relax" : "inspect"}></joe-pose>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:calculator-variant-outline"></ha-icon>${e("overview.sim")} · ${a}</div>
        ${v(e, "sim_result")}
      </div>
      <div class="big ${s}">${H(e, o, r, !0)}</div>
      ${C}
      <p class="say">${c}</p>
      <p class="cost">
        ${e("overview.sim.total", {
			since: l ? W(e.lang, l) : "–",
			value: H(e, t.saving, r, !0),
			nights: vt(e, t.days)
		})}
      </p>
      <div class="bottom">
        ${n.final || !n.until ? _`<span class="chip">
              ${e("learn.results.split", {
			better: t.better,
			worse: t.worse,
			same: Math.max(0, t.days - t.better - t.worse)
		})}
            </span>` : _`<span class="chip warn">${e("overview.sim.provisional", { time: n.until.slice(11, 16) })}</span>`}
        <a class="btn btn-secondary" data-notip href=${`${this.prefix}/learn`} @click=${(e) => this.open(e, "learn")}
          >${e("overview.sim.more")}</a
        >
      </div>
    </section>`;
	}
	renderNow(e) {
		let t = this.hass, n = this.state?.config;
		if (!t || !n) return _``;
		let r = n.measurements, i = r.solar_power.length ? oe(t, r.solar_power) : null, a = p(t, r.grid_power), o = n.batteries.map((e) => ({
			power: p(t, e.power),
			soc: s(t, e.soc_entity)
		})), c = o.filter((e) => e.power != null), l = c.length ? c.reduce((e, t) => e + (t.power ?? 0), 0) : null, u = p(t, r.home_power), d = u == null && a != null;
		d && (u = (a ?? 0) + (i ?? 0) - (l ?? 0));
		let f = o.map((e) => e.soc).filter((e) => e != null), m = (t) => t == null ? "–" : y(e.lang, Math.abs(t), 2), h = (e, t, n, r, i) => _`<div class="flow ${e}">
        <span class="icon"><ha-icon icon=${t}></ha-icon></span>
        <small>${n}</small>
        <b>${m(r)}<span>kW</span></b>
        <em>${i}</em>
      </div>`, g = (e) => e == null || Math.abs(e) < .05;
		return _`<section class="card wide" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:pulse"></ha-icon>${e("overview.now")}</div>
        ${v(e, "now")}
      </div>
      <div class="now">
        ${h("sun", "mdi:solar-power", e("overview.now.solar"), i, e(i == null ? "overview.now.none" : "overview.now.solar.sub"))}
        ${h("home", "mdi:home-lightning-bolt-outline", e("overview.now.home"), u, e(u == null ? "overview.now.none" : d ? "overview.now.home.calc" : "overview.now.home.sub"))}
        ${h("battery", "mdi:home-battery-outline", g(l) ? e("overview.now.battery") : e(l > 0 ? "overview.now.battery.charge" : "overview.now.battery.discharge"), l, f.length ? f.length === 1 ? e("overview.now.soc", { value: y(e.lang, f[0], 0) }) : e("overview.now.soc_avg", {
			value: y(e.lang, f.reduce((e, t) => e + t, 0) / f.length, 0),
			count: f.length
		}) : n.batteries.length ? e("overview.now.none") : e("overview.now.no_battery"))}
        ${h("net", "mdi:transmission-tower", g(a) ? e("overview.now.grid") : e(a > 0 ? "overview.now.grid.in" : "overview.now.grid.out"), a, a == null ? e("overview.now.none") : g(a) ? e("overview.now.grid.idle") : e(a > 0 ? "overview.now.grid.in.sub" : "overview.now.grid.out.sub"))}
      </div>
    </section>`;
	}
	renderWeek(e) {
		let t = [...this.week ?? []].reverse(), n = this.state?.observe, r = n?.backfill.state === "running" ? e("history.reading") : n?.first_day ? e("overview.week.known", { days: n.day_count ?? 0 }) : e("overview.week.none"), a = [{
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
		return _`<section class="card wide" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:chart-bar"></ha-icon>${e("overview.week")}</div>
        ${v(e, "week")}
      </div>
      <p class="status">${r}</p>
      ${t.length ? _`<joe-chart
              .labels=${o}
              .ticks=${s}
              .series=${a}
              centerTicks
              unit="kWh"
              height="190"
              lang=${e.lang}
              label=${e("overview.week")}
            ></joe-chart>
            <div class="bottom">
              <div class="legend">
                ${a.map((e) => _`<span><i style="background:${e.color}"></i>${e.label}</span>`)}
              </div>
              <a class="btn btn-secondary" data-notip href=${this.historyHref()} @click=${this.openHistory}
                >${e("overview.week.more")}</a
              >
            </div>` : i}
    </section>`;
	}
	historyHref() {
		return `${this.prefix}/history`;
	}
	openHistory(e) {
		this.open(e, "history");
	}
	open(e, t) {
		e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || (e.preventDefault(), this.dispatchEvent(new CustomEvent("joe-navigate", {
			detail: { page: t },
			bubbles: !0,
			composed: !0
		})));
	}
};
S([r({ attribute: !1 })], Jt.prototype, "t", void 0), S([r({ attribute: !1 })], Jt.prototype, "hass", void 0), S([r({ attribute: !1 })], Jt.prototype, "state", void 0), S([r()], Jt.prototype, "prefix", void 0), S([o()], Jt.prototype, "week", void 0), x("joe-overview", Jt);
//#endregion
//#region src/pages/plan.ts
var Yt = 36e5, Xt = class extends n {
	constructor(...e) {
		super(...e), this.refreshing = !1;
	}
	static {
		this.styles = [l, g`
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
		if (!e) return i;
		let t = this.state?.plan;
		if (!t || t.kind === "unavailable" || !t.hours) return this.renderEmpty(e, t);
		let n = re(e, t), r = ee(e, t, this.hass?.config?.currency);
		return _`<div class="wrap">
      <div class="eyebrow"><ha-icon icon="mdi:weather-night"></ha-icon>${e("overview.night")} · ${u(e, t)}</div>
      ${w(e("plan.page.title"))} ${C}
      <div class="top" data-tipped>
        ${this.state?.mode === "simulation" ? _`<span class="pill-sim">${e("mode.simulation")}</span>` : _`<span class="chip ${this.state?.mode === "live" ? "ok" : "learned"}">${e(`mode.${this.state?.mode ?? "off"}`)}</span>`}
        <span class="chip ${t.fixed ? "ok" : ""}">
          ${t.fixed ? e("plan.fixed_at", { time: t.created.slice(11, 16) }) : e("plan.preview_at", { time: t.created.slice(11, 16) })}
        </span>
        <button type="button" class="mini-btn" ?disabled=${this.refreshing || t.fixed} @click=${this.refresh}>
          <ha-icon icon="mdi:refresh"></ha-icon>${e("plan.refresh")}
        </button>
        ${v(e, "plan_refresh")}
      </div>
      <section class="hero" data-tipped>
        <joe-pose name=${h(t)}></joe-pose>
        <div class="big">
          ${t.kind === "none" ? e("plan.big.none") : _`${y(e.lang, t.target ?? 0, 0)}<small>%</small>`}
        </div>
        <p class="say">${c(e, t)} ${v(e, "plan_target")}</p>
        ${n.length ? _`<div class="lines">${n.map((e) => _`<div>${e}</div>`)}</div>` : i}
        ${r ? _`<p class="cost">${r}</p>` : i}
      </section>
      ${this.renderSteer(e, t)} ${this.renderActions(e, t)} ${this.renderEnergy(e, t, t.hours)}
      ${this.renderPrices(e, t, t.hours)} ${this.renderSoc(e, t, t.hours)}
      ${this.renderMath(e, t)}
    </div>`;
	}
	renderSteer(e, t) {
		let n = this.state, r = n?.control;
		if (!n || !r || !["advisory", "live"].includes(n.mode) || !t.window || t.kind === "none") return i;
		let a = t.window.start, o = r.skip === a, s = r.answer?.night === a ? r.answer.yes : null, c = n.config.batteries.filter((e) => e.adapter !== "none" && r.ready[e.id] && r.ready[e.id] !== "ready"), l, u;
		return n.mode === "advisory" && !o ? (l = e(s === !0 ? "plan.steer.answered_yes" : s === !1 ? "plan.steer.answered_no" : "plan.steer.advisory"), u = _`${s === !0 ? i : _`<button type="button" class="btn btn-primary" @click=${() => this.answer(a, !0)}>${e("plan.steer.yes")}</button>`}
      ${s === !1 ? i : _`<button type="button" class="btn btn-secondary" @click=${() => this.answer(a, !1)}>${e("plan.steer.no")}</button>`}`) : (l = e(o ? "plan.steer.skipped" : "plan.steer.live"), u = _`<button type="button" class="btn btn-secondary" @click=${() => this.skip(!o)}>
        ${e(o ? "plan.steer.unskip" : "plan.steer.skip")}
      </button>`), _`<section class="chart-card steer" data-tipped>
      <div class="chart-head">${l} ${v(e, "plan_steer")}</div>
      ${c.length ? _`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon><span>${e("plan.steer.untested", { names: c.map((e) => e.name).join(", ") })}</span>
          </div>` : i}
      <div class="actions">${u}</div>
    </section>`;
	}
	renderActions(e, t) {
		let n = t.actions ?? [];
		if (!n.length) return i;
		let r = this.hass?.config?.currency ?? "EUR", a = (t) => new Intl.NumberFormat(e.lang, {
			style: "currency",
			currency: r
		}).format(t);
		return _`<section class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.actions")} ${v(e, "plan_actions")}</div>
      <dl>
        ${n.map((n) => {
			let r = n.target == null ? "" : y(e.lang, n.target, 0), o = n.run ? n.kind === "target" ? e("plan.actions.target", {
				start: b(n.start),
				end: b(n.end),
				target: r
			}) : e("plan.actions.run", {
				start: b(n.start),
				end: b(n.end)
			}) : e.optional(`devices.action.why.${n.reasons[n.reasons.length - 1] ?? "manual_only"}`, {
				kwh: y(e.lang, t.meta?.tomorrow_kwh ?? 0, 0),
				temperature: y(e.lang, n.temperature ?? 0, 0)
			}) ?? "", s = n.run && n.energy_kwh ? e("plan.actions.energy", {
				kwh: y(e.lang, n.energy_kwh, 1),
				cost: a(n.cost ?? 0)
			}) : "", c = this.state?.config.actions.find((e) => e.id === n.id);
			return _`<dt>${n.name}</dt>
            <dd>
              ${o}${s ? _`<small>${s}</small>` : i}
              ${n.need ? _`<joe-car-need .hass=${this.hass} .t=${e} .action=${n} .roundTrip=${c?.need?.round_trip ?? !0}></joe-car-need>` : i}
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
		let n = t ? c(e, t) : e(this.state?.mode === "off" ? "plan.empty.off" : "plan.empty.waiting");
		return _`<div class="empty">
      <joe-pose name=${t ? h(t) : "plan"}></joe-pose>
      <div>
        ${w(e("plan.title"))} ${C}
        <p class="lead">${n}</p>
      </div>
    </div>`;
	}
	frame(e, t, n) {
		let r = (e) => `${String((Number(e.slice(0, 2)) + 1) % 24).padStart(2, "0")}:00`, i = n.map((e, t) => `${b(e.start)}–${b(n[t + 1]?.start) || r(b(e.start))}`), a = /* @__PURE__ */ new Map();
		n.forEach((t, n) => {
			let r = b(t.start);
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
					if (t >= r && t < r + Yt) return e + (t - r) / Yt;
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
			let n = b(t.sun_takes_over);
			a.push({
				at: o,
				label: e("plan.chart.sun", { time: n }),
				short: `↑${n}`
			});
		}
		return _`<div class="chart-card" data-tipped>
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
        ${i.map((e) => _`<span><i style="background:${e.color}"></i>${e.label}</span>`)}
      </div>
    </div>`;
	}
	renderPrices(e, t, n) {
		if (!n.some((e) => e.price != null)) return i;
		let r = this.frame(e, t, n), a = [{
			label: e("plan.chart.price"),
			kind: "bar",
			values: n.map((e) => e.price == null ? null : Math.round(e.price * 1e3) / 10),
			color: "var(--joe-c-ist)",
			digits: 1
		}], o = (t.charge_slots ?? []).flatMap((t) => {
			let n = r.at(t.start);
			return n == null ? [] : [{
				at: n,
				label: e("plan.chart.charge_at", { time: b(t.start) }),
				short: b(t.start)
			}];
		});
		return _`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.chart.prices")} ${v(e, "chart_plan_prices")}</div>
      <joe-chart
        .labels=${r.labels}
        .ticks=${r.ticks}
        .series=${a}
        .bands=${r.bands}
        .markers=${o}
        unit="ct"
        lang=${e.lang}
        label=${e("plan.chart.prices")}
      ></joe-chart>
      ${t.charge_slots?.length ? _`<p class="slots">${e("plan.slots", { slots: te(t) })}</p>` : i}
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
				label: e("plan.chart.reserve", { value: y(e.lang, i, 0) }),
				kind: "line",
				values: n.map(() => i),
				color: "var(--joe-crit)",
				dashed: !0,
				digits: 0
			}
		], o = [], s = r.at(t.window?.end);
		s != null && t.kind !== "none" && o.push({
			at: s,
			label: e("plan.chart.target", { value: y(e.lang, t.target ?? 0, 0) })
		});
		let c = r.at(t.full_at);
		return c != null && o.push({
			at: c,
			label: e("plan.chart.full", { time: b(t.full_at) }),
			short: `${b(t.full_at)}`
		}), _`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.chart.soc")} ${v(e, "chart_plan_soc")}</div>
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
        ${a.map((e) => _`<span><i class=${e.dashed ? "dash" : ""} style="background:${e.color};color:${e.color}"></i>${e.label}</span>`)}
      </div>
    </div>`;
	}
	renderMath(e, t) {
		let n = (t, n = 1) => t == null ? "–" : `${y(e.lang, t, n)} kWh`, r = (t) => t == null ? "–" : `${y(e.lang, t * 100, 1)} ct`, a = t.window?.start.slice(0, 10) ?? "", o = t.meta?.solar.sources[a] ?? "none", s = t.meta?.tomorrow, c = s?.solar_factor ?? t.meta?.solar_factor ?? 1, l = t.meta?.consumption, u = this.state?.config.persons ?? [], d = [
			[e("plan.math.battery_now"), _`${y(e.lang, t.soc_now ?? 0, 0)} %<small
            >${e("plan.math.battery_now.sub", {
				stored: y(e.lang, (t.soc_now ?? 0) / 100 * (t.capacity_kwh ?? 0), 1),
				capacity: y(e.lang, t.capacity_kwh ?? 0, 1)
			})}</small
          >`],
			[e("plan.math.battery_start"), `${y(e.lang, t.soc_start ?? 0, 0)} %`],
			[e("plan.math.solar"), _`${n(t.solar_kwh)}<small
            >${e(`plan.math.solar.${o}`)}${c === 1 ? "" : ` · ${e(s?.solar_source === "combined" ? "plan.math.solar.combined" : s?.solar_source === "weather" && s.weather ? "plan.math.solar.weather" : "plan.math.solar.factor", {
				value: y(e.lang, c, 2),
				weather: s?.weather ? e(`learn.weather.${s.weather}`) : ""
			})}`}</small
          >`],
			[e("plan.math.home"), _`${n(t.home_kwh)}<small
            >${l?.source === "history" ? e("plan.math.home.history", {
				days: l.days,
				kind: e(t.meta?.workday === !1 ? "plan.math.day_off" : "plan.math.workday")
			}) : e("plan.math.home.default")}</small
          >`],
			...s && (s.temp != null || Object.keys(s.labels).length) ? [[e("plan.math.tomorrow"), _`${[s.temp == null ? "" : `${y(e.lang, s.temp, 0)} °C`, ...Object.entries(s.labels).map(([t, n]) => e("plan.math.tomorrow.person", {
				name: u.find((e) => e.id === t)?.name ?? t,
				label: e(`label.${n}`)
			}))].filter(Boolean).join(" · ")}<small
                  >${s.expected_kwh == null ? e("plan.math.tomorrow.usual") : e("plan.math.tomorrow.scaled", {
				expected: y(e.lang, s.expected_kwh, 1),
				usual: y(e.lang, s.profile_kwh, 1)
			})}</small
                >`]] : [],
			[e("plan.math.target"), _`${y(e.lang, t.target ?? 0, 0)} %<small
            >${e("plan.math.target.sub", {
				optimum: y(e.lang, t.optimum ?? 0, 0),
				buffer: y(e.lang, (t.rules?.buffer ?? 0) * 100, 0)
			})}</small
          >`],
			[e("plan.math.prices"), _`${e("plan.math.prices.value", {
				night: r(t.prices?.night),
				day: r(t.prices?.day),
				feed: r(t.prices?.feed_in)
			})}${t.prices?.assumed ? _`<small>${e("plan.math.prices.assumed")}</small>` : i}`],
			[e("plan.math.rules"), e("plan.math.rules.value", {
				reserve: y(e.lang, t.rules?.reserve ?? 0, 0),
				max: y(e.lang, t.rules?.max_target ?? 100, 0),
				mode: e.optional(`rule.discharge.${t.rules?.discharge_mode}`) ?? ""
			})]
		], f = [...new Set(t.notes ?? [])].map((t) => e.optional(`plan.note.${t}`)).filter(Boolean);
		return _`<div class="chart-card" data-tipped>
      <div class="chart-head">${e("plan.math")} ${v(e, "plan_math")}</div>
      <dl>${d.map(([e, t]) => _`<dt>${e}</dt><dd>${t}</dd>`)}</dl>
      ${f.map((e) => _`<div class="note"><ha-icon icon="mdi:information-outline"></ha-icon><span>${e}</span></div>`)}
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
S([r({ attribute: !1 })], Xt.prototype, "hass", void 0), S([r({ attribute: !1 })], Xt.prototype, "t", void 0), S([r({ attribute: !1 })], Xt.prototype, "state", void 0), S([o()], Xt.prototype, "refreshing", void 0), x("joe-plan-page", Xt);
//#endregion
//#region src/pages/settings.ts
var Zt = [
	"simulation",
	"advisory",
	"live",
	"off"
], Qt = [
	{
		key: "reserve_soc",
		unit: "%",
		min: 0,
		max: 100,
		step: 1
	},
	{
		key: "max_target_soc",
		unit: "%",
		min: 0,
		max: 100,
		step: 1
	},
	{
		key: "evening_min_soc",
		unit: "%",
		min: 0,
		max: 100,
		step: 1,
		optional: !0
	},
	{
		key: "grid_limit_w",
		unit: "kW",
		min: .1,
		max: 1e3,
		step: .1,
		scale: .001,
		optional: !0
	},
	{
		key: "max_night_kwh",
		unit: "kWh",
		min: .1,
		max: 1e3,
		step: .1,
		optional: !0
	},
	{
		key: "buffer_factor",
		unit: "%",
		min: 0,
		max: 300,
		step: 1,
		scale: 100
	},
	{
		key: "plan_offset_min",
		unit: "min",
		min: 0,
		max: 180,
		step: 1,
		integer: !0
	},
	{
		key: "reset_lead_min",
		unit: "min",
		min: 0,
		max: 60,
		step: 1,
		integer: !0
	}
], $t = [{
	key: "max_price",
	unit: "ct/kWh",
	min: 0,
	max: 1e3,
	step: .1,
	scale: 100,
	optional: !0
}, {
	key: "min_saving",
	unit: "ct",
	min: 0,
	max: 500,
	step: 1,
	scale: 100
}], en = {
	key: "balance_days",
	unit: "",
	min: 3,
	max: 90,
	step: 1,
	optional: !0,
	integer: !0
}, tn = [
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
], nn = {
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
}, Q = class extends n {
	constructor(...e) {
		super(...e), this.checks = [], this.pro = !1, this.question = "";
	}
	static {
		this.styles = [l, g`
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
      .unit-input {
        width: 150px;
      }
      select.input,
      .input.time {
        width: auto;
        min-width: 160px;
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
      .row.stacked {
        display: grid;
        justify-content: stretch;
        align-items: stretch;
        gap: 10px;
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
    `];
	}
	render() {
		let e = this.t, t = this.state;
		if (!e || !t) return i;
		let n = t.config;
		return _`<div class="list">
        <section class="group">
          <h2>${e("settings.operation")}</h2>
          <div class="row" data-tipped>
            <div>
              <div class="name"><b>${e("settings.mode")}</b>${v(e, "mode")}</div>
              <small>${e("settings.mode.hint")}</small>
            </div>
            <div class="seg" role="group" aria-label=${e("settings.mode")}>
              ${Zt.map((n) => _`<button
                    type="button"
                    aria-pressed=${String(t.mode === n)}
                    @click=${() => this.emit("joe-set-mode", { mode: n })}
                  >
                    ${e(`mode.${n}`)}
                  </button>`)}
            </div>
          </div>
          ${this.gridFriendlyRows(e, n.rules)}
          <div class="row" data-tipped>
            <div>
              <div class="name"><b>${e("settings.setup")}</b>${v(e, "restart")}</div>
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

        ${this.renderNotify(e)} ${this.renderRouting(e)}

        <section class="group plain">
          <h2>${e("settings.uses")}</h2>
          <p class="intro">${e("settings.uses.intro")}</p>
          <joe-review
            .hass=${this.hass}
            .t=${e}
            .config=${n}
            .discovery=${this.discovery}
            .checks=${this.checks}
            context="settings"
          ></joe-review>
        </section>

        <section class="group">
          <h2>${e("settings.answers")}</h2>
          ${tn.map((t) => this.answerRow(e, t.key, t.tip))}
        </section>

        ${this.renderObserve(e)}

        <section class="group">
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
          ${this.pro ? _`<p class="intro">${e("settings.pro.intro")}</p>
                ${Qt.slice(0, 5).map((t) => this.numberRow(e, n.rules, t))}
                ${$t.map((t) => this.numberRow(e, n.rules, t))} ${this.guardRow(e, n.rules)}
                ${this.numberRow(e, n.rules, en)}
                ${this.priorityRow(e, n.rules)} ${this.dischargeRow(e, n.rules)}
                ${Qt.slice(5).map((t) => this.numberRow(e, n.rules, t))}` : i}
        </section>

        <section class="group">
          <h2>${e("settings.about")}</h2>
          <div class="row"><b>${e("settings.version")}</b><span class="value">${this.info?.version ?? "–"}</span></div>
          <div class="row"><b>${e("settings.ha")}</b><span class="value">${this.info?.ha_version ?? "–"}</span></div>
          <div class="row"><b>${e("settings.energy")}</b><span class="value">${this.energyText(e)}</span></div>
        </section>
      </div>
      ${this.question ? this.renderQuestionSheet(e) : i}`;
	}
	renderRouting(e) {
		let t = this.state.config.routing, n = this.info?.routing, r = t.service === "google" ? `google:${t.google_entry ?? ""}` : t.service ?? "", a = (e) => {
			e.startsWith("google:") ? j(this, { routing: {
				service: "google",
				google_entry: e.slice(7) || null
			} }) : j(this, { routing: {
				service: e || null,
				google_entry: null
			} });
		}, o = (n) => _`<div class="row" data-tipped>
      <div>
        <div class="name"><label for="routing-${n}"><b>${e(`settings.routing.${n}`)}</b></label>${v(e, "routing_osm")}</div>
        <small>${e(`settings.routing.${n}.hint`)}</small>
      </div>
      <input
        id="routing-${n}"
        class="input"
        type="url"
        .value=${t[n]}
        @change=${(e) => {
			let t = e.target.value.trim();
			t.startsWith("http") && j(this, { routing: { [n]: t } });
		}}
      />
    </div>`;
		return _`<section class="group">
      <h2>${e("settings.routing")}</h2>
      <p class="intro">${e("settings.routing.intro")}</p>
      <div class="row" data-tipped>
        <div>
          <div class="name"><label for="routing-service"><b>${e("settings.routing.service")}</b></label>${v(e, "routing_service")}</div>
          <small>${e("settings.routing.service.hint")}</small>
        </div>
        <select id="routing-service" class="input" @change=${(e) => a(e.target.value)}>
          <option value="" ?selected=${r === ""}>${e("settings.routing.none")}</option>
          ${n?.waze === !1 ? i : _`<option value="waze" ?selected=${r === "waze"}>${e("settings.routing.waze")}</option>`}
          ${(n?.google ?? []).map((t) => _`<option value=${`google:${t.entry_id}`} ?selected=${r === `google:${t.entry_id}`}>
                ${e("settings.routing.google", { name: t.title })}
              </option>`)}
          <option value="osm" ?selected=${r === "osm"}>${e("settings.routing.osm")}</option>
        </select>
      </div>
      ${t.service === "osm" ? _`${o("geocoder_url")} ${o("router_url")}` : i}
    </section>`;
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
		})), a = n.service?.replace(/^notify\./, ""), o = !!a && this.notifyTargets !== void 0 && !r.some((e) => e.service === a), s = (t, r) => _`<div class="row" data-tipped>
        <div>
          <div class="name"><b id="notify-${t}">${e(`settings.notify.${t}`)}</b>${v(e, r)}</div>
          <small>${e(`settings.notify.${t}.hint`)}</small>
        </div>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(n[t])}
          aria-labelledby="notify-${t}"
          ?disabled=${!n.service}
          @click=${() => j(this, { notify: { [t]: !n[t] } })}
        ></button>
      </div>`;
		return _`<section class="group">
      <h2>${e("settings.notify")}</h2>
      <p class="intro">${e("settings.notify.intro")}</p>
      <div class="row" data-tipped>
        <div>
          <div class="name"><label for="notify-service"><b>${e("settings.notify.service")}</b></label>${v(e, "notify_service")}</div>
          <small>${e("settings.notify.service.hint")}</small>
        </div>
        <select
          id="notify-service"
          class="input"
          @change=${(e) => {
			let t = e.target.value;
			j(this, { notify: { service: t ? `notify.${t}` : null } });
		}}
        >
          <option value="" ?selected=${!n.service}>${e("settings.notify.none")}</option>
          ${r.map((e) => _`<option value=${e.service} ?selected=${a === e.service}>${e.name}</option>`)}
          ${o ? _`<option value=${a} selected>${e("settings.notify.gone", { name: a ?? "" })}</option>` : i}
        </select>
      </div>
      ${s("ask", "notify_ask")} ${s("problems", "notify_problems")} ${s("morning", "notify_morning")}
      <div class="row" data-tipped>
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
			/^\d{2}:\d{2}$/.test(t) && j(this, { rules: { ask_time: t } });
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
		return c?.state === "running" ? s.push(e("history.reading")) : c?.state === "unavailable" ? s.push(e("settings.observe.no_recorder")) : c?.state === "failed" && s.push(e("settings.observe.failed")), _`<section class="group">
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
	answerRow(e, t, n) {
		let r = this.state.config, a = r.answers[t], o = Array.isArray(a) ? a : typeof a == "string" ? [a] : [], s = a === "unknown" ? e("sum.unknown") : o.length ? o.map((n) => nn[t][n] ? e(nn[t][n]) : n).join(", ") : e("sum.open");
		return _`<div class="row" data-tipped>
      <div>
        <div class="name"><b>${e(`settings.answer.${t}`)}</b>${v(e, n)}</div>
        <small>${s}</small>
      </div>
      <div class="control">
        ${a == null ? i : E(e, O(r, `answers.${t}`))}
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
		return _`<joe-sheet label=${e("settings.answers")} closeLabel=${e("common.close")} @joe-close=${t}>
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
	numberRow(e, t, n) {
		let r = this.state.config, a = t[n.key], o = n.scale ?? 1, s = a == null ? "" : String(Math.round(a * o * 100) / 100), c = this.info?.defaults?.rules[n.key], l = O(r, `rules.${n.key}`), u = l?.source === "user";
		return _`<div class="row" data-tipped>
      <div>
        <div class="name"><b>${e(`rule.${n.key}`)}</b>${v(e, `r_${n.key}`)}</div>
        <small>${e(`rule.${n.key}.hint`)}</small>
      </div>
      <div class="control">
        ${E(e, l)}
        <span class="unit-input">
          <input
            class="input"
            type="number"
            inputmode="decimal"
            min=${n.min}
            max=${n.max}
            step=${n.step}
            aria-label=${e(`rule.${n.key}`)}
            placeholder=${n.optional ? e("rule.off") : ""}
            .value=${s}
            @change=${(e) => this.setNumber(n, e.target)}
          />
          <span class="unit">${n.unit || e(`rule.${n.key}.unit`)}</span>
        </span>
        ${u && c !== void 0 ? _`<button
              type="button"
              class="mini-btn quiet"
              @click=${() => j(this, { rules: { [n.key]: c } }, "default")}
            >
              <ha-icon icon="mdi:restore"></ha-icon>${e("rule.reset")}
            </button>` : i}
      </div>
    </div>`;
	}
	setNumber(e, t) {
		let n = t.value.trim(), r = e.scale ?? 1;
		if (n === "") {
			e.optional && j(this, { rules: { [e.key]: null } });
			return;
		}
		let i = Number.parseFloat(n);
		if (!Number.isFinite(i) || i < e.min || i > e.max) {
			t.reportValidity();
			return;
		}
		let a = e.integer ? Math.round(i) : Math.round(i / r * 1e4) / 1e4;
		j(this, { rules: { [e.key]: a } });
	}
	gridFriendlyRows(e, t) {
		let n = this.state.config;
		return _`<div class="row" data-tipped>
        <div>
          <div class="name"><b id="grid-friendly">${e("rule.grid_friendly")}</b>${v(e, "r_grid_friendly")}</div>
          <small>${e("rule.grid_friendly.hint")}</small>
        </div>
        <div class="control">
          ${E(e, O(n, "rules.grid_friendly"))}
          <button
            type="button"
            class="switch"
            role="switch"
            aria-checked=${String(t.grid_friendly)}
            aria-labelledby="grid-friendly"
            @click=${() => j(this, { rules: { grid_friendly: !t.grid_friendly } })}
          ></button>
        </div>
      </div>
      ${t.grid_friendly ? _`<div class="row" data-tipped>
            <div>
              <div class="name"><b>${e("rule.grid_first")}</b>${v(e, "r_grid_first")}</div>
              <small>${e(t.grid_first ? "rule.grid_first.grid.hint" : "rule.grid_first.saving.hint")}</small>
            </div>
            <div class="seg" role="group" aria-label=${e("rule.grid_first")}>
              ${[!1, !0].map((n) => _`<button
                    type="button"
                    aria-pressed=${String(t.grid_first === n)}
                    @click=${() => j(this, { rules: { grid_first: n } })}
                  >
                    ${e(n ? "rule.grid_first.grid" : "rule.grid_first.saving")}
                  </button>`)}
            </div>
          </div>` : i}`;
	}
	guardRow(e, t) {
		let n = this.state.config, r = t.grid_limit_w;
		return _`<div class="row" data-tipped>
      <div>
        <div class="name"><b id="guard-grid">${e("rule.guard_grid")}</b>${v(e, "r_guard_grid")}</div>
        <small>${e(r ? "rule.guard_grid.hint" : "rule.guard_grid.no_limit")}</small>
      </div>
      <div class="control">
        ${E(e, O(n, "rules.guard_grid"))}
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(t.guard_grid)}
          aria-labelledby="guard-grid"
          ?disabled=${!r}
          @click=${() => j(this, { rules: { guard_grid: !t.guard_grid } })}
        ></button>
      </div>
    </div>`;
	}
	priorityRow(e, t) {
		let n = this.state.config, r = t.priority, i = (e, t) => {
			let n = [...r];
			[n[e], n[e + t]] = [n[e + t], n[e]], j(this, { rules: { priority: n } });
		}, a = (e) => _`<svg
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
		return _`<div class="row" data-tipped>
      <div>
        <div class="name"><b>${e("rule.priority")}</b>${v(e, "r_priority")}</div>
        <small>${e("rule.priority.hint")}</small>
      </div>
      <div class="control">
        ${E(e, O(n, "rules.priority"))}
        <div class="order">
          ${r.map((t, n) => _`<div>
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
	dischargeRow(e, t) {
		let n = this.state.config;
		return _`<div class="row stacked" data-tipped>
      <div>
        <div class="name">
          <b>${e("rule.discharge_in_window")}</b>${v(e, "r_discharge_in_window")}
          ${E(e, O(n, "rules.discharge_in_window"))}
        </div>
        <small>${e("rule.discharge_in_window.hint")}</small>
      </div>
      <div>
        <joe-choice
          compact
          label=${e("rule.discharge_in_window")}
          .options=${[
			"until_target",
			"block",
			"free"
		].map((t) => ({
			value: t,
			label: e(`rule.discharge.${t}`)
		}))}
          .value=${[t.discharge_in_window]}
          @joe-choice=${(e) => {
			e.detail.value[0] && j(this, { rules: { discharge_in_window: e.detail.value[0] } });
		}}
        ></joe-choice>
      </div>
    </div>`;
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
S([r({ attribute: !1 })], Q.prototype, "t", void 0), S([r({ attribute: !1 })], Q.prototype, "hass", void 0), S([r({ attribute: !1 })], Q.prototype, "state", void 0), S([r({ attribute: !1 })], Q.prototype, "info", void 0), S([r({ attribute: !1 })], Q.prototype, "discovery", void 0), S([r({ attribute: !1 })], Q.prototype, "checks", void 0), S([o()], Q.prototype, "pro", void 0), S([o()], Q.prototype, "notifyTargets", void 0), S([o()], Q.prototype, "question", void 0), x("joe-settings", Q);
//#endregion
//#region src/energy-joe-panel.ts
var rn = [
	"simulation",
	"advisory",
	"live",
	"off"
], an = {
	simulation: "mdi:pause",
	advisory: "mdi:comment-question-outline",
	live: "mdi:play",
	off: "mdi:power"
}, on = rn, $ = class extends n {
	constructor() {
		super(), this.narrow = !1, this.failed = !1, this.modeDialog = !1, this.notice = "", this.discovering = !1, this.discoveryFailed = !1, this.checks = [], this.infoRequested = !1, this.adopted = !1, this.addEventListener("joe-config", (e) => this.onConfig(e)), this.addEventListener("joe-pick", (e) => {
			this.picker = e.detail;
		}), this.addEventListener("joe-edit", (e) => {
			this.editor = e.detail;
		});
	}
	get t() {
		return t(this.hass?.language);
	}
	get page() {
		let e = (this.route?.path ?? "").split("/")[1] ?? "";
		return $e.includes(e) ? e : "overview";
	}
	connectedCallback() {
		super.connectedCallback(), ft(), this.subscribe();
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.unsubscribe?.then((e) => e()).catch(() => void 0), this.unsubscribe = void 0;
	}
	willUpdate(e) {
		e.has("hass") && this.hass && (this.setAttribute("theme", this.hass.themes?.darkMode ? "dark" : "light"), this.subscribe(), this.infoRequested || (this.infoRequested = !0, this.hass.callWS({ type: "energy_joe/info" }).then((e) => {
			this.info = e;
		}).catch(() => void 0)));
	}
	updated() {
		let e = this.joe;
		!e || this.discovering || this.discoveryFailed || (!e.onboarding.completed && e.onboarding.step === "scan" && !this.adopted ? this.scan() : !this.discovery && (e.onboarding.completed ? ["settings", "devices"].includes(this.page) : e.onboarding.step !== "welcome") && this.look());
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
		return this.refreshChecks(), !0;
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
		if (this.failed) return _`<main><joe-empty-state pose="puzzled" heading=${e("error.title")} text=${e("error.text")}></joe-empty-state></main>`;
		if (!this.joe) return _`<div class="loading">${e("loading")}</div>`;
		let t = !this.joe.onboarding.completed;
		return _`
      <header>
        ${this.joe.mode === "simulation" ? _`<div class="simband" aria-hidden="true"></div>` : i}
        <div class="bar">
          ${this.narrow ? _`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : i}
          <div class="brand">
            <img class="light" src=${le("joe-head.webp")} alt="" width="36" height="36" />
            <img class="dark" src=${le("joe-head-dark.webp")} alt="" width="36" height="36" />
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
      ${this.notice ? _`<div class="notice" role="alert">${this.notice}</div>` : i}
      <main
        @joe-onboarding=${this.onOnboarding}
        @joe-rediscover=${() => this.scan()}
        @joe-set-mode=${(e) => this.setMode(e.detail.mode)}
        @joe-navigate=${(e) => this.go(e.detail.page)}
      >
        ${t ? _`<joe-onboarding
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
      ${this.modeDialog ? this.renderModeDialog(e) : i} ${this.editor ? this.renderEditor(e) : i}
      ${this.picker ? this.renderPicker(e) : i}
    `;
	}
	renderTabs(e) {
		return _`<nav class="tabs" aria-label=${e("nav.label")}>
      ${$e.map((t) => _`<a
            href=${this.href(t)}
            class=${t === this.page ? "on" : ""}
            aria-current=${t === this.page ? "page" : "false"}
            @click=${(e) => this.navigate(e, t)}
            >${e(`tab.${t}`)}</a
          >`)}
    </nav>`;
	}
	renderSteps(e) {
		let t = Ke.indexOf(this.joe?.onboarding.step ?? "welcome");
		return _`<ol class="steps" aria-label=${e("steps.label")}>
      ${Ke.map((n, r) => _`<li class=${r < t ? "done" : r === t ? "on" : ""} aria-current=${r === t ? "step" : "false"}>
            ${r + 1} ${e(`step.${n}`)}
          </li>`)}
    </ol>`;
	}
	renderPage(e) {
		let t = this.page;
		return t === "overview" ? _`<joe-overview
        .t=${e}
        .hass=${this.hass}
        .state=${this.joe}
        prefix=${this.route?.prefix ?? "/energy-joe"}
      ></joe-overview>` : t === "history" ? _`<joe-history .t=${e} .hass=${this.hass} .state=${this.joe}></joe-history>` : t === "plan" ? _`<joe-plan-page .t=${e} .hass=${this.hass} .state=${this.joe}></joe-plan-page>` : t === "learn" ? _`<joe-learn-page .t=${e} .hass=${this.hass} .state=${this.joe}></joe-learn-page>` : t === "devices" ? _`<joe-devices-page
        .t=${e}
        .hass=${this.hass}
        .state=${this.joe}
        .discovery=${this.discovery}
        .info=${this.info}
      ></joe-devices-page>` : t === "climate" ? _`<joe-climate-page .t=${e} .hass=${this.hass} .state=${this.joe}></joe-climate-page>` : t === "settings" ? _`<joe-settings
        .t=${e}
        .hass=${this.hass}
        .state=${this.joe}
        .info=${this.info}
        .discovery=${this.discovery}
        .checks=${this.checks}
      ></joe-settings>` : _``;
	}
	renderModeDialog(e) {
		let t = this.joe?.mode ?? "simulation";
		return _`<div class="scrim" @click=${this.closeDialog}>
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
          <div id="mode-title">${w(e("mode.dialog.title"), "h2", v(e, "mode"))}</div>
          ${C}
          ${this.renderReadiness(e)}
          <div class="modes" role="group" aria-labelledby="mode-title">
            ${rn.map((n) => {
			let r = on.includes(n);
			return _`<button
                type="button"
                class="mode ${n}"
                aria-pressed=${String(n === t)}
                ?disabled=${!r}
                @click=${() => this.chooseMode(n)}
              >
                <span class="knob"><ha-icon icon=${an[n]}></ha-icon></span>
                <span class="label">
                  <b>${e(`mode.${n}`)}</b>
                  <small>${e(`mode.${n}.desc`)}</small>
                </span>
                ${n === t ? _`<span class="chip ok"><ha-icon icon="mdi:check"></ha-icon>${e("mode.current")}</span>` : r ? i : _`<span class="chip soon">${e("mode.soon")}</span>`}
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
		if (!r.length) return i;
		let a = r.filter((e) => n[e.id] !== "ready");
		if (!a.length) return i;
		let o = a.length === r.length ? e("mode.none_tested") : e("mode.untested", { names: a.map((e) => e.name).join(", ") });
		return _`<div class="note warn readiness"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${o}</span></div>`;
	}
	renderEditor(e) {
		let t = this.editor, n = this.joe?.config, r = () => {
			this.editor = void 0;
		}, i = _``, a = "", o = !1;
		switch (t?.editor) {
			case "battery":
				a = e("edit.battery.label"), i = _`<joe-battery-editor
          .hass=${this.hass}
          .t=${e}
          .config=${n}
          .discovery=${this.discovery}
          .info=${this.info}
          batteryId=${t.id ?? ""}
        ></joe-battery-editor>`;
				break;
			case "tariff":
				a = e("edit.tariff.label"), i = _`<joe-tariff-editor
          .hass=${this.hass}
          .t=${e}
          .config=${n}
          .discovery=${this.discovery}
        ></joe-tariff-editor>`;
				break;
			case "household":
				a = e("edit.household.label"), i = _`<div class="sheet-title">${w(e("edit.household.title"), "h2", v(e, "q_household"))}</div>
          <joe-household .hass=${this.hass} .t=${e} .config=${n} .discovery=${this.discovery}></joe-household>
          <div class="actions">
            <button type="button" class="btn btn-secondary" data-notip @click=${r}>${e("mode.close")}</button>
          </div>`;
				break;
			case "action":
				a = e("action.label"), i = _`<joe-action-editor
          .hass=${this.hass}
          .mailboxes=${this.joe?.mailbox}
          .accounts=${this.joe?.accounts}
          .apps=${this.joe?.apps}
          .t=${e}
          .config=${n}
          .discovery=${this.discovery}
          actionId=${t.id ?? ""}
        ></joe-action-editor>`;
				break;
			case "consumers": a = e("edit.consumers.label"), o = !0, i = _`<div class="sheet-title">${w(e("edit.consumers.title"))}</div>
          <joe-consumers .hass=${this.hass} .t=${e} .config=${n}></joe-consumers>
          <div class="actions">
            <button type="button" class="btn btn-secondary" data-notip @click=${r}>${e("mode.close")}</button>
          </div>`;
		}
		return _`<joe-sheet label=${a} closeLabel=${e("common.close")} ?wide=${o} @joe-close=${r}>
      ${i}
    </joe-sheet>`;
	}
	renderPicker(e) {
		let t = this.picker, n = (e) => {
			t?.resolve(e), this.picker = void 0;
		};
		return _`<joe-sheet
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
			}), e.detail.completed && this.go("overview");
		} catch {
			this.showNotice(this.t("error.action"));
		}
	}
	showNotice(e) {
		this.notice = e, window.setTimeout(() => {
			this.notice = "";
		}, 5e3);
	}
	href(e) {
		let t = this.route?.prefix ?? "/energy-joe";
		return e === "overview" ? t : `${t}/${e}`;
	}
	navigate(e, t) {
		e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || (e.preventDefault(), this.go(t));
	}
	go(e) {
		history.pushState(null, "", this.href(e)), window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: !1 } }));
	}
	static {
		this.styles = [
			ie,
			l,
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
        gap: 4px;
        flex: 1;
        min-width: 0;
        overflow-x: auto;
        scrollbar-width: none;
      }
      .tabs a {
        position: relative;
        isolation: isolate;
        padding: 9px 14px;
        border-radius: 7px;
        font-weight: 600;
        font-size: 15px;
        color: var(--joe-ink-2);
        text-decoration: none;
        white-space: nowrap;
        transition: color 0.12s, background 0.12s;
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
    `
		];
	}
};
S([r({ attribute: !1 })], $.prototype, "hass", void 0), S([r({
	type: Boolean,
	reflect: !0
})], $.prototype, "narrow", void 0), S([r({ attribute: !1 })], $.prototype, "route", void 0), S([o()], $.prototype, "joe", void 0), S([o()], $.prototype, "info", void 0), S([o()], $.prototype, "failed", void 0), S([o()], $.prototype, "modeDialog", void 0), S([o()], $.prototype, "notice", void 0), S([o()], $.prototype, "discovery", void 0), S([o()], $.prototype, "discovering", void 0), S([o()], $.prototype, "discoveryFailed", void 0), S([o()], $.prototype, "checks", void 0), S([o()], $.prototype, "picker", void 0), S([o()], $.prototype, "editor", void 0), x("energy-joe-panel", $);
//#endregion
export { $ as EnergyJoePanel };
