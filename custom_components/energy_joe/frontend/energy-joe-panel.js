import { A as e, C as t, D as n, E as r, M as i, N as a, O as o, S as s, T as c, _ as l, a as u, b as d, c as f, d as p, f as m, g as h, h as g, i as _, j as v, k as ee, l as y, m as b, n as te, o as ne, p as re, r as ie, s as x, t as ae, u as oe, v as se, w as ce, x as S, y as C } from "./tokens-PFleOrxX.js";
//#region src/assets.ts
var le = import.meta.url.replace(/[^/]*$/, ""), ue = (e) => `${le}${e}`, w = e`<svg
  class="swoosh"
  viewBox="0 0 300 16"
  preserveAspectRatio="none"
  aria-hidden="true"
>
  <path d="M2 13 C 70 5, 190 1, 298 3 L 298 6 C 190 5, 80 9, 4 15 Z" fill="currentColor" />
</svg>`;
function T(t, n = "h2", r) {
	let i = s(t), a = i.length - 1, o = i.map((t, n) => n === a && i.length > 1 ? e`<span class="hl">${t}</span>` : t.endsWith("!") ? e`${t}<br />` : e`${t}`), c = r ? e`<span class="title-tip">${r}</span>` : "";
	return n === "h1" ? e`<h1 class="display">${o}${c}</h1>` : e`<h2 class="display">${o}${c}</h2>`;
}
function E(t, n) {
	let r = n >= .85 ? 4 : n >= .65 ? 3 : n >= .45 ? 2 : 1, i = t(`conf.${r}`);
	return e`<span class="conf" role="img" aria-label=${i} title=${i}>
    ${[
		1,
		2,
		3,
		4
	].map((t) => e`<i class=${t <= r ? "on" : ""}></i>`)}
  </span>`;
}
var de = {
	read: "mdi:eye-outline",
	learned: "mdi:auto-fix",
	user: "mdi:account-edit-outline",
	default: "mdi:tune-variant"
};
function D(t, n) {
	let r = n?.source ?? "default";
	return e`<span class="chip ${r}"
    ><ha-icon icon=${de[r]}></ha-icon>${t(`source.${r}`)}</span
  >`;
}
function fe(e, t) {
	let n = {};
	for (let [e, r] of Object.entries(t)) (typeof r == "string" || typeof r == "number") && (n[e] = r);
	return e.optional(`reason.${t.code}`, n) ?? t.code;
}
function pe(e) {
	history.pushState(null, "", e), window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: !1 } }));
}
function me(t, n, r) {
	if (!t) return e`<span title=${r ?? ""}>${n}</span>`;
	let i = `/config/devices/device/${t}`;
	return e`<a
    class="ha-link"
    href=${i}
    title=${r ?? ""}
    @click=${(e) => {
		e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0 || (e.preventDefault(), pe(i));
	}}
    >${n}</a
  >`;
}
//#endregion
//#region src/components/pose.ts
var he = /* @__PURE__ */ new Set(["welcome"]), ge = /* @__PURE__ */ new Set([
	"night-charge",
	"sleep",
	"learn"
]), _e = "thumbs", ve = class extends n {
	constructor(...e) {
		super(...e), this.name = "", this.alt = "";
	}
	static {
		this.styles = a`
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
		let t = ge.has(this.name) ? "scene" : "";
		if (this.name === _e) return e`<img class="light" src=${ue("logo.webp")} alt=${this.alt} decoding="async" /><img
          class="dark"
          src=${ue("logo-dark.webp")}
          alt=${this.alt}
          decoding="async"
        />`;
		let n = ue(`poses/${this.name}.webp`);
		return he.has(this.name) ? e`<img class="light" src=${n} alt=${this.alt} decoding="async" /><img
        class="dark"
        src=${ue(`poses/${this.name}-dark.webp`)}
        alt=${this.alt}
       
        decoding="async"
      />` : e`<img class=${t} src=${n} alt=${this.alt} decoding="async" />`;
	}
};
C([r()], ve.prototype, "name", void 0), C([r()], ve.prototype, "alt", void 0), S("joe-pose", ve);
//#endregion
//#region src/components/empty-state.ts
var ye = class extends n {
	constructor(...e) {
		super(...e), this.pose = "", this.heading = "", this.text = "", this.note = "";
	}
	static {
		this.styles = [d, a`
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
		return e`<div class="wrap">
      <joe-pose name=${this.pose}></joe-pose>
      <div>
        ${T(this.heading)} ${w}
        <p class="lead">${this.text}</p>
        ${this.note ? e`<div class="note"><span class="chip soon">${this.note}</span></div>` : o}
        <slot></slot>
      </div>
    </div>`;
	}
};
C([r()], ye.prototype, "pose", void 0), C([r()], ye.prototype, "heading", void 0), C([r()], ye.prototype, "text", void 0), C([r()], ye.prototype, "note", void 0), S("joe-empty-state", ye);
//#endregion
//#region src/components/entity-picker.ts
var be = 60, O = class extends n {
	constructor(...e) {
		super(...e), this.selected = [], this.invert = !1, this.query = "", this.showAll = !1, this.limit = be;
	}
	static {
		this.styles = [d, a`
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
		e.has("request") && this.request && (this.selected = [...this.request.selected], this.invert = this.request.measurement?.invert ?? !1, this.query = "", this.showAll = !1, this.limit = be);
	}
	render() {
		let { hass: t, t: n, request: r } = this;
		if (!t || !n || !r) return o;
		let i = this.candidates(t, r), a = i.slice(0, this.limit), s = this.query ? [] : (r.suggestions ?? []).filter((e) => t.states[e.entity_id]);
		return e`<div data-tipped>
      <div class="sheet-title">${T(r.heading, "h2", y(n, r.tip))}</div>
      <input
        class="input search"
        type="search"
        .value=${this.query}
        placeholder=${n("pick.search")}
        aria-label=${n("pick.search")}
        @input=${(e) => {
			this.query = e.target.value, this.limit = be;
		}}
      />
      ${s.length ? e`<div class="group-label">${n("pick.suggested")}</div>
            <ul>
              ${s.map((e) => this.renderRow(t, n, r, e.entity_id, e))}
            </ul>` : o}
      <div class="group-label">${n(this.showAll ? "pick.all" : "pick.fitting")} · ${i.length}</div>
      ${i.length ? e`<ul>
            ${a.map((e) => this.renderRow(t, n, r, e))}
          </ul>` : e`<p class="empty">${n("pick.empty")}</p>`}
      ${i.length > a.length ? e`<button type="button" class="mini-btn more" data-notip @click=${() => this.limit += be}>
            ${n("pick.more", { count: i.length - a.length })}
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
			this.showAll = !this.showAll, this.limit = be;
		}}
        ></button>
        <label id="all-label" for="all">${n("pick.show_all")}</label>
        ${y(n, "pick_all")}
      </div>
      ${r.measurement ? this.renderInvert(t, n, r) : o}
      <div class="sticky">
        <div class="actions">
          <button
            type="button"
            class="btn btn-primary"
            ?disabled=${!r.multiple && !this.selected.length}
            @click=${this.apply}
          >
            ${n("pick.apply")}
          </button>
          <button type="button" class="btn btn-ghost" data-notip @click=${this.cancel}>${n("common.cancel")}</button>
        </div>
      </div>
    </div>`;
	}
	candidates(e, t) {
		let n = this.query.toLowerCase().split(/\s+/).filter(Boolean), r = new Set(t.exclude ?? []), i = [];
		for (let [a, o] of Object.entries(e.states)) {
			if (r.has(a) || !this.showAll && (!re(o, t.filter) || e.entities?.[a]?.hidden)) continue;
			let s = p(e, a);
			if (n.length) {
				let t = `${s} ${a} ${m(e, a)}`.toLowerCase();
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
		let s = this.selected.includes(i), c = m(t, i), l = a?.reasons?.[0];
		return e`<li>
      <button type="button" class="row" aria-pressed=${String(s)} @click=${() => this.toggle(i)}>
        <span class="mark ${r.multiple ? "box" : ""}" aria-hidden="true">
          ${s ? e`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>` : o}
        </span>
        <span class="txt">
          <b>${p(t, i)}</b>
          <small>${c ? `${c} · ` : ""}${i}</small>
          ${l ? e`<small class="why">${fe(n, l)}</small>` : o}
        </span>
        <span class="end">
          <span class="val">${g(t, i, n.lang)}</span>
          ${a?.confidence == null ? o : E(n, a.confidence)}
        </span>
      </button>
    </li>`;
	}
	renderInvert(t, n, r) {
		let i = r.measurement?.role ?? "grid", a = this.selected[0], s = a ? h(t, {
			entity_id: a,
			invert: this.invert,
			minus_entity_id: null
		}) : null, c = "";
		if (s !== null) {
			let e = b(n.lang, Math.abs(s), 2);
			c = i === "grid" ? n(s >= 0 ? "pick.preview.import" : "pick.preview.export", { value: e }) : i === "battery" ? n(s >= 0 ? "pick.preview.charge" : "pick.preview.discharge", { value: e }) : n(s >= -.05 ? `pick.preview.${i}` : "pick.preview.negative", { value: b(n.lang, s, 2) });
		}
		return e`<div class="line">
        <button
          type="button"
          id="invert"
          class="switch"
          role="switch"
          aria-checked=${String(this.invert)}
          aria-labelledby="invert-label"
          @click=${() => this.invert = !this.invert}
        ></button>
        <label id="invert-label" for="invert">${n("pick.invert")}</label>
        ${y(n, i === "battery" ? "pick_invert_battery" : "pick_invert")}
      </div>
      ${c ? e`<div class="note preview"><ha-icon icon="mdi:eye-outline"></ha-icon><span>${c}</span></div>` : o}`;
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
C([r({ attribute: !1 })], O.prototype, "hass", void 0), C([r({ attribute: !1 })], O.prototype, "t", void 0), C([r({ attribute: !1 })], O.prototype, "request", void 0), C([c()], O.prototype, "selected", void 0), C([c()], O.prototype, "invert", void 0), C([c()], O.prototype, "query", void 0), C([c()], O.prototype, "showAll", void 0), C([c()], O.prototype, "limit", void 0), S("joe-entity-picker", O);
//#endregion
//#region src/components/sheet.ts
var xe = class extends n {
	constructor(...e) {
		super(...e), this.label = "", this.closeLabel = "", this.wide = !1, this.onScrim = (e) => {
			e.composedPath()[0] === this && this.close();
		};
	}
	static {
		this.styles = a`
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
		return e`<div
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
C([r()], xe.prototype, "label", void 0), C([r()], xe.prototype, "closeLabel", void 0), C([r({
	type: Boolean,
	reflect: !0
})], xe.prototype, "wide", void 0), C([ce(".panel")], xe.prototype, "panel", void 0), S("joe-sheet", xe);
//#endregion
//#region src/components/sim-switch.ts
var Se = {
	simulation: "mdi:pause",
	advisory: "mdi:comment-question-outline",
	live: "mdi:play",
	off: "mdi:power"
}, Ce = class extends n {
	constructor(...e) {
		super(...e), this.mode = "simulation", this.compact = !1, this.running = !1;
	}
	static {
		this.styles = a`
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
		let t = this.t;
		return t ? e`<button
      type="button"
      class="${this.mode}${this.running ? " running" : ""}"
      aria-label=${t("mode.switch.label")}
      @click=${this.toggle}
    >
      <span class="knob"><ha-icon icon=${Se[this.mode]}></ha-icon></span>
      <span>
        <b>${t(`mode.${this.mode}`)}</b>
        ${this.compact ? o : e`<small>${t(`mode.${this.mode}.sub`)}</small>`}
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
C([r()], Ce.prototype, "mode", void 0), C([r({ type: Boolean })], Ce.prototype, "compact", void 0), C([r({ type: Boolean })], Ce.prototype, "running", void 0), C([r({ attribute: !1 })], Ce.prototype, "t", void 0), S("joe-sim-switch", Ce);
//#endregion
//#region src/config.ts
var we = /\[[^\]]*\]|[^.[]+/g;
function Te(e) {
	let t = [], n = "";
	for (let r of e.match(we) ?? []) n = !n || r.startsWith("[") ? n + r : `${n}.${r}`, t.push(n);
	return t.reverse();
}
function k(e, t) {
	for (let n of Te(t)) {
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
function Ee(e, t = []) {
	let n = /* @__PURE__ */ new Set(), r = [];
	for (let i of [...e, ...t.map((e) => ({ entity_id: e.entity_id }))]) n.has(i.entity_id) || (n.add(i.entity_id), r.push(i));
	return r;
}
function De(e) {
	return {
		entity_id: e.entity.entity_id,
		confidence: e.confidence,
		reasons: e.reasons
	};
}
//#endregion
//#region src/components/calendar-flow.ts
var Oe = class extends n {
	constructor(...e) {
		super(...e), this.variant = "calendar", this.address = "", this.calendar = "";
	}
	static {
		this.styles = a`
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
		let t = this.t;
		return t ? e`<ol aria-label=${t(`flow.${this.variant}.title`)}>
      ${this.steps(t).map((t, n) => e`<li class=${t.joe ? "joe" : ""}>
          <span class="badge" aria-hidden="true">
            <ha-icon icon=${t.icon}></ha-icon>
            <span class="number">${n + 1}</span>
          </span>
          <span .innerHTML=${this.bold(t.text)}></span>
        </li>`)}
    </ol>` : o;
	}
	bold(e) {
		return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
	}
};
C([r({ attribute: !1 })], Oe.prototype, "t", void 0), C([r()], Oe.prototype, "variant", void 0), C([r()], Oe.prototype, "address", void 0), C([r()], Oe.prototype, "calendar", void 0), S("joe-calendar-flow", Oe);
//#endregion
//#region src/components/car-account.ts
var ke = [
	"google",
	"outlook",
	"microsoft",
	"icloud",
	"infomaniak",
	"caldav"
], Ae = /* @__PURE__ */ new Set([
	"google",
	"outlook",
	"microsoft"
]), je = {
	kind: "outlook",
	address: "",
	username: null,
	url: null,
	client_id: null,
	tenant: "common",
	accept: !0
}, P = class extends n {
	constructor(...e) {
		super(...e), this.actionId = "", this.saved = !1, this.password = "", this.secret = "", this.busy = !1, this.ownApp = !1;
	}
	static {
		this.styles = [d, a`
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
		let t = this.t;
		if (!t) return o;
		let n = this.account, r = Ae.has(n.kind);
		return e`<div class="field" data-tipped>
        <div class="head-row"><label for="account-kind"><b>${t("calendar.account.kind")}</b></label> ${y(t, "calendar_account")}</div>
        <select id="account-kind" class="input" @change=${(e) => this.set({ kind: e.target.value })}>
          ${ke.map((r) => e`<option value=${r} ?selected=${r === n.kind}>${t(`calendar.account.kind.${r}`)}</option>`)}
        </select>
      </div>
      <div class="field" data-tipped>
        <div class="head-row"><label for="account-address"><b>${t("calendar.account.address")}</b></label> ${y(t, "calendar_account_address")}</div>
        <input
          id="account-address"
          class="input"
          type="email"
          autocomplete="off"
          placeholder=${t(`calendar.account.placeholder.${n.kind}`)}
          .value=${n.address}
          @change=${(e) => this.set({ address: e.target.value.trim().toLowerCase() })}
        />
        ${n.kind === "google" ? e`<p class="hint">${t("calendar.account.google.hint")}</p>` : o}
      </div>
      ${r ? this.renderSignIn(t, n) : this.renderPassword(t, n)}
      <div class="inline" data-tipped>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(n.accept)}
          aria-label=${t("calendar.account.accept")}
          @click=${() => this.set({ accept: !n.accept })}
        ></button>
        <span>${t("calendar.account.accept")}</span>
        ${y(t, "calendar_account_accept")}
      </div>
      ${this.renderStatus(t)}`;
	}
	get account() {
		return {
			...je,
			...this.need?.account ?? {}
		};
	}
	joeApp(e) {
		return e === "google" ? !!this.apps?.google : !!this.apps?.microsoft;
	}
	renderSignIn(t, n) {
		let r = this.status, i = r?.oauth, a = n.kind === "google", s = this.joeApp(n.kind), c = !s || this.ownApp || !!n.client_id || n.kind === "microsoft", l = !!r?.has_sign_in, u = this.signInError ?? (i?.state === "error" ? i.error : void 0);
		return e`${c ? this.renderOwnApp(t, n, s) : o}
      <div class="field" data-tipped>
        <div class="inline">
          <button type="button" class="mini-btn go" ?disabled=${this.busy} @click=${() => this.act("sign_in")}>
            <ha-icon icon=${a ? "mdi:google" : "mdi:microsoft"}></ha-icon>${t(l ? "mail.sign_in.again" : a ? "mail.sign_in.google" : "mail.sign_in")}
          </button>
          ${l ? e`<button type="button" class="mini-btn quiet" @click=${() => this.act("sign_out")}>${t("mail.sign_out")}</button>` : o}
          ${c ? o : e`<button type="button" class="mini-btn quiet" @click=${() => this.ownApp = !0}>${t("calendar.account.own_app")}</button>`}
          ${y(t, "mail_sign_in")}
        </div>
        ${i?.state === "waiting" && !this.signInError ? e`<p class="code">${t("mail.sign_in.code", { code: i.user_code ?? "" })}
              <a href=${i.uri ?? ""} target="_blank" rel="noreferrer noopener">${i.uri}</a></p>` : u ? e`<p class="bad">${t.optional(`calendar.account.oauth.${u}`) ?? t("calendar.account.oauth.other")}</p>` : l ? e`<p class="hint ok">${t("mail.signed_in")}</p>` : o}
      </div>`;
	}
	renderOwnApp(t, n, r) {
		let i = n.kind === "google";
		return e`<div class="field" data-tipped>
      <div class="head-row">
        <b>${t(r ? "calendar.account.client_id" : "calendar.account.client_id.needed")}</b>
        ${y(t, i ? "google_app" : "mail_microsoft")}
      </div>
      ${r ? o : e`<p class="hint">${t("calendar.account.no_joe_app")}</p>`}
      <div class="inline">
        <input
          class="input"
          type="text"
          autocomplete="off"
          placeholder=${i ? "1234567890-abc.apps.googleusercontent.com" : "00000000-0000-0000-0000-000000000000"}
          aria-label=${t("calendar.account.client_id")}
          .value=${n.client_id ?? ""}
          @change=${(e) => this.set({ client_id: e.target.value.trim() || null })}
        />
        ${n.kind === "microsoft" ? e`<input
              class="input"
              type="text"
              placeholder="common"
              aria-label=${t("mail.tenant")}
              .value=${n.tenant}
              @change=${(e) => this.set({ tenant: e.target.value.trim() || "common" })}
            />` : o}
      </div>
      ${i ? e`<form
            class="inline"
            @submit=${(e) => {
			e.preventDefault(), this.act("client_secret");
		}}
          >
            <input
              class="input"
              type="password"
              autocomplete="off"
              placeholder=${t("calendar.account.client_secret")}
              aria-label=${t("calendar.account.client_secret")}
              .value=${this.secret}
              @input=${(e) => this.secret = e.target.value}
            />
            <button type="submit" class="mini-btn" ?disabled=${!this.secret || this.busy}>${t("common.save")}</button>
          </form>
          ${this.status?.has_client_secret ? e`<p class="hint ok">${t("mail.password.saved")}</p>` : o}` : o}
    </div>`;
	}
	renderPassword(t, n) {
		return e`${n.kind === "caldav" ? e`<div class="field" data-tipped>
            <div class="head-row"><b>${t("calendar.account.url")}</b> ${y(t, "calendar_account_url")}</div>
            <div class="inline">
              <input
                class="input"
                type="url"
                placeholder="https://caldav.example.com/"
                aria-label=${t("calendar.account.url")}
                .value=${n.url ?? ""}
                @change=${(e) => this.set({ url: e.target.value.trim() || null })}
              />
              <input
                class="input"
                type="text"
                placeholder=${t("mail.username")}
                aria-label=${t("mail.username")}
                .value=${n.username ?? ""}
                @change=${(e) => this.set({ username: e.target.value.trim() || null })}
              />
            </div>
          </div>` : o}
      <div class="field" data-tipped>
        <div class="head-row"><label for="account-password"><b>${t("calendar.account.password")}</b></label> ${y(t, "calendar_account_password")}</div>
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
          <button type="submit" class="mini-btn go" ?disabled=${!this.password || this.busy}>${t("common.save")}</button>
        </form>
        ${this.status?.has_password ? e`<p class="hint ok">${t("mail.password.saved")}</p>` : o}
      </div>`;
	}
	renderStatus(t) {
		let n = this.status, r = Ae.has(this.account.kind) ? n?.has_sign_in : n?.has_password, i = this.saved ? n?.state === "error" ? t("mail.state.error", { error: t.optional(`calendar.account.error.${n.error}`) ?? t("calendar.account.error.other") }) : n?.checked ? t("mail.state.ok", { time: x(n.checked) }) : "" : t("calendar.account.after_save");
		return e`<div class="inline" data-tipped>
      <button type="button" class="mini-btn" ?disabled=${this.busy || !r} @click=${() => this.act("test")}>
        <ha-icon icon="mdi:calendar-check-outline"></ha-icon>${t("calendar.account.test")}
      </button>
      ${y(t, "calendar_account_test")}
      <span class=${this.saved && n?.state === "error" ? "bad" : "hint"}>${i}</span>
      ${this.result ? e`<span class=${this.result === "ok" ? "ok" : "bad"}>
            ${t.optional(`calendar.account.result.${this.result}`) ?? t("calendar.account.result.other")}
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
C([r({ attribute: !1 })], P.prototype, "hass", void 0), C([r({ attribute: !1 })], P.prototype, "t", void 0), C([r()], P.prototype, "actionId", void 0), C([r({ type: Boolean })], P.prototype, "saved", void 0), C([r({ attribute: !1 })], P.prototype, "need", void 0), C([r({ attribute: !1 })], P.prototype, "status", void 0), C([r({ attribute: !1 })], P.prototype, "apps", void 0), C([c()], P.prototype, "password", void 0), C([c()], P.prototype, "secret", void 0), C([c()], P.prototype, "result", void 0), C([c()], P.prototype, "signInError", void 0), C([c()], P.prototype, "busy", void 0), C([c()], P.prototype, "ownApp", void 0), S("joe-car-account", P);
//#endregion
//#region src/components/car-mailbox.ts
var Me = [
	"webde",
	"gmx",
	"google",
	"tonline",
	"other"
], Ne = {
	"web.de": "webde",
	"gmx.de": "gmx",
	"gmx.net": "gmx",
	"gmx.at": "gmx",
	"gmx.ch": "gmx",
	"gmail.com": "google",
	"googlemail.com": "google",
	"t-online.de": "tonline"
}, Pe = {
	provider: "other",
	address: "",
	username: null,
	imap_host: null,
	imap_port: null,
	smtp_host: null,
	smtp_port: null,
	smtp_security: null,
	accept: !0
}, F = class extends n {
	constructor(...e) {
		super(...e), this.actionId = "", this.saved = !1, this.password = "", this.busy = !1, this.servers = !1;
	}
	static {
		this.styles = [d, a`
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
		let t = this.t;
		if (!t) return o;
		let n = this.mailbox, r = this.servers || n.provider === "other" && !!n.address;
		return e`<div class="field" data-tipped>
        <div class="head-row"><label for="mail-address"><b>${t("mail.address")}</b></label> ${y(t, "mail_address")}</div>
        <input
          id="mail-address"
          class="input"
          type="email"
          autocomplete="off"
          placeholder=${t("mail.address.placeholder")}
          .value=${n.address}
          @change=${(e) => this.setAddress(e.target.value.trim().toLowerCase())}
        />
      </div>
      <div class="field" data-tipped>
        <div class="head-row"><label for="mail-provider"><b>${t("mail.provider")}</b></label> ${y(t, "mail_provider")}</div>
        <select id="mail-provider" class="input" @change=${(e) => this.set({ provider: e.target.value })}>
          ${Me.map((r) => e`<option value=${r} ?selected=${r === n.provider}>${t(`mail.provider.${r}`)}</option>`)}
        </select>
        <p class="hint">${t(`mail.provider.${n.provider}.hint`)}</p>
      </div>
      ${this.renderPassword(t)} ${r ? this.renderServers(t, n) : o}
      <div class="inline" data-tipped>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(n.accept)}
          aria-label=${t("mail.accept")}
          @click=${() => this.set({ accept: !n.accept })}
        ></button>
        <span>${t("mail.accept")}</span>
        ${y(t, "mail_accept")}
        ${r ? o : e`<button type="button" class="mini-btn quiet" @click=${() => this.servers = !0}>${t("mail.servers.change")}</button>`}
      </div>
      ${this.renderStatus(t)} ${this.renderRecent(t)}`;
	}
	get mailbox() {
		return {
			...Pe,
			...this.need?.mailbox ?? {}
		};
	}
	renderPassword(t) {
		return e`<div class="field" data-tipped>
      <div class="head-row"><label for="mail-password"><b>${t("mail.password")}</b></label> ${y(t, "mail_password")}</div>
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
        <button type="submit" class="mini-btn go" ?disabled=${!this.password || this.busy}>${t("common.save")}</button>
      </form>
      ${this.status?.has_secret ? e`<p class="hint ok">${t("mail.password.saved")}</p>` : e`<p class="hint">${t("mail.password.hint")}</p>`}
    </div>`;
	}
	renderServers(t, n) {
		let r = (r) => e`<input
      class="input"
      type="text"
      aria-label=${t(`mail.${r}`)}
      placeholder=${t(`mail.${r}`)}
      .value=${n[r] ?? ""}
      @change=${(e) => this.set({ [r]: e.target.value.trim() || null })}
    />`, i = (r) => e`<input
      class="input port"
      type="number"
      min="1"
      max="65535"
      aria-label=${t(`mail.${r}`)}
      placeholder=${t(`mail.${r}`)}
      .value=${n[r] == null ? "" : String(n[r])}
      @change=${(e) => {
			let t = Number.parseInt(e.target.value, 10);
			this.set({ [r]: Number.isFinite(t) && t > 0 && t < 65536 ? t : null });
		}}
    />`;
		return e`<div class="field" data-tipped>
      <div class="head-row"><b>${t("mail.servers")}</b> ${y(t, "mail_servers")}</div>
      <p class="hint">${t("mail.servers.hint")}</p>
      <div class="inline">${r("username")}</div>
      <div class="inline">${r("imap_host")} ${i("imap_port")}</div>
      <div class="inline">
        ${r("smtp_host")} ${i("smtp_port")}
        <select
          class="input port"
          aria-label=${t("mail.smtp_security")}
          @change=${(e) => this.set({ smtp_security: e.target.value || null })}
        >
          <option value="" ?selected=${!n.smtp_security}>${t("mail.smtp_security.auto")}</option>
          <option value="starttls" ?selected=${n.smtp_security === "starttls"}>STARTTLS</option>
          <option value="ssl" ?selected=${n.smtp_security === "ssl"}>SSL/TLS</option>
        </select>
      </div>
    </div>`;
	}
	renderStatus(t) {
		return e`<div class="field" data-tipped>
      <div class="inline">
        <button type="button" class="mini-btn" ?disabled=${this.busy || !this.status?.has_secret} @click=${() => this.act("test")}>
          <ha-icon icon="mdi:connection"></ha-icon>${t("mail.test")}
        </button>
        ${this.saved ? e`<button type="button" class="mini-btn" ?disabled=${this.busy || !this.status?.has_secret} @click=${() => this.act("check")}>
              <ha-icon icon="mdi:email-sync-outline"></ha-icon>${t("mail.check")}
            </button>` : o}
        ${y(t, "mail_status")}
      </div>
      <p class=${this.saved && this.status?.state === "error" ? "hint bad" : "hint"}>
        ${this.saved ? this.statusText(t) : t("mail.after_save")}
      </p>
      ${this.result ? e`<p class=${this.result === "ok" ? "hint ok" : "hint bad"} role="status">
            ${t.optional(`mail.result.${this.result}`) ?? t("mail.result.failed")}
          </p>` : o}
    </div>`;
	}
	renderRecent(t) {
		let n = this.status?.recent ?? [];
		if (!n.length) return o;
		let r = this.need?.allowed ?? [];
		return e`<div class="field" data-tipped>
      <div class="head-row"><b>${t("mail.recent")}</b> ${y(t, "mail_recent")}</div>
      <ul>
        ${n.slice(0, 8).map((n) => e`<li>
            <span class="what">
              ${n.summary || "–"} ${n.start && n.start.includes("T") ? `· ${n.start.slice(8, 10)}.${n.start.slice(5, 7)}. ${x(n.start)}` : ""}
              · ${n.from}
            </span>
            <span class=${n.result.startsWith("not") || n.result.endsWith("not_accepted") || n.result.startsWith("no_") ? "bad" : ""}>
              ${t.optional(`mail.recent.${n.result}`) ?? n.result}
            </span>
            ${n.result === "not_allowed" && !r.includes(n.from) ? e`<button type="button" class="mini-btn" @click=${() => this.change({ allowed: [...r, n.from] })}>${t("mail.allow")}</button>` : o}
          </li>`)}
      </ul>
    </div>`;
	}
	statusText(e) {
		let t = this.status;
		return !t || t.state === "off" || t.state === "waiting" ? e("mail.state.waiting") : t.state === "no_secret" ? e("mail.state.no_secret") : t.state === "error" ? e("mail.state.error", { error: e.optional(`mail.error.${t.error}`) ?? String(t.error) }) : e("mail.state.ok", { time: t.checked ? x(t.checked) : "–" });
	}
	setAddress(e) {
		let t = Ne[e.split("@")[1] ?? ""], n = this.mailbox, r = n.provider === "other" || n.provider === Ne[n.address.split("@")[1] ?? ""];
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
C([r({ attribute: !1 })], F.prototype, "hass", void 0), C([r({ attribute: !1 })], F.prototype, "t", void 0), C([r()], F.prototype, "actionId", void 0), C([r({ type: Boolean })], F.prototype, "saved", void 0), C([r({ attribute: !1 })], F.prototype, "need", void 0), C([r({ attribute: !1 })], F.prototype, "status", void 0), C([c()], F.prototype, "password", void 0), C([c()], F.prototype, "busy", void 0), C([c()], F.prototype, "result", void 0), C([c()], F.prototype, "servers", void 0), S("joe-car-mailbox", F);
//#endregion
//#region src/components/car-calendars.ts
var Fe = [
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
], Ie = [
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
], I = class extends n {
	constructor(...e) {
		super(...e), this.actionId = "", this.savedSource = null, this.carName = "", this.copied = !1, this.copyFailed = !1, this.linksFailed = !1, this.sender = "";
	}
	static {
		this.styles = [d, a`
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
		let { t, hass: n } = this;
		if (!t || !n) return o;
		let r = this.need?.source ?? "ha";
		return e`<div data-tipped>
        <div class="head-row"><b>${t("calendar.source")}</b> ${y(t, "calendar_source")}</div>
        <div class="ways-box"><div class="ways" role="radiogroup" aria-label=${t("calendar.source")}>
          ${Fe.map((n) => e`<button
              type="button"
              class="way"
              role="radio"
              aria-checked=${String(r === n.source)}
              @click=${() => this.change({ source: n.source })}
            >
              <ha-icon icon=${n.icon}></ha-icon>
              <b>${t(`calendar.way.${n.source}`)}</b>
              <small>${t(`calendar.way.${n.source}.hint`)}</small>
            </button>`)}
        </div></div>
      </div>
      ${r === "mailbox" ? this.renderMailbox(t, n) : r === "account" ? this.renderAccount(t) : this.renderCalendar(t, n)}
      ${this.linksFailed ? e`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon><span>${t("calendar.links_failed")}</span>
            <button type="button" class="mini-btn quiet" @click=${() => this.load(!1)}>${t("calendar.retry")}</button>
          </div>` : o}`;
	}
	saved(e) {
		return this.savedSource === e;
	}
	renderLegacy(t, n) {
		let r = this.savedSource && this.savedSource !== "mailbox" && this.savedSource === (this.need?.source ?? "ha") ? this.links?.entities[this.actionId] : null;
		return r ? e`<div class="own" data-tipped>
          <div class="head-row"><ha-icon icon="mdi:calendar-clock"></ha-icon><b>${t("calendar.own.legacy")}</b> ${y(t, "calendar_legacy")}</div>
          <p class="hint">${t("calendar.own.legacy.hint", { name: p(n, r) })}</p>
        </div>` : o;
	}
	renderCalendar(t, n) {
		let r = this.need?.calendars ?? [];
		return e`<div class="part">
        <joe-calendar-flow .t=${t} variant="calendar"></joe-calendar-flow>
      </div>
      ${this.renderLegacy(t, n)}
      <div data-tipped>
        <div class="head-row"><b>${t("calendar.pick")}</b> ${y(t, "calendar_more")}</div>
        <div class="chips">
          ${r.map((i) => e`<span class="chip">
              ${p(n, i)}
              <button
                type="button"
                class="mini-btn quiet"
                aria-label=${t("calendar.remove", { name: p(n, i) })}
                @click=${() => this.change({ calendars: r.filter((e) => e !== i) })}
              >
                <ha-icon icon="mdi:close"></ha-icon>
              </button>
            </span>`)}
          <button type="button" class="mini-btn" @click=${() => this.pick()}>
            <ha-icon icon="mdi:calendar-plus"></ha-icon>${t("calendar.add")}
          </button>
        </div>
      </div>
      <div data-tipped>
        <p class="hint">${t("calendar.connect")}</p>
        <div class="chips">
          ${Ie.map((n) => e`<a class="mini-btn" href=${n.url} target="_blank" rel="noreferrer noopener">
                <ha-icon icon="mdi:open-in-new"></ha-icon>${t(`calendar.connect.${n.key}`)}
              </a>`)}
          ${y(t, "calendar_connect")}
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
	renderMailbox(t, n) {
		let r = this.saved("mailbox"), i = r ? this.links?.entities[this.actionId] : null, a = i ? p(n, i) : t("calendar.own.name", { car: this.carName });
		return e`<div class="part">
        <joe-calendar-flow .t=${t} variant="mailbox" address=${this.need?.mailbox?.address ?? ""} calendar=${a}></joe-calendar-flow>
      </div>
      <div class="head-row"><b>${t("calendar.mailbox")}</b></div>
      <joe-car-mailbox
        .hass=${n}
        .t=${t}
        actionId=${this.actionId}
        ?saved=${r}
        .need=${this.need}
        .status=${this.mailbox}
      ></joe-car-mailbox>
      ${this.renderAllowed(t)} ${this.renderOwn(t, a, i)}`;
	}
	renderOwn(t, n, r) {
		let i = e`<div class="head-row">
      <ha-icon icon="mdi:calendar-import"></ha-icon><b>${t("calendar.own")}</b> ${y(t, "calendar_own")}
    </div>`;
		if (!r) return e`<div class="own" data-tipped>${i}<p class="hint">${t("calendar.own.after_save", { name: n })}</p></div>`;
		let a = this.links?.links[this.actionId], s = this.links?.external_url, c = a && s ? `${s.replace(/\/$/, "")}${a}` : null;
		return e`<div class="own" data-tipped>
      ${i}
      <p class="hint">${t("calendar.own.hint", { name: n })}</p>
      ${c ? e`<div class="link">
            <code>${c}</code>
            <button type="button" class="mini-btn" @click=${() => this.copy(c)}>
              <ha-icon icon=${this.copied ? "mdi:check" : "mdi:content-copy"}></ha-icon>${t(this.copied ? "calendar.copied" : "calendar.copy")}
            </button>
            <button type="button" class="mini-btn quiet" @click=${() => this.load(!0)}>
              <ha-icon icon="mdi:refresh"></ha-icon>${t("calendar.renew")}
            </button>
            ${y(t, "calendar_link")}
          </div>
          ${this.copyFailed ? e`<p class="hint bad">${t("calendar.copy_failed")}</p>` : o}` : e`<p class="hint">${t("calendar.no_external")}</p>`}
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
	renderAccount(t) {
		return e`<div class="part">
        <joe-calendar-flow .t=${t} variant="account" address=${this.need?.account?.address ?? ""}></joe-calendar-flow>
      </div>
      <div class="head-row"><b>${t("calendar.account")}</b></div>
      <joe-car-account
        .hass=${this.hass}
        .t=${t}
        actionId=${this.actionId}
        ?saved=${this.saved("account")}
        .need=${this.need}
        .status=${this.account}
        .apps=${this.apps}
      ></joe-car-account>
      ${this.renderAllowed(t, "account_allowed")} ${this.hass ? this.renderLegacy(t, this.hass) : o}`;
	}
	renderAllowed(t, n = "mail_allowed") {
		let r = this.need?.allowed ?? [];
		return e`<div class="part" data-tipped>
      <div class="head-row"><b>${t("mail.allowed")}</b> ${y(t, n)}</div>
      <p class="hint">${t("mail.allowed.hint")}</p>
      ${r.length ? e`<div class="chips">
            ${r.map((n) => e`<span class="chip">
                ${n}
                <button
                  type="button"
                  class="mini-btn quiet"
                  aria-label=${t("mail.allowed.remove", { rule: n })}
                  @click=${() => this.change({ allowed: r.filter((e) => e !== n) })}
                >
                  <ha-icon icon="mdi:close"></ha-icon>
                </button>
              </span>`)}
          </div>` : e`<div class="note warn"><ha-icon icon="mdi:account-alert-outline"></ha-icon><span>${t("mail.allowed.none")}</span></div>`}
      <form
        class="inline"
        @submit=${(e) => {
			e.preventDefault(), this.allow(this.sender);
		}}
      >
        <input
          class="input"
          type="text"
          placeholder=${t("mail.allowed.placeholder")}
          aria-label=${t("mail.allowed.add")}
          .value=${this.sender}
          @input=${(e) => this.sender = e.target.value}
          @change=${() => this.allow(this.sender)}
        />
        <button type="submit" class="mini-btn" ?disabled=${!this.sender.trim()}>${t("mail.allowed.add")}</button>
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
C([r({ attribute: !1 })], I.prototype, "hass", void 0), C([r({ attribute: !1 })], I.prototype, "t", void 0), C([r()], I.prototype, "actionId", void 0), C([r({ attribute: !1 })], I.prototype, "savedSource", void 0), C([r({ attribute: !1 })], I.prototype, "need", void 0), C([r({ attribute: !1 })], I.prototype, "mailbox", void 0), C([r({ attribute: !1 })], I.prototype, "account", void 0), C([r({ attribute: !1 })], I.prototype, "apps", void 0), C([r()], I.prototype, "carName", void 0), C([c()], I.prototype, "links", void 0), C([c()], I.prototype, "copied", void 0), C([c()], I.prototype, "copyFailed", void 0), C([c()], I.prototype, "linksFailed", void 0), C([c()], I.prototype, "sender", void 0), S("joe-car-calendars", I);
//#endregion
//#region src/hot-water.ts
var Le = [
	"warmwasser",
	"brauchwasser",
	"trinkwasser",
	"boiler",
	"hot_water",
	"hot water",
	"dhw",
	"water_heater",
	"water heater"
], Re = [
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
], ze = [
	"switch",
	"input_boolean",
	"select",
	"input_select",
	"number",
	"input_number",
	"button",
	"script"
];
function Be(e, t) {
	let n = e.states[t], r = String(n?.attributes.friendly_name ?? ""), i = e.entities?.[t]?.device_id, a = i ? e.devices?.[i] : void 0;
	return `${t} ${r} ${a?.name_by_user ?? a?.name ?? ""}`.toLowerCase().replaceAll("-", " ");
}
function Ve(e, t) {
	return [...Le, ...t].some((t) => e.includes(t));
}
function He(e) {
	return (e ?? "").toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((e) => e.length >= 5);
}
function Ue(e, t) {
	let n = He(t), r = [], i = [];
	for (let [t, a] of Object.entries(e.states)) {
		let o = t.split(".")[0], s = Be(e, t);
		if (!Ve(s, n)) continue;
		let c = t.toLowerCase(), l = String(a.attributes.unit_of_measurement ?? "");
		if ((o === "sensor" || o === "number") && (l === "°C" || l === "°F")) {
			let e = (Le.some((e) => c.includes(e.replace(" ", "_"))) ? 2 : 1) - (Re.some((e) => s.includes(e)) ? 2 : 0);
			r.push({
				entity_id: t,
				score: e
			});
		} else ze.includes(o) && i.push({
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
var We = [
	"eq",
	"ne",
	"lt",
	"le",
	"gt",
	"ge"
], Ge = {
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
}, Ke = {
	reserve_km: [0, 1e3],
	consumption: [5, 60],
	daily_km: [0, 2e3],
	capacity_kwh: [.1, 300]
}, qe = {
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
function Je(e, t) {
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
var L = class extends n {
	constructor(...e) {
		super(...e), this.actionId = "", this.section = "", this.consumer = "", this.saving = !1, this.problem = "", this.focused = !1;
	}
	static {
		this.styles = [d, a`
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
				let e = Je(this.actionId.slice(4), this.t), t = this.discovery?.wallboxes.find((e) => e.is_car);
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
		let { t, hass: n, draft: r } = this;
		if (!t || !n || !r) return o;
		let i = !this.existing;
		return e`<div class="sheet-title">${T(t(i ? "action.title.new" : "action.title"))}</div>
      ${this.field(t("action.f.name"), "a_name", e`<input
          class="input"
          type="text"
          maxlength="60"
          .value=${r.name}
          @change=${(e) => this.set({ name: e.target.value.trim() || r.name })}
        />`)}
      ${this.field(t("action.f.kind"), "a_kind", e`<div class="seg" role="group" aria-label=${t("action.f.kind")}>
          ${["switch", "target"].map((n) => e`<button type="button" aria-pressed=${String(r.kind === n)} @click=${() => this.set({ kind: n })}>
                ${t(`action.kind.${n}`)}
              </button>`)}
        </div>`)}
      ${this.field(t("action.f.entity"), "a_entity", this.entityBox(t, r.entity_id, () => this.pickTarget()))}
      ${r.entity_id ? this.field(t("action.f.on_value"), "a_on_value", this.valueInput(r.entity_id, r.on_value, (e) => this.set({ on_value: e }))) : o}
      ${this.field(t("action.f.reset"), "a_reset", e`<div class="row">
          <div class="seg" role="group" aria-label=${t("action.f.reset")}>
            ${["previous", "fixed"].map((n) => e`<button type="button" aria-pressed=${String(r.reset === n)} @click=${() => this.set({ reset: n })}>
                  ${t(`action.reset.${n}`)}
                </button>`)}
          </div>
          ${r.reset === "fixed" && r.entity_id ? this.valueInput(r.entity_id, r.reset_value ?? "", (e) => this.set({ reset_value: e })) : o}
        </div>`)}
      ${this.field(t("action.f.lead"), "a_lead", e`<span class="unit-input">
          <input
            class="input"
            type="number"
            min="0"
            max="120"
            step="1"
            .value=${String(r.lead_min)}
            @change=${(e) => this.set({ lead_min: this.int(e, 0, 120) })}
          />
          <span class="unit">min</span>
        </span>`)}
      ${r.kind === "target" ? this.renderTarget(t, r) : o}
      ${this.field(t("action.f.auto"), "a_auto", e`<div class="row">
          <button
            type="button"
            class="switch"
            role="switch"
            aria-checked=${String(r.auto)}
            aria-label=${t("action.f.auto")}
            @click=${() => this.set({ auto: !r.auto })}
          ></button>
          <span>${t("action.f.below")}</span>
          <span class="unit-input">
            <input
              class="input"
              type="number"
              min="0"
              max="1000"
              step="1"
              ?disabled=${!r.auto}
              placeholder=${t("action.f.every_night")}
              .value=${r.forecast_below_kwh == null ? "" : String(r.forecast_below_kwh)}
              @change=${(e) => {
			let t = Number.parseFloat(e.target.value);
			this.set({ forecast_below_kwh: Number.isFinite(t) && t > 0 ? t : null });
		}}
            />
            <span class="unit">kWh</span>
          </span>
        </div>`)}
      ${r.auto ? this.renderConditions(t, r) : o}
      ${r.kind === "switch" ? this.renderNeed(t, r) : o}
      ${this.field(t("action.f.power"), "a_power", e`<span class="unit-input">
          <input
            class="input"
            type="number"
            inputmode="decimal"
            min="0"
            max="100"
            step="0.1"
            placeholder=${t("f.unknown")}
            .value=${r.power_kw == null ? "" : String(r.power_kw)}
            @change=${(e) => {
			let t = Number.parseFloat(e.target.value);
			this.set({ power_kw: Number.isFinite(t) && t > 0 ? t : null });
		}}
          />
          <span class="unit">kW</span>
        </span>`)}
      ${this.config?.consumers.length ?? 0 ? this.field(t("action.f.consumer"), "a_consumer", e`<select class="input" @change=${(e) => this.set({ consumer_id: e.target.value || null })}>
              <option value="" ?selected=${!r.consumer_id}>${t("action.f.consumer.none")}</option>
              ${this.config.consumers.map((t) => e`<option value=${t.id} ?selected=${r.consumer_id === t.id}>${t.name}</option>`)}
            </select>`) : o}
      ${this.field(t("action.f.priority"), "a_priority", e`<span class="unit-input">
          <input
            class="input"
            type="number"
            min="1"
            max="9"
            step="1"
            .value=${String(r.priority)}
            @change=${(e) => this.set({ priority: this.int(e, 1, 9) })}
          />
        </span>`)}
      ${this.field(t("action.f.enabled"), "a_enabled", e`<button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(r.enabled)}
          aria-label=${t("action.f.enabled")}
          @click=${() => this.set({ enabled: !r.enabled })}
        ></button>`)}
      ${this.problem ? e`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.problem}</span></div>` : o}
      <div class="actions">
        <span data-tipped class="row">
          <button type="button" class="btn btn-primary" ?disabled=${this.saving} @click=${this.save}>${t("common.save")}</button>
          ${y(t, "a_save")}
        </span>
        <button type="button" class="btn btn-ghost" data-notip @click=${this.close}>${t("common.cancel")}</button>
      </div>
      ${i ? o : e`<div class="danger-zone" data-tipped>
            <button type="button" class="btn btn-danger" @click=${this.deleteAction}>${t("action.delete")}</button>
            ${y(t, "a_delete")}
          </div>`}`;
	}
	renderTarget(t, n) {
		let r = (r, i) => e`<label>
      ${t(`action.f.${r}`)}
      <span class="unit-input">
        <input
          class="input"
          type="number"
          min="0"
          max="100"
          step="0.5"
          .value=${String(n[r])}
          @change=${(e) => {
			let t = Number.parseFloat(e.target.value);
			Number.isFinite(t) && this.set({ [r]: t });
		}}
        />
        <span class="unit">${i}</span>
      </span>
    </label>`;
		return e`${this.field(t("action.f.sensor"), "a_sensor", this.entityBox(t, n.sensor_entity ?? "", () => this.pickSensor()))}
      ${this.field(t("action.f.temps"), "a_temps", e`<div class="temps">${r("comfort", "°C")} ${r("maximum", "°C")} ${r("buffer", "K")}</div>`)}`;
	}
	renderNeed(t, n) {
		let r = n.need ?? Ge, i = (this.config?.persons ?? []).filter((e) => e.calendars.length), a = (t, n, i, a = "") => e`<span
      class="unit-input"
    >
      <input
        class="input"
        type="number"
        inputmode="decimal"
        min=${Ke[t][0]}
        max=${Math.min(i, Ke[t][1])}
        step=${t === "consumption" || t === "capacity_kwh" ? "0.1" : "1"}
        placeholder=${a}
        .value=${r[t] == null ? "" : String(r[t])}
        @change=${(e) => {
			let n = e.target, r = Number.parseFloat(n.value.replace(",", ".")), [i, a] = Ke[t], o = Number.isFinite(r) && r >= i && r <= a, s = t === "reserve_km" ? 50 : null;
			o || (n.value = s == null ? "" : String(s)), this.setNeed({ [t]: o ? r : s });
		}}
      />
      <span class="unit">${n}</span>
    </span>`, s = (e) => this.entityBox(t, r[e] ?? "", () => this.pickNeed(e));
		return e`${this.field(t("action.need"), "a_need", e`<div class="row">
            <button
              type="button"
              class="switch"
              role="switch"
              aria-checked=${String(r.enabled)}
              aria-label=${t("action.need")}
              @click=${() => this.toggleNeed()}
            ></button>
            <span>${t(r.enabled ? "action.need.on" : "action.need.off")}</span>
          </div>
          <p class="field-hint">${t("action.need.hint")}</p>`)}
      ${r.enabled ? e`${this.field(t("action.need.soc"), "a_need_soc", s("soc_entity"))}
          ${this.field(t("action.need.range"), "a_need_range", s("range_entity"))}
          ${this.field(t("action.need.capacity"), "a_need_capacity", e`<div class="row">${a("capacity_kwh", "kWh", 300, t("action.need.from_sensor"))}</div>
              ${r.capacity_kwh == null ? s("capacity_entity") : o}`)}
          ${this.field(t("action.need.reserve"), "a_need_reserve", a("reserve_km", "km", 1e3))}
          ${this.field(t("action.need.consumption"), "a_need_consumption", e`${a("consumption", "kWh/100 km", 60, t("action.need.learned"))}
              ${r.consumption == null ? s("consumption_entity") : o}`)}
          ${this.field(t("action.need.daily"), "a_need_daily", a("daily_km", "km", 2e3, t("action.need.learned")))}
          ${this.field(t("action.need.odometer"), "a_need_odometer", s("odometer_entity"))}
          ${this.field(t("action.need.persons"), "a_need_persons", i.length ? e`<div class="row" role="group" aria-label=${t("action.need.persons")}>
                  ${i.map((t) => {
			let n = r.persons == null || r.persons.includes(t.id);
			return e`<button
                      type="button"
                      class="mini-btn ${n ? "go" : "quiet"}"
                      aria-pressed=${String(n)}
                      @click=${() => this.togglePerson(t.id, i.map((e) => e.id))}
                    >
                      ${t.name}
                    </button>`;
		})}
                </div>` : e`<p class="field-hint">${t("action.need.no_calendars")}</p>`)}
          ${this.field(t("action.need.calendars"), "a_need_calendars", e`<joe-car-calendars
              .hass=${this.hass}
              .t=${t}
              actionId=${n.id}
              .savedSource=${this.existing?.need?.enabled ? this.existing.need.source ?? "ha" : null}
              .need=${r}
              .mailbox=${this.mailboxes?.[n.id]}
              .account=${this.accounts?.[n.id]}
              .apps=${this.apps}
              carName=${n.name}
              @joe-need=${(e) => this.setNeed(e.detail)}
            ></joe-car-calendars>`)}
          ${this.field(t("action.need.round_trip"), "a_need_round_trip", e`<button
              type="button"
              class="switch"
              role="switch"
              aria-checked=${String(r.round_trip)}
              aria-label=${t("action.need.round_trip")}
              @click=${() => this.setNeed({ round_trip: !r.round_trip })}
            ></button>`)}
          ${this.config?.routing.service ? o : e`<div class="note"><ha-icon icon="mdi:map-marker-distance"></ha-icon><span>${t("action.need.no_routing")}</span></div>`}` : o}`;
	}
	setNeed(e) {
		this.set({ need: {
			...this.draft?.need ?? Ge,
			...e
		} });
	}
	toggleNeed() {
		let e = this.draft?.need ?? Ge;
		if (e.enabled) {
			this.setNeed({ enabled: !1 });
			return;
		}
		let t = this.discovery?.cars ?? [], n = (this.discovery?.wallboxes ?? []).filter((e) => e.is_car), r = t.length === 1 && n.length <= 1 ? t[0].entities : {}, i = { enabled: !0 };
		for (let [t, n] of Object.entries(qe)) !e[t] && r[n.role] && (i[t] = r[n.role] ?? null);
		this.setNeed(i);
	}
	togglePerson(e, t) {
		let n = (this.draft?.need ?? Ge).persons ?? t, r = n.includes(e) ? n.filter((t) => t !== e) : [...n, e];
		this.setNeed({ persons: t.every((e) => r.includes(e)) ? null : r });
	}
	async pickNeed(e) {
		let t = this.t, n = qe[e], r = (this.discovery?.cars ?? []).map((e) => ({
			entity_id: e.entities[n.role] ?? "",
			confidence: e.confidence,
			reasons: e.reasons
		})).filter((e) => e.entity_id), i = await N(this, {
			heading: t(`action.need.pick.${n.role}`),
			tip: n.tip,
			filter: n.filter,
			selected: this.draft?.need?.[e] ? [this.draft.need[e]] : [],
			suggestions: Ee(r)
		});
		i && this.setNeed({ [e]: i.selected[0] ?? null });
	}
	renderConditions(t, n) {
		let r = this.hass;
		return this.field(t("action.f.conditions"), "a_conditions", e`${n.conditions.map((n, i) => e`<div class="condition">
            <span><b>${p(r, n.entity_id)}</b></span>
            <select
              class="input"
              aria-label=${t("action.f.op")}
              @change=${(e) => this.setCondition(i, { op: e.target.value })}
            >
              ${We.map((r) => e`<option value=${r} ?selected=${n.op === r}>${t(`action.op.${r}`)}</option>`)}
            </select>
            <input
              class="input"
              type="text"
              aria-label=${t("action.f.value")}
              .value=${String(n.value === !0 ? "on" : n.value === !1 ? "off" : n.value)}
              @change=${(e) => this.setCondition(i, { value: this.parse(e.target.value) })}
            />
            <button type="button" class="icon-btn" aria-label=${t("f.remove")} title=${t("f.remove")} @click=${() => this.removeCondition(i)}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>`)}
        <button type="button" class="mini-btn" @click=${this.addCondition}>
          <ha-icon icon="mdi:plus"></ha-icon>${t("action.f.condition.add")}
        </button>`);
	}
	field(t, n, r) {
		return e`<div class="field" data-tipped>
      <div class="field-label">${t} ${y(this.t, n)}</div>
      ${r}
    </div>`;
	}
	entityBox(t, n, r) {
		let i = this.hass;
		return e`<div class="entity">
      <span>
        ${n ? e`<b>${p(i, n)}</b><small>${g(i, n, t.lang)}</small>` : e`<small>${t("find.none")}</small>`}
      </span>
      <button type="button" class="mini-btn" @click=${r}>
        <ha-icon icon="mdi:magnify"></ha-icon>${t(n ? "review.change" : "review.choose")}
      </button>
    </div>`;
	}
	valueInput(t, n, r) {
		let i = this.t, a = t.split(".", 1)[0], o = this.hass?.states[t]?.attributes.options ?? [];
		if (["select", "input_select"].includes(a) && o.length) return e`<select class="input" aria-label=${i("action.f.value")} @change=${(e) => r(e.target.value)}>
        ${o.map((t) => e`<option value=${t} ?selected=${n === t}>${t}</option>`)}
      </select>`;
		if ([
			"switch",
			"input_boolean",
			"light",
			"fan"
		].includes(a)) {
			let t = n === !0 || n === "on";
			return e`<div class="seg" role="group" aria-label=${i("action.f.value")}>
        <button type="button" aria-pressed=${String(t)} @click=${() => r("on")}>${i("action.value.on")}</button>
        <button type="button" aria-pressed=${String(!t)} @click=${() => r("off")}>${i("action.value.off")}</button>
      </div>`;
		}
		return e`<input
      class="input"
      type="text"
      aria-label=${i("action.f.value")}
      .value=${n == null ? "" : String(n)}
      @change=${(e) => r(this.parse(e.target.value))}
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
		return Ue(this.hass, e?.name);
	}
	async pickTarget() {
		let e = this.t, t = (await N(this, {
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
		let e = this.t, t = await N(this, {
			heading: e("action.pick.sensor"),
			tip: "a_sensor",
			filter: "temperature",
			selected: this.draft?.sensor_entity ? [this.draft.sensor_entity] : [],
			suggestions: this.hotWater()?.sensors
		});
		t?.selected[0] && this.set({ sensor_entity: t.selected[0] });
	}
	async addCondition() {
		let e = this.t, t = (await N(this, {
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
		let i = await M(this, { actions: { [n]: r } });
		this.saving = !1, i && this.close();
	}
	async deleteAction() {
		this.existing && await M(this, { actions: { [this.existing.id]: null } }) && this.close();
	}
	close() {
		this.dispatchEvent(new CustomEvent("joe-close", {
			bubbles: !0,
			composed: !0
		}));
	}
};
C([r({ attribute: !1 })], L.prototype, "hass", void 0), C([r({ attribute: !1 })], L.prototype, "mailboxes", void 0), C([r({ attribute: !1 })], L.prototype, "accounts", void 0), C([r({ attribute: !1 })], L.prototype, "apps", void 0), C([r({ attribute: !1 })], L.prototype, "t", void 0), C([r({ attribute: !1 })], L.prototype, "config", void 0), C([r({ attribute: !1 })], L.prototype, "discovery", void 0), C([r()], L.prototype, "actionId", void 0), C([r()], L.prototype, "section", void 0), C([r()], L.prototype, "consumer", void 0), C([c()], L.prototype, "draft", void 0), C([c()], L.prototype, "saving", void 0), C([c()], L.prototype, "problem", void 0), S("joe-action-editor", L);
//#endregion
//#region src/types.ts
var Ye = [
	"welcome",
	"scan",
	"questions",
	"done"
], Xe = [
	"min_soc",
	"grid_charge",
	"charge_target",
	"mode",
	"charge_power",
	"discharge_power",
	"discharge_limit",
	"discharge_limit_enabled"
], Ze = [
	"normal",
	"force_charge",
	"hold",
	"force_discharge"
], Qe = [
	"home_office",
	"office",
	"travel",
	"vacation",
	"guests",
	"home"
], $e = [
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
function et(e) {
	let t = e.filter((e) => e.kind !== "submeter" && (e.kind === "ev" && (e.runs ?? "auto") !== "always" || e.runs === "surplus" || e.runs === "cheap")), n = new Set(t.map((e) => e.energy_entity).filter(Boolean));
	return t.filter((e) => !e.included_in || !n.has(e.included_in));
}
var tt = [
	"forecast",
	"consumption",
	"battery",
	"hot_water",
	"car"
], nt = [
	"normal",
	"holiday",
	"away",
	"home_office"
], rt = ["heat", "cool"], it = [
	"overview",
	"plan",
	"history",
	"learn",
	"devices",
	"climate",
	"settings"
], at = {
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
}, ot = [
	"charge",
	"hold",
	"release"
];
function st(e) {
	let t = (...t) => t.every((t) => !!e.controls[t]), n = (t) => !!e.mode_options[t], r = [];
	t("mode") && n("force_charge") && r.push("mode"), t("grid_charge", "charge_target") && r.push("target"), t("grid_charge", "min_soc") && r.push("min_soc");
	let i = [];
	return t("min_soc") && i.push("min_soc"), t("mode") && n("hold") && i.push("mode_hold"), t("mode", "charge_power") && n("force_charge") && i.push("standby"), t("discharge_limit") && i.push("limit"), {
		charge: r,
		hold: i
	};
}
var ct = class extends n {
	static {
		this.styles = [d, a`
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
		let { t, value: n } = this;
		if (!t || !n) return o;
		let r = [
			"watch",
			...this.profileKey ? ["profile"] : [],
			"generic",
			"steps"
		], i = this.found?.suggested;
		return e`<div class="choose">
        <div class="seg" role="group" aria-label=${t("f.battery.control")}>
          ${r.map((n) => e`<button type="button" aria-pressed=${String(this.choice === n)} @click=${() => this.choose(n)}>
                ${n === "profile" ? t("f.battery.control.profile", { name: this.profiles?.[this.profileKey ?? ""] ?? this.profileKey ?? "" }) : t(`f.battery.control.${n}`)}
              </button>`)}
        </div>
      </div>
      ${this.choice === "watch" && i?.complete ? e`<div class="note" data-tipped>
            <ha-icon icon="mdi:lightbulb-on-outline"></ha-icon>
            <span
              >${t("f.battery.control.suggested")}
              <div class="note-actions">
                <button type="button" class="mini-btn go" @click=${this.takeSuggestion}>${t("f.battery.control.take")}</button>
                ${y(t, "control_roles")}
              </div></span
            >
          </div>` : o}
      ${this.choice === "profile" && Object.keys(n.steps).length && !Object.keys(n.controls).length ? this.renderServiceSteps(t, n) : this.choice === "profile" || this.choice === "generic" ? this.renderRoles(t, n) : o}
      ${this.choice === "steps" ? this.renderSteps(t, n) : o}
      ${this.choice === "watch" ? o : e`<p class="field-hint">${t("f.battery.control.retest")}</p>`}`;
	}
	renderRoles(t, n) {
		let r = this.hass, i = st(n), a = i.charge.length && i.hold.length, s = n.controls.mode, c = s ? r.states[s]?.attributes.options ?? [] : [];
		return e`<div data-tipped>
      <div class="sub">${t("f.battery.control.levers")} ${y(t, "control_roles")}</div>
      <div class="rows">
        ${Xe.map((i) => {
			let a = n.controls[i];
			return e`<div class="row">
            <span class="label">${t(`role.${i}`)}</span>
            <span class="entity">
              ${a ? e`<b>${p(r, a)}</b><small>${g(r, a, t.lang)}</small>` : e`<small>${t("find.none")}</small>`}
            </span>
            <span class="buttons">
              <button type="button" class="mini-btn" @click=${() => this.pickRole(i)}>
                <ha-icon icon="mdi:magnify"></ha-icon>${t(a ? "review.change" : "review.choose")}
              </button>
              ${a ? e`<button
                    type="button"
                    class="icon-btn"
                    aria-label=${t("f.remove")}
                    title=${t("f.remove")}
                    @click=${() => this.setRole(i, null)}
                  >
                    <ha-icon icon="mdi:close"></ha-icon>
                  </button>` : o}
            </span>
          </div>`;
		})}
      </div>
      </div>
      ${s ? e`<div data-tipped>
            <div class="sub">${t("f.battery.mode_options")} ${y(t, "mode_options")}</div>
            <div class="rows">
              ${Ze.map((r) => e`<div class="row">
                  <label for="opt-${r}">${t(`meaning.${r}`)}</label>
                  <select
                    id="opt-${r}"
                    class="input"
                    @change=${(e) => this.setOption(r, e.target.value)}
                  >
                    <option value="" ?selected=${!n.mode_options[r]}>${t("meaning.none")}</option>
                    ${c.map((t) => e`<option value=${t} ?selected=${n.mode_options[r] === t}>${t}</option>`)}
                  </select>
                  <span></span>
                </div>`)}
            </div>
            </div>` : o}
      <div class="note ${a ? "" : "warn"} ready">
        <ha-icon icon=${a ? "mdi:check-circle-outline" : "mdi:alert-outline"}></ha-icon>
        <span
          >${a ? t("f.battery.control.ready", {
			charge: i.charge.map((e) => t(`method.${e}`)).join(", "),
			hold: i.hold.map((e) => t(`method.${e}`)).join(", ")
		}) : t("f.battery.control.needs")}</span
        >
      </div>`;
	}
	renderServiceSteps(t, n) {
		let r = this.hass;
		return e`<div data-tipped>
      <div class="sub">${t("f.battery.control.services")} ${y(t, "control_steps")}</div>
      <div class="rows">
        ${ot.flatMap((i) => (n.steps[i] ?? []).map((n) => e`<div class="row">
              <span class="label">${t(`f.battery.steps.${i}`)}</span>
              <span class="entity">
                ${n.service ? e`<b>${n.service}</b>` : e`<b>${p(r, n.entity_id ?? "")}</b><small>${String(n.value ?? "")}</small>`}
              </span>
              <span></span>
            </div>`))}
      </div>
    </div>`;
	}
	renderSteps(t, n) {
		let r = this.hass;
		return e`<div class="sub" data-tipped>${t("f.battery.control.steps")} ${y(t, "control_steps")}</div>
      <p class="field-hint">${t("f.battery.steps.hint")}</p>
      ${ot.map((i) => {
			let a = n.steps[i] ?? [];
			return e`<div class="sub">${t(`f.battery.steps.${i}`)}</div>
          <div class="rows" data-tipped>
            ${a.map((n, a) => e`<div class="row">
                <span class="entity"
                  ><b>${n.service ?? p(r, n.entity_id ?? "")}</b><small>${n.entity_id ?? ""}</small></span
                >
                <input
                  class="input step-value"
                  type="text"
                  aria-label=${t("f.battery.steps.value")}
                  placeholder=${t("f.battery.steps.value")}
                  list="values-${i}-${a}"
                  .value=${n.value == null ? "" : String(n.value)}
                  @change=${(e) => this.setStep(i, a, e.target.value)}
                />
                <datalist id="values-${i}-${a}">
                  ${this.valueHints(n.entity_id ?? "", i).map((t) => e`<option value=${t}></option>`)}
                </datalist>
                <button
                  type="button"
                  class="icon-btn"
                  aria-label=${t("f.remove")}
                  title=${t("f.remove")}
                  @click=${() => this.removeStep(i, a)}
                >
                  <ha-icon icon="mdi:close"></ha-icon>
                </button>
              </div>`)}
            <div>
              <button type="button" class="mini-btn" @click=${() => this.addStep(i)}>
                <ha-icon icon="mdi:plus"></ha-icon>${t("f.battery.steps.add")}
              </button>
              ${y(t, "control_steps")}
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
			filter: at[e],
			selected: n ? [n] : [],
			suggestions: this.nearby(at[e]).map((e) => ({ entity_id: e }))
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
C([r({ attribute: !1 })], ct.prototype, "hass", void 0), C([r({ attribute: !1 })], ct.prototype, "t", void 0), C([r({ attribute: !1 })], ct.prototype, "battery", void 0), C([r({ attribute: !1 })], ct.prototype, "found", void 0), C([r({ attribute: !1 })], ct.prototype, "value", void 0), C([r({ attribute: !1 })], ct.prototype, "profiles", void 0), S("joe-battery-control", ct);
//#endregion
//#region src/editors/battery-editor.ts
var lt = [
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
], R = class extends n {
	constructor(...e) {
		super(...e), this.batteryId = "", this.capacityUnknown = !1, this.saving = !1;
	}
	static {
		this.styles = [d, a`
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
		(e.has("config") || e.has("batteryId")) && t && !this.draft && (this.draft = Object.fromEntries(lt.map((e) => [e, structuredClone(t[e])])), this.capacityUnknown = this.config?.answers[`capacity:${t.id}`] === "unknown");
	}
	render() {
		let { t, hass: n, config: r, draft: i } = this, a = this.battery;
		if (!t || !n || !r || !i || !a) return o;
		let s = this.discovery?.batteries.find((e) => e.id === a.id), c = oe(n, a.capacity_entity);
		return e`<div class="sheet-title">${T(t("edit.battery.title", { name: a.name }))}</div>
      ${this.field(t("f.battery.name"), "f_battery_name", e`<input
          class="input"
          type="text"
          maxlength="60"
          .value=${i.name}
          @change=${(e) => this.set({ name: e.target.value.trim() || a.name })}
        />`)}
      ${this.field(t("f.battery.capacity"), "q_capacity", e`<div class="field-row">
            <span class="unit-input">
              <input
                class="input"
                type="number"
                inputmode="decimal"
                min="0.1"
                max="1000"
                step="0.01"
                .value=${i.capacity_kwh == null ? "" : String(i.capacity_kwh)}
                placeholder=${c == null ? t("f.unknown") : b(t.lang, c, 2)}
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
              ${t("ask.idk_learn")}
            </button>
          </div>
          ${c == null ? o : e`<p class="field-hint">${t("f.battery.capacity.read", { value: b(t.lang, c, 2) })}</p>`}`, D(t, k(r, `batteries[${a.id}].capacity_kwh`)))}
      ${this.field(t("f.battery.soc"), "f_battery_soc", this.entityBox(t, i.soc_entity, `${g(n, i.soc_entity, t.lang)}`, () => this.pickSoc()), D(t, k(r, `batteries[${a.id}].soc_entity`)))}
      ${this.field(t("f.battery.power"), "f_battery_power", this.entityBox(t, i.power?.entity_id ?? null, this.powerText(t, i.power), () => this.pickPower()), D(t, k(r, `batteries[${a.id}].power`)))}
      ${this.field(t("f.battery.limits"), "f_battery_limits", e`<div class="limits">
          <label>${t("f.battery.max_charge")} ${this.kwInput(t, i.max_charge_w, "max_charge_w")}</label>
          <label>${t("f.battery.max_discharge")} ${this.kwInput(t, i.max_discharge_w, "max_discharge_w")}</label>
        </div>`)}
      ${this.field(t("f.battery.floor"), "f_battery_floor", e`<span class="unit-input">
            <input
              class="input"
              type="number"
              inputmode="decimal"
              min="0"
              max="100"
              step="1"
              aria-label=${t("f.battery.floor")}
              .value=${i.floor_soc == null ? "" : String(i.floor_soc)}
              placeholder=${this.floor?.device == null ? t("f.unknown") : b(t.lang, this.floor.device, 0)}
              @change=${(e) => {
			let t = Number.parseFloat(e.target.value.replace(",", "."));
			this.set({ floor_soc: Number.isFinite(t) ? Math.min(100, Math.max(0, t)) : null });
		}}
            />
            <span class="unit">%</span>
          </span>
          ${this.floor?.device == null ? i.floor_soc == null ? e`<div class="note warn"><ha-icon icon="mdi:help-circle-outline"></ha-icon><span>${t("f.battery.floor.ask")}</span></div>` : o : e`<p class="field-hint">${t("f.battery.floor.read", { value: b(t.lang, this.floor.device, 0) })}</p>`}`, D(t, k(r, `batteries[${a.id}].floor_soc`)))}
      ${r.batteries.length > 1 ? this.field(t("f.battery.priority"), "f_battery_priority", e`<span class="unit-input">
              <input
                class="input"
                type="number"
                min="1"
                max="9"
                step="1"
                .value=${String(i.priority)}
                @change=${(e) => {
			let t = Math.round(Number.parseFloat(e.target.value));
			this.set({ priority: Math.min(9, Math.max(1, Number.isFinite(t) ? t : 1)) });
		}}
              />
            </span>`) : o}
      <div class="field" data-tipped>
        <div class="field-label">${t("f.battery.control")} ${y(t, "control_choice")}</div>
        <joe-battery-control
          .hass=${n}
          .t=${t}
          .battery=${a}
          .found=${s}
          .profiles=${this.info?.profiles}
          .value=${{
			adapter: i.adapter,
			controls: i.controls,
			mode_options: i.mode_options,
			steps: i.steps
		}}
          @joe-control-change=${(e) => this.set(this.withPrepare(e.detail, s))}
        ></joe-battery-control>
      </div>
      <div class="actions" data-notip>
        <button type="button" class="btn btn-primary" ?disabled=${this.saving} @click=${this.save}>${t("common.save")}</button>
        <button type="button" class="btn btn-ghost" @click=${this.close}>${t("common.cancel")}</button>
      </div>`;
	}
	field(t, n, r, i) {
		let a = this.t;
		return e`<div class="field" data-tipped>
      <div class="field-label">${t} ${y(a, n)} ${i ?? o}</div>
      ${r}
    </div>`;
	}
	entityBox(t, n, r, i) {
		let a = this.hass;
		return e`<div class="entity">
      <span>
        ${n ? e`<b>${p(a, n)}</b><small>${r}</small>` : e`<small>${t("find.none")}</small>`}
      </span>
      <button type="button" class="mini-btn" @click=${i}>
        <ha-icon icon="mdi:magnify"></ha-icon>${t(n ? "review.change" : "review.choose")}
      </button>
    </div>`;
	}
	kwInput(t, n, r) {
		return e`<span class="unit-input">
      <input
        class="input"
        type="number"
        inputmode="decimal"
        min="0"
        max="1000"
        step="0.1"
        placeholder=${t("f.unknown")}
        .value=${n == null ? "" : String(Math.round(n / 100) / 10)}
        @change=${(e) => {
			let t = Number.parseFloat(e.target.value);
			this.set({ [r]: Number.isFinite(t) && t > 0 ? Math.round(t * 1e3) : null });
		}}
      />
      <span class="unit">kW</span>
    </span>`;
	}
	powerText(e, t) {
		let n = this.hass, r = h(n, t);
		if (!t || r === null) return t ? g(n, t.entity_id, e.lang) : "";
		let i = b(e.lang, Math.abs(r), 2);
		return e(r >= 0 ? "pick.preview.charge" : "pick.preview.discharge", { value: i });
	}
	async pickSoc() {
		let { t: e, draft: t } = this;
		if (!e || !t) return;
		let n = await N(this, {
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
		let n = await N(this, {
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
		for (let r of lt) JSON.stringify(e[r]) !== JSON.stringify(t[r]) && (n[r] = t[r]);
		let r = `capacity:${e.id}`, i = this.config.answers[r] === "unknown", a = {};
		if (Object.keys(n).length && (a.batteries = { [e.id]: n }), i !== this.capacityUnknown && (a.answers = { [r]: this.capacityUnknown ? "unknown" : null }), Object.keys(a).length) {
			this.saving = !0;
			let e = await M(this, a);
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
C([r({ attribute: !1 })], R.prototype, "hass", void 0), C([r({ attribute: !1 })], R.prototype, "t", void 0), C([r({ attribute: !1 })], R.prototype, "config", void 0), C([r({ attribute: !1 })], R.prototype, "discovery", void 0), C([r({ attribute: !1 })], R.prototype, "info", void 0), C([r({ attribute: !1 })], R.prototype, "floor", void 0), C([r()], R.prototype, "batteryId", void 0), C([c()], R.prototype, "draft", void 0), C([c()], R.prototype, "capacityUnknown", void 0), C([c()], R.prototype, "saving", void 0), S("joe-battery-editor", R);
//#endregion
//#region src/editors/consumers.ts
var ut = ["auto", "always"], dt = [
	"auto",
	"surplus",
	"cheap"
], ft = class extends n {
	static {
		this.styles = [d, a`
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
		let { t, hass: n, config: r } = this;
		if (!t || !n || !r) return o;
		let i = [...r.consumers].sort((e, n) => Number(e.kind === "submeter") - Number(n.kind === "submeter") || e.name.localeCompare(n.name, t.lang));
		return e`<div data-tipped>
      <div class="head">${t("consumers.kind")} ${y(t, "f_consumer_kind")}</div>
      <div class="head sub">${t("consumers.runs")} ${y(t, "f_consumer_runs")}</div>
      ${i.length ? e`<ul>
            ${i.map((e) => this.renderConsumer(t, n, r, e))}
          </ul>` : e`<p class="empty">${t("consumers.empty")}</p>`}
    </div>`;
	}
	renderConsumer(t, n, r, i) {
		let a = i.power_entity ? g(n, i.power_entity, t.lang) : "";
		return e`<li>
      <div>
        <b>${i.name}</b>
        <small>${D(t, k(r, `consumers[${i.id}].kind`))}${a}</small>
      </div>
      <div class="selects">
        <select
          class="input"
          aria-label=${t("consumers.kind_of", { name: i.name })}
          .value=${i.kind}
          @change=${(e) => this.setKind(i, e.target.value)}
        >
          ${$e.map((n) => e`<option value=${n} ?selected=${n === i.kind}>${t(`kind.${n}`)}</option>`)}
        </select>
        ${i.kind === "submeter" ? o : e`<select
              class="input"
              aria-label=${t("consumers.runs_of", { name: i.name })}
              .value=${i.runs ?? "auto"}
              @change=${(e) => this.setRuns(i, e.target.value)}
            >
              ${i.kind === "ev" ? ut.map((n) => e`<option value=${n} ?selected=${n === (i.runs ?? "auto")}>${t(`runs.ev.${n}`)}</option>`) : dt.map((n) => e`<option value=${n} ?selected=${n === (i.runs ?? "auto")}>${t(`runs.${n}`)}</option>`)}
            </select>`}
      </div>
    </li>`;
	}
	setRuns(e, t) {
		t !== (e.runs ?? "auto") && M(this, { consumers: { [e.id]: { runs: t } } });
	}
	setKind(e, t) {
		t !== e.kind && M(this, { consumers: { [e.id]: { kind: t } } });
	}
};
C([r({ attribute: !1 })], ft.prototype, "hass", void 0), C([r({ attribute: !1 })], ft.prototype, "t", void 0), C([r({ attribute: !1 })], ft.prototype, "config", void 0), S("joe-consumers", ft);
//#endregion
//#region src/editors/household.ts
var z = class extends n {
	constructor(...e) {
		super(...e), this.leftOut = [], this.guest = !0, this.creating = !1, this.offerNew = !1;
	}
	static {
		this.styles = [d, a`
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
      .presence {
        margin-top: 16px;
        padding: 14px;
        border-radius: 12px;
        background: var(--joe-surface-2);
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
      }
      .presence .row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        margin-top: 10px;
      }
    `];
	}
	render() {
		let { t, hass: n, config: r } = this;
		if (!t || !n || !r) return o;
		let i = (this.discovery?.persons ?? []).filter((e) => A(r, `person:${e.entity_id}`) && !r.persons.some((t) => t.id === e.entity_id));
		return e`<div data-tipped>
      ${r.persons.length ? e`<ul>
            ${r.persons.map((e) => this.renderPerson(t, n, e))}
          </ul>` : e`<p class="empty">${t("household.empty")}</p>`}
      <div class="with-tip add">
        <button type="button" class="mini-btn" @click=${this.addPerson}>
          <ha-icon icon="mdi:account-plus-outline"></ha-icon>${t("household.add")}
        </button>
        ${y(t, "f_person_add")}
      </div>
      ${this.renderPresence(t, n, r)}
      ${i.length ? e`<div class="others">
            <span>${t("household.left_out")}</span>
            ${i.map((t) => e`<button type="button" class="mini-btn quiet" @click=${() => this.bringBack(t)}>
                <ha-icon icon="mdi:undo-variant"></ha-icon>${t.name}
              </button>`)}
          </div>` : o}
    </div>`;
	}
	renderPresence(t, n, r) {
		let i = r.context.presence_entity, a = e`<div class="with-tip"><b>${t("household.presence")}</b>${y(t, "household_presence")}</div>`;
		if (i) {
			let o = ["on", "home"].includes(n.states[i]?.state ?? "");
			return e`<div class="presence" data-tipped>
        ${a}
        <div class="row">
          <span class="chip ${o ? "ok" : ""}" title=${i}>${p(n, i)}</span>
          <small>${t(o ? "household.presence.on" : "household.presence.off")}</small>
        </div>
        <p>${t(i.startsWith("group.") ? "household.presence.yours_group" : "household.presence.yours")}</p>
        ${this.renderGuest(t, n, r, i)}
        <div class="row">
          <button type="button" class="mini-btn" @click=${() => void this.pickPresence()}>${t("household.presence.other")}</button>
          <button type="button" class="mini-btn quiet" @click=${() => M(this, { context: { presence_entity: null } })}>
            ${t("household.presence.stop")}
          </button>
        </div>
      </div>`;
		}
		let s = r.persons.filter((e) => e.person_entity), c = s.filter((e) => !this.leftOut.includes(e.person_entity)), l = mt(n);
		return l.length && !this.offerNew ? e`<div class="presence" data-tipped>
        ${a}
        <p>${t("household.presence.found")}</p>
        ${l.map((n) => e`<div class="row">
            <span class="chip" title=${n.entity_id}>${n.name}</span>
            <small>${n.members.join(", ")}</small>
            <button type="button" class="btn btn-primary" @click=${() => M(this, { context: { presence_entity: n.entity_id } })}>
              ${t("household.presence.use")}
            </button>
          </div>`)}
        <div class="row">
          <button type="button" class="btn btn-ghost" @click=${() => this.offerNew = !0}>${t("household.presence.new_instead")}</button>
        </div>
      </div>` : e`<div class="presence" data-tipped>
      ${a}
      <p>${t("household.presence.propose")}</p>
      <div class="row" role="group" aria-label=${t("household.presence.persons")}>
        ${s.map((t) => {
			let n = !this.leftOut.includes(t.person_entity);
			return e`<button
            type="button"
            class="mini-btn ${n ? "go" : "quiet"}"
            aria-pressed=${String(n)}
            @click=${() => this.leftOut = n ? [...this.leftOut, t.person_entity] : this.leftOut.filter((e) => e !== t.person_entity)}
          >
            ${t.name}
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
        <span id="presence-guest">${t("household.presence.guest")}</span>
      </div>
      ${this.failed ? e`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.failed}</span></div>` : o}
      <div class="row">
        <button
          type="button"
          class="btn btn-primary"
          ?disabled=${this.creating || !c.length && !this.guest}
          @click=${() => void this.createPresence(c.map((e) => e.person_entity))}
        >
          ${t(this.creating ? "household.presence.creating" : "household.presence.create")}
        </button>
        <button type="button" class="btn btn-ghost" @click=${() => void this.pickPresence()}>${t("household.presence.own")}</button>
      </div>
    </div>`;
	}
	renderGuest(t, n, r, i) {
		let { guest_switch: a, guest_tracker: s } = r.context;
		if (!a || !s) return e`<div class="guest" data-tipped>
        <div class="with-tip"><b>${t("household.guest")}</b>${y(t, "household_guest")}</div>
        <p>${t("household.guest.offer")}</p>
        ${this.failed ? e`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${this.failed}</span></div>` : o}
        <div class="row">
          <button type="button" class="btn btn-secondary" ?disabled=${this.creating} @click=${() => void this.addGuest()}>
            ${t(this.creating ? "household.presence.creating" : "household.guest.create")}
          </button>
        </div>
      </div>`;
		let c = n.states[a]?.state === "on", l = n.states[i]?.attributes.entity_id, u = !l || l.includes(s);
		return e`<div class="guest" data-tipped>
      <div class="row">
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(c)}
          aria-labelledby="guest-label"
          @click=${() => void n.callService?.("input_boolean", c ? "turn_off" : "turn_on", { entity_id: a })}
        ></button>
        <b id="guest-label">${t("household.guest")}</b>
        <small>${t(n.states[s]?.state === "home" ? "household.guest.home" : "household.guest.away")}</small>
        ${y(t, "household_guest")}
      </div>
      ${u ? o : e`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon>
            <span>${t("household.guest.add_to_group", { group: p(n, i) })}<code>- ${s}</code></span>
          </div>`}
    </div>`;
	}
	async createGuest() {
		let { t: e, hass: t } = this;
		if (!e || !t?.callApi || !t.callService) throw Error("no api");
		let n = `input_boolean.${(await t.callWS({
			type: "input_boolean/create",
			name: e("household.guest.name"),
			icon: "mdi:account-child-outline"
		})).id}`, r = `device_tracker.${pt}`;
		return await t.callApi("POST", `config/automation/config/energy_joe_${pt}`, {
			alias: e("household.guest.automation"),
			description: e("household.guest.automation_text", {
				guest: n,
				tracker: r
			}),
			triggers: [
				{
					trigger: "state",
					entity_id: n
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
					dev_id: pt,
					host_name: e("household.guest.tracker_name"),
					location_name: `{{ 'home' if is_state('${n}', 'on') else 'not_home' }}`
				}
			}],
			mode: "queued"
		}), await t.callService("device_tracker", "see", {
			dev_id: pt,
			host_name: e("household.guest.tracker_name"),
			location_name: "not_home"
		}), M(this, { context: {
			guest_switch: n,
			guest_tracker: r
		} }), r;
	}
	async addGuest() {
		this.creating = !0, this.failed = void 0;
		try {
			await this.createGuest();
		} catch (e) {
			this.failed = this.t("household.presence.failed", { error: String(e?.message ?? e) });
		} finally {
			this.creating = !1;
		}
	}
	async createPresence(e) {
		let { t, hass: n } = this;
		if (t && n) {
			this.creating = !0, this.failed = void 0;
			try {
				let r = this.guest ? this.config?.context.guest_tracker ?? await this.createGuest() : null;
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
	renderPerson(t, n, r) {
		let i = r.person_entity ? n.states[r.person_entity]?.state : void 0, a = i === "home" ? e`<small class="home">${t("household.home")}</small>` : i === "not_home" ? e`<small>${t("household.away")}</small>` : i ? e`<small>${t("household.zone", { zone: i })}</small>` : e`<small>${t("household.no_presence")}</small>`;
		return e`<li class="person">
      <div class="top">
        <span class="avatar" aria-hidden="true">${r.name.slice(0, 1).toUpperCase()}</span>
        <div class="who"><b>${r.name}</b>${a}</div>
        <button type="button" class="mini-btn quiet" @click=${() => this.removePerson(r)}>
          ${t("household.remove")}
        </button>
      </div>
      <div class="cals">
        <span class="cals-label">${t("household.calendars")}</span>
        ${r.calendars.map((i) => e`<span class="cal">
            ${p(n, i)}
            <button
              type="button"
              aria-label=${t("household.calendar_remove", { name: p(n, i) })}
              @click=${() => this.setCalendars(r, r.calendars.filter((e) => e !== i))}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </span>`)}
        <button type="button" class="mini-btn" @click=${() => this.addCalendars(r)}>
          <ha-icon icon="mdi:calendar-plus"></ha-icon>${t("household.calendar_add")}
        </button>
        ${y(t, "f_calendars")}
      </div>
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
				name: p(this.hass, n),
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
C([r({ attribute: !1 })], z.prototype, "hass", void 0), C([r({ attribute: !1 })], z.prototype, "t", void 0), C([r({ attribute: !1 })], z.prototype, "config", void 0), C([r({ attribute: !1 })], z.prototype, "discovery", void 0), C([c()], z.prototype, "leftOut", void 0), C([c()], z.prototype, "guest", void 0), C([c()], z.prototype, "creating", void 0), C([c()], z.prototype, "failed", void 0), C([c()], z.prototype, "offerNew", void 0);
var pt = "gast";
function mt(e) {
	return Object.values(e.states).filter((e) => e.entity_id.startsWith("group.")).map((e) => ({
		state: e,
		members: e.attributes.entity_id ?? []
	})).filter(({ members: e }) => e.length && e.every((e) => /^(person|device_tracker)\./.test(e))).map(({ state: t, members: n }) => ({
		entity_id: t.entity_id,
		name: p(e, t.entity_id),
		members: n.map((t) => p(e, t))
	}));
}
S("joe-household", z);
//#endregion
//#region src/components/choice.ts
var ht = "unknown", B = class extends n {
	constructor(...e) {
		super(...e), this.options = [], this.value = [], this.multiple = !1, this.exclusive = [], this.idk = "", this.label = "", this.compact = !1;
	}
	static {
		this.styles = a`
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
		return e`<div class="opts" role="group" aria-label=${this.label}>
      ${this.options.map((e) => this.renderOption(e))}
      ${this.idk ? this.renderOption({
			value: ht,
			label: this.idk
		}, "idk") : o}
    </div>`;
	}
	renderOption(t, n = "") {
		let r = this.value.includes(t.value);
		return e`<button
      type="button"
      class=${n}
      aria-pressed=${String(r)}
      ?disabled=${t.disabled}
      @click=${() => this.toggle(t.value)}
    >
      ${t.icon ? e`<ha-icon icon=${t.icon}></ha-icon>` : o}
      <span>${t.label}</span>
      ${r && this.multiple ? e`<span class="tick" aria-hidden="true"
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
C([r({ attribute: !1 })], B.prototype, "options", void 0), C([r({ attribute: !1 })], B.prototype, "value", void 0), C([r({ type: Boolean })], B.prototype, "multiple", void 0), C([r({ attribute: !1 })], B.prototype, "exclusive", void 0), C([r()], B.prototype, "idk", void 0), C([r()], B.prototype, "label", void 0), C([r({
	type: Boolean,
	reflect: !0
})], B.prototype, "compact", void 0), S("joe-choice", B);
//#endregion
//#region src/editors/tariff-form.ts
var gt = class extends n {
	constructor(...e) {
		super(...e), this.feedIn = !1, this.asQuestion = !1;
	}
	static {
		this.styles = [d, a`
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
		let { t, tariff: n } = this;
		if (!t || !n) return o;
		let r = [
			{
				value: "fixed_window",
				label: t("tariff.kind.fixed_window"),
				icon: "mdi:weather-night"
			},
			{
				value: "flat",
				label: t("tariff.kind.flat"),
				icon: "mdi:equal-box"
			},
			{
				value: "dynamic",
				label: t("tariff.kind.dynamic"),
				icon: "mdi:chart-line"
			}
		], i = e`<joe-choice
      .options=${r}
      .value=${n.kind === "unknown" ? [] : [n.kind]}
      idk=${t("ask.idk")}
      label=${t("f.tariff.kind")}
      @joe-choice=${(e) => this.emit({ kind: e.detail.value[0] ?? "unknown" })}
    ></joe-choice>`;
		return e`${this.asQuestion ? i : e`<div class="field" data-tipped>
            <div class="field-label">${t("f.tariff.kind")} ${y(t, "q_tariff")}</div>
            ${i}
          </div>`}
      ${n.kind === "fixed_window" ? this.renderWindow(t, n) : o}
      ${n.kind === "flat" ? this.renderFlat(t, n) : o}
      ${n.kind === "dynamic" ? this.renderDynamic(t, n) : o}
      ${this.feedIn ? this.renderFeedIn(t, n) : o}`;
	}
	renderWindow(t, n) {
		let r = n.window ?? {
			start: "",
			end: ""
		}, i = (e, t) => {
			let n = {
				...r,
				[e]: t
			};
			this.emit({ window: n.start && n.end ? n : null });
		};
		return e`<div class="field" data-tipped>
        <div class="field-label">${t("f.window")} ${y(t, "f_window")}</div>
        <div class="field-row">
          <input
            class="input time"
            type="time"
            aria-label=${t("f.window.start")}
            .value=${r.start}
            @change=${(e) => i("start", e.target.value)}
          />
          <span>${t("f.window.until")}</span>
          <input
            class="input time"
            type="time"
            aria-label=${t("f.window.end")}
            .value=${r.end}
            @change=${(e) => i("end", e.target.value)}
          />
        </div>
      </div>
      <div class="field" data-tipped>
        <div class="field-label">${t("f.prices")} ${y(t, "f_prices")}</div>
        <div class="field-row">
          <label class="price">${t("f.price.night")} ${this.centInput(t, n.night_price, "night_price")}</label>
          <label class="price">${t("f.price.day")} ${this.centInput(t, n.day_price, "day_price")}</label>
        </div>
      </div>`;
	}
	renderFlat(t, n) {
		return e`<div class="field" data-tipped>
      <div class="field-label">${t("f.price")} ${y(t, "f_prices")}</div>
      ${this.centInput(t, n.day_price, "day_price")}
    </div>`;
	}
	renderDynamic(t, n) {
		let r = this.hass, i = n.price_entity, a = n.window ?? {
			start: "20:00",
			end: "07:00"
		}, o = (e, t) => {
			let n = {
				...a,
				[e]: t
			};
			this.emit({ window: n.start && n.end ? n : null });
		};
		return e`<div class="field" data-tipped>
        <div class="field-label">${t("f.price_entity")} ${y(t, "f_price_entity")}</div>
        <div class="entity">
          ${i && r ? e`<span><b>${p(r, i)}</b> <small>${g(r, i, t.lang)}</small></span>` : e`<small>${t("f.price_entity.none")}</small>`}
          <button type="button" class="mini-btn" @click=${this.pickPrice}>
            <ha-icon icon="mdi:magnify"></ha-icon>${t(i ? "review.change" : "review.choose")}
          </button>
        </div>
      </div>
      <div class="field" data-tipped>
        <div class="field-label">${t("f.search")} ${y(t, "f_search")}</div>
        <div class="field-row">
          <input
            class="input time"
            type="time"
            aria-label=${t("f.search.start")}
            .value=${a.start}
            @change=${(e) => o("start", e.target.value)}
          />
          <span>${t("f.window.until")}</span>
          <input
            class="input time"
            type="time"
            aria-label=${t("f.search.end")}
            .value=${a.end}
            @change=${(e) => o("end", e.target.value)}
          />
        </div>
      </div>
      <div class="field" data-tipped>
        <div class="field-label">${t("f.surcharge")} ${y(t, "f_surcharge")}</div>
        ${this.centInput(t, n.surcharge, "surcharge")}
      </div>`;
	}
	renderFeedIn(t, n) {
		let r = this.hass;
		return e`<div class="field" data-tipped>
      <div class="field-label">${t("f.feed_in")} ${y(t, "q_feed_in")}</div>
      ${n.feed_in_entity && r ? e`<p class="field-hint">
            ${t("f.feed_in.entity", { name: p(r, n.feed_in_entity) })}
          </p>` : this.centInput(t, n.feed_in_price, "feed_in_price")}
    </div>`;
	}
	centInput(t, n, r) {
		return e`<span class="unit-input">
      <input
        class="input"
        type="number"
        inputmode="decimal"
        min="0"
        max="999"
        step="0.01"
        placeholder=${t("f.price.unknown")}
        .value=${n == null ? "" : String(Math.round(n * 1e6) / 1e4)}
        @change=${(e) => {
			let t = e.target.value, n = t === "" ? null : Number.parseFloat(t);
			this.emit({ [r]: n === null || Number.isNaN(n) ? null : Math.round(n * 100) / 1e4 });
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
			suggestions: Ee(n?.price_entity ? [{
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
C([r({ attribute: !1 })], gt.prototype, "hass", void 0), C([r({ attribute: !1 })], gt.prototype, "t", void 0), C([r({ attribute: !1 })], gt.prototype, "tariff", void 0), C([r({ attribute: !1 })], gt.prototype, "discovery", void 0), C([r({ type: Boolean })], gt.prototype, "feedIn", void 0), C([r({ type: Boolean })], gt.prototype, "asQuestion", void 0), S("joe-tariff-form", gt);
//#endregion
//#region src/editors/tariff-editor.ts
var _t = [
	"kind",
	"price_entity",
	"window",
	"night_price",
	"day_price",
	"feed_in_price",
	"feed_in_entity"
];
function vt(e, t) {
	let n = {};
	for (let r of _t) JSON.stringify(e[r]) !== JSON.stringify(t[r]) && (n[r] = t[r]);
	return n;
}
var yt = class extends n {
	constructor(...e) {
		super(...e), this.saving = !1;
	}
	static {
		this.styles = [d, a`
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
		let { t, draft: n } = this;
		return !t || !n ? o : e`<div class="sheet-title">${T(t("edit.tariff.title"))}</div>
      <joe-tariff-form
        .hass=${this.hass}
        .t=${t}
        .tariff=${n}
        .discovery=${this.discovery}
        feedIn
        @joe-tariff=${(e) => {
			this.draft = {
				...n,
				...e.detail
			};
		}}
      ></joe-tariff-form>
      <div class="actions" data-notip>
        <button type="button" class="btn btn-primary" ?disabled=${this.saving} @click=${this.save}>
          ${t("common.save")}
        </button>
        <button type="button" class="btn btn-ghost" @click=${this.close}>${t("common.cancel")}</button>
      </div>`;
	}
	async save() {
		let { config: e, draft: t } = this;
		if (!e || !t) return;
		let n = vt(e.tariff, t);
		if (Object.keys(n).length) {
			this.saving = !0;
			let e = { tariff: n };
			"kind" in n && (e.answers = { tariff: t.kind });
			let r = await M(this, e);
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
C([r({ attribute: !1 })], yt.prototype, "hass", void 0), C([r({ attribute: !1 })], yt.prototype, "t", void 0), C([r({ attribute: !1 })], yt.prototype, "config", void 0), C([r({ attribute: !1 })], yt.prototype, "discovery", void 0), C([c()], yt.prototype, "draft", void 0), C([c()], yt.prototype, "saving", void 0), S("joe-tariff-editor", yt);
//#endregion
//#region node_modules/lit-html/directive.js
var bt = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, xt = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), St = class {
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
}, { I: Ct } = v, wt = (e) => e, Tt = () => document.createComment(""), Et = (e, t, n) => {
	let r = e._$AA.parentNode, i = t === void 0 ? e._$AB : t._$AA;
	if (n === void 0) n = new Ct(r.insertBefore(Tt(), i), r.insertBefore(Tt(), i), e, e.options);
	else {
		let t = n._$AB.nextSibling, a = n._$AM, o = a !== e;
		if (o) {
			let t;
			n._$AQ?.(e), n._$AM = e, n._$AP !== void 0 && (t = e._$AU) !== a._$AU && n._$AP(t);
		}
		if (t !== i || o) {
			let e = n._$AA;
			for (; e !== t;) {
				let t = wt(e).nextSibling;
				wt(r).insertBefore(e, i), e = t;
			}
		}
	}
	return n;
}, Dt = (e, t, n = e) => (e._$AI(t, n), e), Ot = {}, kt = (e, t = Ot) => e._$AH = t, At = (e) => e._$AH, jt = (e) => {
	e._$AR(), e._$AA.remove();
}, Mt = (e, t, n) => {
	let r = /* @__PURE__ */ new Map();
	for (let i = t; i <= n; i++) r.set(e[i], i);
	return r;
}, Nt = xt(class extends St {
	constructor(e) {
		if (super(e), e.type !== bt.CHILD) throw Error("repeat() can only be used in text expressions");
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
		let i = At(e), { values: a, keys: o } = this.dt(t, n, r);
		if (!Array.isArray(i)) return this.ut = o, a;
		let s = this.ut ??= [], c = [], l, u, d = 0, f = i.length - 1, p = 0, m = a.length - 1;
		for (; d <= f && p <= m;) if (i[d] === null) d++;
		else if (i[f] === null) f--;
		else if (s[d] === o[p]) c[p] = Dt(i[d], a[p]), d++, p++;
		else if (s[f] === o[m]) c[m] = Dt(i[f], a[m]), f--, m--;
		else if (s[d] === o[m]) c[m] = Dt(i[d], a[m]), Et(e, c[m + 1], i[d]), d++, m--;
		else if (s[f] === o[p]) c[p] = Dt(i[f], a[p]), Et(e, i[d], i[f]), f--, p++;
		else if (l === void 0 && (l = Mt(o, p, m), u = Mt(s, d, f)), l.has(s[d])) {
			if (l.has(s[f])) {
				let t = u.get(o[p]), n = t === void 0 ? null : i[t];
				if (n === null) {
					let t = Et(e, i[d]);
					Dt(t, a[p]), c[p] = t;
				} else c[p] = Dt(n, a[p]), Et(e, i[d], n), i[t] = null;
				p++;
			} else jt(i[f]), f--;
		} else jt(i[d]), d++;
		for (; p <= m;) {
			let t = Et(e, c[m + 1]);
			Dt(t, a[p]), c[p++] = t;
		}
		for (; d <= f;) {
			let e = i[d++];
			e !== null && jt(e);
		}
		return this.ut = o, kt(e, c), ee;
	}
}), Pt = 1435, Ft = 1440;
function It(e, t) {
	let n = (t ?? "").trim();
	return !n || /^profile?\s*\d+$/i.test(n) ? e : `${e} ${n}`;
}
var Lt = {
	normal: "mdi:home-outline",
	holiday: "mdi:calendar-star",
	away: "mdi:home-export-outline",
	home_office: "mdi:laptop"
}, Rt = {
	all: 1,
	week_weekend: 2,
	each: 7
};
function zt(e, t) {
	return e === "all" ? 0 : e === "week_weekend" ? t < 5 ? 0 : 1 : t;
}
function Bt(e) {
	return `${String(Math.floor(e / 60)).padStart(2, "0")}:${String(e % 60).padStart(2, "0")}`;
}
function Vt(e) {
	let t = /^(\d{1,2}):(\d{2})/.exec(e);
	if (!t) return null;
	let n = Number(t[1]), r = Number(t[2]);
	return n < 24 && r < 60 ? n * 60 + r : null;
}
function Ht(e, t) {
	let n;
	for (let [r, i] of e) r <= t && (n = i);
	return n;
}
function Ut(e) {
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
function Wt(e, t, n, r) {
	let i = Math.round(e / t) * t;
	return Math.round(Math.min(r, Math.max(n, i)) * 10) / 10;
}
function Gt(e, t) {
	let n = (e) => e.map(([e, t]) => [e, t]), r = (t) => n(e.curves[zt(e.split, t)] ?? e.curves[0]);
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
function Kt(e) {
	let t = 0, n = -1;
	for (let r = 0; r < e.length; r++) {
		let i = e[r + 1]?.[0] ?? 1440;
		i - e[r][0] > n && (t = e[r][0], n = i - t);
	}
	if (n < 0) return null;
	let r = Math.min(Pt, Math.round((t + n / 2) / 15) * 15);
	return r > t && !e.some(([e]) => e === r) ? r : null;
}
function qt(e) {
	if (e.length !== 6) return "count";
	let t = /* @__PURE__ */ new Set();
	for (let n of e) {
		for (let e of n.tags) {
			if (t.has(e)) return "tags";
			t.add(e);
		}
		if (n.curves.length !== Rt[n.split]) return "curves";
		for (let e of n.curves) {
			if (!e.length || e.length > 12 || e[0][0] !== 0) return "points";
			for (let t = 1; t < e.length; t++) if (e[t][0] <= e[t - 1][0] || e[t][0] % 5) return "points";
		}
	}
	return null;
}
//#endregion
//#region src/components/week-bar.ts
var V = class extends n {
	constructor(...e) {
		super(...e), this.points = [], this.mode = "heat", this.now = null, this.compact = !1, this.lang = "en", this.label = "", this.offText = "off";
	}
	static {
		this.styles = a`
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
		let t = this.points, n = t.map(([e, n], r) => ({
			from: e,
			to: t[r + 1]?.[0] ?? 1440,
			value: n
		}));
		return e`<div class="track">
        <div class="bar" role="img" aria-label=${this.label}>
          ${n.map(({ from: t, to: n, value: r }) => {
			let i = `left:${t / Ft * 100}%;width:${(n - t) / Ft * 100}%;`;
			return r === "off" ? e`<span class="seg off" style=${i}>${this.compact ? o : this.offText}</span>` : e`<span class="seg" style=${i + this.color(r)}>
              ${this.compact ? o : `${b(this.lang, r, 1)}°`}
            </span>`;
		})}
        </div>
        ${this.now == null ? o : e`<span class="now" style=${`left:${this.now / Ft * 100}%`}></span>`}
      </div>
      ${this.compact ? o : e`<div class="ticks" aria-hidden="true">
            ${[
			0,
			6,
			12,
			18,
			24
		].map((t) => e`<span style=${`left:${t / 24 * 100}%`}>${t}</span>`)}
          </div>`}`;
	}
	color(e) {
		let t = this.mode === "cool" ? (28 - e) / 10 : (e - 16) / 10, n = Math.round(25 + Math.min(1, Math.max(0, t)) * 75), r = this.mode === "cool" ? "cool" : "heat";
		return `background:color-mix(in srgb, var(--wk-${r}) ${n}%, var(--wk-${r}-weak));`;
	}
};
C([r({ attribute: !1 })], V.prototype, "points", void 0), C([r()], V.prototype, "mode", void 0), C([r({ attribute: !1 })], V.prototype, "now", void 0), C([r({
	type: Boolean,
	reflect: !0
})], V.prototype, "compact", void 0), C([r()], V.prototype, "lang", void 0), C([r()], V.prototype, "label", void 0), C([r()], V.prototype, "offText", void 0), S("joe-week-bar", V);
//#endregion
//#region src/editors/week-editor.ts
var Jt = [
	"all",
	"week_weekend",
	"each"
], Yt = "23:00", Xt = "06:30";
function Zt(e, t, n = "long") {
	return new Intl.DateTimeFormat(e, {
		weekday: n,
		timeZone: "UTC"
	}).format(new Date(Date.UTC(2024, 0, 1 + t)));
}
var H = class extends n {
	constructor(...e) {
		super(...e), this.entityId = "", this.fetched = !1, this.failed = !1, this.drafts = {}, this.selected = {
			heat: 0,
			cool: 0
		}, this.open = 0, this.creating = !1, this.saving = !1, this.errors = {}, this.fitted = {}, this.loaded = !1, this.requested = !1;
	}
	static {
		this.styles = [d, a`
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
      a.ha-link {
        color: inherit;
        text-decoration: underline;
        text-decoration-color: var(--joe-line-2);
        text-underline-offset: 3px;
      }
      a.ha-link:hover {
        text-decoration-color: var(--joe-amber);
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
		e.has("entityId") && e.get("entityId") && (this.loaded = !1, this.requested = !1, this.fetched = !1, this.device = void 0, this.mode = void 0, this.drafts = {}, this.errors = {}, this.fitted = {}, this.notice = void 0, this.rowError = void 0), this.hass && !this.requested && (this.requested = !0, this.load()), (e.has("config") || e.has("entityId")) && this.config && this.entityId && !this.loaded && (this.loaded = !0, this.drafts = structuredClone(this.room?.week?.modes ?? {}), this.fitDrafts(rt), this.pickMode());
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
		this.fetched = !0, this.fitDrafts(rt), this.pickMode();
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
					let a = Wt(i, t, n, r);
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
		return rt.filter((e) => this.device?.hvac_modes.includes(e));
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
		return Ut(this.hass?.config?.time_zone);
	}
	openToday() {
		let e = this.profiles?.[this.index];
		this.open = e ? zt(e.split, this.now.weekday) : 0;
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
		let { t, device: n } = this;
		if (!t || !this.config) return o;
		let r = e`<div class="sheet-title">${T(t("week.title"))}</div>`;
		if (!n) return e`${r}
        ${this.fetched ? e`<div class="note warn">
              <ha-icon icon="mdi:alert-outline"></ha-icon><span>${t(this.failed ? "week.load_failed" : "week.device_missing")}</span>
            </div>` : e`<p class="field-hint">${t("week.loading")}</p>`}
        <div class="actions" data-notip>
          <button type="button" class="btn btn-secondary" @click=${this.close}>${t("mode.close")}</button>
        </div>`;
		let i = this.modes, a = this.mode, s = this.profiles;
		return e`${r}
      <div class="head">
        <b>${me(n.device_id, n.name, t("climate.open_device", { id: n.entity_id }))}</b>
        ${n.area ? e`<span class="chip">${n.area}</span>` : o}
      </div>
      ${i.length ? e`<div class="field" data-tipped>
            <div class="field-label">${t("week.modes")} ${y(t, "week_mode")}</div>
            <span class="seg" role="group" aria-label=${t("week.modes")}>
              ${i.map((n) => e`<button type="button" aria-pressed=${String(n === a)} @click=${() => this.setMode(n)}>
                  ${t(`week.mode.${n}`)}${this.errors[n] ? e`<span class="dot bad" title=${this.errors[n]}></span>` : this.isDirty(n) ? e`<span class="dot" title=${t("week.unsaved")}></span>` : o}
                </button>`)}
            </span>
          </div>` : e`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${t("week.no_modes")}</span></div>`}
      ${a ? s ? this.renderSet(t, a, s) : this.renderEmpty(t, a) : o}
      <div class="foot" data-notip>
        ${a && this.errors[a] ? e`<div class="note warn" role="alert">
              <ha-icon icon="mdi:alert-outline"></ha-icon><span>${t("week.save_failed", {
			mode: t(`week.mode.${a}`),
			error: this.errors[a]
		})}</span>
            </div>` : o}
        <div class="actions">
          <button
            type="button"
            class="btn btn-primary"
            ?disabled=${this.saving || !i.length}
            @pointerdown=${() => this.pressShown = this.rowError ?? null}
            @click=${this.save}
          >
            ${t(this.saving ? "week.saving" : "common.save")}
          </button>
          <button type="button" class="btn btn-ghost" @click=${this.close}>${t("common.cancel")}</button>
          ${i.some((e) => this.isDirty(e)) ? e`<span class="chip warn">${t("week.unsaved")}</span>` : o}
        </div>
      </div>`;
	}
	renderEmpty(t, n) {
		return e`<div class="empty" data-tipped>
      <p>${t("week.empty", { mode: t(`week.mode.${n}`) })}</p>
      <span class="with-tip">
        <button type="button" class="btn btn-primary" ?disabled=${this.creating} @click=${() => void this.create(n)}>
          ${t(this.creating ? "week.creating" : "week.create")}
        </button>
        ${y(t, "week_create")}
      </span>
    </div>`;
	}
	renderSet(t, n, r) {
		let i = this.status?.rooms?.[this.entityId], a = i?.kind === "week" && i.mode === n ? i.profile?.index : void 0, s = this.now, c = this.index, l = r[c];
		return e`<div class="field" data-tipped>
        <div class="field-label">${t("week.profiles")} ${y(t, "week_profiles")}</div>
        <div class="tiles" role="group" aria-label=${t("week.profiles")}>
          ${r.map((r, i) => {
			let l = r.name || t("week.profile", { n: i + 1 });
			return e`<button
              type="button"
              class="tile"
              aria-pressed=${String(i === c)}
              @click=${() => this.select(i)}
            >
              <span class="tile-top">
                <span class="no" aria-hidden="true">${i + 1}</span>
                <span class="name">${l}</span>
                ${i === a ? e`<span class="running" role="img" aria-label=${t("week.running")} title=${t("week.running")}></span>` : o}
              </span>
              <span class="tile-tags">
                ${r.tags.map((n) => e`<span><ha-icon icon=${Lt[n]}></ha-icon>${t(`week.tag.${n}`)}</span>`)}
              </span>
              <joe-week-bar
                compact
                .points=${r.curves[zt(r.split, s.weekday)] ?? r.curves[0] ?? []}
                .now=${s.minute}
                mode=${n}
                lang=${t.lang}
                label=${t("week.curve", { label: `${l}, ${t("week.today")}` })}
              ></joe-week-bar>
            </button>`;
		})}
        </div>
        ${r.some((e) => e.tags.includes("normal")) ? o : e`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${t("week.no_normal")}</span></div>`}
      </div>
      ${l ? this.renderProfile(t, n, r, l) : o}`;
	}
	renderProfile(t, n, r, i) {
		let a = this.index, s = this.status?.day, c = !s || s.home_office_available, l = s?.home_office_reason ?? "no_calendar";
		return e`<div class="profile">
      <div class="field" data-tipped>
        <div class="field-label"><label for="week-name">${t("week.name")}</label> ${y(t, "week_name")}</div>
        <input
          id="week-name"
          class="input"
          type="text"
          maxlength="30"
          placeholder=${t("week.profile", { n: a + 1 })}
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
        <div class="field-label">${t("week.tags")} ${y(t, "week_tags")}</div>
        <div class="tags" role="group" aria-label=${t("week.tags")}>
          ${nt.map((n) => {
			let a = i.tags.includes(n), o = n === "home_office" && !c && !a;
			return e`<button
              type="button"
              class="mini-btn tag-btn"
              aria-pressed=${String(a)}
              ?disabled=${o}
              title=${o ? t(`week.ho.${l}`) : ""}
              @click=${() => this.toggleTag(r, n)}
            >
              <ha-icon icon=${Lt[n]}></ha-icon>${t(`week.tag.${n}`)}
            </button>`;
		})}
        </div>
        ${c ? o : e`<p class="field-hint">${t(`week.ho.${l}`)}</p>
              <div>
                <button type="button" class="mini-btn quiet" @click=${this.toLearn}>
                  <ha-icon icon="mdi:calendar-text-outline"></ha-icon>${t("week.ho.rules")}
                </button>
              </div>`}
        ${i.tags.length ? o : e`<p class="field-hint">${t("week.untagged")}</p>`} ${this.noticeAt("tags")}
      </div>
      <div class="field" data-tipped>
        <div class="field-label">${t("week.days")} ${y(t, "week_split")}</div>
        <span class="seg full" role="group" aria-label=${t("week.days")}>
          ${Jt.map((n) => e`<button type="button" aria-pressed=${String(i.split === n)} @click=${() => this.setSplit(n)}>
              ${t(`week.split.${n}`)}
            </button>`)}
        </span>
      </div>
      ${this.noticeAt("days")} ${this.renderGroups(t, n, i)}
    </div>`;
	}
	noticeAt(t) {
		return this.notice?.at === t ? e`<div class="note" role="status"><ha-icon icon="mdi:information-outline"></ha-icon><span>${this.notice.text}</span></div>` : o;
	}
	groupLabel(e, t, n) {
		return t === "all" ? e("week.group.all") : t === "week_weekend" ? e(n === 0 ? "week.group.weekdays" : "week.group.weekend") : Zt(e.lang, n);
	}
	renderGroups(t, n, r) {
		let i = this.now, a = zt(r.split, i.weekday), s = r.curves.length > 1, { step: c, min: l, max: u } = this.limits, d = this.room;
		return e`<div class="field" data-tipped>
      <div class="field-label">${t("week.points")} ${y(t, "week_points")}</div>
      <p class="field-hint">
        ${t("week.limits", {
			min: b(t.lang, l, 1),
			max: b(t.lang, u, 1),
			step: b(t.lang, c, 2)
		})}
      </p>
      ${this.fitted[n] ? e`<div class="note" role="status"><ha-icon icon="mdi:information-outline"></ha-icon><span>${t("week.fitted")}</span></div>` : o}
      ${d?.night_off ? e`<p class="field-hint">
            ${this.config?.climate?.night_by === "entity" ? t("week.night_entity", { until: d.night_until ?? Xt }) : t("week.night_time", {
			from: d.night_from ?? Yt,
			until: d.night_until ?? Xt
		})}
          </p>` : o}
      <div class="groups">
        ${r.curves.map((d, f) => {
			let p = this.groupLabel(t, r.split, f), m = !s || this.open === f, h = e`<span class="day-label">
              ${s ? e`<ha-icon icon=${m ? "mdi:chevron-down" : "mdi:chevron-right"}></ha-icon>` : o}${p}
              ${f === a ? e`<span class="chip ok">${t("week.today")}</span>` : o}
            </span>
            <joe-week-bar
              .points=${d}
              .now=${f === a ? i.minute : null}
              mode=${n}
              lang=${t.lang}
              offText=${t("week.off")}
              label=${t("week.curve", { label: p })}
            ></joe-week-bar>`;
			return e`<div class="group ${m ? "open" : ""}">
            ${s ? e`<button type="button" class="group-head" aria-expanded=${String(m)} @click=${() => this.openGroup(f)}>${h}</button>` : e`<div class="group-head">${h}</div>`}
            ${m ? this.renderPoints(t, r, f, d, {
				step: c,
				min: l,
				max: u
			}) : o}
          </div>`;
		})}
      </div>
    </div>`;
	}
	renderPoints(t, n, r, i, a) {
		let { step: s, min: c, max: l } = a, u = b(t.lang, s, 2), d = this.rowError?.curve === r ? this.rowError : void 0;
		return e`<div class="points" role="list" aria-label=${t("week.points")}>
        ${Nt(i, ([e]) => e, ([n, i], a) => {
			let f = Bt(n);
			return e`<div class="point" role="listitem">
              ${a === 0 ? e`<span class="time fixed" title=${t("week.point.first")}>00:00</span>` : e`<input
                    class="input time"
                    type="time"
                    step="300"
                    required
                    aria-label=${t("week.point.time")}
                    .value=${f}
                    @blur=${(e) => this.setTime(r, a, e.target)}
                    @keydown=${(e) => e.key === "Enter" && e.target.blur()}
                  />`}
              <span class="value">
                ${i === "off" ? e`<span class="off-text">${t("week.off")}</span>` : e`<button
                        type="button"
                        class="mini-btn step"
                        aria-label=${t("week.point.less", { step: u })}
                        ?disabled=${i <= c}
                        @click=${() => this.setValue(r, a, i - s)}
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
                        aria-label=${t("week.point.value", { time: f })}
                        .value=${String(i)}
                        @change=${(e) => {
				let t = e.target, n = Number.parseFloat(t.value.replace(",", "."));
				t.value = String(Number.isFinite(n) ? this.setValue(r, a, n) : i);
			}}
                      />
                      <button
                        type="button"
                        class="mini-btn step"
                        aria-label=${t("week.point.more", { step: u })}
                        ?disabled=${i >= l}
                        @click=${() => this.setValue(r, a, i + s)}
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
                  aria-checked=${String(i === "off")}
                  aria-label=${t("week.point.off", { time: f })}
                  @click=${() => this.toggleOff(r, a)}
                ></button>
                <span aria-hidden="true">${t("week.off")}</span>
              </span>
              ${a === 0 ? e`<span class="del"></span>` : e`<button
                    type="button"
                    class="mini-btn quiet del"
                    aria-label=${t("week.point.delete", { time: f })}
                    title=${t("week.point.delete", { time: f })}
                    @click=${() => this.removePoint(r, a)}
                  >
                    <ha-icon icon="mdi:delete-outline"></ha-icon>
                  </button>`}
            </div>
            ${d?.point === a ? e`<p class="row-error" role="alert">${d.text}</p>` : o}`;
		})}
      </div>
      <div class="point-actions">
        <span class="with-tip" data-tipped>
          <button type="button" class="mini-btn" ?disabled=${i.length >= 12} @click=${() => this.addPoint(r)}>
            <ha-icon icon="mdi:plus"></ha-icon>${t("week.point.add")}
          </button>
          ${y(t, "week_add")}
        </span>
        ${n.curves.length > 1 ? this.renderCopy(t, n, r) : o}
      </div>
      ${i.length >= 12 ? e`<p class="field-hint">${t("week.point.max")}</p>` : o} ${this.noticeAt("points")}`;
	}
	renderCopy(t, n, r) {
		let i = n.split === "week_weekend" ? [{
			value: String(1 - r),
			label: t(r === 0 ? "week.group.weekend" : "week.group.weekdays")
		}] : [
			{
				value: "all",
				label: t("week.copy.all")
			},
			{
				value: "weekdays",
				label: t("week.group.weekdays")
			},
			{
				value: "weekend",
				label: t("week.group.weekend")
			},
			...[
				0,
				1,
				2,
				3,
				4,
				5,
				6
			].filter((e) => e !== r).map((e) => ({
				value: String(e),
				label: Zt(t.lang, e)
			}))
		];
		return e`<span class="with-tip" data-tipped>
      <select
        class="input copy"
        aria-label=${t("week.copy")}
        @change=${(e) => {
			let t = e.target, n = i.find((e) => e.value === t.value);
			t.value = "", n && this.copyTo(r, n.value, n.label);
		}}
      >
        <option value="" selected disabled>${t("week.copy")}</option>
        ${i.map((t) => e`<option value=${t.value}>${t.label}</option>`)}
      </select>
      ${y(t, "week_copy")}
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
			a >= 0 && (n[a].tags = n[a].tags.filter((e) => e !== t)), e.tags = nt.filter((n) => n === t || e.tags.includes(n));
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
			t.curves = Gt(t, e), t.split = e;
		});
		let i = Rt[e] > Rt[r] ? t("week.split.split") : r === "each" && e === "week_weekend" ? t("week.split.merged_days") : t("week.split.merged", { first: r === "each" ? Zt(t.lang, 0) : t("week.group.weekdays") });
		this.notice = {
			text: i,
			at: "days"
		}, this.open = zt(e, this.now.weekday);
	}
	setTime(e, t, n) {
		let r = this.t, i = this.profiles?.[this.index]?.curves[e];
		if (!i) return;
		let a = i[t][0], o = Vt(n.value);
		if (o == null) {
			n.value = Bt(a);
			return;
		}
		let s = Math.min(Pt, Math.max(5, Math.round(o / 5) * 5));
		if (s === a) {
			n.value = Bt(a);
			return;
		}
		if (i.some(([e], n) => n !== t && e === s)) {
			n.value = Bt(a), this.rowError = {
				curve: e,
				point: t,
				text: r("week.point.duplicate", { time: Bt(s) })
			};
			return;
		}
		n.value = Bt(s), this.changeCurve(e, (e) => {
			e[t][0] = s;
		});
	}
	setValue(e, t, n) {
		let { step: r, min: i, max: a } = this.limits, o = Wt(n, r, i, a);
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
			o = Wt(Number(e ?? s ?? this.fallbackValue()), r, i, a);
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
		let r = Kt(n);
		if (r == null) {
			this.notice = {
				text: t("week.point.no_room"),
				at: "points"
			};
			return;
		}
		let i = Ht(n, r) ?? this.fallbackValue();
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
					[e]: Qt(t)
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
			let n = qt(this.drafts[t]);
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
			let n = Qt(t);
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
	toLearn() {
		this.dispatchEvent(new CustomEvent("joe-navigate", {
			detail: { page: "learn" },
			bubbles: !0,
			composed: !0
		}));
	}
	close() {
		this.dispatchEvent(new CustomEvent("joe-close", {
			bubbles: !0,
			composed: !0
		}));
	}
};
C([r({ attribute: !1 })], H.prototype, "hass", void 0), C([r({ attribute: !1 })], H.prototype, "t", void 0), C([r({ attribute: !1 })], H.prototype, "config", void 0), C([r({ attribute: !1 })], H.prototype, "status", void 0), C([r({ attribute: !1 })], H.prototype, "entityId", void 0), C([c()], H.prototype, "device", void 0), C([c()], H.prototype, "fetched", void 0), C([c()], H.prototype, "failed", void 0), C([c()], H.prototype, "drafts", void 0), C([c()], H.prototype, "mode", void 0), C([c()], H.prototype, "selected", void 0), C([c()], H.prototype, "open", void 0), C([c()], H.prototype, "notice", void 0), C([c()], H.prototype, "rowError", void 0), C([c()], H.prototype, "creating", void 0), C([c()], H.prototype, "saving", void 0), C([c()], H.prototype, "errors", void 0), C([c()], H.prototype, "fitted", void 0);
function Qt(e) {
	return String(e?.message ?? e);
}
S("joe-week-editor", H);
//#endregion
//#region src/fonts.ts
var $t = [
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
function en() {
	if (document.getElementById("energy-joe-fonts")) return;
	let e = document.createElement("style");
	e.id = "energy-joe-fonts", e.textContent = $t.map(([e, t, n, r]) => `@font-face{font-family:"${e}";font-style:${n};font-weight:${t};font-display:swap;src:url("${ue(`fonts/${r}.woff2`)}") format("woff2")}`).join("\n"), document.head.appendChild(e);
}
//#endregion
//#region src/components/look-back.ts
function tn(e, t, n = "EUR", r = !1) {
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
function nn(e, t = "EUR") {
	return new Intl.NumberFormat(e, {
		style: "currency",
		currency: t
	}).formatToParts(0).find((e) => e.type === "currency")?.value ?? t;
}
function rn(e) {
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
function an(e, t) {
	return t === 1 ? e("learn.nights.one") : e("learn.nights.many", { count: t });
}
//#endregion
//#region src/pages/climate.ts
var on = {
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
}, sn = 15, cn = 240;
function ln(e, t) {
	let n = /^week_program_(\d+)$/.exec(e);
	return n ? Number(n[1]) : t + 1;
}
var un = "https://my.home-assistant.io/redirect/config_flow_start/?domain=proximity";
function dn(e) {
	return JSON.stringify(Object.keys(e).sort().map((t) => [
		t,
		e[t]?.name ?? "",
		e[t]?.tags ?? []
	]));
}
var G = class extends n {
	constructor(...e) {
		super(...e), this.failed = !1, this.metersOpen = !1, this.query = "", this.holdUntil = {}, this.pending = {}, this.logOpen = !1, this.moved = {}, this.weekError = {};
	}
	static {
		this.styles = [d, a`
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
      .row.chips > span:first-child {
        flex: 0 1 auto;
      }
      a.ha-link {
        color: inherit;
        text-decoration: underline;
        text-decoration-color: var(--joe-line-2);
        text-underline-offset: 3px;
      }
      a.ha-link:hover {
        text-decoration-color: var(--joe-amber);
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
      details.ent code {
        display: block;
        margin-top: 2px;
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 12px;
        color: var(--joe-ink-2);
        overflow-wrap: anywhere;
      }
      .fold {
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
      .row.hold,
      .row.tight {
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
      .log b {
        font-weight: 600;
        overflow-wrap: anywhere;
      }
      .chips-line {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        flex: 1 1 140px;
        min-width: 0;
      }
      @media (max-width: 760px) {
        .line {
          grid-template-columns: 1fr;
        }
        .log li {
          grid-template-columns: 1fr;
          gap: 0;
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
		super.connectedCallback(), this.load();
	}
	willUpdate(e) {
		if (e.has("state") && Object.keys(this.pending).length) {
			let e = this.state?.config.climate?.rooms ?? {}, t = Object.fromEntries(Object.entries(this.pending).filter(([t, n]) => dn(e[t]?.device_profiles ?? {}) !== dn(n)));
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
			this.found = await this.hass?.callWS({ type: "energy_joe/climate/devices" }), this.failed = !1;
		} catch {
			this.failed = !0;
		}
	}
	render() {
		let { t, state: n } = this;
		if (!t || !n) return o;
		let r = n.config.climate ?? {
			enabled: !1,
			rooms: {}
		}, i = this.found?.devices ?? [], a = [...new Set(i.map((e) => e.area ?? t("climate.no_area")))];
		return e`<div class="wrap">
      <div class="intro">
        <div>
          ${T(t("climate.title"))} ${w}
          <p class="lead">${t("climate.lead")}</p>
        </div>
        <joe-pose name="relax"></joe-pose>
      </div>
      ${this.renderMain(t, n, r.enabled)} ${this.renderPresence(t, n)} ${this.renderToday(t, n)}
      ${this.renderNightSource(t, n)}
      ${i.length ? this.renderMeters(t, n, i) : o}
      ${this.failed ? e`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${t("climate.failed")}</span></div>` : o}
      ${this.found && !i.length ? e`<p class="hint">${t("climate.none")}</p>` : o}
      ${a.map((r) => e`<div class="group-label">${r}</div>
          <div class="grid">
            ${i.filter((e) => (e.area ?? t("climate.no_area")) === r).map((e) => this.renderDevice(t, n, e))}
          </div>`)}
      ${n.climate?.log?.length ? this.renderLog(t, n.climate.log, i) : o}
    </div>`;
	}
	renderLog(t, n, r) {
		let i = [...n].reverse(), a = Object.fromEntries(r.map((e) => [e.entity_id, e.name]));
		return e`<section class="card" data-tipped>
      <div class="head">
        <button type="button" class="fold" aria-expanded=${String(this.logOpen)} @click=${() => this.logOpen = !this.logOpen}>
          <ha-icon icon=${this.logOpen ? "mdi:chevron-down" : "mdi:chevron-right"}></ha-icon>
          <span class="eyebrow"><ha-icon icon="mdi:clipboard-text-clock-outline"></ha-icon>${t("climate.log")}</span>
          <span class="chip">${i.length}</span>
        </button>
        ${y(t, "climate_log")}
      </div>
      ${this.logOpen ? e`<ul class="log">
            ${i.map((n) => e`<li>
                <time>${W(t.lang, n.at, "short")} ${n.at.slice(11, 16)}</time>
                <span>
                  <b>${a[n.entity] ?? this.hass?.states[n.entity]?.attributes.friendly_name ?? n.entity}</b>
                  · ${t.optional(`climate.log.${n.what}`) ?? n.what}
                </span>
              </li>`)}
          </ul>` : o}
    </section>`;
	}
	renderMain(t, n, r) {
		return e`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:thermostat-auto"></ha-icon>${t("climate.enabled")}</div>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(r)}
          aria-label=${t("climate.enabled")}
          @click=${() => M(this, { climate: { enabled: !r } })}
        ></button>
        ${y(t, "climate_enabled")}
      </div>
      <p class="hint">${t(n.mode === "live" ? "climate.live" : "climate.not_live")}</p>
    </section>`;
	}
	renderPresence(t, n) {
		let r = n.climate, i = r?.home ?? [], a = Object.entries(r?.arrivals ?? this.found?.arrivals ?? {}), s = Object.fromEntries(n.config.persons.map((e) => [e.person_entity, e.name])), c = n.config.context.presence_entity ?? null, l = !!c && ["home", "on"].includes(this.hass?.states[c]?.state ?? "");
		return e`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:home-account"></ha-icon>${t("climate.presence")}</div>
        ${y(t, "climate_presence")}
      </div>
      <p class="now">${i.length ? t("climate.home", { names: i.join(", ") }) : t("climate.nobody")}</p>
      ${a.map(([n, r]) => e`<p class="hint">
          ${t(`climate.way.${r.direction === "towards" ? "towards" : r.direction === "away_from" ? "away" : "other"}`, {
			name: s[n] ?? this.hass?.states[n]?.attributes.friendly_name ?? n,
			km: r.km == null ? "–" : b(t.lang, r.km, 1)
		})}
          ${r.direction === "towards" && r.minutes != null ? t(r.source ? "climate.way.minutes_route" : "climate.way.minutes_guess", { minutes: r.minutes }) : o}
        </p>`)}
      ${Object.entries(r?.usual ?? {}).map(([n, r]) => e`<p class="hint">
          ${t("climate.usual", {
			name: s[n] ?? this.hass?.states[n]?.attributes.friendly_name ?? n,
			time: `${String(Math.floor(r / 60)).padStart(2, "0")}:${String(r % 60).padStart(2, "0")}`
		})}
        </p>`)}
      <div class="row" data-tipped>
        <span id="route-eta">${t("climate.route_eta")}</span>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(n.config.climate?.route_eta ?? !0)}
          aria-labelledby="route-eta"
          @click=${() => M(this, { climate: { route_eta: !(n.config.climate?.route_eta ?? !0) } })}
        ></button>
        ${y(t, "climate_route_eta")}
      </div>
      ${this.found && !this.found.proximity ? e`<p class="hint">
            ${t("climate.no_proximity")}
            <a href=${un} target="_blank" rel="noreferrer noopener">${t("climate.add_proximity")}</a>
          </p>` : o}
      ${r?.free_day && !r.day ? e`<p class="hint">${t("climate.free_day")}</p>` : o}
      <div class="row" data-tipped>
        <span>${t("climate.away_after")}</span>
        <input
          class="input short"
          type="number"
          inputmode="numeric"
          min="0"
          max=${cn}
          step="1"
          aria-label=${t("climate.away_after")}
          .value=${String(n.config.climate?.away_after_min ?? sn)}
          @change=${(e) => {
			let t = e.target, r = Math.round(Number.parseFloat(t.value.replace(",", ".")));
			if (!Number.isFinite(r)) {
				t.value = String(n.config.climate?.away_after_min ?? sn);
				return;
			}
			let i = Math.min(cn, Math.max(0, r));
			t.value = String(i), M(this, { climate: { away_after_min: i } });
		}}
        />
        <span>${t("climate.away_after.unit")}</span>
        ${y(t, "climate_away_after")}
      </div>
      <div class="row" data-tipped>
        ${c ? e`<span>${t("climate.presence_from")}</span>
              <span class="chip ${l ? "ok" : ""}" title=${c}>
                ${this.hass?.states[c]?.attributes.friendly_name ?? c}
              </span>` : e`<span>${t("climate.presence_missing")}</span>`}
        <button type="button" class="btn btn-secondary" @click=${() => this.editHousehold()}>
          ${t(c ? "climate.presence_change" : "climate.presence_create")}
        </button>
        ${y(t, "climate_presence_entity")}
      </div>
    </section>`;
	}
	renderToday(t, n) {
		let r = n.climate?.day, i = n.config.context.free_day_entities ?? [], a = r ? r.holiday ? "holiday" : r.weekend && r.free ? "weekend" : "workday" : null, s = r?.labels_state ?? (r?.labels_at ? "ok" : "unread"), c = s === "ok" && r?.labels_at ? this.clockOf(t, r.labels_at) : null;
		return e`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:calendar-today"></ha-icon>${t("climate.today")}</div>
        ${y(t, "climate_today")}
      </div>
      ${a ? e`<p class="now">${t(`climate.today.${a}`)}</p>` : o}
      ${r ? e`<p class="hint">
            ${r.home_office_available ? s === "ok" ? r.home_office.length ? t("climate.today.ho", { names: r.home_office.join(", ") }) : t("climate.today.ho_none") : t(`climate.today.labels_${s}`) : t(`week.ho.${r.home_office_reason ?? "no_calendar"}`)}
            ${c ? t("climate.today.read_at", { time: c }) : o}
          </p>` : o}
      <div data-tipped>
        <div class="row">
          <span>${t("climate.today.free_by")}</span>
          ${y(t, "climate_free_entities")}
        </div>
        <div class="row tight">
          <span class="chips-line">
            ${i.length ? i.map((t) => {
			let n = [
				"on",
				"true",
				"home"
			].includes(this.hass?.states[t]?.state ?? "");
			return e`<span class="chip ${n ? "ok" : ""}" title=${t}>
                    ${this.hass?.states[t]?.attributes.friendly_name ?? t}
                  </span>`;
		}) : e`<small class="hint">${t("climate.today.free_none")}</small>`}
          </span>
          <button type="button" class="btn btn-secondary" @click=${() => void this.pickFree()}>
            ${t(i.length ? "climate.today.free_change" : "climate.today.free_pick")}
          </button>
        </div>
      </div>
      <p class="hint">${t("climate.today.rules")}</p>
      <div class="row">
        <button type="button" class="mini-btn quiet" @click=${this.toLearn}>
          <ha-icon icon="mdi:calendar-text-outline"></ha-icon>${t("week.ho.rules")}
        </button>
      </div>
    </section>`;
	}
	clockOf(e, t) {
		let n = new Date(t);
		if (Number.isNaN(n.getTime())) return null;
		let r = {
			hour: "2-digit",
			minute: "2-digit"
		};
		try {
			return n.toLocaleTimeString(e.lang, {
				...r,
				timeZone: this.hass?.config?.time_zone
			});
		} catch {
			return n.toLocaleTimeString(e.lang, r);
		}
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
	toLearn() {
		this.dispatchEvent(new CustomEvent("joe-navigate", {
			detail: { page: "learn" },
			bubbles: !0,
			composed: !0
		}));
	}
	editHousehold() {
		this.dispatchEvent(new CustomEvent("joe-edit", {
			detail: { editor: "household" },
			bubbles: !0,
			composed: !0
		}));
	}
	renderNightSource(t, n) {
		let r = n.config.climate, i = r?.night_by ?? "time", a = r?.night_entity ?? null, s = a ? this.hass?.states[a] : void 0;
		return e`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:weather-night"></ha-icon>${t("climate.night")}</div>
        ${y(t, "climate_night_source")}
      </div>
      <p class="hint">${t("climate.night.say")}</p>
      <div class="row">
        <span>${t("climate.night.by")}</span>
        <span class="seg" role="group" aria-label=${t("climate.night.by")}>
          ${["time", "entity"].map((n) => e`<button type="button" aria-pressed=${String(i === n)} @click=${() => this.setNightBy(n)}>
              ${t(`climate.night.by.${n}`)}
            </button>`)}
        </span>
      </div>
      ${i === "entity" ? e`<div class="row">
              <span>${a ? e`<b title=${a}>${s?.attributes.friendly_name ?? a}</b>` : t("climate.night.no_entity")}</span>
              ${s ? e`<span class="chip ${s.state === "on" ? "ok" : ""}">${t(s.state === "on" ? "climate.night.now_on" : "climate.night.now_off")}</span>` : o}
              <button type="button" class="btn btn-secondary" @click=${() => void this.pickNight()}>
                ${t(a ? "climate.night.change" : "climate.night.pick")}
              </button>
            </div>
            ${a ? e`<details class="ent"><summary>${t("climate.entity")}</summary><code>${a}</code></details>` : o}
            <p class="hint">${t("climate.night.entity_say")}</p>` : e`<p class="hint">${t("climate.night.time_say")}</p>`}
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
	renderDevice(t, n, r) {
		let i = {
			...on,
			...n.config.climate?.rooms?.[r.entity_id] ?? {}
		}, a = this.hass?.states[r.entity_id], s = a?.attributes.current_temperature ?? r.current_temperature, c = a?.attributes.temperature ?? r.temperature, l = r.hvac_modes.includes("cool"), u = r.preset_modes.filter((e) => !["none", "boost"].includes(e)), d = n.climate?.rooms?.[r.entity_id], f = n.climate?.rates?.[r.entity_id], p = r.week_presets ?? [], m = Object.values(i.week?.modes ?? {}).filter((e) => !!e?.length), h = l && !p.length && !!i.week?.enabled && m.length > 0 && d?.kind !== "legacy", g = this.profilesOf(r.entity_id), _ = p.some((e) => g[e]?.tags.includes("normal")) && d?.kind !== "legacy", v = !h && !_, ee = h ? m.every((e) => e.some((e) => e.tags.includes("away"))) : p.some((e) => g[e]?.tags.includes("away")), te = v ? [
			"setback",
			"off",
			...u.length ? ["preset"] : []
		] : ["setback", "off"], ne = v ? i.away : i.away === "off" ? "off" : "setback";
		return e`<section class="card" data-tipped>
      <div class="head">
        <b>${me(r.device_id, r.name, t("climate.open_device", { id: r.entity_id }))}</b>
        ${s == null ? o : e`<span class="chip">${b(t.lang, Number(s), 1)} °C${c == null ? "" : ` → ${b(t.lang, Number(c), 1)} °C`}</span>`}
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(i.enabled)}
          aria-label=${t("climate.room.enabled", { name: r.name })}
          @click=${() => this.save(r, { enabled: !i.enabled })}
        ></button>
        ${y(t, "climate_room")}
      </div>
      <details class="ent"><summary>${t("climate.entity")}</summary><code>${r.entity_id}</code></details>
      ${i.enabled ? e`${l && !p.length ? this.renderWeek(t, r, i, m, d) : o}
            ${p.length ? this.renderPrograms(t, r, p, d) : o}
            ${!ee || v ? e`<div class="row" data-tipped>
                    <span>${t("climate.away")}</span>
                    <span class="seg" role="group" aria-label=${t("climate.away")}>
                      ${te.map((n) => e`<button type="button" aria-pressed=${String(ne === n)} @click=${() => this.save(r, { away: n })}>
                          ${t(_ && n === "setback" ? "devprof.away_keep" : `climate.away.${n}`)}
                        </button>`)}
                    </span>
                    ${y(t, v ? "climate_away" : _ ? "devprof_away" : "week_away")}
                  </div>
                  ${v ? o : e`<p class="hint">${t("week.away_fallback")}</p>`}
                  ${ne === "setback" && !_ ? e`<div class="row">
                        <span>${t(l && r.state === "cool" ? "climate.setback.cool" : "climate.setback.heat")}</span>
                        <input
                          class="input short"
                          type="number"
                          min="0.5"
                          max="10"
                          step="0.5"
                          aria-label=${t("climate.setback.heat")}
                          .value=${String(i.setback_k)}
                          @change=${(e) => {
			let t = Number.parseFloat(e.target.value.replace(",", "."));
			Number.isFinite(t) && this.save(r, { setback_k: Math.min(10, Math.max(.5, t)) });
		}}
                        />
                        <span>°C</span>
                      </div>` : o}
                  ${v && i.away === "preset" ? this.presetRow(t, r, u, "away_preset", i.away_preset, "climate.away_preset") : o}` : o}
            ${v && u.length ? e`<div data-tipped>
                  ${this.presetRow(t, r, u, "free_day_preset", i.free_day_preset, "climate.free_day_preset", !0)}
                </div>` : o}
            ${l ? this.renderNight(t, r, i) : o}
            <p class="hint">
              ${d && v ? t.optional(`climate.now.${d.why}`, { min: this.awayAfter }) ?? "" : o}
              ${f ? t("climate.rate", { rate: b(t.lang, f, 1) }) : t("climate.rate_default")}
            </p>` : e`<p class="hint">${t("climate.room.off")}</p>`}
    </section>`;
	}
	get awayAfter() {
		return this.state?.config.climate?.away_after_min ?? sn;
	}
	renderWeek(t, n, r, i, a) {
		let s = !!r.week?.enabled;
		return e`<div class="sub" data-tipped>
      <div class="row">
        <span class="sub-title">${t("week.row")}</span>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(s)}
          aria-label=${t("week.row")}
          @click=${() => this.save(n, { week: { enabled: !s } })}
        ></button>
        ${y(t, "climate_week")}
      </div>
      ${a?.pending ? e`<p class="hint">${t(a.pending === "start" ? "week.pending.start" : "week.pending.end")}</p>` : o}
      ${s ? e`${i.length ? a?.pending === "start" ? o : a?.kind === "legacy" ? e`<p class="hint">
                    ${t("week.legacy_now", { state: this.hvacText(t, this.hass?.states[n.entity_id]?.state ?? n.state) })}
                  </p>` : this.renderNow(t, n, a) : e`<p class="hint">${t("week.no_sets")}</p>`}
            <div class="row">
              <button type="button" class="btn btn-secondary" @click=${() => this.editWeek(n)}>
                <ha-icon icon="mdi:calendar-clock"></ha-icon>${t("week.edit")}
              </button>
            </div>
            ${i.length ? this.renderHold(t, n, r, i, a) : o}` : o}
    </div>`;
	}
	renderNow(t, n, r) {
		if (!r || !r.kind || r.kind === "legacy") return e``;
		let i = this.weekError[n.entity_id] ?? r.error, a = i ? e`<div class="note warn" role="alert">
          <ha-icon icon="mdi:alert-outline"></ha-icon>
          <span>${t.optional(`week.error.${i}`) ?? t("week.error", { error: i })}</span>
        </div>` : o, s = r.override;
		if (s?.reason === "off") return e`<div class="note"><ha-icon icon="mdi:power"></ha-icon><span>${t("week.override.off")}</span></div>${a}`;
		if (s) {
			let r = s.reason === "preset" ? s.until ? t("week.override.preset", { time: s.until }) : t("week.override.preset_open") : s.until ? t("week.override.manual", { time: s.until }) : t("week.override.manual_open");
			return e`<div class="note" data-tipped>
          <ha-icon icon="mdi:hand-back-right-outline"></ha-icon>
          <span class="note-body">
            <span>${r}</span>
            <span class="with-tip">
              <button type="button" class="mini-btn" @click=${() => void this.resume(n)}>${t("week.resume")}</button>
              ${y(t, "week_resume")}
            </span>
          </span>
        </div>
        ${a}`;
		}
		let c = r.target, l = [];
		if (r.kind === "device") {
			let e = c?.preset;
			if (!c) l.push(t("week.as_is"));
			else if (c.hvac === "off") l.push(t("week.state_off"));
			else if (e) {
				let r = (n.week_presets ?? []).indexOf(e), i = t("week.profile", { n: ln(e, Math.max(0, r)) });
				l.push(It(i, this.profilesOf(n.entity_id)[e]?.name));
			}
		} else {
			if (l.push(c ? c.hvac === "off" ? t("week.state_off") : t(`week.mode.${r.mode === "heat" ? "heat" : "cool"}`) : t("week.as_is")), r.profile?.index != null) {
				let e = It(t("week.profile", { n: r.profile.index + 1 }), r.profile.name);
				l.push(r.profile.held && r.why !== "held" ? `${e} (${t("week.held")})` : e);
			}
			c && c.hvac !== "off" && c.temperature != null && l.push(`${b(t.lang, c.temperature, 1)}\u00a0°C`), r.next && l.push(t("week.next", {
				time: r.next.at,
				value: this.valueText(t, r.next.value)
			}));
		}
		let u = t.optional(`week.why.${r.why}`, { min: this.awayAfter });
		return e`<p class="week-now">
        <span>${t(r.would ? "week.would" : "week.now", { text: l.join(" · ") || "–" })}</span>
        ${u ? e`<span class="chip">${u}</span>` : o}
      </p>
      ${a}`;
	}
	valueText(e, t) {
		return t === "off" ? e("week.off") : `${b(e.lang, t, 1)}\u00a0°C`;
	}
	renderHold(t, n, r, i, a) {
		let s = n.entity_id, c = a?.mode ?? this.hass?.states[s]?.state ?? n.state, l = r.week?.modes?.[c === "heat" ? "heat" : "cool"] ?? i[0], u = a?.hold ?? null, d = u && u.mode === c ? u : null, f = d ? d.profile : null, p = d ? d.until ? "midnight" : "forever" : this.holdUntil[s] ?? "midnight", m = (e) => It(t("week.profile", { n: e.profile + 1 }), r.week?.modes?.[e.mode]?.[e.profile]?.name), h = a?.want, g = d && (h === "night" || h === "away") ? h : null;
		return e`<div data-tipped>
      <div class="row">
        <span>${t("week.hold")}</span>
        ${y(t, "week_hold")}
      </div>
      <div class="row hold">
        <select
          class="input"
          aria-label=${t("week.hold")}
          .value=${f == null ? "" : String(f)}
          @change=${(e) => {
			let t = e.target.value;
			this.hold(n, t === "" ? null : Number(t), p);
		}}
        >
          <option value="" ?selected=${f == null}>${t("week.hold.auto")}</option>
          ${l.map((n, r) => e`<option value=${String(r)} ?selected=${f === r}>${It(t("week.profile", { n: r + 1 }), n.name)}</option>`)}
        </select>
        <span class="seg" role="group" aria-label=${t("week.hold.until")}>
          ${["midnight", "forever"].map((r) => e`<button
              type="button"
              aria-pressed=${String(p === r)}
              @click=${() => {
			d ? r !== p && this.hold(n, d.profile, r) : this.holdUntil = {
				...this.holdUntil,
				[s]: r
			};
		}}
            >
              ${t(`week.hold.${r}`)}
            </button>`)}
        </span>
      </div>
      ${g && d ? e`<p class="hint">${t(`week.hold.later_${g}`, { profile: m(d) })}</p>` : o}
      ${u && !d ? e`<div class="note" role="status">
            <ha-icon icon="mdi:information-outline"></ha-icon>
            <span class="note-body">
              <span>
                ${t("week.hold.other_mode", {
			profile: m(u),
			mode: t(`week.mode.${u.mode}`),
			until: t(`week.hold.${u.until ? "midnight" : "forever"}`)
		})}
              </span>
              <button type="button" class="mini-btn" @click=${() => void this.hold(n, null, p)}>${t("week.hold.lift")}</button>
            </span>
          </div>` : o}
    </div>`;
	}
	renderPrograms(t, n, r, i) {
		let a = this.profilesOf(n.entity_id), s = r.flatMap((e) => a[e]?.tags ?? []), c = this.state?.climate?.day, l = !c || c.home_office_available, u = c?.home_office_reason ?? "no_calendar", d = this.hass?.states[n.entity_id]?.state ?? n.state;
		return e`<div class="sub" data-tipped>
      <div class="row">
        <span class="sub-title">${t("devprof.title")}</span>
        ${y(t, "climate_device_profiles")}
      </div>
      ${i?.pending ? e`<p class="hint">${t(i.pending === "start" ? "devprof.pending.start" : "devprof.pending.end")}</p>` : o}
      ${r.map((i, o) => {
			let s = a[i] ?? {
				name: "",
				tags: []
			}, c = t("week.profile", { n: ln(i, o) });
			return e`<div class="preset">
          <div class="preset-name">
            <input
              class="input"
              type="text"
              maxlength="30"
              placeholder=${c}
              aria-label=${t("devprof.name", { preset: c })}
              .value=${s.name}
              @change=${(e) => this.savePrograms(n, r, i, { name: e.target.value.trim().slice(0, 30) })}
            />
            <code>${i}</code>
          </div>
          <div class="tags" role="group" aria-label=${t("devprof.tags", { preset: c })}>
            ${nt.map((a) => {
				let o = s.tags.includes(a), c = a === "home_office" && !l && !o;
				return e`<button
                type="button"
                class="mini-btn tag-btn"
                aria-pressed=${String(o)}
                ?disabled=${c}
                title=${c ? t(`week.ho.${u}`) : ""}
                @click=${() => this.toggleProgramTag(t, n, r, i, a)}
              >
                <ha-icon icon=${Lt[a]}></ha-icon>${t(`week.tag.${a}`)}
              </button>`;
			})}
          </div>
        </div>`;
		})}
      ${this.moved[n.entity_id] ? e`<div class="note" role="status"><ha-icon icon="mdi:information-outline"></ha-icon><span>${this.moved[n.entity_id]}</span></div>` : o}
      ${s.length && !s.includes("normal") ? e`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${t("devprof.need_normal")}</span></div>` : o}
      ${i?.why === "manual_mode" ? e`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon><span>${t("devprof.not_auto", { state: this.hvacText(t, d) })}</span>
          </div>` : o}
      ${l ? o : e`<p class="hint">${t(`week.ho.${u}`)}</p>
            <div class="row">
              <button type="button" class="mini-btn quiet" @click=${this.toLearn}>
                <ha-icon icon="mdi:calendar-text-outline"></ha-icon>${t("week.ho.rules")}
              </button>
            </div>`}
      ${s.length && i?.kind === "device" ? this.renderNow(t, n, i) : o}
    </div>`;
	}
	toggleProgramTag(e, t, n, r, i) {
		let a = this.profilesOf(t.entity_id), o = (a[r]?.tags ?? []).includes(i), s = o ? void 0 : n.find((e) => e !== r && a[e]?.tags.includes(i)), c = (t) => a[t]?.name || e("week.profile", { n: ln(t, n.indexOf(t)) });
		this.moved = {
			...this.moved,
			[t.entity_id]: s ? e("devprof.moved", {
				tag: e(`week.tag.${i}`),
				to: c(r),
				from: c(s)
			}) : ""
		};
		let l = o ? a[r].tags.filter((e) => e !== i) : nt.filter((e) => e === i || a[r]?.tags.includes(e));
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
		dn(o) !== dn(a) && (this.pending = {
			...this.pending,
			[i]: o
		}, M(this, { climate: { rooms: { [i]: { device_profiles: o } } } }).then((e) => {
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
	renderMeters(t, n, r) {
		let i = this.found?.meters ?? [], a = n.config.climate?.rooms ?? {}, s = r.filter((e) => {
			let t = a[e.entity_id]?.meter, n = this.found?.suggested?.[e.entity_id]?.device_id;
			return e.hvac_modes.some((e) => [
				"cool",
				"dry",
				"fan_only",
				"heat_cool"
			].includes(e)) || t && t !== "none" || n != null && n === e.device_id;
		});
		if (!s.length) return e``;
		let c = s.filter((e) => {
			let t = a[e.entity_id]?.meter;
			return t && t !== "none";
		}).length;
		return e`<section class="card" data-tipped>
      <div class="head">
        <button type="button" class="fold" aria-expanded=${String(this.metersOpen)} @click=${() => this.metersOpen = !this.metersOpen}>
          <ha-icon icon=${this.metersOpen ? "mdi:chevron-down" : "mdi:chevron-right"}></ha-icon>
          <span class="eyebrow"><ha-icon icon="mdi:meter-electric-outline"></ha-icon>${t("climate.meters")}</span>
          <span class="chip">${t("climate.meters.count", {
			linked: c,
			all: s.length
		})}</span>
        </button>
        ${y(t, "climate_meter")}
      </div>
      ${this.metersOpen ? e`<p class="hint">${t("climate.meters.say")}</p>
            ${i.length ? o : e`<p class="hint">${t("climate.meter.no_meters")}</p>`}
            ${s.map((e) => this.meterLine(t, e, s, a))}` : o}
    </section>`;
	}
	meterLine(t, n, r, i) {
		let a = i[n.entity_id]?.meter ?? null, s = a && a !== "none" ? a : null, c = a == null ? this.found?.suggested?.[n.entity_id] : void 0, l = s ? r.filter((e) => e.entity_id !== n.entity_id && this.sameMeter(i[e.entity_id]?.meter, s)) : [], u = s?.power ? this.hass?.states[s.power] : void 0, d = s ? this.option(s) ?? null : c ?? null, f = this.picking === n.entity_id;
		return e`<div class="line">
      <div class="dev">
        <b>${me(n.device_id, n.name, t("climate.open_device", { id: n.entity_id }))}</b
        ><small>${n.area ?? t("climate.no_area")}</small>
        <details class="ent">
          <summary>${t("climate.entities")}</summary>
          <code>${n.entity_id}</code>
          ${s?.power ? e`<code>${s.power}</code>` : o}
          ${s?.energy ? e`<code>${s.energy}</code>` : o}
        </details>
      </div>
      <div class="meter-pick">
        ${f ? this.meterSearch(t, n) : e`<span class="picked">
              ${d ? e`<b>${me(d.device_id, `${d.name ?? d.device_id}${d.sensor ? ` · ${d.sensor}` : ""}`, t("climate.open_meter"))}</b>
                    ${d.via ? e`<small class="via">${d.via}</small>` : o}` : s ? e`<b>${me(s.device_id, s.power ?? s.energy ?? s.device_id, t("climate.open_meter"))}</b>` : e`<small>${t(a === "none" ? "climate.meter.without_long" : "climate.meter.open_long")}</small>`}
            </span>`}
      </div>
      <div class="state">
        ${f ? o : s ? e`<span class="chip ok">${u ? this.reading(t, u) : t("climate.meter.linked")}</span>
                <button type="button" class="mini-btn" @click=${() => this.startPicking(n)}>${t("climate.meter.change")}</button>` : c ? e`<button type="button" class="btn btn-secondary" @click=${() => this.save(n, { meter: this.meterOf(c) })}>
                    ${t("climate.meter.confirm")}
                  </button>
                  <button type="button" class="mini-btn" @click=${() => this.startPicking(n)}>${t("climate.meter.other_short")}</button>` : e`<button type="button" class="mini-btn" @click=${() => this.startPicking(n)}>${t("climate.meter.search")}</button>`}
      </div>
      ${l.length ? e`<p class="hint shared">${t("climate.meter.shared", { names: l.map((e) => e.name).join(", ") })}</p>` : o}
    </div>`;
	}
	startPicking(e) {
		this.picking = e.entity_id, this.query = "", this.updateComplete.then(() => this.shadowRoot?.querySelector(".meter-pick input")?.focus());
	}
	meterSearch(t, n) {
		let r = this.query.toLowerCase().split(/\s+/).filter(Boolean), i = (this.found?.meters ?? []).filter((e) => {
			let t = [
				e.name,
				e.sensor,
				e.via,
				e.area,
				e.power,
				e.energy
			].join(" ").toLowerCase();
			return r.every((e) => t.includes(e));
		}).slice(0, 8);
		return e`<input
        class="input"
        type="search"
        placeholder=${t("climate.meter.search_placeholder")}
        aria-label=${t("climate.meter.pick", { name: n.name })}
        .value=${this.query}
        @input=${(e) => this.query = e.target.value}
        @keydown=${(e) => {
			e.key === "Escape" && (this.picking = void 0), e.key === "Enter" && i[0] && this.pickMeter(n, this.key(i[0]));
		}}
      />
      <div class="hits" role="listbox" aria-label=${t("climate.meter.pick", { name: n.name })}>
        ${i.map((r) => e`<button type="button" role="option" class="hit" @click=${() => this.pickMeter(n, this.key(r))}>
            <b>${r.name ?? r.device_id}${r.sensor ? ` · ${r.sensor}` : ""}</b>
            <small>${[
			r.via,
			r.area,
			r.power ? this.readingOf(t, r.power) : ""
		].filter(Boolean).join(" · ")}</small>
          </button>`)}
        ${i.length ? o : e`<small class="none">${t("climate.meter.no_hits")}</small>`}
        <div class="hit-actions">
          <button type="button" class="mini-btn" @click=${() => this.pickMeter(n, "none")}>${t("climate.meter.none_option")}</button>
          <button type="button" class="mini-btn quiet" @click=${() => this.picking = void 0}>${t("climate.meter.cancel")}</button>
        </div>
      </div>`;
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
		return `${t.state !== "" && Number.isFinite(n) ? b(e.lang, n, n % 1 ? 1 : 0) : t.state} ${String(t.attributes.unit_of_measurement ?? "")}`.trim();
	}
	pickMeter(e, t) {
		if (this.picking = void 0, t === "none") {
			this.save(e, { meter: "none" });
			return;
		}
		let n = (this.found?.meters ?? []).find((e) => this.key(e) === t);
		n && this.save(e, { meter: this.meterOf(n) });
	}
	presetRow(t, n, r, i, a, s, c = !1) {
		return e`<div class="row">
      <span>${t(s)}</span>
      <select
        class="input"
        aria-label=${t(s)}
        @change=${(e) => this.save(n, { [i]: e.target.value || null })}
      >
        ${c ? e`<option value="" ?selected=${!a}>${t("climate.no_preset")}</option>` : o}
        ${!c && !a ? e`<option value="" selected disabled>${t("climate.pick_preset")}</option>` : o}
        ${r.map((t) => e`<option value=${t} ?selected=${t === a}>${t}</option>`)}
      </select>
      ${c ? y(this.t, "climate_free_day") : o}
    </div>`;
	}
	renderNight(t, n, r) {
		let i = (r, i) => e`<input
      class="input short"
      type="time"
      aria-label=${t(`climate.${r}`)}
      .value=${i}
      @change=${(e) => {
			let t = e.target.value;
			/^\d{1,2}:\d{2}$/.test(t) && this.save(n, { [r]: t });
		}}
    />`;
		return e`<div class="row" data-tipped>
      <span>${t("climate.night_off")}</span>
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${String(r.night_off)}
        aria-label=${t("climate.night_off")}
        @click=${() => this.save(n, { night_off: !r.night_off })}
      ></button>
      ${y(t, "climate_night")}
    </div>
    ${r.night_off ? this.state?.config.climate?.night_by === "entity" ? e`<div class="row">
            <span>${t("climate.night_back")}</span>
            ${i("night_until", r.night_until)}
          </div>` : e`<div class="row">
            <span>${t("climate.night_span")}</span>
            ${i("night_from", r.night_from)} – ${i("night_until", r.night_until)}
          </div>` : o}`;
	}
	save(e, t) {
		M(this, { climate: { rooms: { [e.entity_id]: t } } });
	}
};
C([r({ attribute: !1 })], G.prototype, "hass", void 0), C([r({ attribute: !1 })], G.prototype, "t", void 0), C([r({ attribute: !1 })], G.prototype, "state", void 0), C([c()], G.prototype, "found", void 0), C([c()], G.prototype, "failed", void 0), C([c()], G.prototype, "metersOpen", void 0), C([c()], G.prototype, "picking", void 0), C([c()], G.prototype, "query", void 0), C([c()], G.prototype, "holdUntil", void 0), C([c()], G.prototype, "pending", void 0), C([c()], G.prototype, "logOpen", void 0), C([c()], G.prototype, "moved", void 0), C([c()], G.prototype, "weekError", void 0), S("joe-climate-page", G);
//#endregion
//#region src/components/battery-automations.ts
var K = class extends n {
	constructor(...e) {
		super(...e), this.batteries = "", this.mode = "", this.ready = {}, this.items = [], this.busy = !1, this.failed = !1;
	}
	static {
		this.styles = [d, a`
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
		let t = this.t;
		if (!t || !this.items.length) return o;
		let n = this.items.filter((e) => this.on(e)), r = this.items.filter((e) => e.switched_off && !this.on(e)), i = (this.mode === "advisory" || this.mode === "live") && n.some((e) => e.writes.some((e) => this.ready[e.battery_id] === "ready"));
		return e`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:robot-outline"></ha-icon>${t("automations.title")}</div>
        ${y(t, "battery_automations")}
      </div>
      <p class="now">${t(n.length ? i ? "automations.lead" : "automations.lead_idle" : "automations.lead_off")}</p>
      <ul>
        ${this.items.map((n) => {
			let r = this.on(n), i = [...new Set(n.writes.map((e) => e.battery))].join(", ");
			return e`<li>
            <div class="row">
              <b>${n.name}</b>
              ${n.writes.some((e) => e.joe) ? e`<span class="chip">${t("automations.levers")}</span>` : o}
              <span class="chip ${r ? "warn" : "ok"}">${t(r ? "automations.on" : "automations.off")}</span>
            </div>
            ${n.writes.length ? e`<small>${t("automations.writes", {
				what: n.writes.map((e) => e.name).join(", "),
				batteries: i
			})}</small>` : e`<small>${t("automations.not_battery")}</small>`}
            ${n.switched_off && !r ? e`<small>
                  ${t("automations.switched_off", {
				day: W(t.lang, n.switched_off.at, "short"),
				time: n.switched_off.at.slice(11, 16)
			})}
                </small>` : o}
          </li>`;
		})}
      </ul>
      <div class="actions">
        ${n.length ? e`<button type="button" class="mini-btn ${i ? "go" : ""}" ?disabled=${this.busy} @click=${() => this.switch(!1)}>
              <ha-icon icon="mdi:pause-circle-outline"></ha-icon>${t("automations.all_off", { count: n.length })}
            </button>` : o}
        ${r.length ? e`<button type="button" class="mini-btn" ?disabled=${this.busy} @click=${() => this.switch(!0)}>
              <ha-icon icon="mdi:play-circle-outline"></ha-icon>${t("automations.back_on", { count: r.length })}
            </button>` : o}
      </div>
      ${this.failed ? e`<p class="bad">${t("automations.failed")}</p>` : o}
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
C([r({ attribute: !1 })], K.prototype, "hass", void 0), C([r({ attribute: !1 })], K.prototype, "t", void 0), C([r()], K.prototype, "batteries", void 0), C([r()], K.prototype, "mode", void 0), C([r({ attribute: !1 })], K.prototype, "ready", void 0), C([c()], K.prototype, "items", void 0), C([c()], K.prototype, "busy", void 0), C([c()], K.prototype, "failed", void 0), S("joe-battery-automations", K);
//#endregion
//#region src/components/car-need.ts
var fn = class extends n {
	constructor(...e) {
		super(...e), this.roundTrip = !0, this.failed = !1;
	}
	static {
		this.styles = [d, a`
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
		let { t, action: n } = this, r = n?.need;
		if (!t || !n || !r) return o;
		let i = (e, n = 0) => b(t.lang, e ?? 0, n);
		if (!r.known) return e`<p>${t(r.soc != null && !r.capacity_kwh ? "need.unknown_capacity" : "need.unknown")}</p>`;
		let a = [];
		a.push(e`<p>
        ${r.trips_km > 0 && r.trips_km >= (r.usual_km ?? 0) ? t("need.trips", {
			km: i(r.trips_km),
			count: r.trips.length,
			reserve: i(r.reserve_km),
			total: i(r.needed_km)
		}) : r.usual_km ? t("need.usual", {
			km: i(r.usual_km),
			reserve: i(r.reserve_km),
			total: i(r.needed_km)
		}) : t("need.reserve_only", { reserve: i(r.reserve_km) })}
        ${r.unknown_trips ? t("need.unknown_trips", { count: r.unknown_trips }) : ""}
      </p>`), a.push(e`<p>
        ${t(`need.consumption.${r.consumption_source}`, {
			value: i(r.consumption, 1),
			temp: r.temp == null ? "–" : i(r.temp)
		})}${r.rain ? ` ${t("need.rain")}` : ""}
      </p>`), r.target_unit === "%" ? a.push(e`<p>${t("need.has_soc", {
			soc: i(r.soc),
			km: i(r.have_km),
			target: i(r.target)
		})}</p>`) : a.push(e`<p>${t("need.has_range", { km: i(r.have_km) })}</p>`);
		let s = r.missing_kwh ?? 0;
		return a.push(e`<p class="result">
        ${s >= .2 ? n.run && !n.manual ? t("need.charges", {
			kwh: i(s, 1),
			start: x(n.start)
		}) : t("need.missing", { kwh: i(s, 1) }) : t("need.enough")}
      </p>`), r.fits === !1 && a.push(e`<p>${t("need.too_far")}</p>`), e`${a} ${r.trips.length ? this.renderTrips(t, r.trips) : o}`;
	}
	renderTrips(t, n) {
		return e`<div data-tipped>
      <div class="head">${t("need.trips.title")} ${y(t, "need_trips")}</div>
      <ul>
        ${n.map((n) => e`<li>
            <span>${n.start.includes("T") ? x(n.start) : t("need.all_day")}</span>
            <span class="where">${n.location}</span>
            ${this.editing === n.location ? this.renderEdit(t, n) : e`<span class=${n.km == null ? "km unknown" : "km"}>
                    ${n.km == null ? t("need.km_unknown") : t(`need.km.${n.source ?? "zone"}`, { km: b(t.lang, n.km, 0) })}
                  </span>
                  <button
                    type="button"
                    class="mini-btn quiet"
                    aria-label=${t("need.km_edit", { place: n.location })}
                    @click=${() => this.editing = n.location}
                  >
                    <ha-icon icon="mdi:pencil-outline"></ha-icon>
                  </button>`}
          </li>`)}
      </ul>
      ${this.failed ? e`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${t("error.action")}</div>` : o}
    </div>`;
	}
	renderEdit(t, n) {
		let r = n.km == null ? "" : String(Math.round(n.km / (this.roundTrip ? 2 : 1)));
		return e`<form
      @submit=${(e) => {
			e.preventDefault();
			let t = e.target.querySelector("input"), r = Number.parseFloat(t.value.replace(",", "."));
			this.save(n.location, Number.isFinite(r) && r >= 0 ? r : null);
		}}
    >
      <span class="unit-input">
        <input class="input" type="number" min="0" max="3000" step="1" .value=${r} aria-label=${t("need.km_one_way")} />
        <span class="unit">km</span>
      </span>
      <button type="submit" class="mini-btn go">${t("common.save")}</button>
      <button type="button" class="mini-btn quiet" @click=${() => this.save(n.location, null)}>${t("need.km_reset")}</button>
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
C([r({ attribute: !1 })], fn.prototype, "hass", void 0), C([r({ attribute: !1 })], fn.prototype, "t", void 0), C([r({ attribute: !1 })], fn.prototype, "action", void 0), C([r({ attribute: !1 })], fn.prototype, "roundTrip", void 0), C([c()], fn.prototype, "editing", void 0), C([c()], fn.prototype, "failed", void 0), S("joe-car-need", fn);
//#endregion
//#region src/pages/devices.ts
var pn = [
	"hold",
	"charge",
	"release"
], q = class extends n {
	constructor(...e) {
		super(...e), this.notice = "";
	}
	static {
		this.styles = [d, a`
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
		let t = this.t, n = this.state;
		if (!t || !n) return o;
		let r = n.control;
		return e`<div class="wrap">
        <div class="intro">
          <div>
            ${T(t("devices.page.title"))} ${w}
            <p class="lead">${t("devices.lead")}</p>
          </div>
          <joe-pose name="switch"></joe-pose>
        </div>
        ${r ? this.renderStatus(t, n, r) : o}
        <div class="group-label">${t("devices.batteries")}</div>
        ${n.config.batteries.length ? e`<div class="grid">${n.config.batteries.map((e) => this.renderBattery(t, e, r))}</div>
              <joe-battery-automations
                .hass=${this.hass}
                .t=${t}
                batteries=${JSON.stringify(n.config.batteries)}
                mode=${n.mode}
                .ready=${r?.ready ?? {}}
              ></joe-battery-automations>` : e`<p class="empty">${t("devices.batteries.none")}</p>`}
        <div class="group-label">${t("devices.actions")}</div>
        <div class="grid">
          ${n.config.actions.map((e) => this.renderAction(t, n, e))} ${this.renderLonelyCars(t, n)}
          ${this.renderAddAction(t)}
        </div>
        ${r ? this.renderLog(t, r) : o}
      </div>
      ${this.confirm ? this.renderConfirm(t, this.confirm) : o}`;
	}
	renderStatus(t, n, r) {
		let i = n.plan, a = r.reason, s = a === "waiting" && i?.window ? t("devices.status.waiting", { time: x(i.window.start) }) : a === "day" ? t("devices.status.day", { time: i?.day ? x(i.day.defer_until) : "–" }) : t(`devices.status.${a}`), c = n.mode === "simulation" ? e`<span class="pill-sim">${t("mode.simulation")}</span>` : e`<span class="chip ${n.mode === "live" ? "ok" : n.mode === "advisory" ? "learned" : ""}"
            >${t(`mode.${n.mode}`)}</span
          >`, l = r.steering || r.pending;
		return e`<section class="card status" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:pulse"></ha-icon>${t("devices.now")}</div>
        ${c} ${y(t, "plan_steer")}
      </div>
      <p class="status-text">${s}</p>
      ${r.pending ? e`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${t("devices.pending")}</span></div>` : o}
      ${l ? e`<div class="actions">
            <button type="button" class="btn btn-danger" @click=${this.release}>
              <ha-icon icon="mdi:hand-back-left-outline"></ha-icon>${t("devices.release")}
            </button>
            ${y(t, "devices_release")}
          </div>` : o}
      ${this.notice ? e`<div class="note" role="status"><ha-icon icon="mdi:check"></ha-icon>${this.notice}</div>` : o}
    </section>`;
	}
	renderBattery(t, n, r) {
		let i = this.hass, a = l(i, n.soc_entity), s = h(i, n.power), c = r?.ready[n.id] ?? "not_controllable", u = r?.batteries[n.id], d = r?.testing?.battery === n.id ? r.testing : null, f = r?.tests[n.id], p = n.adapter === "generic" ? t("devices.battery.generic") : n.adapter === "steps" ? t("devices.battery.steps") : n.adapter === "none" ? t("devices.battery.watch") : t("devices.battery.profile", { name: this.info?.profiles?.[n.adapter] ?? n.adapter }), m = u?.action ? t(`devices.action.${u.action}`, {
			target: b(t.lang, u.target ?? 0, 0),
			floor: b(t.lang, u.floor ?? 0, 0),
			until: u.until ? x(u.until) : ""
		}) : t("devices.action.idle"), g = u?.problem ?? (c !== "ready" && c !== "not_controllable" ? c : null);
		return e`<section class="card battery" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:home-battery-outline"></ha-icon>${n.name}</div>
        <span class="chip ${n.adapter === "none" ? "" : "read"}">${p}</span>
      </div>
      <div class="figures">
        <b>${a == null ? "–" : b(t.lang, a, 0)}<small>%</small></b>
        ${s == null ? o : e`<span
              >${Math.abs(s) < .05 ? t("devices.power.idle") : t(s > 0 ? "devices.power.charge" : "devices.power.discharge", { value: b(t.lang, Math.abs(s), 2) })}</span
            >`}
      </div>
      <p class="now">${n.adapter === "none" ? t("devices.action.watch") : m}</p>
      ${g && n.adapter !== "none" ? e`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon
            ><span>${t.optional(`devices.problem.${g === "outdated" ? "not_tested" : g}`) ?? g}</span>
          </div>` : o}
      ${n.adapter === "none" && this.hasSuggestion(n) ? e`<div class="note"><ha-icon icon="mdi:lightbulb-on-outline"></ha-icon><span>${t("devices.suggested")}</span></div>` : o}
      ${n.adapter === "none" ? o : this.renderTest(t, n, c, f, d)}
      <div class="setup">
        <button type="button" class="mini-btn" @click=${() => this.edit(n)}>
          <ha-icon icon="mdi:tune-variant"></ha-icon>${t("devices.setup")}
        </button>
        ${y(t, "devices_setup")}
      </div>
    </section>`;
	}
	renderAction(t, n, r) {
		let i = n.plan, a = i?.actions?.find((e) => e.id === r.id), s = n.control?.actions?.[r.id], c = i?.window?.start, l = !!c && n.control?.tonight?.[r.id] === c, u = r.kind === "target" ? "mdi:water-boiler" : /ev|car|auto|wallbox/i.test(r.id + r.name) ? "mdi:car-electric" : "mdi:flash-outline";
		return e`<section class="card action" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon=${u}></ha-icon>${r.name}</div>
        ${r.enabled ? o : e`<span class="chip">${t("devices.action.off")}</span>`}
      </div>
      <p class="now">${this.actionText(t, n, r, a, s)}</p>
      ${r.kind === "switch" && this.isCar(r) ? e`<div class="car-need" data-tipped>
              <button
                type="button"
                class="switch"
                role="switch"
                aria-checked=${String(!!r.need?.enabled)}
                aria-labelledby="need-${r.id}"
                @click=${() => this.toggleNeed(r)}
              ></button>
              <span id="need-${r.id}"><b>${t("action.need")}</b><small>${t(r.need?.enabled ? "action.need.on" : "action.need.off")}</small></span>
              ${y(t, "a_need")}
            </div>
            ${this.renderCarCalendar(t, n, r)}` : o}
      ${a?.need ? e`<joe-car-need .hass=${this.hass} .t=${t} .action=${a} .roundTrip=${r.need?.round_trip ?? !0}></joe-car-need>` : o}
      ${r.kind === "switch" && (r.need?.soc_entity || r.need?.range_entity) ? e`<joe-car-charge .hass=${this.hass} .t=${t} .state=${n} .action=${r}></joe-car-charge>` : e`<div class="test">
            <span class="toggle-label" id="tonight-${r.id}">${t("devices.action.tonight")}</span>
            <button
              type="button"
              class="switch"
              role="switch"
              aria-checked=${String(l)}
              aria-labelledby="tonight-${r.id}"
              ?disabled=${!c || !r.enabled}
              @click=${() => this.toggleTonight(r.id, !l)}
            ></button>
            ${y(t, "action_tonight")}
          </div>`}
      <div class="setup">
        <button type="button" class="mini-btn" @click=${() => this.editAction(r.id)}>
          <ha-icon icon="mdi:pencil-outline"></ha-icon>${t("devices.action.edit")}
        </button>
      </div>
    </section>`;
	}
	actionText(e, t, n, r, i) {
		let a = r?.target == null ? "" : b(e.lang, r.target, 0);
		if (!n.enabled) return e("devices.action.disabled");
		if (i?.reason === "boost") return e("devices.action.boost");
		if (i?.on) return n.kind === "target" ? e("devices.action.heating", {
			target: a,
			end: x(i.end)
		}) : e("devices.action.running", { end: x(i.end) });
		if (i?.reason === "reached") {
			let i = t.control?.tonight_target?.[n.id];
			return n.kind === "switch" && i && i.night === t.plan?.window?.start ? e("devices.action.reached_need", {
				target: b(e.lang, i.chosen, 0),
				unit: i.unit
			}) : n.kind === "switch" ? r?.need && a ? e("devices.action.reached_need", {
				target: a,
				unit: r.need.target_unit === "km" ? "km" : "%"
			}) : e("devices.action.reached_plain") : e("devices.action.reached", { target: a });
		}
		if (!r) return e("devices.action.no_plan");
		let o = t.mode === "simulation" ? e("devices.action.would") : "";
		if (r.run) return `${o}${n.kind === "target" ? e("devices.action.plan_target", {
			start: x(r.start),
			target: a
		}) : e("devices.action.plan_run", {
			start: x(r.start),
			end: x(r.end)
		})}`;
		let s = r.reasons[r.reasons.length - 1] ?? "manual_only";
		return e.optional(`devices.action.why.${s}`, {
			kwh: b(e.lang, t.plan?.meta?.tomorrow_kwh ?? 0, 0),
			temperature: b(e.lang, r.temperature ?? 0, 0)
		}) ?? s;
	}
	renderLonelyCars(t, n) {
		let r = new Set(n.config.actions.map((e) => e.consumer_id).filter(Boolean));
		return n.config.consumers.filter((e) => e.kind === "ev" && !r.has(e.id)).map((n) => e`<section class="card action" data-tipped>
          <div class="head">
            <div class="eyebrow"><ha-icon icon="mdi:car-electric"></ha-icon>${n.name}</div>
            ${y(t, "devices_lonely_car")}
          </div>
          <p class="now">${t("devices.car.lonely")}</p>
          <div class="setup">
            <button type="button" class="btn btn-primary" @click=${() => this.editAction("new:ev", "need", n.id)}>
              ${t("devices.car.set_up")}
            </button>
          </div>
        </section>`);
	}
	renderAddAction(t) {
		return e`<section class="card add" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:plus-circle-outline"></ha-icon>${t("devices.action.add")}</div>
        ${y(t, "devices_actions")}
      </div>
      <p class="now">${t("devices.action.add.text")}</p>
      <div class="actions">
        ${[
			"ev",
			"hot_water",
			"custom"
		].map((n) => e`<button type="button" class="mini-btn" @click=${() => this.editAction(`new:${n}`)}>
              ${t(`action.template.${n}`)}
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
		t?.enabled ? M(this, { actions: { [e.id]: { need: {
			...t,
			enabled: !1
		} } } }) : t?.soc_entity || t?.range_entity ? M(this, { actions: { [e.id]: { need: {
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
	renderCarCalendar(t, n, r) {
		let i = r.need, a = i?.enabled ? i.source ?? "ha" : null, s = "", c = "none", l = null, u = i?.enabled ? n.config.persons.filter((e) => e.calendars.length && (i.persons == null || i.persons.includes(e.id))) : [];
		if (a === "ha" && (i?.calendars?.length || u.length)) s = [...(i?.calendars ?? []).map((e) => p(this.hass, e)), ...u.length ? [t("devices.car.of_persons", { names: u.map((e) => e.name).join(", ") })] : []].join(" · "), c = "ok";
		else if (a === "mailbox" && i?.mailbox?.address) {
			let e = n.mailbox?.[r.id];
			s = i.mailbox.address, c = e?.state === "ok" ? "ok" : "warn", l = e?.checked ?? null;
		} else if (a === "account" && i?.account?.address) {
			let e = n.accounts?.[r.id];
			s = i.account.address, c = e?.state === "ok" ? "ok" : "warn", l = e?.checked ?? null;
		}
		return e`<div class="car-cal" data-tipped>
      <ha-icon icon="mdi:calendar-month-outline"></ha-icon>
      <span class="grow">
        ${c === "none" ? e`<b>${t("devices.car.no_calendar")}</b>` : e`<b>${s}</b>
              <small>
                ${t(c === "ok" ? "devices.car.calendar_ok" : "devices.car.calendar_problem")}
                ${l ? t("devices.car.checked", { when: new Date(l).toLocaleString(t.lang, {
			weekday: "short",
			hour: "2-digit",
			minute: "2-digit"
		}) }) : o}
              </small>`}
      </span>
      <button type="button" class="mini-btn ${c === "none" ? "go" : ""}" @click=${() => this.editAction(r.id, "calendars")}>
        ${t(c === "none" ? "devices.car.connect" : "devices.car.change")}
      </button>
      ${y(t, "car_calendar_card")}
    </div>`;
	}
	hasSuggestion(e) {
		return !!(this.discovery?.batteries.find((t) => t.id === e.id))?.suggested?.complete;
	}
	renderTest(t, n, r, i, a) {
		let s = !!this.state?.control?.testing, c = !!this.state?.control?.steering, l = a ? e`<span class="chip">${t("devices.test.running")}</span>` : r === "outdated" ? e`<span class="chip warn">${t("devices.test.outdated")}</span>` : i ? e`<span class="chip ${i.ok ? "ok" : "warn"}"
              >${t(i.ok ? "devices.test.ok" : "devices.test.failed", { day: W(t.lang, i.at, "short") })}</span
            >` : e`<span class="chip">${t("devices.test.none")}</span>`, u = a?.steps ?? i?.steps ?? [];
		return e`<div class="test">
        ${l}
        <button
          type="button"
          class="btn btn-secondary"
          ?disabled=${s || c}
          @click=${() => this.confirm = n}
        >
          <ha-icon icon="mdi:play-circle-outline"></ha-icon>${t(i ? "devices.test.again" : "devices.test.start")}
        </button>
        ${y(t, "devices_test")}
      </div>
      ${a || i ? this.renderSteps(t, u, a?.step ?? null, i) : o}`;
	}
	renderSteps(t, n, r, i) {
		let a = new Map(n.map((e) => [e.step, e])), s = !r && i?.problem ? t.optional(`devices.test.problem.${i.problem}`, { missing: (i.missing ?? []).map((e) => t.optional(`role.${e}`) ?? e).join(", ") }) : null;
		return e`<ul class="steps">
      ${s ? e`<li class="bad"><ha-icon icon="mdi:close-circle"></ha-icon><b>${t("devices.test.step.check")}</b><small>${s}</small></li>` : o}
      ${s ? o : pn.map((n) => {
			let i = a.get(n), o = i ? i.ok ? "ok" : "bad" : "wait", s = i ? i.ok ? "mdi:check-circle" : "mdi:close-circle" : r === n ? "mdi:progress-clock" : "mdi:circle-outline";
			return e`<li class=${o}>
              <ha-icon icon=${s}></ha-icon>
              <b>${t(`devices.test.step.${n}`)}</b>
              <small>${i ? this.stepText(t, i) : ""}</small>
            </li>`;
		})}
    </ul>`;
	}
	stepText(e, t) {
		let n = this.hass, r = [];
		return t.power != null && r.push(Math.abs(t.power) >= .05 ? e("devices.test.power", { value: b(e.lang, t.power, 2) }) : e("devices.test.no_power")), t.wrong.length && r.push(e("devices.test.wrong", { entities: t.wrong.map((e) => p(n, e)).join(", ") })), t.errors.length && r.push(e("devices.test.error", { entities: t.errors.map((e) => p(n, e.entity_id)).join(", ") })), r.join(" · ");
	}
	renderLog(t, n) {
		let r = [...n.log].reverse().slice(0, 30);
		return e`<section class="card">
      <div class="eyebrow"><ha-icon icon="mdi:clipboard-text-clock-outline"></ha-icon>${t("devices.log")}</div>
      ${r.length ? e`<ul class="log">
            ${r.map((n) => e`<li>
                <time>${W(t.lang, n.at, "short")} ${n.at.slice(11, 16)}</time>
                <span>${this.logText(t, n)}</span>
              </li>`)}
          </ul>` : e`<p class="empty">${t("devices.log.empty")}</p>`}
    </section>`;
	}
	logText(e, t) {
		let n = this.hass, r = this.state?.config, i = {
			battery: r?.batteries.find((e) => e.id === t.battery)?.name ?? r?.actions.find((e) => `action:${e.id}` === t.battery)?.name ?? t.battery ?? "",
			entity: t.entity ? p(n, t.entity) : "",
			value: t.value == null ? "–" : String(t.value),
			target: String(t.target ?? ""),
			power: typeof t.power == "number" ? b(e.lang, t.power, 1) : "–",
			soc: typeof t.soc == "number" ? b(e.lang, t.soc, 0) : "–",
			unit: typeof t.unit == "string" ? t.unit : "%"
		};
		return t.kind === "boost_end" ? e.optional(`log.boost_end.${String(t.reason)}`, i) ?? e("log.boost_end.stopped", i) : t.kind === "answer" ? e(t.yes ? "log.answer.yes" : "log.answer.no") : t.kind === "test" ? e(t.ok ? "log.test.ok" : "log.test.failed", i) : e.optional(`log.${t.kind}`, i) ?? t.kind;
	}
	renderConfirm(t, n) {
		let r = () => {
			this.confirm = void 0;
		};
		return e`<joe-sheet label=${t("devices.test.start")} closeLabel=${t("common.close")} @joe-close=${r}>
      <div data-tipped>
        <div class="sheet-title">
          ${T(t("devices.test.confirm.title", { name: n.name }), "h2", y(t, "devices_test"))}
        </div>
        <p class="sheet-text">${t("devices.test.confirm.text")}</p>
        <div class="actions">
          <button type="button" class="btn btn-secondary" data-notip @click=${r}>${t("common.cancel")}</button>
          <button type="button" class="btn btn-primary" @click=${() => this.startTest(n)}>
            ${t("devices.test.confirm.go")}
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
C([r({ attribute: !1 })], q.prototype, "hass", void 0), C([r({ attribute: !1 })], q.prototype, "t", void 0), C([r({ attribute: !1 })], q.prototype, "state", void 0), C([r({ attribute: !1 })], q.prototype, "discovery", void 0), C([r({ attribute: !1 })], q.prototype, "info", void 0), C([c()], q.prototype, "confirm", void 0), C([c()], q.prototype, "notice", void 0), S("joe-devices-page", q);
//#endregion
//#region src/components/chart.ts
var mn = 40, hn = 10, gn = 16, _n = 24;
function vn(e) {
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
function yn(e) {
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
		this.styles = a`
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
		if (!t) return o;
		let n = Math.max(260, this.width), r = this.height, a = n - mn - hn, s = r - gn - _n, c = a / t, l = this.series.flatMap((e) => e.values.filter((e) => e != null)), u = this.max || vn(Math.max(.1, ...l)), d = Math.min(0, ...l), f = d < 0 ? -Math.max(vn(-d), u / 4) : 0, p = (e) => gn + s - (Math.max(f, Math.min(e, u)) - f) / (u - f) * s, m = (e) => mn + e * c, h = (e) => mn + (e + .5) * c, g = (e, t = 2) => new Intl.NumberFormat(this.lang, { maximumFractionDigits: t }).format(e), _ = [];
		for (let e of this.bands) _.push(i`<rect class="band" x=${m(e.from)} y=${gn} width=${Math.max(0, m(e.to) - m(e.from))} height=${s}></rect>
        <text class="note" x=${(m(e.from) + m(e.to)) / 2} y=${28} text-anchor="middle">${e.label}</text>`);
		for (let e of f < 0 ? [
			f,
			0,
			u
		] : [
			0,
			u / 2,
			u
		]) _.push(i`<line class="grid" x1=${mn} x2=${n - hn} y1=${p(e)} y2=${p(e)}></line>
        <text class="tick" x=${34} y=${p(e) + 4} text-anchor="end">${g(e, 2)}</text>`);
		_.push(i`<text class="tick" x=${34} y=${11} text-anchor="end">${this.unit}</text>`);
		for (let [e, t] of this.ticks) _.push(i`<text class="tick" x=${this.centerTicks ? h(e) : m(e)} y=${r - 6}
        text-anchor="middle">${t}</text>`);
		let v = this.series.filter((e) => e.kind === "bar"), ee = c * .68 / Math.max(1, v.length);
		for (let e of this.series) {
			if (e.kind === "bar") {
				let t = c * .16 + v.indexOf(e) * ee;
				e.values.forEach((n, r) => {
					if (n != null && n !== 0) {
						let a = Math.min(p(n), p(0));
						_.push(i`<rect x=${m(r) + t} y=${a} width=${Math.max(1, ee - 1)}
              height=${Math.max(1, Math.abs(p(0) - p(n)))} rx="2"
              fill=${n < 0 ? e.negative ?? e.color : e.color}></rect>`);
					}
				});
				continue;
			}
			for (let t of yn(e.values)) {
				let n = t.map(([e, t]) => `${h(e).toFixed(1)},${p(t).toFixed(1)}`).join(" ");
				if (e.kind === "area" && t.length > 1) {
					let r = p(0).toFixed(1);
					_.push(i`<polygon points=${`${h(t[0][0]).toFixed(1)},${r} ${n} ${h(t[t.length - 1][0]).toFixed(1)},${r}`}
            fill=${e.fill ?? e.color}></polygon>`);
				}
				t.length > 1 ? _.push(i`<polyline points=${n} fill="none" stroke=${e.color} stroke-width=${e.kind === "line" ? 2.4 : 2}
            stroke-linejoin="round" stroke-dasharray=${e.dashed ? "5 4" : "none"}></polyline>`) : _.push(i`<circle cx=${h(t[0][0])} cy=${p(t[0][1])} r="2.5" fill=${e.color}></circle>`);
			}
		}
		for (let e of this.markers) {
			let t = mn + e.at * c, r = t < mn + a * .75;
			_.push(i`<line class="marker" x1=${t} x2=${t} y1=${gn} y2=${gn + s}></line>
        <text class="note" x=${r ? t + 4 : t - 4} y=${28} text-anchor=${r ? "start" : "end"}>
          ${n < 520 ? e.short ?? e.label : e.label}
        </text>`);
		}
		this.hover != null && _.push(i`<line class="guide" x1=${h(this.hover)} x2=${h(this.hover)} y1=${gn} y2=${gn + s}></line>`);
		for (let e = 0; e < t; e++) _.push(i`<rect class="slot" x=${m(e)} y=${gn} width=${c} height=${s}
        @pointerenter=${() => this.hover = e} @click=${() => this.hover = e}></rect>`);
		return e`<svg
        viewBox="0 0 ${n} ${r}"
        height=${r}
        role="img"
        aria-label=${this.label}
        @pointerleave=${(e) => e.pointerType === "mouse" && (this.hover = null)}
      >
        ${_}
      </svg>
      ${this.hover == null ? o : this.renderBox(this.hover, h(this.hover), n, g)}`;
	}
	renderBox(t, n, r, i) {
		let a = n + 182 > r ? Math.max(0, n - 182) : n + 12;
		return e`<div class="box" style="left:${a}px">
      <b>${this.labels[t]}</b>
      ${this.series.map((n) => {
			let r = n.values[t];
			return r == null ? o : e`<div>
              <i style="background:${r < 0 ? n.negative ?? n.color : n.color}"></i><span>${n.label}</span
              ><em>${i(r, n.digits ?? 2)} ${this.unit}</em>
            </div>`;
		})}
    </div>`;
	}
};
C([r({ attribute: !1 })], J.prototype, "labels", void 0), C([r({ attribute: !1 })], J.prototype, "ticks", void 0), C([r({ attribute: !1 })], J.prototype, "series", void 0), C([r({ attribute: !1 })], J.prototype, "bands", void 0), C([r({ attribute: !1 })], J.prototype, "markers", void 0), C([r()], J.prototype, "unit", void 0), C([r({ type: Number })], J.prototype, "max", void 0), C([r({ type: Number })], J.prototype, "height", void 0), C([r()], J.prototype, "label", void 0), C([r()], J.prototype, "lang", void 0), C([r({ type: Boolean })], J.prototype, "centerTicks", void 0), C([c()], J.prototype, "width", void 0), C([c()], J.prototype, "hover", void 0), S("joe-chart", J);
//#endregion
//#region src/pages/history.ts
var bn = 14, xn = [
	"var(--joe-c-soc)",
	"var(--joe-c-soc-2)",
	"var(--joe-c-grid)",
	"var(--joe-c-ist)"
];
function Sn(e, t, n) {
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
		this.styles = [d, a`
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
				days: bn
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
		let t = this.t;
		return t ? this.days?.days.length ? e`<div class="wrap">
      ${T(t("history.title"))} ${w}
      <p class="status">${this.statusText(t)}</p>
      ${this.renderStrip(t, this.days.days)} ${this.detail ? this.renderDay(t, this.detail) : o}
    </div>` : this.renderEmpty(t) : o;
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
	renderEmpty(t) {
		let n = this.state?.observe, r = this.state?.mode === "off" ? "history.empty.off" : n?.backfill.state === "running" ? "history.empty.reading" : n?.active ? "history.empty.soon" : "history.empty.waiting";
		return e`<div class="empty">
      <joe-pose name="inspect"></joe-pose>
      <div>
        ${T(t("history.title"))} ${w}
        <p class="lead">${t(r)}</p>
        ${this.failed ? e`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${t("history.failed")}</div>` : o}
      </div>
    </div>`;
	}
	renderStrip(t, n) {
		let r = n[0].date, i = new Map(n.map((e) => [e.date, e])), a = [];
		for (let e = 13; e >= 0; e--) {
			let t = /* @__PURE__ */ new Date(`${r}T12:00:00Z`);
			t.setUTCDate(t.getUTCDate() - e), a.push(t.toISOString().slice(0, 10));
		}
		let o = Math.max(.1, ...n.flatMap((e) => [e.home ?? 0, e.solar ?? 0]));
		return e`<div class="strip" role="group" aria-label=${t("history.days")} data-notip>
      ${a.map((n) => {
			let r = i.get(n);
			return e`<button
          type="button"
          aria-pressed=${String(n === this.selected)}
          ?disabled=${!r}
          aria-label=${Sn(t.lang, n, "long")}
          @click=${() => this.select(n)}
        >
          <small>${Sn(t.lang, n, "short")}</small>
          <b>${Number(n.slice(8))}</b>
          <span class="mini" aria-hidden="true">
            <i style="height:${(r?.home ?? 0) / o * 26}px;background:var(--joe-c-load)"></i>
            <i style="height:${(r?.solar ?? 0) / o * 26}px;background:var(--joe-c-pv)"></i>
          </span>
        </button>`;
		})}
    </div>`;
	}
	renderDay(t, n) {
		let r = n.summary, i = Math.max(0, r.expected - n.hours.filter((e) => e.cov >= .9).length), a = r.sources.live ?? 0, s = (r.sources.stats ?? 0) + (r.sources.history ?? 0);
		return e`<div class="day-head">
        <h3>${Sn(t.lang, n.date, "long")}</h3>
        ${n.workday === !0 ? e`<span class="chip">${t("history.workday")}</span>` : n.workday === !1 ? e`<span class="chip">${t("history.day_off")}</span>` : o}
        ${a ? e`<span class="chip ok"><ha-icon icon="mdi:eye-outline"></ha-icon>${t("history.live")}</span>` : o}
        ${s ? e`<span class="chip read"><ha-icon icon="mdi:database-outline"></ha-icon>${t("history.read")}</span>` : o}
      </div>
      ${this.renderTiles(t, r)} ${this.renderEnergyChart(t, n)} ${this.renderSocChart(t, n)}
      ${this.renderEvaluation(t, n)}
      ${i && r.date !== this.days?.days[0]?.date ? e`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon><span>${t("history.missing", { hours: i })}</span>
          </div>` : o}`;
	}
	renderTiles(t, n) {
		let r = (e) => e == null ? "–" : b(t.lang, e, 1), i = [], a = (t, n, r, i) => e`<div class="tile">
        <div class="eyebrow">${t}</div>
        <div class="value">${n}<small>${r}</small></div>
        ${i ? e`<div class="sub">${i}</div>` : o}
      </div>`;
		if (n.home != null && i.push(a(t("history.tile.home"), r(n.home), "kWh", n.self_sufficiency == null ? "" : t("history.tile.home.self", { value: b(t.lang, n.self_sufficiency * 100, 0) }))), n.solar != null && i.push(a(t("history.tile.solar"), r(n.solar), "kWh", n.fc_ahead == null ? t("history.tile.solar.nofc") : t("history.tile.solar.fc", {
			value: r(n.fc_ahead),
			ratio: n.solar_vs_fc == null ? "–" : b(t.lang, n.solar_vs_fc * 100, 0)
		}))), n.grid_in != null) {
			let e = [];
			n.grid_in_cheap != null && e.push(t("history.tile.grid.cheap", { value: r(n.grid_in_cheap) })), n.grid_out != null && e.push(t("history.tile.grid.out", { value: r(n.grid_out) })), i.push(a(t("history.tile.grid"), r(n.grid_in), "kWh", e.join(" · ")));
		}
		if (n.bat_in != null && i.push(a(t("history.tile.battery"), r(n.bat_in), "kWh", t("history.tile.battery.out", { value: r(n.bat_out) }))), n.temp && i.push(a(t("history.tile.temp"), b(t.lang, n.temp.mean, 1), "°C", t("history.tile.temp.range", {
			min: b(t.lang, n.temp.min, 0),
			max: b(t.lang, n.temp.max, 0)
		}))), n.present) {
			let e = new Map((this.state?.config.persons ?? []).map((e) => [e.id, e.name])), r = Object.entries(n.present), o = Math.max(...r.map(([, e]) => e));
			i.push(a(t("history.tile.present"), b(t.lang, o, 0), "h", r.map(([n, r]) => `${e.get(n) ?? n} ${b(t.lang, r, 0)} h`).join(" · ")));
		}
		return e`<div class="tiles">${i}</div>`;
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
	renderEnergyChart(t, n) {
		let r = (e) => {
			let t = n.slots.map(() => null);
			for (let r of n.hours) r[e] != null && (t[r.slot] = r[e]);
			return t;
		}, i = n.fc_ahead_slots.some((e) => e != null) ? n.fc_ahead_slots : n.fc_slots, a = [{
			label: t("history.chart.solar"),
			kind: "area",
			values: r("solar"),
			color: "var(--joe-c-pv)",
			fill: "var(--joe-c-pv-fill)"
		}, {
			label: t("history.chart.home"),
			kind: "bar",
			values: r("home"),
			color: "var(--joe-c-load)"
		}];
		i.some((e) => e != null) && a.push({
			label: t("history.chart.forecast"),
			kind: "line",
			values: i,
			color: "var(--joe-c-ist)",
			dashed: !0
		});
		let o = this.chartFrame(n);
		return e`<div class="chart-card" data-tipped>
      <div class="chart-head">${t("history.chart.energy")} ${y(t, "chart_energy")}</div>
      <joe-chart
        .labels=${o.labels}
        .ticks=${o.ticks}
        .series=${a}
        .bands=${o.bands}
        .markers=${o.markers}
        unit="kWh"
        lang=${t.lang}
        label=${t("history.chart.energy")}
      ></joe-chart>
      <div class="legend">
        ${a.map((t) => e`<span><i class=${t.dashed ? "dash" : ""} style="background:${t.color};color:${t.color}"></i>${t.label}</span>`)}
      </div>
    </div>`;
	}
	renderSocChart(t, n) {
		let r = (this.state?.config.batteries ?? []).map((e, t) => {
			let r = n.slots.map(() => null);
			for (let t of n.hours) {
				let n = t.bat?.[e.id]?.soc;
				n != null && (r[t.slot] = n);
			}
			return {
				label: e.name,
				kind: "line",
				values: r,
				color: xn[t % xn.length],
				digits: 0
			};
		});
		if (!r.some((e) => e.values.some((e) => e != null))) return o;
		n.plan_soc_slots.some((e) => e != null) && r.push({
			label: t("history.chart.plan"),
			kind: "line",
			values: n.plan_soc_slots,
			color: "var(--joe-c-ist)",
			dashed: !0,
			digits: 0
		});
		let i = this.chartFrame(n);
		return e`<div class="chart-card" data-tipped>
      <div class="chart-head">${t("history.chart.soc")} ${y(t, "chart_soc")}</div>
      <joe-chart
        .labels=${i.labels}
        .ticks=${i.ticks}
        .series=${r}
        .bands=${i.bands}
        max="100"
        height="170"
        unit="%"
        lang=${t.lang}
        label=${t("history.chart.soc")}
      ></joe-chart>
      <div class="legend">
        ${r.map((t) => e`<span><i class=${t.dashed ? "dash" : ""} style="background:${t.color};color:${t.color}"></i>${t.label}</span>`)}
      </div>
    </div>`;
	}
	renderEvaluation(t, n) {
		let r = n.evaluation;
		if (!n.plan?.fixed) return o;
		if (!r) return e`<div class="note"><ha-icon icon="mdi:timer-sand"></ha-icon><span>${t("history.eval.pending")}</span></div>`;
		if (!r.complete) return e`<div class="note warn">
        <ha-icon icon="mdi:alert-outline"></ha-icon><span>${t("history.eval.incomplete")}</span>
      </div>`;
		let i = this.hass?.config?.currency, a = r.saving ?? 0, s = a > .005 ? "good" : a < -.005 ? "bad" : "", c = (e) => U(t.lang, e ?? 0, 1), l = (e) => e ? t("history.eval.clock", { time: this.time(e) }) : t("history.eval.never"), u = !r.final, d = [[t("history.eval.day"), t("history.eval.instead", {
			with: c(r.with_plan?.day_kwh),
			without: c(r.without?.day_kwh)
		})], [t("history.eval.night"), t("history.eval.instead", {
			with: c(r.with_plan?.night_kwh),
			without: c(r.without?.night_kwh)
		})]];
		!u && r.solar?.forecast != null && d.push([t("history.eval.solar"), t("history.eval.solar.value", {
			actual: c(r.solar.actual),
			expected: c(r.solar.forecast)
		})]), !u && r.bridge && d.push([t("history.eval.morning"), t("history.eval.morning.value", {
			actual: c(r.bridge.actual),
			expected: c(r.bridge.planned)
		})]), !u && r.takeover && d.push([t("history.eval.takeover"), t("history.eval.takeover.value", {
			actual: l(r.takeover.actual),
			expected: l(r.takeover.planned)
		})]);
		let f = [{
			label: t("history.eval.chart.with"),
			kind: "line",
			values: n.evaluation_slots.with,
			color: "var(--joe-c-soc)",
			digits: 0
		}, {
			label: t("history.eval.chart.without"),
			kind: "line",
			values: n.evaluation_slots.without,
			color: "var(--joe-c-ist)",
			dashed: !0,
			digits: 0
		}], p = this.chartFrame(n);
		return e`<div class="chart-card" data-tipped>
      <div class="chart-head">
        ${t("history.eval")} ${y(t, "chart_replay")}
        ${u && r.until ? e`<span class="chip warn">${t("history.eval.provisional", { time: this.time(r.until) })}</span>` : o}
      </div>
      <div class="eval-top">
        <div class="eval-big ${s}">
          ${s === "bad" ? tn(t, -a, i) : tn(t, a, i)}
          <small>${t(s === "good" ? "history.eval.saved" : s === "bad" ? "history.eval.cost" : "history.eval.same")}</small>
        </div>
        <dl>${d.map(([t, n]) => e`<dt>${t}</dt><dd>${n}</dd>`)}</dl>
      </div>
      ${u && r.until ? e`<div class="note">
            <ha-icon icon="mdi:timer-sand"></ha-icon
            ><span>${t("history.eval.provisional.note", { time: this.time(r.until) })}</span>
          </div>` : o}
      ${f.some((e) => e.values.some((e) => e != null)) ? e`<joe-chart
              .labels=${p.labels}
              .ticks=${p.ticks}
              .series=${f}
              .bands=${p.bands}
              max="100"
              height="150"
              unit="%"
              lang=${t.lang}
              label=${t("history.eval")}
            ></joe-chart>
            <div class="legend">
              ${f.map((t) => e`<span><i class=${t.dashed ? "dash" : ""} style="background:${t.color};color:${t.color}"></i>${t.label}</span>`)}
            </div>` : o}
    </div>`;
	}
	time(e) {
		return e.slice(11, 16);
	}
};
C([r({ attribute: !1 })], Y.prototype, "hass", void 0), C([r({ attribute: !1 })], Y.prototype, "t", void 0), C([r({ attribute: !1 })], Y.prototype, "state", void 0), C([c()], Y.prototype, "days", void 0), C([c()], Y.prototype, "selected", void 0), C([c()], Y.prototype, "detail", void 0), C([c()], Y.prototype, "failed", void 0), S("joe-history", Y);
//#endregion
//#region src/components/day-questions.ts
var Cn = {
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
}, wn = class extends n {
	constructor(...e) {
		super(...e), this.questions = [], this.failed = !1, this.answered = /* @__PURE__ */ new Set();
	}
	static {
		this.styles = [d, a`
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
		let t = this.t, n = this.questions.filter((e) => !this.answered.has(e.date));
		return !t || !n.length ? o : e`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:chat-question-outline"></ha-icon>${t("ask.title")}</div>
        ${y(t, "ask_day")}
      </div>
      <p class="lead">${t("ask.lead")}</p>
      ${n.map((n) => e`<div class="question">
          <p>
            ${t(`ask.${n.kind}`, {
			day: W(t.lang, n.date, "weekday"),
			actual: U(t.lang, n.actual, 1),
			expected: U(t.lang, n.expected, 1)
		})}
          </p>
          <div class="answers" role="group" aria-label=${t("ask.answers")}>
            ${Cn[n.kind].map((r) => e`<button
                  type="button"
                  class="mini-btn ${r === "normal" ? "quiet" : ""}"
                  ?disabled=${this.busy === n.date}
                  @click=${() => this.answer(n.date, r)}
                >
                  ${t(`ask.answer.${r}`)}
                </button>`)}
          </div>
        </div>`)}
      ${this.failed ? e`<div class="note warn" role="status"><ha-icon icon="mdi:alert-outline"></ha-icon>${t("error.action")}</div>` : o}
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
C([r({ attribute: !1 })], wn.prototype, "hass", void 0), C([r({ attribute: !1 })], wn.prototype, "t", void 0), C([r({ attribute: !1 })], wn.prototype, "questions", void 0), C([c()], wn.prototype, "busy", void 0), C([c()], wn.prototype, "failed", void 0), C([c()], wn.prototype, "answered", void 0), S("joe-day-questions", wn);
//#endregion
//#region src/pages/learn.ts
var Tn = [
	"clear",
	"mixed",
	"overcast"
], En = [
	"vacation",
	"travel",
	"home_office",
	"office",
	"guests",
	"home"
], Dn = {
	forecast_solar: "Forecast.Solar",
	open_meteo_solar_forecast: "Open-Meteo Solar Forecast",
	solcast_solar: "Solcast"
};
function On(e, t, n) {
	let r = e.base + (t ? e.workday : 0) + e.heat * Math.max(0, 15 - n) + e.cool * Math.max(0, n - 22);
	return e.presence != null && (r += e.presence * (e.presence_mean ?? 0)), Math.max(0, r);
}
function kn(e, t) {
	let n = Math.max(1, Math.ceil(t.length / 7)), r = /* @__PURE__ */ new Map();
	return t.forEach((i, a) => {
		(t.length - 1 - a) % n == 0 && r.set(a, W(e, i, "short"));
	}), r;
}
var X = class extends n {
	constructor(...e) {
		super(...e), this.failed = !1, this.confirming = !1, this.resetting = !1, this.scope = "all", this.keyword = {}, this.calendarFor = "";
	}
	static {
		this.styles = [d, a`
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
      .own-rules {
        --mdc-icon-size: 16px;
        margin-left: 4px;
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
		let t = this.t;
		if (!t) return o;
		let n = this.data;
		return e`<div class="wrap">
        <div class="intro">
          <div>
            ${T(t("learn.page.title"))} ${w}
            <p class="lead">${t("learn.lead")}</p>
            <p class="status">${this.statusText(t)}</p>
          </div>
          <joe-pose name="learn"></joe-pose>
        </div>
        ${this.failed ? e`<div class="note warn"><ha-icon icon="mdi:alert-outline"></ha-icon>${t("learn.failed")}</div>` : o}
        ${n ? e`${this.renderResults(t, n)}
              <joe-day-questions
                class="wide"
                .hass=${this.hass}
                .t=${t}
                .questions=${n.questions}
                @joe-answered=${() => this.load()}
              ></joe-day-questions>
              <div class="grid">
                ${this.renderSolar(t, n)} ${this.renderShift(t, n)} ${this.renderBuffer(t, n)} ${this.renderHome(t, n)}
              </div>
              <div class="eyebrow section"><ha-icon icon="mdi:brain"></ha-icon>${t("learn.models")}</div>
              <div class="grid">
                ${this.renderWeather(t, n)} ${this.renderSources(t, n)} ${this.renderBatteries(t, n)}
                ${this.renderGroups(t, n)} ${this.renderHotWater(t, n)} ${this.renderCars(t, n)}
                ${this.renderPresence(t, n)}
              </div>
              ${this.renderCalendar(t)} ${this.renderAccuracy(t, n)} ${this.renderReset(t)}` : o}
      </div>
      ${this.confirming ? this.renderConfirm(t) : o}`;
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
	renderResults(t, n) {
		let r = n.results, i = e`<div class="head">
      <div class="eyebrow"><ha-icon icon="mdi:cash-check"></ha-icon>${t("learn.results")}</div>
      <span class="pill-sim">${t("mode.simulation")}</span>
      ${y(t, "sim_result")}
    </div>`;
		if (!r?.days) return e`<section class="card hero" data-tipped>${i}
        <p class="say">${t("learn.results.none")}</p>
      </section>`;
		let a = r.daily, s = [{
			label: t("learn.results.chart.saving"),
			kind: "bar",
			values: a.map((e) => e.saving),
			color: "var(--joe-good)",
			negative: "var(--joe-crit)",
			digits: 2
		}], c = r.since ?? r.first;
		return e`<section class="card hero" data-tipped>
      ${i}
      <div class="figure">
        <div class="big ${r.saving > .005 ? "good" : r.saving < -.005 ? "bad" : ""}">
          ${tn(t, r.saving, this.currency, !0)}
        </div>
      </div>
      <p class="say">
        ${t("learn.results.say", {
			since: c ? W(t.lang, c) : "–",
			nights: an(t, r.days)
		})}
      </p>
      <p class="split">
        ${t("learn.results.split", {
			better: r.better,
			worse: r.worse,
			same: Math.max(0, r.days - r.better - r.worse)
		})}
      </p>
      ${a.length > 1 ? e`<joe-chart
            .labels=${a.map((e) => W(t.lang, e.date, "weekday"))}
            .ticks=${kn(t.lang, a.map((e) => e.date))}
            .series=${s}
            centerTicks
            unit=${nn(t.lang, this.currency)}
            height="160"
            lang=${t.lang}
            label=${t("learn.results.chart")}
          ></joe-chart>` : o}
    </section>`;
	}
	renderSolar(t, n) {
		let r = n.learned, i = r.solar_factor, a;
		a = i == null ? t("learn.solar.learning", {
			need: n.needs.solar,
			have: r.solar_days
		}) : i < .95 ? t("learn.solar.less", {
			value: b(t.lang, (1 - i) * 100, 0),
			share: b(t.lang, i * 100, 0)
		}) : i > 1.05 ? t("learn.solar.more", {
			value: b(t.lang, (i - 1) * 100, 0),
			share: b(t.lang, i * 100, 0)
		}) : t("learn.solar.fits");
		let s = n.solar.slice(-28), c = [{
			label: t("learn.solar.chart.actual"),
			kind: "bar",
			values: s.map((e) => e.actual),
			color: "var(--joe-c-pv)",
			digits: 1
		}, {
			label: t("learn.solar.chart.forecast"),
			kind: "line",
			values: s.map((e) => e.forecast),
			color: "var(--joe-c-ist)",
			dashed: !0,
			digits: 1
		}];
		return e`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:weather-sunny"></ha-icon>${t("learn.solar")}</div>
        ${y(t, "learn_solar")}
      </div>
      <div class="figure">
        <div class="big ${i == null ? "small" : ""}">
          ${i == null ? t("learn.still") : `× ${b(t.lang, i, 2)}`}
        </div>
        ${i == null ? o : e`${D(t, { source: "learned" })}<span class="chip">${t("learn.days", { days: r.solar_days })}</span>`}
      </div>
      <p class="say">${a}</p>
      ${s.length > 1 ? this.chartWithLegend(t, s.map((e) => e.date), c, "kWh", t("learn.solar.chart")) : o}
    </section>`;
	}
	renderShift(t, n) {
		let r = n.learned, i = r.solar_shift;
		return e`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:clock-time-four-outline"></ha-icon>${t("learn.shift")}</div>
        ${y(t, "learn_shift")}
      </div>
      <div class="figure">
        <div class="big ${i == null ? "small" : ""}">${t(i == null ? "learn.still" : `learn.shift.big.${i}`)}</div>
        ${i == null ? o : e`${D(t, { source: "learned" })}<span class="chip">${t("learn.days", { days: r.shift_days })}</span>`}
      </div>
      <p class="say">
        ${i == null ? t("learn.shift.learning", {
			need: n.needs.shift,
			have: r.shift_days
		}) : t(`learn.shift.${i}`)}
      </p>
      ${n.solar_profile ? this.hourChart(t, this.profileSeries(t, n.solar_profile), t("learn.shift.chart")) : o}
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
	hourChart(t, n, r) {
		let i = Array.from({ length: 24 }, (e, t) => `${String(t).padStart(2, "0")}:00–${String((t + 1) % 24).padStart(2, "0")}:00`), a = /* @__PURE__ */ new Map();
		for (let e = 0; e < 24; e += 3) a.set(e, String(e).padStart(2, "0"));
		return e`<joe-chart
        .labels=${i}
        .ticks=${a}
        .series=${n}
        unit="kWh"
        height="150"
        lang=${t.lang}
        label=${r}
      ></joe-chart>
      <div class="legend">
        ${n.map((t) => e`<span><i class=${t.dashed ? "dash" : ""} style="background:${t.color};color:${t.color}"></i>${t.label}</span>`)}
      </div>`;
	}
	renderBuffer(t, n) {
		let { value: r, source: i } = n.buffer, a = n.learned, s = (e) => b(t.lang, e * 100, 0), c;
		c = i === "user" ? a.buffer == null ? t("learn.buffer.user") : t("learn.buffer.user_learned", { value: s(a.buffer) }) : i === "learned" ? t("learn.buffer.learned") : t("learn.buffer.default", {
			need: n.needs.buffer,
			have: a.buffer_days
		});
		let l = n.accuracy.slice(-14), u = [{
			label: t("learn.buffer.chart.planned"),
			kind: "bar",
			values: l.map((e) => e.bridge.planned),
			color: "var(--joe-c-ist)",
			digits: 1
		}, {
			label: t("learn.buffer.chart.actual"),
			kind: "bar",
			values: l.map((e) => e.bridge.actual),
			color: "var(--joe-c-soc)",
			digits: 1
		}];
		return e`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:shield-half-full"></ha-icon>${t("learn.buffer")}</div>
        ${y(t, "learn_buffer")}
      </div>
      <div class="figure">
        <div class="big">${s(r)}<small> %</small></div>
        ${D(t, { source: i })}
        ${i === "learned" ? e`<span class="chip">${t("learn.mornings", { count: a.buffer_days })}</span>` : o}
      </div>
      <p class="say">${c}</p>
      ${i === "user" ? e`<div class="own">
            <button
              type="button"
              class="mini-btn"
              @click=${() => M(this, { rules: { buffer_factor: n.buffer.default } }, "default")}
            >
              <ha-icon icon="mdi:auto-fix"></ha-icon>${t("learn.buffer.own")}
            </button>
            ${y(t, "learn_buffer_own")}
          </div>` : o}
      ${l.length > 1 ? this.chartWithLegend(t, l.map((e) => e.date), u, "kWh", t("learn.buffer.chart")) : o}
    </section>`;
	}
	renderHome(t, n) {
		let r = n.consumption, i = (e) => U(t.lang, e.reduce((e, t) => e + t, 0), 1), a = [{
			label: t("learn.home.chart.workday"),
			kind: "line",
			values: r.workday,
			color: "var(--joe-c-load)"
		}, {
			label: t("learn.home.chart.day_off"),
			kind: "line",
			values: r.day_off,
			color: "var(--joe-c-soc-2)",
			dashed: !0
		}];
		return e`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:home-lightning-bolt-outline"></ha-icon>${t("learn.home")}</div>
        ${y(t, "learn_home")}
      </div>
      <p class="say">
        ${r.source === "history" ? t("learn.home.history", { days: r.days }) : t("learn.home.default")}
      </p>
      <p class="split">${t("learn.home.totals", {
			workday: i(r.workday),
			day_off: i(r.day_off)
		})}</p>
      ${this.hourChart(t, a, t("learn.home.chart"))}
    </section>`;
	}
	chartWithLegend(t, n, r, i, a) {
		return e`<joe-chart
        .labels=${n.map((e) => W(t.lang, e, "weekday"))}
        .ticks=${kn(t.lang, n)}
        .series=${r}
        centerTicks
        unit=${i}
        height="150"
        lang=${t.lang}
        label=${a}
      ></joe-chart>
      <div class="legend">
        ${r.map((t) => e`<span
              ><i class=${t.dashed ? "dash" : ""} style="background:${t.color};color:${t.color};height:${t.kind === "bar" ? "10px" : "4px"}"></i
              >${t.label}</span
            >`)}
      </div>`;
	}
	rows(t) {
		return e`<div class="rows">
      ${t.map((t) => e`<div class="row-item">
          <b>${t.name}</b>
          <span class="values">${t.values.map((t) => e`<span>${t}</span>`)}</span>
          ${t.note ? e`<small>${t.note}</small>` : o}
        </div>`)}
    </div>`;
	}
	renderWeather(t, n) {
		let r = t.lang, i = n.learned.consumption_model, a = n.days.filter((e) => e.temp != null), s = a.filter((e) => !e.excluded).length, c = this.state?.config.context.weather_entity, l;
		if (!c) l = t("learn.model.no_weather");
		else if (!i) l = t("learn.model.learning", {
			need: n.needs.models,
			have: s
		});
		else {
			let e = [t("learn.model.base", { value: U(r, i.base + (i.presence ?? 0) * (i.presence_mean ?? 0), 1) })];
			Math.abs(i.workday) >= .3 && e.push(t(i.workday > 0 ? "learn.model.workday_more" : "learn.model.workday_less", { value: U(r, Math.abs(i.workday), 1) })), i.heat >= .05 && e.push(t("learn.model.heat", { value: U(r, i.heat, 2) })), i.cool >= .05 && e.push(t("learn.model.cool", { value: U(r, i.cool, 2) })), i.presence != null && Math.abs(i.presence) >= .05 && e.push(t("learn.model.presence", { value: U(r, i.presence, 2) })), e.push(t("learn.model.fit", { share: b(r, i.r2 * 100, 0) })), l = e.join(" ");
		}
		let u = i != null && i.heat >= .05;
		return e`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:thermometer"></ha-icon>${t("learn.model")}</div>
        ${y(t, "learn_model")}
      </div>
      <div class="figure">
        <div class="big ${i ? "" : "small"}">
          ${i ? u ? e`+${U(r, i.heat, 2)}<small> kWh/°C</small>` : e`${U(r, i.base + (i.presence ?? 0) * (i.presence_mean ?? 0), 1)}<small> kWh</small>` : t("learn.still")}
        </div>
        ${i ? e`${D(t, { source: "learned" })}<span class="chip">${t("learn.days", { days: i.days })}</span>` : o}
      </div>
      <p class="say">${l}</p>
      ${a.length > 2 ? this.temperatureChart(t, n, i) : o}
    </section>`;
	}
	temperatureChart(t, n, r) {
		let i = n.days.filter((e) => e.temp != null && !e.excluded), a = i.map((e) => e.temp), o = Math.floor(Math.min(...a) / 2) * 2, s = Math.floor(Math.max(...a) / 2) * 2 + 2, c = [];
		for (let e = o; e < s; e += 2) c.push(e);
		let l = (e) => b(t.lang, e, 0), u = [{
			label: t("learn.model.chart.actual"),
			kind: "bar",
			values: c.map((e) => {
				let t = i.filter((t) => t.temp >= e && t.temp < e + 2);
				return t.length ? t.reduce((e, t) => e + t.home, 0) / t.length : null;
			}),
			color: "var(--joe-c-ist)",
			digits: 1
		}];
		r && u.push({
			label: t("learn.model.chart.workday"),
			kind: "line",
			values: c.map((e) => On(r, !0, e + 1)),
			color: "var(--joe-c-soc)",
			digits: 1
		}, {
			label: t("learn.model.chart.day_off"),
			kind: "line",
			values: c.map((e) => On(r, !1, e + 1)),
			color: "var(--joe-c-soc-2)",
			dashed: !0,
			digits: 1
		});
		let d = Math.max(1, Math.ceil(c.length / 8)), f = /* @__PURE__ */ new Map();
		return c.forEach((e, t) => {
			t % d === 0 && f.set(t, `${l(e)}°`);
		}), e`<joe-chart
        .labels=${c.map((e) => `${l(e)} … ${l(e + 2)} °C`)}
        .ticks=${f}
        .series=${u}
        unit="kWh"
        height="150"
        lang=${t.lang}
        label=${t("learn.model.chart")}
      ></joe-chart>
      <div class="legend">
        ${u.map((t) => e`<span
              ><i class=${t.dashed ? "dash" : ""} style="background:${t.color};color:${t.color};height:${t.kind === "bar" ? "10px" : "4px"}"></i
              >${t.label}</span
            >`)}
      </div>`;
	}
	renderSources(t, n) {
		let r = t.lang, i = this.state.config, a = n.learned.solar_classes ?? {}, s = a.classes ?? {}, c = i.forecast, l = n.learned.sources ?? {}, u = Tn.filter((e) => s[e]), d = (e) => b(r, e * 100, 0), f = [["main", c.provider ? Dn[c.provider] ?? c.provider : t("learn.sources.main")], ...c.alternatives.map((e) => [e.id, e.name])], p = Object.fromEntries(f.map(([e]) => [e, l[e] ? 1 / Math.max(l[e].error, .05) ** 2 : 0])), m = Object.values(p).reduce((e, t) => e + t, 0);
		return e`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:weather-partly-cloudy"></ha-icon>${t("learn.weather")}</div>
        ${y(t, "learn_weather")}
      </div>
      <p class="say">
        ${u.length ? t("learn.weather.say", { top: U(r, a.top ?? 0, 1) }) : t("learn.weather.learning", { have: a.days ?? 0 })}
      </p>
      ${u.length ? this.rows(Tn.map((e) => {
			let n = s[e];
			return {
				name: t(`learn.weather.${e}`),
				values: n ? [`× ${b(r, n.factor, 2)}`, t("learn.days", { days: n.days })] : [t("learn.still")]
			};
		})) : o}
      <div class="sub-head">
        <b>${t("learn.sources")}</b>
      </div>
      ${c.alternatives.length ? e`${this.rows(f.map(([e, i]) => {
			let a = l[e];
			return {
				name: i,
				values: a ? [
					`× ${b(r, a.factor, 2)}`,
					t("learn.sources.error", { value: d(a.error) }),
					c.combine && m ? t("learn.sources.weight", { value: d(p[e] / m) }) : ""
				] : [t("learn.sources.learning", { need: n.needs.sources })]
			};
		}))}
            <div class="toggle-row">
              <span class="with-tip"><span id="combine-label">${t("learn.sources.combine")}</span>${y(t, "learn_combine")}</span>
              <button
                type="button"
                class="switch"
                role="switch"
                aria-checked=${String(c.combine)}
                aria-labelledby="combine-label"
                @click=${() => M(this, { forecast: { combine: !c.combine } })}
              ></button>
            </div>` : e`<p class="say">${t("learn.sources.single")}</p>`}
    </section>`;
	}
	renderBatteries(t, n) {
		let r = t.lang, i = this.state.config, a = n.learned.battery_models ?? {};
		return e`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:battery-heart-variant"></ha-icon>${t("learn.battery")}</div>
        ${y(t, "learn_battery")}
      </div>
      ${i.batteries.length ? this.rows(i.batteries.map((e) => {
			let o = a[e.id], s = e.capacity_kwh, c = i.provenance[`batteries[${e.id}].capacity_kwh`]?.source === "user", l;
			return l = o ? c && s ? t("learn.battery.user", { value: U(r, s, 1) }) : s && (o.capacity_kwh / s < .5 || o.capacity_kwh / s > 1.15) ? t("learn.battery.odd", { value: U(r, s, 1) }) : s ? t("learn.battery.uses_nominal", { value: U(r, s, 1) }) : t("learn.battery.uses") : e.power ? t("learn.battery.learning", { need: n.needs.models }) : t("learn.battery.no_power"), {
				name: e.name,
				values: o ? [
					t("learn.battery.capacity", { value: U(r, o.capacity_kwh, 1) }),
					t("learn.battery.efficiency", { value: b(r, o.efficiency * 100, 0) }),
					...o.converter ? [t("learn.battery.converter", { value: b(r, o.converter.factor * 100, 0) })] : []
				] : [t("learn.still")],
				note: l
			};
		})) : e`<p class="say">${t("learn.battery.none")}</p>`}
    </section>`;
	}
	renderGroups(t, n) {
		let r = t.lang, i = this.state.config, a = n.learned.group_models ?? {}, o = i.consumers.filter((e) => e.energy_entity && e.kind !== "submeter");
		return e`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:chart-donut"></ha-icon>${t("learn.groups")}</div>
        ${y(t, "learn_groups")}
      </div>
      ${o.length ? this.rows(o.map((e) => {
			let n = a[e.id];
			return {
				name: e.name,
				values: n ? [t("learn.groups.average", { value: U(r, n.average, 1) }), n.heat >= .05 ? t("learn.groups.heat", { value: U(r, n.heat, 2) }) : t("learn.groups.steady")] : [t("learn.still")]
			};
		})) : e`<p class="say">${t("learn.groups.none")}</p>`}
    </section>`;
	}
	renderHotWater(t, n) {
		let r = t.lang, i = this.state.config, a = n.learned.action_models ?? {}, o = i.actions.filter((e) => e.kind === "target");
		return e`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:water-boiler"></ha-icon>${t("learn.hot_water")}</div>
        ${y(t, "learn_hot_water")}
      </div>
      ${o.length ? this.rows(o.map((e) => {
			let n = a[e.id];
			return {
				name: e.name,
				values: n ? [
					t("learn.hot_water.rate", { value: U(r, n.rate_k_per_h, 1) }),
					t("learn.hot_water.loss", { value: U(r, n.loss_k_per_h, 1) }),
					t("learn.hot_water.demand", { value: U(r, n.demand_k, 0) })
				] : [t("learn.still")],
				note: n ? void 0 : t("learn.hot_water.learning")
			};
		})) : e`<p class="say">${t("learn.hot_water.none")}</p>`}
    </section>`;
	}
	renderCars(t, n) {
		let r = t.lang, i = this.state.config, a = n.learned.car_models ?? {}, o = i.actions.filter((e) => e.kind === "switch" && e.need?.enabled);
		return e`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:car-electric"></ha-icon>${t("learn.car")}</div>
        ${y(t, "learn_car")}
      </div>
      ${o.length ? this.rows(o.map((e) => {
			let n = a[e.id], i = [];
			return n?.consumption != null && (i.push(t("learn.car.consumption", { value: U(r, n.consumption, 1) })), n.cold && i.push(t("learn.car.cold", { value: U(r, n.cold, 2) }))), (n?.workday_km != null || n?.day_off_km != null) && i.push(t("learn.car.km", {
				workday: n.workday_km == null ? "–" : U(r, n.workday_km, 0),
				day_off: n.day_off_km == null ? "–" : U(r, n.day_off_km, 0)
			})), {
				name: e.name,
				values: i.length ? i : [t("learn.still")],
				note: i.length ? void 0 : t(e.need?.odometer_entity ? "learn.car.learning" : "learn.car.no_odometer")
			};
		})) : e`<p class="say">${t("learn.car.none")}</p>`}
    </section>`;
	}
	renderPresence(t, n) {
		let r = t.lang, i = this.state.config, a = n.learned.presence ?? {}, o = i.persons.filter((e) => e.calendars.length);
		return e`<section class="card" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:account-clock-outline"></ha-icon>${t("learn.presence")}</div>
        ${y(t, "learn_presence")}
      </div>
      ${o.length ? this.rows(o.map((e) => {
			let n = Qe.filter((t) => a[e.id]?.[t]);
			return {
				name: e.name,
				values: n.length ? n.map((n) => t("learn.presence.value", {
					label: t(`label.${n}`),
					hours: U(r, a[e.id][n].hours, 0)
				})) : [t("learn.still")],
				note: e.person_entity ? void 0 : t("learn.presence.no_person")
			};
		})) : e`<p class="say">${t("learn.presence.none")}</p>`}
      <div class="own">
        <button type="button" class="mini-btn" @click=${() => this.edit("household")}>
          <ha-icon icon="mdi:calendar-account-outline"></ha-icon>${t("learn.presence.calendars")}
        </button>
      </div>
    </section>`;
	}
	renderCalendar(t) {
		let n = this.state.config, r = n.persons.find((e) => e.id === this.calendarFor), i = !!r && !r.calendar, a = r?.calendar ?? n.calendar, s = (e) => a.rules.filter((t) => t.label === e);
		return e`<section class="card wide" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:calendar-text-outline"></ha-icon>${t("learn.calendar")}</div>
        ${y(t, "learn_calendar")}
      </div>
      <p class="say">${t("learn.calendar.say")}</p>
      ${n.persons.length ? e`<div class="sub-head with-tip"><b>${t("learn.calendar.for")}</b>${y(t, "cal_person")}</div>
            <div class="seg scopes" role="group" aria-label=${t("learn.calendar.for")}>
              <button type="button" aria-pressed=${String(!r)} @click=${() => this.calendarFor = ""}>
                ${t("learn.calendar.everyone")}
              </button>
              ${n.persons.map((t) => e`<button type="button" aria-pressed=${String(t.id === r?.id)} @click=${() => this.calendarFor = t.id}>
                    ${t.name}${t.calendar ? e`<ha-icon class="own-rules" icon="mdi:account-cog-outline"></ha-icon>` : o}
                  </button>`)}
            </div>` : o}
      ${r ? e`<div class="toggle-row">
            <span class="with-tip"><span id="cal-shared-label">${t("learn.calendar.shared")}</span>${y(t, "cal_shared")}</span>
            <button
              type="button"
              class="switch"
              role="switch"
              aria-checked=${String(i)}
              aria-labelledby="cal-shared-label"
              @click=${() => this.saveCalendar(r, i ? structuredClone(n.calendar) : null)}
            ></button>
          </div>` : o}
      ${i ? e`<p class="say">${t("learn.calendar.shared.say", { name: r.name })}</p>` : e`<div class="rules">
              ${En.map((n) => e`<div class="rule">
                  <b>${t(`label.${n}`)}</b>
                  <div class="keywords">
                    ${s(n).map((n) => e`<span class="keyword"
                          >${n.keyword}<button
                            type="button"
                            aria-label=${t("learn.calendar.remove", { keyword: n.keyword })}
                            @click=${() => this.saveRules(a.rules.filter((e) => e !== n))}
                          >
                            <ha-icon icon="mdi:close"></ha-icon></button
                        ></span>`)}
                    <form
                      class="add"
                      @submit=${(e) => {
			e.preventDefault(), this.addKeyword(a, n);
		}}
                    >
                      <input
                        class="input"
                        .value=${this.keyword[n] ?? ""}
                        maxlength="40"
                        placeholder=${t("learn.calendar.keyword")}
                        aria-label=${t("learn.calendar.add_to", { label: t(`label.${n}`) })}
                        @input=${(e) => this.keyword = {
			...this.keyword,
			[n]: e.target.value
		}}
                      />
                      <button type="submit" class="mini-btn" ?disabled=${!(this.keyword[n] ?? "").trim()}>
                        <ha-icon icon="mdi:plus"></ha-icon>${t("learn.calendar.add")}
                      </button>
                    </form>
                  </div>
                </div>`)}
            </div>
            <div class="sub-head with-tip"><b>${t("learn.calendar.defaults")}</b>${y(t, "cal_defaults")}</div>
            <div class="defaults">
              ${["default_workday", "default_day_off"].map((n) => e`<label class="field">
                  <span class="field-label">${t(`learn.calendar.${n}`)}</span>
                  <select
                    class="input"
                    @change=${(e) => this.saveCalendarPart({ [n]: e.target.value })}
                  >
                    ${Qe.map((r) => e`<option value=${r} ?selected=${a[n] === r}>${t(`label.${r}`)}</option>`)}
                  </select>
                </label>`)}
            </div>`}
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
		let t = En.flatMap((t) => e.filter((e) => e.label === t));
		this.saveCalendarPart({ rules: t });
	}
	saveCalendarPart(e) {
		let t = this.state.config.persons.find((e) => e.id === this.calendarFor);
		t?.calendar ? this.saveCalendar(t, {
			...t.calendar,
			...e
		}) : M(this, { calendar: e });
	}
	saveCalendar(e, t) {
		M(this, { persons: { [e.id]: { calendar: t } } });
	}
	edit(e) {
		this.dispatchEvent(new CustomEvent("joe-edit", {
			detail: { editor: e },
			bubbles: !0,
			composed: !0
		}));
	}
	renderAccuracy(t, n) {
		let r = n.accuracy.slice(-14).reverse(), i = (e) => e == null ? "–" : U(t.lang, e, 1);
		return e`<section class="card wide" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:target"></ha-icon>${t("learn.accuracy")}</div>
        ${y(t, "learn_accuracy")}
      </div>
      ${r.length ? e`<div class="table" role="table" aria-label=${t("learn.accuracy")}>
            <span class="th" role="columnheader">${t("learn.accuracy.night")}</span>
            <span class="th" role="columnheader">${t("learn.accuracy.solar")}<span class="unit">kWh</span></span>
            <span class="th" role="columnheader">${t("learn.accuracy.morning")}<span class="unit">kWh</span></span>
            <span class="th" role="columnheader">${t("learn.accuracy.result")}</span>
            ${r.map((n) => e`<span role="cell">${W(t.lang, n.date, "weekday")}</span>
                <span role="cell">${t("learn.accuracy.value", {
			expected: i(n.solar.forecast),
			actual: i(n.solar.actual)
		})}</span>
                <span role="cell">${t("learn.accuracy.value", {
			expected: i(n.bridge.planned),
			actual: i(n.bridge.actual)
		})}</span>
                <span role="cell" class=${n.saving > .005 ? "good" : n.saving < -.005 ? "bad" : ""}
                  >${tn(t, n.saving, this.currency, !0)}</span
                >`)}
          </div>` : e`<p class="say">${t("learn.accuracy.none")}</p>`}
    </section>`;
	}
	renderReset(t) {
		let n = !!this.state?.observe?.active;
		return e`<section class="card danger wide" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:restore"></ha-icon>${t("learn.reset")}</div>
        ${y(t, "learn_reset")}
      </div>
      <p>${t("learn.reset.text")}</p>
      <div class="sub-head with-tip"><b>${t("learn.reset.scope")}</b>${y(t, "learn_reset_scope")}</div>
      <div class="seg scopes" role="group" aria-label=${t("learn.reset.scope")}>
        ${["all", ...tt].map((n) => e`<button type="button" aria-pressed=${String(this.scope === n)} @click=${() => this.scope = n}>
              ${t(`learn.reset.scope.${n}`)}
            </button>`)}
      </div>
      <div class="actions">
        <button type="button" class="btn btn-danger" ?disabled=${!n} @click=${() => this.confirming = !0}>
          ${t(this.scope === "all" ? "learn.reset.button" : "learn.reset.button.scope")}
        </button>
      </div>
      ${n ? o : e`<p>${t("learn.reset.off")}</p>`}
      ${this.notice ? e`<div class="note ${this.notice.ok ? "" : "warn"}" role="status">
            <ha-icon icon=${this.notice.ok ? "mdi:check" : "mdi:alert-outline"}></ha-icon>${this.notice.text}
          </div>` : o}
    </section>`;
	}
	renderConfirm(t) {
		let n = () => {
			this.confirming = !1;
		}, r = this.scope;
		return e`<joe-sheet label=${t("learn.reset.label")} closeLabel=${t("common.close")} @joe-close=${n}>
      <div data-tipped>
        <div class="sheet-title">${T(t("learn.reset.confirm.title"), "h2", y(t, "learn_reset"))}</div>
        <dl class="forget">
          <dt>${t("learn.reset.confirm.forget")}</dt>
          <dd>${t(`learn.reset.forget.${r}`)}</dd>
          <dt>${t("learn.reset.confirm.keep")}</dt>
          <dd>${t(r === "all" ? "learn.reset.confirm.keep.text" : "learn.reset.keep.scope")}</dd>
        </dl>
        <div class="actions">
          <button type="button" class="btn btn-secondary" data-notip @click=${n}>${t("common.cancel")}</button>
          <button type="button" class="btn btn-danger" ?disabled=${this.resetting} @click=${this.reset}>
            ${t("learn.reset.confirm.go")}
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
C([r({ attribute: !1 })], X.prototype, "hass", void 0), C([r({ attribute: !1 })], X.prototype, "t", void 0), C([r({ attribute: !1 })], X.prototype, "state", void 0), C([c()], X.prototype, "data", void 0), C([c()], X.prototype, "failed", void 0), C([c()], X.prototype, "confirming", void 0), C([c()], X.prototype, "resetting", void 0), C([c()], X.prototype, "scope", void 0), C([c()], X.prototype, "keyword", void 0), C([c()], X.prototype, "calendarFor", void 0), C([c()], X.prototype, "notice", void 0), S("joe-learn-page", X);
//#endregion
//#region src/components/texts.ts
function An(e, t) {
	return t == null ? "–" : b(e.lang, t * 100, 2);
}
function jn(e, t, n = !0) {
	let r;
	return r = t.kind === "fixed_window" && t.window ? t.night_price == null && t.day_price == null ? e("tariff.window_only", {
		start: t.window.start,
		end: t.window.end
	}) : e("find.tariff.window", {
		start: t.window.start,
		end: t.window.end,
		night: An(e, t.night_price),
		day: An(e, t.day_price)
	}) : t.kind === "dynamic" ? t.night_price != null && t.day_price != null ? e("find.tariff.dynamic", {
		night: An(e, t.night_price),
		day: An(e, t.day_price)
	}) : e("tariff.dynamic") : t.kind === "flat" ? t.day_price == null ? e("tariff.flat") : e("find.tariff.flat", { day: An(e, t.day_price) }) : e("find.tariff.unknown"), n && t.feed_in_price != null && (r += ` · ${e("find.tariff.feedin", { price: An(e, t.feed_in_price) })}`), r;
}
function Mn(e, t) {
	let n = {};
	for (let [r, i] of Object.entries(t)) typeof i == "number" ? n[r] = b(e.lang, i, 2) : typeof i == "string" && (n[r] = i);
	typeof t.role == "string" && (n.role = e.optional(`role.${t.role}`) ?? t.role);
	let r = `check.${t.code}`;
	return t.code === "grid_sign" && typeof t.expected == "number" && typeof t.actual == "number" && (r = t.expected < 0 ? "check.grid_sign.export" : "check.grid_sign.import", n.expected = b(e.lang, Math.abs(t.expected), 1), n.actual = b(e.lang, Math.abs(t.actual), 1)), e.optional(r, n) ?? t.code;
}
//#endregion
//#region src/components/review.ts
var Nn = /* @__PURE__ */ new Set([
	"climate",
	"heat_pump",
	"electric_heating",
	"hot_water"
]), Pn = class extends n {
	constructor(...e) {
		super(...e), this.checks = [], this.context = "setup";
	}
	static {
		this.styles = [d, a`
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
		let { hass: t, t: n, config: r } = this;
		return !t || !n || !r ? o : e`<ul class="found">
      ${this.rows(t, n, r).map((e) => this.renderRow(n, e))}
    </ul>`;
	}
	rows(t, n, r) {
		let i = this.discovery, a = [], o = i?.energy_dashboard;
		o?.configured && a.push({
			key: "energy",
			icon: "mdi:lightning-bolt",
			title: n("find.energy"),
			detail: n("find.energy.detail", {
				grid: this.count(n, o.grid ?? 0, "word.grid"),
				solar: this.count(n, o.solar ?? 0, "word.solar"),
				battery: this.count(n, o.battery ?? 0, "word.battery"),
				devices: this.count(n, o.devices ?? 0, "word.device")
			}),
			chips: [D(n, { source: "read" })]
		}), a.push(...this.batteryRows(t, n, r)), a.push(this.tariffRow(n, r)), a.push(this.forecastRow(n, r)), a.push(this.powerRow(t, n, r, "grid_power")), a.push(this.powerRow(t, n, r, "home_power")), a.push(this.solarRow(t, n, r));
		let s = (t) => e`<span class="chip ${t ? "ok" : "soon"}">${n(t ? "review.used" : "review.unused")}</span>`;
		for (let e of i?.wallboxes.filter((e) => e.is_car) ?? []) {
			let t = r.actions.some((t) => t.id === `ev_${e.device_id}` || e.mode_entity && t.entity_id === e.mode_entity);
			a.push({
				key: `wallbox:${e.name}`,
				icon: "mdi:ev-station",
				title: n("find.wallbox"),
				detail: `${e.name} · ${n(t ? "review.wallbox.used" : "review.wallbox.unused")}`,
				chips: [s(t)]
			});
		}
		for (let e of i?.cars ?? []) {
			let i = e.entities.soc ? l(t, e.entities.soc) : null, o = [
				e.name,
				i === null ? null : `${b(n.lang, i, 0)} %`,
				e.range_km === null ? null : `${b(n.lang, e.range_km, 0)} km`,
				null
			], c = r.actions.some((t) => t.need?.enabled && (e.entities.soc && t.need.soc_entity === e.entities.soc || e.entities.range && t.need.range_entity === e.entities.range));
			o[3] = n(c ? "review.car.used" : "review.car.unused"), a.push({
				key: `car:${e.device_id}`,
				icon: "mdi:car-electric",
				title: n("find.car"),
				detail: o.filter(Boolean).join(" · "),
				chips: [E(n, e.confidence), s(c)]
			});
		}
		a.push(this.contextRow(t, n, r, "weather")), a.push(this.contextRow(t, n, r, "holiday"));
		let c = this.context === "settings", u = [e`<span class="chip soon">${n("review.ask_later")}</span>`];
		if (c || r.persons.length || i?.calendars.length) {
			let e = c ? r.persons.reduce((e, t) => e + t.calendars.length, 0) : i?.calendars.length ?? 0;
			a.push({
				key: "people",
				icon: "mdi:account-group-outline",
				title: n("find.people"),
				detail: n("find.people.detail", {
					persons: this.count(n, r.persons.length, "word.person"),
					calendars: this.count(n, e, "word.calendar")
				}),
				chips: c ? [] : u,
				tip: c ? "q_household" : void 0,
				actions: c ? [this.button(n("review.change"), "mdi:account-edit-outline", () => this.edit("household"))] : void 0
			});
		}
		let d = r.consumers.filter((e) => e.kind !== "submeter");
		return d.length && a.push({
			key: "devices",
			icon: "mdi:devices",
			title: n("find.devices"),
			detail: n("find.devices.detail", {
				count: this.count(n, d.length, "word.device"),
				heating: d.filter((e) => Nn.has(e.kind)).length
			}),
			chips: c ? [] : u,
			tip: c ? "f_consumer_kind" : void 0,
			actions: c ? [this.button(n("review.assign"), "mdi:devices", () => this.edit("consumers"))] : void 0
		}), a;
	}
	batteryRows(e, t, n) {
		let r = [];
		for (let i of n.batteries) {
			let a = this.discovery?.batteries.find((e) => e.id === i.id), o = l(e, i.soc_entity), s = i.capacity_kwh ?? oe(e, i.capacity_entity), c = [
				s ? `${b(t.lang, s, 2)} kWh` : t("review.capacity_unknown"),
				o === null ? null : `${b(t.lang, o, 0)} %`,
				i.adapter === "none" ? t("find.battery.read") : t("find.battery.control")
			], u = this.checks.filter((e) => e.battery_id === i.id).map((e) => this.note(t, e));
			r.push({
				key: `battery:${i.id}`,
				icon: "mdi:home-battery-outline",
				title: i.name,
				detail: c.filter(Boolean).join(" · "),
				chips: [D(t, k(n, `batteries[${i.id}].soc_entity`)), ...a ? [E(t, a.confidence)] : []],
				reasons: a?.reasons,
				notes: u,
				state: this.checks.some((e) => e.battery_id === i.id && e.level === "warn") ? "flag" : void 0,
				tip: "review_battery",
				actions: [this.button(t("review.change"), "mdi:pencil-outline", () => this.edit("battery", i.id)), this.button(t("review.ignore"), "", () => this.ignoreBattery(i.id), !0)]
			});
		}
		for (let e of this.discovery?.batteries ?? []) A(n, `battery:${e.id}`) && !n.batteries.some((t) => t.id === e.id) && r.push({
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
		M(this, {
			batteries: { [e]: null },
			answers: { ignored: j(this.config, `battery:${e}`, !0) }
		});
	}
	useBattery(e) {
		let t = this.config;
		M(this, {
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
			answers: { ignored: j(t, `battery:${e.id}`, !1) }
		}, "read");
	}
	async addBattery() {
		let { t: e, hass: t, config: n } = this;
		if (!e || !t || !n) return;
		let r = (await N(this, {
			heading: e("pick.battery.title"),
			tip: "pick_battery",
			filter: "soc",
			selected: [],
			exclude: n.batteries.map((e) => e.soc_entity)
		}))?.selected[0];
		if (!r) return;
		let i = t.entities?.[r]?.device_id, a = i && !n.batteries.some((e) => e.id === i) ? i : r;
		M(this, { batteries: { [a]: {
			name: i && (t.devices?.[i]?.name_by_user || t.devices?.[i]?.name) || p(t, r),
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
			detail: jn(e, n),
			chips: r ? [] : [D(e, k(t, "tariff.kind")), ...this.discovery && this.discovery.tariff.kind !== "unknown" ? [E(e, this.discovery.tariff.confidence)] : []],
			reasons: this.discovery?.tariff.reasons,
			notes: r ? [this.info(e("review.tariff.ask"))] : [],
			state: r ? "missing" : void 0,
			tip: "review_tariff",
			actions: [this.button(e(r ? "review.enter" : "review.change"), "mdi:pencil-outline", () => this.edit("tariff"))]
		};
	}
	forecastRow(e, t) {
		let n = this.discovery?.forecast, r = A(t, "forecast"), i = {
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
				today: n.today_kwh == null ? "–" : b(e.lang, n.today_kwh, 1),
				tomorrow: n.tomorrow_kwh == null ? "–" : b(e.lang, n.tomorrow_kwh, 1)
			}) : t.forecast.provider,
			chips: [D(e, k(t, "forecast.provider")), ...n ? [E(e, n.confidence)] : []],
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
		M(this, {
			forecast: {
				provider: null,
				config_entries: [],
				today: [],
				tomorrow: [],
				remaining_today: [],
				alternatives: []
			},
			answers: { ignored: j(this.config, "forecast", !0) }
		});
	}
	useForecast() {
		let e = this.discovery?.forecast;
		e && M(this, {
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
			answers: { ignored: j(this.config, "forecast", !1) }
		}, "read");
	}
	powerRow(e, t, n, r) {
		let i = n.measurements[r], a = this.discovery?.measurements[r] ?? null, o = r === "grid_power", s = A(n, r), c = {
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
		let u = h(e, i), d = g(e, i.entity_id, t.lang);
		if (u !== null) {
			let e = b(t.lang, Math.abs(u), 2);
			d = o ? t(u >= 0 ? "live.import" : "live.export", { value: e }) : t("live.kw", { value: b(t.lang, u, 2) });
		}
		let f = this.checks.filter((e) => e.code !== "missing" && (e.role === r || o && e.code === "grid_sign" || !o && e.code === "home_negative")), m = f.map((e) => e.code === "grid_sign" ? this.note(t, e, [this.button(t("review.invert"), "mdi:swap-vertical", () => this.setPower(r, {
			...i,
			invert: !i.invert
		})), this.button(t("review.keep"), "mdi:check", () => this.confirm(`grid_sign:${i.entity_id}`), !0)]) : e.code === "home_negative" ? this.note(t, e, [this.button(t("review.invert"), "mdi:swap-vertical", () => this.setPower(r, {
			...i,
			invert: !i.invert
		}))]) : this.note(t, e)), _ = a?.entity.entity_id === i.entity_id;
		return !o && n.measurements.grid_power ? {
			...c,
			detail: `${t("review.home.balance")} · ${t("review.home.compare", {
				name: p(e, i.entity_id),
				live: d
			})}`,
			chips: [D(t, k(n, `measurements.${r}`))],
			notes: [...this.homeNotes(t, n), ...m],
			state: f.some((e) => e.level === "warn") ? "flag" : void 0,
			actions: [l, this.button(t("review.home.devices"), "mdi:devices", () => this.edit("consumers"))]
		} : {
			...c,
			detail: `${p(e, i.entity_id)} · ${d}`,
			chips: [D(t, k(n, `measurements.${r}`)), ...a && _ ? [E(t, a.confidence)] : []],
			reasons: _ ? a?.reasons : void 0,
			notes: m,
			state: f.some((e) => e.level === "warn") ? "flag" : void 0,
			actions: [l]
		};
	}
	homeNotes(e, t) {
		let n = [], r = et(t.consumers);
		if (r.length) {
			let t = r.map((t) => t.kind === "ev" || t.runs === "always" || !t.runs ? t.name : `${t.name} (${e(`runs.${t.runs}`)})`).join(", ");
			n.push(this.info(e(r.some((e) => e.kind === "ev") ? "review.home.flexible" : "review.home.flexible_some", { names: t })));
		} else t.consumers.some((e) => e.kind !== "submeter") && n.push(this.info(e("review.home.flexible_none")));
		let i = t.learned.home_check;
		if (i && i.calc_kwh > 0) {
			let t = (i.sensor_kwh - i.calc_kwh) / i.calc_kwh;
			Math.abs(t) >= .1 && n.push(this.info(e("review.home.off", {
				days: i.days,
				pct: b(e.lang, Math.abs(t) * 100, 0),
				direction: e(t < 0 ? "review.home.less" : "review.home.more")
			})));
		}
		return n;
	}
	async pickPower(e) {
		let { t, config: n } = this;
		if (!t || !n) return;
		let r = n.measurements[e], i = this.discovery?.measurements[e], a = e === "grid_power", o = await N(this, {
			heading: t(a ? "pick.grid.title" : "pick.home.title"),
			tip: a ? "pick_grid" : "pick_home",
			filter: "power",
			selected: r ? [r.entity_id] : [],
			suggestions: Ee(i ? [De(i)] : [], i?.alternatives),
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
		A(n, e) && (c.answers = { ignored: j(n, e, !1) }), M(this, c);
	}
	setPower(e, t) {
		M(this, { measurements: { [e]: t } });
	}
	solarRow(e, t, n) {
		let r = n.measurements.solar_power, i = this.discovery?.measurements.solar_power ?? null, a = {
			key: "solar_power",
			icon: "mdi:solar-panel",
			title: t("find.solar"),
			tip: "review_solar"
		};
		if (!r.length) return A(n, "solar_power") ? {
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
		let o = se(e, r), s = this.checks.filter((e) => e.role === "solar_power" && e.code !== "missing").map((e) => this.note(t, e));
		return {
			...a,
			detail: t("find.solar.detail", {
				count: this.count(t, r.length, "word.sensor"),
				total: o === null ? "–" : b(t.lang, o, 2)
			}),
			chips: [D(t, k(n, "measurements.solar_power")), ...i ? [E(t, i.confidence)] : []],
			reasons: i?.reasons,
			notes: s,
			state: s.length && this.checks.some((e) => e.role === "solar_power" && e.level === "warn") ? "flag" : void 0,
			actions: [this.button(t("review.change"), "mdi:magnify", () => this.pickSolar())]
		};
	}
	async pickSolar() {
		let { t: e, config: t } = this;
		if (!e || !t) return;
		let n = t.measurements.solar_power, r = this.discovery?.measurements.solar_power, i = await N(this, {
			heading: e("pick.solar.title"),
			tip: "pick_solar",
			filter: "power",
			multiple: !0,
			selected: n.map((e) => e.entity_id),
			suggestions: Ee((r?.entities ?? []).map((e) => ({
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
		A(t, "solar_power") && (a.answers = { ignored: j(t, "solar_power", !1) }), M(this, a);
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
				detail: p(e, a),
				chips: [D(t, k(n, `context.${i}`)), ...o && l ? [E(t, o.confidence)] : []],
				reasons: l ? o?.reasons : void 0,
				actions: [this.button(t("review.change"), "mdi:magnify", c), this.button(t("review.ignore"), "", () => this.ignore(r, { context: { [i]: null } }), !0)]
			};
		}
		return A(n, r) ? {
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
		let r = e === "weather" ? "weather_entity" : "holiday_entity", i = this.discovery?.[e], a = n.context[r], o = (await N(this, {
			heading: t(e === "weather" ? "pick.weather.title" : "pick.holiday.title"),
			tip: e === "weather" ? "pick_weather" : "pick_holiday",
			filter: e === "weather" ? "weather" : "workday",
			selected: a ? [a] : i ? [i.entity.entity_id] : [],
			suggestions: Ee(i ? [De(i)] : [], i?.alternatives)
		}))?.selected[0];
		o && M(this, {
			context: { [r]: o },
			answers: { ignored: j(n, e, !1) }
		});
	}
	ignore(e, t) {
		M(this, {
			...t,
			answers: { ignored: j(this.config, e, !0) }
		});
	}
	confirm(e) {
		let t = this.config.answers.confirmed.filter((t) => t !== e);
		M(this, { answers: { confirmed: [...t, e] } });
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
	button(t, n, r, i = !1) {
		return e`<button type="button" class="mini-btn ${i ? "quiet" : ""}" @click=${r}>
      ${n ? e`<ha-icon icon=${n}></ha-icon>` : o}${t}
    </button>`;
	}
	info(t) {
		return e`<div class="note"><ha-icon icon="mdi:information-outline"></ha-icon><span>${t}</span></div>`;
	}
	note(t, n, r = []) {
		return e`<div class="note ${n.level}">
      <ha-icon icon=${n.level === "warn" ? "mdi:alert-outline" : "mdi:information-outline"}></ha-icon>
      <div>
        <span>${Mn(t, n)}</span>
        ${r.length ? e`<div class="note-actions">${r}</div>` : o}
      </div>
    </div>`;
	}
	count(e, t, n) {
		let [r, i] = e(n).split("|");
		return `${b(e.lang, t, 0)} ${t === 1 ? r : i}`;
	}
	renderRow(t, n) {
		return e`<li class="item ${n.state ?? ""}" ?data-tipped=${!!(n.actions?.length && n.tip)}>
      <span class="ico-box"><ha-icon icon=${n.icon}></ha-icon></span>
      <div class="text">
        <div class="head">
          <span class="t">${n.title}</span>
          ${n.chips?.length ? e`<span class="chips">${n.chips}</span>` : o}
        </div>
        <div class="d">${n.detail}</div>
        ${n.reasons?.length ? e`<details data-notip>
              <summary>${t("scan.why")}</summary>
              <ul>
                ${n.reasons.map((n) => e`<li>${fe(t, n)}</li>`)}
              </ul>
            </details>` : o}
        ${n.notes ?? o}
        ${n.actions?.length ? e`<div class="row-actions">${n.actions}${n.tip ? y(t, n.tip) : o}</div>` : o}
      </div>
    </li>`;
	}
};
C([r({ attribute: !1 })], Pn.prototype, "hass", void 0), C([r({ attribute: !1 })], Pn.prototype, "t", void 0), C([r({ attribute: !1 })], Pn.prototype, "config", void 0), C([r({ attribute: !1 })], Pn.prototype, "discovery", void 0), C([r({ attribute: !1 })], Pn.prototype, "checks", void 0), C([r()], Pn.prototype, "context", void 0), S("joe-review", Pn);
//#endregion
//#region src/components/step-nav.ts
function Fn(t, n, r = !1) {
	let i = e`<button type="button" class="btn btn-primary" ?data-notip=${!n.nextTip} @click=${n.next}>
    ${n.nextLabel}<ha-icon icon="mdi:chevron-right"></ha-icon>
  </button>`;
	return e`<nav class="step-nav ${r ? "wide" : ""}" aria-label=${t("onb.nav")}>
    ${n.back ? e`<button type="button" class="btn btn-ghost" data-notip @click=${n.back}>
          <ha-icon icon="mdi:chevron-left"></ha-icon>${n.backLabel ?? t("onb.back")}
        </button>` : e`<span></span>`}
    ${n.nextTip ? e`<span class="with-tip" data-tipped>${i} ${y(t, n.nextTip)}</span>` : i}
  </nav>`;
}
//#endregion
//#region src/pages/questions.ts
var In = {
	tariff: "plan",
	feed_in: "plug",
	capacity: "night-charge",
	heating: "ask",
	hot_water: "hot-water",
	ev: "ev",
	household: "relax"
}, Ln = [
	"climate",
	"heat_pump",
	"electric_heating"
];
function Rn(e) {
	let t = [], n = (t) => k(e, t)?.source === "user", r = (t) => e.answers[t] !== void 0 && e.answers[t] !== null, i = e.tariff;
	(i.kind === "unknown" || n("tariff.kind") || r("tariff")) && t.push("tariff"), (i.feed_in_price == null && !i.feed_in_entity || n("tariff.feed_in_price") || r("feed_in")) && t.push("feed_in");
	for (let i of e.batteries) {
		let e = `capacity:${i.id}`;
		(i.capacity_kwh == null && !i.capacity_entity || n(`batteries[${i.id}].capacity_kwh`) || r(e)) && t.push(e);
	}
	return t.push("heating", "hot_water", "ev", "household"), t;
}
var zn = class extends n {
	constructor(...e) {
		super(...e), this.single = "", this.index = 0;
	}
	static {
		this.styles = [d, a`
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
		let { t, config: n } = this;
		if (!t || !n) return o;
		if (this.single) return this.renderQuestion(t, n, this.single);
		let r = Rn(n), i = Math.min(this.index, r.length - 1), a = r[i], s = i === r.length - 1, c = Fn(t, {
			back: () => this.move(-1, r.length),
			next: () => this.move(1, r.length),
			nextLabel: t(s ? "ask.finish" : "onb.next")
		});
		return e`${c}
      <div class="wrap">
        <joe-pose name=${In[a.split(":")[0]] ?? "ask"}></joe-pose>
        <div>
          <nav class="topics" aria-label=${t("ask.topics")} data-notip>
            <span class="eyebrow">${t("ask.count", {
			n: i + 1,
			total: r.length
		})}</span>
            ${r.map((r, a) => e`${a ? e`<ha-icon class="arrow" icon="mdi:chevron-right" aria-hidden="true"></ha-icon>` : o}<button
                type="button"
                class="topic ${a < i ? "done" : ""}"
                aria-current=${a === i ? "step" : "false"}
                @click=${() => this.index = a}
              >
                ${a < i ? e`<ha-icon icon="mdi:check"></ha-icon>` : o}${this.topic(t, n, r)}
              </button>`)}
          </nav>
          ${this.renderQuestion(t, n, a)}
          <div class="actions" data-notip>
            <button type="button" class="btn btn-primary" @click=${() => this.move(1, r.length)}>
              ${t(s ? "ask.finish" : "onb.next")}
            </button>
            <button type="button" class="btn btn-ghost" @click=${() => this.move(-1, r.length)}>
              ${t("onb.back")}
            </button>
          </div>
        </div>
      </div>`;
	}
	renderQuestion(t, n, r) {
		if (r.startsWith("capacity:")) return this.renderCapacity(t, n, r.slice(9));
		switch (r) {
			case "tariff": return this.question(t("q.tariff.title"), "q_tariff", e`<joe-tariff-form
            .hass=${this.hass}
            .t=${t}
            .tariff=${n.tariff}
            .discovery=${this.discovery}
            asQuestion
            @joe-tariff=${(e) => this.saveTariff(e.detail)}
          ></joe-tariff-form>`);
			case "feed_in": return this.renderFeedIn(t, n);
			case "heating": return this.renderHeating(t, n);
			case "hot_water": return this.renderHotWater(t, n);
			case "ev": {
				let e = this.discovery?.wallboxes.find((e) => e.is_car);
				return this.question(t("q.ev.title"), "q_ev", this.choice(t, "ev", [{
					value: "yes",
					label: e ? t("q.ev.yes_wallbox", { name: e.name }) : t("q.ev.yes"),
					icon: "mdi:car-electric"
				}, {
					value: "no",
					label: t("q.ev.no"),
					icon: "mdi:car-off"
				}]));
			}
			default: return this.question(t("q.household.title"), "q_household", e`<joe-household
            .hass=${this.hass}
            .t=${t}
            .config=${n}
            .discovery=${this.discovery}
          ></joe-household>`);
		}
	}
	question(t, n, r) {
		let i = this.t;
		return e`<div data-tipped>
      <div class="title-row">${T(t, "h2", y(i, n))}</div>
      ${w}
      <div class="content">${r}</div>
    </div>`;
	}
	choice(t, n, r, i = !1) {
		let a = this.config?.answers[n];
		return e`<joe-choice
      .options=${r}
      .value=${Array.isArray(a) ? a : typeof a == "string" ? [a] : []}
      ?multiple=${i}
      .exclusive=${["none"]}
      idk=${t("ask.idk")}
      @joe-choice=${(e) => M(this, { answers: { [n]: i ? e.detail.value : e.detail.value[0] ?? null } })}
    ></joe-choice>`;
	}
	renderHotWater(t, n) {
		let r = n.answers.hot_water, i = r === "hot_water_heat_pump" || r === "electric", a = n.consumers.filter((e) => e.kind === "hot_water"), s = n.actions.find((e) => e.kind === "target");
		return this.question(t("q.hot_water.title"), "q_hot_water", e`${this.choice(t, "hot_water", [
			{
				value: "hot_water_heat_pump",
				label: t("q.hot_water.heat_pump"),
				icon: "mdi:water-boiler"
			},
			{
				value: "electric",
				label: t("q.hot_water.electric"),
				icon: "mdi:flash"
			},
			{
				value: "heating",
				label: t("q.hot_water.heating"),
				icon: "mdi:radiator"
			},
			{
				value: "other",
				label: t("q.hot_water.other"),
				icon: "mdi:fire"
			}
		])}
      ${i ? e`<div class="follow">
            <p class="hint">${a.length ? t("q.hot_water.devices") : t("q.hot_water.no_devices")}</p>
            ${a.length ? e`<div class="chips">${a.map((t) => e`<span class="chip learned">${t.name}</span>`)}</div>` : o}
            <p class="hint">${s ? t("q.hot_water.has_action", { name: s.name }) : t("q.hot_water.offer")}</p>
            <div class="with-tip" data-tipped style="margin-top:10px">
              <button
                type="button"
                class="mini-btn ${s ? "" : "go"}"
                @click=${() => this.dispatchEvent(new CustomEvent("joe-edit", {
			detail: {
				editor: "action",
				id: s ? s.id : "new:hot_water"
			},
			bubbles: !0,
			composed: !0
		}))}
              >
                <ha-icon icon=${s ? "mdi:pencil-outline" : "mdi:water-boiler"}></ha-icon>${t(s ? "q.hot_water.edit" : "q.hot_water.set_up")}
              </button>
              ${y(t, "q_hot_water_action")}
            </div>
          </div>` : o}`);
	}
	renderHeating(t, n) {
		let r = n.answers.heating, i = Array.isArray(r) ? r : [], a = n.consumers.filter((e) => i.includes(e.kind)), s = i.some((e) => Ln.includes(e));
		return this.question(t("q.heating.title"), "q_heating", e`${this.choice(t, "heating", [
			{
				value: "climate",
				label: t("q.heating.climate"),
				icon: "mdi:air-conditioner"
			},
			{
				value: "heat_pump",
				label: t("q.heating.heat_pump"),
				icon: "mdi:heat-pump-outline"
			},
			{
				value: "electric_heating",
				label: t("q.heating.electric"),
				icon: "mdi:radiator"
			},
			{
				value: "none",
				label: t("q.heating.none")
			}
		], !0)}
        ${s && n.consumers.length ? e`<div class="follow">
              <p class="hint">${a.length ? t("q.heating.devices") : t("q.heating.no_devices")}</p>
              ${a.length ? e`<div class="chips">
                    ${a.map((t) => e`<span class="chip learned">${t.name}</span>`)}
                  </div>` : o}
              <div class="with-tip" style="margin-top:10px">
                <button type="button" class="mini-btn" @click=${() => this.edit("consumers")}>
                  <ha-icon icon="mdi:devices"></ha-icon>${t("q.heating.assign")}
                </button>
                ${y(t, "f_consumer_kind")}
              </div>
            </div>` : o}`);
	}
	renderFeedIn(t, n) {
		let r = n.tariff.feed_in_price, i = n.answers.feed_in === ht;
		return this.question(t("q.feed_in.title"), "q_feed_in", e`<div class="inline">
        <span class="unit-input">
          <input
            class="input"
            type="number"
            inputmode="decimal"
            min="0"
            max="999"
            step="0.01"
            aria-label=${t("f.feed_in")}
            placeholder=${t("f.price.unknown")}
            .value=${r == null ? "" : String(Math.round(r * 1e6) / 1e4)}
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
          class="mini-btn ${r === 0 ? "go" : ""}"
          @click=${() => M(this, {
			tariff: { feed_in_price: 0 },
			answers: { feed_in: "none" }
		})}
        >
          ${t("q.feed_in.none")}
        </button>
        <button
          type="button"
          class="mini-btn ${i ? "go" : ""}"
          @click=${() => M(this, {
			tariff: { feed_in_price: null },
			answers: { feed_in: ht }
		})}
        >
          ${t("ask.idk")}
        </button>
      </div>`);
	}
	renderCapacity(t, n, r) {
		let i = n.batteries.find((e) => e.id === r);
		if (!i) return e``;
		let a = `capacity:${r}`, o = n.answers[a] === ht;
		return this.question(t("q.capacity.title", { name: i.name }), "q_capacity", e`<div class="inline">
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
            @change=${(e) => {
			let t = Number.parseFloat(e.target.value), n = Number.isFinite(t) && t > 0;
			M(this, {
				batteries: { [r]: { capacity_kwh: n ? t : null } },
				answers: { [a]: n ? "known" : null }
			});
		}}
          />
          <span class="unit">kWh</span>
        </span>
        <button
          type="button"
          class="mini-btn ${o ? "go" : ""}"
          @click=${() => M(this, {
			batteries: { [r]: { capacity_kwh: null } },
			answers: { [a]: ht }
		})}
        >
          ${t("ask.idk_learn")}
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
C([r({ attribute: !1 })], zn.prototype, "hass", void 0), C([r({ attribute: !1 })], zn.prototype, "t", void 0), C([r({ attribute: !1 })], zn.prototype, "config", void 0), C([r({ attribute: !1 })], zn.prototype, "discovery", void 0), C([r()], zn.prototype, "single", void 0), C([c()], zn.prototype, "index", void 0), S("joe-questions", zn);
//#endregion
//#region src/pages/onboarding.ts
function Bn(e, t, n) {
	let [r, i] = e(n).split("|");
	return `${b(e.lang, t, 0)} ${t === 1 ? r : i}`;
}
var Vn = {
	climate: "q.heating.climate",
	heat_pump: "q.heating.heat_pump",
	electric_heating: "q.heating.electric",
	none: "q.heating.none"
}, Z = class extends n {
	constructor(...e) {
		super(...e), this.step = "welcome", this.checks = [], this.discovering = !1, this.discoveryFailed = !1;
	}
	static {
		this.styles = [d, a`
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
		let t = this.t;
		if (!t) return o;
		switch (this.step) {
			case "welcome": return this.layout("welcome", e`${T(t("onb.welcome.title"), "h1")} ${w}
            <p class="lead">${t("onb.welcome.lead")}</p>
            <div class="calm"><span class="pill-sim">${t("mode.simulation")}</span>${t("onb.calm")}</div>
            <details data-notip>
              <summary>${t("onb.welcome.more")}</summary>
              ${t("onb.welcome.more.text").split("\n").map((t) => e`<p>${t}</p>`)}
            </details>
            <div class="actions" data-tipped>
              <button type="button" class="btn btn-primary" @click=${() => this.go("scan")}>
                ${t("onb.welcome.go")}
              </button>
              ${y(t, "scan_start")}
            </div>`);
			case "scan": return this.renderScan(t);
			case "questions": return e`<joe-questions
          .hass=${this.hass}
          .t=${t}
          .config=${this.config}
          .discovery=${this.discovery}
        ></joe-questions>`;
			case "done": return this.renderDone(t);
		}
	}
	renderScan(t) {
		if (this.discovering || !this.discovery && !this.discoveryFailed) return this.layout("scout", e`${T(t("onb.scan.title"))} ${w}
          <p class="lead">${t("onb.scan.lead")}</p>
          ${this.renderEnergy(t)}
          <div class="looking" role="status">${t("scan.looking")}</div>`);
		let n = Fn(t, {
			back: () => this.go("welcome"),
			next: () => this.go("questions"),
			nextLabel: t("onb.next")
		}, !0);
		return e`${n}
      <div class="wrap wide">
        <joe-pose name="scout"></joe-pose>
        <div>
          ${T(t("scan.title"))} ${w}
          <p class="lead">${t("scan.lead")}</p>
          ${this.discoveryFailed ? e`<p class="failed">${t("scan.failed")}</p>` : o}
          <joe-review
            .hass=${this.hass}
            .t=${t}
            .config=${this.config}
            .discovery=${this.discovery}
            .checks=${this.checks}
          ></joe-review>
          <div class="actions">
            <button type="button" class="btn btn-primary" data-notip @click=${() => this.go("questions")}>
              ${t("onb.next")}
            </button>
            <span class="with-tip" data-tipped>
              <button type="button" class="btn btn-secondary" @click=${this.rediscover}>${t("scan.again")}</button>
              ${y(t, "rescan")}
            </span>
            <button type="button" class="btn btn-ghost" data-notip @click=${() => this.go("welcome")}>
              ${t("onb.back")}
            </button>
          </div>
        </div>
      </div>`;
	}
	renderDone(t) {
		let n = Fn(t, {
			back: () => this.go("scan"),
			backLabel: t("onb.done.change"),
			next: () => this.complete(),
			nextLabel: t("onb.done.go"),
			nextTip: "start"
		});
		return e`${n}
    ${this.layout("thumbs", e`${T(t("onb.done.title"))} ${w}
        ${this.config ? this.renderSummary(t, this.config) : o}
        <div class="calm"><span class="pill-sim">${t("mode.simulation")}</span>${t("onb.done.lead")}</div>
        <div class="actions">
          <span class="with-tip" data-tipped>
            <button type="button" class="btn btn-primary" @click=${this.complete}>${t("onb.done.go")}</button>
            ${y(t, "start")}
          </span>
          <button type="button" class="btn btn-ghost" data-notip @click=${() => this.go("scan")}>
            ${t("onb.done.change")}
          </button>
        </div>`)}`;
	}
	renderSummary(t, n) {
		let r = this.hass, i = n.batteries.reduce((e, t) => e + (t.capacity_kwh ?? (r ? oe(r, t.capacity_entity) : null) ?? 0), 0), a = (e, r) => {
			let i = n.answers[e];
			if (i === "unknown") return t("sum.unknown");
			let a = Array.isArray(i) ? i : typeof i == "string" ? [i] : [];
			return a.length ? a.map((e) => t.optional(r[e] ?? "") ?? e).join(", ") : t("sum.open");
		}, o = this.discovery?.forecast, s = [
			[t("sum.batteries"), n.batteries.length ? t("sum.batteries.value", {
				count: n.batteries.length,
				kwh: i ? b(t.lang, i, 1) : "?"
			}) : t("sum.none")],
			[t("sum.tariff"), n.tariff.kind === "unknown" ? t("sum.unknown") : jn(t, n.tariff, !1)],
			[t("sum.feed_in"), n.tariff.feed_in_price == null ? n.tariff.feed_in_entity ? t("sum.from_sensor") : t("sum.unknown") : `${An(t, n.tariff.feed_in_price)} ct`],
			[t("sum.forecast"), n.forecast.provider ? o ? t("sum.forecast.value", {
				provider: o.provider_name,
				planes: Bn(t, o.planes, "word.plane")
			}) : n.forecast.provider : t("sum.none")],
			[t("sum.heating"), a("heating", Vn)],
			[t("sum.hot_water"), a("hot_water", {
				hot_water_heat_pump: "q.hot_water.heat_pump",
				electric: "q.hot_water.electric",
				heating: "q.hot_water.heating",
				other: "q.hot_water.other"
			})],
			[t("sum.ev"), a("ev", {
				yes: "q.ev.yes",
				no: "q.ev.no"
			})],
			[t("sum.household"), t("sum.household.value", {
				persons: Bn(t, n.persons.length, "word.person"),
				calendars: Bn(t, n.persons.reduce((e, t) => e + t.calendars.length, 0), "word.calendar")
			})]
		];
		return e`<div class="lines">
      ${s.map(([t, n]) => e`<div><span>${t}</span><span>${n}</span></div>`)}
    </div>`;
	}
	rediscover() {
		this.dispatchEvent(new CustomEvent("joe-rediscover", {
			bubbles: !0,
			composed: !0
		}));
	}
	layout(t, n) {
		return e`<div class="wrap">
      <joe-pose name=${t}></joe-pose>
      <div>${n}</div>
    </div>`;
	}
	renderEnergy(t) {
		let n = this.info?.energy;
		if (!n?.configured || !n.sources) return e`<div class="found"><p>${t("onb.scan.energy.none")}</p></div>`;
		let r = [
			[n.sources.grid ?? 0, t("energy.grid")],
			[n.sources.solar ?? 0, t("energy.solar")],
			[n.sources.battery ?? 0, t("energy.battery")],
			[n.devices ?? 0, t("energy.devices")]
		];
		return e`<div class="found">
      <p>${t("onb.scan.energy")}</p>
      <div class="chips">
        ${r.map(([t, n]) => e`<span class="chip read"><ha-icon icon="mdi:eye-outline"></ha-icon>${t} ${n}</span>`)}
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
C([r()], Z.prototype, "step", void 0), C([r({ attribute: !1 })], Z.prototype, "t", void 0), C([r({ attribute: !1 })], Z.prototype, "info", void 0), C([r({ attribute: !1 })], Z.prototype, "hass", void 0), C([r({ attribute: !1 })], Z.prototype, "config", void 0), C([r({ attribute: !1 })], Z.prototype, "discovery", void 0), C([r({ attribute: !1 })], Z.prototype, "checks", void 0), C([r({ type: Boolean })], Z.prototype, "discovering", void 0), C([r({ type: Boolean })], Z.prototype, "discoveryFailed", void 0), S("joe-onboarding", Z);
//#endregion
//#region src/pages/overview.ts
var Hn = class extends n {
	constructor(...e) {
		super(...e), this.prefix = "/energy-joe";
	}
	static {
		this.styles = [d, a`
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
		let t = this.t;
		if (!t) return o;
		let n = !!this.state?.observe?.active, r = !!(this.state?.plan && this.state.plan.kind !== "unavailable"), i = (this.state?.results?.days ?? 0) > 0, a = this.state?.questions ?? [];
		return e`<div class="grid">
      ${a.length ? e`<joe-day-questions class="wide" .hass=${this.hass} .t=${t} .questions=${a}></joe-day-questions>` : o}
      ${this.renderNow(t)} ${this.renderWeek(t)}
      ${this.renderNight(t)} ${this.renderSim(t)}
      <section class="card wide">
        <div class="eyebrow"><ha-icon icon="mdi:map-marker-path"></ha-icon>${t("overview.next")}</div>
        <ol class="next">
          <li class="done">
            <b>${t("overview.next.1.title")}</b><span>${t("overview.next.1.text")}</span>
            <span class="chip ok"><ha-icon icon="mdi:check"></ha-icon>${t("status.done")}</span>
          </li>
          <li class=${n ? "done" : ""}>
            <b>${t("overview.next.2.title")}</b><span>${t("overview.next.2.text")}</span>
            ${this.stepChip(t, n)}
          </li>
          <li class=${r ? "done" : ""}>
            <b>${t("overview.next.3.title")}</b><span>${t("overview.next.3.text")}</span>
            ${this.stepChip(t, r)}
          </li>
          <li class=${i ? "done" : ""}>
            <b>${t("overview.next.4.title")}</b><span>${t("overview.next.4.text")}</span>
            ${this.stepChip(t, i)}
          </li>
        </ol>
      </section>
    </div>`;
	}
	stepChip(t, n) {
		return n ? e`<span class="chip ok"><ha-icon icon="mdi:check"></ha-icon>${t("status.running")}</span>` : e`<span class="chip">${t(this.state?.mode === "off" ? "status.paused" : "status.waiting")}</span>`;
	}
	renderNight(t) {
		let n = this.state?.plan;
		if (!n) return e`<section class="card">
        <joe-pose name="relax"></joe-pose>
        <div class="eyebrow"><ha-icon icon="mdi:weather-night"></ha-icon>${t("overview.night")}</div>
        ${T(t("overview.night.empty.title"))} ${w}
        <p class="lead">${t("overview.night.empty.text")}</p>
      </section>`;
		let r = ie(t, n), i = te(t, n, this.hass?.config?.currency), a = n.kind === "charge" || n.kind === "hold" ? e`${b(t.lang, n.target ?? 0, 0)}<small>%</small>` : e`${t(n.kind === "none" ? "plan.big.none" : "plan.big.unavailable")}`;
		return e`<section class="card figure-card" data-tipped>
      <joe-pose name=${_(n)}></joe-pose>
      <div class="head">
        <div class="eyebrow">
          <ha-icon icon="mdi:weather-night"></ha-icon>${t("overview.night")}${n.window ? ` · ${f(t, n)}` : ""}
        </div>
        ${y(t, "plan_target")}
      </div>
      <div class="big">${a}</div>
      ${w}
      <p class="say">${u(t, n)}</p>
      ${r.length ? e`<div class="lines">${r.map((t) => e`<div>${t}</div>`)}</div>` : o}
      ${i ? e`<p class="cost">${i}</p>` : o}
      <div class="bottom">
        <span class="chip ${n.fixed ? "ok" : ""}">
          ${n.fixed ? t("plan.fixed_at", { time: n.created.slice(11, 16) }) : t("plan.preview_at", { time: n.created.slice(11, 16) })}
        </span>
        <a class="btn btn-secondary" data-notip href=${`${this.prefix}/plan`} @click=${(e) => this.open(e, "plan")}
          >${t("overview.night.more")}</a
        >
      </div>
    </section>`;
	}
	renderSim(t) {
		let n = this.state?.results, r = n?.last;
		if (!n || !r) return e`<section class="card">
        <joe-pose name="plan"></joe-pose>
        <div class="eyebrow"><ha-icon icon="mdi:calculator-variant-outline"></ha-icon>${t("overview.sim")}</div>
        ${T(t("overview.sim.empty.title"))} ${w}
        <p class="lead">${t("overview.sim.empty.text")}</p>
      </section>`;
		let i = this.hass?.config?.currency, a = r.window?.end.slice(0, 10) ?? r.date, o = a === rn(this.hass?.config?.time_zone) ? t("overview.sim.last") : t("overview.sim.night", { day: W(t.lang, a, "weekday") }), s = r.saving, c = s > .005 ? "good" : s < -.005 ? "bad" : "", l = c === "good" ? t("overview.sim.saved", {
			value: tn(t, s, i),
			day: b(t.lang, Math.max(0, r.day_kwh_without - r.day_kwh), 1),
			night: b(t.lang, Math.max(0, r.night_kwh - r.night_kwh_without), 1)
		}) : c === "bad" ? t("overview.sim.cost", { value: tn(t, -s, i) }) : t("overview.sim.same"), u = n.since ?? n.first;
		return e`<section class="card figure-card" data-tipped>
      <joe-pose name=${c === "good" ? "relax" : "inspect"}></joe-pose>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:calculator-variant-outline"></ha-icon>${t("overview.sim")} · ${o}</div>
        ${y(t, "sim_result")}
      </div>
      <div class="big ${c}">${tn(t, s, i, !0)}</div>
      ${w}
      <p class="say">${l}</p>
      <p class="cost">
        ${t("overview.sim.total", {
			since: u ? W(t.lang, u) : "–",
			value: tn(t, n.saving, i, !0),
			nights: an(t, n.days)
		})}
      </p>
      <div class="bottom">
        ${r.final || !r.until ? e`<span class="chip">
              ${t("learn.results.split", {
			better: n.better,
			worse: n.worse,
			same: Math.max(0, n.days - n.better - n.worse)
		})}
            </span>` : e`<span class="chip warn">${t("overview.sim.provisional", { time: r.until.slice(11, 16) })}</span>`}
        <a class="btn btn-secondary" data-notip href=${`${this.prefix}/learn`} @click=${(e) => this.open(e, "learn")}
          >${t("overview.sim.more")}</a
        >
      </div>
    </section>`;
	}
	renderNow(t) {
		let n = this.hass, r = this.state?.config;
		if (!n || !r) return e``;
		let i = r.measurements, a = i.solar_power.length ? se(n, i.solar_power) : null, o = h(n, i.grid_power), s = r.batteries.map((e) => ({
			power: h(n, e.power),
			soc: l(n, e.soc_entity)
		})), c = s.filter((e) => e.power != null), u = c.length ? c.reduce((e, t) => e + (t.power ?? 0), 0) : null, d = h(n, i.home_power), f = d == null && o != null;
		f && (d = (o ?? 0) + (a ?? 0) - (u ?? 0));
		let p = s.map((e) => e.soc).filter((e) => e != null), m = (e) => e == null ? "–" : b(t.lang, Math.abs(e), 2), g = (t, n, r, i, a) => e`<div class="flow ${t}">
        <span class="icon"><ha-icon icon=${n}></ha-icon></span>
        <small>${r}</small>
        <b>${m(i)}<span>kW</span></b>
        <em>${a}</em>
      </div>`, _ = (e) => e == null || Math.abs(e) < .05;
		return e`<section class="card wide" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:pulse"></ha-icon>${t("overview.now")}</div>
        ${y(t, "now")}
      </div>
      <div class="now">
        ${g("sun", "mdi:solar-power", t("overview.now.solar"), a, t(a == null ? "overview.now.none" : "overview.now.solar.sub"))}
        ${g("home", "mdi:home-lightning-bolt-outline", t("overview.now.home"), d, t(d == null ? "overview.now.none" : f ? "overview.now.home.calc" : "overview.now.home.sub"))}
        ${g("battery", "mdi:home-battery-outline", _(u) ? t("overview.now.battery") : t(u > 0 ? "overview.now.battery.charge" : "overview.now.battery.discharge"), u, p.length ? p.length === 1 ? t("overview.now.soc", { value: b(t.lang, p[0], 0) }) : t("overview.now.soc_avg", {
			value: b(t.lang, p.reduce((e, t) => e + t, 0) / p.length, 0),
			count: p.length
		}) : r.batteries.length ? t("overview.now.none") : t("overview.now.no_battery"))}
        ${g("net", "mdi:transmission-tower", _(o) ? t("overview.now.grid") : t(o > 0 ? "overview.now.grid.in" : "overview.now.grid.out"), o, o == null ? t("overview.now.none") : _(o) ? t("overview.now.grid.idle") : t(o > 0 ? "overview.now.grid.in.sub" : "overview.now.grid.out.sub"))}
      </div>
    </section>`;
	}
	renderWeek(t) {
		let n = [...this.week ?? []].reverse(), r = this.state?.observe, i = r?.backfill.state === "running" ? t("history.reading") : r?.first_day ? t("overview.week.known", { days: r.day_count ?? 0 }) : t("overview.week.none"), a = [{
			label: t("history.chart.home"),
			kind: "bar",
			values: n.map((e) => e.home),
			color: "var(--joe-c-load)",
			digits: 1
		}, {
			label: t("history.chart.solar"),
			kind: "bar",
			values: n.map((e) => e.solar),
			color: "var(--joe-c-pv)",
			digits: 1
		}], s = n.map((e) => new Intl.DateTimeFormat(t.lang, {
			weekday: "short",
			day: "numeric",
			month: "numeric",
			timeZone: "UTC"
		}).format(/* @__PURE__ */ new Date(`${e.date}T12:00:00Z`))), c = new Map(n.map((e, n) => [n, new Intl.DateTimeFormat(t.lang, {
			weekday: "short",
			timeZone: "UTC"
		}).format(/* @__PURE__ */ new Date(`${e.date}T12:00:00Z`))]));
		return e`<section class="card wide" data-tipped>
      <div class="head">
        <div class="eyebrow"><ha-icon icon="mdi:chart-bar"></ha-icon>${t("overview.week")}</div>
        ${y(t, "week")}
      </div>
      <p class="status">${i}</p>
      ${n.length ? e`<joe-chart
              .labels=${s}
              .ticks=${c}
              .series=${a}
              centerTicks
              unit="kWh"
              height="190"
              lang=${t.lang}
              label=${t("overview.week")}
            ></joe-chart>
            <div class="bottom">
              <div class="legend">
                ${a.map((t) => e`<span><i style="background:${t.color}"></i>${t.label}</span>`)}
              </div>
              <a class="btn btn-secondary" data-notip href=${this.historyHref()} @click=${this.openHistory}
                >${t("overview.week.more")}</a
              >
            </div>` : o}
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
C([r({ attribute: !1 })], Hn.prototype, "t", void 0), C([r({ attribute: !1 })], Hn.prototype, "hass", void 0), C([r({ attribute: !1 })], Hn.prototype, "state", void 0), C([r()], Hn.prototype, "prefix", void 0), C([c()], Hn.prototype, "week", void 0), S("joe-overview", Hn);
//#endregion
//#region src/pages/plan.ts
var Un = 36e5, Wn = class extends n {
	constructor(...e) {
		super(...e), this.refreshing = !1;
	}
	static {
		this.styles = [d, a`
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
		let t = this.t;
		if (!t) return o;
		let n = this.state?.plan;
		if (!n || n.kind === "unavailable" || !n.hours) return this.renderEmpty(t, n);
		let r = ie(t, n), i = te(t, n, this.hass?.config?.currency);
		return e`<div class="wrap">
      <div class="eyebrow"><ha-icon icon="mdi:weather-night"></ha-icon>${t("overview.night")} · ${f(t, n)}</div>
      ${T(t("plan.page.title"))} ${w}
      <div class="top" data-tipped>
        ${this.state?.mode === "simulation" ? e`<span class="pill-sim">${t("mode.simulation")}</span>` : e`<span class="chip ${this.state?.mode === "live" ? "ok" : "learned"}">${t(`mode.${this.state?.mode ?? "off"}`)}</span>`}
        <span class="chip ${n.fixed ? "ok" : ""}">
          ${n.fixed ? t("plan.fixed_at", { time: n.created.slice(11, 16) }) : t("plan.preview_at", { time: n.created.slice(11, 16) })}
        </span>
        <button type="button" class="mini-btn" ?disabled=${this.refreshing || n.fixed} @click=${this.refresh}>
          <ha-icon icon="mdi:refresh"></ha-icon>${t("plan.refresh")}
        </button>
        ${y(t, "plan_refresh")}
      </div>
      <section class="hero" data-tipped>
        <joe-pose name=${_(n)}></joe-pose>
        <div class="big">
          ${n.kind === "none" ? t("plan.big.none") : e`${b(t.lang, n.target ?? 0, 0)}<small>%</small>`}
        </div>
        <p class="say">${u(t, n)} ${y(t, "plan_target")}</p>
        ${r.length ? e`<div class="lines">${r.map((t) => e`<div>${t}</div>`)}</div>` : o}
        ${i ? e`<p class="cost">${i}</p>` : o}
      </section>
      ${this.renderSteer(t, n)} ${this.renderActions(t, n)} ${this.renderEnergy(t, n, n.hours)}
      ${this.renderPrices(t, n, n.hours)} ${this.renderSoc(t, n, n.hours)}
      ${this.renderMath(t, n)}
    </div>`;
	}
	renderSteer(t, n) {
		let r = this.state, i = r?.control;
		if (!r || !i || !["advisory", "live"].includes(r.mode) || !n.window || n.kind === "none") return o;
		let a = n.window.start, s = i.skip === a, c = i.answer?.night === a ? i.answer.yes : null, l = r.config.batteries.filter((e) => e.adapter !== "none" && i.ready[e.id] && i.ready[e.id] !== "ready"), u, d;
		return r.mode === "advisory" && !s ? (u = t(c === !0 ? "plan.steer.answered_yes" : c === !1 ? "plan.steer.answered_no" : "plan.steer.advisory"), d = e`${c === !0 ? o : e`<button type="button" class="btn btn-primary" @click=${() => this.answer(a, !0)}>${t("plan.steer.yes")}</button>`}
      ${c === !1 ? o : e`<button type="button" class="btn btn-secondary" @click=${() => this.answer(a, !1)}>${t("plan.steer.no")}</button>`}`) : (u = t(s ? "plan.steer.skipped" : "plan.steer.live"), d = e`<button type="button" class="btn btn-secondary" @click=${() => this.skip(!s)}>
        ${t(s ? "plan.steer.unskip" : "plan.steer.skip")}
      </button>`), e`<section class="chart-card steer" data-tipped>
      <div class="chart-head">${u} ${y(t, "plan_steer")}</div>
      ${l.length ? e`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon><span>${t("plan.steer.untested", { names: l.map((e) => e.name).join(", ") })}</span>
          </div>` : o}
      <div class="actions">${d}</div>
    </section>`;
	}
	renderActions(t, n) {
		let r = n.actions ?? [];
		if (!r.length) return o;
		let i = this.hass?.config?.currency ?? "EUR", a = (e) => new Intl.NumberFormat(t.lang, {
			style: "currency",
			currency: i
		}).format(e);
		return e`<section class="chart-card" data-tipped>
      <div class="chart-head">${t("plan.actions")} ${y(t, "plan_actions")}</div>
      <dl>
        ${r.map((r) => {
			let i = r.target == null ? "" : b(t.lang, r.target, 0), s = r.run ? r.kind === "target" ? t("plan.actions.target", {
				start: x(r.start),
				end: x(r.end),
				target: i
			}) : t("plan.actions.run", {
				start: x(r.start),
				end: x(r.end)
			}) : t.optional(`devices.action.why.${r.reasons[r.reasons.length - 1] ?? "manual_only"}`, {
				kwh: b(t.lang, n.meta?.tomorrow_kwh ?? 0, 0),
				temperature: b(t.lang, r.temperature ?? 0, 0)
			}) ?? "", c = r.run && r.energy_kwh ? t("plan.actions.energy", {
				kwh: b(t.lang, r.energy_kwh, 1),
				cost: a(r.cost ?? 0)
			}) : "", l = this.state?.config.actions.find((e) => e.id === r.id);
			return e`<dt>${r.name}</dt>
            <dd>
              ${s}${c ? e`<small>${c}</small>` : o}
              ${r.need ? e`<joe-car-need .hass=${this.hass} .t=${t} .action=${r} .roundTrip=${l?.need?.round_trip ?? !0}></joe-car-need>` : o}
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
	renderEmpty(t, n) {
		let r = n ? u(t, n) : t(this.state?.mode === "off" ? "plan.empty.off" : "plan.empty.waiting");
		return e`<div class="empty">
      <joe-pose name=${n ? _(n) : "plan"}></joe-pose>
      <div>
        ${T(t("plan.title"))} ${w}
        <p class="lead">${r}</p>
      </div>
    </div>`;
	}
	frame(e, t, n) {
		let r = (e) => `${String((Number(e.slice(0, 2)) + 1) % 24).padStart(2, "0")}:00`, i = n.map((e, t) => `${x(e.start)}–${x(n[t + 1]?.start) || r(x(e.start))}`), a = /* @__PURE__ */ new Map();
		n.forEach((t, n) => {
			let r = x(t.start);
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
					if (t >= r && t < r + Un) return e + (t - r) / Un;
				}
				return null;
			}
		};
	}
	renderEnergy(t, n, r) {
		let i = this.frame(t, n, r), a = [{
			label: t("plan.chart.solar"),
			kind: "area",
			values: r.map((e) => e.solar),
			color: "var(--joe-c-pv)",
			fill: "var(--joe-c-pv-fill)"
		}, {
			label: t("plan.chart.home"),
			kind: "line",
			values: r.map((e) => e.home),
			color: "var(--joe-c-load)"
		}];
		r.some((e) => e.charge > 0) && a.push({
			label: t("plan.chart.charge"),
			kind: "bar",
			values: r.map((e) => e.charge > 0 ? e.charge : null),
			color: "var(--joe-c-grid)"
		});
		let o = [], s = i.at(n.sun_takes_over);
		if (s != null) {
			let e = x(n.sun_takes_over);
			o.push({
				at: s,
				label: t("plan.chart.sun", { time: e }),
				short: `↑${e}`
			});
		}
		return e`<div class="chart-card" data-tipped>
      <div class="chart-head">${t("plan.chart.energy")} ${y(t, "chart_plan_energy")}</div>
      <joe-chart
        .labels=${i.labels}
        .ticks=${i.ticks}
        .series=${a}
        .bands=${i.bands}
        .markers=${o}
        unit="kWh"
        lang=${t.lang}
        label=${t("plan.chart.energy")}
      ></joe-chart>
      <div class="legend">
        ${a.map((t) => e`<span><i style="background:${t.color}"></i>${t.label}</span>`)}
      </div>
    </div>`;
	}
	renderPrices(t, n, r) {
		if (!r.some((e) => e.price != null)) return o;
		let i = this.frame(t, n, r), a = [{
			label: t("plan.chart.price"),
			kind: "bar",
			values: r.map((e) => e.price == null ? null : Math.round(e.price * 1e3) / 10),
			color: "var(--joe-c-ist)",
			digits: 1
		}], s = (n.charge_slots ?? []).flatMap((e) => {
			let n = i.at(e.start);
			return n == null ? [] : [{
				at: n,
				label: t("plan.chart.charge_at", { time: x(e.start) }),
				short: x(e.start)
			}];
		});
		return e`<div class="chart-card" data-tipped>
      <div class="chart-head">${t("plan.chart.prices")} ${y(t, "chart_plan_prices")}</div>
      <joe-chart
        .labels=${i.labels}
        .ticks=${i.ticks}
        .series=${a}
        .bands=${i.bands}
        .markers=${s}
        unit="ct"
        lang=${t.lang}
        label=${t("plan.chart.prices")}
      ></joe-chart>
      ${n.charge_slots?.length ? e`<p class="slots">${t("plan.slots", { slots: ne(n) })}</p>` : o}
    </div>`;
	}
	renderSoc(t, n, r) {
		let i = this.frame(t, n, r), a = n.rules?.reserve ?? 10, o = [
			{
				label: t("plan.chart.plan"),
				kind: "line",
				values: r.map((e) => e.soc),
				color: "var(--joe-c-soc)",
				digits: 0
			},
			{
				label: t("plan.chart.without"),
				kind: "line",
				values: r.map((e) => e.soc_without),
				color: "var(--joe-c-ist)",
				dashed: !0,
				digits: 0
			},
			{
				label: t("plan.chart.reserve", { value: b(t.lang, a, 0) }),
				kind: "line",
				values: r.map(() => a),
				color: "var(--joe-crit)",
				dashed: !0,
				digits: 0
			}
		], s = [], c = i.at(n.window?.end);
		c != null && n.kind !== "none" && s.push({
			at: c,
			label: t("plan.chart.target", { value: b(t.lang, n.target ?? 0, 0) })
		});
		let l = i.at(n.full_at);
		return l != null && s.push({
			at: l,
			label: t("plan.chart.full", { time: x(n.full_at) }),
			short: `${x(n.full_at)}`
		}), e`<div class="chart-card" data-tipped>
      <div class="chart-head">${t("plan.chart.soc")} ${y(t, "chart_plan_soc")}</div>
      <joe-chart
        .labels=${i.labels}
        .ticks=${i.ticks}
        .series=${o}
        .bands=${i.bands}
        .markers=${s}
        max="100"
        height="190"
        unit="%"
        lang=${t.lang}
        label=${t("plan.chart.soc")}
      ></joe-chart>
      <div class="legend">
        ${o.map((t) => e`<span><i class=${t.dashed ? "dash" : ""} style="background:${t.color};color:${t.color}"></i>${t.label}</span>`)}
      </div>
    </div>`;
	}
	renderMath(t, n) {
		let r = (e, n = 1) => e == null ? "–" : `${b(t.lang, e, n)} kWh`, i = (e) => e == null ? "–" : `${b(t.lang, e * 100, 1)} ct`, a = n.window?.start.slice(0, 10) ?? "", s = n.meta?.solar.sources[a] ?? "none", c = n.meta?.tomorrow, l = c?.solar_factor ?? n.meta?.solar_factor ?? 1, u = n.meta?.consumption, d = this.state?.config.persons ?? [], f = [
			[t("plan.math.battery_now"), e`${b(t.lang, n.soc_now ?? 0, 0)} %<small
            >${t("plan.math.battery_now.sub", {
				stored: b(t.lang, (n.soc_now ?? 0) / 100 * (n.capacity_kwh ?? 0), 1),
				capacity: b(t.lang, n.capacity_kwh ?? 0, 1)
			})}</small
          >`],
			[t("plan.math.battery_start"), `${b(t.lang, n.soc_start ?? 0, 0)} %`],
			[t("plan.math.solar"), e`${r(n.solar_kwh)}<small
            >${t(`plan.math.solar.${s}`)}${l === 1 ? "" : ` · ${t(c?.solar_source === "combined" ? "plan.math.solar.combined" : c?.solar_source === "weather" && c.weather ? "plan.math.solar.weather" : "plan.math.solar.factor", {
				value: b(t.lang, l, 2),
				weather: c?.weather ? t(`learn.weather.${c.weather}`) : ""
			})}`}</small
          >`],
			[t("plan.math.home"), e`${r(n.home_kwh)}<small
            >${u?.source === "history" ? t("plan.math.home.history", {
				days: u.days,
				kind: t(n.meta?.workday === !1 ? "plan.math.day_off" : "plan.math.workday")
			}) : t("plan.math.home.default")}</small
          >`],
			...c && (c.temp != null || Object.keys(c.labels).length) ? [[t("plan.math.tomorrow"), e`${[c.temp == null ? "" : `${b(t.lang, c.temp, 0)} °C`, ...Object.entries(c.labels).map(([e, n]) => t("plan.math.tomorrow.person", {
				name: d.find((t) => t.id === e)?.name ?? e,
				label: t(`label.${n}`)
			}))].filter(Boolean).join(" · ")}<small
                  >${c.expected_kwh == null ? t("plan.math.tomorrow.usual") : t("plan.math.tomorrow.scaled", {
				expected: b(t.lang, c.expected_kwh, 1),
				usual: b(t.lang, c.profile_kwh, 1)
			})}</small
                >`]] : [],
			[t("plan.math.target"), e`${b(t.lang, n.target ?? 0, 0)} %<small
            >${t("plan.math.target.sub", {
				optimum: b(t.lang, n.optimum ?? 0, 0),
				buffer: b(t.lang, (n.rules?.buffer ?? 0) * 100, 0)
			})}</small
          >`],
			[t("plan.math.prices"), e`${t("plan.math.prices.value", {
				night: i(n.prices?.night),
				day: i(n.prices?.day),
				feed: i(n.prices?.feed_in)
			})}${n.prices?.assumed ? e`<small>${t("plan.math.prices.assumed")}</small>` : o}`],
			[t("plan.math.rules"), t("plan.math.rules.value", {
				reserve: b(t.lang, n.rules?.reserve ?? 0, 0),
				max: b(t.lang, n.rules?.max_target ?? 100, 0),
				mode: t.optional(`rule.discharge.${n.rules?.discharge_mode}`) ?? ""
			})]
		], p = [...new Set(n.notes ?? [])].map((e) => t.optional(`plan.note.${e}`)).filter(Boolean);
		return e`<div class="chart-card" data-tipped>
      <div class="chart-head">${t("plan.math")} ${y(t, "plan_math")}</div>
      <dl>${f.map(([t, n]) => e`<dt>${t}</dt><dd>${n}</dd>`)}</dl>
      ${p.map((t) => e`<div class="note"><ha-icon icon="mdi:information-outline"></ha-icon><span>${t}</span></div>`)}
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
C([r({ attribute: !1 })], Wn.prototype, "hass", void 0), C([r({ attribute: !1 })], Wn.prototype, "t", void 0), C([r({ attribute: !1 })], Wn.prototype, "state", void 0), C([c()], Wn.prototype, "refreshing", void 0), S("joe-plan-page", Wn);
//#endregion
//#region src/pages/settings.ts
var Gn = [
	"simulation",
	"advisory",
	"live",
	"off"
], Kn = [
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
], qn = [{
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
}], Jn = {
	key: "balance_days",
	unit: "",
	min: 3,
	max: 90,
	step: 1,
	optional: !0,
	integer: !0
}, Yn = [
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
], Xn = {
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
		this.styles = [d, a`
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
		let t = this.t, n = this.state;
		if (!t || !n) return o;
		let r = n.config;
		return e`<div class="list">
        <section class="group">
          <h2>${t("settings.operation")}</h2>
          <div class="row" data-tipped>
            <div>
              <div class="name"><b>${t("settings.mode")}</b>${y(t, "mode")}</div>
              <small>${t("settings.mode.hint")}</small>
            </div>
            <div class="seg" role="group" aria-label=${t("settings.mode")}>
              ${Gn.map((r) => e`<button
                    type="button"
                    aria-pressed=${String(n.mode === r)}
                    @click=${() => this.emit("joe-set-mode", { mode: r })}
                  >
                    ${t(`mode.${r}`)}
                  </button>`)}
            </div>
          </div>
          ${this.gridFriendlyRows(t, r.rules)}
          <div class="row" data-tipped>
            <div>
              <div class="name"><b>${t("settings.setup")}</b>${y(t, "restart")}</div>
              <small>${t("settings.setup.hint")}</small>
            </div>
            <button
              type="button"
              class="btn btn-secondary"
              @click=${() => this.emit("joe-onboarding", {
			step: "welcome",
			completed: !1
		})}
            >
              ${t("settings.setup.restart")}
            </button>
          </div>
        </section>

        ${this.renderNotify(t)} ${this.renderRouting(t)}

        <section class="group plain">
          <h2>${t("settings.uses")}</h2>
          <p class="intro">${t("settings.uses.intro")}</p>
          <joe-review
            .hass=${this.hass}
            .t=${t}
            .config=${r}
            .discovery=${this.discovery}
            .checks=${this.checks}
            context="settings"
          ></joe-review>
        </section>

        <section class="group">
          <h2>${t("settings.answers")}</h2>
          ${Yn.map((e) => this.answerRow(t, e.key, e.tip))}
        </section>

        ${this.renderObserve(t)}

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
            <h2>${t("settings.pro")}</h2>
          </button>
          ${this.pro ? e`<p class="intro">${t("settings.pro.intro")}</p>
                ${Kn.slice(0, 5).map((e) => this.numberRow(t, r.rules, e))}
                ${qn.map((e) => this.numberRow(t, r.rules, e))} ${this.guardRow(t, r.rules)}
                ${this.numberRow(t, r.rules, Jn)}
                ${this.priorityRow(t, r.rules)} ${this.dischargeRow(t, r.rules)}
                ${this.converterRow(t, r.rules)}
                ${Kn.slice(5).map((e) => this.numberRow(t, r.rules, e))}` : o}
        </section>

        ${this.renderBackup(t)}

        <section class="group">
          <h2>${t("settings.about")}</h2>
          <div class="row"><b>${t("settings.version")}</b><span class="value">${this.info?.version ?? "–"}</span></div>
          <div class="row"><b>${t("settings.ha")}</b><span class="value">${this.info?.ha_version ?? "–"}</span></div>
          <div class="row"><b>${t("settings.energy")}</b><span class="value">${this.energyText(t)}</span></div>
        </section>
      </div>
      ${this.question ? this.renderQuestionSheet(t) : o}`;
	}
	renderBackup(t) {
		return e`<section class="group">
      <h2>${t("settings.backup")}</h2>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${t("settings.backup.export")}</b>${y(t, "backup_export")}</div>
          <small>${t("settings.backup.export.hint")}</small>
        </div>
        <button type="button" class="btn btn-secondary" @click=${() => void this.exportSettings()}>${t("settings.backup.download")}</button>
      </div>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${t("settings.backup.import")}</b>${y(t, "backup_import")}</div>
          <small>${t("settings.backup.import.hint")}</small>
        </div>
        <label class="btn btn-secondary file">
          ${t("settings.backup.choose")}
          <input type="file" accept="application/json,.json" @change=${(e) => void this.readBackup(e)} />
        </label>
      </div>
      ${this.backup ? e`<div class="note warn">
            <ha-icon icon="mdi:alert-outline"></ha-icon>
            <span>
              ${t("settings.backup.confirm", {
			file: this.backup.name,
			when: this.backup.when
		})}
              <span class="confirm">
                <button type="button" class="btn btn-danger" @click=${() => void this.importSettings()}>${t("settings.backup.replace")}</button>
                <button type="button" class="btn btn-ghost" @click=${() => this.backup = void 0}>${t("common.cancel")}</button>
              </span>
            </span>
          </div>` : o}
      ${this.backupNote ? e`<div class="note ${this.backupNote.ok ? "ok" : "warn"}">
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
	renderRouting(t) {
		let n = this.state.config.routing, r = this.info?.routing, i = n.service === "google" ? `google:${n.google_entry ?? ""}` : n.service ?? "", a = (e) => {
			e.startsWith("google:") ? M(this, { routing: {
				service: "google",
				google_entry: e.slice(7) || null
			} }) : M(this, { routing: {
				service: e || null,
				google_entry: null
			} });
		}, s = (r) => e`<div class="row" data-tipped>
      <div>
        <div class="name"><label for="routing-${r}"><b>${t(`settings.routing.${r}`)}</b></label>${y(t, "routing_osm")}</div>
        <small>${t(`settings.routing.${r}.hint`)}</small>
      </div>
      <input
        id="routing-${r}"
        class="input"
        type="url"
        .value=${n[r]}
        @change=${(e) => {
			let t = e.target.value.trim();
			t.startsWith("http") && M(this, { routing: { [r]: t } });
		}}
      />
    </div>`;
		return e`<section class="group">
      <h2>${t("settings.routing")}</h2>
      <p class="intro">${t("settings.routing.intro")}</p>
      <div class="row" data-tipped>
        <div>
          <div class="name"><label for="routing-service"><b>${t("settings.routing.service")}</b></label>${y(t, "routing_service")}</div>
          <small>${t("settings.routing.service.hint")}</small>
        </div>
        <select id="routing-service" class="input" @change=${(e) => a(e.target.value)}>
          <option value="" ?selected=${i === ""}>${t("settings.routing.none")}</option>
          ${r?.waze === !1 ? o : e`<option value="waze" ?selected=${i === "waze"}>${t("settings.routing.waze")}</option>`}
          ${(r?.google ?? []).map((n) => e`<option value=${`google:${n.entry_id}`} ?selected=${i === `google:${n.entry_id}`}>
                ${t("settings.routing.google", { name: n.title })}
              </option>`)}
          <option value="osm" ?selected=${i === "osm"}>${t("settings.routing.osm")}</option>
        </select>
      </div>
      ${n.service === "osm" ? e`${s("geocoder_url")} ${s("router_url")}` : o}
    </section>`;
	}
	connectedCallback() {
		super.connectedCallback(), this.hass?.callWS({ type: "energy_joe/notify/targets" }).then((e) => this.notifyTargets = e).catch(() => void 0);
	}
	renderNotify(t) {
		let n = this.state.config, r = n.notify, i = this.notifyTargets ?? Object.keys(this.hass?.services?.notify ?? {}).filter((e) => ![
			"persistent_notification",
			"send_message",
			"notify"
		].includes(e)).sort().map((e) => ({
			service: e,
			name: e.replace(/_/g, " ")
		})), a = r.service?.replace(/^notify\./, ""), s = !!a && this.notifyTargets !== void 0 && !i.some((e) => e.service === a), c = (n, i) => e`<div class="row" data-tipped>
        <div>
          <div class="name"><b id="notify-${n}">${t(`settings.notify.${n}`)}</b>${y(t, i)}</div>
          <small>${t(`settings.notify.${n}.hint`)}</small>
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
		return e`<section class="group">
      <h2>${t("settings.notify")}</h2>
      <p class="intro">${t("settings.notify.intro")}</p>
      <div class="row" data-tipped>
        <div>
          <div class="name"><label for="notify-service"><b>${t("settings.notify.service")}</b></label>${y(t, "notify_service")}</div>
          <small>${t("settings.notify.service.hint")}</small>
        </div>
        <select
          id="notify-service"
          class="input"
          @change=${(e) => {
			let t = e.target.value;
			M(this, { notify: { service: t ? `notify.${t}` : null } });
		}}
        >
          <option value="" ?selected=${!r.service}>${t("settings.notify.none")}</option>
          ${i.map((t) => e`<option value=${t.service} ?selected=${a === t.service}>${t.name}</option>`)}
          ${s ? e`<option value=${a} selected>${t("settings.notify.gone", { name: a ?? "" })}</option>` : o}
        </select>
      </div>
      ${c("ask", "notify_ask")} ${c("problems", "notify_problems")} ${c("morning", "notify_morning")}
      <div class="row" data-tipped>
        <div>
          <div class="name"><label for="ask-time"><b>${t("settings.ask_time")}</b></label>${y(t, "ask_time")}</div>
          <small>${t("settings.ask_time.hint")}</small>
        </div>
        <input
          id="ask-time"
          class="input time"
          type="time"
          .value=${n.rules.ask_time}
          @change=${(e) => {
			let t = e.target.value;
			/^\d{2}:\d{2}$/.test(t) && M(this, { rules: { ask_time: t } });
		}}
        />
      </div>
    </section>`;
	}
	renderObserve(t) {
		let n = this.state, r = n.observe, i = !!r?.active, a = r?.backfill.state === "running", o = (e) => new Intl.DateTimeFormat(t.lang, {
			day: "numeric",
			month: "long",
			timeZone: "UTC"
		}).format(/* @__PURE__ */ new Date(`${e.slice(0, 10)}T12:00:00Z`)), s = i ? t("settings.observe.since", {
			day: o(r.since),
			time: r.since.slice(11, 16)
		}) : n.mode === "off" ? t("settings.observe.off") : t("settings.observe.waiting"), c = [];
		r?.first_day ? c.push(t("settings.observe.days", {
			days: r.day_count ?? 0,
			first: o(r.first_day)
		})) : c.push(t("settings.observe.nothing"));
		let l = r?.backfill;
		return l?.state === "running" ? c.push(t("history.reading")) : l?.state === "unavailable" ? c.push(t("settings.observe.no_recorder")) : l?.state === "failed" && c.push(t("settings.observe.failed")), e`<section class="group">
      <h2>${t("settings.observe")}</h2>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${t("settings.observe.recording")}</b>${y(t, "observe")}</div>
          <small>${s}</small>
        </div>
        <span class="chip ${i ? "ok" : ""}">
          ${t(i ? "status.running" : n.mode === "off" ? "status.paused" : "status.waiting")}
        </span>
      </div>
      <div class="row" data-tipped>
        <div>
          <div class="name"><b>${t("settings.observe.history")}</b>${y(t, "rebuild")}</div>
          <small>${c.join(" · ")}</small>
        </div>
        <button type="button" class="btn btn-secondary" ?disabled=${!i || a} @click=${this.rebuild}>
          ${t("settings.observe.rebuild")}
        </button>
      </div>
    </section>`;
	}
	async rebuild() {
		try {
			await this.hass?.callWS({ type: "energy_joe/history/rebuild" });
		} catch {}
	}
	answerRow(t, n, r) {
		let i = this.state.config, a = i.answers[n], s = Array.isArray(a) ? a : typeof a == "string" ? [a] : [], c = a === "unknown" ? t("sum.unknown") : s.length ? s.map((e) => Xn[n][e] ? t(Xn[n][e]) : e).join(", ") : t("sum.open");
		return e`<div class="row" data-tipped>
      <div>
        <div class="name"><b>${t(`settings.answer.${n}`)}</b>${y(t, r)}</div>
        <small>${c}</small>
      </div>
      <div class="control">
        ${a == null ? o : D(t, k(i, `answers.${n}`))}
        <button type="button" class="mini-btn" @click=${() => this.question = n}>
          <ha-icon icon="mdi:pencil-outline"></ha-icon>${t("review.change")}
        </button>
      </div>
    </div>`;
	}
	renderQuestionSheet(t) {
		let n = () => {
			this.question = "";
		};
		return e`<joe-sheet label=${t("settings.answers")} closeLabel=${t("common.close")} @joe-close=${n}>
      <joe-questions
        .hass=${this.hass}
        .t=${t}
        .config=${this.state?.config}
        .discovery=${this.discovery}
        single=${this.question}
      ></joe-questions>
      <div class="actions">
        <button type="button" class="btn btn-secondary" data-notip @click=${n}>${t("mode.close")}</button>
      </div>
    </joe-sheet>`;
	}
	numberRow(t, n, r) {
		let i = this.state.config, a = n[r.key], s = r.scale ?? 1, c = a == null ? "" : String(Math.round(a * s * 100) / 100), l = this.info?.defaults?.rules[r.key], u = k(i, `rules.${r.key}`), d = u?.source === "user";
		return e`<div class="row" data-tipped>
      <div>
        <div class="name"><b>${t(`rule.${r.key}`)}</b>${y(t, `r_${r.key}`)}</div>
        <small>${t(`rule.${r.key}.hint`)}</small>
      </div>
      <div class="control">
        ${D(t, u)}
        <span class="unit-input">
          <input
            class="input"
            type="number"
            inputmode="decimal"
            min=${r.min}
            max=${r.max}
            step=${r.step}
            aria-label=${t(`rule.${r.key}`)}
            placeholder=${r.optional ? t("rule.off") : ""}
            .value=${c}
            @change=${(e) => this.setNumber(r, e.target)}
          />
          <span class="unit">${r.unit || t(`rule.${r.key}.unit`)}</span>
        </span>
        ${d && l !== void 0 ? e`<button
              type="button"
              class="mini-btn quiet"
              @click=${() => M(this, { rules: { [r.key]: l } }, "default")}
            >
              <ha-icon icon="mdi:restore"></ha-icon>${t("rule.reset")}
            </button>` : o}
      </div>
    </div>`;
	}
	setNumber(e, t) {
		let n = t.value.trim(), r = e.scale ?? 1;
		if (n === "") {
			e.optional && M(this, { rules: { [e.key]: null } });
			return;
		}
		let i = Number.parseFloat(n);
		if (!Number.isFinite(i) || i < e.min || i > e.max) {
			t.reportValidity();
			return;
		}
		let a = e.integer ? Math.round(i) : Math.round(i / r * 1e4) / 1e4;
		M(this, { rules: { [e.key]: a } });
	}
	gridFriendlyRows(t, n) {
		let r = this.state.config;
		return e`<div class="row" data-tipped>
        <div>
          <div class="name"><b id="grid-friendly">${t("rule.grid_friendly")}</b>${y(t, "r_grid_friendly")}</div>
          <small>${t("rule.grid_friendly.hint")}</small>
        </div>
        <div class="control">
          ${D(t, k(r, "rules.grid_friendly"))}
          <button
            type="button"
            class="switch"
            role="switch"
            aria-checked=${String(n.grid_friendly)}
            aria-labelledby="grid-friendly"
            @click=${() => M(this, { rules: { grid_friendly: !n.grid_friendly } })}
          ></button>
        </div>
      </div>
      ${n.grid_friendly ? e`<div class="row" data-tipped>
            <div>
              <div class="name"><b>${t("rule.grid_first")}</b>${y(t, "r_grid_first")}</div>
              <small>${t(n.grid_first ? "rule.grid_first.grid.hint" : "rule.grid_first.saving.hint")}</small>
            </div>
            <div class="seg" role="group" aria-label=${t("rule.grid_first")}>
              ${[!1, !0].map((r) => e`<button
                    type="button"
                    aria-pressed=${String(n.grid_first === r)}
                    @click=${() => M(this, { rules: { grid_first: r } })}
                  >
                    ${t(r ? "rule.grid_first.grid" : "rule.grid_first.saving")}
                  </button>`)}
            </div>
          </div>` : o}`;
	}
	guardRow(t, n) {
		let r = this.state.config, i = n.grid_limit_w;
		return e`<div class="row" data-tipped>
      <div>
        <div class="name"><b id="guard-grid">${t("rule.guard_grid")}</b>${y(t, "r_guard_grid")}</div>
        <small>${t(i ? "rule.guard_grid.hint" : "rule.guard_grid.no_limit")}</small>
      </div>
      <div class="control">
        ${D(t, k(r, "rules.guard_grid"))}
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(n.guard_grid)}
          aria-labelledby="guard-grid"
          ?disabled=${!i}
          @click=${() => M(this, { rules: { guard_grid: !n.guard_grid } })}
        ></button>
      </div>
    </div>`;
	}
	converterRow(t, n) {
		let r = this.state.config;
		return e`<div class="row" data-tipped>
      <div>
        <div class="name"><b id="converter-losses">${t("rule.converter_losses")}</b>${y(t, "r_converter_losses")}</div>
        <small>${t("rule.converter_losses.hint")}</small>
      </div>
      <div class="control">
        ${D(t, k(r, "rules.converter_losses"))}
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${String(n.converter_losses)}
          aria-labelledby="converter-losses"
          @click=${() => M(this, { rules: { converter_losses: !n.converter_losses } })}
        ></button>
      </div>
    </div>`;
	}
	priorityRow(t, n) {
		let r = this.state.config, i = n.priority, a = (e, t) => {
			let n = [...i];
			[n[e], n[e + t]] = [n[e + t], n[e]], M(this, { rules: { priority: n } });
		}, o = (t) => e`<svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.6"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d=${t ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"} />
      </svg>`;
		return e`<div class="row" data-tipped>
      <div>
        <div class="name"><b>${t("rule.priority")}</b>${y(t, "r_priority")}</div>
        <small>${t("rule.priority.hint")}</small>
      </div>
      <div class="control">
        ${D(t, k(r, "rules.priority"))}
        <div class="order">
          ${i.map((n, r) => e`<div>
              <span>${r + 1}. ${t(`rule.priority.${n}`)}</span>
              <button
                type="button"
                aria-label=${t("rule.priority.up", { name: t(`rule.priority.${n}`) })}
                ?disabled=${r === 0}
                @click=${() => a(r, -1)}
              >
                ${o(!0)}
              </button>
              <button
                type="button"
                aria-label=${t("rule.priority.down", { name: t(`rule.priority.${n}`) })}
                ?disabled=${r === i.length - 1}
                @click=${() => a(r, 1)}
              >
                ${o(!1)}
              </button>
            </div>`)}
        </div>
      </div>
    </div>`;
	}
	dischargeRow(t, n) {
		let r = this.state.config;
		return e`<div class="row stacked" data-tipped>
      <div>
        <div class="name">
          <b>${t("rule.discharge_in_window")}</b>${y(t, "r_discharge_in_window")}
          ${D(t, k(r, "rules.discharge_in_window"))}
        </div>
        <small>${t("rule.discharge_in_window.hint")}</small>
      </div>
      <div>
        <joe-choice
          compact
          label=${t("rule.discharge_in_window")}
          .options=${[
			"until_target",
			"block",
			"free"
		].map((e) => ({
			value: e,
			label: t(`rule.discharge.${e}`)
		}))}
          .value=${[n.discharge_in_window]}
          @joe-choice=${(e) => {
			e.detail.value[0] && M(this, { rules: { discharge_in_window: e.detail.value[0] } });
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
C([r({ attribute: !1 })], Q.prototype, "t", void 0), C([r({ attribute: !1 })], Q.prototype, "hass", void 0), C([r({ attribute: !1 })], Q.prototype, "state", void 0), C([r({ attribute: !1 })], Q.prototype, "info", void 0), C([r({ attribute: !1 })], Q.prototype, "discovery", void 0), C([r({ attribute: !1 })], Q.prototype, "checks", void 0), C([c()], Q.prototype, "backup", void 0), C([c()], Q.prototype, "backupNote", void 0), C([c()], Q.prototype, "pro", void 0), C([c()], Q.prototype, "notifyTargets", void 0), C([c()], Q.prototype, "question", void 0), S("joe-settings", Q);
//#endregion
//#region src/energy-joe-panel.ts
var Zn = [
	"simulation",
	"advisory",
	"live",
	"off"
], Qn = {
	simulation: "mdi:pause",
	advisory: "mdi:comment-question-outline",
	live: "mdi:play",
	off: "mdi:power"
}, $n = Zn, $ = class extends n {
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
		return it.includes(e) ? e : "overview";
	}
	connectedCallback() {
		super.connectedCallback(), en(), this.subscribe();
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
		let t = this.t;
		if (this.failed) return e`<main><joe-empty-state pose="puzzled" heading=${t("error.title")} text=${t("error.text")}></joe-empty-state></main>`;
		if (!this.joe) return e`<div class="loading">${t("loading")}</div>`;
		let n = !this.joe.onboarding.completed;
		return e`
      <header>
        ${this.joe.mode === "simulation" ? e`<div class="simband" aria-hidden="true"></div>` : o}
        <div class="bar">
          ${this.narrow ? e`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : o}
          <div class="brand">
            <img class="light" src=${ue("joe-head.webp")} alt="" width="36" height="36" />
            <img class="dark" src=${ue("joe-head-dark.webp")} alt="" width="36" height="36" />
            <span class="wordmark">ENERGY <b>JOE</b></span>
          </div>
          ${n ? this.renderSteps(t) : this.renderTabs(t)}
          <joe-sim-switch
            data-notip
            .mode=${this.joe.mode}
            .t=${t}
            ?compact=${this.narrow}
            ?running=${!n}
            @joe-mode-switch=${this.onModeSwitch}
          ></joe-sim-switch>
        </div>
      </header>
      ${this.notice ? e`<div class="notice" role="alert">${this.notice}</div>` : o}
      <main
        @joe-onboarding=${this.onOnboarding}
        @joe-rediscover=${() => this.scan()}
        @joe-set-mode=${(e) => this.setMode(e.detail.mode)}
        @joe-navigate=${(e) => this.go(e.detail.page)}
      >
        ${n ? e`<joe-onboarding
              .step=${this.joe.onboarding.step}
              .t=${t}
              .info=${this.info}
              .hass=${this.hass}
              .config=${this.joe.config}
              .discovery=${this.discovery}
              .checks=${this.checks}
              ?discovering=${this.discovering}
              ?discoveryFailed=${this.discoveryFailed}
            ></joe-onboarding>` : this.renderPage(t)}
      </main>
      ${this.modeDialog ? this.renderModeDialog(t) : o} ${this.editor ? this.renderEditor(t) : o}
      ${this.picker ? this.renderPicker(t) : o}
    `;
	}
	renderTabs(t) {
		return e`<nav class="tabs" aria-label=${t("nav.label")}>
      ${it.map((n) => e`<a
            href=${this.href(n)}
            class=${n === this.page ? "on" : ""}
            aria-current=${n === this.page ? "page" : "false"}
            @click=${(e) => this.navigate(e, n)}
            >${t(`tab.${n}`)}</a
          >`)}
    </nav>`;
	}
	renderSteps(t) {
		let n = Ye.indexOf(this.joe?.onboarding.step ?? "welcome");
		return e`<ol class="steps" aria-label=${t("steps.label")}>
      ${Ye.map((r, i) => e`<li class=${i < n ? "done" : i === n ? "on" : ""} aria-current=${i === n ? "step" : "false"}>
            ${i + 1} ${t(`step.${r}`)}
          </li>`)}
    </ol>`;
	}
	renderPage(t) {
		let n = this.page;
		return n === "overview" ? e`<joe-overview
        .t=${t}
        .hass=${this.hass}
        .state=${this.joe}
        prefix=${this.route?.prefix ?? "/energy-joe"}
      ></joe-overview>` : n === "history" ? e`<joe-history .t=${t} .hass=${this.hass} .state=${this.joe}></joe-history>` : n === "plan" ? e`<joe-plan-page .t=${t} .hass=${this.hass} .state=${this.joe}></joe-plan-page>` : n === "learn" ? e`<joe-learn-page .t=${t} .hass=${this.hass} .state=${this.joe}></joe-learn-page>` : n === "devices" ? e`<joe-devices-page
        .t=${t}
        .hass=${this.hass}
        .state=${this.joe}
        .discovery=${this.discovery}
        .info=${this.info}
      ></joe-devices-page>` : n === "climate" ? e`<joe-climate-page .t=${t} .hass=${this.hass} .state=${this.joe}></joe-climate-page>` : n === "settings" ? e`<joe-settings
        .t=${t}
        .hass=${this.hass}
        .state=${this.joe}
        .info=${this.info}
        .discovery=${this.discovery}
        .checks=${this.checks}
      ></joe-settings>` : e``;
	}
	renderModeDialog(t) {
		let n = this.joe?.mode ?? "simulation";
		return e`<div class="scrim" @click=${this.closeDialog}>
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
          <div id="mode-title">${T(t("mode.dialog.title"), "h2", y(t, "mode"))}</div>
          ${w}
          ${this.renderReadiness(t)}
          <div class="modes" role="group" aria-labelledby="mode-title">
            ${Zn.map((r) => {
			let i = $n.includes(r);
			return e`<button
                type="button"
                class="mode ${r}"
                aria-pressed=${String(r === n)}
                ?disabled=${!i}
                @click=${() => this.chooseMode(r)}
              >
                <span class="knob"><ha-icon icon=${Qn[r]}></ha-icon></span>
                <span class="label">
                  <b>${t(`mode.${r}`)}</b>
                  <small>${t(`mode.${r}.desc`)}</small>
                </span>
                ${r === n ? e`<span class="chip ok"><ha-icon icon="mdi:check"></ha-icon>${t("mode.current")}</span>` : i ? o : e`<span class="chip soon">${t("mode.soon")}</span>`}
              </button>`;
		})}
          </div>
        </div>
        <div class="actions">
          <button type="button" class="btn btn-secondary" data-notip @click=${this.closeDialog} autofocus>
            ${t("mode.close")}
          </button>
        </div>
      </div>
    </div>`;
	}
	renderReadiness(t) {
		let n = this.joe, r = n?.control?.ready ?? {}, i = (n?.config.batteries ?? []).filter((e) => r[e.id] && r[e.id] !== "not_controllable");
		if (!i.length) return o;
		let a = i.filter((e) => r[e.id] !== "ready");
		if (!a.length) return o;
		let s = a.length === i.length ? t("mode.none_tested") : t("mode.untested", { names: a.map((e) => e.name).join(", ") });
		return e`<div class="note warn readiness"><ha-icon icon="mdi:alert-outline"></ha-icon><span>${s}</span></div>`;
	}
	renderEditor(t) {
		let n = this.editor, r = this.joe?.config, i = () => {
			this.editor = void 0;
		}, a = e``, o = "", s = !1;
		switch (n?.editor) {
			case "battery":
				o = t("edit.battery.label"), a = e`<joe-battery-editor
          .hass=${this.hass}
          .t=${t}
          .config=${r}
          .discovery=${this.discovery}
          .info=${this.info}
          .floor=${this.joe?.floors?.[n.id ?? ""]}
          batteryId=${n.id ?? ""}
        ></joe-battery-editor>`;
				break;
			case "tariff":
				o = t("edit.tariff.label"), a = e`<joe-tariff-editor
          .hass=${this.hass}
          .t=${t}
          .config=${r}
          .discovery=${this.discovery}
        ></joe-tariff-editor>`;
				break;
			case "household":
				o = t("edit.household.label"), a = e`<div class="sheet-title">${T(t("edit.household.title"), "h2", y(t, "q_household"))}</div>
          <joe-household .hass=${this.hass} .t=${t} .config=${r} .discovery=${this.discovery}></joe-household>
          <div class="actions">
            <button type="button" class="btn btn-secondary" data-notip @click=${i}>${t("mode.close")}</button>
          </div>`;
				break;
			case "action":
				o = t("action.label"), a = e`<joe-action-editor
          .hass=${this.hass}
          .mailboxes=${this.joe?.mailbox}
          .accounts=${this.joe?.accounts}
          .apps=${this.joe?.apps}
          .t=${t}
          .config=${r}
          .discovery=${this.discovery}
          actionId=${n.id ?? ""}
          section=${n.focus ?? ""}
          consumer=${n.consumer ?? ""}
        ></joe-action-editor>`;
				break;
			case "consumers":
				o = t("edit.consumers.label"), s = !0, a = e`<div class="sheet-title">${T(t("edit.consumers.title"))}</div>
          <joe-consumers .hass=${this.hass} .t=${t} .config=${r}></joe-consumers>
          <div class="actions">
            <button type="button" class="btn btn-secondary" data-notip @click=${i}>${t("mode.close")}</button>
          </div>`;
				break;
			case "week": o = t("week.label"), s = !0, a = e`<joe-week-editor
          .hass=${this.hass}
          .t=${t}
          .config=${r}
          .status=${this.joe?.climate}
          .entityId=${n.id ?? ""}
        ></joe-week-editor>`;
		}
		return e`<joe-sheet
      label=${o}
      closeLabel=${t("common.close")}
      ?wide=${s}
      @joe-close=${i}
      @joe-navigate=${(e) => {
			i(), this.go(e.detail.page);
		}}
    >
      ${a}
    </joe-sheet>`;
	}
	renderPicker(t) {
		let n = this.picker, r = (e) => {
			n?.resolve(e), this.picker = void 0;
		};
		return e`<joe-sheet
      label=${n?.request.heading.replace(/\|/g, "") ?? ""}
      closeLabel=${t("common.close")}
      @joe-close=${() => r(null)}
      @joe-picked=${(e) => r(e.detail)}
    >
      <joe-entity-picker .hass=${this.hass} .t=${t} .request=${n?.request}></joe-entity-picker>
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
			ae,
			d,
			a`
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
C([r({ attribute: !1 })], $.prototype, "hass", void 0), C([r({
	type: Boolean,
	reflect: !0
})], $.prototype, "narrow", void 0), C([r({ attribute: !1 })], $.prototype, "route", void 0), C([c()], $.prototype, "joe", void 0), C([c()], $.prototype, "info", void 0), C([c()], $.prototype, "failed", void 0), C([c()], $.prototype, "modeDialog", void 0), C([c()], $.prototype, "notice", void 0), C([c()], $.prototype, "discovery", void 0), C([c()], $.prototype, "discovering", void 0), C([c()], $.prototype, "discoveryFailed", void 0), C([c()], $.prototype, "checks", void 0), C([c()], $.prototype, "picker", void 0), C([c()], $.prototype, "editor", void 0), S("energy-joe-panel", $);
//#endregion
export { $ as EnergyJoePanel };
