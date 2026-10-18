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
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: f, getOwnPropertySymbols: p, getPrototypeOf: m } = Object, h = globalThis, g = h.trustedTypes, _ = g ? g.emptyScript : "", ee = h.reactiveElementPolyfillSupport, v = (e, t) => e, y = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? _ : null;
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
}, te = (e, t) => !l(e, t), ne = {
	attribute: !0,
	type: String,
	converter: y,
	reflect: !1,
	useDefault: !1,
	hasChanged: te
};
Symbol.metadata ??= Symbol("metadata"), h.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var b = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = ne) {
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
		return this.elementProperties.get(e) ?? ne;
	}
	static _$Ei() {
		if (this.hasOwnProperty(v("elementProperties"))) return;
		let e = m(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(v("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(v("properties"))) {
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
			let i = (n.converter?.toAttribute === void 0 ? y : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? y : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? te)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
b.elementStyles = [], b.shadowRootOptions = { mode: "open" }, b[v("elementProperties")] = /* @__PURE__ */ new Map(), b[v("finalized")] = /* @__PURE__ */ new Map(), ee?.({ ReactiveElement: b }), (h.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var re = globalThis, ie = (e) => e, x = re.trustedTypes, ae = x ? x.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, S = "$lit$", C = `lit$${Math.random().toFixed(9).slice(2)}$`, oe = "?" + C, se = `<${oe}>`, w = document, T = () => w.createComment(""), E = (e) => e === null || typeof e != "object" && typeof e != "function", D = Array.isArray, ce = (e) => D(e) || typeof e?.[Symbol.iterator] == "function", le = "[ 	\n\f\r]", O = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ue = /-->/g, de = />/g, k = RegExp(`>|${le}(?:([^\\s"'>=/]+)(${le}*=${le}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), fe = /'/g, pe = /"/g, me = /^(?:script|style|textarea|title)$/i, he = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), A = he(1), ge = he(2), j = Symbol.for("lit-noChange"), M = Symbol.for("lit-nothing"), _e = /* @__PURE__ */ new WeakMap(), N = w.createTreeWalker(w, 129);
function ve(e, t) {
	if (!D(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return ae === void 0 ? t : ae.createHTML(t);
}
var ye = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = O;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === O ? c[1] === "!--" ? o = ue : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = k) : (me.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = k) : o = de : o === k ? c[0] === ">" ? (o = i ?? O, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? k : c[3] === "\"" ? pe : fe) : o === pe || o === fe ? o = k : o === ue || o === de ? o = O : (o = k, i = void 0);
		let d = o === k && e[t + 1].startsWith("/>") ? " " : "";
		a += o === O ? n + se : l >= 0 ? (r.push(s), n.slice(0, l) + S + n.slice(l) + C + d) : n + C + (l === -2 ? t : d);
	}
	return [ve(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, be = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = ye(t, n);
		if (this.el = e.createElement(l, r), N.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = N.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(S)) {
					let t = u[o++], n = i.getAttribute(e).split(C), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Se : r[1] === "?" ? Ce : r[1] === "@" ? we : I
					}), i.removeAttribute(e);
				} else e.startsWith(C) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (me.test(i.tagName)) {
					let e = i.textContent.split(C), t = e.length - 1;
					if (t > 0) {
						i.textContent = x ? x.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], T()), N.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], T());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === oe) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(C, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += C.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = w.createElement("template");
		return n.innerHTML = e, n;
	}
};
function P(e, t, n = e, r) {
	if (t === j) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = E(t) ? void 0 : t._$litDirective$;
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? w).importNode(t, !0);
		N.currentNode = r;
		let i = N.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new F(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Te(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = N.nextNode(), a++);
		}
		return N.currentNode = w, r;
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
		this.type = 2, this._$AH = M, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = P(this, e, t), E(e) ? e === M || e == null || e === "" ? (this._$AH !== M && this._$AR(), this._$AH = M) : e !== this._$AH && e !== j && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? ce(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== M && E(this._$AH) ? this._$AA.nextSibling.data = e : this.T(w.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = be.createElement(ve(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new xe(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = _e.get(e.strings);
		return t === void 0 && _e.set(e.strings, t = new be(e)), t;
	}
	k(t) {
		D(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(T()), this.O(T()), this, this.options)) : r = n[i], r._$AI(a), i++;
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
		this.type = 1, this._$AH = M, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = M;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = P(this, e, t, 0), a = !E(e) || e !== this._$AH && e !== j, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = P(this, r[n + o], t, o), s === j && (s = this._$AH[o]), a ||= !E(s) || s !== this._$AH[o], s === M ? e = M : e !== M && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === M ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Se = class extends I {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === M ? void 0 : e;
	}
}, Ce = class extends I {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== M);
	}
}, we = class extends I {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = P(this, e, t, 0) ?? M) === j) return;
		let n = this._$AH, r = e === M && n !== M || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== M && (n === M || r);
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
}, Ee = {
	M: S,
	P: C,
	A: oe,
	C: 1,
	L: ye,
	R: xe,
	D: ce,
	V: P,
	I: F,
	H: I,
	N: Ce,
	U: we,
	B: Se,
	F: Te
}, De = re.litHtmlPolyfillSupport;
De?.(be, F), (re.litHtmlVersions ??= []).push("3.3.3");
var Oe = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new F(t.insertBefore(T(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, ke = globalThis, L = class extends b {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Oe(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return j;
	}
};
L._$litElement$ = !0, L.finalized = !0, ke.litElementHydrateSupport?.({ LitElement: L });
var Ae = ke.litElementPolyfillSupport;
Ae?.({ LitElement: L }), (ke.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@lit/reactive-element/decorators/property.js
var je = {
	attribute: !0,
	type: String,
	converter: y,
	reflect: !1,
	hasChanged: te
}, Me = (e = je, t, n) => {
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
function R(e) {
	return (t, n) => typeof n == "object" ? Me(e, t, n) : ((e, t, n) => {
		let r = t.hasOwnProperty(n);
		return t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0;
	})(e, t, n);
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/state.js
function z(e) {
	return R({
		...e,
		state: !0,
		attribute: !1
	});
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/base.js
var Ne = (e, t, n) => (n.configurable = !0, n.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, n), n);
//#endregion
//#region node_modules/@lit/reactive-element/decorators/query.js
function B(e, t) {
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
			return Ne(n, r, { get() {
				let n = e.call(this);
				return n === void 0 && (n = a(this), (n !== null || this.hasUpdated) && t.call(this, n)), n;
			} });
		}
		return Ne(n, r, { get() {
			return a(this);
		} });
	};
}
//#endregion
//#region src/i18n/de.ts
var Pe = {
	"tab.overview": "Übersicht",
	"tab.plan": "Plan",
	"tab.review": "Rückblick",
	"tab.devices": "Geräte",
	"tab.household": "Haushalt",
	"climate.title": "Heizung & Klima",
	"climate.lead": "Ist keiner da, drehe ich Heizung und Klimaanlage herunter – und rechtzeitig wieder hoch, wenn jemand heimkommt. Du entscheidest für jedes Gerät einzeln.",
	"climate.ha_open": "Der runde Pfeil-Knopf öffnet ein Gerät in Home Assistant.",
	"climate.mirror.presence": "Anwesenheit",
	"climate.mirror.presence.none": "noch kein Helfer, ich schaue auf eure Personen",
	"climate.mirror.today": "Heute",
	"climate.mirror.today.workday": "Arbeitstag",
	"climate.mirror.today.weekend": "Wochenende",
	"climate.mirror.today.holiday": "freier Werktag",
	"climate.mirror.today.ho": "Homeoffice: {names}",
	"climate.mirror.unknown": "noch nicht bekannt",
	"climate.mirror.night": "Nachtruhe",
	"climate.mirror.night.time": "feste Uhrzeiten je Gerät",
	"climate.mirror.night.no_entity": "noch keine Entität gewählt",
	"rule.on": "an",
	"climate.enabled": "Joe steuert Heizung und Klima",
	"climate.live": "Ich steuere die Geräte, bei denen du „Joe steuert dieses Gerät“ einschaltest. Tipp dazu auf ein Gerät.",
	"climate.not_live": "Steuern tue ich erst im Modus „Live“ – bis dahin zeige ich bei jedem Gerät nur, was ich täte.",
	"climate.home": "Zu Hause: {names}",
	"climate.nobody": "Gerade ist niemand zu Hause.",
	"climate.way.towards": "{name} ist {km} km weg und kommt näher.",
	"climate.way.away": "{name} ist {km} km weg und entfernt sich.",
	"climate.way.other": "{name} ist {km} km weg.",
	"climate.way.minutes_route": "Noch etwa {minutes} Minuten Fahrt.",
	"climate.way.minutes_guess": "Geschätzt etwa {minutes} Minuten.",
	"climate.route_eta": "Fahrzeit über den Routendienst",
	"climate.now.arriving_usual": "Jetzt: gleich ist die übliche Heimkehrzeit – ich fahre schon hoch.",
	"tip.climate_route_eta.title": "Wie weiß Joe, wann jemand heimkommt?",
	"tip.climate_route_eta.text": "Ich nutze zwei Wege.\n**1. Wer näher kommt:** Mit der Integration „Nähe“ frage ich den Routendienst (Haushalt › Unterwegs & Wetter: OpenStreetMap, Waze oder Google), wie lange die Fahrt noch dauert – mit Stau, wo der Dienst ihn kennt. Dafür geht die Position der Person, auf etwa 100 m gerundet, an diesen Dienst. Schaltest du das aus, rechne ich mit 40 km/h.\n**2. Eure übliche Zeit:** Ich merke mir, wann ihr an Arbeits- und freien Tagen meist heimkommt, und fahre die Räume schon vorher hoch. Wer nur zu einer ganz anderen Zeit in der Nähe vorbeifährt, zählt erst, wenn er stetig näher kommt.",
	"tip.climate_route_eta.hint": "Die übliche Zeit kenne ich nach 4 Heimkehren an solchen Tagen, und nur, wenn sie nicht mehr als 45 Minuten schwankt.",
	"climate.no_proximity": "Damit ich rechtzeitig vorheize, wenn jemand heimkommt, brauche ich die Integration „Nähe“ (Proximity) für eure Personen.",
	"climate.add_proximity": "Nähe einrichten",
	"household.presence": "Ist jemand zu Hause?",
	"household.presence.on": "gerade: jemand da",
	"household.presence.off": "gerade: niemand da",
	"household.presence.yours": "Das ist ein Helfer in Home Assistant – ändern kannst du ihn dort unter Einstellungen → Geräte & Dienste → Helfer.",
	"household.presence.yours_group": "Das ist deine Gruppe – ich lese sie nur. Ihre Mitglieder änderst du in deiner Konfiguration.",
	"household.presence.other": "Andere Entität",
	"household.presence.stop": "Nicht mehr nutzen",
	"household.presence.propose": "Ich schlage einen Helfer „Jemand zu Hause“ in Home Assistant vor: an, sobald eine dieser Personen zu Hause ist. Mit Gastmodus-Schalter zählt auch, wer kein Handy dabei hat – Babysitter, Kinder, Gäste. Beides gehört dir und funktioniert auch ohne mich.",
	"household.presence.found": "Du hast schon eine Gruppe dafür. Die nehme ich – dann sagt sie mir, ob jemand zu Hause ist.",
	"household.presence.use": "Diese nehmen",
	"household.presence.new_instead": "Stattdessen einen neuen Helfer anlegen",
	"household.presence.persons": "Personen im Helfer",
	"household.presence.guest": "Gastmodus-Schalter dazu anlegen",
	"household.guest": "Gastmodus",
	"household.guest.offer": "Für den Babysitter oder Kinder ohne Handy: ein Schalter „Gastmodus“ (normal aus). Ist er an, gilt ein Gast als zu Hause – über einen Tracker „Gast“, der in deine Gruppe kommt. So bleibt die Gruppe bei „home“/„not_home“.",
	"household.guest.create": "Gastmodus anlegen",
	"household.guest.name": "Gastmodus",
	"household.guest.tracker_name": "Gast",
	"household.guest.home": "Gast gilt als zu Hause",
	"household.guest.away": "aus – kein Gast",
	"household.guest.add_to_group": "Damit der Gastmodus zählt, nimm den Tracker in „{group}“ auf. Die Gruppe steht in deiner YAML-Konfiguration; ergänze bei ihren Mitgliedern diese Zeile und lade die Gruppen neu:",
	"household.guest.automation": "Gastmodus → Tracker „Gast“",
	"household.guest.automation_text": "Angelegt von Energy Joe: {tracker} folgt dem Schalter {guest} (an = home, aus = not_home), damit die Anwesenheitsgruppe bei home/not_home bleibt.",
	"tip.household_guest.title": "Wie funktioniert der Gastmodus?",
	"tip.household_guest.text": "Ich lege drei ganz normale Bausteine in Home Assistant an: den Schalter „Gastmodus“, einen Geräte-Tracker „Gast“ und eine Automation, die den Tracker dem Schalter folgen lässt (an = zu Hause, aus = weg). Der Tracker gehört zu deiner Anwesenheitsgruppe, wie eine Person. Läge der Schalter selbst in der Gruppe, hätte sie nur noch den Zustand an/aus – und Automationen, die auf „home“ prüfen, würden nicht mehr greifen.",
	"tip.household_guest.hint": "Alles funktioniert auch ohne mich. Schalte den Gastmodus wieder aus, wenn der Besuch geht.",
	"household.presence.create": "Helfer anlegen",
	"household.presence.creating": "Lege an …",
	"household.presence.own": "Eigene Entität wählen",
	"household.presence.name": "Jemand zu Hause",
	"household.presence.failed": "Das hat nicht geklappt ({error}). Du kannst den Helfer auch selbst anlegen und hier wählen.",
	"pick.presence.title": "Was sagt, dass jemand zu Hause ist?",
	"tip.household_presence.title": "Warum ein eigener Helfer?",
	"tip.household_presence.text": "Ob jemand da ist, entscheidet bei mir nur dieser eine Helfer – nicht jede Person einzeln. So steuerst du es an einer Stelle: Wer zählt, und mit dem Gastmodus-Schalter auch der Babysitter. Ich lege dafür einen Template-Binärsensor und einen Schalter als normale Helfer in Home Assistant an.",
	"tip.household_presence.hint": "Hast du schon so eine Gruppe, wähle sie mit „Eigene Entität wählen“.",
	"tip.pick_presence.title": "Welche Entität sagt „jemand ist da“?",
	"tip.pick_presence.text": "Sie muss „an“ oder „zu Hause“ sein, solange jemand da ist: eine Gruppe, ein Template-Binärsensor oder ein Präsenzmelder.",
	"climate.failed": "Die Geräte konnte ich gerade nicht laden.",
	"climate.none": "Ich habe keine Thermostate oder Klimaanlagen in Home Assistant gefunden.",
	"climate.no_area": "Ohne Raum",
	"climate.room.enabled": "Joe steuert {name}",
	"climate.room.steer": "Joe steuert dieses Gerät",
	"climate.room.off": "Steuere ich nicht.",
	"climate.meter.pick": "Messgerät für {name} wählen",
	"climate.meters.count": "{linked} von {all} gemessen",
	"climate.meter.without_long": "Kein Messgerät",
	"climate.meter.open_long": "Noch kein Messgerät",
	"climate.meter.change": "Ändern",
	"climate.meter.other_short": "Anderes",
	"climate.meter.search": "Suchen",
	"climate.meter.search_placeholder": "Name, Raum oder Shelly …",
	"climate.meter.no_hits": "Nichts gefunden.",
	"climate.meter.cancel": "Abbrechen",
	"climate.meters.say": "Welches Gerät misst Leistung und Energie dieses Klimageräts? Ich wähle vor, was nach Name und Raum passt. Mehrere Klimageräte dürfen am selben Messgerät hängen.",
	"climate.list": "Deine Geräte nach Raum",
	"climate.card.measured": "Strom gemessen",
	"climate.why.free_day": "Freier Tag",
	"climate.moved": "{name} steht jetzt unter {group} →",
	"climate.device.main_off": "aus – dann steuere ich kein Gerät",
	"climate.consumer": "Im Energie-Dashboard:",
	"climate.unassigned.lead": "Im Energie-Dashboard steht dieser Zähler als Klimagerät. Zu welchem Gerät er gehört, weiß ich noch nicht.",
	"climate.assign": "Zu welchem Klimagerät gehört dieser Zähler?",
	"climate.assign.pick": "Gerät wählen",
	"climate.assign.has_meter": "{name} (hat schon ein Messgerät)",
	"climate.assign.no_device": "Dieser Zähler hängt in Home Assistant an keinem Gerät. Darum kann ich ihn keinem Klimagerät zuordnen. Sag mir unten, was er misst.",
	"tip.climate_assign.title": "Warum zuordnen?",
	"tip.climate_assign.text": "Gehört der Zähler zu einem Thermostat oder einer Klimaanlage, merke ich ihn mir als dessen Messgerät. Dann siehst du Gerät und Stromverbrauch auf einer Seite.",
	"tip.climate_assign.hint": "Misst er etwas anderes, stell unten die Art um. Dann steht er bei seiner Gruppe.",
	"climate.meter.none_option": "— kein Messgerät —",
	"climate.meter.confirm": "Bestätigen",
	"climate.meter.no_meters": "Joe findet kein Gerät mit Leistungs- oder Energiesensor.",
	"climate.meter.linked": "gekoppelt",
	"climate.meter.suggested": "Vorschlag",
	"climate.meter.shared": "Am selben Messgerät wie {names} – die Messung gilt für alle zusammen.",
	"tip.climate_meter.title": "Was misst dieses Gerät?",
	"tip.climate_meter.text": "Wähle das Gerät, das Leistung und Energie dieses Klimageräts misst – z. B. einen Kanal eines Shelly Pro 3EM, gruppiert nach „verbunden über …“. Meinen Vorschlag habe ich vorgewählt und mit „(Vorschlag)“ markiert; „Bestätigen“ übernimmt ihn. „— kein Messgerät —“ sagt mir, dass es keine Messung gibt.",
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
	"climate.night_back": "Spätestens wieder angenehm um",
	"climate.night.by": "Nacht erkenne ich",
	"climate.night.by.time": "an festen Uhrzeiten",
	"climate.night.by.entity": "an einer Entität",
	"climate.night.no_entity": "Noch keine Entität gewählt.",
	"climate.night.now_on": "jetzt: Nacht",
	"climate.night.now_off": "jetzt: wach",
	"climate.night.change": "Andere Entität",
	"climate.night.pick": "Entität wählen",
	"climate.night.entity_say": "Ist die Entität „an“, ist Nacht – z. B. ein Helfer, den deine Gute-Nacht-Routine einschaltet, ein Bettsensor oder ein Zeitplan. Die Uhrzeit für den Morgen stellst du je Raum ein.",
	"climate.night.time_say": "Von wann bis wann es nachts aus ist, stellst du je Gerät ein – unten stehen alle mit „Nachts aus“.",
	"climate.entity": "Entität",
	"climate.entities": "Entitäten",
	"climate.open_device": "Gerät in Home Assistant öffnen ({id})",
	"climate.open_meter": "Messgerät in Home Assistant öffnen",
	"pick.night.title": "Was sagt dir, dass ihr im Bett seid?",
	"tip.climate_night.text": "Nachts schalte ich die Klimaanlage aus und rechtzeitig vor deiner Morgenzeit wieder an, damit es dann angenehm ist. Woran ich die Nacht erkenne – feste Uhrzeit oder eine Entität –, stellst du unter Haushalt › Nachtruhe ein. Wie lange der Raum zum Abkühlen braucht, lerne ich mit der Zeit.",
	"tip.climate_night_source.title": "Woran erkennt Joe die Nacht?",
	"tip.climate_night_source.text": "„An festen Uhrzeiten“: jede Klimaanlage hat ihre Zeit von – bis. „An einer Entität“: Nacht ist, solange die gewählte Entität „an“ ist – etwa ein Helfer (input_boolean), den deine Gute-Nacht-Routine einschaltet und morgens wieder aus, ein Bettsensor oder ein Zeitplan.",
	"tip.climate_night_source.hint": "Auch mit Entität fahre ich die Räume rechtzeitig zur Morgen-Zeit wieder hoch, falls morgens niemand ausschaltet.",
	"tip.pick_night.title": "Welche Entität sagt „Nacht“?",
	"tip.pick_night.text": "Passend ist alles, was „an“ ist, solange ihr schlaft: ein Schalter oder Helfer (input_boolean), den deine Gute-Nacht-Routine setzt, ein Binärsensor eines Bettsensors oder ein Zeitplan.",
	"climate.night_from": "Aus ab",
	"climate.night_until": "Wieder angenehm bis",
	"climate.now.home": "Jetzt: wie eingestellt – jemand ist da.",
	"climate.now.away": "Jetzt: Abwesenheit.",
	"climate.now.arriving": "Jetzt: jemand kommt heim – ich fahre schon hoch.",
	"climate.now.free_day": "Jetzt: freier Tag.",
	"climate.now.night": "Jetzt: Nachtruhe.",
	"climate.rate": "Erreicht etwa {rate} °C pro Stunde (gelernt).",
	"climate.rate_default": "Wie schnell der Raum warm oder kühl wird, lerne ich noch.",
	"climate.log.normal": "auf Normal gestellt",
	"climate.log.holiday": "auf Feiertag gestellt",
	"climate.log.home_office": "auf Homeoffice gestellt",
	"climate.log.held": "auf dein Profil von Hand gestellt",
	"climate.log.night": "für die Nacht ausgeschaltet",
	"climate.log.away": "auf Abwesenheit gestellt",
	"climate.log.free_day": "auf das Profil für freie Tage gestellt",
	"climate.log.back": "zurückgestellt, wie es vorher war",
	"climate.log.failed": "Einstellen hat nicht geklappt",
	"tip.climate_enabled.title": "Was macht Joe hier?",
	"tip.climate_enabled.text": "Ich schaue, wer zu Hause ist (der Helfer „Jemand zu Hause“ unter Haushalt › Wer ist da). Ist keiner da, stelle ich die Geräte, die du einschaltest, wie gewählt ein – absenken, aus oder ein Profil. Kommt jemand heim, stelle ich alles genau so zurück, wie es vorher war.",
	"tip.climate_enabled.hint": "Wie überall: In der Simulation schalte ich nichts, sondern zeige nur, was ich täte.",
	"tip.climate_presence.title": "Woher weiß Joe, wer kommt?",
	"tip.climate_presence.text": "Wer zu Hause ist, sagt mir der Helfer „Jemand zu Hause“ – gibt es ihn noch nicht, schaue ich auf eure Personen in Home Assistant. Wer heimkommt, sehe ich an der Integration „Nähe“ (Proximity): Sie meldet Entfernung und Richtung. Wie lange die Fahrt noch dauert, frage ich den Routendienst (ohne ihn rechne ich mit 40 km/h). So fange ich früh genug an, dass der Raum rechtzeitig wieder angenehm ist.",
	"tip.climate_room.title": "Dieses Gerät steuern?",
	"tip.climate_room.text": "Nur Geräte mit eingeschaltetem Schalter fasse ich an. So kannst du zum Beispiel das Bad oder das Kinderzimmer auslassen.",
	"tip.climate_away.title": "Was passiert, wenn keiner da ist?",
	"tip.climate_away.text": "**Absenken**: um die eingestellten Grad kühler (bei einer kühlenden Klimaanlage wärmer).\n**Aus**: das Gerät ganz aus.\n**Profil**: ein Profil des Geräts, z. B. bei Homematic IP ein Heizprofil „Abwesend“ in der Heizgruppe.",
	"tip.climate_away.hint": "Am besten legst du bei Homematic IP eigene Profile an – dann gelten deine Zeiten und Temperaturen.",
	"tip.climate_free_day.title": "Freie Tage?",
	"tip.climate_free_day.text": "An Wochenenden und Feiertagen (laut deinem Arbeitstag-Sensor) schalte ich auf dieses Profil, solange jemand zu Hause ist – z. B. ein Homematic-IP-Profil „Feiertag“ mit späterem Aufheizen.",
	"tip.climate_night.title": "Nachts aus?",
	"climate.away_after": "Als abwesend erst nach",
	"climate.away_after.unit": "min",
	"tip.climate_away_after.title": "Ab wann gilt das Haus als leer?",
	"tip.climate_away_after.text": "Erst wenn so viele Minuten niemand mehr da ist, schalte ich auf Abwesenheit. Gehst du nur kurz zum Bäcker oder verliert dein Handy kurz das WLAN, bleibt alles, wie es ist.",
	"tip.climate_away_after.hint": "0 heißt sofort. Das gilt für alle Geräte.",
	"climate.now.just_left": "Jetzt: Gerade sind alle gegangen – ich warte noch {min} Minuten, ob jemand zurückkommt.",
	"climate.today.workday": "Heute ist ein Arbeitstag.",
	"climate.today.weekend": "Heute ist Wochenende.",
	"climate.today.holiday": "Heute ist ein freier Werktag – Feiertag oder Brückentag.",
	"climate.today.ho": "Homeoffice heute: {names}.",
	"climate.today.ho_none": "Heute arbeitet laut Kalender niemand im Homeoffice.",
	"climate.today.read_at": "Kalender gelesen um {time}.",
	"climate.today.labels_unread": "Kalender noch nicht gelesen – ob heute jemand im Homeoffice ist, sehe ich in ein paar Minuten.",
	"climate.today.labels_error": "Kalender gerade nicht erreichbar – ob heute jemand im Homeoffice ist, weiß ich nicht. Ich versuche es bald wieder.",
	"climate.today.free_by": "Zusätzlich frei, wenn eins davon an ist",
	"climate.today.free_none": "nichts gewählt",
	"climate.today.free_pick": "Auswählen",
	"climate.today.free_change": "Ändern",
	"tip.climate_free_entities.title": "Was macht einen Tag zusätzlich frei?",
	"tip.climate_free_entities.text": "Zum Beispiel ein Helfer „Brückentag“ oder „Urlaub“, ein Zeitplan oder ein Schalter. Ist einer davon an, gilt heute als frei – an Werktagen nehme ich dann das Feiertagsprofil.",
	"pick.free_day.title": "Was macht einen Tag frei?",
	"tip.pick_free_day.title": "Welche Entitäten passen?",
	"tip.pick_free_day.text": "Alles, was an einem freien Tag „an“ ist: ein Helfer (input_boolean) „Brückentag“, ein Zeitplan, ein Schalter oder ein Binärsensor. Du kannst mehrere wählen – einer reicht.",
	"week.row": "Wochenprofile",
	"tip.climate_week.title": "Was sind Wochenprofile?",
	"tip.climate_week.text": "Wie bei einem Homematic-IP-Thermostat: Für Heizen und Kühlen gibt es je 6 Profile mit Schaltpunkten über den Tag, z. B. 07:00 → 22 °C, 23:00 → aus. Per Haken sagst du, wann ich welches Profil nehme: Normal, Feiertag, Abwesend, Homeoffice.\nIch folge der Betriebsart, die an der Klimaanlage eingestellt ist. Schaltest du sie von Hand aus, schalte ich sie nicht wieder ein.",
	"tip.climate_week.hint": "Ich stelle nur ein, wenn sich das Ziel ändert – nicht jede Minute. In der Simulation zeige ich nur, was ich täte.",
	"week.edit": "Profile bearbeiten",
	"week.no_sets": "Noch keine Profile – tipp auf „Profile bearbeiten“. Bis dahin gilt die Einstellung darunter.",
	"week.pending.start": "Die Wochenprofile übernehmen, sobald die laufende Nacht oder Abwesenheit vorbei ist – bis dahin bleibt alles, wie es ist.",
	"week.pending.end": "Die Wochenprofile laufen noch bis zum Ende der Nacht bzw. Abwesenheit, dann gebe ich ab.",
	"devprof.pending.start": "Die Haken wirken, sobald die laufende Abwesenheit oder der freie Tag vorbei ist – bis dahin bleibt alles, wie es ist.",
	"devprof.pending.end": "Das Abwesenheitsprogramm läuft noch, bis jemand heimkommt. Dann stelle ich das normale Programm ein und überlasse das Gerät wieder sich selbst.",
	"week.legacy_now": "Die Klimaanlage steht gerade auf „{state}“ – dafür gibt es keine Profile, also gilt die Einstellung darunter.",
	"climate.hvac.off": "Aus",
	"climate.hvac.heat": "Heizen",
	"climate.hvac.cool": "Kühlen",
	"climate.hvac.dry": "Entfeuchten",
	"climate.hvac.fan_only": "Nur Lüften",
	"climate.hvac.auto": "Automatik",
	"climate.hvac.heat_cool": "Heizen/Kühlen",
	"week.now": "Jetzt: {text}",
	"week.would": "Würde jetzt: {text}",
	"week.state_off": "Aus",
	"week.held": "von Hand",
	"week.next": "um {time} → {value}",
	"week.why.night": "Nachtruhe",
	"week.why.away": "Niemand da",
	"week.why.just_left": "Gerade gegangen – ich warte {min} Minuten",
	"week.why.arriving": "Jemand kommt heim",
	"week.why.arriving_usual": "Gleich übliche Heimkehr",
	"week.why.holiday": "Freier Werktag",
	"week.why.home_office": "Homeoffice",
	"week.why.weekend": "Wochenende",
	"week.why.home": "Jemand ist da",
	"week.why.held": "Profil von Hand",
	"week.why.override": "Von Hand verstellt",
	"week.why.off_by_hand": "Von Hand aus",
	"week.why.unavailable": "Gerät nicht erreichbar",
	"week.why.manual_mode": "Gerät nicht auf Automatik",
	"week.override.manual": "Von Hand verstellt – das gilt bis {time}, dann geht es nach Plan weiter.",
	"week.override.manual_open": "Von Hand verstellt – das gilt bis zum nächsten Schaltpunkt.",
	"week.override.off": "Von Hand aus – ich warte, bis du sie wieder einschaltest.",
	"week.override.preset": "Profil am Gerät von Hand gewechselt – das gilt bis {time}.",
	"week.override.preset_open": "Profil am Gerät von Hand gewechselt – das gilt, bis jemand geht oder heimkommt oder ein anderer Tag beginnt.",
	"week.resume": "Zurück zum Plan",
	"tip.week_resume.title": "Was macht „Zurück zum Plan“?",
	"tip.week_resume.text": "Ich vergesse deine Änderung von Hand und stelle gleich wieder ein, was laut Profil jetzt gilt.",
	"week.error": "Das Einstellen hat nicht geklappt: {error}",
	"week.error.not_confirmed": "Ich habe es mehrmals versucht, aber das Gerät hat den Wert nicht übernommen. Ist es erreichbar?",
	"week.as_is": "wie am Gerät eingestellt",
	"week.hold": "Profil von Hand",
	"week.hold.auto": "Automatik",
	"week.hold.until": "Wie lange?",
	"week.hold.midnight": "bis heute 24:00",
	"week.hold.forever": "bis auf Weiteres",
	"week.hold.later_night": "Gerade hat die Nachtruhe Vorrang – danach gilt wieder {profile}.",
	"week.hold.later_away": "Gerade ist niemand da, das geht vor – sobald jemand heimkommt, gilt wieder {profile}.",
	"week.hold.other_mode": "Fürs {mode} hast du {profile} von Hand gewählt ({until}) – das gilt wieder, sobald die Klimaanlage auf {mode} steht.",
	"week.hold.lift": "Aufheben",
	"tip.week_hold.title": "Heute ein anderes Profil?",
	"tip.week_hold.text": "Wähle ein Profil, das statt meiner Wahl gelten soll – z. B. Profil 5 für einen Tag mit Gästen. Es gilt bis heute 24:00 oder bis auf Weiteres. „Automatik“ gibt die Wahl wieder an mich.\nNachtruhe und Abwesenheit gehen trotzdem vor.",
	"week.away_fallback": "Gilt nur, solange kein Profil den Haken „Abwesend“ hat.",
	"tip.week_away.title": "Was passiert, wenn keiner da ist?",
	"tip.week_away.text": "Hat kein Profil den Haken „Abwesend“, mache ich Folgendes:\n**Absenken**: das Profil von jetzt, um die eingestellten Grad kühler (beim Kühlen wärmer).\n**Aus**: die Klimaanlage ganz aus.",
	"devprof.title": "Heizprofile des Geräts",
	"tip.climate_device_profiles.title": "Wann nimmt Joe welches Heizprofil?",
	"tip.climate_device_profiles.text": "Zeiten und Temperaturen der Wochenprogramme stehen im Gerät (z. B. in der CCU oder der Homematic-IP-App) – die ändere ich nicht. Du sagst mir nur per Haken, wofür ein Profil gilt: **Normal** an Arbeitstagen und am Wochenende, **Feiertag** an freien Werktagen, **Abwesend**, wenn keiner da ist, **Homeoffice** an Tagen mit Homeoffice laut Kalender. Der Name ist nur für dich.\nIch wechsle das Profil nur, wenn das Gerät auf Automatik steht, und höchstens alle 15 Minuten – außer beim Gehen und Heimkommen.",
	"tip.climate_device_profiles.hint": "Jeder Haken sitzt an höchstens einem Profil. Setzt du ihn woanders, wandert er dorthin.",
	"devprof.name": "Name für {preset}",
	"devprof.tags": "Wofür gilt {preset}?",
	"devprof.moved": "„{tag}“ sitzt jetzt bei {to} statt bei {from}.",
	"devprof.need_normal": "Setz den Haken „Normal“ bei einem Profil. Erst dann gelten die Haken – bis dahin steuere ich das Gerät wie bisher mit den Einstellungen darunter.",
	"devprof.not_auto": "Ich wechsle Profile nur im Automatik-Betrieb. Gerade steht das Gerät auf „{state}“.",
	"devprof.away_keep": "Lassen",
	"tip.devprof_away.title": "Was passiert, wenn keiner da ist?",
	"tip.devprof_away.text": "Hat kein Profil den Haken „Abwesend“:\n**Lassen**: Ich ändere nichts.\n**Aus**: Ich schalte die Heizung aus und beim Heimkommen wieder auf Automatik.",
	"week.profile": "Profil {n}",
	"week.mode.heat": "Heizen",
	"week.mode.cool": "Kühlen",
	"week.off": "aus",
	"week.tag.normal": "Normal",
	"week.tag.holiday": "Feiertag",
	"week.tag.away": "Abwesend",
	"week.tag.home_office": "Homeoffice",
	"week.ho.default": "Homeoffice ist bei euch der normale Arbeitstag – dafür braucht es keinen eigenen Haken.",
	"week.ho.no_calendar": "Homeoffice lese ich aus dem Kalender – dafür braucht jemand im Haushalt einen Kalender.",
	"week.ho.rules": "Haushalt › Tage & Kalender →",
	"week.label": "Wochenprofile bearbeiten",
	"week.title": "Wochen|profile",
	"week.loading": "Lade das Gerät …",
	"week.load_failed": "Die Geräte konnte ich gerade nicht laden.",
	"week.device_missing": "Dieses Gerät finde ich gerade nicht in Home Assistant.",
	"week.no_modes": "Dieses Gerät kann weder heizen noch kühlen.",
	"week.modes": "Betriebsart",
	"tip.week_mode.title": "Heizen oder Kühlen?",
	"tip.week_mode.text": "Jede Betriebsart hat ihre eigenen 6 Profile. Welche gerade gilt, bestimmt die Klimaanlage: Ich folge dem, was an ihr eingestellt ist.",
	"week.empty": "Für {mode} gibt es noch keine Profile.",
	"week.create": "Profile anlegen",
	"week.creating": "Lege an …",
	"tip.week_create.title": "Wie fange ich an?",
	"tip.week_create.text": "Ich schlage dir 6 Profile vor: Normal, Feiertag, Abwesend, Homeoffice und zwei freie – mit der Temperatur, die gerade eingestellt ist, und „Nachts aus“, wenn du das eingeschaltet hast. Danach passt du sie an. Gespeichert wird erst mit „Speichern“.",
	"week.profiles": "Profile",
	"tip.week_profiles.title": "Welches Profil bearbeite ich?",
	"tip.week_profiles.text": "Tipp auf ein Profil, um es darunter zu bearbeiten. An der Klimaanlage ändert sich dadurch nichts. Der grüne Punkt zeigt das Profil, das gerade läuft, die kleine Leiste den Verlauf von heute.",
	"week.running": "läuft gerade",
	"week.name": "Name",
	"tip.week_name.title": "Wie soll das Profil heißen?",
	"tip.week_name.text": "Nur für dich, z. B. „Früh raus“ oder „Gäste“. Höchstens 30 Zeichen.",
	"week.tags": "Wofür gilt dieses Profil?",
	"tip.week_tags.title": "Wann nimmt Joe dieses Profil?",
	"tip.week_tags.text": "**Normal**: an Arbeitstagen und am Wochenende, wenn jemand da ist. Genau ein Profil hat diesen Haken.\n**Feiertag**: an freien Werktagen. Ohne diesen Haken nehme ich „Normal“ mit dem Sonntagsverlauf.\n**Abwesend**: wenn alle eine Weile weg sind. Ohne diesen Haken gilt „Wenn keiner da ist“ auf der Karte.\n**Homeoffice**: an Arbeitstagen, an denen jemand laut Kalender zu Hause arbeitet.",
	"tip.week_tags.hint": "Jeder Haken sitzt an höchstens einem Profil. Setzt du ihn hier, wandert er vom anderen Profil hierher.",
	"week.tag.moved": "„{tag}“ kam von {from} – dort ist der Haken jetzt weg.",
	"week.normal_fixed": "„Normal“ braucht genau ein Profil. Setz den Haken bei einem anderen Profil, dann wandert er dorthin.",
	"week.no_normal": "Kein Profil hat den Haken „Normal“ – dann nehme ich Profil 1.",
	"week.untagged": "Ohne Haken nutze ich dieses Profil nicht von selbst – nur über „Profil von Hand“.",
	"week.days": "Tage",
	"tip.week_split.title": "Jeden Tag gleich?",
	"tip.week_split.text": "**Alle Tage gleich**: ein Verlauf für die ganze Woche.\n**Mo–Fr und Sa–So**: einer für Werktage, einer fürs Wochenende.\n**Jeder Tag einzeln**: sieben Verläufe.\nAufteilen kopiert den bisherigen Verlauf auf alle neuen Tage. Zusammenlegen behält den ersten (Montag bzw. Mo–Fr).",
	"week.split.all": "Alle Tage gleich",
	"week.split.week_weekend": "Mo–Fr und Sa–So",
	"week.split.each": "Jeder Tag einzeln",
	"week.split.split": "Aufgeteilt: Jeder Tag startet mit dem bisherigen Verlauf.",
	"week.split.merged": "Zusammengelegt: Es gilt jetzt der Verlauf von {first}.",
	"week.split.merged_days": "Zusammengelegt: Mo–Fr übernimmt den Montag, Sa–So den Samstag.",
	"week.group.all": "Alle Tage",
	"week.group.weekdays": "Mo–Fr",
	"week.group.weekend": "Sa–So",
	"week.today": "heute",
	"week.curve": "Verlauf {label}",
	"week.points": "Verlauf und Schaltpunkte",
	"tip.week_points.title": "Was ist ein Schaltpunkt?",
	"tip.week_points.text": "Ab dieser Uhrzeit gilt der Wert – bis zum nächsten Schaltpunkt. Der erste um 00:00 steht fest. Mit „aus“ geht die Klimaanlage aus, der nächste Punkt mit Temperatur schaltet sie wieder ein.\nDie Leiste zeigt den Tag von 0 bis 24 Uhr, der Strich ist jetzt. Tipp auf einen Tag, um seine Schaltpunkte zu sehen.",
	"tip.week_points.hint": "Höchstens 12 Schaltpunkte am Tag, Uhrzeiten in 5-Minuten-Schritten.",
	"week.limits": "Die Klimaanlage kann {min} bis {max} °C in Schritten von {step}.",
	"week.fitted": "Einige Werte lagen außerhalb dessen, was die Klimaanlage kann. Ich habe sie angepasst – „Speichern“ übernimmt das.",
	"week.night_time": "„Nachts aus“ ist an: Von {from} bis {until} bleibt die Klimaanlage aus, egal was hier steht.",
	"week.night_entity": "„Nachts aus“ ist an: Solange Nacht ist, bleibt die Klimaanlage aus – spätestens ab {until} gilt wieder der Plan.",
	"week.point.first": "Der Tag beginnt immer um 00:00.",
	"week.point.time": "Uhrzeit des Schaltpunkts",
	"week.point.value": "Temperatur ab {time}",
	"week.point.less": "{step} °C weniger",
	"week.point.more": "{step} °C mehr",
	"week.point.off": "Ab {time} aus",
	"week.point.delete": "Schaltpunkt um {time} löschen",
	"week.point.add": "Schaltpunkt",
	"tip.week_add.title": "Wo kommt der neue Schaltpunkt hin?",
	"tip.week_add.text": "In die Mitte des längsten Abschnitts, auf 15 Minuten gerundet, mit dem Wert davor. Danach stellst du Uhrzeit und Wert ein.",
	"week.point.max": "Mehr als 12 Schaltpunkte am Tag gehen nicht.",
	"week.point.no_room": "Hier ist kein Platz für einen weiteren Schaltpunkt.",
	"week.point.duplicate": "Um {time} gibt es schon einen Schaltpunkt.",
	"week.copy": "Kopieren nach …",
	"tip.week_copy.title": "Den Verlauf auf andere Tage übertragen?",
	"tip.week_copy.text": "Kopiert die Schaltpunkte dieses Tages auf die gewählten Tage. Deren bisheriger Verlauf wird ersetzt.",
	"week.copy.all": "alle anderen Tage",
	"week.copied": "Kopiert nach {days}.",
	"week.saving": "Speichere …",
	"week.unsaved": "Noch nicht gespeichert",
	"week.save_failed": "{mode} nicht gespeichert: {error}",
	"week.problem.count": "Es müssen genau 6 Profile sein.",
	"week.problem.tags": "Ein Haken sitzt an mehr als einem Profil.",
	"week.problem.curves": "Die Zahl der Verläufe passt nicht zu den Tagen.",
	"week.problem.points": "Ein Verlauf hat ungültige Schaltpunkte.",
	"tab.settings": "Einstellungen",
	"nav.label": "Bereiche",
	"nav.sections": "Unterbereiche",
	"nav.not_found": "Dieses Gerät finde ich nicht mehr. Vielleicht wurde es in Home Assistant umbenannt oder entfernt.",
	"nav.not_found.person": "Diese Person finde ich nicht mehr. Vielleicht wurde sie entfernt – hier stehen alle, die bei euch wohnen.",
	"nav.review.result": "Ergebnis",
	"nav.review.days": "Tage",
	"nav.review.learned": "Gelernt",
	"nav.review.log": "Protokoll",
	"past.result.title": "Was es |gebracht hätte",
	"past.result.lead": "Jeden Morgen spiele ich den Plan der Nacht mit dem echten Tag nach – einmal mit Plan, einmal ohne. Hier siehst du, was das Steuern gebracht hätte und wie gut ich jede Nacht lag.",
	"past.result.total": "Alle Nächte zusammen",
	"past.days.rebuild": "Verlauf neu einlesen →",
	"past.days.unknown": "Für {day} habe ich nichts aufgezeichnet.",
	"past.answer.given": "Eure Antwort: {answer}",
	"past.answer.change": "Ändern",
	"past.answer.ask": "Was war an diesem Tag?",
	"past.learned.group.sun": "Sonne",
	"past.learned.group.consumption": "Verbrauch",
	"past.learned.group.devices": "Geräte",
	"past.learned.group.household": "Haushalt",
	"past.learned.weather": "Wetter-Entität",
	"past.learned.weather.missing": "noch keine gewählt",
	"past.learned.presence.usual": "kommt an Tagen wie heute meist gegen {time} heim",
	"past.learned.presence.no_calendar": "Ohne Kalender weiß ich nicht, was für ein Tag für diese Person ansteht.",
	"past.learned.climate": "Heizung & Klima",
	"past.learned.climate.say": "So schnell wird ein Raum wieder warm (beim Kühlen: kühl), wenn ich ihn nach dem Absenken zurückstelle. Daran sehe ich, wie früh ich anfangen muss.",
	"past.learned.climate.rate": "{rate} °C pro Stunde",
	"past.learned.climate.none": "Sobald ich Heizung oder Klima steuere, lerne ich hier, wie schnell jeder Raum warm oder kühl wird.",
	"past.learned.climate.open": "Zu Heizung & Klima →",
	"tip.learn_climate.title": "Was ist die Aufheizrate?",
	"tip.learn_climate.text": "Stelle ich einen Raum nach dem Absenken zurück, messe ich, wie lange er bis zur Wunschtemperatur braucht. Jede neue Messung fließt ins Mittel ein, die älteren zählen weiter mit. Bis ich einen Raum kenne, rechne ich mit 1,5 °C pro Stunde.",
	"past.log.title": "Was ich |geschaltet habe",
	"past.log.lead": "Alles, was ich an Speichern, Autos, Warmwasser, deinen Geräten und Klimageräten umgestellt habe – das Neueste oben. Tipp auf einen Bereich, um nur ihn zu sehen.",
	"past.log.filters": "Bereiche",
	"past.log.devices": "Geräte",
	"past.log.all": "Alle",
	"past.log.filter.battery": "Speicher",
	"past.log.filter.climate": "Heizung & Klima",
	"past.log.filter.car": "Auto & Laden",
	"past.log.filter.hot_water": "Warmwasser",
	"past.log.filter.other": "Weitere Geräte",
	"past.log.filter.joe": "Joe selbst",
	"past.log.empty": "Noch nichts – sobald ich steuere, teste oder ein Klimagerät umstelle, steht es hier.",
	"past.log.empty_filter": "Hier habe ich noch nichts geschaltet.",
	"past.log.partial": "Gerade sehe ich nur die letzten Einträge.",
	"tip.past_log.title": "Was steht im Protokoll?",
	"tip.past_log.text": "Jede Schaltung von mir mit Uhrzeit: an Speichern, Autos, Warmwasser, deinen Geräten und Klimageräten, dazu Testläufe, deine Antworten und wann eine Nacht beginnt. Was du selbst am Gerät änderst, steht nicht hier – außer ich bemerke es, während ich steuere.",
	"nav.devices.all": "Alle",
	"nav.devices.climate": "Heizung & Klima",
	"nav.devices.battery": "Speicher",
	"nav.devices.car": "Auto & Laden",
	"nav.devices.hot_water": "Warmwasser",
	"nav.devices.other": "Weitere Geräte",
	"nav.devices.grid": "Netz & Sonne",
	"nav.back": "← {name}",
	"nav.household.people": "Wer wohnt hier",
	"nav.household.presence": "Wer ist da",
	"nav.household.days": "Tage & Kalender",
	"nav.household.night": "Nachtruhe",
	"nav.household.travel": "Unterwegs & Wetter",
	"nav.settings.operation": "Betrieb",
	"nav.settings.rules": "Regeln",
	"nav.settings.notify": "Benachrichtigungen",
	"nav.settings.maintenance": "Wartung & Sichern",
	"nav.settings.about": "Über Joe",
	"signpost.title": "Suchst du …?",
	"signpost.placeholder": "z. B. Speicher, Strompreis, Gastmodus",
	"signpost.none": "Dazu finde ich nichts. Versuch ein anderes Wort – oder schau in die Reiter oben.",
	"signpost.more": "Noch {count} weitere – schreib ein Wort mehr dazu.",
	"tip.signpost.title": "Wo finde ich was?",
	"tip.signpost.text": "Tipp ein, was du suchst – auch mit alten Namen wie Historie, Lernen oder Für Profis. Ich zeige dir, wo es jetzt wohnt, und ein Tipp auf den Treffer bringt dich hin.",
	"tip.signpost.hint": "Unter Einstellungen steht nur noch, wie ich selbst arbeite. Alles mit Strom steht unter Geräte, Menschen und Alltag unter Haushalt.",
	"signpost.overview": "Übersicht",
	"signpost.overview.terms": "Start, Startseite, Gerade jetzt, Joe tut gerade, Joe braucht dich, Noch offen, So geht's weiter, Schnell, Die letzten 7 Tage",
	"signpost.plan": "Plan für heute Nacht",
	"signpost.plan.terms": "Plan, heute Nacht, Nacht, Ladeplan, Ziel, Neu rechnen, So habe ich gerechnet, Was heute Nacht läuft, Nacht-Aktionen, Preise",
	"signpost.steer": "Steuern heute Nacht",
	"signpost.steer.terms": "Ja mach, Heute nicht, Heute aussetzen, aussetzen, Doch steuern, Abendfrage, Testlauf fehlt",
	"signpost.result": "Was es gebracht hätte",
	"signpost.result.terms": "Ergebnis, Ersparnis, gespart, Simulation, Wie gut ich lag, Kosten, Geld",
	"signpost.days": "Jeder Tag",
	"signpost.days.terms": "Historie, Verlauf, Tage, Tag, Stunden, Tagesfrage, Nachgespielt, Ladezustand, Gestern",
	"signpost.learned": "Was Joe gelernt hat",
	"signpost.learned.terms": "Lernen, Gelernt, Gedächtnis, Prognose-Faktor, Zeitversatz, Verbrauch und Wetter, Aufheizrate, Wer wann zu Hause ist",
	"signpost.learned_reset": "Neu anfangen",
	"signpost.learned_reset.terms": "Gelerntes löschen, vergessen, zurücksetzen, von vorn lernen",
	"signpost.log": "Protokoll",
	"signpost.log.terms": "Log, Was ich geschaltet habe, geschaltet, Klima-Protokoll, Befehle",
	"signpost.devices": "Alle Geräte",
	"signpost.devices.terms": "Geräte, Was Joe nutzt, Neu gefunden, Sofort freigeben, Deine Antworten, Prüfhinweise, Nacht-Aktion, Nacht-Aktionen",
	"signpost.add": "Gerät hinzufügen",
	"signpost.add.terms": "Hinzufügen, neues Gerät, Nacht-Aktion anlegen, Aktion, Nochmal umschauen, Gerät suchen",
	"signpost.battery": "Speicher",
	"signpost.battery.terms": "Akku, Batterie, Hausspeicher, Testlauf, Regler, Regler einrichten, Kapazität, Akkugröße, Entladegrenze, Störenfriede, Automationen am Speicher",
	"signpost.battery_team": "Mehrere Speicher",
	"signpost.battery_team.terms": "Mehrere Speicher, nacheinander, gleichzeitig, Reihenfolge, Interlock, gegenseitig laden, Hierarchie, zwei Speicher, Nulleinspeisung, Regelt sich selbst, Entladeschluss",
	"signpost.climate": "Heizung & Klima",
	"signpost.climate.terms": "Klima, Heizung, Klimaanlage, Thermostat, Heizkörper, Wochenprofil, Heizprofil, Raum, Absenken, Wenn keiner da ist, Messgeräte",
	"signpost.car": "Auto & Laden",
	"signpost.car.terms": "E-Auto, Elektroauto, Auto, Wallbox, Laden, Ladestand, Reichweite, Laden nach Bedarf, Termine des Autos, Postfach, Konto, Einladungen, Jetzt laden",
	"signpost.hot_water": "Warmwasser",
	"signpost.hot_water.terms": "Boiler, Heizstab, Warmwasser-Wärmepumpe, Duschen, Speichertemperatur",
	"signpost.other": "Weitere Geräte",
	"signpost.other.terms": "Deine Geräte, Verbraucher, Steckdose, Zwischenstecker, Waschmaschine, Trockner, Spülmaschine, Geräte zuordnen, Pool",
	"signpost.energy": "Netz & Sonne",
	"signpost.energy.terms": "Energie-Dashboard, Energie, Zähler, Strom",
	"signpost.connection": "Netzanschluss",
	"signpost.connection.terms": "Netz, Netzzähler, Einspeisung, Bezug, Umdrehen, Vorzeichen",
	"signpost.tariff": "Stromtarif",
	"signpost.tariff.terms": "Strompreis, Tarif, Preis, Börsenpreis, dynamischer Tarif, Tibber, Aufschlag, Einspeisevergütung, Netzentgelt, Arbeitspreis",
	"signpost.solar": "Solaranlage",
	"signpost.solar.terms": "PV, Photovoltaik, Solar, Sonne, Solarprognose, Prognose, Forecast.Solar, Solcast, Prognosen kombinieren, PV-Leistung, Wechselrichter",
	"signpost.home": "Hausverbrauch",
	"signpost.home.terms": "Verbrauch, Haus, Grundlast, Verbrauchssensor",
	"signpost.people": "Wer wohnt hier",
	"signpost.people.terms": "Haushalt, Personen, Person, Familie, Bewohner, Kalender einer Person, Weggelassen",
	"signpost.presence": "Wer ist da",
	"signpost.presence.terms": "Anwesenheit, zu Hause, abwesend, Jemand zu Hause, Anwesenheitsgruppe, Helfer, Als abwesend nach",
	"signpost.guest": "Gastmodus",
	"signpost.guest.terms": "Gast, Gäste, Besuch, Babysitter",
	"signpost.way": "Heimweg",
	"signpost.way.terms": "Fahrzeit, nach Hause, Proximity, Ankunft, übliche Heimkehr",
	"signpost.calendar": "Tage & Kalender",
	"signpost.calendar.terms": "Feiertage, Homeoffice, Arbeitstag, freier Tag, Urlaub, Ferien, Schule, Kalender-Regeln, Stichwörter, Tagesart, Heute",
	"signpost.night": "Nachtruhe",
	"signpost.night.terms": "Schlafen, nachts, Wann ist nachts, Schlafenszeit, Nachts aus",
	"signpost.travel": "Unterwegs & Wetter",
	"signpost.travel.terms": "Wetter, Entfernungen, Entfernungen zu Terminen, Routendienst, Waze, Google, OpenStreetMap, Strecke",
	"signpost.mode": "Betriebsart",
	"signpost.mode.terms": "Modus, Simulation, Vorschlagen, Live, Aus, Pause, anhalten, steuern lassen, Betrieb",
	"signpost.grid_friendly": "Netzdienlich verhalten",
	"signpost.grid_friendly.terms": "netzdienlich, Was geht vor, Mittagssonne",
	"signpost.rules": "Regeln",
	"signpost.rules.terms": "Für Profis, Profi, Experte, Feinheiten, Startwert",
	"signpost.rule_reserve_soc.terms": "Mindestladung, nie unter, Reserve im Speicher",
	"signpost.rule_max_target_soc.terms": "Ladegrenze, maximal laden, höchstens bis",
	"signpost.rule_evening_min_soc.terms": "abends voll, Abendreserve",
	"signpost.rule_balance_days.terms": "Kalibrieren, voll laden, Balancing, Zellausgleich",
	"signpost.rule_discharge_in_window.terms": "entladen, günstige Zeit, Entladen sperren",
	"signpost.rule_converter_losses.terms": "Wechselrichter, Verluste, Wirkungsgrad",
	"signpost.rule_day_surplus.terms": "Überschuss, evcc, Fußbodenheizung, Tagsüber, Drosseln, PV-Überschuss, Ladeleistung begrenzen",
	"signpost.rule_grid_limit_w.terms": "Anschlussleistung, Leistungsgrenze",
	"signpost.rule_max_night_kwh.terms": "kWh pro Nacht, Menge pro Nacht",
	"signpost.rule_guard_grid.terms": "Hauptsicherung, Sicherung, Überlast",
	"signpost.rule_max_price.terms": "zu teuer, Preisgrenze",
	"signpost.rule_min_saving.terms": "lohnt sich, Mindestgewinn",
	"signpost.rule_priority.terms": "Reihenfolge, Vorrang",
	"signpost.rule_buffer_factor.terms": "Puffer, Wieder selbst lernen, Aufschlag",
	"signpost.rule_plan_offset_min.terms": "fester Plan, Uhrzeit",
	"signpost.rule_reset_lead_min.terms": "Vorlauf, zurückschalten",
	"signpost.notify": "Benachrichtigungen",
	"signpost.notify.terms": "Handy, Nachricht, Push, App, Abends fragen, Probleme melden, Morgens berichten, Mitteilung",
	"signpost.ask_time.terms": "Uhrzeit der Frage, abends fragen um, Fragezeit",
	"signpost.observe": "Beobachten",
	"signpost.observe.terms": "Aufzeichnung, Verlauf neu einlesen, Neu einlesen, Recorder",
	"signpost.backup": "Sichern",
	"signpost.backup.terms": "Export, Import, Sicherung, Datei, Umzug, Backup",
	"signpost.setup": "Einrichtung neu starten",
	"signpost.setup.terms": "Ersteinrichtung, Assistent, von vorn, Neustart, Einrichtung",
	"signpost.diagnostics": "Diagnose",
	"signpost.diagnostics.terms": "Fehler melden, Fehlerbericht, Diagnose herunterladen, Debug, Problem",
	"signpost.about": "Über Joe",
	"signpost.about.terms": "Version, Home-Assistant-Version, Update, Info",
	"signpost.entities": "Joes Entitäten",
	"signpost.entities.terms": "Entitäten, Sensoren, Automationen, Schalter, eigene Automationen, Skripte",
	"signpost.cards": "Dashboard-Karten",
	"signpost.cards.terms": "Karte, Karten, Lovelace, Dashboard, eigenes Dashboard",
	"ha.open.device": "{name} in Home Assistant öffnen",
	"ha.open.entity": "{name} in Home Assistant anzeigen",
	"mirror.change": "Ändern →",
	"mirror.set": "Einstellen →",
	"usedby.label": "Wird genutzt von:",
	"usedby.none": "Wird noch von nichts genutzt.",
	"usedby.climate": "Heizung & Klima",
	"usedby.plan": "Plan",
	"usedby.learn": "Gelernt – wer wann zu Hause ist",
	"usedby.consumption": "Gelernt – Verbrauch",
	"usedby.car": "Laden nach Bedarf – {name}",
	"usedby.way": "Heimweg",
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
	"onb.group.devices": "Geräte",
	"onb.group.devices.lead": "Was Strom liefert, speichert oder braucht.",
	"onb.group.household": "Haushalt",
	"onb.group.household.lead": "Wer hier wohnt und was euren Alltag bestimmt.",
	"onb.part.weather": "Wetter",
	"onb.part.holiday": "Feiertage",
	"onb.car.wallbox": "Wallbox",
	"onb.car.car": "Auto",
	"onb.car.meter": "Zähler im Energie-Dashboard",
	"onb.car.none": "Habt ihr ein E-Auto, frag ich dich gleich danach.",
	"onb.other.none": "Geräte mit eigenem Zähler im Energie-Dashboard tauchen hier auf.",
	"onb.people.none": "Wer hier wohnt, frag ich dich gleich.",
	"onb.done.homes": "So geht's weiter: Jede Zeile wohnt nach dem Start an einem festen Ort. Ein Tipp auf den Ort startet Joe und bringt dich hin.",
	"onb.scan.energy.none": "Ein Energie-Dashboard habe ich nicht gefunden. Kein Problem – ich suche auch so nach deinen Geräten.",
	"scan.looking": "Ich schau mich um …",
	"scan.title": "Das hab ich |gefunden",
	"scan.lead": "Damit arbeite ich ab jetzt. Passt etwas nicht, ändere es oder lass es weg – was du einstellst, überschreibe ich nie.",
	"scan.again": "Nochmal suchen",
	"scan.why": "Warum?",
	"scan.failed": "Beim Umschauen ist etwas schiefgegangen. Versuch es nochmal.",
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
	"onb.done.title": "Alles klar, |Partner.",
	"onb.done.lead": "Ich plane ab heute jede Nacht, steuere aber nichts. Nach einer Woche zeige ich dir, was es gebracht hätte.",
	"onb.done.go": "Joe starten",
	"onb.done.change": "Noch was ändern",
	"onb.nav": "Einrichtung: zurück oder weiter",
	"onb.next": "Weiter",
	"onb.back": "Zurück",
	"overview.night": "Heute Nacht",
	"overview.night.empty.title": "Noch kein |Plan",
	"overview.night.empty.text": "Sobald ich deine Speicher und deinen Tarif kenne, rechne ich hier jede Nacht aus, wie viel ich lade – und warum.",
	"plan.day": "Netzdienlich: Bis {time} Uhr geht die Morgensonne ins Netz (etwa {kwh} kWh), dann lädt der Speicher in der Mittagsspitze.",
	"plan.day.buffer": "Netzdienlich: Ich lade erst bis {level} % als Puffer für dich, dann bekommt das Netz die Morgensonne (etwa {kwh} kWh), ab {time} Uhr lade ich voll.",
	"plan.day.cost": "Kostet etwa {cost}.",
	"plan.title": "Hier |rechne ich",
	"history.title": "Jeder Tag |unter der Lupe",
	"settings.operation": "Betrieb",
	"settings.mode": "Betriebsart",
	"settings.setup": "Einrichtung",
	"settings.setup.hint": "Den Assistenten noch einmal von vorn durchgehen.",
	"settings.setup.restart": "Neu starten",
	"settings.about": "Über Joe",
	"settings.backup": "Sichern",
	"settings.backup.export": "Einstellungen exportieren",
	"settings.backup.export.hint": "Alles, was du eingestellt hast und was ich gelernt habe, als Datei.",
	"settings.backup.download": "Herunterladen",
	"settings.backup.import": "Einstellungen importieren",
	"settings.backup.import.hint": "Eine exportierte Datei zurückspielen – ersetzt alle Einstellungen.",
	"settings.backup.choose": "Datei wählen",
	"settings.backup.confirm": "„{file}“ (exportiert {when}) ersetzt alle Einstellungen und alles Gelernte. Wirklich?",
	"settings.backup.replace": "Ersetzen",
	"settings.backup.exported": "Die Datei ist heruntergeladen.",
	"settings.backup.imported": "Eingespielt – ich arbeite ab jetzt mit diesen Einstellungen.",
	"settings.backup.not_ours": "Das ist keine Sicherung von Energy Joe.",
	"settings.backup.failed": "Hat nicht geklappt: {error}",
	"tip.backup_export.title": "Was steht in der Datei?",
	"tip.backup_export.text": "Alle Einstellungen – Speicher, Tarif, Geräte, Haushalt, Regeln, Klima – und was ich gelernt habe. Passwörter und Anmeldungen von Postfächern stehen nicht darin; die musst du nach einem Umzug neu eingeben.",
	"tip.backup_export.hint": "Gut vor größeren Änderungen oder zum Umzug auf ein anderes Home Assistant.",
	"tip.backup_import.title": "Was passiert beim Import?",
	"tip.backup_import.text": "Ich prüfe die Datei zuerst. Ist sie in Ordnung, ersetzt sie alle Einstellungen und alles Gelernte; ist sie es nicht, bleibt alles, wie es ist. Stammt sie von einem anderen Home Assistant, prüf danach die Geräte – die Entitäten können dort anders heißen.",
	"settings.version": "Version",
	"settings.ha": "Home Assistant",
	"settings.energy": "Energie-Dashboard",
	"settings.energy.sources": "Netz: {grid} · PV-Anlagen: {solar} · Speicher: {battery} · Geräte: {devices}",
	"settings.energy.none": "nicht eingerichtet",
	"settings.mode.now": "Gerade läuft: {mode}.",
	"settings.mode.open": "Betriebsart ändern …",
	"tip.mode_open.title": "Wo stelle ich um?",
	"tip.mode_open.text": "Umschalten geht an einer Stelle: über den Knopf oben in der Kopfzeile. Dieser Knopf hier öffnet denselben Dialog. Dort siehst du auch, welche Speicher noch einen Testlauf brauchen.",
	"settings.rules.intro": "Feinheiten für die Nacht. Die Startwerte passen für die meisten – ändern musst du hier nichts. Hast du einen Wert geändert, holt „Startwert“ den alten zurück.",
	"settings.rules.group.battery": "Speicher",
	"settings.rules.group.grid": "Netz & Preis",
	"settings.rules.group.plan": "Planung",
	"settings.setup.again": "Einrichtung neu starten",
	"settings.maintenance.diagnostics": "Diagnose für eine Fehlermeldung",
	"settings.maintenance.diagnostics.hint": "Die Datei holst du in Home Assistant: Einstellungen › Geräte & Dienste › Energy Joe, dann im Menü ⋮ „Diagnose herunterladen“.",
	"settings.maintenance.diagnostics.open": "Energy Joe in HA öffnen",
	"tip.diagnostics.title": "Wozu die Diagnose?",
	"tip.diagnostics.text": "Wenn etwas nicht klappt und du einen Fehler meldest, hilft diese Datei beim Suchen. Sie zeigt, was ich weiß und vorhabe. Namen von Personen, Kalender und Postfach-Adressen ersetze ich vorher durch Platzhalter.",
	"tip.diagnostics.hint": "Schau die Datei kurz durch, bevor du sie weitergibst.",
	"settings.about.entities": "Joes Entitäten",
	"settings.about.entities.intro": "Diese Entitäten lege ich in Home Assistant an. Du kannst sie in eigenen Automationen, Skripten und Dashboards nutzen.",
	"settings.about.entities.none": "In Home Assistant gibt es noch keine Entitäten von mir. Sie kommen, sobald die Integration läuft.",
	"settings.about.group.control": "Schalter & Auswahl",
	"settings.about.group.button": "Knöpfe",
	"settings.about.group.value": "Werte",
	"settings.about.group.calendar": "Kalender",
	"settings.about.group.other": "Weitere",
	"tip.about_entities.title": "Was kann ich damit machen?",
	"tip.about_entities.text": "Mit „Betriebsart“ schaltest du mich aus einer Automation um, mit „Heute Nacht aussetzen“ lässt du eine Nacht aus. „Status“, „Ziel heute Nacht“ und „Hätte gespart“ kannst du anzeigen oder als Auslöser nutzen. „Neu planen“ und „Sofort freigeben“ sind Knöpfe für Skripte und Dashboards.",
	"tip.about_entities.hint": "Der Knopf mit dem Pfeil zeigt die Entität in Home Assistant, mit ihrem Verlauf.",
	"settings.about.cards": "Dashboard-Karten",
	"settings.about.cards.intro": "Zwei Karten für deine eigenen Dashboards. Im Dashboard auf „Bearbeiten“, dann „Karte hinzufügen“ und nach „Energy Joe“ suchen – oder den Typ unten im Code-Editor eintragen.",
	"settings.about.cards.night": "Joe heute Nacht",
	"settings.about.cards.night.hint": "Was ich heute Nacht vorhabe und was es kostet, mit dem Schalter „Heute aussetzen“. Ein Tipp auf den Kopf öffnet den Plan.",
	"settings.about.cards.car": "Auto laden",
	"settings.about.cards.car.hint": "Ladestand und Reichweite deiner Autos, mit „Jetzt laden“ und „Heute Nacht laden bis“. Ein Tipp auf den Kopf öffnet die Autoseite.",
	"tip.label": "Erklärung",
	"tip.hint": "Tipp",
	"tip.ha_open.title": "Wozu ist der Knopf mit dem Pfeil?",
	"tip.ha_open.text": "Der runde Knopf mit dem Pfeil nach außen öffnet das Gerät in Home Assistant. Dort benennst du es um, ordnest es einem Raum zu oder siehst alle seine Werte.\nHat es in Home Assistant keine eigene Geräteseite, zeigt der Knopf das Infofenster der Entität. In Joe ändert der Knopf nichts.",
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
	"tip.start.text": "Ich plane ab heute jede Nacht – als Simulation, also ohne etwas zu schalten. Alles, was du eingegeben hast, kannst du jederzeit ändern – dort, wo es hingehört: unter Geräte, Haushalt oder Einstellungen.",
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
	"review.invert": "Umdrehen",
	"review.keep": "Stimmt so",
	"review.ignored": "lasse ich weg",
	"review.capacity_unknown": "Größe unbekannt",
	"review.battery": "Speicher",
	"review.battery.none": "Keinen Speicher gefunden. Hast du einen, such ihn dir aus.",
	"review.tariff.ask": "Den Tarif frag ich dich gleich – oder trag ihn jetzt ein.",
	"review.forecast.none": "Ohne Solarprognose plane ich vorsichtig. Richte in Home Assistant zum Beispiel Forecast.Solar ein, dann such ich nochmal.",
	"review.grid.none": "Ohne Netzzähler sehe ich nicht, was wirklich passiert. Such dir den Sensor aus, der die Leistung am Hausanschluss misst.",
	"review.home.balance": "Wie im Energie-Dashboard: Netz + PV ± Speicher",
	"review.home.devices": "Geräte zuordnen",
	"review.home.compare": "Zum Vergleich: {name} · {live}",
	"review.home.flexible": "Für den Speicher rechne ich heraus: {names}. Das Auto lade ich nie aus dem Hausspeicher.",
	"review.home.flexible_some": "Für den Speicher rechne ich heraus: {names}.",
	"review.home.flexible_none": "Laufen bei dir Geräte nur mit Sonnenüberschuss oder günstigem Strom? Sag es mir unter Geräte › Weitere Geräte – dann plane ich den Speicher ohne sie.",
	"review.home.off": "In den letzten {days} Tagen zeigt dein Sensor {pct} % {direction} als Netz + PV ± Speicher. Fehlt darin vielleicht eine kleine PV-Anlage? Ich rechne mit Netz + PV ± Speicher.",
	"review.home.less": "weniger",
	"review.home.more": "mehr",
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
	"pick.empty": "Hier passt nichts. Tipp unten auf „Alle zeigen“ oder such nach einem anderen Wort.",
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
	"ask.topic.climate": "Klima",
	"ask.topic.home_office": "Homeoffice",
	"ask.later": "Später",
	"ask.later.marked": "Später beantworten",
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
	"q.climate.title": "Soll ich Heizung |& Klima regeln?",
	"q.climate.yes": "Ja, gern",
	"q.climate.no": "Nein, mach ich selbst",
	"q.climate.hint": "Welche Thermostate und Klimageräte ich regeln darf, wählst du später unter Geräte › Heizung & Klima. Bis dahin ändere ich nichts.",
	"q.climate.on": "Gut. Welche Thermostate und Klimageräte ich regeln darf, wählst du nach dem Start unter Geräte › Heizung & Klima – jedes einzeln.",
	"q.home_office.title": "Ist Homeoffice bei euch |der normale Arbeitstag?",
	"q.home_office.yes": "Ja, meistens zu Hause",
	"q.home_office.no": "Nein, meistens im Büro oder unterwegs",
	"q.home_office.hint": "Das gilt für Arbeitstage ohne passenden Termin im Kalender. Was im Kalender steht, geht vor. Ändern kannst du es unter Haushalt › Tage & Kalender.",
	"q.ev.offer": "Soll ich das Auto nachts in der günstigen Zeit laden, wenn morgen die Sonne nicht reicht? Dazu brauche ich, was das Laden schaltet – zum Beispiel deine Wallbox.",
	"q.ev.has_action": "Das Laden steuere ich mit „{name}“.",
	"q.ev.set_up": "Laden einrichten",
	"q.ev.edit": "Ansehen oder ändern",
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
	"f.battery.floor": "Entladegrenze",
	"f.battery.floor.read": "Am Gerät eingestellt: {value} %. Leer lassen, dann nehme ich diesen Wert; eine eigene Zahl gilt stattdessen.",
	"f.battery.floor.ask": "Ich kann die Grenze am Gerät nicht auslesen. Bis wie viel Prozent darf der Speicher entladen werden?",
	"plan.note.floor_unknown": "Bei einem Speicher kenne ich die Entladegrenze nicht – ich rechne dort mit der Reserve aus den Regeln.",
	"tip.f_battery_floor.title": "Bis wohin darf er entladen?",
	"tip.f_battery_floor.text": "Unter diesen Ladestand geht der Speicher nicht – so ist er am Gerät eingestellt (bei Fronius „Mindestreserve“, beim Marstek „Discharge Cutoff“). Ich lese den Wert aus und rechne damit, wie viel Energie wirklich nutzbar ist. Trägst du eine Zahl ein, gilt deine.",
	"tip.f_battery_floor.hint": "Die Reserve aus den Regeln bleibt die Untergrenze für alle Speicher.",
	"f.battery.max_charge": "Laden",
	"f.battery.max_discharge": "Entladen",
	"f.battery.priority": "Reihenfolge",
	"f.battery.control": "Steuern",
	"edit.tariff.label": "Tarif bearbeiten",
	"edit.battery.label": "Speicher bearbeiten",
	"edit.battery.title": "Speicher |einstellen",
	"edit.tariff.title": "Dein |Stromtarif",
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
	"household.people.title": "Wer |wohnt hier?",
	"household.people.lead": "Die Leute, die hier wohnen, mit ihren Kalendern. Daraus weiß ich, wer zu Hause ist, was für ein Tag ist und für wen das Auto laden soll.",
	"household.people.list": "Personen",
	"household.people.today": "Heute: {label}",
	"household.people.tomorrow": "Morgen: {label}",
	"household.people.rules": "Kalender-Regeln",
	"household.people.rules.own": "eigene",
	"household.people.rules.shared": "wie für alle",
	"household.people.counts": "Termine zählen für:",
	"household.people.counts.none": "Die Termine zählen noch für kein Auto.",
	"household.people.learned": "Gelernt",
	"household.people.learned.none": "noch nichts – dafür braucht es ein paar Tage",
	"household.people.usual": "kommt meist gegen {time} heim",
	"household.people.more": "Mehr im Rückblick →",
	"household.presence.title": "Wer ist |da?",
	"household.presence.lead": "Wer gerade zu Hause ist und wer heimkommt. Das sagt mir ein einziger Helfer „Jemand zu Hause“ – mit Gastmodus auch für alle ohne Handy.",
	"household.presence.now": "Gerade zu Hause",
	"household.days.not_found": "Diese Person finde ich nicht mehr. Die Regeln unten gelten für alle.",
	"household.presence.way": "Heimweg",
	"household.presence.way.say": "Kommt jemand heim, fahre ich die Räume rechtzeitig wieder hoch. Dafür schaue ich, wie weit die Person weg ist und wie lange die Fahrt noch dauert.",
	"household.presence.routing": "Routendienst",
	"household.days.title": "Tage & |Kalender",
	"household.days.lead": "Was für ein Tag ist – Arbeitstag, frei oder Homeoffice. Das lese ich aus deinem Arbeitstag-Sensor und aus euren Kalendern.",
	"household.days.preview": "Heute und morgen",
	"household.days.preview.today": "Heute",
	"household.days.preview.tomorrow": "Morgen",
	"household.days.preview.workday": "Morgen ist ein Arbeitstag.",
	"household.days.preview.day_off": "Morgen ist frei.",
	"household.days.preview.person": "{name}: {label}",
	"household.days.preview.unknown": "Was für ein Tag heute ist, sehe ich noch nicht.",
	"household.days.preview.no_plan": "Morgen sehe ich, sobald der Plan für heute Nacht steht.",
	"household.days.free": "Freie Tage",
	"household.days.no_calendars": "Noch hat niemand einen Kalender. Ohne Kalender greifen die Regeln nicht.",
	"household.days.to_people": "Kalender zuordnen →",
	"household.days.own_rules": "hat eigene Regeln",
	"household.night.title": "Wann ist |Nachtruhe?",
	"household.night.lead": "Nachtruhe heißt: Ihr liegt im Bett. Geräte mit „Nachts aus“ schalten dann ab und sind morgens rechtzeitig wieder angenehm.",
	"household.night.source": "So erkenne ich die Nacht",
	"household.night.devices": "Geräte mit „Nachts aus“",
	"household.night.devices.none": "Noch hat kein Gerät „Nachts aus“ eingeschaltet. Das stellst du am Gerät unter Geräte › Heizung & Klima ein.",
	"household.night.span": "{from}–{until} Uhr",
	"household.night.until": "spätestens um {until} Uhr wieder angenehm",
	"household.night.not_steered": "steuere ich gerade nicht",
	"household.night.to_climate": "Zu Heizung & Klima →",
	"household.travel.title": "Unterwegs & |Wetter",
	"household.travel.lead": "Das Wetter für Verbrauch und Heizung, und wie ich Entfernungen ausrechne – für Autofahrten und den Heimweg.",
	"tip.household_days_preview.title": "Was zeigt die Vorschau?",
	"tip.household_days_preview.text": "So sehe ich heute und morgen: Arbeitstag oder frei, wer laut Kalender im Homeoffice ist, und welche Situation gilt – Normal, Feiertag, Abwesend oder Homeoffice. Danach richten sich der Plan, das Laden nach Bedarf und die Profile der Heizung.\nMorgen kenne ich, sobald der Plan für heute Nacht gerechnet ist.",
	"tip.household_days_preview.hint": "Weiter als bis morgen schaue ich noch nicht.",
	"tip.household_remove.title": "Was heißt „Wohnt nicht hier“?",
	"tip.household_remove.text": "Ich lasse die Person weg: Ihre Anwesenheit und ihre Kalender zählen dann nicht mehr. In Home Assistant ändert sich nichts.\nDu kannst sie jederzeit unter „Weggelassen“ zurückholen.",
	"tip.household_left_out.title": "Wen habe ich weggelassen?",
	"tip.household_left_out.text": "Personen aus Home Assistant, die du mit „Wohnt nicht hier“ weggelassen hast. Ein Tipp auf den Namen holt die Person mit ihren Kalendern zurück.",
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
	"sum.climate": "Heizung & Klima regeln",
	"sum.yes": "ja",
	"sum.no": "nein",
	"sum.home_office": "Normaler Arbeitstag",
	"sum.home_office.yes": "Homeoffice",
	"sum.home_office.no": "Büro oder unterwegs",
	"sum.weather": "Wetter",
	"sum.holiday": "Feiertage",
	"sum.later": "später",
	"sum.lives_at": "wohnt unter",
	"rule.reserve_soc": "Reserve",
	"rule.converter_losses": "Wandlerverluste beim Netzladen mitrechnen",
	"rule.converter_losses.hint": "Am Netzzähler gemessen – für Speicher, deren eigene Messung hinter dem Wechselrichter sitzt.",
	"learn.battery.converter": "{value} % vom Netzstrom kommen beim Laden an",
	"tip.r_converter_losses.title": "Was sind Wandlerverluste?",
	"tip.r_converter_losses.text": "Manche Speicher melden ihre Leistung auf der Gleichstrom-Seite (z. B. ein BYD am Fronius). Dann fehlen in meiner Messung die Verluste des Wechselrichters, wenn er Netzstrom zum Laden umwandelt. Ich messe sie in Nächten mit Netzladen ohne Sonne am Netzzähler nach. Ist der Schalter an, rechne ich sie beim Laden und Entladen mit ein – Netzladen lohnt sich dann etwas seltener.",
	"tip.r_converter_losses.hint": "Erst nach 5 solchen Nächten habe ich einen Wert; bis dahin ändert der Schalter nichts. Für Speicher am Wechselstrom (z. B. Marstek) ist er nicht nötig.",
	"rule.day_surplus": "Tagsüber Überschuss abgeben",
	"rule.day_surplus.hint": "An sonnigen Tagen laden die Speicher nur so schnell, wie sie müssen – der Rest der Sonne bleibt für evcc (z. B. Auto oder Fußbodenheizung im PV-Modus).",
	"tip.r_day_surplus.title": "Was heißt „Tagsüber Überschuss abgeben“?",
	"tip.r_day_surplus.text": "Normalerweise schlucken die Speicher morgens die ganze Sonne und sind mittags voll – erst dann sieht evcc Überschuss. Ist der Schalter an, bremse ich das Laden der Speicher: Sie laden nur so schnell, dass sie trotzdem voll sind, bevor die Sonne am Abend nicht mehr fürs Haus reicht. Den Rest sieht evcc am Netzzähler, und ein Ladepunkt im PV-Modus (z. B. die Fußbodenheizung) läuft damit den ganzen Tag.\nBleibt die Sonne hinter der Vorhersage zurück, lade ich sofort schneller; reicht sie gar nicht mehr, lasse ich ganz los.",
	"tip.r_day_surplus.hint": "Nur wenn ein evcc-Ladepunkt auf PV oder Min+PV steht und Strom nehmen kann, nur bei Speichern mit einer Ladegrenze in W oder kW und bestandenem Testlauf und nur im Live-Betrieb. Abends ist alles wieder wie vorher.",
	"rule.transfer_guard": "Speicher-Wächter",
	"rule.transfer_guard.hint": "Laden sich zwei Speicher gegenseitig (einer lädt, der andere entlädt), greife ich ein.",
	"tip.r_transfer_guard.title": "Was macht der Speicher-Wächter?",
	"tip.r_transfer_guard.text": "Speicher-Wächter: Ich greife ein, wenn sich Speicher gegenseitig laden. Lädt einer mit mehr als 20 W, während ein anderer mit mehr als 20 W entlädt, und das 20 Sekunden lang, starte ich zuerst die Regelung des Speichers neu, der meistens schuld ist (beim Marstek die Regelung von Omnibattery). Hilft das nach 20 Sekunden nicht, sperre ich bei ihm kurz die Richtung, in die er gerade läuft – 5 Sekunden lang. Läuft es dann immer noch gegeneinander, melde ich mich bei dir.",
	"tip.r_transfer_guard.hint": "Das gilt auch ohne „Nacheinander“. Ich schreibe nur im Live-Betrieb, sonst sage ich nur, was ich tun würde. Nachts, wenn ich selbst steuere, greife ich nicht ein. Macht das schon eine Automation von dir, lasse ich ihr den Vortritt.",
	"rule.morning_buffer": "Puffer am netzdienlichen Morgen",
	"rule.morning_buffer.auto": "Automatisch",
	"rule.morning_buffer.auto_n": "Automatisch ({soc} %)",
	"rule.morning_buffer.own": "Eigener Wert",
	"rule.morning_buffer.own_label": "Eigener Puffer in Prozent",
	"rule.morning_buffer.off_hint": "Gilt nur, wenn „Netzdienlich verhalten“ an ist (Einstellungen › Betrieb).",
	"rule.morning_buffer.learned_hint": "Morgens lade ich erst bis {soc} % aus der Sonne – so viel braucht dein Haus an sonnigen Vormittagen meist über die Sonne hinaus (etwa {kwh} kWh), plus etwas Reserve. Dann bekommt das Netz die Morgensonne.",
	"rule.morning_buffer.start_hint": "Morgens lade ich erst bis {soc} % aus der Sonne, dann bekommt das Netz die Morgensonne. Den Wert schätze ich, bis ich genug sonnige Vormittage bei dir gesehen habe.",
	"rule.morning_buffer.pending_hint": "Morgens lade ich erst einen Puffer aus der Sonne, dann bekommt das Netz die Morgensonne. Wie viel, sage ich, sobald ich den nächsten Plan gerechnet habe.",
	"rule.morning_buffer.own_hint": "Morgens lade ich erst bis {soc} % aus der Sonne, dann bekommt das Netz die Morgensonne.",
	"tip.r_morning_buffer.title": "Wozu der Puffer?",
	"tip.r_morning_buffer.text": "Am netzdienlichen Morgen lasse ich die Morgensonne ins Netz und lade den Speicher erst mittags voll. Damit du dabei nichts aus dem Netz kaufen musst, lade ich vorher einen kleinen Puffer: Zieht eine Wolke durch oder läuft der Backofen und das Haus braucht mehr, als die Sonne gerade liefert, kommt der Strom aus dem Speicher.\nSinkt der Speicher unter den Puffer, lade ich ihn aus der Sonne wieder auf – nie aus dem Netz. Erst dann halte ich das Laden wieder zurück.",
	"tip.r_morning_buffer.hint": "Nie weniger als deine Reserve. Arbeiten mehrere Speicher nacheinander, hält ihn der, der morgens zuerst entlädt.",
	"tip.r_morning_buffer_auto.title": "Wie rechne ich den Vorschlag?",
	"tip.r_morning_buffer_auto.text": "Ich schaue mir deine sonnigen Vormittage an: Wie viel Strom brauchte das Haus zwischen dem Moment, ab dem die Sonne reicht, und der Mittagsspitze zusätzlich – weil eine Wolke kam oder ein großes Gerät lief? Was an den meisten Tagen gereicht hätte, nehme ich mal 1,25 als Sicherheit und lege es auf deine Reserve.\nDas lerne ich über Jahre und vergesse nichts – neue Tage zählen etwas mehr.",
	"tip.r_morning_buffer_auto.hint": "Höchstens 60 %, sonst bliebe für das Netz kaum Morgensonne.",
	"tip.r_morning_buffer_own.title": "Eigener Puffer",
	"tip.r_morning_buffer_own.text": "Bis zu diesem Ladestand lade ich morgens aus der Sonne. Mehr Puffer ist sicherer, lässt aber weniger Morgensonne fürs Netz. Weniger Puffer gibt dem Netz mehr – dafür kann bei einer Wolke etwas aus dem Netz kommen.",
	"tip.r_morning_buffer_own.hint": "Liegt der Wert unter deiner Reserve, nehme ich die Reserve.",
	"signpost.rule_transfer_guard.terms": "Wächter, gegenseitig laden, gegeneinander, Transfer, PD-Regler, Omnibattery, Marstek, Venus",
	"signpost.rule_morning_buffer.terms": "Puffer, netzdienlich, Morgensonne, Vormittag, Wolke, Backofen, Reserve am Morgen",
	"rule.day_caution": "Wie vorsichtig?",
	"rule.day_caution.tight": "Knapp",
	"rule.day_caution.normal": "Normal",
	"rule.day_caution.careful": "Vorsichtig",
	"rule.day_caution.tight.hint": "Ich rechne mit 90 % der Vorhersage: am meisten Überschuss für evcc, aber an wechselhaften Tagen werden die Speicher eher mal nicht ganz voll.",
	"rule.day_caution.normal.hint": "Ich rechne mit 80 % der Vorhersage: viel Überschuss, und die Speicher werden zuverlässig voll.",
	"rule.day_caution.careful.hint": "Ich rechne mit 65 % der Vorhersage: etwas weniger Überschuss, dafür sind die Speicher auch an wolkigen Tagen sicher voll.",
	"tip.r_day_caution.title": "Wie vorsichtig soll ich sein?",
	"tip.r_day_caution.text": "Ich nehme die Sonnenvorhersage (schon mit dem, was ich über deine Anlage gelernt habe) und rechne nur mit einem Teil davon: knapp 90 %, normal 80 %, vorsichtig 65 %. Damit bestimme ich, wann die Sonne am Abend nicht mehr fürs Haus reicht – im Sommer später, im Winter früher – und wie langsam die Speicher bis dahin laden dürfen.",
	"tip.r_day_caution.hint": "Je vorsichtiger, desto früher und schneller laden die Speicher und desto weniger bleibt für evcc.",
	"rule.reserve_soc.hint": "Mindestens so viel bleibt in jedem Speicher. Hat ein Speicher eine höhere Entladegrenze, gilt die.",
	"tip.r_reserve_soc.text": "Die Untergrenze für alle Speicher – zum Beispiel als Notreserve oder um die Speicher zu schonen. Jeder Speicher hat zusätzlich seine eigene Entladegrenze (am Gerät eingestellt, siehe Speicher). Ich rechne je Speicher mit dem höheren der beiden Werte.",
	"tip.r_reserve_soc.hint": "10 % passen für die meisten Speicher.",
	"rule.max_target_soc": "Nachts höchstens laden bis",
	"rule.max_target_soc.hint": "Mehr lade ich nachts nicht aus dem Netz.",
	"rule.evening_min_soc": "Abends mindestens",
	"rule.evening_min_soc.hint": "Leer = keine Vorgabe.",
	"rule.grid_limit_w": "Netzlimit",
	"rule.grid_limit_w.hint": "Höchstleistung aus dem Netz, alles zusammen.",
	"rule.grid_limit_w.measured": "Gemessen: höchstens {kw} kW aus dem Netz (seit {date}). Solange du nichts einträgst, lade ich nachts samt Haus nie mehr.",
	"rule.grid_limit_w.measuring": "Gemessen: höchstens {kw} kW aus dem Netz (seit {date}). Nach einer Woche Messen nutze ich das als Grenze, solange du nichts einträgst.",
	"rule.grid_limit_w.measured_own": "Gemessen: höchstens {kw} kW aus dem Netz (seit {date}). Es gilt dein Wert.",
	"rule.grid_limit_w.take": "{kw} kW übernehmen",
	"tip.r_grid_peak.title": "Woher kommt der Messwert?",
	"tip.r_grid_peak.text": "Ich merke mir den höchsten Bezug aus dem Netz, den ich je gemessen habe – das hat dein Hausanschluss sicher geschafft. Trägst du kein Netzlimit ein, bleiben Laden und Haus nachts zusammen darunter (frühestens nach einer Woche Messen). **Übernehmen** trägt den Wert als dein Netzlimit ein.",
	"tip.r_grid_peak.hint": "Kennst du deinen Anschluss, trag ihn lieber selbst ein: 3 × 35 A sind rund 24 kW.",
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
	"rule.buffer_factor.hint": "Aufschlag auf meine Rechnung. Den lerne ich selbst – „Startwert“ lässt mich wieder selbst lernen.",
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
	"tip.review_battery.text": "Ich rechne jede Nacht aus, wie viel er aus dem günstigen Netz braucht, damit er bis zur Sonne reicht.\n**Ändern** – Name, Größe, Sensoren, Grenzen und ob ich ihn steuern darf. Nach der Einrichtung findest du das unter Geräte › Speicher.\n**Weglassen** – ich plane ohne ihn. Zurückholen kannst du ihn jederzeit.",
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
	"tip.review_home.text": "Daraus lerne ich, wie viel ihr wann braucht – das Herzstück meiner Planung. Ich rechne ihn wie das Energie-Dashboard aus Netz, PV und Speicher aus; so zählt auch ein Balkonkraftwerk mit. Einen Hausverbrauchs-Sensor nehme ich zum Vergleich und als Ersatz, wenn die Rechnung nicht geht.\n**Ändern** – einen anderen Sensor wählen.\n**Hab ich nicht** oder **Weglassen** – dann rechne ich nur aus Netz, PV und Speicher.",
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
	"tip.q_hot_water_action.text": "Ich heize das Wasser in der günstigen Zeit gerade so weit vor, dass es bis zum nächsten Abend reicht, und starte so spät wie möglich. Danach stelle ich den Schalter zurück, wie er war. Wie schnell dein Speicher heizt und abkühlt, lerne ich selbst. Ändern kannst du das später unter Geräte › Warmwasser.",
	"tip.q_hot_water_action.hint": "Hast du schon eine eigene Automation fürs Warmwasser (z. B. mit Sonnenüberschuss)? Dann pass auf, dass sich beide nicht in die Quere kommen.",
	"tip.q_ev.title": "Warum frage ich das?",
	"tip.q_ev.text": "Reicht die Sonne morgen nicht, kann ich das Auto nachts günstig laden lassen. Sagst du Ja, kannst du das Laden gleich hier einrichten – oder später unter Geräte › Auto & Laden.",
	"tip.q_household.title": "Warum frage ich das?",
	"tip.q_household.text": "Ob jemand zu Hause ist, ändert den Verbrauch stark. Mit Anwesenheit und Kalendern lerne ich, wann ihr wie viel braucht – zum Beispiel im Homeoffice.\n**Wohnt nicht hier** – die Person lasse ich weg.",
	"tip.q_household.hint": "Alles bleibt in deinem Home Assistant.",
	"tip.q_climate.title": "Was heißt Heizung & Klima regeln?",
	"tip.q_climate.text": "Ist keiner zu Hause, drehe ich Thermostate herunter und Klimageräte hoch oder aus. Kommt jemand heim, ist es rechtzeitig wieder angenehm. Danach stelle ich alles so zurück, wie es war.",
	"tip.q_climate.hint": "Mit Ja schalte ich noch kein Gerät um: Welche ich regeln darf, wählst du für jedes einzeln.",
	"tip.q_home_office.title": "Warum frage ich das?",
	"tip.q_home_office.text": "Wer zu Hause arbeitet, braucht tagsüber mehr Strom und Wärme. Mit deiner Antwort rechne ich Arbeitstage richtig, auch wenn im Kalender nichts dazu steht.",
	"tip.q_home_office.hint": "Für einzelne Personen geht das auch eigen – unter Haushalt › Tage & Kalender.",
	"tip.q_ev_action.title": "Was richte ich da ein?",
	"tip.q_ev_action.text": "Ich lade das Auto in der günstigen Zeit, wenn morgen die Sonne nicht reicht, und stelle danach alles zurück, wie es war. Auf Wunsch lade ich nach Bedarf: nur so viel, wie eure Fahrten morgen brauchen. Ändern kannst du das später unter Geräte › Auto & Laden.",
	"tip.q_ev_action.hint": "Lädt deine Wallbox schon selbst mit Sonnenüberschuss (z. B. über evcc)? Dann pass auf, dass sich beide nicht in die Quere kommen.",
	"tip.ask_later.title": "Was passiert mit „Später“?",
	"tip.ask_later.text": "Ich lasse die Frage erst mal offen und mache mit der nächsten weiter. Nach dem Start steht sie in der Übersicht unter „Joe braucht dich“ – ein Tipp bringt dich dorthin, wo du sie beantwortest.",
	"tip.ask_later.hint": "„Weiß ich nicht“ ist auch eine Antwort: Dann rechne ich mit einem Startwert und frage nicht wieder.",
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
	"tip.f_battery_control.title": "Was steht unter Steuern?",
	"tip.f_battery_control.text": "Ganz oben steht, wie ich diesen Speicher steuere. Mit „Regler einrichten“ legst du fest, über welche Schalter und Werte ich das tue; bei „Nur beobachten“ schaue ich nur zu und schalte nichts. Im Live-Betrieb stelle ich Ladeziel und Entladung selbst ein und setze am Ende jeder Nacht alles zurück.\nDarunter stehen Name, Größe, Höchstleistung, Entladegrenze und bei mehreren Speichern die Reihenfolge. Jedes Feld hat seine eigene Erklärung. Was du dort änderst, speichere ich sofort.",
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
	"tip.r_min_saving.text": "Jedes Mal, wenn ich steuere, schreibe ich Werte in deine Geräte. Bringt eine Nacht weniger als diesen Betrag, lasse ich es und die Speicher laufen wie ohne mich. Pflegenächte sind ausgenommen.",
	"tip.r_grid_friendly.title": "Was heißt netzdienlich?",
	"tip.r_grid_friendly.text": "Mittags liefern alle Solaranlagen gleichzeitig am meisten – dann ist das Netz voll. Morgens und abends brauchen alle Strom – dann ist es knapp.\n**Speicher**: An sonnigen Tagen lade ich morgens erst einen kleinen Puffer aus der Sonne, dann halte ich das Laden zurück, der Überschuss geht ins Netz, und der Speicher lädt in der Mittagsspitze voll. Ich rechne vorsichtig mit 80 % der Prognose und gebe früher frei, wenn die Sonne zurückbleibt. Das geht bei Speichern, deren Ladeleistung ich begrenzen kann.\n**Morgens und abends** nimmt das Haus Strom aus dem Speicher statt aus dem Netz.\n**Auto**: Fährt es erst nachmittags, lädt es mit Sonne statt nachts.",
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
	"tip.r_reset_lead_min.text": "So viele Minuten vor Ende der günstigen Zeit stelle ich alles zurück, zum Beispiel die Wallbox von „Jetzt“ auf „PV“. Manche Geräte laufen noch kurz nach – so landet nichts im teureren Tagtarif.",
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
	"overview.inbox": "Joe braucht dich",
	"overview.inbox.count": "{count} offen",
	"overview.todo.dismiss": "Brauch ich nicht",
	"overview.inbox.more": "{count} weitere zeigen",
	"overview.inbox.less": "Weniger zeigen",
	"overview.ask.one": "Ich habe eine Frage zu einem Tag",
	"overview.ask.many": "Ich habe Fragen zu {count} Tagen",
	"overview.ask.text": "Tipp hier – eine kurze Antwort reicht, dann lerne ich richtig.",
	"overview.todo.car_setup_many": "Laden ist noch nicht eingerichtet: {names}",
	"overview.todo.test": "Testlauf für {name} fehlt",
	"overview.todo.test.text": "Ohne Testlauf schaue ich diesen Speicher nur an. Der Test dauert ein paar Minuten.",
	"overview.todo.test.outdated": "Seit dem letzten Testlauf hat sich am Speicher etwas geändert. Bis zum nächsten schaue ich nur zu.",
	"overview.todo.test_many": "Testlauf fehlt: {names}",
	"overview.todo.test_many.text": "Ohne Testlauf schaue ich diese Speicher nur an. Jeder Test dauert ein paar Minuten.",
	"overview.todo.car_many": "Laden nicht nach Bedarf: {names}",
	"overview.todo.notify": "Benachrichtigungen fehlen",
	"overview.todo.notify.text": "Sag mir, wohin ich schreiben darf – dann frage ich abends nach und sage Bescheid, wenn etwas klemmt.",
	"overview.todo.later": "Noch offen aus der Einrichtung: {topic}",
	"overview.todo.later.text": "Die Frage hast du auf später gelegt. Antworten kannst du unter {place}.",
	"overview.todo.climate": "Heizung & Klima ist noch nicht eingerichtet",
	"overview.todo.climate.text": "Ich habe Geräte zum Heizen oder Kühlen gefunden. Sag mir, welche ich regeln darf.",
	"overview.todo.car": "{name} lädt nicht nach Bedarf",
	"overview.todo.car.setup": "{name}: Laden ist noch nicht eingerichtet",
	"overview.todo.car.text": "Mit deinen Terminen lade ich nachts nur so viel, wie du am nächsten Tag brauchst.",
	"overview.todo.new": "Neu gefunden: {names}",
	"overview.todo.new.text": "Das nutze ich noch nicht. Schau es dir unter Geräte an.",
	"overview.doing": "Joe tut gerade",
	"overview.doing.battery": "{name}: {what}",
	"overview.doing.action": "{name} läuft bis {time} Uhr",
	"overview.doing.away": "{count} Räume auf Abwesend, weil niemand da ist",
	"overview.doing.away_one": "{name} auf Abwesend, weil niemand da ist",
	"overview.doing.night": "{count} Räume in Nachtruhe",
	"overview.doing.night_one": "{name} in Nachtruhe",
	"overview.quick": "Schnell",
	"overview.climate": "Heizung & Klima",
	"overview.climate.all": "Alle anzeigen →",
	"overview.climate.would": "Vorschau",
	"overview.who": "Wer ist da",
	"overview.who.home": "Zu Hause: {names}",
	"overview.who.nobody": "Niemand zu Hause",
	"overview.who.coming": "{name} in {minutes} min",
	"overview.who.coming_soon": "{name} kommt heim",
	"overview.who.guest": "Gast da",
	"overview.who.day.workday": "heute Arbeitstag",
	"overview.who.day.weekend": "Wochenende",
	"overview.who.day.holiday": "heute frei",
	"overview.who.day.home_office": "Homeoffice: {names}",
	"overview.result": "Was es gebracht hätte",
	"overview.result.saved": "{night}: {value} gespart",
	"overview.result.cost": "{night}: {value} teurer",
	"overview.result.same": "{night}: kein Unterschied",
	"overview.result.total": "Seit {since}: {value} an {nights}",
	"overview.result.provisional": "vorläufig, Stand {time} Uhr",
	"overview.result.last": "Letzte Nacht",
	"overview.result.night": "Nacht zum {day}",
	"overview.result.none": "Nach der ersten geplanten Nacht rechne ich nach, was mein Plan gebracht hätte.",
	"tip.inbox.title": "Was steht hier?",
	"tip.inbox.text": "Alles, wobei ich dich brauche: deine Antwort für heute Nacht, Hinweise zu deinen Geräten, noch nicht Eingerichtetes, neu gefundene Geräte und Fragen zu auffälligen Tagen. Hinweise auf Fehler stehen oben und bleiben, bis der Fehler behoben ist. Zuerst zeige ich drei Zeilen, den Rest unter „weitere zeigen“. Ein Tipp auf eine Zeile bringt dich dorthin, wo du es erledigst. Ist nichts offen, verschwindet der Kasten.",
	"tip.todo_dismiss.title": "Was macht „Brauch ich nicht“?",
	"tip.todo_dismiss.text": "Die Zeile verschwindet, und ich zeige sie nicht wieder. Geändert wird nichts – einstellen kannst du es jederzeit dort, wo die Zeile hinführt.",
	"tip.quick.title": "Wofür ist „Schnell“?",
	"tip.quick.text": "Abkürzungen für den Moment: ein Auto jetzt oder heute Nacht laden, den Gastmodus an- oder ausschalten. Dauerhaft eingestellt wird hier nichts – das geht auf der Seite des Geräts und unter Haushalt.",
	"tip.overview_climate.title": "Was zeigt die Liste?",
	"tip.overview_climate.text": "Jedes Gerät, das ich regle: wie warm es ist und sein soll, welches Profil läuft und warum. Ein Tipp öffnet die Seite des Geräts.",
	"tip.overview_climate.hint": "„Vorschau“ heißt: Ich zeige nur, was ich tun würde. Geschaltet wird erst im Live-Betrieb.",
	"overview.week": "Die letzten 7 Tage",
	"overview.week.known": "{days} Tage im Gedächtnis",
	"overview.week.none": "Noch nichts aufgezeichnet – nach der ersten vollen Stunde geht's los.",
	"overview.week.more": "Alle Tage im Rückblick",
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
	"history.failed": "Den Verlauf konnte ich gerade nicht laden.",
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
	"tip.now.text": "Was gerade fließt: was die Sonne erzeugt, was das Haus verbraucht, ob die Speicher laden oder entladen und ob Strom aus dem Netz kommt oder hineingeht. Live aus deinen Sensoren. Darunter steht, was ich gerade mit deinen Geräten tue.",
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
	"plan.why.dynamic": "Für Börsenpreise brauche ich die Preise der nächsten Stunden. Wähle unter Geräte › Netz & Sonne › Stromtarif den Preis-Sensor deiner Tarif-Integration.",
	"plan.why.no_prices": "Dein Preis-Sensor liefert keine Preisliste für die nächsten Stunden. Wähle unter Geräte › Netz & Sonne › Stromtarif einen Sensor, der die Preise mitbringt (z. B. Nord Pool, EPEX Spot, Tibber, ENTSO-E).",
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
	"plan.math.tomorrow.person": "{name}: {label}",
	"plan.math.tomorrow.scaled": "für den ganzen Tag erwarte ich {expected} kWh statt der üblichen {usual} kWh",
	"plan.math.tomorrow.usual": "ich rechne wie an einem üblichen Tag",
	"plan.math.weather": "Wetter morgen",
	"plan.math.day": "Morgen ist",
	"plan.math.day.workday": "Arbeitstag",
	"plan.math.day.off": "Wochenende oder Feiertag",
	"plan.math.home": "Verbrauch morgen",
	"plan.math.home.history": "aus {days} Tagen, {kind}",
	"plan.math.home.default": "Startwert eines typischen Haushalts",
	"plan.math.workday": "für einen Arbeitstag",
	"plan.math.day_off": "für ein Wochenende oder einen Feiertag",
	"plan.math.target": "Ziel",
	"plan.math.target.sub": "nötig wären {optimum} %, dazu {buffer} % Puffer auf den Teil über der Reserve",
	"plan.math.prices": "Preise",
	"plan.math.prices.value": "günstig {night} · sonst {day} · Einspeisung {feed}",
	"plan.math.prices.assumed": "Nicht alle Preise kenne ich – die fehlenden habe ich angenommen. Trag sie unter Geräte › Netz & Sonne ein.",
	"plan.math.rules": "Regeln",
	"plan.math.rules.value": "Reserve {reserve} % · höchstens {max} % · Entladen: {mode}",
	"history.chart.plan": "Plan",
	"tip.plan_target.title": "Was heißt das Ziel?",
	"tip.plan_target.text": "Mit diesem Stand sollen die Speicher aus der günstigen Zeit kommen. Liegen sie darunter, lade ich aus dem Netz – so spät wie möglich. Liegen sie darüber, entladen sie nur bis zum Ziel, damit es bis zur Sonne reicht.",
	"tip.plan_target.hint": "In der Simulation schalte ich nichts – ich zeige nur, was ich tun würde.",
	"tip.plan_refresh.title": "Wann rechne ich neu?",
	"tip.plan_refresh.text": "Jede Stunde von allein, mit der neuesten Prognose. Kurz vor der günstigen Zeit lege ich den Plan fest, danach bleibt er bis zum Morgen. Mit **Neu rechnen** rechne ich sofort.",
	"tip.plan_math.title": "Wie entscheide ich?",
	"tip.plan_math.text": "Ich spiele die Stunden bis zur nächsten Nacht durch – für jedes mögliche Ziel – und nehme das, bei dem du am wenigsten bezahlst. Weil ich noch lerne, lege ich einen Puffer drauf. **Ändern →** bringt dich dorthin, wo ein Wert eingestellt wird.",
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
	"learn.model": "Verbrauch und Wetter",
	"learn.model.no_weather": "Solange keine Wettervorhersage gewählt ist, kenne ich die Außentemperatur nicht. Sobald du eine wählst, lerne ich, wie viel ihr bei Kälte mehr braucht.",
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
	"learn.battery.odd": "Das passt nicht zu den {value} kWh laut Gerät – ich rechne lieber mit dem Gerätewert. Prüf die Sensoren für Ladestand und Leistung.",
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
	"learn.hot_water.none": "Richte unter Geräte › Warmwasser dein Warmwasser mit Temperatursensor ein, dann lerne ich, wie schnell es heizt und wie viel ihr am Tag braucht.",
	"learn.presence": "Wer wann zu Hause ist",
	"learn.presence.value": "{label}: {hours} h",
	"learn.presence.no_person": "Ohne Personen in Home Assistant sehe ich nicht, wann jemand zu Hause ist.",
	"learn.presence.none": "Ordne Personen ihre Kalender zu, dann lerne ich, wie viele Stunden sie bei Büro, Homeoffice oder Urlaub zu Hause sind.",
	"learn.presence.calendars": "Kalender zuordnen →",
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
	"learn.reset.forget.all": "Prognose-Faktoren, Zeitversatz, Wetterlagen, Prognosequellen, den gelernten Puffer, alle Rechnungen zu Verbrauch, Speichern, Warmwasser und Autos, wie schnell jeder Raum warm wird, und die Bilanz, was es gebracht hätte.",
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
	"action.need.no_calendars": "Noch hat niemand einen Kalender. Unter Haushalt › Wer wohnt hier ordnest du Kalender zu.",
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
	"action.need.no_routing": "Wie weit die Termine weg sind, kann ich erst ausrechnen, wenn du unter Haushalt › Unterwegs & Wetter einen Routendienst wählst. Bis dahin zählen nur Termine an einer Zone und deine übliche Strecke.",
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
	"settings.routing": "Routendienst",
	"settings.routing.intro": "Für Autofahrten und den Heimweg rechne ich aus, wie weit ein Ort weg ist und wie lange die Fahrt dauert. Dafür schicke ich den Ort eines Termins oder die gerundete Position einer Person und euren Standort aus Home Assistant an den Dienst, den du hier wählst – nie Titel oder Beschreibung eines Termins.",
	"settings.routing.service": "Dienst",
	"settings.routing.service.hint": "Einmal je Ort eines Termins, danach merke ich mir die Strecke. Auf dem Heimweg frage ich öfter.",
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
	"learn.car.none": "Schalte unter Geräte › Auto & Laden bei deinem Auto „Laden nach Bedarf“ ein, dann lerne ich, wie viel es wirklich braucht.",
	"learn.reset.scope.car": "Autos",
	"learn.reset.forget.car": "Verbrauch und übliche Strecke deiner Autos.",
	"learn.reset.scope.climate": "Heizung & Klima",
	"learn.reset.forget.climate": "Wie schnell jeder Raum warm oder kühl wird. Bis ich es neu gelernt habe, rechne ich mit 1,5 °C pro Stunde.",
	"devices.action.why.enough_range": "Das Auto hat genug für morgen – heute Nacht lade ich es nicht.",
	"devices.action.why.sun_before_trip": "Die erste Fahrt ist erst am Nachmittag, und es kommt genug Sonne – sie lädt das Auto vorher.",
	"devices.action.why.need_unknown": "Den Ladestand des Autos kenne ich nicht – ich entscheide nach der Sonne.",
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
	"tip.sim_result.hint": "Gerechnet mit deinen Preisen aus Geräte › Netz & Sonne.",
	"tip.learn_solar.title": "Was ist der Prognose-Faktor?",
	"tip.learn_solar.text": "Ich vergleiche jeden Tag die Prognose vom Vorabend mit dem, was deine Anlage geliefert hat, und nehme den mittleren Wert der letzten vier Wochen. Ausreißer wie ein verschneites Dach fallen so kaum ins Gewicht. Jede neue Prognose rechne ich damit um.",
	"tip.learn_shift.title": "Was ist der Zeitversatz?",
	"tip.learn_shift.text": "Manche Prognosen geben ihre Stunden mit dem Ende statt dem Anfang an – dann liegen sie eine Stunde daneben. Ich prüfe jeden Tag, ob die Kurve um eine Stunde verschoben besser passt, und verschiebe sie erst, wenn das an den meisten Tagen klar so ist.",
	"tip.learn_buffer.title": "Wozu der Puffer?",
	"tip.learn_buffer.text": "Ich lade etwas mehr, als nötig wäre – für Morgen, an denen ihr mehr braucht oder die Sonne später kommt. Wie viel, lerne ich aus den nachgespielten Nächten: so viel, dass es an 8 von 10 Morgen gereicht hätte. Zu viel Puffer kostet Geld, zu wenig auch.",
	"tip.learn_buffer.hint": "Einen eigenen Wert stellst du unter Einstellungen › Regeln ein.",
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
	"tip.learn_groups.text": "So sehe ich, welches Gerät bei Kälte mehr braucht. Lasse ich ein Gerät nachts in der günstigen Zeit laufen, verschiebe ich genau so viel von seinem Tagesverbrauch in die Nacht, wie es morgen voraussichtlich braucht.",
	"tip.learn_hot_water.title": "Was lerne ich am Warmwasser?",
	"tip.learn_hot_water.text": "Wie schnell der Speicher heizt, wie viel er im Stehen verliert und wie viele Grad ihr am Tag verbraucht. Daraus rechne ich die Zieltemperatur für die Nacht und wann das Heizen starten muss, damit es zum Ende der günstigen Zeit fertig ist.",
	"tip.learn_presence.title": "Wozu die Anwesenheit?",
	"tip.learn_presence.text": "Aus euren Kalendern lese ich, was morgen ansteht – Büro, Homeoffice, Urlaub. Wie viele Stunden jemand an solchen Tagen zu Hause ist, lerne ich aus seiner Anwesenheit in Home Assistant. Wer zu Hause ist, verbraucht mehr; das fließt in die Rechnung für morgen ein.",
	"tip.learn_calendar.title": "Wie lese ich eure Kalender?",
	"tip.learn_calendar.text": "Für jede Person schaue ich in ihre Kalender, ganztägige Termine zuerst. Das erste passende Stichwort bestimmt die Art des Tages. Passt ein Termin zu mehreren Arten, gilt die obere Zeile.\nGroß- und Kleinschreibung spielt keine Rolle.",
	"tip.cal_defaults.title": "Und ohne Termin?",
	"tip.cal_defaults.text": "Findet sich kein passender Termin, nehme ich diese Art – je nachdem, ob der Tag ein Arbeitstag oder ein freier Tag ist.",
	"tip.learn_reset_scope.title": "Welchen Bereich?",
	"tip.learn_reset_scope.text": "**Sonne** nach neuen Modulen oder einer anderen Prognose, **Verbrauch** nach einem Umzug oder einer neuen Heizung, **Speicher** nach einem Tausch oder einer Erweiterung, **Warmwasser** nach einem neuen Boiler, **Autos** nach einem Autowechsel, **Heizung & Klima** nach neuen Heizkörpern, Thermostaten oder einer Dämmung. **Alles**, wenn sich vieles geändert hat.",
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
	"tip.routing_service.text": "**Waze**: kostenlos, ohne Anmeldung, über Home Assistants eigene Waze-Aktion.\n**Google**: braucht eine eingerichtete „Google Maps Travel Time“-Integration mit API-Schlüssel; schalte dort das Abfragen alle 10 Minuten aus, sonst sind die Freiabfragen schnell weg.\n**OpenStreetMap**: kostenlos, freie Karte; dafür findet Photon den Ort und OSRM die Strecke.\nIch frage jeden Ort eines Termins nur einmal und merke mir die Strecke. Liegt ein Termin an einer Zone aus Home Assistant, brauche ich keinen Dienst. Nur für den Heimweg frage ich öfter, solange jemand auf dem Weg nach Hause ist.",
	"tip.routing_service.hint": "Geschickt werden nur der Ort eines Termins oder die auf etwa 100 m gerundete Position einer Person auf dem Heimweg, dazu euer Standort als Start der Strecke – nie Titel oder Beschreibung.",
	"tip.routing_osm.title": "Was ist das?",
	"tip.routing_osm.text": "Die Adressen der freien OpenStreetMap-Dienste. Sie stehen hier, damit du auf einen eigenen oder anderen Server wechseln kannst, ohne auf ein Update zu warten.",
	"tip.need_trips.title": "Woher kommen die Kilometer?",
	"tip.need_trips.text": "Aus den Orten eurer Termine morgen, ausgerechnet mit dem Routendienst unter Haushalt › Unterwegs & Wetter. Passt eine Strecke nicht, trag die einfache Strecke ein – die merke ich mir für diesen Ort.",
	"tip.learn_car.title": "Was lerne ich am Auto?",
	"tip.learn_car.text": "Aus Kilometerstand und Ladestand: wie viel Energie das Auto pro 100 km wirklich braucht, wie viel mehr bei Kälte und wie weit es an einem üblichen Werktag und freien Tag fährt. Daraus rechne ich, was es morgen braucht.",
	"tip.chart_replay.title": "Was sehe ich hier?",
	"tip.chart_replay.text": "Wie voll die Speicher an diesem Tag **mit meinem Plan** gewesen wären und wie voll **ohne**. Beides nachgespielt mit der echten Sonne und deinem echten Verbrauch.",
	"mode.advisory": "Vorschlagen",
	"mode.advisory.sub": "Joe fragt jeden Abend",
	"mode.advisory.desc": "Ich frage dich jeden Abend, ob ich die Nacht steuern darf. Ohne dein Ja schalte ich nichts.",
	"mode.untested": "Noch ohne Testlauf: {names}. Die schaue ich nur an, bis der Testlauf unter Geräte › Speicher geklappt hat.",
	"mode.none_tested": "Noch hat kein Speicher den Testlauf bestanden – ich würde nur zuschauen. Mach zuerst den Testlauf unter Geräte › Speicher.",
	"mode.to_batteries": "Zu den Speichern →",
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
	"devices.role.steers": "Ich steuere",
	"devices.role.watches": "Ich schaue zu",
	"devices.role.measures": "Nur gemessen",
	"devices.group.go": "Alle zeigen →",
	"devices.no_meter_group": "ohne Zähler",
	"devices.car.lead": "Ein Auto hat seinen Bedarf – Fahrten, Termine, Ladestand. Ein Ladepunkt ist die Wallbox, die ich schalte. Ich lade immer das Auto, das gerade steckt: nach Bedarf, wenn der Strom günstig ist, oder sofort, wenn du es willst.",
	"devices.hot_water.lead": "Ich heize das Wasser in der günstigen Zeit auf, damit es bis zum nächsten Abend reicht.",
	"devices.other.lead": "Alle Zähler aus deinem Energie-Dashboard. Sag mir, was jedes Gerät ist und wann es läuft – dann rechne ich richtig. Ein Gerät, das nachts laufen soll, schalte ich in der günstigen Zeit ein.",
	"devices.other.empty": "Im Energie-Dashboard sind keine weiteren Geräte eingetragen.",
	"devices.car.terms": "Termine",
	"devices.car.terms_off": "Du kannst die Termine schon einstellen. Sie zählen, sobald oben unter Steuern „Laden nach Bedarf“ an und gespeichert ist.",
	"car.explain.title": "Wie funktioniert das mit dem Kalender?",
	"car.explain.why": "Damit ich nur so viel lade, wie das Auto morgen wirklich braucht, muss ich wissen, **wohin es fährt**. Das lese ich aus Terminen mit Ort. Wichtig ist dabei: In euren eigenen Kalendern stehen auch Termine, zu denen ihr mit dem Rad, der Bahn oder einem anderen Auto fahrt. Darum gibt es einen **eigenen Kalender nur für dieses Auto**: Was dort steht, ist sicher eine Fahrt mit genau diesem Auto.",
	"car.explain.two": "Zwei Arten von Terminen",
	"car.explain.car_cal": "**Kalender von „{name}“:** Jeder Termin mit Ort darin ist eine Fahrt mit diesem Auto. Das ist der genaue Weg.",
	"car.explain.persons": "**Kalender der Personen** („Wessen Termine zählen“): Deren Termine mit Ort zähle ich auch als Fahrt mit diesem Auto. Das passt nur, wenn diese Personen meistens mit diesem Auto fahren. Wählst du hier niemanden aus, zählt nur der Kalender des Autos.",
	"car.explain.ways": "Wie kommt ein Termin in den Kalender des Autos? Drei Wege – du wählst unten einen:",
	"car.explain.way.calendar": "**Fertiger Kalender:** Ihr habt schon einen Kalender nur fürs Auto (z. B. einen geteilten Google- oder iCloud-Kalender „Auto“) und er ist in Home Assistant eingebunden. Wer mit dem Auto fährt, trägt den Termin dort ein oder kopiert ihn hinein.",
	"car.explain.way.mailbox": "**Postfach ohne Kalender:** Das Auto bekommt eine eigene E-Mail-Adresse (z. B. kona123@web.de). Wer das Auto braucht, **lädt diese Adresse zu seinem Termin ein** – wie einen Kollegen. Ich hole die Einladung, sage zu und trage den Termin in meinen Kalender für das Auto ein.",
	"car.explain.way.account": "**Postfach mit Kalender:** Wie eben, nur hat die Adresse selbst einen Kalender (Google, Microsoft, iCloud, Infomaniak). Die Einladung landet dort von allein, ich lese diesen Kalender und sage zu.",
	"car.explain.example.title": "Ein Beispiel",
	"car.explain.example.1": "Du hast am Dienstag um 9 Uhr einen Termin beim Kunden, Ort: „Hauptstraße 5, Köln“.",
	"car.explain.example.2": "Du nimmst „{name}“ und lädst deshalb die Adresse des Autos zum Termin ein (oder trägst ihn in den Kalender des Autos ein).",
	"car.explain.example.3": "Der Termin steht damit im Kalender von „{name}“. Ich rechne die Strecke dorthin aus (mit „Hin und zurück“ doppelt) und lege die Reserve drauf.",
	"car.explain.example.4": "In der Nacht auf Dienstag lade ich nur, was dem Auto dafür fehlt, und zwar zur günstigsten Zeit.",
	"car.explain.rules": "Gut zu wissen",
	"car.explain.rule.place": "Nur Termine **mit Ort** zählen – ohne Ort weiß ich nicht, wohin es geht.",
	"car.explain.rule.online": "Online-Termine (Teams, Zoom & Co.) lasse ich weg.",
	"car.explain.rule.twice": "Steht derselbe Termin im Kalender des Autos und einer Person, zähle ich ihn nur einmal.",
	"car.explain.rule.none": "Steht morgen gar nichts im Kalender, nehme ich eure übliche Strecke am Tag.",
	"action.need.max_soc": "Höchstens laden bis",
	"action.need.capacity_sensor": "Akkugröße vom Sensor",
	"action.need.consumption_sensor": "Verbrauch vom Sensor",
	"tip.a_need_max_soc.title": "Warum höchstens?",
	"tip.a_need_max_soc.text": "Nach Bedarf lade ich nie über diesen Stand – zum Beispiel 80 %, wenn du den Akku schonen willst. Braucht morgen mehr, siehst du es unter „Fahrten morgen“.",
	"tip.a_need_capacity_sensor.title": "Welcher Sensor für die Akkugröße?",
	"tip.a_need_capacity_sensor.text": "Zeigt keine Integration die Akkugröße, kannst du hier einen Sensor wählen – oder oben unter Steuern die Größe eintragen.",
	"tip.a_need_consumption_sensor.title": "Welcher Sensor für den Verbrauch?",
	"tip.a_need_consumption_sensor.text": "Der Langzeit-Durchschnitt des Autos (kWh/100 km, Wh/km oder km/kWh). Bis ich selbst gelernt habe, rechne ich damit.",
	"car.delete": "Auto löschen",
	"car.delete.ask": "{name} wirklich löschen? Termine, Postfach und was ich über das Auto gelernt habe, sind dann weg. Die Wallbox bleibt. Seine Integrationen lasse ich danach weg – mit „Nochmal nach Autos suchen“ findest du sie wieder.",
	"tip.car_delete.title": "Was passiert beim Löschen?",
	"tip.car_delete.text": "Das Auto ist weg – mit Terminen, Postfach und Gelerntem. Die Wallbox schalte ich weiter. Seine Integrationen lasse ich danach weg, damit es nicht von selbst wiederkommt. Unter Geräte › Auto & Laden findest du sie mit „Nochmal nach Autos suchen“ wieder – dort machst du ein Auto daraus, oder du hängst sie unter Quellen an ein Auto.",
	"car.f.name": "Name",
	"tip.car_name.title": "Welcher Name?",
	"tip.car_name.text": "So nenne ich das Auto überall – in Fragen, Erinnerungen und im Plan.",
	"car.f.remind": "Erinnern, wenn es nicht steckt",
	"car.f.remind_at": "abends um",
	"car.f.remind_time": "Uhrzeit der Erinnerung",
	"tip.car_remind.title": "Wann erinnere ich dich?",
	"tip.car_remind.text": "Braucht das Auto für morgen Strom und steckt um diese Uhrzeit an keiner Wallbox, sage ich es dir – unter Übersicht und, wenn eingerichtet, aufs Handy. Einmal am Abend.",
	"car.f.tracker": "Wo ist das Auto?",
	"car.pick.tracker": "Wo ist das Auto?",
	"tip.car_tracker.title": "Wozu der Ort?",
	"tip.car_tracker.text": "Steckt ein Auto an, und nur eines ist zu Hause, weiß ich, welches es ist. Meist bringt die Integration des Herstellers den Ort mit; sonst wähle hier einen Tracker oder eine Person.",
	"car.merge.ask": "Gehören „{a}“ aus evcc und „{b}“ aus {from} zusammen?",
	"car.merge.text": "Dann ist es ein Auto mit den Werten aus beiden – den Ladestand nehme ich am liebsten von evcc.",
	"car.merge.yes": "Ja, ein Auto",
	"car.merge.no": "Nein, zwei Autos",
	"car.merge.with": "Zusammenführen mit …",
	"car.merge.do": "Zusammenführen",
	"tip.car_merge.title": "Warum frage ich das?",
	"tip.car_merge.text": "Dasselbe Auto zeigt sich oft zweimal: in evcc und in der Integration des Herstellers. Passen Name, Ladestand oder Kilometerstand eindeutig, führe ich sie selbst zusammen. Bin ich unsicher, frage ich lieber. Du kannst es unter Quellen jederzeit wieder trennen.",
	"tip.car_merge_with.title": "Wann zusammenführen?",
	"tip.car_merge_with.text": "Wenn zwei Autos hier in Wahrheit eines sind. Die Einstellungen des Autos, das nach Bedarf lädt, bleiben; die Quellen des anderen kommen dazu.",
	"car.open_point": "Zum Ladepunkt",
	"car.plugged_at": "steckt an {point}",
	"car.plugged_elsewhere": "steckt an einer Wallbox, die ich nicht schalte",
	"car.not_plugged": "steckt nicht",
	"car.reminder": "{car} braucht morgen {km} km, steckt aber nicht",
	"car.reminder.text": "Steck es heute Abend ein, dann lade ich in der günstigen Zeit.",
	"car.role.soc": "Ladestand",
	"car.role.range": "Reichweite",
	"car.role.capacity": "Akkugröße",
	"car.role.plugged": "Eingesteckt",
	"car.role.charging": "Lädt",
	"car.role.odometer": "Kilometerstand",
	"car.role.consumption": "Verbrauch",
	"car.role.outside_temp": "Außentemperatur",
	"car.role.location": "Ort",
	"car.source.car": "Auto-Integration",
	"car.source.manual": "von Hand",
	"car.source.chip": "aus {from}",
	"car.source.chip_manual": "von Hand gewählt",
	"car.source.from": "über {from}",
	"car.source.gives": "liefert: {roles}",
	"car.source.evcc_only": "evcc sagt mir, ob das Auto an einer Wallbox steckt, und seinen Ladestand dort.",
	"car.source.nothing": "liefert gerade keine Werte",
	"car.source.split": "Trennen",
	"car.source.vehicle": "in evcc: {id}",
	"car.platform.kia_uvo": "Hyundai / Kia",
	"car.platform.ha_kia_hyundai": "Hyundai / Kia",
	"car.platform.bmw_connected_drive": "BMW",
	"car.platform.bavariandata": "BMW",
	"car.platform.cardata": "BMW",
	"car.platform.tesla_fleet": "Tesla",
	"car.platform.teslemetry": "Tesla",
	"car.platform.tesla_custom": "Tesla",
	"car.platform.volkswagen_we_connect_id": "Volkswagen",
	"car.platform.renault": "Renault",
	"car.platform.mbapi2020": "Mercedes-Benz",
	"car.platform.byd_vehicle": "BYD",
	"car.platform.audiconnect": "Audi",
	"car.platform.stellantis_vehicles": "Stellantis",
	"car.sources": "Quellen",
	"tip.car_sources.title": "Woher kommen die Werte?",
	"tip.car_sources.text": "Ein Auto kann aus mehreren Integrationen kommen. Den Ladestand nehme ich am liebsten von evcc – evcc schätzt ihn beim Laden, statt das Auto zu fragen. Reichweite, Kilometerstand, Ort und Außentemperatur kommen von der Integration des Herstellers. Ich frage das Auto nie selbst ab und wecke es nicht auf.",
	"car.sources.manual": "Von Hand gewählt",
	"car.sources.manual.hint": "Für ein Auto, das keine Integration zeigt – oder wenn ich einen Wert nicht finde.",
	"car.sources.manual.open": "Sensoren von Hand wählen",
	"tip.car_manual.title": "Wann wähle ich von Hand?",
	"tip.car_manual.text": "Nur wenn eine Integration einen Wert nicht liefert oder ein Auto gar keine Integration hat. Was die Integrationen liefern, lese ich von selbst.",
	"car.sources.none": "Noch keine Integration – wähle unten die Sensoren von Hand.",
	"tip.car_split.title": "Was heißt trennen?",
	"tip.car_split.text": "Diese Quelle ist ein anderes Auto: Sie wird ein Auto für sich, und ich frage nicht mehr, ob die beiden zusammengehören.",
	"car.search": "Nochmal nach Autos suchen",
	"car.search.busy": "Ich schaue mich in Home Assistant nach Autos um …",
	"car.search.failed": "Das Suchen hat gerade nicht geklappt. Versuch es gleich noch mal.",
	"car.search.lead": "Diese Autos sehe ich in Home Assistant – aus evcc und aus den Integrationen der Hersteller. Auch die, die du früher weggelassen hast.",
	"car.search.none": "Ich sehe in Home Assistant gerade kein Auto – weder in evcc noch in der Integration eines Herstellers.",
	"car.find.of": "gehört zu {car}",
	"car.find.ignored": "früher weggelassen",
	"car.find.new": "gehört noch zu keinem Auto",
	"car.find.open": "Ansehen",
	"car.find.use": "Als neues Auto",
	"car.find.reuse": "Wieder nutzen",
	"tip.car_search.title": "Was finde ich beim Suchen?",
	"tip.car_search.text": "Ich schaue in Home Assistant nach allen Autos: den Fahrzeugen aus evcc und den Integrationen der Hersteller, etwa Hyundai, BMW oder Tesla. Auch nach denen, die du früher weggelassen oder mit einem Auto gelöscht hast. Beim Suchen ändere ich nichts – was damit passiert, entscheidest du.",
	"tip.car_search_use.title": "Neues Auto oder zu einem Auto?",
	"tip.car_search_use.text": "„Als neues Auto“ und „Wieder nutzen“ machen daraus ein eigenes Auto. Zeigt die Integration ein Auto, das du schon hast, öffne dieses Auto und wähle unter Quellen „Quelle hinzufügen“.",
	"car.attach.open": "Quelle hinzufügen",
	"car.attach.lead": "Welche Integration zeigt auch {car}? Tippe eine oder mehrere an.",
	"car.attach.none": "Ich sehe keine weitere Integration mit einem Auto. Richte sie in Home Assistant ein und such dann nochmal.",
	"car.attach.from": "gehört bis jetzt zu {car}",
	"car.attach.do": "Zu {car} hinzufügen",
	"car.attach.ask": "„{name}“ gehört bis jetzt zu „{from}“. Ich nehme es dort weg und hänge es an „{car}“.",
	"car.attach.empty": "„{from}“ hat danach keine Integration mehr – seine Sensoren wählst du dann von Hand, oder du löschst es.",
	"car.attach.yes": "Ja, hierher",
	"car.attach.no": "Abbrechen",
	"car.attach.close": "Schließen",
	"tip.car_attach_open.title": "Wann eine Quelle hinzufügen?",
	"tip.car_attach_open.text": "Wenn ich eine Integration deines Autos nicht von selbst zugeordnet habe – etwa weil du das Auto einmal gelöscht hattest. Ein Auto kann mehrere Quellen haben: evcc, die App des Herstellers und weitere.",
	"tip.car_attach.title": "Was passiert beim Hinzufügen?",
	"tip.car_attach.text": "Die Integration gehört dann zu diesem Auto: Ladestand, Reichweite, Kilometerstand, ob es steckt, wo es ist und die Außentemperatur lese ich auch von dort. Hing sie an einem anderen Auto, nehme ich sie dort weg. Hattest du sie weggelassen, nutze ich sie wieder. Mit „Trennen“ machst du es rückgängig.",
	"car.trips": "Fahrten morgen",
	"car.trips.none": "Sobald ich die Nacht plane, steht hier, was morgen ansteht.",
	"car.values.none": "Noch keine Werte – unter Quellen siehst du, woher sie kommen sollen.",
	"car.value.unknown": "–",
	"car.value.plugged": "ja",
	"car.value.unplugged": "nein",
	"car.value.home": "zu Hause",
	"car.value.away": "unterwegs",
	"tip.car_now.title": "Was sehe ich hier?",
	"tip.car_now.text": "Die Werte des Autos, jeweils mit ihrer Quelle, wo es gerade steckt, Jetzt laden oder Heute Nacht laden, und was morgen ansteht.",
	"tip.car_steer.title": "Was stelle ich hier ein?",
	"tip.car_steer.text": "Alles, was das Auto braucht: Laden nach Bedarf, die Reserve, wie hoch ich höchstens lade und die Erinnerung am Abend. Welche Wallbox ich schalte, steht beim Ladepunkt.",
	"tip.car_terms.title": "Wozu die Termine?",
	"tip.car_terms.text": "Aus den Terminen weiß ich, wie weit das Auto morgen fährt. Wessen Termine zählen, wählst du hier.",
	"tip.car_save.title": "Was passiert beim Speichern?",
	"tip.car_save.text": "Ich plane die Nacht mit diesen Werten neu. Am Ladepunkt ändert sich nichts.",
	"devices.add.wallbox": "Wallbox",
	"devices.add.wallbox.text": "Ich schalte sie nachts ein und lade das Auto, das gerade steckt.",
	"devices.add.car.title": "Auto |hinzufügen",
	"devices.add.car.lead": "Diese Autos sehe ich in Home Assistant. Zeigen evcc und der Hersteller dasselbe Auto, führe ich sie zusammen – oder frage dich.",
	"devices.add.car.none": "Ich sehe kein weiteres Auto.",
	"devices.add.car.by_hand": "Oder ein Auto von Hand anlegen",
	"devices.add.car.name": "Name des Autos",
	"devices.add.car.make": "Anlegen",
	"tip.devices_add_car.title": "Woher kenne ich die Autos?",
	"tip.devices_add_car.text": "Aus evcc (seine Fahrzeuge) und aus den Integrationen der Hersteller, etwa Hyundai, BMW oder Tesla. Ein Auto, das in beiden steht, wird eines.",
	"tip.devices_add_car_hand.title": "Wann von Hand?",
	"tip.devices_add_car_hand.text": "Für ein Auto ohne Integration, etwa das eines Freundes, das öfter hier lädt. Seine Sensoren wählst du danach unter Quellen – oder lässt sie leer.",
	"devices.car.cars": "Autos",
	"devices.car.points": "Ladepunkte",
	"devices.group_add.wallbox": "Wallbox hinzufügen",
	"devices.charge.guessed": "Ich nehme an, dass dieses Auto an {point} steckt. Stimmt das nicht, sag es mir beim Ladepunkt.",
	"devices.charge.label_at": "Laden an {point} bis",
	"devices.charge.no_level": "Ladestand und Reichweite von {car} kenne ich gerade nicht – unter Quellen siehst du, woher sie kommen.",
	"devices.charge.not_plugged": "{car} steckt gerade nicht. Sobald es an einer Wallbox hängt, kannst du hier laden.",
	"devices.action.why.guest": "Ein Gast lädt – ich lasse die Wallbox in Ruhe, evcc macht, was eingestellt ist.",
	"devices.action.why.unknown_car": "Ich weiß nicht, welches Auto steckt – bis du es mir sagst, lasse ich die Wallbox in Ruhe.",
	"devices.action.why.not_plugged": "Heute nicht: kein Auto eingesteckt.",
	"plan.car_at": "{car} · an {point}",
	"plan.car_away.missing": "Steckt nicht – lädt heute Nacht nicht, obwohl morgen etwas fehlt.",
	"plan.car_away.enough": "Steckt nicht – braucht für morgen aber auch nichts.",
	"point.ask": "Welches Auto hängt an der Wallbox „{point}“?",
	"point.ask.text": "Bis ich es weiß, lasse ich die Wallbox in Ruhe.",
	"point.f.cars": "Welche Autos hier laden dürfen",
	"point.f.no_cars": "Noch kein Auto – lege eins unter „Auto hinzufügen“ an. Bis dahin schalte ich die Wallbox nach der Sonne.",
	"point.f.unknown": "Wenn ich das Auto nicht erkenne",
	"point.f.unknown.hint": "Erkennen heißt: evcc sagt es mir, der Stecker-Sensor des Autos zeigt es, oder nur ein Auto ist zu Hause.",
	"point.f.assume": "Welches Auto ich annehme",
	"point.unknown.ask": "fragen",
	"point.unknown.assume": "immer annehmen",
	"point.forget": "Selbst erkennen lassen",
	"point.guest": "Gast / anderes Auto",
	"point.open_car": "Zu {car}",
	"point.other_car": "Ein anderes Auto?",
	"point.state.car": "{car} steckt ({how})",
	"point.state.empty": "frei – kein Auto eingesteckt",
	"point.state.guest": "Gast / anderes Auto – ich schalte hier nichts",
	"point.state.unknown": "ein Auto, das ich nicht erkenne",
	"point.state.free": "lädt nach der Sonne (noch kein Auto angelegt)",
	"point.state.none": "noch nicht gelesen",
	"point.how.evcc": "erkannt über evcc",
	"point.how.plugged": "laut Stecker-Sensor des Autos",
	"point.how.home": "das einzige Auto zu Hause",
	"point.how.answer": "du hast es gesagt",
	"point.how.assume": "so eingestellt",
	"tip.point_cars.title": "Welche Autos dürfen hier laden?",
	"tip.point_cars.text": "Standard: alle. Lädt hier nur ein bestimmtes Auto, erkenne ich es sicherer und frage seltener.",
	"tip.point_unknown.title": "Was, wenn ich das Auto nicht erkenne?",
	"tip.point_unknown.text": "„Fragen“: Ich lasse die Wallbox in Ruhe und frage dich – aufs Handy und unter Übersicht. „Immer annehmen“: Ich nehme dieses Auto an und lade nach seinem Bedarf.",
	"tip.point_unknown.hint": "Ein Gast: Antworte „Gast / anderes Auto“ – dann macht evcc, was eingestellt ist.",
	"tip.point_which.title": "Woran erkenne ich das Auto?",
	"tip.point_which.text": "Der Reihe nach: das Fahrzeug, das evcc am Ladepunkt zeigt; der Stecker-Sensor des Autos; das einzige Auto, das zu Hause ist. Sonst frage ich dich. Deine Antwort gilt, bis das Auto wieder ausgesteckt wird.",
	"tip.point_now.title": "Was sehe ich hier?",
	"tip.point_now.text": "Welches Auto gerade steckt und woher ich das weiß. Liege ich falsch, sag mir das richtige Auto.",
	"tip.point_steer.title": "Was stelle ich hier ein?",
	"tip.point_steer.text": "Was ich an der Wallbox schalte (bei evcc den Modus, nicht evccs eigenen Ladeplan), wann ich sie einschalte, welche Autos hier laden dürfen und was ich mit einem Auto tue, das ich nicht erkenne.",
	"settings.notify.cars": "Autos",
	"settings.notify.cars.hint": "Welches Auto an der Wallbox hängt, wenn ich es nicht erkenne – und abends, wenn ein Auto für morgen nicht steckt.",
	"tip.notify_cars.title": "Was frage ich zu den Autos?",
	"tip.notify_cars.text": "Steckt ein Auto an, das ich nicht erkenne, frage ich mit einem Knopf je Auto und „Gast“. Abends erinnere ich dich, wenn ein Auto für morgen laden müsste, aber nicht steckt. Die Uhrzeit stellst du beim Auto ein.",
	"signpost.wallbox": "Ladepunkt / Wallbox",
	"signpost.wallbox.terms": "Wallbox, Ladepunkt, Ladestation, evcc, Modus, welches Auto steckt, Gast, fremdes Auto, Auto erkennen",
	"signpost.car_sources": "Quellen eines Autos",
	"signpost.car_sources.terms": "evcc, Hyundai, Hersteller, Integration, zusammenführen, trennen, Quelle hinzufügen, nochmal suchen, weggelassen, Ladestand, Kilometerstand",
	"signpost.car_reminder": "Erinnerung: Auto einstecken",
	"signpost.car_reminder.terms": "Erinnerung, einstecken, abends, steckt nicht, Benachrichtigung",
	"devices.hot_water.lonely": "Diesen Warmwasser-Zähler kenne ich aus deinem Energie-Dashboard. Richte einmal ein, was ich schalte – dann heize ich in der günstigen Zeit auf.",
	"devices.hot_water.set_up": "Warmwasser einrichten",
	"devices.other.night_offer": "Soll ich das Gerät nachts in der günstigen Zeit einschalten, wenn morgen die Sonne nicht reicht?",
	"devices.other.night_add": "Einrichten →",
	"devices.other.no_meter": "Für dieses Gerät kenne ich keinen Zähler. Unter Steuern bei „Gehört zu“ kannst du einen aus dem Energie-Dashboard wählen.",
	"devices.moved_to": "steht jetzt unter {group} →",
	"devices.meter": "Zähler",
	"action.steer.unsaved": "Noch nicht gespeichert.",
	"action.delete.ask.car": "Soll ich das Laden von „{name}“ wirklich vergessen? Das Auto bleibt in Home Assistant, ich lade es nur nicht mehr.",
	"action.delete.ask.hot_water": "Soll ich „{name}“ wirklich nicht mehr steuern? Der Boiler bleibt in Home Assistant, ich heize nur nicht mehr vor.",
	"action.delete.ask.other": "Soll ich „{name}“ wirklich nicht mehr nachts einschalten? Das Gerät bleibt in Home Assistant.",
	"action.delete.yes": "Ja, löschen",
	"action.delete.no": "Nein, behalten",
	"action.title.ev": "Laden |einrichten",
	"action.title.hot_water": "Warmwasser |einrichten",
	"action.title.custom": "Nachts |einschalten",
	"action.need.person_open": "Ansehen →",
	"action.need.person_open_of": "{name} unter Haushalt ansehen",
	"action.need.people_link": "Zu Wer wohnt hier →",
	"action.need.routing_link": "Routendienst wählen →",
	"tip.devices_lonely_hot_water.title": "Warum steht hier „einrichten“?",
	"tip.devices_lonely_hot_water.text": "Aus dem Energie-Dashboard weiß ich, wie viel das Warmwasser zieht. Damit ich es nachts günstig vorheize, brauche ich noch, was ich schalte und welcher Fühler die Temperatur misst. Das richtest du einmal ein.",
	"devices.problem.gone": "Finde ich in Home Assistant nicht mehr.",
	"devices.unassigned": "Nicht zugeordnet",
	"devices.unassigned.text": "Bei diesen Zählern weiß ich nicht, zu welchem Klimagerät sie gehören. Tipp auf einen: Dort ordnest du ihn einem Klimagerät zu oder sagst mir, was er misst.",
	"devices.card.unassigned": "Zu welchem Gerät gehört das?",
	"devices.card.unassigned_kind": "Sag mir, was er misst.",
	"devices.group_add.car": "Auto hinzufügen",
	"devices.group_add.hot_water": "Warmwasser hinzufügen",
	"devices.group_add.night": "Gerät hinzufügen",
	"climate.assign.no_climate": "Ich kenne noch kein Thermostat und keine Klimaanlage, zu der er gehören könnte. Sag mir unten, was er misst.",
	"devices.card.setup_car": "Laden ist noch nicht eingerichtet.",
	"devices.card.setup_hot_water": "Warmwasser ist noch nicht eingerichtet.",
	"devices.card.climate": "{current} °C · soll {target} °C",
	"devices.card.temp": "{value} °C",
	"devices.card.kw": "{value} kW",
	"devices.card.running": "Läuft gerade",
	"devices.card.import": "bezieht {value} kW",
	"devices.card.export": "speist {value} kW ein",
	"devices.grid.connection": "Netzanschluss & Tarif",
	"devices.grid.solar": "Solaranlage",
	"devices.grid.home": "Hausverbrauch",
	"grid.lead": "Woher dein Strom kommt, was er kostet und wo er bleibt: Netzanschluss, Stromtarif, Solaranlage und der Verbrauch im Haus.",
	"grid.energy.none": "Im Energie-Dashboard von Home Assistant ist noch nichts eingetragen. Trägst du dort Netz, PV und Speicher ein, finde ich sie von selbst.",
	"grid.energy.open": "Energie-Dashboard öffnen",
	"grid.connection": "Netzanschluss",
	"grid.connection.say": "Der Netzzähler misst, was am Hausanschluss hereinkommt und hinausgeht. Daran sehe ich, ob meine Pläne aufgehen.",
	"grid.tariff.say": "Wann Strom günstig ist und was er kostet. Danach entscheide ich, wann ich lade und ob es sich lohnt.",
	"grid.tariff.unknown": "Deinen Tarif kenne ich noch nicht. Trag ihn unten ein, dann rechne ich mit deinen echten Preisen.",
	"grid.tariff.unsaved": "Noch nicht gespeichert.",
	"grid.tariff.discard": "Verwerfen",
	"grid.solar.say": "Was deine Anlage gerade liefert und was die Prognose für morgen erwartet.",
	"grid.solar.factor": "Gelernter Faktor für die Prognose",
	"grid.home.say": "Was im Haus gerade verbraucht wird. Daraus lerne ich, wie viel ihr wann braucht.",
	"grid.home.devices": "Geräte zuordnen →",
	"tip.grid_tariff.title": "Wie stelle ich den Tarif ein?",
	"tip.grid_tariff.text": "Wähl zuerst die Art deines Tarifs. Dann trägst du die günstige Zeit, die Preise und die Einspeisevergütung ein.\nDie Felder hängen zusammen. Darum übernehme ich erst alles, wenn du auf **Speichern** tippst. **Verwerfen** holt den gespeicherten Tarif zurück.",
	"tip.grid_tariff.hint": "Die Preise stehen auf deiner Stromrechnung.",
	"devices.page.now": "Jetzt",
	"devices.page.steer": "Steuern",
	"devices.page.power": "Strom",
	"devices.page.learned": "Gelernt",
	"devices.page.log": "Protokoll",
	"devices.page.intruders": "Störenfriede",
	"devices.page.remove": "Weglassen",
	"devices.page.delete": "Löschen",
	"devices.page.more_learned": "Mehr im Rückblick →",
	"devices.page.more_log": "Alles im Rückblick →",
	"devices.add": "Hinzufügen",
	"devices.add.label": "Gerät hinzufügen",
	"devices.add.title": "Was möchtest du |hinzufügen?",
	"devices.add.lead": "Such dir aus, was dazukommt. Ich zeige dir dann, was ich dafür schon gefunden habe.",
	"devices.add.battery": "Speicher",
	"devices.add.battery.text": "Ein Hausspeicher, den ich beobachten oder steuern soll.",
	"devices.add.car": "Auto",
	"devices.add.for": "für {name}",
	"devices.add.car.text": "Wie weit es morgen fährt, Ladestand, Termine – alles, was es braucht.",
	"devices.add.hot_water": "Warmwasser",
	"devices.add.hot_water.text": "Ich heize das Wasser in der günstigen Zeit auf.",
	"devices.add.climate": "Klimagerät oder Heizung",
	"devices.add.climate.text": "Thermostate und Klimaanlagen stehen unter Heizung & Klima.",
	"devices.add.night": "Gerät, das nachts laufen soll",
	"devices.add.night.text": "Ich schalte es in der günstigen Zeit ein, wenn morgen die Sonne nicht reicht.",
	"devices.add.meter": "Gerät mit Zähler",
	"devices.add.meter.text": "Zähler aus dem Energie-Dashboard: Sag mir, was es ist und wann es läuft.",
	"devices.add.rediscover": "Nochmal umschauen",
	"devices.add.rediscover.text": "Ich suche in Home Assistant nach neuen Geräten.",
	"devices.add.other": "Andere Auswahl",
	"devices.add.battery.title": "Speicher |hinzufügen",
	"devices.add.battery.lead": "Diese Speicher habe ich gefunden. Fehlt deiner, such dir seinen Ladezustand selbst aus.",
	"devices.add.battery.none": "Ich habe keinen weiteren Speicher gefunden.",
	"devices.add.battery.pick": "Selbst auswählen",
	"devices.add.battery.ignored": "hast du weggelassen",
	"devices.add.battery.use": "Wieder nutzen",
	"devices.found": "Neu gefunden",
	"devices.found.lead": "Das habe ich neu in Home Assistant entdeckt. Soll ich es nutzen?",
	"devices.found.battery": "Speicher",
	"devices.found.wallbox": "Wallbox",
	"devices.found.car": "Auto",
	"devices.found.use": "Übernehmen",
	"devices.found.ignore": "Nicht nutzen",
	"tip.devices_add.title": "Was kann ich hinzufügen?",
	"tip.devices_add.text": "Alles, was Strom speichert, lädt oder verbraucht: Speicher, Auto oder Wallbox, Warmwasser, Klimageräte und Geräte, die nachts laufen sollen.\nIch zeige dir zuerst, was ich schon gefunden habe. Du musst nichts von Hand eintippen.",
	"tip.device_steer.title": "Was stelle ich unter Steuern ein?",
	"tip.device_steer.text": "Hier legst du fest, was ich schalte und wann ich das Gerät nachts in der günstigen Zeit einschalte. Jedes Feld hat seine eigene Erklärung.\nWas du hier änderst, gilt erst nach „Speichern“. Bis dahin bleibt dein Entwurf stehen, auch wenn du die Seite verlässt.",
	"tip.devices_found.title": "Was heißt Übernehmen?",
	"tip.devices_found.text": "**Übernehmen** nimmt das Gerät dazu. Einen Speicher beobachte ich ab sofort, bei Auto und Wallbox richtest du kurz das Laden ein.\n**Nicht nutzen** blendet es aus. Über **Hinzufügen** holst du es jederzeit zurück.",
	"devices.lead": "Alles mit Strom an einem Ort: Speicher, Heizung & Klima, Auto & Laden, Warmwasser, Weitere Geräte, Netz & Sonne. Tipp auf ein Gerät, dann siehst du alles darüber.",
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
	"devices.status.day_buffer": "Netzdienlich: Ich lade erst bis {level} % als Puffer für dich, dann bekommt das Netz die Morgensonne – ab {time} Uhr lade ich voll.",
	"devices.status.done": "Die Nacht ist vorbei, alles ist zurückgestellt.",
	"devices.pending": "Ein paar Werte stehen noch nicht wieder auf ihrem Ausgangswert. Ich versuche es weiter.",
	"devices.power.charge": "lädt mit {value} kW",
	"devices.power.discharge": "entlädt mit {value} kW",
	"devices.power.idle": "ruht",
	"devices.release": "Sofort freigeben",
	"devices.batteries.none": "Ich kenne noch keinen Speicher. Hast du einen, füg ihn mit „Speicher hinzufügen“ hinzu.",
	"devices.battery.profile": "{name} – erkannt",
	"devices.battery.generic": "Regler zugeordnet",
	"devices.battery.steps": "Eigene Schritte",
	"devices.battery.watch": "Nur beobachten",
	"devices.action.charge": "Lädt auf {target} %",
	"devices.action.hold": "Hält bei {floor} %",
	"devices.action.block": "Entladen gesperrt, solange ein anderer lädt",
	"devices.action.defer": "Lädt erst ab {until} Uhr – die Morgensonne geht ins Netz",
	"devices.action.buffer": "Lädt aus der Sonne bis {level} % – dein Puffer für den Vormittag",
	"devices.action.defer_buffer": "Puffer {level} % da – lädt erst ab {until} Uhr weiter, die Morgensonne geht ins Netz",
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
	"battery.page.lead": "Wie voll deine Speicher sind, was ich gerade mit ihnen mache und welche Regeln für alle gelten. Tipp auf einen Speicher, dann siehst du alles über ihn.",
	"battery.page.add": "Speicher hinzufügen",
	"battery.page.suggested": "Regler gefunden, die passen könnten.",
	"battery.page.rules": "Gilt für alle Speicher",
	"battery.page.found": "Gefunden, aber nicht genutzt",
	"battery.page.found.new": "neu gefunden",
	"battery.page.how": "So steuere ich ihn",
	"battery.page.capacity.learned": "Gemessen habe ich {value} kWh nutzbar.",
	"battery.page.capacity.learning": "Ich messe die Größe beim Laden und Entladen. Das dauert ein paar Wochen.",
	"battery.page.remove.text": "Lass ich den Speicher weg, plane und steuere ich ohne ihn. Habe ich ihn selbst gefunden, holst du ihn unter „Speicher hinzufügen“ mit „Wieder nutzen“ zurück.",
	"battery.page.remove.confirm": "{name} wirklich weglassen? Was du hier für ihn eingestellt hast, geht dabei verloren.",
	"battery.page.remove.go": "Ja, weglassen",
	"battery.control.title": "Regler für |{name}",
	"battery.control.lead": "Hier legst du fest, über welche Regler ich den Speicher lade und halte. Erst mit „Speichern“ übernehme ich die Änderung.",
	"battery.control.unsaved": "Noch nicht gespeichert.",
	"tip.battery_rules.title": "Was gilt für alle Speicher?",
	"tip.battery_rules.text": "Diese Regeln gelten für alle Speicher zusammen. Du siehst sie hier, ändern kannst du sie in Joes Einstellungen – „Ändern →“ bringt dich direkt hin.\nDie **Reserve** gilt für alle Speicher, die **Entladegrenze** auf der Seite eines Speichers nur für ihn. Es gilt immer die höhere von beiden.",
	"tip.battery_found.title": "Was heißt Wieder nutzen?",
	"tip.battery_found.text": "Diese Speicher habe ich in Home Assistant gefunden, nutze sie aber nicht.\n**Übernehmen** nimmt einen neuen Speicher dazu, **Nicht nutzen** blendet ihn aus.\n**Wieder nutzen** holt einen Speicher zurück, den du weggelassen hast.",
	"tip.battery_intruders.title": "Was sind Störenfriede?",
	"tip.battery_intruders.text": "Automationen, die etwas an genau diesem Speicher setzen. Setzen sie dieselben Werte wie ich, gewinnt, wer zuletzt schreibt – dann hält sich der Speicher nicht an meinen Plan.\n„Alle ausschalten“ schaltet nur die Automationen dieses Speichers aus, „Wieder einschalten“ genau die, die ich ausgeschaltet habe.",
	"tip.battery_intruders.hint": "Alle Automationen an deinen Speichern stehen unter Geräte › Speicher.",
	"tip.battery_remove.title": "Was heißt Weglassen?",
	"tip.battery_remove.text": "Ich nutze den Speicher dann nicht mehr: kein Plan, keine Steuerung, kein Lernen. Am Gerät und in Home Assistant ändert sich nichts.",
	"tip.battery_remove.hint": "Einen Speicher, den ich selbst gefunden habe, holst du unter „Speicher hinzufügen“ zurück.",
	"surplus.loadpoint.any": "den evcc-Ladepunkt",
	"surplus.loadpoint.named": "den Ladepunkt „{names}“",
	"surplus.line.cap": "Die Speicher laden bis {time} Uhr nur mit {kw} kW – der Rest der Sonne bleibt für {loadpoint}.",
	"surplus.line.cap_dry": "Ich würde die Speicher bis {time} Uhr nur mit {kw} kW laden – der Rest der Sonne bliebe für {loadpoint}. Schalten tue ich das nur im Live-Betrieb.",
	"surplus.expected": "Vorsichtig gerechnet bleiben etwa {kwh} kWh übrig; die Speicher sind trotzdem bis {time} Uhr voll.",
	"surplus.doing": "Speicher laden tagsüber nur mit {kw} kW – die übrige Sonne geht an {loadpoint} (bis {time} Uhr)",
	"surplus.state.off": "Ausgeschaltet.",
	"surplus.state.no_plan": "Gerade habe ich keine Vorhersage für heute – die Speicher laden normal.",
	"surplus.state.night": "Jetzt ist Nacht – tagsüber schaue ich wieder.",
	"surplus.state.released": "Für heute habe ich losgelassen – die Speicher laden normal.",
	"surplus.state.morning": "Erst läuft der netzdienliche Morgen, danach übernehme ich.",
	"surplus.state.no_sun": "Heute reicht die Sonne nicht für Überschuss – die Speicher laden normal.",
	"surplus.state.after_pv": "Die Sonne reicht heute nicht mehr fürs Haus – die Speicher laden normal.",
	"surplus.state.full": "Die Speicher sind voll – da gibt es nichts zu drosseln.",
	"surplus.state.not_reachable": "Vorsichtig gerechnet reicht die Sonne heute nicht für volle Speicher und mehr – sie laden normal.",
	"surplus.state.no_need": "Die Sonne reicht nur knapp – Drosseln lohnt sich gerade nicht.",
	"surplus.state.no_battery": "Kein Speicher kann mitmachen: Er braucht eine Ladegrenze in W oder kW und einen bestandenen Testlauf.",
	"surplus.state.no_loadpoint": "Kein evcc-Ladepunkt steht auf PV oder Min+PV und kann Strom nehmen – die Speicher laden normal.",
	"surplus.state.soon": "Sobald die Sonne mehr bringt, als das Haus braucht, fange ich an.",
	"surplus.conflict.title": "evcc arbeitet gegen „Tagsüber Überschuss abgeben“.",
	"surplus.conflict.buffer_soc": "In evcc ist batterieunterstütztes Laden ab {value} % an: evcc darf dann den Speicher für den Ladepunkt leeren.",
	"surplus.conflict.buffer_start_soc": "In evcc startet das Laden ab {value} % Speicherstand auch ohne Überschuss – mit Strom aus dem Speicher.",
	"surplus.conflict.battery_boost": "Bei {loadpoint} ist in evcc der Batterie-Boost an: der Ladepunkt zieht dann Strom aus dem Speicher.",
	"surplus.conflict.hint": "Schalte das in evcc bei der Hausbatterie aus – ich ändere an evcc nichts.",
	"surplus.problem": "Tagsüber Überschuss:",
	"tip.surplus_evcc.title": "Warum arbeitet evcc dagegen?",
	"tip.surplus_evcc.text": "Ich drossle das Laden der Speicher, damit sie gerade rechtzeitig voll werden und der Rest der Sonne an evcc geht. Darf evcc aber selbst Strom aus dem Speicher nehmen (batterieunterstütztes Laden oder Batterie-Boost), leert evcc tagsüber genau den Speicher, den ich voll haben will – am Abend fehlt er dann. Bei Omnibattery halten Ladeverzögerung und prädiktives Laden das Laden selbst zurück – zusammen mit meiner Grenze wird der Speicher womöglich nicht mehr voll.",
	"tip.surplus_evcc.hint": "Die Einstellungen findest du in evcc bei der Hausbatterie und am Ladepunkt. Ich lese sie nur und schreibe sie nicht.",
	"plan.day_surplus": "Heute tagsüber",
	"plan.day_surplus.battery": "{name} {kw} kW",
	"tip.plan_day_surplus.title": "Was passiert heute tagsüber?",
	"tip.plan_day_surplus.text": "Mit „Tagsüber Überschuss abgeben“ laden die Speicher nur so schnell, dass sie voll sind, bevor die Sonne abends nicht mehr fürs Haus reicht. Hier steht, mit wie viel Leistung, bis wann und für welchen evcc-Ladepunkt – oder warum gerade nicht. Ich rechne das jede Minute neu: mit dem echten Ladestand und der echten Sonne.",
	"tip.plan_day_surplus.hint": "Die übrigen kWh sind vorsichtig gerechnet; scheint die Sonne wie vorhergesagt, bleibt mehr.",
	"battery.surplus.label": "Macht tagsüber mit",
	"battery.surplus.no_limit": "Geht bei diesem Speicher nicht: Ich kann seine Ladeleistung nicht begrenzen, ohne seine eigene Regelung abzuschalten. Er lädt weiter mit voller Leistung.",
	"battery.surplus.unit": "Geht bei diesem Speicher nicht: Seine Ladegrenze ist in Ampere (oder ohne Einheit). Daraus kann ich keine sichere Leistung machen – lieber lade ich ihn normal, als ihn zu stark zu bremsen.",
	"battery.surplus.unavailable": "Seine Ladegrenze ist gerade nicht erreichbar – er lädt normal.",
	"battery.surplus.unknown": "Ladestand oder Größe kenne ich gerade nicht – er lädt normal.",
	"team.title": "Mehrere Speicher",
	"team.together": "{first} mit {rest}",
	"team.question": "Wie sollen die Speicher zusammenarbeiten?",
	"team.mode.sequence": "Nacheinander (empfohlen)",
	"team.mode.together": "Gleichzeitig",
	"team.now": "Gerade frei: {parts}",
	"team.now.dry": "Im Live-Betrieb wäre jetzt: {parts}",
	"team.part.active_charging": "{name} lädt",
	"team.part.active_discharging": "{name} entlädt",
	"team.part.active_idle": "{name} ist dran",
	"team.part.active_charge_only": "{name} lädt (Entladen gesperrt, solange beide laden)",
	"team.part.waits_full": "{name} gesperrt (wartet, bis {active} voll ist)",
	"team.part.waits_empty": "{name} gesperrt (wartet, bis {active} leer ist)",
	"team.part.full": "{name} gesperrt (voll)",
	"team.part.empty": "{name} gesperrt (leer)",
	"team.part.parallel": "{name} lädt mit (nur laden)",
	"team.parallel": "Heute laden beide nebeneinander: Nacheinander würde die Sonne nicht reichen, bis sie untergeht.",
	"team.state.off": "Ich bin ausgeschaltet – jeder Speicher regelt sich selbst.",
	"team.state.together": "Gleichzeitig: Jeder Speicher regelt sich selbst, ich greife nicht ein.",
	"team.state.single": "Nur ein Speicher regelt sich selbst – da gibt es nichts abzustimmen.",
	"team.state.one_group": "Alle Speicher regelt dasselbe System – es verteilt die Leistung selbst. Tagsüber muss ich nichts abstimmen, nur nachts steuere ich.",
	"team.state.night": "Nachts steuert mein Nachtplan die Speicher – tagsüber geht es wieder nacheinander.",
	"team.state.paused": "Heute pausiert („Sofort freigeben“) – morgen geht es wieder nacheinander.",
	"team.state.levers": "Ich kann nicht jeden Speicher sperren (eine Grenze fehlt oder ist nicht erreichbar) – deshalb sperre ich gerade keinen.",
	"team.state.not_tested": "Ich sperre erst, wenn jeder Speicher seinen Testlauf bestanden hat.",
	"team.state.unknown": "Den Ladestand eines Speichers kenne ich gerade nicht – ich sperre keinen.",
	"team.state.automation": "Deine Automationen {names} machen das bisher – ich lasse die Speicher in Ruhe.",
	"team.state.no_grid": "Ohne Netzzähler sehe ich nicht, ob das Haus Strom braucht oder abgibt – ich sperre keinen.",
	"team.state.not_taken": "Ich habe {names} gesperrt, aber die Sperre kam nicht an – deshalb sperre ich gerade keinen. In einer Stunde versuche ich es noch einmal.",
	"team.state.taking_over": "Deine Automationen {names} laufen noch. Passt bis {time} Uhr alles, schalte ich sie aus und stimme die Speicher wieder selbst ab.",
	"team.state.bridging": "{why} fehlt gerade kurz – ich lasse die Sperren bis {time} Uhr stehen. Ist der Wert dann nicht zurück, gebe ich sie frei, und deine Automationen laufen wieder.",
	"team.gap.unknown": "Ein Ladestand",
	"team.gap.levers": "Eine Grenze eines Speichers",
	"team.gap.no_grid": "Der Netzzähler",
	"team.state.error": "Ich konnte gerade nicht sicher entscheiden – ich sperre keinen, deine Automationen laufen wieder.",
	"team.mode.default": "Standard",
	"team.default": "Ich sorge dafür, dass immer nur ein System arbeitet – sonst laden sich die Speicher gegenseitig. Willst du das nicht, wähle „Gleichzeitig“.",
	"team.given_back.title": "Deine Speicher-Automationen laufen wieder",
	"team.given_back": "Ich konnte die Speicher nicht selbst sperren ({why}) – deine Automationen {names} laufen wieder. Sobald es wieder geht, übernehme ich.",
	"team.given_back.choice": "Deine Automationen {names} laufen wieder ({why}) – ich stimme die Speicher gerade nicht selbst ab.",
	"team.given_back.why.off": "ich bin ausgeschaltet",
	"team.given_back.why.dry": "ich bin nicht im Live-Betrieb",
	"team.given_back.why.together": "du hast „Gleichzeitig“ gewählt",
	"team.given_back.why.paused": "heute freigegeben",
	"team.given_back.why.levers": "ein Speicher lässt sich nicht sperren",
	"team.given_back.why.not_tested": "ein Testlauf fehlt",
	"team.given_back.why.unknown": "ein Ladestand ist unbekannt",
	"team.given_back.why.no_grid": "der Netzzähler fehlt",
	"team.given_back.why.automation": "eine andere Automation steuert die Speicher",
	"team.given_back.why.not_taken": "eine Sperre kam nicht an",
	"team.given_back.why.error": "ein Fehler",
	"team.given_back.unblocked": "Gerade sperrt niemand: Deine Automationen greifen erst, wenn ihre Bedingung neu eintritt – bis dahin können sich die Speicher gegenseitig laden.",
	"team.hold.discharge": "{name} entlädt noch – ich halte meine Sperre, bis das aufhört. Erst dann schalte ich deine Automationen {names} wieder ein.",
	"team.hold.charge": "{name} lädt noch – ich halte meine Sperre, bis das aufhört. Erst dann schalte ich deine Automationen {names} wieder ein.",
	"tip.team_hold.title": "Warum halte ich die Sperre noch?",
	"tip.team_hold.text": "Deine Automationen reagieren meist erst, wenn etwas neu beginnt – etwa „Venus entlädt mehr als 120 W“. Läuft das schon, wenn sie wieder an sind, sperren sie nichts. Darum halte ich meine Sperre, bis der Speicher aufhört, und gebe erst dann ab.",
	"tip.team_hold.hint": "Höchstens 12 Stunden. Bei „Sofort freigeben“, einem Moduswechsel oder wenn ich nicht mehr schreiben kann, gebe ich sofort ab.",
	"tip.team_default.title": "Warum mache ich das von selbst?",
	"tip.team_default.text": "Du hast zwei Systeme, die ihre Speicher selbst auf 0 W am Netzzähler regeln. Arbeiten beide zugleich, wandert Strom von einem Speicher in den anderen – mit Verlusten. Darum lasse ich immer nur eins arbeiten und sperre das andere vorher.",
	"tip.team_default.hint": "Abschalten: „Gleichzeitig“ wählen. Dann greife ich nicht ein.",
	"tip.team_given_back.title": "Warum laufen meine Automationen wieder?",
	"tip.team_given_back.text": "Ich schalte deine Speicher-Automationen nur aus, solange ich die Aufgabe wirklich selbst erledige. Kann ich nicht sperren – oder kommt eine Sperre nicht an –, schalte ich sie sofort wieder ein, damit deine Speicher nicht ungeschützt gegeneinander arbeiten.",
	"tip.team_given_back.hint": "Geht es wieder, warte ich 15 Minuten und übernehme dann von selbst. Mit „Gleichzeitig“ bleiben sie ganz bei dir.",
	"team.doing": "Speicher nacheinander: {active} ist dran, {others} wartet",
	"team.doing.parallel": "Speicher laden heute nebeneinander ({active}, {others}) – nacheinander würden sie nicht voll",
	"team.automations": "Deine Automationen {names} machen das bisher – ich kann sie ausschalten, dann übernehme ich.",
	"team.automations.go": "Zu den Automationen",
	"guard.title": "Speicher-Wächter",
	"guard.watching": "Ich passe auf, dass sich die Speicher nicht gegenseitig laden. Bisher war nichts.",
	"guard.state.off": "Ausgeschaltet – ich greife nicht ein, wenn sich die Speicher gegenseitig laden.",
	"guard.state.mode_off": "Ich bin gerade aus – der Wächter ruht.",
	"guard.state.single": "Ich brauche die Leistung von mindestens zwei Speichern, um aufzupassen.",
	"guard.automation": "Deine Automation {names} macht das bisher – ich halte mich raus. Schaltest du sie aus, übernehme ich.",
	"guard.last.running.1": "{time}: Die Speicher liefen gegeneinander – ich habe die eigene Regelung von {battery} neu gestartet.",
	"guard.last.running.2": "{time}: Die Speicher liefen gegeneinander – ich habe bei {battery} {direction} 5 s gesperrt.",
	"guard.last.alarm": "{time}: Die Speicher laufen weiter gegeneinander, auch nach Neustart und kurzer Sperre – schau bitte nach.",
	"guard.last.fixed.1": "{time}: Die Speicher liefen gegeneinander – behoben, nachdem ich die eigene Regelung von {battery} neu gestartet habe (nach {duration}).",
	"guard.last.fixed.2": "{time}: Die Speicher liefen gegeneinander – behoben nach kurzer Sperre bei {battery} (nach {duration}).",
	"guard.last.fixed.3": "{time}: Die Speicher liefen {duration} gegeneinander – inzwischen nicht mehr.",
	"guard.last.automation": "{time}: Die Speicher liefen gegeneinander – deine Automation hat sich darum gekümmert.",
	"guard.last.joe": "{time}: Die Speicher liefen gegeneinander, während ich selbst gesteuert habe – da greife ich nicht ein.",
	"guard.last.inside": "{time}: {charging} lud, während {discharging} entlud – beide regelt dasselbe System. Da greife ich nicht ein; schau bitte in dessen Einstellungen nach.",
	"guard.inside.title": "Speicher eines Systems laden sich gegenseitig",
	"guard.inside": "{charging} lädt, während {discharging} entlädt – beide regelt dasselbe System. Da greife ich nicht ein: Schau bitte in dessen Einstellungen nach.",
	"guard.dry": "So würde ich es im Live-Betrieb machen – gerade schreibe ich nichts.",
	"guard.direction.charge": "das Laden",
	"guard.direction.discharge": "das Entladen",
	"guard.seconds": "{n} s",
	"guard.minutes": "{n} min",
	"guard.alarm.title": "Speicher laden sich gegenseitig",
	"guard.alarm": "{charging} lädt, während {discharging} entlädt – auch nachdem ich die Regelung neu gestartet und den Speicher kurz gesperrt habe. Schau bitte nach, ob etwas anderes dieselben Grenzen schreibt.",
	"tip.guard.title": "Was ist der Speicher-Wächter?",
	"tip.guard.text": "Laden sich zwei Speicher gegenseitig – einer lädt mit mehr als 20 W, der andere entlädt mit mehr als 20 W, 20 Sekunden lang –, greife ich in drei Schritten ein: Regelung neu starten, die Richtung 5 Sekunden sperren, dir Bescheid geben. Hier steht, wann es zuletzt war und was geholfen hat.",
	"tip.guard.hint": "Ein- und ausschalten kannst du ihn unter Einstellungen › Regeln › Speicher. Alles, was ich dafür umschalte, stelle ich sofort zurück – auch nach einem Neustart.",
	"team.team_charge_order": "Laden: wer zuerst?",
	"team.team_discharge_order": "Entladen: wer zuerst?",
	"team.self_regulating": "Regelt sich selbst auf 0 am Zähler",
	"team.proposed": "Vorschlag",
	"team.group": "Wer regelt ihn?",
	"team.group.own": "Eigenes System",
	"team.group.with": "Zusammen mit {name}",
	"team.group.check": "Bitte prüfen",
	"team.groups.question": "Welche Speicher werden vom selben System geregelt?",
	"team.groups.question.text": "Bei {names} weiß ich es nicht sicher. Speicher, die dasselbe System regelt, arbeiten bei mir als eine Gruppe – abstimmen muss ich nur zwischen verschiedenen Systemen. Jetzt nehme ich an: jeder hat sein eigenes.",
	"team.groups.confirm": "Vorschlag passt",
	"team.cutoff.known": "Hört bei {value} % auf zu entladen – der nächste übernimmt 1,5 % vorher.",
	"team.cutoff.unknown": "Wo er wirklich aufhört zu entladen, lerne ich noch – bis dahin arbeitet er, bis er von selbst stoppt (eingestellt: {value} %).",
	"team.part.active_discharge_only": "{name} entlädt (Laden gesperrt, solange beide entladen)",
	"team.part.along": "{name} lädt mit (nur laden)",
	"team.part.helps": "{name} hilft beim Entladen (nur entladen)",
	"team.part.base": "{name} liefert die Grundlast ({w} W)",
	"team.day.today": "Heute",
	"team.day.yesterday": "Gestern",
	"team.day.on": "Am {date}",
	"team.reason.along.forecast": "{others} lädt mit, weil jetzt mehr Sonne kommt, als {active} allein aufnehmen kann. Entladen ist für beide gesperrt – so kann keiner den anderen laden.",
	"team.reason.along.export": "{others} lädt mit, weil gerade Sonne ins Netz ging, obwohl {others} noch Platz hat. Entladen ist für beide gesperrt – so kann keiner den anderen laden.",
	"team.reason.help": "{others} hilft beim Entladen, weil das Haus gerade mehr braucht, als {active} liefern kann. Laden ist für beide gesperrt.",
	"team.reason.base": "{others} liefert die Grundlast ({w} W), {active} den Rest.",
	"team.reason.plan": "Ab {time} Uhr lädt {others} mit – laut Vorhersage kommt dann mehr Sonne, als {active} allein aufnehmen kann.",
	"team.reason.plan.lead": "Ab {time} Uhr lädt {others} mit – laut Vorhersage kommt danach mehr Sonne, als {active} allein aufnehmen kann. Aus Erfahrung beginne ich {lead} Minuten früher.",
	"team.reason.dry": "(So wäre es im Live-Betrieb – jetzt schaue ich nur zu.)",
	"team.review.room": "{when}: {kwh} kWh gingen ins Netz, obwohl {name} erst {soc} % hatte.",
	"team.review.room_full": "{when}: {kwh} kWh gingen ins Netz, während ein Speicher noch wartete – voll wurden trotzdem alle.",
	"team.review.fine": "{when} ging keine Sonne ins Netz, solange ein Speicher noch Platz hatte.",
	"team.learned.none": "Gelernt habe ich noch nichts – ich schaue jeden Abend auf den Tag zurück.",
	"team.learned.no_lead": "Aus {days} Tagen gelernt: Früher mitladen ist nicht nötig.",
	"team.learned.lead": "Aus {days} Tagen gelernt: etwa {minutes} Minuten früher mitladen.",
	"team.suggest.title": "{when} gingen {kwh} kWh ins Netz, obwohl {name} nur {soc} % hatte.",
	"team.suggest.text": "Soll ich {name} künftig früher mitladen lassen? Aus den letzten Tagen weiß ich: etwa {minutes} Minuten früher reicht.",
	"team.suggest.yes": "Ja, früher mitladen",
	"team.suggest.no": "Nein",
	"team.style.title": "Selbst einstellen",
	"team.style.intro": "Für Fortgeschrittene. Normalerweise musst du hier nichts ändern.",
	"team.style.auto": "Automatisch (empfohlen)",
	"team.style.auto.text": "Nacheinander – aber der nächste lädt mit, wenn mehr Sonne kommt, als einer aufnehmen kann, und hilft bei großer Last.",
	"team.style.strict": "Nur nacheinander",
	"team.style.strict.text": "Immer nur einer – auch an schwachen Tagen. Der nächste wartet, bis der erste voll ist.",
	"team.style.base": "Grundlast teilen",
	"team.style.base.text": "Der nächste liefert ständig einen kleinen Sockel, der erste den Rest.",
	"team.style.base.warn": "Achtung: Bei kleinen Lasten verlierst du so mehr als nacheinander, weil Wechselrichter bei wenig Leistung schlecht arbeiten.",
	"team.style.base.no_lever": "Beim Speicher, der als Nächstes dran ist, kann ich keine Leistung vorgeben (seine Grenze ist in Prozent oder nur ein Schalter). Dann bleibt es nacheinander.",
	"team.early": "Aus Erfahrung früher mitladen",
	"team.early.unanswered": "Noch nicht entschieden",
	"tip.team_reason.title": "Warum arbeiten gerade zwei?",
	"tip.team_reason.text": "Normalerweise arbeitet immer nur einer. Kommt mehr Sonne, als er aufnehmen kann, darf der nächste mitladen – sonst ginge die Sonne ins Netz, obwohl noch Platz ist. Braucht das Haus mehr, als er liefern kann, darf der nächste mit entladen. Dabei sperre ich immer die andere Richtung für beide, damit keiner den anderen lädt.",
	"tip.team_reason.hint": "Bei einer Wolke sperre ich den zweiten sofort wieder.",
	"tip.team_review.title": "Mein Tagesrückblick",
	"tip.team_review.text": "Jeden Abend nach Sonnenuntergang schaue ich zurück: Wie viel Sonne ging ins Netz, während ein Speicher noch Platz hatte? Wie voll wurde jeder? Daraus lerne ich über viele Tage, wie früh der nächste mitladen sollte.",
	"tip.team_review.hint": "Tage ohne überschüssige Sonne (z. B. im Winter) ändern nichts am Gelernten.",
	"tip.team_style_auto.title": "Automatisch",
	"tip.team_style_auto.text": "Grundsätzlich nacheinander. Zeigt die Vorhersage mehr Sonne, als der erste aufnehmen kann, oder geht gerade Sonne ins Netz, lädt der nächste mit. Braucht das Haus länger als eine Minute mehr, als der erste liefern kann, entlädt der nächste mit. Danach wartet er wieder.",
	"tip.team_style_auto.hint": "Empfohlen – so geht am wenigsten Sonne ins Netz und keiner lädt den anderen.",
	"tip.team_style_strict.title": "Nur nacheinander",
	"tip.team_style_strict.text": "Immer nur ein Speicher arbeitet. Kein früheres Mitladen, keine Hilfe bei großer Last und auch an schwachen Tagen kein gemeinsames Laden.",
	"tip.team_style_strict.hint": "Dabei kann Sonne ins Netz gehen, obwohl der zweite noch Platz hätte, und an schwachen Tagen wird der zweite vielleicht nicht voll.",
	"tip.team_style_base.title": "Grundlast teilen",
	"tip.team_style_base.text": "Braucht das Haus Strom, liefert der nächste Speicher einen festen Sockel: den unteren Verbrauch der letzten halben Stunde (das, was fast immer läuft – nicht den Durchschnitt). Den Rest liefert der erste. Ich führe den Sockel laufend nach.",
	"tip.team_style_base.hint": "Geht nur, wenn ich beim nächsten Speicher die Entladeleistung in Watt vorgeben kann (z. B. Marstek über Omnibattery).",
	"tip.team_base_warn.title": "Warum ist das weniger effizient?",
	"tip.team_base_warn.text": "Ein Wechselrichter arbeitet bei wenig Leistung schlecht – er verliert dann einen größeren Teil. Liefern zwei Speicher je ein bisschen statt einer etwas mehr, gehen insgesamt mehr Kilowattstunden verloren.",
	"tip.team_base_warn.hint": "Sinnvoll eher, wenn ein Speicher geschont werden soll.",
	"tip.team_base_lever.title": "Warum geht das hier nicht?",
	"tip.team_base_lever.text": "Für einen Sockel muss ich die Entladeleistung des Speichers in Watt vorgeben können. Hat er nur eine Grenze in Prozent oder nur einen Schalter, kann ich das nicht.",
	"tip.team_base_lever.hint": "Ändere die Reihenfolge beim Entladen, damit ein passender Speicher als Nächstes dran ist.",
	"tip.team_early.title": "Früher mitladen?",
	"tip.team_early.text": "Ich lerne jeden Abend, ob Sonne ins Netz ging, während ein Speicher noch Platz hatte. Daraus weiß ich, wie viel früher der nächste mitladen sollte. Ja: Ich lasse ihn um diese Zeit früher mitladen. Nein: Ich lasse es, wie es ist, und frage nicht wieder.",
	"tip.team_early.hint": "Mitladen heißt nur laden – entladen ist dabei für beide gesperrt.",
	"tip.config_backup.title": "Frühere Einstellungen zurückholen?",
	"tip.config_backup.text": "Zurückholen: Ich prüfe die aufgehobenen Einstellungen und übernehme sie, wenn sie passen – deine Geräte, Regeln und was ich gelernt habe sind dann wieder da. Verwerfen: Ich lösche die Sicherung, und du richtest mich neu ein.",
	"tip.config_backup.hint": "Sobald du selbst etwas einstellst, frage ich nicht mehr.",
	"log.team_along": "{others} lädt mit (nur laden)",
	"log.team_along.forecast": "{others} lädt mit: Laut Vorhersage kommt mehr Sonne, als {active} allein aufnehmen kann",
	"log.team_along.export": "{others} lädt mit: Sonne ging ins Netz, obwohl noch Platz war",
	"log.team_along_end": "Mitladen beendet – wieder nacheinander",
	"log.team_along_end.flow": "Mitladen beendet: Das Haus braucht wieder Strom – wieder nacheinander",
	"log.team_along_end.less": "Mitladen beendet: weniger Sonne – wieder nacheinander",
	"log.team_help": "{others} hilft beim Entladen: Das Haus braucht {power} kW, mehr als {active} liefern kann",
	"log.team_help_end": "Große Last vorbei: {others} wartet wieder",
	"log.team_base": "{others} liefert jetzt die Grundlast ({watts} W)",
	"log.team_base_end": "Grundlast: {others} wartet wieder",
	"log.team_review": "Tagesrückblick: {energy} kWh ins Netz, während ein Speicher noch Platz hatte – gelernt: {lead} Minuten früher mitladen",
	"log.team_review.short": "Tagesrückblick: {energy} kWh ins Netz, obwohl {others} erst {soc} % hatte – gelernt: {lead} Minuten früher mitladen",
	"battery.surplus.team_wait": "Wartet, bis der andere Speicher voll ist (Mehrere Speicher: nacheinander) – sein Platz zählt beim Drosseln mit.",
	"battery.surplus.rule_off": "Die Regel „Tagsüber Überschuss abgeben“ ist aus.",
	"battery.surplus.rule_go": "Regel einschalten",
	"battery.surplus.capped": "Lädt gerade nur mit {kw} kW – bis spätestens {time} Uhr ist er voll.",
	"battery.surplus.would": "Würde gerade nur mit {kw} kW laden (bis {time} Uhr) – nur im Live-Betrieb schalte ich das.",
	"battery.surplus.not_tested": "Erst nach einem bestandenen Testlauf.",
	"battery.surplus.takes_part": "Macht mit, wenn tagsüber genug Sonne für ihn und mehr da ist.",
	"battery.surplus.left_out": "Lädt immer mit voller Leistung, auch wenn die Regel an ist.",
	"tip.f_battery_day_surplus.title": "Was heißt „Macht tagsüber mit“?",
	"tip.f_battery_day_surplus.text": "Ist die Regel „Tagsüber Überschuss abgeben“ an, begrenze ich an sonnigen Tagen die Ladeleistung dieses Speichers über seine Ladegrenze (bei Omnibattery über die System-Leistungsgrenzen). Er lädt dann langsamer, ist aber trotzdem voll, bevor die Sonne abends nicht mehr reicht. Schaltest du ihn hier aus, lädt er immer mit voller Leistung.",
	"tip.f_battery_day_surplus.hint": "Am Ende des Tages, beim Umschalten des Betriebs und bei „Sofort freigeben“ stelle ich die Ladegrenze zurück, wie sie vorher war.",
	"battery.surplus.need_ref": "Seine Ladegrenze ist in Prozent. Sobald ich weiß, wofür 100 % stehen, macht er mit – trag es unten ein oder lass es mich selbst herausfinden.",
	"battery.surplus.learning": "Ich finde gerade heraus, wofür 100 % stehen: Für ein paar Minuten steht seine Ladegrenze auf einem Testwert, danach stelle ich sie zurück.",
	"battery.surplus.automation": "Macht gerade nicht mit: Eine Automation schreibt dieselbe Ladegrenze ({names}). Wir würden uns gegenseitig überschreiben. Schalte sie unten bei den Störenfrieden aus, dann macht er mit.",
	"battery.surplus.intruders_go": "Zu den Störenfrieden",
	"battery.limit_ref.label": "Wofür stehen 100 %?",
	"battery.limit_ref.placeholder": "z. B. 5000",
	"battery.limit_ref.learn": "Joe lernt es selbst",
	"battery.limit_ref.learning": "Leer gelassen, finde ich es selbst heraus: An einem sonnigen Tag, wenn der Speicher gerade kräftig lädt, stelle ich die Ladegrenze für drei Minuten auf 50 % und messe, wie stark er dann noch lädt. Danach stelle ich alles zurück.",
	"battery.limit_ref.learned": "Gemessen: 100 % stehen für {value} W.",
	"battery.limit_ref.set": "100 % stehen für {value} W – so hast du es eingetragen.",
	"tip.f_battery_limit_ref.title": "Wofür stehen 100 %?",
	"tip.f_battery_limit_ref.text": "Bei Fronius ist die Ladegrenze ein Anteil der höchsten Batterie-Ladeleistung, die der Wechselrichter intern kennt. Home Assistant zeigt diesen Wert nicht, und er muss nicht die Leistung des Speichers sein. Damit ich die Ladeleistung in Watt begrenzen kann, brauche ich ihn – trag ihn in Watt ein, wenn du ihn kennst (zum Beispiel aus der Weboberfläche des Wechselrichters).",
	"tip.f_battery_limit_ref.hint": "Weißt du ihn nicht, lass das Feld leer: Ich messe es an einem sonnigen Tag selbst und stelle die Ladegrenze danach zurück, wie sie war.",
	"tip.team.title": "Warum mehrere Speicher abstimmen?",
	"tip.team.text": "Ein Fronius-Wechselrichter regelt seinen Speicher auf 0 W am Netzzähler, Omnibattery macht das mit einem Marstek genauso. Zwei solche Regler wissen nichts voneinander: Dann lädt oft einer, während der andere entlädt – Strom wandert von Speicher zu Speicher, mit Verlusten auf beiden Wegen.",
	"tip.team.hint": "Nur tagsüber und nur im Live-Betrieb. Nachts steuert mein Nachtplan. Bei Moduswechsel, „Sofort freigeben“ und wenn Home Assistant herunterfährt, stelle ich alle Sperren zurück.",
	"tip.team_mode.title": "Nacheinander oder gleichzeitig?",
	"tip.team_mode.text": "Nacheinander: Immer nur ein Speicher darf arbeiten, die anderen sperre ich vorher – nicht erst, wenn es schon passiert. Ist der erste voll oder leer, übernimmt der nächste. Gleichzeitig: Ich greife nicht ein, jeder Speicher regelt sich selbst. Hast du nichts gewählt, gilt Nacheinander.",
	"tip.team_mode.hint": "Beim Fronius sperre ich über die Lade- und Entladegrenze mit ihrem Schalter. Beim Marstek schalte ich „Laden erlauben“ und „Entladen erlauben“ jeder Batterie aus – Omnibattery bleibt im Automatikmodus und regelt sofort weiter, wenn ich sie wieder freigebe. Ohne diese Schalter nehme ich die System-Leistungsgrenzen, aber nur, wenn alle Batterien von Omnibattery warten.",
	"tip.team_charge_order.title": "Wer lädt zuerst?",
	"tip.team_charge_order.text": "Der Speicher oben nimmt die Sonne zuerst, bis er voll ist; dann ist der nächste dran. Reicht die Sonne laut Vorhersage nacheinander nicht, bis sie untergeht, lasse ich die anderen mitladen – nie erzwungen, ihr eigener Regler nimmt nur, was übrig ist.",
	"tip.team_charge_order.hint": "Ein Speicher weiter oben ist wieder dran, sobald die Sonne eine Weile scheint – nicht bei jeder Wolke.",
	"tip.team_discharge_order.title": "Wer entlädt zuerst?",
	"tip.team_discharge_order.text": "Der Speicher oben versorgt das Haus zuerst, bis er dort ist, wo er wirklich aufhört zu entladen. Dann übernimmt der nächste. Der erste ist wieder dran, wenn er 5 % darüber geladen hat.",
	"tip.team_discharge_order.hint": "Zum Beispiel den großen Speicher zuerst und den kleinen als Rückhalt für den Abend.",
	"tip.team_self_regulating.title": "Was heißt „regelt sich selbst“?",
	"tip.team_self_regulating.text": "Der Speicher schaut selbst auf den Netzzähler und lädt oder entlädt so, dass dort 0 W stehen. Das machen Fronius, Kostal und Omnibattery im Automatikmodus. Nur solche Speicher stimme ich miteinander ab.",
	"tip.team_self_regulating.hint": "Den Vorschlag mache ich aus dem Gerät. Stimmt er nicht, schalte ihn hier um.",
	"tip.team_cutoff.title": "Wo hört er wirklich auf?",
	"tip.team_cutoff.text": "Viele Speicher stoppen früher als eingestellt – ein BYD zum Beispiel bei etwa 10,5 %, obwohl 5 % eingestellt sind. Ich schaue zu: Hört er auf zu entladen, obwohl das Haus Strom braucht, merke ich mir den Ladestand.",
	"tip.team_cutoff.hint": "Mit gelerntem Wert übernimmt der nächste Speicher schon 1,5 % vorher, damit das Haus nichts aus dem Netz holt.",
	"tip.team_group.title": "Wer regelt den Speicher?",
	"tip.team_group.text": "Manche Systeme regeln mehrere Speicher zusammen – Omnibattery zum Beispiel einen Marstek Venus und einen Victron. Die verteilen die Leistung selbst, deshalb behandle ich sie als eine Gruppe. Ein Fronius- oder Kostal-Wechselrichter regelt nur seinen eigenen Speicher.",
	"tip.team_group.hint": "Nacheinander heißt: Immer nur eine Gruppe arbeitet, die anderen sperre ich. Den Vorschlag mache ich aus der Integration in Home Assistant.",
	"tip.team_groups_confirm.title": "Was passiert bei „Vorschlag passt“?",
	"tip.team_groups_confirm.text": "Ich merke mir die Zuordnung, wie sie gerade unter Mehrere Speicher steht, und frage nicht mehr.",
	"tip.team_groups_confirm.hint": "Ändern kannst du sie jederzeit unter Geräte › Speicher › Mehrere Speicher bei „Wer regelt ihn?“.",
	"surplus.device_conflict.title": "Dein Speicher arbeitet gegen „Tagsüber Überschuss abgeben“.",
	"surplus.device_conflict.hint": "Schalte das in Omnibattery aus – ich ändere es nicht.",
	"surplus.conflict.charge_delay": "Bei {battery} ist die Ladeverzögerung an: Omnibattery hält das Laden dann selbst zurück und rechnet nicht mit meiner Grenze.",
	"surplus.conflict.predictive_charging": "Bei {battery} ist das prädiktive Laden an: Omnibattery plant das Laden dann selbst und arbeitet gegen meine Grenze.",
	"overview.todo.surplus_automation": "Macht tagsüber nicht mit: Eine Automation schreibt dieselbe Ladegrenze ({names}). Schalte sie bei den Störenfrieden aus.",
	"overview.todo.limit_ref": "{name}: Wofür stehen 100 %?",
	"overview.todo.config_backup": "Deine früheren Einstellungen sind aufgehoben",
	"overview.todo.config_backup.text": "Beim Start konnte ich deine gespeicherten Einstellungen nicht lesen – zum Beispiel nach dem Wechsel auf eine ältere Version. Ich habe mit Grundeinstellungen angefangen und deine alten Einstellungen aufgehoben. Soll ich sie zurückholen?",
	"overview.todo.config_backup.failed": "Das Zurückholen hat nicht geklappt: {error}",
	"overview.todo.config_backup.restore": "Zurückholen",
	"overview.todo.config_backup.discard": "Verwerfen",
	"overview.todo.limit_ref.text": "Seine Ladegrenze ist in Prozent. Trag ein, wofür 100 % stehen – oder lass es mich an einem sonnigen Tag selbst messen.",
	"role.system_charge_limit": "System-Ladegrenze",
	"role.system_charge_limit_enabled": "System-Leistungsgrenzen an",
	"role.system_discharge_limit": "System-Entladegrenze",
	"role.system_manual_mode": "System-Handbetrieb",
	"role.allow_charge": "Laden erlaubt",
	"role.allow_discharge": "Entladen erlaubt",
	"solar.sleeps": "Ist ohne Sonne aus – das ist normal",
	"solar.sleeps.named": "{name} ist ohne Sonne aus – das ist normal",
	"solar.sleeps.quick": "Ist nachts aus – normal",
	"solar.sleeps.quick_named": "{name} ist nachts aus – normal",
	"tip.solar_sleeps.title": "Wechselrichter ohne Sonne aus?",
	"tip.solar_sleeps.text": "Manche Wechselrichter schalten sich ab, wenn keine Sonne mehr scheint. Ihr Wert ist dann in Home Assistant „nicht verfügbar“. Ist das bei dir so, schalte es hier ein: Solange die Sonne tief steht, zähle ich dann 0 W und warne nicht.",
	"tip.solar_sleeps.hint": "Steht die Sonne hoch und der Wert fehlt trotzdem, warne ich weiter – dann stimmt wirklich etwas nicht.",
	"log.limit_ref_test": "{battery}: Ladegrenze für ein paar Minuten auf {value} % – ich messe, wofür 100 % stehen",
	"log.limit_ref": "Gelernt: Bei {battery} stehen 100 % für {power} kW",
	"log.limit_ref_failed": "{battery}: Wert für 100 % nicht gelernt – ich versuche es an einem anderen Tag",
	"log.limit_ref_failed.no_effect": "{battery}: Die Testgrenze hat nichts gebremst – ich versuche es an einem anderen Tag mit einem kleineren Wert",
	"log.limit_ref_failed.sun": "{battery}: Während des Tests kamen Wolken – ich versuche es an einem anderen Tag",
	"log.limit_ref_failed.implausible": "{battery}: Die Messung passte nicht zusammen – ich versuche es an einem anderen Tag",
	"log.limit_ref_failed.night": "{battery}: Test abgebrochen, die Nacht beginnt – Ladegrenze zurückgestellt",
	"log.start": "Nacht beginnt",
	"log.set": "{battery}: {entity} → {value}",
	"log.reached": "{battery} hat {target} % erreicht",
	"log.night_cap": "{battery}: Ladegrenze als Deckel für das Laden aus dem Netz – höchstens {power} kW",
	"log.night_cap_ignored": "{battery}: Die Ladegrenze hält beim Laden aus dem Netz nicht ({power} statt {cap} kW) – ich plane ihn ab jetzt mit voller Leistung",
	"log.night_cap_works": "{battery}: Die Ladegrenze hält auch beim Laden aus dem Netz ({cap} kW)",
	"log.external": "{entity} hat jemand anderes geändert – ich lasse es so",
	"log.released": "Alles zurückgestellt",
	"log.released.day_buffer": "Ladegrenze zurückgestellt – der Speicher lädt aus der Sonne wieder bis zum Puffer",
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
	"log.surplus_cap": "Tagsüber Überschuss: Speicher laden nur mit {power} kW (bis {until} Uhr, für „{loadpoint}“)",
	"log.surplus_raise": "Tagsüber Überschuss: Speicher laden jetzt mit {power} kW – die Sonne hinkt hinterher",
	"log.surplus_end": "Tagsüber Überschuss beendet – Speicher laden wieder normal",
	"log.surplus_end.full": "Tagsüber Überschuss beendet: Speicher sind voll",
	"log.surplus_end.not_reachable": "Tagsüber Überschuss beendet: die Sonne reicht nicht mehr – Speicher laden wieder normal",
	"log.surplus_end.after_pv": "Tagsüber Überschuss beendet: die Sonne reicht heute nicht mehr fürs Haus",
	"log.surplus_end.no_loadpoint": "Tagsüber Überschuss beendet: kein evcc-Ladepunkt mehr im PV-Modus",
	"log.surplus_end.night": "Tagsüber Überschuss beendet: die Nacht beginnt",
	"log.surplus_end.off": "Tagsüber Überschuss beendet: ausgeschaltet",
	"log.surplus_end.morning": "Tagsüber Überschuss pausiert: der netzdienliche Morgen geht vor",
	"log.surplus_end.stopped": "Tagsüber Überschuss beendet: ich wurde angehalten – Ladegrenzen zurückgestellt",
	"log.surplus_end.ha_stop": "Tagsüber Überschuss beendet: Home Assistant fährt herunter – Ladegrenzen zurückgestellt",
	"log.surplus_end.emergency": "Tagsüber Überschuss beendet: sofort freigegeben",
	"log.surplus_end.error": "Tagsüber Überschuss beendet: ich konnte nicht sicher rechnen – Speicher laden wieder normal",
	"log.surplus_end.no_need": "Tagsüber Überschuss beendet: Drosseln lohnt sich gerade nicht",
	"log.surplus_end.no_plan": "Tagsüber Überschuss beendet: keine Vorhersage – Speicher laden wieder normal",
	"log.surplus_end.no_battery": "Tagsüber Überschuss beendet: kein Speicher kann mehr mitmachen",
	"log.day": "Netzdienlicher Morgen: Speicher laden erst ab {until} Uhr, die Morgensonne geht ins Netz",
	"log.day.buffer": "Netzdienlicher Morgen: Speicher laden erst bis {level} % als Puffer, dann geht die Morgensonne bis {until} Uhr ins Netz",
	"log.day_buffer.fill": "{battery}: unter dem Puffer ({soc} %) – lädt aus der Sonne bis {level} %",
	"log.day_buffer.hold": "{battery}: Puffer {level} % erreicht – jetzt bekommt das Netz die Morgensonne",
	"log.day_released": "Netzdienlicher Morgen vorzeitig beendet: die Sonne hinkt hinterher ({remaining} kWh übrig, {headroom} kWh Platz) – Speicher laden jetzt",
	"log.team_handover": "Speicherwechsel: {battery} ist jetzt dran (vorher {previous})",
	"log.team_handover.empty": "Speicherwechsel: {previous} ist leer ({level} %) – {battery} übernimmt",
	"log.team_handover.full": "Speicherwechsel: {previous} ist voll – {battery} lädt weiter",
	"log.team_handover.order": "Speicherwechsel: {battery} ist wieder dran (Reihenfolge), {previous} wartet",
	"log.team_block.both": "{battery}: Laden und Entladen gesperrt",
	"log.team_block.charge": "{battery}: Laden gesperrt",
	"log.team_block.discharge": "{battery}: Entladen gesperrt, Laden frei",
	"log.team_block.free": "{battery}: wieder frei – Sperren zurückgestellt",
	"log.team_taken": "{battery}: Eine andere Ladegrenze hätte Laden erlaubt, während er wartet – ich sperre trotzdem",
	"log.team_end": "Mehrere Speicher: alle Sperren zurückgestellt",
	"log.team_end.night": "Mehrere Speicher: Sperren zurückgestellt – die Nacht beginnt, der Nachtplan steuert",
	"log.team_end.dry": "Mehrere Speicher: Sperren zurückgestellt – nicht mehr im Live-Betrieb",
	"log.team_end.together": "Mehrere Speicher: Sperren zurückgestellt – gleichzeitig gewählt",
	"log.team_end.automation": "Mehrere Speicher: Sperren zurückgestellt – deine Automationen machen das",
	"log.team_end.levers": "Mehrere Speicher: Sperren zurückgestellt – eine Grenze ist nicht erreichbar",
	"log.team_end.error": "Mehrere Speicher: Sperren zurückgestellt – ich konnte nicht sicher entscheiden",
	"log.team_end.not_taken": "Mehrere Speicher: Sperren zurückgestellt – eine Sperre kam nicht an",
	"log.team_broken": "{battery}: Die Sperre kam nicht an – ich stimme die Speicher vorerst nicht ab",
	"log.team_given_back": "Mehrere Speicher: deine Automationen {names} wieder eingeschaltet – {why}",
	"log.team_take_over": "Mehrere Speicher: deine Automationen {names} wieder ausgeschaltet – ich stimme die Speicher wieder selbst ab",
	"log.team_hold": "Mehrere Speicher: {battery} {direction} noch – ich halte die Sperre, bis das aufhört, dann laufen deine Automationen wieder",
	"log.team_hold.discharge": "entlädt",
	"log.team_hold.charge": "lädt",
	"log.team_hold_end": "Mehrere Speicher: Sperre nicht länger gehalten",
	"log.team_hold_end.flow_ended": "Mehrere Speicher: der Speicher hat aufgehört – Sperre zurück, deine Automationen laufen wieder",
	"log.team_hold_end.too_long": "Mehrere Speicher: Sperre 12 Stunden gehalten – jetzt laufen deine Automationen wieder",
	"log.team_hold_end.unknown": "Mehrere Speicher: Leistung unbekannt – Sperre zurück, deine Automationen laufen wieder",
	"log.team_hold_end.coordinates": "Mehrere Speicher: Ich stimme die Speicher wieder selbst ab – die gehaltene Sperre gehört wieder zu meiner Abstimmung",
	"log.team_gap": "Mehrere Speicher: {why} – vielleicht nur ein kurzer Aussetzer, ich lasse die Sperren noch bis zu 90 Sekunden stehen",
	"log.team_gap_end": "Mehrere Speicher: Der Wert ist wieder da – die Sperren bleiben, wie sie waren",
	"log.automations_back": "Ich wurde angehalten: deine Automationen {names} laufen wieder",
	"log.automations_taken": "Ich steuere wieder selbst: deine Automationen {names} wieder ausgeschaltet",
	"log.team_reset": "{battery}: Die Sperre war zurückgesetzt (z. B. Neustart der Modbus-Steuerung) – ich setze sie neu",
	"log.team_parallel": "Mehrere Speicher: heute laden sie nebeneinander – nacheinander würden sie bis {until} Uhr nicht voll",
	"log.team_cutoff": "{battery} hört bei {level} % auf zu entladen – gelernt: {cutoff} %",
	"log.team_transfer": "{charging} lädt, während {discharging} entlädt – sie laden sich gegenseitig",
	"log.team_transfer.blocked": "{charging} lädt, während {discharging} entlädt – trotz Sperre",
	"log.guard_restart": "Speicher laufen gegeneinander – eigene Regelung von {battery} neu gestartet",
	"log.guard_restart.dry": "Speicher laufen gegeneinander – ich würde die eigene Regelung von {battery} neu starten",
	"log.guard_restart.clean": "Speicher laufen gegeneinander – bei {battery} den Handbetrieb sauber beendet und an seine eigene Regelung zurückgegeben",
	"log.guard_restart.clean.dry": "Speicher laufen gegeneinander – ich würde bei {battery} den Handbetrieb beenden und an seine eigene Regelung zurückgeben",
	"log.guard_block.charge": "Läuft noch gegeneinander – bei {battery} das Laden 5 s gesperrt",
	"log.guard_block.discharge": "Läuft noch gegeneinander – bei {battery} das Entladen 5 s gesperrt",
	"log.guard_block.charge.dry": "Läuft noch gegeneinander – ich würde bei {battery} das Laden 5 s sperren",
	"log.guard_block.discharge.dry": "Läuft noch gegeneinander – ich würde bei {battery} das Entladen 5 s sperren",
	"log.guard_alarm": "Läuft weiter gegeneinander – ich melde mich",
	"log.guard_alarm.dry": "Läuft weiter gegeneinander – ich würde mich melden",
	"log.guard_fixed.1": "Behoben nach Neustart der eigenen Regelung (nach {duration})",
	"log.guard_fixed.2": "Behoben nach kurzer Sperre bei {battery} (nach {duration})",
	"log.guard_fixed.3": "Läuft nicht mehr gegeneinander (nach {duration})",
	"log.guard_automation": "Speicher laufen gegeneinander – eine Automation übernimmt das bereits: {names}",
	"log.guard_joe": "Speicher laufen gegeneinander, während ich selbst steuere – ich greife nicht ein",
	"log.guard_inside": "{charging} lädt, während {discharging} entlädt – dasselbe System regelt beide, ich greife nicht ein und melde mich",
	"log.guard_inside.dry": "{charging} lädt, während {discharging} entlädt – dasselbe System regelt beide, ich würde mich melden",
	"log.guard_restored": "Speicher-Wächter: {entities} wieder zurückgestellt",
	"log.guard_restored.start": "Speicher-Wächter: {entities} nach dem Neustart wieder zurückgestellt",
	"log.guard_restored.failed": "Speicher-Wächter: {entities} konnte ich noch nicht zurückstellen – ich versuche es weiter",
	"log.guard.problem": "– hat nicht geklappt ({code})",
	"f.battery.control.watch": "Nur beobachten",
	"f.battery.control.profile": "Automatisch ({name})",
	"f.battery.control.generic": "Regler zuordnen",
	"f.battery.control.steps": "Eigene Schritte",
	"f.battery.control.suggested": "Ich habe Regler gefunden, die passen könnten.",
	"f.battery.control.take": "Vorschlag übernehmen",
	"f.battery.control.ready": "Laden über: {charge} · Halten über: {hold}",
	"f.battery.control.needs": "Damit ich steuern kann, brauche ich einen Weg zum Laden (Betriebsart mit Zwangsladen oder „Laden aus dem Netz“ mit „Laden bis“) und einen zum Halten (Mindest-Ladestand, Betriebsart oder Entladegrenze).",
	"f.battery.control.retest": "Nach jeder Änderung braucht es einen neuen Testlauf. Du findest ihn auf der Seite des Speichers unter „Jetzt“.",
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
	"meaning.no_charge": "Nicht laden (nur tagsüber)",
	"meaning.no_discharge": "Nicht entladen (nur tagsüber)",
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
	"role.block_charge": "Laden sperren (Schalter)",
	"role.block_discharge": "Entladen sperren (Schalter)",
	"battery.surplus.flash": "Geht bei diesem Speicher nicht: Seine Ladegrenze ist eine Einstellung, die er dauerhaft in seinem Speicherchip ablegt. Führte ich sie den ganzen Tag der Sonne nach, würde sich der Chip abnutzen. Er lädt normal.",
	"log.guard_flash": "Läuft noch gegeneinander – bei {battery} sperre ich so kurz danach nicht noch einmal: Jede Sperre beschreibt seinen Speicherchip. Ich sage dir Bescheid.",
	"tip.battery_notes.title": "Warum sagt Joe mir das?",
	"tip.battery_notes.text": "Ich erkenne viele Speicher, aber nicht jeden kann ich steuern. Hier sage ich dir, **warum** nicht – und **was du tun kannst**. Meist ist es eine Einstellung in der Integration oder im Gerät, oder eine Entität, die in Home Assistant ausgeschaltet ist.\nDanach machst du den Testlauf: Erst wenn der klappt, steuere ich den Speicher.",
	"tip.battery_notes.hint": "Einen Speicher, den ich nicht steuere, lasse ich in Ruhe. Er läuft weiter wie bisher, ich rechne trotzdem mit ihm.",
	"bnote.other": "Dazu habe ich einen Hinweis, den ich hier noch nicht in Worte fassen kann.",
	"bnote.entities.none": "Schau beim Gerät unter „Entitäten“ nach den ausgeschalteten.",
	"bnote.enable": "Diese Entitäten sind in Home Assistant ausgeschaltet – ich bräuchte sie: {entities}. Schalte sie beim Gerät unter „Entitäten“ ein.",
	"bnote.no_level": "Ich sehe {name}, finde aber keinen Ladestand. Ohne den kann ich den Speicher weder einplanen noch steuern. Was du tun kannst: Schalte den Ladestand in Home Assistant ein – {entities}",
	"bnote.needs.kostal_modbus_external": "Damit dein Kostal meine Befehle annimmt, muss im Wechselrichter das Batteriemanagement auf „Extern über Protokoll (Modbus TCP)“ stehen. Das geht im Menü für Installateure. Sonst übergeht er alles, ohne einen Fehler zu melden – der Testlauf zeigt es dir dann. Frag im Zweifel deinen Installateur.",
	"bnote.needs.sigen_write": "Die Sigenergy-Integration steht anfangs auf „Nur lesen“ (read_only). Dann nimmt sie meine Befehle an, schreibt sie aber nicht in den Speicher – ohne Fehlermeldung. Schalte „Nur lesen“ in den Optionen der Integration aus. Der Testlauf zeigt dir, ob es klappt.",
	"bnote.needs.deye_tou": "Ich steuere deinen Deye über seine sechs Zeitprogramme. Das wirkt nur, wenn „Time of Use“ im Wechselrichter eingeschaltet ist. Was ich verstelle, stelle ich am Morgen zurück.",
	"bnote.no_charge.goodwe_core": "Ihn kann ich anhalten, aber nicht aus dem Netz laden: Die GoodWe-Integration aus Home Assistant bietet kein Eco-Laden an. Was du tun kannst: Die Integration „GoodWe Inverter (experimental)“ aus HACS kann beides.",
	"bnote.no_charge.kostal_core": "Ihn kann ich anhalten, aber nicht aus dem Netz laden: Die Kostal-Integration aus Home Assistant hat dafür keinen Regler. Was du tun kannst: „Kostal Plenticore Battery Control“ aus HACS (über Modbus) kann beides.",
	"bnote.cannot.levers": "Ich sehe {name}, finde aber die Regler nicht, mit denen ich ihn steuern könnte. Bis dahin beobachte ich ihn nur. Was du tun kannst: Unter „Regler zuordnen“ selbst Regler auswählen und den Testlauf machen.",
	"bnote.cannot.kostal_core": "Ich sehe deinen Kostal-Speicher, kann ihn aber noch nicht steuern: Mit der Kostal-Integration aus Home Assistant geht das nur über „Battery min SoC“, und der ist in Home Assistant ausgeschaltet. Was du tun kannst: Schalte diese Entität beim Gerät unter „Entitäten“ ein.",
	"bnote.cannot.kostal_modbus": "Ich sehe deinen Kostal-Speicher über „Kostal Plenticore Battery Control“, finde aber seine Regler nicht. Was du tun kannst: Prüfe, ob die Integration läuft und ihre Schalter und Zahlen eingeschaltet sind.",
	"bnote.cannot.solaredge": "Ich sehe deinen SolarEdge-Speicher, kann ihn aber noch nicht steuern: Die Speichersteuerung ist in der Integration ausgeschaltet. Was du tun kannst: In „SolarEdge Modbus Multi“ unter „Konfigurieren“ bei den Power Control Options die erweiterte Speichersteuerung (adv_storage_control) einschalten.",
	"bnote.cannot.sigen": "Ich sehe deinen Sigenergy-Speicher, kann ihn aber noch nicht steuern: Seine Steuer-Entitäten fehlen oder sind ausgeschaltet. Was du tun kannst: In den Optionen der Integration „Nur lesen“ (read_only) ausschalten und die Steuer-Entitäten beim Gerät einschalten.",
	"bnote.cannot.sonnen_write": "Ich sehe deinen sonnen-Speicher, kann ihn aber noch nicht steuern: Ohne Schreibzugriff zeigt die Integration keine Regler. Was du tun kannst: In der Weboberfläche deiner sonnenBatterie den Schreibzugriff für die lokale Schnittstelle einschalten und die Integration neu laden.",
	"bnote.cannot.victron_gx": "Ich sehe deinen Victron-Speicher, finde aber seine ESS-Einstellungen nicht. Was du tun kannst: Prüfe, ob am GX-Gerät ESS eingerichtet ist und die Integration seinen Mindest-Ladestand zeigt.",
	"bnote.cannot.victron_mqtt": "Ich sehe deinen Victron-Speicher, kann ihn aber noch nicht steuern: Die Integration „Victron MQTT“ steht wohl auf „nur lesen“ (READ_ONLY). Was du tun kannst: In ihren Optionen den vollen Betrieb wählen – oder zur Victron-Integration aus Home Assistant wechseln.",
	"bnote.cannot.victron_modbus": "Ich sehe deinen Victron-Speicher, kann ihn aber noch nicht steuern: Die Victron-Integration (Modbus) zeigt Regler nur mit Schreibzugriff. Was du tun kannst: In ihren erweiterten Optionen den Schreibzugriff einschalten.",
	"bnote.cannot.huawei_permissions": "Ich sehe deinen Huawei-Speicher, kann ihn aber noch nicht steuern: Die Integration zeigt ihre Regler erst mit erweiterten Rechten. Was du tun kannst: In „Huawei Solar“ die Option „Advanced: elevate permissions“ einschalten – dafür braucht es das Installateur-Passwort.",
	"bnote.cannot.senec": "Ich sehe deinen SENEC-Speicher, kann ihn aber noch nicht steuern: Anhalten kann ich ihn nur über seine Reserve, und die gibt es nur mit der Anmeldung bei mein-senec.de (und „Backup Power pro“). Was du tun kannst: Die SENEC-Integration zusätzlich mit deinem mein-senec-Konto einrichten und die Reserve einschalten. Ein SENEC.Home V4 lässt sich lokal gar nicht steuern.",
	"bnote.cannot.marstek_modbus": "Ich sehe deinen Marstek über Modbus, finde aber seine Regler nicht – die meisten sind anfangs ausgeschaltet. Was du tun kannst: Schalte beim Gerät die Fernsteuerung über RS485, den Zwangsmodus und die Lade- und Entladeleistung ein. Wichtig: Nur ein Programm darf gleichzeitig per Modbus mit ihm sprechen.",
	"bnote.cannot.solarman": "Ich sehe deinen Deye-Wechselrichter, finde aber seine Zeitprogramme nicht. Was du tun kannst: Nutze die Solarman-Integration von davidrapan mit dem passenden Gerätetyp – die ältere Solarman-Integration zeigt nur Messwerte.",
	"bnote.cannot.sma": "Ich sehe deinen SMA-Speicher, kann ihn aber nicht steuern: Die SMA-Integrationen in Home Assistant lesen nur Werte. Er läuft weiter wie bisher – ich plane mit ihm und rechne seinen Strom mit ein.",
	"bnote.cannot.rct": "Ich sehe deinen RCT-Speicher, kann ihn aber nicht steuern: Die RCT-Integration liest nur Werte; Schreiben ginge nur über ein Zusatz-Skript aus der Community, das ich nicht nutze. Er läuft weiter wie bisher, ich rechne mit ihm.",
	"bnote.cannot.ecoflow": "Ich sehe deinen EcoFlow-Speicher, kann ihn aber nicht steuern: Über die Integration lässt er sich weder aus dem Netz laden noch zuverlässig anhalten. Er läuft weiter wie bisher, ich rechne mit ihm.",
	"bnote.cannot.powerwall_local": "Ich sehe deine Powerwall über die lokale Integration – die kann nur „netzunabhängig“ schalten. Was du tun kannst: Richte zusätzlich Teslemetry, Tessie oder Tesla Fleet ein, damit kann ich ihre Reserve setzen.",
	"bnote.cannot.varta_read": "Ich sehe deinen VARTA-Speicher, kann ihn mit dieser Integration aber nicht steuern: Sie liest nur Werte. Was du tun kannst: Die Integration „VARTA Modbus“ aus HACS kann Lade- und Entladeleistung begrenzen.",
	"bnote.cannot.byd": "Ich sehe deine BYD Battery-Box. Sie selbst lässt sich nicht steuern – das geht immer über ihren Wechselrichter (zum Beispiel Fronius). Richte den Wechselrichter ein, dann steuere ich sie über ihn.",
	"bnote.cannot.growatt_local": "Ich sehe deinen Growatt-Speicher, kann ihn mit dieser Integration aber nicht steuern: Sie kennt nur „Laden aus dem Netz“ an oder aus. Was du tun kannst: Die Integration „Growatt Modbus“ (0xAHA) aus HACS kann mehr.",
	"bnote.cannot.hoymiles": "Ich sehe deinen Hoymiles-Speicher, kann ihn aber nicht steuern: Diese Integration steuert nur Hybrid-Wechselrichter über einen eigenen Dienst, den ich noch nicht nutze. Er läuft weiter wie bisher.",
	"bnote.cannot.kostal_modbus_other": "Ich sehe deinen Kostal über diese Modbus-Integration, kann ihn damit aber nicht sicher steuern: Ihre Werte verfallen nach kurzer Zeit. Was du tun kannst: „Kostal Plenticore Battery Control“ aus HACS nutzen.",
	"bnote.cannot.mqtt_hoymiles": "Ich sehe deinen Hoymiles-Speicher über MQTT, kann ihn aber noch nicht steuern: Über MQTT muss er alle 30 Sekunden neu angesprochen werden, und seine Entitäten sind nicht eindeutig. Was du tun kannst: Lass ihn von Omnibattery steuern – Omnibattery steuere ich.",
	"bnote.cannot.mqtt_noah": "Ich sehe deinen Growatt NOAH über MQTT, kann ihn aber noch nicht steuern: Er lädt nicht aus dem Netz, und seine MQTT-Entitäten sind nicht eindeutig. Er läuft weiter wie bisher, ich rechne mit ihm.",
	"bnote.cannot.mqtt_sunsynk": "Ich sehe deinen Sunsynk- oder Deye-Speicher über MQTT, kann ihn aber noch nicht steuern: Die Entitäten des Add-ons sind nicht eindeutig. Was du tun kannst: Unter „Regler zuordnen“ selbst zuordnen und den Testlauf machen.",
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
	"action.label": "Gerät steuern",
	"action.title": "Gerät |steuern",
	"action.template.ev": "E-Auto laden",
	"action.template.hot_water": "Warmwasser vorheizen",
	"action.template.custom": "Eigenes Gerät",
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
	"action.delete": "Löschen",
	"devices.boost.unit": "Einheit",
	"devices.charge.now": "Jetzt laden",
	"devices.charge.tonight": "Heute Nacht laden",
	"devices.charge.percent": "{target} %",
	"devices.charge.km": "{target} km Reichweite plus {reserve} km Reserve",
	"devices.charge.plus_reserve": "zzgl. {reserve} km Reserve",
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
	"automations.lent": "Von mir wieder eingeschaltet am {day} um {time} Uhr – ich stimme die Speicher gerade nicht selbst ab. Sobald ich es wieder kann, übernehme ich sie.",
	"automations.lent.stopped": "Von mir wieder eingeschaltet am {day} um {time} Uhr, weil ich angehalten wurde (deaktiviert, neu geladen oder aktualisiert). Sobald ich wieder selbst steuere, übernehme ich sie.",
	"automations.all_off": "Alle ausschalten ({count})",
	"automations.back_on": "Wieder einschalten ({count})",
	"automations.failed": "Nicht alle ließen sich umschalten – schau in Home Assistant unter Automationen nach.",
	"cards.loading": "Ich schaue gerade nach …",
	"cards.no_access": "Energy Joe ist nicht erreichbar – die Karte braucht einen Benutzer mit Administratorrechten.",
	"cards.night.title": "Joe heute Nacht",
	"cards.night.skip": "Heute aussetzen",
	"cards.car.none": "Noch kein Auto, das ich laden kann – richte es im Energy-Joe-Panel unter „Geräte › Auto & Laden“ ein.",
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
	"devices.boost.reserve": "Die Reserve stellst du beim Auto unter Steuern ein.",
	"devices.action.boost": "Lädt jetzt, weil du es willst.",
	"devices.action.tonight": "Heute Nacht",
	"devices.car.no_calendar": "Kein Kalender verbunden",
	"devices.car.lonely": "Dieses Auto kenne ich aus deinem Energie-Dashboard – laden kann ich es noch nicht. Richte es einmal ein: Wallbox wählen, „Laden nach Bedarf“ ist schon an.",
	"devices.car.set_up": "Laden einrichten",
	"tip.devices_lonely_car.title": "Warum steht hier „einrichten“?",
	"tip.devices_lonely_car.text": "Aus dem Energie-Dashboard weiß ich, wie viel das Auto zieht. Damit ich es nachts günstig oder nach Bedarf lade, brauche ich noch, wie ich die Wallbox schalte. Das richtest du einmal ein – danach siehst du hier Ladestand, Fahrten und Termine des Autos.",
	"devices.car.of_persons": "Kalender von {names}",
	"devices.car.calendar_ok": "verbunden",
	"devices.car.calendar_problem": "gerade ein Problem – bitte ansehen",
	"devices.car.checked": "zuletzt gelesen {when}",
	"devices.car.connect": "Kalender verbinden",
	"devices.car.change": "Ändern",
	"tip.car_calendar_card.title": "Wozu der Kalender des Autos?",
	"tip.car_calendar_card.text": "Aus den Terminen weiß ich, wie weit das Auto morgen fährt, und lade nachts genau so viel nach. Hier siehst du, welcher Kalender verbunden ist und wann ich ihn zuletzt gelesen habe. Der Knopf springt zu den Terminen weiter unten.",
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
	"plan.actions.run": "läuft von {start} bis {end} Uhr",
	"plan.actions.target": "heizt ab {start} Uhr auf {target} °C, bis spätestens {end} Uhr",
	"plan.actions.energy": "≈ {kwh} kWh, {cost} günstig in der Nacht",
	"plan.tonight": "Was heute Nacht läuft",
	"plan.tonight.charge": "lädt ab {time} Uhr von {from} auf {target} %",
	"plan.tonight.charge_any": "lädt von {from} auf {target} %",
	"plan.tonight.charge.energy": "≈ {kwh} kWh aus dem Netz, mit bis zu {kw} kW",
	"plan.tonight.charge.spans": "{kwh} kWh, {spans}",
	"plan.tonight.span": "{start}–{end} Uhr mit {power}",
	"plan.pace.spread": "Langsam über die Nacht verteilt: Der Strom kostet die ganze Zeit gleich viel, so schone ich Speicher und Hausanschluss und bin trotzdem rechtzeitig fertig.",
	"plan.pace.short": "Nur wenig zu laden: lieber kurz mit etwas mehr Leistung – ganz langsam lädt ein Speicher schlecht.",
	"plan.pace.cheapest": "In den günstigsten Viertelstunden der Nacht – erst dort, wo der Strom am wenigsten kostet.",
	"plan.pace.full": "Mit voller Leistung – langsamer würde er in der günstigen Zeit nicht so voll wie nötig.",
	"plan.pace.grid_limit": "Gebremst vom Hausanschluss: Laden und Haus zusammen bleiben unter {limit} kW.",
	"plan.pace.fixed_power": "Seine Ladeleistung kann ich nicht vorgeben – er lädt so schnell, wie er kann, so spät wie möglich.",
	"plan.pace.need_ref": "Sobald ich weiß, wofür 100 % seiner Ladegrenze stehen, lade ich ihn auch langsamer.",
	"plan.pace.cap_ignored": "Seine Ladegrenze hält beim Laden aus dem Netz nicht – deshalb plane ich ihn mit voller Leistung.",
	"plan.pace.first": "Er bekommt zuerst: Er entlädt morgens als Erster, so wechseln die Speicher tagsüber seltener.",
	"tip.plan_pace.title": "Warum so langsam?",
	"tip.plan_pace.text": "Ich lade jeden Speicher so langsam wie möglich und so schnell wie nötig: Die Energie verteile ich auf die günstigen Viertelstunden, sodass er sein Ziel eine halbe Stunde vor dem Ende erreicht. Wenig Leistung schont den Speicher und den Hausanschluss. Kostet der Strom unterschiedlich viel, lade ich zuerst in den günstigsten Viertelstunden – notfalls mit voller Leistung. Teurer wird es dadurch nie.",
	"tip.plan_pace.hint": "Mehrere Speicher: Wer morgens zuerst entlädt, bekommt nachts zuerst – jeder hat sein eigenes Ziel.",
	"plan.tonight.hold": "lädt nicht, hält in der günstigen Zeit aber {target} %",
	"plan.tonight.idle": "muss heute Nacht nichts tun, jetzt {soc} %",
	"log.boost": "{battery}: Jetzt laden bis {target} {unit}",
	"log.boost_end.reached": "{battery}: Jetzt laden – Ziel erreicht",
	"log.boost_end.stopped": "{battery}: Jetzt laden beendet",
	"log.boost_end.expired": "{battery}: Jetzt laden nach 24 Stunden beendet",
	"log.action_on": "{battery}: eingeschaltet ({value})",
	"log.action_off": "{battery}: zurückgestellt ({value})",
	"log.action_done": "{battery}: Ziel erreicht",
	"log.call": "{battery}: {entity}",
	"log.tonight": "„Heute Nacht“ umgeschaltet",
	"log.grid_guard": "Hauptsicherung: {power} kW aus dem Netz – Laden kurz pausiert",
	"log.no_progress": "{battery} lädt nicht (bei {soc} %)",
	"tip.a_name.title": "Wie soll das Gerät heißen?",
	"tip.a_name.text": "So steht es unter Geräte, im Plan und als Schalter „Heute Nacht“ in Home Assistant.",
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
	"tip.a_auto.title": "Wann schalte ich es von allein ein?",
	"tip.a_auto.text": "Wenn morgen weniger Sonne kommt als hier steht – mit dem Faktor, den ich für deine Prognose gelernt habe. Leer heißt: jede Nacht. Ausgeschaltet schalte ich es nur ein, wenn du „Heute Nacht“ einschaltest.",
	"tip.a_conditions.title": "Wozu Bedingungen?",
	"tip.a_conditions.text": "Ich schalte es nur ein, wenn alle erfüllt sind – zum Beispiel „Auto angesteckt ist an“ oder „Ladestand des Autos kleiner als 70“.",
	"tip.a_power.title": "Wozu die Leistung?",
	"tip.a_power.text": "Damit ich weiß, wie viel vom Netzanschluss sie braucht. Den Rest bekommen die Speicher – so bleibt alles unter deinem Netzlimit.",
	"tip.a_consumer.title": "Wozu die Zuordnung?",
	"tip.a_consumer.text": "Kenne ich den Verbraucher aus dem Energie-Dashboard, weiß ich, wie viel er sonst tagsüber braucht. Läuft er nachts, rechne ich das aus dem Tag heraus – die Speicher brauchen dann weniger.",
	"tip.a_priority.title": "Was heißt die Reihenfolge?",
	"tip.a_priority.text": "Reicht der Netzanschluss nicht für alles, kommt die kleinere Zahl zuerst. Die Speicher nehmen, was übrig bleibt.",
	"tip.a_enabled.title": "Was heißt aktiv?",
	"tip.a_enabled.text": "Ausgeschaltet plane und schalte ich das Gerät nicht – auch nicht von Hand.",
	"tip.a_sensor.title": "Welcher Fühler?",
	"tip.a_sensor.text": "Der Fühler, dessen Temperatur ich beobachte, zum Beispiel die Warmwasser-Temperatur. Ist das Ziel erreicht, schalte ich aus.",
	"tip.a_temps.title": "Wie rechne ich das Ziel?",
	"tip.a_temps.text": "Morgens soll das Wasser mindestens so warm sein. Dazu lege ich, was ihr über den Tag braucht (das lerne ich noch), und den Puffer. Höher als „Höchstens“ heize ich nie. Ich starte so spät, dass das Ziel bis zum Ende der günstigen Zeit steht.",
	"tip.a_save.title": "Was passiert beim Speichern?",
	"tip.a_save.text": "Erst beim Speichern übernehme ich deine Änderungen und plane ab sofort damit. Geschaltet wird nur in den Modi Vorschlagen und Live – in der Simulation zeige ich, was ich getan hätte.",
	"tip.a_delete.title": "Was passiert beim Löschen?",
	"tip.a_delete.text": "Ich vergesse, wie ich das Gerät steuere, und sein Schalter „Heute Nacht“ in Home Assistant verschwindet. Läuft es gerade, stelle ich vorher zurück. Das Gerät selbst und sein Zähler bleiben.",
	"tip.boost.title": "Jetzt oder heute Nacht?",
	"tip.boost.text": "**Jetzt laden**: Ich schalte die Wallbox sofort ein – ohne auf die günstige Zeit oder die Sonne zu warten und auch in der Simulation, weil du es ausdrücklich willst.\n**Heute Nacht laden**: Ich lade in der kommenden Nacht in der günstigen Zeit, egal was die Prognose sagt.\nSobald der Ladestand erreicht ist (oder die Reichweite plus deine Reserve), stelle ich die Wallbox zurück, wie sie vorher war. Mit % und km wählst du, ob das Ziel ein Ladestand oder eine Reichweite ist.",
	"tip.boost.hint": "„Jetzt laden“ hört nach spätestens 24 Stunden von selbst auf, „Heute Nacht“ mit dem Ende der Nacht. Mit „Abbrechen“ sofort.",
	"tip.action_tonight.title": "Was macht „Heute Nacht“?",
	"tip.action_tonight.text": "Ich schalte das Gerät in der kommenden Nacht ein, egal was die Prognose sagt – praktisch, wenn du weißt, dass du es morgen früh brauchst. Nach der Nacht schaltet sich der Schalter von selbst wieder aus.",
	"tip.plan_actions.title": "Was sehe ich hier?",
	"tip.plan_actions.text": "Was ich heute Nacht mit jedem Speicher und jedem Gerät vorhabe, wann – und warum manches nicht läuft. **Einstellen →** bringt dich zur Seite des Geräts.",
	"error.title": "Joe antwortet |nicht",
	"error.text": "Ich erreiche die Integration nicht. Lade die Seite neu – hilft das nicht, schau unter Einstellungen → System → Protokolle nach.",
	"error.action": "Fehler beim Speichern",
	loading: "Joe sattelt auf …",
	"menu.sidebar": "Home-Assistant-Menü"
}, Fe = {
	"tab.overview": "Overview",
	"tab.plan": "Plan",
	"tab.review": "Review",
	"tab.devices": "Devices",
	"tab.household": "Household",
	"climate.title": "Heating & cooling",
	"climate.lead": "When nobody is home I turn heating and air conditioning down – and back up in time when someone comes home. You decide for each device.",
	"climate.ha_open": "The round arrow button opens a device in Home Assistant.",
	"climate.mirror.presence": "Presence",
	"climate.mirror.presence.none": "no helper yet, I go by the people in Home Assistant",
	"climate.mirror.today": "Today",
	"climate.mirror.today.workday": "working day",
	"climate.mirror.today.weekend": "weekend",
	"climate.mirror.today.holiday": "day off during the week",
	"climate.mirror.today.ho": "home office: {names}",
	"climate.mirror.unknown": "not known yet",
	"climate.mirror.night": "Bedtime",
	"climate.mirror.night.time": "fixed times per device",
	"climate.mirror.night.no_entity": "no entity chosen yet",
	"rule.on": "on",
	"climate.enabled": "Joe steers heating and cooling",
	"climate.live": "I steer the devices where you switch on “Joe steers this device”. Tap a device for that.",
	"climate.not_live": "I only steer in the mode “Live” – until then I just show for each device what I would do.",
	"climate.home": "At home: {names}",
	"climate.nobody": "Nobody is home right now.",
	"climate.way.towards": "{name} is {km} km away and getting closer.",
	"climate.way.away": "{name} is {km} km away and moving away.",
	"climate.way.other": "{name} is {km} km away.",
	"climate.way.minutes_route": "About {minutes} minutes' drive left.",
	"climate.way.minutes_guess": "Estimated about {minutes} minutes.",
	"climate.route_eta": "Drive time from the routing service",
	"climate.now.arriving_usual": "Now: the usual homecoming is close – I'm warming up already.",
	"tip.climate_route_eta.title": "How does Joe know when someone comes home?",
	"tip.climate_route_eta.text": "I use two ways.\n**1. Someone coming closer:** With the “Proximity” integration I ask the routing service (Household › Travel & weather: OpenStreetMap, Waze or Google) how long the drive still takes – including traffic where the service knows it. For that, the person's position, rounded to about 100 m, goes to that service. Switch it off and I assume 40 km/h.\n**2. Your usual time:** I note when you usually come home on working days and days off, and warm up the rooms ahead of that. Someone who only drives past at a quite different time counts once they keep getting closer.",
	"tip.climate_route_eta.hint": "I know the usual time after 4 homecomings on such days, and only if it varies by no more than 45 minutes.",
	"climate.no_proximity": "To warm up in time when someone comes home I need the Proximity integration for your persons.",
	"climate.add_proximity": "Set up Proximity",
	"household.presence": "Is anyone home?",
	"household.presence.on": "now: someone there",
	"household.presence.off": "now: nobody there",
	"household.presence.yours": "This is a helper in Home Assistant – change it there under Settings → Devices & services → Helpers.",
	"household.presence.yours_group": "This is your group – I only read it. Change its members in your configuration.",
	"household.presence.other": "Other entity",
	"household.presence.stop": "Stop using",
	"household.presence.propose": "I propose a helper “someone home” in Home Assistant: on as soon as one of these persons is home. With a guest mode switch, those without a phone count too – babysitter, children, guests. Both are yours and work without me.",
	"household.presence.found": "You already have a group for this. I'll use it – then it tells me whether someone is home.",
	"household.presence.use": "Use this one",
	"household.presence.new_instead": "Create a new helper instead",
	"household.presence.persons": "Persons in the helper",
	"household.presence.guest": "Also create a guest mode switch",
	"household.guest": "Guest mode",
	"household.guest.offer": "For the babysitter or children without a phone: a switch “guest mode” (normally off). While it is on, a guest counts as home – through a tracker “guest” that joins your group. So the group stays “home”/“not_home”.",
	"household.guest.create": "Create guest mode",
	"household.guest.name": "Guest mode",
	"household.guest.tracker_name": "Guest",
	"household.guest.home": "a guest counts as home",
	"household.guest.away": "off – no guest",
	"household.guest.add_to_group": "For the guest mode to count, add the tracker to “{group}”. The group is in your YAML configuration; add this line to its members and reload the groups:",
	"household.guest.automation": "Guest mode → tracker “guest”",
	"household.guest.automation_text": "Created by Energy Joe: {tracker} follows the switch {guest} (on = home, off = not_home), so the presence group stays home/not_home.",
	"tip.household_guest.title": "How does guest mode work?",
	"tip.household_guest.text": "I create three ordinary building blocks in Home Assistant: the switch “Guest mode”, a device tracker “Guest” and an automation that makes the tracker follow the switch (on = home, off = away). The tracker belongs to your presence group, like a person. If the switch itself were in the group, the group would only have the state on/off – and automations checking for “home” would stop working.",
	"tip.household_guest.hint": "Everything works without me too. Switch guest mode off again when the visit leaves.",
	"household.presence.create": "Create helper",
	"household.presence.creating": "Creating …",
	"household.presence.own": "Pick my own entity",
	"household.presence.name": "Someone home",
	"household.presence.failed": "That didn't work ({error}). You can create the helper yourself and pick it here.",
	"pick.presence.title": "What tells that someone is home?",
	"tip.household_presence.title": "Why a helper of its own?",
	"tip.household_presence.text": "Whether someone is there is decided by this one helper alone – not each person. So you control it in one place: who counts, and with the guest mode switch the babysitter too. I create a template binary sensor and a switch as ordinary helpers in Home Assistant.",
	"tip.household_presence.hint": "If you already have such a group, pick it with “Pick my own entity”.",
	"tip.pick_presence.title": "Which entity says “someone is there”?",
	"tip.pick_presence.text": "It must be “on” or “home” while someone is there: a group, a template binary sensor or a presence sensor.",
	"climate.failed": "I could not load the devices just now.",
	"climate.none": "I found no thermostats or air conditioners in Home Assistant.",
	"climate.no_area": "No room",
	"climate.room.enabled": "Joe steers {name}",
	"climate.room.steer": "Joe steers this device",
	"climate.room.off": "Not steered by me.",
	"climate.meter.pick": "Pick the meter for {name}",
	"climate.meters.count": "{linked} of {all} measured",
	"climate.meter.without_long": "No meter",
	"climate.meter.open_long": "No meter yet",
	"climate.meter.change": "Change",
	"climate.meter.other_short": "Other",
	"climate.meter.search": "Search",
	"climate.meter.search_placeholder": "Name, room or Shelly …",
	"climate.meter.no_hits": "Nothing found.",
	"climate.meter.cancel": "Cancel",
	"climate.meters.say": "Which device measures the power and energy of this climate device? I preselect what fits by name and room. Several climate devices may hang on the same meter.",
	"climate.list": "Your devices by room",
	"climate.card.measured": "Power measured",
	"climate.why.free_day": "Day off",
	"climate.moved": "{name} is now under {group} →",
	"climate.device.main_off": "off – then I steer no device",
	"climate.consumer": "In the Energy dashboard:",
	"climate.unassigned.lead": "In the Energy dashboard this meter is a climate device. I don't know yet which device it belongs to.",
	"climate.assign": "Which climate device does this meter belong to?",
	"climate.assign.pick": "Pick a device",
	"climate.assign.has_meter": "{name} (already has a meter)",
	"climate.assign.no_device": "In Home Assistant this meter is not part of any device, so I can't assign it to a climate device. Tell me below what it measures.",
	"tip.climate_assign.title": "Why assign it?",
	"tip.climate_assign.text": "If the meter belongs to a thermostat or air conditioner, I keep it as that device's meter. Then you see the device and its power use on one page.",
	"tip.climate_assign.hint": "If it measures something else, change its kind below. Then it shows up in its own group.",
	"climate.meter.none_option": "— no meter —",
	"climate.meter.confirm": "Confirm",
	"climate.meter.no_meters": "Joe finds no device with a power or energy sensor.",
	"climate.meter.linked": "linked",
	"climate.meter.suggested": "Suggestion",
	"climate.meter.shared": "Same meter as {names} – the reading counts for all of them together.",
	"tip.climate_meter.title": "What measures this device?",
	"tip.climate_meter.text": "Pick the device that measures this climate device's power and energy – e.g. a channel of a Shelly Pro 3EM, grouped by “connected via …”. I preselected my suggestion and marked it “(Suggestion)”; “Confirm” takes it. “— no meter —” tells me there is no measurement.",
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
	"climate.night_back": "Comfortable again by",
	"climate.night.by": "I tell night",
	"climate.night.by.time": "by fixed times",
	"climate.night.by.entity": "by an entity",
	"climate.night.no_entity": "No entity chosen yet.",
	"climate.night.now_on": "now: night",
	"climate.night.now_off": "now: awake",
	"climate.night.change": "Other entity",
	"climate.night.pick": "Pick an entity",
	"climate.night.entity_say": "While the entity is “on”, it is night – e.g. a helper your good-night routine switches on, a bed sensor or a schedule. Set the morning time per room.",
	"climate.night.time_say": "You set from when to when on each device – all with “Off at night” are listed below.",
	"climate.entity": "Entity",
	"climate.entities": "Entities",
	"climate.open_device": "Open the device in Home Assistant ({id})",
	"climate.open_meter": "Open the meter in Home Assistant",
	"pick.night.title": "What tells you that you are in bed?",
	"tip.climate_night.text": "At night I switch the air conditioner off and back on in good time before your morning time, so it is comfortable by then. How I tell it's night – fixed times or an entity – you set under Household › Bedtime. How long the room takes to cool down, I learn over time.",
	"tip.climate_night_source.title": "How does Joe tell night?",
	"tip.climate_night_source.text": "“By fixed times”: each air conditioner has its own from – to. “By an entity”: it is night while the chosen entity is “on” – e.g. a helper (input_boolean) your good-night routine switches on and off again in the morning, a bed sensor or a schedule.",
	"tip.climate_night_source.hint": "With an entity too, I bring the rooms back in time for the morning in case nobody switches it off.",
	"tip.pick_night.title": "Which entity says “night”?",
	"tip.pick_night.text": "Anything that is “on” while you sleep fits: a switch or helper (input_boolean) your good-night routine sets, a bed sensor's binary sensor or a schedule.",
	"climate.night_from": "Off from",
	"climate.night_until": "Comfortable again by",
	"climate.now.home": "Now: as set – someone is home.",
	"climate.now.away": "Now: away.",
	"climate.now.arriving": "Now: someone is coming home – I am warming up already.",
	"climate.now.free_day": "Now: day off.",
	"climate.now.night": "Now: night.",
	"climate.rate": "Gets about {rate} °C per hour (learned).",
	"climate.rate_default": "I am still learning how fast the room warms up or cools down.",
	"climate.log.normal": "set to Normal",
	"climate.log.holiday": "set to Holiday",
	"climate.log.home_office": "set to Home office",
	"climate.log.held": "set to your profile by hand",
	"climate.log.night": "switched off for the night",
	"climate.log.away": "set to away",
	"climate.log.free_day": "set to the day-off profile",
	"climate.log.back": "put back as it was",
	"climate.log.failed": "setting it did not work",
	"tip.climate_enabled.title": "What does Joe do here?",
	"tip.climate_enabled.text": "I watch who is home (the “Someone home” helper under Household › Who's home). When nobody is, I set the devices you switch on as chosen – lower, off or a profile. When someone comes home I put everything back exactly as it was.",
	"tip.climate_enabled.hint": "As everywhere: in the simulation I switch nothing and only show what I would do.",
	"tip.climate_presence.title": "How does Joe know who is coming?",
	"tip.climate_presence.text": "Who is home I learn from the “Someone home” helper – until there is one, I look at the people in Home Assistant. Who is coming home I see from the Proximity integration: it reports distance and direction. How long the drive still takes I ask the routing service (without it I assume 40 km/h). That way I start early enough for the room to be comfortable in time.",
	"tip.climate_room.title": "Steer this device?",
	"tip.climate_room.text": "I only touch devices whose switch is on. So you can leave out the bathroom or a child's room, for example.",
	"tip.climate_away.title": "What happens when nobody is home?",
	"tip.climate_away.text": "**Lower**: cooler by the set degrees (warmer for an air conditioner that cools).\n**Off**: the device off.\n**Profile**: a profile of the device, e.g. a Homematic IP heating profile “Away” in the heating group.",
	"tip.climate_away.hint": "With Homematic IP, set up profiles of your own – then your times and temperatures apply.",
	"tip.climate_free_day.title": "Days off?",
	"tip.climate_free_day.text": "On weekends and holidays (according to your workday sensor) I switch to this profile while someone is home – e.g. a Homematic IP profile “Holiday” that warms up later.",
	"tip.climate_night.title": "Off at night?",
	"climate.away_after": "Count as away only after",
	"climate.away_after.unit": "min",
	"tip.climate_away_after.title": "When does the house count as empty?",
	"tip.climate_away_after.text": "Only when nobody has been home for this many minutes do I switch to away. If you just pop out to the bakery or your phone briefly drops off the Wi-Fi, everything stays as it is.",
	"tip.climate_away_after.hint": "0 means right away. This applies to all devices.",
	"climate.now.just_left": "Now: everyone just left – I wait {min} minutes in case someone comes back.",
	"climate.today.workday": "Today is a working day.",
	"climate.today.weekend": "Today is the weekend.",
	"climate.today.holiday": "Today is a day off during the week – a public holiday or a bridge day.",
	"climate.today.ho": "Working from home today: {names}.",
	"climate.today.ho_none": "According to the calendars, nobody works from home today.",
	"climate.today.read_at": "Calendars read at {time}.",
	"climate.today.labels_unread": "Calendars not read yet – I'll know in a few minutes whether anyone works from home today.",
	"climate.today.labels_error": "Calendars can't be reached right now – I don't know whether anyone works from home today. I'll try again soon.",
	"climate.today.free_by": "Also a day off when one of these is on",
	"climate.today.free_none": "nothing chosen",
	"climate.today.free_pick": "Choose",
	"climate.today.free_change": "Change",
	"tip.climate_free_entities.title": "What else makes a day off?",
	"tip.climate_free_entities.text": "For example a helper “Bridge day” or “Vacation”, a schedule or a switch. If one of them is on, today counts as a day off – on weekdays I then use the holiday profile.",
	"pick.free_day.title": "What makes a day off?",
	"tip.pick_free_day.title": "Which entities fit?",
	"tip.pick_free_day.text": "Anything that is “on” on a day off: a helper (input_boolean) “Bridge day”, a schedule, a switch or a binary sensor. You can pick several – one is enough.",
	"week.row": "Week profiles",
	"tip.climate_week.title": "What are week profiles?",
	"tip.climate_week.text": "Like a Homematic IP thermostat: heating and cooling each get 6 profiles with switching points over the day, e.g. 07:00 → 22 °C, 23:00 → off. With tags you tell me when to use which profile: Normal, Holiday, Away, Home office.\nI follow the operating mode set on the air conditioner. If you switch it off by hand, I do not switch it back on.",
	"tip.climate_week.hint": "I only write when the target changes – not every minute. In simulation I just show what I would do.",
	"week.edit": "Edit profiles",
	"week.no_sets": "No profiles yet – tap “Edit profiles”. Until then the setting below applies.",
	"week.pending.start": "The weekly profiles take over once the current night or absence is over – until then everything stays as it is.",
	"week.pending.end": "The weekly profiles run until the night or absence is over, then I let go.",
	"devprof.pending.start": "The ticks take effect once the current absence or day off is over – until then everything stays as it is.",
	"devprof.pending.end": "The away program is still running until someone comes home. Then I set the normal program and leave the device to itself again.",
	"week.legacy_now": "The air conditioner is set to “{state}” right now – there are no profiles for that, so the setting below applies.",
	"climate.hvac.off": "Off",
	"climate.hvac.heat": "Heat",
	"climate.hvac.cool": "Cool",
	"climate.hvac.dry": "Dry",
	"climate.hvac.fan_only": "Fan only",
	"climate.hvac.auto": "Auto",
	"climate.hvac.heat_cool": "Heat/Cool",
	"week.now": "Now: {text}",
	"week.would": "Would now: {text}",
	"week.state_off": "Off",
	"week.held": "by hand",
	"week.next": "at {time} → {value}",
	"week.why.night": "Night",
	"week.why.away": "Nobody home",
	"week.why.just_left": "Just left – waiting {min} minutes",
	"week.why.arriving": "Someone is coming home",
	"week.why.arriving_usual": "Usual homecoming soon",
	"week.why.holiday": "Day off",
	"week.why.home_office": "Home office",
	"week.why.weekend": "Weekend",
	"week.why.home": "Someone is home",
	"week.why.held": "Profile by hand",
	"week.why.override": "Changed by hand",
	"week.why.off_by_hand": "Off by hand",
	"week.why.unavailable": "Device unavailable",
	"week.why.manual_mode": "Device not on auto",
	"week.override.manual": "Changed by hand – this holds until {time}, then the plan takes over again.",
	"week.override.manual_open": "Changed by hand – this holds until the next switching point.",
	"week.override.off": "Switched off by hand – I wait until you switch it on again.",
	"week.override.preset": "Profile changed by hand at the device – this holds until {time}.",
	"week.override.preset_open": "Profile changed by hand at the device – this holds until someone leaves or comes home or another day begins.",
	"week.resume": "Back to the plan",
	"tip.week_resume.title": "What does “Back to the plan” do?",
	"tip.week_resume.text": "I forget your change by hand and set again what the profile says for now.",
	"week.error": "Setting the device did not work: {error}",
	"week.error.not_confirmed": "I tried several times, but the device did not take the value. Is it reachable?",
	"week.as_is": "as set on the device",
	"week.hold": "Profile by hand",
	"week.hold.auto": "Automatic",
	"week.hold.until": "How long?",
	"week.hold.midnight": "until midnight",
	"week.hold.forever": "until further notice",
	"week.hold.later_night": "The night comes first right now – afterwards {profile} applies again.",
	"week.hold.later_away": "Nobody is home right now, which comes first – as soon as someone comes home, {profile} applies again.",
	"week.hold.other_mode": "You picked {profile} by hand for {mode} ({until}) – it applies again as soon as the air conditioner is set to {mode}.",
	"week.hold.lift": "Lift",
	"tip.week_hold.title": "A different profile today?",
	"tip.week_hold.text": "Pick a profile to use instead of my choice – e.g. profile 5 for a day with guests. It holds until midnight or until further notice. “Automatic” hands the choice back to me.\nNight and away still come first.",
	"week.away_fallback": "Only applies while no profile has the “Away” tag.",
	"tip.week_away.title": "What happens when nobody is home?",
	"tip.week_away.text": "If no profile has the “Away” tag, I do this:\n**Lower**: the current profile, the set degrees cooler (warmer when cooling).\n**Off**: the air conditioner switched off.",
	"devprof.title": "The device's heating profiles",
	"tip.climate_device_profiles.title": "When does Joe use which heating profile?",
	"tip.climate_device_profiles.text": "The week programs' times and temperatures live in the device (e.g. the CCU or the Homematic IP app) – I do not change them. You only tell me with tags what a profile is for: **Normal** on working days and at weekends, **Holiday** on days off during the week, **Away** when nobody is home, **Home office** on days someone works from home according to the calendar. The name is just for you.\nI only switch profiles while the device is on auto, and at most every 15 minutes – except when people leave or come home.",
	"tip.climate_device_profiles.hint": "Each tag sits on one profile at most. Set it elsewhere and it moves there.",
	"devprof.name": "Name for {preset}",
	"devprof.tags": "What is {preset} for?",
	"devprof.moved": "“{tag}” is now on {to} instead of {from}.",
	"devprof.need_normal": "Set the “Normal” tag on one profile. Only then do the tags apply – until then I steer the device as before, with the settings below.",
	"devprof.not_auto": "I only switch profiles in auto mode. The device is set to “{state}” right now.",
	"devprof.away_keep": "Leave",
	"tip.devprof_away.title": "What happens when nobody is home?",
	"tip.devprof_away.text": "If no profile has the “Away” tag:\n**Leave**: I change nothing.\n**Off**: I switch the heating off, and back to auto when someone comes home.",
	"week.profile": "Profile {n}",
	"week.mode.heat": "Heating",
	"week.mode.cool": "Cooling",
	"week.off": "off",
	"week.tag.normal": "Normal",
	"week.tag.holiday": "Holiday",
	"week.tag.away": "Away",
	"week.tag.home_office": "Home office",
	"week.ho.default": "Working from home is your normal working day – that needs no tag of its own.",
	"week.ho.no_calendar": "I read home office days from the calendar – for that someone in the household needs a calendar.",
	"week.ho.rules": "Household › Days & calendars →",
	"week.label": "Edit week profiles",
	"week.title": "Week |profiles",
	"week.loading": "Loading the device …",
	"week.load_failed": "I could not load the devices just now.",
	"week.device_missing": "I cannot find this device in Home Assistant right now.",
	"week.no_modes": "This device can neither heat nor cool.",
	"week.modes": "Operating mode",
	"tip.week_mode.title": "Heating or cooling?",
	"tip.week_mode.text": "Each operating mode has its own 6 profiles. Which one applies is up to the air conditioner: I follow what is set on it.",
	"week.empty": "There are no profiles for {mode} yet.",
	"week.create": "Create profiles",
	"week.creating": "Creating …",
	"tip.week_create.title": "How do I start?",
	"tip.week_create.text": "I propose 6 profiles: Normal, Holiday, Away, Home office and two spare ones – with the temperature set right now, and “Off at night” if you switched that on. Then you adjust them. Nothing is stored until “Save”.",
	"week.profiles": "Profiles",
	"tip.week_profiles.title": "Which profile am I editing?",
	"tip.week_profiles.text": "Tap a profile to edit it below. Nothing changes at the air conditioner. The green dot marks the profile running now, the small bar shows today's curve.",
	"week.running": "running now",
	"week.name": "Name",
	"tip.week_name.title": "What should the profile be called?",
	"tip.week_name.text": "Just for you, e.g. “Early start” or “Guests”. At most 30 characters.",
	"week.tags": "What is this profile for?",
	"tip.week_tags.title": "When does Joe use this profile?",
	"tip.week_tags.text": "**Normal**: on working days and at weekends when someone is home. Exactly one profile has this tag.\n**Holiday**: on days off during the week. Without this tag I use “Normal” with its Sunday curve.\n**Away**: when everyone has been gone for a while. Without this tag, “When nobody is home” on the card applies.\n**Home office**: on working days when someone works from home according to their calendar.",
	"tip.week_tags.hint": "Each tag sits on one profile at most. Set it here and it moves over from the other profile.",
	"week.tag.moved": "“{tag}” came from {from} – it is gone there now.",
	"week.normal_fixed": "“Normal” needs exactly one profile. Set the tag on another profile and it moves there.",
	"week.no_normal": "No profile has the “Normal” tag – then I use profile 1.",
	"week.untagged": "Without a tag I never use this profile on my own – only via “Profile by hand”.",
	"week.days": "Days",
	"tip.week_split.title": "The same every day?",
	"tip.week_split.text": "**All days the same**: one curve for the whole week.\n**Mon–Fri and Sat–Sun**: one for weekdays, one for the weekend.\n**Each day**: seven curves.\nSplitting copies the current curve to all new days. Merging keeps the first one (Monday or Mon–Fri).",
	"week.split.all": "All days the same",
	"week.split.week_weekend": "Mon–Fri and Sat–Sun",
	"week.split.each": "Each day",
	"week.split.split": "Split: every day starts with the previous curve.",
	"week.split.merged": "Merged: the curve of {first} applies now.",
	"week.split.merged_days": "Merged: Mon–Fri takes Monday's curve, Sat–Sun Saturday's.",
	"week.group.all": "All days",
	"week.group.weekdays": "Mon–Fri",
	"week.group.weekend": "Sat–Sun",
	"week.today": "today",
	"week.curve": "Curve {label}",
	"week.points": "Curve and switching points",
	"tip.week_points.title": "What is a switching point?",
	"tip.week_points.text": "From this time the value applies – until the next switching point. The first one at 00:00 is fixed. “Off” switches the air conditioner off; the next point with a temperature switches it back on.\nThe bar shows the day from 0 to 24 h, the line is now. Tap a day to see its switching points.",
	"tip.week_points.hint": "At most 12 switching points per day, times in steps of 5 minutes.",
	"week.limits": "The air conditioner can do {min} to {max} °C in steps of {step}.",
	"week.fitted": "Some values were outside what the air conditioner can do. I adjusted them – “Save” keeps that.",
	"week.night_time": "“Off at night” is on: from {from} to {until} the air conditioner stays off, whatever it says here.",
	"week.night_entity": "“Off at night” is on: while it is night the air conditioner stays off – from {until} at the latest the plan applies again.",
	"week.point.first": "The day always starts at 00:00.",
	"week.point.time": "Time of the switching point",
	"week.point.value": "Temperature from {time}",
	"week.point.less": "{step} °C less",
	"week.point.more": "{step} °C more",
	"week.point.off": "Off from {time}",
	"week.point.delete": "Delete the switching point at {time}",
	"week.point.add": "Switching point",
	"tip.week_add.title": "Where does the new switching point go?",
	"tip.week_add.text": "Into the middle of the longest stretch, rounded to 15 minutes, with the value before it. Then set its time and value.",
	"week.point.max": "More than 12 switching points per day are not possible.",
	"week.point.no_room": "There is no room for another switching point here.",
	"week.point.duplicate": "There already is a switching point at {time}.",
	"week.copy": "Copy to …",
	"tip.week_copy.title": "Copy the curve to other days?",
	"tip.week_copy.text": "Copies this day's switching points to the chosen days. Their previous curve is replaced.",
	"week.copy.all": "all other days",
	"week.copied": "Copied to {days}.",
	"week.saving": "Saving …",
	"week.unsaved": "Not saved yet",
	"week.save_failed": "{mode} not saved: {error}",
	"week.problem.count": "There must be exactly 6 profiles.",
	"week.problem.tags": "A tag sits on more than one profile.",
	"week.problem.curves": "The number of curves does not match the days.",
	"week.problem.points": "A curve has invalid switching points.",
	"tab.settings": "Settings",
	"nav.label": "Sections",
	"nav.sections": "Sections of this page",
	"nav.not_found": "I can't find this device any more. Maybe it was renamed or removed in Home Assistant.",
	"nav.not_found.person": "I can't find this person any more. Maybe they were removed – everyone who lives here is listed below.",
	"nav.review.result": "Result",
	"nav.review.days": "Days",
	"nav.review.learned": "Learned",
	"nav.review.log": "Log",
	"past.result.title": "What it |would have saved",
	"past.result.lead": "Every morning I replay the night's plan with the real day – once with the plan, once without. Here you see what steering would have saved and how close I was each night.",
	"past.result.total": "All nights together",
	"past.days.rebuild": "Read the history again →",
	"past.days.unknown": "I have no records for {day}.",
	"past.answer.given": "Your answer: {answer}",
	"past.answer.change": "Change",
	"past.answer.ask": "What was this day like?",
	"past.learned.group.sun": "Sun",
	"past.learned.group.consumption": "Consumption",
	"past.learned.group.devices": "Devices",
	"past.learned.group.household": "Household",
	"past.learned.weather": "Weather entity",
	"past.learned.weather.missing": "none chosen yet",
	"past.learned.presence.usual": "on days like today usually home around {time}",
	"past.learned.presence.no_calendar": "Without a calendar I don't know what kind of day this person has ahead.",
	"past.learned.climate": "Heating & cooling",
	"past.learned.climate.say": "How quickly a room warms up again (when cooling: cools down) once I set it back after lowering. That tells me how early I need to start.",
	"past.learned.climate.rate": "{rate} °C per hour",
	"past.learned.climate.none": "As soon as I control heating or cooling, I learn here how fast each room gets warm or cool.",
	"past.learned.climate.open": "To Heating & cooling →",
	"tip.learn_climate.title": "What is the warm-up rate?",
	"tip.learn_climate.text": "When I put a room back after a setback, I measure how long it takes to reach the wanted temperature. Every new measurement goes into the average, the older ones still count. Until I know a room, I assume 1.5 °C per hour.",
	"past.log.title": "What I |switched",
	"past.log.lead": "Everything I changed on batteries, cars, hot water, your devices and climate devices – newest first. Tap an area to see only that.",
	"past.log.filters": "Areas",
	"past.log.devices": "Devices",
	"past.log.all": "All",
	"past.log.filter.battery": "Batteries",
	"past.log.filter.climate": "Heating & cooling",
	"past.log.filter.car": "Car & charging",
	"past.log.filter.hot_water": "Hot water",
	"past.log.filter.other": "More devices",
	"past.log.filter.joe": "Joe himself",
	"past.log.empty": "Nothing yet – as soon as I steer, test or change a climate device, it shows up here.",
	"past.log.empty_filter": "I haven't switched anything here yet.",
	"past.log.partial": "Right now I only see the latest entries.",
	"tip.past_log.title": "What's in the log?",
	"tip.past_log.text": "Everything I switched, with the time: batteries, cars, hot water, your devices and climate devices, plus test runs, your answers and when a night starts. What you change on a device yourself isn't listed – unless I notice it while I'm steering.",
	"nav.devices.all": "All",
	"nav.devices.climate": "Heating & cooling",
	"nav.devices.battery": "Batteries",
	"nav.devices.car": "Car & charging",
	"nav.devices.hot_water": "Hot water",
	"nav.devices.other": "More devices",
	"nav.devices.grid": "Grid & sun",
	"nav.back": "← {name}",
	"nav.household.people": "Who lives here",
	"nav.household.presence": "Who's home",
	"nav.household.days": "Days & calendars",
	"nav.household.night": "Bedtime",
	"nav.household.travel": "Travel & weather",
	"nav.settings.operation": "Operation",
	"nav.settings.rules": "Rules",
	"nav.settings.notify": "Notifications",
	"nav.settings.maintenance": "Maintenance & backup",
	"nav.settings.about": "About Joe",
	"signpost.title": "Looking for …?",
	"signpost.placeholder": "e.g. battery, electricity price, guest mode",
	"signpost.none": "I can't find anything for that. Try another word – or look through the tabs above.",
	"signpost.more": "{count} more – add another word.",
	"tip.signpost.title": "Where is what?",
	"tip.signpost.text": "Type what you're looking for – old names like History, Learning or For pros work too. I show you where it lives now, and tapping a hit takes you there.",
	"tip.signpost.hint": "Settings now only hold how I work myself. Everything with power is under Devices, people and everyday life under Household.",
	"signpost.overview": "Overview",
	"signpost.overview.terms": "Start, home page, Right now, What Joe is doing, Joe needs you, Still open, What's next, Quick, The last 7 days",
	"signpost.plan": "Plan for tonight",
	"signpost.plan.terms": "Plan, tonight, night, charging plan, target, recalculate, How I worked it out, What runs tonight, Night actions, prices",
	"signpost.steer": "Steering tonight",
	"signpost.steer.terms": "Yes do it, Not today, Skip tonight, skip, Steer after all, evening question, test run missing",
	"signpost.result": "What it would have saved",
	"signpost.result.terms": "Result, savings, saved, simulation, How well I did, costs, money",
	"signpost.days": "Every day",
	"signpost.days.terms": "History, days, day, hours, day question, replayed, state of charge, yesterday",
	"signpost.learned": "What Joe has learned",
	"signpost.learned.terms": "Learn, Learning, learned, memory, forecast factor, time shift, consumption and weather, heating rate, who is home when",
	"signpost.learned_reset": "Start over",
	"signpost.learned_reset.terms": "delete what was learned, forget, reset, learn from scratch",
	"signpost.log": "Log",
	"signpost.log.terms": "What I switched, switched, climate log, commands",
	"signpost.devices": "All devices",
	"signpost.devices.terms": "Devices, What Joe uses, Newly found, Release now, Your answers, check notes, night action, Night actions",
	"signpost.add": "Add a device",
	"signpost.add.terms": "Add, new device, create night action, action, look around again, find device",
	"signpost.battery": "Batteries",
	"signpost.battery.terms": "Battery, storage, home battery, test run, control, set up control, capacity, battery size, discharge limit, troublemakers, automations at the battery",
	"signpost.battery_team": "Several batteries",
	"signpost.battery_team.terms": "Several batteries, one after the other, at the same time, order, interlock, charging each other, hierarchy, two batteries, zero export, regulates itself, discharge cutoff",
	"signpost.climate": "Heating & cooling",
	"signpost.climate.terms": "Climate, heating, air conditioning, thermostat, radiator, week profile, heating profile, room, setback, When nobody is home, meters",
	"signpost.car": "Car & charging",
	"signpost.car.terms": "EV, electric car, car, wallbox, charging, charge level, range, charge as needed, car appointments, mailbox, account, invitations, charge now",
	"signpost.hot_water": "Hot water",
	"signpost.hot_water.terms": "Boiler, immersion heater, hot water heat pump, showers, tank temperature",
	"signpost.other": "More devices",
	"signpost.other.terms": "Other devices, your devices, consumers, socket, smart plug, washing machine, dryer, dishwasher, assign devices, pool",
	"signpost.energy": "Grid & sun",
	"signpost.energy.terms": "Energy dashboard, energy, meters, electricity",
	"signpost.connection": "Grid connection",
	"signpost.connection.terms": "Grid, grid meter, feed-in, import, flip, sign",
	"signpost.tariff": "Electricity tariff",
	"signpost.tariff.terms": "Electricity price, tariff, price, spot price, dynamic tariff, Tibber, surcharge, feed-in tariff, grid fee, unit price",
	"signpost.solar": "Solar system",
	"signpost.solar.terms": "PV, photovoltaics, solar, sun, solar forecast, forecast, Forecast.Solar, Solcast, combine forecasts, PV power, inverter",
	"signpost.home": "Home consumption",
	"signpost.home.terms": "Consumption, house, base load, consumption sensor",
	"signpost.people": "Who lives here",
	"signpost.people.terms": "Household, people, person, family, residents, a person's calendar, left out",
	"signpost.presence": "Who's home",
	"signpost.presence.terms": "Presence, at home, away, Someone at home, presence group, helper, Away after",
	"signpost.guest": "Guest mode",
	"signpost.guest.terms": "Guest, guests, visitors, babysitter",
	"signpost.way": "Way home",
	"signpost.way.terms": "Drive time, home, proximity, arrival, usual return",
	"signpost.calendar": "Days & calendars",
	"signpost.calendar.terms": "Holidays, home office, working day, day off, vacation, school holidays, school, calendar rules, keywords, kind of day, today",
	"signpost.night": "Bedtime",
	"signpost.night.terms": "Night rest, sleep, at night, When is night, bedtime, Off at night",
	"signpost.travel": "Travel & weather",
	"signpost.travel.terms": "Weather, distances, distances to appointments, routing service, Waze, Google, OpenStreetMap, route",
	"signpost.mode": "Operating mode",
	"signpost.mode.terms": "Mode, simulation, suggest, live, off, pause, stop, let Joe steer, operation",
	"signpost.grid_friendly": "Be grid-friendly",
	"signpost.grid_friendly.terms": "grid-friendly, What comes first, midday sun",
	"signpost.rules": "Rules",
	"signpost.rules.terms": "For pros, pro, expert, fine-tuning, default value",
	"signpost.rule_reserve_soc.terms": "minimum charge, never below, battery reserve",
	"signpost.rule_max_target_soc.terms": "charge limit, charge at most, up to",
	"signpost.rule_evening_min_soc.terms": "full in the evening, evening reserve",
	"signpost.rule_balance_days.terms": "calibrate, charge full, balancing, cell balancing",
	"signpost.rule_discharge_in_window.terms": "discharge, cheap hours, block discharging",
	"signpost.rule_converter_losses.terms": "inverter, losses, efficiency",
	"signpost.rule_day_surplus.terms": "surplus, evcc, floor heating, daytime, throttle, PV surplus, limit charging power",
	"signpost.rule_grid_limit_w.terms": "connection power, power limit",
	"signpost.rule_max_night_kwh.terms": "kWh per night, amount per night",
	"signpost.rule_guard_grid.terms": "main fuse, fuse, overload",
	"signpost.rule_max_price.terms": "too expensive, price limit",
	"signpost.rule_min_saving.terms": "worth it, minimum gain",
	"signpost.rule_priority.terms": "order, precedence",
	"signpost.rule_buffer_factor.terms": "buffer, learn again by itself, margin",
	"signpost.rule_plan_offset_min.terms": "fixed plan, time",
	"signpost.rule_reset_lead_min.terms": "lead time, switch back",
	"signpost.notify": "Notifications",
	"signpost.notify.terms": "Phone, message, push, app, Ask in the evening, Report problems, Morning report",
	"signpost.ask_time.terms": "time of the question, ask in the evening at",
	"signpost.observe": "Watching",
	"signpost.observe.terms": "Recording, read history again, read again, recorder",
	"signpost.backup": "Backup",
	"signpost.backup.terms": "Export, import, save, file, move",
	"signpost.setup": "Start the setup over",
	"signpost.setup.terms": "first setup, assistant, from the start, restart, setup",
	"signpost.diagnostics": "Diagnostics",
	"signpost.diagnostics.terms": "report a bug, bug report, download diagnostics, debug, problem",
	"signpost.about": "About Joe",
	"signpost.about.terms": "Version, Home Assistant version, update, info",
	"signpost.entities": "Joe's entities",
	"signpost.entities.terms": "Entities, sensors, automations, switches, own automations, scripts",
	"signpost.cards": "Dashboard cards",
	"signpost.cards.terms": "card, cards, Lovelace, dashboard, own dashboard",
	"ha.open.device": "Open {name} in Home Assistant",
	"ha.open.entity": "Show {name} in Home Assistant",
	"mirror.change": "Change →",
	"mirror.set": "Set up →",
	"usedby.label": "Used by:",
	"usedby.none": "Nothing uses this yet.",
	"usedby.climate": "Heating & cooling",
	"usedby.plan": "Plan",
	"usedby.learn": "Learned – who is home when",
	"usedby.consumption": "Learned – consumption",
	"usedby.car": "Charging by need – {name}",
	"usedby.way": "Way home",
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
	"onb.group.devices": "Devices",
	"onb.group.devices.lead": "What delivers, stores or uses power.",
	"onb.group.household": "Household",
	"onb.group.household.lead": "Who lives here and what shapes your days.",
	"onb.part.weather": "Weather",
	"onb.part.holiday": "Holidays",
	"onb.car.wallbox": "Wallbox",
	"onb.car.car": "Car",
	"onb.car.meter": "Meter in the Energy dashboard",
	"onb.car.none": "If you have an electric car, I'll ask you about it in a moment.",
	"onb.other.none": "Devices with their own meter in the Energy dashboard show up here.",
	"onb.people.none": "Who lives here, I'll ask you in a moment.",
	"onb.done.homes": "What happens next: after the start, every line lives in a fixed place. Tap the place to start Joe and go there.",
	"onb.scan.energy.none": "I didn't find an Energy dashboard. No problem – I'll look for your devices anyway.",
	"scan.looking": "Looking around …",
	"scan.title": "Here's what |I found",
	"scan.lead": "This is what I'll work with from now on. If something is wrong, change it or leave it out – I never overwrite what you set.",
	"scan.again": "Look again",
	"scan.why": "Why?",
	"scan.failed": "Something went wrong while looking around. Please try again.",
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
	"onb.done.title": "Alright, |partner.",
	"onb.done.lead": "From tonight I plan every night but don't switch anything. After a week I'll show you what it would have saved.",
	"onb.done.go": "Start Joe",
	"onb.done.change": "Change something",
	"onb.nav": "Setup: back or next",
	"onb.next": "Next",
	"onb.back": "Back",
	"overview.night": "Tonight",
	"overview.night.empty.title": "No plan |yet",
	"overview.night.empty.text": "Once I know your batteries and your tariff, I'll work out here every night how much to charge – and why.",
	"plan.day": "Grid-friendly: until {time} the morning sun goes to the grid (about {kwh} kWh), then the battery charges at the midday peak.",
	"plan.day.buffer": "Grid-friendly: I first charge up to {level} % as a buffer for you, then the grid gets the morning sun (about {kwh} kWh), from {time} I charge full.",
	"plan.day.cost": "Costs about {cost}.",
	"plan.title": "Where I |do the math",
	"history.title": "Every day |up close",
	"settings.operation": "Operation",
	"settings.mode": "Operating mode",
	"settings.setup": "Setup",
	"settings.setup.hint": "Go through the assistant again from the start.",
	"settings.setup.restart": "Start over",
	"settings.about": "About Joe",
	"settings.backup": "Backup",
	"settings.backup.export": "Export settings",
	"settings.backup.export.hint": "Everything you set up and I learned, as a file.",
	"settings.backup.download": "Download",
	"settings.backup.import": "Import settings",
	"settings.backup.import.hint": "Bring back an exported file – replaces all settings.",
	"settings.backup.choose": "Choose file",
	"settings.backup.confirm": "“{file}” (exported {when}) replaces all settings and everything learned. Really?",
	"settings.backup.replace": "Replace",
	"settings.backup.exported": "The file is downloaded.",
	"settings.backup.imported": "Imported – I work with these settings from now on.",
	"settings.backup.not_ours": "This is not an Energy Joe backup.",
	"settings.backup.failed": "That didn't work: {error}",
	"tip.backup_export.title": "What is in the file?",
	"tip.backup_export.text": "All settings – batteries, tariff, devices, household, rules, climate – and what I learned. Passwords and sign-ins of mailboxes are not in it; enter them again after a move.",
	"tip.backup_export.hint": "Good before bigger changes or to move to another Home Assistant.",
	"tip.backup_import.title": "What happens on import?",
	"tip.backup_import.text": "I check the file first. If it is fine, it replaces all settings and everything learned; if not, everything stays as it is. If it comes from another Home Assistant, check the devices afterwards – entities may be named differently there.",
	"settings.version": "Version",
	"settings.ha": "Home Assistant",
	"settings.energy": "Energy dashboard",
	"settings.energy.sources": "Grid: {grid} · Solar: {solar} · Batteries: {battery} · Devices: {devices}",
	"settings.energy.none": "not set up",
	"settings.mode.now": "Running now: {mode}.",
	"settings.mode.open": "Change mode …",
	"tip.mode_open.title": "Where do I switch?",
	"tip.mode_open.text": "There is one place to switch: the button at the top in the header. This button opens the same dialog. It also shows which batteries still need a test run.",
	"settings.rules.intro": "Fine-tuning for the night. The defaults suit most homes – you don't have to change anything here. If you changed a value, “Default” brings the old one back.",
	"settings.rules.group.battery": "Batteries",
	"settings.rules.group.grid": "Grid & price",
	"settings.rules.group.plan": "Planning",
	"settings.setup.again": "Start the setup over",
	"settings.maintenance.diagnostics": "Diagnostics for a bug report",
	"settings.maintenance.diagnostics.hint": "You get the file in Home Assistant: Settings › Devices & services › Energy Joe, then “Download diagnostics” in the ⋮ menu.",
	"settings.maintenance.diagnostics.open": "Open Energy Joe in HA",
	"tip.diagnostics.title": "What are diagnostics for?",
	"tip.diagnostics.text": "If something doesn't work and you report a bug, this file helps find it. It shows what I know and plan. I replace names of people, calendars and mailbox addresses with placeholders first.",
	"tip.diagnostics.hint": "Take a quick look at the file before you pass it on.",
	"settings.about.entities": "Joe's entities",
	"settings.about.entities.intro": "I create these entities in Home Assistant. You can use them in your own automations, scripts and dashboards.",
	"settings.about.entities.none": "There are no entities of mine in Home Assistant yet. They come once the integration is running.",
	"settings.about.group.control": "Switches & selects",
	"settings.about.group.button": "Buttons",
	"settings.about.group.value": "Values",
	"settings.about.group.calendar": "Calendars",
	"settings.about.group.other": "More",
	"tip.about_entities.title": "What can I do with them?",
	"tip.about_entities.text": "With “Operating mode” you switch me from an automation, with “Skip tonight” you skip a night. You can show “Status”, “Target tonight” and “Would have saved” or use them as triggers. “Plan again” and “Release now” are buttons for scripts and dashboards.",
	"tip.about_entities.hint": "The button with the arrow shows the entity in Home Assistant, with its history.",
	"settings.about.cards": "Dashboard cards",
	"settings.about.cards.intro": "Two cards for your own dashboards. In the dashboard choose “Edit”, then “Add card” and search for “Energy Joe” – or enter the type below in the code editor.",
	"settings.about.cards.night": "Joe tonight",
	"settings.about.cards.night.hint": "What I plan for tonight and what it costs, with the “Skip tonight” switch. Tapping the head opens the plan.",
	"settings.about.cards.car": "Car charging",
	"settings.about.cards.car.hint": "Charge level and range of your cars, with “Charge now” and “Charge tonight up to”. Tapping the head opens the car's page.",
	"tip.label": "Explanation",
	"tip.hint": "Tip",
	"tip.ha_open.title": "What is the button with the arrow for?",
	"tip.ha_open.text": "The round button with the arrow pointing out opens the device in Home Assistant. There you rename it, put it in a room or see all its values.\nIf it has no device page in Home Assistant, the button shows the entity's info dialog instead. It changes nothing in Joe.",
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
	"tip.start.text": "From tonight I plan every night – as a simulation, so without switching anything. You can change everything you entered at any time – where it belongs: under Devices, Household or Settings.",
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
	"review.invert": "Flip",
	"review.keep": "It's right",
	"review.ignored": "left out",
	"review.capacity_unknown": "size unknown",
	"review.battery": "Battery",
	"review.battery.none": "No battery found. If you have one, pick it.",
	"review.tariff.ask": "I'll ask you about the tariff in a moment – or enter it now.",
	"review.forecast.none": "Without a solar forecast I plan cautiously. Set up Forecast.Solar, for example, in Home Assistant and I'll look again.",
	"review.grid.none": "Without a grid meter I can't see what really happens. Pick the sensor that measures the power at your grid connection.",
	"review.home.balance": "Like the Energy dashboard: grid + solar ± storage",
	"review.home.devices": "Assign devices",
	"review.home.compare": "To compare: {name} · {live}",
	"review.home.flexible": "For the battery I leave out: {names}. I never charge the car from the home battery.",
	"review.home.flexible_some": "For the battery I leave out: {names}.",
	"review.home.flexible_none": "Do some devices run only on solar surplus or cheap power? Tell me under Devices › More devices – then I plan the battery without them.",
	"review.home.off": "Over the last {days} days your sensor shows {pct} % {direction} than grid + solar ± storage. Maybe a small solar system is missing from it? I'm using grid + solar ± storage.",
	"review.home.less": "less",
	"review.home.more": "more",
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
	"pick.empty": "Nothing fits here. Tap “Show all” below or search for another word.",
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
	"ask.topic.climate": "Climate",
	"ask.topic.home_office": "Working from home",
	"ask.later": "Later",
	"ask.later.marked": "Answer later",
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
	"q.climate.title": "Should I run heating |& cooling?",
	"q.climate.yes": "Yes, please",
	"q.climate.no": "No, I'll do it myself",
	"q.climate.hint": "Which thermostats and air conditioners I may run, you choose later under Devices › Heating & cooling. Until then I change nothing.",
	"q.climate.on": "Good. Which thermostats and air conditioners I may run, you choose after the start under Devices › Heating & cooling – each one on its own.",
	"q.home_office.title": "Is working from home |your normal workday?",
	"q.home_office.yes": "Yes, mostly at home",
	"q.home_office.no": "No, mostly at the office or on the road",
	"q.home_office.hint": "This applies to workdays without a matching event in the calendar. What's in the calendar comes first. You can change it under Household › Days & calendars.",
	"q.ev.offer": "Should I charge the car at night in the cheap hours when the sun won't be enough tomorrow? For that I need whatever switches the charging – your wallbox, for example.",
	"q.ev.has_action": "I run the charging with “{name}”.",
	"q.ev.set_up": "Set up charging",
	"q.ev.edit": "View or change",
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
	"f.battery.floor": "Discharge floor",
	"f.battery.floor.read": "Set on the device: {value} %. Leave empty to use it; a number of your own applies instead.",
	"f.battery.floor.ask": "I can't read the floor from the device. Down to what percentage may this battery discharge?",
	"plan.note.floor_unknown": "I don't know one battery's discharge floor – I use the reserve from the rules there.",
	"tip.f_battery_floor.title": "How low may it discharge?",
	"tip.f_battery_floor.text": "The battery does not go below this level – as set on the device (Fronius “minimum reserve”, Marstek “discharge cutoff”). I read it and work out how much energy is really usable. A number you enter applies instead.",
	"tip.f_battery_floor.hint": "The reserve from the rules stays the lowest level for all batteries.",
	"f.battery.max_charge": "Charging",
	"f.battery.max_discharge": "Discharging",
	"f.battery.priority": "Order",
	"f.battery.control": "Control",
	"edit.tariff.label": "Edit tariff",
	"edit.battery.label": "Edit battery",
	"edit.battery.title": "Battery |settings",
	"edit.tariff.title": "Your |tariff",
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
	"household.people.title": "Who |lives here?",
	"household.people.lead": "The people who live here, with their calendars. That tells me who is home, what kind of day it is and whom the car should charge for.",
	"household.people.list": "People",
	"household.people.today": "Today: {label}",
	"household.people.tomorrow": "Tomorrow: {label}",
	"household.people.rules": "Calendar rules",
	"household.people.rules.own": "their own",
	"household.people.rules.shared": "same as everyone",
	"household.people.counts": "Appointments count for:",
	"household.people.counts.none": "The appointments don't count for any car yet.",
	"household.people.learned": "Learned",
	"household.people.learned.none": "nothing yet – that takes a few days",
	"household.people.usual": "usually comes home around {time}",
	"household.people.more": "More in Review →",
	"household.presence.title": "Who's |home?",
	"household.presence.lead": "Who is home right now and who is on the way. One single helper “Someone home” tells me – with guest mode also for everyone without a phone.",
	"household.presence.now": "Home right now",
	"household.days.not_found": "I can't find this person any more. The rules below apply to everyone.",
	"household.presence.way": "Way home",
	"household.presence.way.say": "When someone comes home, I bring the rooms back in time. For that I look at how far away the person is and how long the drive still takes.",
	"household.presence.routing": "Routing service",
	"household.days.title": "Days & |calendars",
	"household.days.lead": "What kind of day it is – working day, day off or home office. I read it from your workday sensor and your calendars.",
	"household.days.preview": "Today and tomorrow",
	"household.days.preview.today": "Today",
	"household.days.preview.tomorrow": "Tomorrow",
	"household.days.preview.workday": "Tomorrow is a working day.",
	"household.days.preview.day_off": "Tomorrow is a day off.",
	"household.days.preview.person": "{name}: {label}",
	"household.days.preview.unknown": "I can't tell yet what kind of day today is.",
	"household.days.preview.no_plan": "I'll see tomorrow once tonight's plan is ready.",
	"household.days.free": "Days off",
	"household.days.no_calendars": "Nobody has a calendar yet. Without calendars the rules have no effect.",
	"household.days.to_people": "Assign calendars →",
	"household.days.own_rules": "has their own rules",
	"household.night.title": "When is |bedtime?",
	"household.night.lead": "Bedtime means: you are in bed. Devices with “Off at night” switch off then and are comfortable again in time for the morning.",
	"household.night.source": "How I recognise the night",
	"household.night.devices": "Devices with “Off at night”",
	"household.night.devices.none": "No device has “Off at night” switched on yet. You set that on the device under Devices › Heating & cooling.",
	"household.night.span": "{from}–{until}",
	"household.night.until": "comfortable again by {until}",
	"household.night.not_steered": "not steered right now",
	"household.night.to_climate": "To Heating & cooling →",
	"household.travel.title": "Travel & |weather",
	"household.travel.lead": "The weather for consumption and heating, and how I work out distances – for car trips and the way home.",
	"tip.household_days_preview.title": "What does the preview show?",
	"tip.household_days_preview.text": "How I see today and tomorrow: working day or day off, who works from home according to the calendar, and which situation applies – Normal, Holiday, Away or Home office. The plan, charging by need and the heating profiles follow it.\nI know tomorrow once tonight's plan is worked out.",
	"tip.household_days_preview.hint": "I don't look further ahead than tomorrow yet.",
	"tip.household_remove.title": "What does “Doesn't live here” do?",
	"tip.household_remove.text": "I leave the person out: their presence and calendars no longer count. Nothing changes in Home Assistant.\nYou can bring them back any time under “Left out”.",
	"tip.household_left_out.title": "Whom did I leave out?",
	"tip.household_left_out.text": "People from Home Assistant you left out with “Doesn't live here”. Tap a name to bring the person back with their calendars.",
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
	"sum.climate": "Run heating & cooling",
	"sum.yes": "yes",
	"sum.no": "no",
	"sum.home_office": "Normal workday",
	"sum.home_office.yes": "working from home",
	"sum.home_office.no": "office or on the road",
	"sum.weather": "Weather",
	"sum.holiday": "Holidays",
	"sum.later": "later",
	"sum.lives_at": "lives under",
	"rule.reserve_soc": "Reserve",
	"rule.converter_losses": "Count inverter losses when charging from the grid",
	"rule.converter_losses.hint": "Measured at the grid meter – for batteries whose own meter sits behind the inverter.",
	"learn.battery.converter": "{value} % of the grid power arrives when charging",
	"tip.r_converter_losses.title": "What are inverter losses?",
	"tip.r_converter_losses.text": "Some batteries report their power on the direct-current side (e.g. a BYD on a Fronius). Then my measurement misses the inverter's losses when it converts grid power for charging. I measure them at the grid meter on nights with grid charging and no sun. With the switch on, I count them for charging and discharging – grid charging then pays off a little less often.",
	"tip.r_converter_losses.hint": "I need 5 such nights before I have a value; until then the switch changes nothing. Batteries on alternating current (e.g. Marstek) don't need it.",
	"rule.day_surplus": "Leave daytime surplus",
	"rule.day_surplus.hint": "On sunny days the batteries charge only as fast as they must – the rest of the sun is left for evcc (e.g. a car or floor heating in PV mode).",
	"tip.r_day_surplus.title": "What does “Leave daytime surplus” mean?",
	"tip.r_day_surplus.text": "Normally the batteries swallow all the morning sun and are full by noon – only then does evcc see a surplus. With the switch on, I slow down charging: they charge just fast enough to still be full before the sun no longer covers the house in the evening. evcc sees the rest at the grid meter, and a loadpoint in PV mode (e.g. underfloor heating) can then run all day.\nIf the sun falls short of the forecast, I charge faster right away; if it no longer suffices at all, I let go completely.",
	"tip.r_day_surplus.hint": "Only while an evcc loadpoint is set to PV or Min+PV and can take power, only for batteries with a charge limit in W or kW and a passed test run, and only in live mode. In the evening everything is back as before.",
	"rule.transfer_guard": "Battery watchdog",
	"rule.transfer_guard.hint": "When two batteries charge each other (one charges, the other discharges), I step in.",
	"tip.r_transfer_guard.title": "What does the battery watchdog do?",
	"tip.r_transfer_guard.text": "Battery watchdog: I step in when batteries charge each other. If one charges with more than 20 W while another discharges with more than 20 W, for 20 seconds, I first restart the own control of the battery that is usually the cause (for a Marstek, Omnibattery's control). If that has not helped after 20 seconds, I briefly block the direction it is running in – for 5 seconds. If they still run against each other after that, I let you know.",
	"tip.r_transfer_guard.hint": "This works without “One after the other”, too. I only write in live mode; otherwise I only say what I would do. At night, while I steer myself, I do not step in. If one of your automations already does this, I leave it to that one.",
	"rule.morning_buffer": "Buffer on a grid-friendly morning",
	"rule.morning_buffer.auto": "Automatic",
	"rule.morning_buffer.auto_n": "Automatic ({soc} %)",
	"rule.morning_buffer.own": "My own value",
	"rule.morning_buffer.own_label": "Own buffer in percent",
	"rule.morning_buffer.off_hint": "Only applies while “Be grid-friendly” is on (Settings › Operation).",
	"rule.morning_buffer.learned_hint": "In the morning I first charge up to {soc} % from the sun – that is what your home usually needs beyond the sun on sunny mornings (about {kwh} kWh), plus a little extra. Then the grid gets the morning sun.",
	"rule.morning_buffer.start_hint": "In the morning I first charge up to {soc} % from the sun, then the grid gets the morning sun. I estimate this until I have seen enough sunny mornings at your place.",
	"rule.morning_buffer.pending_hint": "In the morning I first charge a buffer from the sun, then the grid gets the morning sun. How much, I'll tell you once I have worked out the next plan.",
	"rule.morning_buffer.own_hint": "In the morning I first charge up to {soc} % from the sun, then the grid gets the morning sun.",
	"tip.r_morning_buffer.title": "What is the buffer for?",
	"tip.r_morning_buffer.text": "On a grid-friendly morning I let the morning sun go to the grid and fill the battery only at midday. So you don't have to buy from the grid meanwhile, I first charge a small buffer: when a cloud passes or the oven runs and the home needs more than the sun gives right now, the power comes from the battery.\nIf the battery drops below the buffer, I charge it again from the sun – never from the grid. Only then do I hold back charging again.",
	"tip.r_morning_buffer.hint": "Never less than your reserve. With several batteries working one after the other, the one that discharges first in the morning keeps it.",
	"tip.r_morning_buffer_auto.title": "How do I work out the suggestion?",
	"tip.r_morning_buffer_auto.text": "I look at your sunny mornings: how much extra power did the home need between the moment the sun covers it and the midday peak – because a cloud came or a big appliance ran? What would have been enough on most days, I take times 1.25 for safety and put on top of your reserve.\nI learn this over years and forget nothing – recent days count a little more.",
	"tip.r_morning_buffer_auto.hint": "At most 60 %, otherwise hardly any morning sun would be left for the grid.",
	"tip.r_morning_buffer_own.title": "Own buffer",
	"tip.r_morning_buffer_own.text": "Up to this level I charge from the sun in the morning. More buffer is safer but leaves less morning sun for the grid. Less buffer gives the grid more – but on a cloud a little may come from the grid.",
	"tip.r_morning_buffer_own.hint": "If the value is below your reserve, I use the reserve.",
	"signpost.rule_transfer_guard.terms": "watchdog, charge each other, against each other, transfer, PD controller, Omnibattery, Marstek, Venus",
	"signpost.rule_morning_buffer.terms": "buffer, grid-friendly, morning sun, forenoon, cloud, oven, morning reserve",
	"rule.day_caution": "How careful?",
	"rule.day_caution.tight": "Tight",
	"rule.day_caution.normal": "Normal",
	"rule.day_caution.careful": "Careful",
	"rule.day_caution.tight.hint": "I count on 90 % of the forecast: the most surplus for evcc, but on changeable days the batteries may not get quite full.",
	"rule.day_caution.normal.hint": "I count on 80 % of the forecast: plenty of surplus, and the batteries get full reliably.",
	"rule.day_caution.careful.hint": "I count on 65 % of the forecast: a bit less surplus, but the batteries get full even on cloudy days.",
	"tip.r_day_caution.title": "How careful should I be?",
	"tip.r_day_caution.text": "I take the solar forecast (already corrected by what I learned about your system) and count on only part of it: tight 90 %, normal 80 %, careful 65 %. From that I work out when the evening sun no longer covers the house – later in summer, earlier in winter – and how slowly the batteries may charge until then.",
	"tip.r_day_caution.hint": "The more careful, the earlier and faster the batteries charge and the less is left for evcc.",
	"rule.reserve_soc.hint": "At least this much stays in every battery. If a battery's own floor is higher, that applies.",
	"tip.r_reserve_soc.text": "The lowest level for all batteries – e.g. as an emergency reserve or to spare the batteries. Each battery also has its own discharge floor (set on the device, see the battery). For each battery I use the higher of the two.",
	"tip.r_reserve_soc.hint": "10 % fits most batteries.",
	"rule.max_target_soc": "Charge at night up to",
	"rule.max_target_soc.hint": "I never charge more than this from the grid at night.",
	"rule.evening_min_soc": "Minimum in the evening",
	"rule.evening_min_soc.hint": "Empty = no minimum.",
	"rule.grid_limit_w": "Grid limit",
	"rule.grid_limit_w.hint": "Maximum power from the grid, everything together.",
	"rule.grid_limit_w.measured": "Measured: at most {kw} kW from the grid (since {date}). As long as you enter nothing, charging and the home together never take more at night.",
	"rule.grid_limit_w.measuring": "Measured: at most {kw} kW from the grid (since {date}). After a week of measuring I use it as the limit, as long as you enter nothing.",
	"rule.grid_limit_w.measured_own": "Measured: at most {kw} kW from the grid (since {date}). Your value applies.",
	"rule.grid_limit_w.take": "Use {kw} kW",
	"tip.r_grid_peak.title": "Where does the measured value come from?",
	"tip.r_grid_peak.text": "I keep the highest import from the grid I have ever measured – your grid connection managed that for sure. Without a grid limit of yours, charging and the home together stay below it at night (after a week of measuring at the earliest). **Use** enters it as your grid limit.",
	"tip.r_grid_peak.hint": "If you know your connection, better enter it yourself: 3 × 35 A is about 24 kW.",
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
	"rule.buffer_factor.hint": "Added to my calculation. I learn it myself – “Default” lets me learn it myself again.",
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
	"tip.review_battery.text": "Every night I work out how much it needs from the cheap grid to last until the sun takes over.\n**Change** – name, size, sensors, limits and whether I may control it. Once setup is done, you find all this under Devices › Batteries.\n**Leave out** – I plan without it. You can bring it back at any time.",
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
	"tip.review_home.text": "From it I learn how much you use and when – the heart of my planning. I work it out like the Energy dashboard from grid, solar and battery, so a balcony system counts too. A consumption sensor I use to compare, and in its place when the balance cannot be made.\n**Change** – choose another sensor.\n**I don't have one** or **Leave out** – then I only work it out from grid, solar and battery.",
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
	"tip.q_hot_water_action.text": "In the cheap hours I heat the water just enough to last until the next evening, starting as late as possible. Afterwards I put the switch back the way it was. How fast your tank heats up and cools down I learn myself. You can change it later under Devices › Hot water.",
	"tip.q_hot_water_action.hint": "Do you already have an automation of your own for hot water (e.g. with solar surplus)? Then make sure the two don't get in each other's way.",
	"tip.q_ev.title": "Why do I ask this?",
	"tip.q_ev.text": "If the sun won't be enough tomorrow, I can have the car charged cheaply at night. If you say yes, you can set up charging right here – or later under Devices › Car & charging.",
	"tip.q_household.title": "Why do I ask this?",
	"tip.q_household.text": "Whether someone is at home changes consumption a lot. With presence and calendars I learn when you need how much – when working from home, for example.\n**Doesn't live here** – I leave that person out.",
	"tip.q_household.hint": "Everything stays in your Home Assistant.",
	"tip.q_climate.title": "What does running heating & cooling mean?",
	"tip.q_climate.text": "When nobody is home, I turn thermostats down and air conditioners up or off. When someone heads home, it's comfortable again in time. Afterwards I set everything back the way it was.",
	"tip.q_climate.hint": "Yes doesn't switch any device yet: you choose each one I may run.",
	"tip.q_home_office.title": "Why do I ask this?",
	"tip.q_home_office.text": "Working from home uses more power and heat during the day. With your answer I count workdays right, even when the calendar says nothing about it.",
	"tip.q_home_office.hint": "You can also set this per person – under Household › Days & calendars.",
	"tip.q_ev_action.title": "What am I setting up?",
	"tip.q_ev_action.text": "I charge the car in the cheap hours when the sun won't be enough tomorrow, and set everything back afterwards. If you like, I charge by need: only as much as tomorrow's trips take. You can change this later under Devices › Car & charging.",
	"tip.q_ev_action.hint": "Does your wallbox already charge with solar surplus on its own (e.g. through evcc)? Then make sure the two don't get in each other's way.",
	"tip.ask_later.title": "What does “Later” do?",
	"tip.ask_later.text": "I leave the question open for now and go on with the next one. After the start it waits on the overview under “Joe needs you” – a tap takes you where you answer it.",
	"tip.ask_later.hint": "“I don't know” is an answer too: then I go with a starting value and don't ask again.",
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
	"tip.f_battery_control.title": "What is under Control?",
	"tip.f_battery_control.text": "At the top it says how I control this battery. With “Set up levers” you decide which switches and values I use; with “Watch only” I just watch and switch nothing. In Live mode I set the charge target and discharging myself and put everything back at the end of each night.\nBelow are the name, size, maximum power, discharge limit and, with several batteries, the order. Every field has its own explanation. Whatever you change there, I save right away.",
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
	"tip.r_min_saving.text": "Every time I take control, I write values into your devices. If a night would bring less than this amount, I skip it and the batteries run as if I weren't there. Maintenance nights are exempt.",
	"tip.r_grid_friendly.title": "What does grid-friendly mean?",
	"tip.r_grid_friendly.text": "At midday all solar systems deliver the most at once – the grid is full. In the morning and evening everyone needs power – it is short.\n**Batteries**: On sunny days I first charge a small buffer from the sun in the morning, then I hold back charging, the surplus goes to the grid and the battery fills at the midday peak. I take only 80 % of the forecast and let go early when the sun lags. This works with batteries whose charging power I can limit.\n**Morning and evening** the home takes power from the battery instead of the grid.\n**Car**: If it leaves only in the afternoon, it charges with the sun instead of at night.",
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
	"tip.r_reset_lead_min.text": "This many minutes before the cheap window ends I put everything back, for example the wallbox from “Now” to “PV”. Some devices keep running for a moment – this way nothing lands in the pricier day tariff.",
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
	"overview.inbox": "Joe needs you",
	"overview.inbox.count": "{count} open",
	"overview.todo.dismiss": "Don't need it",
	"overview.inbox.more": "Show {count} more",
	"overview.inbox.less": "Show less",
	"overview.ask.one": "I have a question about one day",
	"overview.ask.many": "I have questions about {count} days",
	"overview.ask.text": "Tap here – a short answer is enough, then I learn the right thing.",
	"overview.todo.car_setup_many": "Charging isn't set up yet: {names}",
	"overview.todo.test": "{name} needs a test run",
	"overview.todo.test.text": "Without a test run I only watch this battery. The test takes a few minutes.",
	"overview.todo.test.outdated": "Something changed at this battery since the last test run. Until the next one I only watch.",
	"overview.todo.test_many": "Test run missing: {names}",
	"overview.todo.test_many.text": "Without a test run I only watch these batteries. Each test takes a few minutes.",
	"overview.todo.car_many": "Not charging by need: {names}",
	"overview.todo.notify": "No notifications yet",
	"overview.todo.notify.text": "Tell me where I may write – then I ask in the evening and let you know when something is stuck.",
	"overview.todo.later": "Still open from the setup: {topic}",
	"overview.todo.later.text": "You put this question off. You can answer it under {place}.",
	"overview.todo.climate": "Heating & cooling isn't set up yet",
	"overview.todo.climate.text": "I found devices for heating or cooling. Tell me which ones I may control.",
	"overview.todo.car": "{name} doesn't charge by need",
	"overview.todo.car.setup": "{name}: charging isn't set up yet",
	"overview.todo.car.text": "With your appointments I charge at night just as much as you need the next day.",
	"overview.todo.new": "Newly found: {names}",
	"overview.todo.new.text": "I don't use it yet. Have a look under Devices.",
	"overview.doing": "What Joe is doing",
	"overview.doing.battery": "{name}: {what}",
	"overview.doing.action": "{name} runs until {time}",
	"overview.doing.away": "{count} rooms set to away because nobody is home",
	"overview.doing.away_one": "{name} set to away because nobody is home",
	"overview.doing.night": "{count} rooms at bedtime",
	"overview.doing.night_one": "{name} at bedtime",
	"overview.quick": "Quick",
	"overview.climate": "Heating & cooling",
	"overview.climate.all": "Show all →",
	"overview.climate.would": "Preview",
	"overview.who": "Who's home",
	"overview.who.home": "Home: {names}",
	"overview.who.nobody": "Nobody home",
	"overview.who.coming": "{name} in {minutes} min",
	"overview.who.coming_soon": "{name} is heading home",
	"overview.who.guest": "guest home",
	"overview.who.day.workday": "workday today",
	"overview.who.day.weekend": "weekend",
	"overview.who.day.holiday": "day off today",
	"overview.who.day.home_office": "Working from home: {names}",
	"overview.result": "What it would have saved",
	"overview.result.saved": "{night}: saved {value}",
	"overview.result.cost": "{night}: {value} more",
	"overview.result.same": "{night}: no difference",
	"overview.result.total": "Since {since}: {value} over {nights}",
	"overview.result.provisional": "provisional, as of {time}",
	"overview.result.last": "Last night",
	"overview.result.night": "Night to {day}",
	"overview.result.none": "After the first planned night I work out what my plan would have saved.",
	"tip.inbox.title": "What is this?",
	"tip.inbox.text": "Everything I need you for: your answer for tonight, notes about your devices, what isn't set up yet, newly found devices and questions about unusual days. Error notes stay at the top until the error is fixed. I show three lines first, the rest under “Show … more”. Tapping a line takes you to where you sort it out. If nothing is open, this box disappears.",
	"tip.todo_dismiss.title": "What does “Don't need it” do?",
	"tip.todo_dismiss.text": "The row disappears and I won't show it again. Nothing else changes – you can still set it up any time where the row leads.",
	"tip.quick.title": "What is “Quick” for?",
	"tip.quick.text": "Shortcuts for the moment: charge a car now or tonight, switch guest mode on or off. Nothing here is set for good – that happens on the device's page and under Household.",
	"tip.overview_climate.title": "What does the list show?",
	"tip.overview_climate.text": "Every device I control: how warm it is and should be, which profile runs and why. Tap one to open its page.",
	"tip.overview_climate.hint": "“Preview” means: I only show what I would do. I switch only in Live mode.",
	"overview.week": "The last 7 days",
	"overview.week.known": "{days} days remembered",
	"overview.week.none": "Nothing recorded yet – it starts after the first full hour.",
	"overview.week.more": "All days in Review",
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
	"history.failed": "I couldn't load the past days just now.",
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
	"tip.now.text": "What's flowing right now: what the sun produces, what the home uses, whether the batteries charge or discharge and whether power comes from or goes to the grid. Live from your sensors. Below it: what I'm doing with your devices right now.",
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
	"plan.why.dynamic": "For market prices I need the prices of the coming hours. Pick the price sensor of your tariff integration under Devices › Grid & sun › Tariff.",
	"plan.why.no_prices": "Your price sensor does not provide a price list for the coming hours. Pick a sensor that has them under Devices › Grid & sun › Tariff (e.g. Nord Pool, EPEX Spot, Tibber, ENTSO-E).",
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
	"plan.math.tomorrow.person": "{name}: {label}",
	"plan.math.tomorrow.scaled": "for the whole day I expect {expected} kWh instead of the usual {usual} kWh",
	"plan.math.tomorrow.usual": "I calculate as for a usual day",
	"plan.math.weather": "Weather tomorrow",
	"plan.math.day": "Tomorrow is",
	"plan.math.day.workday": "working day",
	"plan.math.day.off": "weekend or holiday",
	"plan.math.home": "Consumption tomorrow",
	"plan.math.home.history": "from {days} days, {kind}",
	"plan.math.home.default": "default of a typical household",
	"plan.math.workday": "for a working day",
	"plan.math.day_off": "for a weekend or holiday",
	"plan.math.target": "Target",
	"plan.math.target.sub": "{optimum} % would be needed, plus {buffer} % buffer on the part above the reserve",
	"plan.math.prices": "Prices",
	"plan.math.prices.value": "cheap {night} · otherwise {day} · feed-in {feed}",
	"plan.math.prices.assumed": "I don't know all prices – I assumed the missing ones. Enter them under Devices › Grid & sun.",
	"plan.math.rules": "Rules",
	"plan.math.rules.value": "reserve {reserve} % · at most {max} % · discharging: {mode}",
	"history.chart.plan": "Plan",
	"tip.plan_target.title": "What does the target mean?",
	"tip.plan_target.text": "The batteries should leave the cheap hours at this level. Below it I charge from the grid – as late as possible. Above it they only discharge down to the target, so there's enough until the sun takes over.",
	"tip.plan_target.hint": "In the simulation I don't switch anything – I only show what I would do.",
	"tip.plan_refresh.title": "When do I plan again?",
	"tip.plan_refresh.text": "Every hour by myself, with the latest forecast. Shortly before the cheap hours I fix the plan, then it stays until the morning. **Plan again** calculates right away.",
	"tip.plan_math.title": "How do I decide?",
	"tip.plan_math.text": "I play through the hours until the next night – for every possible target – and take the one that costs you least. Since I'm still learning, I add a buffer. **Change →** takes you to where a value is set.",
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
	"learn.model": "Consumption and weather",
	"learn.model.no_weather": "As long as no weather forecast is chosen, I don't know the outdoor temperature. Once you pick one, I learn how much more you use when it's cold.",
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
	"learn.battery.odd": "That doesn't match the {value} kWh the device reports – I'd rather use the device value. Check the sensors for charge level and power.",
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
	"learn.hot_water.none": "Set up your hot water with a temperature sensor under Devices › Hot water, then I learn how fast it heats and how much you use a day.",
	"learn.presence": "Who is at home when",
	"learn.presence.value": "{label}: {hours} h",
	"learn.presence.no_person": "Without people in Home Assistant I can't see when someone is home.",
	"learn.presence.none": "Assign calendars to people, then I learn how many hours they are at home on office, home office or vacation days.",
	"learn.presence.calendars": "Assign calendars →",
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
	"learn.reset.forget.all": "Forecast factors, time shift, weather classes, forecast sources, the learned buffer, all calculations for consumption, batteries, hot water and cars, how fast each room warms up, and the record of what it would have brought.",
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
	"action.need.no_calendars": "Nobody has a calendar yet. You assign calendars under Household › Who lives here.",
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
	"action.need.no_routing": "I can only work out how far appointments are once you pick a routing service under Household › Travel & weather. Until then only appointments at a zone and your usual distance count.",
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
	"settings.routing": "Routing service",
	"settings.routing.intro": "For car trips and the way home I work out how far a place is and how long the drive takes. For that I send an appointment's place or a person's rounded position, and your home location from Home Assistant, to the service you pick here – never an appointment's title or description.",
	"settings.routing.service": "Service",
	"settings.routing.service.hint": "Once per appointment place, then I remember the distance. On the way home I ask more often.",
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
	"learn.car.none": "Switch on “Charge by need” for your car under Devices › Car & charging, then I learn how much it really needs.",
	"learn.reset.scope.car": "Cars",
	"learn.reset.forget.car": "Consumption and usual distance of your cars.",
	"learn.reset.scope.climate": "Heating & cooling",
	"learn.reset.forget.climate": "How fast each room gets warm or cool. Until I've learned it again, I assume 1.5 °C per hour.",
	"devices.action.why.enough_range": "The car has enough for tomorrow – I won't charge it tonight.",
	"devices.action.why.sun_before_trip": "The first trip is only in the afternoon and enough sun comes – it charges the car first.",
	"devices.action.why.need_unknown": "I don't know the car's charge level – I decide by the sun.",
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
	"tip.sim_result.hint": "Calculated with your prices from Devices › Grid & sun.",
	"tip.learn_solar.title": "What is the forecast factor?",
	"tip.learn_solar.text": "Every day I compare the previous evening's forecast with what your system delivered and take the middle value of the last four weeks. Outliers like a snow-covered roof hardly count that way. I convert every new forecast with it.",
	"tip.learn_shift.title": "What is the time offset?",
	"tip.learn_shift.text": "Some forecasts label their hours by the end instead of the start – then they're an hour off. Every day I check whether the curve fits better shifted by an hour, and only shift it once that's clearly the case on most days.",
	"tip.learn_buffer.title": "Why a buffer?",
	"tip.learn_buffer.text": "I charge a bit more than needed – for mornings when you use more or the sun comes later. How much I learn from the replayed nights: enough to have lasted on 8 out of 10 mornings. Too much buffer costs money, too little does too.",
	"tip.learn_buffer.hint": "You can set your own value under Settings › Rules.",
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
	"tip.learn_groups.text": "This shows me which device needs more when it's cold. When I run a device in the cheap window at night, I move exactly as much of its daytime use into the night as it will probably need tomorrow.",
	"tip.learn_hot_water.title": "What do I learn about hot water?",
	"tip.learn_hot_water.text": "How fast the tank heats, how much it loses standing and how many degrees you use a day. From that I work out the target temperature for the night and when heating must start to be done by the end of the cheap window.",
	"tip.learn_presence.title": "Why presence?",
	"tip.learn_presence.text": "From your calendars I read what is on tomorrow – office, home office, vacation. How many hours someone is home on such days, I learn from their presence in Home Assistant. Whoever is home uses more; that goes into tomorrow's calculation.",
	"tip.learn_calendar.title": "How do I read your calendars?",
	"tip.learn_calendar.text": "For each person I look into their calendars, all-day events first. The first matching keyword decides the kind of day. If an event fits several kinds, the upper row wins.\nUpper and lower case don't matter.",
	"tip.cal_defaults.title": "And without an event?",
	"tip.cal_defaults.text": "If there's no matching event, I take this kind – depending on whether the day is a working day or a day off.",
	"tip.learn_reset_scope.title": "Which area?",
	"tip.learn_reset_scope.text": "**Sun** after new panels or a different forecast, **Consumption** after moving or a new heating, **Batteries** after a replacement or an extension, **Hot water** after a new boiler, **Cars** after changing cars, **Heating & cooling** after new radiators, thermostats or insulation. **Everything** when a lot has changed.",
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
	"tip.routing_service.text": "**Waze**: free, no sign-up, through Home Assistant's own Waze action.\n**Google**: needs a set-up “Google Maps Travel Time” integration with an API key; switch off its polling every 10 minutes there, or the free calls are gone quickly.\n**OpenStreetMap**: free, open map; Photon finds the place and OSRM the route.\nI ask about each appointment's place only once and remember the distance. If an appointment is at a Home Assistant zone, I need no service. Only for the way home I ask more often, while someone is heading home.",
	"tip.routing_service.hint": "Only an appointment's place, or a person's position on the way home rounded to about 100 m, plus your home location as the route's start are sent – never a title or description.",
	"tip.routing_osm.title": "What is this?",
	"tip.routing_osm.text": "The addresses of the free OpenStreetMap services. They are here so you can switch to your own or another server without waiting for an update.",
	"tip.need_trips.title": "Where do the kilometres come from?",
	"tip.need_trips.text": "From the places of your appointments tomorrow, worked out with the routing service under Household › Travel & weather. If a distance is wrong, enter the one-way distance – I remember it for this place.",
	"tip.learn_car.title": "What do I learn about the car?",
	"tip.learn_car.text": "From odometer and charge level: how much energy the car really needs per 100 km, how much more in the cold, and how far it drives on a usual working day and day off. From that I work out what it needs tomorrow.",
	"tip.chart_replay.title": "What am I looking at?",
	"tip.chart_replay.text": "How full the batteries would have been that day **with my plan** and how full **without**. Both replayed with the real sun and your real consumption.",
	"mode.advisory": "Suggest",
	"mode.advisory.sub": "Joe asks every evening",
	"mode.advisory.desc": "I ask you every evening whether I may steer the night. Without your yes I switch nothing.",
	"mode.untested": "Not tested yet: {names}. I only watch them until the test run under Devices › Batteries has passed.",
	"mode.none_tested": "No battery has passed the test run yet – I would only watch. Do the test run under Devices › Batteries first.",
	"mode.to_batteries": "To the batteries →",
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
	"devices.role.steers": "I steer",
	"devices.role.watches": "I watch",
	"devices.role.measures": "Measured only",
	"devices.group.go": "Show all →",
	"devices.no_meter_group": "without a meter",
	"devices.car.lead": "A car has its need – trips, appointments, level. A charge point is the wallbox I switch. I always charge the car that is plugged in: by need when power is cheap, or right away when you want.",
	"devices.hot_water.lead": "I heat the water in the cheap hours so it lasts until the next evening.",
	"devices.other.lead": "All meters from your Energy dashboard. Tell me what each device is and when it runs – then my numbers are right. A device that should run at night I switch on in the cheap hours.",
	"devices.other.empty": "There are no more devices in the Energy dashboard.",
	"devices.car.terms": "Appointments",
	"devices.car.terms_off": "You can set up the appointments already. They count once “Charge by need” is on under Steering above and saved.",
	"car.explain.title": "How does the calendar work?",
	"car.explain.why": "To charge only what the car really needs tomorrow, I have to know **where it drives**. I read that from appointments with a place. The catch: your own calendars also hold appointments you go to by bike, train or another car. That is why there is a **calendar just for this car**: whatever is in it is surely a trip with exactly this car.",
	"car.explain.two": "Two kinds of appointments",
	"car.explain.car_cal": "**Calendar of “{name}”:** every appointment with a place in it is a trip with this car. This is the precise way.",
	"car.explain.persons": "**People's calendars** (“Whose appointments count”): their appointments with a place count as trips with this car too. That only fits if these people mostly drive this car. If you pick nobody here, only the car's calendar counts.",
	"car.explain.ways": "How does an appointment get into the car's calendar? Three ways – pick one below:",
	"car.explain.way.calendar": "**Ready-made calendar:** you already have a calendar just for the car (e.g. a shared Google or iCloud calendar “Car”) and it is in Home Assistant. Whoever takes the car adds the appointment there or copies it in.",
	"car.explain.way.mailbox": "**Mailbox without calendar:** the car gets its own e-mail address (e.g. kona123@web.de). Whoever needs the car **invites this address to their appointment** – like a colleague. I fetch the invitation, accept it and put the appointment into my calendar for the car.",
	"car.explain.way.account": "**Mailbox with calendar:** as above, but the address has a calendar of its own (Google, Microsoft, iCloud, Infomaniak). The invitation lands there by itself; I read that calendar and accept there.",
	"car.explain.example.title": "An example",
	"car.explain.example.1": "On Tuesday at 9:00 you have a meeting at a customer's, place: “Hauptstraße 5, Köln”.",
	"car.explain.example.2": "You take “{name}”, so you invite the car's address to the meeting (or add it to the car's calendar).",
	"car.explain.example.3": "The appointment is now in the calendar of “{name}”. I work out the distance (doubled with “There and back”) and add the reserve.",
	"car.explain.example.4": "In the night before Tuesday I charge only what the car is missing for it, at the cheapest time.",
	"car.explain.rules": "Good to know",
	"car.explain.rule.place": "Only appointments **with a place** count – without one I don't know where to go.",
	"car.explain.rule.online": "I leave out online meetings (Teams, Zoom & co.).",
	"car.explain.rule.twice": "If the same appointment is in the car's calendar and a person's, I count it once.",
	"car.explain.rule.none": "If nothing is in the calendar for tomorrow, I use your usual distance per day.",
	"action.need.max_soc": "Charge at most to",
	"action.need.capacity_sensor": "Battery size from a sensor",
	"action.need.consumption_sensor": "Consumption from a sensor",
	"tip.a_need_max_soc.title": "Why at most?",
	"tip.a_need_max_soc.text": "Charging by need never goes above this level – for example 80 % if you want to spare the battery. If tomorrow needs more, you see it under “Trips tomorrow”.",
	"tip.a_need_capacity_sensor.title": "Which sensor for the battery size?",
	"tip.a_need_capacity_sensor.text": "If no integration shows the battery size, pick a sensor here – or enter the size above under Steer.",
	"tip.a_need_consumption_sensor.title": "Which sensor for the consumption?",
	"tip.a_need_consumption_sensor.text": "The car's own long-term average (kWh/100 km, Wh/km or km/kWh). Until I have learned my own value I use it.",
	"car.delete": "Delete car",
	"car.delete.ask": "Really delete {name}? Its appointments, mailbox and what I learned about the car are gone then. The wallbox stays. I leave its integrations out afterwards – “Search for cars again” finds them again.",
	"tip.car_delete.title": "What happens when I delete it?",
	"tip.car_delete.text": "The car is gone – with its appointments, mailbox and what I learned. I keep switching the wallbox. I leave its integrations out afterwards, so the car doesn't come back by itself. Under Devices › Car & charging, “Search for cars again” finds them again – make a car of them there, or attach them to a car under Sources.",
	"car.f.name": "Name",
	"tip.car_name.title": "Which name?",
	"tip.car_name.text": "This is what I call the car everywhere – in questions, reminders and the plan.",
	"car.f.remind": "Remind me when it is not plugged in",
	"car.f.remind_at": "in the evening at",
	"car.f.remind_time": "Time of the reminder",
	"tip.car_remind.title": "When do I remind you?",
	"tip.car_remind.text": "If the car needs charging for tomorrow and is not plugged into any wallbox at this time, I tell you – under Overview and, if set up, on your phone. Once an evening.",
	"car.f.tracker": "Where is the car?",
	"car.pick.tracker": "Where is the car?",
	"tip.car_tracker.title": "Why the location?",
	"tip.car_tracker.text": "When a car is plugged in and only one is at home, I know which one it is. Usually the maker's integration brings the location; otherwise pick a tracker or a person here.",
	"car.merge.ask": "Do “{a}” from evcc and “{b}” from {from} belong together?",
	"car.merge.text": "Then it is one car with the values of both – I prefer the level from evcc.",
	"car.merge.yes": "Yes, one car",
	"car.merge.no": "No, two cars",
	"car.merge.with": "Merge with …",
	"car.merge.do": "Merge",
	"tip.car_merge.title": "Why do I ask?",
	"tip.car_merge.text": "The same car often shows up twice: in evcc and in the maker's integration. If name, level or odometer clearly match, I merge them myself. When I am unsure, I rather ask. You can split them again under Sources at any time.",
	"tip.car_merge_with.title": "When to merge?",
	"tip.car_merge_with.text": "When two cars here are really one. The settings of the car that charges by need stay; the other's sources join it.",
	"car.open_point": "Open charge point",
	"car.plugged_at": "plugged into {point}",
	"car.plugged_elsewhere": "plugged into a wallbox I don't switch",
	"car.not_plugged": "not plugged in",
	"car.reminder": "{car} needs {km} km tomorrow but is not plugged in",
	"car.reminder.text": "Plug it in tonight and I charge it in the cheap hours.",
	"car.role.soc": "Level",
	"car.role.range": "Range",
	"car.role.capacity": "Battery size",
	"car.role.plugged": "Plugged in",
	"car.role.charging": "Charging",
	"car.role.odometer": "Odometer",
	"car.role.consumption": "Consumption",
	"car.role.outside_temp": "Outside temperature",
	"car.role.location": "Location",
	"car.source.car": "car integration",
	"car.source.manual": "chosen by hand",
	"car.source.chip": "from {from}",
	"car.source.chip_manual": "chosen by hand",
	"car.source.from": "via {from}",
	"car.source.gives": "gives: {roles}",
	"car.source.evcc_only": "evcc tells me whether the car is plugged into a wallbox, and its level there.",
	"car.source.nothing": "gives no values right now",
	"car.source.split": "Split",
	"car.source.vehicle": "in evcc: {id}",
	"car.platform.kia_uvo": "Hyundai / Kia",
	"car.platform.ha_kia_hyundai": "Hyundai / Kia",
	"car.platform.bmw_connected_drive": "BMW",
	"car.platform.bavariandata": "BMW",
	"car.platform.cardata": "BMW",
	"car.platform.tesla_fleet": "Tesla",
	"car.platform.teslemetry": "Tesla",
	"car.platform.tesla_custom": "Tesla",
	"car.platform.volkswagen_we_connect_id": "Volkswagen",
	"car.platform.renault": "Renault",
	"car.platform.mbapi2020": "Mercedes-Benz",
	"car.platform.byd_vehicle": "BYD",
	"car.platform.audiconnect": "Audi",
	"car.platform.stellantis_vehicles": "Stellantis",
	"car.sources": "Sources",
	"tip.car_sources.title": "Where do the values come from?",
	"tip.car_sources.text": "A car may come from several integrations. I prefer the level from evcc – evcc estimates it while charging instead of asking the car. Range, odometer, location and outside temperature come from the maker's integration. I never ask the car myself and never wake it up.",
	"car.sources.manual": "Chosen by hand",
	"car.sources.manual.hint": "For a car no integration shows – or when I cannot find a value.",
	"car.sources.manual.open": "Pick sensors by hand",
	"tip.car_manual.title": "When do I pick by hand?",
	"tip.car_manual.text": "Only when an integration does not give a value or a car has no integration at all. What the integrations give, I read by myself.",
	"car.sources.none": "No integration yet – pick the sensors by hand below.",
	"tip.car_split.title": "What does split mean?",
	"tip.car_split.text": "This source is another car: it becomes a car of its own, and I no longer ask whether the two belong together.",
	"car.search": "Search for cars again",
	"car.search.busy": "I'm looking for cars in Home Assistant …",
	"car.search.failed": "The search didn't work just now. Please try again in a moment.",
	"car.search.lead": "I see these cars in Home Assistant – from evcc and from the makers' integrations. Also the ones you left out before.",
	"car.search.none": "I don't see any car in Home Assistant right now – neither in evcc nor in a maker's integration.",
	"car.find.of": "belongs to {car}",
	"car.find.ignored": "left out before",
	"car.find.new": "not part of any car yet",
	"car.find.open": "View",
	"car.find.use": "As a new car",
	"car.find.reuse": "Use again",
	"tip.car_search.title": "What do I find when searching?",
	"tip.car_search.text": "I look for every car in Home Assistant: the vehicles from evcc and the makers' integrations, such as Hyundai, BMW or Tesla. Also the ones you left out before or deleted with a car. Searching changes nothing – you decide what happens with them.",
	"tip.car_search_use.title": "A new car or part of a car?",
	"tip.car_search_use.text": "“As a new car” and “Use again” make a car of its own. If the integration shows a car you already have, open that car and choose “Add a source” under Sources.",
	"car.attach.open": "Add a source",
	"car.attach.lead": "Which integration also shows {car}? Tap one or more.",
	"car.attach.none": "I don't see any other integration with a car. Set it up in Home Assistant, then search again.",
	"car.attach.from": "belongs to {car} so far",
	"car.attach.do": "Add to {car}",
	"car.attach.ask": "“{name}” belongs to “{from}” so far. I take it away there and attach it to “{car}”.",
	"car.attach.empty": "“{from}” has no integration left then – you pick its sensors by hand, or delete it.",
	"car.attach.yes": "Yes, attach here",
	"car.attach.no": "Cancel",
	"car.attach.close": "Close",
	"tip.car_attach_open.title": "When to add a source?",
	"tip.car_attach_open.text": "When I didn't match an integration of your car by myself – for example because you deleted the car once. A car can have several sources: evcc, the maker's app and more.",
	"tip.car_attach.title": "What happens when adding?",
	"tip.car_attach.text": "The integration then belongs to this car: I read the level, range, odometer, whether it's plugged in, where it is and the outside temperature from there too. If it belonged to another car, I take it away there. If you had left it out, I use it again. “Split” undoes it.",
	"car.trips": "Trips tomorrow",
	"car.trips.none": "Once I plan the night, you see here what is coming up tomorrow.",
	"car.values.none": "No values yet – Sources shows where they should come from.",
	"car.value.unknown": "–",
	"car.value.plugged": "yes",
	"car.value.unplugged": "no",
	"car.value.home": "at home",
	"car.value.away": "away",
	"tip.car_now.title": "What do I see here?",
	"tip.car_now.text": "The car's values, each with its source, where it is plugged in, charge now or tonight, and what is coming up tomorrow.",
	"tip.car_steer.title": "What do I set here?",
	"tip.car_steer.text": "Everything the car needs: charging by need, the reserve, how high I charge at most, and the evening reminder. Which wallbox I switch is set at the charge point.",
	"tip.car_terms.title": "Why the appointments?",
	"tip.car_terms.text": "From the appointments I know how far the car drives tomorrow. Whose appointments count, you choose here.",
	"tip.car_save.title": "What happens when I save?",
	"tip.car_save.text": "I plan the night again with these values. Nothing changes at the charge point.",
	"devices.add.wallbox": "Wallbox",
	"devices.add.wallbox.text": "I switch it on at night and charge whichever car is plugged in.",
	"devices.add.car.title": "Add |a car",
	"devices.add.car.lead": "I see these cars in Home Assistant. If evcc and the maker show the same car, I merge them – or ask you.",
	"devices.add.car.none": "I don't see another car.",
	"devices.add.car.by_hand": "Or add a car by hand",
	"devices.add.car.name": "Name of the car",
	"devices.add.car.make": "Add",
	"tip.devices_add_car.title": "Where do I know the cars from?",
	"tip.devices_add_car.text": "From evcc (its vehicles) and from the makers' integrations, such as Hyundai, BMW or Tesla. A car that shows up in both becomes one.",
	"tip.devices_add_car_hand.title": "When by hand?",
	"tip.devices_add_car_hand.text": "For a car without an integration, such as a friend's car that often charges here. You pick its sensors afterwards under Sources – or leave them empty.",
	"devices.car.cars": "Cars",
	"devices.car.points": "Charge points",
	"devices.group_add.wallbox": "Add a wallbox",
	"devices.charge.guessed": "I assume this car is plugged into {point}. If not, tell me at the charge point.",
	"devices.charge.label_at": "Charge at {point} to",
	"devices.charge.no_level": "I don't know the level and range of {car} right now – Sources shows where they come from.",
	"devices.charge.not_plugged": "{car} is not plugged in right now. Once it is at a wallbox you can charge it here.",
	"devices.action.why.guest": "A guest is charging – I leave the wallbox alone, evcc does what it is set to.",
	"devices.action.why.unknown_car": "I don't know which car is plugged in – until you tell me, I leave the wallbox alone.",
	"devices.action.why.not_plugged": "Not tonight: no car plugged in.",
	"plan.car_at": "{car} · at {point}",
	"plan.car_away.missing": "Not plugged in – does not charge tonight although tomorrow needs more.",
	"plan.car_away.enough": "Not plugged in – but needs nothing for tomorrow either.",
	"point.ask": "Which car is plugged into the wallbox “{point}”?",
	"point.ask.text": "Until I know, I leave the wallbox alone.",
	"point.f.cars": "Which cars may charge here",
	"point.f.no_cars": "No car yet – add one under “Add a car”. Until then I switch the wallbox by the sun.",
	"point.f.unknown": "When I can't tell the car",
	"point.f.unknown.hint": "Telling means: evcc says so, the car's plug sensor shows it, or only one car is at home.",
	"point.f.assume": "Which car I assume",
	"point.unknown.ask": "ask",
	"point.unknown.assume": "always assume",
	"point.forget": "Let Joe tell again",
	"point.guest": "Guest / other car",
	"point.open_car": "Open {car}",
	"point.other_car": "Another car?",
	"point.state.car": "{car} is plugged in ({how})",
	"point.state.empty": "free – no car plugged in",
	"point.state.guest": "guest / other car – I switch nothing here",
	"point.state.unknown": "a car I can't tell",
	"point.state.free": "charges by the sun (no car added yet)",
	"point.state.none": "not read yet",
	"point.how.evcc": "told by evcc",
	"point.how.plugged": "by the car's plug sensor",
	"point.how.home": "the only car at home",
	"point.how.answer": "you said so",
	"point.how.assume": "as set",
	"tip.point_cars.title": "Which cars may charge here?",
	"tip.point_cars.text": "Default: all. If only one car charges here, I can tell it more surely and ask less often.",
	"tip.point_unknown.title": "What if I can't tell the car?",
	"tip.point_unknown.text": "“Ask”: I leave the wallbox alone and ask you – on your phone and under Overview. “Always assume”: I take this car and charge by its need.",
	"tip.point_unknown.hint": "A guest: answer “Guest / other car” – then evcc does what it is set to.",
	"tip.point_which.title": "How do I tell the car?",
	"tip.point_which.text": "In this order: the vehicle evcc shows at the charge point; the car's plug sensor; the only car at home. Otherwise I ask you. Your answer counts until the car is unplugged.",
	"tip.point_now.title": "What do I see here?",
	"tip.point_now.text": "Which car is plugged in right now and how I know. If I am wrong, tell me the right car.",
	"tip.point_steer.title": "What do I set here?",
	"tip.point_steer.text": "What I switch at the wallbox (with evcc its mode, not evcc's own charging plan), when I switch it on, which cars may charge here, and what I do with a car I can't tell.",
	"settings.notify.cars": "Cars",
	"settings.notify.cars.hint": "Which car is at the wallbox when I can't tell – and in the evening when a car for tomorrow is not plugged in.",
	"tip.notify_cars.title": "What do I ask about the cars?",
	"tip.notify_cars.text": "When a car I can't tell is plugged in, I ask with one button per car and “Guest”. In the evening I remind you when a car should charge for tomorrow but is not plugged in. You set the time at the car.",
	"signpost.wallbox": "Charge point / wallbox",
	"signpost.wallbox.terms": "Wallbox, charge point, charging station, evcc, mode, which car is plugged in, guest, other car, tell the car",
	"signpost.car_sources": "A car's sources",
	"signpost.car_sources.terms": "evcc, Hyundai, maker, integration, merge, split, add a source, search again, left out, level, odometer",
	"signpost.car_reminder": "Reminder: plug in the car",
	"signpost.car_reminder.terms": "reminder, plug in, evening, not plugged in, notification",
	"devices.hot_water.lonely": "I know this hot water meter from your Energy dashboard. Set up once what I switch – then I heat up in the cheap hours.",
	"devices.hot_water.set_up": "Set up hot water",
	"devices.other.night_offer": "Should I switch the device on in the cheap hours at night when tomorrow's sun is not enough?",
	"devices.other.night_add": "Set up →",
	"devices.other.no_meter": "I don't know a meter for this device. Under Control at “Belongs to” you can pick one from the Energy dashboard.",
	"devices.moved_to": "is now under {group} →",
	"devices.meter": "Meter",
	"action.steer.unsaved": "Not saved yet.",
	"action.delete.ask.car": "Should I really forget charging “{name}”? The car stays in Home Assistant, I just stop charging it.",
	"action.delete.ask.hot_water": "Should I really stop controlling “{name}”? The boiler stays in Home Assistant, I just stop heating it ahead.",
	"action.delete.ask.other": "Should I really stop switching on “{name}” at night? The device stays in Home Assistant.",
	"action.delete.yes": "Yes, delete",
	"action.delete.no": "No, keep it",
	"action.title.ev": "Set up |charging",
	"action.title.hot_water": "Set up |hot water",
	"action.title.custom": "Switch on |at night",
	"action.need.person_open": "Open →",
	"action.need.person_open_of": "Open {name} under Household",
	"action.need.people_link": "Go to Who lives here →",
	"action.need.routing_link": "Choose a routing service →",
	"tip.devices_lonely_hot_water.title": "Why does it say “set up” here?",
	"tip.devices_lonely_hot_water.text": "From the Energy dashboard I know how much the hot water draws. To heat it ahead cheaply at night I still need to know what to switch and which sensor measures the temperature. Set that up once.",
	"devices.problem.gone": "I can't find this in Home Assistant any more.",
	"devices.unassigned": "Not assigned",
	"devices.unassigned.text": "I don't know which climate device these meters belong to. Tap one to assign it to a climate device or to tell me what it measures.",
	"devices.card.unassigned": "Which device does this belong to?",
	"devices.card.unassigned_kind": "Tell me what it measures.",
	"devices.group_add.car": "Add a car",
	"devices.group_add.hot_water": "Add hot water",
	"devices.group_add.night": "Add a device",
	"climate.assign.no_climate": "I don't know any thermostat or air conditioner yet that it could belong to. Tell me below what it measures.",
	"devices.card.setup_car": "Charging isn't set up yet.",
	"devices.card.setup_hot_water": "Hot water isn't set up yet.",
	"devices.card.climate": "{current} °C · set to {target} °C",
	"devices.card.temp": "{value} °C",
	"devices.card.kw": "{value} kW",
	"devices.card.running": "Running now",
	"devices.card.import": "drawing {value} kW",
	"devices.card.export": "feeding in {value} kW",
	"devices.grid.connection": "Grid connection & tariff",
	"devices.grid.solar": "Solar system",
	"devices.grid.home": "Home consumption",
	"grid.lead": "Where your power comes from, what it costs and where it goes: grid connection, tariff, solar system and what the house uses.",
	"grid.energy.none": "Nothing is entered in the Home Assistant Energy dashboard yet. Once you add grid, solar and battery there, I find them on my own.",
	"grid.energy.open": "Open the Energy dashboard",
	"grid.connection": "Grid connection",
	"grid.connection.say": "The grid meter measures what comes in and goes out at your house connection. That shows me whether my plans work out.",
	"grid.tariff.say": "When power is cheap and what it costs. That decides when I charge and whether it pays off.",
	"grid.tariff.unknown": "I don't know your tariff yet. Enter it below and I calculate with your real prices.",
	"grid.tariff.unsaved": "Not saved yet.",
	"grid.tariff.discard": "Discard",
	"grid.solar.say": "What your system delivers right now and what the forecast expects for tomorrow.",
	"grid.solar.factor": "Learned factor for the forecast",
	"grid.home.say": "What the house uses right now. From it I learn how much you need and when.",
	"grid.home.devices": "Assign devices →",
	"tip.grid_tariff.title": "How do I set the tariff?",
	"tip.grid_tariff.text": "First pick the kind of tariff. Then enter the cheap hours, the prices and the feed-in rate.\nThe fields depend on each other, so I only take them over when you tap **Save**. **Discard** brings back the saved tariff.",
	"tip.grid_tariff.hint": "The prices are on your electricity bill.",
	"devices.page.now": "Now",
	"devices.page.steer": "Control",
	"devices.page.power": "Power",
	"devices.page.learned": "Learned",
	"devices.page.log": "Log",
	"devices.page.intruders": "Troublemakers",
	"devices.page.remove": "Leave out",
	"devices.page.delete": "Delete",
	"devices.page.more_learned": "More in Review →",
	"devices.page.more_log": "All in Review →",
	"devices.add": "Add",
	"devices.add.label": "Add a device",
	"devices.add.title": "What would you like to |add?",
	"devices.add.lead": "Pick what's new. I'll show you what I've already found for it.",
	"devices.add.battery": "Battery",
	"devices.add.battery.text": "A home battery for me to watch or steer.",
	"devices.add.car": "Car",
	"devices.add.for": "for {name}",
	"devices.add.car.text": "How far it drives tomorrow, its level, appointments – everything it needs.",
	"devices.add.hot_water": "Hot water",
	"devices.add.hot_water.text": "I heat the water in the cheap hours.",
	"devices.add.climate": "Air conditioner or heating",
	"devices.add.climate.text": "Thermostats and air conditioners live under Heating & cooling.",
	"devices.add.night": "Device to run at night",
	"devices.add.night.text": "I switch it on in the cheap hours when tomorrow's sun won't be enough.",
	"devices.add.meter": "Device with a meter",
	"devices.add.meter.text": "Meters from the Energy dashboard: tell me what it is and when it runs.",
	"devices.add.rediscover": "Look around again",
	"devices.add.rediscover.text": "I search Home Assistant for new devices.",
	"devices.add.other": "Something else",
	"devices.add.battery.title": "Add a |battery",
	"devices.add.battery.lead": "These are the batteries I found. If yours is missing, pick its charge level yourself.",
	"devices.add.battery.none": "I haven't found another battery.",
	"devices.add.battery.pick": "Pick it myself",
	"devices.add.battery.ignored": "you left this out",
	"devices.add.battery.use": "Use again",
	"devices.found": "Newly found",
	"devices.found.lead": "I've discovered this in Home Assistant. Shall I use it?",
	"devices.found.battery": "Battery",
	"devices.found.wallbox": "Wallbox",
	"devices.found.car": "Car",
	"devices.found.use": "Use it",
	"devices.found.ignore": "Don't use",
	"tip.devices_add.title": "What can I add?",
	"tip.devices_add.text": "Anything that stores, charges or uses power: batteries, a car or wallbox, hot water, air conditioners and devices that should run at night.\nI show you first what I've already found. You don't have to type anything in.",
	"tip.device_steer.title": "What do I set under Control?",
	"tip.device_steer.text": "Here you choose what I switch and when I switch the device on at night in the cheap hours. Every field has its own explanation.\nWhat you change here only counts after “Save”. Until then your draft stays, even when you leave the page.",
	"tip.devices_found.title": "What does “Use it” do?",
	"tip.devices_found.text": "**Use it** adds the device. I watch a battery from now on; for a car or wallbox you quickly set up charging.\n**Don't use** hides it. You can bring it back any time with **Add**.",
	"devices.lead": "Everything with power in one place: Batteries, Heating & cooling, Car & charging, Hot water, More devices, Grid & sun. Tap a device to see all about it.",
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
	"devices.status.day_buffer": "Grid-friendly: I first charge up to {level} % as a buffer for you, then the grid gets the morning sun – from {time} I charge full.",
	"devices.status.done": "The night is over, everything is back.",
	"devices.pending": "A few values are not back where they were yet. I keep trying.",
	"devices.power.charge": "charging at {value} kW",
	"devices.power.discharge": "discharging at {value} kW",
	"devices.power.idle": "idle",
	"devices.release": "Release now",
	"devices.batteries.none": "I don't know any battery yet. If you have one, add it with “Add a battery”.",
	"devices.battery.profile": "{name} – recognised",
	"devices.battery.generic": "Levers assigned",
	"devices.battery.steps": "Own steps",
	"devices.battery.watch": "Watch only",
	"devices.action.charge": "Charging to {target} %",
	"devices.action.hold": "Holding at {floor} %",
	"devices.action.block": "No discharge while another one charges",
	"devices.action.defer": "Charges only from {until} – the morning sun goes to the grid",
	"devices.action.buffer": "Charges from the sun up to {level} % – your buffer for the morning",
	"devices.action.defer_buffer": "Buffer of {level} % reached – charges again from {until}, the morning sun goes to the grid",
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
	"battery.page.lead": "How full your batteries are, what I am doing with them right now and which rules apply to all of them. Tap a battery to see everything about it.",
	"battery.page.add": "Add a battery",
	"battery.page.suggested": "Found levers that may fit.",
	"battery.page.rules": "Applies to all batteries",
	"battery.page.found": "Found, but not used",
	"battery.page.found.new": "newly found",
	"battery.page.how": "How I steer it",
	"battery.page.capacity.learned": "I measured {value} kWh usable.",
	"battery.page.capacity.learning": "I measure the size while it charges and discharges. That takes a few weeks.",
	"battery.page.remove.text": "If I leave the battery out, I plan and steer without it. If I found it myself, you bring it back under “Add a battery” with “Use again”.",
	"battery.page.remove.confirm": "Really leave out {name}? What you set up here for it will be lost.",
	"battery.page.remove.go": "Yes, leave it out",
	"battery.control.title": "Levers for |{name}",
	"battery.control.lead": "Here you choose which levers I use to charge and hold the battery. I only take the change over once you press “Save”.",
	"battery.control.unsaved": "Not saved yet.",
	"tip.battery_rules.title": "What applies to all batteries?",
	"tip.battery_rules.text": "These rules apply to all batteries together. You see them here and change them in Joe's settings – “Change →” takes you straight there.\nThe **reserve** applies to all batteries, the **discharge limit** on a battery's page only to that one. The higher of the two always applies.",
	"tip.battery_found.title": "What does Use again mean?",
	"tip.battery_found.text": "I found these batteries in Home Assistant but do not use them.\n**Use it** adds a new battery, **Don't use** hides it.\n**Use again** brings back a battery you left out.",
	"tip.battery_intruders.title": "What are troublemakers?",
	"tip.battery_intruders.text": "Automations that set something on exactly this battery. If they set the same values as I do, whoever writes last wins – then the battery does not follow my plan.\n“Switch all off” only switches off this battery's automations, “Switch on again” exactly the ones I switched off.",
	"tip.battery_intruders.hint": "All automations on your batteries are listed under Devices › Batteries.",
	"tip.battery_remove.title": "What does Leave out mean?",
	"tip.battery_remove.text": "I no longer use the battery then: no plan, no steering, no learning. Nothing changes on the device or in Home Assistant.",
	"tip.battery_remove.hint": "A battery I found myself comes back under “Add a battery”.",
	"surplus.loadpoint.any": "the evcc loadpoint",
	"surplus.loadpoint.named": "the loadpoint “{names}”",
	"surplus.line.cap": "The batteries charge at {kw} kW only until {time} – the rest of the sun is left for {loadpoint}.",
	"surplus.line.cap_dry": "I would charge the batteries at {kw} kW only until {time} – the rest of the sun would be left for {loadpoint}. I only switch this in live mode.",
	"surplus.expected": "Counted carefully, about {kwh} kWh are left; the batteries are still full by {time}.",
	"surplus.doing": "Batteries charge at {kw} kW only during the day – the rest of the sun goes to {loadpoint} (until {time})",
	"surplus.state.off": "Switched off.",
	"surplus.state.no_plan": "I have no forecast for today right now – the batteries charge normally.",
	"surplus.state.night": "It is night now – I'll look again during the day.",
	"surplus.state.released": "I let go for today – the batteries charge normally.",
	"surplus.state.morning": "The grid-friendly morning runs first, then I take over.",
	"surplus.state.no_sun": "Today's sun is not enough for a surplus – the batteries charge normally.",
	"surplus.state.after_pv": "Today's sun no longer covers the house – the batteries charge normally.",
	"surplus.state.full": "The batteries are full – nothing to throttle.",
	"surplus.state.not_reachable": "Counted carefully, today's sun is not enough for full batteries and more – they charge normally.",
	"surplus.state.no_need": "The sun is just about enough – throttling is not worth it right now.",
	"surplus.state.no_battery": "No battery can take part: it needs a charge limit in W or kW and a passed test run.",
	"surplus.state.no_loadpoint": "No evcc loadpoint is set to PV or Min+PV and can take power – the batteries charge normally.",
	"surplus.state.soon": "As soon as the sun brings more than the house needs, I'll start.",
	"surplus.conflict.title": "evcc works against “Leave daytime surplus”.",
	"surplus.conflict.buffer_soc": "Battery-assisted charging is on in evcc from {value} %: evcc may then empty the battery for the loadpoint.",
	"surplus.conflict.buffer_start_soc": "In evcc charging starts from {value} % battery level even without surplus – with power from the battery.",
	"surplus.conflict.battery_boost": "Battery boost is on in evcc for {loadpoint}: the loadpoint then draws power from the battery.",
	"surplus.conflict.hint": "Switch it off in evcc under the home battery – I don't change anything in evcc.",
	"surplus.problem": "Daytime surplus:",
	"tip.surplus_evcc.title": "Why does evcc work against it?",
	"tip.surplus_evcc.text": "I slow down the batteries' charging so they are full just in time and the rest of the sun goes to evcc. But if evcc may take power from the battery itself (battery-assisted charging or battery boost), evcc empties during the day the very battery I want full – then it is missing in the evening. With Omnibattery, charge delay and predictive charging hold charging back themselves – together with my limit the battery may no longer get full.",
	"tip.surplus_evcc.hint": "You find the settings in evcc under the home battery and at the loadpoint. I only read them and never write them.",
	"plan.day_surplus": "Today during the day",
	"plan.day_surplus.battery": "{name} {kw} kW",
	"tip.plan_day_surplus.title": "What happens today during the day?",
	"tip.plan_day_surplus.text": "With “Leave daytime surplus” the batteries charge only fast enough to be full before the evening sun no longer covers the house. Here you see at what power, until when and for which evcc loadpoint – or why not right now. I work it out again every minute: with the real charge level and the real sun.",
	"tip.plan_day_surplus.hint": "The kWh left are counted carefully; if the sun shines as forecast, more is left.",
	"battery.surplus.label": "Takes part during the day",
	"battery.surplus.no_limit": "Not possible for this battery: I cannot limit its charging power without switching off its own control. It keeps charging at full power.",
	"battery.surplus.unit": "Not possible for this battery: its charge limit is in amperes (or has no unit). I cannot turn that into a safe power – better it charges normally than too slowly.",
	"battery.surplus.unavailable": "Its charge limit cannot be reached right now – it charges normally.",
	"battery.surplus.unknown": "I do not know its charge level or size right now – it charges normally.",
	"team.title": "Several batteries",
	"team.together": "{first} with {rest}",
	"team.question": "How should the batteries work together?",
	"team.mode.sequence": "One after the other (recommended)",
	"team.mode.together": "At the same time",
	"team.now": "Free right now: {parts}",
	"team.now.dry": "In live mode it would be: {parts}",
	"team.part.active_charging": "{name} charges",
	"team.part.active_discharging": "{name} discharges",
	"team.part.active_idle": "{name} is up",
	"team.part.active_charge_only": "{name} charges (discharging blocked while both charge)",
	"team.part.waits_full": "{name} blocked (waits until {active} is full)",
	"team.part.waits_empty": "{name} blocked (waits until {active} is empty)",
	"team.part.full": "{name} blocked (full)",
	"team.part.empty": "{name} blocked (empty)",
	"team.part.parallel": "{name} charges too (charging only)",
	"team.parallel": "Today both charge side by side: one after the other the sun would not last until it sets.",
	"team.state.off": "I am switched off – each battery regulates itself.",
	"team.state.together": "At the same time: each battery regulates itself, I do not step in.",
	"team.state.single": "Only one battery regulates itself – nothing to coordinate.",
	"team.state.one_group": "One system regulates all batteries – it shares the power itself. By day there is nothing for me to coordinate; I only steer at night.",
	"team.state.night": "At night my night plan steers the batteries – by day it is one after the other again.",
	"team.state.paused": "Paused today (“Release now”) – tomorrow it is one after the other again.",
	"team.state.levers": "I cannot block every battery (a limit is missing or unreachable) – so I block none right now.",
	"team.state.not_tested": "I block only once every battery has passed its test run.",
	"team.state.unknown": "I do not know a battery's level right now – I block none.",
	"team.state.automation": "Your automations {names} do this so far – I leave the batteries alone.",
	"team.state.no_grid": "Without a grid meter I cannot see whether the house needs power or gives it – I block none.",
	"team.state.not_taken": "I blocked {names}, but the block did not arrive – so I block nobody right now. I will try again in an hour.",
	"team.state.taking_over": "Your automations {names} are still running. If all stays well until {time}, I switch them off and coordinate the batteries myself again.",
	"team.state.bridging": "{why} is missing for a moment – I keep the blocks until {time}. If it is not back by then, I let go and your automations run again.",
	"team.gap.unknown": "A charge level",
	"team.gap.levers": "A battery’s limit",
	"team.gap.no_grid": "The grid meter",
	"team.state.error": "I could not decide safely just now – I block nobody, your automations run again.",
	"team.mode.default": "Default",
	"team.default": "I make sure only one system works at a time – otherwise the batteries charge each other. If you do not want that, choose “At the same time”.",
	"team.given_back.title": "Your battery automations run again",
	"team.given_back": "I could not block the batteries myself ({why}) – your automations {names} run again. As soon as it works again, I take over.",
	"team.given_back.choice": "Your automations {names} run again ({why}) – I am not coordinating the batteries myself right now.",
	"team.given_back.why.off": "I am switched off",
	"team.given_back.why.dry": "I am not live",
	"team.given_back.why.together": "you chose “At the same time”",
	"team.given_back.why.paused": "released for today",
	"team.given_back.why.levers": "a battery cannot be blocked",
	"team.given_back.why.not_tested": "a test run is missing",
	"team.given_back.why.unknown": "a charge level is unknown",
	"team.given_back.why.no_grid": "the grid meter is missing",
	"team.given_back.why.automation": "another automation steers the batteries",
	"team.given_back.why.not_taken": "a block did not arrive",
	"team.given_back.why.error": "an error",
	"team.given_back.unblocked": "Nothing blocks right now: your automations only step in once their condition starts anew – until then the batteries may charge each other.",
	"team.hold.discharge": "{name} is still discharging – I hold my block until that stops. Only then I switch your automations {names} on again.",
	"team.hold.charge": "{name} is still charging – I hold my block until that stops. Only then I switch your automations {names} on again.",
	"tip.team_hold.title": "Why do I still hold the block?",
	"tip.team_hold.text": "Your automations mostly react only when something starts – say “Venus discharges more than 120 W”. If that is already going on when they are back on, they block nothing. So I hold my block until the battery stops, and only then hand over.",
	"tip.team_hold.hint": "At most 12 hours. With “Release now”, a mode change or when I can no longer write, I hand over at once.",
	"tip.team_default.title": "Why do I do this by myself?",
	"tip.team_default.text": "You have two systems that regulate their batteries to 0 W at the grid meter themselves. When both work at once, power moves from one battery into the other – with losses. So I let only one work at a time and block the other ahead of time.",
	"tip.team_default.hint": "To switch it off: choose “At the same time”. Then I do not step in.",
	"tip.team_given_back.title": "Why do my automations run again?",
	"tip.team_given_back.text": "I only switch your battery automations off while I really do the job myself. If I cannot block – or a block does not arrive – I switch them on again at once, so your batteries never work against each other unprotected.",
	"tip.team_given_back.hint": "Once it works again, I wait 15 minutes and then take over by myself. With “At the same time” they stay yours.",
	"team.doing": "Batteries one after the other: {active} is up, {others} waits",
	"team.doing.parallel": "Batteries charge side by side today ({active}, {others}) – one after the other they would not get full",
	"team.automations": "Your automations {names} do this so far – I can switch them off, then I take over.",
	"team.automations.go": "To the automations",
	"guard.title": "Battery watchdog",
	"guard.watching": "I watch that the batteries do not charge each other. Nothing so far.",
	"guard.state.off": "Switched off – I do not step in when the batteries charge each other.",
	"guard.state.mode_off": "I am off right now – the watchdog rests.",
	"guard.state.single": "I need the power of at least two batteries to keep watch.",
	"guard.automation": "Your automation {names} does this so far – I stay out. Switch it off and I take over.",
	"guard.last.running.1": "{time}: The batteries ran against each other – I restarted {battery}'s own control.",
	"guard.last.running.2": "{time}: The batteries ran against each other – I blocked {direction} of {battery} for 5 s.",
	"guard.last.alarm": "{time}: The batteries keep running against each other, even after a restart and a short block – please have a look.",
	"guard.last.fixed.1": "{time}: The batteries ran against each other – fixed by restarting {battery}'s own control (after {duration}).",
	"guard.last.fixed.2": "{time}: The batteries ran against each other – fixed by a short block of {battery} (after {duration}).",
	"guard.last.fixed.3": "{time}: The batteries ran against each other for {duration} – not any more.",
	"guard.last.automation": "{time}: The batteries ran against each other – your automation took care of it.",
	"guard.last.joe": "{time}: The batteries ran against each other while I was steering myself – then I do not step in.",
	"guard.last.inside": "{time}: {charging} charged while {discharging} discharged – both are regulated by the same system. I do not step in there; please check its settings.",
	"guard.inside.title": "Batteries of one system charge each other",
	"guard.inside": "{charging} charges while {discharging} discharges – both are regulated by the same system. I do not step in there: please check its settings.",
	"guard.dry": "That is what I would do in live mode – right now I write nothing.",
	"guard.direction.charge": "charging",
	"guard.direction.discharge": "discharging",
	"guard.seconds": "{n} s",
	"guard.minutes": "{n} min",
	"guard.alarm.title": "Batteries charge each other",
	"guard.alarm": "{charging} charges while {discharging} discharges – even after I restarted its control and blocked the battery for a moment. Please check whether something else writes the same limits.",
	"tip.guard.title": "What is the battery watchdog?",
	"tip.guard.text": "When two batteries charge each other – one charges with more than 20 W, the other discharges with more than 20 W, for 20 seconds – I step in in three steps: restart the battery's own control, block its direction for 5 seconds, let you know. Here you see when it last happened and what helped.",
	"tip.guard.hint": "Switch it on and off under Settings › Rules › Batteries. Everything I switch for it I put back at once – after a restart, too.",
	"team.team_charge_order": "Charging: who goes first?",
	"team.team_discharge_order": "Discharging: who goes first?",
	"team.self_regulating": "Regulates itself to 0 at the meter",
	"team.proposed": "Suggestion",
	"team.group": "Who regulates it?",
	"team.group.own": "Its own system",
	"team.group.with": "Together with {name}",
	"team.group.check": "Please check",
	"team.groups.question": "Which batteries are regulated by the same system?",
	"team.groups.question.text": "For {names} I am not sure. Batteries regulated by the same system work as one group for me – I only coordinate between different systems. For now I assume each has its own.",
	"team.groups.confirm": "Proposal is right",
	"team.cutoff.known": "Stops discharging at {value} % – the next one takes over 1.5 % before.",
	"team.cutoff.unknown": "I am still learning where it really stops discharging – until then it works until it stops by itself (set: {value} %).",
	"team.part.active_discharge_only": "{name} discharges (charging blocked while both discharge)",
	"team.part.along": "{name} charges along (charging only)",
	"team.part.helps": "{name} helps discharging (discharging only)",
	"team.part.base": "{name} supplies the base load ({w} W)",
	"team.day.today": "Today",
	"team.day.yesterday": "Yesterday",
	"team.day.on": "On {date}",
	"team.reason.along.forecast": "{others} charges along because more sun is coming now than {active} can take alone. Discharging is blocked for both – so neither can charge the other.",
	"team.reason.along.export": "{others} charges along because sun just went to the grid although {others} still has room. Discharging is blocked for both – so neither can charge the other.",
	"team.reason.help": "{others} helps discharging because the house needs more right now than {active} can deliver. Charging is blocked for both.",
	"team.reason.base": "{others} supplies the base load ({w} W), {active} the rest.",
	"team.reason.plan": "From {time} {others} charges along – the forecast says more sun is coming then than {active} can take alone.",
	"team.reason.plan.lead": "From {time} {others} charges along – the forecast says more sun is coming after that than {active} can take alone. From experience I start {lead} minutes earlier.",
	"team.reason.dry": "(That's how it would be in live mode – right now I'm only watching.)",
	"team.review.room": "{when}: {kwh} kWh went to the grid although {name} was only at {soc} %.",
	"team.review.room_full": "{when}: {kwh} kWh went to the grid while a battery was still waiting – all of them got full anyway.",
	"team.review.fine": "{when} no sun went to the grid while a battery still had room.",
	"team.learned.none": "I haven't learned anything yet – I look back on the day every evening.",
	"team.learned.no_lead": "Learned from {days} days: charging along earlier isn't needed.",
	"team.learned.lead": "Learned from {days} days: charge along about {minutes} minutes earlier.",
	"team.suggest.title": "{when} {kwh} kWh went to the grid although {name} was only at {soc} %.",
	"team.suggest.text": "Shall I let {name} charge along earlier from now on? From the last days I know: about {minutes} minutes earlier is enough.",
	"team.suggest.yes": "Yes, charge along earlier",
	"team.suggest.no": "No",
	"team.style.title": "Set it yourself",
	"team.style.intro": "For advanced users. Normally you don't need to change anything here.",
	"team.style.auto": "Automatic (recommended)",
	"team.style.auto.text": "One after the other – but the next one charges along when more sun comes than one can take, and helps with big loads.",
	"team.style.strict": "One after the other only",
	"team.style.strict.text": "Always just one – on weak days too. The next one waits until the first is full.",
	"team.style.base": "Share the base load",
	"team.style.base.text": "The next one always supplies a small base, the first one the rest.",
	"team.style.base.warn": "Note: with small loads you lose more this way than one after the other, because inverters work poorly at low power.",
	"team.style.base.no_lever": "For the battery that comes next I can't set a power (its limit is in percent or only a switch). Then it stays one after the other.",
	"team.early": "Charge along earlier from experience",
	"team.early.unanswered": "Not decided yet",
	"tip.team_reason.title": "Why are two working right now?",
	"tip.team_reason.text": "Normally only one works at a time. If more sun comes than it can take, the next one may charge along – otherwise the sun would go to the grid although there is still room. If the house needs more than it can deliver, the next one may discharge too. I always block the other direction for both, so neither charges the other.",
	"tip.team_reason.hint": "When a cloud comes, I block the second one again at once.",
	"tip.team_review.title": "My look back on the day",
	"tip.team_review.text": "Every evening after sunset I look back: how much sun went to the grid while a battery still had room? How full did each one get? From that I learn over many days how early the next one should charge along.",
	"tip.team_review.hint": "Days without spare sun (e.g. in winter) don't change what I learned.",
	"tip.team_style_auto.title": "Automatic",
	"tip.team_style_auto.text": "One after the other in principle. If the forecast shows more sun than the first can take, or sun is going to the grid right now, the next one charges along. If the house needs more than the first can deliver for longer than a minute, the next one discharges too. Afterwards it waits again.",
	"tip.team_style_auto.hint": "Recommended – the least sun goes to the grid and neither charges the other.",
	"tip.team_style_strict.title": "One after the other only",
	"tip.team_style_strict.text": "Only one battery works at a time. No earlier charging along, no help with big loads, and no charging side by side on weak days either.",
	"tip.team_style_strict.hint": "Sun may go to the grid although the second one would still have room, and on weak days the second may not get full.",
	"tip.team_style_base.title": "Share the base load",
	"tip.team_style_base.text": "When the house needs power, the next battery supplies a fixed base: the lower consumption of the last half hour (what is almost always running – not the average). The first one delivers the rest. I keep adjusting the base.",
	"tip.team_style_base.hint": "Only works if I can set the next battery's discharge power in watts (e.g. Marstek via Omnibattery).",
	"tip.team_base_warn.title": "Why is this less efficient?",
	"tip.team_base_warn.text": "An inverter works poorly at low power – it loses a larger share then. If two batteries each deliver a little instead of one delivering a bit more, more kilowatt-hours are lost in total.",
	"tip.team_base_warn.hint": "Makes more sense if one battery should be spared.",
	"tip.team_base_lever.title": "Why doesn't it work here?",
	"tip.team_base_lever.text": "For a base I must be able to set the battery's discharge power in watts. If it only has a limit in percent or only a switch, I can't.",
	"tip.team_base_lever.hint": "Change the discharge order so that a suitable battery comes next.",
	"tip.team_early.title": "Charge along earlier?",
	"tip.team_early.text": "Every evening I learn whether sun went to the grid while a battery still had room. From that I know how much earlier the next one should charge along. Yes: I let it charge along that much earlier. No: I leave it as it is and don't ask again.",
	"tip.team_early.hint": "Charging along means charging only – discharging is blocked for both meanwhile.",
	"tip.config_backup.title": "Bring back earlier settings?",
	"tip.config_backup.text": "Bring back: I check the kept settings and take them over if they fit – your devices, rules and what I learned are back then. Discard: I delete the copy and you set me up anew.",
	"tip.config_backup.hint": "Once you set something yourself, I no longer ask.",
	"log.team_along": "{others} charges along (charging only)",
	"log.team_along.forecast": "{others} charges along: the forecast says more sun is coming than {active} can take alone",
	"log.team_along.export": "{others} charges along: sun went to the grid although there was room",
	"log.team_along_end": "Charging along ended – one after the other again",
	"log.team_along_end.flow": "Charging along ended: the house needs power again – one after the other again",
	"log.team_along_end.less": "Charging along ended: less sun – one after the other again",
	"log.team_help": "{others} helps discharging: the house needs {power} kW, more than {active} can deliver",
	"log.team_help_end": "Big load over: {others} waits again",
	"log.team_base": "{others} now supplies the base load ({watts} W)",
	"log.team_base_end": "Base load: {others} waits again",
	"log.team_review": "Look back: {energy} kWh to the grid while a battery still had room – learned: charge along {lead} minutes earlier",
	"log.team_review.short": "Look back: {energy} kWh to the grid although {others} was only at {soc} % – learned: charge along {lead} minutes earlier",
	"battery.surplus.team_wait": "Waits until the other battery is full (several batteries: one after the other) – its room counts when capping.",
	"battery.surplus.rule_off": "The rule “Leave daytime surplus” is off.",
	"battery.surplus.rule_go": "Switch the rule on",
	"battery.surplus.capped": "Charging at {kw} kW only right now – it is full by {time} at the latest.",
	"battery.surplus.would": "Would charge at {kw} kW only right now (until {time}) – I only switch this in live mode.",
	"battery.surplus.not_tested": "Only after a passed test run.",
	"battery.surplus.takes_part": "Takes part when there is enough sun for it and more during the day.",
	"battery.surplus.left_out": "Always charges at full power, even with the rule on.",
	"tip.f_battery_day_surplus.title": "What does “Takes part during the day” mean?",
	"tip.f_battery_day_surplus.text": "With the rule “Leave daytime surplus” on, I limit this battery's charging power on sunny days through its charge limit (for Omnibattery through the system power limits). It charges more slowly, but is still full before the evening sun no longer suffices. Switch it off here and it always charges at full power.",
	"tip.f_battery_day_surplus.hint": "At the end of the day, when the mode changes and with “Release now” I put the charge limit back as it was.",
	"battery.surplus.need_ref": "Its charge limit is a percentage. As soon as I know what 100 % stand for, it takes part – enter it below or let me find out myself.",
	"battery.surplus.learning": "I am finding out what 100 % stand for: for a few minutes its charge limit is at a test value, then I put it back.",
	"battery.surplus.automation": "Not taking part right now: an automation writes the same charge limit ({names}). We would overwrite each other. Switch it off below under the troublemakers, then it takes part.",
	"battery.surplus.intruders_go": "To the troublemakers",
	"battery.limit_ref.label": "What do 100 % stand for?",
	"battery.limit_ref.placeholder": "e.g. 5000",
	"battery.limit_ref.learn": "Joe learns it",
	"battery.limit_ref.learning": "Left empty, I find out myself: on a sunny day, while the battery charges hard, I set the charge limit to 50 % for three minutes and measure how much it still charges. Then I put everything back.",
	"battery.limit_ref.learned": "Measured: 100 % stand for {value} W.",
	"battery.limit_ref.set": "100 % stand for {value} W – as you entered it.",
	"tip.f_battery_limit_ref.title": "What do 100 % stand for?",
	"tip.f_battery_limit_ref.text": "With Fronius the charge limit is a share of the highest battery charging power the inverter knows internally. Home Assistant does not show this value, and it need not be the battery's power. To limit the charging power in watts I need it – enter it in watts if you know it (for example from the inverter's web interface).",
	"tip.f_battery_limit_ref.hint": "If you don't know it, leave the field empty: I measure it myself on a sunny day and put the charge limit back as it was afterwards.",
	"tip.team.title": "Why coordinate several batteries?",
	"tip.team.text": "A Fronius inverter regulates its battery to 0 W at the grid meter, and Omnibattery does the same with a Marstek. Two such controllers know nothing of each other: often one charges while the other discharges – power moves from battery to battery, with losses both ways.",
	"tip.team.hint": "Only by day and only in live mode. At night my night plan steers. On a mode change, “Release now” and when Home Assistant shuts down, I put every block back.",
	"tip.team_mode.title": "One after the other or at the same time?",
	"tip.team_mode.text": "One after the other: only one battery may work at a time, I block the others ahead of time – not only once it happens. When the first one is full or empty, the next one takes over. At the same time: I do not step in, each battery regulates itself. If you choose nothing, one after the other applies.",
	"tip.team_mode.hint": "On the Fronius I block with the charge and discharge limit and their switches. On the Marstek I switch off “allow charging” and “allow discharging” of each battery – Omnibattery stays in automatic mode and goes on at once when I free them. Without these switches I use the system power limits, but only when all of Omnibattery's batteries wait.",
	"tip.team_charge_order.title": "Who charges first?",
	"tip.team_charge_order.text": "The battery at the top takes the sun first until it is full; then the next one is up. If the forecast says the sun will not fill them one after the other before it sets, I let the others charge too – never forced, their own controller only takes what is left.",
	"tip.team_charge_order.hint": "A battery higher up is up again once the sun has shone for a while – not with every cloud.",
	"tip.team_discharge_order.title": "Who discharges first?",
	"tip.team_discharge_order.text": "The battery at the top supplies the house first, until it reaches the level where it really stops discharging. Then the next one takes over. The first one is up again once it has charged 5 % above that.",
	"tip.team_discharge_order.hint": "For example the big battery first and the small one as a reserve for the evening.",
	"tip.team_self_regulating.title": "What does “regulates itself” mean?",
	"tip.team_self_regulating.text": "The battery watches the grid meter itself and charges or discharges so it shows 0 W. Fronius, Kostal and Omnibattery in automatic mode do that. I coordinate only such batteries.",
	"tip.team_self_regulating.hint": "I make the suggestion from the device. If it is wrong, switch it here.",
	"tip.team_cutoff.title": "Where does it really stop?",
	"tip.team_cutoff.text": "Many batteries stop earlier than set – a BYD, for example, at about 10.5 % although 5 % is set. I watch: when it stops discharging although the house needs power, I note its level.",
	"tip.team_cutoff.hint": "With a learned value the next battery takes over 1.5 % before, so the house takes nothing from the grid.",
	"tip.team_group.title": "Who regulates the battery?",
	"tip.team_group.text": "Some systems regulate several batteries together – Omnibattery, for instance, a Marstek Venus and a Victron. They share the power themselves, so I treat them as one group. A Fronius or Kostal inverter regulates only its own battery.",
	"tip.team_group.hint": "One after the other means: only one group works at a time, I block the others. I make the proposal from the integration in Home Assistant.",
	"tip.team_groups_confirm.title": "What does “Proposal is right” do?",
	"tip.team_groups_confirm.text": "I keep the assignment as it is shown under Several batteries and stop asking.",
	"tip.team_groups_confirm.hint": "You can change it any time under Devices › Batteries › Several batteries at “Who regulates it?”.",
	"surplus.device_conflict.title": "Your battery works against “Leave daytime surplus”.",
	"surplus.device_conflict.hint": "Switch it off in Omnibattery – I don't change it.",
	"surplus.conflict.charge_delay": "Charge delay is on for {battery}: Omnibattery then holds charging back itself and does not count on my limit.",
	"surplus.conflict.predictive_charging": "Predictive charging is on for {battery}: Omnibattery then plans charging itself and works against my limit.",
	"overview.todo.surplus_automation": "Not taking part during the day: an automation writes the same charge limit ({names}). Switch it off under the troublemakers.",
	"overview.todo.limit_ref": "{name}: what do 100 % stand for?",
	"overview.todo.config_backup": "Your earlier settings are kept",
	"overview.todo.config_backup.text": "At the start I could not read your stored settings – for example after going back to an older version. I started with the basic settings and kept your old ones. Shall I bring them back?",
	"overview.todo.config_backup.failed": "Bringing them back did not work: {error}",
	"overview.todo.config_backup.restore": "Bring back",
	"overview.todo.config_backup.discard": "Discard",
	"overview.todo.limit_ref.text": "Its charge limit is a percentage. Enter what 100 % stand for – or let me measure it myself on a sunny day.",
	"role.system_charge_limit": "System charge limit",
	"role.system_charge_limit_enabled": "System power limits on",
	"role.system_discharge_limit": "System discharge limit",
	"role.system_manual_mode": "System manual mode",
	"role.allow_charge": "Charging allowed",
	"role.allow_discharge": "Discharging allowed",
	"solar.sleeps": "Is off without sun – that is normal",
	"solar.sleeps.named": "{name} is off without sun – that is normal",
	"solar.sleeps.quick": "Off at night – normal",
	"solar.sleeps.quick_named": "{name} off at night – normal",
	"tip.solar_sleeps.title": "Inverter off without sun?",
	"tip.solar_sleeps.text": "Some inverters switch off when the sun is gone. Their value is then “unavailable” in Home Assistant. If yours does that, switch this on: while the sun is low I count 0 W and do not warn.",
	"tip.solar_sleeps.hint": "If the sun is high and the value is still missing, I keep warning – then something really is wrong.",
	"log.limit_ref_test": "{battery}: charge limit at {value} % for a few minutes – I measure what 100 % stand for",
	"log.limit_ref": "Learned: for {battery}, 100 % stands for {power} kW",
	"log.limit_ref_failed": "{battery}: couldn't learn what 100 % stands for – I'll try again another day",
	"log.limit_ref_failed.no_effect": "{battery}: the test limit held nothing back – I will try again another day with a smaller value",
	"log.limit_ref_failed.sun": "{battery}: clouds came during the test – I will try again another day",
	"log.limit_ref_failed.implausible": "{battery}: the measurement did not add up – I will try again another day",
	"log.limit_ref_failed.night": "{battery}: test stopped, the night begins – charge limit put back",
	"log.start": "Night begins",
	"log.set": "{battery}: {entity} → {value}",
	"log.reached": "{battery} reached {target} %",
	"log.night_cap": "{battery}: charge limit as a ceiling for charging from the grid – at most {power} kW",
	"log.night_cap_ignored": "{battery}: the charge limit doesn't hold while charging from the grid ({power} instead of {cap} kW) – from now on I plan it at full power",
	"log.night_cap_works": "{battery}: the charge limit holds while charging from the grid, too ({cap} kW)",
	"log.external": "Someone else changed {entity} – I leave it",
	"log.released": "Everything put back",
	"log.released.day_buffer": "Charge limit set back – the battery charges from the sun up to the buffer again",
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
	"log.surplus_cap": "Daytime surplus: batteries charge at {power} kW only (until {until}, for “{loadpoint}”)",
	"log.surplus_raise": "Daytime surplus: batteries now charge at {power} kW – the sun is lagging",
	"log.surplus_end": "Daytime surplus ended – batteries charge normally again",
	"log.surplus_end.full": "Daytime surplus ended: batteries are full",
	"log.surplus_end.not_reachable": "Daytime surplus ended: the sun no longer suffices – batteries charge normally again",
	"log.surplus_end.after_pv": "Daytime surplus ended: today's sun no longer covers the house",
	"log.surplus_end.no_loadpoint": "Daytime surplus ended: no evcc loadpoint in PV mode any more",
	"log.surplus_end.night": "Daytime surplus ended: the night begins",
	"log.surplus_end.off": "Daytime surplus ended: switched off",
	"log.surplus_end.morning": "Daytime surplus paused: the grid-friendly morning comes first",
	"log.surplus_end.stopped": "Daytime surplus ended: I was stopped – charge limits put back",
	"log.surplus_end.ha_stop": "Daytime surplus ended: Home Assistant is shutting down – charge limits put back",
	"log.surplus_end.emergency": "Daytime surplus ended: released right away",
	"log.surplus_end.error": "Daytime surplus ended: I could not work it out safely – batteries charge normally again",
	"log.surplus_end.no_need": "Daytime surplus ended: capping is not worth it right now",
	"log.surplus_end.no_plan": "Daytime surplus ended: no forecast – batteries charge normally again",
	"log.surplus_end.no_battery": "Daytime surplus ended: no battery can take part any more",
	"log.day": "Grid-friendly morning: batteries charge only from {until}, the morning sun goes to the grid",
	"log.day.buffer": "Grid-friendly morning: batteries first charge up to {level} % as a buffer, then the morning sun goes to the grid until {until}",
	"log.day_buffer.fill": "{battery}: below the buffer ({soc} %) – charges from the sun up to {level} %",
	"log.day_buffer.hold": "{battery}: buffer of {level} % reached – now the grid gets the morning sun",
	"log.day_released": "Grid-friendly morning ended early: the sun lags behind ({remaining} kWh left, {headroom} kWh of room) – batteries charge now",
	"log.team_handover": "Battery change: {battery} is up now (before: {previous})",
	"log.team_handover.empty": "Battery change: {previous} is empty ({level} %) – {battery} takes over",
	"log.team_handover.full": "Battery change: {previous} is full – {battery} keeps charging",
	"log.team_handover.order": "Battery change: {battery} is up again (order), {previous} waits",
	"log.team_block.both": "{battery}: charging and discharging blocked",
	"log.team_block.charge": "{battery}: charging blocked",
	"log.team_block.discharge": "{battery}: discharging blocked, charging free",
	"log.team_block.free": "{battery}: free again – blocks put back",
	"log.team_taken": "{battery}: another charge limit would have let it charge while it waits – I block it all the same",
	"log.team_end": "Several batteries: all blocks put back",
	"log.team_end.night": "Several batteries: blocks put back – the night begins, the night plan steers",
	"log.team_end.dry": "Several batteries: blocks put back – no longer in live mode",
	"log.team_end.together": "Several batteries: blocks put back – at the same time chosen",
	"log.team_end.automation": "Several batteries: blocks put back – your automations do it",
	"log.team_end.levers": "Several batteries: blocks put back – a limit is not reachable",
	"log.team_end.error": "Several batteries: blocks put back – I could not decide safely",
	"log.team_end.not_taken": "Several batteries: all blocks put back – a block did not arrive",
	"log.team_broken": "{battery}: the block did not arrive – I stop coordinating the batteries for now",
	"log.team_given_back": "Several batteries: your automations {names} switched on again – {why}",
	"log.team_take_over": "Several batteries: your automations {names} switched off again – I coordinate the batteries myself again",
	"log.team_hold": "Several batteries: {battery} is still {direction} – I hold the block until that stops, then your automations run again",
	"log.team_hold.discharge": "discharging",
	"log.team_hold.charge": "charging",
	"log.team_hold_end": "Several batteries: block no longer held",
	"log.team_hold_end.flow_ended": "Several batteries: the battery stopped – block back, your automations run again",
	"log.team_hold_end.too_long": "Several batteries: block held for 12 hours – your automations run again now",
	"log.team_hold_end.unknown": "Several batteries: power unknown – block back, your automations run again",
	"log.team_hold_end.coordinates": "Several batteries: I coordinate the batteries myself again – the block I held is part of that again",
	"log.team_gap": "Several batteries: {why} – maybe just a short dropout, I keep the blocks for up to 90 seconds",
	"log.team_gap_end": "Several batteries: the value is back – the blocks stay as they were",
	"log.automations_back": "I stopped: your automations {names} run again",
	"log.automations_taken": "I steer myself again: your automations {names} switched off again",
	"log.team_reset": "{battery}: the block had been undone (e.g. its Modbus control restarted) – I set it again",
	"log.team_parallel": "Several batteries: they charge side by side today – one after the other they would not be full by {until}",
	"log.team_cutoff": "{battery} stops discharging at {level} % – learned: {cutoff} %",
	"log.team_transfer": "{charging} charges while {discharging} discharges – they charge each other",
	"log.team_transfer.blocked": "{charging} charges while {discharging} discharges – despite the block",
	"log.guard_restart": "Batteries run against each other – restarted {battery}'s own control",
	"log.guard_restart.dry": "Batteries run against each other – I would restart {battery}'s own control",
	"log.guard_restart.clean": "Batteries run against each other – ended manual mode of {battery} cleanly and gave it back to its own control",
	"log.guard_restart.clean.dry": "Batteries run against each other – I would end manual mode of {battery} and give it back to its own control",
	"log.guard_block.charge": "Still running against each other – blocked charging of {battery} for 5 s",
	"log.guard_block.discharge": "Still running against each other – blocked discharging of {battery} for 5 s",
	"log.guard_block.charge.dry": "Still running against each other – I would block charging of {battery} for 5 s",
	"log.guard_block.discharge.dry": "Still running against each other – I would block discharging of {battery} for 5 s",
	"log.guard_alarm": "Keeps running against each other – I let you know",
	"log.guard_alarm.dry": "Keeps running against each other – I would let you know",
	"log.guard_fixed.1": "Fixed by restarting its own control (after {duration})",
	"log.guard_fixed.2": "Fixed by a short block of {battery} (after {duration})",
	"log.guard_fixed.3": "No longer running against each other (after {duration})",
	"log.guard_automation": "Batteries run against each other – an automation already takes care of it: {names}",
	"log.guard_joe": "Batteries run against each other while I steer myself – I do not step in",
	"log.guard_inside": "{charging} charges while {discharging} discharges – one system regulates both, I do not step in and let you know",
	"log.guard_inside.dry": "{charging} charges while {discharging} discharges – one system regulates both, I would let you know",
	"log.guard_restored": "Battery watchdog: {entities} put back",
	"log.guard_restored.start": "Battery watchdog: {entities} put back after the restart",
	"log.guard_restored.failed": "Battery watchdog: could not put back {entities} yet – I keep trying",
	"log.guard.problem": "– did not work ({code})",
	"f.battery.control.watch": "Watch only",
	"f.battery.control.profile": "Automatic ({name})",
	"f.battery.control.generic": "Assign levers",
	"f.battery.control.steps": "Own steps",
	"f.battery.control.suggested": "I found levers that may fit.",
	"f.battery.control.take": "Take suggestion",
	"f.battery.control.ready": "Charge via: {charge} · Hold via: {hold}",
	"f.battery.control.needs": "To steer, I need a way to charge (a mode with forced charging, or “Charge from grid” with “Charge up to”) and a way to hold (minimum level, a mode or a discharge limit).",
	"f.battery.control.retest": "After every change a new test run is needed. You find it on the battery's page under “Now”.",
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
	"meaning.no_charge": "No charging (by day only)",
	"meaning.no_discharge": "No discharging (by day only)",
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
	"role.block_charge": "Block charging (switch)",
	"role.block_discharge": "Block discharging (switch)",
	"battery.surplus.flash": "Not possible for this battery: its charge limit is a setting it stores permanently on its memory chip. Following the sun with it all day would wear the chip out. It charges normally.",
	"log.guard_flash": "Still running against each other – I won't block {battery} again so soon: every block writes to its memory chip. I'll let you know.",
	"tip.battery_notes.title": "Why is Joe telling me this?",
	"tip.battery_notes.text": "I recognise many batteries, but I can't steer every one of them. Here I tell you **why** not – and **what you can do**. Usually it's a setting in the integration or the device, or an entity that is switched off in Home Assistant.\nThen you do the test run: only once it passes do I steer the battery.",
	"tip.battery_notes.hint": "A battery I don't steer I leave alone. It keeps running as before, and I still take it into account.",
	"bnote.other": "I have a note about this that I can't put into words here yet.",
	"bnote.entities.none": "look for the switched-off ones under “Entities” on the device.",
	"bnote.enable": "These entities are switched off in Home Assistant – I would need them: {entities}. Switch them on under “Entities” on the device.",
	"bnote.no_level": "I can see {name}, but I can't find a charge level. Without it I can neither plan nor steer the battery. What you can do: switch the level on in Home Assistant – {entities}",
	"bnote.needs.kostal_modbus_external": "For your Kostal to accept my commands, its battery management must be set to “External via protocol (Modbus TCP)” in the inverter. That's in the installer menu. Otherwise it ignores everything without reporting an error – the test run will show you. If in doubt, ask your installer.",
	"bnote.needs.sigen_write": "The Sigenergy integration starts out as “read only” (read_only). It then accepts my commands but doesn't write them to the battery – without an error. Switch “read only” off in the integration's options. The test run shows you whether it works.",
	"bnote.needs.deye_tou": "I steer your Deye through its six time programs. That only works with “Time of Use” switched on in the inverter. Whatever I change, I put back in the morning.",
	"bnote.no_charge.goodwe_core": "I can hold it, but not charge it from the grid: the GoodWe integration from Home Assistant offers no eco charging. What you can do: the “GoodWe Inverter (experimental)” integration from HACS can do both.",
	"bnote.no_charge.kostal_core": "I can hold it, but not charge it from the grid: the Kostal integration from Home Assistant has no lever for that. What you can do: “Kostal Plenticore Battery Control” from HACS (over Modbus) can do both.",
	"bnote.cannot.levers": "I can see {name}, but I can't find the levers I could steer it with. Until then I only watch it. What you can do: pick levers yourself under “Assign levers” and do the test run.",
	"bnote.cannot.kostal_core": "I can see your Kostal battery, but I can't steer it yet: with the Kostal integration from Home Assistant that only works through “Battery min SoC”, and it is switched off in Home Assistant. What you can do: switch this entity on under “Entities” on the device.",
	"bnote.cannot.kostal_modbus": "I can see your Kostal battery through “Kostal Plenticore Battery Control”, but I can't find its levers. What you can do: check that the integration is running and its switches and numbers are switched on.",
	"bnote.cannot.solaredge": "I can see your SolarEdge battery, but I can't steer it yet: storage control is switched off in the integration. What you can do: in “SolarEdge Modbus Multi”, under “Configure”, switch on advanced storage control (adv_storage_control) in the Power Control Options.",
	"bnote.cannot.sigen": "I can see your Sigenergy battery, but I can't steer it yet: its control entities are missing or switched off. What you can do: switch “read only” (read_only) off in the integration's options and switch the control entities on at the device.",
	"bnote.cannot.sonnen_write": "I can see your sonnen battery, but I can't steer it yet: without write access the integration shows no levers. What you can do: switch on write access for the local interface in your sonnenBatterie's web interface and reload the integration.",
	"bnote.cannot.victron_gx": "I can see your Victron battery, but I can't find its ESS settings. What you can do: check that ESS is set up on the GX device and the integration shows its minimum level.",
	"bnote.cannot.victron_mqtt": "I can see your Victron battery, but I can't steer it yet: the “Victron MQTT” integration is probably set to read only (READ_ONLY). What you can do: choose full operation in its options – or switch to the Victron integration from Home Assistant.",
	"bnote.cannot.victron_modbus": "I can see your Victron battery, but I can't steer it yet: the Victron integration (Modbus) only shows levers with write access. What you can do: switch write access on in its advanced options.",
	"bnote.cannot.huawei_permissions": "I can see your Huawei battery, but I can't steer it yet: the integration only shows its levers with elevated permissions. What you can do: switch on “Advanced: elevate permissions” in “Huawei Solar” – it needs the installer password.",
	"bnote.cannot.senec": "I can see your SENEC battery, but I can't steer it yet: I can only hold it through its reserve, and that only exists with a login at mein-senec.de (and “Backup Power pro”). What you can do: also set up the SENEC integration with your mein-senec account and switch the reserve on. A SENEC.Home V4 can't be steered locally at all.",
	"bnote.cannot.marstek_modbus": "I can see your Marstek over Modbus, but I can't find its levers – most of them start out switched off. What you can do: switch on remote control over RS485, the force mode and the charge and discharge power at the device. Important: only one program may talk to it over Modbus at a time.",
	"bnote.cannot.solarman": "I can see your Deye inverter, but I can't find its time programs. What you can do: use davidrapan's Solarman integration with the right device type – the older Solarman integration only shows readings.",
	"bnote.cannot.sma": "I can see your SMA battery, but I can't steer it: the SMA integrations in Home Assistant only read values. It keeps running as before – I plan with it and count its power in.",
	"bnote.cannot.rct": "I can see your RCT battery, but I can't steer it: the RCT integration only reads values; writing would need an extra community script I don't use. It keeps running as before, I count it in.",
	"bnote.cannot.ecoflow": "I can see your EcoFlow battery, but I can't steer it: through the integration it can neither be charged from the grid nor reliably held. It keeps running as before, I count it in.",
	"bnote.cannot.powerwall_local": "I can see your Powerwall through the local integration – that one can only switch “off grid”. What you can do: also set up Teslemetry, Tessie or Tesla Fleet, then I can set its reserve.",
	"bnote.cannot.varta_read": "I can see your VARTA battery, but I can't steer it with this integration: it only reads values. What you can do: the “VARTA Modbus” integration from HACS can limit charging and discharging power.",
	"bnote.cannot.byd": "I can see your BYD Battery-Box. It can't be steered itself – that always goes through its inverter (for example Fronius). Set up the inverter, then I steer it through that.",
	"bnote.cannot.growatt_local": "I can see your Growatt battery, but I can't steer it with this integration: it only knows “charge from grid” on or off. What you can do: the “Growatt Modbus” integration (0xAHA) from HACS can do more.",
	"bnote.cannot.hoymiles": "I can see your Hoymiles battery, but I can't steer it: this integration only steers hybrid inverters through a service of its own that I don't use yet. It keeps running as before.",
	"bnote.cannot.kostal_modbus_other": "I can see your Kostal through this Modbus integration, but I can't steer it safely with it: its values lapse after a short time. What you can do: use “Kostal Plenticore Battery Control” from HACS.",
	"bnote.cannot.mqtt_hoymiles": "I can see your Hoymiles battery over MQTT, but I can't steer it yet: over MQTT it must be addressed again every 30 seconds, and its entities are not unique. What you can do: let Omnibattery steer it – I steer Omnibattery.",
	"bnote.cannot.mqtt_noah": "I can see your Growatt NOAH over MQTT, but I can't steer it yet: it doesn't charge from the grid, and its MQTT entities are not unique. It keeps running as before, I count it in.",
	"bnote.cannot.mqtt_sunsynk": "I can see your Sunsynk or Deye battery over MQTT, but I can't steer it yet: the add-on's entities are not unique. What you can do: assign them yourself under “Assign levers” and do the test run.",
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
	"action.label": "Control device",
	"action.title": "Control |device",
	"action.template.ev": "Charge the car",
	"action.template.hot_water": "Pre-heat hot water",
	"action.template.custom": "Own device",
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
	"action.delete": "Delete",
	"devices.boost.unit": "Unit",
	"devices.charge.now": "Charge now",
	"devices.charge.tonight": "Charge tonight",
	"devices.charge.percent": "{target} %",
	"devices.charge.km": "{target} km range plus {reserve} km reserve",
	"devices.charge.plus_reserve": "plus {reserve} km reserve",
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
	"automations.lent": "Switched on again by me on {day} at {time} – I am not coordinating the batteries myself right now. Once I can again, I take over.",
	"automations.lent.stopped": "Switched on again by me on {day} at {time} because I stopped (disabled, reloaded or updated). Once I steer myself again, I take over.",
	"automations.all_off": "Switch all off ({count})",
	"automations.back_on": "Switch on again ({count})",
	"automations.failed": "Not all of them could be switched – check Home Assistant's automations.",
	"cards.loading": "Looking it up …",
	"cards.no_access": "Energy Joe cannot be reached – the card needs a user with administrator rights.",
	"cards.night.title": "Joe tonight",
	"cards.night.skip": "Skip tonight",
	"cards.car.none": "No car I can charge yet – set it up in the Energy Joe panel under “Devices › Car & charging”.",
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
	"devices.boost.reserve": "You set the reserve on the car's page under Steering.",
	"devices.action.boost": "Charging now because you asked.",
	"devices.action.tonight": "Tonight",
	"devices.car.no_calendar": "No calendar connected",
	"devices.car.lonely": "I know this car from your Energy dashboard – I can't charge it yet. Set it up once: pick the wallbox, “Charge by need” is already on.",
	"devices.car.set_up": "Set up charging",
	"tip.devices_lonely_car.title": "Why does it say “set up” here?",
	"tip.devices_lonely_car.text": "From the Energy dashboard I know how much the car draws. To charge it cheaply at night or by need I still need to know how to switch the charger. Set that up once – then you see the car's level, trips and appointments here.",
	"devices.car.of_persons": "calendars of {names}",
	"devices.car.calendar_ok": "connected",
	"devices.car.calendar_problem": "a problem right now – please have a look",
	"devices.car.checked": "last read {when}",
	"devices.car.connect": "Connect a calendar",
	"devices.car.change": "Change",
	"tip.car_calendar_card.title": "What is the car's calendar for?",
	"tip.car_calendar_card.text": "From the appointments I know how far the car drives tomorrow and charge just that much at night. Here you see which calendar is connected and when I last read it. The button jumps to the appointments further down.",
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
	"plan.actions.run": "runs from {start} to {end}",
	"plan.actions.target": "heats from {start} to {target} °C, until {end} at the latest",
	"plan.actions.energy": "≈ {kwh} kWh, {cost} at the cheap night rate",
	"plan.tonight": "What runs tonight",
	"plan.tonight.charge": "charges from {from} to {target} %, starting at {time}",
	"plan.tonight.charge_any": "charges from {from} to {target} %",
	"plan.tonight.charge.energy": "≈ {kwh} kWh from the grid, at up to {kw} kW",
	"plan.tonight.charge.spans": "{kwh} kWh, {spans}",
	"plan.tonight.span": "{start}–{end} at {power}",
	"plan.pace.spread": "Spread slowly over the night: power costs the same all the time, so I go easy on the battery and the grid connection and still finish in time.",
	"plan.pace.short": "Only a little to charge: rather briefly with a bit more power – very slow charging is inefficient.",
	"plan.pace.cheapest": "In the cheapest quarter hours of the night – first where power costs least.",
	"plan.pace.full": "At full power – any slower and it would not get as full as needed in the cheap hours.",
	"plan.pace.grid_limit": "Held back by the grid connection: charging and the home together stay below {limit} kW.",
	"plan.pace.fixed_power": "I can't set its charging power – it charges as fast as it can, as late as possible.",
	"plan.pace.need_ref": "Once I know what 100 % of its charge limit stand for, I'll charge it more slowly too.",
	"plan.pace.cap_ignored": "Its charge limit doesn't hold while charging from the grid – so I plan it at full power.",
	"plan.pace.first": "It gets first: it is the first to discharge in the morning, so the batteries switch less often by day.",
	"tip.plan_pace.title": "Why so slowly?",
	"tip.plan_pace.text": "I charge each battery as slowly as possible and as fast as needed: I spread the energy over the cheap quarter hours so it reaches its target half an hour before the end. Little power is easy on the battery and the grid connection. When prices differ, I charge in the cheapest quarter hours first – at full power if need be. It never costs more.",
	"tip.plan_pace.hint": "Several batteries: the one that discharges first in the morning gets first at night – each has its own target.",
	"plan.tonight.hold": "doesn't charge, but holds {target} % during the cheap hours",
	"plan.tonight.idle": "nothing to do tonight, now at {soc} %",
	"log.boost": "{battery}: Charge now up to {target} {unit}",
	"log.boost_end.reached": "{battery}: Charge now – target reached",
	"log.boost_end.stopped": "{battery}: Charge now ended",
	"log.boost_end.expired": "{battery}: Charge now ended after 24 hours",
	"log.action_on": "{battery}: switched on ({value})",
	"log.action_off": "{battery}: put back ({value})",
	"log.action_done": "{battery}: target reached",
	"log.call": "{battery}: {entity}",
	"log.tonight": "“Tonight” switched",
	"log.grid_guard": "Main fuse: {power} kW from the grid – charging paused briefly",
	"log.no_progress": "{battery} does not charge (at {soc} %)",
	"tip.a_name.title": "What should the device be called?",
	"tip.a_name.text": "That's how it shows under Devices, in the plan and as the “Tonight” switch in Home Assistant.",
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
	"tip.a_auto.title": "When do I switch it on by myself?",
	"tip.a_auto.text": "When tomorrow brings less sun than set here – with the factor I learned for your forecast. Empty means every night. Switched off, I only switch it on when you turn on “Tonight”.",
	"tip.a_conditions.title": "Why conditions?",
	"tip.a_conditions.text": "I only switch it on when all are met – for example “car connected is on” or “car level less than 70”.",
	"tip.a_power.title": "Why the power?",
	"tip.a_power.text": "So I know how much of the grid connection it needs. The batteries get the rest – everything stays below your grid limit.",
	"tip.a_consumer.title": "Why this link?",
	"tip.a_consumer.text": "If I know the consumer from the Energy dashboard, I know how much it usually needs during the day. When it runs at night, I take that out of the day – the batteries need less then.",
	"tip.a_priority.title": "What does the order mean?",
	"tip.a_priority.text": "If the grid connection is not enough for everything, the smaller number goes first. The batteries take what's left.",
	"tip.a_enabled.title": "What does active mean?",
	"tip.a_enabled.text": "Switched off, I neither plan nor switch the device – not even by hand.",
	"tip.a_sensor.title": "Which sensor?",
	"tip.a_sensor.text": "The sensor whose temperature I watch, for example the hot water temperature. Once the target is reached, I switch off.",
	"tip.a_temps.title": "How do I work out the target?",
	"tip.a_temps.text": "In the morning the water should be at least this warm. On top I add what you use during the day (I am still learning that) and the buffer. I never heat above “At most”. I start late enough that the target is there by the end of the cheap window.",
	"tip.a_save.title": "What happens when saving?",
	"tip.a_save.text": "Only when you save do I take over your changes and plan with them from now on. I only switch in the suggest and live modes – in the simulation I show what I would have done.",
	"tip.a_delete.title": "What happens when deleting?",
	"tip.a_delete.text": "I forget how I control the device, and its “Tonight” switch in Home Assistant disappears. If it is running, I put things back first. The device itself and its meter stay.",
	"tip.boost.title": "Now or tonight?",
	"tip.boost.text": "**Charge now**: I switch the wallbox on right away – without waiting for the cheap hours or the sun, and also in the simulation, because you ask for it.\n**Charge tonight**: I charge in the coming night in the cheap hours, whatever the forecast says.\nAs soon as the level is reached (or the range plus your reserve) I put the wallbox back the way it was. With % and km you choose whether the target is a level or a range.",
	"tip.boost.hint": "“Charge now” stops by itself after 24 hours at the latest, “tonight” with the end of the night. “Cancel” stops right away.",
	"tip.action_tonight.title": "What does “Tonight” do?",
	"tip.action_tonight.text": "I switch the device on in the coming night, whatever the forecast says – handy when you know you'll need it tomorrow morning. After the night the switch turns itself off again.",
	"tip.plan_actions.title": "What am I looking at?",
	"tip.plan_actions.text": "What I plan for each battery and each device tonight, when – and why some don't run. **Set up →** takes you to the device's page.",
	"error.title": "Joe isn't |answering",
	"error.text": "I can't reach the integration. Reload the page – if that doesn't help, check Settings → System → Logs.",
	"error.action": "Saving failed",
	loading: "Joe is saddling up …",
	"menu.sidebar": "Home Assistant menu"
}, Ie = /* @__PURE__ */ new Map();
function Le(e, t) {
	return e.replace(/\{(\w+)\}/g, (e, n) => String(t?.[n] ?? ""));
}
function Re(e) {
	let t = e || "en", n = Ie.get(t);
	if (n) return n;
	let r = t.startsWith("de") ? Pe : Fe, i = ((e, t) => Le(r[e], t));
	return i.optional = (e, t) => e in r ? Le(r[e], t) : void 0, Object.defineProperty(i, "lang", { value: t }), Ie.set(t, i), i;
}
function ze(e) {
	return e.split("|");
}
//#endregion
//#region src/components/bits.ts
var Be = A`<svg
  class="swoosh"
  viewBox="0 0 300 16"
  preserveAspectRatio="none"
  aria-hidden="true"
>
  <path d="M2 13 C 70 5, 190 1, 298 3 L 298 6 C 190 5, 80 9, 4 15 Z" fill="currentColor" />
</svg>`;
function Ve(e, t = "h2", n) {
	let r = ze(e), i = r.length - 1, a = r.map((e, t) => t === i && r.length > 1 ? A`<span class="hl">${e}</span>` : e.endsWith("!") ? A`${e}<br />` : A`${e}`), o = n ? A`<span class="title-tip">${n}</span>` : "";
	return t === "h1" ? A`<h1 class="display">${a}${o}</h1>` : A`<h2 class="display">${a}${o}</h2>`;
}
function He(e, t) {
	let n = t >= .85 ? 4 : t >= .65 ? 3 : t >= .45 ? 2 : 1, r = e(`conf.${n}`);
	return A`<span class="conf" role="img" aria-label=${r} title=${r}>
    ${[
		1,
		2,
		3,
		4
	].map((e) => A`<i class=${e <= n ? "on" : ""}></i>`)}
  </span>`;
}
var Ue = {
	read: "mdi:eye-outline",
	learned: "mdi:auto-fix",
	user: "mdi:account-edit-outline",
	default: "mdi:tune-variant"
};
function We(e, t) {
	let n = t?.source ?? "default";
	return A`<span class="chip ${n}"
    ><ha-icon icon=${Ue[n]}></ha-icon>${e(`source.${n}`)}</span
  >`;
}
function Ge(e, t) {
	let n = {};
	for (let [e, r] of Object.entries(t)) (typeof r == "string" || typeof r == "number") && (n[e] = r);
	return e.optional(`reason.${t.code}`, n) ?? t.code;
}
function Ke(e) {
	history.pushState(null, "", e), window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: !1 } }));
}
function qe(e, t, n) {
	if (!e) return A`<span title=${n ?? ""}>${t}</span>`;
	let r = `/config/devices/device/${e}`;
	return A`<a
    class="ha-link"
    href=${r}
    title=${n ?? ""}
    @click=${(e) => {
		e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0 || (e.preventDefault(), Ke(r));
	}}
    >${t}</a
  >`;
}
//#endregion
//#region src/define.ts
var Je = "0.9.24";
function V(e, t) {
	let n = customElements.get(e);
	if (!n) {
		t.joeVersion = Je, customElements.define(e, t);
		return;
	}
	n.joeVersion !== "0.9.24" && Xe();
}
var Ye = !1;
function Xe() {
	if (Ye || typeof document > "u") return;
	Ye = !0;
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
var Ze = o`
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
  /* On touch screens switch and inputs grow to 44 px; the track still looks 28 px high. */
  @media (pointer: coarse) {
    .switch,
    .switch[aria-checked="true"] {
      height: 44px;
      padding: 8px 0;
      background-clip: content-box;
      border-radius: 14px / 22px;
    }
    .switch::after {
      top: 11px;
    }
    .input {
      min-height: 44px;
    }
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

  /* Navigation building blocks (components/section-chips, ha-open, mirror, used-by) */
  .section-chips {
    position: sticky;
    top: var(--joe-head-h, 0px);
    z-index: 1;
    display: flex;
    gap: 8px;
    margin: -8px 0 16px;
    /* The chips line up with the pages, which are centred at 1100 px. */
    padding: 8px max(0px, calc((100% - 1100px) / 2));
    overflow-x: auto;
    scrollbar-width: none;
    scroll-snap-type: x proximity;
    background: var(--joe-bg);
  }
  .section-chips::-webkit-scrollbar {
    display: none;
  }
  /* A fade at an edge where more chips are hidden: the row scrolls. */
  .section-chips::before,
  .section-chips::after {
    content: "";
    position: sticky;
    z-index: 1;
    flex: none;
    width: 36px;
    align-self: stretch;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s;
  }
  .section-chips::before {
    left: 0;
    order: -1;
    margin-right: -44px;
    background: linear-gradient(to left, transparent, var(--joe-bg));
  }
  .section-chips::after {
    right: 0;
    margin-left: -44px;
    background: linear-gradient(to right, transparent, var(--joe-bg));
  }
  .section-chips[data-more~="left"]::before,
  .section-chips[data-more~="right"]::after {
    opacity: 1;
  }
  .section-chip {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    flex: none;
    min-height: 44px;
    padding: 0 16px 0 12px;
    border-radius: 999px;
    scroll-snap-align: start;
    font-weight: 600;
    font-size: 14px;
    white-space: nowrap;
    text-decoration: none;
    background: var(--joe-surface-2);
    color: var(--joe-ink-2);
    transition: background 0.12s, color 0.12s, transform 0.12s;
  }
  @media (max-width: 400px) {
    .section-chips {
      gap: 6px;
    }
    .section-chip {
      gap: 4px;
      padding: 0 12px 0 9px;
    }
  }
  .section-chip:hover {
    background: var(--joe-line);
    color: var(--joe-ink);
  }
  .section-chip:active {
    transform: scale(0.97);
  }
  .section-chip.on,
  .section-chip.on:hover {
    background: var(--joe-ink);
    color: var(--joe-bg);
  }
  .section-count {
    font-size: 12px;
    opacity: 0.75;
  }
  .section-problem {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--joe-crit);
  }
  .ha-open {
    display: inline-grid;
    place-items: center;
    flex: none;
    width: 44px;
    height: 44px;
    padding: 0;
    border: 1.5px solid var(--joe-line);
    border-radius: 50%;
    background: var(--joe-surface);
    color: var(--joe-ink-2);
    cursor: pointer;
    text-decoration: none;
    transition: border-color 0.12s, color 0.12s, transform 0.12s;
  }
  .ha-open:hover {
    border-color: var(--joe-amber);
    color: var(--joe-ink);
  }
  .ha-open:active {
    transform: scale(0.94);
  }
  .ha-open:focus-visible {
    border-radius: 50%;
  }
  .ha-open ha-icon {
    --mdc-icon-size: 20px;
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
  .mirror {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px 12px;
    padding: 8px 0;
  }
  /* Label · value flow as text, so a value never ends up alone on a line; the button fits beside it on the phone. */
  .mirror-text {
    flex: 1 1 140px;
    min-width: 0;
    line-height: 1.5;
  }
  .mirror-label,
  .mirror-sep {
    color: var(--joe-ink-2);
  }
  .mirror-sep {
    margin-inline: 6px;
  }
  .mirror-text .chip {
    margin-left: 8px;
    vertical-align: middle;
  }
  .mirror-value {
    font-weight: 600;
  }
  .mirror-hint {
    display: block;
    margin-top: 2px;
    font-size: 12.5px;
    color: var(--joe-muted);
  }
  a.mirror-go {
    min-height: 44px;
    text-decoration: none;
  }
  .used-by {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0 14px;
    margin: 8px 0 0;
    padding-block: 6px;
    font-size: 13.5px;
    color: var(--joe-ink-2);
  }
  /* Wider gaps keep the uses apart; the icon and the label stay close to what follows. */
  .used-by-label,
  .used-by ha-icon {
    margin-right: -6px;
  }
  .used-by ha-icon {
    --mdc-icon-size: 16px;
    color: var(--joe-muted);
  }
  .used-by a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    /* 44 px to tap, but wrapped lines stay close together. */
    margin-block: -6px;
    font-weight: 600;
    color: var(--joe-ink);
    text-decoration: underline;
    text-decoration-color: var(--joe-line-2);
    text-underline-offset: 3px;
  }
  .used-by a:hover {
    text-decoration-color: var(--joe-amber);
  }
  .used-by.none {
    min-height: 44px;
  }
  /* Device cards (components/device-card.ts): the main link to Joe's page, the HA button beside it, quick actions below. */
  .dcards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
    gap: 12px;
  }
  .dcard {
    position: relative;
    min-width: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
    gap: 4px 6px;
    padding: 6px 8px 6px 6px;
    border-radius: 14px;
    background: var(--joe-surface);
    box-shadow: inset 0 0 0 1px var(--joe-line);
  }
  .dcard.problem {
    box-shadow: inset 0 0 0 1.5px var(--joe-crit-soft);
  }
  a.dcard-main {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 2px 10px;
    min-height: 44px;
    padding: 8px 6px 8px 8px;
    border-radius: 10px;
    color: inherit;
    text-decoration: none;
    transition: background 0.12s;
  }
  a.dcard-main:hover {
    background: var(--joe-surface-2);
  }
  a.dcard-main > ha-icon {
    --mdc-icon-size: 22px;
    margin-top: 1px;
    color: var(--joe-ink-2);
  }
  .dcard-text {
    min-width: 0;
    display: grid;
    gap: 2px;
  }
  .dcard-name {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 700;
    overflow-wrap: anywhere;
  }
  .dcard-dot {
    flex: none;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--joe-crit);
  }
  .dcard-area {
    color: var(--joe-muted);
    font-size: 13px;
  }
  .dcard-state {
    color: var(--joe-ink-2);
    font-variant-numeric: tabular-nums;
  }
  .dcard-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 2px;
  }
  .dcard-problem {
    color: var(--joe-crit);
    font-size: 13.5px;
  }
  .dcard .ha-open {
    margin-top: 6px;
  }
  .dcard-quick {
    grid-column: 1 / -1;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    padding: 0 8px 8px;
  }
  .dcard-quick:empty {
    display: none;
  }
  /* Head of a group on Geräte › Alle: label, red dot, link to the group page. */
  .group-head {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 22px 0 8px;
  }
  .group-head .group-label {
    margin: 0;
  }
  .group-head .group-go {
    margin-left: auto;
    min-height: 44px;
    text-decoration: none;
  }
  /* "← Speicher" above a device page: a real link to the group. */
  a.back-link {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    padding-inline: 2px 10px;
    font-weight: 600;
    color: var(--joe-ink-2);
    text-decoration: none;
  }
  a.back-link:hover {
    color: var(--joe-ink);
  }
  /* An address with an anchor lights up its target briefly (router.ts revealAnchor). */
  [data-anchor] {
    scroll-margin-top: calc(var(--joe-head-h, 0px) + 72px);
  }
  .flash {
    animation: joe-flash 1.5s ease-out;
  }
  @keyframes joe-flash {
    0%,
    40% {
      box-shadow: 0 0 0 3px var(--joe-amber);
    }
    100% {
      box-shadow: 0 0 0 3px transparent;
    }
  }
`;
//#endregion
//#region \0@oxc-project+runtime@0.152.0/helpers/esm/decorate.js
function H(e, t, n, r) {
	var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, n) : r, o;
	if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(e, t, n, r);
	else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
	return i > 3 && a && Object.defineProperty(t, n, a), a;
}
//#endregion
//#region src/entities.ts
var Qe = [
	"W",
	"kW",
	"MW"
], $e = [
	"Wh",
	"kWh",
	"MWh"
], et = (e) => [
	"binary_sensor",
	"input_boolean",
	"switch",
	"schedule"
].includes(U(e)), tt = {
	power: (e) => U(e) === "sensor" && Qe.includes(W(e)),
	soc: (e) => U(e) === "sensor" && W(e) === "%",
	energy: (e) => U(e) === "sensor" && $e.includes(W(e)),
	price: (e) => [
		"sensor",
		"number",
		"input_number"
	].includes(U(e)) && (e.attributes.device_class === "monetary" || /\/\s*kwh/i.test(W(e))),
	weather: (e) => U(e) === "weather",
	workday: (e) => U(e) === "binary_sensor",
	calendar: (e) => U(e) === "calendar",
	person: (e) => U(e) === "person",
	level: (e) => ["number", "input_number"].includes(U(e)) && W(e) === "%",
	temperature: (e) => [
		"sensor",
		"number",
		"input_number"
	].includes(U(e)) && ["°C", "°F"].includes(W(e)),
	setpoint: (e) => ["number", "input_number"].includes(U(e)),
	toggle: (e) => ["switch", "input_boolean"].includes(U(e)),
	option: (e) => ["select", "input_select"].includes(U(e)),
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
	].includes(U(e)),
	distance: (e) => U(e) === "sensor" && [
		"km",
		"mi",
		"m"
	].includes(W(e)),
	consumption: (e) => U(e) === "sensor" && /kwh\/100|wh\/km|km\/kwh|mi\/kwh/i.test(W(e).replace(/\s/g, "")),
	car_energy: (e) => [
		"sensor",
		"number",
		"input_number"
	].includes(U(e)) && [
		...$e,
		"kJ",
		"MJ"
	].includes(W(e)),
	night: et,
	toggle_like: et,
	presence: (e) => [
		"group",
		"input_boolean",
		"binary_sensor",
		"switch",
		"person",
		"device_tracker"
	].includes(U(e)),
	any: () => !0
};
function U(e) {
	return e.entity_id.split(".", 1)[0];
}
function W(e) {
	return String(e.attributes.unit_of_measurement ?? "");
}
function nt(e, t) {
	return tt[t](e);
}
function rt(e, t) {
	let n = e.states[t]?.attributes.friendly_name;
	return typeof n == "string" && n ? n : t.split(".", 2)[1]?.replace(/_/g, " ") ?? t;
}
function it(e, t) {
	let n = e.entities?.[t], r = n?.device_id ? e.devices?.[n.device_id] : void 0, i = n?.area_id ?? r?.area_id, a = i ? e.areas?.[i]?.name : void 0, o = r?.name_by_user || r?.name || void 0;
	return [o && rt(e, t).toLowerCase().startsWith(o.toLowerCase()) ? void 0 : o, a].filter(Boolean).join(" · ");
}
function G(e, t) {
	if (!t) return null;
	let n = Number.parseFloat(e.states[t]?.state ?? "");
	return Number.isFinite(n) ? n : null;
}
function K(e, t, n) {
	return new Intl.NumberFormat(e, { maximumFractionDigits: n }).format(t);
}
function at(e, t, n) {
	let r = e.states[t];
	if (!r) return "–";
	if (e.formatEntityState) return e.formatEntityState(r);
	let i = G(e, t);
	return i === null ? r.state : `${K(n, i, Math.abs(i) >= 100 ? 0 : Math.abs(i) >= 10 ? 1 : 2)} ${W(r)}`.trim();
}
function ot(e, t) {
	return t === "W" ? e / 1e3 : t === "MW" ? e * 1e3 : e;
}
function st(e, t) {
	if (!t) return null;
	let n = G(e, t.entity_id);
	if (n === null) return null;
	let r = ot(n, W(e.states[t.entity_id]));
	if (t.invert && (r = -r), t.minus_entity_id) {
		let n = G(e, t.minus_entity_id);
		if (n === null) return null;
		r -= ot(n, W(e.states[t.minus_entity_id]));
	}
	return r;
}
function ct(e, t) {
	let n = G(e, t);
	if (n === null || !t) return null;
	let r = W(e.states[t]);
	return r === "Wh" ? n / 1e3 : r === "MWh" ? n * 1e3 : n;
}
function lt(e, t) {
	let n = t.map((t) => st(e, t)).filter((e) => e !== null);
	return n.length ? n.reduce((e, t) => e + t, 0) : null;
}
//#endregion
//#region src/components/tip.ts
var ut = 120, dt = 220, ft = 8, pt = 10, q, J = class extends L {
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
		return e ? A`<button
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
        ${mt(e.text)}
        ${e.facts?.length ? A`<dl>${e.facts.map(([e, t]) => A`<dt>${e}</dt><dd>${t}</dd>`)}</dl>` : M}
        <span class="arrow"></span>
      </div>` : M;
	}
	show(e = !1) {
		this.cancelTimer(), this.pinned = this.pinned || e, !this.open && (q && q !== this && q.close(), q = this, this.open = !0, window.addEventListener("pointerdown", this.onOutside, !0), window.addEventListener("keydown", this.onKey, !0), this.updateComplete.then(() => {
			let e = this.bubble;
			this.open && e && (typeof e.showPopover == "function" && !e.matches(":popover-open") && e.showPopover(), this.follow());
		}));
	}
	close() {
		this.cancelTimer(), this.pinned = !1, this.frame !== void 0 && (cancelAnimationFrame(this.frame), this.frame = void 0), window.removeEventListener("pointerdown", this.onOutside, !0), window.removeEventListener("keydown", this.onKey, !0);
		let e = this.bubble;
		e && typeof e.hidePopover == "function" && e.matches(":popover-open") && e.hidePopover(), q === this && (q = void 0), this.open = !1;
	}
	onClick() {
		this.open && this.pinned ? this.close() : this.show(!0);
	}
	onEnter(e) {
		e.pointerType === "mouse" && (this.cancelTimer(), this.open || (this.timer = window.setTimeout(() => this.show(), ut)));
	}
	onLeave(e) {
		e.pointerType === "mouse" && (this.cancelTimer(), this.open && !this.pinned && (this.timer = window.setTimeout(() => this.close(), dt)));
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
		let r = t.getBoundingClientRect(), i = document.documentElement.clientWidth, a = n.top - r.height - pt, o = "top";
		a < ft && (a = n.bottom + pt, o = "bottom");
		let s = n.left + n.width / 2, c = Math.max(ft, Math.min(s - r.width / 2, i - r.width - ft)), l = Math.max(14, Math.min(s - c, r.width - 14));
		t.style.left = `${Math.round(c)}px`, t.style.top = `${Math.round(a)}px`, t.style.setProperty("--arrow", `${Math.round(l)}px`), t.dataset.place = o;
	}
};
H([R({ attribute: !1 })], J.prototype, "tip", void 0), H([R()], J.prototype, "label", void 0), H([z()], J.prototype, "open", void 0), H([B("button")], J.prototype, "button", void 0), H([B(".bubble")], J.prototype, "bubble", void 0);
function mt(e) {
	return e.split("\n").map((e) => A`<p>
        ${e.split(/\*\*(.+?)\*\*/).map((e, t) => t % 2 ? A`<strong>${e}</strong>` : e)}
      </p>`);
}
function ht(e, t, n, r = []) {
	let i = e.optional(`tip.${t}.hint`, n);
	return {
		heading: e(`tip.${t}.title`, n),
		text: e(`tip.${t}.text`, n),
		facts: i ? [...r, [e("tip.hint"), i]] : r
	};
}
function Y(e, t, n, r) {
	return A`<joe-tip .tip=${ht(e, t, n, r)} label=${e("tip.label")}></joe-tip>`;
}
V("joe-tip", J);
//#endregion
//#region src/cars.ts
function gt(e, t) {
	return {
		tab: "devices",
		section: "car",
		id: e,
		sub: t
	};
}
function _t(e) {
	return {
		tab: "devices",
		section: "car",
		id: "point",
		sub: e
	};
}
function vt(e, t) {
	return t ? e.cars?.find((e) => e.id === t) : void 0;
}
function yt(e, t) {
	let n = t.point?.cars;
	return (e.cars ?? []).filter((e) => n == null || n.includes(e.id));
}
function bt(e, t) {
	return e?.cars?.points?.[t];
}
function X(e, t) {
	let n = e?.cars?.cars?.[t]?.point;
	return n ? e?.config.actions.find((e) => e.id === n) : void 0;
}
function xt(e, t, n) {
	return e?.cars?.cars?.[t]?.values?.[n];
}
function St(e, t) {
	return t.kind === "evcc" ? "evcc" : t.kind === "manual" ? e("car.source.manual") : t.platform && e.optional(`car.platform.${t.platform}`) || t.name || t.platform || e("car.source.car");
}
function Ct(e, t, n) {
	let r = X(t, n.id);
	if (r) return e("car.plugged_at", { point: r.name });
	let i = t.cars?.cars?.[n.id]?.plugged;
	return e(i ? "car.plugged_elsewhere" : "car.not_plugged");
}
function wt(e, t, n) {
	let r = bt(t, n.id);
	return r ? r.state === "car" ? e("point.state.car", {
		car: vt(t.config, r.car)?.name ?? r.car ?? "",
		how: e(`point.how.${r.how ?? "home"}`)
	}) : e(`point.state.${r.state}`) : e("point.state.none");
}
function Tt(e, t) {
	return e?.plan?.cars?.[t];
}
function Et(e) {
	return `car:${e.device_id ?? e.id}`;
}
function Dt(e, t) {
	let n = new Set(e.answers.ignored);
	return (t?.car_sources ?? []).map((t) => ({
		source: t,
		car: (e.cars ?? []).find((e) => e.sources.some((e) => e.id === t.id)),
		ignored: n.has(Et(t)) || n.has(`car:${t.id}`)
	}));
}
//#endregion
//#region src/components/plan-text.ts
function Z(e) {
	return e ? e.slice(11, 16) : "";
}
function Ot(e) {
	return e.slice(0, 10);
}
function kt(e) {
	switch (e?.kind) {
		case "charge": return "plug";
		case "hold": return "switch";
		case "none": return "relax";
		default: return "sleep";
	}
}
function At(e) {
	return (e.charge_slots ?? []).map((e) => `${Z(e.start)}–${Z(e.end)}`).join(", ");
}
function jt(e, t) {
	if (!t.window) return "";
	let n = [`${Z(t.window.start)}–${Z(t.window.end)}`];
	return t.prices && n.push(`${K(e.lang, t.prices.night * 100, 1)} ct/kWh`), n.join(" · ");
}
function Mt(e, t) {
	if (t.kind === "unavailable") {
		let n = t.reasons.find((t) => e.optional(`plan.why.${t}`)) ?? "failed";
		return e.optional(`plan.why.${n}`) ?? "";
	}
	let n = [], r = K(e.lang, t.target ?? 0, 0), i = t.sun_takes_over;
	if (t.reasons.includes("balance") && n.push(e("plan.say.balance")), t.kind === "charge" && t.tariff === "dynamic" && t.charge_slots?.length ? n.push(e("plan.say.charge_slots", {
		slots: At(t),
		target: r
	})) : t.kind === "charge" ? n.push(e("plan.say.charge", {
		from: Z(t.charge_from),
		target: r
	})) : t.kind === "hold" ? (n.push(e("plan.say.hold", { target: r })), t.empty_without && n.push(e("plan.say.empty", { time: Z(t.empty_without) }))) : t.reasons.includes("small_saving") ? n.push(e("plan.say.small_saving")) : n.push(i ? e("plan.say.none", { time: Z(i) }) : e("plan.say.none_nosun")), t.reasons.includes("max_price") && t.kind !== "charge" && n.push(e("plan.say.max_price")), t.day) {
		let r = {
			time: Z(t.day.defer_until),
			kwh: K(e.lang, t.day.held_kwh, 0)
		}, i = t.day.buffer;
		n.push(i && i.soc > i.floor ? e("plan.day.buffer", {
			...r,
			level: K(e.lang, i.soc, 0)
		}) : e("plan.day", r)), t.day.cost && t.day.cost >= .01 && n.push(e("plan.day.cost", { cost: `${K(e.lang, t.day.cost * 100, 0)} ct` }));
	}
	return t.kind !== "none" && (i && t.full_at && Ot(t.full_at) === Ot(i) ? n.push(e("plan.say.sun_full", {
		sun: Z(i),
		full: Z(t.full_at)
	})) : i ? n.push(e("plan.say.sun", { sun: Z(i) })) : n.push(e("plan.say.nosun"))), n.join(" ");
}
function Nt(e, t) {
	return (t.batteries ?? []).map((n) => {
		let r = [n.name];
		return t.kind === "charge" ? r.push(`${K(e.lang, n.soc_start, 0)} → ${K(e.lang, n.target, 0)} %`, `${K(e.lang, n.charge_kwh, 1)} kWh`, `${K(e.lang, n.power_kw, 1)} kW`) : t.kind === "hold" ? r.push(e("plan.line.hold", { target: K(e.lang, n.target, 0) })) : r.push(e("plan.line.now", { soc: K(e.lang, n.soc, 0) })), n.controllable || r.push(e("plan.line.watch_only")), r.join(" · ");
	});
}
function Pt(e, t, n = "EUR") {
	if (!t.cost) return "";
	let r = (t) => new Intl.NumberFormat(e.lang, {
		style: "currency",
		currency: n
	}).format(t), i = [];
	return t.kind === "charge" && i.push(e("plan.cost.night", { value: r(t.cost.night_charge) })), t.cost.saving > .005 && i.push(e("plan.cost.saving", { value: r(t.cost.saving) })), i.join(" · ");
}
function Ft(e, t) {
	let n = t?.morning?.day ?? t?.day, r = n ? Z(n.defer_until) : "–", i = n?.buffer;
	return i && i.soc > i.floor ? e("devices.status.day_buffer", {
		time: r,
		level: String(i.soc)
	}) : e("devices.status.day", { time: r });
}
//#endregion
//#region src/router.ts
var It = "/energy-joe", Lt = [
	"overview",
	"plan",
	"review",
	"devices",
	"household",
	"settings"
], Rt = [
	"overview",
	"plan",
	"review"
], zt = {
	review: [
		"result",
		"days",
		"learned",
		"log"
	],
	devices: [
		"all",
		"battery",
		"climate",
		"car",
		"hot_water",
		"other",
		"grid",
		"add"
	],
	household: [
		"people",
		"presence",
		"days",
		"night",
		"travel"
	],
	settings: [
		"operation",
		"rules",
		"notify",
		"maintenance",
		"about"
	]
}, Q = {
	review: "result",
	devices: "all",
	household: "people",
	settings: "operation"
}, Bt = {
	history: "/review/days",
	learn: "/review/learned",
	climate: "/devices/climate"
};
function Vt(e) {
	return e in zt;
}
function Ht(e) {
	try {
		return decodeURIComponent(e);
	} catch {
		return e;
	}
}
function Ut(e) {
	let t = e.split(/[?#]/, 1)[0].split("/").filter(Boolean).map(Ht), [n, r, i, a, ...o] = t;
	if (!n) return { route: { tab: "overview" } };
	let s = Bt[n];
	if (s) {
		let e = [s, ...t.slice(1).map(encodeURIComponent)].join("/");
		return {
			route: Ut(e).route,
			redirect: e
		};
	}
	if (n === "plan") return t.length > 1 ? {
		route: { tab: "plan" },
		redirect: "/plan"
	} : { route: { tab: "plan" } };
	let c = n;
	if (!Lt.includes(c) || !Vt(c)) return {
		route: { tab: "overview" },
		redirect: "/"
	};
	if (r && !zt[c].includes(r)) return {
		route: {
			tab: c,
			section: Q[c]
		},
		redirect: `/${c}`
	};
	let l = {
		tab: c,
		section: r ?? Q[c]
	};
	return i && (l.id = i), a && (l.sub = a), o.length && (l.rest = o), { route: l };
}
function Wt(e) {
	if (typeof e == "string") return e.startsWith("/") ? e : `/${e}`;
	if (e.tab === "overview") return "/";
	let t = [e.tab], n = e.section ?? (e.id && Vt(e.tab) ? Q[e.tab] : void 0);
	return n && (t.push(n), e.id && (t.push(e.id), e.sub && t.push(e.sub, ...e.rest ?? []))), `/${t.map(encodeURIComponent).join("/")}`;
}
function Gt(e, t) {
	let n = Wt(t);
	return n === "/" ? e : `${e}${n}`;
}
function Kt(e, t, n = {}) {
	e.dispatchEvent(new CustomEvent("joe-navigate", {
		detail: {
			path: Wt(t),
			...n
		},
		bubbles: !0,
		composed: !0
	}));
}
function qt(e, t) {
	return (n) => {
		n.defaultPrevented || n.metaKey || n.ctrlKey || n.shiftKey || n.altKey || n.button !== 0 || (n.preventDefault(), Kt(n.currentTarget ?? window, e, t));
	};
}
function Jt(e, t, n, r) {
	return A`<a class=${r ?? ""} href=${Gt(e, t)} @click=${qt(t)}>${n}</a>`;
}
function Yt(e, t) {
	if (history.state?.joeSheet) {
		history.back();
		return;
	}
	Kt(e, t, { replace: !0 });
}
function Xt(e, t) {
	let n = e.querySelector(`[data-anchor="${CSS.escape(t)}"]`);
	return n ? (n.scrollIntoView({
		block: "start",
		behavior: "smooth"
	}), n.classList.remove("flash"), n.offsetWidth, n.classList.add("flash"), window.setTimeout(() => n.classList.remove("flash"), 1500), Zt(n), !0) : !1;
}
function Zt(e) {
	let t = !1, n = () => {
		t = !0;
	}, r = [
		"wheel",
		"touchstart",
		"keydown",
		"pointerdown"
	];
	r.forEach((e) => window.addEventListener(e, n, {
		passive: !0,
		once: !0
	}));
	let i = (i) => {
		let a = parseFloat(getComputedStyle(e).scrollMarginTop) || 0;
		!t && e.isConnected && Math.abs(e.getBoundingClientRect().top - a) > 24 && e.scrollIntoView({ block: "start" }), i && r.forEach((e) => window.removeEventListener(e, n));
	};
	window.setTimeout(() => i(!1), 900), window.setTimeout(() => i(!0), 2200);
}
//#endregion
//#region src/components/car-charge.ts
var $ = class extends L {
	constructor(...e) {
		super(...e), this.flush = !1, this.values = {}, this.failed = !1;
	}
	static {
		this.styles = [Ze, o`
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
      :host([flush]) .boost {
        margin-top: 0;
        padding-top: 0;
        border-top: 0;
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
      @media (pointer: coarse) {
        .boost .input {
          min-height: 44px;
        }
      }
      .boost .unit {
        color: var(--joe-ink-2);
      }
      .boost .plus {
        color: var(--joe-ink-2);
        white-space: nowrap;
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
      p.boost.off {
        color: var(--joe-ink-2);
        flex-wrap: nowrap;
      }
      p.boost.off span {
        flex: 1;
      }
    `];
	}
	render() {
		return A`${this.renderBody()}
    ${this.failed && this.t ? A`<p class="bad" role="status">${this.t("devices.charge.failed")}</p>` : M}`;
	}
	renderBody() {
		let { t: e, state: t, car: n } = this;
		if (!e || !t || !n) return M;
		let r = X(t, n.id);
		if (!r) return A`<p class="boost off" data-tipped>
        <ha-icon icon="mdi:power-plug-off-outline"></ha-icon>
        <span>${e("devices.charge.not_plugged", { car: n.name })}</span>
        ${Y(e, "boost")}
      </p>`;
		let i = t.plan?.window?.start, a = !!i && t.control?.tonight?.[r.id] === i, o = t.control?.boost?.[r.id], s = t.control?.actions?.[r.id], c = t.control?.tonight_target?.[r.id], l = n.need, u = t.cars?.cars?.[n.id]?.values ?? {}, d = bt(t, r.id), f = (t, n, r) => r === "km" ? e("devices.charge.km", {
			target: K(e.lang, t, 0),
			reserve: K(e.lang, n - t, 0)
		}) : e("devices.charge.percent", { target: K(e.lang, t, 0) });
		if (o) {
			let t = s?.value;
			return A`<div class="boost on" data-tipped>
        <span>
          ${e("devices.charge.now_running", {
				amount: f(o.chosen, o.target, o.unit),
				now: t == null ? "–" : `${K(e.lang, t, 0)} ${o.unit}`
			})}
        </span>
        <button type="button" class="mini-btn quiet" @click=${() => this.boost(null)}>${e("devices.boost.stop")}</button>
        ${Y(e, "boost")}
      </div>`;
		}
		if (a) {
			let t = c && c.night === i ? c : null;
			return A`<div class="boost on" data-tipped>
        <span>
          ${s?.reason === "reached" ? e(t ? "devices.charge.tonight_done" : "devices.action.reached_plain", { amount: t ? f(t.chosen, t.target, t.unit) : "" }) : t ? e("devices.charge.tonight_set", { amount: f(t.chosen, t.target, t.unit) }) : e("devices.charge.tonight_window")}
        </span>
        <button type="button" class="mini-btn quiet" @click=${() => this.tonight(!1)}>${e("devices.boost.stop")}</button>
        ${Y(e, "boost")}
      </div>`;
		}
		let p = [...u.soc ? ["%"] : [], ...u.range ? ["km"] : []];
		if (!p.length) return A`<p class="boost off">${e("devices.charge.no_level", { car: n.name })}</p>`;
		let m = this.unit && p.includes(this.unit) ? this.unit : p[0], h = this.values[m] ?? (m === "%" ? 80 : 200), g = m === "%" ? 100 : 1500, _ = (e) => {
			let t = e?.querySelector("input"), n = Number.parseFloat((t?.value ?? "").replace(",", "."));
			return Math.round(Math.min(g, Math.max(1, Number.isFinite(n) ? n : h)));
		};
		return A`<form
      class="boost"
      data-tipped
      novalidate
      @submit=${(e) => {
			e.preventDefault(), this.boost(_(e.target), m);
		}}
    >
      <label class="toggle-label" for="boost-${r.id}">${e("devices.charge.label_at", { point: r.name })}</label>
      <span class="amount">
        <input
          id="boost-${r.id}"
          class="input"
          type="number"
          inputmode="numeric"
          min=${m === "%" ? 5 : 10}
          max=${g}
          step=${m === "%" ? 5 : 10}
          .value=${String(h)}
          @change=${(e) => {
			let t = Number.parseFloat(e.target.value.replace(",", "."));
			Number.isFinite(t) && t >= 1 && (this.values = {
				...this.values,
				[m]: Math.min(t, g)
			});
		}}
        />
        ${p.length > 1 ? A`<span class="seg unit-seg" role="group" aria-label=${e("devices.boost.unit")}>
              ${p.map((e) => A`<button
                  type="button"
                  aria-pressed=${String(e === m)}
                  @click=${() => this.unit = e}
                >
                  ${e}
                </button>`)}
            </span>` : A`<span class="unit">${m}</span>`}
        ${m === "km" ? A`<span class="plus">${e("devices.charge.plus_reserve", { reserve: K(e.lang, l.reserve_km ?? 50, 0) })}</span>` : M}
      </span>
      ${Y(e, "boost")}
      <span class="charge-buttons">
        <button type="submit" class="mini-btn go" ?disabled=${t.mode === "off" || !r.enabled}>
          <ha-icon icon="mdi:ev-plug-type2"></ha-icon>${e("devices.charge.now")}
        </button>
        <button
          type="button"
          class="mini-btn"
          ?disabled=${!i || !r.enabled}
          @click=${(e) => this.tonight(!0, _(e.target.closest("form")), m)}
        >
          <ha-icon icon="mdi:weather-night"></ha-icon>${e("devices.charge.tonight")}
        </button>
      </span>
      ${m === "km" ? A`<small class="hint">${e("devices.boost.reserve")}</small>` : M}
      ${d?.how === "assume" || d?.how === "home" ? A`<small class="hint">${e("devices.charge.guessed", { point: r.name })}</small>` : M}
      ${i ? M : A`<small class="hint">${e("devices.charge.no_night")}</small>`}
    </form>`;
	}
	get point() {
		return this.car ? X(this.state, this.car.id)?.id : void 0;
	}
	async boost(e, t = "%") {
		await this.call({
			type: "energy_joe/control/boost",
			action_id: this.point,
			target: e,
			unit: t
		});
	}
	async tonight(e, t, n) {
		await this.call({
			type: "energy_joe/control/action_tonight",
			action_id: this.point,
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
H([R({ attribute: !1 })], $.prototype, "hass", void 0), H([R({ attribute: !1 })], $.prototype, "t", void 0), H([R({ attribute: !1 })], $.prototype, "state", void 0), H([R({ attribute: !1 })], $.prototype, "car", void 0), H([R({
	type: Boolean,
	reflect: !0
})], $.prototype, "flush", void 0), H([z()], $.prototype, "values", void 0), H([z()], $.prototype, "unit", void 0), H([z()], $.prototype, "failed", void 0), V("joe-car-charge", $);
//#endregion
//#region src/styles/tokens.ts
var Qt = o`
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
export { Ge as $, xt as A, nt as B, yt as C, Ct as D, Et as E, St as F, lt as G, at as H, Y as I, V as J, H as K, ct as L, _t as M, bt as N, X as O, wt as P, Ke as Q, rt as R, jt as S, Dt as T, st as U, K as V, G as W, qe as X, He as Y, Ve as Z, Nt as _, Lt as a, R as at, At as b, Wt as c, j as ct, Kt as d, ge as dt, We as et, qt as f, o as ft, Pt as g, Ft as h, zt as i, z as it, Tt as j, gt as k, Gt as l, A as lt, Xt as m, Q as n, Re as nt, Rt as o, L as ot, Ut as p, Ze as q, It as r, B as rt, Yt as s, M as st, Qt as t, Be as tt, Jt as u, Ee as ut, kt as v, vt as w, Z as x, Mt as y, it as z };
