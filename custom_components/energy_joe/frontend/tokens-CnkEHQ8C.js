//#region node_modules/@lit/reactive-element/css-tag.js
var e = globalThis, t = e.ShadowRoot && (e.ShadyCSS === void 0 || e.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, n = Symbol(), r = /* @__PURE__ */ new WeakMap(), i = class {
	constructor(e, t, r) {
		if (this._$cssResult$ = !0, r !== n) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, n = this.t;
		if (t && e === void 0) {
			let t = n !== void 0 && n.length === 1;
			t && (e = r.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), t && r.set(n, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, a = (e) => new i(typeof e == "string" ? e : e + "", void 0, n), o = (e, ...t) => new i(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, n), s = (n, r) => {
	if (t) n.adoptedStyleSheets = r.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let t of r) {
		let r = document.createElement("style"), i = e.litNonce;
		i !== void 0 && r.setAttribute("nonce", i), r.textContent = t.cssText, n.appendChild(r);
	}
}, c = t ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return a(t);
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: f, getOwnPropertySymbols: p, getPrototypeOf: m } = Object, h = globalThis, ee = h.trustedTypes, te = ee ? ee.emptyScript : "", ne = h.reactiveElementPolyfillSupport, g = (e, t) => e, _ = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? te : null;
				break;
			case Object:
			case Array: e = e == null ? e : JSON.stringify(e);
		}
		return e;
	},
	fromAttribute(e, t) {
		let n = e;
		switch (t) {
			case Boolean:
				n = e !== null;
				break;
			case Number:
				n = e === null ? null : Number(e);
				break;
			case Object:
			case Array: try {
				n = JSON.parse(e);
			} catch {
				n = null;
			}
		}
		return n;
	}
}, v = (e, t) => !l(e, t), re = {
	attribute: !0,
	type: String,
	converter: _,
	reflect: !1,
	useDefault: !1,
	hasChanged: v
};
Symbol.metadata ??= Symbol("metadata"), h.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var y = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = re) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && u(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = d(this.prototype, e) ?? {
			get() {
				return this[t];
			},
			set(e) {
				this[t] = e;
			}
		};
		return {
			get: r,
			set(t) {
				let a = r?.call(this);
				i?.call(this, t), this.requestUpdate(e, a, n);
			},
			configurable: !0,
			enumerable: !0
		};
	}
	static getPropertyOptions(e) {
		return this.elementProperties.get(e) ?? re;
	}
	static _$Ei() {
		if (this.hasOwnProperty(g("elementProperties"))) return;
		let e = m(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(g("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(g("properties"))) {
			let e = this.properties, t = [...f(e), ...p(e)];
			for (let n of t) this.createProperty(n, e[n]);
		}
		let e = this[Symbol.metadata];
		if (e !== null) {
			let t = litPropertyMetadata.get(e);
			if (t !== void 0) for (let [e, n] of t) this.elementProperties.set(e, n);
		}
		this._$Eh = /* @__PURE__ */ new Map();
		for (let [e, t] of this.elementProperties) {
			let n = this._$Eu(e, t);
			n !== void 0 && this._$Eh.set(n, e);
		}
		this.elementStyles = this.finalizeStyles(this.styles);
	}
	static finalizeStyles(e) {
		let t = [];
		if (Array.isArray(e)) {
			let n = new Set(e.flat(1 / 0).reverse());
			for (let e of n) t.unshift(c(e));
		} else e !== void 0 && t.push(c(e));
		return t;
	}
	static _$Eu(e, t) {
		let n = t.attribute;
		return !1 === n ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
	}
	constructor() {
		super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
	}
	_$Ev() {
		this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
	}
	addController(e) {
		(this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
	}
	removeController(e) {
		this._$EO?.delete(e);
	}
	_$E_() {
		let e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
		for (let n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
		e.size > 0 && (this._$Ep = e);
	}
	createRenderRoot() {
		let e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
		return s(e, this.constructor.elementStyles), e;
	}
	connectedCallback() {
		this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
	}
	enableUpdating(e) {}
	disconnectedCallback() {
		this._$EO?.forEach((e) => e.hostDisconnected?.());
	}
	attributeChangedCallback(e, t, n) {
		this._$AK(e, n);
	}
	_$ET(e, t) {
		let n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
		if (r !== void 0 && !0 === n.reflect) {
			let i = (n.converter?.toAttribute === void 0 ? _ : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? _ : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? v)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
			this.C(e, t, n);
		}
		!1 === this.isUpdatePending && (this._$ES = this._$EP());
	}
	C(e, t, { useDefault: n, reflect: r, wrapped: i }, a) {
		n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== i || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), !0 === r && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
	}
	async _$EP() {
		this.isUpdatePending = !0;
		try {
			await this._$ES;
		} catch (e) {
			Promise.reject(e);
		}
		let e = this.scheduleUpdate();
		return e != null && await e, !this.isUpdatePending;
	}
	scheduleUpdate() {
		return this.performUpdate();
	}
	performUpdate() {
		if (!this.isUpdatePending) return;
		if (!this.hasUpdated) {
			if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
				for (let [e, t] of this._$Ep) this[e] = t;
				this._$Ep = void 0;
			}
			let e = this.constructor.elementProperties;
			if (e.size > 0) for (let [t, n] of e) {
				let { wrapped: e } = n, r = this[t];
				!0 !== e || this._$AL.has(t) || r === void 0 || this.C(t, void 0, n, r);
			}
		}
		let e = !1, t = this._$AL;
		try {
			e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((e) => e.hostUpdate?.()), this.update(t)) : this._$EM();
		} catch (t) {
			throw e = !1, this._$EM(), t;
		}
		e && this._$AE(t);
	}
	willUpdate(e) {}
	_$AE(e) {
		this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
	}
	_$EM() {
		this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
	}
	get updateComplete() {
		return this.getUpdateComplete();
	}
	getUpdateComplete() {
		return this._$ES;
	}
	shouldUpdate(e) {
		return !0;
	}
	update(e) {
		this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
	}
	updated(e) {}
	firstUpdated(e) {}
};
y.elementStyles = [], y.shadowRootOptions = { mode: "open" }, y[g("elementProperties")] = /* @__PURE__ */ new Map(), y[g("finalized")] = /* @__PURE__ */ new Map(), ne?.({ ReactiveElement: y }), (h.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var b = globalThis, ie = (e) => e, x = b.trustedTypes, ae = x ? x.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, oe = "$lit$", S = `lit$${Math.random().toFixed(9).slice(2)}$`, se = "?" + S, ce = `<${se}>`, C = document, w = () => C.createComment(""), T = (e) => e === null || typeof e != "object" && typeof e != "function", le = Array.isArray, ue = (e) => le(e) || typeof e?.[Symbol.iterator] == "function", E = "[ 	\n\f\r]", D = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, de = /-->/g, fe = />/g, O = RegExp(`>|${E}(?:([^\\s"'>=/]+)(${E}*=${E}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), pe = /'/g, me = /"/g, he = /^(?:script|style|textarea|title)$/i, ge = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), k = ge(1), _e = ge(2), A = Symbol.for("lit-noChange"), j = Symbol.for("lit-nothing"), ve = /* @__PURE__ */ new WeakMap(), M = C.createTreeWalker(C, 129);
function ye(e, t) {
	if (!le(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return ae === void 0 ? t : ae.createHTML(t);
}
var be = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = D;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === D ? c[1] === "!--" ? o = de : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = O) : (he.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = O) : o = fe : o === O ? c[0] === ">" ? (o = i ?? D, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? O : c[3] === "\"" ? me : pe) : o === me || o === pe ? o = O : o === de || o === fe ? o = D : (o = O, i = void 0);
		let d = o === O && e[t + 1].startsWith("/>") ? " " : "";
		a += o === D ? n + ce : l >= 0 ? (r.push(s), n.slice(0, l) + oe + n.slice(l) + S + d) : n + S + (l === -2 ? t : d);
	}
	return [ye(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, N = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = be(t, n);
		if (this.el = e.createElement(l, r), M.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = M.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(oe)) {
					let t = u[o++], n = i.getAttribute(e).split(S), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Se : r[1] === "?" ? Ce : r[1] === "@" ? we : I
					}), i.removeAttribute(e);
				} else e.startsWith(S) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (he.test(i.tagName)) {
					let e = i.textContent.split(S), t = e.length - 1;
					if (t > 0) {
						i.textContent = x ? x.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], w()), M.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], w());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === se) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(S, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += S.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = C.createElement("template");
		return n.innerHTML = e, n;
	}
};
function P(e, t, n = e, r) {
	if (t === A) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = T(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = P(e, i._$AS(e, t.values), i, r)), t;
}
var xe = class {
	constructor(e, t) {
		this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
	}
	get parentNode() {
		return this._$AM.parentNode;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	u(e) {
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? C).importNode(t, !0);
		M.currentNode = r;
		let i = M.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new F(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Te(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = M.nextNode(), a++);
		}
		return M.currentNode = C, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, F = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = j, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
	}
	get parentNode() {
		let e = this._$AA.parentNode, t = this._$AM;
		return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
	}
	get startNode() {
		return this._$AA;
	}
	get endNode() {
		return this._$AB;
	}
	_$AI(e, t = this) {
		e = P(this, e, t), T(e) ? e === j || e == null || e === "" ? (this._$AH !== j && this._$AR(), this._$AH = j) : e !== this._$AH && e !== A && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? ue(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== j && T(this._$AH) ? this._$AA.nextSibling.data = e : this.T(C.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = N.createElement(ye(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new xe(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = ve.get(e.strings);
		return t === void 0 && ve.set(e.strings, t = new N(e)), t;
	}
	k(t) {
		le(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(w()), this.O(w()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = ie(e).nextSibling;
			ie(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, I = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = j, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = j;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = P(this, e, t, 0), a = !T(e) || e !== this._$AH && e !== A, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = P(this, r[n + o], t, o), s === A && (s = this._$AH[o]), a ||= !T(s) || s !== this._$AH[o], s === j ? e = j : e !== j && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === j ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Se = class extends I {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === j ? void 0 : e;
	}
}, Ce = class extends I {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== j);
	}
}, we = class extends I {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = P(this, e, t, 0) ?? j) === A) return;
		let n = this._$AH, r = e === j && n !== j || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== j && (n === j || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, Te = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		P(this, e);
	}
}, Ee = b.litHtmlPolyfillSupport;
Ee?.(N, F), (b.litHtmlVersions ??= []).push("3.3.3");
var De = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new F(t.insertBefore(w(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, L = globalThis, R = class extends y {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = De(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return A;
	}
};
R._$litElement$ = !0, R.finalized = !0, L.litElementHydrateSupport?.({ LitElement: R });
var Oe = L.litElementPolyfillSupport;
Oe?.({ LitElement: R }), (L.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@lit/reactive-element/decorators/property.js
var ke = {
	attribute: !0,
	type: String,
	converter: _,
	reflect: !1,
	hasChanged: v
}, Ae = (e = ke, t, n) => {
	let { kind: r, metadata: i } = n, a = globalThis.litPropertyMetadata.get(i);
	if (a === void 0 && globalThis.litPropertyMetadata.set(i, a = /* @__PURE__ */ new Map()), r === "setter" && ((e = Object.create(e)).wrapped = !0), a.set(n.name, e), r === "accessor") {
		let { name: r } = n;
		return {
			set(n) {
				let i = t.get.call(this);
				t.set.call(this, n), this.requestUpdate(r, i, e, !0, n);
			},
			init(t) {
				return t !== void 0 && this.C(r, void 0, e, t), t;
			}
		};
	}
	if (r === "setter") {
		let { name: r } = n;
		return function(n) {
			let i = this[r];
			t.call(this, n), this.requestUpdate(r, i, e, !0, n);
		};
	}
	throw Error("Unsupported decorator location: " + r);
};
function z(e) {
	return (t, n) => typeof n == "object" ? Ae(e, t, n) : ((e, t, n) => {
		let r = t.hasOwnProperty(n);
		return t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0;
	})(e, t, n);
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/state.js
function B(e) {
	return z({
		...e,
		state: !0,
		attribute: !1
	});
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/base.js
var je = (e, t, n) => (n.configurable = !0, n.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, n), n);
//#endregion
//#region node_modules/@lit/reactive-element/decorators/query.js
function V(e, t) {
	return (n, r, i) => {
		let a = (t) => t.renderRoot?.querySelector(e) ?? null;
		if (t) {
			let { get: e, set: t } = typeof r == "object" ? n : i ?? (() => {
				let e = Symbol();
				return {
					get() {
						return this[e];
					},
					set(t) {
						this[e] = t;
					}
				};
			})();
			return je(n, r, { get() {
				let n = e.call(this);
				return n === void 0 && (n = a(this), (n !== null || this.hasUpdated) && t.call(this, n)), n;
			} });
		}
		return je(n, r, { get() {
			return a(this);
		} });
	};
}
//#endregion
//#region src/i18n/de.ts
var Me = {
	"tab.overview": "Übersicht",
	"tab.plan": "Plan",
	"tab.history": "Historie",
	"tab.learn": "Lernen",
	"tab.devices": "Geräte",
	"tab.climate": "Klima",
	"climate.title": "Heizung & Klima",
	"climate.lead": "Ist keiner da, drehe ich Heizung und Klimaanlage herunter – und rechtzeitig wieder hoch, wenn jemand heimkommt. Du entscheidest für jedes Gerät einzeln.",
	"climate.enabled": "Joe steuert Heizung und Klima",
	"climate.live": "Ich steuere die Geräte, die du unten einschaltest.",
	"climate.not_live": "Steuern tue ich erst im Modus „Live“ – bis dahin zeige ich bei jedem Gerät nur, was ich täte.",
	"climate.presence": "Wer ist da?",
	"climate.home": "Zu Hause: {names}",
	"climate.nobody": "Gerade ist niemand zu Hause.",
	"climate.way.towards": "{name} ist {km} km weg und kommt näher.",
	"climate.way.away": "{name} ist {km} km weg und entfernt sich.",
	"climate.way.other": "{name} ist {km} km weg.",
	"climate.no_proximity": "Damit ich rechtzeitig vorheize, wenn jemand heimkommt, brauche ich die Integration „Nähe“ (Proximity) für eure Personen.",
	"climate.add_proximity": "Nähe einrichten",
	"climate.free_day": "Heute ist ein freier Tag.",
	"climate.failed": "Die Geräte konnte ich gerade nicht laden.",
	"climate.none": "Ich habe keine Thermostate oder Klimaanlagen in Home Assistant gefunden.",
	"climate.no_area": "Ohne Raum",
	"climate.room.enabled": "Joe steuert {name}",
	"climate.room.off": "Steuere ich nicht.",
	"climate.meter": "Messgerät",
	"climate.meter.pick": "Messgerät für {name} wählen",
	"climate.meter.choose": "Messgerät wählen",
	"climate.meter.other_devices": "Weitere Geräte",
	"climate.meter.none": "Hat keins",
	"climate.meter.cancel": "Abbrechen",
	"climate.meter.no_meters": "Joe findet kein Gerät mit Leistungs- oder Energiesensor.",
	"climate.meter.has_none": "Kein Messgerät – du hast festgelegt, dass dieses Gerät keins hat.",
	"climate.meter.not_found": "Joe hat kein passendes Messgerät gefunden.",
	"climate.meter.linked": "gekoppelt",
	"climate.meter.suggested": "Vorschlag",
	"climate.meter.power": "Leistung {value}",
	"climate.meter.energy": "Zähler {value}",
	"climate.meter.shared": "Gemeinsam mit {names}",
	"climate.meter.shared_hint": "Diese Geräte hängen am selben Messgerät. Die Messung gilt für alle zusammen.",
	"climate.meter.other": "Anderes Messgerät",
	"climate.meter.why": "Ähnlicher Name oder gleicher Raum. Passt das?",
	"climate.meter.fits": "Passt",
	"tip.climate_meter.title": "Was misst dieses Gerät?",
	"tip.climate_meter.text": "Hier koppelst du das Klimagerät mit dem Gerät, das seine Leistung und Energie misst – z. B. einem Kanal eines Shelly Pro 3EM („verbunden über …“). Joe schlägt eines vor, wenn Name oder Raum passen: „Passt“ übernimmt es, „Anderes Messgerät“ öffnet die Liste, „Hat keins“ sagt Joe, dass es keine Messung gibt.",
	"tip.climate_meter.hint": "Mehrere Klimageräte dürfen sich ein Messgerät teilen – dann gilt die Messung für alle zusammen.",
	"climate.away": "Wenn keiner da ist",
	"climate.away.setback": "Absenken",
	"climate.away.off": "Aus",
	"climate.away.preset": "Profil",
	"climate.setback.heat": "Um so viel kühler",
	"climate.setback.cool": "Um so viel wärmer",
	"climate.away_preset": "Profil bei Abwesenheit",
	"climate.free_day_preset": "Profil an freien Tagen",
	"climate.no_preset": "keins – wie eingestellt",
	"climate.pick_preset": "Profil wählen",
	"climate.night_off": "Nachts aus",
	"climate.night_span": "Aus von – bis",
	"climate.night_from": "Aus ab",
	"climate.night_until": "Wieder angenehm bis",
	"climate.now.home": "Jetzt: wie eingestellt – jemand ist da.",
	"climate.now.away": "Jetzt: Abwesenheit.",
	"climate.now.arriving": "Jetzt: jemand kommt heim – ich fahre schon hoch.",
	"climate.now.free_day": "Jetzt: freier Tag.",
	"climate.now.night": "Jetzt: Nachtruhe.",
	"climate.rate": "Erreicht etwa {rate} °C pro Stunde (gelernt).",
	"climate.rate_default": "Wie schnell der Raum warm oder kühl wird, lerne ich noch.",
	"tip.climate_enabled.title": "Was macht Joe hier?",
	"tip.climate_enabled.text": "Ich schaue, wer zu Hause ist (die Personen aus Home Assistant). Ist keiner da, stelle ich die Geräte, die du einschaltest, wie gewählt ein – absenken, aus oder ein Profil. Kommt jemand heim, stelle ich alles genau so zurück, wie es vorher war.",
	"tip.climate_enabled.hint": "Wie überall: In der Simulation schalte ich nichts, sondern zeige nur, was ich täte.",
	"tip.climate_presence.title": "Woher weiß Joe, wer kommt?",
	"tip.climate_presence.text": "Wer zu Hause ist, sehe ich an den Personen in Home Assistant. Wer heimkommt, sehe ich an der Integration „Nähe“ (Proximity): Sie meldet Entfernung und Richtung. Ich rechne mit 40 km/h und fange so früh an, dass der Raum rechtzeitig wieder angenehm ist.",
	"tip.climate_room.title": "Dieses Gerät steuern?",
	"tip.climate_room.text": "Nur Geräte mit eingeschaltetem Schalter fasse ich an. So kannst du zum Beispiel das Bad oder das Kinderzimmer auslassen.",
	"tip.climate_away.title": "Was passiert, wenn keiner da ist?",
	"tip.climate_away.text": "**Absenken**: um die eingestellten Grad kühler (bei einer kühlenden Klimaanlage wärmer).\n**Aus**: das Gerät ganz aus.\n**Profil**: ein Profil des Geräts, z. B. bei Homematic IP ein Heizprofil „Abwesend“ in der Heizgruppe.",
	"tip.climate_away.hint": "Am besten legst du bei Homematic IP eigene Profile an – dann gelten deine Zeiten und Temperaturen.",
	"tip.climate_free_day.title": "Freie Tage?",
	"tip.climate_free_day.text": "An Wochenenden und Feiertagen (laut deinem Arbeitstag-Sensor) schalte ich auf dieses Profil, solange jemand zu Hause ist – z. B. ein Homematic-IP-Profil „Feiertag“ mit späterem Aufheizen.",
	"tip.climate_night.title": "Nachts aus?",
	"tip.climate_night.text": "Die Klimaanlage geht zur ersten Zeit aus und so früh wieder an, dass es zur zweiten Zeit wieder angenehm ist. Wie lange sie dafür braucht, lerne ich mit der Zeit.",
	"tab.settings": "Einstellungen",
	"nav.label": "Bereiche",
	"mode.simulation": "Simulation",
	"mode.simulation.sub": "Joe schaut nur zu und lernt",
	"mode.simulation.desc": "Ich plane und lerne, schalte aber nichts.",
	"mode.live": "Live",
	"mode.live.sub": "Joe steuert selbst",
	"mode.live.desc": "Ich steuere jede Nacht selbst – nur Speicher mit bestandenem Testlauf – und stelle am Ende alles zurück.",
	"mode.off": "Aus",
	"mode.off.sub": "Joe macht Pause",
	"mode.off.desc": "Ich mache Pause, bis du mich wieder startest.",
	"mode.switch.label": "Betriebsart ändern",
	"mode.dialog.title": "Wie soll Joe |arbeiten?",
	"mode.current": "läuft",
	"mode.soon": "kommt bald",
	"mode.close": "Fertig",
	"step.welcome": "Hallo",
	"step.scan": "Umschauen",
	"step.questions": "Fragen",
	"step.done": "Los",
	"steps.label": "Einrichtung",
	"onb.welcome.title": "Howdy!|Ich bin |Joe.",
	"onb.welcome.lead": "Ich schiebe deinen Stromverbrauch in die günstigen Stunden – Hausspeicher, E-Auto, Warmwasser. Und ich lerne jeden Tag dazu, wie dein Haus tickt.",
	"onb.calm": "Erstmal schau ich nur zu. Ich steuere nichts, bis du es sagst.",
	"onb.welcome.go": "Schau dich um",
	"onb.welcome.more": "Was macht Joe genau?",
	"onb.welcome.more.text": "Jede Nacht rechne ich aus, wie viel deine Speicher aus dem günstigen Netz brauchen, damit sie bis zur Sonne reichen – nicht mehr und nicht weniger. Mit einem Börsenpreis-Tarif lade ich in den günstigsten Viertelstunden.\nReicht die Sonne morgen nicht, schicke ich auch das E-Auto und das Warmwasser in die günstige Zeit – das Auto zum Beispiel über evcc, das Warmwasser bis zu einer Temperatur, die für den Tag reicht. Dabei achte ich auf dein Netzlimit.\nTagsüber schaue ich, wie gut ich lag, und lerne dazu: wie viel ihr bei Kälte braucht, wer laut Kalender zu Hause ist und wie gut die Prognose trifft.",
	"onb.scan.title": "Ich schau |mich um",
	"onb.scan.lead": "Gleich zeige ich dir, was ich in deinem Home Assistant gefunden habe – Speicher, Solaranlage, Tarif und mehr. Du bestätigst nur noch.",
	"onb.scan.energy": "Dein Energie-Dashboard habe ich schon entdeckt:",
	"onb.scan.energy.none": "Ein Energie-Dashboard habe ich nicht gefunden. Kein Problem – ich suche auch so nach deinen Geräten.",
	"scan.looking": "Ich schau mich um …",
	"scan.title": "Das hab ich |gefunden",
	"scan.lead": "Das nehme ich ab jetzt. Passt etwas nicht, ändere es oder lass es weg – was du einstellst, überschreibe ich nie.",
	"scan.again": "Nochmal suchen",
	"scan.why": "Warum?",
	"scan.failed": "Beim Umschauen ist etwas schiefgegangen. Versuch es nochmal.",
	"scan.notes": "Was mir aufgefallen ist",
	"find.energy": "Energie-Dashboard",
	"find.energy.detail": "{grid} · {solar} · {battery} · {devices}",
	"word.grid": "Netz|Netze",
	"word.solar": "PV-Anlage|PV-Anlagen",
	"word.battery": "Speicher|Speicher",
	"word.device": "Gerät|Geräte",
	"word.plane": "Fläche|Flächen",
	"word.sensor": "Sensor|Sensoren",
	"word.person": "Person|Personen",
	"word.calendar": "Kalender|Kalender",
	"find.battery.control": "kann ich steuern",
	"find.battery.read": "nur lesen",
	"find.tariff": "Stromtarif",
	"find.tariff.window": "günstig {start}–{end} Uhr: {night} ct · sonst {day} ct",
	"find.tariff.dynamic": "dynamischer Preis, heute {night}–{day} ct",
	"find.tariff.flat": "fester Preis {day} ct",
	"find.tariff.unknown": "Tarif nicht erkannt – frag ich dich gleich",
	"find.tariff.feedin": "Einspeisung {price} ct",
	"find.forecast": "Solarprognose",
	"find.forecast.detail": "{provider} · {planes} · heute {today} kWh · morgen {tomorrow} kWh",
	"find.grid": "Netz",
	"find.home": "Hausverbrauch",
	"find.solar": "PV-Leistung",
	"find.solar.detail": "{count} · zusammen {total} kW",
	"find.car": "Auto",
	"find.wallbox": "Wallbox",
	"find.weather": "Wetter",
	"find.holiday": "Feiertage",
	"find.people": "Haushalt",
	"find.people.detail": "{persons} · {calendars}",
	"find.devices": "Geräte",
	"find.devices.detail": "{count} aus dem Energie-Dashboard, davon {heating} zum Heizen oder Kühlen",
	"find.none": "nicht gefunden",
	"conf.4": "sehr sicher",
	"conf.3": "ziemlich sicher",
	"conf.2": "eher unsicher",
	"conf.1": "nur geraten",
	"reason.energy_dashboard": "steht so im Energie-Dashboard",
	"reason.integration_key": "bekannter Wert der Integration {integration}",
	"reason.capacity_read": "Größe vom Gerät gelesen",
	"reason.controls_found": "{count} Steuerfunktionen gefunden",
	"reason.house_meter": "misst {children} andere Geräte mit",
	"reason.name": "Name enthält „{word}“",
	"reason.storage_name": "Gerät klingt nach Speicher („{word}“)",
	"reason.power_guess": "Leistung am selben Gerät",
	"reason.timeslots": "Zeitfenster aus dem Tarif gelesen",
	"reason.price_list": "Preisliste gelesen",
	"reason.price_only": "nur der aktuelle Preis bekannt",
	"reason.dynamic_provider": "Preise kommen von {integration}",
	"reason.forecast_support": "mit stündlicher Vorhersage",
	"reason.name_match": "Kalender passt zum Namen",
	"reason.submeter": "andere Geräte hängen dahinter",
	"check.missing": "{role} habe ich nicht gefunden – frag ich dich gleich.",
	"check.unavailable": "{role} liefert gerade keinen Wert.",
	"check.unit": "{role} misst in {unit} – ich erwarte W oder kW.",
	"check.stale": "{role} hat sich seit {hours} Stunden nicht gemeldet.",
	"check.home_negative": "Der Hausverbrauch ist negativ – ich drehe das Vorzeichen für mich um.",
	"check.grid_sign.export": "Nach Sonne und Verbrauch müsstest du gerade etwa {expected} kW einspeisen, der Sensor zeigt aber {actual} kW Bezug. Zählt er andersherum?",
	"check.grid_sign.import": "Nach Sonne und Verbrauch müsstest du gerade etwa {expected} kW beziehen, der Sensor zeigt aber {actual} kW Einspeisung. Zählt er andersherum?",
	"check.soc_range": "Ein Ladezustand von {value} % kann nicht stimmen.",
	"check.soc_unavailable": "Der Ladezustand liefert gerade keinen Wert.",
	"check.capacity_unknown": "Die Größe kenne ich nicht – frag ich dich gleich oder lerne sie.",
	"check.not_controllable": "Den kann ich beobachten, aber nicht steuern.",
	"check.tariff_unknown": "Den Tarif habe ich nicht erkannt – frag ich dich gleich.",
	"role.grid_power": "Netzleistung",
	"role.home_power": "Hausverbrauch",
	"role.solar_power": "PV-Leistung",
	"onb.questions.title": "Ein paar |Fragen",
	"onb.questions.lead": "Was ich nicht selbst herausfinde, frage ich dich – mit Antworten zum Antippen und immer mit „Weiß ich nicht“.",
	"onb.done.title": "Alles klar, |Partner.",
	"onb.done.lead": "Ich plane ab heute jede Nacht, steuere aber nichts. Nach einer Woche zeige ich dir, was es gebracht hätte.",
	"onb.done.go": "Joe starten",
	"onb.done.change": "Noch was ändern",
	"onb.nav": "Einrichtung: zurück oder weiter",
	"onb.next": "Weiter",
	"onb.back": "Zurück",
	soon: "Kommt im nächsten Update",
	"energy.grid": "Netz",
	"energy.solar": "PV-Anlagen",
	"energy.battery": "Speicher",
	"energy.devices": "Geräte",
	"energy.read": "gelesen",
	"overview.night": "Heute Nacht",
	"overview.night.empty.title": "Noch kein |Plan",
	"overview.night.empty.text": "Sobald ich deine Speicher und deinen Tarif kenne, rechne ich hier jede Nacht aus, wie viel ich lade – und warum.",
	"overview.sim": "Simulation",
	"overview.sim.empty.title": "Ich schau |erstmal zu",
	"overview.sim.empty.text": "Nach der ersten Nacht zeige ich dir hier, was es gebracht hätte, wenn ich gesteuert hätte.",
	"overview.next": "So geht's weiter",
	"overview.next.1.title": "Alles eingerichtet",
	"overview.next.1.text": "Speicher, Tarif und Prognose kenne ich. Ändern kannst du alles in den Einstellungen.",
	"overview.next.2.title": "Ich beobachte",
	"overview.next.2.text": "Jede Stunde schreibe ich auf, was passiert – und lese die letzten Wochen aus deinem Home Assistant.",
	"overview.next.3.title": "Ich plane jede Nacht",
	"overview.next.3.text": "Wie weit ich laden würde – als Simulation, ohne etwas zu schalten.",
	"overview.next.4.title": "Was es gebracht hätte",
	"overview.next.4.text": "Plan gegen Wirklichkeit – Tag für Tag, in Euro.",
	"status.done": "erledigt",
	"plan.day": "Netzdienlich: Bis {time} Uhr geht die Morgensonne ins Netz (etwa {kwh} kWh), dann lädt der Speicher in der Mittagsspitze.",
	"plan.day.cost": "Kostet etwa {cost}.",
	"plan.title": "Hier |rechne ich",
	"history.title": "Jeder Tag |unter der Lupe",
	"devices.title": "Deine |Geräte",
	"devices.text": "Speicher, Wallbox und Warmwasser – mit Zustand, Testlauf und dem, was ich mit ihnen vorhabe.",
	"settings.operation": "Betrieb",
	"settings.mode": "Betriebsart",
	"settings.mode.hint": "Simulation plant und lernt, ohne etwas zu schalten. Vorschlagen fragt jeden Abend, Live steuert selbst.",
	"settings.live.unavailable": "Live kommt, sobald Joe steuern kann.",
	"settings.setup": "Einrichtung",
	"settings.setup.hint": "Den Assistenten noch einmal von vorn durchgehen.",
	"settings.setup.restart": "Neu starten",
	"settings.about": "Über Joe",
	"settings.version": "Version",
	"settings.ha": "Home Assistant",
	"settings.energy": "Energie-Dashboard",
	"settings.energy.none": "nicht eingerichtet",
	"tip.label": "Erklärung",
	"tip.hint": "Tipp",
	"tip.source": "Woher",
	"tip.mode.title": "Was soll Joe tun?",
	"tip.mode.text": "**Simulation** – Ich plane und lerne wie im Ernstfall, schalte aber nichts. Du siehst, was ich getan hätte und was es gebracht hätte.\n**Vorschlagen** – Ich frage dich jeden Abend, ob ich die Nacht steuern darf. Ohne dein Ja schalte ich nichts.\n**Live** – Ich steuere jede Nacht selbst – nur Speicher mit bestandenem Testlauf – und stelle am Ende alles zurück.\n**Aus** – Ich mache Pause: kein Planen, kein Lernen, kein Schalten. Was ich schon weiß, bleibt.",
	"tip.mode.hint": "Lass mich ein paar Wochen simulieren. Dann siehst du schwarz auf weiß, ob sich Live lohnt.",
	"tip.restart.title": "Was passiert beim Neustart?",
	"tip.restart.text": "Wir gehen die Einrichtung noch einmal zusammen durch, und ich schaue mich dabei neu um. Was du selbst eingestellt hast, bleibt – ich schlage nur Neues vor.",
	"tip.scan_start.title": "Was passiert jetzt?",
	"tip.scan_start.text": "Ich schaue nach, welche Speicher, Zähler, Tarife und Prognosen es in deinem Home Assistant gibt. Ich lese nur – ändern tue ich dort nichts.",
	"tip.rescan.title": "Warum nochmal suchen?",
	"tip.rescan.text": "Ich schaue mich noch einmal um – praktisch, wenn du gerade etwas in Home Assistant eingerichtet hast. Auch dabei lese ich nur.",
	"tip.start.title": "Was passiert, wenn ich Joe starte?",
	"tip.start.text": "Ich plane ab heute jede Nacht – als Simulation, also ohne etwas zu schalten. Alles, was du eingegeben hast, kannst du jederzeit in den Einstellungen ändern.",
	"tip.start.hint": "Live schaltest du später selbst, wenn du gesehen hast, was ich kann.",
	"common.save": "Speichern",
	"common.cancel": "Abbrechen",
	"common.close": "Schließen",
	"source.read": "gelesen",
	"source.learned": "gelernt",
	"source.user": "von dir",
	"source.default": "Startwert",
	"live.import": "{value} kW Bezug",
	"live.export": "{value} kW Einspeisung",
	"live.kw": "{value} kW",
	"tariff.window_only": "günstig {start}–{end} Uhr",
	"tariff.dynamic": "dynamischer Preis",
	"tariff.flat": "fester Preis",
	"tariff.kind.fixed_window": "Nachts günstiger",
	"tariff.kind.flat": "Immer gleicher Preis",
	"tariff.kind.dynamic": "Börsenpreis, wechselt über den Tag",
	"review.change": "Ändern",
	"review.choose": "Auswählen",
	"review.enter": "Eintragen",
	"review.ignore": "Weglassen",
	"review.use": "Doch verwenden",
	"review.add": "Hinzufügen",
	"review.assign": "Zuordnen",
	"review.invert": "Umdrehen",
	"review.keep": "Stimmt so",
	"review.ignored": "lasse ich weg",
	"review.ask_later": "frag ich dich gleich",
	"review.used": "genutzt",
	"review.unused": "noch nicht genutzt",
	"review.wallbox.used": "für die Nacht-Aktion „E-Auto laden“",
	"review.wallbox.unused": "für eine Nacht-Aktion – einrichten unter Geräte → „E-Auto laden“",
	"review.car.used": "für Laden nach Bedarf",
	"review.car.unused": "für Laden nach Bedarf – einschalten unter Geräte → E-Auto → „Laden nach Bedarf“",
	"review.capacity_unknown": "Größe unbekannt",
	"review.battery": "Speicher",
	"review.battery.none": "Keinen Speicher gefunden. Hast du einen, such ihn dir aus.",
	"review.battery.more": "Weiterer Speicher",
	"review.battery.more_detail": "Fehlt einer? Such ihn dir aus.",
	"review.tariff.ask": "Den Tarif frag ich dich gleich – oder trag ihn jetzt ein.",
	"review.forecast.none": "Ohne Solarprognose plane ich vorsichtig. Richte in Home Assistant zum Beispiel Forecast.Solar ein, dann such ich nochmal.",
	"review.grid.none": "Ohne Netzzähler sehe ich nicht, was wirklich passiert. Such dir den Sensor aus, der die Leistung am Hausanschluss misst.",
	"review.home.balance": "Wie im Energie-Dashboard: Netz + PV ± Speicher",
	"review.home.compare": "Zum Vergleich: {name} · {live}",
	"review.home.flexible": "Für den Speicher rechne ich heraus: {names}. Das Auto lade ich nie aus dem Hausspeicher.",
	"review.home.flexible_some": "Für den Speicher rechne ich heraus: {names}.",
	"review.home.flexible_none": "Laufen bei dir Geräte nur mit Sonnenüberschuss oder günstigem Strom? Sag es mir bei den Geräten – dann plane ich den Speicher ohne sie.",
	"review.home.off": "Dein Sensor zeigt in den letzten {days} Tagen {pct} % {direction} als Netz + PV ± Speicher. Fehlt darin vielleicht eine kleine PV-Anlage? Ich rechne mit Netz + PV ± Speicher.",
	"review.home.less": "weniger",
	"review.home.more": "mehr",
	"review.home.devices": "Geräte zuordnen",
	"review.home.none": "Kennst du keinen? Kein Problem – dann rechne ich den Hausverbrauch aus Netz, PV und Speicher selbst aus.",
	"review.home.without": "Hab ich nicht",
	"review.home.computed": "rechne ich aus Netz, PV und Speicher aus",
	"review.solar.none": "Hab keine PV",
	"review.solar.without": "keine PV-Anlage",
	"review.weather.none": "Mit einer Wettervorhersage lerne ich, wie die Außentemperatur deinen Verbrauch ändert.",
	"review.holiday.none": "Tipp: Die Integration „Arbeitstag“ (Workday) sagt mir, wann Wochenende oder Feiertag ist.",
	"pick.search": "Suchen – Name, Raum oder Gerät",
	"pick.suggested": "Joe schlägt vor",
	"pick.fitting": "Passende",
	"pick.all": "Alle Entitäten",
	"pick.empty": "Hier passt nichts. Schalte unten „Alle zeigen“ ein oder such nach einem anderen Wort.",
	"pick.more": "{count} weitere zeigen",
	"pick.show_all": "Alle zeigen",
	"pick.apply": "Übernehmen",
	"pick.invert": "Andersherum zählen",
	"pick.preview.import": "Ich lese gerade: {value} kW Bezug aus dem Netz",
	"pick.preview.export": "Ich lese gerade: {value} kW Einspeisung ins Netz",
	"pick.preview.home": "Ich lese gerade: {value} kW Hausverbrauch",
	"pick.preview.solar": "Ich lese gerade: {value} kW Erzeugung",
	"pick.preview.negative": "Ich lese gerade: {value} kW – das kann nicht negativ sein. Andersherum zählen?",
	"pick.preview.charge": "{value} kW Laden",
	"pick.preview.discharge": "{value} kW Entladen",
	"pick.grid.title": "Welcher Sensor misst |dein Netz?",
	"pick.home.title": "Welcher Sensor misst |deinen Verbrauch?",
	"pick.solar.title": "Welche Sensoren messen |deine PV?",
	"pick.battery.title": "Welcher Sensor zeigt |den Ladezustand?",
	"pick.battery_power.title": "Welcher Sensor misst |die Speicherleistung?",
	"pick.price.title": "Welcher Sensor kennt |den Strompreis?",
	"pick.weather.title": "Welches |Wetter?",
	"pick.holiday.title": "Welcher Sensor kennt |die Feiertage?",
	"pick.person.title": "Wer |fehlt noch?",
	"pick.calendar.title": "Welche Kalender |hat {name}?",
	"ask.count": "Frage {n} von {total}:",
	"ask.topics": "Fragen – zum Springen antippen",
	"ask.topic.tariff": "Tarif",
	"ask.topic.feed_in": "Einspeisung",
	"ask.topic.capacity": "Speicher",
	"ask.topic.heating": "Heizen",
	"ask.topic.hot_water": "Warmwasser",
	"ask.topic.ev": "E-Auto",
	"ask.topic.household": "Haushalt",
	"ask.finish": "Fertig",
	"ask.idk": "Weiß ich nicht",
	"ask.idk_learn": "Weiß ich nicht – lern es",
	"q.tariff.title": "Wie bezahlst du |deinen Strom?",
	"q.feed_in.title": "Was bekommst du |fürs Einspeisen?",
	"q.feed_in.none": "Bekomme nichts",
	"q.capacity.title": "Wie viel passt in |{name}?",
	"q.heating.title": "Heizt ihr auch |mit Strom?",
	"q.heating.climate": "Klimageräte",
	"q.heating.heat_pump": "Wärmepumpe",
	"q.heating.electric": "Heizstab, Infrarot, Nachtspeicher",
	"q.heating.none": "Nein",
	"q.heating.devices": "Diese Geräte gehören dazu:",
	"q.heating.no_devices": "Im Energie-Dashboard habe ich dazu noch kein Gerät erkannt.",
	"q.heating.assign": "Geräte zuordnen",
	"q.hot_water.title": "Wie wird euer |Wasser warm?",
	"q.hot_water.heat_pump": "Warmwasser-Wärmepumpe",
	"q.hot_water.electric": "Heizstab oder Durchlauferhitzer",
	"q.hot_water.heating": "Über die Heizung",
	"q.hot_water.other": "Gas, Öl oder Fernwärme",
	"q.hot_water.devices": "Diesen Zähler habe ich dafür im Energie-Dashboard gefunden:",
	"q.hot_water.no_devices": "Im Energie-Dashboard habe ich dafür keinen eigenen Zähler gefunden – das geht auch ohne.",
	"q.hot_water.offer": "Soll ich das Warmwasser in die günstige Zeit legen, wenn morgen die Sonne nicht reicht? Dazu brauche ich, was die Pumpe oder den Heizstab schaltet, und einen Temperaturfühler im Speicher – ich schlage dir passende vor.",
	"q.hot_water.has_action": "Das Warmwasser steuere ich mit „{name}“.",
	"q.hot_water.set_up": "Warmwasser-Steuerung einrichten",
	"q.hot_water.edit": "Ansehen oder ändern",
	"q.ev.title": "Lädt bei euch |ein E-Auto?",
	"q.ev.yes": "Ja",
	"q.ev.yes_wallbox": "Ja, an {name}",
	"q.ev.no": "Nein",
	"q.household.title": "Wer |wohnt hier?",
	"f.unknown": "weiß ich nicht",
	"f.tariff.kind": "Art des Tarifs",
	"f.window": "Günstige Zeit",
	"f.window.start": "Beginn der günstigen Zeit",
	"f.window.end": "Ende der günstigen Zeit",
	"f.window.until": "bis",
	"f.prices": "Preise",
	"f.price": "Preis",
	"f.price.night": "In der günstigen Zeit",
	"f.price.day": "Sonst",
	"f.price.unknown": "",
	"f.price_entity": "Preis-Sensor",
	"f.price_entity.none": "Noch keiner ausgewählt",
	"f.search": "Suchzeitraum",
	"f.search.start": "Suche ab",
	"f.search.end": "Suche bis",
	"f.surcharge": "Aufschlag auf den Börsenpreis",
	"f.feed_in": "Einspeisevergütung",
	"f.feed_in.entity": "Lese ich aus „{name}“.",
	"f.battery.name": "Name",
	"f.battery.capacity": "Größe",
	"f.battery.capacity.read": "Das Gerät meldet {value} kWh. Stimmt das nicht, trag die nutzbare Größe ein.",
	"f.battery.soc": "Ladezustand",
	"f.battery.power": "Leistung",
	"f.battery.limits": "Höchstleistung",
	"f.battery.max_charge": "Laden",
	"f.battery.max_discharge": "Entladen",
	"f.battery.priority": "Reihenfolge",
	"f.battery.control": "Steuern",
	"f.battery.control.allow": "Joe darf diesen Speicher steuern",
	"f.battery.control.found": "{count} Steuerfunktionen gefunden. Geschaltet wird erst im Live-Betrieb.",
	"f.battery.control.none": "Diesen Speicher kann ich nur beobachten – für ihn kenne ich noch keine Steuerung.",
	"edit.battery.label": "Speicher bearbeiten",
	"edit.battery.title": "Speicher |einstellen",
	"edit.tariff.label": "Tarif bearbeiten",
	"edit.tariff.title": "Dein |Stromtarif",
	"edit.household.label": "Haushalt bearbeiten",
	"edit.household.title": "Wer |wohnt hier?",
	"edit.consumers.label": "Geräte zuordnen",
	"edit.consumers.title": "Deine |Geräte",
	"household.empty": "Noch niemand. Füg die Leute hinzu, die hier wohnen.",
	"household.add": "Person hinzufügen",
	"household.remove": "Wohnt nicht hier",
	"household.left_out": "Weggelassen:",
	"household.home": "gerade zu Hause",
	"household.away": "gerade unterwegs",
	"household.zone": "gerade: {zone}",
	"household.no_presence": "ohne Anwesenheit",
	"household.calendars": "Kalender",
	"household.calendar_add": "Kalender",
	"household.calendar_remove": "Kalender {name} entfernen",
	"consumers.runs": "Wann läuft es?",
	"consumers.runs_of": "Wann {name} läuft",
	"runs.auto": "Wenn es gebraucht wird",
	"runs.ev.auto": "Nie aus dem Hausspeicher",
	"runs.ev.always": "Auch aus dem Hausspeicher",
	"runs.surplus": "Nur mit Sonnenüberschuss",
	"runs.cheap": "Nur mit günstigem Strom",
	"consumers.kind": "Was ist das für ein Gerät?",
	"consumers.kind_of": "Art von {name}",
	"consumers.empty": "Im Energie-Dashboard sind keine einzelnen Geräte eingetragen.",
	"kind.climate": "Klimagerät",
	"kind.heat_pump": "Wärmepumpe (Heizung)",
	"kind.electric_heating": "Elektroheizung",
	"kind.hot_water": "Warmwasser",
	"kind.ev": "E-Auto oder Wallbox",
	"kind.comfort": "Pool, Sauna, Whirlpool",
	"kind.household": "Haushaltsgerät",
	"kind.submeter": "Zähler für andere Geräte",
	"kind.other": "Sonstiges",
	"sum.batteries": "Speicher",
	"sum.batteries.value": "{count} · {kwh} kWh",
	"sum.tariff": "Strompreis",
	"sum.feed_in": "Einspeisung",
	"sum.forecast": "Solarprognose",
	"sum.forecast.value": "{provider} · {planes}",
	"sum.heating": "Heizen mit Strom",
	"sum.hot_water": "Warmwasser",
	"sum.ev": "E-Auto",
	"sum.household": "Haushalt",
	"sum.household.value": "{persons} · {calendars}",
	"sum.none": "keine",
	"sum.unknown": "weiß ich nicht",
	"sum.open": "noch offen",
	"sum.from_sensor": "vom Sensor",
	"settings.uses": "Was Joe nutzt",
	"settings.uses.intro": "Das habe ich gefunden oder du hast es mir gesagt. Ändern, weglassen, dazunehmen – alles hier.",
	"settings.answers": "Deine Antworten",
	"settings.answer.heating": "Heizen mit Strom",
	"settings.answer.hot_water": "Warmwasser",
	"settings.answer.ev": "E-Auto",
	"settings.pro": "Für Profis",
	"settings.pro.intro": "Feinheiten für die Nacht. Die Startwerte passen für die meisten – ändern musst du hier nichts.",
	"rule.reserve_soc": "Reserve",
	"rule.reserve_soc.hint": "Darunter entlade ich die Speicher nie.",
	"rule.max_target_soc": "Nachts höchstens laden bis",
	"rule.max_target_soc.hint": "Mehr lade ich nachts nicht aus dem Netz.",
	"rule.evening_min_soc": "Abends mindestens",
	"rule.evening_min_soc.hint": "Leer = keine Vorgabe.",
	"rule.grid_limit_w": "Netzlimit",
	"rule.grid_limit_w.hint": "Höchstleistung aus dem Netz, alles zusammen.",
	"rule.max_night_kwh": "Höchstens pro Nacht",
	"rule.max_night_kwh.hint": "Leer = so viel wie nötig.",
	"rule.max_price": "Höchstpreis fürs Netzladen",
	"rule.max_price.hint": "Leer = kein Höchstpreis.",
	"rule.min_saving": "Mindestersparnis pro Nacht",
	"rule.min_saving.hint": "Darunter lasse ich die Speicher in Ruhe.",
	"rule.grid_friendly": "Netzdienlich verhalten",
	"rule.grid_friendly.hint": "Speicher nehmen die Mittagssonne statt der Morgensonne, das Auto lädt mit Sonne.",
	"rule.grid_first": "Was geht vor?",
	"rule.grid_first.saving": "Ersparnis",
	"rule.grid_first.grid": "Netz",
	"rule.grid_first.saving.hint": "Ich verhalte mich nur netzdienlich, wenn es dich nichts kostet.",
	"rule.grid_first.grid.hint": "Ich verhalte mich auch netzdienlich, wenn es bis zu 30 ct am Tag kostet.",
	"rule.guard_grid": "Hauptsicherung schützen",
	"rule.guard_grid.hint": "Zieht das Haus mehr als das Netzlimit, pausiert das Laden ein paar Minuten.",
	"rule.guard_grid.no_limit": "Braucht ein Netzlimit (oben).",
	"rule.balance_days": "Pflegeladung",
	"rule.balance_days.hint": "Alle so viele Tage einmal ganz voll laden. Leer = aus.",
	"rule.balance_days.unit": "Tage",
	"rule.buffer_factor": "Sicherheitspuffer",
	"rule.buffer_factor.hint": "Aufschlag auf meine Rechnung, solange ich noch lerne.",
	"rule.plan_offset_min": "Plan festlegen",
	"rule.plan_offset_min.hint": "Minuten vor Beginn der günstigen Zeit.",
	"rule.reset_lead_min": "Zurückstellen",
	"rule.reset_lead_min.hint": "Minuten vor Ende der günstigen Zeit.",
	"rule.priority": "Wer zuerst?",
	"rule.priority.hint": "Reihenfolge, wenn das Netzlimit knapp wird.",
	"rule.priority.ev": "E-Auto",
	"rule.priority.hot_water": "Warmwasser",
	"rule.priority.battery": "Speicher",
	"rule.priority.up": "{name} nach oben",
	"rule.priority.down": "{name} nach unten",
	"rule.discharge_in_window": "Entladen in der günstigen Zeit",
	"rule.discharge_in_window.hint": "Was die Speicher nachts dürfen.",
	"rule.discharge.until_target": "Bis zum Ziel",
	"rule.discharge.block": "Pausieren",
	"rule.discharge.free": "Frei",
	"rule.off": "aus",
	"rule.reset": "Startwert",
	"tip.review_battery.title": "Was mache ich mit dem Speicher?",
	"tip.review_battery.text": "Ich rechne jede Nacht aus, wie viel er aus dem günstigen Netz braucht, damit er bis zur Sonne reicht.\n**Ändern** – Name, Größe, Sensoren und ob ich ihn steuern darf.\n**Weglassen** – ich plane ohne ihn. Zurückholen kannst du ihn jederzeit.",
	"tip.review_ignored.title": "Warum ist das ausgegraut?",
	"tip.review_ignored.text": "Das hast du weggelassen, ich nutze es nicht. **Doch verwenden** holt es zurück.",
	"tip.review_battery_add.title": "Fehlt ein Speicher?",
	"tip.review_battery_add.text": "Such dir den Sensor aus, der seinen Ladezustand in Prozent zeigt. Dann beobachte ich ihn und plane ihn ein.",
	"tip.review_battery_add.hint": "Steuern kann ich bisher Speicher über die Integrationen Fronius und OmniBattery, alle anderen beobachte ich.",
	"tip.review_tariff.title": "Wofür brauche ich den Tarif?",
	"tip.review_tariff.text": "Wann Strom günstig ist und was er kostet, entscheidet, wann ich lade und ob sich das lohnt.\n**Ändern** – Art, günstige Zeit, Preise und Einspeisevergütung.",
	"tip.review_forecast.title": "Wofür brauche ich die Prognose?",
	"tip.review_forecast.text": "Sie sagt mir, wie viel Sonne morgen kommt. Danach richte ich, wie voll ich die Speicher nachts mache. Wie gut sie bei dir trifft, lerne ich mit der Zeit.\n**Weglassen** – ich plane ohne Prognose, also vorsichtiger.",
	"tip.review_grid.title": "Wofür brauche ich den Netzzähler?",
	"tip.review_grid.text": "Er zeigt, wie viel Strom gerade aus dem Netz kommt oder hineingeht. Damit sehe ich, ob meine Pläne aufgehen, und lerne daraus.\n**Ändern** – einen anderen Sensor wählen.\n**Umdrehen** – falls er andersherum zählt.\n**Stimmt so** – mein Hinweis war falsch, ich sage nichts mehr.",
	"tip.review_home.title": "Wofür brauche ich den Hausverbrauch?",
	"tip.review_home.text": "Daraus lerne ich, wie viel ihr wann braucht – das Herzstück meiner Planung. Ich rechne ihn wie das Energie-Dashboard aus Netz, PV und Speicher aus; so zählt auch ein Balkonkraftwerk mit. Einen Hausverbrauchs-Sensor nehme ich zum Vergleich und als Ersatz, wenn die Rechnung nicht geht.\n**Ändern** – einen anderen Sensor wählen.\n**Hab ich nicht** – dann rechne ich nur aus Netz, PV und Speicher.",
	"tip.review_solar.title": "Wofür brauche ich die PV-Leistung?",
	"tip.review_solar.text": "Ich vergleiche, was die Prognose versprochen hat, mit dem, was deine Anlage wirklich geliefert hat. So werde ich jeden Tag genauer.\n**Ändern** – Sensoren wählen; mehrere Wechselrichter zähle ich zusammen.\n**Hab keine PV** – dann plane ich nur mit dem günstigen Netzstrom.",
	"tip.review_weather.title": "Wofür brauche ich das Wetter?",
	"tip.review_weather.text": "Wenn ihr mit Strom heizt, braucht ihr an kalten Tagen mehr. Mit der Vorhersage plane ich das ein.\n**Weglassen** – ich plane ohne Temperatur.",
	"tip.review_holiday.title": "Wofür brauche ich Feiertage?",
	"tip.review_holiday.text": "An Wochenenden und Feiertagen seid ihr oft zu Hause und verbraucht anders. Das lerne ich getrennt.\n**Weglassen** – dann kenne ich nur Wochenenden, keine Feiertage.",
	"tip.pick_all.title": "Warum sehe ich nicht alles?",
	"tip.pick_all.text": "Ich zeige erst nur, was passt – zum Beispiel Sensoren, die Leistung in W oder kW messen. Mit „Alle zeigen“ siehst du jede Entität.",
	"tip.pick_invert.title": "Was heißt andersherum zählen?",
	"tip.pick_invert.text": "Manche Zähler zeigen Bezug positiv, andere negativ. Schau unten, was ich gerade lese – stimmt die Richtung nicht, schalte um.",
	"tip.pick_invert_battery.title": "Was heißt andersherum zählen?",
	"tip.pick_invert_battery.text": "Ich rechne Laden positiv und Entladen negativ. Zeigt dein Speicher es umgekehrt, schalte um – unten siehst du, was ich gerade lese.",
	"tip.pick_grid.title": "Welcher Sensor ist richtig?",
	"tip.pick_grid.text": "Der, der die Leistung am Hausanschluss misst – also was ins Haus hinein- oder hinausgeht. Meist vom Stromzähler, Smartmeter oder Wechselrichter.",
	"tip.pick_grid.hint": "Meine Vorschläge stehen oben, mit dem Grund dafür.",
	"tip.pick_home.title": "Welcher Sensor ist richtig?",
	"tip.pick_home.text": "Der, der zeigt, was das ganze Haus gerade verbraucht – ohne das Laden des Speichers. Viele Wechselrichter liefern so einen Wert.",
	"tip.pick_solar.title": "Welche Sensoren sind richtig?",
	"tip.pick_solar.text": "Die, die zeigen, was deine PV-Anlage gerade erzeugt. Hast du mehrere Wechselrichter oder ein Balkonkraftwerk, wähl alle – ich zähle sie zusammen.",
	"tip.pick_battery.title": "Welcher Sensor ist richtig?",
	"tip.pick_battery.text": "Der, der den Ladezustand des Hausspeichers in Prozent zeigt – nicht der Akku vom Handy oder Auto.",
	"tip.pick_battery_power.title": "Welcher Sensor ist richtig?",
	"tip.pick_battery_power.text": "Der, der zeigt, wie viel der Speicher gerade lädt oder entlädt – in W oder kW.",
	"tip.pick_price.title": "Welcher Sensor ist richtig?",
	"tip.pick_price.text": "Der, der den aktuellen Strompreis zeigt – zum Beispiel von Tibber, Octopus oder einer Börsenpreis-Integration. Am besten einer, der auch die Preise der nächsten Stunden kennt.",
	"tip.pick_weather.title": "Welches Wetter nehme ich?",
	"tip.pick_weather.text": "Am besten eines mit stündlicher Vorhersage für deinen Ort. Ich brauche vor allem die Außentemperatur.",
	"tip.pick_holiday.title": "Welcher Sensor ist richtig?",
	"tip.pick_holiday.text": "Einer, der an Arbeitstagen „an“ und an Wochenenden und Feiertagen „aus“ ist. Die Integration „Arbeitstag“ (Workday) liefert genau das.",
	"tip.pick_person.title": "Wen kann ich hinzufügen?",
	"tip.pick_person.text": "Alle Personen aus Home Assistant. Über ihre Anwesenheit lerne ich, wann jemand zu Hause ist.",
	"tip.pick_person.hint": "Fehlt jemand? Leg in Home Assistant unter Einstellungen → Personen eine Person an – auch ohne eigenes Konto.",
	"tip.pick_calendar.title": "Welche Kalender passen?",
	"tip.pick_calendar.text": "Die dieser Person – Arbeit, Termine, Schichtplan. Ich lese nur, wann etwas eingetragen ist, um zu lernen, wann sie weg ist oder zu Hause arbeitet.",
	"tip.q_tariff.title": "Warum frage ich nach dem Tarif?",
	"tip.q_tariff.text": "Wann Strom günstig ist, entscheidet, wann ich lade. **Nachts günstiger** sind Tarife mit fester günstiger Zeit, der **Börsenpreis** ändert sich jede Stunde.",
	"tip.q_tariff.hint": "Steht auf deiner Stromrechnung. Weißt du es nicht, rechne ich vorerst mit einem festen Preis.",
	"tip.q_feed_in.title": "Warum frage ich das?",
	"tip.q_feed_in.text": "Strom, den du ins Netz gibst, bringt dir etwas. So rechne ich aus, ob es sich lohnt, ihn lieber zu speichern.",
	"tip.q_feed_in.hint": "Steht in der Abrechnung deines Netzbetreibers.",
	"tip.q_capacity.title": "Wozu brauche ich die Größe?",
	"tip.q_capacity.text": "Damit rechne ich aus, wie lange der Speicher reicht und wie viel ich nachts laden muss. Gemeint ist die nutzbare Kapazität in kWh.",
	"tip.q_capacity.hint": "Steht im Datenblatt. Weißt du es nicht, lerne ich es beim Laden und Entladen.",
	"tip.q_heating.title": "Warum frage ich das?",
	"tip.q_heating.text": "Heizen mit Strom hängt stark von der Außentemperatur ab. Wenn ich das weiß, plane ich kalte Tage besser.",
	"tip.q_heating.hint": "Mehrere Antworten gehen.",
	"tip.q_hot_water.title": "Warum frage ich das?",
	"tip.q_hot_water.text": "Elektrisches Warmwasser kann ich in günstige Stunden legen, wenn die Sonne nicht reicht. Gas, Öl und Fernwärme lasse ich in Ruhe.",
	"tip.q_hot_water_action.title": "Was richte ich da ein?",
	"tip.q_hot_water_action.text": "Eine Nacht-Aktion: Ich heize das Wasser in der günstigen Zeit gerade so weit vor, dass es bis zum nächsten Abend reicht, und starte so spät wie möglich. Danach stelle ich den Schalter zurück, wie er war. Wie schnell dein Speicher heizt und abkühlt, lerne ich selbst.",
	"tip.q_hot_water_action.hint": "Hast du schon eine eigene Automation fürs Warmwasser (z. B. mit Sonnenüberschuss)? Dann pass auf, dass sich beide nicht in die Quere kommen.",
	"tip.q_ev.title": "Warum frage ich das?",
	"tip.q_ev.text": "Reicht die Sonne morgen nicht, kann ich das Auto nachts günstig laden lassen. Einrichten tun wir das später bei den Nacht-Aktionen.",
	"tip.q_household.title": "Warum frage ich das?",
	"tip.q_household.text": "Ob jemand zu Hause ist, ändert den Verbrauch stark. Mit Anwesenheit und Kalendern lerne ich, wann ihr wie viel braucht – zum Beispiel im Homeoffice.\n**Wohnt nicht hier** – die Person lasse ich weg.",
	"tip.q_household.hint": "Alles bleibt in deinem Home Assistant.",
	"tip.f_window.title": "Wann ist dein Strom günstig?",
	"tip.f_window.text": "Die Uhrzeiten deines günstigen Tarifs, zum Beispiel 0 bis 5 Uhr. In dieser Zeit lade ich, wenn die Sonne morgen nicht reicht.",
	"tip.f_prices.title": "Welche Preise sind gemeint?",
	"tip.f_prices.text": "Was dich eine kWh kostet, in Cent und mit allem drum und dran. Weißt du es nicht, lass es leer – dann rechne ich mit üblichen Preisen.",
	"tip.f_price_entity.title": "Woher kenne ich den Preis?",
	"tip.f_price_entity.text": "Von einem Sensor, der den aktuellen Strompreis zeigt. Beim Börsenpreis brauche ich ihn, sonst weiß ich nicht, wann es günstig wird.",
	"tip.f_search.title": "Wo sucht Joe?",
	"tip.f_search.text": "In dieser Zeit suche ich das Zeitfenster, mit dem die nächsten 24 Stunden am wenigsten kosten: Darin halte ich die Speicher und lade in den günstigsten Viertelstunden. Meist liegt es mitten in der Nacht.",
	"tip.f_search.hint": "Ohne Angabe suche ich von 20 bis 7 Uhr.",
	"tip.f_surcharge.title": "Wozu der Aufschlag?",
	"tip.f_surcharge.text": "Manche Integrationen liefern nur den reinen Börsenpreis. Was du wirklich zahlst, ist mehr: Netzentgelt, Steuern und Abgaben. Trag diesen Teil pro kWh hier ein, damit ich richtig abwäge, ob sich das Laden lohnt.\nLiefert dein Sensor schon den Endpreis (z. B. Tibber), lass das Feld leer.",
	"tip.f_battery_name.title": "Wie soll ich ihn nennen?",
	"tip.f_battery_name.text": "So taucht der Speicher bei mir überall auf. Am Gerät und in Home Assistant ändert sich nichts.",
	"tip.f_battery_soc.title": "Was ist der Ladezustand?",
	"tip.f_battery_soc.text": "Wie voll der Speicher gerade ist, in Prozent. Den brauche ich für jede Rechnung.",
	"tip.f_battery_power.title": "Was ist die Leistung?",
	"tip.f_battery_power.text": "Wie viel der Speicher gerade lädt oder entlädt. Damit lerne ich, wie groß er wirklich ist und wie viel beim Laden verloren geht.",
	"tip.f_battery_limits.title": "Wie schnell darf er?",
	"tip.f_battery_limits.text": "Die höchste Lade- und Entladeleistung. Weißt du sie nicht, lass es leer – dann nehme ich, was das Gerät meldet, oder lerne es.",
	"tip.f_battery_priority.title": "Was heißt Reihenfolge?",
	"tip.f_battery_priority.text": "Hast du mehrere Speicher, lade ich den mit der kleineren Zahl zuerst. 1 = zuerst.",
	"tip.f_battery_control.title": "Was heißt steuern?",
	"tip.f_battery_control.text": "Im Live-Betrieb stelle ich Ladeziel und Entladung selbst ein und stelle am Ende jeder Nacht alles zurück. Ausgeschaltet schaue ich nur zu.",
	"tip.f_battery_control.hint": "In der Simulation schalte ich sowieso nichts.",
	"tip.f_calendars.title": "Wozu die Kalender?",
	"tip.f_calendars.text": "Termine verraten mir, wann jemand weg ist oder im Homeoffice arbeitet. Ich lese nur, ob und wann etwas eingetragen ist. Jede Person kann beliebig viele Kalender haben.",
	"tip.f_person_add.title": "Wer gehört dazu?",
	"tip.f_person_add.text": "Alle, die hier wohnen. Ihre Anwesenheit kommt aus Home Assistant, Kalender kannst du danach hinzufügen.",
	"tip.f_consumer_runs.title": "Warum will ich das wissen?",
	"tip.f_consumer_runs.text": "Den Hausspeicher plane ich nur für das, was er wirklich abdecken muss.\n**Nur mit Sonnenüberschuss** – läuft nur, wenn die Sonne mehr liefert als das Haus braucht (z. B. über evcc). Den Speicher plane ich ohne dieses Gerät.\n**Nur mit günstigem Strom** – läuft nachts in der günstigen Zeit, nicht aus dem Speicher.\n**Wenn es gebraucht wird** – zählt ganz normal mit.\nEine Wallbox zählt nie mit: Das Auto lade ich nicht aus dem Hausspeicher.",
	"tip.f_consumer_kind.title": "Was bedeutet die Art?",
	"tip.f_consumer_kind.text": "Für jedes Gerät mit eigenem Zähler lerne ich, wie sein Verbrauch von der Außentemperatur abhängt. **Zähler für andere Geräte** heißt: Er misst Geräte mit, die hier selbst stehen – die zähle ich nicht doppelt.",
	"tip.r_reserve_soc.title": "Was ist die Reserve?",
	"tip.r_reserve_soc.text": "Darunter entlade ich die Speicher nie – zum Beispiel als Notreserve oder um die Batterie zu schonen.",
	"tip.r_reserve_soc.hint": "10 % passen für die meisten Speicher.",
	"tip.r_max_target_soc.title": "Warum nicht immer voll laden?",
	"tip.r_max_target_soc.text": "Höher lade ich nachts aus dem Netz nie, damit Platz für die Sonne bleibt. Meist lade ich ohnehin weniger, weil ich genau ausrechne, was nötig ist.",
	"tip.r_evening_min_soc.title": "Was heißt abends mindestens?",
	"tip.r_evening_min_soc.text": "Soll abends immer etwas im Speicher sein – etwa für die Abendspitze oder einen Stromausfall –, trag hier die Untergrenze ein. Leer = keine Vorgabe.",
	"tip.r_grid_limit_w.title": "Was ist das Netzlimit?",
	"tip.r_grid_limit_w.text": "Wie viel Strom nachts gleichzeitig aus dem Netz kommen darf. Ich verteile die Leistung auf E-Auto, Warmwasser und Speicher und bleibe darunter.",
	"tip.r_grid_limit_w.hint": "Ein Hausanschluss mit 3 × 35 A schafft rund 24 kW.",
	"tip.r_max_night_kwh.title": "Warum eine Obergrenze?",
	"tip.r_max_night_kwh.text": "Wenn du pro Nacht nie mehr als eine bestimmte Menge aus dem Netz laden willst, trag sie ein. Leer = so viel wie nötig.",
	"tip.r_max_price.title": "Wozu ein Höchstpreis?",
	"tip.r_max_price.text": "Teurer als das lade ich nie aus dem Netz – auch wenn die Rechnung es knapp empfehlen würde. Halten darf ich die Speicher trotzdem.",
	"tip.r_min_saving.title": "Warum eine Mindestersparnis?",
	"tip.r_min_saving.text": "Jedes Steuern schreibt Werte in deine Geräte. Bringt eine Nacht weniger als diesen Betrag, lasse ich es und die Speicher laufen wie ohne mich. Pflegenächte sind ausgenommen.",
	"tip.r_grid_friendly.title": "Was heißt netzdienlich?",
	"tip.r_grid_friendly.text": "Mittags liefern alle Solaranlagen gleichzeitig am meisten – dann ist das Netz voll. Morgens und abends brauchen alle Strom – dann ist es knapp.\n**Speicher**: An sonnigen Tagen halte ich das Laden morgens zurück, der Überschuss geht ins Netz, und der Speicher lädt in der Mittagsspitze. Ich rechne vorsichtig mit 80 % der Prognose und gebe früher frei, wenn die Sonne zurückbleibt. Das geht bei Speichern, deren Ladeleistung ich begrenzen kann.\n**Morgens und abends** nimmt das Haus Strom aus dem Speicher statt aus dem Netz.\n**Auto**: Fährt es erst nachmittags, lädt es mit Sonne statt nachts.",
	"tip.r_grid_friendly.hint": "Steuern tue ich das nur in den Modi „Vorschlagen“ und „Live“, in der Simulation zeige ich es nur.",
	"tip.r_grid_first.title": "Ersparnis oder Netz?",
	"tip.r_grid_first.text": "**Ersparnis**: Ich warte morgens nur so lange, dass der Speicher trotzdem so voll wird wie sonst – es kostet dich nichts.\n**Netz**: Ich warte auch länger, wenn der Speicher dann nicht ganz voll wird – das darf bis zu 30 ct am Tag kosten.",
	"tip.r_guard_grid.title": "Was macht der Schutz?",
	"tip.r_guard_grid.text": "Während ich lade, schaue ich jede Minute auf den Netzbezug. Liegt er über deinem Netzlimit – weil gerade Herd, Wallbox und Wärmepumpe laufen –, halte ich die Speicher fünf Minuten lang, statt zu laden. Danach geht es weiter.",
	"tip.r_balance_days.title": "Was ist eine Pflegeladung?",
	"tip.r_balance_days.text": "Viele Speicher gleichen ihre Zellen nur ab, wenn sie ab und zu ganz voll werden – sonst stimmt die Ladestandsanzeige mit der Zeit nicht mehr. War ein Speicher so viele Tage nicht voll und füllt ihn auch die Sonne morgen nicht, lade ich ihn in der günstigen Zeit einmal auf 100 %.",
	"tip.r_balance_days.hint": "Üblich sind 14 bis 30 Tage. Steht im Handbuch deines Speichers.",
	"tip.r_buffer_factor.title": "Was ist der Sicherheitspuffer?",
	"tip.r_buffer_factor.text": "So viel schlage ich auf meine Rechnung drauf, solange ich dein Haus noch nicht gut kenne. Je besser meine Prognosen treffen, desto kleiner wird er.",
	"tip.r_plan_offset_min.title": "Wann lege ich den Plan fest?",
	"tip.r_plan_offset_min.text": "So viele Minuten vor Beginn der günstigen Zeit rechne ich den Plan für die Nacht aus – mit der neuesten Prognose.",
	"tip.r_reset_lead_min.title": "Warum vor dem Ende zurückstellen?",
	"tip.r_reset_lead_min.text": "So viele Minuten vor Ende der günstigen Zeit stelle ich alles zurück, zum Beispiel die Wallbox von „Jetzt“ auf „PV“. Manche Geräte laufen kurz nach – so kostet nichts den Tagpreis.",
	"tip.r_priority.title": "Wer bekommt zuerst Strom?",
	"tip.r_priority.text": "Reicht das Netzlimit nicht für alle, bekommt zuerst Strom, wer oben steht. Die anderen warten oder laden langsamer.",
	"tip.r_discharge_in_window.title": "Was dürfen die Speicher nachts?",
	"tip.r_discharge_in_window.text": "**Bis zum Ziel** – entladen, aber nur bis zu dem Stand, den ich für den Morgen brauche. Reicht der Speicher nicht bis zur Sonne, kommt der Strom lieber jetzt günstig aus dem Netz.\n**Pausieren** – in der günstigen Zeit gar nicht entladen.\n**Frei** – entladen wie immer.",
	"tip.r_discharge_in_window.hint": "„Bis zum Ziel“ spart am meisten.",
	"overview.now": "Gerade jetzt",
	"overview.now.solar": "Sonne",
	"overview.now.solar.sub": "erzeugt gerade",
	"overview.now.home": "Haus",
	"overview.now.home.sub": "verbraucht gerade",
	"overview.now.home.calc": "verbraucht, ausgerechnet",
	"overview.now.battery": "Speicher",
	"overview.now.battery.charge": "Speicher lädt",
	"overview.now.battery.discharge": "Speicher entlädt",
	"overview.now.soc": "{value} % voll",
	"overview.now.soc_avg": "im Schnitt {value} % · {count} Speicher",
	"overview.now.no_battery": "kein Speicher",
	"overview.now.grid": "Netz",
	"overview.now.grid.in": "Netzbezug",
	"overview.now.grid.out": "Einspeisung",
	"overview.now.grid.in.sub": "kommt aus dem Netz",
	"overview.now.grid.out.sub": "geht ins Netz",
	"overview.now.grid.idle": "fast nichts",
	"overview.now.none": "kein Sensor",
	"overview.week": "Die letzten 7 Tage",
	"overview.week.known": "{days} Tage im Gedächtnis",
	"overview.week.none": "Noch nichts aufgezeichnet – nach der ersten vollen Stunde geht's los.",
	"overview.week.more": "Zur Historie",
	"status.running": "läuft",
	"status.paused": "Pause",
	"status.waiting": "wartet",
	"history.live_since": "Ich beobachte live seit {time} Uhr",
	"history.live_since_day": "Ich beobachte live seit {day}",
	"history.paused": "Pause – im Modus „Aus“ beobachte ich nichts",
	"history.known": "{days} Tage im Gedächtnis, seit {first}",
	"history.reading": "Ich lese gerade die letzten Wochen aus deinem Home Assistant …",
	"history.days": "Tage",
	"history.workday": "Arbeitstag",
	"history.day_off": "Wochenende oder Feiertag",
	"history.live": "live beobachtet",
	"history.read": "aus Home Assistant gelesen",
	"history.missing": "Für {hours} Stunden fehlen mir Daten – Home Assistant war aus oder ein Sensor hat nichts geliefert.",
	"history.failed": "Die Historie konnte ich gerade nicht laden.",
	"history.empty.off": "Ich mache gerade Pause. Stell mich wieder auf Simulation, dann beobachte ich weiter – und hole mir, was fehlt, aus deinem Home Assistant.",
	"history.empty.reading": "Ich lese gerade die letzten Wochen aus deinem Home Assistant. Gleich siehst du hier jeden Tag.",
	"history.empty.soon": "Ich beobachte. Nach der ersten vollen Stunde siehst du hier, was passiert ist.",
	"history.empty.waiting": "Sobald die Einrichtung fertig ist, schreibe ich jede Stunde auf, was in deinem Haus passiert.",
	"history.tile.home": "Verbrauch",
	"history.tile.home.self": "{value} % selbst gedeckt",
	"history.tile.solar": "Sonne",
	"history.tile.solar.fc": "Prognose {value} kWh, erreicht {ratio} %",
	"history.tile.solar.nofc": "keine Prognose gemerkt",
	"history.tile.grid": "Netzbezug",
	"history.tile.grid.cheap": "davon günstig {value} kWh",
	"history.tile.grid.out": "eingespeist {value} kWh",
	"history.tile.battery": "Speicher geladen",
	"history.tile.battery.out": "entladen {value} kWh",
	"history.tile.temp": "Außen",
	"history.tile.temp.range": "{min} bis {max} °C",
	"history.tile.present": "Zu Hause",
	"history.chart.energy": "Energie pro Stunde",
	"history.chart.soc": "Ladezustand",
	"history.chart.home": "Verbrauch",
	"history.chart.solar": "Sonne",
	"history.chart.forecast": "Prognose",
	"history.chart.cheap": "günstig",
	"history.chart.sunrise": "Aufgang {time}",
	"history.chart.sunset": "Untergang {time}",
	"settings.observe": "Beobachten",
	"settings.observe.recording": "Aufzeichnung",
	"settings.observe.since": "Läuft seit {day}, {time} Uhr.",
	"settings.observe.off": "Pause – im Modus „Aus“ beobachte ich nichts.",
	"settings.observe.waiting": "Startet, sobald die Einrichtung fertig ist und ich Sensoren kenne.",
	"settings.observe.history": "Verlauf",
	"settings.observe.days": "{days} Tage, seit {first}",
	"settings.observe.nothing": "Noch nichts aufgezeichnet",
	"settings.observe.no_recorder": "Home Assistant speichert keinen Verlauf (Recorder aus)",
	"settings.observe.failed": "Beim letzten Lesen ging etwas schief",
	"settings.observe.rebuild": "Neu einlesen",
	"tip.now.title": "Was sehe ich hier?",
	"tip.now.text": "Was gerade fließt: was die Sonne erzeugt, was das Haus verbraucht, ob die Speicher laden oder entladen und ob Strom aus dem Netz kommt oder hineingeht. Live aus deinen Sensoren.",
	"tip.week.title": "Was sehe ich hier?",
	"tip.week.text": "Pro Tag dein **Verbrauch** und was die **Sonne** geliefert hat. Tipp auf einen Tag für die genauen Werte.",
	"tip.chart_energy.title": "Was sehe ich hier?",
	"tip.chart_energy.text": "Pro Stunde: **Verbrauch** als Balken, **Sonne** als Fläche und die **Prognose** vom Vorabend gestrichelt. Hinterlegt ist deine günstige Zeit. Tipp auf eine Stunde für die genauen Werte.",
	"tip.chart_soc.title": "Was sehe ich hier?",
	"tip.chart_soc.text": "Wie voll deine Speicher zu jeder vollen Stunde waren.",
	"tip.observe.title": "Was schreibe ich auf?",
	"tip.observe.text": "Jede Stunde: Verbrauch, Sonne, Netz und Speicher, dazu Außentemperatur, wer zu Hause war und die Solarprognose. Daraus lerne ich. Alles bleibt in deinem Home Assistant.",
	"tip.observe.hint": "Im Modus „Aus“ schreibe ich nichts auf. Was dann fehlt, hole ich mir später aus dem Verlauf von Home Assistant.",
	"tip.rebuild.title": "Wann neu einlesen?",
	"tip.rebuild.text": "Wenn du andere Sensoren gewählt hast. Dann lese ich die letzten 8 Wochen noch einmal aus Home Assistant. Was nur ich live gesehen habe – Temperatur, wer zu Hause war, die Prognose –, bleibt erhalten.",
	"overview.night.more": "Zum Plan",
	"plan.page.title": "Mein Plan |für heute Nacht",
	"plan.big.none": "Nichts zu tun",
	"plan.big.unavailable": "Kein Plan",
	"plan.fixed_at": "steht seit {time} Uhr",
	"plan.preview_at": "Vorschau, Stand {time} Uhr",
	"plan.refresh": "Neu rechnen",
	"plan.say.charge": "Ich lade ab {from} Uhr auf {target} % – mehr braucht's nicht.",
	"plan.say.charge_slots": "Ich lade in den günstigsten Viertelstunden der Nacht ({slots}) auf {target} %.",
	"plan.say.balance": "Heute ist Pflegenacht: Ich lade einmal ganz voll, damit die Speicher ihre Zellen abgleichen.",
	"plan.say.small_saving": "Heute Nacht lasse ich es: Es würde weniger bringen, als du in den Regeln als Mindestersparnis eingestellt hast.",
	"plan.say.max_price": "Über deinem Höchstpreis lade ich nicht aus dem Netz.",
	"plan.say.hold": "Ich lade nicht, halte die Speicher in der günstigen Zeit aber bei {target} % – lieber jetzt günstig aus dem Netz als morgen früh teuer.",
	"plan.say.empty": "Ohne mich wären sie um {time} Uhr leer.",
	"plan.say.none": "Heute Nacht muss ich nichts tun: Die Speicher reichen, bis die Sonne um {time} Uhr übernimmt.",
	"plan.say.none_nosun": "Heute Nacht muss ich nichts tun: Laden aus dem Netz würde sich nicht lohnen.",
	"plan.say.sun_full": "Ab {sun} Uhr übernimmt die Sonne, um {full} Uhr sind die Speicher voll.",
	"plan.say.sun": "Ab {sun} Uhr übernimmt die Sonne.",
	"plan.say.nosun": "Die Sonne wird morgen nicht fürs ganze Haus reichen.",
	"plan.line.hold": "hält {target} %",
	"plan.line.now": "jetzt {soc} %",
	"plan.line.watch_only": "kann ich nur beobachten",
	"plan.cost.night": "Nachtstrom {value}",
	"plan.cost.saving": "gespart gegenüber ohne Plan ≈ {value}",
	"plan.empty.off": "Ich mache gerade Pause. Stell mich auf Simulation, dann plane ich wieder jede Nacht.",
	"plan.empty.waiting": "Sobald die Einrichtung fertig ist, plane ich hier jede Nacht – mit Kurven für Sonne, Verbrauch und Ladezustand.",
	"plan.why.no_window": "Dein Tarif hat keine günstige Zeit – nachts zu laden lohnt sich nicht. Ich schaue weiter zu und lerne.",
	"plan.why.dynamic": "Für Börsenpreise brauche ich die Preise der nächsten Stunden. Wähle unter Einstellungen → Tarif den Preis-Sensor deiner Tarif-Integration.",
	"plan.why.no_prices": "Dein Preis-Sensor liefert keine Preisliste für die nächsten Stunden. Wähle unter Einstellungen → Tarif einen Sensor, der die Preise mitbringt (z. B. Nord Pool, EPEX Spot, Tibber, ENTSO-E).",
	"plan.why.prices_pending": "Die Preise für die Nacht sind noch nicht da – sie kommen meist gegen 13 Uhr. Dann plane ich.",
	"plan.why.no_battery": "Ohne Speicher, dessen Größe ich kenne, gibt es nachts nichts zu planen.",
	"plan.why.failed": "Beim Planen ist etwas schiefgegangen. Ich versuche es zur nächsten vollen Stunde wieder.",
	"plan.note.capacity_unknown": "Ein Speicher fehlt in der Rechnung, weil ich seine Größe nicht kenne.",
	"plan.note.soc_unknown": "Ein Speicher fehlt in der Rechnung, weil sein Ladezustand gerade nichts liefert.",
	"plan.note.not_controllable": "Einen Speicher kann ich nur beobachten – in der Simulation rechne ich so, als könnte ich ihn steuern.",
	"plan.note.no_forecast": "Ohne Prognose rechne ich, als käme morgen keine Sonne – also vorsichtig.",
	"plan.note.default_profile": "Deinen Verbrauch kenne ich noch nicht gut und rechne mit einem typischen Haushalt.",
	"plan.note.prices_partly": "Für einige Stunden kenne ich die Preise noch nicht und rechne dort mit dem Durchschnitt.",
	"plan.note.balance_due": "Ein Speicher war länger nicht ganz voll – Zeit für eine Pflegeladung.",
	"plan.chart.energy": "Sonne, Verbrauch und Laden",
	"plan.chart.solar": "Sonne (Prognose)",
	"plan.chart.home": "Verbrauch (erwartet)",
	"plan.chart.charge": "Laden aus dem Netz",
	"plan.chart.sun": "Sonne übernimmt {time}",
	"plan.chart.soc": "Ladezustand",
	"plan.chart.plan": "mit Plan",
	"plan.chart.without": "ohne Plan",
	"plan.chart.target": "Ziel {value} %",
	"plan.chart.full": "voll {time}",
	"plan.chart.reserve": "Reserve {value} %",
	"plan.chart.prices": "Preise",
	"plan.chart.price": "Preis je kWh",
	"plan.chart.charge_at": "Laden ab {time}",
	"plan.slots": "Laden: {slots}",
	"plan.math": "So habe ich gerechnet",
	"plan.math.battery_now": "Speicher jetzt",
	"plan.math.battery_now.sub": "{stored} von {capacity} kWh",
	"plan.math.battery_start": "Zu Beginn der günstigen Zeit",
	"plan.math.solar": "Sonne morgen",
	"plan.math.solar.hours": "stündliche Prognose deiner Solaranlage",
	"plan.math.solar.sum": "Tagesprognose, über den Tag verteilt",
	"plan.math.solar.none": "keine Prognose – ich rechne ohne Sonne",
	"plan.math.solar.factor": "× {value}, so trifft die Prognose bei dir",
	"plan.math.solar.combined": "× {value} aus mehreren Prognosen kombiniert",
	"plan.math.solar.weather": "× {value}, so trifft sie bei Wetterlage „{weather}“",
	"plan.math.tomorrow": "Morgen",
	"plan.math.tomorrow.person": "{name}: {label}",
	"plan.math.tomorrow.scaled": "für den ganzen Tag erwarte ich {expected} kWh statt der üblichen {usual} kWh",
	"plan.math.tomorrow.usual": "ich rechne wie an einem üblichen Tag",
	"plan.math.home": "Verbrauch morgen",
	"plan.math.home.history": "aus {days} Tagen, {kind}",
	"plan.math.home.default": "Startwert eines typischen Haushalts",
	"plan.math.workday": "für einen Arbeitstag",
	"plan.math.day_off": "für ein Wochenende oder einen Feiertag",
	"plan.math.target": "Ziel",
	"plan.math.target.sub": "nötig wären {optimum} %, dazu {buffer} % Puffer auf den Teil über der Reserve",
	"plan.math.prices": "Preise",
	"plan.math.prices.value": "günstig {night} · sonst {day} · Einspeisung {feed}",
	"plan.math.prices.assumed": "Nicht alle Preise kenne ich – die fehlenden habe ich angenommen. Trag sie in den Einstellungen ein.",
	"plan.math.rules": "Regeln",
	"plan.math.rules.value": "Reserve {reserve} % · höchstens {max} % · Entladen: {mode}",
	"history.chart.plan": "Plan",
	"tip.plan_target.title": "Was heißt das Ziel?",
	"tip.plan_target.text": "Mit diesem Stand sollen die Speicher aus der günstigen Zeit kommen. Liegen sie darunter, lade ich aus dem Netz – so spät wie möglich. Liegen sie darüber, entladen sie nur bis zum Ziel, damit es bis zur Sonne reicht.",
	"tip.plan_target.hint": "In der Simulation schalte ich nichts – ich zeige nur, was ich tun würde.",
	"tip.plan_refresh.title": "Wann rechne ich neu?",
	"tip.plan_refresh.text": "Jede Stunde von allein, mit der neuesten Prognose. Kurz vor der günstigen Zeit lege ich den Plan fest, danach bleibt er bis zum Morgen. Mit **Neu rechnen** rechne ich sofort.",
	"tip.plan_math.title": "Wie entscheide ich?",
	"tip.plan_math.text": "Ich spiele die Stunden bis zur nächsten Nacht durch – für jedes mögliche Ziel – und nehme das, bei dem du am wenigsten bezahlst. Weil ich noch lerne, lege ich einen Puffer drauf.",
	"tip.chart_plan_energy.title": "Was sehe ich hier?",
	"tip.chart_plan_energy.text": "Was ich pro Stunde erwarte: **Sonne** laut Prognose, deinen **Verbrauch** aus ähnlichen Tagen und wann ich **aus dem Netz lade**. Hinterlegt ist die günstige Zeit.",
	"tip.chart_plan_prices.title": "Was sehe ich hier?",
	"tip.chart_plan_prices.text": "Die Preise deines Tarifs für jede Stunde. Grau hinterlegt ist das Zeitfenster, in dem ich die Speicher halte; die Marken zeigen, wann ich lade – in den günstigsten Viertelstunden.",
	"tip.chart_plan_soc.title": "Was sehe ich hier?",
	"tip.chart_plan_soc.text": "Wie voll die Speicher **mit Plan** wären und wie voll **ohne Plan**. Der Unterschied ist das, was ich dir spare.",
	"learn.page.title": "Was ich |gelernt habe",
	"learn.lead": "Jeden Morgen spiele ich den Plan der Nacht mit dem echten Tag nach. Daraus lerne ich, wie gut die Prognose bei dir trifft und wie viel Puffer du wirklich brauchst.",
	"learn.since": "Ich lerne seit {day}",
	"learn.since_start": "Ich lerne aus allem, was ich seit {day} gesehen habe",
	"learn.updated": "zuletzt dazugelernt {day}, {time} Uhr",
	"learn.paused": "Pause – im Modus „Aus“ lerne ich nicht",
	"learn.waiting": "Ich lerne, sobald die Einrichtung fertig ist",
	"learn.failed": "Was ich gelernt habe, konnte ich gerade nicht laden.",
	"learn.nights.one": "einer Nacht",
	"learn.nights.many": "{count} Nächten",
	"learn.results": "Was es gebracht hätte",
	"learn.results.say": "So viel hättest du seit {since} gespart, wenn ich gesteuert hätte – an {nights}, nachgespielt mit dem echten Wetter und deinem echten Verbrauch.",
	"learn.results.split": "{better} × besser · {worse} × teurer · {same} × gleich",
	"learn.results.none": "Noch habe ich keinen Plan nachgespielt. Am Morgen nach der ersten geplanten Nacht siehst du hier, was es gebracht hätte.",
	"learn.results.chart": "Pro Nacht",
	"learn.results.chart.saving": "gespart",
	"learn.still": "lerne noch",
	"learn.days": "aus {days} Tagen",
	"learn.mornings": "aus {count} Morgen",
	"learn.solar": "Sonnenprognose",
	"learn.solar.less": "Die Prognose verspricht bei dir im Schnitt {value} % zu viel – ich rechne nur mit {share} % davon.",
	"learn.solar.more": "Deine Anlage liefert im Schnitt {value} % mehr, als die Prognose verspricht – ich rechne mit {share} %.",
	"learn.solar.fits": "Die Prognose trifft bei dir gut – ich nehme sie, wie sie ist.",
	"learn.solar.learning": "Ich vergleiche jeden Tag die Prognose vom Vorabend mit dem, was deine Anlage liefert. Nach {need} Tagen weiß ich, wie gut sie trifft – {have} habe ich.",
	"learn.solar.chart": "Sonne pro Tag",
	"learn.solar.chart.actual": "geliefert",
	"learn.solar.chart.forecast": "Prognose vom Vorabend",
	"learn.shift": "Zeitversatz",
	"learn.shift.big.0": "passt",
	"learn.shift.big.1": "+1 h",
	"learn.shift.big.-1": "−1 h",
	"learn.shift.0": "Die Stunden der Prognose passen zu deiner Anlage.",
	"learn.shift.1": "Die Prognose ist bei dir eine Stunde zu früh dran – ich schiebe sie eine Stunde nach hinten.",
	"learn.shift.-1": "Die Prognose ist bei dir eine Stunde zu spät dran – ich ziehe sie eine Stunde vor.",
	"learn.shift.learning": "Ich prüfe, ob die stündliche Prognose zur richtigen Uhrzeit kommt. Dafür brauche ich {need} Tage mit Stundenwerten – {have} habe ich.",
	"learn.shift.chart": "Sonne pro Stunde, im Schnitt",
	"learn.shift.chart.actual": "geliefert",
	"learn.shift.chart.forecast": "Prognose vom Vorabend",
	"learn.buffer": "Puffer",
	"learn.buffer.learned": "So viel lege ich auf das nötige Ziel drauf. Damit hätte es an 8 von 10 Morgen bis zur Sonne gereicht.",
	"learn.buffer.default": "Mein Startwert, bewusst vorsichtig. Nach {need} nachgespielten Nächten weiß ich, wie viel Puffer du wirklich brauchst – {have} habe ich.",
	"learn.buffer.user": "Den hast du selbst eingestellt – ich lasse ihn so.",
	"learn.buffer.user_learned": "Den hast du selbst eingestellt. Ich hätte {value} % genommen.",
	"learn.buffer.own": "Wieder selbst lernen",
	"learn.buffer.chart": "Bis zur Sonne gebraucht",
	"learn.buffer.chart.planned": "geplant",
	"learn.buffer.chart.actual": "gebraucht",
	"learn.home": "Verbrauch",
	"learn.home.history": "Deinen Tagesgang kenne ich aus {days} Tagen – Arbeitstage und freie Tage getrennt.",
	"learn.home.default": "Deinen Verbrauch kenne ich noch nicht gut und rechne mit einem typischen Haushalt.",
	"learn.home.totals": "Arbeitstag ≈ {workday} kWh · frei ≈ {day_off} kWh",
	"learn.home.chart": "Verbrauch pro Stunde",
	"learn.home.chart.workday": "Arbeitstag",
	"learn.home.chart.day_off": "Wochenende oder Feiertag",
	"learn.accuracy": "Wie gut ich lag",
	"learn.accuracy.night": "Nacht",
	"learn.accuracy.solar": "Sonne",
	"learn.accuracy.morning": "Bis zur Sonne",
	"learn.accuracy.result": "Gebracht",
	"learn.accuracy.value": "{expected} → {actual}",
	"learn.accuracy.none": "Sobald ich Pläne nachgespielt habe, siehst du hier für jede Nacht, was ich erwartet habe und was kam.",
	"ask.title": "Joe fragt nach",
	"ask.lead": "An diesen Tagen lag euer Verbrauch weit neben dem, was ich erwartet habe. Sag mir kurz, was los war – dann lerne ich richtig daraus.",
	"ask.more": "{day}: Ihr habt {actual} kWh verbraucht, ich hatte mit {expected} kWh gerechnet. War etwas Besonderes?",
	"ask.less": "{day}: Ihr habt nur {actual} kWh verbraucht, ich hatte mit {expected} kWh gerechnet. Wart ihr weg?",
	"ask.answers": "Antworten",
	"ask.answer.guests": "Wir hatten Besuch",
	"ask.answer.away": "Wir waren weg",
	"ask.answer.special": "Etwas anderes Besonderes",
	"ask.answer.normal": "Ganz normaler Tag",
	"learn.models": "Was ich über euer Zuhause weiß",
	"learn.model": "Verbrauch und Wetter",
	"learn.model.no_weather": "Ohne Wetter-Entität kenne ich die Außentemperatur nicht. Wähle in der Einrichtung eine aus, dann lerne ich, wie viel ihr bei Kälte mehr braucht.",
	"learn.model.learning": "Ich vergleiche jeden Tag euren Verbrauch mit der Außentemperatur. Ab {need} vollständigen Tagen rechne ich damit – {have} habe ich.",
	"learn.model.base": "An warmen Tagen braucht ihr etwa {value} kWh.",
	"learn.model.workday_more": "An Arbeitstagen {value} kWh mehr.",
	"learn.model.workday_less": "An Arbeitstagen {value} kWh weniger.",
	"learn.model.heat": "Jedes Grad unter 15 °C kostet {value} kWh mehr.",
	"learn.model.cool": "Jedes Grad über 22 °C kostet {value} kWh mehr.",
	"learn.model.presence": "Jede Stunde mehr, die jemand zu Hause ist, kostet {value} kWh.",
	"learn.model.fit": "Das erklärt {share} % der Unterschiede zwischen euren Tagen.",
	"learn.model.chart": "Verbrauch pro Tag nach Außentemperatur",
	"learn.model.chart.actual": "gemessen (Mittel)",
	"learn.model.chart.workday": "erwartet, Arbeitstag",
	"learn.model.chart.day_off": "erwartet, freier Tag",
	"learn.weather": "Sonne nach Wetterlage",
	"learn.weather.say": "Wie gut die Prognose trifft, hängt vom Wetter ab. Ein Tag gilt als klar, wenn die Prognose mindestens 70 % des besten Tages der letzten 30 Tage ({top} kWh) erreicht.",
	"learn.weather.learning": "Für jede Wetterlage brauche ich mindestens drei Tage, um zu sehen, wie gut die Prognose trifft – {have} Tage habe ich insgesamt.",
	"learn.weather.clear": "klar",
	"learn.weather.mixed": "wechselhaft",
	"learn.weather.overcast": "trüb",
	"learn.sources": "Prognosequellen",
	"learn.sources.main": "Hauptprognose",
	"learn.sources.error": "typisch ±{value} % daneben",
	"learn.sources.weight": "zählt {value} %",
	"learn.sources.learning": "lerne noch (ab {need} Tagen)",
	"learn.sources.combine": "Prognosen kombinieren",
	"learn.sources.single": "Ich habe nur eine Prognose. Hast du eine zweite Integration (zum Beispiel Solcast und Forecast.Solar), finde ich sie bei der nächsten Suche und vergleiche beide.",
	"learn.battery": "Speicher, wie sie wirklich sind",
	"learn.battery.learning": "Ich messe, wie viel hinein- und herausgeht und wie sich der Ladestand ändert. Nach etwa {need} Tagen mit Bewegung weiß ich, wie viel er wirklich fasst.",
	"learn.battery.no_power": "Ohne Leistungsmessung des Speichers kann ich Größe und Verluste nicht messen.",
	"learn.battery.user": "Du hast {value} kWh eingetragen – damit rechne ich weiter.",
	"learn.battery.odd": "Das passt nicht zu den {value} kWh laut Gerät – ich rechne lieber mit dem Gerätewert. Prüfe den Ladestand- und den Leistungs-Sensor.",
	"learn.battery.uses_nominal": "Laut Gerät {value} kWh – ich rechne mit dem gemessenen Wert.",
	"learn.battery.uses": "Ich rechne mit dem gemessenen Wert.",
	"learn.battery.capacity": "{value} kWh nutzbar",
	"learn.battery.efficiency": "{value} % kommen wieder heraus",
	"learn.battery.none": "Noch ist kein Speicher eingerichtet.",
	"learn.groups": "Geräte mit eigenem Zähler",
	"learn.groups.average": "Ø {value} kWh am Tag",
	"learn.groups.heat": "+{value} kWh je Grad unter 15 °C",
	"learn.groups.steady": "unabhängig vom Wetter",
	"learn.groups.none": "Geräte mit eigenem Zähler aus dem Energie-Dashboard bekommen hier eine eigene Rechnung – zum Beispiel eine Wärmepumpe.",
	"learn.hot_water": "Warmwasser",
	"learn.hot_water.rate": "heizt {value} K/h",
	"learn.hot_water.loss": "verliert {value} K/h",
	"learn.hot_water.demand": "{value} K Verbrauch am Tag",
	"learn.hot_water.learning": "Ich lerne aus dem Temperaturverlauf der letzten drei Wochen (aus der Aufzeichnung von Home Assistant).",
	"learn.hot_water.none": "Lege unter Geräte eine Nacht-Aktion „Warmwasser“ mit Temperatursensor an, dann lerne ich, wie schnell es heizt und wie viel ihr am Tag braucht.",
	"learn.presence": "Wer wann zu Hause ist",
	"learn.presence.value": "{label}: {hours} h",
	"learn.presence.no_person": "Ohne Personen-Entität sehe ich nicht, wann jemand zu Hause ist.",
	"learn.presence.none": "Ordne Personen ihre Kalender zu, dann lerne ich, wie viele Stunden sie bei Büro, Homeoffice oder Urlaub zu Hause sind.",
	"learn.presence.calendars": "Kalender zuordnen",
	"learn.calendar": "Kalender-Regeln",
	"learn.calendar.say": "Steht eines dieser Stichworte im Titel, Ort oder in der Beschreibung eines Termins, gilt der Tag für die Person als …",
	"learn.calendar.remove": "Stichwort {keyword} entfernen",
	"learn.calendar.keyword": "Stichwort",
	"learn.calendar.add_to": "Stichwort für {label} hinzufügen",
	"learn.calendar.add": "Hinzufügen",
	"learn.calendar.defaults": "Ohne passenden Termin",
	"learn.calendar.default_workday": "An Arbeitstagen",
	"learn.calendar.default_day_off": "An freien Tagen",
	"learn.calendar.for": "Regeln für",
	"learn.calendar.everyone": "Alle",
	"learn.calendar.shared": "Gilt für alle",
	"learn.calendar.shared.say": "{name} folgt den Regeln für alle. Schalte „Gilt für alle“ aus, um eigene Stichworte festzulegen – Joe übernimmt dann die bisherigen als Start.",
	"tip.cal_person.title": "Für wen gelten die Regeln?",
	"tip.cal_person.text": "„Alle“ sind die gemeinsamen Regeln. Wählst du eine Person, siehst du ihre Regeln – eigene oder die gemeinsamen. Ein kleines Symbol am Namen zeigt: Diese Person hat eigene Regeln.",
	"tip.cal_shared.title": "Gemeinsame oder eigene Regeln?",
	"tip.cal_shared.text": "An: Für diese Person gelten die Regeln für alle. Aus: Sie bekommt eigene Stichworte und eigene Vorgaben ohne passenden Termin – zum Start eine Kopie der gemeinsamen.",
	"tip.cal_shared.hint": "Wieder einschalten verwirft die eigenen Regeln dieser Person.",
	"label.home_office": "Homeoffice",
	"label.office": "Büro",
	"label.travel": "Dienstreise",
	"label.vacation": "Urlaub",
	"label.guests": "Besuch",
	"label.home": "Zu Hause",
	"learn.reset": "Neu anfangen",
	"learn.reset.text": "Ich vergesse, was ich gelernt habe – alles oder nur einen Bereich – und lerne es ab jetzt aus neuen Tagen. Deine Einstellungen und der Verlauf bleiben.",
	"learn.reset.scope": "Was soll ich vergessen?",
	"learn.reset.scope.all": "Alles",
	"learn.reset.scope.forecast": "Sonne",
	"learn.reset.scope.consumption": "Verbrauch",
	"learn.reset.scope.battery": "Speicher",
	"learn.reset.scope.hot_water": "Warmwasser",
	"learn.reset.button": "Lernen zurücksetzen",
	"learn.reset.button.scope": "Diesen Bereich zurücksetzen",
	"learn.reset.off": "Im Modus „Aus“ lerne ich nicht – zurücksetzen geht, sobald ich wieder simuliere.",
	"learn.reset.label": "Lernen zurücksetzen",
	"learn.reset.confirm.title": "Wirklich |neu anfangen?",
	"learn.reset.confirm.forget": "Das vergesse ich",
	"learn.reset.forget.all": "Prognose-Faktoren, Zeitversatz, Wetterlagen, Prognosequellen, den gelernten Puffer, alle Rechnungen zu Verbrauch, Speichern und Warmwasser und die Bilanz, was es gebracht hätte.",
	"learn.reset.forget.forecast": "Prognose-Faktor, Zeitversatz, die Faktoren je Wetterlage und wie gut die Prognosequellen treffen.",
	"learn.reset.forget.consumption": "Die Rechnung zu Verbrauch und Wetter, die Rechnungen je Gerät, die Anwesenheit nach Kalender und den gelernten Puffer.",
	"learn.reset.forget.battery": "Die gemessene Größe und den Wirkungsgrad deiner Speicher.",
	"learn.reset.forget.hot_water": "Heizrate, Standverlust und Tagesverbrauch des Warmwassers.",
	"learn.reset.confirm.keep": "Das bleibt",
	"learn.reset.confirm.keep.text": "Deine Einstellungen, ein selbst eingestellter Puffer und der ganze Verlauf. Gelernt wird ab jetzt nur aus neuen Tagen.",
	"learn.reset.keep.scope": "Alles andere, was ich gelernt habe, deine Einstellungen und der ganze Verlauf. Diesen Bereich lerne ich ab jetzt nur aus neuen Tagen.",
	"learn.reset.confirm.go": "Zurücksetzen",
	"learn.reset.done": "Erledigt – ich lerne ab jetzt neu.",
	"learn.reset.done.scope": "Erledigt – diesen Bereich lerne ich ab jetzt neu.",
	"action.need": "Laden nach Bedarf",
	"action.need.on": "an – ich lade nur, was morgen fehlt",
	"action.need.off": "aus – ich lade, wenn wenig Sonne kommt",
	"action.need.hint": "Ich schaue, wie weit ihr morgen fahrt (Termine mit Ort in euren Kalendern oder eure übliche Strecke), rechne eine Reserve dazu und lade nur, was dem Auto dafür fehlt – so spät wie möglich in der günstigen Zeit.",
	"action.need.soc": "Ladestand des Autos",
	"action.need.range": "Reichweite des Autos",
	"action.need.capacity": "Nutzbare Akkugröße",
	"action.need.from_sensor": "vom Sensor",
	"action.need.reserve": "Reserve",
	"action.need.consumption": "Verbrauch",
	"action.need.learned": "lerne ich",
	"action.need.daily": "Übliche Strecke am Tag",
	"action.need.odometer": "Kilometerstand",
	"action.need.persons": "Wessen Termine zählen",
	"action.need.no_calendars": "Noch hat niemand einen Kalender. Unter Einstellungen → Haushalt ordnest du Kalender zu.",
	"action.need.calendars": "Kalender dieses Autos",
	"calendar.own.after_save": "Nach dem Speichern lege ich in Home Assistant den Kalender „{name}“ an – Joes Kalender für dieses Auto. Jede Einladung, die ich annehme, steht dann dort, und du kannst ihn aufs Handy holen.",
	"calendar.own.hint": "„{name}“ ist Joes Kalender für dieses Auto in Home Assistant. Hier stehen die angenommenen Einladungen; du kannst auch selbst Fahrten eintragen. Aufs Handy holen:",
	"calendar.copy": "Link kopieren",
	"calendar.copied": "Kopiert",
	"calendar.renew": "Neuer Link",
	"calendar.no_external": "Zum Abonnieren muss Home Assistant von unterwegs erreichbar sein (z. B. über Home Assistant Cloud oder eine eigene Adresse).",
	"calendar.add": "Kalender wählen",
	"calendar.remove": "{name} entfernen",
	"calendar.pick": "Welche Kalender gehören zu diesem Auto?",
	"calendar.connect": "Noch nicht in Home Assistant? So verbindest du deinen Kalender:",
	"calendar.connect.google": "Google",
	"calendar.connect.caldav": "iCloud, Infomaniak, Nextcloud",
	"calendar.connect.ical": "iCal-Link",
	"calendar.connect.microsoft": "Microsoft 365 / Outlook",
	"calendar.account.client_id.needed": "Deine App bei diesem Anbieter",
	"calendar.account.no_joe_app": "Joes eigene App gibt es hier noch nicht – trag die ID deiner eigenen App ein (Anleitung im i).",
	"calendar.account.oauth.no_client_id": "Mir fehlt die App, mit der du dich anmeldest – trag oben deine eigene ein.",
	"calendar.account.oauth.expired_token": "Der Code ist abgelaufen – fang die Anmeldung neu an.",
	"calendar.account.oauth.access_denied": "Die Anmeldung wurde abgelehnt oder abgebrochen.",
	"calendar.account.oauth.authorization_declined": "Die Anmeldung wurde abgelehnt oder abgebrochen.",
	"calendar.account.oauth.invalid_client": "Diese App-ID kennt der Anbieter nicht – prüf sie (und bei Google den Clientschlüssel).",
	"calendar.account.oauth.unauthorized_client": "Diese App darf sich so nicht anmelden – bei Microsoft „Öffentliche Clientflows zulassen“ einschalten, bei Google den Typ „Fernseher und Geräte mit begrenzter Eingabe“ nehmen.",
	"calendar.account.oauth.invalid_scope": "Der Anbieter verweigert den Zugriff auf den Kalender.",
	"calendar.account.oauth.invalid_grant": "Die Anmeldung gilt nicht mehr – melde dich neu an.",
	"calendar.account.oauth.connect": "Der Anbieter war nicht erreichbar – versuch es gleich nochmal.",
	"calendar.account.oauth.no_sign_in": "Diese Art Konto meldet sich mit Passwort an, nicht mit Code.",
	"calendar.account.oauth.other": "Die Anmeldung hat nicht geklappt.",
	"calendar.account.error.no_server": "Adresse des Servers fehlt",
	"calendar.account.error.accept": "Zusage fehlgeschlagen",
	"calendar.account.error.other": "unbekannter Fehler",
	"calendar.account.result.no_sign_in": "Diese Art Konto meldet sich mit Passwort an.",
	"calendar.account.result.no_account": "Wähl zuerst die Art des Kontos.",
	"calendar.account.result.accept": "Lesen klappt, Zusagen nicht.",
	"calendar.account.result.other": "Das hat nicht geklappt.",
	"mail.allowed.placeholder": "name@example.org, @firma.de",
	"mail.error.ascii": "Passwort mit Umlauten oder Sonderzeichen",
	"mail.result.error_ascii": "Postfächer nehmen nur Passwörter ohne Umlaute und Sonderzeichen wie ä, ß oder € – nimm am besten ein App-Passwort.",
	"mail.result.error_unknown": "Das hat nicht geklappt – unbekannter Fehler.",
	"calendar.links_failed": "Die Links zu Joes Kalendern konnte ich gerade nicht laden.",
	"calendar.retry": "Nochmal",
	"calendar.copy_failed": "Kopieren ging hier nicht – der Link ist markiert, kopiere ihn selbst.",
	"calendar.own.legacy": "Joes alter Kalender für dieses Auto",
	"calendar.own.legacy.hint": "In „{name}“ stehen noch Fahrten, die du von Hand eingetragen hast. Sie zählen weiter; wenn keine mehr kommt, verschwindet der Kalender.",
	"tip.account_allowed.title": "Warum eine Liste?",
	"tip.account_allowed.text": "Sonst könnte jeder dem Auto Termine schicken. Ich sage nur Einladungen zu, deren Absender hier steht – eine Adresse oder eine ganze Domain wie „@firma.de“. Unbeantwortete Einladungen von anderen zählen nicht als Fahrt; was du selbst in den Kalender des Kontos einträgst, schon.",
	"calendar.account.kind.google": "Google (Gmail)",
	"calendar.account.placeholder.google": "kona@gmail.com",
	"calendar.account.google.hint": "Damit Einladungen ohne Antwort im Kalender erscheinen: im Google Kalender des Autos unter Einstellungen → „Einladungen zu meinem Kalender hinzufügen“ „Von allen“ wählen.",
	"calendar.account.client_secret": "Clientschlüssel der App",
	"calendar.account.result.oauth": "Die Anmeldung ließ sich nicht starten.",
	"mail.sign_in.google": "Mit Google anmelden",
	"tip.google_app.title": "Wie lege ich eine eigene Google-App an?",
	"tip.google_app.text": "Nur nötig, solange Joes eigene App fehlt – einmalig in der Google Cloud Console (console.cloud.google.com):\n1. Neues Projekt anlegen, dann „APIs und Dienste“ → Bibliothek → **Google Calendar API** aktivieren.\n2. OAuth-Zustimmungsbildschirm: Nutzertyp „Extern“, App-Name und deine Adresse; danach die App **veröffentlichen** (sonst läuft die Anmeldung nach 7 Tagen ab).\n3. Anmeldedaten → OAuth-Client-ID erstellen → Typ **„Fernseher und Geräte mit begrenzter Eingabe“**.\n4. Client-ID und Clientschlüssel hier eintragen.",
	"tip.google_app.hint": "Bei der Anmeldung warnt Google, die App sei nicht überprüft – bei deiner eigenen App ist das in Ordnung („Erweitert“ → „Weiter“).",
	"calendar.way.ha": "Fertiger Kalender",
	"calendar.way.ha.hint": "Die Termine des Autos stehen schon in einem Kalender in Home Assistant. Joe liest nur.",
	"calendar.way.mailbox": "Postfach ohne Kalender",
	"calendar.way.mailbox.hint": "Das Auto hat eine E-Mail-Adresse, z. B. bei web.de, GMX oder T-Online. Joe sagt zu und trägt die Termine in seinen Kalender ein.",
	"calendar.way.account": "Postfach mit Kalender",
	"calendar.way.account.hint": "Google, Microsoft 365, Outlook.com, iCloud oder Infomaniak: Die Termine landen im Kalender des Kontos. Joe liest ihn und sagt dort zu.",
	"calendar.own.name": "Energy Joe Kalender {car}",
	"calendar.account.password": "App-Passwort",
	"calendar.account.placeholder.outlook": "kona@outlook.com",
	"calendar.account.placeholder.microsoft": "auto@firma.de",
	"calendar.account.placeholder.icloud": "kona@icloud.com",
	"calendar.account.placeholder.infomaniak": "kona@ik.me",
	"calendar.account.placeholder.caldav": "kona@example.org",
	"flow.mailbox.title": "So kommt ein Termin über das Postfach zum Auto",
	"flow.account.title": "So kommt ein Termin über das Konto zum Auto",
	"flow.mailbox.3": "**Joe holt die Einladung** aus dem Postfach und **sagt** im Namen des Autos **zu**.",
	"flow.mailbox.4": "Joe trägt den Termin in **„{calendar}“** ein – seinen Kalender in Home Assistant.",
	"flow.account.3": "Der Termin landet **von selbst im Kalender des Kontos**.",
	"flow.account.4": "**Joe liest diesen Kalender** und sagt dort im Namen des Autos zu.",
	"flow.charge": "Joe rechnet die Strecke und **lädt rechtzeitig**.",
	"mail.address.placeholder": "kona123@web.de",
	"mail.provider.webde": "web.de",
	"mail.provider.webde.hint": "Mit dem normalen Passwort. In den web.de-Einstellungen unter „POP3/IMAP Abruf“ den Zugriff erlauben.",
	"mail.provider.gmx": "GMX",
	"mail.provider.gmx.hint": "Mit dem normalen Passwort. In den GMX-Einstellungen unter „POP3/IMAP Abruf“ den Zugriff erlauben.",
	"mail.provider.tonline": "T-Online",
	"mail.provider.tonline.hint": "Mit dem E-Mail-Passwort aus dem Telekom-Kundencenter (nicht dem Login-Passwort).",
	"mail.after_save": "Nach dem Speichern schaue ich zum ersten Mal ins Postfach – danach alle 5 Minuten.",
	"mail.allowed.none": "Noch darf niemand einladen – trag zuerst deine eigene Adresse ein.",
	"mail.result.error_no_mailbox": "Speichere das Auto zuerst.",
	"mail.state.waiting": "Noch nicht nachgeschaut.",
	"tip.mail_provider.hint": "Hat dein Anbieter einen Kalender (Google, Microsoft, iCloud, Infomaniak)? Dann ist „Postfach mit Kalender“ der bessere Weg.",
	"tip.calendar_account.hint": "Anmelden, Passwort und „Kalender lesen“ gehen schon vor dem Speichern – Fahrten liest Joe ab dem Speichern.",
	"tip.calendar_account_address.title": "Welche Adresse?",
	"tip.calendar_account_address.text": "Die Adresse des Kontos, das nur dem Auto gehört. Genau diese Adresse lädst du zu Terminen ein, wenn du mit dem Auto fährst.",
	"tip.calendar_account_url.title": "Welcher Server?",
	"tip.calendar_account_url.text": "Die CalDAV-Adresse deines Servers, z. B. bei Nextcloud https://cloud.example.org/remote.php/dav/. Die Kalender darunter finde ich selbst.",
	"tip.calendar_account_test.title": "Was macht „Kalender lesen“?",
	"tip.calendar_account_test.text": "Ich lese einmal die Termine der nächsten Woche. So siehst du sofort, ob Anmeldung und Kalender stimmen.",
	"action.need.round_trip": "Hin und zurück",
	"action.need.no_routing": "Wie weit die Termine weg sind, kann ich erst ausrechnen, wenn du unter Einstellungen → Entfernungen einen Dienst wählst. Bis dahin zählen nur Termine an einer Zone und deine übliche Strecke.",
	"action.need.pick.soc": "Welcher Sensor zeigt den Ladestand des Autos?",
	"action.need.pick.range": "Welcher Sensor zeigt die Reichweite?",
	"action.need.pick.capacity": "Welcher Sensor zeigt die Akkugröße?",
	"action.need.pick.odometer": "Welcher Sensor zeigt den Kilometerstand?",
	"action.need.pick.consumption": "Welcher Sensor zeigt den Durchschnittsverbrauch?",
	"mail.provider": "Anbieter",
	"mail.provider.google": "Gmail",
	"mail.provider.other": "Anderer Anbieter",
	"mail.provider.google.hint": "Mit einem App-Passwort. Ohne App-Passwort geht es mit „Postfach mit Kalender“ → Google.",
	"mail.provider.other.hint": "Mit Server-Adressen und Passwort deines Anbieters.",
	"mail.address": "Adresse des Autos",
	"mail.password": "Passwort",
	"mail.password.saved": "Gespeichert – zum Ändern einfach ein neues eingeben.",
	"mail.password.hint": "Bleibt bei mir, steht nie in der Konfiguration oder der Diagnose.",
	"mail.servers": "Server",
	"mail.servers.change": "Server ändern",
	"mail.servers.hint": "Benutzername (leer: die Adresse), IMAP und SMTP deines Anbieters.",
	"mail.username": "Benutzername",
	"mail.imap_host": "IMAP-Server",
	"mail.imap_port": "IMAP-Port",
	"mail.smtp_host": "SMTP-Server",
	"mail.smtp_port": "SMTP-Port",
	"mail.smtp_security": "Verschlüsselung",
	"mail.smtp_security.auto": "Automatisch",
	"mail.tenant": "Mandant",
	"mail.sign_in": "Bei Microsoft anmelden",
	"mail.sign_in.again": "Neu anmelden",
	"mail.sign_in.code": "Gib diesen Code ein: {code} –",
	"mail.sign_in.failed": "Anmeldung hat nicht geklappt ({error}).",
	"mail.signed_in": "Angemeldet – ich halte die Anmeldung selbst frisch.",
	"mail.sign_out": "Abmelden",
	"mail.allowed": "Wer darf das Auto einladen?",
	"mail.allowed.hint": "Nur Einladungen von diesen Absendern nehme ich an. Adressen oder ganze Domains wie „@firma.de“.",
	"mail.allowed.add": "Hinzufügen",
	"mail.allowed.remove": "{rule} entfernen",
	"mail.accept": "Einladungen zusagen",
	"mail.test": "Verbindung testen",
	"mail.check": "Jetzt abrufen",
	"mail.result.ok": "Anmeldung klappt – bei IMAP und SMTP.",
	"mail.result.failed": "Das hat nicht geklappt.",
	"mail.result.error_login": "Anmeldung abgelehnt – stimmen Adresse und Passwort?",
	"mail.result.error_connect": "Server nicht erreichbar – stimmen die Server-Adressen?",
	"mail.result.error_no_server": "Mir fehlt die Adresse des Servers.",
	"mail.result.error_no_secret": "Mir fehlt noch das Passwort.",
	"mail.result.error_inbox": "Der Posteingang ließ sich nicht lesen.",
	"mail.result.error_send": "Die Zusage ließ sich nicht senden.",
	"mail.recent": "Letzte Einladungen",
	"mail.recent.added": "eingetragen",
	"mail.recent.added_accepted": "eingetragen und zugesagt",
	"mail.recent.added_not_accepted": "eingetragen, Zusage fehlgeschlagen",
	"mail.recent.updated": "geändert",
	"mail.recent.updated_accepted": "geändert und zugesagt",
	"mail.recent.updated_not_accepted": "geändert, Zusage fehlgeschlagen",
	"mail.recent.cancelled": "abgesagt – entfernt",
	"mail.recent.not_allowed": "Absender nicht erlaubt",
	"mail.recent.no_time": "ohne Zeit",
	"mail.allow": "Erlauben",
	"mail.state.no_secret": "Mir fehlt noch das Passwort.",
	"mail.state.error": "Problem: {error}",
	"mail.state.ok": "Zuletzt nachgeschaut um {time} Uhr.",
	"mail.error.login": "Anmeldung abgelehnt",
	"mail.error.connect": "Server nicht erreichbar",
	"mail.error.inbox": "Posteingang nicht lesbar",
	"mail.error.no_server": "Server-Adresse fehlt",
	"mail.error.send": "Senden fehlgeschlagen",
	"mail.error.unknown": "unbekannter Fehler",
	"calendar.source": "Wie kommen Termine zum Auto?",
	"calendar.account": "Konto des Autos",
	"calendar.account.kind": "Art des Kontos",
	"calendar.account.kind.outlook": "Microsoft privat (Outlook.com, Hotmail, Live)",
	"calendar.account.kind.microsoft": "Microsoft 365 / Exchange (Firma, Schule)",
	"calendar.account.kind.icloud": "iCloud",
	"calendar.account.kind.infomaniak": "Infomaniak",
	"calendar.account.kind.caldav": "Anderer CalDAV-Server",
	"calendar.account.address": "Adresse des Kontos",
	"calendar.account.after_save": "Nach dem Speichern lese ich den Kalender des Kontos.",
	"calendar.account.client_id": "Eigene App-ID (optional)",
	"calendar.account.own_app": "Eigene App verwenden",
	"calendar.account.url": "Adresse des CalDAV-Servers",
	"calendar.account.accept": "Einladungen zusagen",
	"calendar.account.test": "Kalender lesen",
	"calendar.account.result.ok": "Klappt.",
	"calendar.account.result.no_secret": "Mir fehlt noch die Anmeldung.",
	"calendar.account.result.login": "Anmeldung abgelehnt.",
	"calendar.account.result.connect": "Server nicht erreichbar.",
	"calendar.account.result.no_calendar": "Kein Kalender gefunden.",
	"calendar.account.result.no_client_id": "Joes App für diesen Anbieter fehlt noch – trag eine eigene App ein.",
	"calendar.account.result.no_server": "Mir fehlt die Adresse des Servers.",
	"calendar.account.error.login": "Anmeldung abgelehnt",
	"calendar.account.error.connect": "Server nicht erreichbar",
	"calendar.account.error.no_calendar": "kein Kalender gefunden",
	"calendar.account.error.no_secret": "Anmeldung fehlt",
	"calendar.mailbox": "Postfach des Autos",
	"calendar.own": "Hier landen die Termine",
	"flow.invite.1": "Du legst einen Termin in **deinem Kalender** an – mit **Ort**.",
	"flow.invite.2": "Du brauchst das Auto? **Lade es ein:** {address}",
	"flow.invite.address": "die Adresse des Autos",
	"flow.calendar.title": "So liest Joe einen fertigen Kalender",
	"flow.calendar.1": "Die Fahrten mit dem Auto stehen in **einem eigenen Kalender**.",
	"flow.calendar.2": "Du **ordnest den Kalender** hier dem Auto zu.",
	"flow.calendar.3": "**Joe liest** die Termine mit Ort.",
	"settings.routing": "Entfernungen zu Terminen",
	"settings.routing.intro": "Für das Laden nach Bedarf rechne ich aus, wie weit die Orte eurer Termine weg sind. Dafür schicke ich den Ort eines Termins und euren Standort aus Home Assistant als Start der Strecke an den Dienst, den du hier wählst – nie Titel oder Beschreibung.",
	"settings.routing.service": "Dienst",
	"settings.routing.service.hint": "Einmal je Ort, danach merke ich mir die Strecke.",
	"settings.routing.none": "Nicht berechnen",
	"settings.routing.waze": "Waze (kostenlos)",
	"settings.routing.google": "Google: {name}",
	"settings.routing.osm": "OpenStreetMap (kostenlos)",
	"settings.routing.geocoder_url": "Ortssuche",
	"settings.routing.geocoder_url.hint": "Photon-Dienst, der aus dem Ort Koordinaten macht.",
	"settings.routing.router_url": "Routenplaner",
	"settings.routing.router_url.hint": "OSRM-Dienst für die Strecke mit dem Auto.",
	"need.unknown": "Ladestand und Reichweite des Autos kenne ich nicht – ich entscheide nach der Sonne. Wähle die Sensoren unter Bearbeiten.",
	"need.unknown_capacity": "Den Ladestand kenne ich, aber nicht die Akkugröße – ich entscheide nach der Sonne. Trag unter Bearbeiten die nutzbare Akkugröße ein (oder wähle einen Sensor dafür).",
	"need.too_far": "Eine volle Ladung reicht für morgen nicht – plant unterwegs einen Ladestopp ein.",
	"devices.action.reached_need": "Ziel erreicht ({target} {unit}) – für heute fertig.",
	"devices.action.why.need_capacity": "Die Akkugröße des Autos kenne ich nicht – ich entscheide nach der Sonne.",
	"need.trips": "Morgen {km} km ({count} Termine) + {reserve} km Reserve = {total} km.",
	"need.unknown_trips": "Bei {count} Termin(en) kenne ich die Entfernung noch nicht – trag sie unten ein.",
	"need.usual": "Morgen etwa {km} km wie üblich + {reserve} km Reserve = {total} km.",
	"need.reserve_only": "Morgen keine Fahrt bekannt – es bleibt bei {reserve} km Reserve.",
	"need.consumption.user": "Verbrauch {value} kWh/100 km bei {temp} °C (dein Wert).",
	"need.consumption.learned": "Verbrauch {value} kWh/100 km bei {temp} °C (gelernt).",
	"need.consumption.car": "Verbrauch {value} kWh/100 km bei {temp} °C (vom Auto).",
	"need.consumption.default": "Verbrauch {value} kWh/100 km bei {temp} °C (typischer Wert, bis ich es gelernt habe).",
	"need.rain": "Regen kostet etwas mehr.",
	"need.has_soc": "Das Auto hat {soc} % (≈ {km} km), braucht {target} %.",
	"need.has_range": "Das Auto zeigt {km} km Reichweite.",
	"need.charges": "Fehlen {kwh} kWh – ich lade sie ab {start} Uhr.",
	"need.missing": "Fehlen {kwh} kWh.",
	"need.enough": "Reicht – heute Nacht muss das Auto nicht laden.",
	"need.trips.title": "Termine morgen",
	"need.all_day": "ganztägig",
	"need.km_unknown": "Entfernung unbekannt",
	"need.km.waze": "{km} km (Waze)",
	"need.km.google": "{km} km (Google)",
	"need.km.osm": "{km} km (OpenStreetMap)",
	"need.km.zone": "{km} km (Luftlinie × 1,3)",
	"need.km.user": "{km} km (dein Wert)",
	"need.km_edit": "Entfernung nach {place} ändern",
	"need.km_one_way": "Einfache Strecke in km",
	"need.km_reset": "Neu ausrechnen",
	"learn.car": "Autos",
	"learn.car.consumption": "{value} kWh/100 km",
	"learn.car.cold": "+{value} je Grad unter 15 °C",
	"learn.car.km": "üblich {workday} km Werktag · {day_off} km frei",
	"learn.car.learning": "Ich lerne aus Kilometerstand und Ladestand der letzten Wochen.",
	"learn.car.no_odometer": "Mit einem Kilometerstand-Sensor lerne ich Verbrauch und übliche Strecke.",
	"learn.car.none": "Schalte bei einer Nacht-Aktion fürs Auto „Laden nach Bedarf“ ein, dann lerne ich, wie viel es wirklich braucht.",
	"learn.reset.scope.car": "Autos",
	"learn.reset.forget.car": "Verbrauch und übliche Strecke deiner Autos.",
	"devices.action.why.enough_range": "Das Auto hat genug für morgen – heute Nacht lade ich es nicht.",
	"devices.action.why.sun_before_trip": "Die erste Fahrt ist erst am Nachmittag, und es kommt genug Sonne – sie lädt das Auto vorher.",
	"devices.action.why.need_unknown": "Den Ladestand des Autos kenne ich nicht – ich entscheide nach der Sonne.",
	"overview.sim.last": "Letzte Nacht",
	"overview.sim.night": "Nacht zum {day}",
	"overview.sim.saved": "Hätte ich gesteuert, hättest du {value} gespart: {day} kWh weniger zum vollen Preis, dafür {night} kWh günstig in der Nacht.",
	"overview.sim.cost": "Mein Plan hätte {value} mehr gekostet. Daraus lerne ich – der Puffer passt sich an.",
	"overview.sim.same": "Mein Plan hätte keinen Unterschied gemacht – die Speicher hätten auch so gereicht.",
	"overview.sim.total": "Seit {since}: {value} an {nights}",
	"overview.sim.more": "Was ich lerne",
	"overview.sim.provisional": "vorläufig, Stand {time} Uhr",
	"history.eval": "Nachgespielt: Was mein Plan gebracht hätte",
	"history.eval.saved": "gespart",
	"history.eval.cost": "mehr gekostet",
	"history.eval.same": "kein Unterschied",
	"history.eval.day": "Zum vollen Preis gekauft",
	"history.eval.night": "Günstig in der Nacht",
	"history.eval.instead": "{with} kWh statt {without} kWh",
	"history.eval.solar": "Sonne",
	"history.eval.solar.value": "{actual} kWh, erwartet {expected} kWh",
	"history.eval.morning": "Bis zur Sonne gebraucht",
	"history.eval.morning.value": "{actual} kWh, geplant {expected} kWh",
	"history.eval.takeover": "Sonne übernahm",
	"history.eval.takeover.value": "{actual}, erwartet {expected}",
	"history.eval.clock": "{time} Uhr",
	"history.eval.never": "gar nicht",
	"history.eval.chart.with": "mit Plan",
	"history.eval.chart.without": "ohne Plan",
	"history.eval.pending": "Sobald die günstige Zeit vorbei ist, spiele ich diesen Plan mit dem echten Tag nach.",
	"history.eval.provisional": "vorläufig, Stand {time} Uhr",
	"history.eval.provisional.note": "Die Stunden ab {time} Uhr spiele ich so, wie ich sie erwarte. Wenn der Tag vorbei ist, steht das Ergebnis fest.",
	"history.eval.incomplete": "Für diese Nacht fehlen mir zu viele Stunden – nachspielen ging nicht.",
	"tip.sim_result.title": "Wie rechne ich das?",
	"tip.sim_result.text": "Am Morgen spiele ich den Plan der Nacht mit dem echten Tag nach: echte Sonne, echter Verbrauch – einmal mit Plan, einmal ohne. Der Unterschied ist das, was das Steuern gebracht hätte, egal wie gut die Prognose war.\nBis der Tag vorbei ist, ist das Ergebnis **vorläufig**: Die restlichen Stunden spiele ich so, wie ich sie erwarte.",
	"tip.sim_result.hint": "Gerechnet mit deinen Preisen aus den Einstellungen.",
	"tip.learn_solar.title": "Was ist der Prognose-Faktor?",
	"tip.learn_solar.text": "Ich vergleiche jeden Tag die Prognose vom Vorabend mit dem, was deine Anlage geliefert hat, und nehme den mittleren Wert der letzten vier Wochen. Ausreißer wie ein verschneites Dach fallen so kaum ins Gewicht. Jede neue Prognose rechne ich damit um.",
	"tip.learn_shift.title": "Was ist der Zeitversatz?",
	"tip.learn_shift.text": "Manche Prognosen geben ihre Stunden mit dem Ende statt dem Anfang an – dann liegen sie eine Stunde daneben. Ich prüfe jeden Tag, ob die Kurve um eine Stunde verschoben besser passt, und verschiebe sie erst, wenn das an den meisten Tagen klar so ist.",
	"tip.learn_buffer.title": "Wozu der Puffer?",
	"tip.learn_buffer.text": "Ich lade etwas mehr, als nötig wäre – für Morgen, an denen ihr mehr braucht oder die Sonne später kommt. Wie viel, lerne ich aus den nachgespielten Nächten: so viel, dass es an 8 von 10 Morgen gereicht hätte. Zu viel Puffer kostet Geld, zu wenig auch.",
	"tip.learn_buffer.hint": "Einen eigenen Wert stellst du unter Einstellungen → Regeln ein.",
	"tip.learn_buffer_own.title": "Was passiert dann?",
	"tip.learn_buffer_own.text": "Ich nehme wieder meinen gelernten Puffer und passe ihn jeden Morgen an. Habe ich noch keinen gelernt, fange ich mit meinem Startwert an.",
	"tip.learn_home.title": "Was sehe ich hier?",
	"tip.learn_home.text": "Wie viel ihr im Schnitt pro Stunde verbraucht – an Arbeitstagen und an freien Tagen. Damit rechne ich aus, wie viel die Speicher bis zur Sonne liefern müssen.",
	"tip.learn_accuracy.title": "Was sehe ich hier?",
	"tip.learn_accuracy.text": "Für jede nachgespielte Nacht: wie viel **Sonne** ich erwartet habe und wie viel kam, wie viel die Speicher **bis zur Sonne** liefern sollten und mussten und was der Plan **gebracht** hätte.",
	"tip.learn_reset.title": "Wann neu anfangen?",
	"tip.learn_reset.text": "Wenn sich bei dir viel geändert hat – neue Module, ein anderer Speicher, ein neues Auto. Dann soll ich nicht mehr aus der alten Zeit lernen.",
	"tip.ask_day.title": "Was passiert mit meiner Antwort?",
	"tip.ask_day.text": "Besuch, unterwegs oder etwas anderes Besonderes: Diesen Tag lasse ich beim Lernen weg, damit er mein Bild von einem normalen Tag nicht verzerrt.\n**Ganz normaler Tag**: Dann lerne ich ihn mit – vielleicht braucht ihr inzwischen einfach mehr oder weniger.",
	"tip.learn_model.title": "Wie rechne ich mit dem Wetter?",
	"tip.learn_model.text": "Ich lege eine einfache Rechnung über eure Tage: ein Grundverbrauch, dazu Arbeitstag oder frei und ein Aufschlag für jedes Grad unter 15 °C (Heizen) oder über 22 °C (Kühlen). Mit der Wettervorhersage für morgen rechne ich so aus, ob ihr mehr oder weniger braucht als an einem üblichen Tag.\nTage, an denen etwas Besonderes los war, lasse ich weg.",
	"tip.learn_model.hint": "Die Prozentzahl sagt, wie gut die Rechnung zu euren Tagen passt. Unter 40 % nutze ich sie nicht.",
	"tip.learn_weather.title": "Warum nach Wetterlage?",
	"tip.learn_weather.text": "Viele Prognosen liegen an klaren Tagen gut und an trüben deutlich daneben – oder umgekehrt. Deshalb merke ich mir für klare, wechselhafte und trübe Tage einen eigenen Faktor und nehme für morgen den, der zur Prognose passt. Die Grenzen wandern mit der Jahreszeit.",
	"tip.learn_combine.title": "Was heißt kombinieren?",
	"tip.learn_combine.text": "Jede Prognose rechne ich erst mit ihrem eigenen Faktor um. Dann zählt jede so viel, wie gut sie bisher getroffen hat: Eine Quelle, die selten danebenliegt, zählt mehr als eine, die stark schwankt.\n**Aus**: Ich nehme nur die Hauptprognose.",
	"tip.learn_battery.title": "Was messe ich am Speicher?",
	"tip.learn_battery.text": "Wie viel Energie wirklich hineinpasst und wie viel beim Laden und Entladen verloren geht. Ältere Speicher fassen oft weniger als auf dem Typenschild. Beides fließt in den Plan ein – außer du hast die Größe selbst eingetragen.",
	"tip.learn_groups.title": "Wozu eine Rechnung je Gerät?",
	"tip.learn_groups.text": "So sehe ich, welches Gerät bei Kälte mehr braucht. Läuft ein Gerät per Nacht-Aktion in der günstigen Zeit, verschiebe ich genau so viel von seinem Tagesverbrauch in die Nacht, wie es morgen voraussichtlich braucht.",
	"tip.learn_hot_water.title": "Was lerne ich am Warmwasser?",
	"tip.learn_hot_water.text": "Wie schnell der Speicher heizt, wie viel er im Stehen verliert und wie viele Grad ihr am Tag verbraucht. Daraus rechne ich die Zieltemperatur für die Nacht und wann das Heizen starten muss, damit es zum Ende der günstigen Zeit fertig ist.",
	"tip.learn_presence.title": "Wozu die Anwesenheit?",
	"tip.learn_presence.text": "Aus euren Kalendern lese ich, was morgen ansteht – Büro, Homeoffice, Urlaub. Wie viele Stunden jemand an solchen Tagen zu Hause ist, lerne ich aus der Personen-Entität. Wer zu Hause ist, verbraucht mehr; das fließt in die Rechnung für morgen ein.",
	"tip.learn_calendar.title": "Wie lese ich eure Kalender?",
	"tip.learn_calendar.text": "Für jede Person schaue ich in ihre Kalender, ganztägige Termine zuerst. Das erste passende Stichwort bestimmt die Art des Tages. Passt ein Termin zu mehreren Arten, gilt die obere Zeile.\nGroß- und Kleinschreibung spielt keine Rolle.",
	"tip.cal_defaults.title": "Und ohne Termin?",
	"tip.cal_defaults.text": "Findet sich kein passender Termin, nehme ich diese Art – je nachdem, ob der Tag ein Arbeitstag oder ein freier Tag ist.",
	"tip.learn_reset_scope.title": "Welchen Bereich?",
	"tip.learn_reset_scope.text": "**Sonne** nach neuen Modulen oder einer anderen Prognose, **Verbrauch** nach einem Umzug oder einer neuen Heizung, **Speicher** nach einem Tausch oder einer Erweiterung, **Warmwasser** nach einem neuen Boiler. **Alles**, wenn sich vieles geändert hat.",
	"tip.a_need.title": "Was heißt nach Bedarf?",
	"tip.a_need.text": "Statt bei wenig Sonne einfach die ganze günstige Zeit zu laden, rechne ich: Kilometer morgen (Termine mit Ort hin und zurück oder deine übliche Strecke, je nachdem, was mehr ist) plus Reserve, mal Verbrauch bei der vorhergesagten Temperatur. Fehlt dem Auto etwas, lade ich genau das – und höre auf, sobald der Ladestand erreicht ist.\n**Aus**: wie bisher nach der Sonne.",
	"tip.a_need.hint": "„Heute Nacht“ von Hand lädt immer die ganze günstige Zeit.",
	"tip.a_need_soc.title": "Wozu der Ladestand?",
	"tip.a_need_soc.text": "Mit Ladestand und Akkugröße weiß ich, wie viel Energie im Auto steckt. Den Sensor liefert die Auto-Integration (z. B. Tesla, Kia, VW, BMW, Volvo) oder evcc.",
	"tip.a_need_range.title": "Wozu die Reichweite?",
	"tip.a_need_range.text": "Kenne ich die Akkugröße nicht, nehme ich die Reichweite, die das Auto selbst anzeigt. Meilen rechne ich in Kilometer um.",
	"tip.a_need_capacity.title": "Welche Akkugröße?",
	"tip.a_need_capacity.text": "Die nutzbare Größe in kWh, nicht die brutto angegebene. Viele Auto-Integrationen haben einen Sensor dafür – sonst trag den Wert aus dem Datenblatt ein.",
	"tip.a_need_reserve.title": "Wozu die Reserve?",
	"tip.a_need_reserve.text": "Keiner will mit leerem Akku ankommen. So viele Kilometer bleiben immer übrig – auch für Unerwartetes. Bei Kälte rechne ich die Reserve mit dem höheren Verbrauch.",
	"tip.a_need_consumption.title": "Woher kommt der Verbrauch?",
	"tip.a_need_consumption.text": "Am besten gelernt: Aus Kilometerstand und Ladestand sehe ich, wie viel dein Auto wirklich braucht – auch, wie viel mehr bei Kälte. Bis dahin nehme ich den Durchschnitt, den das Auto selbst anzeigt, sonst 18 kWh/100 km (typischer Wert laut ADAC-Messungen). Kälte und Regen rechne ich dazu.\nTrägst du einen Wert ein, gilt er bei mildem Wetter; Kälte rechne ich trotzdem dazu.",
	"tip.a_need_daily.title": "Welche übliche Strecke?",
	"tip.a_need_daily.text": "Was das Auto an einem normalen Tag fährt – auch ohne Termin im Kalender, zum Beispiel zur Arbeit. Leer lasse ich es aus dem Kilometerstand lernen, getrennt für Werktage und freie Tage.",
	"tip.a_need_odometer.title": "Wozu der Kilometerstand?",
	"tip.a_need_odometer.text": "Damit lerne ich den echten Verbrauch und die übliche Strecke. Bei manchen Integrationen (z. B. Tesla) ist der Sensor erst ausgeschaltet – schalte ihn in Home Assistant ein.",
	"tip.a_need_persons.title": "Wessen Termine?",
	"tip.a_need_persons.text": "Termine mit Ort aus den Kalendern dieser Personen zählen als Fahrt mit diesem Auto. Termine online (Teams, Zoom & Co.) lasse ich weg.",
	"tip.a_need_calendars.title": "Woher weiß ich, welches Auto fährt?",
	"tip.a_need_calendars.text": "Jeder Termin mit Ort im Kalender dieses Autos ist eine Fahrt mit genau diesem Auto – das ist genauer als die Kalender der Personen. Wie die Termine zum Auto kommen, wählst du hier.",
	"tip.calendar_own.title": "Joes Kalender für dieses Auto",
	"tip.calendar_own.text": "Ein ganz normaler Kalender in Home Assistant. Jede Einladung, die ich im Postfach des Autos annehme, trage ich hier ein; ändert sich ein Termin oder wird er abgesagt, ändere oder entferne ich ihn. Du kannst auch selbst Fahrten eintragen.",
	"tip.calendar_link.title": "Was ist der Link?",
	"tip.calendar_link.text": "Damit abonnierst du den Kalender auf dem Handy (iPhone: Einstellungen → Kalender → Accounts → Kalenderabo hinzufügen; Google Kalender: Andere Kalender → Per URL). Der Link enthält einen geheimen Schlüssel – gib ihn nicht weiter.",
	"tip.calendar_link.hint": "„Neuer Link“ macht den alten ungültig.",
	"tip.calendar_more.title": "Welcher Kalender?",
	"tip.calendar_more.text": "Ein Kalender, in dem nur die Fahrten dieses Autos stehen – zum Beispiel ein geteilter Google- oder iCloud-Kalender „Auto“. Jeder Termin mit Ort darin zählt als Fahrt mit diesem Auto; ein Familienkalender passt deshalb nicht.",
	"tip.calendar_connect.title": "Wie kommt mein Kalender nach Home Assistant?",
	"tip.calendar_connect.text": "**Google**: Google-Kalender-Integration.\n**iCloud, Infomaniak, Nextcloud**: CalDAV-Integration (bei iCloud mit App-Passwort).\n**iCal-Link**: Remote Calendar – jeder Kalender mit Abo-Link.\n**Microsoft 365 / Outlook**: über HACS die Integration „Microsoft 365 Calendar“ (Exchange Online und private Konten).\nDie Knöpfe öffnen die Einrichtung in Home Assistant.",
	"tip.a_need_round_trip.title": "Hin und zurück?",
	"tip.a_need_round_trip.text": "Meist fährt man zum Termin und wieder heim – dann zähle ich die Strecke doppelt.",
	"tip.mail_provider.title": "Was muss ich beim Anbieter tun?",
	"tip.mail_provider.text": "**web.de und GMX**: in den Einstellungen unter „POP3/IMAP Abruf“ den Zugriff erlauben, dann reicht das normale Passwort.\n**Gmail**: myaccount.google.com → Sicherheit → Bestätigung in zwei Schritten einschalten → App-Passwörter.\n**T-Online**: im Kundencenter ein E-Mail-Passwort anlegen.\n**Anderer Anbieter**: IMAP und SMTP stehen in dessen Hilfe.",
	"tip.mail_address.title": "Welche Adresse?",
	"tip.mail_address.text": "Eine eigene Adresse nur für dieses Auto, z. B. kona123@web.de. Genau diese Adresse lädst du zu Terminen ein, wenn du mit dem Auto fährst. Ich lese nur Einladungen und lasse andere Mails in Ruhe.",
	"tip.mail_password.title": "Ist das sicher?",
	"tip.mail_password.text": "Das Passwort liegt in einem eigenen Speicher von Home Assistant, nicht in Joes Konfiguration und nicht in der Diagnose. Ein App-Passwort kannst du beim Anbieter jederzeit widerrufen.",
	"tip.mail_servers.title": "Welche Server?",
	"tip.mail_servers.text": "Für web.de, GMX, Gmail und T-Online kenne ich sie. Bei anderen Anbietern stehen IMAP und SMTP in deren Hilfe – meist IMAP-Port 993 und SMTP-Port 587 (STARTTLS) oder 465 (SSL).",
	"tip.mail_microsoft.title": "Wie lege ich die App an?",
	"tip.mail_microsoft.text": "Nötig, solange Joes eigene App fehlt – oder wenn deine Firma sie nicht zulässt. Einmalig in Microsoft Entra (entra.microsoft.com):\n1. App-Registrierungen → Neue Registrierung, Kontotyp „Konten in einem beliebigen Organisationsverzeichnis und persönliche Microsoft-Konten“.\n2. Authentifizierung → „Öffentliche Clientflows zulassen“ auf Ja.\n3. API-Berechtigungen → Microsoft Graph → delegiert: Calendars.ReadWrite, User.Read, offline_access.\n4. Die Anwendungs-ID hier eintragen; bei Microsoft 365 daneben den Mandanten (Domain oder ID der Firma).",
	"tip.mail_sign_in.title": "Wie melde ich mich an?",
	"tip.mail_sign_in.text": "Ich zeige dir einen kurzen Code und einen Link. Öffne den Link auf einem beliebigen Gerät, gib den Code ein und melde dich mit dem Konto des Autos an. Danach erneuere ich die Anmeldung selbst – Home Assistant muss dafür nicht von außen erreichbar sein.",
	"tip.mail_allowed.title": "Warum eine Liste?",
	"tip.mail_allowed.text": "Sonst könnte jeder dem Auto Termine schicken. Ich nehme nur Einladungen, deren Absender hier steht – eine Adresse oder eine ganze Domain wie „@firma.de“.",
	"tip.mail_allowed.hint": "Abgelehnte Einladungen stehen beim Postfach unter „Letzte Einladungen“ – dort erlaubst du den Absender mit einem Klick. Nach dem Speichern lese ich das Postfach dann noch einmal.",
	"tip.mail_accept.title": "Was heißt zusagen?",
	"tip.mail_accept.text": "Ich schicke eine Zusage zurück, wie ein Mensch es täte. Wer eingeladen hat, sieht dann, dass das Auto dabei ist.",
	"tip.mail_status.title": "Was sehe ich hier?",
	"tip.mail_status.text": "**Verbindung testen** meldet sich einmal bei IMAP und SMTP an. **Jetzt abrufen** schaut sofort nach neuen Einladungen, statt auf die nächsten Minuten zu warten.",
	"tip.mail_recent.title": "Was ist mit den Einladungen passiert?",
	"tip.mail_recent.text": "Die letzten Einladungen und was ich damit gemacht habe: eingetragen, geändert, abgesagt – oder warum nicht.",
	"tip.calendar_account.title": "Was brauche ich dafür?",
	"tip.calendar_account.text": "**Google** und **Microsoft**: anmelden mit einem kurzen Code – Joe sieht dein Passwort nie. Solange Joes eigene App fehlt, brauchst du dafür eine eigene App beim Anbieter (Anleitung im i am Feld).\n**iCloud**: ein App-Passwort von appleid.apple.com.\n**Infomaniak**: das Passwort des Kontos oder ein Gerätepasswort.\n**Anderer CalDAV-Server**: Adresse, Benutzername und Passwort.",
	"tip.calendar_account_accept.title": "Was heißt zusagen?",
	"tip.calendar_account_accept.text": "Ich sage Einladungen im Kalender des Kontos zu – aber nur von Absendern, die unten bei „Wer darf das Auto einladen?“ stehen. Unbeantwortete Einladungen von anderen zählen nicht als Fahrt.",
	"tip.calendar_account_password.title": "Welches Passwort?",
	"tip.calendar_account_password.text": "**iCloud**: ein App-spezifisches Passwort (appleid.apple.com → Anmeldung und Sicherheit).\n**Infomaniak**: das Passwort des Kontos oder ein Gerätepasswort.\nEs liegt bei mir in einem eigenen Speicher, nicht in der Konfiguration.",
	"tip.calendar_source.title": "Welcher Weg passt zu mir?",
	"tip.calendar_source.text": "**Fertiger Kalender**: Das Auto hat schon einen eigenen Kalender, in dem nur seine Fahrten stehen (z. B. einen geteilten Kalender „Auto“), und der ist in Home Assistant. Du ordnest ihn zu, Joe liest nur.\n**Postfach ohne Kalender**: Das Auto bekommt eine eigene E-Mail-Adresse, z. B. bei web.de oder GMX. Du lädst sie zu deinen Terminen ein; Joe holt die Einladung, sagt zu und trägt den Termin in seinen eigenen Kalender für das Auto ein.\n**Postfach mit Kalender**: Wie eben, aber das Konto hat selbst einen Kalender (Google, Microsoft, iCloud, Infomaniak). Die Einladung landet dort von selbst; Joe liest diesen Kalender und sagt dort zu.",
	"tip.calendar_source.hint": "Dazu kommen immer die Kalender der Personen, die du oben auswählst.",
	"tip.routing_service.title": "Welcher Dienst?",
	"tip.routing_service.text": "**Waze**: kostenlos, ohne Anmeldung, über Home Assistants eigene Waze-Aktion.\n**Google**: braucht eine eingerichtete „Google Maps Travel Time“-Integration mit API-Schlüssel; schalte dort das Abfragen alle 10 Minuten aus, sonst sind die Freiabfragen schnell weg.\n**OpenStreetMap**: kostenlos, freie Karte; dafür findet Photon den Ort und OSRM die Strecke.\nIch frage jeden Ort nur einmal und merke mir die Strecke. Liegt ein Termin an einer Zone aus Home Assistant, brauche ich keinen Dienst.",
	"tip.routing_service.hint": "Geschickt werden nur der Ort eines Termins und euer Standort als Start der Strecke, nie Titel oder Beschreibung.",
	"tip.routing_osm.title": "Was ist das?",
	"tip.routing_osm.text": "Die Adressen der freien OpenStreetMap-Dienste. Sie stehen hier, damit du auf einen eigenen oder anderen Server wechseln kannst, ohne auf ein Update zu warten.",
	"tip.need_trips.title": "Woher kommen die Kilometer?",
	"tip.need_trips.text": "Aus den Orten eurer Termine morgen, ausgerechnet mit dem Dienst aus den Einstellungen. Passt eine Strecke nicht, trag die einfache Strecke ein – die merke ich mir für diesen Ort.",
	"tip.learn_car.title": "Was lerne ich am Auto?",
	"tip.learn_car.text": "Aus Kilometerstand und Ladestand: wie viel Energie das Auto pro 100 km wirklich braucht, wie viel mehr bei Kälte und wie weit es an einem üblichen Werktag und freien Tag fährt. Daraus rechne ich, was es morgen braucht.",
	"tip.chart_replay.title": "Was sehe ich hier?",
	"tip.chart_replay.text": "Wie voll die Speicher an diesem Tag **mit meinem Plan** gewesen wären und wie voll **ohne**. Beides nachgespielt mit der echten Sonne und deinem echten Verbrauch.",
	"mode.advisory": "Vorschlagen",
	"mode.advisory.sub": "Joe fragt jeden Abend",
	"mode.advisory.desc": "Ich frage dich jeden Abend, ob ich die Nacht steuern darf. Ohne dein Ja schalte ich nichts.",
	"mode.untested": "Noch ohne Testlauf: {names}. Die schaue ich nur an, bis der Testlauf auf der Seite Geräte geklappt hat.",
	"mode.none_tested": "Noch hat kein Speicher den Testlauf bestanden – ich würde nur zuschauen. Mach zuerst den Testlauf auf der Seite Geräte.",
	"settings.notify": "Benachrichtigungen",
	"settings.notify.intro": "Probleme zeige ich immer in den Benachrichtigungen von Home Assistant. Aufs Handy schicke ich nur, was du hier einschaltest.",
	"settings.notify.service": "Handy oder Dienst",
	"settings.notify.service.hint": "Wohin ich schreibe, z. B. die Home-Assistant-App auf deinem Handy.",
	"settings.notify.none": "Nirgendwohin",
	"settings.notify.gone": "{name} – gibt es nicht mehr, bitte neu wählen",
	"settings.notify.ask": "Abends fragen",
	"settings.notify.ask.hint": "Im Modus Vorschlagen, mit „Ja“ und „Heute nicht“ direkt in der Nachricht.",
	"settings.notify.problems": "Probleme melden",
	"settings.notify.problems.hint": "Wenn ich etwas nicht zurückstellen kann oder ein Speicher nicht reagiert.",
	"settings.notify.morning": "Morgens berichten",
	"settings.notify.morning.hint": "Was ich in der Nacht gesteuert habe.",
	"settings.ask_time": "Frage um",
	"settings.ask_time.hint": "Wann ich im Modus Vorschlagen frage.",
	"devices.page.title": "Deine |Geräte",
	"devices.lead": "Hier steuere ich deine Speicher – mit Testlauf und allem, was ich gerade mit ihnen mache.",
	"devices.now": "Gerade",
	"devices.status.simulation": "Simulation – ich schalte nichts und schreibe nur auf, was ich täte.",
	"devices.status.off": "Pause – ich schalte nichts.",
	"devices.status.steering": "Ich steuere gerade.",
	"devices.status.waiting": "Ich steuere heute Nacht ab {time} Uhr.",
	"devices.status.unanswered": "Ich warte auf deine Antwort für heute Nacht.",
	"devices.status.declined": "Heute Nacht nicht – das hast du so entschieden.",
	"devices.status.skipped": "Heute Nacht setze ich aus.",
	"devices.status.nothing": "Heute Nacht gibt es nichts zu tun.",
	"devices.status.no_plan": "Noch kein Plan für heute Nacht.",
	"devices.status.day": "Netzdienlich: Ich halte das Laden der Speicher bis {time} Uhr zurück – die Morgensonne geht ins Netz.",
	"devices.status.done": "Die Nacht ist vorbei, alles ist zurückgestellt.",
	"devices.pending": "Ein paar Werte stehen noch nicht wieder auf ihrem Ausgangswert. Ich versuche es weiter.",
	"devices.power.charge": "lädt mit {value} kW",
	"devices.power.discharge": "entlädt mit {value} kW",
	"devices.power.idle": "ruht",
	"devices.release": "Sofort freigeben",
	"devices.batteries": "Speicher",
	"devices.batteries.none": "Ich kenne noch keinen Speicher. Füg ihn in den Einstellungen hinzu.",
	"devices.battery.profile": "{name} – erkannt",
	"devices.battery.generic": "Regler zugeordnet",
	"devices.battery.steps": "Eigene Schritte",
	"devices.battery.watch": "Nur beobachten",
	"devices.action.charge": "Lädt auf {target} %",
	"devices.action.hold": "Hält bei {floor} %",
	"devices.action.block": "Entladen gesperrt, solange ein anderer lädt",
	"devices.action.defer": "Lädt erst ab {until} Uhr – die Morgensonne geht ins Netz",
	"devices.action.free": "Frei – ich greife nicht ein",
	"devices.action.watch": "Nur beobachtet",
	"devices.action.idle": "Frei – ich greife gerade nicht ein",
	"devices.problem.not_tested": "Testlauf fehlt – bis dahin schaue ich nur zu.",
	"devices.problem.not_controllable": "Diesen Speicher kann ich nicht steuern.",
	"devices.problem.controls_missing": "Regler fehlen oder sind gerade nicht erreichbar.",
	"devices.problem.soc_unknown": "Den Ladestand kenne ich gerade nicht.",
	"devices.problem.not_taken": "Der Speicher übernimmt meine Werte nicht.",
	"devices.problem.unavailable": "Ein Regler ist nicht erreichbar.",
	"devices.problem.failed": "Ein Wert ließ sich nicht schreiben.",
	"devices.problem.timeout": "Das Gerät antwortet nicht.",
	"devices.problem.missing": "Ein Regler fehlt in Home Assistant.",
	"devices.problem.option": "Die Betriebsart kennt die Option nicht.",
	"devices.test.start": "Testlauf starten",
	"devices.test.again": "Nochmal testen",
	"devices.test.ok": "Testlauf bestanden am {day}",
	"devices.test.failed": "Testlauf nicht bestanden am {day}",
	"devices.test.none": "Noch kein Testlauf",
	"devices.test.outdated": "Steuerung geändert – bitte neu testen",
	"devices.test.running": "Testlauf läuft …",
	"devices.test.step.check": "Prüfen",
	"devices.test.step.hold": "Halten",
	"devices.test.step.charge": "Laden",
	"devices.test.step.release": "Freigeben",
	"devices.test.power": "{value} kW gemessen",
	"devices.test.no_power": "keine Leistung gemessen",
	"devices.test.wrong": "nicht übernommen: {entities}",
	"devices.test.error": "Fehler: {entities}",
	"devices.test.problem.controls_missing": "Es fehlen Regler: {missing}.",
	"devices.test.problem.soc_unknown": "Den Ladestand kenne ich gerade nicht – ohne ihn teste ich nicht.",
	"devices.test.confirm.title": "Testlauf für |{name}",
	"devices.test.confirm.text": "Ich halte den Speicher 20 Sekunden lang fest, lade ihn dann 25 Sekunden mit kleiner Leistung aus dem Netz und stelle danach alles zurück. Jeden Wert lese ich zurück. Das dauert etwa eine Minute und kostet höchstens ein paar Cent.",
	"devices.test.confirm.go": "Testlauf starten",
	"devices.setup": "Regler einrichten",
	"devices.suggested": "Ich habe Regler gefunden, die passen könnten. Prüf sie unter „Regler einrichten“ und mach dann den Testlauf.",
	"devices.log": "Was ich geschaltet habe",
	"devices.log.empty": "Noch nichts – sobald ich steuere oder teste, steht es hier.",
	"log.start": "Nacht beginnt",
	"log.set": "{battery}: {entity} → {value}",
	"log.reached": "{battery} hat {target} % erreicht",
	"log.external": "{entity} hat jemand anderes geändert – ich lasse es so",
	"log.released": "Alles zurückgestellt",
	"log.release_failed": "Zurückstellen hat noch nicht ganz geklappt",
	"log.failed": "{battery}: {entity} ließ sich nicht schreiben",
	"log.emergency": "Sofort freigegeben",
	"log.skip": "Heute Nacht ausgesetzt",
	"log.unskip": "Doch gesteuert",
	"log.answer.yes": "Deine Antwort: Ja",
	"log.answer.no": "Deine Antwort: heute nicht",
	"log.ask": "Gefragt, ob ich steuern darf",
	"log.test.ok": "Testlauf {battery}: bestanden",
	"log.test.failed": "Testlauf {battery}: nicht bestanden",
	"f.battery.control.watch": "Nur beobachten",
	"f.battery.control.profile": "Automatisch ({name})",
	"f.battery.control.generic": "Regler zuordnen",
	"f.battery.control.steps": "Eigene Schritte",
	"f.battery.control.suggested": "Ich habe Regler gefunden, die passen könnten.",
	"f.battery.control.take": "Vorschlag übernehmen",
	"f.battery.control.ready": "Laden über: {charge} · Halten über: {hold}",
	"f.battery.control.needs": "Damit ich steuern kann, brauche ich einen Weg zum Laden (Betriebsart mit Zwangsladen oder „Laden aus dem Netz“ mit „Laden bis“) und einen zum Halten (Mindest-Ladestand, Betriebsart oder Entladegrenze).",
	"f.battery.control.retest": "Nach jeder Änderung braucht es einen neuen Testlauf auf der Seite Geräte.",
	"f.battery.control.services": "So steuere ich ihn (über Dienste)",
	"f.battery.control.levers": "Regler",
	"f.battery.mode_options": "Was bedeuten die Optionen?",
	"f.battery.steps.charge": "Zum Laden",
	"f.battery.steps.hold": "Zum Halten",
	"f.battery.steps.release": "Zum Freigeben (leer: alles zurück)",
	"f.battery.steps.add": "Schritt",
	"f.battery.steps.value": "Wert",
	"f.battery.steps.hint": "Statt einer Zahl gehen auch {target} (Ziel), {floor} (Untergrenze) und {power} (Leistung in W).",
	"f.remove": "Entfernen",
	"role.min_soc": "Mindest-Ladestand",
	"role.charge_target": "Laden bis",
	"role.grid_charge": "Laden aus dem Netz",
	"role.mode": "Betriebsart",
	"role.charge_power": "Ladeleistung",
	"role.discharge_power": "Entladeleistung",
	"role.discharge_limit": "Entladegrenze",
	"role.discharge_limit_enabled": "Entladegrenze aktiv",
	"role.charge_limit": "Ladegrenze",
	"role.charge_limit_enabled": "Ladegrenze aktiv",
	"method.mode": "Zwangsladen",
	"method.target": "Laden aus dem Netz bis Ziel",
	"method.min_soc": "Mindest-Ladestand",
	"method.mode_hold": "Betriebsart Halten",
	"method.standby": "Zwangsladen mit 0 W",
	"method.limit": "Entladegrenze",
	"meaning.normal": "Normalbetrieb",
	"meaning.force_charge": "Zwangsladen",
	"meaning.hold": "Halten",
	"meaning.force_discharge": "Zwangsentladen",
	"meaning.none": "–",
	"pick.role.title": "{role} – welcher Regler?",
	"pick.step.title": "Welches Gerät oder Skript?",
	"plan.steer.live": "Live: Ich steuere heute Nacht.",
	"plan.steer.advisory": "Darf ich heute Nacht steuern?",
	"plan.steer.yes": "Ja, mach",
	"plan.steer.no": "Heute nicht",
	"plan.steer.answered_yes": "Du hast Ja gesagt – ich steuere heute Nacht.",
	"plan.steer.answered_no": "Heute Nacht nicht – deine Antwort.",
	"plan.steer.skip": "Heute aussetzen",
	"plan.steer.unskip": "Doch steuern",
	"plan.steer.skipped": "Heute Nacht setze ich aus.",
	"plan.steer.untested": "Ohne Testlauf schaue ich {names} nur an.",
	"tip.devices_release.title": "Was passiert dann?",
	"tip.devices_release.text": "Ich stelle sofort alles zurück, was ich gesetzt habe, und steuere heute Nacht nicht mehr. Ab der nächsten Nacht geht es normal weiter.",
	"tip.devices_test.title": "Wozu der Testlauf?",
	"tip.devices_test.text": "Bevor ich einen Speicher wirklich steuere, prüfe ich einmal, ob er macht, was ich ihm sage: kurz halten, kurz laden, alles zurück – und jeden Wert lese ich zurück. Erst danach steuere ich ihn in den Modi Vorschlagen und Live.",
	"tip.devices_test.hint": "Nach jeder Änderung an den Reglern teste ich neu.",
	"tip.devices_setup.title": "Was richte ich da ein?",
	"tip.devices_setup.text": "Welche Regler deines Speichers ich zum Laden und Halten benutze. Für bekannte Geräte weiß ich das selbst, für andere schlage ich passende vor.",
	"tip.control_choice.title": "Wie steuere ich den Speicher?",
	"tip.control_choice.text": "**Nur beobachten** – ich schalte nichts.\n**Automatisch** – ich kenne dieses Gerät und weiß, welche Regler ich nehme.\n**Regler zuordnen** – du zeigst mir die Regler (Mindest-Ladestand, Betriebsart, Laden aus dem Netz …), ich mache den Rest.\n**Eigene Schritte** – für Geräte, die nur über Skripte oder besondere Werte gehen.",
	"tip.control_roles.title": "Welche Regler brauche ich?",
	"tip.control_roles.text": "Einen Weg zum **Laden** und einen zum **Halten**. Laden geht über eine Betriebsart mit Zwangsladen (mit Ladeleistung) oder über „Laden aus dem Netz“ mit „Laden bis“. Halten geht über den Mindest-Ladestand, eine Betriebsart oder eine Entladegrenze. Alles andere ist ein Bonus.",
	"tip.control_roles.hint": "Was ich verändere, stelle ich am Ende jeder Nacht wieder zurück.",
	"tip.mode_options.title": "Wozu die Zuordnung?",
	"tip.mode_options.text": "Jedes Gerät nennt seine Betriebsarten anders. Sag mir, welche Option „normal“ ist und welche „Zwangsladen“ – dann weiß ich, was ich wählen und wohin ich zurückstellen muss.",
	"tip.control_steps.title": "Wie funktionieren Schritte?",
	"tip.control_steps.text": "Für jede Lage eine Liste: Gerät und Wert, oder ein Skript. Beim Laden kann der Wert {target} (das Ziel in %) oder {power} (Leistung in W) sein, beim Halten {floor}. Ohne Freigabe-Schritte stelle ich einfach alles zurück, was ich verändert habe.",
	"tip.plan_steer.title": "Was heißt das?",
	"tip.plan_steer.text": "In der Simulation schalte ich nichts. Bei **Vorschlagen** steuere ich nur, wenn du für diese Nacht Ja sagst. Bei **Live** steuere ich jede Nacht – aber nur Speicher, deren Testlauf geklappt hat. Mit **Heute aussetzen** lasse ich eine Nacht aus.",
	"tip.notify_service.title": "Wohin schreibe ich?",
	"tip.notify_service.text": "An einen Benachrichtigungsdienst von Home Assistant, meist die App auf deinem Handy. Probleme stehen sowieso immer in den Benachrichtigungen von Home Assistant.",
	"tip.notify_ask.title": "Was frage ich?",
	"tip.notify_ask.text": "Im Modus Vorschlagen frage ich jeden Abend, ob ich die Nacht steuern darf – mit den Knöpfen „Ja“ und „Heute nicht“ direkt in der Nachricht.",
	"tip.notify_problems.title": "Welche Probleme?",
	"tip.notify_problems.text": "Wenn ich Werte nicht zurückstellen kann oder ein Speicher nicht tut, was ich ihm sage.",
	"tip.notify_morning.title": "Was berichte ich?",
	"tip.notify_morning.text": "Nach einer gesteuerten Nacht: wie weit ich die Speicher geladen habe und dass alles wieder zurückgestellt ist.",
	"tip.ask_time.title": "Wann frage ich?",
	"tip.ask_time.text": "Zu dieser Uhrzeit frage ich im Modus Vorschlagen, ob ich die kommende Nacht steuern darf. Antworten kannst du bis in die Nacht hinein.",
	"action.label": "Nacht-Aktion",
	"action.title": "Nacht-|Aktion",
	"action.title.new": "Neue |Nacht-Aktion",
	"action.template.ev": "E-Auto laden",
	"action.template.hot_water": "Warmwasser vorheizen",
	"action.template.custom": "Eigene Aktion",
	"action.f.name": "Name",
	"action.f.kind": "Art",
	"action.kind.switch": "Schalten",
	"action.kind.target": "Bis zu einem Zielwert",
	"action.f.entity": "Was ich schalte",
	"action.f.on_value": "Wert beim Einschalten",
	"action.f.value": "Wert",
	"action.value.on": "an",
	"action.value.off": "aus",
	"action.f.reset": "Danach zurück auf",
	"action.reset.previous": "wie vorher",
	"action.reset.fixed": "festen Wert",
	"action.f.lead": "So viel früher zurück",
	"action.f.auto": "Automatisch",
	"action.f.below": "wenn morgen weniger Sonne kommt als",
	"action.f.every_night": "jede Nacht",
	"action.f.conditions": "Und nur, wenn",
	"action.f.op": "Vergleich",
	"action.op.eq": "ist",
	"action.op.ne": "ist nicht",
	"action.op.lt": "kleiner als",
	"action.op.le": "höchstens",
	"action.op.gt": "größer als",
	"action.op.ge": "mindestens",
	"action.f.condition.add": "Bedingung",
	"action.f.power": "Leistung, ungefähr",
	"action.f.consumer": "Gehört zu",
	"action.f.consumer.none": "keinem Verbraucher",
	"action.f.priority": "Reihenfolge am Netzlimit",
	"action.f.enabled": "Aktiv",
	"action.f.sensor": "Temperatur-Fühler",
	"action.f.temps": "Temperaturen",
	"action.f.comfort": "Morgens mindestens",
	"action.f.maximum": "Höchstens",
	"action.f.buffer": "Puffer",
	"action.pick.entity": "Was soll ich schalten?",
	"action.pick.sensor": "Welcher Fühler misst die Temperatur?",
	"action.pick.condition": "Wovon hängt es ab?",
	"action.problem.entity": "Wähl noch aus, was ich schalten soll.",
	"action.problem.sensor": "Für einen Zielwert brauche ich den Temperatur-Fühler.",
	"action.delete": "Aktion löschen",
	"devices.actions": "Nacht-Aktionen",
	"devices.action.off": "aus",
	"devices.boost.unit": "Einheit",
	"devices.charge.label": "Laden bis",
	"devices.charge.now": "Jetzt laden",
	"devices.charge.tonight": "Heute Nacht laden",
	"devices.charge.percent": "{target} %",
	"devices.charge.km": "{target} km Reichweite plus {reserve} km Reserve",
	"devices.charge.now_running": "Lädt jetzt bis {amount} – gerade {now}.",
	"devices.charge.tonight_set": "Lädt heute Nacht in der günstigen Zeit bis {amount}.",
	"devices.charge.tonight_window": "Lädt heute Nacht in der ganzen günstigen Zeit.",
	"devices.charge.no_night": "„Heute Nacht“ geht, sobald ich die Nacht geplant habe.",
	"automations.title": "Automationen an deinen Speichern",
	"automations.lead": "Diese Automationen setzen etwas an deinen Speichern – zum Teil an denselben Reglern, die ich steuere. Solange sie laufen, können sie meine Steuerung überschreiben. Schalte sie am besten aus, damit ich richtig arbeiten kann.",
	"automations.lead_off": "Diese Automationen setzen etwas an deinen Speichern. Sie sind aus – so kommen wir uns nicht in die Quere.",
	"automations.on": "an",
	"automations.off": "aus",
	"automations.writes": "schreibt: {what} ({batteries})",
	"automations.switched_off": "Von mir ausgeschaltet am {day} um {time} Uhr – damit sie meine Steuerung der Speicher nicht überschreibt.",
	"automations.all_off": "Alle ausschalten ({count})",
	"automations.back_on": "Wieder einschalten ({count})",
	"automations.failed": "Nicht alle ließen sich umschalten – schau in Home Assistant unter Automationen nach.",
	"cards.loading": "Ich schaue gerade nach …",
	"cards.no_access": "Energy Joe ist nicht erreichbar – die Karte braucht einen Benutzer mit Administratorrechten.",
	"cards.night.title": "Joe heute Nacht",
	"cards.night.skip": "Heute aussetzen",
	"cards.car.none": "Noch kein Auto, das ich laden kann – richte es im Energy-Joe-Panel unter „Geräte“ ein.",
	"cards.car.charging": "lädt",
	"devices.charge.failed": "Das hat nicht geklappt – versuch es nochmal.",
	"automations.lead_idle": "Diese Automationen setzen etwas an deinen Speichern. Solange ich nur zuschaue, stören sie nicht – schalte sie aus, bevor du mich auf „Vorschlagen“ oder „Live“ stellst.",
	"automations.levers": "auch meine Regler",
	"automations.not_battery": "Setzt nichts mehr an Speichern, die ich kenne.",
	"tip.calendar_legacy.title": "Woher kommt dieser Kalender?",
	"tip.calendar_legacy.text": "Bis Version 0.3 hatte jedes Auto einen Kalender von mir. Darin stehen noch Fahrten, die du von Hand eingetragen hast – sie zählen weiter. Neue Fahrten gehören in den Kalender, den du oben zuordnest; wenn keine alte Fahrt mehr kommt, verschwindet dieser Kalender.",
	"devices.action.reached_plain": "Ziel erreicht – für heute fertig.",
	"devices.charge.tonight_done": "Heute Nacht bis {amount} geladen – fertig.",
	"calendar.account.oauth.no_client_secret": "Mir fehlt noch der Clientschlüssel deiner Google-App – trag ihn oben ein und drück „Speichern“.",
	"calendar.account.result.no_client_secret": "Mir fehlt noch der Clientschlüssel deiner Google-App.",
	"tip.battery_automations.title": "Warum ausschalten?",
	"tip.battery_automations.text": "Ich steuere die Speicher über Modus, Leistung und Grenzwerte. Setzt eine Automation dieselben Werte, gewinnt, wer zuletzt schreibt – dann hält sich der Speicher nicht an meinen Plan. Hier stehen alle Automationen, deren Aktionen etwas an deinen Speichern setzen (auch über Skripte); welche sie nur lesen, lasse ich weg. „Auch meine Regler“ heißt: genau die Werte, die ich selbst setze.\n„Alle ausschalten“ schaltet sie in Home Assistant aus und schreibt ins Logbuch der Automation, wann und warum. „Wieder einschalten“ schaltet genau die wieder an, die ich ausgeschaltet habe – entfernst du Energy Joe, mache ich das selbst.",
	"tip.battery_automations.hint": "Lieber behalten? Gib der Automation die Bedingung: Status von Energy Joe ist weder „Steuert“ noch „Hält das Laden zurück“ – dann hält sie sich raus, solange ich an den Speichern arbeite.",
	"devices.boost.stop": "Abbrechen",
	"devices.boost.reserve": "Dazu kommt deine Reserve von {reserve} km.",
	"devices.action.boost": "Lädt jetzt, weil du es willst.",
	"devices.action.tonight": "Heute Nacht",
	"devices.action.edit": "Bearbeiten",
	"devices.action.disabled": "Ausgeschaltet – ich lasse sie in Ruhe.",
	"devices.action.running": "Läuft – bis {end} Uhr.",
	"devices.action.heating": "Heizt auf {target} °C – längstens bis {end} Uhr.",
	"devices.action.reached": "Ziel erreicht ({target} °C) – für heute fertig.",
	"devices.action.no_plan": "Noch kein Plan für heute Nacht.",
	"devices.action.would": "Hätte: ",
	"devices.action.plan_run": "Heute Nacht von {start} bis {end} Uhr.",
	"devices.action.plan_target": "Heute Nacht ab {start} Uhr, bis {target} °C.",
	"devices.action.why.enough_sun": "Heute nicht: morgen kommen etwa {kwh} kWh Sonne.",
	"devices.action.why.conditions": "Heute nicht: eine Bedingung ist gerade nicht erfüllt.",
	"devices.action.why.manual_only": "Nur, wenn du „Heute Nacht“ einschaltest.",
	"devices.action.why.warm_enough": "Heute nicht: das Wasser ist warm genug ({temperature} °C).",
	"devices.action.why.no_temperature": "Den Temperatur-Fühler kann ich gerade nicht lesen.",
	"devices.action.why.tonight": "Läuft heute Nacht – du hast es eingeschaltet.",
	"devices.action.why.little_sun": "Läuft heute Nacht – morgen kommt zu wenig Sonne.",
	"devices.action.why.every_night": "Läuft jede Nacht.",
	"devices.action.add": "Nacht-Aktion hinzufügen",
	"devices.action.add.text": "Was soll laufen, wenn morgen die Sonne nicht reicht?",
	"plan.actions": "Nacht-Aktionen",
	"plan.actions.run": "läuft von {start} bis {end} Uhr",
	"plan.actions.target": "heizt ab {start} Uhr auf {target} °C, bis spätestens {end} Uhr",
	"plan.actions.energy": "≈ {kwh} kWh, {cost} günstig in der Nacht",
	"log.boost": "{battery}: einfach laden bis {target} {unit}",
	"log.boost_end.reached": "{battery}: einfach laden – Ziel erreicht",
	"log.boost_end.stopped": "{battery}: einfach laden beendet",
	"log.boost_end.expired": "{battery}: einfach laden nach 24 Stunden beendet",
	"log.action_on": "{battery}: eingeschaltet ({value})",
	"log.action_off": "{battery}: zurückgestellt ({value})",
	"log.action_done": "{battery}: Ziel erreicht",
	"log.call": "{battery}: {entity}",
	"log.tonight": "„Heute Nacht“ umgeschaltet",
	"log.grid_guard": "Hauptsicherung: {power} kW aus dem Netz – Laden kurz pausiert",
	"log.no_progress": "{battery} lädt nicht (bei {soc} %)",
	"tip.a_name.title": "Wie heißt die Aktion?",
	"tip.a_name.text": "So steht sie auf der Seite Geräte, im Plan und als Schalter in Home Assistant.",
	"tip.a_kind.title": "Welche Art?",
	"tip.a_kind.text": "**Schalten** – ich setze einen Wert für die ganze günstige Zeit und stelle ihn am Ende zurück (z. B. den evcc-Modus auf „now“).\n**Bis zu einem Zielwert** – ich schalte so spät wie möglich ein und wieder aus, sobald ein Fühler den Zielwert erreicht (z. B. Warmwasser).",
	"tip.a_entity.title": "Was schalte ich?",
	"tip.a_entity.text": "Ein Schalter, eine Auswahl, eine Zahl oder ein Skript in Home Assistant – zum Beispiel der Lademodus deiner Wallbox oder der Boost-Schalter der Warmwasser-Wärmepumpe.",
	"tip.a_on_value.title": "Welcher Wert?",
	"tip.a_on_value.text": "Was ich beim Einschalten setze, zum Beispiel „now“ beim evcc-Lademodus oder „an“ bei einem Schalter.",
	"tip.a_reset.title": "Wie stelle ich zurück?",
	"tip.a_reset.text": "**Wie vorher** – ich merke mir den Wert vor dem Einschalten und setze ihn wieder. **Fester Wert** – immer derselbe, zum Beispiel „aus“. Hast du selbst zwischendurch etwas geändert, lasse ich es so.",
	"tip.a_lead.title": "Warum früher?",
	"tip.a_lead.text": "Manche Geräte brauchen etwas, bis sie umschalten – evcc zum Beispiel bis zu drei Minuten. Dann stelle ich so viel früher zurück, damit am Ende der günstigen Zeit nichts mehr teuer läuft.",
	"tip.a_auto.title": "Wann läuft sie von allein?",
	"tip.a_auto.text": "Wenn morgen weniger Sonne kommt als hier steht – mit dem Faktor, den ich für deine Prognose gelernt habe. Leer heißt: jede Nacht. Ausgeschaltet läuft sie nur, wenn du „Heute Nacht“ einschaltest.",
	"tip.a_conditions.title": "Wozu Bedingungen?",
	"tip.a_conditions.text": "Die Aktion läuft nur, wenn alle erfüllt sind – zum Beispiel „Auto angesteckt ist an“ oder „Ladestand des Autos kleiner als 70“.",
	"tip.a_power.title": "Wozu die Leistung?",
	"tip.a_power.text": "Damit ich weiß, wie viel vom Netzanschluss sie braucht. Den Rest bekommen die Speicher – so bleibt alles unter deinem Netzlimit.",
	"tip.a_consumer.title": "Wozu die Zuordnung?",
	"tip.a_consumer.text": "Kenne ich den Verbraucher aus dem Energie-Dashboard, weiß ich, wie viel er sonst tagsüber braucht. Läuft er nachts, rechne ich das aus dem Tag heraus – die Speicher brauchen dann weniger.",
	"tip.a_priority.title": "Was heißt die Reihenfolge?",
	"tip.a_priority.text": "Reicht der Netzanschluss nicht für alles, kommt die kleinere Zahl zuerst. Die Speicher nehmen, was übrig bleibt.",
	"tip.a_enabled.title": "Was heißt aktiv?",
	"tip.a_enabled.text": "Ausgeschaltet plane und schalte ich diese Aktion nicht – auch nicht von Hand.",
	"tip.a_sensor.title": "Welcher Fühler?",
	"tip.a_sensor.text": "Der Fühler, dessen Temperatur ich beobachte, zum Beispiel die Warmwasser-Temperatur. Ist das Ziel erreicht, schalte ich aus.",
	"tip.a_temps.title": "Wie rechne ich das Ziel?",
	"tip.a_temps.text": "Morgens soll das Wasser mindestens so warm sein. Dazu lege ich, was ihr über den Tag braucht (das lerne ich noch), und den Puffer. Höher als „Höchstens“ heize ich nie. Ich starte so spät, dass das Ziel bis zum Ende der günstigen Zeit steht.",
	"tip.a_save.title": "Was passiert beim Speichern?",
	"tip.a_save.text": "Ich plane die Aktion ab sofort mit ein. Geschaltet wird nur in den Modi Vorschlagen und Live – in der Simulation zeige ich, was ich getan hätte.",
	"tip.a_delete.title": "Was passiert beim Löschen?",
	"tip.a_delete.text": "Die Aktion und ihr Schalter in Home Assistant verschwinden. Läuft sie gerade, stelle ich vorher zurück.",
	"tip.boost.title": "Jetzt oder heute Nacht?",
	"tip.boost.text": "**Jetzt laden**: Ich schalte die Wallbox sofort ein – ohne auf die günstige Zeit oder die Sonne zu warten und auch in der Simulation, weil du es ausdrücklich willst.\n**Heute Nacht laden**: Ich lade in der kommenden Nacht in der günstigen Zeit, egal was die Prognose sagt.\nSobald der Ladestand erreicht ist (oder die Reichweite plus deine Reserve), stelle ich die Wallbox zurück, wie sie vorher war. Mit % und km wählst du, ob das Ziel ein Ladestand oder eine Reichweite ist.",
	"tip.boost.hint": "„Jetzt laden“ hört nach spätestens 24 Stunden von selbst auf, „Heute Nacht“ mit dem Ende der Nacht. Mit „Abbrechen“ sofort.",
	"tip.action_tonight.title": "Was macht „Heute Nacht“?",
	"tip.action_tonight.text": "Die Aktion läuft in der kommenden Nacht, egal was die Prognose sagt – praktisch, wenn du weißt, dass du morgen früh losfährst. Nach der Nacht schaltet sich der Schalter von selbst wieder aus.",
	"tip.devices_actions.title": "Was sind Nacht-Aktionen?",
	"tip.devices_actions.text": "Alles außer den Speichern, was in der günstigen Zeit laufen soll, wenn morgen die Sonne nicht reicht – das E-Auto, das Warmwasser, ein Pool. Am Ende der Nacht stelle ich alles zurück.",
	"tip.plan_actions.title": "Was sehe ich hier?",
	"tip.plan_actions.text": "Welche Nacht-Aktionen heute Nacht laufen würden, wann – und warum die anderen nicht.",
	"error.title": "Joe antwortet |nicht",
	"error.text": "Ich erreiche die Integration nicht. Lade die Seite neu – hilft das nicht, schau unter Einstellungen → System → Protokolle nach.",
	"error.action": "Fehler beim Speichern",
	loading: "Joe sattelt auf …"
}, Ne = {
	"tab.overview": "Overview",
	"tab.plan": "Plan",
	"tab.history": "History",
	"tab.learn": "Learning",
	"tab.devices": "Devices",
	"tab.climate": "Climate",
	"climate.title": "Heating & cooling",
	"climate.lead": "When nobody is home I turn heating and air conditioning down – and back up in time when someone comes home. You decide for each device.",
	"climate.enabled": "Joe steers heating and cooling",
	"climate.live": "I steer the devices you switch on below.",
	"climate.not_live": "I only steer in the mode “Live” – until then I just show for each device what I would do.",
	"climate.presence": "Who is home?",
	"climate.home": "At home: {names}",
	"climate.nobody": "Nobody is home right now.",
	"climate.way.towards": "{name} is {km} km away and getting closer.",
	"climate.way.away": "{name} is {km} km away and moving away.",
	"climate.way.other": "{name} is {km} km away.",
	"climate.no_proximity": "To warm up in time when someone comes home I need the Proximity integration for your persons.",
	"climate.add_proximity": "Set up Proximity",
	"climate.free_day": "Today is a day off.",
	"climate.failed": "I could not load the devices just now.",
	"climate.none": "I found no thermostats or air conditioners in Home Assistant.",
	"climate.no_area": "No room",
	"climate.room.enabled": "Joe steers {name}",
	"climate.room.off": "Not steered by me.",
	"climate.meter": "Meter",
	"climate.meter.pick": "Pick the meter for {name}",
	"climate.meter.choose": "Pick a meter",
	"climate.meter.other_devices": "Other devices",
	"climate.meter.none": "Has none",
	"climate.meter.cancel": "Cancel",
	"climate.meter.no_meters": "Joe finds no device with a power or energy sensor.",
	"climate.meter.has_none": "No meter – you said this device has none.",
	"climate.meter.not_found": "Joe found no matching meter.",
	"climate.meter.linked": "linked",
	"climate.meter.suggested": "Suggestion",
	"climate.meter.power": "Power {value}",
	"climate.meter.energy": "Meter {value}",
	"climate.meter.shared": "Shared with {names}",
	"climate.meter.shared_hint": "These devices hang on the same meter. The reading counts for all of them together.",
	"climate.meter.other": "Other meter",
	"climate.meter.why": "Similar name or same room. Does it fit?",
	"climate.meter.fits": "Fits",
	"tip.climate_meter.title": "What measures this device?",
	"tip.climate_meter.text": "Link the climate device with the device that measures its power and energy – e.g. a channel of a Shelly Pro 3EM (“connected via …”). Joe suggests one when name or room fit: “Fits” takes it, “Other meter” opens the list, “Has none” tells Joe there is no measurement.",
	"tip.climate_meter.hint": "Several climate devices may share one meter – the reading then counts for all of them together.",
	"climate.away": "When nobody is home",
	"climate.away.setback": "Lower",
	"climate.away.off": "Off",
	"climate.away.preset": "Profile",
	"climate.setback.heat": "This much cooler",
	"climate.setback.cool": "This much warmer",
	"climate.away_preset": "Profile when away",
	"climate.free_day_preset": "Profile on days off",
	"climate.no_preset": "none – as set",
	"climate.pick_preset": "Choose a profile",
	"climate.night_off": "Off at night",
	"climate.night_span": "Off from – until",
	"climate.night_from": "Off from",
	"climate.night_until": "Comfortable again by",
	"climate.now.home": "Now: as set – someone is home.",
	"climate.now.away": "Now: away.",
	"climate.now.arriving": "Now: someone is coming home – I am warming up already.",
	"climate.now.free_day": "Now: day off.",
	"climate.now.night": "Now: night.",
	"climate.rate": "Gets about {rate} °C per hour (learned).",
	"climate.rate_default": "I am still learning how fast the room warms up or cools down.",
	"tip.climate_enabled.title": "What does Joe do here?",
	"tip.climate_enabled.text": "I watch who is home (the persons in Home Assistant). When nobody is, I set the devices you switch on as chosen – lower, off or a profile. When someone comes home I put everything back exactly as it was.",
	"tip.climate_enabled.hint": "As everywhere: in the simulation I switch nothing and only show what I would do.",
	"tip.climate_presence.title": "How does Joe know who is coming?",
	"tip.climate_presence.text": "Who is home I see from the persons in Home Assistant. Who is coming home I see from the Proximity integration: it reports distance and direction. I count on 40 km/h and start early enough for the room to be comfortable in time.",
	"tip.climate_room.title": "Steer this device?",
	"tip.climate_room.text": "I only touch devices whose switch is on. So you can leave out the bathroom or a child's room, for example.",
	"tip.climate_away.title": "What happens when nobody is home?",
	"tip.climate_away.text": "**Lower**: cooler by the set degrees (warmer for an air conditioner that cools).\n**Off**: the device off.\n**Profile**: a profile of the device, e.g. a Homematic IP heating profile “Away” in the heating group.",
	"tip.climate_away.hint": "With Homematic IP, set up profiles of your own – then your times and temperatures apply.",
	"tip.climate_free_day.title": "Days off?",
	"tip.climate_free_day.text": "On weekends and holidays (according to your workday sensor) I switch to this profile while someone is home – e.g. a Homematic IP profile “Holiday” that warms up later.",
	"tip.climate_night.title": "Off at night?",
	"tip.climate_night.text": "The air conditioner goes off at the first time and back on early enough to be comfortable by the second time. How long it needs I learn over time.",
	"tab.settings": "Settings",
	"nav.label": "Sections",
	"mode.simulation": "Simulation",
	"mode.simulation.sub": "Joe only watches and learns",
	"mode.simulation.desc": "I plan and learn, but don't switch anything.",
	"mode.live": "Live",
	"mode.live.sub": "Joe is in control",
	"mode.live.desc": "I steer every night myself – only batteries that passed the test run – and put everything back at the end.",
	"mode.off": "Off",
	"mode.off.sub": "Joe takes a break",
	"mode.off.desc": "I take a break until you start me again.",
	"mode.switch.label": "Change operating mode",
	"mode.dialog.title": "How should Joe |work?",
	"mode.current": "running",
	"mode.soon": "coming soon",
	"mode.close": "Done",
	"step.welcome": "Hello",
	"step.scan": "Look around",
	"step.questions": "Questions",
	"step.done": "Go",
	"steps.label": "Setup",
	"onb.welcome.title": "Howdy!|I'm |Joe.",
	"onb.welcome.lead": "I move your power use into the cheap hours – home battery, car, hot water. And every day I learn a bit more about how your home ticks.",
	"onb.calm": "For now I just watch. I won't switch anything until you say so.",
	"onb.welcome.go": "Look around",
	"onb.welcome.more": "What does Joe do?",
	"onb.welcome.more.text": "Every night I work out how much your batteries need from the cheap grid to last until the sun takes over – no more, no less. With a market-price tariff I charge in the cheapest quarter hours.\nIf the sun won't be enough tomorrow, I also move the electric car and the hot water into the cheap hours – the car for example through evcc, the hot water up to a temperature that lasts the day. I keep an eye on your grid limit.\nDuring the day I check how well I did and learn: how much more you need when it's cold, who is at home according to the calendar and how well the forecast fits.",
	"onb.scan.title": "Let me |look around",
	"onb.scan.lead": "In a moment I'll show you what I found in your Home Assistant – batteries, solar, tariff and more. You only confirm.",
	"onb.scan.energy": "I already spotted your Energy dashboard:",
	"onb.scan.energy.none": "I didn't find an Energy dashboard. No problem – I'll look for your devices anyway.",
	"scan.looking": "Looking around …",
	"scan.title": "Here's what |I found",
	"scan.lead": "This is what I'll use from now on. If something's off, change it or leave it out – I never overwrite what you set.",
	"scan.again": "Look again",
	"scan.why": "Why?",
	"scan.failed": "Something went wrong while looking around. Please try again.",
	"scan.notes": "What I noticed",
	"find.energy": "Energy dashboard",
	"find.energy.detail": "{grid} · {solar} · {battery} · {devices}",
	"word.grid": "grid|grids",
	"word.solar": "solar system|solar systems",
	"word.battery": "battery|batteries",
	"word.device": "device|devices",
	"word.plane": "plane|planes",
	"word.sensor": "sensor|sensors",
	"word.person": "person|people",
	"word.calendar": "calendar|calendars",
	"find.battery.control": "I can control it",
	"find.battery.read": "read only",
	"find.tariff": "Tariff",
	"find.tariff.window": "cheap {start}–{end}: {night} ct · otherwise {day} ct",
	"find.tariff.dynamic": "dynamic price, today {night}–{day} ct",
	"find.tariff.flat": "fixed price {day} ct",
	"find.tariff.unknown": "Tariff not recognised – I'll ask you in a moment",
	"find.tariff.feedin": "feed-in {price} ct",
	"find.forecast": "Solar forecast",
	"find.forecast.detail": "{provider} · {planes} · today {today} kWh · tomorrow {tomorrow} kWh",
	"find.grid": "Grid",
	"find.home": "Home consumption",
	"find.solar": "Solar power",
	"find.solar.detail": "{count} · together {total} kW",
	"find.car": "Car",
	"find.wallbox": "Wallbox",
	"find.weather": "Weather",
	"find.holiday": "Public holidays",
	"find.people": "Household",
	"find.people.detail": "{persons} · {calendars}",
	"find.devices": "Devices",
	"find.devices.detail": "{count} from the Energy dashboard, {heating} of them for heating or cooling",
	"find.none": "not found",
	"conf.4": "very sure",
	"conf.3": "fairly sure",
	"conf.2": "not so sure",
	"conf.1": "just a guess",
	"reason.energy_dashboard": "set up like this in the Energy dashboard",
	"reason.integration_key": "known value of the {integration} integration",
	"reason.capacity_read": "size read from the device",
	"reason.controls_found": "{count} controls found",
	"reason.house_meter": "includes {children} other devices",
	"reason.name": "name contains “{word}”",
	"reason.storage_name": "device sounds like a battery (“{word}”)",
	"reason.power_guess": "power sensor on the same device",
	"reason.timeslots": "time slots read from the tariff",
	"reason.price_list": "price list read",
	"reason.price_only": "only the current price is known",
	"reason.dynamic_provider": "prices come from {integration}",
	"reason.forecast_support": "with hourly forecast",
	"reason.name_match": "calendar matches the name",
	"reason.submeter": "other devices are behind it",
	"check.missing": "I didn't find {role} – I'll ask you in a moment.",
	"check.unavailable": "{role} has no value right now.",
	"check.unit": "{role} measures in {unit} – I expect W or kW.",
	"check.stale": "{role} hasn't reported for {hours} hours.",
	"check.home_negative": "Home consumption is negative – I'll flip the sign for myself.",
	"check.grid_sign.export": "Going by sun and consumption you should be exporting about {expected} kW, but the sensor shows {actual} kW import. Does it count the other way round?",
	"check.grid_sign.import": "Going by sun and consumption you should be importing about {expected} kW, but the sensor shows {actual} kW export. Does it count the other way round?",
	"check.soc_range": "A charge level of {value} % can't be right.",
	"check.soc_unavailable": "The charge level has no value right now.",
	"check.capacity_unknown": "I don't know its size – I'll ask you in a moment or learn it.",
	"check.not_controllable": "I can watch this one but not control it.",
	"check.tariff_unknown": "I didn't recognise the tariff – I'll ask you in a moment.",
	"role.grid_power": "grid power",
	"role.home_power": "home consumption",
	"role.solar_power": "solar power",
	"onb.questions.title": "A few |questions",
	"onb.questions.lead": "Whatever I can't find out myself, I'll ask you – with answers to tap and always with “I don't know”.",
	"onb.done.title": "Alright, |partner.",
	"onb.done.lead": "From tonight I plan every night but don't switch anything. After a week I'll show you what it would have saved.",
	"onb.done.go": "Start Joe",
	"onb.done.change": "Change something",
	"onb.nav": "Setup: back or next",
	"onb.next": "Next",
	"onb.back": "Back",
	soon: "Coming in the next update",
	"energy.grid": "grid",
	"energy.solar": "solar",
	"energy.battery": "batteries",
	"energy.devices": "devices",
	"energy.read": "read",
	"overview.night": "Tonight",
	"overview.night.empty.title": "No plan |yet",
	"overview.night.empty.text": "Once I know your batteries and your tariff, I'll work out here every night how much to charge – and why.",
	"overview.sim": "Simulation",
	"overview.sim.empty.title": "Just |watching",
	"overview.sim.empty.text": "After the first night I'll show you here what it would have saved if I had been in control.",
	"overview.next": "What happens next",
	"overview.next.1.title": "All set up",
	"overview.next.1.text": "I know your batteries, tariff and forecast. You can change everything in the settings.",
	"overview.next.2.title": "I'm watching",
	"overview.next.2.text": "Every hour I write down what happens – and I read the last weeks from your Home Assistant.",
	"overview.next.3.title": "I plan every night",
	"overview.next.3.text": "How far I would charge – as a simulation, without switching anything.",
	"overview.next.4.title": "What it would have saved",
	"overview.next.4.text": "Plan against reality – day by day, in money.",
	"status.done": "done",
	"plan.day": "Grid-friendly: until {time} the morning sun goes to the grid (about {kwh} kWh), then the battery charges at the midday peak.",
	"plan.day.cost": "Costs about {cost}.",
	"plan.title": "Where I |do the math",
	"history.title": "Every day |up close",
	"devices.title": "Your |devices",
	"devices.text": "Batteries, wallbox and hot water – with status, a test run and what I'm planning with them.",
	"settings.operation": "Operation",
	"settings.mode": "Operating mode",
	"settings.mode.hint": "Simulation plans and learns without switching anything. Suggest asks every evening, live steers by itself.",
	"settings.live.unavailable": "Live arrives once Joe can control devices.",
	"settings.setup": "Setup",
	"settings.setup.hint": "Go through the assistant again from the start.",
	"settings.setup.restart": "Start over",
	"settings.about": "About Joe",
	"settings.version": "Version",
	"settings.ha": "Home Assistant",
	"settings.energy": "Energy dashboard",
	"settings.energy.none": "not set up",
	"tip.label": "Explanation",
	"tip.hint": "Tip",
	"tip.source": "Source",
	"tip.mode.title": "What should Joe do?",
	"tip.mode.text": "**Simulation** – I plan and learn as if for real, but don't switch anything. You see what I would have done and what it would have saved.\n**Suggest** – I ask you every evening whether I may steer the night. Without your yes I switch nothing.\n**Live** – I steer every night myself – only batteries that passed the test run – and put everything back at the end.\n**Off** – I take a break: no planning, no learning, no switching. What I already know stays.",
	"tip.mode.hint": "Let me simulate for a few weeks. Then you'll see in black and white whether going live pays off.",
	"tip.restart.title": "What happens when I start over?",
	"tip.restart.text": "We go through the setup together once more and I look around again. Whatever you set yourself stays – I only suggest new things.",
	"tip.scan_start.title": "What happens now?",
	"tip.scan_start.text": "I check which batteries, meters, tariffs and forecasts your Home Assistant has. I only read – I don't change anything there.",
	"tip.rescan.title": "Why look again?",
	"tip.rescan.text": "I look around once more – handy if you just set something up in Home Assistant. Again, I only read.",
	"tip.start.title": "What happens when I start Joe?",
	"tip.start.text": "From tonight I plan every night – as a simulation, so without switching anything. You can change everything you entered in the settings at any time.",
	"tip.start.hint": "You switch to live yourself later, once you've seen what I can do.",
	"common.save": "Save",
	"common.cancel": "Cancel",
	"common.close": "Close",
	"source.read": "read",
	"source.learned": "learned",
	"source.user": "set by you",
	"source.default": "default",
	"live.import": "{value} kW import",
	"live.export": "{value} kW export",
	"live.kw": "{value} kW",
	"tariff.window_only": "cheap {start}–{end}",
	"tariff.dynamic": "dynamic price",
	"tariff.flat": "fixed price",
	"tariff.kind.fixed_window": "Cheaper at night",
	"tariff.kind.flat": "Always the same price",
	"tariff.kind.dynamic": "Market price, changes during the day",
	"review.change": "Change",
	"review.choose": "Choose",
	"review.enter": "Enter",
	"review.ignore": "Leave out",
	"review.use": "Use it after all",
	"review.add": "Add",
	"review.assign": "Assign",
	"review.invert": "Flip",
	"review.keep": "It's right",
	"review.ignored": "left out",
	"review.ask_later": "I'll ask you in a moment",
	"review.used": "in use",
	"review.unused": "not in use yet",
	"review.wallbox.used": "for the night action “Charge the car”",
	"review.wallbox.unused": "for a night action – set up under Devices → “Charge the car”",
	"review.car.used": "for charging by need",
	"review.car.unused": "for charging by need – switch on under Devices → car → “Charge by need”",
	"review.capacity_unknown": "size unknown",
	"review.battery": "Battery",
	"review.battery.none": "No battery found. If you have one, pick it.",
	"review.battery.more": "Another battery",
	"review.battery.more_detail": "Missing one? Pick it.",
	"review.tariff.ask": "I'll ask you about the tariff in a moment – or enter it now.",
	"review.forecast.none": "Without a solar forecast I plan cautiously. Set up Forecast.Solar, for example, in Home Assistant and I'll look again.",
	"review.grid.none": "Without a grid meter I can't see what really happens. Pick the sensor that measures the power at your grid connection.",
	"review.home.balance": "Like the Energy dashboard: grid + solar ± storage",
	"review.home.compare": "To compare: {name} · {live}",
	"review.home.flexible": "For the battery I leave out: {names}. I never charge the car from the home battery.",
	"review.home.flexible_some": "For the battery I leave out: {names}.",
	"review.home.flexible_none": "Do some devices run only on solar surplus or cheap power? Tell me with the devices – then I plan the battery without them.",
	"review.home.off": "Over the last {days} days your sensor shows {pct} % {direction} than grid + solar ± storage. Is a small solar system missing in it? I work with grid + solar ± storage.",
	"review.home.less": "less",
	"review.home.more": "more",
	"review.home.devices": "Assign devices",
	"review.home.none": "Don't know one? No problem – I'll work out home consumption from grid, solar and battery myself.",
	"review.home.without": "I don't have one",
	"review.home.computed": "worked out from grid, solar and battery",
	"review.solar.none": "No solar",
	"review.solar.without": "no solar system",
	"review.weather.none": "With a weather forecast I learn how the outdoor temperature changes your consumption.",
	"review.holiday.none": "Tip: the Workday integration tells me when it's a weekend or public holiday.",
	"pick.search": "Search – name, room or device",
	"pick.suggested": "Joe suggests",
	"pick.fitting": "Matching",
	"pick.all": "All entities",
	"pick.empty": "Nothing matches. Turn on “Show all” below or search for another word.",
	"pick.more": "Show {count} more",
	"pick.show_all": "Show all",
	"pick.apply": "Use",
	"pick.invert": "Count the other way round",
	"pick.preview.import": "I'm reading: {value} kW imported from the grid",
	"pick.preview.export": "I'm reading: {value} kW exported to the grid",
	"pick.preview.home": "I'm reading: {value} kW home consumption",
	"pick.preview.solar": "I'm reading: {value} kW production",
	"pick.preview.negative": "I'm reading: {value} kW – that can't be negative. Count the other way round?",
	"pick.preview.charge": "{value} kW charging",
	"pick.preview.discharge": "{value} kW discharging",
	"pick.grid.title": "Which sensor measures |your grid?",
	"pick.home.title": "Which sensor measures |your consumption?",
	"pick.solar.title": "Which sensors measure |your solar?",
	"pick.battery.title": "Which sensor shows |the charge level?",
	"pick.battery_power.title": "Which sensor measures |battery power?",
	"pick.price.title": "Which sensor knows |the electricity price?",
	"pick.weather.title": "Which |weather?",
	"pick.holiday.title": "Which sensor knows |the holidays?",
	"pick.person.title": "Who's |missing?",
	"pick.calendar.title": "Which calendars |does {name} have?",
	"ask.count": "Question {n} of {total}:",
	"ask.topics": "Questions – tap to jump",
	"ask.topic.tariff": "Tariff",
	"ask.topic.feed_in": "Feed-in",
	"ask.topic.capacity": "Battery",
	"ask.topic.heating": "Heating",
	"ask.topic.hot_water": "Hot water",
	"ask.topic.ev": "Electric car",
	"ask.topic.household": "Household",
	"ask.finish": "Done",
	"ask.idk": "I don't know",
	"ask.idk_learn": "I don't know – learn it",
	"q.tariff.title": "How do you pay |for electricity?",
	"q.feed_in.title": "What do you get |for feeding in?",
	"q.feed_in.none": "Nothing",
	"q.capacity.title": "How much fits into |{name}?",
	"q.heating.title": "Do you also heat |with electricity?",
	"q.heating.climate": "Air conditioners",
	"q.heating.heat_pump": "Heat pump",
	"q.heating.electric": "Heating rod, infrared, storage heater",
	"q.heating.none": "No",
	"q.heating.devices": "These devices belong to it:",
	"q.heating.no_devices": "I haven't spotted a device for it in the Energy dashboard yet.",
	"q.heating.assign": "Assign devices",
	"q.hot_water.title": "How does your |water get hot?",
	"q.hot_water.heat_pump": "Hot water heat pump",
	"q.hot_water.electric": "Heating rod or instant water heater",
	"q.hot_water.heating": "Through the heating",
	"q.hot_water.other": "Gas, oil or district heating",
	"q.hot_water.devices": "I found this meter for it in the Energy dashboard:",
	"q.hot_water.no_devices": "I found no meter of its own in the Energy dashboard – it works without one too.",
	"q.hot_water.offer": "Shall I move the hot water into the cheap hours when tomorrow brings little sun? I need what switches the heat pump or heating rod and a temperature sensor in the tank – I'll suggest fitting ones.",
	"q.hot_water.has_action": "I control the hot water with “{name}”.",
	"q.hot_water.set_up": "Set up hot water control",
	"q.hot_water.edit": "View or change",
	"q.ev.title": "Do you charge |an electric car?",
	"q.ev.yes": "Yes",
	"q.ev.yes_wallbox": "Yes, at {name}",
	"q.ev.no": "No",
	"q.household.title": "Who |lives here?",
	"f.unknown": "don't know",
	"f.tariff.kind": "Kind of tariff",
	"f.window": "Cheap hours",
	"f.window.start": "Start of the cheap hours",
	"f.window.end": "End of the cheap hours",
	"f.window.until": "to",
	"f.prices": "Prices",
	"f.price": "Price",
	"f.price.night": "During cheap hours",
	"f.price.day": "Otherwise",
	"f.price.unknown": "",
	"f.price_entity": "Price sensor",
	"f.price_entity.none": "None chosen yet",
	"f.search": "Search span",
	"f.search.start": "Search from",
	"f.search.end": "Search until",
	"f.surcharge": "Surcharge on the market price",
	"f.feed_in": "Feed-in tariff",
	"f.feed_in.entity": "I read it from “{name}”.",
	"f.battery.name": "Name",
	"f.battery.capacity": "Size",
	"f.battery.capacity.read": "The device reports {value} kWh. If that's wrong, enter the usable size.",
	"f.battery.soc": "Charge level",
	"f.battery.power": "Power",
	"f.battery.limits": "Maximum power",
	"f.battery.max_charge": "Charging",
	"f.battery.max_discharge": "Discharging",
	"f.battery.priority": "Order",
	"f.battery.control": "Control",
	"f.battery.control.allow": "Joe may control this battery",
	"f.battery.control.found": "{count} controls found. Nothing is switched before live mode.",
	"f.battery.control.none": "I can only watch this battery – I don't know how to control it yet.",
	"edit.battery.label": "Edit battery",
	"edit.battery.title": "Battery |settings",
	"edit.tariff.label": "Edit tariff",
	"edit.tariff.title": "Your |tariff",
	"edit.household.label": "Edit household",
	"edit.household.title": "Who |lives here?",
	"edit.consumers.label": "Assign devices",
	"edit.consumers.title": "Your |devices",
	"household.empty": "Nobody yet. Add the people who live here.",
	"household.add": "Add person",
	"household.remove": "Doesn't live here",
	"household.left_out": "Left out:",
	"household.home": "at home right now",
	"household.away": "away right now",
	"household.zone": "right now: {zone}",
	"household.no_presence": "no presence",
	"household.calendars": "Calendars",
	"household.calendar_add": "Calendar",
	"household.calendar_remove": "Remove calendar {name}",
	"consumers.runs": "When does it run?",
	"consumers.runs_of": "When {name} runs",
	"runs.auto": "When it is needed",
	"runs.ev.auto": "Never from the home battery",
	"runs.ev.always": "Also from the home battery",
	"runs.surplus": "Only with solar surplus",
	"runs.cheap": "Only on cheap power",
	"consumers.kind": "What kind of device is it?",
	"consumers.kind_of": "Kind of {name}",
	"consumers.empty": "The Energy dashboard lists no individual devices.",
	"kind.climate": "Air conditioner",
	"kind.heat_pump": "Heat pump (heating)",
	"kind.electric_heating": "Electric heating",
	"kind.hot_water": "Hot water",
	"kind.ev": "Electric car or wallbox",
	"kind.comfort": "Pool, sauna, hot tub",
	"kind.household": "Household appliance",
	"kind.submeter": "Meter for other devices",
	"kind.other": "Other",
	"sum.batteries": "Batteries",
	"sum.batteries.value": "{count} · {kwh} kWh",
	"sum.tariff": "Electricity price",
	"sum.feed_in": "Feed-in",
	"sum.forecast": "Solar forecast",
	"sum.forecast.value": "{provider} · {planes}",
	"sum.heating": "Heating with electricity",
	"sum.hot_water": "Hot water",
	"sum.ev": "Electric car",
	"sum.household": "Household",
	"sum.household.value": "{persons} · {calendars}",
	"sum.none": "none",
	"sum.unknown": "don't know",
	"sum.open": "still open",
	"sum.from_sensor": "from the sensor",
	"settings.uses": "What Joe uses",
	"settings.uses.intro": "What I found or what you told me. Change it, leave it out, add more – all here.",
	"settings.answers": "Your answers",
	"settings.answer.heating": "Heating with electricity",
	"settings.answer.hot_water": "Hot water",
	"settings.answer.ev": "Electric car",
	"settings.pro": "For pros",
	"settings.pro.intro": "Fine-tuning for the night. The defaults suit most homes – you don't have to change anything here.",
	"rule.reserve_soc": "Reserve",
	"rule.reserve_soc.hint": "I never discharge the batteries below this.",
	"rule.max_target_soc": "Charge at night up to",
	"rule.max_target_soc.hint": "I never charge more than this from the grid at night.",
	"rule.evening_min_soc": "Minimum in the evening",
	"rule.evening_min_soc.hint": "Empty = no minimum.",
	"rule.grid_limit_w": "Grid limit",
	"rule.grid_limit_w.hint": "Maximum power from the grid, everything together.",
	"rule.max_night_kwh": "At most per night",
	"rule.max_night_kwh.hint": "Empty = as much as needed.",
	"rule.max_price": "Highest price for grid charging",
	"rule.max_price.hint": "Empty = no highest price.",
	"rule.min_saving": "Minimum saving per night",
	"rule.min_saving.hint": "Below that I leave the batteries alone.",
	"rule.grid_friendly": "Be grid-friendly",
	"rule.grid_friendly.hint": "Batteries take the midday sun instead of the morning sun, the car charges with the sun.",
	"rule.grid_first": "What comes first?",
	"rule.grid_first.saving": "Saving",
	"rule.grid_first.grid": "Grid",
	"rule.grid_first.saving.hint": "I am only grid-friendly when it costs you nothing.",
	"rule.grid_first.grid.hint": "I am grid-friendly even when it costs up to 30 ct a day.",
	"rule.guard_grid": "Protect the main fuse",
	"rule.guard_grid.hint": "If the house draws more than the grid limit, charging pauses for a few minutes.",
	"rule.guard_grid.no_limit": "Needs a grid limit (above).",
	"rule.balance_days": "Maintenance charge",
	"rule.balance_days.hint": "Charge full once every so many days. Empty = off.",
	"rule.balance_days.unit": "days",
	"rule.buffer_factor": "Safety buffer",
	"rule.buffer_factor.hint": "Added to my calculation while I'm still learning.",
	"rule.plan_offset_min": "Fix the plan",
	"rule.plan_offset_min.hint": "Minutes before the cheap hours begin.",
	"rule.reset_lead_min": "Put things back",
	"rule.reset_lead_min.hint": "Minutes before the cheap hours end.",
	"rule.priority": "Who goes first?",
	"rule.priority.hint": "Order when the grid limit gets tight.",
	"rule.priority.ev": "Electric car",
	"rule.priority.hot_water": "Hot water",
	"rule.priority.battery": "Batteries",
	"rule.priority.up": "Move {name} up",
	"rule.priority.down": "Move {name} down",
	"rule.discharge_in_window": "Discharging during cheap hours",
	"rule.discharge_in_window.hint": "What the batteries may do at night.",
	"rule.discharge.until_target": "Down to the target",
	"rule.discharge.block": "Pause",
	"rule.discharge.free": "Free",
	"rule.off": "off",
	"rule.reset": "Default",
	"tip.review_battery.title": "What do I do with this battery?",
	"tip.review_battery.text": "Every night I work out how much it needs from the cheap grid to last until the sun takes over.\n**Change** – name, size, sensors and whether I may control it.\n**Leave out** – I plan without it. You can bring it back at any time.",
	"tip.review_ignored.title": "Why is this greyed out?",
	"tip.review_ignored.text": "You left it out, so I don't use it. **Use it after all** brings it back.",
	"tip.review_battery_add.title": "Missing a battery?",
	"tip.review_battery_add.text": "Pick the sensor that shows its charge level in percent. Then I watch it and plan with it.",
	"tip.review_battery_add.hint": "So far I can control batteries through the Fronius and OmniBattery integrations; I watch all others.",
	"tip.review_tariff.title": "Why do I need the tariff?",
	"tip.review_tariff.text": "When electricity is cheap and what it costs decides when I charge and whether it pays off.\n**Change** – kind, cheap hours, prices and feed-in tariff.",
	"tip.review_forecast.title": "Why do I need the forecast?",
	"tip.review_forecast.text": "It tells me how much sun is coming tomorrow, so I know how full to make the batteries at night. Over time I learn how well it fits your home.\n**Leave out** – I plan without a forecast, so more cautiously.",
	"tip.review_grid.title": "Why do I need the grid meter?",
	"tip.review_grid.text": "It shows how much power is coming from or going to the grid right now. That's how I see whether my plans work out, and learn from it.\n**Change** – choose another sensor.\n**Flip** – if it counts the other way round.\n**It's right** – my hint was wrong, I won't mention it again.",
	"tip.review_home.title": "Why do I need home consumption?",
	"tip.review_home.text": "From it I learn how much you use and when – the heart of my planning. I work it out like the Energy dashboard from grid, solar and battery, so a balcony system counts too. A consumption sensor I use to compare, and in its place when the balance cannot be made.\n**Change** – choose another sensor.\n**I don't have one** – then I only work it out from grid, solar and battery.",
	"tip.review_solar.title": "Why do I need solar power?",
	"tip.review_solar.text": "I compare what the forecast promised with what your system really delivered. That way I get more accurate every day.\n**Change** – choose sensors; I add up several inverters.\n**No solar** – then I plan with cheap grid power only.",
	"tip.review_weather.title": "Why do I need the weather?",
	"tip.review_weather.text": "If you heat with electricity, you use more on cold days. With the forecast I plan for that.\n**Leave out** – I plan without temperature.",
	"tip.review_holiday.title": "Why do I need holidays?",
	"tip.review_holiday.text": "On weekends and holidays you're often at home and use power differently. I learn those days separately.\n**Leave out** – then I only know weekends, not holidays.",
	"tip.pick_all.title": "Why don't I see everything?",
	"tip.pick_all.text": "At first I only show what fits – sensors that measure power in W or kW, for example. With “Show all” you see every entity.",
	"tip.pick_invert.title": "What does counting the other way round mean?",
	"tip.pick_invert.text": "Some meters show import as positive, others as negative. Check below what I'm reading – if the direction is wrong, switch it.",
	"tip.pick_invert_battery.title": "What does counting the other way round mean?",
	"tip.pick_invert_battery.text": "I count charging as positive and discharging as negative. If your battery shows it the other way round, switch it – below you see what I'm reading.",
	"tip.pick_grid.title": "Which sensor is right?",
	"tip.pick_grid.text": "The one that measures the power at your grid connection – what goes into or out of the house. Usually from the electricity meter, a smart meter or the inverter.",
	"tip.pick_grid.hint": "My suggestions are at the top, with the reason why.",
	"tip.pick_home.title": "Which sensor is right?",
	"tip.pick_home.text": "The one that shows what the whole house is using right now – without charging the battery. Many inverters provide such a value.",
	"tip.pick_solar.title": "Which sensors are right?",
	"tip.pick_solar.text": "The ones that show what your solar system is producing right now. If you have several inverters or a balcony system, pick them all – I add them up.",
	"tip.pick_battery.title": "Which sensor is right?",
	"tip.pick_battery.text": "The one that shows the home battery's charge level in percent – not your phone's or car's battery.",
	"tip.pick_battery_power.title": "Which sensor is right?",
	"tip.pick_battery_power.text": "The one that shows how much the battery is charging or discharging – in W or kW.",
	"tip.pick_price.title": "Which sensor is right?",
	"tip.pick_price.text": "The one that shows the current electricity price – from Tibber, Octopus or a market price integration, for example. Ideally one that also knows the prices for the coming hours.",
	"tip.pick_weather.title": "Which weather do I use?",
	"tip.pick_weather.text": "Ideally one with an hourly forecast for your location. Most of all I need the outdoor temperature.",
	"tip.pick_holiday.title": "Which sensor is right?",
	"tip.pick_holiday.text": "One that is “on” on working days and “off” on weekends and holidays. The Workday integration provides exactly that.",
	"tip.pick_person.title": "Who can I add?",
	"tip.pick_person.text": "Every person in Home Assistant. From their presence I learn when someone is at home.",
	"tip.pick_person.hint": "Someone missing? Add a person in Home Assistant under Settings → People – no user account needed.",
	"tip.pick_calendar.title": "Which calendars fit?",
	"tip.pick_calendar.text": "This person's – work, appointments, shift plan. I only read when something is scheduled, to learn when they're away or working from home.",
	"tip.q_tariff.title": "Why do I ask about the tariff?",
	"tip.q_tariff.text": "When electricity is cheap decides when I charge. **Cheaper at night** means tariffs with fixed cheap hours; the **market price** changes every hour.",
	"tip.q_tariff.hint": "It's on your electricity bill. If you don't know, I'll assume a fixed price for now.",
	"tip.q_feed_in.title": "Why do I ask this?",
	"tip.q_feed_in.text": "Power you feed into the grid earns you something. That's how I work out whether it's better to store it instead.",
	"tip.q_feed_in.hint": "It's on your grid operator's statement.",
	"tip.q_capacity.title": "Why do I need the size?",
	"tip.q_capacity.text": "With it I work out how long the battery lasts and how much I need to charge at night. I mean the usable capacity in kWh.",
	"tip.q_capacity.hint": "It's in the data sheet. If you don't know, I learn it from charging and discharging.",
	"tip.q_heating.title": "Why do I ask this?",
	"tip.q_heating.text": "Heating with electricity depends a lot on the outdoor temperature. If I know about it, I plan cold days better.",
	"tip.q_heating.hint": "You can pick several answers.",
	"tip.q_hot_water.title": "Why do I ask this?",
	"tip.q_hot_water.text": "I can move electric hot water into cheap hours when the sun isn't enough. Gas, oil and district heating I leave alone.",
	"tip.q_hot_water_action.title": "What am I setting up?",
	"tip.q_hot_water_action.text": "A night action: in the cheap hours I heat the water just enough to last until the next evening, starting as late as possible. Afterwards I put the switch back the way it was. How fast your tank heats up and cools down I learn myself.",
	"tip.q_hot_water_action.hint": "Do you already have an automation of your own for hot water (e.g. with solar surplus)? Then make sure the two don't get in each other's way.",
	"tip.q_ev.title": "Why do I ask this?",
	"tip.q_ev.text": "If the sun won't be enough tomorrow, I can have the car charged cheaply at night. We'll set that up later with the night actions.",
	"tip.q_household.title": "Why do I ask this?",
	"tip.q_household.text": "Whether someone is at home changes consumption a lot. With presence and calendars I learn when you need how much – when working from home, for example.\n**Doesn't live here** – I leave that person out.",
	"tip.q_household.hint": "Everything stays in your Home Assistant.",
	"tip.f_window.title": "When is your electricity cheap?",
	"tip.f_window.text": "The hours of your cheap tariff, for example midnight to 5 am. I charge during that time if the sun won't be enough tomorrow.",
	"tip.f_prices.title": "Which prices do I mean?",
	"tip.f_prices.text": "What one kWh costs you, in cents and with everything included. If you don't know, leave it empty – I'll use typical prices.",
	"tip.f_price_entity.title": "Where do I get the price?",
	"tip.f_price_entity.text": "From a sensor that shows the current electricity price. With market prices I need it, otherwise I don't know when it gets cheap.",
	"tip.f_search.title": "Where does Joe search?",
	"tip.f_search.text": "In this span I look for the window with which the next 24 hours cost least: in it I hold the batteries and charge in the cheapest quarter hours. It usually lies in the middle of the night.",
	"tip.f_search.hint": "Without a span I search from 8 pm to 7 am.",
	"tip.f_surcharge.title": "Why a surcharge?",
	"tip.f_surcharge.text": "Some integrations only deliver the bare market price. What you really pay is more: grid fees, taxes and levies. Enter that part per kWh here, so I can weigh correctly whether charging pays off.\nIf your sensor already has the final price (e.g. Tibber), leave the field empty.",
	"tip.f_battery_name.title": "What should I call it?",
	"tip.f_battery_name.text": "That's how the battery shows up everywhere with me. Nothing changes on the device or in Home Assistant.",
	"tip.f_battery_soc.title": "What is the charge level?",
	"tip.f_battery_soc.text": "How full the battery is right now, in percent. I need it for every calculation.",
	"tip.f_battery_power.title": "What is the power?",
	"tip.f_battery_power.text": "How much the battery is charging or discharging right now. From it I learn how big it really is and how much is lost while charging.",
	"tip.f_battery_limits.title": "How fast may it go?",
	"tip.f_battery_limits.text": "The highest charging and discharging power. If you don't know, leave it empty – I'll use what the device reports, or learn it.",
	"tip.f_battery_priority.title": "What does order mean?",
	"tip.f_battery_priority.text": "If you have several batteries, I charge the one with the lower number first. 1 = first.",
	"tip.f_battery_control.title": "What does control mean?",
	"tip.f_battery_control.text": "In live mode I set the charge target and discharging myself and put everything back at the end of every night. Switched off, I only watch.",
	"tip.f_battery_control.hint": "In the simulation I don't switch anything anyway.",
	"tip.f_calendars.title": "Why calendars?",
	"tip.f_calendars.text": "Appointments tell me when someone is away or working from home. I only read whether and when something is scheduled. Each person can have as many calendars as you like.",
	"tip.f_person_add.title": "Who belongs here?",
	"tip.f_person_add.text": "Everyone who lives here. Their presence comes from Home Assistant; you can add calendars afterwards.",
	"tip.f_consumer_runs.title": "Why do I want to know?",
	"tip.f_consumer_runs.text": "I plan the home battery only for what it really has to cover.\n**Only with solar surplus** – runs only when the sun delivers more than the home needs (e.g. via evcc). I plan the battery without this device.\n**Only on cheap power** – runs at night in the cheap hours, not from the battery.\n**When it is needed** – counts as usual.\nA wallbox never counts: I don't charge the car from the home battery.",
	"tip.f_consumer_kind.title": "What does the kind mean?",
	"tip.f_consumer_kind.text": "For every device with its own meter I learn how its use depends on the outdoor temperature. **Meter for other devices** means it also measures devices listed here themselves – I don't count them twice.",
	"tip.r_reserve_soc.title": "What is the reserve?",
	"tip.r_reserve_soc.text": "I never discharge the batteries below this – as an emergency reserve or to go easy on the battery.",
	"tip.r_reserve_soc.hint": "10 % suits most batteries.",
	"tip.r_max_target_soc.title": "Why not always charge to full?",
	"tip.r_max_target_soc.text": "I never charge higher than this from the grid at night, so there's room for the sun. Usually I charge less anyway, because I work out exactly what's needed.",
	"tip.r_evening_min_soc.title": "What does minimum in the evening mean?",
	"tip.r_evening_min_soc.text": "If there should always be something in the battery in the evening – for the evening peak or a power cut –, enter the lower limit here. Empty = no minimum.",
	"tip.r_grid_limit_w.title": "What is the grid limit?",
	"tip.r_grid_limit_w.text": "How much power may come from the grid at the same time at night. I share it between car, hot water and batteries and stay below it.",
	"tip.r_grid_limit_w.hint": "A 3 × 35 A grid connection handles about 24 kW.",
	"tip.r_max_night_kwh.title": "Why an upper limit?",
	"tip.r_max_night_kwh.text": "If you never want to charge more than a certain amount from the grid per night, enter it. Empty = as much as needed.",
	"tip.r_max_price.title": "Why a highest price?",
	"tip.r_max_price.text": "I never charge from the grid above this price – even if the calculation would narrowly recommend it. I may still hold the batteries.",
	"tip.r_min_saving.title": "Why a minimum saving?",
	"tip.r_min_saving.text": "Every time I steer, I write values to your devices. If a night brings less than this amount, I leave it and the batteries run as without me. Maintenance nights are the exception.",
	"tip.r_grid_friendly.title": "What does grid-friendly mean?",
	"tip.r_grid_friendly.text": "At midday all solar systems deliver the most at once – the grid is full. In the morning and evening everyone needs power – it is short.\n**Batteries**: On sunny days I hold back charging in the morning, the surplus goes to the grid and the battery charges at the midday peak. I take only 80 % of the forecast and let go early when the sun lags. This works with batteries whose charging power I can limit.\n**Morning and evening** the home takes power from the battery instead of the grid.\n**Car**: If it leaves only in the afternoon, it charges with the sun instead of at night.",
	"tip.r_grid_friendly.hint": "I only steer this in the modes “Suggest” and “Live”; in simulation I only show it.",
	"tip.r_grid_first.title": "Saving or grid?",
	"tip.r_grid_first.text": "**Saving**: I only wait in the morning as long as the battery still gets as full as otherwise – it costs you nothing.\n**Grid**: I also wait longer when the battery then doesn't get quite full – that may cost up to 30 ct a day.",
	"tip.r_guard_grid.title": "What does the protection do?",
	"tip.r_guard_grid.text": "While I charge, I look at the grid draw every minute. If it is above your grid limit – because stove, wallbox and heat pump run at the same time – I hold the batteries for five minutes instead of charging. Then I carry on.",
	"tip.r_balance_days.title": "What is a maintenance charge?",
	"tip.r_balance_days.text": "Many batteries only balance their cells when they get full now and then – otherwise the level shown drifts over time. If a battery has not been full for that many days and the sun won't fill it tomorrow either, I charge it to 100 % once in the cheap hours.",
	"tip.r_balance_days.hint": "Usual are 14 to 30 days. See your battery's manual.",
	"tip.r_buffer_factor.title": "What is the safety buffer?",
	"tip.r_buffer_factor.text": "This much I add to my calculation while I don't know your home well yet. The better my forecasts get, the smaller it becomes.",
	"tip.r_plan_offset_min.title": "When do I fix the plan?",
	"tip.r_plan_offset_min.text": "This many minutes before the cheap hours begin I work out the plan for the night – with the latest forecast.",
	"tip.r_reset_lead_min.title": "Why put things back before the end?",
	"tip.r_reset_lead_min.text": "This many minutes before the cheap hours end I put everything back, for example the wallbox from “Now” to “PV”. Some devices keep running for a moment – this way nothing costs the day price.",
	"tip.r_priority.title": "Who gets power first?",
	"tip.r_priority.text": "If the grid limit isn't enough for everyone, whoever is on top gets power first. The others wait or charge more slowly.",
	"tip.r_discharge_in_window.title": "What may the batteries do at night?",
	"tip.r_discharge_in_window.text": "**Down to the target** – discharge, but only down to the level I need for the morning. If the battery won't last until the sun, power comes cheaply from the grid now instead.\n**Pause** – no discharging during the cheap hours.\n**Free** – discharge as usual.",
	"tip.r_discharge_in_window.hint": "“Down to the target” saves the most.",
	"overview.now": "Right now",
	"overview.now.solar": "Sun",
	"overview.now.solar.sub": "producing right now",
	"overview.now.home": "Home",
	"overview.now.home.sub": "using right now",
	"overview.now.home.calc": "using, worked out",
	"overview.now.battery": "Battery",
	"overview.now.battery.charge": "Battery charging",
	"overview.now.battery.discharge": "Battery discharging",
	"overview.now.soc": "{value} % full",
	"overview.now.soc_avg": "{value} % on average · {count} batteries",
	"overview.now.no_battery": "no battery",
	"overview.now.grid": "Grid",
	"overview.now.grid.in": "Grid import",
	"overview.now.grid.out": "Feed-in",
	"overview.now.grid.in.sub": "coming from the grid",
	"overview.now.grid.out.sub": "going to the grid",
	"overview.now.grid.idle": "almost nothing",
	"overview.now.none": "no sensor",
	"overview.week": "The last 7 days",
	"overview.week.known": "{days} days remembered",
	"overview.week.none": "Nothing recorded yet – it starts after the first full hour.",
	"overview.week.more": "Open history",
	"status.running": "running",
	"status.paused": "paused",
	"status.waiting": "waiting",
	"history.live_since": "Watching live since {time}",
	"history.live_since_day": "Watching live since {day}",
	"history.paused": "Paused – in “Off” mode I don't watch",
	"history.known": "{days} days remembered, since {first}",
	"history.reading": "I'm reading the last weeks from your Home Assistant …",
	"history.days": "Days",
	"history.workday": "Working day",
	"history.day_off": "Weekend or holiday",
	"history.live": "watched live",
	"history.read": "read from Home Assistant",
	"history.missing": "I'm missing data for {hours} hours – Home Assistant was off or a sensor didn't report.",
	"history.failed": "I couldn't load the history just now.",
	"history.empty.off": "I'm taking a break. Switch me back to simulation and I'll keep watching – and fetch what's missing from your Home Assistant.",
	"history.empty.reading": "I'm reading the last weeks from your Home Assistant. You'll see every day here in a moment.",
	"history.empty.soon": "I'm watching. After the first full hour you'll see here what happened.",
	"history.empty.waiting": "Once the setup is done, I write down every hour what happens in your home.",
	"history.tile.home": "Consumption",
	"history.tile.home.self": "{value} % self-supplied",
	"history.tile.solar": "Sun",
	"history.tile.solar.fc": "forecast {value} kWh, reached {ratio} %",
	"history.tile.solar.nofc": "no forecast remembered",
	"history.tile.grid": "Grid import",
	"history.tile.grid.cheap": "{value} kWh of it cheap",
	"history.tile.grid.out": "fed in {value} kWh",
	"history.tile.battery": "Battery charged",
	"history.tile.battery.out": "discharged {value} kWh",
	"history.tile.temp": "Outside",
	"history.tile.temp.range": "{min} to {max} °C",
	"history.tile.present": "At home",
	"history.chart.energy": "Energy per hour",
	"history.chart.soc": "Charge level",
	"history.chart.home": "Consumption",
	"history.chart.solar": "Sun",
	"history.chart.forecast": "Forecast",
	"history.chart.cheap": "cheap",
	"history.chart.sunrise": "sunrise {time}",
	"history.chart.sunset": "sunset {time}",
	"settings.observe": "Watching",
	"settings.observe.recording": "Recording",
	"settings.observe.since": "Running since {day}, {time}.",
	"settings.observe.off": "Paused – in “Off” mode I don't watch.",
	"settings.observe.waiting": "Starts once the setup is done and I know your sensors.",
	"settings.observe.history": "History",
	"settings.observe.days": "{days} days, since {first}",
	"settings.observe.nothing": "Nothing recorded yet",
	"settings.observe.no_recorder": "Home Assistant keeps no history (recorder off)",
	"settings.observe.failed": "Something went wrong the last time I read it",
	"settings.observe.rebuild": "Read again",
	"tip.now.title": "What am I looking at?",
	"tip.now.text": "What's flowing right now: what the sun produces, what the home uses, whether the batteries charge or discharge and whether power comes from or goes to the grid. Live from your sensors.",
	"tip.week.title": "What am I looking at?",
	"tip.week.text": "Your **consumption** per day and what the **sun** delivered. Tap a day for the exact values.",
	"tip.chart_energy.title": "What am I looking at?",
	"tip.chart_energy.text": "Per hour: **consumption** as bars, **sun** as an area and the **forecast** from the evening before as a dashed line. Your cheap hours are shaded. Tap an hour for the exact values.",
	"tip.chart_soc.title": "What am I looking at?",
	"tip.chart_soc.text": "How full your batteries were at every full hour.",
	"tip.observe.title": "What do I write down?",
	"tip.observe.text": "Every hour: consumption, sun, grid and batteries, plus outdoor temperature, who was at home and the solar forecast. That's what I learn from. Everything stays in your Home Assistant.",
	"tip.observe.hint": "In “Off” mode I don't write anything down. What's missing then I fetch later from Home Assistant's history.",
	"tip.rebuild.title": "When should I read it again?",
	"tip.rebuild.text": "When you picked other sensors. Then I read the last 8 weeks again from Home Assistant. What only I saw live – temperature, who was at home, the forecast – is kept.",
	"overview.night.more": "Open plan",
	"plan.page.title": "My plan |for tonight",
	"plan.big.none": "Nothing to do",
	"plan.big.unavailable": "No plan",
	"plan.fixed_at": "fixed since {time}",
	"plan.preview_at": "preview, as of {time}",
	"plan.refresh": "Plan again",
	"plan.say.charge": "I'll charge to {target} % from {from} – no more than needed.",
	"plan.say.charge_slots": "I charge in the cheapest quarter hours of the night ({slots}) to {target} %.",
	"plan.say.balance": "Tonight is a maintenance night: I charge full once so the batteries can balance their cells.",
	"plan.say.small_saving": "I leave it tonight: it would save less than the minimum saving you set in the rules.",
	"plan.say.max_price": "Above your highest price I don't charge from the grid.",
	"plan.say.hold": "I won't charge, but I'll hold the batteries at {target} % during the cheap hours – better cheap grid power now than expensive power tomorrow morning.",
	"plan.say.empty": "Without me they'd be empty at {time}.",
	"plan.say.none": "Nothing to do tonight: the batteries last until the sun takes over at {time}.",
	"plan.say.none_nosun": "Nothing to do tonight: charging from the grid wouldn't pay off.",
	"plan.say.sun_full": "From {sun} the sun takes over, by {full} the batteries are full.",
	"plan.say.sun": "From {sun} the sun takes over.",
	"plan.say.nosun": "Tomorrow the sun won't be enough for the whole house.",
	"plan.line.hold": "holds {target} %",
	"plan.line.now": "now {soc} %",
	"plan.line.watch_only": "I can only watch it",
	"plan.cost.night": "night power {value}",
	"plan.cost.saving": "saved compared to no plan ≈ {value}",
	"plan.empty.off": "I'm taking a break. Switch me to simulation and I'll plan every night again.",
	"plan.empty.waiting": "Once the setup is done, I plan here every night – with curves for sun, consumption and charge level.",
	"plan.why.no_window": "Your tariff has no cheap hours – charging at night doesn't pay off. I keep watching and learning.",
	"plan.why.dynamic": "For market prices I need the prices of the coming hours. Pick the price sensor of your tariff integration under Settings → Tariff.",
	"plan.why.no_prices": "Your price sensor does not provide a price list for the coming hours. Pick a sensor that has them under Settings → Tariff (e.g. Nord Pool, EPEX Spot, Tibber, ENTSO-E).",
	"plan.why.prices_pending": "The prices for the night are not there yet – they usually come around 1 pm. Then I plan.",
	"plan.why.no_battery": "Without a battery whose size I know, there's nothing to plan at night.",
	"plan.why.failed": "Something went wrong while planning. I'll try again at the next full hour.",
	"plan.note.capacity_unknown": "One battery is missing from the calculation because I don't know its size.",
	"plan.note.soc_unknown": "One battery is missing from the calculation because its charge level isn't reporting.",
	"plan.note.not_controllable": "I can only watch one battery – in the simulation I calculate as if I could control it.",
	"plan.note.no_forecast": "Without a forecast I calculate as if no sun came tomorrow – so, cautiously.",
	"plan.note.default_profile": "I don't know your consumption well yet and use a typical household.",
	"plan.note.prices_partly": "For some hours I don't know the prices yet and use the average there.",
	"plan.note.balance_due": "A battery has not been full for a while – time for a maintenance charge.",
	"plan.chart.energy": "Sun, consumption and charging",
	"plan.chart.solar": "Sun (forecast)",
	"plan.chart.home": "Consumption (expected)",
	"plan.chart.charge": "Charging from the grid",
	"plan.chart.sun": "sun takes over {time}",
	"plan.chart.soc": "Charge level",
	"plan.chart.plan": "with plan",
	"plan.chart.without": "without plan",
	"plan.chart.target": "target {value} %",
	"plan.chart.full": "full {time}",
	"plan.chart.reserve": "reserve {value} %",
	"plan.chart.prices": "Prices",
	"plan.chart.price": "Price per kWh",
	"plan.chart.charge_at": "Charging from {time}",
	"plan.slots": "Charging: {slots}",
	"plan.math": "How I calculated",
	"plan.math.battery_now": "Batteries now",
	"plan.math.battery_now.sub": "{stored} of {capacity} kWh",
	"plan.math.battery_start": "When the cheap hours begin",
	"plan.math.solar": "Sun tomorrow",
	"plan.math.solar.hours": "hourly forecast of your solar system",
	"plan.math.solar.sum": "daily forecast, spread over the day",
	"plan.math.solar.none": "no forecast – I calculate without sun",
	"plan.math.solar.factor": "× {value}, how well the forecast fits your home",
	"plan.math.solar.combined": "× {value}, several forecasts combined",
	"plan.math.solar.weather": "× {value}, how it fits on “{weather}” days",
	"plan.math.tomorrow": "Tomorrow",
	"plan.math.tomorrow.person": "{name}: {label}",
	"plan.math.tomorrow.scaled": "for the whole day I expect {expected} kWh instead of the usual {usual} kWh",
	"plan.math.tomorrow.usual": "I calculate as for a usual day",
	"plan.math.home": "Consumption tomorrow",
	"plan.math.home.history": "from {days} days, {kind}",
	"plan.math.home.default": "default of a typical household",
	"plan.math.workday": "for a working day",
	"plan.math.day_off": "for a weekend or holiday",
	"plan.math.target": "Target",
	"plan.math.target.sub": "{optimum} % would be needed, plus {buffer} % buffer on the part above the reserve",
	"plan.math.prices": "Prices",
	"plan.math.prices.value": "cheap {night} · otherwise {day} · feed-in {feed}",
	"plan.math.prices.assumed": "I don't know all prices – I assumed the missing ones. Enter them in the settings.",
	"plan.math.rules": "Rules",
	"plan.math.rules.value": "reserve {reserve} % · at most {max} % · discharging: {mode}",
	"history.chart.plan": "Plan",
	"tip.plan_target.title": "What does the target mean?",
	"tip.plan_target.text": "The batteries should leave the cheap hours at this level. Below it I charge from the grid – as late as possible. Above it they only discharge down to the target, so there's enough until the sun takes over.",
	"tip.plan_target.hint": "In the simulation I don't switch anything – I only show what I would do.",
	"tip.plan_refresh.title": "When do I plan again?",
	"tip.plan_refresh.text": "Every hour by myself, with the latest forecast. Shortly before the cheap hours I fix the plan, then it stays until the morning. **Plan again** calculates right away.",
	"tip.plan_math.title": "How do I decide?",
	"tip.plan_math.text": "I play through the hours until the next night – for every possible target – and take the one that costs you least. Since I'm still learning, I add a buffer.",
	"tip.chart_plan_energy.title": "What am I looking at?",
	"tip.chart_plan_energy.text": "What I expect per hour: **sun** from the forecast, your **consumption** from similar days and when I **charge from the grid**. The cheap hours are shaded.",
	"tip.chart_plan_prices.title": "What am I looking at?",
	"tip.chart_plan_prices.text": "Your tariff's price for every hour. The shaded part is the window in which I hold the batteries; the marks show when I charge – in the cheapest quarter hours.",
	"tip.chart_plan_soc.title": "What am I looking at?",
	"tip.chart_plan_soc.text": "How full the batteries would be **with the plan** and **without it**. The difference is what I save you.",
	"learn.page.title": "What I've |learned",
	"learn.lead": "Every morning I replay the night's plan with the real day. That's how I learn how well the forecast fits your home and how much buffer you really need.",
	"learn.since": "Learning since {day}",
	"learn.since_start": "Learning from everything I've seen since {day}",
	"learn.updated": "last learned {day}, {time}",
	"learn.paused": "Paused – I don't learn in “Off” mode",
	"learn.waiting": "I'll start learning once setup is done",
	"learn.failed": "I couldn't load what I've learned just now.",
	"learn.nights.one": "one night",
	"learn.nights.many": "{count} nights",
	"learn.results": "What it would have saved",
	"learn.results.say": "That's what you would have saved since {since} if I had been in control – over {nights}, replayed with the real weather and your real consumption.",
	"learn.results.split": "{better} × better · {worse} × more expensive · {same} × the same",
	"learn.results.none": "I haven't replayed a plan yet. The morning after the first planned night you'll see here what it would have saved.",
	"learn.results.chart": "Per night",
	"learn.results.chart.saving": "saved",
	"learn.still": "still learning",
	"learn.days": "from {days} days",
	"learn.mornings": "from {count} mornings",
	"learn.solar": "Solar forecast",
	"learn.solar.less": "The forecast promises {value} % too much on average – I only count on {share} % of it.",
	"learn.solar.more": "Your system delivers {value} % more than forecast on average – I count on {share} %.",
	"learn.solar.fits": "The forecast fits your home well – I take it as it is.",
	"learn.solar.learning": "Every day I compare the previous evening's forecast with what your system delivers. After {need} days I know how well it fits – I have {have}.",
	"learn.solar.chart": "Sun per day",
	"learn.solar.chart.actual": "delivered",
	"learn.solar.chart.forecast": "forecast the evening before",
	"learn.shift": "Time offset",
	"learn.shift.big.0": "fits",
	"learn.shift.big.1": "+1 h",
	"learn.shift.big.-1": "−1 h",
	"learn.shift.0": "The forecast's hours match your system.",
	"learn.shift.1": "Your forecast runs an hour early – I move it one hour later.",
	"learn.shift.-1": "Your forecast runs an hour late – I move it one hour earlier.",
	"learn.shift.learning": "I check whether the hourly forecast arrives at the right time of day. I need {need} days with hourly values – I have {have}.",
	"learn.shift.chart": "Sun per hour, on average",
	"learn.shift.chart.actual": "delivered",
	"learn.shift.chart.forecast": "forecast the evening before",
	"learn.buffer": "Buffer",
	"learn.buffer.learned": "That's what I add on top of the target I need. With it, 8 out of 10 mornings would have lasted until the sun.",
	"learn.buffer.default": "My starting value, cautious on purpose. After {need} replayed nights I know how much buffer you really need – I have {have}.",
	"learn.buffer.user": "You set this yourself – I'll leave it.",
	"learn.buffer.user_learned": "You set this yourself. I would have taken {value} %.",
	"learn.buffer.own": "Let Joe learn it again",
	"learn.buffer.chart": "Needed until the sun",
	"learn.buffer.chart.planned": "planned",
	"learn.buffer.chart.actual": "needed",
	"learn.home": "Consumption",
	"learn.home.history": "I know your daily pattern from {days} days – working days and days off separately.",
	"learn.home.default": "I don't know your consumption well yet and use a typical household.",
	"learn.home.totals": "working day ≈ {workday} kWh · day off ≈ {day_off} kWh",
	"learn.home.chart": "Consumption per hour",
	"learn.home.chart.workday": "working day",
	"learn.home.chart.day_off": "weekend or holiday",
	"learn.accuracy": "How close I was",
	"learn.accuracy.night": "Night",
	"learn.accuracy.solar": "Sun",
	"learn.accuracy.morning": "Until the sun",
	"learn.accuracy.result": "Saved",
	"learn.accuracy.value": "{expected} → {actual}",
	"learn.accuracy.none": "Once I've replayed plans, you'll see here for every night what I expected and what came.",
	"ask.title": "Joe asks",
	"ask.lead": "On these days your consumption was far from what I expected. Tell me briefly what happened – then I learn the right thing from it.",
	"ask.more": "{day}: You used {actual} kWh, I had expected {expected} kWh. Was anything special?",
	"ask.less": "{day}: You only used {actual} kWh, I had expected {expected} kWh. Were you away?",
	"ask.answers": "Answers",
	"ask.answer.guests": "We had guests",
	"ask.answer.away": "We were away",
	"ask.answer.special": "Something else special",
	"ask.answer.normal": "A normal day",
	"learn.models": "What I know about your home",
	"learn.model": "Consumption and weather",
	"learn.model.no_weather": "Without a weather entity I don't know the outdoor temperature. Pick one in the setup, then I learn how much more you need when it's cold.",
	"learn.model.learning": "Every day I compare your consumption with the outdoor temperature. From {need} complete days on I use it – I have {have}.",
	"learn.model.base": "On warm days you need about {value} kWh.",
	"learn.model.workday_more": "On working days {value} kWh more.",
	"learn.model.workday_less": "On working days {value} kWh less.",
	"learn.model.heat": "Every degree below 15 °C costs {value} kWh more.",
	"learn.model.cool": "Every degree above 22 °C costs {value} kWh more.",
	"learn.model.presence": "Every extra hour someone is at home costs {value} kWh.",
	"learn.model.fit": "That explains {share} % of the differences between your days.",
	"learn.model.chart": "Consumption per day by outdoor temperature",
	"learn.model.chart.actual": "measured (average)",
	"learn.model.chart.workday": "expected, working day",
	"learn.model.chart.day_off": "expected, day off",
	"learn.weather": "Sun by weather",
	"learn.weather.say": "How well the forecast fits depends on the weather. A day counts as clear when its forecast reaches at least 70 % of the best day of the last 30 days ({top} kWh).",
	"learn.weather.learning": "For each kind of weather I need at least three days to see how well the forecast fits – I have {have} days in all.",
	"learn.weather.clear": "clear",
	"learn.weather.mixed": "mixed",
	"learn.weather.overcast": "overcast",
	"learn.sources": "Forecast sources",
	"learn.sources.main": "Main forecast",
	"learn.sources.error": "typically ±{value} % off",
	"learn.sources.weight": "counts {value} %",
	"learn.sources.learning": "still learning (from {need} days)",
	"learn.sources.combine": "Combine forecasts",
	"learn.sources.single": "I only have one forecast. If you have a second integration (for example Solcast and Forecast.Solar), I find it with the next search and compare both.",
	"learn.battery": "Batteries as they really are",
	"learn.battery.learning": "I measure what goes in and out and how the charge level changes. After about {need} days with movement I know how much it really holds.",
	"learn.battery.no_power": "Without a power measurement of the battery I can't measure its size and losses.",
	"learn.battery.user": "You entered {value} kWh – I keep using that.",
	"learn.battery.odd": "That doesn't fit the {value} kWh the device reports – I'd rather use the device value. Check the charge level and power sensors.",
	"learn.battery.uses_nominal": "The device says {value} kWh – I use the measured value.",
	"learn.battery.uses": "I use the measured value.",
	"learn.battery.capacity": "{value} kWh usable",
	"learn.battery.efficiency": "{value} % come back out",
	"learn.battery.none": "No battery is set up yet.",
	"learn.groups": "Devices with their own meter",
	"learn.groups.average": "avg. {value} kWh a day",
	"learn.groups.heat": "+{value} kWh per degree below 15 °C",
	"learn.groups.steady": "independent of the weather",
	"learn.groups.none": "Devices with their own meter from the energy dashboard get their own calculation here – a heat pump, for example.",
	"learn.hot_water": "Hot water",
	"learn.hot_water.rate": "heats {value} K/h",
	"learn.hot_water.loss": "loses {value} K/h",
	"learn.hot_water.demand": "{value} K used a day",
	"learn.hot_water.learning": "I learn from the temperature curve of the last three weeks (from Home Assistant's recorder).",
	"learn.hot_water.none": "Add a night action “Hot water” with a temperature sensor under Devices, then I learn how fast it heats and how much you use a day.",
	"learn.presence": "Who is at home when",
	"learn.presence.value": "{label}: {hours} h",
	"learn.presence.no_person": "Without a person entity I can't see when someone is at home.",
	"learn.presence.none": "Assign calendars to people, then I learn how many hours they are at home on office, home office or vacation days.",
	"learn.presence.calendars": "Assign calendars",
	"learn.calendar": "Calendar rules",
	"learn.calendar.say": "If one of these keywords is in an event's title, place or description, the day counts for that person as …",
	"learn.calendar.remove": "Remove keyword {keyword}",
	"learn.calendar.keyword": "Keyword",
	"learn.calendar.add_to": "Add a keyword for {label}",
	"learn.calendar.add": "Add",
	"learn.calendar.defaults": "Without a matching event",
	"learn.calendar.default_workday": "On working days",
	"learn.calendar.default_day_off": "On days off",
	"learn.calendar.for": "Rules for",
	"learn.calendar.everyone": "Everyone",
	"learn.calendar.shared": "Applies to everyone",
	"learn.calendar.shared.say": "{name} follows the rules for everyone. Turn off “Applies to everyone” to set own keywords – Joe starts from the current ones.",
	"tip.cal_person.title": "Whom do the rules apply to?",
	"tip.cal_person.text": "“Everyone” holds the shared rules. Pick a person to see their rules – their own or the shared ones. A small icon next to a name shows that person has rules of their own.",
	"tip.cal_shared.title": "Shared or own rules?",
	"tip.cal_shared.text": "On: the rules for everyone apply to this person. Off: they get their own keywords and their own defaults without a matching event – starting as a copy of the shared ones.",
	"tip.cal_shared.hint": "Turning it back on discards this person's own rules.",
	"label.home_office": "Home office",
	"label.office": "Office",
	"label.travel": "Business trip",
	"label.vacation": "Vacation",
	"label.guests": "Guests",
	"label.home": "At home",
	"learn.reset": "Start over",
	"learn.reset.text": "I forget what I learned – everything or just one area – and learn it again from new days. Your settings and the history stay.",
	"learn.reset.scope": "What should I forget?",
	"learn.reset.scope.all": "Everything",
	"learn.reset.scope.forecast": "Sun",
	"learn.reset.scope.consumption": "Consumption",
	"learn.reset.scope.battery": "Batteries",
	"learn.reset.scope.hot_water": "Hot water",
	"learn.reset.button": "Reset learning",
	"learn.reset.button.scope": "Reset this area",
	"learn.reset.off": "In “Off” mode I don't learn – you can reset as soon as I simulate again.",
	"learn.reset.label": "Reset learning",
	"learn.reset.confirm.title": "Really |start over?",
	"learn.reset.confirm.forget": "What I forget",
	"learn.reset.forget.all": "Forecast factors, time shift, weather classes, forecast sources, the learned buffer, all calculations for consumption, batteries and hot water, and the record of what it would have brought.",
	"learn.reset.forget.forecast": "Forecast factor, time shift, the factors per weather class and how well the forecast sources fit.",
	"learn.reset.forget.consumption": "The consumption and weather calculation, the calculations per device, presence by calendar and the learned buffer.",
	"learn.reset.forget.battery": "The measured size and efficiency of your batteries.",
	"learn.reset.forget.hot_water": "Heating rate, standing loss and daily use of the hot water.",
	"learn.reset.confirm.keep": "What stays",
	"learn.reset.confirm.keep.text": "Your settings, a buffer you set yourself and the whole history. From now on I only learn from new days.",
	"learn.reset.keep.scope": "Everything else I learned, your settings and the whole history. I learn this area again only from new days.",
	"learn.reset.confirm.go": "Reset",
	"learn.reset.done": "Done – I'm learning afresh from now.",
	"learn.reset.done.scope": "Done – I'm learning this area afresh from now.",
	"action.need": "Charge by need",
	"action.need.on": "on – I only charge what tomorrow needs",
	"action.need.off": "off – I charge when little sun comes",
	"action.need.hint": "I look at how far you drive tomorrow (appointments with a place in your calendars or your usual distance), add a reserve and charge only what the car is missing for it – as late as possible in the cheap hours.",
	"action.need.soc": "Car's charge level",
	"action.need.range": "Car's range",
	"action.need.capacity": "Usable battery size",
	"action.need.from_sensor": "from the sensor",
	"action.need.reserve": "Reserve",
	"action.need.consumption": "Consumption",
	"action.need.learned": "I learn it",
	"action.need.daily": "Usual distance a day",
	"action.need.odometer": "Odometer",
	"action.need.persons": "Whose appointments count",
	"action.need.no_calendars": "Nobody has a calendar yet. You assign calendars under Settings → Household.",
	"action.need.calendars": "Calendars of this car",
	"calendar.own.after_save": "Once saved, I create the calendar “{name}” in Home Assistant – Joe's calendar for this car. Every invitation I accept will be in it, and you can add it to your phone.",
	"calendar.own.hint": "“{name}” is Joe's calendar for this car in Home Assistant. It holds the accepted invitations; you can add trips yourself too. Add it to your phone:",
	"calendar.copy": "Copy link",
	"calendar.copied": "Copied",
	"calendar.renew": "New link",
	"calendar.no_external": "To subscribe, Home Assistant must be reachable from outside (e.g. through Home Assistant Cloud or your own address).",
	"calendar.add": "Choose calendar",
	"calendar.remove": "Remove {name}",
	"calendar.pick": "Which calendars belong to this car?",
	"calendar.connect": "Not in Home Assistant yet? Connect your calendar:",
	"calendar.connect.google": "Google",
	"calendar.connect.caldav": "iCloud, Infomaniak, Nextcloud",
	"calendar.connect.ical": "iCal link",
	"calendar.connect.microsoft": "Microsoft 365 / Outlook",
	"calendar.account.client_id.needed": "Your app at this provider",
	"calendar.account.no_joe_app": "Joe's own app does not exist here yet – enter the ID of your own app (instructions in the i).",
	"calendar.account.oauth.no_client_id": "I am missing the app to sign in with – enter your own above.",
	"calendar.account.oauth.expired_token": "The code ran out – start the sign-in again.",
	"calendar.account.oauth.access_denied": "The sign-in was declined or cancelled.",
	"calendar.account.oauth.authorization_declined": "The sign-in was declined or cancelled.",
	"calendar.account.oauth.invalid_client": "The provider does not know this app ID – check it (and for Google the client secret).",
	"calendar.account.oauth.unauthorized_client": "This app may not sign in this way – at Microsoft turn on “Allow public client flows”, at Google use the type “TVs and Limited Input devices”.",
	"calendar.account.oauth.invalid_scope": "The provider refuses access to the calendar.",
	"calendar.account.oauth.invalid_grant": "The sign-in is no longer valid – sign in again.",
	"calendar.account.oauth.connect": "The provider could not be reached – try again in a moment.",
	"calendar.account.oauth.no_sign_in": "This kind of account signs in with a password, not with a code.",
	"calendar.account.oauth.other": "The sign-in did not work.",
	"calendar.account.error.no_server": "server address missing",
	"calendar.account.error.accept": "accepting failed",
	"calendar.account.error.other": "unknown error",
	"calendar.account.result.no_sign_in": "This kind of account signs in with a password.",
	"calendar.account.result.no_account": "Choose the kind of account first.",
	"calendar.account.result.accept": "Reading works, accepting does not.",
	"calendar.account.result.other": "That did not work.",
	"mail.allowed.placeholder": "name@example.org, @company.com",
	"mail.error.ascii": "password with special characters",
	"mail.result.error_ascii": "Mailboxes only take passwords without characters like ä, ß or € – an app password works best.",
	"mail.result.error_unknown": "That did not work – unknown error.",
	"calendar.links_failed": "I could not load the links to Joe's calendars just now.",
	"calendar.retry": "Try again",
	"calendar.copy_failed": "Copying does not work here – the link is selected, copy it yourself.",
	"calendar.own.legacy": "Joe's old calendar for this car",
	"calendar.own.legacy.hint": "“{name}” still holds trips you entered by hand. They still count; once none is left, the calendar goes away.",
	"tip.account_allowed.title": "Why a list?",
	"tip.account_allowed.text": "Otherwise anyone could send the car appointments. I only accept invitations from senders listed here – an address or a whole domain like “@company.com”. Unanswered invitations from anyone else do not count as trips; what you enter in the account's calendar yourself does.",
	"calendar.account.kind.google": "Google (Gmail)",
	"calendar.account.placeholder.google": "kona@gmail.com",
	"calendar.account.google.hint": "So that unanswered invitations show up in the calendar: in the car's Google Calendar settings set “Add invitations to my calendar” to “From everyone”.",
	"calendar.account.client_secret": "The app's client secret",
	"calendar.account.result.oauth": "The sign-in could not be started.",
	"mail.sign_in.google": "Sign in with Google",
	"tip.google_app.title": "How do I create a Google app of my own?",
	"tip.google_app.text": "Only needed while Joe's own app is missing – once in the Google Cloud Console (console.cloud.google.com):\n1. Create a project, then “APIs & Services” → Library → enable the **Google Calendar API**.\n2. OAuth consent screen: user type “External”, app name and your address; then **publish** the app (otherwise the sign-in runs out after 7 days).\n3. Credentials → Create OAuth client ID → type **“TVs and Limited Input devices”**.\n4. Enter client ID and client secret here.",
	"tip.google_app.hint": "When you sign in, Google warns that the app is not verified – for your own app that is fine (“Advanced” → “Continue”).",
	"calendar.way.ha": "Finished calendar",
	"calendar.way.ha.hint": "The car's appointments are already in a calendar in Home Assistant. Joe only reads it.",
	"calendar.way.mailbox": "Mailbox without calendar",
	"calendar.way.mailbox.hint": "The car has an email address, e.g. at GMX or another provider. Joe accepts and puts the appointments into his calendar.",
	"calendar.way.account": "Mailbox with calendar",
	"calendar.way.account.hint": "Google, Microsoft 365, Outlook.com, iCloud or Infomaniak: the appointments land in the account's calendar. Joe reads it and accepts there.",
	"calendar.own.name": "Energy Joe Calendar {car}",
	"calendar.account.password": "App password",
	"calendar.account.placeholder.outlook": "kona@outlook.com",
	"calendar.account.placeholder.microsoft": "car@company.com",
	"calendar.account.placeholder.icloud": "kona@icloud.com",
	"calendar.account.placeholder.infomaniak": "kona@ik.me",
	"calendar.account.placeholder.caldav": "kona@example.org",
	"flow.mailbox.title": "How an appointment gets to the car through the mailbox",
	"flow.account.title": "How an appointment gets to the car through the account",
	"flow.mailbox.3": "**Joe fetches the invitation** from the mailbox and **accepts** in the car's name.",
	"flow.mailbox.4": "Joe puts the appointment into **“{calendar}”** – his calendar in Home Assistant.",
	"flow.account.3": "The appointment lands **in the account's calendar by itself**.",
	"flow.account.4": "**Joe reads this calendar** and accepts there in the car's name.",
	"flow.charge": "Joe works out the distance and **charges in time**.",
	"mail.address.placeholder": "kona123@gmx.net",
	"mail.provider.webde": "web.de",
	"mail.provider.webde.hint": "With the normal password. Allow access under “POP3/IMAP” in the web.de settings.",
	"mail.provider.gmx": "GMX",
	"mail.provider.gmx.hint": "With the normal password. Allow access under “POP3/IMAP” in the GMX settings.",
	"mail.provider.tonline": "T-Online",
	"mail.provider.tonline.hint": "With the email password from the Telekom customer center (not the login password).",
	"mail.after_save": "Once saved, I look into the mailbox for the first time – then every 5 minutes.",
	"mail.allowed.none": "Nobody may invite yet – add your own address first.",
	"mail.result.error_no_mailbox": "Save the car first.",
	"mail.state.waiting": "Not looked yet.",
	"tip.mail_provider.hint": "Does your provider have a calendar (Google, Microsoft, iCloud, Infomaniak)? Then “Mailbox with calendar” is the better way.",
	"tip.calendar_account.hint": "Signing in, the password and “Read calendar” work before saving – Joe reads trips once it is saved.",
	"tip.calendar_account_address.title": "Which address?",
	"tip.calendar_account_address.text": "The address of the account that belongs to the car only. Exactly this address is what you invite to appointments when you drive the car.",
	"tip.calendar_account_url.title": "Which server?",
	"tip.calendar_account_url.text": "The CalDAV address of your server, e.g. for Nextcloud https://cloud.example.org/remote.php/dav/. I find the calendars below it myself.",
	"tip.calendar_account_test.title": "What does “Read calendar” do?",
	"tip.calendar_account_test.text": "I read the appointments of the next week once. That shows right away whether sign-in and calendar are right.",
	"action.need.round_trip": "There and back",
	"action.need.no_routing": "I can only work out how far appointments are once you pick a service under Settings → Distances. Until then only appointments at a zone and your usual distance count.",
	"action.need.pick.soc": "Which sensor shows the car's charge level?",
	"action.need.pick.range": "Which sensor shows the range?",
	"action.need.pick.capacity": "Which sensor shows the battery size?",
	"action.need.pick.odometer": "Which sensor shows the odometer?",
	"action.need.pick.consumption": "Which sensor shows the average consumption?",
	"mail.provider": "Provider",
	"mail.provider.google": "Gmail",
	"mail.provider.other": "Other provider",
	"mail.provider.google.hint": "With an app password. Without one: “Mailbox with calendar” → Google.",
	"mail.provider.other.hint": "With your provider's server addresses and password.",
	"mail.address": "The car's address",
	"mail.password": "Password",
	"mail.password.saved": "Saved – just enter a new one to change it.",
	"mail.password.hint": "Stays with me, never in the configuration or the diagnostics.",
	"mail.servers": "Servers",
	"mail.servers.change": "Change servers",
	"mail.servers.hint": "User name (empty: the address), IMAP and SMTP of your provider.",
	"mail.username": "User name",
	"mail.imap_host": "IMAP server",
	"mail.imap_port": "IMAP port",
	"mail.smtp_host": "SMTP server",
	"mail.smtp_port": "SMTP port",
	"mail.smtp_security": "Encryption",
	"mail.smtp_security.auto": "Automatic",
	"mail.tenant": "Tenant",
	"mail.sign_in": "Sign in with Microsoft",
	"mail.sign_in.again": "Sign in again",
	"mail.sign_in.code": "Enter this code: {code} –",
	"mail.sign_in.failed": "Signing in did not work ({error}).",
	"mail.signed_in": "Signed in – I keep the sign-in fresh myself.",
	"mail.sign_out": "Sign out",
	"mail.allowed": "Who may invite the car?",
	"mail.allowed.hint": "I only accept invitations from these senders. Addresses or whole domains like “@company.com”.",
	"mail.allowed.add": "Add",
	"mail.allowed.remove": "Remove {rule}",
	"mail.accept": "Accept invitations",
	"mail.test": "Test connection",
	"mail.check": "Look now",
	"mail.result.ok": "Login works – for IMAP and SMTP.",
	"mail.result.failed": "That did not work.",
	"mail.result.error_login": "Login refused – are address and password right?",
	"mail.result.error_connect": "Server not reachable – are the server addresses right?",
	"mail.result.error_no_server": "I am missing the server's address.",
	"mail.result.error_no_secret": "I still need the password.",
	"mail.result.error_inbox": "The inbox could not be read.",
	"mail.result.error_send": "The acceptance could not be sent.",
	"mail.recent": "Last invitations",
	"mail.recent.added": "added",
	"mail.recent.added_accepted": "added and accepted",
	"mail.recent.added_not_accepted": "added, accepting failed",
	"mail.recent.updated": "changed",
	"mail.recent.updated_accepted": "changed and accepted",
	"mail.recent.updated_not_accepted": "changed, accepting failed",
	"mail.recent.cancelled": "cancelled – removed",
	"mail.recent.not_allowed": "sender not allowed",
	"mail.recent.no_time": "without a time",
	"mail.allow": "Allow",
	"mail.state.no_secret": "I still need the password.",
	"mail.state.error": "Problem: {error}",
	"mail.state.ok": "Last looked at {time}.",
	"mail.error.login": "login refused",
	"mail.error.connect": "server not reachable",
	"mail.error.inbox": "inbox not readable",
	"mail.error.no_server": "server address missing",
	"mail.error.send": "sending failed",
	"mail.error.unknown": "unknown error",
	"calendar.source": "How do appointments get to the car?",
	"calendar.account": "The car's account",
	"calendar.account.kind": "Kind of account",
	"calendar.account.kind.outlook": "Microsoft personal (Outlook.com, Hotmail, Live)",
	"calendar.account.kind.microsoft": "Microsoft 365 / Exchange (work, school)",
	"calendar.account.kind.icloud": "iCloud",
	"calendar.account.kind.infomaniak": "Infomaniak",
	"calendar.account.kind.caldav": "Other CalDAV server",
	"calendar.account.address": "Address of the account",
	"calendar.account.after_save": "Once saved, I read the account's calendar.",
	"calendar.account.client_id": "Own app ID (optional)",
	"calendar.account.own_app": "Use an app of my own",
	"calendar.account.url": "Address of the CalDAV server",
	"calendar.account.accept": "Accept invitations",
	"calendar.account.test": "Read calendar",
	"calendar.account.result.ok": "Works.",
	"calendar.account.result.no_secret": "I am still missing the sign-in.",
	"calendar.account.result.login": "Login refused.",
	"calendar.account.result.connect": "Server not reachable.",
	"calendar.account.result.no_calendar": "No calendar found.",
	"calendar.account.result.no_client_id": "Joe's app for this provider is still missing – enter an app of your own.",
	"calendar.account.result.no_server": "I am missing the server's address.",
	"calendar.account.error.login": "login refused",
	"calendar.account.error.connect": "server not reachable",
	"calendar.account.error.no_calendar": "no calendar found",
	"calendar.account.error.no_secret": "sign-in missing",
	"calendar.mailbox": "The car's mailbox",
	"calendar.own": "This is where the appointments land",
	"flow.invite.1": "You create an appointment in **your calendar** – with a **place**.",
	"flow.invite.2": "You need the car? **Invite it:** {address}",
	"flow.invite.address": "the car's address",
	"flow.calendar.title": "How Joe reads a finished calendar",
	"flow.calendar.1": "The trips with the car are in **a calendar of its own**.",
	"flow.calendar.2": "You **assign the calendar** to the car here.",
	"flow.calendar.3": "**Joe reads** the appointments with a place.",
	"settings.routing": "Distances to appointments",
	"settings.routing.intro": "To charge by need I work out how far the places of your appointments are. For that I send an appointment's place and your home location from Home Assistant as the route's start to the service you pick here – never its title or description.",
	"settings.routing.service": "Service",
	"settings.routing.service.hint": "Once per place, then I remember the distance.",
	"settings.routing.none": "Don't work it out",
	"settings.routing.waze": "Waze (free)",
	"settings.routing.google": "Google: {name}",
	"settings.routing.osm": "OpenStreetMap (free)",
	"settings.routing.geocoder_url": "Place search",
	"settings.routing.geocoder_url.hint": "Photon service that turns a place into coordinates.",
	"settings.routing.router_url": "Route planner",
	"settings.routing.router_url.hint": "OSRM service for the route by car.",
	"need.unknown": "I don't know the car's charge level or range – I decide by the sun. Pick the sensors under Edit.",
	"need.unknown_capacity": "I know the charge level but not the battery size – I decide by the sun. Enter the usable battery size under Edit (or pick a sensor for it).",
	"need.too_far": "One full charge is not enough for tomorrow – plan a charging stop on the way.",
	"devices.action.reached_need": "Target reached ({target} {unit}) – done for today.",
	"devices.action.why.need_capacity": "I don't know the car's battery size – I decide by the sun.",
	"need.trips": "Tomorrow {km} km ({count} appointments) + {reserve} km reserve = {total} km.",
	"need.unknown_trips": "For {count} appointment(s) I don't know the distance yet – enter it below.",
	"need.usual": "Tomorrow about {km} km as usual + {reserve} km reserve = {total} km.",
	"need.reserve_only": "No trip known for tomorrow – the {reserve} km reserve stays.",
	"need.consumption.user": "Consumption {value} kWh/100 km at {temp} °C (your value).",
	"need.consumption.learned": "Consumption {value} kWh/100 km at {temp} °C (learned).",
	"need.consumption.car": "Consumption {value} kWh/100 km at {temp} °C (from the car).",
	"need.consumption.default": "Consumption {value} kWh/100 km at {temp} °C (a typical value until I have learned it).",
	"need.rain": "Rain costs a little more.",
	"need.has_soc": "The car has {soc} % (≈ {km} km), needs {target} %.",
	"need.has_range": "The car shows {km} km of range.",
	"need.charges": "{kwh} kWh missing – I charge them from {start}.",
	"need.missing": "{kwh} kWh missing.",
	"need.enough": "Enough – the car doesn't need to charge tonight.",
	"need.trips.title": "Appointments tomorrow",
	"need.all_day": "all day",
	"need.km_unknown": "distance unknown",
	"need.km.waze": "{km} km (Waze)",
	"need.km.google": "{km} km (Google)",
	"need.km.osm": "{km} km (OpenStreetMap)",
	"need.km.zone": "{km} km (straight line × 1.3)",
	"need.km.user": "{km} km (your value)",
	"need.km_edit": "Change the distance to {place}",
	"need.km_one_way": "One way in km",
	"need.km_reset": "Work it out again",
	"learn.car": "Cars",
	"learn.car.consumption": "{value} kWh/100 km",
	"learn.car.cold": "+{value} per degree below 15 °C",
	"learn.car.km": "usually {workday} km working day · {day_off} km day off",
	"learn.car.learning": "I learn from the odometer and charge level of the last weeks.",
	"learn.car.no_odometer": "With an odometer sensor I learn consumption and usual distance.",
	"learn.car.none": "Switch on “Charge by need” for a car's night action, then I learn how much it really needs.",
	"learn.reset.scope.car": "Cars",
	"learn.reset.forget.car": "Consumption and usual distance of your cars.",
	"devices.action.why.enough_range": "The car has enough for tomorrow – I won't charge it tonight.",
	"devices.action.why.sun_before_trip": "The first trip is only in the afternoon and enough sun comes – it charges the car first.",
	"devices.action.why.need_unknown": "I don't know the car's charge level – I decide by the sun.",
	"overview.sim.last": "Last night",
	"overview.sim.night": "Night to {day}",
	"overview.sim.saved": "Had I been in control, you would have saved {value}: {day} kWh less at the full price, {night} kWh more at the cheap night rate.",
	"overview.sim.cost": "My plan would have cost {value} more. I learn from it – the buffer adapts.",
	"overview.sim.same": "My plan would have made no difference – the batteries would have lasted anyway.",
	"overview.sim.total": "Since {since}: {value} over {nights}",
	"overview.sim.more": "What I learn",
	"overview.sim.provisional": "provisional, as of {time}",
	"history.eval": "Replayed: what my plan would have saved",
	"history.eval.saved": "saved",
	"history.eval.cost": "cost more",
	"history.eval.same": "no difference",
	"history.eval.day": "Bought at the full price",
	"history.eval.night": "Cheap at night",
	"history.eval.instead": "{with} kWh instead of {without} kWh",
	"history.eval.solar": "Sun",
	"history.eval.solar.value": "{actual} kWh, expected {expected} kWh",
	"history.eval.morning": "Needed until the sun",
	"history.eval.morning.value": "{actual} kWh, planned {expected} kWh",
	"history.eval.takeover": "Sun took over",
	"history.eval.takeover.value": "{actual}, expected {expected}",
	"history.eval.clock": "{time}",
	"history.eval.never": "not at all",
	"history.eval.chart.with": "with plan",
	"history.eval.chart.without": "without plan",
	"history.eval.pending": "Once the cheap hours are over, I replay this plan with the real day.",
	"history.eval.provisional": "provisional, as of {time}",
	"history.eval.provisional.note": "I play the hours from {time} on as I expect them. Once the day is over, the result is final.",
	"history.eval.incomplete": "Too many hours are missing for this night – I couldn't replay it.",
	"tip.sim_result.title": "How do I work this out?",
	"tip.sim_result.text": "In the morning I replay the night's plan with the real day: real sun, real consumption – once with the plan, once without. The difference is what steering would have saved, no matter how good the forecast was.\nUntil the day is over, the result is **provisional**: I play the remaining hours as I expect them.",
	"tip.sim_result.hint": "Calculated with your prices from the settings.",
	"tip.learn_solar.title": "What is the forecast factor?",
	"tip.learn_solar.text": "Every day I compare the previous evening's forecast with what your system delivered and take the middle value of the last four weeks. Outliers like a snow-covered roof hardly count that way. I convert every new forecast with it.",
	"tip.learn_shift.title": "What is the time offset?",
	"tip.learn_shift.text": "Some forecasts label their hours by the end instead of the start – then they're an hour off. Every day I check whether the curve fits better shifted by an hour, and only shift it once that's clearly the case on most days.",
	"tip.learn_buffer.title": "Why a buffer?",
	"tip.learn_buffer.text": "I charge a bit more than needed – for mornings when you use more or the sun comes later. How much I learn from the replayed nights: enough to have lasted on 8 out of 10 mornings. Too much buffer costs money, too little does too.",
	"tip.learn_buffer.hint": "You can set your own value under Settings → Rules.",
	"tip.learn_buffer_own.title": "What happens then?",
	"tip.learn_buffer_own.text": "I go back to my learned buffer and adjust it every morning. If I haven't learned one yet, I start with my starting value.",
	"tip.learn_home.title": "What am I looking at?",
	"tip.learn_home.text": "How much you use per hour on average – on working days and on days off. With it I work out how much the batteries need to deliver until the sun.",
	"tip.learn_accuracy.title": "What am I looking at?",
	"tip.learn_accuracy.text": "For every replayed night: how much **sun** I expected and how much came, how much the batteries should and did have to deliver **until the sun**, and what the plan would have **saved**.",
	"tip.learn_reset.title": "When to start over?",
	"tip.learn_reset.text": "When a lot has changed at your place – new panels, a different battery, a new car. Then I shouldn't learn from the old days any more.",
	"tip.ask_day.title": "What happens with my answer?",
	"tip.ask_day.text": "Guests, away or something else special: I leave that day out when learning, so it doesn't distort my picture of a normal day.\n**A normal day**: Then I learn from it – maybe you simply need more or less by now.",
	"tip.learn_model.title": "How do I use the weather?",
	"tip.learn_model.text": "I fit a simple calculation to your days: a base consumption, plus working day or day off and an extra for every degree below 15 °C (heating) or above 22 °C (cooling). With tomorrow's weather forecast I work out whether you'll need more or less than on a usual day.\nDays when something special happened are left out.",
	"tip.learn_model.hint": "The percentage says how well the calculation fits your days. Below 40 % I don't use it.",
	"tip.learn_weather.title": "Why by weather?",
	"tip.learn_weather.text": "Many forecasts are good on clear days and clearly off on overcast ones – or the other way round. So I keep a factor each for clear, mixed and overcast days and use the one that fits tomorrow's forecast. The limits move with the seasons.",
	"tip.learn_combine.title": "What does combining mean?",
	"tip.learn_combine.text": "I first correct each forecast with its own factor. Then each counts as much as it has been right so far: a source that is rarely off counts more than one that varies a lot.\n**Off**: I only use the main forecast.",
	"tip.learn_battery.title": "What do I measure on the battery?",
	"tip.learn_battery.text": "How much energy really fits in and how much is lost when charging and discharging. Older batteries often hold less than the label says. Both go into the plan – unless you entered the size yourself.",
	"tip.learn_groups.title": "Why a calculation per device?",
	"tip.learn_groups.text": "This shows me which device needs more when it's cold. When a device runs in the cheap window through a night action, I move exactly as much of its daytime use into the night as it will probably need tomorrow.",
	"tip.learn_hot_water.title": "What do I learn about hot water?",
	"tip.learn_hot_water.text": "How fast the tank heats, how much it loses standing and how many degrees you use a day. From that I work out the target temperature for the night and when heating must start to be done by the end of the cheap window.",
	"tip.learn_presence.title": "Why presence?",
	"tip.learn_presence.text": "From your calendars I read what's on tomorrow – office, home office, vacation. How many hours someone is at home on such days I learn from the person entity. Whoever is at home uses more; that goes into the calculation for tomorrow.",
	"tip.learn_calendar.title": "How do I read your calendars?",
	"tip.learn_calendar.text": "For each person I look into their calendars, all-day events first. The first matching keyword decides the kind of day. If an event fits several kinds, the upper row wins.\nUpper and lower case don't matter.",
	"tip.cal_defaults.title": "And without an event?",
	"tip.cal_defaults.text": "If there's no matching event, I take this kind – depending on whether the day is a working day or a day off.",
	"tip.learn_reset_scope.title": "Which area?",
	"tip.learn_reset_scope.text": "**Sun** after new panels or a different forecast, **Consumption** after moving or a new heating, **Batteries** after a replacement or an extension, **Hot water** after a new boiler. **Everything** when a lot has changed.",
	"tip.a_need.title": "What does by need mean?",
	"tip.a_need.text": "Instead of simply charging the whole cheap window when little sun comes, I work it out: kilometres tomorrow (appointments with a place there and back, or your usual distance, whichever is more) plus reserve, times consumption at the forecast temperature. If the car is missing something, I charge exactly that – and stop once the level is reached.\n**Off**: by the sun, as before.",
	"tip.a_need.hint": "“Tonight” by hand always charges the whole cheap window.",
	"tip.a_need_soc.title": "Why the charge level?",
	"tip.a_need_soc.text": "With charge level and battery size I know how much energy is in the car. The sensor comes from the car integration (e.g. Tesla, Kia, VW, BMW, Volvo) or evcc.",
	"tip.a_need_range.title": "Why the range?",
	"tip.a_need_range.text": "If I don't know the battery size, I use the range the car shows itself. I convert miles to kilometres.",
	"tip.a_need_capacity.title": "Which battery size?",
	"tip.a_need_capacity.text": "The usable size in kWh, not the gross one. Many car integrations have a sensor for it – otherwise enter the value from the data sheet.",
	"tip.a_need_reserve.title": "Why a reserve?",
	"tip.a_need_reserve.text": "Nobody wants to arrive with an empty battery. This many kilometres always remain – also for the unexpected. In the cold I count the reserve at the higher consumption.",
	"tip.a_need_consumption.title": "Where does the consumption come from?",
	"tip.a_need_consumption.text": "Best learned: from odometer and charge level I see how much your car really needs – also how much more in the cold. Until then I use the average the car shows itself, otherwise 18 kWh/100 km (a typical value from ADAC measurements). I add cold and rain.\nIf you enter a value, it applies in mild weather; I still add the cold.",
	"tip.a_need_daily.title": "Which usual distance?",
	"tip.a_need_daily.text": "What the car drives on a normal day – also without an appointment, e.g. to work. Empty, I learn it from the odometer, separately for working days and days off.",
	"tip.a_need_odometer.title": "Why the odometer?",
	"tip.a_need_odometer.text": "With it I learn the real consumption and the usual distance. Some integrations (e.g. Tesla) ship the sensor disabled – enable it in Home Assistant.",
	"tip.a_need_persons.title": "Whose appointments?",
	"tip.a_need_persons.text": "Appointments with a place from these people's calendars count as trips with this car. I leave out online meetings (Teams, Zoom and the like).",
	"tip.a_need_calendars.title": "How do I know which car drives?",
	"tip.a_need_calendars.text": "Every appointment with a place in this car's calendar is a trip with exactly this car – more precise than the persons' calendars. Here you choose how the appointments get to the car.",
	"tip.calendar_own.title": "Joe's calendar for this car",
	"tip.calendar_own.text": "A completely normal calendar in Home Assistant. Every invitation I accept in the car's mailbox goes in here; if an appointment changes or is cancelled, I change or remove it. You can add trips yourself too.",
	"tip.calendar_link.title": "What is the link?",
	"tip.calendar_link.text": "With it you subscribe to the calendar on your phone (iPhone: Settings → Calendar → Accounts → Add subscribed calendar; Google Calendar: Other calendars → From URL). The link holds a secret key – don't pass it on.",
	"tip.calendar_link.hint": "“New link” makes the old one invalid.",
	"tip.calendar_more.title": "Which calendar?",
	"tip.calendar_more.text": "A calendar that holds only this car's trips – for example a shared Google or iCloud calendar “Car”. Every appointment with a place in it counts as a trip with this car, so a family calendar does not fit.",
	"tip.calendar_connect.title": "How does my calendar get into Home Assistant?",
	"tip.calendar_connect.text": "**Google**: the Google Calendar integration.\n**iCloud, Infomaniak, Nextcloud**: the CalDAV integration (iCloud with an app password).\n**iCal link**: Remote Calendar – any calendar with a subscription link.\n**Microsoft 365 / Outlook**: via HACS the “Microsoft 365 Calendar” integration (Exchange Online and personal accounts).\nThe buttons open the setup in Home Assistant.",
	"tip.a_need_round_trip.title": "There and back?",
	"tip.a_need_round_trip.text": "Usually you drive to the appointment and back home – then I count the distance twice.",
	"tip.mail_provider.title": "What do I have to do at the provider?",
	"tip.mail_provider.text": "**web.de and GMX**: allow access under “POP3/IMAP” in the settings, then the normal password is enough.\n**Gmail**: myaccount.google.com → Security → turn on 2-step verification → App passwords.\n**T-Online**: create an email password in the customer center.\n**Other provider**: IMAP and SMTP are in its help pages.",
	"tip.mail_address.title": "Which address?",
	"tip.mail_address.text": "An address only for this car, e.g. kona123@gmx.net. Exactly this address is what you invite to appointments when you drive the car. I only read invitations and leave other mail alone.",
	"tip.mail_password.title": "Is that safe?",
	"tip.mail_password.text": "The password lives in a store of its own in Home Assistant, not in Joe's configuration and not in the diagnostics. You can revoke an app password at the provider at any time.",
	"tip.mail_servers.title": "Which servers?",
	"tip.mail_servers.text": "I know them for web.de, GMX, Gmail and T-Online. For other providers IMAP and SMTP are in their help – usually IMAP port 993 and SMTP port 587 (STARTTLS) or 465 (SSL).",
	"tip.mail_microsoft.title": "How do I create the app?",
	"tip.mail_microsoft.text": "Needed while Joe's own app is missing – or if your company does not allow it. Once in Microsoft Entra (entra.microsoft.com):\n1. App registrations → New registration, account type “Accounts in any organizational directory and personal Microsoft accounts”.\n2. Authentication → “Allow public client flows” to Yes.\n3. API permissions → Microsoft Graph → delegated: Calendars.ReadWrite, User.Read, offline_access.\n4. Enter the application ID here; for Microsoft 365 the tenant next to it (the company's domain or ID).",
	"tip.mail_sign_in.title": "How do I sign in?",
	"tip.mail_sign_in.text": "I show you a short code and a link. Open the link on any device, enter the code and sign in with the car's account. After that I renew the sign-in myself – Home Assistant does not have to be reachable from outside for that.",
	"tip.mail_allowed.title": "Why a list?",
	"tip.mail_allowed.text": "Otherwise anyone could send the car appointments. I only take invitations whose sender is listed here – an address or a whole domain like “@company.com”.",
	"tip.mail_allowed.hint": "Refused invitations are listed with the mailbox under “Last invitations” – allow the sender there with one click. Once saved, I read the mailbox again.",
	"tip.mail_accept.title": "What does accepting mean?",
	"tip.mail_accept.text": "I send an acceptance back, as a person would. Whoever invited then sees that the car is coming.",
	"tip.mail_status.title": "What do I see here?",
	"tip.mail_status.text": "**Test connection** logs in once to IMAP and SMTP. **Look now** checks for new invitations right away instead of waiting for the next minutes.",
	"tip.mail_recent.title": "What happened to the invitations?",
	"tip.mail_recent.text": "The last invitations and what I did with them: added, changed, cancelled – or why not.",
	"tip.calendar_account.title": "What do I need for it?",
	"tip.calendar_account.text": "**Google** and **Microsoft**: sign in with a short code – Joe never sees your password. While Joe's own app is missing, you need an app of your own at the provider for that (instructions in the i next to the field).\n**iCloud**: an app password from appleid.apple.com.\n**Infomaniak**: the account's password or a device password.\n**Other CalDAV server**: address, user name and password.",
	"tip.calendar_account_accept.title": "What does accepting mean?",
	"tip.calendar_account_accept.text": "I accept invitations in the account's calendar – but only from senders listed below under “Who may invite the car?”. Unanswered invitations from anyone else do not count as trips.",
	"tip.calendar_account_password.title": "Which password?",
	"tip.calendar_account_password.text": "**iCloud**: an app-specific password (appleid.apple.com → Sign-In and Security).\n**Infomaniak**: the account's password or a device password.\nIt stays with me in a store of its own, not in the configuration.",
	"tip.calendar_source.title": "Which way suits me?",
	"tip.calendar_source.text": "**Finished calendar**: the car already has a calendar of its own that holds only its trips (e.g. a shared calendar “Car”), and it is in Home Assistant. You assign it, Joe only reads.\n**Mailbox without calendar**: the car gets its own email address, e.g. at GMX. You invite it to your appointments; Joe fetches the invitation, accepts and puts the appointment into his own calendar for the car.\n**Mailbox with calendar**: like before, but the account has a calendar itself (Google, Microsoft, iCloud, Infomaniak). The invitation lands there by itself; Joe reads this calendar and accepts there.",
	"tip.calendar_source.hint": "The calendars of the persons you choose above always count too.",
	"tip.routing_service.title": "Which service?",
	"tip.routing_service.text": "**Waze**: free, no sign-up, through Home Assistant's own Waze action.\n**Google**: needs a set-up “Google Maps Travel Time” integration with an API key; switch off its polling every 10 minutes there, or the free calls are gone quickly.\n**OpenStreetMap**: free, open map; Photon finds the place and OSRM the route.\nI ask about each place only once and remember the distance. If an appointment is at a Home Assistant zone, I need no service.",
	"tip.routing_service.hint": "Only an appointment's place and your home location as the route's start are sent, never its title or description.",
	"tip.routing_osm.title": "What is this?",
	"tip.routing_osm.text": "The addresses of the free OpenStreetMap services. They are here so you can switch to your own or another server without waiting for an update.",
	"tip.need_trips.title": "Where do the kilometres come from?",
	"tip.need_trips.text": "From the places of your appointments tomorrow, worked out with the service from the settings. If a distance is wrong, enter the one-way distance – I remember it for this place.",
	"tip.learn_car.title": "What do I learn about the car?",
	"tip.learn_car.text": "From odometer and charge level: how much energy the car really needs per 100 km, how much more in the cold, and how far it drives on a usual working day and day off. From that I work out what it needs tomorrow.",
	"tip.chart_replay.title": "What am I looking at?",
	"tip.chart_replay.text": "How full the batteries would have been that day **with my plan** and how full **without**. Both replayed with the real sun and your real consumption.",
	"mode.advisory": "Suggest",
	"mode.advisory.sub": "Joe asks every evening",
	"mode.advisory.desc": "I ask you every evening whether I may steer the night. Without your yes I switch nothing.",
	"mode.untested": "Not tested yet: {names}. I only watch them until the test run on the Devices page has passed.",
	"mode.none_tested": "No battery has passed the test run yet – I would only watch. Do the test run on the Devices page first.",
	"settings.notify": "Notifications",
	"settings.notify.intro": "Problems always show up in Home Assistant's notifications. I only send to your phone what you switch on here.",
	"settings.notify.service": "Phone or service",
	"settings.notify.service.hint": "Where I write to, e.g. the Home Assistant app on your phone.",
	"settings.notify.none": "Nowhere",
	"settings.notify.gone": "{name} – no longer exists, please choose again",
	"settings.notify.ask": "Ask in the evening",
	"settings.notify.ask.hint": "In the suggest mode, with “Yes” and “Not tonight” right in the message.",
	"settings.notify.problems": "Report problems",
	"settings.notify.problems.hint": "When I cannot put values back or a battery does not respond.",
	"settings.notify.morning": "Report in the morning",
	"settings.notify.morning.hint": "What I steered during the night.",
	"settings.ask_time": "Ask at",
	"settings.ask_time.hint": "When I ask in the suggest mode.",
	"devices.page.title": "Your |devices",
	"devices.lead": "This is where I steer your batteries – with a test run and everything I am doing with them right now.",
	"devices.now": "Right now",
	"devices.status.simulation": "Simulation – I switch nothing and only note what I would do.",
	"devices.status.off": "Paused – I switch nothing.",
	"devices.status.steering": "I am steering right now.",
	"devices.status.waiting": "Tonight I steer from {time}.",
	"devices.status.unanswered": "I am waiting for your answer for tonight.",
	"devices.status.declined": "Not tonight – your decision.",
	"devices.status.skipped": "I skip tonight.",
	"devices.status.nothing": "Nothing to do tonight.",
	"devices.status.no_plan": "No plan for tonight yet.",
	"devices.status.day": "Grid-friendly: I hold back charging the batteries until {time} – the morning sun goes to the grid.",
	"devices.status.done": "The night is over, everything is back.",
	"devices.pending": "A few values are not back where they were yet. I keep trying.",
	"devices.power.charge": "charging at {value} kW",
	"devices.power.discharge": "discharging at {value} kW",
	"devices.power.idle": "idle",
	"devices.release": "Release now",
	"devices.batteries": "Batteries",
	"devices.batteries.none": "I don't know any battery yet. Add it in the settings.",
	"devices.battery.profile": "{name} – recognised",
	"devices.battery.generic": "Levers assigned",
	"devices.battery.steps": "Own steps",
	"devices.battery.watch": "Watch only",
	"devices.action.charge": "Charging to {target} %",
	"devices.action.hold": "Holding at {floor} %",
	"devices.action.block": "No discharge while another one charges",
	"devices.action.defer": "Charges only from {until} – the morning sun goes to the grid",
	"devices.action.free": "Free – I don't interfere",
	"devices.action.watch": "Watched only",
	"devices.action.idle": "Free – I don't interfere right now",
	"devices.problem.not_tested": "Test run missing – until then I only watch.",
	"devices.problem.not_controllable": "I cannot steer this battery.",
	"devices.problem.controls_missing": "Levers are missing or not reachable right now.",
	"devices.problem.soc_unknown": "I don't know the charge level right now.",
	"devices.problem.not_taken": "The battery does not take my values.",
	"devices.problem.unavailable": "A lever is not reachable.",
	"devices.problem.failed": "A value could not be written.",
	"devices.problem.timeout": "The device does not answer.",
	"devices.problem.missing": "A lever is missing in Home Assistant.",
	"devices.problem.option": "The mode does not know the option.",
	"devices.test.start": "Start test run",
	"devices.test.again": "Test again",
	"devices.test.ok": "Test run passed on {day}",
	"devices.test.failed": "Test run failed on {day}",
	"devices.test.none": "No test run yet",
	"devices.test.outdated": "Steering changed – please test again",
	"devices.test.running": "Test run in progress …",
	"devices.test.step.check": "Check",
	"devices.test.step.hold": "Hold",
	"devices.test.step.charge": "Charge",
	"devices.test.step.release": "Release",
	"devices.test.power": "{value} kW measured",
	"devices.test.no_power": "no power measured",
	"devices.test.wrong": "not taken: {entities}",
	"devices.test.error": "error: {entities}",
	"devices.test.problem.controls_missing": "Levers are missing: {missing}.",
	"devices.test.problem.soc_unknown": "I don't know the charge level right now – I don't test without it.",
	"devices.test.confirm.title": "Test run for |{name}",
	"devices.test.confirm.text": "I hold the battery for 20 seconds, then charge it from the grid with a small power for 25 seconds and put everything back afterwards. I read every value back. It takes about a minute and costs a few cents at most.",
	"devices.test.confirm.go": "Start test run",
	"devices.setup": "Set up levers",
	"devices.suggested": "I found levers that may fit. Check them under “Set up levers” and then do the test run.",
	"devices.log": "What I switched",
	"devices.log.empty": "Nothing yet – as soon as I steer or test, it shows up here.",
	"log.start": "Night begins",
	"log.set": "{battery}: {entity} → {value}",
	"log.reached": "{battery} reached {target} %",
	"log.external": "Someone else changed {entity} – I leave it",
	"log.released": "Everything put back",
	"log.release_failed": "Putting back did not fully work yet",
	"log.failed": "{battery}: {entity} could not be written",
	"log.emergency": "Released right away",
	"log.skip": "Skipped tonight",
	"log.unskip": "Steering after all",
	"log.answer.yes": "Your answer: yes",
	"log.answer.no": "Your answer: not tonight",
	"log.ask": "Asked whether I may steer",
	"log.test.ok": "Test run {battery}: passed",
	"log.test.failed": "Test run {battery}: failed",
	"f.battery.control.watch": "Watch only",
	"f.battery.control.profile": "Automatic ({name})",
	"f.battery.control.generic": "Assign levers",
	"f.battery.control.steps": "Own steps",
	"f.battery.control.suggested": "I found levers that may fit.",
	"f.battery.control.take": "Take suggestion",
	"f.battery.control.ready": "Charge via: {charge} · Hold via: {hold}",
	"f.battery.control.needs": "To steer, I need a way to charge (a mode with forced charging, or “Charge from grid” with “Charge up to”) and a way to hold (minimum level, a mode or a discharge limit).",
	"f.battery.control.retest": "After every change a new test run is needed on the Devices page.",
	"f.battery.control.services": "How I steer it (with services)",
	"f.battery.control.levers": "Levers",
	"f.battery.mode_options": "What do the options mean?",
	"f.battery.steps.charge": "To charge",
	"f.battery.steps.hold": "To hold",
	"f.battery.steps.release": "To release (empty: everything back)",
	"f.battery.steps.add": "Step",
	"f.battery.steps.value": "Value",
	"f.battery.steps.hint": "Instead of a number you can use {target} (target), {floor} (floor) and {power} (power in W).",
	"f.remove": "Remove",
	"role.min_soc": "Minimum level",
	"role.charge_target": "Charge up to",
	"role.grid_charge": "Charge from grid",
	"role.mode": "Mode",
	"role.charge_power": "Charging power",
	"role.discharge_power": "Discharging power",
	"role.discharge_limit": "Discharge limit",
	"role.discharge_limit_enabled": "Discharge limit active",
	"role.charge_limit": "Charge limit",
	"role.charge_limit_enabled": "Charge limit active",
	"method.mode": "forced charging",
	"method.target": "grid charging up to the target",
	"method.min_soc": "minimum level",
	"method.mode_hold": "hold mode",
	"method.standby": "forced charging with 0 W",
	"method.limit": "discharge limit",
	"meaning.normal": "Normal",
	"meaning.force_charge": "Forced charging",
	"meaning.hold": "Hold",
	"meaning.force_discharge": "Forced discharging",
	"meaning.none": "–",
	"pick.role.title": "{role} – which lever?",
	"pick.step.title": "Which device or script?",
	"plan.steer.live": "Live: I steer tonight.",
	"plan.steer.advisory": "May I steer tonight?",
	"plan.steer.yes": "Yes, go",
	"plan.steer.no": "Not tonight",
	"plan.steer.answered_yes": "You said yes – I steer tonight.",
	"plan.steer.answered_no": "Not tonight – your answer.",
	"plan.steer.skip": "Skip tonight",
	"plan.steer.unskip": "Steer after all",
	"plan.steer.skipped": "I skip tonight.",
	"plan.steer.untested": "Without a test run I only watch {names}.",
	"tip.devices_release.title": "What happens then?",
	"tip.devices_release.text": "I put back everything I set right away and stop steering for tonight. From the next night on things go on as usual.",
	"tip.devices_test.title": "Why a test run?",
	"tip.devices_test.text": "Before I really steer a battery, I check once that it does what I tell it: hold briefly, charge briefly, everything back – and I read every value back. Only then do I steer it in the suggest and live modes.",
	"tip.devices_test.hint": "After every change of the levers I test again.",
	"tip.devices_setup.title": "What do I set up there?",
	"tip.devices_setup.text": "Which levers of your battery I use to charge and hold. For known devices I know that myself, for others I suggest fitting ones.",
	"tip.control_choice.title": "How do I steer the battery?",
	"tip.control_choice.text": "**Watch only** – I switch nothing.\n**Automatic** – I know this device and which levers to use.\n**Assign levers** – you show me the levers (minimum level, mode, charge from grid …), I do the rest.\n**Own steps** – for devices that only work with scripts or special values.",
	"tip.control_roles.title": "Which levers do I need?",
	"tip.control_roles.text": "One way to **charge** and one to **hold**. Charging works with a mode that forces charging (with a charging power) or with “Charge from grid” plus “Charge up to”. Holding works with the minimum level, a mode or a discharge limit. Everything else is a bonus.",
	"tip.control_roles.hint": "Whatever I change, I put back at the end of every night.",
	"tip.mode_options.title": "Why this mapping?",
	"tip.mode_options.text": "Every device names its modes differently. Tell me which option is “normal” and which one “forced charging” – then I know what to choose and where to go back to.",
	"tip.control_steps.title": "How do steps work?",
	"tip.control_steps.text": "A list for each situation: a device and a value, or a script. When charging, the value can be {target} (the target in %) or {power} (power in W), when holding {floor}. Without release steps I simply put back everything I changed.",
	"tip.plan_steer.title": "What does that mean?",
	"tip.plan_steer.text": "In the simulation I switch nothing. In **Suggest** I only steer when you say yes for that night. In **Live** I steer every night – but only batteries whose test run passed. With **Skip tonight** I leave one night out.",
	"tip.notify_service.title": "Where do I write to?",
	"tip.notify_service.text": "To a notification service of Home Assistant, usually the app on your phone. Problems always show up in Home Assistant's notifications anyway.",
	"tip.notify_ask.title": "What do I ask?",
	"tip.notify_ask.text": "In the suggest mode I ask every evening whether I may steer the night – with the buttons “Yes” and “Not tonight” right in the message.",
	"tip.notify_problems.title": "Which problems?",
	"tip.notify_problems.text": "When I cannot put values back or a battery does not do what I tell it.",
	"tip.notify_morning.title": "What do I report?",
	"tip.notify_morning.text": "After a night I steered: how far I charged the batteries and that everything is back as it was.",
	"tip.ask_time.title": "When do I ask?",
	"tip.ask_time.text": "At this time I ask in the suggest mode whether I may steer the coming night. You can answer well into the night.",
	"action.label": "Night action",
	"action.title": "Night |action",
	"action.title.new": "New |night action",
	"action.template.ev": "Charge the car",
	"action.template.hot_water": "Pre-heat hot water",
	"action.template.custom": "Own action",
	"action.f.name": "Name",
	"action.f.kind": "Kind",
	"action.kind.switch": "Switch",
	"action.kind.target": "Up to a target",
	"action.f.entity": "What I switch",
	"action.f.on_value": "Value when on",
	"action.f.value": "Value",
	"action.value.on": "on",
	"action.value.off": "off",
	"action.f.reset": "Afterwards back to",
	"action.reset.previous": "as before",
	"action.reset.fixed": "a fixed value",
	"action.f.lead": "This much earlier",
	"action.f.auto": "Automatic",
	"action.f.below": "when tomorrow brings less sun than",
	"action.f.every_night": "every night",
	"action.f.conditions": "And only when",
	"action.f.op": "Comparison",
	"action.op.eq": "is",
	"action.op.ne": "is not",
	"action.op.lt": "less than",
	"action.op.le": "at most",
	"action.op.gt": "more than",
	"action.op.ge": "at least",
	"action.f.condition.add": "Condition",
	"action.f.power": "Power, roughly",
	"action.f.consumer": "Belongs to",
	"action.f.consumer.none": "no consumer",
	"action.f.priority": "Order at the grid limit",
	"action.f.enabled": "Active",
	"action.f.sensor": "Temperature sensor",
	"action.f.temps": "Temperatures",
	"action.f.comfort": "In the morning at least",
	"action.f.maximum": "At most",
	"action.f.buffer": "Buffer",
	"action.pick.entity": "What shall I switch?",
	"action.pick.sensor": "Which sensor measures the temperature?",
	"action.pick.condition": "What does it depend on?",
	"action.problem.entity": "Choose what I should switch.",
	"action.problem.sensor": "For a target I need the temperature sensor.",
	"action.delete": "Delete action",
	"devices.actions": "Night actions",
	"devices.action.off": "off",
	"devices.boost.unit": "Unit",
	"devices.charge.label": "Charge to",
	"devices.charge.now": "Charge now",
	"devices.charge.tonight": "Charge tonight",
	"devices.charge.percent": "{target} %",
	"devices.charge.km": "{target} km range plus {reserve} km reserve",
	"devices.charge.now_running": "Charging now to {amount} – {now} at the moment.",
	"devices.charge.tonight_set": "Charges tonight in the cheap hours to {amount}.",
	"devices.charge.tonight_window": "Charges tonight through all the cheap hours.",
	"devices.charge.no_night": "“Tonight” works once I have planned the night.",
	"automations.title": "Automations on your batteries",
	"automations.lead": "These automations set something on your batteries – partly the same controls I steer. While they run they can overwrite my steering. Best switch them off so that I can work properly.",
	"automations.lead_off": "These automations set something on your batteries. They are off – so we do not get in each other's way.",
	"automations.on": "on",
	"automations.off": "off",
	"automations.writes": "writes: {what} ({batteries})",
	"automations.switched_off": "Switched off by me on {day} at {time} – so that it does not overwrite my battery steering.",
	"automations.all_off": "Switch all off ({count})",
	"automations.back_on": "Switch on again ({count})",
	"automations.failed": "Not all of them could be switched – check Home Assistant's automations.",
	"cards.loading": "Looking it up …",
	"cards.no_access": "Energy Joe cannot be reached – the card needs a user with administrator rights.",
	"cards.night.title": "Joe tonight",
	"cards.night.skip": "Skip tonight",
	"cards.car.none": "No car I can charge yet – set it up in the Energy Joe panel under “Devices”.",
	"cards.car.charging": "charging",
	"devices.charge.failed": "That did not work – try again.",
	"automations.lead_idle": "These automations set something on your batteries. While I only watch they do no harm – switch them off before you set me to “Suggest” or “Live”.",
	"automations.levers": "my controls too",
	"automations.not_battery": "No longer sets anything on batteries I know.",
	"tip.calendar_legacy.title": "Where does this calendar come from?",
	"tip.calendar_legacy.text": "Up to version 0.3 every car had a calendar from me. It still holds trips you entered by hand – they still count. New trips belong in the calendar you assign above; once no old trip is left, this calendar goes away.",
	"devices.action.reached_plain": "Target reached – done for today.",
	"devices.charge.tonight_done": "Charged to {amount} tonight – done.",
	"calendar.account.oauth.no_client_secret": "I still need your Google app's client secret – enter it above and press “Save”.",
	"calendar.account.result.no_client_secret": "I still need your Google app's client secret.",
	"tip.battery_automations.title": "Why switch them off?",
	"tip.battery_automations.text": "I steer the batteries through mode, power and limits. If an automation sets the same values, whoever writes last wins – and the battery no longer follows my plan. Listed here are all automations whose actions set something on your batteries (also through scripts); those that only read them are left out. “My controls too” means: exactly the values I set myself.\n“Switch all off” turns them off in Home Assistant and writes into each automation's logbook when and why. “Switch on again” turns on exactly the ones I switched off – if you remove Energy Joe, I do that myself.",
	"tip.battery_automations.hint": "Rather keep one? Give it the condition: Energy Joe status is neither “Steering” nor “Holding back charging” – then it stays out of the way while I work on the batteries.",
	"devices.boost.stop": "Cancel",
	"devices.boost.reserve": "Your reserve of {reserve} km comes on top.",
	"devices.action.boost": "Charging now because you asked.",
	"devices.action.tonight": "Tonight",
	"devices.action.edit": "Edit",
	"devices.action.disabled": "Switched off – I leave it alone.",
	"devices.action.running": "Running – until {end}.",
	"devices.action.heating": "Heating to {target} °C – until {end} at the latest.",
	"devices.action.reached": "Target reached ({target} °C) – done for today.",
	"devices.action.no_plan": "No plan for tonight yet.",
	"devices.action.would": "Would: ",
	"devices.action.plan_run": "Tonight from {start} to {end}.",
	"devices.action.plan_target": "Tonight from {start}, up to {target} °C.",
	"devices.action.why.enough_sun": "Not tonight: tomorrow brings about {kwh} kWh of sun.",
	"devices.action.why.conditions": "Not tonight: a condition is not met right now.",
	"devices.action.why.manual_only": "Only when you switch on “Tonight”.",
	"devices.action.why.warm_enough": "Not tonight: the water is warm enough ({temperature} °C).",
	"devices.action.why.no_temperature": "I cannot read the temperature sensor right now.",
	"devices.action.why.tonight": "Runs tonight – you switched it on.",
	"devices.action.why.little_sun": "Runs tonight – too little sun tomorrow.",
	"devices.action.why.every_night": "Runs every night.",
	"devices.action.add": "Add a night action",
	"devices.action.add.text": "What should run when tomorrow's sun is not enough?",
	"plan.actions": "Night actions",
	"plan.actions.run": "runs from {start} to {end}",
	"plan.actions.target": "heats from {start} to {target} °C, until {end} at the latest",
	"plan.actions.energy": "≈ {kwh} kWh, {cost} at the cheap night rate",
	"log.boost": "{battery}: just charge to {target} {unit}",
	"log.boost_end.reached": "{battery}: just charge – target reached",
	"log.boost_end.stopped": "{battery}: just charge stopped",
	"log.boost_end.expired": "{battery}: just charge ended after 24 hours",
	"log.action_on": "{battery}: switched on ({value})",
	"log.action_off": "{battery}: put back ({value})",
	"log.action_done": "{battery}: target reached",
	"log.call": "{battery}: {entity}",
	"log.tonight": "“Tonight” switched",
	"log.grid_guard": "Main fuse: {power} kW from the grid – charging paused briefly",
	"log.no_progress": "{battery} does not charge (at {soc} %)",
	"tip.a_name.title": "What is it called?",
	"tip.a_name.text": "That's how it shows on the Devices page, in the plan and as a switch in Home Assistant.",
	"tip.a_kind.title": "Which kind?",
	"tip.a_kind.text": "**Switch** – I set a value for the whole cheap window and put it back at the end (e.g. the evcc mode to “now”).\n**Up to a target** – I switch on as late as possible and off as soon as a sensor reaches the target (e.g. hot water).",
	"tip.a_entity.title": "What do I switch?",
	"tip.a_entity.text": "A switch, a select, a number or a script in Home Assistant – for example your wallbox's charge mode or the boost switch of the hot water heat pump.",
	"tip.a_on_value.title": "Which value?",
	"tip.a_on_value.text": "What I set when switching on, for example “now” for the evcc charge mode or “on” for a switch.",
	"tip.a_reset.title": "How do I put it back?",
	"tip.a_reset.text": "**As before** – I note the value before switching on and set it again. **A fixed value** – always the same, for example “off”. If you changed it yourself in between, I leave it.",
	"tip.a_lead.title": "Why earlier?",
	"tip.a_lead.text": "Some devices take a while to switch – evcc up to three minutes, for example. Then I put it back that much earlier so nothing runs expensively after the cheap window.",
	"tip.a_auto.title": "When does it run by itself?",
	"tip.a_auto.text": "When tomorrow brings less sun than set here – with the factor I learned for your forecast. Empty means every night. Switched off, it only runs when you switch on “Tonight”.",
	"tip.a_conditions.title": "Why conditions?",
	"tip.a_conditions.text": "The action only runs when all are met – for example “car connected is on” or “car level less than 70”.",
	"tip.a_power.title": "Why the power?",
	"tip.a_power.text": "So I know how much of the grid connection it needs. The batteries get the rest – everything stays below your grid limit.",
	"tip.a_consumer.title": "Why this link?",
	"tip.a_consumer.text": "If I know the consumer from the Energy dashboard, I know how much it usually needs during the day. When it runs at night, I take that out of the day – the batteries need less then.",
	"tip.a_priority.title": "What does the order mean?",
	"tip.a_priority.text": "If the grid connection is not enough for everything, the smaller number goes first. The batteries take what's left.",
	"tip.a_enabled.title": "What does active mean?",
	"tip.a_enabled.text": "Switched off, I neither plan nor switch this action – not even by hand.",
	"tip.a_sensor.title": "Which sensor?",
	"tip.a_sensor.text": "The sensor whose temperature I watch, for example the hot water temperature. Once the target is reached, I switch off.",
	"tip.a_temps.title": "How do I work out the target?",
	"tip.a_temps.text": "In the morning the water should be at least this warm. On top I add what you use during the day (I am still learning that) and the buffer. I never heat above “At most”. I start late enough that the target is there by the end of the cheap window.",
	"tip.a_save.title": "What happens when saving?",
	"tip.a_save.text": "I include the action in my plans from now on. I only switch in the suggest and live modes – in the simulation I show what I would have done.",
	"tip.a_delete.title": "What happens when deleting?",
	"tip.a_delete.text": "The action and its switch in Home Assistant disappear. If it is running, I put things back first.",
	"tip.boost.title": "Now or tonight?",
	"tip.boost.text": "**Charge now**: I switch the wallbox on right away – without waiting for the cheap hours or the sun, and also in the simulation, because you ask for it.\n**Charge tonight**: I charge in the coming night in the cheap hours, whatever the forecast says.\nAs soon as the level is reached (or the range plus your reserve) I put the wallbox back the way it was. With % and km you choose whether the target is a level or a range.",
	"tip.boost.hint": "“Charge now” stops by itself after 24 hours at the latest, “tonight” with the end of the night. “Cancel” stops right away.",
	"tip.action_tonight.title": "What does “Tonight” do?",
	"tip.action_tonight.text": "The action runs in the coming night, whatever the forecast says – handy when you know you'll leave early tomorrow. After the night the switch turns itself off again.",
	"tip.devices_actions.title": "What are night actions?",
	"tip.devices_actions.text": "Everything besides the batteries that should run in the cheap window when tomorrow's sun is not enough – the car, the hot water, a pool. At the end of the night I put everything back.",
	"tip.plan_actions.title": "What am I looking at?",
	"tip.plan_actions.text": "Which night actions would run tonight, when – and why the others don't.",
	"error.title": "Joe isn't |answering",
	"error.text": "I can't reach the integration. Reload the page – if that doesn't help, check Settings → System → Logs.",
	"error.action": "Saving failed",
	loading: "Joe is saddling up …"
}, Pe = /* @__PURE__ */ new Map();
function Fe(e, t) {
	return e.replace(/\{(\w+)\}/g, (e, n) => String(t?.[n] ?? ""));
}
function Ie(e) {
	let t = e || "en", n = Pe.get(t);
	if (n) return n;
	let r = t.startsWith("de") ? Me : Ne, i = ((e, t) => Fe(r[e], t));
	return i.optional = (e, t) => e in r ? Fe(r[e], t) : void 0, Object.defineProperty(i, "lang", { value: t }), Pe.set(t, i), i;
}
function Le(e) {
	return e.split("|");
}
//#endregion
//#region src/define.ts
var Re = "0.7.0";
function H(e, t) {
	let n = customElements.get(e);
	if (!n) {
		t.joeVersion = Re, customElements.define(e, t);
		return;
	}
	n.joeVersion !== "0.7.0" && Be();
}
var ze = !1;
function Be() {
	if (ze || typeof document > "u") return;
	ze = !0;
	let e = (document.documentElement.lang || navigator.language || "").toLowerCase().startsWith("de"), t = document.createElement("div");
	t.setAttribute("role", "alert"), t.style.cssText = [
		"position:fixed",
		"left:50%",
		"bottom:24px",
		"transform:translateX(-50%)",
		"z-index:2147483647",
		"display:flex",
		"flex-wrap:wrap",
		"align-items:center",
		"gap:10px 14px",
		"max-width:min(560px, calc(100vw - 32px))",
		"padding:14px 16px",
		"border-radius:14px",
		"background:#071118",
		"color:#fff",
		"box-shadow:0 10px 30px rgba(0,0,0,.35)",
		"font:500 15px/1.4 system-ui, sans-serif"
	].join(";");
	let n = document.createElement("span");
	n.style.cssText = "flex:1 1 240px", n.textContent = e ? "Energy Joe wurde aktualisiert. Lade die Seite neu, damit du die neue Version siehst." : "Energy Joe was updated. Reload the page to see the new version.";
	let r = document.createElement("button");
	r.type = "button", r.textContent = e ? "Neu laden" : "Reload", r.style.cssText = "min-height:44px;padding:0 18px;border:0;border-radius:10px;background:#fea707;color:#071118;font:700 15px system-ui, sans-serif;cursor:pointer", r.addEventListener("click", () => location.reload()), t.append(n, r);
	let i = () => document.body?.append(t);
	document.body ? i() : addEventListener("DOMContentLoaded", i, { once: !0 });
}
//#endregion
//#region src/styles/shared.ts
var Ve = o`
  :host {
    font-family: var(--joe-ui);
  }
  * {
    box-sizing: border-box;
  }
  button {
    font: inherit;
    color: inherit;
  }
  :focus-visible {
    outline: 3px solid var(--joe-amber);
    outline-offset: 2px;
    border-radius: 4px;
  }
  ha-icon {
    --mdc-icon-size: 18px;
    flex: none;
  }

  .eyebrow {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--joe-muted);
  }
  .display {
    font-family: var(--joe-display);
    font-style: italic;
    font-weight: 800;
    text-transform: uppercase;
    line-height: 0.92;
    letter-spacing: 0.005em;
    margin: 0;
    text-wrap: balance;
  }
  .display .hl {
    color: var(--joe-amber);
  }
  .display .title-tip {
    display: inline-flex;
    margin-left: 10px;
    vertical-align: 0.12em;
    text-transform: none;
    font-style: normal;
  }
  .swoosh {
    display: block;
    height: 12px;
    width: min(220px, 62%);
    color: var(--joe-amber);
    margin-top: 6px;
  }
  .lead {
    font-size: 17px;
    line-height: 1.5;
    color: var(--joe-ink-2);
    margin: 12px 0 0;
    max-width: 58ch;
  }
  .num {
    font-variant-numeric: tabular-nums;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 40px;
    padding: 8px 18px;
    border-radius: 9px;
    border: 0;
    cursor: pointer;
    font-weight: 600;
    font-size: 15px;
    transition: background 0.12s, color 0.12s, transform 0.12s, box-shadow 0.12s;
  }
  .btn:active {
    transform: scale(0.98);
  }
  .btn[disabled] {
    cursor: not-allowed;
    opacity: 0.45;
    transform: none;
  }
  .btn-primary {
    position: relative;
    isolation: isolate;
    background: transparent;
    color: var(--joe-amber-ink);
    font-family: var(--joe-display);
    font-style: italic;
    font-weight: 800;
    text-transform: uppercase;
    font-size: 18px;
    letter-spacing: 0.02em;
    padding: 8px 24px;
  }
  .btn-primary::before {
    content: "";
    position: absolute;
    inset: 0;
    background: var(--joe-amber);
    transform: skewX(-10deg);
    border-radius: 7px;
    z-index: -1;
    box-shadow: inset 0 -3px 0 rgba(7, 17, 24, 0.18);
    transition: background 0.12s, box-shadow 0.12s;
  }
  .btn-primary:not([disabled]):hover::before {
    background: var(--joe-amber-hover);
  }
  .btn-primary:not([disabled]):active::before {
    background: var(--joe-amber-press);
    box-shadow: inset 0 2px 0 rgba(7, 17, 24, 0.22);
  }
  .btn-secondary {
    background: var(--joe-surface);
    color: var(--joe-ink);
    box-shadow: inset 0 0 0 2px var(--joe-ink);
  }
  .btn-secondary:not([disabled]):hover {
    background: var(--joe-surface-2);
  }
  .btn-secondary:not([disabled]):active {
    background: var(--joe-line);
  }
  .btn-ghost {
    background: transparent;
    color: var(--joe-ink-2);
  }
  /* Something that cannot be undone: away from the main path, red text and ring. */
  .btn-danger {
    background: var(--joe-surface);
    color: var(--joe-crit);
    box-shadow: inset 0 0 0 2px var(--joe-crit);
  }
  .btn-danger:not([disabled]):hover {
    background: var(--joe-crit-soft);
  }
  .btn-danger:not([disabled]):active {
    background: var(--joe-crit-soft);
    box-shadow: inset 0 0 0 3px var(--joe-crit);
  }
  .btn-ghost:not([disabled]):hover {
    background: var(--joe-surface-2);
    color: var(--joe-ink);
  }
  .btn-ghost:not([disabled]):active {
    background: var(--joe-line);
  }
  @media (pointer: coarse) {
    .btn {
      min-height: 44px;
    }
  }

  .chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 10px 3px 8px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    line-height: 1.3;
    background: var(--joe-surface-2);
    color: var(--joe-ink-2);
    white-space: nowrap;
  }
  .chip ha-icon {
    --mdc-icon-size: 14px;
  }
  .chip.read {
    background: var(--joe-info-soft);
    color: var(--joe-info);
  }
  .chip.learned {
    background: var(--joe-amber-soft);
    color: var(--joe-amber-text);
  }
  .chip.user {
    background: var(--joe-leather-soft);
    color: var(--joe-leather);
  }
  .chip.ok {
    background: var(--joe-good-soft);
    color: var(--joe-good);
  }
  .chip.warn {
    background: var(--joe-warn-soft);
    color: var(--joe-warn);
  }
  .chip.soon {
    background: transparent;
    box-shadow: inset 0 0 0 1.5px var(--joe-line-2);
    color: var(--joe-muted);
  }
  .pill-sim {
    display: inline-flex;
    align-items: center;
    padding: 5px 12px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 700;
    background: repeating-linear-gradient(-45deg, var(--joe-stripe-a) 0 8px, var(--joe-stripe-b) 8px 16px);
    color: #071118;
    white-space: nowrap;
  }

  .card {
    position: relative;
    min-width: 0;
    background: var(--joe-surface);
    border-radius: 14px;
    box-shadow: inset 0 0 0 1px var(--joe-line);
    padding: 18px;
  }
  .calm {
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 12px 14px;
    border-radius: 12px;
    background: var(--joe-surface);
    box-shadow: inset 0 0 0 1px var(--joe-line);
    margin-top: 18px;
    max-width: 58ch;
  }
  .actions {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 22px;
  }
  .with-tip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  /* Back and next at the top of a setup step (components/step-nav.ts) */
  .step-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin: 12px auto 0;
  }
  .step-nav .btn ha-icon {
    --mdc-icon-size: 20px;
  }
  .step-nav .btn-ghost {
    padding-inline: 8px 14px;
  }

  /* How sure Joe is */
  .conf {
    display: inline-flex;
    gap: 3px;
  }
  .conf i {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--joe-line-2);
  }
  .conf i.on {
    background: var(--joe-amber);
  }

  /* Small row actions ("Ändern", "Ignorieren") */
  .mini-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 0;
    cursor: pointer;
    min-height: 34px;
    padding: 6px 12px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 13.5px;
    background: var(--joe-surface-2);
    color: var(--joe-ink);
    transition: background 0.12s, transform 0.12s;
  }
  .mini-btn:hover:not([disabled]) {
    background: var(--joe-line);
  }
  .mini-btn:active:not([disabled]) {
    transform: scale(0.97);
  }
  .mini-btn[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
  .mini-btn.go {
    background: var(--joe-amber);
    color: var(--joe-amber-ink);
  }
  .mini-btn.go:hover:not([disabled]) {
    background: var(--joe-amber-hover);
  }
  .mini-btn.quiet {
    background: transparent;
    color: var(--joe-ink-2);
  }
  .mini-btn.quiet:hover:not([disabled]) {
    background: var(--joe-surface-2);
    color: var(--joe-ink);
  }
  .mini-btn ha-icon {
    --mdc-icon-size: 16px;
  }
  @media (pointer: coarse) {
    .mini-btn {
      min-height: 44px;
    }
  }

  /* Inputs: filled, no frame, amber focus */
  .input {
    width: 100%;
    min-height: 42px;
    padding: 8px 12px;
    border: 0;
    border-radius: 9px;
    background: var(--joe-surface-2);
    color: var(--joe-ink);
    font: inherit;
    font-variant-numeric: tabular-nums;
    box-shadow: inset 0 1px 2px rgba(7, 17, 24, 0.08);
  }
  .input:focus {
    outline: 3px solid var(--joe-amber);
    outline-offset: 1px;
  }
  .input::placeholder {
    color: var(--joe-muted);
  }
  .unit-input {
    position: relative;
    display: inline-flex;
    align-items: center;
    width: 100%;
    max-width: 200px;
  }
  .unit-input .input {
    padding-right: 64px;
  }
  .unit-input .unit {
    position: absolute;
    right: 12px;
    color: var(--joe-muted);
    font-size: 14px;
    pointer-events: none;
  }
  select.input {
    cursor: pointer;
  }

  /* Labeled fields in forms */
  .field {
    display: grid;
    gap: 6px;
    margin-top: 16px;
  }
  .field-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
  }
  .field-hint {
    color: var(--joe-muted);
    font-size: 13px;
    margin: -2px 0 0;
  }
  .field-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }

  /* Notes from Joe */
  .note {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    padding: 10px 12px;
    border-radius: 10px;
    font-size: 14px;
    background: var(--joe-info-soft);
    color: var(--joe-ink);
  }
  .note > ha-icon {
    color: var(--joe-info);
    margin-top: 1px;
  }
  .note.warn {
    background: var(--joe-warn-soft);
  }
  .note.warn > ha-icon {
    color: var(--joe-warn);
  }
  .note .note-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 8px;
  }

  /* On/off switch */
  .switch {
    position: relative;
    width: 46px;
    height: 28px;
    flex: none;
    border: 0;
    border-radius: 999px;
    cursor: pointer;
    background: var(--joe-line-2);
    transition: background 0.12s;
  }
  .switch::after {
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--joe-surface);
    box-shadow: 0 1px 3px rgba(7, 17, 24, 0.3);
    transition: transform 0.12s;
  }
  .switch[aria-checked="true"] {
    background: var(--joe-amber);
  }
  .switch[aria-checked="true"]::after {
    transform: translateX(18px);
  }
  .switch[disabled] {
    cursor: not-allowed;
    opacity: 0.45;
  }

  .sheet-title {
    padding-right: 40px;
  }
  .sheet-title .display {
    font-size: clamp(28px, 6vw, 36px);
  }
  /* Segmented choice (one of a few) */
  .seg {
    display: inline-flex;
    background: var(--joe-surface-2);
    border-radius: 999px;
    padding: 3px;
    gap: 2px;
  }
  .seg button {
    border: 0;
    background: transparent;
    padding: 6px 14px;
    min-height: 36px;
    border-radius: 999px;
    font-weight: 600;
    font-size: 14px;
    color: var(--joe-ink-2);
    cursor: pointer;
    transition: background 0.12s, color 0.12s;
  }
  .seg button:hover:not([disabled]) {
    background: var(--joe-surface);
    color: var(--joe-ink);
  }
  .seg button:active:not([disabled]) {
    transform: scale(0.97);
  }
  .seg button[aria-pressed="true"] {
    background: var(--joe-ink);
    color: var(--joe-bg);
  }
  .seg button[disabled] {
    cursor: not-allowed;
    opacity: 0.45;
  }
  @media (pointer: coarse) {
    .seg button {
      min-height: 44px;
    }
  }
  .group-label {
    margin: 18px 0 8px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--joe-muted);
  }
`;
//#endregion
//#region \0@oxc-project+runtime@0.152.0/helpers/esm/decorate.js
function U(e, t, n, r) {
	var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, n) : r, o;
	if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(e, t, n, r);
	else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
	return i > 3 && a && Object.defineProperty(t, n, a), a;
}
//#endregion
//#region src/entities.ts
var He = [
	"W",
	"kW",
	"MW"
], Ue = [
	"Wh",
	"kWh",
	"MWh"
], We = {
	power: (e) => W(e) === "sensor" && He.includes(G(e)),
	soc: (e) => W(e) === "sensor" && G(e) === "%",
	energy: (e) => W(e) === "sensor" && Ue.includes(G(e)),
	price: (e) => [
		"sensor",
		"number",
		"input_number"
	].includes(W(e)) && (e.attributes.device_class === "monetary" || /\/\s*kwh/i.test(G(e))),
	weather: (e) => W(e) === "weather",
	workday: (e) => W(e) === "binary_sensor",
	calendar: (e) => W(e) === "calendar",
	person: (e) => W(e) === "person",
	level: (e) => ["number", "input_number"].includes(W(e)) && G(e) === "%",
	temperature: (e) => [
		"sensor",
		"number",
		"input_number"
	].includes(W(e)) && ["°C", "°F"].includes(G(e)),
	setpoint: (e) => ["number", "input_number"].includes(W(e)),
	toggle: (e) => ["switch", "input_boolean"].includes(W(e)),
	option: (e) => ["select", "input_select"].includes(W(e)),
	writable: (e) => [
		"number",
		"input_number",
		"switch",
		"input_boolean",
		"select",
		"input_select",
		"script",
		"button",
		"input_button"
	].includes(W(e)),
	distance: (e) => W(e) === "sensor" && [
		"km",
		"mi",
		"m"
	].includes(G(e)),
	consumption: (e) => W(e) === "sensor" && /kwh\/100|wh\/km|km\/kwh|mi\/kwh/i.test(G(e).replace(/\s/g, "")),
	car_energy: (e) => [
		"sensor",
		"number",
		"input_number"
	].includes(W(e)) && [
		...Ue,
		"kJ",
		"MJ"
	].includes(G(e)),
	any: () => !0
};
function W(e) {
	return e.entity_id.split(".", 1)[0];
}
function G(e) {
	return String(e.attributes.unit_of_measurement ?? "");
}
function Ge(e, t) {
	return We[t](e);
}
function Ke(e, t) {
	let n = e.states[t]?.attributes.friendly_name;
	return typeof n == "string" && n ? n : t.split(".", 2)[1]?.replace(/_/g, " ") ?? t;
}
function qe(e, t) {
	let n = e.entities?.[t], r = n?.device_id ? e.devices?.[n.device_id] : void 0, i = n?.area_id ?? r?.area_id, a = i ? e.areas?.[i]?.name : void 0, o = r?.name_by_user || r?.name || void 0;
	return [o && Ke(e, t).toLowerCase().startsWith(o.toLowerCase()) ? void 0 : o, a].filter(Boolean).join(" · ");
}
function K(e, t) {
	if (!t) return null;
	let n = Number.parseFloat(e.states[t]?.state ?? "");
	return Number.isFinite(n) ? n : null;
}
function q(e, t, n) {
	return new Intl.NumberFormat(e, { maximumFractionDigits: n }).format(t);
}
function Je(e, t, n) {
	let r = e.states[t];
	if (!r) return "–";
	if (e.formatEntityState) return e.formatEntityState(r);
	let i = K(e, t);
	return i === null ? r.state : `${q(n, i, Math.abs(i) >= 100 ? 0 : Math.abs(i) >= 10 ? 1 : 2)} ${G(r)}`.trim();
}
function Ye(e, t) {
	return t === "W" ? e / 1e3 : t === "MW" ? e * 1e3 : e;
}
function Xe(e, t) {
	if (!t) return null;
	let n = K(e, t.entity_id);
	if (n === null) return null;
	let r = Ye(n, G(e.states[t.entity_id]));
	if (t.invert && (r = -r), t.minus_entity_id) {
		let n = K(e, t.minus_entity_id);
		if (n === null) return null;
		r -= Ye(n, G(e.states[t.minus_entity_id]));
	}
	return r;
}
function Ze(e, t) {
	let n = K(e, t);
	if (n === null || !t) return null;
	let r = G(e.states[t]);
	return r === "Wh" ? n / 1e3 : r === "MWh" ? n * 1e3 : n;
}
function Qe(e, t) {
	let n = t.map((t) => Xe(e, t)).filter((e) => e !== null);
	return n.length ? n.reduce((e, t) => e + t, 0) : null;
}
//#endregion
//#region src/components/tip.ts
var $e = 120, et = 220, J = 8, tt = 10, Y, X = class extends R {
	constructor(...e) {
		super(...e), this.label = "", this.open = !1, this.pinned = !1, this.keepOnBlur = !1, this.onOutside = (e) => {
			e.composedPath().includes(this) || this.close();
		}, this.onKey = (e) => {
			e.key === "Escape" && (e.stopPropagation(), e.preventDefault(), this.close());
		}, this.follow = () => {
			this.open && (this.place(), this.frame = requestAnimationFrame(this.follow));
		};
	}
	static {
		this.styles = o`
    :host {
      display: inline-flex;
      vertical-align: middle;
      flex: none;
    }
    button {
      position: relative;
      display: grid;
      place-items: center;
      width: 28px;
      height: 28px;
      padding: 0;
      border: 0;
      border-radius: 50%;
      cursor: pointer;
      background: var(--joe-surface-2);
      color: var(--joe-ink-2);
      transition: background 0.12s, color 0.12s, transform 0.12s;
    }
    button::after {
      content: "";
      position: absolute;
      inset: -4px;
      border-radius: 50%;
    }
    button:hover {
      background: var(--joe-line);
      color: var(--joe-ink);
    }
    button:active {
      transform: scale(0.94);
    }
    button.open,
    button.open:hover {
      background: var(--joe-amber);
      color: var(--joe-amber-ink);
    }
    button:focus-visible {
      outline: 3px solid var(--joe-amber);
      outline-offset: 2px;
    }
    svg {
      width: 16px;
      height: 16px;
      transform: skewX(-8deg);
    }
    @media (pointer: coarse) {
      button::after {
        inset: -8px;
      }
    }
    .bubble {
      display: none;
      position: fixed;
      inset: auto;
      left: 0;
      top: 0;
      z-index: 1000;
      margin: 0;
      border: 0;
      overflow: visible;
      box-sizing: border-box;
      width: max-content;
      max-width: min(320px, calc(100vw - 16px));
      padding: 12px 14px;
      border-radius: 12px;
      background: var(--joe-tip-bg);
      color: var(--joe-tip-ink);
      font-family: var(--joe-ui);
      font-size: 13.5px;
      font-weight: 400;
      line-height: 1.45;
      text-align: left;
      text-transform: none;
      letter-spacing: normal;
      white-space: normal;
      box-shadow: 0 14px 32px -12px rgba(7, 17, 24, 0.55);
    }
    .bubble.open {
      display: block;
      animation: tip-in 0.12s ease-out;
    }
    @keyframes tip-in {
      from {
        opacity: 0;
        translate: 0 4px;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .bubble.open {
        animation: none;
      }
    }
    .h {
      display: block;
      font-weight: 700;
      font-size: 14px;
      line-height: 1.35;
      margin-bottom: 4px;
      color: var(--joe-tip-accent);
    }
    p {
      margin: 0;
    }
    p + p {
      margin-top: 6px;
    }
    strong {
      font-weight: 700;
    }
    dl {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 3px 10px;
      margin: 9px 0 0;
      padding-top: 8px;
      border-top: 1px solid var(--joe-tip-line);
    }
    dt {
      color: var(--joe-tip-accent);
      font-weight: 700;
    }
    dd {
      margin: 0;
    }
    .arrow {
      position: absolute;
      left: calc(var(--arrow, 50%) - 6px);
      width: 12px;
      height: 12px;
      background: inherit;
      border-radius: 2px;
      transform: rotate(45deg);
    }
    .bubble[data-place="top"] .arrow {
      bottom: -5px;
    }
    .bubble[data-place="bottom"] .arrow {
      top: -5px;
    }
  `;
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.close();
	}
	render() {
		let e = this.tip;
		return e ? k`<button
        type="button"
        class=${this.open ? "open" : ""}
        aria-label=${this.label}
        aria-expanded=${String(this.open)}
        aria-describedby="bubble"
        @click=${this.onClick}
        @pointerenter=${this.onEnter}
        @pointerleave=${this.onLeave}
        @focus=${this.onFocus}
        @blur=${this.onBlur}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
          <circle cx="12" cy="6.4" r="2" />
          <rect x="10.3" y="9.8" width="3.4" height="9.6" rx="1.7" />
        </svg>
      </button>
      <div
        id="bubble"
        class="bubble ${this.open ? "open" : ""}"
        role="tooltip"
        popover="manual"
        data-place="top"
        @pointerenter=${this.onEnter}
        @pointerleave=${this.onLeave}
        @pointerdown=${this.onBubbleDown}
      >
        <span class="h">${e.heading}</span>
        ${nt(e.text)}
        ${e.facts?.length ? k`<dl>${e.facts.map(([e, t]) => k`<dt>${e}</dt><dd>${t}</dd>`)}</dl>` : j}
        <span class="arrow"></span>
      </div>` : j;
	}
	show(e = !1) {
		this.cancelTimer(), this.pinned = this.pinned || e, !this.open && (Y && Y !== this && Y.close(), Y = this, this.open = !0, window.addEventListener("pointerdown", this.onOutside, !0), window.addEventListener("keydown", this.onKey, !0), this.updateComplete.then(() => {
			let e = this.bubble;
			this.open && e && (typeof e.showPopover == "function" && !e.matches(":popover-open") && e.showPopover(), this.follow());
		}));
	}
	close() {
		this.cancelTimer(), this.pinned = !1, this.frame !== void 0 && (cancelAnimationFrame(this.frame), this.frame = void 0), window.removeEventListener("pointerdown", this.onOutside, !0), window.removeEventListener("keydown", this.onKey, !0);
		let e = this.bubble;
		e && typeof e.hidePopover == "function" && e.matches(":popover-open") && e.hidePopover(), Y === this && (Y = void 0), this.open = !1;
	}
	onClick() {
		this.open && this.pinned ? this.close() : this.show(!0);
	}
	onEnter(e) {
		e.pointerType === "mouse" && (this.cancelTimer(), this.open || (this.timer = window.setTimeout(() => this.show(), $e)));
	}
	onLeave(e) {
		e.pointerType === "mouse" && (this.cancelTimer(), this.open && !this.pinned && (this.timer = window.setTimeout(() => this.close(), et)));
	}
	onFocus() {
		this.button?.matches(":focus-visible") && this.show();
	}
	onBlur() {
		if (this.keepOnBlur) {
			this.keepOnBlur = !1;
			return;
		}
		this.open && this.close();
	}
	onBubbleDown() {
		this.keepOnBlur = !0, window.setTimeout(() => {
			this.keepOnBlur = !1;
		}, 400);
	}
	cancelTimer() {
		this.timer !== void 0 && (clearTimeout(this.timer), this.timer = void 0);
	}
	place() {
		let e = this.button, t = this.bubble;
		if (!e || !t) return;
		let n = e.getBoundingClientRect();
		if (!n.width && !n.height) {
			this.close();
			return;
		}
		let r = t.getBoundingClientRect(), i = document.documentElement.clientWidth, a = n.top - r.height - tt, o = "top";
		a < J && (a = n.bottom + tt, o = "bottom");
		let s = n.left + n.width / 2, c = Math.max(J, Math.min(s - r.width / 2, i - r.width - J)), l = Math.max(14, Math.min(s - c, r.width - 14));
		t.style.left = `${Math.round(c)}px`, t.style.top = `${Math.round(a)}px`, t.style.setProperty("--arrow", `${Math.round(l)}px`), t.dataset.place = o;
	}
};
U([z({ attribute: !1 })], X.prototype, "tip", void 0), U([z()], X.prototype, "label", void 0), U([B()], X.prototype, "open", void 0), U([V("button")], X.prototype, "button", void 0), U([V(".bubble")], X.prototype, "bubble", void 0);
function nt(e) {
	return e.split("\n").map((e) => k`<p>
        ${e.split(/\*\*(.+?)\*\*/).map((e, t) => t % 2 ? k`<strong>${e}</strong>` : e)}
      </p>`);
}
function rt(e, t, n, r = []) {
	let i = e.optional(`tip.${t}.hint`, n);
	return {
		heading: e(`tip.${t}.title`, n),
		text: e(`tip.${t}.text`, n),
		facts: i ? [...r, [e("tip.hint"), i]] : r
	};
}
function Z(e, t, n, r) {
	return k`<joe-tip .tip=${rt(e, t, n, r)} label=${e("tip.label")}></joe-tip>`;
}
H("joe-tip", X);
//#endregion
//#region src/components/plan-text.ts
function Q(e) {
	return e ? e.slice(11, 16) : "";
}
function it(e) {
	return e.slice(0, 10);
}
function at(e) {
	switch (e?.kind) {
		case "charge": return "plug";
		case "hold": return "switch";
		case "none": return "relax";
		default: return "sleep";
	}
}
function ot(e) {
	return (e.charge_slots ?? []).map((e) => `${Q(e.start)}–${Q(e.end)}`).join(", ");
}
function st(e, t) {
	if (!t.window) return "";
	let n = [`${Q(t.window.start)}–${Q(t.window.end)}`];
	return t.prices && n.push(`${q(e.lang, t.prices.night * 100, 1)} ct/kWh`), n.join(" · ");
}
function ct(e, t) {
	if (t.kind === "unavailable") {
		let n = t.reasons.find((t) => e.optional(`plan.why.${t}`)) ?? "failed";
		return e.optional(`plan.why.${n}`) ?? "";
	}
	let n = [], r = q(e.lang, t.target ?? 0, 0), i = t.sun_takes_over;
	return t.reasons.includes("balance") && n.push(e("plan.say.balance")), t.kind === "charge" && t.tariff === "dynamic" && t.charge_slots?.length ? n.push(e("plan.say.charge_slots", {
		slots: ot(t),
		target: r
	})) : t.kind === "charge" ? n.push(e("plan.say.charge", {
		from: Q(t.charge_from),
		target: r
	})) : t.kind === "hold" ? (n.push(e("plan.say.hold", { target: r })), t.empty_without && n.push(e("plan.say.empty", { time: Q(t.empty_without) }))) : t.reasons.includes("small_saving") ? n.push(e("plan.say.small_saving")) : n.push(i ? e("plan.say.none", { time: Q(i) }) : e("plan.say.none_nosun")), t.reasons.includes("max_price") && t.kind !== "charge" && n.push(e("plan.say.max_price")), t.day && (n.push(e("plan.day", {
		time: Q(t.day.defer_until),
		kwh: q(e.lang, t.day.held_kwh, 0)
	})), t.day.cost && t.day.cost >= .01 && n.push(e("plan.day.cost", { cost: `${q(e.lang, t.day.cost * 100, 0)} ct` }))), t.kind !== "none" && (i && t.full_at && it(t.full_at) === it(i) ? n.push(e("plan.say.sun_full", {
		sun: Q(i),
		full: Q(t.full_at)
	})) : i ? n.push(e("plan.say.sun", { sun: Q(i) })) : n.push(e("plan.say.nosun"))), n.join(" ");
}
function lt(e, t) {
	return (t.batteries ?? []).map((n) => {
		let r = [n.name];
		return t.kind === "charge" ? r.push(`${q(e.lang, n.soc_start, 0)} → ${q(e.lang, n.target, 0)} %`, `${q(e.lang, n.charge_kwh, 1)} kWh`, `${q(e.lang, n.power_kw, 1)} kW`) : t.kind === "hold" ? r.push(e("plan.line.hold", { target: q(e.lang, n.target, 0) })) : r.push(e("plan.line.now", { soc: q(e.lang, n.soc, 0) })), n.controllable || r.push(e("plan.line.watch_only")), r.join(" · ");
	});
}
function ut(e, t, n = "EUR") {
	if (!t.cost) return "";
	let r = (t) => new Intl.NumberFormat(e.lang, {
		style: "currency",
		currency: n
	}).format(t), i = [];
	return t.kind === "charge" && i.push(e("plan.cost.night", { value: r(t.cost.night_charge) })), t.cost.saving > .005 && i.push(e("plan.cost.saving", { value: r(t.cost.saving) })), i.join(" · ");
}
//#endregion
//#region src/components/car-charge.ts
var $ = class extends R {
	constructor(...e) {
		super(...e), this.values = {}, this.failed = !1;
	}
	static {
		this.styles = [Ve, o`
      :host {
        display: block;
      }
      .boost {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        margin-top: 14px;
        padding-top: 12px;
        border-top: 1px solid var(--joe-line);
      }
      .boost .amount {
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
      .boost .input {
        width: 78px;
        min-height: 34px;
        padding: 4px 8px;
      }
      .boost .unit {
        color: var(--joe-ink-2);
      }
      .boost .unit-seg button {
        min-width: 44px;
      }
      .boost .charge-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        flex-basis: 100%;
      }
      .boost .hint {
        flex-basis: 100%;
        color: var(--joe-muted);
        font-size: 12.5px;
      }
      .boost.on span {
        flex: 1 1 200px;
        font-weight: 600;
        color: var(--joe-ink);
      }
      .bad {
        color: var(--joe-warn, var(--joe-crit));
        margin: 6px 0 0;
      }
    `];
	}
	render() {
		return k`${this.renderBody()}
    ${this.failed && this.t ? k`<p class="bad" role="status">${this.t("devices.charge.failed")}</p>` : j}`;
	}
	renderBody() {
		let { t: e, state: t, action: n } = this;
		if (!e || !t || !n) return j;
		let r = t.plan?.window?.start, i = !!r && t.control?.tonight?.[n.id] === r, a = t.control?.boost?.[n.id], o = t.control?.actions?.[n.id], s = t.control?.tonight_target?.[n.id], c = n.need, l = (t, n, r) => r === "km" ? e("devices.charge.km", {
			target: q(e.lang, t, 0),
			reserve: q(e.lang, n - t, 0)
		}) : e("devices.charge.percent", { target: q(e.lang, t, 0) });
		if (a) {
			let t = o?.value;
			return k`<div class="boost on" data-tipped>
        <span>
          ${e("devices.charge.now_running", {
				amount: l(a.chosen, a.target, a.unit),
				now: t == null ? "–" : `${q(e.lang, t, 0)} ${a.unit}`
			})}
        </span>
        <button type="button" class="mini-btn quiet" @click=${() => this.boost(null)}>${e("devices.boost.stop")}</button>
        ${Z(e, "boost")}
      </div>`;
		}
		if (i) {
			let t = s && s.night === r ? s : null;
			return k`<div class="boost on" data-tipped>
        <span>
          ${o?.reason === "reached" ? e(t ? "devices.charge.tonight_done" : "devices.action.reached_plain", { amount: t ? l(t.chosen, t.target, t.unit) : "" }) : t ? e("devices.charge.tonight_set", { amount: l(t.chosen, t.target, t.unit) }) : e("devices.charge.tonight_window")}
        </span>
        <button type="button" class="mini-btn quiet" @click=${() => this.tonight(!1)}>${e("devices.boost.stop")}</button>
        ${Z(e, "boost")}
      </div>`;
		}
		let u = [...c.soc_entity ? ["%"] : [], ...c.range_entity ? ["km"] : []], d = this.unit && u.includes(this.unit) ? this.unit : u[0], f = this.values[d] ?? (d === "%" ? 80 : 200), p = d === "%" ? 100 : 1500, m = (e) => {
			let t = e?.querySelector("input"), n = Number.parseFloat((t?.value ?? "").replace(",", "."));
			return Math.round(Math.min(p, Math.max(1, Number.isFinite(n) ? n : f)));
		};
		return k`<form
      class="boost"
      data-tipped
      novalidate
      @submit=${(e) => {
			e.preventDefault(), this.boost(m(e.target), d);
		}}
    >
      <label class="toggle-label" for="boost-${n.id}">${e("devices.charge.label")}</label>
      <span class="amount">
        <input
          id="boost-${n.id}"
          class="input"
          type="number"
          inputmode="numeric"
          min=${d === "%" ? 5 : 10}
          max=${p}
          step=${d === "%" ? 5 : 10}
          .value=${String(f)}
          @change=${(e) => {
			let t = Number.parseFloat(e.target.value.replace(",", "."));
			Number.isFinite(t) && t >= 1 && (this.values = {
				...this.values,
				[d]: Math.min(t, p)
			});
		}}
        />
        ${u.length > 1 ? k`<span class="seg unit-seg" role="group" aria-label=${e("devices.boost.unit")}>
              ${u.map((e) => k`<button
                  type="button"
                  aria-pressed=${String(e === d)}
                  @click=${() => this.unit = e}
                >
                  ${e}
                </button>`)}
            </span>` : k`<span class="unit">${d}</span>`}
      </span>
      ${Z(e, "boost")}
      <span class="charge-buttons">
        <button type="submit" class="mini-btn go" ?disabled=${t.mode === "off" || !n.enabled}>
          <ha-icon icon="mdi:ev-plug-type2"></ha-icon>${e("devices.charge.now")}
        </button>
        <button
          type="button"
          class="mini-btn"
          ?disabled=${!r || !n.enabled}
          @click=${(e) => this.tonight(!0, m(e.target.closest("form")), d)}
        >
          <ha-icon icon="mdi:weather-night"></ha-icon>${e("devices.charge.tonight")}
        </button>
      </span>
      ${d === "km" ? k`<small class="hint">${e("devices.boost.reserve", { reserve: q(e.lang, c.reserve_km ?? 50, 0) })}</small>` : j}
      ${r ? j : k`<small class="hint">${e("devices.charge.no_night")}</small>`}
    </form>`;
	}
	async boost(e, t = "%") {
		await this.call({
			type: "energy_joe/control/boost",
			action_id: this.action?.id,
			target: e,
			unit: t
		});
	}
	async tonight(e, t, n) {
		await this.call({
			type: "energy_joe/control/action_tonight",
			action_id: this.action?.id,
			on: e,
			...t == null ? {} : {
				target: t,
				unit: n
			}
		});
	}
	async call(e) {
		this.failed = !1;
		try {
			await this.hass?.callWS(e);
		} catch {
			this.failed = !0;
		}
	}
};
U([z({ attribute: !1 })], $.prototype, "hass", void 0), U([z({ attribute: !1 })], $.prototype, "t", void 0), U([z({ attribute: !1 })], $.prototype, "state", void 0), U([z({ attribute: !1 })], $.prototype, "action", void 0), U([B()], $.prototype, "values", void 0), U([B()], $.prototype, "unit", void 0), U([B()], $.prototype, "failed", void 0), H("joe-car-charge", $);
//#endregion
//#region src/styles/tokens.ts
var dt = o`
  :host {
    --joe-bg: #fbf6ec;
    --joe-surface: #ffffff;
    --joe-surface-2: #f4ebda;
    --joe-ink: #071118;
    --joe-ink-2: #46525b;
    --joe-muted: #5f676e;
    --joe-line: #e7dbc5;
    --joe-line-2: #d6c4a6;
    --joe-amber: #fea707;
    --joe-amber-hover: #ffb632;
    --joe-amber-press: #ec9800;
    --joe-amber-ink: #071118;
    --joe-amber-text: #975a00;
    --joe-amber-soft: #fff0cc;
    --joe-leather: #8c4f20;
    --joe-leather-soft: #f3e4d3;
    --joe-good: #12733f;
    --joe-good-soft: #e2f1e7;
    --joe-warn: #b23a0a;
    --joe-warn-soft: #fbe6db;
    --joe-crit: #b42323;
    --joe-crit-soft: #f8e0e0;
    --joe-info: #2f6b96;
    --joe-info-soft: #e3eef6;
    --joe-stripe-a: #fea707;
    --joe-stripe-b: #ffc649;
    --joe-shadow: 0 1px 0 rgba(7, 17, 24, 0.04), 0 10px 24px -16px rgba(7, 17, 24, 0.35);
    --joe-tip-bg: #071118;
    --joe-tip-ink: #f7efe1;
    --joe-tip-accent: #fea707;
    --joe-tip-line: rgba(247, 239, 225, 0.18);
    --joe-c-band: rgba(7, 17, 24, 0.06);
    --joe-c-pv: #a87500;
    --joe-c-pv-fill: rgba(255, 203, 14, 0.4);
    --joe-c-load: #071118;
    --joe-c-grid: #2f6b96;
    --joe-c-soc: #c46a00;
    --joe-c-soc-2: #8c4f20;
    --joe-c-ist: #5f676e;
    --joe-show-light: block;
    --joe-show-dark: none;
    --joe-display: "Energy Joe Barlow Condensed", "Barlow Condensed", "Arial Narrow", sans-serif;
    --joe-ui: "Energy Joe Barlow", "Barlow", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    color-scheme: light;
  }
  :host([theme="dark"]) {
    --joe-bg: #071118;
    --joe-surface: #0e1b24;
    --joe-surface-2: #152530;
    --joe-ink: #f7efe1;
    --joe-ink-2: #b6c0c7;
    --joe-muted: #86929a;
    --joe-line: #1e303d;
    --joe-line-2: #2b4252;
    --joe-amber-hover: #ffba3d;
    --joe-amber-press: #e69400;
    --joe-amber-text: #ffb224;
    --joe-amber-soft: rgba(254, 167, 7, 0.13);
    --joe-leather: #d08a52;
    --joe-leather-soft: rgba(208, 138, 82, 0.15);
    --joe-good: #3cc67e;
    --joe-good-soft: rgba(60, 198, 126, 0.14);
    --joe-warn: #ff8a50;
    --joe-warn-soft: rgba(255, 138, 80, 0.14);
    --joe-crit: #ff7070;
    --joe-crit-soft: rgba(255, 112, 112, 0.14);
    --joe-info: #6ea9d8;
    --joe-info-soft: rgba(110, 169, 216, 0.14);
    --joe-shadow: 0 1px 0 rgba(0, 0, 0, 0.35), 0 14px 30px -18px rgba(0, 0, 0, 0.8);
    --joe-tip-bg: #f7efe1;
    --joe-tip-ink: #071118;
    --joe-tip-accent: #975a00;
    --joe-tip-line: rgba(7, 17, 24, 0.14);
    --joe-c-band: rgba(110, 169, 216, 0.09);
    --joe-c-pv: #ffcb0e;
    --joe-c-pv-fill: rgba(255, 203, 14, 0.22);
    --joe-c-load: #f7efe1;
    --joe-c-grid: #6ea9d8;
    --joe-c-soc: #fea707;
    --joe-c-soc-2: #d08a52;
    --joe-c-ist: #86929a;
    --joe-show-light: none;
    --joe-show-dark: block;
    color-scheme: dark;
  }
`;
//#endregion
export { _e as A, Ie as C, R as D, z as E, j as O, Le as S, B as T, K as _, ct as a, Ve as b, st as c, Ke as d, qe as f, Xe as g, Je as h, at as i, o as j, k, Z as l, q as m, ut as n, ot as o, Ge as p, lt as r, Q as s, dt as t, Ze as u, Qe as v, V as w, H as x, U as y };
